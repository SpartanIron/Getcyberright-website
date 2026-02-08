import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  CheckCircle2, 
  Shield, 
  Lock, 
  Wifi, 
  Smartphone, 
  Users, 
  Eye, 
  AlertTriangle,
  Home,
  MessageSquare,
  CreditCard,
  Camera,
  ArrowRight,
  Star,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";

interface SafetyMilestone {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tasks: SafetyTask[];
  completed?: boolean;
}

interface SafetyTask {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  difficulty: "easy" | "medium" | "involved";
  forWho: string[];
  steps: string[];
  resources?: { label: string; url: string }[];
}

interface SafetyLevel {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  color: string;
  milestones: SafetyMilestone[];
  benefits: string[];
}

const safetyLevels: SafetyLevel[] = [
  {
    id: "beginner",
    title: "Foundation",
    subtitle: "Essential Protection",
    description: "Start here. These basics protect your family from the most common threats.",
    level: "beginner",
    color: "emerald",
    benefits: [
      "Block 80% of common scams and phishing attempts",
      "Secure your home network from intruders",
      "Protect family devices from malware",
      "Create a family communication plan for online safety"
    ],
    milestones: [
      {
        id: "passwords",
        title: "Password Security",
        description: "Strong, unique passwords are your first line of defense",
        icon: <Lock className="h-6 w-6" />,
        tasks: [
          {
            id: "p1",
            title: "Set up a family password manager",
            description: "Use a password manager like Bitwarden (free) or 1Password to generate and store strong passwords for everyone.",
            timeEstimate: "30 minutes",
            difficulty: "easy",
            forWho: ["Parents"],
            steps: [
              "Choose a password manager: Bitwarden (free) or 1Password ($4.99/month for families)",
              "Download the app on your phone and install the browser extension on your computer",
              "Create your master password: Make it long (12+ characters) and memorable, like a phrase",
              "Add your 5 most important accounts first: email, bank, social media",
              "Use the password generator to create new strong passwords for each account",
              "Set up family sharing so each family member has their own vault"
            ],
            resources: [
              { label: "Bitwarden (Free)", url: "https://bitwarden.com" },
              { label: "1Password Families", url: "https://1password.com/families" }
            ]
          },
          {
            id: "p2",
            title: "Update weak passwords",
            description: "Change passwords that are short, reused, or contain personal info like birthdays.",
            timeEstimate: "1 hour",
            difficulty: "easy",
            forWho: ["Everyone"],
            steps: [
              "Open your password manager and look for weak password alerts",
              "Start with your email account: this is the 'master key' to reset other accounts",
              "Update your banking and financial accounts next",
              "Change any password that contains your name, birthday, or pet's name",
              "Replace any password you use on multiple sites with unique ones",
              "For each account, use the password generator (aim for 16+ random characters)"
            ]
          },
          {
            id: "p3",
            title: "Enable two-factor authentication",
            description: "Turn on 2FA for email, banking, and social media accounts. Use an authenticator app instead of SMS when possible.",
            timeEstimate: "45 minutes",
            difficulty: "medium",
            forWho: ["Parents", "Teens"],
            steps: [
              "Download an authenticator app: Google Authenticator, Microsoft Authenticator, or Authy",
              "Start with your email: Go to Security Settings and find 'Two-Factor Authentication'",
              "Scan the QR code with your authenticator app",
              "Save the backup codes somewhere safe (print them or store in password manager)",
              "Repeat for banking apps, social media (Facebook, Instagram), and shopping sites (Amazon)",
              "When given a choice, pick 'Authenticator App' over 'Text Message' for better security"
            ],
            resources: [
              { label: "Google Authenticator", url: "https://google.com/authenticator" }
            ]
          }
        ]
      },
      {
        id: "network",
        title: "Home Network Security",
        description: "Secure your WiFi to protect all connected devices",
        icon: <Wifi className="h-6 w-6" />,
        tasks: [
          {
            id: "n1",
            title: "Change default router password",
            description: "Your router came with a default password that hackers know. Change it to something strong and unique.",
            timeEstimate: "15 minutes",
            difficulty: "easy",
            forWho: ["Parents"],
            steps: [
              "Find your router (the box your internet comes from) and look for a sticker with the default login info",
              "On any device connected to WiFi, open a browser and type 192.168.1.1 or 192.168.0.1",
              "Log in with the default username/password from the sticker (often 'admin/admin' or 'admin/password')",
              "Look for 'Administration' or 'System' settings",
              "Change the admin password to something strong and unique (not your WiFi password)",
              "Write it down and store it somewhere safe"
            ]
          },
          {
            id: "n2",
            title: "Update router firmware",
            description: "Log into your router settings and check for updates. This fixes security vulnerabilities.",
            timeEstimate: "20 minutes",
            difficulty: "medium",
            forWho: ["Parents"],
            steps: [
              "Log into your router (192.168.1.1 or 192.168.0.1 in your browser)",
              "Look for 'Firmware Update', 'Software Update', or 'System' in the menu",
              "Click 'Check for Updates' and install if available",
              "Wait for the update to complete (do not turn off the router during this time)",
              "Your internet may disconnect briefly; this is normal",
              "Set a reminder to check for updates every 3 months"
            ]
          },
          {
            id: "n3",
            title: "Create a guest network",
            description: "Set up a separate WiFi network for visitors. This keeps your main network more secure.",
            timeEstimate: "15 minutes",
            difficulty: "medium",
            forWho: ["Parents"],
            steps: [
              "Log into your router settings",
              "Look for 'Guest Network' or 'Guest WiFi' in the wireless settings",
              "Enable the guest network and give it a name like 'SmithFamily-Guest'",
              "Set a simple password you can share with visitors",
              "Make sure 'Access to local network' is disabled (keeps guests separate from your devices)",
              "Use this network for smart home devices like TVs and speakers too"
            ]
          }
        ]
      },
      {
        id: "devices",
        title: "Device Protection",
        description: "Keep phones, tablets, and computers secure",
        icon: <Smartphone className="h-6 w-6" />,
        tasks: [
          {
            id: "d1",
            title: "Enable automatic updates",
            description: "Turn on auto-updates for all devices. Updates fix security holes that hackers exploit.",
            timeEstimate: "20 minutes",
            difficulty: "easy",
            forWho: ["Parents"],
            steps: [
              "On iPhone: Settings → General → Software Update → Automatic Updates → Turn on",
              "On Android: Settings → System → Software Update → Auto-download",
              "On Windows: Settings → Windows Update → Turn on automatic updates",
              "On Mac: System Preferences → Software Update → Check 'Automatically keep my Mac up to date'",
              "Check each family member's device and enable auto-updates",
              "Apps update separately: Enable auto-updates in the App Store/Play Store settings"
            ]
          },
          {
            id: "d2",
            title: "Set up device locks",
            description: "Enable PIN, fingerprint, or face unlock on all family devices.",
            timeEstimate: "15 minutes",
            difficulty: "easy",
            forWho: ["Everyone"],
            steps: [
              "On phones: Go to Settings → Security or Face ID & Passcode",
              "Choose a 6-digit PIN minimum (not birthdays or simple patterns like 123456)",
              "Add fingerprint or face unlock for convenience",
              "Set 'auto-lock' to 1-2 minutes so the device locks when not in use",
              "For computers, set up a password-protected screensaver",
              "Teach kids why locking devices matters: it keeps their stuff private"
            ]
          },
          {
            id: "d3",
            title: "Install security software",
            description: "Ensure all computers have antivirus protection. Windows Defender is free and effective.",
            timeEstimate: "30 minutes",
            difficulty: "easy",
            forWho: ["Parents"],
            steps: [
              "Windows 10/11: You already have Windows Defender built in; make sure it's enabled",
              "Check: Settings → Privacy & Security → Windows Security → Virus & threat protection",
              "Make sure 'Real-time protection' is turned on",
              "Mac users: Consider installing Malwarebytes (free version is fine)",
              "Avoid installing multiple antivirus programs; they can conflict",
              "Run a full scan now to make sure your computer is clean"
            ],
            resources: [
              { label: "Malwarebytes Free", url: "https://malwarebytes.com" }
            ]
          }
        ]
      },
      {
        id: "communication",
        title: "Family Safety Plan",
        description: "Establish open communication about online safety",
        icon: <MessageSquare className="h-6 w-6" />,
        tasks: [
          {
            id: "c1",
            title: "Create a family code word",
            description: "Agree on a secret word that only family members know. Use it to verify identity if someone claims to be family.",
            timeEstimate: "10 minutes",
            difficulty: "easy",
            forWho: ["Everyone"],
            steps: [
              "Gather the family and explain: scammers sometimes pretend to be relatives in emergencies",
              "Choose a word that's easy to remember but hard to guess (not pet names or birthdays)",
              "Examples: 'BlueberryPancakes', 'MountainSunrise', or an inside joke",
              "Practice using it: 'If I ever call asking for money, I'll say our code word first'",
              "Teach grandparents too: they're often targeted by 'grandchild in trouble' scams",
              "Change the word if you think it's been compromised"
            ]
          },
          {
            id: "c2",
            title: "Establish the 'pause and ask' rule",
            description: "Make a family rule: before clicking links, sending money, or sharing info, pause and ask another family member.",
            timeEstimate: "15 minutes",
            difficulty: "easy",
            forWho: ["Everyone"],
            steps: [
              "Explain the rule: 'Before you click, send, or share, ask someone else first'",
              "This applies to: unexpected emails, prize notifications, urgent requests for money",
              "Practice scenarios: 'You get an email saying you won a prize. What do you do?'",
              "Make it judgment-free: the goal is catching scams, not criticizing each other",
              "Create a family group chat specifically for asking 'Is this legit?'",
              "Celebrate when someone catches a scam by pausing to ask"
            ]
          },
          {
            id: "c3",
            title: "Discuss common scams together",
            description: "Share examples of scams targeting your family's age groups. Make it a regular conversation, not a lecture.",
            timeEstimate: "30 minutes",
            difficulty: "easy",
            forWho: ["Everyone"],
            steps: [
              "Set aside 15-30 minutes during a family meal or gathering",
              "Share a recent scam you've heard about: 'Did you see the one where...'",
              "Ask kids about scams they've encountered in games or on social media",
              "Discuss what made it suspicious: urgency, asking for personal info, too good to be true",
              "Make it a monthly habit: 'Scam of the Month' discussion",
              "Use our Scam Checker tool to analyze suspicious messages together"
            ],
            resources: [
              { label: "GetCyberRight Scam Checker", url: "/scam-checker" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "intermediate",
    title: "Strengthened",
    subtitle: "Enhanced Protection",
    description: "Build on the basics with stronger privacy controls and monitoring.",
    level: "intermediate",
    color: "blue",
    benefits: [
      "Reduce your family's digital footprint and data exposure",
      "Protect children from inappropriate content and predators",
      "Secure financial accounts against fraud",
      "Detect and respond to security incidents quickly"
    ],
    milestones: [
      {
        id: "privacy",
        title: "Privacy Controls",
        description: "Minimize the data you share online",
        icon: <Eye className="h-6 w-6" />,
        tasks: [
          {
            id: "pr1",
            title: "Audit social media privacy settings",
            description: "Review privacy settings on Facebook, Instagram, TikTok, etc. Set profiles to private, limit who can message you.",
            timeEstimate: "45 minutes",
            difficulty: "medium",
            forWho: ["Everyone"],
            steps: [
              "Facebook: Settings → Privacy → Set 'Who can see your posts' to Friends only",
              "Instagram: Settings → Privacy → Set account to Private",
              "TikTok: Settings → Privacy → Turn on Private Account",
              "Limit who can send you messages and friend requests",
              "Review and remove old posts with personal info (check-ins, vacation photos)",
              "Disable location tagging on photos"
            ]
          },
          {
            id: "pr2",
            title: "Review app permissions",
            description: "Check which apps have access to your camera, microphone, location, and contacts. Remove unnecessary permissions.",
            timeEstimate: "30 minutes",
            difficulty: "easy",
            forWho: ["Everyone"],
            steps: [
              "iPhone: Settings → Privacy & Security → Review each category",
              "Android: Settings → Apps → App permissions",
              "Remove location access from apps that don't need it (games, flashlight apps)",
              "Set location to 'Only while using' instead of 'Always' for maps and weather",
              "Revoke microphone and camera access from apps that don't need them",
              "Delete apps you haven't used in 6 months"
            ]
          },
          {
            id: "pr3",
            title: "Opt out of data brokers",
            description: "Request removal from people-search sites that publish your personal info. Services like DeleteMe can help automate this.",
            timeEstimate: "2 hours",
            difficulty: "involved",
            forWho: ["Parents"],
            steps: [
              "Search your name on Google to see what's publicly available",
              "Visit major data broker sites: Spokeo, WhitePages, BeenVerified, Intelius",
              "Look for 'Opt Out' or 'Remove My Info' links on each site",
              "Follow their removal process (usually requires email verification)",
              "Consider DeleteMe ($129/year) to automate ongoing removal",
              "Repeat every 6 months as your info gets re-added"
            ],
            resources: [
              { label: "DeleteMe", url: "https://joindeleteme.com" }
            ]
          }
        ]
      },
      {
        id: "parental",
        title: "Parental Controls",
        description: "Age-appropriate protections for children",
        icon: <Users className="h-6 w-6" />,
        tasks: [
          {
            id: "pc1",
            title: "Set up content filtering",
            description: "Enable SafeSearch on Google, restricted mode on YouTube, and age-appropriate content filters on streaming services.",
            timeEstimate: "30 minutes",
            difficulty: "easy",
            forWho: ["Parents"],
            steps: [
              "Google: Go to google.com/safesearch and turn on SafeSearch",
              "YouTube: Settings → General → Restricted Mode → On",
              "Netflix: Profile → Account → Profile & Parental Controls → Set maturity rating",
              "Disney+, Amazon Prime: Set up a Kids profile with appropriate content limits",
              "For younger kids, use YouTube Kids instead of regular YouTube",
              "Lock these settings with a PIN so kids can't change them"
            ]
          },
          {
            id: "pc2",
            title: "Configure screen time limits",
            description: "Use built-in screen time features on iOS/Android to set daily limits and downtime schedules.",
            timeEstimate: "20 minutes",
            difficulty: "easy",
            forWho: ["Parents"],
            steps: [
              "iPhone: Settings → Screen Time → Turn on → Set as Parent",
              "Android: Settings → Digital Wellbeing → Parental Controls",
              "Set daily app limits (e.g., 2 hours for games, 1 hour for social media)",
              "Schedule Downtime for bedtime (no apps except phone calls)",
              "Add content restrictions based on age",
              "Use Family Sharing (Apple) or Family Link (Google) to manage from your phone"
            ]
          },
          {
            id: "pc3",
            title: "Review kids' friend lists and followers",
            description: "Regularly check who your children are connected with online. Look for unknown adults or suspicious accounts.",
            timeEstimate: "Ongoing",
            difficulty: "easy",
            forWho: ["Parents"],
            steps: [
              "Ask your child to show you their followers and friends list",
              "Look for accounts with no profile picture or few posts (could be fake)",
              "Watch for adult strangers following a minor's account",
              "Check direct messages periodically (with your child present)",
              "Have a rule: only accept friend requests from people you know in real life",
              "Make this a monthly habit, not a one-time check"
            ]
          }
        ]
      },
      {
        id: "financial",
        title: "Financial Security",
        description: "Protect your money and credit",
        icon: <CreditCard className="h-6 w-6" />,
        tasks: [
          {
            id: "f1",
            title: "Enable transaction alerts",
            description: "Set up instant notifications for all credit card and bank account transactions.",
            timeEstimate: "20 minutes",
            difficulty: "easy",
            forWho: ["Parents"],
            steps: [
              "Log into your bank's website or app",
              "Go to Alerts or Notifications settings",
              "Enable notifications for all transactions (not just large ones)",
              "Choose push notifications for instant alerts",
              "Set up alerts for credit cards, checking, and savings accounts",
              "Test by making a small purchase and checking if you get notified"
            ]
          },
          {
            id: "f2",
            title: "Freeze credit for the family",
            description: "Place credit freezes with all three bureaus (Equifax, Experian, TransUnion) for adults and children to prevent identity theft.",
            timeEstimate: "1 hour",
            difficulty: "medium",
            forWho: ["Parents"],
            steps: [
              "Visit Equifax.com/personal/credit-report-services/credit-freeze",
              "Visit Experian.com/freeze",
              "Visit TransUnion.com/credit-freeze",
              "Create accounts at each bureau and request a freeze (it's free)",
              "Save your PINs securely (you'll need them to unfreeze)",
              "For children: Send proof of guardianship and child's info to each bureau"
            ],
            resources: [
              { label: "Equifax Freeze", url: "https://equifax.com/personal/credit-report-services/credit-freeze" },
              { label: "Experian Freeze", url: "https://experian.com/freeze" },
              { label: "TransUnion Freeze", url: "https://transunion.com/credit-freeze" }
            ]
          },
          {
            id: "f3",
            title: "Set up account recovery",
            description: "Ensure you can recover important accounts if locked out. Add backup email, phone, and trusted contacts.",
            timeEstimate: "30 minutes",
            difficulty: "medium",
            forWho: ["Parents", "Teens"],
            steps: [
              "Start with your email (Gmail, Outlook, etc.) since it's used to reset other accounts",
              "Add a backup phone number and backup email address",
              "Set up recovery contacts (Apple) or trusted contacts (Google)",
              "Print or save backup codes for 2FA in a safe place",
              "Test recovery: Can you log in if you lose your phone?",
              "Share recovery info with your spouse for emergencies"
            ]
          }
        ]
      },
      {
        id: "awareness",
        title: "Threat Awareness",
        description: "Stay informed about current scams",
        icon: <AlertTriangle className="h-6 w-6" />,
        tasks: [
          {
            id: "a1",
            title: "Subscribe to scam alerts",
            description: "Sign up for alerts from FTC, local police, and GetCyberRight to stay informed about new scams in your area.",
            timeEstimate: "10 minutes",
            difficulty: "easy",
            forWho: ["Parents"],
            steps: [
              "Subscribe to GetCyberRight Weekly Digest for curated safety tips",
              "Sign up for FTC Consumer Alerts at consumer.ftc.gov/features/scam-alerts",
              "Follow your local police department's social media for local scam warnings",
              "Set up Google Alerts for 'scam' + your city name",
              "Join local Facebook groups or Nextdoor for community scam reports",
              "Share relevant alerts with family members when you see them"
            ],
            resources: [
              { label: "Subscribe to Weekly Digest", url: "/newsletter" },
              { label: "FTC Scam Alerts", url: "https://consumer.ftc.gov/features/scam-alerts" }
            ]
          },
          {
            id: "a2",
            title: "Practice identifying phishing",
            description: "Take our phishing quiz together as a family. Learn to spot fake emails, texts, and websites.",
            timeEstimate: "30 minutes",
            difficulty: "easy",
            forWho: ["Everyone"],
            steps: [
              "Gather the family for a 'spot the scam' session",
              "Look at examples: hover over links without clicking, check sender addresses",
              "Key red flags: urgency, threats, too good to be true, asking for personal info",
              "Check the sender's email domain (not just the display name)",
              "Look for spelling errors and generic greetings like 'Dear Customer'",
              "Practice on real suspicious emails your family has received"
            ]
          },
          {
            id: "a3",
            title: "Know your family's vulnerabilities",
            description: "Discuss which scams might target each family member based on age, interests, and online activities.",
            timeEstimate: "30 minutes",
            difficulty: "easy",
            forWho: ["Everyone"],
            steps: [
              "Teens: Watch for gaming scams, fake influencer deals, romance scams",
              "Parents: Watch for job scams, fake tech support, investment fraud",
              "Seniors: Watch for grandparent scams, Medicare fraud, lottery scams",
              "Travelers: Watch for fake booking sites, WiFi attacks, vacation rental scams",
              "Discuss what each person would do if they encountered these",
              "Create a family plan: 'If in doubt, call another family member'"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "advanced",
    title: "Fortified",
    subtitle: "Maximum Protection",
    description: "Advanced measures for families who want comprehensive security.",
    level: "advanced",
    color: "purple",
    benefits: [
      "Enterprise-level protection for your home network",
      "Encrypted communications for sensitive family matters",
      "Prepared response plan for any security incident",
      "Protected digital legacy and account succession"
    ],
    milestones: [
      {
        id: "advanced-network",
        title: "Advanced Network Security",
        description: "Enterprise-grade home protection",
        icon: <Home className="h-6 w-6" />,
        tasks: [
          {
            id: "an1",
            title: "Set up DNS filtering",
            description: "Use services like NextDNS or Cloudflare Family to block malicious sites at the network level.",
            timeEstimate: "30 minutes",
            difficulty: "medium",
            forWho: ["Parents"],
            steps: [
              "Choose a DNS provider: Cloudflare Family (free) or NextDNS (free tier available)",
              "For Cloudflare: Change your router's DNS to 1.1.1.3 (blocks malware and adult content)",
              "For NextDNS: Create account, customize filters, get your custom DNS addresses",
              "Log into your router and find DNS settings (usually under Internet or WAN)",
              "Replace the existing DNS with your chosen provider",
              "Test by visiting a known-blocked site to confirm it's working"
            ],
            resources: [
              { label: "Cloudflare for Families", url: "https://cloudflare.com/family" },
              { label: "NextDNS", url: "https://nextdns.io" }
            ]
          },
          {
            id: "an2",
            title: "Segment your network",
            description: "Create separate network segments for IoT devices (smart TVs, cameras) to isolate them from computers.",
            timeEstimate: "1 hour",
            difficulty: "involved",
            forWho: ["Parents"],
            steps: [
              "Use your guest network for IoT devices (smart TVs, speakers, cameras)",
              "Keep computers and phones on your main network",
              "For advanced setup: Some routers support VLANs for true separation",
              "Consider a separate router for IoT if your current one doesn't support VLANs",
              "Rename networks clearly: 'SmithFamily-Main' and 'SmithFamily-IoT'",
              "This prevents a hacked smart device from accessing your personal data"
            ]
          },
          {
            id: "an3",
            title: "Consider a VPN for the family",
            description: "Protect family internet traffic, especially on public WiFi. Look for family plans with multiple device support.",
            timeEstimate: "30 minutes",
            difficulty: "medium",
            forWho: ["Parents"],
            steps: [
              "Choose a reputable VPN: NordVPN, ExpressVPN, or Mullvad are trusted options",
              "Look for family plans with 5-10 device connections",
              "Install the VPN app on all family phones and laptops",
              "Enable auto-connect for public WiFi networks",
              "Teach family: Turn on VPN before using hotel, coffee shop, or airport WiFi",
              "Check that speed is acceptable for streaming and video calls"
            ],
            resources: [
              { label: "Mullvad VPN", url: "https://mullvad.net" }
            ]
          }
        ]
      },
      {
        id: "encrypted",
        title: "Encrypted Communications",
        description: "Private messaging for sensitive family matters",
        icon: <Lock className="h-6 w-6" />,
        tasks: [
          {
            id: "e1",
            title: "Set up Signal for family chat",
            description: "Install Signal for end-to-end encrypted messaging. Create a family group for private conversations.",
            timeEstimate: "20 minutes",
            difficulty: "easy",
            forWho: ["Everyone"],
            steps: [
              "Download Signal from the App Store or Play Store",
              "Register with your phone number",
              "Find family members in Signal (they need to install it too)",
              "Create a group chat: tap New Group → add family members",
              "Enable disappearing messages for extra privacy (optional)",
              "Use Signal for any sensitive conversations: finances, medical, personal"
            ],
            resources: [
              { label: "Signal", url: "https://signal.org" }
            ]
          },
          {
            id: "e2",
            title: "Secure email for sensitive matters",
            description: "Consider ProtonMail for emails containing financial or medical information.",
            timeEstimate: "30 minutes",
            difficulty: "medium",
            forWho: ["Parents"],
            steps: [
              "Create a free ProtonMail account at proton.me",
              "Use this email specifically for sensitive communications",
              "Share your ProtonMail address with your doctor, lawyer, accountant",
              "Enable two-factor authentication on the account",
              "ProtonMail to ProtonMail emails are automatically encrypted",
              "For others, you can send password-protected encrypted emails"
            ],
            resources: [
              { label: "ProtonMail", url: "https://proton.me" }
            ]
          },
          {
            id: "e3",
            title: "Encrypt device storage",
            description: "Enable full-disk encryption on computers. iPhones are encrypted by default; Android may need manual setup.",
            timeEstimate: "1 hour",
            difficulty: "involved",
            forWho: ["Parents", "Teens"],
            steps: [
              "iPhones: Already encrypted when you set a passcode; nothing to do",
              "Android: Settings → Security → Encrypt phone (may take 1+ hour)",
              "Windows: Search for 'BitLocker' → Turn on BitLocker for your main drive",
              "Mac: System Preferences → Security & Privacy → FileVault → Turn On",
              "Save your recovery key somewhere safe (not on the encrypted device)",
              "This protects your data if your laptop is lost or stolen"
            ]
          }
        ]
      },
      {
        id: "incident",
        title: "Incident Response",
        description: "Know what to do if something goes wrong",
        icon: <AlertTriangle className="h-6 w-6" />,
        tasks: [
          {
            id: "i1",
            title: "Create an emergency contact list",
            description: "Document phone numbers for banks, credit bureaus, and local police cyber units. Keep printed copies.",
            timeEstimate: "30 minutes",
            difficulty: "easy",
            forWho: ["Parents"],
            steps: [
              "List all bank and credit card fraud phone numbers (on the back of cards)",
              "Add credit bureaus: Equifax (888-766-0008), Experian (888-397-3742), TransUnion (800-680-7289)",
              "Find your local police non-emergency number and FBI IC3 (ic3.gov)",
              "Add FTC identity theft hotline: 1-877-438-4338",
              "Include your insurance agent and lawyer if applicable",
              "Print and post near the home phone; save in everyone's contacts"
            ]
          },
          {
            id: "i2",
            title: "Document important accounts",
            description: "Create a secure list of family accounts. Store in your password manager with recovery information.",
            timeEstimate: "1 hour",
            difficulty: "medium",
            forWho: ["Parents"],
            steps: [
              "Create a secure note in your password manager titled 'Family Accounts'",
              "List all critical accounts: email, bank, utilities, insurance, subscriptions",
              "For each account, note: login email, recovery options, 2FA method",
              "Include utility account numbers and customer service numbers",
              "List monthly subscriptions and how to cancel them",
              "Share access to this note with your spouse"
            ]
          },
          {
            id: "i3",
            title: "Practice your response",
            description: "Walk through scenarios: 'What if Grandma gets a scam call?' 'What if your account gets hacked?'",
            timeEstimate: "30 minutes",
            difficulty: "easy",
            forWho: ["Everyone"],
            steps: [
              "Scenario 1: Email account hacked → Change password, enable 2FA, check sent folder, alert contacts",
              "Scenario 2: Credit card fraud → Call bank immediately, freeze card, check other accounts",
              "Scenario 3: Grandparent scam call → Hang up, call family member directly, report to police",
              "Scenario 4: Ransomware → Disconnect from network, don't pay, restore from backup",
              "Write down the key steps for each scenario",
              "Post these by the computer or share in family group chat"
            ]
          }
        ]
      },
      {
        id: "legacy",
        title: "Digital Legacy",
        description: "Plan for account succession and emergencies",
        icon: <Award className="h-6 w-6" />,
        tasks: [
          {
            id: "l1",
            title: "Set up legacy contacts",
            description: "Apple, Google, and Facebook allow you to designate someone to access your account if something happens.",
            timeEstimate: "30 minutes",
            difficulty: "medium",
            forWho: ["Parents"],
            steps: [
              "Apple: Settings → Your Name → Password & Security → Legacy Contact",
              "Google: myaccount.google.com → Data & privacy → Inactive Account Manager",
              "Facebook: Settings → Memorialization Settings → Legacy Contact",
              "Choose a trusted family member who would need access to your digital life",
              "Give them the access key Apple generates (for Apple devices)",
              "Consider: Do you want your accounts deleted or memorialized?"
            ]
          },
          {
            id: "l2",
            title: "Document digital assets",
            description: "Create a list of online accounts, subscriptions, and digital assets. Store securely with your will.",
            timeEstimate: "2 hours",
            difficulty: "involved",
            forWho: ["Parents"],
            steps: [
              "List all online accounts: email, social, banking, shopping, subscriptions",
              "Note which accounts have monetary value: cryptocurrency, domains, digital purchases",
              "Document monthly subscriptions that should be cancelled",
              "Include login information or note that it's in the password manager",
              "Store a printed copy with your will or estate documents",
              "Review and update annually"
            ]
          },
          {
            id: "l3",
            title: "Share password manager access",
            description: "Ensure your spouse or trusted family member can access the password manager in an emergency.",
            timeEstimate: "20 minutes",
            difficulty: "easy",
            forWho: ["Parents"],
            steps: [
              "Use your password manager's Emergency Access feature if available",
              "1Password: Create an Emergency Kit and share with trusted person",
              "Bitwarden: Settings → Emergency Access → Add trusted contact",
              "Alternative: Store the master password in a sealed envelope with your will",
              "Explain to your emergency contact how to use it",
              "Test that they can access it in an emergency"
            ]
          }
        ]
      }
    ]
  }
];

const difficultyColors = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  involved: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
};

const difficultyLabels = {
  easy: "Quick & Easy",
  medium: "Moderate",
  involved: "Takes Time"
};

export default function FamilySafetyRoadmap() {
  useSEO({
    title: "Family Safety Roadmap | GetCyberRight",
    description: "A step-by-step guide to protect your family online. From password basics to advanced security, follow our roadmap to build comprehensive digital protection.",
    keywords: "family safety, online protection, cybersecurity guide, digital safety, family security, internet safety steps"
  });

  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  
  // Get first milestone ID for each level
  const getFirstMilestone = (levelId: string) => {
    const level = safetyLevels.find(l => l.id === levelId);
    return level?.milestones[0]?.id || "";
  };
  
  const [expandedMilestones, setExpandedMilestones] = useState<string[]>([getFirstMilestone("beginner")]);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  
  const handleLevelChange = (levelId: string) => {
    setSelectedLevel(levelId);
    setExpandedMilestones([getFirstMilestone(levelId)]);
    setExpandedTask(null);
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTask(prev => prev === taskId ? null : taskId);
  };

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const currentLevel = safetyLevels.find(l => l.id === selectedLevel) || safetyLevels[0];
  const totalTasks = currentLevel.milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedCount = currentLevel.milestones.reduce(
    (acc, m) => acc + m.tasks.filter(t => completedTasks.has(t.id)).length, 
    0
  );
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Link to="/resources">
              <Button variant="ghost" className="mb-4">
                ← Back to Resources
              </Button>
            </Link>
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full mb-4">
              <Shield className="h-5 w-5" />
              <span className="font-medium">Family Safety Roadmap</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Protect Your Family Online
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A step-by-step guide to building your family's digital defenses. 
              Start with the essentials and progress at your own pace.
            </p>
          </div>

          <Tabs value={selectedLevel} onValueChange={handleLevelChange} className="mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto">
              {safetyLevels.map((level) => (
                <TabsTrigger 
                  key={level.id} 
                  value={level.id}
                  className="flex flex-col py-3"
                >
                  <span className="font-semibold">{level.title}</span>
                  <span className="text-xs opacity-70">{level.subtitle}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {safetyLevels.map((level) => (
              <TabsContent key={level.id} value={level.id} className="mt-8">
                <Card className="mb-8 border-2 border-teal-200 dark:border-teal-800">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                          {level.title}: {level.subtitle}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">{level.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                            {progressPercent}%
                          </div>
                          <div className="text-sm text-slate-500">
                            {completedCount}/{totalTasks} tasks
                          </div>
                        </div>
                      </div>
                    </div>
                    <Progress value={progressPercent} className="h-3" />
                  </CardContent>
                </Card>

                <div className="mb-8">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Click each topic below to see the step-by-step actions
                </p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    What You'll Achieve
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {level.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Accordion 
                  type="multiple" 
                  className="space-y-4"
                  value={expandedMilestones}
                  onValueChange={setExpandedMilestones}
                >
                  {level.milestones.map((milestone) => {
                    const milestoneCompleted = milestone.tasks.filter(t => completedTasks.has(t.id)).length;
                    const milestoneTotal = milestone.tasks.length;
                    
                    return (
                      <AccordionItem 
                        key={milestone.id} 
                        value={milestone.id}
                        className="border rounded-xl bg-white dark:bg-slate-800 px-6"
                      >
                        <AccordionTrigger className="hover:no-underline py-5">
                          <div className="flex items-center gap-4 text-left">
                            <div className={`p-3 rounded-xl ${
                              milestoneCompleted === milestoneTotal 
                                ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                            }`}>
                              {milestone.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                  {milestone.title}
                                </h4>
                                {milestoneCompleted === milestoneTotal && (
                                  <CheckCircle2 className="h-5 w-5 text-teal-500" />
                                )}
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {milestone.description}
                              </p>
                              <div className="text-xs text-slate-400 mt-1">
                                {milestoneCompleted}/{milestoneTotal} completed
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-5">
                          <div className="space-y-4 pt-2">
                            {milestone.tasks.map((task) => (
                              <div 
                                key={task.id}
                                className={`rounded-lg border transition-colors ${
                                  completedTasks.has(task.id)
                                    ? 'bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800'
                                    : 'bg-slate-50 border-slate-200 dark:bg-slate-700/50 dark:border-slate-600'
                                }`}
                              >
                                <div className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div 
                                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer ${
                                        completedTasks.has(task.id)
                                          ? 'bg-teal-500 border-teal-500'
                                          : 'border-slate-300 dark:border-slate-500 hover:border-teal-400'
                                      }`}
                                      onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                                    >
                                      {completedTasks.has(task.id) && (
                                        <CheckCircle2 className="h-4 w-4 text-white" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h5 className={`font-medium ${
                                          completedTasks.has(task.id)
                                            ? 'text-teal-700 dark:text-teal-300 line-through'
                                            : 'text-slate-900 dark:text-white'
                                        }`}>
                                          {task.title}
                                        </h5>
                                        <Badge variant="outline" className={difficultyColors[task.difficulty]}>
                                          {difficultyLabels[task.difficulty]}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                        {task.description}
                                      </p>
                                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                        <span>⏱️ {task.timeEstimate}</span>
                                        <span>👤 {task.forWho.join(", ")}</span>
                                        <button 
                                          onClick={() => toggleTaskExpansion(task.id)}
                                          className="flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
                                        >
                                          {expandedTask === task.id ? (
                                            <>Hide Steps <ChevronUp className="h-3 w-3" /></>
                                          ) : (
                                            <>Show Steps <ChevronDown className="h-3 w-3" /></>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {expandedTask === task.id && (
                                  <div className="px-4 pb-4 pt-0 border-t border-slate-200 dark:border-slate-600 mt-2">
                                    <div className="pt-4">
                                      <h6 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                        <Target className="h-4 w-4 text-teal-500" />
                                        Step-by-Step Instructions
                                      </h6>
                                      <ol className="space-y-2">
                                        {task.steps.map((step, idx) => (
                                          <li key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-semibold">
                                              {idx + 1}
                                            </span>
                                            <span className="pt-0.5">{step}</span>
                                          </li>
                                        ))}
                                      </ol>
                                      
                                      {task.resources && task.resources.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-600">
                                          <h6 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                                            Helpful Resources
                                          </h6>
                                          <div className="flex flex-wrap gap-2">
                                            {task.resources.map((resource, idx) => (
                                              <a
                                                key={idx}
                                                href={resource.url}
                                                target={resource.url.startsWith('/') ? '_self' : '_blank'}
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-full hover:bg-teal-200 dark:hover:bg-teal-800/40 transition-colors"
                                              >
                                                {resource.label}
                                                {!resource.url.startsWith('/') && <ExternalLink className="h-3 w-3" />}
                                              </a>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>

          <Card className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-0 mt-12">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-3">Ready to Check Your Progress?</h3>
              <p className="text-teal-100 mb-6 max-w-lg mx-auto">
                Take our Family Safety Score quiz to see how well protected your family is and get personalized recommendations.
              </p>
              <Link to="/safety-score">
                <Button size="lg" variant="secondary" className="bg-white text-teal-700 hover:bg-teal-50">
                  Take the Safety Quiz
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
