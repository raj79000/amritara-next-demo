"use client";
import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

export default function LatestOffers({ onSubmit }) {
  const [offers, setOffers] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openOfferId, setOpenOfferId] = useState(null); // track expanded offer

  // Fetch offers
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/offers/GetCorporateOffers`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.errorCode === "0" && Array.isArray(data.data)) {
          setOffers(data.data);
        }
      });
  }, []);

  const handleBookNow = (property) => {
    onSubmit(property);
  };

  const handleKnowMore = (offer) => {
    setModalContent({
      title: offer.offerTitle || offer.offerName,
      description: offer.offerDesc || "No description available.",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleToggleHotels = (offerId) => {
    setOpenOfferId((prev) => (prev === offerId ? null : offerId));
  };

  useEffect(() => {
    if (!openOfferId) return;

    const handleClickOutside = (event) => {
      const expandedBox = document.querySelector(
        `.hotel-box .offers-hotel-hotel-list`
      );
      if (expandedBox && !expandedBox.contains(event.target)) {
        setOpenOfferId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openOfferId]);

  return (
    <>
      <div>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={true}
          pagination={false}
          breakpoints={{
            500: { slidesPerView: 1 },
            767: { slidesPerView: 2 },
            1000: { slidesPerView: 3 },
          }}
          className="n-hotel-slider offer-section-overview-page"
        >
          {offers.map((offer, index) => {
            const imageUrl =
              offer.offersImages?.[0]?.offerImages ||
              "/images/event/event-img1.png";

            return (
              <SwiperSlide key={offer.propertyOfferId || index}>
                <div className="winter-box shadow hotel-box mt-2 no-image-bg">
                  <Image
                    src={imageUrl}
                    alt={offer.offerTitle || "Offer"}
                    className="w-100 primary-radius"
                    width={264}
                    height={220}
                    quality={75}
                  />
                </div>
                <div className="winter-box-content-box">
                  <div className="winter-box-content">
                    <div className="hotel-box-content">
                      <h3 className="winter-box-heading mb-2 offer-box-heding no-cursor">
                        {offer.offerTitle || offer.offerName}
                      </h3>
                    </div>
                    <p className="display-block one-line-text">
                      <span>
                        {offer.offerDesc?.slice(0, 100) ||
                          "No description available."}
                      </span>
                    </p>
                    <div className="winter-box-btn">
                      <button
                        className="box-btn know-more"
                        onClick={() => handleKnowMore(offer)}
                      >
                        Know More
                      </button>
                      <button
                        className="box-btn book-now"
                        onClick={() =>
                          handleToggleHotels(offer.propertyOfferId)
                        }
                      >
                        Book Now
                      </button>

                      {openOfferId === offer.propertyOfferId && (
                        <div className="offers-hotel-hotel-list mt-3">
                          {offer.propertyData?.length > 0 ? (
                            <ul className="list-unstyled mb-0">
                              {offer.propertyData.map((hotel) => (
                                <li key={hotel.propertyId} className="mb-2">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleBookNow(hotel);
                                    }}
                                  >
                                    <small>
                                      {hotel.propertyName}, {hotel.cityName}
                                    </small>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No hotels available for this offer.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Modal */}
        {isModalOpen &&
          ReactDOM.createPortal(
            <div
              className="modal fade show new-type-popup"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
              tabIndex="-1"
              aria-labelledby="offerModalLabel"
              aria-hidden="false"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body">
                    <h6 className="modal-title" id="offerModalLabel">
                      {modalContent.title}
                    </h6>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleCloseModal}
                      aria-label="Close"
                    >
                      x
                    </button>
                    <p>{modalContent.description}</p>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>

      <style jsx>
        {`
          .new-type-popup {
            backdrop-filter: blur(10px);
          }
          .new-type-popup .btn-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #000;
            height: 30px;
            width: 30px;
            position: absolute;
            top: 0px;
            right: 10px;
            cursor: pointer;
          }
            .new-type-popup .modal-body p{
            padding-left :1rem;
            padding-right :1rem;
          }
            .new-type-popup .modal-body{
            padding-bottom :1rem;
          }
          
          
        `}
      </style>
    </>
  );
}
