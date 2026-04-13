"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StructuredData } from "@/components/structured-data";
import type { FAQData, BreadcrumbData } from "@/components/structured-data";
import { Link } from "@/lib/navigation";
import { RelatedResources, RESOURCE_LINKS } from "@/components/related-resources";
import {
  Shield, Lock, Phone, Heart, Mail, CreditCard,
  CheckCircle, BookOpen, AlertTriangle,
  Users, ArrowRight,
  MessageCircle, BadgeCheck,
  ExternalLink, Wallet, UserX, ChevronDown, ChevronUp,
  Search, BarChart3, TreeDeciduous, Handshake
} from "lucide-react";
import bannerImage from "@/assets/banners/seniors-banner.webp";
import cardRomanceScams from "@/assets/images/card-romance-scams.webp";
import cardTechSupportScams from "@/assets/images/card-tech-support-scams.webp";
import cardMedicareScams from "@/assets/images/card-medicare-scams.webp";
import cardPhoneEmailScams from "@/assets/images/card-phone-email-scams.webp";
import cardIdentityTheft from "@/assets/images/card-identity-theft-seniors.webp";
import cardOnlineShopping from "@/assets/images/card-online-shopping-seniors.webp";
import cardGovernmentScams from "@/assets/images/card-government-scams.webp";
import cardInvestmentFraud from "@/assets/images/card-investment-fraud.webp";

import {
  ScamScenarioExercise,
  SafetyChecklist,
  ScamDeepDive,
  EmergencyFlowchart,
  ScamStatsInfographic,
  FamilyCommunicationToolkit
} from "@/components/seniors-hub/interactive-tools";
import {
  scamScenarios,
  safetyChecklists,
  deepDiveModules,
  emergencyFlowSteps,
  scamStats,
  familyConversations
} from "@/components/seniors-hub/scenario-data";
import { imgSrc } from "@/lib/img-src";

interface PlatformGuide {
  platform: string;
  steps: string[];
}

interface SafetyTopic {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
  color: string;
  image?: string;
  content: {
    intro: string;
    keyPoints: string[];
    platformGuides: PlatformGuide[];
    quickChecklist: string[];
    familyTalkingPoints: string[];
    warningSign?: string;
  };
}

const seniorSafetyTopics: SafetyTopic[] = [
  {
    id: "romance-scams",
    title: "Romance and Friendship Scams",
    description: "Recognize fake online relationships designed to steal money.",
    icon: Heart,
    color: "bg-rose-500",
    image: imgSrc(cardRomanceScams),
    content: {
      intro: "Romance scammers create fake profiles on dating sites, social media, or even through text messages. They build emotional connections over weeks or months, then ask for money for emergencies, travel, or investments. These criminals are skilled at manipulation and target people seeking companionship.",
      keyPoints: [
        "Romance scams cost victims over $1.14 billion in 2023 according to the FTC. Adults over 60 lose the most money per incident.",
        "Scammers often work in organized teams, operating multiple fake profiles simultaneously across different platforms.",
        "They invest weeks or months building trust before ever asking for money. The emotional manipulation makes victims feel genuine love.",
        "Cryptocurrency and wire transfers are the most requested payment methods because they are nearly impossible to reverse.",
        "Scammers will always have a reason they cannot meet in person or do a live video call. This is the single biggest red flag."
      ],
      platformGuides: [
        {
          platform: "On Dating Apps",
          steps: [
            "Before responding to a match, do a reverse image search on their profile photo. Go to images.google.com, click the camera icon, and upload or paste their photo. If it appears on stock photo sites or belongs to someone else, it is a fake profile.",
            "Check the profile for inconsistencies. Scammers often have very few photos, no connections to local people, and vague details about their work or location.",
            "Insist on a live video call early in the conversation. Say: 'I'd love to see your face. Can we do a quick video chat?' If they refuse repeatedly or always have excuses, this is a major red flag.",
            "Never share your financial information, Social Security number, or home address with someone you have only met online.",
            "If someone asks you to move the conversation off the dating app to a private messaging app like WhatsApp or Telegram early on, be cautious. Scammers do this to avoid platform monitoring.",
            "Report suspicious profiles to the dating app. On Match.com, tap the three dots on their profile and select Report. On eHarmony, use the Report a Concern link on their profile.",
            "Tell a trusted friend or family member about anyone you are talking to online. An outside perspective can spot red flags you might miss."
          ]
        },
        {
          platform: "On Facebook / Social Media",
          steps: [
            "Check how long the account has existed. Click their name, then look at their timeline. If it was created recently and has very few posts or friends, it may be fake.",
            "Look at their friends list. If they have very few friends, or their friends are mostly from a different country than they claim to live in, be suspicious.",
            "Check their photos. Scammers often steal photos from real people. Right-click any photo, select 'Search Google for image' to check if the photos appear elsewhere.",
            "Go to your Facebook privacy settings. Click Settings & Privacy, then Settings, then Privacy. Set 'Who can send you friend requests' to 'Friends of friends' to reduce contact from strangers.",
            "Set 'Who can see your friends list' to 'Only me' so scammers cannot use your connections to appear legitimate.",
            "If someone you do not know sends you a message with flattering compliments or asks personal questions, do not respond. Block and report the account.",
            "To report a fake profile on Facebook: go to the profile, click the three dots below the cover photo, select 'Find support or report', then 'Pretending to be someone' or 'Fake account'."
          ]
        },
        {
          platform: "If Someone Asked for Money",
          steps: [
            "Stop all communication immediately. Do not send any more money, regardless of what they say. Scammers will create increasingly desperate stories.",
            "Do not feel embarrassed. Romance scams are sophisticated criminal operations. You are a victim of a crime, not someone who made a foolish mistake.",
            "Contact your bank or credit union immediately. If you sent money by wire transfer, call the wire transfer company (Western Union: 1-800-448-1492, MoneyGram: 1-800-926-9400) and ask to reverse the transfer.",
            "If you sent money via gift cards, contact the gift card company immediately. Keep the cards and receipts. Companies like iTunes, Google Play, and Amazon have fraud departments.",
            "If you shared bank account information, contact your bank to freeze or close the account and open a new one.",
            "Report to the FTC at reportfraud.ftc.gov. Include all details: the person's name, profile information, how you communicated, and how much money you sent.",
            "File a report with the FBI Internet Crime Complaint Center (IC3) at ic3.gov. This helps law enforcement track and prosecute scam networks.",
            "If you sent cryptocurrency, report to the FBI IC3 and the cryptocurrency exchange you used. Recovery is difficult but not always impossible."
          ]
        },
        {
          platform: "Protecting Yourself Going Forward",
          steps: [
            "Set up your dating profile safely: use a first name only, do not include your last name, workplace, or neighborhood.",
            "Use a separate email address for dating sites. Create a free Gmail or Outlook account just for this purpose.",
            "Never include your phone number in your dating profile. Use the messaging system built into the dating app.",
            "Choose photos that do not reveal your home, street name, or other identifying information.",
            "Set a personal rule: you will not send money to anyone you have not met in person, no matter how strong the connection feels.",
            "Talk to a friend or family member about your online dating activity. Having someone to check in with provides a safety net.",
            "Consider using only paid dating sites. While not scam-proof, they tend to have better verification and monitoring than free apps."
          ]
        }
      ],
      quickChecklist: [
        "I have never sent money to someone I have only met online.",
        "I know how to do a reverse image search to verify profile photos.",
        "My dating profiles do not include my full name, address, or workplace.",
        "I have told a trusted person about my online relationships.",
        "I insist on video calls before developing emotional attachments.",
        "I know that requests for gift cards or wire transfers are always scam signs."
      ],
      familyTalkingPoints: [
        "I want to make sure you are safe with online dating. Can we talk about what to watch out for?",
        "Have you met anyone new online recently? I would love to hear about them.",
        "If anyone ever asks you for money online, please call me first. There's no judgment, I just want to help.",
        "Would you feel comfortable showing me how the dating app works? I want to understand what you are seeing."
      ],
      warningSign: "If someone you have never met in person says they love you and then asks for money for an emergency, plane ticket, medical bill, or investment opportunity, it is almost certainly a scam. Real love does not require wire transfers."
    }
  },
  {
    id: "tech-support-scams",
    title: "Tech Support Scams",
    description: "Avoid fake computer support calls and pop-up warnings.",
    icon: Phone,
    color: "bg-blue-500",
    image: imgSrc(cardTechSupportScams),
    content: {
      intro: "Tech support scammers pretend to be from well-known companies like Microsoft, Apple, or your internet provider. They may call you directly or use scary pop-up messages claiming your computer has a virus. Their goal is to get remote access to your computer or convince you to pay for unnecessary services.",
      keyPoints: [
        "Microsoft, Apple, Google, and your internet provider will never call you unexpectedly about computer problems. If someone calls claiming to be tech support, it is a scam.",
        "Scary pop-up warnings with phone numbers are always fake. Real virus warnings come from antivirus software you installed, not from your web browser.",
        "The FTC received over 100,000 tech support scam reports in 2023, with median losses of $999 for adults over 60.",
        "Scammers who gain remote access to your computer can install malware, steal passwords, access banking, and lock you out of your own device.",
        "Legitimate tech support never demands payment via gift cards, wire transfers, or cryptocurrency. These payment methods are untraceable and a guaranteed sign of fraud."
      ],
      platformGuides: [
        {
          platform: "Scary Pop-up on Your Computer",
          steps: [
            "Do NOT click anything on the pop-up. Do not click 'OK', 'Cancel', 'Close', or any phone number. Clicking can install malware.",
            "On Windows: Press Ctrl + Alt + Delete at the same time. Click 'Task Manager'. Find your web browser (Chrome, Edge, Firefox) in the list, click it, then click 'End Task'. This force-closes the browser without clicking the pop-up.",
            "On Mac: Press Command + Option + Escape at the same time. Find your web browser (Safari, Chrome, Firefox) in the list, click it, then click 'Force Quit'.",
            "If your keyboard is not responding, press and hold the power button on your computer for 10 seconds until it shuts off completely. Wait 30 seconds, then turn it back on.",
            "After closing the pop-up, clear your browser history. In Chrome: click the three dots, then 'Delete browsing data', select 'All time', check all boxes, and click 'Delete data'. In Safari: click Safari in the menu bar, then 'Clear History'.",
            "Run a scan with your antivirus software. If you do not have one, Windows has built-in Windows Security. Open it from the Start menu and click 'Virus & threat protection', then 'Quick scan'.",
            "Write down what happened and when. If the pop-up returns, it may mean a browser extension or downloaded program is causing it."
          ]
        },
        {
          platform: "Unexpected Phone Call",
          steps: [
            "Hang up immediately. You do not need to be polite. Simply say 'I am not interested' and hang up, or just hang up without saying anything.",
            "Do NOT give them any information. Do not confirm your name, computer type, email address, or any other details.",
            "Do NOT let them guide you to your computer. They may ask you to 'just check something' on your computer. This is how they get you to grant remote access.",
            "Do NOT download any software they suggest, including remote access tools like AnyDesk, TeamViewer, or LogMeIn.",
            "If they claim to be from a specific company, hang up and call that company directly using the phone number on their official website or on your bill. Do not use any number the caller gives you.",
            "Block the caller's phone number on your phone. On iPhone: go to Recent Calls, tap the 'i' next to the number, scroll down, and tap 'Block this Caller'. On Android: go to Recent Calls, tap the number, then tap 'Block'.",
            "Report the call to the FTC at reportfraud.ftc.gov or call 1-877-382-4357."
          ]
        },
        {
          platform: "If You Gave Remote Access",
          steps: [
            "Disconnect from the internet immediately. Unplug the ethernet cable or turn off Wi-Fi. On Windows: click the Wi-Fi icon in the bottom right and click 'Disconnect'. On Mac: click the Wi-Fi icon in the top menu bar and click 'Turn Wi-Fi Off'.",
            "If a remote access program is still running, force close it. On Windows: press Ctrl + Alt + Delete, open Task Manager, find AnyDesk/TeamViewer/LogMeIn, and click 'End Task'. On Mac: press Command + Option + Escape and force quit the app.",
            "Uninstall any software they told you to download. On Windows: go to Settings, then Apps, find the program, and click Uninstall. On Mac: drag the app from Applications to the Trash.",
            "Change your passwords immediately from a different device (use your phone or a family member's computer). Start with email, then banking, then social media.",
            "Run a full antivirus scan on your computer. Use Windows Security (built-in) or install a free antivirus like Malwarebytes.",
            "Contact your bank and credit card companies. Tell them someone had remote access to your computer and ask them to monitor for suspicious activity. Consider freezing your accounts temporarily.",
            "Check your bank and credit card statements for any unauthorized charges for the next several months.",
            "If you gave them payment information, call the payment method: your bank, credit card company, gift card issuer, or wire transfer service to try to reverse the charges."
          ]
        },
        {
          platform: "Preventing Future Calls",
          steps: [
            "Register your phone number on the National Do Not Call Registry at donotcall.gov or call 1-888-382-1222. This will not stop all scam calls but reduces legitimate telemarketing.",
            "Enable call screening on your phone. On iPhone: go to Settings, then Phone, then 'Silence Unknown Callers'. On Android: open the Phone app, tap the three dots, then Settings, then 'Caller ID & spam', turn on 'Filter spam calls'.",
            "Ask your phone carrier about free call-blocking services. AT&T has ActiveArmor, Verizon has Call Filter, and T-Mobile has Scam Shield. Call your carrier's customer service number to set these up.",
            "Consider installing a call-blocking app like Nomorobo (free for landlines), RoboKiller, or Truecaller. These apps identify and block known scam numbers.",
            "If you have a landline, contact your phone provider about enabling 'Anonymous Call Rejection', which blocks calls from numbers that have blocked their caller ID.",
            "Never call back a number left in a voicemail claiming tech support issues. Instead, look up the company's real phone number yourself.",
            "Keep your computer's operating system and antivirus software updated. This is the real way to protect against computer problems."
          ]
        }
      ],
      quickChecklist: [
        "I know that real tech companies never call me unexpectedly about problems.",
        "I know how to force-close my browser if a scary pop-up appears.",
        "I never give remote access to anyone who contacts me first.",
        "My phone has call screening or a call-blocking app enabled.",
        "I am registered on the National Do Not Call Registry.",
        "I know to call companies directly using numbers from their official website."
      ],
      familyTalkingPoints: [
        "Have you gotten any unexpected calls about your computer lately? Those are always scams.",
        "If you ever see a scary pop-up on your computer, call me before doing anything. I can walk you through closing it safely.",
        "Remember, Microsoft and Apple will never call you. If you get that call, just hang up.",
        "Let me help you set up call blocking on your phone to reduce scam calls."
      ],
      warningSign: "If someone calls claiming your computer is infected and asks you to download software or give them remote access, hang up immediately. This is always a scam, no matter how convincing they sound."
    }
  },
  {
    id: "medicare-health-scams",
    title: "Medicare and Health Scams",
    description: "Protect your Medicare number and health information.",
    icon: BadgeCheck,
    color: "bg-green-500",
    image: imgSrc(cardMedicareScams),
    content: {
      intro: "Scammers target seniors by pretending to be from Medicare or health insurance companies. They try to steal your Medicare number, which can be used to file false claims and steal your identity. They may offer free medical equipment, genetic testing, or new Medicare cards to trick you.",
      keyPoints: [
        "Your Medicare number is as valuable as your Social Security number. It can be used to file fraudulent claims, steal your identity, and bill for services you never received.",
        "Medicare will never call you to sell anything, ask for payment over the phone, or threaten to cancel your benefits.",
        "Scammers often call during open enrollment periods (October through December) pretending to help you choose a plan.",
        "Free genetic testing kits and free medical equipment offers are common lures. Legitimate providers bill Medicare after your doctor orders the service, not through cold calls.",
        "Medicare fraud costs taxpayers an estimated $60 billion annually. Reporting suspicious activity helps protect everyone."
      ],
      platformGuides: [
        {
          platform: "Phone Call About Medicare",
          steps: [
            "If someone calls claiming to be from Medicare, do not give them any personal information. Say: 'I will call Medicare back directly' and hang up.",
            "Real Medicare calls are rare. Medicare may call if you are already enrolled in a Medicare plan and have called them first, but they will never call you out of the blue to sell something.",
            "Check the caller ID, but do not trust it. Scammers can fake caller ID to show 'Medicare' or '1-800-MEDICARE'. The real Medicare number is 1-800-633-4227.",
            "If the caller says your Medicare number has been compromised or your benefits are being cancelled, this is a scare tactic. Hang up and call 1-800-MEDICARE yourself to verify.",
            "Never confirm your Medicare Beneficiary Identifier (MBI) number to a caller. If someone already has it and is asking you to confirm, they may be trying to trick you into validating stolen information.",
            "If a caller asks for payment for a new Medicare card, it is a scam. Medicare cards are free and are sent automatically. You will never be charged for a replacement.",
            "Write down the phone number, the caller's name (even if fake), and what they said. Report the call to 1-800-MEDICARE."
          ]
        },
        {
          platform: "Offer for Free Equipment or Testing",
          steps: [
            "If you receive a call offering free medical equipment (back braces, knee braces, wheelchairs), free genetic testing, or free COVID tests, be very cautious.",
            "Ask yourself: did my doctor order this? Legitimate medical equipment and tests are ordered by your doctor, not offered through phone calls or booths at health fairs.",
            "Do not give your Medicare number to anyone offering free equipment or testing at health fairs, community events, or door-to-door. These are common scam locations.",
            "If someone says 'Medicare is paying for this, it is completely free,' ask for the provider's name, address, and phone number. Then call your doctor to verify the order.",
            "Check your Medicare Summary Notice (MSN) or Medicare.gov account for any claims filed. If you see services you did not receive, it means someone used your Medicare number fraudulently.",
            "Report suspected fraud to the HHS Office of Inspector General at 1-800-HHS-TIPS (1-800-447-8477).",
            "Tell the person 'I need to check with my doctor first' and end the conversation. A legitimate provider will understand this."
          ]
        },
        {
          platform: "If You Shared Your Medicare Number",
          steps: [
            "Call 1-800-MEDICARE (1-800-633-4227) immediately. Tell them you believe your Medicare number has been compromised. They can flag your account for monitoring.",
            "Request a new Medicare Beneficiary Identifier (MBI) number. Medicare can issue a new card with a new number if yours has been compromised.",
            "Create a MyMedicare.gov account if you do not already have one. Log in regularly to review your claims. Look for doctors you did not visit, equipment you did not receive, or services you never had.",
            "Place a fraud alert on your credit reports. Contact one of the three credit bureaus (Equifax: 1-800-525-6285, Experian: 1-888-397-3742, TransUnion: 1-800-680-7289). They are required to notify the other two.",
            "Consider placing a credit freeze with all three credit bureaus. This prevents anyone from opening new accounts in your name.",
            "Report the incident to the FTC at identitytheft.gov. This creates a recovery plan and generates reports you may need.",
            "Monitor your Explanation of Benefits (EOB) statements carefully for the next 12 months. Report any unfamiliar charges to Medicare immediately.",
            "File a report with your local State Health Insurance Assistance Program (SHIP). Call 1-877-839-2675 to find your local SHIP office."
          ]
        },
        {
          platform: "Protecting Your Information",
          steps: [
            "Treat your Medicare card like a credit card. Do not carry it in your wallet unless you are going to a medical appointment.",
            "Store your Medicare card in a safe place at home, such as a locked drawer or a fireproof safe.",
            "Only give your Medicare number to doctors, hospitals, pharmacies, and health insurers you know and trust.",
            "Shred all documents that contain your Medicare number before throwing them away. This includes old Medicare Summary Notices, Explanation of Benefits, and correspondence from Medicare.",
            "Do not post photos of your Medicare card on social media or send it via email or text message.",
            "Review your Medicare Summary Notice every time you receive one. Check that every service listed was actually provided to you.",
            "If you receive calls during Medicare open enrollment (October 15 to December 7), be extra cautious. Call 1-800-MEDICARE or visit medicare.gov to compare plans yourself."
          ]
        }
      ],
      quickChecklist: [
        "My Medicare card is stored in a safe place, not in my wallet.",
        "I never give my Medicare number to unsolicited callers.",
        "I review my Medicare Summary Notices for unfamiliar charges.",
        "I know the real Medicare number is 1-800-633-4227.",
        "I have a MyMedicare.gov account to check my claims online.",
        "I shred documents containing my Medicare number before discarding."
      ],
      familyTalkingPoints: [
        "Have you received any calls about Medicare recently? Let me know and I can help you figure out if they are real.",
        "Let me help you set up your MyMedicare.gov account so you can check your claims anytime.",
        "Remember, you should never give your Medicare number to someone who calls you. If you are unsure, call me first.",
        "Would you like me to help you review your Medicare Summary Notice for anything that looks wrong?"
      ],
      warningSign: "If someone calls offering free medical equipment, genetic testing, or a new Medicare card, and asks for your Medicare number, it is a scam. Medicare never calls to sell or ask for your number."
    }
  },
  {
    id: "phone-email-scams",
    title: "Phone and Email Scams",
    description: "Spot phishing emails and suspicious phone calls.",
    icon: Mail,
    color: "bg-cyan-500",
    image: imgSrc(cardPhoneEmailScams),
    content: {
      intro: "Phishing emails and scam phone calls are the most common ways criminals target seniors. These messages are designed to look or sound like they come from banks, shipping companies, government agencies, or other trusted organizations. Their goal is to trick you into clicking a link, sharing personal information, or sending money.",
      keyPoints: [
        "Phishing emails are responsible for over 90% of all data breaches. Learning to spot them is one of the most important things you can do online.",
        "Scammers can make emails look almost identical to real ones from companies you trust. Always check the sender's actual email address, not just the display name.",
        "Phone scammers can fake caller ID to show any name or number. Seeing 'Bank of America' or 'Medicare' on your caller ID does not mean the call is real.",
        "Urgency is the most common manipulation tactic. If a message says you must act immediately, it is very likely a scam.",
        "When in doubt, do not click any links. Instead, go directly to the company's website by typing the address into your browser."
      ],
      platformGuides: [
        {
          platform: "Checking Suspicious Emails",
          steps: [
            "Look at the sender's full email address, not just the name. Click or hover over the sender's name to reveal the actual address. If it says 'Amazon' but the address is something@amaz0n-alerts.com, it is fake.",
            "Check for poor grammar, spelling errors, and unusual formatting. While scam emails are getting better, many still have obvious mistakes that legitimate companies would not make.",
            "Hover over any links WITHOUT clicking them. At the bottom of your browser or in a tooltip, you will see the actual website address. If it does not match the company's real website, do not click.",
            "Be suspicious of any email that asks you to verify your identity, confirm your password, or update payment information through a link.",
            "Look at how the email addresses you. Generic greetings like 'Dear Customer' or 'Dear Account Holder' are suspicious. Companies you have accounts with usually address you by name.",
            "Check if you were expecting this email. Unexpected emails about packages, purchases, or account problems you are not aware of are likely scams.",
            "If you are unsure about an email, do not click any links. Instead, open a new browser window and go directly to the company's website to check your account."
          ]
        },
        {
          platform: "Handling Phone Calls",
          steps: [
            "Let unknown calls go to voicemail. Legitimate callers will leave a message. Scammers often do not.",
            "If you answer and the caller creates urgency ('Your account will be closed!', 'You must pay now!'), hang up. Urgency is the top manipulation tactic.",
            "Never give personal information to someone who called you. If they say they are from your bank, hang up and call your bank directly using the number on your card.",
            "Be cautious of robocalls (recorded messages). If a recording asks you to press a button, hang up. Pressing a button may connect you to a scammer or confirm your number is active.",
            "If a caller asks you to install software, visit a website, or go to your computer, it is a scam. Hang up immediately.",
            "Write down the caller's claims. Call the real company directly to verify. This one step prevents most phone scams.",
            "Do not feel obligated to stay on the line. You can always hang up, and you should if something feels wrong."
          ]
        },
        {
          platform: "Common Email Scams to Know",
          steps: [
            "Package delivery scams: 'Your UPS/FedEx package could not be delivered. Click here to reschedule.' Go to the shipping company's real website instead.",
            "Bank alerts: 'Suspicious activity detected on your account. Verify your identity.' Call your bank directly using the number on your card or statement.",
            "Subscription renewal: 'Your Norton/McAfee subscription is renewing for $399. Call to cancel.' This is a fake charge designed to get you to call a scam number.",
            "Prize winnings: 'You have won!' You cannot win a contest you did not enter. Delete immediately.",
            "Friend in trouble: An email from a friend saying they are stranded and need money. Their email may have been hacked. Call them on the phone to verify.",
            "Tax refund: 'The IRS has calculated your refund.' The IRS does not communicate via email. Delete immediately.",
            "Password reset: 'Someone tried to access your account. Reset your password here.' Go to the website directly instead of clicking the link."
          ]
        },
        {
          platform: "Setting Up Email Protection",
          steps: [
            "Most email providers have built-in spam filters. Make sure yours is enabled. In Gmail: go to Settings and ensure 'Filtered mail' is not delivering spam to your inbox.",
            "Mark scam emails as spam or phishing. This trains your email provider's filters. In Gmail: click the three dots, then 'Report phishing'. In Outlook: right-click, then 'Report as phishing'.",
            "Never unsubscribe from emails you did not sign up for. The 'unsubscribe' link in a scam email may be a phishing link. Just mark it as spam.",
            "Enable two-factor authentication on your email account. This is the single most effective protection against email account theft.",
            "Keep your email password unique. Do not use the same password for your email and any other account.",
            "Regularly check your email's 'Sent' folder. If you see emails you did not send, your account may be compromised.",
            "Consider creating a separate email for online shopping and subscriptions. This protects your main email from data breaches."
          ]
        }
      ],
      quickChecklist: [
        "I always check the sender's actual email address before responding.",
        "I never click links in emails that create urgency or ask for personal information.",
        "I let unknown phone calls go to voicemail.",
        "My email has two-factor authentication enabled.",
        "I know that caller ID can be faked.",
        "I verify claims by contacting companies directly through their official website or phone number."
      ],
      familyTalkingPoints: [
        "Have you been getting any suspicious emails or phone calls? I can help you figure out which ones are real.",
        "If you ever get an email that worries you about your bank account, forward it to me before clicking anything.",
        "Would you like me to help set up better spam filtering on your email?",
        "Remember, you can always hang up on a phone call. It is never rude to protect yourself."
      ],
      warningSign: "If an email or phone call creates a sense of urgency, claims something terrible will happen unless you act immediately, or asks for personal information or payment, it is almost certainly a scam. Stop, take a breath, and verify independently."
    }
  },
  {
    id: "identity-theft",
    title: "Identity Theft Protection",
    description: "Safeguard your personal information and credit.",
    icon: Lock,
    color: "bg-purple-500",
    image: imgSrc(cardIdentityTheft),
    content: {
      intro: "Identity theft occurs when someone uses your personal information without your permission to commit fraud or other crimes. For seniors, identity theft can be devastating, leading to drained bank accounts, unauthorized credit cards, fraudulent tax returns, and even medical identity theft where someone uses your health insurance.",
      keyPoints: [
        "Identity theft affected 1.4 million adults over 60 in 2023, with total losses exceeding $1.6 billion.",
        "The most commonly stolen information: Social Security numbers, credit card numbers, bank account numbers, Medicare numbers, and dates of birth.",
        "Data breaches at companies you have accounts with can expose your information even if you do everything right. Monitoring your credit is essential.",
        "Medical identity theft is growing: someone uses your insurance to get medical care. This can affect your medical records and future coverage.",
        "Identity thieves may file tax returns in your name to steal your refund. Filing early each year helps prevent this."
      ],
      platformGuides: [
        {
          platform: "Protecting Your Information",
          steps: [
            "Guard your Social Security number. Never carry your Social Security card in your wallet. Only give your SSN when absolutely necessary (for tax purposes, employment, or opening a bank account).",
            "Shred all documents containing personal information before throwing them away. This includes bank statements, credit card offers, medical bills, and any mail with your account numbers.",
            "Do not share personal information on social media. Your birthday, mother's maiden name, pet's name, and high school are common security question answers that thieves can use.",
            "Be cautious with mail. If you are going on vacation, have the post office hold your mail. Consider a locking mailbox to prevent mail theft.",
            "Review your credit report for free at annualcreditreport.com at least once a year. Look for accounts you did not open or addresses you have never lived at.",
            "Consider placing a credit freeze with all three credit bureaus. This is free and prevents anyone from opening new credit accounts in your name.",
            "Opt out of pre-approved credit card offers by calling 1-888-567-8688 or visiting optoutprescreen.com. This reduces the chance of these offers being stolen from your mailbox."
          ]
        },
        {
          platform: "Monitoring for Theft",
          steps: [
            "Check your bank and credit card statements every month. Look for any charges you do not recognize, no matter how small. Thieves often test with small charges first.",
            "Set up account alerts with your bank. Most banks can send you text or email alerts for every transaction over a certain amount (even $1).",
            "Review your credit report from each bureau. Go to annualcreditreport.com to get your free reports.",
            "Check your Social Security statement at ssa.gov/myaccount. Make sure your reported earnings are correct. Incorrect earnings could mean someone is using your SSN for employment.",
            "Monitor your Medicare statements. Look for services, equipment, or visits you do not recognize.",
            "Watch for unexpected medical bills or explanation of benefits from your health insurance for treatments you did not receive.",
            "If you get a notice from the IRS about a tax return you did not file, or if your e-filed return is rejected as a duplicate, someone may have filed using your SSN."
          ]
        },
        {
          platform: "If Your Identity Is Stolen",
          steps: [
            "Go to identitytheft.gov immediately. This is the FTC's official recovery website. It will create a personalized recovery plan based on what happened.",
            "Place a fraud alert on your credit reports by contacting any one of the three credit bureaus. They must notify the other two.",
            "Consider a credit freeze with all three bureaus: Equifax (1-800-525-6285), Experian (1-888-397-3742), TransUnion (1-800-680-7289).",
            "Close any accounts that were opened fraudulently. Contact the fraud department of each company where accounts were misused.",
            "File a report with your local police department. Get a copy of the report. You may need it when disputing fraudulent charges.",
            "If your Social Security number was stolen, contact the Social Security Administration at 1-800-772-1213.",
            "If your Medicare number was used, call 1-800-MEDICARE and report it to the HHS Inspector General at 1-800-447-8477.",
            "Keep detailed records of all your communications: who you called, what they said, and reference numbers for every report."
          ]
        },
        {
          platform: "Preventing Medical Identity Theft",
          steps: [
            "Review every Explanation of Benefits (EOB) statement from your health insurer carefully. Look for doctors, procedures, or dates that do not match your actual care.",
            "Request a copy of your medical records from your doctors periodically. Check for treatments or conditions that are not yours.",
            "Protect your health insurance card the same way you protect credit cards. Do not share your member ID number with anyone who calls you.",
            "Be cautious at health fairs and community events where people offer free screenings in exchange for your insurance information.",
            "If you receive bills for medical services you did not receive, contact the provider immediately. Do not pay them. Report to your insurance company.",
            "Keep a personal health journal noting all doctor visits and treatments. This makes it easy to spot discrepancies on statements.",
            "If you suspect medical identity theft, request a statement of all claims filed under your insurance from your provider."
          ]
        }
      ],
      quickChecklist: [
        "My Social Security card is stored safely at home, not in my wallet.",
        "I shred documents with personal information before discarding.",
        "I review my credit report at least once a year.",
        "My bank accounts have transaction alerts enabled.",
        "I have considered or placed a credit freeze.",
        "I check my Medicare and health insurance statements for unfamiliar charges."
      ],
      familyTalkingPoints: [
        "Have you checked your credit report recently? I can help you access it for free at annualcreditreport.com.",
        "Would you like help setting up a credit freeze? It is free and prevents anyone from opening accounts in your name.",
        "Let me help you set up transaction alerts on your bank account. You will get a text every time money moves.",
        "If you ever get mail about accounts you did not open, please let me know right away."
      ],
      warningSign: "If you receive bills for things you did not buy, notice accounts you did not open on your credit report, or get rejected for a credit application you did not make, your identity may have been stolen. Act immediately."
    }
  },
  {
    id: "online-shopping-safety",
    title: "Online Shopping and Banking Safety",
    description: "Shop and bank online securely with confidence.",
    icon: CreditCard,
    color: "bg-teal-500",
    image: imgSrc(cardOnlineShopping),
    content: {
      intro: "Online shopping and banking can be safe and convenient when you know how to protect yourself. The key is knowing what to look for before entering your personal and financial information online. Most online shopping fraud is preventable with a few simple habits.",
      keyPoints: [
        "Online shopping fraud resulted in over $5.8 billion in losses in 2023. Adults over 60 are particularly targeted with fake online stores.",
        "Always look for 'https' and a padlock icon in your browser's address bar before entering any payment information.",
        "Use credit cards instead of debit cards for online purchases. Credit cards offer stronger fraud protections and are easier to dispute.",
        "Fake online stores often appear in social media ads offering incredible deals. If the price seems too good to be true, it probably is.",
        "Public Wi-Fi (at coffee shops, airports, libraries) is not secure for shopping or banking. Use your home Wi-Fi or phone's cellular data instead."
      ],
      platformGuides: [
        {
          platform: "Creating Strong Passwords",
          steps: [
            "Use a different password for every account. This is the single most important password rule. If one account is breached, your other accounts stay safe.",
            "Make passwords at least 12 characters long. Use a mix of uppercase letters, lowercase letters, numbers, and symbols.",
            "Consider using a passphrase: a string of random words. For example, 'BlueHorse!Rain42Sunshine' is strong and easier to remember than 'Bh!r42S'.",
            "Never use personal information in passwords: no birthdays, pet names, addresses, or family names. These are easy for thieves to guess.",
            "Consider a password manager like 1Password, Dashlane, or the free one built into your browser (Chrome or Safari). It creates and remembers strong passwords for you.",
            "Enable two-factor authentication (2FA) wherever available. This adds a second step (usually a text message code) when logging in.",
            "Never share your passwords with anyone who contacts you. Your bank, email provider, and other services will never ask for your password."
          ]
        },
        {
          platform: "Securing Your Email",
          steps: [
            "Enable two-factor authentication (2FA) on your email. For Gmail: go to myaccount.google.com, click Security, then '2-Step Verification', and follow the prompts. For Yahoo: go to login.yahoo.com, click Account Security, then enable 'Two-step verification'.",
            "For Outlook/Hotmail: go to account.microsoft.com, click Security, then 'More security options', then 'Set up two-step verification'.",
            "Choose your 2FA method. The most common options: text message (a code is sent to your phone) or an authenticator app (like Google Authenticator). Text messages are easier; apps are more secure.",
            "Check your email's recovery options. Make sure your recovery phone number and backup email are up to date. If you lose access, these are how you get back in.",
            "Review your email settings for 'forwarding rules'. Scammers sometimes set up forwarding to secretly receive copies of all your email. In Gmail: click the gear icon, then 'See all settings', then 'Forwarding and POP/IMAP'. Make sure no unknown forwarding addresses are listed.",
            "Check the 'Sent' and 'Trash' folders periodically. If you see emails you did not send, your account may be compromised. Change your password immediately.",
            "Be cautious about emails asking you to verify your account or confirm your password. Your email provider will never ask for your password via email."
          ]
        },
        {
          platform: "Safe Online Shopping",
          steps: [
            "Only shop on websites you know and trust. If you find a deal on an unfamiliar website, search for reviews first. Type the website name plus 'scam' or 'reviews' into Google.",
            "Look for 'https' and a padlock icon in the address bar before entering any payment information. If you see 'http' without the 's', do not enter your credit card.",
            "Use a credit card instead of a debit card for online purchases. Credit cards have stronger fraud protections, and unauthorized charges are easier to dispute.",
            "Never shop using public Wi-Fi (at coffee shops, airports, etc.). If you must, use your phone's cellular data instead.",
            "Be cautious of deals that seem too good to be true. A brand-name product at 80% off is usually a scam or a counterfeit.",
            "Check your credit card and bank statements after online purchases. Look for any charges you do not recognize.",
            "Save confirmation emails and order numbers. If there is a problem with your order, you will need these for disputes.",
            "Consider using a virtual credit card number for online purchases. Many banks offer this feature, which creates a temporary card number for each transaction."
          ]
        },
        {
          platform: "Securing Your Phone",
          steps: [
            "Set up a lock screen. On iPhone: go to Settings, then Face ID & Passcode (or Touch ID & Passcode), and set a 6-digit passcode. On Android: go to Settings, then Security, then Screen Lock, and choose PIN or Fingerprint.",
            "Keep your phone's operating system updated. On iPhone: go to Settings, then General, then Software Update. On Android: go to Settings, then System, then System Update. Install updates as soon as they are available.",
            "Review app permissions. On iPhone: go to Settings and scroll down to see each app's permissions. On Android: go to Settings, then Apps, tap an app, then Permissions. Remove permissions that do not make sense (like a flashlight app asking for your contacts).",
            "Only download apps from the official App Store (iPhone) or Google Play Store (Android). Never download apps from links sent in text messages or emails.",
            "Turn off Bluetooth when you are not using it. Bluetooth can be used to connect to your phone without your knowledge in public places.",
            "Enable 'Find My' to locate, lock, or erase your phone if it is lost or stolen. On iPhone: Settings, then your name, then Find My, then Find My iPhone. On Android: Settings, then Security, then Find My Device.",
            "Back up your phone regularly. On iPhone: Settings, then your name, then iCloud, then iCloud Backup. On Android: Settings, then System, then Backup."
          ]
        }
      ],
      quickChecklist: [
        "I use strong, unique passwords for my important accounts.",
        "Two-factor authentication is enabled on my email and banking.",
        "My phone and computer are set to install updates automatically.",
        "I know to look for 'https' before entering personal information online.",
        "I use a credit card (not debit) for online shopping.",
        "My phone has a lock screen enabled."
      ],
      familyTalkingPoints: [
        "Would you like help setting up a password manager? It makes keeping track of passwords much easier.",
        "Let me help you turn on two-factor authentication on your email. It only takes a few minutes.",
        "Are your phone and computer set to update automatically? Let me check that for you.",
        "If you ever want to buy something online and are not sure if the website is safe, send me the link and I will check it for you."
      ]
    }
  },
  {
    id: "government-impersonation",
    title: "Government Impersonation Scams",
    description: "Scammers posing as IRS, Social Security, or law enforcement.",
    icon: UserX,
    color: "bg-indigo-500",
    image: imgSrc(cardGovernmentScams),
    content: {
      intro: "Government impersonation scams are among the fastest-growing threats targeting older adults. According to the FTC, consumers reported losing over $500 million to these scams in recent years. Criminals pose as IRS agents, Social Security Administration employees, Medicare officials, or even local police to intimidate victims into sending money or sharing personal information.",
      keyPoints: [
        "No government agency will ever call you demanding immediate payment or threatening arrest. The IRS always initiates contact through postal mail.",
        "The Social Security Administration will never call threatening to suspend your Social Security number or benefits.",
        "Government agencies never demand payment via gift cards, wire transfers, or cryptocurrency.",
        "Scammers can fake caller ID to show government agency names and phone numbers. Seeing 'IRS' or 'SSA' on your caller ID does not mean the call is real.",
        "These scams rely on fear. If a caller makes you feel scared, panicked, or rushed, that is by design. Legitimate government communication is never threatening."
      ],
      platformGuides: [
        {
          platform: "Call from 'IRS' or 'Social Security'",
          steps: [
            "Hang up immediately. You do not need to explain yourself or ask permission to end the call.",
            "Remember these facts: The IRS always initiates contact through postal mail, never by phone, email, or text. The Social Security Administration may occasionally call but will never threaten you, demand immediate payment, or ask for gift cards.",
            "Do not call back any number the caller gave you. Scammers set up fake call centers that answer as 'IRS' or 'Social Security'.",
            "If you are concerned the call might be real, call the actual agency yourself. IRS: 1-800-829-1040. Social Security Administration: 1-800-772-1213. Use only these numbers.",
            "If the caller said you owe taxes, check your IRS account at irs.gov/account or call 1-800-829-1040 to verify.",
            "If the caller said your Social Security number has been 'suspended' or 'compromised', know that this is impossible. Social Security numbers cannot be suspended.",
            "Report the call to the Treasury Inspector General for Tax Administration (TIGTA) at treasury.gov/tigta or call 1-800-366-4484."
          ]
        },
        {
          platform: "Email from Government Agency",
          steps: [
            "Check the sender's email address. Government emails end in .gov (such as @irs.gov or @ssa.gov). If the email comes from a Gmail, Yahoo, or other commercial address, it is fake.",
            "Do NOT click any links in the email. Government agencies rarely send emails with links. If they do, the links go to .gov websites.",
            "Do NOT open attachments. Government agencies rarely send unsolicited attachments by email.",
            "Go directly to the agency's official website by typing the address in your browser. For the IRS: irs.gov. For Social Security: ssa.gov. For Medicare: medicare.gov. Check your account there for any real notices.",
            "Look for red flags: poor grammar, generic greetings ('Dear Taxpayer' instead of your name), threats of legal action, and requests for personal information.",
            "Forward fake IRS emails to phishing@irs.gov. Forward fake Social Security emails to oig.ssa.gov/report.",
            "Delete the email after reporting it."
          ]
        },
        {
          platform: "If You Already Paid or Shared Info",
          steps: [
            "Contact your bank or credit card company immediately. Tell them you were scammed by someone impersonating a government agency. They may be able to reverse charges.",
            "If you paid with gift cards, contact the gift card company immediately with the card numbers and receipts. Companies: iTunes/Apple: 1-800-275-2273, Google Play: support.google.com, Amazon: 1-888-280-4331.",
            "If you shared your Social Security number, go to identitytheft.gov and follow the steps to protect your identity. Consider placing a credit freeze with all three credit bureaus.",
            "Place a fraud alert on your credit reports. Contact Equifax (1-800-525-6285), Experian (1-888-397-3742), or TransUnion (1-800-680-7289). You only need to contact one; they notify the other two.",
            "If you shared bank account information, contact your bank to close the compromised account and open a new one.",
            "File a report with your local police department. Get a copy of the police report for your records.",
            "Report to the FTC at reportfraud.ftc.gov and to the FBI Internet Crime Complaint Center at ic3.gov.",
            "Monitor your credit reports for at least 12 months at annualcreditreport.com for any unauthorized accounts or activity."
          ]
        },
        {
          platform: "How to Verify Real Government Contact",
          steps: [
            "The IRS always sends official notices and bills through the U.S. Postal Service. If you receive a letter, it will include a notice number and reference number you can verify by calling 1-800-829-1040.",
            "The Social Security Administration may call you if you have an existing case or have requested a callback. They will never ask for immediate payment or personal information over the phone.",
            "If a government agency needs to contact you, they will usually provide a case number and give you time to respond. There is never a 'deadline of today'.",
            "To check the status of your Social Security account, create an account at ssa.gov/myaccount. This is the official and secure way to view your benefits and statements.",
            "To check for IRS issues, create an account at irs.gov/account. You can see your tax records, payments, and any notices.",
            "If you receive a legitimate government letter and are unsure, take it to your local IRS office, Social Security office, or Area Agency on Aging for help. You can find office locations on each agency's .gov website.",
            "Government agencies will always give you time to respond. Any 'respond immediately or face arrest' message is a scam without exception."
          ]
        }
      ],
      quickChecklist: [
        "I know that the IRS only initiates contact through postal mail.",
        "I know that Social Security numbers cannot be 'suspended'.",
        "I never pay anyone who calls claiming to be from the government.",
        "I verify government contact by calling the agency directly on their official number.",
        "I have my IRS and Social Security online accounts set up for self-verification.",
        "I know that gift card payments to the government are always a scam."
      ],
      familyTalkingPoints: [
        "If you ever get a call from someone claiming to be from the IRS or Social Security, hang up and call me. I can help you verify if it is real.",
        "Remember, no government agency will ever ask you to pay with gift cards or threaten you with arrest over the phone.",
        "Would you like help setting up your IRS and Social Security online accounts so you can check your status yourself?",
        "Let me know if you get any official-looking letters in the mail. I can help you verify if they are legitimate."
      ],
      warningSign: "No government agency will ever demand payment over the phone, threaten you with arrest, or ask for gift cards. If someone claims to be from the government and is pressuring you, hang up. It is a scam."
    }
  },
  {
    id: "investment-cryptocurrency",
    title: "Investment and Cryptocurrency Fraud",
    description: "Protect your retirement savings from fake investment schemes.",
    icon: Wallet,
    color: "bg-orange-500",
    image: imgSrc(cardInvestmentFraud),
    content: {
      intro: "Investment fraud targeting seniors has surged, with cryptocurrency scams alone costing victims over $3.4 billion in 2023 according to the FBI IC3 report. Scammers approach through social media, dating apps, unsolicited emails, or even through people you know who have been deceived themselves. They promise guaranteed returns with little or no risk.",
      keyPoints: [
        "Cryptocurrency scams targeting adults over 60 increased by 78% from 2022 to 2023.",
        "The most common cryptocurrency scam is 'pig butchering' where scammers build a relationship over weeks before introducing a fake investment platform.",
        "Fake investment platforms show artificial gains to convince victims to invest more. The money is gone the moment you send it.",
        "Anyone who asks you to buy cryptocurrency and send it to a specific wallet address is running a scam.",
        "Legitimate investments are registered with the SEC or state regulators. If an investment is not registered, it is likely fraudulent."
      ],
      platformGuides: [
        {
          platform: "Social Media Investment Pitch",
          steps: [
            "Be extremely skeptical of investment advice from people you know only through social media, even if they appear wealthy and successful. Scammers create fake identities with luxury photos.",
            "Never invest based on a social media ad, post, or direct message. Platforms like Facebook, Instagram, and YouTube are filled with fraudulent investment promotions.",
            "If someone you met online (through dating apps, social media, or messaging apps) starts talking about investing, consider it a red flag. The 'pig butchering' scam always starts with building a personal relationship.",
            "Check any investment opportunity against the SEC's EDGAR database at sec.gov/edgar. Legitimate investments are registered.",
            "Search for the investment or company name plus the word 'scam' on Google. Many fraud schemes have already been reported by other victims.",
            "Be cautious of testimonials and screenshots showing huge profits. These are easily faked. Real investment results are never guaranteed.",
            "Report suspicious investment promotions on social media. On Facebook: click the three dots on the post, then 'Report post', then 'Scam or fraud'. On Instagram: tap the three dots, then 'Report', then 'Fraud or scam'."
          ]
        },
        {
          platform: "Someone Asking You to Buy Cryptocurrency",
          steps: [
            "Understand why scammers prefer cryptocurrency: once sent, cryptocurrency transfers cannot be reversed or traced by your bank. This is why scammers ask for it.",
            "No legitimate business, government agency, or investment requires you to buy cryptocurrency at a Bitcoin ATM or through a specific website and send it to a wallet address.",
            "If someone is walking you through the process of buying cryptocurrency step by step, especially at a Bitcoin ATM, stop. This is a scam in progress.",
            "Common lies scammers use: 'This is the only way to protect your money', 'You need to pay in Bitcoin to avoid arrest', 'Transfer your savings to cryptocurrency for safekeeping'.",
            "If you do not fully understand cryptocurrency and blockchain technology, do not invest in it based on someone else's recommendation. This is not a technology you need to use.",
            "If a friend or family member suggests a cryptocurrency investment, they may have been deceived too. Verify the investment independently before acting.",
            "Report cryptocurrency scams to the FTC at reportfraud.ftc.gov and to the FBI IC3 at ic3.gov."
          ]
        },
        {
          platform: "Online Trading Platform",
          steps: [
            "Before investing money on any online trading platform, verify it is registered with the SEC. Go to sec.gov and search for the platform name.",
            "Check FINRA BrokerCheck at brokercheck.finra.org. Legitimate brokers and firms are registered. If the platform is not registered, do not use it.",
            "Be suspicious of platforms that claim 'guaranteed daily returns' of 1%, 5%, or higher. These returns are not realistic and are a hallmark of fraud.",
            "If a platform makes it easy to deposit money but creates delays or excuses when you try to withdraw, it is almost certainly a scam.",
            "Read independent reviews of the platform. Search for the platform name plus 'withdrawal problems' or 'scam' on Google.",
            "Never invest more than you can afford to lose. Start with a very small amount if you want to test a platform. Scammers often allow small withdrawals to build trust before stealing larger deposits.",
            "Verify any investment returns independently. Do not rely on numbers shown within the platform itself, as these can be fabricated."
          ]
        },
        {
          platform: "If You Already Invested",
          steps: [
            "Stop sending money immediately, even if the platform shows that your investments are growing. The displayed gains are fake.",
            "If someone tells you that you need to pay 'taxes' or 'fees' before you can withdraw your profits, this is another scam. Legitimate platforms deduct fees automatically; they never ask for additional payments to release your money.",
            "Document everything. Take screenshots of all communications, the platform's website, your transaction history, and any account statements.",
            "Report to the SEC at sec.gov/tcr. Include the platform name, URL, and details about your investment.",
            "Report to the FBI Internet Crime Complaint Center at ic3.gov. The FBI has a dedicated cryptocurrency fraud team.",
            "Contact your bank or financial institution. If you sent money via wire transfer, they may be able to attempt a recall.",
            "If you bought cryptocurrency through an exchange like Coinbase, contact their support team to report the fraud.",
            "Contact your state attorney general and your state securities regulator. Find your state regulator at nasaa.org."
          ]
        }
      ],
      quickChecklist: [
        "I never invest based on advice from someone I have only met online.",
        "I verify investment platforms through SEC.gov and FINRA BrokerCheck.",
        "I know that guaranteed returns with no risk are always fraud.",
        "I never buy cryptocurrency to send to someone else's wallet.",
        "I consult a licensed financial advisor before making large investments.",
        "I know how to report investment fraud to the SEC and FBI IC3."
      ],
      familyTalkingPoints: [
        "Has anyone online been talking to you about investing or cryptocurrency? I would like to help you research it before you decide.",
        "Remember, if someone guarantees profits with no risk, it is always a scam. No legitimate investment works that way.",
        "If anyone asks you to buy cryptocurrency at a Bitcoin ATM, please call me first. That is a common scam tactic.",
        "Would you like me to help you verify any investment opportunity? I can check the SEC and FINRA databases with you."
      ],
      warningSign: "If someone you met online introduces you to an investment platform showing incredible returns and asks you to invest more, it is almost certainly a 'pig butchering' scam. The profits you see on the screen are fake. Stop sending money immediately."
    }
  }
];

function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-emerald-300/15 dark:bg-emerald-500/10" />
      <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-blue-300/15 dark:bg-blue-500/10" />
      <div className="absolute bottom-32 left-1/4 w-12 h-12 rounded-full bg-amber-300/15 dark:bg-amber-500/10" />
      <div className="absolute bottom-20 right-1/3 w-20 h-20 rounded-full bg-teal-300/15 dark:bg-teal-500/10" />
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
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <span className="text-foreground leading-relaxed text-[0.95rem]">{step}</span>
          </li>
        ))}
      </ol>
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-4 ml-9"
          data-testid={`button-toggle-steps-${platform.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
        >
          {isExpanded ? (
            <>Show less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Show all {steps.length} steps <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  );
}

function SeniorsLanding({ onSelectTopic, onSwitchTab }: { onSelectTopic: (id: string) => void; onSwitchTab: (tab: string) => void }) {
  return (
    <>
      <PageBanner
        title="Stay Safe and Connected Online"
        subtitle="Practical guidance to protect yourself from scams and fraud. Learn to recognize warning signs and take simple steps to stay secure."
        imageSrc={imgSrc(bannerImage)}
        imageAlt="Seniors using technology safely"
        colorVariant="teal"
      />

      <section className="py-8 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">The Scale of the Problem</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary" data-testid="text-stat-losses">$4.8B+</p>
              <p className="text-sm text-muted-foreground mt-1">Lost by adults 60+ in 2024</p>
              <p className="text-xs text-muted-foreground">(FBI IC3 Report)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary" data-testid="text-stat-total">$61B</p>
              <p className="text-sm text-muted-foreground mt-1">Estimated total losses including unreported</p>
              <p className="text-xs text-muted-foreground">(AARP 2025 Survey)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary" data-testid="text-stat-targeted">1 in 3</p>
              <p className="text-sm text-muted-foreground mt-1">Seniors targeted by fraud annually</p>
              <p className="text-xs text-muted-foreground">(FTC Consumer Sentinel)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary" data-testid="text-stat-unreported">70%</p>
              <p className="text-sm text-muted-foreground mt-1">Of fraud against seniors goes unreported</p>
              <p className="text-xs text-muted-foreground">(DOJ Elder Justice Initiative)</p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="relative py-12">
        <FloatingShapes />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6 mb-12">
            {seniorSafetyTopics.map((topic) => (
              <Card 
                key={topic.id}
                className="cursor-pointer transition-shadow hover:shadow-xl border-2 border-white/50 dark:border-white/10 bg-white/80 dark:bg-card/80 backdrop-blur-sm"
                onClick={() => onSelectTopic(topic.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelectTopic(topic.id))}
                tabIndex={0}
                role="button"
                aria-label={`Learn about ${topic.title}`}
                data-testid={`card-topic-${topic.id}`}
              >
                {topic.image && (
                  <div className="relative h-48 sm:h-56 w-full">
                    <img
                      src={topic.image}
                      alt={topic.title}
                      className="w-full h-full object-cover rounded-t-md"
                      loading="lazy"
                      data-testid={`img-topic-${topic.id}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-t-md" />
                    <div className={`absolute bottom-3 left-3 w-10 h-10 rounded-lg ${topic.color} flex items-center justify-center shadow-lg`}>
                      <topic.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
                <CardContent className={topic.image ? "p-4" : "p-6"}>
                  {!topic.image && (
                    <div className={`w-14 h-14 rounded-xl ${topic.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <topic.icon className="w-7 h-7 text-white" />
                    </div>
                  )}
                  <h3 className="font-semibold text-lg text-foreground mb-2">{topic.title}</h3>
                  <p className="text-muted-foreground text-sm">{topic.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-3">
                    View full guide <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/30"
              onClick={() => onSwitchTab("exercises")}
              data-testid="card-cta-exercises"
            >
              <CardContent className="p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Is This a Scam?</h3>
                <p className="text-sm text-muted-foreground">Practice identifying real scams with interactive exercises</p>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/30"
              onClick={() => onSwitchTab("emergency")}
              data-testid="card-cta-emergency"
            >
              <CardContent className="p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">I Think I Was Scammed</h3>
                <p className="text-sm text-muted-foreground">Get step-by-step help based on what happened</p>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/30"
              onClick={() => onSwitchTab("checklists")}
              data-testid="card-cta-checklists"
            >
              <CardContent className="p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Safety Checklists</h3>
                <p className="text-sm text-muted-foreground">Secure your phone, finances, email, and social media</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Need Help Right Now?
                  </h3>
                  <p className="text-muted-foreground">
                    If you think you have been scammed or need immediate assistance, our Emergency Guidance section can help you take the right steps.
                  </p>
                </div>
                <Button variant="outline" className="border-amber-300 dark:border-amber-700" onClick={() => onSwitchTab("emergency")} data-testid="button-emergency-help">
                  Get Help
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Think You Have Been Scammed? Act Now
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Contact your bank immediately to freeze accounts and reverse charges.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Change passwords on any accounts that may be compromised.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Report to the FTC at reportfraud.ftc.gov or call 1-877-382-4357.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Tell a trusted family member or friend what happened. You are not alone.</p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="border-red-300 dark:border-red-700" onClick={() => onSwitchTab("emergency")} data-testid="button-seniors-emergency">
                  Full Emergency Guidance
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Share With Family</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Consider reviewing these topics with a trusted family member or friend. Having someone to consult makes it easier to spot scams.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Sources
            </h4>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <a href="https://www.ic3.gov/AnnualReport" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1" data-testid="source-fbi-ic3">
                <ExternalLink className="w-3 h-3" />FBI IC3 Annual Report
              </a>
              <a href="https://www.ftc.gov/reports/consumer-sentinel-network" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1" data-testid="source-ftc">
                <ExternalLink className="w-3 h-3" />FTC Consumer Sentinel Network
              </a>
              <a href="https://www.aarp.org/money/scams-fraud/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1" data-testid="source-aarp">
                <ExternalLink className="w-3 h-3" />AARP Fraud Watch Network
              </a>
              <a href="https://justice.gov/elderjustice" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1" data-testid="source-doj">
                <ExternalLink className="w-3 h-3" />DOJ Elder Justice Initiative
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last reviewed: February 2026</p>
          </div>
        </div>
      </div>
    </>
  );
}

function TopicContent({ 
  topic, 
  onBack 
}: { 
  topic: SafetyTopic;
  onBack: () => void;
}) {
  return (
    <div className="bg-background">
      <div className="bg-hero py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 text-white/70 hover:text-white hover:bg-white/10"
            data-testid="button-back-to-topics"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to All Topics
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-xl ${topic.color} flex items-center justify-center shadow-lg`}>
              <topic.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.025em]" data-testid="text-topic-title">
                {topic.title}
              </h1>
              <p className="text-white/60 mt-1">{topic.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14">
        <p className="text-lg text-foreground leading-relaxed mb-10">{topic.content.intro}</p>

        <div className="bg-muted/50 rounded-2xl p-6 sm:p-8 border mb-10">
          <h2 className="font-bold text-xl text-foreground mb-5 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            What You Need to Know
          </h2>
          <ul className="space-y-3">
            {topic.content.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <h2 className="font-bold text-2xl text-foreground mb-6 tracking-[-0.025em]">
          Step-by-Step Instructions
        </h2>

        <Tabs defaultValue={topic.content.platformGuides[0]?.platform} className="mb-10">
          <TabsList className="flex flex-wrap h-auto gap-1.5 bg-muted/50 p-1.5 rounded-xl mb-6">
            {topic.content.platformGuides.map((guide) => (
              <TabsTrigger
                key={guide.platform}
                value={guide.platform}
                className="text-sm px-3 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                data-testid={`tab-${guide.platform.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
              >
                {guide.platform}
              </TabsTrigger>
            ))}
          </TabsList>

          {topic.content.platformGuides.map((guide) => (
            <TabsContent key={guide.platform} value={guide.platform}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <h3 className="font-bold text-lg text-foreground mb-5">{guide.platform}</h3>
                  <CollapsibleSteps steps={guide.steps} platform={guide.platform} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {topic.content.warningSign && (
          <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-6 sm:p-8 border border-red-200 dark:border-red-800 mb-10">
            <h3 className="font-bold text-lg text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Warning Signs
            </h3>
            <p className="text-red-700 dark:text-red-300 leading-relaxed">{topic.content.warningSign}</p>
          </div>
        )}

        <div className="bg-green-50 dark:bg-green-950/20 rounded-2xl p-6 sm:p-8 border border-green-200 dark:border-green-800 mb-10">
          <h3 className="font-bold text-lg text-green-800 dark:text-green-200 mb-5 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Quick Checklist
          </h3>
          <ul className="space-y-3">
            {topic.content.quickChecklist.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded border-2 border-green-400 dark:border-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-green-700 dark:text-green-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/20 rounded-2xl p-6 sm:p-8 border border-purple-200 dark:border-purple-800 mb-10">
          <h3 className="font-bold text-lg text-purple-800 dark:text-purple-200 mb-5 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            How Family Members Can Help
          </h3>
          <ul className="space-y-3">
            {topic.content.familyTalkingPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-purple-500 font-bold text-lg leading-none mt-0.5">"</span>
                <span className="text-purple-700 dark:text-purple-300 italic leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={onBack} variant="outline" className="rounded-full" data-testid="button-explore-more">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            All Safety Guides
          </Button>
          <Button asChild className="bg-accent text-accent-foreground border-accent-border rounded-full">
            <Link href="/scam-checker">
              Check a Suspicious Message
              <ArrowRight className="w-4 h-4 ml-2 cta-arrow-right" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Seniors() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("guides");

  const currentTopic = selectedTopic 
    ? seniorSafetyTopics.find(t => t.id === selectedTopic) 
    : null;

  const handleSwitchTab = (tab: string) => {
    setActiveTab(tab);
    setSelectedTopic(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const seniorsFaqSchema: FAQData = {
    type: "FAQPage",
    items: seniorSafetyTopics.map(t => ({
      question: t.title + " - what are the warning signs?",
      answer: t.content.intro + " Key points: " + t.content.keyPoints.slice(0, 3).join(". ") + ".",
    })),
  };

  const seniorsBreadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Seniors Safety Hub", url: "https://www.getcyberright.com/seniors" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[seniorsFaqSchema, seniorsBreadcrumbs]} />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        {currentTopic ? (
          <TopicContent 
            topic={currentTopic}
            onBack={() => setSelectedTopic(null)}
          />
        ) : (
          <>
            {activeTab === "guides" && (
              <SeniorsLanding onSelectTopic={setSelectedTopic} onSwitchTab={handleSwitchTab} />
            )}

            {activeTab !== "guides" && (
              <>
                <PageBanner
                  title="Stay Safe and Connected Online"
                  subtitle="Practical guidance to protect yourself from scams and fraud. Learn to recognize warning signs and take simple steps to stay secure."
                  imageSrc={imgSrc(bannerImage)}
                  imageAlt="Seniors using technology safely"
                  colorVariant="teal"
                />

                <div className="max-w-5xl mx-auto px-4 py-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="flex flex-wrap h-auto gap-1.5 bg-muted/50 p-1.5 rounded-xl mb-8">
                      <TabsTrigger value="guides" className="gap-2 px-4 py-2.5" data-testid="tab-guides">
                        <BookOpen className="w-4 h-4" />
                        Guides
                      </TabsTrigger>
                      <TabsTrigger value="exercises" className="gap-2 px-4 py-2.5" data-testid="tab-exercises">
                        <Search className="w-4 h-4" />
                        Scam Exercises
                      </TabsTrigger>
                      <TabsTrigger value="deepdives" className="gap-2 px-4 py-2.5" data-testid="tab-deepdives">
                        <Shield className="w-4 h-4" />
                        Deep Dives
                      </TabsTrigger>
                      <TabsTrigger value="checklists" className="gap-2 px-4 py-2.5" data-testid="tab-checklists">
                        <CheckCircle className="w-4 h-4" />
                        Checklists
                      </TabsTrigger>
                      <TabsTrigger value="emergency" className="gap-2 px-4 py-2.5" data-testid="tab-emergency">
                        <AlertTriangle className="w-4 h-4" />
                        Emergency
                      </TabsTrigger>
                      <TabsTrigger value="stats" className="gap-2 px-4 py-2.5" data-testid="tab-stats">
                        <BarChart3 className="w-4 h-4" />
                        Stats
                      </TabsTrigger>
                      <TabsTrigger value="family" className="gap-2 px-4 py-2.5" data-testid="tab-family">
                        <Users className="w-4 h-4" />
                        Family
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="exercises">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-2">Is This a Scam?</h2>
                          <p className="text-muted-foreground">Practice identifying scams with realistic scenarios from your region. Read each scenario carefully and decide if it is a scam or legitimate.</p>
                        </div>
                        <ScamScenarioExercise scenarios={scamScenarios} />
                      </div>
                    </TabsContent>

                    <TabsContent value="deepdives">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-2">Scam Deep Dives</h2>
                          <p className="text-muted-foreground">Interactive modules that take you deeper into specific scam types. Learn through practice scenarios and build your detection skills.</p>
                        </div>
                        <ScamDeepDive modules={deepDiveModules} />
                      </div>
                    </TabsContent>

                    <TabsContent value="checklists">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-2">Safety Checklists</h2>
                          <p className="text-muted-foreground">Step-by-step security audits for your phone, finances, social media, and email. Check off each step as you complete it. Your progress is saved automatically.</p>
                        </div>
                        <SafetyChecklist checklists={safetyChecklists} />
                      </div>
                    </TabsContent>

                    <TabsContent value="emergency">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-2">I Think I Have Been Scammed</h2>
                          <p className="text-muted-foreground">Answer a few questions about what happened and get specific, actionable steps for your situation. Includes reporting contacts for different regions.</p>
                        </div>
                        <EmergencyFlowchart steps={emergencyFlowSteps} />
                      </div>
                    </TabsContent>

                    <TabsContent value="stats">
                      <ScamStatsInfographic stats={scamStats} />
                    </TabsContent>

                    <TabsContent value="family">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-2">Family Communication Toolkit</h2>
                          <p className="text-muted-foreground">Guides for adult children helping aging parents discuss scam risks. Learn how to have these conversations respectfully, without being condescending.</p>
                        </div>
                        <FamilyCommunicationToolkit conversations={familyConversations} />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </>
        )}
      </main>

      <RelatedResources
        title="Keep Exploring"
        subtitle="More resources to help you and your family stay safe online."
        resources={[
          RESOURCE_LINKS.seniorScamGuide,
          RESOURCE_LINKS.scamChecker,
          RESOURCE_LINKS.identityTheftGuide,
          RESOURCE_LINKS.romanceScamGuide,
          RESOURCE_LINKS.emergencyHelp,
          RESOURCE_LINKS.dataRemoval,
        ]}
      />

      <Footer />
    </div>
  );
}
