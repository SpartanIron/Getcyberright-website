import type { Metadata } from "next";
import PageContent from "@/pages/perspectives";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Perspectives | GetCyberRight",
  description:
    "Long-form editorial from GetCyberRight on the tradeoffs, shifts, and new realities families face online. The hard questions the old playbook does not cover.",
  alternates: { canonical: `${BASE_URL}/perspectives` },
  openGraph: {
    title: "Perspectives | GetCyberRight",
    description:
      "Long-form editorial from GetCyberRight on the tradeoffs, shifts, and new realities families face online.",
    url: `${BASE_URL}/perspectives`,
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default function PerspectivesPage() {
  return <PageContent />;
}
