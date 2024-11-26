import { useApi } from './useApi';
import { apiClient } from '@/lib/api-client';
import { Artwork } from '@/types/artwork';

export function useArtworkApi() {
  const {
    data: artworks,
    loading: artworksLoading,
    error: artworksError,
    execute: fetchArtworks
  } = useApi(apiClient.getArtworks);

  const {
    data: artwork,
    loading: artworkLoading,
    error: artworkError,
    execute: fetchArtwork
  } = useApi(apiClient.getArtworkById);

  return {
    artworks,
    artwork,
    artworksLoading,
    artworkLoading,
    artworksError,
    artworkError,
    fetchArtworks,
    fetchArtwork
  };
} 