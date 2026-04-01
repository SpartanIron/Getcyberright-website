import { db } from "./db";
import { cyberSafetyGuides, scamIntelligence, cyberThreatAlerts } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export async function seedInitialContent() {
  const [guideCount] = await db.select({ count: sql<number>`count(*)::int` }).from(cyberSafetyGuides);
  const [scamCount] = await db.select({ count: sql<number>`count(*)::int` }).from(scamIntelligence);
  const [alertCount] = await db.select({ count: sql<number>`count(*)::int` }).from(cyberThreatAlerts);

  if (guideCount.count > 0 && scamCount.count > 0 && alertCount.count > 0) {
    console.log("[content-seed] Content already seeded, skipping");
  } else {
    console.log("[content-seed] Seeding initial content...");

    if (guideCount.count === 0) {
      await seedGuides();
    }
    if (scamCount.count === 0) {
      await seedScamIntel();
    }
    if (alertCount.count === 0) {
      await seedAlerts();
    }

    console.log("[content-seed] Initial content seeded successfully");
  }

  await ensureCriticalGuides();
  await ensureAdditionalScamIntel();
  await ensureAdditionalAlerts();
  await ensureAdditionalGuides();
}

async function seedGuides() {
  const guides = [
    {
      slug: "how-to-prevent-identity-theft",
      title: "How to Prevent Identity Theft: A Complete Guide",
      metaDescription: "Learn the essential steps to protect your personal information from identity thieves. Practical tips for freezing credit, monitoring accounts, and securing your data.",
      category: "identity-theft",
      cluster: "identity_theft",
      tags: ["identity theft", "fraud prevention", "credit freeze"],
      targetKeywords: ["how to prevent identity theft", "identity theft protection", "stop identity theft"],
      content: `<h2 id="what-is-identity-theft">What Is Identity Theft?</h2>
<p>Identity theft happens when someone steals your personal information and uses it without your permission. This can include your name, Social Security number, credit card details, or other financial information. Criminals use this stolen data to open new accounts, make purchases, or commit fraud in your name.</p>

<h2 id="warning-signs">Warning Signs Your Identity May Be Stolen</h2>
<ul>
<li>Unexpected bills or collection notices for accounts you did not open</li>
<li>Unfamiliar charges on your credit card or bank statements</li>
<li>Missing mail, especially financial statements</li>
<li>Denied credit applications when you have good credit</li>
<li>IRS notices about unreported income or duplicate tax filings</li>
<li>Calls from debt collectors about debts you do not owe</li>
</ul>

<h2 id="essential-prevention-steps">Essential Prevention Steps</h2>
<h3>1. Freeze Your Credit</h3>
<p>Contact all three credit bureaus (Equifax, Experian, TransUnion) and place a credit freeze. This prevents anyone from opening new accounts in your name. It is free and does not affect your credit score.</p>

<h3>2. Use Strong, Unique Passwords</h3>
<p>Create different passwords for every account. Use a password manager to keep track of them. Enable two-factor authentication wherever possible.</p>

<h3>3. Monitor Your Accounts Regularly</h3>
<p>Check your bank and credit card statements weekly. Review your credit report at least once a year at AnnualCreditReport.com. Set up alerts for unusual activity.</p>

<h3>4. Protect Your Social Security Number</h3>
<p>Never carry your Social Security card in your wallet. Only share your number when absolutely necessary. Ask why it is needed and how it will be protected.</p>

<h3>5. Secure Your Mail</h3>
<p>Use a locked mailbox or P.O. box. Shred financial documents before discarding them. Sign up for electronic statements when possible.</p>

<h3>6. Be Careful Online</h3>
<p>Watch out for phishing emails and fake websites. Only enter personal information on secure websites (look for https:// and a padlock icon). Avoid public WiFi for banking or shopping.</p>

<h2 id="what-to-do-if-identity-stolen">What to Do If Your Identity Is Stolen</h2>
<ol>
<li>Place a fraud alert on your credit reports</li>
<li>Review your credit reports and dispute fraudulent accounts</li>
<li>File a report at IdentityTheft.gov</li>
<li>File a police report</li>
<li>Close any accounts that were opened fraudulently</li>
<li>Change all passwords and security questions</li>
</ol>`,
      headings: [
        { level: 2, text: "What Is Identity Theft?", id: "what-is-identity-theft" },
        { level: 2, text: "Warning Signs Your Identity May Be Stolen", id: "warning-signs" },
        { level: 2, text: "Essential Prevention Steps", id: "essential-prevention-steps" },
        { level: 2, text: "What to Do If Your Identity Is Stolen", id: "what-to-do-if-identity-stolen" },
      ],
      tableOfContents: [
        { text: "What Is Identity Theft?", anchor: "what-is-identity-theft", level: 2 },
        { text: "Warning Signs", anchor: "warning-signs", level: 2 },
        { text: "Essential Prevention Steps", anchor: "essential-prevention-steps", level: 2 },
        { text: "What to Do If Stolen", anchor: "what-to-do-if-identity-stolen", level: 2 },
      ],
      faq: [
        { question: "How common is identity theft?", answer: "The FTC received over 1 million identity theft reports in 2023. It is one of the most common forms of consumer fraud." },
        { question: "Does freezing my credit hurt my score?", answer: "No. A credit freeze has no impact on your credit score. You can temporarily lift it when you need to apply for credit." },
        { question: "How do thieves steal identities?", answer: "Common methods include phishing emails, data breaches, stolen mail, social engineering, and malware." },
      ],
      wordCount: 650,
      readingTimeMinutes: 4,
      relatedScamSlugs: ["identity-theft"],
      relatedToolPaths: ["/data-removal", "/breach-dashboard"],
    },
    {
      slug: "how-to-detect-phishing-emails",
      title: "How to Detect Phishing Emails: Red Flags and Real Examples",
      metaDescription: "Learn to spot phishing emails before they trick you. See real examples of phishing attacks and the warning signs that give them away.",
      category: "phishing",
      cluster: "phishing",
      tags: ["phishing", "email security", "scam detection"],
      targetKeywords: ["how to detect phishing emails", "phishing email examples", "spot phishing"],
      content: `<h2 id="what-is-phishing">What Is Phishing?</h2>
<p>Phishing is when criminals send fake emails, texts, or messages that look like they come from trusted companies. Their goal is to trick you into clicking a link, downloading a file, or sharing personal information like passwords and credit card numbers.</p>

<h2 id="red-flags">Red Flags That Reveal a Phishing Email</h2>
<ul>
<li><strong>Urgency or threats:</strong> "Your account will be closed in 24 hours" or "Immediate action required"</li>
<li><strong>Generic greetings:</strong> "Dear Customer" or "Dear User" instead of your actual name</li>
<li><strong>Suspicious sender address:</strong> Check the actual email address, not just the display name. Look for misspellings like "support@paypa1.com"</li>
<li><strong>Unexpected attachments:</strong> Legitimate companies rarely send unexpected attachments</li>
<li><strong>Mismatched links:</strong> Hover over links to see where they actually go. The URL might not match the company it claims to be</li>
<li><strong>Poor grammar and spelling:</strong> Many phishing emails contain obvious errors</li>
<li><strong>Requests for personal information:</strong> Real companies never ask for passwords, PINs, or full Social Security numbers via email</li>
</ul>

<h2 id="real-examples">Real Examples of Phishing Emails</h2>
<h3>Fake PayPal Alert</h3>
<p>"Your PayPal account has been limited. Click here to restore access." The link leads to a fake website that looks identical to PayPal but steals your login credentials.</p>

<h3>Fake Bank Notice</h3>
<p>"We detected unusual activity on your account. Verify your identity now." This creates panic and pushes you to click without thinking.</p>

<h3>Fake Package Delivery</h3>
<p>"Your package could not be delivered. Click to reschedule." These spike during holiday shopping seasons.</p>

<h2 id="how-to-protect-yourself">How to Protect Yourself</h2>
<ol>
<li>Never click links in unexpected emails. Go directly to the company website by typing the address yourself</li>
<li>Check the sender email address carefully</li>
<li>When in doubt, call the company directly using a number from their official website</li>
<li>Use email filtering and spam protection</li>
<li>Keep your browser and antivirus software up to date</li>
<li>Enable two-factor authentication on all accounts</li>
</ol>`,
      headings: [
        { level: 2, text: "What Is Phishing?", id: "what-is-phishing" },
        { level: 2, text: "Red Flags That Reveal a Phishing Email", id: "red-flags" },
        { level: 2, text: "Real Examples of Phishing Emails", id: "real-examples" },
        { level: 2, text: "How to Protect Yourself", id: "how-to-protect-yourself" },
      ],
      tableOfContents: [
        { text: "What Is Phishing?", anchor: "what-is-phishing", level: 2 },
        { text: "Red Flags", anchor: "red-flags", level: 2 },
        { text: "Real Examples", anchor: "real-examples", level: 2 },
        { text: "How to Protect Yourself", anchor: "how-to-protect-yourself", level: 2 },
      ],
      faq: [
        { question: "What should I do if I clicked a phishing link?", answer: "Change your passwords immediately, run antivirus scans, monitor your accounts for unauthorized activity, and report the phishing attempt to the company being impersonated." },
        { question: "Can phishing emails contain malware?", answer: "Yes. Phishing emails often include malicious attachments or links that download malware to your device." },
        { question: "How do I report phishing?", answer: "Forward phishing emails to reportphishing@apwg.org. You can also report to the FTC at reportfraud.ftc.gov." },
      ],
      wordCount: 580,
      readingTimeMinutes: 3,
      relatedScamSlugs: ["phishing"],
      relatedToolPaths: ["/tools"],
    },
    {
      slug: "protecting-seniors-from-online-scams",
      title: "Protecting Seniors from Online Scams: A Family Guide",
      metaDescription: "Help protect older adults from common online scams. Learn the scam tactics that target seniors and practical steps families can take together.",
      category: "seniors",
      cluster: "seniors",
      tags: ["seniors", "elder fraud", "family safety"],
      targetKeywords: ["protecting seniors from scams", "elder fraud prevention", "scams targeting seniors"],
      content: `<h2 id="why-scammers-target-seniors">Why Scammers Target Seniors</h2>
<p>Older adults are more frequently targeted by scammers because they tend to be more trusting, may be less familiar with digital technology, and often have accumulated savings. According to the FTC, older adults reported losing over $1.9 billion to fraud in 2023, while the FBI IC3 documented $3.4 billion in losses from cyber-enabled fraud targeting people over 60. The UK's Action Fraud service and Australia's ACSC report similar upward trends globally.</p>

<h2 id="common-scams">Common Scams Targeting Seniors</h2>
<h3>Tech Support Scams</h3>
<p>Scammers call or display pop-up warnings claiming your computer is infected. They ask for remote access or payment to "fix" a problem that does not exist.</p>

<h3>Grandparent Scams</h3>
<p>A caller pretends to be a grandchild in trouble, asking for money to be wired immediately. They may say "Don't tell Mom and Dad."</p>

<h3>Medicare and Health Insurance Scams</h3>
<p>Scammers pose as Medicare representatives to steal personal information or charge for fake services.</p>

<h3>Romance Scams</h3>
<p>Scammers build emotional relationships online, then ask for money. These can go on for months before the request for money comes.</p>

<h3>Government Impersonation Scams</h3>
<p>Callers claim to be from the IRS, Social Security Administration, or other agencies, threatening arrest or benefit suspension unless payment is made immediately.</p>

<h2 id="protection-strategies">Protection Strategies for Families</h2>
<ul>
<li>Have regular conversations about common scams without being condescending</li>
<li>Help set up call blocking and spam filters on phones</li>
<li>Establish a family code word for verifying emergency requests</li>
<li>Review bank statements together regularly</li>
<li>Set up account alerts for large transactions</li>
<li>Put phone numbers of banks and agencies in their contacts so they can verify calls directly</li>
<li>Remind them that no legitimate organization asks for payment in gift cards or cryptocurrency</li>
</ul>

<h2 id="what-to-do-if-scammed">What to Do If a Senior Has Been Scammed</h2>
<ol>
<li>Stay calm and supportive. Shame only prevents reporting</li>
<li>Contact the bank immediately to stop transactions</li>
<li>Report to local law enforcement</li>
<li>File a complaint with the FTC at reportfraud.ftc.gov</li>
<li>Contact the Elder Fraud Hotline: 1-833-FRAUD-11</li>
</ol>`,
      headings: [
        { level: 2, text: "Why Scammers Target Seniors", id: "why-scammers-target-seniors" },
        { level: 2, text: "Common Scams Targeting Seniors", id: "common-scams" },
        { level: 2, text: "Protection Strategies for Families", id: "protection-strategies" },
        { level: 2, text: "What to Do If a Senior Has Been Scammed", id: "what-to-do-if-scammed" },
      ],
      tableOfContents: [
        { text: "Why Scammers Target Seniors", anchor: "why-scammers-target-seniors", level: 2 },
        { text: "Common Scams", anchor: "common-scams", level: 2 },
        { text: "Protection Strategies", anchor: "protection-strategies", level: 2 },
        { text: "What to Do If Scammed", anchor: "what-to-do-if-scammed", level: 2 },
      ],
      faq: [
        { question: "How much do seniors lose to scams each year?", answer: "In the US alone, the FTC and FBI IC3 report billions in annual losses for adults over 60. The UK's Action Fraud, Australia's ACSC, and Europol all report similar rising trends worldwide, making elder fraud a global crisis." },
        { question: "What is the most common scam targeting seniors?", answer: "Tech support scams and government impersonation scams are among the most reported. Romance scams cause the highest average financial losses." },
        { question: "How can I help without being patronizing?", answer: "Frame it as something you do together. Share your own experiences with suspicious messages. Make it a family safety practice, not a lecture." },
      ],
      wordCount: 560,
      readingTimeMinutes: 3,
      relatedScamSlugs: ["grandparent-scam", "tech-support-scam", "romance-scam"],
      relatedToolPaths: ["/seniors", "/tools"],
    },
    {
      slug: "online-privacy-protection-guide",
      title: "Online Privacy Protection: How to Keep Your Data Safe",
      metaDescription: "Practical steps to protect your online privacy. Learn how companies track you, what data brokers sell about you, and how to take back control of your personal data.",
      category: "privacy",
      cluster: "privacy",
      tags: ["privacy", "data protection", "data brokers"],
      targetKeywords: ["online privacy protection", "protect personal data online", "internet privacy guide"],
      content: `<h2 id="why-privacy-matters">Why Online Privacy Matters</h2>
<p>Every time you browse the web, use an app, or make an online purchase, you leave behind digital traces. Companies collect, analyze, and sell this information. Data brokers compile detailed profiles about you, including your name, address, phone number, income, health conditions, and browsing habits.</p>

<h2 id="how-youre-tracked">How You Are Being Tracked Online</h2>
<ul>
<li><strong>Cookies and trackers:</strong> Websites place tracking files on your device to follow your activity across the internet</li>
<li><strong>App permissions:</strong> Many apps request access to your contacts, location, camera, and microphone</li>
<li><strong>Social media:</strong> Everything you post, like, share, and even view is recorded and used for advertising</li>
<li><strong>Data brokers:</strong> Over 500 companies buy and sell your personal information without your knowledge</li>
<li><strong>Public records:</strong> Property records, court records, and voter registration data are often scraped and published online</li>
</ul>

<h2 id="essential-privacy-steps">Essential Privacy Protection Steps</h2>
<h3>1. Audit Your Digital Footprint</h3>
<p>Search for yourself online. See what information is publicly available. Use our Data Broker Removal tool to scan for your exposed data across 500+ broker sites.</p>

<h3>2. Lock Down Your Social Media</h3>
<p>Review privacy settings on every platform. Limit who can see your posts and personal information. Remove any details that could be used for identity theft.</p>

<h3>3. Use Privacy-Focused Tools</h3>
<p>Use a privacy-focused browser or extensions that block trackers. Consider a VPN for public WiFi. Use encrypted messaging apps for sensitive conversations.</p>

<h3>4. Manage App Permissions</h3>
<p>Review what permissions each app has on your phone. Remove access to camera, microphone, and location for apps that do not need them.</p>

<h3>5. Opt Out of Data Brokers</h3>
<p>Submit removal requests to data broker sites. This can be time-consuming manually, which is why we built our automated Data Broker Removal tool.</p>`,
      headings: [
        { level: 2, text: "Why Online Privacy Matters", id: "why-privacy-matters" },
        { level: 2, text: "How You Are Being Tracked Online", id: "how-youre-tracked" },
        { level: 2, text: "Essential Privacy Protection Steps", id: "essential-privacy-steps" },
      ],
      tableOfContents: [
        { text: "Why Privacy Matters", anchor: "why-privacy-matters", level: 2 },
        { text: "How You Are Tracked", anchor: "how-youre-tracked", level: 2 },
        { text: "Essential Steps", anchor: "essential-privacy-steps", level: 2 },
      ],
      faq: [
        { question: "What is a data broker?", answer: "A data broker is a company that collects and sells personal information about consumers. There are over 500 known data broker companies operating in the United States alone." },
        { question: "Can I delete my data from the internet?", answer: "You can remove much of your data by submitting opt-out requests to data brokers, deleting unused accounts, and adjusting privacy settings. Our Data Broker Removal tool automates this process." },
        { question: "Is incognito mode enough?", answer: "No. Incognito mode only prevents your browser from saving your history locally. Your internet provider, employer, and the websites you visit can still track you." },
      ],
      wordCount: 500,
      readingTimeMinutes: 3,
      relatedScamSlugs: [],
      relatedToolPaths: ["/data-removal", "/tools"],
    },
    {
      slug: "password-security-best-practices",
      title: "Password Security Best Practices: Create and Manage Strong Passwords",
      metaDescription: "Learn how to create strong passwords, avoid common mistakes, and use password managers. Practical password security guide for everyone.",
      category: "password-security",
      cluster: "password_security",
      tags: ["passwords", "security", "two-factor authentication"],
      targetKeywords: ["password security best practices", "create strong passwords", "password manager"],
      content: `<h2 id="why-passwords-matter">Why Password Security Matters</h2>
<p>Weak passwords are the number one way hackers break into accounts. A simple password can be cracked in seconds using automated tools. Once criminals have access to one account, they often try the same password on your other accounts.</p>

<h2 id="common-mistakes">Common Password Mistakes</h2>
<ul>
<li>Using simple passwords like "password123" or "qwerty"</li>
<li>Using personal information like birthdays or pet names</li>
<li>Reusing the same password across multiple accounts</li>
<li>Writing passwords on sticky notes near your computer</li>
<li>Sharing passwords via email or text</li>
<li>Never changing passwords, even after a data breach</li>
</ul>

<h2 id="how-to-create-strong-passwords">How to Create Strong Passwords</h2>
<p>Strong passwords should be at least 16 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters. Better yet, use a passphrase: a string of random words that is long but easy to remember.</p>
<p>Example: "correct-horse-battery-staple" is far stronger than "P@ssw0rd!" and easier to remember.</p>

<h2 id="use-a-password-manager">Use a Password Manager</h2>
<p>A password manager creates, stores, and fills in strong unique passwords for every account. You only need to remember one master password. Popular options include 1Password, Bitwarden, and Dashlane.</p>

<h2 id="enable-two-factor">Enable Two-Factor Authentication</h2>
<p>Two-factor authentication (2FA) adds a second layer of security. Even if someone steals your password, they cannot access your account without the second factor (usually a code sent to your phone or generated by an app).</p>`,
      headings: [
        { level: 2, text: "Why Password Security Matters", id: "why-passwords-matter" },
        { level: 2, text: "Common Password Mistakes", id: "common-mistakes" },
        { level: 2, text: "How to Create Strong Passwords", id: "how-to-create-strong-passwords" },
        { level: 2, text: "Use a Password Manager", id: "use-a-password-manager" },
        { level: 2, text: "Enable Two-Factor Authentication", id: "enable-two-factor" },
      ],
      tableOfContents: [
        { text: "Why It Matters", anchor: "why-passwords-matter", level: 2 },
        { text: "Common Mistakes", anchor: "common-mistakes", level: 2 },
        { text: "Creating Strong Passwords", anchor: "how-to-create-strong-passwords", level: 2 },
        { text: "Password Managers", anchor: "use-a-password-manager", level: 2 },
        { text: "Two-Factor Authentication", anchor: "enable-two-factor", level: 2 },
      ],
      faq: [
        { question: "How long should my password be?", answer: "At least 16 characters. Longer passwords are exponentially harder to crack." },
        { question: "Are password managers safe?", answer: "Yes. Reputable password managers use strong encryption to protect your data. They are much safer than reusing passwords or writing them down." },
        { question: "What is two-factor authentication?", answer: "2FA requires two different forms of identification to access an account. Even if your password is compromised, the attacker still needs the second factor." },
      ],
      wordCount: 420,
      readingTimeMinutes: 3,
      relatedScamSlugs: ["phishing"],
      relatedToolPaths: ["/password-generator"],
    },
    {
      slug: "ai-powered-scams-explained",
      title: "AI-Powered Scams: How Criminals Use Artificial Intelligence to Trick You",
      metaDescription: "Learn how scammers use AI to create deepfakes, clone voices, and write convincing phishing emails. Understand the new wave of AI-driven cyber threats.",
      category: "ai-cybersecurity",
      cluster: "online_scams",
      tags: ["AI scams", "deepfakes", "voice cloning", "AI threats"],
      targetKeywords: ["ai powered scams", "ai scams explained", "deepfake scams"],
      content: `<h2 id="what-are-ai-scams">What Are AI-Powered Scams?</h2>
<p>Artificial intelligence is giving scammers powerful new tools. They can now create fake videos that look real (deepfakes), clone someone's voice from just a few seconds of audio, and generate phishing emails that are nearly impossible to distinguish from legitimate messages.</p>

<h2 id="types-of-ai-scams">Types of AI-Driven Scams</h2>
<h3>Deepfake Video Scams</h3>
<p>Scammers create realistic videos of celebrities or executives promoting fake investments or products. These AI-generated videos are shared on social media to convince victims to send money.</p>

<h3>Voice Cloning Fraud</h3>
<p>With just 3 seconds of audio, AI can clone someone's voice. Scammers use this to call family members pretending to be a loved one in distress, asking for urgent money transfers.</p>

<h3>AI Phishing Attacks</h3>
<p>AI can write personalized phishing emails that use your actual name, reference real companies you do business with, and contain no grammar mistakes. These are much harder to detect than traditional phishing.</p>

<h3>AI Romance Scams</h3>
<p>Scammers use AI chatbots to maintain convincing conversations across dating platforms and social media, building emotional connections at scale before asking for money.</p>

<h3>Fake AI Investment Platforms</h3>
<p>Fraudulent platforms claim to use AI for guaranteed trading profits. They show fake returns to lure victims into investing larger amounts before disappearing with the money.</p>

<h2 id="how-to-protect-yourself">How to Protect Yourself from AI Scams</h2>
<ul>
<li>Verify unexpected calls from family by calling them back on a known number</li>
<li>Be skeptical of video endorsements on social media, especially for investments</li>
<li>Establish a family code word for emergency verification</li>
<li>Never send money based on a single phone call or message</li>
<li>If an investment sounds too good to be true, it is</li>
<li>Use our AI Scam Analyzer tool to check suspicious messages</li>
</ul>

<h2 id="detecting-deepfakes">How to Detect AI-Generated Content</h2>
<ul>
<li>Look for unnatural eye movements or blinking in videos</li>
<li>Check for inconsistencies in lighting and shadows</li>
<li>Listen for robotic or unnatural speech patterns in voice calls</li>
<li>Verify information through official channels, not through links in the message</li>
<li>Use our Deepfake Detector tool to analyze suspicious audio or video</li>
</ul>`,
      headings: [
        { level: 2, text: "What Are AI-Powered Scams?", id: "what-are-ai-scams" },
        { level: 2, text: "Types of AI-Driven Scams", id: "types-of-ai-scams" },
        { level: 2, text: "How to Protect Yourself", id: "how-to-protect-yourself" },
        { level: 2, text: "How to Detect AI-Generated Content", id: "detecting-deepfakes" },
      ],
      tableOfContents: [
        { text: "What Are AI-Powered Scams?", anchor: "what-are-ai-scams", level: 2 },
        { text: "Types of AI Scams", anchor: "types-of-ai-scams", level: 2 },
        { text: "How to Protect Yourself", anchor: "how-to-protect-yourself", level: 2 },
        { text: "Detecting Deepfakes", anchor: "detecting-deepfakes", level: 2 },
      ],
      faq: [
        { question: "Can AI really clone someone's voice?", answer: "Yes. Modern AI voice cloning technology can create a convincing replica of someone's voice from as little as 3 seconds of recorded audio." },
        { question: "How can I tell if a video is a deepfake?", answer: "Look for subtle signs: unnatural eye movements, mismatched lip sync, inconsistent lighting, blurry edges around the face, or odd hand movements." },
        { question: "Are AI scams increasing?", answer: "Yes. Multiple agencies confirm this trend: EUROPOL's 2024 Internet Organised Crime Threat Assessment highlights AI-generated fraud as a top emerging threat, the UK NCSC warns about AI-enabled social engineering, and the FTC reports a sharp rise in impersonation scams using voice cloning and deepfakes." },
      ],
      wordCount: 580,
      readingTimeMinutes: 4,
      relatedScamSlugs: ["crypto-scam", "romance-scam"],
      relatedToolPaths: ["/deepfake-detector", "/tools"],
    },
  ];

  const now = new Date();
  for (const guide of guides) {
    await db.insert(cyberSafetyGuides).values({
      ...guide,
      status: "published",
      publishedAt: now,
      authorName: "GetCyberRight Team",
      seoScore: 85,
    }).onConflictDoNothing();
  }
  console.log(`[content-seed] Seeded ${guides.length} cyber safety guides`);
}

async function seedScamIntel() {
  const scams = [
    {
      slug: "paypal-phishing-scam-alert",
      scamName: "PayPal Phishing Scam",
      scamCategory: "phishing",
      platformUsed: ["Email", "SMS"],
      targetAudience: ["general", "seniors"],
      regions: ["US", "EU", "GB", "CA", "AU", "GLOBAL"],
      riskLevel: "high",
      metaDescription: "Warning about PayPal phishing scam targeting users with fake account suspension emails. Learn how to recognize and avoid this scam.",
      exampleMessages: [
        { context: "Email Subject", message: "Your PayPal account has been suspended. Verify now to restore access." },
        { context: "Email Body", message: "We noticed unusual activity on your PayPal account. Click the link below to verify your identity and restore full access to your account within 24 hours." },
      ],
      warningSigns: [
        "Email sent from a non-PayPal domain (e.g., paypal-security@outlook.com)",
        "Creates false urgency with threats of account closure",
        "Generic greeting like 'Dear Customer' instead of your name",
        "Link leads to a fake PayPal login page",
        "Asks you to verify personal financial information",
      ],
      preventionTips: [
        "Always log in to PayPal directly by typing paypal.com in your browser",
        "Check the sender email address carefully",
        "PayPal will never ask for your password via email",
        "Forward suspicious emails to phishing@paypal.com",
        "Enable two-factor authentication on your PayPal account",
      ],
      howItWorks: [
        { step: 1, title: "Fake Email", description: "Scammer sends an official-looking email claiming your PayPal account has been limited or suspended." },
        { step: 2, title: "Urgent Action Required", description: "The email creates panic by saying you have 24 hours to verify your account or lose access." },
        { step: 3, title: "Fake Login Page", description: "Clicking the link takes you to a convincing replica of PayPal's login page." },
        { step: 4, title: "Credential Theft", description: "When you enter your email and password, the scammer captures your login credentials." },
        { step: 5, title: "Account Takeover", description: "The scammer uses your credentials to access your real PayPal account and drain your funds." },
      ],
      faq: [
        { question: "Does PayPal send emails about account issues?", answer: "PayPal may send legitimate notifications, but they will always address you by name and never ask you to click a link to verify personal information." },
        { question: "What should I do if I clicked a phishing link?", answer: "Change your PayPal password immediately, enable 2FA, check for unauthorized transactions, and report the incident to PayPal." },
      ],
      averageLoss: "$1,200",
    },
    {
      slug: "crypto-investment-scam-alert",
      scamName: "Cryptocurrency Investment Scam",
      scamCategory: "investment_fraud",
      platformUsed: ["Social Media", "WhatsApp", "Telegram", "Fake Websites"],
      targetAudience: ["general", "young adults"],
      regions: ["US", "EU", "GB", "GLOBAL"],
      riskLevel: "critical",
      metaDescription: "Alert about cryptocurrency investment scams promising guaranteed returns. Learn how these fraudulent platforms operate and how to protect your money.",
      exampleMessages: [
        { context: "Social Media Ad", message: "Turn $250 into $10,000 in just 30 days with our AI-powered crypto trading platform. Guaranteed returns!" },
        { context: "WhatsApp Message", message: "I started with just $500 and made $25,000 in my first month. Let me show you how. No experience needed." },
      ],
      warningSigns: [
        "Promises of guaranteed or unrealistically high returns",
        "Pressure to invest quickly before an 'opportunity' expires",
        "Celebrity endorsements that seem too good to be true",
        "Inability to withdraw your funds",
        "No verifiable company registration or regulatory license",
        "Payment only accepted in cryptocurrency",
      ],
      preventionTips: [
        "Never invest based on social media ads or unsolicited messages",
        "Verify any investment platform with the SEC or FINRA",
        "If returns sound too good to be true, they are",
        "Never send cryptocurrency to someone you met online",
        "Start with small amounts and try to withdraw before investing more",
        "Research the platform thoroughly before investing",
      ],
      howItWorks: [
        { step: 1, title: "The Hook", description: "Scammers advertise guaranteed crypto returns on social media using fake testimonials and deepfake celebrity endorsements." },
        { step: 2, title: "Initial Success", description: "After a small initial deposit, the platform shows fake profits on your dashboard to build trust." },
        { step: 3, title: "Bigger Investment", description: "Encouraged by fake gains, you invest larger amounts. The scammer may even let you withdraw a small amount to seem legitimate." },
        { step: 4, title: "Lock Out", description: "When you try to withdraw larger amounts, the platform demands 'taxes,' 'fees,' or 'insurance deposits.'" },
        { step: 5, title: "Disappearance", description: "The platform disappears, taking all invested funds. The website goes offline and contacts stop responding." },
      ],
      faq: [
        { question: "Can cryptocurrency investments guarantee returns?", answer: "No. Any platform promising guaranteed returns on crypto investments is a scam. All investments carry risk." },
        { question: "Are celebrity crypto endorsements real?", answer: "Most are fake. Scammers use deepfake technology to create convincing videos of celebrities promoting their fraudulent platforms." },
      ],
      averageLoss: "$5,800",
    },
    {
      slug: "facebook-marketplace-scam-alert",
      scamName: "Facebook Marketplace Scam",
      scamCategory: "online_fraud",
      platformUsed: ["Facebook", "Facebook Marketplace", "Messenger"],
      targetAudience: ["general", "families"],
      regions: ["US", "CA", "GB", "AU", "GLOBAL"],
      riskLevel: "high",
      metaDescription: "Warning about Facebook Marketplace scams including fake listings, overpayment fraud, and shipping scams. Learn how to buy and sell safely.",
      exampleMessages: [
        { context: "Buyer Scam", message: "I'll send you a check for $500 extra to cover the shipping. Just send the difference back via Zelle." },
        { context: "Seller Scam", message: "I can't meet in person but I'll ship the item. Just send payment via Cash App and I'll ship it today." },
      ],
      warningSigns: [
        "Price is significantly below market value",
        "Seller refuses to meet in person or show the item",
        "Buyer offers to pay more than the asking price",
        "Requests payment through gift cards, wire transfer, or crypto",
        "Newly created profile with no history or friends",
        "Rushes you to complete the transaction",
      ],
      preventionTips: [
        "Always meet in a public, well-lit place (many police stations have designated trading spots)",
        "Inspect items in person before paying",
        "Use Facebook Marketplace's built-in payment protection when available",
        "Never accept checks or overpayments",
        "Check the seller/buyer profile for age, friends, and activity",
        "If a deal seems too good to be true, it probably is",
      ],
      howItWorks: [
        { step: 1, title: "Attractive Listing", description: "Scammer posts an item at a very attractive price to generate interest quickly." },
        { step: 2, title: "Build Urgency", description: "They claim multiple buyers are interested, pressuring you to act fast." },
        { step: 3, title: "Avoid Meeting", description: "They have excuses for not meeting in person: out of town, military deployment, etc." },
        { step: 4, title: "Payment Outside Platform", description: "They ask for payment via Zelle, Venmo, Cash App, or gift cards, which have no buyer protection." },
        { step: 5, title: "Disappear", description: "After receiving payment, they block you and disappear. The item never existed or arrives as a counterfeit." },
      ],
      faq: [
        { question: "Is Facebook Marketplace safe?", answer: "It can be safe if you follow precautions: meet in person, inspect items before paying, and use payment methods with buyer protection." },
        { question: "What if I already sent money?", answer: "Contact your payment provider immediately. File a report with Facebook, local police, and the FTC." },
      ],
      averageLoss: "$750",
    },
    {
      slug: "ai-voice-cloning-scam",
      scamName: "AI Voice Cloning Scam",
      scamCategory: "ai_fraud",
      platformUsed: ["Phone", "VoIP"],
      targetAudience: ["seniors", "families"],
      regions: ["US", "CA", "GB", "AU", "GLOBAL"],
      riskLevel: "critical",
      metaDescription: "Alert about AI voice cloning scams where criminals use artificial intelligence to impersonate family members on phone calls.",
      exampleMessages: [
        { context: "Phone Call", message: "Mom, it's me! I'm in trouble and I need you to send money right away. Please don't tell Dad." },
        { context: "Follow-up", message: "I can't explain right now. Just wire $3,000 to this account. I'll pay you back, I promise." },
      ],
      warningSigns: [
        "Unexpected call from a 'family member' in distress",
        "Caller asks you not to tell other family members",
        "Urgency and emotional pressure to act immediately",
        "Request for wire transfer, gift cards, or cryptocurrency",
        "Caller avoids answering specific personal questions",
        "Call comes from an unknown number",
      ],
      preventionTips: [
        "Establish a family code word for emergency verification",
        "Hang up and call the person back on their known number",
        "Ask a question only the real person would know",
        "Never wire money based on a single phone call",
        "Be aware that AI can now clone voices from just a few seconds of audio",
        "Use our Family Safety Codeword Generator tool",
      ],
      howItWorks: [
        { step: 1, title: "Voice Sample", description: "Scammer obtains a short audio clip of the target's voice from social media, voicemail, or other public sources." },
        { step: 2, title: "AI Cloning", description: "Using AI voice cloning technology, they create a convincing replica of the person's voice." },
        { step: 3, title: "Emergency Call", description: "They call a family member, typically an elderly parent or grandparent, mimicking the voice of their child or grandchild." },
        { step: 4, title: "Emotional Manipulation", description: "They claim to be in an emergency: arrested, in an accident, or stranded in another country." },
        { step: 5, title: "Money Request", description: "They ask for immediate money transfer via wire, gift cards, or cryptocurrency, insisting on secrecy." },
      ],
      faq: [
        { question: "Can AI really clone someone's voice?", answer: "Yes. Modern AI can create a convincing voice clone from as little as 3 seconds of recorded audio, making these scams extremely convincing." },
        { question: "How do I protect my family from voice cloning?", answer: "Establish a family code word that only your family knows. If someone calls claiming to be a family member in distress, ask for the code word." },
      ],
      averageLoss: "$3,500",
    },
    {
      slug: "romance-scam-intelligence",
      scamName: "Online Romance Scam",
      scamCategory: "romance_fraud",
      platformUsed: ["Dating Apps", "Facebook", "Instagram", "WhatsApp"],
      targetAudience: ["seniors", "general"],
      regions: ["US", "GB", "CA", "AU", "EU", "GLOBAL"],
      riskLevel: "high",
      metaDescription: "Detailed intelligence on online romance scams. Learn how scammers build fake romantic relationships to steal money and personal information.",
      exampleMessages: [
        { context: "Initial Contact", message: "I noticed your profile and felt an instant connection. You seem like such an amazing person. I would love to get to know you better." },
        { context: "Money Request", message: "I've been deployed overseas and my bank account is frozen. I need help with a $2,000 transfer to cover medical bills. I'll pay you back as soon as I return." },
      ],
      warningSigns: [
        "Person cannot meet in person or video chat (always has excuses)",
        "Relationship progresses unusually fast with declarations of love",
        "Claims to be a military member, doctor, or engineer working abroad",
        "Profile photos look too perfect (may be stolen from models or social media)",
        "Eventually asks for money, gift cards, or cryptocurrency",
        "Stories become increasingly dramatic (accidents, arrests, medical emergencies)",
      ],
      preventionTips: [
        "Never send money to someone you have not met in person",
        "Do a reverse image search on their profile photos",
        "Be suspicious of anyone who avoids video calls",
        "Tell a trusted friend or family member about the relationship",
        "Research their claimed profession and location",
        "Report suspicious profiles to the dating platform",
      ],
      howItWorks: [
        { step: 1, title: "Profile Creation", description: "Scammer creates a fake profile using stolen photos of attractive individuals, often claiming to be military, doctors, or engineers." },
        { step: 2, title: "Love Bombing", description: "They shower the victim with attention, compliments, and declarations of love within days or weeks." },
        { step: 3, title: "Building Trust", description: "Over weeks or months, they build an emotional connection through daily messages, calls, and sharing personal stories." },
        { step: 4, title: "The Crisis", description: "A sudden emergency requires financial help: medical bills, travel costs, legal fees, or business problems." },
        { step: 5, title: "Escalation", description: "If the victim sends money, more emergencies follow. The scammer continues extracting money until the victim runs out or becomes suspicious." },
      ],
      faq: [
        { question: "How much do people lose to romance scams?", answer: "The FTC reports romance scam losses exceeded $1.1 billion in 2023, with individual losses averaging $2,000 to $50,000." },
        { question: "Who falls for romance scams?", answer: "Anyone can be targeted. While seniors are often targeted, victims come from all age groups and backgrounds. Scammers are skilled at emotional manipulation." },
      ],
      averageLoss: "$4,400",
    },
  ];

  for (const scam of scams) {
    await db.insert(scamIntelligence).values({
      ...scam,
      status: "published",
      dateDetected: new Date(),
      lastUpdated: new Date(),
    }).onConflictDoNothing();
  }
  console.log(`[content-seed] Seeded ${scams.length} scam intelligence entries`);
}

async function seedAlerts() {
  const alerts = [
    {
      slug: "paypal-phishing-campaign-2024",
      threatName: "PayPal Account Suspension Phishing Campaign",
      threatCategory: "phishing",
      description: "A widespread phishing campaign impersonating PayPal is targeting users with fake account suspension emails. These emails contain links to convincing replica websites designed to steal login credentials.",
      detailedAnalysis: "This campaign uses sophisticated email templates that closely mimic legitimate PayPal communications. The phishing domains use SSL certificates to appear secure and employ URL obfuscation techniques. The campaign has been active across multiple regions with emails localized in several languages.",
      riskLevel: "high",
      affectedPlatforms: ["Email", "Mobile"],
      indicators: [
        { type: "domain", value: "paypal-verify-account.com", description: "Known phishing domain" },
        { type: "email", value: "Various sender addresses mimicking PayPal", description: "Spoofed sender" },
      ],
      mitigationSteps: [
        "Do not click links in emails claiming to be from PayPal",
        "Log in to PayPal directly by typing paypal.com in your browser",
        "Forward suspicious emails to phishing@paypal.com",
        "Enable two-factor authentication on your PayPal account",
        "Check your account activity for unauthorized transactions",
      ],
      sourceUrls: ["https://www.ic3.gov"],
      regions: ["US", "EU", "GB", "CA", "AU"],
      targetAudience: "general",
      metaDescription: "Alert: Active phishing campaign targeting PayPal users with fake account suspension emails. Learn how to protect yourself.",
      relatedGuideSlugs: ["how-to-detect-phishing-emails"],
    },
    {
      slug: "ai-voice-cloning-family-emergency-scam",
      threatName: "AI Voice Cloning Emergency Scam Surge",
      threatCategory: "ai_fraud",
      description: "A significant increase in AI voice cloning scams targeting elderly victims. Scammers use AI to clone the voices of family members and make emergency calls requesting immediate money transfers.",
      detailedAnalysis: "Multiple global agencies have flagged AI voice cloning fraud as a rapidly growing threat. Europol's IOCTA report, the UK NCSC, and the FTC all document significant increases in AI-assisted impersonation scams since 2023. Scammers obtain voice samples from social media videos, voicemails, and phone calls. Using commercial AI tools, they create convincing voice replicas in minutes. Primary targets are seniors who receive calls from supposed grandchildren or children in distress.",
      riskLevel: "critical",
      affectedPlatforms: ["Phone", "VoIP"],
      indicators: [
        { type: "tactic", value: "Voice cloning + emergency scenario", description: "AI-generated voice mimicking family member" },
        { type: "tactic", value: "Request for secrecy", description: "Caller asks victim not to tell other family members" },
      ],
      mitigationSteps: [
        "Establish a family code word for emergency verification",
        "Always hang up and call the person back on their known number",
        "Never wire money based on a single phone call",
        "Be aware that AI can clone voices from just seconds of audio",
        "Limit the amount of voice content shared publicly on social media",
        "Report incidents to the appropriate authority: FBI IC3 (ic3.gov) in the US, Action Fraud in the UK, ACSC in Australia, or your local cybercrime unit",
      ],
      sourceUrls: ["https://www.ic3.gov", "https://www.ftc.gov"],
      regions: ["US", "CA", "GB", "AU", "GLOBAL"],
      targetAudience: "seniors",
      metaDescription: "Critical alert: AI voice cloning scams targeting seniors are surging. Scammers clone family members' voices to trick victims into sending money.",
      relatedGuideSlugs: ["protecting-seniors-from-online-scams", "ai-powered-scams-explained"],
    },
    {
      slug: "deepfake-celebrity-investment-fraud",
      threatName: "Deepfake Celebrity Investment Fraud",
      threatCategory: "investment_fraud",
      description: "Criminals are using AI-generated deepfake videos of celebrities and financial experts to promote fraudulent cryptocurrency and investment platforms on social media.",
      detailedAnalysis: "These deepfake videos are distributed primarily through social media ads on Facebook, Instagram, YouTube, and TikTok. They feature AI-generated likenesses of well-known figures endorsing fake investment platforms. Victims are directed to professional-looking websites that show fake returns before eventually stealing deposited funds.",
      riskLevel: "critical",
      affectedPlatforms: ["Facebook", "Instagram", "YouTube", "TikTok"],
      indicators: [
        { type: "content", value: "AI-generated celebrity endorsement videos", description: "Deepfake videos promoting investments" },
        { type: "tactic", value: "Guaranteed returns claims", description: "Promises of 500%+ returns" },
      ],
      mitigationSteps: [
        "No legitimate investment offers guaranteed returns",
        "Be highly skeptical of celebrity endorsements for investments on social media",
        "Verify any investment platform with the SEC at investor.gov",
        "Report deepfake ads to the social media platform",
        "Never invest based solely on social media advertisements",
        "Check if the celebrity has actually endorsed the product through their official channels",
      ],
      sourceUrls: ["https://www.sec.gov", "https://www.ftc.gov"],
      regions: ["US", "EU", "GB", "AU", "GLOBAL"],
      targetAudience: "general",
      metaDescription: "Alert: Deepfake celebrity videos being used to promote fraudulent investment platforms. Learn how to spot AI-generated investment scams.",
      relatedGuideSlugs: ["ai-powered-scams-explained"],
    },
    {
      slug: "package-delivery-sms-phishing-wave",
      threatName: "Package Delivery SMS Phishing Wave",
      threatCategory: "smishing",
      description: "A new wave of SMS phishing (smishing) attacks impersonating delivery services like USPS, UPS, FedEx, and Amazon. Fake delivery notification texts contain malicious links.",
      detailedAnalysis: "These SMS messages claim a package could not be delivered or requires address confirmation. The links lead to phishing websites that collect personal information and credit card details. The campaign intensifies during holiday shopping seasons and major sales events.",
      riskLevel: "high",
      affectedPlatforms: ["SMS", "Mobile"],
      indicators: [
        { type: "sms", value: "Your package delivery failed. Confirm address: [link]", description: "Typical message pattern" },
        { type: "domain", value: "Various domains mimicking USPS/UPS/FedEx", description: "Fake delivery tracking sites" },
      ],
      mitigationSteps: [
        "Never click links in unexpected delivery notification texts",
        "Track packages directly through the carrier's official app or website",
        "Report suspicious texts by forwarding them to 7726 (SPAM)",
        "Do not enter personal or payment information on unfamiliar websites",
        "If expecting a package, check tracking through the original order confirmation email",
      ],
      sourceUrls: ["https://www.usps.com/help/scams.htm"],
      regions: ["US", "CA", "GB", "AU"],
      targetAudience: "general",
      metaDescription: "Alert: Fake package delivery texts from USPS, UPS, and FedEx are stealing personal data. Learn how to spot SMS phishing scams.",
      relatedGuideSlugs: ["how-to-detect-phishing-emails"],
    },
    {
      slug: "medicare-open-enrollment-phone-scam",
      threatName: "Medicare Open Enrollment Phone Scam",
      threatCategory: "government_impersonation",
      description: "Scammers are calling seniors during Medicare Open Enrollment period, impersonating Medicare representatives to steal personal information and Medicare numbers.",
      detailedAnalysis: "These callers claim to be from Medicare and offer free medical equipment, new Medicare cards, or lower prescription costs in exchange for personal information. Some callers threaten loss of benefits to create urgency. The scam peaks during the annual enrollment period (October-December).",
      riskLevel: "high",
      affectedPlatforms: ["Phone", "Robocall"],
      indicators: [
        { type: "tactic", value: "Unsolicited Medicare calls", description: "Callers claiming to represent Medicare" },
        { type: "tactic", value: "Threats of benefit loss", description: "Creating urgency around enrollment deadlines" },
      ],
      mitigationSteps: [
        "Medicare will never call you unsolicited to ask for personal information",
        "Never give your Medicare number to someone who calls you",
        "Hang up on unsolicited Medicare-related calls",
        "Call 1-800-MEDICARE directly to verify any claims",
        "Report Medicare scams to 1-800-HHS-TIPS",
        "Register your number on the Do Not Call list",
      ],
      sourceUrls: ["https://www.medicare.gov/basics/reporting-medicare-fraud"],
      regions: ["US"],
      targetAudience: "seniors",
      metaDescription: "Alert: Phone scammers targeting seniors during Medicare Open Enrollment. Learn how to spot fake Medicare calls and protect your benefits.",
      relatedGuideSlugs: ["protecting-seniors-from-online-scams"],
    },
  ];

  const now = new Date();
  for (const alert of alerts) {
    await db.insert(cyberThreatAlerts).values({
      ...alert,
      status: "published",
      publishedAt: now,
      dateDetected: now,
    }).onConflictDoNothing();
  }
  console.log(`[content-seed] Seeded ${alerts.length} cyber threat alerts`);
}

async function ensureCriticalGuides() {
  const { criticalGuides } = await import("./criticalGuidesData");
  const { socialMediaGuides } = await import("./socialMediaGuidesData");

  const allGuides = [...criticalGuides, ...socialMediaGuides];

  let inserted = 0;
  for (const guide of allGuides) {
    const existing = await db.select({ slug: cyberSafetyGuides.slug }).from(cyberSafetyGuides).where(eq(cyberSafetyGuides.slug, guide.slug));
    if (existing.length === 0) {
      await db.insert(cyberSafetyGuides).values({
        ...guide,
        status: "published",
        publishedAt: new Date(),
        authorName: "GetCyberRight Team",
        generatedByAi: true,
        aiModel: "claude-sonnet-4-5",
        seoScore: 85,
      });
      inserted++;
      console.log(`[content-seed] Inserted guide: "${guide.title}"`);
    }
  }

  if (inserted > 0) {
    console.log(`[content-seed] Ensured ${inserted} guide(s) exist`);
  }
}

async function ensureAdditionalScamIntel() {
  const { additionalScamIntel } = await import("./additionalScamIntelData");

  let inserted = 0;
  for (const scam of additionalScamIntel) {
    const existing = await db.select({ slug: scamIntelligence.slug }).from(scamIntelligence).where(eq(scamIntelligence.slug, scam.slug));
    if (existing.length === 0) {
      await db.insert(scamIntelligence).values({
        ...scam,
        status: "published",
        dateDetected: new Date(),
        lastUpdated: new Date(),
      });
      inserted++;
    }
  }

  if (inserted > 0) {
    console.log(`[content-seed] Inserted ${inserted} additional scam intelligence entries`);
  }
}

async function ensureAdditionalAlerts() {
  const { additionalAlerts } = await import("./additionalAlertsData");

  let inserted = 0;
  const now = new Date();
  for (const alert of additionalAlerts) {
    const existing = await db.select({ slug: cyberThreatAlerts.slug }).from(cyberThreatAlerts).where(eq(cyberThreatAlerts.slug, alert.slug));
    if (existing.length === 0) {
      await db.insert(cyberThreatAlerts).values({
        ...alert,
        status: "published",
        publishedAt: now,
        dateDetected: now,
      });
      inserted++;
    }
  }

  if (inserted > 0) {
    console.log(`[content-seed] Inserted ${inserted} additional threat alerts`);
  }
}

async function ensureAdditionalGuides() {
  const { additionalGuides } = await import("./additionalGuidesData");

  let inserted = 0;
  for (const guide of additionalGuides) {
    const existing = await db.select({ slug: cyberSafetyGuides.slug }).from(cyberSafetyGuides).where(eq(cyberSafetyGuides.slug, guide.slug));
    if (existing.length === 0) {
      await db.insert(cyberSafetyGuides).values({
        ...guide,
        status: "published",
        publishedAt: new Date(),
        authorName: "GetCyberRight Team",
        generatedByAi: true,
        aiModel: "claude-sonnet-4-5",
        seoScore: 85,
      });
      inserted++;
      console.log(`[content-seed] Inserted guide: "${guide.title}"`);
    }
  }

  if (inserted > 0) {
    console.log(`[content-seed] Inserted ${inserted} additional guides`);
  }
}
