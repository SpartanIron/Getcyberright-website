import crypto from "crypto";
import { db } from "./db";
import { maskedIdentities, maskedIdentityActivity } from "@shared/schema";
import type { MaskedIdentity, InsertMaskedIdentity, MaskedIdentityActivityEntry } from "@shared/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { encryptField, decryptField } from "./vaultEncryption";

const ALIAS_DOMAIN = "shield.getcyberright.com";

const WORD_POOL_A = [
  "amber", "azure", "blaze", "cedar", "coral", "drift", "ember", "frost",
  "grove", "haven", "ivory", "jade", "lunar", "maple", "noble", "onyx",
  "pearl", "quartz", "raven", "sage", "terra", "umbra", "valor", "willow",
  "zenith", "aurora", "basalt", "cipher", "delta", "echo", "flint", "ghost",
  "helix", "iris", "jet", "knoll", "lumen", "mirage", "nexus", "orbit"
];

const WORD_POOL_B = [
  "shield", "guard", "vault", "sentinel", "harbor", "haven", "refuge", "tower",
  "watch", "ward", "anchor", "beacon", "bridge", "canopy", "dome", "forge",
  "gate", "helm", "keep", "ledge", "moat", "nest", "peak", "rampart",
  "seal", "tide", "wall", "bastion", "citadel", "crest", "delta", "falcon",
  "garrison", "iron", "lance", "manor", "oasis", "pinnacle", "ridge", "stone"
];

const SERVICE_CATEGORIES = [
  "shopping", "social_media", "gaming", "education", "healthcare",
  "finance", "entertainment", "travel", "food_delivery", "news",
  "fitness", "productivity", "kids_apps", "school", "other"
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];

const TIER_LIMITS: Record<string, number> = {
  free: 2,
  scan: 2,
  essential: 10,
  remove: 10,
  professional: 50,
  protect: 50,
  enterprise: 200,
};

function generateAliasLocal(prefix?: string): string {
  const wordA = WORD_POOL_A[crypto.randomInt(WORD_POOL_A.length)];
  const wordB = WORD_POOL_B[crypto.randomInt(WORD_POOL_B.length)];
  const suffix = crypto.randomInt(1000, 9999);
  const base = prefix
    ? `${prefix.toLowerCase().replace(/[^a-z0-9]/g, "")}.${wordA}${suffix}`
    : `${wordA}.${wordB}${suffix}`;
  return `${base}@${ALIAS_DOMAIN}`;
}

function generatePhoneAlias(): string {
  const areaCode = crypto.randomInt(200, 999);
  const mid = crypto.randomInt(200, 999);
  const last = crypto.randomInt(1000, 9999);
  return `+1${areaCode}${mid}${last}`;
}

function generateUsernameAlias(prefix?: string): string {
  const wordA = WORD_POOL_A[crypto.randomInt(WORD_POOL_A.length)];
  const wordB = WORD_POOL_B[crypto.randomInt(WORD_POOL_B.length)];
  const suffix = crypto.randomInt(100, 9999);
  if (prefix) {
    return `${prefix.toLowerCase().replace(/[^a-z0-9]/g, "")}_${wordA}${suffix}`;
  }
  return `${wordA}_${wordB}${suffix}`;
}

export async function getUserAliasCount(userId: string): Promise<number> {
  const result = await db.select({ value: count() })
    .from(maskedIdentities)
    .where(eq(maskedIdentities.userId, userId));
  return result[0]?.value ?? 0;
}

export function getAliasLimit(tier: string): number {
  return TIER_LIMITS[tier.toLowerCase()] ?? TIER_LIMITS.free;
}

export async function createMaskedIdentity(
  userId: string,
  aliasType: "email" | "phone" | "username",
  realValue: string,
  options: {
    label?: string;
    serviceName?: string;
    serviceCategory?: ServiceCategory;
    expiresAt?: Date;
    prefix?: string;
  } = {}
): Promise<MaskedIdentity> {
  const encryptedRealValue = encryptField(realValue);

  let alias: string;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    attempts++;
    if (aliasType === "email") {
      alias = generateAliasLocal(options.prefix);
    } else if (aliasType === "phone") {
      alias = generatePhoneAlias();
    } else {
      alias = generateUsernameAlias(options.prefix);
    }

    const existing = await db.select({ id: maskedIdentities.id })
      .from(maskedIdentities)
      .where(eq(maskedIdentities.alias, alias!))
      .limit(1);

    if (existing.length === 0) break;
    if (attempts >= maxAttempts) {
      throw new Error("Failed to generate unique alias after maximum attempts.");
    }
  }

  const [identity] = await db.insert(maskedIdentities).values({
    userId,
    alias: alias!,
    aliasType,
    realValue: encryptedRealValue,
    label: options.label || null,
    serviceName: options.serviceName || null,
    serviceCategory: options.serviceCategory || null,
    forwardingEnabled: true,
    isActive: true,
    expiresAt: options.expiresAt || null,
  }).returning();

  await logActivity(identity.id, userId, "created", "created", {
    aliasType,
    serviceName: options.serviceName,
  });

  console.log(`[MaskedIdentity] Created ${aliasType} alias for user ${userId}: ${alias!.substring(0, 8)}...`);
  return identity;
}

export async function getUserMaskedIdentities(userId: string): Promise<MaskedIdentity[]> {
  const identities = await db.select()
    .from(maskedIdentities)
    .where(eq(maskedIdentities.userId, userId))
    .orderBy(desc(maskedIdentities.createdAt));

  return identities.map(identity => ({
    ...identity,
    realValue: decryptField(identity.realValue),
  }));
}

export async function getMaskedIdentityById(id: string, userId: string): Promise<MaskedIdentity | null> {
  const [identity] = await db.select()
    .from(maskedIdentities)
    .where(and(eq(maskedIdentities.id, id), eq(maskedIdentities.userId, userId)))
    .limit(1);

  if (!identity) return null;
  return { ...identity, realValue: decryptField(identity.realValue) };
}

export async function toggleIdentityActive(id: string, userId: string, isActive: boolean): Promise<MaskedIdentity | null> {
  const [updated] = await db.update(maskedIdentities)
    .set({ isActive, updatedAt: new Date() })
    .where(and(eq(maskedIdentities.id, id), eq(maskedIdentities.userId, userId)))
    .returning();

  if (updated) {
    await logActivity(id, userId, isActive ? "reactivated" : "deactivated", isActive ? "enabled" : "disabled");
  }

  return updated ? { ...updated, realValue: decryptField(updated.realValue) } : null;
}

export async function toggleForwarding(id: string, userId: string, enabled: boolean): Promise<MaskedIdentity | null> {
  const [updated] = await db.update(maskedIdentities)
    .set({ forwardingEnabled: enabled, updatedAt: new Date() })
    .where(and(eq(maskedIdentities.id, id), eq(maskedIdentities.userId, userId)))
    .returning();

  if (updated) {
    await logActivity(id, userId, enabled ? "forwarding_enabled" : "forwarding_disabled", enabled ? "enabled" : "disabled");
  }

  return updated ? { ...updated, realValue: decryptField(updated.realValue) } : null;
}

export async function updateIdentityService(
  id: string,
  userId: string,
  serviceName: string,
  serviceCategory?: ServiceCategory
): Promise<MaskedIdentity | null> {
  const [updated] = await db.update(maskedIdentities)
    .set({
      serviceName,
      serviceCategory: serviceCategory || null,
      updatedAt: new Date(),
    })
    .where(and(eq(maskedIdentities.id, id), eq(maskedIdentities.userId, userId)))
    .returning();

  if (updated) {
    await logActivity(id, userId, "service_updated", "updated", { serviceName, serviceCategory });
  }

  return updated ? { ...updated, realValue: decryptField(updated.realValue) } : null;
}

export async function deleteMaskedIdentity(id: string, userId: string): Promise<boolean> {
  const [identity] = await db.select({ alias: maskedIdentities.alias })
    .from(maskedIdentities)
    .where(and(eq(maskedIdentities.id, id), eq(maskedIdentities.userId, userId)))
    .limit(1);

  if (!identity) return false;

  await logActivity(id, userId, "deleted", "deleted", { alias: identity.alias });

  await db.delete(maskedIdentityActivity)
    .where(eq(maskedIdentityActivity.identityId, id));

  await db.delete(maskedIdentities)
    .where(and(eq(maskedIdentities.id, id), eq(maskedIdentities.userId, userId)));

  console.log(`[MaskedIdentity] Deleted alias for user ${userId}: ${identity.alias.substring(0, 8)}...`);
  return true;
}

export async function getIdentityActivity(
  userId: string,
  identityId?: string,
  limit = 50
): Promise<MaskedIdentityActivityEntry[]> {
  const conditions = [eq(maskedIdentityActivity.userId, userId)];
  if (identityId) {
    conditions.push(eq(maskedIdentityActivity.identityId, identityId));
  }

  return db.select()
    .from(maskedIdentityActivity)
    .where(and(...conditions))
    .orderBy(desc(maskedIdentityActivity.createdAt))
    .limit(limit);
}

export async function recordIncomingActivity(
  alias: string,
  eventType: "email_received" | "sms_received" | "call_received",
  senderAddress: string,
  subject?: string,
  blocked = false
): Promise<void> {
  const [identity] = await db.select()
    .from(maskedIdentities)
    .where(eq(maskedIdentities.alias, alias))
    .limit(1);

  if (!identity) return;

  if (!identity.isActive || !identity.forwardingEnabled) {
    await db.update(maskedIdentities)
      .set({
        totalBlocked: sql`${maskedIdentities.totalBlocked} + 1`,
        lastActivityAt: new Date(),
      })
      .where(eq(maskedIdentities.id, identity.id));

    await logActivity(identity.id, identity.userId, eventType, "blocked", {
      senderAddress: senderAddress.substring(0, 50),
      reason: !identity.isActive ? "alias_inactive" : "forwarding_disabled",
    });
    return;
  }

  const updateField = blocked ? "totalBlocked" : "totalForwarded";
  await db.update(maskedIdentities)
    .set({
      [updateField]: sql`${maskedIdentities[updateField]} + 1`,
      lastActivityAt: new Date(),
    })
    .where(eq(maskedIdentities.id, identity.id));

  await logActivity(identity.id, identity.userId, eventType, blocked ? "blocked" : "forwarded", {
    senderAddress: senderAddress.substring(0, 50),
    subject: subject?.substring(0, 100),
  });
}

export async function getIdentityStats(userId: string): Promise<{
  totalAliases: number;
  activeAliases: number;
  totalForwarded: number;
  totalBlocked: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
}> {
  const identities = await db.select()
    .from(maskedIdentities)
    .where(eq(maskedIdentities.userId, userId));

  const byType: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  let totalForwarded = 0;
  let totalBlocked = 0;
  let activeCount = 0;

  for (const identity of identities) {
    byType[identity.aliasType] = (byType[identity.aliasType] || 0) + 1;
    if (identity.serviceCategory) {
      byCategory[identity.serviceCategory] = (byCategory[identity.serviceCategory] || 0) + 1;
    }
    totalForwarded += identity.totalForwarded ?? 0;
    totalBlocked += identity.totalBlocked ?? 0;
    if (identity.isActive) activeCount++;
  }

  return {
    totalAliases: identities.length,
    activeAliases: activeCount,
    totalForwarded,
    totalBlocked,
    byType,
    byCategory,
  };
}

async function logActivity(
  identityId: string,
  userId: string,
  eventType: string,
  action: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await db.insert(maskedIdentityActivity).values({
      identityId,
      userId,
      eventType,
      action,
      metadata: metadata || null,
    });
  } catch (error: any) {
    console.warn(`[MaskedIdentity] Failed to log activity: ${error.message}`);
  }
}

export function getServiceCategories(): string[] {
  return [...SERVICE_CATEGORIES];
}
