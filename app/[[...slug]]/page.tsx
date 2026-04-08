import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientApp from "./client-app";

const KNOWN_CLIENT_ROUTES = new Set([
  "/",
  "/about",
  "/tools",
  "/resources",
  "/contact",
  "/privacy",
  "/terms",
  "/emergency-help",
  "/kids",
  "/seniors",
  "/parents",
  "/parents/child-safety-scanner",
  "/support",
  "/support-the-mission",
  "/security",
  "/our-mission",
  "/pricing",
  "/dashboard",
  "/account",
  "/threat-trends",
  "/cyber-threat-radar",
  "/awareness-hub",
  "/report-scam",
  "/checklists",
  "/data-removal",
  "/ai-prompts",
  "/ai-safety",
  "/news",
  "/cyber-hygiene",
  "/password-generator",
  "/breach-dashboard",
  "/search",
  "/parent-guide",
  "/small-business",
  "/educators",
  "/travel-safety",
  "/accessibility",
  "/advertise",
  "/partner-deck",
  "/feedback",
  "/experience",
  "/checkout-success",
  "/preferences",
  "/printable-guides",
  "/quick-assessment",
  "/safety-score",
  "/scam-checker",
  "/shield",
  "/shield/next-steps",
  "/browser-extension",
  "/extension-auth",
  "/gcr-guard-pricing",
  "/data-shield-pricing",
  "/faq",
  "/guides",
  "/alerts",
  "/scam-intel",
  "/training",
  "/login",
  "/register",
  "/forgot-password",
  "/admin",
  "/admin/users",
  "/admin/messages",
  "/admin/subscribers",
  "/admin/scam-reports",
  "/admin/scan-management",
  "/admin/tool-analytics",
  "/admin/security",
  "/admin/threat-intelligence",
  "/admin/content-governance",
  "/admin/compliance",
  "/admin/newsletter",
  "/admin/prompt-management",
  "/admin/announcements",
  "/admin/trending-threats",
  "/admin/feedback",
  "/admin/content",
  "/admin/change-password",
]);

const DYNAMIC_ROUTE_PREFIXES = [
  "/training/",
  "/guides/",
  "/alerts/",
  "/scam-intel/",
  "/scams/",
  "/topics/",
  "/report/",
  "/news/",
  "/shield/",
  "/admin/",
];

function isKnownRoute(url: string): boolean {
  let pathname = url.split("?")[0].split("#")[0];
  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  if (KNOWN_CLIENT_ROUTES.has(pathname)) {
    return true;
  }
  for (const prefix of DYNAMIC_ROUTE_PREFIXES) {
    if (pathname.startsWith(prefix) && pathname.length > prefix.length) {
      return true;
    }
  }
  return false;
}

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugParts = resolvedParams.slug || [];
  const path = slugParts.length > 0 ? `/${slugParts.join("/")}` : "/";

  if (!isKnownRoute(path)) {
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
  const resolvedParams = await params;
  const slugParts = resolvedParams.slug || [];
  const path = slugParts.length > 0 ? `/${slugParts.join("/")}` : "/";

  if (!isKnownRoute(path)) {
    notFound();
  }

  return <ClientApp />;
}
