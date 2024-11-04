// pages/auction/index.tsx
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

type AuctionData = {
  slug: string;
  title: string;
  artist: string;
  image: string;
  price: number;
};

const auctionList: AuctionData[] = [
  {
    slug: 'artwork-1',
    title: 'Artwork 1',
    artist: 'Artist One',
    image: 'https://via.placeholder.com/300x200',
    price: 150,
  },
  {
    slug: 'artwork-2',
    title: 'Artwork 2',
    artist: 'Artist Two',
    image: 'https://via.placeholder.com/300x200',
    price: 200,
  },
];

const AuctionListPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 my-8">Art Auctions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {auctionList.map((auction) => (
          <Link href={`/auction/${auction.slug}`} key={auction.slug}>
            <a className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
              <Image
                src={auction.image}
                alt={auction.title}
                className="w-full h-48 object-cover rounded-md mb-4"
                width={300}
                height={200}
              />
              <h2 className="text-lg font-semibold text-gray-700">{auction.title}</h2>
              <p className="text-gray-600 mt-2">by {auction.artist}</p>
              <p className="text-gray-900 font-bold mt-4">${auction.price.toFixed(2)}</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                View Details
              </button>
            </a>
          </Link>
        ))}
      </div>
      <footer className="mt-10 w-full max-w-6xl text-center py-6 text-gray-500">
        © 2024 Art Auction. All rights reserved.
      </footer>
    </div>
  );
};

export default AuctionListPage;
