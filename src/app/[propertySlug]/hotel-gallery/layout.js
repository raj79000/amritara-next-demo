// app/[brandSlug]/[propertySlug]/gallery/layout.js

export async function generateMetadata({ params }) {
  const { propertySlug } = params;

  try {
    // Step 1: Get propertyId from slug
    const res = await fetch("https://clarkscms.cinuniverse.com/Api/property/GetPropertyList", {
      cache: "no-store",
    });
    const json = await res.json();
    if (json.errorMessage !== "success") throw new Error("Property list fetch failed");

    const property = json.data.find(
      (p) => p.propertySlug.toLowerCase() === propertySlug.toLowerCase()
    );
    const propertyId = property?.propertyId;

    if (!propertyId) {
      return {
        title: "Gallery | Clarks Hotels",
        description: "Explore stunning visuals from Clarks Hotels.",
      };
    }

    // Step 2: Get meta data by propertyId
    const metaRes = await fetch(
      `https://clarkscms.cinuniverse.com/Api/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );
    const metaJson = await metaRes.json();
    if (metaJson.errorMessage !== "success") throw new Error("Meta tag fetch failed");

    // Step 3: Filter for "Gallery"
    const galleryMeta = metaJson.data.find((item) => item.pageType === "Gallery");

    return {
      title: galleryMeta?.metaTitle || "Gallery | Clarks Hotels",
      description: galleryMeta?.metaDescription || "",
      keywords: galleryMeta?.metaKeywords || "",
      openGraph: {
        title: galleryMeta?.metaTitle || "Gallery | Clarks Hotels",
        description: galleryMeta?.metaDescription || "",
      },
    };
  } catch (error) {
    console.error("Gallery metadata error:", error);
    return {
      title: "Gallery | Clarks Hotels",
      description: "Explore beautiful hotel gallery collections.",
    };
  }
}

export default function GalleryLayout({ children }) {
  return <>{children}</>;
}
