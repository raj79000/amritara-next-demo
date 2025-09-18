"use client";

import { useBookingEngineContext } from "../cin_context/BookingEngineContext";
import React, { useEffect, useState, useMemo, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import axios from "axios";
import { createSignature } from "../utilities/signature";

const styles = {
  input: {
    padding: "5px",
    fontSize: "12px",
    width: "250px",
  },
};

const DateRangePicker = () => {
  const {
    setSelectedDates,
    selectedStartDate,
    selectedEndDate,
    selectedPropertyId,
  } = useBookingEngineContext();
  const pricesMapRef = useRef({});
  const loadingRef = useRef(true);
  const flatpickrRef = useRef(null);

  const currentDate = useMemo(() => new Date(), []);
  const sixMonthsLater = useMemo(() => {
    const date = new Date();
    date.setMonth(currentDate.getMonth() + 6);
    return date;
  }, [currentDate]);

  // const fromDate = useMemo(
  //   () => currentDate.toISOString().split("T")[0],
  //   [currentDate]
  // );
  // const toDate = useMemo(
  //   () => sixMonthsLater.toISOString().split("T")[0],
  //   [sixMonthsLater]
  // );
  const formatDateWithOffset = (date, offsetMinutes = 330) => {
    // clone the date
    const d = new Date(date.getTime() + offsetMinutes * 60 * 1000);
    return d.toISOString().split("T")[0];
  };

  const fromDate = useMemo(
    () => formatDateWithOffset(currentDate, 330), // +5:30 = 330 minutes
    [currentDate]
  );

  const toDate = useMemo(
    () => formatDateWithOffset(sixMonthsLater, 330),
    [sixMonthsLater]
  );

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchPrices = async () => {
      if (!selectedPropertyId) return;

      loadingRef.current = true;
      try {
        const timestamp = Date.now().toString();
        const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
        const signature = await createSignature(
          JSON.stringify(selectedPropertyId),
          timestamp,
          secret
        );
        // const response = await axios.post("/api/staah-api/rate-et", {
        //   selectedPropertyId,
        //   fromDate,
        //   toDate,
        // });

        const response = await fetch(
          "https://cinbe.cinuniverse.com/api/cin-api/rate-et",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-timestamp": timestamp,
              "x-signature": signature,
            },
            body: JSON.stringify({ selectedPropertyId, fromDate, toDate }),
          }
        );
        const data = await response.json();
        const dayRate = data?.PropertyList?.[0]?.DayRate || {};
        const prices = {};
        for (const date in dayRate) {
          prices[date] = dayRate[date]?.Rate || 0;
        }
        pricesMapRef.current = prices;
      } catch (error) {
        console.error("Error fetching prices:", error);
      } finally {
        loadingRef.current = false;
        // if (flatpickrRef.current && flatpickrRef.current.isOpen) {
        //   flatpickrRef.current.redraw();
        // }
        if (flatpickrRef?.current) {
          flatpickrRef?.current?.redraw();
        }
      }
    };

    fetchPrices();
  }, [selectedPropertyId, fromDate, toDate]);

  useEffect(() => {
    const inputElement = document.getElementById("dateRangePicker");
    if (!inputElement) return;

    const instance = flatpickr(inputElement, {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: fromDate,
      showMonths: 1,
      fixedHeight: true,
      showOutsideDays: false,
      position: "auto",
      defaultDate:
        selectedStartDate && selectedEndDate
          ? [new Date(selectedStartDate), new Date(selectedEndDate)]
          : null,

      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          const [startDate, endDate] = selectedDates;
          const startDateFormatted = formatDate(startDate);
          const endDateFormatted = formatDate(endDate);

          let priceSum = 0;
          const tempDate = new Date(startDate);
          while (tempDate <= endDate) {
            const dateKey = formatDate(tempDate);
            if (pricesMapRef?.current[dateKey]) {
              priceSum += pricesMapRef?.current[dateKey];
            }
            tempDate.setDate(tempDate.getDate() + 1);
          }

          setSelectedDates(startDateFormatted, endDateFormatted, priceSum);
        }
      },

      onDayCreate: (dObj, dStr, fp, dayElem) => {
        if (!dayElem?.dateObj) return;

        const date = formatDate(dayElem?.dateObj);
        const priceTag = document.createElement("div");
        priceTag.className = "flatpickr-price";
        priceTag.style.fontSize = "10px";
        priceTag.style.position = "absolute";
        priceTag.style.bottom = "8px";
        priceTag.style.left = "50%";
        priceTag.style.transform = "translateX(-50%)";

        if (loadingRef?.current) {
          priceTag.innerHTML = `<div class="skeleton-loader"></div>`;
        } else if (pricesMapRef?.current[date] !== undefined) {
          priceTag.textContent = `₹${pricesMapRef?.current[date]}`;
        }

        dayElem.appendChild(priceTag);
      },
    });

    flatpickrRef.current = instance;

    return () => {
      instance.destroy();
    };
  }, [selectedStartDate, selectedEndDate]);

  return (
    <div style={styles.input}>
      <style>
        {`
          .skeleton-loader {
            width: 40px;
            height: 10px;
            background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s linear infinite;
            border-radius: 4px;
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
      <input
        id="dateRangePicker"
        placeholder="Please Select Date"
        style={styles.input}
        className="form-control"
        autoComplete="off"
      />
    </div>
  );
};

export default DateRangePicker;
