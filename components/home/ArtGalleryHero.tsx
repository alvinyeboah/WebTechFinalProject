"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Poppins, Playfair_Display } from "next/font/google";
import { ArtworkService } from "@/services/artworkService";

const poppins = Poppins({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-playfair",
});

const artworkService = new ArtworkService();

export default function ArtGalleryHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredArtworks, setFeaturedArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(featuredArtworks, "here");

  useEffect(() => {
    const fetchFeaturedArtworks = async () => {
      try {
        const artworks = await artworkService.searchArtworks("masterpiece");
        // Function to shuffle an array
        function shuffleArray<T>(array: T[]): T[] {
          return array
            .map((item) => ({ item, sort: Math.random() })) // Assign random sort key
            .sort((a, b) => a.sort - b.sort) // Sort by the random key
            .map(({ item }) => item); // Extract the shuffled items
        }
        setFeaturedArtworks(shuffleArray(artworks).slice(0, 5));
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArtworks();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredArtworks.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuredArtworks.length - 1 : prev - 1
    );
  };

  if (loading || featuredArtworks.length === 0) {
    return (
      <div className="h-[600px] bg-[#1A1C20] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F0A500]" />
      </div>
    );
  }

  return (
    <div className="relative h-[600px] bg-[#1A1C20] overflow-hidden">
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-10 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-10 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
      >
        <ChevronRight size={24} />
      </button>

      <AnimatePresence mode="wait">
        {featuredArtworks.map(
          (artwork, index) =>
            index === currentIndex && (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full"
              >
                <Image
                  src={artwork.images.url}
                  alt={artwork.title}
                  fill
                  className="object-cover"
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
                  <h2
                    className={`${playfair.className} text-3xl font-bold mb-2 text-[#F0A500]`}
                  >
                    {artwork.title}
                  </h2>
                  <p className="text-lg mb-1">
                    {artwork.artist}, {artwork.year}
                  </p>
                  <p className="text-sm">{artwork.description}</p>
                </motion.div>
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
}
