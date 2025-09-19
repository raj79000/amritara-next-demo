"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  generateToken, getOtp, verifyOtp, signIn,
  signup, profileInfo, updateProfile,
} from "@/lib/api/auth";

/* ---------- utils ---------- */
const truthy = (v) => v !== undefined && v !== null && String(v).trim() !== "";

const normalizeUser = (raw = {}) => {
  const u = raw || {};
  const PPA = (u.PrivacyPolicyAcceptance ?? u.PPAcceptance ?? u.IsTermsAccepted ?? "").toString().toUpperCase();
  return {
    MemberId: u.MembershipId ?? u.MemberId ?? u.Id ?? u.MemberID ?? null,
    FirstName: u.FirstName ?? u.GivenName ?? u.Name?.split?.(" ")?.[0] ?? "",
    LastName:  u.LastName  ?? u.Surname   ?? (u.Name?.split?.(" ")?.slice(1).join(" ") ?? ""),
    EmailId:   u.EmailId   ?? u.Email     ?? u.EmailID ?? "",
    MobilePrifix: u.MobilePrifix ?? u.MobilePrefix ?? u.CountryCode ?? "+91",
    MobileNo:  u.MobileNo  ?? u.Mobile    ?? u.Phone ?? u.PhoneNumber ?? "",
    City:      u.City      ?? "",
    Country:   u.Country   ?? "",
    PrivacyPolicyAcceptance: PPA === "Y" ? "Y" : "N",
    _raw: u,
  };
};

const isProfileComplete = (nu) =>
  truthy(nu.MemberId) &&
  truthy(nu.FirstName) &&
  truthy(nu.LastName) &&
  (truthy(nu.EmailId) || truthy(nu.MobileNo)) &&
  nu.PrivacyPolicyAcceptance === "Y";

const isTestMode = () => typeof window !== "undefined" && process.env.NEXT_PUBLIC_AUTH_TEST_MODE === "true";
const isValidOtp = (otp) => /^[0-9]{6}$/.test(String(otp || "").trim());

/* ---------- context ---------- */
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // normalized
  const [token, setToken] = useState(null); // session-scoped

  useEffect(() => {
    const u = sessionStorage.getItem("user");
    const t = sessionStorage.getItem("token");
    if (u) setUser(JSON.parse(u));
    if (t) setToken(t);
  }, []);

  const ensureToken = async () => {
    if (token) return token;
    const t = await generateToken();
    const tk = t?.Data?.Token || "";
    setToken(tk);
    sessionStorage.setItem("token", tk);
    return tk;
  };

  const requestOtp = async (mobile = "", email = "") => {
    const authToken = await ensureToken();
    return await getOtp(authToken, { MobileNo: mobile, EmailId: email });
  };

  /**
   * OTP login:
   * - Verify (or test mode allow 123456)
   * - SignIn
   * - If MembershipId exists, fetch ProfileInfo to decide completeness
   */
  const loginWithOtp = async (mobile = "", otp, email = "", mobilePrefix = "+91") => {
    const authToken = await ensureToken();

    if (!isValidOtp(otp)) throw new Error("OTP must be 6 digits.");
    if (isTestMode()) {
      if (String(otp).trim() !== "123456") throw new Error("Invalid OTP (test mode)");
    } else {
      const v = await verifyOtp(authToken, { MobileNo: mobile, EmailId: email, Otp: otp });
      if (v?.Success === false) throw new Error(v?.Message || "OTP verification failed.");
    }

    // Sign in (returns something; we’ll normalize)
    const signRes = await signIn({ MobileNo: mobile, EmailId: email, Otp: otp });
    const signed = normalizeUser(signRes?.Data || signRes || {});

    let resolved = signed;

    // If we got a MembershipId, fetch full profile for accurate completeness
    if (truthy(signed.MemberId)) {
      const profRes = await profileInfo(authToken, signed.MemberId);
      const prof = normalizeUser(profRes?.Data || profRes || {});
      // prefer data from ProfileInfo, but keep fallbacks from SignIn
      resolved = {
        ...signed,
        ...prof,
        MemberId: prof.MemberId || signed.MemberId,
        MobilePrifix: prof.MobilePrifix || signed.MobilePrifix || mobilePrefix,
      };
    } else {
      // keep identity used during login in case they’re new
      resolved = {
        ...resolved,
        MobilePrifix: mobile ? mobilePrefix : resolved.MobilePrifix,
        MobileNo: mobile || resolved.MobileNo,
        EmailId: email || resolved.EmailId,
      };
    }

    // persist for this tab
    setUser(resolved);
    sessionStorage.setItem("user", JSON.stringify(resolved));
    sessionStorage.setItem("pendingIdentity", JSON.stringify({ mobile, email, mobilePrefix }));

    const newUser = !isProfileComplete(resolved);
    return { user: resolved, isNewUser: newUser };
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...updates };
      sessionStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  /**
   * Save profile:
   * - If MemberId present → UpdateProfile
   * - Else → signup (create)
   * Always return normalized + accepted (“Y”) locally.
   */
  const saveProfileAndRefresh = async (form) => {
    const authToken = await ensureToken();

    let raw;
    if (truthy(user?.MemberId)) {
      // existing member
      raw = await updateProfile(authToken, {
        MembershipId: user.MemberId,
        FirstName: form.FirstName,
        LastName: form.LastName,
        MobileNo: form.MobileNo,
        EmailId: form.EmailId,
        Country: form.Country,
        City: form.City,
        // optional fields supported by UpdateProfile if you add them:
        // Gender, Address, DateofBirth: "dd-mm-yyyy", WeddingAnniversary: "dd-mm-yyyy"
      });
    } else {
      // brand-new member
      raw = await signup(authToken, {
        FirstName: form.FirstName,
        LastName: form.LastName,
        MobilePrifix: form.MobilePrifix || "+91",
        MobileNo: form.MobileNo,
        EmailId: form.EmailId,
        City: form.City,
        Country: form.Country,
        PrivacyPolicyAcceptance: "Y",
      });
    }

    const server = normalizeUser(raw?.Data || raw || {});
    // Make sure we reflect the latest form + acceptance locally
    const merged = {
      ...server,
      FirstName: form.FirstName ?? server.FirstName,
      LastName: form.LastName ?? server.LastName,
      EmailId: form.EmailId ?? server.EmailId,
      MobilePrifix: form.MobilePrifix ?? server.MobilePrifix,
      MobileNo: form.MobileNo ?? server.MobileNo,
      City: form.City ?? server.City,
      Country: form.Country ?? server.Country,
      PrivacyPolicyAcceptance: "Y",
    };

    updateUser(merged);
    return merged;
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("pendingIdentity");
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, token, requestOtp, loginWithOtp, logout, updateUser, saveProfileAndRefresh }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
