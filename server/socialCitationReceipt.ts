import type { Citation } from "./scamIntelAggregator";

function formatDate(d?: string): string {
  if (!d) return "";
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function dedupeCitations(citations: Citation[]): Citation[] {
  const seen = new Set<string>();
  const out: Citation[] = [];
  for (const c of citations) {
    if (!c?.url) continue;
    const key = c.url.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

/**
 * Long-form deterministic receipt: name + publisher + date + url, one per line.
 * Used for LinkedIn / Facebook / Email / web canonical pages.
 */
export function formatLongReceipt(citations: Citation[], canonicalUrl: string, maxLines = 4): string {
  const deduped = dedupeCitations(citations).slice(0, maxLines);
  if (deduped.length === 0) return `Sources:\n• GetCyberRight: ${canonicalUrl}`;
  const lines: string[] = ["Sources:"];
  for (const c of deduped) {
    const date = formatDate(c.datePublished) || formatDate(c.accessedAt);
    const segments: string[] = [];
    if (c.name) segments.push(c.name);
    if (c.publisher) segments.push(c.publisher);
    if (date) segments.push(date);
    const head = segments.join(" | ") || c.publisher || c.url;
    lines.push(`• ${head}: ${c.url}`);
  }
  if (!deduped.some((c) => c.url === canonicalUrl)) {
    lines.push(`• Full analysis: ${canonicalUrl}`);
  }
  return lines.join("\n");
}

/**
 * Short-form deterministic receipt for character-constrained platforms (X/IG/alert subject lines).
 * Always includes a publisher attribution AND the canonical GCR link so claims are verifiable.
 */
export function formatShortReceipt(citations: Citation[], canonicalUrl: string): string {
  const deduped = dedupeCitations(citations);
  const primary = deduped.find((c) => c.url !== canonicalUrl) || deduped[0];
  const publisher = primary?.publisher || "GetCyberRight";
  return `Source: ${publisher}. Full sources: ${canonicalUrl}`;
}

/**
 * Append a citation receipt to post content. Receipt is REQUIRED on every publishable surface
 * — gold-standard means every claim is verifiable. Long format on LinkedIn/Facebook,
 * compact format on X/Instagram/Email.
 */
export function appendCitationReceipt(content: string, citations: Citation[], platform: string, canonicalUrl: string): string {
  if (!canonicalUrl) return content;

  const isShortForm = platform === "x" || platform === "instagram" || platform === "alert";
  const receipt = isShortForm
    ? formatShortReceipt(citations, canonicalUrl)
    : formatLongReceipt(citations, canonicalUrl);

  let body = content;
  const sourcesIdx = body.search(/(^|\n)\s*(Sources?:)/);
  if (sourcesIdx >= 0) {
    body = body.slice(0, sourcesIdx).replace(/\s+$/, "");
  } else if (canonicalUrl) {
    const urlEsc = canonicalUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const linkLineRe = new RegExp(`(^|\\n)[^\\n]*${urlEsc}[^\\n]*`, "g");
    body = body.replace(linkLineRe, "").replace(/\n{3,}/g, "\n\n").replace(/\s+$/, "");
  }

  return `${body}\n\n${receipt}`;
}

// Legacy helper kept for backward compat with any older callers.
/**
 * Strip the trailing deterministic citation receipt ("Sources:" or "Source:")
 * so downstream auditors see only the body. Receipt dates and external citation
 * URLs would otherwise be (mis)treated as claims.
 */
export function stripCitationReceipt(content: string): string {
  if (!content) return content;
  const m = content.match(/(^|\n)\s*Sources?:/);
  if (!m || typeof m.index !== "number") return content;
  const sliceAt = m.index + (m[1] ? m[1].length : 0);
  return content.slice(0, sliceAt).replace(/\s+$/, "");
}

export function formatCitationReceipt(citations: Citation[], maxLines = 3): string {
  return formatLongReceipt(citations, "", maxLines);
}
