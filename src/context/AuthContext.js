"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  generateToken, getOtp, verifyOtp, signIn,
  signup, profileInfo, updateProfile,
} from "@/lib/api/auth";

/* ---------- Utils ---------- */
const truthy = (v) => v !== undefined && v !== null && String(v).trim() !== "";

const normalizeUser = (raw = {}) => {
  const u = raw || {};
  const PPA = (u.PrivacyPolicyAcceptance ?? u.PPAcceptance ?? u.IsTermsAccepted ?? "")
    .toString()
    .toUpperCase();
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

const isTestMode = () =>
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_AUTH_TEST_MODE === "true";
const isValidOtp = (otp) => /^[0-9]{6}$/.test(String(otp || "").trim());

/* ---------- Context ---------- */
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // normalized user
  const [token, setToken] = useState(null); // session-scoped bearer

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
   * OTP login flow:
   *  - verify (or allow 123456 in test mode)
   *  - signIn
   *  - if MembershipId present → fetch ProfileInfo for full picture
   *  - decide new/existing via isProfileComplete
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

    const signRes = await signIn({ MobileNo: mobile, EmailId: email, Otp: otp });
    const signed = normalizeUser(signRes?.Data || signRes || {});

    let resolved = signed;

    if (truthy(signed.MemberId)) {
      const profRes = await profileInfo(authToken, signed.MemberId);
      const prof = normalizeUser(profRes?.Data || profRes || {});
      resolved = {
        ...signed,
        ...prof,
        MemberId: prof.MemberId || signed.MemberId,
        MobilePrifix: prof.MobilePrifix || signed.MobilePrifix || mobilePrefix,
      };
    } else {
      resolved = {
        ...resolved,
        MobilePrifix: mobile ? mobilePrefix : resolved.MobilePrifix,
        MobileNo: mobile || resolved.MobileNo,
        EmailId: email || resolved.EmailId,
      };
    }

    setUser(resolved);
    sessionStorage.setItem("user", JSON.stringify(resolved));
    sessionStorage.setItem("pendingIdentity", JSON.stringify({ mobile, email, mobilePrefix }));

    const isNewUser = !isProfileComplete(resolved);
    return { user: resolved, isNewUser };
  };

  /**
   * Save profile:
   *  - If MemberId exists → UpdateProfile (requires MembershipId)
   *  - Else → signup (create)
   * Always normalize + mark acceptance “Y” locally so routing is correct next time.
   */
  const saveProfileAndRefresh = async (form) => {
    const authToken = await ensureToken();
    let raw;

    if (truthy(user?.MemberId)) {
      raw = await updateProfile(authToken, {
        MembershipId: user.MemberId,
        FirstName: form.FirstName,
        LastName: form.LastName,
        MobileNo: form.MobileNo,
        EmailId: form.EmailId,
        Country: form.Country,
        City: form.City,
        // Optionals supported by API can be added here (Gender, DateofBirth, etc.)
      });
    } else {
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
    () => ({ user, token, requestOtp, loginWithOtp, saveProfileAndRefresh, updateUser, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
