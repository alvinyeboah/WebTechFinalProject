import { useApi } from './useApi';
import { apiClient } from '@/lib/api-client';
import { useCallback } from 'react';
import { useBidding } from './useBidding';

export function useBiddingApi(artworkId: string) {
  const {
    currentBid,
    bidHistory,
    bidError,
    validateBid
  } = useBidding(artworkId);

  const {
    loading: placeBidLoading,
    error: placeBidError,
    execute: executePlaceBid
  } = useApi(apiClient.placeBid);

  const placeBid = useCallback(async (amount: number) => {
    const validation = validateBid(amount);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid bid');
    }
    return executePlaceBid(artworkId, amount);
  }, [artworkId, executePlaceBid, validateBid]);

  return {
    currentBid,
    bidHistory,
    bidError,
    placeBidLoading,
    placeBidError,
    placeBid
  };
} 