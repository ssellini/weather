import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
  fr: { title: 'Plage de températures min/max' },
  en: { title: 'Temperature min/max range' },
};

export default function MinMaxAreaChart({ monthlyAverages, years, lang }) {
  const t = T[lang] || T.fr;
  const data = useMemo(() => getMonthlyDataForChart(monthlyAverages, years), [monthlyAverages, years]);

  // For area chart, show the range for each year
  const displayYears = years.slice(0, 4); // limit to 4 years for readability

  return (
    <ChartWrapper title={t.title}>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          {displayYears.map((year, i) => {
            const color = getYearColor(i);
            return (
              <Area
                key={year}
                type="monotone"
                dataKey={`tempMax_${year}`}
                name={`Max ${year}`}
                stroke={color}
                fill={color}
                fillOpacity={0.15}
                strokeWidth={1.5}
                dot={false}
                animationDuration={800}
                animationBegin={i * 100}
              />
            );
          })}
          {displayYears.map((year, i) => {
            const color = getYearColor(i);
            return (
              <Area
                key={`min_${year}`}
                type="monotone"
                dataKey={`tempMin_${year}`}
                name={`Min ${year}`}
                stroke={color}
                fill={color}
                fillOpacity={0.05}
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                animationDuration={800}
                animationBegin={i * 100}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
