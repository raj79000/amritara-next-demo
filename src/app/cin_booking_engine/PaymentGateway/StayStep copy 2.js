"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlignRight,
  faArrowRight,
  faFileEdit,
  faHouse,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
import * as ReactDOM from "react-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useBookingEngineContext } from "../../cin_context/BookingEngineContext";
import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import StayStepRoomManager from "./StayStepRoomManager";
import "flatpickr/dist/themes/material_green.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "./DatePicker";
import { createSignature } from "../../../utilities/signature";
import { ChevronDown, ChevronUp, ChevronsUp } from "lucide-react";
import { getUserInfo } from "../../../utilities/userInfo";

const StayStep = ({ goNext, onClose, onSend }) => {
  const {
    selectedPropertyPhone,
    selectedPropertyName,
    currentStep,
    selectedPropertyId,
    selectedStartDate,
    selectedEndDate,
    totalPrice,
    setTotalPrice,
    selectedRoom,
    setSelectedRoom,
    selectedRooms,
    selectedRoomRate,
    getRoomNameById,
    selectedRoomDetails,
    setSelectedRoomDetails,
    cancellationPolicyState,
    addonList,
    setAddonList,
    isRoomsChange,
    selectedTaxList,
    setSelectedTaxList,
    rateResponse,
    setRateResponse,
    addOnsresponse,
    setAddOnsResponse,
    totalRoomPrice,
    setTotalRoomPrice,
    promoCodeContext,
    setPromoCodeContext,
    baseRoomPrice,
    setBaseRoomPrice,
    roomTaxes,
    setRoomTaxes,
    isAddOnns,
    setIsAddOnns,
    isMemberRate,
    setIsMemberRate,
    cancellationPolicyPackage,
    setCancellationPolicyPackage,
    isInventoryAvailable, setInventoryAvailable,
    totalTax, setTotalTax
  } = useBookingEngineContext();

  const dummyImage = "/no_image.jpg";
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const totalAdults = selectedRooms.reduce((sum, room) => sum + room.adults, 0);
  const totalChildren = selectedRooms.reduce(
    (sum, room) => sum + room.children,
    0
  );
  const totalRooms = selectedRooms.length;
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isPropertyVisible, setIsPropertyVisible] = useState(false);
  const [isRoomsVisible, setIsRoomsVisible] = useState(false);
  const [isRoomsClose, setIsRoomsClose] = useState(false);
  const [taxList, setTaxList] = useState(null);
  const [isMaxCapacityExceeded, isMaxCapacityExceededSet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartDisplayMobile, setCartDisplayMobile] = useState(false);

  const [isRateChange, setIsRateChange] = useState(false);
  const [aisOpen, setaIsOpen] = useState(false);
  const [aisOpen1, setaIsOpen1] = useState(false);

  const [filters, setFilters] = useState({
    offer: "",
    query: "",
    dateRange: { start: "", end: "", totalPrice: 0 },
    guests: { adults: 1, children: 0, rooms: 1 },
  });
  const formatDate = (date) => {
    if (!date) return ;
    return new Date(date).toISOString().split("T")[0];
  };

  const fromDate = formatDate(selectedStartDate);
  const toDate = formatDate(selectedEndDate);



      // async function postBookingWidged(rooms,mapping, isClose,ctaName,selectedPropertyId) {
      //  const resp = await getUserInfo();
      //    const sessionId = sessionStorage?.getItem("sessionId");
      //    const payload = {
      //    ctaName: ctaName,
      //    urls: window.location.href,
      //    cityId: 0,
      //    propertyId: selectedPropertyId ? parseInt(selectedPropertyId) :0,
      //    checkIn: fromDate,
      //    checkOut: toDate,
      //    adults: 0,
      //    children: 0,
      //    rooms: 0,
      //    promoCode: "",
      //    ip: resp?.ip,
      //    sessionId: sessionId,
      //    deviceName: resp?.deviceInfo?.deviceName,
      //    deviceType: resp?.deviceInfo?.deviceOS == "Unknown" ? resp?.deviceInfo?.platform : resp?.deviceInfo?.deviceOS,
      //    roomsName: rooms?.RoomName,
      //    packageName: mapping?.MappingName,
      //    isCartOpen: mapping?.MappingName ? "Y": "N",
      //    isCartEdit: "N",
      //    isCartClick: "N",
      //    isClose: isClose ? "Y" : "N",
      //   }
      //      const response = await fetch(
      //        "https://cmsdemo.cinuniverse.com/Api/tracker/BookingWidged",
      //        {
      //          method: "POST",
      //          headers: {
      //            "Content-Type": "application/json",
      //          },
      //          body: JSON.stringify( payload ),
      //        }
      //      );
      //      const res = await response?.json();

      //    //console.log("res BookingWidged",res);
      //  }

 async function postBookingWidged(rooms,mapping, isClose,ctaName,
  ApiName,ApiUrl,ApiStatus,ApiErrorCode,ApiMessage) {
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
    ip: resp?.ip,
    sessionId: sessionId,
    deviceName: resp?.deviceInfo?.deviceName,
    deviceType: resp?.deviceInfo?.deviceOS == "Unknown" ? resp?.deviceInfo?.platform : resp?.deviceInfo?.deviceOS,
    roomsName: rooms?.RoomName ?? selectedRoom?.map(room => room?.roomName)?.join(", "),
    packageName: mapping?.MappingName ?? selectedRoom?.map(room => room?.roomPackage)?.join(", "),
    isCartOpen: mapping?.MappingName ? "Y": "N",
    isCartEdit: "N",
    isCartClick: "N",
    isClose: isClose ? "Y" : "N",
    ApiName: ApiName ?? "",
    ApiUrl: ApiUrl ?? "",
    ApiStatus: ApiStatus?.toString() ?? "",
    ApiErrorCode: ApiErrorCode?.toString() ?? "",
    ApiMessage: ApiMessage ?? ""
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

  const rateUpdate = async () => {
    // const response = await axios.post("/api/staah-api/rate", {
    //   selectedPropertyId,
    //   fromDate,
    //   toDate,
    // });

    const dayRate = rateResponse?.Product?.[0]?.Rooms?.flatMap((room) => {
      const newSelectedRooms = selectedRoom.filter(
        (sel) => sel.roomId === room?.RoomId
      );

      return newSelectedRooms.map((selected) => {
        const matchedRatePlan = room?.RatePlans?.find(
          (ratePlan) => ratePlan?.RateId === selected?.rateId
        );

        const firstRateObj = matchedRatePlan
          ? Object.values(matchedRatePlan?.Rates || {})[0]
          : null;

        // Update packageRate for selectedRoom
        setSelectedRoom((prev) =>
          prev.map((rm) =>
            rm?.adults <= selected.maxAdult &&
            rm?.rateId === selected?.rateId &&
            rm?.roomId === selected?.roomId
              ? {
                  ...rm,
                  packageRate:
                    firstRateObj?.OBP?.[rm.adults.toString()]?.RateBeforeTax,
                  roomRateWithTax:
                    firstRateObj?.OBP?.[rm.adults.toString()]?.RateAfterTax,
                  adultRate:
                    parseFloat(firstRateObj?.ExtraAdultRate?.RateAfterTax) ||
                    0.0,
                  childRate:
                    parseFloat(firstRateObj?.ExtraChildRate?.RateAfterTax) ||
                    0.0,
                  roomAdultExtraCharge:
                    parseInt(
                      firstRateObj?.OBP?.[rm.adults.toString()]?.RateAfterTax
                    ) - parseInt(firstRateObj?.OBP?.["1"]?.RateAfterTax),
                }
              : rm
          )
        );
        //const totalGuests = selected?.adults + selected?.children;
        const extraChildren =
          selected.children > selected?.applicableChild
            ? selected?.children - selected?.applicableChild
            : 0;
        const extraChildTaxes = Array.from({ length: extraChildren }, () =>
          extraChildren >= 1 ? firstRateObj?.ExtraChildRate?.Tax || [] : []
        ).flat();

        const taxArray = [
          ...(firstRateObj?.OBP?.[selected.adults.toString()]?.Tax || []),
          ...extraChildTaxes,
        ];
        const taxObject = {};
        taxArray.forEach((t) => {
          if (t?.Name && t?.Amount != null) {
            const amount = parseFloat(t.Amount);
            taxObject[t.Name] = (taxObject[t.Name] || 0) + amount;
          }
        });

        if (firstRateObj && selected) {
          if (extraChildren > 0) {
            taxObject["ExtraChildRate"] = parseFloat(
              (firstRateObj?.ExtraChildRate?.RateBeforeTax || 0.0) *
                extraChildren
            );
          }

          if (
            selected?.adults > selected?.maxAdult &&
            parseFloat(firstRateObj?.ExtraAdultRate?.RateAfterTax) > 1.0
          ) {
            taxObject["ExtraAdultRate"] = parseFloat(
              firstRateObj?.ExtraAdultRate?.RateBeforeTax || 0.0
            );
          }
        }
        return {
          RoomId: selected?.roomId,
          RateId: selected?.rateId,
          MinInventory: room?.MinInventory,
          RateAfterTax: parseInt(firstRateObj?.OBP?.["1"]?.RateAfterTax || "0"),
          ...taxObject,
        };
      });
    });

    return dayRate;
  };

  const fetchRateApi = async () => {
    // const response = await axios.post("/api/staah-api/rate", {
    //   selectedPropertyId,
    //   fromDate,
    //   toDate,
    // });

    let roomsData = "";
  let mappingData ="";
  let isCloseData = false;
  let apiStatusData = "";
  let apiErrorCodeData = "";
  let apiMessageData = "";
  let ctaNameData = "Fetch Rate";
  let apiNameData = "rate";
  let apiUrlData = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/cin-api/rate`;
  postBookingWidged(roomsData,mappingData, isCloseData,ctaNameData,
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);

  try {
    const timestamp = Date.now().toString();
    const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";

    const signature = await createSignature(
      JSON.stringify(selectedPropertyId),
      timestamp,
      secret
    );

    const body = {
      selectedPropertyId: selectedPropertyId,
      fromDate,
      toDate,
      promoCodeContext ,
      // product: "No",
    };
  //  if(promoCode != "" || new Date(fromDate) > cutoffDate)
    // if(promoCode == "")
    // {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/cin-api/inventory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-timestamp": timestamp,
        "x-signature": signature,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
   // setIsRateFetched(true);
      apiStatusData= response?.status;
      apiErrorCodeData= response?.status;
      apiMessageData= "Data not found";
    }

    const data = await response.json();

      const product = Array.isArray(data?.Product) ? data?.Product[0] : null;
      if(!product){
      apiStatusData= data?.message;
      apiErrorCodeData= data?.TrackingID;
      apiMessageData= data?.message;;
      }
     // const rooms = product?.Rooms || [];
    const dayRate = product?.Rooms?.flatMap((room) => {
      const newSelectedRooms = selectedRoom.filter(
        (sel) => sel.roomId === room?.RoomId
      );

      return newSelectedRooms.map((selected) => {
        const matchedRatePlan = room?.RatePlans?.find(
          (ratePlan) => ratePlan?.RateId === selected?.rateId
        );
      if(!matchedRatePlan){

      apiStatusData= "No Rate Plans";
      apiErrorCodeData= "No Rate Plans";;
      apiMessageData= "Success";
      }
        const firstRateObj = matchedRatePlan
          ? Object.values(matchedRatePlan?.Rates || {})[0]
          : null;

        // Update packageRate for selectedRoom
        setSelectedRoom((prev) =>
          prev.map((rm) =>
            rm?.adults <= selected.maxAdult &&
            rm?.rateId === selected?.rateId &&
            rm?.roomId === selected?.roomId
              ? {
                  ...rm,
                  packageRate: isMemberRate
                    ? (Math.round(
                        firstRateObj?.OBP?.[rm?.adults?.toString()]?.RateBeforeTax
                      ) || 0.0) * 0.9
                    : Math.round(
                        firstRateObj?.OBP?.[rm?.adults?.toString()]?.RateBeforeTax
                      ) || 0.0,
                  roomRateWithTax: isMemberRate
                    ? Math.round(
                        firstRateObj?.OBP?.[rm?.adults?.toString()]?.RateBeforeTax
                      ) +
                      Math.round(
                        Math.round(
                          firstRateObj?.OBP?.[rm?.adults?.toString()]
                            ?.RateBeforeTax
                        ) *
                          (Math.round(
                            firstRateObj?.OBP?.[rm?.adults?.toString()]
                              ?.RateBeforeTax
                          ) <= 7500
                            ? 1.2
                            : 1.8)
                      )
                    : Math.round(
                        firstRateObj?.OBP?.[rm?.adults?.toString()]?.RateAfterTax
                      ),
                  adultRate:
                    parseFloat(firstRateObj?.ExtraAdultRate?.RateAfterTax) ||
                    0.0,
                  childRate:
                    parseFloat(firstRateObj?.ExtraChildRate?.RateAfterTax) ||
                    0.0,
                  roomAdultExtraCharge:
                    parseInt(
                      firstRateObj?.OBP?.[rm?.adults?.toString()]?.RateAfterTax
                    ) - parseInt(firstRateObj?.OBP?.["1"]?.RateAfterTax),
                }
              : rm
          )
        );
        //const totalGuests = selected?.adults + selected?.children;
        const extraChildren =
          selected.children > selected?.applicableChild
            ? selected?.children - selected?.applicableChild
            : 0;
        const extraChildTaxes = Array.from({ length: extraChildren }, () =>
          extraChildren >= 1 ? firstRateObj?.ExtraChildRate?.Tax || [] : []
        ).flat();

        const taxArray = [
          ...(firstRateObj?.OBP?.[selected?.adults?.toString()]?.Tax || []),
          ...extraChildTaxes,
        ];
        const taxObject = {};
        taxArray.forEach((t) => {
          if (t?.Name && t?.Amount != null) {
            const amount = parseFloat(t.Amount);
            taxObject[t.Name] = (taxObject[t.Name] || 0) + amount;
          }
        });

        if (firstRateObj && selected) {
          if (extraChildren > 0) {
            taxObject["ExtraChildRate"] = parseFloat(
              (firstRateObj?.ExtraChildRate?.RateBeforeTax || 0.0) *
                extraChildren
            );
          }

          if (
            selected?.adults > selected?.maxAdult &&
            parseFloat(firstRateObj?.ExtraAdultRate?.RateAfterTax) > 1.0
          ) {
            taxObject["ExtraAdultRate"] = parseFloat(
              firstRateObj?.ExtraAdultRate?.RateBeforeTax || 0.0
            );
          }
          if (isMemberRate) {
            taxObject["GST2"] = Math.round(
              selected?.packageRate *
                (selected?.packageRate <= 7500 ? 0.12 : 0.18)
            );
          }
        }
        return {
          RoomId: selected?.roomId,
          RateId: selected?.rateId,
          MinInventory: room?.MinInventory,
          RateAfterTax: parseInt(firstRateObj?.OBP?.["1"]?.RateAfterTax || "0"),
          ...taxObject,
        };
      });
    });

      apiStatusData= response?.status;
      apiErrorCodeData= response?.status;
      apiMessageData= "Success";
    return dayRate;
  }catch{
       apiStatusData= error;
       apiErrorCodeData= "1166";
       apiMessageData= error;
  }finally {
   // postBookingWidged("","", false,"rate Fetched","rate","https://cindemo.cinuniverse.com/api/cin-api/rate",);
      setTimeout(() => {
      postBookingWidged(roomsData,mappingData, isCloseData,"rate Fetched",
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);

    }
  };

  useEffect(() => {
    for (let i = 0; i < selectedRoom?.length; i++) {
      if (
        parseInt(selectedRoom?.[i]?.adults) + parseInt(selectedRoom?.[i]?.children) >
        selectedRoom?.[i]?.maxGuest
      ) {
        isMaxCapacityExceededSet(true);
      } else {
        isMaxCapacityExceededSet(false);
      }
    }
    setIsRateChange(true);
  }, [selectedRoom]);
  // useEffect(() => {
  //   let rooms = "";
  // let mapping ="";
  // let isClose = false;
  // let ctaName = "Fetch AddOns";
  // let apiName = "add-ons";
  // let apiUrl = "https://cindemo.cinuniverse.com/api/cin-api/add-ons";
  // let apiStatus = "";
  // let apiErrorCode = "";
  // let apiMessage = "";
  //   const fetchAddOns = async () => {
  //     try {
  //       if (selectedPropertyId != null && currentStep === 0) {
  //         const timestamp = Date.now().toString();
  //         const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
  //         const signature = await createSignature(
  //           selectedPropertyId.toString(),
  //           timestamp,
  //           secret
  //         );
  //         const response = await fetch(
  //           "https://cindemo.cinuniverse.com/api/cin-api/add-ons",
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //               "x-timestamp": timestamp,
  //               "x-signature": signature,
  //             },
  //             body: JSON.stringify({
  //               selectedPropertyId: selectedPropertyId.toString(),
  //             }),
  //           }
  //         );

  //         if (!response.ok) {
  //          apiStatus= response?.status;
  //          apiErrorCode= response?.status;
  //          apiMessage= "Data not found";
  //           throw new Error("failed - Add-Ons not found");
  //         }
  //         const properties = await response.json();
  //         //const properties = data;
  //         if (Array.isArray(properties)) {
  //           setAddonList(properties?.[0]?.ExtrasData || []);
  //           setAddOnsResponse(properties);
  //           if (properties?.[0]?.ExtrasData?.length > 0) {
  //             setIsAddOnns(true);
  //           }
  //         } else {
  //           console.error("Invalid Property:", properties);
  //         }
  //       }
  //     } catch (error) {
  //           apiStatus= error?.TypeError;
  //           apiErrorCode= error?.TypeError;
  //           apiMessage= "Exception";
  //      // console.error("Error fetching properties:", error);
  //     }finally {
  //     setTimeout(() => {
  //     postBookingWidged(rooms,mapping, isClose,ctaName,
  //     apiName,apiUrl,apiStatus,apiErrorCode,apiMessage)
  //   }, 200);

  //   }
  //   };
  //   fetchAddOns();
  // }, [selectedPropertyId]);

    // useEffect(() => {
    //   if (finalAmount !== null && !isNaN(finalAmount)) {
    //     const fetchPrices = async () => {
    //       if (!selectedPropertyId && currentStep !== 0) return;

    //       try {
    //         const response = await rateUpdate();

    //         if (selectedRoom?.length > 0) {
    //           const updatedRooms = selectedRoom?.map((sel) => {
    //             const matchedRate = response?.find(
    //               (rate) =>
    //                 rate?.RateId === sel?.rateId && rate?.RoomId === sel?.roomId
    //             );
    //             return matchedRate ? { ...matchedRate, Id: sel?.id } : null;
    //           });
    //           const allTaxKeys = new Set();
    //           let hasZeroInventory = false;

    //           updatedRooms?.forEach((room) => {
    //             if (!room) return;

    //             if (room?.MinInventory === 0) {
    //               hasZeroInventory = true;
    //               return;
    //             }

    //             Object.keys(room).forEach((key) => {
    //               if (
    //                 ![
    //                   "roomId",
    //                   "RateId",
    //                   "MinInventory",
    //                   "RateAfterTax",
    //                   "Id",
    //                 ].includes(key) &&
    //                 typeof room[key] === "number"
    //               ) {
    //                 allTaxKeys.add(key);
    //               }
    //             });
    //           });

    //           if (hasZeroInventory) {
    //             setInventoryAvailable(false);
    //           } else {
    //             setInventoryAvailable(true);
    //           }
    //           setRoomTaxes(updatedRooms);
    //           const taxList = {};
    //           allTaxKeys.forEach((key) => {
    //             taxList[key] = updatedRooms
    //               .filter((room) => room !== undefined && room !== null)
    //               .reduce(
    //                 (acc, room) => acc + (room[key] * numberOfDays || 0),
    //                 0
    //               );
    //           });

    //           setTaxList(taxList);
    //           setSelectedTaxList(taxList);

    //           const totalTax = Object.values(taxList).reduce(
    //             (acc, taxVal) => acc + taxVal,
    //             0
    //           );
    //           setTotalTax(totalTax);
    //         }
    //       } catch (error) {
    //         console.error("Error fetching prices:", error);
    //       }
    //     };

    //     fetchPrices();
    //     setTotalPrice(finalAmount);
    //   }
    // }, [
    //   finalAmount,
    //   isRoomsChange,
    //   currentStep,
    // ]);

  useEffect(() => {
    if (finalAmount !== null && !isNaN(finalAmount)) {
      const fetchPrices = async () => {
        if (!selectedPropertyId && currentStep !== 0) return;

        try {
          const response = await fetchRateApi();

          if (selectedRoom?.length > 0) {
            const updatedRooms = selectedRoom?.map((sel) => {
              const matchedRate = response?.find(
                (rate) =>
                  rate?.RateId === sel?.rateId && rate?.RoomId === sel?.roomId
              );
              return matchedRate ? { ...matchedRate, Id: sel?.id } : null;
            });
            const allTaxKeys = new Set();
            let hasZeroInventory = false;

            updatedRooms?.forEach((room) => {
              if (!room) return;

              if (room?.MinInventory === 0) {
                hasZeroInventory = true;
                return;
              }

              Object.keys(room).forEach((key) => {
                if (
                  ![
                    "roomId",
                    "RateId",
                    "MinInventory",
                    "RateAfterTax",
                    "Id",
                  ].includes(key) &&
                  typeof room[key] === "number"
                ) {
                  allTaxKeys.add(key);
                }
              });
            });

            if (hasZeroInventory) {
              setInventoryAvailable(false);
            } else {
              setInventoryAvailable(true);
            }
            setRoomTaxes(updatedRooms);
            const taxList = {};
            allTaxKeys.forEach((key) => {
              // Skip GST2 entirely
              if (isMemberRate && key === "GST2") return;

              const actualKey = isMemberRate && key === "GST" ? "GST2" : key;

              taxList[key] = updatedRooms
                .filter((room) => room !== undefined && room !== null)
                .reduce((acc, room) => {
                  return acc + (room[actualKey] * numberOfDays || 0);
                }, 0);
            });

            setTaxList(taxList);
            setSelectedTaxList(taxList);

            const totalTax = Object.values(taxList).reduce(
              (acc, taxVal) => acc + taxVal,
              0
            );
            setTotalTax(totalTax);
          }
        } catch (error) {
          console.error("Error fetching prices:", error);
        }
      };

      fetchPrices();
      setTotalPrice(finalAmount);
    }
  }, [
    finalAmount,
    isRoomsChange,
    currentStep,
    selectedStartDate,
    selectedEndDate,
  ]);

  const openPropertyPage = (id) => {
    setSelectedRoomDetails({ isPropertyVisible: false, id: id });
    setSelectedRoomId(id);
    setIsPropertyVisible(true);
  };
  const removeProperty = (id) => {
    setSelectedRoom((prev) =>
      prev.map((room) =>
        room.id === id
          ? {
              ...room,
              roomId: "",
              roomName: "",
              roomRate: "",
              roomImage: null,
              packageRate: "",
              childRate: "",
            } // Use null instead of {}
          : room
      )
    );
  };
  const openDatePickerPage = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };
  const openRoomPage = () => {

    setIsRoomsClose(!isRoomsClose);
    setIsRoomsVisible(!isRoomsVisible);
  };
  const handleRoomChange = () => {
    setIsRoomsVisible(!isRoomsVisible);
    setFilters((prev) => ({
      ...prev,
      //guests: { adults, children, rooms: roomCount },
    }));
  };

  const proceedAddOn = (selectedRoom) => {
    const isProceed = selectedRoom.every((room) => room.roomId);

    // Check if any room has more guests than allowed
    const isGuestLimitExceeded = selectedRoom.some(
      (room) => room.adults + room.children > room.maxGuest
    );
    const isAdultLimitExceeded = selectedRoom.some(
      (room) => room.adults > room.maxAdult
    );

    const isChildLimitExceeded = selectedRoom.some(
      (room) => room.children > room.maxChildren
    );
    if (
      isProceed &&
      !isGuestLimitExceeded &&
      isInventoryAvailable &&
      !isAdultLimitExceeded &&
      !isChildLimitExceeded
    ) {
      setTotalRoomPrice(finalAmount);
      setBaseRoomPrice(basePrice);
      goNext();
    } else if (!isProceed) {
      toast.error("Select your room(s)");
    } else if (isGuestLimitExceeded) {
      toast.error(
        "Selected guests are greater than the max guest allowed in one or more rooms"
      );
    } else if (isAdultLimitExceeded) {
      toast.error(
        "Selected adults are greater than the max adults allowed in one or more rooms"
      );
    } else if (isChildLimitExceeded) {
      toast.error(
        "Selected children are greater than the max children allowed in one or more rooms"
      );
    } else if (!isInventoryAvailable) {
      toast.error("Booking not available for selected date");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="stay-info">
        <div className="wizard-step-global-padding right-card-data">
            <div className="pl-2">
              <h4 className="wizard-title-main cart-display-mobile" onClick={()=>setCartDisplayMobile(!cartDisplayMobile)}>
                <span className="d-flex w-100 justify-content-between align-items-center">
                 Booking Details  {cartDisplayMobile ? (<ChevronUp size={20} />) : (<ChevronDown size={20} />)}
                </span> 
              </h4>  
              <h4 className="wizard-title-main cart-display-desktopss">
                Booking Details
              </h4>  
            </div>

             {/**mobile-show***/}  
            {
              cartDisplayMobile ? (<div className="mobile-cart-display">
                <div className="accordion p-2 pl-0" id="room-details">
          
          {selectedRoom?.length > 0
            ? selectedRoom.map((room, index) => (
                <div className="accordion-item pl-0" key={room?.id || index}>
                  {room?.roomId && room?.roomName ? (
                    <>
                      {/* <Image
                      src={room?.roomImage && room?.roomImage?.trim() !== "" ? room?.roomImage : dummyImage}
                      className="img-fluid room-image rounded-3"
                      alt="Room Image"
                      height={80}
                      width={100}
                      onError={(e) => (e.target.src = dummyImage)}
                    /> */}
                      {room?.adults + room?.children > room.maxGuest && (
                        <div>
                          {/* <p>
                            <span style={{ color: "red" }}>*</span> Maximum{" "}
                            {room.maxGuest} guests are allowed
                          </p> */}
                          <p style={{ color: "red" }}>
                            * Maximum {room.maxGuest} guests are allowed
                          </p>
                        </div>
                      )}

                      {room?.adults > room.maxAdult && (
                        <div>
                          {/* <p>
                            <span style={{ color: "red" }}>*</span> Maximum{" "}
                            {room.maxAdult} adults are allowed
                          </p> */}
                          <p style={{ color: "red" }}>
                            * Maximum{" "}
                            {room.maxAdult} adults are allowed
                          </p>
                        </div>
                      )}
                      {room?.children > room.maxChildren && (
                        <div>
                          {/* <p >
                            <span style={{ color: "red" }}>*</span> Maximum{" "}
                            {room.maxChildren} children are allowed
                          </p> */}

                          <p style={{ color: "red" }}>
                            * Maximum{" "}
                            {room.maxChildren} children are allowed
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    // Grey placeholder when no image is available

                    <div
                      className="room-placeholder room-count-d-flex"
                      style={{
                        width: "auto",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        margin: "0px",
                      }}
                      onClick={() => {
                        openPropertyPage(room?.id);
                        onClose();
                      }}
                    >
                      <p className="f-12-new mb-0">
                        Room {index + 1} : &nbsp;
                        <span className="span-underline">Select Room </span>
                      </p>
                    </div>
                  )}

                  {room?.roomId && room?.roomName ? (
                    <div className="row p-2 pt-0">
                      {/* <div className="col-12 p-0 mb-2">
                        <div className="room-count-d-flex">
                          <p className="f-12-new mb-0">Room {index + 1} :</p> 
                          <p className="total-member-count f-12-new">
                            &nbsp;{" "}
                            {`${room.adults} Adults,
                                    ${room.children} Children
                                    `}
                          </p> 
                        </div>
                      </div> */}
                      <div className="col-9 p-0">
                        <h5 className="h6 selectedRoomNameInWizard">{room.roomName}</h5>
                      </div>
                      <div className="col-3 p-0 text-end">
                          <div className="col-9 text-end p-0">
                            <button  onClick={() => {
                                openPropertyPage(room?.id);
                                onClose();
                              }}  className="modifytext-new-wizard">
                              <span>Modify</span>
                              <FontAwesomeIcon className="cursor-pointer icons-neww" icon={faEdit} />
                            </button>

                          </div>
                            {/* <div className="col-3 ml-2 text-end ps-0">
                            <FontAwesomeIcon
                              className="cursor-pointer icons-neww me-1"
                              icon={faTrashAlt}
                              onClick={() => removeProperty(room?.id)}
                            />
                          </div>  */}
                      </div>
                      <div className="package-d-flex-new">
                        <p className="f-12-new">{room?.roomPackage} -</p>
                        {/* <h6 className="f-14-new">
                          INR{" "}
                          {isFinite(room?.packageRate)
                            ? Math.round(room?.packageRate)
                            : "Sold out"
                            }
                        </h6> */}
                        <h6 className="f-14-new">
                          
                          {isFinite(room?.packageRate) && room?.packageRate != 0
                            ?  <>INR{" "} {Math.round(room?.packageRate)}</>
                            :  <> Sold Out
                              <span className="small-text-for-today"> (for today)</span>
                              </>
                            }
                        </h6>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))
            : null}

          <div className="accordion-item">
            <h6 className="h6 high-stay">Stay Information</h6>
            <div className="room-flex my-2">
              <p className="f-12-new">
                {formatDate(selectedStartDate)} &nbsp;- &nbsp;
                {formatDate(selectedEndDate)}
              </p>
              <button  onClick={openDatePickerPage} className="modifytext-new-wizard">
                <span>Modify </span>
                <FontAwesomeIcon className="cursor-pointer icons-neww" icon={faEdit} />
              </button>


            </div>

            {isDatePickerVisible && (
              <div className="main-bx-field mb-3 bdr-booking-bottom wizard-calender h6">
                <DatePicker
                  selectedStartDate={selectedStartDate}
                  selectedEndDate={selectedEndDate} onClose={() => {
                    setIsDatePickerVisible(!isDatePickerVisible);
              }}
                />
              </div>
            )}

            {/* <FontAwesomeIcon icon={faEdit} onClick={openRoomPage} /> */}
            {isRoomsVisible && (
              <div className="row">
                <div className=" col-md-12 main-bx-field filter-item me-3 bdr-booking-bottom wizard-room-manager">
                  <StayStepRoomManager onRoomChange={handleRoomChange} onClose={() => {
                    setIsRoomsVisible(!isRoomsVisible);
              }}/>
                </div>
              </div>
            )}
            <div className="room-flex mb-0">
              <p className="total-member-count f-12-new">{`${totalAdults} Adults, ${totalChildren} Children, ${totalRooms} Rooms`}</p>
              <button onClick={openRoomPage}  className="modifytext-new-wizard">
                <span>Modify </span>
                <FontAwesomeIcon className="cursor-pointer icons-neww" icon={faEdit} />
              </button>

            </div>
            {/* {!isRoomsVisible &&
          <div className="room-flex mb-2">
            <p className="total-member-count f-12-new">{`${totalAdults} Adults, ${totalChildren} Children, ${totalRooms} Rooms`}</p>
          </div>
            } */}
          </div>
          {/* <div className="accordion-item">
          <h6 className="mb-2 h6 high-stay">
            Guests and Rooms &nbsp;&nbsp;
            <FontAwesomeIcon icon={faEdit} onClick={openRoomPage} />
          </h6>
          {isRoomsVisible && (
            <div className="row">
              <div className=" col-md-12 main-bx-field filter-item me-3 bdr-booking-bottom wizard-room-manager">
                <StayStepRoomManager onRoomChange={handleRoomChange} />
              </div>
            </div>
          )}
          <div className="room-flex mb-2">
            <p className="total-member-count f-12-new">{`${totalAdults} Adults, ${totalChildren} Children, ${totalRooms} Rooms`}</p>
          </div>
        </div> */}

          <div className="accordion-item1 amount-and-taxes border-0 p-2">
            <div className="accordion1" id="totalAmountAccordion">
              <div className="accordion-item1">
                <div className="price-d-flex-tp">
                  <button
                    className="accordion-button1 f-12-new"
                    type="button"
                    onClick={() => setaIsOpen(!aisOpen)}
                  >
                    Price{" "}
                    {aisOpen ? (
                      <ChevronUp size={10}></ChevronUp>
                    ) : (
                      <ChevronDown size={10}></ChevronDown>
                    )}
                  </button>

                  {selectedRoom && (
                    <p className="amount-in-wizard mb-0">
                      INR {Math.round(basePrice)}{" "}
                    </p>
                  )}
                </div>

                {aisOpen && (
                  <div
                    id="totalAmountCollapse"
                    className="accordion-collapse1"
                  >
                    {selectedRoom?.length > 0
                      ? selectedRoom.map((room, index) => (
                          <div
                            className="accordion-item1 mt-2"
                            key={room?.id || index}
                          >
                            {room?.roomId && room?.roomName ? (
                              <>
                                <p className="f-12-new">Room {index + 1}</p>
                                {selectedRoom && (
                                  <div className="new-d-flex-for-room-p">
                                    <p className="f-12-new mb-0">
                                      {formatDate(selectedStartDate)}
                                    </p>
                                    {/* <p className="f-12-new">INR{room?.roomRate}</p> */}
                                    <h6 className="f-12-new mb-0">
                                      INR{" "}
                                      {isFinite(room?.packageRate)
                                        ? Math.round(room?.packageRate)
                                        : 0}
                                    </h6>
                                  </div>
                                )}
                              </>
                            ) : null}
                          </div>
                        ))
                      : null}
                  </div>
                )}
              </div>
            </div>
                  <div className="d-flex justify-content-between align-items-center w-100 mt-2">
                      <button
                        className="accordion-button1 f-12-new"
                        type="button"
                        onClick={() => setaIsOpen1(!aisOpen1)}
                      >
                        Taxes & Fees{" "}
                        {aisOpen1 ? (
                          <ChevronUp size={10}></ChevronUp>
                        ) : (
                          <ChevronDown size={10}></ChevronDown>
                        )}
                      </button> 
                      <p className="amount-in-wizard mb-0">
                        INR{" "}
                        {taxList &&
                          (() => {
                            const totalTax = Object.values(taxList).reduce(
                              (sum, val) => sum + parseFloat(val || 0),
                              0
                            );

                            return (
                              <>
                                {totalTax}
                              </>
                            );
                          })()}
                      </p>

                  </div>
                

                  {aisOpen1 && (
                    <div
                      id="totalAmountCollapse1"
                      className="accordion-collapse1"
                    >
                      <div className="accordion-body1">
                        {selectedRoom && (
                          <div className="mt-2">
                            {/* <p className="amount-in-wizard">INR {children}</p>   */}
                            {taxList &&
                              Object.entries(taxList).map(
                                ([taxName, taxValue]) =>
                                  parseFloat(taxValue) > 0.0 ? (
                                    <p
                                      key={taxName}
                                      className="f-12-new mb-0 taxe-below-txt"
                                    >
                                      {taxName}: INR {taxValue}
                                    </p>
                                  ) : null
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

            <div className="room-flex-1 mt-3">
              <div className="accordion1" id="totalAmountAccordion1">
                <div className="accordion-item1">
                  <h5 className="h6">
                    <b>Total</b>
                  </h5>
                </div>
              </div>
              <p className="amount-in-wizard total-amount-cart">
                INR {isFinite(finalAmount) ? Math.round(finalAmount) : 0}
              </p>
            </div>

            {/* <div className="accordion-body my-2 p-0">
            <button
              type="button"
              className="btn btn-link p-0 f-12-new"
              data-bs-toggle="modal"
              data-bs-target="#rateDetailsModal-b"
            >
              Rate Details
            </button>
          </div> */}
          </div>
                </div>
              <div className="cancellation-policy p-2">
                <p className="f-12-new high-stay mb-0">Cancellation Policy</p>
                <span className="f-12-new">
                  {cancellationPolicyPackage?.[0]?.CancellationPolicy?.Description?.slice(0, 35)}...
                  <a
                    type="button"
                    className="policy-read-more f-12-new"
                    data-bs-toggle="modal"
                    data-bs-target="#rateDetailsModal-b"
                  >
                    more info
                  </a>
                </span>
              </div>
              </div> ) : (<div className="notshowing-indesktop">
              <div className="accordion-item">
            <div className="room-flex my-2">
              <p className="f-12-new">
                {formatDate(selectedStartDate)} &nbsp;- &nbsp;
                {formatDate(selectedEndDate)}
              </p>
              <button  onClick={openDatePickerPage} className="modifytext-new-wizard">
                <span>Modify </span>
                <FontAwesomeIcon className="cursor-pointer icons-neww" icon={faEdit} />
              </button>


            </div>

            {isDatePickerVisible && (
              <div className="main-bx-field mb-3 bdr-booking-bottom wizard-calender h6">
                <DatePicker
                  selectedStartDate={selectedStartDate}
                  selectedEndDate={selectedEndDate} onClose={() => {
                    setIsDatePickerVisible(!isDatePickerVisible);
              }}
                />
              </div>
            )}

            {/* <FontAwesomeIcon icon={faEdit} onClick={openRoomPage} /> */}
            {isRoomsVisible && (
              <div className="row">
                <div className=" col-md-12 main-bx-field filter-item me-3 bdr-booking-bottom wizard-room-manager">
                  <StayStepRoomManager onRoomChange={handleRoomChange} onClose={() => {
                    setIsRoomsVisible(!isRoomsVisible);
              }}/>
                </div>
              </div>
            )}
            <div className="room-flex mb-0">
              <p className="total-member-count f-12-new">{`${totalAdults} Adults, ${totalChildren} Children, ${totalRooms} Rooms`}</p>
              <button onClick={openRoomPage}  className="modifytext-new-wizard">
                <span>Modify </span>
                <FontAwesomeIcon className="cursor-pointer icons-neww" icon={faEdit} />
              </button>

            </div>
            {/* {!isRoomsVisible &&
          <div className="room-flex mb-2">
            <p className="total-member-count f-12-new">{`${totalAdults} Adults, ${totalChildren} Children, ${totalRooms} Rooms`}</p>
          </div>
            } */}
          </div>  <div className="room-flex-1 mt-3">
              <div className="accordion1" id="totalAmountAccordion1">
                <div className="accordion-item1">
                  <h5 className="h6">
                    <b>Total</b>
                  </h5>
                </div>
              </div>
              <p className="amount-in-wizard total-amount-cart text-green-600 cart-amnt-txtsss">
                INR {isFinite(finalAmount) ? Math.round(finalAmount) : 0}
              </p>
            </div> 
              </div> )
            }
            

             {/**mobile-show***/}  



            {/**desktop-show***/}   
            <div className="desktop-cart-display">
                <div className="accordion p-2 pl-0" id="room-details">
          
          {selectedRoom?.length > 0
            ? selectedRoom.map((room, index) => (
                <div className="accordion-item pl-0" key={room?.id || index}>
                  {room?.roomId && room?.roomName ? (
                    <>
                      {/* <Image
                      src={room?.roomImage && room?.roomImage?.trim() !== "" ? room?.roomImage : dummyImage}
                      className="img-fluid room-image rounded-3"
                      alt="Room Image"
                      height={80}
                      width={100}
                      onError={(e) => (e.target.src = dummyImage)}
                    /> */}
                      {room?.adults + room?.children > room.maxGuest && (
                        <div>
                          {/* <p>
                            <span style={{ color: "red" }}>*</span> Maximum{" "}
                            {room.maxGuest} guests are allowed
                          </p> */}
                          <p style={{ color: "red" }}>
                            * Maximum {room.maxGuest} guests are allowed
                          </p>
                        </div>
                      )}

                      {room?.adults > room.maxAdult && (
                        <div>
                          {/* <p>
                            <span style={{ color: "red" }}>*</span> Maximum{" "}
                            {room.maxAdult} adults are allowed
                          </p> */}
                          <p style={{ color: "red" }}>
                            * Maximum{" "}
                            {room.maxAdult} adults are allowed
                          </p>
                        </div>
                      )}
                      {room?.children > room.maxChildren && (
                        <div>
                          {/* <p >
                            <span style={{ color: "red" }}>*</span> Maximum{" "}
                            {room.maxChildren} children are allowed
                          </p> */}

                          <p style={{ color: "red" }}>
                            * Maximum{" "}
                            {room.maxChildren} children are allowed
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    // Grey placeholder when no image is available

                    <div
                      className="room-placeholder room-count-d-flex"
                      style={{
                        width: "auto",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        margin: "0px",
                      }}
                      onClick={() => {
                        openPropertyPage(room?.id);
                        onClose();
                      }}
                    >
                      <p className="f-12-new mb-0">
                        Room {index + 1} : &nbsp;
                        <span className="span-underline">Select Room </span>
                      </p>
                    </div>
                  )}

                  {room?.roomId && room?.roomName ? (
                    <div className="row p-2 pt-0">
                      {/* <div className="col-12 p-0 mb-2">
                        <div className="room-count-d-flex">
                          <p className="f-12-new mb-0">Room {index + 1} :</p> 
                          <p className="total-member-count f-12-new">
                            &nbsp;{" "}
                            {`${room.adults} Adults,
                                    ${room.children} Children
                                    `}
                          </p> 
                        </div>
                      </div> */}
                      <div className="col-9 p-0">
                        <h5 className="h6 selectedRoomNameInWizard">{room.roomName}</h5>
                      </div>
                      <div className="col-3 p-0 text-end">
                          <div className="col-9 text-end p-0">
                            <button  onClick={() => {
                                openPropertyPage(room?.id);
                                onClose();
                              }}  className="modifytext-new-wizard">
                              <span>Modify</span>
                              <FontAwesomeIcon className="cursor-pointer icons-neww" icon={faEdit} />
                            </button>

                          </div>
                            {/* <div className="col-3 ml-2 text-end ps-0">
                            <FontAwesomeIcon
                              className="cursor-pointer icons-neww me-1"
                              icon={faTrashAlt}
                              onClick={() => removeProperty(room?.id)}
                            />
                          </div>  */}
                      </div>
                      <div className="package-d-flex-new">
                        <p className="f-12-new">{room?.roomPackage} -</p>
                        {/* <h6 className="f-14-new">
                          INR{" "}
                          {isFinite(room?.packageRate)
                            ? Math.round(room?.packageRate)
                            : "Sold out"
                            }
                        </h6> */}
                        <h6 className="f-14-new">
                          
                          {isFinite(room?.packageRate) && room?.packageRate != 0
                            ?  <>INR{" "} {Math.round(room?.packageRate)}</>
                            :  <> Sold Out
                              <span className="small-text-for-today"> (for today)</span>
                              </>
                            }
                        </h6>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))
            : null}

          <div className="accordion-item">
            <h6 className="h6 high-stay">Stay Information</h6>
            <div className="room-flex my-2">
              <p className="f-12-new">
                {formatDate(selectedStartDate)} &nbsp;- &nbsp;
                {formatDate(selectedEndDate)}
              </p>
              <button  onClick={openDatePickerPage} className="modifytext-new-wizard">
                <span>Modify </span>
                <FontAwesomeIcon className="cursor-pointer icons-neww" icon={faEdit} />
              </button>


            </div>

            {isDatePickerVisible && (
              <div className="main-bx-field mb-3 bdr-booking-bottom wizard-calender h6">
                <DatePicker
                  selectedStartDate={selectedStartDate}
                  selectedEndDate={selectedEndDate} onClose={() => {
                    setIsDatePickerVisible(!isDatePickerVisible);
              }}
                />
              </div>
            )}

            {/* <FontAwesomeIcon icon={faEdit} onClick={openRoomPage} /> */}
            {isRoomsVisible && (
              <div className="row">
                <div className=" col-md-12 main-bx-field filter-item me-3 bdr-booking-bottom wizard-room-manager">
                  <StayStepRoomManager onRoomChange={handleRoomChange} onClose={() => {
                    setIsRoomsVisible(!isRoomsVisible);
              }}/>
                </div>
              </div>
            )}
            <div className="room-flex mb-0">
              <p className="total-member-count f-12-new">{`${totalAdults} Adults, ${totalChildren} Children, ${totalRooms} Rooms`}</p>
              <button onClick={openRoomPage}  className="modifytext-new-wizard">
                <span>Modify </span>
                <FontAwesomeIcon className="cursor-pointer icons-neww" icon={faEdit} />
              </button>

            </div>
            {/* {!isRoomsVisible &&
          <div className="room-flex mb-2">
            <p className="total-member-count f-12-new">{`${totalAdults} Adults, ${totalChildren} Children, ${totalRooms} Rooms`}</p>
          </div>
            } */}
          </div>
          {/* <div className="accordion-item">
          <h6 className="mb-2 h6 high-stay">
            Guests and Rooms &nbsp;&nbsp;
            <FontAwesomeIcon icon={faEdit} onClick={openRoomPage} />
          </h6>
          {isRoomsVisible && (
            <div className="row">
              <div className=" col-md-12 main-bx-field filter-item me-3 bdr-booking-bottom wizard-room-manager">
                <StayStepRoomManager onRoomChange={handleRoomChange} />
              </div>
            </div>
          )}
          <div className="room-flex mb-2">
            <p className="total-member-count f-12-new">{`${totalAdults} Adults, ${totalChildren} Children, ${totalRooms} Rooms`}</p>
          </div>
        </div> */}

          <div className="accordion-item1 amount-and-taxes border-0 p-2">
            <div className="accordion1" id="totalAmountAccordion">
              <div className="accordion-item1">
                <div className="price-d-flex-tp">
                  <button
                    className="accordion-button1 f-12-new"
                    type="button"
                    onClick={() => setaIsOpen(!aisOpen)}
                  >
                    Price{" "}
                    {aisOpen ? (
                      <ChevronUp size={10}></ChevronUp>
                    ) : (
                      <ChevronDown size={10}></ChevronDown>
                    )}
                  </button>

                  {selectedRoom && (
                    <p className="amount-in-wizard mb-0">
                      INR {Math.round(basePrice)}{" "}
                    </p>
                  )}
                </div>

                {aisOpen && (
                  <div
                    id="totalAmountCollapse"
                    className="accordion-collapse1"
                  >
                    {selectedRoom?.length > 0
                      ? selectedRoom.map((room, index) => (
                          <div
                            className="accordion-item1 mt-2"
                            key={room?.id || index}
                          >
                            {room?.roomId && room?.roomName ? (
                              <>
                                <p className="f-12-new">Room {index + 1}</p>
                                {selectedRoom && (
                                  <div className="new-d-flex-for-room-p">
                                    <p className="f-12-new mb-0">
                                      {formatDate(selectedStartDate)}
                                    </p>
                                    {/* <p className="f-12-new">INR{room?.roomRate}</p> */}
                                    <h6 className="f-12-new mb-0">
                                      INR{" "}
                                      {isFinite(room?.packageRate)
                                        ? Math.round(room?.packageRate)
                                        : 0}
                                    </h6>
                                  </div>
                                )}
                              </>
                            ) : null}
                          </div>
                        ))
                      : null}
                  </div>
                )}
              </div>
            </div>
                  <div className="d-flex justify-content-between align-items-center w-100 mt-2">
                      <button
                        className="accordion-button1 f-12-new"
                        type="button"
                        onClick={() => setaIsOpen1(!aisOpen1)}
                      >
                        Taxes & Fees{" "}
                        {aisOpen1 ? (
                          <ChevronUp size={10}></ChevronUp>
                        ) : (
                          <ChevronDown size={10}></ChevronDown>
                        )}
                      </button> 
                      <p className="amount-in-wizard mb-0">
                        INR{" "}
                        {taxList &&
                          (() => {
                            const totalTax = Object.values(taxList).reduce(
                              (sum, val) => sum + parseFloat(val || 0),
                              0
                            );

                            return (
                              <>
                                {totalTax}
                              </>
                            );
                          })()}
                      </p>

                  </div>
                

                  {aisOpen1 && (
                    <div
                      id="totalAmountCollapse1"
                      className="accordion-collapse1"
                    >
                      <div className="accordion-body1">
                        {selectedRoom && (
                          <div className="mt-2">
                            {/* <p className="amount-in-wizard">INR {children}</p>   */}
                            {taxList &&
                              Object.entries(taxList).map(
                                ([taxName, taxValue]) =>
                                  parseFloat(taxValue) > 0.0 ? (
                                    <p
                                      key={taxName}
                                      className="f-12-new mb-0 taxe-below-txt"
                                    >
                                      {taxName}: INR {taxValue}
                                    </p>
                                  ) : null
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

            <div className="room-flex-1 mt-3">
              <div className="accordion1" id="totalAmountAccordion1">
                <div className="accordion-item1">
                  <h5 className="h6">
                    <b>Total</b>
                  </h5>
                </div>
              </div>
              <p className="amount-in-wizard total-amount-cart">
                INR {isFinite(finalAmount) ? Math.round(finalAmount) : 0}
              </p>
            </div>

            {/* <div className="accordion-body my-2 p-0">
            <button
              type="button"
              className="btn btn-link p-0 f-12-new"
              data-bs-toggle="modal"
              data-bs-target="#rateDetailsModal-b"
            >
              Rate Details
            </button>
          </div> */}
          </div>
                </div>
              <div className="cancellation-policy p-2">
                <p className="f-12-new high-stay mb-0">Cancellation Policy</p>
                <span className="f-12-new">
                  {cancellationPolicyPackage?.[0]?.CancellationPolicy?.Description?.slice(0, 35)}...
                  <a
                    type="button"
                    className="policy-read-more f-12-new"
                    data-bs-toggle="modal"
                    data-bs-target="#rateDetailsModal-b"
                  >
                    more info
                  </a>
                </span>
              </div>
            </div>
             {/**desktop-show***/} 

       

          {/* pay now button */}
            {/* <div className="wizard-bottom-fixed">
              <div className="wizard-bottom-fixed-0">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                  onClick={onSend}
                >
                  {isLoading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div> */}
          {/* pay now button */}
        </div>
        {/* <div className="book-a-stay wizard-bottom-fixed">
          <button
            onClick={() => proceedAddOn(selectedRoom)}
            className="btn btn-primary w-100"
          > */}
            {/* {isAddOnns ? "Proceed to Add-Ons" : "Proceed to Cart Overview"} */}
            {/* {addonList?.length > 0 ? "Proceed to Add-Ons" : "Proceed to Details"} */}
            {/* Proceed to Details
          </button>
        </div> */}

        {ReactDOM.createPortal(
          <div
            className="modal fade"
            id="rateDetailsModal-b"
            tabIndex="-1"
            aria-labelledby="rateDetailsModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg text-start">
              <div className="modal-content">
                <div className="p-3  text-start">
                  {/* <h5 className="modal-title" id="rateDetailsModalLabel">
                  Rate Details
                </h5> */}
                  <h5 className="modal-title">Cancellation Policy</h5>
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
                  {/* <div className="popup-box-contentrj1">
                  <div className="popup-amenity-items">
                    {selectedRoom && (
                      <div>
                        <h6 className="py-2">{selectedRoom.roomName}</h6>
                        <h6>{selectedRoom.RoomDescription}</h6>
                        <p>
                          <strong>Base Price:</strong> INR {basePrice}
                        </p>

                        {taxList &&
                          Object.entries(taxList).map(([taxName, taxValue]) => (
                            parseFloat(taxValue) > 0.0 ? <p key={taxName}>
                              <strong>{taxName}:</strong> INR {taxValue}
                            </p>
                              : null
                          ))}

                        <p>
                          <strong>Total Price:</strong> INR {finalAmount}
                        </p>
                        <p>
                          <strong>Check-in:</strong> {formatDate(selectedStartDate)}
                        </p>
                        <p>
                          <strong>Check-out:</strong> {formatDate(selectedEndDate)}
                        </p>
                      </div>
                    )}
                  </div>

                </div> */}

                  <div className="mt-0">
                    <p>{cancellationPolicyPackage?.[0]?.CancellationPolicy?.Description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </>
  );
};

export default StayStep;
