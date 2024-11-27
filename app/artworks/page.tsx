"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { useDebounce } from "@/hooks/useDebounce"
import { ArtworkService } from "@/services/artworkService"
import { ExternalArtwork } from "@/types/artwork"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, X, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export default function ArtworksPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [externalArtworks, setExternalArtworks] = useState<ExternalArtwork[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedArtwork, setSelectedArtwork] = useState<ExternalArtwork | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  
  const debouncedSearch = useDebounce(searchQuery, 500)
  const artworkService = new ArtworkService()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadInitialArtworks = async () => {
      setLoading(true)
      try {
        const results = await artworkService.searchArtworks("masterpiece", 1)
        setExternalArtworks(results)
        setHasMore(results.length === 20)
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
        const results = await artworkService.searchArtworks("masterpiece", 1)
        setExternalArtworks(results)
        setHasMore(results.length === 20)
        setPage(1)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const results = await artworkService.searchArtworks(debouncedSearch, 1)
        setExternalArtworks(results)
        setHasMore(results.length === 20)
        setPage(1)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while searching')
      } finally {
        setLoading(false)
      }
    }

    searchArtworks()
  }, [debouncedSearch])

  const handleArtworkSelect = (artwork: ExternalArtwork) => {
    setSelectedArtwork(artwork);
  }

  const handleCloseArtwork = () => {
    setSelectedArtwork(null)
  }

  const handleScroll = async () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !isLoading) {
        setIsLoading(true)
        try {
          const nextPage = page + 1
          const newResults = await artworkService.searchArtworks(
            debouncedSearch || "masterpiece",
            nextPage
          )
          
          if (newResults.length > 0) {
            setExternalArtworks(prev => [...prev, ...newResults])
            setPage(nextPage)
            setHasMore(newResults.length === 20)
          } else {
            setHasMore(false)
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred while loading more artworks')
        } finally {
          setIsLoading(false)
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div 
        ref={containerRef}
        className="h-screen overflow-y-auto"
        onScroll={handleScroll}
      >
        <div className="fixed top-0 left-0 w-full z-10 bg-gradient-to-b from-gray-900 to-transparent h-24 pointer-events-none" />
        
        <div className="fixed top-0 left-0 right-0 z-20 px-4 py-3 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-3xl mx-auto relative">
            <Input
              type="search"
              placeholder="Search artworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-800 text-gray-100 border-gray-700 focus:border-[#F0A500] focus:ring-[#F0A500] placeholder-gray-400"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-4 right-4 bg-red-900/50 text-red-200 p-4 rounded-md text-center z-20 flex items-center justify-center"
            >
              <AlertCircle className="mr-2" size={20} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto px-4 pt-24">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {externalArtworks.map((artwork) => (
              <div key={artwork.id} className="break-inside-avoid">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleArtworkSelect(artwork)}
                >
                  <Image
                    src={artwork.images.url}
                    alt={artwork.title}
                    width={500}
                    height={500}
                    className="rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-2xl"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-end justify-start p-4">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-semibold text-lg">{artwork.title}</h3>
                      <p className="text-sm">{artwork.artist}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#F0A500]" />
            </div>
          )}

          {!hasMore && externalArtworks.length > 0 && (
            <p className="text-center text-gray-400 py-8">
              No more artworks to load
            </p>
          )}
        </div>

        {!loading && externalArtworks.length === 0 && (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-center text-[#E6D5B8] text-xl">
              No artworks found. Try a different search term.
            </p>
          </div>
        )}

        <AnimatePresence>
          {selectedArtwork && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-30"
              onClick={handleCloseArtwork}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-800 rounded-lg overflow-hidden max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <Image
                    src={selectedArtwork.images.url}
                    alt={selectedArtwork.title}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={handleCloseArtwork}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 transition-colors hover:bg-opacity-75"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#F0A500] mb-2">{selectedArtwork.title}</h2>
                  <p className="text-[#E6D5B8] mb-4 text-sm">{selectedArtwork.artist}</p>
                  <p className="text-gray-300 text-sm line-clamp-3 mb-4">{selectedArtwork.description}</p>
                  {/* <Button
                    onClick={() => router.push(`/artworks/${selectedArtwork.id}`)}
                    className="w-full bg-[#F0A500] text-gray-900 hover:bg-[#E6D5B8] transition-colors"
                  >
                    View Details
                  </Button> */}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

