import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import BookTableModal from "./BookTableModal";

const DiningSlider = ({ propertyId, hotelName }) => {
  const API_URL = `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyDineBanner?propertyId=${propertyId}`;

  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerData, setBannerData] = useState({ title: "", desc: "" });
  const [brandSlug, setBrandSlug] = useState("");
  const [propertySlug, setPropertySlug] = useState("");
    const [showFullText, setShowFullText] = useState(false);
    const [showFullText1, setShowFullText1] = useState(false);
  const [showModal, setShowModal] = useState(false);



  // Fetch propertySlug
  useEffect(() => {
    const fetchPropertySlug = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyByFilter?PropertyId=${propertyId}`
        );
        const json = await res.json();
        if (json.errorCode === "0" && json.data.length > 0) {
          setPropertySlug(json.data[0].propertySlug);
        }
      } catch (error) {
        console.error("Error fetching property slug:", error);
      }
    };

    if (propertyId) {
      fetchPropertySlug();
    }
  }, [propertyId]);

  // Fetch Dining Data
  useEffect(() => {
    const fetchDining = async () => {
      try {
        const response = await fetch(API_URL);
        const json = await response.json();

        if (json?.errorCode === "0") {
          const dineItems = [];

          json.data.forEach((entry) => {
            const bg = entry.bannerImages?.[0]?.bannerImage || "/images/img-5.jpg";

            entry.dineDetails?.forEach((dine) => {
              const dineImageUrl = dine.dineImages?.[0]?.dineImage || "/images/img-5.jpg";
              console.log("Dine Image URL:", dineImageUrl);

              dineItems.push({
          bg,
          thumb: dineImageUrl,
          title: dine.dineTitle,
          description: dine.dineDesc,
          timing: `${dine.openingHours} - ${dine.closingHours}`,
              });
            });
          });

          setSlides(dineItems);

          setBannerData({
            title: json.data[0]?.dineBannerTitle || "",
            desc: json.data[0]?.dineBannerDesc || "",
          });
        } 
        // else {
        //   console.error("API error:", json.errorMessage);
        // }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDining();
  }, [propertyId]);

// if (loading) return <p>Loading...</p>;
// if (!slides.length) return null;

const stripHtml = (html) => html.replace(/<[^>]+>/g, "");

  return (
    <>
      <section data-aos="fade-up" className="bg-lred">
          <div className="container-fluid">
            <div className="row justify-content-center mb-4">
              <div className="col-md-9">
                <div className="global-heading-sec text-center">
                <h2 className="global-heading pt-4">{bannerData.title || "Dining"}</h2>
                {bannerData.desc && (
                      // <p className="mb-2">{bannerData.desc}</p>
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
            </div>
            <div className="winter-sec">
            
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
                              style={{ backgroundImage: `url(${slide.thumb})`, backgroundColor: '#f0f0f0' }}
                            ></div>
                            <div className="pushed-box">
                              <div className="pushed-header">
                                <span className="header-1"> {slide.title}</span>
                                <span className="header-3 d-inline-block">
                                  {/* {slide.description} */}
                                  {stripHtml(slide?.description).length > 150 ? (
                              <>
                                {showFullText1
                                  ? stripHtml(slide?.description)
                                  : stripHtml(slide?.description).slice(0, 150) + "..."}
                                <span
                                  onClick={() => setShowFullText1(!showFullText1)}
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
                              stripHtml(slide?.description)
                            )}
                                </span>
                                {slide.timing && slide.timing.trim() && (
                                  <span className="header-3 mt-2">
                                    <strong>Timings:</strong> {slide.timing}
                                  </span>
                                )}

                                <div className="flex mt-3 gap-2">
                                  {brandSlug && propertySlug && (
                                    <Link
                                      href={`/${brandSlug}/${propertySlug}/restaurants`}
                                      className="box-btn know-more"
                                    >
                                      EXPLORE MORE
                                    </Link>
                                  )}
                                  <button
                                    className="box-btn book-now"
                                    onClick={() => setShowModal(true)}
                                  >
                                    BOOK A TABLE
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
      <BookTableModal
        show={showModal}
        onClose={() => setShowModal(false)}
        hotelName={hotelName}
      />
    </>
  );
};

export default DiningSlider;
