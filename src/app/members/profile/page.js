"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import MainHeader from "@/app/Common/MainHeader";
import { getStates, getCities } from "@/app/members/StateCityData";
import CommonMemberNav from "../CommonMemberNav";
import CommonMemberHeader from "../CommonMemberHeader";
import Image from "next/image";

const toISOFromDMY = (v) => {
  // Accepts "23-Sep-2025", "23-09-2025", "23/09/2025", or ISO already
  if (!v) return "";
  const s = String(v).trim();

  // Already ISO yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // dd-mon-yyyy (e.g., 23-Sep-2025)
  const monMap = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
  };
  const m1 = s.match(/^(\d{1,2})[-/ ]([A-Za-z]{3})[-/ ](\d{4})$/);
  if (m1) {
    const d = m1[1].padStart(2, "0");
    const m = String(monMap[m1[2].toLowerCase()]).padStart(2, "0");
    const y = m1[3];
    return `${y}-${m}-${d}`;
  }

  // dd-mm-yyyy or dd/mm/yyyy
  const m2 = s.match(/^(\d{1,2})[-/ ](\d{1,2})[-/ ](\d{4})$/);
  if (m2) {
    const d = m2[1].padStart(2, "0");
    const m = m2[2].padStart(2, "0");
    const y = m2[3];
    return `${y}-${m}-${d}`;
  }

  // Fallback: let browser try to parse; if valid, format to ISO
  const dt = new Date(s);
  if (!Number.isNaN(dt.getTime())) {
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return "";
};

export default function MemberProfilePage() {
  const router = useRouter();
  const { user, saveProfileAndRefresh } = useAuth();

  // guard route
  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user, router]);

  // state lists
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // form
  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    MobilePrifix: "+91",
    MobileNo: "",
    EmailId: "",
    Country: "India",
    State: "",
    City: "",
    Gender: "",
    Address: "",
    DateOfBirth: "",         // ISO for input[type=date]
    WeddingAnniversary: "",  // ISO for input[type=date]
  });

  // hydrate states list once
  useEffect(() => {
    setStates(getStates());
  }, []);

  // when user arrives/changes, prefill form + dependent cities
  useEffect(() => {
    if (!user) return;

    const isoDob = toISOFromDMY(user?.DateOfBirth || "");
    const isoAnn = toISOFromDMY(user?.WeddingAnniv || user?.WeddingAnniversary || "");

    const next = {
      FirstName: user?.FirstName || "",
      LastName: user?.LastName || "",
      MobilePrifix: user?.MobilePrifix || "+91",
      MobileNo: user?.MobileNo || "",
      EmailId: user?.EmailId || "",
      Country: user?.Country || "India",
      StateCode: user?.StateCode || "",
      City: user?.City || "",
      DateofBirth: user?.DateofBirth || "",
      WeddingAnniversary: user?.WeddingAnniversary || "",
      Gender: user?.Gender || "",
      Address: user?.Address || "",             // ISO
    };

    setForm(next);
    // load city list for the preselected state
    if (next.State) setCities(getCities(next.State));
    else setCities([]);
  }, [user]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onChangeState = (e) => {
    const stateName = e.target.value;
    const newCities = stateName ? getCities(stateName) : [];
    setForm((f) => ({ ...f, State: stateName, City: "" }));
    setCities(newCities);
  };

  const onChangeCity = (e) => {
    setForm((f) => ({ ...f, City: e.target.value }));
  };

  const [saving, setSaving] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // send exactly the keys AuthContext expects:
      await saveProfileAndRefresh({
        // FirstName: form.FirstName,
        // LastName: form.LastName,
        // MobilePrifix: form.MobilePrifix,
        // MobileNo: form.MobileNo,
        // EmailId: form.EmailId,
        // Country: form.Country,
        // State: form.State,                 // name string
        // City: form.City,
        // Gender: form.Gender,
        // Address: form.Address,
        // DateOfBirth: form.DateOfBirth,     // ISO string; context converts to dd-mm-yyyy
        // WeddingAnniversary: form.WeddingAnniversary,
        FirstName: user?.FirstName || "",
        LastName: user?.LastName || "",
        MobilePrifix: user?.MobilePrifix || "+91",
        MobileNo: user?.MobileNo || "",
        EmailId: user?.EmailId || "",
        Country: user?.Country || "India",
        StateCode: user?.StateCode || "",
        City: user?.City || "",
        DateofBirth: user?.DateofBirth || "",
        WeddingAnniversary: user?.WeddingAnniversary || "",
        Gender: user?.Gender || "",
        Address: user?.Address || "",
      });
      alert("Profile updated.");
      router.replace("/members/dashboard");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const todayISO = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  return (
    <>

      <MainHeader />
      <section className="main-dashboard-page" style={{ minHeight: "60vh" }}>


        <div className="atithyam-logo-div text-center">
          <Image src="/rewards/atithyam_logo.png" className="atithyam-logo-dashboard" height={150} width={200} alt="atithyam logo" />
        </div>



        <div className="container mt-4">
          <div className="members-main-top-nav">
            <CommonMemberHeader></CommonMemberHeader>

            <div className="member-data-box-main mt-4">
              <section className="edit-profile-page-main-sec pt-3" style={{ background: "#f8f6f2", minHeight: "100vh" }}>
                {/* <CommonMemberNav></CommonMemberNav> */}
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-md-7">
                      <div className="card shadow-sm border-0 rounded-4 mt-4">
                        <div className="card-body p-4">
                          <h2 className="mb-1 members-main-heading">Edit Profile</h2>

                          <form onSubmit={onSubmit} className="row g-3">
                            {/* Name */}
                            <div className="col-md-6">
                              <label className="form-label">First Name</label>
                              <input
                                name="FirstName"
                                value={form.FirstName}
                                onChange={onChange}
                                className="form-control"
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Last Name</label>
                              <input
                                name="LastName"
                                value={form.LastName}
                                onChange={onChange}
                                className="form-control"
                                required
                              />
                            </div>

                            {/* Phone (read-only if already present) */}
                            <div className="col-md-6">
                              <label className="form-label">Phone No.</label>
                              <div className="d-flex gap-2">
                                <select
                                  name="MobilePrifix"
                                  className="form-select"
                                  style={{ maxWidth: 130 }}
                                  value={form.MobilePrifix}
                                  onChange={onChange}
                                  disabled={!!user?.MobileNo}
                                >
                                  <option value="+91">+91</option>
                                </select>
                                <input
                                  name="MobileNo"
                                  className="form-control"
                                  value={form.MobileNo}
                                  onChange={onChange}
                                  placeholder="Phone No"
                                  required
                                  readOnly={!!user?.MobileNo}
                                />
                              </div>
                            </div>

                            {/* Email (read-only if already present) */}
                            <div className="col-md-6">
                              <label className="form-label">Email</label>
                              <input
                                type="email"
                                name="EmailId"
                                value={form.EmailId}
                                onChange={onChange}
                                className="form-control"
                                placeholder="name@example.com"
                                required
                                readOnly={!!user?.EmailId}
                              />
                            </div>

                            {/* Country / State / City */}
                            <div className="col-md-4">
                              <label className="form-label">Country</label>
                              <select name="Country" value="India" className="form-select" disabled>
                                <option value="India">India</option>
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">State</label>
                              <select
                                name="State"
                                className="form-select"
                                value={form.StateCode}
                                onChange={onChangeState}
                              >
                                <option value="">Select State</option>
                                {states.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">City</label>
                              <select
                                name="City"
                                className="form-select"
                                value={form.City}
                                onChange={onChangeCity}
                              >
                                <option value="">Select City</option>
                                {cities.map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>

                            {/* Extra fields */}
                            <div className="col-md-4">
                              <label className="form-label">Gender</label>
                              <select
                                name="Gender"
                                value={form.Gender}
                                onChange={onChange}
                                className="form-select"
                              >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">Date of Birth</label>
                              <input
                                type="date"
                                name="DateofBirth"
                                value={form.DateofBirth || ""}
                                onChange={onChange}
                                className="form-control"
                                max={todayISO}
                              />
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">Wedding Anniversary</label>
                              <input
                                type="date"
                                name="WeddingAnniversary"
                                value={form.WeddingAnniversary}
                                onChange={onChange}
                                className="form-control"
                                max={todayISO}
                              />
                            </div>

                            <div className="col-md-12">
                              <label className="form-label">Address</label>
                              <textarea
                                name="Address"
                                value={form.Address}
                                onChange={onChange}
                                className="form-control"
                                rows="2"
                              />
                            </div>

                            {/* Actions */}
                            <div className="col-12 d-flex gap-2 mt-3">
                              <button className="btn btn-primary px-4" type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                              </button>
                              <button type="button" className="btn btn-outline-secondary" onClick={() => router.back()}>
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

          </>
          );
}
