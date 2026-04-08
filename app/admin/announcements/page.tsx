import type { Metadata } from "next";
import PageSkeleton from "../../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/admin/announcements";

export const metadata: Metadata = {
  title: "Announcements | Admin | GetCyberRight",
  description: "Manage site-wide announcements and notifications.",
  robots: { index: false, follow: false },
};

export default function AdminAnnouncementsPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
