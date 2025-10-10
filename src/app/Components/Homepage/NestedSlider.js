"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./nested-slider.css";
import Link from "next/link";

export default function NestedSwiper() {
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [parentSwiper, setParentSwiper] = useState(null);
  const parentPrevRef = useRef(null);
  const parentNextRef = useRef(null);

  useEffect(() => {
    if (parentSwiper) {
      parentSwiper.params.navigation.prevEl = parentPrevRef.current;
      parentSwiper.params.navigation.nextEl = parentNextRef.current;
      parentSwiper.navigation.init();
      parentSwiper.navigation.update();
    }
  }, [parentSwiper]);

  // Fetch categories + properties
  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, propRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetDisplayCategoryList`
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`
          ),
        ]);

        const catData = await catRes.json();
        const propData = await propRes.json();

        if (catData.errorCode === "0") {
          setCategories(catData.data);
        }
        if (propData.errorCode === "0") {
          setProperties(propData.data);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  const getOverviewSlug = (p) => {
    const t = (p?.propertyType ?? "").toString().toLowerCase();

    // if your API sends names:
    if (t.includes("resort")) return "resort-overview";
    if (t.includes("hotel")) return "hotel-overview";
    return "property-overview"; // safe fallback
  };

  return (
    <div className="main-nested-slider mx-auto our-collection-section section-padding">
      <div className="container">
        <h3 className="main-section-title global-heading">Our Collection</h3>
        <div className="parent-control-button p-prev-button">
          <button
            ref={parentPrevRef}
            className="p-3 bg-gray-800 text-white rounded-full shadow-lg"
          >
            ❮
          </button>
        </div>
        <div className="parent-control-button p-next-button">
          <button
            ref={parentNextRef}
            className="p-3 bg-gray-800 text-white rounded-full shadow-lg"
          >
            ❯
          </button>
        </div>

        {/* Parent Swiper for Categories */}
        <Swiper
          pagination={{ clickable: true }}
          loop={true}
          modules={[Navigation]}
          onSwiper={setParentSwiper}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={false}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 1.3 },
            1024: { slidesPerView: 1.3 },
          }}
          className="parent-swiper main-parent-slider main-parent-slider-experience"
        >
          {categories.map((category, index) => {
            // Filter properties belonging to this category
            const categoryProperties = properties.filter(
              (prop) => prop.displayCategoryId === category.displayCategoryId
            );

            return (
              <SwiperSlide
                key={category.displayCategoryId}
                className="bg-gray-100 rounded-xl relative"
              >
                <h3 className="text-2xl font-bold mb-3 experience-category-title">
                  {category.displayCategory}
                </h3>

                {/* Child Swiper for Properties */}
                <Swiper
                  pagination={{ clickable: true }}
                  navigation={true}
                  loop={true}
                  modules={[Navigation]}
                  spaceBetween={10}
                  slidesPerView={1}
                  className="child-swiper main-child-slider"
                >
                  {categoryProperties.length > 0 ? (
                    categoryProperties.map((hotel) => (
                      <SwiperSlide key={hotel.propertyId} className="child-slider-rel">
                        <div className="nested-no-image">
                          <Image
                            height={600}
                            width={600}
                            src={hotel.images?.[0]?.propertyImage || "/img/popular-1.jpeg"}
                            alt={hotel.propertyName || hotel.propertyTitle || "Property"}
                            className="w-full h-36 object-cover rounded-md mb-2 child-image w-100"
                          />
                        </div>

                        <div className="child-slider-content">
                          <div className="child-slider-content-btm">
                            <div className="child-slider-content-btm-left">
                              <h3 className="child-sl-title">{hotel.propertyName}</h3>
                              <div className="next-boxx-parent-div">
                                <div className="left-nested-boxx">
                                  <button className="child-sl-btn mt-2">Book Now</button>

                                  <Link href={{
                                    pathname: `/${hotel.propertySlug}/${getOverviewSlug(hotel)}`,
                                    // query: { id: hotel.propertyId, name: hotel.propertyName },
                                  }} className="visit-hotel-nested">
                                    Visit Hotel
                                  </Link>
                                </div>
                                <div className="right-nested-box">
                                  <div className="child-slider-content-btm-right-left">
                                    <p className="child-sl-price">
                                      <b>Starting From</b>
                                    </p>
                                    <p className="child-sl-price">
                                      INR {hotel.staahPropertyPrice ?? "—"}/Night
                                    </p>

                                  </div>
                                </div>
                              </div>

                            </div>


                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide className="no-data-found-slider flex items-center justify-center h-40 bg-gray-200 text-gray-700 rounded-md ">
                      No Properties found for this category
                    </SwiperSlide>
                  )}
                </Swiper>

              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
