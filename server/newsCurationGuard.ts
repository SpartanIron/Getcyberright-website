import { createHash } from "crypto";

export const JARGON_BLOCKLIST: { term: RegExp; replacement: string }[] = [
  { term: /\bzero[\s-]?day\b/gi, replacement: "newly discovered software flaw" },
  { term: /\bthreat actors?\b/gi, replacement: "criminals" },
  { term: /\bbad actors?\b/gi, replacement: "criminals" },
  { term: /\bAPT\b/g, replacement: "organized hacking group" },
  { term: /\bSOC\b/g, replacement: "security team" },
  { term: /\bCVE-\d{4}-\d+\b/gi, replacement: "this software flaw" },
  { term: /\blateral movement\b/gi, replacement: "spreading inside a network" },
  { term: /\bIo[CA]s?\b/g, replacement: "warning signs" },
  { term: /\bC2 server\b/gi, replacement: "attacker control server" },
  { term: /\bpayload\b/gi, replacement: "harmful file" },
  { term: /\bexfiltrat(ed?|ion|ing)\b/gi, replacement: "stolen" },
  { term: /\bremote code execution\b/gi, replacement: "letting attackers run code on your device" },
  { term: /\bRCE\b/g, replacement: "remote code execution attack" },
  { term: /\bphysh(ed|ing)\b/gi, replacement: "phished" },
  { term: /\bTTPs?\b/g, replacement: "attacker tactics" },
  { term: /\bMITRE\b/g, replacement: "the security industry" },
  { term: /\bSIEM\b/g, replacement: "security monitoring system" },
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

export interface JargonCheckResult {
  ok: boolean;
  blockedTerms: string[];
  cleaned: string;
}

export function validateAndCleanPlainEnglish(text: string): JargonCheckResult {
  if (!text) return { ok: true, blockedTerms: [], cleaned: text };
  const blocked: string[] = [];
  let cleaned = text;
  for (const { term, replacement } of JARGON_BLOCKLIST) {
    const matches = cleaned.match(term);
    if (matches) {
      blocked.push(...matches.map((m) => m.toLowerCase()));
      cleaned = cleaned.replace(term, replacement);
    }
  }
  return { ok: blocked.length === 0, blockedTerms: blocked, cleaned };
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

export function computeImageHash(input: string | Buffer | null | undefined): string | null {
  if (!input) return null;
  const data = typeof input === "string" ? input.trim().toLowerCase() : input;
  if (typeof data === "string" && !data) return null;
  return createHash("sha256").update(data).digest("hex").slice(0, 32);
}

const STOP_WORDS = new Set([
  "the","a","an","and","or","but","of","to","in","on","for","with","by","at","from","is","are","was","were","be","been","being","this","that","these","those","it","its","as","you","your","our","we","they","their","them","new","says","say","said","how","why","what","when","where","who","will","may","can","could","should","would","just","about","into","over","after","before","than","then","more","most","also","not","no"
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
