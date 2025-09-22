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

      {/* Tabs for categories */}
      <div className="container mb-4">
        <ul className="nav nav-tabs justify-content-center">
          {categories.map((cat) => (
            <li className="nav-item" key={cat.displayCategoryId}>
              <button
                className={`nav-link ${
                  selectedCategory === cat.displayCategoryId ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat.displayCategoryId)}
              >
                {cat.displayCategory}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Hotels slider */}
      <div className="container-fluid">
        {filteredHotels.length === 0 ? (
          <p className="text-center py-5">No hotels found in this category.</p>
        ) : (
          <Swiper
            loop={true}
            centeredSlides={true}
            slidesPerView={3}
            spaceBetween={20}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Navigation, Pagination, Autoplay]}
            className={styles.swiperContainer}
          >
            {filteredHotels.map((hotel, index) => {
              const imageUrl =
                hotel?.images[0]?.propertyImage ||
                "/no_img1.jpg";

              return (
                <SwiperSlide key={index}>
                  <div className="winter-box shadow hotel-box">
                   <div className="no-image-bg mb-3">
                    <Image
                      src={imageUrl || "/no_img1.jpg"}
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
                      className="text-decoration-none text-dark winter-box-heading ps-3 pt-3"
                    >
                      {hotel.propertyName}
                    </Link>

                    {/* Hotel Content */}
                    <div className="winter-box-content main-new-hotel-box">
                      {/* Left side buttons */}
                      <div className="hotel-box-content hotel-left-side-box">
                        <div className="winter-box-btn">
                          {!hotel.staahPropertyPrice ||
                          hotel.staahPropertyPrice === 0 ? (
                            <button
                              className="box-btn book-now"
                              onClick={() =>
                                handleBookNow(
                                  hotel.staahPropertyId,
                                  hotel.cityName,
                                  hotel.cityId
                                )
                              }
                            >
                              Book Now
                            </button>
                          ) : hotel.staahPropertyPrice === 297 ? (
                            <button className="box-btn book-now" disabled>
                              Not Available
                            </button>
                          ) : (
                            <button
                              className="box-btn book-now"
                              onClick={() =>
                                handleBookNow(
                                  hotel.staahPropertyId,
                                  hotel.cityName,
                                  hotel.cityId
                                )
                              }
                            >
                              Book Now
                            </button>
                          )}

                          <Link
                            href={`/${brandSlug}/${hotel.propertySlug}/hotel-overview`}
                            className="box-btn know-more"
                          >
                            Visit Hotel
                          </Link>
                        </div>
                      </div>

                      {/* Right side price */}
                      {!hotel.staahPropertyPrice ||
                      hotel.staahPropertyPrice === 0 ? (
                        <div className="hotel-box-content hotel-right-side-box">
                          <p className="font-semibold text-lg text-red-600 text-end sold-out-text mt-0 mb-0">
                            Sold Out
                            <span className="small-text-for-today">
                              (for today)
                            </span>
                          </p>
                        </div>
                      ) : hotel.staahPropertyPrice !== 297 ? (
                        <div className="hotel-box-content hotel-right-side-box">
                          <p className="text-xs text-gray-600 price-show f-new-10 text-end">
                            Starting from
                          </p>
                          <p className="font-semibold text-lg price-show">
                            INR {hotel.staahPropertyPrice}
                            <small className="f-new-10">/Night</small>
                          </p>
                        </div>
                      ) : null}
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
