import { useState, useEffect, useCallback } from 'react';
import { Bid, BidStatus, BidHistory } from '@/types/bid';
import { ApiResponse } from '@/types/api';
import { Notification, NotificationType } from '@/types/notification';

interface BidValidationRules {
  minIncrement: number;
  maxBidLimit: number;
  timeWindow: number; // minimum time between bids in seconds
  requiredFields: (keyof Bid)[];
}

interface BidStats extends BidHistory {
  bidFrequency: {
    lastHour: number;
    lastDay: number;
    lastWeek: number;
  };
  userRank: {
    position: number;
    totalBidders: number;
  };
  priceStats: {
    medianBid: number;
    standardDeviation: number;
    percentageIncrease: number;
  };
  timeStats: {
    averageTimeBetweenBids: number;
    peakBiddingHours: number[];
  };
}

export const useBidding = (artworkId: string) => {
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [bidHistory, setBidHistory] = useState<BidStats>({
    bids: [],
    totalBids: 0,
    highestBid: 0,
    lowestBid: 0,
    averageBid: 0,
    bidders: 0,
    bidFrequency: { lastHour: 0, lastDay: 0, lastWeek: 0 },
    userRank: { position: 0, totalBidders: 0 },
    priceStats: { medianBid: 0, standardDeviation: 0, percentageIncrease: 0 },
    timeStats: { averageTimeBetweenBids: 0, peakBiddingHours: [] }
  });
  const [bidError, setBidError] = useState<string | null>(null);
  const [lastBidTime, setLastBidTime] = useState<Date | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  // Validation rules
  const validationRules: BidValidationRules = {
    minIncrement: 10, // minimum bid increment
    maxBidLimit: 1000000, // maximum allowed bid
    timeWindow: 5, // seconds between bids
    requiredFields: ['artworkId', 'userId', 'amount']
  };

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || '');
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ 
        type: 'SUBSCRIBE', 
        artworkId 
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleRealtimeUpdate(data);
    };

    setWebsocket(ws);

    return () => {
      ws.close();
    };
  }, [artworkId]);

  // Calculate detailed bid statistics
  const calculateDetailedStats = (bids: Bid[]): BidStats => {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 3600000);
    const dayAgo = new Date(now.getTime() - 86400000);
    const weekAgo = new Date(now.getTime() - 604800000);

    const amounts = bids.map(bid => bid.amount);
    const uniqueBidders = new Set(bids.map(bid => bid.userId));
    const sortedAmounts = [...amounts].sort((a, b) => a - b);

    // Calculate median
    const median = sortedAmounts.length % 2 === 0
      ? (sortedAmounts[sortedAmounts.length / 2 - 1] + sortedAmounts[sortedAmounts.length / 2]) / 2
      : sortedAmounts[Math.floor(sortedAmounts.length / 2)];

    // Calculate standard deviation
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const squareDiffs = amounts.map(value => Math.pow(value - mean, 2));
    const standardDeviation = Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / amounts.length);

    // Calculate percentage increase
    const percentageIncrease = bids.length >= 2
      ? ((bids[bids.length - 1].amount - bids[0].amount) / bids[0].amount) * 100
      : 0;

    // Calculate time-based statistics
    const bidTimes = bids.map(bid => new Date(bid.timestamp).getHours());
    const peakHours = Array.from({ length: 24 }, (_, i) => i)
      .map(hour => ({
        hour,
        count: bidTimes.filter(time => time === hour).length
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(peak => peak.hour);
    return {
      bids,
      totalBids: bids.length,
      highestBid: Math.max(...amounts, 0),
      lowestBid: bids.length ? Math.min(...amounts) : 0,
      averageBid: bids.length ? mean : 0,
      bidders: uniqueBidders.size,
      bidFrequency: {
        lastHour: bids.filter(bid => new Date(bid.timestamp) >= hourAgo).length,
        lastDay: bids.filter(bid => new Date(bid.timestamp) >= dayAgo).length,
        lastWeek: bids.filter(bid => new Date(bid.timestamp) >= weekAgo).length
      },
      userRank: {
        position: 0, // Updated separately for each user
        totalBidders: uniqueBidders.size
      },
      priceStats: {
        medianBid: median,
        standardDeviation,
        percentageIncrease
      },
      timeStats: {
        averageTimeBetweenBids: bids.length >= 2
          ? (new Date(bids[bids.length - 1].timestamp).getTime() - new Date(bids[0].timestamp).getTime()) / (bids.length - 1)
          : 0,
        peakBiddingHours: peakHours
      }
    };
  };

  // Validate bid
  const validateBid = (amount: number) => {
    // Implement your validation logic here
    const isValid = amount > 0; // Example validation
    return {
      valid: isValid,
      error: isValid ? null : 'Bid amount must be greater than zero',
    };
  };

  // Handle realtime updates
  const handleRealtimeUpdate = (data: { 
    type: string; 
    bid?: Bid; 
    notification?: Notification 
  }) => {
    switch (data.type) {
      case 'NEW_BID':
        if (data.bid) {
          setBidHistory(prev => {
            const newBids = [...prev.bids, data.bid!];
            return calculateDetailedStats(newBids);
          });
          setCurrentBid(data.bid.amount);
          setLastBidTime(new Date(data.bid.timestamp));
        }
        break;
      case 'BID_STATUS_UPDATE':
        if (data.bid) {
          updateBidStatus(data.bid.id, data.bid.status);
        }
        break;
    }
  };

  const placeBid = async (
    amount: number,
    userId: string,
    automaticBid?: boolean,
    maxBidAmount?: number
  ): Promise<boolean> => {
    // Validate bid
    const validation = validateBid(amount);
    if (!validation.valid) {
      setBidError(validation.error || 'Invalid bid');
      return false;
    }

    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          artworkId,
          amount,
          userId,
          automaticBid,
          maxBidAmount,
          timestamp: new Date()
        })
      });

      const data: ApiResponse<Bid> = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to place bid');
      }

      // Send bid to WebSocket
      websocket?.send(JSON.stringify({
        type: 'NEW_BID',
        bid: data.data
      }));

      return true;
    } catch (error) {
      setBidError(error instanceof Error ? error.message : 'An error occurred while placing bid');
      return false;
    }
  };

  const updateBidStatus = (bidId: string, newStatus: BidStatus): void => {
    setBidHistory(prev => {
      const updatedBids = prev.bids.map(bid => 
        bid.id === bidId ? { ...bid, status: newStatus } : bid
      );
      return calculateDetailedStats(updatedBids);
    });
  };

  const cancelBid = async (bidId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/bids/${bidId}/cancel`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to cancel bid');
      }

      // Send cancellation to WebSocket
      websocket?.send(JSON.stringify({
        type: 'BID_STATUS_UPDATE',
        bid: { id: bidId, status: 'CANCELLED' as BidStatus }
      }));

      return true;
    } catch (error) {
      setBidError(error instanceof Error ? error.message : 'Failed to cancel bid');
      return false;
    }
  };

  const clearBidError = (): void => {
    setBidError(null);
  };

  return {
    currentBid,
    bidHistory,
    bidError,
    placeBid,
    cancelBid,
    updateBidStatus,
    clearBidError,
    validateBid,
  };
};