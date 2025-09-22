// app/[propertySlug]/gallery/layout.js

export async function generateMetadata({ params }) {
  const { propertySlug } = params;

  // Fallback metadata
  const fallbackMeta = {
    title: "Gallery | Amritara Hotels",
    description: "Explore stunning visuals from Amritara Hotels.",
    keywords: "",
    openGraph: {
      title: "Gallery | Amritara Hotels",
      description: "Explore stunning visuals from Amritara Hotels.",
    },
    alternates: { canonical: `/${propertySlug}/hotel-gallery` },
  };

  try {
    // Step 1: Fetch property list
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`,
      { cache: "no-store" }
    );
    if (!res.ok) return fallbackMeta;

    const { data } = await res.json();
    const propertyId = data?.find(
      (p) => p.propertySlug?.toLowerCase() === propertySlug.toLowerCase()
    )?.propertyId;

    if (!propertyId) return fallbackMeta;

    // Step 2: Fetch property meta tags
    const metaRes = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );
    if (!metaRes.ok) return fallbackMeta;

    const { data: metas } = await metaRes.json();

    // Step 3: Find Gallery metadata (pageType = "6")
    const galleryMeta = metas?.find((item) => item.pageType === "6");
    if (!galleryMeta) return fallbackMeta;

    const title = galleryMeta.metaTitle || fallbackMeta.title;
    const description = galleryMeta.metaDescription || fallbackMeta.description;
    const keywords = galleryMeta.metaKeywords || fallbackMeta.keywords;

    return {
      title,
      description,
      keywords,
      openGraph: { title, description },
      alternates: { canonical: `/${propertySlug}/hotel-gallery` },
    };
  } catch (error) {
    console.error("Gallery metadata error:", error);
    return fallbackMeta;
  }
}

export default function GalleryLayout({ children }) {
  return children;
}
