// app/[propertySlug]/gallery/layout.js

export async function generateMetadata({ params }) {
  const { propertySlug } = params;

  // Define static fallback metadata
  const fallbackMeta = {
    title: "Gallery | Amritara Hotels",
    description: "Explore stunning visuals from Amritara Hotels.",
    keywords: "",
    openGraph: {
      title: "Gallery | Amritara Hotels",
      description: "Explore stunning visuals from Amritara Hotels.",
    },
  };

  try {
    // Step 1: Get property list
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.warn("Property list request failed", res.status);
      return fallbackMeta;
    }

    const json = await res.json();
    const properties = Array.isArray(json?.data) ? json.data : [];

    const property = properties.find(
      (p) => p.propertySlug?.toLowerCase() === propertySlug.toLowerCase()
    );

    if (!property?.propertyId) {
      console.warn(`No propertyId found for slug: ${propertySlug}`);
      return fallbackMeta;
    }

    // Step 2: Get metadata for this property
    const metaRes = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyMetaTags?propertyId=${property.propertyId}`,
      { cache: "no-store" }
    );

    if (!metaRes.ok) {
      console.warn("Metadata request failed", metaRes.status);
      return fallbackMeta;
    }

    const metaJson = await metaRes.json();
    const metas = Array.isArray(metaJson?.data) ? metaJson.data : [];

    // Step 3: Look for Gallery page metadata
    const galleryMeta = metas.find(
      (item) => item.pageType?.toLowerCase() === "gallery"
    );

    if (!galleryMeta) {
      console.warn(`No Gallery metadata found for propertyId: ${property.propertyId}`);
      return fallbackMeta;
    }

    // ✅ Merge API metadata with fallback
    return {
      title: galleryMeta.metaTitle || fallbackMeta.title,
      description: galleryMeta.metaDescription || fallbackMeta.description,
      keywords: galleryMeta.metaKeywords || fallbackMeta.keywords,
      openGraph: {
        title: galleryMeta.metaTitle || fallbackMeta.openGraph.title,
        description: galleryMeta.metaDescription || fallbackMeta.openGraph.description,
      },
    };
  } catch (error) {
    console.error("Gallery metadata error:", error);
    return fallbackMeta;
  }
}

export default function GalleryLayout({ children }) {
  return <>{children}</>;
}
