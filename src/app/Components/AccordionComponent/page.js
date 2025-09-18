"use client";
import React, { useRef, useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const AccordionItem = ({ title, content, isOpen, onClick }) => {
  const contentRef = useRef(null); // Reference to the accordion content
  const [height, setHeight] = useState(0); // Track the dynamic height for transition

  const [openIndex, setOpenIndex] = useState(0); // First accordion is open by default

  const handleAccordionClick = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Close if clicked on the same one, otherwise open the new one
  };

  useEffect(() => {
    if (isOpen) {
      setHeight(contentRef.current.scrollHeight); // Set the height based on the content's scroll height
    } else {
      setHeight(0); // Collapse when not open
    }
  }, [isOpen]); // Recalculate height when the accordion is opened or closed

  return (
    
    <div className="accordion-item">
      <div className="accordion-title" onClick={onClick}>
        <h5>{title}</h5>
        <span className="arrow-icon">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      <div
        className="accordion-content"
        ref={contentRef}
        style={{ maxHeight: `${height}px` }} // Dynamic height for smooth transition
      >
        <p>{content}</p>
      </div>
    </div>


  );
};

export default AccordionItem;
