import type { Metadata } from "next";
import PageSkeleton from "../../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/admin/scam-reports";

export const metadata: Metadata = {
  title: "Scam Reports | Admin | GetCyberRight",
  description: "Review and manage submitted scam reports.",
  robots: { index: false, follow: false },
};

export default function AdminScamReportsPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
