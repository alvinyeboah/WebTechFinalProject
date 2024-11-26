// hooks/useArtwork.ts
import { useState, useEffect } from 'react';
import { Artwork } from '@/types/artwork';
import { ApiResponseType } from '@/types/api';
import { ArtworkService } from '@/services/artworkService';

const artworkService = new ArtworkService();
const API_URL = '/api/artworks';

export const useArtwork = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtworks = async (query?: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch local artworks
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponseType<Artwork[]> = await response.json();
      
      if ('error' in data) {
        throw new Error(data.error);
      }
      
      let combinedArtworks = data.data;

      // If there's a search query, fetch from external APIs
      if (query) {
        const externalArtworks = await artworkService.searchArtworks(query);
        combinedArtworks = [...combinedArtworks, ...externalArtworks];
      }
      
      setArtworks(combinedArtworks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching artworks';
      setError(errorMessage);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getArtworkById = async (id: string): Promise<Artwork | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if it's an external artwork
      if (id.startsWith('AIC_') || id.startsWith('MET_')) {
        return await artworkService.getArtworkDetails(id);
      }
      
      // Otherwise fetch from local API
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