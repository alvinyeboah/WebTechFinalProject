'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Poppins, Playfair_Display } from 'next/font/google'
import { Calendar, MapPin, Clock, User, DollarSign } from 'lucide-react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair',
})

// Mock data for a single auction
const auctionData = {
  id: '1',
  title: 'Ethereal Visions',
  artist: 'Emma Thompson',
  description: 'A mesmerizing masterpiece that blends dreamlike landscapes with vibrant colors, evoking a sense of tranquility and wonder. This piece showcases Emma Thompson\'s unique ability to capture ethereal beauty on canvas.',
  image: '/placeholder.svg?height=600&width=800',
  startDate: '2023-08-01',
  endDate: '2023-08-05',
  startingBid: 5000,
  currentBid: 7500,
  location: 'New York',
  medium: 'Oil on canvas',
  dimensions: '100cm x 150cm',
  yearCreated: 2023,
}

export default function AuctionDetailPage() {
  const [bidAmount, setBidAmount] = useState('')
  const [bidSubmitted, setBidSubmitted] = useState(false)

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the bid to your backend
    console.log(`Bid submitted: $${bidAmount}`)
    setBidSubmitted(true)
    setBidAmount('')
  }

  return (
    <div className={`bg-[#1A1C20] min-h-screen text-[#E6D5B8] ${poppins.variable} ${playfair.variable} font-sans`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`${playfair.className} text-4xl font-bold text-[#F0A500] mb-8 text-center`}>{auctionData.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[400px] md:h-[600px]">
            <Image
              src={auctionData.image}
              alt={auctionData.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className={`${playfair.className} text-2xl font-semibold text-[#F0A500] mb-2`}>About the Artwork</h2>
              <p>{auctionData.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-[#F0A500]">Artist</h3>
                <p>{auctionData.artist}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#F0A500]">Medium</h3>
                <p>{auctionData.medium}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#F0A500]">Dimensions</h3>
                <p>{auctionData.dimensions}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#F0A500]">Year</h3>
                <p>{auctionData.yearCreated}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="mr-2 text-[#F0A500]" size={20} />
                <span>
                  {new Date(auctionData.startDate).toLocaleDateString()} - {new Date(auctionData.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 text-[#F0A500]" size={20} />
                <span>{auctionData.location}</span>
              </div>
            </div>
            
            <div className="bg-[#2A2C30] p-6 rounded-lg">
              <h3 className={`${playfair.className} text-xl font-semibold text-[#F0A500] mb-4`}>Bidding Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Starting Bid:</span>
                  <span>${auctionData.startingBid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Bid:</span>
                  <span>${auctionData.currentBid.toLocaleString()}</span>
                </div>
              </div>
              
              <form onSubmit={handleBidSubmit} className="mt-4">
                <div className="flex items-center">
                  <DollarSign className="text-[#F0A500] mr-2" size={20} />
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid"
                    className="flex-grow px-3 py-2 bg-[#1A1C20] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                    min={auctionData.currentBid + 1}
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F0A500] text-[#1A1C20] rounded-r-md font-semibold hover:bg-[#E6D5B8] transition-colors"
                  >
                    Place Bid
                  </button>
                </div>
              </form>
              
              {bidSubmitted && (
                <p className="mt-2 text-green-400">Your bid has been submitted successfully!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}