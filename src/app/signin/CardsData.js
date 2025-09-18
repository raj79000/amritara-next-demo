import React from "react";
import Image from "next/image";
import { Diamond } from "lucide-react";

const CardsData = () => {
  return (
    <>
      <div className="our-rewards">
        <div className="cards__desktop">
          <div className="card card__classic">
            <div className="card__content">
              <div className="card__wrapper">
                <Image
                  src="/rewards/aarambh.jpg"
                  alt="aarambh"
                  height={300}
                  width={600}
                  className="img-fluid mb-3 w-100"
                />
                <span className="card__label">Directly Enroll to Aarambh</span>
                <hr className="separator-wrapper" />
                <p className="card__description" />
                <ul className="card__advantages">
                  <li className="card__advantage">
                    <Diamond size={13}></Diamond>
                    <span className="card__text">20% Off</span>
                  </li>
                  <li className="card__advantage">
                     <Diamond size={13}></Diamond>
                    <span className="card__text">Welcome Drink</span>
                  </li>
                  <li className="card__advantage">
                    <Diamond size={13}></Diamond>
                    <span className="card__text">Discount on FnB</span>
                  </li>
                  <li className="card__advantage">
                    <Diamond size={13}></Diamond>
                    <span className="card__text">Discount on SPA</span>
                  </li>
                </ul>
              </div>
              <div className="card__bonus">
                <hr className="separator-bonus" />
                <p>
                  Get <strong>100 Bonus Points</strong> on Website Booking
                </p>
              </div>
            </div>
          </div>
          <div className="card card__silver">
            <div className="card__content">
              <div className="card__wrapper">
                <Image
                  src="/rewards/swarna.jpg"
                  alt="swarna"
                  height={300}
                  width={600}
                  className="img-fluid mb-3 w-100"
                />

                <span className="card__label">
                  Upgrade by Earning 4500 points &amp; 10 nights.
                </span>
                <hr className="separator-wrapper" />
                <p className="card__description">
                  All benefits of Aramabh Tier
                </p>
                <ul className="card__advantages">
                  <li className="card__advantage">
                     <Diamond size={13}></Diamond>
                    <span className="card__text">25% Off</span>
                  </li>
                  <li className="card__advantage">
                    <Diamond size={13}></Diamond>
                    <span className="card__text">Complimentary Breakfast</span>
                  </li>
                  <li className="card__advantage">
                    <Diamond size={13}></Diamond>
                    <span className="card__text">Early Check-in</span>
                  </li>
                  <li className="card__advantage">
                     <Diamond size={13}></Diamond>
                    <span className="card__text">Late Check-out</span>
                  </li>
                  <li className="card__advantage">
                     <Diamond size={13}></Diamond>
                    <span className="card__text">Happy Hours</span>
                  </li>
                </ul>
              </div>
              <div className="card__bonus">
                <hr className="separator-bonus" />
                <p>
                  Get <strong>110 Bonus Points</strong> on Website Booking
                </p>
              </div>
            </div>
          </div>
          <div className="card card__gold">
            <div className="card__content">
              <div className="card__wrapper">
                <Image
                  src="/rewards/amrit.jpg"
                  alt="amrit"
                  height={300}
                  width={600}
                  className="img-fluid mb-3 w-100"
                />

                <span className="card__label">
                  Upgrade by Earning 6500 points &amp; 15 nights.
                </span>
                <hr className="separator-wrapper" />
                <p className="card__description">All benefits of Swarna Tier</p>
                <ul className="card__advantages">
                  <li className="card__advantage">
                     <Diamond size={13}></Diamond>
                    <span className="card__text">30% Off</span>
                  </li>
                  <li className="card__advantage">
                    <Diamond size={13}></Diamond>
                    <span className="card__text">Priority Welcome</span>
                  </li>
                  <li className="card__advantage">
                    <Diamond size={13}></Diamond>
                    <span className="card__text">Room Upgrade</span>
                  </li>
                  <li className="card__advantage">
                     <Diamond size={13}></Diamond>
                    <span className="card__text">2nd Guest Stays Free</span>
                  </li>
                  <li className="card__advantage">
                     <Diamond size={13}></Diamond>
                    <span className="card__text">
                      Dedicated Customer Support
                    </span>
                  </li>
                </ul>
              </div>
              <div className="card__bonus">
                <hr className="separator-bonus" />
                <p>
                  Get <strong>120 Bonus Points</strong> on Website Booking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .our-rewards .cards__desktop {
          display: flex;
          gap: 16px;
        }

        .our-rewards .card {
          border-radius: 6px;
          flex: 1 1 0;
          height: auto;
          margin: 0;
          width: auto;
        }

        .our-rewards .card {
          height: auto;
          margin: 0;
          flex: 1 1 33.33%;
        }

        .our-rewards .card__active {
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
          font-kerning: normal;
          font-variant-ligatures: common-ligatures;
          background: #068484;
          border-radius: 0px 0px 0 0;
          color: #fff;
          display: none;
          height: 48px;
          left: -3px;
          padding: 12px;
          position: absolute;
          right: -3px;
          text-align: center;
          top: -48px;
        }

        .our-rewards .card__content {
          border: none;
          display: flex;
          height: 100%;
          width: 100%;
          padding: 16px;
          align-content: space-between;
          flex-direction: row;
          flex-wrap: wrap;
           transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
        }
           .our-rewards .card__content:hover{
           transition: transform 0.3s ease, box-shadow 0.3s ease;
           transform: translateY(-2px);
           box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
           }

        .card__content .card__wrapper {
          width: 100%;
        }
        .card__content  .card__bonus {
          width: 100%;
        }
          .card__content  .card__bonus p strong{
          font-weight: 600!important;
        } 

        .our-rewards .card__content .card__wrapper img {
          margin: 0;
        }

        .our-rewards .card__content .card__wrapper .card-title {
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .our-rewards .card__content .card__wrapper .card__label {
          font-size: 16px;
          font-weight: 600;
      }
        .our-rewards .card__content .card__wrapper .card__advantage .card__text {
          font-size: 14px;
          margin-left: 8px;
          font-weight: 500;
        }

        @media screen and (min-width: 1024px) {
          .our-rewards .card__content {
            height: 100%;
          }
        }

        @media screen and (min-width: 768px) {
          .our-rewards .card__content {
            height: 100%;
          }
        }

        .our-rewards .card img
         {
          border-radius: 6px;
        }
        @media (max-width: 767px) {
          .our-rewards .cards__desktop {
            flex-direction: column;
          }
        }


      `}</style>
    </>
  );
};

export default CardsData;
