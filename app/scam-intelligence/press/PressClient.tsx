"use client";

import dynamic from "next/dynamic";

const ScamIntelligencePress = dynamic(
  () => import("@/pages/scam-intelligence-press"),
  { ssr: false, loading: () => null }
);

export default function PressClient() {
  return <ScamIntelligencePress />;
}
