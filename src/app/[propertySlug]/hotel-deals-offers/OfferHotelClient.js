"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Offerpagesslider from "../../Components/Offerpageslider";
import Image from "next/image";
import { BookingEngineProvider } from "../../cin_context/BookingEngineContext";
import FilterBar from "../../cin_booking_engine/Filterbar";
import { X } from "lucide-react";
import PropertyMainHeader from "@/app/Common/PropertyMainHeader";

export default function OfferHotelClient({ propertySlug }) {
  const [offers, setOffers] = useState([]);
  const [propertyId, setPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bannerImages, setBannerImages] = useState([]);
  const [staahPropertyId, setStaahPropertyId] = useState(null);
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

useEffect(() => {
  if (!propertySlug) return;

  async function fetchData() {
    setLoading(true);
    try {
      // Step 1: Get propertyId
      const propRes = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`
      );
      const propJson = await propRes.json();
      const property = propJson.data.find(
        (p) => p.propertySlug?.toLowerCase() === propertySlug.toLowerCase()
      );
      const id = property?.propertyId || null;

      const label = property?.cityName;
      const value = property?.cityId;
      const property_Id = property?.staahPropertyId;
      setCityDetails({ label, value, property_Id });
      setStaahPropertyId(property?.staahPropertyId);

      setPropertyId(id);

      if (!id) {
        setOffers([]);
        setBannerImages([]);
        setLoading(false);
        return;
      }

      // Step 2: Fetch offers
      const offerRes = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/offers/GetOffersByProperty?propertyId=${id}`
      );
      const offerJson = await offerRes.json();
      const offerData = offerJson?.data?.[0]?.offersInfo || [];
      setOffers(offerData);

      // ✅ Collect ALL offer images for banner
      const offerImgs = offerData
        .flatMap((offer) => offer.offersImages || []) // flatten nested arrays
        .map((img) => img.offerImages) // take image path
        .filter(Boolean); // remove null/empty

      setBannerImages(offerImgs);
    } catch (error) {
      console.error("Error fetching data:", error);
      setOffers([]);
      setBannerImages([]);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [propertySlug]);


  if (loading) return <div>Loading offers...</div>;

  return (
    <>
      <PropertyMainHeader />

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
                selectedProperty={parseInt(staahPropertyId)}
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

      {offers.length > 0 ? (
        <section className="inner-offer-page-sec inner-no-banner-sec">
          <div className="container">
            <div className="global-heading-sec text-center">
              <div className="row justify-content-center mb-2">
                <div className="col-md-9 md-offset-1">
                  <h2 className="global-heading">OFFERS</h2>
                </div>
              </div>
            </div>

            <div className="container">
              <div className="winter-sec">
                <div className="row">
                  <Offerpagesslider offers={offers} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="text-center" style={{ marginTop: "50px" }}>
          <p>No offers available for this property at the moment.</p>
        </section>
      )}
    </>
  );
}
