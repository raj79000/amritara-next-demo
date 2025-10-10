"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "../Styles/inner-hero.css"
import { ChevronRight, Search, X  } from 'lucide-react';
import offstyle from "../Components/Homepage/offers.module.css";
import { useEffect, useState, useRef} from "react";
import * as ReactDOM from "react-dom";
import { getUserInfo } from "../../utilities/userInfo";
import FilterBar from "@/app/cin_booking_engine/Filterbar";
import { BookingEngineProvider } from "@/app/cin_context/BookingEngineContext";
import MainHeader from "../Common/MainHeader";

const AboutUs = () => {
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
        <video autoPlay loop muted playsInline className="w-100 inner-hero-image" thumbnail="/img/banner-thumbnail.png"
            poster="/img/banner-thumbnail.png"
          >
            <source src="/img/amritara-new-banner-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        {/* <Image src="/img/popular-1.jpeg" alt="About Us Hero Image" height={500} width={1500} className="w-100 inner-hero-image" /> */}
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
        
            <section className="about-us-page section-padding">
                <div className="container">
                    <div className='heading-style-1'>
                        <h1 className="mb-4 text-center global-heading">ABOUT AMRITARA</h1>
                    </div>
                    
        
                <div className="row align-items-center mb-5">
                    
                    <div className="col-md-6 order-lg-2">
                        <h4 className="h5 mb-3">At Amritara Hotels, we invite you on an extraordinary journey where every moment is crafted to perfection.</h4>
                        <p className='text-justify'>
                            Experience the unparalleled hospitality of Amritara Hotels and Resorts, with 28 luxurious 
                            properties in all 4 zones spanning across 24 cities in 11 states, including Jammu & Kashmir, 
                            Punjab, Himachal Pradesh, Uttarakhand, Rajasthan, Sikkim, Kerala, Goa, Uttar Pradesh, 
                            and Karnataka.
                        </p>
                        <p className='text-justify'>
                            From the serene landscapes of the Himalayas to the vibrant beaches of Goa, 
                            each destination offers a unique journey, ensuring unforgettable stays and cherished memories.
                            Begin a new chapter in your journey with Amritara Hotels, where every stay is a gateway to
                            unforgettable experiences.
                        </p>
                   
                    </div>
                    <div className="col-md-6 ">
                    <Image height={500} width={800}
                        src="/img/amritara-about-img.jpg"
                        alt="Luxury Stay"
                        className="img-fluid rounded shadow-sm"
                    />
                    </div>
                </div>
        
                <div className="row align-items-center">
                    
                    <div className="col-md-6">
                        <div className='heading-style-2'>
                            <h2 className="global-heading">Our Story</h2>
                        </div>
                        
                        <p className='text-justify'>
                            &ldquo;Amritara&rdquo; derives its origins from Sanskrit. &lsquo;Amrit&rsquo; means  pure, the nectar of gods or holy water and &lsquo;Tara&rsquo; means stars or celestial bodies. Amritara promises an experience for the mature, adventurous traveller. Our leisure travel offerings are geared toward rejuvenating, real-life experiences for our guests.
                        </p>
                    </div>
                    <div className="col-md-6">
                    <Image height={500} width={800}
                        src="/img/amritara-about-img.jpg"
                        alt="Luxury Stay"
                        className="img-fluid rounded shadow-sm"
                    />
                    </div>
                </div>
                </div>
            </section>
      
    </>
  );
};

export default AboutUs;
