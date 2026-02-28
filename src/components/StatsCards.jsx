import { formatTemperature, formatPrecipitation, formatWind, formatDate } from '../utils/formatters';

const T = {
  fr: {
    avgTemp: 'Temp. moyenne',
    heatRecord: 'Record chaleur',
    coldRecord: 'Record froid',
    rainiestYear: 'Année + pluvieuse',
    trend: 'Tendance temp.',
    maxWind: 'Vent max',
    onPeriod: 'sur la période',
    perDecade: '/décennie',
  },
  en: {
    avgTemp: 'Avg. temp.',
    heatRecord: 'Heat record',
    coldRecord: 'Cold record',
    rainiestYear: 'Rainiest year',
    trend: 'Temp. trend',
    maxWind: 'Max wind',
    onPeriod: 'over period',
    perDecade: '/decade',
  },
};

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="group rounded-2xl p-4 sm:p-5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 cursor-default">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className={`text-xl sm:text-2xl font-bold font-mono ${color || 'text-gray-900 dark:text-white'}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

export default function StatsCards({ stats, unit, lang }) {
  const t = T[lang] || T.fr;
  if (!stats) return null;

  const { avgTemp, records, rainiestYear, trend } = stats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      <StatCard
        icon="🌡️"
        label={t.avgTemp}
        value={formatTemperature(avgTemp, unit)}
        sub={t.onPeriod}
        color="text-blue-500"
      />
      <StatCard
        icon="🔥"
        label={t.heatRecord}
        value={formatTemperature(records.hottestDay?.tempMax, unit)}
        sub={formatDate(records.hottestDay?.date, lang)}
        color="text-red-500"
      />
      <StatCard
        icon="🥶"
        label={t.coldRecord}
        value={formatTemperature(records.coldestDay?.tempMin, unit)}
        sub={formatDate(records.coldestDay?.date, lang)}
        color="text-cyan-400"
      />
      <StatCard
        icon="🌧️"
        label={t.rainiestYear}
        value={rainiestYear ? `${rainiestYear.year}` : '—'}
        sub={rainiestYear ? formatPrecipitation(rainiestYear.precipitation) : ''}
      />
      <StatCard
        icon="📈"
        label={t.trend}
        value={trend ? `${trend.totalChange >= 0 ? '+' : ''}${trend.totalChange.toFixed(1)}°C` : '—'}
        sub={trend ? `${trend.perDecade >= 0 ? '+' : ''}${trend.perDecade.toFixed(2)}°C ${t.perDecade}` : ''}
        color={trend && trend.totalChange > 0 ? 'text-orange-500' : 'text-blue-400'}
      />
      <StatCard
        icon="💨"
        label={t.maxWind}
        value={formatWind(records.windiestDay?.windMax)}
        sub={formatDate(records.windiestDay?.date, lang)}
        color="text-gray-600 dark:text-gray-300"
      />
    </div>
  );
}
