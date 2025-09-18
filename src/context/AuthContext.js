"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { generateToken, getOtp, verifyOtp, signIn } from "@/lib/api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

const requestOtp = async (mobile = "", email = "") => {
  let authToken = token;

  if (!authToken) {
    const t = await generateToken();
    authToken = t?.Data?.Token || "";
    setToken(authToken);
    localStorage.setItem("token", authToken);
  }

  return await getOtp(authToken, { MobileNo: mobile, EmailId: email });
};


const loginWithOtp = async (mobile = "", otp, email = "") => {
  let authToken = token;

  // Generate token if missing
  if (!authToken) {
    const t = await generateToken();
    authToken = t?.Data?.Token || "";
    setToken(authToken);
    localStorage.setItem("token", authToken);
  }

  // ✅ Verify OTP
  await verifyOtp(authToken, { MobileNo: mobile, EmailId: email, Otp: otp });

  // ✅ Sign In
  const userData = await signIn({ MobileNo: mobile, EmailId: email, Otp: otp });

  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
};


  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, requestOtp, loginWithOtp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
