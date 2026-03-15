import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import kidsBannerImage from "@/assets/images/kids-safety-banner.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, Lock, Eye, MessageCircle, Gamepad2, Users, 
  CheckCircle, Star, Trophy, BookOpen, Heart, 
  Smartphone, AlertCircle, ThumbsUp, ArrowRight,
  GraduationCap, Home, Lightbulb, Target, Sparkles,
  CalendarDays, ChevronDown, ChevronUp
} from "lucide-react";

import kidsYoungLearnersImg from "@/assets/images/kids-young-learners.png";
import kidsTeenLearnersImg from "@/assets/images/kids-teen-learners.png";
import kidsSpotScamImg from "@/assets/images/kids-spot-scam.png";
import kidsFamilyTogetherImg from "@/assets/images/kids-family-together.png";
import kidsPersonalInfoImg from "@/assets/images/kids-personal-info.png";
import kidsPasswordPowerImg from "@/assets/images/kids-password-power.png";
import kidsSpottingTricksImg from "@/assets/images/kids-spotting-tricks.png";
import kidsDeviceSafetyImg from "@/assets/images/kids-device-safety.png";
import kidsTrustedAdultsImg from "@/assets/images/kids-trusted-adults.png";
import kidsSocialMediaImg from "@/assets/images/kids-social-media.png";
import kidsCyberbullyingImg from "@/assets/images/kids-cyberbullying.png";
import kidsGamingSmartImg from "@/assets/images/kids-gaming-smart.png";
import kidsPhishingImg from "@/assets/images/kids-phishing.png";
import kidsDigitalFootprintImg from "@/assets/images/kids-digital-footprint.png";

// Floating decorative shapes component for kid-friendly design
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle decorative circles - no animation for cleaner look */}
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-teal-300/15 dark:bg-teal-500/10" />
      <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-purple-300/15 dark:bg-purple-500/10" />
      <div className="absolute bottom-32 left-1/4 w-12 h-12 rounded-full bg-pink-300/15 dark:bg-pink-500/10" />
      <div className="absolute bottom-20 right-1/3 w-20 h-20 rounded-full bg-blue-300/15 dark:bg-blue-500/10" />
      
      {/* Single subtle star */}
      <div className="absolute top-32 left-1/3 text-yellow-400/30 dark:text-yellow-500/15">
        <Star className="w-8 h-8 fill-current" />
      </div>
    </div>
  );
}

type AgeGroup = "8-11" | "12-16" | null;
type ActiveModule = string | null;

interface PlatformGuide {
  platform: string;
  steps: string[];
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
  color: string;
  image: string;
  content: {
    intro: string;
    tips: string[];
    remember: string;
    platformGuides?: PlatformGuide[];
    checklist?: string[];
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const foundationsModules: LearningModule[] = [
  {
    id: "personal-info",
    title: "What is Personal Information?",
    description: "Learn what information to keep private online.",
    icon: Eye,
    color: "bg-blue-500",
    image: kidsPersonalInfoImg,
    content: {
      intro: "Personal information is anything that tells people who you are or where to find you. Just like you would not give your house key to a stranger, you should not share personal details online with people you do not know.",
      tips: [
        "Your full name, address, and phone number are private. These are things only trusted adults need to know.",
        "Never share your school name, what team you play on, or where you hang out after school.",
        "Do not tell anyone your passwords, not even your best friend. Passwords are just for you and your parents.",
        "Photos can reveal where you are. Check the background of photos before sharing. Look for street signs, school logos, or house numbers.",
        "Ask a trusted adult before filling out any online forms. Even fun quizzes can collect personal information.",
        "Your birthday is personal information too. Do not share the full date online because it can be used to access accounts.",
        "Location features on apps can show people exactly where you are. Ask a parent to turn these off on your devices.",
        "If a website or game asks for your real name, use a nickname or ask your parent what to enter instead."
      ],
      remember: "If someone online asks for personal information, tell a trusted adult right away. Real friends and safe websites will never pressure you to share private details.",
      checklist: [
        "I know the difference between personal and non-personal information.",
        "My online accounts do not show my real full name.",
        "I have checked that my photos do not reveal my location.",
        "I always ask a trusted adult before filling out forms online.",
        "Location sharing is turned off on my devices.",
        "I never share my birthday, address, or phone number online."
      ]
    },
    quiz: {
      question: "Which of these is safe to share with someone you met online?",
      options: [
        "Your home address",
        "Your favorite color",
        "Your school name",
        "Your phone number"
      ],
      correctIndex: 1,
      explanation: "Your favorite color is safe to share because it does not reveal where you are or how to find you. Your address, school, and phone number should stay private."
    }
  },
  {
    id: "password-basics",
    title: "Password Power",
    description: "Create strong passwords that keep you safe.",
    icon: Lock,
    color: "bg-purple-500",
    image: kidsPasswordPowerImg,
    content: {
      intro: "Passwords are like secret codes that protect your accounts. A strong password keeps your games, photos, and messages safe from people who should not see them.",
      tips: [
        "Use at least 8 characters in your password. Longer is even better.",
        "Try the three random words method: pick three unrelated words and put them together, like SunFlowerRainTiger.",
        "Add a number or two between your words to make it even stronger, like Sun7Flower9Rain.",
        "Never use your name, birthday, pet's name, or your favorite sports team. These are too easy to guess.",
        "Do not share your password with friends. Even best friends can accidentally share it with others.",
        "Use a different password for every account. If someone figures out one, the rest stay safe.",
        "Write your passwords down in a notebook kept in a safe place at home, never on your device or in your backpack.",
        "If you think someone knows your password, change it right away and tell a trusted adult.",
        "When you need to change a password, do not just add a number to the end. Create a whole new one."
      ],
      remember: "A good password is like a secret superhero code. Make it long, make it tricky, and keep it to yourself.",
      checklist: [
        "My passwords are at least 8 characters long.",
        "I do not use my name, birthday, or pet's name in any password.",
        "I use different passwords for different accounts.",
        "I have not shared my passwords with any friends.",
        "My passwords are written in a safe place only my parents and I know about.",
        "I know how to change my password if I need to."
      ]
    },
    quiz: {
      question: "Which password is the strongest?",
      options: [
        "password123",
        "MyDogSpot",
        "Sun7Flower9Rain",
        "12345678"
      ],
      correctIndex: 2,
      explanation: "Sun7Flower9Rain is the strongest because it mixes words with numbers and is hard to guess. The others are too simple or use common words."
    }
  },
  {
    id: "spotting-tricks",
    title: "Spotting Online Tricks",
    description: "Learn to recognize when something seems wrong.",
    icon: AlertCircle,
    color: "bg-orange-500",
    image: kidsSpottingTricksImg,
    content: {
      intro: "Some people online try to trick kids. They might pretend to be someone they are not or offer things that seem too good to be true. Learning to spot these tricks keeps you safe.",
      tips: [
        "If someone offers free games, prizes, or gift cards, it is almost always a trick to get your information.",
        "Pop-ups that say you won something are not real. Real prizes do not come from random pop-ups on websites.",
        "Strangers who want to be your best friend right away and ask lots of questions may not be safe.",
        "Messages asking you to click strange links could put harmful software on your device. Do not click them.",
        "If something feels wrong, it probably is. Trust your gut feeling and walk away.",
        "Check the website address (URL) carefully. Fake websites often have misspelled names or extra letters.",
        "Scary messages that say your device has a virus are usually fake. Close the window without clicking anything.",
        "To close a fake pop-up safely, do not click the X on the pop-up itself. Instead, close the whole browser tab or window.",
        "If you accidentally clicked something suspicious, tell a trusted adult right away. The sooner the better."
      ],
      remember: "When in doubt, do not click. Ask a parent or trusted adult to help you figure out if something is real or a trick.",
      checklist: [
        "I know that free prize offers online are usually tricks.",
        "I know how to close a fake pop-up without clicking on it.",
        "I check website addresses for misspellings before entering information.",
        "I do not click on links in messages from people I do not know.",
        "I tell a trusted adult when something online seems suspicious.",
        "I know the difference between real warnings and fake scary messages."
      ]
    },
    quiz: {
      question: "You see a pop-up that says you won a free gaming console. What should you do?",
      options: [
        "Click it right away to claim your prize",
        "Enter your address so they can send it",
        "Close it and tell a trusted adult",
        "Share the link with friends so they can win too"
      ],
      correctIndex: 2,
      explanation: "Close it and tell a trusted adult. These pop-ups are almost always tricks to get your personal information or put harmful software on your device."
    }
  },
  {
    id: "device-safety",
    title: "Taking Care of Your Devices",
    description: "Keep your phone, tablet, and computer safe.",
    icon: Smartphone,
    color: "bg-teal-500",
    image: kidsDeviceSafetyImg,
    content: {
      intro: "Your devices are valuable tools for learning and fun. Taking care of them means keeping them physically safe and making sure the information on them stays protected.",
      tips: [
        "Always lock your device with a PIN, password, or fingerprint. This keeps others from getting into your stuff.",
        "To set a lock screen PIN: go to your device's Settings, look for Security or Lock Screen, and choose a PIN that is at least 6 numbers.",
        "Only download apps your parents have approved. Before downloading, show the app to your parent and let them check it.",
        "To check if an app is safe: look at the number of downloads and reviews. Apps with very few downloads or bad reviews may not be safe.",
        "Keep your device updated when it asks you to. Updates fix problems and keep your device secure. Ask a parent to help you update.",
        "Do not click on links or ads you do not recognize. They could download harmful software onto your device.",
        "If your device starts acting strange, like running slowly, showing pop-ups, or opening things by itself, tell a parent right away.",
        "Never leave your device unlocked and unattended. Always lock it before you walk away, even at home."
      ],
      remember: "Treat your device like a treasure. Lock it up, keep it clean, and only let trusted things inside.",
      checklist: [
        "My device has a lock screen PIN, password, or fingerprint set up.",
        "I only download apps my parents have approved.",
        "My device is up to date with the latest updates.",
        "I know not to click on ads or links I do not recognize.",
        "I lock my device before walking away from it.",
        "I know to tell a parent if my device starts acting strange."
      ]
    },
    quiz: {
      question: "What should you do before downloading a new app?",
      options: [
        "Download it right away if it looks fun",
        "Ask a parent or trusted adult first",
        "Share it with all your friends",
        "Give it your email address"
      ],
      correctIndex: 1,
      explanation: "Always ask a parent or trusted adult before downloading new apps. They can help make sure the app is safe and appropriate for you."
    }
  },
  {
    id: "trusted-adults",
    title: "Talking to Trusted Adults",
    description: "Know who to ask for help and when.",
    icon: Heart,
    color: "bg-pink-500",
    image: kidsTrustedAdultsImg,
    content: {
      intro: "Trusted adults are people who care about you and want to keep you safe. They can be parents, grandparents, teachers, or other family members you know well. You can always go to them when something online makes you uncomfortable.",
      tips: [
        "Make a list of at least three trusted adults you can talk to. Include people at home and at school.",
        "You will never get in trouble for asking for help. Your adults want to know when something is wrong.",
        "Tell an adult if someone online makes you uncomfortable, even if it seems small.",
        "Share anything that confuses or scares you online. There is no silly question when it comes to safety.",
        "Adults want to help you stay safe, not punish you. They are on your team.",
        "If something bad happens online, take a screenshot first. This helps your trusted adult understand what happened.",
        "To take a screenshot: on most devices, press the power button and volume down button at the same time.",
        "Practice what you would say: try saying 'Something happened online and I need your help looking at it.' This makes it easier when you really need to say it."
      ],
      remember: "No question is too small and no worry is too silly. Your trusted adults are on your team.",
      checklist: [
        "I have a list of at least three trusted adults I can talk to.",
        "I know how to take a screenshot on my device.",
        "I have practiced what I would say if I needed help.",
        "I know that I will not get in trouble for telling a trusted adult about something online.",
        "I know where to find my trusted adults when I need them."
      ]
    },
    quiz: {
      question: "Someone online said something that made you feel uncomfortable. What should you do?",
      options: [
        "Keep it a secret so you do not get in trouble",
        "Reply to them and tell them to stop",
        "Tell a trusted adult what happened",
        "Just ignore it and hope it goes away"
      ],
      correctIndex: 2,
      explanation: "Tell a trusted adult what happened. You will never get in trouble for reporting something that made you uncomfortable. Adults are there to help keep you safe."
    }
  }
];

const smartSafeModules: LearningModule[] = [
  {
    id: "social-media-safety",
    title: "Smart Social Media Use",
    description: "Navigate social platforms safely and wisely.",
    icon: MessageCircle,
    color: "bg-blue-600",
    image: kidsSocialMediaImg,
    content: {
      intro: "Social media can be a great way to connect with friends and share your interests. But it is important to use it wisely. What you post online can stay there forever and be seen by more people than you expect.",
      tips: [
        "Set your accounts to private so only approved followers see your posts.",
        "Think before you post. Would you be okay if a teacher, coach, or college admissions officer saw this?",
        "Do not accept friend requests or follow requests from people you do not know in real life.",
        "Be kind in your comments. Treat others how you want to be treated. Mean comments can have real consequences.",
        "Take breaks from social media if it starts making you feel bad about yourself.",
        "Turn off direct messages from strangers. This prevents unknown people from contacting you privately.",
        "Never share your location in real time. Wait until you have left a place before posting about it.",
        "Review your followers and following lists regularly. Remove anyone you do not actually know."
      ],
      remember: "Your online reputation is part of your real reputation. Everything you share reflects who you are.",
      platformGuides: [
        {
          platform: "Making Your Account Private",
          steps: [
            "On Instagram: go to Settings and Privacy, then Account Privacy, and turn on Private Account.",
            "On TikTok: go to Settings and Privacy, then Privacy, and set your account to Private.",
            "On Snapchat: go to Settings, then Contact Me, and set it to My Friends. Also turn on Ghost Mode in Snap Map.",
            "On any platform: look for Privacy or Account Settings and switch from Public to Private or Friends Only.",
            "After making your account private, review your current followers and remove anyone you do not know."
          ]
        },
        {
          platform: "What to Do About Strangers",
          steps: [
            "If a stranger sends you a message, do not reply. Block them immediately.",
            "To block someone: go to their profile, tap the three dots or menu icon, and select Block.",
            "Report the account to the platform. Look for a Report option in the same menu where you found Block.",
            "Tell a trusted adult that a stranger tried to contact you, even if you already blocked them.",
            "Never agree to meet someone in person that you only know online."
          ]
        },
        {
          platform: "Before You Post",
          steps: [
            "The Screenshot Rule: before posting, assume someone will screenshot it and show it to everyone. Are you still okay with it?",
            "The Future Self Rule: imagine yourself five years from now. Would future you be proud of this post?",
            "Check the background of photos for personal details like your address, school name, or location.",
            "If you are posting about someone else, ask their permission first.",
            "If you are angry, upset, or emotional, wait at least one hour before posting anything."
          ]
        }
      ],
      checklist: [
        "All my social media accounts are set to Private.",
        "Direct messages from strangers are turned off.",
        "I have reviewed my followers and removed anyone I do not know.",
        "I think before every post using the Screenshot Rule and Future Self Rule.",
        "Location sharing is turned off on all my social apps.",
        "I know how to block and report someone on every platform I use."
      ]
    },
    quiz: {
      question: "Before posting a photo, what should you consider?",
      options: [
        "Just post it quickly before anyone notices",
        "Whether it could embarrass you or someone else later",
        "Only how many likes it might get",
        "Nothing, posts can always be deleted"
      ],
      correctIndex: 1,
      explanation: "Consider whether the photo could embarrass you or someone else later. Even deleted posts can be screenshotted and shared, so think carefully before posting."
    }
  },
  {
    id: "cyberbullying",
    title: "Understanding Online Bullying",
    description: "Recognize bullying and know how to respond.",
    icon: Users,
    color: "bg-red-500",
    image: kidsCyberbullyingImg,
    content: {
      intro: "Online bullying, sometimes called cyberbullying, happens when someone uses technology to hurt, embarrass, or threaten others. It can happen through texts, social media, games, or any online platform. Knowing how to handle it helps you and your friends stay safe.",
      tips: [
        "Do not respond to mean messages. Responding often makes things worse and gives the bully what they want.",
        "Save evidence by taking screenshots of hurtful messages. This proof helps adults take action.",
        "Block people who are being cruel to you on every platform where they can reach you.",
        "Tell a trusted adult about what is happening. You are not being a snitch. You are protecting yourself.",
        "Be an upstander, not a bystander. If you see someone being bullied, support them and report it.",
        "Remember that online bullying is never your fault. No matter what anyone says, you do not deserve it.",
        "If the bullying is happening at school, report it to a teacher or school counselor. Most schools have anti-bullying policies.",
        "Take care of your mental health. It is okay to take a break from social media or games if they are making you feel bad."
      ],
      remember: "Online bullying is never your fault. No one deserves to be treated badly. Speaking up takes courage and helps everyone.",
      platformGuides: [
        {
          platform: "If It Is Happening to You",
          steps: [
            "Do not respond to the bully. Do not reply, react, or engage in any way.",
            "Take screenshots of every hurtful message, post, or comment. Save them in a folder.",
            "Block the person on the platform where the bullying is happening.",
            "Report the content to the platform. On most apps, tap the three dots on the message or post and select Report.",
            "Tell a trusted adult what is happening. Show them the screenshots.",
            "If the bullying includes threats of violence, tell a parent immediately. They may need to contact school or police."
          ]
        },
        {
          platform: "If You See It Happening to Someone Else",
          steps: [
            "Support the person being bullied. Send them a kind private message letting them know you care.",
            "Do not like, share, or comment on bullying posts. This only spreads the harm.",
            "Report the bullying content to the platform, even if it is not about you.",
            "Tell a trusted adult that you saw someone being bullied online.",
            "If you feel safe doing so, stand up publicly. Sometimes a simple 'That is not okay' can help."
          ]
        },
        {
          platform: "Getting Help",
          steps: [
            "Talk to a parent, guardian, or another trusted adult in your family.",
            "Tell a teacher or school counselor. They are trained to handle bullying situations.",
            "If you are in the United States, text HOME to 741741 to reach the Crisis Text Line.",
            "Visit StopBullying.gov for more resources and advice.",
            "Remember that asking for help is a sign of strength, not weakness."
          ]
        }
      ],
      checklist: [
        "I know not to respond to mean messages online.",
        "I know how to take screenshots to save evidence.",
        "I know how to block and report someone on the platforms I use.",
        "I have a trusted adult I can talk to about online bullying.",
        "I know how to support a friend who is being bullied.",
        "I know that online bullying is never my fault."
      ]
    },
    quiz: {
      question: "If someone is being mean to you online, what should you do first?",
      options: [
        "Send them a mean message back",
        "Do not respond, save evidence, and tell a trusted adult",
        "Create a new account to respond anonymously",
        "Just delete your account and give up"
      ],
      correctIndex: 1,
      explanation: "Do not respond, save evidence, and tell a trusted adult. Responding to bullies often makes things worse, but keeping evidence and getting help can stop the bullying."
    }
  },
  {
    id: "gaming-safety",
    title: "Gaming Smart",
    description: "Stay safe while having fun in online games.",
    icon: Gamepad2,
    color: "bg-green-600",
    image: kidsGamingSmartImg,
    content: {
      intro: "Online gaming is fun, but it comes with some risks. Some players are not who they say they are, and some games try to get you to spend money. Knowing how to game safely means you can enjoy playing while protecting yourself.",
      tips: [
        "Use a gaming name (gamertag) that does not reveal your real name, age, location, or school.",
        "Never share personal information with other players, even ones who seem friendly.",
        "Be careful about in-game purchases. Virtual currency like V-Bucks and Robux costs real money. Always ask a parent first.",
        "Mute or block players who are being rude, using bad language, or making you uncomfortable.",
        "Take regular breaks and balance gaming with other activities like sports, reading, and spending time with friends.",
        "Be skeptical of free item offers. Messages saying 'Free V-Bucks' or 'Free Robux' are almost always scams.",
        "Never download mods or hacks from unknown websites. They often contain harmful software.",
        "If someone in a game makes you feel uncomfortable or asks to talk outside the game, tell a trusted adult."
      ],
      remember: "Real gaming skills do not require sharing personal info. Stay anonymous and stay safe while having fun.",
      platformGuides: [
        {
          platform: "Setting Up a Safe Gaming Profile",
          steps: [
            "Choose a username that does not include your real name, birth year, or location. Use something creative and fun instead.",
            "On PlayStation: go to Settings, then Account Management, then Privacy Settings. Set your profile to Friends Only.",
            "On Xbox: go to Settings, then Account, then Privacy and Online Safety. Set communication to Friends Only.",
            "On Nintendo Switch: use the Nintendo Switch Parental Controls app to set communication restrictions.",
            "On Roblox: go to Settings, then Privacy. Set each option to Friends or No One.",
            "On PC (Steam, Epic, etc.): go to your Profile Settings and set your profile to Friends Only.",
            "Never use a real photo of yourself as your gaming profile picture."
          ]
        },
        {
          platform: "Dealing with Toxic Players",
          steps: [
            "If someone is being mean or rude, do not argue back. It rarely helps and usually makes things worse.",
            "Mute them: in most games, open the player list or scoreboard and select Mute next to their name.",
            "Block them: on PlayStation, go to their profile and select Block. On Xbox, select their gamertag and choose Block.",
            "Report them: most games have a Report Player option in the pause menu or player list. Use it.",
            "If someone threatens you with real-world violence, tell a parent immediately.",
            "Remember that toxic players are trying to make you upset. Muting them takes away their power."
          ]
        },
        {
          platform: "Safe In-Game Purchases",
          steps: [
            "Always ask a parent before buying anything in a game, even if it seems small.",
            "Check the real-world price before purchasing. 1000 V-Bucks costs about 8 real dollars.",
            "Watch out for tricks that pressure you to buy, like limited-time offers and countdown timers.",
            "Never enter your parent's credit card information without permission.",
            "Be wary of third-party websites selling cheap game currency. These are usually scams that steal your account."
          ]
        }
      ],
      checklist: [
        "My gaming username does not reveal my real name or personal details.",
        "My gaming profile is set to Friends Only on all platforms.",
        "I know how to mute, block, and report players on my gaming platforms.",
        "I always ask a parent before making in-game purchases.",
        "I do not download mods or hacks from unknown websites.",
        "I take regular breaks from gaming."
      ]
    },
    quiz: {
      question: "Someone in an online game asks for your real name and where you live. What should you do?",
      options: [
        "Tell them because they seem friendly",
        "Trade personal info for in-game items",
        "Politely decline and only share your game name",
        "Give them fake information to trick them"
      ],
      correctIndex: 2,
      explanation: "Politely decline and only share your game name. Real friends in games do not need to know your personal details. Keep your real identity private."
    }
  },
  {
    id: "fake-messages",
    title: "Spotting Fake Messages",
    description: "Identify trick messages designed to steal information.",
    icon: AlertCircle,
    color: "bg-orange-600",
    image: kidsPhishingImg,
    content: {
      intro: "Sometimes scammers send fake messages that look real to trick you into giving up passwords or personal information. These can come as emails, texts, or messages in apps. Scammers have become very good at making these look legitimate.",
      tips: [
        "Check the sender's email address carefully. Fake emails often come from addresses with misspellings, like support@amaz0n.com instead of support@amazon.com.",
        "Be suspicious of urgent messages saying your account will be closed or you will lose something unless you act right now.",
        "Do not click links in unexpected messages. Instead, open the real app or website directly by typing the address yourself.",
        "Look for spelling and grammar mistakes in messages. Real companies usually do not make these errors.",
        "Hover over links (without clicking) to see where they really go. On a phone, press and hold the link to preview it.",
        "Never enter your password on a page you reached by clicking a link in a message. Always go directly to the website.",
        "If a message offers something too good to be true, like free items or money, it is almost certainly a scam.",
        "When in doubt, ask a parent or trusted adult before clicking anything."
      ],
      remember: "Legitimate companies will never ask for your password through email or messages. When something seems urgent or too good to be true, slow down and verify.",
      platformGuides: [
        {
          platform: "Checking a Suspicious Email",
          steps: [
            "Look at the sender's email address. Click on the name to see the full address. Is it from the real company?",
            "Check for spelling mistakes in the email address. Scammers use addresses like paypa1@email.com (with a number 1 instead of the letter l).",
            "Read the email carefully. Does it use your real name, or does it say 'Dear User' or 'Dear Customer'?",
            "Hover over any links without clicking. Does the link address match the company it claims to be from?",
            "Look for pressure language like 'Act now!' or 'Your account will be deleted in 24 hours!' Real companies do not threaten you.",
            "If you are unsure, do not click anything. Open a new browser window and go directly to the real website."
          ]
        },
        {
          platform: "Suspicious Message in an App",
          steps: [
            "If you get a message from someone you do not know in an app, do not click any links in it.",
            "Check the sender's profile. Is it a real person? New accounts with no posts or friends are red flags.",
            "If someone claims to be from the app's support team and asks for your password, it is a scam. Support teams never ask for passwords through messages.",
            "Report the message using the app's report feature. Usually tap and hold the message, then select Report.",
            "Block the sender so they cannot message you again."
          ]
        },
        {
          platform: "What to Do If You Clicked",
          steps: [
            "Do not panic. Tell a trusted adult right away about what happened.",
            "If you entered a password on a suspicious page, change that password immediately.",
            "If you use the same password on other accounts, change those too.",
            "Check your accounts for anything strange, like messages you did not send or purchases you did not make.",
            "Ask your parent to run a security scan on your device.",
            "Learn from it. Now you know what to look for next time."
          ]
        }
      ],
      checklist: [
        "I know how to check a sender's real email address.",
        "I do not click links in unexpected messages.",
        "I know how to hover over a link to check where it goes.",
        "I recognize pressure language as a red flag.",
        "I know to go directly to websites instead of clicking links in emails.",
        "I know what to do if I accidentally click a suspicious link."
      ]
    },
    quiz: {
      question: "You get an email saying your gaming account will be deleted unless you click a link right now. What should you do?",
      options: [
        "Click the link immediately to save your account",
        "Reply with your password to prove it is you",
        "Do not click, and log into your account directly through the app or website",
        "Forward it to all your friends so they know about the problem"
      ],
      correctIndex: 2,
      explanation: "Do not click, and log into your account directly through the app or website. Real companies do not ask you to click urgent links. Always go directly to the official site to check your account."
    }
  },
  {
    id: "digital-footprint",
    title: "Your Digital Footprint",
    description: "Understand how your online actions follow you.",
    icon: Target,
    color: "bg-purple-600",
    image: kidsDigitalFootprintImg,
    content: {
      intro: "Your digital footprint is the trail of information you leave behind online. Every post, comment, photo, and search adds to it. This footprint can be seen by friends, family, schools, and even future employers. Managing it wisely is an important life skill.",
      tips: [
        "Search your own name on Google to see what others can find about you. Do this regularly.",
        "Think about how posts might look to a future college admissions officer or employer.",
        "Remember that screenshots last forever. Even if you delete a post, someone may have already saved it.",
        "Be intentional about building a positive online presence. Share achievements, creative projects, and things you are proud of.",
        "Review your privacy settings on all platforms at least once a month.",
        "Be careful about what others tag you in. Review tagged photos and posts and remove tags on anything you do not want associated with you.",
        "Old accounts you no longer use still have your information. Delete or deactivate accounts you do not need anymore.",
        "Everything you like, comment on, and share contributes to your digital footprint, not just your own posts."
      ],
      remember: "Your digital footprint is part of your personal brand. Make it something you are proud of.",
      platformGuides: [
        {
          platform: "Checking Your Footprint",
          steps: [
            "Open a private or incognito browser window. Search your full name on Google.",
            "Look at the results. Are there photos, posts, or accounts you did not expect?",
            "Search your name on Google Images to see if any photos of you have been indexed.",
            "Check your social media profiles from a logged-out browser to see what strangers can see.",
            "Review your comment history on platforms like YouTube, TikTok, and Reddit."
          ]
        },
        {
          platform: "Cleaning Up",
          steps: [
            "Go through your old posts on every platform. Delete anything you would not want a teacher or future employer to see.",
            "Remove tags from photos or posts that do not represent you well.",
            "Delete old accounts you no longer use. If you cannot delete them, change the profile information and make them private.",
            "On Instagram: go to Your Activity, then Photos and Videos, then Posts to review and delete old posts.",
            "On TikTok: go to your profile, review your videos, and delete any you no longer want public."
          ]
        },
        {
          platform: "Building a Good Reputation",
          steps: [
            "Share positive content: achievements, volunteer work, creative projects, and things you are learning.",
            "Be kind and thoughtful in every comment you make. Your comments are part of your footprint.",
            "Set your privacy settings so only friends can see personal posts, but consider keeping some positive posts public.",
            "Think of your online presence as a portfolio. What would you want someone to see?",
            "Review your privacy settings on all platforms at least once a month to make sure nothing has changed."
          ]
        }
      ],
      checklist: [
        "I have searched my own name on Google and reviewed the results.",
        "I have deleted or updated old posts I no longer want public.",
        "I have removed tags from photos I do not want associated with me.",
        "My privacy settings are up to date on all platforms.",
        "I have deleted or deactivated old accounts I no longer use.",
        "I am intentionally building a positive online presence."
      ]
    },
    quiz: {
      question: "What is true about your digital footprint?",
      options: [
        "Deleting posts erases them completely",
        "Only your friends can see your online activity",
        "Your online actions can affect real life opportunities",
        "It only includes things you post yourself"
      ],
      correctIndex: 2,
      explanation: "Your online actions can affect real life opportunities. Colleges and employers often search for applicants online, so what you post today can impact your future."
    }
  }
];

interface SpotTheScamItem {
  id: number;
  scenario: string;
  isScam: boolean;
  explanation: string;
}

const spotTheScamItems: SpotTheScamItem[] = [
  {
    id: 1,
    scenario: "A pop-up says you won a free iPhone and just need to enter your address to receive it.",
    isScam: true,
    explanation: "This is a scam. Real prizes do not come from random pop-ups. They want your personal information."
  },
  {
    id: 2,
    scenario: "Your school sends an email through the official school portal about a field trip next week.",
    isScam: false,
    explanation: "This is legitimate. Official school communications through known portals are typically safe."
  },
  {
    id: 3,
    scenario: "Someone you never met in a game offers to give you their account for free if you share your password.",
    isScam: true,
    explanation: "This is a scam. No one should ever need your password. They are trying to steal your account."
  },
  {
    id: 4,
    scenario: "Your grandmother video calls you using the app your family always uses.",
    isScam: false,
    explanation: "This is safe. A video call from a known family member through a trusted app is legitimate."
  },
  {
    id: 5,
    scenario: "An email claims your streaming account will be deleted in 24 hours unless you click a link to verify your password.",
    isScam: true,
    explanation: "This is a scam. Legitimate companies do not send urgent password requests via email. Log in directly through the official app."
  },
  {
    id: 6,
    scenario: "A friend at school shares a funny video link in person during lunch.",
    isScam: false,
    explanation: "This is likely safe. A friend you know in person sharing something face to face is different from online strangers."
  }
];

function KidsLanding({ onSelectAge }: { onSelectAge: (age: AgeGroup) => void }) {
  return (
    <div className="relative">
      {/* Colorful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 dark:from-teal-950/30 dark:via-purple-950/30 dark:to-pink-950/30" />
      
      <div className="relative py-12">
        <FloatingShapes />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-5 py-2.5 rounded-full mb-6 shadow-lg">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Kids Digital Safety Hub</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Learn to Stay Safe Online
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fun and easy lessons to help you become a smart and safe internet explorer. Choose your age group to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card 
              className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 border-teal-200 dark:border-teal-800 bg-white/80 dark:bg-card/80 backdrop-blur-sm"
              onClick={() => onSelectAge("8-11")}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelectAge("8-11"))}
              tabIndex={0}
              role="button"
              aria-label="Start learning for ages 8 to 11"
              data-testid="card-age-8-11"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={kidsYoungLearnersImg}
                  alt="Young children learning about internet safety together"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  data-testid="img-age-8-11"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 via-teal-800/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 text-white fill-current" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white drop-shadow-md">Ages 8 to 11</h3>
                      <p className="text-teal-100 text-sm font-medium">Foundations</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="text-center pt-5 pb-5">
                <p className="text-muted-foreground mb-4 text-sm">
                  Start your internet safety journey with fun lessons about passwords, personal information, and staying safe online.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">Beginner Friendly</Badge>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">5 Lessons</Badge>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Fun Quizzes</Badge>
                </div>
                <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 shadow-md" data-testid="button-start-8-11">
                  Start Learning <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-card/80 backdrop-blur-sm"
              onClick={() => onSelectAge("12-16")}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelectAge("12-16"))}
              tabIndex={0}
              role="button"
              aria-label="Start learning for ages 12 to 16"
              data-testid="card-age-12-16"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={kidsTeenLearnersImg}
                  alt="Teenagers confidently using devices with security shields"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  data-testid="img-age-12-16"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-purple-800/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white drop-shadow-md">Ages 12 to 16</h3>
                      <p className="text-purple-100 text-sm font-medium">Smart and Safe Online</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="text-center pt-5 pb-5">
                <p className="text-muted-foreground mb-4 text-sm">
                  Level up your digital skills with lessons on social media, gaming safety, spotting scams, and building a positive online reputation.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">Intermediate</Badge>
                  <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300">5 Lessons</Badge>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">Real Scenarios</Badge>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-md" data-testid="button-start-12-16">
                  Start Learning <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    For Parents and Educators
                  </h3>
                  <p className="text-muted-foreground">
                    Learn how this section works, what your kids will learn, and get conversation starters to discuss online safety together.
                  </p>
                </div>
                <Button variant="outline" className="border-blue-300 dark:border-blue-700" onClick={() => {
                  const element = document.getElementById('parent-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }} data-testid="button-parent-info">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Built for Learning, Not Data Collection</p>
                <p className="text-sm text-teal-600 dark:text-teal-400">
                  This section does not collect any personal information from children. No accounts required, no ads. Just safe learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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

function LearningTrack({ 
  ageGroup, 
  onBack,
  activeModule,
  setActiveModule,
  completedModules,
  setCompletedModules
}: { 
  ageGroup: AgeGroup;
  onBack: () => void;
  activeModule: ActiveModule;
  setActiveModule: (id: ActiveModule) => void;
  completedModules: string[];
  setCompletedModules: (modules: string[]) => void;
}) {
  const modules = ageGroup === "8-11" ? foundationsModules : smartSafeModules;
  const trackTitle = ageGroup === "8-11" ? "Foundations" : "Smart and Safe Online";
  const trackColor = ageGroup === "8-11" ? "teal" : "purple";

  const bgGradient = ageGroup === "8-11" 
    ? "from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950/30 dark:via-cyan-950/30 dark:to-blue-950/30"
    : "from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30";

  return (
    <div className="relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`} />
      <FloatingShapes />
      
      <div className="relative py-8">
        <div className="max-w-5xl mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="mb-6"
            data-testid="button-back-to-ages"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Age Selection
          </Button>

          <div className="mb-8 p-6 bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-xl border border-white/50 dark:border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`${trackColor === 'teal' ? 'bg-gradient-to-r from-teal-500 to-blue-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white shadow-md`}>
                Ages {ageGroup}
              </Badge>
              <div className="flex gap-1">
                {[...Array(completedModules.length)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{trackTitle}</h2>
            <p className="text-muted-foreground">
              Complete each lesson and quiz to earn your safety badges. You have completed {completedModules.length} of {modules.length} lessons.
            </p>
            
            <div className="mt-4 w-full bg-muted rounded-full h-4 overflow-hidden">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${trackColor === 'teal' ? 'bg-gradient-to-r from-teal-400 to-blue-500' : 'bg-gradient-to-r from-purple-400 to-pink-500'}`}
                style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
              />
            </div>
          </div>

        {activeModule ? (
          <ModuleContent 
            module={modules.find(m => m.id === activeModule)!}
            onComplete={() => {
              if (!completedModules.includes(activeModule)) {
                setCompletedModules([...completedModules, activeModule]);
              }
              setActiveModule(null);
            }}
            onBack={() => setActiveModule(null)}
            isCompleted={completedModules.includes(activeModule)}
          />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {modules.map((module, index) => {
                const isCompleted = completedModules.includes(module.id);
                return (
                  <Card 
                    key={module.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white/80 dark:bg-card/80 backdrop-blur-sm border-2 overflow-hidden ${isCompleted ? 'border-green-400 dark:border-green-600 ring-2 ring-green-200 dark:ring-green-800' : 'border-white/50 dark:border-white/10'}`}
                    onClick={() => setActiveModule(module.id)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setActiveModule(module.id))}
                    tabIndex={0}
                    role="button"
                    aria-label={`Start lesson: ${module.title}`}
                    data-testid={`card-module-${module.id}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={module.image}
                        alt={module.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent`} />
                      {isCompleted && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white rounded-full px-2.5 py-1 shadow-md">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Done</span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-3">
                        <div className={`w-9 h-9 rounded-lg ${module.color} flex items-center justify-center shadow-md`}>
                          <module.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base text-foreground leading-tight">{module.title}</h3>
                        {isCompleted && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{module.description}</p>
                      {!isCompleted && (
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs">
                          Ready to start
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs">
                          Completed
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {completedModules.length === modules.length && !activeModule && (
            <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Congratulations!</h3>
                <p className="text-muted-foreground text-lg mb-4">
                  You have completed all the lessons in the {trackTitle} track. You are now a certified internet safety champion.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md">All Lessons Complete</Badge>
                  <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md">Safety Champion</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ModuleContent({ 
  module, 
  onComplete, 
  onBack,
  isCompleted 
}: { 
  module: LearningModule;
  onComplete: () => void;
  onBack: () => void;
  isCompleted: boolean;
}) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const isCorrect = selectedAnswer === module.quiz.correctIndex;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} data-testid="button-back-to-modules">
        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
        Back to Lessons
      </Button>

      <Card className="overflow-hidden">
        <div className="relative h-44 sm:h-52 overflow-hidden">
          <img
            src={module.image}
            alt={module.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${module.color} flex items-center justify-center shadow-lg`}>
                <module.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">{module.title}</h3>
                <p className="text-white/80 text-sm">{module.description}</p>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="space-y-6 pt-6">
          {!showQuiz ? (
            <>
              <div className="bg-muted/50 rounded-lg p-6">
                <p className="text-lg text-foreground leading-relaxed">{module.content.intro}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Important Tips
                </h4>
                <ul className="space-y-3">
                  {module.content.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {module.content.platformGuides && module.content.platformGuides.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Step-by-Step Guides
                  </h4>
                  <Tabs defaultValue={module.content.platformGuides[0].platform} className="mb-2">
                    <TabsList className="flex flex-wrap h-auto gap-1.5 bg-muted/50 p-1.5 rounded-xl mb-4">
                      {module.content.platformGuides.map((guide) => (
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
                    {module.content.platformGuides.map((guide) => (
                      <TabsContent key={guide.platform} value={guide.platform}>
                        <Card>
                          <CardContent className="p-5 sm:p-6">
                            <h5 className="font-bold text-base text-foreground mb-4">{guide.platform}</h5>
                            <CollapsibleSteps steps={guide.steps} platform={guide.platform} />
                          </CardContent>
                        </Card>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}

              {module.content.checklist && module.content.checklist.length > 0 && (
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Safety Checklist
                  </h4>
                  <ul className="space-y-3">
                    {module.content.checklist.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded border-2 border-green-400 dark:border-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-green-700 dark:text-green-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Remember This
                </h4>
                <p className="text-blue-700 dark:text-blue-300">{module.content.remember}</p>
              </div>

              <div className="flex justify-center pt-4">
                <Button onClick={() => setShowQuiz(true)} data-testid="button-take-quiz">
                  Take the Quiz <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Badge className="mb-2">Quiz Time</Badge>
                <h4 className="text-xl font-semibold text-foreground">{module.quiz.question}</h4>
              </div>

              <div className="grid gap-3">
                {module.quiz.options.map((option, index) => {
                  let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
                  
                  if (showResult) {
                    if (index === module.quiz.correctIndex) {
                      buttonClass += "border-green-500 bg-green-50 dark:bg-green-900/20";
                    } else if (index === selectedAnswer && !isCorrect) {
                      buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20";
                    } else {
                      buttonClass += "border-muted opacity-50";
                    }
                  } else {
                    buttonClass += "border-muted hover:border-primary hover:bg-primary/5 cursor-pointer";
                  }

                  return (
                    <button
                      key={index}
                      className={buttonClass}
                      onClick={() => !showResult && handleAnswerSelect(index)}
                      disabled={showResult}
                      data-testid={`button-answer-${index}`}
                    >
                      <span className="text-foreground">{option}</span>
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className={`p-6 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'}`}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <Lightbulb className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    )}
                    <div>
                      <h5 className={`font-semibold mb-1 ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-orange-800 dark:text-orange-200'}`}>
                        {isCorrect ? "Great job!" : "Good try!"}
                      </h5>
                      <p className={isCorrect ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}>
                        {module.quiz.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {showResult && (
                <div className="flex justify-center pt-4">
                  <Button onClick={onComplete} data-testid="button-complete-lesson">
                    {isCompleted ? "Review Complete" : "Complete Lesson"} <CheckCircle className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SpotTheScamGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const currentItem = spotTheScamItems[currentIndex];
  const isCorrect = selectedAnswer === currentItem.isScam;

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setAnswered(true);
    if (answer === currentItem.isScam) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < spotTheScamItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setGameComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setGameComplete(false);
  };

  if (gameComplete) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 border-2 border-purple-200 dark:border-purple-800 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Game Complete!</h3>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(score)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
            ))}
            {[...Array(spotTheScamItems.length - score)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-gray-300 dark:text-gray-600" />
            ))}
          </div>
          <p className="text-xl text-muted-foreground mb-4">
            You scored {score} out of {spotTheScamItems.length}
          </p>
          {score === spotTheScamItems.length ? (
            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white mb-4 shadow-md">Perfect Score! Scam Spotter Expert!</Badge>
          ) : score >= spotTheScamItems.length / 2 ? (
            <Badge className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white mb-4 shadow-md">Great Job! Keep Learning!</Badge>
          ) : (
            <Badge className="bg-gradient-to-r from-orange-400 to-amber-500 text-white mb-4 shadow-md">Good Try! Practice Makes Perfect!</Badge>
          )}
          <div className="pt-4">
            <Button onClick={resetGame} className="bg-gradient-to-r from-purple-500 to-pink-500" data-testid="button-play-again">
              <Sparkles className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-orange-200 dark:border-orange-800 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center shadow-md">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            Spot the Scam
          </CardTitle>
          <Badge className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white shadow-md">
            {currentIndex + 1} of {spotTheScamItems.length}
          </Badge>
        </div>
        <CardDescription>
          Read the scenario and decide if it is a scam or legitimate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-900">
          <p className="text-lg text-foreground">{currentItem.scenario}</p>
        </div>

        {!answered ? (
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="flex-1 max-w-40 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
              onClick={() => handleAnswer(true)}
              data-testid="button-scam"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Scam
            </Button>
            <Button 
              variant="outline"
              className="flex-1 max-w-40 border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/20"
              onClick={() => handleAnswer(false)}
              data-testid="button-safe"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Safe
            </Button>
          </div>
        ) : (
          <>
            <div className={`p-6 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <Lightbulb className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                )}
                <div>
                  <h5 className={`font-semibold mb-1 ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-orange-800 dark:text-orange-200'}`}>
                    {isCorrect ? "Correct!" : "Not quite!"}
                  </h5>
                  <p className={isCorrect ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}>
                    {currentItem.explanation}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button onClick={handleNext} data-testid="button-next-scenario">
                {currentIndex < spotTheScamItems.length - 1 ? "Next Scenario" : "See Results"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </>
        )}

        <div className="flex justify-center">
          <div className="flex gap-1">
            {spotTheScamItems.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex 
                    ? 'bg-primary' 
                    : index < currentIndex 
                      ? 'bg-green-500' 
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ParentSection() {
  const conversationStarters = [
    "What would you do if someone online asked for your password?",
    "Have you ever seen something online that made you uncomfortable?",
    "Do you know who to tell if someone is being mean to you online?",
    "What information is okay to share online and what should stay private?",
    "Have you ever gotten a message that seemed too good to be true?"
  ];

  return (
    <div id="parent-section" className="py-16 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="mb-6">
            <img
              src={kidsFamilyTogetherImg}
              alt="Diverse family learning about online safety together on a tablet"
              className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-2xl shadow-lg object-cover"
              loading="lazy"
              data-testid="img-parent-section-hero"
            />
          </div>
          <Badge className="mb-4">For Parents and Educators</Badge>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Partnering with You for Online Safety
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            This section is designed to be used together or independently. Here is everything you need to know about what your children will learn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                What Kids Will Learn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Ages 8 to 11 (Foundations)</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>Understanding personal information and privacy</li>
                  <li>Creating and managing strong passwords</li>
                  <li>Recognizing online tricks and scams</li>
                  <li>Basic device safety practices</li>
                  <li>When and how to ask trusted adults for help</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Ages 12 to 16 (Smart and Safe)</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>Safe social media practices and privacy settings</li>
                  <li>Understanding and responding to online bullying</li>
                  <li>Gaming safety and protecting online identity</li>
                  <li>Identifying fake scam messages and trick emails</li>
                  <li>Building a positive digital footprint</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-green-500" />
                How to Use This Together
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">Sit together:</strong> Go through lessons as a team activity. This opens natural conversations about online experiences.
              </p>
              <p>
                <strong className="text-foreground">Play the games:</strong> The Spot the Scam game is designed for families. Take turns guessing and discuss why each answer is correct.
              </p>
              <p>
                <strong className="text-foreground">Celebrate progress:</strong> When your child completes a lesson, acknowledge their achievement. Building good habits deserves recognition.
              </p>
              <p>
                <strong className="text-foreground">Keep the dialogue open:</strong> Use the conversation starters below to continue discussions beyond the lessons.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-500" />
              Conversation Starters
            </CardTitle>
            <CardDescription>
              Use these questions to start meaningful discussions about online safety.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {conversationStarters.map((starter, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{index + 1}</span>
                  </div>
                  <p className="text-foreground">{starter}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="relative overflow-hidden py-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${kidsFamilyTogetherImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-400/90 via-red-400/90 to-orange-400/90 dark:from-rose-600/90 dark:via-red-600/90 dark:to-orange-600/90" />
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Heart className="w-5 h-5 text-white" />
              <span className="font-medium text-white">Your Safety Matters</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">Our Promise to You</h3>
            <p className="text-white/90 text-lg">We keep you safe while you learn and have fun.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <Shield className="w-10 h-10 text-teal-500 mx-auto mb-4" />
              <h4 className="font-semibold text-foreground mb-2">Child Privacy First</h4>
              <p className="text-sm text-muted-foreground">
                We do not collect any personal information from children. No accounts required, no profiles, no ads.
              </p>
            </Card>
            <Card className="text-center p-6">
              <Lock className="w-10 h-10 text-blue-500 mx-auto mb-4" />
              <h4 className="font-semibold text-foreground mb-2">No External Links</h4>
              <p className="text-sm text-muted-foreground">
                All learning happens on this page. Children are never directed to external websites.
              </p>
            </Card>
            <Card className="text-center p-6">
              <Heart className="w-10 h-10 text-pink-500 mx-auto mb-4" />
              <h4 className="font-semibold text-foreground mb-2">Child Safety First</h4>
              <p className="text-sm text-muted-foreground">
                Content is designed to empower, not frighten. We use positive, encouraging language throughout.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Kids() {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(null);
  const [activeModule, setActiveModule] = useState<ActiveModule>(null);
  const [completedModules8to11, setCompletedModules8to11] = useState<string[]>([]);
  const [completedModules12to16, setCompletedModules12to16] = useState<string[]>([]);

  const completedModules = selectedAge === "8-11" ? completedModules8to11 : completedModules12to16;
  const setCompletedModules = selectedAge === "8-11" ? setCompletedModules8to11 : setCompletedModules12to16;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.kids} />
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Kids Digital Safety Hub"
          subtitle="Fun, interactive lessons to help young people stay safe online. Choose your age group and start learning today."
          colorVariant="teal"
          imageSrc={kidsBannerImage}
          imageAlt="Children learning about internet safety on computers"
        />

        {selectedAge === null ? (
          <KidsLanding onSelectAge={setSelectedAge} />
        ) : (
          <LearningTrack 
            ageGroup={selectedAge}
            onBack={() => {
              setSelectedAge(null);
              setActiveModule(null);
            }}
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            completedModules={completedModules}
            setCompletedModules={setCompletedModules}
          />
        )}

        <div className="py-12 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="mb-6">
                <img
                  src={kidsSpotScamImg}
                  alt="Fun detective character examining suspicious messages"
                  className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-2xl shadow-lg object-cover"
                  loading="lazy"
                  data-testid="img-spot-scam-hero"
                />
              </div>
              <Badge className="mb-4 bg-orange-500">Interactive Game</Badge>
              <h2 className="text-3xl font-bold text-foreground mb-2">Spot the Scam Challenge</h2>
              <p className="text-muted-foreground">
                Test your scam-spotting skills with real-world scenarios. Can you tell what is safe and what is not?
              </p>
            </div>
            <SpotTheScamGame />
          </div>
        </div>

        <ParentSection />
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground py-4">
          <CalendarDays className="w-3 h-3" />
          <span>Content last reviewed: February 2026</span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
