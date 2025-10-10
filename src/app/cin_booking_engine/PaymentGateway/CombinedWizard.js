"use client";
import { useState, useEffect, useRef } from "react";
import { useBookingEngineContext } from "../../cin_context/BookingEngineContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCutlery,
  faPuzzlePiece,
  faFileLines,
  faCreditCard,
  faCheckCircle,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import StayStep from "./StayStep";
import AddOnsStep from "./AddOnsStep";
import CartOverview from "./CartOverview";
import DetailStep from "./DetailStep";
import ConfirmStep from "./ConfirmStep";
import toast, { Toaster } from "react-hot-toast";
import BookingAndPayment from "./DetailStep";
//import "react-toastify/dist/ReactToastify.css";
import "../CombinedWizardStyle.css";
import Image from "next/image";
import { Check, CheckCheckIcon, CheckIcon, ArrowLeft } from "lucide-react";

const nextButtonLabels = [
  "Proceed to Details",
  "Continue to Payment",
  "Pay Now",
  "Back to home",
];
const CombinedWizardSidebar = ({ isVisible, onClose, status, destination }) => {
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
    setIsMemberRate,
    isTokenKey,
    setTokenKey,
  } = useBookingEngineContext();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isRoomsVisible, setIsRoomsVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isPropertyVisible, setIsPropertyVisible] = useState(false);
  const formRef = useRef();
  const totalAdults = selectedRooms.reduce(
    (sum, room) => sum + room?.adults,
    0
  );
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
    // const resetTimer = () => {
    //   clearTimeout(timeout);
    //   timeout = setTimeout(() => {
    //     const confirmRefresh = window.confirm(
    //       "Session expired due to inactivity."
    //     );
    //     if (confirmRefresh) {
    //       //window.location.reload();
    //       window.location.href = "/";
    //     }
    //   }, 10 * 60 * 1000);
    // };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("Session expired due to inactivity.");
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
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toISOString().split("T")[0];
  };
  const fromDate = formatDate(selectedStartDate);
  const toDate = formatDate(selectedEndDate);
  const openDatePickerPage = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };
  const openRoomPage = () => {
    setIsRoomsClose(true);
    setIsRoomsVisible(!isRoomsVisible);
  };
  const handleRoomChange = () => {
    setFilters((prev) => ({
      ...prev,
      //guests: { adults, children, rooms: roomCount },
    }));
  };

  const openPropertyPage = (id) => {
    setSelectedRoomDetails({ isPropertyVisible: false, id: id });
    setSelectedRoomId(id);
    setIsPropertyVisible(true);
  };
  const removeProperty = (id) => {
    setSelectedRoom((prev) =>
      prev.map((room) =>
        room.id === id
          ? {
              ...room,
              roomId: "",
              roomName: "",
              roomRate: "",
              roomImage: null,
              packageRate: "",
              childRate: "",
            } // Use null instead of {}
          : room
      )
    );
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

  const fetchRateApi = async () => {
    // const response = await axios.post("/api/staah-api/rate", {
    //   selectedPropertyId,
    //   fromDate,
    //   toDate,
    // });

    const dayRate = rateResponse?.Rooms?.flatMap((room) => {
      const newSelectedRooms = selectedRoom.filter(
        (sel) => sel.roomId === room?.RoomId
      );

      return newSelectedRooms.map((selected) => {
        const matchedRatePlan = room?.RatePlans?.find(
          (ratePlan) => ratePlan?.RateId === selected?.rateId
        );

        const firstRateObj = matchedRatePlan
          ? Object.values(matchedRatePlan?.Rates || {})[0]
          : null;

        // Update packageRate for selectedRoom
        setSelectedRoom((prev) =>
          prev.map((rm) =>
            rm?.adults <= selected.maxAdult &&
            rm?.rateId === selected?.rateId &&
            rm?.roomId === selected?.roomId
              ? {
                  ...rm,
                  packageRate: isMemberRate
                    ? (Math.round(
                        firstRateObj?.OBP?.[rm.adults.toString()]?.RateBeforeTax
                      ) || 0.0) * 0.9
                    : Math.round(
                        firstRateObj?.OBP?.[rm.adults.toString()]?.RateBeforeTax
                      ) || 0.0,
                  roomRateWithTax: isMemberRate
                    ? Math.round(
                        firstRateObj?.OBP?.[rm.adults.toString()]?.RateBeforeTax
                      ) +
                      Math.round(
                        Math.round(
                          firstRateObj?.OBP?.[rm.adults.toString()]
                            ?.RateBeforeTax
                        ) *
                          (Math.round(
                            firstRateObj?.OBP?.[rm.adults.toString()]
                              ?.RateBeforeTax
                          ) <= 7500
                            ? 1.2
                            : 1.8)
                      )
                    : Math.round(
                        firstRateObj?.OBP?.[rm.adults.toString()]?.RateAfterTax
                      ),
                  adultRate:
                    parseFloat(firstRateObj?.ExtraAdultRate?.RateAfterTax) ||
                    0.0,
                  childRate:
                    parseFloat(firstRateObj?.ExtraChildRate?.RateAfterTax) ||
                    0.0,
                  roomAdultExtraCharge:
                    parseInt(
                      firstRateObj?.OBP?.[rm.adults.toString()]?.RateAfterTax
                    ) - parseInt(firstRateObj?.OBP?.["1"]?.RateAfterTax),
                }
              : rm
          )
        );
        //const totalGuests = selected?.adults + selected?.children;
        const extraChildren =
          selected.children > selected?.applicableChild
            ? selected?.children - selected?.applicableChild
            : 0;
        const extraChildTaxes = Array.from({ length: extraChildren }, () =>
          extraChildren >= 1 ? firstRateObj?.ExtraChildRate?.Tax || [] : []
        ).flat();

        const taxArray = [
          ...(firstRateObj?.OBP?.[selected.adults.toString()]?.Tax || []),
          ...extraChildTaxes,
        ];
        const taxObject = {};
        taxArray.forEach((t) => {
          if (t?.Name && t?.Amount != null) {
            const amount = parseFloat(t.Amount);
            taxObject[t.Name] = (taxObject[t.Name] || 0) + amount;
          }
        });

        if (firstRateObj && selected) {
          if (extraChildren > 0) {
            taxObject["ExtraChildRate"] = parseFloat(
              (firstRateObj?.ExtraChildRate?.RateBeforeTax || 0.0) *
                extraChildren
            );
          }

          if (
            selected?.adults > selected?.maxAdult &&
            parseFloat(firstRateObj?.ExtraAdultRate?.RateAfterTax) > 1.0
          ) {
            taxObject["ExtraAdultRate"] = parseFloat(
              firstRateObj?.ExtraAdultRate?.RateBeforeTax || 0.0
            );
          }
          if (isMemberRate) {
            taxObject["GST2"] = Math.round(
              selected?.packageRate *
                (selected?.packageRate <= 7500 ? 0.12 : 0.18)
            );
          }
        }
        return {
          RoomId: selected?.roomId,
          RateId: selected?.rateId,
          MinInventory: room?.MinInventory,
          RateAfterTax: parseInt(firstRateObj?.OBP?.["1"]?.RateAfterTax || "0"),
          ...taxObject,
        };
      });
    });

    return dayRate;
  };

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
      document.body.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Dim background
    } else {
      document.body.style.overflow = "auto"; // Enable body scroll
      document.body.style.backgroundColor = ""; // Reset background
    }
  }, [isVisible]);
  return (
    <>
      {/* Overlay */}
      {isVisible && <div className="overlay" onClick={onClose}></div>}
      {/* Wizard Sidebar */}
      <div
        className={`CombinedWizard dark-cartsection wizard-sidebar ${isVisible ? "active" : ""}`}
      >
        <div className="nav-sidebar" style={{ overflowY: "auto" }}>
          <div className="nav flex-column nav-pills me-0">
            {steps.map((step, index) => (
              <button
                key={index}
                className={`nav-link ${
                  index === currentStep ? "active" : "active1"
                }`}
                onClick={() =>
                  index != steps.length - 1 &&
                  !isTokenKey &&
                  setCurrentStep(index)
                }
              >
                <span>{step.icon}</span>
                {step.title}
              </button>
            ))}
          </div>
        </div>
        <div className="side-overlay isActive">
        
          
          
              <div className="cart-design-fixed">

  <div className="tab-content-top-Wizard dark-mode-cart">
            <div className="accrodionForNewWizard" id="room-details">
              {selectedRoom?.length > 0
                ? selectedRoom.map((room, index) => (
                    <div
                      key={room?.id || index}
                      className="RepeatedRoomItemInTopWizard"
                    >
                      {room?.roomId && room?.roomName ? (
                        <>
                          {/* {room?.adults + room?.children > room.maxGuest && (
                            <div>
                              <p>
                                <span style={{ color: "red" }}>*</span> Maximum{" "}
                                {room.maxGuest} guests are allowed
                              </p>
                            </div>
                          )}
                          {room?.adults > room.maxAdult && (
                            <div>
                              <p>
                                <span style={{ color: "red" }}>*</span> Maximum{" "}
                                {room.maxAdult} adults are allowed
                              </p>
                            </div>
                          )}
                          {room?.children > room.maxChildren && (
                            <div>
                              <p>
                                <span style={{ color: "red" }}>*</span> Maximum{" "}
                                {room.maxChildren} children are allowed
                              </p>
                            </div>
                          )} */}
                        </>
                      ) : (
                        // Grey placeholder when no image is available
                        <div className="SelectedRoomTopInNewWWizard">
                          <div className="SelectedRoomTopInNewWWizardCol1">
                            <div className="InWizardSelectedRoomFlex">
                              <div className="CheckForSelectedRoomInWizard">
                                <CheckIcon></CheckIcon>
                              </div>

                              <div
                                className="room-placeholder room-count-d-flex"
                                style={{
                                  width: "auto",
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  margin: "0px",
                                }}
                                onClick={() => {
                                  openPropertyPage(room?.id);
                                  onClose();
                                }}
                              >
                                <p>
                                  {destination}
                                </p>
                                <p className="f-12-new mb-0">
                                  Room {index + 1} - &nbsp;
                                  <span className="span-underline">
                                    Select room {index + 1}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {room?.roomId && room?.roomName ? (
                        <div className="SelectedRoomTopInNewWWizard">
                          <div className="SelectedRoomTopInNewWWizardCol1 mobile-order-1">
                            <div className="InWizardSelectedRoomFlex">
                              {/* <div className="CheckForSelectedRoomInWizard">
                                <CheckIcon></CheckIcon>
                              </div> */}
                               <h4 className="wizard-title-main m-2">
                                  {destination}
                                </h4>
                              {/* <p className="f-12-new mb-0">
                                Selected Room {index + 1}
                                <span className="f-12-new mb-0">
                                  (
                                  {`${room.adults} Adults,
                                                    ${room.children} Children
                                                    `}
                                  )
                                </span>
                              </p> */}
                            </div>
                          </div>
                          <div className="SelectedRoomTopInNewWWizardCol2 mobile-order-3">
                            {/* <h6 className="h6 selectedRoomNameInWizard">
                              {room.roomName}
                            </h6> */}
                            <div className="package-d-flex-new">
                              <p className="f-12-new">
                                {/* {room?.roomPackage} */}
                                {/* <span>
                                  {" "}
                                    {isFinite(room?.roomRateWithTax) && room?.roomRateWithTax != 0
                              ?  <> -INR{" "} {Math.round(room?.roomRateWithTax)}</>
                              :  <> - Sold Out
                                <span className="small-text-for-today"> (for today)</span>
                                </>
                              }
                                </span>{" "}
                                / Night */}
                                {/* <span>
                                  {isFinite(room?.roomRateWithTax) && room?.roomRateWithTax != 0 ? (
                                    <>
                                      {" "} - INR {Math.round(room?.roomRateWithTax)} / Night
                                    </>
                                  ) : (
                                    <>
                                      {" "} - Sold Out
                                      <span className="small-text-for-today"> (for today)</span>
                                    </>
                                  )}
                                </span> */}
                              </p>
                            </div>
                          </div>
                          {/* <div className="SelectedRoomTopInNewWWizardCol3 mobile-order-2">
                            <button
                              onClick={() => {
                                openPropertyPage(room?.id);
                                onClose();
                              }}
                              className="modifytext-new-wizard"
                            >
                              <FontAwesomeIcon
                                className="cursor-pointer icons-neww"
                                icon={faEdit}
                              />
                              <span>Modify </span>
                            </button>

                            <FontAwesomeIcon
                              className="cursor-pointer icons-neww me-1"
                              icon={faTrashAlt}
                              onClick={() => removeProperty(room?.id)}
                            />
                          </div> */}
                        </div>
                      ) : null}
                    </div>
                  ))
                : null}
              {/* <div className="accordion-item">
                  <h6 className="h6 high-stay">Stay Information</h6>
                  <div className="room-flex my-2">
                    <p className="f-12-new">
                      {formatDate(selectedStartDate)} &nbsp;- &nbsp;
                      {formatDate(selectedEndDate)}
                    </p>
                    <button
                      onClick={openDatePickerPage}
                      className="modifytext-new-wizard"
                    >
                      <span>Modify </span>
                      <FontAwesomeIcon
                        className="cursor-pointer icons-neww"
                        icon={faEdit}
                      />
                    </button>
                  </div>
                  {isDatePickerVisible && (
                    <div className="main-bx-field mb-3 bdr-booking-bottom wizard-calender h6">
                      <DatePicker
                        selectedStartDate={selectedStartDate}
                        selectedEndDate={selectedEndDate}
                      />
                    </div>
                  )}
                  {isRoomsVisible && (
                    <div className="row">
                      <div className=" col-md-12 main-bx-field filter-item me-3 bdr-booking-bottom wizard-room-manager">
                        <StayStepRoomManager onRoomChange={handleRoomChange} />
                      </div>
                    </div>
                  )}
                  <div className="room-flex mb-0">
                    <p className="total-member-count f-12-new">{`${totalAdults} Adults, ${totalChildren} Children, ${totalRooms} Rooms`}</p>
                    <button
                      onClick={openRoomPage}
                      className="modifytext-new-wizard"
                    >
                      <span>Modify </span>
                      <FontAwesomeIcon
                        className="cursor-pointer icons-neww"
                        icon={faEdit}
                      />
                    </button>
                  </div>
                </div> */}
            </div>
          </div>
          <div className="d-flex">
            <a
            className="widget-heading-back close-widget wizard-close-fixed-btn"
            onClick={onClose}
          >
            <span className="close-side-widget"> <ArrowLeft size={20} /> Back</span>
          </a>

          <a
            className="widget-heading close-widget wizard-close-fixed-btn"
            onClick={onClose}
          >
            <span className="close-side-widget">x</span>
          </a>
          </div>

                 {selectedRoom?.length > 0 ? (
                          <>
                            <div className="container step-wizard-card-section combined-wizard-stepper">
                              <div className="d-flex justify-content-between align-items-center position-relative w-50 m-auto stepper-wizard">
                        
                                {(() => {
                                  // find first room where roomName is empty/null
                                  const firstIncompleteIndex = selectedRoom?.findIndex(
                                    (rm) => !rm?.roomName
                                  );
                        
                                  return selectedRoom?.map((rm, indx) => {
                                    let circleClass = "";
                                    if (firstIncompleteIndex === -1 || indx < firstIncompleteIndex) {
                                      circleClass = "completed"; // done already
                                    } else if (indx === firstIncompleteIndex) {
                                      circleClass = "active"; // first empty slot
                                    }
                        
                                    return (
                                      <div className="text-center position-relative flex-fill" key={indx}>
                                        <div className={`step-circle ${circleClass}`}>
                                          {circleClass === "completed" ? (
                                            <Check size={18} strokeWidth={3} />
                                          ) : (
                                            indx + 1
                                          )}
                                        </div>
                                        <div
                                          className={`mt-2 ${
                                            circleClass === "completed" ? "fw-bold" : "fw-normal"
                                          }`}
                                        >
                                          Room {indx + 1}
                                        </div>
                                        <div className="step-line completed"></div>
                                      </div>
                                    );
                                  });
                                })()}
                        
                                {/* Reservation step */}
                                <div className="text-center position-relative flex-fill">
                                  <div className="step-circle">{selectedRoom?.length + 1}</div>
                                  <div className="mt-2 fw-normal">Reservation</div>
                                </div>
                              </div>
                            </div>
                          </>
                          ) : (
                            ""
                          )}   
              </div>
                           



          <div className="NewTypeWizard">
            
            <div className="tab-content mobile-order-2">
              <BookingAndPayment
                formData={formData}
                handleChange={handleChange}
                goNext={goNext}
                 ref={formRef}
              ></BookingAndPayment>
              <div className="credit-card-images-for-new-wizard">
                <Image
                  src="/booking-engine-imgs/img/crds-credit.png"
                  height={50}
                  width={100}
                  alt="Credit Card"
                />
                <Image
                  src="/booking-engine-imgs/img/crds-credit-1.png"
                  height={50}
                  width={100}
                  alt="Credit Card"
                />
                <Image
                  src="/booking-engine-imgs/img/crds-credit-2.png"
                  height={50}
                  width={100}
                  alt="Credit Card"
                />
                <Image
                  src="/booking-engine-imgs/img/crds-credit-3.png"
                  height={50}
                  width={100}
                  alt="Credit Card"
                />
              </div>
            </div>
            <div className="tab-content mobile-order-1">
              <div className="tab-pane1">
                {steps[currentStep]?.title === "Stay" && (
                  <StayStep
                    // totalAdults={totalAdults}
                    // totalChildren={totalChildren}
                    // totalRooms={totalRooms}
                    // selectedRoom={selectedRoom}
                    // totalPrice={totalPrice}
                    // selectedStartDate={selectedStartDate}
                    // selectedEndDate={selectedEndDate}
                    goNext={goNext}
                    onClose={onClose}
                    onSend={()=> formRef.current.submitForm()}
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
      </div>
    </>
  );
};
export default CombinedWizardSidebar;
