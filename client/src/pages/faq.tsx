import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Shield, Mail, Lock, Users, Globe, AlertTriangle, CalendarDays } from "lucide-react";
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
        q: "Is GetCyberRight really free?",
        a: "Yes, everything on GetCyberRight is free to use. We believe everyone deserves access to cybersecurity education regardless of their financial situation. Our mission is to protect families, not profit from them."
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
    title: "Safety Tools",
    icon: Lock,
    questions: [
      {
        q: "What is the Scam Checker?",
        a: "The Scam Checker is a free tool that helps you analyze suspicious URLs, phone numbers, and situations. It uses both rule-based analysis and AI to identify potential scams and provide safety recommendations."
      },
      {
        q: "What is the Safety Score quiz?",
        a: "The Safety Score quiz is an interactive assessment that evaluates your current cybersecurity habits. After completing it, you receive a personalized score and specific recommendations for improving your online safety."
      },
      {
        q: "Are your tools accurate?",
        a: "Our tools provide helpful guidance based on known scam patterns and security best practices. However, they should be used as one factor in your decision-making, not as the sole authority. When in doubt, consult official sources or report suspicious activity to authorities."
      },
      {
        q: "Do you store the information I submit to your tools?",
        a: "We do not store personal information you submit to our scam checker or other tools. Your privacy is important to us. See our Privacy Policy for complete details on how we handle data."
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

const LAST_REVIEWED = "February 2026";

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
    <div className="min-h-screen bg-background">
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
    </div>
  );
}
