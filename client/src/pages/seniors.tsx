import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import type { FAQData, BreadcrumbData } from "@/components/structured-data";
import { Link } from "wouter";
import { 
  Shield, Lock, Phone, Heart, Mail, CreditCard,
  CheckCircle, Star, BookOpen, AlertTriangle,
  Users, Home, Lightbulb, ArrowRight, HelpCircle,
  Eye, MessageCircle, Smartphone, BadgeCheck,
  ExternalLink, Wallet, UserX
} from "lucide-react";
import bannerImage from "@/assets/banners/seniors-banner.png";
import cardRomanceScams from "@/assets/images/card-romance-scams.png";
import cardTechSupportScams from "@/assets/images/card-tech-support-scams.png";
import cardMedicareScams from "@/assets/images/card-medicare-scams.png";
import cardPhoneEmailScams from "@/assets/images/card-phone-email-scams.png";
import cardIdentityTheft from "@/assets/images/card-identity-theft-seniors.png";
import cardOnlineShopping from "@/assets/images/card-online-shopping-seniors.png";
import cardGovernmentScams from "@/assets/images/card-government-scams.png";
import cardInvestmentFraud from "@/assets/images/card-investment-fraud.png";

interface SafetyTopic {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
  color: string;
  image?: string;
  content: {
    intro: string;
    warningSignsSectionTitle: string;
    warningSigns: string[];
    protectionSteps: string[];
    remember: string;
  };
}

const seniorSafetyTopics: SafetyTopic[] = [
  {
    id: "romance-scams",
    title: "Romance and Friendship Scams",
    description: "Recognize fake online relationships designed to steal money.",
    icon: Heart,
    color: "bg-rose-500",
    image: cardRomanceScams,
    content: {
      intro: "Romance scammers create fake profiles on dating sites, social media, or even through text messages. They build emotional connections over weeks or months, then ask for money for emergencies, travel, or investments. These criminals are skilled at manipulation and target people seeking companionship.",
      warningSignsSectionTitle: "Warning Signs",
      warningSigns: [
        "They say they love you very quickly, often within days or weeks.",
        "They always have excuses for why they cannot meet in person or video chat.",
        "They claim to be overseas for work, military service, or family emergencies.",
        "They ask for money for plane tickets, medical bills, or business problems.",
        "They want you to keep the relationship secret from family and friends."
      ],
      protectionSteps: [
        "Never send money to someone you have not met in person.",
        "Do a reverse image search on their profile photos to check if they are stolen.",
        "Be suspicious if someone avoids video calls or in-person meetings.",
        "Talk to family or friends about new online relationships.",
        "Report suspicious profiles to the website and to the FTC."
      ],
      remember: "Real love does not ask for wire transfers. If someone you have never met asks for money, it is almost certainly a scam. Trust your instincts and talk to someone you trust."
    }
  },
  {
    id: "tech-support-scams",
    title: "Tech Support Scams",
    description: "Avoid fake computer support calls and pop-up warnings.",
    icon: Phone,
    color: "bg-blue-500",
    image: cardTechSupportScams,
    content: {
      intro: "Tech support scammers pretend to be from well-known companies like Microsoft, Apple, or your internet provider. They may call you directly or use scary pop-up messages claiming your computer has a virus. Their goal is to get remote access to your computer or convince you to pay for unnecessary services.",
      warningSignsSectionTitle: "Warning Signs",
      warningSigns: [
        "Unexpected phone calls claiming to be from tech support.",
        "Pop-up messages with urgent warnings and phone numbers to call.",
        "Callers who pressure you to act immediately or your computer will be damaged.",
        "Requests to download software that gives them remote access.",
        "Demands for payment via gift cards, wire transfer, or cryptocurrency."
      ],
      protectionSteps: [
        "Hang up on unexpected tech support calls. Real companies do not call you first.",
        "Close pop-up warnings by shutting down your browser, not by clicking anything on the pop-up.",
        "Never give remote access to your computer to someone who contacts you unexpectedly.",
        "If you think there is a real problem, call the company using the number from their official website.",
        "Never pay for tech support with gift cards. This is always a scam."
      ],
      remember: "Microsoft, Apple, and other companies will never call you unexpectedly about computer problems. If you get such a call, hang up immediately."
    }
  },
  {
    id: "medicare-health-scams",
    title: "Medicare and Health Scams",
    description: "Protect your Medicare number and health information.",
    icon: BadgeCheck,
    color: "bg-green-500",
    image: cardMedicareScams,
    content: {
      intro: "Scammers target seniors by pretending to be from Medicare or health insurance companies. They try to steal your Medicare number, which can be used to file false claims and steal your identity. They may offer free medical equipment, genetic testing, or new Medicare cards to trick you.",
      warningSignsSectionTitle: "Warning Signs",
      warningSigns: [
        "Unsolicited calls offering free medical equipment, braces, or genetic testing.",
        "Callers asking for your Medicare number to send you a new card.",
        "Threats that your Medicare benefits will be cancelled if you do not provide information.",
        "Offers for services that seem too good to be true.",
        "Pressure to make quick decisions about health plans or services."
      ],
      protectionSteps: [
        "Never give your Medicare number to someone who calls or visits unexpectedly.",
        "Medicare will never call to sell you anything or ask for payment over the phone.",
        "Review your Medicare Summary Notice for services you did not receive.",
        "If you suspect fraud, call 1-800-MEDICARE or visit medicare.gov.",
        "Shred documents containing your Medicare number before discarding."
      ],
      remember: "Your Medicare number is as valuable as your Social Security number. Guard it carefully and only share it with trusted healthcare providers."
    }
  },
  {
    id: "phone-email-scams",
    title: "Phone and Email Scams",
    description: "Identify fraudulent calls, texts, and emails.",
    icon: Mail,
    color: "bg-purple-500",
    image: cardPhoneEmailScams,
    content: {
      intro: "Scammers use phones and email to impersonate banks, government agencies, delivery services, and family members. They create urgency to prevent you from thinking clearly. These scams are becoming more sophisticated, sometimes using technology to make calls appear to come from legitimate numbers.",
      warningSignsSectionTitle: "Warning Signs",
      warningSigns: [
        "Callers claiming to be from the IRS, Social Security, or police threatening arrest.",
        "Emails with urgent requests to click links or verify account information.",
        "Messages claiming a package could not be delivered and asking you to click a link.",
        "Calls from someone claiming to be a grandchild in trouble needing money immediately.",
        "Requests for payment in gift cards, wire transfers, or cryptocurrency."
      ],
      protectionSteps: [
        "Let unknown calls go to voicemail. Scammers rarely leave messages.",
        "Never click links in unexpected emails or texts. Go directly to the official website instead.",
        "Verify urgent requests by calling back using a number you know is real.",
        "Create a family code word to verify emergency calls from relatives.",
        "Take your time. Legitimate organizations will not pressure you to act immediately."
      ],
      remember: "Government agencies like the IRS and Social Security will never call threatening arrest or demand immediate payment. These calls are always scams."
    }
  },
  {
    id: "financial-scams",
    title: "Financial and Investment Scams",
    description: "Protect your savings from fraudulent schemes.",
    icon: CreditCard,
    color: "bg-amber-500",
    image: cardIdentityTheft,
    content: {
      intro: "Financial scammers target seniors because they often have retirement savings and own their homes. Scams range from fake investment opportunities promising high returns to predatory lending and contractor fraud. Protecting your finances requires skepticism about unsolicited offers.",
      warningSignsSectionTitle: "Warning Signs",
      warningSigns: [
        "Investment opportunities promising guaranteed high returns with no risk.",
        "Pressure to invest quickly before an opportunity disappears.",
        "Unsolicited offers for home repair, refinancing, or reverse mortgages.",
        "Requests to keep an investment secret from family or advisors.",
        "Difficulty getting clear answers about how an investment works."
      ],
      protectionSteps: [
        "Never invest in anything you do not fully understand.",
        "Research any investment opportunity and the person selling it.",
        "Consult with a trusted family member or independent financial advisor before major decisions.",
        "Be wary of anyone who discourages you from seeking outside advice.",
        "Get multiple quotes and check references for any home repair work."
      ],
      remember: "If an investment sounds too good to be true, it probably is. Take your time, do your research, and always consult someone you trust before making major financial decisions."
    }
  },
  {
    id: "online-safety-basics",
    title: "Online Safety Basics",
    description: "Essential skills for safe internet use.",
    icon: Shield,
    color: "bg-teal-500",
    image: cardOnlineShopping,
    content: {
      intro: "The internet offers wonderful ways to stay connected, learn new things, and manage daily tasks. With some basic precautions, you can enjoy these benefits while staying safe. These fundamental practices will help protect you from most online threats.",
      warningSignsSectionTitle: "Key Safety Practices",
      warningSigns: [
        "Use strong, unique passwords for each account. Consider a password manager.",
        "Keep your computer, phone, and apps updated with the latest security patches.",
        "Only download apps from official app stores like Apple App Store or Google Play.",
        "Look for the padlock icon in your browser when entering personal information.",
        "Be cautious about what personal information you share on social media."
      ],
      protectionSteps: [
        "Enable two-factor authentication on important accounts like email and banking.",
        "Use secure Wi-Fi at home and avoid entering sensitive information on public Wi-Fi.",
        "Back up important photos and documents regularly.",
        "Review privacy settings on social media accounts.",
        "Ask a trusted family member or friend for help with technology questions."
      ],
      remember: "You do not need to be a technology expert to stay safe online. Simple habits like using strong passwords and being cautious about unexpected messages go a long way."
    }
  },
  {
    id: "government-impersonation",
    title: "Government Impersonation Scams",
    description: "Scammers posing as IRS, Social Security, or law enforcement.",
    icon: UserX,
    color: "bg-indigo-500",
    image: cardGovernmentScams,
    content: {
      intro: "Government impersonation scams are among the fastest-growing threats targeting older adults. According to the FTC, consumers reported losing over $500 million to these scams in recent years. Criminals pose as IRS agents, Social Security Administration employees, Medicare officials, or even local police to intimidate victims into sending money or sharing personal information.",
      warningSignsSectionTitle: "Warning Signs",
      warningSigns: [
        "A caller claims your Social Security number has been suspended or compromised.",
        "Threats of arrest, deportation, or legal action if you do not pay immediately.",
        "Demands for payment through gift cards, wire transfers, or cryptocurrency.",
        "Caller ID shows a government agency name or phone number (these can be faked).",
        "The caller tells you not to speak with family, friends, or your bank."
      ],
      protectionSteps: [
        "Government agencies will never call demanding immediate payment or threatening arrest.",
        "The IRS initiates contact through the mail, not by phone, email, or text.",
        "Never give your Social Security number to someone who contacts you unexpectedly.",
        "Hang up and call the agency directly using the number from their official website.",
        "Report impersonation attempts to the FTC at reportfraud.ftc.gov."
      ],
      remember: "No government agency will ever demand payment over the phone, threaten you with arrest, or ask for gift cards. If someone claims to be from the government and is pressuring you, hang up. It is a scam."
    }
  },
  {
    id: "investment-cryptocurrency",
    title: "Investment and Cryptocurrency Fraud",
    description: "Protect your retirement savings from fake investment schemes.",
    icon: Wallet,
    color: "bg-orange-500",
    image: cardInvestmentFraud,
    content: {
      intro: "Investment fraud targeting seniors has surged, with cryptocurrency scams alone costing victims over $3.4 billion in 2023 according to the FBI IC3 report. Scammers approach through social media, dating apps, unsolicited emails, or even through people you know who have been deceived themselves. They promise guaranteed returns with little or no risk.",
      warningSignsSectionTitle: "Warning Signs",
      warningSigns: [
        "Promises of guaranteed high returns with zero risk.",
        "Pressure to invest quickly before an opportunity disappears.",
        "Unsolicited contact about investment opportunities via social media or messaging apps.",
        "Requests to move money into cryptocurrency or unfamiliar digital wallets.",
        "An online friend or romantic interest who steers conversations toward investing."
      ],
      protectionSteps: [
        "Never invest based on advice from someone you have only met online.",
        "Research any investment opportunity through SEC.gov or FINRA BrokerCheck.",
        "Consult a licensed, independent financial advisor before making large investments.",
        "Be extremely cautious of cryptocurrency investments you do not fully understand.",
        "Report suspected investment fraud to the SEC or your state securities regulator."
      ],
      remember: "Legitimate investments carry risk and no one can guarantee returns. If someone promises guaranteed profits, especially through cryptocurrency, it is almost certainly a scam. Consult a trusted advisor before investing."
    }
  }
];

// Decorative shapes for the page
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-emerald-300/15 dark:bg-emerald-500/10" />
      <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-blue-300/15 dark:bg-blue-500/10" />
      <div className="absolute bottom-32 left-1/4 w-12 h-12 rounded-full bg-amber-300/15 dark:bg-amber-500/10" />
      <div className="absolute bottom-20 right-1/3 w-20 h-20 rounded-full bg-teal-300/15 dark:bg-teal-500/10" />
    </div>
  );
}

function SeniorsLanding({ onSelectTopic }: { onSelectTopic: (id: string) => void }) {
  return (
    <>
      <PageBanner
        title="Stay Safe and Connected Online"
        subtitle="Practical guidance to protect yourself from scams and fraud. Learn to recognize warning signs and take simple steps to stay secure."
        imageSrc={bannerImage}
        imageAlt="Seniors using technology safely"
        colorVariant="teal"
      />

      <section className="py-8 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">The Scale of the Problem</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">$4.8B+</p>
              <p className="text-sm text-muted-foreground mt-1">Lost by adults 60+ in 2024</p>
              <p className="text-xs text-muted-foreground">(FBI IC3 Report)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">$61B</p>
              <p className="text-sm text-muted-foreground mt-1">Estimated total losses including unreported</p>
              <p className="text-xs text-muted-foreground">(AARP 2025 Survey)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">1 in 3</p>
              <p className="text-sm text-muted-foreground mt-1">Seniors targeted by fraud annually</p>
              <p className="text-xs text-muted-foreground">(FTC Consumer Sentinel)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">70%</p>
              <p className="text-sm text-muted-foreground mt-1">Of fraud against seniors goes unreported</p>
              <p className="text-xs text-muted-foreground">(DOJ Elder Justice Initiative)</p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="relative py-12">
        <FloatingShapes />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {seniorSafetyTopics.map((topic) => (
              <Card 
                key={topic.id}
                className="cursor-pointer transition-shadow hover:shadow-xl border-2 border-white/50 dark:border-white/10 bg-white/80 dark:bg-card/80 backdrop-blur-sm"
                onClick={() => onSelectTopic(topic.id)}
                onKeyDown={(e) => e.key === 'Enter' && onSelectTopic(topic.id)}
                tabIndex={0}
                role="button"
                aria-label={`Learn about ${topic.title}`}
                data-testid={`card-topic-${topic.id}`}
              >
                {topic.image && (
                  <div className="relative h-48 sm:h-56 w-full">
                    <img
                      src={topic.image}
                      alt={topic.title}
                      className="w-full h-full object-cover rounded-t-md"
                      loading="lazy"
                      data-testid={`img-topic-${topic.id}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-t-md" />
                    <div className={`absolute bottom-3 left-3 w-10 h-10 rounded-lg ${topic.color} flex items-center justify-center shadow-lg`}>
                      <topic.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
                <CardContent className={topic.image ? "p-4" : "p-6"}>
                  {!topic.image && (
                    <div className={`w-14 h-14 rounded-xl ${topic.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <topic.icon className="w-7 h-7 text-white" />
                    </div>
                  )}
                  <h3 className="font-semibold text-lg text-foreground mb-2">{topic.title}</h3>
                  <p className="text-muted-foreground text-sm">{topic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Need Help Right Now?
                  </h3>
                  <p className="text-muted-foreground">
                    If you think you have been scammed or need immediate assistance, our Emergency Guidance section can help you take the right steps.
                  </p>
                </div>
                <Button variant="outline" className="border-amber-300 dark:border-amber-700" onClick={() => {
                  window.location.href = '/emergency';
                }} data-testid="button-emergency-help">
                  Get Help
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Think You Have Been Scammed? Act Now
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Contact your bank immediately to freeze accounts and reverse charges.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Change passwords on any accounts that may be compromised.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Report to the FTC at reportfraud.ftc.gov or call 1-877-382-4357.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Tell a trusted family member or friend what happened. You are not alone.</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/emergency-help">
                  <Button variant="outline" className="border-red-300 dark:border-red-700" data-testid="button-seniors-emergency">
                    Full Emergency Guidance
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Share With Family</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Consider reviewing these topics with a trusted family member or friend. Having someone to consult makes it easier to spot scams.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Sources
            </h4>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <a href="https://www.ic3.gov/AnnualReport" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1" data-testid="source-fbi-ic3">
                <ExternalLink className="w-3 h-3" />FBI IC3 Annual Report
              </a>
              <a href="https://www.ftc.gov/reports/consumer-sentinel-network" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1" data-testid="source-ftc">
                <ExternalLink className="w-3 h-3" />FTC Consumer Sentinel Network
              </a>
              <a href="https://www.aarp.org/money/scams-fraud/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1" data-testid="source-aarp">
                <ExternalLink className="w-3 h-3" />AARP Fraud Watch Network
              </a>
              <a href="https://justice.gov/elderjustice" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1" data-testid="source-doj">
                <ExternalLink className="w-3 h-3" />DOJ Elder Justice Initiative
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last reviewed: February 2026</p>
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
  topic: SafetyTopic;
  onBack: () => void;
}) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-blue-950/30" />
      
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
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl ${topic.color} flex items-center justify-center shadow-lg`}>
                  <topic.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{topic.title}</CardTitle>
                  <CardDescription className="text-base">{topic.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <p className="text-lg text-foreground leading-relaxed">{topic.content.intro}</p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-lg text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {topic.content.warningSignsSectionTitle}
                </h4>
                <ul className="space-y-3">
                  {topic.content.warningSigns.map((sign, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-red-700 dark:text-red-300">{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-lg text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  How to Protect Yourself
                </h4>
                <ul className="space-y-3">
                  {topic.content.protectionSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-700 dark:text-green-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-lg text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Remember
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-lg">{topic.content.remember}</p>
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

export default function Seniors() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const currentTopic = selectedTopic 
    ? seniorSafetyTopics.find(t => t.id === selectedTopic) 
    : null;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.seniors} />
      <StructuredData data={[{
        type: "BreadcrumbList",
        items: [
          { name: "Home", url: "https://getcyberright.com/" },
          { name: "Seniors Safety Hub", url: "https://getcyberright.com/seniors" },
        ],
      } as BreadcrumbData, {
        type: "FAQPage",
        items: seniorSafetyTopics.map(t => ({
          question: t.title + " - what are the warning signs?",
          answer: t.content.intro + " Warning signs include: " + t.content.warningSigns.slice(0, 3).join(". ") + ".",
        })),
      } as FAQData]} />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        {currentTopic ? (
          <TopicContent 
            topic={currentTopic}
            onBack={() => setSelectedTopic(null)}
          />
        ) : (
          <SeniorsLanding onSelectTopic={setSelectedTopic} />
        )}
      </main>

      <Footer />
    </div>
  );
}
