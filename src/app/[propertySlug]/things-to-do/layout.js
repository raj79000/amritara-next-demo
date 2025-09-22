

export async function generateMetadata({ params }) {
  const { propertySlug } = params;

  const fallbackMeta = {
    title: "Things to do | Amritara Hotels and Resorts",
    description: "Things to do | Amritara Hotels and Resorts",
  };

  try {
    // Step 1: Fetch property list
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`,
      { cache: "no-store" }
    );
    const { data, errorMessage } = await res.json();
    if (errorMessage !== "success") return fallbackMeta;

    const propertyId = data?.find((p) => p.propertySlug === propertySlug)?.propertyId;
    if (!propertyId) return fallbackMeta;

    // Step 2: Fetch property meta tags
    const metaRes = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );
    const { data: metas, errorMessage: metaError } = await metaRes.json();
    if (metaError !== "success") return fallbackMeta;

    // Step 3: Find metadata for Experiences / Things To Do (pageType = "5")
    const experiencesMeta = metas?.find((item) => item.pageType === "5");
    if (!experiencesMeta) return fallbackMeta;

    const title = experiencesMeta.metaTitle || fallbackMeta.title;
    const description = experiencesMeta.metaDescription || fallbackMeta.description;
    const keywords = experiencesMeta.metaKeywords || "";

    return {
      title,
      description,
      keywords,
      openGraph: { title, description },
      alternates: { canonical: `/${propertySlug}/things-to-do` },
    };
  } catch (err) {
    console.error("Experiences metadata fetch error:", err);
    return fallbackMeta;
  }
}

export default function ExperienceLayout({ children }) {
  return children;
}
