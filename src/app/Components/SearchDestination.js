'use client';
import Image from 'next/image';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faTrain } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link'
const hotels = [
  {
    title: 'CLARKS INN SUITES, MANALI',
    address: 'Acadia at Himalayas, Village Jagatsukhmanali, Himachal Pradesh - 175143',
    distance: '51 km',
    cityDistance: '300 Km',
    rate: '4,259',
    tags: ['Organic Farming', 'Cafe', 'Recreational Area', 'Kid Friendly'],
    img: '/images/citypage/destination.png',
    description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since',
  },
  {
    title: 'SPT CLARKS INN SUITES, MANDI',
    address: 'SPT Clarks Inn Suites, Mandi Village & Post Office Pandoh, Mandi Himachal Pradesh - 175124',
    distance: '51 km',
    cityDistance: '38 Km',
    rate: '3,563',
    tags: ['Bakery', 'Poolside Dining', 'Spa', 'Bar'],
    img: '/images/citypage/destination.png',
        description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since',
  },
  {
    title: 'JK CLARKS EXOTICA, NEAR DALHOUSIE MALL ROAD',
    address: 'Baloon Church Road, Dalhousie District, Chamba, Himachal Pradesh - 176304',
    distance: '900 km',
    cityDistance: '80 Km',
    rate: '6,840',
    tags: ['Recreational Area', 'Kid Friendly', 'Rooftop Restaurant'],
    img: '/images/citypage/destination.png',
        description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since',
  },
];
export default function SearchDestination() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
      <div className="container mx-auto p-1 flex justify-center">
        <div className="w-50">
          <div className="mb-6 flex items-center border border-gray-500 rounded-3 px-4 mb-4 mt-4 py-2 shadow-md input_box">
            <input
              type="text"
              placeholder="Search your destination"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow outline-none placeholder:text-black placeholder:uppercase placeholder:font-bold placeholder:text-sm"
            />
            <svg
              className="w-5 h-7 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              viewBox="-4 0 30 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.65 13.65z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4 flex gap-4">
        {/* Left Column */}
        <div className="w-100">
          {/* Search Bar */}
          {/* Hotel Cards */}
          {hotels
            .filter((hotel) => hotel.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((hotel, index) => (
              <div key={index} className="bg-white mb-3 shadow-md mb-6 flex overflow-hidden hotel-item-box-content">
                <Image
                  src={hotel.img}
                  alt={hotel.title}
                  width={200}
                  height={200}
                  className="object-cover w-55 h-auto primary-radius m-2"
                />
                <div className="p-2 flex-1">
                  <div className="mb-1">
                    <h6 className="font-semibold text-md leading-tight w-[75%] mt-2">{hotel.title}</h6>
                    <div className="flex gap-2 text-sm text-gray-700 mt-2 items-center f-12-new">
                      <Image
                        src="/images/citypage/plane.png"
                        alt="Flight"
                        height={10}
                        width={10}
                        className="w-3 h-3 mr-2 inline-block"
                      />
                      {hotel.distance}
                      <Image
                        src="/images/citypage/train.png"
                        alt="Flight"
                         height={10}
                        width={10}
                        className="w-3 h-3 ms-2 inline-block"
                      />
                      {hotel.cityDistance}
                    </div>
                    <p className="text-sm text-gray-600 mt-2"> {hotel.address}</p>

                    <p className="text-sm text-gray-600 mt-2"> {hotel.description.slice(0,120)}... <button className='h-read-more-btn'>read more</button> </p>
                  </div>
                  <hr className="border-black border" />
                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-700">
                    {hotel.tags.map((tag, idx) => (
                      <span key={idx}>• {tag}</span>
                    ))}
                  </div>
                  
                </div>
                <div className="winter-box-btn hotel-box-right-content mt-0 pe-2">
                  <div className="mt-0">
                    <small className='f-12-new'>Starting Rate/Night </small>
                    <span className="price-of-hotel">
                     {hotel.rate} <small className='f-12-new'> + Taxes</small>
                    </span>
                  </div>
                  <div className='bottom-right-sec-for-enq'>
                    <Link href="/overview" className="d-block f-12-new view-more-btn">Visit Hotel</Link>
                  <a href="#" target="_blank" className="box-btn book-now">View Rates</a>
                    </div>
                  
                </div>
              </div>
            ))}
        </div>
        {/* Right Column (Map) */}
        {/* <div className="w-1/3">
          <Image
            src="/images/citypage/map.png"
            alt="Map"
            width={800}
            height={900}
            className="rounded-md h-full object-cover"
          />
        </div> */}
      </div></>
  );
}
