"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function PropertyTestimonials({ propertyId }) {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    if (!propertyId) return;

    fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetTestimonial?propertyId=${propertyId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (
          data?.errorCode === "0" &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          // API returns array of testimonials
          const TestimonialsList = data.data.flatMap((item) => item || []);
          setTestimonials(TestimonialsList);
        }
      })
      .catch((err) => console.error("Error fetching testimonials:", err));
  }, [propertyId]);

  // ❌ Do not render anything if no testimonials
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="sec-padding bg-lred" data-aos="fade-up">
      <div className="container">
        <div className="global-heading-sec text-center">
          <div className="row justify-content-center mb-0">
            <div className="col-md-9 md-offset-1">
              <h2 className="global-heading pt-4 mb-0">Testimonials</h2>
            </div>
          </div>
        </div>
        <div className="winter-sec">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={true}
                pagination={false}
                breakpoints={{
                  500: { slidesPerView: 1 },
                  767: { slidesPerView: 1 },
                  1000: { slidesPerView: 1 },
                }}
                className="testimonial-section-slider-over"
              >
                {testimonials.map((testi, index) => (
                  <SwiperSlide key={testi.id || index}>
                    <div className="testimonial-box text-center">
                      <h3 className="winter-box-heading text-center">
                        {testi.title}
                      </h3>
                      <p className="text-center">
                        <span
                          dangerouslySetInnerHTML={{
                            __html:
                              testi.description || "No description available.",
                          }}
                        />
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
