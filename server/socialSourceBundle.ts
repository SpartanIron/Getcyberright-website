import type { Citation } from "./scamIntelAggregator";
import type { CyberSafetyGuide, CyberThreatAlert, ScamIntelligence } from "@shared/schema";

export interface SourceBundle {
  recordId: string;
  recordType: "guide" | "alert" | "scam_intel";
  title: string;
  canonicalUrl: string;
  category: string;
  citations: Citation[];
  allowedClaims: string[];
  contextForLLM: string;
}

/**
 * Thin-source refusal gate. If a bundle does not have at least one of:
 *  - 600 chars of substantive corpus, OR
 *  - 1 allowed numeric claim AND 200 chars of corpus,
 * we refuse to generate posts. Excellence or silence — we won't ship a post
 * that has nothing to anchor its claims against.
 */
export function isBundleSubstantive(bundle: SourceBundle): { ok: boolean; reason?: string } {
  const corpusLen = bundle.contextForLLM?.length || 0;
  if (corpusLen >= 600) return { ok: true };
  if (bundle.allowedClaims.length >= 1 && corpusLen >= 200) return { ok: true };
  return {
    ok: false,
    reason: `thin source: corpus=${corpusLen} chars, allowedClaims=${bundle.allowedClaims.length} — refusing to generate (excellence or silence)`,
  };
}

function cleanHtml(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function publisherFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host;
  } catch {
    return url;
  }
}

function extractAllowedClaims(text: string): string[] {
  if (!text) return [];
  const claims = new Set<string>();
  const dollarRe = /\$\s?[\d,]+(?:\.\d+)?\s?(?:million|billion|trillion|m|bn|b|k)?/gi;
  let m: RegExpExecArray | null;
  while ((m = dollarRe.exec(text)) !== null) claims.add(m[0].trim().toLowerCase());

  const pctRe = /\b\d+(?:\.\d+)?\s?%/g;
  while ((m = pctRe.exec(text)) !== null) claims.add(m[0].trim().toLowerCase());

  const numberRe = /\b\d{1,3}(?:,\d{3})+\b|\b\d{4,}\b/g;
  while ((m = numberRe.exec(text)) !== null) claims.add(m[0].trim().toLowerCase());

  const yearRe = /\b(?:19|20)\d{2}\b/g;
  while ((m = yearRe.exec(text)) !== null) claims.add(m[0].trim().toLowerCase());

  const cveRe = /\bCVE-\d{4}-\d{4,}\b/gi;
  while ((m = cveRe.exec(text)) !== null) claims.add(m[0].trim().toUpperCase());

  return Array.from(claims);
}

function buildCitationsFromUrls(urls: string[], title: string, accessedAt: string): Citation[] {
  return urls
    .filter((u) => typeof u === "string" && u.trim().length > 0)
    .map((u) => ({
      name: title,
      publisher: publisherFromUrl(u),
      url: u,
      accessedAt,
    }));
}

export function buildGuideBundle(guide: CyberSafetyGuide): SourceBundle {
  const accessedAt = new Date().toISOString();
  const canonicalUrl = `https://www.getcyberright.com/guides/${guide.slug}`;
  const plainContent = cleanHtml(guide.content).slice(0, 4000);
  const faqText = (guide.faq || [])
    .map((f: any) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n")
    .slice(0, 1500);

  const allowedClaims = extractAllowedClaims(`${plainContent}\n${faqText}`);

  const citations: Citation[] = [
    {
      name: guide.title,
      publisher: "GetCyberRight",
      url: canonicalUrl,
      accessedAt,
      datePublished: guide.publishedAt ? new Date(guide.publishedAt).toISOString() : undefined,
    },
  ];

  const contextForLLM = [
    `GUIDE: ${guide.title}`,
    `CATEGORY: ${guide.category}`,
    plainContent ? `CONTENT (only quote claims that appear here verbatim):\n${plainContent}` : "",
    faqText ? `FAQ:\n${faqText}` : "",
    allowedClaims.length > 0
      ? `ALLOWED NUMERIC CLAIMS (only these numbers/percentages/dollar amounts may appear in posts): ${allowedClaims.join(", ")}`
      : "NO NUMERIC CLAIMS PERMITTED — the source contains no statistics. Write qualitatively only.",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    recordId: guide.id,
    recordType: "guide",
    title: guide.title,
    canonicalUrl,
    category: guide.category,
    citations,
    allowedClaims,
    contextForLLM,
  };
}

export function buildAlertBundle(alert: CyberThreatAlert): SourceBundle {
  const accessedAt = new Date().toISOString();
  const canonicalUrl = `https://www.getcyberright.com/alerts/${alert.slug}`;
  const detailedAnalysis = cleanHtml(alert.detailedAnalysis).slice(0, 3000);
  const description = cleanHtml(alert.description).slice(0, 1500);
  const mitigation = (alert.mitigationSteps || []).join("\n").slice(0, 1500);
  const indicators = (alert.indicators || [])
    .map((i: any) => `${i.type}: ${i.description || i.value}`)
    .join("\n")
    .slice(0, 1000);
  const cves = (alert.cveIds || []).join(", ");

  const corpus = `${description}\n${detailedAnalysis}\n${mitigation}\n${indicators}\n${cves}`;
  const allowedClaims = extractAllowedClaims(corpus);

  const sourceUrls = (alert.sourceUrls || []).filter((u) => u && u.startsWith("http"));
  const citations: Citation[] = [
    {
      name: alert.threatName,
      publisher: "GetCyberRight",
      url: canonicalUrl,
      accessedAt,
      datePublished: alert.publishedAt ? new Date(alert.publishedAt).toISOString() : undefined,
    },
    ...buildCitationsFromUrls(sourceUrls, alert.threatName, accessedAt),
  ];

  const contextForLLM = [
    `THREAT ALERT: ${alert.threatName}`,
    `CATEGORY: ${alert.threatCategory}`,
    `RISK LEVEL: ${alert.riskLevel}`,
    description ? `DESCRIPTION:\n${description}` : "",
    detailedAnalysis ? `DETAILED ANALYSIS:\n${detailedAnalysis}` : "",
    mitigation ? `MITIGATION STEPS:\n${mitigation}` : "",
    indicators ? `INDICATORS:\n${indicators}` : "",
    cves ? `CVE IDS: ${cves}` : "",
    sourceUrls.length > 0 ? `EXTERNAL SOURCE URLS (for citation only, do not link in post body): ${sourceUrls.join(", ")}` : "",
    allowedClaims.length > 0
      ? `ALLOWED NUMERIC CLAIMS (only these numbers/percentages/dollar amounts/CVEs may appear in posts): ${allowedClaims.join(", ")}`
      : "NO NUMERIC CLAIMS PERMITTED — the source contains no statistics. Write qualitatively only.",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    recordId: alert.id,
    recordType: "alert",
    title: alert.threatName,
    canonicalUrl,
    category: alert.threatCategory,
    citations,
    allowedClaims,
    contextForLLM,
  };
}

export function buildScamBundle(scam: ScamIntelligence): SourceBundle {
  const accessedAt = new Date().toISOString();
  const canonicalUrl = `https://www.getcyberright.com/scam-intel/${scam.slug}`;
  const howItWorks = (scam.howItWorks || [])
    .map((s: any) => `Step ${s.step}: ${s.title} - ${s.description}`)
    .join("\n")
    .slice(0, 1500);
  const warningSigns = (scam.warningSigns || []).join("\n").slice(0, 800);
  const preventionTips = (scam.preventionTips || []).join("\n").slice(0, 1000);
  const examples = (scam.exampleMessages || [])
    .map((e: any) => `[${e.context}]: "${e.message}"`)
    .join("\n")
    .slice(0, 1200);
  const averageLoss = scam.averageLoss || "";
  const reportCount = scam.reportCount ? String(scam.reportCount) : "";

  const corpus = `${howItWorks}\n${warningSigns}\n${preventionTips}\n${examples}\n${averageLoss}\n${reportCount}`;
  const allowedClaims = extractAllowedClaims(corpus);

  const citations: Citation[] = [
    {
      name: scam.scamName,
      publisher: "GetCyberRight",
      url: canonicalUrl,
      accessedAt,
      datePublished: scam.dateDetected ? new Date(scam.dateDetected).toISOString() : undefined,
    },
  ];

  const contextForLLM = [
    `SCAM: ${scam.scamName}`,
    `CATEGORY: ${scam.scamCategory}`,
    `RISK LEVEL: ${scam.riskLevel}`,
    howItWorks ? `HOW IT WORKS:\n${howItWorks}` : "",
    warningSigns ? `WARNING SIGNS:\n${warningSigns}` : "",
    preventionTips ? `PREVENTION TIPS:\n${preventionTips}` : "",
    examples ? `EXAMPLE SCAM MESSAGES:\n${examples}` : "",
    averageLoss ? `AVERAGE LOSS: ${averageLoss}` : "",
    reportCount ? `REPORT COUNT: ${reportCount}` : "",
    allowedClaims.length > 0
      ? `ALLOWED NUMERIC CLAIMS (only these numbers/percentages/dollar amounts may appear in posts): ${allowedClaims.join(", ")}`
      : "NO NUMERIC CLAIMS PERMITTED — the source contains no statistics. Write qualitatively only.",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    recordId: scam.id,
    recordType: "scam_intel",
    title: scam.scamName,
    canonicalUrl,
    category: scam.scamCategory,
    citations,
    allowedClaims,
    contextForLLM,
  };
}
