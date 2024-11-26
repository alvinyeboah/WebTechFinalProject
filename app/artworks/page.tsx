"use client"
import { useEffect, useState } from "react";
import { useArtwork } from "@/hooks/useArtwork";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchResults } from "@/components/artwork/SearchResults";
import { Artwork, ExternalArtwork } from "@/types/artwork";
import { useDebounce } from "@/hooks/useDebounce";


export default function ArtworksPage() {
  const { artworks, loading, error, fetchArtworks } = useArtwork();
  const [searchQuery, setSearchQuery] = useState('');
  const [externalResults, setExternalResults] = useState<ExternalArtwork[]>([]);
  const router = useRouter();
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearch) {
      fetchArtworks(debouncedSearch);
    } else {
      fetchArtworks();
    }
  }, [debouncedSearch]);

  const handleSelectLocal = (artwork: Artwork) => {
    router.push(`/artworks/${artwork.artwork_id}`);
  };

  const handleSelectExternal = (artwork: ExternalArtwork) => {
    router.push(`/artworks/external/${artwork.source.toLowerCase()}/${artwork.id}`);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Art Gallery</h1>
        <div className="max-w-2xl">
          <Input
            type="text"
            placeholder="Search artworks across our gallery and museum collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <SearchResults
        localResults={artworks}
        externalResults={externalResults}
        onSelectLocal={handleSelectLocal}
        onSelectExternal={handleSelectExternal}
        loading={loading}
      />
    </div>
  );
}
