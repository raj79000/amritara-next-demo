import { postAPI } from "./api";

export async function getUnforgettableHotelList() {
  return await postAPI("getunforgettablelist", {});
}