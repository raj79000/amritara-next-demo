import ZoneTabs from "./ZoneTabs";

async function getZoneList() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetZoneList`);
  return response.json();
}

export default async function ZonesList() {
  const data = await getZoneList();
  return <ZoneTabs zones={data?.data || []} />;
}
