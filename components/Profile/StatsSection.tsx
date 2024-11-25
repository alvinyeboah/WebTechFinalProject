 // app/components/profile/StatsSection.tsx
 import { Star } from 'lucide-react';
  
 interface StatsSectionProps {
   artworks: number;
   activeAuctions: number;
   followers: number;
   rating: number;
 }
 
 export const StatsSection = ({
   artworks,
   activeAuctions,
   followers,
   rating
 }: StatsSectionProps) => {
   return (
     <div className="grid grid-cols-4 gap-4 bg-[#1A1A1A] p-6 rounded-xl text-white">
       <StatItem label="Artworks" value={artworks} />
       <StatItem label="Active Auctions" value={activeAuctions} />
       <StatItem label="Followers" value={followers} />
       <div className="text-center">
         <div className="text-2xl font-bold text-[#FFD700]">{rating}</div>
         <div className="text-gray-300 flex items-center justify-center gap-1">
           Rating
           <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
         </div>
       </div>
     </div>
   );
 };
 
 const StatItem = ({ label, value }: { label: string; value: number }) => (
   <div className="text-center">
     <div className="text-2xl font-bold text-[#FFD700]">
       {value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value}
     </div>
     <div className="text-gray-300">{label}</div>
   </div>
 );
 