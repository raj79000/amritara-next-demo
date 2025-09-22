

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
      title: "Amritara Hotels And Resorts | Offer",
      description: "Amritara Hotels And Resorts | Offer Description",
    };
  }

  const propertyId = await getPropertyIdFromSlug(propertySlug);

  if (!propertyId) {
    console.error("No property ID found for propertySlug:", propertySlug);
    return {
     title: "Amritara Hotels And Resorts | Offer",
      description: "Amritara Hotels And Resorts | Offer Description",
    };
  }

  try {
    const metaRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );
    const metaJson = await metaRes.json();

    const offerMeta = metaJson?.data?.find((item) => {
      const pageType = item.pageType?.toLowerCase();
      return (
        pageType === "Offer".toLowerCase() || pageType === "hotel-deals-offers".toLowerCase()
      );
    });

    return {
      title: offerMeta?.metaTitle || "Amritara Hotels And Resorts | Offer",
      description: offerMeta?.metaDescription || "Amritara Hotels And Resorts | Offer Description",
      openGraph: {
        title: offerMeta?.metaTitle || "Amritara Hotels And Resorts | Offer",
        description: offerMeta?.metaDescription || "Amritara Hotels And Resorts | Offer Description",
      },
      alternates: {
        canonical: `/${propertySlug}/hotel-deals-offers`, // plural matches folder name
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Amritara Hotels And Resorts | Offer",
      description: "Amritara Hotels And Resorts | Offer Description",
    };
  }
}

export default function Layout({ children }) {
  return <>{children}</>;
}
