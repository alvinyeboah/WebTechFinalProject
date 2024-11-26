import React from 'react';

import { ArtworkCard } from './artwork';
import { Artwork, ExternalArtwork } from '@/types/artwork';
import { ExternalArtworkCard } from './ExternalArtworkCard';

interface SearchResultsProps {
  localResults: Artwork[];
  externalResults: ExternalArtwork[];
  onSelectLocal?: (artwork: Artwork) => void;
  onSelectExternal?: (artwork: ExternalArtwork) => void;
  loading?: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  localResults,
  externalResults,
  onSelectLocal,
  onSelectExternal,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {localResults.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Gallery Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localResults.map((artwork) => (
              <ArtworkCard
                key={artwork.artwork_id}
                {...artwork}
                onClick={() => onSelectLocal?.(artwork)}
              />
            ))}
          </div>
        </section>
      )}

      {externalResults.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Museum Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {externalResults.map((artwork) => (
              <ExternalArtworkCard
                key={artwork.id}
                artwork={artwork}
                onSelect={() => onSelectExternal?.(artwork)}
              />
            ))}
          </div>
        </section>
      )}

      {localResults.length === 0 && externalResults.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No artworks found matching your search criteria
        </div>
      )}
    </div>
  );
}; 