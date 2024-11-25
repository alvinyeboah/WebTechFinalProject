'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Poppins, Playfair_Display } from 'next/font/google'

const poppins = Poppins({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

const playfair = Playfair_Display({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-playfair',
})

// Sample artwork data (replace with your actual data)
const artworks = [
  {
    id: 1,
    title: "Sunset Serenity",
    artist: "Emma Johnson",
    year: 2023,
    imageUrl: "/placeholder.svg?height=600&width=1200",
    description: "A captivating landscape that captures the tranquil beauty of a sunset over rolling hills."
  },
  {
    id: 2,
    title: "Urban Rhythms",
    artist: "Michael Chen",
    year: 2022,
    imageUrl: "/placeholder.svg?height=600&width=1200",
    description: "An abstract representation of city life, pulsating with energy and vibrant colors."
  },
  {
    id: 3,
    title: "Whispers of Nature",
    artist: "Sophia Patel",
    year: 2023,
    imageUrl: "/placeholder.svg?height=600&width=1200",
    description: "A delicate portrayal of flora and fauna, inviting viewers into a world of natural wonder."
  }
]
export default function ArtGalleryHero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % artworks.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % artworks.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + artworks.length) % artworks.length)
  }

  return (
    <section className={`relative h-[calc(100vh-4rem)] overflow-hidden ${poppins.variable} ${playfair.variable} font-sans`}>
      <AnimatePresence mode="wait">
        {artworks.map((artwork, index) => (
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 ${index === currentSlide ? 'z-10' : 'z-0'}`}
          >
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              layout="fill"
              objectFit="cover"
              quality={100}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1C20] opacity-70" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute bottom-8 left-8 max-w-md p-6 bg-[#1A1C20] bg-opacity-80 text-[#E6D5B8] rounded-lg shadow-lg"
            >
              <h2 className={`${playfair.className} text-3xl font-bold mb-2 text-[#F0A500]`}>{artwork.title}</h2>
              <p className="text-lg mb-1">{artwork.artist}, {artwork.year}</p>
              <p className="text-sm">{artwork.description}</p>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-[#E6D5B8] hover:text-[#F0A500] transition-colors bg-black/50 p-2 rounded-full"
        aria-label="Previous artwork"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-[#E6D5B8] hover:text-[#F0A500] transition-colors bg-black/50 p-2 rounded-full"
        aria-label="Next artwork"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  )
}
