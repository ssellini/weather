import { useState, lazy, Suspense } from 'react';
import { SkeletonChart } from './LoadingSkeleton';

const PrecipitationHeatmap = lazy(() => import('./charts/PrecipitationHeatmap'));
const PrecipitationChart = lazy(() => import('./charts/PrecipitationChart'));
const YearlyPrecipChart = lazy(() => import('./charts/YearlyPrecipChart'));

const T = {
  fr: {
    title: 'Analyse des précipitations',
    day: 'Jour',
    month: 'Mois',
    year: 'Année',
    selectYear: 'Année :',
  },
  en: {
    title: 'Precipitation analysis',
    day: 'Day',
    month: 'Month',
    year: 'Year',
    selectYear: 'Year:',
  },
};

export default function PrecipitationDetail({
  processedDays,
  monthlyAverages,
  yearlyAverages,
  years,
  lang,
}) {
  const [view, setView] = useState('month');
  const [heatmapYear, setHeatmapYear] = useState(years[years.length - 1] || new Date().getFullYear() - 1);
  const t = T[lang] || T.fr;

  const views = [
    { key: 'day', label: t.day, icon: '📅' },
    { key: 'month', label: t.month, icon: '📊' },
    { key: 'year', label: t.year, icon: '📈' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-base font-display font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-base">🌧️</span>
          {t.title}
        </h2>
        <div className="flex items-center gap-2">
          {view === 'day' && (
            <select
              value={heatmapYear}
              onChange={(e) => setHeatmapYear(parseInt(e.target.value))}
              className="px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-white/5 border border-gray-200/60 dark:border-white/8 text-sm font-mono text-gray-700 dark:text-gray-300"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}
          <div className="flex rounded-xl overflow-hidden border border-gray-200/60 dark:border-white/8">
            {views.map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`px-3 py-1.5 text-xs font-medium transition-all ${
                  view === v.key
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-white/50 dark:bg-white/[0.03] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                {v.icon} {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Suspense fallback={<SkeletonChart />}>
        {view === 'day' && (
          <PrecipitationHeatmap processedDays={processedDays} year={heatmapYear} lang={lang} />
        )}
        {view === 'month' && (
          <PrecipitationChart monthlyAverages={monthlyAverages} years={years} lang={lang} />
        )}
        {view === 'year' && (
          <YearlyPrecipChart yearlyAverages={yearlyAverages} lang={lang} />
        )}
      </Suspense>
    </div>
  );
}
