import Image from 'next/image'
import Link from 'next/link'

interface ArtworkCardProps {
  artwork_id: string;
  title: string;
  artist: {
    id: string;
    name: string;
    bio?: string;
  };
  images: {
    main: string;
    thumbnails?: string[];
    url: string;
  };
  currentPrice: number;
  onClick?: () => void;
}

export function ArtworkCard({
  artwork_id,
  title,
  artist,
  images,
  currentPrice,
  onClick
}: ArtworkCardProps) {
  const imageUrl = images?.url || images?.main || '/placeholder.jpg';
  
  return (
    <div 
      onClick={onClick}
      className="rounded-lg border p-4 hover:shadow-lg transition cursor-pointer"
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          width={300}
          height={300}
          className="rounded-md object-cover"
          placeholder="blur"
          blurDataURL="/placeholder.jpg"
        />
      )}
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-gray-600">by {artist.name}</p>
      <p className="font-bold mt-2">Current Price: ${currentPrice}</p>
    </div>
  );
}