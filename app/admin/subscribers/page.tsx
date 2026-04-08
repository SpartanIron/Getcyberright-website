import type { Metadata } from "next";
import PageContent from "@/pages/admin/subscribers";

export const metadata: Metadata = {
  title: "Subscribers | Admin | GetCyberRight",
  description: "Manage newsletter subscribers.",
  robots: { index: false, follow: false },
};

export default function AdminSubscribersPage() {
  return <PageContent />;
}
