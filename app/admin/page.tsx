import type { Metadata } from "next";
import PageSkeleton from "../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/admin/index";

export const metadata: Metadata = {
  title: "Admin Dashboard | GetCyberRight",
  description: "GetCyberRight administration dashboard.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
