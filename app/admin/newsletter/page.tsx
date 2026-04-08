import type { Metadata } from "next";
import PageSkeleton from "../../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/admin-newsletter";

export const metadata: Metadata = {
  title: "Newsletter | Admin | GetCyberRight",
  description: "Manage newsletter content and distribution.",
  robots: { index: false, follow: false },
};

export default function AdminNewsletterPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
