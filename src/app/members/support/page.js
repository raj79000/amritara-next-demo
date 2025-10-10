"use client";
import { useState, useEffect } from "react";
import MainHeader from "@/app/Common/MainHeader";
import CommonMemberHeader from "../CommonMemberHeader";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function MemberSupportPage() {
  const [queryType, setQueryType] = useState("");
  const [hotel, setHotel] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [hotels, setHotels] = useState([]);   // ⬅ store fetched hotels

  const { user, token } = useAuth();

  // 🔹 Fetch hotels on component mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ⬅ API might also need token
            },
          }
        );
        const data = await res.json();
        if (Array.isArray(data?.data)) {
          setHotels(data.data);
        }
      } catch (err) {
        console.error("Error fetching hotels:", err);
      }
    };

    if (token) fetchHotels();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.MemberId) {
      alert("You must be logged in to submit a query.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_MEMBERS_API}/Members/Queries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            QueriesFor: "Other",
            MembershipId: user.MemberId,
            QueriesType: queryType,
            Hotel: hotel, // ⬅ propertyId selected
            Queries: userQuery,
          }),
        }
      );

      const data = await res.json();
      console.log("[SubmitQuery] response:", data);

      if (data?.success && Number(data?.errorCode) === 0) {
        alert("Your query has been submitted successfully!");
        setQueryType("");
        setHotel("");
        setUserQuery("");
      } else {
        alert(data?.result || data?.error || "Failed to submit query");
      }
    } catch (err) {
      console.error("Error submitting query:", err);
      alert("Something went wrong while submitting your query.");
    }
  };

  return (
    <>
      <MainHeader />

      <section
        className="main-dashboard-page"
        style={{
          minHeight: "60vh",
          background: "#f8f6f2",
          paddingBottom: "50px",
        }}
      >
        <div className="atithyam-logo-div text-center">
          <Image
            src="/rewards/atithyam_logo.png"
            className="atithyam-logo-dashboard"
            height={150}
            width={200}
            alt="atithyam logo"
          />
        </div>
        <div className="container mt-4">
          {/* Top Navigation */}
          <div className="members-main-top-nav mb-4">
            <CommonMemberHeader />

            <div className="member-data-box-main mt-4">
              <div className="row">
                <div className="col-md-6">
                  {/* Contact Info Section */}
                  <div className="contact-info-members mb-4">
                    <h2 style={{ color: "#5C2E12", marginBottom: "20px" }}>
                      Contact Us
                    </h2>
                    <p>
                      <strong>E-mail:</strong> atithyam@amritara.co.in
                    </p>
                    <p>
                      <strong>Phone:</strong> +91 69340804
                    </p>
                    <p>
                      <strong>Address:</strong> Kausalya Park, Block L1,
                      Padmini Enclave, Hauz Khas, New Delhi, Delhi 110016
                    </p>
                    <p>
                      <strong>Website:</strong> www.amritara.co.in
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="support-form-members">
                    <form
                      className="p-4 rounded-4 shadow-sm"
                      style={{
                        backgroundColor: "#fff",
                        maxWidth: "700px",
                        margin: "0 auto",
                      }}
                      onSubmit={handleSubmit}
                    >
                      <div className="mb-3 text-center">
                        <button
                          type="button"
                          className="btn"
                          style={{
                            background:
                              "linear-gradient(to right, #b58973, #a67c52)",
                            color: "#fff",
                            borderRadius: "30px",
                            padding: "10px 40px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          }}
                        >
                          Other Queries
                        </button>
                      </div>

                      <div className="mb-3">
                        <select
                          className="form-select"
                          value={queryType}
                          onChange={(e) => setQueryType(e.target.value)}
                          required
                        >
                          <option value="">Please select your Query</option>
                          <option value="Program">Program Query</option>
                          <option value="Redemptions">Redemptions Query</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <select
                          className="form-select"
                          value={hotel}
                          onChange={(e) => setHotel(e.target.value)}
                          required
                        >
                          <option value="">Please select hotel</option>
                          {hotels.map((h) => (
                            <option key={h.propertyId} value={h.propertyId}>
                              {h.propertyName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <textarea
                          className="form-control"
                          placeholder="Your Query"
                          value={userQuery}
                          onChange={(e) => setUserQuery(e.target.value)}
                          required
                        ></textarea>
                      </div>

                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn"
                          style={{
                            backgroundColor: "#b58973",
                            color: "#fff",
                            padding: "10px 40px",
                            borderRadius: "8px",
                          }}
                        >
                          SUBMIT
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
