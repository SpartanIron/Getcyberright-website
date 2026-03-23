import { db } from "./db";
import { newsletterSubscribers, newsletterIssues, threatItems } from "@shared/schema";
import { eq, desc, gte, and } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";
import { ContentGuardrails } from "@shared/contentGuardrails";
import { Resend } from "resend";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface NewsletterContent {
  subject: string;
  threatSummary: string;
  protectionTip: string;
  familyTopic: string;
  quickWins: string[];
  contentHtml: string;
  contentText: string;
}

class NewsletterService {
  private scheduledJob: NodeJS.Timeout | null = null;

  async initialize() {
    console.log("[newsletter] Initializing Newsletter Service...");
    this.scheduleWeeklyNewsletter();
    console.log("[newsletter] Newsletter Service initialized");
  }

  private scheduleWeeklyNewsletter() {
    const checkInterval = 60 * 60 * 1000;
    
    this.scheduledJob = setInterval(async () => {
      const now = new Date();
      if (now.getDay() === 5 && now.getHours() === 9) {
        console.log("[newsletter] Friday 9 AM: Generating weekly newsletter...");
        await this.generateAndScheduleNewsletter();
      }
    }, checkInterval);

    console.log("[newsletter] Weekly newsletter scheduled for Fridays at 9 AM");
  }

  async getActiveSubscribers() {
    return db.select().from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.isActive, true));
  }

  async getRecentThreats(days: number = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    return db.select().from(threatItems)
      .where(gte(threatItems.ingestedAt, since))
      .orderBy(desc(threatItems.ingestedAt))
      .limit(50);
  }

  async generateNewsletterContent(): Promise<NewsletterContent> {
    const threats = await this.getRecentThreats(7);
    
    const threatSummary = threats.slice(0, 10).map(t => 
      `${t.title} (${t.severity || "medium"}): ${(t.summary || "").substring(0, 100)}`
    ).join("\n");

    try {
      const systemPrompt = `You are a cybersecurity education specialist writing a friendly, accessible weekly newsletter for GetCyberRight subscribers. Your audience includes families, seniors, and small business owners who are not technical experts.

WRITING RULES:
- Use simple, everyday language
- Never use dashes to separate clauses; use periods, commas, or semicolons instead
- Be encouraging and empowering, not scary
- Provide specific, actionable advice
- Keep each section concise (2-3 sentences for summaries, 3-4 for tips)`;

      const userPrompt = `Based on this week's threat intelligence, create newsletter content:

THREATS DETECTED THIS WEEK:
${threatSummary || "No significant new threats detected this week."}

Generate a JSON response with:
{
  "subject": "Catchy but professional email subject line (under 60 chars)",
  "threatSummary": "2-3 sentence summary of this week's most important threats in plain language",
  "protectionTip": "One practical tip with step by step guidance (3-4 sentences)",
  "familyTopic": "A conversation starter for families about online safety (2-3 sentences)",
  "quickWins": ["Quick action 1", "Quick action 2", "Quick action 3"]
}`;

      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      const block = message.content[0];
      const rawText = block && block.type === "text" ? block.text : "{}";
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const result = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
      
      const content = {
        subject: ContentGuardrails.sanitizeText(result.subject || "Your Weekly Cyber Safety Update"),
        threatSummary: ContentGuardrails.validateParagraph(result.threatSummary || ""),
        protectionTip: ContentGuardrails.validateParagraph(result.protectionTip || ""),
        familyTopic: ContentGuardrails.validateParagraph(result.familyTopic || ""),
        quickWins: ContentGuardrails.validateRecommendations(result.quickWins || []),
        contentHtml: "",
        contentText: "",
      };

      content.contentHtml = this.generateHtmlEmail(content);
      content.contentText = this.generateTextEmail(content);

      return content;
    } catch (error: any) {
      console.error("[newsletter] AI generation error:", error.message);
      return this.generateFallbackContent(threats.length);
    }
  }

  private generateFallbackContent(threatCount: number): NewsletterContent {
    const content = {
      subject: "Your Weekly Cyber Safety Update from GetCyberRight",
      threatSummary: `This week, our threat intelligence systems detected ${threatCount} new potential threats. Our team has analyzed these patterns to bring you the most relevant safety information.`,
      protectionTip: "Take a moment this week to review your password manager. Make sure all your important accounts have unique, strong passwords. If you do not have a password manager yet, consider trying a free option like Bitwarden.",
      familyTopic: "Ask your family members if they have received any suspicious text messages lately. Discuss what makes a message seem suspicious and what to do if you receive one.",
      quickWins: [
        "Update your phone's operating system if a new version is available.",
        "Check your email for any password reset requests you did not initiate.",
        "Review the privacy settings on one social media account.",
      ],
      contentHtml: "",
      contentText: "",
    };

    content.contentHtml = this.generateHtmlEmail(content);
    content.contentText = this.generateTextEmail(content);

    return content;
  }

  private generateHtmlEmail(content: Omit<NewsletterContent, "contentHtml" | "contentText">): string {
    const currentDate = new Date().toLocaleDateString("en-US", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
    .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
    .content { padding: 32px 24px; }
    .section { margin-bottom: 28px; }
    .section-title { color: #0d9488; font-size: 18px; font-weight: 600; margin: 0 0 12px; display: flex; align-items: center; gap: 8px; }
    .section-title::before { content: ""; display: inline-block; width: 4px; height: 20px; background-color: #f97316; border-radius: 2px; }
    .section-content { color: #4b5563; font-size: 15px; }
    .quick-wins { background-color: #f0fdfa; border-radius: 8px; padding: 20px; }
    .quick-wins ul { margin: 0; padding-left: 20px; }
    .quick-wins li { margin-bottom: 8px; color: #134e4a; }
    .cta { text-align: center; padding: 24px; background-color: #fff7ed; border-radius: 8px; margin-top: 24px; }
    .cta-button { display: inline-block; background-color: #f97316; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; }
    .footer { background-color: #1f2937; color: #9ca3af; padding: 24px; text-align: center; font-size: 13px; }
    .footer a { color: #14b8a6; text-decoration: none; }
    .divider { height: 1px; background-color: #e5e7eb; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GetCyberRight</h1>
      <p>Your Weekly Cyber Safety Update</p>
      <p style="font-size: 12px; margin-top: 12px;">${currentDate}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2 class="section-title">This Week in Cyber Safety</h2>
        <p class="section-content">${content.threatSummary}</p>
      </div>

      <div class="divider"></div>

      <div class="section">
        <h2 class="section-title">Protection Tip of the Week</h2>
        <p class="section-content">${content.protectionTip}</p>
      </div>

      <div class="divider"></div>

      <div class="section">
        <h2 class="section-title">Family Conversation Starter</h2>
        <p class="section-content">${content.familyTopic}</p>
      </div>

      <div class="divider"></div>

      <div class="section">
        <h2 class="section-title">Quick Security Wins</h2>
        <div class="quick-wins">
          <ul>
            ${content.quickWins.map(win => `<li>${win}</li>`).join("\n            ")}
          </ul>
        </div>
      </div>

      <div class="cta">
        <p style="margin: 0 0 16px; color: #9a3412; font-weight: 500;">Want to learn more? Visit our platform for in-depth guides and tools.</p>
        <a href="https://www.getcyberright.com" class="cta-button">Explore GetCyberRight</a>
      </div>
    </div>

    <div class="footer">
      <p>You are receiving this email because you subscribed to GetCyberRight updates.</p>
      <p style="margin-top: 12px;">
        <a href="https://www.getcyberright.com/unsubscribe">Unsubscribe</a> | 
        <a href="https://www.getcyberright.com/privacy">Privacy Policy</a>
      </p>
      <p style="margin-top: 16px; color: #6b7280;">&copy; ${new Date().getFullYear()} ColorCode Solutions LLC. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
  }

  private generateTextEmail(content: Omit<NewsletterContent, "contentHtml" | "contentText">): string {
    const currentDate = new Date().toLocaleDateString("en-US", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });

    return `GETCYBERRIGHT - Your Weekly Cyber Safety Update
${currentDate}

=====================================
THIS WEEK IN CYBER SAFETY
=====================================
${content.threatSummary}

=====================================
PROTECTION TIP OF THE WEEK
=====================================
${content.protectionTip}

=====================================
FAMILY CONVERSATION STARTER
=====================================
${content.familyTopic}

=====================================
QUICK SECURITY WINS
=====================================
${content.quickWins.map((win, i) => `${i + 1}. ${win}`).join("\n")}

-------------------------------------
Visit https://www.getcyberright.com for more resources and tools.

To unsubscribe: https://www.getcyberright.com/unsubscribe
Privacy Policy: https://www.getcyberright.com/privacy

(c) ${new Date().getFullYear()} ColorCode Solutions LLC. All rights reserved.`;
  }

  async generateAndScheduleNewsletter(): Promise<string> {
    const content = await this.generateNewsletterContent();
    
    const scheduledFor = new Date();
    scheduledFor.setHours(10, 0, 0, 0);

    const [issue] = await db.insert(newsletterIssues).values({
      subject: content.subject,
      contentHtml: content.contentHtml,
      contentText: content.contentText,
      threatSummary: content.threatSummary,
      protectionTip: content.protectionTip,
      familyTopic: content.familyTopic,
      quickWins: content.quickWins,
      status: "scheduled",
      scheduledFor,
    }).returning();

    console.log(`[newsletter] Newsletter ${issue.id} generated and scheduled for ${scheduledFor}`);
    
    return issue.id;
  }

  async getNewsletterIssues(limit: number = 10) {
    return db.select().from(newsletterIssues)
      .orderBy(desc(newsletterIssues.createdAt))
      .limit(limit);
  }

  async getNewsletterIssue(id: string) {
    const issues = await db.select().from(newsletterIssues)
      .where(eq(newsletterIssues.id, id));
    return issues[0] || null;
  }

  async previewNewsletter(): Promise<NewsletterContent> {
    return this.generateNewsletterContent();
  }

  async sendNewsletter(issueId: string): Promise<{ success: boolean; message: string; recipientCount: number }> {
    const issue = await this.getNewsletterIssue(issueId);
    if (!issue) {
      return { success: false, message: "Newsletter issue not found", recipientCount: 0 };
    }

    const subscribers = await this.getActiveSubscribers();
    
    if (!resend) {
      console.log(`[newsletter] Email service not configured. Would send to ${subscribers.length} subscribers.`);
      
      await db.update(newsletterIssues)
        .set({ 
          status: "pending_email_config",
          recipientCount: subscribers.length,
          updatedAt: new Date(),
        })
        .where(eq(newsletterIssues.id, issueId));

      return { 
        success: false, 
        message: "Email service not configured. Newsletter saved and ready to send once email is set up.", 
        recipientCount: subscribers.length 
      };
    }

    // Send emails via Resend
    const subscriberEmails = subscribers.map(s => s.email);
    let successCount = 0;
    let failCount = 0;

    // Send in batches to avoid rate limits (Resend free tier: 100/day)
    const batchSize = 50;
    for (let i = 0; i < subscriberEmails.length; i += batchSize) {
      const batch = subscriberEmails.slice(i, i + batchSize);
      
      try {
        // Send to each subscriber individually for better deliverability
        for (const email of batch) {
          try {
            await resend.emails.send({
              from: "GetCyberRight <newsletter@getcyberright.com>",
              to: email,
              subject: issue.subject,
              html: issue.contentHtml || "",
              text: issue.contentText || "",
            });
            successCount++;
          } catch (emailError: any) {
            console.error(`[newsletter] Failed to send to ${email}:`, emailError.message);
            failCount++;
          }
        }
      } catch (batchError: any) {
        console.error(`[newsletter] Batch send error:`, batchError.message);
        failCount += batch.length;
      }
    }

    const status = failCount === 0 ? "sent" : (successCount > 0 ? "partially_sent" : "failed");
    
    await db.update(newsletterIssues)
      .set({ 
        status,
        sentAt: new Date(),
        recipientCount: successCount,
        updatedAt: new Date(),
      })
      .where(eq(newsletterIssues.id, issueId));

    console.log(`[newsletter] Newsletter ${issueId}: ${successCount} sent, ${failCount} failed`);
    
    return { 
      success: successCount > 0, 
      message: failCount === 0 
        ? `Newsletter sent to ${successCount} subscribers` 
        : `Newsletter sent to ${successCount} subscribers (${failCount} failed)`, 
      recipientCount: successCount 
    };
  }

  async getSubscriberStats() {
    const subscribers = await db.select().from(newsletterSubscribers);
    const active = subscribers.filter(s => s.isActive);
    
    return {
      total: subscribers.length,
      active: active.length,
      inactive: subscribers.length - active.length,
    };
  }
}

export const newsletterService = new NewsletterService();

export async function sendAlertToSubscribers(threatName: string, description: string, alertPath: string) {
  if (!resend) {
    console.log("[newsletter] Resend not configured, skipping alert email");
    return;
  }

  const subscribers = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true));
  if (subscribers.length === 0) {
    console.log("[newsletter] No active subscribers for alert email");
    return;
  }

  const siteUrl = "https://www.getcyberright.com";
  const alertUrl = `${siteUrl}${alertPath}`;
  const subject = `Security Alert: ${threatName}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0d9488, #f97316); padding: 2px; border-radius: 12px;">
        <div style="background: #1e293b; padding: 24px; border-radius: 10px;">
          <h1 style="color: #f97316; font-size: 18px; margin: 0 0 4px 0;">⚠️ Security Alert</h1>
          <h2 style="color: #ffffff; font-size: 22px; margin: 0 0 16px 0;">${threatName}</h2>
          <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">${description}</p>
          <a href="${alertUrl}" style="display: inline-block; background: #0d9488; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Read Full Alert</a>
        </div>
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 16px;">
        You received this because you subscribe to GetCyberRight security alerts.<br/>
        <a href="${siteUrl}" style="color: #0d9488;">GetCyberRight.com</a>
      </p>
    </div>
  `;

  let sent = 0;
  const batchSize = 10;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    for (const sub of batch) {
      try {
        await resend.emails.send({
          from: "GetCyberRight Alerts <alerts@getcyberright.com>",
          to: sub.email,
          subject,
          html,
        });
        sent++;
      } catch (err) {
        console.error(`[newsletter] Failed to send alert to ${sub.email}`);
      }
    }
  }
  console.log(`[newsletter] Alert email sent to ${sent}/${subscribers.length} subscribers`);
}
