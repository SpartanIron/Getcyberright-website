import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageContent from "@/pages/social-post-sources";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

async function fetchSources(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/social/posts/${encodeURIComponent(id)}/sources`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchSources(id);

  if (!data) {
    return {
      title: "Sources Not Found | GetCyberRight",
      robots: { index: false, follow: false },
    };
  }

  const title = `Sources for "${data.title}" | GetCyberRight`;
  const description = `Independently verifiable sources for our published ${data.platform} post: ${data.title}.`;
  const url = `${BASE_URL}/social/p/${data.id}/sources`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
    robots: { index: true, follow: true },
  };
}

export default async function SocialPostSourcesRoute({ params }: PageProps) {
  const { id } = await params;
  const data = await fetchSources(id);

  if (!data) {
    notFound();
  }

  return <PageContent />;
}
