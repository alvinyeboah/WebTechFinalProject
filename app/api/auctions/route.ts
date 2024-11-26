import { NextResponse } from 'next/server';
import { AuctionService } from '@/services/auctionService';
import { createApiResponse } from '@/lib/utils/error-handling';



const auctionService = new AuctionService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    const auctions = await auctionService.getAuctions({ 
      status: status as any, 
      source: source as any 
    });

    return NextResponse.json(createApiResponse(200, auctions));
  } catch (error) {
    console.error('Auction fetch error:', error);
    return NextResponse.json(
      createApiResponse(500, null, 'Failed to fetch auctions'),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {

    const body = await request.json();
    const auction = await auctionService.createAuction(body);

    return NextResponse.json(
      createApiResponse(201, auction),
      { status: 201 }
    );
  } catch (error) {
    console.error('Auction creation error:', error);
    return NextResponse.json(
      createApiResponse(500, null, 'Failed to create auction'),
      { status: 500 }
    );
  }
} 