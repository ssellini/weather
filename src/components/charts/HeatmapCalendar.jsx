import { useMemo } from 'react';
import ChartWrapper from './ChartWrapper';

const T = {
  fr: { title: 'Calendrier thermique', months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'] },
  en: { title: 'Temperature heatmap', months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
};

function getTempColor(temp) {
  if (temp == null) return 'rgba(255,255,255,0.03)';
  if (temp <= -10) return '#1e3a5f';
  if (temp <= 0) return '#2563eb';
  if (temp <= 5) return '#3b82f6';
  if (temp <= 10) return '#06b6d4';
  if (temp <= 15) return '#10b981';
  if (temp <= 20) return '#84cc16';
  if (temp <= 25) return '#eab308';
  if (temp <= 30) return '#f97316';
  if (temp <= 35) return '#ef4444';
  return '#dc2626';
}

export default function HeatmapCalendar({ processedDays, year, lang }) {
  const t = T[lang] || T.fr;

  const gridData = useMemo(() => {
    if (!processedDays?.length) return [];
    const yearDays = processedDays.filter((d) => d.year === year);
    // Group by month and day
    const grid = Array.from({ length: 12 }, (_, month) => {
      const monthDays = yearDays.filter((d) => d.month === month);
      return Array.from({ length: 31 }, (_, dayIdx) => {
        const day = monthDays.find((d) => d.day === dayIdx + 1);
        return day ? day.tempMean : null;
      });
    });
    return grid;
  }, [processedDays, year]);

  if (!gridData.length) return null;

  return (
    <ChartWrapper title={`${t.title} — ${year}`}>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[auto_repeat(31,1fr)] gap-[2px]">
            {/* Header row: day numbers */}
            <div />
            {Array.from({ length: 31 }, (_, i) => (
              <div key={i} className="text-[9px] text-gray-500 text-center font-mono">
                {i + 1}
              </div>
            ))}
            {/* Month rows */}
            {gridData.map((monthDays, monthIdx) => (
              <div key={monthIdx} className="contents">
                <div className="text-xs text-gray-400 font-medium pr-2 flex items-center font-mono">
                  {t.months[monthIdx]}
                </div>
                {monthDays.map((temp, dayIdx) => (
                  <div
                    key={dayIdx}
                    className="aspect-square rounded-[3px] transition-colors"
                    style={{ backgroundColor: getTempColor(temp) }}
                    title={temp != null ? `${t.months[monthIdx]} ${dayIdx + 1}: ${temp.toFixed(1)}°C` : ''}
                  />
                ))}
              </div>
            ))}
          </div>
          {/* Color legend */}
          <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-gray-400 font-mono">
            <span>-10°C</span>
            {[-10, 0, 5, 10, 15, 20, 25, 30, 35].map((temp) => (
              <div
                key={temp}
                className="w-4 h-3 rounded-[2px]"
                style={{ backgroundColor: getTempColor(temp) }}
              />
            ))}
            <span>35°C+</span>
          </div>
        </div>
      </div>
    </ChartWrapper>
  );
}
