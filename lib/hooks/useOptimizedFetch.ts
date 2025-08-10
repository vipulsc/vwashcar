import { useState, useEffect, useCallback, useRef } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseOptimizedFetchOptions {
  cacheTime?: number; // Cache time in milliseconds
  retryCount?: number; // Number of retries on failure
  retryDelay?: number; // Delay between retries in milliseconds
  enabled?: boolean; // Whether to enable the fetch
}

export function useOptimizedFetch<T>(
  url: string,
  options: RequestInit = {},
  fetchOptions: UseOptimizedFetchOptions = {}
): FetchState<T> & { refetch: () => void } {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    retryCount = 3,
    retryDelay = 1000,
    enabled = true,
  } = fetchOptions;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Check cache first
      const cached = cacheRef.current.get(url);
      if (cached && Date.now() - cached.timestamp < cacheTime) {
        setState({
          data: cached.data,
          loading: false,
          error: null,
        });
        return;
      }

      const response = await fetch(url, {
        ...options,
        signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the result
      cacheRef.current.set(url, {
        data,
        timestamp: Date.now(),
      });

      setState({
        data,
        loading: false,
        error: null,
      });

      retryCountRef.current = 0; // Reset retry count on success
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Don't update state for aborted requests
      }

      const errorMessage = error instanceof Error ? error.message : 'An error occurred';

      // Retry logic
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        setTimeout(() => {
          fetchData(signal);
        }, retryDelay * retryCountRef.current);
        return;
      }

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, [url, options, cacheTime, retryCount, retryDelay]);

  const refetch = useCallback(() => {
    retryCountRef.current = 0;
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!enabled) return;

    abortControllerRef.current = new AbortController();
    fetchData(abortControllerRef.current.signal);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, enabled, fetchData]);

  // Clear cache when component unmounts
  useEffect(() => {
    return () => {
      const currentCache = cacheRef.current;
      currentCache.clear();
    };
  }, []);

  return {
    ...state,
    refetch,
  };
}

// Hook for optimistic updates
export function useOptimisticUpdate<T>(
  updateFn: (data: T) => Promise<void>,
  onSuccess?: () => void,
  onError?: (error: string) => void
) {
  const [isUpdating, setIsUpdating] = useState(false);

  const update = useCallback(async (data: T) => {
    setIsUpdating(true);
    try {
      await updateFn(data);
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      onError?.(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [updateFn, onSuccess, onError]);

  return { update, isUpdating };
}
