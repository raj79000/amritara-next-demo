const BASE_URL = `${process.env.NEXT_PUBLIC_MEMBERS_API}/Members`;

const jpost = async (url, body, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;


  // DEV: log what we’re sending so you can confirm the payload
  console.log("[signup/jpost] POST", url, { hasToken: !!token, body });

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body || {}) });

  // Try JSON first; fall back to text
  let json = null, text = null;
  try { json = await res.json(); }
  catch { try { text = await res.text(); } catch(_) {} }
  const out = json ?? { success: false, errorCode: res.status, error: text || "HTTP error" };

  console.log("[signup/jpost] RESP", url, out);
  return out;
};

export const generateTokenRaw = async () => {
  const res = await fetch(`${BASE_URL}/GenerateToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ UserId: "Amritara", Password: "Amritara123" }),
  });
  let json = null;
  try { json = await res.json(); } catch {}
  const headers = {};
  res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
  return { json, headers, status: res.status };
};

export const getOtp    = (token, payload) => jpost(`${BASE_URL}/GetOtp`, payload, token);
export const verifyOtp = (token, payload) => jpost(`${BASE_URL}/VerifyOtp`, payload, token);
export const profileInfo = (token, membershipId) =>
  jpost(`${BASE_URL}/ProfileInfo`, { MembershipId: membershipId }, token);
export const updateProfile = (token, payload) =>
  jpost(`${BASE_URL}/UpdateProfile`, payload, token);

// Lookups
export const getCountry = (token) => jpost(`${BASE_URL}/GetCountry`, {}, token);

// ---------- SMART SIGNUP with fallbacks ----------
export const signup = async (token, payload) => {
  // 0) try to fetch CountryCode by name if Country present
  let countryCode = "";
  try {
    if (payload?.Country) {
      const countries = await getCountry(token);
      const list = countries?.Data || countries?.data || countries?.result || countries;
      if (Array.isArray(list)) {
        const match = list.find((c) => {
          const name = (c?.CountryName || c?.countryName || c?.Name || "").toString().trim().toLowerCase();
          return name === payload.Country.toString().trim().toLowerCase();
        });
        countryCode = match?.CountryCode || match?.countryCode || match?.Code || "";
      }
    }
  } catch (e) {
    console.warn("[signup] GetCountry failed (non-fatal):", e);
  }

  // Build four variants to try (order: most likely to succeed first)
  const variants = [];

  // A) original spelling (MobilePrifix)
  variants.push({
    url: `${BASE_URL}/signup`,
    body: { ...payload, ...(countryCode ? { CountryCode: countryCode } : {}) },
  });

  // B) original spelling + TitleCase endpoint
  variants.push({
    url: `${BASE_URL}/SignUp`,
    body: { ...payload, ...(countryCode ? { CountryCode: countryCode } : {}) },
  });

  // C) MobilePrefix variant
  const bodyPrefix = { ...payload };
  if (bodyPrefix.MobilePrifix && !bodyPrefix.MobilePrefix) {
    bodyPrefix.MobilePrefix = bodyPrefix.MobilePrifix;
    delete bodyPrefix.MobilePrifix;
  }
  variants.push({
    url: `${BASE_URL}/signup`,
    body: { ...bodyPrefix, ...(countryCode ? { CountryCode: countryCode } : {}) },
  });

  // D) MobilePrefix + TitleCase endpoint
  variants.push({
    url: `${BASE_URL}/SignUp`,
    body: { ...bodyPrefix, ...(countryCode ? { CountryCode: countryCode } : {}) },
  });

  // Try in order; return first success (errorCode 0)
  let last = null;
  for (const v of variants) {
    const resp = await jpost(v.url, v.body, token);
    last = resp;
    if (resp?.success === true && Number(resp?.errorCode) === 0) {
      return resp;
    }
  }
  return last; // most informative failure
};





// Lookups
// export const getCountry = (token) => jpost(`${BASE_URL}/GetCountry`, {}, token);
export const getState = (token, CountryCode = "") => jpost(`${BASE_URL}/GetState`, { CountryCode }, token);
export const getCity = (token, StateCode = "") => jpost(`${BASE_URL}/GetCity`, { StateCode }, token);

// Extras
export const getTransaction = (token, payload) => jpost(`${BASE_URL}/GetTransaction`, payload, token);
export const submitQuery = (token, payload) => jpost(`${BASE_URL}/Queries`, payload, token);
