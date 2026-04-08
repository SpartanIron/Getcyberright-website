import type { Metadata } from "next";
import PageSkeleton from "../../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/admin-security";

export const metadata: Metadata = {
  title: "Security Settings | Admin | GetCyberRight",
  description: "Manage security settings and configurations.",
  robots: { index: false, follow: false },
};

export default function AdminSecurityPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
