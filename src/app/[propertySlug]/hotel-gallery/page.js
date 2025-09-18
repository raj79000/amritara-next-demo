import React from "react";
import GalleryHotelClient from "./GalleryHotelClient";
export default async function GalleryPage({ params }) {
  const { propertySlug, id } = params; 
 
  return (
    <>
      <GalleryHotelClient propertySlug={propertySlug} id={id}  />
    </>
  );
}
