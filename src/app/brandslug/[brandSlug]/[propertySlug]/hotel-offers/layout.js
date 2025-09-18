// app/[brandSlug]/[propertySlug]/Offer/layout.js

import React from "react";

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

export async function generateMetadata({ params }) {
  const { brandSlug, propertySlug } = params;

  if (!propertySlug) {
    console.error("No propertySlug found in params.");
    return {
      title: "Missing Property",
      description: "No metadata available.",
    };
  }

  const propertyId = await getPropertyIdFromSlug(propertySlug);

  if (!propertyId) {
    console.error("No property ID found for propertySlug:", propertySlug);
    return {
      title: "Property Not Found",
      description: "No metadata available for this property.",
    };
  }

  try {
    const metaRes = await fetch(
      `https://clarkscms.cinuniverse.com/Api/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );
    const metaJson = await metaRes.json();

    const offerMeta = metaJson?.data?.find((item) => {
      const pageType = item.pageType?.toLowerCase();
      return (
        pageType === "meetings & Offer" ||
        pageType === "Offer" ||
        pageType === "meetings"
      );
    });

    return {
      title: offerMeta?.metaTitle || "Clarks Hotels And Resorts | Offer",
      description: offerMeta?.metaDescription || "Clarks Hotels And Resorts | Offer Description",
      openGraph: {
        title: offerMeta?.metaTitle || "Clarks Hotels And Resorts | Offer",
        description: offerMeta?.metaDescription || "Clarks Hotels And Resorts | Offer Description",
      },
      alternates: {
        canonical: `/${brandSlug}/${propertySlug}/offer`, // plural matches folder name
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
