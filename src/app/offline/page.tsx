import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <WifiOff className="w-8 h-8 text-red-600" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Offline</h1>
            <p className="text-gray-600">
              It looks like you're not connected to the internet. Some features may not be available, 
              but you can still browse cached content.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={handleRefresh}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>While offline, you can still:</p>
            <ul className="mt-2 space-y-1">
              <li>• View cached bitcoiner profiles</li>
              <li>• Browse previously loaded events</li>
              <li>• Access saved organizer information</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
