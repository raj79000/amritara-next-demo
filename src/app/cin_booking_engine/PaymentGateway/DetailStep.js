"use client";

import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";
//import "../../Booking_engine/booking.css"
import CryptoJS from "crypto-js";
import md5 from "md5";
import { useBookingEngineContext } from "../../cin_context/BookingEngineContext";
import { createSignature } from "../../utilities/signature";
import PayLater from "./PayLater";
//import useBook from "app/booking-engine-widget/useBook";

const encryptHash = (partnerKey, data) => {
  let text = "";
  Object.keys(data).forEach((key) => {
    text += `${key}=${data[key]}||`;
  });
  text = text.slice(0, -2);
  return encrypt(text, partnerKey);
};
const encrypt = (plainText, key) => {
  const keyHex = CryptoJS.enc.Hex.parse(md5(key));
  const iv = CryptoJS.lib.WordArray.create(
    [
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ],
    16
  );
  return CryptoJS.AES.encrypt(plainText, keyHex, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).ciphertext.toString(CryptoJS.enc.Hex);
};

const BookingAndPayment = () => {
  const {
    updateUserDetails,
    totalPrice,
    selectedRooms,
    selectedRoom,
    selectedRoomDetails,
    selectedStartDate,
    selectedEndDate,
    selectedPropertyId,
    setSelectedRoomRate,
    selectedRoomRate,
    selectedRoomOffers,
    selectedPropertyName,
    selectedPropertyPhone,
    selectedAddonList,
    totalRoomPrice,
    baseRoomPrice,
    selectedTaxList,
    roomTaxes,
    setRoomTaxes,
    promoCodeContext,
    setPromoCodeContext,
    setAddonTaxTotal,
    addonTaxTotal,
    setCancellationPolicyState,
    cancellationPolicyState,
    termsAndConditions,
    property,
  } = useBookingEngineContext();

  //const { promoCodeContext, setPromoCodeContext } = useBook();
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
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    country: "",
    phone: "",
    gstNumber: "",
    specialRequests: "",
    agreeToTerms: false,
  });

  const [cardDetails, setCardDetails] = useState({
    cardHolderName: "",
    cardType: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const hiddenFormRef = useRef(null);
  const [hiddenInputValue, setHiddenInputValue] = useState("");
  const [generatedReservationId, setGeneratedReservationId] = useState("");
  const [payLaterData, setPayLaterData] = useState(null);
  const [isOpenPayLater, setOpenPayLater] = useState(false);
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toISOString().split("T")[0];
  };

  const fromDate = formatDate(selectedStartDate);
  const toDate = formatDate(selectedEndDate);
  //const keyData = "dbKey=clarks_pg";
  const keyData = "dbKey=Dbconn";
  // const cleanedKeyData = keyData.replace(/"/g, "");

  const getUserDetails = async (phone) => {
    try {
      const timestamp = Date.now().toString();
      const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
      const signature = await createSignature(
        JSON.stringify(phone),
        timestamp,
        secret
      );
      const res = await fetch(
        "https://cinbe.cinuniverse.com/api/user-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-timestamp": timestamp,
            "x-signature": signature,
          },
          body: JSON.stringify({ phone, keyData }),
        }
      );
      const data = await res?.json();
      return data;
    } catch (error) {
      console.error("API call failed:", error); // Will now show in console
    }
  };
  const handlePhoneBlur = async () => {
    const phone = formData.phone;
    if (phone.length >= 7) {
      try {
        const userData = await getUserDetails(parseInt(phone));
        const result = userData.result[0];

        setFormData((prev) => ({
          ...prev,
          title: result?.memberTitle ?? prev.title,
          firstName: result?.firstName ?? prev.firstName,
          lastName: result?.lastName ?? prev.lastName,
          email: result?.email ?? prev.email,
          phone: result?.mobileNumber ?? prev.phone,
          gstNumber: "",
          specialRequests: "",
          agreeToTerms: prev.agreeToTerms,
        }));
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const { title, firstName, lastName, email, phone, agreeToTerms } = formData;
    const newErrors = {};

    if (!title) newErrors.title = "Please select a title.";

    if (!firstName) newErrors.firstName = "Please enter your first name.";
    else if (!/^[a-zA-Z\s]+$/.test(firstName))
      newErrors.firstName = "First name can only contain letters and spaces.";

    if (!lastName) newErrors.lastName = "Please enter your last name.";
    else if (!/^[a-zA-Z\s]+$/.test(lastName))
      newErrors.lastName = "Last name can only contain letters and spaces.";

    if (!email) newErrors.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email address.";

    if (!phone) newErrors.phone = "Please enter your phone number.";
    else if (!/^\d{7,12}$/.test(phone))
      newErrors.phone = "Please enter a valid 10-digit phone number.";

    if (!agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms & conditions.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const openPayLater = () => {
  //   if (!validateForm()) {
  //     const firstError = Object.values(errors)[0];
  //     toast.error(firstError, { position: "top-right", autoClose: 3000 });
  //     return;
  //   }
  //   setError(null);
  //   setOpenPayLater(true);
  // };

  const generateReservationIdFromAPI = async (selectedPropertyId) => {
    const timestamp = Date.now().toString();
    const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
    const signature = await createSignature(
      selectedPropertyId.toString(),
      timestamp,
      secret
    );

    const response = await fetch(
      "https://cinbe.cinuniverse.com/api/reservation-id",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-timestamp": timestamp,
          "x-signature": signature,
        },
        body: JSON.stringify({
          selectedPropertyId: selectedPropertyId.toString(),
          keyData,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Reservation ID generation failed");
    }

    const data = await response.json();
    return data.reservation_id;
  };
  const getLatestRoomRates = async () => {
    // const jsonString = JSON.stringify(payload);
    const timestamp = Date.now().toString();
    const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
    const signature = await createSignature(
      JSON.stringify(selectedPropertyId),
      timestamp,
      secret
    );

    const response = await fetch(
      "https://cinbe.cinuniverse.com/api/cin-api/rate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-timestamp": timestamp,
          "x-signature": signature,
        },
        body: JSON.stringify({
          selectedPropertyId,
          fromDate,
          toDate,
          promoCodeContext,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("failed - Rate not found.");
    }

    const data = await response.json();
    return await data?.Product[0]?.Rooms;
  };

  const getLatestAddOnsRates = async () => {
    const timestamp = Date.now().toString();
    const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
    const signature = await createSignature(
      selectedPropertyId.toString(),
      timestamp,
      secret
    );
    const response = await fetch(
      "https://cinbe.cinuniverse.com/api/cin-api/add-ons",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-timestamp": timestamp,
          "x-signature": signature,
        },
        body: JSON.stringify({
          selectedPropertyId: selectedPropertyId.toString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("failed - Add-Ons not found.");
    }
    const data = await response.json();
    return data[0]?.ExtrasData;
  };

  const handleJson = async (newReservationId, payment_type) => {
    try {
      const latestRoomRates = await getLatestRoomRates();
      const latestAddOnsRates = await getLatestAddOnsRates();
      if (!promoCodeContext && promoCodeContext != "") {
      }
      // const decoded = atob(promoCodeContext);
      if (latestRoomRates) {
        latestRoomRates?.map((room) => {
          selectedRoom.forEach((r) => {
            if (
              r?.roomId == room?.RoomId &&
              r?.roomRate !=
                parseInt(
                  Object.values(room?.RatePlans?.[0]?.Rates || {})[0]?.OBP?.[
                    "1"
                  ].RateBeforeTax
                )
            ) {
              window.location.reload();
            }
          });
        });
      }

      if (latestAddOnsRates) {
        latestAddOnsRates?.map((addOns) => {
          selectedAddonList.forEach((r) => {
            if (
              r?.AddonId == addOns?.AddonId &&
              (r?.Rate?.[0]?.INR?.amountAfterTax !=
                addOns?.Rate?.[0]?.INR?.amountAfterTax ||
                r?.AdultRate?.[0]?.INR?.amountAfterTax !=
                  addOns?.AdultRate?.[0]?.INR?.amountAfterTax ||
                r?.ChildRate?.[0]?.INR?.amountAfterTax !=
                  addOns?.ChildRate?.[0]?.INR?.amountAfterTax)
            ) {
              //setIsRateChange(true);
              alert("Add-Ons rates have changed. Refreshing to update rates.");
              window.location.reload();
            }
          });
        });
      }
      updateUserDetails(formData);

      // sessionStorage.setItem(
      //   "bookingData",
      //   JSON.stringify({
      //     formData,
      //     totalPrice,
      //     selectedRoom,
      //     selectedStartDate,
      //     selectedEndDate,
      //     selectedAddonList,
      //     cancellationPolicyState,
      //     termsAndConditions,
      //     property,
      //   })
      // );
      const getAddonRateSection = (rateArray, quantity = "0") => {
        const rate =
          Array.isArray(rateArray) && rateArray.length > 0
            ? rateArray[0]?.INR
            : null;
        return {
          Quantity: quantity,
          AmountAfterTax: (
            parseFloat(rate?.amountAfterTax || "0") * parseInt(quantity)
          ).toString(),
          Tax: (parseFloat(rate?.tax || "0") * parseInt(quantity)).toString(),
          Taxes: Array.isArray(rate?.taxes)
            ? rate.taxes.map((tx) => ({
                Amount: (
                  parseFloat(tx?.Amount || "0") * parseInt(quantity)
                ).toString(),
                TaxId: tx?.ID || "0",
                taxName: tx?.Name || "",
              }))
            : [],
          PricePerUnit: rate?.amount,
        };
      };

      const getDateRange = (startDate, endDate) => {
        const dates = [];
        let current = new Date(startDate);
        const last = new Date(endDate);
        while (current < last) {
          dates.push(new Date(current).toISOString().split("T")[0]);
          current.setDate(current.getDate() + 1);
        }
        return dates;
      };

      const getAddonAmountAfterTax = (addon, room) => {
        const childAmt =
          room.children > 0 && addon?.ChildRate?.[0]?.INR?.amountAfterTax
            ? parseFloat(addon.ChildRate[0].INR.amountAfterTax) *
              room.children *
              addon.quantity
            : 0;

        const adultAmt =
          addon?.AdultRate?.length && addon?.AdultRate?.[0]?.INR?.amountAfterTax
            ? parseFloat(addon.AdultRate[0].INR.amountAfterTax) *
              room.adults *
              addon.quantity
            : 0;

        const baseAmt = addon?.Rate?.[0]?.INR?.amountAfterTax
          ? parseFloat(addon.Rate[0].INR.amountAfterTax) * addon.quantity
          : 0;

        return childAmt + adultAmt + baseAmt;
      };

      const diff =
        (new Date(selectedEndDate) - new Date(selectedStartDate)) /
        (1000 * 60 * 60 * 24);
      const totalTax = Object.entries(selectedTaxList || {})
        .filter(([key]) => key !== "ExtraAdultRate" && key !== "ExtraChildRate")
        .reduce((sum, [_, value]) => sum + parseFloat(value || "0"), 0);

      const taxSum = roomTaxes
        .flatMap((tax) =>
          Object.entries(tax)
            .filter(
              ([key]) =>
                ![
                  "ExtraAdultRate",
                  "ExtraChildRate",
                  "MinInventory",
                  "RateAfterTax",
                  "RateId",
                  "RoomId",
                  "Id",
                ].includes(key)
            )
            .map(([_, value]) => parseFloat(value) || 0)
        )
        .reduce((acc, val) => acc + val * parseInt(diff), 0)
        .toFixed(2); // Final tax sum as a string with 2 decimals

      const payload = {
        PropertyId: selectedPropertyId?.toString(),
        reservations: {
          reservation: [
            {
              reservation_datetime: new Date().toISOString().split("T")[0],
              reservation_id: newReservationId,
              commissionamount: "0.00",
              deposit: totalPrice?.toString(),
              totalamountaftertax: totalPrice?.toString(),
              totaltax: (
                parseFloat(taxSum) + parseFloat(addonTaxTotal)
              ).toString(),
              promocode:
                promoCodeContext && promoCodeContext != ""
                  ? atob(promoCodeContext)
                  : "",
              payment_required: "0",
              payment_type: payment_type,
              currencycode: "INR",
              status: "Confirm",
              is_subscribed: false,
              customer: {
                email: formData?.email,
                salutation: formData?.title,
                first_name: formData?.firstName || "",
                last_name: formData?.lastName || "",
                remarks: formData?.specialRequests,
                telephone: formData?.phone,
              },
              paymentcarddetail: {
                CardHolderName: formData?.cardholderName
                  ? formData?.cardholderName
                  : payLaterData?.cardholderName,
                CardType: formData?.cardType
                  ? formData?.cardType
                  : payLaterData?.cardType,
                ExpireDate: formData?.expiryDate
                  ? formData?.expiryDate
                  : payLaterData?.expiryDate,
                CardNumber: formData?.cardNumber
                  ? formData?.cardNumber?.toString()
                  : payLaterData?.cardNumber?.toString(),
                cvv: formData?.cvv
                  ? formData?.cvv?.toString()
                  : payLaterData?.cvv?.toString(),
                PaymentRefenceId: Math.floor(
                  Math.random() * 1000000000
                ).toString(),
              },
              room: selectedRoom?.map((room) => ({
                arrival_date: new Date(selectedStartDate)
                  .toISOString()
                  .split("T")[0],
                departure_date: new Date(selectedEndDate)
                  .toISOString()
                  .split("T")[0],
                arrival_time: "00:00",
                sepcial_request: formData?.specialRequests,
                bedding: {
                  BedId: "",
                  BedType: "",
                  Beds: "",
                },
                room_id: room?.roomId?.toString(),
                room_name: room?.roomName,
                salutation: formData?.title,
                first_name: formData?.firstName || "",
                last_name: formData?.lastName || "",
                price: getDateRange(selectedStartDate, selectedEndDate).map(
                  (date) => ({
                    date,
                    rate_id: room?.rateId,
                    rate_name: room?.roomPackage,
                    amountaftertax: room?.roomRateWithTax?.toString() || "0",
                    extraGuests: {
                      extraAdult:
                        room.adults > room.applicableAdults
                          ? (room.adults - room.applicableAdults).toString()
                          : "0",
                      extraChild: (room.children > room?.applicableChild
                        ? room?.children - room?.applicableChild
                        : 0
                      ).toString(),
                      extraAdultRate:
                        room.adults > room.applicableGuest
                          ? room.adultRate.toString()
                          : "0",
                      extraChildRate:
                        room?.children - room?.applicableChild > 0
                          ? room.childRate.toString()
                          : "0",
                    },
                    fees: [
                      // {
                      //   name: "Cleaning Fees",
                      //   amountaftertax: "300",
                      //   taxes: [
                      //     {
                      //       name: "service charge",
                      //       value: "2.50",
                      //     },
                      //   ],
                      // },
                    ],
                    Addons: selectedAddonList
                      ?.filter((addon) => {
                        const isSameRoom =
                          addon?.roomId === room?.id?.toString();
                        const isRecurring = addon?.Type === "R";
                        const isPerGuest = addon?.Applicable === "G";
                        const isCheckInDay = date === selectedStartDate;
                        return isSameRoom && (isRecurring || isCheckInDay);
                      })
                      ?.map((addon) => ({
                        AddonId: addon?.AddonId,
                        AddonName: addon?.AddonName,
                        AddonType: addon?.Type,
                        PriceType: addon?.Applicable,
                        AmountAfterTax: getAddonAmountAfterTax(
                          addon,
                          room
                        ).toFixed(2),
                        ...(addon?.AdultRate?.length
                          ? {
                              Adult: getAddonRateSection(
                                addon?.AdultRate,
                                parseInt(
                                  room.adults * parseInt(addon?.quantity)
                                ).toString() || "0"
                              ),
                            }
                          : {}),
                        ...(room.children > 0 && addon?.ChildRate?.length
                          ? {
                              Children: getAddonRateSection(
                                addon?.ChildRate,
                                parseInt(
                                  room.children * parseInt(addon?.quantity)
                                ).toString() || "0"
                              ),
                            }
                          : {}),
                        ...(addon?.Rate?.length
                          ? {
                              Base: getAddonRateSection(
                                addon?.Rate,
                                addon?.quantity.toString() || "0"
                              ),
                            }
                          : {}),
                      })),
                  })
                ),
                taxes: roomTaxes
                  .filter(
                    (tax) => tax?.RateId === room.rateId && tax?.Id === room.id
                  )
                  .flatMap((tax) =>
                    Object.entries(tax)
                      .filter(
                        ([key]) =>
                          key !== "ExtraAdultRate" &&
                          key !== "ExtraChildRate" &&
                          key !== "MinInventory" &&
                          key !== "RateAfterTax" &&
                          key !== "RateId" &&
                          key !== "RoomId" &&
                          key !== "Id"
                      )
                      .map(([key, value]) => ({
                        name: key,
                        value: (
                          (parseFloat(value) || 0) * parseInt(diff)
                        ).toString(),
                      }))
                  ),
                amountaftertax: (
                  (parseFloat(room?.roomRateWithTax || "0") +
                    (room.children > room?.applicableChild
                      ? room?.children - room?.applicableChild
                      : 0) *
                      room?.childRate) *
                    parseInt(diff) +
                  selectedAddonList
                    ?.filter((addon) => addon?.roomId === room?.id?.toString())
                    ?.reduce((sum, addon) => {
                      const isRecurring = addon?.Type === "R";
                      const isOnoff = addon?.Type === "O";
                      const isPerGuest = addon?.Applicable === "G";
                      const isPerQuantity =
                        addon?.Applicable === "D" || addon?.Applicable == "Q";
                      const numAdults = room?.adults || 0;
                      const numChildren = room?.children || 0;

                      let adultAddonRate = addon?.AdultRate?.length
                        ? parseFloat(
                            addon?.AdultRate?.[0]?.INR?.amountAfterTax || "0"
                          )
                        : parseFloat(
                            addon?.Rate?.[0]?.INR?.amountAfterTax || "0"
                          );
                      let childAddonRate =
                        room?.children > 0 &&
                        addon?.ChildRate?.[0]?.INR?.amountAfterTax
                          ? parseFloat(addon.ChildRate[0].INR.amountAfterTax)
                          : 0;

                      let addonRate = 0;
                      // If addon is recurring and per guest, multiply by days and guest count
                      if (isRecurring && isPerGuest) {
                        addonRate +=
                          adultAddonRate * parseInt(diff) * numAdults;
                        addonRate +=
                          childAddonRate * parseInt(diff) * numChildren;
                      }
                      // If addon is recurring but not per guest, just multiply by days
                      else if (isRecurring && isPerQuantity) {
                        addonRate +=
                          adultAddonRate *
                          (parseInt(diff) * parseInt(addon?.quantity));
                      }
                      // If not recurring but per guest (one-time on check-in), multiply by guest count
                      else if (isOnoff && isPerGuest) {
                        addonRate +=
                          adultAddonRate * numAdults * addon.quantity;
                        addonRate +=
                          childAddonRate * numChildren * addon.quantity;
                      } else if (isOnoff && isPerQuantity) {
                        addonRate += adultAddonRate * parseInt(addon?.quantity);
                      }

                      return sum + addonRate;
                    }, 0)
                ).toFixed(2),

                remarks: "No Smoking",
                GuestCount: [
                  {
                    AgeQualifyingCode: "10",
                    Count: room?.adults?.toString(),
                  },
                  {
                    AgeQualifyingCode: "8",
                    Count: room?.children?.toString(),
                  },
                ],
              })),
            },
          ],
        },
      };

      const bookingData = JSON.stringify({
        formData,
        totalPrice,
        selectedRoom: selectedRoom.map((room) => ({
          roomName: room.roomName,
          roomId: room.roomId,
          roomImage: room.roomImage,
          roomPackage: room.roomPackage,
          adults: room.adults,
          children: room.children,
        })),
        selectedStartDate,
        selectedEndDate,
        selectedAddonList: selectedAddonList.map((addon) => ({
          AddonName: addon.AddonName,
        })),
        cancellationPolicyState,
        termsAndConditions,
        property: {
          PropertyName: property?.PropertyName,
          Address: property?.Address,
        },
      });

      sessionStorage.setItem("bookingData", bookingData);
      const finalRequestData2 = {
        property_id: selectedPropertyId.toString(),
        property_name: property?.PropertyName,
        property_tel: selectedPropertyPhone,
        cust_name: `${formData.firstName} ${formData.lastName}`,
        cust_email: formData.email,
        cust_phone: formData.phone,
        cust_address: "N/A",
        cust_city: "N/A",
        cust_state: "N/A",
        cust_country: "N/A",
        cust_postalcode: "N/A",
        reservation_id: newReservationId,
        amount: totalPrice,
        currency: "INR",
        BookingDetailsJson: bookingData,
        ReservationJson: JSON.stringify(payload),
      };
      const jsonString = JSON.stringify(payload);

      const timestamp = Date.now().toString();
      const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
      const signature = await createSignature(
        JSON.stringify(jsonString),
        timestamp,
        secret
      );

      const resp = await fetch(
        "https://cinbe.cinuniverse.com/api/th-payment-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-timestamp": timestamp,
            "x-signature": signature,
          },
          body: JSON.stringify({ finalRequestData2, keyData }),
        }
      );
      const data = await resp.json();
      return data;
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError, { position: "top-right", autoClose: 3000 });
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const newReservationId = await generateReservationIdFromAPI(
        selectedPropertyId
      );
      const payment_type = "Channel Collect";
      const data = await handleJson(newReservationId, payment_type);
      if (data?.errorMessage == "success") {
        const finalRequestData = {
          property_id: selectedPropertyId,
          property_name: selectedPropertyName,
          property_tel: selectedPropertyPhone,
          cust_name: `${formData.firstName} ${formData.lastName}`,
          cust_email: formData.email,
          cust_phone: formData.phone,
          cust_address: "N/A",
          cust_city: "N/A",
          cust_state: "N/A",
          cust_country: "N/A",
          cust_postalcode: "N/A",
          reservation_id: newReservationId,
          amount: totalPrice,
          keyData: keyData,
        };
        setHiddenInputValue(JSON.stringify(finalRequestData));
        setTimeout(() => {
          hiddenFormRef.current.submit();
        }, 100);
      } else {
        toast.error(data?.errorMessage);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayLaterSubmit = async (dataFromPayLater) => {
    if (!validateForm()) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError, { position: "top-right", autoClose: 3000 });
      return;
    }
    setPayLaterData(dataFromPayLater);
    setOpenPayLater(false);

    try {
      //const fag = "PayLater"
      const newReservationId = await generateReservationIdFromAPI(
        selectedPropertyId
      );
      const payment_type = "Hotel Collect";
      const data = await handleJson(newReservationId, payment_type);
      if (data?.errorMessage == "success") {
        //setHiddenInputValue(JSON.stringify(finalRequestData));
        const paymentJson = {
          partner_id: 7,
          property_id: selectedPropertyId.toString(),
          reservation_id: newReservationId,
          pg_transaction_id: newReservationId,
          status_code: "0000",
          status: "paylater",
          error_msg: "paylater",
          hash_key:
            "2dfb397de4e378cbae23a0e112905162ee48gs45j23d32ff214139091ef5e0ef3",
          amount: totalPrice.toString(),
          currency: "INR",
          ipn_flag: "0",
        };
        sessionStorage.setItem("paymentResponse", [
          JSON.stringify(paymentJson),
        ]);
        window.location.href = "/";
      } else {
        toast.error(data?.errorMessage);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const matched = countryList.find((item) => item.code === selectedCountry);

    setFormData((prevDetails) => ({
      ...prevDetails,
      countryCode: selectedCountry,
      country: matched?.name || "",
    }));
  };
  return (
    <div className="booking-payment-form detail-stepp-for-booking">
      <div className="wizard-step-global-padding">
        <h4 className="wizard-title-main">Personal Details</h4>

        <form onSubmit={handleSubmit}>
          {/* User Detail Fields */}
          {/* <div className="mb-3">
            <select
              name="Country"
              value={formData.countryCode}
              onChange={handleCountryChange}
              className={`form-control ${errors.Country ? "is-invalid" : ""}`}
            >
              <option value=""> +Code </option>
              {countryList.map((country) => (
                <option key={country.name} value={country.code}>
                  {country.code}
                </option>
              ))}
            </select>
            {errors.countryCode && (
              <div className="invalid-feedback">{errors.countryCode}</div>
            )}
          </div>
          <div className="mb-3">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              minLength={7}
              maxLength={12}
              onChange={handleChange}
              onBlur={handlePhoneBlur}
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              placeholder="Phone Number"
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div> */}
          <div className="mb-3 input-group">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleCountryChange}
              className={`form-select ${
                errors.countryCode ? "is-invalid" : ""
              }`}
              style={{ maxWidth: "100px" }}
            >
              {/* <option value="">select</option> */}
              {countryList.map((country) => (
                <option key={country.name} value={country.code}>
                  {country.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              minLength={7}
              maxLength={12}
              onChange={handleChange}
              onBlur={handlePhoneBlur}
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              placeholder="Phone Number"
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-select ${errors.title ? "is-invalid" : ""}`}
            >
              <option value="">Select Title*</option>
              <option value="Mr">Mr</option>
              <option value="Ms">Ms</option>
              <option value="Mrs">Mrs</option>
              <option value="Miss">Miss</option>
              <option value="Dr">Dr</option>
              <option value="Prof">Prof</option>
            </select>
            {errors.title && (
              <div className="invalid-feedback">{errors.title}</div>
            )}
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              placeholder="First Name"
            />
            {errors.firstName && (
              <div className="invalid-feedback">{errors.firstName}</div>
            )}
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              placeholder="Last Name"
            />
            {errors.lastName && (
              <div className="invalid-feedback">{errors.lastName}</div>
            )}
          </div>
          <div className="mb-3">
            <input
              name="gstNumber"
              type="text"
              placeholder="GST Number"
              value={formData.gstNumber}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <textarea
              name="specialRequests"
              placeholder="Special Requests"
              value={formData.specialRequests}
              onChange={handleChange}
              className="form-control"
            ></textarea>
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className={`form-check-input ${
                errors.agreeToTerms ? "is-invalid" : ""
              }`}
            />
            <label className="form-check-label">
              I agree to the terms & conditions
            </label>
            {errors.agreeToTerms && (
              <div className="invalid-feedback">{errors.agreeToTerms}</div>
            )}
          </div>
          <div className="wizard-bottom-fixed">
            <div className="wizard-bottom-fixed-0">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </form>

        {error && <div className="alert alert-danger mt-3">Error: {error}</div>}

        <form
          method="POST"
          action="https://cinbe.cinuniverse.com/api/th-payment-redirect"
          ref={hiddenFormRef}
          style={{ display: "none" }}
        >
          <input type="hidden" name="paramvalues" value={hiddenInputValue} />
          <input type="hidden" name="keydata" value={keyData} />
        </form>

        {/* {isOpenPayLater && (
          <div className="pay-later-pop-up">
            <div className="modal-overlay">
              <div className="modal-content">
                <button
                  className="modal-close"
                  onClick={() => setOpenPayLater(false)}
                >
                  &times;
                </button>
                <PayLater onSubmit={handlePayLaterSubmit} />
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default BookingAndPayment;
