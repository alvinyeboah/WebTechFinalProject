'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function SortingSidebar() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [sortBy, setSortBy] = useState<string>('ending-soon')
  const [categories, setCategories] = useState<string[]>([])

  return (
    <div className="w-full md:w-64 bg-[#2A2C30] p-4 space-y-6">
      <div>
        <h3 className="text-[#F0A500] font-semibold mb-2">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-[#1A1C20] text-[#E6D5B8] p-2 rounded-md border border-[#F0A500] focus:outline-none"
        >
          <option value="ending-soon">Ending Soon</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      <div>
        <h3 className="text-[#F0A500] font-semibold mb-2">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-1/2 bg-[#1A1C20] text-[#E6D5B8] p-2 rounded-md border border-[#F0A500] focus:outline-none"
            placeholder="Min"
          />
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-1/2 bg-[#1A1C20] text-[#E6D5B8] p-2 rounded-md border border-[#F0A500] focus:outline-none"
            placeholder="Max"
          />
        </div>
      </div>

      <div>
        <h3 className="text-[#F0A500] font-semibold mb-2">Categories</h3>
        {['Paintings', 'Sculptures', 'Digital Art', 'Photography', 'Prints'].map((category) => (
          <label key={category} className="flex items-center space-x-2 text-[#E6D5B8] mb-2">
            <input
              type="checkbox"
              checked={categories.includes(category)}
              onChange={(e) => {
                if (e.target.checked) {
                  setCategories([...categories, category])
                } else {
                  setCategories(categories.filter(c => c !== category))
                }
              }}
              className="form-checkbox text-[#F0A500]"
            />
            <span>{category}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

