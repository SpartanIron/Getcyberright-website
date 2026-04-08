import type { Metadata } from "next";
import PageSkeleton from "../../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/admin/feedback";

export const metadata: Metadata = {
  title: "Feedback | Admin | GetCyberRight",
  description: "Review and manage user feedback submissions.",
  robots: { index: false, follow: false },
};

export default function AdminFeedbackPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
