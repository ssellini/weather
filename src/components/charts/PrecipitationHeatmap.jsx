import { useMemo } from 'react';
import ChartWrapper from './ChartWrapper';

const T = {
  fr: { title: 'Calendrier des précipitations', months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'] },
  en: { title: 'Precipitation calendar', months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
};

function getPrecipColor(precip) {
  if (precip == null) return 'rgba(255,255,255,0.03)';
  if (precip <= 0) return 'rgba(255,255,255,0.03)';
  if (precip <= 1) return '#bfdbfe';
  if (precip <= 3) return '#93c5fd';
  if (precip <= 5) return '#60a5fa';
  if (precip <= 10) return '#3b82f6';
  if (precip <= 20) return '#2563eb';
  if (precip <= 30) return '#1d4ed8';
  if (precip <= 50) return '#7c3aed';
  return '#a855f7';
}

export default function PrecipitationHeatmap({ processedDays, year, lang }) {
  const t = T[lang] || T.fr;

  const gridData = useMemo(() => {
    if (!processedDays?.length) return [];
    const yearDays = processedDays.filter((d) => d.year === year);
    return Array.from({ length: 12 }, (_, month) => {
      const monthDays = yearDays.filter((d) => d.month === month);
      return Array.from({ length: 31 }, (_, dayIdx) => {
        const day = monthDays.find((d) => d.day === dayIdx + 1);
        return day ? day.precipitation : null;
      });
    });
  }, [processedDays, year]);

  if (!gridData.length) return null;

  return (
    <ChartWrapper title={`${t.title} — ${year}`}>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[auto_repeat(31,1fr)] gap-[2px]">
            <div />
            {Array.from({ length: 31 }, (_, i) => (
              <div key={i} className="text-[9px] text-gray-500 text-center font-mono">
                {i + 1}
              </div>
            ))}
            {gridData.map((monthDays, monthIdx) => (
              <div key={monthIdx} className="contents">
                <div className="text-xs text-gray-400 font-medium pr-2 flex items-center font-mono">
                  {t.months[monthIdx]}
                </div>
                {monthDays.map((precip, dayIdx) => (
                  <div
                    key={dayIdx}
                    className="aspect-square rounded-[3px] transition-colors"
                    style={{ backgroundColor: getPrecipColor(precip) }}
                    title={precip != null ? `${t.months[monthIdx]} ${dayIdx + 1}: ${precip.toFixed(1)} mm` : ''}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-gray-400 font-mono">
            <span>0mm</span>
            {[0, 1, 3, 5, 10, 20, 30, 50].map((p) => (
              <div
                key={p}
                className="w-4 h-3 rounded-[2px]"
                style={{ backgroundColor: getPrecipColor(p || 0.1) }}
              />
            ))}
            <span>50mm+</span>
          </div>
        </div>
      </div>
    </ChartWrapper>
  );
}
