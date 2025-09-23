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
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const { requestOtp, loginWithOtp } = useAuth();

  const onlyDigits = (v) => v.replace(/\D/g, "");
  const isSixDigit = (v) => /^[0-9]{6}$/.test(v);
  const isValidMobile = (v) => /^[0-9]{10}$/.test(v);
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const canSend =
    agree &&
    !loading &&
    ((activeTab === "mobile" && isValidMobile(inputValue)) ||
      (activeTab === "email" && isValidEmail(inputValue)));

 const handleSendOtp = async () => {
  try {
    setError("");

    if (!inputValue) {
      setError(`Please enter your ${activeTab === "mobile" ? "mobile number" : "email"}.`);
      return;
    }
    if (activeTab === "mobile" && !isValidMobile(inputValue)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (activeTab === "email" && !isValidEmail(inputValue)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!agree) {
      setError("Please check T&C and Privacy Policy before requesting an OTP.");
      return;
    }

    setLoading(true);
    const res =
      activeTab === "mobile"
        ? await requestOtp(inputValue, "")
        : await requestOtp("", inputValue);

    if (!res.ok) {
      setError(res.message || "Failed to send OTP");
      setLoading(false);
      return;
    }

    setOtpSent(true);
    alert(res.message || "OTP sent.");
  } catch (err) {
    console.error(err);
    setError("Failed to send OTP");
  } finally {
    setLoading(false);
  }
};


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!isSixDigit(otp)) {
      alert("OTP must be 6 digits.");
      return;
    }
    try {
      setLoading(true);
      const { isNewUser } =
        activeTab === "mobile"
          ? await loginWithOtp(inputValue, otp, "", mobilePrefix)
          : await loginWithOtp("", otp, inputValue, mobilePrefix);

      if (isNewUser) router.replace("/complete-profile");
      else router.replace("/members/dashboard");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="signin-section">
      <div className="signin-container">
        <div className="signin-card">
          <h3 className="signin-title">Welcome</h3>

          {/* Tabs */}
          <div className="signin-tabs">
            <button
              className={`signin-tab ${activeTab === "mobile" ? "active" : ""}`}
              type="button"
              onClick={() => { setActiveTab("mobile"); setInputValue(""); setOtpSent(false); setError(""); }}
            >
              Mobile Number
            </button>
            <button
              className={`signin-tab ${activeTab === "email" ? "active" : ""}`}
              type="button"
              onClick={() => { setActiveTab("email"); setInputValue(""); setOtpSent(false); setError(""); }}
            >
              Email Address
            </button>
          </div>

          {/* Step 1: Send OTP */}
          {!otpSent ? (
            <div className="signin-form">
              {activeTab === "mobile" && (
                <div className="signin-input-group">
                  <select className="signin-select" value={mobilePrefix} onChange={(e) => setMobilePrefix(e.target.value)}>
                    <option value="+91">+91</option>
                  </select>
                  <input
                    type="tel"
                    className="signin-input"
                    placeholder="Phone No"
                    value={inputValue}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    onChange={(e) => setInputValue(onlyDigits(e.target.value))}
                    disabled={loading}
                  />
                </div>
              )}
              {activeTab === "email" && (
                <div className="signin-input-group">
                  <input
                    type="email"
                    className="signin-input"
                    placeholder="Email"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}

              {/* Mandatory T&C / Privacy */}
              <div className="signin-checkbox">
                <input id="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} disabled={loading} />
                <label htmlFor="agree">
                  I agree to the{" "}
                  <a href="/term-and-condition" className="signin-link">Terms &amp; Conditions</a> and{" "}
                  <a href="/privacy-policy" className="signin-link">Privacy Policy</a>.
                </label>
              </div>

              {error && <div className="signin-error">{error}</div>}

              <button
                type="button"
                onClick={handleSendOtp}
                className="signin-button primary"
                disabled={!canSend}
                title={agree ? undefined : "Please accept Terms & Privacy to continue"}
              >
                {loading ? "Processing..." : "Continue"}
              </button>
            </div>
          ) : (
            /* Step 2: Verify OTP */
            <form className="signin-form" onSubmit={handleVerifyOtp}>
              <div className="signin-input-group">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  className="signin-input"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(onlyDigits(e.target.value))}
                  disabled={loading}
                />
              </div>
              <button type="submit" className="signin-button success" disabled={loading || !isSixDigit(otp)}>
                {loading ? "Verifying..." : "Verify OTP & Continue"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SignInComponent;
