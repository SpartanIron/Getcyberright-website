import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { 
  Brain, 
  Shield, 
  AlertTriangle, 
  Eye, 
  Mic, 
  Video, 
  Mail, 
  MessageSquare,
  Lock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Users,
  Building2,
  GraduationCap,
  Heart,
  Sparkles,
  Bot,
  Fingerprint,
  Phone,
  FileText,
  ArrowRight,
  CalendarDays
} from "lucide-react";
import { Link } from "@/lib/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
    <div className="absolute top-40 right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
    <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
  </div>
);

const aiThreats = [
  {
    id: "deepfakes",
    icon: Video,
    title: "Deepfake Videos & Images",
    severity: "high",
    description: "AI-generated fake videos that can make anyone appear to say or do anything.",
    realWorldExample: "In 2024, scammers used deepfake video calls impersonating CEOs to trick employees into transferring millions of dollars.",
    howItWorks: [
      "AI analyzes thousands of photos/videos of a person",
      "Creates a synthetic model of their face and voice",
      "Generates realistic fake videos in real-time",
      "Can be used in video calls, social media, or messaging"
    ],
    protectionTips: [
      "Verify unexpected video calls through a separate channel",
      "Look for visual glitches: unnatural blinking, lighting inconsistencies",
      "Ask questions only the real person would know",
      "Be skeptical of urgent financial requests via video",
      "Use code words with family for emergency situations"
    ],
    audienceImpact: {
      seniors: "Grandparent scams now use voice cloning to sound exactly like grandchildren",
      business: "CEO fraud attacks using deepfake video calls for wire transfers",
      parents: "Fake videos of children used for extortion attempts"
    }
  },
  {
    id: "voice-cloning",
    icon: Mic,
    title: "AI Voice Cloning",
    severity: "critical",
    description: "As little as a few seconds of audio can create a convincing clone of anyone's voice.",
    realWorldExample: "Criminals cloned a teen's voice from social media to call parents demanding ransom for a fake kidnapping.",
    howItWorks: [
      "AI captures voice patterns from any audio source",
      "Social media videos, voicemails, phone recordings",
      "Creates a voice model that can say anything",
      "Used in real-time phone calls or pre-recorded messages"
    ],
    protectionTips: [
      "Establish a family safe word for emergencies",
      "Always hang up and call back on a known number",
      "Be wary of calls requesting money or personal info",
      "Limit voice content shared publicly on social media",
      "Verify caller identity with personal questions"
    ],
    audienceImpact: {
      seniors: "Voice cloning used for 'grandparent scams': calls that sound exactly like family.",
      business: "Fake CEO voice messages authorizing urgent wire transfers",
      parents: "Fake distress calls from 'children' demanding immediate money"
    }
  },
  {
    id: "ai-phishing",
    icon: Mail,
    title: "AI-Enhanced Phishing",
    severity: "high",
    description: "AI writes personalized, grammatically perfect phishing emails that are nearly impossible to detect.",
    realWorldExample: "The Europol IOCTA 2025 report confirms AI-generated phishing emails now eliminate traditional warning signs like grammar errors, and the Verizon 2025 DBIR found AI-generated phishing emails have doubled since prior reports.",
    howItWorks: [
      "AI scrapes your social media and online presence",
      "Creates highly personalized messages referencing real details",
      "Perfect grammar and natural tone with no obvious 'red flags'.",
      "Can mimic writing styles of specific individuals",
      "Generates thousands of unique emails instantly"
    ],
    protectionTips: [
      "Verify unexpected requests through a separate channel",
      "Hover over links before clicking (check the real URL)",
      "Be suspicious even if the email 'sounds' right",
      "Don't trust sender names. Verify email addresses.",
      "When in doubt, contact the company directly"
    ],
    audienceImpact: {
      seniors: "Medicare and Social Security impersonation emails that look completely legitimate",
      business: "Targeted spear-phishing that references real projects and colleagues",
      parents: "School and child activity-related phishing targeting busy parents"
    }
  },
  {
    id: "ai-social-engineering",
    icon: MessageSquare,
    title: "AI Chatbot Scams",
    severity: "medium",
    description: "AI-powered chatbots that build relationships over weeks before executing scams.",
    realWorldExample: "Europol's IOCTA 2025 confirms criminals use AI to personalize grooming and fraud messages at scale, managing hundreds of 'relationships' simultaneously across multiple languages.",
    howItWorks: [
      "AI chatbots pose as romantic interests or friends",
      "Maintain consistent personalities across weeks of conversation",
      "Build emotional connections and trust",
      "Eventually request money, gift cards, or personal info",
      "Can operate 24/7 across multiple victims"
    ],
    protectionTips: [
      "Be cautious of online-only relationships",
      "Video chat early to verify the person is real",
      "Never send money to someone you haven't met in person",
      "Watch for inconsistencies in their stories",
      "Reverse image search profile photos"
    ],
    audienceImpact: {
      seniors: "Companionship scams targeting lonely individuals",
      business: "Fake recruiters or business partners building trust before fraud",
      parents: "AI impersonating children's friends or school officials"
    }
  },
  {
    id: "synthetic-identity",
    icon: Fingerprint,
    title: "AI Synthetic Identity Fraud",
    severity: "high",
    description: "AI creates entirely fake people with synthetic identities for financial fraud.",
    realWorldExample: "According to Federal Reserve estimates, synthetic identity fraud costs billions of dollars annually. AI generates fake IDs, social profiles, and credit histories.",
    howItWorks: [
      "AI generates realistic fake photos of non-existent people",
      "Creates matching social media profiles and histories",
      "Combines real and fake data to create 'synthetic identities'",
      "Used to open accounts, apply for credit, or verify fake businesses"
    ],
    protectionTips: [
      "Verify business partners and vendors thoroughly",
      "Use reverse image search on profile photos",
      "Check for consistent online presence over time",
      "Be wary of too-perfect profiles with limited history",
      "Monitor your credit for unauthorized accounts"
    ],
    audienceImpact: {
      seniors: "Fake financial advisors with AI-generated credentials",
      business: "Fake vendors and partners with synthetic business identities",
      parents: "AI-generated fake profiles targeting children online"
    }
  }
];

const responsibleAIGuidelines = [
  {
    category: "Protect Your Data",
    icon: Lock,
    guidelines: [
      "Never share passwords, financial info, or SSN with AI chatbots",
      "Avoid uploading sensitive documents to free AI tools",
      "Read privacy policies before using AI services",
      "Use AI tools that don't train on your private data",
      "Be cautious about what you share in AI conversations"
    ]
  },
  {
    category: "Verify AI Outputs",
    icon: CheckCircle2,
    guidelines: [
      "AI can confidently state false information",
      "Always verify facts from AI with trusted sources",
      "Don't rely solely on AI for medical, legal, or financial advice",
      "Check AI-generated content for accuracy before sharing",
      "Be skeptical of AI-generated news or statistics"
    ]
  },
  {
    category: "Recognize AI Content",
    icon: Eye,
    guidelines: [
      "Look for AI watermarks or disclosure statements",
      "Check for unnatural patterns in images (hands, backgrounds)",
      "Listen for robotic or unnatural speech patterns",
      "Verify video sources through official channels",
      "Use AI detection tools when suspicious"
    ]
  },
  {
    category: "Safe AI Practices",
    icon: Shield,
    guidelines: [
      "Use reputable AI services from established companies",
      "Keep AI applications updated for security patches",
      "Report AI-generated scams and misinformation",
      "Teach children about AI capabilities and limits",
      "Stay informed about emerging AI threats"
    ]
  }
];

const audienceCards = [
  {
    title: "For Families",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    description: "Protect your loved ones from AI voice cloning and deepfake scams",
    link: "/parents"
  },
  {
    title: "For Seniors",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    description: "Stay safe from AI-powered phone scams and fake video calls",
    link: "/seniors"
  },
  {
    title: "For Businesses",
    icon: Building2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Defend against CEO fraud and AI-enhanced business email compromise",
    link: "/small-business"
  },
  {
    title: "For Educators",
    icon: GraduationCap,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    description: "Teach students to navigate AI safely and recognize AI-generated content",
    link: "/educators"
  }
];

export default function AISafety() {
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);
  const [activeAudience, setActiveAudience] = useState<"seniors" | "business" | "parents">("seniors");

  const selectedThreatData = aiThreats.find(t => t.id === selectedThreat);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.aiSafety} />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <FloatingShapes />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                New Threat Landscape
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              AI & Cyber Safety
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Artificial intelligence is transforming cybersecurity, both as a powerful defense tool and a dangerous weapon in the hands of criminals. Learn to protect yourself in the AI era.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild data-testid="button-learn-threats">
                <a href="#threats">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Learn About AI Threats
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-responsible-ai">
                <a href="#responsible-ai">
                  <Shield className="w-4 h-4 mr-2" />
                  Responsible AI Use
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "3 sec", label: "Audio needed to clone a voice" },
              { value: "60%", label: "Higher click rate for AI phishing" },
              { value: "$6B", label: "Annual synthetic identity fraud" },
              { value: "500%", label: "Increase in deepfake scams (2024)" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Threats Section */}
      <section id="threats" className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              AI-Powered Threats You Need to Know
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Criminals are using AI to create more convincing scams than ever before. Understanding these threats is your first line of defense.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {aiThreats.map((threat, index) => (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  className={`h-full cursor-pointer transition-all hover-elevate ${selectedThreat === threat.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedThreat(selectedThreat === threat.id ? null : threat.id)}
                  data-testid={`card-threat-${threat.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        threat.severity === 'critical' ? 'bg-red-500/10' :
                        threat.severity === 'high' ? 'bg-orange-500/10' :
                        'bg-yellow-500/10'
                      }`}>
                        <threat.icon className={`w-6 h-6 ${
                          threat.severity === 'critical' ? 'text-red-500' :
                          threat.severity === 'high' ? 'text-orange-500' :
                          'text-yellow-500'
                        }`} />
                      </div>
                      <Badge variant={
                        threat.severity === 'critical' ? 'destructive' :
                        threat.severity === 'high' ? 'default' :
                        'secondary'
                      }>
                        {threat.severity} risk
                      </Badge>
                    </div>
                    <CardTitle className="mt-4">{threat.title}</CardTitle>
                    <CardDescription>{threat.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                      "{threat.realWorldExample}"
                    </p>
                    <div className="mt-4 flex items-center text-sm text-primary">
                      <span>Learn more</span>
                      <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${selectedThreat === threat.id ? 'rotate-90' : ''}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Expanded Threat Details */}
          {selectedThreatData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8"
            >
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <selectedThreatData.icon className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle>{selectedThreatData.title}</CardTitle>
                      <CardDescription>Deep Dive</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        How It Works
                      </h4>
                      <ul className="space-y-2">
                        {selectedThreatData.howItWorks.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        How to Protect Yourself
                      </h4>
                      <ul className="space-y-2">
                        {selectedThreatData.protectionTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    <h4 className="font-semibold text-foreground mb-4">Impact by Audience</h4>
                    <Tabs value={activeAudience} onValueChange={(v) => setActiveAudience(v as typeof activeAudience)}>
                      <TabsList>
                        <TabsTrigger value="seniors" data-testid="tab-seniors">Seniors</TabsTrigger>
                        <TabsTrigger value="business" data-testid="tab-business">Business</TabsTrigger>
                        <TabsTrigger value="parents" data-testid="tab-parents">Parents</TabsTrigger>
                      </TabsList>
                      <TabsContent value="seniors" className="mt-4">
                        <div className="flex items-start gap-3 p-4 bg-purple-500/10 rounded-lg">
                          <Users className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">{selectedThreatData.audienceImpact.seniors}</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="business" className="mt-4">
                        <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg">
                          <Building2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">{selectedThreatData.audienceImpact.business}</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="parents" className="mt-4">
                        <div className="flex items-start gap-3 p-4 bg-pink-500/10 rounded-lg">
                          <Heart className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">{selectedThreatData.audienceImpact.parents}</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Responsible AI Section */}
      <section id="responsible-ai" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Using AI Responsibly
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              AI tools like ChatGPT, Claude, and Gemini can be incredibly helpful, but only if you use them safely. Follow these guidelines to protect yourself.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {responsibleAIGuidelines.map((section, index) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{section.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.guidelines.map((guideline, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          {guideline}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What NOT to Share with AI */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What NOT to Share with AI Chatbots
              </h2>
              <p className="text-muted-foreground">
                Even reputable AI services may store and learn from your conversations. Keep this information private.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Lock, text: "Passwords or login credentials", severity: "critical" },
                { icon: FileText, text: "Social Security numbers", severity: "critical" },
                { icon: Building2, text: "Bank account or credit card numbers", severity: "critical" },
                { icon: Phone, text: "Personal phone numbers or addresses", severity: "high" },
                { icon: Mail, text: "Confidential work documents", severity: "high" },
                { icon: Users, text: "Private information about others", severity: "high" },
                { icon: Fingerprint, text: "Medical records or health information", severity: "high" },
                { icon: FileText, text: "Legal documents or contracts", severity: "medium" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    item.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                    item.severity === 'high' ? 'bg-orange-500/5 border-orange-500/20' :
                    'bg-yellow-500/5 border-yellow-500/20'
                  }`}
                >
                  <XCircle className={`w-5 h-5 flex-shrink-0 ${
                    item.severity === 'critical' ? 'text-red-500' :
                    item.severity === 'high' ? 'text-orange-500' :
                    'text-yellow-500'
                  }`} />
                  <span className="text-sm text-foreground">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audience Navigation */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              AI Safety for Your Situation
            </h2>
            <p className="text-muted-foreground">
              Get targeted guidance for your specific needs.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audienceCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={card.link}>
                  <Card className="h-full hover-elevate cursor-pointer" data-testid={`card-audience-${card.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardContent className="pt-6">
                      <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center mb-4`}>
                        <card.icon className={`w-6 h-6 ${card.color}`} />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                      <div className="flex items-center text-sm text-primary">
                        <span>Learn more</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/20 print:hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Put Your Knowledge Into Practice</h2>
            <p className="text-muted-foreground">Use our free tools to detect AI-powered threats and protect yourself.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link href="/tools" data-testid="link-tool-scam-checker">
              <Card className="hover-elevate cursor-pointer h-full">
                <CardContent className="p-5 text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-sm text-foreground mb-1">GCR Scam Guard</h3>
                  <p className="text-xs text-muted-foreground">Analyze suspicious URLs, emails, and messages for AI-generated threats.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools" data-testid="link-tool-ai-scam-analyzer">
              <Card className="hover-elevate cursor-pointer h-full">
                <CardContent className="p-5 text-center">
                  <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-sm text-foreground mb-1">AI Scam Analyzer</h3>
                  <p className="text-xs text-muted-foreground">Get AI-powered analysis of suspicious content and phishing attempts.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools?tab=safety-toolkit" data-testid="link-tool-password-generator">
              <Card className="hover-elevate cursor-pointer h-full">
                <CardContent className="p-5 text-center">
                  <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-sm text-foreground mb-1">Password Generator</h3>
                  <p className="text-xs text-muted-foreground">Create strong, unique passwords to secure your accounts against AI attacks.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0">
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Stay Ahead of AI Threats
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                The AI threat landscape evolves rapidly. Subscribe to our newsletter for the latest AI safety tips and threat alerts.
              </p>
              <Button size="lg" asChild data-testid="button-subscribe-newsletter">
                <Link href="/contact">
                  Subscribe to Updates
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground py-4">
          <CalendarDays className="w-3 h-3" />
          <span>Content last reviewed: February 2026</span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
