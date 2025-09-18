// app/[brandSlug]/[propertySlug]/events/page.js

import React from "react";
import EventHotelClient from "./EventHotelClient";

export default function EventPage({ params }) {
  const { propertySlug, id } = params;

  return (
    <EventHotelClient propertySlug={propertySlug} id={id} />
  );
}
