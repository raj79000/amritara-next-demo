'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';

export default function Nearbycity() {
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={false}
        pagination={false} // 👈 disables dots
        breakpoints={{
          600: { slidesPerView: 1 },
          1000: { slidesPerView: 2 },
        }}
        className="n-hotel-slider"
      >
        {[

          {
            img: '/images/img-7.jpg',
            title: 'Trekking',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry' 
          },

          {
            img: '/images/img-6.jpg',
            title: 'Desert Safari',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
          },
          

        ].map((hotel, index) => (
          <SwiperSlide key={index} className='cityexpr'>
            <div className="winter-box hotel-box">
              <Image src={hotel.img} alt={hotel.title} className="w-100" width={600}
                height={500}
                quality={100}
              />

              <div className="facilities-boxx-main">
                <div className="hotel-box-content">
                  <h3 className="winter-box-heading">{hotel.title}</h3>
                     {/* <Link href="#" target="_blank" className="box-btn book-now">Explore More</Link> */}
                </div>
                
                <div className="winter-box-btn">
                  <p className='nearby-text'>{hotel.text}</p>
                     <Link href="#" target="_blank" className="box-btn book-now">Explore More</Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </>
  );
}
