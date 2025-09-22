// app/[brandSlug]/[propertySlug]/rooms/layout.js

export async function generateMetadata({ params }) {
  const { propertySlug } = params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`, {
      cache: "no-store",
    });
    const json = await res.json();

    if (json.errorMessage !== "success") throw new Error("Failed to fetch property list");

    const property = json.data.find((p) => p.propertySlug === propertySlug);
    const propertyId = property?.propertyId;

    if (!propertyId) {
      return {
        title: "Things to do | Amritara Hotels and Resorts",
        description: "Things to do | Amritara Hotels and Resorts",
      };
    }

    // Step 2: Fetch metadata for the given propertyId
    const metaRes = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );
    const metaJson = await metaRes.json();

    if (metaJson.errorMessage !== "success") throw new Error("Failed to fetch metadata");

    // Step 3: Extract the metadata for the Rooms page
    const roomsMeta = metaJson.data.find((item) => item.pageType === "experiences");

    return {
      title: roomsMeta?.metaTitle || "Things to do | Amritara Hotels and Resorts",
      description: roomsMeta?.metaDescription || "",
      keywords: roomsMeta?.metaKeywords || "",
      openGraph: {
        title: roomsMeta?.metaTitle || "Things to do | Amritara Hotels and Resorts",
        description: roomsMeta?.metaDescription || "",
      },
    };
  } catch (err) {
    console.error("Rooms page metadata fetch error:", err);
    return {
     title: "Things to do | Amritara Hotels and Resorts",
        description: "Things to do | Amritara Hotels and Resorts",
    };
  }
}

export default function ExperienceLayout({ children }) {
  return <>{children}</>;
}
