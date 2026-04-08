import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Announcements | Admin | GetCyberRight",
  description: "Manage site-wide announcements and notifications.",
  robots: { index: false, follow: false },
};

export default function AdminAnnouncementsPage() {
  return <ClientApp page="admin-announcements" />;
}
