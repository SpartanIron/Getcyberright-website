import { securityLogger } from "./security";

export type AlertSeverity = "low" | "medium" | "high" | "critical";

export interface SecurityAlert {
  severity: AlertSeverity;
  type: string;
  message: string;
  details: Record<string, unknown>;
  timestamp: Date;
}

const recentAlerts: SecurityAlert[] = [];
const MAX_ALERTS = 100;

const alertThresholds = {
  rateLimitViolations: { count: 5, windowMs: 60000, severity: "high" as AlertSeverity },
  csrfViolations: { count: 3, windowMs: 60000, severity: "critical" as AlertSeverity },
  suspiciousPatterns: { count: 10, windowMs: 300000, severity: "medium" as AlertSeverity },
  failedRequests: { count: 50, windowMs: 60000, severity: "medium" as AlertSeverity },
};

const eventCounts: Map<string, { count: number; resetTime: number }> = new Map();

function checkThreshold(eventType: keyof typeof alertThresholds): boolean {
  const threshold = alertThresholds[eventType];
  const now = Date.now();
  let record = eventCounts.get(eventType);

  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + threshold.windowMs };
  }

  record.count++;
  eventCounts.set(eventType, record);

  return record.count >= threshold.count;
}

export function triggerAlert(
  severity: AlertSeverity,
  type: string,
  message: string,
  details: Record<string, unknown> = {}
): void {
  const alert: SecurityAlert = {
    severity,
    type,
    message,
    details,
    timestamp: new Date(),
  };

  recentAlerts.unshift(alert);
  if (recentAlerts.length > MAX_ALERTS) {
    recentAlerts.pop();
  }

  const logLevel = severity === "critical" || severity === "high" ? "error" : "warn";
  securityLogger.log(logLevel, `SECURITY ALERT [${severity.toUpperCase()}]: ${message}`, {
    type,
    ...details,
  });

  if (severity === "critical") {
    console.error(`\n${"=".repeat(60)}`);
    console.error(`CRITICAL SECURITY ALERT: ${message}`);
    console.error(`Type: ${type}`);
    console.error(`Details: ${JSON.stringify(details, null, 2)}`);
    console.error(`${"=".repeat(60)}\n`);
  }
}

export function checkRateLimitAlert(ip: string, violations: number): void {
  if (checkThreshold("rateLimitViolations")) {
    triggerAlert("high", "rate_limit_abuse", "Multiple rate limit violations detected", {
      ip,
      violations,
      message: "Possible DDoS or brute force attempt",
    });
  }
}

export function checkCSRFAlert(ip: string, path: string): void {
  if (checkThreshold("csrfViolations")) {
    triggerAlert("critical", "csrf_attack", "Multiple CSRF violations detected", {
      ip,
      path,
      message: "Possible cross-site request forgery attack in progress",
    });
  }
}

export function checkSuspiciousPatternAlert(ip: string, pattern: string, path: string): void {
  if (checkThreshold("suspiciousPatterns")) {
    triggerAlert("medium", "suspicious_patterns", "Multiple suspicious request patterns detected", {
      ip,
      pattern,
      path,
      message: "Possible injection attack or vulnerability scanning",
    });
  }
}

export function getRecentAlerts(limit: number = 20): SecurityAlert[] {
  return recentAlerts.slice(0, limit);
}

export function getAlertStats(): {
  total: number;
  bySeverity: Record<AlertSeverity, number>;
  byType: Record<string, number>;
} {
  const bySeverity: Record<AlertSeverity, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  const byType: Record<string, number> = {};

  for (const alert of recentAlerts) {
    bySeverity[alert.severity]++;
    byType[alert.type] = (byType[alert.type] || 0) + 1;
  }

  return {
    total: recentAlerts.length,
    bySeverity,
    byType,
  };
}

setInterval(() => {
  const now = Date.now();
  Array.from(eventCounts.entries()).forEach(([key, record]) => {
    if (now > record.resetTime + 60000) {
      eventCounts.delete(key);
    }
  });
}, 300000);
