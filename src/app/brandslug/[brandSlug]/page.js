import React from "react";
import CityHotelClient from "./CityHotelClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function CityHotelPage({ params }) {
  // const brand_slug = params.brand_slug;
 const resolvedParams = await params;
  const { brand_slug } = resolvedParams;

  let hotelData = {
    city_by_hotels: [],
    city_faqs: [],
    city_data: [],
    near_by_hotel_data: [],
  };

  // try {
  //   const response = await axios.post(`${API_BASE_URL}/hotellistbycity`, {
  //     url_slug: brand_slug,
  //   });
  //   hotelData = response.data;
  // } catch (error) {
  //   console.error("Error fetching hotel data:", error);
  // }

  return (
    <>

      <CityHotelClient hotelData={hotelData} brand_slug={brand_slug} />
    </>
  );
}
