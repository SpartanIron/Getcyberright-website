import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Manage Users | Admin | GetCyberRight",
  description: "Manage user accounts and permissions.",
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return <ClientApp page="admin-users" />;
}
