import React from 'react';
import { Poppins, Playfair_Display } from 'next/font/google';
import { Calendar } from 'lucide-react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair',
});

interface Auction {
  id: number;
  title: string;
  artist: string;
  image: string;
  startDate: string;
  endDate: string;
}

// Sample auction data
const auctions: Auction[] = [
  {
    id: 1,
    title: 'Ethereal Visions',
    artist: 'Emma Thompson',
    image: '/placeholder.svg?height=300&width=400',
    startDate: '2023-08-01',
    endDate: '2023-08-05',
  },
  {
    id: 2,
    title: 'Urban Rhythms',
    artist: 'Michael Chen',
    image: '/placeholder.svg?height=300&width=400',
    startDate: '2023-08-03',
    endDate: '2023-08-07',
  },
  {
    id: 3,
    title: 'Chromatic Dreams',
    artist: 'Sophia Rodriguez',
    image: '/placeholder.svg?height=300&width=400',
    startDate: '2023-08-05',
    endDate: '2023-08-10',
  },
  {
    id: 4,
    title: 'Sculptural Harmony',
    artist: 'David Kim',
    image: '/placeholder.svg?height=300&width=400',
    startDate: '2023-08-07',
    endDate: '2023-08-12',
  },
  {
    id: 5,
    title: 'Abstract Emotions',
    artist: 'Olivia Wilson',
    image: '/placeholder.svg?height=300&width=400',
    startDate: '2023-08-10',
    endDate: '2023-08-15',
  },
  {
    id: 6,
    title: 'Timeless Portraits',
    artist: 'Alexander Lee',
    image: '/placeholder.svg?height=300&width=400',
    startDate: '2023-08-12',
    endDate: '2023-08-17',
  },
];

interface AuctionCardProps {
  title: string;
  artist: string;
  image: string;
  startDate: string;
  endDate: string;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ title, artist, image, startDate, endDate }) => (
  <div className="bg-[#2A2C30] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className={`${playfair.className} text-xl font-bold text-[#F0A500] mb-2`}>{title}</h3>
      <p className="text-[#E6D5B8] mb-2">{artist}</p>
      <div className="flex items-center text-[#E6D5B8] text-sm">
        <Calendar size={16} className="mr-2" />
        <span>
          {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  </div>
);

const AuctionsPage: React.FC = () => {
  return (
    <div className={`bg-[#1A1C20] min-h-screen ${poppins.variable} ${playfair.variable} font-sans`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`${playfair.className} text-4xl font-bold text-[#F0A500] mb-8 text-center`}>Current Auctions</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} {...auction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuctionsPage;
