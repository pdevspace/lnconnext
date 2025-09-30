// PWA Utility Functions
export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAInstallPrompt {
  show: () => Promise<void>;
  hide: () => void;
  isInstallable: boolean;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private isOnline = navigator.onLine;
  private installPrompt: PWAInstallPrompt | null = null;

  constructor() {
    this.setupEventListeners();
    this.checkInstallationStatus();
  }

  private setupEventListeners() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.updateInstallPrompt();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.updateInstallPrompt();
      console.log('PWA was installed');
    });

    // Listen for online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyOnlineStatusChange();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyOnlineStatusChange();
    });

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }

  private checkInstallationStatus() {
    // Check if app is running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }

    // Check if app is running in standalone mode on iOS
    if ((window.navigator as any).standalone === true) {
      this.isInstalled = true;
    }

    this.updateInstallPrompt();
  }

  private updateInstallPrompt() {
    const isInstallable = !this.isInstalled && this.deferredPrompt !== null;
    
    this.installPrompt = {
      show: async () => {
        if (this.deferredPrompt) {
          await this.deferredPrompt.prompt();
          const choiceResult = await this.deferredPrompt.userChoice;
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          this.deferredPrompt = null;
          this.updateInstallPrompt();
        }
      },
      hide: () => {
        this.deferredPrompt = null;
        this.updateInstallPrompt();
      },
      isInstallable
    };
  }

  private notifyOnlineStatusChange() {
    // Dispatch custom event for online status change
    window.dispatchEvent(new CustomEvent('pwa-online-status-change', {
      detail: { isOnline: this.isOnline }
    }));
  }

  // Public methods
  getInstallPrompt(): PWAInstallPrompt | null {
    return this.installPrompt;
  }

  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  isAppOnline(): boolean {
    return this.isOnline;
  }

  async registerServiceWorker(): Promise<boolean> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);
        return true;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return false;
      }
    }
    return false;
  }

  async updateServiceWorker(): Promise<boolean> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          return true;
        }
      } catch (error) {
        console.error('Service Worker update failed:', error);
      }
    }
    return false;
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission;
    }
    return 'denied';
  }

  async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  // Cache management
  async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
  }

  async getCacheSize(): Promise<number> {
    if ('caches' in window) {
      let totalSize = 0;
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }
      
      return totalSize;
    }
    return 0;
  }

  // Offline data management
  async storeOfflineData(key: string, data: any): Promise<void> {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(`offline_${key}`, serializedData);
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  }

  async getOfflineData(key: string): Promise<any> {
    try {
      const serializedData = localStorage.getItem(`offline_${key}`);
      return serializedData ? JSON.parse(serializedData) : null;
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return null;
    }
  }

  async clearOfflineData(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      const offlineKeys = keys.filter(key => key.startsWith('offline_'));
      offlineKeys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }
}

// Create singleton instance
export const pwaManager = new PWAManager();

// Utility functions
export const isPWAInstalled = (): boolean => {
  return pwaManager.isAppInstalled();
};

export const isPWAOnline = (): boolean => {
  return pwaManager.isAppOnline();
};

export const getPWAInstallPrompt = (): PWAInstallPrompt | null => {
  return pwaManager.getInstallPrompt();
};

export const registerPWAServiceWorker = (): Promise<boolean> => {
  return pwaManager.registerServiceWorker();
};

export const requestPWANotificationPermission = (): Promise<NotificationPermission> => {
  return pwaManager.requestNotificationPermission();
};

export const sendPWANotification = (title: string, options?: NotificationOptions): Promise<void> => {
  return pwaManager.sendNotification(title, options);
};

// Device detection utilities
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobileDevice()) {
    return 'mobile';
  }
  
  if (window.innerWidth >= 768 && window.innerWidth < 1024) {
    return 'tablet';
  }
  
  return 'desktop';
};

// Performance utilities
export const getConnectionInfo = (): any => {
  if ('connection' in navigator) {
    return {
      effectiveType: (navigator as any).connection.effectiveType,
      downlink: (navigator as any).connection.downlink,
      rtt: (navigator as any).connection.rtt,
      saveData: (navigator as any).connection.saveData
    };
  }
  return null;
};

export const isSlowConnection = (): boolean => {
  const connection = getConnectionInfo();
  if (connection) {
    return connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g' ||
           connection.saveData === true;
  }
  return false;
};
