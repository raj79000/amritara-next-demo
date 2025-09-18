// src/app/hotels/HotelsPageClient.js

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import axios from "axios";
import MainHeader from "../Common/MainHeader";
import "../Styles/inner-hero.css";

const NoImagePlaceholder = "/no_image1.jpg";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE;

export default function HotelsPageClient() {
    const [hotelTypes, setHotelTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchHotels = async () => {
  try {
    const res = await axios.post(`${baseUrl}/gethotellist`, {});
    if (res?.data?.status && Array.isArray(res.data.data)) {
      const hotelList = res.data.data;

      // Fetch detailed data for each hotel using property_id
      const detailedHotelPromises = hotelList.map(async (hotel) => {
        try {
          const detailRes = await axios.post(`${baseUrl}/getlistbyhotel`, {
            property_id: hotel.id,
          });

          const detail = detailRes?.data?.data?.[0];
          return {
            ...hotel,
            overview_description: detail?.overview_description || hotel.description,
            description: detail?.overview_description || hotel.description,
            image: detail?.image || hotel.image,
            slug: detail?.slug || hotel.slug,
          };
        } catch (err) {
          console.warn(`Failed to fetch details for hotel ID ${hotel.id}`, err);
          return hotel;
        }
      });

      const enrichedHotels = await Promise.all(detailedHotelPromises);

      setHotels(enrichedHotels);
      setFilteredHotels(enrichedHotels);
    }
  } catch (err) {
    console.error("Failed to fetch hotel list", err);
  }
};


    useEffect(() => {
        fetchHotels();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = hotels.filter((hotel) =>
            (hotel.title || "").toLowerCase().includes(value) ||
            (hotel.description || "").toLowerCase().includes(value)
        );
        setFilteredHotels(filtered);
    };

    return (
        <>
            <MainHeader />
            <section className="hero-section-inner">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-100 inner-hero-image"
                    poster="/img/banner-thumbnail.png"
                >
                    <source src="/img/amritara-new-banner-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="inner-hero-content">
                    <div className="text-center">
                        <h2 className="inner-banner-heading">Hotels</h2>
                        <nav aria-label="breadcrumb" className="banner-breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href="/">Home</Link> <ChevronRight />
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Hotels
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

            <section className="about-us-page section-padding">
                <div className="container">
                    <div className="heading-style-1">
                        <h1 className="mb-4 text-center global-heading">Our Hotels</h1>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-md-12 text-center">
                            <h4 className="h5 mb-3">
                                At Amritara Hotels, we invite you on an extraordinary journey
                                where every moment is crafted to perfection.
                            </h4>
                            <p className="text-center">
                                Discover the best luxury hotels in India, offering heritage,
                                comfort, and top amenities. Book your stay with Amritara now!
                            </p>
                        </div>
                    </div>  
                </div>
            </section>


            <section className="hotel-list-box mb-5">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="searchbar position-relative">
                                <input
                                    type="text"
                                    className="form-control pe-0"
                                    placeholder="Search by city / hotel name..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <Search className="position-absolute top-50 end-0 translate-middle-y me-2" />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {(showAll ? filteredHotels : filteredHotels.slice(0, 4)).map((hotel) => (
                            <div key={hotel.id} className="col-md-6 mb-4">
                                <div className="hotel-card h-100 border-0 ">
                                    <Image
                                        src={hotel.image && hotel.image !== "" ? hotel.image : "" + NoImagePlaceholder}
                                        alt={hotel.title}
                                        className="card-img-top"
                                        width={800}
                                        height={250}
                                        style={{ objectFit: "cover" }}
                                    />
                                    <div className="hotel-card-body">
                                        <h5 className="card-title">{hotel.title}</h5>
                                        <p
                                            className="card-text"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    (hotel.description?.slice(0, 100) || "No description available") + "...",
                                            }}
                                        />
                                        <div className="cta-buttons-box">
                                            <Link href={`/hotels/${hotel.slug}`} className="explore-more-btn">
                                            Explore More
                                            </Link>
                                            <Link href="#" className="book-now-btn">
                                                Book Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredHotels.length > 4 && (
                            <div className="col-md-12 text-center mt-3">
                                <button
                                    className="primary-btns"
                                    onClick={() => setShowAll(!showAll)}
                                >
                                    {showAll ? "view Less" : "view More"}
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </section>

        </>
    );
}
