"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AccommodationSlider from "../../../Components/AccommodationSlider";
import GalleryModal from "../../../Components/GalleryModal";
import PropertyHeader from "../../../Components/PropertyHeader";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BookingEngineProvider } from "../../../cin_context/BookingEngineContext";
import FilterBar from "../../../cin_booking_engine/Filterbar";
import { X } from "lucide-react";
import InnerFooterPage from "../../../Components/InnerFooterPage";

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
  const [isOpen, setOpen] = useState(false);

  const handleBookNowClick = async () => {
    setOpen(!isOpen);
    openFilterBar(!isOpenFilterBar);
    setShowFilterBar(!showFilterBar);
  };

  const handleRoomBookNow = async (room) => {
    setOpen(!isOpen);
    setRoomDetails(room);
    openFilterBar(!isOpenFilterBar);
    setShowFilterBar(!showFilterBar);
  };

  useEffect(() => {
    if (!propertySlug) return;

    const fetchPropertyIdFromSlug = async (slug) => {
      try {
        const res = await fetch(
          "https://clarkscms.cinuniverse.com/Api/property/GetPropertyList"
        );
        const json = await res.json();
        if (json.errorMessage !== "success") {
          console.error("Property list fetch error:", json);
          return null;
        }
        const found = json.data.find((p) => p.propertySlug === slug);

        const label = found?.cityName;
        const value = found?.cityId;
        const property_Id = found?.staahPropertyId;
        setCityDetails({ label, value, property_Id });
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
        `https://clarkscms.cinuniverse.com/Api/property/GetPropertyByFilter?PropertyId=${propertyId}`
      );
      const json = await res.json();

      if (json.errorMessage !== "success") {
        console.error("Property details fetch error:", json);
        return;
      }

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

  if (loading) return <div>Loading accommodation details...</div>;
  if (!propertyId)
    return <div>No accommodation data found for this property.</div>;

  return (
    <>
      <PropertyHeader
        brand_slug={brandSlug}
        id={propertyId}
        onSubmit={handleBookNowClick}
      />
      <section className="position-relative banner-section d-none">
        <div className="w-100 overflow-hidden rounded-0 mtspace5">
          {bannerImages.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              autoplay={{ delay: 4000 }}
              loop={true}
              className="w-100 h-[100vh]"
            >
              {bannerImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={image || "/images/banner_img.png"}
                    alt={`Banner ${index + 1}`}
                    width={1920}
                    height={1080}
                    className="w-full h-[100vh] object-cover"
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
              className="w-100 h-[100vh] object-cover"
            />
          )}
        </div>

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
          )}
        </div>
      </section>

      <section className="inner-no-banner-sec">
        <div className="container-fluid">
          <div className="winter-sec">
            <div className="row">
              <AccommodationSlider
                propertyId={propertyId}
                setShowModal={setShowModal}
                setSelectedRoom={setSelectedRoom}
                onSubmit={handleRoomBookNow}
              />
              <GalleryModal
                showModal={showModal}
                setShowModal={setShowModal}
                roomData={selectedRoom}
              />
            </div>
          </div>
        </div>
      </section>

       <InnerFooterPage propertyData={propertyData} />
    </>
  );
}
