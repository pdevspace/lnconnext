import { useState, useEffect, useCallback } from 'react';
import { pwaManager } from '@/utils/pwa-utils';

interface UseOfflineDataOptions {
  key: string;
  fetchData: () => Promise<any>;
  dependencies?: any[];
  enabled?: boolean;
}

export function useOfflineData<T>({
  key,
  fetchData,
  dependencies = [],
  enabled = true
}: UseOfflineDataOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!pwaManager.isAppOnline());

  const loadData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Try to fetch fresh data if online
      if (pwaManager.isAppOnline()) {
        const freshData = await fetchData();
        setData(freshData);
        
        // Store in offline cache
        await pwaManager.storeOfflineData(key, freshData);
      } else {
        // Try to load from offline cache
        const cachedData = await pwaManager.getOfflineData(key);
        if (cachedData) {
          setData(cachedData);
        } else {
          throw new Error('No offline data available');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      
      // Try to load from offline cache as fallback
      if (pwaManager.isAppOnline()) {
        try {
          const cachedData = await pwaManager.getOfflineData(key);
          if (cachedData) {
            setData(cachedData);
            setError('Using cached data - connection issue');
          }
        } catch (cacheErr) {
          console.error('Failed to load cached data:', cacheErr);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [key, fetchData, enabled, ...dependencies]);

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  const clearOfflineData = useCallback(async () => {
    await pwaManager.clearOfflineData();
    setData(null);
  }, []);

  useEffect(() => {
    // Listen for online/offline status changes
    const handleOnlineStatusChange = () => {
      const online = pwaManager.isAppOnline();
      setIsOffline(!online);
      
      // Auto-refresh when coming back online
      if (online && data) {
        loadData();
      }
    };

    window.addEventListener('pwa-online-status-change', handleOnlineStatusChange);
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('pwa-online-status-change', handleOnlineStatusChange);
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, [data, loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    isOffline,
    refresh: refreshData,
    clearOfflineData
  };
}

// Hook for managing offline data with automatic sync
export function useOfflineSync<T>({
  key,
  fetchData,
  dependencies = [],
  enabled = true,
  syncInterval = 30000 // 30 seconds
}: UseOfflineDataOptions & { syncInterval?: number }) {
  const offlineData = useOfflineData({
    key,
    fetchData,
    dependencies,
    enabled
  });

  useEffect(() => {
    if (!enabled || !pwaManager.isAppOnline()) return;

    const interval = setInterval(() => {
      if (pwaManager.isAppOnline()) {
        offlineData.refresh();
      }
    }, syncInterval);

    return () => clearInterval(interval);
  }, [enabled, syncInterval, offlineData.refresh]);

  return offlineData;
}

// Hook for managing offline data with background sync
export function useOfflineBackgroundSync<T>({
  key,
  fetchData,
  dependencies = [],
  enabled = true
}: UseOfflineDataOptions) {
  const offlineData = useOfflineData({
    key,
    fetchData,
    dependencies,
    enabled
  });

  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (!document.hidden && pwaManager.isAppOnline()) {
        // Refresh data when app becomes visible and online
        offlineData.refresh();
      }
    };

    const handleFocus = () => {
      if (pwaManager.isAppOnline()) {
        // Refresh data when window gains focus and online
        offlineData.refresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [enabled, offlineData.refresh]);

  return offlineData;
}
