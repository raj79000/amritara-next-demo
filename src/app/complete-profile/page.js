"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, saveProfileAndRefresh } = useAuth();

  // Read identity used at OTP time
  const pendingIdentity = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("pendingIdentity") || "{}"); }
    catch { return {}; }
  }, []);

  const loggedMobile = pendingIdentity?.mobile || "";
  const loggedEmail = pendingIdentity?.email || "";
  const loggedPrefix = pendingIdentity?.mobilePrefix || "+91";

  // If no user (e.g., direct hit), send back to sign-in
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
      const payload = {
        ...form,
        PrivacyPolicyAcceptance: "Y",
      };
      await saveProfileAndRefresh(payload);
      // Success → go to dashboard
      sessionStorage.removeItem("pendingIdentity");
      alert("Profile completed successfully.");
      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
    }
  };

  return (
    <section className="section-padding" style={{ background: "#f8f6f2", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="card shadow-sm border-0 rounded-4 mt-4">
          <div className="card-body p-4">
            <h2 className="mb-1">Create Your Amritara Rewards Profile</h2>
            <p className="text-muted mb-4">Kindly complete your details to activate loyalty benefits.</p>

            <form onSubmit={onSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input name="FirstName" value={form.FirstName} onChange={onChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input name="LastName" value={form.LastName} onChange={onChange} className="form-control" required />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone No.</label>
                <div className="d-flex gap-2">
                  <select
                    name="MobilePrifix"
                    className="form-select"
                    style={{ maxWidth: 130 }}
                    value={form.MobilePrifix}
                    onChange={onChange}
                    disabled={!!loggedMobile} // read-only if came via phone
                  >
                    <option value="+91">+91</option>
                    {/* add more if needed */}
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
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="EmailId"
                  value={form.EmailId}
                  onChange={onChange}
                  className="form-control"
                  placeholder="name@example.com"
                  required
                  readOnly={!!loggedEmail} // read-only if came via email
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Country</label>
                <select name="Country" value={form.Country} onChange={onChange} className="form-select" required>
                  <option value="India">India</option>
                  {/* add more countries if needed */}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">City</label>
                <input name="City" value={form.City} onChange={onChange} className="form-control" placeholder="City" />
              </div>

              <div className="col-12 mt-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="agree"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="agree">
                    I have read and agree to the{" "}
                    <a href="/privacy" className="text-decoration-none">Privacy Policy</a> and{" "}
                    <a href="/terms" className="text-decoration-none">Terms &amp; Conditions</a>.
                  </label>
                </div>
                {error && <div className="text-danger mt-2">{error}</div>}
              </div>

              <div className="col-12 d-flex gap-2 mt-3">
                <button className="btn btn-primary px-4" type="submit">Submit</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => router.replace("/signin")}>
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}
