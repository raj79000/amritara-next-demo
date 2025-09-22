// app/[propertySlug]/dining/layout.js

import React from "react";

// Helper function to fetch propertyId
async function getPropertyIdFromSlug(propertySlug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`, {
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
      title: "Amritara Hotels And Resorts | Dining",
      description: "Amritara Hotels And Resorts | Dining Description",
    };
  }

  // Step 1: Get propertyId from propertySlug
  const propertyId = await getPropertyIdFromSlug(propertySlug);

  if (!propertyId) {
    console.error("No property ID found for propertySlug:", propertySlug);
    return {
      title: "Amritara Hotels And Resorts | Dining",
      description: "Amritara Hotels And Resorts | Dining Description",
    };
  }

  // Step 2: Get meta data from metadata API
  try {
    const metaRes = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );
    const metaJson = await metaRes.json();

    const diningMeta = metaJson?.data?.find(
      (item) => item?.pageType?.toLowerCase() === "restaurants"
    );

    return {
      title: diningMeta?.metaTitle || "Amritara Hotels And Resorts | Dining",
      description: diningMeta?.metaDescription || "Amritara Hotels And Resorts | Dining Description",
      openGraph: {
        title: diningMeta?.metaTitle || "Amritara Hotels And Resorts | Dining",
        description: diningMeta?.metaDescription || "Amritara Hotels And Resorts | Dining Description",
      },
      alternates: {
        canonical: `/${propertySlug}/restaurants`,
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Amritara Hotels And Resorts | Dining",
      description: "Amritara Hotels And Resorts | Dining Description",
    };
  }
}

export default function Layout({ children }) {
  return <>{children}</>;
}
