"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useArtwork } from "@/hooks/useArtwork";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Artwork } from "@/types/artwork";

export default function ArtworkDetailPage() {
  const { id } = useParams();
  const { loading, error, getArtworkById } = useArtwork();
  const router = useRouter();
  const [artwork, setArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (id) {
        try {
          const result = await getArtworkById(id as string);
          if (result) {
            setArtwork(result);
          }
        } catch (err) {
          console.error('Error fetching artwork:', err);
        }
      }
    };
    fetchArtwork();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800">Error: {error}</p>
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
          <CardContent className="p-4">
            <p>No artwork found.</p>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{artwork.title}</CardTitle>
          <p className="text-gray-600">by {artwork.artist.name}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full h-[400px]">
            <Image
              src={artwork.images.url || artwork.images.main}
              alt={artwork.title}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <p className="text-gray-700">{artwork.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Medium</h3>
                <p>{artwork.medium}</p>
              </div>
              <div>
                <h3 className="font-semibold">Year</h3>
                <p>{artwork.year}</p>
              </div>
              {artwork.dimensions && (
                <div>
                  <h3 className="font-semibold">Dimensions</h3>
                  <p>
                    {`${artwork.dimensions.height}x${artwork.dimensions.width}${artwork.dimensions.depth ? 'x' + artwork.dimensions.depth : ''} ${artwork.dimensions.unit}`}
                  </p>
                </div>
              )}
              <div>
                <h3 className="font-semibold">Current Price</h3>
                <p>${artwork.currentPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/artworks")}>Back to Gallery</Button>
        </CardFooter>
      </Card>
    </div>
  );
}