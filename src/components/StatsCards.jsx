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

const ACCENT_COLORS = {
  blue: { border: 'border-l-blue-500', bg: 'from-blue-500/10 to-transparent', icon: 'bg-blue-500/10' },
  red: { border: 'border-l-red-500', bg: 'from-red-500/10 to-transparent', icon: 'bg-red-500/10' },
  cyan: { border: 'border-l-cyan-400', bg: 'from-cyan-400/10 to-transparent', icon: 'bg-cyan-400/10' },
  amber: { border: 'border-l-amber-500', bg: 'from-amber-500/10 to-transparent', icon: 'bg-amber-500/10' },
  orange: { border: 'border-l-orange-500', bg: 'from-orange-500/10 to-transparent', icon: 'bg-orange-500/10' },
  gray: { border: 'border-l-gray-400', bg: 'from-gray-400/10 to-transparent', icon: 'bg-gray-400/10' },
};

function StatCard({ icon, label, value, sub, color, accent = 'blue' }) {
  const a = ACCENT_COLORS[accent] || ACCENT_COLORS.blue;
  return (
    <div className={`group rounded-2xl p-4 sm:p-5 glass-card glow-border border-l-[3px] ${a.border} hover:scale-[1.03] hover:shadow-xl transition-all duration-300 cursor-default`}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-8 h-8 rounded-lg ${a.icon} flex items-center justify-center text-base`}>
          {icon}
        </div>
        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-xl sm:text-2xl font-bold font-mono ${color || 'text-gray-900 dark:text-white'}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-mono">{sub}</div>}
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
        accent="blue"
      />
      <StatCard
        icon="🔥"
        label={t.heatRecord}
        value={formatTemperature(records.hottestDay?.tempMax, unit)}
        sub={formatDate(records.hottestDay?.date, lang)}
        color="text-red-500"
        accent="red"
      />
      <StatCard
        icon="🥶"
        label={t.coldRecord}
        value={formatTemperature(records.coldestDay?.tempMin, unit)}
        sub={formatDate(records.coldestDay?.date, lang)}
        color="text-cyan-400"
        accent="cyan"
      />
      <StatCard
        icon="🌧️"
        label={t.rainiestYear}
        value={rainiestYear ? `${rainiestYear.year}` : '—'}
        sub={rainiestYear ? formatPrecipitation(rainiestYear.precipitation) : ''}
        accent="amber"
      />
      <StatCard
        icon="📈"
        label={t.trend}
        value={trend ? `${trend.totalChange >= 0 ? '+' : ''}${trend.totalChange.toFixed(1)}°C` : '—'}
        sub={trend ? `${trend.perDecade >= 0 ? '+' : ''}${trend.perDecade.toFixed(2)}°C ${t.perDecade}` : ''}
        color={trend && trend.totalChange > 0 ? 'text-orange-500' : 'text-blue-400'}
        accent="orange"
      />
      <StatCard
        icon="💨"
        label={t.maxWind}
        value={formatWind(records.windiestDay?.windMax)}
        sub={formatDate(records.windiestDay?.date, lang)}
        color="text-gray-600 dark:text-gray-300"
        accent="gray"
      />
    </div>
  );
}
