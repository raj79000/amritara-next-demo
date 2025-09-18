import { postAPI } from "./api";

export async function getUnforgettableByHotel(propertyId) {
  return await postAPI("getunforgettablebyehotel", {
    property_id: Number(propertyId),
  });
}