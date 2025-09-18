"use client";
import React from "react";
import CityExp from "../Components/CityExp";
import Nearbycity2 from "../Components/Nearbycity2";
import SearchDestination from "../Components/SearchDestination";
import AccordionItem from "../Components/AccordionComponent/page";
import { useState } from "react";
import Header from "../Components/Header";

export default function CityHotelClient({ hotelData, brand_slug }) {
  const [openIndex, setOpenIndex] = useState(0);

  const handleAccordionClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqsList = [
  {
    title: "What time is check-in and check-out?",
    description: "Check-in time is from <strong>2:00 PM</strong> and check-out is until <strong>12:00 PM</strong>."
  },
  {
    title: "Is parking available at the hotel?",
    description: "Yes, <em>complimentary parking</em> is available for all our guests."
  },
  {
    title: "Do you offer airport transfers?",
    description: "Yes, we offer <u>airport pick-up and drop services</u> at an additional charge. Please contact the front desk for details."
  },
  {
    title: "Are pets allowed in the hotel?",
    description: "Unfortunately, <strong>pets are not allowed</strong> except for service animals."
  },
  {
    title: "Is there free Wi-Fi available?",
    description: "Yes, <strong>high-speed Wi-Fi</strong> is available throughout the property at no extra cost."
  }
];

  
  const {
    city_by_hotels: cityList,
    // city_faqs: faqsList,
    city_data: stateCity,
    near_by_hotel_data: nearby,
  } = hotelData;

  return (
    <>
    <Header></Header>
<section className="position-relative banner-section">
  {/* Banner Image */}
<div className="w-100 overflow-hidden rounded-0 mtspace5">
  <video
    className="w-100 h-[102vh] object-cover"
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
  >
    <source src="/img/banner-video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>


  {/* Fixed Book Now Form at Bottom of Section */}
  {/* <div className="position-absolute bottom-0 start-0 w-100 bg-white shadow">
    <BookNowForm />
  </div> */}
</section>



      <section data-aos="fade-up">
        <div className="container-fluid p-0">
          <div className="global-heading-sec text-center">
            <div className="row justify-content-center mb-2">
              <div className="col-md-9 md-offset-1">
                <h2 className="global-heading pt-4">Clarks Inn Suites, Hotel in Manali near Mall Road</h2>
                {/* <p className="global-heading2">
                Each stay, a story waiting to be lived.
                </p> */}
                <p className="mb-2">Clarks Inn Suites is a charming hotel nestled amidst the serene and picturesque valley of Manali. Clarks Inn Suites, Manali enjoys good connectivity while also offering a certain degree of isolation. Our hotel in Manali is close to several tourist spots, reducing the commute time for travellers. We are 6.6 km away from Mall Road, Manali, 8 km away from Vanvihar Garden and 16 km away from Solang Valley and 20 minutes from the Hidimba Devi Temple. With 24 rooms that are well-equipped and furnished with modern amenities, you are guaranteed a comfortable and memorable stay. Each room offers breathtaking views of the snow-clad mountains and the lush green valleys from the comfort of your own private balcony.
                </p>
                {/* <button className="btn book-now text-uppercase rounded-0">Know More</button> */}
              </div>
            </div>
          </div>
        </div>
      </section>

   {/* searchbydestination */}
<section className="seacrhdest">
<SearchDestination/>
</section>

   {/* explider */}
 <section className="mt-4">
        <div className="container">
   <div className="global-heading-sec text-center">
            <div className="row justify-content-center mb-1">
              <div className="col-md-9 md-offset-1">
                <h2 className="global-heading">Experience in Manali</h2>
                {/* <p className="global-heading2">
                Each stay, a story waiting to be lived.

                </p> */}
                <p className="mb-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.

                </p>

                {/* <button className="btn book-now rounded-0">Know More</button> */}
              </div>
            </div>
          </div>
          <div className="winter-sec">
            <div className="row">
               <CityExp/>       
            </div>
          </div>
        </div>
      </section>


   {/* nearby slider */}
 <section>
        <div className="container">
   <div className="global-heading-sec text-center">
            <div className="row justify-content-center mb-1">
              <div className="col-md-9 md-offset-1">
                <h2 className="global-heading">NEAR BY ATTRACTIONS</h2>
                {/* <p className="global-heading2">
                Each stay, a story waiting to be lived.

                </p> */}
                <p className="mb-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.

                </p>

                {/* <button className="btn book-now rounded-0">Know More</button> */}
              </div>
            </div>
          </div>
          <div className="winter-sec">
            <div className="row">
               <Nearbycity2/>       
            </div>
          </div>
        </div>
      </section>



{/* faqs*/}
      <section id="seccityfaq" className="faq-cs-sc cs-sc-padding location-cs-sc">
  <div className="container">
    <div className="row mb-3">
      <div className="col-md-12">
                  <div className="global-heading-sec text-center">
            <div className="row justify-content-center">
              <div className="col-md-9 md-offset-1">
                <h2 className="global-heading mb-0">Frequently Asked Questions</h2>
            
              </div>
            </div>
          </div>
       
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <div id="faq">
          {faqsList?.length>0 && faqsList.map((item, index) => (
          
            <AccordionItem
              key={index}
              title={item.title}
              content={

                  <span dangerouslySetInnerHTML={{ __html: item.description }} />

              }
              isOpen={openIndex === index}
              onClick={() => handleAccordionClick(index)}
            />
          
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

    </>
  );

}
