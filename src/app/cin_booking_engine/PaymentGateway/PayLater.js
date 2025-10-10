"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";
import md5 from "md5";
import { useBookingEngineContext } from "../../cin_context/BookingEngineContext";
import { createSignature } from "../../../utilities/signature";
import crypto from "crypto";

const PayLater = ({ onSubmit }) => {
  const [cardDetails, setCardDetails] = useState({
    cardHolderName: "",
    cardType: "Debit/Credit Card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = validateDetailsForm();
    if (valid) {
      onSubmit(cardDetails);
    }
  };
  const validateDetailsForm = () => {
    const { cardHolderName, cardNumber, cvv, expiryDate } = cardDetails;
    const newErrors = {};

    if (!cardHolderName)
      newErrors.cardHolderName = "Please enter your card holder name.";
    else if (!/^[a-zA-Z\s]+$/.test(cardHolderName))
      newErrors.cardHolderName =
        "Card holder name can only contain letters and spaces.";

    if (!expiryDate) newErrors.expiryDate = "Please enter your expiryDate.";
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate))
      newErrors.expiryDate = "Expiry date must be in MM/YY format.";

    if (!cardNumber) newErrors.cardNumber = "Please enter your card number.";
    else if (!/^\d{13,19}$/.test(cardNumber))
      newErrors.cardNumber = "Please enter a valid card number.";

    if (!cvv) newErrors.cvv = "Please enter your card number.";
    else if (!/^\d{3,3}$/.test(cvv))
      newErrors.cvv = "Please enter a valid card number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="booking-payment-form detail-stepp-for-booking">
      <div className="wizard-step-global-padding">
        <h4 className="mb-3">Card Details</h4>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12 mb-3">
              {" "}
              Card Holder
              <input
                type="text"
                name="cardHolderName"
                value={cardDetails.cardHolderName}
                onChange={handleDetailsChange}
                className={`form-control ${
                  errors.cardHolderName ? "is-invalid" : ""
                }`}
                placeholder="Card Holder Name"
              />
              {errors.cardHolderName && (
                <div className="invalid-feedback">{errors.cardHolderName}</div>
              )}
            </div>
            <div className="col-md-12 mb-3">
              Card Number
              <input
                type="text"
                name="cardNumber"
                maxLength={19}
                value={cardDetails.cardNumber}
                onChange={handleDetailsChange}
                className={`form-control ${
                  errors.cardNumber ? "is-invalid" : ""
                }`}
                placeholder="Card Number"
              />
              {errors.cardNumber && (
                <div className="invalid-feedback">{errors.cardNumber}</div>
              )}
            </div>

            {/* <div className="mb-3">
                        <input
                            type="text"
                            name="cardHolderName"
                            value={cardDetails.cardHolderName}
                            onChange={handleDetailsChange}
                        />

                        {errors.expiryDate && (
                            <div className="invalid-feedback">{errors.expiryDate}</div>
                        )}
                    </div> */}
            <div className="col-md-6 mb-3">
              {" "}
              Expiry Date
              <input
                type="text"
                name="expiryDate"
                value={cardDetails.expiryDate}
                maxLength={5}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-digits

                  // Auto-insert slash after 2 digits
                  if (value.length > 2) {
                    value = value.slice(0, 2) + "/" + value.slice(2);
                  }

                  handleDetailsChange({
                    target: {
                      name: "expiryDate",
                      value,
                    },
                  });
                }}
                className={`form-control ${
                  errors.expiryDate ? "is-invalid" : ""
                }`}
                placeholder="MM/YY"
              />
              {errors.expiryDate && (
                <div className="invalid-feedback">{errors.expiryDate}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              {" "}
              CVV
              <input
                name="cvv"
                type="text"
                placeholder="cvv"
                maxLength={3}
                value={cardDetails.cvv}
                onChange={handleDetailsChange}
                className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
              />
              {errors.cvv && (
                <div className="invalid-feedback">{errors.cvv}</div>
              )}
            </div>

            <div className="wizard-bottom-fixed-paylater">
              <button type="submit" className="btn btn-primary w-150">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PayLater;
