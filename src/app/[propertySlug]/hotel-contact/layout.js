// app/[propertySlug]/contact/layout.js
import React from "react";

async function getPropertyIdFromSlug(propertySlug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`,
      { cache: "no-store" }
    );
    const json = await res.json();

    return json?.data?.find(
      (item) => item?.propertySlug?.toLowerCase() === propertySlug?.toLowerCase()
    )?.propertyId || null;
  } catch (error) {
    console.error("Error fetching property list:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { propertySlug } = params;

  if (!propertySlug) {
    return {
      title: "Amritara Hotels And Resorts | Contact",
      description: "Amritara Hotels And Resorts | Contact Description",
    };
  }

  const propertyId = await getPropertyIdFromSlug(propertySlug);
  if (!propertyId) {
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
    const { data } = await metaRes.json();

    // Contact pageType = "7"
    const contactMeta = data?.find((item) => item.pageType === "7");

    const title = contactMeta?.metaTitle || "Amritara Hotels And Resorts | Contact";
    const description =
      contactMeta?.metaDescription || "Amritara Hotels And Resorts | Contact Description";

    return {
      title,
      description,
      openGraph: { title, description },
      alternates: { canonical: `/${propertySlug}/hotel-contact` },
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
  return children;
}
