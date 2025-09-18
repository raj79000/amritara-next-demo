"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Autoplay } from "swiper/modules";
// import BookNowForm from "@/components/BookNowForm";
import LatestOffers from "../../../Components/LatestOffers";
import DiningSlider from "../../../Components/DiningSlider";
import EventWedding from "../../../Components/EventWedding";
import Nearbycity from "../../../Components/Nearbycity";
import OverExp from "../../../Components/OverExp";
import AccommodationSlider from "../../../Components/AccommodationSlider";
import PropertyHeader from "../../../Components/PropertyHeader";
import GalleryModal from "../../../Components/GalleryModal";
import { useParams } from "next/navigation";
import PropertyFaq from "./PropertyFaq";
import Image from "next/image";
import { BookingEngineProvider } from "../../../cin_context/BookingEngineContext";
import FilterBar from "../../../cin_booking_engine/Filterbar";
import { X } from "lucide-react";
// import FooterPage from "@/components/Footer";
import InnerFooterPage from "../../../Components/InnerFooterPage";

export default function ClientOverviewPage() {
  const [showModal, setShowModal] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const { brandSlug, propertySlug } = useParams();
  const [showFullText, setShowFullText] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const [cityDetails, setCityDetails] = useState(null);
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

  const handleAccordionClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    if (!propertySlug) return;

    const fetchCityDetails = async () => {
      try {
        const resList = await fetch(
          "https://clarkscms.cinuniverse.com/Api/property/GetPropertyList"
        );
        const listData = await resList.json();

        if (
          listData?.errorMessage !== "success" ||
          !Array.isArray(listData?.data)
        ) {
          console.error("Property list fetch error:", listData);
          return;
        }

        const found = listData.data.find(
          (p) => p.propertySlug === propertySlug
        );

        if (!found) {
          console.warn(`No property found for slug: ${propertySlug}`);
          return;
        }

        // Set city details ASAP
        setCityDetails({
          label: found.cityName || "",
          value: found.cityId || "",
          property_Id: found.staahPropertyId || null,
        });

        // Also store propertyId for later use
        setPropertyId(found.propertyId);
      } catch (error) {
        console.error("Error fetching property list:", error);
      }
    };

    fetchCityDetails();
  }, [propertySlug]);

  useEffect(() => {
    if (!propertyId) return;

    const fetchPropertyData = async () => {
      setLoading(true);
      try {
        const resDetails = await fetch(
          `https://clarkscms.cinuniverse.com/Api/property/GetPropertyByFilter?PropertyId=${propertyId}`
        );
        const detailsData = await resDetails.json();

        setPropertyData(detailsData?.data?.[0] || null);
      } catch (error) {
        console.error("Error fetching property data:", error);
        setPropertyData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyId]);

  if (loading) return <div>Loading hotel details...</div>;
  if (!propertyData) return <div>No property data found.</div>;

  return (
    <>
      <PropertyHeader
        brand_slug={brandSlug}
        id={propertyData.propertyId}
        onSubmit={handleBookNowClick}
      />
      <section className="position-relative banner-section">
        {propertyData.images && propertyData.images.length > 0 ? (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="w-100 h-[100vh]"
          >
            {propertyData.images.map((img, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={img.propertyImage || "/default-image.jpg"}
                  alt={`Banner Image`}
                  width={1920}
                  height={500}
                  className="w-full h-[20vh] object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div>No images available</div>
        )}

        
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
      </section>

       <section className="mt-5">
        <div className="container-fluid p-0">
          <div className="global-heading-sec text-center">
            <div className="row justify-content-center mb-0">
              <div className="col-md-9 md-offset-1">
                <h1 className="global-heading">
                  {propertyData?.propertyTitle || "Clarks Hotel"}
                </h1>
                {/* <p className="mb-0">{propertyData?.description}</p> */}
                <p className="mb-0">
                  {propertyData?.description.length > 200 ? (
                    <>
                      {showFullText
                        ? propertyData?.description
                        : propertyData?.description.slice(0, 200) + "..."}
                      <span
                        onClick={() => setShowFullText(!showFullText)}
                        style={{
                          cursor: "pointer",
                          color: "#000",
                          fontWeight: "600",
                        }}
                      >
                        {showFullText ? " ❮❮" : " ❯❯"}
                      </span>
                    </>
                  ) : (
                    propertyData?.description
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <AccommodationSlider
        propertyId={propertyData.propertyId}
        setShowModal={setShowModal}
        setSelectedRoom={setSelectedRoom}
        onSubmit={handleRoomBookNow}
      />

      <GalleryModal
        showModal={showModal}
        setShowModal={setShowModal}
        roomData={selectedRoom}
      />

      <DiningSlider propertyId={propertyData.propertyId} />

      
      <section className="sec-padding d-none" data-aos="fade-up">
        <div className="container">
          <div className="winter-sec">
            <div className="row">
              <LatestOffers />
            </div>
          </div>
        </div>
      </section>

      <EventWedding propertyId={propertyData.propertyId} />

      <section className="sec-padding d-none" data-aos="fade-up">
        <div className="container">
          <div className="global-heading-sec text-center">
            <div className="row justify-content-center mb-4">
              <div className="col-md-9 md-offset-1">
                <h2 className="global-heading pt-4">Experiences</h2>
                <p className="mb-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>
              </div>
            </div>
          </div>
          <div className="winter-sec">
            <div className="row">
              <OverExp />
            </div>
          </div>
        </div>
      </section>
 
      <section className="d-none">
        <div className="container">
          <div className="global-heading-sec text-center">
            <div className="row justify-content-center mb-4">
              <div className="col-md-9 md-offset-1">
                <h2 className="global-heading">NEAR BY ATTRACTIONS</h2>
                <p className="mb-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>
              </div>
            </div>
          </div>
          <div className="winter-sec">
            <div className="row">
              <Nearbycity />
            </div>
          </div>
        </div>
      </section>
      <PropertyFaq></PropertyFaq>

      <InnerFooterPage propertyData={propertyData} />
    </>
  );
}
