import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientApp from "../../../client-app";

type PageProps = {
  params: Promise<{ scanId: string }>;
};

export const metadata: Metadata = {
  title: "Data Shield Scan Results | GetCyberRight",
  description:
    "View your GCR Data Shield scan results and see where your personal data has been found online.",
  robots: { index: false, follow: false },
};

export default async function ShieldResultsPage({ params }: PageProps) {
  const { scanId } = await params;
  if (!scanId) notFound();
  return <ClientApp page="shield-results" />;
}
