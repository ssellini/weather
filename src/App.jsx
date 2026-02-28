import { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import YearRangePicker from './components/YearRangePicker';
import StatsCards from './components/StatsCards';
import ChartTabs from './components/ChartTabs';
import LoadingSkeleton, { SkeletonChart } from './components/LoadingSkeleton';
import Footer from './components/Footer';
import useWeatherData from './hooks/useWeatherData';
import useLocalStorage from './hooks/useLocalStorage';
import { getCountryFlag } from './utils/weatherCodes';

const HeatmapCalendar = lazy(() => import('./components/charts/HeatmapCalendar'));
const ClimateRadar = lazy(() => import('./components/charts/ClimateRadar'));
const TrendLine = lazy(() => import('./components/charts/TrendLine'));
const ComparisonView = lazy(() => import('./components/ComparisonView'));

const currentYear = new Date().getFullYear();

const T = {
  fr: {
    empty: 'Sélectionnez une ville pour commencer',
    emptySub: "Explorez l'historique météo de n'importe quelle ville depuis 1940",
    search: 'Rechercher',
    comparison: 'Comparaison',
    error: 'Erreur',
    heatmapYear: 'Année du calendrier :',
  },
  en: {
    empty: 'Select a city to begin',
    emptySub: 'Explore the weather history of any city since 1940',
    search: 'Search',
    comparison: 'Comparison',
    error: 'Error',
    heatmapYear: 'Calendar year:',
  },
};

export default function App() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);
  const [lang, setLang] = useLocalStorage('lang', 'fr');
  const [unit] = useLocalStorage('unit', 'C');
  const [city, setCity] = useLocalStorage('selectedCity', null);
  const [recentCities, setRecentCities] = useLocalStorage('recentCities', []);
  const [startYear, setStartYear] = useLocalStorage('startYear', currentYear - 5);
  const [endYear, setEndYear] = useLocalStorage('endYear', currentYear);
  const [mode, setMode] = useState('search');
  const [heatmapYear, setHeatmapYear] = useState(currentYear - 1);

  const weather = useWeatherData();
  const t = T[lang] || T.fr;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const addRecentCity = useCallback(
    (newCity) => {
      setRecentCities((prev) => {
        const filtered = prev.filter(
          (c) => c.latitude !== newCity.latitude || c.longitude !== newCity.longitude
        );
        return [newCity, ...filtered].slice(0, 5);
      });
    },
    [setRecentCities]
  );

  const handleCitySelect = useCallback(
    (selectedCity) => {
      setCity(selectedCity);
      addRecentCity(selectedCity);
      weather.fetchData(selectedCity, startYear, endYear);
    },
    [setCity, addRecentCity, weather, startYear, endYear]
  );

  const handleStartChange = useCallback(
    (y) => {
      setStartYear(y);
      if (city) weather.fetchData(city, y, endYear);
    },
    [setStartYear, city, weather, endYear]
  );

  const handleEndChange = useCallback(
    (y) => {
      setEndYear(y);
      if (city) weather.fetchData(city, startYear, y);
    },
    [setEndYear, city, weather, startYear]
  );

  const years = useMemo(() => {
    const arr = [];
    for (let y = startYear; y <= endYear; y++) arr.push(y);
    return arr;
  }, [startYear, endYear]);

  const hasData = !weather.loading && weather.stats && weather.processedDays.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0e1a] text-gray-900 dark:text-white transition-colors duration-300">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} lang={lang} setLang={setLang} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Mode toggle */}
        <div className="flex gap-2 justify-center">
          {['search', 'comparison'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {m === 'search' ? `🔍 ${t.search}` : `📊 ${t.comparison}`}
            </button>
          ))}
        </div>

        {mode === 'comparison' ? (
          <Suspense fallback={<SkeletonChart />}>
            <ComparisonView
              startYear={startYear}
              endYear={endYear}
              recentCities={recentCities}
              onAddRecent={addRecentCity}
              lang={lang}
              unit={unit}
            />
          </Suspense>
        ) : (
          <>
            {/* Search */}
            <SearchBar onCitySelect={handleCitySelect} recentCities={recentCities} lang={lang} />

            {/* Year range */}
            <YearRangePicker
              startYear={startYear}
              endYear={endYear}
              onStartChange={handleStartChange}
              onEndChange={handleEndChange}
              lang={lang}
            />

            {/* City indicator */}
            {city && (
              <div className="text-center">
                <h2 className="text-xl font-display font-bold text-gray-800 dark:text-white">
                  {getCountryFlag(city.country_code)} {city.name}
                  {city.admin1 && (
                    <span className="text-gray-400 font-normal text-base ml-2">{city.admin1}, {city.country}</span>
                  )}
                </h2>
                <p className="text-sm text-gray-400 font-mono mt-1">
                  {startYear} — {endYear}
                </p>
              </div>
            )}

            {/* Loading */}
            {weather.loading && <LoadingSkeleton progress={weather.progress} />}

            {/* Error */}
            {weather.error && (
              <div className="text-center py-8">
                <p className="text-red-400 font-medium">{t.error}: {weather.error}</p>
              </div>
            )}

            {/* Empty state */}
            {!city && !weather.loading && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🌍</div>
                <h2 className="text-xl font-display font-semibold text-gray-600 dark:text-gray-300">{t.empty}</h2>
                <p className="text-sm text-gray-400 mt-2">{t.emptySub}</p>
              </div>
            )}

            {/* Data display */}
            {hasData && (
              <div className="space-y-8 animate-fade-in">
                {/* KPI Cards */}
                <StatsCards stats={weather.stats} unit={unit} lang={lang} />

                {/* Main chart tabs */}
                <ChartTabs monthlyAverages={weather.monthlyAverages} years={years} lang={lang} />

                {/* Secondary charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Suspense fallback={<SkeletonChart />}>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-xs text-gray-400">{t.heatmapYear}</label>
                        <select
                          value={heatmapYear}
                          onChange={(e) => setHeatmapYear(parseInt(e.target.value))}
                          className="px-2 py-1 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-mono text-gray-700 dark:text-gray-300"
                        >
                          {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      <HeatmapCalendar processedDays={weather.processedDays} year={heatmapYear} lang={lang} />
                    </div>
                  </Suspense>

                  <Suspense fallback={<SkeletonChart />}>
                    <ClimateRadar yearlyAverages={weather.yearlyAverages} years={years} lang={lang} />
                  </Suspense>
                </div>

                {/* Trend line */}
                <Suspense fallback={<SkeletonChart />}>
                  <TrendLine
                    yearlyAverages={weather.yearlyAverages}
                    trendData={weather.stats?.trend}
                    lang={lang}
                  />
                </Suspense>
              </div>
            )}
          </>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  );
}
