import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";

import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";

import Image from "next/image";

const PropertyGalleryOverview = ({ propertyId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;

    const fetchGallery = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/gallery/GetGalleryByProperty?propertyId=${propertyId}`,
          { cache: "no-store" }
        );
        const json = await res.json();

        if (json.errorMessage === "success" && Array.isArray(json.data)) {
          const allImages = json.data.flatMap((g) => g.galleryImages || []);
          setImages(allImages);
        } else {
          setImages([]);
        }
      } catch (err) {
        console.error("Gallery fetch error:", err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [propertyId]);

  if (loading) return <p className="text-center">Loading gallery...</p>;
  if (!images.length) return <p className="text-center">No gallery images found.</p>;

  return (
    <>
      <section className="gallery-slider my-10 overvie-gallery-slider-sec">
        <div className="global-heading-sec text-center">
          <div className="row justify-content-center mb-4">
            <div className="col-md-9 md-offset-1">
              <h2 className="global-heading pt-5">Gallery</h2>
            </div>
          </div>
        </div>
        <Gallery>
          <Swiper
            modules={[Autoplay, Grid]}
            loop={true}
            speed={3000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            freeMode={true}
            grid={{ rows: 2, fill: "row" }}
            slidesPerView={2}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="mySwiper"
          >
            {images.map((img) => (
              <SwiperSlide key={img.galleryImageId}>
                <Item
                  original={img.image}
                  thumbnail={img.image}
                  width={1200}
                  height={800}
                  title="Gallery Image"
                >
                  {({ ref, open }) => (
                    <div
                      ref={ref}
                      className="relative w-full h-56 rounded-xl overflow-hidden shadow-md cursor-pointer"
                      onClick={open}
                    >
                      <Image
                        src={img.image}
                        alt="Gallery Image"
                        width={600}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </Item>
              </SwiperSlide>
            ))}
          </Swiper>
        </Gallery>
      </section>
      <style jsx>
        {`
          .overvie-gallery-slider-sec .swiper-wrapper {
            display: grid !important;
            grid-template-rows: repeat(2, 1fr) !important;
          }
        `}
      </style>
    </>
  );
};

export default PropertyGalleryOverview;
