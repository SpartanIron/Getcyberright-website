import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientApp from "../../client-app";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function fetchScamIntel(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/scam-intel/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scam = await fetchScamIntel(slug);

  if (!scam) {
    return {
      title: "Scam Intel Not Found | GetCyberRight",
      robots: { index: false, follow: false },
    };
  }

  const title = `${scam.scamName} - Scam Intelligence | GetCyberRight`;
  const description = scam.metaDescription || `Learn about ${scam.scamName} and how to protect yourself.`;
  const url = `${BASE_URL}/scam-intel/${scam.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: `${BASE_URL}/og/scam-calls-texts.png`, width: 1080, height: 1080, alt: scam.scamName }],
    },
  };
}

export default async function ScamIntelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const scam = await fetchScamIntel(slug);

  if (!scam) {
    notFound();
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Scam Intelligence", item: `${BASE_URL}/scam-intel` },
        { "@type": "ListItem", position: 3, name: scam.scamName, item: `${BASE_URL}/scam-intel/${scam.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: scam.scamName,
      description: scam.metaDescription || `Learn about ${scam.scamName} and how to protect yourself.`,
      url: `${BASE_URL}/scam-intel/${scam.slug}`,
      publisher: { "@type": "Organization", name: "GetCyberRight", url: BASE_URL },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ClientApp page="scam-intel-detail" />
    </>
  );
}
