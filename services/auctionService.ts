import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Bid, BidStatus } from '@/types/bid';
import { ApiError } from '@/lib/api-client';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Auction, AuctionStatus } from '@/types/auction';

// Add interface for auction rows
interface AuctionRow extends RowDataPacket, Auction {}

// Add interface for bid rows
interface BidRow extends RowDataPacket, Bid {}

export class AuctionService {
  async createAuction(data: Partial<Auction>): Promise<Auction> {
    const id = uuidv4();
    const [result] = await db.query(
      `INSERT INTO Auctions (
        id, artwork_id, start_price, current_price, 
        min_bid_increment, start_time, end_time, status, source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.artwork_id,
        data.start_price,
        data.start_price, // Initial current_price equals start_price
        data.min_bid_increment,
        data.start_time,
        data.end_time,
        'PENDING',
        data.source
      ]
    );

    return this.getAuctionById(id);
  }

  async getAuctionById(id: string): Promise<Auction> {
    const [auctions] = await db.query<AuctionRow[]>(
      'SELECT * FROM Auctions WHERE id = ?',
      [id]
    );

    if (!auctions.length) {
      throw new ApiError(404, 'Auction not found');
    }

    return auctions[0];
  }

  async placeBid(auctionId: string, userId: string, amount: number): Promise<Bid> {
    const auction = await this.getAuctionById(auctionId);

    // Validate auction status
    if (auction.status !== 'ACTIVE') {
      throw new ApiError(400, 'Auction is not active');
    }

    // Validate bid amount
    if (amount <= auction.current_price) {
      throw new ApiError(400, 'Bid amount must be higher than current price');
    }

    if (amount < auction.current_price + auction.min_bid_increment) {
      throw new ApiError(400, `Minimum bid increment is $${auction.min_bid_increment}`);
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Update previous winning bid to OUTBID
      await connection.query(
        'UPDATE Bids SET status = ? WHERE auction_id = ? AND status = ?',
        ['OUTBID', auctionId, 'ACTIVE']
      );

      // Create new bid
      const bidId = uuidv4();
      await connection.query(
        'INSERT INTO Bids (id, auction_id, user_id, amount) VALUES (?, ?, ?, ?)',
        [bidId, auctionId, userId, amount]
      );

      // Update auction current price
      await connection.query(
        'UPDATE Auctions SET current_price = ? WHERE id = ?',
        [amount, auctionId]
      );

      await connection.commit();

      const [bids] = await connection.query<BidRow[]>(
        'SELECT * FROM Bids WHERE id = ?',
        [bidId]
      );

      return bids[0];
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getAuctions(filters: {
    status?: AuctionStatus;
    userId?: string;
    source?: string;
  } = {}): Promise<Auction[]> {
    let query = 'SELECT * FROM Auctions WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.source) {
      query += ' AND source = ?';
      params.push(filters.source);
    }

    query += ' ORDER BY created_at DESC';

    const [auctions] = await db.query<AuctionRow[]>(query, params);
    return auctions;
  }

  async updateAuctionStatus(id: string, status: AuctionStatus): Promise<void> {
    await db.query(
      'UPDATE Auctions SET status = ? WHERE id = ?',
      [status, id]
    );
  }
} 