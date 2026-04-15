import { db } from "./db";
import { sql } from "drizzle-orm";

/**
 * Seeds the news_articles table with an initial set of high-quality,
 * plain-language cybersecurity articles. These are written for everyday
 * internet users, not security professionals.
 *
 * Creates the table if it does not exist, then seeds only when empty.
 * Uses raw SQL throughout to avoid Drizzle ORM timing issues on fresh tables.
 */
export async function seedNewsArticles(): Promise<number> {
  // Ensure the news_articles table exists
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "news_articles" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" text NOT NULL,
        "slug" varchar(255) NOT NULL UNIQUE,
        "excerpt" text NOT NULL,
        "content" text,
        "category" text NOT NULL DEFAULT 'Cybersecurity',
        "source" text NOT NULL,
        "source_url" text NOT NULL,
        "original_title" text,
        "image_url" text,
        "thumbnail_url" text,
        "urgency_level" integer DEFAULT 1,
        "related_tool_url" text,
        "related_tool_name" text,
        "author" text DEFAULT 'Jude Annan, CISM',
        "author_role" text DEFAULT 'Managing Partner',
        "published_at" timestamp DEFAULT now(),
        "created_at" timestamp DEFAULT now()
      )
    `);
    console.log("[news-seed] Ensured news_articles table exists.");
  } catch (err: any) {
    console.error("[news-seed] Failed to create table:", err.message);
    return 0;
  }

  // Check if articles already exist using raw SQL
  try {
    const result = await db.execute(sql`SELECT COUNT(*)::int AS cnt FROM "news_articles"`);
    const rows = result as any;
    const count = rows?.[0]?.cnt ?? rows?.rows?.[0]?.cnt ?? 0;
    if (count > 0) {
      console.log(`[news-seed] Already have ${count} articles. Skipping seed.`);
      return 0;
    }
  } catch (err: any) {
    console.error("[news-seed] Count check failed:", err.message);
    return 0;
  }

  const articles = getSeedArticles();
  let inserted = 0;

  for (const article of articles) {
    try {
      // Escape single quotes in text values
      const esc = (s: string) => s.replace(/'/g, "''");
      await db.execute(sql`
        INSERT INTO "news_articles" (
          "title", "slug", "excerpt", "content", "category",
          "source", "source_url", "original_title", "image_url",
          "urgency_level", "related_tool_url", "related_tool_name",
          "author", "author_role", "published_at"
        ) VALUES (
          ${article.title},
          ${article.slug},
          ${article.excerpt},
          ${article.content},
          ${article.category},
          ${article.source},
          ${article.sourceUrl},
          ${article.originalTitle},
          ${article.imageUrl || null},
          ${article.urgencyLevel},
          ${article.relatedToolUrl || null},
          ${article.relatedToolName || null},
          ${article.author},
          ${article.authorRole},
          ${article.publishedAt}
        )
        ON CONFLICT ("slug") DO NOTHING
      `);
      inserted++;
    } catch (err: any) {
      console.error(`[news-seed] Failed to insert "${article.title}": ${err.message}`);
    }
  }

  console.log(`[news-seed] Seeded ${inserted} of ${articles.length} articles.`);
  return inserted;
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600000).toISOString();
}

function getSeedArticles() {
  return [
    {
      title: "Why You Need a Password Manager (and How to Pick One)",
      slug: "why-you-need-a-password-manager",
      excerpt: "If you are reusing passwords across sites, you are one data breach away from losing access to everything. Here is how a password manager keeps you safe.",
      content: `Most people use the same handful of passwords everywhere. That is a serious problem because when one site gets hacked, criminals try those same passwords on banking sites, email accounts, and social media.\n\nA password manager solves this by creating and remembering a unique, complex password for every account you own. You only need to remember one master password.\n\nWhat to look for in a password manager:\n\n1. End-to-end encryption so even the company cannot read your passwords\n2. Cross-device syncing between your phone, tablet, and computer\n3. A built-in password generator that creates strong random passwords\n4. Breach monitoring that alerts you if any saved password appears in a known data leak\n\nPopular options include Bitwarden (free and open source), 1Password, and Dashlane. Most browsers also offer built-in password managers, though dedicated apps tend to offer more features and better security.\n\nGetting started takes about 15 minutes. Install the app, create your master password (make it long, like a short sentence you will remember), and start saving your logins as you visit sites throughout the week.`,
      category: "Online Safety",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Why You Need a Password Manager (and How to Pick One)",
      imageUrl: null,
      urgencyLevel: 2,
      relatedToolUrl: "/scam-guard",
      relatedToolName: "Scam Guard",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(2),
    },
    {
      title: "How to Spot a Phishing Email Before You Click",
      slug: "how-to-spot-phishing-email",
      excerpt: "Phishing emails are getting harder to detect. Learn the five red flags that give away even the most convincing fakes.",
      content: `Phishing is when someone sends you a fake email designed to steal your login credentials, credit card number, or personal information. These messages often look like they come from companies you trust: your bank, Amazon, Netflix, or even your employer.\n\nFive red flags to watch for:\n\n1. Urgency or threats. "Your account will be suspended in 24 hours" is a classic pressure tactic. Real companies rarely threaten you over email.\n2. Suspicious sender address. The display name might say "PayPal" but the actual email address is something like support@paypa1-secure.com. Always check the full address.\n3. Generic greetings. "Dear Customer" instead of your actual name often signals a mass phishing attempt.\n4. Links that do not match. Hover over any link before clicking. If the text says "paypal.com" but the link points to a different domain, do not click.\n5. Unexpected attachments. Be especially cautious of .zip, .exe, or .docm files you did not request.\n\nIf you suspect an email is fake, do not click any links. Instead, open your browser and go directly to the company's website by typing the address yourself.`,
      category: "Phishing",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "How to Spot a Phishing Email Before You Click",
      imageUrl: null,
      urgencyLevel: 3,
      relatedToolUrl: "/scam-guard",
      relatedToolName: "Scam Guard",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(5),
    },
    {
      title: "Two-Factor Authentication Explained in Plain English",
      slug: "two-factor-authentication-explained",
      excerpt: "Two-factor authentication is one of the best ways to protect your accounts, and it is easier to set up than you think.",
      content: `Two-factor authentication (2FA) adds a second step when you log in to an account. Even if someone steals your password, they cannot get in without that second factor.\n\nThink of it like your front door. Your password is the key, and 2FA is a deadbolt that requires a separate code. A thief with a copy of your key still cannot get in.\n\nTypes of 2FA from least to most secure:\n\n1. SMS codes. A text message with a 6-digit code. Better than nothing, but criminals can intercept texts through SIM-swapping attacks.\n2. Authenticator apps. Apps like Google Authenticator, Authy, or Microsoft Authenticator generate codes that change every 30 seconds. These are much harder to intercept.\n3. Hardware keys. Physical devices like YubiKey that you plug into your computer or tap against your phone. This is the gold standard used by security professionals.\n\nStart with your most important accounts: email, banking, and social media. Most major services support 2FA. Look for it under Settings, then Security or Login Options.\n\nThe extra 10 seconds per login is worth the protection. Accounts with 2FA are almost never compromised through password theft alone.`,
      category: "Online Safety",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Two-Factor Authentication Explained in Plain English",
      imageUrl: null,
      urgencyLevel: 2,
      relatedToolUrl: null,
      relatedToolName: null,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(8),
    },
    {
      title: "Is Public Wi-Fi Actually Dangerous? What You Need to Know",
      slug: "is-public-wifi-dangerous",
      excerpt: "Coffee shop Wi-Fi might be convenient, but here is what hackers can see when you connect to an unprotected network.",
      content: `Public Wi-Fi at coffee shops, airports, and hotels is convenient, but it comes with real risks. When you connect to an open network, anyone on that same network can potentially see your traffic.\n\nThe biggest risks on public Wi-Fi:\n\n1. Man-in-the-middle attacks. A hacker positions themselves between you and the Wi-Fi router, intercepting everything you send and receive.\n2. Evil twin networks. Someone creates a fake Wi-Fi network with a name like "Starbucks_Free" to trick you into connecting. Once connected, they can monitor your activity.\n3. Packet sniffing. Software tools can capture data packets flowing across the network, potentially revealing passwords and personal information sent without encryption.\n\nHow to stay safe:\n\n1. Use a VPN (Virtual Private Network). This encrypts all your internet traffic, making it unreadable to anyone snooping on the network. Good options include Mullvad, ProtonVPN, and NordVPN.\n2. Stick to HTTPS websites. Look for the padlock icon in your browser's address bar. Most major websites use HTTPS by default now.\n3. Avoid sensitive tasks. Do not log in to your bank or make purchases on public Wi-Fi unless you are using a VPN.\n4. Turn off auto-connect. Prevent your phone from automatically joining open networks.\n5. Forget the network when done. This prevents your device from reconnecting automatically next time.`,
      category: "Online Safety",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Is Public Wi-Fi Actually Dangerous? What You Need to Know",
      imageUrl: null,
      urgencyLevel: 2,
      relatedToolUrl: null,
      relatedToolName: null,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(12),
    },
    {
      title: "Why Software Updates Matter More Than You Think",
      slug: "why-software-updates-matter",
      excerpt: "That update notification you keep dismissing could be the one thing standing between you and a hacker. Here is why updates are your first line of defense.",
      content: `We all dismiss software update notifications. They pop up at the worst times, and restarting your computer feels like an interruption. But those updates are often patching security holes that hackers are actively exploiting.\n\nWhen a company discovers a vulnerability in its software, it races to release a patch before criminals can take advantage. The window between when a vulnerability becomes known and when you install the update is when you are most at risk.\n\nReal-world examples of what happens when updates are skipped:\n\n1. The WannaCry ransomware attack in 2017 affected hundreds of thousands of computers worldwide. Microsoft had released a patch two months earlier, but many organizations had not installed it.\n2. The Equifax data breach that exposed 147 million Americans' personal data happened because the company failed to patch a known vulnerability for over two months.\n\nHow to make updates painless:\n\n1. Turn on automatic updates for your operating system (Windows, macOS, iOS, Android)\n2. Enable auto-update for your apps, especially browsers and email clients\n3. Restart your devices at least once a week to ensure pending updates get installed\n4. Replace devices that no longer receive security updates. If your phone's manufacturer has stopped providing updates, it is time for an upgrade.`,
      category: "Online Safety",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Why Software Updates Matter More Than You Think",
      imageUrl: null,
      urgencyLevel: 2,
      relatedToolUrl: null,
      relatedToolName: null,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(18),
    },
    {
      title: "I Think I Have Been Hacked: A Step-by-Step Recovery Guide",
      slug: "what-to-do-if-hacked",
      excerpt: "If you suspect your account has been compromised, do not panic. Follow these steps immediately to limit the damage and take back control.",
      content: `Discovering that one of your accounts has been hacked is stressful, but acting quickly can limit the damage. Here is exactly what to do, step by step.\n\nImmediate actions (do these right now):\n\n1. Change your password on the affected account. If you cannot log in, use the "Forgot Password" option. If that does not work, contact the service's support team directly.\n2. Change passwords on any other accounts where you used the same or a similar password. This is the most important step because hackers try stolen credentials everywhere.\n3. Enable two-factor authentication on the affected account and any accounts that share the password.\n4. Check for unauthorized changes. Look for new forwarding rules in email, changed recovery phone numbers, or unfamiliar connected apps.\n\nNext steps (within 24 hours):\n\n1. Check haveibeenpwned.com to see which of your email addresses appear in known data breaches.\n2. Review your bank and credit card statements for unauthorized charges.\n3. If financial accounts are affected, contact your bank immediately. Most banks have a fraud department available 24/7.\n4. Consider placing a fraud alert or credit freeze with the three major credit bureaus (Equifax, Experian, TransUnion).\n\nLonger-term protection:\n\n1. Set up a password manager and create unique passwords for every account.\n2. Sign up for credit monitoring if your Social Security number may have been exposed.\n3. File a report at identitytheft.gov if you believe you are a victim of identity theft.`,
      category: "Data Breaches",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "I Think I Have Been Hacked: A Step-by-Step Recovery Guide",
      imageUrl: null,
      urgencyLevel: 4,
      relatedToolUrl: "/scam-guard",
      relatedToolName: "Scam Guard",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(24),
    },
    {
      title: "Social Media Privacy Settings You Should Change Today",
      slug: "social-media-privacy-settings",
      excerpt: "Your social media profiles might be sharing more than you realize. These quick changes take five minutes and dramatically reduce your exposure.",
      content: `Social media platforms are designed to encourage sharing, which means the default privacy settings are usually more open than most people would prefer. Taking five minutes to adjust these settings can significantly reduce your digital footprint.\n\nFacebook:\n1. Go to Settings, then Privacy. Change "Who can see your future posts" to "Friends" instead of "Public"\n2. Under "How People Find and Contact You," limit who can look you up by email and phone number\n3. Review your Timeline and Tagging settings to require your approval before posts appear on your profile\n4. Check the Apps and Websites section and remove any apps you no longer use\n\nInstagram:\n1. Consider switching to a private account (Settings, then Privacy, then Account Privacy)\n2. Turn off Activity Status so people cannot see when you are online\n3. Review and remove third-party app access under Settings, then Security, then Apps and Websites\n\nLinkedIn:\n1. Adjust your public profile visibility under Settings, then Visibility\n2. Turn off "Share profile updates with your network" to prevent broadcasting every profile change\n3. Control who can see your connections list\n\nGeneral tips for all platforms:\n1. Disable location sharing on posts\n2. Be cautious about quizzes and games that request access to your profile information\n3. Regularly review your friends or followers list and remove people you do not know\n4. Remember that anything you post can be screenshotted and shared, even from a "private" account`,
      category: "Online Safety",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Social Media Privacy Settings You Should Change Today",
      imageUrl: null,
      urgencyLevel: 2,
      relatedToolUrl: null,
      relatedToolName: null,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(30),
    },
    {
      title: "Ransomware: What It Is and How Families Can Protect Themselves",
      slug: "ransomware-family-protection-guide",
      excerpt: "Ransomware locks your files and demands payment. It is not just a business problem. Here is how to protect your family's photos, documents, and memories.",
      content: `Ransomware is a type of malicious software that encrypts your files, making them inaccessible until you pay a ransom, usually in cryptocurrency. While it often targets businesses, home users are increasingly at risk.\n\nHow ransomware gets on your computer:\n\n1. Email attachments. A fake invoice, shipping notification, or document that installs the ransomware when opened.\n2. Malicious links. Clicking a link in a phishing email or on a compromised website.\n3. Software vulnerabilities. Unpatched operating systems or applications can be exploited remotely.\n4. Infected USB drives. Plugging in an unknown USB drive can trigger an automatic installation.\n\nHow to protect your family:\n\n1. Back up your important files regularly. Use both a cloud service (Google Drive, iCloud, OneDrive) and a physical external hard drive. Keep the external drive disconnected when not backing up.\n2. Keep all software updated. Enable automatic updates on every device in your home.\n3. Install reputable antivirus software. Windows Defender (built into Windows) is actually quite good. For extra protection, consider Malwarebytes or Bitdefender.\n4. Be extremely cautious with email attachments and links, especially from unknown senders.\n5. Educate everyone in your household. Kids and older family members are common targets.\n\nIf you are hit by ransomware:\n1. Disconnect the infected device from Wi-Fi and your home network immediately.\n2. Do not pay the ransom. There is no guarantee you will get your files back, and payment funds criminal operations.\n3. Report it to local law enforcement and the FBI's Internet Crime Complaint Center (IC3) at ic3.gov.\n4. If you have backups, wipe the device and restore from backup. If not, consult a professional data recovery service.`,
      category: "Ransomware",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Ransomware: What It Is and How Families Can Protect Themselves",
      imageUrl: null,
      urgencyLevel: 3,
      relatedToolUrl: null,
      relatedToolName: null,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(36),
    },
  ];
}
