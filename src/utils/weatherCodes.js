const WEATHER_CODES = {
  0: { label: 'Ciel dégagé', labelEn: 'Clear sky', icon: '☀️' },
  1: { label: 'Principalement dégagé', labelEn: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partiellement nuageux', labelEn: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Couvert', labelEn: 'Overcast', icon: '☁️' },
  45: { label: 'Brouillard', labelEn: 'Fog', icon: '🌫️' },
  48: { label: 'Brouillard givrant', labelEn: 'Rime fog', icon: '🌫️' },
  51: { label: 'Bruine légère', labelEn: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Bruine modérée', labelEn: 'Moderate drizzle', icon: '🌦️' },
  55: { label: 'Bruine dense', labelEn: 'Dense drizzle', icon: '🌦️' },
  56: { label: 'Bruine verglaçante légère', labelEn: 'Light freezing drizzle', icon: '🌧️' },
  57: { label: 'Bruine verglaçante dense', labelEn: 'Dense freezing drizzle', icon: '🌧️' },
  61: { label: 'Pluie légère', labelEn: 'Slight rain', icon: '🌧️' },
  63: { label: 'Pluie modérée', labelEn: 'Moderate rain', icon: '🌧️' },
  65: { label: 'Pluie forte', labelEn: 'Heavy rain', icon: '🌧️' },
  66: { label: 'Pluie verglaçante légère', labelEn: 'Light freezing rain', icon: '🌧️' },
  67: { label: 'Pluie verglaçante forte', labelEn: 'Heavy freezing rain', icon: '🌧️' },
  71: { label: 'Neige légère', labelEn: 'Slight snow', icon: '🌨️' },
  73: { label: 'Neige modérée', labelEn: 'Moderate snow', icon: '🌨️' },
  75: { label: 'Neige forte', labelEn: 'Heavy snow', icon: '❄️' },
  77: { label: 'Grains de neige', labelEn: 'Snow grains', icon: '❄️' },
  80: { label: 'Averses légères', labelEn: 'Slight rain showers', icon: '🌦️' },
  81: { label: 'Averses modérées', labelEn: 'Moderate rain showers', icon: '🌦️' },
  82: { label: 'Averses violentes', labelEn: 'Violent rain showers', icon: '🌦️' },
  85: { label: 'Averses de neige légères', labelEn: 'Slight snow showers', icon: '🌨️' },
  86: { label: 'Averses de neige fortes', labelEn: 'Heavy snow showers', icon: '🌨️' },
  95: { label: 'Orage', labelEn: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Orage avec grêle légère', labelEn: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { label: 'Orage avec grêle forte', labelEn: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

export function getWeatherInfo(code, lang = 'fr') {
  const info = WEATHER_CODES[code] || { label: 'Inconnu', labelEn: 'Unknown', icon: '❓' };
  return {
    label: lang === 'fr' ? info.label : info.labelEn,
    icon: info.icon,
  };
}

export function getCountryFlag(countryCode) {
  if (!countryCode) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default WEATHER_CODES;
