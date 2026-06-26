import type { Metadata } from "next";
import PageContent from "@/pages/admin/inbox";

export const metadata: Metadata = {
  title: "Inbox | Admin | GetCyberRight",
  description: "Unified inbox for messages, feedback, scam reports, and comments.",
  robots: { index: false, follow: false },
};

export default function AdminInboxPage() {
  return <PageContent />;
}
