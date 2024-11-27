import { useState, useEffect, useCallback } from 'react';
import { Auction } from '@/types/auction';
import { Bid } from '@/types/bid';

const POLLING_INTERVAL = 5000; // Poll every 5 seconds

export function useAuction(auctionId: string) {
  const [auction, setAuction] = useState<(Auction & { bids: Bid[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuction = useCallback(async () => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch auction');
      }
      const data = await response.json();
      setAuction(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  const placeBid = async (amount: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to place bid');
      }

      await fetchAuction(); // Refresh auction data
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bid');
      return false;
    }
  };

  // Poll for updates
  useEffect(() => {
    fetchAuction();
    const interval = setInterval(fetchAuction, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchAuction]);

  return {
    auction,
    loading,
    error,
    placeBid,
    refreshAuction: fetchAuction
  };
} 