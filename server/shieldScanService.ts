import { db } from "./db";
import { shieldScans, shieldLeads } from "@shared/schema";
import { eq } from "drizzle-orm";

export type BrokerResult = {
  broker: string;
  status: "found" | "not_found" | "pending_verification" | "rate_limited" | "timed_out" | "unavailable";
  url: string;
  found: boolean | null;
  dataFound: string[] | null;
};

export type BreachResult = {
  source: "haveibeenpwned" | "dehashed";
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
  scoreBreakdown: {
    breachPoints: number;
    brokerPoints: number;
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
    console.log("[shield-scan] HIBP_API_KEY not configured — inserting placeholder");
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

async function checkSpokeo(data: ScanInput): Promise<BrokerResult> {
  return {
    broker: "Spokeo",
    status: "pending_verification",
    url: `https://www.spokeo.com/search?q=${encodeURIComponent(getFullName(data))}`,
    found: null,
    dataFound: null,
  };
}

async function checkWhitepages(data: ScanInput): Promise<BrokerResult> {
  return {
    broker: "Whitepages",
    status: "pending_verification",
    url: `https://www.whitepages.com/name/${encodeURIComponent(data.firstName)}-${encodeURIComponent(data.lastName)}`,
    found: null,
    dataFound: null,
  };
}

async function checkBeenVerified(data: ScanInput): Promise<BrokerResult> {
  return {
    broker: "BeenVerified",
    status: "pending_verification",
    url: `https://www.beenverified.com/people/${encodeURIComponent(data.firstName)}-${encodeURIComponent(data.lastName)}/`,
    found: null,
    dataFound: null,
  };
}

async function checkIntelius(data: ScanInput): Promise<BrokerResult> {
  return {
    broker: "Intelius",
    status: "pending_verification",
    url: `https://www.intelius.com/people-search/${encodeURIComponent(data.firstName)}-${encodeURIComponent(data.lastName)}`,
    found: null,
    dataFound: null,
  };
}

async function checkFastPeopleSearch(data: ScanInput): Promise<BrokerResult> {
  return {
    broker: "FastPeopleSearch",
    status: "pending_verification",
    url: `https://www.fastpeoplesearch.com/name/${encodeURIComponent(data.firstName)}-${encodeURIComponent(data.lastName)}`,
    found: null,
    dataFound: null,
  };
}

async function checkTruthFinder(data: ScanInput): Promise<BrokerResult> {
  return {
    broker: "TruthFinder",
    status: "pending_verification",
    url: `https://www.truthfinder.com/results/?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}`,
    found: null,
    dataFound: null,
  };
}

async function checkRadaris(data: ScanInput): Promise<BrokerResult> {
  return {
    broker: "Radaris",
    status: "pending_verification",
    url: `https://radaris.com/p/${encodeURIComponent(data.firstName)}/${encodeURIComponent(data.lastName)}/`,
    found: null,
    dataFound: null,
  };
}

const BROKER_CHECKS = [
  checkSpokeo,
  checkWhitepages,
  checkBeenVerified,
  checkIntelius,
  checkFastPeopleSearch,
  checkTruthFinder,
  checkRadaris,
];

function calculateExposureScore(
  breachResults: BreachResult[],
  brokerResults: BrokerResult[],
): { score: "low" | "medium" | "high" | "critical"; breakdown: ExposureReport["scoreBreakdown"] } {
  const realBreaches = breachResults.filter(
    (b) => !b.breachName.startsWith("__"),
  );

  let breachPoints = 0;
  if (realBreaches.length === 0) breachPoints = 0;
  else if (realBreaches.length <= 2) breachPoints = 10;
  else if (realBreaches.length <= 5) breachPoints = 25;
  else breachPoints = 40;

  const confirmedBrokers = brokerResults.filter((b) => b.status === "found");
  let brokerPoints = 0;
  if (confirmedBrokers.length === 0) brokerPoints = 0;
  else if (confirmedBrokers.length <= 2) brokerPoints = 10;
  else if (confirmedBrokers.length <= 4) brokerPoints = 20;
  else brokerPoints = 30;

  const allDataClasses = new Set(
    realBreaches.flatMap((b) => b.dataClasses.map((c) => c.toLowerCase())),
  );
  const allBrokerData = new Set(
    brokerResults.flatMap((b) => (b.dataFound || []).map((d) => d.toLowerCase())),
  );
  const combinedData = new Set([...allDataClasses, ...allBrokerData]);

  let sensitivityMultiplier = 1;
  const financialTerms = ["credit card", "bank account", "financial", "payment"];
  const govIdTerms = ["ssn", "social security", "government id", "passport", "national id", "tax id"];

  if (govIdTerms.some((t) => [...combinedData].some((d) => d.includes(t)))) {
    sensitivityMultiplier = 2;
  } else if (financialTerms.some((t) => [...combinedData].some((d) => d.includes(t)))) {
    sensitivityMultiplier = 1.5;
  }

  const rawTotal = Math.round((breachPoints + brokerPoints) * sensitivityMultiplier);

  let score: "low" | "medium" | "high" | "critical";
  if (rawTotal <= 20) score = "low";
  else if (rawTotal <= 45) score = "medium";
  else if (rawTotal <= 70) score = "high";
  else score = "critical";

  return {
    score,
    breakdown: {
      breachPoints,
      brokerPoints,
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
    return "Good news — we did not find your information on the data broker sites and breach databases we checked. This does not guarantee your data is not out there, but it is a positive sign.";
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

    const breachResults = await checkHaveIBeenPwned(input.email);

    const brokerResults = await Promise.all(
      BROKER_CHECKS.map(async (check) => {
        try {
          return await check(input);
        } catch (error) {
          return {
            broker: check.name.replace("check", ""),
            status: "unavailable" as const,
            url: "",
            found: null,
            dataFound: null,
          };
        }
      }),
    );

    const partialResults =
      breachResults.some((b) => b.breachName.startsWith("__")) ||
      brokerResults.some((b) => b.status === "rate_limited" || b.status === "timed_out" || b.status === "unavailable");

    const cleanBreaches = breachResults.filter(
      (b) => !b.breachName.startsWith("__"),
    );

    const { score, breakdown } = calculateExposureScore(breachResults, brokerResults);

    const report: ExposureReport = {
      scanId,
      completedAt: new Date().toISOString(),
      brokerResults,
      breachResults: cleanBreaches,
      exposureScore: score,
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
    .where(eq(shieldScans.scanId, scanId))
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

export { generatePlainLanguageSummary };
