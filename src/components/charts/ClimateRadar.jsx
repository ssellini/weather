import { useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { getYearColor } from '../../utils/formatters';

const T = {
  fr: {
    title: 'Profil climatique annuel',
    tempMean: 'Temp. moy.',
    precip: 'Précip.',
    wind: 'Vent max',
    frost: 'Jours gel',
    heat: 'Jours canicule',
    rain: 'Jours pluie',
  },
  en: {
    title: 'Annual climate profile',
    tempMean: 'Avg temp',
    precip: 'Precip.',
    wind: 'Max wind',
    frost: 'Frost days',
    heat: 'Heat days',
    rain: 'Rain days',
  },
};

function normalize(value, max) {
  if (max === 0) return 0;
  return Math.min((value / max) * 100, 100);
}

export default function ClimateRadar({ yearlyAverages, years, lang }) {
  const t = T[lang] || T.fr;

  const data = useMemo(() => {
    if (!yearlyAverages?.length) return [];
    const selected = yearlyAverages.filter((y) => years.includes(y.year));
    if (!selected.length) return [];

    // Compute max for normalization
    const maxTemp = Math.max(...selected.map((y) => Math.abs(y.tempMean || 0)), 1);
    const maxPrecip = Math.max(...selected.map((y) => y.precipitation || 0), 1);
    const maxWind = Math.max(...selected.map((y) => y.windMax || 0), 1);
    const maxFrost = Math.max(...selected.map((y) => y.frostDays || 0), 1);
    const maxHeat = Math.max(...selected.map((y) => y.heatDays || 0), 1);
    const maxRain = Math.max(...selected.map((y) => y.rainDays || 0), 1);

    const metrics = [
      { key: 'tempMean', label: t.tempMean, max: maxTemp },
      { key: 'precipitation', label: t.precip, max: maxPrecip },
      { key: 'windMax', label: t.wind, max: maxWind },
      { key: 'frostDays', label: t.frost, max: maxFrost },
      { key: 'heatDays', label: t.heat, max: maxHeat },
      { key: 'rainDays', label: t.rain, max: maxRain },
    ];

    return metrics.map((metric) => {
      const entry = { metric: metric.label };
      for (const y of selected) {
        const val = metric.key === 'tempMean' ? Math.abs(y[metric.key] || 0) : (y[metric.key] || 0);
        entry[`year_${y.year}`] = normalize(val, metric.max);
      }
      return entry;
    });
  }, [yearlyAverages, years, t]);

  const displayYears = years.filter((y) => yearlyAverages.some((ya) => ya.year === y)).slice(0, 5);

  if (!data.length) return null;

  return (
    <ChartWrapper title={t.title}>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="metric"
            stroke="#6b7280"
            fontSize={11}
            fontFamily="DM Sans"
          />
          <PolarRadiusAxis stroke="rgba(255,255,255,0.1)" fontSize={10} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(10,14,26,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          />
          <Legend />
          {displayYears.map((year, i) => (
            <Radar
              key={year}
              name={`${year}`}
              dataKey={`year_${year}`}
              stroke={getYearColor(i)}
              fill={getYearColor(i)}
              fillOpacity={0.15}
              strokeWidth={2}
              animationDuration={800}
              animationBegin={i * 150}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
