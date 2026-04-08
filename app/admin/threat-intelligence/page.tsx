import type { Metadata } from "next";
import PageSkeleton from "../../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/admin-threat-intelligence";

export const metadata: Metadata = {
  title: "Threat Intelligence | Admin | GetCyberRight",
  description: "Monitor and manage threat intelligence feeds.",
  robots: { index: false, follow: false },
};

export default function AdminThreatIntelligencePage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
