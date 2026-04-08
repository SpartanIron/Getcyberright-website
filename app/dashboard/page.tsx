import type { Metadata } from "next";
import PageContent from "@/pages/dashboard";

export const metadata: Metadata = {
  title: "Dashboard | GetCyberRight",
  description:
    "Your personal cybersecurity dashboard with safety score, recent alerts, and training progress.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <PageContent />;
}
