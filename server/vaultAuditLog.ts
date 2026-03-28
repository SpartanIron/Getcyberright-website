import { db } from "./db";
import { vaultAuditLogs } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

type VaultAuditAction =
  | "vault_read"
  | "vault_read_all"
  | "vault_create"
  | "vault_update"
  | "vault_delete"
  | "vault_family_create"
  | "vault_family_delete"
  | "vault_scan_initiated"
  | "vault_removal_requested"
  | "vault_bulk_removal"
  | "vault_monitoring_setup"
  | "vault_privacy_mode_change";

interface AuditContext {
  userId: string;
  action: VaultAuditAction;
  vaultProfileId?: string;
  ipAddress?: string;
  userAgent?: string;
  fieldsAccessed?: string[];
}

export async function logVaultAccess(ctx: AuditContext): Promise<void> {
  try {
    await db.insert(vaultAuditLogs).values({
      userId: ctx.userId,
      action: ctx.action,
      vaultProfileId: ctx.vaultProfileId ?? null,
      ipAddress: ctx.ipAddress ?? null,
      userAgent: ctx.userAgent ?? null,
      fieldsAccessed: ctx.fieldsAccessed ?? null,
    });
  } catch (error) {
    console.error("[vault-audit] Failed to write audit log:", error);
  }
}

export async function getVaultAuditLogs(userId: string, limit = 50) {
  return db
    .select()
    .from(vaultAuditLogs)
    .where(eq(vaultAuditLogs.userId, userId))
    .orderBy(desc(vaultAuditLogs.createdAt))
    .limit(limit);
}

export function extractRequestContext(req: any): { ipAddress: string; userAgent: string } {
  const ipAddress = req.ip || req.socket?.remoteAddress || "unknown";
  const userAgent = (req.headers["user-agent"] as string) || "unknown";
  return { ipAddress, userAgent };
}
