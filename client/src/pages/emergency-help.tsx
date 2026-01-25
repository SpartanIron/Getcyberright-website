import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  AlertTriangle, Phone, Shield, CreditCard, Smartphone, MessageCircle, 
  Users, Building2, Globe, ArrowRight, ArrowLeft, CheckCircle, Clock, FileText,
  Lock, Eye, Heart, ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { TechPatternBg } from "@/components/tech-pattern-bg";

type RegionKey = "americas" | "europe" | "africa" | "asia" | "oceania";

const regionLabels: Record<RegionKey, string> = {
  americas: "Americas",
  europe: "Europe",
  africa: "Africa",
  asia: "Asia",
  oceania: "Oceania"
};

const scamTypesByRegion: Record<RegionKey, Array<{
  id: string;
  icon: typeof Smartphone;
  title: string;
  subtitle: string;
  color: string;
  steps: string[];
  contacts: { country: string; provider: string; number: string }[];
}>> = {
  africa: [
    {
      id: "mobile-money",
      icon: Smartphone,
      title: "Mobile Money Scam",
      subtitle: "M-Pesa, MTN MoMo, Airtel Money fraud",
      color: "orange",
      steps: [
        "Do NOT send any more money, even if threatened",
        "Call your mobile money provider immediately to report and freeze your account",
        "Take screenshots of all messages and transaction confirmations",
        "Report to your local police station with all evidence",
        "File a report with your country's cybercrime unit"
      ],
      contacts: [
        { country: "Kenya", provider: "Safaricom M-Pesa", number: "0722 002 222" },
        { country: "Tanzania", provider: "Vodacom M-Pesa", number: "+255 754 100 100" },
        { country: "Uganda", provider: "MTN Mobile Money", number: "100" },
        { country: "Ghana", provider: "MTN MoMo", number: "100" }
      ]
    },
    {
      id: "romance",
      icon: Heart,
      title: "Romance Scam",
      subtitle: "Online dating or social media fraud",
      color: "red",
      steps: [
        "Stop all communication with the scammer immediately",
        "Do NOT send any more money under any circumstances",
        "Save all messages, photos, and transaction records",
        "Report the profile on the dating app or social media platform",
        "Report to police and your country's cybercrime unit",
        "Talk to someone you trust. This is not your fault."
      ],
      contacts: [
        { country: "Kenya", provider: "DCI Cybercrime", number: "0800 722 203" },
        { country: "Nigeria", provider: "EFCC", number: "+234 9 9044751" },
        { country: "South Africa", provider: "SAPS", number: "08600 10111" }
      ]
    },
    {
      id: "sim-swap",
      icon: CreditCard,
      title: "SIM Swap Fraud",
      subtitle: "Phone number stolen, accounts drained",
      color: "purple",
      steps: [
        "Contact your mobile provider IMMEDIATELY to report and block the SIM",
        "Call your bank to freeze accounts and stop all transactions",
        "Change passwords for all accounts linked to your phone number",
        "File a police report with your SIM card details",
        "Request a new SIM with enhanced security from your provider"
      ],
      contacts: [
        { country: "Kenya", provider: "Safaricom", number: "0722 002 222" },
        { country: "South Africa", provider: "Vodacom/MTN", number: "Contact provider" },
        { country: "Nigeria", provider: "All Networks", number: "Contact provider" }
      ]
    },
    {
      id: "investment",
      icon: Building2,
      title: "Investment / Forex Scam",
      subtitle: "Fake investment, Ponzi, or forex fraud",
      color: "green",
      steps: [
        "Stop investing immediately. Do not try to 'recover' losses by sending more",
        "Document everything: websites, account details, transaction records",
        "Report to your country's financial regulator",
        "File a police report with all evidence",
        "Be cautious of 'recovery services'. Many are also scams."
      ],
      contacts: [
        { country: "Kenya", provider: "Capital Markets Authority", number: "+254 20 2264900" },
        { country: "Nigeria", provider: "SEC Nigeria", number: "+234 9 4621168" },
        { country: "South Africa", provider: "FSCA", number: "0800 110 443" }
      ]
    },
    {
      id: "phishing",
      icon: Lock,
      title: "Phishing / Account Hacked",
      subtitle: "Fake SMS, email, or social media hack",
      color: "blue",
      steps: [
        "Change your password immediately on all affected accounts",
        "Enable two-factor authentication (2FA) if available",
        "Check for unauthorized transactions and report them",
        "Warn your contacts that your account may have been compromised",
        "Report to police and the platform where you were hacked"
      ],
      contacts: [
        { country: "Kenya", provider: "CA Kenya", number: "+254 20 4242000" },
        { country: "Nigeria", provider: "NITDA", number: "+234 9 4617500" }
      ]
    },
    {
      id: "job",
      icon: Users,
      title: "Job / Employment Scam",
      subtitle: "Fake job offers requiring payment",
      color: "teal",
      steps: [
        "Stop all communication with the fake employer",
        "Never pay fees for job applications or training",
        "Report the job posting on the platform where you found it",
        "If you shared personal documents, monitor for identity theft",
        "Report to police and labor authorities"
      ],
      contacts: [
        { country: "Kenya", provider: "NITA", number: "+254 20 2375960" },
        { country: "Nigeria", provider: "EFCC", number: "+234 9 9044751" }
      ]
    }
  ],
  americas: [
    {
      id: "payment-app",
      icon: Smartphone,
      title: "Payment App Scam",
      subtitle: "Zelle, Venmo, CashApp, PayPal fraud",
      color: "orange",
      steps: [
        "Do NOT send any more money, even if threatened",
        "Report the transaction in your payment app immediately",
        "Contact your bank if linked to your bank account",
        "Take screenshots of all messages and transaction confirmations",
        "Report to the FTC at ReportFraud.ftc.gov"
      ],
      contacts: [
        { country: "USA", provider: "Zelle", number: "Contact your bank" },
        { country: "USA", provider: "Venmo", number: "venmo.com/contact-us" },
        { country: "USA", provider: "CashApp", number: "cash.app/help" },
        { country: "Canada", provider: "Interac e-Transfer", number: "Contact your bank" }
      ]
    },
    {
      id: "romance",
      icon: Heart,
      title: "Romance Scam",
      subtitle: "Online dating or social media fraud",
      color: "red",
      steps: [
        "Stop all communication with the scammer immediately",
        "Do NOT send any more money, including gift cards or cryptocurrency",
        "Save all messages, photos, and transaction records",
        "Report the profile on the dating app or social media platform",
        "Report to the FTC and FBI IC3 (ic3.gov)",
        "Talk to someone you trust. This is not your fault."
      ],
      contacts: [
        { country: "USA", provider: "FTC", number: "ReportFraud.ftc.gov" },
        { country: "USA", provider: "FBI IC3", number: "ic3.gov" },
        { country: "Canada", provider: "Anti-Fraud Centre", number: "1-888-495-8501" }
      ]
    },
    {
      id: "investment",
      icon: Building2,
      title: "Investment / Crypto Scam",
      subtitle: "Fake investment, crypto, or stock fraud",
      color: "green",
      steps: [
        "Stop investing immediately. Do not try to 'recover' losses by sending more",
        "Document everything: websites, wallet addresses, transaction IDs, communications",
        "Report to the SEC and FTC",
        "File a police report with all evidence",
        "Be cautious of 'recovery services'. Many are also scams."
      ],
      contacts: [
        { country: "USA", provider: "SEC", number: "sec.gov/tcr" },
        { country: "USA", provider: "FTC", number: "ReportFraud.ftc.gov" },
        { country: "Canada", provider: "CSA", number: "securities-administrators.ca" }
      ]
    },
    {
      id: "phishing",
      icon: Lock,
      title: "Phishing / Identity Theft",
      subtitle: "Email, text, or fake website scam",
      color: "blue",
      steps: [
        "Change your password immediately on all affected accounts",
        "Enable two-factor authentication (2FA) if available",
        "Check credit reports for unauthorized accounts",
        "Consider a credit freeze with all three bureaus",
        "Report to IdentityTheft.gov for a recovery plan"
      ],
      contacts: [
        { country: "USA", provider: "Identity Theft", number: "IdentityTheft.gov" },
        { country: "USA", provider: "FTC", number: "ReportFraud.ftc.gov" },
        { country: "Canada", provider: "Anti-Fraud Centre", number: "1-888-495-8501" }
      ]
    },
    {
      id: "irs-government",
      icon: Building2,
      title: "IRS / Government Impersonation",
      subtitle: "Fake IRS, Social Security, or police calls",
      color: "purple",
      steps: [
        "Hang up immediately. Government agencies don't call demanding payment",
        "Never pay via gift cards, wire transfer, or cryptocurrency",
        "Report the call to the real agency being impersonated",
        "Report to the FTC at ReportFraud.ftc.gov",
        "Block the number and warn family members"
      ],
      contacts: [
        { country: "USA", provider: "IRS", number: "irs.gov/uac/tax-scams" },
        { country: "USA", provider: "SSA", number: "ssa.gov/scam" },
        { country: "Canada", provider: "CRA Fraud", number: "1-800-959-8281" }
      ]
    },
    {
      id: "tech-support",
      icon: Lock,
      title: "Tech Support Scam",
      subtitle: "Fake Microsoft, Apple, or antivirus calls",
      color: "teal",
      steps: [
        "Hang up or close the pop-up immediately",
        "Do NOT give remote access to your computer",
        "If you gave access, disconnect from internet and scan for malware",
        "Change passwords for sensitive accounts",
        "Report to the FTC and the company being impersonated"
      ],
      contacts: [
        { country: "USA", provider: "FTC", number: "ReportFraud.ftc.gov" },
        { country: "USA", provider: "Microsoft", number: "microsoft.com/reportascam" }
      ]
    }
  ],
  europe: [
    {
      id: "bank-transfer",
      icon: Smartphone,
      title: "Bank Transfer Fraud",
      subtitle: "Unauthorized transfers, APP fraud",
      color: "orange",
      steps: [
        "Contact your bank immediately to report and attempt to recall the payment",
        "Many banks in UK/EU have fraud protection. Ask about reimbursement",
        "Take screenshots of all messages and transaction confirmations",
        "Report to your national fraud reporting center",
        "Report to police if significant amount"
      ],
      contacts: [
        { country: "UK", provider: "Your Bank", number: "Call fraud hotline" },
        { country: "UK", provider: "Action Fraud", number: "0300 123 2040" },
        { country: "Germany", provider: "Police", number: "110" },
        { country: "France", provider: "Info Escroqueries", number: "0 805 805 817" }
      ]
    },
    {
      id: "romance",
      icon: Heart,
      title: "Romance Scam",
      subtitle: "Online dating or social media fraud",
      color: "red",
      steps: [
        "Stop all communication with the scammer immediately",
        "Do NOT send any more money under any circumstances",
        "Save all messages, photos, and transaction records",
        "Report the profile on the dating app or social media platform",
        "Report to your national fraud center",
        "Talk to someone you trust. This is not your fault."
      ],
      contacts: [
        { country: "UK", provider: "Action Fraud", number: "0300 123 2040" },
        { country: "Germany", provider: "Polizei", number: "online-strafanzeige.de" },
        { country: "France", provider: "Pharos", number: "internet-signalement.gouv.fr" }
      ]
    },
    {
      id: "investment",
      icon: Building2,
      title: "Investment / Crypto Scam",
      subtitle: "Fake investment, crypto, or forex fraud",
      color: "green",
      steps: [
        "Stop investing immediately. Do not try to 'recover' losses by sending more",
        "Document everything: websites, wallet addresses, transaction IDs, communications",
        "Report to your national financial regulator",
        "File a police report with all evidence",
        "Be cautious of 'recovery services'. Many are also scams."
      ],
      contacts: [
        { country: "UK", provider: "FCA", number: "fca.org.uk/scamsmart" },
        { country: "Germany", provider: "BaFin", number: "bafin.de" },
        { country: "EU", provider: "Europol", number: "europol.europa.eu" }
      ]
    },
    {
      id: "phishing",
      icon: Lock,
      title: "Phishing / Account Hacked",
      subtitle: "Email, SMS, or fake website scam",
      color: "blue",
      steps: [
        "Change your password immediately on all affected accounts",
        "Enable two-factor authentication (2FA) if available",
        "Check for unauthorized transactions and report them",
        "Scan your device for malware using trusted antivirus",
        "Report the phishing attempt to your national cyber center"
      ],
      contacts: [
        { country: "UK", provider: "NCSC", number: "ncsc.gov.uk" },
        { country: "Germany", provider: "BSI", number: "bsi.bund.de" },
        { country: "Netherlands", provider: "Fraud Helpdesk", number: "0900-0345" }
      ]
    },
    {
      id: "parcel",
      icon: Users,
      title: "Delivery / Parcel Scam",
      subtitle: "Fake DHL, Royal Mail, or customs fees",
      color: "teal",
      steps: [
        "Do NOT click links in SMS or email about unexpected deliveries",
        "Go directly to the courier's official website to check status",
        "Never pay 'customs fees' via links in messages",
        "Report fake messages to your national cyber center",
        "Block the sender"
      ],
      contacts: [
        { country: "UK", provider: "Action Fraud", number: "0300 123 2040" },
        { country: "UK", provider: "Report SMS", number: "Forward to 7726" }
      ]
    },
    {
      id: "hmrc-tax",
      icon: Building2,
      title: "Tax / Government Impersonation",
      subtitle: "Fake HMRC, tax authority calls",
      color: "purple",
      steps: [
        "Hang up immediately. Tax authorities don't call demanding immediate payment",
        "Never pay via gift cards, wire transfer, or cryptocurrency",
        "Report to the real tax authority",
        "Report to your national fraud center",
        "Block the number"
      ],
      contacts: [
        { country: "UK", provider: "HMRC", number: "gov.uk/report-suspicious-emails" },
        { country: "UK", provider: "Action Fraud", number: "0300 123 2040" }
      ]
    }
  ],
  asia: [
    {
      id: "digital-payment",
      icon: Smartphone,
      title: "Digital Payment Scam",
      subtitle: "UPI, Paytm, GCash, GrabPay fraud",
      color: "orange",
      steps: [
        "Do NOT send any more money, even if threatened",
        "Report the transaction in your payment app immediately",
        "Contact your bank if linked to your bank account",
        "Take screenshots of all messages and transaction confirmations",
        "Report to your national cybercrime portal"
      ],
      contacts: [
        { country: "India", provider: "Cyber Crime Portal", number: "cybercrime.gov.in" },
        { country: "India", provider: "Helpline", number: "1930" },
        { country: "Philippines", provider: "PNP Anti-Cybercrime", number: "+63 2 8723 0401" },
        { country: "Singapore", provider: "Anti-Scam Centre", number: "1800-722-6688" }
      ]
    },
    {
      id: "romance",
      icon: Heart,
      title: "Romance Scam",
      subtitle: "Online dating or social media fraud",
      color: "red",
      steps: [
        "Stop all communication with the scammer immediately",
        "Do NOT send any more money under any circumstances",
        "Save all messages, photos, and transaction records",
        "Report the profile on the dating app or social media platform",
        "Report to police and your country's cybercrime center",
        "Talk to someone you trust. This is not your fault."
      ],
      contacts: [
        { country: "India", provider: "Cyber Crime", number: "1930" },
        { country: "Singapore", provider: "Police", number: "1800-255-0000" },
        { country: "Malaysia", provider: "MCMC", number: "1-800-888-030" }
      ]
    },
    {
      id: "investment",
      icon: Building2,
      title: "Investment / Crypto Scam",
      subtitle: "Fake investment, crypto, or trading fraud",
      color: "green",
      steps: [
        "Stop investing immediately. Do not try to 'recover' losses by sending more",
        "Document everything: websites, wallet addresses, transaction IDs, communications",
        "Report to your country's financial regulator",
        "File a police report with all evidence",
        "Be cautious of 'recovery services'. Many are also scams."
      ],
      contacts: [
        { country: "India", provider: "SEBI", number: "sebi.gov.in" },
        { country: "Singapore", provider: "MAS", number: "mas.gov.sg" },
        { country: "Japan", provider: "FSA", number: "fsa.go.jp" }
      ]
    },
    {
      id: "phishing",
      icon: Lock,
      title: "Phishing / Account Hacked",
      subtitle: "Email, SMS, or fake website scam",
      color: "blue",
      steps: [
        "Change your password immediately on all affected accounts",
        "Enable two-factor authentication (2FA) if available",
        "Check for unauthorized transactions and report them",
        "Scan your device for malware using trusted antivirus",
        "Report to your national cybercrime portal"
      ],
      contacts: [
        { country: "India", provider: "CERT-In", number: "cert-in.org.in" },
        { country: "Singapore", provider: "CSA", number: "csa.gov.sg" }
      ]
    },
    {
      id: "job",
      icon: Users,
      title: "Job / Task Scam",
      subtitle: "Fake jobs, work-from-home, or task scams",
      color: "teal",
      steps: [
        "Stop all communication with the fake employer",
        "Never pay fees for job applications or 'tasks'",
        "Never send money to 'earn commissions'",
        "Report the job posting on the platform where you found it",
        "Report to police and consumer protection agencies"
      ],
      contacts: [
        { country: "India", provider: "Cyber Crime", number: "1930" },
        { country: "Philippines", provider: "DOLE", number: "+63 2 8527 8000" }
      ]
    },
    {
      id: "loan-app",
      icon: CreditCard,
      title: "Predatory Loan App",
      subtitle: "Illegal loan apps with harassment",
      color: "purple",
      steps: [
        "Stop paying if the app is unregistered/illegal",
        "Do NOT install apps that request all your contacts",
        "Report harassment to police immediately",
        "Document all threatening messages as evidence",
        "Report the app to your financial regulator"
      ],
      contacts: [
        { country: "India", provider: "RBI", number: "rbi.org.in" },
        { country: "Philippines", provider: "SEC", number: "sec.gov.ph" }
      ]
    }
  ],
  oceania: [
    {
      id: "bank-transfer",
      icon: Smartphone,
      title: "Bank Transfer Scam",
      subtitle: "Unauthorized transfers, payment fraud",
      color: "orange",
      steps: [
        "Contact your bank immediately to report and attempt to recall the payment",
        "Take screenshots of all messages and transaction confirmations",
        "Report to Scamwatch (Australia) or Netsafe (NZ)",
        "Report to police if significant amount"
      ],
      contacts: [
        { country: "Australia", provider: "Your Bank", number: "Call fraud hotline" },
        { country: "Australia", provider: "Scamwatch", number: "scamwatch.gov.au" },
        { country: "New Zealand", provider: "Netsafe", number: "0508 638 723" }
      ]
    },
    {
      id: "romance",
      icon: Heart,
      title: "Romance Scam",
      subtitle: "Online dating or social media fraud",
      color: "red",
      steps: [
        "Stop all communication with the scammer immediately",
        "Do NOT send any more money under any circumstances",
        "Save all messages, photos, and transaction records",
        "Report the profile on the dating app or social media platform",
        "Report to Scamwatch or Netsafe",
        "Talk to someone you trust. This is not your fault."
      ],
      contacts: [
        { country: "Australia", provider: "Scamwatch", number: "scamwatch.gov.au" },
        { country: "Australia", provider: "ReportCyber", number: "cyber.gov.au/report" },
        { country: "New Zealand", provider: "Netsafe", number: "0508 638 723" }
      ]
    },
    {
      id: "investment",
      icon: Building2,
      title: "Investment / Crypto Scam",
      subtitle: "Fake investment, crypto, or stock fraud",
      color: "green",
      steps: [
        "Stop investing immediately. Do not try to 'recover' losses by sending more",
        "Document everything: websites, wallet addresses, transaction IDs, communications",
        "Report to ASIC (Australia) or FMA (NZ)",
        "File a police report with all evidence",
        "Be cautious of 'recovery services'. Many are also scams."
      ],
      contacts: [
        { country: "Australia", provider: "ASIC", number: "asic.gov.au" },
        { country: "Australia", provider: "Scamwatch", number: "scamwatch.gov.au" },
        { country: "New Zealand", provider: "FMA", number: "fma.govt.nz" }
      ]
    },
    {
      id: "phishing",
      icon: Lock,
      title: "Phishing / Identity Theft",
      subtitle: "Email, SMS, or fake website scam",
      color: "blue",
      steps: [
        "Change your password immediately on all affected accounts",
        "Enable two-factor authentication (2FA) if available",
        "Check for unauthorized transactions and report them",
        "Contact IDCARE for identity theft support",
        "Report to ReportCyber or Netsafe"
      ],
      contacts: [
        { country: "Australia", provider: "IDCARE", number: "1800 595 160" },
        { country: "Australia", provider: "ReportCyber", number: "cyber.gov.au/report" },
        { country: "New Zealand", provider: "Netsafe", number: "0508 638 723" }
      ]
    },
    {
      id: "government",
      icon: Building2,
      title: "Government Impersonation",
      subtitle: "Fake ATO, Centrelink, or police calls",
      color: "purple",
      steps: [
        "Hang up immediately. Government agencies don't call demanding immediate payment",
        "Never pay via gift cards, wire transfer, or cryptocurrency",
        "Report to the real agency being impersonated",
        "Report to Scamwatch",
        "Block the number"
      ],
      contacts: [
        { country: "Australia", provider: "ATO", number: "ato.gov.au/scams" },
        { country: "Australia", provider: "Scamwatch", number: "scamwatch.gov.au" }
      ]
    }
  ]
};

const hotlinesByContinent: Record<string, { country: string; contacts: { name: string; number: string; type: string }[] }[]> = {
  "Africa": [
    { country: "Kenya", contacts: [
      { name: "Safaricom M-Pesa", number: "0722 002 222", type: "Mobile Money" },
      { name: "Kenya Police Cybercrime", number: "0800 723 253", type: "Cybercrime" },
      { name: "DCI Hotline", number: "0800 722 203", type: "Police" },
      { name: "Communications Authority", number: "+254 20 4242000", type: "Consumer" }
    ]},
    { country: "Nigeria", contacts: [
      { name: "EFCC", number: "+234 9 9044751", type: "Fraud" },
      { name: "NPF Cybercrime", number: "cybercrime@npf.gov.ng", type: "Cybercrime" },
      { name: "NITDA", number: "+234 9 4617500", type: "Cybercrime" },
      { name: "CBN Consumer Protection", number: "07002255226", type: "Banking" }
    ]},
    { country: "South Africa", contacts: [
      { name: "SAPS Crime Stop", number: "08600 10111", type: "Police" },
      { name: "FIC", number: "0800 223 322", type: "Financial Crime" },
      { name: "Banking Ombudsman", number: "0860 800 900", type: "Banking" },
      { name: "Hawks Hotline", number: "0800 701 701", type: "Fraud" }
    ]},
    { country: "Ghana", contacts: [
      { name: "Ghana Police CID", number: "18555", type: "Police" },
      { name: "Cyber Security Authority", number: "+233 302 500 500", type: "Cybercrime" },
      { name: "Bank of Ghana", number: "+233 302 666 174", type: "Banking" },
      { name: "EOCO", number: "+233 302 773 961", type: "Fraud" }
    ]},
    { country: "Uganda", contacts: [
      { name: "Uganda Police", number: "999 / 112", type: "Police" },
      { name: "MTN Uganda", number: "100", type: "Mobile Money" },
      { name: "Airtel Uganda", number: "100", type: "Mobile Money" },
      { name: "Bank of Uganda", number: "+256 414 258 441", type: "Banking" }
    ]},
    { country: "Tanzania", contacts: [
      { name: "Tanzania Police", number: "114 / 112", type: "Police" },
      { name: "Vodacom M-Pesa", number: "+255 754 100 100", type: "Mobile Money" },
      { name: "TCRA", number: "+255 22 219 9760", type: "Cybercrime" }
    ]},
    { country: "Rwanda", contacts: [
      { name: "Rwanda National Police", number: "112", type: "Police" },
      { name: "MTN Rwanda", number: "116", type: "Mobile Money" },
      { name: "Airtel Rwanda", number: "130", type: "Mobile Money" },
      { name: "RIB Hotline", number: "+250 788 311 551", type: "Fraud" }
    ]},
    { country: "Ethiopia", contacts: [
      { name: "Ethiopian Police", number: "991 / 911", type: "Police" },
      { name: "Ethio Telecom", number: "994", type: "Telecom" },
      { name: "CBE Support", number: "+251 11 551 1271", type: "Banking" }
    ]},
    { country: "Zambia", contacts: [
      { name: "Zambia Police", number: "999 / 911", type: "Police" },
      { name: "MTN Zambia", number: "151", type: "Mobile Money" },
      { name: "Airtel Money Zambia", number: "111", type: "Mobile Money" },
      { name: "Bank of Zambia", number: "+260 211 228 888", type: "Banking" }
    ]},
    { country: "Zimbabwe", contacts: [
      { name: "Zimbabwe Republic Police", number: "999 / 995", type: "Police" },
      { name: "EcoCash Support", number: "*151#", type: "Mobile Money" },
      { name: "Reserve Bank of Zimbabwe", number: "+263 242 703 000", type: "Banking" }
    ]},
    { country: "Senegal", contacts: [
      { name: "Police Secours", number: "17", type: "Police" },
      { name: "Orange Money Senegal", number: "8080", type: "Mobile Money" },
      { name: "BCEAO", number: "+221 33 839 05 00", type: "Banking" }
    ]},
    { country: "Ivory Coast", contacts: [
      { name: "Police Secours", number: "110 / 111", type: "Police" },
      { name: "MTN Côte d'Ivoire", number: "116", type: "Mobile Money" },
      { name: "Orange Money CI", number: "8080", type: "Mobile Money" }
    ]},
    { country: "Cameroon", contacts: [
      { name: "Cameroon Police", number: "117", type: "Police" },
      { name: "MTN Cameroon", number: "8787", type: "Mobile Money" },
      { name: "Orange Money Cameroon", number: "#150#", type: "Mobile Money" }
    ]},
    { country: "DR Congo", contacts: [
      { name: "Police Emergency", number: "112", type: "Police" },
      { name: "M-Pesa DRC", number: "*130#", type: "Mobile Money" },
      { name: "Airtel Money DRC", number: "*123#", type: "Mobile Money" }
    ]},
    { country: "Botswana", contacts: [
      { name: "Botswana Police", number: "999", type: "Police" },
      { name: "Orange Money Botswana", number: "123", type: "Mobile Money" },
      { name: "Bank of Botswana", number: "+267 360 6000", type: "Banking" }
    ]},
    { country: "Namibia", contacts: [
      { name: "Namibian Police", number: "10111", type: "Police" },
      { name: "MTC Namibia", number: "1 33", type: "Telecom" },
      { name: "Bank of Namibia", number: "+264 61 283 5111", type: "Banking" }
    ]},
    { country: "Malawi", contacts: [
      { name: "Malawi Police", number: "997 / 990", type: "Police" },
      { name: "Airtel Money Malawi", number: "1121", type: "Mobile Money" },
      { name: "TNM Mpamba", number: "909", type: "Mobile Money" }
    ]},
    { country: "Egypt", contacts: [
      { name: "Cyber Crime Unit", number: "+20 2 27921490", type: "Cybercrime" },
      { name: "Police Emergency", number: "122", type: "Police" },
      { name: "Consumer Protection", number: "19588", type: "Consumer" }
    ]},
    { country: "Morocco", contacts: [
      { name: "Royal Gendarmerie", number: "177", type: "Police" },
      { name: "Police Emergency", number: "19", type: "Police" },
      { name: "Bank Al-Maghrib", number: "+212 537 702 626", type: "Banking" }
    ]},
    { country: "Algeria", contacts: [
      { name: "Police Secours", number: "17 / 1548", type: "Police" },
      { name: "Gendarmerie", number: "1055", type: "Police" },
      { name: "Mobilis", number: "666", type: "Telecom" }
    ]},
    { country: "Tunisia", contacts: [
      { name: "Police Emergency", number: "197", type: "Police" },
      { name: "Consumer Protection", number: "1887", type: "Consumer" },
      { name: "Central Bank of Tunisia", number: "+216 71 254 000", type: "Banking" }
    ]}
  ],
  "North America": [
    { country: "United States", contacts: [
      { name: "FTC Fraud Report", number: "ReportFraud.ftc.gov", type: "Fraud" },
      { name: "FBI IC3", number: "ic3.gov", type: "Cybercrime" },
      { name: "Identity Theft", number: "IdentityTheft.gov", type: "Identity Theft" },
      { name: "FTC Phone", number: "1-877-382-4357", type: "Fraud" }
    ]},
    { country: "Canada", contacts: [
      { name: "Canadian Anti-Fraud Centre", number: "1-888-495-8501", type: "Fraud" },
      { name: "Cyber Centre", number: "cyber.gc.ca", type: "Cybercrime" },
      { name: "RCMP", number: "Non-emergency local", type: "Police" }
    ]},
    { country: "Mexico", contacts: [
      { name: "Policía Cibernética", number: "088", type: "Cybercrime" },
      { name: "CONDUSEF", number: "55 5340 0999", type: "Financial" },
      { name: "Emergency", number: "911", type: "Police" }
    ]}
  ],
  "Europe": [
    { country: "United Kingdom", contacts: [
      { name: "Action Fraud", number: "0300 123 2040", type: "Fraud" },
      { name: "Police (Non-Emergency)", number: "101", type: "Police" },
      { name: "Citizens Advice", number: "0800 144 8848", type: "Consumer" }
    ]},
    { country: "Germany", contacts: [
      { name: "Polizei Online", number: "online-strafanzeige.de", type: "Police" },
      { name: "BSI", number: "+49 228 99 9582 0", type: "Cybercrime" },
      { name: "Police Emergency", number: "110", type: "Police" }
    ]},
    { country: "France", contacts: [
      { name: "Pharos", number: "internet-signalement.gouv.fr", type: "Cybercrime" },
      { name: "Police Emergency", number: "17", type: "Police" },
      { name: "Info Escroqueries", number: "0 805 805 817", type: "Fraud" }
    ]},
    { country: "Netherlands", contacts: [
      { name: "Fraud Helpdesk", number: "0900-0345", type: "Fraud" },
      { name: "Police", number: "0900-8844", type: "Police" }
    ]},
    { country: "Spain", contacts: [
      { name: "Policía Nacional", number: "091", type: "Police" },
      { name: "Guardia Civil", number: "062", type: "Police" }
    ]}
  ],
  "Asia": [
    { country: "India", contacts: [
      { name: "Cyber Crime Portal", number: "cybercrime.gov.in", type: "Cybercrime" },
      { name: "National Cyber Crime", number: "1930", type: "Cybercrime" },
      { name: "Police Emergency", number: "100", type: "Police" }
    ]},
    { country: "Philippines", contacts: [
      { name: "PNP Anti-Cybercrime", number: "+63 2 8723 0401", type: "Cybercrime" },
      { name: "NBI Cybercrime", number: "+63 2 8525 8231", type: "Cybercrime" },
      { name: "Emergency", number: "911", type: "Police" }
    ]},
    { country: "Singapore", contacts: [
      { name: "Police Hotline", number: "1800-255-0000", type: "Police" },
      { name: "Anti-Scam Centre", number: "1800-722-6688", type: "Fraud" }
    ]},
    { country: "Malaysia", contacts: [
      { name: "MCMC", number: "1-800-888-030", type: "Cybercrime" },
      { name: "Police", number: "999", type: "Police" }
    ]},
    { country: "Japan", contacts: [
      { name: "Police", number: "110", type: "Police" },
      { name: "Consumer Affairs", number: "188", type: "Consumer" }
    ]}
  ],
  "Oceania": [
    { country: "Australia", contacts: [
      { name: "Scamwatch", number: "scamwatch.gov.au", type: "Fraud" },
      { name: "ReportCyber", number: "cyber.gov.au/report", type: "Cybercrime" },
      { name: "ACCC", number: "1300 302 502", type: "Consumer" }
    ]},
    { country: "New Zealand", contacts: [
      { name: "Netsafe", number: "0508 638 723", type: "Cybercrime" },
      { name: "Police", number: "105", type: "Police" }
    ]}
  ],
  "South America": [
    { country: "Brazil", contacts: [
      { name: "Polícia Federal", number: "pf.gov.br", type: "Police" },
      { name: "Procon", number: "151", type: "Consumer" },
      { name: "Emergency", number: "190", type: "Police" }
    ]},
    { country: "Argentina", contacts: [
      { name: "Policía Federal", number: "134", type: "Police" },
      { name: "Emergency", number: "911", type: "Police" }
    ]},
    { country: "Colombia", contacts: [
      { name: "CAI Virtual", number: "caivirtual.policia.gov.co", type: "Cybercrime" },
      { name: "Police", number: "123", type: "Police" }
    ]}
  ],
  "Global": [
    { country: "International", contacts: [
      { name: "INTERPOL", number: "interpol.int", type: "International" },
      { name: "Europol", number: "europol.europa.eu", type: "International" }
    ]}
  ]
};

const regionToContinentMap: Record<RegionKey, string[]> = {
  africa: ["Africa"],
  americas: ["North America", "South America"],
  europe: ["Europe"],
  asia: ["Asia"],
  oceania: ["Oceania"]
};

export default function EmergencyHelp() {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>("americas");
  const [expandedScam, setExpandedScam] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  useSEO({
    title: "Emergency Scam Help | GetCyberRight",
    description: "Been scammed? Get immediate help with recovery guides and emergency hotlines for 25+ countries. You are not alone.",
    keywords: "scam help, fraud recovery, mobile money scam, cyber crime report, emergency fraud hotline, FBI IC3, identity theft recovery"
  });

  const scamTypes = scamTypesByRegion[selectedRegion];
  const relevantContinents = regionToContinentMap[selectedRegion];
  const countriesForRegion = relevantContinents.flatMap(
    continent => hotlinesByContinent[continent] || []
  );
  const selectedCountryData = selectedCountry 
    ? countriesForRegion.find(c => c.country === selectedCountry) 
    : null;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-red-950 via-slate-900 to-slate-900 overflow-hidden">
      <TechPatternBg variant="pulse" />
      
      {/* Back Navigation */}
      <div className="bg-red-950/50 border-b border-red-900/50">
        <div className="container mx-auto px-4 py-3">
          <Link to="/protect" className="inline-flex items-center text-sm text-slate-400 hover:text-red-400 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Protect
          </Link>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-full mb-6">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">Emergency Help Center</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Been Scammed? <span className="text-red-400">We're Here to Help</span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-6">
              Take a deep breath. Follow the steps below to protect yourself and start recovery. 
              You are not alone, and this is not your fault.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-slate-300 text-sm">Act quickly. Time matters.</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
                <Shield className="h-4 w-4 text-teal-400" />
                <span className="text-slate-300 text-sm">Secure your accounts first</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
                <FileText className="h-4 w-4 text-blue-400" />
                <span className="text-slate-300 text-sm">Document everything</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <Card className="bg-slate-800/70 border-slate-700 max-w-3xl mx-auto">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-6 w-6 text-teal-400" />
                  <h2 className="text-lg font-semibold text-white">Select Your Region</h2>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  Choose your region to see scam types and emergency contacts relevant to where you are.
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(regionLabels) as RegionKey[]).map((region) => (
                    <button
                      key={region}
                      onClick={() => {
                        setSelectedRegion(region);
                        setExpandedScam(null);
                        setSelectedCountry("");
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedRegion === region
                          ? "bg-teal-500 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {regionLabels[region]}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              What Type of Scam Did You Experience?
            </h2>
            <p className="text-center text-slate-400 mb-6">
              Showing scam types common in <span className="text-teal-400 font-medium">{regionLabels[selectedRegion]}</span>
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {scamTypes.map((scam) => {
                const Icon = scam.icon;
                const isExpanded = expandedScam === scam.id;
                const colorClasses: Record<string, string> = {
                  orange: "border-orange-500/50 bg-orange-500/10",
                  red: "border-red-500/50 bg-red-500/10",
                  blue: "border-blue-500/50 bg-blue-500/10",
                  purple: "border-purple-500/50 bg-purple-500/10",
                  green: "border-green-500/50 bg-green-500/10",
                  teal: "border-teal-500/50 bg-teal-500/10"
                };
                const iconColors: Record<string, string> = {
                  orange: "text-orange-400",
                  red: "text-red-400",
                  blue: "text-blue-400",
                  purple: "text-purple-400",
                  green: "text-green-400",
                  teal: "text-teal-400"
                };
                
                return (
                  <button
                    key={scam.id}
                    onClick={() => setExpandedScam(isExpanded ? null : scam.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      isExpanded 
                        ? colorClasses[scam.color] 
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isExpanded ? colorClasses[scam.color] : "bg-slate-700"}`}>
                        <Icon className={`h-6 w-6 ${isExpanded ? iconColors[scam.color] : "text-slate-400"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{scam.title}</h3>
                        <p className="text-sm text-slate-400">{scam.subtitle}</p>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {expandedScam && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 md:p-8"
              >
                {(() => {
                  const scam = scamTypes.find(s => s.id === expandedScam);
                  if (!scam) return null;
                  const Icon = scam.icon;
                  const iconColors: Record<string, string> = {
                    orange: "text-orange-400",
                    red: "text-red-400",
                    blue: "text-blue-400",
                    purple: "text-purple-400",
                    green: "text-green-400",
                    teal: "text-teal-400"
                  };
                  
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-6">
                        <Icon className={`h-8 w-8 ${iconColors[scam.color]}`} />
                        <div>
                          <h3 className="text-xl font-bold text-white">{scam.title}</h3>
                          <p className="text-slate-400">{scam.subtitle}</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-teal-400" />
                          Recovery Steps (Do These Now)
                        </h4>
                        <ol className="space-y-3">
                          {scam.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 text-sm font-bold flex items-center justify-center">
                                {i + 1}
                              </span>
                              <span className="text-slate-300">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Phone className="h-5 w-5 text-amber-400" />
                          Emergency Contacts
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {scam.contacts.map((contact, i) => (
                            <div key={i} className="bg-slate-700/50 rounded-lg p-3">
                              <div className="text-xs text-slate-400 mb-1">{contact.country}</div>
                              <div className="text-white font-medium">{contact.provider}</div>
                              <div className="text-teal-400 text-sm">{contact.number}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-800/70 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="h-6 w-6 text-teal-400" />
                  Emergency Hotlines in {regionLabels[selectedRegion]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-2">Select Your Country</label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-full max-w-md bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Choose a country..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 max-h-[300px]">
                      {countriesForRegion.map(countryData => (
                        <SelectItem 
                          key={countryData.country} 
                          value={countryData.country}
                          className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                        >
                          {countryData.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-2">
                    {countriesForRegion.length} countries available in {regionLabels[selectedRegion]}
                  </p>
                </div>

                {selectedCountryData ? (
                  <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Phone className="h-5 w-5 text-amber-400" />
                      {selectedCountryData.country} Emergency Contacts
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedCountryData.contacts.map((contact, i) => (
                        <div key={i} className="bg-slate-800/80 rounded-lg p-4 hover:bg-slate-700/80 transition-colors">
                          <div className="text-xs text-slate-400 mb-1">{contact.type}</div>
                          <div className="text-white font-medium mb-1">{contact.name}</div>
                          <div className="text-teal-400 font-mono text-sm">{contact.number}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Select a country from the dropdown to see emergency contacts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Emotional Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-purple-500/30">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Heart className="h-10 w-10 text-purple-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">It's Not Your Fault</h3>
                    <p className="text-purple-200 text-lg">
                      Being scammed is a traumatic experience. The shame and embarrassment you might feel is normal, but remember, you are the victim here, not the one who did something wrong.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-slate-800/50 rounded-xl p-5">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-purple-400" />
                      What You Might Be Feeling
                    </h4>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>• Shame or embarrassment: "How could I fall for this?"</li>
                      <li>• Anger at yourself or the scammer</li>
                      <li>• Fear of telling family members</li>
                      <li>• Anxiety about finances</li>
                      <li>• Difficulty sleeping or concentrating</li>
                    </ul>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-5">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-teal-400" />
                      Remember This
                    </h4>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>• Scammers are professionals who do this full-time</li>
                      <li>• Even tech experts and educated people get scammed</li>
                      <li>• Reporting helps protect others from the same scam</li>
                      <li>• You can recover from this, financially and emotionally</li>
                      <li>• Talking to someone you trust can help</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-500/30">
                  <h4 className="font-semibold text-white mb-3">If You Need Someone to Talk To</h4>
                  <p className="text-purple-200 text-sm mb-4">
                    The emotional impact of being scammed can be significant. Consider reaching out:
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-purple-300 font-medium">Trusted Family Member</div>
                      <div className="text-slate-400">Share what happened without judgment</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-purple-300 font-medium">Local Counselor</div>
                      <div className="text-slate-400">Professional support for trauma</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-purple-300 font-medium">Support Groups</div>
                      <div className="text-slate-400">Connect with others who understand</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-teal-900/50 to-blue-900/50 border border-teal-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Need More Help?</h3>
              <p className="text-slate-300 mb-6 max-w-xl mx-auto">
                Check a suspicious message or link with our AI-powered Scam Checker, 
                or learn how to protect yourself and your family from future scams.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/scam-checker">
                  <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white">
                    <Shield className="mr-2 h-5 w-5" />
                    Check a Scam
                  </Button>
                </Link>
                <Link href="/youth-safety">
                  <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                    Youth Safety Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/senior-safety">
                  <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                    Senior Safety Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
