import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../../page-skeleton";
import { notFound } from "next/navigation";
import PageContent from "@/pages/news-article";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function fetchArticle(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/news/article/${slug}`, {
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
  const article = await fetchArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found | GetCyberRight",
      robots: { index: false, follow: false },
    };
  }

  const title = `${article.title} | GetCyberRight News`;
  const description = article.excerpt || article.title;
  const url = `${BASE_URL}/news/${article.slug}`;
  const ogImage = article.imageUrl || `${BASE_URL}/api/social-images/social-${article.id}.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.publishedAt || undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    notFound();
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "News", item: `${BASE_URL}/news` },
        { "@type": "ListItem", position: 3, name: article.title, item: `${BASE_URL}/news/${article.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt || article.title,
      url: `${BASE_URL}/news/${article.slug}`,
      publisher: { "@type": "Organization", name: "GetCyberRight", url: BASE_URL },
      datePublished: article.publishedAt || new Date().toISOString(),
      image: article.imageUrl || undefined,
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
