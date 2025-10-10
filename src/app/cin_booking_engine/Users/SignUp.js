"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";
import "./user.css";
import { createSignature } from "../../../utilities/signature";
import { useBookingEngineContext } from "../../cin_context/BookingEngineContext";
import { countryList } from "../../../utilities/countryList";
const SignUp = ({ onSubmit }) => {
  
  const {
      selectedPropertyId,
      selectedRoom,
    } = useBookingEngineContext();
  const [guestDtails, setGuestDetails] = useState();
  const sessionId = sessionStorage?.getItem("sessionId");
  useEffect(async()=>{
      const resp = await getUserInfo();
      setGuestDetails(resp);
  },[])
  const [userDetails, setUserDetails] = useState({
    FirstName: "",
    LastName: "",
    MobilePrifix: "+91",
    MobileNo: "",
    EmailId: "",
    City: "",
    StateCode: "",
    Country: "",
    PrivacyPolicyAcceptance: "",
    Password: "",
    ConfirmPassword: "",
    PropertyId: selectedPropertyId.toString(),
    SessionId: sessionId,
    Ip: guestDtails?.ip,
    Room: selectedRoom.map(room => room.roomName).join(", "),
    Package: selectedRoom.map(room => room?.roomPackage).join(", ")
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const matched = countryList.find((item) => item.name === selectedCountry);

    setUserDetails((prevDetails) => ({
      ...prevDetails,
      Country: selectedCountry,
      CountryCode: matched?.code || "",
    }));
  };

  const handleDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;

    setUserDetails({
      ...userDetails,
      [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validateDetailsForm();
    if (valid) {
      // onSubmit(userDetails);
      try {
       // const keyData = "dbKey=Dbconn";
        const keyData = `dbKey=${process.env.NEXT_PUBLIC_TOKEN_DB_KEY}`;
        const timestamp = Date.now().toString();
        const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
        const signature = await createSignature(userDetails, timestamp, secret);

        const resp = await fetch(`${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-timestamp": timestamp,
            "x-signature": signature,
          },
          body: JSON.stringify({ userDetails, keyData }),
        });
        const data = await resp.json();

        if (!resp.ok) {
          throw new Error(
            data?.errorMessage || "Something went wrong try again"
          );
        }

        if (data.errorCode == "0") {
          // alert("Registered Successfully");
          onSubmit(data);
          //setError("Login Successfully");
        } else {
          setError(data.errorMessage);
        }
        return data;
      } catch (err) {
        setError(err.message);
      }
    }
  };
  const validateDetailsForm = () => {
    const {
      FirstName,
      LastName,
      MobilePrifix,
      MobileNo,
      EmailId,
      // City, StateCode,

      Country,
      PrivacyPolicyAcceptance,
      Password,
      ConfirmPassword,
    } = userDetails;
    const newErrors = {};

    if (!FirstName) {
      newErrors.FirstName = "Please enter your first name.";
    } else if (!/^[a-zA-Z\s]+$/.test(FirstName)) {
      newErrors.FirstName = "First name can only contain letters and spaces.";
    }

    if (!LastName) {
      newErrors.LastName = "Please enter your last name.";
    } else if (!/^[a-zA-Z\s]+$/.test(LastName)) {
      newErrors.LastName = "Last name can only contain letters and spaces.";
    }

    if (!MobilePrifix) {
      newErrors.MobilePrifix = "Please enter your country code.";
    } else if (!/^\+\d{2,4}$/.test(MobilePrifix)) {
      newErrors.MobilePrifix = "Please enter a valid country code.";
    }
    if (!MobileNo) {
      newErrors.MobileNo = "Please enter your MobileNo.";
    } else if (!/^\d{7,15}$/.test(MobileNo)) {
      newErrors.MobileNo = "MobileNo must be between 7 to 15.";
    }

    if (!EmailId) {
      newErrors.EmailId = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EmailId)) {
      newErrors.EmailId = "Please enter a valid email address.";
    }

    // if (!City) {
    //     newErrors.City = "Please enter city.";
    // }
    // else if (!/^[a-zA-Z\s]+$/.test(City)) {
    //     newErrors.City = "City can only contain letters and spaces.";
    // }

    // if (!StateCode) {
    //     newErrors.StateCode = "Please enter state.";
    // }
    // else if (!/^[a-zA-Z\s]+$/.test(StateCode)) {
    //     newErrors.StateCode = "State can only contain letters and spaces.";
    // }

    if (!Country) {
      newErrors.Country = "You must agree to the terms & conditions.";
    }

    if (!Password) {
      newErrors.Password = "Please enter your password.";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&*!])[A-Za-z\d@#&*!]{6,50}$/.test(
        Password
      )
    ) {
      newErrors.Password =
        "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, #, &, *, !).";
    }

    if (!ConfirmPassword) {
      newErrors.Password = "Please enter confirm password.";
    } else if (Password != ConfirmPassword) {
      newErrors.ConfirmPassword = "Password and Confirm Password must be same.";
    }

    if (!PrivacyPolicyAcceptance) {
      newErrors.PrivacyPolicyAcceptance =
        "You must agree to the terms & conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      <div className="signup-scrollable">
        <div className="wizard-step-global-padding">
          <h4 className="mb-3">User Signup</h4>
          {error && (
            <div className="alert alert-danger mt-3">Error: {error}</div>
          )}

          <form id="signupForm" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="FirstName"
                  value={userDetails.FirstName}
                  onChange={handleDetailsChange}
                  className={`form-control ${
                    errors.FirstName ? "is-invalid" : ""
                  }`}
                  placeholder="First Name"
                  maxLength={30}
                />
                {errors.FirstName && (
                  <div className="invalid-feedback">{errors.FirstName}</div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="LastName"
                  maxLength={30}
                  value={userDetails.LastName}
                  onChange={handleDetailsChange}
                  className={`form-control ${
                    errors.LastName ? "is-invalid" : ""
                  }`}
                  placeholder="Last Name"
                />
                {errors.LastName && (
                  <div className="invalid-feedback">{errors.LastName}</div>
                )}
              </div>
              {/* Country Dropdown */}
              <div className="col-md-6 mb-3">
                <select
                  name="Country"
                  value={userDetails.Country}
                  onChange={handleCountryChange}
                  className={`form-control ${
                    errors.Country ? "is-invalid" : ""
                  }`}
                >
                  <option value="">Select Country</option>
                  {countryList.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.Country && (
                  <div className="invalid-feedback">{errors.Country}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <input
                  name="MobileNo"
                  type="text"
                  placeholder="Mobile Number"
                  minLength={7}
                  maxLength={15}
                  value={userDetails.MobileNo}
                  onChange={handleDetailsChange}
                  className={`form-control ${
                    errors.MobileNo ? "is-invalid" : ""
                  }`}
                />
                {errors.MobileNo && (
                  <div className="invalid-feedback">{errors.MobileNo}</div>
                )}
              </div>
              <div className="col-md-12 mb-3">
                <input
                  name="EmailId"
                  type="text"
                  placeholder="Email Id"
                  maxLength={100}
                  value={userDetails.EmailId}
                  onChange={handleDetailsChange}
                  className={`form-control ${
                    errors.EmailId ? "is-invalid" : ""
                  }`}
                />
                {errors.EmailId && (
                  <div className="invalid-feedback">{errors.EmailId}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <input
                  name="Password"
                  type="password"
                  placeholder="Password"
                  minLength={6}
                  maxLength={50}
                  value={userDetails.Password}
                  onChange={handleDetailsChange}
                  className={`form-control ${
                    errors.Password ? "is-invalid" : ""
                  }`}
                />
                {errors.Password && (
                  <div className="invalid-feedback">{errors.Password}</div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <input
                  name="ConfirmPassword"
                  type="password"
                  placeholder="ConfirmPassword"
                  minLength={6}
                  maxLength={50}
                  value={userDetails.ConfirmPassword}
                  onChange={handleDetailsChange}
                  className={`form-control ${
                    errors.ConfirmPassword ? "is-invalid" : ""
                  }`}
                />
                {errors.ConfirmPassword && (
                  <div className="invalid-feedback">
                    {errors.ConfirmPassword}
                  </div>
                )}
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  name="PrivacyPolicyAcceptance"
                  checked={userDetails.PrivacyPolicyAcceptance === "Y"}
                  onChange={handleDetailsChange}
                  className={`form-check-input ${
                    errors.PrivacyPolicyAcceptance ? "is-invalid" : ""
                  }`}
                />

                <label className="form-check-label f-12-new">
                  I agree to the terms & conditions
                </label>
                {errors.PrivacyPolicyAcceptance && (
                  <div className="invalid-feedback">
                    {errors.PrivacyPolicyAcceptance}
                  </div>
                )}
              </div>
            </div>
            <div className="signup-footerr text-center">
              <button
                type="submit"
                form="signupForm"
                className="btn btn-primary w-100"
              >
                SignUp
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
