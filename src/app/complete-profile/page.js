"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MainHeader from "../Common/MainHeader";
import "./CompleteProfile.css"

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, saveProfileAndRefresh } = useAuth();

  // read identity used at OTP time
  const pendingIdentity = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("pendingIdentity") || "{}"); }
    catch { return {}; }
  }, []);

  const loggedMobile = pendingIdentity?.mobile || "";
  const loggedEmail = pendingIdentity?.email || "";
  const loggedPrefix = pendingIdentity?.mobilePrefix || "+91";

  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user, router]);

  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const baseUser = user || {};
  const [form, setForm] = useState({
    FirstName: baseUser.FirstName || "",
    LastName: baseUser.LastName || "",
    MobilePrifix: (loggedMobile ? loggedPrefix : baseUser.MobilePrifix) || "+91",
    MobileNo: loggedMobile || baseUser.MobileNo || "",
    EmailId: loggedEmail || baseUser.EmailId || "",
    City: baseUser.City || "",
    StateCode: baseUser.StateCode || "",
    Country: baseUser.Country || "India",
    PrivacyPolicyAcceptance: "N",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agree) {
      setError("please check T&C and privacy policy for profile completion");
      return;
    }

    try {
      const payload = { ...form, PrivacyPolicyAcceptance: "Y" };
      await saveProfileAndRefresh(payload);
      sessionStorage.removeItem("pendingIdentity");
      alert("Profile completed successfully.");
      router.replace("/members/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
    }
  };

  return (
    <>
      <MainHeader />
      <section className="complete-profile-section" style={{ background: "#f8f6f2", minHeight: "100vh" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7">
<div className="form-card-signup">
            <div className="card-body p-4">
              <h3 className="mb-1 text-center mb-3 complete-p-title">Complete Profile</h3>

              <form onSubmit={onSubmit} className="row g-3">
                <div className="col-md-6">
                 
                  <input name="FirstName" value={form.FirstName} onChange={onChange} className="form-control" placeholder="First Name" required />
                </div>
                <div className="col-md-6">
                  
                  <input name="LastName" value={form.LastName} onChange={onChange} className="form-control" placeholder="Last Name" required />
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-2">
                    <select
                      name="MobilePrifix"
                      className="form-select"
                      style={{ maxWidth: 130 }}
                      value={form.MobilePrifix}
                      onChange={onChange}
                      disabled={!!loggedMobile}
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
                      readOnly={!!loggedMobile}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                 
                  <input
                    type="email"
                    name="EmailId"
                    value={form.EmailId}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Email"
                    required
                    readOnly={!!loggedEmail}
                  />
                </div>

                <div className="col-md-6">
                  <select name="Country" value={form.Country} onChange={onChange} className="form-select" required>
                    <option value="India">India</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <input name="City" value={form.City} onChange={onChange} className="form-control" placeholder="City" />
                </div>

                <div className="col-md-6">
                  <input name="StateCode" value={form.StateCode} onChange={onChange} className="form-control" placeholder="State Code" />
                </div>

                <div className="col-12 mt-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="agree1"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                    />
                    <label className="form-check-label ms-2 form-check-label-for-su" htmlFor="agree">
                      I have read and agree to the{" "}
                      <a href="/privacy-policy" className="text-decoration-none">Privacy Policy</a> and{" "}
                      <a href="/term-and-condition" className="text-decoration-none">Terms &amp; Conditions</a>.
                    </label>
                  </div>
                  {error && <div className="text-danger mt-2">{error}</div>}
                </div>

                <div className="col-12 mt-3 text-center">
                  <button className="btn btn-primary px-4" type="submit">Submit</button>
                  {/* <button type="button" className="btn btn-outline-secondary" onClick={() => router.replace("/signin")}>
                    Cancel
                  </button> */}
                </div>
              </form>

            </div>
          </div>
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
}
