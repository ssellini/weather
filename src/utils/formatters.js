export function formatTemperature(value, unit = 'C') {
  if (value == null || isNaN(value)) return '—';
  const v = unit === 'F' ? (value * 9) / 5 + 32 : value;
  return `${v.toFixed(1)}°${unit}`;
}

export function formatPrecipitation(value) {
  if (value == null || isNaN(value)) return '—';
  return `${value.toFixed(1)} mm`;
}

export function formatWind(value) {
  if (value == null || isNaN(value)) return '—';
  return `${value.toFixed(1)} km/h`;
}

export function formatDate(dateStr, lang = 'fr') {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatMonth(monthIndex, lang = 'fr') {
  const monthsFr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return lang === 'fr' ? monthsFr[monthIndex] : monthsEn[monthIndex];
}

export function formatMonthFull(monthIndex, lang = 'fr') {
  const monthsFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return lang === 'fr' ? monthsFr[monthIndex] : monthsEn[monthIndex];
}

export function formatNumber(value, decimals = 1) {
  if (value == null || isNaN(value)) return '—';
  return value.toFixed(decimals);
}

const YEAR_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1',
  '#14b8a6', '#e11d48', '#0ea5e9', '#a855f7', '#22c55e',
];

export function getYearColor(index) {
  return YEAR_COLORS[index % YEAR_COLORS.length];
}
