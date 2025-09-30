'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { EventFilters } from '@/models/event';

interface UseEventResult {
  event: Event | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEvent(eventId: string): UseEventResult {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/event/get/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch event');
      }

      // Convert string dates to Date objects
      const eventWithDates = {
        ...data.data,
        startDate: new Date(data.data.startDate),
        endDate: data.data.endDate ? new Date(data.data.endDate) : undefined,
        createdAt: new Date(data.data.createdAt),
        updatedAt: new Date(data.data.updatedAt),
        sections: data.data.sections?.map((section: any) => ({
          ...section,
          startTime: new Date(section.startTime),
          endTime: new Date(section.endTime),
          bitcoiners: section.bitcoiners?.map((bitcoiner: any) => ({
            ...bitcoiner,
            socialMedia: bitcoiner.socialMedia?.map((sm: any) => ({
              ...sm,
              createdAt: new Date(sm.createdAt),
              updatedAt: new Date(sm.updatedAt)
            })) || []
          })) || []
        })) || [],
        bitcoiners: data.data.bitcoiners?.map((bitcoiner: any) => ({
          ...bitcoiner,
          socialMedia: bitcoiner.socialMedia?.map((sm: any) => ({
            ...sm,
            createdAt: new Date(sm.createdAt),
            updatedAt: new Date(sm.updatedAt)
          })) || []
        })) || [],
        websites: data.data.websites?.map((website: any) => ({
          ...website,
          createdAt: new Date(website.createdAt),
          updatedAt: new Date(website.updatedAt)
        })) || []
      };
      
      setEvent(eventWithDates);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  return {
    event,
    loading,
    error,
    refetch: fetchEvent,
  };
}

interface UseEventsResult {
  events: Event[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEvents(filters: EventFilters = {}): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/event/list/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch events');
      }

      // Convert string dates to Date objects
      const eventsWithDates = data.data.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: event.endDate ? new Date(event.endDate) : undefined,
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
        sections: event.sections?.map((section: any) => ({
          ...section,
          startTime: new Date(section.startTime),
          endTime: new Date(section.endTime),
          bitcoiners: section.bitcoiners?.map((bitcoiner: any) => ({
            ...bitcoiner,
            socialMedia: bitcoiner.socialMedia?.map((sm: any) => ({
              ...sm,
              createdAt: new Date(sm.createdAt),
              updatedAt: new Date(sm.updatedAt)
            })) || []
          })) || []
        })) || [],
        bitcoiners: event.bitcoiners?.map((bitcoiner: any) => ({
          ...bitcoiner,
          socialMedia: bitcoiner.socialMedia?.map((sm: any) => ({
            ...sm,
            createdAt: new Date(sm.createdAt),
            updatedAt: new Date(sm.updatedAt)
          })) || []
        })) || [],
        websites: event.websites?.map((website: any) => ({
          ...website,
          createdAt: new Date(website.createdAt),
          updatedAt: new Date(website.updatedAt)
        })) || []
      }));
      
      setEvents(eventsWithDates);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [JSON.stringify(filters)]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  };
}

interface UseUpcomingEventsResult {
  events: Event[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUpcomingEvents(limit: number = 10): UseUpcomingEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/event/upcoming/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limit }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch upcoming events');
      }

      // Convert string dates to Date objects
      const eventsWithDates = data.data.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: event.endDate ? new Date(event.endDate) : undefined,
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
        bitcoiners: event.bitcoiners?.map((bitcoiner: any) => ({
          ...bitcoiner,
          socialMedia: bitcoiner.socialMedia?.map((sm: any) => ({
            ...sm,
            createdAt: new Date(sm.createdAt),
            updatedAt: new Date(sm.updatedAt)
          })) || []
        })) || [],
        websites: event.websites?.map((website: any) => ({
          ...website,
          createdAt: new Date(website.createdAt),
          updatedAt: new Date(website.updatedAt)
        })) || []
      }));
      
      setEvents(eventsWithDates);
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch upcoming events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [limit]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  };
}

interface UsePastEventsResult {
  events: Event[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePastEvents(limit: number = 10): UsePastEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/event/past/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limit }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch past events');
      }

      // Convert string dates to Date objects
      const eventsWithDates = data.data.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: event.endDate ? new Date(event.endDate) : undefined,
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
        bitcoiners: event.bitcoiners?.map((bitcoiner: any) => ({
          ...bitcoiner,
          socialMedia: bitcoiner.socialMedia?.map((sm: any) => ({
            ...sm,
            createdAt: new Date(sm.createdAt),
            updatedAt: new Date(sm.updatedAt)
          })) || []
        })) || [],
        websites: event.websites?.map((website: any) => ({
          ...website,
          createdAt: new Date(website.createdAt),
          updatedAt: new Date(website.updatedAt)
        })) || []
      }));
      
      setEvents(eventsWithDates);
    } catch (err) {
      console.error('Error fetching past events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch past events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [limit]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  };
}
