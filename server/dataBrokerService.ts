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
  optOutContent,
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

export async function getAllVaultProfiles(userId: string): Promise<UserVaultProfile[]> {
  return db
    .select()
    .from(userVaultProfiles)
    .where(and(eq(userVaultProfiles.userId, userId), eq(userVaultProfiles.isActive, true)));
}

export async function createFamilyProfile(
  userId: string,
  data: {
    profileName: string;
    fullName?: string;
    emails?: string[];
    phoneNumbers?: string[];
    currentAddress?: string;
    relativeNames?: string[];
  }
) {
  const existingProfiles = await getAllVaultProfiles(userId);
  if (existingProfiles.length >= 6) {
    throw new Error("Maximum of 6 family member profiles allowed");
  }

  const [created] = await db
    .insert(userVaultProfiles)
    .values({ userId, ...data })
    .returning();
  return created;
}

export async function deleteFamilyProfile(userId: string, profileId: string) {
  const [profile] = await db
    .select()
    .from(userVaultProfiles)
    .where(and(eq(userVaultProfiles.id, profileId), eq(userVaultProfiles.userId, userId)));
  if (!profile) throw new Error("Profile not found");

  const allProfiles = await getAllVaultProfiles(userId);
  if (allProfiles.length <= 1) throw new Error("Cannot delete your only profile");

  await db
    .update(userVaultProfiles)
    .set({ isActive: false })
    .where(eq(userVaultProfiles.id, profileId));
  return { success: true };
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

const JURISDICTION_LEGAL_BASIS: Record<string, string> = {
  "CCPA": "California Consumer Privacy Act - Cal. Civ. Code \u00A71798.105",
  "CPRA": "California Privacy Rights Act - Cal. Civ. Code \u00A71798.105 (amended)",
  "GDPR": "General Data Protection Regulation - Article 17 (Right to Erasure)",
  "VCDPA": "Virginia Consumer Data Protection Act - Va. Code \u00A759.1-580",
  "CPA": "Colorado Privacy Act - C.R.S. \u00A76-1-1306",
  "CTDPA": "Connecticut Data Privacy Act - Conn. Gen. Stat. \u00A742-520",
  "UCPA": "Utah Consumer Privacy Act - Utah Code \u00A713-61-201",
  "PIPEDA": "Personal Information Protection and Electronic Documents Act - S.C. 2000, c. 5",
  "LGPD": "Lei Geral de Prote\u00E7\u00E3o de Dados - Art. 18(VI)",
};

function determineJurisdiction(broker: DataBroker, userAddress?: string | null): { jurisdiction: string; legalBasis: string } {
  const legalBases = broker.legalBasis ?? [];
  const countries = broker.countriesApplicable ?? [];
  const address = (userAddress ?? "").toLowerCase();

  const detected = detectJurisdiction(address, countries);

  if (legalBases.includes(detected)) {
    return { jurisdiction: detected, legalBasis: JURISDICTION_LEGAL_BASIS[detected] ?? `${detected} compliance request` };
  }

  for (const basis of legalBases) {
    if (JURISDICTION_LEGAL_BASIS[basis]) {
      return { jurisdiction: basis, legalBasis: JURISDICTION_LEGAL_BASIS[basis] };
    }
  }

  const isEU = countries.some(c => ["EU", "UK", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "IE", "PT", "SE", "PL"].includes(c));
  if (isEU) {
    return { jurisdiction: "GDPR", legalBasis: JURISDICTION_LEGAL_BASIS["GDPR"] };
  }
  if (countries.includes("US")) {
    return { jurisdiction: "CCPA", legalBasis: JURISDICTION_LEGAL_BASIS["CCPA"] };
  }
  if (countries.includes("CA") || countries.includes("Canada")) {
    return { jurisdiction: "PIPEDA", legalBasis: JURISDICTION_LEGAL_BASIS["PIPEDA"] };
  }
  if (countries.includes("BR") || countries.includes("Brazil")) {
    return { jurisdiction: "LGPD", legalBasis: JURISDICTION_LEGAL_BASIS["LGPD"] };
  }

  return { jurisdiction: "CCPA", legalBasis: JURISDICTION_LEGAL_BASIS["CCPA"] };
}

function calculateComplianceDeadline(jurisdiction: string): Date {
  const deadline = new Date();
  switch (jurisdiction) {
    case "GDPR":
    case "PIPEDA":
      deadline.setDate(deadline.getDate() + 30);
      break;
    case "LGPD":
      deadline.setDate(deadline.getDate() + 15);
      break;
    case "CCPA":
    case "CPRA":
    case "VCDPA":
    case "CPA":
    case "CTDPA":
    case "UCPA":
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

  const legalCitations: string[] = [];
  if (hasCCPA) legalCitations.push("CCPA Cal. Civ. Code \u00A71798.105");
  if (hasGDPR) legalCitations.push("GDPR Article 17 (Right to Erasure)");
  const framework = hasGDPR ? "GDPR" : hasCCPA ? "CCPA" : "General";

  await db.insert(optOutContent).values({
    userId,
    brokerId,
    regulatoryFramework: framework,
    templateType: "deletion_request",
    subject: `Data Deletion and Opt-Out Request - ${fullName}`,
    body: emailContent,
    legalCitations,
    deliveryMethod: broker.optOutMethod === "email" ? "email" : broker.optOutMethod === "mail" ? "postal" : "web-form",
    status: "draft",
  });

  return {
    emailContent,
    letterContent,
    regulatoryFramework: framework,
    legalCitations,
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

export async function sendAutoRemovalRequest(
  userId: string,
  requestId: string,
  ipAddress?: string
): Promise<{ success: boolean; method: string; message: string; sentTo?: string }> {
  const [request] = await db
    .select()
    .from(removalRequests)
    .where(and(eq(removalRequests.id, requestId), eq(removalRequests.userId, userId)));
  if (!request) throw new Error("Removal request not found");

  const [broker] = await db.select().from(dataBrokers).where(eq(dataBrokers.id, request.brokerId));
  if (!broker) throw new Error("Broker not found");

  const optOutResult = await generateOptOutContent(userId, request.brokerId);

  const method = broker.optOutMethod || "email";

  if (!broker.optOutEmail && (method === "email" || method === "mail")) {
    await updateRemovalStatus(userId, requestId, "pending", `Auto-removal: No verified opt-out email on file for ${broker.name}. Please use the opt-out letter manually via ${broker.optOutUrl || broker.domain}.`, ipAddress);
    await logAuditEvent(userId, "auto_removal_blocked", "removal_request", requestId, request.status, "pending", { reason: "no_verified_email", brokerName: broker.name }, ipAddress);
    return {
      success: false,
      method: "manual",
      message: `${broker.name} does not have a verified opt-out email address. We prepared your opt-out letter. You can send it manually or use their website at ${broker.optOutUrl || broker.domain}.`,
    };
  }

  const brokerEmail = broker.optOutEmail!;

  if (method === "online" || method === "form") {
    await updateRemovalStatus(userId, requestId, "pending", `Auto-removal: Broker requires web form submission at ${broker.optOutUrl || broker.domain}. Please visit the link to complete removal manually.`, ipAddress);
    await logAuditEvent(userId, "auto_removal_attempted", "removal_request", requestId, request.status, "pending", { method: "web-form", brokerName: broker.name, optOutUrl: broker.optOutUrl }, ipAddress);
    return {
      success: true,
      method: "web-form",
      message: `${broker.name} requires web form submission. We have prepared your opt-out letter. Visit ${broker.optOutUrl || broker.domain} to submit it.`,
    };
  }

  if (method === "phone") {
    await updateRemovalStatus(userId, requestId, "pending", `Auto-removal: Broker requires phone call to ${broker.optOutPhone || "their listed number"}. Use the opt-out script we prepared.`, ipAddress);
    await logAuditEvent(userId, "auto_removal_attempted", "removal_request", requestId, request.status, "pending", { method: "phone", brokerName: broker.name, optOutPhone: broker.optOutPhone }, ipAddress);
    return {
      success: true,
      method: "phone",
      message: `${broker.name} requires a phone call for removal. We prepared a script for you to use when calling ${broker.optOutPhone || "their privacy line"}.`,
    };
  }

  try {
    const { Resend } = await import("resend");
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error("Email service not configured. RESEND_API_KEY is required.");
    }
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: "GetCyberRight Data Removal <privacy@getcyberright.com>",
      to: brokerEmail,
      subject: optOutResult.emailContent.split("\n")[0].replace("Subject: ", ""),
      text: optOutResult.emailContent,
    });

    await updateRemovalStatus(userId, requestId, "request_sent", `Auto-sent removal request via email to ${brokerEmail}`, ipAddress);

    await db
      .update(optOutContent)
      .set({ status: "sent", sentAt: new Date(), sentTo: brokerEmail, deliveryMethod: "email" })
      .where(and(eq(optOutContent.userId, userId), eq(optOutContent.brokerId, request.brokerId)));

    await logAuditEvent(userId, "auto_removal_sent", "removal_request", requestId, request.status, "request_sent", {
      method: "email",
      sentTo: brokerEmail,
      brokerName: broker.name,
      jurisdiction: request.jurisdictionApplied,
    }, ipAddress);

    return {
      success: true,
      method: "email",
      message: `Removal request automatically sent to ${broker.name} at ${brokerEmail}. Expected response within ${broker.estimatedProcessingDays || 30} days.`,
      sentTo: brokerEmail,
    };
  } catch (error: any) {
    const errorMsg = error.message || "Unknown email send error";

    await updateRemovalStatus(userId, requestId, "failed", `Auto-send failed: ${errorMsg}`, ipAddress);
    await logAuditEvent(userId, "auto_removal_failed", "removal_request", requestId, request.status, "failed", {
      method: "email",
      error: errorMsg,
      brokerName: broker.name,
    }, ipAddress);

    return {
      success: false,
      method: "email",
      message: `Failed to auto-send to ${broker.name}: ${errorMsg}. You can manually send the opt-out letter instead.`,
    };
  }
}

export async function bulkAutoRemoval(
  userId: string,
  requestIds: string[],
  ipAddress?: string
): Promise<{ results: Array<{ requestId: string; success: boolean; message: string }> }> {
  const results: Array<{ requestId: string; success: boolean; message: string }> = [];

  for (const requestId of requestIds) {
    try {
      const result = await sendAutoRemovalRequest(userId, requestId, ipAddress);
      results.push({ requestId, success: result.success, message: result.message });
    } catch (error: any) {
      results.push({ requestId, success: false, message: error.message || "Unknown error" });
    }
  }

  await logAuditEvent(userId, "bulk_auto_removal", "removal_request", null, null, null, {
    totalRequests: requestIds.length,
    successful: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
  }, ipAddress);

  return { results };
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
  frequencyDays: number,
  options?: {
    autoReRemoval?: boolean;
    notifyOnNewExposure?: boolean;
    notifyOnReAppearance?: boolean;
    notifyOnComplianceDeadline?: boolean;
    monitoringMode?: string;
    darkWebMonitoring?: boolean;
  }
) {
  const [existing] = await db
    .select()
    .from(monitoringSchedules)
    .where(and(eq(monitoringSchedules.userId, userId), eq(monitoringSchedules.isActive, true)));

  const nextScanDate = new Date();
  nextScanDate.setDate(nextScanDate.getDate() + frequencyDays);

  const monitoringValues = {
    vaultProfileId,
    frequencyDays,
    nextScanDate,
    isActive: true,
    autoReRemoval: options?.autoReRemoval ?? false,
    notifyOnNewExposure: options?.notifyOnNewExposure ?? true,
    notifyOnReAppearance: options?.notifyOnReAppearance ?? true,
    notifyOnComplianceDeadline: options?.notifyOnComplianceDeadline ?? true,
    monitoringMode: options?.monitoringMode ?? "periodic",
    darkWebMonitoring: options?.darkWebMonitoring ?? false,
    updatedAt: new Date(),
  };

  if (existing) {
    const [updated] = await db
      .update(monitoringSchedules)
      .set(monitoringValues)
      .where(eq(monitoringSchedules.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(monitoringSchedules)
    .values({
      userId,
      ...monitoringValues,
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

const US_STATE_JURISDICTIONS: Record<string, string> = {
  "california": "CCPA", "ca": "CCPA",
  "virginia": "VCDPA", "va": "VCDPA",
  "colorado": "CPA", "co": "CPA",
  "connecticut": "CTDPA", "ct": "CTDPA",
  "utah": "UCPA", "ut": "UCPA",
};

const COUNTRY_JURISDICTIONS: Record<string, string> = {
  "us": "CCPA", "united states": "CCPA",
  "uk": "GDPR", "united kingdom": "GDPR", "gb": "GDPR",
  "ca": "PIPEDA", "canada": "PIPEDA",
  "br": "LGPD", "brazil": "LGPD",
  "de": "GDPR", "germany": "GDPR",
  "fr": "GDPR", "france": "GDPR",
  "it": "GDPR", "italy": "GDPR",
  "es": "GDPR", "spain": "GDPR",
  "nl": "GDPR", "netherlands": "GDPR",
  "be": "GDPR", "belgium": "GDPR",
  "at": "GDPR", "austria": "GDPR",
  "ie": "GDPR", "ireland": "GDPR",
  "pt": "GDPR", "portugal": "GDPR",
  "se": "GDPR", "sweden": "GDPR",
  "pl": "GDPR", "poland": "GDPR",
};

export function detectJurisdiction(userLocation?: string, brokerCountries?: string[]): string {
  if (!userLocation) {
    const hasBrokerEU = brokerCountries?.some((c) => ["EU", "UK", "GB"].includes(c.toUpperCase()));
    if (hasBrokerEU) return "GDPR";
    return "CCPA";
  }

  const loc = userLocation.toLowerCase().trim();

  for (const [key, jurisdiction] of Object.entries(US_STATE_JURISDICTIONS)) {
    if (loc.includes(key)) return jurisdiction;
  }

  for (const [key, jurisdiction] of Object.entries(COUNTRY_JURISDICTIONS)) {
    if (loc.includes(key)) return jurisdiction;
  }

  const hasBrokerEU = brokerCountries?.some((c) => ["EU", "UK", "GB"].includes(c.toUpperCase()));
  if (hasBrokerEU) return "GDPR";

  return "CCPA";
}

export async function getComplianceDashboard(userId: string) {
  const requests = await db
    .select()
    .from(removalRequests)
    .where(eq(removalRequests.userId, userId));

  const now = new Date();
  const REGULATORY_DEADLINES: Record<string, number> = {
    "CCPA": 45,
    "CPRA": 45,
    "GDPR": 30,
    "VCDPA": 45,
    "CPA": 45,
    "CTDPA": 45,
    "UCPA": 45,
    "PIPEDA": 30,
    "LGPD": 15,
  };
  const ccpaDeadlineDays = 45;
  const gdprDeadlineDays = 30;

  let totalRequests = requests.length;
  let pendingCompliance = 0;
  let compliant = 0;
  let overdueCount = 0;
  let nonCompliantCount = 0;
  let avgResponseDays = 0;
  let responseTimesSum = 0;
  let responseCount = 0;

  const jurisdictionStats: Record<string, { total: number; compliant: number; overdue: number; avgDays: number }> = {};
  const overdueRequests: Array<{ requestId: string; brokerId: string; daysPastDeadline: number; jurisdiction: string }> = [];

  for (const req of requests) {
    const jurisdiction = req.jurisdictionApplied || "CCPA";
    if (!jurisdictionStats[jurisdiction]) {
      jurisdictionStats[jurisdiction] = { total: 0, compliant: 0, overdue: 0, avgDays: 0 };
    }
    jurisdictionStats[jurisdiction].total++;

    if (req.confirmedRemovedAt) {
      compliant++;
      jurisdictionStats[jurisdiction].compliant++;
      if (req.requestSentAt) {
        const days = Math.floor((req.confirmedRemovedAt.getTime() - req.requestSentAt.getTime()) / (1000 * 60 * 60 * 24));
        responseTimesSum += days;
        responseCount++;
      }
    } else if (req.requestSentAt) {
      const deadlineDays = REGULATORY_DEADLINES[jurisdiction] ?? ccpaDeadlineDays;
      const deadline = new Date(req.requestSentAt);
      deadline.setDate(deadline.getDate() + deadlineDays);

      if (now > deadline) {
        overdueCount++;
        jurisdictionStats[jurisdiction].overdue++;
        const daysPast = Math.floor((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24));
        overdueRequests.push({
          requestId: req.id,
          brokerId: req.brokerId,
          daysPastDeadline: daysPast,
          jurisdiction,
        });
        if (req.nonComplianceReported) {
          nonCompliantCount++;
        }
      } else {
        pendingCompliance++;
      }
    } else {
      pendingCompliance++;
    }
  }

  if (responseCount > 0) {
    avgResponseDays = Math.round(responseTimesSum / responseCount);
  }

  const complianceRate = totalRequests > 0 ? Math.round((compliant / totalRequests) * 100) : 0;
  const overdueRate = totalRequests > 0 ? Math.round((overdueCount / totalRequests) * 100) : 0;

  return {
    totalRequests,
    compliant,
    pendingCompliance,
    overdueCount,
    nonCompliantCount,
    complianceRate,
    overdueRate,
    avgResponseDays,
    jurisdictionStats,
    overdueRequests: overdueRequests.sort((a, b) => b.daysPastDeadline - a.daysPastDeadline).slice(0, 20),
    regulatoryFrameworks: [
      { name: "CCPA", deadlineDays: 45, description: "California Consumer Privacy Act", region: "California, US" },
      { name: "GDPR", deadlineDays: 30, description: "General Data Protection Regulation", region: "EU/EEA/UK" },
      { name: "CPRA", deadlineDays: 45, description: "California Privacy Rights Act", region: "California, US" },
      { name: "VCDPA", deadlineDays: 45, description: "Virginia Consumer Data Protection Act", region: "Virginia, US" },
      { name: "CPA", deadlineDays: 45, description: "Colorado Privacy Act", region: "Colorado, US" },
      { name: "CTDPA", deadlineDays: 45, description: "Connecticut Data Privacy Act", region: "Connecticut, US" },
      { name: "UCPA", deadlineDays: 45, description: "Utah Consumer Privacy Act", region: "Utah, US" },
      { name: "PIPEDA", deadlineDays: 30, description: "Personal Information Protection and Electronic Documents Act", region: "Canada" },
      { name: "LGPD", deadlineDays: 15, description: "Lei Geral de Prote\u00E7\u00E3o de Dados", region: "Brazil" },
    ],
  };
}
