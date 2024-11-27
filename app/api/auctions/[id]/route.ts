import { NextResponse } from 'next/server';
import { AuctionService } from '@/services/auctionService';
import { createApiResponse } from '@/lib/utils/error-handling';

const auctionService = new AuctionService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auction = await auctionService.getAuctionWithBids(params.id);
    return NextResponse.json(createApiResponse(200, auction));
  } catch (error) {
    console.error('Auction fetch error:', error);
    return NextResponse.json(
      createApiResponse(500, null, 'Failed to fetch auction'),
      { status: 500 }
    );
  }
} 