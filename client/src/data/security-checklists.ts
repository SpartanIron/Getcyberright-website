export interface ChecklistItem {
  id: string;
  text: string;
  priority?: "critical" | "important" | "recommended";
}

export interface ChecklistData {
  title: string;
  description: string;
  category: string;
  items: ChecklistItem[];
}

export const securityChecklists: Record<string, ChecklistData> = {
  homeNetwork: {
    title: "Home Network Security Checklist",
    description: "Essential steps to secure your home WiFi and connected devices",
    category: "Home Security",
    items: [
      { id: "router-password", text: "Change your router's default admin password", priority: "critical" as const },
      { id: "wifi-password", text: "Use a strong, unique WiFi password (at least 12 characters)", priority: "critical" as const },
      { id: "wpa3", text: "Enable WPA3 encryption (or WPA2 if WPA3 unavailable)", priority: "critical" as const },
      { id: "firmware", text: "Update your router's firmware to the latest version", priority: "important" as const },
      { id: "guest-network", text: "Set up a separate guest network for visitors", priority: "important" as const },
      { id: "remote-access", text: "Disable remote management if not needed", priority: "important" as const },
      { id: "device-names", text: "Rename your network to not reveal personal info", priority: "recommended" as const },
      { id: "connected-devices", text: "Review and remove unknown connected devices", priority: "recommended" as const },
    ],
  },
  accountSecurity: {
    title: "Account Security Checklist",
    description: "Protect your online accounts from unauthorized access",
    category: "Personal Security",
    items: [
      { id: "unique-passwords", text: "Use unique passwords for every account", priority: "critical" as const },
      { id: "2fa", text: "Enable two-factor authentication on all important accounts", priority: "critical" as const },
      { id: "password-manager", text: "Use a reputable password manager", priority: "critical" as const },
      { id: "breach-check", text: "Check if your email has been in a data breach", priority: "important" as const },
      { id: "recovery-options", text: "Set up account recovery options (phone, backup email)", priority: "important" as const },
      { id: "security-questions", text: "Use unique answers for security questions", priority: "important" as const },
      { id: "login-alerts", text: "Enable login notifications where available", priority: "recommended" as const },
      { id: "old-accounts", text: "Close accounts you no longer use", priority: "recommended" as const },
    ],
  },
  familySafety: {
    title: "Family Online Safety Checklist",
    description: "Keep your family safe from online threats",
    category: "Family",
    items: [
      { id: "parental-controls", text: "Set up parental controls on devices and apps", priority: "critical" as const },
      { id: "discuss-safety", text: "Have regular conversations about online safety", priority: "critical" as const },
      { id: "screen-time", text: "Establish screen time limits and boundaries", priority: "important" as const },
      { id: "privacy-settings", text: "Review privacy settings on social media accounts", priority: "important" as const },
      { id: "stranger-danger", text: "Teach children not to share personal info online", priority: "critical" as const },
      { id: "trusted-adult", text: "Ensure kids know to report uncomfortable situations", priority: "critical" as const },
      { id: "app-review", text: "Regularly review installed apps on family devices", priority: "important" as const },
      { id: "location-sharing", text: "Check and manage location sharing settings", priority: "recommended" as const },
    ],
  },
  smallBusiness: {
    title: "Small Business Security Checklist",
    description: "Essential security measures for your business",
    category: "Business",
    items: [
      { id: "employee-training", text: "Provide cybersecurity training to all employees", priority: "critical" as const },
      { id: "backup-data", text: "Implement regular data backup procedures", priority: "critical" as const },
      { id: "access-control", text: "Limit access to sensitive data on a need-to-know basis", priority: "critical" as const },
      { id: "software-updates", text: "Keep all software and systems updated", priority: "critical" as const },
      { id: "email-security", text: "Use email filtering and anti-phishing tools", priority: "important" as const },
      { id: "incident-plan", text: "Create an incident response plan", priority: "important" as const },
      { id: "vendor-security", text: "Review security practices of third-party vendors", priority: "important" as const },
      { id: "cyber-insurance", text: "Consider cybersecurity insurance", priority: "recommended" as const },
    ],
  },
};
