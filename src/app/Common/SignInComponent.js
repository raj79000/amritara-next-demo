"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const SignInComponent = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("mobile");
  const [inputValue, setInputValue] = useState("");
  const [mobilePrefix, setMobilePrefix] = useState("+91");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { requestOtp, loginWithOtp } = useAuth();

  const handleSendOtp = async () => {
    try {
      if (!inputValue) {
        alert(`Please enter your ${activeTab === "mobile" ? "mobile number" : "email"}`);
        return;
      }
      setLoading(true);
      if (activeTab === "mobile") {
        await requestOtp(inputValue, "");
      } else {
        await requestOtp("", inputValue);
      }
      setOtpSent(true);
      alert("OTP sent. Please check your phone/email.");
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { isNewUser } =
        activeTab === "mobile"
          ? await loginWithOtp(inputValue, otp, "", mobilePrefix)
          : await loginWithOtp("", otp, inputValue, mobilePrefix);

      if (isNewUser) {
        // Go to profile completion (prefill will read from sessionStorage.pendingIdentity)
        router.replace("/complete-profile");
      } else {
        router.replace("/dashboard"); // existing user → dashboard
      }
    } catch (err) {
      console.error(err);
      alert(err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg border-0 rounded-4" style={{ width: "100%", maxWidth: 420 }}>
        <div className="card-body p-4">
          <h3 className="text-center mb-4 fw-bold text-primary">Welcome Back</h3>

          <ul className="nav nav-pills mb-3 justify-content-center">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "mobile" ? "active" : ""}`}
                type="button"
                onClick={() => { setActiveTab("mobile"); setInputValue(""); setOtpSent(false); }}
              >
                📱 Mobile
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "email" ? "active" : ""}`}
                type="button"
                onClick={() => { setActiveTab("email"); setInputValue(""); setOtpSent(false); }}
              >
                📧 Email
              </button>
            </li>
          </ul>

          {!otpSent ? (
            <>
              {activeTab === "mobile" && (
                <div className="mb-2 d-flex gap-2">
                  <select
                    className="form-select"
                    style={{ maxWidth: 110 }}
                    value={mobilePrefix}
                    onChange={(e) => setMobilePrefix(e.target.value)}
                  >
                    <option value="+91">+91</option>
                    {/* add more if needed */}
                  </select>
                  <input
                    type="tel"
                    className="form-control form-control-lg"
                    placeholder="Phone No"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}
              {activeTab === "email" && (
                <div className="mb-2">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Email"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}
              <button type="button" onClick={handleSendOtp} className="btn btn-primary w-100 btn-lg" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn btn-success w-100 btn-lg" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP & Continue"}
              </button>
            </form>
          )}

          <p className="text-center mt-4 small text-muted">
            By continuing, you agree to our{" "}
            <a href="/privacy" className="text-decoration-none text-primary fw-semibold">Privacy Policy</a> &amp;{" "}
            <a href="/terms" className="text-decoration-none text-primary fw-semibold">Terms</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInComponent;
