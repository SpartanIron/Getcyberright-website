import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientApp from "../../../client-app";

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
  return <ClientApp page="training-quiz" />;
}
