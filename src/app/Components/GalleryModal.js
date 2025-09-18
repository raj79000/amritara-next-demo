'use client';
import * as ReactDOM from "react-dom";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "../Styles/modal.css";
import { Diamond } from "lucide-react";

export default function GalleryModal({ showModal, setShowModal, roomData }) {
  if (!showModal || !roomData) return null;

  const { roomName, roomDesc, roomImages, roomServices } = roomData;

  return ReactDOM.createPortal(
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      tabIndex="-1"
    >
      {/* <div className="modal-dialog modal-lg room-modal modal-dialog-scrollable"> */}
      <div className="modal-dialog modal-lg room-modal">
        <div className="modal-content">
          <div className="modal-body p-0 position-relative">
            <h5 className="modal-title p-3">{roomName}</h5>
            
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            >X</button>

            {/* Swiper for room images */}
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              loop={true}
              className="images-slider"
            >
              {roomImages?.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img.roomImage}
                    alt={`Room Image ${idx + 1}`}
                    className="img-fluid img-thumb"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          
            <div className="bottom-modal-content p-4">
                  <div className="property-description mt-3">
                    <p>{roomDesc.replace(/<[^>]+>/g, "")}</p>
                  </div>
                  <div className="property-amenitiess mt-4">
                    <>
                    <h6 className="mb-3">Room Amenities</h6>
                    <div className="row mb-0 border-0">
                      {roomServices?.map((services, idx) => (
                      <div key={idx} className="col-lg-4 col-md-6 col-sm-6">
                        <p className="mb-2 d-flex"><Diamond size={12} className="me-1"></Diamond> {services.serviceName}</p>
                        {/* <h6 className="amenity-ttile">
                            <img src="/images/room/modalimg/icon/double-bed.png" className="amenity-title-img inline-block" /> Beds and
                            Bedding
                          </h6> */}
                      </div>
                      ))}
                    </div>
                     
                    </>
                  </div>
                </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
