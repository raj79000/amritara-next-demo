"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainHeader from "@/app/Common/MainHeader";

export default function MemberProfilePage() {
  const router = useRouter();
  const { user, saveProfileAndRefresh } = useAuth();

  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user, router]);

  const [form, setForm] = useState({
    FirstName: user?.FirstName || "",
    LastName: user?.LastName || "",
    MobilePrifix: user?.MobilePrifix || "+91",
    MobileNo: user?.MobileNo || "",
    EmailId: user?.EmailId || "",
    City: user?.City || "",
    Country: user?.Country || "India",
  });

  const [saving, setSaving] = useState(false);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveProfileAndRefresh(form);
      alert("Profile updated.");
      router.replace("/members/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <MainHeader />
      <section className="section-padding" style={{ background: "#f8f6f2", minHeight: "100vh" }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="card shadow-sm border-0 rounded-4 mt-4">
            <div className="card-body p-4">
              <h2 className="mb-1">Edit Profile</h2>
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
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Country</label>
                  <select name="Country" value={form.Country} onChange={onChange} className="form-select" required>
                    <option value="India">India</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <input name="City" value={form.City} onChange={onChange} className="form-control" placeholder="City" />
                </div>

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
      </section>
    </>
  );
}
