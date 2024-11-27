import { Bid } from './bid';
import { User } from './user';

export type AuctionStatus = 'PENDING' | 'ACTIVE' | 'ENDED' | 'CANCELLED';

export interface Auction {
  id: string;
  artwork_id: string;
  start_price: number;
  current_price: number;
  min_bid_increment: number;
  start_time: Date;
  end_time: Date;
  status: AuctionStatus;
  winner_id?: string;
  source: 'LOCAL' | 'AIC' | 'MET';
  created_at: Date;
  updated_at: Date;
  bids?: Bid[];
  winner?: User;
}

export interface CreateAuctionDTO {
  artwork_id: string;
  start_price: number;
  min_bid_increment: number;
  start_time: Date;
  end_time: Date;
  source: 'LOCAL' | 'AIC' | 'MET';
} 