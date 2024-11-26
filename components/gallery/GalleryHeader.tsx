
import React from 'react';

interface GalleryHeaderProps {
  title?: string;
  description?: string;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  title = 'Live Art Auctions',
  description = 'Discover extraordinary artworks from emerging and established artists. Each piece tells a unique story, waiting to find its next home.'
}) => {
  return (
    <div className="mb-12">
      <h1 className="text-4xl font-bold text-[#FFD700] mb-4">
        {title}
      </h1>
      <p className="text-gray-300 max-w-2xl">
        {description}
      </p>
    </div>
  );
};