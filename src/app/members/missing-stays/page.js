"use client";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useEffect, useMemo, useState } from "react";
import MainHeader from "@/app/Common/MainHeader";
import CommonMemberHeader from "../CommonMemberHeader";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";


/** yyyy-mm-dd -> dd-mm-yyyy for API */
const toDMY = (date) => {
  if (!date) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export default function MemberMissingStaysPage() {
  const { user, token } = useAuth();

  const todayIso = new Date().toISOString().slice(0, 10);
  const [hotel, setHotel] = useState("");              // propertyId (string/number)

  const [query, setQuery] = useState("");

  // hotels list
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [hotelsError, setHotelsError] = useState("");

  // submit
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    // fetch hotels for dropdown
    const fetchHotels = async () => {
      setLoadingHotels(true);
      setHotelsError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`,
          { method: "GET" }
        );
        const data = await res.json();
        const arr = Array.isArray(data?.data) ? data.data : [];
        // Map to { id, name }
        const mapped = arr.map((p) => ({
          id: p.propertyId,
          name: p.propertyName,
        }));
        setHotels(mapped);
      } catch (e) {
        console.error("GetPropertyList error:", e);
        setHotelsError("Failed to load hotels.");
      } finally {
        setLoadingHotels(false);
      }
    };

    fetchHotels();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user?.MemberId) {
      alert("You must be logged in to submit a missing stay request.");
      return;
    }
    if (!hotel) {
      alert("Please select a hotel.");
      return;
    }
    if (!startDate || !endDate) {
      alert("Please select both dates.");
      return;
    }

    // normalize range (swap if reversed)
    let fromDate = startDate;
    let toDate = endDate;
    if (fromDate > toDate) [fromDate, toDate] = [toDate, fromDate];

    const fromDMY = toDMY(fromDate);
    const toDMYstr = toDMY(toDate);

    const payload = {
      QueriesFor: "MissingStay",
      MembershipId: user.MemberId,
      QueriesType: "Program",
      Hotel: String(hotel), // propertyId
      Queries:
        `Missing stay request from ${fromDMY} to ${toDMYstr}.\n\n` +
        (query?.trim() ? `Notes: ${query.trim()}` : "Notes: (none)"),
    };

    try {
      setSubmitting(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_MEMBERS_API}/Members/Queries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data?.success && Number(data?.errorCode) === 0) {
        alert("Your missing stay request has been submitted successfully.");
        setHotel("");
        setQuery("");
        // keep dates as the user set them
      } else {
        alert(data?.result || data?.error || "Failed to submit missing stay request.");
      }
    } catch (err) {
      console.error("Submit MissingStay error:", err);
      alert("Something went wrong while submitting your request.");
    } finally {
      setSubmitting(false);
    }
  };

  // styles (same look you used)
  const boxStyle = {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px 28px",
    boxShadow: "0 2px 18px rgba(0,0,0,0.06)",
  };
  const titleStyle = {
    fontSize: "26px",
    fontWeight: 600,
    marginBottom: "16px",
    color: "#6a321d",
    letterSpacing: "3px",
  };
  const descStyle = {
    fontSize: "15px",
    marginBottom: "22px",
    color: "#443e3a",
    lineHeight: "1.6",
  };
  const sectionStyle = {
    fontSize: "15px",
    color: "#433b34",
    marginBottom: "20px",
  };
  // const formWrapStyle = {
  //   display: "flex",
  //   flexWrap: "wrap",
  //   gap: "16px",
  //   alignItems: "flex-start",
  //   justifyContent: "space-between",
  // };
  const inputStyle = {
    background: "#fff",
    border: "1px solid #e8e0cf",
    borderRadius: "10px",
    padding: "10px 12px",
    minWidth: "180px",
    color: "#333",
    outline: "none",
    flex: "1 1 180px",
  };
  const textAreaStyle = {
    ...inputStyle,
    width: "100%",
  };
  const submitBtnStyle = {
    background: "#7b2d14",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 22px",
    fontWeight: 700,
    letterSpacing: "0.2px",
    cursor: "pointer",
    textAlign: "center",
  };

  return (
    <>
      <MainHeader />
      <section
        className="main-dashboard-page"
        style={{ minHeight: "60vh", background: "#f8f6f2", paddingBottom: "50px" }}
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
          <div className="members-main-top-nav mb-4">
            <CommonMemberHeader />

            <div className="member-data-box-main mt-4" style={boxStyle}>
              <div className="row">
                <div className="col-md-6">
                  <div className="missing-stays-member-content">
                    <h2 style={titleStyle}>Missing Stays</h2>
                    <p style={descStyle}>
                      If we have missed points pertaining to any of your stays with us,
                      please share the details below and we will credit the due points to your account.
                    </p>

                    <div style={sectionStyle}>
                      <strong>How it works:</strong> <br />
                      You can also write to{" "}
                      <a href="mailto:reservations@amritara.co.in" style={{ color: "#7b2d14" }}>
                        reservations@amritara.co.in
                      </a>{" "}
                      or call{" "}
                      <a href="tel:+919319296392" style={{ color: "#7b2d14", fontWeight: "600" }}>
                        +91 9319296392
                      </a>. Share details within 6 months of the stay. We’ll revert in three days.
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="missing-stays-form">
                    <form onSubmit={onSubmit} >
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <select
                            value={hotel}
                            onChange={(e) => setHotel(e.target.value)}
                            style={inputStyle}
                            required
                            className="w-100"
                          >
                            <option value="">
                              {loadingHotels ? "Loading hotels…" : "Please select hotel"}
                            </option>
                            {hotelsError && <option value="" disabled>{hotelsError}</option>}
                            {hotels.map((h) => (
                              <option key={h.id} value={h.id}>
                                {h.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6 mb-3">
                          <DatePicker
                            selected={startDate}
                            onChange={(d) => setStartDate(d)}
                            placeholderText="Check-in date"
                            dateFormat="dd-MM-yyyy"
                            maxDate={new Date()}
                            isClearable
                            customInput={<input style={inputStyle} />}
                          />
                        </div>
                        <div className="col-md-6 mb-3"
                        >
                          <DatePicker
                            selected={endDate}
                            onChange={(d) => setEndDate(d)}
                            placeholderText="Checkout date"
                            dateFormat="dd-MM-yyyy"
                            maxDate={new Date()}
                            isClearable
                            customInput={<input style={inputStyle} />}
                          />

                        </div>
                      </div>
                      <div className="col-md-12 mb-3">
                        <textarea
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          style={textAreaStyle}
                          placeholder="Your message (e.g. booking number, guest name, etc.)"
                          required
                        />
                      </div>
                      <div className="text-center w-100">
                        <button type="submit" style={submitBtnStyle} disabled={submitting}>
                          {submitting ? "Submitting…" : "SUBMIT"}
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
