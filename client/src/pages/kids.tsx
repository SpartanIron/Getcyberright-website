import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import kidsBannerImage from "@/assets/images/kids-safety-banner.jpg";
import {
  Shield, Lock, Eye, MessageCircle, Gamepad2, Users,
  CheckCircle, Star, Trophy, BookOpen, Heart,
  Smartphone, AlertCircle, ThumbsUp, ArrowRight,
  GraduationCap, Home, Lightbulb, Target, Sparkles,
  CalendarDays, ChevronDown, ChevronUp, Brain, Zap,
  DollarSign, Globe, Fingerprint
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

import { quizBanks, spotTheScamScenarios, storyScenarios, decisionTrees } from "@/components/kids-hub/quiz-data";
import { MultiQuiz, SpotTheScamGame, StoryActivity, PasswordStrengthBuilder, ProgressDashboard, WhatWouldYouDo } from "@/components/kids-hub/interactive-games";
import { CyberStatsInfographic, SafetyTipCarousel, PlatformSafetyGuide } from "@/components/kids-hub/infographics";
import { loadProgress, completeModule, saveQuizScore, completeActivity } from "@/components/kids-hub/progress";

function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-teal-300/15 dark:bg-teal-500/10" />
      <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-purple-300/15 dark:bg-purple-500/10" />
      <div className="absolute bottom-32 left-1/4 w-12 h-12 rounded-full bg-pink-300/15 dark:bg-pink-500/10" />
      <div className="absolute bottom-20 right-1/3 w-20 h-20 rounded-full bg-blue-300/15 dark:bg-blue-500/10" />
      <div className="absolute top-32 left-1/3 text-yellow-400/30 dark:text-yellow-500/15">
        <Star className="w-8 h-8 fill-current" />
      </div>
    </div>
  );
}

type AgeGroup = "6-10" | "11-13" | "14-16" | null;
type ActiveModule = string | null;
type ActiveTab = "lessons" | "activities" | "stats";

interface LessonTopic {
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
    platformGuides?: { platform: string; steps: string[] }[];
    checklist?: string[];
  };
}

const lessonTopics: Record<string, LessonTopic[]> = {
  "6-10": [
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
          "Your full name, address, and phone number are private. These are things only trusted adults need to know.",
          "Never share your school name, what team you play on, or where you hang out after school.",
          "Do not tell anyone your passwords, not even your best friend. Passwords are just for you and your parents.",
          "Photos can reveal where you are. Check the background of photos before sharing.",
          "Ask a trusted adult before filling out any online forms.",
          "Your birthday is personal information too. Do not share the full date online.",
          "Location features on apps can show people exactly where you are. Ask a parent to turn these off.",
          "If a website or game asks for your real name, use a nickname or ask your parent what to enter."
        ],
        remember: "Personal information is like a key to your life. Keep it safe and only share with people you trust in real life.",
        checklist: [
          "I know what personal information is and why it is private.",
          "I never share my full name, address, or school name online.",
          "I always ask a trusted adult before entering information on websites.",
          "I check photos for location clues before posting.",
          "I use nicknames instead of my real name online."
        ]
      }
    },
    {
      id: "password-power",
      title: "Password Power",
      description: "Create super-strong passwords to protect your accounts.",
      icon: Lock,
      color: "bg-green-600",
      image: kidsPasswordPowerImg,
      content: {
        intro: "Passwords are like secret codes that keep your accounts safe. A strong password is one that is hard for others to guess but easy for you to remember. Let us learn how to make super-strong passwords!",
        tips: [
          "Make passwords at least 8 characters long. Longer is better!",
          "Mix letters, numbers, and symbols to make it harder to guess.",
          "Try the three random words method: pick three random words and combine them, like Sun7Flower9Rain.",
          "Never use your name, birthday, or pet's name as a password.",
          "Use a different password for each account.",
          "Never share your password with friends. Only your parents should know.",
          "If you think someone knows your password, change it right away and tell a parent.",
          "Do not write passwords on sticky notes or in plain text files."
        ],
        remember: "A strong password is your first line of defense. Treat it like a secret that only you and your parents know.",
        platformGuides: [
          {
            platform: "Creating a Strong Password",
            steps: [
              "Think of three random words that are not related to each other.",
              "Combine them together: for example, Cloud, Tiger, and Lamp.",
              "Add a number somewhere: Cloud7TigerLamp.",
              "Check that it is at least 8 characters long.",
              "Make sure it does not include your name, birthday, or other personal info."
            ]
          }
        ],
        checklist: [
          "I use strong passwords with letters and numbers.",
          "I never share my passwords with friends.",
          "I use different passwords for different accounts.",
          "I know to change my password if someone might know it."
        ]
      }
    },
    {
      id: "online-tricks",
      title: "Spotting Online Tricks",
      description: "Recognize scams, tricks, and fake messages.",
      icon: AlertCircle,
      color: "bg-orange-600",
      image: kidsSpottingTricksImg,
      content: {
        intro: "Some people try to trick you online by offering fake prizes, sending scary messages, or pretending to be someone they are not. Learning to spot these tricks keeps you safe!",
        tips: [
          "If something seems too good to be true (like winning a free phone), it is probably a trick.",
          "Never click on links in messages from people you do not know.",
          "Fake virus warnings try to scare you. Close the tab without clicking anything.",
          "Real game companies never ask for your password through chat.",
          "Check website addresses carefully. Fake sites often have misspelled names.",
          "Pop-ups that say you won something are almost always tricks.",
          "If you click a strange link by accident, close it right away and tell an adult.",
          "Never go to outside websites to trade game items."
        ],
        remember: "Scammers use excitement and fear to trick you. Slow down, think, and ask a trusted adult if something seems wrong.",
        checklist: [
          "I know that prize pop-ups are tricks.",
          "I do not click links from strangers.",
          "I can spot fake website addresses.",
          "I tell an adult if I see something suspicious."
        ]
      }
    },
    {
      id: "device-safety",
      title: "Keeping Your Devices Safe",
      description: "Protect your tablet, phone, and computer.",
      icon: Smartphone,
      color: "bg-teal-600",
      image: kidsDeviceSafetyImg,
      content: {
        intro: "Your devices are like treasure chests full of your personal stuff. Keeping them safe means keeping you safe. Let us learn how to protect your tablet, phone, and computer!",
        tips: [
          "Always lock your device when you are done using it.",
          "Ask a parent before downloading any new apps.",
          "Updates fix security problems — ask a parent to help install them.",
          "Only download apps from official app stores.",
          "Check what permissions an app is asking for. A flashlight app should not need your contacts!",
          "Be careful on public Wi-Fi. Do not log into important accounts on it.",
          "If your device starts showing unexpected pop-ups, tell a parent right away.",
          "Verify files from friends before downloading them."
        ],
        remember: "Treat your devices like you would a diary. Lock them, protect them, and only let trusted people use them.",
        checklist: [
          "I lock my device when I am not using it.",
          "I ask a parent before downloading apps.",
          "I keep my device updated.",
          "I am careful about app permissions."
        ]
      }
    },
    {
      id: "trusted-adults",
      title: "Trusted Adults and Getting Help",
      description: "Know who to turn to and when to ask for help.",
      icon: Heart,
      color: "bg-pink-600",
      image: kidsTrustedAdultsImg,
      content: {
        intro: "Having trusted adults in your life is one of the best ways to stay safe online. These are people you can turn to when something online makes you feel scared, confused, or uncomfortable.",
        tips: [
          "A trusted adult can be a parent, teacher, school counselor, or another family member.",
          "You will never get in trouble for telling a trusted adult about something that happened online.",
          "If someone online asks you to keep a secret from your parents, that is a big warning sign.",
          "If you see something upsetting online, tell an adult right away.",
          "It is okay to write a note if speaking feels too hard.",
          "If your friend is being bullied online, help them tell an adult too.",
          "Trusted adults set screen time rules because they care about you.",
          "You can always come back to talk about something later if you need time to think."
        ],
        remember: "Trusted adults are your safety net. They want to help you, not punish you. You are never alone.",
        checklist: [
          "I know who my trusted adults are.",
          "I know I will not get in trouble for telling an adult about online problems.",
          "I know the warning signs of someone trying to keep secrets.",
          "I help my friends get help when they need it."
        ]
      }
    }
  ],
  "11-13": [
    {
      id: "social-media",
      title: "Social Media Safety",
      description: "Navigate social platforms safely and responsibly.",
      icon: Users,
      color: "bg-purple-600",
      image: kidsSocialMediaImg,
      content: {
        intro: "Social media can be great for connecting with friends and sharing your interests. But it also comes with risks if you are not careful about your privacy, the people you interact with, and the content you share.",
        tips: [
          "Set your accounts to private so only people you approve can see your content.",
          "Think before you post. Would you be comfortable if your teacher or grandparent saw this?",
          "Real giveaways never ask for your personal info through DMs.",
          "Do not post vacation photos in real time — wait until you are back home.",
          "Always get permission before sharing content that includes other people.",
          "Take breaks from social media if it starts affecting how you feel.",
          "Report harmful content and support friends who are targeted.",
          "Be suspicious of follow requests from people with new accounts and no mutual friends."
        ],
        remember: "Social media is a tool. Use it wisely to connect, create, and share — but always protect your privacy and wellbeing.",
        platformGuides: [
          { platform: "Instagram Safety", steps: ["Go to Settings > Privacy and set your account to Private", "Turn off Activity Status so people cannot see when you are online", "Review tagged photos in Settings > Privacy > Tags before they appear on your profile", "Block or restrict accounts that make you uncomfortable", "Report inappropriate content by tapping the three dots on any post"] },
          { platform: "TikTok Safety", steps: ["Go to Settings > Privacy and set your account to Private", "Turn off 'Suggest your account to others'", "Disable DMs from everyone or set to Friends Only", "Turn off 'Allow your videos to be downloaded'", "Set up Family Pairing with a parent for additional controls"] },
        ],
        checklist: [
          "My social media accounts are set to private.",
          "I think before I post and check for personal information.",
          "I do not share my location in real-time posts.",
          "I report harmful content when I see it."
        ]
      }
    },
    {
      id: "cyberbullying",
      title: "Dealing with Cyberbullying",
      description: "Recognize, respond to, and prevent online bullying.",
      icon: Shield,
      color: "bg-red-600",
      image: kidsCyberbullyingImg,
      content: {
        intro: "Cyberbullying is when someone uses technology to hurt, embarrass, or threaten another person. It can happen through texts, social media, gaming, or any online platform. Knowing how to handle it is an important skill.",
        tips: [
          "Cyberbullying includes spreading rumors, sharing embarrassing photos, sending mean messages, or excluding someone online.",
          "If you are being bullied, save evidence by taking screenshots.",
          "Do not respond to bullies — it often makes things worse.",
          "Report cyberbullying to the platform and tell a trusted adult.",
          "Forwarding mean content makes you part of the problem, even if you did not create it.",
          "Be an upstander, not a bystander. Support people who are being bullied.",
          "Think before you type. If you would not say it face-to-face, do not post it.",
          "Remember that people cannot always tell tone online — what seems like a joke might hurt someone."
        ],
        remember: "Everyone deserves to feel safe online. Being an upstander means using your voice to support others and stop harm.",
        checklist: [
          "I know what cyberbullying looks like.",
          "I know to save evidence and report bullying.",
          "I do not forward or share hurtful content.",
          "I support friends who are being bullied."
        ]
      }
    },
    {
      id: "gaming-safety",
      title: "Gaming Safety",
      description: "Stay safe while gaming online.",
      icon: Gamepad2,
      color: "bg-indigo-600",
      image: kidsGamingSmartImg,
      content: {
        intro: "Online gaming is fun, but it comes with risks like scam offers, predators, and spending traps. Learn how to enjoy gaming while staying safe.",
        tips: [
          "Only share your game name, never your real name or location.",
          "Never share your login for 'account boosting' — it is a scam to steal your account.",
          "All 'free V-Bucks/Robux generators' are scams. Only use official stores.",
          "Be cautious of older players who want to chat privately outside the game.",
          "Set a gaming budget with your parents and stick to it.",
          "Take breaks from gaming. Long sessions affect your health.",
          "Report players who use hateful language or harass others.",
          "If you stream, use a screen name and never share personal details."
        ],
        remember: "Gaming should be fun. Protect your accounts, your money, and your personal information while you play.",
        checklist: [
          "I only share my game name online.",
          "I never enter my login on outside websites.",
          "I have a gaming budget I stick to.",
          "I report toxic players and take breaks."
        ]
      }
    },
    {
      id: "phishing",
      title: "Spotting Fake Messages",
      description: "Identify phishing emails, texts, and DMs.",
      icon: AlertCircle,
      color: "bg-orange-600",
      image: kidsPhishingImg,
      content: {
        intro: "Phishing is when scammers send fake messages that look real to trick you into sharing passwords, personal information, or clicking dangerous links. These can come as emails, texts, or social media messages.",
        tips: [
          "Check the sender's email address carefully. Scammers use addresses like 'amaz0n.com' with a zero.",
          "Be suspicious of urgent messages saying your account will be deleted or closed.",
          "Never click links in unexpected messages. Go directly to the real website.",
          "Legitimate companies never ask for your password through messages.",
          "Watch out for job offers via messaging apps promising easy money.",
          "If a friend's account sends a suspicious link, verify with them through another channel.",
          "Fake virus pop-ups are designed to scare you into installing malware.",
          "Brand deals that ask for bank details through Instagram DMs are scams."
        ],
        remember: "When in doubt, do not click. Go directly to the official website or app, and ask a trusted adult if you are unsure.",
        platformGuides: [
          { platform: "Checking a Suspicious Email", steps: ["Look at the sender's full email address, not just the name", "Check for spelling mistakes in the address", "Look for pressure language like 'Act now!' or 'Your account will be deleted'", "Hover over links without clicking to see where they really go", "If unsure, go directly to the website by typing the address yourself"] },
          { platform: "Suspicious Message in an App", steps: ["Do not click any links from people you do not know", "Check the sender's profile for red flags (new account, no posts)", "Support teams never ask for passwords through messages", "Report and block the sender", "Tell a trusted adult about the message"] }
        ],
        checklist: [
          "I know how to check a sender's real email address.",
          "I do not click links in unexpected messages.",
          "I recognize urgency and pressure as red flags.",
          "I know to verify suspicious messages through another channel."
        ]
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
        intro: "Your digital footprint is the trail of information you leave behind online. Every post, comment, photo, and search adds to it. This footprint can be seen by friends, schools, and even future employers.",
        tips: [
          "Search your name on Google to see what others can find about you.",
          "Think about how posts might look to a future college or employer.",
          "Screenshots last forever — even deleted posts may have been saved.",
          "Be intentional about building a positive online presence.",
          "Review privacy settings on all platforms regularly.",
          "Remove tags from photos you do not want associated with you.",
          "Delete or deactivate old accounts you no longer use.",
          "Your likes, comments, and shares are all part of your footprint too."
        ],
        remember: "Your digital footprint is part of your personal brand. Make it something you are proud of.",
        platformGuides: [
          { platform: "Checking Your Footprint", steps: ["Open a private browser and search your full name", "Check Google Images for any indexed photos", "View your profiles from a logged-out browser", "Review your comment history on YouTube, TikTok, and Reddit"] },
          { platform: "Building a Good Reputation", steps: ["Share achievements, creative projects, and volunteer work", "Be thoughtful in every comment you make", "Keep personal posts private and positive posts public", "Review privacy settings monthly"] }
        ],
        checklist: [
          "I have searched my name and reviewed the results.",
          "I have cleaned up old posts I no longer want public.",
          "My privacy settings are up to date.",
          "I am building a positive digital footprint."
        ]
      }
    }
  ],
  "14-16": [
    {
      id: "advanced-privacy",
      title: "Advanced Privacy and Security",
      description: "Master privacy controls, encryption, and data protection.",
      icon: Fingerprint,
      color: "bg-indigo-700",
      image: kidsPersonalInfoImg,
      content: {
        intro: "As you use more apps and services, your digital privacy becomes increasingly important. Understanding how your data is collected, stored, and used empowers you to make informed decisions about your online presence.",
        tips: [
          "Review app permissions regularly. A calculator should not need your camera or contacts.",
          "Only accept necessary cookies — tracking cookies follow your activity across the web.",
          "Use messaging apps with end-to-end encryption for private conversations.",
          "Read privacy policies before signing up. Free VPNs that sell data defeat their purpose.",
          "Use a password manager to create and store unique passwords for every account.",
          "Enable two-factor authentication on every account that supports it.",
          "Check if your email has been in a data breach using HaveIBeenPwned.",
          "Be cautious with social logins — they share your profile data with third-party services."
        ],
        remember: "Privacy is a right, not a luxury. The more you understand about data collection, the better you can protect yourself.",
        platformGuides: [
          { platform: "Privacy Audit Checklist", steps: ["Review and revoke unnecessary app permissions on your phone", "Check which apps have access to your location, camera, and microphone", "Review connected apps in your Google/Apple account settings", "Clear browser cookies and review cookie settings for sites you visit", "Check HaveIBeenPwned.com to see if any of your accounts were in data breaches"] },
          { platform: "Setting Up 2FA", steps: ["Go to Security settings on your important accounts (email, social media, gaming)", "Look for 'Two-Factor Authentication' or 'Two-Step Verification'", "Choose an authenticator app (more secure) over SMS where possible", "Save backup codes in a safe place in case you lose your phone", "Test the 2FA by logging out and back in"] }
        ],
        checklist: [
          "I review app permissions regularly.",
          "I use two-factor authentication on important accounts.",
          "I use unique passwords for every account.",
          "I understand how cookies and tracking work."
        ]
      }
    },
    {
      id: "social-engineering",
      title: "Social Engineering Attacks",
      description: "Recognize manipulation tactics used by cybercriminals.",
      icon: Brain,
      color: "bg-red-700",
      image: kidsPhishingImg,
      content: {
        intro: "Social engineering is when attackers manipulate people instead of hacking computers. They use psychology — urgency, authority, fear, and trust — to trick you into revealing information or taking dangerous actions.",
        tips: [
          "Vishing (voice phishing) uses phone calls to create urgency and trick you.",
          "Never plug in unknown USB drives — they can contain malware.",
          "No legitimate administrator asks for credentials via email.",
          "Never share your Social Security Number before being officially hired.",
          "Free textbook sites requiring special software downloads often bundle malware.",
          "Online acquaintances asking for money is one of the most common scam patterns.",
          "Surveys asking for personal financial data beyond opinions are scams.",
          "If a friend sends a suspicious 'Is this you?' link, their account may be hacked."
        ],
        remember: "Social engineers exploit trust and emotions. Always verify independently before acting on any request for information or money.",
        checklist: [
          "I can identify social engineering tactics.",
          "I verify unexpected requests through official channels.",
          "I never provide sensitive info to incoming callers.",
          "I am cautious of emotional manipulation online."
        ]
      }
    },
    {
      id: "digital-wellness",
      title: "Digital Wellness",
      description: "Build a healthy relationship with technology.",
      icon: Heart,
      color: "bg-pink-700",
      image: kidsSocialMediaImg,
      content: {
        intro: "Technology is a powerful tool, but it can affect your mental health if not managed well. Building healthy digital habits helps you enjoy the benefits while avoiding the downsides.",
        tips: [
          "Set screen time limits and use app timers to manage usage.",
          "Create phone-free zones like your bedroom at night.",
          "If you feel anxious when away from your phone, that is a sign to take a break.",
          "Remember that social media shows curated, filtered versions of life — not reality.",
          "Unfollow accounts that consistently make you feel bad about yourself.",
          "It is okay to set boundaries and not be available online 24/7.",
          "Cyberstalking is serious — help friends report it and tell trusted adults.",
          "Build positive online communities through authenticity and kindness."
        ],
        remember: "Your mental health matters more than any notification. Technology should serve you, not control you.",
        checklist: [
          "I have screen time limits set up.",
          "I take regular breaks from screens.",
          "I curate my social media feed for positive content.",
          "I have phone-free times during my day."
        ]
      }
    },
    {
      id: "online-identity",
      title: "Online Identity and Reputation",
      description: "Build and protect your digital identity.",
      icon: Globe,
      color: "bg-blue-700",
      image: kidsDigitalFootprintImg,
      content: {
        intro: "Your online identity is more than your social media profile — it is how the digital world sees you. From deepfakes to data brokers, understanding threats to your identity helps you protect and build a positive presence.",
        tips: [
          "Deepfakes are AI-generated fake media. Report them immediately and preserve evidence.",
          "Build your personal brand around your work, not personal details.",
          "Viral content is permanent. What seems edgy now could hurt future opportunities.",
          "Request data removal from data broker sites that list your information.",
          "Age restrictions exist for safety — bypassing them removes legal protections for minors.",
          "Employers and schools regularly check social media profiles.",
          "Address privacy violations directly and involve trusted adults when needed.",
          "Share opinions respectfully and remember comments are permanent."
        ],
        remember: "Your online identity is your digital resume. Build it intentionally, protect it actively, and remember that everything online is permanent.",
        checklist: [
          "I can identify deepfake content.",
          "I know how to request data removal.",
          "I am building a positive professional presence.",
          "I think about long-term impact before posting."
        ]
      }
    },
    {
      id: "financial-safety",
      title: "Financial Safety Online",
      description: "Protect your money and avoid financial scams.",
      icon: DollarSign,
      color: "bg-green-700",
      image: kidsSpottingTricksImg,
      content: {
        intro: "As you start managing your own money — whether through allowance, part-time jobs, or gift cards — knowing how to protect it online becomes crucial. Financial scams increasingly target young people.",
        tips: [
          "Prices 90% lower than competitors are a red flag for scam stores.",
          "Enable biometric authentication and transaction alerts for mobile payments.",
          "Beware of 'accidental' payments that ask you to send money back — the original is reversed but yours stays gone.",
          "Legitimate age verification never requires payment card details.",
          "No investment is 'guaranteed.' Crypto scams targeting young people are extremely common.",
          "Never share gift card numbers and PINs — once shared, the funds can be stolen.",
          "Use platform payment systems for online marketplace transactions.",
          "Money flipping posts on social media are always scams."
        ],
        remember: "If someone promises guaranteed returns with urgency, it is a scam. Protect your financial information as carefully as your personal information.",
        checklist: [
          "I can spot financial scams online.",
          "I use secure payment methods.",
          "I know that 'guaranteed returns' means scam.",
          "I never share gift card codes or PINs."
        ]
      }
    },
    {
      id: "critical-thinking",
      title: "Critical Thinking Online",
      description: "Evaluate information, spot misinformation, and think critically.",
      icon: Zap,
      color: "bg-amber-700",
      image: kidsGamingSmartImg,
      content: {
        intro: "In the age of AI, deepfakes, and viral misinformation, critical thinking is your most powerful tool. Learning to evaluate information before believing or sharing it protects you and your community.",
        tips: [
          "Verify breaking news through at least 3 reputable sources before sharing.",
          "AI can generate convincing but incorrect information — always verify.",
          "Check petition creators and their data collection practices before signing.",
          "Health claims need support from medical professionals, not social media views.",
          "Seek multiple perspectives and consider publication biases.",
          "Unverifiable claims without citations should be treated skeptically.",
          "Use reverse image search to check if images are manipulated or out of context.",
          "Be extra cautious of information that perfectly confirms what you already believe."
        ],
        remember: "Critical thinking means questioning everything — including things you agree with. The truth can withstand scrutiny.",
        checklist: [
          "I verify information before sharing it.",
          "I check multiple sources for important claims.",
          "I know how to use reverse image search.",
          "I am aware of my own confirmation bias."
        ]
      }
    }
  ]
};

const ageGroupConfig = {
  "6-10": {
    title: "Foundations",
    subtitle: "Ages 6 to 10",
    description: "Start your internet safety journey with fun lessons about passwords, personal information, and staying safe online.",
    gradient: "from-teal-500 to-blue-500",
    bgGradient: "from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950/30 dark:via-cyan-950/30 dark:to-blue-950/30",
    borderColor: "border-teal-200 dark:border-teal-800",
    badgeColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
    image: kidsYoungLearnersImg,
    imageAlt: "Young children learning about internet safety together",
    icon: Star,
    badges: ["Beginner Friendly", "5 Lessons", "Fun Activities"],
  },
  "11-13": {
    title: "Smart and Safe Online",
    subtitle: "Ages 11 to 13",
    description: "Level up with lessons on social media, gaming safety, spotting scams, and building a positive digital reputation.",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    image: kidsTeenLearnersImg,
    imageAlt: "Preteens confidently using devices with security shields",
    icon: Trophy,
    badges: ["Intermediate", "5 Lessons", "Real Scenarios"],
  },
  "14-16": {
    title: "Cyber Champion",
    subtitle: "Ages 14 to 16",
    description: "Master advanced topics like social engineering, financial safety, AI deepfakes, and critical thinking online.",
    gradient: "from-indigo-600 to-violet-600",
    bgGradient: "from-indigo-50 via-violet-50 to-purple-50 dark:from-indigo-950/30 dark:via-violet-950/30 dark:to-purple-950/30",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
    image: kidsTeenLearnersImg,
    imageAlt: "Teenagers mastering advanced cybersecurity concepts",
    icon: Shield,
    badges: ["Advanced", "6 Lessons", "Expert Challenges"],
  },
};

function KidsLanding({ onSelectAge }: { onSelectAge: (age: AgeGroup) => void }) {
  return (
    <div className="relative">
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
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Learn to Stay Safe Online</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fun and easy lessons to help you become a smart and safe internet explorer. Choose your age group to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {(["6-10", "11-13", "14-16"] as const).map((age) => {
              const config = ageGroupConfig[age];
              const IconComp = config.icon;
              return (
                <Card
                  key={age}
                  className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 ${config.borderColor} bg-white/80 dark:bg-card/80 backdrop-blur-sm`}
                  onClick={() => onSelectAge(age)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelectAge(age))}
                  tabIndex={0}
                  role="button"
                  aria-label={`Start learning for ${config.subtitle}`}
                  data-testid={`card-age-${age}`}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={config.image} alt={config.imageAlt} className="w-full h-full object-cover" loading="lazy" data-testid={`img-age-${age}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
                          <IconComp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white drop-shadow-md">{config.subtitle}</h3>
                          <p className="text-white/80 text-xs font-medium">{config.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="text-center pt-4 pb-4">
                    <p className="text-muted-foreground mb-3 text-sm">{config.description}</p>
                    <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                      {config.badges.map((b) => (
                        <Badge key={b} className={`${config.badgeColor} text-xs`}>{b}</Badge>
                      ))}
                    </div>
                    <Button className={`w-full bg-gradient-to-r ${config.gradient} shadow-md`} data-testid={`button-start-${age}`}>
                      Start Learning <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
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
                  <h3 className="text-xl font-semibold text-foreground mb-2">For Parents and Educators</h3>
                  <p className="text-muted-foreground">Learn how this section works, what your kids will learn, and get conversation starters to discuss online safety together.</p>
                </div>
                <Button variant="outline" className="border-blue-300 dark:border-blue-700" onClick={() => document.getElementById("parent-section")?.scrollIntoView({ behavior: "smooth" })} data-testid="button-parent-info">
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
                <p className="text-sm text-teal-600 dark:text-teal-400">This section does not collect any personal information from children. No accounts required, no ads. Just safe learning.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollapsibleSteps({ steps, platform }: { steps: string[]; platform: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewCount = 3;
  const hasMore = steps.length > previewCount;

  return (
    <div>
      <ol className="space-y-3">
        {(isExpanded ? steps : steps.slice(0, previewCount)).map((step, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">{index + 1}</span>
            <span className="text-foreground leading-relaxed text-[0.95rem]">{step}</span>
          </li>
        ))}
      </ol>
      {hasMore && (
        <button onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-4 ml-9" data-testid={`button-toggle-steps-${platform.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}>
          {isExpanded ? <>Show less <ChevronUp className="w-4 h-4" /></> : <>Show all {steps.length} steps <ChevronDown className="w-4 h-4" /></>}
        </button>
      )}
    </div>
  );
}

function LearningTrack({
  ageGroup,
  onBack,
}: {
  ageGroup: NonNullable<AgeGroup>;
  onBack: () => void;
}) {
  const [activeModule, setActiveModule] = useState<ActiveModule>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("lessons");
  const [progress, setProgress] = useState(loadProgress());

  const config = ageGroupConfig[ageGroup];
  const topics = lessonTopics[ageGroup];
  const quizzes = quizBanks[ageGroup];
  const scamScenarios = spotTheScamScenarios[ageGroup];
  const stories = storyScenarios[ageGroup];
  const trees = decisionTrees[ageGroup] || [];
  const completedModules = progress.completedModules[ageGroup] || [];
  const quizScores = progress.quizScores[ageGroup] || {};
  const activitiesCompleted = progress.activitiesCompleted[ageGroup] || [];

  const handleModuleComplete = (moduleId: string) => {
    const updated = completeModule(ageGroup, moduleId);
    setProgress(updated);
    setActiveModule(null);
  };

  const handleQuizComplete = (moduleId: string, score: number, total: number) => {
    const pct = Math.round((score / total) * 100);
    const updated = saveQuizScore(ageGroup, moduleId, pct);
    if (pct >= 70) {
      const updated2 = completeModule(ageGroup, moduleId);
      setProgress(updated2);
    } else {
      setProgress(updated);
    }
  };

  const handleActivityComplete = (activityId: string) => {
    const updated = completeActivity(ageGroup, activityId);
    setProgress(updated);
  };

  if (activeModule) {
    const topic = topics.find((t) => t.id === activeModule);
    if (!topic) return null;
    const moduleQuizzes = quizzes?.[activeModule] || [];
    const isCompleted = completedModules.includes(activeModule);

    return (
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient}`} />
        <FloatingShapes />
        <div className="relative py-8">
          <div className="max-w-5xl mx-auto px-4">
            <ModuleContent
              topic={topic}
              quizQuestions={moduleQuizzes}
              isCompleted={isCompleted}
              onComplete={() => handleModuleComplete(activeModule)}
              onQuizComplete={(s, t) => handleQuizComplete(activeModule, s, t)}
              onBack={() => setActiveModule(null)}
              ageGroup={ageGroup}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient}`} />
      <FloatingShapes />
      <div className="relative py-8">
        <div className="max-w-5xl mx-auto px-4">
          <Button variant="ghost" onClick={onBack} className="mb-6" data-testid="button-back-to-ages">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Age Selection
          </Button>

          <ProgressDashboard
            ageGroup={ageGroup}
            completedModules={completedModules}
            totalModules={topics.length}
            quizScores={quizScores}
            activitiesCompleted={activitiesCompleted}
            totalStars={progress.totalStars}
          />

          <div className="mt-6 mb-6">
            <SafetyTipCarousel ageGroup={ageGroup} />
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)} className="mt-6">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="lessons" className="flex items-center gap-2" data-testid="tab-lessons">
                <BookOpen className="w-4 h-4" /> Lessons
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex items-center gap-2" data-testid="tab-activities">
                <Sparkles className="w-4 h-4" /> Activities
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2" data-testid="tab-stats">
                <Zap className="w-4 h-4" /> Facts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lessons">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map((topic) => {
                  const isCompleted = completedModules.includes(topic.id);
                  const score = quizScores[topic.id];
                  return (
                    <Card
                      key={topic.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${isCompleted ? "ring-2 ring-green-400/50" : ""}`}
                      onClick={() => setActiveModule(topic.id)}
                      data-testid={`card-module-${topic.id}`}
                    >
                      <div className="relative h-32 overflow-hidden rounded-t-lg">
                        <img src={topic.image} alt={topic.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {isCompleted && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white rounded-full px-2.5 py-1 shadow-md">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">Done</span>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-3">
                          <div className={`w-9 h-9 rounded-lg ${topic.color} flex items-center justify-center shadow-md`}>
                            <topic.icon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm text-foreground leading-tight">{topic.title}</h3>
                          {isCompleted && <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />}
                        </div>
                        <p className="text-muted-foreground text-xs mb-2">{topic.description}</p>
                        {score !== undefined && (
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs">Best: {score}%</Badge>
                        )}
                        {!isCompleted && !score && (
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs">Ready to start</Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {completedModules.length === topics.length && (
                <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Trophy className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Congratulations!</h3>
                    <p className="text-muted-foreground text-lg mb-4">
                      You have completed all the lessons in the {config.title} track. You are now a certified internet safety champion.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md">All Lessons Complete</Badge>
                      <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md">Safety Champion</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activities">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" /> Spot the Scam Challenge
                  </h3>
                  <div className="mb-4">
                    <img src={kidsSpotScamImg} alt="Fun detective character examining suspicious messages" className="w-24 h-24 mx-auto rounded-xl shadow-md object-cover" loading="lazy" data-testid="img-spot-scam" />
                  </div>
                  <SpotTheScamGame
                    scenarios={scamScenarios}
                    onComplete={(s, t) => {
                      handleActivityComplete("spot-the-scam");
                    }}
                  />
                </div>

                {stories && stories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-500" /> Story Scenarios
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Read each scenario and make a decision. See what happens based on your choice!</p>
                    <div className="space-y-6">
                      {stories.map((story) => (
                        <StoryActivity
                          key={story.id}
                          story={story}
                          onComplete={() => handleActivityComplete(story.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {trees.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-500" /> What Would You Do?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Navigate through real-life scenarios step by step. Your choices lead to different outcomes!</p>
                    <div className="space-y-6">
                      {trees.map((tree) => (
                        <WhatWouldYouDo
                          key={tree.id}
                          tree={tree}
                          onComplete={() => handleActivityComplete(tree.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {ageGroup === "6-10" && (
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-purple-500" /> Password Builder
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Practice creating strong passwords and see how they score!</p>
                    <PasswordStrengthBuilder />
                  </div>
                )}

                {(ageGroup === "11-13" || ageGroup === "14-16") && (
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-purple-500" /> Password Strength Tester
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Test how strong different password styles are. Remember: never type a real password!</p>
                    <PasswordStrengthBuilder />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="stats">
              <div className="space-y-8">
                <CyberStatsInfographic ageGroup={ageGroup} />
                <PlatformSafetyGuide ageGroup={ageGroup} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ModuleContent({
  topic,
  quizQuestions,
  isCompleted,
  onComplete,
  onQuizComplete,
  onBack,
  ageGroup,
}: {
  topic: LessonTopic;
  quizQuestions: import("@/components/kids-hub/quiz-data").QuizQuestion[];
  isCompleted: boolean;
  onComplete: () => void;
  onQuizComplete: (score: number, total: number) => void;
  onBack: () => void;
  ageGroup: string;
}) {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} data-testid="button-back-to-modules">
        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
        Back to Lessons
      </Button>

      <Card className="overflow-hidden">
        <div className="relative h-44 sm:h-52 overflow-hidden">
          <img src={topic.image} alt={topic.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${topic.color} flex items-center justify-center shadow-lg`}>
                <topic.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">{topic.title}</h3>
                <p className="text-white/80 text-sm">{topic.description}</p>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="space-y-6 pt-6">
          {!showQuiz ? (
            <>
              <div className="bg-muted/50 rounded-lg p-6">
                <p className="text-lg text-foreground leading-relaxed">{topic.content.intro}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Important Tips
                </h4>
                <ul className="space-y-3">
                  {topic.content.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {topic.content.platformGuides && topic.content.platformGuides.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Step-by-Step Guides
                  </h4>
                  <Tabs defaultValue={topic.content.platformGuides[0].platform} className="mb-2">
                    <TabsList className="flex flex-wrap h-auto gap-1.5 bg-muted/50 p-1.5 rounded-xl mb-4">
                      {topic.content.platformGuides.map((guide) => (
                        <TabsTrigger key={guide.platform} value={guide.platform} className="text-sm px-3 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm" data-testid={`tab-${guide.platform.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}>
                          {guide.platform}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {topic.content.platformGuides.map((guide) => (
                      <TabsContent key={guide.platform} value={guide.platform}>
                        <Card>
                          <CardContent className="p-5 sm:p-6">
                            <h5 className="font-bold text-base text-foreground mb-4">{guide.platform}</h5>
                            <CollapsibleSteps steps={guide.steps} platform={guide.platform} />
                          </CardContent>
                        </Card>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}

              {topic.content.checklist && topic.content.checklist.length > 0 && (
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Safety Checklist
                  </h4>
                  <ul className="space-y-3">
                    {topic.content.checklist.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded border-2 border-green-400 dark:border-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-green-700 dark:text-green-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Remember This
                </h4>
                <p className="text-blue-700 dark:text-blue-300">{topic.content.remember}</p>
              </div>

              <div className="flex justify-center pt-4">
                <Button onClick={() => setShowQuiz(true)} data-testid="button-take-quiz">
                  Take the Quiz ({quizQuestions.length} questions) <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <MultiQuiz
                questions={quizQuestions}
                title={`${topic.title} Quiz`}
                onComplete={(score, total) => {
                  onQuizComplete(score, total);
                }}
                ageGroup={ageGroup}
              />
              <div className="flex justify-center gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowQuiz(false)} data-testid="button-back-to-lesson">
                  Back to Lesson
                </Button>
                {isCompleted && (
                  <Button onClick={onComplete} data-testid="button-complete-lesson">
                    Review Complete <CheckCircle className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
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
            <img src={kidsFamilyTogetherImg} alt="Diverse family learning about online safety together on a tablet" className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-2xl shadow-lg object-cover" loading="lazy" data-testid="img-parent-section-hero" />
          </div>
          <Badge className="mb-4">For Parents and Educators</Badge>
          <h2 className="text-3xl font-bold text-foreground mb-4">Partnering with You for Online Safety</h2>
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
                <h4 className="font-semibold text-foreground mb-2">Ages 6 to 10 (Foundations)</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>Understanding personal information and privacy</li>
                  <li>Creating and managing strong passwords</li>
                  <li>Recognizing online tricks and scams</li>
                  <li>Basic device safety practices</li>
                  <li>When and how to ask trusted adults for help</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Ages 11 to 13 (Smart and Safe)</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>Safe social media practices and privacy settings</li>
                  <li>Understanding and responding to cyberbullying</li>
                  <li>Gaming safety and protecting online identity</li>
                  <li>Identifying phishing messages and scam tactics</li>
                  <li>Building a positive digital footprint</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Ages 14 to 16 (Cyber Champion)</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>Advanced privacy controls and encryption</li>
                  <li>Recognizing social engineering attacks</li>
                  <li>Digital wellness and healthy tech habits</li>
                  <li>Online identity and deepfake awareness</li>
                  <li>Financial safety and investment scam prevention</li>
                  <li>Critical thinking and misinformation detection</li>
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
              <p><strong className="text-foreground">Sit together:</strong> Go through lessons as a team activity. This opens natural conversations about online experiences.</p>
              <p><strong className="text-foreground">Play the games:</strong> The Spot the Scam game and Story Scenarios are designed for families. Take turns and discuss why each answer is correct.</p>
              <p><strong className="text-foreground">Test passwords together:</strong> Use the Password Builder to practice creating strong passwords as a family exercise.</p>
              <p><strong className="text-foreground">Celebrate progress:</strong> When your child completes a lesson or quiz, acknowledge their achievement. Building good habits deserves recognition.</p>
              <p><strong className="text-foreground">Keep the dialogue open:</strong> Use the conversation starters below to continue discussions beyond the lessons.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-500" />
              Conversation Starters
            </CardTitle>
            <CardDescription>Use these questions to start meaningful discussions about online safety.</CardDescription>
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

      <div className="relative overflow-hidden py-12">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${kidsFamilyTogetherImg})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-400/90 via-red-400/90 to-orange-400/90 dark:from-rose-600/90 dark:via-red-600/90 dark:to-orange-600/90" />
        <div className="relative z-10 max-w-5xl mx-auto px-4">
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
              <p className="text-sm text-muted-foreground">We do not collect any personal information from children. No accounts required, no profiles, no ads.</p>
            </Card>
            <Card className="text-center p-6">
              <Lock className="w-10 h-10 text-blue-500 mx-auto mb-4" />
              <h4 className="font-semibold text-foreground mb-2">No External Links</h4>
              <p className="text-sm text-muted-foreground">All learning happens on this page. Children are never directed to external websites.</p>
            </Card>
            <Card className="text-center p-6">
              <Heart className="w-10 h-10 text-pink-500 mx-auto mb-4" />
              <h4 className="font-semibold text-foreground mb-2">Child Safety First</h4>
              <p className="text-sm text-muted-foreground">Content is designed to empower, not frighten. We use positive, encouraging language throughout.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Kids() {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(null);

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
            onBack={() => setSelectedAge(null)}
          />
        )}

        <ParentSection />
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground py-4">
          <CalendarDays className="w-3 h-3" />
          <span>Content last reviewed: March 2026</span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
