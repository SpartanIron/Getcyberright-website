import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Shield, Mail, Lock, Users, Globe, AlertTriangle, CalendarDays, Chrome, CreditCard } from "lucide-react";
import { AnimatedCyberBackground } from "@/components/animated-cyber-background";
import { useSEO } from "@/hooks/use-seo";
import { Link } from "wouter";
import { StructuredData } from "@/components/structured-data";
import type { FAQData } from "@/components/structured-data";

const faqCategories = [
  {
    title: "About GetCyberRight",
    icon: Shield,
    questions: [
      {
        q: "What is GetCyberRight?",
        a: "GetCyberRight is a mission-driven platform dedicated to family cyber safety. We provide educational resources, tools, and guidance to help families navigate the online world safely. Our content is designed for everyone, from children learning about social media to seniors protecting themselves from scams."
      },
      {
        q: "Is GetCyberRight free?",
        a: "Our educational content, articles, guides, and core scam checking tools are free to use. We also offer paid subscription plans (Essential and Professional) that unlock advanced features like automatic page scanning, scan history, family profiles, and ongoing data monitoring. We believe foundational cybersecurity education should be accessible to everyone."
      },
      {
        q: "Who creates the content on GetCyberRight?",
        a: "Our content is created by online safety professionals and educators who specialize in making complex topics accessible to everyday families. We reference authoritative sources from law enforcement and security agencies worldwide to ensure accuracy."
      },
      {
        q: "How is GetCyberRight different from other cybersecurity sites?",
        a: "We focus specifically on families and use plain language instead of technical jargon. Our content is tailored for different audiences including youth, seniors, parents, and travelers. We also provide region-specific guidance for users around the world."
      }
    ]
  },
  {
    title: "Newsletter and Email Subscriptions",
    icon: Mail,
    questions: [
      {
        q: "What newsletters do you offer?",
        a: "We offer two email newsletters. Weekly Fraud Alerts provide curated cybersecurity news and scam warnings every week. Digital Safety Tips deliver practical, actionable security advice tailored to your selected audience and region."
      },
      {
        q: "How often will I receive emails?",
        a: "Weekly Fraud Alerts are sent once per week. Digital Safety Tips frequency depends on your preference, which you can set to daily, weekly, or monthly when subscribing."
      },
      {
        q: "How do I unsubscribe from emails?",
        a: "Every email includes an unsubscribe link at the bottom. Click it to immediately remove yourself from our mailing list. You can also visit the Preferences page to manage your subscriptions."
      },
      {
        q: "Can I customize what content I receive?",
        a: "Yes. When subscribing to Digital Safety Tips, you can select your audience type (youth, seniors, parents, or travelers) and your geographic region. This ensures you receive content most relevant to your situation."
      }
    ]
  },
  {
    title: "GCR Scam Guard Browser Extension",
    icon: Chrome,
    questions: [
      {
        q: "What is GCR Scam Guard?",
        a: "GCR Scam Guard is our Chrome browser extension that protects you from scams in real time as you browse. It can automatically scan pages for threats, detect fake websites, and warn you before you interact with suspicious content."
      },
      {
        q: "How do I install and set up GCR Scam Guard?",
        a: "Install GCR Scam Guard from the Chrome Web Store. Then visit getcyberright.com, log into your account, go to the Extension Auth page to generate a connection token, and paste it into the extension's Settings. This links the extension to your account and subscription."
      },
      {
        q: "What features are available on the free plan?",
        a: "Free users can manually scan any page by right-clicking and selecting 'Scan with GCR Scam Guard' or clicking the extension icon. You get full AI-powered threat analysis on every manual scan at no cost."
      },
      {
        q: "What does Auto-Protect do?",
        a: "Auto-Protect automatically scans every page you visit in the background without you having to click anything. If a threat is detected, you get an instant notification. Auto-Protect is available on the Essential plan and above."
      },
      {
        q: "What data does the extension collect?",
        a: "The extension sends page URLs and a summary of page content to our servers for threat analysis. It does not collect your browsing history, passwords, or form data. Your settings are stored locally in your browser. See our Privacy Policy for full details."
      },
      {
        q: "How do I disconnect the extension from my account?",
        a: "You can revoke your extension token at any time from your account settings on getcyberright.com. You can also uninstall the extension from Chrome at any time."
      }
    ]
  },
  {
    title: "Subscriptions and Pricing",
    icon: CreditCard,
    questions: [
      {
        q: "What subscription plans do you offer?",
        a: "We offer three tiers: Free (manual scans on the website and extension), Essential (adds Auto-Protect for automatic page scanning), and Professional (adds scan history, safety scores, family profiles, and priority support). Visit our GCR Scam Guard Pricing page for current pricing."
      },
      {
        q: "How do I upgrade or change my plan?",
        a: "Your subscription is managed through your GetCyberRight account. Contact our support team to change your plan. Your new features will be available immediately after your plan is updated."
      },
      {
        q: "Can I cancel my subscription?",
        a: "Yes, you can cancel at any time by contacting our support team. After cancellation, you will retain access to paid features until the end of your current billing period, then revert to the free plan."
      },
      {
        q: "Is there a family plan?",
        a: "Our Professional plan includes family profile support, allowing you to manage protection for multiple family members under one account."
      }
    ]
  },
  {
    title: "Safety Tools",
    icon: Lock,
    questions: [
      {
        q: "What is the GCR Scam Guard?",
        a: "The GCR Scam Guard is a tool that helps you analyze suspicious URLs, phone numbers, emails, and situations. It uses both pattern-matching analysis and AI to identify potential scams and provide clear safety recommendations in plain language."
      },
      {
        q: "What do the scan results mean?",
        a: "Scan results use clear labels: 'Verified Safe' means no threats were found, 'Low Risk' means minor concerns, 'Caution Advised' means notable warning signs, 'High Risk Detected' means strong indicators of a scam, and 'Confirmed Threat' means the content matches known scam patterns."
      },
      {
        q: "What is the Safety Score quiz?",
        a: "The Safety Score quiz is an interactive assessment that evaluates your current cybersecurity habits. After completing it, you receive a personalized score and specific recommendations for improving your online safety."
      },
      {
        q: "Are your tools accurate?",
        a: "Our tools provide helpful guidance based on known scam patterns and AI analysis. They should be used as one factor in your decision-making, not as the sole authority. When in doubt, consult official sources or report suspicious activity to authorities."
      },
      {
        q: "Do you store the information I submit to your tools?",
        a: "On our servers, scan content is analyzed in real time and not permanently stored for free users. Professional subscribers may have server-side scan history retained for up to 90 days. The browser extension also keeps a local history of your recent scans on your device (stored in your browser, never sent to our servers). See our Privacy Policy for complete details."
      }
    ]
  },
  {
    title: "For Families",
    icon: Users,
    questions: [
      {
        q: "How can I protect my children online?",
        a: "Start with open conversations about online safety. Use our Youth Safety Hub for age-appropriate resources, set up parental controls on devices, monitor online activity appropriately for their age, and teach them to recognize suspicious messages and requests."
      },
      {
        q: "How can I help my elderly parents stay safe online?",
        a: "Our Senior Safety Center provides resources specifically designed for older adults. Focus on teaching them to recognize common scams, never share personal information with strangers, verify requests through official channels, and ask for help when something seems suspicious."
      },
      {
        q: "What should I do if a family member falls for a scam?",
        a: "Act quickly. Contact your bank if financial information was shared. Change passwords for any compromised accounts. Report the scam to local authorities and relevant agencies like the FTC or Action Fraud. Visit our Emergency Help page for step-by-step guidance."
      }
    ]
  },
  {
    title: "Reporting and Getting Help",
    icon: AlertTriangle,
    questions: [
      {
        q: "Where can I report a scam?",
        a: "In the US, report to the FTC at reportfraud.ftc.gov or the FBI at ic3.gov. In the UK, use Action Fraud. Other countries have their own reporting agencies. Our Emergency Help page provides region-specific reporting information."
      },
      {
        q: "I think I've been hacked. What should I do?",
        a: "Immediately change passwords on all important accounts, starting with email and banking. Enable two-factor authentication where available. Check for unauthorized transactions. Contact your bank if financial accounts may be compromised. Visit our Emergency Help page for detailed steps."
      },
      {
        q: "Can GetCyberRight help me recover from identity theft?",
        a: "While we provide educational resources and guidance, we are not a recovery service. For identity theft, contact the authorities, your financial institutions, and consider services like IdentityTheft.gov in the US. Our resources can help you understand the steps to take."
      }
    ]
  },
  {
    title: "Privacy and Security",
    icon: Globe,
    questions: [
      {
        q: "How do you protect my data?",
        a: "We use industry-standard security measures including HTTPS encryption, secure authentication, and minimal data collection. We use analytics to improve your experience, but we never sell your data or share it with advertisers. See our Privacy Policy for complete details."
      },
      {
        q: "Do you use cookies?",
        a: "We use essential cookies for site functionality and analytics cookies to understand how visitors use the site so we can improve it. We never share your data with advertisers. You can manage cookie preferences in your browser settings."
      },
      {
        q: "How can I contact you about privacy concerns?",
        a: "You can reach us through our Contact page. We take privacy concerns seriously and will respond to inquiries as quickly as possible."
      }
    ]
  }
];

const LAST_REVIEWED = "March 2026";

export default function FAQ() {
  useSEO({
    title: "Frequently Asked Questions | GetCyberRight",
    description: "Find answers to common questions about GetCyberRight, online safety, our tools, and how to protect your family from cyber threats.",
    keywords: "FAQ, frequently asked questions, cyber safety help, online safety questions, GetCyberRight support"
  });

  const faqStructuredData: FAQData = {
    type: "FAQPage",
    items: faqCategories.flatMap((cat) =>
      cat.questions.map((q) => ({ question: q.q, answer: q.a }))
    ),
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background">
      <StructuredData data={faqStructuredData} />
      <section className="relative py-16 overflow-hidden">
        <AnimatedCyberBackground />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl">
                <HelpCircle className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
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
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg">
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">{category.title}</h2>
                  </div>
                </div>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`${categoryIndex}-${itemIndex}`} className="border-b last:border-b-0">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 text-left">
                          <span className="font-medium">{item.q}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-slate-300 mb-6">
                We are here to help. Reach out to us and we will get back to you as soon as possible.
              </p>
              <Link href="/contact">
                <a className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Contact Us
                </a>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
