import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Trending Threats | Admin | GetCyberRight",
  description: "Monitor and manage trending cybersecurity threats.",
  robots: { index: false, follow: false },
};

export default function AdminTrendingThreatsPage() {
  return <ClientApp />;
}
