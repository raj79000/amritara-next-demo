import React from "react";
import RoomHotelClient from "./RoomHotelClient";

export default async function accomodationPage({ params }) {
 const resolvedParams = await params;
  const { brand_slug } = resolvedParams;

  return (
    <>
      <RoomHotelClient brand_slug={brand_slug} />   
     
    </>
  );
}
