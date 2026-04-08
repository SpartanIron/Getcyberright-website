import type { Metadata } from "next";
import ClientApp from "../../client-app";

const BASE_URL = "https://www.getcyberright.com";

type PageProps = {
  params: Promise<{ scamType: string }>;
};

const SCAM_META: Record<string, { title: string; description: string }> = {
  "phishing": { title: "Phishing Scams: How to Identify & Avoid Them | GetCyberRight", description: "Learn how phishing scams work, how to identify fake emails and messages, and how to protect yourself and your family from phishing attacks." },
  "romance-scams": { title: "Romance Scams: Warning Signs & Protection | GetCyberRight", description: "Understand how romance scams work, learn the warning signs, and find out how to protect yourself from online dating fraud." },
  "tech-support-scams": { title: "Tech Support Scams: How They Trick You | GetCyberRight", description: "Learn about tech support scams, how scammers impersonate tech companies, and steps to protect yourself from fake tech support calls." },
  "identity-theft": { title: "Identity Theft: Prevention & Recovery | GetCyberRight", description: "Comprehensive guide to preventing identity theft, recognizing warning signs, and recovering if your identity has been stolen." },
  "investment-scams": { title: "Investment Scams: Protect Your Money | GetCyberRight", description: "Learn to spot fake investment platforms, cryptocurrency scams, and get-rich-quick schemes that target everyday people." },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { scamType } = await params;
  const meta = SCAM_META[scamType];

  if (meta) {
    return {
      title: meta.title,
      description: meta.description,
      alternates: { canonical: `${BASE_URL}/scams/${scamType}` },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: `${BASE_URL}/scams/${scamType}`,
        type: "article",
      },
    };
  }

  return {
    title: `${scamType.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} Scams | GetCyberRight`,
    description: `Learn about ${scamType.replace(/-/g, " ")} scams, how they work, and how to protect yourself and your family.`,
    alternates: { canonical: `${BASE_URL}/scams/${scamType}` },
  };
}

export default function ScamTypePage() {
  return <ClientApp page="scam-page" />;
}
