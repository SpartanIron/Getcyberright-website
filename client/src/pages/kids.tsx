import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import kidsBannerImage from "@/assets/images/kids-safety-banner.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Lock, Eye, MessageCircle, Gamepad2, Users, 
  CheckCircle, Star, Trophy, BookOpen, Heart, 
  Smartphone, AlertCircle, ThumbsUp, ArrowRight,
  GraduationCap, Home, Lightbulb, Target, Sparkles,
  CalendarDays
} from "lucide-react";

import kidsYoungLearnersImg from "@/assets/images/kids-young-learners.png";
import kidsTeenLearnersImg from "@/assets/images/kids-teen-learners.png";
import kidsSpotScamImg from "@/assets/images/kids-spot-scam.png";
import kidsFamilyTogetherImg from "@/assets/images/kids-family-together.png";
import kidsPersonalInfoImg from "@/assets/images/kids-personal-info.png";
import kidsPasswordPowerImg from "@/assets/images/kids-password-power.png";
import kidsSpottingTricksImg from "@/assets/images/kids-spotting-tricks.png";
import kidsDeviceSafetyImg from "@/assets/images/kids-device-safety.png";
import kidsTrustedAdultsImg from "@/assets/images/kids-trusted-adults.png";
import kidsSocialMediaImg from "@/assets/images/kids-social-media.png";
import kidsCyberbullyingImg from "@/assets/images/kids-cyberbullying.png";
import kidsGamingSmartImg from "@/assets/images/kids-gaming-smart.png";
import kidsPhishingImg from "@/assets/images/kids-phishing.png";
import kidsDigitalFootprintImg from "@/assets/images/kids-digital-footprint.png";

// Floating decorative shapes component for kid-friendly design
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle decorative circles - no animation for cleaner look */}
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-teal-300/15 dark:bg-teal-500/10" />
      <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-purple-300/15 dark:bg-purple-500/10" />
      <div className="absolute bottom-32 left-1/4 w-12 h-12 rounded-full bg-pink-300/15 dark:bg-pink-500/10" />
      <div className="absolute bottom-20 right-1/3 w-20 h-20 rounded-full bg-blue-300/15 dark:bg-blue-500/10" />
      
      {/* Single subtle star */}
      <div className="absolute top-32 left-1/3 text-yellow-400/30 dark:text-yellow-500/15">
        <Star className="w-8 h-8 fill-current" />
      </div>
    </div>
  );
}

type AgeGroup = "8-11" | "12-16" | null;
type ActiveModule = string | null;

interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
  color: string;
  image: string;
  content: {
    intro: string;
    tips: string[];
    remember: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const foundationsModules: LearningModule[] = [
  {
    id: "personal-info",
    title: "What is Personal Information?",
    description: "Learn what information to keep private online.",
    icon: Eye,
    color: "bg-blue-500",
    image: kidsPersonalInfoImg,
    content: {
      intro: "Personal information is anything that tells people who you are or where to find you. Just like you would not give your house key to a stranger, you should not share personal details online with people you do not know.",
      tips: [
        "Your full name, address, and phone number are private.",
        "Never share your school name or where you hang out.",
        "Do not tell anyone your passwords, not even friends.",
        "Photos can reveal where you are, so be careful what you share.",
        "Ask a trusted adult before filling out any online forms."
      ],
      remember: "If someone online asks for personal information, tell a trusted adult right away. Real friends and safe websites will never pressure you to share private details."
    },
    quiz: {
      question: "Which of these is safe to share with someone you met online?",
      options: [
        "Your home address",
        "Your favorite color",
        "Your school name",
        "Your phone number"
      ],
      correctIndex: 1,
      explanation: "Your favorite color is safe to share because it does not reveal where you are or how to find you. Your address, school, and phone number should stay private."
    }
  },
  {
    id: "password-basics",
    title: "Password Power",
    description: "Create strong passwords that keep you safe.",
    icon: Lock,
    color: "bg-purple-500",
    image: kidsPasswordPowerImg,
    content: {
      intro: "Passwords are like secret codes that protect your accounts. A strong password keeps your games, photos, and messages safe from people who should not see them.",
      tips: [
        "Use at least 8 characters in your password.",
        "Mix uppercase letters, lowercase letters, and numbers.",
        "Never use your name, birthday, or pet's name.",
        "Do not share your password with friends.",
        "Use different passwords for different accounts."
      ],
      remember: "A good password is like a secret superhero code. Make it long, make it tricky, and keep it to yourself."
    },
    quiz: {
      question: "Which password is the strongest?",
      options: [
        "password123",
        "MyDogSpot",
        "Sun7Flower9Rain",
        "12345678"
      ],
      correctIndex: 2,
      explanation: "Sun7Flower9Rain is the strongest because it mixes words with numbers and is hard to guess. The others are too simple or use common words."
    }
  },
  {
    id: "spotting-tricks",
    title: "Spotting Online Tricks",
    description: "Learn to recognize when something seems wrong.",
    icon: AlertCircle,
    color: "bg-orange-500",
    image: kidsSpottingTricksImg,
    content: {
      intro: "Some people online try to trick kids. They might pretend to be someone they are not or offer things that seem too good to be true. Learning to spot these tricks keeps you safe.",
      tips: [
        "If someone offers free games or prizes, it might be a trick.",
        "Pop-ups that say you won something are usually not real.",
        "Strangers who want to be your best friend right away may not be safe.",
        "Messages asking you to click strange links could be harmful.",
        "If something feels wrong, it probably is. Trust your feelings."
      ],
      remember: "When in doubt, do not click. Ask a parent or trusted adult to help you figure out if something is real or a trick."
    },
    quiz: {
      question: "You see a pop-up that says you won a free gaming console. What should you do?",
      options: [
        "Click it right away to claim your prize",
        "Enter your address so they can send it",
        "Close it and tell a trusted adult",
        "Share the link with friends so they can win too"
      ],
      correctIndex: 2,
      explanation: "Close it and tell a trusted adult. These pop-ups are almost always tricks to get your personal information or put harmful software on your device."
    }
  },
  {
    id: "device-safety",
    title: "Taking Care of Your Devices",
    description: "Keep your phone, tablet, and computer safe.",
    icon: Smartphone,
    color: "bg-teal-500",
    image: kidsDeviceSafetyImg,
    content: {
      intro: "Your devices are valuable tools for learning and fun. Taking care of them means keeping them physically safe and making sure the information on them stays protected.",
      tips: [
        "Always lock your device with a PIN or password.",
        "Only download apps your parents have approved.",
        "Keep your device updated when it asks you to.",
        "Do not click on links or ads you do not recognize.",
        "Tell a parent if your device starts acting strange."
      ],
      remember: "Treat your device like a treasure. Lock it up, keep it clean, and only let trusted things inside."
    },
    quiz: {
      question: "What should you do before downloading a new app?",
      options: [
        "Download it right away if it looks fun",
        "Ask a parent or trusted adult first",
        "Share it with all your friends",
        "Give it your email address"
      ],
      correctIndex: 1,
      explanation: "Always ask a parent or trusted adult before downloading new apps. They can help make sure the app is safe and appropriate for you."
    }
  },
  {
    id: "trusted-adults",
    title: "Talking to Trusted Adults",
    description: "Know who to ask for help and when.",
    icon: Heart,
    color: "bg-pink-500",
    image: kidsTrustedAdultsImg,
    content: {
      intro: "Trusted adults are people who care about you and want to keep you safe. They can be parents, grandparents, teachers, or other family members you know well. You can always go to them when something online makes you uncomfortable.",
      tips: [
        "Make a list of trusted adults you can talk to.",
        "You will never get in trouble for asking for help.",
        "Tell an adult if someone online makes you uncomfortable.",
        "Share anything that confuses or scares you online.",
        "Adults want to help you stay safe, not punish you."
      ],
      remember: "No question is too small and no worry is too silly. Your trusted adults are on your team."
    },
    quiz: {
      question: "Someone online said something that made you feel uncomfortable. What should you do?",
      options: [
        "Keep it a secret so you do not get in trouble",
        "Reply to them and tell them to stop",
        "Tell a trusted adult what happened",
        "Just ignore it and hope it goes away"
      ],
      correctIndex: 2,
      explanation: "Tell a trusted adult what happened. You will never get in trouble for reporting something that made you uncomfortable. Adults are there to help keep you safe."
    }
  }
];

const smartSafeModules: LearningModule[] = [
  {
    id: "social-media-safety",
    title: "Smart Social Media Use",
    description: "Navigate social platforms safely and wisely.",
    icon: MessageCircle,
    color: "bg-blue-600",
    image: kidsSocialMediaImg,
    content: {
      intro: "Social media can be a great way to connect with friends and share your interests. But it is important to use it wisely. What you post online can stay there forever and be seen by more people than you expect.",
      tips: [
        "Set your accounts to private so only approved followers see your posts.",
        "Think before you post. Would you be okay if everyone saw this?",
        "Do not accept friend requests from people you do not know in real life.",
        "Be kind in your comments. Treat others how you want to be treated.",
        "Take breaks from social media if it starts making you feel bad."
      ],
      remember: "Your online reputation is part of your real reputation. Everything you share reflects who you are."
    },
    quiz: {
      question: "Before posting a photo, what should you consider?",
      options: [
        "Just post it quickly before anyone notices",
        "Whether it could embarrass you or someone else later",
        "Only how many likes it might get",
        "Nothing, posts can always be deleted"
      ],
      correctIndex: 1,
      explanation: "Consider whether the photo could embarrass you or someone else later. Even deleted posts can be screenshotted and shared, so think carefully before posting."
    }
  },
  {
    id: "cyberbullying",
    title: "Understanding Online Bullying",
    description: "Recognize bullying and know how to respond.",
    icon: Users,
    color: "bg-red-500",
    image: kidsCyberbullyingImg,
    content: {
      intro: "Online bullying, sometimes called cyberbullying, happens when someone uses technology to hurt, embarrass, or threaten others. It can happen through texts, social media, games, or any online platform. Knowing how to handle it helps you and your friends stay safe.",
      tips: [
        "Do not respond to mean messages. Responding often makes things worse.",
        "Save evidence by taking screenshots of hurtful messages.",
        "Block people who are being cruel to you.",
        "Tell a trusted adult about what is happening.",
        "Be an upstander, not a bystander. Support friends who are being bullied."
      ],
      remember: "Online bullying is never your fault. No one deserves to be treated badly. Speaking up takes courage and helps everyone."
    },
    quiz: {
      question: "If someone is being mean to you online, what should you do first?",
      options: [
        "Send them a mean message back",
        "Do not respond, save evidence, and tell a trusted adult",
        "Create a new account to respond anonymously",
        "Just delete your account and give up"
      ],
      correctIndex: 1,
      explanation: "Do not respond, save evidence, and tell a trusted adult. Responding to bullies often makes things worse, but keeping evidence and getting help can stop the bullying."
    }
  },
  {
    id: "gaming-safety",
    title: "Gaming Smart",
    description: "Stay safe while having fun in online games.",
    icon: Gamepad2,
    color: "bg-green-600",
    image: kidsGamingSmartImg,
    content: {
      intro: "Online gaming is fun, but it comes with some risks. Some players are not who they say they are, and some games try to get you to spend money. Knowing how to game safely means you can enjoy playing while protecting yourself.",
      tips: [
        "Use a gaming name that does not reveal your real identity.",
        "Never share personal information with other players.",
        "Be careful about in-game purchases and always ask a parent first.",
        "Mute or block players who are being rude or inappropriate.",
        "Take regular breaks and balance gaming with other activities."
      ],
      remember: "Real gaming skills do not require sharing personal info. Stay anonymous and stay safe while having fun."
    },
    quiz: {
      question: "Someone in an online game asks for your real name and where you live. What should you do?",
      options: [
        "Tell them because they seem friendly",
        "Trade personal info for in-game items",
        "Politely decline and only share your game name",
        "Give them fake information to trick them"
      ],
      correctIndex: 2,
      explanation: "Politely decline and only share your game name. Real friends in games do not need to know your personal details. Keep your real identity private."
    }
  },
  {
    id: "phishing-scams",
    title: "Spotting Phishing Scams",
    description: "Identify fake messages designed to steal information.",
    icon: AlertCircle,
    color: "bg-orange-600",
    image: kidsPhishingImg,
    content: {
      intro: "Phishing is when someone sends fake messages that look real to trick you into giving up passwords or personal information. These can come as emails, texts, or messages in apps. Scammers have become very good at making these look legitimate.",
      tips: [
        "Check the sender's email address carefully for misspellings.",
        "Be suspicious of urgent messages saying your account will be closed.",
        "Do not click links in unexpected messages. Go directly to the website instead.",
        "Look for spelling and grammar mistakes in messages.",
        "When in doubt, ask a parent or do not click."
      ],
      remember: "Legitimate companies will never ask for your password through email or messages. When something seems urgent or too good to be true, slow down and verify."
    },
    quiz: {
      question: "You get an email saying your gaming account will be deleted unless you click a link right now. What should you do?",
      options: [
        "Click the link immediately to save your account",
        "Reply with your password to prove it is you",
        "Do not click, and log into your account directly through the app or website",
        "Forward it to all your friends so they know about the problem"
      ],
      correctIndex: 2,
      explanation: "Do not click, and log into your account directly through the app or website. Real companies do not ask you to click urgent links. Always go directly to the official site to check your account."
    }
  },
  {
    id: "digital-footprint",
    title: "Your Digital Footprint",
    description: "Understand how your online actions follow you.",
    icon: Target,
    color: "bg-purple-600",
    image: kidsDigitalFootprintImg,
    content: {
      intro: "Your digital footprint is the trail of information you leave behind online. Every post, comment, photo, and search adds to it. This footprint can be seen by friends, family, schools, and even future employers. Managing it wisely is an important life skill.",
      tips: [
        "Search your own name to see what others can find about you.",
        "Think about how posts might look to a future college or employer.",
        "Remember that screenshots last forever, even if you delete a post.",
        "Be intentional about building a positive online presence.",
        "Review your privacy settings on all platforms regularly."
      ],
      remember: "Your digital footprint is part of your personal brand. Make it something you are proud of."
    },
    quiz: {
      question: "What is true about your digital footprint?",
      options: [
        "Deleting posts erases them completely",
        "Only your friends can see your online activity",
        "Your online actions can affect real life opportunities",
        "It only includes things you post yourself"
      ],
      correctIndex: 2,
      explanation: "Your online actions can affect real life opportunities. Colleges and employers often search for applicants online, so what you post today can impact your future."
    }
  }
];

interface SpotTheScamItem {
  id: number;
  scenario: string;
  isScam: boolean;
  explanation: string;
}

const spotTheScamItems: SpotTheScamItem[] = [
  {
    id: 1,
    scenario: "A pop-up says you won a free iPhone and just need to enter your address to receive it.",
    isScam: true,
    explanation: "This is a scam. Real prizes do not come from random pop-ups. They want your personal information."
  },
  {
    id: 2,
    scenario: "Your school sends an email through the official school portal about a field trip next week.",
    isScam: false,
    explanation: "This is legitimate. Official school communications through known portals are typically safe."
  },
  {
    id: 3,
    scenario: "Someone you never met in a game offers to give you their account for free if you share your password.",
    isScam: true,
    explanation: "This is a scam. No one should ever need your password. They are trying to steal your account."
  },
  {
    id: 4,
    scenario: "Your grandmother video calls you using the app your family always uses.",
    isScam: false,
    explanation: "This is safe. A video call from a known family member through a trusted app is legitimate."
  },
  {
    id: 5,
    scenario: "An email claims your streaming account will be deleted in 24 hours unless you click a link to verify your password.",
    isScam: true,
    explanation: "This is a scam. Legitimate companies do not send urgent password requests via email. Log in directly through the official app."
  },
  {
    id: 6,
    scenario: "A friend at school shares a funny video link in person during lunch.",
    isScam: false,
    explanation: "This is likely safe. A friend you know in person sharing something face to face is different from online strangers."
  }
];

function KidsLanding({ onSelectAge }: { onSelectAge: (age: AgeGroup) => void }) {
  return (
    <div className="relative">
      {/* Colorful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 dark:from-teal-950/30 dark:via-purple-950/30 dark:to-pink-950/30" />
      
      <div className="relative py-12">
        <FloatingShapes />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-5 py-2.5 rounded-full mb-6 shadow-lg">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Kids Digital Safety Hub</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Learn to Stay Safe Online
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fun and easy lessons to help you become a smart and safe internet explorer. Choose your age group to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card 
              className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 border-teal-200 dark:border-teal-800 bg-white/80 dark:bg-card/80 backdrop-blur-sm"
              onClick={() => onSelectAge("8-11")}
              data-testid="card-age-8-11"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={kidsYoungLearnersImg}
                  alt="Young children learning about internet safety together"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  data-testid="img-age-8-11"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 via-teal-800/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 text-white fill-current" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white drop-shadow-md">Ages 8 to 11</h3>
                      <p className="text-teal-100 text-sm font-medium">Foundations</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="text-center pt-5 pb-5">
                <p className="text-muted-foreground mb-4 text-sm">
                  Start your internet safety journey with fun lessons about passwords, personal information, and staying safe online.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">Beginner Friendly</Badge>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">5 Lessons</Badge>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Fun Quizzes</Badge>
                </div>
                <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 shadow-md" data-testid="button-start-8-11">
                  Start Learning <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-card/80 backdrop-blur-sm"
              onClick={() => onSelectAge("12-16")}
              data-testid="card-age-12-16"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={kidsTeenLearnersImg}
                  alt="Teenagers confidently using devices with security shields"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  data-testid="img-age-12-16"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-purple-800/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white drop-shadow-md">Ages 12 to 16</h3>
                      <p className="text-purple-100 text-sm font-medium">Smart and Safe Online</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="text-center pt-5 pb-5">
                <p className="text-muted-foreground mb-4 text-sm">
                  Level up your digital skills with lessons on social media, gaming safety, spotting scams, and building a positive online reputation.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">Intermediate</Badge>
                  <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300">5 Lessons</Badge>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">Real Scenarios</Badge>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-md" data-testid="button-start-12-16">
                  Start Learning <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    For Parents and Educators
                  </h3>
                  <p className="text-muted-foreground">
                    Learn how this section works, what your kids will learn, and get conversation starters to discuss online safety together.
                  </p>
                </div>
                <Button variant="outline" className="border-blue-300 dark:border-blue-700" onClick={() => {
                  const element = document.getElementById('parent-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }} data-testid="button-parent-info">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Built for Learning, Not Data Collection</p>
                <p className="text-sm text-teal-600 dark:text-teal-400">
                  This section does not collect any personal information from children. No accounts required, no ads. Just safe learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LearningTrack({ 
  ageGroup, 
  onBack,
  activeModule,
  setActiveModule,
  completedModules,
  setCompletedModules
}: { 
  ageGroup: AgeGroup;
  onBack: () => void;
  activeModule: ActiveModule;
  setActiveModule: (id: ActiveModule) => void;
  completedModules: string[];
  setCompletedModules: (modules: string[]) => void;
}) {
  const modules = ageGroup === "8-11" ? foundationsModules : smartSafeModules;
  const trackTitle = ageGroup === "8-11" ? "Foundations" : "Smart and Safe Online";
  const trackColor = ageGroup === "8-11" ? "teal" : "purple";

  const bgGradient = ageGroup === "8-11" 
    ? "from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950/30 dark:via-cyan-950/30 dark:to-blue-950/30"
    : "from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30";

  return (
    <div className="relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`} />
      <FloatingShapes />
      
      <div className="relative py-8">
        <div className="max-w-5xl mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="mb-6"
            data-testid="button-back-to-ages"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Age Selection
          </Button>

          <div className="mb-8 p-6 bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-xl border border-white/50 dark:border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`${trackColor === 'teal' ? 'bg-gradient-to-r from-teal-500 to-blue-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white shadow-md`}>
                Ages {ageGroup}
              </Badge>
              <div className="flex gap-1">
                {[...Array(completedModules.length)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{trackTitle}</h2>
            <p className="text-muted-foreground">
              Complete each lesson and quiz to earn your safety badges. You have completed {completedModules.length} of {modules.length} lessons.
            </p>
            
            <div className="mt-4 w-full bg-muted rounded-full h-4 overflow-hidden">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${trackColor === 'teal' ? 'bg-gradient-to-r from-teal-400 to-blue-500' : 'bg-gradient-to-r from-purple-400 to-pink-500'}`}
                style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
              />
            </div>
          </div>

        {activeModule ? (
          <ModuleContent 
            module={modules.find(m => m.id === activeModule)!}
            onComplete={() => {
              if (!completedModules.includes(activeModule)) {
                setCompletedModules([...completedModules, activeModule]);
              }
              setActiveModule(null);
            }}
            onBack={() => setActiveModule(null)}
            isCompleted={completedModules.includes(activeModule)}
          />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {modules.map((module, index) => {
                const isCompleted = completedModules.includes(module.id);
                return (
                  <Card 
                    key={module.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white/80 dark:bg-card/80 backdrop-blur-sm border-2 overflow-hidden ${isCompleted ? 'border-green-400 dark:border-green-600 ring-2 ring-green-200 dark:ring-green-800' : 'border-white/50 dark:border-white/10'}`}
                    onClick={() => setActiveModule(module.id)}
                    data-testid={`card-module-${module.id}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={module.image}
                        alt={module.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent`} />
                      {isCompleted && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white rounded-full px-2.5 py-1 shadow-md">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Done</span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-3">
                        <div className={`w-9 h-9 rounded-lg ${module.color} flex items-center justify-center shadow-md`}>
                          <module.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base text-foreground leading-tight">{module.title}</h3>
                        {isCompleted && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{module.description}</p>
                      {!isCompleted && (
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs">
                          Ready to start
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs">
                          Completed
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {completedModules.length === modules.length && !activeModule && (
            <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Congratulations!</h3>
                <p className="text-muted-foreground text-lg mb-4">
                  You have completed all the lessons in the {trackTitle} track. You are now a certified internet safety champion.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md">All Lessons Complete</Badge>
                  <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md">Safety Champion</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ModuleContent({ 
  module, 
  onComplete, 
  onBack,
  isCompleted 
}: { 
  module: LearningModule;
  onComplete: () => void;
  onBack: () => void;
  isCompleted: boolean;
}) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const isCorrect = selectedAnswer === module.quiz.correctIndex;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} data-testid="button-back-to-modules">
        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
        Back to Lessons
      </Button>

      <Card className="overflow-hidden">
        <div className="relative h-44 sm:h-52 overflow-hidden">
          <img
            src={module.image}
            alt={module.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${module.color} flex items-center justify-center shadow-lg`}>
                <module.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">{module.title}</h3>
                <p className="text-white/80 text-sm">{module.description}</p>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="space-y-6 pt-6">
          {!showQuiz ? (
            <>
              <div className="bg-muted/50 rounded-lg p-6">
                <p className="text-lg text-foreground leading-relaxed">{module.content.intro}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Important Tips
                </h4>
                <ul className="space-y-3">
                  {module.content.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Remember This
                </h4>
                <p className="text-blue-700 dark:text-blue-300">{module.content.remember}</p>
              </div>

              <div className="flex justify-center pt-4">
                <Button onClick={() => setShowQuiz(true)} data-testid="button-take-quiz">
                  Take the Quiz <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Badge className="mb-2">Quiz Time</Badge>
                <h4 className="text-xl font-semibold text-foreground">{module.quiz.question}</h4>
              </div>

              <div className="grid gap-3">
                {module.quiz.options.map((option, index) => {
                  let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
                  
                  if (showResult) {
                    if (index === module.quiz.correctIndex) {
                      buttonClass += "border-green-500 bg-green-50 dark:bg-green-900/20";
                    } else if (index === selectedAnswer && !isCorrect) {
                      buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20";
                    } else {
                      buttonClass += "border-muted opacity-50";
                    }
                  } else {
                    buttonClass += "border-muted hover:border-primary hover:bg-primary/5 cursor-pointer";
                  }

                  return (
                    <button
                      key={index}
                      className={buttonClass}
                      onClick={() => !showResult && handleAnswerSelect(index)}
                      disabled={showResult}
                      data-testid={`button-answer-${index}`}
                    >
                      <span className="text-foreground">{option}</span>
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className={`p-6 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'}`}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <Lightbulb className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    )}
                    <div>
                      <h5 className={`font-semibold mb-1 ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-orange-800 dark:text-orange-200'}`}>
                        {isCorrect ? "Great job!" : "Good try!"}
                      </h5>
                      <p className={isCorrect ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}>
                        {module.quiz.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {showResult && (
                <div className="flex justify-center pt-4">
                  <Button onClick={onComplete} data-testid="button-complete-lesson">
                    {isCompleted ? "Review Complete" : "Complete Lesson"} <CheckCircle className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SpotTheScamGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const currentItem = spotTheScamItems[currentIndex];
  const isCorrect = selectedAnswer === currentItem.isScam;

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setAnswered(true);
    if (answer === currentItem.isScam) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < spotTheScamItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setGameComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setGameComplete(false);
  };

  if (gameComplete) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 border-2 border-purple-200 dark:border-purple-800 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Game Complete!</h3>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(score)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
            ))}
            {[...Array(spotTheScamItems.length - score)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-gray-300 dark:text-gray-600" />
            ))}
          </div>
          <p className="text-xl text-muted-foreground mb-4">
            You scored {score} out of {spotTheScamItems.length}
          </p>
          {score === spotTheScamItems.length ? (
            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white mb-4 shadow-md">Perfect Score! Scam Spotter Expert!</Badge>
          ) : score >= spotTheScamItems.length / 2 ? (
            <Badge className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white mb-4 shadow-md">Great Job! Keep Learning!</Badge>
          ) : (
            <Badge className="bg-gradient-to-r from-orange-400 to-amber-500 text-white mb-4 shadow-md">Good Try! Practice Makes Perfect!</Badge>
          )}
          <div className="pt-4">
            <Button onClick={resetGame} className="bg-gradient-to-r from-purple-500 to-pink-500" data-testid="button-play-again">
              <Sparkles className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-orange-200 dark:border-orange-800 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center shadow-md">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            Spot the Scam
          </CardTitle>
          <Badge className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white shadow-md">
            {currentIndex + 1} of {spotTheScamItems.length}
          </Badge>
        </div>
        <CardDescription>
          Read the scenario and decide if it is a scam or legitimate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-900">
          <p className="text-lg text-foreground">{currentItem.scenario}</p>
        </div>

        {!answered ? (
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="flex-1 max-w-40 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
              onClick={() => handleAnswer(true)}
              data-testid="button-scam"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Scam
            </Button>
            <Button 
              variant="outline"
              className="flex-1 max-w-40 border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/20"
              onClick={() => handleAnswer(false)}
              data-testid="button-safe"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Safe
            </Button>
          </div>
        ) : (
          <>
            <div className={`p-6 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <Lightbulb className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                )}
                <div>
                  <h5 className={`font-semibold mb-1 ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-orange-800 dark:text-orange-200'}`}>
                    {isCorrect ? "Correct!" : "Not quite!"}
                  </h5>
                  <p className={isCorrect ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}>
                    {currentItem.explanation}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button onClick={handleNext} data-testid="button-next-scenario">
                {currentIndex < spotTheScamItems.length - 1 ? "Next Scenario" : "See Results"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </>
        )}

        <div className="flex justify-center">
          <div className="flex gap-1">
            {spotTheScamItems.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex 
                    ? 'bg-primary' 
                    : index < currentIndex 
                      ? 'bg-green-500' 
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ParentSection() {
  const conversationStarters = [
    "What would you do if someone online asked for your password?",
    "Have you ever seen something online that made you uncomfortable?",
    "Do you know who to tell if someone is being mean to you online?",
    "What information is okay to share online and what should stay private?",
    "Have you ever gotten a message that seemed too good to be true?"
  ];

  return (
    <div id="parent-section" className="py-16 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="mb-6">
            <img
              src={kidsFamilyTogetherImg}
              alt="Diverse family learning about online safety together on a tablet"
              className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-2xl shadow-lg object-cover"
              loading="lazy"
              data-testid="img-parent-section-hero"
            />
          </div>
          <Badge className="mb-4">For Parents and Educators</Badge>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Partnering with You for Online Safety
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            This section is designed to be used together or independently. Here is everything you need to know about what your children will learn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                What Kids Will Learn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Ages 8 to 11 (Foundations)</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>Understanding personal information and privacy</li>
                  <li>Creating and managing strong passwords</li>
                  <li>Recognizing online tricks and scams</li>
                  <li>Basic device safety practices</li>
                  <li>When and how to ask trusted adults for help</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Ages 12 to 16 (Smart and Safe)</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>Safe social media practices and privacy settings</li>
                  <li>Understanding and responding to online bullying</li>
                  <li>Gaming safety and protecting online identity</li>
                  <li>Identifying phishing scams and fake messages</li>
                  <li>Building a positive digital footprint</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-green-500" />
                How to Use This Together
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">Sit together:</strong> Go through lessons as a team activity. This opens natural conversations about online experiences.
              </p>
              <p>
                <strong className="text-foreground">Play the games:</strong> The Spot the Scam game is designed for families. Take turns guessing and discuss why each answer is correct.
              </p>
              <p>
                <strong className="text-foreground">Celebrate progress:</strong> When your child completes a lesson, acknowledge their achievement. Building good habits deserves recognition.
              </p>
              <p>
                <strong className="text-foreground">Keep the dialogue open:</strong> Use the conversation starters below to continue discussions beyond the lessons.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-500" />
              Conversation Starters
            </CardTitle>
            <CardDescription>
              Use these questions to start meaningful discussions about online safety.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {conversationStarters.map((starter, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{index + 1}</span>
                  </div>
                  <p className="text-foreground">{starter}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="bg-gradient-to-r from-rose-400 via-red-400 to-orange-400 dark:from-rose-600 dark:via-red-600 dark:to-orange-600 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Heart className="w-5 h-5 text-white" />
              <span className="font-medium text-white">Your Safety Matters</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">Our Promise to You</h3>
            <p className="text-white/90 text-lg">We keep you safe while you learn and have fun.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <Shield className="w-10 h-10 text-teal-500 mx-auto mb-4" />
              <h4 className="font-semibold text-foreground mb-2">Child Privacy First</h4>
              <p className="text-sm text-muted-foreground">
                We do not collect any personal information from children. No accounts required, no profiles, no ads.
              </p>
            </Card>
            <Card className="text-center p-6">
              <Lock className="w-10 h-10 text-blue-500 mx-auto mb-4" />
              <h4 className="font-semibold text-foreground mb-2">No External Links</h4>
              <p className="text-sm text-muted-foreground">
                All learning happens on this page. Children are never directed to external websites.
              </p>
            </Card>
            <Card className="text-center p-6">
              <Heart className="w-10 h-10 text-pink-500 mx-auto mb-4" />
              <h4 className="font-semibold text-foreground mb-2">Child Safety First</h4>
              <p className="text-sm text-muted-foreground">
                Content is designed to empower, not frighten. We use positive, encouraging language throughout.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Kids() {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(null);
  const [activeModule, setActiveModule] = useState<ActiveModule>(null);
  const [completedModules8to11, setCompletedModules8to11] = useState<string[]>([]);
  const [completedModules12to16, setCompletedModules12to16] = useState<string[]>([]);

  const completedModules = selectedAge === "8-11" ? completedModules8to11 : completedModules12to16;
  const setCompletedModules = selectedAge === "8-11" ? setCompletedModules8to11 : setCompletedModules12to16;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.kids} />
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Kids Digital Safety Hub"
          subtitle="Fun, interactive lessons to help young people stay safe online. Choose your age group and start learning today."
          colorVariant="teal"
          imageSrc={kidsBannerImage}
          imageAlt="Children learning about internet safety on computers"
        />

        {selectedAge === null ? (
          <KidsLanding onSelectAge={setSelectedAge} />
        ) : (
          <LearningTrack 
            ageGroup={selectedAge}
            onBack={() => {
              setSelectedAge(null);
              setActiveModule(null);
            }}
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            completedModules={completedModules}
            setCompletedModules={setCompletedModules}
          />
        )}

        <div className="py-12 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="mb-6">
                <img
                  src={kidsSpotScamImg}
                  alt="Fun detective character examining suspicious messages"
                  className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-2xl shadow-lg object-cover"
                  loading="lazy"
                  data-testid="img-spot-scam-hero"
                />
              </div>
              <Badge className="mb-4 bg-orange-500">Interactive Game</Badge>
              <h2 className="text-3xl font-bold text-foreground mb-2">Spot the Scam Challenge</h2>
              <p className="text-muted-foreground">
                Test your scam-spotting skills with real-world scenarios. Can you tell what is safe and what is not?
              </p>
            </div>
            <SpotTheScamGame />
          </div>
        </div>

        <ParentSection />
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground py-4">
          <CalendarDays className="w-3 h-3" />
          <span>Content last reviewed: February 2026</span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
