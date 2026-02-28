import { useState, useCallback } from 'react';
import { fetchWeatherRange } from '../utils/api';
import {
  processWeatherData,
  computeMonthlyAverages,
  computeYearlyAverages,
  computeOverallStats,
} from '../utils/dataProcessing';

export default function useWeatherData() {
  const [rawData, setRawData] = useState(null);
  const [processedDays, setProcessedDays] = useState([]);
  const [monthlyAverages, setMonthlyAverages] = useState([]);
  const [yearlyAverages, setYearlyAverages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (city, startYear, endYear) => {
    if (!city) return;
    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const data = await fetchWeatherRange(
        city.latitude,
        city.longitude,
        startYear,
        endYear,
        (p) => setProgress(p)
      );

      setRawData(data);
      const days = processWeatherData(data) || [];
      setProcessedDays(days);

      const monthly = computeMonthlyAverages(days);
      setMonthlyAverages(monthly);

      const yearly = computeYearlyAverages(days);
      setYearlyAverages(yearly);

      const overallStats = computeOverallStats(days, yearly);
      setStats(overallStats);
    } catch (err) {
      setError(err.message);
      setRawData(null);
      setProcessedDays([]);
      setMonthlyAverages([]);
      setYearlyAverages([]);
      setStats(null);
    } finally {
      setLoading(false);
      setProgress(1);
    }
  }, []);

  return {
    rawData,
    processedDays,
    monthlyAverages,
    yearlyAverages,
    stats,
    loading,
    progress,
    error,
    fetchData,
  };
}
