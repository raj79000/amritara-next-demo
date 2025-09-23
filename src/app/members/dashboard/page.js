"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MainHeader from "@/app/Common/MainHeader";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user, router]);

  if (!user) return null;

  return (
    <>
      <MainHeader />
      <section className="section-padding mt-5" style={{ minHeight: "60vh" }}>
        <div className="container mt-5">
          <h1 className="mb-2">
            Welcome{user?.FirstName ? `, ${user.FirstName}` : ""}!
          </h1>
          <p className="text-muted">
            Your loyalty rewards dashboard
          </p>
          <div className="row mb-4">
            {/* Points Card */}
            <div className="col-md-4 mb-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Points</h5>
                  <p className="display-4 fw-bold text-primary">{user?.points ?? 0}</p>
                  <p className="card-text">Total points earned</p>
                </div>
              </div>
            </div>
            {/* Tier Card */}
            <div className="col-md-4 mb-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Tier</h5>
                  <span className="badge bg-success fs-5">
                    {user?.tier ?? "Bronze"}
                  </span>
                  <p className="card-text mt-2">Your current membership tier</p>
                </div>
              </div>
            </div>
            {/* Vouchers Card */}
            <div className="col-md-4 mb-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Vouchers</h5>
                  <p className="display-6 fw-bold text-warning">{user?.vouchers?.length ?? 0}</p>
                  <p className="card-text">Available vouchers</p>
                </div>
              </div>
            </div>
          </div>
          {/* Activity Table */}
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body p-0">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Activity</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {(user?.activity ?? []).length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">
                        No recent activity.
                      </td>
                    </tr>
                  ) : (
                    user.activity.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.date}</td>
                        <td>{item.description}</td>
                        <td>{item.points}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
