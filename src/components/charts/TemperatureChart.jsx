import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { getMonthlyDataForChart } from '../../utils/dataProcessing';
import { formatMonth, getYearColor } from '../../utils/formatters';

const T = {
  fr: { title: 'Température moyenne mensuelle', temp: 'Température' },
  en: { title: 'Monthly average temperature', temp: 'Temperature' },
};

export default function TemperatureChart({ monthlyAverages, years, lang }) {
  const t = T[lang] || T.fr;
  const data = useMemo(() => getMonthlyDataForChart(monthlyAverages, years), [monthlyAverages, years]);

  return (
    <ChartWrapper title={t.title}>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="month"
            tickFormatter={(m) => formatMonth(m, lang)}
            stroke="#6b7280"
            fontSize={12}
            fontFamily="JetBrains Mono"
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            fontFamily="JetBrains Mono"
            tickFormatter={(v) => `${v}°`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(10,14,26,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontFamily: 'JetBrains Mono',
              fontSize: '12px',
            }}
            labelFormatter={(m) => formatMonth(m, lang)}
            formatter={(value) => [`${value?.toFixed(1)}°C`, null]}
          />
          <Legend />
          {years.map((year, i) => (
            <Line
              key={year}
              type="monotone"
              dataKey={`temp_${year}`}
              name={`${year}`}
              stroke={getYearColor(i)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              animationDuration={800}
              animationBegin={i * 100}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
