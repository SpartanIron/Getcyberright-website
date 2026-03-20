import { useState } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import type { FAQData, BreadcrumbData } from "@/components/structured-data";
import {
  Shield, Eye, MessageCircle, Gamepad2,
  CheckCircle, Users, AlertTriangle,
  ArrowRight, Settings, Clock, BookOpen,
  CalendarDays, ChevronDown, ChevronUp
} from "lucide-react";
import bannerImage from "@/assets/banners/parents-banner.png";
import cardParentalControls from "@/assets/images/card-parental-controls.png";
import cardSocialMedia from "@/assets/images/card-social-media-safety.png";
import cardScreenTime from "@/assets/images/card-screen-time.png";
import cardGamingSafety from "@/assets/images/card-gaming-safety.png";
import cardOnlinePredators from "@/assets/images/card-online-predators.png";
import cardFirstDevice from "@/assets/images/card-first-device.png";

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
    image: cardParentalControls,
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
    image: cardSocialMedia,
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
    image: cardScreenTime,
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
    image: cardGamingSafety,
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
            "Under Contact Settings, set each option to No One or Friends. This controls who can message, chat, and invite your child.",
            "Under Other Settings, turn off Chat to disable in-game text chat entirely (recommended for younger children).",
            "Go to Settings, then Parental Controls. Turn on Account Restrictions. This limits your child to a curated list of age-appropriate games only.",
            "Set a monthly spending limit or remove the ability to purchase Robux. Go to Settings, then Billing. Make sure no payment method is saved.",
            "Set a PIN: go to Settings, then Security, then Account PIN. This prevents your child from changing any parental control settings.",
            "Roblox has an Age Verification system. Games rated 17+ are only available to verified users. Make sure your child's account birthday is accurate."
          ]
        }
      ],
      quickChecklist: [
        "Parental controls are set up on every gaming device and platform.",
        "Voice and text chat with strangers is restricted or disabled.",
        "In-game purchases require my approval or have a spending cap.",
        "Game age ratings are set to match my child's age.",
        "I know what games my child plays and have tried at least one.",
        "Play time limits are set with a clear end-of-time behavior."
      ],
      conversationStarters: [
        "Tell me about the game you are playing. What do you like about it?",
        "Do you ever talk to people you don't know while gaming?",
        "Has anyone ever said something mean or made you uncomfortable in a game?"
      ],
      warningSign: "If your child becomes secretive about who they play with online, resists any conversation about gaming habits, or you notice unfamiliar charges on your account, it is time for a direct conversation."
    }
  },
  {
    id: "online-predators",
    title: "Protecting Against Online Predators",
    description: "Recognize grooming behaviors and know exactly what to do.",
    icon: AlertTriangle,
    color: "bg-red-500",
    image: cardOnlinePredators,
    content: {
      intro: "Online predators use technology to target and manipulate children. They often spend weeks or months building trust before attempting to exploit. Understanding the tactics they use and maintaining open communication with your child are the strongest defenses. This guide covers what to watch for and exactly what to do if something happens.",
      keyPoints: [
        "Predators often pose as peers. They create fake profiles, use young-sounding language, and claim to be the same age.",
        "Grooming follows a pattern: they select a target, build trust through flattery and gifts, isolate the child from parents, then push boundaries.",
        "Secrecy is the biggest warning sign. Predators will say things like 'Don't tell your parents, they wouldn't understand.'",
        "Any adult asking a child to keep secrets from parents is a red flag, regardless of context.",
        "Children often blame themselves and fear getting in trouble, which keeps them silent. Make it clear they will never be punished for telling you."
      ],
      platformGuides: [
        {
          platform: "Warning Signs to Watch For",
          steps: [
            "Your child receives gifts, game credits, or online currency from someone you don't know.",
            "They become secretive about who they are talking to online.",
            "They switch screens or close apps quickly when you walk by.",
            "An older person or someone you don't recognize contacts them through social media, games, or messaging apps.",
            "They mention a new 'friend' who 'really understands them' but whom they have never met in person.",
            "They receive messages late at night from someone you don't know.",
            "They start using sexual language or have knowledge beyond their age."
          ]
        },
        {
          platform: "Immediate Steps If You Suspect Contact",
          steps: [
            "Stay calm. If you react with anger or panic, your child may shut down and stop sharing.",
            "Tell your child clearly: 'This is not your fault. You are not in trouble. I need to know what happened so I can protect you.'",
            "Do not delete any messages or conversations. Take screenshots of everything as evidence.",
            "Block the person on all platforms your child uses.",
            "Report to the platform: every social media service and gaming platform has a reporting tool for predatory behavior. Use it.",
            "File a report with the National Center for Missing and Exploited Children (NCMEC) at CyberTipline.org.",
            "In the United States, report to the FBI at tips.fbi.gov. In the UK, report to CEOP at ceop.police.uk. In other countries, contact your national cybercrime reporting center.",
            "If your child is in immediate danger, call your local emergency number (911 in the US, 999 in the UK, 112 in Europe).",
            "Consider professional counseling for your child. Organizations like NCMEC can provide referrals."
          ]
        },
        {
          platform: "How to Lock Down Every Platform",
          steps: [
            "On every social media platform: set the account to Private and disable direct messages from strangers (see the Social Media Safety guide above for step-by-step instructions).",
            "In games: disable voice chat and text chat with strangers. Use the platform-specific steps in the Gaming Safety guide above.",
            "On messaging apps (WhatsApp, Telegram, Discord): set it so only contacts can message your child. In Discord, go to Settings, then Privacy & Safety, then turn off Allow Direct Messages from Server Members.",
            "Review your child's friend lists and followers regularly. Ask about anyone you don't recognize.",
            "Turn off location sharing on all apps. In Instagram: Settings, then Privacy, then Activity Status (turn off). In Snapchat: turn on Ghost Mode.",
            "Know the apps on your child's device. Some apps are specifically designed for anonymous communication (Whisper, Yik Yak, Omegle). These should not be on a child's device."
          ]
        }
      ],
      quickChecklist: [
        "My child knows they will never be punished for telling me about uncomfortable online interactions.",
        "All social media accounts are Private with messages from strangers disabled.",
        "Voice chat with strangers is turned off in games.",
        "I know who my child's online friends are.",
        "I know how to report to NCMEC, the FBI, or my country's cybercrime center.",
        "I have had the conversation about secrets: real friends never ask you to hide things from your parents."
      ],
      conversationStarters: [
        "You can tell me anything and you will never be in trouble for being honest with me.",
        "Has anyone online ever asked you to keep a secret from me?",
        "What would you do if someone online made you feel uncomfortable?"
      ],
      warningSign: "If your child suddenly becomes withdrawn, anxious, or upset after using their device, do not dismiss it. Sit down calmly and ask open-ended questions. The most important thing is that they know the door is always open."
    }
  },
  {
    id: "digital-footprint",
    title: "Building a Positive Digital Footprint",
    description: "Teach your child that what goes online stays online. Here is how to protect them.",
    icon: Eye,
    color: "bg-teal-500",
    image: cardFirstDevice,
    content: {
      intro: "Everything posted online creates a trail. Photos, comments, likes, and even deleted posts can be screenshotted and saved. Colleges, employers, and scholarship committees regularly search applicants online. Teaching your child to think before they post is one of the most valuable digital skills you can give them.",
      keyPoints: [
        "Deleted does not mean gone. Screenshots, cached pages, and platform backups can preserve content indefinitely.",
        "59% of hiring managers in the U.S. have rejected a candidate based on their social media presence.",
        "A positive digital footprint can actually help. Sharing achievements, volunteer work, and creative projects builds a reputation.",
        "Metadata in photos (location, time, device information) can reveal more than the image itself.",
        "Group photos and tagged posts mean your child's image can appear online without their consent."
      ],
      platformGuides: [
        {
          platform: "Privacy Audit (Do This Today)",
          steps: [
            "Search your child's full name on Google. Look at the results together and discuss what comes up.",
            "Search their name on Google Images to see if any photos have been indexed.",
            "Check their social media profiles from a logged-out browser (private/incognito window) to see what strangers can see.",
            "On Instagram: go to Settings, then Account, then Posts You've Liked to review their activity history.",
            "On TikTok: check their Liked Videos (visible to others by default unless turned off in Privacy settings).",
            "On YouTube: check their comment history and liked videos. Delete anything concerning.",
            "Review any old accounts they no longer use. Deactivate or delete them."
          ]
        },
        {
          platform: "The Posting Rules",
          steps: [
            "The Grandma Rule: Don't post anything you wouldn't want your grandmother to read out loud at dinner.",
            "The Screenshot Rule: Before posting, assume everyone will see it, including teachers, coaches, and future employers.",
            "The Permanence Rule: Even if you delete it in 10 seconds, someone may have already saved it.",
            "The Context Rule: Jokes and sarcasm do not always translate online. What seems funny to you may look offensive to others.",
            "The Consent Rule: Never post photos or videos of other people without their permission.",
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

function ParentsLanding({ onSelectTopic }: { onSelectTopic: (id: string) => void }) {
  return (
    <>
      <PageBanner
        title="Protect Your Family Online"
        subtitle="Step-by-step guides for every device, every platform, and every age. Built for parents who want clear answers, not tech jargon."
        imageSrc={bannerImage}
        imageAlt="Family learning about digital safety together"
        colorVariant="blue"
      />

      <div className="py-16 sm:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6 mb-12">
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
      <div className="bg-[#0A2A3C] py-10 sm:py-14">
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
      <SEOHead {...pageSEO.parents} />
      <StructuredData data={[parentsFaqSchema, parentsBreadcrumbs]} />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        {currentTopic ? (
          <TopicContent
            topic={currentTopic}
            onBack={() => setSelectedTopic(null)}
          />
        ) : (
          <ParentsLanding onSelectTopic={setSelectedTopic} />
        )}
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground py-4">
          <CalendarDays className="w-3 h-3" />
          <span>Content last reviewed: February 2026</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
