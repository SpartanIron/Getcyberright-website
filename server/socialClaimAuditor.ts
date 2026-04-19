import type { SourceBundle } from "./socialSourceBundle";

export interface ExtractedClaim {
  text: string;
  kind: "dollar" | "percent" | "number" | "year" | "cve" | "date" | "actor" | "company" | "agency" | "phrase";
  context: string;
}

export interface AuditFailure {
  claim: string;
  kind: ExtractedClaim["kind"];
  reason: string;
}

export interface ClaimAuditResult {
  verdict: "pass" | "fail";
  extracted: ExtractedClaim[];
  failures: AuditFailure[];
  matchedClaims: string[];
}

const FORBIDDEN_PHRASES = [
  /studies show/i,
  /research indicates/i,
  /experts say/i,
  /according to (?:a |an )?(?:recent )?(?:study|report)(?!\s+by\s+)/i,
  /a recent survey/i,
  /\b\d+(?:\.\d+)?\s?(?:million|billion|trillion)\s+(?:people|users|victims|families|americans|adults|children)\b/i,
];

const KNOWN_AGENCIES = [
  "fbi", "cisa", "ftc", "ncsc", "interpol", "europol", "acsc", "enisa",
  "cifas", "ic3", "secret service", "cert", "us-cert", "nsa", "dhs", "ncsc-uk",
];

// Well-known APT / threat actor groups that, if mentioned, MUST appear in the source bundle.
const KNOWN_THREAT_ACTORS = [
  "lockbit", "blackcat", "alphv", "scattered spider", "lazarus", "fin7", "fin8",
  "apt28", "apt29", "apt40", "apt41", "cozy bear", "fancy bear", "sandworm",
  "conti", "revil", "clop", "cl0p", "blackbyte", "hive", "akira", "play",
  "rhysida", "muddywater", "kimsuky", "evil corp", "trickbot", "emotet", "qakbot",
];

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function corpusContains(corpus: string, needle: string): boolean {
  const c = corpus.toLowerCase().replace(/\s+/g, " ");
  const n = needle.toLowerCase().replace(/\s+/g, " ");
  return c.includes(n);
}

function extractClaims(text: string): ExtractedClaim[] {
  const out: ExtractedClaim[] = [];
  const seen = new Set<string>();
  const push = (raw: string, kind: ExtractedClaim["kind"], context: string) => {
    const key = `${kind}::${raw.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ text: raw.trim(), kind, context });
  };

  const grabContext = (idx: number, len: number) => {
    const start = Math.max(0, idx - 30);
    const end = Math.min(text.length, idx + len + 30);
    return text.slice(start, end).replace(/\s+/g, " ").trim();
  };

  let m: RegExpExecArray | null;

  const dollarRe = /\$\s?[\d,]+(?:\.\d+)?\s?(?:million|billion|trillion|m|bn|b|k)?/gi;
  while ((m = dollarRe.exec(text)) !== null) push(m[0], "dollar", grabContext(m.index, m[0].length));

  const pctRe = /\b\d+(?:\.\d+)?\s?%/g;
  while ((m = pctRe.exec(text)) !== null) push(m[0], "percent", grabContext(m.index, m[0].length));

  const numberRe = /\b\d{1,3}(?:,\d{3})+\b|\b\d{4,}\b/g;
  while ((m = numberRe.exec(text)) !== null) push(m[0], "number", grabContext(m.index, m[0].length));

  const yearRe = /\b(?:19|20)\d{2}\b/g;
  while ((m = yearRe.exec(text)) !== null) push(m[0], "year", grabContext(m.index, m[0].length));

  const cveRe = /\bCVE-\d{4}-\d{4,}\b/gi;
  while ((m = cveRe.exec(text)) !== null) push(m[0].toUpperCase(), "cve", grabContext(m.index, m[0].length));

  // Dates: ISO YYYY-MM-DD, "January 5, 2026", "5 January 2026"
  const isoDate = /\b(?:19|20)\d{2}-\d{2}-\d{2}\b/g;
  while ((m = isoDate.exec(text)) !== null) push(m[0], "date", grabContext(m.index, m[0].length));
  const longDate =
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+(?:19|20)\d{2}\b/gi;
  while ((m = longDate.exec(text)) !== null) push(m[0], "date", grabContext(m.index, m[0].length));

  // Threat actors
  for (const actor of KNOWN_THREAT_ACTORS) {
    const re = new RegExp(`\\b${actor}\\b`, "gi");
    while ((m = re.exec(text)) !== null) push(m[0], "actor", grabContext(m.index, m[0].length));
  }

  // Agency mentions
  for (const agency of KNOWN_AGENCIES) {
    const re = new RegExp(`\\b${agency.replace(/-/g, "[-\\s]?")}\\b`, "gi");
    while ((m = re.exec(text)) !== null) push(m[0], "agency", grabContext(m.index, m[0].length));
  }

  // Named companies / victim orgs with explicit suffix.
  const orgRe =
    /\b[A-Z][A-Za-z0-9&'.\-]+(?:\s+[A-Z][A-Za-z0-9&'.\-]+){0,3}\s+(?:Inc|Corp|Corporation|Ltd|LLC|Group|Bank|Hospital|University|Holdings|Healthcare|Systems|Networks|Solutions|Technologies)\b/g;
  while ((m = orgRe.exec(text)) !== null) push(m[0], "company", grabContext(m.index, m[0].length));

  // Generic ProperNoun extraction: 2-4 consecutive Capitalized words, anywhere in
  // the body. Catches arbitrary named victims/actors/products/agencies that are
  // NOT in our hand-curated allowlists. We then verify each against the source
  // bundle in auditPostContent — anything unsupported = fabricated entity = fail.
  const STOPWORDS = new Set([
    "The","A","An","This","That","These","Those","Our","Your","Their","His","Her","Its",
    "Source","Sources","Full","Watch","Tip","Tips","Update","Alert","Warning","Family",
    "Stay","Keep","Visit","Read","Learn","Get","Cyber","Right","GetCyberRight","Source:",
    "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
    "January","February","March","April","May","June","July","August","September","October","November","December",
  ]);
  const properNounRe = /\b([A-Z][A-Za-z0-9.&'\-]+(?:\s+[A-Z][A-Za-z0-9.&'\-]+){1,3})\b/g;
  while ((m = properNounRe.exec(text)) !== null) {
    const phrase = m[0].trim();
    const tokens = phrase.split(/\s+/);
    if (tokens.every((t) => STOPWORDS.has(t))) continue;
    if (/^[A-Z][a-z]+$/.test(tokens[0]) && tokens.length === 2 && /^[A-Z][a-z]+$/.test(tokens[1])) {
      // Skip bare "First Last" name pairs unless one token looks org-y; still extract
      // multi-word names that include uppercase acronyms or 3+ tokens.
    }
    push(phrase, "company", grabContext(m.index, m[0].length));
  }

  return out;
}

// Strict verbatim allowlist match.
// Normalization: lowercase, strip whitespace. For numeric kinds we additionally
// strip currency/percent symbols and commas so that "$2,400" in allowlist
// covers an extracted bare "2,400" number derived from the same figure.
function normalizeClaim(text: string, kind: ExtractedClaim["kind"]): string {
  let s = text.toLowerCase().replace(/\s+/g, "");
  if (kind === "dollar" || kind === "percent" || kind === "number") {
    s = s.replace(/[$,%]/g, "");
  }
  return s;
}

function isAllowedVerbatim(claim: ExtractedClaim, allowedSet: Set<string>): boolean {
  const norm = normalizeClaim(claim.text, claim.kind);
  if (!norm) return false;
  for (const allowed of allowedSet) {
    if (normalizeClaim(allowed, claim.kind) === norm) return true;
    // Also tolerate allowlist entries that *contain* the numeric token
    // (e.g. allowlist "$2,400" should also cover bare "2,400").
    if ((claim.kind === "dollar" || claim.kind === "percent" || claim.kind === "number")
        && normalizeClaim(allowed, claim.kind).includes(norm)) {
      return true;
    }
  }
  return false;
}

export function auditPostContent(content: string, bundle: SourceBundle): ClaimAuditResult {
  const failures: AuditFailure[] = [];
  const matched: string[] = [];

  for (const re of FORBIDDEN_PHRASES) {
    const m = content.match(re);
    if (m) {
      failures.push({
        claim: m[0],
        kind: "phrase",
        reason: `Forbidden vague-attribution phrase: "${m[0]}"`,
      });
    }
  }

  const extracted = extractClaims(content);
  const allowedSet = new Set(bundle.allowedClaims.map((c) => c.toLowerCase()));
  const corpus = bundle.contextForLLM;

  // High-stakes kinds: must match the source-bundle allowlist character-for-character
  // (case + whitespace insensitive). No fuzzy corpus fallback for these.
  const STRICT_KINDS: ExtractedClaim["kind"][] = [
    "dollar", "percent", "number", "year", "cve", "date", "actor", "agency",
  ];

  for (const claim of extracted) {
    if (STRICT_KINDS.includes(claim.kind)) {
      if (isAllowedVerbatim(claim, allowedSet)) {
        matched.push(claim.text);
      } else {
        failures.push({
          claim: claim.text,
          kind: claim.kind,
          reason: `${claim.kind} "${claim.text}" not in source-bundle allowlist (verbatim match required)`,
        });
      }
      continue;
    }

    // Company / proper-noun: allowlist OR exact whitespace-normalized appearance
    // in the source corpus context (proper nouns are often present in source
    // titles/excerpts without being separately extracted).
    if (isAllowedVerbatim(claim, allowedSet) || corpusContains(corpus, claim.text)) {
      matched.push(claim.text);
    } else {
      failures.push({
        claim: claim.text,
        kind: claim.kind,
        reason: `Named ${claim.kind} "${claim.text}" not present in source bundle (potential fabricated attribution)`,
      });
    }
  }

  return {
    verdict: failures.length === 0 ? "pass" : "fail",
    extracted,
    failures,
    matchedClaims: matched,
  };
}

// Re-export normalize helper for callers wanting to test source coverage themselves.
export const _internals = { normalize, corpusContains, extractClaims };

/**
 * Pure helper used by persistAuditedPost (server/socialDistributionService.ts)
 * to translate a ClaimAuditResult into the persisted social_post row's
 * status + auditVerdict + publishError fields.
 *
 * Extracted so the safety contract ("any audit failure -> status='blocked',
 * auditVerdict !== 'pass', and a publishError describing why") can be locked
 * in by tests without spinning up the full distribution pipeline.
 */
export function deriveAuditedPostState(audit: ClaimAuditResult): {
  status: "draft" | "blocked";
  auditVerdict: "pass" | "fail";
  publishError?: string;
} {
  const passed = audit.verdict === "pass";
  return {
    status: passed ? "draft" : "blocked",
    auditVerdict: audit.verdict,
    publishError: passed
      ? undefined
      : `Claim audit failed: ${audit.failures.map((f) => f.reason).slice(0, 3).join(" | ")}`,
  };
}
