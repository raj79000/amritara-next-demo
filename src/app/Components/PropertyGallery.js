"use client";

import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import { useState } from "react";
import Image from "next/image";

function HotelGallery({ galleryData }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const categories = ["all", ...new Set(galleryData.map((img) => img.category))];

  return (
    <div className="container-md mt-4 mb-5 lansdowne-hotel-gallery-page mt-5">
      {/* Category Tabs */}
      <ul className="nav nav-tabs mb-3 d-flex flex-row gap-2 justify-content-center">
        {categories.map((category) => (
          <li key={category} className="nav-item">
            <button
              className={`nav-link f-12-new ${
                activeCategory === category
                  ? "bg-dark text-white"
                  : "bg-light text-dark"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* Image Grid */}
      <Gallery withCaption>
        <div className="row">
          {galleryData
            .filter(
              (img) =>
                activeCategory === "all" || img.category === activeCategory
            )
            .map(({ id, src, caption, category }) => (
              <div
                key={id}
                className="col-lg-4 col-md-4 col-sm-4 col-12 mb-4 no-image-bg"
              >
                <Item
                  original={src}
                  thumbnail={src}
                  caption={caption}
                  width="1024"
                  height="768"
                >
                  {({ ref, open }) => (
                    <Image
                      ref={ref}
                      onClick={open}
                      src={src}
                      className="img-fluid"
                      width={600}
                      height={400}
                      alt={caption || category}
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                        cursor: "pointer",
                        borderRadius: "8px",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  )}
                </Item>
              </div>
            ))}
        </div>
      </Gallery>
    </div>
  );
}

export default HotelGallery;
