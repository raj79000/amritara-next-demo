"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";
import "./user.css";
import { createSignature } from "../../utilities/signature";

const SignUp = ({ onSubmit }) => {
  const countryList = [
    { name: "Afghanistan", code: "+93" },
    { name: "Albania", code: "+355" },
    { name: "Algeria", code: "+213" },
    { name: "Andorra", code: "+376" },
    { name: "Angola", code: "+244" },
    { name: "Argentina", code: "+54" },
    { name: "Armenia", code: "+374" },
    { name: "Australia", code: "+61" },
    { name: "Austria", code: "+43" },
    { name: "Azerbaijan", code: "+994" },
    { name: "Bahamas", code: "+1-242" },
    { name: "Bahrain", code: "+973" },
    { name: "Bangladesh", code: "+880" },
    { name: "Barbados", code: "+1-246" },
    { name: "Belarus", code: "+375" },
    { name: "Belgium", code: "+32" },
    { name: "Belize", code: "+501" },
    { name: "Benin", code: "+229" },
    { name: "Bhutan", code: "+975" },
    { name: "Bolivia", code: "+591" },
    { name: "Bosnia and Herzegovina", code: "+387" },
    { name: "Botswana", code: "+267" },
    { name: "Brazil", code: "+55" },
    { name: "Brunei", code: "+673" },
    { name: "Bulgaria", code: "+359" },
    { name: "Burkina Faso", code: "+226" },
    { name: "Burundi", code: "+257" },
    { name: "Cambodia", code: "+855" },
    { name: "Cameroon", code: "+237" },
    { name: "Canada", code: "+1" },
    { name: "Central African Republic", code: "+236" },
    { name: "Chad", code: "+235" },
    { name: "Chile", code: "+56" },
    { name: "China", code: "+86" },
    { name: "Colombia", code: "+57" },
    { name: "Comoros", code: "+269" },
    { name: "Congo (Brazzaville)", code: "+242" },
    { name: "Congo (Kinshasa)", code: "+243" },
    { name: "Costa Rica", code: "+506" },
    { name: "Croatia", code: "+385" },
    { name: "Cuba", code: "+53" },
    { name: "Cyprus", code: "+357" },
    { name: "Czech Republic", code: "+420" },
    { name: "Denmark", code: "+45" },
    { name: "Djibouti", code: "+253" },
    { name: "Dominica", code: "+1-767" },
    { name: "Dominican Republic", code: "+1-809" },
    { name: "Ecuador", code: "+593" },
    { name: "Egypt", code: "+20" },
    { name: "El Salvador", code: "+503" },
    { name: "Equatorial Guinea", code: "+240" },
    { name: "Eritrea", code: "+291" },
    { name: "Estonia", code: "+372" },
    { name: "Eswatini", code: "+268" },
    { name: "Ethiopia", code: "+251" },
    { name: "Fiji", code: "+679" },
    { name: "Finland", code: "+358" },
    { name: "France", code: "+33" },
    { name: "Gabon", code: "+241" },
    { name: "Gambia", code: "+220" },
    { name: "Georgia", code: "+995" },
    { name: "Germany", code: "+49" },
    { name: "Ghana", code: "+233" },
    { name: "Greece", code: "+30" },
    { name: "Grenada", code: "+1-473" },
    { name: "Guatemala", code: "+502" },
    { name: "Guinea", code: "+224" },
    { name: "Guinea-Bissau", code: "+245" },
    { name: "Guyana", code: "+592" },
    { name: "Haiti", code: "+509" },
    { name: "Honduras", code: "+504" },
    { name: "Hungary", code: "+36" },
    { name: "Iceland", code: "+354" },
    { name: "India", code: "+91" },
    { name: "Indonesia", code: "+62" },
    { name: "Iran", code: "+98" },
    { name: "Iraq", code: "+964" },
    { name: "Ireland", code: "+353" },
    { name: "Israel", code: "+972" },
    { name: "Italy", code: "+39" },
    { name: "Ivory Coast", code: "+225" },
    { name: "Jamaica", code: "+1-876" },
    { name: "Japan", code: "+81" },
    { name: "Jordan", code: "+962" },
    { name: "Kazakhstan", code: "+7" },
    { name: "Kenya", code: "+254" },
    { name: "Kiribati", code: "+686" },
    { name: "Kuwait", code: "+965" },
    { name: "Kyrgyzstan", code: "+996" },
    { name: "Laos", code: "+856" },
    { name: "Latvia", code: "+371" },
    { name: "Lebanon", code: "+961" },
    { name: "Lesotho", code: "+266" },
    { name: "Liberia", code: "+231" },
    { name: "Libya", code: "+218" },
    { name: "Liechtenstein", code: "+423" },
    { name: "Lithuania", code: "+370" },
    { name: "Luxembourg", code: "+352" },
    { name: "Madagascar", code: "+261" },
    { name: "Malawi", code: "+265" },
    { name: "Malaysia", code: "+60" },
    { name: "Maldives", code: "+960" },
    { name: "Mali", code: "+223" },
    { name: "Malta", code: "+356" },
    { name: "Marshall Islands", code: "+692" },
    { name: "Mauritania", code: "+222" },
    { name: "Mauritius", code: "+230" },
    { name: "Mexico", code: "+52" },
    { name: "Micronesia", code: "+691" },
    { name: "Moldova", code: "+373" },
    { name: "Monaco", code: "+377" },
    { name: "Mongolia", code: "+976" },
    { name: "Montenegro", code: "+382" },
    { name: "Morocco", code: "+212" },
    { name: "Mozambique", code: "+258" },
    { name: "Myanmar", code: "+95" },
    { name: "Namibia", code: "+264" },
    { name: "Nauru", code: "+674" },
    { name: "Nepal", code: "+977" },
    { name: "Netherlands", code: "+31" },
    { name: "New Zealand", code: "+64" },
    { name: "Nicaragua", code: "+505" },
    { name: "Niger", code: "+227" },
    { name: "Nigeria", code: "+234" },
    { name: "North Korea", code: "+850" },
    { name: "North Macedonia", code: "+389" },
    { name: "Norway", code: "+47" },
    { name: "Oman", code: "+968" },
    { name: "Pakistan", code: "+92" },
    { name: "Palau", code: "+680" },
    { name: "Palestine", code: "+970" },
    { name: "Panama", code: "+507" },
    { name: "Papua New Guinea", code: "+675" },
    { name: "Paraguay", code: "+595" },
    { name: "Peru", code: "+51" },
    { name: "Philippines", code: "+63" },
    { name: "Poland", code: "+48" },
    { name: "Portugal", code: "+351" },
    { name: "Qatar", code: "+974" },
    { name: "Romania", code: "+40" },
    { name: "Russia", code: "+7" },
    { name: "Rwanda", code: "+250" },
    { name: "Saint Kitts and Nevis", code: "+1-869" },
    { name: "Saint Lucia", code: "+1-758" },
    { name: "Saint Vincent and the Grenadines", code: "+1-784" },
    { name: "Samoa", code: "+685" },
    { name: "San Marino", code: "+378" },
    { name: "Saudi Arabia", code: "+966" },
    { name: "Senegal", code: "+221" },
    { name: "Serbia", code: "+381" },
    { name: "Seychelles", code: "+248" },
    { name: "Sierra Leone", code: "+232" },
    { name: "Singapore", code: "+65" },
    { name: "Slovakia", code: "+421" },
    { name: "Slovenia", code: "+386" },
    { name: "Solomon Islands", code: "+677" },
    { name: "Somalia", code: "+252" },
    { name: "South Africa", code: "+27" },
    { name: "South Korea", code: "+82" },
    { name: "South Sudan", code: "+211" },
    { name: "Spain", code: "+34" },
    { name: "Sri Lanka", code: "+94" },
    { name: "Sudan", code: "+249" },
    { name: "Suriname", code: "+597" },
    { name: "Sweden", code: "+46" },
    { name: "Switzerland", code: "+41" },
    { name: "Syria", code: "+963" },
    { name: "Taiwan", code: "+886" },
    { name: "Tajikistan", code: "+992" },
    { name: "Tanzania", code: "+255" },
    { name: "Thailand", code: "+66" },
    { name: "Timor-Leste", code: "+670" },
    { name: "Togo", code: "+228" },
    { name: "Tonga", code: "+676" },
    { name: "Trinidad and Tobago", code: "+1-868" },
    { name: "Tunisia", code: "+216" },
    { name: "Turkey", code: "+90" },
    { name: "Turkmenistan", code: "+993" },
    { name: "Tuvalu", code: "+688" },
    { name: "Uganda", code: "+256" },
    { name: "Ukraine", code: "+380" },
    { name: "United Arab Emirates", code: "+971" },
    { name: "United Kingdom", code: "+44" },
    { name: "United States", code: "+1" },
    { name: "Uruguay", code: "+598" },
    { name: "Uzbekistan", code: "+998" },
    { name: "Vanuatu", code: "+678" },
    { name: "Vatican City", code: "+379" },
    { name: "Venezuela", code: "+58" },
    { name: "Vietnam", code: "+84" },
    { name: "Yemen", code: "+967" },
    { name: "Zambia", code: "+260" },
    { name: "Zimbabwe", code: "+263" },
  ];

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
        const keyData = "dbKey=Dbconn";
        const timestamp = Date.now().toString();
        const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
        const signature = await createSignature(userDetails, timestamp, secret);

        const resp = await fetch("https://cinbe.cinuniverse.com/api/signup", {
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
