import { User, AuthResponse } from '../types/user';
import { Artwork } from '../types/artwork';
import { Bid } from '../types/bid';
import { ApiResponse } from '../types/api';

import { useState, useEffect } from 'react';

export const useArtwork = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtworks = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('/api/artworks');
      const data: ApiResponse<Artwork[]> = await response.json();
      setArtworks(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getArtworkById = (id: string): Artwork | undefined => {
    return artworks.find(artwork => artwork.id === id);
  };

  return {
    artworks,
    loading,
    error,
    fetchArtworks,
    getArtworkById
  };
};
