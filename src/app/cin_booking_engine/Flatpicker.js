"use client";

import { useBookingEngineContext } from "../cin_context/BookingEngineContext";
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

const DateRangePicker = () => {
  const {
    setSelectedDates,
    selectedStartDate,
    selectedEndDate,
    selectedPropertyId,setIsDateChanged
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
  const formatDateWithOffset = (date, offsetMinutes = 330) => {
    const d = new Date(date.getTime() + offsetMinutes * 60 * 1000);
    return d.toISOString().split("T")[0];
  };

  // const fromDate = useMemo(
  //   () => formatDateWithOffset(currentDate, 330), // +5:30 = 330 minutes
  //   [currentDate]
  // );
const fromDate = useMemo(() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;   // real Date object
}, []);

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

    // useEffect(() => {
    //   const fetchPrices = async () => {
    //     if (!selectedPropertyId) return;

    //     loadingRef.current = true;
    //     try {
    //       const url = `${process.env.NEXT_PUBLIC_CMS_BASE_URL_ROOM_RATES}/staah/rates/GetRoomsRates?RequestType=bedata&PropertyId=${selectedPropertyId}&Product=yes&CheckInDate=${fromDate}&CheckOutDate=${toDate}`;
    //       const response = await fetch(url, {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "x-api-key": process.env.NEXT_PUBLIC_API_KEY_GETRATE,
    //         },
    //       });
    //       const data = await response?.json();
    //       const dayRate = data?.PropertyList?.[0]?.DayRate || {};
    //       const prices = {};
    //       for (const date in dayRate) {
    //         prices[date] = dayRate[date]?.Rate || 0;
    //       }
    //       pricesMapRef.current = prices;
    //     } catch (error) {
    //       console.error("Error fetching prices:", error);
    //     } finally {
    //       loadingRef.current = false;
    //       if (flatpickrRef?.current) {
    //         flatpickrRef?.current?.redraw();
    //       }
    //     }
    //   };

    //   fetchPrices();
    // }, [selectedPropertyId, fromDate, toDate]);

  useEffect(() => {
    const inputElement = document.getElementById("dateRangePicker");
    if (!inputElement) return;
 const disabledDates = Object.entries(pricesMapRef.current)
    .filter(([date, price]) => price == "0") 
    .map(([date]) => date);
const instance = flatpickr(inputElement, {
  mode: "range",
  //dateFormat: "Y-m-d",
  dateFormat: "d-m-Y",
  minDate: fromDate,
  showMonths: 1,
  fixedHeight: true,
  showOutsideDays: false,
  position: "auto",
  disable: disabledDates,
  defaultDate:
    selectedStartDate && selectedEndDate
      ? [new Date(selectedStartDate), new Date(selectedEndDate)]
      : null,

  onChange: (selectedDates, dateStr, fp) => {
    if (selectedDates.length === 1) {
      // ✅ When only check-in is selected → restrict checkout date
      fp.set("minDate", selectedDates[0]);
    }
    if (selectedDates.length === 2) {
      let [startDate, endDate] = selectedDates;

      // ✅ Case 2: If same date is picked as check-in & check-out → shift checkout +1 day
      if (
        startDate &&
        endDate &&
        startDate.toDateString() === endDate.toDateString()
      ) {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        fp.setDate([startDate, endDate], true); // update flatpickr
      }

      const startDateFormatted = formatDate(startDate);
      const endDateFormatted = formatDate(endDate);

      setIsDateChanged(true);

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

  onClose: (selectedDates, dateStr, fp) => {
    if (selectedDates.length === 1) {
      // ✅ Case 1: User closed after only check-in → auto set checkout = next day
      const startDate = selectedDates[0];
      const checkOutDate = new Date(startDate);
      checkOutDate.setDate(checkOutDate.getDate() + 1);

      fp.setDate([startDate, checkOutDate], true);

      const startDateFormatted = formatDate(startDate);
      const endDateFormatted = formatDate(checkOutDate);

      setIsDateChanged(true);

      let priceSum = 0;
      const tempDate = new Date(startDate);
      while (tempDate <= checkOutDate) {
        const dateKey = formatDate(tempDate);
        if (pricesMapRef?.current[dateKey]) {
          priceSum += pricesMapRef?.current[dateKey];
        }
        tempDate.setDate(tempDate.getDate() + 1);
      }

      setSelectedDates(startDateFormatted, endDateFormatted, priceSum);
    }
  },
});



    flatpickrRef.current = instance;

    return () => {
      instance.destroy();
    };
  }, [selectedStartDate, selectedEndDate]);

  return (
    <div style={styles.input} className="flatpicker-for-calender-date">
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
