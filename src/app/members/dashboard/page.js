"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MainHeader from "@/app/Common/MainHeader";
import Link from "next/link";
import Image from "next/image";

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
      <section className="main-dashboard-page" style={{ minHeight: "60vh" }}>

        <Link href="/members/profile">Edit Profile</Link>
        <div className="atithyam-logo-div text-center">
          <Image src="/rewards/atithyam_logo.png" className="atithyam-logo-dashboard" height={150} width={200} alt="atithyam logo" />
        </div>
        <div className="container mt-5">
          <h1 className="mb-2 text-center">
            Welcome
            {user?.FirstName || user?.LastName
              ? `, ${user?.FirstName ?? ""}${user?.LastName ? ` ${user.LastName}` : ""}`
              : ""}!
          </h1>


          <div className="row mb-4">
            {/* Points */}
            <div className="col-md-4 mb-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Points</h5>
                  <p className="badge bg-success fs-5">
                    {user?.PointsBalance ?? 0}
                  </p>
                  <p className="card-text">
                     Expire on: {user?.PointsExpiryDate || ""}
                    </p>
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
                  {/* <p className="card-text mt-2">Valid till {user?.TierEndDate}</p> */}
                </div>
              </div>
            </div>

            {/* Stays */}
            <div className="col-md-4 mb-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Membership No</h5>
                  <p className="badge bg-success fs-5">
                    {user?.CardNo || user?.MemberId || "—"}
                  </p>
                  {/* <p className="card-text">
                    {user?.StaysToNextTier} stays to next tier
                  </p> */}
                   <p>
  <strong>Enrol Date:</strong> {user?.EnrolDate || ""}
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
