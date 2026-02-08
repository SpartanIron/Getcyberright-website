import { db } from "./db";
import {
  dataBrokers,
  userVaultProfiles,
  exposureScans,
  exposureFindings,
  removalRequests,
  monitoringSchedules,
  privacyReports,
  type DataBroker,
  type UserVaultProfile,
  type ExposureScan,
  type ExposureFinding,
  type RemovalRequest,
  type MonitoringSchedule,
  type PrivacyReport,
} from "@shared/schema";
import { eq, and, ilike, sql, desc, count } from "drizzle-orm";

const RISK_WEIGHTS: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const CATEGORY_DATA_MAP: Record<string, string[]> = {
  "people-search": ["name", "address", "phone"],
  "marketing": ["email"],
  "advertising": ["email"],
  "social-media-aggregator": ["email"],
  "financial": ["name", "address"],
  "location": ["address"],
  "recruitment": ["employment"],
  "background-check": ["name", "address", "phone"],
  "public-records": ["name", "address"],
  "health": ["name"],
};

interface BrokerCatalogFilters {
  category?: string;
  difficulty?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getBrokerCatalog(filters?: BrokerCatalogFilters) {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;
  const offset = (page - 1) * limit;

  let query = db.select().from(dataBrokers).where(eq(dataBrokers.isActive, true)).$dynamic();

  const conditions: any[] = [eq(dataBrokers.isActive, true)];

  if (filters?.category) {
    conditions.push(eq(dataBrokers.category, filters.category));
  }
  if (filters?.difficulty) {
    conditions.push(eq(dataBrokers.difficulty, filters.difficulty));
  }
  if (filters?.search) {
    conditions.push(ilike(dataBrokers.name, `%${filters.search}%`));
  }

  const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

  const [results, totalResult] = await Promise.all([
    db.select().from(dataBrokers).where(whereClause).limit(limit).offset(offset).orderBy(dataBrokers.name),
    db.select({ total: count() }).from(dataBrokers).where(whereClause),
  ]);

  return {
    brokers: results,
    total: totalResult[0]?.total ?? 0,
    page,
    limit,
    totalPages: Math.ceil((totalResult[0]?.total ?? 0) / limit),
  };
}

export async function getBrokerById(id: string): Promise<DataBroker | null> {
  const [broker] = await db.select().from(dataBrokers).where(eq(dataBrokers.id, id));
  return broker ?? null;
}

export async function getUserVaultProfile(userId: string): Promise<UserVaultProfile | null> {
  const [profile] = await db
    .select()
    .from(userVaultProfiles)
    .where(and(eq(userVaultProfiles.userId, userId), eq(userVaultProfiles.isActive, true)));
  return profile ?? null;
}

export async function upsertVaultProfile(
  userId: string,
  data: Partial<{
    profileName: string;
    fullName: string;
    previousNames: string[];
    emails: string[];
    phoneNumbers: string[];
    currentAddress: string;
    previousAddresses: string[];
    dateOfBirth: string;
    relativeNames: string[];
    employerNames: string[];
  }>
) {
  const existing = await getUserVaultProfile(userId);

  if (existing) {
    const [updated] = await db
      .update(userVaultProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userVaultProfiles.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(userVaultProfiles)
    .values({ userId, ...data })
    .returning();
  return created;
}

function getUserDataTypes(profile: UserVaultProfile): Set<string> {
  const types = new Set<string>();
  if (profile.fullName) types.add("name");
  if (profile.currentAddress || (profile.previousAddresses && profile.previousAddresses.length > 0)) types.add("address");
  if (profile.phoneNumbers && profile.phoneNumbers.length > 0) types.add("phone");
  if (profile.emails && profile.emails.length > 0) types.add("email");
  if (profile.employerNames && profile.employerNames.length > 0) types.add("employment");
  if (profile.relativeNames && profile.relativeNames.length > 0) types.add("relatives");
  if (profile.dateOfBirth) types.add("dob");
  if (profile.previousNames && profile.previousNames.length > 0) types.add("previous_names");
  return types;
}

function doesBrokerMatch(broker: DataBroker, userDataTypes: Set<string>): boolean {
  const requiredTypes = CATEGORY_DATA_MAP[broker.category];
  if (!requiredTypes) return false;
  return requiredTypes.every((t) => userDataTypes.has(t));
}

export async function runExposureScan(userId: string, vaultProfileId: string) {
  const [profile] = await db
    .select()
    .from(userVaultProfiles)
    .where(and(eq(userVaultProfiles.id, vaultProfileId), eq(userVaultProfiles.userId, userId)));

  if (!profile) {
    throw new Error("Vault profile not found");
  }

  const [scan] = await db
    .insert(exposureScans)
    .values({
      userId,
      vaultProfileId,
      status: "running",
    })
    .returning();

  const allBrokers = await db.select().from(dataBrokers).where(eq(dataBrokers.isActive, true));
  const userDataTypes = getUserDataTypes(profile);

  const matchedBrokers = allBrokers.filter((b) => doesBrokerMatch(b, userDataTypes));

  const riskWeightedMatches = matchedBrokers.map((broker) => {
    const weight = RISK_WEIGHTS[broker.riskLevel ?? "medium"] ?? 2;
    const matchProbability = Math.min(0.3 + weight * 0.15 + Math.random() * 0.2, 1.0);
    return { broker, weight, matched: matchProbability > 0.4 };
  });

  const exposedBrokers = riskWeightedMatches.filter((m) => m.matched);

  const findingsToInsert = exposedBrokers.map((match) => {
    const brokerDataTypes = match.broker.dataTypesCollected ?? [];
    const exposedTypes = brokerDataTypes.filter((dt) => userDataTypes.has(dt));
    const exposureLevel =
      match.weight >= 3 ? "high" : match.weight >= 2 ? "medium" : "low";

    return {
      scanId: scan.id,
      userId,
      brokerId: match.broker.id,
      dataTypesExposed: exposedTypes.length > 0 ? exposedTypes : ["name"],
      exposureLevel,
    };
  });

  let findings: ExposureFinding[] = [];
  if (findingsToInsert.length > 0) {
    findings = await db.insert(exposureFindings).values(findingsToInsert).returning();
  }

  const totalWeightedRisk = exposedBrokers.reduce((sum, m) => sum + m.weight, 0);
  const privacyScore = Math.max(0, Math.round(100 - totalWeightedRisk * 2.5));
  const riskLevel =
    privacyScore >= 80 ? "low" : privacyScore >= 50 ? "medium" : privacyScore >= 25 ? "high" : "critical";

  const [updatedScan] = await db
    .update(exposureScans)
    .set({
      status: "completed",
      totalBrokersScanned: allBrokers.length,
      totalExposuresFound: findings.length,
      privacyScore,
      riskLevel,
      completedAt: new Date(),
    })
    .where(eq(exposureScans.id, scan.id))
    .returning();

  return {
    scan: updatedScan,
    findings,
    totalBrokersScanned: allBrokers.length,
    totalExposuresFound: findings.length,
    privacyScore,
    riskLevel,
  };
}

export async function runGuestExposureScan(guestData: {
  fullName?: string;
  emails?: string[];
  phoneNumbers?: string[];
  currentAddress?: string;
}) {
  const types = new Set<string>();
  if (guestData.fullName) types.add("name");
  if (guestData.currentAddress) types.add("address");
  if (guestData.phoneNumbers && guestData.phoneNumbers.length > 0) types.add("phone");
  if (guestData.emails && guestData.emails.length > 0) types.add("email");

  if (types.size === 0) {
    throw new Error("Please provide at least your name to run a scan");
  }

  const allBrokers = await db.select().from(dataBrokers).where(eq(dataBrokers.isActive, true));
  const matchedBrokers = allBrokers.filter((b) => doesBrokerMatch(b, types));

  const riskWeightedMatches = matchedBrokers.map((broker) => {
    const weight = RISK_WEIGHTS[broker.riskLevel ?? "medium"] ?? 2;
    const matchProbability = Math.min(0.3 + weight * 0.15 + Math.random() * 0.2, 1.0);
    return { broker, weight, matched: matchProbability > 0.4 };
  });

  const exposedBrokers = riskWeightedMatches.filter((m) => m.matched);

  const findings = exposedBrokers.map((match) => {
    const brokerDataTypes = match.broker.dataTypesCollected ?? [];
    const exposedTypes = brokerDataTypes.filter((dt) => types.has(dt));
    const exposureLevel =
      match.weight >= 3 ? "high" : match.weight >= 2 ? "medium" : "low";
    return {
      broker: match.broker,
      dataTypesExposed: exposedTypes.length > 0 ? exposedTypes : ["name"],
      exposureLevel,
    };
  });

  const totalWeightedRisk = exposedBrokers.reduce((sum, m) => sum + m.weight, 0);
  const privacyScore = Math.max(0, Math.round(100 - totalWeightedRisk * 2.5));
  const riskLevel =
    privacyScore >= 80 ? "low" : privacyScore >= 50 ? "medium" : privacyScore >= 25 ? "high" : "critical";

  return {
    totalBrokersScanned: allBrokers.length,
    totalExposuresFound: findings.length,
    privacyScore,
    riskLevel,
    findings: findings.slice(0, 10),
  };
}

export async function getUserScanHistory(userId: string) {
  return db
    .select()
    .from(exposureScans)
    .where(eq(exposureScans.userId, userId))
    .orderBy(desc(exposureScans.createdAt));
}

export async function getExposureFindings(userId: string, scanId?: string) {
  const conditions = [eq(exposureFindings.userId, userId)];
  if (scanId) {
    conditions.push(eq(exposureFindings.scanId, scanId));
  }
  const findings = await db
    .select()
    .from(exposureFindings)
    .where(and(...conditions));

  const brokerIds = Array.from(new Set(findings.map((f) => f.brokerId)));
  let brokersMap: Record<string, DataBroker> = {};
  if (brokerIds.length > 0) {
    const brokers = await db.select().from(dataBrokers);
    brokersMap = Object.fromEntries(brokers.map((b) => [b.id, b]));
  }

  return findings.map((f) => ({
    ...f,
    broker: brokersMap[f.brokerId] ?? null,
  }));
}

export async function createRemovalRequest(
  userId: string,
  brokerId: string,
  vaultProfileId: string,
  findingId?: string
) {
  const [broker] = await db.select().from(dataBrokers).where(eq(dataBrokers.id, brokerId));
  if (!broker) throw new Error("Broker not found");

  const [profile] = await db
    .select()
    .from(userVaultProfiles)
    .where(and(eq(userVaultProfiles.id, vaultProfileId), eq(userVaultProfiles.userId, userId)));
  if (!profile) throw new Error("Vault profile not found");

  const [request] = await db
    .insert(removalRequests)
    .values({
      userId,
      brokerId,
      vaultProfileId,
      findingId: findingId ?? null,
      status: "not_started",
      requestMethod: broker.optOutMethod,
    })
    .returning();

  return request;
}

export async function generateOptOutContent(userId: string, brokerId: string) {
  const [broker] = await db.select().from(dataBrokers).where(eq(dataBrokers.id, brokerId));
  if (!broker) throw new Error("Broker not found");

  const profile = await getUserVaultProfile(userId);
  if (!profile) throw new Error("Vault profile not found. Please create one first.");

  const legalBases = broker.legalBasis ?? [];
  const hasCCPA = legalBases.includes("CCPA");
  const hasGDPR = legalBases.includes("GDPR");

  const fullName = profile.fullName ?? "[ Your Full Name ]";
  const address = profile.currentAddress ?? "[ Your Address ]";
  const emails = profile.emails?.join(", ") ?? "[ Your Email ]";
  const phones = profile.phoneNumbers?.join(", ") ?? "";
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let legalLanguage = "";
  if (hasCCPA) {
    legalLanguage += `Pursuant to the California Consumer Privacy Act (CCPA), Cal. Civ. Code \u00A71798.105, I am exercising my right to deletion. You are required to delete any and all personal information you have collected about me. Under CCPA, you must respond to this verifiable consumer request within 45 days.\n\n`;
  }
  if (hasGDPR) {
    legalLanguage += `Pursuant to the General Data Protection Regulation (GDPR), Article 17 (Right to Erasure), I hereby request the permanent deletion of all personal data you hold relating to me. Under GDPR, you are required to respond within 30 days of receipt of this request.\n\n`;
  }
  if (!hasCCPA && !hasGDPR) {
    legalLanguage = `I am writing to request the immediate removal and deletion of all personal information you have collected and published about me. I do not consent to the collection, storage, or publication of my personal data.\n\n`;
  }

  const emailContent = `Subject: Data Deletion and Opt-Out Request - ${fullName}

To Whom It May Concern at ${broker.name},

I am writing to formally request the removal of my personal information from your database and website (${broker.domain}).

${legalLanguage}The personal information I am requesting you delete includes, but is not limited to:
- Full Name: ${fullName}
- Email Address(es): ${emails}${phones ? `\n- Phone Number(s): ${phones}` : ""}
- Physical Address: ${address}
${profile.previousNames && profile.previousNames.length > 0 ? `- Previous Names: ${profile.previousNames.join(", ")}\n` : ""}${profile.relativeNames && profile.relativeNames.length > 0 ? `- Any associated relative information\n` : ""}
Please confirm in writing once this data has been removed. If you require any additional verification of my identity, please contact me at the email address provided above.

If you fail to comply with this request within the legally mandated timeframe, I reserve the right to file a complaint with the appropriate regulatory authority${hasCCPA ? " (California Attorney General)" : ""}${hasGDPR ? " (Data Protection Authority)" : ""}.

Sincerely,
${fullName}
Date: ${today}`;

  const letterContent = `${fullName}
${address}

${today}

${broker.name}
${broker.optOutMailAddress ?? `Privacy Department\n${broker.domain}`}

Re: Personal Data Deletion and Opt-Out Request

To Whom It May Concern,

${legalLanguage}I am writing to request the complete removal of my personal information from your database and any associated websites, including ${broker.domain}.

The personal information to be deleted includes:
- Full Name: ${fullName}
- Email Address(es): ${emails}${phones ? `\n- Phone Number(s): ${phones}` : ""}
- Physical Address: ${address}
${profile.previousNames && profile.previousNames.length > 0 ? `- Previous Names: ${profile.previousNames.join(", ")}\n` : ""}
Please confirm in writing upon completion of this removal. I expect compliance within the timeframe required by applicable law.

Sincerely,

${fullName}`;

  return {
    emailContent,
    letterContent,
    broker: {
      name: broker.name,
      domain: broker.domain,
      optOutMethod: broker.optOutMethod,
      optOutUrl: broker.optOutUrl,
      optOutEmail: broker.optOutEmail,
      optOutMailAddress: broker.optOutMailAddress,
      optOutPhone: broker.optOutPhone,
      optOutInstructions: broker.optOutInstructions,
      legalBasis: broker.legalBasis,
      estimatedProcessingDays: broker.estimatedProcessingDays,
    },
  };
}

export async function updateRemovalStatus(
  userId: string,
  requestId: string,
  status: string,
  notes?: string
) {
  const updateData: any = {
    status,
    updatedAt: new Date(),
  };

  if (notes) updateData.notes = notes;
  if (status === "request_sent") updateData.requestSentAt = new Date();
  if (status === "confirmed_removed") updateData.confirmedRemovedAt = new Date();
  if (status === "re_appeared") updateData.reAppearedAt = new Date();

  const [updated] = await db
    .update(removalRequests)
    .set(updateData)
    .where(and(eq(removalRequests.id, requestId), eq(removalRequests.userId, userId)))
    .returning();

  if (!updated) throw new Error("Removal request not found");
  return updated;
}

export async function getUserRemovalRequests(userId: string, status?: string) {
  const conditions = [eq(removalRequests.userId, userId)];
  if (status) {
    conditions.push(eq(removalRequests.status, status));
  }

  const requests = await db
    .select()
    .from(removalRequests)
    .where(and(...conditions))
    .orderBy(desc(removalRequests.createdAt));

  const brokerIds = Array.from(new Set(requests.map((r) => r.brokerId)));
  let brokersMap: Record<string, DataBroker> = {};
  if (brokerIds.length > 0) {
    const brokers = await db.select().from(dataBrokers);
    brokersMap = Object.fromEntries(brokers.map((b) => [b.id, b]));
  }

  return requests.map((r) => ({
    ...r,
    broker: brokersMap[r.brokerId] ?? null,
  }));
}

export async function getRemovalDashboardStats(userId: string) {
  const [allRequests, scans] = await Promise.all([
    db.select().from(removalRequests).where(eq(removalRequests.userId, userId)),
    db
      .select()
      .from(exposureScans)
      .where(eq(exposureScans.userId, userId))
      .orderBy(desc(exposureScans.createdAt))
      .limit(10),
  ]);

  const totalExposures = allRequests.length;
  const inProgress = allRequests.filter((r) =>
    ["request_generated", "request_sent", "in_progress"].includes(r.status)
  ).length;
  const completed = allRequests.filter((r) => r.status === "confirmed_removed").length;
  const failed = allRequests.filter((r) => r.status === "failed").length;
  const reAppeared = allRequests.filter((r) => r.status === "re_appeared").length;

  const privacyScoreTrend = scans
    .filter((s) => s.privacyScore != null)
    .map((s) => ({
      date: s.createdAt,
      score: s.privacyScore!,
    }))
    .reverse();

  const latestScore = scans[0]?.privacyScore ?? null;

  return {
    totalExposures,
    inProgress,
    completed,
    failed,
    reAppeared,
    latestPrivacyScore: latestScore,
    privacyScoreTrend,
    totalScans: scans.length,
  };
}

export async function setupMonitoring(
  userId: string,
  vaultProfileId: string,
  frequencyDays: number
) {
  const [existing] = await db
    .select()
    .from(monitoringSchedules)
    .where(and(eq(monitoringSchedules.userId, userId), eq(monitoringSchedules.isActive, true)));

  const nextScanDate = new Date();
  nextScanDate.setDate(nextScanDate.getDate() + frequencyDays);

  if (existing) {
    const [updated] = await db
      .update(monitoringSchedules)
      .set({
        vaultProfileId,
        frequencyDays,
        nextScanDate,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(monitoringSchedules.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(monitoringSchedules)
    .values({
      userId,
      vaultProfileId,
      frequencyDays,
      nextScanDate,
      isActive: true,
    })
    .returning();
  return created;
}

export async function getMonitoringSchedule(userId: string): Promise<MonitoringSchedule | null> {
  const [schedule] = await db
    .select()
    .from(monitoringSchedules)
    .where(and(eq(monitoringSchedules.userId, userId), eq(monitoringSchedules.isActive, true)));
  return schedule ?? null;
}

export async function generatePrivacyReport(userId: string) {
  const [latestScan] = await db
    .select()
    .from(exposureScans)
    .where(eq(exposureScans.userId, userId))
    .orderBy(desc(exposureScans.createdAt))
    .limit(1);

  const allRequests = await db
    .select()
    .from(removalRequests)
    .where(eq(removalRequests.userId, userId));

  const totalRemoved = allRequests.filter((r) => r.status === "confirmed_removed").length;
  const totalInProgress = allRequests.filter((r) =>
    ["request_generated", "request_sent", "in_progress"].includes(r.status)
  ).length;
  const totalPending = allRequests.filter((r) =>
    ["not_started", "scan_found"].includes(r.status)
  ).length;

  const privacyScore = latestScan?.privacyScore ?? 50;
  const totalExposures = latestScan?.totalExposuresFound ?? 0;
  const totalBrokersChecked = latestScan?.totalBrokersScanned ?? 0;

  let findings: ExposureFinding[] = [];
  if (latestScan) {
    findings = await db
      .select()
      .from(exposureFindings)
      .where(eq(exposureFindings.scanId, latestScan.id));
  }

  const allBrokers = await db.select().from(dataBrokers);
  const brokersMap = Object.fromEntries(allBrokers.map((b) => [b.id, b]));
  const categoryBreakdown: Record<string, number> = {};
  findings.forEach((f) => {
    const broker = brokersMap[f.brokerId];
    if (broker) {
      categoryBreakdown[broker.category] = (categoryBreakdown[broker.category] ?? 0) + 1;
    }
  });

  let riskAssessment = "Low Risk";
  if (privacyScore < 25) riskAssessment = "Critical Risk - Immediate action recommended";
  else if (privacyScore < 50) riskAssessment = "High Risk - Multiple exposures detected";
  else if (privacyScore < 80) riskAssessment = "Medium Risk - Some exposures found";

  const recommendations: string[] = [];
  if (totalExposures > 0 && totalPending > 0) {
    recommendations.push("Submit opt-out requests for pending exposures");
  }
  if (totalExposures > 10) {
    recommendations.push("Consider setting up automated monitoring to track re-appearances");
  }
  if (categoryBreakdown["people-search"] && categoryBreakdown["people-search"] > 3) {
    recommendations.push("Focus on people-search brokers first as they have the widest reach");
  }
  if (totalRemoved > 0) {
    recommendations.push("Continue monitoring removed listings for re-appearances");
  }
  if (recommendations.length === 0) {
    recommendations.push("Great job! Continue monitoring your digital footprint regularly");
  }

  const [report] = await db
    .insert(privacyReports)
    .values({
      userId,
      scanId: latestScan?.id ?? null,
      privacyScore,
      totalBrokersChecked,
      totalExposures,
      totalRemoved,
      totalInProgress,
      totalPending,
      categoryBreakdown: JSON.stringify(categoryBreakdown),
      riskAssessment,
      recommendations,
    })
    .returning();

  return {
    ...report,
    categoryBreakdown,
  };
}
