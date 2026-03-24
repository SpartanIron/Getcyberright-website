import { storage } from "./storage";
import { SCAM_PAGES, getAllScamSlugs } from "@shared/scam-content";
import { isKnownRoute } from "./known-routes";
import type { Request, Response, NextFunction } from "express";

const BOT_PATTERN = /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|ia_archiver|msnbot|semrushbot|ahrefsbot|mj12bot|rogerbot|dotbot|petalbot|bytespider|gptbot|anthropic-ai|claude-web|claudebot|google-extended|chatgpt-user|oai-searchbot|perplexitybot|cohere-ai|youbot|amazonbot|meta-externalagent|meta-externalfetcher|iaskspider|phind-search/i;

function isBot(userAgent: string | undefined): boolean {
  if (!userAgent) return false;
  return BOT_PATTERN.test(userAgent);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildHead(meta: {
  title: string;
  description: string;
  url: string;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}): string {
  const canonical = `https://www.getcyberright.com${meta.url}`;
  const ogType = meta.type || "article";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:site_name" content="GetCyberRight">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://www.getcyberright.com/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(meta.description)}">
  ${meta.publishedTime ? `<meta property="article:published_time" content="${meta.publishedTime}">` : ""}
  ${meta.modifiedTime ? `<meta property="article:modified_time" content="${meta.modifiedTime}">` : ""}
  ${meta.section ? `<meta property="article:section" content="${escapeHtml(meta.section)}">` : ""}
  ${(meta.tags || []).map(t => `<meta property="article:tag" content="${escapeHtml(t)}">`).join("\n  ")}
  <link rel="icon" type="image/png" href="/favicon.png">
  <meta name="theme-color" content="#0d9488">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>`;
}

function safeJsonLd(data: any): string {
  const json = JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
  return `<script type="application/ld+json">${json}</script>`;
}

function buildJsonLd(data: any): string {
  return safeJsonLd(data);
}

function buildBreadcrumbs(items: { name: string; url: string }[]): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://www.getcyberright.com${item.url}`,
    })),
  };
  return buildJsonLd(schema);
}

function buildFaqSchema(faqs: { question: string; answer: string }[]): string {
  if (!faqs || faqs.length === 0) return "";
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return buildJsonLd(schema);
}

function buildArticleSchema(data: {
  title: string;
  description: string;
  url: string;
  publishedAt?: string;
  updatedAt?: string;
  tags?: string[];
}): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    url: `https://www.getcyberright.com${data.url}`,
    publisher: {
      "@type": "Organization",
      name: "GetCyberRight",
      url: "https://www.getcyberright.com",
    },
    datePublished: data.publishedAt || new Date().toISOString(),
    dateModified: data.updatedAt || data.publishedAt || new Date().toISOString(),
    keywords: data.tags?.join(", "),
  };
  return buildJsonLd(schema);
}

function buildSiteNav(): string {
  return `
<nav aria-label="Main navigation" style="background:#f8fffe;border:1px solid #e0f2f1;border-radius:8px;padding:24px;margin-top:30px;font-family:Sora,sans-serif;font-size:14px;color:#333;">
  <h2 style="font-size:16px;margin:0 0 16px;color:#0A2A3C;">Explore GetCyberRight</h2>
  <div style="display:flex;flex-wrap:wrap;gap:24px;">
    <div style="min-width:180px;">
      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:#666;margin:0 0 8px;">Security Tools</h3>
      <ul style="list-style:none;padding:0;margin:0;line-height:2;">
        <li><a href="/tools" style="color:#0d9488;">All Tools</a></li>
        <li><a href="/scam-checker" style="color:#0d9488;">GCR Scam Guard</a></li>
        <li><a href="/password-generator" style="color:#0d9488;">Password Generator</a></li>
        <li><a href="/data-removal" style="color:#0d9488;">Data Broker Removal</a></li>
        <li><a href="/breach-dashboard" style="color:#0d9488;">Breach Monitor</a></li>
        <li><a href="/cyber-threat-radar" style="color:#0d9488;">Cyber Threat Radar</a></li>
        <li><a href="/quick-assessment" style="color:#0d9488;">Quick Assessment</a></li>
        <li><a href="/safety-score" style="color:#0d9488;">Safety Score</a></li>
        <li><a href="/cyber-hygiene" style="color:#0d9488;">Cyber Hygiene</a></li>
        <li><a href="/parents/child-safety-scanner" style="color:#0d9488;">Child Safety Scanner</a></li>
      </ul>
    </div>
    <div style="min-width:180px;">
      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:#666;margin:0 0 8px;">Safety Hubs</h3>
      <ul style="list-style:none;padding:0;margin:0;line-height:2;">
        <li><a href="/kids" style="color:#0d9488;">Kids Safety</a></li>
        <li><a href="/seniors" style="color:#0d9488;">Seniors Safety</a></li>
        <li><a href="/parents" style="color:#0d9488;">Parents Hub</a></li>
        <li><a href="/parent-guide" style="color:#0d9488;">Parent's Guide</a></li>
        <li><a href="/educators" style="color:#0d9488;">Educator Resources</a></li>
        <li><a href="/small-business" style="color:#0d9488;">Small Business</a></li>
        <li><a href="/ai-safety" style="color:#0d9488;">AI Safety</a></li>
        <li><a href="/travel-safety" style="color:#0d9488;">Travel Safety</a></li>
        <li><a href="/emergency-help" style="color:#0d9488;">Emergency Help</a></li>
        <li><a href="/report-scam" style="color:#0d9488;">Report a Scam</a></li>
      </ul>
    </div>
    <div style="min-width:180px;">
      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:#666;margin:0 0 8px;">Learn & Train</h3>
      <ul style="list-style:none;padding:0;margin:0;line-height:2;">
        <li><a href="/training" style="color:#0d9488;">Training Academy</a></li>
        <li><a href="/guides" style="color:#0d9488;">Safety Guides</a></li>
        <li><a href="/alerts" style="color:#0d9488;">Threat Alerts</a></li>
        <li><a href="/scam-intel" style="color:#0d9488;">Scam Intelligence</a></li>
        <li><a href="/threat-trends" style="color:#0d9488;">Threat Trends</a></li>
        <li><a href="/news" style="color:#0d9488;">Cybersecurity News</a></li>
        <li><a href="/ai-prompts" style="color:#0d9488;">AI Prompt Library</a></li>
        <li><a href="/awareness-hub" style="color:#0d9488;">Awareness Hub</a></li>
        <li><a href="/checklists" style="color:#0d9488;">Security Checklists</a></li>
        <li><a href="/printable-guides" style="color:#0d9488;">Printable Guides</a></li>
        <li><a href="/resources" style="color:#0d9488;">All Resources</a></li>
        <li><a href="/resources/glossary" style="color:#0d9488;">Glossary</a></li>
        <li><a href="/resources/cheat-sheets" style="color:#0d9488;">Cheat Sheets</a></li>
      </ul>
    </div>
    <div style="min-width:180px;">
      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:#666;margin:0 0 8px;">Topic Hubs</h3>
      <ul style="list-style:none;padding:0;margin:0;line-height:2;">
        <li><a href="/topics/identity-theft" style="color:#0d9488;">Identity Theft</a></li>
        <li><a href="/topics/online-scams" style="color:#0d9488;">Online Scams</a></li>
        <li><a href="/topics/phishing-attacks" style="color:#0d9488;">Phishing Attacks</a></li>
        <li><a href="/topics/cyber-safety-seniors" style="color:#0d9488;">Senior Cyber Safety</a></li>
        <li><a href="/topics/cyber-safety-kids" style="color:#0d9488;">Kids Cyber Safety</a></li>
        <li><a href="/topics/password-security" style="color:#0d9488;">Password Security</a></li>
        <li><a href="/topics/privacy-protection" style="color:#0d9488;">Privacy Protection</a></li>
        <li><a href="/topics/device-security" style="color:#0d9488;">Device Security</a></li>
        <li><a href="/topics/data-breaches" style="color:#0d9488;">Data Breaches</a></li>
        <li><a href="/topics/social-media-security" style="color:#0d9488;">Social Media Security</a></li>
      </ul>
    </div>
    <div style="min-width:180px;">
      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:#666;margin:0 0 8px;">Company</h3>
      <ul style="list-style:none;padding:0;margin:0;line-height:2;">
        <li><a href="/about" style="color:#0d9488;">About Us</a></li>
        <li><a href="/our-mission" style="color:#0d9488;">Our Mission</a></li>
        <li><a href="/contact" style="color:#0d9488;">Contact</a></li>
        <li><a href="/support" style="color:#0d9488;">Support</a></li>
        <li><a href="/faq" style="color:#0d9488;">FAQ</a></li>
        <li><a href="/feedback" style="color:#0d9488;">Feedback</a></li>
        <li><a href="/support-the-mission" style="color:#0d9488;">Support the Mission</a></li>
        <li><a href="/pricing" style="color:#0d9488;">Plans & Pricing</a></li>
        <li><a href="/experience" style="color:#0d9488;">The Experience</a></li>
        <li><a href="/advertise" style="color:#0d9488;">Advertise</a></li>
        <li><a href="/partner-deck" style="color:#0d9488;">Partnerships</a></li>
        <li><a href="/security" style="color:#0d9488;">Security Practices</a></li>
        <li><a href="/privacy" style="color:#0d9488;">Privacy Policy</a></li>
        <li><a href="/terms" style="color:#0d9488;">Terms of Service</a></li>
        <li><a href="/accessibility" style="color:#0d9488;">Accessibility</a></li>
        <li><a href="/search" style="color:#0d9488;">Search</a></li>
      </ul>
    </div>
  </div>
</nav>`;
}

function buildFooter(): string {
  return `
${buildSiteNav()}
<footer style="padding:40px 20px;text-align:center;color:#666;font-family:Sora,sans-serif;font-size:14px;border-top:1px solid #e5e7eb;margin-top:20px;">
  <nav style="margin-bottom:20px;">
    <a href="/" style="margin:0 12px;color:#0d9488;">Home</a>
    <a href="/guides" style="margin:0 12px;color:#0d9488;">Guides</a>
    <a href="/scam-intel" style="margin:0 12px;color:#0d9488;">Scam Intelligence</a>
    <a href="/tools" style="margin:0 12px;color:#0d9488;">Tools</a>
    <a href="/training" style="margin:0 12px;color:#0d9488;">Training</a>
    <a href="/about" style="margin:0 12px;color:#0d9488;">About</a>
    <a href="/contact" style="margin:0 12px;color:#0d9488;">Contact</a>
  </nav>
  <p>&copy; ${new Date().getFullYear()} GetCyberRight. Cybersecurity education for everyone. Free to get started.</p>
</footer>`;
}

async function renderGuidePage(slug: string): Promise<string | null> {
  const guide = await storage.getGuideBySlug(slug);
  if (!guide || guide.status !== "published") return null;

  const head = buildHead({
    title: `${guide.title} | GetCyberRight`,
    description: guide.metaDescription || guide.title,
    url: `/guides/${guide.slug}`,
    publishedTime: guide.publishedAt?.toISOString(),
    modifiedTime: guide.updatedAt?.toISOString(),
    section: guide.category,
    tags: guide.tags || [],
  });

  const breadcrumbs = buildBreadcrumbs([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: guide.title, url: `/guides/${guide.slug}` },
  ]);

  const article = buildArticleSchema({
    title: guide.title,
    description: guide.metaDescription || "",
    url: `/guides/${guide.slug}`,
    publishedAt: guide.publishedAt?.toISOString(),
    updatedAt: guide.updatedAt?.toISOString(),
    tags: guide.tags || [],
  });

  const sections = Array.isArray(guide.sections) ? guide.sections : [];
  const faqSection = sections.find((s: any) => s.type === "faq" || s.title?.toLowerCase().includes("faq"));
  const faqItems = faqSection && Array.isArray((faqSection as any).items) ? (faqSection as any).items : [];
  const faqSchema = buildFaqSchema(faqItems);

  const bodyContent = sections.map((section: any) => {
    if (section.type === "faq" && Array.isArray(section.items)) {
      return `<section><h2>${escapeHtml(section.title || "Frequently Asked Questions")}</h2>${section.items.map((item: any) => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join("")}</section>`;
    }
    return `<section><h2>${escapeHtml(section.title || "")}</h2><div>${escapeHtml(section.content || "")}</div></section>`;
  }).join("");

  return `${head}
<body style="font-family:Sora,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  ${breadcrumbs}
  ${article}
  ${faqSchema}
  <article>
    <h1>${escapeHtml(guide.title)}</h1>
    <p style="color:#666;font-size:14px;">${guide.category ? `Category: ${escapeHtml(guide.category)}` : ""} ${guide.publishedAt ? `| Published: ${guide.publishedAt.toLocaleDateString()}` : ""}</p>
    <p style="font-size:18px;color:#444;">${escapeHtml(guide.metaDescription || "")}</p>
    ${bodyContent}
    ${guide.tags && guide.tags.length > 0 ? `<p>Tags: ${guide.tags.map(t => `<a href="/guides?tag=${encodeURIComponent(t)}">${escapeHtml(t)}</a>`).join(", ")}</p>` : ""}
  </article>
  <nav style="margin-top:30px;padding:20px;background:#f0fdfa;border-radius:8px;">
    <h2>Related Resources</h2>
    <ul>
      <li><a href="/guides">Browse All Guides</a></li>
      <li><a href="/scam-checker">GCR Scam Guard</a></li>
      <li><a href="/tools">Security Tools</a></li>
      <li><a href="/training">Training Academy</a></li>
    </ul>
  </nav>
  ${buildFooter()}
  <div id="root"></div>

</body></html>`;
}

async function renderAlertPage(slug: string): Promise<string | null> {
  const alerts = await storage.getPublishedThreatAlerts();
  const alert = alerts.find(a => a.slug === slug);
  if (!alert) return null;

  const head = buildHead({
    title: `${alert.threatName} - Cyber Threat Alert | GetCyberRight`,
    description: alert.description?.substring(0, 160) || alert.threatName,
    url: `/alerts/${alert.slug}`,
    publishedTime: alert.publishedAt?.toISOString(),
    section: alert.category,
    tags: alert.affectedPlatforms || [],
  });

  const breadcrumbs = buildBreadcrumbs([
    { name: "Home", url: "/" },
    { name: "Threat Alerts", url: "/alerts" },
    { name: alert.threatName, url: `/alerts/${alert.slug}` },
  ]);

  const article = buildArticleSchema({
    title: alert.threatName,
    description: alert.description || "",
    url: `/alerts/${alert.slug}`,
    publishedAt: alert.publishedAt?.toISOString(),
    tags: alert.affectedPlatforms || [],
  });

  return `${head}
<body style="font-family:Sora,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  ${breadcrumbs}
  ${article}
  <article>
    <h1>${escapeHtml(alert.threatName)}</h1>
    <div style="display:flex;gap:8px;margin:12px 0;">
      <span style="background:#fef2f2;color:#b91c1c;padding:4px 12px;border-radius:16px;font-size:13px;">Severity: ${escapeHtml(alert.severityLevel || "")}</span>
      <span style="background:#eff6ff;color:#1d4ed8;padding:4px 12px;border-radius:16px;font-size:13px;">${escapeHtml(alert.category || "")}</span>
    </div>
    <p style="font-size:18px;color:#444;">${escapeHtml(alert.description || "")}</p>
    ${alert.technicalDetails ? `<section><h2>Technical Details</h2><p>${escapeHtml(alert.technicalDetails)}</p></section>` : ""}
    ${alert.mitigationSteps && alert.mitigationSteps.length > 0 ? `<section><h2>How to Protect Yourself</h2><ul>${alert.mitigationSteps.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ul></section>` : ""}
    ${alert.affectedPlatforms && alert.affectedPlatforms.length > 0 ? `<p>Affected Platforms: ${alert.affectedPlatforms.map(p => escapeHtml(p)).join(", ")}</p>` : ""}
  </article>
  <nav style="margin-top:30px;padding:20px;background:#f0fdfa;border-radius:8px;">
    <h2>Stay Protected</h2>
    <ul>
      <li><a href="/alerts">All Threat Alerts</a></li>
      <li><a href="/scam-checker">Check a Suspicious Link</a></li>
      <li><a href="/guides">Cybersecurity Guides</a></li>
    </ul>
  </nav>
  ${buildFooter()}
  <div id="root"></div>

</body></html>`;
}

async function renderScamIntelPage(slug: string): Promise<string | null> {
  const scams = await storage.getPublishedScamIntel();
  const scam = scams.find(s => s.slug === slug);
  if (!scam) return null;

  const head = buildHead({
    title: `${scam.scamName} - Scam Intelligence | GetCyberRight`,
    description: scam.metaDescription || `Learn about ${scam.scamName} and how to protect yourself.`,
    url: `/scam-intel/${scam.slug}`,
    publishedTime: scam.publishedAt?.toISOString(),
    section: scam.scamCategory,
    tags: scam.platformUsed || [],
  });

  const breadcrumbs = buildBreadcrumbs([
    { name: "Home", url: "/" },
    { name: "Scam Intelligence", url: "/scam-intel" },
    { name: scam.scamName, url: `/scam-intel/${scam.slug}` },
  ]);

  const article = buildArticleSchema({
    title: scam.scamName,
    description: scam.metaDescription || "",
    url: `/scam-intel/${scam.slug}`,
    publishedAt: scam.publishedAt?.toISOString(),
    tags: scam.platformUsed || [],
  });

  return `${head}
<body style="font-family:Sora,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  ${breadcrumbs}
  ${article}
  <article>
    <h1>${escapeHtml(scam.scamName)}</h1>
    <div style="display:flex;gap:8px;margin:12px 0;">
      <span style="background:#fef2f2;color:#b91c1c;padding:4px 12px;border-radius:16px;font-size:13px;">Risk: ${escapeHtml(scam.riskLevel || "")}</span>
      <span style="background:#f5f3ff;color:#6d28d9;padding:4px 12px;border-radius:16px;font-size:13px;">${escapeHtml(scam.scamCategory || "")}</span>
    </div>
    ${scam.metaDescription ? `<p style="font-size:18px;color:#444;">${escapeHtml(scam.metaDescription)}</p>` : ""}
    ${scam.howItWorks && Array.isArray(scam.howItWorks) ? `<section><h2>How This Scam Works</h2><ol>${(scam.howItWorks as any[]).map(step => `<li><strong>${escapeHtml(step.title || "")}</strong>: ${escapeHtml(step.description || "")}</li>`).join("")}</ol></section>` : typeof scam.howItWorks === "string" ? `<section><h2>How This Scam Works</h2><p>${escapeHtml(scam.howItWorks)}</p></section>` : ""}
    ${scam.warningSigns && scam.warningSigns.length > 0 ? `<section><h2>Warning Signs</h2><ul>${scam.warningSigns.map(f => `<li>${escapeHtml(f)}</li>`).join("")}</ul></section>` : ""}
    ${scam.preventionTips && scam.preventionTips.length > 0 ? `<section><h2>How to Protect Yourself</h2><ul>${scam.preventionTips.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ul></section>` : ""}
    ${scam.exampleMessages && Array.isArray(scam.exampleMessages) && scam.exampleMessages.length > 0 ? `<section><h2>Example Scam Messages</h2><ul>${(scam.exampleMessages as any[]).map(m => `<li><strong>${escapeHtml(m.context || "")}</strong>: "${escapeHtml(m.message || "")}"</li>`).join("")}</ul></section>` : ""}
    ${scam.faq && Array.isArray(scam.faq) && scam.faq.length > 0 ? `<section><h2>Frequently Asked Questions</h2>${(scam.faq as any[]).map(f => `<h3>${escapeHtml(f.question || "")}</h3><p>${escapeHtml(f.answer || "")}</p>`).join("")}</section>` : ""}
    ${scam.targetAudience && scam.targetAudience.length > 0 ? `<p>Who is targeted: ${scam.targetAudience.map(t => escapeHtml(t)).join(", ")}</p>` : ""}
    ${scam.platformUsed && scam.platformUsed.length > 0 ? `<p>Platforms used: ${scam.platformUsed.map(p => escapeHtml(p)).join(", ")}</p>` : ""}
  </article>
  <nav style="margin-top:30px;padding:20px;background:#f0fdfa;border-radius:8px;">
    <h2>Related Resources</h2>
    <ul>
      <li><a href="/scam-intel">Scam Intelligence Center</a></li>
      <li><a href="/scam-checker">Check a Scam</a></li>
      <li><a href="/report-scam">Report a Scam</a></li>
    </ul>
  </nav>
  ${buildFooter()}
  <div id="root"></div>

</body></html>`;
}

function renderScamPage(slug: string): string | null {
  const scam = SCAM_PAGES.find(s => s.slug === slug);
  if (!scam) return null;

  const head = buildHead({
    title: scam.metaTitle,
    description: scam.metaDescription,
    url: `/scams/${scam.slug}`,
    tags: scam.keywords,
  });

  const breadcrumbs = buildBreadcrumbs([
    { name: "Home", url: "/" },
    { name: "Scam Database", url: "/scams" },
    { name: scam.title, url: `/scams/${scam.slug}` },
  ]);

  const article = buildArticleSchema({
    title: scam.title,
    description: scam.metaDescription,
    url: `/scams/${scam.slug}`,
    publishedAt: scam.lastUpdated,
    tags: scam.keywords,
  });

  const faqSchema = buildFaqSchema(scam.faq);

  return `${head}
<body style="font-family:Sora,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  ${breadcrumbs}
  ${article}
  ${faqSchema}
  <article>
    <h1>${escapeHtml(scam.title)}</h1>
    <p style="font-size:14px;color:#666;">Last updated: ${scam.lastUpdated} | Keywords: ${scam.keywords.join(", ")}</p>
    <section><h2>Overview</h2><p>${escapeHtml(scam.overview)}</p></section>
    <section><h2>How This Scam Works</h2><ol>${scam.howItWorks.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ol></section>
    <section><h2>Warning Signs</h2><ul>${scam.warningSigns.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ul></section>
    <section><h2>Real Examples</h2>${scam.exampleMessages.map(m => `<div style="background:#f9fafb;padding:16px;border-radius:8px;margin:12px 0;"><strong>${escapeHtml(m.type)}</strong><p style="font-style:italic;">"${escapeHtml(m.content)}"</p></div>`).join("")}</section>
    <section><h2>How to Protect Yourself</h2>${scam.preventionSteps.map(s => `<div style="margin:12px 0;"><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.description)}</p></div>`).join("")}</section>
    <section><h2>Frequently Asked Questions</h2>${scam.faq.map(f => `<div style="margin:16px 0;"><h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p></div>`).join("")}</section>
    ${scam.relatedScams.length > 0 ? `<section><h2>Related Scams</h2><ul>${scam.relatedScams.map(s => `<li><a href="/scams/${s}">${s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</a></li>`).join("")}</ul></section>` : ""}
  </article>
  <nav style="margin-top:30px;padding:20px;background:#f0fdfa;border-radius:8px;">
    <h2>Protect Yourself</h2>
    <ul>
      <li><a href="/scam-checker">Check a Suspicious Link or Message</a></li>
      <li><a href="/scam-intel">Scam Intelligence Center</a></li>
      <li><a href="/guides">Cybersecurity Guides</a></li>
      <li><a href="/report-scam">Report a Scam</a></li>
    </ul>
  </nav>
  ${buildFooter()}
  <div id="root"></div>

</body></html>`;
}

async function renderTopicHub(cluster: string): Promise<string | null> {
  const clusterNames: Record<string, string> = {
    "identity-theft": "Identity Theft Protection",
    "phishing-attacks": "Phishing Attacks",
    "online-scams": "Online Scams",
    "password-security": "Password Security",
    "privacy-protection": "Privacy Protection",
    "device-security": "Device Security",
    "data-breaches": "Data Breaches",
    "social-media-security": "Social Media Security",
    "cyber-safety-seniors": "Cyber Safety for Seniors",
    "cyber-safety-kids": "Cyber Safety for Kids",
  };

  const clusterName = clusterNames[cluster];
  if (!clusterName) return null;

  const guides = await storage.getPublishedGuides();
  const scamIntel = await storage.getPublishedScamIntel();
  const alerts = await storage.getPublishedThreatAlerts();

  const relatedGuides = guides.filter(g => g.category === cluster || (g.tags || []).some(t => t.toLowerCase().includes(cluster.replace(/-/g, " "))));
  const relatedScams = SCAM_PAGES.filter(s => s.cluster === cluster);
  const relatedScamIntel = scamIntel.filter(s => s.scamCategory?.toLowerCase().includes(cluster.replace(/-/g, " ")) || cluster === "online-scams");
  const relatedAlerts = alerts.filter(a => a.category?.toLowerCase().includes(cluster.replace(/-/g, " ")));

  const head = buildHead({
    title: `${clusterName}: Complete Guide & Resources | GetCyberRight`,
    description: `Everything you need to know about ${clusterName.toLowerCase()}. Browse guides, scam reports, threat alerts, and protection tools.`,
    url: `/topics/${cluster}`,
  });

  const breadcrumbs = buildBreadcrumbs([
    { name: "Home", url: "/" },
    { name: "Topics", url: "/topics" },
    { name: clusterName, url: `/topics/${cluster}` },
  ]);

  return `${head}
<body style="font-family:Sora,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  ${breadcrumbs}
  <h1>${escapeHtml(clusterName)}</h1>
  <p style="font-size:18px;color:#444;">Your complete resource for understanding and protecting against ${clusterName.toLowerCase()}. Browse our guides, scam intelligence reports, and protection tools below.</p>
  
  ${relatedGuides.length > 0 ? `<section><h2>Guides</h2><ul>${relatedGuides.map(g => `<li><a href="/guides/${g.slug}">${escapeHtml(g.title)}</a></li>`).join("")}</ul></section>` : ""}
  
  ${relatedScams.length > 0 ? `<section><h2>Scam Pages</h2><ul>${relatedScams.map(s => `<li><a href="/scams/${s.slug}">${escapeHtml(s.title)}</a></li>`).join("")}</ul></section>` : ""}
  
  ${relatedScamIntel.length > 0 ? `<section><h2>Scam Intelligence Reports</h2><ul>${relatedScamIntel.slice(0, 10).map(s => `<li><a href="/scam-intel/${s.slug}">${escapeHtml(s.scamName)}</a> - Risk: ${escapeHtml(s.riskLevel || "")}</li>`).join("")}</ul></section>` : ""}
  
  ${relatedAlerts.length > 0 ? `<section><h2>Threat Alerts</h2><ul>${relatedAlerts.slice(0, 10).map(a => `<li><a href="/alerts/${a.slug}">${escapeHtml(a.threatName)}</a></li>`).join("")}</ul></section>` : ""}
  
  <section>
    <h2>Protection Tools</h2>
    <ul>
      <li><a href="/scam-checker">GCR Scam Guard</a> - Analyze suspicious links and messages</li>
      <li><a href="/password-generator">Password Generator</a> - Create strong, unique passwords</li>
      <li><a href="/data-removal">Data Broker Removal</a> - Remove your personal data from brokers</li>
      <li><a href="/breach-dashboard">Breach Dashboard</a> - Check if your data has been exposed</li>
    </ul>
  </section>
  
  <section>
    <h2>Related Topics</h2>
    <ul>
      ${Object.entries(clusterNames).filter(([k]) => k !== cluster).slice(0, 5).map(([k, v]) => `<li><a href="/topics/${k}">${escapeHtml(v)}</a></li>`).join("")}
    </ul>
  </section>
  
  ${buildFooter()}
  <div id="root"></div>

</body></html>`;
}

async function renderListingPage(type: "guides" | "scam-intel" | "alerts"): Promise<string> {
  const titles: Record<string, string> = {
    guides: "Cybersecurity Guides",
    "scam-intel": "Scam Intelligence Center",
    alerts: "Cyber Threat Alerts",
  };
  const descriptions: Record<string, string> = {
    guides: "Expert cybersecurity guides covering identity theft, phishing, password security, privacy protection, and more. Practical advice for families and individuals.",
    "scam-intel": "Live scam intelligence database. Track current scams, learn their tactics, and protect yourself from fraud.",
    alerts: "Real-time cyber threat alerts. Stay informed about the latest phishing campaigns, malware, and online fraud.",
  };

  const head = buildHead({
    title: `${titles[type]} | GetCyberRight`,
    description: descriptions[type],
    url: `/${type}`,
  });

  let listItems = "";

  if (type === "guides") {
    const guides = await storage.getPublishedGuides();
    listItems = guides.map(g => `<li style="margin:12px 0;"><a href="/guides/${g.slug}" style="font-size:16px;color:#0d9488;">${escapeHtml(g.title)}</a><p style="color:#666;margin:4px 0;">${escapeHtml(g.metaDescription || "")}</p></li>`).join("");
  } else if (type === "scam-intel") {
    const scams = await storage.getPublishedScamIntel();
    listItems = scams.map(s => `<li style="margin:12px 0;"><a href="/scam-intel/${s.slug}" style="font-size:16px;color:#0d9488;">${escapeHtml(s.scamName)}</a><span style="margin-left:8px;background:#fef2f2;color:#b91c1c;padding:2px 8px;border-radius:12px;font-size:12px;">${escapeHtml(s.riskLevel || "")}</span><p style="color:#666;margin:4px 0;">${escapeHtml(s.metaDescription || "")}</p></li>`).join("");
  } else if (type === "alerts") {
    const alerts = await storage.getPublishedThreatAlerts();
    listItems = alerts.map(a => `<li style="margin:12px 0;"><a href="/alerts/${a.slug}" style="font-size:16px;color:#0d9488;">${escapeHtml(a.threatName)}</a><span style="margin-left:8px;background:#fef2f2;color:#b91c1c;padding:2px 8px;border-radius:12px;font-size:12px;">${escapeHtml(a.severityLevel || "")}</span><p style="color:#666;margin:4px 0;">${escapeHtml(a.description?.substring(0, 200) || "")}</p></li>`).join("");
  }

  return `${head}
<body style="font-family:Sora,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  <h1>${escapeHtml(titles[type])}</h1>
  <p style="font-size:18px;color:#444;">${escapeHtml(descriptions[type])}</p>
  <ul style="list-style:none;padding:0;">${listItems}</ul>
  ${buildFooter()}
  <div id="root"></div>

</body></html>`;
}

interface StaticPageDef {
  title: string;
  description: string;
  path: string;
  schemaType?: string;
  faqs?: { question: string; answer: string }[];
  features?: string[];
  bodyContent?: string;
  relatedLinks?: { text: string; href: string }[];
}

const STATIC_TOOL_PAGES: Record<string, StaticPageDef> = {
  "/scam-checker": {
    title: "GCR Scam Guard: Analyze URLs, Emails, Messages & QR Codes",
    description: "Analyze suspicious URLs, emails, text messages, and QR codes with our AI-powered scam checker. Free manual scanning, no account required. Get instant safety reports checked against multiple trusted safety sources.",
    path: "/scam-checker",
    schemaType: "WebApplication",
    features: ["URL safety analysis", "Email scam detection", "QR code scanning", "Real-time safety checks", "Multi-source verification"],
    bodyContent: `<p>According to the FBI's Internet Crime Complaint Center (IC3), Americans lost over $10.3 billion to online scams in 2023 alone. Many of these scams start with a single suspicious link in an email, text message, or social media post. Our GCR Scam Guard helps you verify whether a link, email, or message is safe before you click.</p>
    <h2>How the GCR Scam Guard Works</h2>
    <p>When you submit a suspicious URL, email, or message, our system runs it through multiple trusted safety databases simultaneously. We check Google Safe Browsing, VirusTotal, URLhaus, and other sources to cross-reference threat data. The tool also examines the domain age, SSL certificate status, and known hosting patterns to identify newly created scam sites that other tools might miss.</p>
    <h2>What You Can Check</h2>
    <ul><li><strong>Suspicious URLs</strong> - Paste any link to see if it leads to a known scam, malware, or fake website</li><li><strong>Email messages</strong> - Copy the text of suspicious emails to check for common scam patterns</li><li><strong>Text messages (SMS)</strong> - Analyze those "urgent" texts claiming to be from your bank or delivery service</li><li><strong>QR codes</strong> - Upload an image of a QR code to reveal and check the hidden URL before scanning it with your phone</li></ul>
    <h2>Why Multiple Sources Matter</h2>
    <p>No single safety database catches every threat. A URL might be flagged by VirusTotal but not yet reported to Google Safe Browsing, or vice versa. By checking multiple sources at once, our scam checker gives you a more complete picture of a link's safety. This multi-source approach catches threats that single-source checkers miss.</p>
    <h2>Related Safety Guides</h2>
    <ul><li><a href="/guides/how-to-tell-if-text-message-is-scam">How to Tell If a Text Message Is a Scam: 9 Warning Signs</a></li><li><a href="/guides/is-this-email-real-how-to-check">Is This Email Real? How to Check If an Email Is Legitimate</a></li><li><a href="/guides/signs-someone-using-ai-to-scam-you">5 Signs Someone Is Using AI to Scam You</a></li><li><a href="/guides/facebook-marketplace-scams-buy-sell-safely">Facebook Marketplace Scams: How to Buy and Sell Safely</a></li><li><a href="/guides/romance-scam-warning-signs">Romance Scam Warning Signs</a></li></ul>`,
    relatedLinks: [
      { text: "Report a Scam", href: "/report-scam" },
      { text: "Scam Intelligence Center", href: "/scam-intel" },
      { text: "Emergency Help If You Were Scammed", href: "/emergency-help" },
      { text: "Password Generator", href: "/password-generator" },
    ],
    faqs: [
      { question: "How does the GCR Scam Guard work?", answer: "Our scam checker uses multiple trusted sources including Google Safe Browsing, VirusTotal, and URLhaus to analyze suspicious links, emails, and messages. It cross-references safety data to give you a safety score." },
      { question: "Is the GCR Scam Guard free to use?", answer: "Yes, the GCR Scam Guard is free to get started. You can analyze URLs, emails, text messages, and QR codes without any cost." },
      { question: "What types of scams can it detect?", answer: "Our tool can detect phishing links, malware-hosting URLs, fake websites, social engineering attempts, tech support scams, romance scams, and many other common online scams." },
      { question: "How accurate is the scam detection?", answer: "We use multiple verified safety sources and AI analysis for high accuracy. However, no tool is 100% accurate. Always exercise caution with suspicious communications." },
      { question: "How do I check if a text message is a scam?", answer: "Copy the text message content and paste it into the GCR Scam Guard. Our tool analyzes the message for common scam patterns, suspicious links, and known fraud tactics. Look for urgency, unknown senders, and requests for personal information." },
      { question: "Can I check if an email is legitimate?", answer: "Yes. Paste the email content or any links from the email into the GCR Scam Guard. We check sender patterns, link safety, and message content against known scam databases to help you verify if the email is real." },
      { question: "How do I scan a QR code for safety?", answer: "Upload an image of the QR code to our GCR Scam Guard. We decode the hidden URL and check it against multiple safety databases before you scan it with your phone, protecting you from malicious QR codes." },
    ],
  },
  "/password-generator": {
    title: "Secure Password Generator: Create Strong, Unique Passwords | GetCyberRight",
    description: "Generate strong, unique passwords instantly with our secure password generator. Customize length, character types, and complexity. Free to use, runs entirely in your browser.",
    path: "/password-generator",
    schemaType: "WebApplication",
    features: ["Custom password length", "Special character options", "Uppercase and lowercase mixing", "Number inclusion", "Password strength meter"],
    bodyContent: `<p>Weak passwords remain the number one way accounts get compromised. According to Verizon's Data Breach Investigations Report, over 80% of hacking-related breaches involve stolen or weak passwords. Our password generator creates strong, random passwords that are virtually impossible to guess.</p>
    <h2>How It Works</h2>
    <p>Our generator runs entirely in your browser. No passwords are ever sent to our servers or stored anywhere. You choose the length and character types (uppercase, lowercase, numbers, symbols), and the tool uses cryptographically secure randomness to create a password that would take millions of years to crack by brute force.</p>
    <h2>Tips for Better Password Security</h2>
    <ul><li>Use a unique password for every account. If one site gets breached, your other accounts stay safe.</li><li>Make passwords at least 14 characters long. Longer passwords are exponentially harder to crack.</li><li>Use a password manager to store your passwords securely. You only need to remember one master password.</li><li>Turn on two-factor authentication wherever it is available for an extra layer of protection.</li></ul>
    <h2>Related Guides</h2>
    <ul><li><a href="/guides/free-tools-check-passwords-leaked">Free Tools to Check If Your Passwords Were Leaked</a></li><li><a href="/guides/what-to-do-if-identity-stolen">What to Do If Your Identity Is Stolen</a></li></ul>`,
    relatedLinks: [
      { text: "Breach Monitor", href: "/breach-dashboard" },
      { text: "Cyber Hygiene Guide", href: "/cyber-hygiene" },
      { text: "Security Checklists", href: "/checklists" },
      { text: "GCR Scam Guard", href: "/scam-checker" },
    ],
    faqs: [
      { question: "What makes a strong password?", answer: "A strong password is at least 12 characters long and includes a mix of uppercase letters, lowercase letters, numbers, and special characters. It should not contain personal information or common words." },
      { question: "How often should I change my passwords?", answer: "Security experts now recommend changing passwords only when there is evidence of a breach. Using unique, strong passwords for each account with a password manager is more important than frequent changes." },
      { question: "Is this password generator safe to use?", answer: "Yes. Passwords are generated entirely in your browser and are never sent to our servers or stored anywhere. Your generated passwords remain completely private." },
      { question: "Should I use a password manager?", answer: "Absolutely. A password manager securely stores all your unique passwords so you only need to remember one master password. This is the best way to maintain strong, unique passwords for every account." },
      { question: "How do I know if my current password has been leaked?", answer: "Use our Breach Monitor to check if your email and associated passwords have appeared in any known data breaches. If your credentials were exposed, change the password immediately using this generator." },
      { question: "What is the best password length?", answer: "Security experts recommend at least 16 characters for maximum protection. Our generator defaults to strong lengths, and longer passwords are exponentially harder to crack by brute force." },
    ],
  },
  "/data-removal": {
    title: "Data Broker Removal: Remove Your Personal Information from 501+ Sites",
    description: "Protect your privacy by removing your personal information from 501+ data broker sites. Scan for your exposed data across people-search websites, marketing databases, and data aggregators. No account needed to get started.",
    path: "/data-removal",
    schemaType: "WebApplication",
    features: ["501+ data broker database", "Automated removal requests", "Progress tracking", "Privacy score assessment", "Continuous monitoring"],
    bodyContent: `<p>Your personal information, including your name, home address, phone number, email, and even family members' names, is likely listed on dozens of data broker websites right now. These sites collect and sell personal data from public records, social media, purchase history, and other sources. Anyone can search for you and find sensitive details in seconds.</p>
    <h2>The Scale of the Problem</h2>
    <p>There are over 4,000 data broker companies operating worldwide. The data brokerage industry is worth an estimated $250 billion per year. Our database covers 501+ of the most common data broker sites, including people-search engines like Spokeo, WhitePages, BeenVerified, and Intelius, as well as marketing data aggregators and background check services.</p>
    <h2>How Data Removal Works</h2>
    <ol><li><strong>Search</strong> - Enter your name and we identify which data broker sites have your information listed</li><li><strong>Generate opt-out requests</strong> - We create customized removal requests for each site following their specific opt-out procedures</li><li><strong>Submit and track</strong> - Follow the guided removal process and track which sites have processed your request</li><li><strong>Monitor</strong> - Check back periodically since data brokers often re-acquire your information over time</li></ol>
    <h2>Why Data Removal Matters</h2>
    <p>Having your personal information freely available online increases your risk of identity theft, targeted scams, stalking, and unwanted marketing. Removing your data from these sites is one of the most effective steps you can take to protect your privacy and your family's safety.</p>
    <h2>Related Guides</h2>
    <ul><li><a href="/guides/how-to-remove-personal-information-from-internet">How to Remove Your Personal Information from the Internet</a></li><li><a href="/guides/what-to-do-if-identity-stolen">What to Do If Your Identity Is Stolen</a></li></ul>`,
    relatedLinks: [
      { text: "Breach Monitor", href: "/breach-dashboard" },
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Cyber Hygiene", href: "/cyber-hygiene" },
      { text: "GCR Scam Guard", href: "/scam-checker" },
    ],
    faqs: [
      { question: "What are data brokers?", answer: "Data brokers are companies that collect, aggregate, and sell personal information. They gather data from public records, social media, purchase history, and other sources, then sell it to marketers, employers, and anyone willing to pay." },
      { question: "How does the data removal tool work?", answer: "Our tool searches 501+ known data broker sites for your personal information and generates opt-out requests. We guide you through the removal process for each site that has your data." },
      { question: "How long does data removal take?", answer: "Most data brokers process removal requests within 30 to 45 days, though some may take longer. Our tool tracks the status of each request so you can monitor progress." },
      { question: "Will my data stay removed permanently?", answer: "Data brokers may re-acquire your information over time. We recommend periodic checks and re-submissions. Our monitoring feature helps you stay on top of new listings." },
      { question: "Can removing my data prevent identity theft?", answer: "Yes. Reducing the amount of personal information available online makes it significantly harder for criminals to steal your identity, open fraudulent accounts, or target you with personalized scams." },
      { question: "How do data brokers get my personal information?", answer: "Data brokers collect information from public records, social media profiles, online purchases, surveys, loyalty programs, and other data brokers. Much of this happens without your knowledge or consent." },
      { question: "Is it free to remove my data from broker sites?", answer: "Yes, you have the right to request removal from most data broker sites for free. Our tool automates this process across 501+ broker sites at no cost to get started." },
    ],
  },
  "/breach-dashboard": {
    title: "Data Breach Monitor: Check If Your Email Has Been Compromised",
    description: "Monitor your email addresses for data breaches. Get instant alerts when your personal information appears in known data breaches. Protect your accounts before criminals exploit your data.",
    path: "/breach-dashboard",
    schemaType: "WebApplication",
    features: ["Email breach monitoring", "Real-time alerts", "Breach history tracking", "Security recommendations", "Multiple email support"],
    bodyContent: `<p>Data breaches exposed over 22 billion records in 2023, according to security researchers. If you have used the internet for more than a few years, there is a high chance that at least one of your accounts has been compromised in a breach. Our Breach Monitor lets you check if your email address appears in any known data breaches.</p>
    <h2>What Gets Exposed in a Data Breach</h2>
    <p>When a company gets breached, attackers typically steal email addresses, passwords (sometimes in plain text), names, phone numbers, and in more serious cases, financial information like credit card numbers. Even "minor" breaches that only expose your email and password can be dangerous if you reuse that same password on other accounts.</p>
    <h2>What to Do If Your Email Is Found</h2>
    <ol><li>Change the password for the breached account immediately</li><li>Change that same password anywhere else you used it</li><li>Turn on two-factor authentication for all important accounts</li><li>Watch your bank statements and credit reports for unusual activity</li><li>Consider placing a fraud alert or credit freeze with the three major credit bureaus</li></ol>
    <h2>Related Guides</h2>
    <ul><li><a href="/guides/free-tools-check-passwords-leaked">Free Tools to Check If Your Passwords Were Leaked</a></li><li><a href="/guides/what-to-do-if-identity-stolen">What to Do If Your Identity Is Stolen: Step-by-Step Recovery Guide</a></li></ul>`,
    relatedLinks: [
      { text: "Password Generator", href: "/password-generator" },
      { text: "Data Broker Removal", href: "/data-removal" },
      { text: "Emergency Help", href: "/emergency-help" },
      { text: "Cyber Hygiene", href: "/cyber-hygiene" },
    ],
    faqs: [
      { question: "How do data breaches happen?", answer: "Data breaches occur when hackers exploit vulnerabilities in a company's systems to steal user data. This can happen through phishing attacks, malware, unpatched software, or insider threats." },
      { question: "What should I do if my email was found in a breach?", answer: "Immediately change your password for the affected service and any other accounts using the same password. Enable two-factor authentication where possible and monitor your accounts for suspicious activity." },
      { question: "How often are breach databases updated?", answer: "We continuously monitor multiple trusted sources for new breach data. Our records are updated regularly to ensure you receive timely alerts about new compromises." },
      { question: "How do I check if my password was leaked?", answer: "Enter your email address in our Breach Monitor. If your email appears in any known breaches, any passwords associated with that account should be considered compromised. Change affected passwords immediately and enable two-factor authentication." },
      { question: "Can I get hacked from a data breach?", answer: "Yes. If your password was exposed in a breach and you use the same password on other accounts, attackers can access those accounts too. This is called credential stuffing and is one of the most common attack methods." },
      { question: "What is the dark web and how does it relate to data breaches?", answer: "The dark web is a hidden part of the internet where stolen data is bought and sold. After a data breach, your email, passwords, and personal information may be listed for sale on dark web marketplaces." },
    ],
  },
  "/faq": {
    title: "Frequently Asked Questions About Cybersecurity",
    description: "Find answers to common cybersecurity questions. Learn about password security, phishing prevention, identity theft protection, and how to stay safe online.",
    path: "/faq",
    faqs: [
      { question: "What is GetCyberRight?", answer: "GetCyberRight is a free-to-start cybersecurity education platform designed for families, seniors, parents, and everyday individuals. We provide practical tools, guides, and AI-powered analysis to help you stay safe online." },
      { question: "Is GetCyberRight really free?", answer: "GetCyberRight is free to get started. Core tools like the GCR Scam Guard, Password Generator, and educational content are available at no cost." },
      { question: "How can I protect myself from phishing?", answer: "Never click links in unexpected emails or messages. Verify the sender's email address carefully, look for spelling errors, and go directly to websites by typing the URL. Use our GCR Scam Guard to analyze suspicious links." },
      { question: "What should I do if I think I have been scammed?", answer: "Immediately change passwords for any compromised accounts, contact your bank if financial information was shared, file a report with the FTC at reportfraud.ftc.gov, and visit our Emergency Help page for step-by-step guidance." },
      { question: "How do I create a strong password?", answer: "Use at least 12 characters with a mix of uppercase, lowercase, numbers, and symbols. Never reuse passwords across sites. Use our Password Generator to create strong, unique passwords instantly." },
      { question: "What is two-factor authentication?", answer: "Two-factor authentication (2FA) adds an extra layer of security by requiring a second form of verification beyond your password, such as a code sent to your phone or generated by an authenticator app." },
    ],
  },
  "/ai-prompts": {
    title: "406+ AI Cybersecurity Prompts: ChatGPT, Claude & AI Security Library",
    description: "Browse 406+ expertly crafted AI prompts for cybersecurity. Use with ChatGPT, Claude, and other AI tools to analyze threats, learn security concepts, and protect your digital life.",
    path: "/ai-prompts",
    faqs: [
      { question: "What are AI cybersecurity prompts?", answer: "AI cybersecurity prompts are pre-written instructions you can use with AI tools like ChatGPT or Claude to get expert-level guidance on security topics, analyze potential threats, or learn about cyber safety concepts." },
      { question: "How do I use these prompts?", answer: "Simply copy a prompt from our library and paste it into your preferred AI tool (ChatGPT, Claude, etc.). The AI will provide a detailed, expert-level response to help you with that specific cybersecurity topic." },
      { question: "Are the prompts safe to use?", answer: "Yes. Our prompts are designed for defensive cybersecurity education only. They follow responsible AI guidelines and include built-in guardrails to prevent misuse." },
    ],
  },
  "/training": {
    title: "Cybersecurity Training Academy: Courses for All Skill Levels | GetCyberRight",
    description: "Access cybersecurity training courses designed for beginners, families, seniors, and small businesses. Core courses are free to get started. Learn practical skills to protect yourself from online threats.",
    path: "/training",
    faqs: [
      { question: "Who are the training courses designed for?", answer: "Our courses are designed for everyone, from complete beginners to small business owners. We have specialized learning paths for families, seniors, parents, educators, and small business professionals." },
      { question: "Do I need technical knowledge to start?", answer: "Not at all. Our courses start with the basics and use plain, everyday language. We explain everything step by step so anyone can follow along regardless of technical background." },
      { question: "Are the training courses free?", answer: "Our core training courses are free to get started. You can access foundational cybersecurity education and practical skills training at no cost." },
    ],
  },
  "/cyber-threat-radar": {
    title: "Live Cyber Threat Radar: Real-Time Security Alerts & Threat Map",
    description: "Monitor live cybersecurity threats with our real-time Cyber Threat Radar. See active threat alerts, trending attack vectors, and security advisories from trusted intelligence sources.",
    path: "/cyber-threat-radar",
    faqs: [
      { question: "What data sources does the Threat Radar use?", answer: "Our Threat Radar aggregates real-time data from trusted sources including government advisories, security alerts, and curated feeds from major safety organizations worldwide." },
      { question: "How often is the threat data updated?", answer: "Threat data is refreshed automatically every 6 hours. Critical alerts may appear sooner as they are published by our intelligence sources." },
      { question: "Can I get alerts for specific types of threats?", answer: "Yes. You can subscribe to receive email notifications when new high-severity or critical threat alerts are published that match your interests." },
    ],
  },
  "/awareness-hub": {
    title: "Cyber Awareness Hub: Safety Guides, Checklists & Resources",
    description: "Access printable cybersecurity guides, safety checklists, and awareness resources. Perfect for families, schools, and organizations looking to improve their cyber hygiene.",
    path: "/awareness-hub",
    faqs: [
      { question: "What resources are available in the Awareness Hub?", answer: "The Awareness Hub includes printable safety guides, interactive checklists, visual infographics, and downloadable resources covering topics from password security to social media safety." },
      { question: "Can I use these materials for training at my organization?", answer: "Yes. Our awareness materials are designed to be shared. They are perfect for schools, community groups, small businesses, and family education sessions." },
    ],
  },
  "/quick-assessment": {
    title: "Cybersecurity Quick Assessment: Check Your Security in 5 Minutes",
    description: "Take our free 5-minute cybersecurity assessment to evaluate your online safety habits. Get personalized recommendations to improve your digital security posture.",
    path: "/quick-assessment",
    schemaType: "WebApplication",
    faqs: [
      { question: "How long does the assessment take?", answer: "The quick assessment takes approximately 5 minutes to complete. It covers your most important security practices and gives you an instant safety score." },
      { question: "Is my assessment data private?", answer: "Yes. Your assessment responses are processed locally and are not stored on our servers. Your results are completely private." },
    ],
  },
  "/safety-score": {
    title: "Personal Cyber Safety Score: Rate Your Digital Security",
    description: "Calculate your personal cyber safety score based on your security practices. Get a detailed breakdown and actionable steps to improve your online protection.",
    path: "/safety-score",
    schemaType: "WebApplication",
    faqs: [
      { question: "What does my safety score mean?", answer: "Your safety score reflects how well your current security practices protect you online. A higher score means better protection. We provide specific recommendations to help you improve your score." },
      { question: "How is the score calculated?", answer: "The score evaluates your practices across key areas: password hygiene, two-factor authentication usage, software updates, privacy settings, and awareness of common threats." },
    ],
  },
  "/seniors": {
    title: "Senior Safety Center: Protect Yourself from Online Scams | GetCyberRight",
    description: "Free cybersecurity resources designed for seniors and older adults. Learn to spot phone scams, protect your identity, avoid romance fraud, and use technology with confidence.",
    path: "/seniors",
    features: ["Phone scam detection tips", "Identity theft prevention", "Romance scam awareness", "Medicare and government scam alerts", "Technology confidence guides", "Emergency help contacts"],
    bodyContent: `<p>Adults over 60 lost $3.4 billion to online scams in 2023, according to the FBI's Internet Crime Report. Scammers often target seniors because they may be less familiar with online tricks and tend to have more savings. But knowledge is your best defense. Our Senior Safety Center is designed specifically for older adults who want straightforward, no-jargon guidance on staying safe online.</p>
    <h2>The Most Common Scams Targeting Seniors</h2>
    <ul><li><strong>Phone scams</strong> - Callers pretending to be the IRS, Medicare, Social Security, or a grandchild in trouble</li><li><strong>Romance scams</strong> - Fake romantic interests on dating sites or social media who eventually ask for money</li><li><strong>Tech support scams</strong> - Pop-ups or calls claiming your computer has a virus and demanding payment to fix it</li><li><strong>Investment scams</strong> - Promises of guaranteed returns or "risk-free" investments, especially in cryptocurrency</li><li><strong>Impersonation scams</strong> - Emails or calls pretending to be from Amazon, your bank, or a government agency</li></ul>
    <h2>Simple Steps to Stay Protected</h2>
    <p>You do not need to be a technology expert to stay safe. Start with these basics: never give personal information to someone who contacts you unexpectedly, hang up on suspicious phone calls, verify requests by calling the company directly using a number from their official website, and establish a family code word that only you and your loved ones know for verifying emergency calls.</p>`,
    relatedLinks: [
      { text: "Emergency Help", href: "/emergency-help" },
      { text: "GCR Scam Guard", href: "/scam-checker" },
      { text: "Scam Intelligence Center", href: "/scam-intel" },
      { text: "Parents Hub", href: "/parents" },
    ],
    faqs: [
      { question: "What types of scams target seniors?", answer: "Seniors are commonly targeted by phone scams, Medicare fraud, romance scams, tech support scams, grandparent scams, lottery and prize scams, and investment fraud. Our guides cover each type with real examples and warning signs." },
      { question: "How can I help an older family member stay safe online?", answer: "Start with open conversations about common scams. Set up their devices with security basics, bookmark trusted sites, and establish a family code word for verifying emergency calls. Our Parents hub has resources for helping family members." },
      { question: "What should I do if I think I have been scammed?", answer: "Contact your bank immediately to freeze accounts, report the scam to the FTC at reportfraud.ftc.gov, change passwords for compromised accounts, and visit our Emergency Help page for step-by-step guidance." },
      { question: "Are these resources free?", answer: "Yes. All senior safety guides, scam alerts, and educational content are free to get started. No account is required to access our core resources." },
    ],
  },
  "/parents": {
    title: "Parents Hub: Keep Your Family Safe Online | GetCyberRight",
    description: "Cybersecurity guides for parents. Learn about parental controls, age-appropriate device settings, conversation starters about online safety, and how to protect your children from online threats.",
    path: "/parents",
    features: ["Parental control setup guides", "Age-appropriate safety conversations", "Device monitoring tips", "Social media safety", "Online predator awareness", "Gaming safety for kids"],
    bodyContent: `<p>Children today go online earlier than ever. The average child gets their first smartphone at age 10, and most teens spend more than 7 hours per day on screens outside of schoolwork. As a parent, it can feel overwhelming to keep up with every app, game, and website your kids use. Our Parents Hub gives you practical, actionable guidance to help protect your family without needing to become a tech expert.</p>
    <h2>Building Online Safety by Age Group</h2>
    <ul><li><strong>Ages 4 to 7</strong> - Focus on basic rules: never share your name, school, or address online. Use devices together whenever possible.</li><li><strong>Ages 8 to 12</strong> - Introduce the idea that not everyone online is who they say they are. Set up parental controls and safe search. Talk about what to do if something makes them uncomfortable.</li><li><strong>Ages 13 and up</strong> - Discuss social media privacy settings, the permanence of what they post, and how to recognize scams and manipulation. Shift from restriction to education.</li></ul>
    <h2>Practical Steps You Can Take Today</h2>
    <p>Set up device-level parental controls, review your child's app permissions, establish screen time boundaries that work for your family, create an open environment where kids feel safe telling you about uncomfortable online encounters, and consider a family code word for verifying unexpected requests or emergencies.</p>`,
    relatedLinks: [
      { text: "Kids Digital Safety Hub", href: "/kids" },
      { text: "Safety Score Assessment", href: "/safety-score" },
      { text: "Security Checklists", href: "/checklists" },
      { text: "Senior Safety Center", href: "/seniors" },
    ],
    faqs: [
      { question: "At what age should I start teaching my kids about online safety?", answer: "Start as early as they begin using devices. For children ages 5 to 7, focus on basic rules like not sharing personal information. For ages 8 to 12, introduce concepts about stranger danger online and safe browsing. Teens need guidance on social media privacy and recognizing scams." },
      { question: "What parental controls should I set up?", answer: "Set up content filters on browsers and apps, enable screen time limits, turn on safe search, review app permissions, and consider family sharing settings. Our guides walk you through setup on every major platform." },
      { question: "How do I talk to my kids about online dangers?", answer: "Keep conversations casual and ongoing rather than one big lecture. Use real examples from the news, ask what they see online, and create an environment where they feel safe telling you about uncomfortable encounters. Our conversation starter guides can help." },
    ],
  },
  "/kids": {
    title: "Kids Digital Safety Hub: Fun Online Safety Lessons for Ages 8-16 | GetCyberRight",
    description: "Interactive cybersecurity lessons designed for kids and teens ages 8 to 16. Learn about password safety, spotting scams, protecting personal information, and being a good digital citizen through fun activities.",
    path: "/kids",
    features: ["Age-appropriate lessons (8-11 and 12-16)", "Interactive safety activities", "Password security games", "Social media awareness", "Cyberbullying prevention", "Digital citizenship skills"],
    bodyContent: `<p>Kids and teens are spending more time online than ever, often on apps and platforms their parents have never used. While the internet is full of amazing resources for learning and connecting, it also has real risks. Our Kids Digital Safety Hub teaches young people how to protect themselves online through age-appropriate lessons that are actually engaging, not boring lectures.</p>
    <h2>What Kids Will Learn</h2>
    <ul><li><strong>Password power</strong> - How to create strong passwords and why using the same password everywhere is risky</li><li><strong>Spotting fakes</strong> - How to tell if a message, profile, or website is not what it pretends to be</li><li><strong>Protecting personal info</strong> - Why sharing your real name, school, location, or photos with strangers is dangerous</li><li><strong>Being a good digital citizen</strong> - How to treat others online, handle cyberbullying, and think before posting</li><li><strong>Gaming safety</strong> - How to stay safe in online games, avoid scams in virtual marketplaces, and handle strangers in chat</li></ul>
    <h2>Two Learning Tracks</h2>
    <p>Our lessons are split into two age groups. The 8 to 11 track uses simpler language and relatable scenarios like gaming and YouTube. The 12 to 16 track covers more advanced topics like social media privacy, identity protection, and recognizing manipulation tactics.</p>`,
    relatedLinks: [
      { text: "Parents Hub", href: "/parents" },
      { text: "Educator Resources", href: "/educators" },
      { text: "Password Generator", href: "/password-generator" },
      { text: "GCR Scam Guard", href: "/scam-checker" },
    ],
    faqs: [
      { question: "What age group are these lessons designed for?", answer: "Our lessons are designed for two age groups: ages 8 to 11 (foundational concepts with fun activities) and ages 12 to 16 (more advanced topics including social media safety, privacy, and recognizing scams)." },
      { question: "Can teachers use these materials in the classroom?", answer: "Absolutely. Our lessons are designed to work both at home and in classroom settings. Visit our Educators hub for curriculum-ready materials and lesson plans." },
      { question: "Are the lessons safe for kids to use independently?", answer: "Yes. All content is age-appropriate and designed for independent learning. No personal information is required and there are no external links to unsafe sites." },
    ],
  },
  "/educators": {
    title: "Educator Resources: Cybersecurity Curriculum & Teaching Materials | GetCyberRight",
    description: "Cybersecurity teaching resources for educators. Access lesson plans, classroom activities, printable guides, and curriculum materials to teach students about online safety.",
    path: "/educators",
    features: ["Ready-made lesson plans", "Classroom activity guides", "Printable safety worksheets", "Age-graded curriculum", "Assessment tools", "Professional development resources"],
    bodyContent: `<p>With students spending more time online and cyberbullying, scams, and privacy violations affecting younger age groups every year, teaching digital safety in the classroom has never been more important. Our Educator Resources provide ready-to-use lesson plans, activities, and printable materials that make it easy to incorporate online safety into your existing curriculum.</p>
    <h2>What Is Included</h2>
    <ul><li><strong>Lesson plans</strong> - Structured, age-appropriate lessons covering topics from password safety to social media privacy, designed to fit into a single class period</li><li><strong>Classroom activities</strong> - Interactive exercises and group discussions that get students actively thinking about online safety</li><li><strong>Printable worksheets</strong> - Take-home materials students can share with their families to extend the learning beyond the classroom</li><li><strong>Assessment tools</strong> - Quizzes and evaluation rubrics to measure student understanding</li></ul>
    <h2>Cross-Curricular Connections</h2>
    <p>Our materials connect naturally to language arts (analyzing persuasive scam messages), math (understanding probability of password cracking), social studies (exploring global privacy laws), and technology classes. This makes it easy to teach online safety without sacrificing existing curriculum time.</p>`,
    relatedLinks: [
      { text: "Kids Digital Safety Hub", href: "/kids" },
      { text: "Printable Guides", href: "/printable-guides" },
      { text: "Training Academy", href: "/training" },
      { text: "Security Checklists", href: "/checklists" },
    ],
    faqs: [
      { question: "What grade levels do the materials cover?", answer: "Our materials cover elementary through high school levels, with content specifically designed for different developmental stages and learning objectives." },
      { question: "How do I integrate cybersecurity into my existing curriculum?", answer: "Our resources are designed to complement existing curricula. We provide cross-curricular connections to subjects like math, language arts, and social studies, making it easy to weave cybersecurity concepts into your teaching." },
      { question: "Are the materials aligned with educational standards?", answer: "Our content aligns with common educational frameworks and digital citizenship standards. Each resource includes learning objectives and assessment criteria." },
    ],
  },
  "/small-business": {
    title: "Small Business Cybersecurity: Security Training & Guides | GetCyberRight",
    description: "Cybersecurity resources for small businesses. Employee awareness training, security policy templates, incident response guides, and practical steps to protect your business from cyber threats.",
    path: "/small-business",
    features: ["Employee awareness training", "Security policy templates", "Incident response planning", "Phishing simulation guidance", "Data backup strategies", "Compliance basics"],
    bodyContent: `<p>Over 43% of cyber attacks target small businesses, and 60% of small companies that experience a major breach go out of business within six months. Yet many small business owners assume they are too small to be a target. The reality is that attackers specifically seek out small businesses because they often have weaker security than large corporations but still hold valuable customer data and financial information.</p>
    <h2>Where to Start</h2>
    <p>You do not need a dedicated IT department or a large budget to significantly improve your security. The three most impactful steps any small business can take are: train employees to recognize suspicious emails and messages, enable two-factor authentication on all business accounts, and ensure you have regular, tested backups of your critical data.</p>
    <h2>Common Small Business Threats</h2>
    <ul><li><strong>Business email compromise</strong> - Attackers impersonate vendors, clients, or executives to trick employees into sending money or sensitive data</li><li><strong>Ransomware</strong> - Malicious software that locks your files and demands payment to unlock them</li><li><strong>Customer data theft</strong> - Breaches that expose your customers' personal and payment information, leading to legal liability and loss of trust</li><li><strong>Invoice fraud</strong> - Scammers send fake invoices that look like they come from legitimate vendors your business regularly pays</li></ul>`,
    relatedLinks: [
      { text: "Training Academy", href: "/training" },
      { text: "GCR Scam Guard", href: "/scam-checker" },
      { text: "Security Checklists", href: "/checklists" },
      { text: "Scam Intelligence Center", href: "/scam-intel" },
    ],
    faqs: [
      { question: "How much does cybersecurity cost for a small business?", answer: "Many effective cybersecurity measures are free or low-cost. Employee training, strong password policies, multi-factor authentication, and regular software updates cost nothing but significantly reduce risk. Our resources help you build a strong security foundation." },
      { question: "What are the biggest cybersecurity risks for small businesses?", answer: "The top risks include phishing emails, ransomware, weak passwords, outdated software, and employee mistakes. Over 43% of cyber attacks target small businesses, making awareness training essential." },
      { question: "Where should I start with cybersecurity for my business?", answer: "Start with three fundamentals: train your employees to recognize phishing, enable multi-factor authentication on all accounts, and ensure regular data backups. Our guides walk you through each step." },
    ],
  },
  "/contact": {
    title: "Contact GetCyberRight: Get in Touch | GetCyberRight",
    description: "Contact the GetCyberRight team for questions about cybersecurity education, partnership opportunities, or to report a scam. We are here to help families, seniors, and small businesses stay safe online.",
    path: "/contact",
    bodyContent: `<p>We would love to hear from you. Whether you have a question about online safety, want to report a scam, or are interested in partnering with us, our team is here to help.</p>
    <h2>How to Reach Us</h2>
    <ul><li><strong>General questions:</strong> Use the contact form below or email us at tips@getcyberright.com</li><li><strong>Report a scam:</strong> Visit our <a href="/report-scam">Report a Scam</a> page to submit details that help protect the community</li><li><strong>Partnership inquiries:</strong> Email tips@getcyberright.com with "Partnership" in the subject line</li><li><strong>Media inquiries:</strong> Contact us at tips@getcyberright.com for interviews, expert commentary, or press-related requests</li></ul>
    <p>We aim to respond to all messages within 24 to 48 hours.</p>`,
    relatedLinks: [
      { text: "Report a Scam", href: "/report-scam" },
      { text: "FAQ", href: "/faq" },
      { text: "About GetCyberRight", href: "/about" },
      { text: "Support", href: "/support" },
    ],
    faqs: [
      { question: "How can I contact GetCyberRight?", answer: "You can reach us through our contact form on this page or email us at tips@getcyberright.com. We aim to respond within 24 to 48 hours." },
      { question: "How do I report a scam?", answer: "Use our Report a Scam page to submit details about scam attempts. Your reports help us improve our safety data and protect others in the community." },
    ],
  },
  "/resources": {
    title: "Cybersecurity Resources: Guides, Tools & Training | GetCyberRight",
    description: "Explore our complete library of cybersecurity resources including safety guides, interactive tools, training courses, and scam alerts. Free to get started for families, seniors, educators, and small businesses.",
    path: "/resources",
    features: ["125+ safety guides", "Interactive security tools", "Training courses", "Scam alert database", "Printable checklists", "AI prompt library"],
    faqs: [
      { question: "Are all resources free?", answer: "Our core resources are free to get started. This includes safety guides, scam alerts, the GCR Scam Guard tool, and foundational training content." },
      { question: "How often is new content added?", answer: "We publish new content regularly, including updated scam alerts, new safety guides, and training materials. Subscribe to our newsletter to stay informed about new resources." },
    ],
  },
  "/emergency-help": {
    title: "Emergency Cyber Help: What to Do If You Have Been Scammed | GetCyberRight",
    description: "Immediate steps to take if you have been scammed online. Emergency contacts, account recovery guidance, financial protection steps, and reporting resources for cyber crime victims.",
    path: "/emergency-help",
    features: ["Immediate action checklist", "Emergency contact numbers by country", "Account recovery steps", "Financial protection guidance", "Scam reporting resources", "Identity theft recovery"],
    bodyContent: `<p>If you think you have been scammed, acting quickly can make the difference between losing money and recovering it. This page walks you through exactly what to do, step by step, in plain language.</p>
    <h2>Immediate Steps (Do These First)</h2>
    <ol><li><strong>Stop all contact with the scammer.</strong> Do not reply to messages, answer calls, or click any more links.</li><li><strong>Contact your bank or credit card company.</strong> Tell them what happened and ask to freeze or reverse any transactions. The sooner you call, the better your chances of getting money back.</li><li><strong>Change your passwords.</strong> Start with the compromised account, then change it everywhere you used that same password. Use our <a href="/password-generator">Password Generator</a> to create new strong passwords.</li><li><strong>Turn on two-factor authentication.</strong> Add this extra layer of protection to your email, banking, and social media accounts.</li></ol>
    <h2>Where to Report the Scam</h2>
    <ul><li><strong>United States:</strong> FTC at reportfraud.ftc.gov, FBI IC3 at ic3.gov</li><li><strong>United Kingdom:</strong> Action Fraud at actionfraud.police.uk</li><li><strong>Canada:</strong> Canadian Anti-Fraud Centre at antifraudcentre-centreantifraude.ca</li><li><strong>Australia:</strong> Scamwatch at scamwatch.gov.au</li></ul>
    <p>Also report the scam to us using our <a href="/report-scam">Report a Scam</a> page so we can warn others and update our detection systems.</p>`,
    relatedLinks: [
      { text: "GCR Scam Guard", href: "/scam-checker" },
      { text: "Report a Scam", href: "/report-scam" },
      { text: "Password Generator", href: "/password-generator" },
      { text: "Breach Monitor", href: "/breach-dashboard" },
    ],
    faqs: [
      { question: "What should I do first if I have been scammed?", answer: "Stop all communication with the scammer immediately. Contact your bank to freeze affected accounts, change passwords for compromised accounts, and report the incident to local authorities and the FTC." },
      { question: "Can I get my money back after being scammed?", answer: "It depends on the payment method. Credit card payments have the best recovery chances through chargebacks. Bank transfers and wire transfers are harder to recover. Contact your financial institution as soon as possible." },
    ],
  },
  "/tools": {
    title: "Cybersecurity Tools: GCR Scam Guard, Password Generator & More | GetCyberRight",
    description: "Access cybersecurity tools including an AI-powered GCR Scam Guard, secure Password Generator, Data Broker Removal, and Breach Monitor. Core tools are free, no signup required.",
    path: "/tools",
    schemaType: "WebApplication",
    features: ["GCR Scam Guard", "Secure Password Generator", "Data Broker Removal", "Breach Monitor", "Voice Deepfake Detector", "QR Code Scanner"],
    bodyContent: `<p>Most cybersecurity tools are built for IT professionals and large corporations. We built ours for everyday people. Every tool on GetCyberRight is designed to be simple enough for anyone to use, with no technical knowledge required and no signup needed for core features.</p>
    <h2>Our Security Toolkit</h2>
    <ul><li><a href="/scam-checker"><strong>GCR Scam Guard</strong></a> - Paste a suspicious URL, email, or text message to check it against multiple trusted safety databases including Google Safe Browsing, VirusTotal, and URLhaus. You can also upload QR code images to reveal hidden links.</li>
    <li><a href="/password-generator"><strong>Password Generator</strong></a> - Create strong, unique passwords instantly. Everything runs in your browser and nothing is sent to our servers.</li>
    <li><a href="/data-removal"><strong>Data Broker Removal</strong></a> - Find and remove your personal information from 501+ data broker and people-search websites.</li>
    <li><a href="/breach-dashboard"><strong>Breach Monitor</strong></a> - Check if your email address has been exposed in any known data breaches.</li>
    <li><a href="/cyber-threat-radar"><strong>Cyber Threat Radar</strong></a> - Monitor real-time cybersecurity threats and active scam campaigns.</li></ul>`,
    relatedLinks: [
      { text: "Cyber Safety Guides", href: "/guides" },
      { text: "Training Academy", href: "/training" },
      { text: "Scam Intelligence Center", href: "/scam-intel" },
      { text: "Emergency Help", href: "/emergency-help" },
    ],
    faqs: [
      { question: "Are these cybersecurity tools free?", answer: "Yes, our core security tools are free to get started. You can use the GCR Scam Guard, Password Generator, and other tools without creating an account." },
      { question: "Do I need to sign up to use the tools?", answer: "No signup is required for our core tools. You can start checking suspicious links, generating passwords, and scanning for data brokers immediately." },
    ],
  },
  "/ai-safety": {
    title: "AI Safety Guide: Protect Yourself from AI-Powered Threats | GetCyberRight",
    description: "Learn how to identify and protect yourself from AI-powered scams, deepfakes, and synthetic media. Understand AI risks and get practical safety tips for the age of artificial intelligence.",
    path: "/ai-safety",
    features: ["Deepfake detection tips", "AI scam identification", "Voice cloning awareness", "Synthetic media safety", "AI privacy protection", "Practical AI safety checklists"],
    faqs: [
      { question: "What are AI-powered scams?", answer: "AI-powered scams use artificial intelligence to create convincing fake voices, videos, emails, and websites. They can clone someone's voice from a short audio clip or generate realistic-looking phishing emails that are hard to distinguish from real ones." },
      { question: "How can I spot a deepfake?", answer: "Look for unnatural facial movements, inconsistent lighting, blurred edges around the face, and audio that does not match lip movements. Our guide covers detailed techniques for identifying deepfakes across video, audio, and images." },
    ],
  },
  "/checklists": {
    title: "Cybersecurity Checklists: Printable Security Guides | GetCyberRight",
    description: "Download free printable cybersecurity checklists for families, seniors, and small businesses. Step-by-step security guides covering passwords, devices, social media, and online shopping safety.",
    path: "/checklists",
    features: ["Printable PDF checklists", "Family security checklist", "Senior safety checklist", "Device setup guides", "Social media privacy checklist", "Online shopping safety"],
    faqs: [
      { question: "Can I print these checklists?", answer: "Yes, all checklists are designed to be printer-friendly. You can download and print them to keep by your computer or share with family members." },
      { question: "Who are the checklists designed for?", answer: "We have checklists for everyone including families, seniors, parents, students, and small business owners. Each one is written in plain language with clear action steps." },
    ],
  },
  "/news": {
    title: "Cybersecurity News & Updates",
    description: "Stay informed with the latest cybersecurity news, data breach reports, emerging threats, and security advisories. Curated updates for families, seniors, and small businesses.",
    path: "/news",
    features: ["Latest scam alerts and warnings", "Data breach notifications", "New threat advisories", "Security tips and updates", "Weekly safety roundups"],
    faqs: [
      { question: "How often is the news updated?", answer: "We publish new cybersecurity news and scam alerts multiple times per week, with breaking alerts published as soon as significant threats are identified." },
      { question: "Can I get news alerts by email?", answer: "Yes. Subscribe to our free newsletter to receive the most important cybersecurity news and scam alerts delivered to your inbox weekly." },
    ],
  },
  "/cyber-hygiene": {
    title: "Cyber Hygiene: Daily Habits for Better Online Safety",
    description: "Learn essential cyber hygiene practices to protect yourself daily. Simple, actionable habits for passwords, software updates, safe browsing, and device security.",
    path: "/cyber-hygiene",
    features: ["Password strength assessment", "Software update reminders", "Safe browsing habits", "Device security checks", "Privacy settings review"],
    faqs: [
      { question: "What is cyber hygiene?", answer: "Cyber hygiene refers to simple daily habits that keep you safe online, like using strong passwords, keeping software updated, and being careful about what you click. Think of it like brushing your teeth, but for your digital life." },
      { question: "What are the most important cyber hygiene habits?", answer: "The top habits are: use unique passwords for every account, turn on two-factor authentication, keep your devices and apps updated, be cautious with links and attachments, and regularly review your privacy settings." },
      { question: "How often should I practice cyber hygiene?", answer: "Some habits are daily (being careful with emails and links), some are weekly (checking for software updates), and some are monthly or quarterly (reviewing account settings and removing unused apps)." },
    ],
  },
  "/privacy": {
    title: "Privacy Policy",
    description: "Read the GetCyberRight privacy policy. Learn how we collect, use, and protect your personal information when you use our cybersecurity education platform and tools.",
    path: "/privacy",
    faqs: [
      { question: "What personal information does GetCyberRight collect?", answer: "We collect minimal information needed to provide our services. This includes email addresses for newsletter subscribers, account information for registered users, and anonymous usage data to improve our tools." },
      { question: "Does GetCyberRight sell user data?", answer: "No. We never sell, rent, or trade your personal information to third parties. Your privacy is fundamental to our mission." },
      { question: "How can I delete my data?", answer: "You can request deletion of your account and associated data at any time by contacting us at tips@getcyberright.com. We will process your request promptly." },
    ],
  },
  "/terms": {
    title: "Terms of Service",
    description: "Review the GetCyberRight terms of service. Understand the rules and guidelines for using our cybersecurity education platform, tools, and resources.",
    path: "/terms",
    faqs: [
      { question: "Is GetCyberRight free to use?", answer: "Yes, GetCyberRight is free to get started. Our core tools, guides, and educational resources are available at no cost." },
      { question: "Can I use GetCyberRight content for educational purposes?", answer: "Yes, educators and organizations are welcome to reference and share our educational content for non-commercial purposes with proper attribution." },
    ],
  },
  "/report-scam": {
    title: "Report a Scam: Help Protect Your Community",
    description: "Report a scam to GetCyberRight and help protect others. Submit details about suspicious emails, phone calls, text messages, or websites. Your reports help keep everyone safer.",
    path: "/report-scam",
    features: ["Easy scam reporting form", "Anonymous submission option", "Multiple scam categories", "Community protection", "Pattern identification"],
    faqs: [
      { question: "Why should I report a scam?", answer: "Reporting scams helps protect others in your community. When we receive reports, we can issue warnings, update our scam detection tools, and help identify new scam patterns before more people are affected." },
      { question: "What information should I include in a scam report?", answer: "Include as much detail as possible: the type of scam, how you were contacted (email, phone, text, social media), what the scammer said or asked for, any phone numbers or email addresses used, and screenshots if available." },
      { question: "Is my scam report anonymous?", answer: "Yes. You can submit a scam report without providing any personal contact information. Your report will still help protect others." },
    ],
  },
  "/travel-safety": {
    title: "Travel Cybersecurity: Stay Safe Online While Traveling",
    description: "Protect your digital life while traveling. Tips for secure Wi-Fi use, device protection, avoiding travel scams, and keeping your data safe on the road.",
    path: "/travel-safety",
    features: ["Public Wi-Fi safety guide", "Device protection tips", "Travel scam alerts", "Secure banking abroad", "Emergency contact prep"],
    faqs: [
      { question: "Is it safe to use hotel Wi-Fi?", answer: "Hotel Wi-Fi can be risky because it is often unencrypted and shared with many guests. Use a VPN when connecting to hotel Wi-Fi, avoid accessing sensitive accounts like banking, and verify the network name with hotel staff before connecting." },
      { question: "How do I protect my phone while traveling?", answer: "Enable screen lock with a strong passcode, turn off automatic Wi-Fi and Bluetooth connections, back up your data before your trip, keep your device updated, and avoid charging at public USB stations (use your own charger and wall outlet)." },
      { question: "What are the most common travel scams?", answer: "Common travel scams include fake Wi-Fi networks, booking website impostors, ATM skimming, fake travel deal emails, QR code scams at restaurants and tourist spots, and social media vacation monitoring by burglars." },
    ],
  },
  "/printable-guides": {
    title: "Printable Cybersecurity Guides: Download Free Safety Resources",
    description: "Download and print free cybersecurity guides for your family, classroom, or business. Visual safety checklists, tip sheets, and reference cards you can keep handy.",
    path: "/printable-guides",
    features: ["Family safety checklists", "Password best practices card", "Scam red flags reference sheet", "Device security setup guide", "Social media privacy checklist"],
    faqs: [
      { question: "Are the printable guides free?", answer: "Yes, all printable guides are completely free to download, print, and share. No signup required." },
      { question: "Can I share these guides with my school or organization?", answer: "Absolutely. Our guides are designed to be shared. Teachers, librarians, community organizations, and employers are encouraged to print and distribute them." },
    ],
  },
  "/support-the-mission": {
    title: "Support the Mission: Help Keep Families Safe Online",
    description: "Support GetCyberRight's mission to make cybersecurity education accessible to everyone. Help us protect families, seniors, and small businesses from online threats.",
    path: "/support-the-mission",
    faqs: [
      { question: "How can I support GetCyberRight?", answer: "You can support us by sharing our tools and guides with your family and friends, reporting scams you encounter, providing feedback on our platform, and spreading the word about digital safety education." },
      { question: "Is GetCyberRight a non-profit?", answer: "GetCyberRight is a mission-driven organization focused on making digital safety accessible to everyone. Our core tools and educational content are free to get started." },
    ],
  },
  "/our-mission": {
    title: "Our Mission: Making Online Safety Accessible to Everyone",
    description: "GetCyberRight's mission is to make cybersecurity education simple, practical, and available to every family. Learn why we started and where we are headed.",
    path: "/our-mission",
    faqs: [
      { question: "Why was GetCyberRight created?", answer: "GetCyberRight was started by a family that experienced scams, impersonation, and phone fraud firsthand. We built the platform we wished existed: simple tools and clear guidance that anyone can use to protect themselves and their family." },
      { question: "What makes GetCyberRight different?", answer: "We focus on families and everyday people, not businesses or tech experts. Our tools are free to get started, our guides are written in plain language, and our content is tailored for specific audiences like kids, seniors, and parents." },
    ],
  },
  "/pricing": {
    title: "Plans & Pricing: Free Cybersecurity Tools for Everyone",
    description: "GetCyberRight is free to get started. Access AI-powered scam checking, data broker removal, safety training, and more. See what is included and how to support the mission.",
    path: "/pricing",
    features: ["GCR Scam Guard", "Data Broker Removal tool", "Password Generator", "Safety training courses", "Printable guides and checklists", "Scam alerts and notifications"],
    faqs: [
      { question: "Is GetCyberRight really free?", answer: "Yes, GetCyberRight is free to get started. Our core tools including the GCR Scam Guard, Password Generator, safety guides, and training content are available at no cost and do not require an account." },
      { question: "What is included for free?", answer: "Free access includes the GCR Scam Guard, Password Generator, 501+ Data Broker Removal guides, 406+ AI Safety Prompts, 125+ Safety Guides, Training Academy courses, and weekly scam alerts." },
      { question: "Will GetCyberRight always be free?", answer: "Our core tools and educational content will always be free to get started. We believe everyone deserves access to basic digital safety tools regardless of their budget." },
    ],
  },
  "/feedback": {
    title: "Share Your Feedback: Help Us Improve GetCyberRight",
    description: "Tell us what you think about GetCyberRight. Your feedback helps us build better cybersecurity education tools and resources for families and communities.",
    path: "/feedback",
    faqs: [
      { question: "How is my feedback used?", answer: "Every piece of feedback is reviewed by our team. We use your suggestions to prioritize new features, fix issues, improve existing tools, and create content that better serves your needs." },
      { question: "Can I suggest new features?", answer: "Yes, we welcome feature suggestions. Use the feedback form to describe what you would like to see on GetCyberRight and how it would help you or your family stay safer online." },
    ],
  },
  "/parent-guide": {
    title: "Parent's Guide to Online Safety: Protect Your Children Online",
    description: "A complete guide for parents to keep children safe online. Covers parental controls, age-appropriate conversations, device setup, social media safety, and more.",
    path: "/parent-guide",
    features: ["Age-appropriate safety conversations", "Parental control setup guides", "Social media monitoring tips", "Gaming safety guidelines", "Screen time management"],
    faqs: [
      { question: "At what age should I start teaching my child about online safety?", answer: "Start as soon as your child begins using any connected device. For younger children (ages 4-7), focus on basic rules like not sharing personal information. As they grow, introduce more concepts about privacy, scams, and responsible online behavior." },
      { question: "What parental controls should I use?", answer: "The best approach combines built-in device controls (screen time limits, content filters, app restrictions) with regular conversations about online safety. No single tool replaces open communication with your child about what they encounter online." },
      { question: "How do I talk to my teenager about online safety without seeming overbearing?", answer: "Focus on real examples and news stories rather than lectures. Ask questions about what they see online, share your own experiences, and frame safety as empowerment rather than restriction. Show them that staying safe online is a life skill, not a punishment." },
    ],
  },
  "/search": {
    title: "Search GetCyberRight: Find Cybersecurity Resources",
    description: "Search across all GetCyberRight resources including guides, tools, training courses, scam alerts, and safety checklists. Find exactly what you need to stay safe online.",
    path: "/search",
    features: ["Search guides and articles", "Find specific scam types", "Locate tools and features", "Browse training courses", "Discover safety checklists"],
    faqs: [
      { question: "What can I search for on GetCyberRight?", answer: "You can search for cybersecurity guides, scam alerts, safety tools, training courses, checklists, scam intelligence reports, and any topic related to online safety for families, seniors, kids, and small businesses." },
      { question: "How do I find help for a specific scam?", answer: "Type the name of the scam or a description of what happened into the search box. You can also browse our Scam Intelligence Center or use the GCR Scam Guard to analyze suspicious links and messages directly." },
    ],
  },
  "/accessibility": {
    title: "Accessibility Statement",
    description: "GetCyberRight is committed to digital accessibility. Learn about our efforts to make cybersecurity education accessible to all users, including those with disabilities.",
    path: "/accessibility",
    faqs: [
      { question: "What accessibility standards does GetCyberRight follow?", answer: "We strive to conform to WCAG 2.1 Level AA guidelines. This includes providing text alternatives for images, keyboard navigation support, sufficient color contrast, and screen reader compatibility." },
      { question: "How can I report an accessibility issue?", answer: "If you encounter any accessibility barriers on our site, please contact us at tips@getcyberright.com with a description of the issue and the page where you encountered it. We take all accessibility reports seriously." },
    ],
  },
  "/advertise": {
    title: "Advertise with GetCyberRight: Reach Security-Conscious Families",
    description: "Partner with GetCyberRight to reach families, parents, seniors, and small businesses who care about online safety. Learn about advertising and sponsorship opportunities.",
    path: "/advertise",
    features: ["Targeted audience of safety-conscious families", "Multiple sponsorship tiers", "Brand-safe environment", "Content sponsorship options", "Newsletter sponsorship"],
    faqs: [
      { question: "What kind of audience does GetCyberRight reach?", answer: "Our audience consists of families, parents, seniors, educators, and small business owners who are actively interested in protecting themselves and their loved ones online. They are engaged, trust-focused, and looking for reliable solutions." },
      { question: "What advertising formats are available?", answer: "We offer content sponsorship, newsletter sponsorship, tool sponsorship, and display placements. All advertising is clearly labeled and must align with our mission of protecting families online." },
    ],
  },
  "/partner-deck": {
    title: "Partnership Opportunities: Collaborate with GetCyberRight",
    description: "Explore partnership opportunities with GetCyberRight. Learn how your organization can collaborate with us to advance cybersecurity education for families and communities.",
    path: "/partner-deck",
    features: ["Educational content partnerships", "Technology integrations", "Community outreach programs", "Co-branded safety campaigns", "Research collaborations"],
    faqs: [
      { question: "What types of partnerships does GetCyberRight offer?", answer: "We offer content partnerships, technology integrations, community outreach collaborations, co-branded campaigns, and research partnerships. All partnerships must align with our mission of making digital safety accessible to everyone." },
      { question: "How do I propose a partnership?", answer: "Contact us at tips@getcyberright.com with details about your organization, the type of partnership you are interested in, and how it would benefit families and communities. We review all proposals and respond within one week." },
    ],
  },
  "/experience": {
    title: "The GetCyberRight Experience: Where Families Take Back Their Digital Safety",
    description: "A first-of-its-kind family event where digital safety meets real fun. Interactive stations, vetted experts, and activities for every age. Join the waitlist to be the first to know.",
    path: "/experience",
    features: ["Interactive safety stations", "Expert-led workshops", "Activities for all ages", "Take-home safety kits", "Family and vendor waitlist"],
    faqs: [
      { question: "What is The GetCyberRight Experience?", answer: "The GetCyberRight Experience is a first-of-its-kind family event where digital safety meets real fun. Interactive stations, vetted experts, and activities for every age group, designed to give families the tools and knowledge to take back their digital safety." },
      { question: "How can I join the waitlist?", answer: "Sign up on this page with your name and email. You will be the first to know when details are announced, including dates, locations, and what to expect." },
      { question: "Is this event for families only?", answer: "The event is designed for families of all sizes, but we also welcome educators, community leaders, and vendors who want to support family digital safety. There is a separate vendor waitlist for organizations interested in participating." },
    ],
  },
  "/threat-trends": {
    title: "Cybersecurity Threat Trends: Current Attack Patterns & Statistics",
    description: "Track the latest cybersecurity threat trends and attack patterns. Data-driven insights on emerging scams, malware campaigns, and security threats affecting families and businesses.",
    path: "/threat-trends",
    features: ["Real-time threat statistics", "Regional scam patterns", "Trend analysis charts", "Risk group breakdowns", "Source citations from trusted agencies"],
    faqs: [
      { question: "Where does the threat trend data come from?", answer: "Our data comes from trusted global sources including government cybercrime agencies, law enforcement reports, industry security reports, and our own platform data from scam reports and scan results." },
      { question: "How often are threat trends updated?", answer: "Threat trend data is updated regularly as new reports and statistics become available from our sources. Major data refreshes happen quarterly when new agency reports are published." },
      { question: "What can I do with threat trend information?", answer: "Use threat trends to understand which scams are most common in your region, which groups are most at risk, and what types of attacks are increasing. This helps you focus your safety efforts where they matter most." },
    ],
  },
  "/support": {
    title: "Support & Help Center",
    description: "Get help with GetCyberRight tools and resources. Find answers to common questions, troubleshooting guides, and contact information for our support team.",
    path: "/support",
    features: ["Frequently asked questions", "Tool troubleshooting guides", "Contact support team", "Account help", "Feature request submission"],
    faqs: [
      { question: "How do I contact GetCyberRight support?", answer: "You can reach our support team by emailing tips@getcyberright.com. We aim to respond to all inquiries within 24 to 48 hours." },
      { question: "I found a bug. How do I report it?", answer: "Please email tips@getcyberright.com with a description of the issue, the page where it occurred, and any screenshots if possible. We appreciate your help in making the platform better." },
    ],
  },
  "/security": {
    title: "Security at GetCyberRight: How We Protect Your Data",
    description: "Learn how GetCyberRight protects your data with enterprise-grade security measures including encryption, secure authentication, and privacy-first design principles.",
    path: "/security",
    features: ["End-to-end encryption", "Secure authentication with multi-factor options", "Regular security audits", "Privacy-first architecture", "No data selling policy"],
    faqs: [
      { question: "How does GetCyberRight protect my data?", answer: "We use industry-standard encryption for all data in transit and at rest, implement secure authentication with optional multi-factor authentication, conduct regular security audits, and follow privacy-first design principles. We never sell or share your personal data." },
      { question: "Is my scam check data stored?", answer: "Scam check submissions are processed in real time and not permanently stored in a way that links back to you. We may retain anonymous, aggregated statistics to improve our detection accuracy." },
    ],
  },
  "/parents/child-safety-scanner": {
    title: "Child Safety Scanner: Check Your Family's Online Safety",
    description: "Use our free child safety scanner to evaluate your family's online security. Get personalized recommendations for parental controls, device settings, and conversation topics.",
    path: "/parents/child-safety-scanner",
    schemaType: "WebApplication",
    features: ["Family safety assessment", "Device security check", "Parental control recommendations", "Age-appropriate settings guide", "Personalized safety plan"],
    faqs: [
      { question: "What does the Child Safety Scanner check?", answer: "The scanner evaluates your family's online safety across key areas including device settings, parental controls, social media exposure, and communication habits. It then provides personalized recommendations based on your children's ages." },
      { question: "Is the scanner free to use?", answer: "Yes, the Child Safety Scanner is completely free and does not require an account. Your responses are used only to generate your personalized safety recommendations." },
    ],
  },
  "/resources/glossary": {
    title: "Cybersecurity Glossary: Simple Definitions for Common Terms",
    description: "A plain-language glossary of cybersecurity terms. Understand common security concepts without the technical jargon. Perfect for beginners and families.",
    path: "/resources/glossary",
    features: ["Plain-language definitions", "Alphabetical browsing", "Common terms explained", "Real-world examples", "Family-friendly explanations"],
    faqs: [
      { question: "Who is this glossary for?", answer: "This glossary is for anyone who has encountered cybersecurity terms they do not understand. We explain technical concepts in plain, everyday language so families, seniors, students, and beginners can follow along." },
      { question: "How many terms are in the glossary?", answer: "Our glossary covers the most common cybersecurity terms you will encounter in everyday life, from basic concepts like passwords and updates to more advanced topics. We add new terms regularly." },
    ],
  },
  "/resources/cheat-sheets": {
    title: "Cybersecurity Cheat Sheets: Quick Reference Security Guides",
    description: "Quick-reference cybersecurity cheat sheets covering passwords, safe browsing, email safety, social media privacy, and more. Print-friendly and easy to follow.",
    path: "/resources/cheat-sheets",
    features: ["Password security cheat sheet", "Safe browsing quick reference", "Email safety checklist", "Social media privacy guide", "Print-friendly format"],
    faqs: [
      { question: "Can I print the cheat sheets?", answer: "Yes, all cheat sheets are designed to be print-friendly. Print them out and keep them near your computer, share them with family members, or post them in your office or classroom." },
      { question: "What topics do the cheat sheets cover?", answer: "Our cheat sheets cover essential topics including password best practices, safe browsing habits, email safety, social media privacy settings, device security, and what to do if you suspect a scam." },
    ],
  },
};

function renderStaticToolPage(pagePath: string): string | null {
  const pageDef = STATIC_TOOL_PAGES[pagePath];
  if (!pageDef) return null;

  const fullTitle = pageDef.title.includes("GetCyberRight") ? pageDef.title : `${pageDef.title} | GetCyberRight`;
  const head = buildHead({
    title: fullTitle,
    description: pageDef.description,
    url: pageDef.path,
    type: "website",
  });

  const breadcrumbs = buildBreadcrumbs([
    { name: "Home", url: "/" },
    { name: pageDef.title.split(":")[0].trim(), url: pageDef.path },
  ]);

  const jsonLdItems: string[] = [];

  if (pageDef.schemaType === "WebApplication") {
    jsonLdItems.push(buildJsonLd({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: pageDef.title.split(":")[0].trim(),
      description: pageDef.description,
      url: `https://www.getcyberright.com${pageDef.path}`,
      applicationCategory: "SecurityApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      provider: {
        "@type": "Organization",
        name: "GetCyberRight",
        url: "https://www.getcyberright.com",
      },
    }));
  }

  if (pageDef.faqs && pageDef.faqs.length > 0) {
    jsonLdItems.push(buildJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pageDef.faqs.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    }));
  }

  const faqHtml = pageDef.faqs && pageDef.faqs.length > 0
    ? `<section><h2>Frequently Asked Questions</h2>${pageDef.faqs.map(faq => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`).join("")}</section>`
    : "";

  const featuresHtml = pageDef.features && pageDef.features.length > 0
    ? `<section><h2>Key Features</h2><ul>${pageDef.features.map(f => `<li>${escapeHtml(f)}</li>`).join("")}</ul></section>`
    : "";

  const bodyContentHtml = pageDef.bodyContent
    ? `<article>${pageDef.bodyContent}</article>`
    : "";

  const relatedLinksHtml = pageDef.relatedLinks && pageDef.relatedLinks.length > 0
    ? `<section><h2>Related Resources</h2><nav><ul>${pageDef.relatedLinks.map(link => `<li><a href="${link.href}">${escapeHtml(link.text)}</a></li>`).join("")}</ul></nav></section>`
    : "";

  return `${head}
<body style="font-family:Sora,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  ${breadcrumbs}
  ${jsonLdItems.join("\n")}
  <h1>${escapeHtml(pageDef.title.split("|")[0].trim())}</h1>
  <p style="font-size:18px;color:#444;">${escapeHtml(pageDef.description)}</p>
  ${bodyContentHtml}
  ${featuresHtml}
  ${faqHtml}
  ${relatedLinksHtml}
  ${buildFooter()}
  <div id="root"></div>

</body></html>`;
}

function renderAboutPage(): string {
  const head = buildHead({
    title: "About GetCyberRight: Digital Safety Has Never Mattered More",
    description: "Online scams have changed. GetCyberRight gives families, seniors, and small businesses the simple tools and knowledge they need to stay safe, including scam checking, data removal, and safety training.",
    url: "/about",
    type: "article",
    publishedTime: "2024-01-15",
    modifiedTime: "2026-03-01",
  });

  const articleSchema = buildJsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "About GetCyberRight: Digital Safety Has Never Mattered More",
    description: "Online scams have changed. GetCyberRight gives families, seniors, and small businesses the simple tools and clear guidance they need to stay safe online.",
    datePublished: "2024-01-15",
    dateModified: "2026-03-01",
    author: { "@type": "Organization", name: "GetCyberRight", url: "https://www.getcyberright.com" },
    publisher: { "@type": "Organization", name: "GetCyberRight", logo: { "@type": "ImageObject", url: "https://www.getcyberright.com/og-image.png" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.getcyberright.com/about" },
  });

  const breadcrumbs = buildJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.getcyberright.com/" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://www.getcyberright.com/about" },
    ],
  });

  const faqSchema = buildFaqSchema([
    { question: "What is GetCyberRight?", answer: "GetCyberRight is an online safety platform that helps families, seniors, students, and small businesses protect themselves from scams, identity theft, and data exposure. It combines simple protection tools with easy-to-understand guides and training." },
    { question: "Why is online safety more important now?", answer: "New technology has made scams harder to spot than ever. Fake emails now look perfect, criminals can copy someone's voice to make phone calls, and personal data is being collected and sold at a massive scale. Knowing how to protect yourself online is now essential for everyone." },
    { question: "How does the GCR Scam Guard work?", answer: "Paste any suspicious message, email, link, or phone number into the GCR Scam Guard. It checks 8 trusted safety sources and looks for common scam tactics to tell you whether it is safe or dangerous." },
    { question: "What tools does GetCyberRight offer?", answer: "GetCyberRight offers a GCR Scam Guard, Data Broker Removal covering 501+ companies, a Training Academy, an AI Safety Prompt Library with 406+ prompts, 125+ safety guides, and scam alerts covering 13 regions worldwide." },
    { question: "Is GetCyberRight free to use?", answer: "GetCyberRight is free to get started. Core tools like the GCR Scam Guard, safety guides, and training content are available at no cost and do not require an account." },
    { question: "Why was GetCyberRight created?", answer: "GetCyberRight was started by a family that experienced scams, impersonation, and phone fraud firsthand. The mission is to make online safety simple and available to everyone, because no family should have to learn these lessons the hard way." },
  ]);

  return `${head}
<body style="font-family:Sora,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  ${articleSchema}
  ${breadcrumbs}
  ${faqSchema}

  <header>
    <h1>About GetCyberRight: Digital Safety Has Never Mattered More</h1>
    <p style="font-size:18px;color:#444;">The world is changing fast. New technology is making scams harder to spot, identity theft easier to pull off, and personal data easier to steal. GetCyberRight gives families, seniors, and small businesses the simple tools and knowledge they need to stay safe online.</p>
  </header>

  <section>
    <h2>The Problem: Online Scams Have Changed. Most People Have Not Caught Up.</h2>
    <p>The rise of AI has given criminals powerful new tools. Scams that used to be easy to spot are now nearly perfect. Fake emails look real. Cloned voices sound like your family. And your personal data is being sold to anyone willing to pay for it.</p>
    <ul>
      <li><strong>Fake Emails and Texts</strong> - Scam messages now look identical to real ones from your bank, employer, or favorite stores. Perfect grammar, real logos, and personal details make them nearly impossible to spot.</li>
      <li><strong>Fake Voices and Video Calls</strong> - Criminals can now copy someone's voice or face to make calls and video chats that look and sound like a real person you know and trust.</li>
      <li><strong>Romance and Trust Scams</strong> - Scammers build fake relationships over weeks or months to gain your trust before asking for money.</li>
      <li><strong>Fake Investment Platforms</strong> - Fake trading platforms with made-up success stories and celebrity endorsements are designed to look exactly like the real thing.</li>
      <li><strong>Cloned Voice Calls</strong> - A family member's voice can now be copied from just a few seconds of audio, then used to call you pretending to be in an emergency.</li>
      <li><strong>Your Data Being Sold</strong> - Over 501 companies collect and sell your personal information to anyone willing to pay, giving scammers the details they need to trick you.</li>
    </ul>
    <p>Anyone can now create convincing scams using free online tools. Learning how to protect yourself online is no longer optional. It is essential for everyone.</p>
  </section>

  <section>
    <h2>The Solution: Simple Tools. Clear Guidance. Real Protection.</h2>
    <p>GetCyberRight was built because the people who need online safety the most have the fewest resources. We put scam checking, data removal, and safety training all in one place, designed for everyday people.</p>
    <ul>
      <li><a href="/scam-checker"><strong>GCR Scam Guard</strong></a> - Paste any suspicious message, email, link, or phone number. We check it against 8 trusted safety sources and tell you whether it is safe or a scam.</li>
      <li><a href="/data-removal"><strong>Data Broker Removal</strong></a> - We track 501+ companies that collect and sell your personal information. Get step-by-step instructions to remove yourself from each one.</li>
      <li><a href="/training"><strong>Training Academy</strong></a> - Easy-to-follow courses that teach you how modern scams work and how to spot them, no technical background needed.</li>
      <li><a href="/ai-prompts"><strong>AI Safety Prompt Library</strong></a> - 406+ ready-to-use prompts that help you use AI tools like ChatGPT safely, without accidentally sharing private information.</li>
      <li><a href="/guides"><strong>Safety Guides</strong></a> - 125+ easy-to-read guides covering passwords, account security, safe browsing, and keeping your devices protected.</li>
    </ul>
  </section>

  <section>
    <h2>Why This Matters Now More Than Ever</h2>
    <p>A grandmother who got a phone call that sounded exactly like her grandson, begging for bail money. A small business owner who sent $47,000 after a video call with someone who looked just like their boss. A college student whose identity was stolen through a job offer that looked completely legitimate.</p>
    <p>The warning signs people used to rely on, like bad spelling and obvious fakes, are gone. Today's scams are personal, polished, and almost impossible to tell apart from the real thing. Knowing how to stay safe online is no longer a nice-to-have. It is a necessity.</p>
    <p>GetCyberRight was started by a family that went through this firsthand. That experience made one thing clear: the people who need protection the most have the fewest resources. No family should have to learn online safety the hard way.</p>
  </section>

  <section>
    <h2>Platform Coverage</h2>
    <ul>
      <li><strong>501+</strong> Data Brokers Tracked - Companies monitored for selling personal data</li>
      <li><strong>406+</strong> AI Safety Prompts - Ready-to-use prompts for secure AI usage</li>
      <li><strong>125+</strong> Safety Guides - Plain-language cybersecurity resources</li>
      <li><strong>8</strong> Trusted Safety Sources - Real-time data from PhishTank, URLhaus, VirusTotal, and more</li>
      <li><strong>13</strong> Regions Covered - Scam alerts localized for regions worldwide</li>
      <li><strong>52+</strong> Scam Categories - Detailed guides on specific scam types</li>
    </ul>
    <p>Every tool is powered by the same safety data that law enforcement and security agencies worldwide rely on, including trusted sources like PhishTank, VirusTotal, and government threat databases.</p>
  </section>

  <section>
    <h2>Our Philosophy: Staying Safe Online Should Not Be Complicated</h2>
    <p>The knowledge to prevent most scams already exists, but it has been locked away in technical language and expensive tools built for large companies. We believe everyone deserves access to it, in words they can understand.</p>
    <ul>
      <li><strong>Available to Everyone</strong> - Every core tool and guide is free to use. No login required for scam checking. No credit card needed.</li>
      <li><strong>Honest and Trustworthy</strong> - We never sell your data. We never use scare tactics to pressure you. Our tools use trusted, public security sources and we are upfront about how everything works.</li>
      <li><strong>Community Driven</strong> - The best way to support GetCyberRight is to share it with someone who needs it.</li>
    </ul>
  </section>

  <section>
    <h2>Frequently Asked Questions</h2>
    <h3>What is GetCyberRight?</h3>
    <p>GetCyberRight is an online safety platform that helps families, seniors, students, and small businesses protect themselves from scams, identity theft, and data exposure. It combines simple protection tools with easy-to-understand guides and training.</p>
    <h3>Why is online safety more important now?</h3>
    <p>New technology has made scams harder to spot than ever. Fake emails now look perfect, criminals can copy someone's voice to make phone calls, and personal data is being collected and sold at a massive scale. Knowing how to protect yourself online is now essential for everyone.</p>
    <h3>How does the GCR Scam Guard work?</h3>
    <p>Paste any suspicious message, email, link, or phone number into the GCR Scam Guard. It checks 8 trusted safety sources and looks for common scam tactics to tell you whether it is safe or dangerous.</p>
    <h3>What tools does GetCyberRight offer?</h3>
    <p>GetCyberRight offers a GCR Scam Guard, Data Broker Removal covering 501+ companies, a Training Academy, an AI Safety Prompt Library with 406+ prompts, 125+ safety guides, and scam alerts covering 13 regions worldwide.</p>
    <h3>Is GetCyberRight free to use?</h3>
    <p>GetCyberRight is free to get started. Core tools like the GCR Scam Guard, safety guides, and training content are available at no cost and do not require an account.</p>
    <h3>Why was GetCyberRight created?</h3>
    <p>GetCyberRight was started by a family that experienced scams, impersonation, and phone fraud firsthand. The mission is to make online safety simple and available to everyone, because no family should have to learn these lessons the hard way.</p>
  </section>

  ${buildFooter()}
  <div id="root"></div>

</body></html>`;
}

function renderHomePage(): string {
  const head = buildHead({
    title: "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
    description: "Protect your family online with free cybersecurity education, AI-powered scam detection tools, data broker removal, and safety training. Trusted by thousands of families worldwide.",
    url: "/",
    type: "website",
  });

  const orgSchema = buildJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GetCyberRight",
    url: "https://www.getcyberright.com",
    logo: "https://www.getcyberright.com/og-image.png",
    description: "A free, family-focused cybersecurity education platform providing practical safety tools and training to protect families, parents, kids, seniors, and small businesses from online threats.",
    sameAs: [
      "https://www.facebook.com/getcyberright",
      "https://www.linkedin.com/company/getcyberright",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "tips@getcyberright.com",
      contactType: "customer support",
    },
  });

  const websiteSchema = buildJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GetCyberRight",
    url: "https://www.getcyberright.com",
    description: "Free cybersecurity education platform for families, parents, kids, and seniors. Tools and training to protect against scams, data brokers, and online threats.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.getcyberright.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  });

  const faqSchema = buildFaqSchema([
    { question: "What is GetCyberRight?", answer: "GetCyberRight is a free cybersecurity education platform designed for families, parents, kids, seniors, and everyday people. We provide practical tools, training, and guides to help you stay safe online." },
    { question: "Is GetCyberRight really free?", answer: "Yes, GetCyberRight is free to get started. Our core tools, guides, and training resources are available at no cost." },
    { question: "What tools does GetCyberRight offer?", answer: "We offer an GCR Scam Guard that analyzes URLs, emails, and QR codes; a Data Broker Removal tool covering 501+ sites; a Password Generator; a Cyber Threat Radar; and more." },
    { question: "Who is GetCyberRight for?", answer: "GetCyberRight is for everyone, including families, parents, kids, seniors, educators, and small businesses. We provide audience-specific content tailored to different experience levels." },
    { question: "How does the GCR Scam Guard work?", answer: "Our GCR Scam Guard uses multiple trusted sources including Google Safe Browsing, VirusTotal, and URLhaus to analyze suspicious links, emails, and messages and provide a safety score." },
  ]);

  return `${head}
<body style="font-family:Sora,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  ${orgSchema}
  ${websiteSchema}
  ${faqSchema}

  <header>
    <h1>GetCyberRight: Free Cybersecurity Tools for Families, Seniors &amp; Small Businesses</h1>
    <p style="font-size:18px;color:#444;">GetCyberRight is the most powerful free digital protection platform for families and everyday people. Spot scams before they trick you, remove your personal data from hundreds of sites, and learn to stay safe online with simple guides anyone can follow. Everything you need, all in one place.</p>
  </header>

  <section>
    <h2>Free Cybersecurity Tools</h2>
    <ul>
      <li><a href="/scam-checker">GCR Scam Guard</a> - Analyze suspicious URLs, emails, text messages, and QR codes against 8 trusted safety sources</li>
      <li><a href="/data-removal">Data Broker Removal</a> - Remove your personal information from 501+ data broker sites</li>
      <li><a href="/password-generator">Password Generator</a> - Create strong, unique passwords instantly</li>
      <li><a href="/cyber-threat-radar">Cyber Threat Radar</a> - Real-time cybersecurity threat monitoring dashboard</li>
      <li><a href="/breach-dashboard">Breach Monitor</a> - Check if your data has been exposed in known breaches</li>
      <li><a href="/ai-prompts">AI Prompt Library</a> - 406+ cybersecurity prompts for AI assistants</li>
    </ul>
  </section>

  <section>
    <h2>Cybersecurity Education for Every Audience</h2>
    <ul>
      <li><a href="/kids">Kids Digital Safety Hub</a> - Age-appropriate cybersecurity lessons and activities</li>
      <li><a href="/seniors">Senior Safety Center</a> - Protection against scams targeting older adults</li>
      <li><a href="/parents">Parents Guide</a> - Tools to keep your children safe online</li>
      <li><a href="/educators">Educator Resources</a> - Cybersecurity curriculum and teaching materials</li>
      <li><a href="/small-business">Small Business Security</a> - Affordable cybersecurity for small businesses</li>
    </ul>
  </section>

  <section>
    <h2>Cyber Safety Guides &amp; Training</h2>
    <ul>
      <li><a href="/guides">Cyber Safety Guides</a> - Step-by-step guides to protect yourself online</li>
      <li><a href="/training">Training Academy</a> - Structured learning paths for all skill levels</li>
      <li><a href="/awareness-hub">Awareness Hub</a> - Visual safety guides, checklists, and resources</li>
      <li><a href="/checklists">Security Checklists</a> - Printable checklists for digital safety</li>
      <li><a href="/ai-safety">AI Safety Guide</a> - Understanding and defending against AI-powered threats</li>
    </ul>
  </section>

  <section>
    <h2>Scam Intelligence &amp; Threat Alerts</h2>
    <ul>
      <li><a href="/scam-intel">Scam Intelligence Center</a> - Region-aware scam database with risk assessments</li>
      <li><a href="/alerts">Threat Alerts</a> - Real-time alerts about active cyber threats</li>
      <li><a href="/threat-trends">Threat Trends</a> - Emerging cybersecurity trends and analysis</li>
      <li><a href="/report-scam">Report a Scam</a> - Help the community by reporting scam attempts</li>
    </ul>
  </section>

  <section>
    <h2>Common Scams to Watch For</h2>
    <ul>
      <li><a href="/scams/phishing">Phishing Scams</a> - How to spot and avoid phishing attacks</li>
      <li><a href="/scams/romance-scam">Romance Scams</a> - Protecting yourself from online romance fraud</li>
      <li><a href="/scams/tech-support-scam">Tech Support Scams</a> - Recognizing fake tech support calls</li>
      <li><a href="/scams/ai-deepfake-scam">AI Deepfake Scams</a> - Defending against AI-generated fraud</li>
      <li><a href="/scams/grandparent-scam">Grandparent Scams</a> - Protecting seniors from family emergency scams</li>
      <li><a href="/scams/identity-theft">Identity Theft</a> - Prevention and recovery guide</li>
      <li><a href="/scams/crypto-scam">Cryptocurrency Scams</a> - Avoiding crypto fraud and fake investments</li>
      <li><a href="/scams/amazon-scam">Amazon Scams</a> - Spotting fake Amazon communications</li>
    </ul>
    <p><a href="/tools">View all 52 scam guides</a></p>
  </section>

  <section>
    <h2>Latest Cybersecurity Guides</h2>
    <ul>
      <li><a href="/guides/how-to-tell-if-text-message-is-scam">How to Tell If a Text Message Is a Scam: 9 Warning Signs</a></li>
      <li><a href="/guides/signs-someone-using-ai-to-scam-you">5 Signs Someone Is Using AI to Scam You</a></li>
      <li><a href="/guides/how-to-remove-personal-information-from-internet">How to Remove Your Personal Information from the Internet</a></li>
      <li><a href="/guides/is-this-email-real-how-to-check">Is This Email Real? How to Check If an Email Is Legitimate</a></li>
      <li><a href="/guides/how-to-protect-seniors-parents-from-scams">How to Protect Your Parents and Grandparents from Online Scams</a></li>
      <li><a href="/guides/what-to-do-if-identity-stolen">What to Do If Your Identity Is Stolen: Step-by-Step Recovery Guide</a></li>
      <li><a href="/guides/free-tools-check-passwords-leaked">Free Tools to Check If Your Passwords Were Leaked</a></li>
      <li><a href="/guides/facebook-marketplace-scams-buy-sell-safely">Facebook Marketplace Scams: How to Buy and Sell Safely</a></li>
      <li><a href="/guides/how-to-set-up-parental-controls-every-device">How to Set Up Parental Controls on Every Device</a></li>
      <li><a href="/guides/romance-scam-warning-signs">Romance Scam Warning Signs: Protect Your Heart and Your Money</a></li>
    </ul>
    <p><a href="/guides">View all cybersecurity guides</a></p>
  </section>

  <section>
    <h2>Cybersecurity Topics</h2>
    <ul>
      <li><a href="/topics/identity-theft">Identity Theft Prevention</a></li>
      <li><a href="/topics/online-scams">Online Scams</a></li>
      <li><a href="/topics/phishing-attacks">Phishing Attacks</a></li>
      <li><a href="/topics/cyber-safety-seniors">Cyber Safety for Seniors</a></li>
      <li><a href="/topics/cyber-safety-kids">Cyber Safety for Kids</a></li>
      <li><a href="/topics/password-security">Password Security</a></li>
      <li><a href="/topics/privacy-protection">Privacy Protection</a></li>
      <li><a href="/topics/device-security">Device Security</a></li>
      <li><a href="/topics/data-breaches">Data Breaches</a></li>
      <li><a href="/topics/social-media-security">Social Media Security</a></li>
    </ul>
  </section>

  <section>
    <h2>Frequently Asked Questions</h2>
    <h3>What is GetCyberRight?</h3>
    <p>GetCyberRight is a free cybersecurity education platform designed for families, parents, kids, seniors, and everyday people. We provide practical tools, training, and guides to help you stay safe online.</p>
    <h3>Is GetCyberRight really free?</h3>
    <p>Yes, GetCyberRight is free to get started. Our core tools, guides, and training resources are available at no cost.</p>
    <h3>What tools does GetCyberRight offer?</h3>
    <p>We offer an GCR Scam Guard that analyzes URLs, emails, and QR codes; a Data Broker Removal tool covering 501+ sites; a Password Generator; a Cyber Threat Radar; and more.</p>
    <h3>Who is GetCyberRight for?</h3>
    <p>GetCyberRight is for everyone, including families, parents, kids, seniors, educators, and small businesses. We provide audience-specific content tailored to different experience levels.</p>
    <h3>How does the GCR Scam Guard work?</h3>
    <p>Our GCR Scam Guard uses multiple trusted sources including Google Safe Browsing, VirusTotal, and URLhaus to analyze suspicious links, emails, and messages and provide a safety score.</p>
  </section>

  ${buildFooter()}
  <div id="root"></div>

</body></html>`;
}

export function seoMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ua = req.get("User-Agent");
    if (!isBot(ua)) return next();

    const path = req.originalUrl.split("?")[0].split("#")[0];
    let html: string | null = null;
    let isDynamicRoute = false;

    try {
      if (path === "/") {
        html = renderHomePage();
      }

      if (!html && path === "/about") {
        html = renderAboutPage();
      }

      const guideMatch = path.match(/^\/guides\/([a-z0-9-]+)$/);
      if (!html && guideMatch) {
        isDynamicRoute = true;
        html = await renderGuidePage(guideMatch[1]);
      }

      const alertMatch = path.match(/^\/alerts\/([a-z0-9-]+)$/);
      if (!html && alertMatch) {
        isDynamicRoute = true;
        html = await renderAlertPage(alertMatch[1]);
      }

      const scamIntelMatch = path.match(/^\/scam-intel\/([a-z0-9-]+)$/);
      if (!html && scamIntelMatch) {
        isDynamicRoute = true;
        html = await renderScamIntelPage(scamIntelMatch[1]);
      }

      const scamMatch = path.match(/^\/scams\/([a-z0-9-]+)$/);
      if (!html && scamMatch) {
        isDynamicRoute = true;
        html = renderScamPage(scamMatch[1]);
      }

      const topicMatch = path.match(/^\/topics\/([a-z0-9-]+)$/);
      if (!html && topicMatch) {
        isDynamicRoute = true;
        html = await renderTopicHub(topicMatch[1]);
      }

      if (!html && path === "/guides") {
        html = await renderListingPage("guides");
      }
      if (!html && path === "/scam-intel") {
        html = await renderListingPage("scam-intel");
      }
      if (!html && path === "/alerts") {
        html = await renderListingPage("alerts");
      }

      if (!html && STATIC_TOOL_PAGES[path]) {
        html = renderStaticToolPage(path);
      }

      if (html) {
        res.status(200).set({
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
          "X-Robots-Tag": "index, follow",
        }).end(html);
        return;
      }

      if (isDynamicRoute && !html) {
        res.status(404).set({ "Content-Type": "text/html" }).end("<html><head><title>Not Found</title></head><body><h1>404 - Page Not Found</h1></body></html>");
        return;
      }

      if (!html && !isKnownRoute(path)) {
        res.status(404).set({ "Content-Type": "text/html" }).end("<html><head><title>Not Found</title></head><body><h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p><p><a href='/'>Return to GetCyberRight</a></p></body></html>");
        return;
      }
    } catch (error: any) {
      console.error(`[SEO] Error rendering ${path}:`, error.message);
    }

    next();
  };
}
