const PBKDF2_ITERATIONS = 600000;
const ZK_PREFIX = "zk:v1:";
const DEK_SESSION_KEY = "gcr_vault_dek";
const ALGORITHM = "AES-GCM";

function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function generateSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(32));
  return bufferToBase64(salt.buffer);
}

async function deriveKeyFromPassword(
  password: string,
  saltBase64: string,
  iterations: number = PBKDF2_ITERATIONS
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const salt = base64ToBuffer(saltBase64);

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations,
      hash: "SHA-256",
    },
    passwordKey,
    { name: ALGORITHM, length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function generateDEK(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: ALGORITHM, length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key);
  return bufferToBase64(raw);
}

async function importKey(keyBase64: string): Promise<CryptoKey> {
  const raw = base64ToBuffer(keyBase64);
  return crypto.subtle.importKey(
    "raw",
    raw,
    { name: ALGORITHM, length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptWithKey(
  key: CryptoKey,
  plaintext: string
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(plaintext)
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return bufferToBase64(combined.buffer);
}

export async function decryptWithKey(
  key: CryptoKey,
  ciphertext: string
): Promise<string> {
  const data = new Uint8Array(base64ToBuffer(ciphertext));
  const iv = data.slice(0, 12);
  const encrypted = data.slice(12);
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    encrypted
  );
  return new TextDecoder().decode(decrypted);
}

export async function setupVaultKey(
  password: string
): Promise<{
  salt: string;
  encryptedDEK: string;
  verification: string;
}> {
  const salt = generateSalt();
  const masterKey = await deriveKeyFromPassword(password, salt);
  const dek = await generateDEK();
  const dekRaw = await exportKey(dek);

  const encryptedDEK = await encryptWithKey(masterKey, dekRaw);

  const encoder = new TextEncoder();
  const verificationHash = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(dekRaw)
  );
  const verification = bufferToBase64(verificationHash);

  storeDEK(dekRaw);

  return { salt, encryptedDEK, verification };
}

export async function unlockVault(
  password: string,
  salt: string,
  encryptedDEK: string,
  verification: string,
  iterations: number = PBKDF2_ITERATIONS
): Promise<boolean> {
  try {
    const masterKey = await deriveKeyFromPassword(password, salt, iterations);
    const dekRaw = await decryptWithKey(masterKey, encryptedDEK);

    const encoder = new TextEncoder();
    const verificationHash = await crypto.subtle.digest(
      "SHA-256",
      encoder.encode(dekRaw)
    );
    const computedVerification = bufferToBase64(verificationHash);

    if (computedVerification !== verification) {
      return false;
    }

    storeDEK(dekRaw);
    return true;
  } catch {
    return false;
  }
}

export async function rotateVaultKey(
  oldPassword: string,
  newPassword: string,
  salt: string,
  encryptedDEK: string,
  iterations: number = PBKDF2_ITERATIONS
): Promise<{
  salt: string;
  encryptedDEK: string;
  verification: string;
} | null> {
  try {
    const oldMasterKey = await deriveKeyFromPassword(oldPassword, salt, iterations);
    const dekRaw = await decryptWithKey(oldMasterKey, encryptedDEK);

    const newSalt = generateSalt();
    const newMasterKey = await deriveKeyFromPassword(newPassword, newSalt);
    const newEncryptedDEK = await encryptWithKey(newMasterKey, dekRaw);

    const encoder = new TextEncoder();
    const verificationHash = await crypto.subtle.digest(
      "SHA-256",
      encoder.encode(dekRaw)
    );
    const verification = bufferToBase64(verificationHash);

    storeDEK(dekRaw);

    return { salt: newSalt, encryptedDEK: newEncryptedDEK, verification };
  } catch {
    return null;
  }
}

function storeDEK(dekBase64: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(DEK_SESSION_KEY, dekBase64);
}

export function clearDEK(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(DEK_SESSION_KEY);
}

export function isVaultUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(DEK_SESSION_KEY) !== null;
}

async function getDEK(): Promise<CryptoKey | null> {
  if (typeof window === 'undefined') return null;
  const dekBase64 = sessionStorage.getItem(DEK_SESSION_KEY);
  if (!dekBase64) return null;
  return importKey(dekBase64);
}

export async function encryptVaultField(value: string): Promise<string> {
  if (!value) return value;
  if (value.startsWith(ZK_PREFIX)) return value;
  const dek = await getDEK();
  if (!dek) throw new Error("Vault is locked. Please log in again.");
  const encrypted = await encryptWithKey(dek, value);
  return ZK_PREFIX + encrypted;
}

export async function decryptVaultField(value: string): Promise<string> {
  if (!value || !value.startsWith(ZK_PREFIX)) return value;
  const dek = await getDEK();
  if (!dek) throw new Error("Vault is locked. Please log in again.");
  return decryptWithKey(dek, value.slice(ZK_PREFIX.length));
}

export async function encryptVaultPayload(data: Record<string, any>): Promise<Record<string, any>> {
  const sensitiveScalarFields = ["fullName", "currentAddress", "dateOfBirth"];
  const sensitiveArrayFields = ["emails", "phoneNumbers", "previousAddresses", "relativeNames", "employerNames", "previousNames"];

  const encrypted = { ...data };

  for (const field of sensitiveScalarFields) {
    if (encrypted[field] && typeof encrypted[field] === "string") {
      encrypted[field] = await encryptVaultField(encrypted[field]);
    }
  }

  for (const field of sensitiveArrayFields) {
    if (Array.isArray(encrypted[field])) {
      encrypted[field] = await Promise.all(
        encrypted[field].map((v: string) => encryptVaultField(v))
      );
    }
  }

  return encrypted;
}

export async function decryptVaultPayload(data: Record<string, any>): Promise<Record<string, any>> {
  if (!data) return data;

  const sensitiveScalarFields = ["fullName", "currentAddress", "dateOfBirth"];
  const sensitiveArrayFields = ["emails", "phoneNumbers", "previousAddresses", "relativeNames", "employerNames", "previousNames"];

  const decrypted = { ...data };

  for (const field of sensitiveScalarFields) {
    if (decrypted[field] && typeof decrypted[field] === "string") {
      decrypted[field] = await decryptVaultField(decrypted[field]);
    }
  }

  for (const field of sensitiveArrayFields) {
    if (Array.isArray(decrypted[field])) {
      decrypted[field] = await Promise.all(
        decrypted[field].map((v: string) => decryptVaultField(v))
      );
    }
  }

  return decrypted;
}
