'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import VenueEventEnquiryModal from './EventVenueEnquiryModal';

const EventWedding = ({ propertyId, hotelName }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerData, setBannerData] = useState({ title: "", desc: "" });
  const [showModal, setShowModal] = useState(false);
      const [showFullText, setShowFullText] = useState(false);
      const [showFullText1, setShowFullText1] = useState(false);

  const [brandSlug, setBrandSlug] = useState("");
  const [propertySlug, setPropertySlug] = useState("");
  const [cityId, setCityId] = useState("");
  const [selectedVenueTitle, setSelectedVenueTitle] = useState(""); // NEW: store selected venue title

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
            const bg = entry.vanueBannerImages?.[0]?.venueImages || "/images/fallback-banner.jpg";

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
        //  else {
        //   console.error("API error:", json.errorMessage);
        // }
      } catch (error) {
        console.error("Failed to fetch venue data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch brandSlug, propertySlug, and cityId
    const fetchSlugs = async () => {
      try {
        const propertyRes = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/property/GetPropertyByFilter?PropertyId=${propertyId}`
        );
        const propertyJson = await propertyRes.json();

        if (propertyJson?.errorCode === "0" && Array.isArray(propertyJson.data) && propertyJson.data.length > 0) {
          const propertyDetails = propertyJson.data[0];
          setPropertySlug(propertyDetails.propertySlug || "");
          setCityId(propertyDetails.cityId || "");

          const brandRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/property/GetBrandList`);
          const brandJson = await brandRes.json();

          if (brandJson?.errorCode === "0" && Array.isArray(brandJson.data)) {
            const matchedBrand = brandJson.data.find(b => b.hotelBrandId === propertyDetails.hotelBrandId);
            if (matchedBrand) {
              setBrandSlug(matchedBrand.brandSlug || "");
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch slugs:", error);
      }
    };

    fetchVenue();
    fetchSlugs();
  }, [propertyId]);

  // if (loading) return <p className="text-center py-4">Loading...</p>;
  // if (!slides.length) return <p className="text-center py-4 d-none">No venue data found.</p>;

  return (
    <>


      


      <section data-aos="fade-up" className="mt-5">
        <div className="container-fluid">
          <div className="winter-sec">
            <div className="w-full">
              <div className="row justify-content-center">
                <div className='col-md-9'>
              {bannerData.title && (
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold">{bannerData.title || "Meetings & Events"}</h3>
                  {bannerData.desc && (
                    // <p className="max-w-3xl mx-auto text-gray-600">{bannerData.desc}</p>
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
              <Swiper navigation modules={[Navigation]} slidesPerView={1} className="overv-dine">
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
                                {/* {slide.description} */}
                                {slide?.description.length > 150 ? (
                              <>
                                {showFullText1
                                  ? slide?.description
                                  : slide?.description.slice(0, 150) + "..."}
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
                              slide?.description
                            )}
                              </span>
                              <div className="flex mt-3 gap-2">
                            {brandSlug && propertySlug ? (
                              <Link href={`/${brandSlug}/${propertySlug}/meeting-events`} className="box-btn know-more">
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
                                setSelectedVenueTitle(slide.title); // store clicked venue title
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







                    {/* <div
                      className="mt-4 relative bg-cover bg-center bg-no-repeat h-[400px] flex items-center justify-center"
                      style={{ backgroundImage: `url(${slide.bg})` }}
                    >
                      <div className="absolute inset-0 bg-black/50 z-0" />

                      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between">
                        <div className="w-full md:w-1/3">
                          <Image
                            src={slide.thumb}
                            alt={slide.title || "Venue Thumbnail"}
                            width={400}
                            height={300}
                            className="shadow-lg object-cover"
                          />
                        </div>

                        <div className="w-full md:w-2/3 p-3 md:p-10 bg-white bg-opacity-90 text-black">
                          <h4 className="text-2xl md:text-3xl font-serif mb-2 mt-4">{slide.title}</h4>
                          <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">{slide.description}</p>

                          <div className="flex mt-3 gap-2">
                            {brandSlug && propertySlug ? (
                              <Link href={`/${brandSlug}/${propertySlug}/meeting-events`} className="box-btn know-more">
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
                                setSelectedVenueTitle(slide.title); // store clicked venue title
                                setShowModal(true);
                              }}
                            >
                              Enquire Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div> */}
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
        venueTitle={selectedVenueTitle} // NEW: pass to modal
      />
    </>
  );
};

export default EventWedding;
