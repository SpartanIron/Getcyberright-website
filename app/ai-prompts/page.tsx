import type { Metadata } from "next";
import PageContent from "@/pages/ai-prompts";
import type { DbPrompt } from "@/pages/ai-prompts";
import { FALLBACK_PROMPTS } from "../lib/ai-prompts-fallback";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

export const metadata: Metadata = {
  title: "AI Cybersecurity Prompts | GetCyberRight",
  description:
    "Expertly crafted AI prompts for cybersecurity. Use with ChatGPT, Claude, and other AI tools to analyze threats and protect your digital life.",
  alternates: { canonical: `${BASE_URL}/ai-prompts` },
  openGraph: {
    title: "AI Cybersecurity Prompts | GetCyberRight",
    description: "Expertly crafted AI prompts for cybersecurity. Use with ChatGPT, Claude, and other AI tools to analyze threats and protect your digital life.",
    url: `${BASE_URL}/ai-prompts`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/training.png`, width: 1080, height: 1080, alt: "AI Cybersecurity Prompts" }],
  },
};

export const dynamic = "force-dynamic";

async function fetchPrompts(): Promise<{ prompts: DbPrompt[]; usingFallback: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/prompts`, { cache: "no-store" });
    if (!res.ok) return { prompts: FALLBACK_PROMPTS, usingFallback: true };
    const data = (await res.json()) as DbPrompt[];
    if (!Array.isArray(data) || data.length === 0) {
      return { prompts: FALLBACK_PROMPTS, usingFallback: true };
    }
    return { prompts: data, usingFallback: false };
  } catch {
    return { prompts: FALLBACK_PROMPTS, usingFallback: true };
  }
}

export default async function AIPromptsPage() {
  const { prompts, usingFallback } = await fetchPrompts();
  return <PageContent initialPrompts={prompts} usingFallback={usingFallback} />;
}
