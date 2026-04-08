import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../../page-skeleton";
import { notFound } from "next/navigation";
import PageContent from "@/pages/training-path";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

type PageProps = {
  params: Promise<{ pathId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pathId } = await params;

  try {
    const res = await fetch(`${API_BASE}/api/training/paths/${pathId}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return {
        title: "Learning Path | GetCyberRight",
        description:
          "Follow a structured cybersecurity learning path with modules, lessons, and assessments.",
        robots: { index: false, follow: false },
      };
    }
    const path = await res.json();
    const title = `${path.title} | Training | GetCyberRight`;
    const description =
      path.description ||
      "Follow a structured cybersecurity learning path with modules, lessons, and assessments.";

    return {
      title,
      description,
      alternates: { canonical: `${BASE_URL}/training/${pathId}` },
      robots: { index: false, follow: false },
      openGraph: {
        title,
        description,
        url: `${BASE_URL}/training/${pathId}`,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Learning Path | GetCyberRight",
      description:
        "Follow a structured cybersecurity learning path with modules, lessons, and assessments.",
      robots: { index: false, follow: false },
    };
  }
}

export default async function TrainingPathPage({ params }: PageProps) {
  const { pathId } = await params;
  if (!pathId) notFound();
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
