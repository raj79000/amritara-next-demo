"use client";
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import * as ReactDOM from "react-dom";
import FilterBar from '@/app/cin_booking_engine/Filterbar';
import { BookingEngineProvider } from '@/app/cin_context/BookingEngineContext';
const BannerSec = ({onClick}) => {
 
  const [isOpenFilterBar, openFilterBar] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [showFullText1, setShowFullText1] = useState(false);
  const [showFullText2, setShowFullText2] = useState(false);
  const [showFullText3, setShowFullText3] = useState(false);
  const [showFullText4, setShowFullText4] = useState(false);
  const [showFullText5, setShowFullText5] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [staahPropertyId, setStaahPropertyId] = useState(null);
  const [cityDetails, setCityDetails] = useState(null);
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
    
    if(isOpen){
      postBookingWidged("","", true,"Widget Closed");
    }else{
      postBookingWidged("","", false,"Widget Open");
    }
    if (filterBarRef.current) {
      filterBarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = filterBarRef.current.querySelector("input, select, button");
      if (firstInput) firstInput.focus();
    }
    setOpen(!isOpen);
    openFilterBar(!isOpenFilterBar);
    //setShowFilterBar(!showFilterBar);
    
  };
  const handlePropertyBookNow = async (prperty) => {
    
    setOpen(!isOpen);
    //setShowFilterBar(!showFilterBar);
    openFilterBar(!isOpenFilterBar);
    const label = prperty?.cityName;
    const value = prperty?.cityId;
    const property_Id = prperty?.staahPropertyId;
    setCityDetails({ label, value, property_Id });
    setStaahPropertyId(prperty?.staahPropertyId);
    
    if (filterBarRef.current) {
      filterBarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = filterBarRef.current.querySelector("input, select, button");
      if (firstInput) firstInput.focus();
    }
    //handleBookNow();
    if (typeof onClick === "function") {
    onClick();
  }
  };
const handleBookNowClick2 = async () => {
    {
      postBookingWidged("","", false,"Widget Open");
    }
    setOpen(false);
    setShowFilterBar(false);
  };
  return (
    <section className="hero-section position-relative vh-100 overflow-hidden h-full flex items-center justify-center">
      {/* <div className="video-background position-absolute w-100 h-100">
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          
          {vimeoSrc ? (
            <iframe
              src={vimeoSrc}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Vimeo Video"
            ></iframe>
          ) : (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              Video is not available
            </div>
          )}
        </div>
      </div> */}
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
              handlePropertyBookNow();
            }} className="search-icon-banner">
          {/* <Search /> */}
          {isOpen ? <X /> :<Search />}
        </Link>
      </div>
      
        {isOpenFilterBar && ReactDOM.createPortal (
          <BookingEngineProvider>
            <FilterBar
                selectedProperty={0}
                openBookingBar={isOpenFilterBar}
                onClose={() => {
                  openFilterBar(false);
                  setOpen(false);
                }}
            />
          </BookingEngineProvider>,
          document.body
        )}
    </section>
  )
}

export default BannerSec
