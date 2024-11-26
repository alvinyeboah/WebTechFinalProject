import React from "react";

import ArtGalleryNav from "@/components/home/ArtGalleryNav";
import GalleryExhibitionsPage from "@/components/gallery/GalleryExhibitionsPage";

type Props = {};

function page({}: Props) {
    return (
    <div>
        <GalleryExhibitionsPage />
    </div>
    );
}

export default page;