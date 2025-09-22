"use client";
import React, { useState } from "react";

export default function BookTableModal({ show, onClose, hotelName, cityId, propertyId }) {
  const [form, setForm] = useState({
    cityId: cityId ? String(cityId) : "",
    propertyId: propertyId ? String(propertyId) : "",
    fname: "",
    lname: "",
    phone: "",
    email: "",
    date: "",
    guests: "",
    message: "",
    noOfRooms: "0",
    roomsRequired: false,
    checkIn: "",
    checkOut: "",
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotice("");

    const payload = {
      cityId: String(form.cityId),
      propertyId: String(form.propertyId),
      firstName: String(form.fname),
      lastName: String(form.lname),
      mobileNo: String(form.phone),
      email: String(form.email),
      eventDate: String(form.date),
      eventType: "Dine",
      roomsRequired: Boolean(form.roomsRequired), // "true" or "false"
      noOfRooms: String(form.noOfRooms),
      noOfGuests: String(form.guests),
      checkIn: String(form.checkIn || form.date),
      checkOut: String(form.checkOut || form.date),
      requestFrom: "Dine",
      remarks: String(form.message),
      remarks1: "",
      remarks2: "",
    };

    try {
      const res = await fetch("http://loyaltypulsedemo.ownyourcustomers.in/cmsapi/common/EnquireNow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.errorCode === "0") {
        setNotice("Your booking enquiry has been submitted successfully.");
        setForm({
          cityId: String(cityId || ""),
          propertyId: String(propertyId || ""),
          fname: "",
          lname: "",
          phone: "",
          email: "",
          date: "",
          guests: "",
          message: "",
          noOfRooms: "0",
          roomsRequired: "false",
          checkIn: "",
          checkOut: "",
        });
        setTimeout(onClose, 1500);
      } else {
        setNotice(data.errorMessage || "Something went wrong.");
      }
    } catch (err) {
      setNotice("Failed to send enquiry. Please try again later.");
    }

    setLoading(false);
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        tabIndex="-1"
        style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog">
          <div className="modal-content p-1">
            <div className="modal-header">
              <h5 className="modal-title">Enquiry for {hotelName}</h5>
              <button
                type="button"
                className="btn-close close-popup"
                aria-label="Close"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-2">
                <div className="row">
                  {[
                    { label: "First Name", name: "fname", type: "text" },
                    { label: "Last Name", name: "lname", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Phone", name: "phone", type: "tel" },
                    { label: "Date", name: "date", type: "date" },
                    { label: "No. of Guests", name: "guests", type: "number" },
                  ].map((field, idx) => (
                    <div className="col-md-6" key={idx}>
                      <div className="mb-3 form-group">
                        <label className="form-label">{field.label}</label>
                        <input
                          type={field.type}
                          name={field.name}
                          className="form-control"
                          value={form[field.name] || ""}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </div>
                  ))}

                  <div className="col-md-12">
                    <div className="mb-0 form-group">
                      <label className="form-label">Message</label>
                      <textarea
                        name="message"
                        className="form-control"
                        value={form.message || ""}
                        onChange={handleFormChange}
                        rows={2}
                        required
                      />
                    </div>
                  </div>
                </div>

                {notice && <p className="mt-2 text-success">{notice}</p>}
              </div>
              <div className="text-center mb-3">
                <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>

      <style jsx>{`
        .modal-content {
          border-bottom: 5px solid #000;
        }
        .close-popup {
          position: absolute;
          right: 10px;
          top: 10px;
          border: none;
          background: none;
          font-size: 1.7rem;
          cursor: pointer;
          color: #fff;
          line-height: 1rem;
          padding: 0;
          opacity: 1;
          background-color: #000;
        }
        .submit-btn {
          font-size: 14px;
          border-radius: 0;
          background: var(--primary-color);
          padding: 7px 10px;
          border: none;
          color: #fff;
          cursor: pointer;
          text-transform: uppercase;
        }
      `}</style>
    </>
  );
}
