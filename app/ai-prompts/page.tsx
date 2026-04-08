import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

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

export default function AIPromptsPage() {
  return (<>
        <SSRContent
          title="AI Safety Prompt Library"
          description="Curated AI prompts for cybersecurity education and family safety discussions."
        />
        <ClientApp page="ai-prompts" />
      </>);
}
