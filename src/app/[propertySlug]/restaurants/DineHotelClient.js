"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useEffect, useState } from "react";
import Diningpageslider from "../../Components/Diningpageslider"
import Image from "next/image";
import { BookingEngineProvider } from "../../cin_context/BookingEngineContext";
import FilterBar from "../../cin_booking_engine/Filterbar";
import { X } from "lucide-react";
import PropertyMainHeader from "@/app/Common/PropertyMainHeader";

export default function DineHotelClient({ propertySlug }) {
  const [propertyData, setPropertyData] = useState(null);
  const [dineData, setDineData] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bannerImages, setBannerImages] = useState([]);

  const [propertyId, setPropertyId] = useState(null);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [cityDetails, setCityDetails] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [isOpenFilterBar, openFilterBar] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const handleBookNowClick = async () => {
    setOpen(!isOpen);
    openFilterBar(!isOpenFilterBar);
    setShowFilterBar(!showFilterBar);
  };
  const handleRoomBookNow = async (room) => {
    setRoomDetails(room);
    setShowFilterBar(true);
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
        const label = found?.cityName;
        const value = found?.cityId;
        const property_Id = found?.staahPropertyId;
        setCityDetails({ label, value, property_Id });
        setPropertyId(found?.staahPropertyId);
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
      setDineData([]);
      setBanner(null);
      setLoading(false);
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/dine/GetDineByProperty?propertyId=${propertyId}`
    );
    const result = await res.json();

    const banners = result?.data || [];
    const firstBanner = banners[0] || null;


   const imageRes = await fetch(
     `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyByFilter?PropertyId=${propertyId}`
   );
   const dataJson = await imageRes.json();
   const propertyObj = dataJson?.data?.[0] || null;

   if (propertyObj) {
     setPropertyData(propertyObj); // ✅ for dynamic footer
     const imagesFromApi = propertyObj.images || [];
     const imageUrls = imagesFromApi
       .map((img) => img.propertyImage)
       .filter(Boolean);
     setBannerImages(imageUrls);
   }

   const allDineDetails =
     banners.flatMap((b) => b.dineDetails || []) || [];
   setDineData(allDineDetails);
  } catch (error) {
    console.error("Error fetching property data:", error);
    setDineData([]);
    setBanner(null);
  } finally {
    setLoading(false);
  }
};


    fetchData();
  }, [propertySlug]);

  if (loading) return <div>Loading hotel details...</div>;

  return (
    <>
      {/* <PropertyHeader
        brand_slug={propertySlug}
        id={banner?.propertyId}
        onSubmit={handleBookNowClick}
      /> */}
      <PropertyMainHeader></PropertyMainHeader>

      <section className="position-relative inner-banner-section-slider d-none">
          {bannerImages.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              autoplay={{ delay: 4000 }}
              loop
              className="w-100 slider-banner-inner"
            >
              {bannerImages.map((imgUrl, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={imgUrl}
                    alt={`Banner ${index + 1}`}
                    width={1920}
                    height={1080}
                    className="w-100 object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Image
              src="/images/banner_img.png"
              alt="Default Banner"
              width={1920}
              height={1080}
              className="w-100 object-cover"
            />
          )}

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
          {showFilterBar && (
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
            </BookingEngineProvider>
          )}
        </div>
      </section>

      <section className="Dining-Inner-Section inner-no-banner-sec">
        <div className="container">
          <div className="global-heading-sec text-center">
            <div className="row justify-content-center mb-2">
              <div className="col-md-9 md-offset-1">
                <h2 className="global-heading">
                  {banner?.dineBannerTitle || "Dining"}
                </h2>
                {/* <p className="mb-0">
                  {banner?.dineBannerDesc ||
                    "Enjoy our signature dining experiences with local and international flavors."}
                </p> */}
              </div>
            </div>
          </div>

          {/* Show slider only if data exists */}
          {dineData.length > 0 ? (
            <div className="winter-sec">
              <div className="row">
                <Diningpageslider dineData={dineData} />
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No dining data found for this property.
            </p>
          )}
        </div>
      </section>

    </>
  );
}
