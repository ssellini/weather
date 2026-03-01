import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';
import ChartWrapper from './ChartWrapper';

const T = {
  fr: { title: 'Précipitations totales par année', avg: 'Moyenne' },
  en: { title: 'Total precipitation by year', avg: 'Average' },
};

export default function YearlyPrecipChart({ yearlyAverages, lang }) {
  const t = T[lang] || T.fr;

  const { data, avg } = useMemo(() => {
    if (!yearlyAverages?.length) return { data: [], avg: 0 };
    const d = yearlyAverages.map((y) => ({
      year: y.year,
      precipitation: parseFloat(y.precipitation.toFixed(1)),
    }));
    const a = d.reduce((s, y) => s + y.precipitation, 0) / d.length;
    return { data: d, avg: a };
  }, [yearlyAverages]);

  if (!data.length) return null;

  const maxPrecip = Math.max(...data.map((d) => d.precipitation));

  return (
    <ChartWrapper title={t.title}>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="year"
            stroke="#6b7280"
            fontSize={12}
            fontFamily="JetBrains Mono"
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            fontFamily="JetBrains Mono"
            tickFormatter={(v) => `${v}mm`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(6,9,24,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontFamily: 'JetBrains Mono',
              fontSize: '12px',
            }}
            formatter={(value) => [`${value} mm`, null]}
          />
          <ReferenceLine
            y={avg}
            stroke="rgba(255,255,255,0.3)"
            strokeDasharray="8 4"
            label={{
              value: `${t.avg}: ${avg.toFixed(0)}mm`,
              position: 'insideTopRight',
              fill: '#9ca3af',
              fontSize: 11,
              fontFamily: 'JetBrains Mono',
            }}
          />
          <Bar
            dataKey="precipitation"
            radius={[6, 6, 0, 0]}
            animationDuration={800}
          >
            {data.map((entry) => {
              const intensity = entry.precipitation / maxPrecip;
              let color;
              if (intensity < 0.3) color = '#60a5fa';
              else if (intensity < 0.6) color = '#3b82f6';
              else if (intensity < 0.8) color = '#2563eb';
              else color = '#7c3aed';
              return <Cell key={entry.year} fill={color} fillOpacity={0.8} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
