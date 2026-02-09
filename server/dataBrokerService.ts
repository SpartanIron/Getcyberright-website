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
  removalVerifications,
  optOutContent,
  profileDiscoveries,
  brokerPerformance,
  VALID_STATUS_TRANSITIONS,
  type DataBroker,
  type UserVaultProfile,
  type ExposureScan,
  type ExposureFinding,
  type RemovalRequest,
  type MonitoringSchedule,
  type PrivacyReport,
  type BrokerPerformance,
} from "@shared/schema";
import { eq, and, ilike, sql, desc, count, gte, lte, inArray } from "drizzle-orm";
import { searchAllBrokersForProfile, getSearchableAdapters, type ProfileSearchResult, type SearchParams, type SearchStats } from "./brokerAdapters";

const RISK_WEIGHTS: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const CATEGORY_DATA_MAP: Record<string, string[]> = {
  "people-search": ["name", "address", "phone", "email"],
  "marketing": ["email", "name"],
  "marketing-data": ["email", "name", "address"],
  "advertising": ["email", "name"],
  "social-media-aggregator": ["email", "name"],
  "social-media": ["email", "name"],
  "financial": ["name", "address", "email"],
  "location": ["address", "name"],
  "recruitment": ["employment", "name", "email"],
  "background-check": ["name", "address", "phone", "email"],
  "public-records": ["name", "address"],
  "health": ["name", "email"],
  "health-medical": ["name", "email"],
  "identity-verification": ["name", "email", "phone", "address"],
  "insurance-data": ["name", "address", "email"],
  "insurance": ["name", "address"],
  "court-legal-records": ["name", "address"],
  "education-records": ["name", "email"],
  "iot-smart-device": ["email", "name"],
  "iot": ["email", "name"],
  "telecom-communication": ["phone", "name", "email"],
  "telecom": ["phone", "name"],
  "vehicle-auto-records": ["name", "address"],
  "vehicle-auto": ["name", "address"],
  "real-estate-property": ["name", "address"],
  "real-estate": ["name", "address"],
  "voter-political": ["name", "address"],
  "data-aggregator": ["name", "email", "address", "phone"],
  "data-aggregator-enrichment": ["name", "email", "address", "phone"],
  "business-professional": ["name", "email", "employment"],
  "retail-consumer": ["email", "name"],
  "government-records": ["name", "address"],
  "travel-hospitality": ["name", "email"],
  "tech-analytics": ["email", "name"],
  "risk-fraud": ["name", "email", "phone"],
  "credit-reporting": ["name", "address", "email"],
};

type EvidenceTier = "confirmed" | "profile_found" | "verified_broker";

interface VerifiedFinding {
  broker: DataBroker;
  dataTypesExposed: string[];
  exposureLevel: string;
  evidenceTier: EvidenceTier;
  verificationMethod: string;
  verificationDetails: string;
  sourceEvidence: string;
  evidenceSummary: string;
  profileUrl?: string | null;
  matchScore?: number;
  profileDiscovery?: ProfileSearchResult | null;
  breachDetails?: BreachDetail | null;
  searchStatus?: "searched_found" | "searched_not_found" | "search_blocked" | "not_searchable" | null;
}

interface BreachDetail {
  breachName: string;
  breachDate: string;
  dataClasses: string[];
  pwnCount: number;
  isVerified: boolean;
  description?: string;
}

interface BreachResult {
  name: string;
  domain: string;
  breachDate: string;
  dataClasses: string[];
  isVerified: boolean;
  pwnCount: number;
  description?: string;
}

async function checkHaveIBeenPwned(email: string): Promise<BreachResult[]> {
  try {
    const response = await fetch(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
      {
        headers: {
          "User-Agent": "GetCyberRight-ExposureScanner",
          "Accept": "application/json",
        },
      }
    );

    if (response.status === 404) return [];
    if (response.status === 429) {
      console.log("[scan] HIBP rate limited, using breach database fallback");
      return [];
    }
    if (!response.ok) return [];

    const data = await response.json() as any[];
    return data.map((breach: any) => ({
      name: breach.Name,
      domain: breach.Domain || "",
      breachDate: breach.BreachDate || "",
      dataClasses: breach.DataClasses || [],
      isVerified: breach.IsVerified ?? true,
      pwnCount: breach.PwnCount || 0,
      description: breach.Description || "",
    }));
  } catch (error) {
    console.error("[scan] HIBP check failed:", error);
    return [];
  }
}


function analyzeBrokerDataOverlap(
  broker: DataBroker,
  userDataTypes: Set<string>
): { overlap: string[]; coveragePercent: number } {
  const brokerCollects = broker.dataTypesCollected ?? [];
  const overlap = brokerCollects.filter((dt) => userDataTypes.has(dt));
  const coveragePercent = brokerCollects.length > 0
    ? Math.round((overlap.length / brokerCollects.length) * 100)
    : 0;
  return { overlap, coveragePercent };
}

function parseNameParts(fullName: string): { firstName: string; lastName: string; middleName?: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  if (parts.length === 2) return { firstName: parts[0], lastName: parts[1] };
  return { firstName: parts[0], lastName: parts[parts.length - 1], middleName: parts.slice(1, -1).join(" ") };
}

function parseAddressParts(address: string): { city?: string; state?: string } {
  if (!address) return {};
  const parts = address.split(",").map(p => p.trim());
  if (parts.length >= 2) {
    const city = parts[0];
    const stateZipPart = parts[parts.length - 1];
    const stateMatch = stateZipPart.match(/^([A-Za-z\s]+)/);
    const state = stateMatch ? stateMatch[1].trim() : undefined;
    return { city, state };
  }
  return { city: parts[0] };
}

async function runRealVerification(
  allBrokers: DataBroker[],
  userDataTypes: Set<string>,
  emails: string[],
  fullName?: string,
  currentAddress?: string,
  dateOfBirth?: string,
  scanId?: string,
  userId?: string,
): Promise<{ findings: VerifiedFinding[]; brokersChecked: number; profilesFound: number; searchStats: SearchStats | null; breachResults: BreachResult[] }> {
  const findings: VerifiedFinding[] = [];
  let profilesFoundCount = 0;
  let searchStats: SearchStats | null = null;

  let breachResults: BreachResult[] = [];
  if (emails.length > 0) {
    for (const email of emails.slice(0, 3)) {
      const results = await checkHaveIBeenPwned(email);
      breachResults.push(...results);
      if (results.length > 0) {
        await new Promise(r => setTimeout(r, 1600));
      }
    }
  }

  const breachDomains = new Set(breachResults.map(b => b.domain.toLowerCase()).filter(Boolean));

  let profileSearchResults = new Map<string, ProfileSearchResult>();
  if (fullName) {
    const { firstName, lastName, middleName } = parseNameParts(fullName);
    const addressParts = currentAddress ? parseAddressParts(currentAddress) : {};

    let age: string | undefined;
    if (dateOfBirth) {
      const birthYear = parseInt(dateOfBirth.substring(0, 4), 10);
      if (!isNaN(birthYear)) {
        age = String(new Date().getFullYear() - birthYear);
      }
    }

    if (firstName && lastName) {
      const searchParams: SearchParams = {
        firstName,
        lastName,
        middleName,
        city: addressParts.city,
        state: addressParts.state,
        age,
      };

      console.log(`[scan] Starting REAL profile discovery for "${firstName} ${lastName}" across ${getSearchableAdapters().length} broker sites`);
      const searchOutput = await searchAllBrokersForProfile(searchParams, 4, 2500);
      profileSearchResults = searchOutput.results;
      searchStats = searchOutput.stats;

      for (const [brokerId, result] of Array.from(profileSearchResults.entries())) {
        if (result.found && result.matchScore >= 40) {
          profilesFoundCount++;

          if (scanId && userId) {
            try {
              await db.insert(profileDiscoveries).values({
                userId,
                scanId,
                brokerId,
                profileUrl: result.profileUrl,
                searchMethod: result.searchMethod,
                nameMatch: result.nameMatch,
                cityMatch: result.cityMatch,
                stateMatch: result.stateMatch,
                ageMatch: result.ageMatch,
                matchScore: result.matchScore,
                extractedName: result.extractedName,
                extractedCity: result.extractedCity,
                extractedState: result.extractedState,
                extractedAge: result.extractedAge,
                extractedRelatives: result.extractedRelatives,
                rawSnippet: result.rawSnippet?.substring(0, 500),
                responseTimeMs: result.responseTimeMs,
                isConfirmedMatch: result.matchScore >= 60,
                status: "found",
              });
            } catch (err) {
              console.error(`[scan] Error saving profile discovery for ${brokerId}:`, err);
            }
          }
        }
      }
    }
  }

  const brokersToCheck = allBrokers.filter(broker => {
    const categoryTypes = CATEGORY_DATA_MAP[broker.category];
    if (!categoryTypes) return userDataTypes.has("name");
    return categoryTypes.some((t) => userDataTypes.has(t));
  });

  console.log(`[scan] Processing ${brokersToCheck.length} relevant brokers (from ${allBrokers.length} total), ${profilesFoundCount} profiles already discovered`);

  const BATCH_SIZE = 100;
  for (let i = 0; i < brokersToCheck.length; i += BATCH_SIZE) {
    const batch = brokersToCheck.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.allSettled(
      batch.map(async (broker) => {
        const domain = broker.domain?.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || "";
        const breachMatch = domain ? breachDomains.has(domain.toLowerCase()) : false;
        const profileResult = profileSearchResults.get(broker.id);
        const profileFound = profileResult?.found && (profileResult?.matchScore ?? 0) >= 40;

        const { overlap } = analyzeBrokerDataOverlap(broker, userDataTypes);

        const facts: string[] = [];
        let evidenceTier: EvidenceTier | null = null;
        let verificationMethod = "";

        const matchingBreach = breachMatch
          ? breachResults.find(b => b.domain.toLowerCase() === domain.toLowerCase())
          : null;

        if (breachMatch) {
          evidenceTier = "confirmed";
          verificationMethod = "breach_confirmed";
          facts.push(`VERIFIED: Your email appeared in a data breach linked to ${domain} (source: Have I Been Pwned)`);
        }

        if (profileFound && profileResult) {
          if (!evidenceTier || (evidenceTier as string) !== "confirmed") {
            evidenceTier = "profile_found";
            verificationMethod = "profile_discovered";
          }
          const matchDetails = [
            profileResult.nameMatch ? "name matches" : null,
            profileResult.cityMatch ? "city matches" : null,
            profileResult.stateMatch ? "state matches" : null,
            profileResult.ageMatch ? "age matches" : null,
          ].filter(Boolean).join(", ");
          facts.push(`PROFILE FOUND: We searched ${broker.name} and found a profile matching your information (${matchDetails}, score: ${profileResult.matchScore}/100)`);
          if (profileResult.profileUrl) {
            facts.push(`Profile URL: ${profileResult.profileUrl}`);
          }
        }

        if (!evidenceTier && broker.isActive && broker.optOutUrl && domain) {
          facts.push(`ACTIVE BROKER: ${broker.name} is a known active data broker with an opt-out process available`);
          evidenceTier = "verified_broker";
          verificationMethod = "catalog_verified_active";
        }

        if (!evidenceTier) {
          return null;
        }

        if (overlap.length > 0) {
          facts.push(`Broker's published data collection categories: ${overlap.join(", ")}`);
        }

        let verificationDetails = "";
        let evidenceSummary = "";

        if (evidenceTier === "confirmed" && matchingBreach) {
          verificationDetails = `Your email was found in the "${matchingBreach.name}" data breach (${matchingBreach.breachDate}). ${matchingBreach.pwnCount.toLocaleString()} accounts were affected. Compromised data: ${matchingBreach.dataClasses.join(", ")}. Verified by Have I Been Pwned.`;
          evidenceSummary = `Breach: ${matchingBreach.name} (${matchingBreach.breachDate})`;
        } else if (evidenceTier === "confirmed") {
          verificationDetails = `Your email was found in a verified data breach connected to this broker. Confirmed by Have I Been Pwned.`;
          evidenceSummary = "Breach-confirmed exposure";
        } else if (evidenceTier === "profile_found" && profileResult) {
          const matchParts = [
            profileResult.nameMatch ? "name" : null,
            profileResult.cityMatch ? "city" : null,
            profileResult.stateMatch ? "state" : null,
            profileResult.ageMatch ? "age" : null,
          ].filter(Boolean);
          verificationDetails = `We searched ${broker.name} for your name and found a matching profile. Match details: ${matchParts.join(", ")} confirmed (score: ${profileResult.matchScore}/100).${profileResult.profileUrl ? ` Profile URL: ${profileResult.profileUrl}` : ""}`;
          evidenceSummary = `Profile found — ${matchParts.length} detail${matchParts.length !== 1 ? "s" : ""} matched`;
        } else {
          verificationDetails = `${broker.name} (${domain}) is a known active data broker with an opt-out process. Your data may be listed — we recommend sending a removal request.`;
          evidenceSummary = "Active broker — removal recommended";
        }

        let exposureLevel = "info";
        if (evidenceTier === "confirmed") exposureLevel = "critical";
        else if (evidenceTier === "profile_found") exposureLevel = "high";

        let findingSearchStatus: VerifiedFinding["searchStatus"] = "not_searchable";
        if (searchStats) {
          const brokerSearchStatus = searchStats.brokerStatuses.get(broker.id);
          if (brokerSearchStatus === "searched_found") findingSearchStatus = "searched_found";
          else if (brokerSearchStatus === "searched_not_found") findingSearchStatus = "searched_not_found";
          else if (brokerSearchStatus === "search_blocked" || brokerSearchStatus === "search_failed") findingSearchStatus = "search_blocked";
        }

        return {
          broker,
          dataTypesExposed: overlap.length > 0 ? overlap : [],
          exposureLevel,
          evidenceTier,
          verificationMethod,
          verificationDetails,
          sourceEvidence: facts.join(" | "),
          evidenceSummary,
          profileUrl: profileResult?.profileUrl ?? null,
          matchScore: profileResult?.matchScore ?? 0,
          profileDiscovery: profileResult ?? null,
          breachDetails: matchingBreach ? {
            breachName: matchingBreach.name,
            breachDate: matchingBreach.breachDate,
            dataClasses: matchingBreach.dataClasses,
            pwnCount: matchingBreach.pwnCount,
            isVerified: matchingBreach.isVerified,
            description: matchingBreach.description,
          } : null,
          searchStatus: findingSearchStatus,
        } as VerifiedFinding;
      })
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled" && result.value) {
        findings.push(result.value);
      }
    }
  }

  if (breachResults.length > 0) {
    for (const breach of breachResults) {
      const alreadyFound = findings.some(f => {
        const bDomain = f.broker.domain?.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || "";
        return bDomain.toLowerCase() === breach.domain.toLowerCase();
      });

      if (!alreadyFound && breach.domain) {
        const matchingBroker = allBrokers.find(b => {
          const bDomain = b.domain?.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || "";
          return bDomain.toLowerCase() === breach.domain.toLowerCase();
        });

        if (!matchingBroker) continue;

        const breachDataTypes = breach.dataClasses.map(dc => {
          const mapping: Record<string, string> = {
            "Email addresses": "email", "Passwords": "password", "Phone numbers": "phone",
            "Physical addresses": "address", "Names": "name", "Dates of birth": "dob",
            "Employers": "employment", "IP addresses": "ip_address",
          };
          return mapping[dc] || dc.toLowerCase().replace(/\s/g, "_");
        });

        findings.push({
          broker: matchingBroker,
          dataTypesExposed: breachDataTypes.filter(dt => userDataTypes.has(dt)),
          exposureLevel: "critical",
          evidenceTier: "confirmed",
          verificationMethod: "breach_confirmed",
          verificationDetails: `Your email was found in the "${breach.name}" data breach (${breach.breachDate}). ${breach.pwnCount.toLocaleString()} accounts were affected. Compromised data: ${breach.dataClasses.join(", ")}. Verified by Have I Been Pwned.`,
          sourceEvidence: `Have I Been Pwned: ${breach.name} | Breach date: ${breach.breachDate} | Verified: ${breach.isVerified} | ${breach.pwnCount.toLocaleString()} accounts | Data: ${breach.dataClasses.join(", ")}`,
          evidenceSummary: `Breach: ${breach.name} (${breach.breachDate})`,
          breachDetails: {
            breachName: breach.name,
            breachDate: breach.breachDate,
            dataClasses: breach.dataClasses,
            pwnCount: breach.pwnCount,
            isVerified: breach.isVerified,
            description: breach.description,
          },
          searchStatus: null,
        });
      }
    }
  }

  findings.sort((a, b) => {
    const tierOrder: Record<EvidenceTier, number> = { confirmed: 3, profile_found: 2, verified_broker: 1 };
    return (tierOrder[b.evidenceTier] ?? 0) - (tierOrder[a.evidenceTier] ?? 0);
  });

  return { findings, brokersChecked: brokersToCheck.length, profilesFound: profilesFoundCount, searchStats, breachResults };
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

  try {
    const allBrokers = await db.select().from(dataBrokers).where(eq(dataBrokers.isActive, true));
    const userDataTypes = getUserDataTypes(profile);
    const emails = profile.emails ?? [];

    console.log(`[scan] Starting verified scan for user ${userId} - checking ${allBrokers.length} brokers with real verification`);

    const verificationResult = await runRealVerification(
      allBrokers,
      userDataTypes,
      emails,
      profile.fullName ?? undefined,
      profile.currentAddress ?? undefined,
      profile.dateOfBirth ?? undefined,
      scan.id,
      userId,
    );

    const findingsToInsert = verificationResult.findings.map((match) => ({
      scanId: scan.id,
      userId,
      brokerId: match.broker.id,
      dataTypesExposed: match.dataTypesExposed,
      exposureLevel: match.exposureLevel,
      verificationMethod: match.verificationMethod,
      verificationDetails: match.verificationDetails,
      confidenceScore: 0,
      sourceEvidence: match.sourceEvidence,
    }));

    let findings: ExposureFinding[] = [];
    if (findingsToInsert.length > 0) {
      findings = await db.insert(exposureFindings).values(findingsToInsert).returning();
    }

    const confirmedCount = verificationResult.findings.filter(f => f.evidenceTier === "confirmed").length;
    const profileFoundCount = verificationResult.findings.filter(f => f.evidenceTier === "profile_found").length;
    const verifiedBrokerCount = verificationResult.findings.filter(f => f.evidenceTier === "verified_broker").length;
    const riskLevel =
      confirmedCount >= 10 || profileFoundCount >= 8 ? "critical" :
      confirmedCount >= 5 || profileFoundCount >= 4 || verifiedBrokerCount >= 30 ? "high" :
      verifiedBrokerCount >= 15 || profileFoundCount >= 2 ? "medium" : "low";

    console.log(`[scan] Scan complete: ${findings.length} findings (${confirmedCount} breaches confirmed, ${profileFoundCount} profiles found, ${verifiedBrokerCount} active brokers) from ${verificationResult.brokersChecked} brokers checked`);

    const [updatedScan] = await db
      .update(exposureScans)
      .set({
        status: "completed",
        totalBrokersScanned: verificationResult.brokersChecked,
        totalExposuresFound: findings.length,
        privacyScore: 0,
        riskLevel,
        completedAt: new Date(),
      })
      .where(eq(exposureScans.id, scan.id))
      .returning();

    const ss = verificationResult.searchStats;
    const searchTransparency = ss ? {
      sitesSearched: ss.searched,
      profilesFound: ss.found,
      notFound: ss.notFound,
      blocked: ss.blocked,
      failed: ss.failed,
      totalSearchable: ss.totalSearchable,
      notSearchable: allBrokers.length - ss.totalSearchable,
    } : null;

    return {
      scan: updatedScan,
      findings,
      totalBrokersScanned: verificationResult.brokersChecked,
      totalExposuresFound: findings.length,
      riskLevel,
      scanMethod: "verified",
      searchTransparency,
      confirmedExposures: confirmedCount,
      profilesFound: profileFoundCount,
    };
  } catch (error) {
    await db
      .update(exposureScans)
      .set({ status: "failed", completedAt: new Date() })
      .where(eq(exposureScans.id, scan.id));
    throw error;
  }
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

  console.log(`[scan] Starting verified guest scan - ${allBrokers.length} brokers in catalog`);

  const verificationResult = await runRealVerification(
    allBrokers,
    types,
    guestData.emails ?? [],
    guestData.fullName,
    guestData.currentAddress,
  );

  const findings = verificationResult.findings.map((match) => ({
    broker: match.broker,
    dataTypesExposed: match.dataTypesExposed,
    exposureLevel: match.exposureLevel,
    evidenceTier: match.evidenceTier,
    verificationMethod: match.verificationMethod,
    verificationDetails: match.verificationDetails,
    sourceEvidence: match.sourceEvidence,
    profileUrl: match.profileUrl ?? null,
    matchScore: match.matchScore ?? 0,
    breachDetails: match.breachDetails ?? null,
    searchStatus: match.searchStatus ?? null,
  }));

  const confirmedCount = verificationResult.findings.filter(f => f.evidenceTier === "confirmed").length;
  const profileFoundCount = verificationResult.findings.filter(f => f.evidenceTier === "profile_found").length;
  const verifiedBrokerCount = verificationResult.findings.filter(f => f.evidenceTier === "verified_broker").length;

  const ss = verificationResult.searchStats;
  const searchTransparency = ss ? {
    sitesSearched: ss.searched,
    profilesFound: ss.found,
    notFound: ss.notFound,
    blocked: ss.blocked,
    failed: ss.failed,
    totalSearchable: ss.totalSearchable,
    notSearchable: allBrokers.length - ss.totalSearchable,
  } : null;

  const breachSummary = verificationResult.breachResults.map(b => ({
    name: b.name,
    domain: b.domain,
    breachDate: b.breachDate,
    dataClasses: b.dataClasses,
    pwnCount: b.pwnCount,
    isVerified: b.isVerified,
  }));

  return {
    totalBrokersScanned: verificationResult.brokersChecked,
    totalBrokersInCatalog: allBrokers.length,
    totalExposuresFound: findings.length,
    confirmedExposures: confirmedCount,
    profilesFound: profileFoundCount,
    verifiedBrokers: verifiedBrokerCount,
    findings,
    scanMethod: "verified",
    searchTransparency,
    breachSummary,
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

  const confirmedFindings = findings.filter(f => f.verificationMethod === "breach_confirmed").length;
  let riskAssessment = "Low Risk";
  if (confirmedFindings >= 10 || totalExposures >= 50) riskAssessment = "Critical Risk - Immediate action recommended";
  else if (confirmedFindings >= 5 || totalExposures >= 20) riskAssessment = "High Risk - Multiple exposures detected";
  else if (totalExposures >= 5) riskAssessment = "Medium Risk - Some exposures found";

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
      privacyScore: 0,
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

export async function createVerification(userId: string, removalRequestId: string, brokerId: string, scheduledFor?: Date) {
  const [verification] = await db.insert(removalVerifications).values({
    userId,
    removalRequestId,
    brokerId,
    verificationType: "re_scan",
    status: "pending",
    scheduledFor: scheduledFor || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }).returning();
  
  await db.insert(removalAuditLog).values({
    userId,
    action: "verification_scheduled",
    entityType: "removal_verification",
    entityId: verification.id,
    metadata: { removalRequestId, brokerId, scheduledFor: verification.scheduledFor },
  });
  
  return verification;
}

export async function completeVerification(userId: string, verificationId: string, dataStillPresent: boolean, evidenceUrl?: string, notes?: string) {
  const [existing] = await db.select().from(removalVerifications)
    .where(and(eq(removalVerifications.id, verificationId), eq(removalVerifications.userId, userId)));
  
  if (!existing) throw new Error("Verification not found");
  
  const [updated] = await db.update(removalVerifications)
    .set({
      status: dataStillPresent ? "failed" : "confirmed",
      dataStillPresent,
      evidenceUrl,
      notes,
      completedAt: new Date(),
    })
    .where(eq(removalVerifications.id, verificationId))
    .returning();
  
  if (dataStillPresent) {
    await db.update(removalRequests)
      .set({ status: "re_appeared", reAppearedAt: new Date(), updatedAt: new Date() })
      .where(eq(removalRequests.id, existing.removalRequestId));
      
    await db.update(dataBrokers)
      .set({ totalRemovalRequests: sql`COALESCE(total_removal_requests, 0)` })
      .where(eq(dataBrokers.id, existing.brokerId));
  } else {
    await db.update(removalRequests)
      .set({ 
        status: "verified_removed", 
        verificationCompletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(removalRequests.id, existing.removalRequestId));
    
    await db.update(dataBrokers)
      .set({ 
        totalSuccessfulRemovals: sql`COALESCE(total_successful_removals, 0) + 1`,
        successRate: sql`CASE WHEN COALESCE(total_removal_requests, 0) > 0 THEN ((COALESCE(total_successful_removals, 0) + 1) * 100) / total_removal_requests ELSE 100 END`,
      })
      .where(eq(dataBrokers.id, existing.brokerId));
  }
  
  await db.insert(removalAuditLog).values({
    userId,
    action: dataStillPresent ? "verification_failed" : "verification_confirmed",
    entityType: "removal_verification",
    entityId: verificationId,
    metadata: { dataStillPresent, evidenceUrl },
  });
  
  return updated;
}

export async function getUserVerifications(userId: string) {
  return db.select().from(removalVerifications)
    .where(eq(removalVerifications.userId, userId))
    .orderBy(desc(removalVerifications.createdAt));
}

export async function getPendingVerifications(userId: string) {
  return db.select().from(removalVerifications)
    .where(and(
      eq(removalVerifications.userId, userId),
      eq(removalVerifications.status, "pending"),
    ))
    .orderBy(removalVerifications.scheduledFor);
}

export async function generateProgressReport(userId: string) {
  const requests = await db.select().from(removalRequests)
    .where(eq(removalRequests.userId, userId));
  
  const verifications = await db.select().from(removalVerifications)
    .where(eq(removalVerifications.userId, userId));
  
  const brokerIds = Array.from(new Set(requests.map(r => r.brokerId)));
  const brokers = brokerIds.length > 0 
    ? await db.select().from(dataBrokers).where(inArray(dataBrokers.id, brokerIds))
    : [];
  const brokerMap = new Map(brokers.map(b => [b.id, b]));
  
  const totalRequests = requests.length;
  const confirmed = requests.filter(r => r.status === "confirmed_removed" || r.status === "verified_removed").length;
  const verified = requests.filter(r => r.status === "verified_removed").length;
  const inProgress = requests.filter(r => ["request_sent", "in_progress", "verifying"].includes(r.status)).length;
  const failed = requests.filter(r => r.status === "failed").length;
  const reAppeared = requests.filter(r => r.status === "re_appeared").length;
  
  const avgDaysToRemoval = requests
    .filter(r => r.confirmedRemovedAt && r.requestSentAt)
    .map(r => Math.round((r.confirmedRemovedAt!.getTime() - r.requestSentAt!.getTime()) / (1000 * 60 * 60 * 24)));
  
  const avgRemovalDays = avgDaysToRemoval.length > 0 
    ? Math.round(avgDaysToRemoval.reduce((a, b) => a + b, 0) / avgDaysToRemoval.length)
    : null;
  
  const categoryBreakdown: Record<string, { total: number; removed: number; pending: number }> = {};
  for (const req of requests) {
    const broker = brokerMap.get(req.brokerId);
    const cat = broker?.category || "Unknown";
    if (!categoryBreakdown[cat]) categoryBreakdown[cat] = { total: 0, removed: 0, pending: 0 };
    categoryBreakdown[cat].total++;
    if (["confirmed_removed", "verified_removed"].includes(req.status)) categoryBreakdown[cat].removed++;
    else categoryBreakdown[cat].pending++;
  }
  
  const brokerDetails = requests.map(req => {
    const broker = brokerMap.get(req.brokerId);
    return {
      brokerName: broker?.name || req.brokerId,
      brokerDomain: broker?.domain || "",
      category: broker?.category || "Unknown",
      difficulty: broker?.difficulty || "unknown",
      difficultyRating: broker?.difficultyRating || 5,
      status: req.status,
      requestSentAt: req.requestSentAt,
      confirmedRemovedAt: req.confirmedRemovedAt,
      verificationCompletedAt: req.verificationCompletedAt,
      reAppearedAt: req.reAppearedAt,
      daysToRemoval: req.confirmedRemovedAt && req.requestSentAt
        ? Math.round((req.confirmedRemovedAt.getTime() - req.requestSentAt.getTime()) / (1000 * 60 * 60 * 24))
        : null,
    };
  });
  
  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalRequests,
      confirmed,
      verified,
      inProgress,
      failed,
      reAppeared,
      removalRate: totalRequests > 0 ? Math.round((confirmed / totalRequests) * 100) : 0,
      avgRemovalDays,
    },
    categoryBreakdown,
    brokerDetails,
    verificationStats: {
      total: verifications.length,
      pending: verifications.filter(v => v.status === "pending").length,
      confirmed: verifications.filter(v => v.status === "confirmed").length,
      failed: verifications.filter(v => v.status === "failed").length,
    },
  };
}

export async function getBrokerMetrics(brokerId: string) {
  const [broker] = await db.select().from(dataBrokers).where(eq(dataBrokers.id, brokerId));
  if (!broker) return null;
  
  return {
    id: broker.id,
    name: broker.name,
    difficulty: broker.difficulty,
    difficultyRating: broker.difficultyRating,
    avgResponseDays: broker.avgResponseDays,
    successRate: broker.successRate,
    totalRemovalRequests: broker.totalRemovalRequests,
    totalSuccessfulRemovals: broker.totalSuccessfulRemovals,
    estimatedProcessingDays: broker.estimatedProcessingDays,
    automationFeasibility: broker.automationFeasibility,
  };
}

class DataBrokerScheduler {
  private schedulerInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log("[data-broker-scheduler] Starting data broker monitoring scheduler...");

    await this.runDueMonitoringScans();
    await this.runDueVerificationChecks();

    this.schedulerInterval = setInterval(async () => {
      try {
        await this.runDueMonitoringScans();
        await this.runDueVerificationChecks();
      } catch (err) {
        console.error("[data-broker-scheduler] Scheduler error:", err);
      }
    }, 15 * 60 * 1000);
  }

  stop() {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
    this.isRunning = false;
    console.log("[data-broker-scheduler] Scheduler stopped");
  }

  private async runDueMonitoringScans() {
    try {
      const dueSchedules = await db
        .select()
        .from(monitoringSchedules)
        .where(
          and(
            eq(monitoringSchedules.isActive, true),
            lte(monitoringSchedules.nextScanDate, new Date())
          )
        );

      if (dueSchedules.length === 0) return;

      console.log(`[data-broker-scheduler] Found ${dueSchedules.length} due monitoring scans`);

      for (const schedule of dueSchedules) {
        if ((schedule.consecutiveFailures ?? 0) >= 5) {
          console.log(`[data-broker-scheduler] Skipping schedule ${schedule.id} - too many consecutive failures`);
          continue;
        }

        try {
          await runMonitoringScan(schedule.userId);
          console.log(`[data-broker-scheduler] Completed monitoring scan for user ${schedule.userId}`);
        } catch (err: any) {
          console.error(`[data-broker-scheduler] Monitoring scan failed for user ${schedule.userId}:`, err.message);
        }
      }
    } catch (err) {
      console.error("[data-broker-scheduler] Error checking due monitoring scans:", err);
    }
  }

  private async runDueVerificationChecks() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const pendingVerifications = await db
        .select()
        .from(removalVerifications)
        .where(
          and(
            eq(removalVerifications.status, "pending"),
            lte(removalVerifications.scheduledFor, new Date())
          )
        );

      if (pendingVerifications.length === 0) return;

      console.log(`[data-broker-scheduler] Found ${pendingVerifications.length} pending verifications to check`);

      for (const verification of pendingVerifications) {
        try {
          const [request] = await db
            .select()
            .from(removalRequests)
            .where(eq(removalRequests.id, verification.removalRequestId));

          if (!request) continue;

          const [scan] = await db
            .select()
            .from(exposureScans)
            .where(eq(exposureScans.userId, request.userId))
            .orderBy(desc(exposureScans.createdAt))
            .limit(1);

          if (scan) {
            const stillExposed = await db
              .select()
              .from(exposureFindings)
              .where(
                and(
                  eq(exposureFindings.scanId, scan.id),
                  eq(exposureFindings.brokerId, request.brokerId)
                )
              );

            const isRemoved = stillExposed.length === 0;

            await db
              .update(removalVerifications)
              .set({
                status: isRemoved ? "confirmed" : "failed",
                completedAt: new Date(),
                dataStillPresent: !isRemoved,
                notes: isRemoved
                  ? "Automated rescan confirmed data removed"
                  : "Automated rescan found data still present",
              })
              .where(eq(removalVerifications.id, verification.id));

            if (isRemoved) {
              await db
                .update(removalRequests)
                .set({ status: "verified_removed", updatedAt: new Date() })
                .where(eq(removalRequests.id, request.id));
            }

            await logAuditEvent(
              request.userId,
              isRemoved ? "verification_confirmed" : "verification_failed",
              "removal_verification",
              verification.id,
              "pending",
              isRemoved ? "confirmed" : "failed",
              { brokerId: request.brokerId, automated: true }
            );
          }
        } catch (err: any) {
          console.error(`[data-broker-scheduler] Verification check failed for ${verification.id}:`, err.message);
        }
      }
    } catch (err) {
      console.error("[data-broker-scheduler] Error checking due verifications:", err);
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      checkIntervalMinutes: 15,
      capabilities: [
        "Automatic monitoring re-scans when next scan date is due",
        "Verification checks for removal requests after 30 days",
        "Re-appearance detection when removed data shows up again",
        "Auto re-removal triggers for re-appeared data",
        "Consecutive failure tracking with skip-after-5-failures safety",
      ],
    };
  }
}

export const dataBrokerScheduler = new DataBrokerScheduler();

// ============================================
// IDENTITY RISK SCORING
// ============================================

const DATA_TYPE_SENSITIVITY: Record<string, number> = {
  "ssn": 10, "social-security": 10, "financial": 9, "bank-account": 9,
  "credit-card": 9, "password": 8, "medical": 8, "health": 8,
  "date-of-birth": 7, "driver-license": 7, "passport": 7,
  "phone": 5, "email": 4, "address": 5, "name": 3,
  "employer": 4, "education": 3, "relatives": 5, "property-records": 5,
  "court-records": 6, "criminal-records": 7, "voting-records": 4,
  "vehicle-records": 4, "income": 7, "age": 3, "photos": 4,
};

export function computeIdentityRiskScore(params: {
  breachCount: number;
  profilesDiscovered: number;
  activeBrokersFound: number;
  totalBrokersScanned: number;
  dataTypesExposed: string[];
  hasHighSensitivityData: boolean;
}): number {
  let score = 0;

  score += Math.min(params.breachCount * 8, 30);
  score += Math.min(params.profilesDiscovered * 12, 25);
  score += Math.min(Math.floor(params.activeBrokersFound / 10) * 3, 15);

  const sensitivitySum = params.dataTypesExposed.reduce((sum, dt) => {
    const key = dt.toLowerCase().replace(/[_\s]+/g, "-");
    return sum + (DATA_TYPE_SENSITIVITY[key] || 2);
  }, 0);
  score += Math.min(Math.floor(sensitivitySum / 3), 20);

  if (params.hasHighSensitivityData) score += 10;

  return Math.min(Math.max(score, 0), 100);
}

export function computeExposureLikelihood(broker: DataBroker, userDataTypes: Set<string>): number {
  let score = 0;

  const brokerCollects = broker.dataTypesCollected ?? [];
  const overlap = brokerCollects.filter((dt) => userDataTypes.has(dt));
  score += Math.min(overlap.length * 10, 30);

  const riskMap: Record<string, number> = { critical: 25, high: 20, medium: 15, low: 10 };
  score += riskMap[broker.riskLevel ?? "medium"] || 15;

  const diffMap: Record<string, number> = { hard: 20, medium: 15, easy: 10 };
  score += diffMap[broker.difficulty ?? "medium"] || 15;

  const visitors = broker.monthlyVisitors ?? "";
  if (visitors.includes("B") || visitors.includes("billion")) score += 15;
  else if (visitors.includes("M") || parseInt(visitors) > 1000) score += 10;
  else score += 5;

  if (broker.category === "people-search" || broker.category === "public-records") score += 10;

  return Math.min(score, 100);
}

export function computeReappearanceRisk(broker: DataBroker, performance?: BrokerPerformance | null): { risk: string; percentage: number; factors: string[] } {
  const factors: string[] = [];
  let riskScore = 0;

  if (broker.category === "people-search" || broker.category === "public-records") {
    riskScore += 30;
    factors.push("Public records source — data may be re-ingested from government databases");
  }
  if (broker.category === "data-aggregator" || broker.category === "data-aggregator-enrichment") {
    riskScore += 25;
    factors.push("Data aggregator — sources data from multiple third parties");
  }
  if (broker.relatedBrokers && broker.relatedBrokers.length > 0) {
    riskScore += 15;
    factors.push(`Shares data with ${broker.relatedBrokers.length} related broker(s)`);
  }
  if (broker.parentCompany) {
    riskScore += 10;
    factors.push(`Part of ${broker.parentCompany} — data may be shared across subsidiaries`);
  }

  if (performance) {
    if (performance.reappearanceRate && performance.reappearanceRate > 50) {
      riskScore += 20;
      factors.push(`Historical reappearance rate: ${performance.reappearanceRate}%`);
    } else if (performance.reappearanceRate && performance.reappearanceRate > 20) {
      riskScore += 10;
      factors.push(`Moderate reappearance rate: ${performance.reappearanceRate}%`);
    }
  }

  const percentage = Math.min(riskScore, 100);
  const risk = percentage >= 60 ? "high" : percentage >= 30 ? "medium" : "low";
  return { risk, percentage, factors };
}

export function getBrokerVerificationRequirements(broker: DataBroker): string[] {
  const reqs: string[] = [];
  if (broker.requiresIdVerification) reqs.push("Government-issued photo ID");
  if (broker.requiresAccountCreation) reqs.push("Account creation on broker site");
  if (broker.optOutMethod === "email") reqs.push("Email from the address being removed");
  if (broker.optOutMethod === "mail") reqs.push("Physical letter with signature");
  if (broker.optOutMethod === "phone") reqs.push("Phone call to broker hotline");
  if (broker.optOutMethod === "web-form") reqs.push("Online form submission");
  if (broker.verificationMethod === "email-confirmation") reqs.push("Email verification link");
  if (broker.verificationMethod === "email-reply") reqs.push("Reply to confirmation email");
  return reqs.length > 0 ? reqs : ["No specific verification required"];
}

export function getBrokerTosRiskFlags(broker: DataBroker): { level: string; flags: string[] } {
  const flags: string[] = [];
  let level = "low";

  if (broker.requiresAccountCreation) {
    flags.push("Requires account creation — exposes additional data to broker");
    level = "medium";
  }
  if (broker.requiresIdVerification) {
    flags.push("Requires government ID — identity theft risk if broker is compromised");
    level = "high";
  }
  if (broker.optOutMethod === "mail") {
    flags.push("Requires physical mail — exposes your mailing address");
    level = level === "low" ? "medium" : level;
  }
  if (broker.difficulty === "hard") {
    flags.push("Complex removal process — may require multiple attempts");
    level = level === "low" ? "medium" : level;
  }
  if (!broker.optOutUrl && broker.optOutMethod === "web-form") {
    flags.push("No documented opt-out URL — process may have changed");
    level = level === "low" ? "medium" : level;
  }

  return { level, flags: flags.length > 0 ? flags : ["No significant risks identified"] };
}

// ============================================
// STRUCTURED AUTOMATION JSON API
// ============================================

export interface AutomationBrokerEntry {
  broker: string;
  brokerId: string;
  domain: string;
  category: string;
  opt_out_url: string | null;
  method: "manual" | "automated" | "semi-automated" | "email" | "api" | "phone" | "mail";
  verification_needed: string[];
  removal_eta_days: number;
  reappearance_risk: string;
  reappearance_risk_percentage: number;
  compliance_notes: string;
  exposure_likelihood: number;
  tos_risk: { level: string; flags: string[] };
  evidence_tier: string;
  match_score: number | null;
  profile_url: string | null;
}

export async function getAutomationOutput(scanId: string, userId: string): Promise<{
  scan_id: string;
  identity_risk_score: number | null;
  total_brokers: number;
  total_findings: number;
  brokers: AutomationBrokerEntry[];
}> {
  const [scan] = await db.select().from(exposureScans).where(and(eq(exposureScans.id, scanId), eq(exposureScans.userId, userId)));
  if (!scan) throw new Error("Scan not found");

  const findings = await db.select().from(exposureFindings).where(and(eq(exposureFindings.scanId, scanId), eq(exposureFindings.userId, userId)));

  const brokerIds = Array.from(new Set(findings.map(f => f.brokerId)));
  const brokers = brokerIds.length > 0
    ? await db.select().from(dataBrokers).where(inArray(dataBrokers.id, brokerIds))
    : [];
  const brokerMap = new Map(brokers.map(b => [b.id, b]));

  const perfRecords = brokerIds.length > 0
    ? await db.select().from(brokerPerformance).where(inArray(brokerPerformance.brokerId, brokerIds))
    : [];
  const perfMap = new Map(perfRecords.map(p => [p.brokerId, p]));

  const discoveries = await db.select().from(profileDiscoveries).where(eq(profileDiscoveries.scanId, scanId));
  const discoveryMap = new Map(discoveries.map(d => [d.brokerId, d]));

  const automationBrokers: AutomationBrokerEntry[] = findings.map(finding => {
    const broker = brokerMap.get(finding.brokerId);
    if (!broker) return null;

    const perf = perfMap.get(broker.id);
    const discovery = discoveryMap.get(broker.id);
    const reappearance = computeReappearanceRisk(broker, perf);
    const userDataTypes = new Set(finding.dataTypesExposed ?? []);

    const methodMap: Record<string, AutomationBrokerEntry["method"]> = {
      "web-form": "automated", "email": "email", "phone": "phone",
      "mail": "mail", "api": "api",
    };

    const complianceNotes = [
      ...(broker.legalBasis ?? []).map(l => `${l} rights applicable`),
      broker.estimatedProcessingDays ? `Regulatory deadline: ${broker.estimatedProcessingDays} days` : null,
      broker.dataRetentionPolicy || null,
    ].filter(Boolean).join(". ");

    return {
      broker: broker.name,
      brokerId: broker.id,
      domain: broker.domain,
      category: broker.category,
      opt_out_url: broker.optOutUrl,
      method: methodMap[broker.optOutMethod] || "manual",
      verification_needed: getBrokerVerificationRequirements(broker),
      removal_eta_days: broker.estimatedProcessingDays ?? 30,
      reappearance_risk: reappearance.risk,
      reappearance_risk_percentage: reappearance.percentage,
      compliance_notes: complianceNotes,
      exposure_likelihood: computeExposureLikelihood(broker, userDataTypes),
      tos_risk: getBrokerTosRiskFlags(broker),
      evidence_tier: finding.verificationMethod ?? "unknown",
      match_score: discovery?.matchScore ?? null,
      profile_url: discovery?.profileUrl ?? null,
    };
  }).filter(Boolean) as AutomationBrokerEntry[];

  return {
    scan_id: scanId,
    identity_risk_score: scan.identityRiskScore,
    total_brokers: automationBrokers.length,
    total_findings: findings.length,
    brokers: automationBrokers,
  };
}

// ============================================
// AI-DRIVEN REMOVAL INTELLIGENCE
// ============================================

export function fingerPrintBroker(broker: DataBroker): string {
  const parts: string[] = [];

  const difficultyTier = broker.difficulty === "hard" ? "resistant" : broker.difficulty === "easy" ? "cooperative" : "standard";
  parts.push(`difficulty:${difficultyTier}`);

  const autoFeas = broker.automationFeasibility ?? "manual";
  parts.push(`automation:${autoFeas}`);

  parts.push(`method:${broker.optOutMethod}`);

  if (broker.requiresIdVerification) parts.push("id-required");
  if (broker.requiresAccountCreation) parts.push("account-required");

  const cat = broker.category;
  if (cat.includes("people-search")) parts.push("type:people-search");
  else if (cat.includes("marketing")) parts.push("type:marketing");
  else if (cat.includes("background")) parts.push("type:background-check");
  else if (cat.includes("financial")) parts.push("type:financial");
  else parts.push(`type:${cat}`);

  return parts.join("|");
}

export async function updateBrokerPerformanceMetrics(brokerId: string, outcome: "success" | "failure" | "reappearance", responseDays?: number, failureReason?: string) {
  const [existing] = await db.select().from(brokerPerformance).where(eq(brokerPerformance.brokerId, brokerId));

  if (!existing) {
    const [broker] = await db.select().from(dataBrokers).where(eq(dataBrokers.id, brokerId));
    await db.insert(brokerPerformance).values({
      brokerId,
      totalRequests: 1,
      successfulRemovals: outcome === "success" ? 1 : 0,
      failedRemovals: outcome === "failure" ? 1 : 0,
      reappearanceCount: outcome === "reappearance" ? 1 : 0,
      averageRemovalDays: responseDays ?? null,
      lastSuccessAt: outcome === "success" ? new Date() : null,
      lastFailureAt: outcome === "failure" ? new Date() : null,
      fingerprint: broker ? fingerPrintBroker(broker) : null,
      bestMethod: broker?.optOutMethod ?? null,
      commonFailureReasons: failureReason ? [failureReason] : [],
      avgResponseTimeDays: responseDays ?? null,
      complianceRate: outcome === "success" ? 100 : 0,
      reappearanceRate: outcome === "reappearance" ? 100 : 0,
    });
    return;
  }

  const totalReqs = (existing.totalRequests ?? 0) + 1;
  const successes = (existing.successfulRemovals ?? 0) + (outcome === "success" ? 1 : 0);
  const failures = (existing.failedRemovals ?? 0) + (outcome === "failure" ? 1 : 0);
  const reappearances = (existing.reappearanceCount ?? 0) + (outcome === "reappearance" ? 1 : 0);

  const avgDays = responseDays && existing.averageRemovalDays
    ? Math.round((existing.averageRemovalDays * (totalReqs - 1) + responseDays) / totalReqs)
    : responseDays ?? existing.averageRemovalDays;

  const compRate = totalReqs > 0 ? Math.round((successes / totalReqs) * 100) : 100;
  const reappRate = successes > 0 ? Math.round((reappearances / successes) * 100) : 0;

  const failReasons = existing.commonFailureReasons ?? [];
  if (failureReason && !failReasons.includes(failureReason)) {
    failReasons.push(failureReason);
  }

  await db.update(brokerPerformance).set({
    totalRequests: totalReqs,
    successfulRemovals: successes,
    failedRemovals: failures,
    reappearanceCount: reappearances,
    averageRemovalDays: avgDays,
    reappearanceRate: reappRate,
    complianceRate: compRate,
    lastSuccessAt: outcome === "success" ? new Date() : existing.lastSuccessAt,
    lastFailureAt: outcome === "failure" ? new Date() : existing.lastFailureAt,
    commonFailureReasons: failReasons.slice(0, 10),
    avgResponseTimeDays: avgDays,
    updatedAt: new Date(),
  }).where(eq(brokerPerformance.brokerId, brokerId));
}

export async function getSmartRemovalQueue(userId: string): Promise<Array<{
  broker: DataBroker;
  finding: ExposureFinding;
  priorityScore: number;
  priorityReason: string;
  estimatedSuccessRate: number;
  recommendedMethod: string;
}>> {
  const findings = await db.select().from(exposureFindings).where(eq(exposureFindings.userId, userId));
  if (findings.length === 0) return [];

  const brokerIds = Array.from(new Set(findings.map(f => f.brokerId)));
  const brokers = await db.select().from(dataBrokers).where(inArray(dataBrokers.id, brokerIds));
  const brokerMap = new Map(brokers.map(b => [b.id, b]));

  const existingRequests = await db.select().from(removalRequests).where(eq(removalRequests.userId, userId));
  const requestedBrokerIds = new Set(existingRequests.map(r => r.brokerId));

  const perfRecords = await db.select().from(brokerPerformance).where(inArray(brokerPerformance.brokerId, brokerIds));
  const perfMap = new Map(perfRecords.map(p => [p.brokerId, p]));

  const queue = findings
    .filter(f => !requestedBrokerIds.has(f.brokerId))
    .map(finding => {
      const broker = brokerMap.get(finding.brokerId);
      if (!broker) return null;

      const perf = perfMap.get(broker.id);
      let priorityScore = 0;
      const reasons: string[] = [];

      if (finding.verificationMethod === "profile_discovered" || finding.verificationMethod === "breach_confirmed") {
        priorityScore += 40;
        reasons.push("Confirmed exposure");
      } else {
        priorityScore += 15;
        reasons.push("Active broker");
      }

      const riskMap: Record<string, number> = { critical: 30, high: 20, medium: 10, low: 5 };
      priorityScore += riskMap[broker.riskLevel ?? "medium"] || 10;

      if (broker.automationFeasibility === "full") {
        priorityScore += 15;
        reasons.push("Fully automatable");
      } else if (broker.automationFeasibility === "partial") {
        priorityScore += 10;
        reasons.push("Partially automatable");
      }

      const successRate = perf?.complianceRate ?? (broker.successRate ?? 70);
      priorityScore += Math.floor(successRate / 10);

      const bestMethod = perf?.bestMethod ?? broker.optOutMethod;

      return {
        broker,
        finding,
        priorityScore: Math.min(priorityScore, 100),
        priorityReason: reasons.join("; "),
        estimatedSuccessRate: successRate,
        recommendedMethod: bestMethod,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (b?.priorityScore ?? 0) - (a?.priorityScore ?? 0)) as any[];

  return queue;
}

// ============================================
// EXECUTIVE / MILITARY / GOV PRIVACY MODE
// ============================================

export async function setPrivacyMode(userId: string, vaultProfileId: string, mode: string, frameworks?: string[]) {
  const validModes = ["standard", "executive", "military", "government", "high-risk"];
  if (!validModes.includes(mode)) throw new Error("Invalid privacy mode");

  const priorityMap: Record<string, string> = {
    standard: "normal", executive: "high", military: "critical", government: "critical", "high-risk": "high",
  };

  const defaultFrameworks: Record<string, string[]> = {
    standard: ["CCPA"],
    executive: ["CCPA", "GDPR", "CPRA"],
    military: ["CCPA", "GDPR", "Privacy Act", "OPSEC"],
    government: ["CCPA", "GDPR", "Privacy Act", "FOIA-exempt"],
    "high-risk": ["CCPA", "GDPR", "CPRA", "VCDPA"],
  };

  await db.update(userVaultProfiles).set({
    privacyMode: mode,
    priorityLevel: priorityMap[mode],
    complianceFrameworks: frameworks ?? defaultFrameworks[mode] ?? ["CCPA"],
    updatedAt: new Date(),
  }).where(and(eq(userVaultProfiles.id, vaultProfileId), eq(userVaultProfiles.userId, userId)));

  await db.insert(removalAuditLog).values({
    userId,
    action: "privacy_mode_changed",
    entityType: "vault_profile",
    entityId: vaultProfileId,
    newState: mode,
    metadata: { priorityLevel: priorityMap[mode], frameworks: frameworks ?? defaultFrameworks[mode] },
  });

  return { mode, priorityLevel: priorityMap[mode], frameworks: frameworks ?? defaultFrameworks[mode] };
}

export function generateExecutiveComplianceTemplate(broker: DataBroker, profile: UserVaultProfile, framework: string): string {
  const isHighPriority = profile.priorityLevel === "critical" || profile.priorityLevel === "high";
  const mode = profile.privacyMode ?? "standard";

  let legalCitations = "";
  let urgencyNote = "";
  let additionalDemands = "";

  switch (framework) {
    case "Privacy Act":
      legalCitations = "the Privacy Act of 1974, 5 U.S.C. § 552a";
      urgencyNote = "As a government official, I am entitled to heightened privacy protections under federal law.";
      additionalDemands = "I further request confirmation that no copies of my data are retained in backup systems or shared with third-party partners.";
      break;
    case "OPSEC":
      legalCitations = "Operational Security (OPSEC) requirements and applicable DoD directives";
      urgencyNote = "The presence of my personal information on public websites poses a direct operational security risk. Immediate removal is critical.";
      additionalDemands = "I request that my data be permanently purged from all systems, including cached versions, and that my information be added to a permanent suppression list to prevent re-indexing.";
      break;
    case "FOIA-exempt":
      legalCitations = "FOIA Exemption 6 (5 U.S.C. § 552(b)(6)) and applicable privacy statutes";
      urgencyNote = "My personal information is exempt from public disclosure under federal law.";
      additionalDemands = "I request permanent suppression of all personal identifiers and confirmation of removal within 72 hours.";
      break;
    case "GDPR":
      legalCitations = "Article 17 of the General Data Protection Regulation (GDPR)";
      urgencyNote = isHighPriority ? "Given the sensitivity of my position, I request expedited processing of this erasure request." : "";
      additionalDemands = "I further invoke my right to restriction of processing under Article 18 GDPR pending the erasure of my data.";
      break;
    default:
      legalCitations = "the California Consumer Privacy Act (CCPA), Cal. Civ. Code § 1798.105";
      urgencyNote = isHighPriority ? "Due to the sensitive nature of my professional role, I request prioritized handling of this request." : "";
      additionalDemands = "I also request that you not sell or share my personal information with any third parties pursuant to CCPA § 1798.120.";
  }

  const modeLabel = mode === "military" ? "Military/Defense Personnel" : mode === "government" ? "Government Official" : mode === "executive" ? "Executive" : "Individual";

  return `Subject: ${framework} Data Deletion Request — ${modeLabel} Priority

To the Privacy Officer at ${broker.name},

I am writing to formally request the immediate deletion of all personal information you hold about me, pursuant to ${legalCitations}.

${urgencyNote}

My identifying information:
- Name: ${profile.fullName || "[Name on file]"}
${profile.emails?.length ? `- Email(s): ${profile.emails.join(", ")}` : ""}
${profile.phoneNumbers?.length ? `- Phone(s): ${profile.phoneNumbers.join(", ")}` : ""}
${profile.currentAddress ? `- Address: ${profile.currentAddress}` : ""}

I request:
1. Complete deletion of all personal data associated with my identity from your databases.
2. Removal of my information from all public-facing search results and listings.
3. Confirmation of deletion in writing within the legally required timeframe.
${additionalDemands}

Failure to comply within the statutory deadline may result in a formal complaint to the relevant regulatory authority.

Regards,
${profile.fullName || "[Your Name]"}`;
}

// ============================================
// MONITORING ALERT THRESHOLDS & RE-INDEX DETECTION
// ============================================

export async function updateMonitoringThresholds(userId: string, scheduleId: string, settings: {
  alertThresholdNewExposures?: number;
  alertThresholdRiskScore?: number;
  reindexDetection?: boolean;
}) {
  await db.update(monitoringSchedules).set({
    ...(settings.alertThresholdNewExposures !== undefined && { alertThresholdNewExposures: settings.alertThresholdNewExposures }),
    ...(settings.alertThresholdRiskScore !== undefined && { alertThresholdRiskScore: settings.alertThresholdRiskScore }),
    ...(settings.reindexDetection !== undefined && { reindexDetection: settings.reindexDetection }),
    updatedAt: new Date(),
  }).where(and(eq(monitoringSchedules.id, scheduleId), eq(monitoringSchedules.userId, userId)));

  return { success: true };
}

export async function checkReindexDetection(userId: string, currentFindings: number, previousFindings: number, currentRiskScore: number, schedule: MonitoringSchedule): Promise<{
  triggered: boolean;
  alerts: string[];
}> {
  const alerts: string[] = [];
  let triggered = false;

  const newExposures = currentFindings - previousFindings;
  const threshold = schedule.alertThresholdNewExposures ?? 1;
  if (newExposures >= threshold) {
    triggered = true;
    alerts.push(`${newExposures} new exposure(s) detected (threshold: ${threshold})`);
  }

  const riskThreshold = schedule.alertThresholdRiskScore ?? 70;
  if (currentRiskScore >= riskThreshold) {
    triggered = true;
    alerts.push(`Identity risk score ${currentRiskScore} exceeds threshold of ${riskThreshold}`);
  }

  if (schedule.reindexDetection && previousFindings > 0 && currentFindings > previousFindings) {
    const reindexRate = ((currentFindings - previousFindings) / previousFindings) * 100;
    if (reindexRate > 20) {
      triggered = true;
      alerts.push(`Possible re-indexing detected: ${Math.round(reindexRate)}% increase in broker listings`);
    }
  }

  if (triggered && schedule.lastRiskScore !== null) {
    const previousRisk = schedule.lastRiskScore ?? 0;
    if (currentRiskScore > previousRisk + 15) {
      alerts.push(`Risk score increased significantly: ${previousRisk} → ${currentRiskScore}`);
    }
  }

  return { triggered, alerts };
}
