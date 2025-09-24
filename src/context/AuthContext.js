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

/* -------------------- helpers -------------------- */
const truthy = (v) => v !== undefined && v !== null && String(v).trim() !== "";

// ---- date helpers ----
const toDMY = (val) => {
  // input[type=date] => "yyyy-mm-dd" -> "dd-mm-yyyy"
  if (!val) return "";
  const [y, m, d] = String(val).split("-");
  if (!y || !m || !d) return "";
  return `${d}-${m}-${y}`;
};

const notInFuture = (val) => {
  if (!val) return true; // no date is fine
  // val is "yyyy-mm-dd" from the form
  const dt = new Date(val);
  if (Number.isNaN(dt.getTime())) return true; // ignore invalids (backend will handle)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dt.setHours(0, 0, 0, 0);
  return dt <= today;
};

// number-safe conversion
const toNum = (v, d = 0) => {
  const n = Number(String(v ?? "").replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : d;
};

const normalizeUser = (raw = {}) => {
  const u = raw || {};
  const PPA = (u.PrivacyPolicyAcceptance ?? u.PPAcceptance ?? u.IsTermsAccepted ?? "")
    .toString()
    .toUpperCase();

  return {
    MemberId:
      u.MembershipId ??
      u.MemberId ??
      u.membershipId ??
      u.cardNo ??
      u.CardNo ??
      u.Id ??
      u.MemberID ??
      null,

    CardNo: u.cardNo ?? u.CardNo ?? null,
    FirstName:
      u.FirstName ??
      u.firstname ??
      u.firstName ??
      u.GivenName ??
      u.Name?.split?.(" ")?.[0] ??
      "",
    LastName:
      u.LastName ??
      u.lastname ??
      u.lastName ??
      u.Surname ??
      (u.Name?.split?.(" ")?.slice(1).join(" ") ?? ""),
    EmailId: u.EmailId ?? u.emailId ?? u.Email ?? u.EmailID ?? "",
    MobilePrifix: u.MobilePrifix ?? u.MobilePrefix ?? u.CountryCode ?? "+91",
    MobileNo:
      u.MobileNo ?? u.mobileNumber ?? u.Mobile ?? u.Phone ?? u.PhoneNumber ?? "",
    // City: u.City ?? u.cityName ?? "",
    City: u.City ?? u.cityName ?? "",
    // State: u.State ?? u.stateName ?? "",
    StateCode: u.StateCode ?? u.stateName ?? "",
    Country: u.Country ?? u.country ?? "",

    TierId: u.tierId ?? "",
    TierName: u.tierName ?? "",
    PointsBalance: toNum(u.pointsBalance, 0),
    PointsToNextTier: toNum(u.pointstoNextTier, 0),
    StaysToNextTier: toNum(u.staystoNextTier, 0),
    TotalStays: toNum(u.totalStays, 0),
    EnrolDate: u.enrolDate ?? "",
    TierEndDate: u.tierEndDate ?? "",
    PointsExpiryDate: u.dateofPontsExpiry ?? "",
    PointsExpiryAmt: toNum(u.amountofPontsExpiry, 0),

    MemberCreateDate: u.memberCreateDate ?? "",
    // DateOfBirth: u.DateofBirth ?? "",
    DateofBirth: u.dateofBirth ?? "",
WeddingAnniversary: u.weddingAnniversary ?? "",
Gender: u.Gender ?? u.gender ?? "",
Address: u.Address ?? u.address ?? "",

    PrivacyPolicyAcceptance:
      PPA === "Y" ? "Y" : u.cardNo || u.CardNo ? "Y" : "N",
    _raw: u,
  };
};

const isProfileComplete = (nu) =>
  (truthy(nu.MemberId) || truthy(nu.CardNo)) &&
  (truthy(nu.FirstName) || truthy(nu.LastName)) &&
  (truthy(nu.EmailId) || truthy(nu.MobileNo));

const isValidOtp = (otp) => /^[0-9]{6}$/.test(String(otp || "").trim());

/* -------------------- token utils -------------------- */
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

  /* ---- hydrate & session timeout ---- */
  useEffect(() => {
    const u = sessionStorage.getItem("user");
    const t = sessionStorage.getItem("token");
    const ts = sessionStorage.getItem("sessionTime");

    if (u && t && ts) {
      const age = Date.now() - Number(ts);
      if (age > 30 * 60 * 1000) {
        // older than 30 min → logout
        logout();
      } else {
        setUser(JSON.parse(u));
        setToken(t);
      }
    }

    // clear session on tab/browser close
    const handleUnload = () => {
      sessionStorage.clear();
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // check expiry while browsing (every 1 min)
  useEffect(() => {
    const interval = setInterval(() => {
      const ts = sessionStorage.getItem("sessionTime");
      if (ts && Date.now() - Number(ts) > 30 * 60 * 1000) {
        logout();
        window.location.href = "/signin"; // force redirect
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  /* ---- helpers ---- */
  const ensureToken = async () => {
    const cached = sessionStorage.getItem("token");
    if (cached) {
      setToken(cached);
      return cached;
    }
    const raw = await generateTokenRaw();
    const tk = extractTokenFromGenerateToken(raw);
    if (!tk) throw new Error("Could not obtain auth token from GenerateToken response.");
    setToken(tk);
    sessionStorage.setItem("token", tk);
    sessionStorage.setItem("sessionTime", Date.now().toString());
    return tk;
  };

  const requestOtp = async (mobile = "", email = "") => {
    const authToken = await ensureToken();
    const r = await getOtp(authToken, { MobileNo: mobile, EmailId: email });
    if (r?.success === true && Number(r?.errorCode) === 0) {
      return { ok: true, message: String(r?.result || "OTP sent.") };
    }
    return { ok: false, message: r?.result || r?.error || "Failed to send OTP" };
  };

  const loginWithOtp = async (mobile = "", otp, email = "", mobilePrefix = "+91") => {
    let authToken = await ensureToken();
    if (!isValidOtp(otp)) throw new Error("OTP must be 6 digits.");

    let v = await verifyOtp(authToken, { MobileNo: mobile, EmailId: email, Otp: otp });
    if (Number(v?.errorCode) === 1008) {
      const fresh = await generateTokenRaw();
      const tk = extractTokenFromGenerateToken(fresh);
      if (!tk) throw new Error("Could not refresh token for VerifyOtp.");
      setToken(tk);
      sessionStorage.setItem("token", tk);
      sessionStorage.setItem("sessionTime", Date.now().toString());
      authToken = tk;
      v = await verifyOtp(authToken, { MobileNo: mobile, EmailId: email, Otp: otp });
    }
    if (v?.success !== true) throw new Error(v?.error || "OTP verification failed");

    const code = Number(v?.errorCode);
    const row = Array.isArray(v?.result) && v.result.length ? v.result[0] : null;

    let resolved;
    if (code === 0) {
      const minimal = normalizeUser(row || {});
      if (minimal.MemberId) {
        try {
          const profRes = await profileInfo(authToken, minimal.MemberId);
          const profRaw = Array.isArray(profRes?.result) && profRes.result.length
            ? profRes.result[0]
            : (profRes?.Data || profRes || {});
          const prof = normalizeUser(profRaw);
          resolved = { ...minimal, ...prof, MemberId: prof.MemberId || minimal.MemberId };
        } catch {
          resolved = minimal;
        }
      } else {
        resolved = minimal;
      }
    } else if (code === 1) {
      resolved = normalizeUser({
        MobilePrifix: mobile ? mobilePrefix : undefined,
        MobileNo: mobile || undefined,
        EmailId: email || undefined,
      });
    } else {
      throw new Error(v?.error || "OTP verification failed");
    }

    setUser(resolved);
    sessionStorage.setItem("user", JSON.stringify(resolved));
    sessionStorage.setItem("pendingIdentity", JSON.stringify({ mobile, email, mobilePrefix }));
    sessionStorage.setItem("sessionTime", Date.now().toString());

    const isNewUser = code === 0 ? false : (code === 1 || !isProfileComplete(resolved));
    return { user: resolved, isNewUser };
  };

const saveProfileAndRefresh = async (form) => {
  const authToken = await ensureToken();
  let raw;

  if (!truthy(user?.MemberId)) {
    // ---- SIGNUP ----
    raw = await signup(authToken, {
      FirstName: form.FirstName,
      LastName: form.LastName,
      MobilePrifix: form.MobilePrifix || "+91",
      MobileNo: form.MobileNo,
      EmailId: form.EmailId,
      City: form.City,
      StateCode: form.StateCode,
      Country: form.Country,
      DateofBirth: form.DateofBirth || "",
      WeddingAnniversary: form.WeddingAnniversary || "",
      Gender: form.Gender || "",
      Address: form.Address || "",
      PrivacyPolicyAcceptance: "Y",
    });

    if (!(raw?.success === true && Number(raw?.errorCode) === 0)) {
      throw new Error(raw?.result || raw?.error || "Sign up failed");
    }
  } else {
    // ---- UPDATE PROFILE ----
    raw = await updateProfile(authToken, {
      MembershipId: user.MemberId,
      FirstName: form.FirstName,
      LastName: form.LastName,
      MobileNo: form.MobileNo,
      EmailId: form.EmailId,
      City: form.City,
      StateCode: form.StateCode,
      Country: form.Country,
      DateofBirth: form.DateofBirth || "",
      WeddingAnniversary: form.WeddingAnniversary || "",
      Gender: form.Gender || "",
      Address: form.Address || "",
    });

    if (!(raw?.success === true && Number(raw?.errorCode) === 0)) {
      throw new Error(raw?.result || raw?.error || "Update failed");
    }

    // fetch fresh profileInfo because updateProfile doesn't return data
    const profRes = await profileInfo(authToken, user.MemberId);
    raw = Array.isArray(profRes?.result) && profRes.result.length
      ? profRes.result[0]
      : profRes?.Data || {};
  }

  const server = normalizeUser(raw);
  const merged = { ...server, PrivacyPolicyAcceptance: "Y" };

  setUser(merged);
  sessionStorage.setItem("user", JSON.stringify(merged));
  sessionStorage.setItem("sessionTime", Date.now().toString());
  return merged;
};



  // const saveProfileAndRefresh = async (form) => {
  //   const authToken = await ensureToken();
  //   let raw;
  //   if (!truthy(user?.MemberId)) {
  //     raw = await signup(authToken, {
  //       FirstName: form.FirstName,
  //       LastName: form.LastName,
  //       MobilePrifix: form.MobilePrifix || "+91",
  //       MobileNo: form.MobileNo,
  //       EmailId: form.EmailId,
  //       City: form.City,
  //       StateCode: form.StateCode,
  //       Country: form.Country,
  //       PrivacyPolicyAcceptance: "Y",
  //     });
  //     if (!(raw?.success === true && Number(raw?.errorCode) === 0)) {
  //       throw new Error(raw?.result || raw?.error || "Sign up failed");
  //     }
  //   }
  //   const server = normalizeUser(raw?.Data || raw || {});
  //   const merged = { ...server, ...form, PrivacyPolicyAcceptance: "Y" };
  //   setUser(merged);
  //   sessionStorage.setItem("user", JSON.stringify(merged));
  //   sessionStorage.setItem("sessionTime", Date.now().toString());
  //   return merged;
  // };

  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...updates };
      sessionStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, token, requestOtp, loginWithOtp, saveProfileAndRefresh, updateUser, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
