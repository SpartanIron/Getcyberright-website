<<<<<<< HEAD
import {
  type User,
  type InsertUser,
  type ContactMessage,
  type InsertContactMessage,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  users,
  contactMessages,
  newsletterSubscribers,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(message).returning();
    return result[0];
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const result = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return result[0];
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers);
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const result = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    return result[0];
  }
}

export const storage = new DatabaseStorage();
=======
import { 
  users, articles, resources, newsletters, cyberAssessments, userAssessmentResults, cyberAchievements, userAchievements,
  featuredPeople, podcasts, blogPosts, dailyTipsSubscriptions, dailyTips, techEvents, partnershipInquiries, weeklyDigests, scamTrends, auditLogs, securityAlerts,
  webauthnCredentials, webauthnChallenges,
  type User, type InsertUser,
  type AuditLog, type InsertAuditLog,
  type WebauthnCredential, type InsertWebauthnCredential,
  type WebauthnChallenge, type InsertWebauthnChallenge,
  type Article, type InsertArticle,
  type Resource, type InsertResource,
  type Newsletter, type InsertNewsletter,
  type CyberAssessment, type InsertCyberAssessment,
  type UserAssessmentResult, type InsertUserAssessmentResult,
  type CyberAchievement, type InsertCyberAchievement,
  type UserAchievement, type InsertUserAchievement,
  type FeaturedPerson, type InsertFeaturedPerson,
  type Podcast, type InsertPodcast,
  type BlogPost, type InsertBlogPost,
  type DailyTipsSubscription,
  type TechEvent, type InsertTechEvent,
  type ThreatStat, type InsertThreatStat,
  type AgeGroupStat, type InsertAgeGroupStat,
  type RegionalAttackType, type InsertRegionalAttackType,
  type SafetyTipTemplate, type InsertSafetyTipTemplate,
  type PartnershipInquiry, type InsertPartnershipInquiry,
  type UserFeedback, type InsertUserFeedback,
  type WeeklyDigest, type InsertWeeklyDigest,
  type DailyTip, type InsertDailyTip,
  type ScamTrend,
  type SecurityAlert, type InsertSecurityAlert,
  type ToolUsage, type InsertToolUsage,
  type ContactSubmission, type InsertContactSubmission
} from "@shared/schema";
import crypto from "crypto";
import { db } from "./db";
import { eq, desc, like, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, passwordHash: string): Promise<void>;
  setPasswordResetToken(id: number, token: string, expires: Date): Promise<void>;
  clearPasswordResetToken(id: number): Promise<void>;
  setEmailVerificationToken(id: number, token: string, expires: Date): Promise<void>;
  verifyEmail(id: number): Promise<void>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;

  // Articles
  getArticles(options?: { category?: string; featured?: boolean; breaking?: boolean; limit?: number }): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  searchArticles(query: string): Promise<Article[]>;

  // Resources
  getResources(options?: { type?: string; category?: string; difficulty?: string; limit?: number }): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Newsletter - Unified subscription system
  subscribeNewsletter(email: string, options?: {
    weeklyDigest?: boolean;
    digitalSafetyTips?: boolean;
    tipsFrequency?: string;
    audience?: string;
    region?: string;
    alertPriority?: string;
  }): Promise<Newsletter>;
  updateNewsletterPreferences(email: string, options: {
    weeklyDigest?: boolean;
    digitalSafetyTips?: boolean;
    tipsFrequency?: string;
    audience?: string;
    region?: string;
    alertPriority?: string;
  }): Promise<Newsletter | undefined>;
  getNewsletterSubscriptions(): Promise<Newsletter[]>;
  deleteNewsletterSubscription(id: number): Promise<boolean>;
  deleteDailyTipsSubscription(id: number): Promise<boolean>;

  // Cyber Awareness Assessment System
  getCyberAssessments(options?: { category?: string; difficulty?: string; limit?: number }): Promise<CyberAssessment[]>;
  getCyberAssessment(id: number): Promise<CyberAssessment | undefined>;
  createAssessmentResult(result: InsertUserAssessmentResult): Promise<UserAssessmentResult>;
  getUserAssessmentResults(sessionId: string): Promise<UserAssessmentResult[]>;
  getUserScore(sessionId: string): Promise<{ totalScore: number; correctAnswers: number; totalQuestions: number; categoryBreakdown: Record<string, { correct: number; total: number; score: number }> }>;
  
  // Achievements System
  getCyberAchievements(): Promise<CyberAchievement[]>;
  getUserAchievements(sessionId: string): Promise<UserAchievement[]>;
  checkAndUnlockAchievements(sessionId: string): Promise<UserAchievement[]>;
  createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement>;

  // Featured People
  getFeaturedPeople(options?: { featured?: boolean; limit?: number }): Promise<FeaturedPerson[]>;
  getFeaturedPerson(id: number): Promise<FeaturedPerson | undefined>;
  createFeaturedPerson(person: InsertFeaturedPerson): Promise<FeaturedPerson>;
  updateFeaturedPerson(id: number, updates: Partial<InsertFeaturedPerson>): Promise<FeaturedPerson | undefined>;
  deleteFeaturedPerson(id: number): Promise<boolean>;

  // Podcasts
  getPodcasts(options?: { featured?: boolean; category?: string; limit?: number }): Promise<Podcast[]>;
  getPodcast(id: number): Promise<Podcast | undefined>;
  createPodcast(podcast: InsertPodcast): Promise<Podcast>;
  updatePodcast(id: number, updates: Partial<InsertPodcast>): Promise<Podcast | undefined>;
  deletePodcast(id: number): Promise<boolean>;

  // Blog Posts
  getBlogPosts(options?: { published?: boolean; featured?: boolean; category?: string; limit?: number }): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Daily Tips Subscriptions
  subscribeDailyTips(email: string, audience: string, options?: { frequency?: string; region?: string; alertPriority?: string }): Promise<DailyTipsSubscription>;
  unsubscribeDailyTips(email: string): Promise<boolean>;
  getDailyTipsSubscriptions(audience?: string): Promise<DailyTipsSubscription[]>;
  getAllDailyTipsSubscriptions(): Promise<DailyTipsSubscription[]>;

  // Tech Events and Conferences
  getTechEvents(options?: { category?: string; featured?: boolean; upcoming?: boolean; limit?: number }): Promise<TechEvent[]>;
  getTechEvent(id: number): Promise<TechEvent | undefined>;
  createTechEvent(event: InsertTechEvent): Promise<TechEvent>;

  // Threat Statistics
  getThreatStats(): Promise<ThreatStat[]>;
  getThreatStat(statKey: string): Promise<ThreatStat | undefined>;
  updateThreatStat(statKey: string, updates: Partial<InsertThreatStat>): Promise<ThreatStat | undefined>;
  getAgeGroupStats(): Promise<AgeGroupStat[]>;
  updateAgeGroupStat(id: number, updates: Partial<InsertAgeGroupStat>): Promise<AgeGroupStat | undefined>;
  getRegionalAttackTypes(): Promise<RegionalAttackType[]>;
  updateRegionalAttackType(id: number, updates: Partial<InsertRegionalAttackType>): Promise<RegionalAttackType | undefined>;
  getAllThreatData(): Promise<{ stats: ThreatStat[]; ageGroups: AgeGroupStat[]; regions: RegionalAttackType[] }>;

  // Safety Tip Templates for email campaigns
  getSafetyTipTemplates(options?: { audience?: string; dayType?: string; activeOnly?: boolean }): Promise<SafetyTipTemplate[]>;
  getSafetyTipTemplate(id: number): Promise<SafetyTipTemplate | undefined>;
  getNextTipForAudience(audience: string, dayType: string): Promise<SafetyTipTemplate | undefined>;
  markTipAsUsed(tipId: number): Promise<void>;
  createSafetyTipTemplate(tip: InsertSafetyTipTemplate): Promise<SafetyTipTemplate>;
  updateSafetyTipTemplate(id: number, updates: Partial<InsertSafetyTipTemplate>): Promise<SafetyTipTemplate | undefined>;
  logEmailSend(subscriptionId: number, tipId: number, status: string, errorMessage?: string): Promise<void>;
  getActiveSubscribersForAudience(audience: string): Promise<DailyTipsSubscription[]>;

  // Partnership/Advertising Inquiries
  createPartnershipInquiry(inquiry: InsertPartnershipInquiry): Promise<PartnershipInquiry>;
  getPartnershipInquiries(options?: { status?: string; limit?: number }): Promise<PartnershipInquiry[]>;
  getPartnershipInquiry(id: number): Promise<PartnershipInquiry | undefined>;
  updatePartnershipInquiryStatus(id: number, status: string, notes?: string): Promise<PartnershipInquiry | undefined>;

  // User Feedback
  createFeedback(feedback: InsertUserFeedback): Promise<UserFeedback>;
  getAllFeedback(): Promise<UserFeedback[]>;

  // Tool Usage Tracking
  trackToolUsage(usage: InsertToolUsage): Promise<ToolUsage>;
  getToolUsageStats(): Promise<{ toolName: string; action: string; count: number }[]>;
  getToolUsageByTool(toolName: string): Promise<ToolUsage[]>;

  // Contact Submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  markContactAsRead(id: number): Promise<ContactSubmission | undefined>;
  markContactAsReplied(id: number): Promise<ContactSubmission | undefined>;

  // Subscriber Preferences
  updateDailyTipsPreferences(email: string, options: { frequency?: string; region?: string; alertPriority?: string }): Promise<DailyTipsSubscription | undefined>;
  getSubscriberByToken(token: string): Promise<DailyTipsSubscription | undefined>;
  generatePreferenceToken(email: string): Promise<string>;
  updateNewsletterPreferences(email: string, options: boolean | { weeklyDigest?: boolean; region?: string; alertPriority?: string }): Promise<Newsletter | undefined>;
  getNewsletterByToken(token: string): Promise<Newsletter | undefined>;

  // Weekly Digest Management
  createWeeklyDigest(digest: InsertWeeklyDigest): Promise<WeeklyDigest>;
  getWeeklyDigests(status?: string): Promise<WeeklyDigest[]>;
  getWeeklyDigest(id: number): Promise<WeeklyDigest | undefined>;
  updateWeeklyDigest(id: number, updates: Partial<InsertWeeklyDigest>): Promise<WeeklyDigest | undefined>;
  approveWeeklyDigest(id: number, approvedBy: string): Promise<WeeklyDigest | undefined>;
  markWeeklyDigestSent(id: number, recipientCount: number): Promise<WeeklyDigest | undefined>;
  deleteWeeklyDigest(id: number): Promise<boolean>;
  getWeeklyDigestSubscribers(): Promise<Newsletter[]>;

  // Daily Tips Management
  createDailyTip(tip: InsertDailyTip): Promise<DailyTip>;
  getDailyTips(status?: string): Promise<DailyTip[]>;
  getDailyTip(id: number): Promise<DailyTip | undefined>;
  approveDailyTip(id: number, approvedBy: string): Promise<DailyTip | undefined>;
  markDailyTipSent(id: number, recipientCount: number): Promise<DailyTip | undefined>;
  deleteDailyTip(id: number): Promise<boolean>;
  getDigitalSafetyTipsSubscribers(audience: string): Promise<Newsletter[]>;

  // Scam Trend Tracking
  recordScamTrend(scamType: string, keywords?: string[], region?: string): Promise<void>;
  getScamTrends(options?: { weeks?: number; scamType?: string }): Promise<ScamTrend[]>;
  getTopScamTrends(limit?: number, region?: string): Promise<{ scamType: string; count: number; trend: string }[]>;

  // Two-Factor Authentication
  setTwoFactorSecret(userId: number, secret: string): Promise<void>;
  enableTwoFactor(userId: number): Promise<void>;
  disableTwoFactor(userId: number): Promise<void>;

  // Audit Logging
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(options?: { userId?: number; action?: string; limit?: number }): Promise<AuditLog[]>;

  // Security Alerts
  getSecurityAlerts(options?: { severity?: string; category?: string; unreadOnly?: boolean; limit?: number }): Promise<SecurityAlert[]>;
  getSecurityAlert(id: number): Promise<SecurityAlert | undefined>;
  createSecurityAlert(alert: InsertSecurityAlert): Promise<SecurityAlert>;
  markAlertAsRead(id: number): Promise<void>;
  acknowledgeAlert(id: number, userId: number): Promise<void>;
  getUnreadAlertCount(): Promise<number>;

  // Scam Checker Usage Tracking
  logScamCheckerUsage(analysisType: string, resultRisk?: string, region?: string): Promise<void>;
  getScamCheckerStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    byRisk: Record<string, number>;
    byRegion: Record<string, number>;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }>;

  // Breach Checker Usage Tracking
  logBreachCheckerUsage(checkType: string, breachesFound: number, passwordExposed: boolean, monitoringSignup: boolean): Promise<void>;
  getBreachCheckerStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    totalBreachesFound: number;
    passwordExposures: number;
    monitoringSignups: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }>;

  // Breach Monitoring
  createBreachMonitoringSubscription(subscription: {
    email: string;
    monitoredEmails: string[];
    newsletterId?: number;
    unsubscribeToken?: string;
  }): Promise<{ id: number; email: string; monitoredEmails: string[] }>;
  getBreachMonitoringSubscription(email: string): Promise<{ id: number; email: string; monitoredEmails: string[]; isActive: boolean; totalBreachesFound: number } | undefined>;
  updateBreachMonitoringSubscription(id: number, updates: { monitoredEmails?: string[]; isActive?: boolean; lastCheckedAt?: Date; totalBreachesFound?: number }): Promise<void>;
  saveBreachCheckResult(result: {
    email: string;
    subscriptionId?: number;
    breachName: string;
    breachDomain?: string;
    breachDate?: Date;
    exposedDataTypes?: string[];
    description?: string;
    severity?: string;
    isPasswordExposed?: boolean;
  }): Promise<{ id: number }>;
  getBreachCheckResults(email: string): Promise<Array<{
    id: number;
    breachName: string;
    breachDomain: string | null;
    breachDate: Date | null;
    exposedDataTypes: string[] | null;
    severity: string | null;
    isPasswordExposed: boolean;
    discoveredAt: Date;
  }>>;

  // WebAuthn (Passkeys) support
  createWebauthnCredential(credential: InsertWebauthnCredential): Promise<WebauthnCredential>;
  getWebauthnCredentialsByUserId(userId: number): Promise<WebauthnCredential[]>;
  getWebauthnCredentialById(credentialId: string): Promise<WebauthnCredential | undefined>;
  updateWebauthnCredentialCounter(credentialId: string, counter: number): Promise<void>;
  deleteWebauthnCredential(id: number): Promise<boolean>;
  createWebauthnChallenge(challenge: InsertWebauthnChallenge): Promise<WebauthnChallenge>;
  getWebauthnChallenge(challenge: string): Promise<WebauthnChallenge | undefined>;
  getPendingChallengesForUser(userId: number, type: string): Promise<WebauthnChallenge[]>;
  deleteWebauthnChallenge(challenge: string): Promise<void>;
  cleanupExpiredChallenges(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  private resources: Map<number, Resource>;
  private newsletters: Map<number, Newsletter>;
  private cyberAssessments: Map<number, CyberAssessment>;
  private userAssessmentResults: Map<number, UserAssessmentResult>;
  private cyberAchievements: Map<number, CyberAchievement>;
  private userAchievements: Map<number, UserAchievement>;
  private currentUserId: number;
  private currentArticleId: number;
  private currentResourceId: number;
  private currentNewsletterId: number;
  private currentAssessmentId: number;
  private currentResultId: number;
  private currentAchievementId: number;
  private currentUserAchievementId: number;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.resources = new Map();
    this.newsletters = new Map();
    this.cyberAssessments = new Map();
    this.userAssessmentResults = new Map();
    this.cyberAchievements = new Map();
    this.userAchievements = new Map();
    this.currentUserId = 1;
    this.currentArticleId = 1;
    this.currentResourceId = 1;
    this.currentNewsletterId = 1;
    this.currentAssessmentId = 1;
    this.currentResultId = 1;
    this.currentAchievementId = 1;
    this.currentUserAchievementId = 1;

    this.seedData();
  }

  private seedData() {
    // Seed articles
    const sampleArticles: InsertArticle[] = [
      {
        title: "The Rise of AI-Powered Cyber Attacks: What Every Organization Needs to Know",
        excerpt: "As artificial intelligence becomes more sophisticated, cybercriminals are leveraging these technologies to create more convincing phishing attacks, automate vulnerability discovery...",
        content: "Comprehensive analysis of AI-powered cyber attacks and defense strategies...",
        category: "Analysis",
        author: "Sarah Chen",
        authorTitle: "Senior Security Analyst",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop",
        readTime: 8,
        featured: true,
        breaking: false,
      },
      
      // Security Fundamentals Tutorials
      {
        title: "Cybersecurity Fundamentals: Understanding the CIA Triad",
        excerpt: "Learn the core principles of cybersecurity through Confidentiality, Integrity, and Availability - the foundation of all security practices.",
        content: `# Understanding the CIA Triad

The CIA Triad forms the foundation of cybersecurity. Every security control, policy, and procedure should support one or more of these principles:

## Confidentiality
Ensures that information is accessible only to authorized individuals, entities, or systems.

**Key Concepts:**
- Access controls and authentication
- Encryption of data at rest and in transit
- Information classification systems
- Need-to-know principles

**Real-world Examples:**
- Medical records protection under HIPAA
- Financial data security in banking
- Corporate trade secrets protection

## Integrity
Maintains the accuracy and completeness of data throughout its lifecycle.

**Key Concepts:**
- Digital signatures and hashing
- Version control systems
- Database transaction controls
- Change management processes

**Common Threats:**
- Data corruption attacks
- Unauthorized modifications
- Man-in-the-middle attacks

## Availability
Ensures that information and resources are accessible when needed by authorized users.

**Key Concepts:**
- Redundancy and failover systems
- Disaster recovery planning
- Load balancing and scaling
- Business continuity planning

**Common Threats:**
- Denial of Service (DoS) attacks
- Hardware failures
- Natural disasters
- Human errors

## Implementing the CIA Triad

1. **Risk Assessment**: Identify assets and threats
2. **Control Selection**: Choose appropriate security controls
3. **Implementation**: Deploy controls systematically
4. **Monitoring**: Continuous assessment and improvement

Understanding these fundamentals is crucial for any cybersecurity professional. Every security decision should consider how it impacts confidentiality, integrity, and availability.`,
        category: "Tutorial",
        author: "Dr. Emily Watson",
        authorTitle: "Cybersecurity Professor",
        authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop",
        readTime: 15,
        featured: false,
        breaking: false,
      },
      {
        title: "Network Security Fundamentals: Firewalls, IDS, and Network Segmentation",
        excerpt: "Master the essential network security technologies that protect organizational infrastructure from external and internal threats.",
        content: `# Network Security Fundamentals

Network security forms the first line of defense in most cybersecurity architectures. Understanding these core technologies is essential for any security professional.

## Firewalls: Your Digital Gatekeepers

### Types of Firewalls
1. **Packet Filtering Firewalls**
   - Examine packets at network layer
   - Make decisions based on IP addresses and ports
   - Fast but limited inspection capabilities

2. **Stateful Inspection Firewalls**
   - Track connection states
   - Understand protocol behaviors
   - More secure than packet filtering

3. **Application Layer Firewalls**
   - Deep packet inspection
   - Application-aware filtering
   - Highest security but performance impact

### Firewall Rules Best Practices
- Default deny policy
- Least privilege principle
- Regular rule reviews and cleanup
- Proper documentation and change control

## Intrusion Detection Systems (IDS)

### Network-based IDS (NIDS)
- Monitors network traffic
- Detects suspicious patterns
- Strategic placement at network choke points

### Host-based IDS (HIDS)
- Monitors individual systems
- File integrity monitoring
- Log analysis and correlation

### Detection Methods
1. **Signature-based**: Known attack patterns
2. **Anomaly-based**: Behavioral analysis
3. **Hybrid**: Combination approach

## Network Segmentation

### Segmentation Strategies
- **DMZ (Demilitarized Zone)**: Buffer between internal and external networks
- **VLANs**: Logical network separation
- **Zero Trust**: Never trust, always verify

### Implementation Steps
1. Asset inventory and classification
2. Network mapping and traffic analysis
3. Segmentation design and policy creation
4. Implementation and testing
5. Monitoring and maintenance

## Practical Lab Exercise

Set up a virtual lab with:
- pfSense firewall
- Suricata IDS
- Segmented network topology
- Traffic generation and analysis

This hands-on experience reinforces theoretical knowledge with practical skills.`,
        category: "Tutorial",
        author: "Marcus Johnson",
        authorTitle: "Network Security Engineer",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop",
        readTime: 20,
        featured: false,
        breaking: false,
      },
      
      // Threat Intelligence Articles
      {
        title: "New Ransomware Campaign Targets Healthcare Organizations",
        excerpt: "Security researchers have identified a sophisticated ransomware attack specifically targeting hospital networks and medical devices.",
        content: `# Healthcare Under Siege: New Ransomware Threat
        
A newly discovered ransomware variant has been actively targeting healthcare organizations across North America, exploiting vulnerabilities in medical device networks and patient management systems.

## Attack Vector Analysis

The threat actors are using a multi-stage attack:
1. **Initial Access**: Phishing emails with malicious attachments
2. **Lateral Movement**: Exploiting unpatched medical devices
3. **Data Exfiltration**: Stealing patient records before encryption
4. **Ransom Demand**: Demanding payment in cryptocurrency

## Indicators of Compromise

- Suspicious network traffic to known command-and-control servers
- Unusual file encryption activities during off-hours
- Unauthorized access to medical device management consoles
- Abnormal data transfer volumes to external IP addresses

## Mitigation Strategies

Organizations should immediately:
- Patch all medical devices and network infrastructure
- Implement network segmentation for critical systems
- Conduct employee security awareness training
- Deploy advanced threat detection solutions`,
        category: "Threats",
        author: "Dr. Sarah Chen",
        authorTitle: "Threat Intelligence Analyst",
        authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b547?w=64&h=64&fit=crop&crop=face",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop",
        readTime: 8,
        featured: true,
        breaking: true,
      },
      
      {
        title: "Critical Vulnerability Discovered in Popular IoT Devices",
        excerpt: "A zero-day exploit affects millions of smart home devices, allowing attackers to gain unauthorized access to home networks.",
        content: `# IoT Security Alert: Critical Vulnerability Exposed

Security researchers have uncovered a critical vulnerability in smart home devices that could allow attackers to compromise entire home networks.

## Vulnerability Details

- **CVE ID**: CVE-2025-0123
- **CVSS Score**: 9.8 (Critical)
- **Affected Devices**: Smart cameras, thermostats, and door locks
- **Attack Vector**: Remote code execution via network protocols

## Exploitation Methods

Attackers can exploit this vulnerability to:
- Execute arbitrary code on affected devices
- Access sensitive data stored on the device
- Use compromised devices as entry points to the network
- Launch attacks against other connected devices

## Immediate Actions Required

1. **Inventory Check**: Identify all affected IoT devices
2. **Network Isolation**: Segment IoT devices from critical systems
3. **Firmware Updates**: Apply patches as soon as available
4. **Monitoring**: Implement network monitoring for suspicious activities`,
        category: "Threats",
        author: "Alex Rodriguez",
        authorTitle: "Security Researcher",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop",
        readTime: 6,
        featured: false,
        breaking: true,
      },
      
      // Policy and Compliance Articles
      {
        title: "New GDPR Amendments: What Organizations Need to Know",
        excerpt: "Recent updates to the General Data Protection Regulation introduce stricter requirements for data handling and user consent.",
        content: `# GDPR 2025: Key Regulatory Updates

The European Union has introduced significant amendments to the General Data Protection Regulation, with new requirements taking effect in Q3 2025.

## Major Changes Overview

### Enhanced Consent Requirements
- **Granular Consent**: Users must provide specific consent for each data processing purpose
- **Consent Renewal**: Annual renewal required for ongoing data processing
- **Clear Language**: Consent requests must use plain, understandable language

### Data Processing Transparency
- **Real-time Notifications**: Users must be notified within 24 hours of data access
- **Processing Logs**: Detailed logs required for all data processing activities
- **Third-party Disclosure**: Enhanced reporting for data sharing with third parties

## Compliance Timeline

- **Phase 1 (July 2025)**: Update privacy policies and consent mechanisms
- **Phase 2 (September 2025)**: Implement technical compliance measures
- **Phase 3 (October 2025)**: Full compliance required

## Implementation Recommendations

Organizations should prioritize:
1. **Legal Review**: Update all privacy documentation
2. **Technical Upgrades**: Implement consent management platforms
3. **Staff Training**: Educate teams on new requirements
4. **Audit Procedures**: Establish regular compliance audits`,
        category: "Policy",
        author: "Jennifer Walsh",
        authorTitle: "Data Protection Officer",
        authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&crop=face",
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop",
        readTime: 10,
        featured: true,
        breaking: false,
      },
      
      {
        title: "Cybersecurity Framework Updates: NIST 2.0 Implementation Guide",
        excerpt: "The National Institute of Standards and Technology releases major updates to its cybersecurity framework with new governance requirements.",
        content: `# NIST Cybersecurity Framework 2.0: Complete Implementation Guide

The National Institute of Standards and Technology has released version 2.0 of its Cybersecurity Framework, introducing significant changes to organizational governance and risk management.

## Framework Evolution

### New Governance Function
The updated framework introduces a sixth core function:
- **Govern**: Establishing cybersecurity governance, risk management, and oversight

### Enhanced Risk Management
- **Supply Chain Integration**: Extended focus on third-party risk
- **Continuous Monitoring**: Real-time risk assessment requirements
- **Stakeholder Engagement**: Mandatory board-level cybersecurity reporting

## Implementation Phases

### Phase 1: Assessment (Months 1-2)
- Current state evaluation against new framework
- Gap analysis and risk prioritization
- Resource requirement assessment

### Phase 2: Planning (Months 3-4)
- Develop implementation roadmap
- Assign roles and responsibilities
- Establish success metrics

### Phase 3: Execution (Months 5-12)
- Deploy new governance structures
- Implement technical controls
- Conduct staff training programs

## Regulatory Implications

The updated framework aligns with:
- Federal cybersecurity requirements
- Industry-specific compliance standards
- International cybersecurity frameworks`,
        category: "Policy",
        author: "Michael Thompson",
        authorTitle: "Compliance Manager",
        authorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop",
        readTime: 12,
        featured: false,
        breaking: false,
      },
      
      // Practical Implementation Tutorials
      {
        title: "Building Your First Security Operations Center (SOC)",
        excerpt: "Step-by-step guide to establishing effective security monitoring capabilities, from tool selection to team structure.",
        content: `# Building Your First SOC

A Security Operations Center (SOC) is the nerve center of an organization's cybersecurity defense. This comprehensive guide walks you through establishing an effective SOC from the ground up.

## SOC Fundamentals

### What is a SOC?
A centralized unit that deals with security issues on an organizational and technical level. The SOC team monitors, prevents, detects, investigates, and responds to cyber threats 24/7.

### SOC Functions
1. **Continuous Monitoring**: Real-time threat detection
2. **Incident Response**: Coordinated response to security events
3. **Threat Intelligence**: Collection and analysis of threat data
4. **Vulnerability Management**: Identifying and remediating weaknesses
5. **Compliance**: Ensuring regulatory adherence

## SOC Architecture Design

### Technology Stack
1. **SIEM (Security Information and Event Management)**
   - Splunk, IBM QRadar, or Elastic Security
   - Log aggregation and correlation
   - Real-time alerting and dashboards

2. **SOAR (Security Orchestration, Automation, and Response)**
   - Phantom, Demisto, or Swimlane
   - Workflow automation
   - Playbook execution

3. **Endpoint Detection and Response (EDR)**
   - CrowdStrike, Carbon Black, or SentinelOne
   - Advanced endpoint monitoring
   - Behavioral analysis

4. **Network Detection and Response (NDR)**
   - Darktrace, ExtraHop, or Corelight
   - Network traffic analysis
   - Lateral movement detection

### Infrastructure Requirements
- **Physical Space**: Dedicated SOC floor with multiple screens
- **Network Connectivity**: Redundant, high-speed connections
- **Power and Cooling**: Uninterruptible power and climate control
- **Security**: Physical access controls and surveillance

## Team Structure and Roles

### Tier 1 - SOC Analysts
- Monitor security alerts and dashboards
- Perform initial triage and classification
- Escalate confirmed incidents
- **Skills**: Basic networking, Windows/Linux, SIEM operation

### Tier 2 - Incident Responders
- Investigate escalated incidents
- Perform deeper technical analysis
- Coordinate response activities
- **Skills**: Digital forensics, malware analysis, scripting

### Tier 3 - Threat Hunters
- Proactive threat hunting
- Advanced threat analysis
- Tool development and tuning
- **Skills**: Advanced forensics, threat intelligence, programming

### SOC Manager
- Strategic planning and leadership
- Vendor management and budgeting
- Stakeholder communication
- **Skills**: Management, cybersecurity expertise, business acumen

## Implementation Roadmap

### Phase 1: Planning (Months 1-2)
- Define SOC charter and objectives
- Conduct risk assessment
- Design architecture and select tools
- Develop policies and procedures

### Phase 2: Infrastructure (Months 3-4)
- Procure and install technology stack
- Set up physical SOC environment
- Configure monitoring and alerting
- Develop incident response playbooks

### Phase 3: Staffing and Training (Months 5-6)
- Hire and train SOC personnel
- Conduct tabletop exercises
- Establish shift schedules
- Create documentation and training materials

### Phase 4: Operations (Months 7-8)
- Begin 24/7 monitoring operations
- Tune detection rules and reduce false positives
- Establish metrics and reporting
- Conduct lessons learned sessions

### Phase 5: Optimization (Ongoing)
- Continuous improvement processes
- Advanced threat hunting capabilities
- Integration with business processes
- Regular assessment and updates

## Key Success Factors

1. **Executive Support**: Ensure leadership buy-in and adequate funding
2. **Clear Processes**: Well-defined procedures and escalation paths
3. **Skilled Personnel**: Invest in hiring and training quality staff
4. **Technology Integration**: Seamless tool integration and automation
5. **Continuous Improvement**: Regular assessment and optimization

## Metrics and KPIs

### Operational Metrics
- Mean Time to Detection (MTTD)
- Mean Time to Response (MTTR)
- Alert volume and false positive rate
- Incident closure rate

### Strategic Metrics
- Risk reduction achieved
- Compliance status
- Cost per incident
- Team efficiency improvements

Building a SOC is a significant undertaking that requires careful planning, adequate resources, and ongoing commitment. Success depends on balancing people, process, and technology to create an effective cybersecurity defense capability.`,
        category: "Tutorial",
        author: "Mike Rodriguez",
        authorTitle: "SOC Manager",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop",
        readTime: 25,
        featured: true,
        breaking: false,
      },
      {
        title: "Implementing Zero Trust Architecture: A Practical Guide",
        excerpt: "Transform your organization's security model with Zero Trust principles. Learn implementation strategies, tool selection, and migration planning.",
        content: `# Implementing Zero Trust Architecture

Zero Trust represents a fundamental shift from traditional perimeter-based security to a model where trust is never assumed and verification is required from everyone trying to access resources.

## Zero Trust Principles

### Core Tenets
1. **Never Trust, Always Verify**: Every access request must be authenticated and authorized
2. **Least Privilege Access**: Grant minimum necessary permissions
3. **Assume Breach**: Design systems assuming compromise has occurred
4. **Verify Explicitly**: Use all available data points for access decisions

### Zero Trust Pillars

#### 1. Identity and Access Management (IAM)
- Multi-factor authentication (MFA)
- Single sign-on (SSO)
- Privileged access management (PAM)
- Identity governance and administration (IGA)

#### 2. Device Security
- Device compliance policies
- Mobile device management (MDM)
- Endpoint detection and response (EDR)
- Certificate-based authentication

#### 3. Network Security
- Software-defined perimeters (SDP)
- Micro-segmentation
- Network access control (NAC)
- Encrypted communications

#### 4. Application Security
- Application performance monitoring
- API security gateways
- Web application firewalls (WAF)
- Secure development practices

#### 5. Data Protection
- Data classification and labeling
- Data loss prevention (DLP)
- Encryption at rest and in transit
- Rights management

## Implementation Strategy

### Phase 1: Assessment and Planning
1. **Current State Analysis**
   - Inventory all assets and data flows
   - Identify existing security controls
   - Map user access patterns
   - Assess risk tolerance

2. **Zero Trust Maturity Model**
   - Traditional: Perimeter-focused security
   - Advanced: Some Zero Trust elements
   - Optimal: Comprehensive Zero Trust implementation

### Phase 2: Identity-Centric Implementation
1. **Strengthen Identity Foundation**
   - Deploy enterprise identity provider
   - Implement MFA for all users
   - Establish identity governance processes
   - Create user risk profiles

2. **Device Trust Establishment**
   - Deploy device management solutions
   - Implement device compliance policies
   - Establish device risk scoring
   - Create device trust verification

### Phase 3: Network Modernization
1. **Micro-segmentation**
   - Map application dependencies
   - Design security zones
   - Implement network policies
   - Monitor east-west traffic

2. **Software-Defined Perimeters**
   - Deploy ZTNA solutions
   - Create application-specific tunnels
   - Implement adaptive access controls
   - Establish real-time risk assessment

### Phase 4: Application and Data Security
1. **Application Modernization**
   - Implement API gateways
   - Deploy application firewalls
   - Establish secure development practices
   - Create application risk profiles

2. **Data-Centric Security**
   - Classify and label data
   - Implement DLP solutions
   - Deploy rights management
   - Establish data governance

## Technology Stack

### Identity Providers
- **Microsoft Azure AD**: Comprehensive identity platform
- **Okta**: Cloud-based identity management
- **Ping Identity**: Enterprise identity solutions
- **CyberArk**: Privileged access management

### ZTNA Solutions
- **Zscaler Private Access**: Cloud-delivered ZTNA
- **Palo Alto Prisma Access**: SASE platform
- **Cisco Umbrella**: Secure web gateway with ZTNA
- **Akamai EAA**: Enterprise application access

### SIEM/SOAR Integration
- Centralized logging and monitoring
- Automated incident response
- Risk-based alerting
- Behavioral analytics

## Migration Strategies

### Pilot Program Approach
1. **Select Low-Risk Applications**
   - Non-critical business applications
   - Limited user base
   - Well-understood data flows

2. **Gradual Expansion**
   - Learn from pilot experiences
   - Refine policies and procedures
   - Scale to additional applications
   - Include critical systems last

### Big Bang Approach
- Comprehensive implementation
- Higher risk but faster results
- Requires extensive planning
- Suitable for smaller environments

## Common Challenges and Solutions

### Challenge: User Experience Impact
**Solution**: 
- Implement seamless SSO
- Use risk-based authentication
- Provide clear communication
- Offer user training and support

### Challenge: Legacy System Integration
**Solution**:
- Use network-based controls
- Implement proxy solutions
- Plan for system modernization
- Accept temporary compromises

### Challenge: Performance Concerns
**Solution**:
- Optimize network paths
- Use edge computing
- Implement caching strategies
- Monitor performance metrics

## Success Metrics

### Security Metrics
- Reduction in successful attacks
- Faster threat detection
- Improved incident response
- Better compliance posture

### Operational Metrics
- User authentication success rates
- Application availability
- Network performance
- Help desk ticket volume

### Business Metrics
- Risk reduction achieved
- Compliance cost savings
- Productivity improvements
- Innovation enablement

Zero Trust is not a destination but a journey of continuous improvement. Success requires commitment from leadership, buy-in from users, and ongoing investment in people, processes, and technology.`,
        category: "Tutorial",
        author: "Jennifer Liu",
        authorTitle: "Zero Trust Architect",
        authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop",
        readTime: 30,
        featured: false,
        breaking: false,
      },
      
      // Advanced Techniques Tutorials
      {
        title: "Advanced Threat Hunting with YARA Rules and Sigma Detection",
        excerpt: "Master proactive threat hunting techniques using YARA for malware detection and Sigma rules for behavioral analysis across your security stack.",
        content: `# Advanced Threat Hunting Techniques

Threat hunting transforms cybersecurity from reactive to proactive, seeking out threats that have evaded traditional security controls. This advanced guide covers sophisticated hunting methodologies and tools.

## Understanding Threat Hunting

### The Hunter Mindset
- **Assume Compromise**: Attackers are already inside your network
- **Think Like an Attacker**: Understand adversary tactics and techniques
- **Data-Driven Approach**: Use analytics to uncover anomalies
- **Continuous Improvement**: Learn from each hunt and refine techniques

### MITRE ATT&CK Framework Integration
The ATT&CK framework provides a common language for describing adversary behavior:

#### Tactics (Why)
- Initial Access, Execution, Persistence, Privilege Escalation
- Defense Evasion, Credential Access, Discovery, Lateral Movement
- Collection, Command and Control, Exfiltration, Impact

#### Techniques (How)
- Specific methods used within each tactic
- Sub-techniques for granular detection
- Data sources for detection opportunities

## YARA Rules for Malware Detection

### YARA Fundamentals
YARA identifies and classifies malware samples based on textual or binary patterns.

#### Basic Rule Structure
\`\`\`yara
rule SuspiciousPowerShell
{
    meta:
        author = "Threat Hunter"
        description = "Detects suspicious PowerShell execution"
        threat_level = 3
        in_the_wild = true

    strings:
        $a = "powershell.exe" nocase
        $b = "-EncodedCommand" nocase
        $c = "-WindowStyle Hidden" nocase
        $d = "System.Net.WebClient" nocase

    condition:
        $a and ($b or $c) and $d
}
\`\`\`

#### Advanced Pattern Matching
\`\`\`yara
rule APT_Lateral_Movement
{
    meta:
        description = "Detects APT lateral movement techniques"
        reference = "https://attack.mitre.org/techniques/T1021/"

    strings:
        // WMI execution patterns
        $wmi1 = "wmic.exe" nocase
        $wmi2 = "process call create" nocase
        
        // SMB/Admin shares
        $smb1 = "\\\\\\\\[a-zA-Z0-9.-]+\\\\[Cc]\\$" 
        $smb2 = "\\\\\\\\[a-zA-Z0-9.-]+\\\\[Aa]dmin\\$"
        
        // Remote service creation
        $sc1 = "sc.exe" nocase
        $sc2 = "create" nocase
        $sc3 = "binpath=" nocase

    condition:
        (($wmi1 and $wmi2) or 
         ($smb1 or $smb2) or 
         ($sc1 and $sc2 and $sc3)) and
        filesize < 50MB
}
\`\`\`

### YARA Deployment Strategies

#### Memory Scanning
\`\`\`bash
# Scan running processes
yara -p rules.yar

# Scan specific process
yara rules.yar /proc/[PID]/mem
\`\`\`

#### File System Hunting
\`\`\`bash
# Recursive directory scan
yara -r rules.yar /suspicious/path/

# Fast scan with threading
yara -f -p rules.yar /path/to/scan
\`\`\`

## Sigma Rules for Behavioral Detection

### Sigma Rule Architecture
Sigma provides vendor-agnostic detection rules that convert to various SIEM formats.

#### Basic Sigma Rule
\`\`\`yaml
title: Suspicious PowerShell Execution
id: 12345678-1234-1234-1234-123456789012
status: experimental
description: Detects suspicious PowerShell command execution
author: Threat Hunter
date: 2024/01/01
modified: 2024/01/01
tags:
    - attack.execution
    - attack.t1059.001
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith: '\\\\powershell.exe'
        CommandLine|contains:
            - '-EncodedCommand'
            - '-WindowStyle Hidden'
            - 'DownloadString'
    condition: selection
falsepositives:
    - Legitimate administrative scripts
level: medium
\`\`\`

#### Advanced Correlation Rules
\`\`\`yaml
title: Living Off The Land Binary Abuse
id: 87654321-4321-4321-4321-210987654321
description: Detects abuse of legitimate Windows binaries
logsource:
    category: process_creation
    product: windows
detection:
    # Certutil abuse
    certutil_download:
        Image|endswith: '\\\\certutil.exe'
        CommandLine|contains:
            - '-urlcache'
            - '-split'
            - '-f'
    
    # Bitsadmin abuse  
    bitsadmin_download:
        Image|endswith: '\\\\bitsadmin.exe'
        CommandLine|contains:
            - '/transfer'
            - '/download'
    
    # Regsvr32 abuse
    regsvr32_remote:
        Image|endswith: '\\\\regsvr32.exe'
        CommandLine|contains:
            - '/s'
            - '/u'
            - '/i:'
            - 'http'
    
    condition: 1 of them
level: high
\`\`\`

## Advanced Hunting Techniques

### Behavioral Analytics
#### Process Tree Analysis
\`\`\`sql
-- Detect unusual parent-child relationships
SELECT 
    parent_process_name,
    process_name,
    command_line,
    COUNT(*) as frequency
FROM process_events 
WHERE timestamp > NOW() - INTERVAL 24 HOUR
GROUP BY parent_process_name, process_name
HAVING frequency < 5  -- Rare combinations
ORDER BY frequency ASC
\`\`\`

#### Network Beacon Detection
\`\`\`sql
-- Identify periodic network connections (C2 beacons)
WITH connection_intervals AS (
    SELECT 
        src_ip,
        dst_ip,
        dst_port,
        LAG(timestamp) OVER (
            PARTITION BY src_ip, dst_ip, dst_port 
            ORDER BY timestamp
        ) as prev_timestamp,
        timestamp
    FROM network_connections
    WHERE timestamp > NOW() - INTERVAL 7 DAY
),
beacon_analysis AS (
    SELECT 
        src_ip,
        dst_ip,
        dst_port,
        EXTRACT(EPOCH FROM (timestamp - prev_timestamp)) as interval_seconds,
        COUNT(*) OVER (PARTITION BY src_ip, dst_ip, dst_port) as connection_count
    FROM connection_intervals
    WHERE prev_timestamp IS NOT NULL
)
SELECT 
    src_ip,
    dst_ip,
    dst_port,
    AVG(interval_seconds) as avg_interval,
    STDDEV(interval_seconds) as interval_stddev,
    connection_count
FROM beacon_analysis
WHERE connection_count > 10
GROUP BY src_ip, dst_ip, dst_port, connection_count
HAVING STDDEV(interval_seconds) < (AVG(interval_seconds) * 0.1)  -- Low jitter
ORDER BY connection_count DESC
\`\`\`

### Memory Forensics Integration
#### Volatility Framework
\`\`\`bash
# Memory dump analysis
volatility -f memory.raw imageinfo
volatility -f memory.raw --profile=Win10x64 pslist
volatility -f memory.raw --profile=Win10x64 netscan
volatility -f memory.raw --profile=Win10x64 malfind

# Hunt for injected code
volatility -f memory.raw --profile=Win10x64 hollowfind
volatility -f memory.raw --profile=Win10x64 yarascan -y rules.yar
\`\`\`

## Threat Intelligence Integration

### IOC Extraction and Enrichment
\`\`\`python
import requests
import json

def enrich_ioc(indicator, ioc_type):
    """Enrich IOC with threat intelligence"""
    
    # VirusTotal API example
    vt_response = requests.get(
        f'https://www.virustotal.com/vtapi/v2/ip-address/report',
        params={'apikey': VT_API_KEY, 'ip': indicator}
    )
    
    # Custom threat feed integration
    ti_response = requests.get(
        f'https://internal-ti-feed.com/api/lookup/{indicator}',
        headers={'Authorization': f'Bearer {TI_API_KEY}'}
    )
    
    return {
        'indicator': indicator,
        'type': ioc_type,
        'vt_detections': vt_response.json().get('positives', 0),
        'ti_tags': ti_response.json().get('tags', []),
        'confidence': calculate_confidence(vt_response, ti_response)
    }

def hunt_with_iocs(ioc_list):
    """Hunt for IOCs across data sources"""
    results = []
    
    for ioc in ioc_list:
        # Search SIEM
        siem_hits = search_siem(ioc['indicator'])
        
        # Search EDR
        edr_hits = search_edr(ioc['indicator'])
        
        # Search DNS logs
        dns_hits = search_dns_logs(ioc['indicator'])
        
        if any([siem_hits, edr_hits, dns_hits]):
            results.append({
                'ioc': ioc,
                'siem_hits': siem_hits,
                'edr_hits': edr_hits,
                'dns_hits': dns_hits
            })
    
    return results
\`\`\`

## Hunting Playbooks

### Ransomware Hunt
1. **Initial Indicators**
   - Unusual file encryption activity
   - High-entropy file names
   - Ransom note creation

2. **Behavioral Patterns**
   - Volume shadow copy deletion
   - Service manipulation
   - Network discovery commands

3. **YARA Rules**
   - Ransomware family signatures
   - Encryption routine patterns
   - Ransom note templates

### APT Hunt
1. **Persistence Mechanisms**
   - Registry modifications
   - Scheduled tasks
   - Service creation

2. **Lateral Movement**
   - SMB/WMI usage patterns
   - Credential dumping tools
   - Remote execution techniques

3. **Data Exfiltration**
   - Large file transfers
   - Unusual protocols
   - Compression activities

## Automation and Orchestration

### SOAR Integration
\`\`\`python
# Automated hunting workflow
def automated_hunt_workflow(hunt_name, iocs):
    """Orchestrated hunting workflow"""
    
    # Deploy YARA rules
    deploy_yara_rules(hunt_name)
    
    # Execute Sigma rules
    execute_sigma_rules(hunt_name)
    
    # Search for IOCs
    search_results = hunt_with_iocs(iocs)
    
    # Generate hunting report
    report = generate_hunt_report(hunt_name, search_results)
    
    # Create tickets for findings
    if search_results:
        create_incident_tickets(search_results)
    
    return report
\`\`\`

Advanced threat hunting requires combining technical skills, analytical thinking, and deep understanding of adversary behavior. Success comes from continuous learning, tool mastery, and collaborative intelligence sharing.`,
        category: "Tutorial",
        author: "David Kim",
        authorTitle: "Senior Threat Hunter",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop",
        readTime: 35,
        featured: false,
        breaking: false,
      },
      {
        title: "Advanced Digital Forensics: Memory Analysis and Timeline Reconstruction",
        excerpt: "Master advanced forensic techniques including memory dump analysis, timeline reconstruction, and artifact correlation for incident response.",
        content: `# Advanced Digital Forensics

Digital forensics in cybersecurity incidents requires sophisticated techniques to uncover evidence, reconstruct attack timelines, and attribute malicious activities. This advanced guide covers memory analysis and timeline reconstruction.

## Memory Forensics Fundamentals

### Why Memory Analysis Matters
- **Volatile Evidence**: Critical data exists only in memory
- **Running Processes**: Active malware and injected code
- **Network Connections**: Live C2 communications
- **Encryption Keys**: Decryption keys in memory
- **User Activities**: Recent actions and accessed data

### Memory Acquisition

#### Live Memory Capture
\`\`\`bash
# Using DumpIt (Windows)
DumpIt.exe /quiet /output C:\\memory.dmp

# Using LinPmem (Linux)
sudo ./linpmem-2.1.post4 -o memory.aff4

# Using OSXPMem (macOS)
sudo ./osxpmem.app/osxpmem -o memory.aff4
\`\`\`

#### Virtual Machine Memory
\`\`\`bash
# VMware snapshot
vmrun snapshot "/path/to/vm.vmx" snapshot_name

# VirtualBox memory dump
VBoxManage debugvm "VM Name" dumpvmcore --filename memory.elf
\`\`\`

## Volatility Framework Deep Dive

### Profile Detection and Validation
\`\`\`bash
# Automatic profile detection
volatility -f memory.raw imageinfo

# Manual profile specification
volatility -f memory.raw --profile=Win10x64_19041 pslist

# Profile validation
volatility -f memory.raw --profile=Win10x64_19041 kdbgscan
\`\`\`

### Process Analysis
\`\`\`bash
# Process listing
volatility -f memory.raw --profile=Win10x64_19041 pslist
volatility -f memory.raw --profile=Win10x64_19041 pstree
volatility -f memory.raw --profile=Win10x64_19041 psxview

# Process memory dumps
volatility -f memory.raw --profile=Win10x64_19041 procdump -p 1234 -D ./output/

# DLL analysis
volatility -f memory.raw --profile=Win10x64_19041 dlllist -p 1234
volatility -f memory.raw --profile=Win10x64_19041 dlldump -p 1234 -D ./output/
\`\`\`

### Network Artifact Recovery
\`\`\`bash
# Network connections
volatility -f memory.raw --profile=Win10x64_19041 netscan
volatility -f memory.raw --profile=Win10x64_19041 netstat

# Socket artifacts
volatility -f memory.raw --profile=Win10x64_19041 sockets
\`\`\`

### Malware Detection Techniques
\`\`\`bash
# Injected code detection
volatility -f memory.raw --profile=Win10x64_19041 malfind
volatility -f memory.raw --profile=Win10x64_19041 hollowfind

# Hidden processes
volatility -f memory.raw --profile=Win10x64_19041 psxview

# Rootkit detection
volatility -f memory.raw --profile=Win10x64_19041 modscan
volatility -f memory.raw --profile=Win10x64_19041 ssdt
\`\`\`

## Timeline Reconstruction

### Temporal Analysis Methodology

#### 1. Artifact Collection
Gather timestamps from multiple sources:
- File system metadata (MFT, journals)
- Registry timestamps
- Event logs
- Browser history
- Memory artifacts
- Network logs

#### 2. Timeline Creation
\`\`\`bash
# Using log2timeline/plaso
log2timeline.py timeline.plaso disk_image.dd

# Timeline filtering
psort.py -z UTC -o dynamic timeline.plaso > filtered_timeline.csv

# Specific time range
psort.py timeline.plaso "date > '2024-01-01 00:00:00' and date < '2024-01-02 00:00:00'"
\`\`\`

#### 3. Super Timeline Analysis
\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt

def analyze_timeline(timeline_file):
    """Analyze timeline for anomalies and patterns"""
    
    # Load timeline data
    df = pd.read_csv(timeline_file)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Activity density analysis
    hourly_activity = df.groupby(df['timestamp'].dt.hour).size()
    
    # Anomaly detection
    daily_activity = df.groupby(df['timestamp'].dt.date).size()
    anomalous_days = daily_activity[daily_activity > daily_activity.mean() + 2*daily_activity.std()]
    
    # Process activity correlation
    process_timeline = df[df['source_type'] == 'process']
    suspicious_processes = process_timeline.groupby('process_name').size().sort_values(ascending=False)
    
    return {
        'hourly_activity': hourly_activity,
        'anomalous_days': anomalous_days,
        'suspicious_processes': suspicious_processes
    }
\`\`\`

### Registry Forensics
\`\`\`bash
# Registry timeline extraction
volatility -f memory.raw --profile=Win10x64_19041 hivelist
volatility -f memory.raw --profile=Win10x64_19041 printkey -K "Microsoft\\\\Windows\\\\CurrentVersion\\\\Run"

# Persistence mechanism detection
volatility -f memory.raw --profile=Win10x64_19041 printkey -K "Microsoft\\\\Windows\\\\CurrentVersion\\\\RunOnce"
volatility -f memory.raw --profile=Win10x64_19041 printkey -K "Microsoft\\\\Windows NT\\\\CurrentVersion\\\\Winlogon"
\`\`\`

## Artifact Correlation Techniques

### Cross-Source Validation
\`\`\`python
def correlate_artifacts(memory_artifacts, disk_artifacts, network_logs):
    """Correlate artifacts across multiple sources"""
    
    correlations = []
    
    # Process to file correlation
    for process in memory_artifacts['processes']:
        matching_files = find_matching_files(
            process['image_path'], 
            disk_artifacts['files']
        )
        
        if matching_files:
            correlations.append({
                'type': 'process_file',
                'process': process,
                'files': matching_files,
                'confidence': calculate_confidence(process, matching_files)
            })
    
    # Network to process correlation
    for connection in memory_artifacts['network']:
        matching_process = find_process_by_pid(
            connection['pid'],
            memory_artifacts['processes']
        )
        
        if matching_process:
            correlations.append({
                'type': 'network_process',
                'connection': connection,
                'process': matching_process,
                'external_intel': check_threat_intel(connection['remote_ip'])
            })
    
    return correlations

def timeline_gap_analysis(timeline_data):
    """Identify suspicious gaps in timeline"""
    
    gaps = []
    sorted_events = sorted(timeline_data, key=lambda x: x['timestamp'])
    
    for i in range(1, len(sorted_events)):
        time_diff = sorted_events[i]['timestamp'] - sorted_events[i-1]['timestamp']
        
        # Suspicious gaps (e.g., > 30 minutes during business hours)
        if time_diff.total_seconds() > 1800:  # 30 minutes
            gaps.append({
                'start': sorted_events[i-1]['timestamp'],
                'end': sorted_events[i]['timestamp'],
                'duration': time_diff,
                'context': analyze_gap_context(sorted_events[i-1], sorted_events[i])
            })
    
    return gaps
\`\`\`

## Advanced Analysis Techniques

### Behavioral Analysis
\`\`\`sql
-- SQL queries for behavioral pattern detection

-- Detect lateral movement patterns
WITH movement_analysis AS (
    SELECT 
        source_host,
        target_host,
        username,
        logon_type,
        timestamp,
        LAG(target_host) OVER (
            PARTITION BY username 
            ORDER BY timestamp
        ) as previous_host
    FROM authentication_events
    WHERE timestamp > NOW() - INTERVAL 24 HOUR
)
SELECT 
    username,
    COUNT(DISTINCT target_host) as unique_hosts,
    COUNT(*) as total_logons,
    STRING_AGG(DISTINCT target_host, ', ') as accessed_hosts
FROM movement_analysis
WHERE previous_host IS NOT NULL 
    AND target_host != previous_host
GROUP BY username
HAVING COUNT(DISTINCT target_host) > 5
ORDER BY unique_hosts DESC;

-- Detect data staging activities
SELECT 
    process_name,
    file_path,
    file_size,
    operation_type,
    timestamp
FROM file_operations
WHERE operation_type IN ('CREATE', 'MODIFY')
    AND file_size > 100000000  -- Large files
    AND file_path LIKE '%temp%' OR file_path LIKE '%staging%'
ORDER BY timestamp DESC;
\`\`\`

### Encryption and Obfuscation Detection
\`\`\`python
import entropy
import yara

def detect_obfuscation(file_data):
    """Detect obfuscated or encrypted content"""
    
    # Entropy analysis
    file_entropy = entropy.shannon_entropy(file_data)
    
    # High entropy indicates encryption/compression
    if file_entropy > 7.5:
        return {
            'likely_encrypted': True,
            'entropy': file_entropy,
            'analysis': 'High entropy suggests encryption or compression'
        }
    
    # Pattern analysis for known obfuscation
    obfuscation_patterns = [
        rb'[A-Za-z0-9+/]{100,}={0,2}',  # Base64
        rb'\\\\x[0-9a-fA-F]{2}',           # Hex encoding
        rb'\\\\u[0-9a-fA-F]{4}',           # Unicode encoding
    ]
    
    detected_patterns = []
    for pattern in obfuscation_patterns:
        if re.search(pattern, file_data):
            detected_patterns.append(pattern)
    
    return {
        'likely_encrypted': file_entropy > 6.0,
        'entropy': file_entropy,
        'obfuscation_patterns': detected_patterns,
        'analysis': generate_analysis(file_entropy, detected_patterns)
    }
\`\`\`

## Case Study: APT Investigation

### Scenario
Advanced persistent threat with following indicators:
- Spear phishing email with malicious attachment
- Memory-resident malware
- Lateral movement across network
- Data exfiltration to external servers

### Investigation Steps

#### 1. Initial Triage
\`\`\`bash
# Memory acquisition from patient zero
DumpIt.exe /output C:\\memory.dmp

# Volatility analysis
volatility -f memory.dmp imageinfo
volatility -f memory.dmp --profile=Win10x64_19041 pslist
volatility -f memory.dmp --profile=Win10x64_19041 netscan
\`\`\`

#### 2. Malware Analysis
\`\`\`bash
# Extract suspicious processes
volatility -f memory.dmp --profile=Win10x64_19041 malfind
volatility -f memory.dmp --profile=Win10x64_19041 procdump -p 2468

# YARA scanning
yara apt_rules.yar extracted_process.exe
\`\`\`

#### 3. Timeline Reconstruction
\`\`\`bash
# Create comprehensive timeline
log2timeline.py case_timeline.plaso disk_image.dd memory.dmp

# Filter relevant timeframe
psort.py case_timeline.plaso "date > '2024-01-15 08:00:00'"
\`\`\`

#### 4. Attribution and IOC Generation
- Extract C2 communication patterns
- Identify TTPs used by threat actor
- Generate IOCs for threat hunting
- Document attack chain for reporting

## Reporting and Documentation

### Technical Report Structure
1. **Executive Summary**: High-level findings and impact
2. **Timeline of Events**: Chronological attack progression
3. **Technical Analysis**: Detailed artifact examination
4. **IOCs and TTPs**: Actionable intelligence
5. **Recommendations**: Remediation and prevention measures

### Evidence Preservation
- Chain of custody documentation
- Hash verification of all evidence
- Detailed methodology documentation
- Tool version and configuration records

Advanced digital forensics requires combining technical expertise with analytical thinking. Success depends on systematic methodology, proper tool usage, and thorough documentation of findings.`,
        category: "Tutorial",
        author: "Rachel Torres",
        authorTitle: "Digital Forensics Expert",
        authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop",
        readTime: 40,
        featured: false,
        breaking: false,
      },
      {
        title: "From Zero to CISSP: My Cybersecurity Certification Journey",
        excerpt: "Personal experience and practical tips for advancing your cybersecurity career...",
        content: "Career guidance and certification roadmap...",
        category: "Career",
        author: "Alex Thompson",
        authorTitle: "CISSP, Security Consultant",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
        readTime: 6,
        featured: true,
        breaking: false,
      },
      {
        title: "Critical Vulnerability Discovered in Popular Enterprise Software",
        excerpt: "Security researchers have identified a zero-day vulnerability affecting millions of enterprise installations...",
        content: "Breaking news analysis of the latest vulnerability...",
        category: "News",
        author: "News Team",
        authorTitle: "Security Reporter",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop",
        readTime: 5,
        featured: false,
        breaking: true,
      },
      {
        title: "New Cybersecurity Framework Released by NIST",
        excerpt: "The updated framework provides enhanced guidance for organizations to manage cybersecurity risks...",
        content: "Industry analysis of the new NIST framework...",
        category: "News",
        author: "Industry Desk",
        authorTitle: "Policy Analyst",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
        readTime: 8,
        featured: false,
        breaking: false,
      },
      {
        title: "Top 10 Open Source Security Tools for 2024",
        excerpt: "Comprehensive review of the most effective open source cybersecurity tools available today...",
        content: "Tool reviews and implementation guides...",
        category: "Tutorial",
        author: "Tool Review Team",
        authorTitle: "Security Engineers",
        imageUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=200&fit=crop",
        readTime: 12,
        featured: false,
        breaking: false,
      },
    ];

    sampleArticles.forEach(article => {
      const id = this.currentArticleId++;
      this.articles.set(id, {
        ...article,
        id,
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
      });
    });

    // Seed resources
    const sampleResources: InsertResource[] = [
      {
        title: "Cybersecurity Fundamentals",
        description: "Complete introduction to cybersecurity concepts and practices",
        url: "https://example.com/cyber-fundamentals",
        type: "free",
        category: "Beginner",
        provider: "CyberAcademy",
        price: "Free",
        difficulty: "beginner",
      },
      {
        title: "CISSP Certification Prep",
        description: "Comprehensive CISSP preparation course with practice exams",
        url: "https://example.com/cissp-prep",
        type: "premium",
        category: "Certification",
        provider: "SecureLearn",
        price: "$299",
        difficulty: "advanced",
      },
      {
        title: "Ethical Hacking Lab Environment",
        description: "Hands-on practice environment for ethical hacking techniques",
        url: "https://example.com/hack-lab",
        type: "tools",
        category: "Practice",
        provider: "HackLabs",
        price: "$49/month",
        difficulty: "intermediate",
      },
      {
        title: "Career Transition to Cybersecurity",
        description: "Guide for professionals transitioning into cybersecurity roles",
        url: "https://example.com/career-guide",
        type: "career",
        category: "Career",
        provider: "CareerCyber",
        price: "Free",
        difficulty: "beginner",
      },
    ];

    sampleResources.forEach(resource => {
      const id = this.currentResourceId++;
      this.resources.set(id, { ...resource, id });
    });

    // Seed cyber awareness assessments
    const sampleAssessments: InsertCyberAssessment[] = [
      {
        title: "Phishing Email Recognition",
        description: "Test your ability to identify phishing attempts",
        category: "phishing",
        difficulty: "beginner",
        scenario: "You receive an email from what appears to be your bank asking you to verify your account information urgently.",
        question: "What should you do with this email?",
        options: [
          "Click the link and enter my information to verify my account",
          "Call my bank directly using the number on my card to verify",
          "Forward the email to colleagues to warn them",
          "Reply to the email asking for more details"
        ],
        correctAnswer: 1,
        explanation: "Always verify suspicious emails by contacting the organization directly through official channels. Never click links or provide information through unsolicited emails.",
        points: 15,
        tags: ["email", "verification", "social-engineering"]
      },
      {
        title: "Password Security Assessment",
        description: "Evaluate password strength and security practices",
        category: "passwords",
        difficulty: "beginner",
        scenario: "You need to create a new password for your work account. Your company requires passwords to be at least 8 characters long.",
        question: "Which password provides the best security?",
        options: [
          "Password123!",
          "MyDog2024",
          "P@ssw0rd",
          "tr3@sure-h7nt-m00n-w@lk"
        ],
        correctAnswer: 3,
        explanation: "Longer passphrases with random words, numbers, and symbols provide better security than predictable patterns. Length and unpredictability are key factors.",
        points: 12,
        tags: ["passwords", "authentication", "best-practices"]
      },
      {
        title: "USB Drive Security",
        description: "Learn about physical security threats",
        category: "physical-security",
        difficulty: "intermediate",
        scenario: "You find an unmarked USB drive in your office parking lot. It looks like it might contain important documents.",
        question: "What is the safest course of action?",
        options: [
          "Plug it into my work computer to see what's on it",
          "Take it home and check it on my personal computer",
          "Report it to IT security without plugging it in anywhere",
          "Ask colleagues if they recognize it first"
        ],
        correctAnswer: 2,
        explanation: "Unknown USB devices can contain malware designed to compromise systems. Always report found devices to IT security without connecting them to any computer.",
        points: 18,
        tags: ["physical-security", "malware", "usb"]
      },
      {
        title: "Social Engineering Recognition",
        description: "Identify social engineering tactics",
        category: "social-engineering",
        difficulty: "intermediate",
        scenario: "Someone calls claiming to be from IT support, saying there's an urgent security issue with your account and they need your password to fix it immediately.",
        question: "How should you respond?",
        options: [
          "Provide the password since it's an emergency",
          "Ask for their employee ID and callback number",
          "Hang up and contact IT through official channels",
          "Ask them to prove their identity with personal questions"
        ],
        correctAnswer: 2,
        explanation: "Legitimate IT support never asks for passwords over the phone. Always verify requests through official channels and never provide credentials to unsolicited callers.",
        points: 20,
        tags: ["social-engineering", "verification", "phone-security"]
      },
      {
        title: "Wi-Fi Security Awareness",
        description: "Understanding wireless network risks",
        category: "network-security",
        difficulty: "beginner",
        scenario: "You're at a coffee shop and need to access your work email. You see several Wi-Fi networks available.",
        question: "Which connection choice is most secure?",
        options: [
          "Connect to the free 'Coffee_Shop_WiFi' network",
          "Use your mobile phone's hotspot feature",
          "Connect to 'FREE_INTERNET_HERE' which has the strongest signal",
          "Ask the barista for the Wi-Fi password"
        ],
        correctAnswer: 1,
        explanation: "Using your mobile hotspot is more secure than public Wi-Fi. If you must use public Wi-Fi, use the official network and always use VPN for sensitive activities.",
        points: 14,
        tags: ["wifi", "network-security", "mobile-security"]
      },
      {
        title: "Software Update Security",
        description: "Understanding the importance of updates",
        category: "system-security",
        difficulty: "beginner",
        scenario: "Your computer shows a notification that a security update is available for your operating system, but you're in the middle of important work.",
        question: "What's the best approach?",
        options: [
          "Ignore the update since you're busy",
          "Install the update immediately, even if it interrupts work",
          "Schedule the update for after work hours",
          "Wait until next month when you have more time"
        ],
        correctAnswer: 2,
        explanation: "Security updates patch vulnerabilities that attackers could exploit. Schedule updates promptly during appropriate times to maintain security without major disruption.",
        points: 13,
        tags: ["updates", "system-security", "vulnerability-management"]
      },
      {
        title: "Data Classification Handling",
        description: "Proper handling of sensitive information",
        category: "data-protection",
        difficulty: "advanced",
        scenario: "You're working from home and need to review confidential customer data. Your family members are also in the house.",
        question: "What's the most appropriate way to handle this situation?",
        options: [
          "Work in a room where others can't see your screen",
          "Work normally since family members are trustworthy",
          "Use privacy screen filters and work in a secure location",
          "Only look at the data when no one else is home"
        ],
        correctAnswer: 2,
        explanation: "Confidential data requires proper physical and visual protection. Privacy screens and secure locations help prevent unauthorized viewing regardless of trust levels.",
        points: 25,
        tags: ["data-protection", "privacy", "remote-work"]
      },
      {
        title: "Incident Response Knowledge",
        description: "Knowing how to respond to security incidents",
        category: "incident-response",
        difficulty: "advanced",
        scenario: "You notice unusual activity on your work computer - files are being encrypted and you see a ransom message.",
        question: "What should be your immediate first action?",
        options: [
          "Try to decrypt the files yourself",
          "Pay the ransom to get your files back",
          "Disconnect from the network and contact IT security",
          "Restart the computer to see if it fixes the problem"
        ],
        correctAnswer: 2,
        explanation: "Immediately isolate the infected system by disconnecting from the network to prevent spread, then contact incident response team. Never pay ransoms or attempt DIY solutions.",
        points: 30,
        tags: ["incident-response", "ransomware", "malware"]
      }
    ];

    sampleAssessments.forEach(assessment => {
      const id = this.currentAssessmentId++;
      this.cyberAssessments.set(id, { ...assessment, id, createdAt: new Date() });
    });

    // Seed achievements
    const sampleAchievements: InsertCyberAchievement[] = [
      {
        title: "First Steps",
        description: "Completed your first cyber awareness assessment",
        badgeIcon: "Trophy",
        category: "milestone",
        requirement: "Complete 1 assessment",
        points: 25
      },
      {
        title: "Phishing Expert",
        description: "Correctly identified 5 phishing scenarios",
        badgeIcon: "Shield",
        category: "expertise",
        requirement: "Score 5 correct answers in phishing category",
        points: 50
      },
      {
        title: "Password Pro",
        description: "Mastered password security principles",
        badgeIcon: "Key",
        category: "expertise",
        requirement: "Score 3 correct answers in password category",
        points: 40
      },
      {
        title: "Security Savvy",
        description: "Accumulated 100 total points",
        badgeIcon: "Star",
        category: "achievement",
        requirement: "Earn 100 total points",
        points: 75
      },
      {
        title: "Perfect Score",
        description: "Achieved 100% accuracy on 5+ assessments",
        badgeIcon: "Award",
        category: "achievement",
        requirement: "Perfect score on 5 assessments",
        points: 100
      },
      {
        title: "Speed Demon",
        description: "Completed 3 assessments in under 30 seconds each",
        badgeIcon: "Zap",
        category: "achievement", 
        requirement: "3 assessments completed under 30 seconds",
        points: 60
      },
      {
        title: "Knowledge Seeker",
        description: "Completed 20 cyber awareness assessments",
        badgeIcon: "BookOpen",
        category: "milestone",
        requirement: "Complete 20 assessments",
        points: 150
      },
      {
        title: "Category Master",
        description: "Achieved 80%+ accuracy in 3 different categories",
        badgeIcon: "Crown",
        category: "expertise",
        requirement: "80% accuracy in 3 categories",
        points: 200
      }
    ];

    sampleAchievements.forEach(achievement => {
      const id = this.currentAchievementId++;
      this.cyberAchievements.set(id, { ...achievement, id });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.passwordResetToken === token,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUserPassword(id: number, passwordHash: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.passwordHash = passwordHash;
      user.mustChangePassword = false;
      user.tokenVersion = (user.tokenVersion || 0) + 1;
      user.updatedAt = new Date();
      this.users.set(id, user);
    }
  }

  async setPasswordResetToken(id: number, token: string, expires: Date): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.passwordResetToken = token;
      user.passwordResetExpires = expires;
      this.users.set(id, user);
    }
  }

  async clearPasswordResetToken(id: number): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      this.users.set(id, user);
    }
  }

  async setEmailVerificationToken(id: number, token: string, expires: Date): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      (user as any).emailVerificationToken = token;
      (user as any).emailVerificationExpires = expires;
      this.users.set(id, user);
    }
  }

  async verifyEmail(id: number): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      (user as any).emailVerified = true;
      (user as any).emailVerificationToken = null;
      (user as any).emailVerificationExpires = null;
      this.users.set(id, user);
    }
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if ((user as any).emailVerificationToken === token) {
        return user;
      }
    }
    return undefined;
  }

  // Article methods
  async getArticles(options: { category?: string; featured?: boolean; breaking?: boolean; limit?: number } = {}): Promise<Article[]> {
    let articles = Array.from(this.articles.values());

    if (options.category) {
      articles = articles.filter(article => article.category === options.category);
    }
    if (options.featured !== undefined) {
      articles = articles.filter(article => article.featured === options.featured);
    }
    if (options.breaking !== undefined) {
      articles = articles.filter(article => article.breaking === options.breaking);
    }

    articles.sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());

    if (options.limit) {
      articles = articles.slice(0, options.limit);
    }

    return articles;
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const article: Article = {
      ...insertArticle,
      id,
      publishedAt: new Date(),
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;

    const updatedArticle = { ...article, ...updates };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: number): Promise<boolean> {
    return this.articles.delete(id);
  }

  async searchArticles(query: string): Promise<Article[]> {
    const articles = Array.from(this.articles.values());
    const lowercaseQuery = query.toLowerCase();
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.excerpt.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.author.toLowerCase().includes(lowercaseQuery)
    ).sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());
  }

  // Resource methods
  async getResources(options: { type?: string; category?: string; difficulty?: string } = {}): Promise<Resource[]> {
    let resources = Array.from(this.resources.values());

    if (options.type) {
      resources = resources.filter(resource => resource.type === options.type);
    }
    if (options.category) {
      resources = resources.filter(resource => resource.category === options.category);
    }
    if (options.difficulty) {
      resources = resources.filter(resource => resource.difficulty === options.difficulty);
    }

    return resources;
  }

  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.currentResourceId++;
    const resource: Resource = { ...insertResource, id };
    this.resources.set(id, resource);
    return resource;
  }

  // Newsletter methods
  async subscribeNewsletter(email: string, options?: {
    weeklyDigest?: boolean;
    digitalSafetyTips?: boolean;
    tipsFrequency?: string;
    audience?: string;
    region?: string;
    alertPriority?: string;
  }): Promise<Newsletter> {
    // Check if email already exists
    const existing = Array.from(this.newsletters.values()).find(n => n.email === email);
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        this.newsletters.set(existing.id, existing);
      }
      return existing;
    }

    const id = this.currentNewsletterId++;
    const newsletter: Newsletter = {
      id,
      email,
      subscribedAt: new Date(),
      active: true,
      weeklyDigest: options?.weeklyDigest ?? true,
      digitalSafetyTips: options?.digitalSafetyTips ?? false,
      tipsFrequency: options?.tipsFrequency ?? 'weekly',
      audience: options?.audience ?? 'all',
      region: options?.region ?? 'global',
      alertPriority: options?.alertPriority ?? 'all',
      preferenceToken: null,
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  async updateNewsletterPreferences(email: string, options: {
    weeklyDigest?: boolean;
    digitalSafetyTips?: boolean;
    tipsFrequency?: string;
    audience?: string;
    region?: string;
    alertPriority?: string;
  }): Promise<Newsletter | undefined> {
    const existing = Array.from(this.newsletters.values()).find(n => n.email === email);
    if (!existing) return undefined;
    
    if (options.weeklyDigest !== undefined) existing.weeklyDigest = options.weeklyDigest;
    if (options.digitalSafetyTips !== undefined) existing.digitalSafetyTips = options.digitalSafetyTips;
    if (options.tipsFrequency !== undefined) existing.tipsFrequency = options.tipsFrequency;
    if (options.audience !== undefined) existing.audience = options.audience;
    if (options.region !== undefined) existing.region = options.region;
    if (options.alertPriority !== undefined) existing.alertPriority = options.alertPriority;
    
    this.newsletters.set(existing.id, existing);
    return existing;
  }

  async getNewsletterSubscriptions(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values()).filter(n => n.active);
  }

  async deleteNewsletterSubscription(id: number): Promise<boolean> {
    return this.newsletters.delete(id);
  }

  // Cyber Awareness Assessment methods
  async getCyberAssessments(options: { category?: string; difficulty?: string; limit?: number } = {}): Promise<CyberAssessment[]> {
    let assessments = Array.from(this.cyberAssessments.values());
    
    if (options.category) {
      assessments = assessments.filter(a => a.category === options.category);
    }
    
    if (options.difficulty) {
      assessments = assessments.filter(a => a.difficulty === options.difficulty);
    }
    
    if (options.limit) {
      assessments = assessments.slice(0, options.limit);
    }
    
    return assessments;
  }

  async getCyberAssessment(id: number): Promise<CyberAssessment | undefined> {
    return this.cyberAssessments.get(id);
  }

  async createAssessmentResult(insertResult: InsertUserAssessmentResult): Promise<UserAssessmentResult> {
    const id = this.currentResultId++;
    const result: UserAssessmentResult = {
      ...insertResult,
      id,
      completedAt: new Date(),
    };
    this.userAssessmentResults.set(id, result);
    
    // Check for new achievements after completing assessment
    await this.checkAndUnlockAchievements(insertResult.sessionId);
    
    return result;
  }

  async getUserAssessmentResults(sessionId: string): Promise<UserAssessmentResult[]> {
    return Array.from(this.userAssessmentResults.values())
      .filter(r => r.sessionId === sessionId);
  }

  async getUserScore(sessionId: string): Promise<{ 
    totalScore: number; 
    correctAnswers: number; 
    totalQuestions: number; 
    categoryBreakdown: Record<string, { correct: number; total: number; score: number }> 
  }> {
    const results = await this.getUserAssessmentResults(sessionId);
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const totalQuestions = results.length;
    const totalScore = results.reduce((sum, r) => {
      if (r.isCorrect && r.assessmentId) {
        const assessment = this.cyberAssessments.get(r.assessmentId);
        return sum + (assessment?.points || 10);
      }
      return sum;
    }, 0);

    // Category breakdown
    const categoryBreakdown: Record<string, { correct: number; total: number; score: number }> = {};
    
    results.forEach(result => {
      if (result.assessmentId) {
        const assessment = this.cyberAssessments.get(result.assessmentId);
        if (assessment) {
          if (!categoryBreakdown[assessment.category]) {
            categoryBreakdown[assessment.category] = { correct: 0, total: 0, score: 0 };
          }
          categoryBreakdown[assessment.category].total++;
          if (result.isCorrect) {
            categoryBreakdown[assessment.category].correct++;
            categoryBreakdown[assessment.category].score += assessment.points;
          }
        }
      }
    });

    return { totalScore, correctAnswers, totalQuestions, categoryBreakdown };
  }

  // Achievement methods
  async getCyberAchievements(): Promise<CyberAchievement[]> {
    return Array.from(this.cyberAchievements.values());
  }

  async getUserAchievements(sessionId: string): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values())
      .filter(a => a.sessionId === sessionId);
  }

  async createUserAchievement(insertAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = this.currentUserAchievementId++;
    const achievement: UserAchievement = {
      ...insertAchievement,
      id,
      unlockedAt: new Date(),
    };
    this.userAchievements.set(id, achievement);
    return achievement;
  }

  async checkAndUnlockAchievements(sessionId: string): Promise<UserAchievement[]> {
    const userScore = await this.getUserScore(sessionId);
    const userAchievements = await this.getUserAchievements(sessionId);
    const unlockedAchievementIds = new Set(userAchievements.map(a => a.achievementId));
    const newAchievements: UserAchievement[] = [];

    // Check all achievements for unlock conditions
    const allAchievements = await this.getCyberAchievements();
    
    for (const achievement of allAchievements) {
      if (!unlockedAchievementIds.has(achievement.id)) {
        let shouldUnlock = false;

        // Check achievement requirements
        switch (achievement.id) {
          case 1: // First Steps
            shouldUnlock = userScore.totalQuestions >= 1;
            break;
          case 2: // Phishing Expert  
            shouldUnlock = userScore.categoryBreakdown.phishing?.correct >= 5;
            break;
          case 3: // Password Pro
            shouldUnlock = userScore.categoryBreakdown.passwords?.correct >= 3;
            break;
          case 4: // Security Savvy
            shouldUnlock = userScore.totalScore >= 100;
            break;
          case 5: // Perfect Score
            shouldUnlock = userScore.correctAnswers >= 5 && 
                         userScore.correctAnswers === userScore.totalQuestions;
            break;
          case 6: // Speed Demon
            const fastResults = Array.from(this.userAssessmentResults.values())
              .filter(r => r.sessionId === sessionId && r.timeSpent && r.timeSpent <= 30);
            shouldUnlock = fastResults.length >= 3;
            break;
          case 7: // Knowledge Seeker
            shouldUnlock = userScore.totalQuestions >= 20;
            break;
          case 8: // Category Master
            const masteredCategories = Object.values(userScore.categoryBreakdown)
              .filter(cat => cat.correct >= 3 && cat.correct / cat.total >= 0.8);
            shouldUnlock = masteredCategories.length >= 3;
            break;
        }

        if (shouldUnlock) {
          const newAchievement = await this.createUserAchievement({
            sessionId,
            username: null,
            achievementId: achievement.id,
          });
          newAchievements.push(newAchievement);
        }
      }
    }

    return newAchievements;
  }

  async recordScamTrend(scamType: string, keywords?: string[], region?: string): Promise<void> {
  }

  async getScamTrends(options?: { weeks?: number; scamType?: string }): Promise<ScamTrend[]> {
    return [];
  }

  async getTopScamTrends(limit?: number, region?: string): Promise<{ scamType: string; count: number; trend: string }[]> {
    return [];
  }

  // Two-Factor Authentication (stub for MemStorage)
  async setTwoFactorSecret(userId: number, secret: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      this.users.set(userId, { ...user, twoFactorSecret: secret });
    }
  }

  async enableTwoFactor(userId: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      this.users.set(userId, { ...user, twoFactorEnabled: true });
    }
  }

  async disableTwoFactor(userId: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      this.users.set(userId, { ...user, twoFactorEnabled: false, twoFactorSecret: null });
    }
  }

  // Audit Logging (stub for MemStorage)
  private auditLogs: Map<number, AuditLog> = new Map();
  private auditLogIdCounter = 1;

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const id = this.auditLogIdCounter++;
    const auditLog: AuditLog = { id, ...log, createdAt: new Date() };
    this.auditLogs.set(id, auditLog);
    return auditLog;
  }

  async getAuditLogs(options?: { userId?: number; action?: string; limit?: number }): Promise<AuditLog[]> {
    let logs = Array.from(this.auditLogs.values());
    if (options?.userId) logs = logs.filter(l => l.userId === options.userId);
    if (options?.action) logs = logs.filter(l => l.action === options.action);
    logs.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    return logs.slice(0, options?.limit || 100);
  }

  // Security Alerts (stubs for MemStorage - not used in production)
  async getSecurityAlerts(): Promise<SecurityAlert[]> { return []; }
  async getSecurityAlert(): Promise<SecurityAlert | undefined> { return undefined; }
  async createSecurityAlert(alert: InsertSecurityAlert): Promise<SecurityAlert> { 
    return { id: 1, ...alert, isRead: false, isAcknowledged: false, acknowledgedBy: null, acknowledgedAt: null, createdAt: new Date() }; 
  }
  async markAlertAsRead(): Promise<void> {}
  async acknowledgeAlert(): Promise<void> {}
  async getUnreadAlertCount(): Promise<number> { return 0; }

  // Scam Checker Usage Tracking (stubs for MemStorage)
  async logScamCheckerUsage(_analysisType: string, _resultRisk?: string, _region?: string): Promise<void> {}
  async getScamCheckerStats(): Promise<{ total: number; byType: Record<string, number>; byRisk: Record<string, number>; byRegion: Record<string, number>; today: number; thisWeek: number; thisMonth: number }> {
    return { total: 0, byType: {}, byRisk: {}, byRegion: {}, today: 0, thisWeek: 0, thisMonth: 0 };
  }

  // Breach Checker Usage Tracking (stubs for MemStorage)
  async logBreachCheckerUsage(): Promise<void> {}
  async getBreachCheckerStats(): Promise<{ total: number; byType: Record<string, number>; totalBreachesFound: number; passwordExposures: number; monitoringSignups: number; today: number; thisWeek: number; thisMonth: number }> {
    return { total: 0, byType: {}, totalBreachesFound: 0, passwordExposures: 0, monitoringSignups: 0, today: 0, thisWeek: 0, thisMonth: 0 };
  }

  // Breach Monitoring (stubs for MemStorage)
  async createBreachMonitoringSubscription(subscription: { email: string; monitoredEmails: string[]; newsletterId?: number; unsubscribeToken?: string }): Promise<{ id: number; email: string; monitoredEmails: string[] }> {
    return { id: 1, email: subscription.email, monitoredEmails: subscription.monitoredEmails };
  }
  async getBreachMonitoringSubscription(email: string): Promise<{ id: number; email: string; monitoredEmails: string[]; isActive: boolean; totalBreachesFound: number } | undefined> {
    return undefined;
  }
  async updateBreachMonitoringSubscription(): Promise<void> {}
  async saveBreachCheckResult(result: { email: string; breachName: string }): Promise<{ id: number }> {
    return { id: 1 };
  }
  async getBreachCheckResults(email: string): Promise<Array<{ id: number; breachName: string; breachDomain: string | null; breachDate: Date | null; exposedDataTypes: string[] | null; severity: string | null; isPasswordExposed: boolean; discoveredAt: Date }>> {
    return [];
  }

  // WebAuthn (Passkeys) - stubs for MemStorage
  async createWebauthnCredential(credential: InsertWebauthnCredential): Promise<WebauthnCredential> {
    return { id: 1, ...credential, createdAt: new Date() } as WebauthnCredential;
  }
  async getWebauthnCredentialsByUserId(userId: number): Promise<WebauthnCredential[]> { return []; }
  async getWebauthnCredentialById(credentialId: string): Promise<WebauthnCredential | undefined> { return undefined; }
  async updateWebauthnCredentialCounter(credentialId: string, counter: number): Promise<void> {}
  async deleteWebauthnCredential(id: number): Promise<boolean> { return true; }
  async createWebauthnChallenge(challenge: InsertWebauthnChallenge): Promise<WebauthnChallenge> {
    return { id: 1, ...challenge, createdAt: new Date() } as WebauthnChallenge;
  }
  async getWebauthnChallenge(challenge: string): Promise<WebauthnChallenge | undefined> { return undefined; }
  async getPendingChallengesForUser(userId: number, type: string): Promise<WebauthnChallenge[]> { return []; }
  async deleteWebauthnChallenge(challenge: string): Promise<void> {}
  async cleanupExpiredChallenges(): Promise<void> {}
}

import { storage } from "./database-storage";
export { storage };
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
