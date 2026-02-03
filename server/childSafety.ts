// Child Safety - Conversation Scanner and Resources
// Detects grooming patterns, manipulation tactics, and provides emergency resources

export interface GroomingPattern {
  category: string;
  patterns: RegExp[];
  weight: number;
  description: string;
  examples: string[];
}

export interface ScanResult {
  riskLevel: "safe" | "caution" | "warning" | "danger";
  riskScore: number;
  flags: DetectedFlag[];
  summary: string;
  recommendations: string[];
  resources: EmergencyResource[];
}

export interface DetectedFlag {
  category: string;
  matchedText: string;
  explanation: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface EmergencyResource {
  name: string;
  description: string;
  url?: string;
  phone?: string;
  type: "report" | "help" | "education";
}

// Comprehensive grooming pattern database based on research
const GROOMING_PATTERNS: GroomingPattern[] = [
  // Trust Building & Flattery
  {
    category: "Excessive Flattery",
    patterns: [
      /you'?re?\s+(so\s+)?(mature|special|different|unique|beautiful|pretty|handsome|smart|grown.?up)/i,
      /not\s+like\s+(other\s+)?(kids|girls|boys|children)/i,
      /you\s+understand\s+me/i,
      /no\s+one\s+(else\s+)?understands?\s+(me|us)/i,
      /our\s+(special\s+)?connection/i,
      /we\s+have\s+something\s+special/i,
    ],
    weight: 15,
    description: "Predators often use excessive compliments to build trust and make victims feel special",
    examples: ["You're so mature for your age", "You're not like other kids"]
  },
  // Isolation Tactics
  {
    category: "Isolation Attempts",
    patterns: [
      /don'?t\s+tell\s+(your\s+)?(parents?|mom|dad|family|anyone|friends?)/i,
      /this\s+(is\s+)?our\s+secret/i,
      /keep\s+(this\s+)?(between\s+us|secret|private)/i,
      /they\s+wouldn'?t\s+understand/i,
      /your\s+(parents?|mom|dad)\s+(wouldn'?t|won'?t|don'?t)\s+understand/i,
      /they'?d?\s+(just\s+)?(be\s+)?jealous/i,
      /we\s+should\s+(talk|chat|meet)\s+somewhere\s+(else|private)/i,
      /let'?s?\s+(move|switch)\s+to\s+(another|different|private)/i,
    ],
    weight: 25,
    description: "Attempting to separate the child from their support network is a major red flag",
    examples: ["Don't tell your parents about us", "This is our little secret"]
  },
  // Age-Related Probing
  {
    category: "Age Probing",
    patterns: [
      /how\s+old\s+(are\s+you|r\s*u)/i,
      /what('?s|\s+is)\s+your\s+age/i,
      /what\s+grade\s+(are\s+you\s+in|r\s*u\s+in)/i,
      /when('?s|\s+is)\s+your\s+birthday/i,
      /age\s+is\s+just\s+a\s+number/i,
      /age\s+doesn'?t\s+matter/i,
      /you\s+seem\s+older/i,
    ],
    weight: 10,
    description: "Predators often probe for age information early in conversations",
    examples: ["How old are you?", "Age is just a number"]
  },
  // Location/Personal Info Requests
  {
    category: "Personal Information Requests",
    patterns: [
      /where\s+do\s+you\s+(live|go\s+to\s+school)/i,
      /what\s+school\s+(do\s+you\s+go\s+to|are\s+you\s+at)/i,
      /what'?s?\s+your\s+(address|location|phone\s+number)/i,
      /send\s+(me\s+)?your\s+(number|phone)/i,
      /when\s+are\s+your\s+(parents?|mom|dad)\s+(not\s+home|away|at\s+work)/i,
      /are\s+(you|your\s+parents?)\s+home\s+alone/i,
      /what\s+time\s+do\s+(your\s+parents?|you)\s+get\s+home/i,
    ],
    weight: 20,
    description: "Requesting personal details like location, school, or family schedules",
    examples: ["Where do you go to school?", "When are your parents at work?"]
  },
  // Photo/Video Requests
  {
    category: "Image/Video Requests",
    patterns: [
      /send\s+(me\s+)?(a\s+)?(pic|picture|photo|selfie|video)/i,
      /show\s+me\s+(what\s+you\s+look\s+like|yourself)/i,
      /turn\s+on\s+(your\s+)?(camera|webcam|cam)/i,
      /let\s+me\s+see\s+you/i,
      /take\s+(a\s+)?(pic|picture|photo)\s+(of\s+yourself|for\s+me)/i,
      /i\s+want\s+to\s+see\s+you/i,
    ],
    weight: 18,
    description: "Requests for photos or video are often used to obtain inappropriate content",
    examples: ["Send me a pic", "Let me see you"]
  },
  // Meeting Requests
  {
    category: "Meeting Requests",
    patterns: [
      /can\s+we\s+meet(\s+up)?/i,
      /let'?s?\s+meet(\s+up)?/i,
      /i\s+(want|would\s+like)\s+to\s+meet\s+you/i,
      /we\s+should\s+hang\s+out/i,
      /come\s+over/i,
      /i'?ll?\s+pick\s+you\s+up/i,
      /i\s+can\s+(come\s+to\s+you|visit\s+you)/i,
      /meet\s+me\s+(at|in)/i,
    ],
    weight: 30,
    description: "Attempts to arrange in-person meetings are extremely dangerous",
    examples: ["Let's meet up", "I can pick you up"]
  },
  // Gift/Money Offers
  {
    category: "Gifts/Money Offers",
    patterns: [
      /i'?ll?\s+(buy|get)\s+you/i,
      /i\s+(can\s+)?send\s+you\s+money/i,
      /do\s+you\s+(want|need)\s+money/i,
      /i'?ll?\s+give\s+you\s+(gifts?|presents?|money)/i,
      /i\s+have\s+(a\s+)?gift\s+for\s+you/i,
      /want\s+(a\s+)?(new\s+)?(phone|iphone|game|laptop)/i,
    ],
    weight: 15,
    description: "Offering gifts or money to build dependency and obligation",
    examples: ["I'll buy you anything you want", "I can send you money"]
  },
  // Romantic/Sexual Language
  {
    category: "Inappropriate Romantic Language",
    patterns: [
      /i\s+love\s+you/i,
      /you'?re?\s+(my\s+)?(girlfriend|boyfriend|baby|babe)/i,
      /we'?re?\s+(meant\s+to\s+be|soul\s*mates)/i,
      /you\s+make\s+me\s+(feel\s+)?special/i,
      /i\s+miss\s+you/i,
      /i\s+can'?t\s+stop\s+thinking\s+about\s+you/i,
      /you'?re?\s+so\s+(hot|sexy)/i,
    ],
    weight: 20,
    description: "Premature or inappropriate romantic/sexual language toward minors",
    examples: ["I love you", "You're so hot"]
  },
  // Testing Boundaries
  {
    category: "Boundary Testing",
    patterns: [
      /have\s+you\s+ever\s+(kissed|dated|had\s+a\s+boyfriend)/i,
      /are\s+you\s+a\s+virgin/i,
      /have\s+you\s+ever\s+(seen|touched)/i,
      /do\s+you\s+know\s+what\s+sex\s+is/i,
      /what\s+are\s+you\s+wearing/i,
      /what\s+do\s+you\s+look\s+like\s+(naked|without\s+clothes)/i,
      /send\s+(nudes|nude\s+pics)/i,
    ],
    weight: 35,
    description: "Questions designed to test a child's boundaries and vulnerabilities",
    examples: ["Have you ever kissed anyone?", "What are you wearing?"]
  },
  // Threats/Manipulation
  {
    category: "Threats & Manipulation",
    patterns: [
      /if\s+you\s+(tell|don'?t)/i,
      /no\s+one\s+will\s+believe\s+you/i,
      /you'?ll?\s+(get\s+in\s+trouble|be\s+in\s+trouble)/i,
      /i'?ll?\s+tell\s+(everyone|your\s+parents?)/i,
      /you\s+owe\s+me/i,
      /after\s+everything\s+i'?ve?\s+done/i,
      /you\s+(made|make)\s+me\s+do\s+this/i,
      /it'?s?\s+your\s+fault/i,
      /if\s+you\s+loved\s+me/i,
    ],
    weight: 30,
    description: "Using guilt, threats, or manipulation to control the child",
    examples: ["If you tell anyone, you'll be in trouble", "You owe me"]
  },
  // Platform Switching
  {
    category: "Platform Switching",
    patterns: [
      /(add\s+me\s+on|dm\s+me\s+on|text\s+me\s+on)\s+(snapchat|insta|discord|whatsapp|telegram|kik)/i,
      /what'?s?\s+your\s+(snapchat|insta|discord|number)/i,
      /let'?s?\s+(talk|chat)\s+on\s+(snapchat|insta|discord|whatsapp)/i,
      /i'?ll?\s+add\s+you\s+on/i,
      /message\s+me\s+privately/i,
    ],
    weight: 12,
    description: "Moving to platforms with disappearing messages or less oversight",
    examples: ["Add me on Snapchat", "Let's talk on Discord"]
  },
  // Urgency/Pressure
  {
    category: "Urgency & Pressure",
    patterns: [
      /you\s+have\s+to\s+decide\s+now/i,
      /this\s+is\s+your\s+(only|last)\s+chance/i,
      /hurry\s+(up)?/i,
      /quick(ly)?\s+before/i,
      /right\s+now/i,
      /don'?t\s+think\s+(about\s+it)?/i,
      /just\s+do\s+it/i,
    ],
    weight: 10,
    description: "Creating artificial urgency to prevent the child from thinking clearly",
    examples: ["You have to decide now", "Hurry before it's too late"]
  }
];

// Emergency resources by region
const EMERGENCY_RESOURCES: Record<string, EmergencyResource[]> = {
  US: [
    { name: "NCMEC CyberTipline", description: "Report child exploitation online", url: "https://www.cybertipline.org", phone: "1-800-843-5678", type: "report" },
    { name: "FBI IC3", description: "Internet Crime Complaint Center", url: "https://www.ic3.gov", type: "report" },
    { name: "National Child Abuse Hotline", description: "24/7 crisis support", phone: "1-800-422-4453", type: "help" },
    { name: "Crisis Text Line", description: "Text HOME to 741741", type: "help" },
    { name: "NetSmartz", description: "Online safety education", url: "https://www.netsmartz.org", type: "education" },
    { name: "Internet Safety 101", description: "Free educational resources", url: "https://internetsafety101.org", type: "education" },
  ],
  UK: [
    { name: "CEOP", description: "Report to Child Exploitation and Online Protection", url: "https://www.ceop.police.uk/ceop-reporting", type: "report" },
    { name: "IWF", description: "Internet Watch Foundation reporting", url: "https://www.iwf.org.uk", type: "report" },
    { name: "Childline", description: "Free helpline for children", phone: "0800 1111", type: "help" },
    { name: "NSPCC", description: "Child protection charity", url: "https://www.nspcc.org.uk", phone: "0808 800 5000", type: "help" },
    { name: "ThinkUKnow", description: "Online safety education", url: "https://www.thinkuknow.co.uk", type: "education" },
  ],
  CA: [
    { name: "Cybertip.ca", description: "Canadian tipline for online child exploitation", url: "https://www.cybertip.ca", phone: "1-866-658-9022", type: "report" },
    { name: "Kids Help Phone", description: "24/7 support for young people", phone: "1-800-668-6868", type: "help" },
    { name: "Canadian Centre for Child Protection", description: "Education and resources", url: "https://www.protectchildren.ca", type: "education" },
  ],
  AU: [
    { name: "Australian Federal Police", description: "Report online child exploitation", url: "https://www.afp.gov.au/report-crime", type: "report" },
    { name: "eSafety Commissioner", description: "Online safety reporting", url: "https://www.esafety.gov.au", type: "report" },
    { name: "Kids Helpline", description: "24/7 support", phone: "1800 55 1800", type: "help" },
    { name: "ThinkUKnow Australia", description: "Online safety education", url: "https://www.thinkuknow.org.au", type: "education" },
  ],
  GLOBAL: [
    { name: "INHOPE", description: "International hotline network", url: "https://www.inhope.org", type: "report" },
    { name: "ECPAT", description: "End child exploitation globally", url: "https://www.ecpat.org", type: "help" },
    { name: "Internet Watch Foundation", description: "Global CSAM removal", url: "https://www.iwf.org.uk", type: "report" },
  ]
};

// Free and open source tools information
export const FREE_SAFETY_TOOLS = [
  {
    name: "Microsoft PhotoDNA",
    description: "Image hash matching to detect known child exploitation material. Free for qualified organizations.",
    url: "https://www.microsoft.com/en-us/photodna",
    type: "detection",
    access: "Apply for access (free for qualifying orgs)"
  },
  {
    name: "Meta PDQ (Perceptual Hashing)",
    description: "Open source perceptual image hashing for detecting similar/modified images.",
    url: "https://github.com/facebook/ThreatExchange/tree/main/pdq",
    type: "detection",
    access: "Fully open source"
  },
  {
    name: "Google Content Safety API",
    description: "AI-powered content classification for images and videos. Free for qualifying partners.",
    url: "https://protectingchildren.google/tools-for-partners/",
    type: "detection",
    access: "Apply for access (free)"
  },
  {
    name: "Project Arachnid Shield",
    description: "Canadian Centre for Child Protection's free API for URL filtering.",
    url: "https://projectarachnid.ca/en/#shield",
    type: "filtering",
    access: "Free API"
  },
  {
    name: "IWF Image Intercept",
    description: "UK Internet Watch Foundation's free image filtering service.",
    url: "https://www.iwf.org.uk/our-technology/image-intercept/",
    type: "filtering",
    access: "Free for qualifying organizations"
  },
  {
    name: "NCMEC Hash Sharing API",
    description: "Access official CSAM hash databases for detection.",
    url: "https://report.cybertip.org/ws-hashsharing/v2/documentation/",
    type: "detection",
    access: "For electronic service providers"
  },
  {
    name: "Cloudflare CSAM Scanning",
    description: "Free CSAM scanning for Cloudflare users.",
    url: "https://blog.cloudflare.com/the-csam-scanning-tool/",
    type: "detection",
    access: "Free (Cloudflare customers)"
  },
  {
    name: "Thorn Safer (Detection Only)",
    description: "Hash matching against known CSAM databases. Demo available.",
    url: "https://get.safer.io/csam-detection-tool-for-child-safety",
    type: "detection",
    access: "Contact for pricing"
  }
];

export function scanConversation(text: string, region: string = "US"): ScanResult {
  const flags: DetectedFlag[] = [];
  let totalScore = 0;

  // Normalize text for better matching
  const normalizedText = text.toLowerCase();
  const lines = text.split(/[\n\r]+/);

  // Check each grooming pattern
  for (const pattern of GROOMING_PATTERNS) {
    for (const regex of pattern.patterns) {
      const matches = text.match(new RegExp(regex, 'gi'));
      if (matches) {
        for (const match of matches) {
          // Find the line containing this match for context
          const matchingLine = lines.find(line => 
            line.toLowerCase().includes(match.toLowerCase())
          ) || match;

          flags.push({
            category: pattern.category,
            matchedText: matchingLine.trim().substring(0, 100),
            explanation: pattern.description,
            severity: getSeverity(pattern.weight)
          });
          totalScore += pattern.weight;
        }
      }
    }
  }

  // Cap score at 100
  const riskScore = Math.min(100, totalScore);
  const riskLevel = getRiskLevel(riskScore);

  // Get region-specific resources
  const resources = [
    ...(EMERGENCY_RESOURCES[region] || []),
    ...EMERGENCY_RESOURCES.GLOBAL
  ];

  // Generate recommendations based on risk level
  const recommendations = generateRecommendations(riskLevel, flags);

  return {
    riskLevel,
    riskScore,
    flags: deduplicateFlags(flags),
    summary: generateSummary(riskLevel, flags),
    recommendations,
    resources: resources.slice(0, 6)
  };
}

function getSeverity(weight: number): "low" | "medium" | "high" | "critical" {
  if (weight >= 30) return "critical";
  if (weight >= 20) return "high";
  if (weight >= 15) return "medium";
  return "low";
}

function getRiskLevel(score: number): "safe" | "caution" | "warning" | "danger" {
  if (score >= 50) return "danger";
  if (score >= 30) return "warning";
  if (score >= 15) return "caution";
  return "safe";
}

function deduplicateFlags(flags: DetectedFlag[]): DetectedFlag[] {
  const seen = new Set<string>();
  return flags.filter(flag => {
    const key = `${flag.category}-${flag.matchedText}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function generateSummary(riskLevel: string, flags: DetectedFlag[]): string {
  if (riskLevel === "safe") {
    return "No concerning patterns detected. This conversation appears safe, but always encourage open communication with trusted adults.";
  }
  
  if (riskLevel === "caution") {
    return `Some patterns worth monitoring were detected. ${flags.length} potential warning sign(s) found. Consider discussing internet safety with your child.`;
  }
  
  if (riskLevel === "warning") {
    return `Multiple concerning patterns detected. ${flags.length} warning sign(s) identified including ${flags[0]?.category}. We strongly recommend talking to your child and considering reporting if patterns persist.`;
  }
  
  // danger
  const categories = Array.from(new Set(flags.map(f => f.category)));
  return `URGENT: This conversation shows serious red flags including ${categories.slice(0, 3).join(", ")}. We recommend immediate action - talk to your child, preserve evidence, and consider reporting to authorities.`;
}

function generateRecommendations(riskLevel: string, flags: DetectedFlag[]): string[] {
  const baseRecommendations = [
    "Keep communication open - let your child know they can always talk to you",
    "Remind your child that it's never their fault if an adult makes them uncomfortable"
  ];

  if (riskLevel === "safe") {
    return [
      ...baseRecommendations,
      "Continue monitoring online activities in a supportive, non-invasive way",
      "Teach your child about recognizing warning signs in online interactions"
    ];
  }

  if (riskLevel === "caution") {
    return [
      "Have a calm conversation with your child about this interaction",
      "Ask open-ended questions about who they talk to online",
      ...baseRecommendations,
      "Consider reviewing privacy settings on their accounts"
    ];
  }

  if (riskLevel === "warning") {
    return [
      "Talk to your child immediately in a calm, supportive manner",
      "Document and save this conversation as evidence",
      "Review all social media and messaging accounts",
      "Consider reporting to the platform and local authorities",
      "Do not alert the potential predator that you're aware",
      ...baseRecommendations
    ];
  }

  // danger
  return [
    "IMMEDIATE ACTION: Have a supportive conversation with your child now",
    "PRESERVE EVIDENCE: Screenshot or save all messages and account information",
    "REPORT: File a report with NCMEC CyberTipline (see resources below)",
    "CONTACT AUTHORITIES: Consider contacting local law enforcement",
    "BLOCK: Help your child block the person, but only after preserving evidence",
    "SEEK SUPPORT: Contact a crisis helpline for guidance",
    "Do NOT confront the person online - let authorities handle it",
    "Reassure your child that they are not in trouble and did nothing wrong"
  ];
}

// Export for API use
export const getEmergencyResources = (region: string): EmergencyResource[] => {
  return [
    ...(EMERGENCY_RESOURCES[region] || []),
    ...EMERGENCY_RESOURCES.GLOBAL
  ];
};

export const getAllEmergencyResources = (): Record<string, EmergencyResource[]> => {
  return EMERGENCY_RESOURCES;
};
