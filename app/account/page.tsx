import type { Metadata } from "next";
import PageSkeleton from "../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/account";

export const metadata: Metadata = {
  title: "Account Settings | GetCyberRight",
  description:
    "Manage your GetCyberRight account settings, security preferences, and subscription details.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
