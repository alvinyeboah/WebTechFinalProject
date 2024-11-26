import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { ApiError } from '@/types/api';

export function useApi<T, P extends any[]>(
  apiFunction: (...args: P) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (...args: P) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, error, loading, execute };
} 