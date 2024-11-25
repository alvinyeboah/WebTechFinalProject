import React from "react";
import ArtGalleryNav from "@/components/home/ArtGalleryNav";
import ArtGalleryHero from "@/components/home/ArtGalleryHero";
import UpcomingAuctions from "@/components/home/UpcomingAuctions";
import FeaturedExhibition from "@/components/home/FeaturedExhibition";
import Footer from "@/components/home/footer";

type Props = {};

function Page({}: Props) {
  return (
    <div>
      <ArtGalleryNav/>
      <ArtGalleryHero/>
      <UpcomingAuctions/>
      <FeaturedExhibition/>
      <Footer/>
    </div>
  );
}

export default Page;
