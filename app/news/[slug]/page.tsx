import type { Metadata } from "next";
import { JsonLd } from "../../components/json-ld";
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

  const authorName = article.author || "Jude Annan, CISM";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "GetCyberRight",
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.publishedAt || undefined,
      authors: [authorName],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [ogImage],
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
        { "@type": "ListItem", position: 2, name: "News & Insights", item: `${BASE_URL}/news` },
        { "@type": "ListItem", position: 3, name: article.title, item: `${BASE_URL}/news/${article.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: article.excerpt || article.title,
      url: `${BASE_URL}/news/${article.slug}`,
      datePublished: article.publishedAt || new Date().toISOString(),
      dateModified: article.updatedAt || article.publishedAt || new Date().toISOString(),
      author: {
        "@type": "Person",
        name: article.author || "Jude Annan, CISM",
        jobTitle: article.authorRole || "Founder & Chief Security Strategist",
        url: BASE_URL,
        worksFor: {
          "@type": "Organization",
          name: "GetCyberRight",
          url: BASE_URL,
        },
      },
      publisher: {
        "@type": "Organization",
        name: "GetCyberRight",
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/og-image.png`,
        },
      },
      ...(article.imageUrl ? { image: article.imageUrl } : {}),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}/news/${article.slug}`,
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
