import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  canonical?: string;
}

const defaultTitle = "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors";
const defaultDescription = "Cybersecurity tools and education for families, parents, kids, and seniors. Protect yourself from scams, data brokers, and online threats.";
const defaultKeywords = "cybersecurity, online safety, phishing protection, scam prevention, identity theft, security training";

export function SEOHead({
  title,
  description = defaultDescription,
  keywords = defaultKeywords,
  ogImage = "https://www.getcyberright.com/og-image.png",
  ogType = "website",
  canonical,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | GetCyberRight` : defaultTitle;
  const absoluteOgImage = ogImage.startsWith("http") ? ogImage : `https://www.getcyberright.com${ogImage}`;

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

    const canonicalUrl = canonical || `https://www.getcyberright.com${window.location.pathname}`;

    updateMeta("description", description);
    updateMeta("keywords", keywords);
    updateMeta("og:title", fullTitle, true);
    updateMeta("og:description", description, true);
    updateMeta("og:image", absoluteOgImage, true);
    updateMeta("og:type", ogType, true);
    updateMeta("og:url", canonicalUrl, true);
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", absoluteOgImage);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (link) {
      link.setAttribute("href", canonicalUrl);
    } else {
      link = document.createElement("link") as HTMLLinkElement;
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", canonicalUrl);
      document.head.appendChild(link);
    }
  }, [fullTitle, description, keywords, absoluteOgImage, ogType, canonical]);

  return null;
}

export const pageSEO = {
  home: {
    title: undefined,
    description: "Got a suspicious message? Check it before it costs you. Free AI-powered scam detection, data broker removal, and safety training for families, seniors, and small businesses.",
  },
  tools: {
    title: "Security Tools",
    description: "Check suspicious emails, URLs, and phone numbers for scams. AI-powered threat detection tools to keep you safe online.",
  },
  resources: {
    title: "Security Resources & Guides",
    description: "Learn to protect yourself online with easy-to-follow guides on phishing, password security, privacy, and more.",
  },
  mission: {
    title: "Our Mission",
    description: "GetCyberRight protects the people that corporate cybersecurity leaves behind. Learn about our mission and the trusted partnerships that make it possible.",
  },
  contact: {
    title: "Contact Us",
    description: "Get in touch with our cybersecurity experts. We're here to help you stay safe online.",
  },
  about: {
    title: "About Us: Digital Safety Has Never Mattered More",
    description: "Online scams have changed. GetCyberRight gives families, seniors, and small businesses the simple tools and knowledge they need to stay safe, including scam checking, data removal, and safety training.",
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
    description: "Stay informed about the latest cyber threats and scam trends. Real-time safety updates from trusted sources.",
  },
  partnerships: {
    title: "Partnership Deck",
    description: "Explore how partnering with GetCyberRight connects your brand with safety-conscious families worldwide. Mission-aligned sponsorship with full editorial independence.",
  },
  experience: {
    title: "The GetCyberRight Experience: Where Families Take Back Their Digital Safety",
    description: "A first-of-its-kind family event where digital safety meets real fun. Interactive stations, vetted experts, and activities for every age. Join the waitlist.",
  },
  security: {
    title: "Our Security Practices",
    description: "Learn how GetCyberRight keeps your data safe. Our security measures and certifications explained.",
  },
  advertising: {
    title: "Partner With Us",
    description: "Join GetCyberRight as a trusted partner. Reach families actively seeking security solutions through mission-aligned sponsorship.",
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
    title: "GCR Data Shield - Personal Data Exposure Scanner",
    description: "Scan for your exposed personal information across data broker sites and breach databases. Free exposure scan, no account required.",
  },
  childSafetyScanner: {
    title: "Child Safety Conversation Scanner",
    description: "Scan conversations for grooming patterns and protect children from online predatory behavior.",
  },
  passwordGenerator: {
    title: "Password Generator",
    description: "Create strong, secure passwords instantly. Free tool to generate random passwords that protect your accounts.",
  },
  breachDashboard: {
    title: "Breach Monitor",
    description: "Check if your email or personal data has been exposed in a data breach. Free breach monitoring for families.",
  },
  search: {
    title: "Search",
    description: "Search GetCyberRight for security guides, tools, and resources to keep your family safe online.",
  },
  parentGuide: {
    title: "Parent's Guide to Online Safety",
    description: "A complete guide for parents to protect children online. Screen time, social media, gaming safety, and age-appropriate conversations.",
  },
  travelSafety: {
    title: "Travel Safety Guide",
    description: "Stay safe online while traveling. Tips for public Wi-Fi, hotel networks, airport security, and protecting devices abroad.",
  },
  accessibility: {
    title: "Accessibility",
    description: "GetCyberRight is committed to making cybersecurity education accessible to everyone regardless of ability.",
  },
  feedback: {
    title: "Share Your Feedback",
    description: "Help us improve GetCyberRight. Share your experience and suggestions for better cybersecurity education.",
  },
  quickAssessment: {
    title: "Quick Security Assessment",
    description: "Take a quick assessment to find out how secure your online habits are. Get personalized recommendations in minutes.",
  },
  safetyScore: {
    title: "Your Safety Score",
    description: "Calculate your family's online safety score and get actionable steps to improve your cybersecurity posture.",
  },
  printableGuides: {
    title: "Printable Safety Guides",
    description: "Download and print cybersecurity guides for your family. Easy reference cards for passwords, phishing, and more.",
  },
  scamChecker: {
    title: "Scam Checker",
    description: "Check suspicious messages, emails, URLs, and phone numbers for scams. AI-powered threat analysis to keep you safe.",
  },
};
