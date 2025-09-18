import React from "react";
import OfferHotelClient from "./OfferHotelClient";

export default function OfferPage({ params }) {
  const { propertySlug, id } = params;
  return <OfferHotelClient propertySlug={propertySlug} id={id} />;
}
