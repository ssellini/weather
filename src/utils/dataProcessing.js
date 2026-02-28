export function processWeatherData(rawData) {
  if (!rawData?.daily?.time?.length) return null;

  const { daily } = rawData;
  const days = daily.time.map((date, i) => ({
    date,
    year: parseInt(date.substring(0, 4)),
    month: parseInt(date.substring(5, 7)) - 1,
    day: parseInt(date.substring(8, 10)),
    tempMax: daily.temperature_2m_max[i],
    tempMin: daily.temperature_2m_min[i],
    tempMean: daily.temperature_2m_mean[i],
    precipitation: daily.precipitation_sum[i],
    windMax: daily.windspeed_10m_max[i],
    weatherCode: daily.weathercode[i],
  }));

  return days;
}

export function computeMonthlyAverages(days) {
  const monthlyMap = {};

  for (const day of days) {
    const key = `${day.year}-${day.month}`;
    if (!monthlyMap[key]) {
      monthlyMap[key] = {
        year: day.year,
        month: day.month,
        tempMeanSum: 0,
        tempMaxSum: 0,
        tempMinSum: 0,
        precipSum: 0,
        windMaxMax: 0,
        count: 0,
      };
    }
    const m = monthlyMap[key];
    if (day.tempMean != null) { m.tempMeanSum += day.tempMean; m.count++; }
    if (day.tempMax != null) m.tempMaxSum += day.tempMax;
    if (day.tempMin != null) m.tempMinSum += day.tempMin;
    if (day.precipitation != null) m.precipSum += day.precipitation;
    if (day.windMax != null) m.windMaxMax = Math.max(m.windMaxMax, day.windMax);
  }

  return Object.values(monthlyMap).map((m) => ({
    year: m.year,
    month: m.month,
    tempMean: m.count > 0 ? m.tempMeanSum / m.count : null,
    tempMax: m.count > 0 ? m.tempMaxSum / m.count : null,
    tempMin: m.count > 0 ? m.tempMinSum / m.count : null,
    precipitation: m.precipSum,
    windMax: m.windMaxMax,
    count: m.count,
  }));
}

export function computeYearlyAverages(days) {
  const yearlyMap = {};

  for (const day of days) {
    if (!yearlyMap[day.year]) {
      yearlyMap[day.year] = {
        year: day.year,
        tempMeanSum: 0,
        precipSum: 0,
        windMaxMax: 0,
        count: 0,
        frostDays: 0,
        heatDays: 0,
        rainDays: 0,
      };
    }
    const y = yearlyMap[day.year];
    if (day.tempMean != null) { y.tempMeanSum += day.tempMean; y.count++; }
    if (day.precipitation != null) { y.precipSum += day.precipitation; if (day.precipitation > 0.1) y.rainDays++; }
    if (day.windMax != null) y.windMaxMax = Math.max(y.windMaxMax, day.windMax);
    if (day.tempMin != null && day.tempMin <= 0) y.frostDays++;
    if (day.tempMax != null && day.tempMax >= 35) y.heatDays++;
  }

  return Object.values(yearlyMap).map((y) => ({
    year: y.year,
    tempMean: y.count > 0 ? y.tempMeanSum / y.count : null,
    precipitation: y.precipSum,
    windMax: y.windMaxMax,
    frostDays: y.frostDays,
    heatDays: y.heatDays,
    rainDays: y.rainDays,
    count: y.count,
  }));
}

export function computeRecords(days) {
  let hottestDay = null;
  let coldestDay = null;
  let rainiestDay = null;
  let windiestDay = null;

  for (const day of days) {
    if (day.tempMax != null && (!hottestDay || day.tempMax > hottestDay.tempMax)) hottestDay = day;
    if (day.tempMin != null && (!coldestDay || day.tempMin < coldestDay.tempMin)) coldestDay = day;
    if (day.precipitation != null && (!rainiestDay || day.precipitation > rainiestDay.precipitation)) rainiestDay = day;
    if (day.windMax != null && (!windiestDay || day.windMax > windiestDay.windMax)) windiestDay = day;
  }

  return { hottestDay, coldestDay, rainiestDay, windiestDay };
}

export function computeOverallStats(days, yearlyAverages) {
  if (!days.length) return null;

  const validTemps = days.filter((d) => d.tempMean != null);
  const avgTemp = validTemps.length > 0
    ? validTemps.reduce((s, d) => s + d.tempMean, 0) / validTemps.length
    : null;

  const records = computeRecords(days);

  const rainiestYear = yearlyAverages.reduce((max, y) => (y.precipitation > (max?.precipitation ?? 0) ? y : max), null);

  // Trend: linear regression on yearly averages
  let trend = null;
  if (yearlyAverages.length >= 2) {
    const n = yearlyAverages.length;
    const xs = yearlyAverages.map((y) => y.year);
    const ys = yearlyAverages.map((y) => y.tempMean);
    const mx = xs.reduce((a, b) => a + b) / n;
    const my = ys.reduce((a, b) => a + b) / n;
    const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
    const den = xs.reduce((s, x) => s + (x - mx) ** 2, 0);
    const slope = den !== 0 ? num / den : 0;
    const totalChange = slope * (xs[xs.length - 1] - xs[0]);
    trend = { slope, totalChange, perDecade: slope * 10 };
  }

  return {
    avgTemp,
    records,
    rainiestYear,
    trend,
  };
}

export function getMonthlyDataForChart(monthlyAverages, years) {
  // Build one entry per month (0-11), with each year as a separate field
  const data = Array.from({ length: 12 }, (_, i) => {
    const entry = { month: i };
    for (const year of years) {
      const m = monthlyAverages.find((ma) => ma.year === year && ma.month === i);
      entry[`temp_${year}`] = m?.tempMean ?? null;
      entry[`precip_${year}`] = m?.precipitation ?? null;
      entry[`tempMax_${year}`] = m?.tempMax ?? null;
      entry[`tempMin_${year}`] = m?.tempMin ?? null;
    }
    return entry;
  });
  return data;
}
