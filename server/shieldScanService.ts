import { db } from "./db";
import { shieldScans, shieldLeads, dataBrokers } from "@shared/schema";
import { eq, and, lte, isNull, sql, inArray } from "drizzle-orm";
import { searchAllBrokersForProfile, type ProfileSearchResult } from "./brokerAdapters";

export type BrokerResult = {
  broker: string;
  status: "found" | "not_found" | "pending_verification" | "rate_limited" | "timed_out" | "unavailable";
  url: string;
  found: boolean | null;
  dataFound: string[] | null;
  optOutUrl?: string | null;
  optOutEmail?: string | null;
  optOutMethod?: string | null;
  optOutInstructions?: string | null;
  difficultyRating?: number | null;
};

export type BreachResult = {
  source: "haveibeenpwned" | "dehashed" | "xposedornot" | "leakcheck";
  breachName: string;
  breachDate: string | null;
  dataClasses: string[];
};

export type ExposureReport = {
  scanId: string;
  completedAt: string;
  brokerResults: BrokerResult[];
  breachResults: BreachResult[];
  exposureScore: "low" | "medium" | "high" | "critical";
  numericScore: number;
  scoreBreakdown: {
    breachPoints: number;
    brokerPoints: number;
    recencyPoints: number;
    passwordExposurePoints: number;
    sensitivityMultiplier: number;
    rawTotal: number;
  };
  partialResults: boolean;
};

interface ScanInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  zip?: string;
}

function getFullName(input: ScanInput): string {
  return `${input.firstName} ${input.lastName}`.trim();
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
): Promise<Response> {
  const intervals = [2000, 4000, 8000];
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.status !== 429 || attempt === maxRetries) {
        return response;
      }

      lastResponse = response;
      const delay = intervals[attempt] || 8000;
      console.log(`[shield-scan] Rate limited (429), retry ${attempt + 1}/${maxRetries} in ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("TIMEOUT");
      }
      throw error;
    }
  }

  return lastResponse!;
}

async function checkHaveIBeenPwned(email: string): Promise<BreachResult[]> {
  const hibpApiKey = process.env.HIBP_API_KEY;
  if (!hibpApiKey) {
    console.log("[shield-scan] HIBP_API_KEY not configured - inserting placeholder");
    return [];
  }

  try {
    const response = await fetchWithRetry(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
      {
        headers: {
          "hibp-api-key": hibpApiKey,
          "User-Agent": "GetCyberRight-ShieldScanner",
          Accept: "application/json",
        },
      },
    );

    if (response.status === 404) return [];
    if (response.status === 401) {
      console.log("[shield-scan] HIBP API key invalid");
      return [{ source: "haveibeenpwned" as const, breachName: "__unavailable__", breachDate: null, dataClasses: [] }];
    }
    if (response.status === 429) {
      return [{ source: "haveibeenpwned" as const, breachName: "__rate_limited__", breachDate: null, dataClasses: [] }];
    }
    if (!response.ok) {
      console.log("[shield-scan] HIBP returned non-200 status");
      return [{ source: "haveibeenpwned" as const, breachName: "__unavailable__", breachDate: null, dataClasses: [] }];
    }

    const data = (await response.json()) as any[];
    return data.map((b: any) => ({
      source: "haveibeenpwned" as const,
      breachName: b.Name,
      breachDate: b.BreachDate || null,
      dataClasses: b.DataClasses || [],
    }));
  } catch (error: any) {
    if (error.message === "TIMEOUT") {
      return [{ source: "haveibeenpwned" as const, breachName: "__timed_out__", breachDate: null, dataClasses: [] }];
    }
    console.log("[shield-scan] HIBP check failed");
    return [{ source: "haveibeenpwned" as const, breachName: "__unavailable__", breachDate: null, dataClasses: [] }];
  }
}

async function checkXposedOrNot(email: string): Promise<BreachResult[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const checkResponse = await fetch(
      `https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'GetCyberRight-ShieldScanner/1.0',
        },
        signal: controller.signal,
      },
    );
    clearTimeout(timeoutId);

    if (checkResponse.status === 404) return [];
    if (!checkResponse.ok) {
      console.log(`[shield-scan] XposedOrNot returned ${checkResponse.status}`);
      return [];
    }

    const checkData = await checkResponse.json() as any;
    const breachNames: string[] = checkData.breaches
      ? checkData.breaches.flat().filter((b: string) => b && b.length > 0)
      : [];

    if (breachNames.length === 0) return [];

    let analyticsData: any = null;
    try {
      const analyticsController = new AbortController();
      const analyticsTimeout = setTimeout(() => analyticsController.abort(), 15000);
      const analyticsResponse = await fetch(
        `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(email)}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'GetCyberRight-ShieldScanner/1.0',
          },
          signal: analyticsController.signal,
        },
      );
      clearTimeout(analyticsTimeout);
      if (analyticsResponse.ok) {
        analyticsData = await analyticsResponse.json();
      }
    } catch {
    }

    const breachDetails = analyticsData?.ExposedBreaches?.breaches_details || [];
    const detailMap = new Map<string, any>();
    for (const detail of breachDetails) {
      if (detail.breach) detailMap.set(detail.breach, detail);
    }

    return breachNames.map((name) => {
      const detail = detailMap.get(name);
      return {
        source: "xposedornot" as const,
        breachName: name,
        breachDate: detail?.xposed_date || null,
        dataClasses: detail?.xposed_data
          ? detail.xposed_data.split(';').map((s: string) => s.trim()).filter(Boolean)
          : [],
      };
    });
  } catch (error: any) {
    console.log("[shield-scan] XposedOrNot check failed:", error.message);
    return [];
  }
}

async function checkLeakCheck(email: string): Promise<BreachResult[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(
      `https://leakcheck.io/api/public?check=${encodeURIComponent(email)}`,
      { signal: controller.signal },
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        console.log("[shield-scan] LeakCheck rate limited");
      }
      return [];
    }

    const data = await response.json() as any;
    if (!data.found || data.found === 0) return [];

    const exposedFields: string[] = data.fields || [];
    return (data.sources || []).map((source: any) => ({
      source: "leakcheck" as const,
      breachName: source.name || 'Unknown Breach',
      breachDate: source.date || null,
      dataClasses: exposedFields,
    }));
  } catch (error: any) {
    console.log("[shield-scan] LeakCheck check failed:", error.message);
    return [];
  }
}

async function checkBreaches(email: string): Promise<BreachResult[]> {
  const hibpApiKey = process.env.HIBP_API_KEY;

  if (hibpApiKey) {
    const hibpResults = await checkHaveIBeenPwned(email);
    const hasRealData = hibpResults.some(b => !b.breachName.startsWith("__"));
    if (hasRealData || hibpResults.length === 0) {
      return hibpResults;
    }
    console.log("[shield-scan] HIBP returned errors, falling through to free sources");
  }

  console.log("[shield-scan] Using free breach sources (XposedOrNot + LeakCheck)");

  const [xonResults, leakResults] = await Promise.allSettled([
    checkXposedOrNot(email),
    checkLeakCheck(email),
  ]);

  const combined: BreachResult[] = [];
  const seenBreaches = new Set<string>();

  const xon = xonResults.status === 'fulfilled' ? xonResults.value : [];
  const lc = leakResults.status === 'fulfilled' ? leakResults.value : [];

  for (const breach of xon) {
    const key = breach.breachName.toLowerCase();
    if (!seenBreaches.has(key)) {
      seenBreaches.add(key);
      combined.push(breach);
    }
  }

  for (const breach of lc) {
    const key = breach.breachName.toLowerCase();
    if (!seenBreaches.has(key)) {
      seenBreaches.add(key);
      combined.push(breach);
    }
  }

  console.log(`[shield-scan] Free sources found ${combined.length} breaches (XposedOrNot: ${xon.length}, LeakCheck: ${lc.length})`);
  return combined;
}

async function runRealBrokerSearch(input: ScanInput): Promise<BrokerResult[]> {
  try {
    const { results, stats } = await searchAllBrokersForProfile(
      {
        firstName: input.firstName,
        lastName: input.lastName,
      },
      75,
      150,
    );

    const brokerResults: BrokerResult[] = [];

    const brokerIds = Array.from(stats.brokerStatuses.keys());
    const brokerOptOutData = new Map<string, {
      optOutUrl: string | null;
      optOutEmail: string | null;
      optOutMethod: string | null;
      optOutInstructions: string | null;
      difficultyRating: number | null;
    }>();

    if (brokerIds.length > 0) {
      try {
        const dbBrokers = await db.select({
          id: dataBrokers.id,
          optOutUrl: dataBrokers.optOutUrl,
          optOutEmail: dataBrokers.optOutEmail,
          optOutMethod: dataBrokers.optOutMethod,
          optOutInstructions: dataBrokers.optOutInstructions,
          difficultyRating: dataBrokers.difficultyRating,
        }).from(dataBrokers).where(inArray(dataBrokers.id, brokerIds));

        for (const b of dbBrokers) {
          brokerOptOutData.set(b.id, {
            optOutUrl: b.optOutUrl,
            optOutEmail: b.optOutEmail,
            optOutMethod: b.optOutMethod,
            optOutInstructions: b.optOutInstructions,
            difficultyRating: b.difficultyRating,
          });
        }
      } catch (err: any) {
        console.error("[shield-scan] Failed to fetch broker opt-out data:", err?.message);
      }
    }

    for (const [brokerId, brokerStatus] of stats.brokerStatuses.entries()) {
      const result = results.get(brokerId);

      let status: BrokerResult["status"];
      if (brokerStatus === "search_blocked") {
        status = "unavailable";
      } else if (brokerStatus === "search_failed") {
        status = "timed_out";
      } else if (result && result.found && result.nameMatch && result.matchScore >= 40) {
        status = "found";
      } else {
        status = "not_found";
      }

      const dataFound: string[] = [];
      if (result?.extractedName) dataFound.push("Full Name");
      if (result?.extractedCity) dataFound.push("City");
      if (result?.extractedState) dataFound.push("State");
      if (result?.extractedAge) dataFound.push("Age");
      if (result?.extractedRelatives?.length && result.extractedRelatives.length > 0) dataFound.push("Known Associates");

      const optOut = brokerOptOutData.get(brokerId);

      brokerResults.push({
        broker: brokerId,
        status,
        url: result?.profileUrl || "",
        found: result ? (result.found && result.nameMatch && result.matchScore >= 40) : false,
        dataFound: dataFound.length > 0 ? dataFound : null,
        optOutUrl: optOut?.optOutUrl || null,
        optOutEmail: optOut?.optOutEmail || null,
        optOutMethod: optOut?.optOutMethod || null,
        optOutInstructions: optOut?.optOutInstructions || null,
        difficultyRating: optOut?.difficultyRating || null,
      });
    }

    console.log(`[shield-scan] Broker search complete: ${stats.found} found, ${stats.notFound} not found, ${stats.blocked} blocked, ${stats.failed} failed across ${stats.searched}/${stats.totalSearchable} sites`);

    return brokerResults;
  } catch (error: any) {
    console.error("[shield-scan] Broker search failed:", error?.message);
    return [];
  }
}

function calculateExposureScore(
  breachResults: BreachResult[],
  brokerResults: BrokerResult[],
): { score: "low" | "medium" | "high" | "critical"; numericScore: number; breakdown: ExposureReport["scoreBreakdown"] } {
  const realBreaches = breachResults.filter(
    (b) => !b.breachName.startsWith("__"),
  );

  let breachPoints = 0;
  if (realBreaches.length === 0) breachPoints = 0;
  else if (realBreaches.length <= 2) breachPoints = 10;
  else if (realBreaches.length <= 5) breachPoints = 20;
  else if (realBreaches.length <= 10) breachPoints = 28;
  else breachPoints = 35;

  const confirmedBrokers = brokerResults.filter((b) => b.status === "found");
  let brokerPoints = 0;
  if (confirmedBrokers.length === 0) brokerPoints = 0;
  else if (confirmedBrokers.length <= 2) brokerPoints = 8;
  else if (confirmedBrokers.length <= 4) brokerPoints = 15;
  else if (confirmedBrokers.length <= 7) brokerPoints = 22;
  else brokerPoints = 28;

  const now = new Date();
  let recencyPoints = 0;
  for (const breach of realBreaches) {
    if (!breach.breachDate) continue;
    const breachDate = new Date(breach.breachDate);
    const daysSince = Math.max(0, Math.floor((now.getTime() - breachDate.getTime()) / (1000 * 60 * 60 * 24)));
    if (daysSince <= 90) recencyPoints += 5;
    else if (daysSince <= 365) recencyPoints += 3;
    else if (daysSince <= 730) recencyPoints += 1;
  }
  recencyPoints = Math.min(recencyPoints, 15);

  const allDataClasses = new Set(
    realBreaches.flatMap((b) => b.dataClasses.map((c) => c.toLowerCase())),
  );
  const allBrokerData = new Set(
    brokerResults.flatMap((b) => (b.dataFound || []).map((d) => d.toLowerCase())),
  );
  const combinedData = new Set([...allDataClasses, ...allBrokerData]);

  const passwordTerms = ["password", "passwords", "password hash", "hashed password"];
  let passwordExposurePoints = 0;
  if (passwordTerms.some((t) => [...allDataClasses].some((d) => d.includes(t)))) {
    passwordExposurePoints = 12;
  }

  let sensitivityMultiplier = 1;
  const financialTerms = ["credit card", "bank account", "financial", "payment"];
  const govIdTerms = ["ssn", "social security", "government id", "passport", "national id", "tax id"];

  if (govIdTerms.some((t) => [...combinedData].some((d) => d.includes(t)))) {
    sensitivityMultiplier = 1.5;
  } else if (financialTerms.some((t) => [...combinedData].some((d) => d.includes(t)))) {
    sensitivityMultiplier = 1.25;
  }

  const rawTotal = Math.round(
    (breachPoints + brokerPoints + recencyPoints + passwordExposurePoints) * sensitivityMultiplier
  );

  const numericScore = Math.min(100, Math.max(0, rawTotal));

  let score: "low" | "medium" | "high" | "critical";
  if (numericScore <= 20) score = "low";
  else if (numericScore <= 45) score = "medium";
  else if (numericScore <= 70) score = "high";
  else score = "critical";

  return {
    score,
    numericScore,
    breakdown: {
      breachPoints,
      brokerPoints,
      recencyPoints,
      passwordExposurePoints,
      sensitivityMultiplier,
      rawTotal,
    },
  };
}

function generatePlainLanguageSummary(report: ExposureReport): string {
  const realBreaches = report.breachResults.filter(
    (b) => !b.breachName.startsWith("__"),
  );
  const confirmedBrokers = report.brokerResults.filter((b) => b.status === "found");
  const pendingBrokers = report.brokerResults.filter(
    (b) => b.status === "pending_verification",
  );

  const parts: string[] = [];

  if (realBreaches.length > 0) {
    parts.push(
      `Your email address appeared in ${realBreaches.length} data breach${realBreaches.length !== 1 ? "es" : ""}`,
    );
  }

  if (confirmedBrokers.length > 0) {
    parts.push(
      `your name was found on ${confirmedBrokers.length} people-search site${confirmedBrokers.length !== 1 ? "s" : ""}`,
    );
  }

  if (pendingBrokers.length > 0) {
    parts.push(
      `${pendingBrokers.length} additional broker${pendingBrokers.length !== 1 ? "s" : ""} may also have your data and require manual verification`,
    );
  }

  if (parts.length === 0) {
    return "Good news - we did not find your information on the data broker sites and breach databases we checked. This does not guarantee your data is not out there, but it is a positive sign.";
  }

  let summary = parts[0];
  for (let i = 1; i < parts.length; i++) {
    if (i === parts.length - 1) {
      summary += `, and ${parts[i]}`;
    } else {
      summary += `, ${parts[i]}`;
    }
  }
  summary += ".";

  if (report.exposureScore === "high" || report.exposureScore === "critical") {
    summary +=
      " This level of exposure is likely contributing to unwanted spam calls, phishing emails, and potential identity theft attempts.";
  }

  return summary;
}

const scanJobs = new Map<string, { status: string; report?: ExposureReport; summary?: string; error?: string }>();

async function runScanPipeline(scanId: string, input: ScanInput): Promise<void> {
  scanJobs.set(scanId, { status: "processing" });

  try {
    await db
      .update(shieldScans)
      .set({ status: "processing" })
      .where(eq(shieldScans.scanId, scanId));

    const breachResults = await checkBreaches(input.email);

    const brokerResults = await runRealBrokerSearch(input);

    const partialResults =
      breachResults.some((b) => b.breachName.startsWith("__")) ||
      brokerResults.some((b) => b.status === "rate_limited" || b.status === "timed_out" || b.status === "unavailable");

    const cleanBreaches = breachResults.filter(
      (b) => !b.breachName.startsWith("__"),
    );

    const { score, numericScore, breakdown } = calculateExposureScore(breachResults, brokerResults);

    const report: ExposureReport = {
      scanId,
      completedAt: new Date().toISOString(),
      brokerResults,
      breachResults: cleanBreaches,
      exposureScore: score,
      numericScore,
      scoreBreakdown: breakdown,
      partialResults,
    };

    const summary = generatePlainLanguageSummary(report);

    try {
      await db
        .update(shieldScans)
        .set({
          status: "complete",
          exposureScore: score,
          rawResults: report as any,
        })
        .where(eq(shieldScans.scanId, scanId));
    } catch (dbError) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        await db
          .update(shieldScans)
          .set({
            status: "complete",
            exposureScore: score,
            rawResults: report as any,
          })
          .where(eq(shieldScans.scanId, scanId));
      } catch (retryError) {
        scanJobs.set(scanId, {
          status: "failed",
          error: "We could not save your scan results. Please try again in a few minutes.",
        });
        return;
      }
    }

    scanJobs.set(scanId, { status: "complete", report, summary });
  } catch (error: any) {
    console.log(`[shield-scan] Pipeline failed for scan ${scanId}`);

    try {
      await db
        .update(shieldScans)
        .set({ status: "failed" })
        .where(eq(shieldScans.scanId, scanId));
    } catch {}

    scanJobs.set(scanId, {
      status: "failed",
      error: "Your scan took too long to complete. This sometimes happens during high traffic. Please try again.",
    });
  }
}

export async function startShieldScan(
  input: ScanInput,
  consentIp: string,
  userId?: string,
): Promise<{ scanId: string }> {
  const [scan] = await db
    .insert(shieldScans)
    .values({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone || null,
      zip: input.zip || null,
      userId: userId || null,
      status: "pending",
      consentGiven: true,
      consentTimestamp: new Date(),
      consentIp,
    })
    .returning();

  runScanPipeline(scan.scanId, input).catch((err) => {
    console.error(`[shield-scan] Unhandled pipeline error for ${scan.scanId}:`, err);
  });

  return { scanId: scan.scanId };
}

export function getShieldScanStatus(scanId: string): {
  status: string;
  report?: ExposureReport;
  summary?: string;
  error?: string;
} {
  const job = scanJobs.get(scanId);
  if (job) return job;
  return { status: "pending" };
}

export async function getShieldScanFromDb(scanId: string) {
  const [scan] = await db
    .select()
    .from(shieldScans)
    .where(
      and(
        eq(shieldScans.scanId, scanId),
        isNull(shieldScans.deletedAt),
      ),
    )
    .limit(1);
  return scan || null;
}

export async function createShieldLead(
  scanId: string,
  alertEmail: string,
): Promise<{ leadId: string }> {
  const scan = await getShieldScanFromDb(scanId);
  if (!scan) throw new Error("Scan not found");

  const nextScanDue = new Date();
  nextScanDue.setDate(nextScanDue.getDate() + 30);

  const [lead] = await db
    .insert(shieldLeads)
    .values({
      scanId,
      lastScanId: scanId,
      email: scan.email,
      alertEmail,
      nextScanDue,
      optedIn: true,
    })
    .returning();

  return { leadId: lead.leadId };
}

export async function softDeleteShieldScan(scanId: string, userId: string): Promise<"deleted" | "not_found" | "forbidden" | "already_deleted"> {
  const scan = await getShieldScanFromDb(scanId);
  if (!scan) return "not_found";
  if (!scan.userId || scan.userId !== userId) return "forbidden";
  if (scan.deletedAt) return "already_deleted";

  await db
    .update(shieldScans)
    .set({ deletedAt: new Date() })
    .where(eq(shieldScans.scanId, scanId));

  scanJobs.delete(scanId);
  return "deleted";
}

export async function purgeExpiredScans(): Promise<{ purgedCount: number }> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);

  const result = await db
    .update(shieldScans)
    .set({ deletedAt: new Date() })
    .where(
      and(
        isNull(shieldScans.deletedAt),
        isNull(shieldScans.userId),
        lte(shieldScans.createdAt, cutoff),
      ),
    )
    .returning({ scanId: shieldScans.scanId });

  return { purgedCount: result.length };
}

export async function unsubscribeLead(leadId: string): Promise<boolean> {
  const [lead] = await db
    .select()
    .from(shieldLeads)
    .where(eq(shieldLeads.leadId, leadId))
    .limit(1);

  if (!lead) return false;

  await db
    .update(shieldLeads)
    .set({ optedIn: false })
    .where(eq(shieldLeads.leadId, leadId));

  return true;
}

export async function getDueRescanLeads(): Promise<Array<{
  leadId: string;
  scanId: string | null;
  lastScanId: string | null;
  email: string;
  alertEmail: string;
}>> {
  const now = new Date();
  const leads = await db
    .select()
    .from(shieldLeads)
    .where(
      and(
        eq(shieldLeads.optedIn, true),
        lte(shieldLeads.nextScanDue, now),
      ),
    );

  return leads.map((l) => ({
    leadId: l.leadId,
    scanId: l.scanId,
    lastScanId: l.lastScanId,
    email: l.email,
    alertEmail: l.alertEmail,
  }));
}

export async function runRescanForLead(lead: {
  leadId: string;
  lastScanId: string | null;
  email: string;
  alertEmail: string;
}): Promise<{
  newScanId: string;
  newExposures: string[];
  previousScore: string | null;
  newScore: string | null;
}> {
  let previousResults: ExposureReport | null = null;
  let previousScore: string | null = null;

  if (lead.lastScanId) {
    const prevScan = await getShieldScanFromDb(lead.lastScanId);
    if (prevScan && prevScan.rawResults) {
      previousResults = prevScan.rawResults as unknown as ExposureReport;
      previousScore = prevScan.exposureScore;
    }
  }

  const previousScan = lead.lastScanId ? await getShieldScanFromDb(lead.lastScanId) : null;
  const firstName = previousScan?.firstName || "User";
  const lastName = previousScan?.lastName || "";

  const { scanId: newScanId } = await startShieldScan(
    { firstName, lastName, email: lead.email },
    "system-rescan",
  );

  await new Promise((resolve) => {
    const check = setInterval(async () => {
      const status = getShieldScanStatus(newScanId);
      if (status.status === "complete" || status.status === "failed") {
        clearInterval(check);
        resolve(null);
      }
    }, 2000);
    setTimeout(() => { clearInterval(check); resolve(null); }, 120000);
  });

  const newScan = await getShieldScanFromDb(newScanId);
  const scanStatus = getShieldScanStatus(newScanId);

  if (!newScan || scanStatus.status === "failed") {
    const retryDue = new Date();
    retryDue.setDate(retryDue.getDate() + 1);
    await db
      .update(shieldLeads)
      .set({ nextScanDue: retryDue })
      .where(eq(shieldLeads.leadId, lead.leadId));
    console.log(`[rescan] Scan failed for lead ${lead.leadId}, retrying in 1 day`);
    return { newScanId, newExposures: [], previousScore, newScore: null };
  }

  const newResults = newScan.rawResults as unknown as ExposureReport | null;
  const newScore = newScan.exposureScore || null;

  const newExposures: string[] = [];
  if (newResults) {
    if (previousResults) {
      const prevBrokers = new Set(
        (previousResults.brokerResults || [])
          .filter((b) => b.status === "found")
          .map((b) => b.broker),
      );
      for (const broker of (newResults.brokerResults || [])) {
        if (broker.status === "found" && !prevBrokers.has(broker.broker)) {
          newExposures.push(broker.broker);
        }
      }

      const prevBreaches = new Set(
        (previousResults.breachResults || []).map((b) => b.breachName),
      );
      for (const breach of (newResults.breachResults || [])) {
        if (!prevBreaches.has(breach.breachName)) {
          newExposures.push(`Breach: ${breach.breachName}`);
        }
      }
    } else {
      for (const broker of (newResults.brokerResults || [])) {
        if (broker.status === "found") {
          newExposures.push(broker.broker);
        }
      }
      for (const breach of (newResults.breachResults || [])) {
        newExposures.push(`Breach: ${breach.breachName}`);
      }
    }
  }

  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + 30);

  await db
    .update(shieldLeads)
    .set({ lastScanId: newScanId, nextScanDue: nextDue })
    .where(eq(shieldLeads.leadId, lead.leadId));

  return { newScanId, newExposures, previousScore, newScore };
}

export { generatePlainLanguageSummary };
