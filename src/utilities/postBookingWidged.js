
//import { getUserInfo } from "../utilities/userInfo";

export async function postBookingWidged(rooms,mapping, isClose,ctaName, 
  ApiName,ApiUrl,ApiStatus,ApiErrorCode,ApiMessage,selectedRoom,fromDate,toDate,selectedPropertyId) {
//   const resp = await getUserInfo();

//     const sessionId = sessionStorage?.getItem("sessionId");ionId(resp?.guid);
//   // }
//     const totalAdults = selectedRoom?.reduce(
//       (sum, room) => sum + (room?.adults || 0),
//       0
//     );
//     const totalChildren = selectedRoom?.reduce(
//       (sum, room) => sum + (room?.children || 0),
//       0
//     );
//     const totalRooms = selectedRoom?.length;
//     //console.log("data pathname",data)
//     const payload = {
//     ctaName: ctaName,
//     urls: window.location.href,
//     cityId: 0,
//     propertyId: selectedPropertyId?.toString(),
//     checkIn: fromDate,
//     checkOut: toDate,
//     adults: totalAdults,
//     children: totalChildren,
//     rooms: totalRooms,
//     promoCode: "",
//     ip: resp?.ip,
//     sessionId: sessionId,
//     deviceName: resp?.deviceInfo?.deviceName,
//     deviceType: resp?.deviceInfo?.deviceOS == "Unknown" ? resp?.deviceInfo?.platform : resp?.deviceInfo?.deviceOS,
//     roomsName: rooms?.RoomName,
//     packageName: mapping?.MappingName,
//     isCartOpen: mapping?.MappingName ? "Y": "N",
//     isCartEdit: "N",
//     isCartClick: "N",
//     isClose: isClose ? "Y" : "N",
//     ApiName: ApiName ?? "",
//     ApiUrl: ApiUrl ?? "",
//     ApiStatus: ApiStatus ?? "",
//     ApiErrorCode: ApiErrorCode ?? "",
//     ApiMessage: ApiMessage ?? ""
//    }
//       const response = await fetch(
//         "https://clarkscms.cinuniverse.com/Api/tracker/BookingWidged",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify( payload ),
//         }
//       );
//       const res = await response?.json();
}

