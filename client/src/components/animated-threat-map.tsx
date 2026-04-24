"use client";

import { useState, useEffect, memo } from "react";
// @ts-ignore - react-simple-maps types loaded at runtime
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, AlertTriangle, X, TrendingUp, Users, Phone, Mail, Globe, ExternalLink } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CountryRiskData {
  name: string;
  riskLevel: "high" | "medium" | "low";
  riskScore: number;
  topThreats: string[];
  recentIncidents: number;
  targetedGroups: string[];
  tips: string[];
  reportContact?: string;
  source?: { name: string; url: string };
}

const countryRiskData: Record<string, CountryRiskData> = {
  "United States": {
    name: "United States",
    riskLevel: "high",
    riskScore: 78,
    topThreats: ["Ransomware", "Phishing", "Identity Theft", "BEC Scams"],
    recentIncidents: 1247,
    targetedGroups: ["Seniors (65+)", "Small Businesses", "Healthcare"],
    tips: [
      "Enable multi-factor authentication on all accounts",
      "Be wary of IRS or Social Security scam calls",
      "Report fraud to FTC at reportfraud.ftc.gov"
    ],
    reportContact: "FBI IC3: ic3.gov",
    source: { name: "FBI IC3 Annual Report", url: "https://www.ic3.gov" }
  },
  "Brazil": {
    name: "Brazil",
    riskLevel: "medium",
    riskScore: 62,
    topThreats: ["Banking Trojans", "WhatsApp Scams", "PIX Fraud", "Phishing"],
    recentIncidents: 523,
    targetedGroups: ["Mobile Banking Users", "WhatsApp Users", "E-commerce Shoppers"],
    tips: [
      "Never share PIX keys with strangers",
      "Verify WhatsApp messages from 'family' before sending money",
      "Use official banking apps only"
    ],
    reportContact: "CERT.br: cert.br",
    source: { name: "CERT.br Statistics", url: "https://www.cert.br" }
  },
  "United Kingdom": {
    name: "United Kingdom",
    riskLevel: "medium",
    riskScore: 58,
    topThreats: ["Phishing", "Investment Scams", "Romance Fraud", "Impersonation"],
    recentIncidents: 412,
    targetedGroups: ["Seniors", "Online Investors", "Dating App Users"],
    tips: [
      "HMRC will never call demanding immediate payment",
      "Verify investment opportunities with FCA register",
      "Report scams to Action Fraud"
    ],
    reportContact: "Action Fraud: actionfraud.police.uk",
    source: { name: "Action Fraud UK Reports", url: "https://www.actionfraud.police.uk" }
  },
  "Germany": {
    name: "Germany",
    riskLevel: "medium",
    riskScore: 55,
    topThreats: ["Phishing", "Ransomware", "CEO Fraud", "Fake Shops"],
    recentIncidents: 389,
    targetedGroups: ["SMEs", "Manufacturing Sector", "Online Shoppers"],
    tips: [
      "Watch for fake package delivery notifications",
      "Verify wire transfer requests by phone",
      "Check online shops for Trusted Shops seal"
    ],
    reportContact: "BSI: bsi.bund.de",
    source: { name: "BSI Germany", url: "https://www.bsi.bund.de" }
  },
  "Nigeria": {
    name: "Nigeria",
    riskLevel: "high",
    riskScore: 82,
    topThreats: ["Mobile Money Fraud", "SIM Swap", "Romance Scams", "Fake Jobs"],
    recentIncidents: 876,
    targetedGroups: ["Mobile Money Users", "Job Seekers", "Youth"],
    tips: [
      "Never share your OTP or PIN with anyone",
      "Verify job offers directly with companies",
      "Be cautious of 'too good to be true' offers"
    ],
    reportContact: "EFCC: efcc.gov.ng",
    source: { name: "INTERPOL Africa", url: "https://www.interpol.int/Crimes/Cybercrime" }
  },
  "Kenya": {
    name: "Kenya",
    riskLevel: "high",
    riskScore: 79,
    topThreats: ["M-Pesa Fraud", "SIM Swap", "Fake Loans", "WhatsApp Scams"],
    recentIncidents: 654,
    targetedGroups: ["M-Pesa Users", "Seniors", "Small Business Owners"],
    tips: [
      "Safaricom will never ask for your M-Pesa PIN",
      "Dial *100# to check unauthorized transactions",
      "Report fraud to 0800 723 723 (toll-free)"
    ],
    reportContact: "Safaricom: 0800 723 723",
    source: { name: "CA Kenya", url: "https://www.ca.go.ke" }
  },
  "India": {
    name: "India",
    riskLevel: "high",
    riskScore: 85,
    topThreats: ["UPI Fraud", "KYC Scams", "Fake Tech Support", "Job Fraud"],
    recentIncidents: 1532,
    targetedGroups: ["UPI Users", "Seniors", "Job Seekers", "Rural Users"],
    tips: [
      "Never share UPI PIN or OTP with anyone",
      "Banks never ask for KYC updates via links",
      "Report cyber fraud at cybercrime.gov.in"
    ],
    reportContact: "Cyber Crime Portal: cybercrime.gov.in",
    source: { name: "CERT-In", url: "https://www.cert-in.org.in" }
  },
  "China": {
    name: "China",
    riskLevel: "high",
    riskScore: 88,
    topThreats: ["Telecom Fraud", "Investment Scams", "E-commerce Fraud", "Loan Apps"],
    recentIncidents: 2103,
    targetedGroups: ["WeChat Users", "Online Investors", "Seniors"],
    tips: [
      "Verify callers claiming to be from police/banks",
      "Be cautious of high-return investment promises",
      "Use only official app stores for downloads"
    ],
    reportContact: "Report at: 12321.cn",
    source: { name: "CNCERT/CC", url: "https://www.cert.org.cn" }
  },
  "Japan": {
    name: "Japan",
    riskLevel: "medium",
    riskScore: 52,
    topThreats: ["Phishing", "Ransomware", "Ore-Ore Scams", "Romance Fraud"],
    recentIncidents: 445,
    targetedGroups: ["Seniors", "Corporations", "Small Businesses"],
    tips: [
      "Be wary of calls from 'family' asking for money",
      "Verify emails claiming to be from banks",
      "Report scams to local police"
    ],
    reportContact: "IPA: ipa.go.jp",
    source: { name: "IPA Japan", url: "https://www.ipa.go.jp" }
  },
  "Australia": {
    name: "Australia",
    riskLevel: "medium",
    riskScore: 54,
    topThreats: ["Phishing", "Investment Scams", "Remote Access Scams", "Identity Theft"],
    recentIncidents: 312,
    targetedGroups: ["Seniors", "Online Investors", "Small Business Owners"],
    tips: [
      "Hang up on unsolicited tech support calls",
      "Check ASIC's investor alert list before investing",
      "Report scams to Scamwatch"
    ],
    reportContact: "Scamwatch: scamwatch.gov.au",
    source: { name: "Scamwatch Australia", url: "https://www.scamwatch.gov.au" }
  },
  "South Africa": {
    name: "South Africa",
    riskLevel: "high",
    riskScore: 76,
    topThreats: ["Banking Fraud", "SIM Swap", "Phishing", "Investment Scams"],
    recentIncidents: 298,
    targetedGroups: ["Banking Customers", "Seniors", "Small Businesses"],
    tips: [
      "Never share banking PINs or OTPs",
      "Call your bank if you lose signal unexpectedly",
      "Verify investment opportunities with FSCA"
    ],
    reportContact: "SABRIC: sabric.co.za",
    source: { name: "SABRIC", url: "https://www.sabric.co.za" }
  },
  "Russia": {
    name: "Russia",
    riskLevel: "high",
    riskScore: 81,
    topThreats: ["Telecom Fraud", "Ransomware", "Banking Trojans", "Social Engineering"],
    recentIncidents: 1876,
    targetedGroups: ["Banking Users", "Corporations", "Government"],
    tips: [
      "Verify calls from banks through official numbers",
      "Be cautious of urgent payment requests",
      "Use strong passwords and 2FA"
    ],
    source: { name: "INTERPOL", url: "https://www.interpol.int/Crimes/Cybercrime" }
  },
  "Ghana": {
    name: "Ghana",
    riskLevel: "high",
    riskScore: 75,
    topThreats: ["Mobile Money Fraud", "Romance Scams", "Fake Jobs", "Lottery Scams"],
    recentIncidents: 432,
    targetedGroups: ["Mobile Money Users", "Youth", "Job Seekers"],
    tips: [
      "Never share MTN MoMo PIN with anyone",
      "Verify lottery wins directly - you can't win what you didn't enter",
      "Be cautious of online relationships asking for money"
    ],
    reportContact: "Ghana Police CID: 191",
    source: { name: "INTERPOL Africa", url: "https://www.interpol.int/Crimes/Cybercrime" }
  },
  "Uganda": {
    name: "Uganda",
    riskLevel: "high",
    riskScore: 73,
    topThreats: ["Mobile Money Fraud", "SIM Swap", "Fake Loans", "Investment Scams"],
    recentIncidents: 387,
    targetedGroups: ["MTN/Airtel Money Users", "Small Traders", "Seniors"],
    tips: [
      "Never share your Mobile Money PIN",
      "Be wary of 'guaranteed returns' investment offers",
      "Report fraud to your telecom provider immediately"
    ],
    reportContact: "Uganda Police: 999"
  },
  "Tanzania": {
    name: "Tanzania",
    riskLevel: "high",
    riskScore: 71,
    topThreats: ["M-Pesa/Tigo Pesa Fraud", "SIM Swap", "Fake Loans", "WhatsApp Scams"],
    recentIncidents: 356,
    targetedGroups: ["Mobile Money Users", "Small Business Owners", "Rural Communities"],
    tips: [
      "Never give out OTPs received via SMS",
      "Verify loan offers through official bank channels",
      "Be cautious of 'urgent family emergency' messages"
    ],
    reportContact: "Tanzania Police: 112"
  },
  "Ethiopia": {
    name: "Ethiopia",
    riskLevel: "medium",
    riskScore: 65,
    topThreats: ["Telebirr Fraud", "Phishing", "Fake Jobs", "Investment Scams"],
    recentIncidents: 289,
    targetedGroups: ["Telebirr Users", "Diaspora", "Youth"],
    tips: [
      "Never share Telebirr PIN or OTP",
      "Verify job offers through official company websites",
      "Be cautious of diaspora-targeted investment schemes"
    ],
    reportContact: "Ethiopia Police: 991"
  },
  "Rwanda": {
    name: "Rwanda",
    riskLevel: "medium",
    riskScore: 58,
    topThreats: ["Mobile Money Fraud", "Phishing", "Online Shopping Scams", "BEC"],
    recentIncidents: 178,
    targetedGroups: ["MTN/Airtel Money Users", "Businesses", "Online Shoppers"],
    tips: [
      "Verify sender identity before transfers",
      "Use official apps for mobile money",
      "Report suspicious activity to your bank"
    ],
    reportContact: "Rwanda Police: 112"
  },
  "Cameroon": {
    name: "Cameroon",
    riskLevel: "high",
    riskScore: 72,
    topThreats: ["Mobile Money Fraud", "Romance Scams", "Fake Visas", "Lottery Scams"],
    recentIncidents: 345,
    targetedGroups: ["Orange/MTN Money Users", "Youth Seeking Travel", "Seniors"],
    tips: [
      "Never pay for visa processing through unofficial channels",
      "Verify lottery wins - real lotteries don't ask for fees",
      "Be cautious of online relationships"
    ],
    reportContact: "Cameroon Police: 117"
  },
  "Egypt": {
    name: "Egypt",
    riskLevel: "medium",
    riskScore: 63,
    topThreats: ["Phishing", "Banking Fraud", "E-commerce Scams", "Investment Fraud"],
    recentIncidents: 412,
    targetedGroups: ["Online Shoppers", "Banking Customers", "Youth"],
    tips: [
      "Verify banking emails through official channels",
      "Use trusted e-commerce platforms only",
      "Never share OTPs with anyone"
    ],
    reportContact: "Egypt CERT: egcert.eg"
  },
  "Morocco": {
    name: "Morocco",
    riskLevel: "medium",
    riskScore: 56,
    topThreats: ["Phishing", "E-commerce Fraud", "Investment Scams", "Social Media Hacking"],
    recentIncidents: 234,
    targetedGroups: ["Online Shoppers", "Social Media Users", "Small Businesses"],
    tips: [
      "Use strong, unique passwords for each account",
      "Verify online sellers before purchasing",
      "Enable two-factor authentication"
    ],
    reportContact: "Morocco DGSN: 19"
  },
  "France": {
    name: "France",
    riskLevel: "medium",
    riskScore: 54,
    topThreats: ["Phishing", "Ransomware", "CEO Fraud", "Tech Support Scams"],
    recentIncidents: 378,
    targetedGroups: ["Seniors", "SMEs", "Healthcare Sector"],
    tips: [
      "Government agencies never ask for payment via gift cards",
      "Verify unexpected invoices by phone",
      "Report scams to Signal-Spam"
    ],
    reportContact: "Cybermalveillance.gouv.fr",
    source: { name: "ENISA", url: "https://www.enisa.europa.eu" }
  },
  "Spain": {
    name: "Spain",
    riskLevel: "medium",
    riskScore: 52,
    topThreats: ["Phishing", "SMS Fraud (Smishing)", "Investment Scams", "Rental Fraud"],
    recentIncidents: 298,
    targetedGroups: ["Tourists", "Online Investors", "Renters"],
    tips: [
      "Verify rental listings before paying deposits",
      "Banks never ask for full credentials via SMS",
      "Report fraud to Policia Nacional"
    ],
    reportContact: "Policia Nacional: 091",
    source: { name: "ENISA", url: "https://www.enisa.europa.eu" }
  },
  "Italy": {
    name: "Italy",
    riskLevel: "medium",
    riskScore: 53,
    topThreats: ["Phishing", "SIM Swap", "E-commerce Fraud", "Invoice Fraud"],
    recentIncidents: 312,
    targetedGroups: ["Businesses", "Online Shoppers", "Seniors"],
    tips: [
      "Verify payment requests through known contacts",
      "Check seller reviews before online purchases",
      "Report cyber incidents to Polizia Postale"
    ],
    reportContact: "Polizia Postale: commissariatodips.it",
    source: { name: "ENISA", url: "https://www.enisa.europa.eu" }
  },
  "Canada": {
    name: "Canada",
    riskLevel: "medium",
    riskScore: 56,
    topThreats: ["Phishing", "Romance Scams", "CRA Impersonation", "Investment Fraud"],
    recentIncidents: 423,
    targetedGroups: ["Seniors", "New Immigrants", "Online Investors"],
    tips: [
      "CRA never demands immediate payment via gift cards",
      "Verify investment advisors through provincial securities",
      "Report scams to Canadian Anti-Fraud Centre"
    ],
    reportContact: "CAFC: 1-888-495-8501"
  },
  "Mexico": {
    name: "Mexico",
    riskLevel: "high",
    riskScore: 68,
    topThreats: ["Banking Fraud", "SIM Swap", "Extortion Calls", "E-commerce Fraud"],
    recentIncidents: 534,
    targetedGroups: ["Banking Customers", "Business Owners", "Online Shoppers"],
    tips: [
      "Never share banking tokens or passwords",
      "Hang up on callers claiming kidnapping",
      "Verify online sellers before payment"
    ],
    reportContact: "CONDUSEF: 800-999-8080"
  },
  "Argentina": {
    name: "Argentina",
    riskLevel: "medium",
    riskScore: 61,
    topThreats: ["Banking Trojans", "WhatsApp Scams", "Phishing", "SIM Swap"],
    recentIncidents: 312,
    targetedGroups: ["Banking Users", "WhatsApp Users", "Seniors"],
    tips: [
      "Banks never ask for passwords via phone",
      "Verify WhatsApp requests for money in person",
      "Use banking apps from official stores only"
    ],
    reportContact: "Fiscalia: 0800-333-4767"
  },
  "Indonesia": {
    name: "Indonesia",
    riskLevel: "high",
    riskScore: 74,
    topThreats: ["E-wallet Fraud", "Loan App Scams", "Phishing", "Investment Fraud"],
    recentIncidents: 678,
    targetedGroups: ["E-wallet Users", "Youth", "Small Business Owners"],
    tips: [
      "Only use OJK-registered loan apps",
      "Never share OTP with anyone",
      "Report illegal loan apps to OJK"
    ],
    reportContact: "OJK: 157"
  },
  "Philippines": {
    name: "Philippines",
    riskLevel: "high",
    riskScore: 72,
    topThreats: ["GCash/Maya Fraud", "Text Scams", "Romance Fraud", "Job Scams"],
    recentIncidents: 534,
    targetedGroups: ["E-wallet Users", "OFWs", "Job Seekers"],
    tips: [
      "Never share GCash MPIN with anyone",
      "Verify overseas job offers through POEA",
      "Report text scams by forwarding to 7726"
    ],
    reportContact: "NBI Cybercrime: (02) 8523-8231"
  },
  "Thailand": {
    name: "Thailand",
    riskLevel: "medium",
    riskScore: 64,
    topThreats: ["Call Center Scams", "Romance Fraud", "Phishing", "Investment Scams"],
    recentIncidents: 423,
    targetedGroups: ["Seniors", "Expats", "Online Daters"],
    tips: [
      "Police never demand payment over phone",
      "Verify investment offers through SEC Thailand",
      "Be cautious of romantic interests asking for money"
    ],
    reportContact: "Thai Police: 1599"
  },
  "Vietnam": {
    name: "Vietnam",
    riskLevel: "medium",
    riskScore: 66,
    topThreats: ["Banking Fraud", "Phishing", "E-commerce Scams", "Fake Apps"],
    recentIncidents: 445,
    targetedGroups: ["Banking Customers", "Online Shoppers", "Youth"],
    tips: [
      "Only download apps from official stores",
      "Verify bank messages through official hotlines",
      "Check seller ratings before online purchases"
    ],
    reportContact: "Vietnam CERT: vncert.vn"
  },
  "Pakistan": {
    name: "Pakistan",
    riskLevel: "high",
    riskScore: 71,
    topThreats: ["Mobile Wallet Fraud", "Phishing", "Prize Scams", "Job Fraud"],
    recentIncidents: 512,
    targetedGroups: ["JazzCash/Easypaisa Users", "Youth", "Overseas Pakistanis"],
    tips: [
      "Never share mobile wallet PINs",
      "Verify prize wins through official channels",
      "Report cyber crimes to FIA"
    ],
    reportContact: "FIA Cyber Crime: 9911"
  },
  "Bangladesh": {
    name: "Bangladesh",
    riskLevel: "high",
    riskScore: 69,
    topThreats: ["bKash Fraud", "Phishing", "Lottery Scams", "Job Fraud"],
    recentIncidents: 467,
    targetedGroups: ["bKash/Nagad Users", "Garment Workers", "Youth"],
    tips: [
      "Never share bKash PIN with anyone",
      "Verify job offers through official company websites",
      "Report fraud to Bangladesh Bank"
    ],
    reportContact: "Bangladesh Police: 999"
  },
  "Saudi Arabia": {
    name: "Saudi Arabia",
    riskLevel: "medium",
    riskScore: 58,
    topThreats: ["Phishing", "Investment Scams", "Employment Fraud", "E-commerce Fraud"],
    recentIncidents: 289,
    targetedGroups: ["Expat Workers", "Online Investors", "Job Seekers"],
    tips: [
      "Verify job offers through official Saudi channels",
      "Never pay recruitment fees upfront",
      "Report scams to Saudi CERT"
    ],
    reportContact: "Saudi CERT: cert.gov.sa"
  },
  "UAE": {
    name: "UAE",
    riskLevel: "medium",
    riskScore: 55,
    topThreats: ["Phishing", "Investment Scams", "Employment Fraud", "Lottery Scams"],
    recentIncidents: 234,
    targetedGroups: ["Expats", "Businesses", "Job Seekers"],
    tips: [
      "Dubai Police never asks for payment via calls",
      "Verify investments through SCA",
      "Report cyber crimes through eCrime portal"
    ],
    reportContact: "Dubai Police eCrime: ecrime.ae"
  },
  "Turkey": {
    name: "Turkey",
    riskLevel: "medium",
    riskScore: 62,
    topThreats: ["Banking Fraud", "Phishing", "E-commerce Scams", "Social Media Hacking"],
    recentIncidents: 378,
    targetedGroups: ["Banking Customers", "Social Media Users", "Online Shoppers"],
    tips: [
      "Banks never ask for full credentials via phone",
      "Use strong passwords for social media",
      "Verify online sellers before purchasing"
    ],
    reportContact: "BTK: ihbarweb.org.tr"
  },
  "Poland": {
    name: "Poland",
    riskLevel: "medium",
    riskScore: 51,
    topThreats: ["Phishing", "Ransomware", "Invoice Fraud", "Tech Support Scams"],
    recentIncidents: 234,
    targetedGroups: ["Businesses", "Seniors", "Online Shoppers"],
    tips: [
      "Verify unexpected invoices through known contacts",
      "Never give remote access to unknown callers",
      "Report cyber incidents to CERT Polska"
    ],
    reportContact: "CERT Polska: cert.pl"
  },
  "Netherlands": {
    name: "Netherlands",
    riskLevel: "medium",
    riskScore: 49,
    topThreats: ["Phishing", "Marketplace Fraud", "CEO Fraud", "Smishing"],
    recentIncidents: 198,
    targetedGroups: ["Online Shoppers", "Businesses", "Seniors"],
    tips: [
      "Verify Marktplaats sellers before paying",
      "Banks never ask for full credentials via SMS",
      "Report fraud to Fraudehelpdesk"
    ],
    reportContact: "Fraudehelpdesk: 0888-786244"
  },
  "Sweden": {
    name: "Sweden",
    riskLevel: "low",
    riskScore: 42,
    topThreats: ["Phishing", "Swish Fraud", "Investment Scams", "Tech Support Scams"],
    recentIncidents: 156,
    targetedGroups: ["Seniors", "Online Investors", "Swish Users"],
    tips: [
      "Never approve Swish requests you didn't initiate",
      "Verify investments through Finansinspektionen",
      "Report scams to Polisen"
    ],
    reportContact: "Polisen: 114 14"
  },
  "New Zealand": {
    name: "New Zealand",
    riskLevel: "low",
    riskScore: 45,
    topThreats: ["Phishing", "Investment Scams", "Remote Access Scams", "Romance Fraud"],
    recentIncidents: 134,
    targetedGroups: ["Seniors", "Online Investors", "Small Businesses"],
    tips: [
      "IRD never demands immediate payment",
      "Verify investments through FMA",
      "Report scams to Netsafe"
    ],
    reportContact: "Netsafe: netsafe.org.nz"
  },
  "Singapore": {
    name: "Singapore",
    riskLevel: "medium",
    riskScore: 48,
    topThreats: ["Phishing", "Job Scams", "E-commerce Fraud", "Investment Scams"],
    recentIncidents: 267,
    targetedGroups: ["Job Seekers", "Online Shoppers", "Seniors"],
    tips: [
      "Verify job offers through MOM",
      "Never share OTPs or banking credentials",
      "Report scams to ScamShield app"
    ],
    reportContact: "Police: 1800-255-0000"
  },
  "Malaysia": {
    name: "Malaysia",
    riskLevel: "high",
    riskScore: 67,
    topThreats: ["Macau Scams", "Love Scams", "E-wallet Fraud", "Loan Scams"],
    recentIncidents: 456,
    targetedGroups: ["Seniors", "Online Daters", "E-wallet Users"],
    tips: [
      "Police/Bank Negara never ask for money transfers",
      "Verify romantic partners before sending money",
      "Report scams to PDRM"
    ],
    reportContact: "PDRM: 03-2610 1599"
  },
  "South Korea": {
    name: "South Korea",
    riskLevel: "medium",
    riskScore: 52,
    topThreats: ["Voice Phishing", "Smishing", "Romance Scams", "Crypto Fraud"],
    recentIncidents: 312,
    targetedGroups: ["Seniors", "Crypto Investors", "Youth"],
    tips: [
      "Government never requests money transfers via phone",
      "Verify crypto platforms through FSC",
      "Report scams to KISA"
    ],
    reportContact: "KISA: 118"
  },
  "Colombia": {
    name: "Colombia",
    riskLevel: "medium",
    riskScore: 64,
    topThreats: ["Banking Fraud", "SIM Swap", "WhatsApp Scams", "Extortion"],
    recentIncidents: 345,
    targetedGroups: ["Banking Users", "WhatsApp Users", "Business Owners"],
    tips: [
      "Never share banking tokens via phone",
      "Verify 'family emergency' calls directly",
      "Report to CAI Virtual"
    ],
    reportContact: "CAI Virtual: caivirtual.policia.gov.co"
  },
  "Chile": {
    name: "Chile",
    riskLevel: "medium",
    riskScore: 58,
    topThreats: ["Phishing", "Banking Fraud", "E-commerce Scams", "SIM Swap"],
    recentIncidents: 234,
    targetedGroups: ["Banking Customers", "Online Shoppers", "Seniors"],
    tips: [
      "Banks never ask for full credentials",
      "Verify online sellers before purchasing",
      "Report to PDI Cibercrimen"
    ],
    reportContact: "PDI: 134"
  },
  "Peru": {
    name: "Peru",
    riskLevel: "medium",
    riskScore: 62,
    topThreats: ["Banking Fraud", "Phishing", "Yape/Plin Fraud", "SIM Swap"],
    recentIncidents: 289,
    targetedGroups: ["Mobile Wallet Users", "Banking Customers", "SMEs"],
    tips: [
      "Never share Yape/Plin codes with anyone",
      "Verify unexpected payment requests",
      "Report to DIVINDAT"
    ],
    reportContact: "PNP DIVINDAT: (01) 431-8898"
  },
  "Venezuela": {
    name: "Venezuela",
    riskLevel: "high",
    riskScore: 71,
    topThreats: ["Banking Fraud", "WhatsApp Scams", "Crypto Scams", "Extortion"],
    recentIncidents: 312,
    targetedGroups: ["Banking Users", "Diaspora", "Crypto Users"],
    tips: [
      "Verify bank messages through official channels",
      "Be cautious of crypto 'investment opportunities'",
      "Never share banking credentials"
    ],
    reportContact: "CICPC: 0800-CICPC-00"
  },
  "Ecuador": {
    name: "Ecuador",
    riskLevel: "medium",
    riskScore: 59,
    topThreats: ["Banking Fraud", "Phishing", "SIM Swap", "E-commerce Fraud"],
    recentIncidents: 198,
    targetedGroups: ["Banking Customers", "Online Shoppers", "Seniors"],
    tips: [
      "Banks never call asking for passwords",
      "Verify online sellers before purchasing",
      "Report to Fiscalia"
    ],
    reportContact: "Fiscalia: 1800-335000"
  },
  "Ireland": {
    name: "Ireland",
    riskLevel: "medium",
    riskScore: 48,
    topThreats: ["Phishing", "Smishing", "Investment Scams", "Romance Fraud"],
    recentIncidents: 167,
    targetedGroups: ["Seniors", "Online Investors", "Banking Customers"],
    tips: [
      "Revenue never demands payment via text",
      "Verify investments through Central Bank register",
      "Report to Garda National Cyber Crime Bureau"
    ],
    reportContact: "Garda: garda.ie"
  },
  "Portugal": {
    name: "Portugal",
    riskLevel: "medium",
    riskScore: 47,
    topThreats: ["Phishing", "MB Way Fraud", "Investment Scams", "E-commerce Fraud"],
    recentIncidents: 156,
    targetedGroups: ["MB Way Users", "Online Shoppers", "Seniors"],
    tips: [
      "Never share MB Way codes with strangers",
      "Verify online sellers before purchasing",
      "Report to PSP or GNR"
    ],
    reportContact: "PSP: 112"
  },
  "Belgium": {
    name: "Belgium",
    riskLevel: "medium",
    riskScore: 46,
    topThreats: ["Phishing", "CEO Fraud", "Smishing", "Investment Scams"],
    recentIncidents: 145,
    targetedGroups: ["Businesses", "Seniors", "Banking Customers"],
    tips: [
      "Verify unexpected payment requests by phone",
      "Banks never ask for card reader codes via email",
      "Report to safeonweb.be"
    ],
    reportContact: "Safe on Web: safeonweb.be"
  },
  "Austria": {
    name: "Austria",
    riskLevel: "low",
    riskScore: 44,
    topThreats: ["Phishing", "Invoice Fraud", "Tech Support Scams", "Ransomware"],
    recentIncidents: 123,
    targetedGroups: ["Businesses", "Seniors", "SMEs"],
    tips: [
      "Verify invoice changes through known contacts",
      "Never give remote access to unknown callers",
      "Report to Bundeskriminalamt"
    ],
    reportContact: "BK: bundeskriminalamt.at"
  },
  "Switzerland": {
    name: "Switzerland",
    riskLevel: "low",
    riskScore: 42,
    topThreats: ["Phishing", "Investment Scams", "CEO Fraud", "Romance Fraud"],
    recentIncidents: 134,
    targetedGroups: ["Businesses", "High-net-worth Individuals", "Seniors"],
    tips: [
      "Verify investment advisors through FINMA",
      "Be cautious of unsolicited investment offers",
      "Report to NCSC"
    ],
    reportContact: "NCSC: ncsc.admin.ch"
  },
  "Norway": {
    name: "Norway",
    riskLevel: "low",
    riskScore: 41,
    topThreats: ["Phishing", "Vipps Fraud", "Investment Scams", "Romance Fraud"],
    recentIncidents: 112,
    targetedGroups: ["Vipps Users", "Online Investors", "Seniors"],
    tips: [
      "Never approve Vipps requests you didn't initiate",
      "Verify investments through Finanstilsynet",
      "Report to Politiet"
    ],
    reportContact: "Politiet: 02800"
  },
  "Denmark": {
    name: "Denmark",
    riskLevel: "low",
    riskScore: 43,
    topThreats: ["Phishing", "MobilePay Fraud", "Smishing", "Investment Scams"],
    recentIncidents: 118,
    targetedGroups: ["MobilePay Users", "Seniors", "Businesses"],
    tips: [
      "Never share NemID/MitID credentials",
      "Verify payment requests through known contacts",
      "Report to Politi"
    ],
    reportContact: "Politi: 114"
  },
  "Finland": {
    name: "Finland",
    riskLevel: "low",
    riskScore: 40,
    topThreats: ["Phishing", "Investment Scams", "Romance Fraud", "CEO Fraud"],
    recentIncidents: 98,
    targetedGroups: ["Seniors", "Businesses", "Online Investors"],
    tips: [
      "Banks never ask for online banking codes via phone",
      "Verify investments through Finanssivalvonta",
      "Report to Poliisi"
    ],
    reportContact: "Poliisi: 112"
  },
  "Greece": {
    name: "Greece",
    riskLevel: "medium",
    riskScore: 51,
    topThreats: ["Phishing", "E-commerce Fraud", "Investment Scams", "SIM Swap"],
    recentIncidents: 187,
    targetedGroups: ["Online Shoppers", "Banking Customers", "Seniors"],
    tips: [
      "Verify online sellers before purchasing",
      "Banks never ask for full credentials via phone",
      "Report to Hellenic Police Cyber Crime Division"
    ],
    reportContact: "Cyber Crime: 11188"
  },
  "Czech Republic": {
    name: "Czech Republic",
    riskLevel: "medium",
    riskScore: 48,
    topThreats: ["Phishing", "Vishing", "E-commerce Fraud", "Ransomware"],
    recentIncidents: 156,
    targetedGroups: ["Online Shoppers", "Businesses", "Seniors"],
    tips: [
      "Verify callers claiming to be from banks",
      "Check online shop reviews before purchasing",
      "Report to Policie CR"
    ],
    reportContact: "Policie: 158"
  },
  "Romania": {
    name: "Romania",
    riskLevel: "medium",
    riskScore: 56,
    topThreats: ["Phishing", "Banking Fraud", "E-commerce Scams", "SIM Swap"],
    recentIncidents: 234,
    targetedGroups: ["Banking Customers", "Online Shoppers", "Diaspora"],
    tips: [
      "Banks never ask for card details via phone",
      "Verify OLX/marketplace sellers before paying",
      "Report to DIICOT"
    ],
    reportContact: "DIICOT: diicot.ro"
  },
  "Hungary": {
    name: "Hungary",
    riskLevel: "medium",
    riskScore: 49,
    topThreats: ["Phishing", "Vishing", "Investment Scams", "E-commerce Fraud"],
    recentIncidents: 145,
    targetedGroups: ["Seniors", "Online Investors", "Banking Customers"],
    tips: [
      "OTP Bank never asks for full credentials via phone",
      "Verify investment offers through MNB",
      "Report to Rendorseg"
    ],
    reportContact: "Rendorseg: 107"
  },
  "Ukraine": {
    name: "Ukraine",
    riskLevel: "high",
    riskScore: 68,
    topThreats: ["Banking Fraud", "Phishing", "SIM Swap", "Ransomware"],
    recentIncidents: 456,
    targetedGroups: ["Banking Customers", "Businesses", "Government"],
    tips: [
      "Verify bank messages through official channels",
      "Use strong, unique passwords",
      "Report to Cyber Police"
    ],
    reportContact: "Cyber Police: cyberpolice.gov.ua"
  },
  "Israel": {
    name: "Israel",
    riskLevel: "medium",
    riskScore: 53,
    topThreats: ["Phishing", "Investment Scams", "Romance Fraud", "Bit/PayBox Fraud"],
    recentIncidents: 234,
    targetedGroups: ["Online Investors", "Seniors", "Mobile Payment Users"],
    tips: [
      "Verify investments through ISA",
      "Never share Bit/PayBox codes",
      "Report to Israel Police Lahav 433"
    ],
    reportContact: "Lahav 433: 110"
  },
  "Iran": {
    name: "Iran",
    riskLevel: "high",
    riskScore: 66,
    topThreats: ["Banking Fraud", "Phishing", "E-commerce Scams", "SIM Swap"],
    recentIncidents: 378,
    targetedGroups: ["Banking Customers", "Online Shoppers", "Businesses"],
    tips: [
      "Never share banking card details",
      "Verify online sellers through trusted platforms",
      "Use strong passwords for all accounts"
    ],
    reportContact: "FATA Police: 110"
  },
  "Iraq": {
    name: "Iraq",
    riskLevel: "high",
    riskScore: 69,
    topThreats: ["Mobile Money Fraud", "Phishing", "Investment Scams", "Social Media Hacking"],
    recentIncidents: 312,
    targetedGroups: ["Mobile Money Users", "Social Media Users", "Businesses"],
    tips: [
      "Never share mobile money PINs",
      "Use strong passwords for social media",
      "Be cautious of investment 'opportunities'"
    ]
  },
  "Algeria": {
    name: "Algeria",
    riskLevel: "medium",
    riskScore: 58,
    topThreats: ["Phishing", "E-commerce Fraud", "Social Media Hacking", "Job Scams"],
    recentIncidents: 234,
    targetedGroups: ["Online Shoppers", "Social Media Users", "Job Seekers"],
    tips: [
      "Verify online sellers before purchasing",
      "Use strong passwords for all accounts",
      "Verify job offers through official channels"
    ],
    reportContact: "DGSN: 17"
  },
  "Libya": {
    name: "Libya",
    riskLevel: "high",
    riskScore: 67,
    topThreats: ["Banking Fraud", "Social Media Hacking", "Investment Scams", "Phishing"],
    recentIncidents: 189,
    targetedGroups: ["Banking Customers", "Social Media Users", "Diaspora"],
    tips: [
      "Never share banking credentials",
      "Use strong passwords for social media",
      "Be cautious of investment schemes"
    ]
  },
  "Tunisia": {
    name: "Tunisia",
    riskLevel: "medium",
    riskScore: 54,
    topThreats: ["Phishing", "E-commerce Fraud", "Social Media Hacking", "Job Scams"],
    recentIncidents: 167,
    targetedGroups: ["Online Shoppers", "Social Media Users", "Youth"],
    tips: [
      "Verify online sellers before purchasing",
      "Use two-factor authentication",
      "Report scams to police"
    ],
    reportContact: "Police: 197"
  },
  "Senegal": {
    name: "Senegal",
    riskLevel: "high",
    riskScore: 70,
    topThreats: ["Orange Money Fraud", "Romance Scams", "Fake Jobs", "WhatsApp Scams"],
    recentIncidents: 287,
    targetedGroups: ["Mobile Money Users", "Youth", "Diaspora"],
    tips: [
      "Never share Orange Money PIN",
      "Verify job offers through official channels",
      "Be cautious of online relationships asking for money"
    ],
    reportContact: "Police: 17"
  },
  "Ivory Coast": {
    name: "Ivory Coast",
    riskLevel: "high",
    riskScore: 74,
    topThreats: ["Mobile Money Fraud", "Romance Scams", "Lottery Scams", "Fake Jobs"],
    recentIncidents: 356,
    targetedGroups: ["Mobile Money Users", "Youth", "International Contacts"],
    tips: [
      "Never share MTN/Orange Money PIN",
      "Be extremely cautious of online romance",
      "Verify lottery wins - you can't win what you didn't enter"
    ],
    reportContact: "PLCC: plfraudeci.ci"
  },
  "Zimbabwe": {
    name: "Zimbabwe",
    riskLevel: "high",
    riskScore: 72,
    topThreats: ["EcoCash Fraud", "SIM Swap", "Investment Scams", "WhatsApp Scams"],
    recentIncidents: 267,
    targetedGroups: ["EcoCash Users", "Seniors", "Diaspora"],
    tips: [
      "Never share EcoCash PIN with anyone",
      "Be wary of 'too good to be true' investment returns",
      "Verify WhatsApp requests for money in person"
    ],
    reportContact: "ZRP: 995"
  },
  "Zambia": {
    name: "Zambia",
    riskLevel: "high",
    riskScore: 68,
    topThreats: ["Mobile Money Fraud", "SIM Swap", "Fake Loans", "Investment Scams"],
    recentIncidents: 234,
    targetedGroups: ["Mobile Money Users", "Small Traders", "Youth"],
    tips: [
      "Never share mobile money PINs",
      "Verify loan offers through official banks",
      "Report fraud to your telecom provider"
    ],
    reportContact: "Zambia Police: 999"
  },
  "Mozambique": {
    name: "Mozambique",
    riskLevel: "high",
    riskScore: 66,
    topThreats: ["M-Pesa Fraud", "SIM Swap", "Fake Loans", "WhatsApp Scams"],
    recentIncidents: 198,
    targetedGroups: ["M-Pesa Users", "Small Businesses", "Rural Communities"],
    tips: [
      "Vodacom never asks for your M-Pesa PIN",
      "Verify loan offers through official channels",
      "Be cautious of 'urgent' money requests"
    ],
    reportContact: "PRM: 119"
  },
  "Angola": {
    name: "Angola",
    riskLevel: "medium",
    riskScore: 63,
    topThreats: ["Banking Fraud", "Phishing", "Investment Scams", "E-commerce Fraud"],
    recentIncidents: 178,
    targetedGroups: ["Banking Customers", "Diaspora", "Business Owners"],
    tips: [
      "Banks never ask for full credentials via phone",
      "Verify investment opportunities carefully",
      "Use official banking apps only"
    ]
  },
  "DRC": {
    name: "DRC",
    riskLevel: "high",
    riskScore: 71,
    topThreats: ["Mobile Money Fraud", "SIM Swap", "Fake Jobs", "WhatsApp Scams"],
    recentIncidents: 312,
    targetedGroups: ["Mobile Money Users", "Job Seekers", "Small Traders"],
    tips: [
      "Never share M-Pesa/Airtel Money PIN",
      "Verify job offers through official company channels",
      "Be cautious of 'family emergency' messages"
    ]
  },
  "Sudan": {
    name: "Sudan",
    riskLevel: "high",
    riskScore: 65,
    topThreats: ["Banking Fraud", "Phishing", "Investment Scams", "Social Media Hacking"],
    recentIncidents: 189,
    targetedGroups: ["Banking Customers", "Diaspora", "Social Media Users"],
    tips: [
      "Never share banking credentials",
      "Be cautious of investment schemes",
      "Use strong passwords for all accounts"
    ]
  },
  "Sri Lanka": {
    name: "Sri Lanka",
    riskLevel: "medium",
    riskScore: 61,
    topThreats: ["Banking Fraud", "Phishing", "E-commerce Scams", "Job Fraud"],
    recentIncidents: 234,
    targetedGroups: ["Banking Customers", "Online Shoppers", "Job Seekers"],
    tips: [
      "Banks never ask for OTPs via phone",
      "Verify online sellers before purchasing",
      "Report scams to Sri Lanka CERT"
    ],
    reportContact: "Sri Lanka CERT: cert.gov.lk"
  },
  "Nepal": {
    name: "Nepal",
    riskLevel: "medium",
    riskScore: 63,
    topThreats: ["eSewa/Khalti Fraud", "Phishing", "Job Scams", "Lottery Scams"],
    recentIncidents: 198,
    targetedGroups: ["Digital Wallet Users", "Job Seekers", "Youth"],
    tips: [
      "Never share eSewa/Khalti PINs",
      "Verify job offers through official channels",
      "You can't win lotteries you didn't enter"
    ],
    reportContact: "Nepal Police: 100"
  },
  "Myanmar": {
    name: "Myanmar",
    riskLevel: "high",
    riskScore: 68,
    topThreats: ["Mobile Money Fraud", "Phishing", "Investment Scams", "Job Scams"],
    recentIncidents: 289,
    targetedGroups: ["Mobile Money Users", "Youth", "Migrant Workers"],
    tips: [
      "Never share Wave/KBZ Pay PINs",
      "Verify job offers carefully",
      "Be cautious of investment 'opportunities'"
    ]
  },
  "Cambodia": {
    name: "Cambodia",
    riskLevel: "high",
    riskScore: 72,
    topThreats: ["Pig Butchering Scams", "Job Scams", "Romance Fraud", "Crypto Fraud"],
    recentIncidents: 345,
    targetedGroups: ["Job Seekers", "Crypto Investors", "Youth"],
    tips: [
      "Be extremely cautious of overseas job offers",
      "Never send money to online romantic interests",
      "Verify crypto platforms thoroughly"
    ],
    reportContact: "Police: 117"
  },
  "Afghanistan": {
    name: "Afghanistan",
    riskLevel: "high",
    riskScore: 67,
    topThreats: ["Mobile Money Fraud", "Phishing", "Job Scams", "Investment Fraud"],
    recentIncidents: 156,
    targetedGroups: ["Mobile Money Users", "Job Seekers", "Diaspora"],
    tips: [
      "Never share M-Paisa PINs",
      "Verify job offers through trusted contacts",
      "Be cautious of investment schemes"
    ]
  },
  "Kazakhstan": {
    name: "Kazakhstan",
    riskLevel: "medium",
    riskScore: 57,
    topThreats: ["Banking Fraud", "Phishing", "Investment Scams", "E-commerce Fraud"],
    recentIncidents: 198,
    targetedGroups: ["Banking Customers", "Online Investors", "Online Shoppers"],
    tips: [
      "Banks never ask for full credentials via phone",
      "Verify investments through official regulators",
      "Check seller reviews before purchasing"
    ]
  },
  "Uzbekistan": {
    name: "Uzbekistan",
    riskLevel: "medium",
    riskScore: 59,
    topThreats: ["Banking Fraud", "Phishing", "E-commerce Scams", "Job Fraud"],
    recentIncidents: 167,
    targetedGroups: ["Banking Customers", "Online Shoppers", "Migrant Workers"],
    tips: [
      "Never share banking credentials",
      "Verify online sellers before purchasing",
      "Be cautious of overseas job offers"
    ]
  },
  "Mongolia": {
    name: "Mongolia",
    riskLevel: "medium",
    riskScore: 54,
    topThreats: ["Phishing", "E-commerce Fraud", "Investment Scams", "Social Media Hacking"],
    recentIncidents: 89,
    targetedGroups: ["Online Shoppers", "Social Media Users", "Youth"],
    tips: [
      "Verify online sellers before purchasing",
      "Use strong passwords for all accounts",
      "Be cautious of investment schemes"
    ]
  },
  "North Korea": {
    name: "North Korea",
    riskLevel: "high",
    riskScore: 45,
    topThreats: ["State-sponsored Attacks", "Crypto Theft", "Ransomware", "Espionage"],
    recentIncidents: 0,
    targetedGroups: ["Limited internet access"],
    tips: [
      "Limited public cyber threat data available"
    ]
  },
  "Cuba": {
    name: "Cuba",
    riskLevel: "low",
    riskScore: 38,
    topThreats: ["Phishing", "Social Media Hacking", "E-commerce Fraud"],
    recentIncidents: 67,
    targetedGroups: ["Diaspora Contacts", "Social Media Users"],
    tips: [
      "Use strong passwords for all accounts",
      "Be cautious of unsolicited messages",
      "Verify requests for money from family"
    ]
  },
  "Haiti": {
    name: "Haiti",
    riskLevel: "high",
    riskScore: 66,
    topThreats: ["Mobile Money Fraud", "Phishing", "Romance Scams", "Lottery Scams"],
    recentIncidents: 145,
    targetedGroups: ["Mobile Money Users", "Diaspora", "Seniors"],
    tips: [
      "Never share MonCash PINs",
      "Verify lottery wins through official channels",
      "Be cautious of online relationships"
    ]
  },
  "Jamaica": {
    name: "Jamaica",
    riskLevel: "high",
    riskScore: 71,
    topThreats: ["Lottery Scams", "Romance Fraud", "Phishing", "Investment Scams"],
    recentIncidents: 234,
    targetedGroups: ["International Contacts", "Seniors", "Online Investors"],
    tips: [
      "You cannot win a lottery you didn't enter",
      "Be cautious of online romantic interests",
      "Report scams to Jamaica Constabulary"
    ],
    reportContact: "JCF: 119"
  },
  "Dominican Republic": {
    name: "Dominican Republic",
    riskLevel: "medium",
    riskScore: 58,
    topThreats: ["Phishing", "Banking Fraud", "Romance Scams", "E-commerce Fraud"],
    recentIncidents: 187,
    targetedGroups: ["Banking Customers", "Diaspora", "Online Shoppers"],
    tips: [
      "Banks never ask for credentials via phone",
      "Verify online sellers before purchasing",
      "Report fraud to DICAT"
    ]
  },
  "Guatemala": {
    name: "Guatemala",
    riskLevel: "medium",
    riskScore: 61,
    topThreats: ["Banking Fraud", "Phishing", "Extortion Calls", "E-commerce Fraud"],
    recentIncidents: 198,
    targetedGroups: ["Banking Customers", "Business Owners", "Online Shoppers"],
    tips: [
      "Hang up on extortion calls",
      "Banks never ask for full credentials via phone",
      "Verify online sellers before purchasing"
    ]
  },
  "Honduras": {
    name: "Honduras",
    riskLevel: "medium",
    riskScore: 62,
    topThreats: ["Banking Fraud", "Phishing", "WhatsApp Scams", "Extortion"],
    recentIncidents: 178,
    targetedGroups: ["Banking Customers", "WhatsApp Users", "Remittance Recipients"],
    tips: [
      "Never share banking credentials",
      "Verify WhatsApp requests for money",
      "Report extortion attempts to police"
    ]
  },
  "Costa Rica": {
    name: "Costa Rica",
    riskLevel: "medium",
    riskScore: 52,
    topThreats: ["Phishing", "SINPE Movil Fraud", "Investment Scams", "E-commerce Fraud"],
    recentIncidents: 145,
    targetedGroups: ["SINPE Users", "Online Investors", "Expats"],
    tips: [
      "Never share SINPE credentials",
      "Verify investments through SUGEF",
      "Report to OIJ Cibercrimen"
    ],
    reportContact: "OIJ: 800-8000-645"
  },
  "Panama": {
    name: "Panama",
    riskLevel: "medium",
    riskScore: 55,
    topThreats: ["Banking Fraud", "Phishing", "Investment Scams", "E-commerce Fraud"],
    recentIncidents: 134,
    targetedGroups: ["Banking Customers", "Online Investors", "Expats"],
    tips: [
      "Banks never ask for full credentials",
      "Verify investments through official channels",
      "Report fraud to DIJ"
    ]
  }
};

const attackPoints = [
  { id: 1, name: "United States", coordinates: [-95, 38] as [number, number], color: "#ef4444", attacks: 1247 },
  { id: 2, name: "Brazil", coordinates: [-51, -14] as [number, number], color: "#f97316", attacks: 523 },
  { id: 3, name: "United Kingdom", coordinates: [-2, 54] as [number, number], color: "#eab308", attacks: 412 },
  { id: 4, name: "Germany", coordinates: [10, 51] as [number, number], color: "#22c55e", attacks: 389 },
  { id: 5, name: "Nigeria", coordinates: [8, 10] as [number, number], color: "#14b8a6", attacks: 876 },
  { id: 6, name: "Kenya", coordinates: [38, 1] as [number, number], color: "#06b6d4", attacks: 654 },
  { id: 7, name: "India", coordinates: [78, 21] as [number, number], color: "#8b5cf6", attacks: 1532 },
  { id: 8, name: "China", coordinates: [104, 35] as [number, number], color: "#ec4899", attacks: 2103 },
  { id: 9, name: "Japan", coordinates: [138, 36] as [number, number], color: "#f43f5e", attacks: 445 },
  { id: 10, name: "Australia", coordinates: [134, -25] as [number, number], color: "#0ea5e9", attacks: 312 },
  { id: 11, name: "South Africa", coordinates: [25, -29] as [number, number], color: "#84cc16", attacks: 298 },
  { id: 12, name: "Russia", coordinates: [100, 60] as [number, number], color: "#a855f7", attacks: 1876 },
];

const attackLines = [
  { from: 8, to: 1, type: "Ransomware" },
  { from: 12, to: 3, type: "Phishing" },
  { from: 7, to: 6, type: "BEC Scam" },
  { from: 1, to: 5, type: "Malware" },
  { from: 8, to: 7, type: "DDoS" },
  { from: 12, to: 4, type: "Espionage" },
];

const countryNameMap: Record<string, string> = {
  "United States of America": "United States",
  "USA": "United States",
  "UK": "United Kingdom",
  "Britain": "United Kingdom",
  "Great Britain": "United Kingdom",
  "Russian Federation": "Russia",
  "S. Africa": "South Africa",
  "Rep. of Korea": "South Korea",
  "Korea": "South Korea",
  "Dem. Rep. Korea": "North Korea",
  "Côte d'Ivoire": "Ivory Coast",
  "Cote d'Ivoire": "Ivory Coast",
  "Democratic Republic of the Congo": "DRC",
  "Dem. Rep. Congo": "DRC",
  "Congo": "DRC",
  "Czech Rep.": "Czech Republic",
  "Czechia": "Czech Republic",
  "U.A.E.": "UAE",
  "United Arab Emirates": "UAE",
  "Viet Nam": "Vietnam",
  "Türkiye": "Turkey",
  "Islamic Rep. of Iran": "Iran",
  "Syrian Arab Republic": "Syria",
  "Lao PDR": "Laos",
  "Myanmar (Burma)": "Myanmar",
  "Bosnia and Herz.": "Bosnia and Herzegovina",
  "N. Macedonia": "North Macedonia",
  "Dominican Rep.": "Dominican Republic",
  "Central African Rep.": "Central African Republic",
  "S. Sudan": "South Sudan",
  "Eq. Guinea": "Equatorial Guinea",
  "eSwatini": "Eswatini",
  "Swaziland": "Eswatini"
};

interface MapComponentProps {
  onCountryClick: (countryName: string) => void;
  selectedCountry: string | null;
}

const MapComponent = memo(({ onCountryClick, selectedCountry }: MapComponentProps) => {
  const [activeLines, setActiveLines] = useState<number[]>([0, 2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLines(prev => prev.map(i => (i + 1) % attackLines.length));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCountryClick = (geo: any) => {
    const countryName = geo.properties?.name || geo.properties?.NAME;
    if (countryName) {
      const normalizedName = countryNameMap[countryName] || countryName;
      onCountryClick(normalizedName);
    }
  };

  const getCountryFill = (geo: any) => {
    const countryName = geo.properties?.name || geo.properties?.NAME;
    const normalizedName = countryNameMap[countryName] || countryName;
    
    if (normalizedName === selectedCountry) {
      return "#0d9488";
    }
    
    const riskData = countryRiskData[normalizedName];
    if (riskData) {
      if (riskData.riskLevel === "high") return "#7f1d1d";
      if (riskData.riskLevel === "medium") return "#78350f";
      return "#14532d";
    }
    return "#1e293b";
  };

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 120,
        center: [20, 20]
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }: { geographies: any[] }) =>
          geographies.map((geo: any) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={getCountryFill(geo)}
              stroke="#334155"
              strokeWidth={0.5}
              onClick={() => handleCountryClick(geo)}
              style={{
                default: { outline: "none", cursor: "pointer" },
                hover: { fill: "#0d9488", outline: "none", cursor: "pointer" },
                pressed: { outline: "none" },
              }}
            />
          ))
        }
      </Geographies>

      {attackLines.map((line, i) => {
        const from = attackPoints.find(p => p.id === line.from);
        const to = attackPoints.find(p => p.id === line.to);
        if (!from || !to) return null;
        const isActive = activeLines.includes(i);
        
        return (
          <g key={`line-${i}`}>
            <Line
              from={from.coordinates}
              to={to.coordinates}
              stroke="rgba(20, 184, 166, 0.15)"
              strokeWidth={0.5}
              strokeLinecap="round"
              strokeDasharray="4,2"
            />
            {isActive && (
              <Line
                from={from.coordinates}
                to={to.coordinates}
                stroke="#ef4444"
                strokeWidth={2}
                strokeLinecap="round"
                style={{
                  filter: "drop-shadow(0 0 4px #ef4444)"
                }}
              />
            )}
          </g>
        );
      })}

      {attackPoints.map((point) => (
        <Marker key={point.id} coordinates={point.coordinates}>
          <circle 
            r={4} 
            fill={point.color} 
            opacity={0.9}
            style={{ cursor: "pointer" }}
            onClick={() => onCountryClick(point.name)}
          >
            <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r={8} fill="none" stroke={point.color} strokeWidth={0.8} opacity={0.3}>
            <animate attributeName="r" values="8;14;8" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
          <text
            textAnchor="middle"
            y={-10}
            style={{ 
              fontFamily: "system-ui", 
              fill: "#e2e8f0", 
              fontSize: "9px",
              fontWeight: 600,
              textShadow: "0 1px 2px rgba(0,0,0,0.8)",
              cursor: "pointer"
            }}
            onClick={() => onCountryClick(point.name)}
          >
            {point.name}
          </text>
        </Marker>
      ))}
    </ComposableMap>
  );
});

MapComponent.displayName = "MapComponent";

function CountryRiskPanel({ country, onClose }: { country: CountryRiskData; onClose: () => void }) {
  const riskColors = {
    high: { bg: "bg-red-500/20", border: "border-red-500", text: "text-red-400", badge: "bg-red-500" },
    medium: { bg: "bg-amber-500/20", border: "border-amber-500", text: "text-amber-400", badge: "bg-amber-500" },
    low: { bg: "bg-green-500/20", border: "border-green-500", text: "text-green-400", badge: "bg-green-500" }
  };

  const colors = riskColors[country.riskLevel];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] overflow-y-auto bg-slate-900/95 backdrop-blur-sm border border-slate-600 rounded-xl shadow-2xl z-20"
    >
      <div className={`p-4 border-b ${colors.border} ${colors.bg}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-teal-400" />
            <h3 className="font-bold text-white text-lg">{country.name}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${colors.badge}`}>
            {country.riskLevel.toUpperCase()} RISK
          </span>
          <div className="flex items-center gap-1">
            <TrendingUp className={`h-4 w-4 ${colors.text}`} />
            <span className={`text-sm font-medium ${colors.text}`}>Score: {country.riskScore}/100</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            Top Threats
          </h4>
          <div className="flex flex-wrap gap-1">
            {country.topThreats.map((threat, i) => (
              <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                {threat}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-400" />
            Most Targeted
          </h4>
          <div className="flex flex-wrap gap-1">
            {country.targetedGroups.map((group, i) => (
              <span key={i} className="px-2 py-1 bg-amber-500/10 text-amber-300 text-xs rounded border border-amber-500/30">
                {group}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-teal-400" />
            Safety Tips
          </h4>
          <ul className="space-y-2">
            {country.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-xs text-slate-400">
                <span className="text-teal-400 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {country.reportContact && (
          <div className="pt-2 border-t border-slate-700">
            <h4 className="text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
              <Phone className="h-4 w-4 text-green-400" />
              Report Fraud
            </h4>
            <p className="text-xs text-green-400 font-medium">{country.reportContact}</p>
          </div>
        )}

        <div className="pt-2 border-t border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Recent incidents (30 days)</span>
            <span className="text-red-400 font-medium">{country.recentIncidents.toLocaleString()}</span>
          </div>
        </div>

        {country.source && (
          <div className="pt-2 border-t border-slate-700">
            <a 
              href={country.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Source: {country.source.name}</span>
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function AnimatedThreatMap() {
  const [recentAttacks, setRecentAttacks] = useState<{from: string; to: string; type: string}[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomLine = attackLines[Math.floor(Math.random() * attackLines.length)];
      const fromPoint = attackPoints.find(p => p.id === randomLine.from);
      const toPoint = attackPoints.find(p => p.id === randomLine.to);
      if (fromPoint && toPoint) {
        setRecentAttacks(prev => [
          { from: fromPoint.name, to: toPoint.name, type: randomLine.type },
          ...prev.slice(0, 2)
        ]);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleCountryClick = (countryName: string) => {
    if (countryRiskData[countryName]) {
      setSelectedCountry(countryName);
    } else {
      setSelectedCountry(null);
    }
  };

  const selectedCountryData = selectedCountry ? countryRiskData[selectedCountry] : null;
  
  const totalCountries = Object.keys(countryRiskData).length;
  const totalIncidents = Object.values(countryRiskData).reduce((sum, country) => sum + country.recentIncidents, 0);

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700">
      <div className="grid lg:grid-cols-4 gap-0">
        <div className="lg:col-span-3 relative" style={{ minHeight: "450px" }}>
          <MapComponent 
            onCountryClick={handleCountryClick}
            selectedCountry={selectedCountry}
          />

          <AnimatePresence>
            {selectedCountryData && (
              <CountryRiskPanel 
                country={selectedCountryData} 
                onClose={() => setSelectedCountry(null)} 
              />
            )}
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-slate-300">Click any country for risk details</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> High Risk
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-500" /> Monitored
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border-l border-slate-700 p-4 flex flex-col">
          <AnimatePresence mode="wait">
            {selectedCountryData ? (
              <motion.div
                key={selectedCountry}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full"
              >
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-teal-400" />
                      <span className="text-sm font-medium text-white">{selectedCountryData.name}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedCountry(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ✕ Clear
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-lg p-2 text-center ${
                      selectedCountryData.riskLevel === 'high' ? 'bg-red-500/20' : 
                      selectedCountryData.riskLevel === 'medium' ? 'bg-amber-500/20' : 'bg-green-500/20'
                    }`}>
                      <div className={`text-xl font-bold ${
                        selectedCountryData.riskLevel === 'high' ? 'text-red-400' : 
                        selectedCountryData.riskLevel === 'medium' ? 'text-amber-400' : 'text-green-400'
                      }`}>{selectedCountryData.riskScore}</div>
                      <div className="text-xs text-slate-400">Risk Score</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                      <div className="text-xl font-bold text-red-400">{selectedCountryData.recentIncidents.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Incidents</div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-sm font-medium text-white">Top Scams</span>
                  </div>
                  <div className="space-y-1">
                    {selectedCountryData.topThreats.slice(0, 4).map((threat, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{threat}</span>
                        <span className={`${
                          i === 0 ? 'text-red-400' : i === 1 ? 'text-amber-400' : i === 2 ? 'text-yellow-400' : 'text-teal-400'
                        }`}>#{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-medium text-white">Most Targeted</span>
                  </div>
                  <div className="space-y-1">
                    {selectedCountryData.targetedGroups.map((group, i) => (
                      <div key={i} className="text-xs text-slate-400 flex items-center gap-1">
                        <span className="text-amber-400">•</span> {group}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedCountryData.reportContact && (
                  <div className="mt-auto pt-2 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-white">Report Fraud</span>
                    </div>
                    <p className="text-xs text-green-400 font-medium">{selectedCountryData.reportContact}</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="global"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-teal-400" />
                    <span className="text-sm font-medium text-white">Global Summary</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                      <div className="text-xl font-bold text-red-400">{totalIncidents.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Incidents (30d)</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                      <div className="text-xl font-bold text-amber-400">{totalCountries}</div>
                      <div className="text-xs text-slate-400">Countries</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-medium text-white">Live Attacks</span>
                  </div>
                  <div className="space-y-2">
                    {recentAttacks.length > 0 ? recentAttacks.slice(0, 4).map((attack, i) => (
                      <motion.div
                        key={`${attack.from}-${attack.to}-${i}`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-700/30 rounded p-2 text-xs border-l-2 border-red-500 cursor-pointer hover:bg-slate-700/50"
                        onClick={() => handleCountryClick(attack.to)}
                      >
                        <div className="text-slate-300 truncate font-medium">
                          {attack.from} → {attack.to}
                        </div>
                        <div className="text-red-400 text-[10px]">{attack.type}</div>
                      </motion.div>
                    )) : (
                      <div className="text-xs text-slate-500">Loading attacks...</div>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-sm font-medium text-white">Top Threats</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Phishing</span>
                      <span className="text-red-400">34%</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Ransomware</span>
                      <span className="text-amber-400">28%</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>BEC Scams</span>
                      <span className="text-yellow-400">22%</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Malware</span>
                      <span className="text-teal-400">16%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
