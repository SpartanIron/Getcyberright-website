import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientApp from "./client-app";

const STATIC_ROUTES = new Set([
  "about",
  "tools",
  "resources",
  "contact",
  "privacy",
  "terms",
  "emergency-help",
  "kids",
  "seniors",
  "parents",
  "support",
  "support-the-mission",
  "security",
  "our-mission",
  "pricing",
  "dashboard",
  "account",
  "threat-trends",
  "cyber-threat-radar",
  "awareness-hub",
  "report-scam",
  "checklists",
  "data-removal",
  "ai-prompts",
  "ai-safety",
  "news",
  "cyber-hygiene",
  "password-generator",
  "breach-dashboard",
  "search",
  "parent-guide",
  "small-business",
  "educators",
  "travel-safety",
  "accessibility",
  "advertise",
  "partner-deck",
  "feedback",
  "experience",
  "checkout-success",
  "preferences",
  "printable-guides",
  "quick-assessment",
  "safety-score",
  "scam-checker",
  "shield",
  "browser-extension",
  "extension-auth",
  "gcr-guard-pricing",
  "data-shield-pricing",
  "faq",
  "guides",
  "alerts",
  "scam-intel",
  "training",
  "login",
  "register",
  "forgot-password",
]);

const DYNAMIC_PREFIXES = [
  "training",
  "guides",
  "alerts",
  "scam-intel",
  "scams",
  "topics",
  "report",
  "news",
  "shield",
  "admin",
  "parents",
];

function isKnownRoute(segments: string[]): boolean {
  if (segments.length === 0) return true;
  if (segments.length === 1 && STATIC_ROUTES.has(segments[0])) return true;
  if (segments.length >= 1 && DYNAMIC_PREFIXES.includes(segments[0])) return true;
  return false;
}

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const segments = slug || [];

  if (segments.length === 0) {
    return {
      title: "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
      description:
        "Protect your family online with free cybersecurity education, AI-powered scam detection tools, data broker removal, and safety training. Trusted by thousands of families worldwide.",
      openGraph: {
        title: "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
        description:
          "Protect your family online with free cybersecurity education, AI-powered scam detection tools, data broker removal, and safety training.",
        url: "https://www.getcyberright.com",
        type: "website",
      },
    };
  }

  if (!isKnownRoute(segments)) {
    return {
      title: "Page Not Found | GetCyberRight",
      description:
        "The page you're looking for doesn't exist. Visit GetCyberRight for free cybersecurity education, tools, and safety resources for families.",
      robots: { index: false, follow: false },
    };
  }

  return {};
}

export default async function CatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const segments = slug || [];

  if (!isKnownRoute(segments)) {
    notFound();
  }

  return <ClientApp />;
}
