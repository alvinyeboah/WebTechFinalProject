"use client"

import React, { useEffect, useState } from "react";
import ArtGalleryHero from "@/components/home/ArtGalleryHero";
import UpcomingAuctions from "@/components/home/UpcomingAuctions";
import FeaturedExhibition from "@/components/home/FeaturedExhibition";
import { ArtworkService } from "@/services/artworkService";
import { ExternalArtworkCard } from "@/components/artwork/ExternalArtworkCard";

const artworkService = new ArtworkService();

interface ExternalArtwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  images: {
    url: string;
    main: string;
    thumbnails?: string[];
  };
  source: string;
  year: string;
  medium: string;
  dimensions: string;
  currentPrice: number;
  artwork_id: string;
}

export default function Page() {
  const [featuredArtworks, setFeaturedArtworks] = useState<ExternalArtwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArtworks = async () => {
      try {
        // Fetch a mix of artworks from different sources
        const aicArtworks = await artworkService.searchArtworks("masterpiece");
        setFeaturedArtworks(aicArtworks.slice(0, 6)); // Limit to 6 items
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
