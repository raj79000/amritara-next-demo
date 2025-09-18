// app/[brandSlug]/[propertySlug]/dining/layout.js

import React from "react";

// Helper function to fetch propertyId
async function getPropertyIdFromSlug(propertySlug) {
  try {
    const res = await fetch("https://clarkscms.cinuniverse.com/Api/property/GetPropertyList", {
      cache: "no-store",
    });
    const json = await res.json();

    const matchedProperty = json?.data?.find(
      (item) => item?.propertySlug?.toLowerCase() === propertySlug?.toLowerCase()
    );

    return matchedProperty?.propertyId || null;
  } catch (error) {
    console.error("Error fetching property list:", error);
    return null;
  }
}

// Metadata function
export async function generateMetadata({ params }) {
  const { brandSlug, propertySlug } = params;

  if (!propertySlug) {
    console.error("No propertySlug found in params.");
    return {
      title: "Missing Property",
      description: "No property metadata available.",
    };
  }

  // Step 1: Get propertyId from propertySlug
  const propertyId = await getPropertyIdFromSlug(propertySlug);

  if (!propertyId) {
    console.error("No property ID found for propertySlug:", propertySlug);
    return {
      title: "Property Not Found",
      description: "No metadata available for this property.",
    };
  }

  // Step 2: Get meta data from metadata API
  try {
    const metaRes = await fetch(
      `https://clarkscms.cinuniverse.com/Api/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );
    const metaJson = await metaRes.json();

    const diningMeta = metaJson?.data?.find(
      (item) => item?.pageType?.toLowerCase() === "dining"
    );

    return {
      title: diningMeta?.metaTitle || "Clarks Hotels And Resorts | Dining",
      description: diningMeta?.metaDescription || "Clarks Hotels And Resorts | Dining Description",
      openGraph: {
        title: diningMeta?.metaTitle || "Clarks Hotels And Resorts | Dining",
        description: diningMeta?.metaDescription || "Clarks Hotels And Resorts | Dining Description",
      },
      alternates: {
        canonical: `/${brandSlug}/${propertySlug}/dining`,
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Error Fetching Metadata",
      description: "Could not load metadata for this page.",
    };
  }
}

export default function Layout({ children }) {
  return <>{children}</>;
}
