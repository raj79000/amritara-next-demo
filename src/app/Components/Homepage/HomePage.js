"use client";
import React, { useState, useRef, useEffect } from "react";
import Footer from "@/app/Common/Footer";
import dynamic from "next/dynamic";

const MainHeader = dynamic(() => import("../../Common/MainHeader"), { ssr: false });
const BannerSec = dynamic(() => import("./BannerSec"), { ssr: false });
const AboutSec = dynamic(() => import("./AboutSec"), { ssr: false });
const NestedSwiper = dynamic(() => import("./NestedSlider"), { ssr: false });
const NewOfferSlider = dynamic(() => import("./NewOfferSlider"), { ssr: false });
const ZonesList = dynamic(() => import("./ZonesList"), { ssr: false });
const UntoldStories = dynamic(() => import("./UntoldStories"), { ssr: false });
import * as ReactDOM from "react-dom";
import { getUserInfo } from "../../../utilities/userInfo";
import FilterBar from "@/app/cin_booking_engine/Filterbar";
import { BookingEngineProvider } from "@/app/cin_context/BookingEngineContext";
import Link from "next/link";
import { Search, X } from 'lucide-react'
import CorporateOffers from "./CorporateOffers";

export default function HomePage (){
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
const handleBookNowClick2 = async () => {
    {
      postBookingWidged("","", false,"Widget Open");
    }
    setOpen(!isOpen);
    setShowFilterBar(!showFilterBar);
  };
  return (
    <>

      <MainHeader onClick={handleBookNowClick2}></MainHeader>
      {/* <BannerSec  onClick={handleBookNowClick2}></BannerSec> */}
      <section className="hero-section position-relative vh-100 overflow-hidden h-full flex items-center justify-center">
      <video className="w-100 h-[102vh] object-cover for-desktop-video-main"
      autoPlay
            muted
            loop
            playsInline
            preload="auto">
        <source src="/amritara-new-banner-video.mp4" type="video/mp4" />
      </video>
      {/* <video src="/amritara-new-banner-video.mp4" autoPlay loop ></video> */}
       <div className="hero-bottom-part-ab">
        <Link href="#" onClick={(e) => {
              e.preventDefault();
              handleBookNowClick2();
            }} className="search-icon-banner">
          {isOpen ? <X /> :<Search />}
        </Link>
      </div> 
      
        {/* <div
          className={`absolute left-1/2 transform -translate-x-1/2 home-page-class`}
          style={{ zIndex: 10 }}
        >
          <Link href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleBookNowClick2();
            }}
            className="p-2 bg-white flex items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 hero-banner-book-now-btn"
          >
            {isOpen ? <X /> :<Search />}
          </Link>
        </div> */}
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
      <AboutSec></AboutSec>
      <NestedSwiper></NestedSwiper>
      <UntoldStories></UntoldStories>
      <ZonesList></ZonesList>
      {/* <NewOfferSlider></NewOfferSlider> */}
      <CorporateOffers></CorporateOffers>

        {/* {showFilterBar && ReactDOM.createPortal (
          <BookingEngineProvider>
            <FilterBar
              selectedProperty={0}
              openBookingBar={showFilterBar}
              onClose={() => {
                setShowFilterBar(false);
                setOpen(false);
              }}
            />
          </BookingEngineProvider>,
          document.body
        )} */}
        
      {/* <section className="position-relative" ref={filterBarRef}>
             <div className="position-absolute top-100 start-0 w-100 bg-white shadow" >
      
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
                
              </div>
              </section> */}
    </>
  )
}

