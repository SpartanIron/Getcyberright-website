import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Smartphone, 
  Lock, 
  Eye, 
  AlertTriangle, 
  Users, 
  CreditCard, 
  Mail, 
  Wifi, 
  Globe,
  RefreshCw,
  Lightbulb,
  ShoppingCart,
  Phone,
  Heart
} from "lucide-react";

interface DailyTip {
  id: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionableSteps: string[];
  targetAudience: "everyone" | "seniors" | "youth" | "families";
  riskLevel: "low" | "medium" | "high";
}

const dailyTips: DailyTip[] = [
  {
    id: "online-shopping-scam",
    category: "Shopping Safety",
    icon: CreditCard,
    title: "You Found the Perfect Deal Online - But Is It Real?",
    description: "Maria saw designer shoes for 80% off on Facebook. The website looked legitimate, but after ordering, her credit card was charged twice and no shoes arrived.",
    actionableSteps: [
      "Check if the website URL looks suspicious (random letters, misspellings)",
      "Look for contact information and customer reviews",
      "Use a credit card instead of debit card for better protection",
      "If the deal seems too good to be true, it probably is"
    ],
    targetAudience: "everyone",
    riskLevel: "high"
  },
  {
    id: "grandparent-scam",
    category: "Phone Safety",
    icon: AlertTriangle,
    title: "Your 'Grandchild' Calls Needing Emergency Money",
    description: "Robert received a panicked call from someone claiming to be his grandson, saying he was in jail and needed bail money immediately. The voice sounded different, but the caller knew family details.",
    actionableSteps: [
      "Ask specific questions only your real family member would know",
      "Hang up and call your family member directly on their known number",
      "Never send money, gift cards, or wire transfers for emergencies",
      "Take time to think - scammers create urgency to prevent thinking"
    ],
    targetAudience: "seniors",
    riskLevel: "high"
  },
  {
    id: "romance-scam",
    category: "Dating Safety",
    icon: Users,
    title: "Your Online Date Wants to Meet - But Asks for Money First",
    description: "Jessica met 'David' on a dating app. After weeks of sweet messages, he claimed to be stranded abroad and needed money for a plane ticket home. His photos seemed too perfect.",
    actionableSteps: [
      "Never send money to someone you haven't met in person",
      "Do a reverse image search on their photos",
      "Insist on video calls before meeting",
      "Be wary if they avoid phone calls or always have excuses"
    ],
    targetAudience: "everyone",
    riskLevel: "high"
  },
  {
    id: "package-delivery-scam",
    category: "Text Scams",
    icon: Smartphone,
    title: "You Got a Text About a Package Delivery Issue",
    description: "Lisa received a text saying her Amazon package couldn't be delivered and needed to click a link to reschedule. The link looked official but asked for her credit card to pay a 'redelivery fee.'",
    actionableSteps: [
      "Check your actual Amazon/delivery app instead of clicking the link",
      "Real delivery companies don't ask for payment via text",
      "Look for spelling errors or weird sender numbers",
      "When in doubt, go directly to the company's official website"
    ],
    targetAudience: "everyone",
    riskLevel: "high"
  },
  {
    id: "fake-bank-alert",
    category: "Text Scams", 
    icon: CreditCard,
    title: "Your Bank Texted About 'Suspicious Activity'",
    description: "Tom got a text from 'Wells Fargo' saying his account was frozen due to suspicious activity and to click a link immediately. The panic made him almost click before noticing the sender wasn't from his actual bank.",
    actionableSteps: [
      "Never click links in texts claiming to be from your bank",
      "Call your bank directly using the number on your card",
      "Banks will never ask for passwords or PINs via text",
      "Log into your bank app separately to check for real alerts"
    ],
    targetAudience: "everyone",
    riskLevel: "high"
  },
  {
    id: "coffee-shop-wifi",
    category: "Public WiFi",
    icon: Wifi,
    title: "You're Working on Laptop at Starbucks",
    description: "Sarah connected to 'Starbucks_WiFi_Free' at her local cafe and checked her bank account. Later she discovered someone had accessed her login information through the fake network.",
    actionableSteps: [
      "Ask staff for the official WiFi network name",
      "Avoid accessing sensitive accounts on public WiFi",
      "Use your phone's hotspot instead when possible",
      "Look for networks that require a password from staff"
    ],
    targetAudience: "everyone",
    riskLevel: "medium"
  },
  {
    id: "facebook-friend-emergency",
    category: "Social Media",
    icon: Users,
    title: "Your Facebook Friend is 'Stranded' and Needs Money",
    description: "Mike got a message from his college friend's Facebook account saying she was robbed in Paris and needed $500 wired immediately. The message sounded urgent but didn't quite sound like her usual way of writing.",
    actionableSteps: [
      "Call or text your friend on their actual phone number",
      "Ask a personal question only they would know the answer to",
      "Never send money based on social media messages alone",
      "Check if other friends received the same message"
    ],
    targetAudience: "everyone",
    riskLevel: "high"
  },
  {
    id: "microsoft-virus-call",
    category: "Phone Scams",
    icon: AlertTriangle,
    title: "Microsoft Called About Viruses on Your Computer",
    description: "Eleanor received a call from someone with an accent claiming to be from Microsoft, saying her computer was infected and they needed remote access to fix it. They knew her name and seemed official.",
    actionableSteps: [
      "Hang up immediately - Microsoft never calls customers unsolicited",
      "Don't let anyone remotely access your computer",
      "Real tech companies don't call about virus infections",
      "If worried, call Microsoft directly using their official number"
    ],
    targetAudience: "seniors",
    riskLevel: "high"
  },
  {
    id: "social-media-youth",
    category: "Youth Safety",
    icon: Users,
    title: "A Stranger Wants to Meet You From Instagram",
    description: "Emma, 16, received messages from someone claiming to be a talent scout offering modeling opportunities. They asked for personal photos and wanted to meet privately to 'discuss her future.'",
    actionableSteps: [
      "Never meet strangers from social media without parents present",
      "Real talent agencies have official offices and websites",
      "Don't send personal photos to people you don't know in real life",
      "Tell a trusted adult immediately about suspicious messages"
    ],
    targetAudience: "youth",
    riskLevel: "high"
  },
  {
    id: "family-safety",
    category: "Family Protection",
    icon: Shield,
    title: "Your Child Downloaded a 'Free' Game App",
    description: "Alex's 12-year-old downloaded a free racing game that kept asking for in-app purchases. The child accidentally bought $200 worth of upgrades using the saved payment method.",
    actionableSteps: [
      "Set up parental controls on app purchases",
      "Remove saved payment methods from kids' devices",
      "Review apps before children download them",
      "Teach kids to ask before making any purchases"
    ],
    targetAudience: "families",
    riskLevel: "medium"
  }
];

export function DailyCyberTips() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Get tip of the day based on current date
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    setCurrentTipIndex(dayOfYear % dailyTips.length);
  }, []);

  const currentTip = dailyTips[currentTipIndex];
  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % dailyTips.length);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case "seniors": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "youth": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "families": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <Card className="w-full border-2 border-[var(--cyber-blue)]/30 bg-gradient-to-br from-white to-blue-50/80 dark:from-slate-900 dark:to-blue-900/30 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--cyber-blue)]/10 rounded-lg">
              <Lightbulb className="h-6 w-6 text-[var(--cyber-blue)]" />
            </div>
            <CardTitle className="text-xl font-bold text-[var(--cyber-blue)]">
              Daily Cyber Tip
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextTip}
            className="h-10 w-10 p-0 hover:bg-[var(--cyber-blue)]/10 rounded-lg transition-colors"
            title="Get next tip"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className={`${getRiskColor(currentTip.riskLevel)} font-medium px-3 py-1`}>
            {currentTip.riskLevel.toUpperCase()} PRIORITY
          </Badge>
          {currentTip.targetAudience !== "everyone" && (
            <Badge variant="outline" className={`${getAudienceColor(currentTip.targetAudience)} font-medium px-3 py-1`}>
              {currentTip.targetAudience.toUpperCase()}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-[var(--cyber-blue)]/10 rounded-lg">
            <currentTip.icon className="h-6 w-6 text-[var(--cyber-blue)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1 leading-tight">
              {currentTip.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentTip.description}
            </p>
          </div>
        </div>

        {!isExpanded ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="w-full text-[var(--cyber-blue)] border-[var(--cyber-blue)]/30 hover:bg-[var(--cyber-blue)]/5"
          >
            Show Action Steps
          </Button>
        ) : (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-foreground">Quick Action Steps:</h4>
            <ul className="space-y-2">
              {currentTip.actionableSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--cyber-blue)]/10 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-[var(--cyber-blue)]">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-muted-foreground leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Collapse
            </Button>
          </div>
        )}

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            💡 New tip daily • Tip {currentTipIndex + 1} of {dailyTips.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}