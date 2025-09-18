// app/[brandSlug]/[propertySlug]/dining/page.js

import React from "react";
import DineHotelClient from "./DineHotelClient";

export default function DinePage({ params }) {
  const { brandSlug, propertySlug } = params;

  return (
    <DineHotelClient brandSlug={brandSlug} propertySlug={propertySlug} />
  );
}
