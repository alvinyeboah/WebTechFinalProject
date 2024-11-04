export interface Bid {
    id: string;
    artworkId: string;
    userId: string;
    amount: number;
    timestamp: Date;
    status: BidStatus;
    automaticBid?: boolean;
    maxBidAmount?: number;
  }
  
  export type BidStatus =
    | 'PLACED'
    | 'ACTIVE'
    | 'OUTBID'
    | 'WON'
    | 'LOST'
    | 'CANCELLED';
  
  export interface BidHistory {
    bids: Bid[];
    totalBids: number;
    highestBid: number;
    lowestBid: number;
    averageBid: number;
    bidders: number;
  }