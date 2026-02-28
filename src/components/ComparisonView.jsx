import { useState, useMemo, useCallback } from 'react';
import SearchBar from './SearchBar';
import StatsCards from './StatsCards';
import ChartTabs from './ChartTabs';
import useWeatherData from '../hooks/useWeatherData';
import useLocalStorage from '../hooks/useLocalStorage';
import LoadingSkeleton from './LoadingSkeleton';
import { getCountryFlag } from '../utils/weatherCodes';

const T = {
  fr: {
    title: 'Mode Comparaison',
    city1: 'Ville 1',
    city2: 'Ville 2',
    selectCity: 'Sélectionnez une ville',
    compare: 'Comparer',
    vs: 'vs',
  },
  en: {
    title: 'Comparison Mode',
    city1: 'City 1',
    city2: 'City 2',
    selectCity: 'Select a city',
    compare: 'Compare',
    vs: 'vs',
  },
};

export default function ComparisonView({ startYear, endYear, recentCities, onAddRecent, lang, unit }) {
  const t = T[lang] || T.fr;
  const [city1, setCity1] = useLocalStorage('comparison_city1', null);
  const [city2, setCity2] = useLocalStorage('comparison_city2', null);
  const weather1 = useWeatherData();
  const weather2 = useWeatherData();

  const years = useMemo(() => {
    const arr = [];
    for (let y = startYear; y <= endYear; y++) arr.push(y);
    return arr;
  }, [startYear, endYear]);

  const handleCompare = useCallback(() => {
    if (city1) weather1.fetchData(city1, startYear, endYear);
    if (city2) weather2.fetchData(city2, startYear, endYear);
  }, [city1, city2, startYear, endYear, weather1, weather2]);

  const handleCity1Select = useCallback(
    (city) => {
      setCity1(city);
      onAddRecent(city);
    },
    [setCity1, onAddRecent]
  );

  const handleCity2Select = useCallback(
    (city) => {
      setCity2(city);
      onAddRecent(city);
    },
    [setCity2, onAddRecent]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-display font-bold text-gray-800 dark:text-white">{t.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.city1}</label>
          <SearchBar onCitySelect={handleCity1Select} recentCities={recentCities} lang={lang} />
          {city1 && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {getCountryFlag(city1.country_code)} {city1.name}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.city2}</label>
          <SearchBar onCitySelect={handleCity2Select} recentCities={recentCities} lang={lang} />
          {city2 && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {getCountryFlag(city2.country_code)} {city2.name}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={!city1 || !city2}
        className="px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25"
      >
        {t.compare}
      </button>

      {(weather1.loading || weather2.loading) && (
        <LoadingSkeleton progress={Math.min(weather1.progress, weather2.progress)} />
      )}

      {!weather1.loading && !weather2.loading && weather1.stats && weather2.stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="font-display font-bold text-gray-700 dark:text-gray-200">
              {getCountryFlag(city1?.country_code)} {city1?.name}
            </h3>
            <StatsCards stats={weather1.stats} unit={unit} lang={lang} />
            <ChartTabs monthlyAverages={weather1.monthlyAverages} years={years} lang={lang} />
          </div>
          <div className="space-y-6">
            <h3 className="font-display font-bold text-gray-700 dark:text-gray-200">
              {getCountryFlag(city2?.country_code)} {city2?.name}
            </h3>
            <StatsCards stats={weather2.stats} unit={unit} lang={lang} />
            <ChartTabs monthlyAverages={weather2.monthlyAverages} years={years} lang={lang} />
          </div>
        </div>
      )}
    </div>
  );
}
