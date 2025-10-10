"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";


export default function AccommodationSliderNew({
  propertyId,
  setShowModal,
  setSelectedRoom,
  onSubmit,
}) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerData, setBannerData] = useState({});
  const [showFullText, setShowFullText] = useState(false);

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

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

  const handleViewRates = (room) => {
    onSubmit(room);
  };

  return (
    <section className="mt-3" data-aos="fade-up">
      <div className="global-heading-sec text-center">
        <div className="container">
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

      <div className="property-inner-zigzag-section">
          <div className="container pushed-wrapper">
            {rooms.map((room, idx) => (
              <div className="row align-items-center position-relative mb-4" key={idx}>
                {/* <div
                  className="pushed-image col-md-6"
                  style={{
                    backgroundImage: `url(${room.roomImages?.[0]?.roomImage || "/amritara-dummy-room.jpeg"
                      })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "250px",
                    backgroundColor: '#f0f0f0',
                  }}
                ></div> */}
                <div
                  className="pushed-image col-md-6"
                  style={{
                    backgroundImage: `url("${encodeURI(
                      room.roomImages?.[0]?.roomImage || "/amritara-dummy-room.jpeg"
                    )}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "250px",
                    backgroundColor: "#f0f0f0",
                  }}
                ></div>

                <div className="pushed-box col-md-6">
                  <div className="pushed-header">
                    <span className="header-1">{room.roomName}</span>
                    <span className="header-3 d-inline-block mt-2">
                      {stripHtml(room.roomDesc).length > 150 ? (
                        <>
                          {room.showFullText
                            ? stripHtml(room.roomDesc)
                            : stripHtml(room.roomDesc).slice(0, 150) + "..."}
                          <span
                            onClick={() => {
                              const newRooms = [...rooms];
                              newRooms[idx].showFullText = !newRooms[idx].showFullText;
                              setRooms(newRooms);
                            }}
                            style={{
                              cursor: "pointer",
                              color: "#000",
                              fontWeight: "600",
                              display: "inline-block",
                            }}
                          >
                            {room.showFullText ? " ❮❮" : " ❯❯"}
                          </span>
                        </>
                      ) : (
                        stripHtml(room.roomDesc)
                      )}
                    </span>

                    <div className="flex mt-3 gap-2">
                      <button
                        className="box-btn book-now"
                        onClick={() => {
                          setSelectedRoom(room);
                          setShowModal(true);
                        }}
                      >
                       View more
                      </button>
                      <button
                        className="box-btn book-now"
                        onClick={() => handleViewRates(room)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}
