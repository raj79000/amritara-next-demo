const BASE_URL = "http://loyaltypulsedemo.ownyourcustomers.in/Members";

const jpost = async (url, body, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body || {}) });
  return res.json();
};

// Auth & OTP
export const generateToken = () =>
  jpost(`${BASE_URL}/GenerateToken`, { UserId: "Amritara", Password: "Amritara123" });

export const getOtp = (token, payload) => jpost(`${BASE_URL}/GetOtp`, payload, token);
export const verifyOtp = (token, payload) => jpost(`${BASE_URL}/VerifyOtp`, payload, token);
export const signIn = (payload) => jpost(`${BASE_URL}/SignIn`, payload); // per Postman: no bearer

// Member profile
export const signup = (token, payload) => jpost(`${BASE_URL}/signup`, payload, token); // create new
export const profileInfo = (token, membershipId) =>
  jpost(`${BASE_URL}/ProfileInfo`, { MembershipId: membershipId }, token);
export const updateProfile = (token, payload) =>
  jpost(`${BASE_URL}/UpdateProfile`, payload, token);

// Lookups (optional for dropdowns)
export const getCountry = (token) => jpost(`${BASE_URL}/GetCountry`, {}, token);
export const getState = (token, CountryCode = "") =>
  jpost(`${BASE_URL}/GetState`, { CountryCode }, token);
export const getCity = (token, StateCode = "") =>
  jpost(`${BASE_URL}/GetCity`, { StateCode }, token);

// Extras if needed later
export const getTransaction = (token, payload) => jpost(`${BASE_URL}/GetTransaction`, payload, token);
export const submitQuery = (token, payload) => jpost(`${BASE_URL}/Queries`, payload, token);
