'use client';
import FaqAccordionComponent from './FaqAccordionComponent';
import React, { useState } from 'react';

export default function PropertyFaq() {
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
  return (
    <>
       <section id="seccityfaq" className="faq-cs-sc cs-sc-padding location-cs-sc mt-5 d-none">
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
                {faqsList?.length > 0 && faqsList.map((item, index) => (
                  <FaqAccordionComponent
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
