
// export async function generateMetadata({ params }) {

import InnerFooterPage from "../Components/InnerFooterPage";

  
//   const { city_slug } = params;


//   const getCityData = async () => {
//     try {
//       const res = await fetch('https://uat.lemontreehotels.com/hotellistbycity', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ url_slug: city_slug }),
//         cache: 'no-store', // always fetch fresh data
//       });

//       if (!res.ok) {
//         throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
//       }

//       const data = await res.json().catch(() => null);
//       return data;
//     } catch (error) {
//       console.error('Metadata fetch error:', error);
//       return null;
//     }
//   };

//   const result = await getCityData();
//   const cityData = result?.city_data?.[0] || {};

//   return {
//     metadataBase: new URL('https://uat.lemontreehotels.com/'),
//     alternates: {
//       canonical: `/${city_slug}`,
//     },
//     title: cityData.title || 'Lemon Tree Hotels',
//     description: cityData.meta_description || '',
//     keywords: cityData.meta_keyword || '',
//   };
// }

// Layout wrapper for city hotel page
export default async function CityHotelPageLayout({ children }) {
  return (
    <>
      {children}
      {/* <InnerFooterPage/> */}
    </>
  );
}
