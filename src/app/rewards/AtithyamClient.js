"use client";
import Image from "next/image";
import CardsData from "./CardsData";
import TierWiseDataTable from "./TierWiseDataTable";
import Link from "next/link";
import "../Styles/inner-hero.css"
import { ChevronRight, Search, X  } from 'lucide-react';
import React, { useEffect, useState, useRef} from "react";
import * as ReactDOM from "react-dom";
import { getUserInfo } from "../../utilities/userInfo";
import FilterBar from "@/app/cin_booking_engine/Filterbar";
import { BookingEngineProvider } from "@/app/cin_context/BookingEngineContext";
import MainHeader from "../Common/MainHeader";

const AtithyamClient = () => {
  
      const [isOpen, setOpen] = useState(false);
      const [showFilterBar, setShowFilterBar] = useState(false);
      const filterBarRef = useRef(null);
    
  async function postBookingWidged(rooms,mapping, isClose,ctaName,selectedPropertyId) {
   const resp = await getUserInfo();
     const sessionId = sessionStorage?.getItem("sessionId");
     const payload = {
     ctaName: ctaName,
     urls: window.location.href,
     cityId: "0",
     propertyId: selectedPropertyId?.toString() || "0",
     checkIn: "",
     checkOut: "",
     adults: "0",
     children: "0",
     rooms: "0",
     promoCode: "",
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
  const handleBookNowClick = async () => {
      {
        postBookingWidged("","", false,"Widget Open");
      }
      setOpen(!isOpen);
      setShowFilterBar(!showFilterBar);
    };
  return (
    <>
    <MainHeader onClick={handleBookNowClick}></MainHeader>
    <section className="hero-section-inner" ref={filterBarRef}>
      <div className="inner-hero-content">
            <div className="text-center">
                <Link href="#" onClick={(e) => {
              e.preventDefault();
              handleBookNowClick();
            }} className="search-icon-banner">
          {isOpen ? <X /> :<Search />}
        </Link>
            </div>
        </div>
                
       {showFilterBar && ReactDOM.createPortal(
        <section className="filter-bar-hotels-cin">
         <BookingEngineProvider>
           <FilterBar
             selectedProperty={0}
             openBookingBar={showFilterBar}
             onClose={() => {
               setShowFilterBar(false);
               setOpen(false);
             }}
           />
         </BookingEngineProvider>
        </section>,
          document.body
        )}
    </section>
      <div className="rewards-page-data">
        <div className="atithyam-logo">
          <Image
            src="/rewards/atithyam_logo.png"
            alt="Atithyam Logo"
            width={300}
            height={200}
            style={{ height: "auto" }}
          />
        </div>
        <div className="rewards-content">
          <div className="heading-style-1">
            <h1 className="mb-4 mt-4 text-center global-heading">
              Unlock a World of Exclusive Rewards and Privileges
            </h1>
          </div>
          <h4 className="text-center mb-4 about-text-rewards">
              With tiers that grow with you—Aarambh, Swarna, and Amrit—
              <b>
                <i>Atithyam</i>
              </b>{" "}
              <br />
              ensures your journey is enriched at every step.
            </h4>
            <Link href="/signin" className="reward-join-now-btn">Join Now</Link>
        </div>
      </div>

      <CardsData></CardsData>
      <TierWiseDataTable></TierWiseDataTable>

      <style jsx>{`
        .rewards-page-data {
          text-align: center;
          padding: 100px 0 50px 0;
        }
        .rewards-page-data .atithyam-logo img {
          text-align: center;
          width: 300px;
          height: auto !important;
          margin: 0 auto;
        }
        .rewards-page-data .heading-style-1:after,
        .rewards-page-data .heading-style-1:before {
          display: none !important;
        }
        .about-text-rewards b {
          font-weight: 600 !important;
          color: var(--red) !important;
        }
        .about-text-rewards i {
          font-style: italic;
        }
        
      `}</style>
    </>
  );
};

export default AtithyamClient;
