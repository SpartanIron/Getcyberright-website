import Anthropic from "@anthropic-ai/sdk";
import { db } from "../server/db";
import { newsArticles } from "../shared/schema";
import { eq, or, isNull, sql } from "drizzle-orm";

const client = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

async function genTakeaways(article: { title: string; excerpt: string; content: string | null }): Promise<string[]> {
  const resp = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 600,
    messages: [{
      role: "user",
      content: `You are writing for GetCyberRight, a cybersecurity site for everyday families. Read this article and produce 3 to 5 short "Key Takeaways" bullet points that summarize the most important things the reader should know.

Rules:
- Each bullet must be a single concise sentence (under 20 words).
- Plain, conversational language. No jargon. No em dashes.
- Action-oriented when possible.
- Output ONLY a JSON array of strings, nothing else. No prose, no markdown.

Title: ${article.title}
Excerpt: ${article.excerpt}
Content: ${(article.content || "").slice(0, 4000)}`,
    }],
  });
  const text = resp.content.find(b => b.type === "text")?.text || "";
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("no JSON array");
  const arr = JSON.parse(match[0]);
  return arr.filter((s: any) => typeof s === "string" && s.length > 5 && s.length < 250).slice(0, 5);
}

async function main() {
  const rows = await db.select({
    id: newsArticles.id,
    title: newsArticles.title,
    excerpt: newsArticles.excerpt,
    content: newsArticles.content,
    keyTakeaways: newsArticles.keyTakeaways,
  }).from(newsArticles).where(or(isNull(newsArticles.keyTakeaways), sql`cardinality(${newsArticles.keyTakeaways}) = 0`));

  console.log(`[backfill] ${rows.length} articles need takeaways`);

  let success = 0, fail = 0;
  const concurrency = 8;
  for (let i = 0; i < rows.length; i += concurrency) {
    const batch = rows.slice(i, i + concurrency);
    const settled = await Promise.allSettled(batch.map(async (r) => {
      const takeaways = await genTakeaways(r);
      await db.update(newsArticles).set({ keyTakeaways: takeaways }).where(eq(newsArticles.id, r.id));
      return r.id;
    }));
    for (const s of settled) {
      if (s.status === "fulfilled") success++;
      else { fail++; console.error("[backfill] fail:", s.reason?.message || s.reason); }
    }
    console.log(`[backfill] processed ${Math.min(i + concurrency, rows.length)}/${rows.length} (success=${success} fail=${fail})`);
  }
  console.log(`[backfill] done. success=${success} fail=${fail}`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
