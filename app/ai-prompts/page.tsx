import type { Metadata } from "next";
import PageContent from "@/pages/ai-prompts";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "406+ AI Cybersecurity Prompts | GetCyberRight",
  description:
    "Browse 406+ expertly crafted AI prompts for cybersecurity. Use with ChatGPT, Claude, and other AI tools to analyze threats and protect your digital life.",
  alternates: { canonical: `${BASE_URL}/ai-prompts` },
  openGraph: {
    title: "406+ AI Cybersecurity Prompts | GetCyberRight",
    description: "Browse 406+ expertly crafted AI prompts for cybersecurity. Use with ChatGPT, Claude, and other AI tools to analyze threats and protect your digital life.",
    url: `${BASE_URL}/ai-prompts`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/training.png`, width: 1080, height: 1080, alt: "AI Cybersecurity Prompts" }],
  },
};

export const revalidate = 3600;

export default function AIPromptsPage() {
  return <PageContent />;
}
