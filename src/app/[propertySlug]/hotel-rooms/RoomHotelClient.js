"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import BookNowForm from "@/components/BookNowForm";
import AccommodationSlider from "../../Components/AccommodationSlider"
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import * as ReactDOM from "react-dom";
import { BookingEngineProvider } from "@/app/cin_context/BookingEngineContext";
import FilterBar from "@/app/cin_booking_engine/Filterbar";
import { X } from "lucide-react";
import PropertyMainHeader from "@/app/Common/PropertyMainHeader";
import GalleryModal from "../../Components/GalleryModal";
// import { getUserInfo } from "../../../../utilities/userInfo";

export default function RoomHotelClient() {
  const { brandSlug, propertySlug } = useParams();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

  const [bannerImages, setBannerImages] = useState([]);
      const [propertyData, setPropertyData] = useState(null);

  const [showFilterBar, setShowFilterBar] = useState(false);
  const [cityDetails, setCityDetails] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [isOpenFilterBar, openFilterBar] = useState(false);
  const [staahPropertyId, setStaahPropertyId] = useState(null);
  const [isOpen, setOpen] = useState(false);
  
   
      async function postBookingWidged(rooms,mapping, isClose,ctaName,selectedPropertyId) {
       const resp = await getUserInfo();
         const sessionId = sessionStorage?.getItem("sessionId");
         const payload = {
         ctaName: ctaName,
         urls: window.location.href,
         cityId: 0,
         propertyId: selectedPropertyId ? parseInt(selectedPropertyId) :0,
         checkIn: "",
         checkOut: "",
         adults: 0,
         children: 0,
         rooms: 0,
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
    setOpen(!isOpen);
    openFilterBar(!isOpenFilterBar);
    setShowFilterBar(!showFilterBar);
  };
  const handleRoomBookNow = async (room) => {
    
    if(isOpen){
      postBookingWidged("","", true,"Widget Closed");
    }else{
      postBookingWidged("","", false,"Widget Open");
    }
    setOpen(!isOpen);
    setRoomDetails(room);
    openFilterBar(!isOpenFilterBar);
    setShowFilterBar(!showFilterBar);
  };
  const handleAccordionClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Step 1: Fetch propertyId by slug
  useEffect(() => {
    if (!propertySlug) return;

    const fetchPropertyIdFromSlug = async (slug) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`
        );
        const json = await res?.json();
        if (json.errorMessage !== "success") {
          console.error("Property list fetch error:", json);
          return null;
        }
        const found = json.data.find((p) => p.propertySlug === slug);

        const label = found?.cityName;
        const value = found?.cityId;
        const property_Id = found?.staahPropertyId;
        setCityDetails({ label, value, property_Id });
        // setPropertyId(found?.propertyId);
        // setStaahPropertyId(found?.staahPropertyId);
        return found?.propertyId || null;
      } catch (error) {
        console.error("Error fetching property list:", error);
        return null;
      }
    };

    const loadPropertyId = async () => {
      setLoading(true);
      const id = await fetchPropertyIdFromSlug(propertySlug);
      setPropertyId(id);
      setLoading(false);
    };

    loadPropertyId();
  }, [propertySlug]);

 useEffect(() => {
  if (!propertyId) return;

  const fetchPropertyDetails = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/Api/property/GetPropertyByFilter?PropertyId=${propertyId}`
      );
      const json = await res.json();

      if (json.errorMessage !== "success") {
        console.error("Property details fetch error:", json);
        return;
      }

    //  const images = json.data?.[0]?.images || [];
    //  setBannerImages(images.map((img) => img.propertyImage));
     const fetchedPropertyData = json.data?.[0] || null;
     setPropertyData(fetchedPropertyData);

     const images = fetchedPropertyData?.images || [];
     setBannerImages(images.map((img) => img.propertyImage));
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  };

  fetchPropertyDetails();
}, [propertyId]);

  //if (loading) return <div>Loading accommodation details...</div>;
  // if (!propertyId)
  //   return <div>No accommodation data found for this property.</div>;

  return (
    <>
      {/* <PropertyHeader
        brand_slug={brandSlug}
        id={propertyId}
        onSubmit={handleBookNowClick}
      /> */}
      <PropertyMainHeader></PropertyMainHeader>
      <section className="position-relative banner-section">
        <div className="w-100 overflow-hidden rounded-0 mtspace5">
          {bannerImages.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              autoplay={{ delay: 4000 }}
              loop={true}
              className="w-100 h-[70vh]"
            >
              {bannerImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={image || "/amritara-dummy-room.jpeg"}
                    alt={`Banner ${index + 1}`}
                    width={1920}
                    height={1080}
                    className="w-full h-[70vh] object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Image
              src="/amritara-dummy-room.jpeg"
              alt="Default Banner"
              width={1920}
              height={1080}
              className="w-100 h-[70vh] object-cover"
            />
          )}
        </div>

        <div className="position-absolute bottom-0 start-0 w-100 bg-white shadow">
          
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 home-page-class`}
            style={{ zIndex: 10 }}
          > 
          </div>
          {showFilterBar && ReactDOM.createPortal (
            <BookingEngineProvider>
              <FilterBar
                selectedProperty={parseInt(cityDetails.property_Id)}
                cityDetails={cityDetails}
                roomDetails={roomDetails}
                openBookingBar={isOpenFilterBar}
                onClose={() => {
                  openFilterBar(false);
                  setOpen(false);
                  setShowFilterBar(false);
                }}
              />
            </BookingEngineProvider>,
          document.body
          )}
        </div>
      </section>

      <section className="position-relative">
        <div className="position-absolute top-100 start-0 w-100 bg-white shadow">
          {isOpenFilterBar &&
            ReactDOM.createPortal(
              <section className="filter-bar-hotels-cin">
                <BookingEngineProvider>
                  <FilterBar
                selectedProperty={parseInt(cityDetails.property_Id)}
                cityDetails={cityDetails}
                roomDetails={roomDetails}
                openBookingBar={isOpenFilterBar}
                onClose={() => {
                  openFilterBar(false);
                  setOpen(false);
                  setShowFilterBar(false);
                }}
              />
                </BookingEngineProvider>
              </section>,
              document.body
            )}
        
        </div>
      </section>


      <section className="inner-no-banner-sec-old">
        <div className="container-fluid">
          <div className="winter-sec">
            <div className="row">
              { propertyId && <AccommodationSlider
                propertyId={propertyId}
                setShowModal={setShowModal}
                setSelectedRoom={setSelectedRoom}
                onSubmit={handleRoomBookNow}
              />}
              <GalleryModal
                showModal={showModal}
                setShowModal={setShowModal}
                roomData={selectedRoom}
              />
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
