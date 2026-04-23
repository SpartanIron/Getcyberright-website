// GetCyberRight Affiliate Tools - Revenue Configuration File
// Replace YOUR_ID placeholders with actual affiliate IDs after program approval

export interface AffiliateTool {
    id: string;
    name: string;
    tagline: string;
    description: string;
    category: "vpn" | "identity" | "password" | "antimalware" | "data-removal";
    affiliateUrl: string;
    logoPlaceholder: string;
    badge?: string;
    rating: number;
    featured: boolean;
    contextTags: string[];
    cta: string;
}

export const affiliateTools: AffiliateTool[] = [
  {
        id: "nordvpn",
        name: "NordVPN",
        tagline: "Stay Private Online",
        description: "Military-grade encryption keeps your internet activity private on any network. Trusted by 14 million users worldwide. Essential for seniors using public Wi-Fi.",
        category: "vpn",
        affiliateUrl: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=YOUR_NORDVPN_ID",
        logoPlaceholder: "NV",
        badge: "Editor's Choice",
        rating: 4.8,
        featured: true,
        contextTags: ["phishing", "public wifi", "privacy", "safe", "scam", "link"],
        cta: "Get 68% Off + 3 Months Free",
  },
  {
        id: "aura",
        name: "Aura Identity Guard",
        tagline: "All-in-One Identity Protection",
        description: "Real-time identity theft alerts, dark web monitoring, credit monitoring, and 1 million dollar insurance. Most complete family protection available.",
        category: "identity",
        affiliateUrl: "https://www.aura.com/?ref=YOUR_AURA_ID",
        logoPlaceholder: "AU",
        badge: "Best for Families",
        rating: 4.7,
        featured: true,
        contextTags: ["identity theft", "breach", "dark web", "data leak", "personal info"],
        cta: "Start Free Trial",
  },
  {
        id: "deleteme",
        name: "DeleteMe",
        tagline: "Remove Your Data from the Internet",
        description: "Automatically removes personal information from 750+ data broker sites. Reduces spam calls and targeted scam risk by 90 percent.",
        category: "data-removal",
        affiliateUrl: "https://joindeleteme.com/refer?coupon=YOUR_DELETEME_ID",
        logoPlaceholder: "DM",
        badge: "Top Rated",
        rating: 4.6,
        featured: true,
        contextTags: ["data broker", "personal info", "spam", "privacy", "data removal"],
        cta: "Remove My Data Now",
  },
  {
        id: "malwarebytes",
        name: "Malwarebytes",
        tagline: "Advanced Malware Protection",
        description: "Removes malware, ransomware, and spyware that traditional antivirus misses. Lightweight and trusted by 500 million users worldwide.",
        category: "antimalware",
        affiliateUrl: "https://www.malwarebytes.com/?ref=YOUR_MALWAREBYTES_ID",
        logoPlaceholder: "MB",
        badge: "Most Downloaded",
        rating: 4.7,
        featured: false,
        contextTags: ["malware", "virus", "ransomware", "infected", "download"],
        cta: "Try Free for 14 Days",
  },
  {
        id: "1password",
        name: "1Password",
        tagline: "Password Manager for Families",
        description: "Store all passwords securely, share safely with family members, and get alerted to breached passwords. One master password protects everything.",
        category: "password",
        affiliateUrl: "https://1password.com/sign-up/?ref=YOUR_1PASSWORD_ID",
        logoPlaceholder: "1P",
        badge: "Family Favorite",
        rating: 4.9,
        featured: false,
        contextTags: ["password", "login", "account", "weak password", "breach"],
        cta: "Try Free for 14 Days",
  },
  {
        id: "incogni",
        name: "Incogni",
        tagline: "Stop Data Brokers Automatically",
        description: "Contacts data brokers on your behalf and legally demands deletion of your personal information. Set it and forget it.",
        category: "data-removal",
        affiliateUrl: "https://incogni.com?ref=YOUR_INCOGNI_ID",
        logoPlaceholder: "IC",
        badge: "Automated",
        rating: 4.5,
        featured: false,
        contextTags: ["data broker", "personal info exposed", "spam calls", "privacy"],
        cta: "Remove My Info",
  },
  ];

export function getContextualTools(context: string, limit = 3): AffiliateTool[] {
    const lower = context.toLowerCase();
    const scored = affiliateTools
      .map((tool) => ({ tool, score: tool.contextTags.filter((tag) => lower.includes(tag)).length }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);
    if (scored.length >= limit) return scored.slice(0, limit).map(({ tool }) => tool);
    const featured = affiliateTools.filter((t) => t.featured);
    const result = scored.map(({ tool }) => tool);
    for (const t of featured) {
          if (!result.find((r) => r.id === t.id)) result.push(t);
          if (result.length >= limit) break;
    }
    return result.slice(0, limit);
}

export const getFeaturedTools = (): AffiliateTool[] => affiliateTools.filter((t) => t.featured);

export const getToolsByCategory = (cat: AffiliateTool["category"]): AffiliateTool[] =>
    affiliateTools.filter((t) => t.category === cat);
