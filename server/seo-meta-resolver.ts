import { storage } from "./storage";
import { SCAM_PAGES } from "@shared/scam-content";
import { PAGE_BODY_CONTENT } from "./seo-page-body-content";

const BASE_URL = "https://www.getcyberright.com";

const DEFAULT_TITLE = "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors";
const DEFAULT_DESCRIPTION = "Protect your family online with free cybersecurity education, AI-powered scam detection tools, data broker removal, and safety training. Trusted by thousands of families worldwide.";

const OG_IMAGES: Record<string, string> = {
  "/": `${BASE_URL}/og/trust-metrics.png`,
  "/scam-checker": `${BASE_URL}/og/scam-guard.png`,
  "/shield": `${BASE_URL}/og/data-shield.png`,
  "/shield/next-steps": `${BASE_URL}/og/data-shield.png`,
  "/data-removal": `${BASE_URL}/og/data-shield.png`,
  "/news": `${BASE_URL}/og/news-alerts.png`,
  "/alerts": `${BASE_URL}/og/news-alerts.png`,
  "/training": `${BASE_URL}/og/training.png`,
  "/resources": `${BASE_URL}/og/education.png`,
  "/kids": `${BASE_URL}/og/education.png`,
  "/seniors": `${BASE_URL}/og/education.png`,
  "/parents": `${BASE_URL}/og/education.png`,
  "/parent-guide": `${BASE_URL}/og/education.png`,
  "/tools": `${BASE_URL}/og/scam-guard.png`,
  "/cyber-threat-radar": `${BASE_URL}/og/breaking-news.png`,
  "/threat-trends": `${BASE_URL}/og/breaking-news.png`,
  "/emergency-help": `${BASE_URL}/og/howto-hacked.png`,
  "/report-scam": `${BASE_URL}/og/scam-calls-texts.png`,
  "/awareness-hub": `${BASE_URL}/og/education.png`,
  "/faq": `${BASE_URL}/og/trust-metrics.png`,
  "/about": `${BASE_URL}/og/trust-metrics.png`,
  "/browser-extension": `${BASE_URL}/og/scam-guard.png`,
  "/breach-dashboard": `${BASE_URL}/og/data-shield.png`,
  "/password-generator": `${BASE_URL}/og/scam-guard.png`,
  "/safety-score": `${BASE_URL}/og/trust-metrics.png`,
  "/quick-assessment": `${BASE_URL}/og/trust-metrics.png`,
  "/small-business": `${BASE_URL}/og/training.png`,
  "/educators": `${BASE_URL}/og/education.png`,
  "/ai-prompts": `${BASE_URL}/og/training.png`,
  "/ai-safety": `${BASE_URL}/og/training.png`,
  "/scam-intel": `${BASE_URL}/og/scam-calls-texts.png`,
  "/guides": `${BASE_URL}/og/education.png`,
  "/pricing": `${BASE_URL}/og/trust-metrics.png`,
  "/gcr-guard-pricing": `${BASE_URL}/og/scam-guard.png`,
};

export interface PageMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: string;
  ogImage?: string;
  jsonLd: string;
  noindex?: boolean;
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function safeJsonLd(data: any): string {
  const json = JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
  return `<script type="application/ld+json">${json}</script>`;
}

function buildOrgSchema(): string {
  return safeJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GetCyberRight",
    url: BASE_URL,
    description: "Free cybersecurity education platform for families, parents, kids, and seniors.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "tips@getcyberright.com",
      contactType: "customer support",
    },
  });
}

function buildWebSiteSchema(): string {
  return safeJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GetCyberRight",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });
}

function buildBreadcrumbSchema(items: { name: string; url: string }[]): string {
  return safeJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  });
}

const STATIC_PAGE_META: Record<string, { title: string; description: string; ogType?: string }> = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    ogType: "website",
  },
  "/about": {
    title: "About GetCyberRight: Our Story & Mission | GetCyberRight",
    description: "Learn about GetCyberRight's mission to make cybersecurity education accessible to every family. Founded by real people who experienced scams firsthand.",
  },
  "/scam-checker": {
    title: "GCR Scam Guard: Analyze URLs, Emails, Messages & QR Codes",
    description: "Analyze suspicious URLs, emails, text messages, and QR codes with our AI-powered scam checker. Free manual scanning, no account required.",
  },
  "/password-generator": {
    title: "Secure Password Generator | GetCyberRight",
    description: "Generate strong, unique passwords instantly with our secure password generator. Customize length, character types, and complexity. Free to use.",
  },
  "/data-removal": {
    title: "Data Broker Removal: 501+ Sites | GetCyberRight",
    description: "Protect your privacy by removing your personal information from 501+ data broker sites. No account needed to get started.",
  },
  "/shield": {
    title: "GCR Data Shield | GetCyberRight",
    description: "Scan 500+ data brokers to find where your personal information is exposed online. Get step-by-step removal guidance or automated removal.",
  },
  "/shield/next-steps": {
    title: "What to Do After Your Data Shield Scan | GetCyberRight",
    description: "Your data was found exposed online. Follow this step-by-step guide based on your risk level to remove your data from broker sites and protect against identity theft.",
  },
  "/breach-dashboard": {
    title: "Data Breach Monitor | GetCyberRight",
    description: "Monitor your email addresses for data breaches. Get instant alerts when your personal information appears in known data breaches.",
  },
  "/cyber-threat-radar": {
    title: "Live Cyber Threat Radar | GetCyberRight",
    description: "Monitor live cybersecurity threats with our real-time Cyber Threat Radar. See active threat alerts, trending attack vectors, and security advisories.",
  },
  "/tools": {
    title: "Cybersecurity Tools & Scam Guard | GetCyberRight",
    description: "Access cybersecurity tools including an AI-powered GCR Scam Guard, secure Password Generator, Data Broker Removal, and Breach Monitor. Core tools are free.",
  },
  "/guides": {
    title: "Cybersecurity Guides for Families | GetCyberRight",
    description: "Browse expert cybersecurity guides covering phishing, identity theft, password security, data privacy, and online safety for families, seniors, and kids.",
  },
  "/alerts": {
    title: "Cyber Threat Alerts | GetCyberRight",
    description: "Stay informed with the latest cybersecurity threat alerts. Real-time warnings about active scams, malware, data breaches, and emerging threats.",
  },
  "/scam-intel": {
    title: "Scam Intelligence Center | GetCyberRight",
    description: "Deep-dive intelligence reports on how scams work, who they target, and how to protect yourself. Detailed analysis of current and emerging scam tactics.",
  },
  "/news": {
    title: "Cybersecurity News & Updates | GetCyberRight",
    description: "Stay informed with the latest cybersecurity news, data breach reports, emerging threats, and security advisories. Curated updates for families and businesses.",
  },
  "/kids": {
    title: "Kids Online Safety Lessons (Ages 8-16) | GCR",
    description: "Interactive cybersecurity lessons designed for kids and teens ages 8 to 16. Learn about password safety, spotting scams, and being a good digital citizen.",
  },
  "/seniors": {
    title: "Senior Online Safety Center | GetCyberRight",
    description: "Free cybersecurity resources designed for seniors and older adults. Learn to spot phone scams, protect your identity, and avoid romance fraud.",
  },
  "/parents": {
    title: "Parents Hub: Keep Your Family Safe Online | GetCyberRight",
    description: "Cybersecurity guides for parents. Learn about parental controls, age-appropriate device settings, and how to protect your children from online threats.",
  },
  "/training": {
    title: "Cybersecurity Training Academy | GetCyberRight",
    description: "Access cybersecurity training courses designed for beginners, families, seniors, and small businesses. Core courses are free to get started.",
  },
  "/emergency-help": {
    title: "Emergency Cyber Help | GetCyberRight",
    description: "Immediate steps to take if you have been scammed online. Emergency contacts, account recovery guidance, and financial protection steps.",
  },
  "/ai-prompts": {
    title: "406+ AI Cybersecurity Prompts | GetCyberRight",
    description: "Browse 406+ expertly crafted AI prompts for cybersecurity. Use with ChatGPT, Claude, and other AI tools to analyze threats and protect your digital life.",
  },
  "/ai-safety": {
    title: "AI Safety Guide: AI Threat Protection | GCR",
    description: "Learn how to identify and protect yourself from AI-powered scams, deepfakes, and synthetic media. Practical safety tips for the age of AI.",
  },
  "/faq": {
    title: "Cybersecurity FAQ | GetCyberRight",
    description: "Find answers to common cybersecurity questions. Learn about password security, phishing prevention, identity theft protection, and online safety.",
  },
  "/pricing": {
    title: "Plans & Pricing | GetCyberRight",
    description: "GetCyberRight is free to get started. Access AI-powered scam checking, data broker removal, safety training, and more.",
  },
  "/contact": {
    title: "Contact GetCyberRight: Get in Touch | GetCyberRight",
    description: "Contact the GetCyberRight team for questions about cybersecurity education, partnership opportunities, or to report a scam.",
  },
  "/report-scam": {
    title: "Report a Scam: Help Protect Your Community | GetCyberRight",
    description: "Report a scam to GetCyberRight and help protect others. Submit details about suspicious emails, phone calls, text messages, or websites.",
  },
  "/awareness-hub": {
    title: "Cyber Awareness Hub | GetCyberRight",
    description: "Access printable cybersecurity guides, safety checklists, and awareness resources for families, schools, and organizations.",
  },
  "/resources": {
    title: "Cybersecurity Resources | GetCyberRight",
    description: "Explore our complete library of cybersecurity resources including safety guides, interactive tools, training courses, and scam alerts.",
  },
  "/checklists": {
    title: "Cybersecurity Checklists | GetCyberRight",
    description: "Download free printable cybersecurity checklists for families, seniors, and small businesses. Step-by-step security guides.",
  },
  "/printable-guides": {
    title: "Printable Cybersecurity Guides | GetCyberRight",
    description: "Download and print free cybersecurity guides for your family, classroom, or business. Visual safety checklists and reference cards.",
  },
  "/small-business": {
    title: "Small Business Cybersecurity | GetCyberRight",
    description: "Cybersecurity resources for small businesses. Employee awareness training, security policy templates, and incident response guides.",
  },
  "/educators": {
    title: "Educator Cybersecurity Resources | GetCyberRight",
    description: "Cybersecurity teaching resources for educators. Access lesson plans, classroom activities, printable guides, and curriculum materials.",
  },
  "/cyber-hygiene": {
    title: "Cyber Hygiene: Daily Safety Habits | GCR",
    description: "Learn essential cyber hygiene practices to protect yourself daily. Simple, actionable habits for passwords, software updates, and safe browsing.",
  },
  "/travel-safety": {
    title: "Travel Cybersecurity Tips | GetCyberRight",
    description: "Protect your digital life while traveling. Tips for secure Wi-Fi use, device protection, avoiding travel scams, and keeping data safe.",
  },
  "/threat-trends": {
    title: "Cybersecurity Threat Trends | GetCyberRight",
    description: "Track the latest cybersecurity threat trends and attack patterns. Data-driven insights on emerging scams and security threats.",
  },
  "/quick-assessment": {
    title: "Quick Security Assessment | GetCyberRight",
    description: "Take our free 5-minute cybersecurity assessment to evaluate your online safety habits. Get personalized recommendations.",
  },
  "/safety-score": {
    title: "Your Cyber Safety Score | GetCyberRight",
    description: "Calculate your personal cyber safety score based on your security practices. Get a detailed breakdown and actionable steps.",
  },
  "/parent-guide": {
    title: "Parent's Guide to Online Safety | GCR",
    description: "A complete guide for parents to keep children safe online. Covers parental controls, age-appropriate conversations, and device setup.",
  },
  "/our-mission": {
    title: "Our Mission | GetCyberRight",
    description: "GetCyberRight's mission is to make cybersecurity education simple, practical, and available to every family.",
  },
  "/support": {
    title: "Support & Help Center | GetCyberRight",
    description: "Get help with GetCyberRight tools and resources. Find answers to common questions and troubleshooting guides.",
  },
  "/support-the-mission": {
    title: "Support the Mission | GetCyberRight",
    description: "Support GetCyberRight's mission to make cybersecurity education accessible to everyone.",
  },
  "/search": {
    title: "Search GetCyberRight: Find Cybersecurity Resources",
    description: "Search across all GetCyberRight resources including guides, tools, training courses, scam alerts, and safety checklists.",
  },
  "/feedback": {
    title: "Share Your Feedback: Help Us Improve GetCyberRight",
    description: "Tell us what you think about GetCyberRight. Your feedback helps us build better cybersecurity education tools.",
  },
  "/privacy": {
    title: "Privacy Policy | GetCyberRight",
    description: "Read the GetCyberRight privacy policy. Learn how we collect, use, and protect your personal information.",
  },
  "/terms": {
    title: "Terms of Service | GetCyberRight",
    description: "Review the GetCyberRight terms of service and guidelines for using our cybersecurity education platform.",
  },
  "/accessibility": {
    title: "Accessibility Statement | GetCyberRight",
    description: "GetCyberRight is committed to digital accessibility for all users, including those with disabilities.",
  },
  "/security": {
    title: "Security at GetCyberRight: How We Protect Your Data",
    description: "Learn about the security measures and practices GetCyberRight uses to protect your data and privacy.",
  },
  "/advertise": {
    title: "Advertise with GetCyberRight",
    description: "Partner with GetCyberRight to reach families and businesses who care about online safety.",
  },
  "/partner-deck": {
    title: "Partner with GetCyberRight",
    description: "Explore partnership opportunities with GetCyberRight to advance cybersecurity education.",
  },
  "/experience": {
    title: "The GCR Experience | GetCyberRight",
    description: "A first-of-its-kind family event where digital safety meets real fun. Interactive stations, vetted experts, and activities for every age.",
  },
  "/browser-extension": {
    title: "GCR Scam Guard Chrome Extension | GCR",
    description: "Protect yourself while browsing with the GCR Scam Guard Chrome extension. Real-time scam detection, phishing alerts, and website safety ratings.",
  },
  "/gcr-guard-pricing": {
    title: "GCR Guard Plans & Pricing | GetCyberRight",
    description: "Choose the right GCR Guard plan for your protection needs. Free, Essential, and Professional tiers available.",
  },
};

const TOPIC_META: Record<string, { title: string; description: string }> = {
  "identity-theft": {
    title: "Identity Theft Prevention | GetCyberRight",
    description: "Comprehensive resources on identity theft prevention, detection, and recovery. Learn how to protect your personal information and what to do if your identity is stolen.",
  },
  "online-scams": {
    title: "Online Scams: Recognize & Avoid | GetCyberRight",
    description: "Learn about the latest online scams, how they work, and how to protect yourself. Covers phishing, romance scams, tech support fraud, and more.",
  },
  "phishing-attacks": {
    title: "Phishing Attacks: Spot & Stop Them | GCR",
    description: "Everything you need to know about phishing attacks. Learn to identify phishing emails, texts, and websites before they compromise your accounts.",
  },
  "cyber-safety-seniors": {
    title: "Cyber Safety for Seniors | GetCyberRight",
    description: "Cybersecurity resources designed specifically for older adults. Covers phone scams, identity theft, romance fraud, and technology safety.",
  },
  "cyber-safety-kids": {
    title: "Cyber Safety for Kids | GetCyberRight",
    description: "Help keep children safe online with age-appropriate cybersecurity education, parental controls guidance, and digital citizenship lessons.",
  },
  "password-security": {
    title: "Password Security Tips | GetCyberRight",
    description: "Learn password security best practices. Create strong passwords, use password managers, and protect your accounts from credential theft.",
  },
  "privacy-protection": {
    title: "Privacy Protection | GetCyberRight",
    description: "Take control of your online privacy. Learn about data brokers, privacy settings, data removal, and how to minimize your digital footprint.",
  },
  "device-security": {
    title: "Device Security Guide | GetCyberRight",
    description: "Secure all your devices from phones to smart home gadgets. Covers updates, antivirus, encryption, and safe device setup.",
  },
  "data-breaches": {
    title: "Data Breaches: Respond & Recover | GCR",
    description: "Stay informed about data breaches affecting your accounts. Learn how to check for breaches, respond quickly, and protect yourself.",
  },
  "social-media-security": {
    title: "Social Media Security | GetCyberRight",
    description: "Secure your social media accounts and protect your privacy. Covers account settings, scam awareness, and safe sharing practices.",
  },
};

const FAQ_ITEMS = [
  { q: "What is GetCyberRight?", a: "GetCyberRight is a mission-driven platform dedicated to family cyber safety. We provide educational resources, tools, and guidance to help families navigate the online world safely." },
  { q: "Is GetCyberRight free?", a: "Our educational content, articles, guides, and core scam checking tools are free to use. We also offer paid subscription plans that unlock advanced features like automatic page scanning and data monitoring." },
  { q: "What is GCR Scam Guard?", a: "GCR Scam Guard is our Chrome browser extension that protects you from scams in real time as you browse. It can automatically scan pages for threats, detect fake websites, and warn you before you interact with suspicious content." },
  { q: "What features are available on the free plan?", a: "Free users can manually scan any page by right-clicking and selecting 'Scan with GCR Scam Guard' or clicking the extension icon. You get full AI-powered threat analysis on every manual scan at no cost." },
  { q: "What do the scan results mean?", a: "Scan results use clear labels: 'Verified Safe' means no threats found, 'Low Risk' means minor concerns, 'Caution Advised' means notable warning signs, 'High Risk Detected' means strong indicators of a scam, and 'Confirmed Threat' means the content matches known scam patterns." },
  { q: "How can I protect my children online?", a: "Start with open conversations about online safety. Use our Youth Safety Hub for age-appropriate resources, set up parental controls on devices, and teach them to recognize suspicious messages and requests." },
  { q: "How can I help my elderly parents stay safe online?", a: "Our Senior Safety Center provides resources specifically designed for older adults. Focus on teaching them to recognize common scams, never share personal information with strangers, and verify requests through official channels." },
  { q: "What should I do if a family member falls for a scam?", a: "Act quickly. Contact your bank if financial information was shared. Change passwords for any compromised accounts. Report the scam to local authorities and relevant agencies like the FTC. Visit our Emergency Help page for step-by-step guidance." },
  { q: "I think I've been hacked. What should I do?", a: "Immediately change passwords on all important accounts, starting with email and banking. Enable two-factor authentication where available. Check for unauthorized transactions and contact your bank if financial accounts may be compromised." },
  { q: "How do you protect my data?", a: "We use industry-standard security measures including HTTPS encryption, secure authentication, and minimal data collection. We never sell your data or share it with advertisers." },
  { q: "What subscription plans do you offer?", a: "We offer three tiers: Free (manual scans), Essential (adds Auto-Protect for automatic page scanning), and Professional (adds scan history, safety scores, family profiles, and priority support)." },
  { q: "Where can I report a scam?", a: "In the US, report to the FTC at reportfraud.ftc.gov or the FBI at ic3.gov. In the UK, use Action Fraud. Our Emergency Help page provides region-specific reporting information." },
];

function buildFAQPageSchema(): string {
  return safeJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  });
}

function buildSoftwareAppSchema(name: string, description: string, url: string): string {
  return safeJsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `${BASE_URL}${url}`,
    applicationCategory: "SecurityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "GetCyberRight",
      url: BASE_URL,
    },
  });
}

function buildEducationalOrgSchema(): string {
  return safeJsonLd({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "GetCyberRight",
    url: BASE_URL,
    description: "Free cybersecurity education platform for families, parents, kids, and seniors.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "4030 Wake Forest Rd STE 349",
      addressLocality: "Raleigh",
      addressRegion: "NC",
      postalCode: "27609",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "tips@getcyberright.com",
      contactType: "customer support",
    },
    sameAs: [
      "https://www.facebook.com/getcyberright",
      "https://www.linkedin.com/company/getcyberright",
      "https://www.instagram.com/getcyberright",
    ],
  });
}

function getDefaultMeta(path: string): PageMeta {
  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    canonicalUrl: `${BASE_URL}${path === "/" ? "" : path}`,
    ogType: "website",
    jsonLd: `${buildOrgSchema()}\n    ${buildWebSiteSchema()}`,
  };
}

function get404Meta(): PageMeta {
  return {
    title: "Page Not Found | GetCyberRight",
    description: "The page you're looking for doesn't exist. Visit GetCyberRight for free cybersecurity education, tools, and safety resources for families.",
    canonicalUrl: "",
    ogType: "website",
    jsonLd: buildOrgSchema(),
    noindex: true,
  };
}

export async function resolvePageMeta(urlPath: string): Promise<PageMeta> {
  const path = urlPath.split("?")[0].split("#")[0];

  if (path === "/") {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      canonicalUrl: `${BASE_URL}/`,
      ogType: "website",
      ogImage: OG_IMAGES["/"],
      jsonLd: `${buildOrgSchema()}\n    ${buildWebSiteSchema()}`,
    };
  }

  const staticMeta = STATIC_PAGE_META[path];
  if (staticMeta) {
    const breadcrumbs = buildBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: staticMeta.title.split("|")[0].split(":")[0].trim(), url: path },
    ]);

    let extraSchema = "";

    if (path === "/faq") {
      extraSchema = `\n    ${buildFAQPageSchema()}`;
    }

    if (path === "/about" || path === "/our-mission") {
      extraSchema = `\n    ${buildEducationalOrgSchema()}`;
    }

    const toolSchemas: Record<string, { name: string; desc: string }> = {
      "/scam-checker": { name: "GCR Scam Guard", desc: "AI-powered scam detection tool that analyzes URLs, emails, phone numbers, and messages for potential threats." },
      "/password-generator": { name: "Secure Password Generator", desc: "Generate strong, unique passwords instantly with customizable length and character types." },
      "/shield": { name: "GCR Data Shield", desc: "Scan 500+ data brokers to find and remove your exposed personal information online." },
      "/breach-dashboard": { name: "Data Breach Monitor", desc: "Monitor your email addresses for data breaches and get instant alerts when your information appears in known breaches." },
      "/cyber-threat-radar": { name: "Cyber Threat Radar", desc: "Real-time cybersecurity threat monitoring with live threat alerts, trending attack vectors, and security advisories." },
      "/quick-assessment": { name: "Cybersecurity Quick Assessment", desc: "Free 5-minute cybersecurity assessment to evaluate your online safety habits with personalized recommendations." },
      "/safety-score": { name: "Personal Cyber Safety Score", desc: "Calculate your personal cyber safety score based on your security practices and get actionable improvement steps." },
    };

    if (toolSchemas[path]) {
      const tool = toolSchemas[path];
      extraSchema = `\n    ${buildSoftwareAppSchema(tool.name, tool.desc, path)}`;
    }

    return {
      title: staticMeta.title,
      description: staticMeta.description,
      canonicalUrl: `${BASE_URL}${path}`,
      ogType: staticMeta.ogType || "website",
      ogImage: OG_IMAGES[path],
      jsonLd: `${buildOrgSchema()}\n    ${breadcrumbs}${extraSchema}`,
    };
  }

  const guideMatch = path.match(/^\/guides\/([a-z0-9-]+)$/);
  if (guideMatch) {
    try {
      const guide = await storage.getGuideBySlug(guideMatch[1]);
      if (guide && guide.status === "published") {
        const breadcrumbs = buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Guides", url: "/guides" },
          { name: guide.title, url: `/guides/${guide.slug}` },
        ]);
        const articleSchema = safeJsonLd({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.metaDescription || guide.title,
          url: `${BASE_URL}/guides/${guide.slug}`,
          publisher: { "@type": "Organization", name: "GetCyberRight", url: BASE_URL },
          datePublished: guide.publishedAt?.toISOString() || new Date().toISOString(),
          dateModified: guide.updatedAt?.toISOString() || guide.publishedAt?.toISOString() || new Date().toISOString(),
          keywords: guide.tags?.join(", "),
        });
        return {
          title: `${guide.title} | GetCyberRight`,
          description: guide.metaDescription || guide.title,
          canonicalUrl: `${BASE_URL}/guides/${guide.slug}`,
          ogType: "article",
          jsonLd: `${breadcrumbs}\n    ${articleSchema}`,
        };
      }
    } catch (e) {}
  }

  const newsMatch = path.match(/^\/news\/([a-z0-9-]+)$/);
  if (newsMatch) {
    try {
      const article = await storage.getNewsArticleBySlug(newsMatch[1]);
      if (article) {
        const breadcrumbs = buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "News", url: "/news" },
          { name: article.title, url: `/news/${article.slug}` },
        ]);
        const articleSchema = safeJsonLd({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt || article.title,
          url: `${BASE_URL}/news/${article.slug}`,
          publisher: { "@type": "Organization", name: "GetCyberRight", url: BASE_URL },
          datePublished: article.publishedAt?.toISOString() || new Date().toISOString(),
        });
        return {
          title: `${article.title} | GetCyberRight`,
          description: article.excerpt || article.title,
          canonicalUrl: `${BASE_URL}/news/${article.slug}`,
          ogType: "article",
          ogImage: `${BASE_URL}/api/social-images/social-${article.id}.png`,
          jsonLd: `${breadcrumbs}\n    ${articleSchema}`,
        };
      }
    } catch (e) {}
  }

  const alertMatch = path.match(/^\/alerts\/([a-z0-9-]+)$/);
  if (alertMatch) {
    try {
      const alerts = await storage.getPublishedThreatAlerts();
      const alert = alerts.find(a => a.slug === alertMatch[1]);
      if (alert) {
        const breadcrumbs = buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Threat Alerts", url: "/alerts" },
          { name: alert.threatName, url: `/alerts/${alert.slug}` },
        ]);
        const articleSchema = safeJsonLd({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: alert.threatName,
          description: alert.description?.substring(0, 160) || alert.threatName,
          url: `${BASE_URL}/alerts/${alert.slug}`,
          publisher: { "@type": "Organization", name: "GetCyberRight", url: BASE_URL },
          datePublished: alert.publishedAt?.toISOString() || new Date().toISOString(),
        });
        return {
          title: `${alert.threatName} - Cyber Threat Alert | GetCyberRight`,
          description: alert.description?.substring(0, 160) || alert.threatName,
          canonicalUrl: `${BASE_URL}/alerts/${alert.slug}`,
          ogType: "article",
          jsonLd: `${breadcrumbs}\n    ${articleSchema}`,
        };
      }
    } catch (e) {}
  }

  const scamIntelMatch = path.match(/^\/scam-intel\/([a-z0-9-]+)$/);
  if (scamIntelMatch) {
    try {
      const scams = await storage.getPublishedScamIntel();
      const scam = scams.find(s => s.slug === scamIntelMatch[1]);
      if (scam) {
        const breadcrumbs = buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Scam Intelligence", url: "/scam-intel" },
          { name: scam.scamName, url: `/scam-intel/${scam.slug}` },
        ]);
        return {
          title: `${scam.scamName} - Scam Intelligence | GetCyberRight`,
          description: scam.metaDescription || `Learn about ${scam.scamName} and how to protect yourself.`,
          canonicalUrl: `${BASE_URL}/scam-intel/${scam.slug}`,
          ogType: "article",
          jsonLd: breadcrumbs,
        };
      }
    } catch (e) {}
  }

  const scamMatch = path.match(/^\/scams\/([a-z0-9-]+)$/);
  if (scamMatch) {
    const scam = SCAM_PAGES.find(s => s.slug === scamMatch[1]);
    if (scam) {
      const breadcrumbs = buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Scam Database", url: "/scams" },
        { name: scam.title, url: `/scams/${scam.slug}` },
      ]);
      return {
        title: scam.metaTitle,
        description: scam.metaDescription,
        canonicalUrl: `${BASE_URL}/scams/${scam.slug}`,
        ogType: "article",
        jsonLd: breadcrumbs,
      };
    }
  }

  const topicMatch = path.match(/^\/topics\/([a-z0-9-]+)$/);
  if (topicMatch) {
    const topicMeta = TOPIC_META[topicMatch[1]];
    if (topicMeta) {
      const breadcrumbs = buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: topicMeta.title.split("|")[0].trim(), url: `/topics/${topicMatch[1]}` },
      ]);
      return {
        title: topicMeta.title,
        description: topicMeta.description,
        canonicalUrl: `${BASE_URL}/topics/${topicMatch[1]}`,
        ogType: "website",
        jsonLd: breadcrumbs,
      };
    }
  }

  return get404Meta();
}

export function injectMeta(template: string, meta: PageMeta, ssrBody?: string): string {
  const ogImage = meta.ogImage || "https://www.getcyberright.com/og-image.png";
  let result = template
    .replace(/%%PAGE_TITLE%%/g, escapeAttr(meta.title))
    .replace(/%%META_DESCRIPTION%%/g, escapeAttr(meta.description))
    .replace(/%%OG_TITLE%%/g, escapeAttr(meta.title))
    .replace(/%%OG_DESCRIPTION%%/g, escapeAttr(meta.description))
    .replace(/%%OG_TYPE%%/g, meta.ogType)
    .replace(/%%OG_URL%%/g, meta.canonicalUrl || "")
    .replace(/%%OG_IMAGE%%/g, ogImage)
    .replace(/%%TWITTER_TITLE%%/g, escapeAttr(meta.title))
    .replace(/%%TWITTER_DESCRIPTION%%/g, escapeAttr(meta.description))
    .replace(/%%CANONICAL_URL%%/g, meta.canonicalUrl || "")
    .replace(/%%JSON_LD%%/g, meta.jsonLd);

  const gscVerification = process.env.GOOGLE_SITE_VERIFICATION;
  if (gscVerification) {
    result = result.replace(/%%GOOGLE_SITE_VERIFICATION%%/g, `<meta name="google-site-verification" content="${escapeAttr(gscVerification)}" />`);
  } else {
    result = result.replace(/%%GOOGLE_SITE_VERIFICATION%%/g, "");
  }

  if (meta.noindex) {
    result = result.replace(
      '<meta name="description"',
      '<meta name="robots" content="noindex, nofollow">\n    <meta name="description"'
    );
    result = result.replace(/<link rel="canonical" href="[^"]*" \/>/, '');
  }

  if (ssrBody) {
    result = result.replace(
      '<div id="root">',
      `<div id="root"><div id="ssr-content" style="font-family:Sora,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a;">${ssrBody}</div>`
    );
  }

  result = result.replace('<!--ssr-outlet-->', '');

  return result;
}
