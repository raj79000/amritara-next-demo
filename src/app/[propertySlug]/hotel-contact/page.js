

import React from "react";
import ContactHotelClient from "./ContactHotelClient";

export default async function ContactPage({ params }) {
  const { brandSlug, propertySlug } = params;

  return (
    <ContactHotelClient brandSlug={brandSlug} propertySlug={propertySlug} />
  );
}
