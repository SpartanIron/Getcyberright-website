import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../../page-skeleton";
import { notFound } from "next/navigation";
import PageContent from "@/pages/guide-detail";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function fetchGuide(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/guides/${slug}`, {
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
  const guide = await fetchGuide(slug);

  if (!guide) {
    return {
      title: "Guide Not Found | GetCyberRight",
      robots: { index: false, follow: false },
    };
  }

  const title = `${guide.title} | GetCyberRight`;
  const description = guide.metaDescription || guide.title;
  const url = `${BASE_URL}/guides/${guide.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: `${BASE_URL}/og/education.png`, width: 1080, height: 1080, alt: guide.title }],
      publishedTime: guide.publishedAt || undefined,
      modifiedTime: guide.updatedAt || guide.publishedAt || undefined,
    },
    other: {
      "article:published_time": guide.publishedAt || "",
      "article:modified_time": guide.updatedAt || guide.publishedAt || "",
    },
  };
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = await fetchGuide(slug);

  if (!guide) {
    notFound();
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${BASE_URL}/guides` },
        { "@type": "ListItem", position: 3, name: guide.title, item: `${BASE_URL}/guides/${guide.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.metaDescription || guide.title,
      url: `${BASE_URL}/guides/${guide.slug}`,
      publisher: { "@type": "Organization", name: "GetCyberRight", url: BASE_URL },
      datePublished: guide.publishedAt || new Date().toISOString(),
      dateModified: guide.updatedAt || guide.publishedAt || new Date().toISOString(),
      keywords: guide.tags?.join(", "),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>
    </>
  );
}
