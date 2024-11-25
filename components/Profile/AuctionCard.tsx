 // app/components/profile/AuctionCard.tsx
 import { Heart, Gavel, Clock } from 'lucide-react';
 
 interface AuctionCardProps {
   id: number;
   title: string;
   imageUrl: string;
   currentBid: number;
   bidCount: number;
   timeLeft: string;
 }
 
 export const AuctionCard = ({
   id,
   title,
   imageUrl,
   currentBid,
   bidCount,
   timeLeft
 }: AuctionCardProps) => {
   return (
     <div className="bg-[#1A1A1A] rounded-xl shadow-lg overflow-hidden border border-[#2D2D2D] hover:border-[#FFD700] transition-colors">
       <div className="relative">
         <img
           src={imageUrl}
           alt={title}
           className="w-full h-48 object-cover"
         />
         <button className="absolute top-2 right-2 p-2 bg-[#1A1A1A] rounded-full shadow-sm hover:bg-[#FFD700] transition-colors group">
           <Heart className="w-5 h-5 text-[#FFD700] group-hover:text-[#1A1A1A]" />
         </button>
       </div>
       
       <div className="p-4">
         <h3 className="font-semibold text-lg text-white">{title}</h3>
         <div className="flex justify-between items-center mt-2">
           <div className="text-gray-400">Current Bid</div>
           <div className="font-bold text-lg text-[#FFD700]">${currentBid.toLocaleString()}</div>
         </div>
         <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
           <div className="flex items-center gap-1">
             <Gavel className="w-4 h-4" />
             <span>{bidCount} bids</span>
           </div>
           <div className="flex items-center gap-1">
             <Clock className="w-4 h-4" />
             <span>{timeLeft}</span>
           </div>
         </div>
       </div>
     </div>
   );
 };
 