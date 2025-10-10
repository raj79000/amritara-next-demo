"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MainHeader from "@/app/Common/MainHeader";
import Link from "next/link";
import Image from "next/image";
import UpgradeProgress from "./ProgressCard";
import CommonMemberHeader from "../CommonMemberHeader";

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


        <div className="atithyam-logo-div text-center">
          <Image src="/rewards/atithyam_logo.png" className="atithyam-logo-dashboard" height={150} width={200} alt="atithyam logo" />
        </div>

        
        
          <div className="container mt-4">
            <div className="members-main-top-nav">
              <CommonMemberHeader></CommonMemberHeader>
            
            <div className="member-data-box-main mt-4">
              <h1 className="mb-3 text-center">
                Welcome
                {user?.FirstName || user?.LastName
                  ? `, ${user?.FirstName ?? ""}${user?.LastName ? ` ${user.LastName}` : ""}`
                  : ""}!
              </h1>


              <div className="row mb-4">

                {/* Stays */}
                <div className="col-md-4 mb-3">
                  <div className="card text-center shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Membership No</h5>
                      <p className="badge bg-success fs-5">
                        {user?.CardNo || user?.MemberId || "—"}
                      </p>

                      <p className="mt-2">
                        <strong>Enrol Date:</strong> {user?.EnrolDate || ""}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Tier */}
                <div className="col-md-4 mb-3">
                  <div className="card text-center shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">My Tier</h5>
                      <span className="badge bg-success fs-5">
                        {user?.TierName || "N/A"}
                      </span>
                      <p className="card-text mt-2">Valid till: {user?.TierEndDate}</p>
                    </div>
                  </div>
                </div>
                {/* Points */}
                <div className="col-md-4 mb-3">
                  <div className="card text-center shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Points</h5>
                      <p className="badge bg-success fs-5">
                        {user?.PointsBalance ?? 0}
                      </p>
                      <p className="card-text mt-2">
                        Expire on: {user?.PointsExpiryDate || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="more-info-about-reward text-center">
                <p className="tonexttirertext"><b>Limited Period Offer at Amritara Hotels & Resorts</b></p>
                <p className="tonexttirertext">Get <strong>100 Bonus Points</strong> on Direct Website Booking.</p>
                  <div className="progress-to-new-tier text-center">
                    <h4 className="mb-2">Progress to Swarna</h4>
                    <p className="tonexttirertext">To upgrade to the next tier, you must achieve both the required points and nights within the tier cycle.</p>
                  </div>
                  <h3 className="tier-cycle-display mt-4">Tier Cycle : {user?.tierEndDate || ""} </h3>

                  <UpgradeProgress user={user} />
              </div>

            </div>
          </div>

        </div>

      </section>
    </>
  );
}
