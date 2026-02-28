import { useState, useMemo, lazy, Suspense } from 'react';
import { SkeletonChart } from './LoadingSkeleton';

const TemperatureChart = lazy(() => import('./charts/TemperatureChart'));
const PrecipitationChart = lazy(() => import('./charts/PrecipitationChart'));
const MinMaxAreaChart = lazy(() => import('./charts/MinMaxAreaChart'));

const T = {
  fr: {
    temp: 'Température',
    precip: 'Précipitations',
    range: 'Min/Max',
  },
  en: {
    temp: 'Temperature',
    precip: 'Precipitation',
    range: 'Min/Max',
  },
};

export default function ChartTabs({ monthlyAverages, years, lang }) {
  const [tab, setTab] = useState('temp');
  const t = T[lang] || T.fr;

  const tabs = useMemo(
    () => [
      { key: 'temp', label: t.temp, icon: '🌡️' },
      { key: 'precip', label: t.precip, icon: '🌧️' },
      { key: 'range', label: t.range, icon: '📊' },
    ],
    [t]
  );

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              tab === item.key
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      <Suspense fallback={<SkeletonChart />}>
        {tab === 'temp' && (
          <TemperatureChart monthlyAverages={monthlyAverages} years={years} lang={lang} />
        )}
        {tab === 'precip' && (
          <PrecipitationChart monthlyAverages={monthlyAverages} years={years} lang={lang} />
        )}
        {tab === 'range' && (
          <MinMaxAreaChart monthlyAverages={monthlyAverages} years={years} lang={lang} />
        )}
      </Suspense>
    </div>
  );
}
