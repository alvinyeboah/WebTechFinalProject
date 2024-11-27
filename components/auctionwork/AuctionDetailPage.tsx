'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Poppins, Playfair_Display } from 'next/font/google'
import { Calendar, MapPin, Clock, User, DollarSign } from 'lucide-react'
import { useAuction } from '@/hooks/useAuction'
import { formatDistance } from 'date-fns'

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

export default function AuctionDetailPage() {
  const { id } = useParams()
  const { auction, loading, error, placeBid } = useAuction(id as string)
  const [bidAmount, setBidAmount] = useState('')
  const [bidError, setBidError] = useState<string | null>(null)
  const [bidSuccess, setBidSuccess] = useState(false)

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error || !auction) {
    return <div className="text-center py-8 text-red-500">{error || 'Auction not found'}</div>
  }

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBidError(null)
    setBidSuccess(false)

    const amount = parseFloat(bidAmount)
    if (isNaN(amount)) {
      setBidError('Please enter a valid amount')
      return
    }

    const success = await placeBid(amount)
    if (success) {
      setBidSuccess(true)
      setBidAmount('')
    }
  }

  const timeLeft = formatDistance(new Date(auction.end_time), new Date(), { addSuffix: true })

  return (
    <div className={`bg-[#1A1C20] min-h-screen text-[#E6D5B8] ${poppins.variable} ${playfair.variable} font-sans`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`${playfair.className} text-4xl font-bold text-[#F0A500] mb-8 text-center`}>
          {auction.title || 'Auction Details'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[400px] md:h-[600px]">
            <Image
              src={auction.image_url || '/placeholder.svg'}
              alt="Auction Item"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#2A2C30] p-6 rounded-lg">
              <h3 className={`${playfair.className} text-xl font-semibold text-[#F0A500] mb-4`}>
                Current Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Current Bid:</span>
                  <span className="text-[#F0A500] font-semibold">
                    ${auction.current_price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Increment:</span>
                  <span>${auction.min_bid_increment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Left:</span>
                  <span>{timeLeft}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Bids:</span>
                  <span>{auction.bids.length}</span>
                </div>
              </div>
              
              <form onSubmit={handleBidSubmit} className="mt-6">
                <div className="flex items-center">
                  <DollarSign className="text-[#F0A500] mr-2" size={20} />
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid"
                    className="flex-grow px-3 py-2 bg-[#1A1C20] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                    min={auction.current_price + auction.min_bid_increment}
                    step="0.01"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F0A500] text-[#1A1C20] rounded-r-md font-semibold hover:bg-[#E6D5B8] transition-colors"
                  >
                    Place Bid
                  </button>
                </div>
                {bidError && (
                  <p className="mt-2 text-red-500">{bidError}</p>
                )}
                {bidSuccess && (
                  <p className="mt-2 text-green-500">Your bid was placed successfully!</p>
                )}
              </form>
            </div>

            <div className="bg-[#2A2C30] p-6 rounded-lg">
              <h3 className={`${playfair.className} text-xl font-semibold text-[#F0A500] mb-4`}>
                Bid History
              </h3>
              <div className="space-y-2">
                {auction.bids.map((bid) => (
                  <div key={bid.id} className="flex justify-between items-center">
                    <span className="text-sm">User #{bid.userId}</span>
                    <span className="font-semibold">${bid.amount.toLocaleString()}</span>
                  </div>
                ))}
                {auction.bids.length === 0 && (
                  <p className="text-center text-gray-500">No bids yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}