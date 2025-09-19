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
          <h1 className="mb-2">Welcome{user?.FirstName ? `, ${user.FirstName}` : ""}!</h1>
          <p className="text-muted">Your rewards dashboard will appear here.</p>
          {/* TODO: points, tier, vouchers, activity */}
        </div>
      </section>
    </>
  );
}
