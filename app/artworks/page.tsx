"use client"

import { useEffect, useState } from "react"
import { useArtwork } from "@/hooks/useArtwork"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExternalArtwork } from "@/types/artwork"
import { useDebounce } from "@/hooks/useDebounce"
import { ArtworkService } from "@/services/artworkService"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { Search, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

export default function ArtworksPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [externalArtworks, setExternalArtworks] = useState<ExternalArtwork[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const debouncedSearch = useDebounce(searchQuery, 500)
  const artworkService = new ArtworkService()

  useEffect(() => {
    const loadInitialArtworks = async () => {
      setLoading(true)
      try {
        const results = await artworkService.searchArtworks("masterpiece")
        setExternalArtworks(results)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading artworks')
      } finally {
        setLoading(false)
      }
    }

    loadInitialArtworks()
  }, [])

  useEffect(() => {
    const searchArtworks = async () => {
      if (!debouncedSearch) {
        const results = await artworkService.searchArtworks("masterpiece")
        setExternalArtworks(results)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const results = await artworkService.searchArtworks(debouncedSearch)
        setExternalArtworks(results)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while searching')
      } finally {
        setLoading(false)
      }
    }

    searchArtworks()
  }, [debouncedSearch])

  const handleArtworkSelect = (artwork: ExternalArtwork) => {
    router.push(`/artworks/${artwork.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Discover Masterpieces
        </h1>
        <div className="max-w-xl mx-auto relative">
          <Input
            type="search"
            placeholder="Search artworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-destructive/10 text-destructive p-4 rounded-md mb-4 text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {externalArtworks.map((artwork) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="relative h-64">
                    <Image
                      src={artwork.images.url}
                      alt={artwork.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 truncate">{artwork.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{artwork.artist}</p>
                    <p className="text-sm text-foreground/80 line-clamp-2">{artwork.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleArtworkSelect(artwork)} 
                    className="w-full"
                    variant="outline"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && externalArtworks.length === 0 && (
        <div className="text-center text-muted-foreground mt-8">
          No artworks found. Try a different search term.
        </div>
      )}
    </div>
  )
}

