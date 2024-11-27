import { useState, useCallback, useRef, useEffect } from 'react';
import { Artwork, ExternalArtwork } from '@/types/artwork';
import { ArtworkService } from '@/services/artworkService';

const artworkService = new ArtworkService();
const DEBOUNCE_DELAY = 500;

export const useArtwork = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const fetchArtworks = useCallback(async (query: string = "masterpiece"): Promise<void> => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = await artworkService.searchArtworks(query);
      const transformedResults = results.map(ext => ({
        artwork_id: ext.id,
        title: ext.title,
        description: ext.description || '',
        artist: { id: 'external', name: ext.artist },
        images: ext.images,
        category: 'OTHER' as const,
        condition: 'GOOD' as const,
        status: 'ACTIVE' as const,
        currentPrice: 0,
        startingPrice: 0,
        bids: [],
        views: 0,
        favorites: 0,
        auctionStart: new Date(),
        auctionEnd: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        source: ext.source,
        year: ext.year || '',
        medium: ext.medium || '',
        dimensions: ext.dimensions
      }));
      setArtworks(transformedResults);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message
        : 'An unexpected error occurred while fetching artworks';
      setError(errorMessage);
      console.error('[useArtwork] fetchArtworks error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getArtworkById = useCallback(async (id: string): Promise<Artwork | null> => {
    if (loading) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const externalArtwork = await artworkService.getArtworkById(id);
      
      // Transform external artwork to match Artwork type
      return {
        artwork_id: externalArtwork.id,
        title: externalArtwork.title,
        description: externalArtwork.description || '',
        artist: {
          id: `${externalArtwork.source}_ARTIST_${externalArtwork.id}`,
          name: externalArtwork.artist
        },
        images: externalArtwork.images,
        category: 'OTHER',
        medium: externalArtwork.medium || 'Unknown',
        year: externalArtwork.year || 'Unknown',
        condition: 'GOOD',
        currentPrice: externalArtwork.currentPrice || 0,
        startingPrice: 0,
        status: 'ACTIVE',
        bids: [],
        views: 0,
        favorites: 0,
        auctionStart: new Date(),
        auctionEnd: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        source: externalArtwork.source,
        dimensions: externalArtwork.dimensions
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching artwork';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return {
    artworks,
    loading,
    error,
    fetchArtworks,
    getArtworkById
  };
};