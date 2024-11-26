import React from 'react';
import { Artwork } from '../../types/Artworks';
import { ArtworkCard } from './ArtworkCard';

interface ArtworkGridProps {
  artworks: Artwork[];
  viewMode: 'grid' | 'list';
}

export const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks, viewMode }) => {
  return (
    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
      {artworks.map(artwork => (
        <ArtworkCard key={artwork.id} artwork={artwork} viewMode={viewMode} />
      ))}
    </div>
  );
};