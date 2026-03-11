import { useState } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import type { FAQData, BreadcrumbData } from "@/components/structured-data";
import { 
  Shield, Lock, Eye, MessageCircle, Smartphone, Gamepad2,
  CheckCircle, Star, Users, AlertTriangle, Heart,
  ArrowRight, Lightbulb, Settings, Clock, BookOpen,
  CalendarDays
} from "lucide-react";
import bannerImage from "@/assets/banners/parents-banner.png";
import cardParentalControls from "@/assets/images/card-parental-controls.png";
import cardSocialMedia from "@/assets/images/card-social-media-safety.png";
import cardScreenTime from "@/assets/images/card-screen-time.png";
import cardGamingSafety from "@/assets/images/card-gaming-safety.png";
import cardOnlinePredators from "@/assets/images/card-online-predators.png";
import cardFirstDevice from "@/assets/images/card-first-device.png";

interface ParentTopic {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
  color: string;
  image: string;
  content: {
    intro: string;
    keyPoints: string[];
    actionSteps: string[];
    conversationStarters: string[];
  };
}

const parentTopics: ParentTopic[] = [
  {
    id: "device-controls",
    title: "Setting Up Parental Controls",
    description: "Configure devices and apps to keep your children safer online.",
    icon: Settings,
    color: "bg-blue-500",
    image: cardParentalControls,
    content: {
      intro: "Parental controls are your first line of defense in creating a safer online environment for your children. These tools help you manage screen time, filter inappropriate content, and monitor online activities. While no tool is perfect, they provide an important layer of protection.",
      keyPoints: [
        "Every major device and platform offers built-in parental controls.",
        "Controls should be adjusted as children grow and demonstrate responsibility.",
        "Technology works best alongside open communication with your children.",
        "Review and update settings regularly as new apps and features emerge.",
        "Consider using family sharing features to manage app purchases and downloads."
      ],
      actionSteps: [
        "Enable Screen Time (Apple) or Family Link (Google) on your child's devices.",
        "Set up content filters on your home router for network-wide protection.",
        "Configure privacy settings on social media accounts together with your child.",
        "Create age-appropriate user accounts rather than sharing adult accounts.",
        "Enable purchase restrictions to prevent unauthorized app or game purchases."
      ],
      conversationStarters: [
        "Let's set up your device together so we both understand how it works.",
        "What apps do your friends use? Let's look at them together.",
        "I'm not trying to spy on you. I want to help keep you safe."
      ]
    }
  },
  {
    id: "social-media",
    title: "Social Media Safety",
    description: "Guide your children through social media risks and responsibilities.",
    icon: MessageCircle,
    color: "bg-pink-500",
    image: cardSocialMedia,
    content: {
      intro: "Social media is a significant part of many children's lives, offering connection and creativity but also real risks. Your role is to help them navigate these platforms safely, understand what they share, and recognize when something feels wrong.",
      keyPoints: [
        "Most social media platforms require users to be at least 13 years old.",
        "Private accounts are safer than public ones for children.",
        "What is posted online can be screenshotted and shared beyond their control.",
        "Followers and friends online may not be who they claim to be.",
        "Social media can affect mental health through comparison and cyberbullying."
      ],
      actionSteps: [
        "Know which platforms your child uses and have your own accounts there.",
        "Set accounts to private and review follower requests together.",
        "Discuss what is and is not appropriate to share online.",
        "Establish rules about accepting friend requests from strangers.",
        "Create a judgment-free environment where they can report problems."
      ],
      conversationStarters: [
        "Who are your closest friends online? Do you know them in real life?",
        "Has anyone ever made you feel uncomfortable on social media?",
        "What would you do if someone you don't know sent you a message?"
      ]
    }
  },
  {
    id: "screen-time",
    title: "Managing Screen Time",
    description: "Create healthy boundaries around device use for the whole family.",
    icon: Clock,
    color: "bg-purple-500",
    image: cardScreenTime,
    content: {
      intro: "Finding the right balance with screen time is challenging for every family. The goal is not to eliminate technology but to ensure it does not interfere with sleep, physical activity, homework, and family time. Consistent rules and modeling good behavior yourself are key.",
      keyPoints: [
        "Quality of screen time matters as much as quantity.",
        "Educational content and creative activities differ from passive consumption.",
        "Sleep, physical activity, and family time should not be sacrificed for screens.",
        "Children learn from watching how parents use their own devices.",
        "Flexibility is okay for special occasions, but consistency matters overall."
      ],
      actionSteps: [
        "Create device-free zones like bedrooms and the dinner table.",
        "Set consistent daily limits appropriate for your child's age.",
        "Establish a charging station where devices stay overnight.",
        "Plan regular family activities that do not involve screens.",
        "Model the behavior you want to see by managing your own screen time."
      ],
      conversationStarters: [
        "What are your favorite things to do on your device?",
        "How do you feel after spending a long time on screens?",
        "Let's plan something fun to do together this weekend without devices."
      ]
    }
  },
  {
    id: "gaming-safety",
    title: "Online Gaming Safety",
    description: "Understand gaming risks including strangers, purchases, and addiction.",
    icon: Gamepad2,
    color: "bg-green-500",
    image: cardGamingSafety,
    content: {
      intro: "Video games can be fun, educational, and social, but they also present unique risks. Many games include chat features with strangers, in-app purchases, and mechanics designed to keep players engaged for long periods. Understanding these risks helps you set appropriate boundaries.",
      keyPoints: [
        "Many games include voice and text chat with unknown players.",
        "In-game purchases can add up quickly, especially with loot boxes.",
        "Some game mechanics are designed to be addictive.",
        "Age ratings exist but do not capture all potential risks.",
        "Gaming communities can be positive but also expose children to toxic behavior."
      ],
      actionSteps: [
        "Review game ratings and read parent reviews before allowing new games.",
        "Disable or limit in-game purchases and require approval for downloads.",
        "Set up gaming in shared family spaces rather than private rooms.",
        "Play games with your children to understand what they experience.",
        "Teach children to mute, block, and report players who behave badly."
      ],
      conversationStarters: [
        "Tell me about the game you're playing. What do you like about it?",
        "Do you ever chat with people you don't know while gaming?",
        "Has anyone ever said something mean or made you uncomfortable in a game?"
      ]
    }
  },
  {
    id: "online-predators",
    title: "Protecting Against Online Predators",
    description: "Recognize grooming behaviors and keep communication open.",
    icon: AlertTriangle,
    color: "bg-red-500",
    image: cardOnlinePredators,
    content: {
      intro: "Online predators use technology to target and manipulate children. They often spend weeks or months building trust before attempting to exploit. Teaching children about these tactics and maintaining open communication are your strongest defenses.",
      keyPoints: [
        "Predators often pose as peers and build relationships gradually.",
        "They may offer excessive compliments, gifts, or special attention.",
        "Secrecy is a major warning sign. Predators try to isolate children from parents.",
        "Any adult asking a child to keep secrets from parents is a red flag.",
        "Children often blame themselves and fear getting in trouble, which keeps them silent."
      ],
      actionSteps: [
        "Teach children that real friends do not ask them to keep secrets from parents.",
        "Explain that it is never the child's fault if an adult behaves inappropriately.",
        "Keep devices in common areas and maintain awareness of online activities.",
        "Make it clear that children will not be punished for reporting concerns.",
        "Know who your child communicates with regularly online."
      ],
      conversationStarters: [
        "You can tell me anything, and you will never be in trouble for being honest.",
        "Has anyone online ever asked you to keep a secret from me?",
        "What would you do if someone online made you feel uncomfortable?"
      ]
    }
  },
  {
    id: "digital-footprint",
    title: "Building a Positive Digital Footprint",
    description: "Help children understand that online actions have lasting consequences.",
    icon: Eye,
    color: "bg-teal-500",
    image: cardFirstDevice,
    content: {
      intro: "Everything posted online creates a digital footprint that can follow your child for years. Colleges and employers regularly review social media. Teaching children to think before they post helps them build a positive online reputation.",
      keyPoints: [
        "Posts, photos, and comments can be permanent even if deleted.",
        "Screenshots allow others to preserve and share content without consent.",
        "Future schools and employers may search for candidates online.",
        "Negative content can resurface years later and cause harm.",
        "A positive digital footprint can actually help with opportunities."
      ],
      actionSteps: [
        "Teach the 'Grandma Rule': Do not post anything you would not want grandma to see.",
        "Regularly review your child's social media presence together.",
        "Help them understand privacy settings and who can see their posts.",
        "Encourage positive contributions like sharing achievements and helping others.",
        "Set a good example with your own online behavior."
      ],
      conversationStarters: [
        "Imagine a college admissions officer looking at your posts. What would they think?",
        "What positive things about yourself would you want someone to find online?",
        "Let's look at your accounts together and see what's public."
      ]
    }
  }
];

function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-blue-300/15 dark:bg-blue-500/10" />
      <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-pink-300/15 dark:bg-pink-500/10" />
      <div className="absolute bottom-32 left-1/4 w-12 h-12 rounded-full bg-purple-300/15 dark:bg-purple-500/10" />
      <div className="absolute bottom-20 right-1/3 w-20 h-20 rounded-full bg-teal-300/15 dark:bg-teal-500/10" />
    </div>
  );
}

function ParentsLanding({ onSelectTopic }: { onSelectTopic: (id: string) => void }) {
  return (
    <>
      <PageBanner
        title="Protect Your Family Online"
        subtitle="Practical tools and guidance to help you keep your children safe in the digital world while fostering healthy technology habits."
        imageSrc={bannerImage}
        imageAlt="Family learning about digital safety together"
        colorVariant="blue"
      />
      
      <div className="relative py-12">
        <FloatingShapes />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {parentTopics.map((topic) => (
              <Card 
                key={topic.id}
                className="cursor-pointer transition-shadow hover:shadow-xl border-2 border-white/50 dark:border-white/10 bg-white/80 dark:bg-card/80 backdrop-blur-sm overflow-visible"
                onClick={() => onSelectTopic(topic.id)}
                onKeyDown={(e) => e.key === 'Enter' && onSelectTopic(topic.id)}
                tabIndex={0}
                role="button"
                aria-label={`Learn about ${topic.title}`}
                data-testid={`card-topic-${topic.id}`}
              >
                <div className="relative h-48 sm:h-56 rounded-t-md overflow-hidden">
                  <img
                    src={topic.image}
                    alt={topic.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    data-testid={`img-topic-${topic.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className={`absolute bottom-3 left-3 w-10 h-10 rounded-md ${topic.color} flex items-center justify-center shadow-lg`}>
                    <topic.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg text-foreground mb-1">{topic.title}</h3>
                  <p className="text-muted-foreground text-sm">{topic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800 mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      Child Safety Conversation Scanner
                    </h3>
                    <Badge className="bg-purple-500">NEW</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Analyze online conversations for grooming patterns and warning signs. Get instant risk assessment with emergency reporting resources.
                  </p>
                </div>
                <Link href="/parents/child-safety-scanner">
                  <Button className="bg-purple-600" data-testid="button-child-safety-scanner">
                    <Shield className="w-4 h-4 mr-2" />
                    Open Scanner
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-2 border-teal-200 dark:border-teal-800">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Kids Digital Safety Hub
                  </h3>
                  <p className="text-muted-foreground">
                    Interactive lessons designed specifically for children ages 8 to 16. Learn together with your kids.
                  </p>
                </div>
                <Link href="/kids">
                  <Button variant="outline" className="border-teal-300 dark:border-teal-700" data-testid="button-kids-hub">
                    Visit Kids Hub
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Open Communication is Key</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  The most effective protection comes from building trust with your children so they feel comfortable coming to you with concerns.
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
  topic: ParentTopic;
  onBack: () => void;
}) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30" />
      
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

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-lg text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Key Points to Understand
                </h4>
                <ul className="space-y-3">
                  {topic.content.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700 dark:text-blue-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-lg text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Action Steps
                </h4>
                <ul className="space-y-3">
                  {topic.content.actionSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-700 dark:text-green-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-lg text-purple-800 dark:text-purple-200 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Conversation Starters
                </h4>
                <ul className="space-y-3">
                  {topic.content.conversationStarters.map((starter, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-purple-500 font-bold">"</span>
                      <span className="text-purple-700 dark:text-purple-300 italic">{starter}</span>
                      <span className="text-purple-500 font-bold">"</span>
                    </li>
                  ))}
                </ul>
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

export default function Parents() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const currentTopic = selectedTopic 
    ? parentTopics.find(t => t.id === selectedTopic) 
    : null;

  const parentsFaqSchema: FAQData = {
    type: "FAQPage",
    items: parentTopics.map(topic => ({
      question: `How can I help my child with ${topic.title.toLowerCase()}?`,
      answer: topic.content.intro,
    })),
  };

  const parentsBreadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Parents", url: "https://www.getcyberright.com/parents" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.parents} />
      <StructuredData data={[parentsFaqSchema, parentsBreadcrumbs]} />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        {currentTopic ? (
          <TopicContent 
            topic={currentTopic}
            onBack={() => setSelectedTopic(null)}
          />
        ) : (
          <ParentsLanding onSelectTopic={setSelectedTopic} />
        )}
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground py-4">
          <CalendarDays className="w-3 h-3" />
          <span>Content last reviewed: February 2026</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
