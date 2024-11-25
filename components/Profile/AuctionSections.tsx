import { AuctionCard } from '@/components/Profile/AuctionCard';

 // app/components/profile/AuctionsSection.tsx
 interface AuctionsSectionProps {
    auctions: Array<{
      id: number;
      title: string;
      imageUrl: string;
      currentBid: number;
      bidCount: number;
      timeLeft: string;
    }>;
  }
  
  export const AuctionsSection = ({ auctions }: AuctionsSectionProps) => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Current Auctions</h2>
          <button className="text-[#FFD700] hover:text-[#E6B800] transition-colors">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} {...auction} />
          ))}
        </div>
      </div>
    );
  };
  