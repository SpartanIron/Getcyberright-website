import { db } from "./db";
import { breachMonitoringSubscriptions, breachCheckResults } from "@shared/schema";
import { eq, and, isNull } from "drizzle-orm";
import { sendEmail } from "./email-service";

interface BreachInfo {
  name: string;
  domain: string | null;
  date: string | null;
  exposedDataTypes: string[];
  severity: string;
  isPasswordExposed: boolean;
}

function generateBreachAlertEmail(
  email: string,
  newBreaches: BreachInfo[],
  unsubscribeToken: string
): { subject: string; htmlBody: string; textBody: string } {
  const breachCount = newBreaches.length;
  const hasPasswordExposure = newBreaches.some(b => b.isPasswordExposed);
  
  const urgencyLevel = hasPasswordExposure ? 'URGENT' : 'Important';
  const subject = `${urgencyLevel}: Your email was found in ${breachCount} new data breach${breachCount > 1 ? 'es' : ''}`;
  
  const breachCardsHtml = newBreaches.map(breach => `
    <div style="background: ${breach.isPasswordExposed ? '#fef2f2' : '#fffbeb'}; border-left: 4px solid ${breach.isPasswordExposed ? '#ef4444' : '#f59e0b'}; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="font-weight: 700; font-size: 16px; color: #1e293b;">${breach.name}</span>
        ${breach.isPasswordExposed ? '<span style="background: #ef4444; color: white; font-size: 11px; padding: 2px 8px; border-radius: 9999px;">PASSWORD EXPOSED</span>' : ''}
        <span style="background: ${breach.severity === 'critical' ? '#ef4444' : breach.severity === 'high' ? '#f97316' : '#eab308'}; color: ${breach.severity === 'medium' ? 'black' : 'white'}; font-size: 11px; padding: 2px 8px; border-radius: 9999px;">${breach.severity.toUpperCase()}</span>
      </div>
      ${breach.date ? `<p style="font-size: 13px; color: #64748b; margin: 0 0 8px 0;">Breach date: ${breach.date}</p>` : ''}
      ${breach.exposedDataTypes.length > 0 ? `
        <p style="font-size: 13px; color: #475569; margin: 0;">
          <strong>Data exposed:</strong> ${breach.exposedDataTypes.join(', ')}
        </p>
      ` : ''}
    </div>
  `).join('');

  const actionItems = [];
  if (hasPasswordExposure) {
    actionItems.push('Change your password on the affected service(s) immediately');
    actionItems.push('Update any other accounts using the same password');
  }
  actionItems.push('Enable two-factor authentication where available');
  actionItems.push('Watch for phishing emails pretending to be from these services');
  actionItems.push('Monitor your accounts for suspicious activity');

  const actionsHtml = actionItems.map(action => 
    `<li style="margin-bottom: 8px; color: #334155;">${action}</li>`
  ).join('');

  const unsubscribeUrl = `https://www.getcyberright.com/unsubscribe/breach-monitor?token=${unsubscribeToken}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background: white;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 32px 24px; text-align: center;">
      <div style="display: inline-flex; align-items: center; gap: 8px;">
        <div style="width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 24px;">🔓</span>
        </div>
        <span style="color: white; font-size: 24px; font-weight: 700;">Data Breach Alert</span>
      </div>
      <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 14px;">
        GetCyberRight.com - Keeping Your Family Safe Online
      </p>
    </div>
    
    <!-- Content -->
    <div style="padding: 32px 24px;">
      <p style="font-size: 16px; color: #1e293b; margin: 0 0 24px 0;">
        ${hasPasswordExposure ? '⚠️ <strong>Immediate action required!</strong>' : 'We detected'} Your email <strong>${email}</strong> was found in ${breachCount} new data breach${breachCount > 1 ? 'es' : ''}.
      </p>
      
      <!-- Breach Cards -->
      <div style="margin-bottom: 24px;">
        ${breachCardsHtml}
      </div>
      
      <!-- Action Items -->
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #166534; font-size: 16px;">✅ What You Should Do Now</h3>
        <ol style="margin: 0; padding-left: 20px;">
          ${actionsHtml}
        </ol>
      </div>
      
      <!-- CTA -->
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="https://www.getcyberright.com/breach-dashboard?token=${unsubscribeToken}" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          View Full Breach Report
        </a>
      </div>
      
      <p style="font-size: 14px; color: #64748b; margin: 0;">
        Stay vigilant and remember: legitimate companies will never ask for your password via email.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 12px; color: #94a3b8; margin: 0 0 8px 0;">
        You're receiving this because you signed up for breach monitoring at GetCyberRight.com
      </p>
      <a href="${unsubscribeUrl}" style="font-size: 12px; color: #64748b;">
        Unsubscribe from breach alerts
      </a>
    </div>
  </div>
</body>
</html>`;

  const textBody = `
DATA BREACH ALERT

Your email ${email} was found in ${breachCount} new data breach${breachCount > 1 ? 'es' : ''}.

${newBreaches.map(b => `
${b.name}${b.isPasswordExposed ? ' [PASSWORD EXPOSED]' : ''}
Severity: ${b.severity}
${b.date ? `Breach date: ${b.date}` : ''}
${b.exposedDataTypes.length > 0 ? `Data exposed: ${b.exposedDataTypes.join(', ')}` : ''}
`).join('\n')}

WHAT YOU SHOULD DO NOW:
${actionItems.map((a, i) => `${i + 1}. ${a}`).join('\n')}

View your full breach report: https://www.getcyberright.com/breach-dashboard?token=${unsubscribeToken}

To unsubscribe: ${unsubscribeUrl}

GetCyberRight.com - Keeping Your Family Safe Online
`;

  return { subject, htmlBody, textBody };
}

async function checkEmailForBreaches(email: string): Promise<BreachInfo[]> {
  try {
    const response = await fetch(`https://leakcheck.io/api/public?check=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      if (response.status === 429) {
        console.log(`[BreachMonitor] Rate limited for ${email}, skipping`);
        return [];
      }
      throw new Error(`LeakCheck API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.found || data.found === 0) {
      return [];
    }

    const exposedData = data.fields || [];
    const hasPassword = exposedData.some((f: string) => 
      f.toLowerCase().includes('password') || f.toLowerCase().includes('hash')
    );

    return (data.sources || []).map((source: any) => ({
      name: source.name || 'Unknown Breach',
      domain: source.domain || null,
      date: source.date || null,
      exposedDataTypes: exposedData,
      severity: hasPassword ? 'critical' : exposedData.length > 3 ? 'high' : 'medium',
      isPasswordExposed: hasPassword
    }));
  } catch (error) {
    console.error(`[BreachMonitor] Error checking ${email}:`, error);
    return [];
  }
}

async function getKnownBreaches(email: string): Promise<Set<string>> {
  const results = await db.select({ breachName: breachCheckResults.breachName })
    .from(breachCheckResults)
    .where(eq(breachCheckResults.email, email));
  
  return new Set(results.map(r => r.breachName));
}

async function saveNewBreaches(
  email: string,
  subscriptionId: number,
  breaches: BreachInfo[]
): Promise<void> {
  for (const breach of breaches) {
    await db.insert(breachCheckResults).values({
      email,
      subscriptionId,
      breachName: breach.name,
      breachDomain: breach.domain,
      breachDate: breach.date ? new Date(breach.date) : null,
      exposedDataTypes: breach.exposedDataTypes,
      severity: breach.severity,
      isPasswordExposed: breach.isPasswordExposed,
      isNotified: true
    });
  }
}

export async function runBreachMonitoringCheck(): Promise<{
  checked: number;
  newBreachesFound: number;
  emailsSent: number;
}> {
  console.log('[BreachMonitor] Starting breach monitoring check...');
  
  const subscriptions = await db.select()
    .from(breachMonitoringSubscriptions)
    .where(eq(breachMonitoringSubscriptions.isActive, true));
  
  console.log(`[BreachMonitor] Found ${subscriptions.length} active subscriptions`);
  
  let checked = 0;
  let newBreachesFound = 0;
  let emailsSent = 0;

  for (const subscription of subscriptions) {
    const allMonitoredEmails = subscription.monitoredEmails || [subscription.email];
    const allNewBreaches: Map<string, BreachInfo[]> = new Map();

    for (const monitoredEmail of allMonitoredEmails) {
      try {
        const currentBreaches = await checkEmailForBreaches(monitoredEmail);
        const knownBreaches = await getKnownBreaches(monitoredEmail);
        
        const newBreaches = currentBreaches.filter(b => !knownBreaches.has(b.name));
        
        if (newBreaches.length > 0) {
          allNewBreaches.set(monitoredEmail, newBreaches);
          newBreachesFound += newBreaches.length;
          
          await saveNewBreaches(monitoredEmail, subscription.id, newBreaches);
        }
        
        checked++;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`[BreachMonitor] Error processing ${monitoredEmail}:`, error);
      }
    }

    if (allNewBreaches.size > 0) {
      const allBreachesFlat: BreachInfo[] = [];
      allNewBreaches.forEach((breaches) => {
        allBreachesFlat.push(...breaches);
      });

      const { subject, htmlBody, textBody } = generateBreachAlertEmail(
        subscription.email,
        allBreachesFlat,
        subscription.unsubscribeToken || ''
      );

      try {
        const sent = await sendEmail({
          to: [subscription.email],
          subject,
          htmlBody,
          textBody
        });

        if (sent) {
          emailsSent++;
          console.log(`[BreachMonitor] Sent alert to ${subscription.email} for ${allBreachesFlat.length} breaches`);
        }
      } catch (error) {
        console.error(`[BreachMonitor] Failed to send email to ${subscription.email}:`, error);
      }
    }

    await db.update(breachMonitoringSubscriptions)
      .set({ 
        lastCheckedAt: new Date(),
        totalBreachesFound: (subscription.totalBreachesFound || 0) + newBreachesFound
      })
      .where(eq(breachMonitoringSubscriptions.id, subscription.id));
  }

  console.log(`[BreachMonitor] Check complete: ${checked} emails checked, ${newBreachesFound} new breaches found, ${emailsSent} alerts sent`);
  
  return { checked, newBreachesFound, emailsSent };
}

let monitoringInterval: NodeJS.Timeout | null = null;

export function startBreachMonitoringScheduler(intervalHours: number = 24): void {
  if (monitoringInterval) {
    console.log('[BreachMonitor] Scheduler already running');
    return;
  }

  console.log(`[BreachMonitor] Starting scheduler (every ${intervalHours} hours)`);
  
  runBreachMonitoringCheck().catch(console.error);
  
  monitoringInterval = setInterval(() => {
    runBreachMonitoringCheck().catch(console.error);
  }, intervalHours * 60 * 60 * 1000);
}

export function stopBreachMonitoringScheduler(): void {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
    console.log('[BreachMonitor] Scheduler stopped');
  }
}
