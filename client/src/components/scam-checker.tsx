import { useState } from "react";
import { trackToolUsage } from "@/lib/analytics";
import { SignupEncouragementBanner } from "@/components/signup-encouragement-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  ExternalLink,
  Link as LinkIcon,
  Shield,
  Eye,
  Zap,
  FileText,
  Lock,
  Bot,
  Loader2
} from "lucide-react";

type ThreatCategory = {
  name: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  examples: string[];
};

type DetectedThreat = {
  category: string;
  indicator: string;
  severity: "low" | "medium" | "high" | "critical";
  explanation: string;
};

type UrgencyAnalysis = {
  score: number;
  level: string;
  triggers: string[];
};

type EmailHeaderAnalysis = {
  overallRisk: "safe" | "low" | "medium" | "high" | "critical";
  findings: {
    category: string;
    status: "pass" | "fail" | "warning" | "info";
    detail: string;
    explanation: string;
  }[];
  recommendations: string[];
  parsedHeaders: {
    from?: string;
    replyTo?: string;
    returnPath?: string;
    receivedChain: string[];
    spf?: string;
    dkim?: string;
    dmarc?: string;
    xMailer?: string;
    xOriginatingIP?: string;
    contentType?: string;
    mimeVersion?: string;
  };
};

type AnalysisResult = {
  overallRisk: "safe" | "low" | "medium" | "high" | "critical";
  confidenceScore: number;
  title: string;
  summary: string;
  threats: DetectedThreat[];
  urls: URLAnalysis[];
  recommendations: string[];
  educationalTips: string[];
  urgencyAnalysis?: UrgencyAnalysis;
};

type URLAnalysis = {
  url: string;
  isSuspicious: boolean;
  reasons: string[];
};

type URLReputationResult = {
  url: string;
  threatLevel: 'safe' | 'suspicious' | 'dangerous' | 'unknown';
  phishTank: {
    checked: boolean;
    isPhishing: boolean | null;
    verified?: boolean;
    detailPage?: string | null;
    error?: string;
  };
  urlhaus: {
    checked: boolean;
    isMalware: boolean | null;
    threat?: string | null;
    tags?: string[];
    error?: string;
  };
  checkedAt: string;
};

type SSLCheckResult = {
  success: boolean;
  url: string;
  checked: boolean;
  valid: boolean;
  issuer?: string;
  daysUntilExpiry?: number;
  isExpired: boolean;
  isEV: boolean;
  isSelfSigned: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  error?: string;
};

const threatPatterns: { pattern: RegExp; category: string; indicator: string; severity: "low" | "medium" | "high" | "critical"; explanation: string }[] = [
  // Urgency & Pressure Tactics
  { pattern: /\b(urgent|immediately|right now|act fast|don't wait|hurry|expires? today|limited time|only \d+ left)\b/i, category: "Pressure Tactics", indicator: "Urgency language detected", severity: "medium", explanation: "Scammers create artificial urgency to prevent you from thinking critically. Legitimate organizations give you time to make decisions." },
  { pattern: /\b(final warning|last chance|account will be (closed|suspended|terminated)|action required immediately)\b/i, category: "Pressure Tactics", indicator: "Threatening deadline", severity: "high", explanation: "Fear-based deadlines are a classic manipulation technique. Real companies don't threaten immediate account closure via unsolicited messages." },
  
  // Prize & Lottery Scams
  { pattern: /\b(you('ve| have)? won|winner|lottery|sweepstakes|prize|reward|jackpot|million(s)? dollars?|grand prize)\b/i, category: "Lottery/Prize Scam", indicator: "Prize or lottery claim", severity: "high", explanation: "You cannot win a lottery you didn't enter. Legitimate lotteries never contact winners via email or text asking for fees." },
  { pattern: /\b(claim (your|the) (prize|reward|winnings)|collect your|redeem (your )?prize)\b/i, category: "Lottery/Prize Scam", indicator: "Prize claim language", severity: "high", explanation: "Requests to 'claim' prizes are almost always scams. Real winnings are processed directly, not through email links." },
  
  // Credential Phishing
  { pattern: /\b(verify (your )?(account|identity|email|payment)|confirm (your )?(account|identity|password|payment))\b/i, category: "Credential Phishing", indicator: "Verification request", severity: "critical", explanation: "Legitimate companies never ask you to verify credentials via email links. Always go directly to the official website." },
  { pattern: /\b(password|ssn|social security|bank account|credit card|routing number|pin code)\b/i, category: "Credential Phishing", indicator: "Sensitive data request", severity: "critical", explanation: "No legitimate organization asks for passwords or SSN via email. This is a direct attempt to steal your identity." },
  { pattern: /\b(update (your )?(billing|payment|card)|payment (method )?failed|card (on file )?(expired|declined))\b/i, category: "Credential Phishing", indicator: "Payment update request", severity: "high", explanation: "Payment update requests via email are a common phishing tactic. Log into your account directly to check payment status." },
  
  // Financial Fraud
  { pattern: /\b(wire transfer|western union|moneygram|gift card|itunes card|google play card|bitcoin|crypto(currency)?|zelle|venmo|cashapp)\b/i, category: "Financial Fraud", indicator: "Unusual payment method", severity: "critical", explanation: "Requests for gift cards, wire transfers, or crypto are major red flags. These payment methods are untraceable and preferred by scammers." },
  { pattern: /\b(investment opportunity|guaranteed returns?|double your money|risk[- ]?free|passive income|financial freedom)\b/i, category: "Investment Scam", indicator: "Investment scheme language", severity: "high", explanation: "Guaranteed returns and risk-free investments don't exist. These are hallmarks of Ponzi schemes and investment fraud." },
  { pattern: /\b(make money (fast|quick|from home)|work from home|easy money|earn \$?\d+k?\+? (per|a) (week|month|day))\b/i, category: "Employment Scam", indicator: "Get-rich-quick promises", severity: "medium", explanation: "Unrealistic income promises are used to lure victims. Legitimate jobs have clear descriptions and realistic compensation." },
  
  // Impersonation Scams
  { pattern: /\b(irs|internal revenue|tax refund|government grant|social security (administration)?|medicare|medicaid)\b/i, category: "Government Impersonation", indicator: "Government agency mention", severity: "high", explanation: "Government agencies don't initiate contact via email/text for sensitive matters. They use official mail." },
  { pattern: /\b(microsoft|apple|amazon|google|paypal|netflix|facebook|instagram|tiktok).{0,20}(support|security|team|department|help|service)/i, category: "Tech Support Scam", indicator: "Company impersonation", severity: "high", explanation: "Tech companies don't proactively contact users about problems. Always contact support through official channels." },
  { pattern: /\b(ceo|cfo|president|director).{0,30}(urgent|wire|transfer|payment|invoice)/i, category: "Business Email Compromise", indicator: "Executive impersonation", severity: "critical", explanation: "CEO fraud is extremely common. Always verify unusual requests from executives through a separate communication channel." },
  
  // Romance & Relationship Scams
  { pattern: /\b(i love you|my (dear|love|darling)|soul ?mate|meant to be|fallen in love|true love)\b/i, category: "Romance Scam", indicator: "Romantic language from stranger", severity: "medium", explanation: "Romance scammers build emotional connections quickly to extract money. Be wary of people professing love before meeting in person." },
  { pattern: /\b(military|deployed|oil rig|overseas|stuck in|need money to (come home|visit|travel))\b/i, category: "Romance Scam", indicator: "Classic romance scam story", severity: "high", explanation: "These are textbook romance scam scenarios. Military and overseas workers are commonly impersonated." },
  
  // Malicious Links
  { pattern: /\b(click (here|this|below)|follow (this )?link|open (this )?attachment|download (this )?file)\b/i, category: "Malicious Link", indicator: "Click-bait language", severity: "medium", explanation: "Urgent requests to click links are suspicious. Hover over links to see the real destination before clicking." },
  { pattern: /bit\.ly\/|tinyurl\.com|\/\/t\.co\/|goo\.gl\/|ow\.ly\/|is\.gd\/|buff\.ly\/|adf\.ly\/|shorturl\.at|v\.gd\/|rb\.gy\/|cutt\.ly\/|trib\.al\//i, category: "Malicious Link", indicator: "URL shortener detected", severity: "medium", explanation: "URL shorteners hide the true destination. Legitimate businesses use their own domains in official communications." },
  
  // Advance Fee Fraud
  { pattern: /\b(processing fee|handling fee|shipping fee|insurance fee|customs fee|release fee|tax fee)\b/i, category: "Advance Fee Fraud", indicator: "Upfront fee request", severity: "high", explanation: "Requests for fees to release prizes, inheritances, or packages are classic advance-fee fraud. You should never pay to receive money." },
  { pattern: /\b(nigerian|prince|inheritance|barrister|next of kin|beneficiary|estate|deceased)\b/i, category: "Advance Fee Fraud", indicator: "419 scam indicators", severity: "critical", explanation: "This is a classic advance-fee (419) scam pattern. No legitimate inheritance comes through unsolicited emails." },
  
  // Account Security Threats
  { pattern: /\b(account (has been |is )?(hacked|compromised|breached|suspended|locked|frozen))\b/i, category: "Account Compromise Scam", indicator: "Account threat claim", severity: "high", explanation: "Claims that your account is compromised are often lies to steal your credentials. Check directly with the company." },
  { pattern: /\b(unusual (activity|login|sign[- ]?in)|unrecognized device|security alert)\b/i, category: "Account Compromise Scam", indicator: "Security alert language", severity: "medium", explanation: "While sometimes legitimate, these alerts are often spoofed. Always navigate directly to the service to verify." },
];

const suspiciousUrlPatterns = [
  { pattern: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, reason: "IP address instead of domain name" },
  { pattern: /@/, reason: "@ symbol in URL (credential injection)" },
  { pattern: /paypal|amazon|apple|google|microsoft|facebook|netflix|bank/i, reason: "Mentions major brand but may be fake" },
  { pattern: /\.(tk|ml|ga|cf|gq|xyz|top|club|online|site|website|buzz|work|link|click|info|biz|pw|cc|ws)$/i, reason: "Free or suspicious TLD" },
  { pattern: /-login|-verify|-secure|-account|-update|-confirm/i, reason: "Suspicious subdomain/path pattern" },
  { pattern: /bit\.ly\/|tinyurl\.com|\/\/t\.co\/|goo\.gl\/|ow\.ly\/|is\.gd\/|buff\.ly\/|adf\.ly\/|shorturl\.at|v\.gd\/|rb\.gy\/|cutt\.ly\/|trib\.al\//i, reason: "URL shortener hiding destination" },
  { pattern: /\.(exe|zip|rar|scr|bat|cmd|msi|jar|vbs|js)$/i, reason: "Potentially malicious file download" },
];

const legitDomains = [
  /^(https?:\/\/)?(www\.)?(google|microsoft|apple|amazon|facebook|twitter|linkedin|instagram|youtube|netflix|paypal|github|dropbox|zoom|slack)\.com/i,
  /^(https?:\/\/)?(www\.)?(gmail|outlook|hotmail|live|yahoo|aol|icloud|protonmail|proton)\.com/i,
  /^(https?:\/\/)?(www\.)?[a-z0-9-]+\.(gov|edu|mil)/i,
  /^(https?:\/\/)?(www\.)?getcyberright\.(com|org|net)/i,
  /^(https?:\/\/)?(mail\.)?google\.com/i,
  /^(https?:\/\/)?(www\.)?yahoo\.(com|co\.[a-z]+)/i,
];

// Typosquatting detection - EXPANDED brand misspellings (200+ brands)
const typosquattingPatterns: { brand: string; variants: RegExp[] }[] = [
  // Major Tech Companies
  { brand: "PayPal", variants: [/paypa[l1]|paypai|paypol|payp[a@]l|p[a@]ypal|paaypal|paypall/i] },
  { brand: "Amazon", variants: [/amaz[o0]n|amazom|arnazon|amzon|amazn|amaazon|amazoon|amazonn/i] },
  { brand: "Apple", variants: [/app[l1]e|appie|aple|applle|aaple|appel|apple[0-9]/i] },
  { brand: "Google", variants: [/g[o0][o0]gle|googel|gogle|googlle|g00gle|googie|gooogle/i] },
  { brand: "Microsoft", variants: [/micr[o0]s[o0]ft|mircosoft|microsft|micosoft|micros0ft|microsofit/i] },
  { brand: "Netflix", variants: [/netf[l1]ix|netfiix|netfix|nettflix|netfl1x|netflex|netflx/i] },
  { brand: "Facebook", variants: [/faceb[o0][o0]k|facebok|facbook|faceboook|fac3book|facebk/i] },
  { brand: "Instagram", variants: [/[i1]nstagram|instagran|instgram|instagrem|1nstagram|instagarm/i] },
  { brand: "Twitter/X", variants: [/tw[i1]tter|twiter|twtter|twittter|xtwitter/i] },
  { brand: "LinkedIn", variants: [/l[i1]nked[i1]n|linkedn|linkdin|linkedinn|linkdln/i] },
  { brand: "YouTube", variants: [/y[o0]utube|youtub|yuotube|youutube|youtbe/i] },
  { brand: "WhatsApp", variants: [/whatsap|watsapp|whatsaap|whatapp|whattsapp/i] },
  { brand: "Snapchat", variants: [/snapchat|snapcht|snpchat|snapchatt|snatchat/i] },
  { brand: "TikTok", variants: [/t[i1]kt[o0]k|tiktoc|ticktok|tictok|tiktoik/i] },
  { brand: "Spotify", variants: [/sp[o0]t[i1]fy|spotfy|spotiffy|spotifiy|spootify/i] },
  { brand: "Discord", variants: [/d[i1]sc[o0]rd|discrod|discrd|dicord|discoord/i] },
  { brand: "Zoom", variants: [/z[o0][o0]m|zom|zooom|zomm|zo0m/i] },
  { brand: "Slack", variants: [/s[l1]ack|slak|slaack|slakc|slackk/i] },
  { brand: "Dropbox", variants: [/dr[o0]pb[o0]x|dropbx|drpbox|dropboxx|drobox/i] },
  { brand: "GitHub", variants: [/g[i1]thub|githb|githubb|gihub|gihtub/i] },
  { brand: "Adobe", variants: [/ad[o0]be|adob|adobee|adoba|adope/i] },
  { brand: "Salesforce", variants: [/salesf[o0]rce|salesfore|salesforc|saleforce|salesforse/i] },
  { brand: "Oracle", variants: [/[o0]racle|oracl|oralce|oraclee|orecle/i] },
  { brand: "Cisco", variants: [/c[i1]sc[o0]|cisoo|csco|ciscoo|sisco/i] },
  { brand: "Intel", variants: [/[i1]nte[l1]|intell|intl|inteel|intle/i] },
  { brand: "Samsung", variants: [/samsun[g9]|samsumg|samsungg|sumsang|samung/i] },
  { brand: "Sony", variants: [/s[o0]ny|sonny|soney|soony|sonii/i] },
  { brand: "eBay", variants: [/eb[a@]y|ebey|ebaay|ebayy|e-bay/i] },
  { brand: "Alibaba", variants: [/al[i1]baba|alibab|alibbaba|alibabba|allibaba/i] },
  
  // Major Banks & Financial
  { brand: "Bank of America", variants: [/bankofamer[i1]ca|bank0famerica|bankofamerica\d|bofa|bofamerica/i] },
  { brand: "Chase", variants: [/chas[e3]bank|chase\d|chasecom|jpmchase|chasee/i] },
  { brand: "Wells Fargo", variants: [/we[l1][l1]sfargo|wellsfarg0|weilsfargo|wellsfago|wellfarog/i] },
  { brand: "Citibank", variants: [/c[i1]t[i1]bank|citibnk|citibamk|citiibank|citubank/i] },
  { brand: "Capital One", variants: [/cap[i1]tal[o0]ne|capitalone\d|capitalon|capone|captial/i] },
  { brand: "US Bank", variants: [/usbank\d|us-bank|usbankk|usbanc|u\.s\.bank/i] },
  { brand: "PNC Bank", variants: [/pncbank|pnc\d|pncbamk|pncbnk|pncbanc/i] },
  { brand: "TD Bank", variants: [/tdb[a@]nk|tdbank\d|td-bank|tdbankk|tdbamk/i] },
  { brand: "HSBC", variants: [/hsb[c0]|hsbcc|hsbcbank|hbsc|hsbs/i] },
  { brand: "Barclays", variants: [/barc[l1]ays|barclay|barclayss|barcleys|barclas/i] },
  { brand: "Santander", variants: [/santand[e3]r|santandr|santanderr|santandar|santandeer/i] },
  { brand: "Goldman Sachs", variants: [/g[o0]ldmansachs|goldmansach|goldmannsachs|goldmansax/i] },
  { brand: "Morgan Stanley", variants: [/m[o0]rganstanley|morganstanly|morganstnley|morganstanely/i] },
  { brand: "American Express", variants: [/amer[i1]canexpress|amex\d|americanexpres|amercanexpress/i] },
  { brand: "Discover", variants: [/d[i1]sc[o0]ver|discovr|discoveer|disccover|dicover/i] },
  { brand: "Venmo", variants: [/venm[o0]|venmoo|venmmo|vemo|venno/i] },
  { brand: "CashApp", variants: [/cashap|cash-app|cashappp|cashspp|cashaap/i] },
  { brand: "Zelle", variants: [/ze[l1][l1]e|zele|zellee|zella|zel1e/i] },
  { brand: "Coinbase", variants: [/c[o0][i1]nbase|coinbas|coinbasee|coibase|coinnbase/i] },
  { brand: "Binance", variants: [/b[i1]nance|binanc|binancee|binanse|binnance/i] },
  { brand: "Robinhood", variants: [/r[o0]b[i1]nhood|robinhod|robinhoodd|robinood|robinhhood/i] },
  { brand: "Fidelity", variants: [/f[i1]del[i1]ty|fidelty|fidelitty|fidelidy|fideltiy/i] },
  { brand: "Charles Schwab", variants: [/charlesschwab|schwab\d|charleschwab|shwab/i] },
  { brand: "E*TRADE", variants: [/etrade|e-trade\d|etraed|ettrade/i] },
  { brand: "Vanguard", variants: [/vanguard\d|vangard|vangarud|vanguaard/i] },
  
  // Retail & E-commerce
  { brand: "Walmart", variants: [/wa[l1]mart|walmrt|walmaart|walmart\d|wlamart|wamart/i] },
  { brand: "Target", variants: [/t[a@]rget|targt|targett|targer|taarget/i] },
  { brand: "Costco", variants: [/c[o0]stc[o0]|costc|costcco|costko|cosco/i] },
  { brand: "Best Buy", variants: [/bestbuy|best-buy\d|bestbu|bestbyy|besbuy/i] },
  { brand: "Home Depot", variants: [/homedep[o0]t|home-depot|homedepo|homeddepot/i] },
  { brand: "Lowe's", variants: [/l[o0]wes|lowess|lowees|lowse|lows/i] },
  { brand: "Macy's", variants: [/m[a@]cys|macyss|macis|maccys|maceys/i] },
  { brand: "Nordstrom", variants: [/n[o0]rdstr[o0]m|nordstom|nordstromm|nortdstrom/i] },
  { brand: "Kohl's", variants: [/k[o0]h[l1]s|kohls\d|kohlss|kohles|khols/i] },
  { brand: "Sephora", variants: [/seph[o0]ra|sephor|sephoraa|sefora|sephorra/i] },
  { brand: "Ulta", variants: [/u[l1]ta|ultaa|ultta|ulat|ulto/i] },
  { brand: "Nike", variants: [/n[i1]ke|nikee|nieke|nikke|nik3/i] },
  { brand: "Adidas", variants: [/ad[i1]das|addidas|adidass|adiidas|adidis/i] },
  { brand: "Lululemon", variants: [/lu[l1]u[l1]em[o0]n|lulemon|lululemonn|lululemn/i] },
  { brand: "Etsy", variants: [/etsy\d|estsy|etssy|etsi|esty/i] },
  { brand: "Wayfair", variants: [/wayfa[i1]r|wayfar|wayfairr|wayfaie|wafair/i] },
  { brand: "Chewy", variants: [/chewy\d|chewy|chewwy|chewey|chewe/i] },
  
  // Streaming & Entertainment
  { brand: "Disney+", variants: [/d[i1]sney|disnye|disneey|diseny|dinsey/i] },
  { brand: "HBO Max", variants: [/hb[o0]max|hbomax\d|hbomxa|hbomaxx|hbmax/i] },
  { brand: "Hulu", variants: [/hu[l1]u|hullu|huluu|hlu|huulu/i] },
  { brand: "Paramount+", variants: [/param[o0]unt|paramont|paramountt|paramout|parramount/i] },
  { brand: "Peacock", variants: [/peacoc[k9]|peacok|peacocck|peacokc|peackock/i] },
  { brand: "Twitch", variants: [/tw[i1]tch|twitc|twitcch|twich|twicth/i] },
  { brand: "Steam", variants: [/st[e3]am|steem|steaam|stean|sream/i] },
  { brand: "Epic Games", variants: [/ep[i1]cgames|epicgams|epicgamess|epicgame|epigames/i] },
  { brand: "PlayStation", variants: [/playst[a@]t[i1][o0]n|playstaion|playstaton|playsation/i] },
  { brand: "Xbox", variants: [/xb[o0]x|xboxx|xbbox|xobx|xbox\d/i] },
  { brand: "Nintendo", variants: [/n[i1]ntend[o0]|ninteno|nintendoo|nitendo|nintedo/i] },
  
  // Utilities & Telecom
  { brand: "AT&T", variants: [/[a@]t&t|att\d|atandt|attt|a\.t\.t/i] },
  { brand: "Verizon", variants: [/ver[i1]z[o0]n|verizonn|verizon\d|verison|verzion/i] },
  { brand: "T-Mobile", variants: [/t-m[o0]b[i1][l1]e|tmobil|t-mobilee|tmobille|t-moble/i] },
  { brand: "Comcast", variants: [/c[o0]mcast|comcas|comcastt|comacast|comkast/i] },
  { brand: "Spectrum", variants: [/spectr[u0]m|spectru|spectrumm|spektrum|sectrum/i] },
  { brand: "Cox", variants: [/c[o0]x\d|coxx|cxo|coox|cox\./i] },
  { brand: "Xfinity", variants: [/xf[i1]n[i1]ty|xfinty|xfinityy|xfinnity|xfintiy/i] },
  { brand: "Sprint", variants: [/spr[i1]nt|sprintt|srpint|srint|spirnt/i] },
  { brand: "Cricket", variants: [/cr[i1]cket|cricke|crickeet|crcket|criket/i] },
  { brand: "Metro PCS", variants: [/metr[o0]pcs|metropc|metropcss|metrpcs|metorpcs/i] },
  
  // Travel & Transportation
  { brand: "United Airlines", variants: [/un[i1]ted[a@][i1]r|unitedairlines\d|unitedair|unitde/i] },
  { brand: "Delta", variants: [/de[l1]t[a@]|deltaa|dleta|delat|delta\d/i] },
  { brand: "American Airlines", variants: [/amer[i1]can[a@][i1]r|americanairlines\d|aaairlines/i] },
  { brand: "Southwest", variants: [/s[o0]uthwest|southwes|southwestt|soutwest|souhtwest/i] },
  { brand: "JetBlue", variants: [/jetb[l1]ue|jetblu|jetbluee|jeblue|jtblue/i] },
  { brand: "Uber", variants: [/ub[e3]r|uberr|ubr|ueber|uber\d/i] },
  { brand: "Lyft", variants: [/[l1]yft|lyf|lyftt|lyift|llft/i] },
  { brand: "DoorDash", variants: [/d[o0][o0]rdash|doordas|doordassh|doordah|dordash/i] },
  { brand: "Grubhub", variants: [/grubhub\d|grubhu|grubhubb|gruhbub|grubhb/i] },
  { brand: "Instacart", variants: [/[i1]nstacart|instacrt|instacartt|instcart|instacrat/i] },
  { brand: "Airbnb", variants: [/a[i1]rbnb|airbnbb|airnbn|airbb|airbnd/i] },
  { brand: "Booking.com", variants: [/b[o0][o0]k[i1]ng|bookng|bookingg|booikng|bokking/i] },
  { brand: "Expedia", variants: [/exped[i1]a|expeda|expediaa|expedai|expidea/i] },
  { brand: "Hotels.com", variants: [/h[o0]te[l1]s|hotelss|hotles|hotes|hotells/i] },
  { brand: "USPS", variants: [/usps\d|u\.s\.p\.s|uspss|ussp|uspa/i] },
  { brand: "FedEx", variants: [/fed[e3]x|fedx|fedxe|fedexx|feddex/i] },
  { brand: "UPS", variants: [/ups\d|u\.p\.s|upss|usp|upps/i] },
  { brand: "DHL", variants: [/dh[l1]|dhll|dlh|dhl\d/i] },
  
  // Healthcare & Pharma
  { brand: "CVS", variants: [/cvs\d|c\.v\.s|cvss|csv|cvvs/i] },
  { brand: "Walgreens", variants: [/wa[l1]greens|walgrees|walgreen|walrgeens|wlagreens/i] },
  { brand: "UnitedHealthcare", variants: [/un[i1]tedhealth|unitedhealtcare|unitedhc|uhealthcare/i] },
  { brand: "Cigna", variants: [/c[i1]gna|cigana|cignaa|cigma|cinga/i] },
  { brand: "Aetna", variants: [/[a@]etna|aetana|aetnaa|aenta|aetne/i] },
  { brand: "Blue Cross", variants: [/b[l1]uecross|bluecros|bluecorsss|bluecorss|bcbs/i] },
  { brand: "Kaiser", variants: [/ka[i1]ser|kaser|kaiserr|kasier|kiaiser/i] },
  { brand: "Humana", variants: [/hum[a@]na|humaan|huamna|humanna|humna/i] },
  { brand: "Medicare", variants: [/med[i1]care|medicre|medicaree|medicar|medicrae/i] },
  { brand: "Medicaid", variants: [/med[i1]caid|medicai|medicaidd|medcaid|mediciad/i] },
  
  // Food & Beverage
  { brand: "McDonald's", variants: [/mcdon[a@][l1]ds|mcdonalds\d|mcdoanlds|mcdonlads|mcdnlds/i] },
  { brand: "Starbucks", variants: [/st[a@]rbucks|starbuck|starbuckss|strabucks|starbuks/i] },
  { brand: "Chipotle", variants: [/ch[i1]p[o0]t[l1]e|chipotel|chipotlee|chipotl|chipotel/i] },
  { brand: "Domino's", variants: [/d[o0]m[i1]n[o0]s|dominos\d|dominoss|dominso|domnios/i] },
  { brand: "Pizza Hut", variants: [/p[i1]zzahut|pizzahut\d|pizahut|pizzahu|pizzzahut/i] },
  { brand: "Dunkin", variants: [/dunk[i1]n|dunkin\d|dunkinn|dunkin|dunkn/i] },
  { brand: "Taco Bell", variants: [/t[a@]c[o0]be[l1][l1]|tacobell\d|tacobel|tacbell|tacobll/i] },
  { brand: "Wendy's", variants: [/wendy[s']|wendys\d|wendis|wendyss|wendeys/i] },
  { brand: "Burger King", variants: [/burgerking|bk\d|burgerking\d|brgerking|burgerkingg/i] },
  { brand: "Subway", variants: [/subway\d|subwa|subwayy|subay|subwey/i] },
  
  // Crypto & Web3
  { brand: "Kraken", variants: [/kr[a@]ken|kraken\d|krakenn|krken|krakne/i] },
  { brand: "Gemini", variants: [/gem[i1]n[i1]|gemini\d|geminii|gemni|gemmini/i] },
  { brand: "Crypto.com", variants: [/crypt[o0]com|crypto\.com\d|cryptoocm|crypot/i] },
  { brand: "MetaMask", variants: [/met[a@]mask|metamsk|metamaskk|metamak|metamsak/i] },
  { brand: "Ledger", variants: [/[l1]edger|ledgerr|legder|ledgr|ledge/i] },
  { brand: "OpenSea", variants: [/[o0]pensea|opensea\d|opense|opnsea|opensae/i] },
  
  // Insurance
  { brand: "State Farm", variants: [/st[a@]tefarm|statefarm\d|statefrm|statefram|sttaefarm/i] },
  { brand: "Geico", variants: [/ge[i1]c[o0]|geicoo|geico\d|geioc|geco/i] },
  { brand: "Progressive", variants: [/pr[o0]gressive|progressiv|progressivee|progresvie/i] },
  { brand: "Allstate", variants: [/[a@][l1][l1]state|allstat|allstatee|alstate|allstae/i] },
  { brand: "Liberty Mutual", variants: [/l[i1]bertymutual|liberymutual|libertymutua|libetry/i] },
  { brand: "Farmers", variants: [/farmers\d|farmerss|farmrs|framers|farmres/i] },
  { brand: "Nationwide", variants: [/nat[i1][o0]nwide|nationwid|nationwidee|natonwide/i] },
  { brand: "USAA", variants: [/usaa\d|u\.s\.a\.a|usaaa|usa\d/i] },
];

// Organization impersonation patterns (Government, Healthcare, Utilities)
const organizationImpersonationPatterns: { pattern: RegExp; category: string; indicator: string; severity: "high" | "critical" }[] = [
  // Government Agencies
  { pattern: /\b(internal\s*revenue\s*service|irs)\b.{0,50}(refund|owe|payment|audit|verify)/i, category: "IRS Impersonation", indicator: "IRS tax scam language", severity: "critical" },
  { pattern: /\b(social\s*security\s*(administration|office)?|ssa)\b.{0,50}(suspend|benefit|verify|fraud)/i, category: "SSA Impersonation", indicator: "Social Security scam", severity: "critical" },
  { pattern: /\b(department\s*of\s*(homeland\s*security|justice|treasury)|dhs|doj)\b.{0,50}(warrant|arrest|investigation)/i, category: "Federal Agency Impersonation", indicator: "Federal agency threat", severity: "critical" },
  { pattern: /\b(fbi|federal\s*bureau)\b.{0,50}(warrant|arrest|investigation|illegal)/i, category: "FBI Impersonation", indicator: "FBI threat scam", severity: "critical" },
  { pattern: /\b(customs\s*(and\s*border)?|cbp|ice)\b.{0,50}(package|shipment|held|seized)/i, category: "Customs Impersonation", indicator: "Customs package scam", severity: "high" },
  { pattern: /\b(immigration|uscis|visa)\b.{0,50}(expired|status|verify|revoked)/i, category: "Immigration Impersonation", indicator: "Immigration status scam", severity: "critical" },
  { pattern: /\b(small\s*business\s*administration|sba)\b.{0,50}(loan|grant|approval|application)/i, category: "SBA Impersonation", indicator: "SBA loan scam", severity: "high" },
  { pattern: /\b(federal\s*trade\s*commission|ftc)\b.{0,50}(refund|settlement|claim)/i, category: "FTC Impersonation", indicator: "FTC refund scam", severity: "high" },
  
  // Healthcare & Medicare
  { pattern: /\b(medicare|medicaid)\b.{0,50}(new\s*card|verify|benefit|expire|enrollment)/i, category: "Medicare Impersonation", indicator: "Medicare card scam", severity: "critical" },
  { pattern: /\b(health\s*(and\s*human\s*services|department)|hhs)\b.{0,50}(benefit|payment|verify)/i, category: "HHS Impersonation", indicator: "Healthcare scam", severity: "high" },
  { pattern: /\b(affordable\s*care\s*act|obamacare|healthcare\.gov)\b.{0,50}(enroll|deadline|penalty)/i, category: "ACA Impersonation", indicator: "Healthcare enrollment scam", severity: "high" },
  { pattern: /\b(covid|vaccine|booster)\b.{0,50}(free|government|required|verify|appointment)/i, category: "COVID Scam", indicator: "COVID vaccine/relief scam", severity: "high" },
  { pattern: /\b(drug|prescription)\b.{0,50}(discount|free|medicare|covered|card)/i, category: "Prescription Scam", indicator: "Prescription drug scam", severity: "high" },
  
  // Utility Companies
  { pattern: /\b(electric|power|utility)\s*(company|service|provider)?\b.{0,50}(disconnect|payment\s*due|past\s*due|shut\s*off)/i, category: "Utility Impersonation", indicator: "Electric bill scam", severity: "high" },
  { pattern: /\b(gas|natural\s*gas)\s*(company|service)?\b.{0,50}(disconnect|service\s*interruption|payment)/i, category: "Utility Impersonation", indicator: "Gas bill scam", severity: "high" },
  { pattern: /\b(water|sewer)\s*(department|utility|company)?\b.{0,50}(disconnect|payment|service)/i, category: "Utility Impersonation", indicator: "Water bill scam", severity: "high" },
  { pattern: /\bpge|edison|duke\s*energy|dominion|xcel\b.{0,50}(disconnect|payment|overdue)/i, category: "Utility Impersonation", indicator: "Specific utility company scam", severity: "high" },
  
  // Tech Support
  { pattern: /\b(microsoft|windows|apple|mac)\s*(support|security|technician|helpdesk)\b/i, category: "Tech Support Scam", indicator: "Tech support impersonation", severity: "high" },
  { pattern: /\b(virus|malware|hacked)\s*(detected|found|alert)\b.{0,30}(call|contact|immediately)/i, category: "Tech Support Scam", indicator: "Fake virus alert", severity: "high" },
  { pattern: /\b(your\s*(computer|device|ip)\s*(has\s*been|is)\s*(compromised|infected|hacked))/i, category: "Tech Support Scam", indicator: "Device compromise scam", severity: "high" },
  
  // Delivery & Shipping
  { pattern: /\b(usps|ups|fedex|dhl|amazon)\b.{0,50}(package|delivery|tracking).{0,50}(failed|problem|redelivery|fee)/i, category: "Delivery Scam", indicator: "Package delivery scam", severity: "high" },
  { pattern: /\b(customs|import)\s*(fee|duty|charge)\b.{0,50}(pay|clear|release)/i, category: "Customs Scam", indicator: "Fake customs fee", severity: "high" },
  
  // Banking Regulators
  { pattern: /\b(fdic|federal\s*deposit|occ|cfpb)\b.{0,50}(verify|insurance|account|investigation)/i, category: "Banking Regulator Impersonation", indicator: "Bank regulator scam", severity: "high" },
  { pattern: /\b(federal\s*reserve|treasury\s*department)\b.{0,50}(transfer|fund|payment|seized)/i, category: "Treasury Impersonation", indicator: "Federal reserve scam", severity: "critical" },
  
  // Legal & Court
  { pattern: /\b(court|legal|lawsuit|subpoena|summons)\b.{0,50}(appear|failure|warrant|arrest)/i, category: "Legal Threat Scam", indicator: "Fake legal threat", severity: "high" },
  { pattern: /\b(jury\s*duty|grand\s*jury)\b.{0,50}(missed|failure|warrant|fine)/i, category: "Jury Duty Scam", indicator: "Jury duty scam", severity: "high" },
  { pattern: /\b(sheriff|marshal|police)\b.{0,50}(warrant|arrest|immediate)/i, category: "Law Enforcement Impersonation", indicator: "Fake law enforcement threat", severity: "critical" },
];

// Homograph attack detection - ONLY actual Unicode lookalike characters (not ASCII)
// This detects real homograph attacks using Cyrillic/Greek/Armenian characters that look like Latin
const homoglyphMap: Record<string, string[]> = {
  'a': ['\u0430', '\u03B1'], // Cyrillic а, Greek α
  'e': ['\u0435', '\u0454'], // Cyrillic е, є
  'o': ['\u043e', '\u03BF'], // Cyrillic о, Greek ο
  'i': ['\u0456', '\u0269'], // Cyrillic і, ɩ
  'c': ['\u0441', '\u03F2'], // Cyrillic с, Greek ϲ
  's': ['\u0455'], // Cyrillic ѕ
  'p': ['\u0440', '\u03C1'], // Cyrillic р, Greek ρ
  'x': ['\u0445', '\u03C7'], // Cyrillic х, Greek χ
  'y': ['\u0443', '\u03C5'], // Cyrillic у, Greek υ
  'n': ['\u0578'], // Armenian ո
  'g': ['\u0261'], // Latin small letter script g
  'h': ['\u04BB'], // Cyrillic shha
  'k': ['\u043A'], // Cyrillic к
  'm': ['\u043C'], // Cyrillic м
  'w': ['\u0461'], // Cyrillic omega
};

function detectHomoglyphs(text: string): { found: boolean; examples: string[] } {
  const examples: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const [latin, homoglyphs] of Object.entries(homoglyphMap)) {
    for (const homoglyph of homoglyphs) {
      if (text.includes(homoglyph)) {
        examples.push(`"${homoglyph}" looks like "${latin}"`);
      }
    }
  }
  
  // Check for mixed scripts (Cyrillic + Latin in same word)
  const cyrillicPattern = /[\u0400-\u04FF]/;
  const latinPattern = /[a-zA-Z]/;
  const words = text.split(/\s+/);
  
  for (const word of words) {
    if (cyrillicPattern.test(word) && latinPattern.test(word) && word.length > 3) {
      examples.push(`Mixed scripts in "${word}"`);
    }
  }
  
  return { found: examples.length > 0, examples: examples.slice(0, 3) };
}

function detectTyposquatting(url: string): { brand: string; found: boolean } | null {
  const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase();
  
  for (const { brand, variants } of typosquattingPatterns) {
    for (const variant of variants) {
      if (variant.test(domain) && !domain.includes(brand.toLowerCase().replace(/\s/g, ''))) {
        return { brand, found: true };
      }
    }
  }
  return null;
}

// Cryptocurrency address patterns
const cryptoPatterns = [
  { name: "Bitcoin", pattern: /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/, severity: "high" as const },
  { name: "Bitcoin (Bech32)", pattern: /\bbc1[a-z0-9]{39,59}\b/, severity: "high" as const },
  { name: "Ethereum", pattern: /\b0x[a-fA-F0-9]{40}\b/, severity: "high" as const },
  { name: "Monero", pattern: /\b4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}\b/, severity: "high" as const },
];

function detectCryptoAddresses(text: string): { type: string; address: string }[] {
  const found: { type: string; address: string }[] = [];
  
  for (const { name, pattern } of cryptoPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        found.push({ type: name, address: match.slice(0, 20) + '...' });
      }
    }
  }
  
  return found;
}

// Phone number extraction
const phonePatterns = [
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // US format
  /\b\(\d{3}\)\s*\d{3}[-.]?\d{4}\b/g, // (123) 456-7890
  /\b\+1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, // +1 format
  /\b1[-.\s]?800[-.\s]?\d{3}[-.\s]?\d{4}\b/gi, // Toll-free
  /\b1[-.\s]?888[-.\s]?\d{3}[-.\s]?\d{4}\b/gi,
  /\b1[-.\s]?877[-.\s]?\d{3}[-.\s]?\d{4}\b/gi,
  /\b1[-.\s]?866[-.\s]?\d{3}[-.\s]?\d{4}\b/gi,
];

function extractPhoneNumbers(text: string): string[] {
  const phones: Set<string> = new Set();
  
  for (const pattern of phonePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(m => phones.add(m.replace(/\s+/g, '')));
    }
  }
  
  return Array.from(phones);
}

// Grammar and spelling red flags common in scam messages
const grammarRedFlags = [
  { pattern: /\bdear\s+(customer|user|member|valued|sir\/madam|friend)\b/i, issue: "Generic greeting often used in mass phishing" },
  { pattern: /\b(kindly|please to|do the needful|revert back)\b/i, issue: "Unusual phrasing common in scam emails" },
  { pattern: /\b(your account have been|your account has been compromise|you has won|you has been selected)\b/i, issue: "Grammar errors suggesting non-native scammer" },
  { pattern: /\b(click bellow|click belllow|clik here|clck here)\b/i, issue: "Misspelled call-to-action" },
  { pattern: /!!!+|\?\?\?+|\.\.\.\.+/g, issue: "Excessive punctuation" },
  { pattern: /[A-Z]{5,}/g, issue: "Excessive capitalization" },
  { pattern: /\$\s*\d{1,3}(,\d{3})*(\.\d{2})?\s*(million|billion|thousand)/i, issue: "Large money amount mentioned" },
];

// Normalize URL to ensure it has a protocol
function normalizeUrl(url: string): string {
  let normalized = url.trim();
  // Remove trailing punctuation that's likely not part of the URL
  normalized = normalized.replace(/[.,;:!?]+$/, '');
  // Add https:// if no protocol
  if (!normalized.match(/^https?:\/\//i)) {
    if (normalized.startsWith('www.')) {
      normalized = 'https://' + normalized;
    } else if (normalized.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/)) {
      // Looks like a domain without www
      normalized = 'https://' + normalized;
    }
  }
  return normalized;
}

function extractUrls(content: string): string[] {
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+|www\.[^\s<>"{}|\\^`\[\]]+|[a-zA-Z0-9][a-zA-Z0-9-]*\.(com|org|net|io|co|gov|edu|info|biz)[^\s<>"{}|\\^`\[\]]*/gi;
  const matches = content.match(urlPattern) || [];
  // Normalize all extracted URLs to have https://
  return matches.map(normalizeUrl);
}

// Calculate Shannon entropy for randomness detection
function calculateEntropy(text: string): number {
  if (!text || text.length === 0) return 0;
  
  const freq: Record<string, number> = {};
  for (const char of text.toLowerCase()) {
    freq[char] = (freq[char] || 0) + 1;
  }
  
  let entropy = 0;
  const len = text.length;
  for (const char in freq) {
    const p = freq[char] / len;
    entropy -= p * Math.log2(p);
  }
  
  return entropy;
}

// Analyze URL entropy - high entropy indicates random/malicious URLs
function analyzeUrlEntropy(url: string): { isHigh: boolean; entropy: number; reason: string } {
  // Extract the path and query parts for entropy analysis
  const urlParts = url.replace(/^https?:\/\//, '').split('/');
  const pathAndQuery = urlParts.slice(1).join('/');
  
  if (!pathAndQuery || pathAndQuery.length < 10) {
    return { isHigh: false, entropy: 0, reason: "" };
  }
  
  const entropy = calculateEntropy(pathAndQuery);
  
  // High entropy (> 4.5) suggests random strings often used in malicious URLs
  if (entropy > 4.5 && pathAndQuery.length > 20) {
    return { 
      isHigh: true, 
      entropy, 
      reason: `High URL randomness detected (entropy: ${entropy.toFixed(2)}) - often indicates malicious links` 
    };
  }
  
  return { isHigh: false, entropy, reason: "" };
}

// Detect excessive subdomain depth
function analyzeSubdomainDepth(url: string): { isDeep: boolean; depth: number; reason: string } {
  const domain = url.replace(/^https?:\/\//, '').split('/')[0];
  const subdomains = domain.split('.');
  
  // Remove TLD and main domain, count subdomains
  const depth = Math.max(0, subdomains.length - 2);
  
  if (depth >= 3) {
    return {
      isDeep: true,
      depth,
      reason: `Excessive subdomain depth (${depth} levels) - often used to hide malicious domains`
    };
  }
  
  return { isDeep: false, depth, reason: "" };
}

// Detect Base64 encoded content in URLs
function detectBase64Payload(url: string): { found: boolean; reason: string } {
  // Look for Base64-like patterns in URL (long strings of alphanumeric + /+=)
  const base64Pattern = /[A-Za-z0-9+/=]{40,}/;
  const match = url.match(base64Pattern);
  
  if (match && match[0].length >= 40) {
    // Verify it looks like valid Base64
    const candidate = match[0];
    if (candidate.length % 4 === 0 || candidate.endsWith('=')) {
      return {
        found: true,
        reason: "Possible encoded/obfuscated payload detected in URL"
      };
    }
  }
  
  return { found: false, reason: "" };
}

// Detect Punycode (internationalized domain) spoofing
function detectPunycode(url: string): { found: boolean; domain: string; reason: string } {
  const domain = url.replace(/^https?:\/\//, '').split('/')[0];
  
  // Punycode domains start with "xn--"
  if (domain.includes('xn--')) {
    return {
      found: true,
      domain,
      reason: "Internationalized domain (Punycode) detected - may be impersonating a legitimate site"
    };
  }
  
  return { found: false, domain: "", reason: "" };
}

// Levenshtein distance for brand similarity
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// EXPANDED Known brands for similarity checking (200+ brands)
const knownBrands = [
  // Tech Giants (60+ brands)
  "paypal", "amazon", "apple", "google", "microsoft", "facebook", "meta",
  "instagram", "netflix", "twitter", "linkedin", "youtube", "ebay", "alibaba",
  "whatsapp", "snapchat", "tiktok", "spotify", "discord", "zoom", "slack",
  "dropbox", "github", "adobe", "salesforce", "oracle", "cisco", "intel",
  "samsung", "sony", "nvidia", "amd", "dell", "hp", "lenovo", "asus",
  "ibm", "vmware", "sap", "intuit", "turbotax", "quickbooks", "mailchimp",
  "hubspot", "zendesk", "atlassian", "jira", "confluence", "trello", "notion",
  "monday", "asana", "figma", "canva", "grammarly", "evernote", "todoist",
  "1password", "lastpass", "dashlane", "bitwarden", "nordvpn", "expressvpn",
  "surfshark", "protonvpn", "protonmail", "tutanota", "signal", "telegram",
  "wechat", "line", "viber", "skype", "teams", "webex", "gotomeeting",
  "docusign", "hellosign", "pandadoc", "airtable", "coda", "clickup",
  "basecamp", "freshdesk", "intercom", "drift", "crisp", "olark", "livechat",
  "shopify", "woocommerce", "bigcommerce", "magento", "squarespace", "wix",
  "godaddy", "namecheap", "cloudflare", "digitalocean", "aws", "azure",
  "googlecloud", "heroku", "netlify", "vercel", "render", "railway",
  
  // Banks & Financial - US (80+ brands)
  "chase", "wellsfargo", "bankofamerica", "citibank", "usbank", "capitalone",
  "americanexpress", "amex", "discover", "venmo", "cashapp", "zelle", "coinbase",
  "binance", "robinhood", "fidelity", "schwab", "vanguard", "etrade",
  "tdameritrade", "pnc", "tdbank", "hsbc", "barclays", "santander",
  "goldmansachs", "morganstanley", "jpmorgan", "mastercard", "visa",
  "kraken", "gemini", "metamask", "ledger", "opensea", "uniswap",
  "citizensbank", "fifththird", "keybank", "regions", "huntington", "ally",
  "marcus", "sofi", "chime", "current", "varo", "monzo", "revolut", "n26",
  "wise", "transferwise", "worldremit", "remitly", "xoom", "westernunion",
  "moneygram", "payoneer", "skrill", "neteller", "paysafe", "stripe",
  "square", "clover", "toast", "lightspeed", "shopkeep", "revel",
  "suntrust", "bbt", "truist", "synovus", "firsthorizon", "umpqua",
  "webull", "acorns", "betterment", "wealthfront", "personalcapital",
  "creditkarma", "experian", "equifax", "transunion", "annualcreditreport",
  "mint", "ynab", "pocketguard", "honeydue", "copilot", "rocket",
  
  // Banks & Financial - International
  "natwest", "lloyds", "halifax", "nationwide", "rbs", "tsb", "virgin",
  "starling", "tandem", "atom", "triodos", "metro", "handelsbanken",
  "deutschebank", "commerzbank", "bnpparibas", "creditagricole", "societe",
  "unicredit", "intesa", "ing", "abn", "rabobank", "bunq", "knab",
  "ubs", "creditsuisse", "postfinance", "raiffeisen", "erste", "bawag",
  "nordea", "swedbank", "seb", "handelsbanken", "danske", "dnb", "storebrand",
  "commonwealth", "westpac", "anz", "nab", "macquarie", "bendigo", "bankwest",
  "icbc", "ccb", "abc", "boc", "bocom", "cmbchina", "spdb", "citic",
  "mizuho", "mufg", "smbc", "resona", "shinsei", "aozora", "suruga",
  "dbs", "ocbc", "uob", "maybank", "cimb", "rhb", "publicbank", "hongleong",
  "kotak", "hdfc", "icici", "axis", "sbi", "pnb", "bob", "canara",
  
  // Banks & Financial - Africa (80+ brands)
  // South Africa
  "fnb", "firstnationalbank", "standardbank", "absa", "nedbank", "capitec",
  "investec", "africanbank", "bidvest", "grindrod", "sasfin", "mercantile",
  "tymebank", "bankzero", "discovery", "oldmutual", "sanlam", "liberty",
  // Nigeria
  "gtbank", "guarantytrust", "firstbank", "zenithbank", "accessbank", "ubabank",
  "fidelitybank", "unionbank", "sterlingbank", "wemabank", "keystonebank",
  "polaris", "jaiz", "stanbic", "ecobank", "fcmb", "providus", "rubies",
  "opay", "palmpay", "kuda", "moniepoint", "carbon", "fairmoney", "branch",
  // Kenya
  "kcb", "equitybank", "coopbank", "abcbank", "dtbbank", "familybank",
  "ncba", "imbank", "stanbickenya", "standardchartered", "barclayskenya",
  "mpesa", "safaricom", "airtel", "telkom", "mshwari", "fuliza", "tala",
  // Ghana
  "gcb", "ecobank", "stanbicghana", "absa", "fidelity", "calbank",
  "zenith", "uba", "accessghana", "prudential", "societe", "republic",
  "mtn", "vodafone", "airteltigo", "momo", "mobilemoney", "zeepay",
  // Egypt
  "nbe", "banquemisr", "cib", "qnb", "alexbank", "arabbank", "faisal",
  "hsbc", "scb", "audi", "blom", "saib", "aaib", "mashreq", "emirates",
  "vodafonecash", "etisalat", "orange", "wepay", "fawry", "paymob",
  // Other African Countries
  "attijariwafa", "bmce", "cih", "sgmb", "creditagricole", // Morocco
  "biat", "stb", "bh", "amen", "bt", "bte", "zitouna", // Tunisia
  "bea", "bna", "cnep", "cpa", "badr", "bdl", "gulf", // Algeria
  "equity", "crdb", "nmb", "dtb", "exim", "tpb", "ncb", // Tanzania
  "zanaco", "stanbiczambia", "fnbzambia", "barclays", "ab", "access", // Zambia
  "cbz", "steward", "zb", "fbc", "nmb", "agribank", // Zimbabwe
  "fnbnam", "bankwindhoek", "standardnam", "nednam", "letshego", // Namibia
  "fnbbots", "stanbicbots", "barclays", "absa", "firstcapital", // Botswana
  "gtbankrw", "bk", "cogebanque", "equity", "imbank", "accessrw", // Rwanda
  "dfcu", "stanbicug", "centenary", "housingfinance", "postbank", // Uganda
  
  // African Telecom & Mobile Money (50+ brands)
  "mtn", "safaricom", "airtel", "vodacom", "orange", "glo", "9mobile",
  "ethiotelecom", "maroctelecom", "ooredoo", "tunisietelecom", "djezzy",
  "econet", "telecel", "africell", "tigo", "millicom", "sonatel",
  "mpesa", "momo", "airtelmoney", "orangemoney", "ecocash", "tigocash",
  "paga", "flutterwave", "paystack", "interswitch", "cellulant", "chipper",
  "wave", "mfs", "yup", "geopay", "zamtel", "movitel", "tmcel",
  "mascom", "bemagosi", "mcel", "vodafone", "tmcel", "ethiotel",
  
  // Retail - Major (100+ brands)
  "walmart", "target", "costco", "bestbuy", "homedepot", "lowes", "macys",
  "nordstrom", "kohls", "sephora", "ulta", "nike", "adidas", "lululemon",
  "underarmour", "gap", "oldnavy", "zara", "hm", "forever21", "asos",
  "shein", "temu", "wish", "etsy", "wayfair", "chewy", "petco", "petsmart",
  "jcpenney", "belk", "dillards", "bloomingdales", "neiman", "saks", "barneys",
  "anthropologie", "freepeople", "urbanoutfitters", "ae", "abercrombie", "hollister",
  "express", "jcrew", "bananarepublic", "athleta", "uniqlo", "primark", "topshop",
  "boohoo", "prettylittlething", "missguided", "fashionnova", "romwe", "zaful",
  "puma", "newbalance", "asics", "reebok", "vans", "converse", "skechers",
  "footlocker", "finishline", "champssports", "dickssporting", "academy", "rei",
  "bass", "cabelas", "sportsmans", "scheels", "dunhams", "hibbett",
  "ikea", "williams-sonoma", "pottery", "westelm", "crateandbarrel", "cb2",
  "bedbathandbeyond", "pier1", "zgallerie", "worldmarket", "roomandboard",
  "restorationhardware", "arhaus", "ethanallen", "lazyboy", "ashleyfurniture",
  "overstock", "hayneedle", "houzz", "allmodern", "jossandmain", "birch",
  "autozone", "oreilly", "advanceauto", "pepboys", "napa", "carquest",
  "staples", "officemax", "officedepot", "uline", "quill", "vistaprint",
  "michaels", "joann", "hobbylobby", "blick", "dickblick", "jerrysartarama",
  "gamestop", "thinkgeek", "newegg", "microcenter", "bhphoto", "adorama",
  
  // Streaming & Entertainment (50+ brands)
  "disney", "disneyplus", "hbomax", "hulu", "paramount", "peacock", "twitch", "steam",
  "epicgames", "playstation", "xbox", "nintendo", "roblox", "activision",
  "electronicarts", "ubisoft", "bethesda", "rockstar", "valorant", "fortnite",
  "primevideo", "appletv", "discovery", "showtime", "starz", "britbox",
  "acorn", "criterion", "mubi", "shudder", "amc", "sundancenow",
  "crunchyroll", "funimation", "hidive", "vrv", "roosterteeth", "dropout",
  "dazn", "espn", "fubo", "sling", "youtubetv", "directv", "dish",
  "pandora", "deezer", "tidal", "amazonmusic", "applemusic", "soundcloud",
  "bandcamp", "audiomack", "mixcloud", "beatport", "traxsource",
  "blizzard", "riot", "bungie", "square-enix", "capcom", "konami", "sega",
  "bandainamco", "2k", "take2", "thq", "paradox", "cdprojekt", "devolver",
  
  // Telecom & Utilities (40+ brands)
  "att", "verizon", "tmobile", "sprint", "comcast", "xfinity", "spectrum",
  "cox", "cricket", "boost", "metro", "visible", "mint", "ting",
  "straighttalk", "tracfone", "consumer", "pageplus", "redpocket", "ultramobile",
  "googlefi", "usmobile", "tello", "textnow", "freedompop", "republic",
  "frontier", "centurylink", "lumen", "windstream", "consolidated", "cincinnati",
  "atlantic", "optimum", "altice", "mediacom", "suddenlink", "wow",
  "sce", "pge", "edison", "duke", "dominion", "entergy", "xcel",
  "firstenergy", "aep", "southern", "nextera", "evergy", "ameren",
  "nationalfuel", "atmos", "spire", "southwest", "cenpoint", "onegas",
  
  // Travel & Transportation (60+ brands)
  "unitedairlines", "delta", "americanairlines", "southwest", "jetblue",
  "uber", "lyft", "doordash", "grubhub", "instacart", "postmates",
  "airbnb", "booking", "expedia", "hotels", "kayak", "tripadvisor",
  "usps", "fedex", "ups", "dhl", "hertz", "enterprise", "avis",
  "alaskaair", "spirit", "frontier", "allegiant", "hawaiian", "sun",
  "british", "lufthansa", "airfrance", "klm", "emirates", "qatar",
  "etihad", "singapore", "cathay", "ana", "jal", "korean", "asiana",
  "qantas", "virgin", "ryanair", "easyjet", "vueling", "norwegian",
  "priceline", "hotwire", "orbitz", "travelocity", "cheapoair", "momondo",
  "skyscanner", "google flights", "kiwi", "hopper", "scott", "going",
  "marriott", "hilton", "hyatt", "ihg", "wyndham", "choice", "bestwestern",
  "radisson", "accor", "fourseasons", "ritz", "waldorf", "conrad", "doubletree",
  "homewood", "hampton", "residence", "springhill", "fairfield", "courtyard",
  "budget", "national", "alamo", "thrifty", "dollar", "sixt", "europcar",
  "turo", "getaround", "zipcar", "maven", "car2go", "lime", "bird", "spin",
  
  // Healthcare & Pharma (50+ brands)
  "cvs", "walgreens", "riteaid", "unitedhealth", "cigna", "aetna", "anthem",
  "bluecross", "kaiser", "humana", "optum", "express-scripts", "caremark",
  "centene", "molina", "wellcare", "healthnet", "oscar", "clover", "bright",
  "devoted", "alignment", "carelon", "magellan", "beacon", "evicore",
  "pfizer", "moderna", "jnj", "merck", "abbvie", "bms", "lilly", "amgen",
  "gilead", "regeneron", "vertex", "biogen", "alexion", "incyte", "seagen",
  "novartis", "roche", "sanofi", "gsk", "astrazeneca", "bayer", "boehringer",
  "teladoc", "amwell", "mdlive", "doctor", "zocdoc", "healthgrades", "vitals",
  "onemedical", "forward", "parsley", "carbon", "cityblock", "oak", "galileo",
  "pillpack", "capsule", "alto", "medly", "nimble", "truepill", "amazon pharmacy",
  
  // Food & Beverage (60+ brands)
  "mcdonalds", "starbucks", "chipotle", "dominos", "pizzahut", "dunkin",
  "tacobell", "wendys", "burgerking", "subway", "chickfila", "kfc",
  "papajohns", "littlecaesars", "panera", "noodles", "panerabread",
  "coca-cola", "pepsi", "redbull", "monster", "gatorade",
  "popeyes", "arbys", "sonic", "jackinthebox", "carls", "hardees",
  "fiveguys", "shakeshack", "innout", "whataburger", "culvers", "cookout",
  "wingstop", "buffalowild", "hooters", "applebees", "chilis", "tgifridays",
  "olivegarden", "redlobster", "outback", "texas", "longhorn", "ruth",
  "cheesecakefactory", "pf", "benihana", "maggianos", "capital", "mortons",
  "denny", "ihop", "waffle", "cracker", "bobevans", "perkins", "shoneys",
  "sweetgreen", "cava", "tender", "portillos", "jasons", "potbelly", "firehouse",
  "jersymikes", "jimmyjohns", "whichwich", "quiznos", "schlotzskys", "mcalisters",
  "smoothie", "jamba", "tropical", "nekter", "juice", "pressed", "suja",
  "krispy", "cinnabon", "auntie", "wetzel", "greatamerican", "insomnia",
  
  // Insurance (40+ brands)
  "statefarm", "geico", "progressive", "allstate", "libertymutual", "farmers",
  "nationwide", "usaa", "travelers", "metlife", "prudential", "aflac",
  "hartford", "chubb", "aig", "zurich", "cna", "tokio", "sompo", "mitsui",
  "erie", "american", "safeco", "mercury", "esurance", "21st", "kemper",
  "lemonade", "root", "hippo", "next", "pie", "coterie", "vouch", "cowbell",
  "newfront", "embroker", "founder", "brex", "ramp", "divvy", "airbase",
  "northwestern", "newyork", "massmutal", "principal", "lincoln", "transamerica",
  "voya", "brighthouse", "athene", "equitable", "jackson", "ameriprise", "edward",
  
  // Government & Organizations (30+ brands)
  "irs", "ssa", "medicare", "medicaid", "usps", "dmv", "uscis",
  "fbi", "cia", "nsa", "dhs", "ice", "cbp", "tsa", "atf", "dea", "marshals",
  "fda", "cdc", "nih", "hhs", "epa", "dot", "faa", "nhtsa", "fcc", "ftc",
  "sec", "finra", "cfpb", "occ", "fdic", "ncua", "fhfa", "fannie", "freddie",
  "va", "hud", "sba", "gsa", "opm", "ssa", "uscourts", "supremecourt",
  
  // Crypto & Web3 (40+ brands)
  "bitcoin", "ethereum", "solana", "cardano", "polkadot", "avalanche", "cosmos",
  "polygon", "arbitrum", "optimism", "base", "linea", "zksync", "starknet",
  "rarible", "foundation", "superrare", "nifty", "async", "catalog", "sound",
  "aave", "compound", "makerdao", "lido", "rocketpool", "frax", "curve",
  "sushiswap", "pancakeswap", "quickswap", "velodrome", "aerodrome", "balancer",
  "fantom", "near", "algorand", "hedera", "tezos", "flow", "aptos", "sui",
  "trustwallet", "phantom", "keplr", "rainbow", "argent", "safe", "gnosis",
  
  // Education & Learning (30+ brands)
  "coursera", "udemy", "edx", "linkedin", "skillshare", "masterclass", "brilliant",
  "khan", "duolingo", "babbel", "rosetta", "busuu", "memrise", "anki",
  "chegg", "quizlet", "studyblue", "bartleby", "course", "studocu", "scribd",
  "codecademy", "freecodecamp", "treehouse", "pluralsight", "udacity", "datacamp",
  "leetcode", "hackerrank", "codewars", "exercism", "frontendmentor", "scrimba"
];

// Check for brand similarity (catch subtle misspellings)
function detectBrandSimilarity(domain: string): { found: boolean; brand: string; distance: number; reason: string } {
  // Clean domain - remove TLD and subdomains
  const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0];
  const domainParts = cleanDomain.split('.');
  const mainDomain = domainParts.length >= 2 ? domainParts[domainParts.length - 2] : domainParts[0];
  
  for (const brand of knownBrands) {
    // Skip exact matches (those are legit)
    if (mainDomain === brand) continue;
    
    const distance = levenshteinDistance(mainDomain.toLowerCase(), brand);
    const similarity = 1 - (distance / Math.max(mainDomain.length, brand.length));
    
    // If 80%+ similar but not exact, it's suspicious
    if (similarity >= 0.75 && similarity < 1 && distance <= 3) {
      return {
        found: true,
        brand,
        distance,
        reason: `Domain "${mainDomain}" is suspiciously similar to "${brand}" (${Math.round(similarity * 100)}% match)`
      };
    }
  }
  
  return { found: false, brand: "", distance: 0, reason: "" };
}

// Calculate urgency/pressure score
function calculateUrgencyScore(content: string): { score: number; level: string; triggers: string[] } {
  const triggers: string[] = [];
  let score = 0;
  
  const urgencyPatterns = [
    { pattern: /\b(urgent|urgently|emergency|immediately|right now|asap)\b/gi, weight: 3, label: "Urgent language" },
    { pattern: /\b(act (fast|now)|don't (wait|delay)|hurry|quick|fast)\b/gi, weight: 2, label: "Pressure to act quickly" },
    { pattern: /\b(expires?|expiring|deadline|final|last chance|limited time)\b/gi, weight: 2, label: "Time pressure" },
    { pattern: /\b(warning|alert|notice|attention|important)\b/gi, weight: 1, label: "Warning language" },
    { pattern: /\b(suspended|terminated|closed|frozen|locked|disabled)\b/gi, weight: 3, label: "Account threat" },
    { pattern: /\b(verify|confirm|validate|update).{0,20}(now|immediately|today)/gi, weight: 3, label: "Immediate action request" },
    { pattern: /\b(only \d+ (left|remaining|available)|while supplies last)\b/gi, weight: 2, label: "Scarcity tactics" },
    { pattern: /!!+|\?\?+/g, weight: 1, label: "Excessive punctuation" },
    { pattern: /[A-Z]{4,}/g, weight: 1, label: "Shouting (all caps)" },
    { pattern: /\b(risk|danger|threat|compromise|breach)\b/gi, weight: 2, label: "Fear language" },
  ];
  
  for (const { pattern, weight, label } of urgencyPatterns) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      score += weight * Math.min(matches.length, 3); // Cap at 3 matches per pattern
      if (!triggers.includes(label)) {
        triggers.push(label);
      }
    }
  }
  
  // Normalize score to 0-100
  const normalizedScore = Math.min(100, Math.round((score / 30) * 100));
  
  let level = "Low";
  if (normalizedScore >= 70) level = "Critical";
  else if (normalizedScore >= 50) level = "High";
  else if (normalizedScore >= 30) level = "Moderate";
  
  return { score: normalizedScore, level, triggers };
}

// Analyze email headers for security issues
function analyzeEmailHeaders(headers: string): EmailHeaderAnalysis {
  const findings: EmailHeaderAnalysis["findings"] = [];
  const recommendations: string[] = [];
  const parsedHeaders: EmailHeaderAnalysis["parsedHeaders"] = {
    receivedChain: []
  };
  
  const lines = headers.split(/\r?\n/);
  let currentHeader = "";
  let currentValue = "";
  const headerMap: Record<string, string> = {};
  
  // Common header names to detect even with leading whitespace
  const knownHeaders = /^(from|to|reply-to|return-path|received|subject|date|message-id|x-mailer|x-originating-ip|authentication-results|content-type|mime-version|dkim-signature|arc-authentication-results):/i;
  
  // Parse headers (handling line continuations but also recognizing headers with accidental indentation)
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this line looks like a new header (even if indented)
    const looksLikeNewHeader = knownHeaders.test(trimmedLine) || /^[a-zA-Z][a-zA-Z0-9-]*:/.test(trimmedLine);
    
    if (/^\s/.test(line) && currentHeader && !looksLikeNewHeader) {
      // True continuation - starts with space and doesn't look like a header
      currentValue += " " + trimmedLine;
    } else {
      // Save current header
      if (currentHeader) {
        const key = currentHeader.toLowerCase();
        if (key === "received") {
          parsedHeaders.receivedChain.push(currentValue);
        } else {
          headerMap[key] = currentValue;
        }
      }
      // Start new header
      const colonIndex = trimmedLine.indexOf(":");
      if (colonIndex > 0) {
        currentHeader = trimmedLine.substring(0, colonIndex).trim();
        currentValue = trimmedLine.substring(colonIndex + 1).trim();
      }
    }
  }
  // Don't forget the last header
  if (currentHeader) {
    const key = currentHeader.toLowerCase();
    if (key === "received") {
      parsedHeaders.receivedChain.push(currentValue);
    } else {
      headerMap[key] = currentValue;
    }
  }
  
  // Extract key headers
  parsedHeaders.from = headerMap["from"];
  parsedHeaders.replyTo = headerMap["reply-to"];
  parsedHeaders.returnPath = headerMap["return-path"];
  parsedHeaders.xMailer = headerMap["x-mailer"];
  parsedHeaders.xOriginatingIP = headerMap["x-originating-ip"];
  parsedHeaders.contentType = headerMap["content-type"];
  parsedHeaders.mimeVersion = headerMap["mime-version"];
  
  // Check authentication results
  const authResults = headerMap["authentication-results"] || "";
  
  // SPF Check
  if (/spf=pass/i.test(authResults)) {
    parsedHeaders.spf = "pass";
    findings.push({
      category: "SPF (Sender Policy Framework)",
      status: "pass",
      detail: "SPF verification passed",
      explanation: "The sending server is authorized to send emails for this domain."
    });
  } else if (/spf=fail/i.test(authResults) || /spf=softfail/i.test(authResults)) {
    parsedHeaders.spf = "fail";
    findings.push({
      category: "SPF (Sender Policy Framework)",
      status: "fail",
      detail: "SPF verification failed",
      explanation: "The sending server may not be authorized to send emails for this domain. This is a major red flag."
    });
    recommendations.push("Be very cautious - SPF failure means the sender may be spoofing their email address.");
  } else if (/spf=/i.test(authResults)) {
    parsedHeaders.spf = "neutral";
    findings.push({
      category: "SPF (Sender Policy Framework)",
      status: "warning",
      detail: "SPF result is neutral or unknown",
      explanation: "The domain's SPF record doesn't clearly authorize or reject this server."
    });
  }
  
  // DKIM Check
  if (/dkim=pass/i.test(authResults)) {
    parsedHeaders.dkim = "pass";
    findings.push({
      category: "DKIM (Domain Keys)",
      status: "pass",
      detail: "DKIM signature verified",
      explanation: "The email's cryptographic signature is valid, confirming it hasn't been altered."
    });
  } else if (/dkim=fail/i.test(authResults)) {
    parsedHeaders.dkim = "fail";
    findings.push({
      category: "DKIM (Domain Keys)",
      status: "fail",
      detail: "DKIM verification failed",
      explanation: "The email's signature is invalid. The message may have been altered or forged."
    });
    recommendations.push("DKIM failure suggests the email may have been tampered with or is fraudulent.");
  }
  
  // DMARC Check
  if (/dmarc=pass/i.test(authResults)) {
    parsedHeaders.dmarc = "pass";
    findings.push({
      category: "DMARC Policy",
      status: "pass",
      detail: "DMARC policy passed",
      explanation: "The email passes the domain's anti-spoofing policy."
    });
  } else if (/dmarc=fail/i.test(authResults)) {
    parsedHeaders.dmarc = "fail";
    findings.push({
      category: "DMARC Policy",
      status: "fail",
      detail: "DMARC policy failed",
      explanation: "The email violates the domain's anti-spoofing policy. Likely fraudulent."
    });
    recommendations.push("DMARC failure is a strong indicator of email spoofing.");
  }
  
  // Check From vs Reply-To mismatch
  if (parsedHeaders.from && parsedHeaders.replyTo) {
    const fromDomain = parsedHeaders.from.match(/@([a-zA-Z0-9.-]+)/)?.[1]?.toLowerCase();
    const replyToDomain = parsedHeaders.replyTo.match(/@([a-zA-Z0-9.-]+)/)?.[1]?.toLowerCase();
    
    if (fromDomain && replyToDomain && fromDomain !== replyToDomain) {
      findings.push({
        category: "Reply-To Mismatch",
        status: "warning",
        detail: `From domain (${fromDomain}) differs from Reply-To (${replyToDomain})`,
        explanation: "Scammers often set a different reply-to address to capture your responses while impersonating someone else."
      });
      recommendations.push("Be cautious when the reply address differs from the sender address.");
    }
  }
  
  // Check Return-Path vs From mismatch
  if (parsedHeaders.from && parsedHeaders.returnPath) {
    const fromDomain = parsedHeaders.from.match(/@([a-zA-Z0-9.-]+)/)?.[1]?.toLowerCase();
    const returnPathDomain = parsedHeaders.returnPath.match(/@([a-zA-Z0-9.-]+)/)?.[1]?.toLowerCase();
    
    if (fromDomain && returnPathDomain && fromDomain !== returnPathDomain) {
      findings.push({
        category: "Return-Path Mismatch",
        status: "warning",
        detail: `From domain differs from Return-Path`,
        explanation: "The bounce address differs from the displayed sender. Could indicate a forwarded or spoofed email."
      });
    }
  }
  
  // Check received chain for suspicious patterns
  const receivedChain = parsedHeaders.receivedChain;
  if (receivedChain.length > 0) {
    findings.push({
      category: "Email Path",
      status: "info",
      detail: `Email passed through ${receivedChain.length} server(s)`,
      explanation: "This shows the route the email took to reach you."
    });
    
    // Check for suspicious countries or services in path
    const suspiciousPatterns = [
      { pattern: /\b(tor|onion|vpn|proxy)\b/i, reason: "anonymizing service" },
      { pattern: /\b(tempmail|guerrilla|mailinator|10minute|throwaway)\b/i, reason: "disposable email service" },
    ];
    
    for (const received of receivedChain) {
      for (const { pattern, reason } of suspiciousPatterns) {
        if (pattern.test(received)) {
          findings.push({
            category: "Suspicious Relay",
            status: "warning",
            detail: `Possible ${reason} in email path`,
            explanation: "The email passed through infrastructure commonly used to hide identity."
          });
          break;
        }
      }
    }
  }
  
  // Check X-Mailer for suspicious clients
  if (parsedHeaders.xMailer) {
    const suspiciousMailers = [
      /^PHPMailer/i,
      /swiftmailer/i,
      /mass\s?mail/i,
      /bulk\s?mail/i,
    ];
    
    for (const pattern of suspiciousMailers) {
      if (pattern.test(parsedHeaders.xMailer)) {
        findings.push({
          category: "Bulk Mailer Detected",
          status: "warning",
          detail: `Email client: ${parsedHeaders.xMailer}`,
          explanation: "This email appears to be sent via a bulk mailing system, common with marketing or spam."
        });
        break;
      }
    }
  }
  
  // Check for missing critical headers
  if (!parsedHeaders.from) {
    findings.push({
      category: "Missing From Header",
      status: "fail",
      detail: "No From header found",
      explanation: "A legitimate email should always have a From header."
    });
  }
  
  // Calculate overall risk
  const failCount = findings.filter(f => f.status === "fail").length;
  const warnCount = findings.filter(f => f.status === "warning").length;
  
  let overallRisk: EmailHeaderAnalysis["overallRisk"] = "safe";
  if (failCount >= 2) overallRisk = "critical";
  else if (failCount >= 1) overallRisk = "high";
  else if (warnCount >= 2) overallRisk = "medium";
  else if (warnCount >= 1) overallRisk = "low";
  
  // Add general recommendations
  if (findings.length === 0) {
    findings.push({
      category: "No Authentication Headers",
      status: "info",
      detail: "No SPF/DKIM/DMARC results found",
      explanation: "Email authentication headers may be missing or the headers provided are incomplete."
    });
    recommendations.push("If possible, view the full email headers to get complete authentication results.");
  }
  
  return { overallRisk, findings, recommendations, parsedHeaders };
}

function analyzeUrl(url: string): URLAnalysis {
  const reasons: string[] = [];
  let isSuspicious = false;
  
  // Check if it's a known legitimate domain first
  let isLegit = false;
  for (const legit of legitDomains) {
    if (legit.test(url)) {
      isLegit = true;
      break;
    }
  }
  
  // Skip all suspicious checks for known legitimate domains
  if (isLegit) {
    return { url, isSuspicious: false, reasons: [] };
  }
  
  // Check for suspicious patterns
  for (const { pattern, reason } of suspiciousUrlPatterns) {
    if (pattern.test(url)) {
      reasons.push(reason);
      isSuspicious = true;
    }
  }
  
  // Check for typosquatting
  const typosquat = detectTyposquatting(url);
  if (typosquat) {
    reasons.push(`Possible ${typosquat.brand} typosquatting`);
    isSuspicious = true;
  }
  
  // Check for homograph attacks
  const homoglyphs = detectHomoglyphs(url);
  if (homoglyphs.found) {
    reasons.push(`Lookalike characters detected: ${homoglyphs.examples.join(', ')}`);
    isSuspicious = true;
  }
  
  // Check URL entropy (randomness)
  const entropyResult = analyzeUrlEntropy(url);
  if (entropyResult.isHigh) {
    reasons.push(entropyResult.reason);
    isSuspicious = true;
  }
  
  // Check subdomain depth
  const subdomainResult = analyzeSubdomainDepth(url);
  if (subdomainResult.isDeep) {
    reasons.push(subdomainResult.reason);
    isSuspicious = true;
  }
  
  // Check for Base64 encoded payloads
  const base64Result = detectBase64Payload(url);
  if (base64Result.found) {
    reasons.push(base64Result.reason);
    isSuspicious = true;
  }
  
  // Check for Punycode domains
  const punycodeResult = detectPunycode(url);
  if (punycodeResult.found) {
    reasons.push(punycodeResult.reason);
    isSuspicious = true;
  }
  
  // Check brand similarity (Levenshtein distance)
  const brandSimilarity = detectBrandSimilarity(url);
  if (brandSimilarity.found) {
    reasons.push(brandSimilarity.reason);
    isSuspicious = true;
  }
  
  // Override suspicious flag if it's a known legitimate domain
  if (isLegit && reasons.length === 0) {
    isSuspicious = false;
  }
  
  return { url, isSuspicious, reasons };
}

function analyzeContent(content: string): AnalysisResult {
  if (!content.trim()) {
    return {
      overallRisk: "safe",
      confidenceScore: 0,
      title: "",
      summary: "",
      threats: [],
      urls: [],
      recommendations: [],
      educationalTips: []
    };
  }

  const threats: DetectedThreat[] = [];
  const severityScores = { low: 1, medium: 2, high: 3, critical: 4 };
  
  for (const pattern of threatPatterns) {
    if (pattern.pattern.test(content)) {
      threats.push({
        category: pattern.category,
        indicator: pattern.indicator,
        severity: pattern.severity,
        explanation: pattern.explanation
      });
    }
  }
  
  // Check for organization impersonation (government, healthcare, utilities)
  for (const { pattern, category, indicator, severity } of organizationImpersonationPatterns) {
    if (pattern.test(content)) {
      threats.push({
        category,
        indicator,
        severity,
        explanation: `This message appears to impersonate a ${category.toLowerCase().replace(' impersonation', '')}. ${
          category.includes('IRS') ? 'The IRS never initiates contact via email or text for tax matters.' :
          category.includes('SSA') ? 'Social Security never threatens to suspend your benefits via email/text.' :
          category.includes('Medicare') ? 'Medicare will never call/text asking for your Medicare number.' :
          category.includes('Utility') ? 'Utility companies provide proper notice before service disconnection.' :
          category.includes('FBI') || category.includes('Law Enforcement') ? 'Law enforcement does not contact people via email/text for arrest warrants.' :
          category.includes('Tech Support') ? 'Tech companies never proactively contact users about security issues.' :
          'Verify by contacting the organization directly through official channels.'
        }`
      });
    }
  }
  
  const urls = extractUrls(content);
  const urlAnalyses = urls.map(analyzeUrl);
  const suspiciousUrls = urlAnalyses.filter(u => u.isSuspicious);
  
  if (suspiciousUrls.length > 0) {
    threats.push({
      category: "Suspicious URLs",
      indicator: `${suspiciousUrls.length} suspicious URL(s) detected`,
      severity: "high",
      explanation: "The message contains links that may lead to malicious websites. Never click links in suspicious messages."
    });
  }
  
  // Check for cryptocurrency addresses
  const cryptoAddresses = detectCryptoAddresses(content);
  if (cryptoAddresses.length > 0) {
    threats.push({
      category: "Cryptocurrency Request",
      indicator: `${cryptoAddresses.length} cryptocurrency address(es) found: ${cryptoAddresses.map(c => c.type).join(', ')}`,
      severity: "critical",
      explanation: "Cryptocurrency addresses in unsolicited messages are a major red flag. Legitimate businesses rarely request crypto payments, and these transactions cannot be reversed."
    });
  }
  
  // Check for phone numbers
  const phoneNumbers = extractPhoneNumbers(content);
  if (phoneNumbers.length > 0) {
    threats.push({
      category: "Phone Number Detected",
      indicator: `${phoneNumbers.length} phone number(s) found`,
      severity: "medium",
      explanation: "Phone numbers in suspicious messages may connect you to scam call centers. Never call numbers provided in unsolicited messages. Verify numbers through official websites."
    });
  }
  
  // Check for grammar red flags
  for (const { pattern, issue } of grammarRedFlags) {
    if (pattern.test(content)) {
      threats.push({
        category: "Writing Style Red Flag",
        indicator: issue,
        severity: "low",
        explanation: "This writing pattern is commonly seen in scam messages. Professional organizations typically use proper grammar and personalized greetings."
      });
      break; // Only add one grammar warning
    }
  }
  
  // Check for homograph attacks in the full content
  const contentHomoglyphs = detectHomoglyphs(content);
  if (contentHomoglyphs.found) {
    threats.push({
      category: "Homograph Attack",
      indicator: `Deceptive characters detected: ${contentHomoglyphs.examples.join(', ')}`,
      severity: "high",
      explanation: "This message contains characters designed to look like normal letters but are actually different. Scammers use this trick to create fake website addresses."
    });
  }
  
  // Calculate risk score
  let totalScore = threats.reduce((sum, t) => sum + severityScores[t.severity], 0);
  totalScore += suspiciousUrls.length * 2;
  totalScore += cryptoAddresses.length * 3;
  
  // Determine overall risk
  let overallRisk: AnalysisResult["overallRisk"];
  let confidenceScore: number;
  let title: string;
  let summary: string;
  
  if (totalScore === 0) {
    overallRisk = "safe";
    confidenceScore = 75;
    title = "No Obvious Threats Detected";
    summary = "We did not detect common scam patterns. This does not guarantee safety so always verify unexpected messages through official channels.";
  } else if (totalScore <= 2) {
    overallRisk = "low";
    confidenceScore = 60;
    title = "Low Risk with Minor Concerns";
    summary = "A few elements warrant attention, but this may be legitimate. Verify through official channels if unsure.";
  } else if (totalScore <= 5) {
    overallRisk = "medium";
    confidenceScore = 70;
    title = "Medium Risk. Proceed with Caution";
    summary = "This content contains multiple warning signs. We recommend verifying through official channels before taking any action.";
  } else if (totalScore <= 10) {
    overallRisk = "high";
    confidenceScore = 85;
    title = "High Risk. Likely a Scam";
    summary = "This content contains several major red flags commonly found in scams. Do not engage with this message.";
  } else {
    overallRisk = "critical";
    confidenceScore = 95;
    title = "Critical Risk. Almost Certainly a Scam";
    summary = "This content matches multiple known scam patterns. Delete immediately and do not respond, click links, or provide any information.";
  }
  
  // Generate recommendations based on threats
  const recommendations: string[] = [];
  const categories = new Set(threats.map(t => t.category));
  
  if (categories.has("Credential Phishing") || categories.has("Account Compromise Scam")) {
    recommendations.push("Never enter login credentials through email links. Navigate directly to the official website.");
  }
  if (categories.has("Financial Fraud") || categories.has("Advance Fee Fraud")) {
    recommendations.push("Never send money via wire transfer, gift cards, or cryptocurrency to someone you haven't met in person.");
  }
  if (categories.has("Tech Support Scam") || categories.has("Government Impersonation")) {
    recommendations.push("Contact the organization directly using the phone number on their official website, not numbers provided in the message.");
  }
  if (suspiciousUrls.length > 0) {
    recommendations.push("Do not click any links in this message. If you need to visit a website, type the address directly in your browser.");
  }
  if (recommendations.length === 0) {
    recommendations.push("When in doubt, verify through official channels before taking any action.");
  }
  recommendations.push("Report this to the FTC at reportfraud.ftc.gov if you believe it's a scam.");
  
  // Educational tips
  const educationalTips = [
    "Legitimate organizations never ask for passwords or SSN via email or text",
    "If an offer seems too good to be true, it almost certainly is",
    "Scammers create urgency to prevent you from thinking critically",
    "Always verify requests for money or information through a separate, trusted channel"
  ];

  // Calculate urgency/manipulation score
  const urgencyAnalysis = calculateUrgencyScore(content);
  
  // Add urgency as a threat if significant
  if (urgencyAnalysis.score >= 30) {
    threats.push({
      category: "Manipulation Tactics",
      indicator: `${urgencyAnalysis.level} pressure level detected (Score: ${urgencyAnalysis.score}/100)`,
      severity: urgencyAnalysis.score >= 70 ? "critical" : urgencyAnalysis.score >= 50 ? "high" : "medium",
      explanation: `This message uses ${urgencyAnalysis.triggers.slice(0, 3).join(', ').toLowerCase()} to pressure you into quick action. Take your time to verify independently.`
    });
  }

  return {
    overallRisk,
    confidenceScore,
    title,
    summary,
    threats,
    urls: urlAnalyses,
    recommendations,
    educationalTips,
    urgencyAnalysis
  };
}

interface AIAnalysisResult {
  contentTypeDetected: string;
  scamRiskLevel: "Low" | "Moderate" | "High" | "Critical";
  keyRedFlags: string[];
  technicalObservations: string[];
  recommendedActions: string[];
  confidenceLevel: string;
  summary: string;
}

function detectEmailHeaders(content: string): boolean {
  const headerPatterns = [
    /^Received:/m,
    /^From:/m,
    /^Reply-To:/m,
    /^Return-Path:/m,
    /^Authentication-Results:/m,
    /^DKIM-Signature:/m,
    /^X-Mailer:/m,
    /^X-Originating-IP:/m,
    /^Content-Type:/m,
    /^MIME-Version:/m,
    /^Message-ID:/m,
    /^Date:/m,
    /^Subject:/m,
    /^To:/m,
  ];
  let matchCount = 0;
  for (const p of headerPatterns) {
    if (p.test(content)) matchCount++;
    if (matchCount >= 2) return true;
  }
  return false;
}

function getAIRiskColor(level: string) {
  switch (level) {
    case "Low": return "text-green-600 dark:text-green-400";
    case "Moderate": return "text-amber-600 dark:text-amber-400";
    case "High": return "text-orange-600 dark:text-orange-400";
    case "Critical": return "text-red-600 dark:text-red-400";
    default: return "text-muted-foreground";
  }
}

function getAIRiskBg(level: string) {
  switch (level) {
    case "Low": return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
    case "Moderate": return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800";
    case "High": return "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
    case "Critical": return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
    default: return "bg-muted";
  }
}

function getAIRiskIcon(level: string) {
  switch (level) {
    case "Low": return <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />;
    case "Moderate": return <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
    case "High": return <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />;
    case "Critical": return <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />;
    default: return <Shield className="w-6 h-6 text-muted-foreground" />;
  }
}

export function ScamChecker() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const [headerResult, setHeaderResult] = useState<EmailHeaderAnalysis | null>(null);

  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [urlReputations, setUrlReputations] = useState<Record<string, URLReputationResult>>({});
  const [isCheckingReputation, setIsCheckingReputation] = useState<Record<string, boolean>>({});

  const [sslResults, setSslResults] = useState<Record<string, SSLCheckResult>>({});
  const [isCheckingSSL, setIsCheckingSSL] = useState<Record<string, boolean>>({});

  const handleScan = () => {
    if (!content.trim()) return;

    setIsChecking(true);
    setResult(null);
    setHeaderResult(null);
    setAiResult(null);
    setAiError(null);
    setUrlReputations({});
    setSslResults({});

    setTimeout(() => {
      const patternResult = analyzeContent(content);
      setResult(patternResult);
      setIsChecking(false);
      trackToolUsage('scam-checker', true, { type: 'content-analysis' });
    }, 1200);

    if (detectEmailHeaders(content)) {
      setTimeout(() => {
        setHeaderResult(analyzeEmailHeaders(content));
      }, 800);
    }

    setIsAiAnalyzing(true);
    fetch("/api/security/ai-scam-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, contentType: "auto" }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("AI analysis failed");
        }
        const data = await response.json();
        if (data.success && data.result) {
          setAiResult(data.result);
        } else {
          throw new Error("AI analysis returned no results");
        }
      })
      .catch(() => {
        setAiError("AI analysis is currently unavailable. Pattern-based results are shown above.");
      })
      .finally(() => {
        setIsAiAnalyzing(false);
      });
  };

  const handleClear = () => {
    setContent("");
    setResult(null);
    setHeaderResult(null);
    setAiResult(null);
    setAiError(null);
    setIsChecking(false);
    setIsAiAnalyzing(false);
    setUrlReputations({});
    setSslResults({});
    setIsCheckingReputation({});
    setIsCheckingSSL({});
  };

  const checkUrlReputation = async (url: string) => {
    setIsCheckingReputation(prev => ({ ...prev, [url]: true }));
    try {
      const response = await fetch('/api/security/check-url-reputation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (!response.ok) throw new Error('Failed to check URL reputation');
      const data = await response.json();
      setUrlReputations(prev => ({ ...prev, [url]: data }));
    } catch {
      setUrlReputations(prev => ({
        ...prev,
        [url]: {
          url,
          threatLevel: 'unknown',
          phishTank: { checked: false, isPhishing: null, error: 'Service unavailable' },
          urlhaus: { checked: false, isMalware: null, error: 'Service unavailable' },
          checkedAt: new Date().toISOString()
        }
      }));
    } finally {
      setIsCheckingReputation(prev => ({ ...prev, [url]: false }));
    }
  };

  const checkSSL = async (url: string) => {
    if (!url.startsWith('https://')) {
      setSslResults(prev => ({
        ...prev,
        [url]: {
          success: false, url, checked: true, valid: false,
          isExpired: false, isEV: false, isSelfSigned: false,
          riskLevel: 'high', error: 'Site does not use HTTPS'
        }
      }));
      return;
    }
    setIsCheckingSSL(prev => ({ ...prev, [url]: true }));
    try {
      const response = await fetch('/api/security/check-ssl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (!response.ok) throw new Error('Failed to check SSL');
      const data = await response.json();
      setSslResults(prev => ({ ...prev, [url]: data }));
    } catch {
      setSslResults(prev => ({
        ...prev,
        [url]: {
          success: false, url, checked: false, valid: false,
          isExpired: false, isEV: false, isSelfSigned: false,
          riskLevel: 'high', error: 'Check failed'
        }
      }));
    } finally {
      setIsCheckingSSL(prev => ({ ...prev, [url]: false }));
    }
  };

  const checkAllUrlReputations = async (urls: URLAnalysis[]) => {
    const urlsToCheck = urls.filter(u => !urlReputations[u.url] && !isCheckingReputation[u.url]);
    const sslToCheck = urls.filter(u => !sslResults[u.url] && !isCheckingSSL[u.url]);
    await Promise.all([
      ...urlsToCheck.map(u => checkUrlReputation(u.url)),
      ...sslToCheck.map(u => checkSSL(u.url))
    ]);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "safe": return "text-green-600 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
      case "low": return "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800";
      case "medium": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
      case "high": return "text-orange-600 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
      case "critical": return "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
      default: return "";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "safe": return <CheckCircle2 className="w-8 h-8 text-green-500" />;
      case "low": return <Shield className="w-8 h-8 text-blue-500" />;
      case "medium": return <Eye className="w-8 h-8 text-yellow-500" />;
      case "high": return <AlertTriangle className="w-8 h-8 text-orange-500" />;
      case "critical": return <XCircle className="w-8 h-8 text-red-500" />;
      default: return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
      case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "high": return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300";
      case "critical": return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300";
    }
  };

  return (
    <Card className="w-full" data-testid="card-scam-checker">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Scam Checker</CardTitle>
            <p className="text-sm text-muted-foreground">Paste anything suspicious and we'll analyze it instantly with pattern matching and AI</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea
          placeholder={"Paste anything suspicious here \u2014 a text message, email, email headers, URL, or any combination.\n\nWe'll automatically detect the content type and analyze it for threats using pattern matching and AI.\n\nExamples:\n\u2022 'URGENT: Your bank account has been compromised! Click bit.ly/secure-now'\n\u2022 A full email with headers and body\n\u2022 https://amaz0n-security.com/verify-account"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[180px] resize-none text-sm"
          aria-label="Enter suspicious content to analyze"
          data-testid="input-scan-content"
        />

        <div className="flex gap-3">
          <Button
            className="flex-1 gap-2"
            onClick={handleScan}
            disabled={!content.trim() || isChecking}
            size="lg"
            aria-label={isChecking ? "Scanning content for threats" : "Scan content for threats"}
            aria-busy={isChecking}
            data-testid="button-scan-threats"
          >
            {isChecking ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" role="status" aria-label="Scanning" />
                Scanning...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" aria-hidden="true" />
                Scan for Threats
              </>
            )}
          </Button>
          {(content || result || aiResult) && (
            <Button
              variant="outline"
              onClick={handleClear}
              size="lg"
              data-testid="button-clear-scan"
            >
              Clear
            </Button>
          )}
        </div>

        {result && result.overallRisk && (
          <div className="space-y-4" role="region" aria-label="Pattern analysis results" aria-live="polite" data-testid="result-pattern-analysis">
            <div className={`p-6 rounded-xl border-2 ${getRiskColor(result.overallRisk)}`} role="alert">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getRiskIcon(result.overallRisk)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{result.title}</h3>
                    <Badge variant="secondary" className="font-mono">
                      {result.confidenceScore}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm opacity-90">{result.summary}</p>
                </div>
              </div>
            </div>

            {result.urgencyAnalysis && result.urgencyAnalysis.score > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Pressure/Urgency Analysis
                  </h4>
                  <Badge className={
                    result.urgencyAnalysis.score >= 70 ? "bg-red-500 text-white" :
                    result.urgencyAnalysis.score >= 50 ? "bg-orange-500 text-white" :
                    result.urgencyAnalysis.score >= 30 ? "bg-yellow-500 text-black" :
                    "bg-blue-500 text-white"
                  }>
                    {result.urgencyAnalysis.level}
                  </Badge>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Manipulation Level</span>
                    <span className="font-medium">{result.urgencyAnalysis.score}/100</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        result.urgencyAnalysis.score >= 70 ? "bg-red-500" :
                        result.urgencyAnalysis.score >= 50 ? "bg-orange-500" :
                        result.urgencyAnalysis.score >= 30 ? "bg-yellow-500" :
                        "bg-blue-500"
                      }`}
                      style={{ width: `${result.urgencyAnalysis.score}%` }}
                    />
                  </div>
                </div>

                {result.urgencyAnalysis.triggers.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Detected manipulation tactics:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.urgencyAnalysis.triggers.map((trigger, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {result.threats.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Detected Threats ({result.threats.length})
                </h4>
                <div className="space-y-2">
                  {result.threats.map((threat, idx) => (
                    <div key={idx} className="p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(threat.severity)}>
                          {threat.severity.toUpperCase()}
                        </Badge>
                        <span className="font-medium text-sm">{threat.category}</span>
                      </div>
                      <p className="text-sm font-medium mb-1">{threat.indicator}</p>
                      <p className="text-sm text-muted-foreground">{threat.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.urls.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-blue-500" />
                    URL Analysis ({result.urls.length})
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => checkAllUrlReputations(result.urls)}
                    disabled={Object.values(isCheckingReputation).some(v => v)}
                    data-testid="button-check-url-reputation"
                  >
                    {Object.values(isCheckingReputation).some(v => v) ? (
                      <>
                        <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                        Checking Databases...
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3 mr-2" />
                        Check Threat Databases
                      </>
                    )}
                  </Button>
                </div>
                <div className="space-y-2">
                  {result.urls.map((urlAnalysis, idx) => {
                    const reputation = urlReputations[urlAnalysis.url];
                    const isUrlChecking = isCheckingReputation[urlAnalysis.url];
                    const sslResult = sslResults[urlAnalysis.url];
                    const isSslChecking = isCheckingSSL[urlAnalysis.url];

                    return (
                      <div key={idx} className={`p-3 rounded-lg border ${urlAnalysis.isSuspicious ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'}`}>
                        <div className="flex items-start gap-2">
                          {urlAnalysis.isSuspicious ? (
                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-mono break-all">{urlAnalysis.url}</p>
                            {urlAnalysis.reasons.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {urlAnalysis.reasons.map((reason, ridx) => (
                                  <Badge key={ridx} variant="secondary" className="text-xs">
                                    {reason}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {isUrlChecking && (
                              <div className="mt-2 p-2 bg-muted/50 rounded border flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                <span className="text-xs text-muted-foreground">Checking threat databases...</span>
                              </div>
                            )}

                            {reputation && !isUrlChecking && (
                              <div className="mt-2 p-2 bg-muted/30 rounded border space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium">Threat Database Check:</span>
                                  {reputation.threatLevel === 'dangerous' && (
                                    <Badge className="bg-red-500 text-white text-xs">DANGEROUS</Badge>
                                  )}
                                  {reputation.threatLevel === 'safe' && (
                                    <Badge className="bg-blue-500 text-white text-xs">Not in known threat lists</Badge>
                                  )}
                                  {reputation.threatLevel === 'unknown' && (
                                    <Badge variant="secondary" className="text-xs">Check failed</Badge>
                                  )}
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div className={`p-1.5 rounded ${
                                    reputation.phishTank.isPhishing
                                      ? 'bg-red-100 dark:bg-red-950/50'
                                      : reputation.phishTank.checked
                                        ? 'bg-green-100 dark:bg-green-950/50'
                                        : 'bg-gray-100 dark:bg-gray-800'
                                  }`}>
                                    <div className="font-medium flex items-center gap-1">
                                      {reputation.phishTank.isPhishing ? (
                                        <XCircle className="w-3 h-3 text-red-500" />
                                      ) : reputation.phishTank.checked ? (
                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                      ) : (
                                        <Info className="w-3 h-3 text-gray-400" />
                                      )}
                                      Phishing
                                    </div>
                                    <div className="text-muted-foreground">
                                      {reputation.phishTank.isPhishing
                                        ? 'DANGER - Fake site'
                                        : reputation.phishTank.checked
                                          ? 'Not flagged'
                                          : 'Pending'}
                                    </div>
                                  </div>

                                  <div className={`p-1.5 rounded ${
                                    reputation.urlhaus.isMalware
                                      ? 'bg-red-100 dark:bg-red-950/50'
                                      : reputation.urlhaus.checked
                                        ? 'bg-green-100 dark:bg-green-950/50'
                                        : 'bg-gray-100 dark:bg-gray-800'
                                  }`}>
                                    <div className="font-medium flex items-center gap-1">
                                      {reputation.urlhaus.isMalware ? (
                                        <XCircle className="w-3 h-3 text-red-500" />
                                      ) : reputation.urlhaus.checked ? (
                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                      ) : (
                                        <Info className="w-3 h-3 text-gray-400" />
                                      )}
                                      Malware
                                    </div>
                                    <div className="text-muted-foreground">
                                      {reputation.urlhaus.isMalware
                                        ? `DANGER - ${reputation.urlhaus.threat || 'Harmful'}`
                                        : reputation.urlhaus.checked
                                          ? 'Not flagged'
                                          : 'Pending'}
                                    </div>
                                  </div>

                                  <div className={`p-1.5 rounded ${
                                    sslResult?.valid === false
                                      ? 'bg-red-100 dark:bg-red-950/50'
                                      : sslResult?.valid
                                        ? 'bg-green-100 dark:bg-green-950/50'
                                        : isSslChecking
                                          ? 'bg-blue-50 dark:bg-blue-950/50'
                                          : 'bg-gray-100 dark:bg-gray-800'
                                  }`}>
                                    <div className="font-medium flex items-center gap-1">
                                      {isSslChecking ? (
                                        <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                      ) : sslResult?.valid === false ? (
                                        <XCircle className="w-3 h-3 text-red-500" />
                                      ) : sslResult?.valid ? (
                                        <Lock className="w-3 h-3 text-green-500" />
                                      ) : (
                                        <Lock className="w-3 h-3 text-gray-400" />
                                      )}
                                      Secure
                                    </div>
                                    <div className="text-muted-foreground">
                                      {isSslChecking
                                        ? 'Checking...'
                                        : sslResult?.error?.includes('HTTPS')
                                          ? 'Not secure'
                                          : sslResult?.valid
                                            ? sslResult.isEV ? 'Verified' : 'Yes'
                                            : sslResult?.isExpired
                                              ? 'Expired'
                                              : sslResult?.isSelfSigned
                                                ? 'Unverified'
                                                : 'Pending'}
                                    </div>
                                  </div>
                                </div>

                                {(reputation.phishTank.isPhishing || reputation.urlhaus.isMalware) && (
                                  <div className="text-xs text-red-600 dark:text-red-400 font-medium p-1 bg-red-100/50 dark:bg-red-900/30 rounded">
                                    This URL is in known threat databases. Do NOT visit this link.
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded flex items-start gap-2">
                  <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>
                    Links are checked against security databases for phishing, malware, and connection safety.
                    Note: New threats take time to be reported. Always exercise caution with unfamiliar links.
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                What You Should Do
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {(isAiAnalyzing || aiResult || aiError) && (
          <div data-testid="result-ai-analysis">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  AI Deep Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAiAnalyzing && (
                  <div className="flex items-center gap-3 py-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">AI is analyzing your content...</p>
                      <p className="text-xs text-muted-foreground">This typically takes a few seconds</p>
                    </div>
                  </div>
                )}

                {aiError && !isAiAnalyzing && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>{aiError}</p>
                  </div>
                )}

                {aiResult && !isAiAnalyzing && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${getAIRiskBg(aiResult.scamRiskLevel)}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getAIRiskIcon(aiResult.scamRiskLevel)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className={`text-lg font-bold ${getAIRiskColor(aiResult.scamRiskLevel)}`}>
                              {aiResult.scamRiskLevel} Risk
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {aiResult.contentTypeDetected}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground">{aiResult.summary}</p>
                        </div>
                      </div>
                    </div>

                    {aiResult.keyRedFlags.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          Key Red Flags
                        </h4>
                        <ul className="space-y-1.5">
                          {aiResult.keyRedFlags.map((flag, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                              <span className="text-foreground">{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiResult.technicalObservations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                          <Eye className="w-4 h-4 text-blue-500" />
                          Technical Observations
                        </h4>
                        <ul className="space-y-1.5">
                          {aiResult.technicalObservations.map((obs, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <FileText className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span className="text-foreground">{obs}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiResult.recommendedActions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-primary" />
                          Recommended Actions
                        </h4>
                        <ul className="space-y-1.5">
                          {aiResult.recommendedActions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-foreground">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Confidence:</span> {aiResult.confidenceLevel}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {headerResult && (
          <div className="space-y-4" data-testid="result-header-analysis">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Email Header Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-xl border-2 ${getRiskColor(headerResult.overallRisk)}`}>
                  <div className="flex items-center gap-3">
                    {getRiskIcon(headerResult.overallRisk)}
                    <div>
                      <h3 className="font-bold text-lg">
                        {headerResult.overallRisk === "safe" ? "Headers Look Legitimate" :
                         headerResult.overallRisk === "low" ? "Minor Concerns Found" :
                         headerResult.overallRisk === "medium" ? "Some Issues Detected" :
                         headerResult.overallRisk === "high" ? "Significant Issues Found" :
                         "Critical Authentication Failures"}
                      </h3>
                      <p className="text-sm opacity-90">
                        {headerResult.findings.length} finding(s) from email header analysis
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className={`p-3 rounded-lg text-center ${
                    headerResult.parsedHeaders.spf === "pass" ? "bg-green-50 dark:bg-green-950/30" :
                    headerResult.parsedHeaders.spf === "fail" ? "bg-red-50 dark:bg-red-950/30" :
                    "bg-muted/50"
                  }`}>
                    <p className="text-xs text-muted-foreground mb-1">SPF</p>
                    <Badge variant={headerResult.parsedHeaders.spf === "pass" ? "default" : headerResult.parsedHeaders.spf === "fail" ? "destructive" : "secondary"}>
                      {headerResult.parsedHeaders.spf || "N/A"}
                    </Badge>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                    headerResult.parsedHeaders.dkim === "pass" ? "bg-green-50 dark:bg-green-950/30" :
                    headerResult.parsedHeaders.dkim === "fail" ? "bg-red-50 dark:bg-red-950/30" :
                    "bg-muted/50"
                  }`}>
                    <p className="text-xs text-muted-foreground mb-1">DKIM</p>
                    <Badge variant={headerResult.parsedHeaders.dkim === "pass" ? "default" : headerResult.parsedHeaders.dkim === "fail" ? "destructive" : "secondary"}>
                      {headerResult.parsedHeaders.dkim || "N/A"}
                    </Badge>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                    headerResult.parsedHeaders.dmarc === "pass" ? "bg-green-50 dark:bg-green-950/30" :
                    headerResult.parsedHeaders.dmarc === "fail" ? "bg-red-50 dark:bg-red-950/30" :
                    "bg-muted/50"
                  }`}>
                    <p className="text-xs text-muted-foreground mb-1">DMARC</p>
                    <Badge variant={headerResult.parsedHeaders.dmarc === "pass" ? "default" : headerResult.parsedHeaders.dmarc === "fail" ? "destructive" : "secondary"}>
                      {headerResult.parsedHeaders.dmarc || "N/A"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Analysis Findings
                  </h4>
                  {headerResult.findings.map((finding, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        finding.status === "pass" ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800" :
                        finding.status === "fail" ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800" :
                        finding.status === "warning" ? "bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800" :
                        "bg-muted/30 border-muted"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {finding.status === "pass" && <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />}
                        {finding.status === "fail" && <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
                        {finding.status === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />}
                        {finding.status === "info" && <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />}
                        <div>
                          <p className="font-medium text-sm">{finding.category}</p>
                          <p className="text-sm text-muted-foreground">{finding.detail}</p>
                          <p className="text-xs text-muted-foreground mt-1">{finding.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {headerResult.recommendations.length > 0 && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {headerResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                          <span className="mt-1">&bull;</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {headerResult.parsedHeaders.from && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Extracted Information</p>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">From:</span> {headerResult.parsedHeaders.from}</p>
                      {headerResult.parsedHeaders.replyTo && (
                        <p><span className="text-muted-foreground">Reply-To:</span> {headerResult.parsedHeaders.replyTo}</p>
                      )}
                      {headerResult.parsedHeaders.xMailer && (
                        <p><span className="text-muted-foreground">Mailer:</span> {headerResult.parsedHeaders.xMailer}</p>
                      )}
                      <p><span className="text-muted-foreground">Hops:</span> {headerResult.parsedHeaders.receivedChain.length} server(s)</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <SignupEncouragementBanner
          toolName="scam-checker"
          show={!!(result || aiResult || headerResult)}
          contextMessage="Save this scan to your history?"
        />

        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              This tool uses advanced pattern matching and AI to detect scam indicators. While highly accurate,
              no automated tool is 100% reliable. When in doubt, don't engage and verify through official channels.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://reportfraud.ftc.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-1 hover:underline"
              >
                Report to FTC <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.ic3.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-1 hover:underline"
              >
                Report to FBI IC3 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
