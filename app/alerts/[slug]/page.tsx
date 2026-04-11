import type { Metadata } from "next";
import { JsonLd } from "../../components/json-ld";
import { notFound } from "next/navigation";
import PageContent from "@/pages/alert-detail";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function fetchAlert(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/alerts/${slug}`, {
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
  const alert = await fetchAlert(slug);

  if (!alert) {
    return {
      title: "Alert Not Found | GetCyberRight",
      robots: { index: false, follow: false },
    };
  }

  const title = `${alert.threatName} - Cyber Threat Alert | GetCyberRight`;
  const description = alert.description?.substring(0, 160) || alert.threatName;
  const url = `${BASE_URL}/alerts/${alert.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: `${BASE_URL}/api/og?title=${encodeURIComponent(alert.threatName)}&severity=${encodeURIComponent(alert.riskLevel || '')}&type=alert`, width: 1200, height: 630, alt: alert.threatName }],
      publishedTime: alert.publishedAt || undefined,
    },
  };
}

export default async function AlertDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const alert = await fetchAlert(slug);

  if (!alert) {
    notFound();
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Threat Alerts", item: `${BASE_URL}/alerts` },
        { "@type": "ListItem", position: 3, name: alert.threatName, item: `${BASE_URL}/alerts/${alert.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: alert.threatName,
      description: alert.description?.substring(0, 160) || alert.threatName,
      url: `${BASE_URL}/alerts/${alert.slug}`,
      datePublished: alert.publishedAt || new Date().toISOString(),
      dateModified: alert.updatedAt || alert.publishedAt || new Date().toISOString(),
      author: {
        "@type": "Organization",
        name: "GetCyberRight",
        url: BASE_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "GetCyberRight",
        url: BASE_URL,
        logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.png` },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}/alerts/${alert.slug}`,
      },
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageContent />
    </>
  );
}
