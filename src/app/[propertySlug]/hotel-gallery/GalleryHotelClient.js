"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import * as ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
// import BookNowForm from "@/components/BookNowForm";
// import PropertyHeader from "@/components/PropertyHeader";
import HotelGallery from "@/app/Components/PropertyGallery";
import { BookingEngineProvider } from "@/app/cin_context/BookingEngineContext";
import FilterBar from "@/app/cin_booking_engine/Filterbar";
import { X } from "lucide-react";
// import { getUserInfo } from "../../../../utilities/userInfo";
import PropertyMainHeader from "@/app/Common/PropertyMainHeader";

export default function GalleryHotelClient({ propertySlug, id }) {
  const [galleryData, setGalleryData] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [loading, setLoading] = useState(true);
    const [propertyData, setPropertyData] = useState(null);

  const [propertyId, setPropertyId] = useState(null);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [cityDetails, setCityDetails] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [isOpenFilterBar, openFilterBar] = useState(false);
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
             `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/tracker/BookingWidged`,
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
 useEffect(() => {
  if (!propertySlug) return;

  const fetchPropertyIdFromSlug = async (slug) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`
      );
      const json = await res.json();
      if (json.errorMessage !== "success") {
        console.error("Property list fetch error:", json);
        return null;
      }
      const found = json.data.find(
        (p) => p.propertySlug.toLowerCase() === slug.toLowerCase()
      );

      if (!found) return null;

      const label = found?.cityName;
      const value = found?.cityId;
      const property_Id = found?.staahPropertyId;

      // ✅ City + staah for booking engine
      setCityDetails({ label, value, property_Id });

      // ✅ Important: set propertyId from actual propertyId
      setPropertyId(found?.propertyId);

      return found?.propertyId || null;
    } catch (error) {
      console.error("Error fetching property list:", error);
      return null;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const propertyId = await fetchPropertyIdFromSlug(propertySlug);
      if (!propertyId) {
        setPropertyData(null);
        setLoading(false);
        return;
      }

      const result = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyByFilter?PropertyId=${propertyId}`
      );
      const json = await result.json();
      const property = json?.data?.[0] || null;
      setPropertyData(property);

      // ✅ Banner images
      const images = property?.images || [];
      const validImageUrls = images
        .map((img) => img.propertyImage)
        .filter(Boolean);
      setBannerImages(validImageUrls);
    } catch (error) {
      console.error("Error fetching property data:", error);
      setPropertyData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryData = async () => {
    setLoading(true);
    try {
      const propertyId = await fetchPropertyIdFromSlug(propertySlug);
      if (!propertyId) {
        setGalleryData([]);
        setBannerImages([]);
        return;
      }

      // ✅ Fetch gallery data
      const galleryRes = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/gallery/GetGalleryByProperty?propertyId=${propertyId}`
      );
      const galleryResult = await galleryRes.json();

      if (
        galleryResult.errorMessage === "success" &&
        Array.isArray(galleryResult.data)
      ) {
        const formattedImages = galleryResult.data.flatMap((gallery) =>
          (gallery.galleryImages || []).map((img) => ({
            id: img.galleryImageId,
            src: img.image,
            caption: gallery.galleryTitle || "",
            category: gallery.galleryCategory || "Uncategorized",
          }))
        );
        setGalleryData(formattedImages);
      } else {
        setGalleryData([]);
      }
    } catch (error) {
      console.error("Error in data fetch:", error);
      setGalleryData([]);
      setBannerImages([]);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  fetchGalleryData();
}, [propertySlug]);


  return (
    <>
      {/* <PropertyHeader
        brand_slug={propertySlug}
        id={id}
        onSubmit={handleBookNowClick}
      /> */}
      <PropertyMainHeader
        brand_slug={propertySlug}
        id={id}
        onSubmit={() => {}}
      />

      {/* ✅ Banner Section with Swiper */}
      <section className="position-relative banner-section d-none">
        <div className="w-100 overflow-hidden rounded-0 mtspace5">
          {bannerImages.length > 0 ? (
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              autoplay={{ delay: 3000 }}
              navigation
              loop
              className="w-100 h-[90vh]"
            >
              {bannerImages.map((img) => (
                <SwiperSlide key={img.id}>
                  <img
                    src={img.src}
                    alt="Banner"
                    className="w-100 h-[90vh] object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src="/images/banner_img.png"
              alt="Default Banner"
              className="w-100 h-[90vh] object-cover"
            />
          )}
        </div>

        <div className="position-absolute bottom-0 start-0 w-100 bg-white shadow">
          {/* <BookNowForm /> */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 home-page-class`}
            style={{ zIndex: 10 }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                handleBookNowClick();
              }}
              className="p-2 bg-white flex items-center justify-center rounded-full"
            >
              {isOpen ? <X size={18} color="black" /> : "Book Now"}
            </button>
          </div>
          {showFilterBar && ReactDOM.createPortal (
            <BookingEngineProvider>
              <FilterBar
                selectedProperty={parseInt(propertyId)}
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

      <section className="inner-no-banner-sec">
        <div className="container">
          <div className="global-heading-sec text-center">
            <h2 className="global-heading">Our Gallery</h2>
          </div>
          <HotelGallery galleryData={galleryData} />
        </div>
      </section>

    </>
  );
}
