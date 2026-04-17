"use client";

import dynamic from "next/dynamic";

const ScamIntelligenceDashboard = dynamic(
  () => import("@pages/scam-intelligence-dashboard"),
  { ssr: false, loading: () => null }
);

export default function ScamIntelligenceClient() {
  return <ScamIntelligenceDashboard />;
}
