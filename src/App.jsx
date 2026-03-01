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
const PrecipitationDetail = lazy(() => import('./components/PrecipitationDetail'));

const currentYear = new Date().getFullYear();

const T = {
  fr: {
    empty: 'Sélectionnez une ville pour commencer',
    emptySub: "Explorez l'historique météo de n'importe quelle ville depuis 1940",
    search: 'Rechercher',
    comparison: 'Comparaison',
    error: 'Erreur',
    heatmapYear: 'Année :',
  },
  en: {
    empty: 'Select a city to begin',
    emptySub: 'Explore the weather history of any city since 1940',
    search: 'Search',
    comparison: 'Comparison',
    error: 'Error',
    heatmapYear: 'Year:',
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
    <div className="min-h-screen bg-gray-50 dark:bg-mesh-dark text-gray-900 dark:text-white transition-colors duration-300">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} lang={lang} setLang={setLang} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Mode toggle */}
        <div className="flex gap-2 justify-center">
          {['search', 'comparison'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                mode === m
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white/60 dark:bg-white/[0.03] text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 border border-gray-200/60 dark:border-white/8'
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
              <div className="text-center space-y-1">
                <h2 className="text-xl font-display font-bold text-gray-800 dark:text-white">
                  {getCountryFlag(city.country_code)} {city.name}
                  {city.admin1 && (
                    <span className="text-gray-400 font-normal text-base ml-2">{city.admin1}, {city.country}</span>
                  )}
                </h2>
                <p className="text-sm text-gray-400 font-mono">
                  {startYear} — {endYear}
                </p>
              </div>
            )}

            {/* Loading */}
            {weather.loading && <LoadingSkeleton progress={weather.progress} />}

            {/* Error */}
            {weather.error && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                  <span className="text-red-400 font-medium text-sm">{t.error}: {weather.error}</span>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!city && !weather.loading && (
              <div className="text-center py-24">
                <div className="text-7xl mb-6 animate-float">🌍</div>
                <h2 className="text-2xl font-display font-semibold text-gray-600 dark:text-gray-200">{t.empty}</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-3 max-w-md mx-auto">{t.emptySub}</p>
              </div>
            )}

            {/* Data display */}
            {hasData && (
              <div className="space-y-10 animate-fade-in">
                {/* KPI Cards */}
                <StatsCards stats={weather.stats} unit={unit} lang={lang} />

                {/* Temperature charts tabs */}
                <ChartTabs monthlyAverages={weather.monthlyAverages} years={years} lang={lang} />

                {/* Precipitation detail section with Day/Month/Year tabs */}
                <Suspense fallback={<SkeletonChart />}>
                  <PrecipitationDetail
                    processedDays={weather.processedDays}
                    monthlyAverages={weather.monthlyAverages}
                    yearlyAverages={weather.yearlyAverages}
                    years={years}
                    lang={lang}
                  />
                </Suspense>

                {/* Heatmap + Radar */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Suspense fallback={<SkeletonChart />}>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <label className="text-xs font-medium text-gray-400">{t.heatmapYear}</label>
                        <select
                          value={heatmapYear}
                          onChange={(e) => setHeatmapYear(parseInt(e.target.value))}
                          className="px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-white/5 border border-gray-200/60 dark:border-white/8 text-sm font-mono text-gray-700 dark:text-gray-300"
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
