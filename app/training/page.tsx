import type { Metadata } from "next";
import { JsonLd } from "../components/json-ld";
import PageContent from "@/pages/training";
import { getAllLearningPaths } from "../lib/data";
export const dynamic = 'force-dynamic';

const BASE_URL = "https://www.getcyberright.com";

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

export default async function TrainingPage() {
  const initialPaths = await getAllLearningPaths();
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
      "@type": "Course",
      name: "GetCyberRight Cybersecurity Training Academy",
      description: "Free, comprehensive cybersecurity training for families, kids, seniors, educators, and small businesses. Learn to protect yourself and your loved ones online.",
      provider: { "@type": "Organization", name: "GetCyberRight", url: BASE_URL },
      url: `${BASE_URL}/training`,
      isAccessibleForFree: true,
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
      <JsonLd data={jsonLd} />
      <PageContent initialPaths={initialPaths} />
    </>
  );
}
