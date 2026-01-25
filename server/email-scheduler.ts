import Anthropic from "@anthropic-ai/sdk";
import { db } from "./db";
import { scheduledEmails, newsletters } from "@shared/schema";
import { eq, and, lte, isNull } from "drizzle-orm";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

interface ValidationResult {
  score: number;
  isValid: boolean;
  notes: string;
  suggestions?: string[];
  grammarIssues?: string[];
}

export async function validateEmailContent(
  subject: string,
  htmlContent: string,
  audience: string
): Promise<ValidationResult> {
  try {
    const textContent = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a content validator for cybersecurity safety tips emails. Validate the following email content for:

1. **Factual Accuracy** (0-25 points): Are the cybersecurity tips factually correct and up-to-date?
2. **Relevance** (0-20 points): Is the content relevant to the target audience (${audience})?
3. **Grammar & Punctuation** (0-20 points): Are sentences well-structured with proper punctuation? Check for:
   - Complete sentences (not fragments)
   - Proper capitalization
   - Correct punctuation (periods, commas, apostrophes)
   - No run-on sentences
   - Professional writing style
4. **Clarity** (0-15 points): Is the language clear, simple, and actionable?
5. **Safety** (0-10 points): Does it avoid harmful advice or misleading information?
6. **Tone** (0-10 points): Is the tone warm, personable, and assurance-focused (not fear-mongering or cliché)?

Subject: ${subject}

Content:
${textContent.substring(0, 2000)}

Respond in this exact JSON format:
{
  "score": <total score 0-100>,
  "isValid": <true if score >= 70>,
  "notes": "<brief summary of validation>",
  "grammarIssues": ["<specific grammar/punctuation issue if any>"],
  "suggestions": ["<improvement suggestion 1>", "<improvement suggestion 2>"]
}

Only respond with valid JSON, no other text.`
        }
      ]
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        score: Math.min(100, Math.max(0, result.score)),
        isValid: result.isValid || result.score >= 70,
        notes: result.notes || 'Validation completed',
        suggestions: result.suggestions || [],
        grammarIssues: result.grammarIssues || []
      };
    }
    
    return {
      score: 50,
      isValid: false,
      notes: 'Unable to parse validation response',
      suggestions: ['Manual review required']
    };
  } catch (error) {
    console.error('[EmailScheduler] Validation error:', error);
    return {
      score: 0,
      isValid: false,
      notes: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      suggestions: ['Manual review required due to validation error']
    };
  }
}

export async function queueScheduledEmail(
  emailType: string,
  audience: string,
  subject: string,
  htmlContent: string,
  textContent: string,
  scheduledFor: Date,
  region?: string,
  country?: string
): Promise<number> {
  const [email] = await db.insert(scheduledEmails).values({
    emailType,
    audience,
    subject,
    htmlContent,
    textContent,
    scheduledFor,
    status: 'pending_validation',
    region,
    country
  }).returning();
  
  return email.id;
}

export async function validatePendingEmails(): Promise<{ validated: number; approved: number }> {
  const pending = await db.select().from(scheduledEmails)
    .where(eq(scheduledEmails.status, 'pending_validation'));
  
  let validated = 0;
  let approved = 0;
  
  for (const email of pending) {
    const validation = await validateEmailContent(
      email.subject,
      email.htmlContent,
      email.audience
    );
    
    const newStatus = validation.isValid ? 'validated' : 'rejected';
    
    const notesBuilder: string[] = [validation.notes];
    if (validation.grammarIssues?.length) {
      notesBuilder.push('\n\nGrammar/Punctuation Issues:\n• ' + validation.grammarIssues.join('\n• '));
    }
    if (validation.suggestions?.length) {
      notesBuilder.push('\n\nSuggestions:\n• ' + validation.suggestions.join('\n• '));
    }
    
    await db.update(scheduledEmails)
      .set({
        status: newStatus,
        validationScore: validation.score,
        validationNotes: notesBuilder.join(''),
        validatedAt: new Date()
      })
      .where(eq(scheduledEmails.id, email.id));
    
    validated++;
    
    if (validation.score >= 80) {
      await db.update(scheduledEmails)
        .set({
          status: 'approved',
          approvedAt: new Date(),
          approvedBy: 'auto'
        })
        .where(eq(scheduledEmails.id, email.id));
      approved++;
    }
  }
  
  return { validated, approved };
}

export async function sendApprovedEmails(): Promise<{ sent: number; failed: number }> {
  const { sendDailyTip, isEmailConfigured } = await import("./email-service");
  
  if (!isEmailConfigured()) {
    console.log('[EmailScheduler] Email not configured, skipping send');
    return { sent: 0, failed: 0 };
  }
  
  const now = new Date();
  const approved = await db.select().from(scheduledEmails)
    .where(and(
      eq(scheduledEmails.status, 'approved'),
      lte(scheduledEmails.scheduledFor, now),
      isNull(scheduledEmails.sentAt)
    ));
  
  let sent = 0;
  let failed = 0;
  
  for (const email of approved) {
    const subscribers = await db.select().from(newsletters)
      .where(and(
        eq(newsletters.active, true),
        eq(newsletters.digitalSafetyTips, true),
        email.audience === 'all' 
          ? undefined 
          : eq(newsletters.audience, email.audience)
      ));
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const sub of subscribers) {
      if (email.region && email.region !== 'global' && sub.region !== email.region) continue;
      
      try {
        const success = await sendDailyTip(
          { audience: email.audience, title: email.subject, tip: email.textContent || '' },
          sub.email
        );
        
        if (success) successCount++;
        else failureCount++;
      } catch (error) {
        console.error(`[EmailScheduler] Failed to send to ${sub.email}:`, error);
        failureCount++;
      }
    }
    
    await db.update(scheduledEmails)
      .set({
        status: 'sent',
        sentAt: new Date(),
        recipientCount: subscribers.length,
        successCount,
        failureCount
      })
      .where(eq(scheduledEmails.id, email.id));
    
    if (successCount > 0) sent++;
    else failed++;
  }
  
  return { sent, failed };
}

export async function runScheduler(): Promise<{
  validated: number;
  approved: number;
  sent: number;
  failed: number;
}> {
  console.log('[EmailScheduler] Running scheduler...');
  
  const validation = await validatePendingEmails();
  console.log(`[EmailScheduler] Validated ${validation.validated} emails, auto-approved ${validation.approved}`);
  
  const sending = await sendApprovedEmails();
  console.log(`[EmailScheduler] Sent ${sending.sent} emails, ${sending.failed} failed`);
  
  return {
    ...validation,
    ...sending
  };
}

export async function getScheduledEmailQueue(status?: string): Promise<any[]> {
  if (status) {
    return db.select().from(scheduledEmails)
      .where(eq(scheduledEmails.status, status))
      .orderBy(scheduledEmails.scheduledFor);
  }
  return db.select().from(scheduledEmails)
    .orderBy(scheduledEmails.scheduledFor);
}

export async function approveEmail(id: number, approvedBy: string): Promise<boolean> {
  const result = await db.update(scheduledEmails)
    .set({
      status: 'approved',
      approvedAt: new Date(),
      approvedBy
    })
    .where(eq(scheduledEmails.id, id))
    .returning();
  
  return result.length > 0;
}

export async function rejectEmail(id: number, reason: string): Promise<boolean> {
  const result = await db.update(scheduledEmails)
    .set({
      status: 'rejected',
      validationNotes: reason
    })
    .where(eq(scheduledEmails.id, id))
    .returning();
  
  return result.length > 0;
}

export async function generateWeeklyTip(audience: string = 'all', region: string = 'global'): Promise<{ success: boolean; tipId?: number; error?: string }> {
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({
      apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
    });

    const audienceContext: Record<string, string> = {
      all: "all audiences (families, parents, seniors, teens)",
      youth: "teenagers and young adults (ages 13-25)",
      senior: "seniors (ages 60+)",
      parent: "parents with children",
      traveler: "travelers"
    };

    const regionContext: Record<string, string> = {
      global: "a global audience",
      north_america: "North American audiences (US, Canada, Mexico)",
      europe: "European audiences (UK, EU)",
      asia_pacific: "Asia-Pacific audiences",
      africa: "African audiences",
      latin_america: "Latin American audiences",
      middle_east: "Middle Eastern audiences"
    };

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: `You are a friendly cybersecurity educator creating a weekly digital safety tip for ${audienceContext[audience] || "all audiences"} targeting ${regionContext[region] || "a global audience"}.

Create an engaging, educational safety tip. Return ONLY valid JSON:
{
  "title": "Catchy, friendly title (max 60 chars)",
  "tipContent": "The main tip in 2-3 sentences. Use plain language, be practical and actionable.",
  "category": "phishing|password|social_media|scam|privacy|malware|safe_browsing|identity_theft",
  "actionItems": ["First action", "Second action", "Third action (optional)"],
  "funFact": "An interesting fact related to this topic (optional)"
}

Guidelines:
- Write like you're talking to a friend
- Focus on ONE clear topic
- Make action items specific and doable
- Be encouraging, not scary

Return ONLY valid JSON, no markdown.`
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected AI response format');
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    const tipData = JSON.parse(jsonMatch[0]);

    const { generateDailyTipEmail } = await import("./email-service");
    const emailContent = generateDailyTipEmail(
      { audience, title: tipData.title, tip: tipData.tipContent },
      'preview@example.com'
    );

    const scheduledFor = new Date();
    scheduledFor.setHours(9, 0, 0, 0);
    if (scheduledFor <= new Date()) {
      scheduledFor.setDate(scheduledFor.getDate() + 1);
    }

    const tipId = await queueScheduledEmail(
      'digital_safety_tip',
      audience,
      `🔒 Digital Safety Tip: ${tipData.title}`,
      emailContent.htmlBody,
      tipData.tipContent,
      scheduledFor,
      region
    );

    console.log(`[EmailScheduler] Generated weekly tip #${tipId}: ${tipData.title}`);
    return { success: true, tipId };
  } catch (error: any) {
    console.error('[EmailScheduler] Failed to generate weekly tip:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

export function isMonday(): boolean {
  return new Date().getDay() === 1;
}

export async function runWeeklyTipGeneration(): Promise<{ generated: boolean; tipId?: number; error?: string }> {
  if (!isMonday()) {
    return { generated: false, error: 'Not Monday - skipping weekly tip generation' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingTips = await db.select().from(scheduledEmails)
    .where(and(
      eq(scheduledEmails.emailType, 'digital_safety_tip'),
      lte(scheduledEmails.scheduledFor, tomorrow)
    ));

  const todaysTip = existingTips.find(tip => {
    const tipDate = new Date(tip.scheduledFor);
    tipDate.setHours(0, 0, 0, 0);
    return tipDate.getTime() === today.getTime();
  });

  if (todaysTip) {
    console.log('[EmailScheduler] Weekly tip already exists for today');
    return { generated: false, error: 'Tip already exists for today' };
  }

  const result = await generateWeeklyTip('all', 'global');
  return { generated: result.success, tipId: result.tipId, error: result.error };
}
