'use client';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function EnquiryFormModal({
  venue,
  onClose,
  onSubmit,
  propertyName = '',
  propertyId = '',
  cityName = '',
  cityId = '',
}) {
  const [form, setForm] = useState({
    city: cityName,
    cityId: cityId,
    hotel: propertyName,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    eventDate: null,
    eventType: '',
    roomsRequired: '',
    guests: '',
    rooms: '',
    checkIn: null,
    checkOut: null,
    enquire: '', // <-- add this here
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      city: cityName,
      hotel: propertyName,
      cityId,
    }));
  }, [cityName, propertyName, cityId]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setForm((prev) => ({ ...prev, [name]: value }));
  // };
  const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({
    ...prev,
    [name]: value,
    ...(name === 'roomsRequired' && value === 'No' ? { rooms: '' } : {})
  }));
};

  const handleSubmit = async () => {
    try {
      const body = {
        cityId: String(form.cityId || ''),
        propertyId: String(propertyId || ''),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        mobileNo: form.phone.trim(),
        email: form.email.trim(),
        eventDate: form.eventDate ? formatDate(form.eventDate) : '',
        eventType: form.eventType || 'Event',
        roomsRequired: form.roomsRequired === 'Yes', // Boolean
        noOfRooms: form.rooms || '0',
        noOfGuests: form.guests || '0',
        checkIn: form.checkIn ? formatDate(form.checkIn) : '',
        checkOut: form.checkOut ? formatDate(form.checkOut) : '',
        requestFrom: 'Event',
        remarks: 'Event',
        remarks1: 'Event',
        remarks2: 'Event'
      };

      console.log('Submitting enquiry:', JSON.stringify(body, null, 2));

      const res = await fetch('http://loyaltypulsedemo.ownyourcustomers.in/cmsapi/common/EnquireNow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.errorCode === '0') {
        alert('Enquiry submitted successfully!');
        onSubmit(form);
        onClose();
      } else {
        alert(`Submission failed: ${data.errorMessage || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Error submitting enquiry, please try again.');
    }
  };



  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!venue) return null;

  return (
    <>
      <div
        className="modal fade show venue-popup"
        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title">Enquiry for {venue?.title}</h5>
              <button type="button" className="btn-close" onClick={onClose}>
                x
              </button>
            </div>
            <div className="modal-body">
              <div className="row g-2">
                {/* City - Prefilled and disabled */}
                {/* <h1>{propertyId}</h1> */}
                <div className="col-md-6">
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={form.city}
                    disabled
                  />
                </div>

                {/* Hotel - Prefilled and disabled */}
                <div className="col-md-6">
                  <input
                    type="text"
                    name="hotel"
                    className="form-control"
                    value={form.hotel}
                    disabled
                  />
                </div>

                {/* First Name */}
                <div className="col-md-6">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="form-control"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>

                {/* Last Name */}
                <div className="col-md-6">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="form-control"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>

                {/* Phone */}
                <div className="col-md-6">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    className="form-control"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Event Date */}
                <div className="col-md-6">
                  <DatePicker
                    selected={form.eventDate}
                    onChange={(date) => setForm((prev) => ({ ...prev, eventDate: date }))}
                    className="form-control w-100"
                    placeholderText="Event Date"
                    dateFormat="dd-MM-yyyy"
                  />
                </div>

                {/* Event Type */}
                <div className="col-md-6">
                  <select
                    name="eventType"
                    className="form-control"
                    value={form.eventType}
                    onChange={handleChange}
                  >
                    <option value="">Event Type</option>
                    <option>Wedding</option>
                    <option>Conference</option>
                    <option>Birthday</option>
                    <option>Other</option>
                  </select>
                </div>



                {/* Guests */}
                <div className="col-md-6">
                  <input
                    type="number"
                    name="guests"
                    placeholder="No. of Guest"
                    className="form-control"
                    value={form.guests}
                    onChange={handleChange}
                  />
                </div>

                {/* Rooms Required */}
<div className="col-md-6">
  <select
    name="roomsRequired"
    className="form-control"
    value={form.roomsRequired}
    onChange={handleChange}
  >
    <option value="" disabled>
      Rooms Required?
    </option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

{/* No. of Rooms - only if Rooms Required is Yes */}
{form.roomsRequired === 'Yes' && (
  <div className="col-md-6">
    <input
      type="number"
      name="rooms"
      placeholder="No. of Rooms"
      className="form-control"
      value={form.rooms}
      onChange={handleChange}
    />
  </div>
)}


                {/* Check In */}
                <div className="col-md-6">
                  <DatePicker
                    selected={form.checkIn}
                    onChange={(date) => setForm((prev) => ({ ...prev, checkIn: date }))}
                    className="form-control"
                    placeholderText="Check In"
                    dateFormat="dd-MM-yyyy"
                  />
                </div>

                {/* Check Out */}
                <div className="col-md-6">
                  <DatePicker
                    selected={form.checkOut}
                    onChange={(date) => setForm((prev) => ({ ...prev, checkOut: date }))}
                    className="form-control"
                    placeholderText="Check Out"
                    dateFormat="dd-MM-yyyy"
                  />
                </div>

                {/* Enquire textarea */}
                <div className="col-12 mt-3">
                  <textarea
                    id="enquire"
                    name="enquire"
                    className="form-control"
                    rows={2}
                    placeholder="Message"
                    value={form.enquire}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 text-center">
                  <button className="btn btn-primary w-100 mt-3 venue-submit-btn" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
      .venue-popup .form-control,
      .venue-popup .select{
        border-radius:0!important;
        width:100%;
        font-size:14px!important;
      }
        .venue-popup .modal-body .react-datepicker-wrapper{
        border-radius:0!important;
        width:100%!important;
        }
        .venue-submit-btn{
            display: inline-block;
            background-color: #000;
            color: #fff;
            width: 106px !important;
            border-radius: 0;
            outline: none;
            border: none;
            text-transform: uppercase;
            font-size: 14px;
            text-align: center;
        }

      `}

      </style>
    </>
  );
}
