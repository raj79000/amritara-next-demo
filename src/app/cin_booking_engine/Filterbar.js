"use client";
import { useBookingEngineContext } from "../cin_context/BookingEngineContext";
import * as ReactDOM from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import "flatpickr/dist/themes/material_green.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
import RoomManager from "../cin_booking_engine/RoomManager";

import DateRangePicker from "../cin_booking_engine/Flatpicker";
import WizardSidebar from "../cin_booking_engine/PaymentGateway/WizardForm";
import "../cin_booking_engine/booking.css";
import { createSignature } from "../utilities/signature";
//import { useForm } from "app/booking-engine-widget/FormContext";
import Login from "../cin_booking_engine/Users/Login";
import SignUp from "../cin_booking_engine/Users/SignUp";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Map, MapIcon, Search } from "lucide-react";
//import { useSearchParams } from "next/navigation";
import Select from "react-select";
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
  onClose,
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
  } = useBookingEngineContext();

  //const { promoCodeContext, setPromoCodeContext } = useBook();
  const [filters, setFilters] = useState({
    offer: "",
    query: "",
    dateRange: { start: "", end: "", totalPrice: 0 },
    guests: { adults: 1, children: 0, rooms: 1 },
  });
  const [promoCode, setPromoCode] = useState("");
  const [destination, setDestination] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);
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
    if (selectedProperty > 0 && propertyData) {
      handleSuggestionClick(propertyData);
    }
  }, [propertyData]);
  // useEffect(() => {
  //   if (filteredProperties.length > 0) {
  //     const propertyImages =
  //       filteredProperties?.[0]?.PropertyData?.Images || [];
  //     const RoomData = filteredProperties?.[0]?.RoomData || [];
  //     const categoryImages = {
  //       hotel: propertyImages.map((img) => ({ src: img, title: "Hotel" })),
  //       rooms: RoomData.map((room) => ({
  //         src: room?.Images?.[0]
  //           ? room?.Images?.[0]
  //           : "/booking-engine-imgs/images/offer-pp.jpg",
  //         title: room?.RoomName ? room?.RoomName : "Room",
  //       })),
  //       // rooms: [
  //       //   { src: "/booking-engine-imgs/images/mountain-view.jpg", title: "Deluxe Room" },
  //       //   { src: "/booking-engine-imgs/images/offer-pp.jpg", title: "Superior Room" },
  //       // ],
  //       facilities: [
  //         {
  //           src: "/booking-engine-imgs/images/mountain-view.jpg",
  //           title: "Fitness Centre (GYM)",
  //         },
  //         {
  //           src: "/booking-engine-imgs/images/offer-pp.jpg",
  //           title: "EV Charging",
  //         },
  //       ],
  //       events: [
  //         {
  //           src: "/booking-engine-imgs/images/mountain-view.jpg",
  //           title: "Event Image 1",
  //         },
  //         {
  //           src: "/booking-engine-imgs/images/offer-pp.jpg",
  //           title: "Event Image 2",
  //         },
  //       ],
  //       restaurant: [
  //         {
  //           src: "/booking-engine-imgs/images/mountain-view.jpg",
  //           title: "Restaurant",
  //         },
  //         {
  //           src: "/booking-engine-imgs/images/offer-pp.jpg",
  //           title: "Restaurant",
  //         },
  //       ],
  //     };
  //     setCategoryImages(categoryImages);
  //     setCategories(Object.keys(categoryImages));
  //     // const categories = Object.keys(categoryImages);
  //   }
  // }, [filteredProperties]);

  const fetchPropertyImages = async (property_Id) => {
    try {
      const response = await fetch(
        `http://loyaltypulsedemo.ownyourcustomers.in/cmsapi//property/GetPropertyByFilter?propertyId=${parseInt(
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
      setPropertyImages(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchGalleryImages = async (property_Id) => {
    try {
      const response = await fetch(
        `http://loyaltypulsedemo.ownyourcustomers.in/cmsapi//gallery/GetGalleryByProperty?propertyId=${parseInt(
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
      console.log("res", res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchContentData = async (propertyDropDown) => {
    try {
      //const prop = 22651;
      const prop = propertyDropDown
        .map((item) => item.value) // get only the value
        .filter((v) => v != null) // remove null/undefined
        .join(",");
      console.log("prop", prop);
      const timestamp = Date.now().toString();
      const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
      const signature = await createSignature(
        JSON.stringify(prop),
        timestamp,
        secret
      );

      const response = await fetch(
        "https://cinbe.cinuniverse.com/api/cin-api/content",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-timestamp": timestamp,
            "x-signature": signature,
          },
          body: JSON.stringify({ selectedPropertyId: prop }),
        }
      );
      const res = await response.json();
      // sessionStorage.setItem("contentData", JSON.stringify(res));
      // setContentData(res || []);
      setPropertyList(res?.PropertyList);
      setFilteredProperties(res?.PropertyList);
      //setHandleSearched(true);
      // const result = propertyList?.filter((property) => {
      //   const matchesDestination = selectedHotelName
      //     ? property.PropertyData.Address.City.toLowerCase().includes(
      //         selectedHotelName.toLowerCase()
      //       ) ||
      //       property.PropertyData.PropertyName.toLowerCase().includes(
      //         selectedHotelName.toLowerCase()
      //       )
      //     : true;
      //   return matchesDestination;
      // });
      // setFilteredProperties(result);
      //setHasSearched(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //Add this on click of search_started booking engine widget 2nd step
  // const handleGetDetailsClick = (rooms) => {

  //   const totalAdults = selectedRoom?.reduce((sum, room) => sum + (room.adults || 0), 0);
  //   const totalChildren = selectedRoom?.reduce((sum, room) => sum + (room.children || 0), 0);
  //   const totalRooms = selectedRoom?.length;

  //   const hotelName = document.querySelector('.hotel-title')?.textContent.trim() || 'Unknown Hotel';
  //   const rackRate = document.querySelector('.room-price')?.textContent.replace(/[^\d]/g, '') || '0';
  //   const roomName = document.querySelector('.room-name')?.textContent.trim() || 'Unknown Room';
  //   const roomId = document.querySelector('.room-id')?.textContent.trim() || 'Unknown Room';
  //   const data = (() => {
  //     const ratePlans = rooms?.RatePlans || [];
  //     let minRate = Infinity;

  //     ratePlans.forEach(plan => {
  //       const firstRateKey = Object.keys(plan?.Rates || {})[0];
  //       const rate = parseFloat(
  //         plan?.Rates?.[firstRateKey]?.OBP?.["1"]?.RateBeforeTax || "0"
  //       );
  //       if (!isNaN(rate) && rate < minRate) {
  //         minRate = rate;
  //       }
  //     });

  //     return isFinite(minRate) ? parseInt(minRate) : 0;
  //   })();

  //   window.dataLayer = window.dataLayer || [];

  //   window.dataLayer.push({
  //     event: 'room_category_selected',

  //     // Property info
  //     propertyName: hotelName,               // e.g., 'Hotel Name'

  //     // Room info
  //     RoomId: rooms.RoomId,                  // e.g., 'DELUXE123'
  //     RoomName: rooms.RoomName,              // e.g., 'Deluxe Room Twin Bed with Balcony'
  //     minRate: data,                // e.g., 3431
  //     RateBeforeTax: 0,    // e.g., 5999
  //     currency: 'INR',                          // Currency code (ISO 4217 standard)

  //     // Search context
  //     selectedStartDate: selectedStartDate,     // e.g., '2025-07-10'
  //     selectedEndDate: selectedEndDate,         // e.g., '2025-07-12'
  //     totalAdults: totalAdults,
  //     totalChildren: totalChildren,
  //     totalRooms: totalRooms,
  //     promoCode: promoCode || null              // Optional
  //   });
  // };
  const handleGetDetailsClick = (rooms) => {
    const INR = "INR";
    const totalAdults = selectedRoom?.reduce(
      (sum, room) => sum + (room.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room.children || 0),
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
            item_id: `${selectedPropertyId}_${rooms.RoomId}_defaultplan`,
            item_name: hotelName,
            item_category: rooms.RoomName,
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
      (sum, room) => sum + (room.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room.children || 0),
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
      (sum, room) => sum + (room.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room.children || 0),
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
            item_category: rooms.RoomName, // ✅ Room Name
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
    console.log(window.dataLayer);
  };

  const handleRatePlanSelect = (mapping, rooms) => {
    const INR = "INR";
    const totalAdults = selectedRoom?.reduce(
      (sum, room) => sum + (room.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room.children || 0),
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
    const cleanedItemId = `${selectedPropertyId}_${rooms.RoomId}_${cleanedRateName}`;
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
              item_category: rooms.RoomName,
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
    console.log(window.dataLayer);
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

      console.log("Response status:", res.status);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("API call failed:", error); // Will now show in console
    }
  };
  const fetchRatePrices = async (propertyId, loggedin) => {
    if (!propertyId) {
      setFilteredProperties([]);
      setLoaderOverlay(false);
      return;
    } else {
      try {
        setLoaderOverlay(true);
        // const prop = 22651;
        const timestamp = Date.now().toString();
        const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
        const signature = await createSignature(
          // JSON.stringify(selectedPropertyId),
          JSON.stringify(propertyId),
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
              selectedPropertyId: propertyId,
              fromDate,
              toDate,
              promoCodeContext: loggedin
                ? encodeBase64("test")
                : promoCodeContext,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("failed - Rate not found.");
        }

        const data = await response.json();
        if (loggedin) {
          const encoded = encodeBase64("test");
          setPromoCodeContext(encoded);
        }
        setRateResponse(data);
        setIsRateFetched(true);
        setHandleSearched(false);
        const dayRate =
          Array.isArray(data?.Product) && data?.Product.length > 0
            ? data.Product[0]?.Rooms?.map((room) => ({
                RoomId: room?.RoomId,
                MinInventory: room?.MinInventory,
                RestrictionTitle: room?.RestrictionTitle,
                RateBeforeTax:
                  Object.values(room?.RatePlans?.[0]?.Rates || {})[0]?.OBP?.[
                    "1"
                  ]?.RateBeforeTax || "0",
                RateAfterTax:
                  Object.values(room?.RatePlans?.[0]?.Rates || {})[0]?.OBP?.[
                    "1"
                  ]?.RateAfterTax || "0",
                RatePlans: room?.RatePlans,
              }))
            : [];

        if (data.PropertyList[0] && data.PropertyList[0].RoomData && dayRate) {
          data.PropertyList[0].RoomData = data.PropertyList[0].RoomData.map(
            (room) => {
              const matchedRate = dayRate.find(
                (rate) => rate.RoomId == room.RoomId
              );
              return {
                ...room,
                RackRate: matchedRate?.RateBeforeTax
                  ? parseFloat(matchedRate.RateBeforeTax)
                  : room.RackRate,
                MinInventory: matchedRate?.MinInventory
                  ? parseFloat(matchedRate?.MinInventory)
                  : 0,
                RestrictionTitle: matchedRate?.RestrictionTitle,
                RatePlans: matchedRate?.RatePlans ? matchedRate?.RatePlans : [],
              };
            }
          );
          if (
            parseInt(data.PropertyList[0].PropertyData.PropertyId) ==
            parseInt(propertyId)
          ) {
            setFilteredProperties(data.PropertyList);
            setLoaderOverlay(false);
          }
          // setFilteredProperties(
          //   parseInt(data.PropertyList[0].PropertyData.PropertyId) ==
          //     parseInt(propertyId)
          //     ? data.PropertyList
          //     : []
          // );
          else {
            setFilteredProperties([]);
            setLoaderOverlay(false);
          }
        }
      } catch (error) {
        setLoaderOverlay(false);
        console.error("Error fetching prices:", error);
      }
    }
  };

  // useEffect(() => {
  //   const content = JSON.parse(sessionStorage?.getItem("contentData") || "[]");
  //   if (Array.isArray(content.PropertyList)) {
  //     console.log("content1234", content.PropertyList);
  //     setPropertyList(content.PropertyList);

  //   } else {
  //     console.error("Invalid Property");
  //   }
  // }, []);

  useEffect(() => {
    const storedData = sessionStorage?.getItem("paymentResponse");
    if (storedData) {
      setCurrentStep(4);
      setIsWizardVisible(true);
    }
    if (!storedData) {
      console.log("removeItem", storedData);
      sessionStorage?.removeItem("bookingData");
    }
    if (Array.isArray(contentData?.PropertyList)) {
      setPropertyList(contentData?.PropertyList);
    }

    fetch("http://loyaltypulsedemo.ownyourcustomers.in/cmsapi//property/GetBrandList")
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

    // const userDetails = localStorage?.getItem("userDetails");
    // if (userDetails) {
    //   setCurrentStep(4);
    //   setIsWizardVisible(true);
    // }
  }, []);

  useEffect(() => {
    if (tokenKey) {
      console.log("tokenKey filter", tokenKey);
      async function fetchData() {
        const paymentResponse = await verifyGuidToken();
        console.log("paymentResponse", paymentResponse);
        console.log(
          "paymentResponse Stringify",
          JSON.stringify(paymentResponse)
        );
        sessionStorage.setItem(
          "paymentResponse",
          JSON.stringify(paymentResponse)
        );
        setIsWizardVisible(true);
        setCurrentStep(4);
      }
      fetchData();
    }
    // else {
    //   sessionStorage?.removeItem("bookingData");
    // }
  }, [tokenKey]);
  // useEffect(() => {
  //   if (isFormOpen) {
  //     if (isFormOpen) {
  //       if (Array.isArray(contentData?.PropertyList)) {
  //         setPropertyList(contentData?.PropertyList);
  //       }
  //       // else {
  //       //   console.error("Invalid Property");
  //       // }
  //       const formatingDate = (date) => {
  //         const d = new Date(date); // ensure it's a Date object
  //         const year = d.getFullYear();
  //         const month = String(d.getMonth() + 1).padStart(2, "0");
  //         const day = String(d.getDate()).padStart(2, "0");
  //         return `${year}-${month}-${day}`;
  //       };

  //       const today = new Date();
  //       const tomorrow = new Date(today);
  //       tomorrow.setDate(today.getDate() + 1);

  //       const currentDate = formatingDate(today); // today's date
  //       const nextDate = formatingDate(tomorrow);
  //       setSelectedStartDate(currentDate);
  //       setSelectedEndDate(nextDate);
  //     }
  //     showBookingEngine();
  //   } else {
  //     setIsVisible(false);
  //   }
  // }, [isFormOpen]);

  // useEffect(() => {
  //   if (propertyName != "") {
  //     setDestination(propertyName || "");
  //   }
  // }, [propertyName]);

  useEffect(() => {
    if (selectedProperty > 0 && destination !== "") {
      handleSearch();
      if (roomDetails?.staahRoomsId > 0) {
        handleBookNow(selectedProperty.toString(), "", "0909");
        //const result = propertyList.filter((property) => property.RoomData.map((room) => room.RoomId === roomId));
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

        // if (!rangeStart && !rangeEnd) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const currentDate = formatingDate(today); // today's date
        const nextDate = formatingDate(tomorrow);
        setSelectedStartDate(currentDate);
        setSelectedEndDate(nextDate);
        handleGetDetails(matchingRoom, propertyList?.[0]?.PropertyData);
        // }
        // else {
        //   //setPromoCode(promoCode);
        //   setSelectedStartDate(rangeStart);
        //   setSelectedEndDate(rangeEnd);
        //   handleGetDetails(matchingRoom, propertyList?.[0]?.PropertyData);
        // }
      }
    }
  }, [destination]);

  useEffect(() => {
    //const content = JSON.parse(sessionStorage?.getItem("contentData") || "[]");

    if (selectedProperty > 0) {
      showBookingEngine();
      setCityName(cityDetails);
      // setSelectedPropertyId(selectedProperty.toString());

      // handleSearch();
      // handleBookNow(selectedProperty.toString(), "", 0);
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
      selectedRoom[0].roomId != ""
    ) {
      handleDateChange(selectedStartDate, selectedEndDate, 0);
    }
  }, [selectedStartDate, selectedEndDate]);

  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        if (selectedPropertyId != null) {
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
            throw new Error("failed - Add-Ons not found");
          }
          const data = await response.json();
          setAddOnsResponse(data);
          const properties = data;
          if (Array.isArray(properties)) {
            setAddonList(properties[0]?.ExtrasData || []);
            if (properties[0]?.ExtrasData.length > 0) {
              setIsAddOnns(true);
            }
          } else {
            console.error("Invalid Property:", properties);
          }
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchAddOns();
  }, [selectedPropertyId]);

  // useEffect(() => {
  //   const fetchPrices = async () => {
  //     if (!selectedPropertyId) {
  //       return;
  //     } else {
  //       try {
  //         // const prop = 22651;
  //         const timestamp = Date.now().toString();
  //         const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
  //         const signature = await createSignature(
  //           // JSON.stringify(selectedPropertyId),
  //           JSON.stringify(selectedPropertyId),
  //           timestamp,
  //           secret
  //         );
  //         const response = await fetch(
  //           "https://cinbe.cinuniverse.com/api/cin-api/rate",
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //               "x-timestamp": timestamp,
  //               "x-signature": signature,
  //             },
  //             body: JSON.stringify({
  //               selectedPropertyId,
  //               fromDate,
  //               toDate,
  //               promoCodeContext: isLoggedin
  //                 ? encodeBase64("test")
  //                 : promoCodeContext,
  //             }),
  //           }
  //         );

  //         if (!response.ok) {
  //           throw new Error("failed - Rate not found.");
  //         }

  //         const data = await response.json();
  //         setRateResponse(data);
  //         setIsRateFetched(true);
  //         setHandleSearched(false);
  //         const dayRate =
  //           Array.isArray(data?.Product) && data?.Product.length > 0
  //             ? data.Product[0]?.Rooms?.map((room) => ({
  //                 RoomId: room?.RoomId,
  //                 MinInventory: room?.MinInventory,
  //                 RestrictionTitle: room?.RestrictionTitle,
  //                 RateBeforeTax:
  //                   Object.values(room?.RatePlans?.[0]?.Rates || {})[0]?.OBP?.[
  //                     "1"
  //                   ]?.RateBeforeTax || "0",
  //                 RateAfterTax:
  //                   Object.values(room?.RatePlans?.[0]?.Rates || {})[0]?.OBP?.[
  //                     "1"
  //                   ]?.RateAfterTax || "0",
  //                 RatePlans: room?.RatePlans,
  //               }))
  //             : [];

  //         if (
  //           filteredProperties[0] &&
  //           filteredProperties[0].RoomData &&
  //           dayRate
  //         ) {
  //           filteredProperties[0].RoomData = filteredProperties[0].RoomData.map(
  //             (room) => {
  //               const matchedRate = dayRate.find(
  //                 (rate) => rate.RoomId == room.RoomId
  //               );
  //               return {
  //                 ...room,
  //                 RackRate: matchedRate?.RateBeforeTax
  //                   ? parseFloat(matchedRate.RateBeforeTax)
  //                   : room.RackRate,
  //                 MinInventory: matchedRate?.MinInventory
  //                   ? parseFloat(matchedRate?.MinInventory)
  //                   : 0,
  //                 RestrictionTitle: matchedRate?.RestrictionTitle,
  //                 RatePlans: matchedRate?.RatePlans
  //                   ? matchedRate?.RatePlans
  //                   : [],
  //               };
  //             }
  //           );
  //           setFilteredProperties([...filteredProperties]); // re-trigger state update
  //         }
  //       } catch (error) {
  //         console.error("Error fetching prices:", error);
  //       }
  //     }
  //   };
  //   // if (promoCodeContext1 || promoCodeContext) {
  //   // setPromoCodeContext(promoCodeContext || promoCodeContext1);
  //   fetchPrices();
  //   // }
  // }, [selectedPropertyId, isLoggedin]);

  // useEffect(() => {
  //   const storedData = sessionStorage?.getItem("paymentResponse");
  //   // const content = JSON.parse(sessionStorage?.getItem("contentData") || "[]");
  //   if (storedData) {
  //     //const parsed = JSON.parse(storedData);
  //     setCurrentStep(4);
  //     setIsWizardVisible(true);
  //   }
  //   if (!storedData) {
  //     sessionStorage?.removeItem("bookingData");
  //   }
  //   // if (Array.isArray(content.PropertyList)) {
  //   //   console.log("content1234", content.PropertyList);
  //   //   setPropertyList(content.PropertyList);

  //   // } else {
  //   //   console.error("Invalid Property");
  //   // }
  // }, [selectedStartDate, selectedEndDate]);

  function handleBlur() {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  }

  const handleFocus = () => {
    setIsFocused(true);
    const inputEl = inputRef.current;
    if (inputEl) {
      const rect = inputEl.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

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
  // useEffect(() => {
  //   if (cityName?.value) {
  //     fetch(
  //       `http://loyaltypulsedemo.ownyourcustomers.in/cmsapi/property/GetCityWithProperty?CityId=${parseInt(
  //         cityName.value
  //       )}`
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         // setProperties(data);
  //         // setSelectedProperty("");

  //         const propertyDropDown = [];

  //         data?.[0]?.propertyData?.forEach((property) => {
  //           const label = property.propertyName;
  //           const value = property.propertyId;

  //           propertyDropDown.push({ label, value });

  //           setPropertyDropDown(propertyDropDown);
  //         });
  //       });
  //   } else {
  //     setPropertyDropDown([]);
  //   }
  // }, [cityName]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (cityName?.value) {
          const response = await fetch(
            `http://loyaltypulsedemo.ownyourcustomers.in/cmsapi/property/GetCityWithProperty?CityId=${parseInt(
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
            const label = property.propertyName;
            const value = property.staahPropertyId;
            const property_Id = property.propertyId;
            const hotelBrandId = property.hotelBrandId;
            const propertySlug = property.propertySlug;
            const propData = {
              label,
              value,
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
          fetchContentData(propertyDropDown);
        } else {
          setPropertyDropDown([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperty();
  }, [cityName]);

  // Handle destination input change
  const handleCityChange = async (e) => {
    const input = e.target.value;
    // setIsFocused(true);
    // setDestination(input);
    setCityName(input);

    if (input) {
      try {
        const response = await fetch(
          `http://loyaltypulsedemo.ownyourcustomers.in/cmsapi/property/GetCityWithProperty?CityId=${parseInt(
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
          const label = property.propertyName;
          const value = property.staahPropertyId;
          const property_Id = property.propertyId;

          propertyDropDown.push({ label, value, property_Id });

          // setPropertyDropDown(propertyDropDown);
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
              name: property.PropertyData.Address.City,
              id: property.PropertyData.PropertyId,
            },
            {
              name: property.PropertyData.PropertyName,
              id: property.PropertyData.PropertyId,
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
    const userDetails = JSON.parse(localStorage?.getItem("userDetails"));
    if (userDetails) {
      setHandleSearched(true);
      setIsLoggedin(true);
      setIsOpenLogin(false);
      setIsOpenSignUp(false);
      fetchRatePrices(selectedPropertyId, true);
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
    } else {
      fetchRatePrices(selectedPropertyId);
    }
    setHasSearched(true);
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
      // const result = propertyList?.filter((property) => {
      //   const matchesDestination = selectedHotelName
      //     ? property.PropertyData.Address.City.toLowerCase().includes(
      //         selectedHotelName.toLowerCase()
      //       ) ||
      //       property.PropertyData.PropertyName.toLowerCase().includes(
      //         selectedHotelName.toLowerCase()
      //       )
      //     : true;
      //   return matchesDestination;
      // });
      // setFilteredProperties(result);
      // setHasSearched(true);

      setTimeout(() => {
        const element = document.getElementById(`property-div`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      ///setHandleSearched(false);
    }
    //  else {
    //   console.error("PropertyList is undefined or not an array");
    // }
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
    setSelectedPropertyId(suggestion.value);
    //setCMSPropertyId(suggestion.property_Id);
    setDestination(suggestion.label);
    setSelectedHotelName(suggestion.label); // Set the selected property ID
    // fetchRatePrices(suggestion.value);
    setSuggestions([]);
    fetchGalleryImages(suggestion.property_Id);
    fetchPropertyImages(suggestion.property_Id);
    const brandSlug = brandMap[suggestion.hotelBrandId] || "brand";
    const propertySlug = suggestion.propertySlug || "property";
    const url = `/${brandSlug}/${propertySlug}/hotel-overview`;
    setpropertyPageUrl(url);
    // Automatically filter properties when a suggestion is clicked
    // const result = propertyList.filter(
    //   (property) => property.PropertyData.PropertyId === suggestion.value
    // );
    // const propertyName =
    //   result.length > 0 ? result[0].PropertyData.PropertyName : null;
    // setSelectedHotelName(propertyName);
    // setFilteredProperties(result);
    //setHasSearched(true);
  };
  const handleGetDetails = (rooms, propertyData) => {
    const roomId = rooms.RoomId;
    // Count how many times this roomId is already selected

    const data = removeHtmlTags(propertyData.TermsAndConditions.Description);
    setTermsAndConditions(data);
    setProperty(propertyData);
    const roomCount = selectedRoom.filter(
      (room) => room.roomId === roomId
    ).length;

    if (roomCount > rooms.MinInventory) {
      if (rooms.MinInventory == 0) {
        //alert(`This room is not available for selected date`);
        toast.error("This room is not available for selected date.");
      } else {
        toast.error(
          `Only ${rooms.MinInventory} room(s) allowed for ${rooms.RoomName}`
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
            if (room.adults + room.children <= rooms.MaxGuest) {
              return {
                ...room,
                roomId: roomId,
                maxGuest: rooms.MaxGuest,
                maxAdult: rooms.MaxAdult,
                maxChildren: rooms.MaxChildren,
                roomName: rooms.RoomName,
                roomRate: rooms.RackRate,
                roomImage: rooms.Images[0],
              };
            } else {
              toast.error(
                `Only ${rooms.MaxGuest} guests including adults and Children are allowed for this room`
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
          if (prev[0].children + prev[0].adults <= rooms.MaxGuest) {
            const first = prev[0];
            return [
              {
                id: first?.id,
                roomId: roomId,
                maxGuest: rooms.MaxGuest,
                maxAdult: rooms.MaxAdult,
                maxChildren: rooms.MaxChildren,
                roomName: rooms.RoomName,
                roomRate: rooms.RackRate,
                roomImage: rooms.Images[0],
                adults: first?.adults,
                children: first?.children,
              },
              ...prev.slice(1),
            ];
          } else {
            toast.error(
              `Only ${rooms.MaxGuest} guests including adults and Children are allowed for this room`
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
              roomName: rooms.RoomName,
              roomRate: rooms.RackRate,
              roomImage: rooms.Images[0],
              adults: 1,
              children: 0,
              extraAdultRate: rooms.ExtraAdultRate,
            },
          ];
        }
      });
    }

    setSelectedRoomRate({ roomId: roomId, roomRate: rooms.RackRate });

    setTimeout(() => {
      document
        .getElementById(`RoomPopupModal-${roomId}`)
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // const handleSelectMemberRate = (mapping, rate, rooms, packageRate, adultRate) => {

  //   setIsOpenLogin(true);
  //   if (!rooms.RestrictionTitle && rooms.RestrictionTitle == "") {
  //     handleMemberRatePlanSelect(mapping, rooms);
  //   }
  // }
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
      if (!rooms.RestrictionTitle && rooms.RestrictionTitle == "") {
        SelectedRoomWithOffer(mapping);
        if (selectedRoomDetails?.id) {
          const roomCount = selectedRoom.filter(
            (room) => room.roomId === rooms.RoomId
          ).length;
          if (roomCount <= rooms.MinInventory) {
            setSelectedRoom((prev) =>
              prev.map((room, index) =>
                room?.id === selectedRoomDetails?.id &&
                room.adults <= room.maxAdult &&
                parseInt(room.adults) + parseInt(room.children) <= room.maxGuest
                  ? {
                      ...room,
                      roomPackage: rate.RateName,
                      rateId: rate.RateId,
                      applicableGuest: mapping.ApplicableGuest,
                      applicableAdult: mapping.ApplicableAdult,
                      applicableChild: mapping?.ApplicableChild
                        ? mapping?.ApplicableChild
                        : 0,
                      roomRateWithTax: parseInt(
                        rooms?.RatePlans?.find(
                          (element) => element.RateId === mapping.RateId
                        )?.Rates?.[
                          Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                        ]?.OBP?.[prev[index]?.adults?.toString()]
                          ?.RateAfterTax || "0"
                      ),
                      packageRate:
                        rooms?.RatePlans?.find(
                          (element) => element.RateId === mapping.RateId
                        )?.Rates?.[
                          Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                        ]?.OBP?.[prev[index]?.adults?.toString()]
                          ?.RateBeforeTax || "0",
                      roomAdultExtraCharge:
                        parseInt(
                          rooms?.RatePlans?.find(
                            (element) => element.RateId === mapping.RateId
                          )?.Rates?.[
                            Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                          ]?.OBP?.[prev[index]?.adults?.toString()]
                            ?.RateAfterTax || "0"
                        ) -
                        parseInt(
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
              `Only ${rooms.MinInventory} room(s) allowed for ${rooms.RoomName}`
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
                      pacRate?.[prev[0].adults.toString()]?.RateAfterTax || "0"
                    ) - parseFloat(pacRate?.[0]?.RateAfterTax || "0"),
                  packageRate: parseFloat(
                    pacRate?.[prev[0].adults.toString()]?.RateBeforeTax || "0"
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
        toast.error(rooms.RestrictionTitle);
      }
    }
    // if (!rooms.RestrictionTitle && rooms.RestrictionTitle == "") {
    //   handleMemberRatePlanSelect(mapping, rooms);
    // }
  };

  const handleSelectRoom = (mapping, rate, rooms, packageRate, adultRate) => {
    if (!rooms.RestrictionTitle && rooms.RestrictionTitle == "") {
      handleRatePlanSelect(mapping, rooms);
      SelectedRoomWithOffer(mapping);
      if (selectedRoomDetails?.id) {
        const roomCount = selectedRoom.filter(
          (room) => room.roomId === rooms.RoomId
        ).length;
        if (roomCount <= rooms.MinInventory) {
          setSelectedRoom((prev) =>
            prev.map((room, index) =>
              room?.id === selectedRoomDetails?.id &&
              room.adults <= room.maxAdult &&
              parseInt(room.adults) + parseInt(room.children) <= room.maxGuest
                ? {
                    ...room,
                    roomPackage: rate.RateName,
                    rateId: rate.RateId,
                    applicableGuest: mapping.ApplicableGuest,
                    applicableAdult: mapping.ApplicableAdult,
                    applicableChild: mapping?.ApplicableChild
                      ? mapping?.ApplicableChild
                      : 0,
                    roomRateWithTax: parseInt(
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
                      parseInt(
                        rooms?.RatePlans?.find(
                          (element) => element.RateId === mapping.RateId
                        )?.Rates?.[
                          Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                        ]?.OBP?.[prev[index]?.adults?.toString()]
                          ?.RateAfterTax || "0"
                      ) -
                      parseInt(
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
            `Only ${rooms.MinInventory} room(s) allowed for ${rooms.RoomName}`
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
                    pacRate?.[prev[0].adults.toString()]?.RateAfterTax || "0"
                  ) - parseFloat(pacRate?.[0]?.RateAfterTax || "0"),
                packageRate: parseFloat(
                  pacRate?.[prev[0].adults.toString()]?.RateBeforeTax || "0"
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
      toast.error(rooms.RestrictionTitle);
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
    //const content = JSON.parse(sessionStorage?.getItem("contentData") || "[]");
    const cityData = JSON.parse(
      sessionStorage?.getItem("cityDropDown") || "[]"
    );
    setCityDropDown(cityData);
    // const propDropDown = [];
    // let selectedLabel = "";
    // let selectedHotel = "";

    // content?.PropertyList?.forEach((property) => {
    //   const label = `${property.PropertyData.PropertyName}, ${property.PropertyData.Address.City}, ${property.PropertyData.Address.State}`;
    //   const value = property.PropertyData.PropertyId;

    //   propDropDown.push({ label, value });

    //   if (value == selectedProperty) {
    //     selectedLabel = label;
    //     selectedHotel = property.PropertyData.PropertyName;
    //   }
    // });

    // // setPropertyDropDown(propDropDown);
    // setDestination(selectedLabel);
    // setSelectedHotelName(selectedHotel);

    // if (Array.isArray(content?.PropertyList)) {
    //   setPropertyList(content?.PropertyList);
    // }
    // else {
    //   console.error("Invalid Property");
    // }
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
    // }
    // else {
    //   //setPromoCode(promoCode);
    //   setSelectedStartDate(rangeStart);
    //   setSelectedEndDate(rangeEnd);
    // }

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
  };

  const toggleBookNow = (id) => {
    setActiveHotel((prev) => (prev === id ? null : id));
  };

  const toggleAmenitiesPopup = () => {
    setShowAllAmenities(!showAllAmenities);
  };

  // const removeHtmlTags = (htmlString) => {
  //   return htmlString
  //     .replace(/\n|\t/g, "")
  //     .replace(/<\/?ul>/g, "")
  //     .replace(/<br\s*\/?>/g, "")
  //     .replace(/&nbsp;/g, " ")
  //     .replace(/<span\s*\/?>/g, "")
  //     .replace(/<\/?p>/g, "");
  // };
  const removeHtmlTags = (htmlString) => {
    return htmlString
      .replace(/\n|\t/g, "")
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

      setHandleSearched(true);
      setIsLoggedin(true);
      setIsOpenLogin(false);
      setIsOpenSignUp(false);
      fetchRatePrices(selectedPropertyId, true);

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

      setHandleSearched(true);
      setIsLoggedin(true);
      setIsOpenLogin(false);
      fetchRatePrices(selectedPropertyId, true);
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
  // const categoryImages = {
  //   hotel: [
  //     { src: "/booking-engine-imgs/images/mountain-view.jpg", title: "Facade" },
  //     { src: "/booking-engine-imgs/images/offer-pp.jpg", title: "Facade" },
  //   ],
  //   rooms: [
  //     { src: "/booking-engine-imgs/images/mountain-view.jpg", title: "Deluxe Room" },
  //     { src: "/booking-engine-imgs/images/offer-pp.jpg", title: "Superior Room" },
  //   ],
  //   facilities: [
  //     { src: "/booking-engine-imgs/images/mountain-view.jpg", title: "Fitness Centre (GYM)" },
  //     { src: "/booking-engine-imgs/images/offer-pp.jpg", title: "EV Charging" },
  //   ],
  //   events: [
  //     { src: "/booking-engine-imgs/images/mountain-view.jpg", title: "Event Image 1" },
  //     { src: "/booking-engine-imgs/images/offer-pp.jpg", title: "Event Image 2" },
  //   ],
  //   restaurant: [
  //     { src: "/booking-engine-imgs/images/mountain-view.jpg", title: "Restaurant" },
  //     { src: "/booking-engine-imgs/images/offer-pp.jpg", title: "Restaurant" },
  //   ],
  // };
  // const categories = Object.keys(categoryImages);

  // const handleReadMore = (room) => {
  //   setViewMoreRoom(room);
  //   setShowRoomsModal(true);
  //   const modalEl = document.getElementById('RoomPopupModal');
  //   if (modalEl) {
  //     const modal = new window.bootstrap.Modal(modalEl);
  //     modal.show();
  //   }
  // };

  const handleReadMore = (room) => {
    setViewMoreRoom(room);
    setShowRoomsModal(true);
  };

  // useEffect(() => {
  //   if (showRoomsModal) {
  //     const modalEl = document.getElementById('RoomPopupModal');
  //     if (modalEl) {
  //       const modal = new window.bootstrap.Modal(modalEl);
  //       modal.show();

  //       // cleanup on modal close
  //       modalEl.addEventListener('hidden.bs.modal', () => {
  //         setShowRoomsModal(false);
  //         setViewMoreRoom(null);
  //       }, { once: true });
  //     }
  //   }
  // }, [showRoomsModal]);
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

  return (
    <>
      {/* <section className="banner-section">
        <div className="banner-image">
          <div className="banner-search-btn">
            {!isVisible && (
              <a
                className="banner-search-btn-link"
                onClick={showBookingEngine}
                id="booking-engine-btn"
              >
                <Search></Search>
              </a>
            )}
          </div>
        </div>
      </section> */}
      {/* {isLoaderOverlay ? (
        <div className="loader-overlay" id="page-loader" hidden>
          <div className="loader-ring"></div>
        </div>
      ) : ( */}
      <section
        className={`booking-form-wrapper toggle-div ${
          isVisible ? "visible" : "hidden"
        }`}
      >
        {/* <section id="filter-bar-search" className={`booking-form-wrapper toggle-div ${isVisible ? "visible" : "hidden"}`}> */}

        <div
          id="booking-bar"
          className={`booking-bar ${isClassAddedBook ? "fullscreen" : ""}`}
        >
          {isVisible && (
            <div className="hide-booking-engine" onClick={hideBookingEngine}>
              CLOSE &nbsp;
              {/* <Image alt="close icon" width="25" height="25" src="/cin-booking/images/white_close_icon.svg" style={{ width: '25px', height: '25px' }} /> */}
              <FontAwesomeIcon icon={faXmark} />
            </div>
          )}
          <div className="booking-bar-form">
            {/* {selectedProperty == 0 && (
                <> */}

            <div className="col-3 main-bx-field filter-item position-relative1">
              <Select
                options={cityDropDown}
                value={cityName}
                onChange={(selected) => setCityName(selected)}
                placeholder="Select city..."
                isClearable
                className="form-control for-city-selectionn"
              />
              {/* <input
                type="text"
                value={cityName}
                onChange={handleCityChange}
                placeholder="Search hotel/city"
                className="form-control"
                aria-label="Search Hotel/City"
                required
                autoComplete="off"
              />

              {cityDropDown.length > 0 && (
                <ul
                  className={`list-group position-absolute w-100 zindex-dropdown1 ${
                    dropUp ? "drop-up" : ""
                  }`}
                  style={{
                    bottom: dropUp ? "100%" : "auto",
                    top: dropUp ? "auto" : "100%",
                    maxHeight: "350px",
                    overflowY: "auto",
                  }}
                >
                  {cityDropDown.map((suggestion, index) => (
                    <li
                      key={index}
                      className="list-group-item1"
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                      style={{ cursor: "pointer" }}
                    >
                      {suggestion.label}
                    </li>
                  ))}
                </ul>
              )} */}
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
            {/* </>
              )
              } */}
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
                <FontAwesomeIcon
                  icon={faSearch}
                  className="this-search-for-desk"
                />
              </button>
            </div>
          </div>

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
                  {hasSearched && filteredProperties?.length === 0 ? (
                    <div className="repeated-div-property">
                      <p>No properties found matching your criteria.</p>
                    </div>
                  ) : (
                    <div className="repeated-div-property">
                      {filteredProperties?.map((property) => (
                        <div
                          key={property.PropertyData.PropertyId}
                          className="card rounded-3 mb-3"
                          id={`hotel-${property.PropertyData.PropertyId}`}
                        >
                          <div className="row g-0">
                            <div className="col-md-10">
                              <div className="row">
                                <div className="col-md-4 col-sm-4">
                                  <Image
                                    src={
                                      propertyImages?.[0]?.images &&
                                      propertyImages?.[0]?.images.length > 0
                                        ? propertyImages?.[0]?.images[0]
                                            .propertyImage
                                        : dummyImage
                                    }
                                    alt="alt"
                                    width={500}
                                    height={200}
                                    className="img-fluid rounded-3 property-image"
                                  />
                                </div>
                                <div className="col-md-8 col-sm-8">
                                  <div className="card-body p-0">
                                    <div className="property-main-content">
                                      <p className="hotel-info mb-1">
                                        <span>
                                          {property.PropertyData.PropertyName}
                                        </span>
                                      </p>

                                      <div className="property-reviewss">
                                        <div className="d-flex">
                                          {/* <Image
                                          src="/booking-engine-imgs/images/google-icon.svg"
                                          className="ratin-icon"
                                          height={30}
                                          width={30}
                                          alt="icon"
                                        /> */}

                                          {propertyImages?.[0]?.ratingReview &&
                                            propertyImages?.[0]?.ratingReview
                                              .length > 0 && (
                                              <span className="ratingvalue font-swiss-721">
                                                {
                                                  propertyImages?.[0]
                                                    ?.ratingReview?.[0]
                                                    ?.googleRating
                                                }
                                                &nbsp; | &nbsp; &nbsp;
                                              </span>
                                            )}
                                          {propertyImages?.[0]
                                            ?.addressDetails &&
                                            propertyImages?.[0]?.addressDetails
                                              .length > 0 && (
                                              <p className="review-font font-swiss-721">
                                                <FontAwesomeIcon
                                                  icon={faPlane}
                                                />{" "}
                                                &nbsp;
                                                {
                                                  propertyImages?.[0]
                                                    ?.addressDetails?.[0]
                                                    ?.airportDistance
                                                }
                                                &nbsp; | &nbsp; &nbsp;
                                              </p>
                                            )}
                                          {propertyImages?.[0]
                                            ?.addressDetails &&
                                            propertyImages?.[0]?.addressDetails
                                              .length > 0 && (
                                              <p className="review-font font-swiss-721">
                                                <FontAwesomeIcon
                                                  icon={faTrain}
                                                />
                                                &nbsp;{" "}
                                                {
                                                  propertyImages?.[0]
                                                    ?.addressDetails?.[0]
                                                    ?.railWay
                                                }
                                              </p>
                                            )}
                                        </div>
                                      </div>

                                      <div className="hotel-dist mt-2">
                                        {/* <Image
                                        src="/booking-engine-imgs/images/location-map.png"
                                        height={30}
                                        width={30}
                                        alt="icon"
                                        className="amenity-icon"
                                      /> */}

                                        <span className="highlight-Text">
                                          <Map
                                            size={12}
                                            className="d-inline-block"
                                          ></Map>{" "}
                                          {property.PropertyData.Address.City}
                                        </span>
                                        <span className="drive">
                                          {`${property.PropertyData.Address.AddressLine}, ${property.PropertyData.Address.City}, ${property.PropertyData.Address.State}, ${property.PropertyData.Address.Country}, ${property.PropertyData.Address.PostalCode}`}
                                        </span>
                                      </div>

                                      <p className="hotel-info mt-2 pb-2 mb-0 text-justify mobile-hidden-text">
                                        {/* {property.PropertyData.PropertyDescription} */}
                                        {stripHtml(
                                          property.PropertyData
                                            .PropertyDescription || ""
                                        ).slice(0, 90)}
                                        ...
                                        <Link
                                          href="#"
                                          className="read-more-btn-propery"
                                          data-bs-toggle="modal"
                                          data-bs-target="#PropertyPopupModal"
                                        >
                                          Read More
                                        </Link>
                                      </p>

                                      {ReactDOM.createPortal(
                                        <div
                                          className="modal fade"
                                          id="PropertyPopupModal"
                                          tabIndex="-1"
                                          aria-labelledby="PropertyPopupModal"
                                          aria-hidden="true"
                                        >
                                          <div className="modal-dialog modal-lg">
                                            <div className="modal-content property-popup-modal-content">
                                              <div className="modal-body position-relative">
                                                <button
                                                  type="button"
                                                  className="btn-close position-absolute"
                                                  style={{
                                                    top: 10,
                                                    right: 10,
                                                  }}
                                                  data-bs-dismiss="modal"
                                                  aria-label="Close"
                                                >
                                                  x
                                                </button>
                                                <div
                                                  id="categoryView"
                                                  className="hotel-category-img-tabs"
                                                >
                                                  {activeView === "category" ? (
                                                    <>
                                                      <div className="border-0 mb-3 text-start">
                                                        <h5 className="modal-title text-start">
                                                          {/* Alivaa Hotel, Sohna Road City Center, Gurgaon */}
                                                          {
                                                            property
                                                              .PropertyData
                                                              .PropertyName
                                                          }
                                                        </h5>
                                                      </div>
                                                      <div className="row">
                                                        {categoryImages &&
                                                          categoryImages.map(
                                                            (galImage, idx) => (
                                                              <div
                                                                className="col-6"
                                                                key={idx}
                                                              >
                                                                <div
                                                                  className="category-card large-cardd"
                                                                  onClick={() =>
                                                                    openGallery(
                                                                      idx,
                                                                      galImage?.galleryCategory
                                                                    )
                                                                  }
                                                                >
                                                                  <Image
                                                                    src={
                                                                      galImage?.galleryImages &&
                                                                      galImage
                                                                        ?.galleryImages
                                                                        .length >
                                                                        0
                                                                        ? galImage
                                                                            ?.galleryImages[0]
                                                                            .image
                                                                        : dummyImage
                                                                    }
                                                                    alt="Hotel"
                                                                    width={200}
                                                                    height={150}
                                                                    className="img-fluid"
                                                                    style={{
                                                                      objectFit:
                                                                        "cover",
                                                                      width:
                                                                        "100%",
                                                                      height:
                                                                        "100%",
                                                                    }}
                                                                  />
                                                                  <div className="card-body">
                                                                    <h6>
                                                                      {
                                                                        galImage?.galleryCategory
                                                                      }{" "}
                                                                      →
                                                                    </h6>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            )
                                                          )}
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <div>
                                                      <button
                                                        className="btn btn-link mb-2"
                                                        onClick={() =>
                                                          setActiveView(
                                                            "category"
                                                          )
                                                        }
                                                      >
                                                        ← Back
                                                      </button>
                                                      <ul className="nav nav-tabs mb-3">
                                                        {categoryImages.map(
                                                          (cat, indx) => (
                                                            <li
                                                              className="nav-item"
                                                              key={indx}
                                                            >
                                                              <button
                                                                className={`nav-link ${
                                                                  cat.galleryCategory ===
                                                                  galleryCategory
                                                                    ? "active"
                                                                    : ""
                                                                }`}
                                                                onClick={() => {
                                                                  setActiveCategory(
                                                                    indx
                                                                  );
                                                                  setGalleryCategory(
                                                                    cat.galleryCategory
                                                                  );
                                                                  setCurrentSlide(
                                                                    1
                                                                  );
                                                                }}
                                                              >
                                                                {cat.galleryCategory
                                                                  .charAt(0)
                                                                  .toUpperCase() +
                                                                  cat.galleryCategory.slice(
                                                                    1
                                                                  )}
                                                              </button>
                                                            </li>
                                                          )
                                                        )}
                                                      </ul>

                                                      <Swiper
                                                        onSwiper={(swiper) =>
                                                          (swiperRef.current =
                                                            swiper)
                                                        }
                                                        onSlideChange={(
                                                          swiper
                                                        ) =>
                                                          setCurrentSlide(
                                                            swiper.activeIndex +
                                                              1
                                                          )
                                                        }
                                                        navigation
                                                        modules={[Navigation]}
                                                      >
                                                        {(
                                                          categoryImages[
                                                            activeCategory
                                                          ]?.galleryImages || []
                                                        ).map((img, i) => (
                                                          <SwiperSlide key={i}>
                                                            <img
                                                              src={img.image}
                                                              alt={
                                                                img.galleryCategory
                                                              }
                                                              className="w-100"
                                                              style={{
                                                                objectFit:
                                                                  "cover",
                                                                height: 400,
                                                                cursor:
                                                                  "pointer",
                                                              }}
                                                            />
                                                            <div className="text-center mt-2">
                                                              <p
                                                                className="mb-0 text-muted"
                                                                style={{
                                                                  fontSize: 14,
                                                                }}
                                                              >
                                                                {
                                                                  categoryImages[
                                                                    activeCategory
                                                                  ]
                                                                    .galleryCategory
                                                                }
                                                              </p>
                                                              {/* <h5
                                                              style={{
                                                                fontSize: 16,
                                                              }}
                                                            >
                                                              {
                                                                categoryImages[
                                                                  activeCategory
                                                                ].galleryTitle
                                                              }
                                                            </h5> */}
                                                            </div>
                                                          </SwiperSlide>
                                                        ))}
                                                      </Swiper>

                                                      <div
                                                        className="image-counter text-center mt-2 text-muted"
                                                        style={{
                                                          fontSize: 14,
                                                        }}
                                                      >
                                                        {currentSlide}/
                                                        {categoryImages[
                                                          activeCategory
                                                        ]?.galleryImages
                                                          ?.length || 0}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                                <div className="bottom-modal-content">
                                                  <div className="property-description mt-3">
                                                    <div className="property-amenitiess mt-4">
                                                      <div className="row">
                                                        {property.PropertyData
                                                          ?.Amenities &&
                                                          Object.entries(
                                                            property
                                                              .PropertyData
                                                              .Amenities
                                                          ).map(
                                                            (
                                                              [category, items],
                                                              catIndex
                                                            ) => (
                                                              <div
                                                                className="col-lg-4 col-md-6 col-sm-6"
                                                                key={`cat-${catIndex}`}
                                                              >
                                                                <h6 className="amenity-ttile">
                                                                  {/* <Image
                                                                  src="/booking-engine-imgs/images/bellboy.png"
                                                                  className="amenity-title-img"
                                                                  height={20}
                                                                  width={20}
                                                                  alt="Bed icon"
                                                                /> */}
                                                                  {category}
                                                                </h6>
                                                                <ul className="ms-2 ps-0">
                                                                  {Array.isArray(
                                                                    items
                                                                  ) &&
                                                                    items.map(
                                                                      (
                                                                        item,
                                                                        itemIndex
                                                                      ) => (
                                                                        <li
                                                                          key={`item-${catIndex}-${itemIndex}`}
                                                                          className="list-item"
                                                                        >
                                                                          {item}
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
                                          </div>
                                        </div>,
                                        document.body
                                      )}
                                      <div className="hotels-amenities mt-3 mobile-hidden-text">
                                        {/* <p><b>Features & Amenities</b></p> */}
                                        {property.PropertyData.Amenities &&
                                          Object.entries(
                                            property.PropertyData.Amenities
                                          )
                                            .slice(0, 1)
                                            .map(([category, items]) => (
                                              <div key={category}>
                                                <ul className="property-amenities">
                                                  {Array.isArray(items) &&
                                                    items
                                                      .slice(0, 8)
                                                      .map((item, index) => (
                                                        <li key={index}>
                                                          <FontAwesomeIcon
                                                            icon={faDiamond}
                                                          />{" "}
                                                          {item}
                                                        </li>
                                                      ))}
                                                </ul>
                                                {/* <Link href="#" className="amenities-read-more read-more-btn-propery">view more</Link> */}
                                                {Array.isArray(items) &&
                                                  items.length > 0 && (
                                                    <Link
                                                      href="#"
                                                      onClick={() =>
                                                        toggleAmenitiesPopup(
                                                          property.PropertyData
                                                            .PropertyId
                                                        )
                                                      }
                                                      className="amenities-read-more read-more-btn-propery"
                                                      data-bs-toggle="modal"
                                                      data-bs-target={`#amenitiesModal-${property.PropertyData.PropertyId}`}
                                                    >
                                                      View Amenities
                                                    </Link>
                                                  )}
                                              </div>
                                            ))}
                                      </div>
                                      {ReactDOM.createPortal(
                                        <div
                                          className="modal fade"
                                          id={`amenitiesModal-${property.PropertyData.PropertyId}`}
                                          tabIndex="-1"
                                          aria-labelledby={`amenitiesModalLabel-${property.PropertyData.PropertyId}`}
                                          aria-hidden="true"
                                        >
                                          <div className="modal-dialog modal-dialog-centered modal-lg text-start">
                                            <div className="modal-content">
                                              <div className="p-3">
                                                <h5
                                                  className="modal-title text-start"
                                                  id={`amenitiesModalLabel-${property.PropertyData.PropertyId}`}
                                                >
                                                  {
                                                    property.PropertyData
                                                      .PropertyName
                                                  }{" "}
                                                  Amenities
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
                                              <div className="modal-body">
                                                <div className="popup-box-contentrj">
                                                  <div className="popup-amenity-items">
                                                    {Object.entries(
                                                      property.PropertyData
                                                        .Amenities
                                                    ).map(
                                                      ([category, items]) =>
                                                        Array.isArray(items) &&
                                                        items.map(
                                                          (item, index) => (
                                                            <span key={index}>
                                                              {" "}
                                                              <FontAwesomeIcon
                                                                icon={faDiamond}
                                                              />{" "}
                                                              {item}
                                                            </span>
                                                          )
                                                        )
                                                    )}
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
                            <div className="col-md-2">
                              <div className="price-detail-right">
                                {/* <div className="price-details">
                                <span>Starting Rate/Night</span>
                                <p className="priceText mb-3 property-price-text">
                                  ₹{" "}
                                  {Math.min(
                                    ...property.RoomData.map(
                                      (room) => room.RackRate
                                    ).filter((rate) => rate > 0)
                                  )}{" "}
                                  <span className="sm-text-price">
                                    {" "}
                                    + Taxes
                                  </span>
                                </p>
                              </div> */}
                                <div className="price-details">
                                  <span>Starting Rate/Night</span>
                                  <p className="priceText mb-3 property-price-text">
                                    ₹{" "}
                                    {(() => {
                                      const rates = property?.RoomData?.map(
                                        (room) => room.RackRate
                                      ).filter(
                                        (rate) =>
                                          typeof rate === "number" && rate > 0
                                      );
                                      return rates.length > 0
                                        ? Math.min(...rates)
                                        : "0";
                                    })()}{" "}
                                    <span className="sm-text-price">
                                      {" "}
                                      + Taxes
                                    </span>
                                  </p>
                                </div>

                                <div className="book-a-stay">
                                  <Link
                                    href="#"
                                    className="property-read-more read-more-btn-propery"
                                    onClick={(e) => {
                                      e.preventDefault(); // prevent navigating to "#"
                                      handleVisitHotel(propertyPageUrl); // call your function
                                    }}
                                  >
                                    visit hotel
                                  </Link>
                                  <button
                                    className={`btn btn-primary accordion-button ${
                                      isHandleBookNow ? "handle-book-now" : ""
                                    }`}
                                    onClick={() => {
                                      handleBookNow(
                                        property.PropertyData.PropertyId,
                                        property.PropertyData.PropertyName,
                                        property.PropertyData.Address.Phone
                                      );
                                    }}
                                  >
                                    View Rates
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {activeHotel === property.PropertyData.PropertyId && (
                            <div
                              className="book-now-content"
                              // id={`hotel-${property.PropertyData.PropertyId}`}
                            >
                              <div className="accordion-body mt-4">
                                {Array.isArray(property.RoomData) &&
                                property.RoomData.length > 0 ? (
                                  property.RoomData.map((rooms) => (
                                    <div key={rooms.RoomId} className="row g-0">
                                      <div className="col-md-10">
                                        <div className="row">
                                          <div className="col-md-4">
                                            <div className="">
                                              {rooms.Images &&
                                              rooms.Images.length > 0 ? (
                                                <img
                                                  src={rooms.Images[0]}
                                                  alt={`Hotel Image`}
                                                  width={500}
                                                  height={200}
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
                                                  <span>{rooms.RoomName}</span>
                                                </p>

                                                <div className="room-type-single">
                                                  {/* <p className="bold-text1 mb-0">
                                                    {rooms.RoomView} &nbsp; |
                                                    &nbsp;&nbsp;
                                                  </p> */}

                                                  <p className="bold-text1 mb-0">
                                                    Up to {rooms.MaxGuest}{" "}
                                                    Guests &nbsp; | &nbsp;&nbsp;
                                                  </p>

                                                  <p className="bold-text1 mb-0">
                                                    {rooms.RoomSize}
                                                  </p>
                                                </div>

                                                <div className="tile-placeholder text-justify py-2 pr-3 mobile-hidden-text1">
                                                  {stripHtml(
                                                    rooms.RoomDescription || ""
                                                  ).slice(0, 180)}
                                                  ...
                                                  <Link
                                                    href="#"
                                                    className="read-more-btn-propery"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#RoomPopupModal-${rooms.RoomId}`}
                                                  >
                                                    Read More
                                                  </Link>
                                                  {/* <button className="read-more-btn-propery"
                                                  onClick={() => handleReadMore(rooms)}>
                                                  Read More
                                                </button> */}
                                                  {ReactDOM.createPortal(
                                                    <div
                                                      className="modal fade"
                                                      id={`RoomPopupModal-${rooms.RoomId}`}
                                                      tabIndex="-1"
                                                      aria-labelledby={`roomModalLabel-${rooms.RoomId}`}
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
                                                            {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">CLOSE <Image src="./booking-engine-imgs/images/white_close_icon.svg" alt="close icon" width={25} height={25} style={{ width: '25px', height: '25px' }} /></button> */}
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

                                                            {/* Description & Amenities */}
                                                            <div className="bottom-modal-content">
                                                              <div className="property-description mt-3 px-3">
                                                                {/* <p><i className="fa-solid fa-location-dot"></i> Spaze Boulevard II, Badshahpur Sohna Rd Hwy, Malibu Town, Sector 47, Gurugram</p> */}
                                                                {/* <p>{viewMoreRoom.RoomDescription}</p> */}
                                                                <p>
                                                                  {stripHtml(
                                                                    rooms.RoomDescription ||
                                                                      ""
                                                                  )}
                                                                </p>
                                                              </div>

                                                              <div className="property-amenitiess mt-4 px-3">
                                                                <div className="row">
                                                                  {/* <div className="col-lg-4 col-md-6">
                                                                  <h6 className="amenity-ttile">
                                                                    Beds and
                                                                    Bedding
                                                                  </h6>
                                                                  <ul>
                                                                    {Array.isArray(
                                                                      rooms.Bedding
                                                                    ) &&
                                                                      rooms.Bedding.map(
                                                                        (
                                                                          item,
                                                                          itemIndex
                                                                        ) => (
                                                                          <li
                                                                            key={`bedding-${itemIndex}`}
                                                                            className="list-bedding"
                                                                          >
                                                                            {
                                                                              item.BedType
                                                                            }
                                                                          </li>
                                                                        )
                                                                      )}
                                                                  </ul>
                                                                </div> */}
                                                                  {Array.isArray(
                                                                    rooms.Bedding
                                                                  ) &&
                                                                    rooms.Bedding.some(
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
                                                                          {rooms.Bedding.map(
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

                                                                  {rooms.RoomAmenities &&
                                                                    Object.entries(
                                                                      rooms.RoomAmenities
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
                                                                            {/* <Image src="images/bellboy.png" className="amenity-title-img" height={20} width={20} alt="Bed icon" /> */}
                                                                            {/* Beds and Bedding */}
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

                                                <div className="facilities-roomm pb-2 mobile-hidden-text1">
                                                  <span className="s-room-amenitiess">
                                                    {Object.entries(
                                                      rooms.RoomAmenities
                                                    )
                                                      .slice(0, 1)
                                                      .map(
                                                        ([category, items]) => (
                                                          <ul
                                                            key={`${rooms.RoomId}-${category}`}
                                                            className="single-room-amenities"
                                                          >
                                                            {Array.isArray(
                                                              items
                                                            ) &&
                                                              items.map(
                                                                (
                                                                  item,
                                                                  index
                                                                ) => (
                                                                  <li
                                                                    key={`${rooms.RoomId}-${index}`}
                                                                  >
                                                                    {item}
                                                                  </li>
                                                                )
                                                              )}
                                                          </ul>
                                                        )
                                                      )}
                                                    <button
                                                      className="view-amenities-btn room-view-more-amenities"
                                                      data-bs-toggle="modal"
                                                      data-bs-target={`#amenities-modal-${rooms.RoomId}`}
                                                    >
                                                      view more
                                                    </button>
                                                  </span>

                                                  {ReactDOM.createPortal(
                                                    <div
                                                      className="modal fade"
                                                      id={`amenities-modal-${rooms.RoomId}`}
                                                      tabIndex="-1"
                                                      aria-labelledby={`amenitiesModalLabel-${rooms.RoomId}`}
                                                      aria-hidden="true"
                                                    >
                                                      <div className="modal-dialog modal-dialog-centered modal-lg">
                                                        <div className="modal-content">
                                                          <div className="modal-header">
                                                            <h5
                                                              className="modal-title"
                                                              id={`amenitiesModalLabel-${rooms.RoomId}`}
                                                            >
                                                              {rooms.RoomName}{" "}
                                                              Amenities
                                                            </h5>
                                                            <button
                                                              type="button"
                                                              className="btn-close"
                                                              data-bs-dismiss="modal"
                                                              aria-label="Close"
                                                            >
                                                              {/* CLOSE{" "}
                                                            <Image
                                                              src="./booking-engine-imgs/images/white_close_icon.svg"
                                                              alt="close icon"
                                                              width={25}
                                                              height={25}
                                                              style={{
                                                                width: "25px",
                                                                height: "25px",
                                                              }}
                                                            /> */}
                                                              x
                                                            </button>
                                                          </div>
                                                          <div className="modal-body pt-0">
                                                            <div className="popup-amenity-items">
                                                              {Object.entries(
                                                                rooms.RoomAmenities
                                                              ).map(
                                                                ([
                                                                  category,
                                                                  items,
                                                                ]) => (
                                                                  <div
                                                                    key={`category-${rooms.RoomId}-${category}`}
                                                                  >
                                                                    <h6 className="amenity-category mt-4">
                                                                      {category}
                                                                    </h6>
                                                                    {Array.isArray(
                                                                      items
                                                                    ) &&
                                                                      items.map(
                                                                        (
                                                                          item,
                                                                          index
                                                                        ) => (
                                                                          <span
                                                                            key={`amenity-${rooms.RoomId}-${category}-${index}`}
                                                                          >
                                                                            <FontAwesomeIcon
                                                                              icon={
                                                                                faDiamond
                                                                              }
                                                                              className="me-2"
                                                                            />{" "}
                                                                            {
                                                                              item
                                                                            }
                                                                          </span>
                                                                        )
                                                                      )}
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
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-2">
                                        <div className="price-detail-right">
                                          {/* <div className="text-end mt-0">
                                          <p className="room-left-class">
                                             Only {rooms.MinInventory} Rooms Left
                                          </p>
                                        </div> */}
                                          {/* <div className="price-details mt-0">
                                         
                                          <div className="make-flex">

                                            <p className="priceText mb-0 mt-1 property-price-text">₹ &nbsp;

                                                  {
                                                (() => {
                                                  const ratePlans = rooms?.RatePlans || [];
                                                  let minRate = Infinity;

                                                  ratePlans.forEach(plan => {
                                                    const firstRateKey = Object.keys(plan?.Rates || {})[0];
                                                    const rate = parseFloat(
                                                      plan?.Rates?.[firstRateKey]?.OBP?.["1"]?.RateBeforeTax || "0"
                                                    );
                                                    if (!isNaN(rate) && rate < minRate) {
                                                      minRate = rate;
                                                    }
                                                  });

                                                  return isFinite(minRate) ? parseInt(minRate) : 0;
                                                })()
                                              }<span className="sm-text-price"> INR/Night</span>

                                            </p>

                                            

                                            <p className="price-details">
                                              <span>Plus ₹1,043.10 in taxes</span>
                                            </p>
                                          </div>
                                        </div> */}
                                          <div className="price-details mt-0">
                                            <div className="make-flex">
                                              {/* <p className="lineThrough">₹ 5,999</p> */}

                                              <p className="priceText mb-0 mt-1 property-price-text">
                                                ₹&nbsp;
                                                {(() => {
                                                  const ratePlans =
                                                    rooms?.RatePlans || [];
                                                  let minRate = Infinity;

                                                  ratePlans.forEach((plan) => {
                                                    const firstRateKey =
                                                      Object.keys(
                                                        plan?.Rates || {}
                                                      )[0];
                                                    const rate = parseFloat(
                                                      plan?.Rates?.[
                                                        firstRateKey
                                                      ]?.OBP?.["1"]
                                                        ?.RateBeforeTax || "0"
                                                    );
                                                    if (
                                                      !isNaN(rate) &&
                                                      rate < minRate
                                                    ) {
                                                      minRate = rate;
                                                    }
                                                  });

                                                  return isFinite(minRate)
                                                    ? parseInt(minRate)
                                                    : 0;
                                                })()}
                                                <span className="sm-text-price">
                                                  {" "}
                                                  INR/Night
                                                </span>
                                              </p>

                                              <p className="price-details">
                                                <span>
                                                  {/* Plus ₹1,043.10 in taxes */}
                                                  Plus ₹&nbsp;
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
                                                      ? parseInt(minRate)
                                                      : 0;
                                                  })()}{" "}
                                                  in taxes
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                          <div className="book-a-stay book-stay-room-btn">
                                            <div className="price-details mt-0">
                                              <div className="make-flex mb-1">
                                                <p className="priceText mb-0 mt-1 property-price-text">
                                                  Total
                                                </p>
                                                <p className="price-details"></p>
                                              </div>
                                              {/* <div className="make-flex">
                                           <p className="priceText mb-0 mt-0 property-price-text">₹ 4,590
                                            <span className="sm-text-price"> (incl. of taxes)</span>
                                            </p>
                                            <p className="price-details">
                                            </p>
                                          </div> */}

                                              <div className="make-flex">
                                                <p className="priceText mb-0 mt-0 property-price-text">
                                                  {/* ₹ 4,590 */}
                                                  ₹&nbsp;
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
                                                      ? parseInt(minRate)
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

                                            {rooms.MinInventory == 0 ? (
                                              <button
                                                className="btn btn-primary btnprimary-2"
                                                onClick={() =>
                                                  handleGetDetails(
                                                    rooms,
                                                    property.PropertyData
                                                  )
                                                }
                                                disabled
                                              >
                                                Not available
                                              </button>
                                            ) : (
                                              <button
                                                className="btn btn-primary btnprimary-2"
                                                onClick={() =>
                                                  handleGetDetails(
                                                    rooms,
                                                    property.PropertyData
                                                  )
                                                }
                                              >
                                                Get Details
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      {visibleOfferRoomId === rooms.RoomId && (
                                        <div
                                          id={`offer-${rooms.RoomId}`}
                                          className="offers-container mt-4"
                                        >
                                          <div className="accordion-body swiper-slider-package">
                                            <Swiper
                                              modules={[Navigation, Pagination]}
                                              spaceBetween={5}
                                              slidesPerView={1}
                                              navigation={{
                                                nextEl: ".swiper-button-next",
                                                prevEl: ".swiper-button-prev",
                                              }}
                                              // pagination={{
                                              //   el: ".swiper-pagination",
                                              //   clickable: true,
                                              //   type: "bullets",
                                              // }}
                                              pagination={false}
                                              autoplay={{
                                                delay: 2000,
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
                                              {property.RateData.filter(
                                                (rate) =>
                                                  property.Mapping.some(
                                                    (map) =>
                                                      map.RoomId ===
                                                        rooms.RoomId &&
                                                      map.RateId === rate.RateId
                                                  )
                                              ).map((rate, idx) => {
                                                const mapping =
                                                  property.Mapping.find(
                                                    (map) =>
                                                      map.RoomId ===
                                                        rooms.RoomId &&
                                                      map.RateId === rate.RateId
                                                  );
                                                return (
                                                  <SwiperSlide key={idx}>
                                                    <div className="mt-3 package-main-box">
                                                      <div className="winter-box-content carddd">
                                                        <p className="hotel-info mb-1">
                                                          <span>
                                                            {rate.RateName}
                                                          </span>
                                                        </p>
                                                        {/* <div dangerouslySetInnerHTML={{ __html: removeHtmlTags(rate.RateDescription).substring(0, 200) }} /> */}
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
                                                            view details
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
                                                              ₹{" "}
                                                              {parseInt(
                                                                rooms?.RatePlans?.find(
                                                                  (element) =>
                                                                    element.RateId ===
                                                                    mapping.RateId
                                                                )?.Rates?.[
                                                                  Object.keys(
                                                                    rooms
                                                                      ?.RatePlans?.[0]
                                                                      ?.Rates ||
                                                                      {}
                                                                  )[0]
                                                                ]?.OBP?.["1"]
                                                                  ?.RateBeforeTax ||
                                                                  "0"
                                                              )}{" "}
                                                              <small>
                                                                INR/Night
                                                              </small>
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
                                                                    parseInt(
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
                                                                    parseInt(
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
                                                                Select{" "}
                                                              </button>
                                                            ) : (
                                                              <button
                                                                className="btn btn-primary offer-select-btnn"
                                                                onClick={() => {
                                                                  handleSelectRoom(
                                                                    mapping,
                                                                    rate,
                                                                    rooms,
                                                                    parseInt(
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
                                                                    parseInt(
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
                                                                Select{" "}
                                                              </button>
                                                            )}
                                                          </div>

                                                          <div className="package-select-right">
                                                            <p className="priceText">
                                                              <small>
                                                                Member Rate
                                                              </small>
                                                            </p>
                                                            <p className="priceText">
                                                              ₹{" "}
                                                              {(() => {
                                                                const rate =
                                                                  parseInt(
                                                                    rooms?.RatePlans?.find(
                                                                      (
                                                                        element
                                                                      ) =>
                                                                        element.RateId ===
                                                                        mapping.RateId
                                                                    )?.Rates?.[
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
                                                                  );
                                                                return Math.round(
                                                                  rate * 0.8
                                                                );
                                                              })()}
                                                              <small>
                                                                INR/Night
                                                              </small>
                                                            </p>
                                                            <button
                                                              className="btn btn-primary offer-select-btnn"
                                                              onClick={() => {
                                                                handleSelectMemberRate(
                                                                  mapping,
                                                                  rate,
                                                                  rooms,
                                                                  parseInt(
                                                                    rooms?.RatePlans?.find(
                                                                      (
                                                                        element
                                                                      ) =>
                                                                        element.RateId ===
                                                                        mapping.RateId
                                                                    )?.Rates?.[
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
                                                                  parseInt(
                                                                    rooms?.RatePlans?.find(
                                                                      (
                                                                        element
                                                                      ) =>
                                                                        element.RateId ===
                                                                        mapping.RateId
                                                                    )?.Rates?.[
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
                                                              {" "}
                                                              {isLoggedin
                                                                ? "Select"
                                                                : "Login / Join"}
                                                            </button>
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
                                                          {/* <div dangerouslySetInnerHTML={{ __html: removeHtmlTags(rate.RateDescription) }} /> */}
                                                          <p className="f-12-new">
                                                            {stripHtml(
                                                              rate.RateDescription ||
                                                                ""
                                                            )}
                                                          </p>
                                                          {/* <p>{stripHtml(rate. || '')}</p> */}
                                                        </div>
                                                        {/* <p>₹ {
                                                          parseInt(
                                                            rooms?.RatePlans?.find(element => element.RateId === mapping.RateId)
                                                              ?.Rates?.[Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]]
                                                              ?.OBP?.["1"]?.RateBeforeTax || "0"
                                                          )
                                                        }</p> */}
                                                        {/* <p><b>Min Package Rate :</b> ₹ {property.Mapping.find(map => map.rooms === rooms.MinInventory)}</p>
                                                       <p><b>Min Package Rate :</b> ₹ {property.Mapping.find(map => map.RateId === rate.RateId)?.MinPackageRate}</p>
                                                      <p><b>Extra Adult Rate :</b> ₹ {property.Mapping.find(map => map.RateId === rate.RateId)?.ExAdRate}</p>
                                                      <p><b>Extra Child Rate :</b> ₹ {property.Mapping.find(map => map.RateId === rate.RateId)?.ExChildRate}</p>  */}

                                                        <div className="cancellation-div">
                                                          <h6>
                                                            Cancellation Policy
                                                          </h6>
                                                          <p>
                                                            {
                                                              property.Mapping.find(
                                                                (map) =>
                                                                  map.RateId ===
                                                                  rate.RateId
                                                              )
                                                                ?.CancellationPolicy
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
                                  ))
                                ) : (
                                  <p>
                                    No room data available for this property.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
