"use client";
import { MapPinCheckInside } from "lucide-react";
import React, { useEffect, useState } from "react";

const NearbyPlaces = ({ propertyId }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (!propertyId) return;

    const fetchNearbyPlaces = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetNearbyPlaces?propertyId=${propertyId}`,
          { cache: "no-store" }
        );
        const json = await res.json();

        if (json.errorMessage === "success" && json.data?.length > 0) {
          setPlaces(json.data);
          setHasData(true);
        } else {
          setHasData(false); // no records found
        }
      } catch (err) {
        console.error("NearbyPlaces API error:", err);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyPlaces();
  }, [propertyId]);

  if (loading) return null; 
  if (!hasData) return null; 

  return (
    <section className="nearby-places-property">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h3 className="text-center pb-3">Nearby Places</h3>
            <div className="nearbyplaces-table">
              <table
                className="table table-striped text-center table-hover main-table-border"
                border="1"
                cellPadding="8"
                cellSpacing="0"
                style={{ borderCollapse: "collapse", width: "100%" }}
              >
                <thead className="thead-dark">
                  <tr>
                    <th>Destination</th>
                    <th>Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {places.map((place) => (
                    <tr key={place.id}>
                      <td>
                        <MapPinCheckInside
                          color="#851d29"
                          size={20}
                          className="me-2"
                        />
                        {place.destination.trim()}
                      </td>
                      <td>{place.distance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NearbyPlaces;
