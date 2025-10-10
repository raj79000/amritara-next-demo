"use client";
import { useBookingEngineContext } from "../cin_context/BookingEngineContext";
import * as ReactDOM from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import "flatpickr/dist/themes/material_green.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tags } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlane,
  faDiamond,
  faMaximize,
  faPeopleGroup,
  faXmark,
  faTrain,
  faMapMarked,
} from "@fortawesome/free-solid-svg-icons";
import RoomManager from "./RoomManager";

import DateRangePicker from "./Flatpicker";
import WizardSidebar from "./PaymentGateway/WizardForm";
import "./booking.css";
import { createSignature } from "../../utilities/signature";
import { getUserInfo } from "../../utilities/userInfo";
//import { useForm } from "app/booking-engine-widget/FormContext";
import Login from "./Users/Login";
import SignUp from "./Users/SignUp";
import Link from "next/link";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Map, MapIcon, Search } from "lucide-react";
//import { useSearchParams } from "next/navigation";
import Select from "react-select";
import { useRouter } from "next/navigation";
const dummyImage = "/no_image.jpg";
const baseurl = `#`;
//import { createPortal } from "react-dom";
//import useBook from "app/booking-engine-widget/useBook";

const FilterBar = ({
  contentData,
  tokenKey,
  selectedProperty,
  cityDetails,
  openBookingBar,
  roomDetails,
  onClose
}) => {
  const {
    setSelectedPropertyId,
    selectedPropertyId,
    setSelectedPropertyName,
    setSelectedPropertyPhone,
    setFilteredRooms,
    selectedRoom,
    setSelectedRoom,
    setSelectedRoomRate,
    setPropertyId,
    setCancellationPolicyState,
    selectedRoomDetails,
    setSelectedRoomDetails,
    totalPrice,
    selectedStartDate,
    selectedEndDate,
    setTotalPrice,
    currentStep,
    setCurrentStep,
    selectedRateDataList,
    selectedSetRateDataList,
    rateResponse,
    setRateResponse,
    addOnsresponse,
    setAddOnsResponse,
    promoCodeContext,
    setPromoCodeContext,
    setSelectedStartDate,
    setSelectedEndDate,
    setTermsAndConditions,
    setProperty,
    loggedUserDetails,
    setLoggedUserDetails,
    setIsAddOnns,
    setAddonList,
    keyData,
    isMemberRate,
    setIsMemberRate,
    defaultOffer, setDefaultOffer,
    selectedRooms,isTokenKey, setTokenKey,
        cancellationPolicyPackage,
        setCancellationPolicyPackage,
  } = useBookingEngineContext();

  //const { promoCodeContext, setPromoCodeContext } = useBook();
  const [filters, setFilters] = useState({
    offer: "",
    query: "",
    dateRange: { start: "", end: "", totalPrice: 0 },
    guests: { adults: 1, children: 0, rooms: 1 },
  });
   const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showDownDiv,setShowDownDiv] = useState(true)
  const [promoCode, setPromoCode] = useState("");
  const [destination, setDestination] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [contentProperties, setContentProperties] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const [isClassAddedBook, setIsClassAddedBook] = useState(false);
  const [activeHotel, setActiveHotel] = useState(null);
  const [visibleOfferRoomId, setVisibleOfferRoomId] = useState(null);
  const [selectedRoomOffers, setSelectedRoomOffers] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isHandleSearched, setHandleSearched] = useState(false);
  const [isCloseWizard, setCloseWizard] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();
  //const { isFormOpen, setIsFormOpen } = useForm();
  const [isOpenSignUp, setIsOpenSignUp] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);

  const [isRateFetched, setIsRateFetched] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [propertyDropDown, setPropertyDropDown] = useState([]);
  const [cityDropDown, setCityDropDown] = useState([]);
  const [cityName, setCityName] = useState(null);
  const [selectedHotelName, setSelectedHotelName] = useState([]);
  const [cmsPropertyId, setCMSPropertyId] = useState(null);
  const [isHandleBookNow, setHandleBookNow] = useState(false);
  const [newClassRoom, setNewClassRoom] = useState(false);
//  const filterBarRef = useRef(null);
//  const [packageCancellationPolicy, setPackageCancellationPolicy] = useState([]);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    mobilePrifix: "",
    mobileNo: "",
    emailId: "",
    city: "",
    stateCode: "",
    country: "",
    privacyPolicyAcceptance: "",
    password: "",
    confirmPassword: "",
    promoCode: "",
  });

  const [activeView, setActiveView] = useState("category");
  const [activeCategory, setActiveCategory] = useState("hotel");
  const [galleryCategory, setGalleryCategory] = useState("hotel");
  const [currentSlide, setCurrentSlide] = useState(1);
  const swiperRef = useRef(null);

  const [viewMoreRoom, setViewMoreRoom] = useState(null);
  const [showRoomsModal, setShowRoomsModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryImages, setCategoryImages] = useState([]);
  const [propertyImages, setPropertyImages] = useState([]);

  const [propertyData, setPropertyData] = useState(null);
  const [brandMap, setBrandMap] = useState({});
  const [propertyPageUrl, setpropertyPageUrl] = useState(null);
  const [isLoaderOverlay, setLoaderOverlay] = useState(false);
  
  //const [sessionId, setSessionId] = useState(null);
useEffect(() => {
    if (window.location.hash) {
      router.replace(window.location.pathname); 
      // keeps query params intact if needed
      // router.replace(window.location.pathname + window.location.search);
    }
  }, [router]);
  useEffect(() => {
    function checkScreenSize() {
      setIsSmallScreen(window.innerWidth < 768); // Change 768 to your breakpoint
    }

    // Set initial value
    checkScreenSize();

    // Listen to window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
 // const [defaultOffer, setDefaultOffer] = useState(null);
  const openGallery = (idx, category) => {
    setActiveCategory(idx);
    setGalleryCategory(category);
    setActiveView("gallery");
    setCurrentSlide(1);
  };
  function encodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toISOString().split("T")[0];
  };
  const getDateDifferenceInDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffInMs = endDate - startDate;
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // convert ms to days
  };

  const fromDate = formatDate(selectedStartDate);
  const toDate = formatDate(selectedEndDate);
  //const promoCode = "";
  const numberOfNights = getDateDifferenceInDays(fromDate, toDate);

  useEffect(() => {
    if (openBookingBar) {
      //setLoaderOverlay(true);
      showBookingEngine();
    } else {
      hideBookingEngine();
    }
  }, [openBookingBar]);

   useEffect(() => {
     if (!isLoaderOverlay && hasSearched) {
      // postBookingWidged();
      postBookingWidged("","", false,"rate Fetched");
     } 
   }, [isLoaderOverlay]);
  // useEffect(() => {
  //   if (selectedProperty > 0 && propertyData) {
  //     handleSuggestionClick(propertyData);
  //   }
  // }, [propertyData]);

  const fetchContentApi = async (value) => {
  try{
    
      // const prop = propertyDropDown
      //         .map((item) => item?.value) // get only the value
      //         .filter((v) => v != null) // remove null/undefined
      //         .join(",");
            
            // const timestamp = Date.now().toString();
            // const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
            // const signature = await createSignature(
            //   JSON.stringify(value),
            //   timestamp,
            //   secret
            // );
      
            // const response = await fetch(
            //   "https://cinbe.cinuniverse.com/api/cin-api/content",
            //   {
            //     method: "POST",
            //     headers: {
            //       "Content-Type": "application/json",
            //       "x-timestamp": timestamp,
            //       "x-signature": signature,
            //     },
            //     body: JSON.stringify({ selectedPropertyId: value }),
            //   }
            // );
             const url = `https://clarkscms.cinuniverse.com/staah/rates/GetRoomsRates?RequestType=bedata&PropertyId=${value}&Product=yes&CheckInDate=${fromDate}&CheckOutDate=${toDate}&PromoCode=${promoCodeContext || encodeBase64(defaultOffer)}`;
    
             const response = await fetch(url, {
               method: "GET",
               headers: {
                 "Content-Type": "application/json",
                 "x-api-key": process.env.NEXT_PUBLIC_API_KEY_GETRATE,
               },
             });
           
    if (!response.ok) throw new Error("Failed - Rate not found.");
     const data = await response?.json();
     //setFilteredProperties(data?.PropertyList);
    if(data) {
      setContentProperties(data?.PropertyList);
     }

    //const data = await response.json();
  }catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchGalleryImages = async (property_Id) => {
    try {
      const response = await fetch(
        `https://clarkscms.cinuniverse.com/Api/gallery/GetGalleryByProperty?propertyId=${parseInt(
          property_Id
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      setCategoryImages(res?.data);

      setCategories(Object.keys(res?.data));
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleGetDetailsClick = (rooms) => {
    const INR = "INR";
    const totalAdults = selectedRoom?.reduce(
      (sum, room) => sum + (room?.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room?.children || 0),
      0
    );
    const totalRooms = selectedRoom?.length;

    const hotelName =
      document.querySelector(".hotel-title")?.textContent.trim() ||
      "Unknown Hotel";
    const rackRate =
      document
        .querySelector(".room-price")
        ?.textContent.replace(/[^\d]/g, "") || "0";
    const roomName =
      document.querySelector(".room-name")?.textContent.trim() ||
      "Unknown Room";
    const roomId =
      document.querySelector(".room-id")?.textContent.trim() || "Unknown Room";
    const RateBeforeTax = (() => {
      const ratePlans = rooms?.RatePlans || [];
      let minRate = Infinity;

      ratePlans.forEach((plan) => {
        const firstRateKey = Object.keys(plan?.Rates || {})[0];
        const rate = parseFloat(
          plan?.Rates?.[firstRateKey]?.OBP?.["1"]?.RateBeforeTax || "0"
        );
        if (!isNaN(rate) && rate < minRate) {
          minRate = rate;
        }
      });

      return isFinite(minRate) ? parseInt(minRate) : 0;
    })();
    window.dataLayer = window.dataLayer || [];

    // window.dataLayer.push({
    //   event: 'select_item', // ✅ Triggers GA4 ecommerce + custom dimensions

    //   // GA4 Ecommerce structure
    //   ecommerce: {
    //     items: [{
    //       item_id: rooms.RoomId,              // Room ID
    //       item_name: rooms.RoomName,          // Room Name
    //       item_category: roomName,                 // Static category
    //       price: data,               // Discounted price
    //       currency: 'INR',                       // ISO currency code
    //       item_brand: hotelName               // Hotel name
    //     }]
    //   },

    //   // Custom context (for GA4 custom dimensions)
    //   propertyName: hotelName,
    //   RoomId: rooms.RoomId,
    //   RoomName: rooms.RoomName,
    //   minRate: data,
    //   currency: 'INR',
    //   selectedStartDate: selectedStartDate,
    //   selectedEndDate: selectedEndDate,
    //   totalAdults: totalAdults,
    //   totalChildren: totalChildren,
    //   totalRooms: totalRooms,
    //   promoCode: promoCode || null
    // });
    // window.dataLayer.push({
    //   event: 'select_item',
    //   ecommerce: {
    //     currency: INR,
    //     items: [{
    //       item_id: selectedPropertyId,
    //       item_name: hotelName,              // ✅ Hotel
    //       item_category: rooms.RoomName,  // ✅ Room Name
    //       item_brand: hotelName,
    //       price: RateBeforeTax
    //     }]
    //   },
    //   propertyName: hotelName,
    //   RoomId: rooms.RoomId,
    //   RoomName: rooms.RoomName,
    //   minRate: RateBeforeTax,
    //   selectedStartDate,
    //   selectedEndDate,
    //   totalAdults,
    //   totalChildren,
    //   totalRooms,
    //   promoCode
    // });

    window.dataLayer.push({
      event: "select_item",
      ecommerce: {
        currency: "INR",
        items: [
          {
            item_id: `${selectedPropertyId}_${rooms?.RoomId}_defaultplan`,
            item_name: hotelName,
            item_category: rooms?.RoomName,
            item_variant: "Default Plan",
            item_brand: hotelName,
            price: parseFloat(RateBeforeTax),
          },
        ],
      },
      propertyName: hotelName,
      selectedStartDate,
      selectedEndDate,
      totalAdults,
      totalChildren,
      totalRooms,
      promoCode,
    });
  };
  // const handleBookNowClick = () => {
  //   const totalAdults = selectedRoom?.reduce((sum, room) => sum + (room.adults || 0), 0);
  //   const totalChildren = selectedRoom?.reduce((sum, room) => sum + (room.children || 0), 0);
  //   const totalRooms = selectedRoom?.length;
  //   const hotelName = document.querySelector('.hotel-title')?.textContent.trim() || 'Unknown Hotel';
  //   const rackRate = document.querySelector('.room-price')?.textContent.replace(/[^\d]/g, '') || '0';
  //   //const roomName = document.querySelector('.room-name')?.textContent.trim() || 'Unknown Room';
  //   const roomId = document.querySelector('.room-id')?.textContent.trim() || 'Unknown Room';
  //   window.dataLayer = window.dataLayer || [];

  //   const data = {
  //     propertyName: hotelName,               // From DOM or React state
  //     RackRate: rackRate,                    // Cleaned numeric string
  //     selectedStartDate: selectedStartDate,                    // Check-in date
  //     selectedEndDate: selectedEndDate,                      // Check-out date
  //     totalAdults: totalAdults,                          // Number of adults
  //     totalChildren: totalChildren,                        // Number of children
  //     totalRooms: totalRooms,                           // Number of rooms
  //     promoCode: promoCode                             // Promo code (if any)
  //   };

  //   // Push custom click event
  //   window.dataLayer.push({
  //     event: 'book_now_click',
  //     ...data
  //   });

  //   // Push GA4 view_item ecommerce event
  //   window.dataLayer.push({
  //     event: 'view_item',
  //     ecommerce: {
  //       items: [
  //         {
  //           item_name: hotelName,               // ✅ Hotel name
  //           // item_category: roomName,            // ✅ Room name
  //           item_brand: hotelName,
  //           price: parseFloat(rackRate),
  //           item_id: roomId.toString()                 // Optional: dynamic if needed
  //         }
  //       ]
  //     },
  //     ...data // Include search data here too if you want to pass it
  //   });
  // };
  const handleBookNowClick = () => {
    const INR = "INR";
    const totalAdults = selectedRoom?.reduce(
      (sum, room) => sum + (room?.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room?.children || 0),
      0
    );
    const totalRooms = selectedRoom?.length;
    const hotelName =
      document.querySelector(".hotel-title")?.textContent.trim() ||
      "Unknown Hotel";
    const rackRate =
      document
        .querySelector(".room-price")
        ?.textContent.replace(/[^\d]/g, "") || "0";
    window.dataLayer = window.dataLayer || [];

    const data = {
      propertyName: hotelName,
      HotelId: selectedPropertyId, // ✅ Hotel ID
      RackRate: parseFloat(rackRate),
      selectedStartDate,
      selectedEndDate,
      totalAdults,
      totalChildren,
      totalRooms,
      promoCode,
    };

    // Custom funnel tracking
    window.dataLayer.push({
      event: "book_now_click",
      ...data,
    });

    // GA4 ecommerce - hotel level view_item
    // window.dataLayer.push({
    //   event: 'view_item',
    //   ecommerce: {
    //     currency: INR,
    //     value: parseFloat(rackRate),
    //     items: [{
    //       item_id: selectedPropertyId,        // ✅ Hotel ID
    //       item_name: hotelName,             // ✅ Hotel name
    //       item_brand: hotelName,            // Optional
    //       price: parseFloat(rackRate),
    //       currency: INR,
    //       // No item_category here ✅
    //     }]
    //   },
    //   ...data
    // });

    window.dataLayer.push({
      event: "view_item",
      ecommerce: {
        currency: "INR",
        value: parseFloat(rackRate),
        items: [
          {
            item_id: `${selectedPropertyId}_defaultroom_defaultplan`, // Use fixed strings if no room/rate yet
            item_name: hotelName,
            item_category: "Default Room", // Optional
            item_variant: "Default Plan", // Optional
            item_brand: hotelName,
            price: parseFloat(rackRate),
          },
        ],
      },
      propertyName: hotelName,
      selectedStartDate,
      selectedEndDate,
      totalAdults,
      totalChildren,
      totalRooms,
      promoCode,
    });
  };
  const handleMemberRatePlanSelect = (mapping, rooms) => {
    const INR = "INR";
    const totalAdults = selectedRoom?.reduce(
      (sum, room) => sum + (room?.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room?.children || 0),
      0
    );
    const totalRooms = selectedRoom?.length;

    const hotelName =
      document.querySelector(".hotel-title")?.textContent.trim() ||
      "Unknown Hotel";
    const rackRate =
      document
        .querySelector(".room-price")
        ?.textContent.replace(/[^\d]/g, "") || "0";
    const roomName =
      document.querySelector(".room-name")?.textContent.trim() ||
      "Unknown Room";
    const roomId =
      document.querySelector(".room-id")?.textContent.trim() || "Unknown Room";
    const RName =
      document.querySelector(".rate-name")?.textContent.trim() ||
      "Unknown RateName";
    const RateName = RName;
    const Rate =
      document.querySelector(".member-rate")?.textContent.trim() || "5999";
    const MemberRate = parseInt(Rate.replace("₹", "").trim());
    const packageRate = parseInt(
      rooms?.RatePlans?.find((element) => element.RateId === mapping.RateId)
        ?.Rates?.[Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]]?.OBP?.[
        "1"
      ]?.RateBeforeTax || "0"
    );
    const data = (() => {
      const ratePlans = rooms?.RatePlans || [];
      let minRate = Infinity;

      ratePlans.forEach((plan) => {
        const firstRateKey = Object.keys(plan?.Rates || {})[0];
        const rate = parseFloat(
          plan?.Rates?.[firstRateKey]?.OBP?.["1"]?.RateBeforeTax || "0"
        );
        if (!isNaN(rate) && rate < minRate) {
          minRate = rate;
        }
      });

      return isFinite(minRate) ? parseInt(minRate) : 0;
    })();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: INR,
        value: parseInt(MemberRate),
        items: [
          {
            item_id: selectedPropertyId,
            HotelId: selectedPropertyId,
            item_name: hotelName, // ✅ Hotel
            item_category: rooms?.RoomName, // ✅ Room Name
            item_variant: RateName, // ✅ Rate Plan
            item_brand: hotelName,
            price: parseInt(MemberRate),
          },
        ],
      },
      propertyName: hotelName,
      RateName: RateName,
      RateBeforeTax: parseInt(MemberRate),
      selectedStartDate,
      selectedEndDate,
      totalAdults,
      totalChildren,
      totalRooms,
      promoCode,
    });
    //console.log(window.dataLayer);
  };

  const handleRatePlanSelect = (mapping, rooms) => {
    const INR = "INR";
    const totalAdults = selectedRoom?.reduce(
      (sum, room) => sum + (room?.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room?.children || 0),
      0
    );
    const totalRooms = selectedRoom?.length;

    const hotelName =
      document.querySelector(".hotel-title")?.textContent.trim() ||
      "Unknown Hotel";
    const rackRate =
      document
        .querySelector(".room-price")
        ?.textContent.replace(/[^\d]/g, "") || "0";
    const roomName =
      document.querySelector(".room-name")?.textContent.trim() ||
      "Unknown Room";
    const roomId =
      document.querySelector(".room-id")?.textContent.trim() || "Unknown Room";
    const RName =
      document.querySelector(".rate-name")?.textContent.trim() ||
      "Unknown RateName";
    const RateName = RName;
    const MemberRate =
      document.querySelector(".member-rate")?.textContent.trim() || "5999";
    const cleanedPrice = parseFloat(
      rooms?.RatePlans?.find((element) => element.RateId === mapping.RateId)
        ?.Rates?.[Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]]?.OBP?.[
        "1"
      ]?.RateBeforeTax || "0"
    );
    const data = (() => {
      const ratePlans = rooms?.RatePlans || [];
      let minRate = Infinity;

      ratePlans.forEach((plan) => {
        const firstRateKey = Object.keys(plan?.Rates || {})[0];
        const rate = parseFloat(
          plan?.Rates?.[firstRateKey]?.OBP?.["1"]?.RateBeforeTax || "0"
        );
        if (!isNaN(rate) && rate < minRate) {
          minRate = rate;
        }
      });

      return isFinite(minRate) ? parseInt(minRate) : 0;
    })();
    window.dataLayer = window.dataLayer || [];

    const cleanedRateName = RateName || "Unknown Plan";
    const cleanedItemId = `${selectedPropertyId}_${rooms?.RoomId}_${cleanedRateName}`;
    setTimeout(() => {
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: "INR",
          value: cleanedPrice,
          items: [
            {
              item_id: cleanedItemId,
              item_name: hotelName,
              item_category: rooms?.RoomName,
              item_variant: cleanedRateName,
              item_brand: hotelName,
              price: cleanedPrice,
            },
          ],
        },
        propertyName: hotelName,
        RateName: cleanedRateName,
        RateBeforeTax: cleanedPrice,
        selectedStartDate,
        selectedEndDate,
        totalAdults,
        totalChildren,
        totalRooms,
        promoCode,
      });
    }, 1000);
    //console.log(window.dataLayer);
  };
  const verifyGuidToken = async () => {
    try {
      const respTokenKey = tokenKey;
      const timestamp = Date.now().toString();
      const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
      const signature = await createSignature(
        JSON.stringify(respTokenKey),
        timestamp,
        secret
      );
      const res = await fetch(
        "https://cinbe.cinuniverse.com/api/verify-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-timestamp": timestamp,
            "x-signature": signature,
          },
          body: JSON.stringify({ respTokenKey, keyData }),
        }
      );

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("API call failed:", error); // Will now show in console
    }
  };
  const handleOnEdit = ()=>{
    setShowDropDown(!showDropDown)
    setShowDownDiv(!showDownDiv)
    setFilteredProperties([])
  }

const fetchRatePrices = async (propertyId, defaultOffer) => {
  setLoaderOverlay(true);
  //const cutoffDate = new Date("2025-10-20");

  if (!propertyId) {
    setFilteredProperties([]);
    setLoaderOverlay(false);
    setHasSearched(true);
    return;
  }

  try {
    const timestamp = Date.now().toString();
    const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";

    const signature = await createSignature(
      JSON.stringify(propertyId),
      timestamp,
      secret
    );

    const body = {
      selectedPropertyId: propertyId,
      fromDate,
      toDate,
      promoCodeContext: promoCodeContext || encodeBase64(defaultOffer),
      product: "No",
    };
  //  if(promoCode != "" || new Date(fromDate) > cutoffDate)
    // if(promoCode == "")
    // {
      const response = await fetch("https://cinbe.cinuniverse.com/api/cin-api/rate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-timestamp": timestamp,
        "x-signature": signature,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Failed - Rate not found.");

    const data = await response.json();

    if (defaultOffer && !promoCodeContext) {
      setPromoCodeContext(encodeBase64(defaultOffer));
    }

      const product = Array.isArray(data?.Product) ? data?.Product[0] : null;
      const rooms = product?.Rooms || [];
    const dayRate = rooms?.map((room) => {
          const rateObj =
            Object.values(room?.RatePlans?.[0]?.Rates || {})[0]?.OBP?.["1"] || {};
          return {
            RoomId: room?.RoomId,
            MinInventory: room?.MinInventory ?? 0,
            RestrictionTitle: room?.RestrictionTitle ?? "",
            RateBeforeTax: rateObj?.RateBeforeTax || "0",
            RateAfterTax: rateObj?.RateAfterTax || "0",
            RatePlans: room?.RatePlans || [],
          };
        });

    if (contentProperties?.[0]?.RoomData && dayRate?.length > 0) {
      contentProperties[0].RoomData = contentProperties?.[0]?.RoomData?.map((room) => {
        const matched = dayRate.find((r) => r.RoomId == room?.RoomId);
        setCancellationPolicyPackage(dayRate?.[0]?.RatePlans);
        return {
          ...room,
          RackRate: matched?.RateBeforeTax ? parseFloat(matched?.RateBeforeTax) : room?.RackRate,
          MinInventory: matched?.MinInventory ?? 0,
          RestrictionTitle: matched?.RestrictionTitle ?? "",
          RatePlans: matched?.RatePlans || [],
        };
      });
      if (parseInt(contentProperties?.[0]?.PropertyData?.PropertyId) === parseInt(propertyId)) {
        setFilteredProperties(contentProperties);
        handleBookNow(contentProperties?.[0]?.PropertyData?.PropertyId,
                       contentProperties?.[0]?.PropertyData?.PropertyName,
                       contentProperties?.[0]?.PropertyData?.Address.Phone);
                       fetchAddOns();
                   //    handleGetDetails(contentProperties?.[0]?.RoomData?.[0],contentProperties?.[0]?.PropertyData);
      //   const firstAvailableRoom =
      //  contentProperties?.[0]?.RoomData?.find(room => room.MinInventory > 0);

      // if (firstAvailableRoom) {
      //   handleGetDetails(firstAvailableRoom, contentProperties?.[0]?.PropertyData);
      // }
     // Step 1: Get all rooms with MinInventory > 0
      const availableRooms = contentProperties?.[0]?.RoomData?.filter(
        (room) => room.MinInventory > 0
      );
      
      // Step 2: Find the room with minimum rate
      const roomWithMinRate = availableRooms?.reduce((lowest, current) => {
        // Find current room's first rate plan
        const ratePlan = current?.RatePlans?.[0]; // or use .find if you need matching RateId
        if (!ratePlan) return lowest;
      
        const firstRateKey = Object.keys(ratePlan?.Rates || {})[0];
        const currentRate = parseFloat(
          ratePlan?.Rates?.[firstRateKey]?.OBP?.["1"]?.RateBeforeTax || "0"
        );
      
        if (!lowest) return { room: current, rate: currentRate };
      
        return currentRate < lowest.rate
          ? { room: current, rate: currentRate }
          : lowest;
      }, null);
      
      // Step 3: Use that room in your function
      if (roomWithMinRate?.room) {
        handleGetDetails(roomWithMinRate.room, contentProperties?.[0]?.PropertyData);
      }

      } else {
        setFilteredProperties([]);
      }
    } else {
      setFilteredProperties([]);
    }

    setHasSearched(true);
    setLoaderOverlay(false);
    
    setRateResponse(data?.Product?.[0]);
    setIsRateFetched(true);
  // }
//   else{
//     const url = `https://clarkscms.cinuniverse.com/staah/rates/GetRoomsRates?RequestType=bedata&PropertyId=${selectedPropertyId}&Product=yes&CheckInDate=${fromDate}&CheckOutDate=${toDate}&PromoCode=${promoCodeContext || encodeBase64(defaultOffer)}`;
    
// const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": process.env.NEXT_PUBLIC_API_KEY_GETRATE,
//       },
//     });
//     if (!response.ok) throw new Error("Failed - Rate not found.");

//     const data = await response?.json();
//     if (defaultOffer && !promoCodeContext) {
//       setPromoCodeContext(encodeBase64(defaultOffer));
//     }      
//       const product = Array.isArray(data?.Product) ? data?.Product[0] : null;
//       const rooms = product?.Rooms || [];
//     const dayRate = rooms?.map((room) => {
//           const rateObj =
//             Object.values(room?.RatePlans?.[0]?.Rates || {})[0]?.OBP?.["1"] || {};
//           return {
//             RoomId: room?.RoomId,
//             MinInventory: room?.MinInventory ?? 0,
//             RestrictionTitle: room?.RestrictionTitle ?? "",
//             RateBeforeTax: rateObj?.RateBeforeTax || "0",
//             RateAfterTax: rateObj?.RateAfterTax || "0",
//             RatePlans: room?.RatePlans || [],
//           };
//         });

//     if (data?.PropertyList?.[0]?.RoomData && dayRate.length > 0) {
//       data.PropertyList[0].RoomData = data?.PropertyList?.[0]?.RoomData?.map((room) => {
        
//         setCancellationPolicyPackage(dayRate?.[0]?.RatePlans);
//         const matched = dayRate.find((r) => r.RoomId == room?.RoomId);
//         return {
//           ...room,
//           RackRate: matched?.RateBeforeTax ? parseFloat(matched.RateBeforeTax) : room?.RackRate,
//           MinInventory: matched?.MinInventory ?? 0,
//           RestrictionTitle: matched?.RestrictionTitle ?? "",
//           RatePlans: matched?.RatePlans || [],
//         };
//       });
//       if (parseInt(data?.PropertyList?.[0]?.PropertyData?.PropertyId) === parseInt(propertyId)) {
//         setFilteredProperties(data?.PropertyList);
//         handleBookNow(data?.PropertyList?.[0]?.PropertyData?.PropertyId,
//                        data?.PropertyList?.[0]?.PropertyData?.PropertyName,
//                        data?.PropertyList?.[0]?.PropertyData?.Address.Phone);
//         //handleGetDetails(data?.PropertyList?.[0]?.RoomData?.[0],data?.PropertyList?.[0]?.PropertyData);
//       } else {
//         setFilteredProperties([]);
//       }
//     } else {
//       setFilteredProperties([]);
//     }

//     setHasSearched(true);
//     setLoaderOverlay(false);
    
//     // setRateResponse(data?.Product);
//     setRateResponse(data?.Product?.[0]);
//     setIsRateFetched(true);
//   }
    //postBookingWidged();

  } catch (error) {
    console.error("Error fetching prices:", error);
    setFilteredProperties([]);
    setHasSearched(true);
    setIsRateFetched(true);
    setLoaderOverlay(false);
  }
};

  useEffect(() => {
    const storedData = sessionStorage?.getItem("paymentResponse");
    if (storedData) {
       setCurrentStep(4);
      //setCurrentStep(2);
      setIsWizardVisible(true);
    }
    if (!storedData) {
      sessionStorage?.removeItem("bookingData");
    }
    if (Array.isArray(contentData?.PropertyList)) {
      setPropertyList(contentData?.PropertyList);
    }

    fetch("https://clarkscms.cinuniverse.com/Api/property/GetBrandList")
      .then((res) => res.json())
      .then((data) => {
        if (data.errorCode === "0") {
          const map = {};
          data.data.forEach((brand) => {
            map[brand.hotelBrandId] = brand.hotelBrand
              .toLowerCase()
              .replace(/\s+/g, "-");
          });
          setBrandMap(map);
        }
      })
      .catch((err) => console.error("Error fetching brands:", err));

  }, []);

  useEffect(() => {
    if (tokenKey) {
      setTokenKey(true);
      async function fetchData() {
        const paymentResponse = await verifyGuidToken();
        
        sessionStorage.setItem(
          "paymentResponse",
          JSON.stringify(paymentResponse)
        );
        setIsWizardVisible(true);
         setCurrentStep(4);
      //setCurrentStep(2);
      }
      fetchData();
    }
  }, [tokenKey]);

  useEffect(() => {
    if (selectedProperty > 0 && destination !== "") {
      handleSearch();
      if (roomDetails?.staahRoomsId > 0) {
       let matchingRoom = null;
        for (const property of propertyList) {
          for (const room of property?.RoomData) {
            if (room?.RoomId == roomDetails?.staahRoomsId) {
              matchingRoom = room;
              break; // exit inner loop
            }
          }
          if (matchingRoom) break; // exit outer loop
        }

        const formatingDate = (date) => {
          const d = new Date(date); // ensure it's a Date object
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const currentDate = formatingDate(today); // today's date
        const nextDate = formatingDate(tomorrow);
        setSelectedStartDate(currentDate);
        setSelectedEndDate(nextDate);
        if(hasSearched)
          {
            handleGetDetails(matchingRoom, propertyList?.[0]?.PropertyData);
          }
        
      }
    }
  }, [destination,selectedStartDate, selectedEndDate]);

  useEffect(() => {
    if (selectedProperty > 0) {
      showBookingEngine();
      setCityName(cityDetails);
    }
  }, [selectedProperty]);

  useEffect(() => {
    if (selectedRoomDetails?.isPropertyVisible == false) {
      setVisibleOfferRoomId(null);
    }
  }, [selectedRoomDetails?.isPropertyVisible]);

  useEffect(() => {
    if (
      destination.trim() &&
      selectedRoom?.length > 0 &&
      selectedRoom?.[0]?.roomId != ""
    ) {
      handleDateChange(selectedStartDate, selectedEndDate, 0);
    }
  }, [selectedStartDate, selectedEndDate]);

  const fetchAddOns = async () => {
      try {
        if (selectedPropertyId != null) {
          const timestamp = Date.now().toString();
          const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
          const signature = await createSignature(
            selectedPropertyId?.toString(),
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
                selectedPropertyId: selectedPropertyId?.toString(),
              }),
            }
          );

          if (!response.ok) {
            throw new Error("failed - Add-Ons not found");
          }
          const data = await response?.json();
          setAddOnsResponse(data);
          const properties = data;
          if (Array.isArray(properties)) {
            setAddonList(properties?.[0]?.ExtrasData || []);
            if (properties?.[0]?.ExtrasData?.length > 0) {
              setIsAddOnns(true);
            }
          }
          //  else {
          //   console.error("Invalid Property:", properties);
          // }
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
  function handleBlur() {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  }

  const handleFocus = () => {
    setIsFocused(true);
    const inputEl = inputRef?.current;
    if (inputEl) {
      const rect = inputEl?.getBoundingClientRect();
      const spaceBelow = window?.innerHeight - rect.bottom;
      const spaceAbove = rect?.top;

      // Set dropUp if not enough space below and more space above
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setDropUp(true);
      } else {
        setDropUp(false);
      }
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (cityName?.value) {
          const response = await fetch(
            `https://clarkscms.cinuniverse.com/Api/property/GetCityWithProperty?CityId=${parseInt(
              cityName?.value
            )}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const res = await response.json();
          // setProperties(data);
          // setSelectedProperty("");

          const propertyDropDown = [];

          res?.data?.[0]?.propertyData?.forEach((property) => {
            const label = property?.propertyName;
            const offerCode = property?.offerCode;
            const value = property?.staahPropertyId;
            const property_Id = property?.propertyId;
            const hotelBrandId = property?.hotelBrandId;
            const propertySlug = property?.propertySlug;
            const propData = {
              label,
              value,
              offerCode,
              property_Id,
              hotelBrandId,
              propertySlug,
            };
            propertyDropDown.push(propData);
            setPropertyDropDown(propertyDropDown);
            if (parseInt(value) == parseInt(cityName?.property_Id)) {
              setPropertyData(propData);
            }
          });
          const firstList = {
              label:res?.data?.[0]?.propertyData?.[0]?.propertyName,
              value:res?.data?.[0]?.propertyData?.[0]?.staahPropertyId,
              offerCode:res?.data?.[0]?.propertyData?.[0]?.offerCode,
              property_Id:res?.data?.[0]?.propertyData?.[0]?.propertyId,
              hotelBrandId:res?.data?.[0]?.propertyData?.[0]?.hotelBrandId,
              propertySlug:res?.data?.[0]?.propertyData?.[0]?.propertySlug,
            }
            // if(parseInt(selectedProperty) == 0)
            // {
            //   handleSuggestionClick(firstList);
            // }
            
              // setTimeout(() => {
              //   handleSuggestionClick(firstList);
              // }, 200);
              handleSuggestionClick(firstList);
         // fetchContentData(propertyDropDown);
        } else {
          setPropertyDropDown([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperty();
  }, [cityName]);

 async function postBookingWidged(rooms,mapping, isClose,ctaName) {
  const resp = await getUserInfo();
  
    const sessionId = sessionStorage?.getItem("sessionId");
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
    const data = window.location.pathname;
    //console.log("data pathname",data)
    const payload = {
    ctaName: ctaName,
    urls: window.location.href,
    cityId: parseInt(cityName?.value),
    propertyId: parseInt(selectedPropertyId),
    checkIn: fromDate,
    checkOut: toDate,
    adults: totalAdults,
    children: totalChildren,
    rooms: totalRooms,
    promoCode: promoCode,
    ip: resp?.ip,
    sessionId: sessionId,
    deviceName: resp?.deviceInfo?.deviceName,
    deviceType: resp?.deviceInfo?.deviceOS == "Unknown" ? resp?.deviceInfo?.platform : resp?.deviceInfo?.deviceOS,
    roomsName: rooms?.RoomName,
    packageName: mapping?.MappingName,
    isCartOpen: mapping?.MappingName ? "Y": "N",
    isCartEdit: "N",
    isCartClick: "N",
    isClose: isClose ? "Y" : "N",
   }
      const response = await fetch(
        "https://clarkscms.cinuniverse.com/Api/tracker/BookingWidged",
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
  // Handle destination input change
  const handleCityChange = async (e) => {
    const input = e.target.value;
    // setIsFocused(true);
    // setDestination(input);
    setCityName(input);

    if (input) {
      try {
        const response = await fetch(
          `https://clarkscms.cinuniverse.com/Api/property/GetCityWithProperty?CityId=${parseInt(
            input
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const res = await response.json();

        const propertyDropDown = [];

        res?.data?.propertyData?.forEach((property) => {
          const label = property?.propertyName;
          const value = property?.staahPropertyId;
          const property_Id = property?.propertyId;
          propertyDropDown.push({ label, value, property_Id });

        });
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };
  // Handle destination input change
  const handleDestinationChange = async (e) => {
    const input = e.target.value;
    setIsFocused(true);
    setDestination(input);

    if (input) {
      try {
        const matchedSuggestions = propertyList
          .flatMap((property) => [
            {
              name: property?.PropertyData.Address.City,
              id: property?.PropertyData.PropertyId,
            },
            {
              name: property?.PropertyData.PropertyName,
              id: property?.PropertyData.PropertyId,
            },
          ])
          .filter((item) =>
            item.name.toLowerCase().includes(input.toLowerCase())
          );
        setSuggestions([...new Set(matchedSuggestions)]);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };
  const handlePromocodeChange = (e) => {
    setPromoCode(e.target.value);
    const encoded = encodeBase64(e.target.value);
    setPromoCodeContext(encoded);
  };
  // Handle search
  const handleSearch = () => {
    router.replace("#Search");
    if(!showDropDown){
      setShowDropDown(true);
    }
    if(showDownDiv){
      setShowDownDiv(false);
    }
    const userDetails = JSON.parse(localStorage?.getItem("userDetails"));
    if (userDetails) {
      setIsLoggedin(true);
      setIsOpenLogin(false);
      setIsOpenSignUp(false);
      setUserDetails(userDetails);

      setLoggedUserDetails({
        customerId: userDetails?.customerId || "",
        membershipId: userDetails?.membershipId || "",
        memberTitle: userDetails?.memberTitle || "",
        firstName: userDetails?.firstName || "",
        lastName: userDetails?.lastName || "",
        mobilePrefix: userDetails?.mobilePrefix || "",
        mobileNumber: userDetails?.mobileNumber || "",
        email: userDetails?.email || "",
        isLogged: true,
      });
    }
    // else {
    //   fetchRatePrices(selectedPropertyId);
    // }
    //  if(contentProperties?.length >= 0){
     
    //      fetchRatePrices(selectedPropertyId,defaultOffer);
    //  }
    // if(selectedProperty == 0){
    //   fetchRatePrices(selectedPropertyId,defaultOffer);
    // }
    
      fetchRatePrices(selectedPropertyId,defaultOffer);
    // const searchTerm = propertyName?.toLowerCase();
    // if (!searchTerm && !destination.trim()) {
    if (!destination?.trim()) {
      toast.error("Please enter a city/hotel.");
      return;
    } else if (selectedStartDate == "" || selectedEndDate == "") {
      toast.error("Please choose check-in and check-out both date.");
      return;
    }
    setIsClassAddedBook(true);
    if (propertyList?.length > 0) {
      setHandleSearched(true);
      setTimeout(() => {
        const element = document.getElementById(`property-div`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        //const data = postBookingWidged();
       // console.log("data12",data);
      }, 100);
      ///setHandleSearched(false);
    }
    setTimeout(() => {
        const data = postBookingWidged("","",false,"Search Click");
        //console.log("data12",data);
      }, 100);
  };

  function handleVisitHotel(url) {
    const currentUrl = window.location.href;
    if (currentUrl == url) {
      window.location.reload();
    } else {
      window.location.href = url;
    }
  }
  const handleBookNow = (PropertyId, PropertyName, Phone) => {
    setHandleBookNow(!isHandleBookNow);
   if(!newClassRoom) {
      setNewClassRoom(newClassRoom);
    }
    setSelectedPropertyPhone(Phone);
    //setSelectedPropertyId(propertyId);
    if (PropertyName != "") {
      setSelectedPropertyName(PropertyName);
      handleBookNowClick();
    }
    toggleBookNow(PropertyId);
    setTimeout(() => {
      const element = document.getElementById(`hotel-${PropertyId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  const calculateNumberOfDays = () => {
    if (!selectedStartDate || !selectedEndDate) return 1;
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateBasePrice = () => {
    const numberOfDays = calculateNumberOfDays();

    // Sum all selectedRoom's roomRate
    const totalRoomRate = selectedRoom?.reduce(
      (sum, room) => sum + (room?.roomRate || 0),
      0
    );

    return totalRoomRate * numberOfDays;
  };

  const calculateTotalWithTax = () => {
    const basePrice = calculateBasePrice();
    const taxRate = basePrice >= 7000 ? 0.18 : 0.12;
    const taxAmount = basePrice * taxRate;
    return basePrice + taxAmount;
  };

  const finalAmount = calculateTotalWithTax();
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    //setHasSearched(false);
    fetchContentApi(suggestion.value);
    setSelectedPropertyId(suggestion.value);
    setDefaultOffer(suggestion.offerCode); 
    setCMSPropertyId(suggestion.property_Id);
    setDestination(suggestion.label);
    setSelectedHotelName(suggestion.label); 
    // fetchRatePrices(suggestion.value);
    setSuggestions([]);
    fetchGalleryImages(suggestion.property_Id);
    const brandSlug = brandMap[suggestion.hotelBrandId] || "brand";
    const propertySlug = suggestion.propertySlug || "property";
    const url = `/${brandSlug}/${propertySlug}/hotel-overview`;
    setpropertyPageUrl(url);
  };
  const handleGetDetails = (rooms, propertyData) => {
    
    router.replace("#select-room");
    setHandleBookNow(!isHandleBookNow);
    fetchAddOns();
    //postBookingWidged(rooms);
    postBookingWidged(rooms,"",false,"Select Room");
    const roomId = rooms?.RoomId;
    const data = removeHtmlTags(propertyData?.TermsAndConditions?.Description);
    setTermsAndConditions(data);
    setProperty(propertyData);
    const roomCount = selectedRoom.filter(
      (room) => room?.roomId === roomId
    ).length;

    if (roomCount > rooms?.MinInventory) {
      if (rooms?.MinInventory == 0) {
        //alert(`This room is not available for selected date`);
        toast.error("This room is not available for selected date.");
      } else {
        toast.error(
          `Only ${rooms?.MinInventory} room(s) allowed for ${rooms?.RoomName}`
        );
      }
      return; // Block further selection
    }

    handleGetDetailsClick(rooms);
    setVisibleOfferRoomId((prev) => (prev === roomId ? null : roomId));
    setSelectedRoomDetails({
      isPropertyVisible: true,
      id: selectedRoomDetails?.id,
    });

    if (selectedRoomDetails?.id) {
      setSelectedRoom((prev) => {
        const updatedRooms = prev.map((room) => {
          if (room?.id === selectedRoomDetails?.id) {
            if (room?.adults + room?.children <= rooms?.MaxGuest) {
              return {
                ...room,
                roomId: roomId,
                maxGuest: rooms?.MaxGuest,
                maxAdult: rooms?.MaxAdult,
                maxChildren: rooms?.MaxChildren,
                roomName: rooms?.RoomName,
                roomRate: rooms?.RackRate,
                roomImage: rooms?.Images[0],
              };
            } else {
              toast.error(
                `Only ${rooms?.MaxGuest} guests including adults and Children are allowed for this room`
              );
            }
          }
          return room;
        });

        return updatedRooms;
      });
    } else {
      // If no id, replace only the first record and keep the rest unchanged
      setSelectedRoom((prev) => {
        if (prev.length > 0) {
          if (prev[0]?.children + prev[0]?.adults <= rooms?.MaxGuest) {
            const first = prev[0];
            return [
              {
                id: first?.id,
                roomId: roomId,
                maxGuest: rooms?.MaxGuest,
                maxAdult: rooms?.MaxAdult,
                maxChildren: rooms?.MaxChildren,
                roomName: rooms?.RoomName,
                roomRate: rooms?.RackRate,
                roomImage: rooms?.Images[0],
                adults: first?.adults,
                children: first?.children,
              },
              ...prev.slice(1),
            ];
          } else {
            toast.error(
              `Only ${rooms?.MaxGuest} guests including adults and Children are allowed for this room`
            );
            return [
              {
                ...prev[0],
              },
              ...prev.slice(1),
            ];
          }
        } else {
          return [
            {
              roomId: roomId,
              roomName: rooms?.RoomName,
              roomRate: rooms?.RackRate,
              roomImage: rooms?.Images[0],
              adults: 1,
              children: 0,
              extraAdultRate: rooms?.ExtraAdultRate,
            },
          ];
        }
      });
    }

    setSelectedRoomRate({ roomId: roomId, roomRate: rooms?.RackRate });

function getScrollableParent(element) {
  let parent = element.parentElement;
  while (parent) {
    const hasScrollableContent = parent.scrollHeight > parent.clientHeight;
    const overflowY = window.getComputedStyle(parent).overflowY;
    const isScrollable = hasScrollableContent && (overflowY === 'auto' || overflowY === 'scroll');
    if (isScrollable) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return window; // fallback
}

setTimeout(() => {
  const el = document?.getElementById(`offer-${roomId}`);
  if (el) {
    const parent = getScrollableParent(el);
    const elRect = el?.getBoundingClientRect();
    const parentRect = parent?.getBoundingClientRect();

    const offset = elRect?.top - parentRect?.top;

    parent.scrollTo({
      top: parent?.scrollTop + offset - 200, // adjust offset if needed
      behavior: "smooth",
    });
  }
}, 100);


  };

  const handleSelectMemberRate = (
    mapping,
    rate,
    rooms,
    packageRate,
    adultRate
  ) => {
    if (!isLoggedin) {
      setIsOpenLogin(true);
    } else {
      if (!rooms?.RestrictionTitle && rooms?.RestrictionTitle == "") {
        setIsMemberRate(true);
        SelectedRoomWithOffer(mapping);
        if (selectedRoomDetails?.id) {
          const roomCount = selectedRoom.filter(
            (room) => room?.roomId === rooms?.RoomId
          ).length;
          if (roomCount <= rooms?.MinInventory) {
            setSelectedRoom((prev) =>
              prev.map((room, index) =>
                room?.id === selectedRoomDetails?.id &&
                room?.adults <= room?.maxAdult &&
                parseInt(room?.adults) + parseInt(room?.children) <= room?.maxGuest
                  ? {
                      ...room,
                      roomPackage: rate.RateName,
                      rateId: rate.RateId,
                      applicableGuest: mapping.ApplicableGuest,
                      applicableAdult: mapping.ApplicableAdult,
                      applicableChild: mapping?.ApplicableChild
                        ? mapping?.ApplicableChild
                        : 0,

                      packageRate:
                        (parseFloat(
                          rooms?.RatePlans?.find(
                            (element) => element.RateId === mapping.RateId
                          )?.Rates?.[
                            Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                          ]?.OBP?.[prev[index]?.adults?.toString()]
                            ?.RateBeforeTax
                        ) || 0) * 0.9,

                      roomRateWithTax:
                        Math.round(packageRate) +
                        Math.round(
                          Math.round(packageRate) *
                            (Math.round(packageRate) <= 7500 ? 1.2 : 1.8)
                        ),
                      roomAdultExtraCharge:
                        Math.round(
                          rooms?.RatePlans?.find(
                            (element) => element.RateId === mapping.RateId
                          )?.Rates?.[
                            Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                          ]?.OBP?.[prev[index]?.adults?.toString()]
                            ?.RateAfterTax || "0"
                        ) -
                        Math.round(
                          rooms?.RatePlans?.find(
                            (element) => element.RateId === mapping.RateId
                          )?.Rates?.[
                            Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                          ]?.OBP?.[prev["1"]]?.RateAfterTax || "0"
                        ),
                    }
                  : room
              )
            );
          } else {
            setSelectedRoom((prev) => {
              if (prev.length === 0) return prev; // nothing to reset

              const updated = [...prev];
              const lastIndex = updated.length - 1;
              const lastRoom = updated[lastIndex];

              updated[lastIndex] = {
                id: lastRoom.id,
                roomId: "",
                roomName: "",
                roomRate: "",
                roomImage: {},
                adults: 1,
                children: 0,
              };

              return updated;
            });

            toast.error(
              `Only ${rooms?.MinInventory} room(s) allowed for ${rooms?.RoomName}`
            );
          }
        } else {
          // If no id, replace only the first record and keep the rest unchanged
          setSelectedRoom((prev) => {
            if (prev.length > 0) {
              const pacRate = rooms?.RatePlans?.find(
                (element) => element.RateId === mapping.RateId
              )?.Rates?.[Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]]
                ?.OBP;
              const pacRatess =
                parseFloat(
                  pacRate?.[prev[0]?.adults.toString()]?.RateBeforeTax || "0"
                ) * 0.9;
              return [
                {
                  ...prev[0],
                  roomPackage: rate.RateName,
                  rateId: rate.RateId,
                  applicableGuest: mapping.ApplicableGuest,
                  applicableAdult: mapping.ApplicableAdult,
                  applicableChild: mapping?.ApplicableChild
                    ? mapping?.ApplicableChild
                    : 0,
                  adultExRate:
                    parseFloat(
                      pacRate?.[prev[0]?.adults.toString()]?.RateAfterTax || "0"
                    ) - parseFloat(pacRate?.[0]?.RateAfterTax || "0"),
                  packageRate: pacRatess,
                },
                ...prev.slice(1),
              ];
            } else {
              return [{ roomPackage: rate.RateName }];
            }
          });
        }
        if (finalAmount !== 0 && finalAmount !== null && !isNaN(finalAmount)) {
          setTotalPrice(finalAmount);
        }
      } else {
        toast.error(rooms?.RestrictionTitle);
      }
    }
    // if (!rooms.RestrictionTitle && rooms.RestrictionTitle == "") {
    //   handleMemberRatePlanSelect(mapping, rooms);
    // }
  };

  const handleSelectRoom = (mapping, rate, rooms, packageRate, adultRate) => {
    
    router.replace("#select-package");
    if (!rooms?.RestrictionTitle && rooms?.RestrictionTitle == "") {
      setIsMemberRate(false);
      handleRatePlanSelect(mapping, rooms);
      SelectedRoomWithOffer(mapping);
      postBookingWidged(rooms,mapping, false,"Select Package And Cart Open");
      if (selectedRoomDetails?.id) {
        const roomCount = selectedRoom.filter(
          (room) => room?.roomId === rooms?.RoomId
        ).length;
        if (roomCount <= rooms?.MinInventory) {
          setSelectedRoom((prev) =>
            prev.map((room, index) =>
              room?.id === selectedRoomDetails?.id &&
              room?.adults <= room?.maxAdult &&
              parseInt(room?.adults) + parseInt(room?.children) <= room?.maxGuest
                ? {
                    ...room,
                    roomPackage: rate.RateName,
                    rateId: rate.RateId,
                    applicableGuest: mapping.ApplicableGuest,
                    applicableAdult: mapping.ApplicableAdult,
                    applicableChild: mapping?.ApplicableChild
                      ? mapping?.ApplicableChild
                      : 0,
                    roomRateWithTax: Math.round(
                      rooms?.RatePlans?.find(
                        (element) => element.RateId === mapping.RateId
                      )?.Rates?.[
                        Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                      ]?.OBP?.[prev[index]?.adults?.toString()]?.RateAfterTax ||
                        "0"
                    ),
                    packageRate:
                      rooms?.RatePlans?.find(
                        (element) => element.RateId === mapping.RateId
                      )?.Rates?.[
                        Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                      ]?.OBP?.[prev[index]?.adults?.toString()]
                        ?.RateBeforeTax || "0",
                    roomAdultExtraCharge:
                      Math.round(
                        rooms?.RatePlans?.find(
                          (element) => element.RateId === mapping.RateId
                        )?.Rates?.[
                          Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                        ]?.OBP?.[prev[index]?.adults?.toString()]
                          ?.RateAfterTax || "0"
                      ) -
                      Math.round(
                        rooms?.RatePlans?.find(
                          (element) => element.RateId === mapping.RateId
                        )?.Rates?.[
                          Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                        ]?.OBP?.[prev["1"]]?.RateAfterTax || "0"
                      ),
                  }
                : room
            )
          );
        } else {
          setSelectedRoom((prev) => {
            if (prev.length === 0) return prev; // nothing to reset

            const updated = [...prev];
            const lastIndex = updated.length - 1;
            const lastRoom = updated[lastIndex];

            updated[lastIndex] = {
              id: lastRoom.id,
              roomId: "",
              roomName: "",
              roomRate: "",
              roomImage: {},
              adults: 1,
              children: 0,
            };

            return updated;
          });

          toast.error(
            `Only ${rooms?.MinInventory} room(s) allowed for ${rooms?.RoomName}`
          );
        }
      } else {
        // If no id, replace only the first record and keep the rest unchanged
        setSelectedRoom((prev) => {
          if (prev.length > 0) {
            const pacRate = rooms?.RatePlans?.find(
              (element) => element.RateId === mapping.RateId
            )?.Rates?.[Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]]?.OBP;
            return [
              {
                ...prev[0],
                roomPackage: rate.RateName,
                rateId: rate.RateId,
                applicableGuest: mapping.ApplicableGuest,
                applicableAdult: mapping.ApplicableAdult,
                applicableChild: mapping?.ApplicableChild
                  ? mapping?.ApplicableChild
                  : 0,
                adultExRate:
                  parseFloat(
                    pacRate?.[prev[0]?.adults.toString()]?.RateAfterTax || "0"
                  ) - parseFloat(pacRate?.[0]?.RateAfterTax || "0"),
                packageRate: parseFloat(
                  pacRate?.[prev[0]?.adults.toString()]?.RateBeforeTax || "0"
                ),
              },
              ...prev.slice(1),
            ];
          } else {
            return [{ roomPackage: rate.RateName }];
          }
        });
      }
      if (finalAmount !== 0 && finalAmount !== null && !isNaN(finalAmount)) {
        setTotalPrice(finalAmount);
      }
    } else {
      toast.error(rooms?.RestrictionTitle);
    }
  };
  const handleDateChange = (startDate, endDate, totalPrice) => {
    if (startDate != "" && endDate != "") {
      setFilters({
        ...filters,
        dateRange: { start: startDate, end: endDate, totalPrice },
      });
    } else {
      toast.error("Please choose check-in and check-out both date.");
    }
  };

  const handleRoomChange = (adults, children, roomCount) => {
    setFilters((prev) => ({
      ...prev,
      guests: { adults, children, rooms: roomCount },
    }));
  };

  const showBookingEngine = () => {
    const cityData = JSON.parse(
      sessionStorage?.getItem("cityDropDown") || "[]"
    );
    setCityDropDown(cityData);
    
    const formatingDate = (date) => {
      const d = new Date(date); // ensure it's a Date object
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // if (!rangeStart && !rangeEnd) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const currentDate = formatingDate(today); // today's date
    const nextDate = formatingDate(tomorrow);
    setSelectedStartDate(currentDate);
    setSelectedEndDate(nextDate);

    setTimeout(() => {
      const element = document.getElementById(`filter-bar-search`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    setIsVisible(true);
  };

  const hideBookingEngine = () => {
    setIsVisible(false);
    onClose();
    
    postBookingWidged("","", true,"Widget Closed");
  };

  const toggleBookNow = (id) => {
    setActiveHotel(id);
    
    // if(!activeHotel){
    //   setActiveHotel((prev) => (prev === id ? null : id));
    // }
  };

  const toggleAmenitiesPopup = () => {
    setShowAllAmenities(!showAllAmenities);
  };

  const removeHtmlTags = (htmlString) => {
    return htmlString?.replace(/\n|\t/g, "")
      .replace(/<\/?ul>/g, "")
      .replace(/<br\s*\/?>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/<span[^>]*>/g, "") // remove opening <span> with any attributes
      .replace(/<\/span>/g, "") // remove closing </span>
      .replace(/<strong[^>]*>/g, "") // remove opening <strong> with any attributes
      .replace(/<\/strong>/g, "") // remove closing </strong>
      .replace(/<style[^>]*>/g, "") // remove opening <style> with any attributes
      .replace(/<\/style>/g, "") // remove closing </style>
      .replace(/<font[^>]*>/g, "") // remove opening <font> with any attributes
      .replace(/<\/font>/g, "") // remove closing </font>
      .replace(/<p[^>]*>/g, "") // remove opening <p> with any attributes
      .replace(/<\/p>/g, "") // remove closing </p>
      .replace(/<b[^>]*>/g, "") // remove opening <b> with any attributes
      .replace(/<\/b>/g, ""); // remove closing </b>
  };

  const [isWizardVisible, setIsWizardVisible] = useState(false);

  const toggleWizard = () => {
    setIsWizardVisible(!isWizardVisible);
  };

  const handleWizardClose = () => {
    setIsWizardVisible(false);
    if (tokenKey) {
      status();
    }
    //window.location.href = '/';
  };
  const status = () => {
    //window.location.reload();
    window.location.href = "/";
  };
  const SelectedRoomWithOffer = (mapping) => {
    if (!mapping || !mapping.CancellationPolicy) {
      console.error("Mapping is undefined or missing CancellationPolicy");
      return;
    }

    setCancellationPolicyState(mapping.CancellationPolicy);
    toggleWizard();
    setIsVisible(true);
  };

  const handleSignUpSubmit = async (dataSignUp) => {
    if (dataSignUp.errorCode == "0") {
      alert("Registered Successfully");

      const user = dataSignUp.result[0];

      setUserDetails(user);

      setLoggedUserDetails({
        customerId: user?.customerId || "",
        membershipId: user?.membershipId || "",
        memberTitle: user?.memberTitle || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        mobilePrefix: user?.mobilePrefix || "",
        mobileNumber: user?.mobileNumber || "",
        email: user?.email || "",
        isLogged: true,
      });

      // setHandleSearched(true);
      setIsLoggedin(true);
      setIsOpenLogin(false);
      setIsOpenSignUp(false);
      //fetchRatePrices(selectedPropertyId, true);

      localStorage.setItem("userDetails", JSON.stringify(user));
    }
  };

  const handleLoginSubmit = async (dataLogin) => {
    if (dataLogin.errorCode == "0") {
      alert("Login Successfully");

      const user = dataLogin.result[0];
      setUserDetails(user);
      setLoggedUserDetails({
        customerId: user?.customerId || "",
        membershipId: user?.membershipId || "",
        memberTitle: user?.memberTitle || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        mobilePrefix: user?.mobilePrefix || "",
        mobileNumber: user?.mobileNumber || "",
        email: user?.email || "",
        isLogged: true,
      });

      // setHandleSearched(true);
      setIsLoggedin(true);
      setIsOpenLogin(false);
      // fetchRatePrices(selectedPropertyId, true);
      localStorage.setItem("userDetails", JSON.stringify(user));
    } else if (dataLogin.errorCode == "SignUp") {
      setIsOpenLogin(false);
      setIsOpenSignUp(true);
    } else {
      alert("Something went wrong try again");
    }
  };

  function stripHtml(html) {
    if (!html) return "";
    const entityMap = {
      "&rsquo;": "'",
      "&lsquo;": "'",
      "&rdquo;": '"',
      "&ldquo;": '"',
      "&mdash;": "—",
      "&ndash;": "–",
      "&nbsp;": " ",
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
    };
    let decoded = html.replace(
      /&[a-zA-Z0-9#]+;/g,
      (match) => entityMap[match] || ""
    );
    decoded = decoded.replace(/<[^>]+>/g, "");
    decoded = decoded.replace(/['’“”—]/g, " ");
    return decoded.replace(/\s+/g, " ").trim();
  }
  const images = [
    "/booking-engine-imgs/images/mountain-view.jpg",
    "/booking-engine-imgs/images/offer-pp.jpg",
  ];
  const handleReadMore = (room) => {
    setViewMoreRoom(room);
    setShowRoomsModal(true);
  };

  useEffect(() => {
    if (showRoomsModal) {
      const modalEl = document.getElementById("RoomPopupModal");
      if (modalEl) {
        import("bootstrap/dist/js/bootstrap.bundle.min.js").then(
          ({ Modal }) => {
            const modal = new Modal(modalEl);
            modal.show();

            modalEl.addEventListener(
              "hidden.bs.modal",
              () => {
                setShowRoomsModal(false);
                setViewMoreRoom(null);
              },
              { once: true }
            );
          }
        );
      }
    }
  }, [showRoomsModal]);
  
  //  useEffect(() => {
  //    if (contentProperties?.length > 0 && selectedProperty > 0) {
  //      fetchRatePrices(selectedPropertyId,defaultOffer);
  //    }
  //  }, [contentProperties]);
  
  // useEffect(() => {
  //   if (contentProperties?.length > 0 && hasSearched) {
  //     fetchRatePrices(selectedPropertyId,defaultOffer);
  //   }
  // }, [hasSearched]);
  return (
    <>
      <section
        className={`booking-form-wrapper toggle-div ${
          isVisible ? "visible" : "hidden"
        } ${newClassRoom ? "booking-widget-set" : ""}`}
        
      >
        {/* <section id="filter-bar-search" className={`booking-form-wrapper toggle-div ${isVisible ? "visible" : "hidden"}`}> */}

        <div
          id="booking-bar"
          className={`booking-bar ${isClassAddedBook && !isSmallScreen ? "fullscreen" : ""}`}
        >
          {isVisible && (
            <div className="hide-booking-engine">
              {isSmallScreen && hasSearched && <button className="bg-black text-white w-50 ms-3 p-2 text-center mb-1" onClick={handleOnEdit}>
                EDIT
              </button>}
              {isSmallScreen && <span className="mt-3 pt-1 ps-2" onClick={hideBookingEngine}>CLOSE &nbsp; </span>}
              {/* <FontAwesomeIcon icon={faXmark} /> */}
              {!isSmallScreen && <span onClick={hideBookingEngine}>CLOSE &nbsp;</span>}
            </div>
          )}
          {(showDownDiv || !isSmallScreen) && (<div className="booking-bar-form">
            {/* <div className="row">
                <div className="col text-right">
                    <button className="bg-black text-white w-25 p-2 mt-2 mr-2" onClick={handleOnEdit}>EDIT</button>
                  </div>
                </div> */}
            
          {/* </div> */}
          
            {/* {selectedProperty == 0 && (
                <> */}


            <div className={`col-3 main-bx-field filter-item position-relative ${isSmallScreen? "m-7":""}`}>
              <Select
                options={cityDropDown}
                value={cityName}
                onChange={(selected) => setCityName(selected)}
                placeholder="Select city..."
                isClearable
                className="form-control for-city-selectionn"
              />
            </div>
            <div className="col-2 main-bx-field filter-item position-relative">
              <input
                ref={inputRef}
                type="text"
                value={destination}
                onChange={handleDestinationChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="Select hotel"
                className="form-control"
                aria-label="Search Hotel/City"
                required
                autoComplete="off"
              />

              {isFocused && propertyDropDown.length > 0 && (
                <ul
                  className={`list-group position-absolute w-100 zindex-dropdown ${
                    dropUp ? "drop-up" : ""
                  }`}
                  style={{
                    bottom: dropUp ? "100%" : "auto",
                    top: dropUp ? "auto" : "100%",
                    maxHeight: "350px",
                    overflowY: "auto",
                  }}
                >
                  {propertyDropDown.map((suggestion, index) => (
                    <li
                      key={index}
                      className="list-group-item"
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                      style={{ cursor: "pointer" }}
                    >
                      {suggestion.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="col-2 main-bx-field mb-3 mb-md-0 bdr-booking-bottom">
              <DateRangePicker onDateChange={handleDateChange} />
            </div>
            <div className="col-2 main-bx-field filter-item bdr-booking-bottom">
              <RoomManager onRoomChange={handleRoomChange} />
            </div>
            <div className="col-2 main-bx-field">
              <input
                type="text"
                name="promoCode"
                maxLength={20}
                value={promoCode}
                onChange={handlePromocodeChange}
                className="form-control"
                placeholder="Promo Code"
              />
            </div>
            <div
              id="search"
              className="col-1 search-icon hotel-search-btn-wrapper"
            >
              <button onClick={handleSearch}>
                <span className="this-search-for-mobile">Search</span>
                {/* <FontAwesomeIcon
                  icon={faSearch}
                  className="this-search-for-desk"
                /> */}
                <span className="this-search-for-desk">SEARCH</span>
              </button>
            </div>
          </div>)}

          {isLoaderOverlay ? (
            <div className="loader-dots" aria-label="Loading" role="status">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <div id="property-div" className="hotels-list hotels-rooms-list">
              <div className="row m-0">
                <div className="col-md-12 p-0">
                  {hasSearched && filteredProperties?.length > 0 ? (
                    <div className="repeated-div-property">
                      {filteredProperties?.map((property) => (
                        <div
                          key={property?.PropertyData?.PropertyId}
                          className="card rounded-3 mb-3 p-3 mt-4"
                        >
                          {activeHotel === property?.PropertyData?.PropertyId && (
                            <div
                              className="book-now-content"
                            >
                              <div className="accordion-body mt-4">
  {Array.isArray(property?.RoomData) ?( property?.RoomData?.length > 0 ? (
    (() => {
      const excludeRoomIds = ["146320"];
      const sortedRooms = property?.RoomData?.filter(room => !excludeRoomIds.includes(room.RoomId))?.map((rooms) => {
        const ratePlans = rooms?.RatePlans || [];
        
        let minRate = Infinity;

        ratePlans.forEach((plan) => {
          const firstRateKey = Object.keys(plan?.Rates || {})[0];
          const rate = parseFloat(
            plan?.Rates?.[firstRateKey]?.OBP?.["1"]?.RateBeforeTax || "0"
          );
          if (!isNaN(rate) && rate < minRate) {
            minRate = rate;
          }
        });

        if (!isFinite(minRate) || minRate <= 0) {
          // return null;
          return { ...rooms, soldOut: true }; 
        }

        return { ...rooms, minRate, soldOut: false }; 
      })
      .filter(Boolean)
      .sort((a, b) => a?.minRate - b?.minRate);
      if (sortedRooms?.length === 0) {
        return <p> No room data available for this property.</p>;
        
      }
       return sortedRooms?.map((rooms) => (
        <div className="row g-0 mb-3" key={rooms?.RoomId}>
                                      <div className="col-md-10">
                                        <div className="row">
                                          <div className="col-md-4">
                                            <div className="">
                                              {rooms?.Images &&
                                              rooms?.Images.length > 0 ? (
                                                <img
                                                  src={rooms?.Images[0]}
                                                  alt={`Hotel Image`}
                                                  width={500}
                                                  height={200}
                                                  data-bs-toggle="modal"
                                                  data-bs-target={`#RoomPopupModal-${rooms?.RoomId}`}
                                                  className="img-fluid rounded-3 room-image cursor-pointer"
                                                />
                                              ) : (
                                                <Image
                                                  src={dummyImage}
                                                  alt="alt"
                                                  width={500}
                                                  height={150}
                                                  className="img-fluid rounded-3 property-image"
                                                />
                                              )}
                                            </div>
                                          </div>
                                          <div className="col-md-8">
                                            <div className="card-body p-0">
                                              <div>
                                                <p className="hotel-info mb-1">
                                                  <span data-bs-toggle="modal"
                                                    data-bs-target={`#RoomPopupModal-${rooms?.RoomId}`}>
                                                    {rooms?.RoomName} 
                                                  </span>  
                                                </p>
                                                <div className="room-type-single">
                                                  <p className="bold-text1 mb-0">
                                                    Up to {rooms?.MaxGuest}{" "}
                                                    Guests &nbsp; | &nbsp;&nbsp;
                                                  </p>

                                                  <p className="bold-text1 mb-0">
                                                    {rooms?.RoomSize}
                                                  </p>
                                                </div>

                                                <div className="tile-placeholder text-justify py-2 pr-3 mobile-hidden-text1">
                                                  {stripHtml(
                                                    rooms?.RoomDescription || ""
                                                  ).slice(0, 150)}
                                                  ...
                                                  <Link
                                                    href="#"
                                                    className="read-more-btn-propery"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#RoomPopupModal-${rooms?.RoomId}`}
                                                  >
                                                    More info
                                                  </Link>
                                                  {ReactDOM.createPortal(
                                                    <div
                                                      className="modal fade"
                                                      id={`RoomPopupModal-${rooms?.RoomId}`}
                                                      tabIndex="-1"
                                                      aria-labelledby={`roomModalLabel-${rooms?.RoomId}`}
                                                      aria-hidden="true"
                                                    >
                                                      <div className="modal-dialog modal-dialog-centered modal-lg">
                                                        <div className="modal-content room-popup-modal-content">
                                                          <div className="modal-header">
                                                            <h5
                                                              className="modal-title"
                                                              id="RoomPopupModalTitle"
                                                            >
                                                              {rooms?.RoomName}
                                                            </h5>
                                                            <button
                                                              type="button"
                                                              className="btn-close"
                                                              data-bs-dismiss="modal"
                                                              aria-label="Close"
                                                            >
                                                              x
                                                            </button>
                                                          </div>
                                                          <div className="modal-body pt-0">
                                                            <Swiper
                                                              modules={[
                                                                Navigation,
                                                                Pagination,
                                                              ]}
                                                              navigation
                                                              pagination={{
                                                                clickable: true,
                                                              }}
                                                              spaceBetween={10}
                                                              slidesPerView={1}
                                                              loop={true}
                                                              className="images-slider"
                                                            >
                                                              {rooms?.Images &&
                                                              rooms?.Images
                                                                .length > 0
                                                                ? rooms?.Images.map(
                                                                    (
                                                                      src,
                                                                      idx
                                                                    ) => (
                                                                      <SwiperSlide
                                                                        key={
                                                                          idx
                                                                        }
                                                                      >
                                                                        <img
                                                                          src={
                                                                            src
                                                                          }
                                                                          alt={`Slide ${
                                                                            idx +
                                                                            1
                                                                          }`}
                                                                          className="img-fluid img-thumb"
                                                                        />
                                                                      </SwiperSlide>
                                                                    )
                                                                  )
                                                                : images.map(
                                                                    (
                                                                      src,
                                                                      idx
                                                                    ) => (
                                                                      <SwiperSlide
                                                                        key={
                                                                          idx
                                                                        }
                                                                      >
                                                                        <img
                                                                          src={
                                                                            src
                                                                          }
                                                                          alt={`Slide ${
                                                                            idx +
                                                                            1
                                                                          }`}
                                                                          className="img-fluid img-thumb"
                                                                        />
                                                                      </SwiperSlide>
                                                                    )
                                                                  )}
                                                            </Swiper>

                                                            <div className="bottom-modal-content">
                                                              <div className="property-description mt-3 px-3">
                                                                <p>
                                                                  {stripHtml(
                                                                    rooms?.RoomDescription ||
                                                                      ""
                                                                  )}
                                                                </p>
                                                              </div>
                                                              <div className="property-amenitiess mt-4 px-3 gallery-popup-section">
                                                                <div className="row">
                                                                  {Array.isArray(
                                                                    rooms?.Bedding
                                                                  ) &&
                                                                    rooms?.Bedding.some(
                                                                      (item) =>
                                                                        item?.BedType?.trim()
                                                                    ) && (
                                                                      <div className="col-lg-4 col-md-6 d-none">
                                                                        <h6 className="amenity-ttile">
                                                                          Beds
                                                                          and
                                                                          Bedding
                                                                        </h6>
                                                                        <ul className="pl-0 ps-0">
                                                                          {rooms?.Bedding.map(
                                                                            (
                                                                              item,
                                                                              itemIndex
                                                                            ) =>
                                                                              item?.BedType?.trim() ? (
                                                                                <li
                                                                                  key={`bedding-${itemIndex}`}
                                                                                  className="list-bedding"
                                                                                >
                                                                                  {
                                                                                    item.BedType
                                                                                  }
                                                                                </li>
                                                                              ) : null
                                                                          )}
                                                                        </ul>
                                                                      </div>
                                                                    )}

                                                                  {rooms?.RoomAmenities &&
                                                                    Object?.entries(
                                                                      rooms?.RoomAmenities
                                                                    ).map(
                                                                      (
                                                                        [
                                                                          category,
                                                                          items,
                                                                        ],
                                                                        roomAmenity
                                                                      ) => (
                                                                        <div
                                                                          className="col-lg-4 col-md-6 col-sm-6"
                                                                          key={`room-cat-${roomAmenity}`}
                                                                        >
                                                                          <h6 className="amenity-ttile">
                                                                            
                                                                            {
                                                                              category
                                                                            }
                                                                          </h6>
                                                                          <ul className="ps-0 pl-0">
                                                                            {Array.isArray(
                                                                              items
                                                                            ) &&
                                                                              items.map(
                                                                                (
                                                                                  item,
                                                                                  itemIndex
                                                                                ) => (
                                                                                  <li
                                                                                    key={`room-item-${roomAmenity}-${itemIndex}`}
                                                                                    className="list-item"
                                                                                  >
                                                                                    {" "}
                                                                                    <FontAwesomeIcon
                                                                                      icon={
                                                                                        faDiamond
                                                                                      }
                                                                                      className="me-2"
                                                                                      color="#7b7b7b"
                                                                                      size="6"
                                                                                    />{" "}
                                                                                    {
                                                                                      item
                                                                                    }
                                                                                  </li>
                                                                                )
                                                                              )}
                                                                          </ul>
                                                                        </div>
                                                                      )
                                                                    )}
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>,
                                                    document.body
                                                  )}
                                                </div>
                                                
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-2">
                                        <div className="price-detail-right">
                                          <div className="price-details mt-0">
                                            <div className="make-flex">

                                             <p className="priceText mb-0 mt-1 property-price-text">
                                                    {(() => {
                                                      const ratePlans = rooms?.RatePlans || [];
                                                      let minRate = Infinity;

                                                      ratePlans.forEach((plan) => {
                                                        const firstRateKey = Object.keys(plan?.Rates || {})[0];
                                                        const rate = parseFloat(
                                                          plan?.Rates?.[firstRateKey]?.OBP?.["1"]?.RateBeforeTax || "0"
                                                        );
                                                        if (!isNaN(rate) && rate < minRate) {
                                                          minRate = rate;
                                                        }
                                                      });

                                                      // if (!isFinite(minRate)) {
                                                      //   return "Sold Out";
                                                      // }
                                                      if (!isFinite(minRate)) {
                                                      return (
                                                        <>
                                                          Sold Out
                                                          <span className="small-text-for-today"> (for today)</span>
                                                        </>
                                                      );
                                                    }
                                                      // Format INR
                                                      const formatINR = (value) =>
                                                        new Intl.NumberFormat("en-IN", {
                                                          style: "currency",
                                                          currency: "INR",
                                                          maximumFractionDigits: 0,
                                                        }).format(value);

                                                      // 25% higher original price
                                                      const increasedPrice = minRate + minRate * 0.25;

                                                      return (
                                                        <>
                                                        <span className="line-through text-gray-500">
                                                            {formatINR(increasedPrice)}
                                                          </span>
                                                        <span className="flex items-center gap-2">
                                                          <span className="text-green-600 font-bold">
                                                            {formatINR(minRate)}
                                                          </span>

                                                          <span className="sm-text-price">/Night</span>
                                                        </span>
                                                        </>
                                                        
                                                      );
                                                    })()}
                                                  </p>


                                              { !rooms.soldOut && <p className="price-details">
                                                <span>
                                                  Plus INR &nbsp;
                                                  {(() => {
                                                    const ratePlans =
                                                      rooms?.RatePlans || [];
                                                    let minRate = Infinity;

                                                    ratePlans.forEach(
                                                      (plan) => {
                                                        const firstRateKey =
                                                          Object.keys(
                                                            plan?.Rates || {}
                                                          )[0];
                                                        const rate =
                                                          parseFloat(
                                                            plan?.Rates?.[
                                                              firstRateKey
                                                            ]?.OBP?.["1"]
                                                              ?.RateAfterTax ||
                                                              "0"
                                                          ) -
                                                          parseFloat(
                                                            plan?.Rates?.[
                                                              firstRateKey
                                                            ]?.OBP?.["1"]
                                                              ?.RateBeforeTax ||
                                                              "0"
                                                          );
                                                        if (
                                                          !isNaN(rate) &&
                                                          rate < minRate
                                                        ) {
                                                          minRate = rate;
                                                        }
                                                      }
                                                    );

                                                    return isFinite(minRate)
                                                      ? Math.round(minRate)
                                                      : 0;
                                                  })()}{" "}
                                                  in taxes
                                                </span>
                                              </p>}
                                            </div>
                                          </div>
                                          <div className="book-a-stay book-stay-room-btn style-for-mob-price">
                                            
                                            <div className="price-details mt-0 no-need-this-price">
                                              <div className="make-flex mb-1">
                                                <p className="priceText mb-0 mt-1 property-price-text">
                                                  Total
                                                </p>
                                              </div>
                                              <div className="make-flex">
                                                <p className="priceText mb-0 mt-0 property-price-text">
                                                  INR &nbsp;
                                                  {(() => {
                                                    const ratePlans =
                                                      rooms?.RatePlans || [];
                                                    let minRate = Infinity;

                                                    ratePlans.forEach(
                                                      (plan) => {
                                                        const firstRateKey =
                                                          Object.keys(
                                                            plan?.Rates || {}
                                                          )[0];
                                                        const rate = parseFloat(
                                                          plan?.Rates?.[
                                                            firstRateKey
                                                          ]?.OBP?.["1"]
                                                            ?.RateAfterTax ||
                                                            "0"
                                                        );
                                                        if (
                                                          !isNaN(rate) &&
                                                          rate < minRate
                                                        ) {
                                                          minRate = rate;
                                                        }
                                                      }
                                                    );

                                                    return isFinite(minRate)
                                                      ? Math.round(minRate)
                                                      : 0;
                                                  })()}
                                                  <span className="sm-text-price">
                                                    {" "}
                                                    (incl. of taxes)
                                                  </span>
                                                </p>
                                                <p className="price-details"></p>
                                              </div>
                                            </div>

                                            {rooms?.MinInventory == 0 ? (
                                              <>
                                              {!rooms.soldOut && <button
                                                className="btn btn-primary btnprimary-2"
                                                onClick={() =>
                                                  handleGetDetails(
                                                    rooms,
                                                    property?.PropertyData
                                                  )
                                                }
                                                disabled
                                              >
                                                Not available
                                              </button>}
                                              </>
                                            ) : (
                                              <button
                                              className={`btn btn-primary btnprimary-2 ${
                                      isHandleBookNow ? "handle-book-now" : ""
                                    }`}
                                                onClick={() =>
                                                  handleGetDetails(
                                                    rooms,
                                                    property?.PropertyData
                                                  )
                                                }
                                              >
                                                Select This Room
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      {visibleOfferRoomId === rooms?.RoomId && (
                                        <div
                                          id={`offer-${rooms?.RoomId}`}
                                          className="offers-container mt-4"
                                        >
                                          <div className="accordion-body swiper-slider-package">
                                            <Swiper
                                              modules={[Navigation, Pagination, Autoplay]}
                                              spaceBetween={5}
                                              slidesPerView={1}
                                              navigation={{
                                                nextEl: ".swiper-button-next",
                                                prevEl: ".swiper-button-prev",
                                              }}
                                              pagination={false}
                                              autoplay={{
                                                delay: 3000,
                                                disableOnInteraction: false,
                                              }}
                                              breakpoints={{
                                                576: { slidesPerView: 1 },
                                                768: { slidesPerView: 2 },
                                                992: { slidesPerView: 4 },
                                                1200: { slidesPerView: 4 },
                                              }}
                                              className="swiper-container-with-navigation"
                                            >
                                              {property?.RateData.filter(
                                                (rate) =>
                                                  property?.Mapping.some(
                                                    (map) =>
                                                      map.RoomId ===
                                                        rooms?.RoomId &&
                                                      map.RateId === rate.RateId
                                                  )
                                              ).map((rate, idx) => {
                                                const mapping =
                                                  property?.Mapping.find(
                                                    (map) =>
                                                      map?.RoomId ===
                                                        rooms?.RoomId &&
                                                      map?.RateId === rate?.RateId
                                                  );
                                                return (
                                                  <SwiperSlide key={idx}>
                                                    <div className="mt-3 package-main-box">
                                                      <div className="winter-box-content carddd"
                                                      
                                                      >
                                                        <p className="hotel-info mb-1">
                                                          <span className="d-flex align-content-center">
                                                            {rate.RateName} 
                                                            <span className="offer-tag">  
                                                              <Tags className="mr-2" />  25% Off
                                                            </span>
                                                          </span>
                                                        </p>
                                                        <p className="package-desc-content">
                                                          {stripHtml(
                                                            rate.RateDescription ||
                                                              ""
                                                          ).slice(0, 90)}
                                                          ...
                                                          <a
                                                            className="view-package-detail-btn"
                                                            onClick={() =>
                                                              setSelectedRoomOffers(
                                                                [rate]
                                                              )
                                                            }
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#rateDetailsModal"
                                                          >
                                                            more info
                                                          </a>
                                                        </p>

                                                        <div className="winter-box-btn offer-footer-part">
                                                          <div className="package-select-left">
                                                            <p className="priceText">
                                                              <small>
                                                                Standard Rate
                                                              </small>
                                                            </p>
                                                            <p className="priceText">
                                                              {(() => {
                                                                const ratePlan = rooms?.RatePlans?.find(
                                                                  (element) => element.RateId === mapping.RateId
                                                                );

                                                                const firstRateKey = Object.keys(ratePlan?.Rates || {})[0];
                                                                const minRate = parseFloat(
                                                                  ratePlan?.Rates?.[firstRateKey]?.OBP?.["1"]?.RateBeforeTax || "0"
                                                                );

                                                                if (!minRate || isNaN(minRate)) {
                                                                  return "Sold Out";
                                                                }

                                                                // Format INR
                                                                const formatINR = (value) =>
                                                                  new Intl.NumberFormat("en-IN", {
                                                                    style: "currency",
                                                                    currency: "INR",
                                                                    maximumFractionDigits: 0,
                                                                  }).format(value);

                                                                // 25% higher original price
                                                                const increasedPrice = minRate + minRate * 0.25;

                                                                return (
                                                                  <span className="flex items-center gap-2">
                                                                    <span className="line-through text-gray-500 d-block">
                                                                      {formatINR(increasedPrice)}
                                                                    </span>
                                                                    <span className="text-green-600 font-bold">
                                                                      {formatINR(minRate)}
                                                                    </span>

                                                                    <small className="text-gray-500">/Night</small>

                                                                  </span>
                                                                );
                                                              })()}
                                                            </p>

                                                            {rooms?.RatePlans?.find(
                                                              (element) =>
                                                                element.RateId ===
                                                                mapping.RateId
                                                            )?.Rates?.[
                                                              Object.keys(
                                                                rooms
                                                                  ?.RatePlans?.[0]
                                                                  ?.Rates || {}
                                                              )[0]
                                                            ]?.OBP?.["1"]
                                                              ?.RateBeforeTax ? (
                                                              <button
                                                                className="btn offer-select-btnn rounded-0"
                                                                onClick={() => {
                                                                  handleSelectRoom(
                                                                    mapping,
                                                                    rate,
                                                                    rooms,
                                                                    Math.round(
                                                                      rooms?.RatePlans?.find(
                                                                        (
                                                                          element
                                                                        ) =>
                                                                          element.RateId ===
                                                                          mapping.RateId
                                                                      )
                                                                        ?.Rates?.[
                                                                        Object.keys(
                                                                          rooms
                                                                            ?.RatePlans?.[0]
                                                                            ?.Rates ||
                                                                            {}
                                                                        )[0]
                                                                      ]?.OBP?.[
                                                                        "1"
                                                                      ]
                                                                        ?.RateBeforeTax ||
                                                                        "0"
                                                                    ),
                                                                    Math.round(
                                                                      rooms?.RatePlans?.find(
                                                                        (
                                                                          element
                                                                        ) =>
                                                                          element.RateId ===
                                                                          mapping.RateId
                                                                      )
                                                                        ?.Rates?.[
                                                                        Object.keys(
                                                                          rooms
                                                                            ?.RatePlans?.[0]
                                                                            ?.Rates ||
                                                                            {}
                                                                        )[0]
                                                                      ]?.OBP?.[
                                                                        "1"
                                                                      ]
                                                                        ?.RateAfterTax ||
                                                                        "0"
                                                                    )
                                                                  );
                                                                  selectedSetRateDataList(
                                                                    rate
                                                                  );
                                                                }}
                                                              >
                                                                Select Package{" "}
                                                              </button>
                                                            ) : (
                                                              <button
                                                                className="btn btn-primary offer-select-btnn"
                                                                onClick={() => {
                                                                  handleSelectRoom(
                                                                    mapping,
                                                                    rate,
                                                                    rooms,
                                                                    Math.round(
                                                                      rooms?.RatePlans?.find(
                                                                        (
                                                                          element
                                                                        ) =>
                                                                          element.RateId ===
                                                                          mapping.RateId
                                                                      )
                                                                        ?.Rates?.[
                                                                        Object.keys(
                                                                          rooms
                                                                            ?.RatePlans?.[0]
                                                                            ?.Rates ||
                                                                            {}
                                                                        )[0]
                                                                      ]?.OBP?.[
                                                                        "1"
                                                                      ]
                                                                        ?.RateBeforeTax ||
                                                                        "0"
                                                                    ),
                                                                    Math.round(
                                                                      rooms?.RatePlans?.find(
                                                                        (
                                                                          element
                                                                        ) =>
                                                                          element.RateId ===
                                                                          mapping.RateId
                                                                      )
                                                                        ?.Rates?.[
                                                                        Object.keys(
                                                                          rooms
                                                                            ?.RatePlans?.[0]
                                                                            ?.Rates ||
                                                                            {}
                                                                        )[0]
                                                                      ]?.OBP?.[
                                                                        "1"
                                                                      ]
                                                                        ?.RateAfterTax ||
                                                                        "0"
                                                                    )
                                                                  );
                                                                  selectedSetRateDataList(
                                                                    rate
                                                                  );
                                                                }}
                                                                disabled
                                                              >
                                                                Select Package{" "}
                                                              </button>
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </SwiperSlide>
                                                );
                                              })}
                                              <div className="swiper-pagination"></div>
                                              <div className="slider-btns-arrow">
                                                <div className="swiper-button-prev"></div>
                                                <div className="swiper-button-next"></div>
                                              </div>
                                            </Swiper>
                                          </div>
                                        </div>
                                      )}
                                      {ReactDOM.createPortal(
                                        <div
                                          className="modal fade"
                                          id="rateDetailsModal"
                                          tabIndex="-1"
                                          aria-labelledby="rateDetailsModalLabel"
                                          aria-hidden="true"
                                        >
                                          <div className="modal-dialog modal-dialog-centered text-start">
                                            <div className="modal-content">
                                              <div className="p-3">
                                                <h5
                                                  className="modal-title"
                                                  id="rateDetailsModalLabel"
                                                >
                                                  Rate Details
                                                </h5>
                                                <button
                                                  type="button"
                                                  className="btn-close"
                                                  data-bs-dismiss="modal"
                                                  aria-label="Close"
                                                  onClick={() =>
                                                    setSelectedRoomOffers([])
                                                  }
                                                >
                                                  x
                                                </button>
                                              </div>
                                              <div className="modal-body">
                                                <div className="offer-list">
                                                  {selectedRoomOffers.map(
                                                    (rate, idx) => (
                                                      <div
                                                        key={idx}
                                                        className="offer-item"
                                                      >
                                                        <h6>{rate.RateName}</h6>
                                                        <h6>{rate.Meal}</h6>
                                                        <div className="popup-amenity-items py-3">
                                                          <p className="f-12-new">
                                                            {stripHtml(
                                                              rate.RateDescription ||
                                                                ""
                                                            )}
                                                          </p>
                                                        </div>
                                                        <div className="cancellation-div">
                                                          <h6>
                                                            Cancellation Policy
                                                          </h6>
                                                          <p>
                                                            {
                                                              cancellationPolicyPackage.find(rp => rp?.RateId === rate?.RateId)?.CancellationPolicy?.Description
                                                            }
                                                          </p>
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>,
                                        document.body
                                      )}
                                    </div>
                                      ));
                                      })()
                                  ) : (
                                    <p>
                                      No room data available for this property.
                                    </p>
                                  )) : (
                                     <p>No room data available for this property</p> 
                                   )}
                                </div>

                              
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) :(
                    <div className="no-property">
                      {showDropDown ? <><div className="repeated-div-property"><p>Apologies, we couldn’t find any properties matching your search.</p></div></>:''}
                    </div>
                  ) }
                </div>
              </div>
            </div>
          )}

          {isOpenLogin && (
            <div className="login-pop-up">
              <div className="modal-overlay">
                <div className="modal-content">
                  <button
                    className="modal-close"
                    onClick={() => setIsOpenLogin(false)}
                  >
                    &times;
                  </button>
                  {/* <SignUp onSubmit={handleSignUpSubmit} /> */}
                  <Login onSubmit={handleLoginSubmit} />
                </div>
              </div>
            </div>
          )}

          {isOpenSignUp && (
            <div className="signup-pop-up">
              <div className="modal-overlay">
                <div className="modal-content">
                  <button
                    className="modal-close"
                    onClick={() => setIsOpenSignUp(false)}
                  >
                    &times;
                  </button>
                  <SignUp onSubmit={handleSignUpSubmit} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <WizardSidebar
        isVisible={isWizardVisible}
        onClose={() => handleWizardClose()}
        status={status}
      />
    </>
  );
};

export default FilterBar;
