import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

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

export default function TrainingPage() {
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
      <SSRContent
          title="Cybersecurity Training Academy"
          description="Free interactive cybersecurity training courses for families with learning paths, quizzes, and certificates."
          sections={[{"heading":"Learn at Your Own Pace","text":"Structured learning paths tailored to different experience levels with interactive lessons, quizzes, and completion certificates."}]}
        />
        <ClientApp page="training" />
    </>
  );
}
