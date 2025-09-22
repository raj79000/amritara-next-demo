// app/[propertySlug]/dining/layout.js

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
      title: "Amritara Hotels And Resorts | Dining",
      description: "Amritara Hotels And Resorts | Dining Description",
    };
  }

  const propertyId = await getPropertyIdFromSlug(propertySlug);
  if (!propertyId) {
    return {
      title: "Amritara Hotels And Resorts | Dining",
      description: "Amritara Hotels And Resorts | Dining Description",
    };
  }

  try {
    const metaRes = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );
    const { data } = await metaRes.json();

    // Dining pageType = "3"
    const diningMeta = data?.find((item) => item.pageType === "3");

    const title = diningMeta?.metaTitle || "Amritara Hotels And Resorts | Dining";
    const description =
      diningMeta?.metaDescription || "Amritara Hotels And Resorts | Dining Description";

    return {
      title,
      description,
      openGraph: { title, description },
      alternates: { canonical: `/${propertySlug}/dining` },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Amritara Hotels And Resorts | Dining",
      description: "Amritara Hotels And Resorts | Dining Description",
    };
  }
}

export default function Layout({ children }) {
  return children;
}
