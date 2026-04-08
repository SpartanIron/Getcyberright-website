import type { Metadata } from "next";
import PageContent from "@/pages/ai-safety";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "AI Safety Guide: AI Threat Protection | GCR",
  description: "Learn how to identify and protect yourself from AI-powered scams, deepfakes, and synthetic media. Practical safety tips for the age of AI.",
  alternates: { canonical: `${BASE_URL}/ai-safety` },
  openGraph: {
    title: "AI Safety Guide: AI Threat Protection | GCR",
    description: "Learn how to identify and protect yourself from AI-powered scams, deepfakes, and synthetic media. Practical safety tips for the age of AI.",
    url: `${BASE_URL}/ai-safety`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/training.png`, width: 1080, height: 1080, alt: "AI Safety Guide" }],
  },
};

export const revalidate = 3600;

export default function AISafetyPage() {
  return <PageContent />;
}
