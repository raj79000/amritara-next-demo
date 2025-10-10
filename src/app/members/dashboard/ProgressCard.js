"use client";
import React from "react";

/** safe number parse (handles "4500.00", "", null) */
const toNum = (v, d = 0) => {
  const n = Number(String(v ?? "").replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : d;
};

const ProgressCard = ({ title, current, total, unit }) => {
  const c = toNum(current, 0);
  const t = Math.max(toNum(total, 0), 0);
  const pct = t > 0 ? Math.min((c / t) * 100, 100) : 0;

  return (
    <div className="col-md-6 mb-3">
      <div className="progress-card-for-member card shadow-sm border-0 h-100">
        <div className="card-body text-center">
          <h5 className="card-title fw-bold">{title}</h5>
          <p className="mb-1 fw-semibold">{pct.toFixed(0)}%</p>
          <div className="progress" style={{ height: "10px" }}>
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${pct}%` }}
              aria-valuenow={pct}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <p className="small mt-2">
            {c} / {t} {unit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function UpgradeProgress({ user }) {
  // points
  const pointsCurrent = toNum(user?.PointsBalance, 0);
  const pointsRemaining = toNum(user?.PointsToNextTier, 0);
  const pointsTotal = pointsCurrent + pointsRemaining; // target = current + remaining

  // nights
  const nightsCurrent = toNum(user?.TotalStays, 0);
  const nightsRemaining = toNum(user?.StaysToNextTier, 0);
  const nightsTotal = nightsCurrent + nightsRemaining;

  return (
    <div className="row">
      <ProgressCard
        title="Upgrade By Points"
        current={pointsCurrent}
        total={pointsTotal}
        unit="points"
      />
      <ProgressCard
        title="Upgrade By Nights"
        current={nightsCurrent}
        total={nightsTotal}
        unit="nights"
      />
    </div>
  );
}
