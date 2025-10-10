"use client";
import { useEffect, useState } from "react";
import ZoneTabs from "./ZoneTabs";

async function getZoneList() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetZoneList`);
  return response.json();
}

export default function ZonesList() {
  const [zoneList, setZoneList] = useState(null);
  useEffect(()=>{
    async function fetchData() {
  const data = await getZoneList();
  setZoneList(data);}
  fetchData();
  },[])
  
  return <ZoneTabs zones={zoneList?.data || []} />;
}
