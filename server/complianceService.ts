import { db } from "./db";
import { complianceControlFamilies, complianceControls, complianceAssessments } from "@shared/schema";
import { eq } from "drizzle-orm";

interface ControlFamily {
  id: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
}

interface Control {
  id: string;
  familyId: string;
  name: string;
  description: string;
  priority: "low" | "moderate" | "high";
  platformFeatures?: string[];
  evidence?: string[];
  implementationStatus: "implemented" | "partial" | "planned" | "not_implemented" | "not_applicable";
  gaps?: string[];
  recommendations?: string;
}

const NIST_CONTROL_FAMILIES: ControlFamily[] = [
  { id: "AC", name: "Access Control", description: "Controls for managing system access, user accounts, and privileges", priority: "critical" },
  { id: "AU", name: "Audit and Accountability", description: "Controls for event logging, audit record review, and accountability", priority: "high" },
  { id: "AT", name: "Awareness and Training", description: "Controls for security awareness and training programs", priority: "medium" },
  { id: "CA", name: "Assessment, Authorization, and Monitoring", description: "Controls for security assessments, authorizations, and continuous monitoring", priority: "high" },
  { id: "CM", name: "Configuration Management", description: "Controls for baseline configurations and change management", priority: "high" },
  { id: "CP", name: "Contingency Planning", description: "Controls for backup, recovery, and business continuity", priority: "medium" },
  { id: "IA", name: "Identification and Authentication", description: "Controls for user identification and authentication mechanisms", priority: "critical" },
  { id: "IR", name: "Incident Response", description: "Controls for incident handling, monitoring, and response", priority: "high" },
  { id: "MA", name: "Maintenance", description: "Controls for system maintenance procedures", priority: "low" },
  { id: "MP", name: "Media Protection", description: "Controls for protecting digital and physical media", priority: "low" },
  { id: "PE", name: "Physical and Environmental Protection", description: "Controls for physical access and environmental safeguards", priority: "low" },
  { id: "PL", name: "Planning", description: "Controls for security planning documentation", priority: "medium" },
  { id: "PM", name: "Program Management", description: "Controls for information security program management", priority: "medium" },
  { id: "PS", name: "Personnel Security", description: "Controls for personnel screening and termination", priority: "low" },
  { id: "PT", name: "PII Processing and Transparency", description: "Controls for personally identifiable information handling", priority: "high" },
  { id: "RA", name: "Risk Assessment", description: "Controls for risk identification and assessment", priority: "high" },
  { id: "SA", name: "System and Services Acquisition", description: "Controls for system development and acquisition", priority: "medium" },
  { id: "SC", name: "System and Communications Protection", description: "Controls for network security, encryption, and data protection", priority: "critical" },
  { id: "SI", name: "System and Information Integrity", description: "Controls for malware protection, system monitoring, and error handling", priority: "critical" },
  { id: "SR", name: "Supply Chain Risk Management", description: "Controls for managing supply chain risks", priority: "medium" },
];

const PLATFORM_CONTROLS: Control[] = [
  // Access Control (AC) Family
  {
    id: "AC-1",
    familyId: "AC",
    name: "Policy and Procedures",
    description: "Develop, document, and maintain access control policies and procedures",
    priority: "moderate",
    platformFeatures: ["Admin security dashboard", "Role-based access control documentation"],
    evidence: ["Security policy documented in replit.md", "Admin dashboard at /admin/security"],
    implementationStatus: "partial",
    gaps: ["Formal policy document not externally published"],
    recommendations: "Create downloadable security policy PDF for transparency"
  },
  {
    id: "AC-2",
    familyId: "AC",
    name: "Account Management",
    description: "Manage system accounts including creation, modification, disabling, and removal",
    priority: "high",
    platformFeatures: ["User registration system", "Email verification", "Session management", "Account disable functionality"],
    evidence: ["users table with isVerified, isActive flags", "Session tracking in sessions table", "Email verification flow"],
    implementationStatus: "implemented"
  },
  {
    id: "AC-3",
    familyId: "AC",
    name: "Access Enforcement",
    description: "Enforce approved authorizations for logical access to information and system resources",
    priority: "high",
    platformFeatures: ["Role-based access (isAdmin flag)", "Session-based authentication", "Protected API routes"],
    evidence: ["requireAuth middleware", "isAdmin checks on admin routes", "Session validation"],
    implementationStatus: "implemented"
  },
  {
    id: "AC-6",
    familyId: "AC",
    name: "Least Privilege",
    description: "Employ the principle of least privilege, allowing only authorized accesses",
    priority: "high",
    platformFeatures: ["Tiered subscription access", "Admin-only routes", "Feature gating by subscription tier"],
    evidence: ["hasTierAccess() function", "Admin route guards", "Subscription tier checks"],
    implementationStatus: "implemented"
  },
  {
    id: "AC-7",
    familyId: "AC",
    name: "Unsuccessful Logon Attempts",
    description: "Enforce a limit of consecutive invalid logon attempts and lock accounts",
    priority: "high",
    platformFeatures: ["Rate limiting on login endpoint", "IP-based tracking"],
    evidence: ["Rate limiting middleware", "Login attempt throttling"],
    implementationStatus: "partial",
    gaps: ["Account lockout after failed attempts not implemented"],
    recommendations: "Add account lockout after 5 failed login attempts with 15-minute timeout"
  },
  {
    id: "AC-8",
    familyId: "AC",
    name: "System Use Notification",
    description: "Display approved system use notification message before granting access",
    priority: "low",
    platformFeatures: ["Terms of service", "Privacy policy"],
    evidence: ["Footer links to terms/privacy"],
    implementationStatus: "partial",
    gaps: ["No login banner/notification displayed"],
    recommendations: "Add consent checkbox during registration"
  },
  {
    id: "AC-11",
    familyId: "AC",
    name: "Device Lock",
    description: "Prevent access to the system by initiating a session lock",
    priority: "moderate",
    platformFeatures: ["Session timeout", "Automatic logout"],
    evidence: ["Session expiration in PostgreSQL sessions"],
    implementationStatus: "implemented"
  },
  {
    id: "AC-12",
    familyId: "AC",
    name: "Session Termination",
    description: "Automatically terminate a session after a defined condition",
    priority: "moderate",
    platformFeatures: ["Session expiration", "Logout functionality"],
    evidence: ["Session middleware with expiry", "Logout API endpoint"],
    implementationStatus: "implemented"
  },
  {
    id: "AC-17",
    familyId: "AC",
    name: "Remote Access",
    description: "Establish and document usage restrictions for remote access",
    priority: "high",
    platformFeatures: ["HTTPS only access", "Session-based authentication"],
    evidence: ["TLS/HTTPS enforcement", "Secure cookie settings"],
    implementationStatus: "implemented"
  },

  // Audit and Accountability (AU) Family
  {
    id: "AU-1",
    familyId: "AU",
    name: "Policy and Procedures",
    description: "Develop, document, and maintain audit and accountability policies",
    priority: "moderate",
    platformFeatures: ["Winston logging system", "Security event logging"],
    evidence: ["Winston logger configuration", "Audit log tables"],
    implementationStatus: "partial",
    gaps: ["Formal audit policy document not published"],
    recommendations: "Document audit retention and review procedures"
  },
  {
    id: "AU-2",
    familyId: "AU",
    name: "Event Logging",
    description: "Identify and log security-relevant events",
    priority: "high",
    platformFeatures: ["Winston security logging", "API anomaly detection", "Content audit log", "Feed run logging"],
    evidence: ["Security event logging in routes", "content_audit_log table", "feed_runs table", "Admin security dashboard"],
    implementationStatus: "implemented"
  },
  {
    id: "AU-3",
    familyId: "AU",
    name: "Content of Audit Records",
    description: "Audit records contain sufficient information to establish what occurred",
    priority: "high",
    platformFeatures: ["Structured logging with timestamps, user IDs, actions"],
    evidence: ["Log format includes timestamp, level, message, metadata", "Audit tables with performedBy, action, createdAt"],
    implementationStatus: "implemented"
  },
  {
    id: "AU-6",
    familyId: "AU",
    name: "Audit Record Review, Analysis, and Reporting",
    description: "Review and analyze audit records for indications of inappropriate activity",
    priority: "high",
    platformFeatures: ["Admin security dashboard", "Real-time security monitoring", "Threat intelligence dashboard"],
    evidence: ["/admin/security dashboard", "/admin/threat-intelligence dashboard", "Alert management UI"],
    implementationStatus: "implemented"
  },
  {
    id: "AU-8",
    familyId: "AU",
    name: "Time Stamps",
    description: "Use internal system clocks to generate time stamps for audit records",
    priority: "moderate",
    platformFeatures: ["PostgreSQL timestamps", "Server-side timestamp generation"],
    evidence: ["createdAt columns with defaultNow()", "Consistent UTC timestamps"],
    implementationStatus: "implemented"
  },
  {
    id: "AU-12",
    familyId: "AU",
    name: "Audit Record Generation",
    description: "Generate audit records for defined events",
    priority: "high",
    platformFeatures: ["Automatic audit logging", "Security event capture"],
    evidence: ["Winston logging integration", "Database audit tables"],
    implementationStatus: "implemented"
  },

  // Identification and Authentication (IA) Family
  {
    id: "IA-1",
    familyId: "IA",
    name: "Policy and Procedures",
    description: "Develop, document, and maintain identification and authentication policies",
    priority: "moderate",
    platformFeatures: ["Authentication system documentation"],
    evidence: ["Auth system documented in replit.md"],
    implementationStatus: "partial",
    gaps: ["No formal authentication policy document"],
    recommendations: "Create authentication policy page"
  },
  {
    id: "IA-2",
    familyId: "IA",
    name: "Identification and Authentication (Organizational Users)",
    description: "Uniquely identify and authenticate organizational users",
    priority: "high",
    platformFeatures: ["Email/password authentication", "TOTP MFA", "Backup codes", "Replit OAuth"],
    evidence: ["bcrypt password hashing", "speakeasy TOTP", "Backup code system", "OIDC integration"],
    implementationStatus: "implemented"
  },
  {
    id: "IA-2(1)",
    familyId: "IA",
    name: "Multi-Factor Authentication to Privileged Accounts",
    description: "Implement multi-factor authentication for access to privileged accounts",
    priority: "high",
    platformFeatures: ["TOTP-based MFA", "QR code setup", "Backup codes"],
    evidence: ["speakeasy TOTP implementation", "MFA setup flow", "Backup code generation"],
    implementationStatus: "implemented"
  },
  {
    id: "IA-5",
    familyId: "IA",
    name: "Authenticator Management",
    description: "Manage system authenticators by verifying identity before issuance",
    priority: "high",
    platformFeatures: ["Email verification", "Password reset flow", "MFA enrollment"],
    evidence: ["Email verification tokens", "Password reset tokens", "MFA setup requires authentication"],
    implementationStatus: "implemented"
  },
  {
    id: "IA-5(1)",
    familyId: "IA",
    name: "Password-Based Authentication",
    description: "For password-based authentication, enforce password complexity",
    priority: "high",
    platformFeatures: ["Password validation", "bcrypt hashing"],
    evidence: ["Zod password validation schema", "bcrypt with cost factor"],
    implementationStatus: "partial",
    gaps: ["Password complexity requirements could be stronger"],
    recommendations: "Enforce minimum 12 characters, uppercase, lowercase, numbers, special characters"
  },
  {
    id: "IA-6",
    familyId: "IA",
    name: "Authentication Feedback",
    description: "Obscure feedback of authentication information during authentication",
    priority: "moderate",
    platformFeatures: ["Generic error messages", "No username enumeration"],
    evidence: ["Login returns generic 'Invalid credentials' message"],
    implementationStatus: "implemented"
  },
  {
    id: "IA-8",
    familyId: "IA",
    name: "Identification and Authentication (Non-Organizational Users)",
    description: "Uniquely identify and authenticate non-organizational users",
    priority: "moderate",
    platformFeatures: ["Public user registration", "Email verification"],
    evidence: ["User registration flow", "Email verification requirement"],
    implementationStatus: "implemented"
  },

  // System and Communications Protection (SC) Family
  {
    id: "SC-1",
    familyId: "SC",
    name: "Policy and Procedures",
    description: "Develop, document, and maintain system and communications protection policies",
    priority: "moderate",
    platformFeatures: ["Security architecture documentation"],
    evidence: ["Security section in replit.md"],
    implementationStatus: "partial",
    gaps: ["No formal network security policy"],
    recommendations: "Document network security and encryption policies"
  },
  {
    id: "SC-5",
    familyId: "SC",
    name: "Denial-of-Service Protection",
    description: "Protect against or limit effects of denial-of-service attacks",
    priority: "high",
    platformFeatures: ["Rate limiting", "IP-based throttling", "Auto-blocking"],
    evidence: ["Three-tier rate limiting system", "IP blocking for excessive requests", "Payload size limits"],
    implementationStatus: "implemented"
  },
  {
    id: "SC-7",
    familyId: "SC",
    name: "Boundary Protection",
    description: "Monitor and control communications at external managed interfaces",
    priority: "high",
    platformFeatures: ["CSRF protection", "CORS configuration", "Request validation"],
    evidence: ["Origin/Referer header validation", "CORS headers", "Input validation"],
    implementationStatus: "implemented"
  },
  {
    id: "SC-8",
    familyId: "SC",
    name: "Transmission Confidentiality and Integrity",
    description: "Protect the confidentiality and integrity of transmitted information",
    priority: "high",
    platformFeatures: ["HTTPS enforcement", "Secure cookies", "TLS"],
    evidence: ["Replit TLS termination", "Secure cookie flags", "HTTPS redirects"],
    implementationStatus: "implemented"
  },
  {
    id: "SC-12",
    familyId: "SC",
    name: "Cryptographic Key Establishment and Management",
    description: "Establish and manage cryptographic keys when cryptography is employed",
    priority: "high",
    platformFeatures: ["Session secrets", "Password hashing", "MFA secrets"],
    evidence: ["SESSION_SECRET environment variable", "bcrypt key derivation", "TOTP secret management"],
    implementationStatus: "implemented"
  },
  {
    id: "SC-13",
    familyId: "SC",
    name: "Cryptographic Protection",
    description: "Implement cryptographic mechanisms to prevent unauthorized disclosure",
    priority: "high",
    platformFeatures: ["bcrypt password hashing", "TOTP secrets", "Secure random generation"],
    evidence: ["bcrypt with work factor", "crypto.randomBytes for tokens", "speakeasy TOTP"],
    implementationStatus: "implemented"
  },
  {
    id: "SC-23",
    familyId: "SC",
    name: "Session Authenticity",
    description: "Protect the authenticity of communications sessions",
    priority: "high",
    platformFeatures: ["Session cookies", "CSRF tokens", "Session validation"],
    evidence: ["express-session with PostgreSQL store", "CSRF header validation", "Session binding to user"],
    implementationStatus: "implemented"
  },

  // System and Information Integrity (SI) Family
  {
    id: "SI-1",
    familyId: "SI",
    name: "Policy and Procedures",
    description: "Develop, document, and maintain system and information integrity policies",
    priority: "moderate",
    platformFeatures: ["Integrity monitoring documentation"],
    evidence: ["Security architecture in replit.md"],
    implementationStatus: "partial",
    gaps: ["No formal integrity policy document"],
    recommendations: "Document data integrity and validation policies"
  },
  {
    id: "SI-2",
    familyId: "SI",
    name: "Flaw Remediation",
    description: "Identify, report, and correct system flaws",
    priority: "high",
    platformFeatures: ["Dependency management", "npm audit"],
    evidence: ["package.json dependency management", "Node.js security updates"],
    implementationStatus: "partial",
    gaps: ["No automated vulnerability scanning"],
    recommendations: "Integrate npm audit into CI/CD pipeline"
  },
  {
    id: "SI-3",
    familyId: "SI",
    name: "Malicious Code Protection",
    description: "Implement malicious code protection that detects and eradicates malicious code",
    priority: "high",
    platformFeatures: ["XSS detection", "SQL injection detection", "Input sanitization"],
    evidence: ["XSS/SQLi pattern detection in request validation", "Content Security Policy via Helmet.js"],
    implementationStatus: "implemented"
  },
  {
    id: "SI-4",
    familyId: "SI",
    name: "System Monitoring",
    description: "Monitor the system to detect attacks and indicators of potential attacks",
    priority: "high",
    platformFeatures: ["API anomaly detection", "Rate limit monitoring", "Security dashboard"],
    evidence: ["Anomaly detection on /api routes", "Admin security dashboard", "Threat intelligence integration"],
    implementationStatus: "implemented"
  },
  {
    id: "SI-5",
    familyId: "SI",
    name: "Security Alerts, Advisories, and Directives",
    description: "Receive and act on security alerts and advisories",
    priority: "high",
    platformFeatures: ["Threat intelligence feeds", "Feed health monitoring", "Admin alerts"],
    evidence: ["8-source threat intelligence system", "Feed health alerts", "Admin threat dashboard"],
    implementationStatus: "implemented"
  },
  {
    id: "SI-10",
    familyId: "SI",
    name: "Information Input Validation",
    description: "Check the validity of information inputs",
    priority: "high",
    platformFeatures: ["Zod schema validation", "Request body validation", "Type checking"],
    evidence: ["Zod schemas for all API inputs", "drizzle-zod integration", "TypeScript type safety"],
    implementationStatus: "implemented"
  },
  {
    id: "SI-11",
    familyId: "SI",
    name: "Error Handling",
    description: "Generate error messages that provide required information without revealing sensitive data",
    priority: "moderate",
    platformFeatures: ["Generic error responses", "Structured error handling"],
    evidence: ["Error responses don't expose stack traces", "User-friendly error messages"],
    implementationStatus: "implemented"
  },

  // Risk Assessment (RA) Family
  {
    id: "RA-1",
    familyId: "RA",
    name: "Policy and Procedures",
    description: "Develop, document, and maintain risk assessment policies",
    priority: "moderate",
    platformFeatures: ["Risk assessment documentation"],
    evidence: ["Security section in replit.md"],
    implementationStatus: "partial",
    gaps: ["No formal risk assessment policy"],
    recommendations: "Create risk assessment methodology document"
  },
  {
    id: "RA-3",
    familyId: "RA",
    name: "Risk Assessment",
    description: "Conduct risk assessments and update risk assessments periodically",
    priority: "high",
    platformFeatures: ["Threat intelligence analysis", "Content governance", "Compliance dashboard"],
    evidence: ["Threat intelligence integration", "Content freshness scoring", "NIST 800-53 mapping"],
    implementationStatus: "implemented"
  },
  {
    id: "RA-5",
    familyId: "RA",
    name: "Vulnerability Monitoring and Scanning",
    description: "Monitor and scan for vulnerabilities in the system",
    priority: "high",
    platformFeatures: ["External threat feeds", "URL scanning tools"],
    evidence: ["URLhaus, PhishTank, NVD feeds", "Advanced security scanner", "Google Safe Browsing integration"],
    implementationStatus: "implemented"
  },

  // Incident Response (IR) Family
  {
    id: "IR-1",
    familyId: "IR",
    name: "Policy and Procedures",
    description: "Develop, document, and maintain incident response policies",
    priority: "moderate",
    platformFeatures: ["Incident tracking capability"],
    evidence: ["Feed health alerts", "Security logging"],
    implementationStatus: "partial",
    gaps: ["No formal incident response plan"],
    recommendations: "Create incident response playbook"
  },
  {
    id: "IR-4",
    familyId: "IR",
    name: "Incident Handling",
    description: "Implement incident handling capability",
    priority: "high",
    platformFeatures: ["Alert management", "Threat tracking", "Admin notifications"],
    evidence: ["Feed health alert acknowledgment", "Security dashboard monitoring"],
    implementationStatus: "partial",
    gaps: ["No automated incident escalation"],
    recommendations: "Add email/Slack notifications for critical incidents"
  },
  {
    id: "IR-5",
    familyId: "IR",
    name: "Incident Monitoring",
    description: "Track and document incidents on an ongoing basis",
    priority: "high",
    platformFeatures: ["Security event logging", "Admin dashboard"],
    evidence: ["Winston security logs", "Admin security dashboard", "Audit tables"],
    implementationStatus: "implemented"
  },
  {
    id: "IR-6",
    familyId: "IR",
    name: "Incident Reporting",
    description: "Report incidents to organizational authorities",
    priority: "moderate",
    platformFeatures: ["Admin dashboard visibility"],
    evidence: ["Security dashboard for admin review"],
    implementationStatus: "partial",
    gaps: ["No external incident reporting mechanism"],
    recommendations: "Add incident report export functionality"
  },

  // Awareness and Training (AT) Family
  {
    id: "AT-1",
    familyId: "AT",
    name: "Policy and Procedures",
    description: "Develop, document, and maintain awareness and training policies",
    priority: "moderate",
    platformFeatures: ["Platform is educational by design"],
    evidence: ["Educational content across all audience hubs"],
    implementationStatus: "implemented"
  },
  {
    id: "AT-2",
    familyId: "AT",
    name: "Literacy Training and Awareness",
    description: "Provide security literacy training to users",
    priority: "high",
    platformFeatures: ["Kids Hub", "Seniors Hub", "Parents Hub", "Educators Hub", "Business Hub", "Interactive quizzes"],
    evidence: ["5 audience-specific educational hubs", "Gamification system", "Dezi AI assistant"],
    implementationStatus: "implemented"
  },
  {
    id: "AT-3",
    familyId: "AT",
    name: "Role-Based Training",
    description: "Provide role-based training to personnel with assigned security roles",
    priority: "moderate",
    platformFeatures: ["Audience-specific content", "Role-based learning paths"],
    evidence: ["Kids, Seniors, Parents, Educators, Business hubs with tailored content"],
    implementationStatus: "implemented"
  },

  // Configuration Management (CM) Family
  {
    id: "CM-1",
    familyId: "CM",
    name: "Policy and Procedures",
    description: "Develop, document, and maintain configuration management policies",
    priority: "moderate",
    platformFeatures: ["Code versioning", "Environment configuration"],
    evidence: ["Git version control", "Environment variables management"],
    implementationStatus: "partial",
    gaps: ["No formal change management process"],
    recommendations: "Document configuration change procedures"
  },
  {
    id: "CM-2",
    familyId: "CM",
    name: "Baseline Configuration",
    description: "Develop, document, and maintain baseline configuration of the system",
    priority: "high",
    platformFeatures: ["Infrastructure as code", "Declarative configuration"],
    evidence: ["package.json dependencies", "drizzle.config.ts", "Replit configuration"],
    implementationStatus: "implemented"
  },
  {
    id: "CM-3",
    familyId: "CM",
    name: "Configuration Change Control",
    description: "Determine and document changes to the system",
    priority: "high",
    platformFeatures: ["Git version control", "Checkpoint system"],
    evidence: ["Git commit history", "Replit checkpoints"],
    implementationStatus: "implemented"
  },
  {
    id: "CM-7",
    familyId: "CM",
    name: "Least Functionality",
    description: "Configure the system to provide only essential capabilities",
    priority: "moderate",
    platformFeatures: ["Minimal dependencies", "Feature gating"],
    evidence: ["Limited package dependencies", "Subscription-based feature access"],
    implementationStatus: "implemented"
  },

  // PII Processing and Transparency (PT) Family
  {
    id: "PT-1",
    familyId: "PT",
    name: "Policy and Procedures",
    description: "Develop, document, and maintain PII handling policies",
    priority: "high",
    platformFeatures: ["Privacy policy", "Data handling documentation"],
    evidence: ["Privacy policy page", "Terms of service"],
    implementationStatus: "partial",
    gaps: ["Detailed data inventory not documented"],
    recommendations: "Create comprehensive data inventory and retention policy"
  },
  {
    id: "PT-2",
    familyId: "PT",
    name: "Authority to Process Personally Identifiable Information",
    description: "Determine and document the legal authority for collecting PII",
    priority: "high",
    platformFeatures: ["User consent", "Terms acceptance"],
    evidence: ["User registration with implied consent", "Terms of service"],
    implementationStatus: "partial",
    gaps: ["Explicit consent mechanism could be stronger"],
    recommendations: "Add explicit consent checkboxes during registration"
  },
  {
    id: "PT-3",
    familyId: "PT",
    name: "Personally Identifiable Information Processing Purposes",
    description: "Identify and document the purposes for PII processing",
    priority: "high",
    platformFeatures: ["Limited PII collection", "Purpose-specific data use"],
    evidence: ["Only email/password collected", "No data sold to third parties"],
    implementationStatus: "partial",
    gaps: ["Processing purposes not explicitly documented"],
    recommendations: "Add detailed PII processing documentation"
  },

  // Contingency Planning (CP) Family
  {
    id: "CP-1",
    familyId: "CP",
    name: "Policy and Procedures",
    description: "Develop, document, and maintain contingency planning policies",
    priority: "moderate",
    platformFeatures: ["Platform backup capabilities"],
    evidence: ["Replit checkpoint system", "Database backups"],
    implementationStatus: "partial",
    gaps: ["No formal contingency plan"],
    recommendations: "Document disaster recovery procedures"
  },
  {
    id: "CP-9",
    familyId: "CP",
    name: "System Backup",
    description: "Conduct backups of system-level information",
    priority: "high",
    platformFeatures: ["Replit checkpoints", "PostgreSQL backups", "Git history"],
    evidence: ["Automatic checkpoint creation", "Database managed by Neon", "Git version control"],
    implementationStatus: "implemented"
  },
  {
    id: "CP-10",
    familyId: "CP",
    name: "System Recovery and Reconstitution",
    description: "Provide for the recovery and reconstitution of the system",
    priority: "high",
    platformFeatures: ["Rollback capability", "Checkpoint restoration"],
    evidence: ["Replit rollback UI", "Database rollback capability"],
    implementationStatus: "implemented"
  },

  // Other families with minimal applicability
  {
    id: "PE-1",
    familyId: "PE",
    name: "Physical Security Policy",
    description: "Physical and environmental protection policies",
    priority: "low",
    implementationStatus: "not_applicable",
    recommendations: "Cloud-hosted platform - physical security managed by Replit/cloud provider"
  },
  {
    id: "MA-1",
    familyId: "MA",
    name: "Maintenance Policy",
    description: "System maintenance policies and procedures",
    priority: "low",
    implementationStatus: "not_applicable",
    recommendations: "Cloud-hosted platform - maintenance managed by Replit"
  },
  {
    id: "MP-1",
    familyId: "MP",
    name: "Media Protection Policy",
    description: "Media protection policies and procedures",
    priority: "low",
    implementationStatus: "not_applicable",
    recommendations: "Cloud-hosted platform - no physical media to protect"
  },
  {
    id: "PS-1",
    familyId: "PS",
    name: "Personnel Security Policy",
    description: "Personnel security policies and procedures",
    priority: "low",
    platformFeatures: ["Single operator platform"],
    implementationStatus: "not_applicable",
    recommendations: "Small team operation - formal personnel security N/A"
  },
  {
    id: "PL-1",
    familyId: "PL",
    name: "Planning Policy",
    description: "Security planning policies and documentation",
    priority: "moderate",
    platformFeatures: ["Security documentation"],
    evidence: ["replit.md security documentation"],
    implementationStatus: "partial",
    gaps: ["Formal security plan not published"],
    recommendations: "Create public security whitepaper"
  },
  {
    id: "SA-1",
    familyId: "SA",
    name: "System Acquisition Policy",
    description: "System and services acquisition policies",
    priority: "moderate",
    platformFeatures: ["Dependency management"],
    evidence: ["npm package management", "Dependency review"],
    implementationStatus: "partial",
    gaps: ["No formal vendor assessment process"],
    recommendations: "Document third-party package vetting process"
  },
  {
    id: "SR-1",
    familyId: "SR",
    name: "Supply Chain Policy",
    description: "Supply chain risk management policies",
    priority: "moderate",
    platformFeatures: ["Dependency auditing"],
    evidence: ["npm audit capability"],
    implementationStatus: "partial",
    gaps: ["No formal supply chain assessment"],
    recommendations: "Implement automated dependency vulnerability scanning"
  },
  {
    id: "PM-1",
    familyId: "PM",
    name: "Information Security Program Plan",
    description: "Develop and disseminate an organization-wide security program plan",
    priority: "moderate",
    platformFeatures: ["Security documentation"],
    evidence: ["Security architecture documented"],
    implementationStatus: "partial",
    gaps: ["No formal security program document"],
    recommendations: "Create comprehensive security program plan"
  },
];

export class ComplianceService {
  async initialize() {
    console.log("[compliance] Initializing NIST 800-53 Compliance Service...");
    await this.seedControlFamilies();
    await this.seedControls();
    await this.calculateFamilyScores();
    console.log("[compliance] NIST 800-53 Compliance Service initialized");
  }

  private async seedControlFamilies() {
    for (const family of NIST_CONTROL_FAMILIES) {
      const existing = await db.select().from(complianceControlFamilies).where(eq(complianceControlFamilies.id, family.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(complianceControlFamilies).values({
          id: family.id,
          name: family.name,
          description: family.description,
          priority: family.priority,
          totalControls: 0,
          implementedControls: 0,
          partialControls: 0,
          notApplicableControls: 0,
          complianceScore: 0,
        });
      }
    }
  }

  private async seedControls() {
    for (const control of PLATFORM_CONTROLS) {
      const existing = await db.select().from(complianceControls).where(eq(complianceControls.id, control.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(complianceControls).values({
          id: control.id,
          familyId: control.familyId,
          name: control.name,
          description: control.description,
          priority: control.priority,
          implementationStatus: control.implementationStatus,
          evidence: control.evidence ? JSON.stringify(control.evidence) : null,
          platformFeatures: control.platformFeatures ? JSON.stringify(control.platformFeatures) : null,
          gaps: control.gaps ? JSON.stringify(control.gaps) : null,
          recommendations: control.recommendations || null,
          lastAssessment: new Date(),
        });
      }
    }
  }

  private async calculateFamilyScores() {
    const allControls = await db.select().from(complianceControls);
    const familyStats: Record<string, { total: number; implemented: number; partial: number; notApplicable: number }> = {};

    for (const control of allControls) {
      if (!familyStats[control.familyId]) {
        familyStats[control.familyId] = { total: 0, implemented: 0, partial: 0, notApplicable: 0 };
      }
      familyStats[control.familyId].total++;
      if (control.implementationStatus === "implemented") {
        familyStats[control.familyId].implemented++;
      } else if (control.implementationStatus === "partial") {
        familyStats[control.familyId].partial++;
      } else if (control.implementationStatus === "not_applicable") {
        familyStats[control.familyId].notApplicable++;
      }
    }

    for (const [familyId, stats] of Object.entries(familyStats)) {
      const applicableControls = stats.total - stats.notApplicable;
      const score = applicableControls > 0 
        ? Math.round(((stats.implemented + stats.partial * 0.5) / applicableControls) * 100)
        : 100;
      
      await db.update(complianceControlFamilies)
        .set({
          totalControls: stats.total,
          implementedControls: stats.implemented,
          partialControls: stats.partial,
          notApplicableControls: stats.notApplicable,
          complianceScore: score,
          lastAssessment: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(complianceControlFamilies.id, familyId));
    }
  }

  async getStats() {
    const families = await db.select().from(complianceControlFamilies);
    const controls = await db.select().from(complianceControls);

    const totalControls = controls.length;
    const implementedControls = controls.filter(c => c.implementationStatus === "implemented").length;
    const partialControls = controls.filter(c => c.implementationStatus === "partial").length;
    const notImplementedControls = controls.filter(c => c.implementationStatus === "not_implemented" || c.implementationStatus === "planned").length;
    const notApplicableControls = controls.filter(c => c.implementationStatus === "not_applicable").length;

    const applicableControls = totalControls - notApplicableControls;
    const overallScore = applicableControls > 0 
      ? Math.round(((implementedControls + partialControls * 0.5) / applicableControls) * 100)
      : 0;

    const gapsCount = controls.filter(c => c.gaps && JSON.parse(c.gaps).length > 0).length;
    const criticalFamilies = families.filter(f => f.priority === "critical");
    const criticalScore = criticalFamilies.length > 0
      ? Math.round(criticalFamilies.reduce((sum, f) => sum + (f.complianceScore || 0), 0) / criticalFamilies.length)
      : 0;

    return {
      totalControls,
      implementedControls,
      partialControls,
      notImplementedControls,
      notApplicableControls,
      applicableControls,
      overallScore,
      criticalScore,
      gapsCount,
      familyCount: families.length,
    };
  }

  async getFamilies() {
    return db.select().from(complianceControlFamilies).orderBy(complianceControlFamilies.priority);
  }

  async getControls(familyId?: string) {
    if (familyId) {
      return db.select().from(complianceControls).where(eq(complianceControls.familyId, familyId));
    }
    return db.select().from(complianceControls);
  }

  async getGaps() {
    const controls = await db.select().from(complianceControls);
    return controls.filter(c => {
      if (c.implementationStatus === "not_applicable") return false;
      if (c.implementationStatus === "not_implemented" || c.implementationStatus === "planned") return true;
      if (c.gaps) {
        const gapsArray = JSON.parse(c.gaps);
        return gapsArray.length > 0;
      }
      return false;
    }).map(c => ({
      ...c,
      gaps: c.gaps ? JSON.parse(c.gaps) : [],
      evidence: c.evidence ? JSON.parse(c.evidence) : [],
      platformFeatures: c.platformFeatures ? JSON.parse(c.platformFeatures) : [],
    }));
  }

  async updateControlStatus(controlId: string, status: string, notes?: string) {
    await db.update(complianceControls)
      .set({
        implementationStatus: status,
        notes: notes || null,
        lastAssessment: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(complianceControls.id, controlId));
    
    await this.calculateFamilyScores();
  }

  async runAssessment() {
    await this.calculateFamilyScores();
    const stats = await this.getStats();
    
    await db.insert(complianceAssessments).values({
      assessmentType: "full",
      overallScore: stats.overallScore,
      implementedCount: stats.implementedControls,
      partialCount: stats.partialControls,
      gapsCount: stats.gapsCount,
      summary: `Full NIST 800-53 assessment completed. Overall score: ${stats.overallScore}%. ${stats.implementedControls} controls fully implemented, ${stats.partialControls} partially implemented, ${stats.gapsCount} gaps identified.`,
      createdAt: new Date(),
    });

    return stats;
  }

  async getAssessmentHistory() {
    return db.select().from(complianceAssessments).orderBy(complianceAssessments.createdAt);
  }
}

export const complianceService = new ComplianceService();
