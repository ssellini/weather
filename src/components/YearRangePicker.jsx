import { useCallback } from 'react';

const MIN_YEAR = 1940;

const T = {
  fr: { period: 'Période', quick5: '5 ans', quick10: '10 ans', quick20: '20 ans', to: 'à' },
  en: { period: 'Period', quick5: '5 yrs', quick10: '10 yrs', quick20: '20 yrs', to: 'to' },
};

export default function YearRangePicker({ startYear, endYear, onStartChange, onEndChange, lang }) {
  const currentYear = new Date().getFullYear();
  const t = T[lang] || T.fr;

  const setQuick = useCallback(
    (n) => {
      onStartChange(currentYear - n);
      onEndChange(currentYear);
    },
    [currentYear, onStartChange, onEndChange]
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.period}:</span>
        <div className="flex items-center gap-3 flex-1">
          <select
            value={startYear}
            onChange={(e) => onStartChange(parseInt(e.target.value))}
            className="px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Start year"
          >
            {Array.from({ length: currentYear - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <div className="flex-1 relative h-2 bg-gray-200 dark:bg-white/10 rounded-full">
            <div
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
              style={{
                left: `${((startYear - MIN_YEAR) / (currentYear - MIN_YEAR)) * 100}%`,
                right: `${100 - ((endYear - MIN_YEAR) / (currentYear - MIN_YEAR)) * 100}%`,
              }}
            />
          </div>

          <select
            value={endYear}
            onChange={(e) => onEndChange(parseInt(e.target.value))}
            className="px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="End year"
          >
            {Array.from({ length: currentYear - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i)
              .filter((y) => y >= startYear)
              .map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
          </select>
        </div>

        <div className="flex gap-2">
          {[5, 10, 20].map((n) => (
            <button
              key={n}
              onClick={() => setQuick(n)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-gray-200 dark:border-white/10"
            >
              {n === 5 ? t.quick5 : n === 10 ? t.quick10 : t.quick20}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
