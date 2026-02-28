const T = {
  fr: { data: 'Données fournies par', made: 'Fait avec' },
  en: { data: 'Data provided by', made: 'Made with' },
};

export default function Footer({ lang }) {
  const t = T[lang] || T.fr;
  return (
    <footer className="mt-16 py-8 border-t border-gray-200 dark:border-white/10 text-center text-sm text-gray-400 dark:text-gray-500">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <span>
          {t.data}{' '}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Open-Meteo
          </a>
        </span>
        <span className="hidden sm:inline">|</span>
        <span>{t.made} ❤️</span>
      </div>
    </footer>
  );
}
