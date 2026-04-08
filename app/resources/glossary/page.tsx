import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../../page-skeleton";
import PageContent from "@/pages/resources/glossary";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity Glossary | GetCyberRight",
  description:
    "A comprehensive glossary of cybersecurity terms explained in plain language for families and non-technical users.",
  alternates: { canonical: `${BASE_URL}/resources/glossary` },
  openGraph: {
    title: "Cybersecurity Glossary | GetCyberRight",
    description:
      "A comprehensive glossary of cybersecurity terms explained in plain language for families and non-technical users.",
    url: `${BASE_URL}/resources/glossary`,
    type: "website",
  },
};

export const revalidate = 3600;

export default function GlossaryPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
