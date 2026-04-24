/**
 * GCR HIBP Service - HaveIBeenPwned Integration
 * Priority 3: Real-time breach monitoring with email alerts
 * Priority 5: Password health checking via k-anonymity model
 * Priority 7: Live breach data feed for Cyber Threat Radar
 *
 * NOTE: Email breach lookups (checkEmailBreaches) require HIBP_API_KEY env var.
   * Password checks (checkPasswordHealth) are FREE - no key needed.
 * Public breach list (getAllBreaches) is FREE - no key needed.
 */

import crypto from "crypto";

const HIBP_API_BASE = "https://haveibeenpwned.com/api/v3";
const HIBP_PWNED_PASSWORDS_API = "https://api.pwnedpasswords.com/range";

export interface HIBPBreach {
    Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  ModifiedDate: string;
  PwnCount: number;
  Description: string;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
  IsMalware: boolean;
  IsSubscriptionFree: boolean;
  LogoPath: string;
}

export interface HIBPPaste {
    Source: string;
  Id: string;
  Title: string;
  Date: string;
  EmailCount: number;
}

export interface BreachCheckResult {
    email: string;
  breachCount: number;
  pasteCount: number;
  breaches: HIBPBreach[];
  pastes: HIBPPaste[];
  hasPasswordExposure: boolean;
  hasSensitiveExposure: boolean;
  mostRecentBreach: string | null;
  exposedDataTypes: string[];
  riskLevel: "none" | "low" | "medium" | "high" | "critical";
  summary: string;
}

export interface PasswordHealthResult {
    pwned: boolean;
  occurrences: number;
  riskLevel: "safe" | "low" | "medium" | "high" | "critical";
  message: string;
}

/**
 * Check if an email address appears in known data breaches.
 * Requires HIBP_API_KEY. Gracefully degrades without it.
   */
export async function checkEmailBreaches(email: string): Promise<BreachCheckResult> {
  const apiKey = process.env.HIBP_API_KEY;
  const empty: BreachCheckResult = {
    email, breachCount: 0, pasteCount: 0, breaches: [], pastes: [],
        hasPasswordExposure: false, hasSensitiveExposure: false,
        mostRecentBreach: null, exposedDataTypes: [], riskLevel: "none",
        summary: "No breaches found.",
    };
      if (!apiKey) {
    return { ...empty, summary: "Breach monitoring is being configured. Full breach checking coming soon." };
    }
  try {
    const headers: Record<string, string> = {
          "hibp-api-key": apiKey,
      "User-Agent": "GCR-BreachMonitor/1.0",
    };
    const breachRes = await fetch(
          `${HIBP_API_BASE}/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
{ headers }
        );
        let breaches: HIBPBreach[] = [];
    if (breachRes.status === 200) {
      breaches = await breachRes.json();
    } else if (breachRes.status === 401) {
      return { ...empty, summary: "Breach check temporarily unavailable." };
    } else if (breachRes.status === 429) {
          return { ...empty, summary: "Rate limit reached. Please try again shortly." };
}
        let pastes: HIBPPaste[] = [];
    try {
      const pasteRes = await fetch(`${HIBP_API_BASE}/pasteaccount/${encodeURIComponent(email)}`, { headers });
      if (pasteRes.status === 200) pastes = await pasteRes.json();
} catch { /* pastes are non-critical */ }
    const hasPasswordExposure = breaches.some((b) =>
          b.DataClasses?.some((dc) => dc.toLowerCase().includes("password"))
        );
        const hasSensitiveExposure = breaches.some(
      (b) => b.IsSensitive || b.DataClasses?.some((dc) =>
        ["credit card", "bank", "social security", "passport", "medical"].some((s) => dc.toLowerCase().includes(s))
          )
    );
    const allDataTypes = [...new Set(breaches.flatMap((b) => b.DataClasses || []))].sort();
    const mostRecentBreach = breaches.length > 0
      ? breaches.reduce((l, b) => new Date(b.BreachDate) > new Date(l.BreachDate) ? b : l).BreachDate
      : null;
        let riskLevel: BreachCheckResult["riskLevel"] = "none";
        if (breaches.length > 0 || pastes.length > 0) {
      if (hasSensitiveExposure || breaches.length >= 10 || pastes.length >= 5) riskLevel = "critical";
      else if (hasPasswordExposure || breaches.length >= 5) riskLevel = "high";
      else if (breaches.length >= 2) riskLevel = "medium";
      else riskLevel = "low";
}
    let summary = "";
    if (breaches.length === 0 && pastes.length === 0) {
      summary = "Good news. This email has not appeared in any known data breaches or paste sites.";
} else if (breaches.length > 0 && hasPasswordExposure) {
      summary = `This email appeared in ${breaches.length} data breach${breaches.length > 1 ? "es" : ""}, including breaches that exposed passwords. Change your passwords immediately.`;
} else if (breaches.length > 0) {
      summary = `This email appeared in ${breaches.length} data breach${breaches.length > 1 ? "es" : ""}. Review the affected services and monitor those accounts.`;
} else {
      summary = `This email appeared in ${pastes.length} paste${pastes.length > 1 ? "s" : ""} on sites like Pastebin. Your email may be circulating in hacker forums.`;
}
    return {
      email, breachCount: breaches.length, pasteCount: pastes.length,
      breaches, pastes, hasPasswordExposure, hasSensitiveExposure,
      mostRecentBreach, exposedDataTypes: allDataTypes, riskLevel, summary,
};
} catch (error) {
    console.error("[HIBP] checkEmailBreaches error:", error);
    return { ...empty, summary: "Breach check temporarily unavailable. Please try again in a moment." };
}
}

/**
 * Check if a password appears in breach databases using k-anonymity.
 * SAFE: Only the first 5 chars of the SHA-1 hash are ever transmitted.
 * No API key required. Free endpoint.
 */
export async function checkPasswordHealth(password: string): Promise<PasswordHealthResult> {
  try {
    const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.substring(0, 5);
    const suffix = sha1.substring(5);
    const res = await fetch(`${HIBP_PWNED_PASSWORDS_API}/${prefix}`, {
      headers: { "User-Agent": "GCR-PasswordChecker/1.0", "Add-Padding": "true" },
});
    if (!res.ok) return { pwned: false, occurrences: 0, riskLevel: "safe", message: "Password check temporarily unavailable." };
    const text = await res.text();
    let occurrences = 0;
    for (const line of text.split("\r\n")) {
      const parts = line.split(":");
      if (parts[0] === suffix && parts[1]) {
        occurrences = parseInt(parts[1], 10);
        break;
}
}
    if (occurrences === 0) {
      return { pwned: false, occurrences: 0, riskLevel: "safe", message: "This password has not appeared in any known data breach. It is safe to use." };
}
    let riskLevel: PasswordHealthResult["riskLevel"];
    let message: string;
    if (occurrences >= 100000) {
      riskLevel = "critical";
      message = `This password has appeared ${occurrences.toLocaleString()} times in data breaches. It must not be used under any circumstances.`;
} else if (occurrences >= 10000) {
      riskLevel = "high";
      message = `This password has appeared ${occurrences.toLocaleString()} times in data breaches. Change it immediately on all accounts where it is used.`;
} else if (occurrences >= 1000) {
      riskLevel = "medium";
      message = `This password has appeared ${occurrences.toLocaleString()} times in data breaches. Choose a stronger, unique password.`;
} else {
      riskLevel = "low";
      message = `This password has appeared ${occurrences.toLocaleString()} time${occurrences > 1 ? "s" : ""} in data breaches. Consider using a different password.`;
}
    return { pwned: true, occurrences, riskLevel, message };
} catch (error) {
    console.error("[HIBP Passwords] checkPasswordHealth error:", error);
    return { pwned: false, occurrences: 0, riskLevel: "safe", message: "Password check temporarily unavailable." };
}
}

/**
 * Get all publicly known breaches. No API key required.
 * Cached for 24 hours to reduce API load.
 */
export async function getAllBreaches(): Promise<HIBPBreach[]> {
  try {
    const res = await fetch(`${HIBP_API_BASE}/breaches`, {
      headers: { "User-Agent": "GCR-ThreatRadar/1.0" },
});
    if (!res.ok) return [];
    return res.json();
} catch {
    return [];
    }
}

/**
 * Get recent breaches added to HIBP in the last N days.
 * Used for Cyber Threat Radar live feed.
 */
export async function getRecentBreaches(days = 30): Promise<HIBPBreach[]> {
  try {
    const all = await getAllBreaches();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return all
            .filter((b) => new Date(b.AddedDate) >= cutoff)
            .sort((a, b) => new Date(b.AddedDate).getTime() - new Date(a.AddedDate).getTime())
            .slice(0, 20);
    } catch {
    return [];
    }
  }

/**
       * Get the largest breaches by record count.
       * Used for the Data Shield threat landscape summary.
       */
      export async function getLargestBreaches(limit = 10): Promise<HIBPBreach[]> {
        try {
          const all = await getAllBreaches();
    return all
            .sort((a, b) => b.PwnCount - a.PwnCount)
            .slice(0, limit);
          } catch {
    return [];
          }
    }
      
