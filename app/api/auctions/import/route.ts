import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ExternalArtService } from '@/services/externalArtService';
import { createApiResponse } from '@/lib/utils/error-handling';

const externalArtService = new ExternalArtService();

export async function POST(request: NextRequest) {
  try {
    const { source, id } = await request.json();

    let auctionId: string;
    if (source === 'AIC') {
      auctionId = await externalArtService.importFromAIC(id);
    } else if (source === 'MET') {
      auctionId = await externalArtService.importFromMET(Number(id));
    } else {
      throw new Error('Invalid source');
    }

    return NextResponse.json(createApiResponse(201, { auctionId }));
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      createApiResponse(500, null, error.message),
      { status: 500 }
    );
  }
} 