import { useState, useCallback } from 'react';
import { Auction } from '@/types/auction';
import { Bid } from '@/types/bid';
import { useWebSocket } from './useWebSocket';


export function useAuction(auctionId: string) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { sendMessage } = useWebSocket(`/ws/auctions/${auctionId}`);

  const fetchAuction = useCallback(async () => {
    try {
      setLoading(true);
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

      const data = await response.json();
      sendMessage({
        type: 'NEW_BID',
        data: data.data
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bid');
      return false;
    }
  };

  return {
    auction,
    loading,
    error,
    fetchAuction,
    placeBid
  };
} 