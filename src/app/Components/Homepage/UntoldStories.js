"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import styles from "./untold.module.css";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

const UntoldStories = () => {
  const [categories, setCategories] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const brandSlug = "amritara"; // adjust if dynamic

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "http://loyaltypulsedemo.ownyourcustomers.in/cmsapi/property/GetDisplayCategoryList"
      );
      const data = await res.json();
      setCategories(data?.data || []);
      if (data?.data?.length > 0) {
        setSelectedCategory(data.data[0].displayCategoryId);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch hotels
  const fetchHotels = async () => {
    try {
      const res = await fetch(
        "http://loyaltypulsedemo.ownyourcustomers.in/cmsapi/property/GetPropertyList"
      );
      const data = await res.json();
      setHotels(data?.data || []);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchHotels();
  }, []);

  if (loading) {
    return <p className="text-center py-5">Loading hotels...</p>;
  }

  // Filter hotels by selected category
  const filteredHotels = hotels.filter(
    (hotel) =>
      selectedCategory === null || hotel.displayCategoryId === selectedCategory
  );

  const handleBookNow = (staahPropertyId, cityName, cityId) => {
    console.log("Booking hotel:", staahPropertyId, cityName, cityId);
    // integrate your booking flow here
  };

  return (
    <section className={`${styles.UntoldStoriesSec} global-padding bg-lred`}>
      <Image
        src={"/img/story-bg.png"}
        alt="Untold Stories Background"
        className={styles.bgStoryImage}
        width={1920}
        height={1080}
      />
      <h3 className="main-section-title global-heading">Untold Stories</h3>

      {/* Category slider instead of tabs */}
      <div className="container mb-4 position-relative custom-tabs-for-experience">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={3}
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
            <SwiperSlide key={cat.displayCategoryId} style={{ width: "auto" }}>
              <button
                className={`category-btn ${
                  selectedCategory === cat.displayCategoryId ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat.displayCategoryId)}
              >
                {cat.displayCategory}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom navigation arrows */}
        <div className="custom-nav-wrapper">
          <button className="custom-prev">
            <ArrowLeftCircle></ArrowLeftCircle>
          </button>
          <button className="custom-next">
           <ArrowRightCircle></ArrowRightCircle>
          </button>
        </div>

      </div>

      {/* Hotels slider */}
      <div className="container-fluid">
        {filteredHotels.length === 0 ? (
          <p className="text-center py-5">No hotels found in this category.</p>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              margin={2}
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
            {filteredHotels.map((hotel, index) => {
              const imageUrl = hotel?.images[0]?.propertyImage || "/no_img1.jpg";

              return (
                <SwiperSlide key={index}>
                  <div className="winter-box shadow hotel-box">
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

                    {/* Hotel Title */}
                    <Link
                      href={`/${hotel.propertySlug}/hotel-overview`}
                      className="text-decoration-none text-dark winter-box-heading"
                    >
                      <h6 className="ps-3 pb-2">{hotel.propertyName}</h6>
                    </Link>
                    <div className="winter-box-content main-new-hotel-box">
                      <div className="hotel-box-content hotel-left-side-box">
                        <div className="winter-box-btn">
                            <button className="box-btn book-now"
                              onClick={() => handleBookNow(
                                  hotel.staahPropertyId,
                                  hotel.cityName,
                                  hotel.cityId
                                )}> Book Now
                            </button>

                          <Link href={`/${hotel.propertySlug}/hotel-overview`} className="box-btn know-more">
                            Visit Hotel
                          </Link>
                        </div>
                      </div>

                      {/* Right side price */}
                    
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
  );
};

export default UntoldStories;
