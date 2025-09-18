"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/autoplay";

export default function OverExp() {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    { src: "/img/img-2.jpg", title: "Majestic Mountain", desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry" },
    { src: "/img/img-8.jpg", title: "Desert Safari", desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry" },
    { src: "/img/img-4.jpg", title: "Serene Beaches", desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry" },
  ];

  return (
    <div className="discover-slider expericence-sliderr">
      <Swiper
        modules={[Autoplay]}
        loop={true}
        centeredSlides={false}
        spaceBetween={20}
        slidesPerView={3}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        speed={600}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="winter-box">
              <div className="image-overlay">
                <Image
                  src={slide.src}
                  alt={slide.title}
                  width={500}
                  height={500}
                  className="img-slide"
                />
                <div className="expericence-content">
                  <h5 className="experience-title">{slide.title}</h5>
                                  <p className="experience-desc new-exp-desc">
                                    {slide.desc.slice(0, 80)}...
                                    
                                  </p>
                                  <button className="exp-read-more-btn">read more</button>
                  {/* <div className="winter-box-btn">
                  <Link href="#" className="box-btn know-more">Enquire Now</Link>
                  <Link href="#" target="_blank" className="box-btn book-now">Explore More</Link>
                </div> */}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* <div className="flex justify-center items-center mt-2 gap-2 group cursor-pointer">
        <span className="text-lg font-semibold tracking-wide">EXPLORE</span>
        <span className="transition-transform duration-300 group-hover:translate-x-2 motion-reduce:transform-none">
          →
        </span>
      </div> */}

    </div>
  );
}
