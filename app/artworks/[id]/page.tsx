"use client";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useArtwork } from "@/hooks/useArtwork";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ArtworkDetailPage() {
  const { id } = useParams();
  const { artworks, loading, error, getArtworkById } = useArtwork();
  const router = useRouter();


  useEffect(() => {
    const fetchArtwork = async () => {
      // await getArtworkById(id);
    };
    fetchArtwork();
  }, [id, getArtworkById]);

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }

  const artwork = artworks.find((art) => art.artwork_id == id);
  if (!artwork) {
    return (
      <div>
        <p>No artwork found.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{artwork.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{artwork.description}</p>
        <p>Current Price: ${artwork.currentPrice}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => router.push("/artworks")}>Back to Gallery</Button>
      </CardFooter>
    </Card>
  );
}