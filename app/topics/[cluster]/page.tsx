import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../../page-skeleton";
import PageContent from "@/pages/topic-hub";

const BASE_URL = "https://www.getcyberright.com";

type PageProps = {
  params: Promise<{ cluster: string }>;
};

const TOPIC_META: Record<string, { title: string; description: string }> = {
  "identity-theft": { title: "Identity Theft Prevention | GetCyberRight", description: "Comprehensive resources on identity theft prevention, detection, and recovery. Learn how to protect your personal information and what to do if your identity is stolen." },
  "online-scams": { title: "Online Scams: Recognize & Avoid | GetCyberRight", description: "Learn about the latest online scams, how they work, and how to protect yourself. Covers phishing, romance scams, tech support fraud, and more." },
  "phishing-attacks": { title: "Phishing Attacks: Spot & Stop Them | GCR", description: "Everything you need to know about phishing attacks. Learn to identify phishing emails, texts, and websites before they compromise your accounts." },
  "cyber-safety-seniors": { title: "Cyber Safety for Seniors | GetCyberRight", description: "Cybersecurity resources designed specifically for older adults. Covers phone scams, identity theft, romance fraud, and technology safety." },
  "cyber-safety-kids": { title: "Cyber Safety for Kids | GetCyberRight", description: "Help keep children safe online with age-appropriate cybersecurity education, parental controls guidance, and digital citizenship lessons." },
  "password-security": { title: "Password Security Tips | GetCyberRight", description: "Learn password security best practices. Create strong passwords, use password managers, and protect your accounts from credential theft." },
  "privacy-protection": { title: "Privacy Protection | GetCyberRight", description: "Take control of your online privacy. Learn about data brokers, privacy settings, data removal, and how to minimize your digital footprint." },
  "device-security": { title: "Device Security Guide | GetCyberRight", description: "Secure all your devices from phones to smart home gadgets. Covers updates, antivirus, encryption, and safe device setup." },
  "data-breaches": { title: "Data Breaches: Respond & Recover | GCR", description: "Stay informed about data breaches affecting your accounts. Learn how to check for breaches, respond quickly, and protect yourself." },
  "social-media-security": { title: "Social Media Security | GetCyberRight", description: "Secure your social media accounts and protect your privacy. Covers account settings, scam awareness, and safe sharing practices." },
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

export default function TopicClusterPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
