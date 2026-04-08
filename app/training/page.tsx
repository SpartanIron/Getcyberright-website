import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../page-skeleton";
import PageContent from "@/pages/training";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

export const metadata: Metadata = {
  title: "Cybersecurity Training Academy | GetCyberRight",
  description:
    "Access cybersecurity training courses designed for beginners, families, seniors, and small businesses. Core courses are free to get started.",
  alternates: { canonical: `${BASE_URL}/training` },
  openGraph: {
    title: "Cybersecurity Training Academy | GetCyberRight",
    description:
      "Access cybersecurity training courses designed for beginners, families, seniors, and small businesses. Core courses are free to get started.",
    url: `${BASE_URL}/training`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/training.png`,
        width: 1080,
        height: 1080,
        alt: "GetCyberRight Training",
      },
    ],
  },
};

export const revalidate = 3600;

async function fetchTrainingPaths() {
  try {
    const res = await fetch(`${API_BASE}/api/training/paths`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TrainingPage() {
  const initialPaths = await fetchTrainingPaths();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "GetCyberRight Cybersecurity Training Academy",
      description:
        "Cybersecurity training courses with quizzes and certificates. Structured learning paths for kids, parents, seniors, educators, and small businesses.",
      url: `${BASE_URL}/training`,
      publisher: {
        "@type": "Organization",
        name: "GetCyberRight",
        url: BASE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Training Academy",
          item: `${BASE_URL}/training`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Suspense fallback={<PageSkeleton />}>
        <PageContent initialPaths={initialPaths} />
      </Suspense>
    </>
  );
}
