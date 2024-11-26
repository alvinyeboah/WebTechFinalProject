"use client"
import { useEffect, useState } from "react";
import { useArtwork } from "@/hooks/useArtwork";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchResults } from "@/components/artwork/SearchResults";
import { Artwork, ExternalArtwork } from "@/types/artwork";
import { useDebounce } from "@/hooks/useDebounce";
import { ArtworkService } from "@/services/artworkService";

export default function ArtworksPage() {
  const router = useRouter();
  const { artworks, loading: localLoading, error: localError, fetchArtworks } = useArtwork();
  const [searchQuery, setSearchQuery] = useState("");
  const [externalArtworks, setExternalArtworks] = useState<ExternalArtwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedSearch = useDebounce(searchQuery, 500);
  const artworkService = new ArtworkService();

  // Handle search
  useEffect(() => {
    const searchArtworks = async () => {
      if (!debouncedSearch) {
        setExternalArtworks([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const results = await artworkService.searchArtworks(debouncedSearch);
        setExternalArtworks(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while searching');
      } finally {
        setLoading(false);
      }
    };

    searchArtworks();
  }, [debouncedSearch]);

  const handleLocalArtworkSelect = (artwork: Artwork) => {
    router.push(`/artworks/${artwork.artwork_id}`);
  };

  const handleExternalArtworkSelect = (artwork: ExternalArtwork) => {
    router.push(`/artworks/${artwork.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Art Gallery</h1>
        <div className="max-w-xl">
          <Input
            type="search"
            placeholder="Search artworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <SearchResults
        localResults={artworks}
        externalResults={externalArtworks}
        onSelectLocal={handleLocalArtworkSelect}
        onSelectExternal={handleExternalArtworkSelect}
        loading={loading || localLoading}
      />
    </div>
  );
}
