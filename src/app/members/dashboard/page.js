"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user, router]);

  if (!user) return null;

  return (
    <section className="section-padding" style={{ minHeight: "60vh" }}>
      <div className="container">
        <h1 className="mb-2">Welcome{user?.FirstName ? `, ${user.FirstName}` : ""}!</h1>
        <p className="text-muted">Your rewards dashboard will appear here.</p>
        {/* Add points, tier, vouchers, etc. */}
      </div>
    </section>
  );
}
