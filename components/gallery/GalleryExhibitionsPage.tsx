import React from 'react'
import Image from 'next/image'
import { Poppins, Playfair_Display } from 'next/font/google'
import { Calendar, MapPin } from 'lucide-react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair',
})

const exhibitions = [
  {
    id: 1,
    title: "Chromatic Visions",
    artist: "Elena Rodriguez",
    description: "An immersive journey through vibrant abstract landscapes.",
    startDate: "2023-08-01",
    endDate: "2023-09-15",
    location: "New York",
    status: "Ongoing",
    exhibitionImage: "/placeholder.svg?height=400&width=600",
    artistImage: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    title: "Sculpted Narratives",
    artist: "Marcus Chen",
    description: "Exploring storytelling through contemporary sculpture.",
    startDate: "2023-08-15",
    endDate: "2023-10-01",
    location: "London",
    status: "Upcoming",
    exhibitionImage: "/placeholder.svg?height=400&width=600",
    artistImage: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    title: "Digital Dreamscapes",
    artist: "Sophia Lee",
    description: "A fusion of technology and art in immersive digital installations.",
    startDate: "2023-07-20",
    endDate: "2023-09-05",
    location: "Tokyo",
    status: "Ongoing",
    exhibitionImage: "/placeholder.svg?height=400&width=600",
    artistImage: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    title: "Echoes of the Past",
    artist: "Alexandre Dubois",
    description: "A retrospective look at classical art through a modern lens.",
    startDate: "2023-09-01",
    endDate: "2023-11-15",
    location: "Paris",
    status: "Upcoming",
    exhibitionImage: "/placeholder.svg?height=400&width=600",
    artistImage: "/placeholder.svg?height=200&width=200",
  },
]

const ExhibitionCard = ({ exhibition }:any) => (
  <div className="bg-[#2A2C30] rounded-lg overflow-hidden shadow-lg mb-8">
    <div className="flex flex-col md:flex-row">
      <div className="md:w-2/3 relative">
        <Image
          src={exhibition.exhibitionImage}
          alt={exhibition.title}
          width={600}
          height={400}
          layout="responsive"
          objectFit="cover"
        />
        <div className="absolute top-4 left-4 bg-[#F0A500] text-[#1A1C20] px-3 py-1 rounded-full text-sm font-semibold">
          {exhibition.status}
        </div>
      </div>
      <div className="md:w-1/3 p-6 flex flex-col justify-between">
        <div>
          <h3 className={`${playfair.className} text-2xl font-bold text-[#F0A500] mb-2`}>{exhibition.title}</h3>
          <p className="text-[#E6D5B8] mb-4">{exhibition.description}</p>
          <div className="flex items-center text-[#E6D5B8] text-sm mb-2">
            <Calendar size={16} className="mr-2" />
            <span>{new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-[#E6D5B8] text-sm mb-4">
            <MapPin size={16} className="mr-2" />
            <span>{exhibition.location}</span>
          </div>
        </div>
        <div className="flex items-center">
          <Image
            src={exhibition.artistImage}
            alt={exhibition.artist}
            width={50}
            height={50}
            className="rounded-full mr-4"
          />
          <p className="text-[#E6D5B8] font-semibold">{exhibition.artist}</p>
        </div>
      </div>
    </div>
  </div>
)

export default function GalleryExhibitionsPage() {
  return (
    <div className={`bg-[#1A1C20] min-h-screen ${poppins.variable} ${playfair.variable} font-sans`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`${playfair.className} text-4xl font-bold text-[#F0A500] mb-8 text-center`}>Gallery Exhibitions</h1>
        <div className="space-y-8">
          {exhibitions.map((exhibition) => (
            <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
          ))}
        </div>
      </div>
    </div>
  )
}