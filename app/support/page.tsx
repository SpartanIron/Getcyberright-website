import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../page-skeleton";
import PageContent from "@/pages/support";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Support | GetCyberRight",
  description:
    "Get help with your GetCyberRight account, tools, and cybersecurity questions. Contact our support team.",
  alternates: { canonical: `${BASE_URL}/support` },
  openGraph: {
    title: "Support | GetCyberRight",
    description:
      "Get help with your GetCyberRight account, tools, and cybersecurity questions. Contact our support team.",
    url: `${BASE_URL}/support`,
    type: "website",
  },
};

export const dynamic = "force-static";

export default function SupportPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
