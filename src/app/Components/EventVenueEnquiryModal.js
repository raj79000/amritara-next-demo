"use client";
import React, { useState } from "react";

export default function VenueEventEnquiryModal({
  show,
  onClose,
  hotelName,
  cityId,
  propertyId,
  venueTitle,
}) {
  const [form, setForm] = useState({
    cityId: cityId ? String(cityId) : "",
    propertyId: propertyId ? String(propertyId) : "",
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    eventDate: "",
    eventType: "",
    roomsRequired: "false",
    noOfRooms: "0",
    noOfGuests: "",
    checkIn: "",
    checkOut: "",
    requestFrom: "Event",
    remarks: "",
    remarks1: "",
    remarks2: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ Success message

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "true" : "false") : String(value),
    }));
  };

  const handleRoomRequiredChange = (value) => {
    setForm((prev) => ({
      ...prev,
      roomsRequired: value ? "true" : "false",
      noOfRooms: value ? prev.noOfRooms : "0",
    }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(""); // Clear previous message

    const payload = {
      cityId: String(form.cityId),
      propertyId: String(form.propertyId),
      firstName: String(form.firstName),
      lastName: String(form.lastName),
      mobileNo: String(form.mobileNo),
      email: String(form.email),
      eventDate: formatDate(form.eventDate),
      eventType: String(form.eventType || "Dine"),
      roomsRequired: Boolean(form.roomsRequired),
      noOfRooms: String(form.noOfRooms),
      noOfGuests: String(form.noOfGuests),
      checkIn: formatDate(form.checkIn || form.eventDate),
      checkOut: formatDate(form.checkOut || form.eventDate),
      requestFrom: "Dine",
      remarks: String(form.remarks),
      remarks1: "",
      remarks2: "",
    };

    try {
      const response = await fetch(
        "http://loyaltypulsedemo.ownyourcustomers.in/cmsapi//common/EnquireNow",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (data.errorCode === "0") {
        setSuccessMessage("✅ Enquiry submitted successfully!");
        setForm({
          ...form,
          firstName: "",
          lastName: "",
          mobileNo: "",
          email: "",
          eventDate: "",
          eventType: "",
          roomsRequired: "false",
          noOfRooms: "0",
          noOfGuests: "",
          checkIn: "",
          checkOut: "",
          remarks: "",
        });
      } else {
        setSuccessMessage(`❌ ${data.errorMessage || "Something went wrong."}`);
      }
    } catch (error) {
      setSuccessMessage("❌ Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show new-type-popup"
        tabIndex="-1"
        style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-1">
            <div className="modal-header">
              <h5 className="modal-title">Enquiry for {venueTitle}</h5>
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
                    { label: "First Name", name: "firstName", type: "text" },
                    { label: "Last Name", name: "lastName", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Mobile No", name: "mobileNo", type: "tel" },
                    { label: "Event Date", name: "eventDate", type: "date" },
                    { label: "Event Type", name: "eventType", type: "text" },
                  ].map((field, idx) => (
                    <div className="col-md-6" key={idx}>
                      <div className="mb-3 form-group">
                        <label className="form-label">{field.label}</label>
                        <input
                          type={field.type}
                          name={field.name}
                          className="form-control"
                          value={form[field.name]}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </div>
                  ))}

                  {/* Rooms Required */}
                  <div className="col-md-6">
                    <div className="mb-3 form-group">
                      <label className="form-label d-block">Rooms Required?</label>
                      <div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="roomsRequired"
                            id="roomsRequiredYes"
                            value="true"
                            checked={form.roomsRequired === "true"}
                            onChange={() => handleRoomRequiredChange(true)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="roomsRequiredYes"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="roomsRequired"
                            id="roomsRequiredNo"
                            value="false"
                            checked={form.roomsRequired === "false"}
                            onChange={() => handleRoomRequiredChange(false)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="roomsRequiredNo"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* No of Rooms */}
                  {form.roomsRequired === "true" && (
                    <div className="col-md-6">
                      <div className="mb-3 form-group">
                        <label className="form-label">No. of Rooms</label>
                        <input
                          type="number"
                          name="noOfRooms"
                          className="form-control"
                          value={form.noOfRooms}
                          onChange={handleFormChange}
                          min="1"
                        />
                      </div>
                    </div>
                  )}

                  {/* Guests */}
                  <div className="col-md-6">
                    <div className="mb-3 form-group">
                      <label className="form-label">No. of Guests</label>
                      <input
                        type="number"
                        name="noOfGuests"
                        className="form-control"
                        value={form.noOfGuests}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Check-in & Check-out */}
                  {["checkIn", "checkOut"].map((name, idx) => (
                    <div className="col-md-6" key={idx}>
                      <div className="mb-3 form-group">
                        <label className="form-label">
                          {name === "checkIn" ? "Check In" : "Check Out"}
                        </label>
                        <input
                          type="date"
                          name={name}
                          className="form-control"
                          value={form[name]}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Remarks */}
                  <div className="col-md-12">
                    <div className="mb-3 form-group">
                      <label className="form-label">Message</label>
                      <textarea
                        name="remarks"
                        className="form-control"
                        value={form.remarks}
                        onChange={handleFormChange}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-3">
                <button
                  type="submit"
                  className="btn btn-primary submit-btn"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
                {successMessage && (
                  <div
                    style={{
                      marginTop: "10px",
                      color: successMessage.startsWith("✅") ? "green" : "red",
                      fontWeight: "500",
                    }}
                  >
                    {successMessage}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>

      <style jsx>{`
        .new-type-popup .modal-content {
          border-bottom: 5px solid #000;
        }
        .new-type-popup .close-popup {
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
        .new-type-popup .submit-btn {
          font-size: 14px;
          border-radius: 0;
          background: var(--primary-color);
          padding: 7px 10px;
          border: none;
          color: #fff;
          cursor: pointer;
          text-transform: uppercase;
        }
        .new-type-popup .form-control {
          color: #000;
          font-size: 14px;
          box-shadow: none;
          outline: none;
          border-radius: 0;
        }
        .new-type-popup .form-label {
          margin-bottom: 0.2rem;
        }
      `}</style>
      
    </>
  );
}
