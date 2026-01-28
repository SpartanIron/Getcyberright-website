import { PageBanner } from "@/components/page-banner";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Mail, 
  MessageSquare, 
  FileText,
  AlertTriangle,
  BookOpen,
  Shield,
  Clock,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import supportImage from "@/assets/banners/contact-banner.png";

const supportOptions = [
  {
    icon: HelpCircle,
    title: "General Questions",
    description: "Questions about our tools, resources, or how to use the website",
    email: "support@getcyberright.com",
    response: "Within 24-48 hours"
  },
  {
    icon: AlertTriangle,
    title: "Report a Scam",
    description: "Share scam attempts you've encountered to help protect others",
    email: "scams@getcyberright.com",
    response: "Reviewed within 24 hours"
  },
  {
    icon: FileText,
    title: "Content Corrections",
    description: "Found an error or outdated information? Let us know",
    email: "content@getcyberright.com",
    response: "Within 48 hours"
  },
  {
    icon: MessageSquare,
    title: "Feedback & Suggestions",
    description: "Ideas for new features, tools, or content you'd like to see",
    email: "feedback@getcyberright.com",
    response: "We read every message"
  }
];

const quickLinks = [
  {
    title: "Emergency Help",
    description: "Been scammed? Find immediate help and reporting resources",
    href: "/emergency-help",
    icon: AlertTriangle,
    urgent: true
  },
  {
    title: "Scam Checker",
    description: "Check if a link, email, or message is a scam",
    href: "/scam-checker",
    icon: Shield
  },
  {
    title: "Security Guides",
    description: "Step-by-step guides for protecting yourself online",
    href: "/resources",
    icon: BookOpen
  },
  {
    title: "FAQ",
    description: "Answers to common questions about cybersecurity",
    href: "/resources",
    icon: HelpCircle
  }
];

const faqs = [
  {
    question: "Is GetCyberRight really free?",
    answer: "Yes, 100% free. All our tools, guides, and resources are available at no cost. We believe everyone deserves protection from cyber threats, regardless of their budget."
  },
  {
    question: "Do you store my data when I use your tools?",
    answer: "No. Our tools run entirely in your browser. We don't store, log, or transmit your personal information, passwords, or the content you check."
  },
  {
    question: "How do I report a scam I received?",
    answer: "Email us at scams@getcyberright.com with details about the scam. This helps us warn others and update our detection tools."
  },
  {
    question: "Can I use your content for educational purposes?",
    answer: "Yes! Our resources are available for non-commercial educational use. For commercial use or bulk distribution, please contact partnerships@getcyberright.com."
  },
  {
    question: "How often is your content updated?",
    answer: "We update our content regularly as new threats emerge. Our scam detection tools receive updates weekly, and our guides are reviewed monthly."
  }
];

export default function Support() {
  return (
    <div className="min-h-screen bg-background">
      <PageBanner
        title="How Can We Help?"
        subtitle="Get the support you need. We're here to help you stay safe online."
        imageSrc={supportImage}
        imageAlt="Customer support"
        imagePosition="right"
        colorVariant="teal"
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Support</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {supportOptions.map((option) => (
                  <Card key={option.title} className="h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <option.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{option.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                          <a 
                            href={`mailto:${option.email}`}
                            className="text-sm text-primary hover:underline block mb-1"
                          >
                            {option.email}
                          </a>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{option.response}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Quick Links</h2>
              <div className="space-y-3">
                {quickLinks.map((link) => (
                  <Link key={link.title} href={link.href}>
                    <Card className={`cursor-pointer transition-colors hover-elevate ${link.urgent ? 'border-red-200 dark:border-red-900' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${link.urgent ? 'bg-red-100 dark:bg-red-900' : 'bg-muted'}`}>
                            <link.icon className={`w-4 h-4 ${link.urgent ? 'text-red-600' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground text-sm">{link.title}</h3>
                            <p className="text-xs text-muted-foreground">{link.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.question}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground mb-8">
            Can't find what you're looking for? Our support team is ready to assist you.
          </p>
          <Button size="lg" asChild>
            <a href="mailto:support@getcyberright.com" className="inline-flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Support Team
            </a>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">support@getcyberright.com</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
