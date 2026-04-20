import { createHash } from "crypto";

export interface JargonEntry {
  term: RegExp;
  definition: string;
  replacement: string;
}

export const JARGON_BLOCKLIST: JargonEntry[] = [
  { term: /\bzero[\s-]?day\b/gi, definition: "a newly discovered software flaw with no fix yet", replacement: "newly discovered software flaw" },
  { term: /\bthreat actors?\b/gi, definition: "the criminals behind an attack", replacement: "criminals" },
  { term: /\bbad actors?\b/gi, definition: "the criminals behind an attack", replacement: "criminals" },
  { term: /\bAPT\b/g, definition: "an organized, long-running hacking group, often state-backed", replacement: "organized hacking group" },
  { term: /\bSOC\b/g, definition: "a company's security monitoring team", replacement: "security team" },
  { term: /\bCVE-\d{4}-\d+\b/gi, definition: "an industry tracking number for this software flaw", replacement: "this tracked software flaw" },
  { term: /\blateral movement\b/gi, definition: "when attackers spread from one device to others inside a network", replacement: "spreading inside a network" },
  { term: /\bIo[CA]s?\b/g, definition: "warning signs that an attack happened", replacement: "warning signs of an attack" },
  { term: /\bC2 server\b/gi, definition: "a server attackers use to remotely control infected devices", replacement: "attacker control server" },
  { term: /\bpayload\b/gi, definition: "the harmful file or code an attack delivers", replacement: "harmful file" },
  { term: /\bexfiltrat(ed?|ion|ing)\b/gi, definition: "data being secretly stolen out of a network", replacement: "stolen" },
  { term: /\bremote code execution\b/gi, definition: "letting attackers run their own code on your device from afar", replacement: "remote takeover of a device" },
  { term: /\bRCE\b/g, definition: "letting attackers run their own code on your device from afar", replacement: "remote takeover of a device" },
  { term: /\bTTPs?\b/g, definition: "the tactics, techniques, and procedures attackers tend to reuse", replacement: "attacker tactics" },
  { term: /\bMITRE\b/g, definition: "a research group that catalogs attacker behavior for the security industry", replacement: "the security industry" },
  { term: /\bSIEM\b/g, definition: "software that watches a network for suspicious activity", replacement: "security monitoring system" },
];

export type CuratedTopic =
  | "spot-the-scam"
  | "protect-parents"
  | "keep-kids-safe"
  | "this-weeks-threat";

export const CURATED_TOPIC_LABELS: Record<CuratedTopic, string> = {
  "spot-the-scam": "How to Spot This Scam",
  "protect-parents": "Protecting Your Parents",
  "keep-kids-safe": "Keeping Kids Safe",
  "this-weeks-threat": "This Week's Threat in Plain English",
};

export interface JargonScan {
  ok: boolean;
  blockedTerms: string[];
}

export function scanJargon(text: string): JargonScan {
  if (!text) return { ok: true, blockedTerms: [] };
  const blocked: string[] = [];
  for (const { term } of JARGON_BLOCKLIST) {
    const matches = text.match(term);
    if (matches) blocked.push(...matches.map((m) => m.toLowerCase()));
  }
  return { ok: blocked.length === 0, blockedTerms: [...new Set(blocked)] };
}

/** For aggregated content: keep original wording but add an inline plain-English
 *  definition the first time each blocked term appears. Never silently rewrites. */
export function annotateInlineDefinitions(text: string): string {
  if (!text) return text;
  let out = text;
  const seen = new Set<string>();
  for (const { term, definition } of JARGON_BLOCKLIST) {
    out = out.replace(term, (match) => {
      const key = match.toLowerCase();
      if (seen.has(key)) return match;
      seen.add(key);
      return `${match} (${definition})`;
    });
  }
  return out;
}

/** For curated GCR pieces: the contract is "no jargon". Returns ok=false when
 *  blocked terms remain, so the caller can skip publishing. */
export function gateCuratedPlainEnglish(title: string, excerpt: string, content: string): JargonScan {
  const combined = [title, excerpt, content].filter(Boolean).join("\n");
  return scanJargon(combined);
}

export function classifyCuratedTopic(
  title: string,
  excerpt: string,
  category?: string,
): CuratedTopic {
  const text = `${title} ${excerpt} ${category || ""}`.toLowerCase();

  const kidsKeywords = ["kid", "child", "teen", "school", "tiktok", "snapchat", "discord", "gaming", "minor", "student", "parental control"];
  const seniorsKeywords = ["senior", "elderly", "grandparent", "medicare", "social security", "retirement", "older adult", "romance scam"];
  const scamKeywords = ["scam", "phishing", "fraud", "fake", "impersonat", "spoof", "smishing", "vishing", "romance", "sextortion"];

  if (kidsKeywords.some((k) => text.includes(k))) return "keep-kids-safe";
  if (seniorsKeywords.some((k) => text.includes(k))) return "protect-parents";
  if (scamKeywords.some((k) => text.includes(k))) return "spot-the-scam";
  return "this-weeks-threat";
}

/** SHA-256 of the actual image bytes (or seed text for synthetic cards). */
export function hashBuffer(buf: Buffer | string | null | undefined): string | null {
  if (!buf) return null;
  if (typeof buf === "string" && !buf.trim()) return null;
  return createHash("sha256").update(buf).digest("hex").slice(0, 32);
}

export async function fetchAndHashImage(
  url: string,
  timeoutMs = 8000,
): Promise<{ hash: string | null; bytes: Buffer | null }> {
  if (!url) return { hash: null, bytes: null };
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GetCyberRightBot/1.0)",
        Accept: "image/avif,image/webp,image/png,image/jpeg,*/*",
      },
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return { hash: null, bytes: null };
    const ab = await res.arrayBuffer();
    const bytes = Buffer.from(ab);
    if (bytes.length < 1024) return { hash: null, bytes: null };
    return { hash: hashBuffer(bytes), bytes };
  } catch {
    return { hash: null, bytes: null };
  }
}

const CATEGORY_COLORS: Record<string, [string, string]> = {
  Cybersecurity: ["#7f1d1d", "#0f172a"],
  AI: ["#4c1d95", "#0f172a"],
  Tech: ["#1e3a8a", "#0f172a"],
  "Action Needed": ["#9a3412", "#0f172a"],
  Learning: ["#065f46", "#0f172a"],
};

/** Build a unique branded SVG card (data URL) for curated articles when a
 *  publisher image is missing or duplicates an existing hash. The card content
 *  is derived from title + category so each is unique. */
export function generateBrandedCardSvg(title: string, category: string): { dataUrl: string; hash: string } {
  const [c1, c2] = CATEGORY_COLORS[category] || ["#1f2937", "#0f172a"];
  const safeTitle = (title || "GetCyberRight").slice(0, 120).replace(/[<>&"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!,
  );
  const lines: string[] = [];
  let line = "";
  for (const word of safeTitle.split(/\s+/)) {
    if ((line + " " + word).trim().length > 28) {
      lines.push(line.trim());
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
    if (lines.length >= 4) break;
  }
  if (line && lines.length < 5) lines.push(line.trim());
  const tspans = lines
    .map((l, i) => `<tspan x="60" dy="${i === 0 ? 0 : 64}">${l}</tspan>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1050" cy="100" r="180" fill="rgba(255,255,255,0.05)"/>
  <text x="60" y="100" fill="#5eead4" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="700" letter-spacing="3">GETCYBERRIGHT</text>
  <text x="60" y="140" fill="rgba(255,255,255,0.6)" font-family="system-ui,sans-serif" font-size="18">${category}</text>
  <text x="60" y="240" fill="white" font-family="system-ui,-apple-system,sans-serif" font-size="56" font-weight="800">${tspans}</text>
  <text x="60" y="580" fill="rgba(255,255,255,0.7)" font-family="system-ui,sans-serif" font-size="20">By Jude Annan, CISM &#183; Plain-English security for families</text>
</svg>`;
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  const hash = hashBuffer(svg)!;
  return { dataUrl, hash };
}

const STOP_WORDS = new Set([
  "the","a","an","and","or","but","of","to","in","on","for","with","by","at","from","is","are","was","were","be","been","being","this","that","these","those","it","its","as","you","your","our","we","they","their","them","new","says","say","said","how","why","what","when","where","who","will","may","can","could","should","would","just","about","into","over","after","before","than","then","more","most","also","not","no",
]);

export function tokenizeForCluster(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
}

export interface ClusterableArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: Date | null;
  slug: string;
  imageUrl?: string | null;
  category: string;
  excerpt: string;
}

export interface TrendingCluster {
  clusterId: string;
  keywords: string[];
  sources: string[];
  articleIds: string[];
  representative: ClusterableArticle;
  size: number;
}

export function clusterTrending(
  articles: ClusterableArticle[],
  hoursWindow = 48,
): TrendingCluster[] {
  const cutoff = Date.now() - hoursWindow * 3600 * 1000;
  const recent = articles.filter(
    (a) => a.publishedAt && a.publishedAt.getTime() >= cutoff,
  );

  const tokenized = recent.map((a) => ({ a, tokens: new Set(tokenizeForCluster(a.title)) }));
  const used = new Set<string>();
  const clusters: TrendingCluster[] = [];

  for (let i = 0; i < tokenized.length; i++) {
    const { a, tokens } = tokenized[i];
    if (used.has(a.id) || tokens.size < 2) continue;
    const group = [tokenized[i]];
    used.add(a.id);
    for (let j = i + 1; j < tokenized.length; j++) {
      const other = tokenized[j];
      if (used.has(other.a.id)) continue;
      const overlap = [...tokens].filter((t) => other.tokens.has(t)).length;
      const union = new Set([...tokens, ...other.tokens]).size;
      const jaccard = union > 0 ? overlap / union : 0;
      if (overlap >= 2 && jaccard >= 0.25) {
        group.push(other);
        used.add(other.a.id);
      }
    }
    const sources = [...new Set(group.map((g) => g.a.source))];
    if (sources.length >= 2) {
      const sharedKeywords = [...tokens].filter((t) =>
        group.every((g) => g.tokens.has(t)),
      );
      const clusterId = createHash("sha1")
        .update(sharedKeywords.sort().join("|"))
        .digest("hex")
        .slice(0, 12);
      clusters.push({
        clusterId,
        keywords: sharedKeywords.slice(0, 4),
        sources,
        articleIds: group.map((g) => g.a.id),
        representative: group.sort(
          (x, y) => (y.a.publishedAt?.getTime() || 0) - (x.a.publishedAt?.getTime() || 0),
        )[0].a,
        size: group.length,
      });
    }
  }

  return clusters.sort((a, b) => b.size - a.size || b.sources.length - a.sources.length);
}

export function isCuratedSource(source: string | null | undefined): boolean {
  if (!source) return false;
  return /getcyberright|gcr/i.test(source);
}
