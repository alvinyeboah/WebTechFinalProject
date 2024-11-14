import React from 'react'
import Image from 'next/image'
import { Poppins, Caveat } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-caveat',
})

const featuredExhibition = {
  id: 1,
  title: "Chromatic Visions",
  artist: "Elena Rodriguez",
  date: "June 15 - July 30, 2023",
  description: "An immersive journey through vibrant abstract landscapes, exploring the interplay of color and emotion. Elena Rodriguez's masterful use of acrylics and mixed media creates a sensory experience that challenges perceptions and invites viewers to lose themselves in a world of pure chromatic energy.",
  exhibitionImage: "/placeholder.svg?height=600&width=800",
  artistImage: "/placeholder.svg?height=600&width=400",
}

export default function FeaturedExhibition() {
  return (
    <section className={`bg-[#1A1C20] text-[#E6D5B8] py-16 ${poppins.variable} ${caveat.variable} font-sans`}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl mb-4 font-caveat font-bold text-left pl-4">
          Featured Exhibition
        </h2>
        <p className="text-left text-sm mb-12 max-w-2xl pl-4">
          Immerse yourself in our current showcase, highlighting the pinnacle of contemporary artistic expression.
        </p>
        <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg">
          <div className="relative w-full md:w-[65%] h-64 md:h-[600px]">
            <Image 
              src={featuredExhibition.exhibitionImage}
              alt={featuredExhibition.title}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C20] to-transparent opacity-70" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-3xl font-caveat font-semibold mb-2">{featuredExhibition.title}</h3>
              <p className="text-lg mb-2">{featuredExhibition.date}</p>
              <p className="text-sm">{featuredExhibition.description}</p>
            </div>
          </div>
          <div className="w-full md:w-[35%] bg-[#2A2C30] p-6 flex flex-col justify-center items-center">
            <div className="relative w-full h-64 md:h-[400px] mb-6">
              <Image 
                src={featuredExhibition.artistImage}
                alt={featuredExhibition.artist}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <p className="text-2xl font-caveat font-bold text-[#F0A500] mb-4">{featuredExhibition.artist}</p>
            <button className="px-6 py-3 bg-[#F0A500] text-[#1A1C20] rounded-full text-lg font-semibold hover:bg-[#E6D5B8] transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}