

import React from "react";

async function getPropertyIdFromSlug(propertySlug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`, {
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
      title: "Amritara Hotels And Resorts | Contact",
      description: "Amritara Hotels And Resorts | Contact Description",
    };
  }

  // Get propertyId from slug
  const propertyId = await getPropertyIdFromSlug(propertySlug);

  if (!propertyId) {
    console.error("No property ID found for propertySlug:", propertySlug);
    return {
      title: "Amritara Hotels And Resorts | Contact",
      description: "Amritara Hotels And Resorts | Contact Description",
    };
  }

  try {
    const metaRes = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );
    const metaJson = await metaRes.json();

    // Adjust this filter to exact pageType from your API
    const contactMeta = metaJson?.data?.find(
      (item) => item.pageType?.toLowerCase() === "contact us" || item.pageType?.toLowerCase() === "hotel-contact"
    );

    return {
      title: contactMeta?.metaTitle || "Amritara Hotels And Resorts | Contact",
      description: contactMeta?.metaDescription || "Amritara Hotels And Resorts | Contact Description",
      openGraph: {
        title: contactMeta?.metaTitle || "Amritara Hotels And Resorts | Contact",
        description: contactMeta?.metaDescription || "Amritara Hotels And Resorts | Contact Description",
      },
      alternates: {
        canonical: `${propertySlug}/hotel-contact`,
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Amritara Hotels And Resorts | Contact",
      description: "Amritara Hotels And Resorts | Contact Description",
    };
  }
}

export default function Layout({ children }) {
  return <>{children}</>;
}
