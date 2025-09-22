'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
export default function Diningpageslider({ dineData = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [enquiryHotel, setEnquiryHotel] = useState(null);

  // Transform API dine data into UI-friendly format
  const allHotels = dineData.map(item => ({
    img: item.dineImages?.[0]?.dineImage || '/images/room/default.jpg',
    title: item.dineName || "Untitled",
    text: item.dineDesc || "",
    ohrs: item.openingHours || "",
    chrs: item.closingHours || "",
    city: "", // not provided in API
    category: "", // not provided in API
    price: "" // not provided in API
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredHotels = allHotels.filter(hotel => {
    const matchCity = hotel.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory ? hotel.category === selectedCategory : true;
    return matchCity && matchCategory;
  });

  const [form, setForm] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    message: ''
  });

  const handleOpenModal = (hotel) => {
    setEnquiryHotel(hotel);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ fname: '', lname: '', email: '', phone: '', date: '', guests: '', message: '' });
    setEnquiryHotel(null);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Enquiry submitted!');
    handleCloseModal();
  };
  return (
    <>

      <div className="property-inner-zigzag-section">
          <div className="container pushed-wrapper">
            {filteredHotels.map((hotel, index) => (
              <div className="row align-items-center position-relative mb-4" key={index}>
                <div
                  className="pushed-image col-md-6"
                  style={{
                    backgroundImage: `url(${hotel.img || "/amritara-dummy-room.jpeg"
                      })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "250px",
                    backgroundColor: '#f0f0f0',
                  }}
                ></div>
                <div className="pushed-box col-md-6">
                  <div className="pushed-header">
                    <span className="header-1">{hotel.title}</span>
                    <span className="display-block mt-2">
                    {hotel.text.length > 70 ? (
                      <>
                        {expandedIndex === index ? hotel.text : hotel.text.slice(0, 70) + "..."}
                        <span
                          onClick={() =>
                            setExpandedIndex(expandedIndex === index ? null : index)
                          }
                          style={{ cursor: 'pointer', color: '#000', fontWeight: '600' }}
                        >
                          {expandedIndex === index ? ' ❮❮' : ' ❯❯'}
                        </span>
                      </>
                    ) : (
                      hotel.text
                    )}
                  </span>

                    <div className="flex mt-3 gap-2">
                      
                       <button
                        className="box-btn book-now"
                        onClick={() => handleOpenModal(hotel)}
                      >
                        Book a Table
                      </button>
                      
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>


      {/* <div className="roomacomo hotellist new-hotel-lists">
        <div className='row'>
          {filteredHotels.map((hotel, index) => (
            <div key={index} className="col-md-6">
              <div className='winter-box hotel-box no-image-bg'>
                <Image
                  src={hotel.img}
                  alt={hotel.title}
                  className="w-100"
                  width={350}
                  height={220}
                  quality={75}
                />
                <div className="winter-box-content shadow-sm pt-1">
                  <h3 className="winter-box-heading text-start">{hotel.title}</h3>
                  <p className="display-block mt-2">
                    {hotel.text.length > 70 ? (
                      <>
                        {expandedIndex === index ? hotel.text : hotel.text.slice(0, 70) + "..."}
                        <span
                          onClick={() =>
                            setExpandedIndex(expandedIndex === index ? null : index)
                          }
                          style={{ cursor: 'pointer', color: '#000', fontWeight: '600' }}
                        >
                          {expandedIndex === index ? ' ❮❮' : ' ❯❯'}
                        </span>
                      </>
                    ) : (
                      hotel.text
                    )}
                  </p>
                  <p className="display-block mt-2">
                    {(hotel.ohrs || hotel.chrs) && (
                      <span style={{ fontWeight: 600 }}>Open: </span>
                    )}
                    {hotel.ohrs}{(hotel.ohrs || hotel.chrs) && " - "}{hotel.chrs || (hotel.ohrs || "")}
                  </p>
                
                  <div className='hotel-slider-box-content mt-2'>
                   
                    <div className="winter-box-btn my-0">
                      <button
                        className="box-btn book-now me-0 my-0"
                        onClick={() => handleOpenModal(hotel)}
                      >
                        Book a Table
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <div className="text-center text-gray-500 mt-10">No hotels match your filters.</div>
        )}
      </div> */}
    

      {showModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content p-1">
              <div className="modal-header">
                <h5 className="modal-title">Enquiry for {enquiryHotel?.title}</h5>
                <button type="button" className="btn-close close-popup" aria-label="Close" onClick={handleCloseModal}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-2">
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className="mb-3 form-group">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          name="fname"
                          className="form-control"
                          
                          value={form.fname}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="mb-3 form-group">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          name="lname"
                          className="form-control"
                          
                          value={form.lname}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="mb-3 form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          
                          value={form.email}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="mb-3 form-group">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          
                          value={form.phone}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="mb-3 form-group">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          name="date"
                          className="form-control"
                          value={form.date}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="mb-3 form-group">
                        <label className="form-label">No. of Guests</label>
                        <input
                          type="number"
                          name="guests"
                          className="form-control"
                          
                          value={form.guests}
                          onChange={handleFormChange}
                          min={1}
                          required
                        />
                      </div>
                    </div>
                    <div className='col-md-12'>
                      <div className="mb-0 form-group">
                        <label className="form-label">Message</label>
                        <textarea
                          name="message"
                          className="form-control"
                          
                          value={form.message}
                          onChange={handleFormChange}
                          rows={2}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mb-3">
                  <button type="submit" className="btn btn-primary submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Modal backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}

      <style jsx>{`
      .modal-content{
      border-bottom:5px solid #000;
      }
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999999;
        }
        .popup-content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          position: relative;
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
        .enquiry-form {
          display: flex;
          flex-direction: column;
          gap: .5rem;
          margin-top: 1rem;
        }
        .form-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          margin-bottom: 0.3rem;
          font-size: 0.9rem;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.3rem;
          border: 1px solid var(--primary-color);
          border-radius: 0px;
        }
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          box-shadow: none;
        }
        .form-group textarea {
          height: 60px;
        }
        .error {
          color: red;
          font-size: 0.8rem;
          margin-top: 0.2rem;
        }
        .submit-btn {
          font-size: 14px;
          font-weight: var(--secondary-font-weight);
          border-radius: 0;
          background: var(--primary-color);
          padding: 7px 10px;
          outline: none;
          border: none;
          color: #fff;
          cursor: pointer;
          transition: 0.3s;
          text-transform: uppercase;
        }
        .submit-btn:hover {
          background: var(--primary-color);
        }

        @media screen and (max-width: 768px) {
          .form-group {
            max-width: 47%;
          }
          .form-group.description-group {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}
