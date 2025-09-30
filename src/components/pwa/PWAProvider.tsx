'use client';

import React, { useEffect, useState } from 'react';
import { InstallPrompt } from './InstallPrompt';
import { OfflineIndicator } from './OfflineIndicator';
import { PWAInstallGuide } from './PWAInstallGuide';
import { registerPWAServiceWorker, pwaManager } from '@/utils/pwa-utils';

interface PWAProviderProps {
  children: React.ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] = useState(false);

  useEffect(() => {
    // Register service worker on mount
    const registerSW = async () => {
      const registered = await registerPWAServiceWorker();
      setIsServiceWorkerRegistered(registered);
      
      if (registered) {
        console.log('PWA Service Worker registered successfully');
      }
    };

    registerSW();

    // Set up PWA event listeners
    const handleOnlineStatusChange = () => {
      // Handle online/offline status changes
      console.log('PWA online status changed:', pwaManager.isAppOnline());
    };

    window.addEventListener('pwa-online-status-change', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('pwa-online-status-change', handleOnlineStatusChange);
    };
  }, []);

  return (
    <>
      {children}
      <InstallPrompt />
      <OfflineIndicator />
      <PWAInstallGuide />
    </>
  );
}
