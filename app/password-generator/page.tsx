import type { Metadata } from "next";
import PageSkeleton from "../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/password-generator";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Secure Password Generator | GetCyberRight",
  description: "Generate strong, unique passwords instantly with our secure password generator. Customize length, character types, and complexity. Free to use.",
  alternates: { canonical: `${BASE_URL}/password-generator` },
  openGraph: {
    title: "Secure Password Generator | GetCyberRight",
    description: "Generate strong, unique passwords instantly with our secure password generator. Customize length, character types, and complexity. Free to use.",
    url: `${BASE_URL}/password-generator`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/scam-guard.png`, width: 1080, height: 1080, alt: "Password Generator" }],
  },
};

export const revalidate = 3600;

export default function PasswordGeneratorPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
