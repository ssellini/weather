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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#0a0e1a]/80 border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌦️</span>
          <h1 className="font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={toggleLang}
            className="px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
          >
            🌐 {t.lang}
          </button>
        </div>
      </div>
    </header>
  );
}
