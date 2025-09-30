'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { isPWAOnline } from '@/utils/pwa-utils';

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const checkOnlineStatus = () => {
      const online = isPWAOnline();
      setIsOnline(online);
      
      // Show indicator when going offline or coming back online
      if (!online) {
        setShowIndicator(true);
      } else if (showIndicator) {
        // Hide indicator after 3 seconds when coming back online
        setTimeout(() => setShowIndicator(false), 3000);
      }
    };

    // Initial check
    checkOnlineStatus();

    // Listen for online/offline events
    const handleOnlineStatusChange = () => {
      checkOnlineStatus();
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    window.addEventListener('pwa-online-status-change', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      window.removeEventListener('pwa-online-status-change', handleOnlineStatusChange);
    };
  }, [showIndicator]);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!showIndicator && isOnline) {
    return null;
  }

  return (
    <Card className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
      isOnline 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800'
    } ${className}`}>
      <div className="p-3">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {isOnline ? (
              <Wifi className="w-5 h-5" />
            ) : (
              <WifiOff className="w-5 h-5" />
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-medium">
              {isOnline ? 'Back Online' : 'You\'re Offline'}
            </p>
            <p className="text-xs opacity-90">
              {isOnline 
                ? 'Your connection has been restored' 
                : 'Some features may not be available'
              }
            </p>
          </div>
          
          {!isOnline && (
            <button
              onClick={handleRefresh}
              className="flex-shrink-0 p-1 rounded-md hover:bg-red-100 transition-colors"
              title="Try to reconnect"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
