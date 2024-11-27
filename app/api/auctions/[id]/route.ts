import { NextResponse } from 'next/server';
import { AuctionService } from '@/services/auctionService';
import { createApiResponse } from '@/lib/utils/error-handling';

const auctionService = new AuctionService();

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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