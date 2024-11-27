import { NextRequest } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { AUTH_COOKIE_NAME } from '@/lib/constants';
import { NextResponse } from 'next/server';
import { AuctionService } from '@/services/auctionService';
import { createApiResponse } from '@/lib/utils/error-handling';

const auctionService = new AuctionService();

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      throw new Error('Unauthorized');
    }

    const user = await getUserFromToken(token);
    if (!user) {
      throw new Error('Invalid token');
    }

    const { amount } = await request.json();
    const bid = await auctionService.placeBid(
      params.id,
      user.id,
      amount
    );

    return NextResponse.json(createApiResponse(201, bid));
  } catch (error: any) {
    console.error('Bid placement error:', error);
    return NextResponse.json(
      createApiResponse(error.status || 500, null, error.message),
      { status: error.status || 500 }
    );
  }
} 