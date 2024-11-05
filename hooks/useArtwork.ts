// hooks/useArtwork.ts
import { useState, useEffect } from 'react';
import { Artwork } from '@/types/artwork';
import { ApiResponseType } from '@/types/api';

const API_URL = '/api/artworks';

export const useArtwork = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtworks = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponseType<Artwork[]> = await response.json();
      
      if ('error' in data) {
        throw new Error(data.error);
      }
      
      setArtworks(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching artworks';
      setError(errorMessage);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const getArtworkById = async (id: string): Promise<Artwork | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponseType<Artwork> = await response.json();
      
      if ('error' in data) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching artwork';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    artworks,
    loading,
    error,
    fetchArtworks,
    getArtworkById
  };
};