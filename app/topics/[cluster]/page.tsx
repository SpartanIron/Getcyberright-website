import type { Metadata } from "next";
import PageContent from "@/pages/topic-hub";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

type PageProps = {
  params: Promise<{ cluster: string }>;
};

export const dynamic = "force-dynamic";

async function fetchAll(path: string): Promise<any[]> {
  try {
    const r = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    return r.ok ? r.json() : [];
  } catch { return []; }
}

const TOPIC_META: Record<string, { title: string; description: string }> = {
  "identity-theft": { title: "Identity Theft Prevention | GetCyberRight", description: "Comprehensive resources on identity theft prevention, detection, and recovery. Learn how to protect yourself from identity theft with our expert guides, real-time scam alerts, and practical tools." },
  "online-scams": { title: "Online Scams: Recognize & Avoid | GetCyberRight", description: "Learn about the latest online scams, how they work, and how to protect yourself. Covers phishing, romance scams, shopping fraud, and more." },
  "phishing-attacks": { title: "Phishing Attacks: Spot & Stop Them | GCR", description: "Everything you need to know about phishing attacks. Learn to identify phishing emails, texts, and websites before they trick you." },
  "cyber-safety-seniors": { title: "Cyber Safety for Seniors | GetCyberRight", description: "Cybersecurity resources designed specifically for older adults. Simple, clear guidance on avoiding scams, protecting personal information, and staying safe online." },
  "cyber-safety-kids": { title: "Cyber Safety for Kids | GetCyberRight", description: "Help keep children safe online with age-appropriate cybersecurity education, parental controls guidance, and online predator awareness." },
  "password-security": { title: "Password Security Tips | GetCyberRight", description: "Learn password security best practices. Create strong passwords, use password managers, and protect your accounts." },
  "privacy-protection": { title: "Privacy Protection | GetCyberRight", description: "Take control of your digital privacy. Guides and tools to manage your online footprint, limit data collection, remove personal information from data brokers." },
  "device-security": { title: "Device Security Guide | GetCyberRight", description: "Secure all your devices from smartphones to laptops. Learn about malware protection, software updates, secure configurations." },
  "data-breaches": { title: "Data Breaches: Respond & Recover | GCR", description: "Understand data breaches, how they happen, and what to do when your information is exposed." },
  "social-media-security": { title: "Social Media Security | GetCyberRight", description: "Protect your social media accounts and personal information. Learn about privacy settings, account security, recognizing fake profiles." },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cluster } = await params;
  const meta = TOPIC_META[cluster];

  if (meta) {
    return {
      title: meta.title,
      description: meta.description,
      alternates: { canonical: `${BASE_URL}/topics/${cluster}` },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: `${BASE_URL}/topics/${cluster}`,
        type: "website",
      },
    };
  }

  return {
    title: `${cluster.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} | GetCyberRight`,
    description: `Learn about ${cluster.replace(/-/g, " ")} and how to stay safe online.`,
    alternates: { canonical: `${BASE_URL}/topics/${cluster}` },
  };
}

export default async function TopicHubPage({ params }: PageProps) {
  const { cluster } = await params;
  const [initialGuides, initialScamIntel, initialAlerts] = await Promise.all([
    fetchAll("/api/guides"),
    fetchAll("/api/scam-intel"),
    fetchAll("/api/alerts"),
  ]);
  return <PageContent initialGuides={initialGuides} initialScamIntel={initialScamIntel} initialAlerts={initialAlerts} />;
}
