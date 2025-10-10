"use client";
import { useState, useEffect } from "react";
import { useBookingEngineContext } from "../../cin_context/BookingEngineContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,faCutlery,faPuzzlePiece,
  faFileLines,
  faCreditCard,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import StayStep from "./StayStep";
import AddOnsStep from "./AddOnsStep";
import CartOverview from "./CartOverview";
import DetailStep from "./DetailStep";
import ConfirmStep from "./ConfirmStep";

import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";

const nextButtonLabels = [
  "Proceed to Details",
  "Continue to Payment",
  "Pay Now",
  "Back to home",
];

const WizardSidebar = ({ isVisible, onClose, status }) => {
  const {
    selectedStartDate,
    setSelectedStartDate,
    selectedEndDate,
    setSelectedEndDate,
    totalPrice,
    setTotalPrice,
    selectedRooms,
    selectedRoom,
    setSelectedRoom,
    setUserDetails,
    selectedRoomDetails,
    setSelectedRoomDetails,
    currentStep,
    setCurrentStep,
    addonList,
    isMemberRate,
    setIsMemberRate,isTokenKey, setTokenKey
  } = useBookingEngineContext();
  const totalAdults = selectedRooms.reduce((sum, room) => sum + room?.adults, 0);
  const totalChildren = selectedRooms.reduce(
    (sum, room) => sum + room?.children,
    0
  );
  const totalRooms = selectedRooms?.length;
  const [steps, setsteps] = useState([
    { title: "Stay", icon: <FontAwesomeIcon icon={faHouse} /> },
    // ...(addonList?.length > 0
    //   ? [{ title: "AddOns", icon: <FontAwesomeIcon icon={faPuzzlePiece} /> },
    //     { title: "Overview", icon: <FontAwesomeIcon icon={faFileLines} /> }
    //   ]
    //   : []),
    
    { title: "Detail", icon: <FontAwesomeIcon icon={faCreditCard} /> },
    { title: "Confirm", icon: <FontAwesomeIcon icon={faCheckCircle} /> },
  ]);
  // State for form data
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gstNumber: "",
    specialRequests: "",
    agreeToTerms: false,
    cardType: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  useEffect(() => {
    setsteps([
      { title: "Stay", icon: <FontAwesomeIcon icon={faHouse} /> },
      // ...(addonList?.length > 0
      //   ? [{ title: "AddOns", icon: <FontAwesomeIcon icon={faPuzzlePiece} /> },
      //   { title: "Overview", icon: <FontAwesomeIcon icon={faFileLines} /> }
      // ]
      //   : []),
      { title: "Detail", icon: <FontAwesomeIcon icon={faCreditCard} /> },
      { title: "Confirm", icon: <FontAwesomeIcon icon={faCheckCircle} /> },
    ]);
  }, [addonList]);

  useEffect(() => {
    onClose;
  }, [selectedRoomDetails?.isPropertyVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const storedData = sessionStorage?.getItem("bookingData");
    const responseData = sessionStorage.getItem("paymentResponse");
    if (!storedData && !responseData) {
      sessionStorage.removeItem("paymentResponse");
      setCurrentStep(0);
    }
    let timeout;
    const events = ["mousemove", "keydown", "click", "scroll"];

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("Session expired due to inactivity.");
        // const confirmRefresh = window.confirm(
        //   "Session expired due to inactivity."
        // );
        // if (confirmRefresh) {
        //   //window.location.reload();
        //   window.location.href = "/";
        // }
        window.location.href = "/";
      }, 10 * 60 * 1000); 
    };

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    if (storedData || responseData) {
      setsteps([
        { title: "Stay", icon: <FontAwesomeIcon icon={faHouse} /> },
        { title: "AddOns", icon: <FontAwesomeIcon icon={faPuzzlePiece} /> },
        { title: "Overview", icon: <FontAwesomeIcon icon={faFileLines} /> },
        { title: "Detail", icon: <FontAwesomeIcon icon={faCreditCard} /> },
        { title: "Confirm", icon: <FontAwesomeIcon icon={faCheckCircle} /> },
      ]);
      const parsed = JSON.parse(storedData);
      setFormData((prev) => ({ ...prev, ...parsed?.formData }));
      setSelectedRoom(parsed?.selectedRoom);
      setTotalPrice(parseInt(parsed?.totalPrice));
      // setStartDate(new Date(parsed?.selectedStartDate));
      // setEndDate(new Date(parsed?.selectedEndDate));
      //sessionStorage?.removeItem("bookingData");
    } else {
      sessionStorage?.removeItem("bookingData");
    }

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isVisible]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Validate form for each step
  const validateStep = () => {
    switch (currentStep) {
      case 0: // Stay step
        if (!selectedRoom || !selectedStartDate || !selectedEndDate) {
          toast.error("Please select a room and dates.", {
            position: "top-right",
            autoClose: 3000,
          });
          return false;
        }
        return true;

      // case 1: // Add-Ons step
      //   if (!selectedRoom || !selectedStartDate || !selectedEndDate) {
      //     toast.error("Please select a room and dates.", {
      //       position: "top-right",
      //       autoClose: 3000,
      //     });
      //     return false;
      //   }
      //   return true;
      // case 2: // Overview step
      //   if (!selectedRoom || !selectedStartDate || !selectedEndDate) {
      //     toast.error("Please select a room and dates.", {
      //       position: "top-right",
      //       autoClose: 3000,
      //     });
      //     return false;
      //   }
      //   return true;

      case 1: // Detail step
        const {
          title,
          firstName,
          lastName,
          email,
          phone,
          agreeToTerms,
          cardType,
          cardNumber,
          expiryDate,
          cvv,
          cardholderName,
        } = formData;
        if (
          !title ||
          !firstName ||
          !lastName ||
          !email ||
          !phone ||
          !agreeToTerms
        ) {
          toast.error(
            "Please fill all mandatory fields and accept terms & conditions.",
            { position: "top-right", autoClose: 3000 }
          );
          return false;
        } else if (
          !cardType ||
          !cardNumber ||
          !expiryDate ||
          !cvv ||
          !cardholderName
        ) {
          toast.error("Please fill all payment details.", {
            position: "top-right",
            autoClose: 3000,
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // Handle next step
  const goNext = () => {
    if (!validateStep()) return;
    // if (addonList?.length > 0 && currentStep < steps?.length - 2) {
    //   setCurrentStep(currentStep + 1);
    // }
    // if (
    //   addonList?.length == 0 &&
    //   currentStep < steps?.length - 2 &&
    //   currentStep == 0
    // ) {
    //   setCurrentStep(currentStep + 3);
    // }
    // if (addonList?.length == 0 && currentStep < steps?.length - 1) {
    //   setCurrentStep(currentStep + 1);
    // }
    if (currentStep < steps?.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden"; // Disable body scroll
    } else {
      document.body.style.overflow = "auto"; // Enable body scroll
    }
  }, [isVisible]);

  return (
    <>
      {/* Overlay */}
      {isVisible && <div className="overlay" onClick={onClose}></div>}

      {/* Wizard Sidebar */}
      <div className={`wizard-sidebar ${isVisible ? "active" : ""}`}>
        <div className="nav-sidebar" style={{ overflowY: "auto" }}>
          <div className="nav flex-column nav-pills me-0">
            {steps.map((step, index) => (
              <button
                key={index}
                className={`nav-link ${
                  index === currentStep ? "active" : "active1"
                }`}
                onClick={() => index != (steps.length-1)  && !isTokenKey && setCurrentStep(index)}
              >
                <span>{step.icon}</span>
                {step.title }
              </button>
            ))}
          </div>
        </div>

        <div className="side-overlay isActive">
          <a
            className="widget-heading close-widget wizard-close-fixed-btn"
            onClick={onClose}
          >
            <span className="close-side-widget">x</span>
          </a>
          <div className="tab-content">
            <div className="tab-pane1">
              {steps[currentStep]?.title === "Stay" && (
                <StayStep
                  totalAdults={totalAdults}
                  totalChildren={totalChildren}
                  totalRooms={totalRooms}
                  selectedRoom={selectedRoom}
                  totalPrice={totalPrice}
                  selectedStartDate={selectedStartDate}
                  selectedEndDate={selectedEndDate}
                  goNext={goNext}
                  onClose={onClose}
                />
              )}

              {/* {steps[currentStep]?.title === "AddOns" && (
                <AddOnsStep goNext={goNext} onClose={onClose} />
              )}

              {steps[currentStep]?.title === "Overview" && (
                <CartOverview goNext={goNext} onClose={onClose} />
              )} */}

              {/* {steps[currentStep]?.title === "Detail" && (
                <DetailStep
                  formData={formData}
                  handleChange={handleChange}
                  goNext={goNext}
                />
              )} */}

              {steps[currentStep]?.title === "Confirm" && (
                <ConfirmStep
                  goNext={goNext}
                  onClose={onClose}
                  status={status}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WizardSidebar;
