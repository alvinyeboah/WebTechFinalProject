import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Auction {
  id: string;
  title: string;
  currentBid: number;
  endDate: string;
  imageUrl: string;
}

// Mock data - replace with actual API call
const MOCK_AUCTIONS: Auction[] = [
  {
    id: 'vintage-watch',
    title: 'Vintage Luxury Watch',
    currentBid: 1500,
    endDate: '2024-12-31',
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: 'art-piece',
    title: 'Contemporary Art Piece',
    currentBid: 2500,
    endDate: '2024-12-25',
    imageUrl: '/api/placeholder/300/200'
  }
];

export default function AuctionsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Active Auctions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_AUCTIONS.map((auction) => (
          <Link key={auction.id} href={`/auctions/${auction.id}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <img
                src={auction.imageUrl}
                alt={auction.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{auction.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  Current Bid: ${auction.currentBid.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Ends: {new Date(auction.endDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
