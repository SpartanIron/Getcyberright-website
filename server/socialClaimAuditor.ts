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

  // Named companies / victim orgs: ProperNoun (Inc|Corp|Ltd|LLC|Group|Bank|Hospital|University|Holdings|Healthcare)
  const orgRe =
    /\b[A-Z][A-Za-z0-9&'.\-]+(?:\s+[A-Z][A-Za-z0-9&'.\-]+){0,3}\s+(?:Inc|Corp|Corporation|Ltd|LLC|Group|Bank|Hospital|University|Holdings|Healthcare|Systems|Networks|Solutions|Technologies)\b/g;
  while ((m = orgRe.exec(text)) !== null) push(m[0], "company", grabContext(m.index, m[0].length));

  return out;
}

function isClaimSupported(claim: ExtractedClaim, allowedSet: Set<string>, corpus: string): boolean {
  const norm = claim.text.toLowerCase().replace(/\s+/g, "");
  for (const allowed of allowedSet) {
    if (allowed.replace(/\s+/g, "") === norm) return true;
  }
  return corpus.toLowerCase().replace(/\s+/g, "").includes(norm);
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

  for (const claim of extracted) {
    if (claim.kind === "agency" || claim.kind === "actor" || claim.kind === "company") {
      if (corpusContains(corpus, claim.text)) {
        matched.push(claim.text);
      } else {
        failures.push({
          claim: claim.text,
          kind: claim.kind,
          reason: `Named ${claim.kind} "${claim.text}" not present in source bundle (potential fabricated attribution)`,
        });
      }
      continue;
    }

    if (claim.kind === "date") {
      if (corpusContains(corpus, claim.text)) {
        matched.push(claim.text);
      } else {
        failures.push({
          claim: claim.text,
          kind: claim.kind,
          reason: `Date "${claim.text}" not present in source bundle`,
        });
      }
      continue;
    }

    if (claim.kind === "year") {
      if (corpusContains(corpus, claim.text)) {
        matched.push(claim.text);
      } else {
        failures.push({
          claim: claim.text,
          kind: claim.kind,
          reason: `Year "${claim.text}" not present in source bundle`,
        });
      }
      continue;
    }

    if (isClaimSupported(claim, allowedSet, corpus)) {
      matched.push(claim.text);
    } else {
      failures.push({
        claim: claim.text,
        kind: claim.kind,
        reason: `Claim "${claim.text}" (${claim.kind}) not found verbatim in source bundle`,
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
