import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  canonical?: string;
}

const defaultTitle = "GetCyberRight - Cybersecurity Education for Everyone";
const defaultDescription = "Free cybersecurity tools and education for families, parents, kids, and seniors. 100% free, always. Protect yourself from scams, data brokers, and online threats.";
const defaultKeywords = "cybersecurity, online safety, phishing protection, scam prevention, identity theft, security training";

export function SEOHead({
  title,
  description = defaultDescription,
  keywords = defaultKeywords,
  ogImage = "/og-image.png",
  ogType = "website",
  canonical,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | GetCyberRight` : defaultTitle;

  useEffect(() => {
    document.title = fullTitle;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    updateMeta("description", description);
    updateMeta("keywords", keywords);
    updateMeta("og:title", fullTitle, true);
    updateMeta("og:description", description, true);
    updateMeta("og:image", ogImage, true);
    updateMeta("og:type", ogType, true);
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", ogImage);

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (link) {
        link.setAttribute("href", canonical);
      } else {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        link.setAttribute("href", canonical);
        document.head.appendChild(link);
      }
    }
  }, [fullTitle, description, keywords, ogImage, ogType, canonical]);

  return null;
}

export const pageSEO = {
  home: {
    title: undefined,
    description: "Free cybersecurity tools for families, parents, kids, and seniors. Check scams, remove your data from brokers, and learn to stay safe online. 100% free, always.",
  },
  tools: {
    title: "Free Security Tools",
    description: "Check suspicious emails, URLs, and phone numbers for scams. Free AI-powered threat detection tools to keep you safe online.",
  },
  resources: {
    title: "Security Resources & Guides",
    description: "Learn to protect yourself online with easy-to-follow guides on phishing, password security, privacy, and more.",
  },
  pricing: {
    title: "Our Promise - Everything Free",
    description: "GetCyberRight is 100% free for families. No hidden fees, no premium tiers. Every tool and resource is yours at no cost, forever.",
  },
  contact: {
    title: "Contact Us",
    description: "Get in touch with our cybersecurity experts. We're here to help you stay safe online.",
  },
  about: {
    title: "About Us",
    description: "Learn about GetCyberRight's mission to make cybersecurity accessible to everyone through education and practical tools.",
  },
  login: {
    title: "Sign In",
    description: "Sign in to your GetCyberRight account to access free security tools and personalized protection.",
  },
  register: {
    title: "Create Account",
    description: "Join GetCyberRight to access free security tools and protect yourself from online threats.",
  },
  dashboard: {
    title: "Dashboard",
    description: "Your personal security dashboard. Monitor threats, track your progress, and manage your account.",
  },
  emergencyHelp: {
    title: "Emergency Help",
    description: "Been scammed? Get immediate help and guidance on what to do next. Report fraud and protect yourself.",
  },
  reportScam: {
    title: "Report a Scam",
    description: "Help protect others by reporting scams. Your report helps us track and warn the community about new threats.",
  },
  kids: {
    title: "Kids Digital Safety Hub",
    description: "Fun, interactive cybersecurity lessons for kids ages 8-16. Teach children to stay safe online.",
  },
  seniors: {
    title: "Seniors Safety Hub",
    description: "Clear, jargon-free guidance to help seniors avoid scams and use technology confidently.",
  },
  parents: {
    title: "Parents Guide",
    description: "Protect your family online. Age-appropriate guides and tools for keeping kids safe on the internet.",
  },
  educators: {
    title: "Educator Resources",
    description: "Free cybersecurity curriculum and teaching materials for classrooms and organizations.",
  },
  smallBusiness: {
    title: "Small Business Security",
    description: "Affordable security training and tools designed specifically for small businesses.",
  },
  aiSafety: {
    title: "AI & Cyber Safety",
    description: "Learn about AI-powered threats including deepfakes, voice cloning, and how to protect yourself.",
  },
  terms: {
    title: "Terms of Service",
    description: "Read GetCyberRight's terms of service. Learn about our policies and your rights when using our platform.",
  },
  privacy: {
    title: "Privacy Policy",
    description: "Learn how GetCyberRight protects your data. Our privacy policy explains what we collect and how we use it.",
  },
  events: {
    title: "Security Events & Webinars",
    description: "Join our cybersecurity events, webinars, and training sessions. Learn from experts and stay protected.",
  },
  support: {
    title: "Support Center",
    description: "Get help with GetCyberRight. Find answers to common questions and contact our support team.",
  },
  checklists: {
    title: "Security Checklists",
    description: "Printable security checklists to help you stay safe online. Simple step-by-step guides for everyone.",
  },
  threatTrends: {
    title: "Threat Trends",
    description: "Stay informed about the latest cyber threats and scam trends. Real-time threat intelligence updates.",
  },
  partnerships: {
    title: "Partnership Opportunities",
    description: "Partner with GetCyberRight to bring cybersecurity education to your community or organization.",
  },
  security: {
    title: "Our Security Practices",
    description: "Learn how GetCyberRight keeps your data safe. Our security measures and certifications explained.",
  },
  advertising: {
    title: "Advertising",
    description: "Advertise with GetCyberRight. Reach security-conscious consumers with your trusted brand.",
  },
  checkoutSuccess: {
    title: "Thank You",
    description: "Welcome to GetCyberRight. Your account is ready. Start protecting your family online today.",
  },
  notFound: {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist. Return to GetCyberRight homepage.",
  },
  training: {
    title: "Training Academy",
    description: "Learn cybersecurity through structured courses with quizzes and certificates. Paths for kids, parents, seniors, educators, and businesses.",
  },
  dataRemoval: {
    title: "Data Broker Removal",
    description: "Remove your personal information from 500+ data brokers. Scan, track, and automate data removal requests.",
  },
  childSafetyScanner: {
    title: "Child Safety Conversation Scanner",
    description: "Scan conversations for grooming patterns and protect children from online predatory behavior.",
  },
};
