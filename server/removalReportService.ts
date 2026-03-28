import { db } from "./db";
import { users, exposureScans, exposureFindings, removalRequests, privacyReports, userVaultProfiles } from "@shared/schema";
import { eq, and, desc, gte, sql } from "drizzle-orm";
import { sendEmail, isEmailConfigured } from "./email-service";

interface RemovalReportData {
  userName: string;
  email: string;
  reportDate: string;
  totalBrokersScanned: number;
  totalExposuresFound: number;
  removalsCompleted: number;
  removalsInProgress: number;
  removalsPending: number;
  newExposuresThisMonth: number;
  privacyScore: number;
  previousPrivacyScore: number | null;
  topExposedCategories: string[];
  recentRemovals: Array<{ brokerName: string; status: string; date: string }>;
}

class RemovalReportService {
  private scheduledJob: NodeJS.Timeout | null = null;

  async initialize() {
    console.log("[removal-reports] Initializing Monthly Removal Report Service...");
    this.scheduleMonthlyReports();
    console.log("[removal-reports] Monthly Removal Report Service initialized");
  }

  private lastRunMonth: string | null = null;

  private scheduleMonthlyReports() {
    const checkInterval = 60 * 60 * 1000;

    this.scheduledJob = setInterval(async () => {
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      if (now.getDate() <= 3 && now.getHours() >= 10 && this.lastRunMonth !== monthKey) {
        console.log(`[removal-reports] Running monthly reports for ${monthKey}...`);
        this.lastRunMonth = monthKey;
        await this.generateAndSendAllReports();
      }
    }, checkInterval);

    console.log("[removal-reports] Monthly reports scheduled for 1st-3rd of each month at 10 AM (with catch-up)");
  }

  async generateReportData(userId: string): Promise<RemovalReportData | null> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user || !user.email) return null;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const latestScans = await db.select().from(exposureScans)
      .where(eq(exposureScans.userId, userId))
      .orderBy(desc(exposureScans.createdAt))
      .limit(2);

    const latestScan = latestScans[0];

    const allRemovals = await db.select().from(removalRequests)
      .where(eq(removalRequests.userId, userId));

    const recentFindings = latestScan ? await db.select().from(exposureFindings)
      .where(and(
        eq(exposureFindings.userId, userId),
        gte(exposureFindings.detectedAt, thirtyDaysAgo)
      )) : [];

    const previousReports = await db.select().from(privacyReports)
      .where(eq(privacyReports.userId, userId))
      .orderBy(desc(privacyReports.createdAt))
      .limit(1);

    const completedStatuses = ['completed', 'confirmed_removed', 'verified_removed'];
    const inProgressStatuses = ['in_progress', 'request_sent', 'verifying', 'follow_up_sent'];
    const pendingStatuses = ['not_started', 'pending', 'queued'];

    const completedRemovals = allRemovals.filter(r => completedStatuses.includes(r.status || ''));
    const inProgressRemovals = allRemovals.filter(r => inProgressStatuses.includes(r.status || ''));
    const pendingRemovals = allRemovals.filter(r => pendingStatuses.includes(r.status || ''));

    const allFindings = latestScan ? await db.select().from(exposureFindings)
      .where(eq(exposureFindings.scanId, latestScan.id)) : [];

    const categoryMap = new Map<string, number>();
    allFindings.forEach(f => {
      (f.dataTypesExposed || []).forEach((cat: string) => {
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
      });
    });
    const topCategories = [...categoryMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat]) => cat);

    const recentCompletedRemovals = completedRemovals
      .filter(r => r.confirmedRemovedAt && r.confirmedRemovedAt >= thirtyDaysAgo)
      .slice(0, 5)
      .map(r => ({
        brokerName: r.brokerId || "Unknown Broker",
        status: r.status || "completed",
        date: r.confirmedRemovedAt ? new Date(r.confirmedRemovedAt).toLocaleDateString("en-US") : "Recently",
      }));

    const currentScore = latestScan?.privacyScore ?? 50;
    const previousScore = previousReports[0]?.privacyScore ?? null;

    return {
      userName: (user as any).firstName || user.email.split("@")[0],
      email: user.email,
      reportDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      totalBrokersScanned: latestScan?.totalBrokersScanned ?? 0,
      totalExposuresFound: latestScan?.totalExposuresFound ?? 0,
      removalsCompleted: completedRemovals.length,
      removalsInProgress: inProgressRemovals.length,
      removalsPending: pendingRemovals.length,
      newExposuresThisMonth: recentFindings.length,
      privacyScore: currentScore,
      previousPrivacyScore: previousScore,
      topExposedCategories: topCategories,
      recentRemovals: recentCompletedRemovals,
    };
  }

  generateReportHtml(data: RemovalReportData): string {
    const scoreColor = data.privacyScore >= 70 ? "#10b981" : data.privacyScore >= 40 ? "#f59e0b" : "#ef4444";
    const scoreTrend = data.previousPrivacyScore !== null
      ? data.privacyScore > data.previousPrivacyScore ? "improved" : data.privacyScore < data.previousPrivacyScore ? "declined" : "unchanged"
      : "initial";
    const trendIcon = scoreTrend === "improved" ? "&#8593;" : scoreTrend === "declined" ? "&#8595;" : "&#8212;";
    const trendColor = scoreTrend === "improved" ? "#10b981" : scoreTrend === "declined" ? "#ef4444" : "#6b7280";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Monthly Data Removal Report</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 32px 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Monthly Data Removal Report</h1>
      <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">${data.reportDate}</p>
      <p style="margin: 4px 0 0; opacity: 0.8; font-size: 13px;">Hello, ${data.userName}</p>
    </div>

    <div style="padding: 32px 24px;">
      <div style="text-align: center; margin-bottom: 28px; padding: 24px; background: linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%); border-radius: 12px; border: 1px solid #99f6e4;">
        <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Your Privacy Score</p>
        <div style="font-size: 56px; font-weight: 800; color: ${scoreColor}; line-height: 1;">${data.privacyScore}</div>
        <p style="margin: 8px 0 0; font-size: 14px; color: ${trendColor};">
          ${trendIcon} ${scoreTrend === "initial" ? "First report" : scoreTrend === "improved" ? `Improved from ${data.previousPrivacyScore}` : scoreTrend === "declined" ? `Down from ${data.previousPrivacyScore}` : `Same as last month (${data.previousPrivacyScore})`}
        </p>
      </div>

      <div style="display: flex; gap: 12px; margin-bottom: 28px;">
        <div style="flex: 1; text-align: center; padding: 16px 8px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 28px; font-weight: 700; color: #0d9488;">${data.totalBrokersScanned}</div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">Brokers Scanned</div>
        </div>
        <div style="flex: 1; text-align: center; padding: 16px 8px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 28px; font-weight: 700; color: ${data.totalExposuresFound > 0 ? '#f59e0b' : '#10b981'};">${data.totalExposuresFound}</div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">Exposures Found</div>
        </div>
        <div style="flex: 1; text-align: center; padding: 16px 8px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 28px; font-weight: 700; color: #10b981;">${data.removalsCompleted}</div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">Removals Done</div>
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #0d9488; font-size: 16px; font-weight: 600; margin: 0 0 12px; padding-left: 12px; border-left: 3px solid #f97316;">Removal Progress</h2>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #4b5563;">Completed removals</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #10b981;">${data.removalsCompleted}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #4b5563;">In progress</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #f59e0b;">${data.removalsInProgress}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #4b5563;">Pending</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #6b7280;">${data.removalsPending}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #4b5563;">New exposures this month</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; color: ${data.newExposuresThisMonth > 0 ? '#ef4444' : '#10b981'};">${data.newExposuresThisMonth}</td>
          </tr>
        </table>
      </div>

      ${data.topExposedCategories.length > 0 ? `
      <div style="margin-bottom: 28px;">
        <h2 style="color: #0d9488; font-size: 16px; font-weight: 600; margin: 0 0 12px; padding-left: 12px; border-left: 3px solid #f97316;">Most Exposed Data Types</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${data.topExposedCategories.map(cat =>
            `<span style="display: inline-block; padding: 4px 12px; background: #fef3c7; color: #92400e; border-radius: 16px; font-size: 12px; font-weight: 500;">${cat}</span>`
          ).join("")}
        </div>
      </div>` : ""}

      ${data.recentRemovals.length > 0 ? `
      <div style="margin-bottom: 28px;">
        <h2 style="color: #0d9488; font-size: 16px; font-weight: 600; margin: 0 0 12px; padding-left: 12px; border-left: 3px solid #f97316;">Recent Removals</h2>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          ${data.recentRemovals.map(r => `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; color: #4b5563;">${r.brokerName}</td>
            <td style="padding: 8px 0; text-align: right;">
              <span style="display: inline-block; padding: 2px 8px; background: #dcfce7; color: #166534; border-radius: 8px; font-size: 11px;">Removed ${r.date}</span>
            </td>
          </tr>`).join("")}
        </table>
      </div>` : ""}

      <div style="text-align: center; padding: 24px; background-color: #fff7ed; border-radius: 8px;">
        <p style="margin: 0 0 16px; color: #9a3412; font-weight: 500; font-size: 14px;">
          View your full dashboard for detailed insights and manage your removals.
        </p>
        <a href="https://www.getcyberright.com/dashboard" style="display: inline-block; background-color: #0d9488; color: white; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">View Dashboard</a>
      </div>
    </div>

    <div style="background-color: #1f2937; color: #9ca3af; padding: 24px; text-align: center; font-size: 13px;">
      <p style="margin: 0;">This report is generated monthly for GCR Data Shield subscribers.</p>
      <p style="margin-top: 8px;">
        <a href="https://www.getcyberright.com/preferences" style="color: #14b8a6; text-decoration: none;">Manage Preferences</a> |
        <a href="https://www.getcyberright.com/privacy" style="color: #14b8a6; text-decoration: none;">Privacy Policy</a>
      </p>
      <p style="margin-top: 12px; color: #6b7280;">&copy; ${new Date().getFullYear()} ColorCode Solutions LLC. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
  }

  generateReportText(data: RemovalReportData): string {
    return `GETCYBERRIGHT - Monthly Data Removal Report
${data.reportDate}
Hello, ${data.userName}

=====================================
YOUR PRIVACY SCORE: ${data.privacyScore}/100
${data.previousPrivacyScore !== null ? `Previous: ${data.previousPrivacyScore}/100` : "First report"}
=====================================

SUMMARY
- Brokers scanned: ${data.totalBrokersScanned}
- Exposures found: ${data.totalExposuresFound}
- Removals completed: ${data.removalsCompleted}
- In progress: ${data.removalsInProgress}
- Pending: ${data.removalsPending}
- New exposures this month: ${data.newExposuresThisMonth}

${data.topExposedCategories.length > 0 ? `MOST EXPOSED DATA TYPES
${data.topExposedCategories.map(c => `- ${c}`).join("\n")}` : ""}

${data.recentRemovals.length > 0 ? `RECENT REMOVALS
${data.recentRemovals.map(r => `- ${r.brokerName}: Removed ${r.date}`).join("\n")}` : ""}

View your full dashboard: https://www.getcyberright.com/dashboard
Manage preferences: https://www.getcyberright.com/preferences

(c) ${new Date().getFullYear()} ColorCode Solutions LLC. All rights reserved.`;
  }

  async sendReportToUser(userId: string): Promise<{ success: boolean; message: string }> {
    const data = await this.generateReportData(userId);
    if (!data) {
      return { success: false, message: "Could not generate report data for this user" };
    }

    const html = this.generateReportHtml(data);
    const text = this.generateReportText(data);

    await db.insert(privacyReports).values({
      userId,
      privacyScore: data.privacyScore,
      totalBrokersChecked: data.totalBrokersScanned,
      totalExposures: data.totalExposuresFound,
      totalRemoved: data.removalsCompleted,
      totalInProgress: data.removalsInProgress,
      totalPending: data.removalsPending,
      categoryBreakdown: data.topExposedCategories.length > 0 ? JSON.stringify(data.topExposedCategories) : null,
      recommendations: [],
    });

    if (!isEmailConfigured()) {
      console.log(`[removal-reports] Email not configured. Report generated for ${data.email} but not sent.`);
      return { success: true, message: `Report generated for ${data.email} (email not configured)` };
    }

    const sent = await sendEmail({
      to: [data.email],
      subject: `Your Monthly Data Removal Report - Privacy Score: ${data.privacyScore}`,
      htmlBody: html,
      textBody: text,
    });

    if (sent) {
      console.log(`[removal-reports] Report sent to ${data.email}`);
      return { success: true, message: `Report sent to ${data.email}` };
    } else {
      console.error(`[removal-reports] Failed to send report to ${data.email}`);
      return { success: false, message: `Failed to send report to ${data.email}` };
    }
  }

  async generateAndSendAllReports(): Promise<{ total: number; sent: number; failed: number }> {
    const payingUsers = await db.select().from(users)
      .where(
        sql`${users.subscriptionTier} IN ('essential', 'professional') AND ${users.subscriptionExpiresAt} > NOW()`
      );

    console.log(`[removal-reports] Found ${payingUsers.length} paying users for monthly reports`);

    let sent = 0;
    let failed = 0;

    for (const user of payingUsers) {
      try {
        const result = await this.sendReportToUser(user.id);
        if (result.success) {
          sent++;
        } else {
          failed++;
        }
      } catch (error: any) {
        console.error(`[removal-reports] Error for user ${user.id}:`, error.message);
        failed++;
      }
    }

    console.log(`[removal-reports] Monthly reports complete: ${sent} sent, ${failed} failed out of ${payingUsers.length}`);
    return { total: payingUsers.length, sent, failed };
  }

  async previewReport(userId: string): Promise<{ html: string; data: RemovalReportData } | null> {
    const data = await this.generateReportData(userId);
    if (!data) return null;
    return { html: this.generateReportHtml(data), data };
  }
}

export const removalReportService = new RemovalReportService();
