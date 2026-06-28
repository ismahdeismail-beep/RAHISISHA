import { useState, useEffect, useCallback } from 'react';
import api from './api';

export function useApi(fetchFn, mockData, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMock, setIsMock] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsMock(false);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      if (mockData !== undefined) {
        setData(mockData);
        setIsMock(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, isMock, refresh: load };
}