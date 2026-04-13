import type { Metadata } from "next";
import { JsonLd } from "../components/json-ld";
import Link from "next/link";
import { HelpCircle, Shield, Mail, Lock, Users, Globe, AlertTriangle, CalendarDays, Chrome, CreditCard } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCyberBackground } from "@/components/animated-cyber-background";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity FAQ | GetCyberRight",
  description:
    "Find answers to common cybersecurity questions. Learn about password security, phishing prevention, identity theft protection, and online safety.",
  alternates: { canonical: `${BASE_URL}/faq` },
  openGraph: {
    title: "Cybersecurity FAQ | GetCyberRight",
    description:
      "Find answers to common cybersecurity questions. Learn about password security, phishing prevention, identity theft protection, and online safety.",
    url: `${BASE_URL}/faq`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/trust-metrics.png`,
        width: 1080,
        height: 1080,
        alt: "GetCyberRight FAQ",
      },
    ],
  },
};

const faqCategories = [
  {
    title: "About GetCyberRight",
    iconKey: "shield" as const,
    questions: [
      { q: "What is GetCyberRight?", a: "GetCyberRight is a mission-driven platform dedicated to family cyber safety. We provide educational resources, tools, and guidance to help families navigate the online world safely. Our content is designed for everyone, from children learning about social media to seniors protecting themselves from scams." },
      { q: "Is GetCyberRight free?", a: "Everything on GetCyberRight is completely free! All tools, features, and educational resources are available at no cost. Just create a free account to get full access to our scam checking tools, data removal, training courses, and more. We believe cybersecurity education and protection should be accessible to everyone." },
      { q: "Who creates the content on GetCyberRight?", a: "Our content is created by online safety professionals and educators who specialize in making complex topics accessible to everyday families. We reference authoritative sources from law enforcement and security agencies worldwide to ensure accuracy." },
      { q: "How is GetCyberRight different from other cybersecurity sites?", a: "We focus specifically on families and use plain language instead of technical jargon. Our content is tailored for different audiences including youth, seniors, parents, and travelers. We also provide region-specific guidance for users around the world." },
    ],
  },
  {
    title: "Newsletter and Email Subscriptions",
    iconKey: "mail" as const,
    questions: [
      { q: "What newsletters do you offer?", a: "We offer two email newsletters. Weekly Fraud Alerts provide curated cybersecurity news and scam warnings every week. Digital Safety Tips deliver practical, actionable security advice tailored to your selected audience and region." },
      { q: "How often will I receive emails?", a: "Weekly Fraud Alerts are sent once per week. Digital Safety Tips frequency depends on your preference, which you can set to daily, weekly, or monthly when subscribing." },
      { q: "How do I unsubscribe from emails?", a: "Every email includes an unsubscribe link at the bottom. Click it to immediately remove yourself from our mailing list. You can also visit the Preferences page to manage your subscriptions." },
      { q: "Can I customize what content I receive?", a: "Yes. When subscribing to Digital Safety Tips, you can select your audience type (youth, seniors, parents, or travelers) and your geographic region. This ensures you receive content most relevant to your situation." },
    ],
  },
  {
    title: "GCR Scam Guard Browser Extension",
    iconKey: "chrome" as const,
    questions: [
      { q: "What is GCR Scam Guard?", a: "GCR Scam Guard is our Chrome browser extension that protects you from scams in real time as you browse. It can automatically scan pages for threats, detect fake websites, and warn you before you interact with suspicious content." },
      { q: "How do I install and set up GCR Scam Guard?", a: "Install GCR Scam Guard from the Chrome Web Store. Then visit getcyberright.com, log into your account, go to the Extension Auth page to generate a connection token, and paste it into the extension's Settings. This links the extension to your account." },
      { q: "What features are available?", a: "All features are free! You can manually scan any page by right-clicking and selecting 'Scan with GCR Scam Guard' or clicking the extension icon. Auto-Protect, notification blocking, search safety badges, and all other features are included at no cost." },
      { q: "What does Auto-Protect do?", a: "Auto-Protect automatically scans every page you visit in the background without you having to click anything. If a threat is detected, you get an instant notification. Auto-Protect is available for free with your account." },
      { q: "What data does the extension collect?", a: "The extension sends page URLs and a summary of page content to our servers for threat analysis. It does not collect your browsing history, passwords, or form data. Your settings are stored locally in your browser. See our Privacy Policy for full details." },
      { q: "How do I disconnect the extension from my account?", a: "You can revoke your extension token at any time from your account settings on getcyberright.com. You can also uninstall the extension from Chrome at any time." },
    ],
  },
  {
    title: "Access and Features",
    iconKey: "creditcard" as const,
    questions: [
      { q: "What features are included?", a: "Every feature on GetCyberRight is free with a registered account. That includes manual and automatic scans, browser extension protection, scan history, safety scores, family profiles, data removal tools, training courses, and more." },
      { q: "How do I access all features?", a: "Simply create a free account to unlock full access to every tool and feature on GetCyberRight. There are no paid tiers. Everything is free." },
      { q: "Will GetCyberRight always be free?", a: "Yes, we are committed to making cybersecurity education and tools accessible to everyone. All features are completely free with a registered account." },
      { q: "Is there family support?", a: "Yes! Family profile support is included for free, allowing you to manage protection for multiple family members under one account." },
    ],
  },
  {
    title: "Safety Tools",
    iconKey: "lock" as const,
    questions: [
      { q: "What is the GCR Scam Guard?", a: "The GCR Scam Guard is a tool that helps you analyze suspicious URLs, phone numbers, emails, and situations. It uses both pattern-matching analysis and AI to identify potential scams and provide clear safety recommendations in plain language." },
      { q: "What do the scan results mean?", a: "Scan results use clear labels: 'Verified Safe' means no threats were found, 'Low Risk' means minor concerns, 'Caution Advised' means notable warning signs, 'High Risk Detected' means strong indicators of a scam, and 'Confirmed Threat' means the content matches known scam patterns." },
      { q: "What is the Safety Score quiz?", a: "The Safety Score quiz is an interactive assessment that evaluates your current cybersecurity habits. After completing it, you receive a personalized score and specific recommendations for improving your online safety." },
      { q: "Are your tools accurate?", a: "Our tools provide helpful guidance based on known scam patterns and AI analysis. They should be used as one factor in your decision-making, not as the sole authority. When in doubt, consult official sources or report suspicious activity to authorities." },
      { q: "Do you store the information I submit to your tools?", a: "On our servers, scan content is analyzed in real time and not permanently stored. Registered users may have server-side scan history retained for up to 90 days. The browser extension also keeps a local history of your recent scans on your device (stored in your browser, never sent to our servers). See our Privacy Policy for complete details." },
    ],
  },
  {
    title: "For Families",
    iconKey: "users" as const,
    questions: [
      { q: "How can I protect my children online?", a: "Start with open conversations about online safety. Use our Youth Safety Hub for age-appropriate resources, set up parental controls on devices, monitor online activity appropriately for their age, and teach them to recognize suspicious messages and requests." },
      { q: "How can I help my elderly parents stay safe online?", a: "Our Senior Safety Center provides resources specifically designed for older adults. Focus on teaching them to recognize common scams, never share personal information with strangers, verify requests through official channels, and ask for help when something seems suspicious." },
      { q: "What should I do if a family member falls for a scam?", a: "Act quickly. Contact your bank if financial information was shared. Change passwords for any compromised accounts. Report the scam to local authorities and relevant agencies like the FTC or Action Fraud. Visit our Emergency Help page for step-by-step guidance." },
    ],
  },
  {
    title: "Reporting and Getting Help",
    iconKey: "alert" as const,
    questions: [
      { q: "Where can I report a scam?", a: "In the US, report to the FTC at reportfraud.ftc.gov or the FBI at ic3.gov. In the UK, use Action Fraud. Other countries have their own reporting agencies. Our Emergency Help page provides region-specific reporting information." },
      { q: "I think I've been hacked. What should I do?", a: "Immediately change passwords on all important accounts, starting with email and banking. Enable two-factor authentication where available. Check for unauthorized transactions. Contact your bank if financial accounts may be compromised. Visit our Emergency Help page for detailed steps." },
      { q: "Can GetCyberRight help me recover from identity theft?", a: "While we provide educational resources and guidance, we are not a recovery service. For identity theft, contact the authorities, your financial institutions, and consider services like IdentityTheft.gov in the US. Our resources can help you understand the steps to take." },
    ],
  },
  {
    title: "Privacy and Security",
    iconKey: "globe" as const,
    questions: [
      { q: "How do you protect my data?", a: "We use industry-standard security measures including HTTPS encryption, secure authentication, and minimal data collection. We use analytics to improve your experience, but we never sell your data or share it with advertisers. See our Privacy Policy for complete details." },
      { q: "Do you use cookies?", a: "We use essential cookies for site functionality and analytics cookies to understand how visitors use the site so we can improve it. We never share your data with advertisers. You can manage cookie preferences in your browser settings." },
      { q: "How can I contact you about privacy concerns?", a: "You can reach us through our Contact page. We take privacy concerns seriously and will respond to inquiries as quickly as possible." },
    ],
  },
];

const iconMap = {
  shield: Shield,
  mail: Mail,
  chrome: Chrome,
  creditcard: CreditCard,
  lock: Lock,
  users: Users,
  alert: AlertTriangle,
  globe: Globe,
};

const LAST_REVIEWED = "March 2026";

const flatFaqItems = faqCategories.flatMap((cat) => cat.questions);

export default function FAQPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: flatFaqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "FAQ",
          item: `${BASE_URL}/faq`,
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navigation />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-background">
        <section className="relative py-16 overflow-hidden">
          <AnimatedCyberBackground />
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl">
                  <HelpCircle className="w-12 h-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-faq-title">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-slate-300">
                Find answers to common questions about staying safe online and using GetCyberRight.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-400">
                <CalendarDays className="w-4 h-4" />
                <span>Last reviewed: {LAST_REVIEWED}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-8">
              {faqCategories.map((category, categoryIndex) => {
                const IconComponent = iconMap[category.iconKey];
                return (
                  <Card key={categoryIndex} className="overflow-hidden" data-testid={`card-faq-category-${categoryIndex}`}>
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">{category.title}</h2>
                      </div>
                    </div>
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((item, itemIndex) => (
                          <AccordionItem key={itemIndex} value={`${categoryIndex}-${itemIndex}`} className="border-b last:border-b-0">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 text-left" data-testid={`button-faq-${categoryIndex}-${itemIndex}`}>
                              <span className="font-medium">{item.q}</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed" data-testid={`text-faq-answer-${categoryIndex}-${itemIndex}`}>
                              {item.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
                <p className="text-slate-300 mb-6">
                  We are here to help. Reach out to us and we will get back to you as soon as possible.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  data-testid="link-faq-contact"
                >
                  Contact Us
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
