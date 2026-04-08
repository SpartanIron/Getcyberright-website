import type { Metadata } from "next";
import PageContent from "@/pages/child-safety-scanner";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Child Safety Scanner | GetCyberRight",
  description:
    "Scan and assess your child's online safety. Identify risks and get personalized recommendations for parents.",
  alternates: { canonical: `${BASE_URL}/parents/child-safety-scanner` },
  openGraph: {
    title: "Child Safety Scanner | GetCyberRight",
    description:
      "Scan and assess your child's online safety. Identify risks and get personalized recommendations for parents.",
    url: `${BASE_URL}/parents/child-safety-scanner`,
    type: "website",
  },
};

export const revalidate = 3600;

export default function ChildSafetyScannerPage() {
  return <PageContent />;
}
