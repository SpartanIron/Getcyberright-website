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
  const cleaned = text.replace(/https?:\/\/[^\s)]+/g, (url) => {
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
