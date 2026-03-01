import { useCallback } from 'react';

const T = {
  fr: { title: 'Weather Time Machine', lang: 'EN' },
  en: { title: 'Weather Time Machine', lang: 'FR' },
};

export default function Header({ darkMode, setDarkMode, lang, setLang }) {
  const t = T[lang] || T.fr;

  const toggleTheme = useCallback(() => setDarkMode((d) => !d), [setDarkMode]);
  const toggleLang = useCallback(() => setLang((l) => (l === 'fr' ? 'en' : 'fr')), [setLang]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-[#060918]/70 border-b border-gray-200/50 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg shadow-lg shadow-blue-500/20">
            🌦️
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {t.title}
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all active:scale-95"
            aria-label="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={toggleLang}
            className="px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-all active:scale-95 text-gray-500 dark:text-gray-400"
          >
            {t.lang}
          </button>
        </div>
      </div>
    </header>
  );
}
