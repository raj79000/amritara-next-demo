"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MainHeader from "@/app/Common/MainHeader";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/signin");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (!user || loading) return null;

  return (
    <>
      <MainHeader />
      <section className="section-padding mt-5" style={{ minHeight: "60vh" }}>
        <div className="container mt-5">
          <h1 className="mb-2">
            Welcome{user?.FirstName ? `, ${user.FirstName}` : ""}!
          </h1>
          <p className="text-muted">Your loyalty rewards dashboard</p>

          <div className="row mb-4">
            {/* Points */}
            <div className="col-md-4 mb-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Points</h5>
                  <p className="display-4 fw-bold text-primary">
                    {user?.PointsBalance ?? 0}
                  </p>
                  <p className="card-text">Total points earned</p>
                </div>
              </div>
            </div>

            {/* Tier */}
            <div className="col-md-4 mb-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Tier</h5>
                  <span className="badge bg-success fs-5">
                    {user?.TierName || "N/A"}
                  </span>
                  <p className="card-text mt-2">Valid till {user?.TierEndDate}</p>
                </div>
              </div>
            </div>

            {/* Stays */}
            <div className="col-md-4 mb-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Stays</h5>
                  <p className="display-6 fw-bold text-warning">
                    {user?.TotalStays ?? 0}
                  </p>
                  <p className="card-text">
                    {user?.StaysToNextTier} stays to next tier
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="card shadow-sm mt-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Your Profile</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Email:</strong> {user?.EmailId}
              </p>
              <p>
                <strong>Mobile:</strong> {user?.MobileNo}
              </p>
              <p>
                <strong>City:</strong> {user?.City}, {user?.State},{" "}
                {user?.Country}
              </p>
              <p>
                <strong>Enrol Date:</strong> {user?.EnrolDate}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
