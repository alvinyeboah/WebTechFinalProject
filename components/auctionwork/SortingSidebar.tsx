'use client'

import React, { useState } from 'react'
import { Poppins } from 'next/font/google'
import { ChevronDown, ChevronUp } from 'lucide-react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
})

const genres = ['Abstract', 'Impressionism', 'Realism', 'Surrealism', 'Pop Art', 'Minimalism']
const locations = ['New York', 'London', 'Paris', 'Tokyo', 'Berlin']
const exhibitionTypes = ['Live', 'Online', 'Exhibition']

export default function SortingSidebar() {
  const [endDateSort, setEndDateSort] = useState('descending')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const toggleSelection = (item: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (state.includes(item)) {
      setState(state.filter(i => i !== item))
    } else {
      setState([...state, item])
    }
  }

  return (
    <aside className={`w-full md:w-1/5 bg-[#1A1C20] text-[#E6D5B8] p-6 pt-20 ${poppins.variable} font-sans`}>
      <h2 className="text-2xl font-semibold mb-6 text-[#F0A500]">Filter & Sort</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">End Date</h3>
        <button
          onClick={() => setEndDateSort(endDateSort === 'ascending' ? 'descending' : 'ascending')}
          className="flex items-center justify-between w-full px-3 py-2 bg-[#2A2C30] rounded-md hover:bg-[#3A3C40] transition-colors"
        >
          <span>{endDateSort === 'ascending' ? 'Oldest to Newest' : 'Newest to Oldest'}</span>
          {endDateSort === 'ascending' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Category/Genre</h3>
        <div className="space-y-2">
          {genres.map(genre => (
            <label key={genre} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                className="form-checkbox text-[#F0A500] rounded border-[#E6D5B8] bg-[#2A2C30]"
              />
              <span>{genre}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Location</h3>
        <div className="space-y-2">
          {locations.map(location => (
            <label key={location} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLocations.includes(location)}
                onChange={() => toggleSelection(location, selectedLocations, setSelectedLocations)}
                className="form-checkbox text-[#F0A500] rounded border-[#E6D5B8] bg-[#2A2C30]"
              />
              <span>{location}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Exhibition Type</h3>
        <div className="space-y-2">
          {exhibitionTypes.map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                className="form-checkbox text-[#F0A500] rounded border-[#E6D5B8] bg-[#2A2C30]"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="w-full px-4 py-2 bg-[#F0A500] text-[#1A1C20] rounded-md font-semibold hover:bg-[#E6D5B8] transition-colors">
        Apply Filters
      </button>
    </aside>
  )
}