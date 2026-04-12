import type { Metadata } from "next";
import PageContent from "@/pages/for-organizations";

export const metadata: Metadata = {
  title: "For Organizations | GetCyberRight",
  description:
    "Cybersecurity training, threat briefings, and safety tools for schools, businesses, governments, and community organizations. Designed for non-technical audiences.",
  openGraph: {
    title: "For Organizations | GetCyberRight",
    description:
      "Cybersecurity training, threat briefings, and safety tools for schools, businesses, governments, and community organizations.",
    type: "website",
  },
};

export const dynamic = "force-static";

export default function ForOrganizationsPage() {
  return <PageContent />;
}
