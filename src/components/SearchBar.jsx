import { useState, useRef, useEffect } from 'react';
import useGeocoding from '../hooks/useGeocoding';
import { getCountryFlag } from '../utils/weatherCodes';

const T = {
  fr: {
    placeholder: 'Rechercher une ville...',
    recent: 'Villes récentes',
    noResults: 'Aucun résultat',
    searching: 'Recherche...',
  },
  en: {
    placeholder: 'Search a city...',
    recent: 'Recent cities',
    noResults: 'No results',
    searching: 'Searching...',
  },
};

export default function SearchBar({ onCitySelect, recentCities, lang }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { results, loading, search, clear } = useGeocoding(lang);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const t = T[lang] || T.fr;

  useEffect(() => {
    search(query);
  }, [query, search]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(city) {
    onCitySelect(city);
    setQuery(city.name);
    setOpen(false);
    clear();
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t.placeholder}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.03] border border-gray-200/60 dark:border-white/8 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 backdrop-blur-sm transition-all font-body shadow-sm"
          aria-label={t.placeholder}
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 animate-pulse">
            {t.searching}
          </span>
        )}
      </div>

      {open && (results.length > 0 || (query.length >= 2 && !loading)) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 rounded-2xl bg-white/95 dark:bg-[#0d1225]/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/8 shadow-2xl overflow-hidden"
        >
          {results.length > 0
            ? results.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors"
                >
                  <span className="text-lg">{getCountryFlag(city.country_code)}</span>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{city.name}</span>
                    {city.admin1 && (
                      <span className="text-gray-400 dark:text-gray-500 text-sm ml-1">
                        {city.admin1},
                      </span>
                    )}
                    <span className="text-gray-400 dark:text-gray-500 text-sm ml-1">{city.country}</span>
                  </div>
                </button>
              ))
            : query.length >= 2 &&
              !loading && (
                <div className="px-4 py-3 text-gray-400 text-sm">{t.noResults}</div>
              )}
        </div>
      )}

      {recentCities.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 self-center">{t.recent}:</span>
          {recentCities.map((city) => (
            <button
              key={`${city.latitude}-${city.longitude}`}
              onClick={() => handleSelect(city)}
              className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/10"
            >
              {getCountryFlag(city.country_code)} {city.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
