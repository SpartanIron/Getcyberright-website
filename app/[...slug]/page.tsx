import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientApp from "./client-app";

const STATIC_ROUTES = new Set([
  "support",
  "support-the-mission",
  "security",
  "our-mission",
  "dashboard",
  "account",
  "threat-trends",
  "cyber-threat-radar",
  "awareness-hub",
  "report-scam",
  "checklists",
  "data-removal",
  "ai-safety",
  "cyber-hygiene",
  "password-generator",
  "breach-dashboard",
  "search",
  "parent-guide",
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
  "browser-extension",
  "extension-auth",
  "gcr-guard-pricing",
  "data-shield-pricing",
  "login",
  "register",
  "forgot-password",
]);

const DYNAMIC_ROUTES: Record<string, number> = {
  "training": 2,
  "report": 2,
  "shield": 2,
  "admin": 3,
  "parents": 2,
};

function isKnownRoute(segments: string[]): boolean {
  if (segments.length === 1 && STATIC_ROUTES.has(segments[0])) return true;

  if (segments.length >= 1) {
    const maxDepth = DYNAMIC_ROUTES[segments[0]];
    if (maxDepth !== undefined && segments.length <= maxDepth) return true;
  }

  return false;
}

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isKnownRoute(slug)) {
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

  if (!isKnownRoute(slug)) {
    notFound();
  }

  return <ClientApp />;
}
