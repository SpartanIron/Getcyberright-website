import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { PageBanner } from "@/components/page-banner";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { useSearch } from "wouter";
import { 
  ArrowRight, 
  Clock, 
  BookOpen, 
  X, 
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Video,
  ClipboardCheck,
  Play,
  FileText,
  Printer
} from "lucide-react";
import bannerImage from "@/assets/banners/resources-banner.png";

type ResourceType = "guide" | "video" | "checklist";

interface Resource {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  featured: boolean;
  type: ResourceType;
  content: {
    intro: string;
    sections: { title: string; content: string; tips?: string[] }[];
    conclusion: string;
  };
  videoUrl?: string;
  checklistItems?: { task: string; description: string }[];
}

const resources: Resource[] = [
  {
    slug: "how-to-spot-phishing-emails",
    title: "How to Spot Phishing Emails: A Complete Guide",
    excerpt: "Learn the telltale signs that an email might be a phishing attempt. From suspicious sender addresses to urgent language, we cover everything you need to know.",
    category: "Email Safety",
    readTime: "8 min read",
    featured: true,
    type: "guide",
    content: {
      intro: "Phishing emails are one of the most common ways cybercriminals try to steal your personal information. Learning to recognize these deceptive messages is your first line of defense.",
      sections: [
        {
          title: "Check the Sender Address Carefully",
          content: "Scammers often use email addresses that look similar to legitimate ones but have small differences. For example, they might use 'amaz0n.com' instead of 'amazon.com' or 'support@paypa1.com' instead of the real PayPal address.",
          tips: ["Hover over the sender name to see the actual email address", "Look for misspellings in the domain name", "Be suspicious of free email services for business communications"]
        },
        {
          title: "Watch for Urgent or Threatening Language",
          content: "Phishing emails often create a sense of urgency to make you act without thinking. Phrases like 'Your account will be suspended,' 'Immediate action required,' or 'You have 24 hours to respond' are red flags.",
          tips: ["Legitimate companies rarely threaten immediate account closure", "Take time to verify before clicking any links", "When in doubt, contact the company directly through their official website"]
        },
        {
          title: "Examine Links Before Clicking",
          content: "Before clicking any link in an email, hover your mouse over it to see where it really goes. The actual URL should match the company the email claims to be from.",
          tips: ["The URL should start with https:// for secure sites", "Look for misspellings in the website address", "When uncertain, type the website address directly into your browser"]
        },
        {
          title: "Look for Poor Grammar and Spelling",
          content: "While phishing attempts have become more sophisticated, many still contain spelling mistakes, grammatical errors, or awkward phrasing that legitimate companies would not use.",
          tips: ["Professional companies proofread their communications", "Multiple errors in one email are a strong warning sign", "Unusual formatting or font changes can indicate a scam"]
        }
      ],
      conclusion: "When you receive a suspicious email, do not click any links or download attachments. If you think it might be legitimate, contact the company directly using a phone number or website you find independently, not from the email itself."
    }
  },
  {
    slug: "protecting-seniors-from-phone-scams",
    title: "Protecting Seniors from Phone Scams",
    excerpt: "Phone scams targeting seniors are on the rise. This guide helps families have important conversations and set up protections.",
    category: "Senior Safety",
    readTime: "6 min read",
    featured: true,
    type: "guide",
    content: {
      intro: "Phone scams cost older Americans billions of dollars each year. According to the FBI IC3 2024 Report, adults 60 and older lost nearly $5 billion to fraud. Globally, the AARP 2025 Fraud Survey estimates total reported and unreported losses for older adults may exceed $61 billion. Scammers specifically target seniors because they may be more trusting, have savings, and are less likely to report being scammed.",
      sections: [
        {
          title: "Common Phone Scam Types",
          content: "The most common scams targeting seniors include IRS impersonators claiming you owe taxes, tech support scams claiming your computer has a virus, grandchild scams where someone pretends to be a relative in trouble, and Medicare or health insurance scams.",
          tips: ["The IRS will never call demanding immediate payment", "Legitimate tech companies do not make unsolicited calls", "Always verify a family emergency through other family members"]
        },
        {
          title: "Warning Signs During a Call",
          content: "Scammers use high-pressure tactics. They may demand immediate payment, request payment in gift cards or wire transfers, threaten arrest or legal action, or ask you to keep the call secret from family members.",
          tips: ["Legitimate organizations do not demand gift card payments", "It is okay to hang up and call back on an official number", "Never give personal information to unsolicited callers"]
        },
        {
          title: "Having the Conversation with Loved Ones",
          content: "Talk with older family members about phone scams in a supportive, non-judgmental way. Focus on how sophisticated these scams are rather than implying they are gullible. Share specific examples and practice responses together.",
          tips: ["Make it a regular conversation, not a one-time lecture", "Share news stories about scams to normalize the topic", "Establish a family code word for emergencies"]
        },
        {
          title: "Setting Up Protections",
          content: "Register phone numbers on the National Do Not Call Registry. Consider call-blocking apps or services from your phone provider. Set up a system where large financial decisions are discussed with a family member first.",
          tips: ["Many phone carriers offer free scam call blocking", "Consider a phone with large caller ID display", "Set up automatic fraud alerts on financial accounts"]
        }
      ],
      conclusion: "The best protection is awareness. By having open conversations and setting up practical safeguards, you can help protect your loved ones from phone scams while respecting their independence."
    }
  },
  {
    slug: "romance-scam-warning-signs",
    title: "Romance Scam Warning Signs Everyone Should Know",
    excerpt: "Romance scams cost victims hundreds of millions each year. Learn to recognize the patterns scammers use to build false trust and request money.",
    category: "Scam Awareness",
    readTime: "10 min read",
    featured: false,
    type: "guide",
    content: {
      intro: "Romance scams involve criminals who build fake online relationships to steal money from their victims. These scammers are patient and manipulative, often spending weeks or months building trust before asking for money.",
      sections: [
        {
          title: "How Romance Scams Begin",
          content: "Scammers typically connect through dating apps, social media, or online forums. They create attractive profiles using stolen photos and quickly try to move conversations to private messaging or email.",
          tips: ["Be cautious of profiles that seem too perfect", "Do a reverse image search on profile photos", "Be wary of people who want to move off the dating platform quickly"]
        },
        {
          title: "Building False Intimacy",
          content: "Scammers shower victims with attention and affection. They claim to have an instant deep connection, often professing love quickly. They typically claim to be working overseas or in the military to explain why they cannot meet in person.",
          tips: ["Real relationships develop over time, not instantly", "Be suspicious of constant flattery and declarations of love", "Someone who always has an excuse not to video chat is a red flag"]
        },
        {
          title: "The Money Request",
          content: "Eventually, the scammer will have an emergency and ask for money. Common stories include medical emergencies, business problems, travel expenses to visit you, or being detained and needing bail money.",
          tips: ["Never send money to someone you have not met in person", "Requests for wire transfers or gift cards are major red flags", "A real partner would not guilt you into sending money"]
        },
        {
          title: "Protecting Yourself",
          content: "Never send money or financial information to someone you have only met online. Use video calls to verify the person matches their photos. Tell a trusted friend or family member about your online relationship.",
          tips: ["Research the person online using their name and details", "Trust your instincts if something feels wrong", "Report suspected scammers to the platform and FTC"]
        }
      ],
      conclusion: "Romance scams can happen to anyone. If you suspect you are being scammed, stop all contact immediately, do not send any money, and report the scammer. There is no shame in being targeted; scammers are skilled manipulators."
    }
  },
  {
    slug: "setting-up-two-factor-authentication",
    title: "Setting Up Two-Factor Authentication Without the Confusion",
    excerpt: "Two-factor authentication is one of the best ways to protect your accounts. We explain what it is and how to set it up simply.",
    category: "Account Security",
    readTime: "5 min read",
    featured: false,
    type: "guide",
    content: {
      intro: "Two-factor authentication, often called 2FA, adds an extra layer of security to your accounts. Even if someone steals your password, they cannot get into your account without the second factor.",
      sections: [
        {
          title: "What Is Two-Factor Authentication",
          content: "Two-factor authentication means you need two things to log in: something you know (your password) and something you have (usually your phone). After entering your password, you will receive a code on your phone to complete the login.",
          tips: ["Think of it like a deadbolt in addition to your regular door lock", "The extra step only takes a few seconds", "It stops most hackers even if they have your password"]
        },
        {
          title: "Types of Two-Factor Authentication",
          content: "The most common type is text message codes sent to your phone. Authenticator apps like Google Authenticator are more secure. Some services also support physical security keys or email codes.",
          tips: ["Authenticator apps are free and easy to use", "Text message codes are better than no 2FA at all", "Keep backup codes in a safe place in case you lose your phone"]
        },
        {
          title: "Setting It Up Step by Step",
          content: "Go to the security settings of your account. Look for two-factor authentication, two-step verification, or login verification. Choose your preferred method and follow the prompts to add your phone number or set up an authenticator app.",
          tips: ["Start with your email and banking accounts first", "Take screenshots of backup codes and store them securely", "Most setups take less than five minutes"]
        },
        {
          title: "What If You Lose Your Phone",
          content: "Most services provide backup codes when you set up 2FA. Store these codes in a safe place like a password manager or written down in a secure location. Some services also let you set up a backup phone number.",
          tips: ["Never store backup codes only on your phone", "Update your 2FA settings if you get a new phone", "Contact customer support if you are completely locked out"]
        }
      ],
      conclusion: "Two-factor authentication is one of the most effective ways to protect your accounts. Start with your most important accounts and gradually add it to all your online services."
    }
  },
  {
    slug: "social-media-privacy-settings",
    title: "Social Media Privacy Settings: A Platform by Platform Guide",
    excerpt: "Your social media profiles may be sharing more than you realize. Learn how to lock down your privacy on Facebook, Instagram, and more.",
    category: "Privacy",
    readTime: "12 min read",
    featured: false,
    type: "guide",
    content: {
      intro: "Social media platforms collect and share more information about you than you might realize. Taking a few minutes to adjust your privacy settings can significantly reduce what strangers can see and limit data collection.",
      sections: [
        {
          title: "Facebook Privacy Essentials",
          content: "Go to Settings and Privacy, then Privacy Settings. Set 'Who can see your future posts' to Friends. Review 'Who can see your friends list' and 'Who can look you up using your email or phone number.' Consider limiting past posts as well.",
          tips: ["Use the 'View As' feature to see what others see", "Review and remove apps connected to your Facebook", "Turn off facial recognition if you are uncomfortable with it"]
        },
        {
          title: "Instagram Privacy Controls",
          content: "Consider making your account private so only approved followers can see your posts. Go to Settings, then Privacy, then Account Privacy. Also review who can comment, tag, and mention you in their content.",
          tips: ["Remove followers you do not recognize", "Be careful about location tagging on posts", "Review your tagged photos and remove ones you do not want"]
        },
        {
          title: "General Privacy Best Practices",
          content: "Across all platforms, be cautious about what personal information you share in your bio. Avoid posting your exact location in real time. Think twice before sharing information that could be used to answer security questions.",
          tips: ["Do not share your birthday, hometown, or pet names publicly", "Wait until you return home to post vacation photos", "Regularly review your privacy settings as platforms update them"]
        },
        {
          title: "Managing Your Digital Footprint",
          content: "Search your own name online periodically to see what information is public. Consider deleting old posts that reveal too much personal information. Be thoughtful about what you share going forward.",
          tips: ["Set a calendar reminder to review privacy settings quarterly", "Think about whether you would want an employer to see each post", "What you share online can be difficult to fully remove later"]
        }
      ],
      conclusion: "Taking control of your social media privacy is an ongoing process. Set aside time periodically to review your settings and remove information you no longer want to be public."
    }
  },
  {
    slug: "what-to-do-after-clicking-suspicious-link",
    title: "What To Do After Clicking a Suspicious Link",
    excerpt: "Clicked something you should not have? Do not panic. Here is exactly what to do next to minimize any potential damage.",
    category: "Emergency Response",
    readTime: "4 min read",
    featured: true,
    type: "guide",
    content: {
      intro: "We have all done it: clicked a link without thinking and then realized it might have been dangerous. The good news is that clicking a link alone usually will not infect your device. Here is what to do next.",
      sections: [
        {
          title: "Immediate Steps",
          content: "Close the browser tab immediately. Do not enter any personal information or download anything. If a popup asked you to download or install something, do not proceed. Disconnect from the internet if you are concerned about active malware.",
          tips: ["Force quit your browser if normal closing does not work", "Do not call any phone numbers displayed on the page", "Take a screenshot of the suspicious page if possible"]
        },
        {
          title: "Check for Damage",
          content: "Run a virus scan on your device. Check your browser for any new extensions or toolbars you did not install. Review your download folder for any files you did not intentionally download. Look for any unusual programs in your installed applications.",
          tips: ["Use your existing antivirus or the built in Windows Defender", "Delete any unfamiliar downloads without opening them", "Check your browser homepage and default search engine settings"]
        },
        {
          title: "If You Entered Personal Information",
          content: "If you entered your password anywhere, change that password immediately and on any other sites where you use the same password. If you entered financial information, contact your bank right away to report potential fraud and monitor your accounts.",
          tips: ["Change compromised passwords from a different device if possible", "Enable two-factor authentication on affected accounts", "Check for any unauthorized transactions or activity"]
        },
        {
          title: "Ongoing Monitoring",
          content: "Monitor your accounts and credit reports for the next few months. Set up fraud alerts with credit bureaus if you shared sensitive personal information. Report the phishing attempt to help protect others.",
          tips: ["You can freeze your credit for free at each credit bureau", "Set up account alerts for any unusual activity", "Report phishing to reportphishing@apwg.org"]
        }
      ],
      conclusion: "In most cases, simply clicking a link will not immediately harm you. The real danger comes from what you do next. By acting quickly and following these steps, you can minimize any potential damage."
    }
  },
  {
    slug: "teaching-kids-about-online-safety",
    title: "Teaching Kids About Online Safety: Age Appropriate Conversations",
    excerpt: "How to talk to children about staying safe online without scaring them. Guidance for parents of kids from preschool to teenagers.",
    category: "Family Safety",
    readTime: "9 min read",
    featured: false,
    type: "guide",
    content: {
      intro: "Teaching children about online safety is essential in today's digital world. The key is having ongoing conversations that evolve as they grow, rather than one big talk.",
      sections: [
        {
          title: "Young Children: Ages 5 to 8",
          content: "Focus on the basics: never share personal information like your real name, address, school, or phone number with anyone online. Teach them to tell a parent if anything online makes them uncomfortable.",
          tips: ["Compare online strangers to real-world strangers", "Use parental controls and kid-safe browsers", "Keep devices in shared family spaces"]
        },
        {
          title: "Pre-Teens: Ages 9 to 12",
          content: "Expand the conversation to cover social media basics, cyberbullying, and critical thinking about what they see online. Help them understand that people online are not always who they claim to be.",
          tips: ["Review privacy settings together on any apps they use", "Talk about what to do if they receive mean messages", "Discuss that photos shared online can spread beyond intended recipients"]
        },
        {
          title: "Teenagers: Ages 13 and Up",
          content: "Address more complex topics like digital reputation, sexting consequences, online predators, and scams targeting young people. Focus on decision-making skills rather than strict rules.",
          tips: ["Discuss how colleges and employers check social media", "Talk about healthy online relationships", "Be available without judgment when they have concerns"]
        },
        {
          title: "Creating an Open Environment",
          content: "The most important thing is that your child feels comfortable coming to you with problems. Make it clear they will not get in trouble for reporting something concerning they encountered online.",
          tips: ["Share your own experiences with suspicious emails or scams", "Check in regularly about their online activities", "Know the apps and games your children use"]
        }
      ],
      conclusion: "Online safety is not a one-time conversation but an ongoing dialogue. By staying involved and keeping communication open, you can help your children navigate the digital world safely."
    }
  },
  {
    slug: "small-business-security-basics",
    title: "Small Business Security Basics: Where to Start",
    excerpt: "A practical starting point for small business owners who want to protect their business but do not have an IT department.",
    category: "Business",
    readTime: "7 min read",
    featured: false,
    type: "guide",
    content: {
      intro: "Small businesses are increasingly targeted by cybercriminals because they often lack the security resources of larger companies. The good news is that basic security does not require a large budget or technical expertise.",
      sections: [
        {
          title: "Secure Your Accounts",
          content: "Enable two-factor authentication on all business accounts, especially email, banking, and social media. Use strong, unique passwords for each account. Consider a business password manager to help employees manage credentials securely.",
          tips: ["Start with your email and financial accounts", "Do not share passwords between employees", "Change passwords when employees leave the company"]
        },
        {
          title: "Protect Customer Data",
          content: "Only collect the customer data you actually need. Ensure any payment processing meets PCI compliance standards. Have a clear privacy policy and follow it. Encrypt sensitive data both in storage and in transit.",
          tips: ["Use reputable payment processors like Stripe or Square", "Regularly review who has access to customer data", "Have a plan for notifying customers if a breach occurs"]
        },
        {
          title: "Train Your Team",
          content: "Most breaches involve human error. Train all employees to recognize phishing emails and social engineering attempts. Create clear policies about what information can be shared and with whom.",
          tips: ["Regular training is more effective than one-time sessions", "Run practice phishing tests to identify weak spots", "Make it easy for employees to report suspicious activity"]
        },
        {
          title: "Backup and Recovery",
          content: "Regularly backup all critical business data. Store backups in a separate location from your primary systems. Test your backups periodically to ensure you can actually restore from them.",
          tips: ["Use the 3-2-1 rule: 3 copies, 2 different media types, 1 offsite", "Automate backups so they happen consistently", "Cloud backup services can simplify this process"]
        }
      ],
      conclusion: "You do not need to be perfect at security to significantly reduce your risk. Start with these basics and gradually improve your security posture over time. The most important step is to start."
    }
  },
  // VIDEO TRAINING RESOURCES
  {
    slug: "phishing-email-red-flags-video",
    title: "Phishing Email Red Flags: Visual Training",
    excerpt: "Watch real examples of phishing emails and learn to spot the warning signs in under 5 minutes.",
    category: "Email Safety",
    readTime: "5 min watch",
    featured: true,
    type: "video",
    content: {
      intro: "This visual training walks you through real-world examples of phishing emails, showing you exactly what to look for before you click.",
      sections: [
        {
          title: "Suspicious Sender Addresses",
          content: "Learn to check where an email really comes from. Scammers often use addresses that look similar to legitimate companies but have subtle differences like extra letters or different domains.",
          tips: ["Always hover over the sender name to see the full email address", "Watch for domains that end in unusual extensions", "Be suspicious of generic sender names like 'Customer Service'"]
        },
        {
          title: "Urgent Language Tactics",
          content: "See how scammers create panic to make you act without thinking. Common phrases include 'Your account will be closed' or 'Immediate action required.'",
          tips: ["Legitimate companies rarely threaten immediate consequences", "Take a breath before responding to urgent requests", "Verify by contacting the company directly"]
        },
        {
          title: "Fake Links and Buttons",
          content: "Discover how to reveal where links actually go before clicking. Many phishing emails have buttons that lead to fake websites designed to steal your information.",
          tips: ["Hover over links to see the true destination", "Look for misspelled website names", "When in doubt, type the website address directly in your browser"]
        }
      ],
      conclusion: "Practice these skills whenever you receive an unexpected email. Taking a few seconds to verify can save you from a major security breach."
    }
  },
  {
    slug: "strong-password-creation-video",
    title: "Creating Passwords That Are Easy to Remember But Hard to Crack",
    excerpt: "Learn the passphrase method for creating strong passwords you will actually remember.",
    category: "Account Security",
    readTime: "4 min watch",
    featured: false,
    type: "video",
    content: {
      intro: "Forget everything you know about complex passwords with random characters. This training shows you a better way to create passwords that are both secure and memorable.",
      sections: [
        {
          title: "Why Most Password Advice Is Wrong",
          content: "Passwords like 'P@ssw0rd!' are not as secure as they seem. Learn why length matters more than complexity and how hackers actually crack passwords.",
          tips: ["Longer passwords are exponentially harder to crack", "Random character substitutions are predictable to hackers", "Dictionary words alone are vulnerable to attack"]
        },
        {
          title: "The Passphrase Method",
          content: "Create passwords using four or more random words strung together. A password like 'correct horse battery staple' is both easier to remember and harder to crack than 'Tr0ub4dor&3'.",
          tips: ["Use words that are unrelated to each other", "Add a number or symbol between words for extra security", "Make the phrase personally meaningful but not publicly known"]
        },
        {
          title: "Using a Password Manager",
          content: "See how password managers let you have unique, complex passwords for every account without having to remember them all.",
          tips: ["Only remember one master password", "Password managers can generate random passwords for you", "Many browsers have built-in password managers"]
        }
      ],
      conclusion: "Strong passwords do not have to be hard to remember. Use the passphrase method for passwords you type often, and let a password manager handle the rest."
    }
  },
  {
    slug: "recognizing-tech-support-scams-video",
    title: "Tech Support Scam: What It Looks and Sounds Like",
    excerpt: "See and hear actual tech support scam tactics so you can recognize them when they happen to you.",
    category: "Senior Safety",
    readTime: "6 min watch",
    featured: true,
    type: "video",
    content: {
      intro: "Tech support scams are designed to frighten you into thinking your computer has a serious problem. This training shows you exactly what these scams look and sound like.",
      sections: [
        {
          title: "Fake Virus Warnings",
          content: "See examples of fake popup warnings that claim your computer is infected. Learn why these scary messages are designed to make you panic and call a fake support number.",
          tips: ["Real antivirus software does not tell you to call a phone number", "Close the browser if you see a scary popup", "Your computer cannot be infected just by viewing a webpage"]
        },
        {
          title: "The Phone Call Script",
          content: "Hear the typical phrases scammers use when they call or when you call them. They claim to be from Microsoft, Apple, or your internet provider and use technical language to confuse you.",
          tips: ["Microsoft and Apple will never call you unsolicited", "Do not let anyone remotely access your computer", "Hang up immediately if pressured"]
        },
        {
          title: "What They Want From You",
          content: "Understand the end goal: scammers want remote access to your computer, payment for fake services, or your personal and financial information.",
          tips: ["Never pay for tech support you did not initiate", "Gift cards are never a legitimate payment method", "Do not provide banking information over the phone"]
        }
      ],
      conclusion: "When in doubt, hang up and call a trusted family member or friend. Legitimate tech support will never pressure you to act immediately."
    }
  },
  {
    slug: "social-media-privacy-walkthrough-video",
    title: "Lock Down Your Facebook Privacy: Step by Step",
    excerpt: "Follow along as we show you exactly where to find and change your Facebook privacy settings.",
    category: "Privacy",
    readTime: "7 min watch",
    featured: false,
    type: "video",
    content: {
      intro: "Facebook has dozens of privacy settings hidden in different places. This walkthrough shows you exactly where to find them and what each setting does.",
      sections: [
        {
          title: "Who Can See Your Posts",
          content: "Learn to control who sees what you share. By default, your posts may be visible to more people than you realize.",
          tips: ["Set your default audience to Friends only", "Review past posts and limit their visibility", "Check who can see your friends list"]
        },
        {
          title: "Who Can Find and Contact You",
          content: "Control how people can find your profile and send you messages. You can limit searches by email or phone number.",
          tips: ["Restrict who can send you friend requests", "Control who can look you up by phone number", "Review your profile's visibility to search engines"]
        },
        {
          title: "Apps and Data Sharing",
          content: "See which apps have access to your Facebook data and remove any you no longer use or trust.",
          tips: ["Regularly review connected apps", "Remove access for apps you do not recognize", "Be cautious about new app permissions"]
        }
      ],
      conclusion: "Take 10 minutes now to review your privacy settings. Your future self will thank you for protecting your personal information."
    }
  },
  // CHECKLIST RESOURCES
  {
    slug: "weekly-security-checkup-checklist",
    title: "Weekly Security Checkup: 5 Minute Routine",
    excerpt: "A quick weekly routine to keep your accounts and devices secure. Print this out and check off each item.",
    category: "Account Security",
    readTime: "5 min checklist",
    featured: true,
    type: "checklist",
    checklistItems: [
      { task: "Review recent account activity", description: "Check your email, bank, and social media accounts for any logins or transactions you do not recognize." },
      { task: "Update one password", description: "Pick one account each week to update with a stronger password. Over time, all your accounts will be more secure." },
      { task: "Check for software updates", description: "Update your phone, computer, and apps. Updates often include important security fixes." },
      { task: "Delete suspicious emails", description: "Clear out any suspicious emails without clicking links. Report phishing attempts if your email provider allows it." },
      { task: "Review app permissions", description: "On your phone, check which apps have access to your location, camera, and microphone. Remove permissions that are not needed." }
    ],
    content: {
      intro: "A consistent weekly routine is one of the best ways to maintain good security habits. This checklist takes just 5 minutes and can prevent major problems.",
      sections: [],
      conclusion: "Set a recurring reminder to complete this checklist each week. Consistency is more important than perfection."
    }
  },
  {
    slug: "travel-security-checklist",
    title: "Before You Travel: Security Checklist",
    excerpt: "Protect yourself from cyber threats while traveling. Complete this checklist before your next trip.",
    category: "Privacy",
    readTime: "10 min checklist",
    featured: false,
    type: "checklist",
    checklistItems: [
      { task: "Enable two-factor authentication on all accounts", description: "If your password is compromised while traveling, 2FA provides a crucial backup layer of security." },
      { task: "Notify your bank of travel plans", description: "Prevent your cards from being frozen for suspicious activity. Most banks have an online form or app setting for this." },
      { task: "Back up your devices", description: "Create a backup of your phone and laptop before you leave. If a device is lost or stolen, you will not lose your data." },
      { task: "Download offline maps and documents", description: "Save maps and important travel documents offline so you do not need to connect to public WiFi to access them." },
      { task: "Set up a VPN", description: "A VPN encrypts your internet connection on public WiFi. Consider a reputable paid service for better security." },
      { task: "Enable device tracking", description: "Make sure Find My iPhone or Find My Device is enabled so you can locate or wipe a lost device." },
      { task: "Use a travel email address", description: "Consider using a separate email for travel bookings to limit exposure if that account is compromised." },
      { task: "Print backup copies of important documents", description: "Have paper copies of your passport, travel insurance, and emergency contacts in case you lose device access." }
    ],
    content: {
      intro: "Traveling exposes you to additional security risks including public WiFi networks, device theft, and unfamiliar environments. This checklist helps you prepare.",
      sections: [],
      conclusion: "Complete this checklist at least a few days before you travel so you have time to address any issues that come up."
    }
  },
  {
    slug: "new-device-setup-checklist",
    title: "New Device Security Setup Checklist",
    excerpt: "Setting up a new phone, tablet, or computer? Complete these steps to start with strong security.",
    category: "Account Security",
    readTime: "15 min checklist",
    featured: false,
    type: "checklist",
    checklistItems: [
      { task: "Set a strong screen lock", description: "Use a 6-digit PIN at minimum, or better yet, a passphrase. Enable biometric unlock for convenience." },
      { task: "Enable automatic updates", description: "Turn on automatic updates for both the operating system and apps. This ensures you always have the latest security patches." },
      { task: "Set up device tracking", description: "Enable Find My iPhone, Find My Device, or similar tracking. This lets you locate, lock, or wipe a lost device." },
      { task: "Review privacy settings", description: "Go through privacy settings and limit which apps can access your location, microphone, camera, and contacts." },
      { task: "Install security software", description: "On computers, install reputable antivirus software. On phones, stick to official app stores to avoid malicious apps." },
      { task: "Set up a backup system", description: "Configure automatic backups to the cloud or an external drive. Regular backups protect against data loss." },
      { task: "Enable two-factor authentication", description: "Set up 2FA on your primary accounts, especially email and any financial accounts." },
      { task: "Install a password manager", description: "Set up a password manager to generate and store strong, unique passwords for all your accounts." },
      { task: "Customize lock screen notifications", description: "Hide sensitive notification previews from your lock screen so others cannot read them." },
      { task: "Remove pre-installed bloatware", description: "Uninstall any unnecessary pre-installed apps that you will not use, especially those with excessive permissions." }
    ],
    content: {
      intro: "The best time to secure a device is right when you set it up. Taking these steps now will protect you throughout the life of the device.",
      sections: [],
      conclusion: "Bookmark this checklist and use it every time you get a new device. Good security habits start on day one."
    }
  },
  {
    slug: "after-data-breach-checklist",
    title: "What To Do After a Data Breach: Action Checklist",
    excerpt: "Your data was exposed in a breach? Follow these steps immediately to protect yourself.",
    category: "Emergency Response",
    readTime: "20 min checklist",
    featured: true,
    type: "checklist",
    checklistItems: [
      { task: "Change the breached password immediately", description: "If you used that password anywhere else, change it on those accounts too. Each account should have a unique password." },
      { task: "Enable two-factor authentication", description: "Add 2FA to the breached account and any other accounts where you used the same password." },
      { task: "Check what data was exposed", description: "The breach notification should tell you what was leaked. This determines your next steps." },
      { task: "Place a fraud alert with credit bureaus", description: "Contact Equifax, Experian, or TransUnion to place a free fraud alert. This makes it harder for thieves to open accounts in your name." },
      { task: "Consider a credit freeze", description: "A credit freeze prevents new accounts from being opened in your name. You can temporarily lift it when needed." },
      { task: "Review your credit reports", description: "Get free credit reports from annualcreditreport.com and look for accounts or inquiries you do not recognize." },
      { task: "Monitor your financial accounts", description: "Watch your bank and credit card statements closely for the next several months for unauthorized charges." },
      { task: "Be alert for phishing attempts", description: "Scammers may use the breached data to send targeted phishing emails. Be extra cautious with unexpected messages." },
      { task: "Update security questions", description: "If security questions were exposed, change them on all accounts where you use similar questions." },
      { task: "Document everything", description: "Keep records of the breach notification, your response steps, and any suspicious activity. This helps if you need to dispute fraud." }
    ],
    content: {
      intro: "Data breaches are unfortunately common, but quick action can limit the damage. Follow these steps as soon as you learn your data was exposed.",
      sections: [],
      conclusion: "Complete these steps within the first 24 to 48 hours after learning of a breach. The faster you act, the better protected you will be."
    }
  },
  {
    slug: "family-security-conversation-checklist",
    title: "Family Security Talk: Conversation Checklist",
    excerpt: "Key topics to cover when talking with family members about online safety.",
    category: "Family Safety",
    readTime: "15 min checklist",
    featured: false,
    type: "checklist",
    checklistItems: [
      { task: "Explain why security matters", description: "Start with real examples of how scams affect real people. Avoid scare tactics but be honest about risks." },
      { task: "Discuss password habits", description: "Talk about using different passwords for different accounts and how password managers can help." },
      { task: "Cover phishing recognition", description: "Show examples of phishing emails and texts. Practice identifying red flags together." },
      { task: "Set up two-factor authentication together", description: "Help family members enable 2FA on their most important accounts. Walk through the process step by step." },
      { task: "Establish a verification protocol", description: "Create a family rule: verify any unexpected money requests by calling the person directly on a known phone number." },
      { task: "Discuss social media privacy", description: "Review privacy settings together and talk about what is safe to share publicly." },
      { task: "Create a family code word", description: "Establish a secret word only family members know. This helps verify identity in emergencies." },
      { task: "Plan for emergencies", description: "Discuss what to do if someone thinks they have been scammed. Make sure everyone knows who to call for help." }
    ],
    content: {
      intro: "Protecting your family online works best when everyone understands the basics. Use this checklist to guide important security conversations.",
      sections: [],
      conclusion: "Make security a regular topic, not a one-time lecture. Brief, ongoing conversations are more effective than lengthy presentations."
    }
  }
];

const categories = ["All", "Email Safety", "Senior Safety", "Scam Awareness", "Account Security", "Privacy", "Emergency Response", "Family Safety", "Business"];

const categoryMapping: Record<string, string> = {
  "phishing": "Email Safety",
  "scams": "Scam Awareness",
  "privacy": "Privacy",
  "passwords": "Account Security",
  "seniors": "Senior Safety",
  "family": "Family Safety",
  "business": "Business",
  "emergency": "Emergency Response",
};

const typeLabels: Record<ResourceType, string> = {
  guide: "Guide",
  video: "Video Training",
  checklist: "Checklist"
};

const resourceTypes: ResourceType[] = ["guide", "video", "checklist"];

export default function Resources() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const categoryParam = params.get("category");
  const typeParam = params.get("type") as ResourceType | null;
  
  const getInitialCategory = () => {
    if (!categoryParam) return "All";
    const mappedCategory = categoryMapping[categoryParam.toLowerCase()];
    if (mappedCategory && categories.includes(mappedCategory)) return mappedCategory;
    if (categories.includes(categoryParam)) return categoryParam;
    return "All";
  };

  const getInitialType = (): ResourceType | "All" => {
    if (!typeParam) return "All";
    if (resourceTypes.includes(typeParam)) return typeParam;
    return "All";
  };

  const [selectedCategory, setSelectedCategory] = useState(getInitialCategory);
  const [selectedType, setSelectedType] = useState<ResourceType | "All">(getInitialType);
  const [expandedResource, setExpandedResource] = useState<string | null>(null);

  useEffect(() => {
    const newCategory = getInitialCategory();
    const newType = getInitialType();
    if (newCategory !== selectedCategory) {
      setSelectedCategory(newCategory);
    }
    if (newType !== selectedType) {
      setSelectedType(newType);
    }
  }, [searchString]);

  const filteredResources = resources.filter(r => {
    const categoryMatch = selectedCategory === "All" || r.category === selectedCategory;
    const typeMatch = selectedType === "All" || r.type === selectedType;
    return categoryMatch && typeMatch;
  });
  
  const featuredResources = filteredResources.filter(r => r.featured);
  const allResources = filteredResources;

  const handleResourceClick = (slug: string) => {
    const newSlug = expandedResource === slug ? null : slug;
    setExpandedResource(newSlug);
    
    if (newSlug) {
      setTimeout(() => {
        const expandedElement = document.querySelector(`[data-testid="expanded-featured-${newSlug}"], [data-testid="article-expanded-${newSlug}"]`);
        if (expandedElement) {
          expandedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const getResourceBySlug = (slug: string) => resources.find(r => r.slug === slug);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.resources} />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Your Security Education Library"
          subtitle="Practical guides and articles written in everyday language. Learn at your own pace, with content you can actually understand and apply."
          imageSrc={bannerImage}
          imageAlt="Cozy library corner with open guidebooks and educational materials on a wooden table with warm ambient lighting"
          imagePosition="right"
          colorVariant="indigo"
        />

        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {featuredResources.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-6">Featured Guides</h2>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {featuredResources.map((resource, index) => (
                    <motion.div
                      key={resource.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card 
                        className={`h-full hover-elevate cursor-pointer ${expandedResource === resource.slug ? 'ring-2 ring-primary' : ''}`}
                        data-testid={`featured-${resource.slug}`}
                        onClick={() => handleResourceClick(resource.slug)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                              Featured
                            </Badge>
                            <Badge variant="outline">{resource.category}</Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {resource.type === "video" && <Video className="w-3 h-3" />}
                              {resource.type === "checklist" && <ClipboardCheck className="w-3 h-3" />}
                              {resource.type === "guide" && <FileText className="w-3 h-3" />}
                              {typeLabels[resource.type]}
                            </Badge>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                            {resource.title}
                          </h3>
                          
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {resource.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              {resource.type === "video" ? <Play className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              <span>{resource.readTime}</span>
                            </div>
                            <span className="text-primary text-sm font-medium flex items-center gap-1">
                              {expandedResource === resource.slug ? "Close" : resource.type === "video" ? "Watch" : resource.type === "checklist" ? "View" : "Read more"} 
                              <ChevronDown className={`w-3 h-3 transition-transform ${expandedResource === resource.slug ? 'rotate-180' : ''}`} />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                {/* Expanded content for featured guides */}
                {featuredResources.map(resource => 
                  expandedResource === resource.slug && (
                    <div
                      key={`expanded-${resource.slug}`}
                      className="mb-16"
                    >
                      <Card className="border-2 border-primary/20" data-testid={`expanded-featured-${resource.slug}`}>
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex items-start justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                {resource.type === "video" && <Video className="w-6 h-6 text-primary" />}
                                {resource.type === "checklist" && <ClipboardCheck className="w-6 h-6 text-primary" />}
                                {resource.type === "guide" && <FileText className="w-6 h-6 text-primary" />}
                              </div>
                              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {resource.title}
                              </h2>
                            </div>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => setExpandedResource(null)}
                              data-testid="button-close-featured-article"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </div>

                          <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-lg text-muted-foreground mb-8">
                              {resource.content.intro}
                            </p>

                            {resource.content.sections.length > 0 && (
                              <div className="space-y-8">
                                {resource.content.sections.map((section, idx) => (
                                  <div key={idx}>
                                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                        {idx + 1}
                                      </span>
                                      {section.title}
                                    </h3>
                                    <div className="pl-10 space-y-2">
                                      <p className="text-muted-foreground">{section.content}</p>
                                      {section.tips && section.tips.length > 0 && (
                                        <div className="mt-3 space-y-1">
                                          {section.tips.map((tip: string, tidx: number) => (
                                            <div key={tidx} className="flex items-start gap-2">
                                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                              <p className="text-muted-foreground text-sm">{tip}</p>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {resource.content.conclusion && (
                              <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                                <h4 className="font-semibold text-foreground mb-2">Key Takeaway</h4>
                                <p className="text-muted-foreground">{resource.content.conclusion}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                )}
              </>
            )}

            <div className="flex flex-col gap-4 mb-8">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Filter by Topic</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={category === selectedCategory ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(category);
                        setExpandedResource(null);
                      }}
                      data-testid={`filter-${category.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Filter by Type</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedType === "All" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedType("All");
                      setExpandedResource(null);
                    }}
                    data-testid="filter-type-all"
                  >
                    All Types
                  </Button>
                  <Button
                    variant={selectedType === "guide" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedType("guide");
                      setExpandedResource(null);
                    }}
                    data-testid="filter-type-guide"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Guides
                  </Button>
                  <Button
                    variant={selectedType === "video" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedType("video");
                      setExpandedResource(null);
                    }}
                    data-testid="filter-type-video"
                  >
                    <Video className="w-4 h-4 mr-1" />
                    Videos
                  </Button>
                  <Button
                    variant={selectedType === "checklist" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedType("checklist");
                      setExpandedResource(null);
                    }}
                    data-testid="filter-type-checklist"
                  >
                    <ClipboardCheck className="w-4 h-4 mr-1" />
                    Checklists
                  </Button>
                </div>
              </div>
            </div>

            {expandedResource && (
                <div className="mb-8">
                  {(() => {
                    const resource = getResourceBySlug(expandedResource);
                    if (!resource) return null;
                    
                    return (
                      <Card className="border-primary/20" data-testid={`article-expanded-${resource.slug}`}>
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge variant="outline">{resource.category}</Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  {resource.type === "video" && <Video className="w-3 h-3" />}
                                  {resource.type === "checklist" && <ClipboardCheck className="w-3 h-3" />}
                                  {resource.type === "guide" && <FileText className="w-3 h-3" />}
                                  {typeLabels[resource.type]}
                                </Badge>
                                <span className="text-sm text-muted-foreground">{resource.readTime}</span>
                              </div>
                              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {resource.title}
                              </h2>
                            </div>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => setExpandedResource(null)}
                              data-testid="button-close-article"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </div>

                          <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-lg text-muted-foreground mb-8">
                              {resource.content.intro}
                            </p>

                            {/* Video Training Display */}
                            {resource.type === "video" && (
                              <div className="mb-8 p-6 bg-muted/30 rounded-lg border flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Play className="w-8 h-8 text-primary" />
                                </div>
                                <p className="text-muted-foreground text-center">
                                  Video training content. In a full implementation, this would embed an educational video player.
                                  <br />
                                  <span className="text-sm">For now, review the training topics below.</span>
                                </p>
                              </div>
                            )}

                            {/* Checklist Display */}
                            {resource.type === "checklist" && resource.checklistItems && (
                              <div className="mb-8 space-y-3 checklist-print-area" role="region" aria-label="Interactive checklist">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5 text-primary" aria-hidden="true" />
                                    Your Checklist
                                  </h3>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.print()}
                                    className="no-print"
                                    aria-label="Print this checklist"
                                    data-testid="button-print-checklist"
                                  >
                                    <Printer className="w-4 h-4 mr-2" aria-hidden="true" />
                                    Print
                                  </Button>
                                </div>
                                <div role="group" aria-label="Checklist items">
                                  {resource.checklistItems.map((item, idx) => (
                                    <div 
                                      key={idx} 
                                      className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border hover-elevate checklist-item"
                                    >
                                      <input 
                                        type="checkbox"
                                        id={`checklist-${resource.slug}-${idx}`}
                                        className="mt-1 w-5 h-5 rounded border-primary text-primary focus:ring-primary cursor-pointer"
                                        aria-describedby={`checklist-desc-${resource.slug}-${idx}`}
                                        data-testid={`checklist-item-${idx}`}
                                      />
                                      <div className="flex-1">
                                        <label 
                                          htmlFor={`checklist-${resource.slug}-${idx}`}
                                          className="font-medium text-foreground cursor-pointer"
                                        >
                                          {item.task}
                                        </label>
                                        <p 
                                          id={`checklist-desc-${resource.slug}-${idx}`}
                                          className="text-sm text-muted-foreground mt-1"
                                        >
                                          {item.description}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Standard Content Sections */}
                            {resource.content.sections.length > 0 && (
                              <div className="space-y-8">
                                {resource.type === "video" && (
                                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    Training Topics
                                  </h3>
                                )}
                                {resource.content.sections.map((section, idx) => (
                                  <div key={idx}>
                                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                                      {resource.type === "video" ? (
                                        <Play className="w-5 h-5 text-primary" />
                                      ) : (
                                        <Shield className="w-5 h-5 text-primary" />
                                      )}
                                      {section.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                      {section.content}
                                    </p>
                                    {section.tips && section.tips.length > 0 && (
                                      <div className="bg-muted/50 rounded-lg p-4">
                                        <p className="font-medium text-sm mb-2 flex items-center gap-2">
                                          <CheckCircle2 className="w-4 h-4 text-primary" />
                                          Key Tips
                                        </p>
                                        <ul className="space-y-1">
                                          {section.tips.map((tip, tipIdx) => (
                                            <li key={tipIdx} className="text-sm text-muted-foreground flex items-start gap-2">
                                              <span className="text-primary mt-1">•</span>
                                              <span>{tip}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
                              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-primary" />
                                {resource.type === "checklist" ? "Remember" : "Key Takeaway"}
                              </h3>
                              <p className="text-muted-foreground">
                                {resource.content.conclusion}
                              </p>
                            </div>
                          </div>

                          <div className="mt-8 flex gap-4">
                            <Button 
                              variant="outline"
                              onClick={() => setExpandedResource(null)}
                              data-testid="button-back-to-list"
                            >
                              Back to Resources
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}
                </div>
              )}

            {!expandedResource && (
              <div className="grid md:grid-cols-2 gap-6">
                {allResources.map((resource, index) => (
                  <motion.div
                    key={resource.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card 
                      className="h-full hover-elevate cursor-pointer" 
                      data-testid={`resource-${resource.slug}`}
                      onClick={() => handleResourceClick(resource.slug)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {resource.type === "video" && <Video className="w-5 h-5 text-primary" />}
                            {resource.type === "checklist" && <ClipboardCheck className="w-5 h-5 text-primary" />}
                            {resource.type === "guide" && <FileText className="w-5 h-5 text-primary" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">{resource.category}</Badge>
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                {resource.type === "video" && <Play className="w-3 h-3" />}
                                {resource.type === "checklist" && <ClipboardCheck className="w-3 h-3" />}
                                {resource.type === "guide" && <FileText className="w-3 h-3" />}
                                {typeLabels[resource.type]}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{resource.readTime}</span>
                            </div>
                            
                            <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                              {resource.title}
                            </h3>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {resource.excerpt}
                            </p>
                          </div>
                          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No resources found</h3>
                <p className="text-muted-foreground mb-4">
                  No resources match your selected filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedType("All");
                  }}
                  data-testid="button-clear-filter"
                >
                  View All Resources
                </Button>
              </div>
            )}
          </div>
        </section>

        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
}
