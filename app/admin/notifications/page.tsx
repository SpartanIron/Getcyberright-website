import type { Metadata } from "next";
import PageContent from "@/pages/admin/notifications";

export const metadata: Metadata = {
  title: "Notification Destinations | Admin | GetCyberRight",
  description: "Configure where review-queue notifications are delivered.",
  robots: { index: false, follow: false },
};

export default function AdminNotificationsRoute() {
  return <PageContent />;
}
