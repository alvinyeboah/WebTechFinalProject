'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { Poppins, Playfair_Display } from 'next/font/google'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const poppins = Poppins({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
})

// Sample auction data (replace with your actual data)
const auctions = [
  {
    id: 1,
    title: "Modern Masterpieces",
    date: "2023-07-15",
    time: "14:00",
    imageUrl: "/placeholder.svg?height=400&width=300",
    description: "A curated collection of contemporary art from emerging artists."
  },
  {
    id: 2,
    title: "Impressionist Dreams",
    date: "2023-07-22",
    time: "15:30",
    imageUrl: "/placeholder.svg?height=400&width=300",
    description: "Rare works from the Impressionist movement, featuring Monet and Renoir."
  },
  {
    id: 3,
    title: "Sculpture Showcase",
    date: "2023-07-29",
    time: "13:00",
    imageUrl: "/placeholder.svg?height=400&width=300",
    description: "An exclusive auction of modern and classical sculptures."
  },
  {
    id: 4,
    title: "Abstract Expressions",
    date: "2023-08-05",
    time: "16:00",
    imageUrl: "/placeholder.svg?height=400&width=300",
    description: "Bold and emotive works from the Abstract Expressionist movement."
  },
  {
    id: 5,
    title: "Photography Masters",
    date: "2023-08-12",
    time: "14:30",
    imageUrl: "/placeholder.svg?height=400&width=300",
    description: "Iconic photographs from renowned 20th and 21st century photographers."
  },
  {
    id: 6,
    title: "Renaissance Treasures",
    date: "2023-08-19",
    time: "15:00",
    imageUrl: "/placeholder.svg?height=400&width=300",
    description: "A rare collection of Renaissance art and artifacts."
  }
]

const UpcomingAuctions = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className={`bg-[#1A1C20] text-[#E6D5B8] py-16 ${poppins.className}`}>
      <div className="container mx-auto px-4">
        <motion.h2 
          className={`text-4xl md:text-5xl text-center mb-4 ${playfair.className}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/auctions">Upcoming Auctions</Link>
          
        </motion.h2>
        <motion.p 
          className="text-center text-lg mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Discover and bid on exquisite artworks from various periods and styles. Our curated auctions offer unique opportunities for art enthusiasts and collectors.
        </motion.p>
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {auctions.map((auction, index) => (
              <motion.div 
                key={auction.id}
                className="relative flex-none w-72 overflow-hidden rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img 
                  src={auction.imageUrl} 
                  alt={auction.title} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C20] to-transparent opacity-70" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold mb-2">{auction.title}</h3>
                  <p className="text-sm mb-1">{new Date(auction.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {auction.time}</p>
                  <p className="text-sm mb-2">{auction.description}</p>
                  <button className="text-[#F0A500] hover:text-[#E6D5B8] transition-colors text-sm font-semibold">
                    View
                  </button>
                </div>
                <div className="absolute top-4 right-4 bg-[#F0A500] text-[#1A1C20] px-3 py-1 rounded-full text-sm font-semibold">
                  Upcoming
                </div>
              </motion.div>
            ))}
          </div>
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#1A1C20] bg-opacity-50 p-2 rounded-full text-[#E6D5B8] hover:text-[#F0A500] transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#1A1C20] bg-opacity-50 p-2 rounded-full text-[#E6D5B8] hover:text-[#F0A500] transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default UpcomingAuctions