import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageSkeleton from "../../../page-skeleton";
import PageContent from "@/pages/training-quiz";

type PageProps = {
  params: Promise<{ quizId: string }>;
};

export const metadata: Metadata = {
  title: "Training Quiz | GetCyberRight",
  description:
    "Test your cybersecurity knowledge with interactive quizzes and earn your certification.",
  robots: { index: false, follow: false },
};

export default async function TrainingQuizPage({ params }: PageProps) {
  const { quizId } = await params;
  if (!quizId) notFound();
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}
