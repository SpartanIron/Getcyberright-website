import { storage } from '../storage';

interface SecurityEvent {
  type: 'failed_login' | 'rate_limit_exceeded' | 'suspicious_pattern' | 'brute_force' | 'csrf_violation' | 'invalid_token';
  ip: string;
  userAgent?: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Track security events by IP for pattern detection
const securityEventsByIP = new Map<string, { events: SecurityEvent[]; lastCleanup: number }>();
const EVENT_RETENTION_MS = 60 * 60 * 1000; // 1 hour

// Thresholds for alerting
const THRESHOLDS = {
  failedLogins: { count: 5, window: 15 * 60 * 1000, severity: 'high' as const },
  rateLimitHits: { count: 10, window: 5 * 60 * 1000, severity: 'medium' as const },
  suspiciousPatterns: { count: 3, window: 10 * 60 * 1000, severity: 'high' as const },
  csrfViolations: { count: 3, window: 10 * 60 * 1000, severity: 'critical' as const }
};

function cleanupOldEvents(ip: string): void {
  const entry = securityEventsByIP.get(ip);
  if (!entry) return;
  
  const now = Date.now();
  if (now - entry.lastCleanup > EVENT_RETENTION_MS) {
    const cutoff = now - EVENT_RETENTION_MS;
    entry.events = entry.events.filter(e => {
      const eventTime = (e as any).timestamp || 0;
      return eventTime > cutoff;
    });
    entry.lastCleanup = now;
  }
}

export function recordSecurityEvent(event: SecurityEvent): void {
  const ip = event.ip;
  const eventWithTime = { ...event, timestamp: Date.now() };
  
  if (!securityEventsByIP.has(ip)) {
    securityEventsByIP.set(ip, { events: [], lastCleanup: Date.now() });
  }
  
  const entry = securityEventsByIP.get(ip)!;
  cleanupOldEvents(ip);
  entry.events.push(eventWithTime as any);
  
  // Check for patterns and create alerts
  checkSecurityPatterns(ip);
  
  // Log to console for monitoring
  console.log(`[SecurityMonitor] ${event.severity.toUpperCase()}: ${event.type} from ${ip} - ${event.details}`);
}

async function checkSecurityPatterns(ip: string): Promise<void> {
  const entry = securityEventsByIP.get(ip);
  if (!entry) return;
  
  const now = Date.now();
  const events = entry.events as Array<SecurityEvent & { timestamp: number }>;
  
  // Check failed login threshold
  const recentFailedLogins = events.filter(
    e => e.type === 'failed_login' && 
    now - e.timestamp < THRESHOLDS.failedLogins.window
  );
  
  if (recentFailedLogins.length >= THRESHOLDS.failedLogins.count) {
    await createSecurityAlert(
      'Brute Force Attack Detected',
      `IP ${ip} has ${recentFailedLogins.length} failed login attempts in the last 15 minutes`,
      'critical',
      'auth'
    );
  }
  
  // Check rate limit threshold
  const recentRateLimits = events.filter(
    e => e.type === 'rate_limit_exceeded' && 
    now - e.timestamp < THRESHOLDS.rateLimitHits.window
  );
  
  if (recentRateLimits.length >= THRESHOLDS.rateLimitHits.count) {
    await createSecurityAlert(
      'Excessive Rate Limiting',
      `IP ${ip} hit rate limits ${recentRateLimits.length} times in the last 5 minutes. Possible abuse attempt.`,
      'medium',
      'system'
    );
  }
  
  // Check CSRF violations
  const recentCsrfViolations = events.filter(
    e => e.type === 'csrf_violation' && 
    now - e.timestamp < THRESHOLDS.csrfViolations.window
  );
  
  if (recentCsrfViolations.length >= THRESHOLDS.csrfViolations.count) {
    await createSecurityAlert(
      'CSRF Attack Attempt',
      `IP ${ip} has ${recentCsrfViolations.length} CSRF validation failures. Possible attack in progress.`,
      'critical',
      'auth'
    );
  }
}

async function createSecurityAlert(
  title: string, 
  description: string, 
  severity: 'low' | 'medium' | 'high' | 'critical',
  category: string
): Promise<void> {
  try {
    // Check for duplicate recent alerts
    const recentAlerts = await storage.getSecurityAlerts({ 
      severity, 
      limit: 10 
    });
    
    const duplicateExists = recentAlerts.some(alert => 
      alert.title === title && 
      alert.createdAt && 
      Date.now() - new Date(alert.createdAt).getTime() < 30 * 60 * 1000 // 30 minutes
    );
    
    if (duplicateExists) {
      console.log(`[SecurityMonitor] Skipping duplicate alert: ${title}`);
      return;
    }
    
    await storage.createSecurityAlert({
      title,
      description,
      severity,
      category,
      source: 'SecurityMonitor',
      sourceUrl: ''
    });
    
    console.log(`[SecurityMonitor] ALERT CREATED: ${title} (${severity})`);
  } catch (error) {
    console.error('[SecurityMonitor] Failed to create alert:', error);
  }
}

// Get summary of recent security events for monitoring dashboard
export function getSecurityEventsSummary(): {
  totalEvents: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  topOffendingIPs: Array<{ ip: string; count: number }>;
} {
  const summary = {
    totalEvents: 0,
    byType: {} as Record<string, number>,
    bySeverity: {} as Record<string, number>,
    topOffendingIPs: [] as Array<{ ip: string; count: number }>
  };
  
  const ipCounts: Record<string, number> = {};
  
  const entries = Array.from(securityEventsByIP.entries());
  for (const [ip, entry] of entries) {
    ipCounts[ip] = entry.events.length;
    
    for (const event of entry.events) {
      summary.totalEvents++;
      summary.byType[event.type] = (summary.byType[event.type] || 0) + 1;
      summary.bySeverity[event.severity] = (summary.bySeverity[event.severity] || 0) + 1;
    }
  }
  
  summary.topOffendingIPs = Object.entries(ipCounts)
    .map(([ip, count]) => ({ ip, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return summary;
}

export { SecurityEvent };
