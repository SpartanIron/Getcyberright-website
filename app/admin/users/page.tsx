import type { Metadata } from "next";
import PageContent from "@/pages/admin/users";

export const metadata: Metadata = {
  title: "Manage Users | Admin | GetCyberRight",
  description: "Manage user accounts and permissions.",
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return <PageContent />;
}
