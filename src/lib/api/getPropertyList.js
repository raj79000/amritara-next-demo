const BASE_URL = process.env.NEXT_PUBLIC_CMS_API_Base_URL;

export async function getPropertyList() {
  try {
    const res = await fetch(
      `${BASE_URL}/property/GetPropertyList`,
      { method: "GET" }
    );

    if (!res.ok) {
      throw new Error(`Failed: PropertyList → ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching property list:", err);
    return { data: [] };
  }
}
