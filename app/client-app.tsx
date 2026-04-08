"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useEffect } from "react";

const AppShell = dynamic(() => import("@/App"), { ssr: false });

const pages: Record<string, ComponentType> = {
  home: dynamic(() => import("@/pages/home"), { ssr: false }),
  tools: dynamic(() => import("@/pages/tools"), { ssr: false }),
  resources: dynamic(() => import("@/pages/resources"), { ssr: false }),
  about: dynamic(() => import("@/pages/about"), { ssr: false }),
  contact: dynamic(() => import("@/pages/contact"), { ssr: false }),
  privacy: dynamic(() => import("@/pages/privacy"), { ssr: false }),
  terms: dynamic(() => import("@/pages/terms"), { ssr: false }),
  "emergency-help": dynamic(() => import("@/pages/emergency-help"), { ssr: false }),
  kids: dynamic(() => import("@/pages/kids"), { ssr: false }),
  seniors: dynamic(() => import("@/pages/seniors"), { ssr: false }),
  parents: dynamic(() => import("@/pages/parents"), { ssr: false }),
  support: dynamic(() => import("@/pages/support"), { ssr: false }),
  security: dynamic(() => import("@/pages/security"), { ssr: false }),
  "our-mission": dynamic(() => import("@/pages/our-mission"), { ssr: false }),
  pricing: dynamic(() => import("@/pages/pricing"), { ssr: false }),
  "gcr-guard-pricing": dynamic(() => import("@/pages/gcr-guard-pricing"), { ssr: false }),
  "data-shield-pricing": dynamic(() => import("@/pages/data-shield-pricing"), { ssr: false }),
  "extension-auth": dynamic(() => import("@/pages/extension-auth"), { ssr: false }),
  "support-the-mission": dynamic(() => import("@/pages/support-the-mission"), { ssr: false }),
  dashboard: dynamic(() => import("@/pages/dashboard"), { ssr: false }),
  account: dynamic(() => import("@/pages/account"), { ssr: false }),
  "threat-trends": dynamic(() => import("@/pages/threat-trends"), { ssr: false }),
  "cyber-threat-radar": dynamic(() => import("@/pages/cyber-threat-radar"), { ssr: false }),
  "awareness-hub": dynamic(() => import("@/pages/awareness-hub"), { ssr: false }),
  "report-scam": dynamic(() => import("@/pages/report-scam"), { ssr: false }),
  checklists: dynamic(() => import("@/pages/checklists"), { ssr: false }),
  "data-removal": dynamic(() => import("@/pages/data-removal"), { ssr: false }),
  "ai-prompts": dynamic(() => import("@/pages/ai-prompts"), { ssr: false }),
  "ai-safety": dynamic(() => import("@/pages/ai-safety"), { ssr: false }),
  news: dynamic(() => import("@/pages/news"), { ssr: false }),
  "news-article": dynamic(() => import("@/pages/news-article"), { ssr: false }),
  "cyber-hygiene": dynamic(() => import("@/pages/cyber-hygiene"), { ssr: false }),
  "password-generator": dynamic(() => import("@/pages/password-generator"), { ssr: false }),
  "breach-dashboard": dynamic(() => import("@/pages/breach-dashboard"), { ssr: false }),
  search: dynamic(() => import("@/pages/search"), { ssr: false }),
  "parent-guide": dynamic(() => import("@/pages/parent-guide"), { ssr: false }),
  "small-business": dynamic(() => import("@/pages/small-business"), { ssr: false }),
  educators: dynamic(() => import("@/pages/educators"), { ssr: false }),
  "travel-safety": dynamic(() => import("@/pages/travel-safety"), { ssr: false }),
  accessibility: dynamic(() => import("@/pages/accessibility"), { ssr: false }),
  advertise: dynamic(() => import("@/pages/advertise"), { ssr: false }),
  "partner-deck": dynamic(() => import("@/pages/partner-deck"), { ssr: false }),
  feedback: dynamic(() => import("@/pages/feedback"), { ssr: false }),
  experience: dynamic(() => import("@/pages/experience"), { ssr: false }),
  "checkout-success": dynamic(() => import("@/pages/checkout-success"), { ssr: false }),
  preferences: dynamic(() => import("@/pages/preferences"), { ssr: false }),
  "printable-guides": dynamic(() => import("@/pages/printable-guides"), { ssr: false }),
  "quick-assessment": dynamic(() => import("@/pages/quick-assessment"), { ssr: false }),
  "safety-score": dynamic(() => import("@/pages/safety-score"), { ssr: false }),
  "scam-checker": dynamic(() => import("@/pages/scam-checker"), { ssr: false }),
  "browser-extension": dynamic(() => import("@/pages/browser-extension"), { ssr: false }),
  "scan-report": dynamic(() => import("@/pages/scan-report"), { ssr: false }),
  "scam-page": dynamic(() => import("@/pages/scam-page"), { ssr: false }),
  "topic-hub": dynamic(() => import("@/pages/topic-hub"), { ssr: false }),
  faq: dynamic(() => import("@/pages/faq"), { ssr: false }),
  guides: dynamic(() => import("@/pages/guides"), { ssr: false }),
  "guide-detail": dynamic(() => import("@/pages/guide-detail"), { ssr: false }),
  alerts: dynamic(() => import("@/pages/alerts-listing"), { ssr: false }),
  "alert-detail": dynamic(() => import("@/pages/alert-detail"), { ssr: false }),
  "scam-intel": dynamic(() => import("@/pages/scam-intel-listing"), { ssr: false }),
  "scam-intel-detail": dynamic(() => import("@/pages/scam-intel-detail"), { ssr: false }),
  shield: dynamic(() => import("@/pages/shield"), { ssr: false }),
  "shield-results": dynamic(() => import("@/pages/shield-results"), { ssr: false }),
  "shield-next-steps": dynamic(() => import("@/pages/shield-next-steps"), { ssr: false }),
  training: dynamic(() => import("@/pages/training"), { ssr: false }),
  "training-path": dynamic(() => import("@/pages/training-path"), { ssr: false }),
  "training-lesson": dynamic(() => import("@/pages/training-lesson"), { ssr: false }),
  "training-quiz": dynamic(() => import("@/pages/training-quiz"), { ssr: false }),
  admin: dynamic(() => import("@/pages/admin/index"), { ssr: false }),
  "admin-users": dynamic(() => import("@/pages/admin/users"), { ssr: false }),
  "admin-messages": dynamic(() => import("@/pages/admin/messages"), { ssr: false }),
  "admin-subscribers": dynamic(() => import("@/pages/admin/subscribers"), { ssr: false }),
  "admin-scam-reports": dynamic(() => import("@/pages/admin/scam-reports"), { ssr: false }),
  "admin-scan-management": dynamic(() => import("@/pages/admin/scan-management"), { ssr: false }),
  "admin-tool-analytics": dynamic(() => import("@/pages/admin/tool-analytics"), { ssr: false }),
  "admin-security": dynamic(() => import("@/pages/admin-security"), { ssr: false }),
  "admin-threat-intelligence": dynamic(() => import("@/pages/admin-threat-intelligence"), { ssr: false }),
  "admin-content-governance": dynamic(() => import("@/pages/admin-content-governance"), { ssr: false }),
  "admin-compliance": dynamic(() => import("@/pages/admin-compliance"), { ssr: false }),
  "admin-newsletter": dynamic(() => import("@/pages/admin-newsletter"), { ssr: false }),
  "admin-prompt-management": dynamic(() => import("@/pages/admin-prompt-management"), { ssr: false }),
  "admin-announcements": dynamic(() => import("@/pages/admin/announcements"), { ssr: false }),
  "admin-trending-threats": dynamic(() => import("@/pages/admin/trending-threats"), { ssr: false }),
  "admin-feedback": dynamic(() => import("@/pages/admin/feedback"), { ssr: false }),
  "admin-content": dynamic(() => import("@/pages/admin/content-manager"), { ssr: false }),
  "admin-engagement": dynamic(() => import("@/pages/admin/engagement-opportunities"), { ssr: false }),
  "admin-change-password": dynamic(() => import("@/pages/admin/change-password"), { ssr: false }),
  login: dynamic(() => import("@/pages/login"), { ssr: false }),
  register: dynamic(() => import("@/pages/register"), { ssr: false }),
  "forgot-password": dynamic(() => import("@/pages/forgot-password"), { ssr: false }),
  "child-safety-scanner": dynamic(() => import("@/pages/child-safety-scanner"), { ssr: false }),
  "not-found": dynamic(() => import("@/pages/not-found"), { ssr: false }),
  "resources-glossary": dynamic(() => import("@/pages/resources/glossary"), { ssr: false }),
  "resources-cheat-sheets": dynamic(() => import("@/pages/resources/cheat-sheets"), { ssr: false }),
};

export default function ClientApp({ page = "home" }: { page?: string }) {
  const PageComponent = pages[page] || pages["not-found"];

  useEffect(() => {
    document.querySelectorAll("[data-ssr]").forEach((el) => el.remove());
  }, []);

  return (
    <AppShell>
      <PageComponent />
    </AppShell>
  );
}
