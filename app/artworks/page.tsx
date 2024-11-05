"use client"
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useArtwork } from "@/hooks/useArtwork";
import { useRouter } from 'next/navigation'; 
import { Button } from "@/components/ui/button";
export default function ArtworksPage() {
  const { artworks, loading, error, fetchArtworks } = useArtwork();
  const router = useRouter(); 
  useEffect(() => {
    fetchArtworks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }


  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Art Gallery</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <Card key={artwork.artwork_id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl">{artwork.title}</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="aspect-square relative overflow-hidden rounded-md mb-4">
                <img
                  // Uncomment this when you have the actual image URL
                  // src={artwork.images.url}
                  alt={artwork.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-gray-600">{artwork.description}</p>
            </CardContent>

            <CardFooter className="flex justify-between">
              <span className="text-lg font-semibold">
                ${artwork.currentPrice}
              </span>
              <Button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => router.push(`/artworks/${artwork.artwork_id}`)} 
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
