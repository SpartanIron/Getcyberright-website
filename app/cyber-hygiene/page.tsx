import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../page-skeleton";
import PageContent from "@/pages/cyber-hygiene";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cyber Hygiene: Daily Safety Habits | GCR",
  description: "Learn essential cyber hygiene practices to protect yourself daily. Simple, actionable habits for passwords, software updates, and safe browsing.",
  alternates: { canonical: `${BASE_URL}/cyber-hygiene` },
  openGraph: {
    title: "Cyber Hygiene: Daily Safety Habits | GCR",
    description: "Learn essential cyber hygiene practices to protect yourself daily. Simple, actionable habits for passwords, software updates, and safe browsing.",
    url: `${BASE_URL}/cyber-hygiene`,
    type: "website",
  },
};

export const revalidate = 3600;

export default function CyberHygienePage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
