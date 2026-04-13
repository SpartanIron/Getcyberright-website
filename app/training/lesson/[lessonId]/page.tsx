import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageSkeleton from "../../../page-skeleton";
import PageContent from "@/pages/training-lesson";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

type PageProps = {
  params: Promise<{ lessonId: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lessonId } = await params;

  try {
    const res = await fetch(`${API_BASE}/api/training/lessons/${lessonId}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        title: "Training Lesson | GetCyberRight",
        description:
          "Interactive cybersecurity lesson with practical knowledge and real-world examples.",
        robots: { index: false, follow: false },
      };
    }
    const lesson = await res.json();
    const title = `${lesson.title} | Training | GetCyberRight`;
    const description =
      lesson.description ||
      "Interactive cybersecurity lesson with practical knowledge and real-world examples.";

    return {
      title,
      description,
      robots: { index: false, follow: false },
    };
  } catch {
    return {
      title: "Training Lesson | GetCyberRight",
      description:
        "Interactive cybersecurity lesson with practical knowledge and real-world examples.",
      robots: { index: false, follow: false },
    };
  }
}

export default async function TrainingLessonPage({ params }: PageProps) {
  const { lessonId } = await params;
  if (!lessonId) notFound();
  return (
    <PageContent />
  );
}
