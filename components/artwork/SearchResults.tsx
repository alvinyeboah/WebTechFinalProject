import React from 'react';
import { Artwork, ExternalArtwork } from '@/types/artwork';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';

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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
      </div>
    );
  }

  const renderArtworkCard = (artwork: Artwork | ExternalArtwork, isExternal: boolean) => (
    <Card key={isExternal ? (artwork as ExternalArtwork).id : (artwork as Artwork).artwork_id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-48">
          <Image
            src={isExternal ? (artwork as ExternalArtwork).images.url : (artwork as Artwork).images.main}
            alt={artwork.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 truncate">{artwork.title}</h3>
          <p className="text-sm text-gray-500 mb-2">
            {isExternal ? (artwork as ExternalArtwork).artist : (artwork as Artwork).artist.name}
          </p>
          <p className="text-sm text-gray-700 line-clamp-2">{artwork.description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => isExternal ? onSelectExternal?.(artwork as ExternalArtwork) : onSelectLocal?.(artwork as Artwork)} 
          className="w-full"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <Tabs defaultValue="gallery" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="gallery">Gallery Collection</TabsTrigger>
        <TabsTrigger value="museum">Museum Collections</TabsTrigger>
      </TabsList>
      <TabsContent value="gallery">
        <ScrollArea className="h-[600px] pr-4">
          {localResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localResults.map((artwork) => renderArtworkCard(artwork, false))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No artworks found in the gallery collection
            </div>
          )}
        </ScrollArea>
      </TabsContent>
      <TabsContent value="museum">
        <ScrollArea className="h-[600px] pr-4">
          {externalResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {externalResults.map((artwork) => renderArtworkCard(artwork, true))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No artworks found in museum collections
            </div>
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
