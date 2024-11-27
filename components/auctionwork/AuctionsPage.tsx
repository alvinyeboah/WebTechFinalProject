'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Clock, DollarSign, Users } from 'lucide-react'
import { formatDistance } from 'date-fns'
import { Auction } from '@/types/auction'

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch('/api/auctions?status=ACTIVE')
        if (!response.ok) {
          throw new Error('Failed to fetch auctions')
        }
        const data = await response.json()
        setAuctions(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAuctions()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-[#F0A500]">Loading auctions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#F0A500] mb-8">Active Auctions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <div 
            key={auction.id}
            className="bg-[#2A2C30] rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-200"
            onClick={() => router.push(`/auctions/${auction.id}`)}
          >
            <div className="relative h-48">
              <Image
                src={auction.image_url || '/placeholder.svg'}
                alt={auction.title || 'Auction Item'}
                layout="fill"
                objectFit="cover"
              />
            </div>
            
            <div className="p-4">
              <h2 className="text-xl font-semibold text-[#F0A500] mb-2">
                {auction.title || 'Untitled Auction'}
              </h2>
              
              <div className="space-y-2 text-[#E6D5B8]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-[#F0A500]" />
                    <span>Current Bid:</span>
                  </div>
                  <span className="font-semibold">
                    ${auction.current_price.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-[#F0A500]" />
                    <span>Ends:</span>
                  </div>
                  <span>
                    {formatDistance(new Date(auction.end_time), new Date(), { addSuffix: true })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-[#F0A500]" />
                    <span>Min Increment:</span>
                  </div>
                  <span>${auction.min_bid_increment.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {auctions.length === 0 && (
        <div className="text-center text-[#E6D5B8] py-8">
          No active auctions found.
        </div>
      )}
    </div>
  )
}
