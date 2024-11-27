"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useArtwork } from "@/hooks/useArtwork";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Artwork } from "@/types/artwork";
import { ArrowLeft, Expand } from 'lucide-react';

export default function ArtworkDetailPage() {
  const { id } = useParams();
  const { loading, error, getArtworkById } = useArtwork();
  const router = useRouter();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (typeof id === 'string') {
        try {
          const result = await getArtworkById(id);
          if (result) {
            setArtwork(result);
          }
        } catch (err) {
          console.error('Error fetching artwork:', err);
        }
      }
    };

    fetchArtwork();
  }, [id, getArtworkById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-destructive/10">
          <CardContent className="p-6">
            <p className="text-destructive font-semibold">Error: {error}</p>
            <Button onClick={() => router.push("/artworks")} className="mt-4">
              Back to Gallery
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">No artwork found.</p>
            <Button onClick={() => router.push("/artworks")} className="mt-4">
              Back to Gallery
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <CardHeader className="relative p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 z-10 rounded-full bg-background/80 shadow-md transition-transform hover:scale-110"
            onClick={() => router.push("/artworks")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={artwork.images.url || artwork.images.main}
              alt={artwork.title}
              fill
              className={`object-cover transition-all duration-300 ${
                isImageExpanded ? 'scale-150' : 'scale-100'
              }`}
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsImageExpanded(!isImageExpanded)}
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <CardTitle className="text-3xl font-bold">{artwork.title}</CardTitle>
            <p className="text-lg text-muted-foreground">by {artwork.artist.name}</p>
          </div>
          <p className="text-muted-foreground">{artwork.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <ArtworkDetailItem title="Medium" value={artwork.medium} />
            <ArtworkDetailItem title="Year" value={artwork.year.toString()} />
            {artwork.dimensions && (
              <ArtworkDetailItem
                title="Dimensions"
                value={`${artwork.dimensions.height}x${artwork.dimensions.width}${
                  artwork.dimensions.depth ? 'x' + artwork.dimensions.depth : ''
                } ${artwork.dimensions.unit}`}
              />
            )}
            <ArtworkDetailItem
              title="Current Price"
              value={`$${artwork.currentPrice.toLocaleString()}`}
            />
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 p-6">
          <Button onClick={() => router.push("/artworks")}>Back to Gallery</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function ArtworkDetailItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="font-semibold">{value}</p>
    </div>
  )
}

