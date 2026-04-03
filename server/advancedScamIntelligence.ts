import { logger } from "./logger";
import { db } from "./db";
import { scanHistory } from "@shared/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";

const log = logger.child("AdvancedScamIntel");

export interface CampaignPlaybook {
  id: string;
  name: string;
  description: string;
  category: "account_weaponization" | "invoice_fraud" | "payment_redirect" | "credential_harvest" | "tech_support" | "delivery_impersonation" | "refund_scam" | "subscription_trap";
  targetBrands: string[];
  steps: PlaybookStep[];
  prevalence: "common" | "rising" | "rare";
  sophistication: "basic" | "intermediate" | "advanced" | "expert";
  responseProtocol: string[];
}

export interface PlaybookStep {
  order: number;
  description: string;
  emailSubjectPatterns: string[];
  contentIndicators: string[];
  isCurrentStep?: boolean;
  nextStepWarning: string;
}

export interface BrandInfrastructure {
  brand: string;
  domains: string[];
  legitimateESPs: string[];
  knownSendingDomains: string[];
  headerPatterns: Record<string, string>;
  transactionalEmailTypes: string[];
}

export interface ContextAnswer {
  didInitiate: boolean | null;
  hasAccount: boolean | null;
  expectingEmail: boolean | null;
  madeRecentPurchase: boolean | null;
  recognizeSender: boolean | null;
  additionalContext?: string;
}

export interface CampaignCorrelation {
  isPartOfCampaign: boolean;
  campaignId?: string;
  matchedPlaybook?: CampaignPlaybook;
  currentStep?: number;
  totalSteps?: number;
  nextStepPrediction?: string;
  relatedScans: Array<{
    id: string;
    contentSnippet: string;
    riskLevel: string;
    scannedAt: string;
    matchReason: string;
  }>;
  urgencyLevel: "none" | "monitor" | "warning" | "critical";
  timelineInsight: string;
}

export interface VisualAnalysisResult {
  brandDetected: string | null;
  templateMatch: "legitimate" | "suspicious" | "counterfeit" | "unknown";
  visualRedFlags: string[];
  brandConsistencyScore: number;
  recommendations: string[];
}

export interface EnhancedAnalysisResult {
  contextRiskModifier: number;
  campaignCorrelation: CampaignCorrelation;
  playbookMatch: CampaignPlaybook | null;
  contextInsights: string[];
  responseProtocol: string[];
  accountWeaponization: boolean;
  legitimateServiceAbuse: boolean;
}

const CAMPAIGN_PLAYBOOKS: CampaignPlaybook[] = [
  {
    id: "walmart-account-weaponization",
    name: "Walmart Account Weaponization",
    description: "Attackers create a real Walmart account using victim's email, then trigger genuine transactional emails. Victim receives legitimate Walmart emails about account creation and purchases they didn't make, followed by a 'dispute' or 'cancel' link that harvests credentials.",
    category: "account_weaponization",
    targetBrands: ["walmart", "walmart.com"],
    steps: [
      {
        order: 1,
        description: "Account creation confirmation email from Walmart",
        emailSubjectPatterns: ["welcome to walmart", "account created", "verify your email", "new walmart account"],
        contentIndicators: ["thank you for creating", "your new account", "welcome to walmart", "get started shopping"],
        nextStepWarning: "You may receive a fake purchase confirmation next. Do NOT click any links."
      },
      {
        order: 2,
        description: "Purchase confirmation for items the victim never bought",
        emailSubjectPatterns: ["order confirmation", "your order", "purchase receipt", "order #"],
        contentIndicators: ["order has been placed", "delivery estimate", "order total", "items ordered", "shipping to"],
        nextStepWarning: "The next step will likely be a 'dispute this charge' or 'cancel order' email with a phishing link."
      },
      {
        order: 3,
        description: "Dispute/cancel prompt with credential harvesting link",
        emailSubjectPatterns: ["dispute this charge", "cancel your order", "unauthorized purchase", "verify your identity"],
        contentIndicators: ["if you did not make this purchase", "click here to dispute", "cancel this order", "verify your identity", "secure your account"],
        nextStepWarning: "This is the attack payload. The link will lead to a fake login page designed to steal your password."
      }
    ],
    prevalence: "rising",
    sophistication: "advanced",
    responseProtocol: [
      "Do NOT click any links in these emails, even if they appear to come from Walmart",
      "Go directly to walmart.com by typing it in your browser",
      "Check if an account exists with your email — if so, take control of it immediately",
      "Change the password and enable two-factor authentication",
      "Check your email for any password reset or account verification messages you didn't request",
      "Monitor your bank and credit card statements for unauthorized charges",
      "Report the incident to Walmart's abuse team and the FTC at reportfraud.ftc.gov"
    ]
  },
  {
    id: "paypal-invoice-weaponization",
    name: "PayPal Invoice Weaponization",
    description: "Attackers use PayPal's legitimate invoice system to send real PayPal invoices to victims. The emails come from paypal.com with valid SPF/DKIM because they ARE real PayPal emails. The invoice includes a fake phone number to call for 'support'.",
    category: "invoice_fraud",
    targetBrands: ["paypal", "paypal.com"],
    steps: [
      {
        order: 1,
        description: "Legitimate PayPal invoice email for a purchase you didn't make",
        emailSubjectPatterns: ["invoice from", "you've got a money request", "payment request", "invoice"],
        contentIndicators: ["invoice", "amount due", "pay now", "view and pay invoice", "seller note", "call", "support", "cancel"],
        nextStepWarning: "Do NOT call any phone number in the invoice. It connects to scammers who will ask for remote access to your computer."
      },
      {
        order: 2,
        description: "Follow-up reminder email about unpaid invoice",
        emailSubjectPatterns: ["reminder", "payment due", "overdue invoice", "final notice"],
        contentIndicators: ["reminder", "still outstanding", "payment required", "account will be charged"],
        nextStepWarning: "This creates urgency. The scammers want you to panic and call their fake support number."
      }
    ],
    prevalence: "common",
    sophistication: "advanced",
    responseProtocol: [
      "Do NOT call any phone number listed in the invoice or email",
      "Do NOT click 'Pay Now' or any payment links",
      "Log into paypal.com directly by typing it in your browser",
      "Check your PayPal account for any unauthorized invoices — you can decline them",
      "Report the invoice as fraudulent within PayPal",
      "Block the sender in PayPal's settings",
      "Report to the FTC at reportfraud.ftc.gov"
    ]
  },
  {
    id: "amazon-order-weaponization",
    name: "Amazon Order Confirmation Attack",
    description: "Attackers trigger or fake Amazon order confirmations, creating urgency to 'cancel' an unauthorized purchase through a phishing link or fake customer service number.",
    category: "account_weaponization",
    targetBrands: ["amazon", "amazon.com"],
    steps: [
      {
        order: 1,
        description: "Order confirmation for expensive items you didn't purchase",
        emailSubjectPatterns: ["your amazon.com order", "order confirmation", "your order of"],
        contentIndicators: ["your order has been placed", "estimated delivery", "order total", "arriving", "ship to"],
        nextStepWarning: "A 'cancel this order' email or notification will follow with a phishing link."
      },
      {
        order: 2,
        description: "Cancel/dispute prompt with credential harvesting",
        emailSubjectPatterns: ["cancel your order", "order cancellation", "unauthorized order", "security alert"],
        contentIndicators: ["cancel this order", "if you did not place this order", "secure your account", "verify your identity"],
        nextStepWarning: "The cancellation link leads to a fake Amazon login page. Never enter your password on any page you reached through an email link."
      }
    ],
    prevalence: "common",
    sophistication: "intermediate",
    responseProtocol: [
      "Do NOT click any links in the email",
      "Open amazon.com directly in your browser and check Your Orders",
      "If you see an order you didn't place, contact Amazon through their official website",
      "Change your Amazon password immediately",
      "Enable two-factor authentication on your Amazon account",
      "Check for unauthorized account access in your Amazon security settings"
    ]
  },
  {
    id: "bank-account-alert-weaponization",
    name: "Bank Security Alert Weaponization",
    description: "Attackers send emails mimicking bank security alerts about suspicious transactions, locked accounts, or required verification. Often use real bank notification formats obtained from data breaches.",
    category: "credential_harvest",
    targetBrands: ["chase", "bankofamerica", "wellsfargo", "citi", "capitalone", "usbank"],
    steps: [
      {
        order: 1,
        description: "Security alert about suspicious activity on your account",
        emailSubjectPatterns: ["security alert", "suspicious activity", "unusual login", "account locked", "verify your identity"],
        contentIndicators: ["suspicious activity detected", "your account has been", "temporary hold", "verify your identity", "unusual transaction"],
        nextStepWarning: "A follow-up with a 'verify now' or 'unlock account' link will try to steal your banking credentials."
      },
      {
        order: 2,
        description: "Urgent verification required to restore access",
        emailSubjectPatterns: ["action required", "verify now", "restore access", "account suspended"],
        contentIndicators: ["click here to verify", "restore your account", "failure to verify will result in", "account will be permanently"],
        nextStepWarning: "This is the credential harvesting step. The link leads to a fake banking portal."
      }
    ],
    prevalence: "common",
    sophistication: "intermediate",
    responseProtocol: [
      "NEVER click links in emails claiming to be from your bank",
      "Call your bank using the number on the back of your debit/credit card",
      "Log into your bank's website by typing the URL directly",
      "Check your recent transactions for any unauthorized activity",
      "If you entered credentials on a suspicious page, change your banking password immediately",
      "Enable transaction alerts on your bank account",
      "Report to your bank's fraud department"
    ]
  },
  {
    id: "microsoft-365-credential-harvest",
    name: "Microsoft 365 Credential Harvest",
    description: "Sophisticated phishing using realistic Microsoft 365 login pages, often delivered through legitimate services (SharePoint invites, OneDrive shares, Teams notifications) that trigger real Microsoft emails.",
    category: "credential_harvest",
    targetBrands: ["microsoft", "office365", "outlook", "teams", "sharepoint", "onedrive"],
    steps: [
      {
        order: 1,
        description: "SharePoint/OneDrive sharing notification or Teams message",
        emailSubjectPatterns: ["shared a file with you", "shared a document", "new message in teams", "voicemail from"],
        contentIndicators: ["has shared", "open in sharepoint", "view document", "play voicemail", "onedrive"],
        nextStepWarning: "The shared document link may redirect to a fake Microsoft login page."
      },
      {
        order: 2,
        description: "Fake Microsoft login page requesting credentials",
        emailSubjectPatterns: ["sign-in required", "session expired", "verify your account", "password expiring"],
        contentIndicators: ["sign in to continue", "your session has expired", "password will expire", "re-authenticate"],
        nextStepWarning: "After entering credentials, attackers gain access to your entire Microsoft 365 account including email, files, and contacts."
      }
    ],
    prevalence: "common",
    sophistication: "advanced",
    responseProtocol: [
      "Never enter your Microsoft password on any page you reached through an email link",
      "Go to office.com or outlook.com directly by typing it in your browser",
      "Check your Microsoft account's recent sign-in activity at account.microsoft.com",
      "Enable multi-factor authentication on your Microsoft account",
      "If you entered credentials, change your password immediately and revoke all active sessions",
      "Report phishing emails using Microsoft's 'Report Message' add-in in Outlook"
    ]
  },
  {
    id: "shipping-delivery-impersonation",
    name: "Delivery Notification Impersonation",
    description: "Fake USPS, UPS, FedEx, or DHL notifications about packages requiring action — customs fees, redelivery scheduling, or address verification. Often timed around holidays when people expect packages.",
    category: "delivery_impersonation",
    targetBrands: ["usps", "ups", "fedex", "dhl", "amazon"],
    steps: [
      {
        order: 1,
        description: "Missed delivery or customs fee notification",
        emailSubjectPatterns: ["delivery attempted", "package held", "customs fee required", "reschedule delivery", "tracking update"],
        contentIndicators: ["delivery attempt was made", "customs clearance required", "small fee of", "reschedule your delivery", "tracking number"],
        nextStepWarning: "The 'pay fee' or 'reschedule' link leads to a phishing page that steals credit card information."
      },
      {
        order: 2,
        description: "Payment page for fake customs/redelivery fee",
        emailSubjectPatterns: ["payment required", "complete your delivery", "final notice"],
        contentIndicators: ["pay now", "credit card", "processing fee", "delivery fee", "small charge of"],
        nextStepWarning: "Entering payment details gives scammers your credit card information."
      }
    ],
    prevalence: "common",
    sophistication: "basic",
    responseProtocol: [
      "USPS, UPS, and FedEx never ask for payment via email for redelivery",
      "Track your packages using the official carrier website with your tracking number",
      "If you're expecting a package, go directly to the carrier's website",
      "Never enter credit card information on a page reached through an email or text link",
      "Report fake delivery texts to 7726 (SPAM)"
    ]
  },
  {
    id: "subscription-renewal-scam",
    name: "Fake Subscription Renewal Alert",
    description: "Emails claiming your subscription to Norton, McAfee, Geek Squad, or other services has been renewed for a large amount. Includes a phone number to call for 'refund' which leads to a tech support scam.",
    category: "refund_scam",
    targetBrands: ["norton", "mcafee", "geeksquad", "bestbuy", "apple"],
    steps: [
      {
        order: 1,
        description: "Auto-renewal confirmation for a service you don't use",
        emailSubjectPatterns: ["subscription renewed", "auto-renewal", "payment processed", "annual renewal", "receipt for renewal"],
        contentIndicators: ["has been renewed", "charged to your account", "$299", "$399", "$499", "call to cancel", "refund within"],
        nextStepWarning: "The phone number connects to scammers who will request remote access to your computer to process a 'refund'."
      },
      {
        order: 2,
        description: "Refund process that installs malware or steals bank info",
        emailSubjectPatterns: ["refund confirmation", "your refund", "cancellation processed"],
        contentIndicators: ["refund has been initiated", "verify your bank", "confirm your refund", "remote session"],
        nextStepWarning: "Scammers will ask you to install remote access software and then manipulate your screen to appear like a refund was 'accidentally' too much, asking you to send back the difference."
      }
    ],
    prevalence: "common",
    sophistication: "intermediate",
    responseProtocol: [
      "Do NOT call any phone number in the email",
      "Check your actual subscriptions through each service's official website",
      "Check your bank or credit card statement for the charge — if it's not there, the email is fake",
      "If you did call the number, do NOT install any software they suggest",
      "If you already gave remote access, disconnect from the internet immediately and scan for malware",
      "Report to the FTC at reportfraud.ftc.gov"
    ]
  },
  {
    id: "venmo-zelle-payment-weaponization",
    name: "Venmo/Zelle Payment Weaponization",
    description: "Attackers exploit Venmo or Zelle to send small payments or payment requests to victims from the legitimate platform, then follow up with social engineering to get money sent back.",
    category: "payment_redirect",
    targetBrands: ["venmo", "zelle", "cashapp"],
    steps: [
      {
        order: 1,
        description: "Unexpected payment received or payment request from unknown sender",
        emailSubjectPatterns: ["sent you", "payment received", "money request", "you received"],
        contentIndicators: ["sent you $", "payment request", "accept payment", "you received money from"],
        nextStepWarning: "The sender will claim the payment was a mistake and ask you to send money back. This is a classic overpayment scam."
      },
      {
        order: 2,
        description: "Request to return the 'accidental' payment",
        emailSubjectPatterns: ["mistake", "wrong person", "please send back", "accidental payment"],
        contentIndicators: ["sent by mistake", "wrong person", "please return", "send back", "accidental"],
        nextStepWarning: "If you send money back, the original payment will be reversed (it was from a stolen account), and you lose the money you sent."
      }
    ],
    prevalence: "rising",
    sophistication: "intermediate",
    responseProtocol: [
      "NEVER send money back to someone who claims they paid you by accident",
      "If someone sends you money 'by accident,' contact the payment service directly",
      "The original payment is likely from a stolen account and will be reversed",
      "Report the suspicious payment through the app's official reporting feature",
      "Block the sender immediately"
    ]
  }
];

const BRAND_INFRASTRUCTURE: BrandInfrastructure[] = [
  {
    brand: "Walmart",
    domains: ["walmart.com", "wal-mart.com"],
    legitimateESPs: ["Salesforce Marketing Cloud", "Oracle Responsys"],
    knownSendingDomains: ["walmart.com", "email.walmart.com", "e.walmart.com", "notify.walmart.com"],
    headerPatterns: {
      "x-mailer": "salesforce|responsys|oracle",
      "return-path": ".*@.*walmart\\.com"
    },
    transactionalEmailTypes: ["account_creation", "order_confirmation", "shipping_update", "password_reset", "promotional"]
  },
  {
    brand: "Amazon",
    domains: ["amazon.com", "amazon.co.uk", "amazon.ca", "amazon.de"],
    legitimateESPs: ["Amazon SES"],
    knownSendingDomains: ["amazon.com", "email.amazon.com", "marketplace.amazon.com"],
    headerPatterns: {
      "x-ses-outgoing": ".*",
      "return-path": ".*@.*amazon\\.com"
    },
    transactionalEmailTypes: ["order_confirmation", "shipping_notification", "delivery_confirmation", "account_alert", "promotional"]
  },
  {
    brand: "PayPal",
    domains: ["paypal.com", "paypal.me"],
    legitimateESPs: ["PayPal Internal"],
    knownSendingDomains: ["paypal.com", "mail.paypal.com", "e.paypal.com"],
    headerPatterns: {
      "x-pp-az-locales": ".*",
      "return-path": ".*@.*paypal\\.com"
    },
    transactionalEmailTypes: ["invoice", "payment_received", "payment_sent", "money_request", "security_alert"]
  },
  {
    brand: "Microsoft",
    domains: ["microsoft.com", "outlook.com", "hotmail.com", "live.com", "office365.com", "office.com"],
    legitimateESPs: ["Microsoft Internal", "Azure Communication Services"],
    knownSendingDomains: ["microsoft.com", "email.microsoft.com", "accountprotection.microsoft.com", "teams.microsoft.com"],
    headerPatterns: {
      "x-microsoft-antispam": ".*",
      "x-ms-exchange-organization": ".*"
    },
    transactionalEmailTypes: ["sign_in_alert", "password_reset", "sharing_notification", "teams_message", "subscription_renewal"]
  },
  {
    brand: "Chase",
    domains: ["chase.com", "jpmorgan.com"],
    legitimateESPs: ["Acoustic (IBM Watson Campaign Automation)"],
    knownSendingDomains: ["chase.com", "email.chase.com", "alerts.chase.com"],
    headerPatterns: {
      "return-path": ".*@.*chase\\.com"
    },
    transactionalEmailTypes: ["transaction_alert", "security_alert", "statement_ready", "payment_due"]
  },
  {
    brand: "Bank of America",
    domains: ["bankofamerica.com", "bofa.com"],
    legitimateESPs: ["Adobe Campaign"],
    knownSendingDomains: ["bankofamerica.com", "ealerts.bankofamerica.com"],
    headerPatterns: {
      "return-path": ".*@.*bankofamerica\\.com"
    },
    transactionalEmailTypes: ["transaction_alert", "security_alert", "balance_update", "payment_confirmation"]
  },
  {
    brand: "Apple",
    domains: ["apple.com", "icloud.com"],
    legitimateESPs: ["Apple Internal"],
    knownSendingDomains: ["apple.com", "email.apple.com", "id.apple.com", "insideicloud.icloud.com"],
    headerPatterns: {
      "x-apple-action": ".*",
      "return-path": ".*@.*apple\\.com"
    },
    transactionalEmailTypes: ["purchase_receipt", "subscription_renewal", "account_alert", "device_login", "password_reset"]
  },
  {
    brand: "Netflix",
    domains: ["netflix.com"],
    legitimateESPs: ["Netflix Internal"],
    knownSendingDomains: ["netflix.com", "mailer.netflix.com"],
    headerPatterns: {
      "return-path": ".*@.*netflix\\.com"
    },
    transactionalEmailTypes: ["billing_update", "password_reset", "profile_alert", "new_login", "plan_change"]
  },
  {
    brand: "Google",
    domains: ["google.com", "gmail.com", "youtube.com"],
    legitimateESPs: ["Google Internal"],
    knownSendingDomains: ["google.com", "accounts.google.com", "notifications.google.com"],
    headerPatterns: {
      "x-google-smtp-source": ".*",
      "return-path": ".*@.*google\\.com"
    },
    transactionalEmailTypes: ["security_alert", "sign_in_activity", "password_reset", "recovery_email", "storage_alert"]
  },
  {
    brand: "USPS",
    domains: ["usps.com"],
    legitimateESPs: ["USPS Internal"],
    knownSendingDomains: ["usps.com", "email.usps.com", "informeddelivery.usps.com"],
    headerPatterns: {
      "return-path": ".*@.*usps\\.com"
    },
    transactionalEmailTypes: ["tracking_update", "informed_delivery", "delivery_notification"]
  },
  {
    brand: "UPS",
    domains: ["ups.com"],
    legitimateESPs: ["UPS Internal"],
    knownSendingDomains: ["ups.com", "ups-email.com"],
    headerPatterns: {
      "return-path": ".*@.*ups\\.com"
    },
    transactionalEmailTypes: ["tracking_update", "delivery_notification", "exception_alert"]
  },
  {
    brand: "FedEx",
    domains: ["fedex.com"],
    legitimateESPs: ["FedEx Internal"],
    knownSendingDomains: ["fedex.com", "tracking.fedex.com"],
    headerPatterns: {
      "return-path": ".*@.*fedex\\.com"
    },
    transactionalEmailTypes: ["tracking_update", "delivery_notification", "customs_alert"]
  },
  {
    brand: "Venmo",
    domains: ["venmo.com"],
    legitimateESPs: ["PayPal Internal"],
    knownSendingDomains: ["venmo.com", "email.venmo.com"],
    headerPatterns: {
      "return-path": ".*@.*venmo\\.com"
    },
    transactionalEmailTypes: ["payment_received", "payment_sent", "money_request", "security_alert"]
  },
  {
    brand: "Zelle",
    domains: ["zellepay.com"],
    legitimateESPs: ["Early Warning Services"],
    knownSendingDomains: ["zellepay.com", "email.zellepay.com"],
    headerPatterns: {
      "return-path": ".*@.*zellepay\\.com"
    },
    transactionalEmailTypes: ["payment_received", "payment_sent", "enrollment", "security_alert"]
  },
  {
    brand: "CashApp",
    domains: ["cash.app", "squareup.com"],
    legitimateESPs: ["Block Internal"],
    knownSendingDomains: ["cash.app", "square.com", "squareup.com"],
    headerPatterns: {
      "return-path": ".*@.*(cash\\.app|square\\.com)"
    },
    transactionalEmailTypes: ["payment_received", "payment_sent", "bitcoin_purchase", "security_alert"]
  },
  {
    brand: "Norton",
    domains: ["norton.com", "nortonlifelock.com"],
    legitimateESPs: ["Gen Digital Internal"],
    knownSendingDomains: ["norton.com", "email.norton.com", "nortonlifelock.com"],
    headerPatterns: {
      "return-path": ".*@.*norton\\.com"
    },
    transactionalEmailTypes: ["subscription_renewal", "security_alert", "scan_report"]
  },
  {
    brand: "McAfee",
    domains: ["mcafee.com"],
    legitimateESPs: ["McAfee Internal"],
    knownSendingDomains: ["mcafee.com", "email.mcafee.com"],
    headerPatterns: {
      "return-path": ".*@.*mcafee\\.com"
    },
    transactionalEmailTypes: ["subscription_renewal", "security_alert", "scan_report"]
  },
  {
    brand: "Best Buy / Geek Squad",
    domains: ["bestbuy.com", "geeksquad.com"],
    legitimateESPs: ["Best Buy Internal"],
    knownSendingDomains: ["bestbuy.com", "emailinfo.bestbuy.com"],
    headerPatterns: {
      "return-path": ".*@.*bestbuy\\.com"
    },
    transactionalEmailTypes: ["order_confirmation", "geek_squad_renewal", "shipping_notification"]
  },
  {
    brand: "Wells Fargo",
    domains: ["wellsfargo.com"],
    legitimateESPs: ["Wells Fargo Internal"],
    knownSendingDomains: ["wellsfargo.com", "notify.wellsfargo.com"],
    headerPatterns: {
      "return-path": ".*@.*wellsfargo\\.com"
    },
    transactionalEmailTypes: ["transaction_alert", "security_alert", "statement_ready"]
  },
  {
    brand: "Capital One",
    domains: ["capitalone.com"],
    legitimateESPs: ["Capital One Internal"],
    knownSendingDomains: ["capitalone.com", "email.capitalone.com"],
    headerPatterns: {
      "return-path": ".*@.*capitalone\\.com"
    },
    transactionalEmailTypes: ["transaction_alert", "security_alert", "payment_due", "credit_score_update"]
  }
];

export function matchCampaignPlaybook(content: string, senderDomain?: string): { playbook: CampaignPlaybook; matchedStep: number; confidence: number } | null {
  const lowerContent = content.toLowerCase();
  let bestMatch: { playbook: CampaignPlaybook; matchedStep: number; confidence: number } | null = null;

  for (const playbook of CAMPAIGN_PLAYBOOKS) {
    const brandMatch = senderDomain
      ? playbook.targetBrands.some(b => senderDomain.includes(b))
      : playbook.targetBrands.some(b => lowerContent.includes(b));

    if (!brandMatch) {
      const genericMatch = playbook.steps.some(step =>
        step.contentIndicators.filter(ind => lowerContent.includes(ind)).length >= 2
      );
      if (!genericMatch) continue;
    }

    for (const step of playbook.steps) {
      const subjectMatches = step.emailSubjectPatterns.filter(p => lowerContent.includes(p)).length;
      const contentMatches = step.contentIndicators.filter(ind => lowerContent.includes(ind)).length;
      const totalIndicators = step.emailSubjectPatterns.length + step.contentIndicators.length;
      const matchScore = (subjectMatches + contentMatches) / totalIndicators;

      if (matchScore >= 0.2 && (subjectMatches >= 1 || contentMatches >= 2)) {
        const confidence = Math.min(95, Math.round(matchScore * 100 + (brandMatch ? 20 : 0)));
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = { playbook, matchedStep: step.order, confidence };
        }
      }
    }
  }

  return bestMatch;
}

function isDomainMatch(hostDomain: string, trustedDomain: string): boolean {
  return hostDomain === trustedDomain || hostDomain.endsWith("." + trustedDomain);
}

export function identifyBrand(content: string, senderDomain?: string): BrandInfrastructure | null {
  const lowerContent = content.toLowerCase();
  const lowerDomain = senderDomain?.toLowerCase();

  for (const brand of BRAND_INFRASTRUCTURE) {
    if (lowerDomain && brand.knownSendingDomains.some(d => isDomainMatch(lowerDomain, d))) {
      return brand;
    }
    if (lowerDomain && brand.domains.some(d => isDomainMatch(lowerDomain, d))) {
      return brand;
    }
    if (brand.domains.some(d => lowerContent.includes(d)) ||
        lowerContent.includes(brand.brand.toLowerCase())) {
      return brand;
    }
  }
  return null;
}

export function checkSendingInfrastructure(headers: string, brand: BrandInfrastructure): {
  isLegitimate: boolean;
  confidence: number;
  findings: string[];
} {
  const findings: string[] = [];
  let legitimateSignals = 0;
  let suspiciousSignals = 0;

  const returnPathMatch = headers.match(/^return-path:\s*<?([^>\s]+)>?/mi);
  const returnPathDomain = returnPathMatch ? returnPathMatch[1].split("@")[1]?.toLowerCase() : null;

  if (returnPathDomain) {
    const isKnownSender = brand.knownSendingDomains.some(d => isDomainMatch(returnPathDomain, d));
    if (isKnownSender) {
      legitimateSignals++;
      findings.push(`Email sent from a known ${brand.brand} email address`);
    } else {
      suspiciousSignals++;
      findings.push(`Email claims to be from ${brand.brand} but sent from ${returnPathDomain} which is not a recognized ${brand.brand} sending address`);
    }
  }

  for (const [headerName, pattern] of Object.entries(brand.headerPatterns)) {
    const headerRegex = new RegExp(`^${headerName}:\\s*(.+)$`, "mi");
    const match = headers.match(headerRegex);
    if (match) {
      const valueRegex = new RegExp(pattern, "i");
      if (valueRegex.test(match[1])) {
        legitimateSignals++;
      }
    }
  }

  const isLegitimate = legitimateSignals > suspiciousSignals && legitimateSignals > 0;
  const confidence = Math.min(95, Math.round((legitimateSignals / (legitimateSignals + suspiciousSignals + 1)) * 100));

  return { isLegitimate, confidence, findings };
}

export function analyzeWithContext(
  content: string,
  context: ContextAnswer,
  brand: BrandInfrastructure | null
): {
  riskModifier: number;
  isAccountWeaponization: boolean;
  isLegitimateServiceAbuse: boolean;
  insights: string[];
  responseProtocol: string[];
} {
  const insights: string[] = [];
  const responseProtocol: string[] = [];
  let riskModifier = 0;
  let isAccountWeaponization = false;
  let isLegitimateServiceAbuse = false;
  const lowerContent = content.toLowerCase();

  const isTransactional = /order|purchase|account|invoice|payment|subscription|receipt|confirmation/i.test(content);
  const isSecurityAlert = /security|suspicious|unauthorized|verify|locked|compromised/i.test(content);

  if (context.didInitiate === false && isTransactional) {
    riskModifier += 40;
    isAccountWeaponization = true;
    insights.push("You confirmed you did NOT initiate this action. This is a strong indicator of an account weaponization attack where someone created an account or made a transaction using your email to create a sense of urgency.");

    if (brand) {
      responseProtocol.push(
        `Go directly to ${brand.domains[0]} by typing it in your browser — do NOT click any links in this email`,
        `Check if an account exists with your email address`,
        `If an unauthorized account exists, take control of it and change the password immediately`,
        `Enable two-factor authentication`,
        `Monitor your bank statements for any unauthorized charges`
      );
      isLegitimateServiceAbuse = true;
      insights.push(`This may be a legitimate ${brand.brand} email triggered by an attacker who created an account using your email. The email itself may be real, but the situation is not.`);
    }
  }

  if (context.hasAccount === false && isTransactional) {
    riskModifier += 30;
    insights.push("You confirmed you do NOT have an account with this service. Receiving account-related emails for a service you don't use is a classic sign of account weaponization or phishing.");
    if (!isAccountWeaponization) {
      isAccountWeaponization = true;
    }
  }

  if (context.expectingEmail === false) {
    riskModifier += 15;
    insights.push("You were NOT expecting this email. Unsolicited transactional emails deserve extra scrutiny.");
  }

  if (context.madeRecentPurchase === false && /order|purchase|buy|bought|receipt|confirmation/i.test(content)) {
    riskModifier += 35;
    insights.push("You confirmed you did NOT make any recent purchases, but received a purchase confirmation. This is a strong indicator of a scam.");
  }

  if (context.recognizeSender === false) {
    riskModifier += 10;
    insights.push("You do not recognize the sender of this communication.");
  }

  if (isAccountWeaponization && isSecurityAlert) {
    riskModifier += 20;
    insights.push("CRITICAL: This combines account weaponization with a security alert — a highly sophisticated attack designed to make you act urgently on an account you didn't create.");
  }

  if (riskModifier === 0 && context.didInitiate === true && context.hasAccount === true) {
    riskModifier -= 20;
    insights.push("You confirmed this relates to an action you took on an account you own. This reduces the likelihood of a scam, but always verify through official channels.");
  }

  if (isAccountWeaponization && responseProtocol.length === 0) {
    responseProtocol.push(
      "Do NOT click any links in this email",
      "Do NOT call any phone numbers listed in this email",
      "Go directly to the company's website by typing the URL in your browser",
      "Check if an account was created with your email without your knowledge",
      "If an unauthorized account exists, secure it or request deletion",
      "Report the incident to the company's abuse/security team",
      "Report to the FTC at reportfraud.ftc.gov",
      "Monitor your email for follow-up phishing attempts"
    );
  }

  return { riskModifier, isAccountWeaponization, isLegitimateServiceAbuse, insights, responseProtocol };
}

export async function correlateScans(userId: string, currentContent: string, currentBrand: string | null): Promise<CampaignCorrelation> {
  const result: CampaignCorrelation = {
    isPartOfCampaign: false,
    relatedScans: [],
    urgencyLevel: "none",
    timelineInsight: "No previous scans found to correlate."
  };

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentScans = await db.select()
      .from(scanHistory)
      .where(and(
        eq(scanHistory.userId, userId),
        gte(scanHistory.createdAt, sevenDaysAgo)
      ))
      .orderBy(desc(scanHistory.createdAt))
      .limit(20);

    if (recentScans.length === 0) {
      result.timelineInsight = "This is your first scan in the past 7 days. We'll track future scans to detect multi-step attack campaigns.";
      return result;
    }

    const lowerContent = currentContent.toLowerCase();
    const relatedScans: CampaignCorrelation["relatedScans"] = [];

    for (const scan of recentScans) {
      const snippet = (scan.contentSnippet || "").toLowerCase();
      let matchReason = "";

      if (currentBrand) {
        const brandLower = currentBrand.toLowerCase();
        if (snippet.includes(brandLower)) {
          matchReason = `Both scans involve ${currentBrand}`;
        }
      }

      const currentDomains = lowerContent.match(/[\w.-]+\.[a-z]{2,}/g) || [];
      const scanDomains = snippet.match(/[\w.-]+\.[a-z]{2,}/g) || [];
      const sharedDomains = currentDomains.filter(d => scanDomains.includes(d));
      if (sharedDomains.length > 0 && !matchReason) {
        matchReason = `Both scans reference ${sharedDomains[0]}`;
      }

      const currentKeywords = extractKeySignals(lowerContent);
      const scanKeywords = extractKeySignals(snippet);
      const sharedKeywords = currentKeywords.filter(k => scanKeywords.includes(k));
      if (sharedKeywords.length >= 2 && !matchReason) {
        matchReason = `Similar themes: ${sharedKeywords.slice(0, 3).join(", ")}`;
      }

      if (matchReason) {
        relatedScans.push({
          id: scan.id?.toString() || "",
          contentSnippet: scan.contentSnippet || "",
          riskLevel: scan.riskLevel || "unknown",
          scannedAt: scan.createdAt?.toISOString() || "",
          matchReason
        });
      }
    }

    result.relatedScans = relatedScans;

    if (relatedScans.length >= 2) {
      result.isPartOfCampaign = true;
      result.urgencyLevel = "warning";
      result.timelineInsight = `We found ${relatedScans.length} related scans in the past 7 days. This pattern suggests a multi-step attack campaign targeting you. Each message builds on the previous one to create urgency and trick you into acting.`;

      const playbookMatch = matchCampaignPlaybook(currentContent, currentBrand || undefined);
      if (playbookMatch) {
        result.matchedPlaybook = playbookMatch.playbook;
        result.currentStep = playbookMatch.matchedStep;
        result.totalSteps = playbookMatch.playbook.steps.length;
        const nextStep = playbookMatch.playbook.steps.find(s => s.order === playbookMatch.matchedStep);
        result.nextStepPrediction = nextStep?.nextStepWarning;
        result.urgencyLevel = "critical";
        result.timelineInsight = `CAMPAIGN DETECTED: This appears to be step ${playbookMatch.matchedStep} of ${playbookMatch.playbook.steps.length} in a "${playbookMatch.playbook.name}" attack. ${nextStep?.nextStepWarning || ""}`;
      }
    } else if (relatedScans.length === 1) {
      result.urgencyLevel = "monitor";
      result.timelineInsight = `We found 1 related scan from the past 7 days. We're monitoring for campaign patterns. If you receive another similar message, scan it immediately.`;
    }

    return result;
  } catch (error) {
    log.error("Campaign correlation error", { error: String(error) });
    return result;
  }
}

function extractKeySignals(text: string): string[] {
  const signals: string[] = [];
  const keywords = [
    "account", "order", "purchase", "invoice", "payment", "subscription",
    "verify", "confirm", "cancel", "dispute", "refund", "security",
    "alert", "suspicious", "unauthorized", "password", "locked",
    "delivery", "tracking", "shipped", "customs"
  ];
  for (const kw of keywords) {
    if (text.includes(kw)) signals.push(kw);
  }
  return signals;
}

export function buildVisualAnalysisPrompt(brandDetected: string | null): string {
  const brandContext = brandDetected
    ? `The image appears to contain content from ${brandDetected}. Pay special attention to:
- Logo quality and placement (pixelated or slightly off logos are red flags)
- Color scheme accuracy (does it match the real ${brandDetected} brand colors?)
- Footer content (legitimate emails always have unsubscribe links, privacy policy, and physical address)
- Font consistency (mixing of different fonts is suspicious)
- Layout quality (misaligned elements, inconsistent spacing)
- Template version (outdated email templates that don't match current brand design)`
    : "Analyze the screenshot for signs that it may be a phishing or scam email/website.";

  return `You are an expert visual forensic analyst specializing in brand impersonation detection. Analyze this screenshot of a suspected phishing email or website.

${brandContext}

ANALYZE THE FOLLOWING VISUAL ELEMENTS:
1. **Brand Consistency**: Logo accuracy, color scheme, typography, layout quality
2. **Template Legitimacy**: Does this match known legitimate email templates from this company?
3. **Red Flags**: Urgency banners, unusual CTAs, mismatched styling, generic greetings
4. **Footer Analysis**: Presence of legal disclaimers, unsubscribe links, physical address
5. **Link Appearance**: Do displayed URLs match the expected domain? Any suspicious link text?
6. **Content Quality**: Grammar, spelling, tone consistency with legitimate brand communications
7. **Social Engineering Cues**: Urgency indicators, fear-based messaging, unusual requests

RESPOND IN THIS EXACT JSON FORMAT:
{
  "brandDetected": "Brand name or null",
  "templateMatch": "legitimate" | "suspicious" | "counterfeit" | "unknown",
  "brandConsistencyScore": 0-100,
  "visualRedFlags": ["List of specific visual inconsistencies found"],
  "contentRedFlags": ["List of content/text red flags visible in the image"],
  "legitimateIndicators": ["List of elements that appear authentic"],
  "overallAssessment": "Plain language summary of the visual analysis",
  "recommendations": ["Specific actions the user should take"]
}

CRITICAL RULES:
- ONLY report what you can actually SEE in the image
- Do NOT invent or assume details not visible
- If the image quality prevents analysis of certain elements, say so
- Be specific about what looks wrong (e.g., "the logo appears pixelated and slightly larger than standard" not just "logo looks off")`;
}

export function generatePhantomAccountProtocol(brand: BrandInfrastructure | null, context: ContextAnswer): string[] {
  const protocol: string[] = [];

  if (context.hasAccount === false || context.didInitiate === false) {
    protocol.push("PHANTOM ACCOUNT DETECTED: Someone may have created an account using your email address without your knowledge.");

    if (brand) {
      protocol.push(
        `Step 1: Go directly to ${brand.domains[0]} — type it in your browser, do NOT use any links from the email`,
        `Step 2: Try to log in or use 'Forgot Password' to see if an account exists with your email`,
        `Step 3: If an account exists that you didn't create, take control of it immediately:`,
        `  - Reset the password to something only you know`,
        `  - Enable two-factor authentication (2FA)`,
        `  - Check for any orders, purchases, or connected payment methods`,
        `  - Remove any payment methods or personal information`,
        `  - Contact ${brand.brand} support to report the unauthorized account`,
        `Step 4: Check HaveIBeenPwned.com to see if your email has been exposed in data breaches`,
        `Step 5: Monitor your inbox for the next 2 weeks for follow-up phishing attempts`
      );
    } else {
      protocol.push(
        "Step 1: Go directly to the company's website by typing the URL — NEVER click links in the email",
        "Step 2: Check if an account was created with your email using 'Forgot Password'",
        "Step 3: If found, secure the account (change password, enable 2FA, remove payment info)",
        "Step 4: Contact the company's support team to report the unauthorized account",
        "Step 5: Monitor your email and bank statements for follow-up scam attempts"
      );
    }

    protocol.push(
      "",
      "WHY THIS MATTERS: Attackers create real accounts on legitimate platforms using your email. This triggers genuine emails from the real company, making the attack look legitimate. The goal is to get you to click a 'cancel' or 'dispute' link in a follow-up email that leads to a credential harvesting page."
    );
  }

  return protocol;
}

export function buildContextEnhancedPrompt(
  baseContent: string,
  context: ContextAnswer,
  playbookMatch: { playbook: CampaignPlaybook; matchedStep: number; confidence: number } | null,
  brandInfo: BrandInfrastructure | null,
  campaignCorrelation: CampaignCorrelation | null
): string {
  let contextSection = "";

  if (context.didInitiate !== null || context.hasAccount !== null || context.expectingEmail !== null) {
    contextSection += "\n\nUSER CONTEXT (the person who received this provided these answers):\n";
    if (context.didInitiate !== null) contextSection += `- Did they initiate this action? ${context.didInitiate ? "YES" : "NO"}\n`;
    if (context.hasAccount !== null) contextSection += `- Do they have an account with this service? ${context.hasAccount ? "YES" : "NO"}\n`;
    if (context.expectingEmail !== null) contextSection += `- Were they expecting this email? ${context.expectingEmail ? "YES" : "NO"}\n`;
    if (context.madeRecentPurchase !== null) contextSection += `- Did they make a recent purchase? ${context.madeRecentPurchase ? "YES" : "NO"}\n`;
    if (context.recognizeSender !== null) contextSection += `- Do they recognize the sender? ${context.recognizeSender ? "YES" : "NO"}\n`;
    if (context.additionalContext) contextSection += `- Additional context: ${context.additionalContext}\n`;

    contextSection += `\nCRITICAL: Factor the user's answers into your risk assessment. If someone receives a purchase confirmation for a purchase they never made, or an account notification for an account they don't have, this dramatically increases the scam risk — even if the email passes all technical checks. This is called "Account Weaponization" or "Legitimate Service Abuse" where attackers trigger real emails from real companies.`;
  }

  let playbookSection = "";
  if (playbookMatch) {
    const pb = playbookMatch.playbook;
    const currentStep = pb.steps.find(s => s.order === playbookMatch.matchedStep);
    const nextStep = pb.steps.find(s => s.order === playbookMatch.matchedStep + 1);

    playbookSection += `\n\nCAMPAIGN INTELLIGENCE MATCH:
This content matches step ${playbookMatch.matchedStep} of ${pb.steps.length} in a known attack campaign: "${pb.name}"
Campaign description: ${pb.description}
Current step: ${currentStep?.description || "Unknown"}
${nextStep ? `PREDICTED NEXT STEP: ${nextStep.description} — ${currentStep?.nextStepWarning || ""}` : "This appears to be the final step of the attack."}
Confidence: ${playbookMatch.confidence}%
Campaign prevalence: ${pb.prevalence}
Sophistication level: ${pb.sophistication}

You MUST incorporate this campaign intelligence into your analysis. Warn the user about what's coming next in the attack sequence.`;
  }

  let campaignSection = "";
  if (campaignCorrelation?.isPartOfCampaign) {
    campaignSection += `\n\nMULTI-SCAN CAMPAIGN CORRELATION:
This user has ${campaignCorrelation.relatedScans.length} related previous scans in the past 7 days:
${campaignCorrelation.relatedScans.map(s => `- "${s.contentSnippet}" (${s.riskLevel}) — ${s.matchReason}`).join("\n")}
Timeline insight: ${campaignCorrelation.timelineInsight}

This is likely a coordinated multi-step attack. Factor this into your risk assessment and warn the user.`;
  }

  let brandSection = "";
  if (brandInfo) {
    brandSection += `\n\nBRAND INTELLIGENCE:
Detected brand: ${brandInfo.brand}
Known legitimate sending domains: ${brandInfo.knownSendingDomains.join(", ")}
Known email types: ${brandInfo.transactionalEmailTypes.join(", ")}

If the email passes technical checks but the user didn't initiate the action, this may be a "Legitimate Service Abuse" attack where the attacker uses ${brandInfo.brand}'s own systems to send real emails as part of a scam campaign.`;
  }

  return `${baseContent}${contextSection}${playbookSection}${campaignSection}${brandSection}`;
}

export { CAMPAIGN_PLAYBOOKS, BRAND_INFRASTRUCTURE };
