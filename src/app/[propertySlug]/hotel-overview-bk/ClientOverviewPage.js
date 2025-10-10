"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import "swiper/css/pagination";
import Link from "next/link";

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import PropertyMainHeader from "@/app/Common/PropertyMainHeader";
import AccommodationSlider from "@/app/Components/AccommodationSlider";
import GalleryModal from "@/app/Components/GalleryModal";
import DiningSlider from "@/app/Components/DiningSlider";
import LatestOffers from "@/app/Components/LatestOffers";
import OverExp from "@/app/Components/OverExp";
import Nearbycity from "@/app/Components/Nearbycity";
import PropertyFaq from "./PropertyFaq";
import PropertyGalleryOverview from "@/app/Components/PropertyGalleryOverview";
import PropertyTestimonials from "@/app/Components/PropertyTestimonials";

export default function ClientOverviewPage({
  propertySlug: slugFromProps,
  propertyId: idFromProps,
  propertyName: nameFromProps,
}) {
  const { propertySlug: slugFromRoute } = useParams();

  const slug = slugFromProps ?? slugFromRoute;
  const [propertyId, setPropertyId] = useState(idFromProps ?? null);
  const [propertyName, setPropertyName] = useState(nameFromProps ?? null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [cityDetails, setCityDetails] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  // ...other state

  // If we don't yet have propertyId (or name), look it up by slug
  useEffect(() => {
    if (!slug || propertyId) return;

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`
        );
        const json = await res.json();
        const found = json?.data?.find((p) => p.propertySlug === slug);
        if (found) {
          setPropertyId(found.propertyId);
          setPropertyName((prev) => prev ?? found.propertyName);
          setCityDetails({
            label: found.cityName || "",
            value: found.cityId || "",
            property_Id: found.staahPropertyId || null,
          });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [slug, propertyId]);

  useEffect(() => {
    if (!slug) return;
    if (cityDetails) return;

  }, [slug, cityDetails]);

  useEffect(() => {
    if (!propertyId) return;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyByFilter?PropertyId=${propertyId}`
        );
        const json = await res.json();
        setPropertyData(json?.data?.[0] ?? null);
      } catch (e) {
        console.error(e);
        setPropertyData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [propertyId]);

  if (loading) return <div>Loading hotel details...</div>;
  if (!propertyData) return <div>No property data found.</div>;

  return (
    <>
      <PropertyMainHeader
        // propertySlug={propertySlug}
        id={propertyData.propertyId}
      />
      <section className="hero-section position-relative overflow-hidden h-full flex items-center justify-center">

        <video className="w-100 object-cover for-desktop-video-main"
          autoPlay
          muted
          loop
          playsInline
          preload="auto">
          <source src="/amritara-new-banner-video.mp4" type="video/mp4" />
        </video>
        {/* <video src="/amritara-new-banner-video.mp4" autoPlay loop ></video> */}
        {/* <div className="hero-bottom-part-ab">
        <Link href="#" className="search-icon-banner">
          <Search />
        </Link>
      </div> */}
      </section>

      <section className="position-relative banner-section d-none">
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
                  src={
                    // img.propertyImage ||
                    "/default-image.jpg"}
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


        {/* <div
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
        </div> */}

      </section>

      <section className="overview-about-page-sec">
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
                        ? propertyData?.description.replace(/<[^>]+>/g, "")
                        : propertyData?.description.replace(/<[^>]+>/g, "").slice(0, 200) + "..."}
                      <span
                        onClick={() => setShowFullText(!showFullText)}
                        style={{
                          cursor: "pointer",
                          color: "#000",
                          fontWeight: "600",
                        }}
                      >
                        {showFullText ? " read less" : " read more"}
                      </span>
                    </>
                  ) : (
                    propertyData?.description.replace(/<[^>]+>/g, "")
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
      // onSubmit={handleRoomBookNow}
      />

      <GalleryModal
        showModal={showModal}
        setShowModal={setShowModal}
        roomData={selectedRoom}
      />



      <DiningSlider propertyId={propertyData.propertyId} />

      {/* <EventWedding propertyId={propertyData.propertyId} /> */}


      <section className="sec-padding" data-aos="fade-up">
        <div className="container">
          <div className="global-heading-sec text-center">
            <div className="row justify-content-center mb-4">
              <div className="col-md-9 md-offset-1">
                <h2 className="global-heading pt-4">Offers</h2>
              </div>
            </div>
          </div>
          <div className="winter-sec">
            <div className="row">
              <LatestOffers propertyId={propertyData.propertyId} />
            </div>
          </div>
        </div>
      </section>





      <section className="sec-padding bg-lred" data-aos="fade-up">
        <div className="container">
          <div className="global-heading-sec text-center">
            <div className="row justify-content-center mb-0">
              <div className="col-md-9 md-offset-1">
                <h2 className="global-heading pt-0">Experiences</h2>
              </div>
            </div>
          </div>
          <div className="winter-sec">
            <div className="row">
              <OverExp propertyId={propertyData.propertyId} />
            </div>
          </div>
        </div>
      </section>

      {/* <Nearbycity /> */}


      <PropertyGalleryOverview propertyId={propertyData.propertyId}></PropertyGalleryOverview>


      <PropertyTestimonials propertyId={propertyData.propertyId}></PropertyTestimonials>


      <PropertyFaq propertyId={propertyData.propertyId} />

    </>
  );
}
