'use client';
import React, { useEffect, useState } from 'react';
import * as ReactDOM from "react-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

export default function LatestOffers() {
  const [offers, setOffers] = useState([]);
  const [brands, setBrands] = useState({}); // Map hotelBrandId -> brandSlug
  const [modalContent, setModalContent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const [cityDetails, setCityDetails] = useState(null);

  const [openOfferId, setOpenOfferId] = useState(null); // NEW: track expanded offer

  // Fetch brands
  useEffect(() => {
    fetch('https://clarkscms.cinuniverse.com/Api/property/GetBrandList')
      .then(res => res.json())
      .then(data => {
        if (data?.errorCode === "0" && Array.isArray(data.data)) {
          const brandMap = {};
          data.data.forEach(brand => {
            brandMap[brand.hotelBrandId] = brand.brandSlug;
          });
          setBrands(brandMap);
        }
      });
  }, []);

  useEffect(() => {
    fetch('https://clarkscms.cinuniverse.com/Api/offers/GetCorporateOffers')
      .then(res => res.json())
      .then(data => {
        if (data?.errorCode === "0" && Array.isArray(data.data)) {
          setOffers(data.data);
        }
      });
  }, []);

  // Handle opening the modal and setting its content
  const handleKnowMore = (offer) => {
    setModalContent({
      title: offer.offerTitle || offer.offerName,
      description: offer.offerDesc || "No description available.",
    });
    setIsModalOpen(true);  // Open the modal by setting the state to true
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);  // Close the modal by setting the state to false
  };

  const handleBookNow = (propertyId, cityName, cityId) => {
    const label = cityName;
    const value = cityId;
    const property_Id = propertyId;
    setCityDetails({ label, value, property_Id });
    setShowFilterBar(true);
    setPropertyId(propertyId);
  };

 const handleToggleHotels = (offerId) => {
     setOpenOfferId(prev => prev === offerId ? null : offerId);
   };
 
   // Hide the hotel list when clicking outside the expanded offer box
   useEffect(() => {
     if (!openOfferId) return;
 
     const handleClickOutside = (event) => {
       // Find the expanded offer box
       const expandedBox = document.querySelector(
         `.hotel-box .offers-hotel-hotel-list`
       );
       if (expandedBox && !expandedBox.contains(event.target)) {
         setOpenOfferId(null);
       }
     };
 
     document.addEventListener('mousedown', handleClickOutside);
     return () => {
       document.removeEventListener('mousedown', handleClickOutside);
     };
   }, [openOfferId]);

  return (
    <>
    <div className="position-absolute bottom-0 start-0 w-100 bg-white shadow">
        {showFilterBar && (
          <BookingEngineProvider>
            <FilterBar
              selectedProperty={parseInt(propertyId)}
              cityDetails={cityDetails}
            />
          </BookingEngineProvider>
        )}
      </div>
      <div>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={true}
          pagination={false}
          breakpoints={{
            600: { slidesPerView: 1 },
            1000: { slidesPerView: 3 },
          }}
          className="n-hotel-slider home-oofer-sectionn"
        >
          {offers.map((offer, index) => {
            const imageUrl =
              offer.offersImages?.[0]?.offerImages || "/images/event/event-img1.png";

            // Extract first property details
            const firstProperty = offer.propertyData?.[0];
            const brandSlug = brands[firstProperty?.hotelBrandId] || 'brand';
            const propertySlug = firstProperty?.propertySlug || 'property';

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
                  <div className="winter-box-content">
                    <div className="hotel-box-content">
                      <h3 className="winter-box-heading mb-2 offer-box-heding">
                        {offer.offerTitle || offer.offerName}
                      </h3>
                    </div>
                    <p className="display-block one-line-text">
                      <span>{offer.offerDesc.slice(0, 100) || "No description available."}</span>
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
                      onClick={() => handleToggleHotels(offer.propertyOfferId)}
                    >
                      Book Now
                    </button>

                     {openOfferId === offer.propertyOfferId && (
                    <div className="offers-hotel-hotel-list mt-3">
                      {offer.propertyData?.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {offer.propertyData.map((hotel) => (
                            <li key={hotel.propertyId} className="mb-2">
                              <small>{hotel.propertyName}, {hotel.cityName}</small>
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
            <div className="modal fade show new-type-popup" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" aria-labelledby="offerModalLabel" aria-hidden="false">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                 
                  <div className="modal-body">
                    <h6 className="modal-title" id="offerModalLabel">{modalContent.title}</h6>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleCloseModal}
                      aria-label="Close"
                    >x</button>
                    <p>{modalContent.description}</p>
                  </div>
                 
                </div>
              </div>
            </div>,
            document.body
          )
        }
      </div>
      <style jsx>
        {`
          .new-type-popup {
            backdrop-filter: blur(10px);
          }
          .new-type-popup.btn-close {
            background: 000;
            border: none;
            color: white;
            font-size: 1.5rem;
            color:#fff;
            height: 30px;
            width: 30px;
            border-radius: 0%;
            position: absolute;
            top: 10px!important;
            opacity:1;
            right: 10px!important;
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
}
