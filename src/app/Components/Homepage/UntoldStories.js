"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import styles from "./untold.module.css";

const UntoldStories = () => {
  const [categories, setCategories] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetSeasonalCategoryList`
      );
      const data = await res.json();
      setCategories(data?.data || []);
      if (data?.data?.length > 0) {
        setSelectedCategory(data.data[0].seasonalCategoryId);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ✅ Fetch hotels based on category
  const fetchHotelsByCategory = async (categoryId) => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyByFilter?SeasonalCategoryId=${categoryId}`
      );
      const data = await res.json();
      if (data?.errorMessage === "success") {
        setHotels(data?.data || []);
      } else {
        setHotels([]);
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setHotels([]);
    } finally {
      setTimeout(() => setLoading(false), 300); // small delay for smoother feel
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchHotelsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleCategoryClick = (id) => {
    startTransition(() => {
      setSelectedCategory(id);
    });
  };

  const handleBookNow = (staahPropertyId, cityName, cityId) => {
    console.log("Booking hotel:", staahPropertyId, cityName, cityId); }

    const getOverviewSlug = (p) => {
      const t = (p?.propertyType ?? "").toString().toLowerCase();
      if (t.includes("resort")) return "resort-overview";
      if (t.includes("hotel")) return "hotel-overview";
      return "property-overview";
    };

    return (
      <>
        <section className={`${styles.UntoldStoriesSec} global-padding bg-lred`}>
          <Image
            src={"/img/story-bg.png"}
            alt="Untold Stories Background"
            className={styles.bgStoryImage}
            width={1920}
            height={1080}
          />
          <h3 className="main-section-title global-heading">Untold Stories</h3>

          {/* ✅ Category Slider */}
          <div className="container mb-4 position-relative custom-tabs-for-experience">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={5}
              freeMode={true}
              slidesPerView={"auto"}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              pagination={false}
              className="category-swiper experience-category-slider-tabs"
            >
              {categories.map((cat) => (
                <SwiperSlide key={cat.seasonalCategoryId} style={{ width: "auto" }} className="py-1">
                  <button
                    className={`category-btn ${selectedCategory === cat.seasonalCategoryId ? "active" : ""
                      }`}
                    onClick={() => handleCategoryClick(cat.seasonalCategoryId)}
                  >
                    {cat.seasonalCategory}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Arrows */}
            <div className="custom-nav-wrapper">
              <button className="custom-prev">
                <ArrowLeftCircle />
              </button>
              <button className="custom-next">
                <ArrowRightCircle />
              </button>
            </div>
          </div>

          {/* ✅ Hotels Section */}
          <div
            className={`container-fluid p-sm-0 padding-mob-0 ${isPending ? "fade-out" : "fade-in"
              }`}
          >
            {loading ? (
              <div className="col-md-4 gap-6 px-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className=" bg-white shadow rounded-2xl p-3 bg-light"
                  >
                    <div className="skeleton w-full h-48 rounded-lg mb-4 bg-light"></div>
                    <div className="skeleton h-4 rounded w-3/4 mb-3 bg-light" style={{minHeight:"30px"}}></div>
                    <div className="skeleton h-3 rounded w-1/2 mb-4 bg-light" style={{minHeight:"30px"}}></div>
                    <div className="flex justify-between items-center mt-3 bg-light">
                      <div className="skeleton h-6 w-24 rounded bg-light" style={{minHeight:"20px"}}></div>
                      <div className="skeleton h-6 w-20 rounded bg-light" style={{minHeight:"20px"}}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : hotels.length === 0 ? (
              <p className="text-center py-5">No hotels found in this category.</p>
            ) : (
              <Swiper
                key={selectedCategory}
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                navigation={true}
                pagination={false}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1180: { slidesPerView: 3 },
                }}
                className={styles.swiperContainer}
              >
                {hotels.map((hotel, index) => {
                  const imageUrl =
                    hotel?.images?.[0]?.propertyImage || "/no_img1.jpg";
                  return (
                    <SwiperSlide key={index}>
                      <div className="winter-box shadow hotel-box untold-stories-hotel-image fade-in">
                        <div className="no-image-bg mb-3">
                          <Image
                            src={imageUrl}
                            alt={hotel.propertyName || "image"}
                            className="w-100 primary-radius"
                            width={500}
                            height={300}
                            quality={100}
                          />
                        </div>

                        <Link
                          href={`/${hotel.propertySlug}/${getOverviewSlug(hotel)}`}
                          className="text-decoration-none text-dark winter-box-heading"
                        >
                          <h6 className="ps-3 pb-2">{hotel.propertyName}</h6>
                        </Link>

                        <div className="winter-box-content main-new-hotel-box">
                          <div className="hotel-box-content hotel-left-side-box">
                            <div className="winter-box-btn">
                              <button className="box-btn book-now" onClick={() => handleBookNow(hotel.staahPropertyId, hotel.cityName, hotel.cityId)} > Book Now </button>
                              <Link
                                href={`/${hotel.propertySlug}/${getOverviewSlug(
                                  hotel
                                )}`}
                                className="box-btn know-more"
                              >
                                Visit Hotel
                              </Link>
                            </div>
                          </div>

                          <div className="hotel-box-content hotel-right-side-box">
                            <p className="text-xs text-gray-600 price-show f-new-10 text-end">
                              Starting from
                            </p>
                            <p className="font-semibold text-lg price-show">
                              INR {hotel.staahPropertyPrice}
                              <small className="f-new-10">/Night</small>
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>

        </section>

      </>
    );
  };

  export default UntoldStories;
