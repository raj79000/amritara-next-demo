"use client";
import { useEffect,useState } from "react";
import { getUserInfo } from "../../utilities/userInfo";
import { useRouter } from "next/navigation";

export default function VisitTracker() {
    
     // const [sessionData, setSessionData] = useState(null);
      const router = useRouter();
          async function postBookingWidged(rooms,mapping, isClose,ctaName,selectedPropertyId,sessionId) {
           const resp = await getUserInfo();
             //const sessionId = sessionStorage?.getItem("sessionId");
             const payload = {
             ctaName: ctaName,
             urls: window.location.href,
             cityId: "0",
             propertyId: selectedPropertyId?.toString() || "0",
             checkIn: "",
             checkOut: "",
             adults: "0",
             children: "0",
             rooms: "0",
             promoCode: "",
             ip: resp?.ip,
             sessionId: sessionId,
             deviceName: resp?.deviceInfo?.deviceName,
             deviceType: resp?.deviceInfo?.deviceOS == "Unknown" ? resp?.deviceInfo?.platform : resp?.deviceInfo?.deviceOS,
             roomsName: rooms?.RoomName,
             packageName: mapping?.MappingName,
             isCartOpen: mapping?.MappingName ? "Y": "N",
             isCartEdit: "N",
             isCartClick: "N",
             isClose: isClose ? "Y" : "N",
            }
               const response = await fetch(
                 `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/tracker/BookingWidged`,
                 {
                   method: "POST",
                   headers: {
                     "Content-Type": "application/json",
                   },
                   body: JSON.stringify( payload ),
                 }
               );
               const res = await response?.json();
           }
  useEffect(() => {
    const sesData = sessionStorage?.getItem("cityDropDown");
    
    const sessionId = sessionStorage?.getItem("sessionId");
       if(!sessionId){
         const guid = crypto.randomUUID();
        const offerTagIndex = Math.floor(Math.random() * 2);
        sessionStorage.setItem("sessionId",guid);
        sessionStorage.setItem("offerTagIndex",offerTagIndex);

         const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetCityList`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const res = await response.json();

        const cityDropDown = [];

        res?.data?.forEach((property) => {
          const label = property.cityName;
          const value = property.cityId;

          cityDropDown.push({ label, value });
        });
        sessionStorage.setItem("cityDropDown", JSON.stringify(cityDropDown));
        // setContentData(res || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if(!sesData){
    fetchData();
    }
        setTimeout(()=>{
          postBookingWidged("", "", false, "Guest Visit","",guid);
        },300)
       }
  }, []);

//   useEffect(() => {
//   const removableParams = ["search", "select-package", "pay-now"];
//   const url = new URL(window.location.href);
//   const params = url.searchParams;

//   // Track if we removed anything
//   let removed = false;

//   removableParams.forEach((param) => {
//     if (params.has(param)) {
//       params.delete(param);
//       removed = true;
//     }
//   });

//   if (removed) {
//     const newUrl =
//       params.toString().length > 0
//         ? `${url.pathname}?${params.toString()}`
//         : url.pathname;

//     router.replace(newUrl);
//   }
// }, [router]);

useEffect(() => {
  const removableParams = ["search", "select-package", "pay-now"];
  const url = new URL(window.location.href);
  const params = url.searchParams;

  let removed = false;
  removableParams.forEach((param) => {
    if (params.has(param)) {
      params.delete(param);
      removed = true;
    }
  });

  if (removed) {
    // Wait a tick so GTM can capture the original URL
    setTimeout(() => {
      const newUrl =
        params.toString().length > 0
          ? `${url.pathname}?${params.toString()}`
          : url.pathname;
      router.replace(newUrl);
    }, 500); // adjust delay
  }
}, [router]);


  return null; // nothing to render
}
