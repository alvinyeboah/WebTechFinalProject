import Image from 'next/image'
import Link from 'next/link'

interface ArtworkCardProps {
  id: string
  title: string
  artist: string
  currentBid: number
  imageUrl: string
  endTime: Date
}

export function ArtworkCard({
  id,
  title,
  artist,
  currentBid,
  imageUrl,
  endTime
}: ArtworkCardProps) {
  return (
    <Link href={`/artwork/${id}`}>
      <div className="rounded-lg border p-4 hover:shadow-lg transition">
        <Image
          src={imageUrl}
          alt={title}
          width={300}
          height={300}
          className="rounded-md"
        />
        <h3 className="text-lg font-semibold mt-2">{title}</h3>
        <p className="text-gray-600">by {artist}</p>
        <p className="font-bold mt-2">Current Bid: ${currentBid}</p>
        <p className="text-sm text-gray-500">
          Ends: {endTime.toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}