"use client";

import { useBookingEngineContext } from "../../cin_context/BookingEngineContext";
import React, { useEffect, useState, useMemo, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import axios from "axios";
import { createSignature } from "../../utilities/signature";

const styles = {
  input: {
    padding: "5px",
    fontSize: "12px",
    width: "250px",
  },
};

const DatePicker = ({ selectedStartDate, selectedEndDate }) => {
  const { setSelectedDates, selectedPropertyId } = useBookingEngineContext();
  const [pricesMap, setPricesMap] = useState({});
  const dateInputRef = useRef(null);
  const loadingRef = useRef(true);
  const flatpickrInstanceRef = useRef(null);
  const fetchedRef = useRef(false);
  const currentDate = useMemo(() => new Date(), []);
  const sixMonthsLater = useMemo(() => {
    const date = new Date();
    date.setMonth(currentDate.getMonth() + 6);
    return date;
  }, [currentDate]);

  // const fromDate = useMemo(() => currentDate.toISOString().split("T")[0], [currentDate]);
  // const toDate = useMemo(() => sixMonthsLater.toISOString().split("T")[0], [sixMonthsLater]);
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

  // Fetch price
  useEffect(() => {
    if (fetchedRef.current) return;
    loadingRef.current = true;
    fetchedRef.current = true;
    const fetchPrices = async () => {
      try {
        const timestamp = Date.now().toString();
        const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
        const signature = await createSignature(
          JSON.stringify(selectedPropertyId),
          timestamp,
          secret
        );
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
        setPricesMap(prices);
      } catch (error) {
        console.error("Error fetching prices:", error);
      } finally {
        loadingRef.current = false;
      }
    };

    fetchPrices();
  }, [selectedPropertyId, fromDate, toDate]);

  // Init Flatpickr
  useEffect(() => {
    if (!dateInputRef.current) return;

    flatpickrInstanceRef.current = flatpickr(dateInputRef.current, {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: fromDate,
      showMonths: 1,
      static: true,
      fixedHeight: true,
      showOutsideDays: false,
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
            if (pricesMap[dateKey]) {
              priceSum += pricesMap[dateKey];
            }
            tempDate.setDate(tempDate.getDate() + 1);
          }

          setSelectedDates(startDateFormatted, endDateFormatted, priceSum);
        }
      },
    });

    flatpickrInstanceRef.current.open();

    return () => {
      flatpickrInstanceRef.current.destroy();
    };
  }, []);

  // Inject prices into calendar
  useEffect(() => {
    const fp = flatpickrInstanceRef.current;
    if (!fp || !fp.calendarContainer) return;
    const dayElements = fp.calendarContainer.querySelectorAll(".flatpickr-day");
    dayElements.forEach((dayElem) => {
      const date = dayElem.dateObj;
      if (!date) return;

      const dateKey = formatDate(date);
      const price = pricesMap[dateKey];

      if (price !== undefined) {
        const existingPriceTag = dayElem.querySelector(".flatpickr-price");
        if (existingPriceTag) existingPriceTag.remove();

        const priceTag = document.createElement("div");
        priceTag.className = "flatpickr-price";
        priceTag.style.fontSize = "10px";
        priceTag.style.position = "absolute";
        priceTag.style.bottom = "8px";
        priceTag.style.left = "50%";
        priceTag.style.transform = "translateX(-50%)";
        priceTag.textContent = `₹${price}`;
        dayElem.appendChild(priceTag);
      }
    });
  }, [pricesMap]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div style={styles.input}>
      <input
        id="datePicker"
        ref={dateInputRef}
        placeholder="Please Select Date"
        className="form-control"
        style={{
          display: "none", // set to block if needed
        }}
      />
    </div>
  );
};

export default DatePicker;
