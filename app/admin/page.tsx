import type { Metadata } from "next";
import ClientApp from "../client-app";

export const metadata: Metadata = {
  title: "Admin Dashboard | GetCyberRight",
  description: "GetCyberRight administration dashboard.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <ClientApp page="admin" />;
}
