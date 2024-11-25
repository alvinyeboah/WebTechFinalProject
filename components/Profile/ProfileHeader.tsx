import { Mail, Share2, MapPin, Medal } from 'lucide-react';
  
  interface ProfileHeaderProps {
    name: string;
    location: string;
    bio: string;
    imageUrl: string;
    isOnline: boolean;
  }
  
  export const ProfileHeader = ({
    name,
    location,
    bio,
    imageUrl,
    isOnline
  }: ProfileHeaderProps) => {
    return (
      <div className="flex items-start gap-8">
        <div className="relative">
          <img
            src={imageUrl}
            alt={`${name}'s profile`}
            className="rounded-full w-32 h-32 object-cover border-4 border-[#FFD700] shadow-lg"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 bg-[#FFD700] w-4 h-4 rounded-full border-2 border-white"></span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#1A1A1A]">{name}</h1>
              <div className="flex items-center gap-2 text-[#4A4A4A] mt-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
                <Medal className="w-4 h-4 ml-2 text-[#FFD700]" />
                <span className="text-[#FFD700]">Verified Artist</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-[#FFD700] hover:bg-[#FFE55C] text-[#1A1A1A] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Mail className="w-4 h-4" />
                Contact
              </button>
              <button className="border border-[#FFD700] text-[#1A1A1A] hover:bg-[#FFD700]/10 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
          <p className="mt-4 text-[#4A4A4A]">{bio}</p>
        </div>
      </div>
    );
  };
  
 