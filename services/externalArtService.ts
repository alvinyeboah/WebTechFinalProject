import { v4 as uuidv4 } from 'uuid';
import { AuctionService } from './auctionService';
import { CreateAuctionDTO } from '@/types/auction';

export class ExternalArtService {
  private auctionService: AuctionService;

  constructor() {
    this.auctionService = new AuctionService();
  }

  async importFromAIC(artworkId: string): Promise<string> {
    const response = await fetch(`https://api.artic.edu/api/v1/artworks/${artworkId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch artwork from AIC');
    }

    const data = await response.json();
    const artwork = data.data;

    const auctionData: CreateAuctionDTO = {
      artwork_id: artwork.id.toString(),
      title: artwork.title,
      image_url: artwork.image_id,
      description: artwork.description || artwork.thumbnail?.alt_text,
      category: this.mapCategory(artwork.artwork_type_title),
      start_price: 1000, // Default starting price
      current_price: 1000,
      min_bid_increment: 100,
      start_time: new Date(),
      end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'ACTIVE',
      source: 'AIC'
    };

    const auction = await this.auctionService.createAuction(auctionData);
    return auction.id;
  }

  async importFromMET(objectID: number): Promise<string> {
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
    if (!response.ok) {
      throw new Error('Failed to fetch artwork from MET');
    }

    const artwork = await response.json();

    const auctionData: CreateAuctionDTO = {
      artwork_id: objectID.toString(),
      title: artwork.title,
      image_url: artwork.primaryImage,
      description: artwork.description || artwork.objectName,
      category: this.mapCategory(artwork.objectName || artwork.classification),
      start_price: 1000, // Default starting price
      current_price: 1000,
      min_bid_increment: 100,
      start_time: new Date(),
      end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'ACTIVE',
      source: 'MET'
    };

    const auction = await this.auctionService.createAuction(auctionData);
    return auction.id;
  }

  private mapCategory(artworkType: string): 'PAINTING' | 'SCULPTURE' | 'DIGITAL_ART' | 'PHOTOGRAPHY' | 'PRINT' {
    artworkType = artworkType.toLowerCase();
    
    if (artworkType.includes('painting')) return 'PAINTING';
    if (artworkType.includes('sculpture')) return 'SCULPTURE';
    if (artworkType.includes('photograph')) return 'PHOTOGRAPHY';
    if (artworkType.includes('print')) return 'PRINT';
    if (artworkType.includes('digital')) return 'DIGITAL_ART';
    
    return 'PAINTING'; // Default category
  }
} 