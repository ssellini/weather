import { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import ChartWrapper from './ChartWrapper';

const T = {
  fr: {
    title: 'Tendance climatique — Température moyenne annuelle',
    avgTemp: 'Temp. moyenne',
    trend: 'Tendance',
    precip: 'Précipitations',
  },
  en: {
    title: 'Climate trend — Annual average temperature',
    avgTemp: 'Avg. temp.',
    trend: 'Trend',
    precip: 'Precipitation',
  },
};

export default function TrendLine({ yearlyAverages, trendData, lang }) {
  const t = T[lang] || T.fr;

  const data = useMemo(() => {
    if (!yearlyAverages?.length) return [];
    return yearlyAverages.map((y) => ({
      year: y.year,
      tempMean: y.tempMean != null ? parseFloat(y.tempMean.toFixed(2)) : null,
      precipitation: parseFloat(y.precipitation.toFixed(0)),
    }));
  }, [yearlyAverages]);

  const trendLine = useMemo(() => {
    if (!trendData || !yearlyAverages?.length) return null;
    const firstYear = yearlyAverages[0].year;
    const baseTemp = yearlyAverages[0].tempMean;
    return data.map((d) => ({
      ...d,
      trend: parseFloat((baseTemp + trendData.slope * (d.year - firstYear)).toFixed(2)),
    }));
  }, [data, trendData, yearlyAverages]);

  const chartData = trendLine || data;

  if (!chartData.length) return null;

  const avgTemp = data.reduce((s, d) => s + (d.tempMean || 0), 0) / data.length;

  return (
    <ChartWrapper title={t.title}>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="year"
            stroke="#6b7280"
            fontSize={12}
            fontFamily="JetBrains Mono"
          />
          <YAxis
            yAxisId="temp"
            stroke="#6b7280"
            fontSize={12}
            fontFamily="JetBrains Mono"
            tickFormatter={(v) => `${v}°`}
          />
          <YAxis
            yAxisId="precip"
            orientation="right"
            stroke="#6b7280"
            fontSize={12}
            fontFamily="JetBrains Mono"
            tickFormatter={(v) => `${v}mm`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(10,14,26,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontFamily: 'JetBrains Mono',
              fontSize: '12px',
            }}
            formatter={(value, name) => {
              if (name === t.precip) return [`${value} mm`, name];
              return [`${value}°C`, name];
            }}
          />
          <Legend />
          <ReferenceLine
            yAxisId="temp"
            y={avgTemp}
            stroke="rgba(255,255,255,0.2)"
            strokeDasharray="8 4"
          />
          <Bar
            yAxisId="precip"
            dataKey="precipitation"
            name={t.precip}
            fill="#06b6d4"
            fillOpacity={0.2}
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="tempMean"
            name={t.avgTemp}
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            animationDuration={800}
          />
          {trendLine && (
            <Line
              yAxisId="temp"
              type="linear"
              dataKey="trend"
              name={t.trend}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="10 5"
              dot={false}
              animationDuration={800}
              animationBegin={400}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
