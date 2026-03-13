import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";
import type { AiPrompt } from "@shared/schema";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

interface PromptImprovement {
  proposedTitle?: string;
  proposedPromptText?: string;
  proposedTags?: string[];
  proposedUseCase?: string;
  proposedSafetyNote?: string;
  rationale: string;
  qualityScore: number;
}

interface NewPromptSuggestion {
  title: string;
  promptText: string;
  audience: string[];
  category: string;
  tags: string[];
  useCase: string;
  safetyNote?: string;
  iconName: string;
  rationale: string;
}

async function reviewSinglePrompt(prompt: AiPrompt): Promise<PromptImprovement | null> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are an expert prompt engineer reviewing prompts for a cybersecurity education platform called GetCyberRight. The platform helps families, seniors, students, and small businesses stay safe online.

Review the following prompt and provide improvement suggestions. Rate its current quality on a scale of 1-100.

Title: ${prompt.title}
Category: ${prompt.category}
Audience: ${prompt.audience?.join(", ")}
Use Case: ${prompt.useCase}
Safety Note: ${prompt.safetyNote || "None"}
Tags: ${prompt.tags?.join(", ")}

Prompt Text:
${prompt.promptText}

Evaluate the prompt on these criteria:
1. Clarity and specificity of instructions (is it clear what the AI should do?)
2. Use of structured formatting (numbered steps, clear sections)
3. Input placeholders (are they descriptive enough?)
4. Output format specification (does it tell the AI how to format the response?)
5. Safety guardrails (does it prevent harmful outputs?)
6. Audience appropriateness (is the language right for the target audience?)
7. Actionability (will the output be immediately useful?)

If the prompt scores 85 or above and needs no significant changes, respond with exactly:
{"noChangesNeeded": true, "qualityScore": <score>}

Otherwise, respond with a JSON object:
{
  "qualityScore": <1-100>,
  "proposedTitle": "<improved title or null if fine>",
  "proposedPromptText": "<improved prompt text or null if fine>",
  "proposedTags": ["<improved tags>"] or null,
  "proposedUseCase": "<improved use case description or null if fine>",
  "proposedSafetyNote": "<improved safety note or null if fine>",
  "rationale": "<2-3 sentences explaining what you improved and why>"
}

Only suggest changes that meaningfully improve the prompt. Do not change things just to change them. Respond with valid JSON only, no markdown.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const cleaned = text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
    const parsed = JSON.parse(cleaned);

    if (parsed.noChangesNeeded) {
      return null;
    }

    return {
      proposedTitle: parsed.proposedTitle || undefined,
      proposedPromptText: parsed.proposedPromptText || undefined,
      proposedTags: parsed.proposedTags || undefined,
      proposedUseCase: parsed.proposedUseCase || undefined,
      proposedSafetyNote: parsed.proposedSafetyNote || undefined,
      rationale: parsed.rationale || "AI-suggested improvement.",
      qualityScore: parsed.qualityScore || 0,
    };
  } catch (error) {
    console.error(`Failed to review prompt "${prompt.title}":`, error);
    return null;
  }
}

async function generateNewPromptSuggestions(existingPrompts: AiPrompt[]): Promise<NewPromptSuggestion[]> {
  try {
    const existingTitles = existingPrompts.map(p => p.title).join("\n- ");
    const existingCategories = Array.from(new Set(existingPrompts.map(p => p.category))).join(", ");

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are an expert prompt engineer for GetCyberRight, a free cybersecurity education platform for families, seniors, students, and small businesses.

Here are the existing prompts:
- ${existingTitles}

Existing categories: ${existingCategories}
Valid audiences: everyday, families, seniors, students, business
Valid icon names: Shield, Lock, AlertTriangle, Brain, Search, Mail, FileText, DollarSign, Stethoscope, MessageSquare, Wrench, Target, Lightbulb, BookOpen, Clock, Home, Users, Heart, GraduationCap, Briefcase, ShoppingCart, Scale, Zap, Sparkles

Suggest 2-3 NEW prompts that fill gaps in the current library. Focus on:
1. Emerging cybersecurity threats (AI scams, QR code phishing, social engineering).
2. Practical digital life skills not yet covered.
3. Underserved audiences or categories.

For each new prompt, provide a JSON object in an array:
[
  {
    "title": "<clear, action-oriented title>",
    "promptText": "<full prompt with numbered instructions, placeholders in [BRACKETS], and output format>",
    "audience": ["<valid audiences>"],
    "category": "<valid category>",
    "tags": ["<3-5 relevant tags>"],
    "useCase": "<when someone would use this>",
    "safetyNote": "<optional safety warning or null>",
    "iconName": "<lucide icon name from the valid list>",
    "rationale": "<why this prompt is needed>"
  }
]

Respond with valid JSON array only, no markdown.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const cleaned = text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to generate new prompt suggestions:", error);
    return [];
  }
}

export async function runPromptReview(triggerType: string = "scheduled"): Promise<{ runId: string; improvements: number; newSuggestions: number }> {
  const run = await storage.createPromptReviewRun(triggerType);
  let improvements = 0;
  let newSuggestions = 0;

  try {
    const prompts = await storage.getActivePrompts();

    const batchSize = 5;
    for (let i = 0; i < prompts.length; i += batchSize) {
      const batch = prompts.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(p => reviewSinglePrompt(p)));

      for (let j = 0; j < batch.length; j++) {
        const improvement = results[j];
        if (improvement) {
          await storage.createPromptReview({
            promptId: batch[j].id,
            reviewType: "improvement",
            proposedTitle: improvement.proposedTitle || null,
            proposedPromptText: improvement.proposedPromptText || null,
            proposedTags: improvement.proposedTags || null,
            proposedUseCase: improvement.proposedUseCase || null,
            proposedSafetyNote: improvement.proposedSafetyNote || null,
            proposedAudience: null,
            proposedCategory: null,
            proposedIconName: null,
            rationale: improvement.rationale,
            qualityScore: improvement.qualityScore,
            aiModel: "claude-sonnet-4-5",
            status: "pending",
            reviewRunId: run.id,
            reviewedBy: null,
            reviewedAt: null,
          });
          improvements++;
        }
      }
    }

    const newPrompts = await generateNewPromptSuggestions(prompts);
    for (const suggestion of newPrompts) {
      await storage.createPromptReview({
        promptId: null,
        reviewType: "new_prompt",
        proposedTitle: suggestion.title,
        proposedPromptText: suggestion.promptText,
        proposedTags: suggestion.tags,
        proposedUseCase: suggestion.useCase,
        proposedSafetyNote: suggestion.safetyNote || null,
        proposedAudience: suggestion.audience,
        proposedCategory: suggestion.category,
        proposedIconName: suggestion.iconName,
        rationale: suggestion.rationale,
        qualityScore: null,
        aiModel: "claude-sonnet-4-5",
        status: "pending",
        reviewRunId: run.id,
        reviewedBy: null,
        reviewedAt: null,
      });
      newSuggestions++;
    }

    await storage.updatePromptReviewRun(run.id, {
      status: "completed",
      promptsReviewed: prompts.length,
      improvementsSuggested: improvements,
      newPromptsSuggested: newSuggestions,
      summary: `Reviewed ${prompts.length} prompts. Suggested ${improvements} improvements and ${newSuggestions} new prompts.`,
      completedAt: new Date(),
    });

    console.log(`Prompt review complete: ${improvements} improvements, ${newSuggestions} new suggestions.`);
    return { runId: run.id, improvements, newSuggestions };
  } catch (error: any) {
    await storage.updatePromptReviewRun(run.id, {
      status: "failed",
      errorMessage: error.message || "Unknown error",
      completedAt: new Date(),
    });
    console.error("Prompt review run failed:", error);
    throw error;
  }
}

let schedulerInterval: NodeJS.Timeout | null = null;

export function startPromptReviewScheduler(intervalHours: number = 168): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
  }

  const intervalMs = intervalHours * 60 * 60 * 1000;

  console.log(`Prompt review scheduler started. Will run every ${intervalHours} hours (${intervalHours / 24} days).`);

  schedulerInterval = setInterval(async () => {
    console.log("Starting scheduled prompt review...");
    try {
      await runPromptReview("scheduled");
    } catch (error) {
      console.error("Scheduled prompt review failed:", error);
    }
  }, intervalMs);
}

export function stopPromptReviewScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log("Prompt review scheduler stopped.");
  }
}
