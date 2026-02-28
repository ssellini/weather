import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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
  fr: { title: 'Précipitations mensuelles cumulées' },
  en: { title: 'Cumulative monthly precipitation' },
};

export default function PrecipitationChart({ monthlyAverages, years, lang }) {
  const t = T[lang] || T.fr;
  const data = useMemo(() => getMonthlyDataForChart(monthlyAverages, years), [monthlyAverages, years]);

  return (
    <ChartWrapper title={t.title}>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
            labelFormatter={(m) => formatMonth(m, lang)}
            formatter={(value) => [`${value?.toFixed(1)} mm`, null]}
          />
          <Legend />
          {years.map((year, i) => (
            <Bar
              key={year}
              dataKey={`precip_${year}`}
              name={`${year}`}
              fill={getYearColor(i)}
              fillOpacity={0.7}
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              animationBegin={i * 100}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
