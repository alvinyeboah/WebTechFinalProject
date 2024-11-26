"use client";

import React, { useState } from 'react';
import ArtGalleryNav from "@/components/home/ArtGalleryNav";
import { GalleryHeader } from '../../components/gallery/GalleryHeader';
import { SearchFilter } from '../../components/gallery/SearchFilter';
import { ArtworkGrid } from '../../components/gallery/ArtworkGrid';
import { Artwork } from '../../types/Artworks';

const mockArtworks: Artwork[] = [
  {
    id: 1,
    title: 'Ethereal Waves',
    artist: 'Elena Rodriguez',
    imageUrl: '/api/placeholder/400/500',
    currentBid: 2750,
    style: 'Abstract',
    medium: 'Oil on Canvas',
    dimensions: '48 x 60 inches',
    timeLeft: '3d 12h'
  },
  // Add more artworks...
];

const ArtGalleryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>(mockArtworks);

  const handleSearchChange = (searchTerm: string) => {
    const filtered = mockArtworks.filter(artwork => 
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.style.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArtworks(filtered);
  };

  return (
    <div className="bg-[#1A1A1A] min-h-screen text-white p-8">
    <ArtGalleryNav/>
      <GalleryHeader />
      <SearchFilter 
        onSearchChange={handleSearchChange}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
      />
      <ArtworkGrid 
        artworks={filteredArtworks}
        viewMode={viewMode}
      />
    </div>
  );
};

export default ArtGalleryPage;