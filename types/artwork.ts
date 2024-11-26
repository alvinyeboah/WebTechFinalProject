import { Bid } from "./bid";

export interface Artwork {
  artwork_id: string;
  title: string;
  description: string;
  artist: {
    id: string;
    name: string;
    bio?: string;
  };
  images: {
    main: string;
    thumbnails?: string[];
    url: string;
  };
  category: ArtworkCategory;
  medium: string;
  dimensions?: {
    height: number;
    width: number;
    depth?: number;
    unit: 'cm' | 'in';
  };
  year: number | string;
  condition: ArtworkCondition;
  provenance?: string;
  currentPrice: number;
  startingPrice: number;
  reservePrice?: number;
  status: ArtworkStatus;
  bids: Bid[];
  views: number;
  favorites: number;
  auctionStart: Date;
  auctionEnd: Date;
  createdAt: Date;
  updatedAt: Date;
  source?: 'LOCAL' | 'AIC' | 'MET';
  externalId?: string;
}

export type ArtworkCategory =
  | 'PAINTING'
  | 'SCULPTURE'
  | 'PHOTOGRAPHY'
  | 'PRINT'
  | 'DIGITAL'
  | 'MIXED_MEDIA'
  | 'OTHER';

export type ArtworkCondition =
  | 'MINT'
  | 'EXCELLENT'
  | 'VERY_GOOD'
  | 'GOOD'
  | 'FAIR';

export type ArtworkStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'ACTIVE'
  | 'SOLD'
  | 'EXPIRED'
  | 'CANCELLED';

export interface ExternalArtwork {
  id: string;
  source: 'AIC' | 'MET';
  title: string;
  artist: string;
  description?: string;
  imageUrl: string;
  images: {
    main: string;
    thumbnails?: string[];
    url: string;
  };
  year?: string;
  medium?: string;
  dimensions?: string;
}
