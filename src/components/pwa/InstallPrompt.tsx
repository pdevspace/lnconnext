'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';
import { getPWAInstallPrompt, isPWAInstalled } from '@/utils/pwa-utils';

interface InstallPromptProps {
  onDismiss?: () => void;
  className?: string;
}

export function InstallPrompt({ onDismiss, className }: InstallPromptProps) {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkInstallStatus = () => {
      const prompt = getPWAInstallPrompt();
      const installed = isPWAInstalled();
      
      setInstallPrompt(prompt);
      setIsInstalled(installed);
      
      // Show prompt if installable and not dismissed before
      if (prompt?.isInstallable && !installed) {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setIsVisible(true);
        }
      }
    };

    checkInstallStatus();

    // Listen for changes
    const handlePromptChange = () => checkInstallStatus();
    window.addEventListener('beforeinstallprompt', handlePromptChange);
    window.addEventListener('appinstalled', handlePromptChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePromptChange);
      window.removeEventListener('appinstalled', handlePromptChange);
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      try {
        await installPrompt.show();
        setIsVisible(false);
      } catch (error) {
        console.error('Error showing install prompt:', error);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    onDismiss?.();
  };

  if (!isVisible || isInstalled || !installPrompt?.isInstallable) {
    return null;
  }

  return (
    <Card className={`fixed bottom-4 left-4 right-4 z-50 bg-white shadow-lg border-0 md:left-auto md:right-4 md:w-80 ${className}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Install App</h3>
              <p className="text-sm text-gray-600">Get the full experience</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Install Bitcoin Events on your device for quick access and offline browsing.
          </p>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleInstall}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Install
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="px-4"
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
