"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/navigation";

import offstyle from "./offers.module.css";

const baseUrl = process.env.NEXT_PUBLIC_CMS_API_Base_URL;

const NewOfferSlider = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/offers/GetCorporateOffers`
        );

        if (response.data?.errorCode === "0") {
          setOffers(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <section className="section-padding offer-slider-sec bg-lred">
      <div className="container">
        <div className="global-heading-sec text-center">
          <h2 className="global-heading">Offers</h2>
        </div>
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
          >
            {offers.map((offer) => (
              <SwiperSlide key={offer.propertyOfferId}>
                <div className={offstyle.offerbox}>
                  <div className="no-image-bg">
                    <Image
                    src={
                      offer.offersImages?.[0]?.offerImages ||
                      "/placeholder.jpg"
                    }
                    alt={offer.offerTitle || "Offer"}
                    height={300}
                    width={500}
                    className={`${offstyle.offerboximg} w-100`}
                  />
                  </div>
                  
                  <div className={offstyle.offerboxcontent}>
                    <h3 className={offstyle.offerboxcontentheading}>
                      {offer.offerTitle}
                    </h3>
                    <p
                      className={`${offstyle.offerboxcontentpara} display-block two-line-text`}
                    >
                      <span>{offer.offerDesc}</span>
                    </p>
                    <div className={`${offstyle.offerboxcontentbtn} mt-3 `}>
                      <Link
                        href={`/offers/${offer.propertyOfferId}`}
                        className={`${offstyle.offerknowmore} explore-more-btn`}
                        target="_blank"
                      >
                        Know More
                      </Link>
                      <Link
                        href="#"
                        className={`${offstyle.offerkbooknow} book-now-btn`}
                        target="_blank"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default NewOfferSlider;
