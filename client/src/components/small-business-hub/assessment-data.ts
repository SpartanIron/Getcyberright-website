export type RegionCode = "US" | "UK" | "Canada" | "Australia" | "Africa";

export interface AssessmentItem {
  id: string;
  domain: string;
  question: string;
  weight: number;
}

export interface PhishingScenario {
  id: string;
  region: RegionCode;
  type: "invoice-fraud" | "ceo-impersonation" | "vendor-payment" | "it-reset" | "payroll-redirect" | "shipping" | "tax-scam" | "mobile-money" | "renewal-scam" | "procurement";
  title: string;
  sender: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  redFlags: string[];
  explanation: string;
}

export interface PolicySection {
  title: string;
  description: string;
  sampleLanguage: string;
}

export interface PolicyQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  questions: PolicyQuestion[];
  sections: PolicySection[];
}

export interface IncidentStep {
  id: string;
  title: string;
  description: string;
  options: { label: string; nextId: string | null; actions?: string[] }[];
}

export interface IncidentType {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  steps: IncidentStep[];
  reportingContacts: { region: RegionCode; contacts: { name: string; url: string; phone?: string }[] }[];
}

export interface SecurityTool {
  id: string;
  category: string;
  name: string;
  description: string;
  priceSmall: string;
  priceMedium: string;
  priceLarge: string;
  roiPoint: string;
  priority: "essential" | "recommended" | "nice-to-have";
}

export const assessmentDomains = [
  "Access Control",
  "Email Security",
  "Data Protection",
  "Network Security",
  "Employee Training",
  "Vendor Management"
] as const;

export type DomainName = typeof assessmentDomains[number];

export const assessmentItems: AssessmentItem[] = [
  { id: "ac-1", domain: "Access Control", question: "All employees use unique login credentials (no shared accounts)", weight: 3 },
  { id: "ac-2", domain: "Access Control", question: "Multi-factor authentication is enabled on all critical systems", weight: 3 },
  { id: "ac-3", domain: "Access Control", question: "A password manager is deployed for the team", weight: 2 },
  { id: "ac-4", domain: "Access Control", question: "Employee access is revoked within 24 hours of departure", weight: 3 },
  { id: "ac-5", domain: "Access Control", question: "Access rights are reviewed at least quarterly", weight: 2 },
  { id: "ac-6", domain: "Access Control", question: "Admin privileges are limited to those who need them", weight: 3 },
  { id: "ac-7", domain: "Access Control", question: "Remote access requires VPN or zero-trust network access", weight: 2 },
  { id: "ac-8", domain: "Access Control", question: "Failed login attempts trigger account lockout after 5 tries", weight: 2 },

  { id: "es-1", domain: "Email Security", question: "Email accounts have multi-factor authentication enabled", weight: 3 },
  { id: "es-2", domain: "Email Security", question: "DMARC, DKIM, and SPF records are configured for your domain", weight: 2 },
  { id: "es-3", domain: "Email Security", question: "External email warnings are displayed to users", weight: 2 },
  { id: "es-4", domain: "Email Security", question: "Anti-phishing and spam filtering is enabled", weight: 3 },
  { id: "es-5", domain: "Email Security", question: "Wire transfer requests require verbal verification via a separate channel", weight: 3 },
  { id: "es-6", domain: "Email Security", question: "Employees know how to report suspicious emails", weight: 2 },
  { id: "es-7", domain: "Email Security", question: "Email archiving and retention policies are in place", weight: 1 },
  { id: "es-8", domain: "Email Security", question: "Auto-forwarding rules are restricted or monitored", weight: 2 },

  { id: "dp-1", domain: "Data Protection", question: "Critical data is backed up following the 3-2-1 rule", weight: 3 },
  { id: "dp-2", domain: "Data Protection", question: "Backup restoration is tested at least quarterly", weight: 3 },
  { id: "dp-3", domain: "Data Protection", question: "Sensitive data is encrypted at rest and in transit", weight: 3 },
  { id: "dp-4", domain: "Data Protection", question: "A data classification policy exists (public, internal, confidential)", weight: 2 },
  { id: "dp-5", domain: "Data Protection", question: "Customer data handling complies with relevant regulations (GDPR, CCPA, POPIA)", weight: 2 },
  { id: "dp-6", domain: "Data Protection", question: "Portable storage devices (USB drives) are restricted or encrypted", weight: 2 },
  { id: "dp-7", domain: "Data Protection", question: "Data retention and disposal policies are documented", weight: 1 },
  { id: "dp-8", domain: "Data Protection", question: "Cloud storage access is controlled and audited", weight: 2 },

  { id: "ns-1", domain: "Network Security", question: "Firewall is configured and actively managed", weight: 3 },
  { id: "ns-2", domain: "Network Security", question: "Wi-Fi uses WPA3 or WPA2 with a strong password", weight: 2 },
  { id: "ns-3", domain: "Network Security", question: "Guest Wi-Fi is separated from the business network", weight: 2 },
  { id: "ns-4", domain: "Network Security", question: "All devices have up-to-date endpoint protection (antivirus/EDR)", weight: 3 },
  { id: "ns-5", domain: "Network Security", question: "Operating systems and software are patched within 30 days of updates", weight: 3 },
  { id: "ns-6", domain: "Network Security", question: "Network traffic is monitored for unusual activity", weight: 2 },
  { id: "ns-7", domain: "Network Security", question: "IoT devices are on a separate network segment", weight: 1 },
  { id: "ns-8", domain: "Network Security", question: "DNS filtering blocks known malicious domains", weight: 2 },

  { id: "et-1", domain: "Employee Training", question: "Security awareness training is conducted at least annually", weight: 3 },
  { id: "et-2", domain: "Employee Training", question: "New employees receive security training during onboarding", weight: 2 },
  { id: "et-3", domain: "Employee Training", question: "Simulated phishing tests are run at least quarterly", weight: 2 },
  { id: "et-4", domain: "Employee Training", question: "Employees know the process for reporting security incidents", weight: 3 },
  { id: "et-5", domain: "Employee Training", question: "Training covers social engineering, not just technical threats", weight: 2 },
  { id: "et-6", domain: "Employee Training", question: "Role-specific training is provided for high-risk roles (finance, HR, IT)", weight: 2 },
  { id: "et-7", domain: "Employee Training", question: "Security policies are documented and accessible to all employees", weight: 2 },
  { id: "et-8", domain: "Employee Training", question: "Employees who report suspicious activity are recognized or rewarded", weight: 1 },

  { id: "vm-1", domain: "Vendor Management", question: "A list of all vendors with system or data access is maintained", weight: 2 },
  { id: "vm-2", domain: "Vendor Management", question: "Vendor contracts include security requirements and breach notification terms", weight: 3 },
  { id: "vm-3", domain: "Vendor Management", question: "Vendor access is limited to the minimum necessary (least privilege)", weight: 3 },
  { id: "vm-4", domain: "Vendor Management", question: "Critical vendors' security certifications (SOC 2, ISO 27001) are reviewed", weight: 2 },
  { id: "vm-5", domain: "Vendor Management", question: "Vendor access is reviewed and revoked when contracts end", weight: 3 },
  { id: "vm-6", domain: "Vendor Management", question: "Contingency plans exist for critical vendor failures", weight: 2 },
  { id: "vm-7", domain: "Vendor Management", question: "Vendors are required to notify you of security incidents affecting your data", weight: 2 },
  { id: "vm-8", domain: "Vendor Management", question: "Due diligence is performed before onboarding new vendors", weight: 2 }
];

export const phishingScenarios: PhishingScenario[] = [
  {
    id: "us-inv-1",
    region: "US",
    type: "invoice-fraud",
    title: "Overdue Invoice Payment Request",
    sender: "accounting@quick-books-invoice.com",
    subject: "URGENT: Invoice #INV-2024-8847 Past Due. Immediate Payment Required",
    body: "Dear Accounts Payable,\n\nThis is a final notice regarding Invoice #INV-2024-8847 for $12,450.00, which is now 45 days past due. To avoid service interruption and late fees, please process payment immediately via wire transfer to our updated banking details below.\n\nNew Bank: First National Trust\nRouting: 071923456\nAccount: 8834201957\n\nPlease confirm payment within 24 hours.\n\nRegards,\nSarah Mitchell\nAccounts Receivable Manager",
    isPhishing: true,
    redFlags: [
      "Domain 'quick-books-invoice.com' mimics QuickBooks but is not legitimate",
      "Requesting wire transfer to 'updated banking details' is a classic BEC tactic",
      "Creating urgency with 'final notice' and 'service interruption'",
      "No reference to a specific product or service you use",
      "Wire transfers are nearly impossible to reverse"
    ],
    explanation: "This is a business email compromise (BEC) attack. Scammers send fake invoices hoping accounts payable will process payment without verifying. Always verify payment changes by calling the vendor at a known phone number."
  },
  {
    id: "us-ceo-1",
    region: "US",
    type: "ceo-impersonation",
    title: "CEO Urgent Wire Transfer Request",
    sender: "ceo.johnson@company-mail.net",
    subject: "Confidential. Need Your Help Urgently",
    body: "Hi,\n\nI need you to process a wire transfer of $28,500 to a new vendor today. This is for a confidential acquisition we're working on, so please don't discuss this with anyone else on the team.\n\nI'm in meetings all day and can't take calls. Please handle this ASAP and send me confirmation when done.\n\nThanks,\nMichael Johnson\nCEO\n\nSent from my iPhone",
    isPhishing: true,
    redFlags: [
      "Email domain 'company-mail.net' does not match your company's actual domain",
      "Requesting secrecy ('don't discuss with anyone') is a manipulation tactic",
      "Unable to take calls conveniently avoids verbal verification",
      "Urgency pressure ('ASAP', 'today')",
      "'Sent from my iPhone' is added to excuse informal tone and domain mismatch"
    ],
    explanation: "CEO impersonation (whaling) attacks exploit authority and urgency. Always verify unusual financial requests through a separate communication channel, regardless of who appears to be asking."
  },
  {
    id: "us-vendor-1",
    region: "US",
    type: "vendor-payment",
    title: "Vendor Banking Details Update",
    sender: "ar@office-supply-direct.com",
    subject: "Updated Banking Information for Future Payments",
    body: "Dear Valued Customer,\n\nWe are writing to inform you that our company has changed banking institutions. Effective immediately, all future payments should be directed to our new account:\n\nBank: Chase Commercial Banking\nRouting Number: 021000021\nAccount Number: 7742195830\n\nPlease update your records accordingly. Payments sent to our old account after March 1st will not be processed.\n\nBest regards,\nDavid Thompson\nAccounts Receivable\nOffice Supply Direct",
    isPhishing: true,
    redFlags: [
      "Bank change notifications via email should always be verified by phone",
      "Domain may not match the legitimate vendor's known domain",
      "No prior communication about the banking change",
      "Deadline pressure ('after March 1st will not be processed')",
      "This is one of the most successful B2B fraud methods globally"
    ],
    explanation: "Vendor payment redirect fraud causes billions in losses annually. Whenever a vendor requests a change in banking information, always call them at a previously known phone number to verify before updating any payment details."
  },
  {
    id: "us-it-1",
    region: "US",
    type: "it-reset",
    title: "IT Department Password Reset Required",
    sender: "it-security@your-company-helpdesk.com",
    subject: "Mandatory Password Reset. Security Update Required",
    body: "Dear Employee,\n\nOur security team has detected a potential breach in our authentication system. As a precautionary measure, all employees must reset their passwords within the next 2 hours.\n\nClick the secure link below to reset your password:\n[Reset Password Now]\n\nFailure to comply will result in your account being temporarily suspended.\n\nIT Security Team\nHelpDesk Ticket #HD-29847",
    isPhishing: true,
    redFlags: [
      "Domain 'your-company-helpdesk.com' is not your company's real IT domain",
      "2-hour deadline creates panic and prevents careful thinking",
      "Threatening account suspension for non-compliance",
      "Generic 'Dear Employee' instead of your name",
      "Legitimate IT departments direct you to internal portals, not email links"
    ],
    explanation: "Phishing emails disguised as IT communications are extremely common. Your real IT department would use your company's actual domain and direct you to internal systems, not external links."
  },
  {
    id: "us-payroll-1",
    region: "US",
    type: "payroll-redirect",
    title: "Direct Deposit Update Request",
    sender: "hr-admin@payroll-services-update.com",
    subject: "Action Required: Update Your Direct Deposit Information",
    body: "Dear Team Member,\n\nWe are upgrading our payroll system and need all employees to verify their direct deposit information. Please click the link below to confirm or update your banking details by end of business today.\n\n[Verify Direct Deposit]\n\nIf your information is not verified, your next paycheck may be delayed.\n\nHR & Payroll Team",
    isPhishing: true,
    redFlags: [
      "External domain 'payroll-services-update.com' is not your company's HR system",
      "Legitimate payroll changes are done through your company's internal HR portal",
      "Threatening paycheck delay creates urgency",
      "Generic greeting instead of your name",
      "HR would never collect banking details through an email link"
    ],
    explanation: "Payroll redirect scams capture employees' banking details. Real HR departments use internal payroll systems (like ADP, Gusto, or Workday) and never request banking details via email links."
  },
  {
    id: "us-ship-1",
    region: "US",
    type: "shipping",
    title: "UPS Delivery Exception Notification",
    sender: "delivery-notice@ups-tracking-update.com",
    subject: "Package Delivery Failed. Action Required",
    body: "UPS Notification\n\nTracking Number: 1Z999AA10123456784\n\nWe attempted to deliver your package but were unable to complete delivery. A customs fee of $4.99 is required before redelivery can be scheduled.\n\n[Pay Fee and Schedule Redelivery]\n\nIf no action is taken within 48 hours, the package will be returned to sender.\n\nUPS Customer Service",
    isPhishing: true,
    redFlags: [
      "Domain 'ups-tracking-update.com' is not the real ups.com",
      "UPS does not collect small customs fees via email",
      "The small dollar amount is designed to seem harmless but captures card details",
      "Real UPS notifications come from ups.com",
      "48-hour return threat creates urgency"
    ],
    explanation: "Shipping notification scams use small fees to capture credit card details. Always track packages directly on the carrier's official website (ups.com, usps.com, fedex.com)."
  },
  {
    id: "uk-inv-1",
    region: "UK",
    type: "invoice-fraud",
    title: "HMRC VAT Refund Processing",
    sender: "refunds@hmrc-vat-refund.co.uk",
    subject: "VAT Refund of £4,287.50 - Verify Bank Details",
    body: "Dear Business Owner,\n\nHMRC has calculated that your business is due a VAT refund of £4,287.50 for the current tax period. To process this refund, we need to verify your business bank account details.\n\nPlease complete the secure verification form:\n[Verify Bank Details]\n\nRefunds not claimed within 14 days will be forfeited.\n\nHM Revenue & Customs\nVAT Refund Department",
    isPhishing: true,
    redFlags: [
      "HMRC never sends refund notifications via email asking for bank details",
      "Domain 'hmrc-vat-refund.co.uk' is not the real gov.uk domain",
      "HMRC processes refunds through your Government Gateway account",
      "Threatening to forfeit the refund creates urgency",
      "HMRC already has your bank details if you've previously filed returns"
    ],
    explanation: "HMRC never contacts businesses by email to request bank details for refunds. All VAT refunds are processed through your Government Gateway account at gov.uk."
  },
  {
    id: "uk-ceo-1",
    region: "UK",
    type: "ceo-impersonation",
    title: "Managing Director Urgent Payment",
    sender: "md.williams@company-uk.net",
    subject: "Urgent. Payment Needed Before Close of Business",
    body: "Hi,\n\nI need a BACS payment of £18,750 processed to a new supplier before close of business today. The supplier reference is SUP-2024-445.\n\nI'm travelling and my phone signal is poor so email is best. Please process and confirm.\n\nRegards,\nJames Williams\nManaging Director",
    isPhishing: true,
    redFlags: [
      "Domain 'company-uk.net' likely does not match your company's real domain",
      "End-of-day urgency prevents verification",
      "Conveniently unable to take phone calls",
      "BACS payment to an unknown 'new supplier'",
      "No prior discussion about this supplier or payment"
    ],
    explanation: "UK-specific CEO fraud commonly requests BACS or Faster Payments. Always verify unusual payment requests by calling the requester at their known direct number."
  },
  {
    id: "uk-renewal-1",
    region: "UK",
    type: "renewal-scam",
    title: "Companies House Annual Filing Reminder",
    sender: "filing@companies-house-annual.co.uk",
    subject: "Annual Return Filing. Payment of £85 Required",
    body: "Dear Company Director,\n\nYour annual confirmation statement is due. A filing fee of £85 is required to maintain your company's active status on the register.\n\nFailing to file will result in your company being struck off and dissolved.\n\n[File and Pay Now]\n\nCompanies House\nCrown Way, Cardiff, CF14 3UZ",
    isPhishing: true,
    redFlags: [
      "The real Companies House website is companieshouse.gov.uk, not 'companies-house-annual.co.uk'",
      "The real filing fee is £13 online or £40 by post, not £85",
      "Companies House sends reminders to your registered office address",
      "Threat of dissolution creates panic",
      "The physical address is real but used to add legitimacy to the scam"
    ],
    explanation: "Companies House renewal scams are widespread in the UK. The real confirmation statement fee is £13 online. Always file directly at companieshouse.gov.uk."
  },
  {
    id: "uk-vendor-1",
    region: "UK",
    type: "vendor-payment",
    title: "Supplier Sort Code Change Notice",
    sender: "accounts@building-supplies-ltd.co.uk",
    subject: "Important: Updated Sort Code and Account Number",
    body: "Dear Customer,\n\nPlease note that our banking details have changed effective immediately. All future payments should be made to:\n\nSort Code: 20-45-78\nAccount Number: 43829105\nAccount Name: Building Supplies Ltd\n\nPlease update your standing orders and scheduled payments accordingly.\n\nBest regards,\nFinance Department\nBuilding Supplies Ltd",
    isPhishing: true,
    redFlags: [
      "Banking detail changes should always be verified by phone",
      "Email domain may not match the legitimate supplier's known domain",
      "'Effective immediately' prevents you from checking with the real supplier",
      "No invoice reference or account number to identify your specific relationship",
      "This is the UK's most reported business fraud type"
    ],
    explanation: "Payment diversion fraud is the most reported business fraud in the UK. Always call your supplier at a known number to verify any change in banking details before updating your payment records."
  },
  {
    id: "canada-inv-1",
    region: "Canada",
    type: "invoice-fraud",
    title: "CRA Business Tax Assessment Notice",
    sender: "assessment@cra-business-tax.ca",
    subject: "Notice of Assessment. Balance Due $8,950.00",
    body: "Canada Revenue Agency\n\nNotice of Assessment\n\nYour business has an outstanding balance of $8,950.00 CAD for the 2024 tax year. Interest charges of 5% will be applied after 30 days.\n\nTo avoid penalties, pay immediately through our secure portal:\n[Pay Now]\n\nAlternatively, you may pay using cryptocurrency or prepaid cards for faster processing.\n\nCanada Revenue Agency\nOttawa, ON K1A 0L5",
    isPhishing: true,
    redFlags: [
      "CRA never suggests payment by cryptocurrency or prepaid cards",
      "Domain 'cra-business-tax.ca' is not the real canada.ca",
      "CRA sends official notices through My Business Account or mail",
      "No specific business number or assessment reference",
      "Real CRA payments are made through My Business Account, bank, or post"
    ],
    explanation: "The CRA never requests payment via cryptocurrency or prepaid cards. Verify any tax notices by logging into My Business Account at canada.ca/my-cra-business-account."
  },
  {
    id: "canada-payroll-1",
    region: "Canada",
    type: "payroll-redirect",
    title: "Employee Direct Deposit Change via Email",
    sender: "employee.name@company-ca.com",
    subject: "Please Update My Direct Deposit",
    body: "Hi HR,\n\nI recently switched banks and need my direct deposit updated before the next pay run. Here are my new details:\n\nInstitution Number: 004\nTransit Number: 12345\nAccount Number: 7891234\n\nCan you update this right away? I don't want my pay going to the old account.\n\nThanks,\n[Employee Name]",
    isPhishing: true,
    redFlags: [
      "Direct deposit changes via email should always be verified in person or by phone",
      "The email domain may not match the employee's actual company email",
      "Urgency about the next pay run pressures you to act without verifying",
      "Scammers often use a compromised or spoofed email to impersonate real employees",
      "Direct deposit changes should go through your HR or payroll portal, not email"
    ],
    explanation: "Payroll diversion fraud targets HR departments. Always verify direct deposit change requests by contacting the employee directly at their known phone number or requiring them to submit changes through your secure HR portal."
  },
  {
    id: "canada-vendor-1",
    region: "Canada",
    type: "vendor-payment",
    title: "Legitimate Vendor Invoice",
    sender: "billing@known-vendor.ca",
    subject: "Invoice #INV-7891 - Due March 15",
    body: "Dear [Your Company Name],\n\nPlease find attached Invoice #INV-7891 for $2,450.00 CAD for IT support services provided in February 2025.\n\nPayment terms: Net 30\nPayable to our regular banking details on file.\n\nIf you have any questions, please contact me at (416) 555-7890.\n\nBest regards,\nTanya Chen\nBilling Manager\nKnown Vendor Inc.",
    isPhishing: false,
    redFlags: [],
    explanation: "This appears legitimate: it references a specific service you use, quotes the correct account details on file (not new ones), provides a direct phone number, and uses standard Net 30 terms. Always verify if anything seems different from your normal billing relationship."
  },
  {
    id: "au-inv-1",
    region: "Australia",
    type: "invoice-fraud",
    title: "ATO Business Activity Statement Alert",
    sender: "bas@ato-lodgement.com.au",
    subject: "BAS Lodgement Overdue. Penalty Notice",
    body: "Australian Taxation Office\n\nYour Business Activity Statement (BAS) for Q3 2024 is overdue. A penalty of $1,100 AUD has been applied. To avoid further penalties, lodge and pay immediately through our portal:\n\n[Lodge BAS Now]\n\nFailure to respond within 7 days will result in director penalty notices being issued.\n\nAustralian Taxation Office\nCanberra ACT 2601",
    isPhishing: true,
    redFlags: [
      "ATO domain is ato.gov.au, not 'ato-lodgement.com.au'",
      "ATO sends BAS notices through myGov or official mail",
      "Director penalty notice threat creates panic",
      "ATO would reference your specific ABN",
      "Lodge BAS through the official myGov portal or your tax agent"
    ],
    explanation: "The ATO never sends BAS lodgement requests via external websites. Always lodge your BAS through myGov, your tax agent, or approved accounting software."
  },
  {
    id: "au-ceo-1",
    region: "Australia",
    type: "ceo-impersonation",
    title: "Director Requesting Urgent EFT",
    sender: "director.smith@company-au.net",
    subject: "Need EFT Processed Today. Confidential",
    body: "Hi,\n\nCan you please process an urgent EFT of $34,200 AUD to the following BSB and account? This is for a settlement we're finalising privately.\n\nBSB: 062-000\nAccount: 1234 5678\n\nPlease keep this between us until the deal is announced. I'm in a board meeting and can't call.\n\nCheers,\nDavid Smith\nDirector",
    isPhishing: true,
    redFlags: [
      "Domain 'company-au.net' does not match your real company domain",
      "'Keep this between us' is a classic isolation tactic",
      "Conveniently unable to take a verification call",
      "BSB 062-000 is a CBA branch but could be any account",
      "EFT urgency prevents proper authorization workflows"
    ],
    explanation: "Australian businesses frequently face CEO/director impersonation fraud. Always verify unusual payment requests by calling the director directly at their known phone number."
  },
  {
    id: "au-ship-1",
    region: "Australia",
    type: "shipping",
    title: "Australia Post Delivery Fee Required",
    sender: "delivery@auspost-parcels-notify.com",
    subject: "Parcel Held - $3.95 Fee Required for Delivery",
    body: "Australia Post\n\nYour parcel (Tracking: AP9876543210) could not be delivered due to an unpaid customs assessment fee of $3.95 AUD.\n\n[Pay Fee and Redeliver]\n\nIf not paid within 5 business days, the parcel will be returned to the sender.\n\nAustralia Post Customer Service",
    isPhishing: true,
    redFlags: [
      "Domain 'auspost-parcels-notify.com' is not auspost.com.au",
      "Australia Post does not collect small fees via email links",
      "Small dollar amount designed to capture credit card details",
      "Real tracking would be on auspost.com.au",
      "5-day return deadline creates urgency"
    ],
    explanation: "Australia Post scams are common. Always track parcels directly at auspost.com.au. Australia Post collects customs fees through official channels, not email links."
  },
  {
    id: "au-it-1",
    region: "Australia",
    type: "it-reset",
    title: "Microsoft 365 License Expiration",
    sender: "admin@microsoft365-renewal.com.au",
    subject: "Your Microsoft 365 Business License Expires Today",
    body: "Microsoft 365 Admin Center\n\nYour Microsoft 365 Business Premium license for your organisation expires today. To avoid losing access to email, Teams, and OneDrive, renew immediately:\n\n[Renew License Now]\n\nAll data will be deleted 30 days after expiration.\n\nMicrosoft 365 Business Support",
    isPhishing: true,
    redFlags: [
      "Domain 'microsoft365-renewal.com.au' is not microsoft.com",
      "Microsoft sends renewal notices within the admin portal, not via external email",
      "Data deletion threat creates panic",
      "No reference to your specific organisation name or admin account",
      "License renewals are managed through admin.microsoft.com"
    ],
    explanation: "Microsoft license scams target business accounts. Manage all Microsoft 365 subscriptions directly through admin.microsoft.com, never through links in unsolicited emails."
  },
  {
    id: "af-mobile-1",
    region: "Africa",
    type: "mobile-money",
    title: "M-Pesa Business Payment Reversal",
    sender: "SMS from +254700XXXXXX",
    subject: "M-Pesa Business Notification",
    body: "Safaricom M-Pesa: A payment of KES 150,000 has been sent to your business till by mistake. Customer requests reversal. Please send KES 150,000 to 0712XXXXXX to process the reversal. Safaricom will debit your account if not resolved in 2 hours.",
    isPhishing: true,
    redFlags: [
      "M-Pesa reversals are handled by Safaricom customer service, not by sending money back",
      "The 'accidental payment' may never have been received, check your actual balance",
      "2-hour deadline creates panic",
      "Safaricom does not send reversal requests via SMS asking you to send money",
      "This is the most common B2C mobile money fraud in East Africa"
    ],
    explanation: "M-Pesa reversal scams are extremely common in Kenya and East Africa. Never send money to 'reverse' a transaction. Check your actual M-Pesa balance and contact Safaricom at 234 if you receive such messages."
  },
  {
    id: "af-tax-1",
    region: "Africa",
    type: "tax-scam",
    title: "SARS Business Tax Clearance",
    sender: "compliance@sars-efiling-portal.co.za",
    subject: "Tax Clearance Certificate. Urgent Action Required",
    body: "South African Revenue Service\n\nYour business tax clearance certificate has expired. Without a valid TCC, your business will be unable to tender for government contracts or receive payments from government departments.\n\nTo renew your certificate immediately, verify your tax details:\n[Renew TCC Now]\n\nNon-compliance penalties of R50,000 may apply.\n\nSARS eFiling Support",
    isPhishing: true,
    redFlags: [
      "SARS uses sars.gov.za, not 'sars-efiling-portal.co.za'",
      "Tax clearance certificates are obtained through eFiling at sarsefiling.co.za",
      "R50,000 penalty threat creates fear",
      "SARS communicates through registered eFiling accounts, not unsolicited emails",
      "Government tendering restrictions add legitimacy pressure"
    ],
    explanation: "SARS phishing emails are prevalent in South Africa. Always access SARS services through the official eFiling portal at sarsefiling.co.za. Never click links in unsolicited tax emails."
  },
  {
    id: "af-procurement-1",
    region: "Africa",
    type: "procurement",
    title: "Nigerian Government Procurement Opportunity",
    sender: "procurement@fedgovng-tender.com",
    subject: "Pre-Qualification for Federal Contract Worth ₦45,000,000",
    body: "Federal Government of Nigeria\nBureau of Public Procurement\n\nYour company has been pre-qualified for a federal infrastructure contract worth ₦45,000,000. To proceed with the tendering process, a registration fee of ₦250,000 is required.\n\nPayment should be made to:\nAccount Name: Federal Procurement Trust\nBank: Zenith Bank\nAccount: 1234567890\n\nSubmit payment receipt to proceed to the next stage.\n\nDirector, Bureau of Public Procurement\nAbuja, FCT",
    isPhishing: true,
    redFlags: [
      "Legitimate government procurement does not require advance registration fees",
      "Domain 'fedgovng-tender.com' is not an official Nigerian government domain (.gov.ng)",
      "Pre-qualification without an application is suspicious",
      "Payment to a 'Trust' account rather than official government accounts",
      "Advance fee fraud (419) remains one of the most common scams in West Africa"
    ],
    explanation: "Advance fee procurement scams impersonate government agencies across Africa. Legitimate government contracts are advertised through official channels and never require upfront registration fees to personal accounts."
  },
  {
    id: "af-mobile-2",
    region: "Africa",
    type: "mobile-money",
    title: "MTN Mobile Money Agent Registration",
    sender: "SMS from MTN-MoMo",
    subject: "MTN Mobile Money",
    body: "Congratulations! You have been selected as an MTN Mobile Money agent. To activate your agent account, send a registration fee of GHS 500 to agent number 024XXXXXXX. Your commission structure: 3% on all transactions. Reply YES to confirm.",
    isPhishing: true,
    redFlags: [
      "MTN does not recruit mobile money agents via unsolicited SMS",
      "Legitimate agent registration is done at MTN service centers in person",
      "Sending money to 'register' is a classic advance fee scam",
      "The commission rate is suspiciously high to lure victims",
      "Reply YES to confirm is designed to engage you in conversation"
    ],
    explanation: "Mobile money agent scams target entrepreneurs across West Africa. Legitimate mobile money agent registration is done in person at authorized service centers with proper documentation."
  },
  {
    id: "af-inv-1",
    region: "Africa",
    type: "invoice-fraud",
    title: "Supplier Invoice with EcoCash Payment",
    sender: "accounts@trusted-supplier-zw.com",
    subject: "Invoice Payment. Please Use EcoCash",
    body: "Dear Customer,\n\nDue to banking system challenges, we request that payment for Invoice ZW-2024-091 (USD $3,200) be made via EcoCash to our new merchant number: *151*2*1*XXXXXXX#\n\nThis is temporary until our bank account is restored. Please process urgently as stock allocation depends on payment.\n\nThank you,\nFinance Department\nTrusted Supplier (Pvt) Ltd",
    isPhishing: true,
    redFlags: [
      "Switching from bank payment to mobile money is a red flag",
      "'Banking system challenges' is a common excuse in Zimbabwe scams",
      "Urgency about stock allocation pressures you to act without verifying",
      "Always verify payment method changes with a phone call to the known contact",
      "EcoCash payments to unknown numbers are difficult to reverse"
    ],
    explanation: "In Zimbabwe and other African countries where mobile money is widespread, scammers exploit payment channel switching. Always call your supplier at their known number before changing payment methods."
  },
  {
    id: "af-renewal-1",
    region: "Africa",
    type: "renewal-scam",
    title: "CIPC Annual Return Filing",
    sender: "filing@cipc-annual-returns.co.za",
    subject: "Annual Return Overdue. Company May Be Deregistered",
    body: "Companies and Intellectual Property Commission\n\nYour company's annual return is overdue. Failure to file within 14 days will result in deregistration proceedings.\n\nFile your annual return and pay the filing fee online:\n[File Annual Return]\n\nFiling fee: R480 (includes late penalty)\n\nCIPC\nPretoria, South Africa",
    isPhishing: true,
    redFlags: [
      "CIPC's real domain is cipc.co.za, not 'cipc-annual-returns.co.za'",
      "The real annual return fee is R30-R100, not R480",
      "CIPC communicates through their official portal at eservices.cipc.co.za",
      "Deregistration threat creates panic",
      "Annual returns are filed through CIPC's official eServices portal"
    ],
    explanation: "CIPC impersonation scams target South African businesses. The real annual return can be filed at eservices.cipc.co.za for a fraction of the scam fee."
  },
  {
    id: "us-legit-1",
    region: "US",
    type: "vendor-payment",
    title: "Legitimate Stripe Payment Notification",
    sender: "receipts@stripe.com",
    subject: "Your payment to Acme SaaS Inc. was successful",
    body: "Stripe\n\nHi,\n\nYour payment of $149.00 USD to Acme SaaS Inc. was successful.\n\nDate: March 15, 2025\nPayment method: Visa ending in 4242\nReceipt number: 2394-7281\n\nView your receipt: https://dashboard.stripe.com/receipts/...\n\nQuestions? Contact Acme SaaS Inc. at support@acmesaas.com.\n\nStripe",
    isPhishing: false,
    redFlags: [],
    explanation: "This is a legitimate Stripe payment receipt. The sender domain is the real stripe.com, it references a specific payment amount and card ending, and links to the real Stripe dashboard. Always verify the sender domain matches the legitimate service."
  },
  {
    id: "uk-legit-1",
    region: "UK",
    type: "renewal-scam",
    title: "Legitimate Xero Subscription Renewal",
    sender: "billing@xero.com",
    subject: "Your Xero subscription has been renewed",
    body: "Hi,\n\nYour Xero Standard subscription has been renewed for another month.\n\nAmount: £36.00 (inc. VAT)\nNext billing date: April 15, 2025\nPayment method: Direct Debit ending 7890\n\nManage your subscription at https://my.xero.com/billing\n\nXero",
    isPhishing: false,
    redFlags: [],
    explanation: "This is a legitimate subscription renewal from Xero. The domain is xero.com, it references your specific plan and payment method, and links to the real Xero billing portal."
  }
];

export const policyTemplates: PolicyTemplate[] = [
  {
    id: "acceptable-use",
    name: "Acceptable Use Policy",
    description: "Define acceptable and prohibited uses of company technology resources.",
    icon: "monitor",
    questions: [
      { id: "au-q1", question: "How many employees does your company have?", options: ["1-10", "11-50", "51-200", "200+"] },
      { id: "au-q2", question: "Do employees use personal devices for work?", options: ["Yes, regularly", "Sometimes", "No, company devices only"] },
      { id: "au-q3", question: "Is social media use relevant to your business?", options: ["Yes, for marketing/sales", "Limited use allowed", "No social media at work"] },
      { id: "au-q4", question: "Do employees work remotely?", options: ["Fully remote", "Hybrid", "On-site only"] }
    ],
    sections: [
      { title: "Purpose and Scope", description: "Establishes why the policy exists and who it applies to.", sampleLanguage: "This policy defines acceptable use of [Company Name]'s technology resources including computers, networks, email, internet access, and software. It applies to all employees, contractors, and temporary workers." },
      { title: "Acceptable Use", description: "What employees are allowed to do.", sampleLanguage: "Company technology resources are provided primarily for business purposes. Limited personal use is permitted provided it does not interfere with work duties, consume significant resources, or violate any other company policy." },
      { title: "Prohibited Activities", description: "Actions that are not allowed.", sampleLanguage: "Users must not: install unauthorized software, share login credentials, access or distribute inappropriate content, use company resources for personal commercial activities, or attempt to circumvent security controls." },
      { title: "Email and Communication", description: "Rules for business communications.", sampleLanguage: "Business email should be used professionally. Users should be aware that emails may be monitored and should not have an expectation of privacy when using company communication systems." },
      { title: "Monitoring and Enforcement", description: "How the policy will be enforced.", sampleLanguage: "[Company Name] reserves the right to monitor use of its technology resources. Violations of this policy may result in disciplinary action up to and including termination of employment." },
      { title: "Acknowledgment", description: "Employee signature section.", sampleLanguage: "I have read and understand the Acceptable Use Policy. I agree to comply with all terms outlined in this policy." }
    ]
  },
  {
    id: "password",
    name: "Password Policy",
    description: "Set standards for creating, managing, and protecting passwords.",
    icon: "key",
    questions: [
      { id: "pw-q1", question: "Do you use a company password manager?", options: ["Yes", "Planning to", "No"] },
      { id: "pw-q2", question: "Is multi-factor authentication deployed?", options: ["On all systems", "On some systems", "Not yet"] },
      { id: "pw-q3", question: "How often should passwords be changed?", options: ["Only when compromised", "Every 90 days", "Every 180 days"] }
    ],
    sections: [
      { title: "Purpose", description: "Why password security matters.", sampleLanguage: "This policy establishes requirements for creating, managing, and protecting passwords used to access [Company Name]'s systems and data." },
      { title: "Password Requirements", description: "Minimum standards for passwords.", sampleLanguage: "Passwords must be at least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters. Passphrases of 16+ characters are encouraged." },
      { title: "Password Management", description: "How passwords should be stored and handled.", sampleLanguage: "Passwords must never be shared, written down, or stored in plain text. All employees are required to use the company-approved password manager for storing and generating passwords." },
      { title: "Multi-Factor Authentication", description: "MFA requirements.", sampleLanguage: "Multi-factor authentication (MFA) is required on all business-critical systems including email, cloud storage, financial systems, and VPN access." },
      { title: "Compromised Passwords", description: "What to do if a password is compromised.", sampleLanguage: "If a password is suspected of being compromised, the user must change it immediately and report the incident to IT. The IT team will assess whether further action is needed." }
    ]
  },
  {
    id: "byod",
    name: "BYOD Policy",
    description: "Manage risks when employees use personal devices for work.",
    icon: "smartphone",
    questions: [
      { id: "byod-q1", question: "Which personal devices are allowed?", options: ["Phones only", "Phones and tablets", "Phones, tablets, and laptops", "All devices"] },
      { id: "byod-q2", question: "Can employees access company email on personal devices?", options: ["Yes", "With MDM installed", "No"] },
      { id: "byod-q3", question: "What happens to company data when an employee leaves?", options: ["Remote wipe capability", "Manual removal required", "No current process"] }
    ],
    sections: [
      { title: "Purpose and Scope", description: "Which devices and employees are covered.", sampleLanguage: "This policy governs the use of personal devices (smartphones, tablets, laptops) to access [Company Name]'s systems and data. It applies to all employees who choose to use personal devices for work purposes." },
      { title: "Eligibility and Enrollment", description: "How to enroll personal devices.", sampleLanguage: "Employees wishing to use personal devices must enroll them with the IT department. Devices must meet minimum security requirements including current operating system, screen lock enabled, and encryption activated." },
      { title: "Security Requirements", description: "Mandatory security controls.", sampleLanguage: "Personal devices used for work must have: a passcode/biometric lock, full-disk encryption enabled, automatic updates enabled, and company-approved mobile device management (MDM) software installed." },
      { title: "Data Separation and Privacy", description: "How personal and work data are kept separate.", sampleLanguage: "[Company Name] will only manage the work profile on personal devices. Personal data, photos, and applications will not be accessed or monitored. However, in the event of a security incident, a full device wipe may be necessary." },
      { title: "Termination and Off-boarding", description: "What happens when employment ends.", sampleLanguage: "Upon termination of employment, all company data must be removed from personal devices within 24 hours. The IT department will remotely remove the work profile and verify data removal." }
    ]
  },
  {
    id: "incident-response",
    name: "Incident Response Policy",
    description: "Define procedures for responding to security incidents.",
    icon: "alert-triangle",
    questions: [
      { id: "ir-q1", question: "Do you have a designated incident response team?", options: ["Yes, formal team", "Informal. IT handles it", "No, not yet"] },
      { id: "ir-q2", question: "Do you have cyber insurance?", options: ["Yes", "Researching options", "No"] },
      { id: "ir-q3", question: "How quickly can you isolate a compromised system?", options: ["Within minutes", "Within hours", "Not sure"] },
      { id: "ir-q4", question: "Do you have regulatory notification obligations?", options: ["Yes (GDPR, HIPAA, etc.)", "Maybe; need to check", "No"] }
    ],
    sections: [
      { title: "Purpose and Scope", description: "What constitutes a security incident.", sampleLanguage: "This policy defines [Company Name]'s procedures for identifying, responding to, and recovering from cybersecurity incidents. A security incident is any event that threatens the confidentiality, integrity, or availability of company systems or data." },
      { title: "Incident Response Team", description: "Who is responsible during an incident.", sampleLanguage: "The Incident Response Team consists of: Incident Commander (decision-maker), Technical Lead (IT/security), Communications Lead (internal/external messaging), and Legal/Compliance (regulatory requirements)." },
      { title: "Detection and Reporting", description: "How incidents are identified and reported.", sampleLanguage: "All employees must report suspected security incidents immediately to [reporting email/phone]. Do not attempt to investigate or resolve the incident independently." },
      { title: "Response Procedures", description: "Step-by-step response actions.", sampleLanguage: "Upon confirmed incident: 1) Contain; isolate affected systems. 2) Assess; determine scope and impact. 3) Eradicate; remove the threat. 4) Recover; restore systems from clean backups. 5) Document; record all actions taken." },
      { title: "Communication Plan", description: "Who needs to be notified.", sampleLanguage: "Internal notifications: executive team within 1 hour, all staff as needed. External notifications: cyber insurance provider, legal counsel, regulatory authorities (if required), affected customers (if data breach confirmed)." },
      { title: "Post-Incident Review", description: "Learning from incidents.", sampleLanguage: "Within 5 business days of incident resolution, the IR Team will conduct a post-incident review to identify root cause, evaluate response effectiveness, and implement improvements." }
    ]
  },
  {
    id: "data-classification",
    name: "Data Classification Policy",
    description: "Categorize and protect data based on sensitivity level.",
    icon: "folder-lock",
    questions: [
      { id: "dc-q1", question: "What types of sensitive data does your business handle?", options: ["Customer PII", "Financial records", "Health data", "All of the above"] },
      { id: "dc-q2", question: "Do you operate in regulated industries?", options: ["Yes (healthcare, finance, etc.)", "Partially regulated", "No specific regulations"] },
      { id: "dc-q3", question: "Where is your data primarily stored?", options: ["Cloud only", "On-premises only", "Hybrid"] }
    ],
    sections: [
      { title: "Purpose", description: "Why data classification matters.", sampleLanguage: "This policy establishes a framework for classifying [Company Name]'s data based on sensitivity and criticality, ensuring appropriate protection measures are applied." },
      { title: "Classification Levels", description: "Data categories and definitions.", sampleLanguage: "PUBLIC. No restrictions. INTERNAL. For internal use only, not for external distribution. CONFIDENTIAL. Sensitive business data requiring access controls. RESTRICTED. Highly sensitive data (PII, financial, health) requiring encryption and strict access controls." },
      { title: "Handling Requirements", description: "How each classification level should be handled.", sampleLanguage: "CONFIDENTIAL and RESTRICTED data must be: encrypted at rest and in transit, stored only on approved systems, shared only with authorized personnel, and securely disposed of when no longer needed." },
      { title: "Data Ownership", description: "Who is responsible for classifying data.", sampleLanguage: "Each department head is the data owner for data created and managed by their team. Data owners are responsible for classifying their data and ensuring appropriate handling." },
      { title: "Compliance and Audit", description: "How compliance will be verified.", sampleLanguage: "The IT team will conduct quarterly audits of data handling practices. Violations will be reported to management and may result in disciplinary action." }
    ]
  },
  {
    id: "remote-work",
    name: "Remote Work Security Policy",
    description: "Secure your business when employees work from home or remotely.",
    icon: "home",
    questions: [
      { id: "rw-q1", question: "What percentage of your team works remotely?", options: ["Everyone", "Most (>50%)", "Some (<50%)", "Occasional/as-needed"] },
      { id: "rw-q2", question: "Do remote workers use company-issued devices?", options: ["Yes, always", "Mix of company and personal", "Mostly personal devices"] },
      { id: "rw-q3", question: "Do you provide VPN access?", options: ["Yes", "Planning to", "No"] },
      { id: "rw-q4", question: "Are there specific industries or compliance requirements?", options: ["Healthcare (HIPAA)", "Finance (PCI-DSS)", "General business", "Multiple regulations"] }
    ],
    sections: [
      { title: "Purpose and Scope", description: "Who this policy covers and why.", sampleLanguage: "This policy establishes security requirements for [Company Name] employees who work remotely, whether from home, co-working spaces, or while travelling." },
      { title: "Network Security", description: "Requirements for secure connections.", sampleLanguage: "Remote workers must use the company VPN when accessing internal systems. Public Wi-Fi must never be used for business purposes without VPN. Home Wi-Fi networks must use WPA3 or WPA2 encryption with a strong, unique password." },
      { title: "Physical Security", description: "Protecting devices and documents.", sampleLanguage: "Company devices and documents must not be left unattended in public places. Screens must be locked when stepping away. Sensitive documents must be shredded, not recycled." },
      { title: "Communication Security", description: "Secure communication standards.", sampleLanguage: "Business discussions involving sensitive information must use company-approved communication tools. Personal messaging apps (WhatsApp, iMessage) should not be used for sharing confidential business data." },
      { title: "Incident Reporting", description: "What to do if something goes wrong.", sampleLanguage: "If a remote worker suspects a security incident (lost device, suspicious email, unauthorized access), they must immediately notify IT at [contact]. Do not attempt to resolve security incidents independently." }
    ]
  }
];

export const incidentTypes: IncidentType[] = [
  {
    id: "ransomware",
    name: "Ransomware Attack",
    icon: "lock",
    color: "bg-red-500",
    description: "Your files have been encrypted and attackers demand payment.",
    steps: [
      { id: "r1", title: "Isolate Affected Systems", description: "Disconnect infected computers from the network immediately.", options: [
        { label: "Systems are disconnected from network", nextId: "r2", actions: ["Unplug network cables", "Disable Wi-Fi", "Do NOT power off; evidence may be lost"] },
        { label: "I can't access the systems", nextId: "r2-alt", actions: ["Disconnect the network at the router/switch level", "Contact your IT provider immediately"] }
      ]},
      { id: "r2", title: "Do NOT Pay the Ransom", description: "Payment does not guarantee data recovery and funds criminal activity.", options: [
        { label: "Understood; moving to assessment", nextId: "r3" }
      ]},
      { id: "r2-alt", title: "Escalate to IT Support", description: "Professional help is needed for network-level isolation.", options: [
        { label: "IT provider contacted", nextId: "r3" }
      ]},
      { id: "r3", title: "Assess the Damage", description: "Determine what systems and data are affected.", options: [
        { label: "We have clean backups available", nextId: "r4a" },
        { label: "We don't have backups or they may be affected", nextId: "r4b" }
      ]},
      { id: "r4a", title: "Restore from Backups", description: "Wipe affected systems and restore from known clean backups.", options: [
        { label: "Restoration in progress", nextId: "r5", actions: ["Ensure backups are from before the infection", "Scan backups for malware before restoring", "Restore to clean systems only"] }
      ]},
      { id: "r4b", title: "Engage Incident Response Professionals", description: "Without clean backups, professional recovery assistance is critical.", options: [
        { label: "Contacting IR professionals", nextId: "r5", actions: ["Contact your cyber insurance provider; they often have IR partners", "Preserve all evidence for investigation", "Check nomoreransom.org for free decryption tools"] }
      ]},
      { id: "r5", title: "Report and Notify", description: "Report the incident to appropriate authorities and notify affected parties.", options: [
        { label: "Reports filed", nextId: null, actions: ["Report to law enforcement (see contacts below)", "Notify cyber insurance provider", "Assess regulatory notification requirements", "Document the full incident timeline"] }
      ]}
    ],
    reportingContacts: [
      { region: "US", contacts: [{ name: "FBI IC3", url: "https://ic3.gov", phone: "1-800-CALL-FBI" }, { name: "CISA", url: "https://cisa.gov/report" }] },
      { region: "UK", contacts: [{ name: "Action Fraud", url: "https://actionfraud.police.uk", phone: "0300 123 2040" }, { name: "NCSC", url: "https://ncsc.gov.uk/incident-management" }] },
      { region: "Canada", contacts: [{ name: "Canadian Centre for Cyber Security", url: "https://cyber.gc.ca", phone: "1-833-CYBER-88" }] },
      { region: "Australia", contacts: [{ name: "ACSC", url: "https://cyber.gov.au/report", phone: "1300 CYBER1" }] },
      { region: "Africa", contacts: [{ name: "CERT-Africa (AfricaCERT)", url: "https://africacert.org" }, { name: "SA CSIRT", url: "https://cybersecurity.gov.za" }, { name: "KE-CIRT (Kenya)", url: "https://ke-cirt.go.ke" }] }
    ]
  },
  {
    id: "data-breach",
    name: "Data Breach",
    icon: "database",
    color: "bg-orange-500",
    description: "Unauthorized access to or exposure of sensitive business or customer data.",
    steps: [
      { id: "db1", title: "Confirm the Breach", description: "Verify that unauthorized access or data exposure has occurred.", options: [
        { label: "Breach confirmed; data was accessed", nextId: "db2" },
        { label: "Potential breach; still investigating", nextId: "db1b" }
      ]},
      { id: "db1b", title: "Preserve Evidence", description: "Do not alter or delete anything while investigating.", options: [
        { label: "Evidence preserved, continuing investigation", nextId: "db2", actions: ["Screenshot any suspicious activity", "Capture server and application logs", "Note exact times and systems involved"] }
      ]},
      { id: "db2", title: "Contain the Breach", description: "Stop further data exposure.", options: [
        { label: "Access has been revoked/systems secured", nextId: "db3", actions: ["Change all potentially compromised credentials", "Revoke access tokens and API keys", "Patch the vulnerability that was exploited if known"] }
      ]},
      { id: "db3", title: "Assess Impact", description: "Determine what data was exposed and how many people are affected.", options: [
        { label: "Customer personal data was exposed", nextId: "db4a" },
        { label: "Only internal business data was exposed", nextId: "db4b" }
      ]},
      { id: "db4a", title: "Regulatory Notification Required", description: "Most jurisdictions require notification when personal data is breached.", options: [
        { label: "Proceeding with notifications", nextId: "db5", actions: ["Determine applicable regulations (GDPR: 72 hours, CCPA: without unreasonable delay)", "Engage legal counsel", "Prepare customer notification letters", "Set up a support channel for affected customers"] }
      ]},
      { id: "db4b", title: "Internal Response", description: "Even internal breaches require thorough response.", options: [
        { label: "Internal response initiated", nextId: "db5", actions: ["Assess competitive or financial impact", "Review and strengthen access controls", "Consider voluntary law enforcement notification"] }
      ]},
      { id: "db5", title: "Remediate and Prevent", description: "Fix the root cause and prevent recurrence.", options: [
        { label: "Remediation plan in place", nextId: null, actions: ["Conduct thorough root cause analysis", "Implement additional security controls", "Update incident response procedures", "Schedule post-incident review within 5 business days"] }
      ]}
    ],
    reportingContacts: [
      { region: "US", contacts: [{ name: "FBI IC3", url: "https://ic3.gov" }, { name: "FTC", url: "https://ftc.gov/data-breach" }, { name: "State Attorney General", url: "https://naag.org/find-my-ag" }] },
      { region: "UK", contacts: [{ name: "ICO (Data Protection)", url: "https://ico.org.uk/make-a-complaint", phone: "0303 123 1113" }] },
      { region: "Canada", contacts: [{ name: "Office of the Privacy Commissioner", url: "https://priv.gc.ca", phone: "1-800-282-1376" }] },
      { region: "Australia", contacts: [{ name: "OAIC (Notifiable Data Breaches)", url: "https://oaic.gov.au/privacy/notifiable-data-breaches" }] },
      { region: "Africa", contacts: [{ name: "POPIA Information Regulator (SA)", url: "https://inforegulator.org.za" }, { name: "NDPR (Nigeria)", url: "https://nitda.gov.ng" }] }
    ]
  },
  {
    id: "bec",
    name: "Business Email Compromise / Wire Fraud",
    icon: "mail",
    color: "bg-amber-500",
    description: "Money was sent to a fraudulent account due to a spoofed or compromised email.",
    steps: [
      { id: "bec1", title: "Contact Your Bank Immediately", description: "Time is critical; banks can sometimes recall wire transfers within 24-72 hours.", options: [
        { label: "Bank has been contacted", nextId: "bec2", actions: ["Call your bank's fraud department directly", "Request an urgent wire recall", "Ask about the Recovery Asset Team (US banks)"] }
      ]},
      { id: "bec2", title: "Determine How It Happened", description: "Was it a spoofed email or a compromised account?", options: [
        { label: "A spoofed (fake) email was used", nextId: "bec3a" },
        { label: "An actual email account was compromised", nextId: "bec3b" }
      ]},
      { id: "bec3a", title: "Strengthen Email Authentication", description: "Implement protections against email spoofing.", options: [
        { label: "Email protections being updated", nextId: "bec4", actions: ["Implement DMARC with reject policy", "Verify DKIM and SPF records", "Enable external email banner warnings"] }
      ]},
      { id: "bec3b", title: "Secure the Compromised Account", description: "The attacker may still have access.", options: [
        { label: "Account secured", nextId: "bec4", actions: ["Reset the password immediately", "Revoke all active sessions", "Enable MFA if not already active", "Check for mail forwarding rules set by the attacker", "Review sent mail for messages sent by the attacker"] }
      ]},
      { id: "bec4", title: "Report to Authorities", description: "Law enforcement may be able to assist with fund recovery.", options: [
        { label: "Reports filed", nextId: null, actions: ["File a report with law enforcement (see contacts below)", "US: File with FBI IC3 - they have a Recovery Asset Team for wire fraud", "Document all communication related to the fraud", "Review and strengthen payment verification procedures"] }
      ]}
    ],
    reportingContacts: [
      { region: "US", contacts: [{ name: "FBI IC3 (Recovery Asset Team)", url: "https://ic3.gov", phone: "1-800-CALL-FBI" }] },
      { region: "UK", contacts: [{ name: "Action Fraud", url: "https://actionfraud.police.uk", phone: "0300 123 2040" }] },
      { region: "Canada", contacts: [{ name: "Canadian Anti-Fraud Centre", url: "https://antifraudcentre-centreantifraude.ca", phone: "1-888-495-8501" }] },
      { region: "Australia", contacts: [{ name: "ReportCyber (ACSC)", url: "https://cyber.gov.au/report" }] },
      { region: "Africa", contacts: [{ name: "SA Police Service (SAPS)", url: "https://saps.gov.za" }, { name: "Nigeria EFCC", url: "https://efccnigeria.org" }] }
    ]
  },
  {
    id: "account-compromise",
    name: "Account Compromise",
    icon: "user-x",
    color: "bg-purple-500",
    description: "An unauthorized person has gained access to a business account.",
    steps: [
      { id: "ac1", title: "Identify Which Account Is Compromised", description: "Determine the scope of the compromise.", options: [
        { label: "Email account compromised", nextId: "ac2-email" },
        { label: "Cloud service account (O365, Google Workspace, etc.)", nextId: "ac2-cloud" },
        { label: "Financial/banking account", nextId: "ac2-bank" }
      ]},
      { id: "ac2-email", title: "Secure the Email Account", description: "Take immediate action to lock out the attacker.", options: [
        { label: "Email account secured", nextId: "ac3", actions: ["Reset password immediately", "Enable MFA if not already active", "Check and remove any suspicious mail forwarding rules", "Review recently sent emails for attacker activity", "Warn contacts who may have received fraudulent emails"] }
      ]},
      { id: "ac2-cloud", title: "Secure the Cloud Account", description: "Prevent further access and assess damage.", options: [
        { label: "Cloud account secured", nextId: "ac3", actions: ["Reset password and revoke all sessions", "Review audit logs for unauthorized actions", "Check for new admin accounts created by the attacker", "Review shared files and permissions for changes", "Check for OAuth app authorizations you did not grant"] }
      ]},
      { id: "ac2-bank", title: "Secure the Financial Account", description: "Contact your bank immediately.", options: [
        { label: "Bank contacted", nextId: "ac3", actions: ["Call your bank's fraud line immediately", "Freeze the account if unauthorized transactions occurred", "Review all recent transactions", "Change online banking credentials", "Enable transaction alerts"] }
      ]},
      { id: "ac3", title: "Assess and Remediate", description: "Determine how the compromise happened and prevent recurrence.", options: [
        { label: "Assessment complete", nextId: null, actions: ["Determine the attack vector (phishing, credential stuffing, malware)", "Check if the compromised password was reused on other accounts", "Deploy MFA on all business accounts", "Review and update security awareness training", "Consider a password audit across the organization"] }
      ]}
    ],
    reportingContacts: [
      { region: "US", contacts: [{ name: "FBI IC3", url: "https://ic3.gov" }, { name: "FTC Identity Theft", url: "https://identitytheft.gov" }] },
      { region: "UK", contacts: [{ name: "Action Fraud", url: "https://actionfraud.police.uk" }, { name: "NCSC", url: "https://ncsc.gov.uk" }] },
      { region: "Canada", contacts: [{ name: "Canadian Anti-Fraud Centre", url: "https://antifraudcentre-centreantifraude.ca" }] },
      { region: "Australia", contacts: [{ name: "ReportCyber", url: "https://cyber.gov.au/report" }, { name: "Scamwatch", url: "https://scamwatch.gov.au" }] },
      { region: "Africa", contacts: [{ name: "SA CSIRT", url: "https://cybersecurity.gov.za" }, { name: "KE-CIRT (Kenya)", url: "https://ke-cirt.go.ke" }] }
    ]
  },
  {
    id: "insider-threat",
    name: "Insider Threat",
    icon: "user-minus",
    color: "bg-slate-600",
    description: "A current or former employee is suspected of malicious activity or data theft.",
    steps: [
      { id: "it1", title: "Assess the Situation", description: "Determine the nature and severity of the insider threat.", options: [
        { label: "Current employee suspected of data theft", nextId: "it2a" },
        { label: "Former employee may still have access", nextId: "it2b" },
        { label: "Accidental data exposure by an employee", nextId: "it2c" }
      ]},
      { id: "it2a", title: "Involve HR and Legal", description: "Insider threats require careful handling to protect the business legally.", options: [
        { label: "HR and legal engaged", nextId: "it3", actions: ["Do NOT confront the employee directly", "Engage HR and legal counsel before any action", "Begin monitoring the employee's system activity (with legal approval)", "Preserve all evidence of suspicious activity"] }
      ]},
      { id: "it2b", title: "Revoke All Access Immediately", description: "Former employees should not have any access to business systems.", options: [
        { label: "Access revoked", nextId: "it3", actions: ["Disable all accounts across every system", "Change shared passwords and API keys the person had access to", "Review access logs for any activity since their departure", "Check for data downloads or transfers before/after departure"] }
      ]},
      { id: "it2c", title: "Contain the Exposure", description: "Limit the impact of accidental data exposure.", options: [
        { label: "Exposure contained", nextId: "it3", actions: ["Determine what data was exposed and to whom", "Revoke public links or sharing permissions", "Assess whether regulatory notification is required", "Use this as a training opportunity, not just a disciplinary matter"] }
      ]},
      { id: "it3", title: "Investigate and Document", description: "Thorough investigation protects the business.", options: [
        { label: "Investigation complete", nextId: null, actions: ["Conduct forensic analysis of the employee's system activity", "Document all findings for potential legal proceedings", "Review and improve access controls and monitoring", "Update off-boarding procedures to prevent future incidents", "Consider implementing Data Loss Prevention (DLP) tools"] }
      ]}
    ],
    reportingContacts: [
      { region: "US", contacts: [{ name: "FBI (trade secrets/IP theft)", url: "https://fbi.gov/investigate/white-collar-crime" }] },
      { region: "UK", contacts: [{ name: "Action Fraud", url: "https://actionfraud.police.uk" }, { name: "ICO (if personal data involved)", url: "https://ico.org.uk" }] },
      { region: "Canada", contacts: [{ name: "RCMP Cybercrime", url: "https://rcmp-grc.gc.ca" }] },
      { region: "Australia", contacts: [{ name: "ACSC", url: "https://cyber.gov.au" }] },
      { region: "Africa", contacts: [{ name: "SAPS Commercial Crime (SA)", url: "https://saps.gov.za" }, { name: "EFCC (Nigeria)", url: "https://efccnigeria.org" }] }
    ]
  }
];

export const securityTools: SecurityTool[] = [
  { id: "pw-mgr", category: "Identity & Access", name: "Business Password Manager", description: "Centralized password storage with team sharing and audit logs.", priceSmall: "$3-5/user/mo", priceMedium: "$4-7/user/mo", priceLarge: "$5-8/user/mo", roiPoint: "Prevents credential-based breaches, which account for 80%+ of hacking incidents.", priority: "essential" },
  { id: "mfa", category: "Identity & Access", name: "Multi-Factor Authentication", description: "Second verification factor for account logins.", priceSmall: "Free-$3/user/mo", priceMedium: "$3-6/user/mo", priceLarge: "$6-9/user/mo", roiPoint: "Blocks 99.9% of automated account compromise attacks.", priority: "essential" },
  { id: "email-sec", category: "Email Security", name: "Email Security Gateway", description: "Anti-phishing, anti-spam, and email threat protection.", priceSmall: "$2-5/user/mo", priceMedium: "$3-8/user/mo", priceLarge: "$5-12/user/mo", roiPoint: "Prevents BEC attacks that average $125,000+ per incident.", priority: "essential" },
  { id: "sec-training", category: "Employee Training", name: "Security Awareness Training", description: "Automated training with simulated phishing campaigns.", priceSmall: "$3-5/user/mo", priceMedium: "$3-8/user/mo", priceLarge: "$4-10/user/mo", roiPoint: "Reduces successful phishing by 75% within 12 months.", priority: "essential" },
  { id: "endpoint", category: "Endpoint Security", name: "Endpoint Detection & Response (EDR)", description: "Advanced antivirus with behavioral analysis and response capability.", priceSmall: "$5-8/device/mo", priceMedium: "$6-12/device/mo", priceLarge: "$8-15/device/mo", roiPoint: "Detects and stops ransomware and zero-day threats that traditional antivirus misses.", priority: "essential" },
  { id: "backup", category: "Data Protection", name: "Cloud Backup Solution", description: "Automated backups with encryption and recovery testing.", priceSmall: "$5-10/device/mo", priceMedium: "$8-15/device/mo", priceLarge: "$10-20/device/mo", roiPoint: "Average ransomware downtime cost is $274,000 - backups reduce recovery to hours instead of weeks.", priority: "essential" },
  { id: "firewall", category: "Network Security", name: "Next-Gen Firewall", description: "Network traffic filtering with intrusion prevention.", priceSmall: "$50-150/mo", priceMedium: "$150-500/mo", priceLarge: "$500-2000/mo", roiPoint: "First line of defense against network-based attacks and unauthorized access.", priority: "recommended" },
  { id: "vpn", category: "Network Security", name: "Business VPN", description: "Encrypted remote access to company resources.", priceSmall: "$5-10/user/mo", priceMedium: "$8-12/user/mo", priceLarge: "$10-15/user/mo", roiPoint: "Secures remote work connections, preventing eavesdropping and man-in-the-middle attacks.", priority: "recommended" },
  { id: "dns", category: "Network Security", name: "DNS Filtering", description: "Blocks access to known malicious websites.", priceSmall: "$1-3/user/mo", priceMedium: "$2-4/user/mo", priceLarge: "$3-5/user/mo", roiPoint: "Prevents 33% of malware infections by blocking malicious domains before connection.", priority: "recommended" },
  { id: "cyber-ins", category: "Risk Management", name: "Cyber Insurance", description: "Financial protection against cybersecurity incidents.", priceSmall: "$500-2000/yr", priceMedium: "$2000-10000/yr", priceLarge: "$10000-50000/yr", roiPoint: "Covers incident response costs, legal fees, and business interruption; average breach cost for SMBs is $108,000.", priority: "recommended" },
  { id: "siem", category: "Monitoring", name: "SIEM/Log Management", description: "Centralized security event monitoring and alerting.", priceSmall: "$100-300/mo", priceMedium: "$300-1000/mo", priceLarge: "$1000-5000/mo", roiPoint: "Reduces breach detection time from 200+ days to hours.", priority: "nice-to-have" },
  { id: "dlp", category: "Data Protection", name: "Data Loss Prevention", description: "Monitors and prevents unauthorized data transfers.", priceSmall: "$5-10/user/mo", priceMedium: "$8-15/user/mo", priceLarge: "$10-20/user/mo", roiPoint: "Prevents data exfiltration by insiders and compromised accounts.", priority: "nice-to-have" },
  { id: "vuln-scan", category: "Monitoring", name: "Vulnerability Scanner", description: "Automated scanning for security weaknesses.", priceSmall: "$100-300/mo", priceMedium: "$200-500/mo", priceLarge: "$500-2000/mo", roiPoint: "Identifies exploitable vulnerabilities before attackers find them.", priority: "nice-to-have" },
  { id: "mdm", category: "Endpoint Security", name: "Mobile Device Management", description: "Centralized management and security for mobile devices.", priceSmall: "$3-6/device/mo", priceMedium: "$5-10/device/mo", priceLarge: "$7-12/device/mo", roiPoint: "Enables remote wipe of lost devices and enforces security policies on BYOD.", priority: "nice-to-have" }
];
