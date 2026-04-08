import type { Metadata } from "next";
import PageSkeleton from "../../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/admin/engagement-opportunities";

export const metadata: Metadata = {
  title: "Engagement Opportunities | Admin | GetCyberRight",
  description: "Manage user engagement opportunities and campaigns.",
  robots: { index: false, follow: false },
};

export default function AdminEngagementPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
