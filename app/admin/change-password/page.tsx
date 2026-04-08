import type { Metadata } from "next";
import PageSkeleton from "../../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/admin/change-password";

export const metadata: Metadata = {
  title: "Change Password | Admin | GetCyberRight",
  description: "Change your admin account password.",
  robots: { index: false, follow: false },
};

export default function AdminChangePasswordPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
