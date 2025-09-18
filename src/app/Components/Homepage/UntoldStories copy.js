'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import styles from './untold.module.css';
import { getUnforgettableHotelList } from "../../../lib/api/getUnforgettableHotelList"
import { getUnforgettableByHotel } from '../../../lib/api/getUnforgettableByHotel';

const UntoldStories = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchAllExperiences = async () => {
    try {
      const hotelListRes = await getUnforgettableHotelList();
      const hotelList = hotelListRes?.data || [];

      const allExperiences = [];

      for (const hotel of hotelList) {
        const res = await getUnforgettableByHotel(hotel.pid);
        if (res?.data?.length) {
          allExperiences.push({
            hotelName: hotel.title,
            experiences: res.data,
          });
        }
      }

      setExperiences(allExperiences);
    } catch (error) {
      console.error("Error loading all experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAllExperiences();
}, []);

  if (loading) {
    return <p className="text-center py-5">Loading experiences...</p>;
  }

  if (experiences.length === 0) {
    return <p className="text-center py-5">No unforgettable experiences found.</p>;
  }

  return (
    <section className={`${styles.UntoldStoriesSec} global-padding bg-lred`}>
      <Image src={"/img/story-bg.png"} alt="Untold Stories Background" className={styles.bgStoryImage} width={1920} height={1080} />
      <h3 className="main-section-title global-heading">Untold Stories</h3>
      <div className='container-fluid'>
        <div className={styles.swiperWrapper}>
          <Swiper
            loop={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            spaceBetween={5}
            autoHeight={true}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Navigation, Pagination, Autoplay]}
            breakpoints={{
              768: {
                spaceBetween: 10,
              },
            }}
            className={styles.swiperContainer}
          >
            {/* {experiences.map((exp) => (
              <SwiperSlide key={exp.id} className={styles.swiperSlide}>
                <Image
                  height={400}
                  width={400}
                  src={exp.image}
                  alt={exp.title}
                  className={styles.swiperSlideImg}
                />
                <h3 className={styles.slideTitle}>{exp.title}</h3>
              </SwiperSlide>
            ))} */}

            {experiences.map((hotelBlock, index) => (
                <div key={index} className="mb-5">
                  <h4 className="mb-3">{hotelBlock.hotelName}</h4>
                  <Swiper
                    // swiper settings
                  >
                    {hotelBlock.experiences.map((exp) => (
                      <SwiperSlide key={exp.id} className={styles.swiperSlide}>
                        <Image src={exp.image} width={400} height={400} alt={exp.title} className={styles.swiperSlideImg} />
                       <h3 className={styles.slideTitle}>{exp.title}</h3>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ))}

            <div className={`swiper-button-prev ${styles.navButton}`}></div>
            <div className={`swiper-button-next ${styles.navButton}`}></div>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default UntoldStories;
