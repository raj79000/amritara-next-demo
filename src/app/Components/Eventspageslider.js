'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import VenueDetailsModal from './VenueDetailsModal';
import EnquiryFormModal from './EnquiryFormModal';

export default function Eventspagesslider({
  venueData = [],
  propertyId,
  propertyName,
  cityName,
  cityId
}) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [enquiryVenue, setEnquiryVenue] = useState(null);
  const [selectedSeating, setSelectedSeating] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');

 const transformedVenues = useMemo(() => {
  return venueData.map((venue) => ({
    img: venue.venuesImages?.[0]?.images || '/images/room/premium_room.png',
    title: venue.venueName || 'Untitled Venue',
    text: venue.venueDesc || '',
    seatingStyle: 'Boardroom',
    capacity: '51-100',
    receptionLobby: venue.receptionLobby,
    theater: venue.theater,
    classRoom: venue.classRoom,
    roundTable: venue.roundTable,
    ushape: venue.ushape,
    cluster: venue.cluster,
    wedding: venue.wedding,
    boardRoom: venue.boardRoom,
    floating: venue.floating,
    fishboneSetting: venue.fishboneSetting,
    social: venue.social,

    // ✅ Add property info for prefill
    hotelId: propertyId,
    propertyName: propertyName,
    cityName: cityName,
    cityId: cityId
  }));
}, [venueData, propertyId, propertyName, cityName, cityId]);


  const filteredVenues = transformedVenues.filter((venue) => {
    const matchSeating = selectedSeating ? venue.seatingStyle === selectedSeating : true;
    const matchCapacity = selectedCapacity ? venue.capacity === selectedCapacity : true;
    return matchSeating && matchCapacity;
  });

  return (
    <>
      {/* Filters */}
      
      <div className="d-flex mb-3">
        <select
          value={selectedSeating}
          onChange={(e) => setSelectedSeating(e.target.value)}
          className="search-input-hotel-select me-2"
        >
          <option value="">Seating style</option>
          <option value="Boardroom">Boardroom</option>
          <option value="Circular">Circular</option>
          <option value="Classroom">Classroom</option>
        </select>

        <select
          value={selectedCapacity}
          onChange={(e) => setSelectedCapacity(e.target.value)}
          className="search-input-hotel-select"
        >
          <option value="">Capacity</option>
          <option value="26-50">26-50</option>
          <option value="51-100">51-100</option>
          <option value="101-200">101-200</option>
        </select>
      </div>

      {/* Venue List */}
      <div className='roomacomo hotellist new-hotel-lists'>
      <div className="row">
        {filteredVenues.map((venue, index) => (
          <div key={index} className="col-md-6">
            <div className="winter-box hotel-box no-image-bg rounded-0">
              <Image src={venue.img} alt={venue.title} className="w-100 rounded-0" width={350} height={220} />
              <div className="winter-box-content shadow-sm pt-1">
                <h3 className='winter-box-heading text-start mb-2'>{venue.title}</h3>
                <p className='mb-2'>
                  {venue.text.length > 70
                    ? expandedIndex === index
                      ? venue.text
                      : venue.text.slice(0, 70) + '...'
                    : venue.text}
                  {venue.text.length > 70 && (
                    <span
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      style={{ cursor: 'pointer', color: '#000', fontWeight: '600' }}
                    >
                      {expandedIndex === index ? ' ❮❮' : ' ❯❯'}
                    </span>
                  )}
                </p>

                <div className="d-flex justify-content-between">
                  <button
                    className="offer-explore-more-btn"
                    onClick={() => setSelectedVenue(venue)}
                  >
                    Know more
                  </button>
                  <button
                    className="box-btn book-now"
                    onClick={() => setEnquiryVenue(venue)}
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredVenues.length === 0 && (
          <div className="text-center mt-3">No venues match your filters.</div>
        )}
      </div>
      </div>

      {/* Modals */}
      <VenueDetailsModal venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
      <EnquiryFormModal
        venue={enquiryVenue}
        propertyId={propertyId}
        propertyName={propertyName}
        cityName={cityName}
        cityId={cityId}
        onClose={() => setEnquiryVenue(null)}
        onSubmit={(data) => console.log('Form Submitted:', data)}
      />
    </>
  );
}
