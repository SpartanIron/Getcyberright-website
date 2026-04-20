import Anthropic from "@anthropic-ai/sdk";
import { ACTION_LINK_ALLOWLIST, SPINE_LIMITS } from "./editorialSpine";
import { CURATED_TOPIC_LABELS, gateCuratedPlainEnglish } from "./newsCurationGuard";
import type { NewsArticle } from "@shared/schema";

export interface ProposedSpine {
  whatChanged: string | null;
  whyThisMatters: string[] | null;
  actionThisWeek: { label: string; href: string } | null;
  curatedTopic: string | null;
  flags: string[];
  needsAuthorInput: boolean;
  generatedAt: string;
}

const stripDashes = (s: string): string =>
  s
    .replace(/\s*[\u2014\u2013]\s*/g, ". ")
    .replace(/\s*--\s*/g, ". ")
    .replace(/\.\.\s/g, ". ")
    .trim();

function buildPrompt(article: NewsArticle, fields: string[]): string {
  const allowlistList = ACTION_LINK_ALLOWLIST.map((r) => `  - ${r}`).join("\n");
  const topicList = Object.entries(CURATED_TOPIC_LABELS)
    .map(([k, v]) => `  - "${k}" (${v})`)
    .join("\n");

  return `You are an editor for GetCyberRight, a family-focused cybersecurity site by Jude Annan, CISM. You are filling the "editorial spine" for an existing curated article. You DO NOT rewrite the article. You write three short framing fields plus a topic tag.

Source article:
TITLE: ${article.title}
CATEGORY: ${article.category}
SOURCE: ${article.source}
EXCERPT: ${article.excerpt}
BODY:
${(article.content || "").slice(0, 4000)}

Output a single JSON object with these fields (only include the ones requested below; null any you cannot honestly write from the article alone):
- "whatChanged": one plain-English sentence, MAX ${SPINE_LIMITS.whatChangedMax} characters, describing what is new or what readers should now know. No marketing fluff. No fabrication.
- "whyThisMatters": array of EXACTLY ${SPINE_LIMITS.whyCount} short bullets, each MAX ${SPINE_LIMITS.whyEachMax} characters, each tied to a real family situation (parents, kids, seniors, or household accounts).
- "actionThisWeek": object { "label": string MAX ${SPINE_LIMITS.actionLabelMax} chars, "href": string }. The href MUST be one of these exact internal routes:
${allowlistList}
  Pick the route most useful for the reader given the article. Do not invent routes.
- "curatedTopic": one of:
${topicList}
  Choose the best fit ONLY if the article clearly belongs to that topic. If you are not confident, return null. Do not guess.
- "topicConfidence": "high" | "low". Set "low" if you would not stake a reviewer's time on the topic choice; in that case curatedTopic must be null.

Requested fields this call: ${fields.join(", ")}.

WRITING RULES (strict):
- NEVER use em dashes, en dashes, or double hyphens. Use periods, commas, semicolons, or colons instead.
- NEVER fabricate statistics, dollar amounts, dates, names, or quotes. If the article does not state it, do not write it.
- If a needed fact is missing, set the relevant field to null. Do not invent.
- Avoid security jargon (zero-day, threat actor, APT, RCE, CVE, lateral movement, payload, exfiltrate, SOC, SIEM, IoC, C2). If you must use one, define it in plain English in parentheses on first use, e.g. "RCE (remote takeover of a device)".
- Plain, calm, direct. No filler like "studies show" or "experts say".

Output ONLY the JSON object. No markdown, no commentary.`;
}

interface RawProposal {
  whatChanged?: string | null;
  whyThisMatters?: string[] | null;
  actionThisWeek?: { label?: string; href?: string } | null;
  curatedTopic?: string | null;
  topicConfidence?: "high" | "low";
}

function pickClosestAllowlistedRoute(article: NewsArticle, badHref: string): string {
  const text = `${article.title} ${article.excerpt} ${article.category}`.toLowerCase();
  const scored = ACTION_LINK_ALLOWLIST.map((route) => {
    const tokens = route.replace(/^\//, "").split(/[\/-]/).filter(Boolean);
    let score = 0;
    for (const t of tokens) if (text.includes(t)) score += 1;
    return { route, score };
  }).sort((a, b) => b.score - a.score);
  return scored[0] && scored[0].score > 0 ? scored[0].route : "/news";
}

/**
 * Generate an editorial spine proposal for a curated article. Pure function:
 * makes the AI call, validates, sanitises, runs the plain-English gate, and
 * returns a typed proposal. Persistence is the caller's responsibility.
 */
export async function generateSpineProposal(
  article: NewsArticle,
  fields: string[] = ["whatChanged", "whyThisMatters", "actionThisWeek", "curatedTopic"],
): Promise<ProposedSpine> {
  const client = new Anthropic({
    apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1200,
    messages: [{ role: "user", content: buildPrompt(article, fields) }],
  });

  const block = response.content[0];
  const text = block && block.type === "text" ? block.text : "";
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  let raw: RawProposal;
  try {
    raw = JSON.parse(cleaned) as RawProposal;
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  const proposal: ProposedSpine = {
    whatChanged: null,
    whyThisMatters: null,
    actionThisWeek: null,
    curatedTopic: null,
    flags: [],
    needsAuthorInput: false,
    generatedAt: new Date().toISOString(),
  };

  if (typeof raw.whatChanged === "string" && raw.whatChanged.trim()) {
    proposal.whatChanged = stripDashes(raw.whatChanged).slice(0, SPINE_LIMITS.whatChangedMax);
  } else if (raw.whatChanged === null) {
    proposal.needsAuthorInput = true;
    proposal.flags.push("whatChanged: model declined (needs author input)");
  }

  if (Array.isArray(raw.whyThisMatters)) {
    const cleanedBullets = raw.whyThisMatters
      .filter((b): b is string => typeof b === "string" && b.trim().length >= 2)
      .map((b) => stripDashes(b).slice(0, SPINE_LIMITS.whyEachMax))
      .slice(0, SPINE_LIMITS.whyCount);
    if (cleanedBullets.length > 0) proposal.whyThisMatters = cleanedBullets;
  } else if (raw.whyThisMatters === null) {
    proposal.needsAuthorInput = true;
    proposal.flags.push("whyThisMatters: model declined (needs author input)");
  }

  if (raw.actionThisWeek && typeof raw.actionThisWeek === "object") {
    const rawLabel = typeof raw.actionThisWeek.label === "string" ? raw.actionThisWeek.label : "";
    const rawHref = typeof raw.actionThisWeek.href === "string" ? raw.actionThisWeek.href : "";
    const label = stripDashes(rawLabel).slice(0, SPINE_LIMITS.actionLabelMax);
    let href = rawHref.trim();
    if (!ACTION_LINK_ALLOWLIST.includes(href)) {
      const replacement = pickClosestAllowlistedRoute(article, href);
      proposal.flags.push(
        `actionThisWeek.href "${href}" was off-allowlist; replaced with "${replacement}". Please confirm.`,
      );
      href = replacement;
    }
    if (label && href) proposal.actionThisWeek = { label, href };
  } else if (raw.actionThisWeek === null) {
    proposal.needsAuthorInput = true;
    proposal.flags.push("actionThisWeek: model declined (needs author input)");
  }

  const lowConfidence = raw.topicConfidence === "low";
  if (
    !lowConfidence &&
    typeof raw.curatedTopic === "string" &&
    raw.curatedTopic in CURATED_TOPIC_LABELS
  ) {
    proposal.curatedTopic = raw.curatedTopic;
  } else {
    proposal.curatedTopic = null;
    proposal.needsAuthorInput = true;
    proposal.flags.push(
      "curatedTopic: low confidence; reviewer must select the topic manually.",
    );
  }

  // Per-field plain-English gate. Any field that fails is nulled out.
  const gateField = (label: string, value: string): string | null => {
    const g = gateCuratedPlainEnglish("", "", value);
    return g.ok ? null : `${label}: jargon detected (${g.blockedTerms.join(", ")}). Define in plain English on first use.`;
  };
  if (proposal.whatChanged) {
    const f = gateField("whatChanged", proposal.whatChanged);
    if (f) {
      proposal.whatChanged = null;
      proposal.needsAuthorInput = true;
      proposal.flags.push(f);
    }
  }
  if (proposal.whyThisMatters) {
    const f = gateField("whyThisMatters", proposal.whyThisMatters.join("\n"));
    if (f) {
      proposal.whyThisMatters = null;
      proposal.needsAuthorInput = true;
      proposal.flags.push(f);
    }
  }
  if (proposal.actionThisWeek) {
    const f = gateField("actionThisWeek.label", proposal.actionThisWeek.label);
    if (f) {
      proposal.actionThisWeek = null;
      proposal.needsAuthorInput = true;
      proposal.flags.push(f);
    }
  }

  return proposal;
}
