"use client";

import { useState, useEffect, useRef } from "react";
import { getEventById } from "@/data/EventService";
import { EventComponent } from "./EventComponent";
import { Event } from "@/types/event";

interface EventPageProps {
  eventId: string;
}

export function EventPage({ eventId }: EventPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = getEventById(eventId);
        
        if (!eventData) {
          setError("Event not found");
          return;
        }
        
        setEvent(eventData);
      } catch (err) {
        setError("Failed to load event");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div 
        ref={scrollContainerRef}
        className="fixed inset-0 top-16 overflow-y-auto bg-white dark:bg-gray-900"
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading event...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div 
        ref={scrollContainerRef}
        className="fixed inset-0 top-16 overflow-y-auto bg-white dark:bg-gray-900"
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Event Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error || "The event you're looking for doesn't exist or has been removed."}
              </p>
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Back to Home
              </a>
            </div>
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