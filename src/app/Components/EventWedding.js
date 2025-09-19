"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import VenueEventEnquiryModal from "./EventVenueEnquiryModal";

const EventWedding = ({ propertyId, hotelName }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerData, setBannerData] = useState({ title: "", desc: "" });
  const [showModal, setShowModal] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [showFullText1, setShowFullText1] = useState(false);

  const [propertySlug, setPropertySlug] = useState("");
  const [cityId, setCityId] = useState("");
  const [selectedVenueTitle, setSelectedVenueTitle] = useState(""); // store selected venue title

  useEffect(() => {
    if (!propertyId) {
      console.warn("No propertyId provided to EventWedding");
      setLoading(false);
      return;
    }

    // Fetch venue data
    const fetchVenue = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/property/GetPropertyVenueBanner?propertyId=${propertyId}`
        );
        const json = await response.json();

        if (json?.errorCode === "0" && Array.isArray(json.data)) {
          const venueItems = [];

          json.data.forEach((entry) => {
            const bg =
              entry.vanueBannerImages?.[0]?.venueImages ||
              "/images/fallback-banner.jpg";

            (entry.roomsInfo || []).forEach((venue) => {
              venueItems.push({
                bg,
                thumb: venue.venuesImages?.[0]?.images || "/images/img-3.jpg",
                title: venue.venueName || "",
                description: venue.venueDesc || "",
              });
            });
          });

          setSlides(venueItems);

          setBannerData({
            title: json.data?.[0]?.venueBannerTitle || "",
            desc: json.data?.[0]?.venueBannerDesc || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch venue data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch propertySlug and cityId
    const fetchPropertyDetails = async () => {
      try {
        const propertyRes = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/property/GetPropertyByFilter?PropertyId=${propertyId}`
        );
        const propertyJson = await propertyRes.json();

        if (
          propertyJson?.errorCode === "0" &&
          Array.isArray(propertyJson.data) &&
          propertyJson.data.length > 0
        ) {
          const propertyDetails = propertyJson.data[0];
          setPropertySlug(propertyDetails.propertySlug || "");
          setCityId(propertyDetails.cityId || "");
        }
      } catch (error) {
        console.error("Failed to fetch property details:", error);
      }
    };

    fetchVenue();
    fetchPropertyDetails();
  }, [propertyId]);

  return (
    <>
      <section data-aos="fade-up" className="mt-5 d-none">
        <div className="container-fluid">
          <div className="winter-sec">
            <div className="w-full">
              <div className="row justify-content-center">
                <div className="col-md-9">
                  {bannerData.title && (
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold">
                        {bannerData.title || "Meetings & Events"}
                      </h3>
                      {bannerData.desc && (
                        <p className="mb-2 whitespace-pre-line">
                          {bannerData?.desc.length > 150 ? (
                            <>
                              {showFullText
                                ? bannerData?.desc
                                : bannerData?.desc.slice(0, 150) + "..."}
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
                            bannerData?.desc
                          )}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <Swiper
                navigation
                modules={[Navigation]}
                slidesPerView={1}
                className="overv-dine"
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div className="new-type-dine-sec py-4">
                      <div className="container pushed-wrapper">
                        <div className="row">
                          <div
                            className="pushed-image"
                            style={{ backgroundImage: `url(${slide.thumb})` }}
                          ></div>
                          <div className="pushed-box">
                            <div className="pushed-header">
                              <span className="header-1">{slide.title}</span>
                              <span className="header-3">
                                {slide?.description.length > 150 ? (
                                  <>
                                    {showFullText1
                                      ? slide?.description
                                      : slide?.description.slice(0, 150) + "..."}
                                    <span
                                      onClick={() =>
                                        setShowFullText1(!showFullText1)
                                      }
                                      style={{
                                        cursor: "pointer",
                                        color: "#000",
                                        fontWeight: "600",
                                        display: "inline-block",
                                      }}
                                    >
                                      {showFullText1 ? " ❮❮" : " ❯❯"}
                                    </span>
                                  </>
                                ) : (
                                  slide?.description
                                )}
                              </span>
                              <div className="flex mt-3 gap-2">
                                {propertySlug ? (
                                  <Link
                                    href={`/${propertySlug}/meeting-events`}
                                    className="box-btn know-more"
                                  >
                                    EXPLORE MORE
                                  </Link>
                                ) : (
                                  <button className="box-btn know-more" disabled>
                                    EXPLORE MORE
                                  </button>
                                )}
                                <button
                                  className="box-btn book-now text-uppercase"
                                  onClick={() => {
                                    setSelectedVenueTitle(slide.title);
                                    setShowModal(true);
                                  }}
                                >
                                  Enquire Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      <VenueEventEnquiryModal
        show={showModal}
        onClose={() => setShowModal(false)}
        hotelName={hotelName}
        cityId={cityId}
        propertyId={propertyId}
        venueTitle={selectedVenueTitle}
      />
    </>
  );
};

export default EventWedding;
