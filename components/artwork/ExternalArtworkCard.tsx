import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ExternalArtwork } from '@/types/artwork';

interface ExternalArtworkCardProps {
  artwork: ExternalArtwork;
  onSelect?: (artwork: ExternalArtwork) => void;
}

export const ExternalArtworkCard: React.FC<ExternalArtworkCardProps> = ({
  artwork,
  onSelect
}) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect?.(artwork)}
    >
      <CardHeader>
        <CardTitle className="text-lg">{artwork.title}</CardTitle>
        <p className="text-sm text-gray-600">{artwork.artist}</p>
      </CardHeader>
      <CardContent>
        <div className="aspect-square relative overflow-hidden rounded-md mb-4">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-2">
          {artwork.year && (
            <p className="text-sm">Year: {artwork.year}</p>
          )}
          {artwork.medium && (
            <p className="text-sm">Medium: {artwork.medium}</p>
          )}
          <p className="text-sm text-blue-600">
            Source: {artwork.source}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 