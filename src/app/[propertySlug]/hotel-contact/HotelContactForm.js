"use client";

import React, { useState } from "react";

export default function HotelContactForm({ cityId, propertyId, longitude, latitude,googleMap }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    subject: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        cityId: cityId?.toString() || "",
        propertyId: propertyId?.toString() || "",
        firstName: form.firstName,
        lastName: form.lastName,
        mobileNo: form.mobileNo,
        email: form.email,
        eventDate: "",
        eventType: "Hotel Contact Us",
        roomsRequired: false,
        noOfRooms: "",
        noOfGuests: "",
        checkIn: "",
        checkOut: "",
        requestFrom: "Hotel Contact Us",
        remarks: form.remarks || form.subject, // subject/message in remarks
        remarks1: "",
        remarks2: "",
      };

      const res = await fetch(
        "https://clarkscms.cinuniverse.com/Api/common/EnquireNow",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.errorCode === "0") {
        setMessage("Your enquiry has been sent successfully!");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          mobileNo: "",
          subject: "",
          remarks: "",
        });
      } else {
        setMessage(data.errorMessage || "Failed to send enquiry.");
      }
    } catch (error) {
      console.error("Enquiry submit error:", error);
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact_frm sec-padding bg-light">
      <div className="container-md">
        <div className="row shadow p-3 rounded-lg">
          <div className="col-lg-7 col-md-7 px-5 py-0 rounded-3">
            <form className="row mb-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First Name"
                  type="text"
                  className="w-full p-2 border form-control"
                />
              </div>

              <div className="col-md-6">
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last Name"
                  type="text"
                  className="w-full p-2 border form-control"
                />
              </div>

              <div className="col-md-6">
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="E-mail"
                  type="email"
                  className="w-full p-2 border form-control"
                />
              </div>

              <div className="col-md-6">
                <input
                  name="mobileNo"
                  value={form.mobileNo}
                  onChange={handleChange}
                  required
                  placeholder="Phone"
                  type="tel"
                  className="w-full p-2 border form-control"
                />
              </div>

              <div className="col-md-12">
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  type="text"
                  className="w-full p-2 border form-control"
                />
              </div>

              <div className="col-md-12">
                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  required
                  placeholder="Write your message"
                  cols={30}
                  rows={3}
                  className="w-full p-2 border form-control"
                />
              </div>

              <div className="text-center mt-2 submit-contact-us">
                <button
                  className="btn px-4 py-2 bg-black text-white btn-outline-dark book-now"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "SUBMIT"}
                </button>
              </div>

              {message && (
                <div className="mt-3 text-center text-success">{message}</div>
              )}
            </form>
          </div>

          <div className="col-lg-5 ps-0 col-md-5 col-sm-12">
            <div className="inner-column wow fadeInLeft">
              {/* <iframe
                src={`https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`}
                width="100%"
                height="300"
                loading="lazy"
              /> */}
              <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14021.567874465847!2d77.0997871!3d28.5279359!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x2bb9cba86c44b4e1!2sAmritara%20private%20hideaways!5e0!3m2!1sen!2sin!4v1584517017077!5m2!1sen!2sin"
               width="100%" height="300"></iframe>
              {/* <iframe
                src={`${googleMap} || "https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed"}`}
                width="100%"
                height="300"
                loading="lazy"
              /> */}
              {/* <h2>Longitude : {longitude}</h2>
              <h2>Latitude : {latitude}</h2> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
