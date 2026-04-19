"use client";

import { useState } from "react";
import { Link } from "@/lib/navigation";
import { RelatedResources, RESOURCE_LINKS } from "@/components/related-resources";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StructuredData } from "@/components/structured-data";
import type { FAQData, BreadcrumbData } from "@/components/structured-data";
import {
  Shield, Eye, MessageCircle, Gamepad2,
  CheckCircle, Users, AlertTriangle,
  ArrowRight, Settings, Clock, BookOpen,
  CalendarDays, ChevronDown, ChevronUp,
  ClipboardCheck, Brain, Smartphone, Scale,
  Sparkles, BarChart3, Globe
} from "lucide-react";
import bannerImage from "@/assets/banners/parents-banner.webp";
import cardParentalControls from "@/assets/images/card-parental-controls.webp";
import cardSocialMedia from "@/assets/images/card-social-media-safety.webp";
import cardScreenTime from "@/assets/images/card-screen-time.webp";
import cardGamingSafety from "@/assets/images/card-gaming-safety.webp";
import cardOnlinePredators from "@/assets/images/card-online-predators.webp";
import cardFirstDevice from "@/assets/images/card-first-device.webp";

import {
  DeviceAuditChecklist, ParentingQuiz, AppSafetyReview,
  LegalAwarenessModule, ConversationGenerator, ISPControlGuides,
  FamilyStatsInfographic, MicroTransactionAwareness
} from "@/components/parents-hub/interactive-tools";
import {
  parentingQuizQuestions, appSafetyCards, legalInfoData,
  conversationScripts, familyStats, deviceAudits, ispGuides,
  microTransactionStats
} from "@/components/parents-hub/quiz-data";
import { imgSrc } from "@/lib/img-src";

interface PlatformGuide {
  platform: string;
  steps: string[];
}

interface ParentTopic {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
  color: string;
  image: string;
  content: {
    intro: string;
    keyPoints: string[];
    platformGuides: PlatformGuide[];
    quickChecklist: string[];
    conversationStarters: string[];
    warningSign?: string;
  };
}

const parentTopics: ParentTopic[] = [
  {
    id: "device-controls",
    title: "Setting Up Parental Controls",
    description: "Step-by-step setup for every device your family uses.",
    icon: Settings,
    color: "bg-blue-500",
    image: imgSrc(cardParentalControls),
    content: {
      intro: "Parental controls are built into every device your child uses. The problem is that most parents never turn them on because the steps are buried in settings menus. Here is exactly how to set them up on each platform.",
      keyPoints: [
        "Every major device has free built-in parental controls. You do not need to buy extra software.",
        "Set up controls before handing the device to your child. It is much harder to add restrictions after they have been using it freely.",
        "Controls should be adjusted as children grow. What works for an 8-year-old is too restrictive for a 14-year-old.",
        "No parental control replaces conversation. Your child should understand why these are in place."
      ],
      platformGuides: [
        {
          platform: "iPhone / iPad",
          steps: [
            "Open Settings and tap Screen Time.",
            "Tap Turn On Screen Time, then tap Continue.",
            "Select This is My Child's iPhone.",
            "Set a Downtime schedule (the hours when apps are blocked, such as bedtime).",
            "Tap App Limits, then Add Limit. Choose categories like Social Networking or Games and set a daily time allowance.",
            "Tap Content & Privacy Restrictions. Turn it on.",
            "Under Content Restrictions, set: Web Content to Limit Adult Websites, Apps to the correct age rating (4+, 9+, 12+, or 17+), Music & Podcasts to Clean.",
            "Under Privacy, disable Location Services changes so your child cannot turn off location sharing.",
            "Go back to Screen Time and tap Use Screen Time Passcode. Choose a passcode your child does not know.",
            "If your child has their own Apple ID, go to Settings, tap your name, then Family Sharing, and add them. This lets you approve purchases and app downloads remotely."
          ]
        },
        {
          platform: "Android Phone / Tablet",
          steps: [
            "Download Google Family Link from the Play Store on your phone.",
            "Open Family Link and follow the prompts to create or link your child's Google account.",
            "On your child's device, sign in with their Google account and confirm the Family Link connection.",
            "In Family Link on your phone, tap your child's name. You will now see their dashboard.",
            "Tap Controls, then App Limits. Set daily time limits for individual apps (YouTube, games, social media).",
            "Tap Content Restrictions. Set Google Play to restrict apps, games, movies, and books by age rating.",
            "Under Google Chrome, choose Try to block mature sites to enable web filtering.",
            "Under Google Search, turn on SafeSearch.",
            "Tap Location to see your child's device location in real time. Turn on See your child's location.",
            "Set a device Bedtime under Daily Limit to lock the phone at night.",
            "To approve app downloads, go to Controls, then Google Play, then Require Approval For set to All Content."
          ]
        },
        {
          platform: "Windows PC / Laptop",
          steps: [
            "Go to family.microsoft.com and sign in with your Microsoft account.",
            "Click Add a Family Member and create a child account with their own email, or use an existing one.",
            "On your child's Windows PC, go to Settings, then Accounts, then Family & Other Users. Add the child account you created.",
            "Make sure your child signs in to the PC with their child account, not yours.",
            "Back on family.microsoft.com, click your child's name. You will see their activity dashboard.",
            "Click Screen Time. Turn on limits and set allowed hours for each day of the week.",
            "Click Content Filters. Under Web & Search, turn on Filter inappropriate websites and Only use allowed websites (for younger children).",
            "Under Apps & Games, set an age limit. Apps above the limit will need your approval.",
            "Click Spending. Turn on Require approval for purchases. Add money to their account only when you choose.",
            "For added safety, go to Settings, then Accounts, then Sign-in Options on the child's PC and set it to require a password on wake."
          ]
        },
        {
          platform: "Chromebook",
          steps: [
            "Chromebooks work with Google Family Link, the same tool as Android.",
            "On the Chromebook sign-in screen, click Add Person, then sign in with your child's supervised Google account.",
            "If your child does not have a supervised account, create one through Family Link on your phone first.",
            "Once signed in, all Family Link settings apply automatically: web filters, app restrictions, and screen time limits.",
            "To adjust Chromebook-specific settings, open Family Link on your phone, tap your child's name, then tap Controls.",
            "Under Google Chrome, choose: Try to block mature sites (recommended for most ages) or Only allow certain sites (for younger children where you add approved sites manually).",
            "Under Google Play, set which apps and games they can install by age rating.",
            "Set a Chromebook bedtime schedule to lock the device at night.",
            "To see what websites your child visited, check the Activity section in Family Link."
          ]
        }
      ],
      quickChecklist: [
        "Parental controls are turned on for every device my child uses.",
        "I have set age-appropriate content filters.",
        "App downloads require my approval.",
        "Screen time limits are set for weekdays and weekends.",
        "I have a passcode or PIN my child does not know.",
        "I review settings every few months as my child gets older."
      ],
      conversationStarters: [
        "Let's set up your device together so we both understand how it works.",
        "What apps do your friends use? Let's look at them together.",
        "These settings are here to help protect you, not to punish you."
      ]
    }
  },
  {
    id: "social-media",
    title: "Social Media Safety",
    description: "Platform-by-platform privacy settings and monitoring guidance.",
    icon: MessageCircle,
    color: "bg-pink-500",
    image: imgSrc(cardSocialMedia),
    content: {
      intro: "Social media is a major part of most children's lives. The risk is not the platform itself, it is the default settings. Most accounts are public by default, which means anyone can see your child's posts, photos, and location. Here is how to lock down each platform.",
      keyPoints: [
        "Most social media platforms require users to be at least 13 years old. Many children sign up earlier.",
        "A private account means only approved followers can see posts. This should be the default for every child.",
        "Anything posted online can be screenshotted and shared beyond their control, even on private accounts.",
        "Direct messages from strangers are the highest-risk feature. Turn them off wherever possible.",
        "Social media can affect mental health through comparison and cyberbullying. Watch for changes in mood after screen time."
      ],
      platformGuides: [
        {
          platform: "Instagram",
          steps: [
            "Open Instagram and go to your child's profile. Tap the three lines (menu) in the top right, then Settings and Privacy.",
            "Tap Account Privacy. Turn on Private Account. This means only approved followers can see their posts and stories.",
            "Go to Settings, then Messages and Story Replies. Set Who Can Message You to People You Follow. This blocks messages from strangers.",
            "Go to Settings, then Hidden Words. Turn on Hide Comments and Hide Message Requests to filter out offensive content automatically.",
            "Go to Settings, then Interactions, then Restricted Accounts. Add anyone who is bothering your child. Restricted users can still see the profile but their comments will only be visible to them.",
            "Go to Settings, then Sharing and Remixes. Turn off Allow Others to Remix and Allow Sharing to Stories.",
            "For children under 16, Instagram automatically restricts some features. Make sure the account age is set correctly in Settings, then Account, then Personal Information.",
            "Go to Settings, then Supervision (if available). This lets you see who they follow, who follows them, and how much time they spend."
          ]
        },
        {
          platform: "TikTok",
          steps: [
            "Open TikTok and go to Profile, then tap the three lines (menu), then Settings and Privacy.",
            "Tap Privacy. Set the account to Private so only approved followers can see videos.",
            "Under Privacy, set Who Can Send You Direct Messages to No One or Friends.",
            "Set Who Can Duet With You and Who Can Stitch With Your Videos to Friends or No One.",
            "Tap Digital Wellbeing, then Screen Time Management. Set a daily time limit and protect it with a passcode.",
            "Under Digital Wellbeing, turn on Restricted Mode. This filters content that may not be appropriate for all audiences. Lock it with a passcode.",
            "Set up Family Pairing: On your phone, go to TikTok Settings, then Family Pairing. Scan the QR code on your child's TikTok app. This links both accounts.",
            "With Family Pairing, you can control their settings remotely: screen time, restricted mode, direct messages, and discoverability."
          ]
        },
        {
          platform: "Snapchat",
          steps: [
            "Open Snapchat and tap the profile icon in the top left, then the gear icon for Settings.",
            "Tap Contact Me. Set it to My Friends so only people they have added can send Snaps and messages.",
            "Tap View My Story. Set it to My Friends Only.",
            "Tap See My Location. Turn on Ghost Mode to hide your child's location from the Snap Map.",
            "Under Privacy Controls, tap See Me in Quick Add. Turn it off so strangers cannot find your child's account.",
            "Go to Settings, then Family Center. This lets you connect your account to your child's so you can see who they are chatting with (not the content, just the contacts).",
            "Tap My AI and consider disabling it if you do not want your child interacting with Snapchat's AI chatbot."
          ]
        },
        {
          platform: "YouTube",
          steps: [
            "For children under 13: Use the YouTube Kids app instead of regular YouTube. It has built-in content filters by age group (Preschool, Younger, Older).",
            "To set up YouTube Kids: Download the app, sign in with your Google account, add your child's profile, and select their age group.",
            "In YouTube Kids, tap the Lock icon (bottom right), then Settings. You can turn off Search to limit content to curated channels only.",
            "For teens 13 and older using regular YouTube: Sign in to their Google account. Go to Settings, then General, then Restricted Mode. Turn it on.",
            "In Google Family Link, go to your child's profile, then Controls, then Google Services, then YouTube. You can set content restrictions by age rating.",
            "Turn off Autoplay in YouTube settings to prevent endless video chains.",
            "Review their Watch History regularly. Go to Library, then History."
          ]
        }
      ],
      quickChecklist: [
        "All social media accounts are set to Private.",
        "Direct messages from strangers are turned off.",
        "Location sharing is disabled or set to Friends only.",
        "I know which platforms my child uses and have my own accounts there.",
        "Content filters and restricted modes are turned on.",
        "I have a plan for what to do if my child is cyberbullied."
      ],
      conversationStarters: [
        "Who are your closest friends online? Do you know them in real life?",
        "Has anyone ever made you feel uncomfortable on social media?",
        "What would you do if someone you don't know sent you a message?"
      ],
      warningSign: "If your child suddenly becomes secretive about their phone, starts deleting messages, or gets upset when you are near their device, have a calm conversation. These behaviors can indicate cyberbullying, unwanted contact, or exposure to inappropriate content."
    }
  },
  {
    id: "screen-time",
    title: "Managing Screen Time",
    description: "Set up device-level time limits with exact steps for each platform.",
    icon: Clock,
    color: "bg-purple-500",
    image: imgSrc(cardScreenTime),
    content: {
      intro: "The goal is not to eliminate screen time. It is to make sure it does not crowd out sleep, physical activity, homework, and family time. Every major device has built-in tools to set daily limits and schedules. Here is how to use them.",
      keyPoints: [
        "Quality of screen time matters as much as quantity. Creating a video is different from scrolling mindlessly.",
        "The American Academy of Pediatrics recommends: under 2 years limited to video calls, ages 2 to 5 one hour per day of quality content, ages 6 and older consistent limits that do not interfere with sleep or activity.",
        "Children learn from watching how parents use their own devices. Model the behavior you want to see.",
        "Sleep suffers most from late-night screen use. Blue light from screens disrupts the sleep cycle.",
        "Having a family agreement about screen time (written down, agreed to by everyone) is more effective than unilateral rules."
      ],
      platformGuides: [
        {
          platform: "iPhone / iPad",
          steps: [
            "Open Settings, then Screen Time.",
            "If not already enabled, tap Turn On Screen Time, then select This is My Child's iPhone.",
            "Tap Downtime. Turn it on and set the schedule (for example, 8:00 PM to 7:00 AM on school nights). During downtime, only phone calls and apps you choose will work.",
            "Tap Always Allowed. Add any apps your child should be able to use during downtime (such as Phone, Messages, or a music app).",
            "Tap App Limits, then Add Limit. Select categories (Social Networking, Games, Entertainment) and set a daily time allowance. When time is up, the app locks and your child must ask for more time.",
            "To see how much time your child spent on each app, go to Screen Time and check the daily and weekly reports.",
            "Set a Screen Time Passcode so your child cannot change these settings."
          ]
        },
        {
          platform: "Android Phone / Tablet",
          steps: [
            "Open Google Family Link on your phone.",
            "Tap your child's name, then tap Controls, then Daily Limit.",
            "Turn on Daily Limit. Set a maximum number of hours per day (you can set different limits for weekdays and weekends).",
            "Tap Bedtime. Set the hours when the device will be completely locked (for example, 9:00 PM to 6:30 AM).",
            "To limit specific apps, tap Controls, then App Limits. Find the app (such as YouTube or a game) and set a daily time limit for that app only.",
            "To add bonus time for a specific day (like a weekend), tap your child's name, then tap Bonus Time.",
            "Check the Activity tab in Family Link to see daily and weekly screen time reports, including which apps were used most."
          ]
        },
        {
          platform: "Windows PC / Laptop",
          steps: [
            "Go to family.microsoft.com and sign in.",
            "Click your child's name, then click Screen Time.",
            "Turn on screen time limits. Set the hours when the PC is available (for example, 7:00 AM to 8:30 PM on school days).",
            "Set a maximum number of hours per day (for example, 2 hours on weekdays, 4 hours on weekends).",
            "Under Apps & Games Time Limits, find specific apps and set individual limits if needed.",
            "When time runs out, Windows will show your child a notification and lock the session. They can request more time, which you approve from your phone or email.",
            "Review the weekly activity report emailed to you, or check it at family.microsoft.com."
          ]
        },
        {
          platform: "Nintendo Switch",
          steps: [
            "Download the Nintendo Switch Parental Controls app from the App Store or Google Play.",
            "Open the app and follow the steps to link it to your child's Nintendo Switch console.",
            "In the app, set a Daily Play Time Limit (for example, 1 hour on school days).",
            "Choose what happens when time runs out: Alarm Only (a reminder appears) or Suspend Software (the game pauses and the console locks).",
            "Set a Bedtime Alarm to remind your child to stop playing at a specific time.",
            "Under Restriction Level, choose a preset (Child, Pre-Teen, or Teen) to restrict games by age rating and block access to social features.",
            "The app shows a daily play time report so you can see how much your child played each day."
          ]
        }
      ],
      quickChecklist: [
        "Screen time limits are set on every device my child uses.",
        "Bedtime/downtime schedules are configured to lock devices at night.",
        "I have set different limits for weekdays and weekends.",
        "I can view weekly screen time reports.",
        "The whole family has agreed to shared screen time rules.",
        "Devices have a dedicated charging spot outside of bedrooms."
      ],
      conversationStarters: [
        "What are your favorite things to do on your device?",
        "How do you feel after spending a long time on screens?",
        "Let's make a family agreement about screen time that works for everyone."
      ]
    }
  },
  {
    id: "gaming-safety",
    title: "Online Gaming Safety",
    description: "Console-by-console setup for purchases, chat, and age restrictions.",
    icon: Gamepad2,
    color: "bg-green-500",
    image: imgSrc(cardGamingSafety),
    content: {
      intro: "Video games are social now. Most popular games include voice chat with strangers, in-game purchases that can cost real money, and mechanics designed to keep players engaged for hours. Every gaming platform has parental controls, but they are turned off by default. Here is how to set them up.",
      keyPoints: [
        "Voice and text chat with strangers is the biggest risk in online gaming. Many games match your child with random players.",
        "In-game purchases (V-Bucks, Robux, skins, loot boxes) use real money. Children can spend hundreds of dollars without realizing it.",
        "Game ratings (ESRB, PEGI) tell you the minimum age. E is for Everyone, T is for Teen (13+), M is for Mature (17+).",
        "Some games designed for children (like Roblox) host user-created content that may not be age-appropriate.",
        "Gaming addiction is real. Watch for: skipping meals or sleep to play, anger when asked to stop, declining school performance, withdrawing from friends or family."
      ],
      platformGuides: [
        {
          platform: "PlayStation (PS4 / PS5)",
          steps: [
            "Create a Family Manager account for yourself at playstation.com if you do not have one.",
            "Go to Settings, then Family Management, then Add Family Member, then Add a Child.",
            "Create a child account with their correct date of birth. This automatically applies age-based game restrictions.",
            "Set Communication and User-Generated Content restrictions: go to your child's account settings, then Parental Controls, then Communication and User-Generated Content. Choose Restrict to block messages and voice chat with strangers.",
            "Set Monthly Spending Limit: under Parental Controls, set a monthly spending cap (you can set it to $0 to block all purchases).",
            "Set Play Time Controls: go to Parental Controls, then Play Time Settings. Set a daily limit and choose what happens when time is up (notification only or automatic logout).",
            "Set Game Age Ratings: under Content Restriction, set the age level to match your child. Games above this rating will be locked.",
            "To see what your child has been playing, check the Play Time report in the PlayStation app on your phone."
          ]
        },
        {
          platform: "Xbox (Series X/S / One)",
          steps: [
            "Go to xbox.com/family or open the Xbox Family Settings app on your phone.",
            "Sign in with your Microsoft account (the family organizer).",
            "Add your child's Microsoft account to your family group.",
            "Under Content Restrictions, set the age filter. This blocks games, apps, and videos above the selected age rating.",
            "Under Communication & Multiplayer, choose who your child can communicate with: Friends Only (recommended) or No One.",
            "Under Spending, set Ask a Parent for purchases. Your child will need your approval for any purchase.",
            "Under Screen Time, set daily limits and a schedule. You can set different limits for weekdays and weekends.",
            "Turn on Activity Reports to receive a weekly email showing what your child played and for how long.",
            "In the Xbox Family Settings app, you can approve or deny requests in real time from your phone."
          ]
        },
        {
          platform: "Nintendo Switch",
          steps: [
            "Download the Nintendo Switch Parental Controls app on your phone.",
            "Link the app to your child's Switch console using the registration code shown on the TV.",
            "Set Restriction Level: choose Child (ages 0 to 7), Pre-Teen (ages 8 to 12), or Teen (ages 13 to 17). This controls which games are playable and whether they can communicate with others.",
            "Under Restriction Level, review specific settings: Posting on Social Media can be turned off, Communicating with Others can be restricted, and Free Communication (voice chat) can be blocked.",
            "Set a Daily Play Time Limit in the app. Choose between 15 minutes and 6 hours.",
            "Choose the end-of-time behavior: Alarm Only (shows a warning) or Suspend Software (saves the game and locks the console).",
            "The app shows a monthly play time summary so you can see daily usage trends."
          ]
        },
        {
          platform: "Roblox",
          steps: [
            "Log in to your child's Roblox account at roblox.com. Go to Settings, then Privacy.",
            "Under Contact Settings, set each option based on your child's age. For younger children (under 10), set everything to No One. For older children, Friends is appropriate.",
            "Under Other Settings, turn off: Who can invite me to VIP servers, Who can join me, and Who can see my inventory.",
            "Go to Settings, then Security. Enable the Account PIN. This prevents your child from changing privacy settings without the PIN.",
            "Go to Settings, then Parental Controls. Turn on Account Restrictions. This limits your child to a curated list of games and disables chat.",
            "To prevent unauthorized purchases: go to Settings, then Security. Enable 2-Step Verification. Only add Robux through gift cards you purchase, not a linked credit card.",
            "Regularly check the Transactions page (My Transactions under Robux) to see what your child has bought."
          ]
        }
      ],
      quickChecklist: [
        "All gaming accounts have parental controls enabled.",
        "Voice chat with strangers is turned off or set to Friends only.",
        "Purchase approvals or spending limits are set.",
        "Game age ratings are configured correctly for my child's age.",
        "I check what games my child is playing and who they play with.",
        "The family has agreed on gaming time limits."
      ],
      conversationStarters: [
        "What games are you playing right now? Can you show me how they work?",
        "Has anyone ever said something mean or scary to you in a game?",
        "Do any of your games have stores where you can buy things?"
      ],
      warningSign: "If your child becomes extremely angry or emotional when asked to stop playing, or if they are skipping meals, losing sleep, or declining in school performance because of gaming, it may be time to reassess their gaming time and seek professional guidance."
    }
  },
  {
    id: "online-predators",
    title: "Protecting Against Online Predators",
    description: "Warning signs, prevention strategies, and what to do if it happens.",
    icon: Eye,
    color: "bg-red-500",
    image: imgSrc(cardOnlinePredators),
    content: {
      intro: "Online predators use social media, gaming platforms, and messaging apps to contact children. They build trust slowly through a process called grooming. Understanding how this works is the best way to protect your child.",
      keyPoints: [
        "Grooming follows a pattern: identifying a target, gaining trust, filling a need (attention, gifts, compliments), isolating the child from parents, and then exploiting the relationship.",
        "Predators often pretend to be younger than they are. They are not always strangers; they can be people the child knows.",
        "The most dangerous feature on any platform is private direct messaging. If a stranger can message your child directly, the risk increases significantly.",
        "Children who are lonely, going through family difficulties, or seeking attention are more vulnerable. Building a strong relationship with your child is the best protection.",
        "If you suspect your child is being groomed, do not confront the child or the predator directly. Contact law enforcement and preserve all evidence."
      ],
      platformGuides: [
        {
          platform: "Warning Signs of Grooming",
          steps: [
            "Your child receives gifts, money, or game items from someone you do not know.",
            "They become secretive about who they are talking to online.",
            "They use a device late at night or in private.",
            "There is a new 'friend' or 'mentor' who is significantly older.",
            "They have multiple social media accounts, including ones you did not know about.",
            "Their behavior changes: withdrawal, mood swings, or anxiety.",
            "They have sexual content, explicit messages, or inappropriate images on their device.",
            "An adult is contacting them through multiple platforms.",
            "They are being asked to keep the relationship secret."
          ]
        },
        {
          platform: "If You Suspect Grooming",
          steps: [
            "Stay calm. Do not confront your child or the suspected predator.",
            "Do not delete any messages, images, or chat logs. These are evidence.",
            "Take screenshots of all conversations, profile pages, and any gifts or items received.",
            "Report to your local law enforcement. Ask to speak with their Internet Crimes Against Children (ICAC) unit.",
            "In the US, file a report with the National Center for Missing & Exploited Children (NCMEC) CyberTipline: CyberTipline.org or call 1-800-THE-LOST.",
            "In the UK, report to CEOP (Child Exploitation and Online Protection) at ceop.police.uk.",
            "Report the account on the platform where the contact is happening.",
            "Consider seeking professional support for your child from a counselor experienced in online exploitation."
          ]
        },
        {
          platform: "Prevention Strategies",
          steps: [
            "Keep communication open. Children who feel safe talking to parents are more likely to report concerning behavior.",
            "Ensure all messaging apps are set to block messages from strangers.",
            "Teach your child that real friends do not ask them to keep secrets from their parents.",
            "Discuss the concept of grooming in age-appropriate language so they can recognize it.",
            "Keep devices in common areas of the house, especially for younger children.",
            "Know your child's online friends and encourage in-person friendships.",
            "Regularly review their friend lists and contacts on all platforms.",
            "Install your child's apps on your own phone so you understand how they work."
          ]
        }
      ],
      quickChecklist: [
        "My child knows they can tell me anything without getting in trouble.",
        "Direct messages from strangers are turned off on all platforms.",
        "I know who my child's online friends are.",
        "Devices are used in common areas, not behind closed doors (for younger children).",
        "My child understands that adults should not ask children to keep secrets.",
        "I know how to report suspicious activity to NCMEC, CEOP, or local law enforcement."
      ],
      conversationStarters: [
        "If someone online made you feel uncomfortable, what would you do?",
        "Has anyone online ever asked you to keep something secret from me?",
        "Do you know anyone online that you have never met in person? Tell me about them."
      ],
      warningSign: "If your child has received gifts, money, or special attention from someone online, or if they are communicating with someone they met online through private channels, take immediate action. Contact NCMEC CyberTipline or local law enforcement. Do not delete evidence."
    }
  },
  {
    id: "first-device",
    title: "Your Child's First Device",
    description: "A complete guide to preparing your family for the first phone, tablet, or computer.",
    icon: Shield,
    color: "bg-orange-500",
    image: imgSrc(cardFirstDevice),
    content: {
      intro: "Giving your child their first device is a milestone. Whether it is a phone, tablet, or laptop, the preparation you do before handing it over determines how safe and positive the experience will be. Here is a complete framework for getting it right.",
      keyPoints: [
        "There is no universally right age for a first device. It depends on your child's maturity, your family's needs, and how much preparation you do.",
        "Setting up the device together is more important than any single setting. It teaches your child that safety is a partnership, not surveillance.",
        "Start with more restrictions and gradually loosen them as your child demonstrates responsibility. It is harder to add restrictions after they have had unrestricted access.",
        "A written family agreement that everyone signs creates shared ownership of the rules. It is more effective than verbal rules that are easily forgotten.",
        "The first few weeks are the most important. Check in regularly, review the settings, and adjust based on what you learn together."
      ],
      platformGuides: [
        {
          platform: "Before You Buy",
          steps: [
            "Decide what the device is for: staying in touch, homework, entertainment, or all of the above. This affects which device you choose.",
            "Consider starting with a device that has fewer risks: a basic phone with no apps, a tablet used only at home, or a laptop in a shared space.",
            "Research parental control options for the device you are considering. Apple and Google both have robust built-in tools.",
            "Have a conversation with your child about why they want a device and what they plan to use it for. Listen without judgment.",
            "Talk to other parents about their experiences. What worked, what did not, and what they wish they had done differently.",
            "Set a budget for the device and any recurring costs (data plan, app purchases, game subscriptions)."
          ]
        },
        {
          platform: "Setting Up Together",
          steps: [
            "Unbox the device together. This sends the message that this is a shared project, not a secret tool.",
            "Create their account together. Use their real age so that built-in protections apply correctly.",
            "Walk through each parental control setting and explain why it exists. This is an educational moment, not a restrictive one.",
            "Set up a passcode they will use and a separate parental passcode for settings changes.",
            "Install only the apps you both agree on at first. More apps can be added later as trust builds.",
            "Set up a family charging station where all devices (including yours) charge overnight, outside of bedrooms.",
            "Take a photo of the settings you have configured in case you need to reference them later."
          ]
        },
        {
          platform: "The Family Agreement",
          steps: [
            "Write a simple agreement that covers: when the device can be used, where it can be used, what apps are allowed, and what is off limits.",
            "Include consequences that are proportional and agreed upon in advance. For example: breaking a rule means the device stays in the common area for a week.",
            "Include your commitments as a parent: you will not read their private messages without cause, you will discuss concerns calmly, and you will adjust rules as they grow.",
            "Both parent and child sign the agreement. Post it somewhere visible.",
            "Schedule a monthly family meeting to review how things are going and adjust rules if needed.",
            "Remember: the agreement is a living document. It should evolve as your child matures and demonstrates responsibility."
          ]
        },
        {
          platform: "The Digital Reputation Talk",
          steps: [
            "Explain the Grandma Rule: if you would not want your grandma to see it, do not post it.",
            "Explain that everything posted online can be screenshotted, shared, and found later, even if it is deleted.",
            "Teach the 24-Hour Rule: if a post is emotional, wait 24 hours before posting. If it still seems like a good idea, go ahead.",
            "Help them understand that future schools, employers, and colleges may search their name online.",
            "The Audience Rule: before posting, imagine that your teacher, your best friend's parent, and a college admissions officer will all see it.",
            "The Location Rule: Never post in real time with your location visible. Wait until you have left before sharing.",
            "The Emotion Rule: If you are angry, upset, or have been drinking, do not post. Wait 24 hours."
          ]
        },
        {
          platform: "Removing Unwanted Content",
          steps: [
            "To remove a Google search result: go to google.com/webmaster/tools/removals and submit a removal request for specific URLs.",
            "To remove photos from Google Images: click the image result, then click 'Report' or use the removal tool above.",
            "On Instagram: you can request removal of photos someone else posted of you. Tap the three dots on the post, then Report, then It's About Me, then I appear in this photo.",
            "On Facebook: report photos that violate your privacy. Click the three dots on the post, then Report.",
            "For websites that refuse to remove content: contact your internet service provider or consult the platform's legal removal process.",
            "For serious cases (explicit images of a minor): report to NCMEC CyberTipline immediately. They have legal authority to compel removal."
          ]
        }
      ],
      quickChecklist: [
        "I have searched my child's name on Google and reviewed the results.",
        "All social media profiles are set to Private.",
        "My child understands the Grandma Rule before posting.",
        "Location data is turned off on camera and social media apps.",
        "Old, unused accounts are deactivated or deleted.",
        "My child knows how to ask for help removing unwanted content."
      ],
      conversationStarters: [
        "Imagine a college admissions officer looking at your social media right now. What would they see?",
        "What positive things about yourself would you want someone to find online?",
        "Let's Google your name together and see what comes up."
      ]
    }
  }
];

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

function ParentsLanding({ onSelectTopic, onSwitchTab }: { onSelectTopic: (id: string) => void; onSwitchTab: (tab: string) => void }) {
  return (
    <>
      <PageBanner
        title="Protect Your Family Online"
        subtitle="Step-by-step guides, interactive tools, scenario quizzes, and region-specific resources. Built for parents who want clear answers, not tech jargon."
        imageSrc={imgSrc(bannerImage)}
        imageAlt="Family learning about digital safety together"
        colorVariant="blue"
      />

      <div className="py-16 sm:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <Tabs defaultValue="guides" className="mb-12">
            <TabsList className="flex flex-wrap h-auto gap-1.5 bg-muted/50 p-1.5 rounded-xl mb-8">
              <TabsTrigger value="guides" className="gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm" data-testid="tab-guides">
                <BookOpen className="w-4 h-4" /> Guides
              </TabsTrigger>
              <TabsTrigger value="activities" className="gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm" data-testid="tab-activities">
                <Brain className="w-4 h-4" /> Activities
              </TabsTrigger>
              <TabsTrigger value="tools" className="gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm" data-testid="tab-tools">
                <Sparkles className="w-4 h-4" /> Tools
              </TabsTrigger>
              <TabsTrigger value="legal" className="gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm" data-testid="tab-legal">
                <Scale className="w-4 h-4" /> Legal
              </TabsTrigger>
              <TabsTrigger value="stats" className="gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm" data-testid="tab-stats">
                <BarChart3 className="w-4 h-4" /> Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guides">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6">
                {parentTopics.map((topic) => (
                  <Card
                    key={topic.id}
                    className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-primary/30 overflow-hidden"
                    onClick={() => onSelectTopic(topic.id)}
                    onKeyDown={(e) => e.key === 'Enter' && onSelectTopic(topic.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Learn about ${topic.title}`}
                    data-testid={`card-topic-${topic.id}`}
                  >
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        src={topic.image}
                        alt={topic.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        data-testid={`img-topic-${topic.id}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className={`absolute bottom-3 left-3 w-10 h-10 rounded-md ${topic.color} flex items-center justify-center shadow-lg`}>
                        <topic.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg text-foreground mb-1.5">{topic.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{topic.description}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-3">
                        View full guide <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activities" className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-foreground">Family Activities You Can Run This Weekend</h2>
                </div>
                <p className="text-muted-foreground mb-5">Four short, hands-on activities designed to spark conversation and build real digital safety skills together. Each one takes 15 to 30 minutes.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Password Strength Challenge",
                      time: "20 minutes",
                      ages: "Ages 8 and up",
                      color: "bg-blue-500",
                      icon: Shield,
                      desc: "Each family member writes down what they think is a strong password. Use a public strength tester (like the one at bitwarden.com/password-strength) to compare results. Then build a shared family rule: at least 14 characters, a passphrase of four random words, and never reuse for email or banking. Finish by helping younger kids create their first real password for a non-critical account."
                    },
                    {
                      title: "Spot the Scam",
                      time: "15 minutes",
                      ages: "Ages 10 and up",
                      color: "bg-red-500",
                      icon: AlertTriangle,
                      desc: "Pull up five real-looking texts and emails (use our scam checker examples or screenshots from your own spam folder) and have each person score them on a 1 to 5 'how suspicious' scale. Then reveal which were scams and discuss the giveaway clues: urgency, weird sender, links that don't match, requests for gift cards or codes."
                    },
                    {
                      title: "Privacy Settings Family Audit",
                      time: "30 minutes",
                      ages: "All ages, parent-led",
                      color: "bg-purple-500",
                      icon: Eye,
                      desc: "Pick one app per person (Instagram, TikTok, a game, a school app) and walk through the privacy settings together. Turn off location sharing where it's not needed, set accounts to private by default for kids under 16, and review who can send messages or friend requests. Write down the changes you made so you can repeat the audit every six months."
                    },
                    {
                      title: "What Would You Do?",
                      time: "15 minutes",
                      ages: "Ages 7 and up",
                      color: "bg-emerald-500",
                      icon: MessageCircle,
                      desc: "Read a scenario out loud and let everyone answer before discussing. Examples: 'A stranger in a game asks for your real name', 'A friend sends you a screenshot of someone else's text', 'You see a video that scares you'. The goal is not to be right, it's to practice talking about hard online moments before they happen."
                    }
                  ].map((a) => (
                    <Card key={a.title} className="border-2 hover:shadow-md transition-shadow" data-testid={`activity-card-${a.title.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg ${a.color} flex items-center justify-center flex-shrink-0`}>
                            <a.icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-foreground">{a.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs"><Clock className="w-3 h-3 mr-1" />{a.time}</Badge>
                          <Badge variant="outline" className="text-xs">{a.ages}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="border-t pt-8">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-foreground">Device Safety Audit</h2>
                </div>
                <p className="text-muted-foreground mb-5">Walk through each device your family uses and check that all safety settings are properly configured. Your progress is saved automatically.</p>
                <DeviceAuditChecklist audits={deviceAudits} />
              </div>

              <div className="border-t pt-8">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-foreground">Parenting Scenario Quiz</h2>
                </div>
                <p className="text-muted-foreground mb-5">Test your knowledge with real-world parenting scenarios. Each question includes detailed feedback explaining the best approach.</p>
                <ParentingQuiz questions={parentingQuizQuestions} />
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-foreground">Tools We Actually Recommend</h2>
                </div>
                <p className="text-muted-foreground mb-5">A short, opinionated list. We don't take affiliate money for any of these. Pick the one that fits your devices and your family's comfort level.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Google Family Link",
                      tag: "Free",
                      best: "Android households and any Google account for kids under 13",
                      desc: "Set screen time limits, approve app downloads, see what apps your child uses, and lock the device remotely. Works on Android phones and Chromebooks. Limited support on iPhone.",
                      url: "https://families.google.com/familylink/"
                    },
                    {
                      name: "Apple Screen Time",
                      tag: "Built in, free",
                      best: "iPhone and iPad families using Family Sharing",
                      desc: "Built into iOS. Set Downtime, App Limits, and Communication Limits per child. Approve purchases and downloads from your phone. Use Screen Distance and Communication Safety to flag inappropriate images.",
                      url: "https://support.apple.com/en-us/HT208982"
                    },
                    {
                      name: "Circle Home Plus",
                      tag: "$9.99/mo or $129/yr",
                      best: "Households with mixed devices and gaming consoles",
                      desc: "A small box that plugs into your router and applies time limits, content filters, and bedtime pauses to every device on your Wi-Fi, including smart TVs and game consoles. Works without installing apps on each device.",
                      url: "https://meetcircle.com/"
                    },
                    {
                      name: "NextDNS",
                      tag: "Free up to 300k queries/mo",
                      best: "Tech-comfortable parents who want a network-level filter",
                      desc: "A configurable DNS service that blocks adult sites, malware, trackers, and specific apps for everyone on your network. Set it up on your router or per device. Includes detailed logs so you can see what was blocked.",
                      url: "https://nextdns.io/"
                    }
                  ].map((t) => (
                    <Card key={t.name} className="border-2 hover:shadow-md transition-shadow" data-testid={`tool-card-${t.name.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{t.name}</h3>
                          <Badge variant="secondary" className="text-xs">{t.tag}</Badge>
                        </div>
                        <p className="text-xs text-primary font-medium mb-2">Best for: {t.best}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.desc}</p>
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          data-testid={`link-tool-${t.name.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                        >
                          Visit official site <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="border-t pt-8">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-foreground">Conversation Starter Generator</h2>
                </div>
                <p className="text-muted-foreground mb-5">Select your child's age group and a topic to get a tailored conversation script with opening lines, dos and don'ts, and follow-up questions.</p>
                <ConversationGenerator scripts={conversationScripts} />
              </div>

              <div className="border-t pt-8">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-5 h-5 text-pink-600" />
                  <h2 className="text-xl font-bold text-foreground">App Safety Reviews</h2>
                </div>
                <p className="text-muted-foreground mb-5">Detailed safety reviews of popular apps and platforms your child may use. Filter by region to see locally relevant platforms.</p>
                <AppSafetyReview apps={appSafetyCards} />
              </div>

              <div className="border-t pt-8">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-bold text-foreground">ISP Parental Control Guides</h2>
                </div>
                <p className="text-muted-foreground mb-5">Step-by-step instructions for setting up parental controls at the internet provider level. These controls apply to all devices on your home network.</p>
                <ISPControlGuides guides={ispGuides} />
              </div>
            </TabsContent>

            <TabsContent value="legal" className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-foreground">Children's Online Privacy Laws</h2>
              </div>
              <p className="text-muted-foreground mb-5">Know your rights as a parent. These laws protect your child's personal data online. Each entry includes practical actions you can take and a quick knowledge check.</p>
              <LegalAwarenessModule laws={legalInfoData} />
            </TabsContent>

            <TabsContent value="stats" className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-foreground">Family Cybersecurity Statistics</h2>
                </div>
                <p className="text-muted-foreground mb-5">Key statistics every parent should know about children's online safety.</p>
                <FamilyStatsInfographic stats={familyStats} />
              </div>

              <div className="border-t pt-8">
                <MicroTransactionAwareness stats={microTransactionStats} />
              </div>
            </TabsContent>
          </Tabs>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      Child Safety Conversation Scanner
                    </h3>
                    <Badge className="bg-purple-500">NEW</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Analyze online conversations for warning signs. Get instant risk assessment with emergency reporting resources.
                  </p>
                </div>
                <Link href="/parents/child-safety-scanner">
                  <Button className="bg-purple-600 rounded-full" data-testid="button-child-safety-scanner">
                    <Shield className="w-4 h-4 mr-2" />
                    Open Scanner
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border border-teal-200 dark:border-teal-800">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Kids Digital Safety Hub
                  </h3>
                  <p className="text-muted-foreground">
                    Interactive lessons designed for children ages 8 to 16. Learn together with your kids.
                  </p>
                </div>
                <Link href="/kids">
                  <Button variant="outline" className="border-teal-300 dark:border-teal-700 rounded-full" data-testid="button-kids-hub">
                    Visit Kids Hub
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function TopicContent({
  topic,
  onBack
}: {
  topic: ParentTopic;
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
            How to Start the Conversation
          </h3>
          <ul className="space-y-3">
            {topic.content.conversationStarters.map((starter, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-purple-500 font-bold text-lg leading-none mt-0.5">"</span>
                <span className="text-purple-700 dark:text-purple-300 italic leading-relaxed">{starter}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={onBack} variant="outline" className="rounded-full" data-testid="button-explore-more">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            All Family Guides
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

export default function Parents() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState("guides");

  const currentTopic = selectedTopic
    ? parentTopics.find(t => t.id === selectedTopic)
    : null;

  const parentsFaqSchema: FAQData = {
    type: "FAQPage",
    items: parentTopics.map(topic => ({
      question: `How can I help my child with ${topic.title.toLowerCase()}?`,
      answer: topic.content.intro,
    })),
  };

  const parentsBreadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Parents", url: "https://www.getcyberright.com/parents" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[parentsFaqSchema, parentsBreadcrumbs]} />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        {currentTopic ? (
          <TopicContent
            topic={currentTopic}
            onBack={() => setSelectedTopic(null)}
          />
        ) : (
          <ParentsLanding onSelectTopic={setSelectedTopic} onSwitchTab={setActiveMainTab} />
        )}
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground py-4">
          <CalendarDays className="w-3 h-3" />
          <span>Content last reviewed: February 2026</span>
        </div>
      </main>

      <RelatedResources
        title="More Family Safety Resources"
        subtitle="Tools and guides to protect every member of your family."
        resources={[
          RESOURCE_LINKS.kidsHub,
          RESOURCE_LINKS.parentalControlsGuide,
          RESOURCE_LINKS.scamChecker,
          RESOURCE_LINKS.trainingAcademy,
          RESOURCE_LINKS.passwordGuide,
          RESOURCE_LINKS.emergencyHelp,
        ]}
      />

      <Footer />
    </div>
  );
}
