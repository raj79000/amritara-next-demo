"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import * as ReactDOM from "react-dom";

import "swiper/css";
import "swiper/css/autoplay";

export default function OverExp({ propertyId }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
    const [modalContent, setModalContent] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!propertyId) return;

    const fetchExperiences = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/Experiance/GetExperiancesByProperty?propertyId=${propertyId}`,
          { cache: "no-store" }
        );
        const json = await res.json();

        if (json.errorMessage === "success" && json.data?.length > 0) {
          // take expDetails array from first item
          const details = json.data[0]?.expDetails || [];
          setExperiences(details);
        } else {
          setExperiences([]);
        }
      } catch (err) {
        console.error("Experiences API error:", err);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [propertyId]);

  if (loading) return null;
  if (experiences.length === 0) return null;

    const handleKnowMore = (exp) => {
    setModalContent({
      title: exp.experiancesTitle || "",
      description: exp.experiancesDesc || "No description available.",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  function stripHtmlTags(str) {
    if (!str) return "";
    return str.replace(/<[^>]*>?/gm, "");
  }
  

  return (
    <>
    <section className="sec-padding bg-lred" data-aos="fade-up">
      <div className="container">
        <div className="global-heading-sec text-center">
          <div className="row justify-content-center mb-0">
            <div className="col-md-9 md-offset-1">
              <h2 className="global-heading pt-0">Experiences</h2>
            </div>
          </div>
        </div>

        <div className="winter-sec">
          <div className="row">
            <div className="discover-slider expericence-sliderr">
              <Swiper
                modules={[Autoplay]}
                loop={true}
                centeredSlides={false}
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                speed={600}
                breakpoints={{
                  500: { slidesPerView: 1 },
                  767: { slidesPerView: 2 },
                  1000: { slidesPerView: 3 },
                }}
              >
                {experiences.map((exp) => {
                  const firstImg =
                    exp.expImages?.length > 0
                      ? exp.expImages[0].experiancesImages
                      : "/img/placeholder.jpg"; // fallback image

                  return (
                    <SwiperSlide key={exp.experiancesId}>
                      <div className="winter-box">
                        <div className="image-overlay">
                          <Image
                            src={firstImg}
                            alt={exp.experiancesTitle}
                            width={500}
                            height={500}
                            className="img-slide"
                          />
                          <div className="expericence-content">
                            <h5 className="experience-title">
                              {exp.experiancesTitle}
                            </h5>
                            {/* <p className="experience-desc new-exp-desc">
                              {exp.experiancesDesc.slice(0, 80)}...
                            </p> */}

                            <p className="experience-desc new-exp-desc">
                              {stripHtmlTags(exp.experiancesDesc.slice(0, 80))}...
                            </p>

                            
                            
                            <button className="box-btn know-more mt-3 d-block"
                            onClick={() => handleKnowMore(exp)}>
                              Read more
                            </button>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
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
                        <div className="p-3 text-justify pt-0"
                          dangerouslySetInnerHTML={{
                            __html: modalContent.description,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>,
                document.body
              )}
          
    
          <style jsx>{`
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
            .new-type-popup .modal-body p {
              padding-left: 1rem;
              padding-right: 1rem;
            }
            .new-type-popup .modal-body {
              padding-bottom: 1rem;
            }
          `}</style>
    </>
  );
}
