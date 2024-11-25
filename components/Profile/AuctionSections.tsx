import React from 'react'
import Image from 'next/image'
import { Clock, Users } from 'lucide-react'

interface Auction {
  id: number
  title: string
  imageUrl: string
  currentBid: number
  bidCount: number
  timeLeft: string
}

interface AuctionsSectionProps {
  auctions: Auction[]
}

export const AuctionsSection: React.FC<AuctionsSectionProps> = ({ auctions }) => {
  return (
    <div>
      <h2 className={`text-2xl font-bold mb-4 text-[#F0A500] font-playfair`}>Active Auctions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <div key={auction.id} className="bg-[#2A2C30] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={auction.imageUrl}
              alt={auction.title}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-[#F0A500]">{auction.title}</h3>
              <p className="text-[#E6D5B8] mb-2">Current Bid: ${auction.currentBid}</p>
              <div className="flex justify-between text-sm text-[#E6D5B8]">
                <span className="flex items-center">
                  <Users size={16} className="mr-1" />
                  {auction.bidCount} bids
                </span>
                <span className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  {auction.timeLeft}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

