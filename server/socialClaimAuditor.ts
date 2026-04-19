import type { SourceBundle } from "./socialSourceBundle";

export interface ExtractedClaim {
  text: string;
  kind: "dollar" | "percent" | "number" | "year" | "cve";
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
  /according to (?:a |an )?(?:recent )?(?:study|report)(?!\s+by\s+(?:the\s+)?(?:fbi|cisa|ftc|interpol|europol|ncsc|acsc|enisa|cifas))/i,
  /a recent survey/i,
  /\b\d+(?:\.\d+)?\s?(?:million|billion|trillion)\s+(?:people|users|victims|families|americans|adults|children)\b/i,
];

const EXTRA_AGENCY_NAMES = ["fbi", "cisa", "ftc", "ncsc", "interpol", "europol", "acsc", "enisa", "cifas", "ic3"];

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

  return out;
}

function isClaimAllowed(claim: ExtractedClaim, allowedSet: Set<string>, sourceCorpus: string): boolean {
  const norm = claim.text.toLowerCase().replace(/\s+/g, "");
  for (const allowed of allowedSet) {
    if (allowed.replace(/\s+/g, "") === norm) return true;
  }
  // Fallback: check verbatim presence in the source corpus (case-insensitive, whitespace-insensitive)
  const corpusNorm = sourceCorpus.toLowerCase().replace(/\s+/g, "");
  return corpusNorm.includes(norm);
}

export function auditPostContent(content: string, bundle: SourceBundle): ClaimAuditResult {
  const failures: AuditFailure[] = [];
  const matched: string[] = [];

  // Forbidden vague-attribution phrases
  for (const re of FORBIDDEN_PHRASES) {
    const m = content.match(re);
    if (m) {
      failures.push({
        claim: m[0],
        kind: "number",
        reason: `Forbidden vague attribution phrase: "${m[0]}"`,
      });
    }
  }

  const extracted = extractClaims(content);
  const allowedSet = new Set(bundle.allowedClaims.map((c) => c.toLowerCase()));
  const sourceCorpus = bundle.contextForLLM;

  for (const claim of extracted) {
    // Years that are obviously the current/prior year and are referenced in the bundle pass.
    if (claim.kind === "year") {
      const corpusNorm = sourceCorpus.toLowerCase();
      if (!corpusNorm.includes(claim.text)) {
        failures.push({
          claim: claim.text,
          kind: claim.kind,
          reason: `Year "${claim.text}" not present in source bundle`,
        });
      } else {
        matched.push(claim.text);
      }
      continue;
    }

    if (isClaimAllowed(claim, allowedSet, sourceCorpus)) {
      matched.push(claim.text);
    } else {
      failures.push({
        claim: claim.text,
        kind: claim.kind,
        reason: `Claim "${claim.text}" (${claim.kind}) not found verbatim in source bundle`,
      });
    }
  }

  // Agency name attributions: if post says "FBI reports X" but the bundle never mentions FBI,
  // that's a fabricated attribution.
  for (const agency of EXTRA_AGENCY_NAMES) {
    const re = new RegExp(`\\b${agency}\\b`, "i");
    if (re.test(content) && !re.test(bundle.contextForLLM) && !re.test(bundle.canonicalUrl)) {
      failures.push({
        claim: agency.toUpperCase(),
        kind: "number",
        reason: `Post attributes claim to ${agency.toUpperCase()} but agency is not cited in source bundle`,
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
