export type PostDepth = "wire" | "insight" | "deep_value";

export interface PlatformPolicy {
  wordLimit: number;
  maxConsecutiveLineBreaks: number;
  maxParagraphs: number;
  sentencesPerParagraph: number;
}

export const PLATFORM_POLICIES: Record<string, PlatformPolicy> = {
  linkedin: {
    wordLimit: 50,
    maxConsecutiveLineBreaks: 3,
    maxParagraphs: 4,
    sentencesPerParagraph: 2,
  },
  facebook: {
    wordLimit: 45,
    maxConsecutiveLineBreaks: 3,
    maxParagraphs: 3,
    sentencesPerParagraph: 2,
  },
  instagram: {
    wordLimit: 60,
    maxConsecutiveLineBreaks: 3,
    maxParagraphs: 4,
    sentencesPerParagraph: 2,
  },
  // X (Twitter) is character-bound, not word-bound. The wordLimit is set high so
  // the word-trim step never fires; the real 280-char cap is applied by
  // enforceTweetLimit() at publish time.
  x: {
    wordLimit: 280,
    maxConsecutiveLineBreaks: 2,
    maxParagraphs: 4,
    sentencesPerParagraph: 2,
  },
};

const DEPTH_OVERRIDES: Record<PostDepth, Record<string, Partial<PlatformPolicy>>> = {
  wire: {},
  insight: {
    linkedin: { wordLimit: 120, maxParagraphs: 6, sentencesPerParagraph: 3 },
    facebook: { wordLimit: 100, maxParagraphs: 5, sentencesPerParagraph: 3 },
    instagram: { wordLimit: 120, maxParagraphs: 6, sentencesPerParagraph: 3 },
  },
  deep_value: {
    linkedin: { wordLimit: 150, maxParagraphs: 8, sentencesPerParagraph: 3 },
    facebook: { wordLimit: 130, maxParagraphs: 7, sentencesPerParagraph: 3 },
    instagram: { wordLimit: 150, maxParagraphs: 8, sentencesPerParagraph: 3 },
  },
};

function getPolicyForDepth(platform: string, depth: PostDepth = "wire"): PlatformPolicy {
  const base = PLATFORM_POLICIES[platform];
  if (!base) return { wordLimit: 60, maxConsecutiveLineBreaks: 3, maxParagraphs: 4, sentencesPerParagraph: 2 };
  if (depth === "wire") return base;
  const overrides = DEPTH_OVERRIDES[depth]?.[platform] || {};
  return { ...base, ...overrides };
}

export interface PolicyViolation {
  rule: string;
  before: number;
  after: number;
}

export interface PolicyResult {
  content: string;
  violations: PolicyViolation[];
  corrected: boolean;
}

function countWords(text: string, excludeUrls: boolean = true): number {
  const words = text.split(/\s+/).filter(w => w.trim());
  if (!excludeUrls) return words.length;
  return words.filter(w => !w.match(/^https?:\/\//)).length;
}

function preserveUrls(text: string): { cleaned: string; urls: string[] } {
  const urls: string[] = [];
  // Preserve full URLs AND bare-domain URLs like getcyberright.com/guides/foo
  // so the sentence-case rule in sanitizeContent can't corrupt them into
  // "Getcyberright. Com/guides/foo".
  const URL_PATTERN = /(?:https?:\/\/[^\s)]+|(?:www\.)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s)]*)?)/gi;
  const cleaned = text.replace(URL_PATTERN, (url) => {
    urls.push(url);
    return `__POLICYURL_${urls.length - 1}__`;
  });
  return { cleaned, urls };
}

function restoreUrls(text: string, urls: string[]): string {
  let result = text;
  urls.forEach((url, i) => {
    result = result.replace(`__POLICYURL_${i}__`, url);
  });
  return result;
}

export function sanitizeContent(text: string): string {
  const { cleaned, urls } = preserveUrls(text);

  let processed = cleaned
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\s*[\u2014\u2015\u2E3A\u2E3B]\s*/g, ". ")
    .replace(/\s*\u2013\s*/g, " to ")
    .replace(/\s*-{2,}\s*/g, ". ")
    .replace(/\.\s*\./g, ".")
    .replace(/,\s*\./g, ".")
    .replace(/\.\s*,/g, ".")
    .replace(/\s+([.!?,;:])/g, "$1")
    .replace(/([.!?])\s*([a-z])/g, (_, p, c) => `${p} ${c.toUpperCase()}`)
    .replace(/[^\S\n]{2,}/g, " ")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

  return restoreUrls(processed, urls);
}

function enforceLineBreaks(text: string, maxConsecutive: number): { text: string; violation: PolicyViolation | null } {
  const regex = new RegExp(`\\n{${maxConsecutive + 1},}`, "g");
  const hasViolation = regex.test(text);
  if (!hasViolation) return { text, violation: null };

  const replacement = "\n".repeat(maxConsecutive);
  const fixed = text.replace(new RegExp(`\\n{${maxConsecutive + 1},}`, "g"), replacement);

  return {
    text: fixed,
    violation: { rule: "maxConsecutiveLineBreaks", before: maxConsecutive + 1, after: maxConsecutive },
  };
}

function enforceParagraphStructure(text: string, policy: PlatformPolicy): { text: string; violation: PolicyViolation | null } {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());

  if (paragraphs.length > policy.maxParagraphs) {
    const trimmed = paragraphs.slice(0, policy.maxParagraphs);
    return {
      text: trimmed.join("\n\n"),
      violation: { rule: "maxParagraphs", before: paragraphs.length, after: trimmed.length },
    };
  }

  if (paragraphs.length === 1) {
    const sentences = text.replace(/\n/g, " ").split(/(?<=[.!?])\s+/).filter(s => s.trim());
    if (sentences.length < 3) return { text, violation: null };

    const reformatted: string[] = [];
    const chunkSize = policy.sentencesPerParagraph;
    reformatted.push(sentences.slice(0, 2).join(" "));
    for (let i = 2; i < sentences.length; i += chunkSize) {
      reformatted.push(sentences.slice(i, i + chunkSize).join(" "));
    }

    if (reformatted.length > policy.maxParagraphs) {
      reformatted.length = policy.maxParagraphs;
    }

    return {
      text: reformatted.join("\n\n"),
      violation: { rule: "wallOfText", before: 1, after: reformatted.length },
    };
  }

  return { text, violation: null };
}

function enforceWordLimit(text: string, policy: PlatformPolicy): { text: string; violation: PolicyViolation | null } {
  const { cleaned, urls } = preserveUrls(text);
  const words = cleaned.split(/\s+/).filter(w => w.trim());
  const wordCount = words.filter(w => !w.startsWith("__POLICYURL_")).length;

  if (wordCount <= policy.wordLimit) return { text, violation: null };

  const paragraphs = cleaned.split(/\n\n+/);
  const kept: string[] = [];
  let count = 0;
  for (const para of paragraphs) {
    const paraWords = para.split(/\s+/).filter(w => w.trim() && !w.startsWith("__POLICYURL_")).length;
    if (count + paraWords > policy.wordLimit && kept.length >= 1) break;
    kept.push(para);
    count += paraWords;
  }

  let result = kept.join("\n\n");

  const resultWordCount = result.split(/\s+/).filter(w => w.trim() && !w.startsWith("__POLICYURL_")).length;
  if (resultWordCount > policy.wordLimit) {
    const allWords = result.split(/\s+/).filter(w => w.trim());
    let c = 0;
    const finalWords: string[] = [];
    for (const w of allWords) {
      if (w.startsWith("__POLICYURL_")) { finalWords.push(w); continue; }
      if (c >= policy.wordLimit) break;
      finalWords.push(w);
      c++;
    }
    result = finalWords.join(" ");
  }

  result = restoreUrls(result, urls);
  if (!result.includes("http") && urls.length > 0) {
    result += "\n\n" + urls[urls.length - 1];
  }

  const finalCount = countWords(result);
  return {
    text: result,
    violation: { rule: "wordLimit", before: wordCount, after: finalCount },
  };
}

const BANNED_PHRASES = [
  "game-changer", "wake-up call", "in today's digital landscape", "cyber hygiene",
  "let that sink in", "read that again", "hot take:", "unpopular opinion:",
  "just a reminder that", "friendly reminder", "PSA:", "this is huge",
  "this is big", "here's the thing", "here's why this matters",
  "think about that for a second", "but here's the kicker", "the bottom line",
  "at the end of the day", "needless to say", "it goes without saying",
  "food for thought", "mic drop", "threat landscape", "threat actors",
  "it is imperative", "this underscores", "it's crucial",
  "as cybersecurity professionals", "I'm excited to share",
];

function removeBannedPhrases(text: string): { text: string; removed: string[] } {
  let result = text.replace(/[\u2018\u2019\u201A\u201B]/g, "'").replace(/[\u201C\u201D\u201E\u201F]/g, '"');
  const removed: string[] = [];
  for (const phrase of BANNED_PHRASES) {
    const escapedPhrase = phrase.replace(/'/g, "['\u2019]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedPhrase, "gi");
    if (regex.test(result)) {
      removed.push(phrase);
      result = result.replace(regex, "").replace(/\s{2,}/g, " ").trim();
    }
  }
  return { text: result, removed };
}

export function enforcePostPolicy(text: string, platform: string, depth: PostDepth = "wire"): PolicyResult {
  const policy = getPolicyForDepth(platform, depth);

  const sanitized = sanitizeContent(text);
  const originalWordCount = countWords(sanitized);

  const violations: PolicyViolation[] = [];
  let content = sanitized;

  const bannedResult = removeBannedPhrases(content);
  content = bannedResult.text;
  if (bannedResult.removed.length > 0) {
    violations.push({ rule: "bannedPhrases", before: bannedResult.removed.length, after: 0 });
    console.log(`[SocialPostPolicy] ${platform}/${depth}: removed banned phrases: ${bannedResult.removed.join(", ")}`);
  }

  const lineBreakResult = enforceLineBreaks(content, policy.maxConsecutiveLineBreaks);
  content = lineBreakResult.text;
  if (lineBreakResult.violation) violations.push(lineBreakResult.violation);

  const paragraphResult = enforceParagraphStructure(content, policy);
  content = paragraphResult.text;
  if (paragraphResult.violation) violations.push(paragraphResult.violation);

  const wordResult = enforceWordLimit(content, policy);
  content = wordResult.text;
  if (wordResult.violation) violations.push(wordResult.violation);

  if (violations.length > 0) {
    const correctedWordCount = countWords(content);
    const violatedRules = violations.map(v => v.rule);
    console.log(
      `[SocialPostPolicy] ${platform}/${depth} post corrected | ` +
      `originalWords=${originalWordCount} | correctedWords=${correctedWordCount} | ` +
      `limit=${policy.wordLimit} | violatedRules=[${violatedRules.join(", ")}] | ` +
      `details: ${violations.map(v => `${v.rule}(${v.before}->${v.after})`).join(", ")}`
    );
  }

  return { content, violations, corrected: violations.length > 0 };
}

export function enforceAndSanitize(text: string, platform: string, depth: PostDepth = "wire"): string {
  const result = enforcePostPolicy(text, platform, depth);
  return result.content;
}

const PLACEHOLDER_PATTERNS: RegExp[] = [
  /\[link\]/i,
  /\[LINK\]/,
  /\[url\]/i,
  /\{link\}/i,
  /\{url\}/i,
  /<link>/i,
  /<url>/i,
  /\(link\)/i,
  /\bINSERT[_ ]LINK\b/i,
  /\bTODO\b/,
  /\bplaceholder\b/i,
];

const GCR_HOST_RE = /(^|\/\/)(www\.)?getcyberright\.com(\/|$)/i;

export function extractAllUrls(text: string): string[] {
  const found: string[] = [];
  // Full URLs first
  const fullRe = /https?:\/\/[^\s)\]"',]+/gi;
  let m: RegExpExecArray | null;
  while ((m = fullRe.exec(text)) !== null) {
    found.push(m[0].replace(/[.,;:!?)]+$/, ""));
  }
  // Bare-domain URLs (must look like real domains, must contain at least one dot)
  const bareRe = /(?<![a-zA-Z0-9@\/])((?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s)\]"',]*)?)/gi;
  while ((m = bareRe.exec(text)) !== null) {
    const candidate = m[1];
    // Skip if it's actually a sentence end like "details." or "OK."
    if (!candidate.includes("/") && !/\.(com|org|net|io|co|gov|edu|app|dev|info|us|uk|ca|au)$/i.test(candidate)) {
      continue;
    }
    if (candidate.startsWith("http")) continue;
    found.push(candidate.replace(/[.,;:!?)]+$/, ""));
  }
  return Array.from(new Set(found));
}

function isGcrUrl(url: string): boolean {
  if (GCR_HOST_RE.test(url)) return true;
  const u = url.toLowerCase();
  return u.startsWith("getcyberright.com") || u.startsWith("www.getcyberright.com");
}

export interface ContentValidationIssue {
  code:
    | "placeholder_token"
    | "non_gcr_url"
    | "missing_canonical_link"
    | "wrong_canonical_path"
    | "too_short";
  message: string;
  detail?: string;
}

export interface ContentValidationResult {
  ok: boolean;
  issues: ContentValidationIssue[];
}

/**
 * Validates that a generated social post is publish-safe:
 * - no placeholder tokens like [link]
 * - no foreign URLs (only getcyberright.com is allowed)
 * - the canonical URL is present in the body
 * - the body has a minimum length (catches empty/blank generations)
 */
export function validatePostContent(
  text: string,
  canonicalUrl: string,
  opts: { minChars?: number; requireCanonical?: boolean } = {},
): ContentValidationResult {
  const minChars = opts.minChars ?? 40;
  const requireCanonical = opts.requireCanonical ?? true;
  const issues: ContentValidationIssue[] = [];

  if (!text || text.trim().length < minChars) {
    issues.push({
      code: "too_short",
      message: `Post is too short (${text?.trim().length || 0} chars, need at least ${minChars}).`,
    });
  }

  for (const pat of PLACEHOLDER_PATTERNS) {
    const m = text.match(pat);
    if (m) {
      issues.push({
        code: "placeholder_token",
        message: `Post contains an unresolved placeholder: "${m[0]}".`,
      });
      break;
    }
  }

  // External citation URLs are permitted only inside the deterministic citation
  // receipt section ("Sources:" or "Source:" trailer). We strip that section
  // before URL-allowlist enforcement so receipts can carry source links.
  const receiptStart = (() => {
    const m = text.match(/(^|\n)\s*Sources?:/);
    return m && typeof m.index === "number" ? m.index + (m[1] ? m[1].length : 0) : -1;
  })();
  const bodyForUrlCheck = receiptStart >= 0 ? text.slice(0, receiptStart) : text;
  const bodyUrls = extractAllUrls(bodyForUrlCheck);
  for (const url of bodyUrls) {
    if (!isGcrUrl(url)) {
      issues.push({
        code: "non_gcr_url",
        message: `Post contains a non-GetCyberRight URL outside the citation receipt: ${url}`,
        detail: url,
      });
    }
  }

  // Canonical-link presence is checked across the WHOLE post (body + receipt)
  // because the deterministic citation receipt is where the canonical GCR URL
  // is appended for receipt-style posts.
  const allUrls = extractAllUrls(text);

  if (requireCanonical && canonicalUrl) {
    let canonicalPath = "";
    try {
      canonicalPath = new URL(canonicalUrl).pathname.replace(/\/+$/, "");
    } catch {
      canonicalPath = "";
    }
    const seen = allUrls.some((u) => {
      try {
        const p = new URL(u.startsWith("http") ? u : `https://${u}`).pathname.replace(/\/+$/, "");
        return p === canonicalPath;
      } catch {
        return false;
      }
    });
    if (!seen) {
      issues.push({
        code: "missing_canonical_link",
        message: `Post is missing the canonical link (${canonicalUrl}).`,
      });
    }
  }

  return { ok: issues.length === 0, issues };
}

// ---------------------------------------------------------------------------
// Publish-time per-platform formatting
// ---------------------------------------------------------------------------
// These run at the publish chokepoint (server/bufferPublisher.ts) so they apply
// uniformly no matter which generation engine produced the post.

function tidyWhitespace(text: string): string {
  return text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+([.!?,;:])/g, "$1")
    .trim();
}

/**
 * Remove all #hashtags. LinkedIn / Facebook / X bodies read as spam with hashtag
 * stacks; native copy with zero hashtags earns more reach on those platforms.
 */
export function stripHashtags(text: string): string {
  return tidyWhitespace(text.replace(/(^|\s)#[A-Za-z0-9_]+/g, "$1"));
}

/**
 * Keep at most `max` hashtags (Instagram). Extra tags beyond the cap are dropped.
 */
export function limitHashtags(text: string, max: number): string {
  let count = 0;
  const out = text.replace(/#[A-Za-z0-9_]+/g, (tag) => {
    count += 1;
    return count <= max ? tag : "";
  });
  return tidyWhitespace(out);
}

/**
 * Instagram links are not tappable in the caption. Replace the verify URL with
 * bio phrasing and strip any remaining raw URLs so the caption stays clean.
 */
export function instagramizeLinks(text: string): string {
  let out = text.replace(/Verify:\s*\S+/gi, "Full sources linked in our bio.");
  out = out.replace(/https?:\/\/\S+/gi, "");
  out = out.replace(/\b(?:www\.)?getcyberright\.com\/\S*/gi, "");
  out = tidyWhitespace(out);
  if (!/\bbio\b/i.test(out)) {
    out += "\n\nMore at getcyberright.com";
  }
  return out;
}

/**
 * Hard 280-character cap for X. Preserves a single trailing verify/canonical URL
 * (X surfaces it as the citation) and drops the verbose "Source: ... Verify:"
 * receipt prose, which never fits a tweet. Truncates the body at a sentence or
 * word boundary so the tweet never reads as cut off mid-word.
 */
function truncateBodyToBudget(body: string, budget: number): string {
  if (budget <= 0) return "";
  if (body.length <= budget) return body;
  let cut = body.slice(0, budget);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (lastStop > budget * 0.5) {
    cut = cut.slice(0, lastStop + 1);
  } else {
    const ellipsisBudget = budget - 3;
    cut = cut.slice(0, Math.max(0, ellipsisBudget));
    const lastSpace = cut.lastIndexOf(" ");
    if (lastSpace > 0) cut = cut.slice(0, lastSpace);
    cut = cut.replace(/[.,;:!?\-]+$/, "") + (ellipsisBudget > 0 ? "..." : "");
  }
  return cut.trim();
}

export function enforceTweetLimit(text: string, limit = 280): string {
  if (text.length <= limit) return text;

  const urlMatches = text.match(/https?:\/\/\S+|(?:www\.)?getcyberright\.com\/[^\s]*/gi) || [];
  const tail = urlMatches.length ? urlMatches[urlMatches.length - 1].replace(/[.,;:!?)]+$/, "") : "";

  let body = text.replace(/\n+\s*Source:[\s\S]*$/i, "").trim();
  body = body
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\b(?:www\.)?getcyberright\.com\/[^\s]*/gi, "");
  body = tidyWhitespace(body);

  const tailPart = tail ? `\n\n${tail}` : "";
  let result: string;

  // Only keep the URL tail if it actually leaves room for some body text.
  // A URL so long it would blow the limit on its own is useless in a tweet, so
  // we drop it and use the full budget for the body instead.
  if (tail && tailPart.length < limit) {
    const truncated = truncateBodyToBudget(body, limit - tailPart.length);
    result = `${truncated}${tailPart}`.trim();
  } else {
    result = truncateBodyToBudget(body, limit);
  }

  // Absolute safety net: never return more than `limit` characters, no matter
  // what the URL/body lengths were.
  if (result.length > limit) {
    result = result.slice(0, limit).trim();
  }
  return result;
}

/**
 * Strip stale year stamps from a headline so cards/titles stay evergreen.
 * Only removes a trailing year that is OLDER than the current year (e.g.
 * "Latest Scams 2024" -> "Latest Scams"); the current year is left intact.
 */
export function evergreenTitle(title: string, currentYear = new Date().getFullYear()): string {
  if (!title) return title;
  return title
    .replace(/\s+(?:for|in)\s+(20[0-2]\d)\s*$/i, (mm, y) => (Number(y) < currentYear ? "" : mm))
    .replace(/\s*[:\-(]\s*(20[0-2]\d)\s*\)?\s*$/i, (mm, y) => (Number(y) < currentYear ? "" : mm))
    .replace(/\s+(20[0-2]\d)\s*$/i, (mm, y) => (Number(y) < currentYear ? "" : mm))
    .trim();
}

/**
 * Publish-time formatter applied at the Buffer chokepoint. Uses a permissive
 * depth so already-shaped insight/deep_value posts are NOT re-trimmed to the
 * wire word limit, then layers per-platform rules: hashtag policy, Instagram
 * link handling, and the X 280-char cap.
 */
export function formatForPublish(text: string, platform: string): string {
  let content = enforcePostPolicy(text, platform, "deep_value").content;

  if (platform === "linkedin" || platform === "facebook" || platform === "x") {
    content = stripHashtags(content);
  } else if (platform === "instagram") {
    content = limitHashtags(content, 10);
  }

  if (platform === "instagram") {
    content = instagramizeLinks(content);
  }

  if (platform === "x") {
    content = enforceTweetLimit(content, 280);
  }

  return content;
}
