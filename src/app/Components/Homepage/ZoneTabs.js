"use client";
import { useEffect, useState } from "react";
import { getPropertyList } from "../../../lib/api/getPropertyList"; // fetches property list
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import styles from "./zone.module.css";
import Link from "next/link";

export default function ZoneTabs({ zones }) {
  const [activeZone, setActiveZone] = useState(zones?.[0]?.zoneId);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (activeZone) {
      getPropertyList().then((res) => {
        const filtered =
          res?.data?.filter((p) => p.zoneId === activeZone) || [];
        setProperties(filtered);
      });
    }
  }, [activeZone]);

  return (
    <>
      <section className="DiscoverSectionForZone mt-5">
        <div className="container-fluid">
          <div className="global-heading-sec text-center">
            <h2 className="global-heading">Discover</h2>
          </div>
          <div className="pt-2 pb-4">
            {/* Zone Tabs */}
            <ul className={`nav nav-tabs ${styles.ZonetabHome}`}>
              {zones.map((zone) => (
                <li className="nav-item" key={zone.zoneId}>
                  <button
                    className={`nav-link ${styles.InActiveTab} ${
                      activeZone === zone.zoneId
                        ? `active ${styles.ActiveTab}`
                        : ""
                    }`}
                    onClick={() => setActiveZone(zone.zoneId)}
                  >
                    {zone.zoneName}
                  </button>
                </li>
              ))}
            </ul>

            {/* Zone Properties */}
            <div
              className={`tab-content border border-top-0 ${styles.TabContent}`}
            >
              {properties.length > 0 ? (
                <Swiper
                  spaceBetween={20}
                  slidesPerView={3}
                  modules={[Navigation]}
                  navigation
                  loop={true}
                  breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 2 },
                    991: { slidesPerView: 4 },
                  }}
                >
                  {properties.map((property) => (
                    <SwiperSlide key={property.propertyId}>
                      <div className={styles.TabCardWrapper}>
                        <div className={styles.TabCard}>
                          <div className={styles.NoImgBg}>
                          <Image
                            src={
                              property?.images[0]?.propertyImage ||
                              "/no_image1.jpg"
                            } // adjust key if needed
                            height={300}
                            width={500}
                            alt={property.propertyTitle}
                            className={styles.TabCardImg}
                          />
                          </div>
                          <h5 className={styles.TabCardTitle}>
                            {property.propertyTitle}
                          </h5>
                          <div className={styles.TabContentBtn}>
                            <Link
                              href={`/${property.propertySlug}/hotel-overview`}
                              className="explore-more-btn"
                            >
                              Explore
                            </Link>
                            <Link
                              href={property.booking_url || "#"}
                              className="book-now-btn"
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
              ) : (
                <p className="text-muted">No properties found for this zone.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
