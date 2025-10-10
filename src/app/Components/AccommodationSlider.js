"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";

export default function AccommodationSlider({
  propertyId,
  setShowModal,
  setSelectedRoom,
  onSubmit,
}) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerData, setBannerData] = useState({});
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [showFilterBar, setShowFilterBar] = useState(false);
  const [cityDetails, setCityDetails] = useState(null);
  const [isOpenFilterBar, openFilterBar] = useState(false);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/rooms/GetRoomsByProperty?propertyId=${propertyId}`
        );
        const json = await res.json();

        if (
          json?.errorCode === "0" &&
          Array.isArray(json.data) &&
          json.data.length > 0
        ) {
          const banner = json.data[0];
          setBannerData({
            title: banner?.roomBannerTitle || "",
            desc: banner?.roomBannerDesc || "",
          });

          const allRooms = json.data
            .flatMap((item) =>
              Array.isArray(item.roomsInfo) ? item.roomsInfo : []
            )
            .filter((room) => String(room.enabled).toLowerCase() === "e");

          setRooms(allRooms);
        } else {
          console.warn("No data found in API");
          setRooms([]);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) fetchRooms();
  }, [propertyId]);

  if (loading) return <p className="text-center py-4">Loading rooms...</p>;
  if (!rooms.length)
    return <p className="text-center py-4">No rooms available.</p>;

  function handleViewRates(room) {
    // setShowFilterBar(room);
    // setCityDetails(room);
    // openFilterBar(true);
    onSubmit(room);
  }
  return (
    <section className="mt-3" data-aos="fade-up">
      <div className="global-heading-sec text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-9">
              <h2 className="global-heading pt-4">{bannerData.title}</h2>
              {/* <p className="mb-2 whitespace-pre-line">
                  {bannerData?.desc?.length > 150 ? (
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
                  
                </p> */}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="position-absolute bottom-0 start-0 w-100 bg-white shadow">
        
        {showFilterBar && (
          <BookingEngineProvider>
            <FilterBar
              selectedProperty={parseInt(propertyId)}
              cityDetails={cityDetails}
            />
          </BookingEngineProvider>
        )}
      </div> */}
      <div className="container-fluid">
        <div className="winter-sec property-room-page-sec">
          <div className="relative px-4 md:px-16 py-12 overflow-hidden roombtn">
            

            <Swiper
              modules={[Navigation]}
              spaceBetween={10}
              slidesPerView={2}
              loop={true}
              pagination={false}
              navigation={true}
              
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2 },
              }}
              className="relative"
            >
              {rooms.length > 0 && rooms.map((room, index) => (
                <SwiperSlide key={index} className="cityexpr1">
                  <div className="winter-box hotel-box room-image-on-room">
                    {/* Image Swiper for room images */}
                    <Swiper
                      modules={[Pagination, Autoplay]}
                      autoplay={{ delay: 5000, disableOnInteraction: false }}
                      pagination={{ clickable: true }}
                      className="room-image-swiper mb-3"
                    >
                      {(room.roomImages && room.roomImages.length > 0
                        ? room.roomImages
                        : [{ roomImage: "/amritara-dummy-room.jpeg" }]
                      ).map((img, imgIdx) => (
                        <SwiperSlide key={imgIdx}>
                          <div className="no-image-box">
                             <Image
                            // src="/amritara-dummy-room.jpeg"
                            src={img.roomImage || "/amritara-dummy-room.jpeg"}
                            alt={room.roomName}
                            width={600}
                            height={500}
                            quality={100}
                            className="w-100 object-cover"
                          />
                          </div>
                         
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div className="accommodation-box-content">
                      <div className="hotel-box-content mt-0">
                        <h3 className="winter-box-heading mt-2">{room.roomName}</h3>
                        <p className="winter-box-text text-with-rd-mr text-style-none">
                          {(room.roomDesc || "").replace(/<[^>]+>/g, "").slice(0, 80)}...
                          <button
                            className="read-more-btnn text-style-none "
                            onClick={() => {
                              setSelectedRoom(room);
                              setShowModal(true);
                            }}
                          >
                             read more
                          </button>
                        </p>
                        {/* Example price field if available */}
                        {/* <p className="f-20-new acc-price mt-4">
                          ₹ {room.price || "N/A"}{" "}
                          <span className="f-12-new inr-text mt-0">
                            INR/Night
                          </span>
                        </p> */}
                        <div className="d-flex gap-3 mt-3">
                          <button
                            className="box-btn know-more"
                            onClick={() => {
                              setSelectedRoom(room);
                              setShowModal(true);
                            }}
                          >
                           View more
                          </button>
                          <Link
                            href="#"
                            className="box-btn book-now button-secondary"
                            onClick={(e) => {
                              e.preventDefault(); // prevent navigating to "#"
                              handleViewRates(room); // call your function
                            }}
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Optional shadows */}
            {/* <div className="pointer-events-none absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-white to-transparent z-10" /> */}
            {/* <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10" /> */}
          </div>
        </div>
      </div>
    </section>
  );
}
