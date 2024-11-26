import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Poppins, Caveat } from 'next/font/google'
import { ExternalArtwork } from '@/types/artwork'
import { ArtworkService } from '@/services/artworkService'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-caveat',
})

const artworkService = new ArtworkService();

export default function FeaturedExhibition() {
  const [featuredArtwork, setFeaturedArtwork] = useState<ExternalArtwork | null>(null);

  useEffect(() => {
    const fetchFeaturedArtwork = async () => {
      try {
        const artworks = await artworkService.searchArtworks("masterpiece");
        if (artworks.length > 0) {
          setFeaturedArtwork(artworks[0]); // Get just the first artwork
        }
      } catch (error) {
        console.error("Error fetching featured artwork:", error);
      }
    };

    fetchFeaturedArtwork();
  }, []);

  if (!featuredArtwork) {
    return (
      <div className="h-[600px] bg-[#1A1C20] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F0A500]" />
      </div>
    );
  }

  return (
    <section className={`bg-[#1A1C20] text-[#E6D5B8] py-16 ${poppins.variable} ${caveat.variable} font-sans`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl font-bold mb-2 text-[#F0A500] `}>
            Featured Exhibition
          </h2>
          <div className="mt-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
              <Image
                src={featuredArtwork.images.url}
                alt={featuredArtwork.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-2 text-[#F0A500]">{featuredArtwork.title}</h3>
              <p className="text-lg mb-1">By {featuredArtwork.artist}</p>
              <p className="text-gray-400">{featuredArtwork.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}