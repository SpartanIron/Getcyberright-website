import type { Metadata } from "next";
import PageSkeleton from "../../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/admin-content-governance";

export const metadata: Metadata = {
  title: "Content Governance | Admin | GetCyberRight",
  description: "Manage content governance policies and workflows.",
  robots: { index: false, follow: false },
};

export default function AdminContentGovernancePage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
