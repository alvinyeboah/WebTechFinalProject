import React from 'react'
import { ProfileHeader } from '@/components/Profile/ProfileHeader';
import { StatsSection } from '@/components/Profile/StatsSection';
import { AuctionsSection } from '@/components/Profile/AuctionSections';
import ArtGalleryNav from "@/components/home/ArtGalleryNav"

const mockAuctions = [
  {
    id: 1,
    title: 'Abstract Harmony #1',
    imageUrl: '/api/placeholder/400/300',
    currentBid: 1150,
    bidCount: 8,
    timeLeft: '22h left'
  },
  // ... add more mock auctions as needed
];

export default function ProfilePage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <ArtGalleryNav/>
      <ProfileHeader
        name="Sarah Anderson"
        location="New York, USA"
        bio="Contemporary artist specializing in abstract expressionism and mixed media. Featured in numerous galleries across Europe and North America."
        imageUrl="/api/placeholder/150/150"
        isOnline={true}
      />
      
      <StatsSection
        artworks={247}
        activeAuctions={89}
        followers={1200}
        rating={4.9}
      />
      
      <AuctionsSection auctions={mockAuctions} />
    </div>
  );
}

