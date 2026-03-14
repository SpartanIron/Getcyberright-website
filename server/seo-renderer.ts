import { storage } from "./storage";
import { SCAM_PAGES, getAllScamSlugs } from "@shared/scam-content";
import type { Request, Response, NextFunction } from "express";

const BOT_PATTERN = /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|ia_archiver|msnbot|semrushbot|ahrefsbot|mj12bot|rogerbot|dotbot|petalbot|bytespider|gptbot|anthropic-ai|claude-web|google-extended|chatgpt-user/i;

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
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
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

function buildFooter(): string {
  return `
<footer style="padding:40px 20px;text-align:center;color:#666;font-family:Inter,sans-serif;font-size:14px;border-top:1px solid #e5e7eb;margin-top:40px;">
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
<body style="font-family:Inter,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
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
      <li><a href="/scam-checker">Scam Checker Tool</a></li>
      <li><a href="/tools">Security Tools</a></li>
      <li><a href="/training">Training Academy</a></li>
    </ul>
  </nav>
  ${buildFooter()}
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
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
<body style="font-family:Inter,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
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
  <script type="module" src="/src/main.tsx"></script>
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
<body style="font-family:Inter,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  ${breadcrumbs}
  ${article}
  <article>
    <h1>${escapeHtml(scam.scamName)}</h1>
    <div style="display:flex;gap:8px;margin:12px 0;">
      <span style="background:#fef2f2;color:#b91c1c;padding:4px 12px;border-radius:16px;font-size:13px;">Risk: ${escapeHtml(scam.riskLevel || "")}</span>
      <span style="background:#f5f3ff;color:#6d28d9;padding:4px 12px;border-radius:16px;font-size:13px;">${escapeHtml(scam.scamCategory || "")}</span>
    </div>
    ${scam.metaDescription ? `<p style="font-size:18px;color:#444;">${escapeHtml(scam.metaDescription)}</p>` : ""}
    ${scam.howItWorks ? `<section><h2>How This Scam Works</h2><p>${escapeHtml(scam.howItWorks)}</p></section>` : ""}
    ${scam.redFlags && scam.redFlags.length > 0 ? `<section><h2>Warning Signs</h2><ul>${scam.redFlags.map(f => `<li>${escapeHtml(f)}</li>`).join("")}</ul></section>` : ""}
    ${scam.protectionSteps && scam.protectionSteps.length > 0 ? `<section><h2>How to Protect Yourself</h2><ul>${scam.protectionSteps.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ul></section>` : ""}
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
  <script type="module" src="/src/main.tsx"></script>
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
<body style="font-family:Inter,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
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
  <script type="module" src="/src/main.tsx"></script>
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
<body style="font-family:Inter,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
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
      <li><a href="/scam-checker">Scam Checker</a> - Analyze suspicious links and messages</li>
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
  <script type="module" src="/src/main.tsx"></script>
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
<body style="font-family:Inter,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  <h1>${escapeHtml(titles[type])}</h1>
  <p style="font-size:18px;color:#444;">${escapeHtml(descriptions[type])}</p>
  <ul style="list-style:none;padding:0;">${listItems}</ul>
  ${buildFooter()}
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body></html>`;
}

interface StaticPageDef {
  title: string;
  description: string;
  path: string;
  schemaType?: string;
  faqs?: { question: string; answer: string }[];
  features?: string[];
}

const STATIC_TOOL_PAGES: Record<string, StaticPageDef> = {
  "/scam-checker": {
    title: "AI Scam Checker: Analyze URLs, Emails, Messages & QR Codes",
    description: "Use our free AI-powered scam checker to analyze suspicious URLs, emails, text messages, and QR codes. Get instant safety reports with real-time threat intelligence from multiple security databases.",
    path: "/scam-checker",
    schemaType: "WebApplication",
    features: ["URL safety analysis", "Email scam detection", "QR code scanning", "Real-time threat intelligence", "Multi-database verification"],
    faqs: [
      { question: "How does the AI Scam Checker work?", answer: "Our scam checker uses multiple security databases including Google Safe Browsing, VirusTotal, and URLhaus to analyze suspicious links, emails, and messages. It cross-references threat intelligence data to give you a safety score." },
      { question: "Is the Scam Checker free to use?", answer: "Yes, the Scam Checker is free to get started. You can analyze URLs, emails, text messages, and QR codes without any cost." },
      { question: "What types of scams can it detect?", answer: "Our tool can detect phishing links, malware-hosting URLs, fake websites, social engineering attempts, tech support scams, romance scams, and many other common online scams." },
      { question: "How accurate is the scam detection?", answer: "We use multiple verified threat intelligence sources and AI analysis for high accuracy. However, no tool is 100% accurate. Always exercise caution with suspicious communications." },
    ],
  },
  "/password-generator": {
    title: "Free Secure Password Generator: Create Strong, Unique Passwords",
    description: "Generate strong, unique passwords instantly with our free secure password generator. Customize length, character types, and complexity. Never use weak passwords again.",
    path: "/password-generator",
    schemaType: "WebApplication",
    features: ["Custom password length", "Special character options", "Uppercase and lowercase mixing", "Number inclusion", "Password strength meter"],
    faqs: [
      { question: "What makes a strong password?", answer: "A strong password is at least 12 characters long and includes a mix of uppercase letters, lowercase letters, numbers, and special characters. It should not contain personal information or common words." },
      { question: "How often should I change my passwords?", answer: "Security experts now recommend changing passwords only when there is evidence of a breach. Using unique, strong passwords for each account with a password manager is more important than frequent changes." },
      { question: "Is this password generator safe to use?", answer: "Yes. Passwords are generated entirely in your browser and are never sent to our servers or stored anywhere. Your generated passwords remain completely private." },
      { question: "Should I use a password manager?", answer: "Absolutely. A password manager securely stores all your unique passwords so you only need to remember one master password. This is the best way to maintain strong, unique passwords for every account." },
    ],
  },
  "/data-removal": {
    title: "Data Broker Removal: Remove Your Personal Information from 501+ Sites",
    description: "Protect your privacy by removing your personal information from 501+ data broker sites. Our free tool helps you find and remove your data from people-search websites, marketing databases, and data aggregators.",
    path: "/data-removal",
    schemaType: "WebApplication",
    features: ["501+ data broker database", "Automated removal requests", "Progress tracking", "Privacy score assessment", "Continuous monitoring"],
    faqs: [
      { question: "What are data brokers?", answer: "Data brokers are companies that collect, aggregate, and sell personal information. They gather data from public records, social media, purchase history, and other sources, then sell it to marketers, employers, and anyone willing to pay." },
      { question: "How does the data removal tool work?", answer: "Our tool searches 501+ known data broker sites for your personal information and generates opt-out requests. We guide you through the removal process for each site that has your data." },
      { question: "How long does data removal take?", answer: "Most data brokers process removal requests within 30 to 45 days, though some may take longer. Our tool tracks the status of each request so you can monitor progress." },
      { question: "Will my data stay removed permanently?", answer: "Data brokers may re-acquire your information over time. We recommend periodic checks and re-submissions. Our monitoring feature helps you stay on top of new listings." },
    ],
  },
  "/breach-dashboard": {
    title: "Data Breach Monitor: Check If Your Email Has Been Compromised",
    description: "Monitor your email addresses for data breaches. Get instant alerts when your personal information appears in known data breaches. Protect your accounts before criminals exploit your data.",
    path: "/breach-dashboard",
    schemaType: "WebApplication",
    features: ["Email breach monitoring", "Real-time alerts", "Breach history tracking", "Security recommendations", "Multiple email support"],
    faqs: [
      { question: "How do data breaches happen?", answer: "Data breaches occur when hackers exploit vulnerabilities in a company's systems to steal user data. This can happen through phishing attacks, malware, unpatched software, or insider threats." },
      { question: "What should I do if my email was found in a breach?", answer: "Immediately change your password for the affected service and any other accounts using the same password. Enable two-factor authentication where possible and monitor your accounts for suspicious activity." },
      { question: "How often are breach databases updated?", answer: "We continuously monitor multiple threat intelligence sources for new breach data. Our databases are updated regularly to ensure you receive timely alerts about new compromises." },
    ],
  },
  "/faq": {
    title: "Frequently Asked Questions About Cybersecurity",
    description: "Find answers to common cybersecurity questions. Learn about password security, phishing prevention, identity theft protection, and how to stay safe online.",
    path: "/faq",
    faqs: [
      { question: "What is GetCyberRight?", answer: "GetCyberRight is a free-to-start cybersecurity education platform designed for families, seniors, parents, and everyday individuals. We provide practical tools, guides, and AI-powered analysis to help you stay safe online." },
      { question: "Is GetCyberRight really free?", answer: "GetCyberRight is free to get started. Core tools like the Scam Checker, Password Generator, and educational content are available at no cost." },
      { question: "How can I protect myself from phishing?", answer: "Never click links in unexpected emails or messages. Verify the sender's email address carefully, look for spelling errors, and go directly to websites by typing the URL. Use our Scam Checker to analyze suspicious links." },
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
    title: "Cybersecurity Training Academy: Free Courses for All Skill Levels",
    description: "Access free cybersecurity training courses designed for beginners, families, seniors, and small businesses. Learn practical skills to protect yourself from online threats.",
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
      { question: "What data sources does the Threat Radar use?", answer: "Our Threat Radar aggregates real-time data from trusted sources including CISA advisories, US-CERT alerts, and curated RSS feeds from major cybersecurity organizations." },
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
};

function renderStaticToolPage(pagePath: string): string | null {
  const pageDef = STATIC_TOOL_PAGES[pagePath];
  if (!pageDef) return null;

  const head = buildHead({
    title: `${pageDef.title} | GetCyberRight`,
    description: pageDef.description,
    url: pageDef.path,
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

  return `${head}
<body style="font-family:Inter,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  ${breadcrumbs}
  ${jsonLdItems.join("\n")}
  <h1>${escapeHtml(pageDef.title.split("|")[0].trim())}</h1>
  <p style="font-size:18px;color:#444;">${escapeHtml(pageDef.description)}</p>
  ${featuresHtml}
  ${faqHtml}
  ${buildFooter()}
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body></html>`;
}

function renderAboutPage(): string {
  const head = buildHead({
    title: "About GetCyberRight: AI-Powered Cybersecurity for Real People",
    description: "Scammers use AI. Your protection should too. GetCyberRight combines AI-powered scam detection, data broker removal, and plain-language education to protect families, seniors, and small businesses from phishing, deepfakes, and online fraud.",
    url: "/about",
    type: "article",
    publishedTime: "2024-01-15",
    modifiedTime: "2026-03-01",
  });

  const articleSchema = buildJsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "About GetCyberRight: AI-Powered Cybersecurity for Real People",
    description: "GetCyberRight is an AI-powered digital safety platform that helps families, seniors, and small businesses protect themselves from AI-generated phishing, deepfake scams, identity theft, and data brokers.",
    datePublished: "2024-01-15",
    dateModified: "2026-03-01",
    author: { "@type": "Organization", name: "GetCyberRight", url: "https://getcyberright.com" },
    publisher: { "@type": "Organization", name: "GetCyberRight", logo: { "@type": "ImageObject", url: "https://getcyberright.com/og-image.png" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://getcyberright.com/about" },
  });

  const breadcrumbs = buildJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://getcyberright.com/" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://getcyberright.com/about" },
    ],
  });

  const faqSchema = buildFaqSchema([
    { question: "What is GetCyberRight?", answer: "GetCyberRight is an AI-powered digital safety platform that helps families, seniors, students, and small businesses protect themselves from AI-generated phishing, deepfake scams, identity theft, and data brokers. It combines AI-powered scam detection with plain-language education." },
    { question: "How does the AI Scam Checker work?", answer: "The AI Scam Checker lets you paste any suspicious message, email, link, or phone number. AI analyzes the content for social engineering patterns and cross-references 8 live threat intelligence feeds including PhishTank, URLhaus, and VirusTotal to determine if it is a scam." },
    { question: "Can AI really detect AI-generated scams?", answer: "Yes. While AI-generated phishing emails may look flawless to humans, AI analysis can detect patterns in language structure, URL construction, sender behavior, and social engineering tactics that are characteristic of scam content, even when the grammar and formatting are perfect." },
    { question: "What tools does GetCyberRight offer?", answer: "GetCyberRight offers an AI Scam Checker, Data Broker Removal covering 501+ brokers, a Training Academy, an AI Safety Prompt Library with 406+ prompts, 125+ cybersecurity guides, and real-time threat intelligence from 8 verified feeds across 13 regions." },
    { question: "Is GetCyberRight free to use?", answer: "GetCyberRight is free to get started. Core tools like the AI Scam Checker, safety guides, and educational content are available at no cost without requiring an account." },
    { question: "Why was GetCyberRight created?", answer: "GetCyberRight was started by a family that experienced AI-powered scams, impersonation attacks, and phone fraud firsthand. The mission is to use AI to fight AI-powered threats and make cybersecurity accessible for non-experts." },
  ]);

  return `${head}
<body style="font-family:Inter,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  ${articleSchema}
  ${breadcrumbs}
  ${faqSchema}

  <header>
    <h1>About GetCyberRight: AI-Powered Cybersecurity for Real People</h1>
    <p style="font-size:18px;color:#444;">Scammers are using AI to create attacks that look real. GetCyberRight uses AI to catch them. We combine AI-powered scam detection, data broker removal, and plain-language education to give families, seniors, and small businesses the same level of protection that large enterprises have.</p>
  </header>

  <section>
    <h2>The Problem: Scammers Now Use AI. Your Defenses Should Too.</h2>
    <p>Cybercriminals are using the same AI tools that power ChatGPT and voice assistants to create attacks that are nearly impossible to detect by eye. AI-generated phishing, deepfake video calls, and cloned voices are targeting ordinary people, not just corporations.</p>
    <ul>
      <li><strong>AI-Generated Phishing</strong> - Scammers use AI to write flawless phishing emails with no typos, perfect branding, and personalized details scraped from social media.</li>
      <li><strong>Deepfake Impersonation</strong> - AI-generated voice clones and video deepfakes are used to impersonate family members, CEOs, and government officials in real time.</li>
      <li><strong>Romance and Social Engineering</strong> - AI chatbots run long-term romance scams on thousands of victims simultaneously, building trust over weeks before requesting money.</li>
      <li><strong>Crypto and Investment Fraud</strong> - Fake trading platforms with AI-generated testimonials and deepfake celebrity endorsements designed to steal savings.</li>
      <li><strong>AI Voice Cloning Scams</strong> - Criminals clone a family member's voice from seconds of audio, then call pretending to be in an emergency.</li>
      <li><strong>Data Broker Exposure</strong> - Over 501 companies collect and sell personal information, giving scammers the details they need to make AI-powered attacks convincing.</li>
    </ul>
    <p>AI has made scams faster, cheaper, and more convincing than ever. The old advice of "look for typos" no longer works. You need AI-powered tools to fight AI-powered threats.</p>
  </section>

  <section>
    <h2>The Solution: AI-Powered Protection. Plain-Language Education.</h2>
    <p>GetCyberRight uses AI to analyze suspicious content, detect social engineering patterns, and identify threats that humans miss. Combined with data broker removal and plain-language education, it gives everyday people the same level of protection that enterprises have.</p>
    <ul>
      <li><a href="/scam-checker"><strong>AI Scam Checker</strong></a> - Paste any suspicious message, email, link, or phone number. AI analyzes the content for social engineering patterns, cross-references 8 live threat intelligence feeds, and gives you a detailed risk breakdown.</li>
      <li><a href="/data-removal"><strong>Data Broker Removal</strong></a> - We track 501+ companies that buy and sell your personal data. Step-by-step instructions to remove yourself from each one.</li>
      <li><a href="/training"><strong>Training Academy</strong></a> - Structured courses that teach you how modern scams work and how to recognize them, designed for all skill levels.</li>
      <li><a href="/ai-prompts"><strong>AI Safety Prompt Library</strong></a> - 406+ ready-to-use prompts that help you use AI tools like ChatGPT safely, without accidentally exposing sensitive information.</li>
      <li><a href="/guides"><strong>Cybersecurity Guides</strong></a> - 125+ plain-language guides covering password security, two-factor authentication, safe browsing, and protecting your devices.</li>
    </ul>
  </section>

  <section>
    <h2>Why This Matters: AI Made Scams Unrecognizable</h2>
    <p>A grandmother who received a phone call in her grandson's cloned voice begging for bail money. A small business owner who wired $47,000 after a deepfake video call. A college student whose identity was stolen through an AI-generated job offer that passed every red-flag check.</p>
    <p>AI has removed the telltale signs that people used to rely on to spot scams: bad grammar, obvious fakes, generic messages. Today's attacks are personalized, polished, and nearly indistinguishable from legitimate communication.</p>
    <p>GetCyberRight was started by a family that experienced these attacks firsthand. We built AI-powered tools because we realized the old methods of spotting scams no longer work. If scammers are using AI, your protection needs AI too.</p>
  </section>

  <section>
    <h2>Platform Coverage</h2>
    <ul>
      <li><strong>501+</strong> Data Brokers Tracked - Companies monitored for selling personal data</li>
      <li><strong>406+</strong> AI Safety Prompts - Ready-to-use prompts for secure AI usage</li>
      <li><strong>125+</strong> Safety Guides - Plain-language cybersecurity resources</li>
      <li><strong>8</strong> Threat Intelligence Feeds - Real-time data from PhishTank, URLhaus, VirusTotal, and more</li>
      <li><strong>13</strong> Regions Covered - Scam alerts localized for regions worldwide</li>
      <li><strong>52+</strong> Scam Categories - Detailed guides on specific scam types</li>
    </ul>
    <p>Every tool is powered by the same threat intelligence that enterprise security teams rely on, including data from FBI IC3, CISA, INTERPOL, Europol, NIST, PhishTank, and VirusTotal.</p>
  </section>

  <section>
    <h2>Our Philosophy: Cybersecurity Should Not Require a Degree</h2>
    <p>The biggest gap in cybersecurity is not technology. It is accessibility. The knowledge exists to prevent most scams, but it is locked behind corporate firewalls and technical jargon.</p>
    <ul>
      <li><strong>Accessible to Everyone</strong> - Every core tool and guide is free to use. No login walls for scam checking. No credit card required.</li>
      <li><strong>Transparent and Trustworthy</strong> - We never sell your data. We never use fear-based marketing. Our tools are powered by verified, public threat intelligence sources.</li>
      <li><strong>Community Driven</strong> - The best way to support GetCyberRight is to share it with someone who needs it.</li>
    </ul>
  </section>

  <section>
    <h2>Frequently Asked Questions</h2>
    <h3>What is GetCyberRight?</h3>
    <p>GetCyberRight is an AI-powered digital safety platform that helps families, seniors, students, and small businesses protect themselves from AI-generated phishing, deepfake scams, identity theft, and data brokers. It combines AI-powered scam detection with plain-language education.</p>
    <h3>How does the AI Scam Checker work?</h3>
    <p>The AI Scam Checker lets you paste any suspicious message, email, link, or phone number. AI analyzes the content for social engineering patterns and cross-references 8 live threat intelligence feeds including PhishTank, URLhaus, and VirusTotal to determine if it is a scam.</p>
    <h3>Can AI really detect AI-generated scams?</h3>
    <p>Yes. While AI-generated phishing emails may look flawless to humans, AI analysis can detect patterns in language structure, URL construction, sender behavior, and social engineering tactics that are characteristic of scam content, even when the grammar and formatting are perfect.</p>
    <h3>What tools does GetCyberRight offer?</h3>
    <p>GetCyberRight offers an AI Scam Checker, Data Broker Removal covering 501+ brokers, a Training Academy, an AI Safety Prompt Library with 406+ prompts, 125+ cybersecurity guides, and real-time threat intelligence from 8 verified feeds across 13 regions.</p>
    <h3>Is GetCyberRight free to use?</h3>
    <p>GetCyberRight is free to get started. Core tools like the AI Scam Checker, safety guides, and educational content are available at no cost without requiring an account.</p>
    <h3>Why was GetCyberRight created?</h3>
    <p>GetCyberRight was started by a family that experienced AI-powered scams, impersonation attacks, and phone fraud firsthand. The mission is to use AI to fight AI-powered threats and make cybersecurity accessible for non-experts.</p>
  </section>

  ${buildFooter()}
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
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
    { question: "What tools does GetCyberRight offer?", answer: "We offer an AI Scam Checker that analyzes URLs, emails, and QR codes; a Data Broker Removal tool covering 501+ sites; a Password Generator; a Cyber Threat Radar; and more." },
    { question: "Who is GetCyberRight for?", answer: "GetCyberRight is for everyone, including families, parents, kids, seniors, educators, and small businesses. We provide audience-specific content tailored to different experience levels." },
    { question: "How does the AI Scam Checker work?", answer: "Our AI Scam Checker uses multiple security databases including Google Safe Browsing, VirusTotal, and URLhaus to analyze suspicious links, emails, and messages and provide a safety score." },
  ]);

  return `${head}
<body style="font-family:Inter,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">
  ${orgSchema}
  ${websiteSchema}
  ${faqSchema}

  <header>
    <h1>GetCyberRight: Free Cybersecurity Tools for Families, Seniors &amp; Small Businesses</h1>
    <p style="font-size:18px;color:#444;">Got a suspicious message? AI checks it in seconds. AI-powered scam detection across 8 live threat intelligence feeds, data broker removal, and practical safety training for families, seniors, and small businesses.</p>
  </header>

  <section>
    <h2>Free Cybersecurity Tools</h2>
    <ul>
      <li><a href="/scam-checker">AI Scam Checker</a> - Analyze suspicious URLs, emails, text messages, and QR codes with real-time threat intelligence</li>
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
    <p>We offer an AI Scam Checker that analyzes URLs, emails, and QR codes; a Data Broker Removal tool covering 501+ sites; a Password Generator; a Cyber Threat Radar; and more.</p>
    <h3>Who is GetCyberRight for?</h3>
    <p>GetCyberRight is for everyone, including families, parents, kids, seniors, educators, and small businesses. We provide audience-specific content tailored to different experience levels.</p>
    <h3>How does the AI Scam Checker work?</h3>
    <p>Our AI Scam Checker uses multiple security databases including Google Safe Browsing, VirusTotal, and URLhaus to analyze suspicious links, emails, and messages and provide a safety score.</p>
  </section>

  ${buildFooter()}
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body></html>`;
}

export function seoMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ua = req.get("User-Agent");
    if (!isBot(ua)) return next();

    const path = req.path;
    let html: string | null = null;

    try {
      if (path === "/") {
        html = renderHomePage();
      }

      if (!html && path === "/about") {
        html = renderAboutPage();
      }

      const guideMatch = path.match(/^\/guides\/([a-z0-9-]+)$/);
      if (!html && guideMatch) {
        html = await renderGuidePage(guideMatch[1]);
      }

      const alertMatch = path.match(/^\/alerts\/([a-z0-9-]+)$/);
      if (!html && alertMatch) {
        html = await renderAlertPage(alertMatch[1]);
      }

      const scamIntelMatch = path.match(/^\/scam-intel\/([a-z0-9-]+)$/);
      if (!html && scamIntelMatch) {
        html = await renderScamIntelPage(scamIntelMatch[1]);
      }

      const scamMatch = path.match(/^\/scams\/([a-z0-9-]+)$/);
      if (!html && scamMatch) {
        html = renderScamPage(scamMatch[1]);
      }

      const topicMatch = path.match(/^\/topics\/([a-z0-9-]+)$/);
      if (!html && topicMatch) {
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
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
        return;
      }
    } catch (error: any) {
      console.error(`[SEO] Error rendering ${path}:`, error.message);
    }

    next();
  };
}
