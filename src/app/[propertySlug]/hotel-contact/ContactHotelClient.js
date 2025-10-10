"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faEnvelope, faMobileAlt } from "@fortawesome/free-solid-svg-icons";
import "./contactus.css";

import Link from "next/link";
import HotelContactForm from "./HotelContactForm";
import PropertyMainHeader from "@/app/Common/PropertyMainHeader";
import NearbyPlaces from "./NearbyPlaces";

export default function ContactHotelClient({ brandSlug, propertySlug, propertyId }) {
  const [propertyData, setPropertyData] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cityDetails, setCityDetails] = useState(null);
  const [staahPropertyId, setStaahPropertyId] = useState(null);

  useEffect(() => {
    if (!propertySlug) return;

    const fetchPropertyIdFromSlug = async (slug) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`
        );
        const json = await res.json();

        if (json.errorMessage !== "success") {
          console.error("Property list fetch error:", json);
          return null;
        }

        const found = json.data.find((p) => p.propertySlug === slug);

        if (!found) return null;

        setCityDetails({
          label: found.cityName,
          value: found.cityId,
          property_Id: found.staahPropertyId,
        });

        setStaahPropertyId(found.staahPropertyId);

        return found.propertyId || null;
      } catch (error) {
        console.error("Error fetching property list:", error);
        return null;
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        // use propertyId from props if available, otherwise resolve from slug
        const finalPropertyId = propertyId || (await fetchPropertyIdFromSlug(propertySlug));
        if (!finalPropertyId) {
          setPropertyData(null);
          setLoading(false);
          return;
        }

        const result = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyByFilter?PropertyId=${finalPropertyId}`
        );
        const json = await result.json();
        const property = json?.data?.[0] || null;

        setPropertyData(property);

        // banner images
        const images = property?.images || []; // property.images is likely an array
const validImageUrls = images
  .map((img) => img?.propertyImage) // extract propertyImage field
  .filter(Boolean); // remove null/empty

setBannerImages(validImageUrls);
      } catch (error) {
        console.error("Error fetching property data:", error);
        setPropertyData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propertySlug, propertyId]);

  if (loading) return <div>Loading hotel details...</div>;
  if (!propertyData) return <div>No property data found.</div>;

  return (
    <>
      <PropertyMainHeader
        brand_slug={brandSlug}
        id={propertyData.propertyId}
        onSubmit={() => {}}
      />
     <section className="position-relative inner-banner-section-slider d-none">
          {bannerImages.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              autoplay={{ delay: 4000 }}
              loop
               className="w-100 slider-banner-inner"
            >
              {bannerImages.map((imgUrl, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={imgUrl}
                    // src="/images/banner_img.png"
                    alt={`Banner ${index + 1}`}
                    width={1920}
                    height={1080}
                    className="w-100 object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Image
              src="/images/banner_img.png"
              alt="Default Banner"
              width={1920}
              height={1080}
             className="w-100 object-cover"
            />
          )}

        {/* Fixed Book Now Form at Bottom of Section */}
        <div className="position-absolute bottom-0 start-0 w-100 bg-white shadow">
          {/* <BookNowForm /> */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 home-page-class`}
            style={{ zIndex: 10 }}
          >
            {/* <button
              onClick={(e) => {
                e.preventDefault();
                handleBookNowClick();
              }}
              className="p-2 bg-white flex items-center justify-center rounded-full"
            >
              {isOpen ? <X size={18} color="black" /> : "Book Now"}
            </button> */}
          </div>
          
        </div>
      </section>

      <section className="main-contactus-section-inner inner-no-banner-sec">
        <div className="container">
          <div className="global-heading-sec text-center">
            <div className="row justify-content-center mb-2">
              <div className="col-md-9 md-offset-1">
                <h2 className="global-heading">{propertyData?.propertyType || ""} Contact in {propertyData?.cityName || ""}</h2>
                {/* <p className="mb-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p> */}
              </div>
            </div>
          </div>

          {/* <HotelContactUs></HotelContactUs> */}

          <section>
            <div className="bg-light pb-3 pt-3">
              <div className="container-md contact-addres">
                <div className="row">
                  
                  <div className="col-12 col-lg-4 col-sm-4">
                    <div className="item">
                      <span className="icon feature_box_col_two">
                        <FontAwesomeIcon icon={faGlobe} />
                      </span>
                      <h6>Address:</h6>
                      <p>
                        {propertyData?.addressDetails[0]?.address1 || ""}
                        {propertyData?.addressDetails[0]?.address2 || ""}
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4 col-sm-4">
                    <div className="item">
                      <span className="icon feature_box_col_three">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </span>
                      <h6>Reservation Email</h6>
                      <p>
                        <Link
                          className="text-lowercase"
                          href={`mailto:${
                            propertyData?.contactDetails?.[0]?.emailId1 || ""
                          }`}
                        >
                          {propertyData?.contactDetails?.[0]?.emailId1 || ""}
                        </Link>
                      </p>
                      <p>
                        <Link
                          className="text-lowercase"
                          href={`mailto:${
                            propertyData?.contactDetails?.[0]?.emailId2 || ""
                          }`}
                        >
                          {propertyData?.contactDetails?.[0]?.emailId2 || ""}
                        </Link>
                      </p>

                      <p>
                        <Link
                          className="text-lowercase"
                          href={`mailto:${
                            propertyData?.contactDetails?.[0]
                              ?.reservationEmail || ""
                          }`}
                        >
                          {propertyData?.contactDetails?.[0]
                            ?.reservationEmail || ""}
                        </Link>
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4 col-sm-4">
                    <div className="item">
                      <span className="icon feature_box_col_three">
                        <FontAwesomeIcon icon={faMobileAlt} />
                      </span>
                      <h6>Reservation Phone</h6>
                      <p>
                        <Link
                          className="text-lowercase"
                          href={`tel:${
                            propertyData?.contactDetails?.[0]?.contactNo1 || ""
                          }`}
                        >
                          {propertyData?.contactDetails[0]?.contactNo1 || ""}
                        </Link>
                      </p>
                      <p>
                        <Link
                          className="text-lowercase"
                          href={`tel:${
                            propertyData?.contactDetails?.[0]?.contactNo2 || ""
                          }`}
                        >
                          {propertyData?.contactDetails[0]?.contactNo2 || ""}
                        </Link>
                      </p>
                      <p>
                        <Link
                          className="text-lowercase"
                          href={`tel:${
                            propertyData?.contactDetails?.[0]?.tollFreeNumber ||
                            ""
                          }`}
                        >
                          {propertyData?.contactDetails[0]?.tollFreeNumber ||
                            ""}
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
          <NearbyPlaces propertyId={propertyData.propertyId}></NearbyPlaces>
        <div className="container">
          <HotelContactForm
            cityId={propertyData?.cityId}
            propertyId={propertyData?.propertyId}
            longitude={propertyData?.addressDetails?.[0]?.longitude}
            latitude={propertyData?.addressDetails?.[0]?.lattitude}
            googleMap={propertyData?.addressDetails?.[0]?.googleMap}
          />
        </div>
      </section>

    </>
  );
}
