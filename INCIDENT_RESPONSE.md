# GetCyberRight Incident Response Playbook

*Version 1.0 | February 2026*

---

## Table of Contents

1. [Overview](#overview)
2. [Incident Classification](#incident-classification)
3. [Response Team & Contacts](#response-team--contacts)
4. [Detection & Alerting](#detection--alerting)
5. [Incident Response Procedures](#incident-response-procedures)
6. [Post-Incident Activities](#post-incident-activities)
7. [MITRE ATT&CK Aligned Playbooks](#mitre-attck-aligned-playbooks)

---

## Overview

This document outlines the incident response procedures for GetCyberRight platform security events. All team members should be familiar with these procedures and their role in the response process.

### Goals

1. **Minimize Impact**: Reduce damage and recovery time
2. **Preserve Evidence**: Maintain logs and forensic data
3. **Communicate Effectively**: Keep stakeholders informed
4. **Learn & Improve**: Update defenses based on incidents

---

## Incident Classification

### Severity Levels

| Level | Name | Description | Response Time | Examples |
|-------|------|-------------|---------------|----------|
| P1 | Critical | Active breach, data exfiltration, service down | 15 minutes | SQL injection with data access, ransomware |
| P2 | High | Potential breach, significant vulnerability | 1 hour | Brute force attack, XSS exploitation |
| P3 | Medium | Suspicious activity, policy violation | 4 hours | Rate limit violations, anomaly detection alerts |
| P4 | Low | Minor issues, informational | 24 hours | Failed login attempts, scan probes |

### Incident Categories

1. **Unauthorized Access** - Credential compromise, privilege escalation
2. **Malware/Exploitation** - Code injection, malicious uploads
3. **Denial of Service** - Resource exhaustion, rate limit abuse
4. **Data Breach** - Unauthorized data access or exfiltration
5. **Social Engineering** - Phishing, impersonation attempts
6. **Insider Threat** - Malicious or negligent internal actions

---

## Response Team & Contacts

### Primary Contacts

| Role | Responsibility | Escalation Time |
|------|----------------|-----------------|
| On-Call Engineer | Initial triage, containment | Immediate |
| Security Lead | Investigation, forensics | 15 minutes |
| Platform Owner | Business decisions, communications | 30 minutes |
| Legal Counsel | Compliance, breach notification | 1 hour (P1/P2 only) |

### External Contacts

- **Hosting Provider**: Replit Support
- **Domain Registrar**: [As configured]
- **Law Enforcement**: FBI IC3 (ic3.gov) for cybercrime

---

## Detection & Alerting

### Automated Detection Sources

| Source | Location | Alert Type |
|--------|----------|------------|
| Security Logs | `/logs/security.log` | All security events |
| Incident Logs | `/logs/security-incidents.log` | Warning+ level events |
| Anomaly Detection | API response headers | X-Anomaly-Score > 75 |
| Rate Limiting | Security middleware | IP blocks, violations |

### Log Monitoring Commands

```bash
# View real-time security events
tail -f logs/security.log | jq

# Filter for warning/error events
tail -f logs/security-incidents.log | jq

# Check for anomaly alerts
grep "API anomaly detected" logs/security.log | jq

# View blocked IPs
grep "IP blocked" logs/security.log | jq '.ip'

# Check rate limit violations
grep "Rate limit exceeded" logs/security.log | jq
```

### Alert Triggers

| Alert | Threshold | Severity | Action |
|-------|-----------|----------|--------|
| Anomaly Score Critical | > 90 | P2 | Investigate immediately |
| Anomaly Score High | > 75 | P3 | Review within 4 hours |
| IP Blocked | 3+ violations | P3 | Check for attack pattern |
| Suspicious Pattern | XSS/SQLi detected | P2 | Investigate source |
| CSRF Attempt | Origin mismatch | P3 | Log and monitor |

---

## Incident Response Procedures

### Phase 1: Detection & Triage (0-15 minutes)

**Checklist:**

- [ ] Acknowledge alert receipt
- [ ] Verify alert is not false positive
- [ ] Classify severity level (P1-P4)
- [ ] Assign incident ID: `INC-YYYYMMDD-###`
- [ ] Notify appropriate team members

**Initial Assessment Questions:**

1. What systems/data are affected?
2. Is the attack ongoing?
3. What is the potential impact?
4. Do we have indicators of compromise (IoCs)?

### Phase 2: Containment (15-60 minutes)

**Immediate Actions (P1/P2):**

```bash
# Block attacking IP at application level
# Add to blocklist in security.ts or firewall

# If database compromise suspected:
# 1. Rotate database credentials
# 2. Review recent queries in logs
# 3. Check for unauthorized data access

# If session compromise suspected:
# 1. Invalidate all active sessions
# 2. Force password resets for affected users
# 3. Review authentication logs
```

**Short-term Containment:**

- [ ] Isolate affected components if needed
- [ ] Block malicious IPs/ranges
- [ ] Disable compromised accounts
- [ ] Preserve logs before rotation

### Phase 3: Eradication (1-24 hours)

**Remove Threat:**

- [ ] Identify root cause
- [ ] Remove malicious code/files
- [ ] Patch exploited vulnerabilities
- [ ] Reset compromised credentials
- [ ] Update security rules

**Verification:**

- [ ] Scan for additional compromise
- [ ] Verify no persistence mechanisms
- [ ] Test security controls

### Phase 4: Recovery (1-48 hours)

**Restore Operations:**

- [ ] Restore from clean backups if needed
- [ ] Redeploy affected components
- [ ] Re-enable services gradually
- [ ] Monitor for re-infection

**Validation:**

- [ ] Verify all services operational
- [ ] Confirm security controls effective
- [ ] Test user access

---

## Post-Incident Activities

### Documentation (Within 72 hours)

Create incident report containing:

1. **Executive Summary**: What happened, impact, resolution
2. **Timeline**: Detailed chronology of events
3. **Technical Analysis**: Attack vectors, vulnerabilities exploited
4. **Impact Assessment**: Data affected, users impacted
5. **Response Evaluation**: What worked, what didn't
6. **Recommendations**: Improvements to prevent recurrence

### Lessons Learned Meeting

- Schedule within 1 week of incident closure
- Include all response team members
- Document action items with owners and deadlines

### Security Improvements

Based on incident findings:

- [ ] Update detection rules
- [ ] Enhance monitoring
- [ ] Patch vulnerabilities
- [ ] Update this playbook
- [ ] Conduct additional training if needed

---

## MITRE ATT&CK Aligned Playbooks

### T1190 - Exploit Public-Facing Application

**Detection Indicators:**
- Suspicious patterns in request logs (XSS, SQLi)
- Unusual error rates (500s)
- Anomaly detection alerts

**Response Steps:**
1. Identify attack vector from logs
2. Block attacking IP
3. Review application logs for successful exploitation
4. Check for data access if SQLi
5. Patch vulnerable endpoint
6. Deploy additional WAF rules

**Log Query:**
```bash
grep -E "(SQL injection|XSS|script)" logs/security.log
```

### T1110 - Brute Force

**Detection Indicators:**
- Multiple failed login attempts
- Rate limit violations from single IP
- Account lockout events

**Response Steps:**
1. Confirm attack vs. legitimate user lockout
2. Block attacking IP/range
3. Review affected accounts
4. Check for successful authentication
5. Force password reset if compromise suspected
6. Consider CAPTCHA or additional verification

**Log Query:**
```bash
grep "Rate limit exceeded" logs/security.log | jq -r '.ip' | sort | uniq -c | sort -rn
```

### T1539 - Steal Web Session Cookie

**Detection Indicators:**
- XSS alerts in logs
- Session used from unusual IP
- Cookie manipulation attempts

**Response Steps:**
1. Identify affected sessions
2. Invalidate suspicious sessions
3. Review XSS attack vector
4. Patch XSS vulnerability
5. Force re-authentication for affected users

**Log Query:**
```bash
grep "Suspicious request pattern" logs/security.log | grep -i "script"
```

### T1071 - Application Layer Protocol (API Abuse)

**Detection Indicators:**
- High anomaly scores
- Unusual endpoint access patterns
- API scraping behavior

**Response Steps:**
1. Review anomaly detection alerts
2. Identify unusual access patterns
3. Block abusive clients
4. Rate limit affected endpoints
5. Consider API key rotation if applicable

**Log Query:**
```bash
grep "API anomaly detected" logs/security.log | jq '{ip: .ip, score: .score, reasons: .reasons}'
```

---

## Quick Reference Card

### Incident Response Checklist

```
[ ] 1. Detect: Alert received and acknowledged
[ ] 2. Triage: Severity classified (P1-P4)
[ ] 3. Contain: Threat isolated
[ ] 4. Communicate: Team notified
[ ] 5. Investigate: Root cause identified
[ ] 6. Eradicate: Threat removed
[ ] 7. Recover: Services restored
[ ] 8. Document: Report completed
[ ] 9. Improve: Lessons learned applied
```

### Emergency Commands

```bash
# View active security alerts
tail -100 logs/security-incidents.log | jq

# Check anomaly detection status
curl localhost:5000/api/security/metrics

# View rate-limited IPs
grep "IP blocked" logs/security.log | tail -20 | jq '.ip'

# Export logs for forensics
tar -czf security-logs-$(date +%Y%m%d).tar.gz logs/
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 2026 | Security Team | Initial release |

---

*This document should be reviewed quarterly and updated after each significant incident.*
