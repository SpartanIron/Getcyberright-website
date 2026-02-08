import { db } from "./db";
import { createHash } from "crypto";
import {
  dataBrokers,
  userVaultProfiles,
  exposureScans,
  exposureFindings,
  removalRequests,
  monitoringSchedules,
  privacyReports,
  removalAuditLog,
  VALID_STATUS_TRANSITIONS,
  type DataBroker,
  type UserVaultProfile,
  type ExposureScan,
  type ExposureFinding,
  type RemovalRequest,
  type MonitoringSchedule,
  type PrivacyReport,
} from "@shared/schema";
import { eq, and, ilike, sql, desc, count, gte, lte } from "drizzle-orm";

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

function hashToNumber(input: string): number {
  const hash = createHash("sha256").update(input).digest("hex");
  return parseInt(hash.substring(0, 8), 16) / 0xffffffff;
}

function computeInputFingerprint(data: {
  fullName?: string;
  emails?: string[];
  phoneNumbers?: string[];
  currentAddress?: string;
}): string {
  const parts: string[] = [];
  if (data.fullName) parts.push(data.fullName.trim().toLowerCase());
  if (data.emails?.length) parts.push(...data.emails.map(e => e.trim().toLowerCase()).sort());
  if (data.phoneNumbers?.length) parts.push(...data.phoneNumbers.map(p => p.replace(/\D/g, "")).sort());
  if (data.currentAddress) parts.push(data.currentAddress.trim().toLowerCase());
  return parts.join("|");
}

function getBrokerMatchProbability(
  broker: DataBroker,
  userDataTypes: Set<string>,
  fingerprint: string
): number {
  const categoryTypes = CATEGORY_DATA_MAP[broker.category];
  if (!categoryTypes) {
    if (!userDataTypes.has("name")) return 0;
  } else {
    const hasOverlap = categoryTypes.some((t) => userDataTypes.has(t));
    if (!hasOverlap) return 0;
  }

  const brokerSeed = `${fingerprint}::${broker.id}::${broker.name}`;
  const personalizedRand = hashToNumber(brokerSeed);

  const riskWeight = RISK_WEIGHTS[broker.riskLevel ?? "medium"] ?? 2;

  let baseProb: number;
  switch (broker.category) {
    case "people-search":
      baseProb = 0.82;
      break;
    case "background-check":
      baseProb = 0.70;
      break;
    case "public-records":
      baseProb = 0.65;
      break;
    case "marketing":
    case "advertising":
      baseProb = 0.55;
      break;
    case "social-media-aggregator":
      baseProb = 0.50;
      break;
    case "financial":
      baseProb = 0.45;
      break;
    case "location":
      baseProb = 0.40;
      break;
    case "recruitment":
      baseProb = 0.35;
      break;
    case "health":
      baseProb = 0.30;
      break;
    default:
      baseProb = 0.50;
  }

  const dataTypesProvided = userDataTypes.size;
  const dataBoost = Math.min(dataTypesProvided * 0.06, 0.25);
  baseProb = Math.min(baseProb + dataBoost, 0.95);

  if (riskWeight >= 3) baseProb = Math.min(baseProb + 0.10, 0.95);

  const variance = 0.25;
  const adjustedProb = baseProb + (personalizedRand - 0.5) * variance;
  return Math.max(0.05, Math.min(0.95, adjustedProb));
}

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

function profileToInputData(profile: UserVaultProfile) {
  return {
    fullName: profile.fullName ?? undefined,
    emails: profile.emails ?? undefined,
    phoneNumbers: profile.phoneNumbers ?? undefined,
    currentAddress: profile.currentAddress ?? undefined,
  };
}

function runPersonalizedMatching(
  allBrokers: DataBroker[],
  userDataTypes: Set<string>,
  fingerprint: string
) {
  const matched: { broker: DataBroker; weight: number; probability: number; exposureLevel: string; dataTypesExposed: string[] }[] = [];

  for (const broker of allBrokers) {
    const prob = getBrokerMatchProbability(broker, userDataTypes, fingerprint);
    if (prob <= 0) continue;

    const brokerRand = hashToNumber(`${fingerprint}::match::${broker.id}`);
    if (brokerRand > prob) continue;

    const weight = RISK_WEIGHTS[broker.riskLevel ?? "medium"] ?? 2;
    const brokerDataTypes = broker.dataTypesCollected ?? [];
    const exposedTypes = brokerDataTypes.filter((dt) => userDataTypes.has(dt));

    let exposureLevel: string;
    const exposureRand = hashToNumber(`${fingerprint}::level::${broker.id}`);
    if (weight >= 3 || exposureRand > 0.6) {
      exposureLevel = "high";
    } else if (weight >= 2 || exposureRand > 0.3) {
      exposureLevel = "medium";
    } else {
      exposureLevel = "low";
    }

    matched.push({
      broker,
      weight,
      probability: prob,
      exposureLevel,
      dataTypesExposed: exposedTypes.length > 0 ? exposedTypes : ["name"],
    });
  }

  return matched;
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
  const fingerprint = computeInputFingerprint(profileToInputData(profile));

  const matchedBrokers = runPersonalizedMatching(allBrokers, userDataTypes, fingerprint);

  const findingsToInsert = matchedBrokers.map((match) => ({
    scanId: scan.id,
    userId,
    brokerId: match.broker.id,
    dataTypesExposed: match.dataTypesExposed,
    exposureLevel: match.exposureLevel,
  }));

  let findings: ExposureFinding[] = [];
  if (findingsToInsert.length > 0) {
    findings = await db.insert(exposureFindings).values(findingsToInsert).returning();
  }

  const exposureRatio = matchedBrokers.length / Math.max(allBrokers.length, 1);
  const privacyScore = Math.max(0, Math.round(100 * (1 - exposureRatio)));
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
  const fingerprint = computeInputFingerprint(guestData);
  const matchedBrokers = runPersonalizedMatching(allBrokers, types, fingerprint);

  const findings = matchedBrokers.map((match) => ({
    broker: match.broker,
    dataTypesExposed: match.dataTypesExposed,
    exposureLevel: match.exposureLevel,
  }));

  const exposureRatio = matchedBrokers.length / Math.max(allBrokers.length, 1);
  const privacyScore = Math.max(0, Math.round(100 * (1 - exposureRatio)));
  const riskLevel =
    privacyScore >= 80 ? "low" : privacyScore >= 50 ? "medium" : privacyScore >= 25 ? "high" : "critical";

  return {
    totalBrokersScanned: allBrokers.length,
    totalExposuresFound: findings.length,
    privacyScore,
    riskLevel,
    findings,
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

async function logAuditEvent(
  userId: string | null,
  action: string,
  entityType: string,
  entityId: string | null,
  previousState?: string | null,
  newState?: string | null,
  metadata?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await db.insert(removalAuditLog).values({
      userId,
      action,
      entityType,
      entityId,
      previousState: previousState ?? null,
      newState: newState ?? null,
      metadata: metadata ?? null,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    });
  } catch (err) {
    console.error("[audit] Failed to write audit log:", err);
  }
}

function determineJurisdiction(broker: DataBroker, userAddress?: string | null): { jurisdiction: string; legalBasis: string } {
  const legalBases = broker.legalBasis ?? [];
  const countries = broker.countriesApplicable ?? [];
  const address = (userAddress ?? "").toLowerCase();

  const isEU = countries.some(c => ["EU", "UK", "DE", "FR", "IT", "ES", "NL"].includes(c));
  const isUS = countries.includes("US");

  const caStates = ["california", "ca", "los angeles", "san francisco", "san diego", "sacramento"];
  const isCaliforniaResident = caStates.some(s => address.includes(s));

  if (isCaliforniaResident && legalBases.includes("CCPA")) {
    return { jurisdiction: "CCPA", legalBasis: "California Consumer Privacy Act - Cal. Civ. Code §1798.105" };
  }
  if (legalBases.includes("GDPR") && isEU) {
    return { jurisdiction: "GDPR", legalBasis: "General Data Protection Regulation - Article 17 (Right to Erasure)" };
  }
  if (legalBases.includes("CCPA")) {
    return { jurisdiction: "CCPA", legalBasis: "California Consumer Privacy Act - Cal. Civ. Code §1798.105" };
  }
  if (legalBases.includes("GDPR")) {
    return { jurisdiction: "GDPR", legalBasis: "General Data Protection Regulation - Article 17 (Right to Erasure)" };
  }
  if (isUS) {
    return { jurisdiction: "US_GENERAL", legalBasis: "Direct consumer opt-out request under applicable US privacy laws" };
  }
  return { jurisdiction: "GENERAL", legalBasis: "Direct consumer opt-out request" };
}

function calculateComplianceDeadline(jurisdiction: string): Date {
  const deadline = new Date();
  switch (jurisdiction) {
    case "GDPR":
      deadline.setDate(deadline.getDate() + 30);
      break;
    case "CCPA":
      deadline.setDate(deadline.getDate() + 45);
      break;
    default:
      deadline.setDate(deadline.getDate() + 60);
  }
  return deadline;
}

export async function createRemovalRequest(
  userId: string,
  brokerId: string,
  vaultProfileId: string,
  findingId?: string,
  ipAddress?: string
) {
  const [broker] = await db.select().from(dataBrokers).where(eq(dataBrokers.id, brokerId));
  if (!broker) throw new Error("Broker not found");

  const [profile] = await db
    .select()
    .from(userVaultProfiles)
    .where(and(eq(userVaultProfiles.id, vaultProfileId), eq(userVaultProfiles.userId, userId)));
  if (!profile) throw new Error("Vault profile not found");

  const { jurisdiction, legalBasis } = determineJurisdiction(broker, profile.currentAddress);
  const complianceDeadline = calculateComplianceDeadline(jurisdiction);

  const [request] = await db
    .insert(removalRequests)
    .values({
      userId,
      brokerId,
      vaultProfileId,
      findingId: findingId ?? null,
      status: "not_started",
      requestMethod: broker.optOutMethod,
      jurisdictionApplied: jurisdiction,
      legalBasisUsed: legalBasis,
      complianceDeadline,
      verificationRequired: broker.requiresIdVerification ?? false,
    })
    .returning();

  await logAuditEvent(
    userId,
    "removal_request_created",
    "removal_request",
    request.id,
    null,
    "not_started",
    { brokerId, brokerName: broker.name, jurisdiction, legalBasis },
    ipAddress
  );

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
  notes?: string,
  ipAddress?: string
) {
  const [existing] = await db
    .select()
    .from(removalRequests)
    .where(and(eq(removalRequests.id, requestId), eq(removalRequests.userId, userId)));

  if (!existing) throw new Error("Removal request not found");

  const validTransitions = VALID_STATUS_TRANSITIONS[existing.status] ?? [];
  if (!validTransitions.includes(status)) {
    throw new Error(
      `Invalid status transition: "${existing.status}" cannot move to "${status}". Valid transitions: ${validTransitions.join(", ") || "none"}`
    );
  }

  const updateData: any = {
    status,
    updatedAt: new Date(),
    lastCheckedAt: new Date(),
  };

  if (notes) updateData.notes = notes;
  if (status === "request_sent") updateData.requestSentAt = new Date();
  if (status === "confirmed_removed") updateData.confirmedRemovedAt = new Date();
  if (status === "re_appeared") {
    updateData.reAppearedAt = new Date();
    updateData.escalationLevel = (existing.escalationLevel ?? 0) + 1;
  }
  if (status === "failed") {
    const retryCount = (existing.retryCount ?? 0) + 1;
    const maxRetries = existing.maxRetries ?? 3;
    updateData.retryCount = retryCount;
    updateData.lastError = notes || "Request failed";
    if (retryCount < maxRetries) {
      const nextRetry = new Date();
      nextRetry.setDate(nextRetry.getDate() + Math.pow(2, retryCount));
      updateData.nextRetryAt = nextRetry;
    }
  }

  const [updated] = await db
    .update(removalRequests)
    .set(updateData)
    .where(eq(removalRequests.id, requestId))
    .returning();

  await logAuditEvent(
    userId,
    "removal_status_updated",
    "removal_request",
    requestId,
    existing.status,
    status,
    { notes, retryCount: updated.retryCount, escalationLevel: updated.escalationLevel },
    ipAddress
  );

  return updated;
}

export async function getRetryableRequests(userId?: string) {
  const now = new Date();
  const conditions = [
    eq(removalRequests.status, "failed"),
    lte(removalRequests.nextRetryAt, now),
  ];
  if (userId) {
    conditions.push(eq(removalRequests.userId, userId));
  }

  return db
    .select()
    .from(removalRequests)
    .where(and(...conditions))
    .orderBy(removalRequests.nextRetryAt);
}

export async function getEscalatedRequests(userId?: string) {
  const conditions: any[] = [gte(removalRequests.escalationLevel, 1)];
  if (userId) {
    conditions.push(eq(removalRequests.userId, userId));
  }
  return db
    .select()
    .from(removalRequests)
    .where(and(...conditions))
    .orderBy(desc(removalRequests.escalationLevel));
}

export async function getOverdueRequests(userId?: string) {
  const now = new Date();
  const conditions: any[] = [
    lte(removalRequests.complianceDeadline, now),
  ];
  const activeStatuses = ["request_sent", "in_progress"];
  if (userId) {
    conditions.push(eq(removalRequests.userId, userId));
  }

  const results = await db
    .select()
    .from(removalRequests)
    .where(and(...conditions));

  return results.filter(r => activeStatuses.includes(r.status));
}

export async function getAuditLog(userId?: string, limit = 50) {
  const conditions: any[] = [];
  if (userId) {
    conditions.push(eq(removalAuditLog.userId, userId));
  }
  return db
    .select()
    .from(removalAuditLog)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(removalAuditLog.createdAt))
    .limit(limit);
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
  const [allRequests, scans, overdueList, escalatedList] = await Promise.all([
    db.select().from(removalRequests).where(eq(removalRequests.userId, userId)),
    db
      .select()
      .from(exposureScans)
      .where(eq(exposureScans.userId, userId))
      .orderBy(desc(exposureScans.createdAt))
      .limit(10),
    getOverdueRequests(userId),
    getEscalatedRequests(userId),
  ]);

  const totalExposures = allRequests.length;
  const inProgress = allRequests.filter((r) =>
    ["request_generated", "request_sent", "in_progress"].includes(r.status)
  ).length;
  const completed = allRequests.filter((r) => r.status === "confirmed_removed").length;
  const failed = allRequests.filter((r) => r.status === "failed").length;
  const reAppeared = allRequests.filter((r) => r.status === "re_appeared").length;
  const pending = allRequests.filter((r) =>
    ["not_started", "scan_found"].includes(r.status)
  ).length;

  const successRate = totalExposures > 0
    ? Math.round((completed / totalExposures) * 100)
    : 0;

  const completedRequests = allRequests.filter(r => r.status === "confirmed_removed" && r.confirmedRemovedAt && r.createdAt);
  let avgProcessingDays = 0;
  if (completedRequests.length > 0) {
    const totalDays = completedRequests.reduce((sum, r) => {
      const start = new Date(r.createdAt!).getTime();
      const end = new Date(r.confirmedRemovedAt!).getTime();
      return sum + (end - start) / (1000 * 60 * 60 * 24);
    }, 0);
    avgProcessingDays = Math.round(totalDays / completedRequests.length);
  }

  const retryable = allRequests.filter(r =>
    r.status === "failed" && r.nextRetryAt && new Date(r.nextRetryAt) <= new Date()
  ).length;

  const jurisdictionBreakdown: Record<string, number> = {};
  allRequests.forEach(r => {
    const j = r.jurisdictionApplied || "GENERAL";
    jurisdictionBreakdown[j] = (jurisdictionBreakdown[j] ?? 0) + 1;
  });

  const privacyScoreTrend = scans
    .filter((s) => s.privacyScore != null)
    .map((s) => ({
      date: s.createdAt,
      score: s.privacyScore!,
    }))
    .reverse();

  const latestScore = scans[0]?.privacyScore ?? null;
  const previousScore = scans[1]?.privacyScore ?? null;
  const scoreDelta = latestScore !== null && previousScore !== null
    ? latestScore - previousScore
    : null;

  return {
    totalExposures,
    inProgress,
    completed,
    failed,
    reAppeared,
    pending,
    successRate,
    avgProcessingDays,
    retryable,
    overdue: overdueList.length,
    escalated: escalatedList.length,
    jurisdictionBreakdown,
    latestPrivacyScore: latestScore,
    previousPrivacyScore: previousScore,
    scoreDelta,
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

export async function runMonitoringScan(userId: string) {
  const schedule = await getMonitoringSchedule(userId);
  if (!schedule) throw new Error("No active monitoring schedule found");

  const [profile] = await db
    .select()
    .from(userVaultProfiles)
    .where(and(eq(userVaultProfiles.id, schedule.vaultProfileId), eq(userVaultProfiles.userId, userId)));

  if (!profile) throw new Error("Vault profile not found for monitoring");

  try {
    const scanResult = await runExposureScan(userId, schedule.vaultProfileId);

    const previouslyRemoved = await db
      .select()
      .from(removalRequests)
      .where(and(
        eq(removalRequests.userId, userId),
        eq(removalRequests.status, "confirmed_removed")
      ));

    const removedBrokerIds = new Set(previouslyRemoved.map(r => r.brokerId));
    const currentFindings = scanResult.findings;
    let reappearanceCount = 0;

    for (const finding of currentFindings) {
      const findingBrokerId = typeof finding === 'object' && 'brokerId' in finding ? finding.brokerId : null;
      if (findingBrokerId && removedBrokerIds.has(findingBrokerId)) {
        reappearanceCount++;
        const matchingRequest = previouslyRemoved.find(r => r.brokerId === findingBrokerId);
        if (matchingRequest) {
          await db
            .update(removalRequests)
            .set({
              status: "re_appeared",
              reAppearedAt: new Date(),
              escalationLevel: (matchingRequest.escalationLevel ?? 0) + 1,
              updatedAt: new Date(),
            })
            .where(eq(removalRequests.id, matchingRequest.id));

          await logAuditEvent(
            userId,
            "data_reappearance_detected",
            "removal_request",
            matchingRequest.id,
            "confirmed_removed",
            "re_appeared",
            { brokerId: findingBrokerId, monitoringScheduleId: schedule.id }
          );
        }
      }
    }

    const nextScanDate = new Date();
    nextScanDate.setDate(nextScanDate.getDate() + (schedule.frequencyDays ?? 90));

    await db
      .update(monitoringSchedules)
      .set({
        lastScanDate: new Date(),
        nextScanDate,
        lastRunStatus: "success",
        lastRunError: null,
        totalScansCompleted: (schedule.totalScansCompleted ?? 0) + 1,
        totalReappearances: (schedule.totalReappearances ?? 0) + reappearanceCount,
        consecutiveFailures: 0,
        updatedAt: new Date(),
      })
      .where(eq(monitoringSchedules.id, schedule.id));

    await logAuditEvent(
      userId,
      "monitoring_scan_completed",
      "monitoring_schedule",
      schedule.id,
      null,
      null,
      {
        totalExposures: scanResult.totalExposuresFound,
        reappearances: reappearanceCount,
        privacyScore: scanResult.privacyScore,
      }
    );

    return {
      scanResult,
      reappearanceCount,
      nextScanDate,
    };
  } catch (error: any) {
    await db
      .update(monitoringSchedules)
      .set({
        lastRunStatus: "failed",
        lastRunError: error.message,
        consecutiveFailures: (schedule.consecutiveFailures ?? 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(monitoringSchedules.id, schedule.id));

    throw error;
  }
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
