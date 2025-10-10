"use client";
import { useEffect, useMemo, useState } from "react";
import MainHeader from "@/app/Common/MainHeader";
import CommonMemberHeader from "../CommonMemberHeader";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

/** Convert "yyyy-mm-dd" to "dd-mm-yyyy" for API */
const toDMY = (val) => {
  if (!val) return "";
  const [y, m, d] = String(val).split("-");
  if (!y || !m || !d) return "";
  return `${d}-${m}-${y}`;
};

/** Safe number parse */
const toNum = (v, d = 0) => {
  const n = Number(String(v ?? "").replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : d;
};

/** Map a transaction row to the UI shape */
const mapTxn = (t = {}) => ({
  bookingDate:
    t.bookingDate ||
    t.BookingDate ||
    t.transactionDate ||
    t.TransactionDate ||
    "",

  property:
    t.propertyName ||
    t.PropertyName ||
    t.hotelName ||
    t.HotelName ||
    t.property ||
    "-",

  checkinDate: t.checkinDate || t.CheckinDate || t.checkInDate || "",
  checkoutDate: t.checkoutDate || t.CheckoutDate || t.checkOutDate || "",

  pointsEarned:
    toNum(t.pointsEarned ?? t.PointsEarned ?? t.EarnedPoints ?? t.points ?? 0),
  pointsRedeemed:
    toNum(t.pointsRedeemed ?? t.PointsRedeemed ?? t.RedeemedPoints ?? 0),
});

export default function MemberMyStaysPage() {
  const { user, token } = useAuth();

  const todayIso = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(todayIso);
  const [endDate, setEndDate] = useState(todayIso);
  const [submittedRange, setSubmittedRange] = useState({
    start: todayIso,
    end: todayIso,
  });

  const [stays, setStays] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (startDate && endDate && startDate > endDate) {
      // swap if user picked reversed range
      setSubmittedRange({ start: endDate, end: startDate });
      return;
    }
    setSubmittedRange({ start: startDate, end: endDate });
  };

  // Fetch transactions when range changes (and we have user + token)
  useEffect(() => {
    const fetchTxns = async () => {
      if (!user?.MemberId || !token) return;

      setFetching(true);
      setErrorMsg("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_MEMBERS_API}/Members/GetTransaction`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              MembershipId: user.MemberId,
              CheckinDate: toDMY(submittedRange.start),
              CheckoutDate: toDMY(submittedRange.end),
            }),
          }
        );

        const data = await res.json();
        // Expecting: { success, errorCode, result: [...] }
        if (data?.success === true && Number(data?.errorCode) === 0) {
          const rows = Array.isArray(data.result) ? data.result : [];
          setStays(rows.map(mapTxn));
        } else {
          setStays([]);
          setErrorMsg(data?.result || data?.error || "Failed to fetch stays.");
        }
      } catch (err) {
        console.error("GetTransaction error:", err);
        setStays([]);
        setErrorMsg("Something went wrong while fetching your stays.");
      } finally {
        setFetching(false);
      }
    };

    fetchTxns();
  }, [submittedRange, user?.MemberId, token]);

  // You were filtering again on the client; since API already filters by range,
  // just display `stays` directly. (Keep `filteredStays` if you want extra client filters.)
  const filteredStays = stays;

  const fmt = (isoOrDmy) => {
    if (!isoOrDmy) return "-";
    // try ISO first
    const maybeIso = new Date(isoOrDmy);
    if (!Number.isNaN(maybeIso.getTime())) {
      const dd = String(maybeIso.getDate()).padStart(2, "0");
      const mm = String(maybeIso.getMonth() + 1).padStart(2, "0");
      const yyyy = maybeIso.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
    // if it's already dd-mm-yyyy, return as-is
    if (/^\d{2}-\d{2}-\d{4}$/.test(isoOrDmy)) return isoOrDmy;
    return String(isoOrDmy);
  };

  // Styles (unchanged)
  const boxStyle = {
    background: "#fff",
    borderRadius: "12px",
    padding: "18px 18px 8px",
    boxShadow: "0 2px 18px rgba(0,0,0,0.06)",
  };
  const headerCellStyle = {
    background: "#a6823d",
    color: "#fff",
    fontWeight: 700,
    textTransform: "none",
    letterSpacing: "0.2px",
    padding: "12px 14px",
    borderRight: "2px solid #d3bb86",
    whiteSpace: "nowrap",
  };
  const filterWrapStyle = {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    alignItems: "center",
  };
  const dateInputStyle = {
    background: "#fff",
    border: "1px solid #e8e0cf",
    borderRadius: "10px",
    padding: "10px 12px",
    minWidth: "180px",
    color: "#333",
    outline: "none",
    boxShadow: "0 1px 0 rgba(0,0,0,0.02) inset",
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
  };
  const tableWrapStyle = {
    overflowX: "auto",
    borderRadius: "12px",
    marginTop: "18px",
    border: "1px solid #efe7d6",
  };
  const emptyRowStyle = {
    textAlign: "center",
    padding: "18px 10px",
    color: "#2b2b2b",
    letterSpacing: "2px",
    fontSize: "13px",
    fontWeight: 600,
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
              {/* Title row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h5 style={{ margin: 0, fontWeight: 700, color: "#6a5430" }}>
                  Past Stays
                </h5>

                {/* Show stays count for the submitted range */}
                <div style={{ fontWeight: 700, color: "#6a5430" }}>
                  {fetching ? "Loading…" : `Stays: ${filteredStays.length}`}
                </div>
              </div>

              {/* Filters */}
              <form onSubmit={onSubmit} style={filterWrapStyle}>
                <div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={dateInputStyle}
                    aria-label="Start Date"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={dateInputStyle}
                    aria-label="End Date"
                  />
                </div>
                <button type="submit" style={submitBtnStyle} disabled={fetching}>
                  {fetching ? "Please wait…" : "SUBMIT"}
                </button>
              </form>

              {/* Error */}
              {errorMsg && (
                <div className="mt-3" style={{ color: "#b00020", fontWeight: 600 }}>
                  {errorMsg}
                </div>
              )}

              {/* Table */}
              <div style={tableWrapStyle}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ ...headerCellStyle, borderTopLeftRadius: "10px" }}>
                        Booking Date
                      </th>
                      <th style={headerCellStyle}>Property</th>
                      <th style={headerCellStyle}>Checkin Date</th>
                      <th style={headerCellStyle}>Checkout Date</th>
                      <th style={headerCellStyle}>Points Earned</th>
                      <th style={{ ...headerCellStyle, borderTopRightRadius: "10px" }}>
                        Points Redeemed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStays.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={emptyRowStyle}>
                          {fetching ? "Loading…" : "THERE ARE NO POINTS TO DISPLAY AS OF NOW."}
                        </td>
                      </tr>
                    ) : (
                      filteredStays.map((s, idx) => (
                        <tr
                          key={`${s.bookingDate}-${s.property}-${idx}`}
                          style={{ background: idx % 2 ? "#fffaf1" : "#fff" }}
                        >
                          <td style={{ padding: "12px 14px", borderTop: "1px solid #f0e7d8" }}>
                            {fmt(s.bookingDate)}
                          </td>
                          <td style={{ padding: "12px 14px", borderTop: "1px solid #f0e7d8" }}>
                            {s.property || "-"}
                          </td>
                          <td style={{ padding: "12px 14px", borderTop: "1px solid #f0e7d8" }}>
                            {fmt(s.checkinDate)}
                          </td>
                          <td style={{ padding: "12px 14px", borderTop: "1px solid #f0e7d8" }}>
                            {fmt(s.checkoutDate)}
                          </td>
                          <td style={{ padding: "12px 14px", borderTop: "1px solid #f0e7d8" }}>
                            {s.pointsEarned ?? 0}
                          </td>
                          <td style={{ padding: "12px 14px", borderTop: "1px solid #f0e7d8" }}>
                            {s.pointsRedeemed ?? 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
