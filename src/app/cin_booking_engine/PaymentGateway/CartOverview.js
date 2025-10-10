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
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useBookingEngineContext } from "../../cin_context/BookingEngineContext"; // Adjust the import path

import "flatpickr/dist/themes/material_green.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronDown, ChevronUp } from "lucide-react";

const CartOverview = ({ goNext, onClose }) => {
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
    setSelectedRoomDetails,
    cancellationPolicyState,
    selectedAddOns,
    setAddOns,
    addonAmountTotal,
    setAddonAmountTotal,
    addonList,
    setAddonList,
    selectedAddonList,
    selectedSetAddonList,
    isRoomsChange,
    selectedTaxList,
    setSelectedTaxList,
    rateResponse,
    setRateResponse,
    addOnsresponse,
    setAddOnsResponse,
    roomTaxes,
    setRoomTaxes,
    setAddonTaxTotal,
    addonTaxTotal,
    isMemberRate,
    setIsMemberRate,
  } = useBookingEngineContext();

  const [totalAddOns, setTotalAddOns] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const dummyImage = "/no_image.jpg";
  const totalAdults = selectedRooms.reduce((sum, room) => sum + room.adults, 0);
  const totalChildren = selectedRooms.reduce(
    (sum, room) => sum + room.children,
    0
  );
  const totalRooms = selectedRooms.length;
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [aisOpen, setaIsOpen] = useState(false);
  const [aisOpen1, setaIsOpen1] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isPropertyVisible, setIsPropertyVisible] = useState(false);
  const [isRoomsVisible, setIsRoomsVisible] = useState(false);
  const [isRoomsClose, setIsRoomsClose] = useState(false);
  const [amountToatal, setAmountTotal] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [taxList, setTaxList] = useState(null);
  const [isInventoryAvailable, setInventoryAvailable] = useState(true);
  const [activeRoomIndex, setActiveRoomIndex] = useState(
    selectedRoom[0]?.id ? selectedRoom[0]?.id : 0
  );
  const [filters, setFilters] = useState({
    offer: "",
    query: "",
    dateRange: { start: "", end: "", totalPrice: 0 },
    guests: { adults: 1, children: 0, rooms: 1 },
  });
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toISOString().split("T")[0];
  };
  const fromDate = formatDate(selectedStartDate);
  const toDate = formatDate(selectedEndDate);

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
    return basePrice + totalTax;
  };

  const basePrice = calculateBasePrice();
  const finalAmount = calculateTotalWithTax();

  const fetchRateApi = async () => {
    const dayRate = rateResponse?.Rooms?.flatMap((room) => {
      const selectedRooms = selectedRoom.filter(
        (sel) => sel.roomId === room?.RoomId
      );

      return selectedRooms.map((selected) => {
        const matchedRatePlan = room?.RatePlans?.find(
          (ratePlan) => ratePlan?.RateId === selected?.rateId
        );

        const firstRateObj = matchedRatePlan
          ? Object.values(matchedRatePlan?.Rates || {})[0]
          : null;

        // Update packageRate for selectedRoom
        setSelectedRoom((prev) =>
          prev.map((rm) =>
            rm?.rateId === selected?.rateId && rm?.roomId === selected?.roomId
              ? {
                  ...rm,
                  packageRate: isMemberRate
                    ? (parseFloat(
                        firstRateObj?.OBP?.[rm.adults.toString()]?.RateBeforeTax
                      ) || 0.0) * 0.9
                    : parseFloat(
                        firstRateObj?.OBP?.[rm.adults.toString()]?.RateBeforeTax
                      ) || 0.0,
                  roomRateWithTax: isMemberRate
                    ? Math.round(
                        firstRateObj?.OBP?.[rm.adults.toString()]?.RateBeforeTax
                      ) +
                      Math.round(
                        Math.round(
                          firstRateObj?.OBP?.[rm.adults.toString()]
                            ?.RateBeforeTax
                        ) *
                          (Math.round(
                            firstRateObj?.OBP?.[rm.adults.toString()]
                              ?.RateBeforeTax
                          ) <= 7500
                            ? 1.2
                            : 1.8)
                      )
                    : Math.round(
                        firstRateObj?.OBP?.[rm.adults.toString()]?.RateAfterTax
                      ),
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
            // taxObject["ExtraAdultRate"] = parseFloat(
            //   selected?.roomRateWithTax || 0.0
            // );

            taxObject["ExtraAdultRate"] = parseFloat(
              firstRateObj?.ExtraAdultRate?.RateBeforeTax || 0.0
            );
          }
          if (isMemberRate) {
            taxObject["GST2"] = Math.round(
              selected.packageRate *
                (selected.packageRate <= 7500 ? 0.12 : 0.18)
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
  useEffect(() => {
    setAmountTotal(totalPrice + addonAmountTotal);
  }, [addonAmountTotal, totalPrice, selectedRoom]);

  useEffect(() => {
    const fetchPrices = async () => {
      if (!selectedPropertyId && currentStep !== 2) return;
      try {
        const dayRate = rateResponse?.Rooms?.map((room) => ({
          RoomId: room?.RoomId,
          MinInventory: room?.MinInventory,
          RateAfterTax:
            Object.values(room?.RatePlans?.[0]?.Rates || {})[0]?.OBP?.["1"]
              ?.RateBeforeTax || null,
        }));

        if (selectedRoom) {
          const updatedRooms = selectedRoom.map((sel) => {
            const match = dayRate.find((rate) => rate.RoomId == sel.roomId);
            return {
              ...sel,
              roomRate: match?.RateAfterTax
                ? parseFloat(match.RateAfterTax)
                : sel.roomRate,
            };
          });

          setSelectedRoom(updatedRooms);
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
    let selectedAdons = [];
    Object.entries(selectedAddOns || {}).forEach(([roomId, addons]) => {
      Object.entries(addons || {}).forEach(([addonId, count]) => {
        const matchingAddons = addonList?.filter(
          (addon) => String(addon.AddonId) === String(addonId)
        );
        if (matchingAddons?.length) {
          const addonWithRoomId = {
            ...matchingAddons[0],
            roomId,
            quantity: count,
          };
          selectedAdons.push(addonWithRoomId);
        }
      });
    });
    const totalAddOnPrice = selectedAdons.reduce((sum, addon) => {
      const price =
        addon?.Rate?.[0]?.INR?.amountAfterTax ||
        addon?.AdultRate?.[0]?.INR?.amountAfterTax ||
        0;
      return sum + parseFloat(price) * addon.quantity;
    }, 0);

    setTotalAddOns(addonAmountTotal);
    selectedSetAddonList(selectedAdons || []);
    setLoading(true);
  }, [amountToatal]);

  useEffect(() => {
    if (finalAmount !== null && !isNaN(finalAmount)) {
      const fetchPrices = async () => {
        if (!selectedPropertyId && currentStep !== 2) return;

        try {
          const response = await fetchRateApi();

          if (selectedRoom?.length > 0) {
            const updatedRooms = selectedRoom.map((sel) => {
              const matchedRate = response.find(
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
            // const taxList = {};
            // allTaxKeys.forEach((key) => {
            //   taxList[key] = updatedRooms
            //     .filter((room) => room !== undefined && room !== null)
            //     .reduce(
            //       (acc, room) => acc + (room[key] * numberOfDays || 0),
            //       0
            //     );
            // });
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

  const taxRate = basePrice >= 7000 ? "18%" : "12%";

  const openCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };
  const openPropertyPage = (id) => {
    setSelectedRoomDetails({ isPropertyVisible: false, id: id });
    setSelectedRoomId(id);
    setIsPropertyVisible(true);
  };
  const handleDateChange = (startDate, endDate, totalPrice) => {
    setFilters({
      ...filters,
      dateRange: { start: startDate, end: endDate, totalPrice },
    });
  };
  const openRoomPage = () => {
    setIsRoomsClose(true);
    setIsRoomsVisible(!isRoomsVisible);
  };

  const closeRoomChange = () => {
    setIsRoomsClose(false);
    setIsRoomsVisible(false);
  };
  const handleRoomChange = (adults, children, roomCount) => {
    setFilters((prev) => ({
      ...prev,
      guests: { adults, children, rooms: roomCount },
    }));
  };

  const handleAdd = (addon, addonId, price) => {
    setAddOns((prev) => {
      const roomAddOns = { ...(prev[activeRoomIndex] || {}) };
      roomAddOns[addonId] = (roomAddOns[addonId] || 0) + 1;

      return {
        ...prev,
        [activeRoomIndex]: roomAddOns,
      };
    });

    setAddonAmountTotal(addonAmountTotal + parseInt(price));
    setAmountTotal(totalPrice + parseInt(price));
  };

  const handleIncrement = (addonId, price, addon, tax) => {
    const roomAddOns = selectedAddOns[activeRoomIndex] || {};
    const isTypeR = addonList.find((a) => a.AddonId === addonId)?.Type === "R";
    const maxQty = isTypeR ? 1 : 20;

    if ((roomAddOns[addonId] || 0) < maxQty) {
      setAddOns((prev) => {
        const updatedRoomAddOns = { ...(prev[activeRoomIndex] || {}) };
        updatedRoomAddOns[addonId] = (updatedRoomAddOns[addonId] || 0) + 1;

        return {
          ...prev,
          [activeRoomIndex]: updatedRoomAddOns,
        };
      });

      const rateObj = addon?.ChildRate?.[0]?.INR;
      const adlt =
        selectedRoom?.find((element) => element.id == activeRoomIndex)
          ?.adults ?? 0;
      const chld =
        selectedRoom?.find((element) => element.id == activeRoomIndex)
          ?.children ?? 0;
      const adultPrice = parseInt(price) * adlt;
      const childPrice = parseInt(rateObj?.amountAfterTax) * chld;
      const adultTax = parseInt(tax) * adlt;
      const childTax = parseInt(rateObj?.tax) * chld;

      if (addon?.Type == "O") {
        if (addon?.Applicable == "G") {
          setAddonAmountTotal(addonAmountTotal + (adultPrice + childPrice));
          setAddonTaxTotal(addonTaxTotal + (adultTax + childTax));
          setAmountTotal(totalPrice + (adultPrice + childPrice));
        }
        if (addon?.Applicable == "D" || addon?.Applicable == "Q") {
          setAddonAmountTotal(addonAmountTotal + parseInt(price));
          setAddonTaxTotal(addonTaxTotal + parseInt(tax));
          setAmountTotal(totalPrice + parseInt(price));
        }
      }
      // setAddonAmountTotal(addonAmountTotal + parseInt(price));
      // setAmountTotal(totalPrice + parseInt(price));
    }
  };

  const handleDecrement = (addonId, price, addon, tax) => {
    const roomAddOns = selectedAddOns[activeRoomIndex] || {};
    const newQty = (roomAddOns[addonId] || 0) - 1;

    setAddOns((prev) => {
      const updatedRoomAddOns = { ...roomAddOns };
      if (newQty <= 0) {
        delete updatedRoomAddOns[addonId];
      } else {
        updatedRoomAddOns[addonId] = newQty;
      }
      return {
        ...prev,
        [activeRoomIndex]: updatedRoomAddOns,
      };
    });

    const rateObj = addon?.ChildRate?.[0]?.INR;
    const adlt =
      selectedRoom?.find((element) => element.id == activeRoomIndex)?.adults ??
      0;
    const chld =
      selectedRoom?.find((element) => element.id == activeRoomIndex)
        ?.children ?? 0;
    const adultPrice = parseInt(price) * adlt;
    const childPrice = parseInt(rateObj?.amountAfterTax) * chld;
    const adultTax = parseInt(tax) * adlt;
    const childTax = parseInt(rateObj?.tax) * chld;

    if (addon?.Type == "R") {
      if (addon?.Applicable == "G") {
        setAddonAmountTotal(
          addonAmountTotal - (adultPrice + childPrice) * numberOfDays
        );
        setAddonTaxTotal(addonTaxTotal - (adultTax + childTax) * numberOfDays);
        setAmountTotal(totalPrice - (adultPrice + childPrice) * numberOfDays);
      }
      if (addon?.Applicable == "D" || addon?.Applicable == "Q") {
        setAddonAmountTotal(addonAmountTotal - parseInt(price) * numberOfDays);
        setAddonTaxTotal(addonTaxTotal - parseInt(tax) * numberOfDays);
        setAmountTotal(totalPrice - parseInt(price) * numberOfDays);
      }
    } else if (addon?.Type == "O") {
      if (addon?.Applicable == "G") {
        setAddonAmountTotal(addonAmountTotal - (adultPrice + childPrice));
        setAddonTaxTotal(addonTaxTotal - (adultTax + childTax));
        setAmountTotal(totalPrice - (adultPrice + childPrice));
      }
      if (addon?.Applicable == "D" || addon?.Applicable == "Q") {
        setAddonAmountTotal(addonAmountTotal - parseInt(price));
        setAddonTaxTotal(addonTaxTotal - parseInt(tax));
        setAmountTotal(totalPrice - parseInt(price));
      }
    }
  };

  const getNZDPrice = (addon) => {
    const extractRate = (rateArray) => {
      if (!rateArray || rateArray.length === 0) return null;
      //const nzdRate = rateArray.find((r) => r.NZD)?.NZD;
      const nzdRate = rateArray.find((r) => r.INR)?.INR;
      return nzdRate ? `${nzdRate.amountAfterTax}` : "0";
    };

    return (
      extractRate(addon.Rate) ||
      extractRate(addon.AdultRate) ||
      extractRate(addon.ChildRate) ||
      "0"
    );
  };

  const getAddonUnitPrice = (addon) => {
    const extractRate = (rateArray) => {
      if (!rateArray || rateArray.length === 0) return null;
      //const nzdRate = rateArray.find((r) => r.NZD)?.NZD;
      const nzdRate = rateArray.find((r) => r.INR)?.INR;
      return nzdRate ? `${nzdRate.tax}` : "0";
    };

    return (
      extractRate(addon?.Rate) ||
      extractRate(addon?.AdultRate) ||
      extractRate(addon?.ChildRate) ||
      "0"
    );
  };
  return (
    <div className="stay-info">
      <div className="wizard-step-global-padding">
        <h4 className="wizard-title-main">Your Cart Overview</h4>
        <div className="accordion p-0" id="room-details">
          {/* <h5 className="f-12-new mb-2"> Rooms</h5> */}

          {selectedRoom?.length > 0
            ? selectedRoom.map((room, index) => (
                <div className="accordion-item" key={room?.id || index}>
                  {room?.roomId && room?.roomName ? (
                    <>
                      {room?.adults + room?.children > room?.maxGuest && (
                        <div>
                          <p>
                            <span style={{ color: "red" }}>*</span> Maximum{" "}
                            {room?.maxGuest} guests are allowed
                          </p>
                        </div>
                      )}

                      {room?.adults > room?.maxAdult && (
                        <div>
                          <p>
                            <span style={{ color: "red" }}>*</span> Maximum{" "}
                            {room?.maxAdult} adults are allowed
                          </p>
                        </div>
                      )}
                      {room?.children > room?.maxChildren && (
                        <div>
                          <p>
                            <span style={{ color: "red" }}>*</span> Maximum{" "}
                            {room?.maxChildren} children are allowed
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    // Grey placeholder when no image is available

                    <div
                      className="room-placeholder rounded-3"
                      style={{
                        width: "auto",
                        height: "60px",
                        backgroundColor: "#ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        margin: "0px",
                      }}
                      onClick={() => {
                        openPropertyPage(room?.id);
                        onClose();
                      }}
                    >
                      Select Room {index + 1}
                    </div>
                  )}

                  {room?.roomId && room?.roomName ? (
                    <div className="row p-2 pt-0">
                      <div className="col-12 p-0 mb-2">
                        <div className="room-count-d-flex">
                          <p className="f-12-new mb-0">Room {index + 1} :</p>
                          <p className="total-member-count f-12-new">
                            &nbsp;{" "}
                            {`${room?.adults} Adults, 
                                      ${room?.children} Children,
                                      `}
                          </p>
                        </div>
                      </div>
                      <div className="col-10 p-0">
                        <h6 className="h6">{room?.roomName}</h6>
                      </div>

                      <div className="package-d-flex-new">
                        <p className="f-12-new">{room?.roomPackage} -</p>
                        <h6 className="f-14-new">
                          INR{" "}
                          {isFinite(room?.packageRate)
                            ? Math.round(room?.packageRate)
                            : 0}
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
            </div>

            <div className="room-flex mb-2">
              <p className="total-member-count f-12-new">{`${totalAdults} Adults, ${totalChildren} Children, ${totalRooms} Rooms`}</p>
            </div>
          </div>
        </div>
        {selectedAddOns && (
          <div className="cancellation-policy">
            <h5 className="f-12-new mb-0 new-bold-text">Add-Ons</h5>

            {/* {Object.keys(selectedAddOns).length > 1 && ( */}
            {selectedRoom.filter((room) => {
              const ac = selectedAddOns[room.id];
              return ac && Object.keys(ac).length > 0;
            }).length > 1 && (
              <div style={{ marginTop: "0px", marginBottom: "5px" }}>
                <ul
                  style={{
                    display: "flex",
                    listStyle: "none",
                    paddingLeft: 0,
                    gap: "5px",
                  }}
                >
                  {selectedRoom.map((room, index) => {
                    const rmId = room.id;
                    const ac = selectedAddOns[rmId];
                    if (
                      ac &&
                      Object.keys(ac).length > 0 &&
                      selectedRoom.length > 1
                    ) {
                      return (
                        <li
                          key={index}
                          style={{
                            listStyle: "none",
                            padding: "5px 0px",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginRight: "10px",
                          }}
                        >
                          <input
                            type="radio"
                            id={`room-${index}`}
                            name="room-selector"
                            checked={activeRoomIndex === rmId}
                            onChange={() => setActiveRoomIndex(rmId)}
                            style={{
                              cursor: "pointer",
                              margin: 0,
                              accentColor:
                                activeRoomIndex === rmId ? "#000000" : "",
                            }}
                          />
                          <label
                            htmlFor={`room-${index}`}
                            style={{
                              cursor: "pointer",
                              margin: 0,
                            }}
                          >
                            Room {index + 1}
                          </label>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            )}

            {addonList && addonList.length > 0 ? (
              <Swiper
                spaceBetween={5}
                slidesPerView={2}
                loop={true}
                // navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                  },
                  576: {
                    slidesPerView: 2,
                  },
                }}
              >
                {addonList
                  .filter(
                    (addon) =>
                      selectedAddOns?.[activeRoomIndex]?.[addon.AddonId] > 0
                  )
                  .map((addon) => {
                    const quantity =
                      selectedAddOns?.[activeRoomIndex]?.[addon.AddonId] || 0;
                    const isTypeR = addon.Type === "R";
                    const maxQty = isTypeR ? 1 : 20;

                    return (
                      <SwiperSlide key={`${activeRoomIndex}_${addon.AddonId}`}>
                        <div
                          className="py-1"
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "5px",
                            margin: "2px",
                          }}
                        >
                          <div style={{ marginTop: "8px" }}>
                            <p
                              style={{ fontWeight: "bold", margin: 0 }}
                              className="f-12-new"
                            >
                              {addon?.AddonName}
                            </p>
                          </div>
                          <div className="">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "6px",
                                border: "1px solid #000",
                                borderRadius: "5px",
                                background: "#000",
                                color: "#fff",
                                padding: "1px 5px",
                              }}
                            >
                              <button
                                onClick={() =>
                                  handleDecrement(
                                    addon.AddonId,
                                    getNZDPrice(addon),
                                    addon,
                                    getAddonUnitPrice(addon)
                                  )
                                }
                                style={{
                                  border: "none",
                                  background: "transparent",
                                  color: "#fff",
                                  fontSize: "12px",
                                  cursor: "pointer",
                                }}
                              >
                                −
                              </button>
                              <span
                                style={{
                                  margin: "0 5px",
                                  color: "#fff",
                                  fontSize: "10px",
                                }}
                              >
                                {quantity}
                              </span>
                              <button
                                onClick={() => {
                                  if (quantity < maxQty) {
                                    handleIncrement(
                                      addon.AddonId,
                                      getNZDPrice(addon),
                                      addon,
                                      getAddonUnitPrice(addon)
                                    );
                                  }
                                }}
                                disabled={quantity >= maxQty}
                                style={{
                                  border: "none",
                                  background: "transparent",
                                  color: "#fff",
                                  fontSize: "15px",
                                  cursor:
                                    quantity >= maxQty
                                      ? "not-allowed"
                                      : "pointer",
                                  opacity: quantity >= maxQty ? 0.5 : 1,
                                }}
                              >
                                +
                              </button>
                            </div>
                            <p
                              style={{ fontWeight: "bold", margin: 0 }}
                              className="f-12-new text-end mt-1"
                            >
                              INR {getNZDPrice(addon)}
                            </p>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            ) : (
              <p>No selected add-ons for this room</p>
            )}
          </div>
        )}

        <div className="accordion1">
          <div className="accordion-item1 amount-and-taxes border-0">
            <div className="accordion1" id="totalAmountAccordion">
              <div className="accordion-item1">
                <div className="price-d-flex-tp">
                  <button
                    className="accordion-button1 f-12-new"
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
                      INR {Math.round(basePrice)}
                    </p>
                  )}
                  {/* {selectedRoom?.length > 0
                              ? selectedRoom.map((room, index) => (
                                <div className="accordion-item mt-2" key={room?.id || index}>
                                  {room?.roomId && room?.roomName ? (
                                    <p className="f-12-new">INR{isFinite(room?.packageRate) ? parseInt(room?.packageRate) : 0}</p>
                                  ) : null}
                                </div>
                              ))
                              : null} */}
                </div>
                {aisOpen && (
                  <div id="totalAmountCollapse" className="accordion-collapse1">
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
                                    <p className="f-12-new">
                                      {formatDate(selectedStartDate)}
                                    </p>
                                    {/* <p className="f-12-new">INR{room?.roomRate}</p> */}
                                    <h6 className="f-12-new">
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

            <div className="room-flex-1 mt-3">
              <div className="accordion1" id="totalAmountAccordion1">
                <div className="accordion-item1">
                  <h5 className="h6">
                    <b>Total</b>
                  </h5>
                  <button
                    className="accordion-button1 f-12-new"
                    onClick={() => setaIsOpen1(!aisOpen1)}
                  >
                    Taxes & Fees{" "}
                    {aisOpen1 ? (
                      <ChevronUp size={10}></ChevronUp>
                    ) : (
                      <ChevronDown size={10}></ChevronDown>
                    )}
                  </button>

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
                                  Math.round(taxValue) > 0.0 ? (
                                    <p key={taxName} className="f-12-new">
                                      {taxName}: INR {taxValue}
                                    </p>
                                  ) : null
                              )}

                            {totalAddOns ? (
                              <p className="f-12-new">
                                Add-Ons Price: INR {Math.round(totalAddOns)}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="amount-in-wizard">
                INR {Math.round(amountToatal)}{" "}
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

        {/* <div className="cancellation-policy">
          <div className="room-flex">
            <p className="f-12-new">Total Amount Payable </p>
            <p className="f-12-new">INR{amountToatal}
            </p>
          </div>
          <p className="m-0 inclusive">*Inclusive of Taxes</p>
          
        </div> */}
        <div className="cancellation-policy p-2">
          <p className="f-12-new high-stay mb-0">Cancellation Policy</p>
          <span className="f-12-new">
            {cancellationPolicyState?.slice(0, 35)}...
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
      <div className="book-a-stay wizard-bottom-fixed">
        <button
          onClick={() => {
            goNext();
            setTotalPrice(amountToatal);
          }}
          className="btn btn-primary w-100"
        >
          Proceed to Details
        </button>
      </div>

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
              <div className="p-3 text-start">
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
                  <p>{cancellationPolicyState}</p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
export default CartOverview;
