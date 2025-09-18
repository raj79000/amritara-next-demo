

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

  // Get propertyId from slug
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

    // Adjust this filter to exact pageType from your API
    const contactMeta = metaJson?.data?.find(
      (item) => item.pageType?.toLowerCase() === "contact us" || item.pageType?.toLowerCase() === "contact"
    );

    return {
      title: contactMeta?.metaTitle || "Clarks Hotels And Resorts | Contact",
      description: contactMeta?.metaDescription || "Clarks Hotels And Resorts | Contact Description",
      openGraph: {
        title: contactMeta?.metaTitle || "Clarks Hotels And Resorts | Contact",
        description: contactMeta?.metaDescription || "Clarks Hotels And Resorts | Contact Description",
      },
      alternates: {
        canonical: `/${brandSlug}/${propertySlug}/contact`,
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
