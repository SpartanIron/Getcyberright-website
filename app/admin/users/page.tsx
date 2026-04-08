import type { Metadata } from "next";
import PageSkeleton from "../../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/admin/users";

export const metadata: Metadata = {
  title: "Manage Users | Admin | GetCyberRight",
  description: "Manage user accounts and permissions.",
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
