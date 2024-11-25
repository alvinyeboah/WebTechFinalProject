import React from "react";

import ArtGalleryNav from "@/components/home/ArtGalleryNav";
import ArtGalleryHero from "@/components/home/ArtGalleryHero";
import UpcomingAuctions from "@/components/home/UpcomingAuctions";
import FeaturedExhibition from "@/components/home/FeaturedExhibition";
import Footer from "@/components/home/footer";
import SortingSidebar from "@/components/auctionwork/SortingSidebar";
import AuctionsPage from "@/components/auctionwork/AuctionsPage";

type Props = {};

function page({}: Props) {
    return (
    <div>
        <ArtGalleryNav />
        <SortingSidebar/>
        <AuctionsPage/>
    </div>
    );
}

export default page;
