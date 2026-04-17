"use client";

import dynamic from "next/dynamic";

const ScamIntelligenceMethodology = dynamic(
  () => import("@/pages/scam-intelligence-methodology"),
  { ssr: false, loading: () => null }
);

export default function MethodologyClient() {
  return <ScamIntelligenceMethodology />;
}
