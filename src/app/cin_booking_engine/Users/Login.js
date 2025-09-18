"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";
import md5 from "md5";
import { useBookingEngineContext } from "../../cin_context/BookingEngineContext";
import { createSignature } from "../../utilities/signature";
import crypto from "crypto";
import ForgotPassword from "./ForgotPassword";

const Login = ({ onSubmit }) => {
  const [loginDetails, setLoginDetails] = useState({
    MobileNo: "",
    Password: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [forgotMessage, setForgotMessage] = useState(null);
  const [isForgotPassword, setForgotPassword] = useState(null);

  const keyData = "dbKey=Dbconn";
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validateDetailsForm();
    if (valid) {
      //  onSubmit(loginDetails);

      try {
        const timestamp = Date.now().toString();
        const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
        const signature = await createSignature(
          loginDetails,
          timestamp,
          secret
        );

        const resp = await fetch("https://cinbe.cinuniverse.com/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-timestamp": timestamp,
            "x-signature": signature,
          },
          body: JSON.stringify({ loginDetails, keyData }),
        });
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data?.error || "Login failed");
        }

        onSubmit(data);
        // if (data.errorCode == "0") {
        //     onSubmit(data);
        //     //setError("Login Successfully");
        // }
        // return data;
      } catch (err) {
        console.log("Login Error:", err);
        setError(err.message);
      }
    }
  };

  const openForgotPassword = async (e) => {
    e.preventDefault();

    if (!loginDetails.MobileNo) {
      setError(
        "Please enter your mobile number before requesting password reset."
      );
      return;
    }
    try {
      // Generate Token
      const tokenResponse = await fetch(
        `https://staahbe.cinuniverse.com/GenerateJwtToken?${keyData
          ?.replace(/^"(.*)"$/, "$1")
          .trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Username: "BEUser",
            Password: "password",
          }),
        }
      );

      const tokenData = await tokenResponse.json();
      //const tokenData = JSON.parse(tokenText);
      const token = tokenData.data?.token;
      if (!token) {
        setError("Invalid token received.");
        return;
      }
      // const response = await fetch(
      //   `https://staahbe.cinuniverse.com/ForgotPassword?dbKey=Dbconn`,
      //   {
      const response = await fetch(
        `https://staahbe.cinuniverse.com/ForgotPassword/${
          loginDetails.MobileNo
        }?${keyData?.replace(/^"(.*)"$/, "$1").trim()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("failed - Mobile number not found.");
      }

      const data = await response.json();
      console.log("Forgot Password Response:", data);

      console.log(data);
      if (data.errorMessage == "success") {
        setForgotMessage("Password reset link sent to your mobile/email.");
        setForgotPassword(true);
      } else {
        setError(data.errorMessage || "Something went wrong.");
      }
    } catch (err) {
      setError(err.message);
    }
  };
  const openSignUpPage = () => {
    let data = {
      errorCode: "SignUp",
    };
    onSubmit(data);
  };
  const validateDetailsForm = () => {
    const { MobileNo, Password } = loginDetails;
    const newErrors = {};

    if (!MobileNo) newErrors.MobileNo = "Please enter mobile Number.";
    else if (!/^\d{7,15}$/.test(MobileNo))
      newErrors.MobileNo = "Mobile Number can only contain numbers.";

    if (!Password) {
      newErrors.Password = "Please enter your password.";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&*!])[A-Za-z\d@#&*!]{6,50}$/.test(
        Password
      )
    ) {
      newErrors.Password = "Invalid Password.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="booking-payment-form detail-stepp-for-booking">
      <div className="wizard-step-global-padding">
        <h4 className="mb-3">User Login</h4>
        {error && <div className="alert alert-danger mt-3">Error: {error}</div>}
        {isForgotPassword && (
          <div className="alert alert-success mt-3">Error: {forgotMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12 mb-3">
              {" "}
              Mobile Number
              <input
                type="text"
                name="MobileNo"
                value={loginDetails.MobileNo}
                onChange={handleDetailsChange}
                className={`form-control ${
                  errors.MobileNo ? "is-invalid" : ""
                }`}
                placeholder="Mobile Number"
              />
              {errors.MobileNo && (
                <div className="invalid-feedback">{errors.MobileNo}</div>
              )}
            </div>
            <div className="col-md-12 mb-3">
              Password
              <input
                type="Password"
                name="Password"
                maxLength={19}
                value={loginDetails.Password}
                onChange={handleDetailsChange}
                className={`form-control ${
                  errors.Password ? "is-invalid" : ""
                }`}
                placeholder="Password"
              />
              {errors.Password && (
                <div className="invalid-feedback">{errors.Password}</div>
              )}
            </div>
            <div className="col-md-12 mb-3">
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </div>
          </div>
        </form>

        <div className=" row m-2">
          {/* <div className="wizard-bottom-fixed">
                        <p>Do not have account ?</p>
                        <button type="submit" className="btn btn-primary w-150"
                            onClick={openSignUpPage}>
                            Create Account</button>
                    </div> */}
          <div className="wizard-bottom-fixed">
            <p>
              <a
                href="#"
                onClick={openForgotPassword}
                className="text-primary text-decoration-underline"
              >
                Forgot password
              </a>
            </p>
            <p>
              Do not have an account?{" "}
              <a
                href="#"
                onClick={openSignUpPage}
                className="text-primary text-decoration-underline"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
        {/* {isForgotPassword && <ForgotPassword />} */}
      </div>
    </div>
  );
};

export default Login;
