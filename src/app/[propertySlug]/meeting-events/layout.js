// app/[propertySlug]/events/layout.js

export async function generateMetadata({ params }) {
  const { propertySlug } = params;

  try {
    // Step 1: Fetch property list to get propertyId
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (json.errorMessage !== "success") throw new Error("Property list fetch failed");

    const property = json.data.find((p) => p.propertySlug.toLowerCase() === propertySlug.toLowerCase());
    const propertyId = property?.propertyId;

    if (!propertyId) {
      return {
        title: "Events | Amritara Hotels",
        description: "Explore our elegant event venues across India.",
      };
    }

    // Step 2: Fetch meta tags for that propertyId
    const metaRes = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );
    const metaJson = await metaRes.json();
    if (metaJson.errorMessage !== "success") throw new Error("Meta fetch failed");

    // Step 3: Get metadata for "Meetings & Events"
    const eventMeta = metaJson.data.find((item) => item.pageType === "Meetings & Events");

    return {
      title: eventMeta?.metaTitle || "Events | Amritara Hotels",
      description: eventMeta?.metaDescription || "",
      keywords: eventMeta?.metaKeywords || "",
      openGraph: {
        title: eventMeta?.metaTitle || "Events | Amritara Hotels",
        description: eventMeta?.metaDescription || "",
      },
    };
  } catch (error) {
    console.error("Events metadata fetch error:", error);
    return {
      title: "Events | Amritara Hotels",
      description: "Explore our stunning venues for events and weddings.",
    };
  }
}

export default function EventsLayout({ children }) {
  return <>{children}</>;
}
