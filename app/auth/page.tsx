import Image from 'next/image';
import React from 'react';


const AuctionPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 my-8">Welcome to the Auction Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {Array(6).fill('').map((_, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4">
            <Image
              src={`https://via.placeholder.com/300x200?text=Artwork+${index + 1}`}
              alt={`Artwork ${index + 1}`}
              className="w-full h-48 object-cover rounded-md mb-4"
              width={300}
              height={200}
            />
            <h2 className="text-lg font-semibold text-gray-700">Artwork {index + 1}</h2>
            <p className="text-gray-600 mt-2">Artist Name</p>
            <p className="text-gray-900 font-bold mt-4">$100.00</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Place Bid
            </button>
          </div>
        ))}
      </div>
      <footer className="mt-10 w-full max-w-6xl text-center py-6 text-gray-500">
        © 2024 Art Auction. All rights reserved.
      </footer>
    </div>
  );
}

export default AuctionPage;
