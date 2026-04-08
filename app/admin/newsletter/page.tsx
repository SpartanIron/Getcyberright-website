import type { Metadata } from "next";
import PageContent from "@/pages/admin-newsletter";

export const metadata: Metadata = {
  title: "Newsletter | Admin | GetCyberRight",
  description: "Manage newsletter content and distribution.",
  robots: { index: false, follow: false },
};

export default function AdminNewsletterPage() {
  return <PageContent />;
}
