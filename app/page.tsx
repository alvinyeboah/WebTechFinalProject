"use client"

import React, { useEffect, useState } from "react";
import ArtGalleryHero from "@/components/home/ArtGalleryHero";
import UpcomingAuctions from "@/components/home/UpcomingAuctions";
import FeaturedExhibition from "@/components/home/FeaturedExhibition";
import { ArtworkService } from "@/services/artworkService";
import { ExternalArtworkCard } from "@/components/artwork/ExternalArtworkCard";
import { ExternalArtwork } from "@/types/artwork";

const artworkService = new ArtworkService();

export default function Page() {
  const [featuredArtworks, setFeaturedArtworks] = useState<ExternalArtwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArtworks = async () => {
      try {
        const aicArtworks = await artworkService.searchArtworks("masterpiece");
        function shuffleArray<T>(array: T[]): T[] {
          return array
            .map((item) => ({ item, sort: Math.random() })) // Assign random sort key
            .sort((a, b) => a.sort - b.sort) // Sort by the random key
            .map(({ item }) => item); // Extract the shuffled items
        }
        setFeaturedArtworks(shuffleArray(aicArtworks).slice(0, 5));
      } catch (error) {
        console.error("Error fetching featured artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArtworks();
  }, []);

  return (
    <div>
      <ArtGalleryHero />
      <UpcomingAuctions />
      
      {/* Featured External Artworks */}
      {/* <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Museum Pieces</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArtworks.map((artwork) => (
                <ExternalArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onSelect={(artwork) => console.log("Selected:", artwork)}
                />
              ))}
            </div>
          )}
        </div>
      </section> */}
      
      <FeaturedExhibition />
    </div>
  );
}
