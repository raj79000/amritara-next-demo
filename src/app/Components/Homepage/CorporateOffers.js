"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function CorporateOffers() {
  const offers = [
    {
      id: 1,
      bank: "Visa",
      title: "Visa card offer – 3 or more nights",
      desc: "Pay for 2 nights and get 1 night free of cost at ELIVAAS' properties",
      color: "visa",
    },
    {
      id: 2,
      bank: "Visa",
      title: "Visa card offer – 2 nights",
      desc: "Stay for 2 nights and get 50% off on 2nd night at ELIVAAS' properties",
      color: "visa",
    },
    {
      id: 3,
      bank: "ICICI",
      title: "ICICI Bank EMI Offer",
      desc: "NO-COST EMI and Extra 10% instant discount upto ₹50,000 on ICICI Bank cards",
      color: "icici",
    },
    {
      id: 4,
      bank: "ICICI",
      title: "ICICI Bank Offer",
      desc: "Extra 10% instant discount upto ₹25,000/- on ICICI Bank Credit & Debit cards",
      color: "icici",
    },
  ];

  return (
    <>

    <section className="corporate-offers-section section-padding bg-lred">
      <div className="container">
        <div className="global-heading-sec text-center">
          <h2 className="global-heading">Offers</h2>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {offers.map((offer) => (
            <SwiperSlide key={offer.id}>
              <div className={`offer-card ${offer.color}`}>
                <div className="offer-logo">{offer.bank}</div>
                <h4 className="offer-title">{offer.title}</h4>
                <p className="offer-desc">{offer.desc}</p>
                <a href="#" className="learn-more">
                  Explore More
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
    <style jsx>{
        `
        .offers-section {
  margin: 3rem 0;
  text-align: center;
}

.offers-heading {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.offers-subheading {
  color: #666;
  margin-bottom: 2rem;
}

.offer-card {
  border-radius: 12px;
  padding: 1.5rem;
  min-height: 220px;
  text-align: left;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease;
}

.offer-card:hover {
  transform: translateX(-5px);
}

.offer-card.visa {
  background: linear-gradient(180deg, #eef2ff, #dde7ff);
  border: 1px dashed #3b82f6;
}

.offer-card.icici {
  background: linear-gradient(180deg, #fff0ed, #ffe5e0);
  border: 1px dashed #dc2626;
}

.offer-logo {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.offer-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.offer-desc {
  font-size: 0.95rem;
  color: #444;
  flex-grow: 1;
  margin-bottom: 1rem;
}

.learn-more {
  color: #e60023;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
}

.learn-more:hover {
  text-decoration: underline;
}


        
        `


}</style>
</>
  );
}
