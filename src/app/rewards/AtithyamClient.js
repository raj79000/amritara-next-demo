"use client";
import React from "react";
import Image from "next/image";
import CardsData from "./CardsData";
import TierWiseDataTable from "./TierWiseDataTable";

const AtithyamClient = () => {
  return (
    <>
      <div className="rewards-page-data">
        <div className="atithyam-logo">
          <Image
            src="/rewards/atithyam_logo.png"
            alt="Atithyam Logo"
            width={300}
            height={200}
            style={{ height: "auto" }}
          />
        </div>
        <div className="rewards-content">
          <div className="heading-style-1">
            <h1 className="mb-4 mt-4 text-center global-heading">
              Unlock a World of Exclusive Rewards and Privileges
            </h1>
          </div>
          <h4 className="text-center mb-4 about-text-rewards">
              With tiers that grow with you—Aarambh, Swarna, and Amrit—
              <b>
                <i>Atithyam</i>
              </b>{" "}
              <br />
              ensures your journey is enriched at every step.
            </h4>
            <button className="reward-join-now-btn">Join Now</button>
        </div>
      </div>

      <CardsData></CardsData>
      <TierWiseDataTable></TierWiseDataTable>

      <style jsx>{`
        .rewards-page-data {
          text-align: center;
          padding: 100px 0 50px 0;
        }
        .rewards-page-data .atithyam-logo img {
          text-align: center;
          width: 300px;
          height: auto !important;
          margin: 0 auto;
        }
        .rewards-page-data .heading-style-1:after,
        .rewards-page-data .heading-style-1:before {
          display: none !important;
        }
        .about-text-rewards b {
          font-weight: 600 !important;
          color: var(--red) !important;
        }
        .about-text-rewards i {
          font-style: italic;
        }
        .reward-join-now-btn {
          background-color: var(--red);
          color: #fff;
          border: none;
          padding: 8px 20px;
          border-radius: 0px;
          font-size: 14px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 0.3s ease;
          letter-spacing: 1px;
        }
      `}</style>
    </>
  );
};

export default AtithyamClient;
