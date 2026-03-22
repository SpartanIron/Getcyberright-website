export interface QuizQuestion {
  id: string;
  category: string;
  scenario: string;
  options: { text: string; isCorrect: boolean; feedback: string }[];
}

export interface AppSafetyCard {
  name: string;
  icon: string;
  minAge: number;
  region: string[];
  risks: string[];
  safetyTips: string[];
  parentActions: string[];
  rating: "low" | "medium" | "high";
}

export interface LegalInfo {
  law: string;
  region: string;
  country: string;
  ageThreshold: number;
  summary: string;
  whatItMeans: string[];
  penalties: string;
  parentActions: string[];
}

export interface ConversationScript {
  topic: string;
  ageRange: string;
  opening: string;
  dos: string[];
  donts: string[];
  followUp: string[];
}

export interface FamilyStat {
  label: string;
  value: string;
  description: string;
  source: string;
  color: string;
}

export interface DeviceAuditStep {
  id: string;
  text: string;
  detail?: string;
}

export interface DeviceAudit {
  platform: string;
  icon: string;
  steps: DeviceAuditStep[];
}

export interface ISPGuide {
  isp: string;
  region: string;
  steps: string[];
}

export const parentingQuizQuestions: QuizQuestion[] = [
  {
    id: "app-1",
    category: "App Safety",
    scenario: "Your 10-year-old asks to download a popular social media app that says it's rated 12+. What do you do first?",
    options: [
      { text: "Say no because they're too young", isCorrect: false, feedback: "An outright refusal without discussion can lead to sneaking. Better to review the app together first." },
      { text: "Download it and check the privacy settings later", isCorrect: false, feedback: "Installing first means your child could be exposed to risks before you've configured safety settings." },
      { text: "Review the app's permissions, privacy policy, and set it up together with safety settings enabled", isCorrect: true, feedback: "This is the best approach. Review permissions, discuss risks, configure privacy settings together, and set clear usage rules." },
      { text: "Ask other parents if they let their kids use it", isCorrect: false, feedback: "Other parents' decisions may not reflect your family's values or your child's maturity level. Research the app yourself." }
    ]
  },
  {
    id: "app-2",
    category: "App Safety",
    scenario: "You discover your child has been using an app you've never heard of. When you ask about it, they say 'everyone at school uses it.' What's your response?",
    options: [
      { text: "Delete the app immediately", isCorrect: false, feedback: "Deleting without discussion damages trust and they may just reinstall it at a friend's house." },
      { text: "Research the app, then sit down together to review its settings and discuss how they use it", isCorrect: true, feedback: "This balanced approach shows respect while ensuring safety. Research first, then have a calm conversation about what they do on the app and adjust settings together." },
      { text: "Let them keep it since their friends use it", isCorrect: false, feedback: "Peer pressure alone is not a good reason to allow an app. Every app needs your review regardless of popularity." },
      { text: "Ground them for downloading without permission", isCorrect: false, feedback: "Punishment without discussion teaches kids to hide their online activity, which is more dangerous." }
    ]
  },
  {
    id: "social-1",
    category: "Social Media Monitoring",
    scenario: "Your 14-year-old has a public Instagram profile with their full name, school name, and photos with location tags. What's the priority?",
    options: [
      { text: "Tell them to delete the account", isCorrect: false, feedback: "Deletion is extreme and ignores the opportunity to teach good digital hygiene." },
      { text: "Switch the account to private, remove the school name, and turn off location tagging together", isCorrect: true, feedback: "This addresses the immediate risks without destroying their social connection. Walk through each setting change together so they understand why." },
      { text: "Follow them on Instagram so you can monitor their posts", isCorrect: false, feedback: "Following alone doesn't fix the privacy issues. The profile is still public to everyone else." },
      { text: "Ignore it because all teens post this way", isCorrect: false, feedback: "Normalizing poor privacy settings exposes your child to real risks including location tracking and identity theft." }
    ]
  },
  {
    id: "social-2",
    category: "Social Media Monitoring",
    scenario: "You notice your child has 500+ followers on social media but only knows about 50 people in real life. What do you do?",
    options: [
      { text: "Remove all followers you don't recognize", isCorrect: false, feedback: "Taking control of their account without discussion will cause resentment and teach them to create secret accounts." },
      { text: "Nothing, having lots of followers is normal for teens", isCorrect: false, feedback: "Unknown followers can include predators, scammers, and bots. The number of unknown followers is a safety concern." },
      { text: "Discuss who can see their content, review the follower list together, and switch to a private account", isCorrect: true, feedback: "This collaborative approach teaches them to evaluate their audience. Review followers together, remove unknown accounts, and enable approval for new follow requests." },
      { text: "Set up a monitoring app without telling them", isCorrect: false, feedback: "Secret monitoring destroys trust and is a short-term solution. Open conversation builds lasting judgment." }
    ]
  },
  {
    id: "screen-1",
    category: "Screen Time",
    scenario: "Your child argues that screen time limits are unfair because they use their device for homework, gaming, and socializing. How do you respond?",
    options: [
      { text: "Remind them that you make the rules", isCorrect: false, feedback: "Authoritarian responses shut down productive conversation and do not teach self-regulation." },
      { text: "Remove all limits since they use it for homework", isCorrect: false, feedback: "Homework use does not justify unlimited recreational screen time. Different activities need different limits." },
      { text: "Create different time budgets for educational, social, and entertainment screen time together", isCorrect: true, feedback: "This teaches them to categorize their usage. Work together to set separate limits: homework (flexible), social media (1 hour), gaming (1 hour). This builds their own self-regulation skills." },
      { text: "Take the device away during non-homework hours", isCorrect: false, feedback: "Complete restriction prevents healthy socialization and teaches nothing about managing their own behavior." }
    ]
  },
  {
    id: "screen-2",
    category: "Screen Time",
    scenario: "It's 11 PM on a school night and you discover your child has been secretly using their phone in bed. What's the best approach?",
    options: [
      { text: "Confiscate the phone permanently", isCorrect: false, feedback: "Permanent confiscation is disproportionate and does not address the underlying behavior." },
      { text: "Implement a family charging station outside bedrooms where all devices charge overnight", isCorrect: true, feedback: "A central charging station removes the temptation for all family members. Present it as a family rule that applies to everyone, including parents, for better sleep." },
      { text: "Install a monitoring app to track their usage", isCorrect: false, feedback: "Monitoring without addressing the root cause (device in bedroom) does not prevent the behavior." },
      { text: "Let it go since teens naturally stay up late", isCorrect: false, feedback: "Blue light disrupts sleep, and sleep deprivation affects academic performance, mood, and health. This needs addressing." }
    ]
  },
  {
    id: "bully-1",
    category: "Cyberbullying Response",
    scenario: "Your child comes to you in tears saying someone at school is posting mean comments about them online. What is the right first step?",
    options: [
      { text: "Tell them to ignore it and it will stop", isCorrect: false, feedback: "Dismissing their feelings discourages them from coming to you in the future. Cyberbullying often escalates when ignored." },
      { text: "Contact the other child's parents immediately", isCorrect: false, feedback: "While this may be needed later, going straight to confrontation can make the situation worse. Listen and document first." },
      { text: "Listen to them without judgment, take screenshots as evidence, and report the content to the platform", isCorrect: true, feedback: "Validate their feelings, document everything with screenshots, and report to the platform. Then discuss next steps together, which may include talking to the school counselor." },
      { text: "Post a response defending your child", isCorrect: false, feedback: "Adults engaging in online disputes with children escalates the situation and models poor conflict resolution." }
    ]
  },
  {
    id: "bully-2",
    category: "Cyberbullying Response",
    scenario: "You discover your child has been participating in a group chat that bullies another student. How do you handle this?",
    options: [
      { text: "Punish them severely so they learn their lesson", isCorrect: false, feedback: "Punishment without education teaches them to hide behavior, not to develop empathy." },
      { text: "Have a serious conversation about the impact of their actions, have them apologize, and discuss how to be an upstander", isCorrect: true, feedback: "Address the behavior directly. Help them understand the victim's perspective, require a genuine apology, and teach them how to stand up against bullying in the future instead of participating." },
      { text: "Tell them to just leave the group chat", isCorrect: false, feedback: "Silently leaving without accountability does not teach empathy or repair the harm done." },
      { text: "Assume it's just normal kid behavior", isCorrect: false, feedback: "Normalizing bullying behavior allows it to continue and can cause lasting harm to the victim." }
    ]
  },
  {
    id: "privacy-1",
    category: "Privacy Settings",
    scenario: "Your child wants to create an online account for a new game and asks if they can use their real name and birthday. What do you advise?",
    options: [
      { text: "It's fine to use real information on gaming sites", isCorrect: false, feedback: "Real names and birthdays can be combined with other data for identity theft or social engineering." },
      { text: "Help them create a username that doesn't reveal personal info, and use your email as the recovery contact", isCorrect: true, feedback: "A non-identifying username protects their identity. Using your email as the recovery ensures you can help if there are account issues and you stay aware of the account's existence." },
      { text: "Don't let them create the account at all", isCorrect: false, feedback: "Blanket refusals don't teach digital literacy. Guide them through safe account creation instead." },
      { text: "Let them figure it out on their own", isCorrect: false, feedback: "Children need guidance on information sharing. This is a teachable moment about digital identity." }
    ]
  },
  {
    id: "privacy-2",
    category: "Privacy Settings",
    scenario: "Your child shares their home Wi-Fi password with a friend who came over to visit. Is this a concern?",
    options: [
      { text: "No, sharing Wi-Fi is normal hospitality", isCorrect: false, feedback: "While sharing Wi-Fi seems harmless, it gives the friend ongoing access to your home network." },
      { text: "Yes. Set up a separate guest Wi-Fi network and teach your child to share only the guest password", isCorrect: true, feedback: "Most routers support a guest network. This isolates visitors from your main network and smart home devices. Change the guest password periodically and teach your child this is the one to share." },
      { text: "Change the Wi-Fi password immediately", isCorrect: false, feedback: "While changing it is fine, you also need to explain why and set up a guest network for the future." },
      { text: "Block the friend's device from the network", isCorrect: false, feedback: "Blocking one device is reactive. A guest network solves this proactively for all visitors." }
    ]
  }
];

export const appSafetyCards: AppSafetyCard[] = [
  {
    name: "TikTok",
    icon: "🎵",
    minAge: 13,
    region: ["Global"],
    risks: [
      "Addictive algorithm keeps children scrolling for hours",
      "Inappropriate content can appear despite filters",
      "Strangers can message and duet with your child",
      "Location data may be shared through videos",
      "Challenges and trends can encourage dangerous behavior"
    ],
    safetyTips: [
      "Enable Family Pairing to control settings remotely",
      "Set account to Private so only approved followers see videos",
      "Restrict direct messages to No One or Friends Only",
      "Enable Restricted Mode and lock it with a passcode",
      "Set daily screen time limit within the app"
    ],
    parentActions: [
      "Review their Following list and remove unknown accounts",
      "Watch their posted videos for personal information exposure",
      "Discuss trending challenges and why some are dangerous",
      "Check if Restricted Mode is still enabled monthly"
    ],
    rating: "high"
  },
  {
    name: "Instagram",
    icon: "📸",
    minAge: 13,
    region: ["Global"],
    risks: [
      "Body image and self-esteem issues from curated content",
      "Direct messages from strangers",
      "Public accounts expose photos to anyone",
      "Stories can reveal real-time location",
      "Shopping features encourage impulsive spending"
    ],
    safetyTips: [
      "Set account to Private immediately",
      "Enable Supervision through Family Center",
      "Restrict who can message and tag your child",
      "Turn off Activity Status so others can't see when they're online",
      "Disable location tagging on all posts"
    ],
    parentActions: [
      "Check that the account is still set to Private monthly",
      "Review their Story highlights for personal info exposure",
      "Discuss the difference between real life and curated content",
      "Verify age settings are correct for built-in protections"
    ],
    rating: "high"
  },
  {
    name: "Snapchat",
    icon: "👻",
    minAge: 13,
    region: ["Global"],
    risks: [
      "Disappearing messages create false sense of privacy",
      "Snap Map reveals exact real-time location",
      "My AI chatbot may share inappropriate content",
      "Discover section shows unmoderated content",
      "Streaks create compulsive usage patterns"
    ],
    safetyTips: [
      "Enable Ghost Mode on Snap Map to hide location",
      "Set Contact Me to My Friends Only",
      "Turn off Quick Add so strangers can't find the account",
      "Use Family Center to monitor contacts",
      "Consider disabling My AI feature"
    ],
    parentActions: [
      "Verify Ghost Mode is enabled on Snap Map",
      "Check Friend list for unknown accounts",
      "Discuss that 'disappearing' messages can still be screenshotted",
      "Review Discover feed content together"
    ],
    rating: "high"
  },
  {
    name: "Roblox",
    icon: "🎮",
    minAge: 7,
    region: ["Global"],
    risks: [
      "User-created games may contain inappropriate content",
      "In-game chat with strangers",
      "Robux purchases can add up quickly",
      "Scammers target young players with fake free Robux offers",
      "Some games simulate dating and other adult themes"
    ],
    safetyTips: [
      "Set age to under 13 for stricter content filtering",
      "Enable Account Restrictions to limit chat and game access",
      "Set a monthly spending limit or use prepaid Robux cards",
      "Turn off chat for younger children",
      "Review game history to see what they play"
    ],
    parentActions: [
      "Check Spending page for unauthorized purchases",
      "Play some games together to understand the environment",
      "Discuss common scams like free Robux generators",
      "Review and update privacy settings quarterly"
    ],
    rating: "medium"
  },
  {
    name: "YouTube",
    icon: "▶️",
    minAge: 13,
    region: ["Global"],
    risks: [
      "Autoplay leads to increasingly extreme content",
      "Comments section can contain toxic and inappropriate content",
      "Some creators normalize dangerous behavior",
      "Ads may be age-inappropriate",
      "Algorithm can create harmful content bubbles"
    ],
    safetyTips: [
      "Use YouTube Kids app for children under 13",
      "Enable Restricted Mode on regular YouTube for teens",
      "Turn off Autoplay",
      "Disable comments viewing on YouTube Kids",
      "Set up supervised experience through Google Family Link"
    ],
    parentActions: [
      "Review Watch History weekly for concerning content",
      "Check subscribed channels for age-appropriateness",
      "Watch trending videos together to discuss content",
      "Verify Restricted Mode is still enabled monthly"
    ],
    rating: "medium"
  },
  {
    name: "WhatsApp",
    icon: "💬",
    minAge: 16,
    region: ["Global", "Africa", "Asia"],
    risks: [
      "Group invitations from unknown numbers",
      "Forwarded misinformation spreads rapidly",
      "Scam links in messages from compromised contacts",
      "Location sharing can reveal home address",
      "No age verification despite 16+ requirement"
    ],
    safetyTips: [
      "Set Profile Photo visibility to My Contacts Only",
      "Disable automatic group additions in Privacy settings",
      "Turn off Live Location sharing",
      "Enable two-step verification",
      "Block and report suspicious contacts immediately"
    ],
    parentActions: [
      "Review group memberships for unknown groups",
      "Discuss how to identify forwarded misinformation",
      "Set up the app together with proper privacy settings",
      "Teach them to never click links from unknown senders"
    ],
    rating: "medium"
  },
  {
    name: "LINE",
    icon: "💚",
    minAge: 12,
    region: ["Asia"],
    risks: [
      "Timeline posts visible to all friends by default",
      "Add by Phone Number allows strangers to connect",
      "Official accounts may promote gambling or adult content",
      "Open Chat rooms expose children to strangers",
      "LINE Pay linked to real money"
    ],
    safetyTips: [
      "Disable Allow Others to Add by Phone Number",
      "Set Timeline visibility to Friends Only",
      "Block Open Chat access for younger users",
      "Restrict LINE Pay access with a separate PIN",
      "Filter official account recommendations"
    ],
    parentActions: [
      "Review friend list for unknown contacts",
      "Check Timeline posts for personal information",
      "Verify Open Chat restrictions are in place",
      "Monitor LINE Pay transactions if enabled"
    ],
    rating: "medium"
  },
  {
    name: "KakaoTalk",
    icon: "🗨️",
    minAge: 14,
    region: ["Asia"],
    risks: [
      "Open Chat exposes conversations to strangers",
      "Gift Shop enables spending without parental approval",
      "Profile can reveal personal information",
      "News and content feeds show unfiltered articles",
      "Phone number-based discovery allows unknown contacts"
    ],
    safetyTips: [
      "Restrict Open Chat access in settings",
      "Disable gift purchases or set spending limits",
      "Set profile visibility to friends only",
      "Turn off auto-add from phone contacts",
      "Review connected third-party apps regularly"
    ],
    parentActions: [
      "Review Open Chat participation",
      "Check purchase history in Gift Shop",
      "Verify contact list for unknown accounts",
      "Discuss safe messaging practices"
    ],
    rating: "medium"
  },
  {
    name: "JioChat",
    icon: "📱",
    minAge: 13,
    region: ["Asia"],
    risks: [
      "Video calling with strangers possible by default",
      "No robust content moderation system",
      "Group discovery can expose children to unknown adults",
      "Limited parental control features",
      "Data privacy concerns"
    ],
    safetyTips: [
      "Restrict incoming calls to contacts only",
      "Disable automatic group additions",
      "Review and limit contact list regularly",
      "Use with parental supervision for younger teens",
      "Consider alternative apps with better safety features"
    ],
    parentActions: [
      "Monitor call and message logs regularly",
      "Review contact list monthly",
      "Discuss video call safety rules",
      "Evaluate whether a safer alternative exists"
    ],
    rating: "high"
  },
  {
    name: "Discord",
    icon: "🎧",
    minAge: 13,
    region: ["Global", "Americas"],
    risks: [
      "Public servers expose children to strangers and adult content",
      "Direct messages from anyone on shared servers",
      "Screen sharing can reveal personal information",
      "No age verification on most servers",
      "Voice chat with anonymous users"
    ],
    safetyTips: [
      "Enable Safe Direct Messaging to scan messages for explicit content",
      "Turn off Allow Direct Messages from Server Members",
      "Disable Friend Requests from Everyone",
      "Only join servers you trust and that are actively moderated",
      "Never share screens showing personal information"
    ],
    parentActions: [
      "Review server list and ensure they are appropriate",
      "Check privacy and safety settings monthly",
      "Discuss the difference between public and private servers",
      "Verify that explicit content filter is set to highest level"
    ],
    rating: "high"
  },
  {
    name: "Fortnite",
    icon: "🎯",
    minAge: 12,
    region: ["Global"],
    risks: [
      "Voice chat with random players in every match",
      "V-Bucks purchases can cost significant real money",
      "Scammers offer fake free V-Bucks to steal accounts",
      "Toxic player behavior including verbal abuse",
      "Addictive battle pass system encourages daily play"
    ],
    safetyTips: [
      "Set voice chat to Friends Only or Off",
      "Disable in-app purchases or require a PIN",
      "Enable two-factor authentication to prevent account theft",
      "Use the Epic Games parental controls portal",
      "Set daily play time reminders"
    ],
    parentActions: [
      "Review spending history on the Epic Games account",
      "Check friend list for unknown players",
      "Discuss scam awareness for fake V-Bucks offers",
      "Play together occasionally to understand the environment"
    ],
    rating: "medium"
  }
];

export const legalInfoData: LegalInfo[] = [
  {
    law: "COPPA",
    region: "Americas",
    country: "United States",
    ageThreshold: 13,
    summary: "The Children's Online Privacy Protection Act requires websites and apps to get verifiable parental consent before collecting personal information from children under 13.",
    whatItMeans: [
      "Apps and websites cannot collect your child's name, email, phone number, or location without your permission.",
      "You have the right to review the information a company has collected about your child.",
      "You can request that a company delete your child's personal data at any time.",
      "If your child is under 13, they technically should not have accounts on most social media platforms.",
      "Schools can consent on behalf of parents for educational technology, but only for educational purposes."
    ],
    penalties: "Violations can result in fines up to $50,120 per violation. The FTC actively enforces this law.",
    parentActions: [
      "Check if apps your child uses have a COPPA-compliant privacy policy",
      "Report violations to the FTC at ftc.gov/complaint",
      "Request data deletion from any app collecting your child's info without consent",
      "Use your child's real age when creating accounts so protections apply"
    ]
  },
  {
    law: "GDPR (Children's Provisions)",
    region: "Europe",
    country: "European Union",
    ageThreshold: 16,
    summary: "The General Data Protection Regulation sets the age of digital consent at 16 across the EU (member states can lower it to 13). Companies must get parental consent for data processing of children under this age.",
    whatItMeans: [
      "Your child has the 'right to be forgotten' and can request all their data be deleted.",
      "Companies must explain data collection in language a child can understand.",
      "Profiling children for targeted advertising is heavily restricted.",
      "Data breaches affecting your child must be reported within 72 hours.",
      "Member states may set a lower age (down to 13), so check your specific country's rules."
    ],
    penalties: "Fines up to 4% of a company's global annual revenue or 20 million euros, whichever is higher.",
    parentActions: [
      "Exercise your child's right to data access by sending a Subject Access Request to any company",
      "Request data deletion under the right to be forgotten",
      "Check your specific country's age of consent for data processing",
      "Report violations to your national Data Protection Authority"
    ]
  },
  {
    law: "Online Safety Act",
    region: "Europe",
    country: "United Kingdom",
    ageThreshold: 18,
    summary: "The UK Online Safety Act (2023) requires platforms to protect children from harmful content. Ofcom enforces the law and can fine or block non-compliant platforms.",
    whatItMeans: [
      "Social media companies must prevent children from seeing harmful content including self-harm, eating disorders, and pornography.",
      "Platforms must implement age verification or age estimation for content that is harmful to children.",
      "Companies that fail to protect children face fines of up to 10% of global revenue.",
      "The law covers all user-to-user services and search engines accessible in the UK.",
      "Parents can report platforms to Ofcom if they believe a service is failing to protect their children."
    ],
    penalties: "Up to 10% of qualifying global revenue, senior manager criminal liability, and potential service blocking in the UK.",
    parentActions: [
      "Report platforms failing to protect children to Ofcom",
      "Support age verification when platforms implement it",
      "Use Ofcom's guidance on setting up parental controls",
      "Teach children that the law protects them and they should report harmful content"
    ]
  },
  {
    law: "Children's Code (Age Appropriate Design Code)",
    region: "Europe",
    country: "United Kingdom",
    ageThreshold: 18,
    summary: "The UK's Age Appropriate Design Code requires online services likely to be accessed by children to prioritize children's best interests and minimize data collection.",
    whatItMeans: [
      "Apps and websites must have high privacy settings turned on by default for children.",
      "Services must not use dark patterns or nudge techniques to get children to weaken their privacy.",
      "Location tracking of children must be off by default.",
      "Profiling children to serve them targeted content is restricted.",
      "Services must provide prominent and accessible tools for children to report concerns."
    ],
    penalties: "Enforced by the ICO with fines up to 4% of global turnover under the UK GDPR.",
    parentActions: [
      "Check that apps your child uses have age-appropriate default settings",
      "Report services that seem to manipulate children into sharing data",
      "Request a copy of your child's data from any service",
      "Review default privacy settings even on apps that claim to comply"
    ]
  },
  {
    law: "POPIA",
    region: "Africa",
    country: "South Africa",
    ageThreshold: 18,
    summary: "The Protection of Personal Information Act requires special justification to process children's (under 18) personal information. A competent person (parent or guardian) must consent.",
    whatItMeans: [
      "Companies need your consent as parent or guardian before processing your child's data.",
      "Children under 18 are considered unable to consent to data processing themselves.",
      "Your child's data must be processed lawfully, minimally, and for a specific purpose.",
      "You can request access to and deletion of your child's personal information.",
      "The law applies to any organization processing personal information in South Africa."
    ],
    penalties: "Fines up to 10 million ZAR and potential imprisonment for serious offences.",
    parentActions: [
      "Provide or withhold consent for your child's data processing",
      "Request access to personal information held about your child",
      "Report violations to the Information Regulator",
      "Be cautious of apps and services that do not ask for parental consent"
    ]
  },
  {
    law: "DPDP Act",
    region: "Asia",
    country: "India",
    ageThreshold: 18,
    summary: "The Digital Personal Data Protection Act (2023) classifies all individuals under 18 as children and requires verifiable parental consent before processing their data. Behavioral advertising targeting children is prohibited.",
    whatItMeans: [
      "All individuals under 18 are classified as children, requiring verifiable parental consent for data processing.",
      "No behavioral tracking or targeted advertising directed at children is allowed.",
      "Data fiduciaries (companies) must not process children's data in a way that causes harm.",
      "The government can exempt certain platforms or age groups from some requirements.",
      "Companies must implement age verification mechanisms."
    ],
    penalties: "Fines up to 250 crore INR (approximately 30 million USD) per violation.",
    parentActions: [
      "Verify that apps used by your child comply with the DPDP Act",
      "Provide or withdraw consent for data processing at any time",
      "Report platforms that target children with behavioral advertising",
      "Check government notifications for any exemptions that may apply"
    ]
  }
];

export const conversationScripts: ConversationScript[] = [
  {
    topic: "First Smartphone",
    ageRange: "8-10",
    opening: "I got you this phone because I trust you and I want us to stay connected. Let's set it up together and talk about how we'll use it.",
    dos: [
      "Frame it as a shared project to set up together",
      "Explain each setting as you configure it so they understand why",
      "Write down the family rules together and post them where everyone can see",
      "Celebrate their responsibility rather than focusing on restrictions"
    ],
    donts: [
      "Don't hand it over without any setup or conversation",
      "Don't threaten to take it away at the first mistake",
      "Don't make it feel like surveillance or punishment",
      "Don't assume they know how to use it safely just because they can use it technically"
    ],
    followUp: [
      "What's your favorite thing about your phone so far?",
      "Have you seen anything online that confused you or made you feel weird?",
      "Is there an app your friends use that you want to talk about?"
    ]
  },
  {
    topic: "First Smartphone",
    ageRange: "11-13",
    opening: "Having your own phone is a big step. Let's talk about how to use it responsibly, just like we talked about being responsible with other big things.",
    dos: [
      "Acknowledge this is an important milestone for them",
      "Negotiate screen time limits together rather than dictating them",
      "Share your own phone habits honestly, including areas where you struggle",
      "Set up safety features together and explain the reasoning"
    ],
    donts: [
      "Don't lecture about every possible danger before they even start using it",
      "Don't compare them unfavorably to other kids",
      "Don't pretend you'll never check their phone, be honest about your monitoring approach",
      "Don't set rules you won't follow yourself"
    ],
    followUp: [
      "How are the screen time limits working? Do we need to adjust anything?",
      "Has anyone messaged you that you don't know in real life?",
      "What would you do if you saw something upsetting online?"
    ]
  },
  {
    topic: "First Smartphone",
    ageRange: "14-16",
    opening: "You've shown you're responsible enough for more independence with your phone. Let's update our agreement to match where you are now.",
    dos: [
      "Acknowledge their growing maturity and adjust rules accordingly",
      "Discuss digital citizenship and how their online actions affect their future",
      "Involve them in setting their own limits with your guidance",
      "Talk about digital wellbeing and recognizing when phone use becomes unhealthy"
    ],
    donts: [
      "Don't treat them the same as a 10-year-old",
      "Don't use their phone as a bargaining chip for unrelated issues",
      "Don't ignore signs of excessive use just because they're older",
      "Don't forget to model good phone habits yourself"
    ],
    followUp: [
      "Do you feel like your screen time is balanced with other activities?",
      "How do your online friendships compare to your in-person friendships?",
      "Have you encountered any situations online that you weren't sure how to handle?"
    ]
  },
  {
    topic: "Cyberbullying",
    ageRange: "8-10",
    opening: "Sometimes people can be unkind online, just like at school. I want you to know that you can always tell me if someone is being mean to you on the internet, and you will never be in trouble for it.",
    dos: [
      "Use simple, clear language about what cyberbullying looks like",
      "Reassure them they will never be punished for reporting",
      "Give specific examples like mean comments, exclusion from online groups, or embarrassing photos",
      "Practice what they should say: 'Someone online is being mean to me and I need your help'"
    ],
    donts: [
      "Don't dismiss online meanness as less serious than in-person bullying",
      "Don't tell them to 'just ignore it' as a complete solution",
      "Don't blame them for being targeted",
      "Don't overreact in a way that makes them regret telling you"
    ],
    followUp: [
      "Has anyone said something online that hurt your feelings?",
      "Do you know what to do if someone is being mean in a game or chat?",
      "Would you feel comfortable telling me if something happened?"
    ]
  },
  {
    topic: "Cyberbullying",
    ageRange: "11-13",
    opening: "Cyberbullying is really common at your age. I want us to talk about what it looks like, what to do if it happens to you, and how to be a good bystander if it happens to someone else.",
    dos: [
      "Discuss both being a target and being a bystander",
      "Teach them to screenshot and save evidence before reporting",
      "Explain the difference between a conflict and bullying (repeated targeting vs. a disagreement)",
      "Role-play scenarios so they feel prepared"
    ],
    donts: [
      "Don't suggest they fight back online",
      "Don't immediately call the bully's parents without a plan",
      "Don't take their phone away as a solution since it punishes the victim",
      "Don't promise to fix it without their input"
    ],
    followUp: [
      "Have you ever witnessed cyberbullying in a group chat or online?",
      "What would you do if your friend was being bullied online?",
      "Do you feel safe reporting things to adults at school?"
    ]
  },
  {
    topic: "Cyberbullying",
    ageRange: "14-16",
    opening: "At your age, online conflicts can get intense. Let's talk about handling difficult situations online, recognizing when something crosses the line, and knowing when to get help.",
    dos: [
      "Acknowledge that online social dynamics are complex and stressful",
      "Discuss the legal implications of cyberbullying in your region",
      "Talk about the permanence of screenshots and forwards",
      "Empower them to be an upstander and model positive online behavior"
    ],
    donts: [
      "Don't minimize their experiences because 'it's just online'",
      "Don't take over the situation without their consent unless safety is at risk",
      "Don't assume they should be able to handle it themselves because they're older",
      "Don't forget that teens can be both targets and participants"
    ],
    followUp: [
      "Have you ever felt pressured to participate in something online that felt wrong?",
      "Do you know the difference between a disagreement and harassment?",
      "What resources do you know about for getting help with cyberbullying?"
    ]
  },
  {
    topic: "Online Privacy",
    ageRange: "8-10",
    opening: "Some information about you is like your home key. You wouldn't give your house key to a stranger, right? Let's talk about what information is safe to share online and what should stay private.",
    dos: [
      "Use the 'YAPPY' framework: Your full name, Address, Phone number, Passwords, Your plans",
      "Make it a game: 'Safe to share or keep it secret?'",
      "Give concrete examples relevant to their online activities",
      "Praise them when they identify private information correctly"
    ],
    donts: [
      "Don't make the internet sound terrifying",
      "Don't assume they understand what 'personal information' means abstractly",
      "Don't forget to include things like school name and daily routine",
      "Don't skip discussing in-game chat and voice chat"
    ],
    followUp: [
      "If someone in a game asks where you live, what would you say?",
      "What information should you never share online?",
      "Have you ever been asked for personal information by someone online?"
    ]
  },
  {
    topic: "Online Privacy",
    ageRange: "11-13",
    opening: "Your privacy online is more important than ever. As you use more apps, more companies are collecting your data. Let's talk about what that means and how to protect yourself.",
    dos: [
      "Explain how data collection and targeted advertising work in simple terms",
      "Show them how to check app permissions on their device",
      "Discuss the concept of a digital footprint and its permanence",
      "Review privacy settings on their most-used apps together"
    ],
    donts: [
      "Don't assume privacy settings are 'set and forget' since they change with app updates",
      "Don't use scare tactics about data collection",
      "Don't forget to discuss location data from photos",
      "Don't skip talking about what friends might share about them"
    ],
    followUp: [
      "Do you know what permissions your apps have on your phone?",
      "Have you ever gotten an ad for something you just talked about? How does that make you feel?",
      "Would you be comfortable if a stranger read everything you've posted online?"
    ]
  },
  {
    topic: "Online Privacy",
    ageRange: "14-16",
    opening: "At your age, your digital privacy has real consequences for your future. Colleges, employers, and other people form opinions based on what they find online. Let's make sure you're in control of your digital identity.",
    dos: [
      "Discuss real examples of how online history has affected college admissions and job applications",
      "Explain VPNs, encrypted messaging, and two-factor authentication",
      "Talk about the trade-off between convenience and privacy",
      "Encourage them to do a self-audit by searching their own name"
    ],
    donts: [
      "Don't lecture, have a conversation between equals",
      "Don't assume they know less than they do, many teens are privacy-aware",
      "Don't ignore the nuance that some sharing is healthy and normal",
      "Don't frame privacy as something to fear rather than something to manage"
    ],
    followUp: [
      "Have you ever searched your own name online? What came up?",
      "Do you use two-factor authentication on your important accounts?",
      "How do you decide what to post publicly versus privately?"
    ]
  },
  {
    topic: "Gaming and Spending",
    ageRange: "8-10",
    opening: "You know how games sometimes have stores where you can buy things? Those use real money, even though it might not look like it. Let's talk about how that works.",
    dos: [
      "Explain that V-Bucks, Robux, and gems are real money in a different form",
      "Set up purchase approval so they have to ask before buying",
      "Use an allowance system with a set monthly gaming budget",
      "Play the game together to understand the purchase mechanics"
    ],
    donts: [
      "Don't assume they understand the value of in-game currency",
      "Don't link a credit card without purchase controls",
      "Don't shame them if they've already spent money accidentally",
      "Don't ban all purchases since teach them to budget instead"
    ],
    followUp: [
      "What's the coolest thing you've seen in a game store? How much does it cost in real money?",
      "Have any of your friends spent money in games?",
      "If you had a $10 monthly gaming budget, how would you spend it?"
    ]
  },
  {
    topic: "Gaming and Spending",
    ageRange: "11-13",
    opening: "In-game purchases are designed to be tempting, and games use psychology to encourage spending. Let's talk about how to recognize these tactics and make smart choices.",
    dos: [
      "Explain FOMO (fear of missing out) tactics like limited-time offers and battle passes",
      "Discuss loot boxes and how they're similar to gambling",
      "Help them create a gaming budget they manage themselves",
      "Talk about the difference between cosmetic items and pay-to-win mechanics"
    ],
    donts: [
      "Don't ridicule what they value in games, even if skins seem pointless to you",
      "Don't ignore the social pressure to have certain items",
      "Don't make it entirely about restriction, focus on financial literacy",
      "Don't forget that some spending on entertainment is normal and healthy"
    ],
    followUp: [
      "Do you feel pressured to buy things in games because your friends have them?",
      "Can you identify any tricks games use to get you to spend money?",
      "How much real money have you spent in games this month?"
    ]
  },
  {
    topic: "Gaming and Spending",
    ageRange: "14-16",
    opening: "Games are a multi-billion dollar industry, and a lot of that money comes from in-game purchases. Understanding the business model helps you make informed decisions about your spending.",
    dos: [
      "Discuss the psychology of micro-transactions and how the industry profits",
      "Talk about gambling mechanics in games (loot boxes, gacha systems)",
      "Encourage them to track their gaming spending like any other budget category",
      "Discuss the concept of 'value' since is a $20 skin worth 2 hours of work at a part-time job?"
    ],
    donts: [
      "Don't dismiss gaming as a waste of money without acknowledging it as entertainment",
      "Don't ignore that some teens develop genuine spending problems with games",
      "Don't compare their spending habits unfavorably to your generation",
      "Don't forget to discuss the gambling aspects of certain game mechanics"
    ],
    followUp: [
      "If you tracked every dollar you spent on games this year, what would the total be?",
      "Do you think loot boxes should be regulated like gambling?",
      "How do you decide when a purchase in a game is worth it?"
    ]
  }
];

export const familyStats: FamilyStat[] = [
  {
    label: "Children Online",
    value: "1 in 3",
    description: "One in three internet users globally is a child under 18.",
    source: "UNICEF 2024",
    color: "from-blue-500 to-cyan-500"
  },
  {
    label: "Cyberbullying Rate",
    value: "37%",
    description: "37% of children between ages 12 and 17 have been cyberbullied at least once.",
    source: "Pew Research 2024",
    color: "from-red-500 to-pink-500"
  },
  {
    label: "Parental Controls",
    value: "39%",
    description: "Only 39% of parents use parental controls on their children's devices.",
    source: "Common Sense Media 2024",
    color: "from-amber-500 to-orange-500"
  },
  {
    label: "Screen Time Average",
    value: "7.5 hrs",
    description: "Children ages 8 to 12 average 4.5 hours of daily screen time. Teens average 7.5 hours.",
    source: "Common Sense Media 2024",
    color: "from-purple-500 to-violet-500"
  },
  {
    label: "Gaming Spend",
    value: "$480",
    description: "The average teen spends $480 per year on in-game purchases and gaming subscriptions.",
    source: "SuperData Research 2024",
    color: "from-green-500 to-emerald-500"
  },
  {
    label: "Privacy Awareness",
    value: "26%",
    description: "Only 26% of parents have reviewed their child's app privacy settings in the last month.",
    source: "Internet Matters 2024",
    color: "from-indigo-500 to-blue-500"
  },
  {
    label: "Online Predators",
    value: "500K",
    description: "An estimated 500,000 online predators are active daily, with children aged 12 to 15 most at risk.",
    source: "DOJ / ICAC 2024",
    color: "from-rose-600 to-red-600"
  },
  {
    label: "First Phone Age",
    value: "Age 10",
    description: "The average age a child receives their first smartphone is now 10 years old.",
    source: "Common Sense Media 2024",
    color: "from-teal-500 to-cyan-500"
  }
];

export const deviceAudits: DeviceAudit[] = [
  {
    platform: "iPhone / iPad",
    icon: "📱",
    steps: [
      { id: "ios-1", text: "Open Settings > Screen Time and verify it is enabled" },
      { id: "ios-2", text: "Check Downtime schedule is set (e.g., 9 PM to 7 AM)" },
      { id: "ios-3", text: "Review App Limits for social media, games, and entertainment" },
      { id: "ios-4", text: "Verify Content & Privacy Restrictions are turned on" },
      { id: "ios-5", text: "Check web content filter is set to Limit Adult Websites" },
      { id: "ios-6", text: "Confirm app age rating is set appropriately (4+, 9+, 12+, 17+)" },
      { id: "ios-7", text: "Verify Screen Time Passcode is set and child does not know it" },
      { id: "ios-8", text: "Check that Location Services changes are restricted" },
      { id: "ios-9", text: "Verify iTunes & App Store purchases require approval" },
      { id: "ios-10", text: "Review recently installed apps for any you don't recognize" }
    ]
  },
  {
    platform: "Android",
    icon: "🤖",
    steps: [
      { id: "and-1", text: "Open Google Family Link and verify it is connected" },
      { id: "and-2", text: "Check daily screen time limits are set" },
      { id: "and-3", text: "Verify bedtime schedule locks the device at night" },
      { id: "and-4", text: "Review app restrictions and age ratings in Google Play" },
      { id: "and-5", text: "Confirm SafeSearch is enabled in Google Chrome" },
      { id: "and-6", text: "Check that web filtering blocks mature sites" },
      { id: "and-7", text: "Verify location sharing is enabled so you can locate the device" },
      { id: "and-8", text: "Confirm all app downloads require your approval" },
      { id: "and-9", text: "Review recently installed apps for any you don't recognize" },
      { id: "and-10", text: "Check that Find My Device is enabled" }
    ]
  },
  {
    platform: "Windows PC",
    icon: "💻",
    steps: [
      { id: "win-1", text: "Verify child is using their own Microsoft account (not yours)" },
      { id: "win-2", text: "Check screen time limits at family.microsoft.com" },
      { id: "win-3", text: "Review web filtering settings for inappropriate content" },
      { id: "win-4", text: "Confirm app and game age restrictions are set" },
      { id: "win-5", text: "Verify purchases require your approval" },
      { id: "win-6", text: "Check that Activity Reporting is turned on" },
      { id: "win-7", text: "Verify the PC requires a password on wake" },
      { id: "win-8", text: "Review installed programs for anything unfamiliar" }
    ]
  },
  {
    platform: "Chromebook",
    icon: "📒",
    steps: [
      { id: "cb-1", text: "Verify child is signed in with a supervised Google account" },
      { id: "cb-2", text: "Check Family Link settings apply to the Chromebook" },
      { id: "cb-3", text: "Review Chrome web filtering (block mature sites or allow only certain sites)" },
      { id: "cb-4", text: "Confirm app/game restrictions by age rating are set" },
      { id: "cb-5", text: "Verify bedtime schedule is set to lock the device at night" },
      { id: "cb-6", text: "Check browsing history in Family Link Activity section" },
      { id: "cb-7", text: "Review installed extensions for anything unfamiliar" }
    ]
  },
  {
    platform: "Nintendo Switch",
    icon: "🎮",
    steps: [
      { id: "ns-1", text: "Verify Nintendo Switch Parental Controls app is linked" },
      { id: "ns-2", text: "Check daily play time limit is set" },
      { id: "ns-3", text: "Verify restriction level matches child's age (Child, Pre-Teen, Teen)" },
      { id: "ns-4", text: "Confirm social media posting is restricted" },
      { id: "ns-5", text: "Check that communication with others is appropriately restricted" },
      { id: "ns-6", text: "Verify bedtime alarm is configured" },
      { id: "ns-7", text: "Review monthly play time report" }
    ]
  },
  {
    platform: "PlayStation",
    icon: "🎮",
    steps: [
      { id: "ps-1", text: "Verify child has a child account under your Family Manager" },
      { id: "ps-2", text: "Check communication restrictions are set (block messages from strangers)" },
      { id: "ps-3", text: "Verify monthly spending limit is set (consider $0 for young children)" },
      { id: "ps-4", text: "Confirm play time controls are enabled with daily limits" },
      { id: "ps-5", text: "Check game age rating restrictions match your child's age" },
      { id: "ps-6", text: "Verify user-generated content restrictions are on" },
      { id: "ps-7", text: "Review the Play Time report in the PlayStation app" }
    ]
  },
  {
    platform: "Xbox",
    icon: "🎮",
    steps: [
      { id: "xb-1", text: "Verify child account is in your family group at xbox.com/family" },
      { id: "xb-2", text: "Check content restrictions and age filter are set" },
      { id: "xb-3", text: "Verify communication is set to Friends Only or No One" },
      { id: "xb-4", text: "Confirm purchases require your approval (Ask a Parent)" },
      { id: "xb-5", text: "Check screen time limits for weekdays and weekends" },
      { id: "xb-6", text: "Verify Activity Reports are turned on" },
      { id: "xb-7", text: "Review the Xbox Family Settings app for pending requests" }
    ]
  }
];

export const ispGuides: ISPGuide[] = [
  {
    isp: "Xfinity (Comcast)",
    region: "US",
    steps: [
      "Log in to your Xfinity account at xfinity.com or use the Xfinity app",
      "Navigate to Internet > Advanced Settings > Xfinity xFi",
      "Under People, add a profile for your child and assign their devices",
      "Set a Bedtime schedule to pause internet on their devices at night",
      "Enable Content Filters to block inappropriate websites",
      "Set Time Limits for daily internet usage",
      "Use the Pause feature to instantly disconnect a device when needed"
    ]
  },
  {
    isp: "AT&T",
    region: "US",
    steps: [
      "Download the AT&T Smart Home Manager app",
      "Create a profile for your child and assign their devices",
      "Set a Bedtime to automatically pause internet access",
      "Enable Content Filtering to block adult websites",
      "Set Time Limits for each profile",
      "Use the Pause Internet button for immediate device disconnection",
      "Review the Activity Dashboard to see which sites are visited"
    ]
  },
  {
    isp: "Sky Broadband",
    region: "UK",
    steps: [
      "Log in to your Sky account at sky.com or use the My Sky app",
      "Go to Broadband > Sky Broadband Shield",
      "Turn on Sky Broadband Shield (free with all Sky packages)",
      "Set the filter level: PG (ages 6-12), 13 (ages 13-17), or 18 (adult)",
      "The shield works on all devices connected to your Sky router",
      "You can add specific websites to an allow list or block list",
      "Review the Weekly Report for blocked content attempts"
    ]
  },
  {
    isp: "BT Broadband",
    region: "UK",
    steps: [
      "Log in to My BT at bt.com",
      "Go to Your Package > Extras > BT Parental Controls",
      "Turn on BT Parental Controls (free with BT Broadband)",
      "Choose a filter level: Light (blocks pornography), Moderate (adds violence and dating), or Strict (blocks social media too)",
      "Set a custom schedule to allow or block categories at certain times",
      "The filter applies to all devices on your home network",
      "You can override the filter on specific devices if needed (e.g., your own)"
    ]
  },
  {
    isp: "Telstra",
    region: "AU",
    steps: [
      "Log in to the Telstra app or My Telstra at telstra.com.au",
      "Navigate to Services > Internet > Telstra Broadband Protect",
      "Enable Telstra Broadband Protect (included free with eligible plans)",
      "Set up individual profiles for each family member",
      "Choose filter levels: Child (strict), Teen (moderate), or Adult (minimal)",
      "Set time schedules to control when internet is accessible",
      "Review the activity report to see blocked content and usage patterns"
    ]
  },
  {
    isp: "Safaricom (Kenya)",
    region: "Africa",
    steps: [
      "Use Safaricom's Family Plan to manage connected devices",
      "Log in to your router at 192.168.1.1 (default for Safaricom Home Fibre)",
      "Navigate to Security > Parental Controls",
      "Add your child's device MAC address to the controlled devices list",
      "Set time-based access schedules for internet usage",
      "Enable website filtering to block adult content categories",
      "For mobile data: use the MySafaricom app to set spending limits"
    ]
  },
  {
    isp: "MTN (South Africa)",
    region: "Africa",
    steps: [
      "Log in to the MTN app or My MTN portal",
      "Navigate to Services > MTN KidSafe (if available in your region)",
      "Enable content filtering for your child's SIM card",
      "Set data usage limits to prevent overspending",
      "Use the router admin panel to set time-based access controls",
      "Contact MTN customer service to add parental controls to mobile lines",
      "Monitor usage through the MTN app billing section"
    ]
  },
  {
    isp: "Airtel / Jio (India)",
    region: "India",
    steps: [
      "Log in to the Airtel Thanks app or Jio app",
      "Navigate to the parental control or family safety section",
      "For Jio: Use JioSecurity app (free with Jio plans) to enable safe browsing",
      "Set content filters to block adult and inappropriate websites",
      "Configure data usage alerts to monitor consumption",
      "Use router-level controls by logging in to 192.168.1.1 for home broadband",
      "For mobile: consider installing a third-party parental control app for more granular control"
    ]
  }
];

export const microTransactionStats = [
  {
    label: "Average Teen Annual Gaming Spend",
    value: "$480",
    detail: "Including subscriptions, in-game purchases, and downloadable content",
    icon: "💰"
  },
  {
    label: "Children Making In-App Purchases",
    value: "28%",
    detail: "Of children under 16 have made an in-app purchase without parental permission",
    icon: "🛒"
  },
  {
    label: "Loot Box Spending",
    value: "$58/mo",
    detail: "Average monthly spending on loot boxes by players who purchase them",
    icon: "📦"
  },
  {
    label: "Refund Requests",
    value: "40%",
    detail: "Of parents have had to request refunds for unauthorized purchases by their children",
    icon: "↩️"
  }
];
