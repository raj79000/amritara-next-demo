
const BASE_URL = `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/`;
// const BASE_URL = "http://loyaltypulsedemo.ownyourcustomers.in/cms/property/";

export async function getAPI(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Failed: ${endpoint} (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
}

export async function postAPI(endpoint, body) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed: ${endpoint} (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
}
