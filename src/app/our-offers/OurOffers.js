"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import * as ReactDOM from "react-dom";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";

import offstyle from "../Components/Homepage/offers.module.css";
import { useEffect, useState } from "react";

const OurOffers = () => {

  const ImageHeight = {
    height: '300px',
    width: '100%',
    objectFit: 'cover'
  };

  const [offers, setOffers] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openOfferId, setOpenOfferId] = useState(null); // NEW: track expanded offer

  const handleKnowMore = (offer) => {
    setModalContent({
      title: offer.offerTitle || offer.offerName,
      description: offer.offerDesc || "No description available.",
    });
    setIsModalOpen(true); // Open the modal by setting the state to true
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal by setting the state to false
  };


  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/offers/GetCorporateOffers`);
        const result = await response.json();
        if (result.errorCode === "0" && Array.isArray(result.data)) {
          setOffers(result.data);
        } else {
          setOffers([]);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);
  return (
    <>
        <div className={offstyle.mainhotelbox}>
          <Swiper
            modules={[Navigation]}
            navigation
            loop={true}
            spaceBetween={10}
            slidesPerView={1}
            breakpoints={{
              500: { slidesPerView: 1 },
              767: { slidesPerView: 2 },
              991: { slidesPerView: 3 },
              1200: { slidesPerView: 3 },
            }}
            className="mt-4"
          >
            {offers.map((offer) => (
              <SwiperSlide key={offer.propertyOfferId} className="global-slider-arrow">
                <div className={`${offstyle.offerbox} shadow-none p-0 rounded-0`}>
                  <Image
                    src={offer.offersImages?.[0]?.offerImages || ""}
                    alt={offer.offerTitle}
                    height={300}
                    width={500}
                    className={`${offstyle.offerboximg} w-100 rounded-0`}
                    style={ImageHeight}
                  />
                  <div className={`${offstyle.offerboxcontent} p-0 mt-3`}>
                    <h3 className={offstyle.offerboxcontentheading}>{offer.offerTitle}</h3>
                    <div className={`$(offstyle.offerboxcontentpara) two-line-text`}>
                      <span>{offer.offerDesc}</span>
                    </div>
                    <div className={`${offstyle.offerboxcontentbtn} mt-3`}>
                      <button className={`${offstyle.offerknowmore} explore-more-btn`}
                      onClick={() => handleKnowMore(offer)}>
                        Know More
                      </button>
                      {/* Replace with actual booking URL if available */}
                      <Link href="#" className={`${offstyle.offerkbooknow} book-now-btn`}>
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

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
                    className="btn-close modal-close-btn-in-body"
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
      <style jsx>
        {`
          .new-type-popup {
            backdrop-filter: blur(10px);
          }
          .new-type-popup .btn-close {
            background: #000!important;
            border: none;
            color: white;
            font-size: 1rem;
            line-height:1rem;
            color: #fff;
            height: 30px;
            width: 30px;
            border-radius: 0%;
            position: absolute;
            top: 10px !important;
            opacity: 1;
            right: 10px !important;
            cursor: pointer;
          }
        `}
      </style>
      
    </>
  );
};

export default OurOffers;
