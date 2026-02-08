export const SCAM_TYPES = [
  { value: "phishing", label: "Phishing Email/Text" },
  { value: "romance", label: "Romance Scam" },
  { value: "investment", label: "Investment/Crypto Scam" },
  { value: "tech-support", label: "Tech Support Scam" },
  { value: "impersonation", label: "Government/Bank Impersonation" },
  { value: "job", label: "Fake Job Offer" },
  { value: "shopping", label: "Online Shopping Scam" },
  { value: "lottery", label: "Lottery/Prize Scam" },
  { value: "mobile-money", label: "Mobile Money Fraud" },
  { value: "other", label: "Other" },
] as const;

export const REGIONS = [
  { value: "north_america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "africa", label: "Africa" },
  { value: "asia", label: "Asia Pacific" },
  { value: "latin_america", label: "Latin America" },
  { value: "middle_east", label: "Middle East" },
] as const;

export const RISK_LEVELS = {
  safe: { color: "bg-green-500", label: "Safe" },
  low: { color: "bg-blue-500", label: "Low Risk" },
  medium: { color: "bg-yellow-500", label: "Medium Risk" },
  high: { color: "bg-orange-500", label: "High Risk" },
  critical: { color: "bg-red-500", label: "Critical" },
} as const;
