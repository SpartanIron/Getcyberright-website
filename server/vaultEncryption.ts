import crypto from "crypto";
import { db } from "./db";
import { userVaultProfiles } from "@shared/schema";
import { eq } from "drizzle-orm";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const ENCRYPTED_PREFIX = "enc:v1:";

function getEncryptionKey(): Buffer {
  const keyHex = process.env.VAULT_ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error("VAULT_ENCRYPTION_KEY environment variable is not set. Cannot encrypt vault data.");
  }
  const key = Buffer.from(keyHex, "hex");
  if (key.length !== 32) {
    throw new Error("VAULT_ENCRYPTION_KEY must be a 64-character hex string (32 bytes).");
  }
  return key;
}

export function encryptField(plaintext: string): string {
  if (!plaintext) return plaintext;
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, authTag, Buffer.from(encrypted, "base64")]);
  return ENCRYPTED_PREFIX + combined.toString("base64");
}

export function decryptField(ciphertext: string): string {
  if (!ciphertext || !ciphertext.startsWith(ENCRYPTED_PREFIX)) {
    return ciphertext;
  }
  const key = getEncryptionKey();
  const data = Buffer.from(ciphertext.slice(ENCRYPTED_PREFIX.length), "base64");
  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString("utf8");
}

function isEncrypted(value: string | null | undefined): boolean {
  return typeof value === "string" && value.startsWith(ENCRYPTED_PREFIX);
}

export function encryptArrayField(values: string[] | null | undefined): string[] | null {
  if (!values || values.length === 0) return values as string[] | null;
  return values.map((v) => (isEncrypted(v) ? v : encryptField(v)));
}

export function decryptArrayField(values: string[] | null | undefined): string[] | null {
  if (!values || values.length === 0) return values as string[] | null;
  return values.map((v) => decryptField(v));
}

const SENSITIVE_SCALAR_FIELDS = [
  "fullName",
  "currentAddress",
  "dateOfBirth",
] as const;

const SENSITIVE_ARRAY_FIELDS = [
  "emails",
  "phoneNumbers",
  "previousAddresses",
  "relativeNames",
  "employerNames",
  "previousNames",
] as const;

type VaultProfileData = Record<string, any>;

export function encryptVaultData<T extends VaultProfileData>(data: T): T {
  const encrypted = { ...data };
  for (const field of SENSITIVE_SCALAR_FIELDS) {
    if (field in encrypted && encrypted[field] && !isEncrypted(encrypted[field])) {
      encrypted[field] = encryptField(encrypted[field]);
    }
  }
  for (const field of SENSITIVE_ARRAY_FIELDS) {
    if (field in encrypted && encrypted[field]) {
      encrypted[field] = encryptArrayField(encrypted[field]);
    }
  }
  return encrypted;
}

export function decryptVaultData<T extends VaultProfileData>(data: T): T {
  const decrypted = { ...data };
  for (const field of SENSITIVE_SCALAR_FIELDS) {
    if (field in decrypted && decrypted[field]) {
      decrypted[field] = decryptField(decrypted[field]);
    }
  }
  for (const field of SENSITIVE_ARRAY_FIELDS) {
    if (field in decrypted && decrypted[field]) {
      decrypted[field] = decryptArrayField(decrypted[field]);
    }
  }
  return decrypted;
}

export async function migrateUnencryptedVaultData(): Promise<number> {
  try {
    getEncryptionKey();
  } catch {
    console.log("[vault-encryption] No encryption key configured, skipping migration");
    return 0;
  }

  const profiles = await db
    .select()
    .from(userVaultProfiles);

  let migratedCount = 0;

  for (const profile of profiles) {
    let needsUpdate = false;

    if (profile.fullName && !isEncrypted(profile.fullName)) needsUpdate = true;
    if (profile.currentAddress && !isEncrypted(profile.currentAddress)) needsUpdate = true;
    if (profile.dateOfBirth && !isEncrypted(profile.dateOfBirth)) needsUpdate = true;

    const arrayFields = ["emails", "phoneNumbers", "previousAddresses", "relativeNames", "employerNames", "previousNames"] as const;
    for (const field of arrayFields) {
      const arr = profile[field] as string[] | null;
      if (arr && arr.some((v) => !isEncrypted(v))) {
        needsUpdate = true;
        break;
      }
    }

    if (needsUpdate) {
      const encrypted = encryptVaultData(profile);
      await db
        .update(userVaultProfiles)
        .set({
          fullName: encrypted.fullName,
          currentAddress: encrypted.currentAddress,
          dateOfBirth: encrypted.dateOfBirth,
          emails: encrypted.emails,
          phoneNumbers: encrypted.phoneNumbers,
          previousAddresses: encrypted.previousAddresses,
          relativeNames: encrypted.relativeNames,
          employerNames: encrypted.employerNames,
          previousNames: encrypted.previousNames,
          updatedAt: new Date(),
        })
        .where(eq(userVaultProfiles.id, profile.id));
      migratedCount++;
    }
  }

  if (migratedCount > 0) {
    console.log(`[vault-encryption] Migrated ${migratedCount} vault profiles to encrypted storage`);
  } else {
    console.log("[vault-encryption] All vault profiles already encrypted");
  }

  return migratedCount;
}
