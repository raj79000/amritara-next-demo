"use client";
import { LocateIcon, MapPinCheck, MapPinCheckInside, MoveRight } from "lucide-react";
import React, { useEffect, useState } from "react";

const NearbyPlaces = ({ propertyId }) => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!propertyId) return;

        const fetchNearbyPlaces = async () => {
            try {
                const res = await fetch(
                    `http://loyaltypulsedemo.ownyourcustomers.in/cmsapi/property/GetNearbyPlaces?propertyId=${propertyId}`,
                    { cache: "no-store" }
                );
                const json = await res.json();

                if (json.errorMessage === "success") {
                    setPlaces(json.data || []);
                } else {
                    setError("Failed to load nearby places");
                }
            } catch (err) {
                console.error("NearbyPlaces API error:", err);
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchNearbyPlaces();
    }, [propertyId]);

    if (loading) return <p>Loading nearby places...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <>
            <section className="nearby-places-property">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <h3 className="text-center pb-3">Nearby Places</h3>
                            {places.length === 0 ? (
                                <p>No nearby places found.</p>
                            ) : (
                                <div className="nearbyplaces-table">
                                <table className="table table-striped text-center table-hover main-table-border"
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
                                        {places.map((place, index) => (
                                            <tr key={place.id}>
                                                <td><MapPinCheckInside color="#851d29" size={20}></MapPinCheckInside> {place.destination.trim()}</td>
                                                {/* <td><MoveRight></MoveRight> </td> */}
                                                <td>{place.distance}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            )}
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
};

export default NearbyPlaces;
