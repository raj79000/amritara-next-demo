"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const SignInComponent = () => {
  const [activeTab, setActiveTab] = useState("mobile");
  const [inputValue, setInputValue] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const { requestOtp, loginWithOtp } = useAuth();

  const handleSendOtp = async () => {
    try {
      if (!inputValue) {
        alert("Please enter your " + (activeTab === "mobile" ? "mobile number" : "email"));
        return;
      }

      if (activeTab === "mobile") {
        await requestOtp(inputValue);
      } else {
        await requestOtp("", inputValue);
      }

      setOtpSent(true);
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "mobile") {
        await loginWithOtp(inputValue, otp);
      } else {
        await loginWithOtp("", otp, inputValue);
      }
      alert("Login successful!");
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg border-0 rounded-4" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body p-4">
          <h3 className="text-center mb-4 fw-bold text-primary">Welcome Back</h3>

          {/* Tabs */}
          <ul className="nav nav-pills mb-3 justify-content-center" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "mobile" ? "active" : ""}`}
                type="button"
                onClick={() => {
                  setActiveTab("mobile");
                  setInputValue("");
                  setOtpSent(false);
                }}
              >
                📱 Mobile
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "email" ? "active" : ""}`}
                type="button"
                onClick={() => {
                  setActiveTab("email");
                  setInputValue("");
                  setOtpSent(false);
                }}
              >
                📧 Email
              </button>
            </li>
          </ul>

          {/* Form */}
          {!otpSent ? (
            <>
              <div className="mb-3">
                <input
                  type={activeTab === "mobile" ? "tel" : "email"}
                  className="form-control form-control-lg"
                  placeholder={`Enter your ${activeTab}`}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                className="btn btn-primary w-100 btn-lg"
              >
                Send OTP
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
                />
              </div>
              <button
                type="submit"
                className="btn btn-success w-100 btn-lg"
              >
                Verify OTP & Login
              </button>
            </form>
          )}

          {/* Footer */}
          <p className="text-center mt-4 small text-muted">
            By continuing, you agree to our{" "}
            <a href="/privacy" className="text-decoration-none text-primary fw-semibold">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInComponent;
