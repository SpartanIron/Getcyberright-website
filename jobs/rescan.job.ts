import { getDueRescanLeads, runRescanForLead } from "../server/shieldScanService";
import { buildRescanAlertEmail } from "../emails/rescan-alert";

const CANONICAL_DOMAIN = "https://www.getcyberright.com";

export async function executeRescanJob(): Promise<{
  leadsProcessed: number;
  alertsSent: number;
  errors: number;
}> {
  const leads = await getDueRescanLeads();
  let alertsSent = 0;
  let errors = 0;

  console.log(`[rescan-job] Found ${leads.length} leads due for re-scan`);

  for (const lead of leads) {
    try {
      console.log(`[rescan-job] Processing lead ${lead.leadId}`);

      const result = await runRescanForLead(lead);

      if (result.newExposures.length > 0) {
        const previousScanData = lead.lastScanId
          ? await import("../server/shieldScanService").then((m) =>
              m.getShieldScanFromDb(lead.lastScanId!),
            )
          : null;

        const firstName = previousScanData?.firstName || "User";
        const lastName = previousScanData?.lastName || "";

        const emailContent = buildRescanAlertEmail({
          name: `${firstName} ${lastName}`.trim(),
          newSiteCount: result.newExposures.length,
          newSites: result.newExposures,
          scanDate: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          resultsUrl: `${CANONICAL_DOMAIN}/shield/results/${result.newScanId}`,
          unsubscribeUrl: `${CANONICAL_DOMAIN}/api/shield/unsubscribe/${lead.leadId}`,
          previousScore: result.previousScore,
          newScore: result.newScore,
        });

        await sendAlertEmail(lead.alertEmail, emailContent);
        alertsSent++;

        console.log(
          `[rescan-job] Alert sent for lead ${lead.leadId}: ${result.newExposures.length} new exposures`,
        );
      } else {
        console.log(`[rescan-job] No new exposures for lead ${lead.leadId}`);
      }
    } catch (err: any) {
      errors++;
      console.error(
        `[rescan-job] Error processing lead ${lead.leadId}:`,
        err?.message || err,
      );
    }
  }

  console.log(
    `[rescan-job] Complete: ${leads.length} processed, ${alertsSent} alerts sent, ${errors} errors`,
  );

  return { leadsProcessed: leads.length, alertsSent, errors };
}

async function sendAlertEmail(
  to: string,
  content: { subject: string; html: string; text: string },
): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log(
      `[rescan-job] RESEND_API_KEY not configured — email to ${to.substring(0, 3)}*** would have been sent`,
    );
    console.log(`[rescan-job] Subject: ${content.subject}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "GCR Shield <shield@getcyberright.com>",
      to: [to],
      subject: content.subject,
      html: content.html,
      text: content.text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorText}`);
  }
}
