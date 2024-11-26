
import React from 'react';
import { Heart, Gavel } from 'lucide-react';
import { Artwork } from '../../types/Artworks';

interface ArtworkCardProps {
  artwork: Artwork;
  viewMode: 'grid' | 'list';
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, viewMode }) => {
  return (
    <div 
      className={`bg-[#2D2D2D] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${viewMode === 'list' ? 'flex items-center' : ''}`}
    >
      <div className={viewMode === 'grid' ? 'relative' : 'w-1/3 relative'}>
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className={`w-full object-cover ${viewMode === 'grid' ? 'h-96' : 'h-64'}`}
        />
        <button className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-[#FFD700]/80 transition-colors">
          <Heart className="text-white" />
        </button>
      </div>
      <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#FFD700]">{artwork.title}</h2>
            <p className="text-gray-300">{artwork.artist}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Current Bid</div>
            <div className="text-lg font-bold text-white">${artwork.currentBid.toLocaleString()}</div>
          </div>
        </div>
        <div className="text-sm text-gray-400 mb-4">
          <p>{artwork.style} | {artwork.medium}</p>
          <p>{artwork.dimensions}</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Gavel /> 
            <span>Time Left: {artwork.timeLeft}</span>
          </div>
          <button className="bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#E6B800] transition-colors">
            Place Bid
          </button>
        </div>
      </div>
    </div>
  );
};