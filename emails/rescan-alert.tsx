type RescanAlertProps = {
  name: string;
  newSiteCount: number;
  newSites: string[];
  scanDate: string;
  resultsUrl: string;
  unsubscribeUrl: string;
  previousScore: string | null;
  newScore: string | null;
};

export function buildRescanAlertEmail(props: RescanAlertProps): {
  subject: string;
  html: string;
  text: string;
} {
  const { name, newSiteCount, newSites, scanDate, resultsUrl, unsubscribeUrl, previousScore, newScore } = props;

  const subject = `New exposure detected for your information`;

  const scoreChange = previousScore && newScore && previousScore !== newScore
    ? `Your exposure level changed from ${previousScore} to ${newScore}.`
    : "";

  const siteListHtml = newSites
    .map((site) => `<li style="padding:4px 0;color:#374151">${escapeHtml(site)}</li>`)
    .join("");

  const siteListText = newSites.map((site) => `  - ${site}`).join("\n");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5;color:#1a1a1a">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px">
    <div style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
      <div style="background:linear-gradient(135deg,#0A2A3C,#0d4a6a);padding:24px 32px;text-align:center">
        <h1 style="color:white;font-size:20px;margin:0;font-weight:700">GCR Shield Alert</h1>
        <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:8px 0 0">Personal Data Exposure Monitor</p>
      </div>

      <div style="padding:32px">
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
          Hi ${escapeHtml(name)},
        </p>

        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:0 0 20px">
          <p style="font-size:15px;font-weight:600;color:#991b1b;margin:0 0 4px">
            New exposure detected
          </p>
          <p style="font-size:14px;color:#7f1d1d;margin:0">
            Since your last scan, your information appeared on ${newSiteCount} new source${newSiteCount !== 1 ? "s" : ""}.
          </p>
        </div>

        ${scoreChange ? `<p style="font-size:14px;line-height:1.6;color:#374151;margin:0 0 16px">${escapeHtml(scoreChange)}</p>` : ""}

        <p style="font-size:14px;font-weight:600;color:#111827;margin:0 0 8px">New sources found:</p>
        <ul style="margin:0 0 24px;padding-left:20px;font-size:14px">${siteListHtml}</ul>

        <div style="text-align:center;margin:24px 0">
          <a href="${escapeHtml(resultsUrl)}" style="display:inline-block;background:#0A2A3C;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600">View Updated Results</a>
        </div>

        <p style="font-size:13px;color:#6b7280;line-height:1.5;margin:24px 0 0">
          Scan date: ${escapeHtml(scanDate)}
        </p>

        <p style="font-size:12px;color:#9ca3af;line-height:1.5;margin:16px 0 0">
          Breach data provided by <a href="https://haveibeenpwned.com" style="color:#9ca3af">Have I Been Pwned</a>.
          Your next automatic scan is scheduled in 30 days.
        </p>
      </div>

      <div style="border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;background:#f9fafb">
        <p style="font-size:12px;color:#9ca3af;margin:0">
          You are receiving this because you signed up for GCR Shield re-scan alerts.<br>
          <a href="${escapeHtml(unsubscribeUrl)}" style="color:#9ca3af;text-decoration:underline">Unsubscribe from these alerts</a>
        </p>
        <p style="font-size:11px;color:#d1d5db;margin:12px 0 0">&copy; GetCyberRight. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`.trim();

  const text = [
    `GCR Shield Alert`,
    ``,
    `Hi ${name},`,
    ``,
    `New exposure detected for your information.`,
    `Since your last scan, your information appeared on ${newSiteCount} new source${newSiteCount !== 1 ? "s" : ""}.`,
    scoreChange ? `\n${scoreChange}` : "",
    ``,
    `New sources found:`,
    siteListText,
    ``,
    `View your updated results: ${resultsUrl}`,
    ``,
    `Scan date: ${scanDate}`,
    ``,
    `Breach data provided by Have I Been Pwned (https://haveibeenpwned.com).`,
    `Your next automatic scan is scheduled in 30 days.`,
    ``,
    `---`,
    `You are receiving this because you signed up for GCR Shield re-scan alerts.`,
    `Unsubscribe: ${unsubscribeUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
