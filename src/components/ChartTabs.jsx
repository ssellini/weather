import { useState, useMemo, lazy, Suspense } from 'react';
import { SkeletonChart } from './LoadingSkeleton';

const TemperatureChart = lazy(() => import('./charts/TemperatureChart'));
const MinMaxAreaChart = lazy(() => import('./charts/MinMaxAreaChart'));

const T = {
  fr: {
    title: 'Analyse des températures',
    temp: 'Moyenne',
    range: 'Min/Max',
  },
  en: {
    title: 'Temperature analysis',
    temp: 'Average',
    range: 'Min/Max',
  },
};

export default function ChartTabs({ monthlyAverages, years, lang }) {
  const [tab, setTab] = useState('temp');
  const t = T[lang] || T.fr;

  const tabs = useMemo(
    () => [
      { key: 'temp', label: t.temp, icon: '🌡️' },
      { key: 'range', label: t.range, icon: '📊' },
    ],
    [t]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-base font-display font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-base">🌡️</span>
          {t.title}
        </h2>
        <div className="flex rounded-xl overflow-hidden border border-gray-200/60 dark:border-white/8">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${
                tab === item.key
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-white/50 dark:bg-white/[0.03] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      <Suspense fallback={<SkeletonChart />}>
        {tab === 'temp' && (
          <TemperatureChart monthlyAverages={monthlyAverages} years={years} lang={lang} />
        )}
        {tab === 'range' && (
          <MinMaxAreaChart monthlyAverages={monthlyAverages} years={years} lang={lang} />
        )}
      </Suspense>
    </div>
  );
}
