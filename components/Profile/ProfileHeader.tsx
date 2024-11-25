import React from 'react'
import Image from 'next/image'
import { User } from 'lucide-react'

interface ProfileHeaderProps {
  name: string
  location: string
  bio: string
  imageUrl: string
  isOnline: boolean
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  location,
  bio,
  imageUrl,
  isOnline
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-[#2A2C30] p-6 rounded-lg shadow-lg">
      <div className="relative">
        <Image
          src={imageUrl}
          alt={name}
          width={150}
          height={150}
          className="rounded-full"
        />
        {isOnline && (
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-[#2A2C30]"></div>
        )}
      </div>
      <div className="text-center md:text-left">
        <h1 className={`text-3xl font-bold text-[#F0A500] font-playfair mb-2`}>{name}</h1>
        <p className="text-[#E6D5B8] mb-4 flex items-center justify-center md:justify-start">
          <User size={16} className="mr-2" />
          {location}
        </p>
        <p className="text-[#E6D5B8] max-w-2xl">{bio}</p>
      </div>
    </div>
  )
}

