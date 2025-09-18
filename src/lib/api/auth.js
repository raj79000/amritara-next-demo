// lib/api/auth.js
const BASE_URL = "http://loyaltypulsedemo.ownyourcustomers.in/Members";

export async function generateToken() {
  const res = await fetch(`${BASE_URL}/GenerateToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      UserId: "Amritara",
      Password: "Amritara123",
    }),
  });
  return res.json();
}

export async function getOtp(token, payload) {
  const res = await fetch(`${BASE_URL}/GetOtp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload), // { MobileNo or EmailId }
  });
  return res.json();
}

export async function verifyOtp(token, payload) {
  const res = await fetch(`${BASE_URL}/VerifyOtp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload), // { MobileNo, EmailId, Otp }
  });
  return res.json();
}

export async function signIn(payload) {
  const res = await fetch(`${BASE_URL}/SignIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), // { MobileNo, EmailId, Otp }
  });
  return res.json();
}
