import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Engagement Opportunities | Admin | GetCyberRight",
  description: "Manage user engagement opportunities and campaigns.",
  robots: { index: false, follow: false },
};

export default function AdminEngagementPage() {
  return <ClientApp />;
}
