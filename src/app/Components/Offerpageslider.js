"use client";
import React, { useState } from "react";

export default function Offerpagesslider({ offers }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!offers || offers.length === 0) return null;

  return (
    <div className="roomacomo hotellist new-hotel-lists">
      <div className="row">
        {offers.map((offer, index) => {
          // Choose first offer image or fallback
          const imageUrl =
            offer.offersImages && offer.offersImages.length > 0
              ? offer.offersImages[0].offerImages
              : "/images/room/premium_room.png";

          // Use offerTitle or offerName as title
          const title = offer.offerTitle || offer.offerName || "Offer";

          // Use offerDesc or internalDescription as text
          const text = offer.offerDesc || offer.internalDescription || "";

          return (
            <div key={offer.propertyOfferId || index} className="col-md-6 mb-4">
              <div className="winter-box hotel-box no-image-bg">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-100"
                  style={{ height: 220, objectFit: "cover" }}
                />
                <div className="winter-box-content shadow-sm pt-1">
                  <h3 className="winter-box-heading text-start">{title}</h3>
                  <p className="display-block mt-2">
                    {text.length > 100 ? (
                      <>
                        {expandedIndex === index ? text : text.slice(0, 100) + "..."}
                        <span
                          onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                          style={{ cursor: "pointer", color: "#000", fontWeight: "600" }}
                        >
                          {expandedIndex === index ? " ❮❮" : " ❯❯"}
                        </span>
                      </>
                    ) : (
                      text
                    )}
                  </p>
                  <div className="hotel-slider-box-content mt-2">
                    <div className="hotel-box-content mt-0">
                      
                      <a href="#" className="box-btn book-now me-0 my-0">
                        View Rates
                      </a>
                    </div>
                    <div className="winter-box-btn my-0">
                      {/* <a href="#" className="offer-explore-more-btn">
                        Know More
                      </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
