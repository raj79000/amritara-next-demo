"use client";
import React, { useState, useEffect } from "react";
import FaqAccordionComponent from "./FaqAccordionComponent";

export default function PropertyFaq({ propertyId }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAccordionClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Fetch FAQs dynamically
  useEffect(() => {
    if (!propertyId) return;
    const fetchFaqs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyFaq?propertyId=${propertyId}`
        );
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        const data = await res.json();
        setFaqs(data?.data || []);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchFaqs();
    }
  }, [propertyId]);

    if (faqs.length === 0) {
    return null;
  }

  return (
    <>
    <section
      id="seccityfaq"
      className="faq-cs-sc cs-sc-padding location-cs-sc mt-5"
    >
      <div className="container">
        <div className="row mb-3">
          <div className="col-md-12">
            <div className="global-heading-sec text-center">
              <div className="row justify-content-center">
                <div className="col-md-9 md-offset-1">
                  <h2 className="global-heading mb-0">
                    Frequently Asked Questions
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading FAQs...</p>
        ) : faqs.length > 0 ? (
          <div className="row">
            <div className="col-md-12">
              <div id="faq">
                {faqs.map((item, index) => (
                  <FaqAccordionComponent
                    key={item.propertyFaqid}
                    title={item.question}
                    content={
                      <span
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                      />
                    }
                    isOpen={openIndex === index}
                    onClick={() => handleAccordionClick(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">No FAQs available for this property.</p>
        )}
      </div>
    </section>
    </>
  );
}
