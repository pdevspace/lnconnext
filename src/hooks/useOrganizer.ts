'use client';

import { useState, useEffect } from 'react';
import { Organizer, OrganizerFilters, OrganizerStats } from '@/types/organizer';

interface UseOrganizerResult {
  organizer: Organizer | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  deleteOrganizer: () => Promise<void>;
  updateOrganizer: (data: any) => Promise<void>;
}

export function useOrganizer(organizerId: string): UseOrganizerResult {
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizer = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/organizer/get/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizerId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch organizer');
      }

      setOrganizer(data.data);
    } catch (err) {
      console.error('Error fetching organizer:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch organizer');
    } finally {
      setLoading(false);
    }
  };

  const updateOrganizer = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/organizer/update/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizerId, ...data }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update organizer');
      }

      // Refetch the organizer data
      await fetchOrganizer();
    } catch (err) {
      console.error('Error updating organizer:', err);
      setError(err instanceof Error ? err.message : 'Failed to update organizer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganizer = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/organizer/delete/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizerId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete organizer');
      }

      setOrganizer(null);
    } catch (err) {
      console.error('Error deleting organizer:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete organizer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizerId) {
      fetchOrganizer();
    }
  }, [organizerId]);

  return {
    organizer,
    loading,
    error,
    refetch: fetchOrganizer,
    updateOrganizer,
    deleteOrganizer,
  };
}

interface UseOrganizersResult {
  organizers: Organizer[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createOrganizer: (data: any) => Promise<Organizer>;
}

export function useOrganizers(filters: OrganizerFilters = {}): UseOrganizersResult {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/organizer/list/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch organizers');
      }

      setOrganizers(data.data);
    } catch (err) {
      console.error('Error fetching organizers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch organizers');
    } finally {
      setLoading(false);
    }
  };

  const createOrganizer = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/organizer/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create organizer');
      }

      // Refetch organizers to include the new one
      await fetchOrganizers();
      
      return result.data;
    } catch (err) {
      console.error('Error creating organizer:', err);
      setError(err instanceof Error ? err.message : 'Failed to create organizer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, [JSON.stringify(filters)]);

  return {
    organizers,
    loading,
    error,
    refetch: fetchOrganizers,
    createOrganizer,
  };
}

interface UseOrganizerStatsResult {
  stats: OrganizerStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOrganizerStats(organizerId: string): UseOrganizerStatsResult {
  const [stats, setStats] = useState<OrganizerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/organizer/stats/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizerId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch organizer stats');
      }

      setStats(data.data);
    } catch (err) {
      console.error('Error fetching organizer stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch organizer stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizerId) {
      fetchStats();
    }
  }, [organizerId]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
