const dataCache = new Map();

function getCacheKey(lat, lon, startDate, endDate) {
  return `${lat.toFixed(4)}_${lon.toFixed(4)}_${startDate}_${endDate}`;
}

export async function searchCities(query, lang = 'fr') {
  if (!query || query.length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=${lang}&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding request failed');
  const data = await res.json();
  return data.results || [];
}

export async function fetchWeatherData(lat, lon, startDate, endDate) {
  const key = getCacheKey(lat, lon, startDate, endDate);
  if (dataCache.has(key)) return dataCache.get(key);

  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,windspeed_10m_max,weathercode&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const data = await res.json();
  dataCache.set(key, data);
  return data;
}

export async function fetchWeatherRange(lat, lon, startYear, endYear, onProgress) {
  const chunks = [];
  const chunkSize = 3;

  for (let y = startYear; y <= endYear; y += chunkSize) {
    const endChunkYear = Math.min(y + chunkSize - 1, endYear);
    chunks.push({
      startDate: `${y}-01-01`,
      endDate: `${endChunkYear}-12-31`,
    });
  }

  // Limit end date to 5 days ago
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const maxDate = fiveDaysAgo.toISOString().split('T')[0];
  const lastChunk = chunks[chunks.length - 1];
  if (lastChunk.endDate > maxDate) {
    lastChunk.endDate = maxDate;
  }

  let completed = 0;
  const total = chunks.length;

  const results = await Promise.all(
    chunks.map(async (chunk) => {
      const data = await fetchWeatherData(lat, lon, chunk.startDate, chunk.endDate);
      completed++;
      if (onProgress) onProgress(completed / total);
      return data;
    })
  );

  // Merge all results
  const merged = {
    daily: {
      time: [],
      temperature_2m_max: [],
      temperature_2m_min: [],
      temperature_2m_mean: [],
      precipitation_sum: [],
      windspeed_10m_max: [],
      weathercode: [],
    },
    daily_units: results[0]?.daily_units || {},
  };

  for (const result of results) {
    if (!result?.daily?.time) continue;
    merged.daily.time.push(...result.daily.time);
    merged.daily.temperature_2m_max.push(...result.daily.temperature_2m_max);
    merged.daily.temperature_2m_min.push(...result.daily.temperature_2m_min);
    merged.daily.temperature_2m_mean.push(...result.daily.temperature_2m_mean);
    merged.daily.precipitation_sum.push(...result.daily.precipitation_sum);
    merged.daily.windspeed_10m_max.push(...result.daily.windspeed_10m_max);
    merged.daily.weathercode.push(...result.daily.weathercode);
  }

  return merged;
}
