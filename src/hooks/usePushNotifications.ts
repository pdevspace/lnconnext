import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/NotificationService';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeNotifications = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const initialized = await notificationService.initialize();
        setIsSupported(initialized);

        if (initialized) {
          const currentPermission = await notificationService.requestPermission();
          setPermission(currentPermission);

          const subscribed = await notificationService.isSubscribed();
          setIsSubscribed(subscribed);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize notifications');
      } finally {
        setIsLoading(false);
      }
    };

    initializeNotifications();
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Push notifications are not supported');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const subscription = await notificationService.subscribeToPush();
      if (subscription) {
        setIsSubscribed(true);
        setPermission('granted');
        return true;
      } else {
        setError('Failed to subscribe to push notifications');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await notificationService.unsubscribeFromPush();
      if (success) {
        setIsSubscribed(false);
        return true;
      } else {
        setError('Failed to unsubscribe from push notifications');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      await notificationService.sendNotification(title, options);
    }
  }, [permission]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    setIsLoading(true);
    setError(null);

    try {
      const newPermission = await notificationService.requestPermission();
      setPermission(newPermission);
      return newPermission;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request permission');
      return 'denied';
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    sendNotification,
    requestPermission
  };
}
