// app/[brandSlug]/[propertySlug]/rooms/layout.js

export async function generateMetadata({ params }) {
  const { propertySlug } = params;

  try {
    // Step 1: Fetch all properties to get the propertyId
    const res = await fetch("https://clarkscms.cinuniverse.com/Api/property/GetPropertyList", {
      cache: "no-store",
    });
    const json = await res.json();

    if (json.errorMessage !== "success") throw new Error("Failed to fetch property list");

    const property = json.data.find((p) => p.propertySlug === propertySlug);
    const propertyId = property?.propertyId;

    if (!propertyId) {
      return {
        title: "Rooms | Clarks Hotels",
        description: "Property not found.",
      };
    }

    // Step 2: Fetch metadata for the given propertyId
    const metaRes = await fetch(
      `https://clarkscms.cinuniverse.com/Api/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );
    const metaJson = await metaRes.json();

    if (metaJson.errorMessage !== "success") throw new Error("Failed to fetch metadata");

    // Step 3: Extract the metadata for the Rooms page
    const roomsMeta = metaJson.data.find((item) => item.pageType === "Rooms");

    return {
      title: roomsMeta?.metaTitle || "Rooms | Clarks Hotels",
      description: roomsMeta?.metaDescription || "",
      keywords: roomsMeta?.metaKeywords || "",
      openGraph: {
        title: roomsMeta?.metaTitle || "Rooms | Clarks Hotels",
        description: roomsMeta?.metaDescription || "",
      },
    };
  } catch (err) {
    console.error("Rooms page metadata fetch error:", err);
    return {
      title: "Rooms | Clarks Hotels",
      description: "Explore our rooms and suites.",
    };
  }
}

export default function RoomsLayout({ children }) {
  return <>{children}</>;
}
