"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  generateTokenRaw,
  getOtp,
  verifyOtp,
  signup,
  profileInfo,
  updateProfile,
} from "@/lib/api/auth";

/* -------------------- helpers (truthy / normalize / completeness / otp) -------------------- */
const truthy = (v) => v !== undefined && v !== null && String(v).trim() !== "";

// const normalizeUser = (raw = {}) => {
//   const u = raw || {};
//   const PPA = (u.PrivacyPolicyAcceptance ?? u.PPAcceptance ?? u.IsTermsAccepted ?? "")
//     .toString()
//     .toUpperCase();
//   return {
//     MemberId:
//       u.MembershipId ?? u.MemberId ?? u.membershipId ?? u.Id ?? u.MemberID ?? null,
//     FirstName:
//       u.FirstName ?? u.firstname ?? u.GivenName ?? u.Name?.split?.(" ")?.[0] ?? "",
//     LastName:
//       u.LastName ??
//       u.lastname ??
//       u.Surname ??
//       (u.Name?.split?.(" ")?.slice(1).join(" ") ?? ""),
//     EmailId: u.EmailId ?? u.Email ?? u.EmailID ?? "",
//     MobilePrifix: u.MobilePrifix ?? u.MobilePrefix ?? u.CountryCode ?? "+91",
//     MobileNo: u.MobileNo ?? u.Mobile ?? u.Phone ?? u.PhoneNumber ?? "",
//     City: u.City ?? "",
//     StateCode: u.StateCode ?? "",
//     Country: u.Country ?? "",
//     PrivacyPolicyAcceptance: PPA === "Y" ? "Y" : "N",
//     CardNo: u.cardno ?? u.CardNo ?? null,
//     _raw: u,
//   };
// };

const normalizeUser = (raw = {}) => {
  const u = raw || {};
  const PPA = (u.PrivacyPolicyAcceptance ?? u.PPAcceptance ?? u.IsTermsAccepted ?? "")
    .toString()
    .toUpperCase();

  // Numbers often come as strings ("0", "10", "4500.00")
  const toNum = (v, d = 0) => {
    const n = Number(String(v ?? "").replace(/[, ]/g, ""));
    return Number.isFinite(n) ? n : d;
  };

  return {
    /* IDs */
    MemberId:
      u.MembershipId ??
      u.MemberId ??
      u.membershipId ??
      u.cardNo ??            // ProfileInfo
      u.CardNo ??
      u.Id ??
      u.MemberID ??
      null,

    CardNo: u.cardNo ?? u.CardNo ?? null,

    /* Name + contact */
    FirstName:
      u.FirstName ??
      u.firstname ??
      u.firstName ??         // ProfileInfo
      u.GivenName ??
      u.Name?.split?.(" ")?.[0] ??
      "",

    LastName:
      u.LastName ??
      u.lastname ??
      u.lastName ??          // ProfileInfo
      u.Surname ??
      (u.Name?.split?.(" ")?.slice(1).join(" ") ?? ""),

    EmailId:
      u.EmailId ??
      u.emailId ??           // ProfileInfo
      u.Email ??
      u.EmailID ??
      "",

    MobilePrifix:
      u.MobilePrifix ??
      u.MobilePrefix ??
      u.CountryCode ??
      "+91",

    MobileNo:
      u.MobileNo ??
      u.mobileNumber ??      // ProfileInfo
      u.Mobile ??
      u.Phone ??
      u.PhoneNumber ??
      "",

    /* Location */
    City:    u.City ?? u.cityName ?? "",            // ProfileInfo
    State:   u.State ?? u.stateName ?? "",          // ProfileInfo
    Country: u.Country ?? u.country ?? "",          // ProfileInfo
    Address: u.address ?? u.Address ?? "",          // ProfileInfo

    /* Loyalty stats (ProfileInfo) */
    TierId:           u.tierId ?? "",
    TierName:         u.tierName ?? "",
    PointsBalance:    toNum(u.pointsBalance, 0),
    PointsToNextTier: toNum(u.pointstoNextTier, 0),
    StaysToNextTier:  toNum(u.staystoNextTier, 0),
    TotalStays:       toNum(u.totalStays, 0),
    EnrolDate:        u.enrolDate ?? "",
    TierEndDate:      u.tierEndDate ?? "",
    PointsExpiryDate: u.dateofPontsExpiry ?? "",
    PointsExpiryAmt:  toNum(u.amountofPontsExpiry, 0),

    /* Misc (ProfileInfo) */
    MemberCreateDate: u.memberCreateDate ?? "",
    DateOfBirth:      u.dateofBirth ?? "",
    WeddingAnniv:     u.weddingAnniversary ?? "",
    Gender:           u.gender ?? "",

    /* Acceptance:
       If we have a valid card/id from server, treat as accepted (server doesn’t send it) */
    PrivacyPolicyAcceptance: PPA === "Y" ? "Y" : (u.cardNo || u.CardNo ? "Y" : "N"),

    _raw: u,
  };
};



// const isProfileComplete = (nu) =>
//   truthy(nu.MemberId) &&
//   truthy(nu.FirstName) &&
//   truthy(nu.LastName) &&
//   (truthy(nu.EmailId) || truthy(nu.MobileNo)) &&
//   nu.PrivacyPolicyAcceptance === "Y";

const isProfileComplete = (nu) =>
  // id or card present
  (truthy(nu.MemberId) || truthy(nu.CardNo)) &&
  // has at least a name and a way to contact
  (truthy(nu.FirstName) || truthy(nu.LastName)) &&
  (truthy(nu.EmailId) || truthy(nu.MobileNo));

const isValidOtp = (otp) => /^[0-9]{6}$/.test(String(otp || "").trim());

/* -------------------- token extraction utils -------------------- */

// Scan any JSON shape for a token-looking string
const pluckTokenFromObject = (obj) => {
  let found = "";
  const seen = new Set();

  const visit = (val) => {
    if (!val || seen.has(val)) return;
    if (typeof val === "string") {
      if (val.length >= 20 && !/\s/.test(val)) {
        if (!found) found = val;
      }
      return;
    }
    if (Array.isArray(val)) {
      for (const x of val) visit(x);
      return;
    }
    if (typeof val === "object") {
      seen.add(val);
      for (const k of Object.keys(val)) {
        const v = val[k];
        if (/token|auth|bearer/i.test(k)) {
          if (typeof v === "string" && v.length >= 20 && !/\s/.test(v)) {
            if (!found) found = v;
          } else {
            visit(v);
          }
        } else {
          visit(v);
        }
      }
    }
  };

  visit(obj);
  return found;
};

// Extract token from { json, headers } returned by generateTokenRaw()
const extractTokenFromGenerateToken = ({ json, headers }) => {
  const direct =
    json?.Data?.Token ||
    json?.data?.token ||
    json?.Result?.Token ||
    json?.result?.token ||
    json?.Token ||
    json?.token ||
    "";
  if (direct && direct.length >= 20) return direct;

  const scanned = pluckTokenFromObject(json);
  if (scanned) return scanned;

  const hAuth =
    headers?.authorization || headers?.["x-auth-token"] || headers?.["x-token"];
  if (hAuth && hAuth.length >= 20) {
    const parts = hAuth.split(/\s+/);
    return parts.length > 1 ? parts[1] : parts[0];
  }
  return "";
};

/* -------------------- context -------------------- */

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // hydrate from sessionStorage (session-scoped login)
  useEffect(() => {
    const u = sessionStorage.getItem("user");
    const t = sessionStorage.getItem("token");
    if (u) setUser(JSON.parse(u));
    if (t) setToken(t);
  }, []);

  // Always yield a valid bearer
  const ensureToken = async () => {
    const cached = sessionStorage.getItem("token");
    if (cached) {
      setToken(cached);
      return cached;
    }
    const raw = await generateTokenRaw();
    const tk = extractTokenFromGenerateToken(raw);

    // Helpful logs while wiring up
    console.log("[GenerateToken] json:", raw.json);
    console.log("[GenerateToken] headers:", raw.headers);
    console.log("[GenerateToken] parsed token length:", tk?.length || 0);

    if (!tk) {
      throw new Error("Could not obtain auth token from GenerateToken response.");
    }
    setToken(tk);
    sessionStorage.setItem("token", tk);
    return tk;
  };

  // Send OTP (must include bearer)
  const requestOtp = async (mobile = "", email = "") => {
    const authToken = await ensureToken();
    const r = await getOtp(authToken, { MobileNo: mobile, EmailId: email });
    console.log("[GetOtp] response:", r);
    if (r?.success === true && Number(r?.errorCode) === 0) {
      return { ok: true, message: String(r?.result || "OTP sent.") };
    }
    return { ok: false, message: r?.result || r?.error || "Failed to send OTP" };
  };

  // Verify OTP (bearer required). 0=existing, 1=new. Retry once on 1008.
  const loginWithOtp = async (mobile = "", otp, email = "", mobilePrefix = "+91") => {
    let authToken = await ensureToken();

    if (!isValidOtp(otp)) throw new Error("OTP must be 6 digits.");

    // first attempt
    let v = await verifyOtp(authToken, { MobileNo: mobile, EmailId: email, Otp: otp });

    // auth expired → refresh once and retry
    if (Number(v?.errorCode) === 1008) {
      const fresh = await generateTokenRaw();
      const tk = extractTokenFromGenerateToken(fresh);
      if (!tk) throw new Error("Could not refresh token for VerifyOtp.");
      setToken(tk);
      sessionStorage.setItem("token", tk);
      authToken = tk;
      v = await verifyOtp(authToken, { MobileNo: mobile, EmailId: email, Otp: otp });
    }

    if (v?.success !== true) {
      console.warn("[VerifyOtp] unexpected:", v);
      throw new Error(v?.error || "OTP verification failed");
    }

   const code = Number(v?.errorCode);
const row  = Array.isArray(v?.result) && v.result.length ? v.result[0] : null;

let resolved;

if (code === 0) {
  // existing user
  const minimal = normalizeUser(row || {});
  if (minimal.MemberId) {
    try {
      const profRes = await profileInfo(authToken, minimal.MemberId);
      const profRaw = Array.isArray(profRes?.result) && profRes.result.length
        ? profRes.result[0]                      // ← ProfileInfo array
        : (profRes?.Data || profRes || {});
      const prof = normalizeUser(profRaw);
      resolved = {
        ...minimal,
        ...prof,
        MemberId: prof.MemberId || minimal.MemberId,
      };
    } catch {
      resolved = minimal;
    }
  } else {
    resolved = minimal;
  }
} else if (code === 1) {
  // new user
  resolved = normalizeUser({
    MobilePrifix: mobile ? mobilePrefix : undefined,
    MobileNo: mobile || undefined,
    EmailId: email || undefined,
  });
} else {
  console.warn("[VerifyOtp] unknown errorCode:", v);
  throw new Error(v?.error || "OTP verification failed");
}

setUser(resolved);
sessionStorage.setItem("user", JSON.stringify(resolved));
sessionStorage.setItem("pendingIdentity", JSON.stringify({ mobile, email, mobilePrefix }));

// Force existing for code===0; otherwise use completeness
const isNewUser = code === 0 ? false : (code === 1 || !isProfileComplete(resolved));
return { user: resolved, isNewUser };
  };

  // Create or update profile on the API, then cache
const saveProfileAndRefresh = async (form) => {
  const authToken = await ensureToken();
  let raw;

  if (!truthy(user?.MemberId)) {
  const payload = {
    FirstName: form.FirstName,
    LastName: form.LastName,
    MobilePrifix: form.MobilePrifix || "+91", // we’ll also try MobilePrefix in auth.js
    MobileNo: form.MobileNo,
    EmailId: form.EmailId,
    City: form.City,
    StateCode: form.StateCode,
    Country: form.Country,
    PrivacyPolicyAcceptance: "Y",
  };

  const raw = await signup(authToken, payload);

  if (!(raw?.success === true && Number(raw?.errorCode) === 0)) {
    // Show exactly what the server reported:
    const msg = raw?.result || raw?.error || "Sign up failed";
    throw new Error(msg);
  }
  }

  const server = normalizeUser(raw?.Data || raw || {});
  const merged = {
    ...server,
    FirstName: form.FirstName ?? server.FirstName,
    LastName: form.LastName ?? server.LastName,
    EmailId: form.EmailId ?? server.EmailId,
    MobilePrifix: form.MobilePrifix ?? server.MobilePrifix,
    MobileNo: form.MobileNo ?? server.MobileNo,
    City: form.City ?? server.City,
    StateCode: form.StateCode ?? server.StateCode,
    Country: form.Country ?? server.Country,
    PrivacyPolicyAcceptance: "Y",
  };

  setUser(merged);
  sessionStorage.setItem("user", JSON.stringify(merged));
  return merged;
};


  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...updates };
      sessionStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("pendingIdentity");
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      requestOtp,
      loginWithOtp,
      saveProfileAndRefresh,
      updateUser,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
