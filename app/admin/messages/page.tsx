import type { Metadata } from "next";
import PageContent from "@/pages/admin/messages";

export const metadata: Metadata = {
  title: "Messages | Admin | GetCyberRight",
  description: "View and manage contact messages.",
  robots: { index: false, follow: false },
};

export default function AdminMessagesPage() {
  return <PageContent />;
}
