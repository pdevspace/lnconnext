'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, Chrome, Share, Plus } from 'lucide-react';
import { isMobileDevice, isPWAInstalled } from '@/utils/pwa-utils';

interface PWAInstallGuideProps {
  className?: string;
}

export function PWAInstallGuide({ className }: PWAInstallGuideProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  React.useEffect(() => {
    const installed = isPWAInstalled();
    setIsInstalled(installed);
    
    // Show guide if not installed and on mobile
    if (!installed && isMobileDevice()) {
      const dismissed = localStorage.getItem('pwa-guide-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-guide-dismissed', 'true');
  };

  if (!isVisible || isInstalled) {
    return null;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  return (
    <Card className={`fixed inset-4 z-50 bg-white shadow-2xl border-0 max-w-md mx-auto ${className}`}>
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Install Bitcoin Events</h2>
          <p className="text-gray-600">
            Get the full app experience on your mobile device
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {isIOS ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Share className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Step 1</h3>
                  <p className="text-sm text-gray-600">
                    Tap the Share button in Safari
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Step 2</h3>
                  <p className="text-sm text-gray-600">
                    Tap "Add to Home Screen"
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Download className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Step 3</h3>
                  <p className="text-sm text-gray-600">
                    Tap "Add" to install the app
                  </p>
                </div>
              </div>
            </div>
          ) : isAndroid ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Chrome className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Step 1</h3>
                  <p className="text-sm text-gray-600">
                    Open this site in Chrome browser
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Plus className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Step 2</h3>
                  <p className="text-sm text-gray-600">
                    Tap the "Install" button when it appears
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Download className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Step 3</h3>
                  <p className="text-sm text-gray-600">
                    Tap "Install" to add to home screen
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">
                This app works best on mobile devices. 
                Open this site on your phone for the full experience.
              </p>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="flex-1"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleDismiss}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
          >
            Got It
          </Button>
        </div>
      </div>
    </Card>
  );
}
