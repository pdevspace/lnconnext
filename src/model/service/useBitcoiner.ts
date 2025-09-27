'use client';

import { useState, useCallback, useEffect } from 'react';
import { Bitcoiner, BitcoinerFormData } from '@/model/bitcoiner';

export const useBitcoiner = (id?: string) => {
  const [bitcoiner, setBitcoiner] = useState<Bitcoiner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBitcoiner = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bitcoiner/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch bitcoiner');
      }
      
      setBitcoiner(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateBitcoiner = useCallback(async (data: BitcoinerFormData) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bitcoiner/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update bitcoiner');
      }
      
      setBitcoiner(result.data);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  const deleteBitcoiner = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bitcoiner/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete bitcoiner');
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBitcoiner();
  }, [fetchBitcoiner]);

  return { 
    bitcoiner, 
    loading, 
    error, 
    updateBitcoiner, 
    deleteBitcoiner,
    refetch: fetchBitcoiner 
  };
};

export const useBitcoiners = () => {
  const [bitcoiners, setBitcoiners] = useState<Bitcoiner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBitcoiners = useCallback(async (filters?: { search?: string; platform?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bitcoiner/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters || {}),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch bitcoiners');
      }
      
      setBitcoiners(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBitcoiner = useCallback(async (data: BitcoinerFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bitcoiner/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create bitcoiner');
      }
      
      setBitcoiners(prev => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBitcoiners();
  }, [fetchBitcoiners]);

  return { 
    bitcoiners, 
    loading, 
    error, 
    fetchBitcoiners, 
    createBitcoiner 
  };
};
