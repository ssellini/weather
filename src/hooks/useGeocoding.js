import { useState, useRef, useCallback } from 'react';
import { searchCities } from '../utils/api';

export default function useGeocoding(lang = 'fr') {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const search = useCallback(
    (query) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!query || query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const data = await searchCities(query, lang);
          setResults(data);
          setError(null);
        } catch (err) {
          setError(err.message);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [lang]
  );

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clear };
}
