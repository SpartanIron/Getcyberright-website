import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Subscribers | Admin | GetCyberRight",
  description: "Manage newsletter subscribers.",
  robots: { index: false, follow: false },
};

export default function AdminSubscribersPage() {
  return <ClientApp page="admin-subscribers" />;
}
