import React from 'react'
import { Palette, Gavel, Users, Star } from 'lucide-react'

interface StatsSectionProps {
  artworks: number
  activeAuctions: number
  followers: number
  rating: number
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  artworks,
  activeAuctions,
  followers,
  rating
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Artworks', value: artworks, icon: Palette },
        { label: 'Active Auctions', value: activeAuctions, icon: Gavel },
        { label: 'Followers', value: followers, icon: Users },
        { label: 'Rating', value: rating, icon: Star },
      ].map((stat, index) => (
        <div key={index} className="bg-[#2A2C30] p-4 rounded-lg text-center">
          <stat.icon className="w-8 h-8 mx-auto mb-2 text-[#F0A500]" />
          <p className="text-2xl font-bold text-[#F0A500]">{stat.value}</p>
          <p className="text-[#E6D5B8]">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

