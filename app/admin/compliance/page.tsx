import type { Metadata } from "next";
import PageSkeleton from "../../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/admin-compliance";

export const metadata: Metadata = {
  title: "Compliance | Admin | GetCyberRight",
  description: "Monitor compliance status and manage regulatory requirements.",
  robots: { index: false, follow: false },
};

export default function AdminCompliancePage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
