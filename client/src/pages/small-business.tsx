import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Lock, Mail, Users, Building, Briefcase,
  CheckCircle, Star, AlertTriangle, FileText,
  ArrowRight, Lightbulb, DollarSign, Server,
  Smartphone, Key, Eye
} from "lucide-react";
import bannerImage from "@/assets/banners/small-business-banner.png";

interface BusinessTopic {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
  color: string;
  priority: string;
  content: {
    intro: string;
    risks: string[];
    bestPractices: string[];
    quickWins: string[];
    costConsiderations: string;
  };
}

const businessTopics: BusinessTopic[] = [
  {
    id: "employee-training",
    title: "Employee Security Training",
    description: "Build a security-aware culture in your organization.",
    icon: Users,
    color: "bg-blue-500",
    priority: "Essential",
    content: {
      intro: "Your employees are both your greatest asset and your biggest security vulnerability. Over 90% of successful cyberattacks start with a phishing email. Regular security awareness training transforms your staff from potential weak points into your first line of defense.",
      risks: [
        "Employees clicking on phishing links or opening malicious attachments.",
        "Staff sharing passwords or writing them down in visible locations.",
        "Failure to recognize social engineering attempts over the phone.",
        "Using personal devices without understanding security implications.",
        "Accidentally exposing sensitive customer or company data."
      ],
      bestPractices: [
        "Conduct regular security awareness training, not just annual compliance sessions.",
        "Run simulated phishing tests to measure and improve awareness.",
        "Create clear, simple policies that employees can actually follow.",
        "Make it easy for employees to report suspicious activities without fear of blame.",
        "Lead by example: ensure management follows the same security practices."
      ],
      quickWins: [
        "Send a monthly security tip newsletter to all staff.",
        "Post reminders about common scams near printers and in break rooms.",
        "Establish a simple reporting process for suspicious emails.",
        "Recognize and reward employees who report security concerns."
      ],
      costConsiderations: "Many security awareness training platforms offer affordable small business plans starting around $3 to $5 per user per month. Free resources are available from CISA and other government organizations."
    }
  },
  {
    id: "phishing-protection",
    title: "Phishing and Email Security",
    description: "Protect your business from email-based attacks.",
    icon: Mail,
    color: "bg-red-500",
    priority: "Critical",
    content: {
      intro: "Business Email Compromise (BEC) and phishing attacks cost businesses billions annually. Attackers often research companies to craft convincing emails that appear to come from executives, vendors, or customers. A single successful attack can result in significant financial loss or data breach.",
      risks: [
        "Wire transfer fraud through fake executive or vendor emails.",
        "Credential theft leading to account takeovers.",
        "Ransomware infection from malicious attachments.",
        "Data theft through fake login pages.",
        "Reputation damage from compromised email accounts."
      ],
      bestPractices: [
        "Enable multi-factor authentication on all email accounts.",
        "Verify wire transfer and payment requests through a separate communication channel.",
        "Configure email filtering and anti-phishing tools.",
        "Implement DMARC, DKIM, and SPF email authentication.",
        "Establish clear procedures for handling sensitive requests."
      ],
      quickWins: [
        "Turn on multi-factor authentication for email today.",
        "Create a verbal verification policy for any payment changes.",
        "Enable email banner warnings for external senders.",
        "Review who has access to company email accounts."
      ],
      costConsiderations: "Email security features are often included in business email plans. Advanced anti-phishing tools typically cost $2 to $10 per user per month. MFA is free or low-cost with most providers."
    }
  },
  {
    id: "password-management",
    title: "Password and Access Management",
    description: "Secure account access across your organization.",
    icon: Key,
    color: "bg-purple-500",
    priority: "Essential",
    content: {
      intro: "Weak and reused passwords are involved in over 80% of data breaches. Small businesses often struggle with password management as they grow, leading to shared accounts, sticky note passwords, and forgotten access when employees leave. A systematic approach to access management reduces risk significantly.",
      risks: [
        "Password reuse allowing one breach to compromise multiple accounts.",
        "Shared accounts making it impossible to track who did what.",
        "Former employees retaining access to business systems.",
        "Weak passwords that can be easily guessed or cracked.",
        "No visibility into what accounts and access exist."
      ],
      bestPractices: [
        "Implement a business password manager for all employees.",
        "Require multi-factor authentication on all critical systems.",
        "Create an offboarding checklist to revoke access when employees leave.",
        "Use single sign-on (SSO) where possible to centralize access control.",
        "Conduct regular audits of who has access to what systems."
      ],
      quickWins: [
        "Deploy a team password manager this week.",
        "Enable MFA on your most critical five accounts today.",
        "Create a list of all business accounts and who has access.",
        "Change passwords for any shared accounts."
      ],
      costConsiderations: "Business password managers cost $4 to $8 per user per month. Many offer free trials. MFA apps like Google Authenticator and Microsoft Authenticator are free."
    }
  },
  {
    id: "data-protection",
    title: "Data Protection and Backup",
    description: "Safeguard critical business data from loss and theft.",
    icon: Server,
    color: "bg-green-500",
    priority: "Critical",
    content: {
      intro: "Data is often a small business's most valuable asset. Customer information, financial records, and intellectual property need protection from both external threats and accidental loss. Regular backups and proper data handling are essential for business continuity.",
      risks: [
        "Ransomware encrypting all business files and demanding payment.",
        "Hardware failure causing permanent data loss.",
        "Accidental deletion of important files.",
        "Data theft by departing employees.",
        "Regulatory penalties for improper data handling."
      ],
      bestPractices: [
        "Follow the 3-2-1 backup rule: three copies, two different media types, one offsite.",
        "Test backup restoration regularly to ensure data can actually be recovered.",
        "Encrypt sensitive data both at rest and in transit.",
        "Classify data by sensitivity and handle accordingly.",
        "Understand and comply with relevant data protection regulations."
      ],
      quickWins: [
        "Verify your current backup solution is working by testing a restore.",
        "Enable automatic cloud backup for critical files.",
        "Identify where your most sensitive data is stored.",
        "Create a simple data classification guide for employees."
      ],
      costConsiderations: "Cloud backup services range from $5 to $15 per computer per month for small business plans. Many offer volume discounts. Consider the cost of data loss when evaluating backup investments."
    }
  },
  {
    id: "vendor-security",
    title: "Vendor and Third-Party Risk",
    description: "Evaluate and manage security risks from partners and suppliers.",
    icon: Building,
    color: "bg-amber-500",
    priority: "Important",
    content: {
      intro: "Your business is only as secure as your weakest vendor. Third-party providers often have access to your data or systems, and a breach at a vendor can quickly become your problem. Due diligence before engagement and ongoing monitoring are essential.",
      risks: [
        "Vendors with access to customer data being breached.",
        "Software supply chain attacks through trusted applications.",
        "Compliance violations through vendor mishandling of data.",
        "Business disruption when a critical vendor experiences an incident.",
        "Lack of visibility into vendor security practices."
      ],
      bestPractices: [
        "Include security requirements in vendor contracts.",
        "Request and review vendor security documentation before engagement.",
        "Limit vendor access to only what is necessary.",
        "Monitor vendor access and review it regularly.",
        "Have contingency plans for critical vendor failures."
      ],
      quickWins: [
        "Create a list of all vendors with access to your data or systems.",
        "Review access levels for your top five most critical vendors.",
        "Ask vendors about their security practices and certifications.",
        "Include security requirements in your next vendor contract."
      ],
      costConsiderations: "Vendor security assessment can often be done internally using free questionnaire templates. More thorough assessments may require consulting help ranging from $1,000 to $5,000 depending on scope."
    }
  },
  {
    id: "incident-response",
    title: "Incident Response Planning",
    description: "Prepare to respond effectively when security incidents occur.",
    icon: AlertTriangle,
    color: "bg-orange-500",
    priority: "Important",
    content: {
      intro: "Security incidents are not a matter of if but when. Having a plan in place before an incident occurs dramatically reduces response time, limits damage, and helps maintain customer trust. Even a simple plan is far better than no plan at all.",
      risks: [
        "Delayed response allowing attackers more time to cause damage.",
        "Panicked decisions making the situation worse.",
        "Failure to preserve evidence needed for investigation.",
        "Regulatory penalties for inadequate breach notification.",
        "Reputation damage from poorly handled incidents."
      ],
      bestPractices: [
        "Create a simple incident response plan documenting key steps and contacts.",
        "Identify who will make decisions during an incident.",
        "Maintain current contact information for key responders.",
        "Know your legal and regulatory notification requirements.",
        "Practice your response plan at least once a year."
      ],
      quickWins: [
        "Write down three key contacts if you experience a security incident.",
        "Identify your cyber insurance provider and their incident hotline.",
        "Document basic steps for isolating an infected computer.",
        "Know whether you have regulatory notification requirements."
      ],
      costConsiderations: "Basic incident response planning can be done internally at no cost. Cyber insurance, which often includes incident response support, typically costs $500 to $5,000 annually for small businesses depending on coverage."
    }
  }
];

function SmallBusinessLanding({ onSelectTopic }: { onSelectTopic: (id: string) => void }) {
  return (
    <>
      <PageBanner
        title="Protect Your Business"
        subtitle="Practical, cost-effective security guidance designed for small businesses. Build resilience against cyber threats without breaking your budget."
        imageSrc={bannerImage}
        imageAlt="Small business team working on cybersecurity"
        colorVariant="slate"
      />
      
      <div className="py-12 bg-background">
        <div className="max-w-5xl mx-auto px-4">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {businessTopics.map((topic) => (
              <Card 
                key={topic.id}
                className="cursor-pointer transition-shadow hover:shadow-lg border"
                onClick={() => onSelectTopic(topic.id)}
                onKeyDown={(e) => e.key === 'Enter' && onSelectTopic(topic.id)}
                tabIndex={0}
                role="button"
                aria-label={`Learn about ${topic.title}`}
                data-testid={`card-topic-${topic.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${topic.color} flex items-center justify-center`}>
                      <topic.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge 
                      className={topic.priority === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : topic.priority === 'Essential' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'}
                    >
                      {topic.priority}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{topic.title}</h3>
                  <p className="text-muted-foreground text-sm">{topic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Cost-Effective Security
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Each topic includes practical quick wins and cost considerations to help you budget effectively.
                  </p>
                </div>
                <Button variant="outline" onClick={() => {
                  window.location.href = '/tools';
                }} data-testid="button-security-tools">
                  Free Security Tools
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Start With the Basics</p>
                <p className="text-sm text-muted-foreground">
                  Focus on the fundamentals: strong passwords, multi-factor authentication, regular backups, and employee awareness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TopicContent({ 
  topic, 
  onBack 
}: { 
  topic: BusinessTopic;
  onBack: () => void;
}) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950/30 dark:via-blue-950/30 dark:to-indigo-950/30" />
      
      <div className="relative py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="mb-6"
            data-testid="button-back-to-topics"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to All Topics
          </Button>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl ${topic.color} flex items-center justify-center shadow-lg`}>
                    <topic.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{topic.title}</CardTitle>
                    <CardDescription className="text-base">{topic.description}</CardDescription>
                  </div>
                </div>
                <Badge 
                  className={topic.priority === 'Critical' ? 'bg-red-500 text-white' : topic.priority === 'Essential' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'}
                >
                  {topic.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <p className="text-lg text-foreground leading-relaxed">{topic.content.intro}</p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-lg text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Key Risks
                </h4>
                <ul className="space-y-3">
                  {topic.content.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-red-700 dark:text-red-300">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-lg text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Best Practices
                </h4>
                <ul className="space-y-3">
                  {topic.content.bestPractices.map((practice, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700 dark:text-blue-300">{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-lg text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Quick Wins
                </h4>
                <ul className="space-y-3">
                  {topic.content.quickWins.map((win, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm flex-shrink-0">{index + 1}</span>
                      <span className="text-green-700 dark:text-green-300">{win}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-lg text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Cost Considerations
                </h4>
                <p className="text-amber-700 dark:text-amber-300">{topic.content.costConsiderations}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={onBack} variant="outline" data-testid="button-explore-more">
              Explore More Topics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SmallBusiness() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const currentTopic = selectedTopic 
    ? businessTopics.find(t => t.id === selectedTopic) 
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {currentTopic ? (
          <TopicContent 
            topic={currentTopic}
            onBack={() => setSelectedTopic(null)}
          />
        ) : (
          <SmallBusinessLanding onSelectTopic={setSelectedTopic} />
        )}
      </main>

      <Footer />
    </div>
  );
}
