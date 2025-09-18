  "use client"
  import React, { useState, useEffect } from 'react';
  import { Swiper, SwiperSlide } from 'swiper/react';
  import { Navigation, Autoplay, Pagination } from 'swiper/modules';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import Image from 'next/image';
  import styles from './untold.module.css';

  import { postAPI } from '../../../lib/api/api'

  const UntoldStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStories = async () => {
      try {
        const response = await postAPI('getuntoldstorieslist');
        setStories(response.data || []);
      } catch (error) {
        console.error("Error loading stories:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchStories();
    }, []);

    if (loading) {
      return <p className="text-center py-5">Loading stories...</p>;
    }

    if (stories.length === 0) {
      return <p className="text-center py-5">No stories found.</p>;
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
              slidesPerView={'1'}
              // slidesPerView={'auto'}
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
                }
              }}
              className={styles.swiperContainer}
            >
              {stories.map((story) => (
                <SwiperSlide key={story.id} className={styles.swiperSlide}>
                  {story.image && (
                    <Image
                      height={400}
                      width={400}
                      src={story.image}
                      alt={story.title}
                      className={styles.swiperSlideImg}
                    />
                  )}
                  <h5 className={styles.slideTitle}>{story.title}</h5>
                </SwiperSlide>
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
