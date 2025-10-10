"use client";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef, useState } from "react";
import { createSignature } from "../../../utilities/signature";
import { getUserInfo } from "../../../utilities/userInfo";

const ConfirmStep = ({ onClose, goNext, status }) => {
  const [responseObject, setResponseObject] = useState(null);
  const [completeResponseObject, setCompleteResponseObject] = useState(null);
  const [reservationStatus, setReservationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingResp, setLoadingResp] = useState(false);
  const [isNodata, setNodata] = useState(false);
  const [BookingDetails, setBookingDetails] = useState(null);
  const [totalAdults, setTotalAdults] = useState(null);
  const [totalChildren, setTotalChildren] = useState(null);
  const hiddenFormRef = useRef(null);
  const [hiddenInputValue, setHiddenInputValue] = useState("");
  // const keyData = "dbKey=Dbconn";
 // const keyData = "dbKey=cinbe_pg";
  const keyData = `dbKey=${process.env.NEXT_PUBLIC_TOKEN_DB_KEY}`;
  const dummyImage = "/no_image.jpg";
  const redirectionUrl = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/th-payment-redirect`;
  
   async function postBookingWidged(propId, rooms,mapping, isClose,ctaName, 
    ApiName,ApiUrl,ApiStatus,ApiErrorCode,ApiMessage) {
    const resp = await getUserInfo();
  
      const sessionId = sessionStorage?.getItem("sessionId");
      // const totalAdults = selectedRoom?.reduce(
      //   (sum, room) => sum + (room?.adults || 0),
      //   0
      // );
      // const totalChildren = selectedRoom?.reduce(
      //   (sum, room) => sum + (room?.children || 0),
      //   0
      // );
       const totalRooms = BookingDetails?.selectedRoom?.length;
      //console.log("data pathname",data)
      const payload = {
      ctaName: ctaName,
      urls: window.location.href,
      cityId: "0",
      propertyId: propId?.toString() || responseObject?.property_id?.toString() || "0",
      checkIn: BookingDetails?.selectedStartDate ?? "",
      checkOut: BookingDetails?.selectedEndDate ?? "",
      adults: totalAdults?.toString() ?? "0",
      children: totalChildren?.toString() ?? "0",
      rooms: totalRooms?.toString() ?? "0",
      promoCode: "",
      ip: resp?.ip,
      sessionId: sessionId,
      deviceName: resp?.deviceInfo?.deviceName,
      deviceType: resp?.deviceInfo?.deviceOS == "Unknown" ? resp?.deviceInfo?.platform : resp?.deviceInfo?.deviceOS,
      roomsName: rooms?.RoomName ?? BookingDetails?.selectedRoom?.map(room => room?.roomName)?.join(", "),
      packageName: mapping?.MappingName ?? BookingDetails?.selectedRoom?.map(room => room?.roomPackage)?.join(", "),
      isCartOpen: mapping?.MappingName ? "Y": "N",
      isCartEdit: "N",
      isCartClick: "N",
      isClose: isClose ? "Y" : "N",
      ApiName: ApiName ?? "",
      ApiUrl: ApiUrl ?? "",
      ApiStatus: ApiStatus?.toString() ?? "",
      ApiErrorCode: ApiErrorCode?.toString() ?? "",
      ApiMessage: ApiMessage?.toString() ?? ""
     }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/tracker/BookingWidged`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify( payload ),
          }
        );
        const res = await response?.json();
  
      //console.log("res BookingWidged",res);
    }

  useEffect(() => {
    const storedData = sessionStorage?.getItem("paymentResponse");
    const bookingData = sessionStorage?.getItem("bookingData");
    if (storedData?.length == 0) {
      setNodata(true);
      return;
    }
    try {
      if (bookingData) {
        const parsedBooking = JSON.parse(bookingData);
        //setBookingDetails(parsedBooking);
        const totalAdults = parsedBooking?.selectedRoom?.reduce((total, room) => {
          return total + (parseInt(room?.adults, 10) || 0);
        }, 0);

        const totalChildren = parsedBooking?.selectedRoom?.reduce(
          (total, room) => {
            return total + (parseInt(room?.children, 10) || 0);
          },
          0
        );

        setTotalAdults(totalAdults);
        setTotalChildren(totalChildren);
      }
      const parsed = JSON.parse(storedData);
      setTimeout(() => {
      postBookingWidged(parsed?.result?.[0]?.responseJson?.property_id,"","", false,"Payment response", 
      "","","","","");
    }, 200);
    
      console.log("parsed",parsed);
      parsed.result[0].responseJson.partner_id = String(
        parsed?.result?.[0]?.responseJson?.partner_id
      );
      parsed.result[0].responseJson.ipn_flag = String(
        parsed?.result?.[0]?.responseJson?.ipn_flag
      );
      if (parsed?.result?.[0]?.responseJson.status === "error") {
        parsed.result[0].responseJson.currency = "INR";
        parsed.result[0].responseJson.amount = "0.0";
        parsed.result[0].responseJson.pg_transaction_id = "00";
      }
      setResponseObject(parsed?.result?.[0]?.responseJson);
      setCompleteResponseObject(parsed);
    } catch (err) {
      console.error("Invalid JSON:", err);
    } finally {
      sessionStorage.removeItem("paymentResponse");
    }
  }, []);

  useEffect(() => {
    // if (
    //   responseObject?.status === "success" ||
    //   responseObject?.status === "paylater"
    // ) {
    //   handleConfirm();
    // }
    if (responseObject != null) {
      handleConfirm();
    }
  }, [responseObject]);

  useEffect(() => {
    if (reservationStatus == "success") {
      const fetchBookingResponse = async () => {
        try {
          const respData = {
            reservationNo:
              completeResponseObject?.result?.[0]?.responseJson?.reservation_id,
            reservationJson: JSON.stringify(
              completeResponseObject?.result?.[0]?.reservationJson
            ),
            bookingDetailsJson: JSON.stringify(
              completeResponseObject?.result?.[0]?.bookingDetailsJson
            ),
          };
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/booking/BookingResponse`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(respData),
            }
          );

          // if (!response.ok) {
          //   throw new Error("failed to fetch");
          // }
          // const data = await response.json();
        } catch (error) {
          //console.error("Error fetching properties:", error);
        }
      };

      fetchBookingResponse();
    }
  }, [reservationStatus]);

  const handleConfirm = async () => {
    setLoading(true);
    
  let roomsData = ""; 
  let mappingData =""; 
  let isCloseData = false;
  let apiStatusData = ""; 
  let apiErrorCodeData = "";  
  let apiMessageData = "";
  let ctaNameData = ""; 
  let apiNameData = "confirm";  
  let apiUrlData = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/payment/confirm`; 
    try {
      const timestamp = Date.now().toString();
      const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
      const signature = await createSignature(
        JSON.stringify(responseObject),
        timestamp,
        secret
      );
      //alert(signature);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/payment/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-timestamp": timestamp,
            "x-signature": signature,
          },
          body: JSON.stringify({ responseObject, keyData }),
        }
      );
      if(!res?.ok){
      ctaNameData = "Reservation post";
      apiStatusData= res?.status;
      apiErrorCodeData= res?.status;
      apiMessageData= "Payment failed";
      }
      else{
        const data = await res.json();
      //alert(`ResponseData ${JSON.stringify(data)}`);
      setReservationStatus(data?.errorMessage);
      const parsedData = JSON.parse(data?.result?.[0]?.bookingDetailsJson);
      setBookingDetails(parsedData);

      const totalAdults = parsedData?.selectedRoom.reduce((total, room) => {
        return total + (parseInt(room?.adults, 10) || 0);
      }, 0);

      const totalChildren = parsedData?.selectedRoom?.reduce((total, room) => {
        return total + (parseInt(room?.children, 10) || 0);
      }, 0);

      setTotalAdults(totalAdults);
      setTotalChildren(totalChildren);
      
      apiStatusData= res?.status;
      apiErrorCodeData= res?.status;
      apiMessageData= "Success";
    }
    } catch (err) {
       apiStatusData= err;
       apiErrorCodeData= "1166";
       apiMessageData= err;
      toast.error("An error occurred.");
    } finally {
      setTimeout(() => {
        //  goNext();
        //  onClose();
        setLoading(false);
        // status(null);
        // setTimeout(() => {
      postBookingWidged("",roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    // }, 200);
      }, 5000);
    }
  };

  const generateReservationIdFromAPI = async (selectedPropertyId) => {
    
  let roomsData = ""; 
  let mappingData =""; 
  let isCloseData = false;
  let apiStatusData = ""; 
  let apiErrorCodeData = "";  
  let apiMessageData = "";
  let ctaNameData = "Fetch reservation ID"; 
  let apiNameData = "reservation-id";  
  let apiUrlData = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/reservation-id`; 
    const timestamp = Date.now().toString();
    const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
    const signature = await createSignature(
      selectedPropertyId.toString(),
      timestamp,
      secret
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/reservation-id`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-timestamp": timestamp,
          "x-signature": signature,
        },
        body: JSON.stringify({
          selectedPropertyId: selectedPropertyId.toString(),
          keyData,
        }),
      }
    );

    if (!response.ok) {
      apiStatusData= response?.status;
      apiErrorCodeData= response?.status;
      apiMessageData= "Data not found";
      setTimeout(() => {
      postBookingWidged("",roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);
      throw new Error("Reservation ID generation failed");
    }

    else{
      apiStatusData= "0";
      apiErrorCodeData= "0";
      apiMessageData= "Success";
      setTimeout(() => {
      postBookingWidged("",roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);
      const data = await response.json();
    return data.reservation_id;
  }
  };
  const handleRetry = async () => {
    const newReservationId = await generateReservationIdFromAPI(
      parseInt(responseObject.property_id)
    );

    sessionStorage.setItem(
      "bookingData",
      JSON.stringify(completeResponseObject?.result?.[0]?.bookingDetailsJson)
    );
    const finalRequestData2 = {
      property_id:
        completeResponseObject?.result?.[0]?.reservationJson?.PropertyId,
      property_name:
        completeResponseObject?.result?.[0]?.bookingDetailsJson.property
          ?.PropertyName,
      property_tel:
        completeResponseObject?.result?.[0]?.bookingDetailsJson.property
          ?.Address?.Phone,
      cust_name: `${completeResponseObject?.result?.[0]?.bookingDetailsJson?.formData.firstName} ${completeResponseObject?.result?.[0]?.bookingDetailsJson?.formData.lastName}`,
      cust_email:
        completeResponseObject?.result?.[0]?.bookingDetailsJson?.formData.email,
      cust_phone:
        completeResponseObject?.result?.[0]?.bookingDetailsJson?.formData.phone,
      cust_address: "N/A",
      cust_city: "N/A",
      cust_state: "N/A",
      cust_country: "N/A",
      cust_postalcode: "N/A",
      reservation_id: newReservationId,
      amount:
        completeResponseObject?.result?.[0]?.bookingDetailsJson?.totalPrice,
      currency: "INR",
      BookingDetailsJson: JSON.stringify(
        completeResponseObject?.result?.[0]?.bookingDetailsJson
      ),
      ReservationJson: JSON.stringify(
        completeResponseObject?.result?.[0]?.reservationJson
      ),
    };
    const jsonString = JSON.stringify(
      completeResponseObject?.result?.[0]?.reservationJson
    );

    const timestamp = Date.now().toString();
    const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
    const signature = await createSignature(
      JSON.stringify(jsonString),
      timestamp,
      secret
    );

  let roomsData = ""; 
  let mappingData =""; 
  let isCloseData = false;
  let apiStatusData = ""; 
  let apiErrorCodeData = "";  
  let apiMessageData = "";
  let ctaNameData = "Th payment request"; 
  let apiNameData = "th-payment-request";  
  let apiUrlData = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/th-payment-request`; 
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/th-payment-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-timestamp": timestamp,
          "x-signature": signature,
        },
        body: JSON.stringify({ finalRequestData2, keyData }),
      }
    );
    
    const data = await resp.json();
    if (data?.errorMessage == "success") {
      
      apiStatusData= "0";
      apiErrorCodeData= "0";
      apiMessageData= "Success";
      const finalRequestData = {
        property_id:
          completeResponseObject?.result?.[0]?.reservationJson?.PropertyId,
        property_name:
          completeResponseObject?.result?.[0]?.bookingDetailsJson.property
            ?.PropertyName,
        property_tel:
          completeResponseObject?.result?.[0]?.bookingDetailsJson.property
            ?.Address?.Phone,
        cust_name: `${completeResponseObject?.result?.[0]?.bookingDetailsJson?.formData.firstName} ${completeResponseObject?.result?.[0]?.bookingDetailsJson?.formData.lastName}`,
        cust_email:
          completeResponseObject?.result?.[0]?.bookingDetailsJson?.formData
            .email,
        cust_phone:
          completeResponseObject?.result?.[0]?.bookingDetailsJson?.formData
            .phone,
        cust_address: "N/A",
        cust_city: "N/A",
        cust_state: "N/A",
        cust_country: "N/A",
        cust_postalcode: "N/A",
        reservation_id: newReservationId,
        amount:
          completeResponseObject?.result?.[0]?.bookingDetailsJson?.totalPrice,
        keyData: keyData,
      };
      setHiddenInputValue(JSON.stringify(finalRequestData));
      setTimeout(() => {
        hiddenFormRef.current.submit();
      postBookingWidged("",roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
      }, 100);
    } else {
      apiStatusData= resp?.status;
      apiErrorCodeData= resp?.status;
      apiMessageData= "Data not found";
      setTimeout(() => {
      postBookingWidged("",roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);
      toast.error(data?.errorMessage);
    }
  };

  return (
    <>
      {isNodata ? (
        <>
          <i
            className="fa fa-times-circle text-red-600 text-4xl"
            aria-hidden="true"
          ></i>
          <h5 className=" font-bold mt-4 text-center">
            Payment Failed
          </h5>
          <p className="mt-2 text-center">Something went wrong.</p>
        </>
      ) : (
        <div>
          {!isNodata && responseObject?.status === "success" ? (
            <div className="booking-confirmed p-10">
              {reservationStatus === null ? (
                <p className="mt-4 text-blue-600 font-medium">
                  Payment successful! Confirming your room booking...
                </p>
              ) : reservationStatus === "success" ? (
                <>
                  <div className="wizard-step-global-padding w-100">
                    <div className="confirmation-step-new">
                      <div className="brand-top-box">
                        <div className="brand-image">
                          <Image
                            src="/booking-engine-imgs/img/clarks-logo-white.png"
                            height={100}
                            width={200}
                            alt="brand image"
                            style={{ filter: "invert(0)" }}
                          />
                        </div>
                      </div>
                      <div className="animated-check-icon text-center py-2">
                        <Image
                          src="/booking-engine-imgs/images/verified.gif"
                          height={100}
                          width={100}
                          alt="confirmation"
                          className="confirm-gif mx-auto"
                        />
                      </div>
                      <div className="reservation-data-box">
                        <div className="confirmation-top">
                          <h3 className="reservation-confrm-title">
                            Reservation Confirmation
                          </h3>
                          <hr />
                          <h6 className="confirmation-number">
                            Your Confirmation Number Is{" "}
                            <span>{responseObject?.reservation_id}</span>{" "}
                          </h6>
                        </div>
                        <div className="confirmation-image">
                          {/* {BookingDetails?.selectedRoom[0].Image} */}
                          {/* {BookingDetails?.selectedRoom[0].Image|| } */}
                          <Image
                            src={
                              BookingDetails?.selectedRoom[0].roomImage ||
                              dummyImage
                            }
                            height={400}
                            width={500}
                            alt="room image"
                          />
                          <h6 className="text-center pt-3">
                            {BookingDetails?.property?.PropertyName}
                          </h6>
                          {/* <Image src="/no_image.jpg" height={400} width={500} alt="room image" /> */}
                        </div>
                        <div className="confirmation-data-box">
                          <div className="c-dis-flex">
                            <ul>
                              <li>
                                <p className="f-12-new">Name</p>
                              </li>
                              <li>
                                <p className="f-12-new">
                                  {BookingDetails?.formData?.title} &nbsp;
                                  {BookingDetails?.formData?.firstName} &nbsp;
                                  {BookingDetails?.formData?.lastName}{" "}
                                </p>
                              </li>
                              <li>
                                <p className="f-12-new">Check-In</p>
                              </li>
                              <li>
                                <p className="f-12-new">
                                  {
                                    new Date(BookingDetails?.selectedStartDate)
                                      .toISOString()
                                      .split("T")[0]
                                  }
                                </p>
                              </li>
                              <li>
                                <p className="f-12-new">Check-Out</p>
                              </li>
                              <li>
                                <p className="f-12-new">
                                  {
                                    new Date(BookingDetails?.selectedEndDate)
                                      .toISOString()
                                      .split("T")[0]
                                  }
                                </p>
                              </li>
                              <li>
                                <p className="f-12-new">Room Name</p>
                              </li>
                              <li>
                                {BookingDetails?.selectedRoom?.map(
                                  (room, index) => (
                                    <p className="f-12-new">
                                      {index + 1} {room.roomName}
                                    </p>
                                  )
                                )}
                              </li>

                              <li>
                                <p className="f-12-new">Package Name</p>
                              </li>
                              <li>
                                {BookingDetails?.selectedRoom?.map(
                                  (room, index) => (
                                    <p className="f-12-new">
                                      {index + 1} {room.roomPackage}
                                    </p>
                                  )
                                )}
                              </li>

                              <li>
                                <p className="f-12-new">Guests</p>
                              </li>
                              <li>
                                <p className="f-12-new">
                                  {totalAdults} Adults, {totalChildren}{" "}
                                  Children,{" "}
                                  {BookingDetails?.selectedRoom?.length} Rooms
                                  {/* {BookingDetails.selectedAddonList.map((addon) => (
                        addon.AddonName
                      )
                    )} */}
                                </p>
                              </li>
                              <li>
                                <p className="f-12-new">Add-ons</p>
                              </li>
                              <li>
                                {BookingDetails?.selectedAddonList?.map(
                                  (addon, index) => (
                                    <p className="f-12-new">
                                      {index + 1} {addon.AddonName}
                                    </p>
                                  )
                                )}
                              </li>

                              <li>
                                <p className="f-12-new">Amount Paid</p>
                              </li>
                              <li>
                                <p className="f-12-new font-weightbold">
                                  INR&nbsp;{BookingDetails?.totalPrice}
                                </p>
                              </li>
                            </ul>
                            <div className="row conf-hotel-details">
                              <div className="col-12 first-col-conf">
                                <p className="f-12-new">Hotel Details</p>
                              </div>
                              <div className="col-12 second-col-conf">
                                <p className="f-12-new">
                                  {/* Alivaa Hotel Gurugram Sohna Road City Center */}
                                  {BookingDetails?.property?.PropertyName}
                                </p>
                                <p className="f-12-new">
                                  {
                                    BookingDetails?.property?.Address
                                      ?.AddressLine
                                  }
                                  , &nbsp;
                                  {BookingDetails?.property?.Address?.City},
                                  &nbsp;
                                  {BookingDetails?.property?.Address?.State},
                                  &nbsp;
                                  {BookingDetails?.property?.Address?.Country},
                                  &nbsp;
                                  {
                                    BookingDetails?.property?.Address
                                      ?.PostalCode
                                  }
                                </p>
                                <p className="f-12-new">
                                  {BookingDetails?.property?.Address?.Email}
                                </p>
                                <p className="f-12-new">
                                  {BookingDetails?.property?.Address?.Phone}
                                </p>
                              </div>
                            </div>
                            <div className="terms-conditionss">
                              <div className="trms-booxx1">
                                <p className="f-12-new">Cancellation Policy</p>
                                <p className="f-12-new">
                                  {BookingDetails?.cancellationPolicyState}
                                </p>
                              </div>
                              <div className="trms-booxx1">
                                <p className="f-12-new">Terms & Conditions</p>
                                <p className="f-12-new">
                                  {BookingDetails?.termsAndConditions}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <Image
                    src="/images/verified.gif"
                    height={100}
                    width={100}
                    alt="confirmation"
                    className="confirm-gif mx-auto"
                  />
                  <h3 className="text-2xl font-bold mt-4 text-green-700">Booking Confirmed</h3>
                  <p className="text-center mt-2">
                    Awesome! Your rooms are booked!
                    <br />
                    We've sent you a confirmation email with all the details.
                    <br />
                    <strong>Reservation ID:</strong> {responseObject?.reservation_id}
                  </p> */}
                </>
              ) : (
                <>
                  <i
                    className="fa fa-times-circle text-red-600 text-4xl"
                    aria-hidden="true"
                  ></i>
                  <h3 className="text-2xl font-bold text-red-600 mt-4">
                    Booking Failed
                  </h3>
                  <p className="mt-2 text-gray-700">
                    We couldn't confirm your booking. Please try again or
                    contact support.
                  </p>
                </>
              )}

              {/* <button
                onClick={() => {
                  onClose();
                  goNext();
                  status(responseObject?.status);
                }}
                disabled={loading}
                className="mt-6 btn btn-primary"
              >
                {loading ? "Saving..." : "Close"}
              </button> */}

              {reservationStatus === null && (
                <button
                  onClick={() => {
                    handleRetry();
                  }}
                  disabled={loading}
                  className="mt-6 btn btn-primary"
                >
                  {loading ? "Saving..." : "Retry"}
                </button>
              )}
              {/* {!loading && (
                <button
                  onClick={() => {
                    handleRetry();
                  }}
                  disabled={loading}
                  className="mt-6 btn btn-primary"
                >
                  Retry
                </button>
              )} */}
            </div>
          ) : !isNodata && responseObject?.status === "paylater" ? (
            <div className="booking-confirmed text-center p-10">
              {reservationStatus === null ? (
                <p className="text-center mt-4 text-blue-600 font-medium">
                  Payment successful2! Confirming your room booking...
                </p>
              ) : reservationStatus === "success" ? (
                <>
                  <div className="wizard-step-global-padding w-100">
                    <div className="confirmation-step-new">
                      <div className="brand-top-box">
                        <div className="brand-image">
                          <Image
                            src="/booking-engine-imgs/img/clarks-logo-white.png"
                            height={100}
                            width={200}
                            alt="brand image"
                          />
                        </div>
                      </div>
                      <div className="animated-check-icon text-center py-2">
                        <Image
                          src="/booking-engine-imgs/images/verified.gif"
                          height={100}
                          width={100}
                          alt="confirmation"
                          className="confirm-gif mx-auto"
                        />
                      </div>
                      <div className="reservation-data-box">
                        <div className="confirmation-top">
                          <h3 className="reservation-confrm-title">
                            Reservation Confirmation
                          </h3>
                          <hr />
                          <h6 className="confirmation-number">
                            Your Confirmation Number Is{" "}
                            <span>{responseObject?.reservation_id}</span>{" "}
                          </h6>
                        </div>
                        <div className="confirmation-image">
                          {/* {BookingDetails?.selectedRoom[0].Image} */}
                          {/* {BookingDetails?.selectedRoom[0].Image|| } */}
                          <Image
                            src={
                              BookingDetails?.selectedRoom[0].roomImage ||
                              dummyImage
                            }
                            height={400}
                            width={500}
                            alt="room image"
                          />
                          {/* <Image src="/no_image.jpg" height={400} width={500} alt="room image" /> */}
                        </div>
                        <div className="confirmation-data-box">
                          <div className="c-dis-flex">
                            <ul>
                              <li>
                                <p className="f-12-new">Name</p>
                              </li>
                              <li>
                                <p className="f-12-new">
                                  {BookingDetails?.formData?.title} &nbsp;
                                  {BookingDetails?.formData?.firstName} &nbsp;
                                  {BookingDetails?.formData?.lastName}{" "}
                                </p>
                              </li>
                              <li>
                                <p className="f-12-new">Check-In</p>
                              </li>
                              <li>
                                <p className="f-12-new">
                                  {BookingDetails?.selectedStartDate}
                                </p>
                              </li>
                              <li>
                                <p className="f-12-new">Check-Out</p>
                              </li>
                              <li>
                                <p className="f-12-new">
                                  {BookingDetails?.selectedEndDate}
                                </p>
                              </li>
                              <li>
                                <p className="f-12-new">Room Name</p>
                              </li>
                              {BookingDetails?.selectedRoom?.map(
                                (room, index) => (
                                  <li key={`room-${index}`}>
                                    {/* {BookingDetails?.selectedRoom?.map(
                                  (room, index) => ( */}
                                    <p className="f-12-new">
                                      {index + 1} {room.roomName}
                                    </p>
                                    {/* )
                                 )} */}
                                  </li>
                                )
                              )}

                              {/* {BookingDetails?.selectedRoom?.map(
                                (room, index) => (
                                  <li>
                                    <p className="f-12-new">
                                      {index + 1} {room.roomName}
                                    </p>
                                  </li>
                                )
                              )} */}
                              <li>
                                <p className="f-12-new">Package Name</p>
                              </li>
                              <li>
                                {BookingDetails?.selectedRoom?.map(
                                  (room, index) => (
                                    <p className="f-12-new">
                                      {index + 1} {room.roomPackage}
                                    </p>
                                  )
                                )}
                              </li>

                              <li>
                                <p className="f-12-new">Guests</p>
                              </li>
                              <li>
                                <p className="f-12-new">
                                  {totalAdults} Adults, {totalChildren}{" "}
                                  Children,{" "}
                                  {BookingDetails?.selectedRoom?.length} Rooms
                                  {/* {BookingDetails.selectedAddonList.map((addon) => (
                        addon.AddonName
                      )
                    )} */}
                                </p>
                              </li>
                              <li>
                                <p className="f-12-new">Add-ons</p>
                              </li>
                              <li>
                                {BookingDetails?.selectedAddonList?.map(
                                  (addon, index) => (
                                    <p className="f-12-new">
                                      {index + 1} {addon.AddonName}
                                    </p>
                                  )
                                )}
                              </li>

                              <li>
                                <p className="f-12-new">Amount Paid</p>
                              </li>
                              <li>
                                <p className="f-12-new font-weightbold">
                                  INR&nbsp;{BookingDetails?.totalPrice}
                                </p>
                              </li>
                            </ul>
                            <div className="terms-conditionss">
                              <div className="trms-booxx1">
                                <p className="f-12-new">Cancellation Policy</p>
                                <p className="f-12-new">
                                  {BookingDetails?.cancellationPolicyState}
                                </p>
                              </div>
                              <div className="trms-booxx1">
                                <p className="f-12-new">Terms & Conditions</p>
                                <p className="f-12-new">
                                  {BookingDetails?.termsAndConditions}
                                </p>
                              </div>
                            </div>
                            <div className="row conf-hotel-details">
                              <div className="col-6 first-col-conf">
                                <p className="f-12-new">Hotel Details</p>
                              </div>
                              <div className="col-6 second-col-conf">
                                <p className="f-12-new">
                                  {/* Alivaa Hotel Gurugram Sohna Road City Center */}
                                  {BookingDetails?.property?.PropertyName}
                                </p>
                                <p className="f-12-new">
                                  {
                                    BookingDetails?.property?.Address
                                      ?.AddressLine
                                  }
                                  , &nbsp;
                                  {BookingDetails?.property?.Address?.City},
                                  &nbsp;
                                  {BookingDetails?.property?.Address?.State},
                                  &nbsp;
                                  {BookingDetails?.property?.Address?.Country},
                                  &nbsp;
                                  {
                                    BookingDetails?.property?.Address
                                      ?.PostalCode
                                  }
                                </p>
                                <p className="f-12-new">
                                  {BookingDetails?.property?.Address?.Email}
                                </p>
                                <p className="f-12-new">
                                  {BookingDetails?.property?.Address?.Phone}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <i
                    className="fa fa-times-circle text-red-600 text-4xl"
                    aria-hidden="true"
                  ></i>
                  <h3 className="text-2xl font-bold text-red-600 mt-4">
                    Booking Failed
                  </h3>
                  <p className="mt-2 text-gray-700">
                    We couldn't confirm your booking. Please try again or
                    contact support.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="booking-confirmed text-center p-10">
              {!isNodata ? (
                <div className="text-center p-10">
                  <i
                    className="fa fa-times-circle text-red-600 text-4xl"
                    aria-hidden="true"
                  ></i>
                  <h5 className="text-center mt-4">
                    Payment Failed
                  </h5>
                  <p className="mt-2 text-center">
                    Something went wrong during the payment. Please try again or
                    contact support.
                  </p>
                  {/* <button
                    onClick={() => {
                      onClose();
                      goNext();
                      status(responseObject?.error_msg);
                    }}
                    disabled={loading}
                    className="mt-6 btn btn-primary"
                  >
                    {loading ? "Saving..." : "Close"}
                  </button> */}

                  <button
                    onClick={() => {
                      handleRetry();
                    }}
                    disabled={loading}
                    className="mt-6 btn btn-primary"
                  >
                    {loading ? "Saving..." : "Retry"}
                  </button>

                  {/* {!loading && (
                    <button
                      onClick={() => {
                        handleRetry();
                      }}
                      disabled={loading}
                      className="mt-6 btn btn-primary"
                    >
                      Retry
                    </button>
                  )} */}
                </div>
              ) : (
                <div className="text-center p-10">
                  <i
                    className="fa fa-times-circle text-red-600 text-4xl"
                    aria-hidden="true"
                  ></i>
                  <h1 className="text-3xl font-bold text-red-600 mt-4">
                    Step Jumped
                  </h1>
                  <p className="mt-2">
                    Please fill your details at Details Step first and then
                    proceed to Payment.
                  </p>

                  <button
                    onClick={() => {
                      onClose();
                      goNext();
                      status(responseObject?.error_msg);
                    }}
                    disabled={loading}
                    className="mt-6 btn btn-primary"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <form
        method="POST"
        action={redirectionUrl}
        ref={hiddenFormRef}
        style={{ display: "none" }}
      >
        <input type="hidden" name="paramvalues" value={hiddenInputValue} />
        <input type="hidden" name="keydata" value={keyData} />
      </form>
    </>
  );
};

export default ConfirmStep;
