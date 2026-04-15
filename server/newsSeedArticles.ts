import { storage } from "./storage";

/**
 * Seeds the news_articles table with an initial set of high-quality,
 * plain-language cybersecurity articles. These are written for everyday
 * internet users, not security professionals.
 *
 * Called once on startup when the table is empty.
 */
export async function seedNewsArticles(): Promise<number> {
  try {
    const existing = await storage.getNewsArticles(undefined, 1);
    if (existing.length > 0) {
      console.log("[news-seed] Articles already exist, skipping seed.");
      return 0;
    }
  } catch (error: any) {
    console.error("[news-seed] Could not check existing articles:", error.message);
    return 0;
  }

  console.log("[news-seed] Seeding initial news articles...");

  const articles = getSeedArticles();
  let created = 0;

  for (const article of articles) {
    try {
      await storage.createNewsArticle(article);
      created++;
    } catch (err: any) {
      console.error("[news-seed] Failed to create article:", article.slug, err.message);
    }
  }

  console.log(`[news-seed] Seeded ${created} of ${articles.length} articles.`);
  return created;
}

function getSeedArticles() {
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

  return [
    {
      title: "What Password Managers Do and Why You Need One",
      slug: "what-password-managers-do-and-why-you-need-one",
      excerpt: "Reusing passwords is one of the most common ways people get hacked. A password manager creates and stores strong, unique passwords for every account so you do not have to remember them.",
      content: "If you use the same password for your email, your bank, and your streaming service, you are not alone. Most people do it because remembering dozens of passwords feels impossible. But when one site gets breached, attackers try that same password everywhere else. This is called credential stuffing, and it works far more often than you might expect.\n\nA password manager solves this by generating a random, complex password for each account and storing them all behind one master password. Think of it like a secure digital vault. You only need to remember one key, and the manager handles the rest.\n\nPopular options include Bitwarden (free and open-source), 1Password, and the built-in managers in Chrome, Safari, and Firefox. Most work across your phone, tablet, and computer, so your passwords follow you everywhere.\n\nThe single most impactful thing you can do for your online security today is to start using a password manager and change your most important passwords to unique ones.",
      category: "Cybersecurity",
      source: "GetCyberRight",
      sourceUrl: "https://www.getcyberright.com/guides",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      urgencyLevel: 2,
      publishedAt: hoursAgo(2),
    },
    {
      title: "How to Spot a Phishing Email Before You Click",
      slug: "how-to-spot-a-phishing-email-before-you-click",
      excerpt: "Phishing emails trick you into giving away your personal information or clicking dangerous links. Here is how to recognize them and stay safe.",
      content: "Phishing is the most common type of cyberattack, and it starts with an email, text, or message designed to look like it came from someone you trust. The goal is to get you to click a link, download a file, or enter your login details on a fake website.\n\nHere are the warning signs to watch for. First, check the sender's email address carefully. A message claiming to be from your bank but sent from a random Gmail address is a red flag. Second, look for urgency. Phrases like 'Your account will be suspended in 24 hours' are designed to make you panic and act without thinking.\n\nThird, hover over links before clicking. On a computer, your browser shows the actual destination in the bottom corner. If the link does not match where it claims to go, do not click it. Fourth, watch for poor grammar and spelling. While phishing messages have gotten more sophisticated, many still contain noticeable errors.\n\nIf you are unsure about an email, do not click anything inside it. Instead, go directly to the company's website by typing the address into your browser. When in doubt, call the organization directly using a phone number you find on their official website.",
      category: "Cybersecurity",
      source: "GetCyberRight",
      sourceUrl: "https://www.getcyberright.com/guides",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      urgencyLevel: 3,
      publishedAt: hoursAgo(5),
    },
    {
      title: "Two-Factor Authentication: Your Second Line of Defense",
      slug: "two-factor-authentication-your-second-line-of-defense",
      excerpt: "Even if someone steals your password, two-factor authentication can stop them from getting into your account. Here is what it is and how to turn it on.",
      content: "Two-factor authentication, often called 2FA or MFA, adds a second step when you log in. After entering your password, you also need to prove your identity another way, usually with a code from your phone or a tap on an authentication app.\n\nThink of it like a deadbolt on your front door. Your password is the doorknob lock. Even if someone picks it, they still cannot get through the deadbolt. That second layer makes a huge difference.\n\nThe easiest way to set it up is with an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy. These generate a new six-digit code every 30 seconds. When you log in, you enter your password and then type in the current code.\n\nText message codes are another option, but security experts consider them less secure because phone numbers can be hijacked through SIM swapping. Authenticator apps are the better choice when available.\n\nStart with your most important accounts: email, banking, and social media. Most major services support 2FA. Look in your account settings under Security or Privacy to find the option. It takes less than five minutes to set up and dramatically reduces the chance of someone breaking into your accounts.",
      category: "Cybersecurity",
      source: "GetCyberRight",
      sourceUrl: "https://www.getcyberright.com/guides",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      urgencyLevel: 2,
      publishedAt: hoursAgo(8),
    },
    {
      title: "Public Wi-Fi: What You Need to Know Before Connecting",
      slug: "public-wifi-what-you-need-to-know-before-connecting",
      excerpt: "Coffee shop Wi-Fi is convenient, but it can expose your personal data to anyone on the same network. Here is how to stay safe when using public wireless networks.",
      content: "Free Wi-Fi at airports, hotels, and coffee shops is convenient, but it comes with real risks. On an open network, someone sitting nearby could potentially see what websites you visit, intercept your login details, or even set up a fake network that looks legitimate.\n\nThe most important rule is to never access sensitive accounts, like your bank or email, on public Wi-Fi unless you are using a VPN. A Virtual Private Network encrypts all the data leaving your device, so even if someone is watching the network, they cannot read your traffic.\n\nIf you do not have a VPN, you can still take precautions. Only visit websites that use HTTPS, which you can verify by looking for the padlock icon in your browser's address bar. Avoid logging into anything important. And turn off the setting that automatically connects to available Wi-Fi networks, since your device could connect to a malicious one without you knowing.\n\nFor most people, the simplest option is to use your phone's mobile data instead of public Wi-Fi for anything sensitive. Your cellular connection is significantly harder to intercept than an open wireless network.",
      category: "Cybersecurity",
      source: "GetCyberRight",
      sourceUrl: "https://www.getcyberright.com/guides",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      urgencyLevel: 2,
      publishedAt: hoursAgo(12),
    },
    {
      title: "Software Updates Are Not Optional: Why Patching Matters",
      slug: "software-updates-are-not-optional-why-patching-matters",
      excerpt: "Those software update notifications you keep dismissing could be protecting you from active cyberattacks. Here is why keeping your devices up to date is one of the simplest ways to stay safe.",
      content: "Every time you see a notification to update your phone, computer, or apps, it is tempting to hit 'Remind me later.' But those updates often contain security patches that fix vulnerabilities attackers are actively exploiting.\n\nWhen a software company discovers a security flaw, they race to release a fix before criminals can take advantage of it. The window between discovery and patch is when you are most vulnerable. Delaying updates extends that window.\n\nThe easiest approach is to turn on automatic updates for your operating system, web browser, and apps. On your phone, go to Settings and look for Software Update or App Store settings. On your computer, enable automatic updates in System Preferences or Windows Settings.\n\nPay special attention to your web browser and any apps that handle sensitive data. These are the most common targets for attackers. Keeping them current is one of the simplest, most effective security habits you can build.",
      category: "Cybersecurity",
      source: "GetCyberRight",
      sourceUrl: "https://www.getcyberright.com/guides",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      urgencyLevel: 3,
      publishedAt: hoursAgo(16),
    },
    {
      title: "What to Do If You Think You Have Been Hacked",
      slug: "what-to-do-if-you-think-you-have-been-hacked",
      excerpt: "Suspicious activity on your accounts can be frightening. Here is a step-by-step guide for what to do immediately if you think someone has broken into your accounts.",
      content: "Discovering that one of your accounts may have been compromised is stressful, but acting quickly can limit the damage. Here is what to do.\n\nFirst, change your password immediately for the affected account. If you use the same password anywhere else, change those too. This is the single fastest way to lock an attacker out.\n\nSecond, enable two-factor authentication if you have not already. This prevents the attacker from getting back in even if they know your new password.\n\nThird, check for unauthorized activity. Look at recent logins, purchases, or messages sent from your account. Most services let you see a list of active sessions and sign out of all devices.\n\nFourth, if the compromised account is your email, check your email forwarding rules. Attackers sometimes set up rules to forward your messages to their own address, which lets them intercept password reset links for your other accounts.\n\nFifth, run a full malware scan on your devices using your antivirus software. If you do not have antivirus, Windows Defender (built into Windows) or Malwarebytes (free version) are reliable options.\n\nFinally, if financial accounts are affected, contact your bank immediately. They can freeze your accounts and help you dispute unauthorized transactions. Consider placing a fraud alert with the credit bureaus if you believe your identity has been stolen.",
      category: "Breaking",
      source: "GetCyberRight",
      sourceUrl: "https://www.getcyberright.com/guides",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      urgencyLevel: 4,
      publishedAt: hoursAgo(20),
    },
    {
      title: "Social Media Privacy Settings You Should Change Today",
      slug: "social-media-privacy-settings-you-should-change-today",
      excerpt: "Your social media profiles may be sharing more about you than you realize. A few minutes adjusting your privacy settings can make a big difference.",
      content: "Social media platforms are designed to encourage sharing, and their default settings often make your information more public than you might expect. Scammers and identity thieves regularly mine social media for details they can use against you.\n\nYour full birthday, hometown, workplace, and family member names are all pieces of the puzzle that criminals use for social engineering attacks or to answer your security questions.\n\nOn Facebook, go to Settings, then Privacy, and set your future posts to Friends Only. Review who can see your friends list, your email, and your phone number. On Instagram, consider switching to a private account if you do not need public visibility. On LinkedIn, be careful about what personal details you include beyond your professional information.\n\nAcross all platforms, disable location sharing on your posts. Broadcasting your real-time location tells people when you are away from home and reveals your daily patterns.\n\nTake 15 minutes this week to review the privacy settings on each social media platform you use. The interfaces change frequently, so settings you adjusted a year ago may have been reset or new options may have been added.",
      category: "Cybersecurity",
      source: "GetCyberRight",
      sourceUrl: "https://www.getcyberright.com/guides",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      urgencyLevel: 2,
      publishedAt: hoursAgo(24),
    },
    {
      title: "How Ransomware Works and How to Protect Your Files",
      slug: "how-ransomware-works-and-how-to-protect-your-files",
      excerpt: "Ransomware locks your files and demands payment to unlock them. Understanding how it spreads is the first step to making sure it never happens to you.",
      content: "Ransomware is a type of malicious software that encrypts your files, making them completely inaccessible, and then demands a payment, usually in cryptocurrency, to give you the decryption key. It has become one of the most profitable forms of cybercrime, affecting individuals, businesses, and even hospitals.\n\nMost ransomware arrives through phishing emails with infected attachments, malicious downloads, or compromised websites. Once it is on your computer, it works quickly, often encrypting your entire hard drive within minutes.\n\nThe best defense is a good backup strategy. Follow the 3-2-1 rule: keep 3 copies of your important files, on 2 different types of storage, with 1 copy stored offsite or in the cloud. If ransomware strikes, you can wipe your computer and restore from your backup without paying a cent.\n\nAdditional protective steps include keeping your software updated, being cautious with email attachments, and using reputable antivirus software. If you are hit by ransomware, security experts and law enforcement generally advise against paying the ransom, since there is no guarantee you will get your files back, and payment funds further criminal activity.\n\nFree decryption tools are available for some ransomware variants at nomoreransom.org, a project supported by Europol and major security companies.",
      category: "Cybersecurity",
      source: "GetCyberRight",
      sourceUrl: "https://www.getcyberright.com/guides",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      urgencyLevel: 3,
      publishedAt: hoursAgo(30),
    },
  ];
}
