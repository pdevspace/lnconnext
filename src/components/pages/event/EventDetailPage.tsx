'use client';

import { useRef } from 'react';
import { EventComponent } from './EventComponent';
import { useEvent } from '@/hooks/useEvent';

interface EventDetailPageProps {
  eventId: string;
}

export function EventDetailPage({ eventId }: EventDetailPageProps) {
  const { event, loading, error } = useEvent(eventId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <div 
        ref={scrollContainerRef}
        className="fixed inset-0 top-16 overflow-y-auto bg-white dark:bg-gray-900"
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        ref={scrollContainerRef}
        className="fixed inset-0 top-16 overflow-y-auto bg-white dark:bg-gray-900"
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div 
        ref={scrollContainerRef}
        className="fixed inset-0 top-16 overflow-y-auto bg-white dark:bg-gray-900"
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist.</p>
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="fixed inset-0 top-16 overflow-y-auto bg-white dark:bg-gray-900"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div className="container mx-auto px-4 py-8">
        <EventComponent event={event} />
      </div>
    </div>
  );
}