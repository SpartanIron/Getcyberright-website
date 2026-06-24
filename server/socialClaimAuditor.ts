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
    "Stay","Keep","Visit","Read","Learn","Get","Cyber","Right","GetCyberRight","Source:","Verify",
    "Most","Many","Some","Every","Everyone","Everything","Someone","Anyone","Nobody","People",
    "Here","Here's","There","Then","Now","Today","Yesterday","Tomorrow","Yes","No","So","But","And",
    "Why","What","When","Where","How","Who","If","Plus","Also","Even","Still","Just","Both","Either",
    "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
    "January","February","March","April","May","June","July","August","September","October","November","December",
  ]);
  // Org-suffix signal: a 2-word Title-Case pair is only treated as a named org
  // when it carries an org suffix; otherwise generic pairs like "Perfect English"
  // or "Online Safety" are not company claims and must not be force-verified.
  const ORG_SUFFIX =
    /^(Inc|Corp|Corporation|Ltd|LLC|Group|Bank|Hospital|University|Holdings|Healthcare|Systems|Networks|Solutions|Technologies|Industries|Agency|Bureau|Department|Institute|Foundation|Labs|Telecom)$/;
  const properNounRe = /\b([A-Z][A-Za-z0-9.&'\-]+(?:\s+[A-Z][A-Za-z0-9.&'\-]+){1,3})\b/g;
  // Run per-sentence so a match can't span a sentence boundary (e.g. "...AI. Their...").
  for (const sentence of text.split(/(?<=[.!?])\s+|\n+/)) {
    let pm: RegExpExecArray | null;
    properNounRe.lastIndex = 0;
    while ((pm = properNounRe.exec(sentence)) !== null) {
      const tokens = pm[0].trim().split(/\s+/);
      // Strip leading/trailing stopword tokens: "Most Amazon" -> "Amazon".
      while (tokens.length > 0 && STOPWORDS.has(tokens[0])) tokens.shift();
      while (tokens.length > 0 && STOPWORDS.has(tokens[tokens.length - 1])) tokens.pop();
      if (tokens.length < 2) continue; // single tokens are not multi-word org claims
      // A bare 2-word Title-Case pair is only a company claim if it carries an
      // org suffix; otherwise skip (avoids "Perfect English", "Online Safety").
      if (tokens.length === 2 && !tokens.some((t) => ORG_SUFFIX.test(t))) continue;
      const phrase = tokens.join(" ");
      push(phrase, "company", sentence.trim().slice(0, 90));
    }
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

// ---------------------------------------------------------------------------
// Plain-prose hallucination layer
// ---------------------------------------------------------------------------
// The token-based extractors above only catch claims with a recognisable
// surface form: numbers, percentages, years, CVE ids, dates, named agencies /
// threat actors, multi-word capitalised orgs. They miss assertive prose
// fabrications like:
//   - "a leading hospital in Texas was breached last week"
//   - "scammers are now using deepfake voices of grandchildren"
//   - "the average grandparent loses three hours per scam call"
// None of those contain a numeric/proper-noun token, yet each asserts a
// specific factual claim that, if wrong, looks just as authoritative as a
// real one.
//
// We add a semantic-grounding gate: split the post into sentences, drop CTAs
// / imperatives / questions / link lines, then for each remaining declarative
// sentence verify that its content keywords have meaningful overlap with the
// source bundle's contextForLLM corpus. A sentence with too few of its
// content words supported by the corpus is treated as a fabricated claim.

const PROSE_STOPWORDS = new Set([
  "the","a","an","and","or","but","of","in","on","at","to","for","with","from",
  "by","as","is","are","was","were","be","been","being","this","that","these","those",
  "it","its","they","them","their","there","here","than","then","also","too",
  "into","onto","over","under","more","most","much","many","some","any","all","every","each",
  "your","you","yours","our","ours","we","us","my","me","his","her","hers","him","she","he",
  "what","when","where","why","how","who","whom","which","whose",
  "if","else","while","because","since","so","not","no","yes","just","only","very","quite",
  "can","could","may","might","will","would","should","shall","must","do","does","did",
  "have","has","had","being","get","got","gets","getting","make","makes","made","take","takes","took",
  "per","via","about","without","within","across","through","between","after","before","during",
  "such","other","another","one","two","three","four","five","six","seven","eight","nine","ten",
  "really","actually","still","now","new","old","big","small","good","bad","best","worst",
  "post","posts","read","more","link","bio","follow","share","like","tweet","tweets",
  "say","says","said","saying","tell","tells","told",
  "thing","things","stuff","kind","kinds","sort","sorts","way","ways","time","times","today","tomorrow","yesterday",
]);

const PROSE_CTA_OR_LINK_RE = [
  /https?:\/\//i,
  /\bread more\b/i,
  /\blearn more\b/i,
  /\blink in bio\b/i,
  /\bclick here\b/i,
  /\bwe broke this down\b/i,
  /\bfull (?:article|guide|breakdown|story)\b/i,
  /\bsource[s]?:/i,
  /^source:/i,
];

const PROSE_IMPERATIVE_STARTERS = new Set([
  "don't","do","never","always","avoid","use","check","verify","enable","install","update",
  "stop","start","remember","try","consider","watch","beware","stay","keep","make","take",
  "give","send","ask","share","report","set","turn","click","tap","open","close",
  "save","delete","add","remove","create","build","find","look","listen","let","let's",
  "follow","subscribe","join","visit","read","learn","see","go","talk","speak","call",
  "if","when","before","after","while","unless","whenever",
  "here","here's",
  "tip","tips","reminder","note","warning","alert",
]);

function splitSentences(text: string): string[] {
  // Strip URLs first so they don't end up as nonsense "sentences".
  const noUrls = text.replace(/https?:\/\/\S+/g, " ");
  return noUrls
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function isAssertiveProse(sentence: string): boolean {
  if (sentence.length < 25) return false;
  if (sentence.endsWith("?")) return false;
  for (const re of PROSE_CTA_OR_LINK_RE) if (re.test(sentence)) return false;
  const firstToken = sentence.toLowerCase().split(/\s+/)[0]?.replace(/[^a-z']/g, "");
  if (firstToken && PROSE_IMPERATIVE_STARTERS.has(firstToken)) return false;
  return true;
}

function proseKeywords(sentence: string): string[] {
  return sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !PROSE_STOPWORDS.has(w));
}

function checkProseGrounding(content: string, corpus: string): AuditFailure[] {
  const failures: AuditFailure[] = [];
  if (!corpus || corpus.length < 50) return failures;
  const corpusLower = corpus.toLowerCase();
  const corpusFlat = corpusLower.replace(/[^a-z0-9]+/g, "");

  // A sentence is only subject to grounding-failure when it makes a *specific,
  // checkable* assertion. Rhetorical hooks and opinion/framing ("Most security
  // advice focuses on prevention", "Scammers test new tactics in new markets")
  // carry no factual anchor and must pass freely. Specific fabricated facts
  // ("a hospital was breached last week", "deepfake voices of grandchildren")
  // always carry an anchor: a number, a time/recency word, a scam-event term,
  // or a mid-sentence proper noun.
  const TIME_ANCHORS = new Set([
    "now","today","tonight","yesterday","tomorrow","week","weeks","month","months",
    "hour","hours","minute","minutes","second","seconds","day","days","recently","currently","lately",
  ]);
  const EVENT_ANCHORS = [
    "breach","breached","hack","hacked","leak","leaked","stolen","steal","deepfake","ransomware",
    "phishing","malware","hijack","arrested","charged","fined","scammed","defrauded","wire transfer","data breach",
  ];
  const hasFactualAnchor = (sentence: string, keywords: string[]): boolean => {
    if (/\d/.test(sentence)) return true;
    const low = sentence.toLowerCase();
    for (const e of EVENT_ANCHORS) if (low.includes(e)) return true;
    for (const k of keywords) if (TIME_ANCHORS.has(k)) return true;
    const words = sentence.trim().split(/\s+/);
    for (let i = 1; i < words.length; i++) {
      const w = words[i].replace(/[^A-Za-z]/g, "");
      if (w.length > 2 && /^[A-Z][a-z]+/.test(w)) return true; // mid-sentence proper noun
    }
    return false;
  };

  const seen = new Set<string>();
  for (const sentence of splitSentences(content)) {
    if (!isAssertiveProse(sentence)) continue;
    const keywords = Array.from(new Set(proseKeywords(sentence)));
    if (keywords.length < 6) continue;
    if (!hasFactualAnchor(sentence, keywords)) continue;

    let supported = 0;
    for (const k of keywords) {
      // 4-char prefix stem catches morphological variants
      // (scammers↔scam, victims↔victim, averaged↔average).
      const stem = k.length >= 5 ? k.slice(0, 4) : k;
      if (stem.length >= 4 && corpusLower.includes(stem)) { supported++; continue; }
      // For numeric tokens, check the punctuation-stripped corpus too so
      // "2,400" in source supports a bare "2400" token in post.
      if (/\d/.test(k) && corpusFlat.includes(k)) { supported++; continue; }
    }
    const ratio = supported / keywords.length;
    if (supported < 2 || ratio < 0.3) {
      const display = sentence.length > 140 ? sentence.slice(0, 137) + "..." : sentence;
      const key = display.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      failures.push({
        claim: display,
        kind: "phrase",
        reason: `Plain-prose claim lacks source support (${supported}/${keywords.length} content keywords found in source bundle): "${sentence.slice(0, 120)}"`,
      });
    }
  }
  return failures;
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
      // A year that appears in the underlying source corpus is, by definition,
      // supported (e.g. a guide titled "...Scams 2024"). This unblocks legitimate
      // year stamps in titles without weakening fabrication detection: a year not
      // present anywhere in the source still fails.
      const yearInCorpus = claim.kind === "year" && corpusContains(corpus, claim.text);
      if (isAllowedVerbatim(claim, allowedSet) || yearInCorpus) {
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

  // Plain-prose grounding gate. Runs after the token-based extractors so that
  // every persisted failure already carries a kind + claim snippet, and the
  // final verdict reflects every layer.
  for (const f of checkProseGrounding(content, bundle.contextForLLM)) {
    failures.push(f);
  }

  return {
    verdict: failures.length === 0 ? "pass" : "fail",
    extracted,
    failures,
    matchedClaims: matched,
  };
}

// Re-export normalize helper for callers wanting to test source coverage themselves.
export const _internals = { normalize, corpusContains, extractClaims, checkProseGrounding };

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
