import React from "react";
import ArtGalleryNav from "@/components/home/ArtGalleryNav";
import SortingSidebar from "@/components/auctionwork/SortingSidebar";
import AuctionsPage from "@/components/auctionwork/AuctionsPage";

export default function Page() {
  return (
    <div className="bg-[#1A1C20] min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row flex-grow">
        <SortingSidebar />
        <main className="w-full md:flex-grow p-4">
          <AuctionsPage />
        </main>
      </div>
    </div>
  );
}
