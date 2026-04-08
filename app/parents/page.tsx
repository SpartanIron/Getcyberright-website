import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../page-skeleton";
import PageContent from "@/pages/parents";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Parents Hub: Keep Your Family Safe Online | GetCyberRight",
  description:
    "Cybersecurity guides for parents. Learn about parental controls, age-appropriate device settings, and how to protect your children from online threats.",
  alternates: { canonical: `${BASE_URL}/parents` },
  openGraph: {
    title: "Parents Hub: Keep Your Family Safe Online | GetCyberRight",
    description:
      "Cybersecurity guides for parents. Learn about parental controls, age-appropriate device settings, and how to protect your children from online threats.",
    url: `${BASE_URL}/parents`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/education.png`,
        width: 1080,
        height: 1080,
        alt: "Parents Hub",
      },
    ],
  },
};

export const revalidate = 3600;

export default function ParentsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Parents Hub",
        item: `${BASE_URL}/parents`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>
    </>
  );
}
