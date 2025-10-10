"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useBookingEngineContext } from "../../cin_context/BookingEngineContext";
import Image from "next/image";

const AddOnsStep = ({ onClose, goNext }) => {
  const {
    selectedPropertyPhone,
    selectedPropertyName,
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
    setAddonTaxTotal,
    addonTaxTotal,
    addonList,
    setAddonList,
    selectedAddonList,
    selectedSetAddonList,
    currentStep,
    isAddOnns,
    setIsAddOnns,
    isMemberRate,
    setIsMemberRate,
  } = useBookingEngineContext();
  const [amountToatal, setAmountTotal] = useState(0);
  const [activeRoomIndex, setActiveRoomIndex] = useState(
    selectedRoom[0]?.id ? selectedRoom[0]?.id : 0
  );
  //const [isAddOnns, setIsAddOnns] = useState(false);
  const dummyImage = "/no_image.jpg";

  const calculateNumberOfDays = () => {
    if (!selectedStartDate || !selectedEndDate) return 1;
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const numberOfDays = calculateNumberOfDays();

  useEffect(() => {
    if (addonList.length > 0) {
      setIsAddOnns(true);
    }
    if (selectedAddOns && Object.keys(selectedAddOns).length > 0) {
      let addonTotal = 0;
      let amountTotal = totalPrice;

      addonList.forEach((addOns) => {
        const addonId = addOns.AddonId;
        const price = parseInt(getNZDPrice(addOns) ?? 0);
        const rateObj = addOns?.ChildRate?.[0]?.INR ?? { amountAfterTax: 0 };
        const childRate = parseInt(rateObj.amountAfterTax ?? 0);

        // Loop over each room and check if that room selected this addon
        Object.keys(selectedAddOns).forEach((roomId) => {
          const roomAddons = selectedAddOns[roomId];
          const quantity = parseInt(roomAddons[addonId]) || 0;

          if (quantity > 0) {
            const roomData = selectedRoom?.find((el) => el.id == roomId);
            if (!roomData) {
              return;
            }
            const adlt = roomData?.adults ?? 0;
            const chld = roomData?.children ?? 0;

            const adultPrice = price * adlt;
            const childPrice = childRate * chld;

            if (addOns?.Type == "R") {
              if (addOns?.Applicable == "G") {
                addonTotal +=
                  (adultPrice + childPrice) * numberOfDays * quantity;
                amountTotal +=
                  (adultPrice + childPrice) * numberOfDays * quantity;
              } else if (["D", "Q"].includes(addOns?.Applicable)) {
                addonTotal += price * numberOfDays * quantity;
                amountTotal += price * numberOfDays * quantity;
              }
            } else if (addOns?.Type == "O") {
              if (addOns?.Applicable == "G") {
                addonTotal += (adultPrice + childPrice) * quantity;
                amountTotal += (adultPrice + childPrice) * quantity;
              } else if (["D", "Q"].includes(addOns?.Applicable)) {
                addonTotal += price * quantity;
                amountTotal += price * quantity;
              }
            }
          }
        });
      });

      setAddonAmountTotal(addonTotal);
      setAmountTotal(amountTotal);
    }
  }, [currentStep]);

  useEffect(() => {
    // setActiveRoomIndex(selectedRoom[0]?.id);
    setAmountTotal(totalPrice + addonAmountTotal);
  }, [addonAmountTotal, totalPrice]);

  const handleAdd = (addon, addonId, price, tax) => {
    setAddOns((prev) => {
      const roomAddOns = { ...(prev[activeRoomIndex] || {}) };
      roomAddOns[addonId] = (roomAddOns[addonId] || 0) + 1;

      return {
        ...prev,
        [activeRoomIndex]: roomAddOns,
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
          addonAmountTotal + (adultPrice + childPrice) * numberOfDays
        );
        setAddonTaxTotal(addonTaxTotal + (adultTax + childTax) * numberOfDays);
        setAmountTotal(totalPrice + (adultPrice + childPrice) * numberOfDays);
      }
      if (addon?.Applicable == "D" || addon?.Applicable == "Q") {
        setAddonAmountTotal(addonAmountTotal + parseInt(price) * numberOfDays);
        setAddonTaxTotal(addonTaxTotal + parseInt(tax) * numberOfDays);
        setAmountTotal(totalPrice + parseInt(price) * numberOfDays);
      }
    } else if (addon?.Type == "O") {
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
    setTimeout(()=>{
  window.dataLayer = window.dataLayer || [];
  window._lastBookingContext = window?._lastBookingContext || null;

  // function trackAddonAddToCart({ id, name, price, quantity = 1 }) {
  //   if (!window._lastBookingContext) {
  //     console.warn("No booking context found — select a room first!");
  //     return;
  //   }

    const { hotelName, roomName, rateName, rateBeforeTax, context } = window?._lastBookingContext;

    window.dataLayer.push({
      event: "add_to_cart",
      propertyName: hotelName,
      selectedStartDate: context?.startDate,
      selectedEndDate: context?.endDate,
      totalAdults: context?.adults,
      totalChildren: context?.children,
      totalRooms: context?.rooms,
      promoCode: context?.promoCode || "",
      rackRate: rateBeforeTax,
      RateBeforeTax: rateBeforeTax,
      RoomName: roomName,
      ecommerce: {
        currency: "INR",
        value: price,
        items: [
          {
            item_id: id,
            item_name: hotelName,     // ✅ Hotel Name (same mapping as room add_to_cart)
            item_category: roomName,  // ✅ Room Name
            item_variant: rateName,   // ✅ Rate Plan
            addon_name: name,         // ✅ Addon name (custom param)
            price: price,
            quantity: quantity
          }
        ]
      }
    });
  //}
    })
  };

  const getNZDPrice = (addon) => {
    const extractRate = (rateArray) => {
      if (!rateArray || rateArray.length === 0) return null;
      //const nzdRate = rateArray.find((r) => r.NZD)?.NZD;
      const nzdRate = rateArray.find((r) => r.INR)?.INR;
      return nzdRate ? `${nzdRate?.amountAfterTax}` : "0";
    };

    return (
      extractRate(addon?.Rate) ||
      extractRate(addon?.AdultRate) ||
      extractRate(addon?.ChildRate) ||
      "0"
    );
  };

  const getAddonUnitPrice = (addon) => {
    const extractRate = (rateArray) => {
      if (!rateArray || rateArray?.length === 0) return null;
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
    <>
      <div className="wizard-step-global-padding">
        <div className="addon-d-flex">
          <h4 className="wizard-title-main">Add-Ons</h4>
          <p className="f-12-new">
            Total<b>: {Math.round(amountToatal)}</b>
          </p>
        </div>
        <div style={{ marginTop: "10px", marginBottom: "15px" }}>
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              paddingLeft: 0,
              gap: "10px",
            }}
          >
            {selectedRoom.map((room, index) => (
              <li
                key={index}
                style={{
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <input
                  type="radio"
                  id={`room-${room.id}`}
                  name="roomSelection"
                  checked={activeRoomIndex === room.id}
                  onChange={() => setActiveRoomIndex(room.id)}
                  style={{
                    accentColor: "#000",
                    cursor: "pointer",
                    width: "10px",
                  }}
                />
                <label
                  htmlFor={`room-${room.id}`}
                  style={{
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Room {index + 1}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {!isAddOnns ? (
          <p>Loading add-ons...</p>
        ) : (
          <>
            {addonList.length > 0 ? (
              addonList.map((addon, index) => (
                <div className="addon-item-box" key={index}>
                  <div className="row">
                    <div className="col-6">
                      <Image
                        src={addon.Image || dummyImage}
                        alt={addon?.AddonName || "Addon Image"}
                        height={100}
                        width={120}
                        style={{ borderRadius: "5px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-6 right-content-addon align-self-center">
                      <div>
                        <p
                          style={{ fontWeight: "bold", margin: 0 }}
                          className="f-12-new text-center"
                        >
                          {addon?.AddonName}
                        </p>
                      </div>
                      <div className="addon-price-button-end">
                        <p style={{ margin: 0 }} className="f-12-new">
                          INR {getNZDPrice(addon)}
                        </p>
                        {selectedAddOns[activeRoomIndex]?.[addon.AddonId] ? (
                          <div
                            style={{
                              marginTop: "7px",
                              borderRadius: "5px",
                              background: "#000",
                              color: "#fff",
                              padding: "0px 4px",
                              display: "inline-block",
                              lineHeight: "1.2rem",
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
                            <span style={{ margin: "0 6px", fontSize: "12px" }}>
                              {selectedAddOns[activeRoomIndex][addon.AddonId]}
                            </span>
                            <button
                              onClick={() => {
                                const currentQty =
                                  selectedAddOns[activeRoomIndex]?.[
                                    addon.AddonId
                                  ] || 0;
                                const maxQty = addon.Type === "R" ? 1 : 20;
                                if (currentQty < maxQty) {
                                  handleIncrement(
                                    addon.AddonId,
                                    getNZDPrice(addon),
                                    addon,
                                    getAddonUnitPrice(addon)
                                  );
                                }
                              }}
                              style={{
                                border: "none",
                                background: "transparent",
                                color: "#fff",
                                fontSize: "12px",
                                cursor: "pointer",
                              }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              marginTop: "7px",
                              borderRadius: "5px",
                              background: "#000",
                              color: "#fff",
                              padding: "0px 4px",
                              display: "inline-block",
                              lineHeight: "1.2rem",
                            }}
                          >
                            <span
                              style={{ margin: "0 10px", fontSize: "12px" }}
                            >
                              0
                            </span>
                            <button
                              onClick={() =>
                                handleAdd(
                                  addon,
                                  addon.AddonId,
                                  getNZDPrice(addon),
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
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Add-ons are not available for this property.</p>
            )}
          </>
        )}
      </div>
      <div
        style={{ marginTop: "20px" }}
        className="book-a-stay wizard-bottom-fixed"
      >
        <button
          onClick={() => {
            goNext();
            setTotalPrice(amountToatal);
          }}
          className="btn btn-primary w-100"
        >
          {Object.keys(selectedAddOns[activeRoomIndex] || {}).length > 0
            ? "Proceed to Cart Overview"
            : "Skip to Cart Overview"}
        </button>
      </div>
    </>
  );
};

export default AddOnsStep;
