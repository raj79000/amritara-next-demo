"use client";

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";
import md5 from "md5";
import { useBookingEngineContext } from "../../cin_context/BookingEngineContext";
import { createSignature } from "../../../utilities/signature";
import PayLater from "./PayLater";
import { getUserInfo } from "../../../utilities/userInfo";
import Link from 'next/link'
//import useBook from "app/booking-engine-widget/useBook";

import { countryList } from "../../../utilities/countryList";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Check, SquareCheck, ShieldCheck , CalendarCheck} from "lucide-react";
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

const BookingAndPayment = forwardRef ((props, ref) => {
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
    setTotalRoomPrice,
    setBaseRoomPrice,
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
    isMemberRate,
    setIsMemberRate,
    defaultOffer, setDefaultOffer,
    isInventoryAvailable, setInventoryAvailable,
    totalTax, setTotalTax
  } = useBookingEngineContext();

  //const { promoCodeContext, setPromoCodeContext } = useBook();
  
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

  const srilankaProperties = [26735,53301,54175];
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const hiddenFormRef = useRef(null);
  const [hiddenInputValue, setHiddenInputValue] = useState("");
  const [generatedReservationId, setGeneratedReservationId] = useState("");
  const [payLaterData, setPayLaterData] = useState(null);
  const [isOpenPayLater, setOpenPayLater] = useState(false);
  
  const formRef = useRef();
  const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const replaceKeys = ["book-now", "select-package", "pay-now", "search"];
function replaceAction(newAction) {
    const params = new URLSearchParams(searchParams.toString());
    let replaced = false;

    // remove any existing action keys
    replaceKeys.forEach(key => {
      if (params.has(key)) {
        params.delete(key);
        replaced = true;
      }
    });

    // if no params OR replaced → add the new action
    if ([...params.keys()].length === 0 || replaced) {
      params.set(newAction, "");
    } else if (!params.has(newAction)) {
      // if other queries exist but no action → add it
      params.set(newAction, "");
    }

    // cleanup so `action=` becomes just `action`
    const query = params.toString().replace(/=(&|$)/g, "$1");

    router.replace(`${pathname}?${query}`);
  }
  useImperativeHandle(ref, () => ({
      submitForm: () => {
        formRef.current.requestSubmit(); // modern way to submit form
      }
    }));


  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toISOString().split("T")[0];
  };

  const fromDate = formatDate(selectedStartDate);
  const toDate = formatDate(selectedEndDate);
  // const keyData = "dbKey=Dbconn";
  const keyData = `dbKey=${process.env.NEXT_PUBLIC_TOKEN_DB_KEY}`;
 // const keyData = process.env.NEXT_PUBLIC_TOKEN_DB_KEY;
  // const cleanedKeyData = keyData.replace(/"/g, "");
  const [guestInfo, setGuestInfo] = useState({});

    const sessionId = sessionStorage?.getItem("sessionId");

  const calculateNumberOfDays = () => {
    if (!selectedStartDate || !selectedEndDate) return 1;
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const numberOfDays = calculateNumberOfDays();
  const calculateBasePrice = () => {
    // Sum all selectedRoom's roomRate
    const totalRoomRate = selectedRoom?.reduce(
      (sum, room) => sum + (parseFloat(room?.packageRate) || 0),
      0
    );
    return totalRoomRate * numberOfDays;
  };

  const calculateTotalWithTax = () => {
    const basePrice = calculateBasePrice();
    return totalTax + (basePrice || 0);
  };

  const basePrice = calculateBasePrice();
  const finalAmount = calculateTotalWithTax();
    useEffect(() =>{
      async function callUserInfo() {
      const resp = await getUserInfo();
      setGuestInfo(resp);
      }
      callUserInfo();
   },[])

   const baseUrl = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/th-payment-redirect`;

// async function redirectWithPost(paramvalues, keydata) {
//   const formData = new FormData();
//   formData.append("paramvalues", paramvalues);
//   formData.append("keydata", keydata);

//   const response = await fetch(baseUrl, {
//     method: "POST",
//     body: formData,
//   });

//   const html = await response.text();
//   const newWindow = window.open("", "_self"); // or "_blank"
//   newWindow.document.write(html);
//   newWindow.document.close();
// }

  function redirectWithPost(paramvalues, keydata) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = baseUrl;
 
    const input1 = document.createElement("input");
    input1.type = "hidden";
    input1.name = "paramvalues";
    input1.value = paramvalues;
 
    const input2 = document.createElement("input");
    input2.type = "hidden";
    input2.name = "keydata";
    input2.value = keydata;
 
    form.appendChild(input1);
    form.appendChild(input2);
    document.body.appendChild(form);
 
    form.submit(); // 🔥 Browser loads API → API returns HTML → auto-submit → SecurePay
    
  }

  // const proceedToPay = (selectedRoom) => {
  //   const isProceed = selectedRoom.every((room) => room.roomId);

  //   // Check if any room has more guests than allowed
  //   const isGuestLimitExceeded = selectedRoom.some(
  //     (room) => room.adults + room.children > room.maxGuest
  //   );
  //   const isAdultLimitExceeded = selectedRoom.some(
  //     (room) => room.adults > room.maxAdult
  //   );

  //   const isChildLimitExceeded = selectedRoom.some(
  //     (room) => room.children > room.maxChildren
  //   );
  //   const roomCountMap = selectedRoom.reduce((acc, room) => {
  // acc[room.roomId] = (acc[room.roomId] || 0) + 1;
  // acc[room.roomName] = room?.roomName;
  // return acc;
  //  }, {});
   
  //  // Check if any room count exceeds its minInventory
  //  const isInvAvailable = !selectedRoom.some(
  //    (room) => roomCountMap[room.roomId] > room.minInventory
  //  );
  //   if (
  //     isProceed &&
  //     !isGuestLimitExceeded &&
  //     isInvAvailable &&
  //     !isAdultLimitExceeded &&
  //     !isChildLimitExceeded
  //   ) {
  //     setTotalRoomPrice(finalAmount);
  //     setBaseRoomPrice(basePrice);
  //     //goNext();
  //     return "success";
  //   } else if (!isProceed) {
  //     toast.error("Select your room(s)");
  //     return "Select your room(s)";
  //   } else if (isGuestLimitExceeded) {
  //     toast.error(
  //       "Selected guests are greater than the max guest allowed in one or more rooms"
  //     );
  //     return "Selected guests are greater than the max guest allowed in one or more rooms";
  //   } else if (isAdultLimitExceeded) {
  //     toast.error(
  //       "Selected adults are greater than the max adults allowed in one or more rooms"
  //     );
  //     return "Selected adults are greater than the max adults allowed in one or more rooms";
  //   } else if (isChildLimitExceeded) {
  //     toast.error(
  //       "Selected children are greater than the max children allowed in one or more rooms"
  //     );
  //     return "Selected children are greater than the max children allowed in one or more rooms";
  //   } else if (!isInvAvailable) {
  //     toast.error("Booking not available for selected date");
  //   }
  //     return "Booking not available for selected date";
  // };

//   const proceedToPay = (selectedRoom) => {
//   const isProceed = selectedRoom.every((room) => room.roomId);

//   // Guest limit checks
//   const isGuestLimitExceeded = selectedRoom.some(
//     (room) => room.adults + room.children > room.maxGuest
//   );
//   const isAdultLimitExceeded = selectedRoom.some(
//     (room) => room.adults > room.maxAdult
//   );
//   const isChildLimitExceeded = selectedRoom.some(
//     (room) => room.children > room.maxChildren
//   );

//   // Group by roomId and count selections
//   const roomCountMap = selectedRoom.reduce((acc, room) => {
//     if (!acc[room.roomId]) {
//       acc[room.roomId] = { count: 0, roomName: room.roomName };
//     }
//     acc[room.roomId].count += 1;
//     return acc;
//   }, {});

//   // Find if any room exceeds inventory
//   const exceededRoom = selectedRoom.find(
//     (room) => roomCountMap[room.roomId].count > room.minInventory
//   );

//   const isInvAvailable = !exceededRoom;

//   // Final checks
//   if (
//     isProceed &&
//     !isGuestLimitExceeded &&
//     isInvAvailable &&
//     !isAdultLimitExceeded &&
//     !isChildLimitExceeded
//   ) {
//     setTotalRoomPrice(finalAmount);
//     setBaseRoomPrice(basePrice);
//     // goNext();
//     return "success";
//   } else if (!isProceed) {
//     toast.error("Select your room(s)");
//     return "Select your room(s)";
//   } else if (isGuestLimitExceeded) {
//     toast.error(
//       "Selected guests are greater than the max guest allowed in one or more rooms"
//     );
//     return "Selected guests are greater than the max guest allowed in one or more rooms";
//   } else if (isAdultLimitExceeded) {
//     toast.error(
//       "Selected adults are greater than the max adults allowed in one or more rooms"
//     );
//     return "Selected adults are greater than the max adults allowed in one or more rooms";
//   } else if (isChildLimitExceeded) {
//     toast.error(
//       "Selected children are greater than the max children allowed in one or more rooms"
//     );
//     return "Selected children are greater than the max children allowed in one or more rooms";
//   } else if (!isInvAvailable) {
//     toast.error(
//       `Booking not available for "${exceededRoom.roomName}" (inventory exceeded)`
//     );
//     return `Booking not available for "${exceededRoom.roomName}"`;
//   }

// //  return "Booking not available for selected date";
// };
const proceedToPay = (selectedRoom) => {
  const isProceed = selectedRoom.every((room) => room?.roomId);
  const isOutOfStock = selectedRoom.every((room) => Number(room?.roomRateWithTax) > 0);

  // Guest limit checks
  const isGuestLimitExceeded = selectedRoom.some(
    (room) => room.adults + room.children > room.maxGuest
  );
  const isAdultLimitExceeded = selectedRoom.some(
    (room) => room.adults > room.maxAdult
  );
  const isChildLimitExceeded = selectedRoom.some(
    (room) => room.children > room.maxChildren
  );

  // Group by roomId and count selections
  const roomCountMap = selectedRoom.reduce((acc, room) => {
    if (!acc[room.roomId]) {
      acc[room.roomId] = { count: 0, roomName: room.roomName };
    }
    acc[room.roomId].count += 1;
    return acc;
  }, {});

  // Find if any room exceeds inventory
  const exceededRoom = selectedRoom.find(
    (room) => roomCountMap[room.roomId].count > room.minInventory
  );

  const isInvAvailable = !exceededRoom;

  // Final checks
  if (
    isProceed &&
    isOutOfStock &&
    !isGuestLimitExceeded &&
    isInvAvailable &&
    !isAdultLimitExceeded &&
    !isChildLimitExceeded
  ) {
    setTotalRoomPrice(finalAmount);
    setBaseRoomPrice(basePrice);
    // goNext();
    return "success";
  } else if (!isProceed) {
    toast.error("Select your room(s)");
    return "Select your room(s)";
  }
     else if (!isOutOfStock) {
     toast.error("One or more room(s) are out of stock.");
     return "One or more room(s) are out of stock.";
   }
   else if (isGuestLimitExceeded) {
    toast.error(
      "Selected guests are greater than the max guest allowed in one or more rooms"
    );
    return "Selected guests are greater than the max guest allowed in one or more rooms";
  } else if (isAdultLimitExceeded) {
    toast.error(
      "Selected adults are greater than the max adults allowed in one or more rooms"
    );
    return "Selected adults are greater than the max adults allowed in one or more rooms";
  } else if (isChildLimitExceeded) {
    toast.error(
      "Selected children are greater than the max children allowed in one or more rooms"
    );
    return "Selected children are greater than the max children allowed in one or more rooms";
  } else if (!isInvAvailable) {
    //const selectedCount = roomCountMap[exceededRoom.roomId].count;
    const availableCount = exceededRoom.minInventory;

    toast.error(
      `inventory exceeded for "${exceededRoom.roomName}". Available: ${availableCount}`
    );
    return `inventory exceeded for "${exceededRoom.roomName}". Available: ${availableCount}`;
  }
};

 async function postBookingWidged(rooms,mapping, isClose,ctaName, 
  ApiName,ApiUrl,ApiStatus,ApiErrorCode,ApiMessage) {
//  const resp = await getUserInfo();

  //console.log("resp",resp);
  // if(!sessionId){
  //  setSessionId(resp?.guid);
  // }
    const totalAdults = selectedRoom?.reduce(
      (sum, room) => sum + (room?.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room?.children || 0),
      0
    );
    const totalRooms = selectedRoom?.length;
    //console.log("data pathname",data)
    const payload = {
    ctaName: ctaName,
    urls: window.location.href,
    cityId: "0",
    propertyId: selectedPropertyId?.toString() ?? "0",
    checkIn: fromDate ?? "",
    checkOut: toDate ?? "",
    adults: totalAdults?.toString() ?? "0",
    children: totalChildren?.toString() ?? "0",
    rooms: totalRooms?.toString() ?? "0",
    promoCode: "",
    ip: guestInfo?.ip,
    sessionId: sessionId,
    deviceName: guestInfo?.deviceInfo?.deviceName,
    deviceType: guestInfo?.deviceInfo?.deviceOS == "Unknown" ? guestInfo?.deviceInfo?.platform : guestInfo?.deviceInfo?.deviceOS,
    roomsName: selectedRoom?.map(room => room?.roomName)?.join(", "),
    packageName: selectedRoom?.map(room => room?.roomPackage)?.join(", "),
    isCartOpen: mapping?.MappingName ? "Y": "N",
    isCartEdit: "N",
    isCartClick: "N",
    isClose: isClose ? "Y" : "N",
    ApiName: ApiName ?? "",
    ApiUrl: ApiUrl ?? "",
    ApiStatus: ApiStatus?.toString() ?? "",
    ApiErrorCode: ApiErrorCode?.toString() ?? "",
    ApiMessage: ApiMessage?.toString() ?? ""
   }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/tracker/BookingWidged`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify( payload ),
        }
      );
      const res = await response?.json();

    //console.log("res BookingWidged",res);
  }
  const getUserDetails = async (phone) => {
    
    let roomsData = ""; 
  let mappingData =""; 
  let isCloseData = false;
  let apiStatusData = ""; 
  let apiErrorCodeData = "";  
  let apiMessageData = "";
  let ctaNameData = "Fetch User Details"; 
  let apiNameData = "user-details";  
  let apiUrlData = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/user-details`; 
    try {
      const timestamp = Date.now().toString();
      const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
      const signature = await createSignature(
        JSON.stringify(phone),
        timestamp,
        secret
      );
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/user-details`,
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
      if(!res?.ok){
      apiStatusData= res?.status;
      apiErrorCodeData= res?.status;
      apiMessageData= "Data not found";
      }
      else{
      apiStatusData= res?.status;
      apiErrorCodeData= res?.status;
      apiMessageData= "Success";
        const data = await res?.json();
      return data;
    }
    } catch (error) {
      
       apiStatusData= error;
       apiErrorCodeData= "1166";
       apiMessageData= error;
      console.error("API call failed:", error); 
    }finally {
      setTimeout(() => {
      postBookingWidged(roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);
    }
  };
  
  const getUserEnrollment = async (phone) => {
    console.log("selectedRoom",selectedRoom);
    //const resp = await getUserInfo();
    let roomsData = ""; 
  let mappingData =""; 
  let isCloseData = false;
  let apiStatusData = ""; 
  let apiErrorCodeData = "";  
  let apiMessageData = "";
  let ctaNameData = "Post User Enrollment"; 
  let apiNameData = "user-enrollment";  
  let apiUrlData = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/user-enrollment`; 
  const payload ={
    
    MobileNo: phone?.toString(),
    PropertyId: selectedPropertyId?.toString(),
    SessionId: sessionId,
    Ip: guestInfo?.ip,
    Room: selectedRoom.map(room => room?.roomName).join(", "),
    Package: selectedRoom.map(room => room?.roomPackage).join(", ")
  }
    try {
      const timestamp = Date.now().toString();
      const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
      const signature = await createSignature(
        JSON.stringify(payload),
        timestamp,
        secret
      );
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/user-enrollment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-timestamp": timestamp,
            "x-signature": signature,
          },
          body: JSON.stringify({ payload, keyData }),
        }
      );
      if(!res?.ok){
      apiStatusData= res?.status;
      apiErrorCodeData= res?.status;
      apiMessageData= "Data not found";
      }
      else{
      apiStatusData= res?.status;
      apiErrorCodeData= res?.status;
      apiMessageData= "Success";
        const data = await res?.json();
      return data;
    }
    } catch (error) {
      
       apiStatusData= error;
       apiErrorCodeData= "1166";
       apiMessageData= error;
      console.error("API call failed:", error); 
    }finally {
      setTimeout(() => {
      postBookingWidged(roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);
    }
  };
  const handlePhoneBlur = async () => {
    const phone = formData?.phone;
    if (phone?.length >= 7) {
      try {
        //const userData = await getUserDetails(parseInt(phone));
        const userData = await getUserEnrollment(parseInt(phone));
        const result = userData?.result?.[0];

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

  function encodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  const generateReservationIdFromAPI = async (selectedPropertyId) => {
    
  let roomsData = ""; 
  let mappingData =""; 
  let isCloseData = false;
  let apiStatusData = ""; 
  let apiErrorCodeData = "";  
  let apiMessageData = "";
  let ctaNameData = "Fetch reservation ID"; 
  let apiNameData = "reservation-id";  
  let apiUrlData = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/reservation-id`; 
    const timestamp = Date.now().toString();
    const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
    const signature = await createSignature(
      selectedPropertyId?.toString(),
      timestamp,
      secret
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/reservation-id`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-timestamp": timestamp,
          "x-signature": signature,
        },
        body: JSON.stringify({
          selectedPropertyId: selectedPropertyId?.toString(),
          keyData,
        }),
      }
    );

    if (!response.ok) {
      
      apiStatusData= response?.status;
      apiErrorCodeData= response?.status;
      apiMessageData= "Data not found";
      setTimeout(() => {
      postBookingWidged(roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);
      throw new Error("Reservation ID generation failed");
    }

    else{
      apiStatusData= "0";
      apiErrorCodeData= "0";
      apiMessageData= "Success";
      const data = await response.json();
      setTimeout(() => {
      postBookingWidged(roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);
    return data.reservation_id;
  }
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
      `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/cin-api/rate`,
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
          promoCodeContext: promoCodeContext ? promoCodeContext: encodeBase64(defaultOffer),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("failed - Rate not found.");
    }

    const data = await response.json();
    return await data?.Product?.[0]?.Rooms;
  };

  const getLatestAddOnsRates = async () => {
    const timestamp = Date.now().toString();
    const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
    const signature = await createSignature(
      selectedPropertyId?.toString(),
      timestamp,
      secret
    );
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/cin-api/add-ons`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-timestamp": timestamp,
          "x-signature": signature,
        },
        body: JSON.stringify({
          selectedPropertyId: selectedPropertyId?.toString(),
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
    
  let roomsData = selectedRoom; 
  let mappingData =""; 
  let isCloseData = false;
  let apiStatusData = ""; 
  let apiErrorCodeData = "";  
  let apiMessageData = "";
  let ctaNameData = "Post payment request"; 
  let apiNameData = "th-payment-request";  
  let apiUrlData = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/th-payment-request`; 
    try {
      updateUserDetails(formData);
      const getAddonRateSection = (rateArray, quantity = "0") => {
        const rate =
          Array.isArray(rateArray) && rateArray?.length > 0
            ? rateArray?.[0]?.INR
            : null;
        return {
          Quantity: quantity,
          AmountAfterTax: (
            parseFloat(rate?.amountAfterTax || "0") * parseInt(quantity)
          )?.toString(),
          Tax: (parseFloat(rate?.tax || "0") * parseInt(quantity))?.toString(),
          Taxes: Array.isArray(rate?.taxes)
            ? rate.taxes.map((tx) => ({
                Amount: (
                  parseFloat(tx?.Amount || "0") * parseInt(quantity)
                )?.toString(),
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
            ? parseFloat(addon?.ChildRate?.[0]?.INR?.amountAfterTax) *
              room.children *
              addon.quantity
            : 0;

        const adultAmt =
          addon?.AdultRate?.length && addon?.AdultRate?.[0]?.INR?.amountAfterTax
            ? parseFloat(addon?.AdultRate?.[0]?.INR?.amountAfterTax) *
              room.adults *
              addon.quantity
            : 0;

        const baseAmt = addon?.Rate?.[0]?.INR?.amountAfterTax
          ? parseFloat(addon?.Rate?.[0]?.INR?.amountAfterTax) * addon.quantity
          : 0;

        return childAmt + adultAmt + baseAmt;
      };

      const diff =
        (new Date(selectedEndDate) - new Date(selectedStartDate)) /
        (1000 * 60 * 60 * 24);
      const totalTax = Object.entries(selectedTaxList || {})?.filter(([key]) => key !== "ExtraAdultRate" && key !== "ExtraChildRate")
        ?.reduce((sum, [_, value]) => sum + parseFloat(value || "0"), 0);

      const taxSum = roomTaxes?.flatMap((tax) =>
          Object.entries(tax)
            ?.filter(
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
              )?.toString(),
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
                )?.toString(),
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
                          ? (room.adults - room.applicableAdults)?.toString()
                          : "0",
                      extraChild: (room.children > room?.applicableChild
                        ? room?.children - room?.applicableChild
                        : 0
                      )?.toString(),
                      extraAdultRate:
                        room?.adults > room?.applicableGuest
                          ? room?.adultRate?.toString()
                          : "0",
                      extraChildRate:
                        room?.children - room?.applicableChild > 0
                          ? room.childRate?.toString()
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
                                )?.toString() || "0"
                              ),
                            }
                          : {}),
                        ...(room.children > 0 && addon?.ChildRate?.length
                          ? {
                              Children: getAddonRateSection(
                                addon?.ChildRate,
                                parseInt(
                                  room.children * parseInt(addon?.quantity)
                                )?.toString() || "0"
                              ),
                            }
                          : {}),
                        ...(addon?.Rate?.length
                          ? {
                              Base: getAddonRateSection(
                                addon?.Rate,
                                addon?.quantity?.toString() || "0"
                              ),
                            }
                          : {}),
                      })),
                  })
                ),
                taxes: roomTaxes?.filter(
                    (tax) => tax?.RateId === room?.rateId && tax?.Id === room?.id
                  )?.flatMap((tax) =>
                    Object.entries(tax)?.filter(
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
                        )?.toString(),
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
                          ? parseFloat(addon?.ChildRate?.[0]?.INR?.amountAfterTax)
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
          roomName: room?.roomName,
          roomId: room?.roomId,
          roomImage: room?.roomImage,
          roomPackage: room?.roomPackage,
          adults: room?.adults,
          children: room?.children,
        })),
        selectedStartDate,
        selectedEndDate,
        selectedAddonList: selectedAddonList?.map((addon) => ({
          AddonName: addon?.AddonName,
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
        cust_name: `${formData?.firstName} ${formData?.lastName}`,
        cust_email: formData?.email,
        cust_phone: formData?.phone,
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
        SessionId: sessionId,
        Ip: guestInfo?.ip,
        Room: selectedRoom.map(room => room?.roomName).join(", "),
        Package: selectedRoom.map(room => room?.roomPackage).join(", ")
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
        `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/th-payment-request`,
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
      
    if (!resp.ok) {
      apiStatusData= resp?.status;
      apiErrorCodeData= resp?.status;
      apiMessageData= "Data not found";
      throw new Error("Reservation ID generation failed");
    }
    else{
      const data = await resp.json();
      apiStatusData= resp?.status;
      apiErrorCodeData= resp?.status;
      apiMessageData= "Success";
      return data;
    }
    } catch (err) {
       apiStatusData= err;
       apiErrorCodeData= "1166";
       apiMessageData= err;
      setError(err.message);
      return err;
    }finally {
      setTimeout(() => {
      postBookingWidged(roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);

    }
  };

  const handleSubmit = async (e) => {
   
  //router.replace("?pay-now");
  replaceAction("pay-now");
  window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'virtualPageview',
      page_path: '/?pay-now',
      page_location: `${window.location.pathname}/?pay-now`,
      page_title: 'BE Steps - pay-now Page',
    });
    e.preventDefault();
   const isProceedToPay = proceedToPay(selectedRoom);
    if(isProceedToPay != "success"){
      
  postBookingWidged("","", false,isProceedToPay);
    //setIsLoading(false);
     return;
    }
    if (!validateForm()) {
      //const firstError = Object.values(errors)[0];
      //postBookingWidged("","", false,firstError);
      //toast.error(firstError, { position: "top-right", autoClose: 3000 });
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      
      postBookingWidged("","", false,"Pay Now Click");
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
          cust_name: `${formData?.firstName} ${formData?.lastName}`,
          cust_email: formData?.email,
          cust_phone: formData?.phone,
          cust_address: "N/A",
          cust_city: "N/A",
          cust_state: "N/A",
          cust_country: "N/A",
          cust_postalcode: "N/A",
          reservation_id: newReservationId,
          amount: totalPrice,
          keyData: keyData,
        };
        // setHiddenInputValue(JSON.stringify(finalRequestData));
         redirectWithPost(JSON.stringify(finalRequestData), keyData);
           //hiddenFormRef.current.submit();
          // setTimeout(() => {
          //   hiddenFormRef.current.submit();
          // }, 100);
        
    //      if(srilankaProperties.includes(parseInt(finalRequestData?.property_id))){
    //     const responseJson = {        
    //     amount: "0.0",
    //     currency: "USD",
    //     error_msg: "Transaction failed!",
    //     hash_key:"",
    //     ipn_flag: "0",
    //     partner_id: "7",
    //     pg_transaction_id: "00",
    //     property_id: finalRequestData?.property_id?.toString(),
    //     reservation_id: newReservationId?.toString(),
    //     status: "error",
    //     status_code: "1111"
    //     };
    //     const GuidIdString = {
    //      GuidIdString: JSON.stringify(responseJson),
    //    };
    //     const apiResponse = await fetch(
    //   // "https://staahbe.cinuniverse.com/GetGuidToken",
    //   "https://staahbe.cinuniverse.com/GetGuidToken",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(GuidIdString),
    //   }
    // );
    // if(apiResponse.ok){
    //    const result = await apiResponse.json();
    //    const  queryParams = new URLSearchParams({
    //     tokenKey: result?.result?.[0]?.tokenKey || "",
    //     status: "success",
    //     }).toString();

    //    const redirectUrl = `${result?.result?.[0]?.demoLandingUrl}?${queryParams}`;
    //      window.location.href = redirectUrl;
    //    }


    //      } else {
    //       setHiddenInputValue(JSON.stringify(finalRequestData));
    //      setTimeout(() => {
    //        hiddenFormRef.current.submit();
    //      }, 100);
    //     }
      } else {
      postBookingWidged("","", false,data?.errorMessage);
       // toast.error(data?.errorMessage);
      }
    } catch (err) {
      postBookingWidged("","", false,err?.message);
      setError(err?.message);

    } 
     finally {
       
    setTimeout(()=>{
    setIsLoading(false);
    }, 2000);
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
          property_id: selectedPropertyId?.toString(),
          reservation_id: newReservationId,
          pg_transaction_id: newReservationId,
          status_code: "0000",
          status: "paylater",
          error_msg: "paylater",
          hash_key:
            "2dfb397de4e378cbae23a0e112905162ee48gs45j23d32ff214139091ef5e0ef3",
          amount: totalPrice?.toString(),
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
        <form onSubmit={handleSubmit} ref={formRef}>
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
     
        <div className="upper-detail-card">
           {/* {room?.roomId && room?.roomName && (
            <>
            <h4 className="wizard-title-main">{room.roomName}</h4>
                <div className="d-flex">
                    <p className="f-12-new d-flex flex-column">
                        <span className="small">Check In</span>
                        <span>{formatDate(selectedStartDate)} </span> 
                      </p>
                      <p className="f-12-new d-flex flex-column">
                        <span className="small">Check Out</span>
                      <span>{formatDate(selectedEndDate)}</span> 
                      </p>
                </div>
            </>
          )} */}
              

          <div className="row">
             <div className="col-md-12">
                  <h4 className="wizard-title-main">Guest Details</h4>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 input-group">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleCountryChange}
                      className={`form-select ${
                        errors.countryCode ? "is-invalid" : ""
                      }`}
                      style={{ maxWidth: "62px" }}
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
                </div>
                <div className="col-md-6">
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
                </div>
            <div className="col-md-6">
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
            </div>
            <div className="col-md-6">
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
            </div>
            <div className="col-md-6">
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
            </div>
            <div className="col-md-6">
               
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
            </div>
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

            <div className="col-md-12">
                    <div className="form-check mb-3 d-flex align-items-center gap-2">
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
                          I agree to the <Link target="_blank" href="/privacy-policy">privacy policy</Link>
                        </label>
                        {errors.agreeToTerms && (
                          <div className="invalid-feedback">{errors.agreeToTerms}</div>
                        )}
                      </div>
                </div>

                <div className="wizard-bottom-fixed">
                  <div className="wizard-bottom-fixed-0">
                    <button
                      type="submit"
                      className="btn btn-success w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Confirm & Pay"}
                    </button>
                  </div>
                </div>

                <p className="d-flex justify-content-between align-items-center font-bold text-center mt-3 txt-pyment-form">
                 <span className="d-flex align-items-center justify-content-between gap-2"><SquareCheck size={16} /> Best Price guaranteed</span> 
                 <span className="d-flex align-items-center justify-content-between gap-2"><ShieldCheck size={18} /> 100% secure payment</span> 
                 <span className="d-flex align-items-center justify-content-between gap-2"><CalendarCheck size={18} /> Instant Confirmation</span> 
                </p>



        
        </div>

        
         



        </form>

        {error && <div className="alert alert-danger mt-3">Error: {error}</div>}

        {/* <form
          method="POST"
          action="https://cindemo.cinuniverse.com/api/th-payment-redirect"
          ref={hiddenFormRef}
          style={{ display: "none" }}
        >
          <input type="hidden" name="paramvalues" value={hiddenInputValue} />
          <input type="hidden" name="keydata" value={keyData} />
        </form> */}

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
});

export default BookingAndPayment;
