import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Auction } from './page';

interface AuctionDetail extends Auction {
  description: string;
  seller: string;
  startingBid: number;
  bidIncrement: number;
}

const MOCK_AUCTION_DETAIL: AuctionDetail = {
  id: 'vintage-watch',
  title: 'Vintage Luxury Watch',
  description: 'A rare vintage luxury timepiece in excellent condition. Features include chronograph, moon phase, and perpetual calendar.',
  currentBid: 1500,
  startingBid: 1000,
  bidIncrement: 100,
  endDate: '2024-12-31',
  seller: 'LuxuryVintage',
  imageUrl: '/api/placeholder/600/400'
};

export default function AuctionDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  if (!router.isReady) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (typeof slug !== 'string') {
    return <div className="container mx-auto py-8">Invalid auction ID</div>;
  }
  const auction = MOCK_AUCTION_DETAIL;

  const handleBid = () => {
    // Implement bid logic
    alert('Bidding functionality would go here');
  };

  return (
    <div className="container mx-auto py-8">
      <Link href="/auctions">
        <Button  className="mb-6">
          ← Back to Auctions
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{auction.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={auction.imageUrl}
                alt={auction.title}
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <div className="space-y-4">
                <p className="text-xl font-semibold">
                  Current Bid: ${auction.currentBid.toLocaleString()}
                </p>
                <p>Starting Bid: ${auction.startingBid.toLocaleString()}</p>
                <p>Minimum Increment: ${auction.bidIncrement.toLocaleString()}</p>
                <p>Seller: {auction.seller}</p>
                <p>
                  Ends: {new Date(auction.endDate).toLocaleDateString()}
                </p>
                <div className="pt-4">
                  <Button onClick={handleBid} className="w-full">
                    Place Bid
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700">{auction.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}