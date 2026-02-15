import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { Link } from "wouter";
import {
  Search,
  Copy,
  Check,
  Users,
  Heart,
  GraduationCap,
  Briefcase,
  Home,
  Shield,
  Mail,
  FileText,
  DollarSign,
  Stethoscope,
  MessageSquare,
  Wrench,
  Brain,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  Lightbulb,
  Lock,
  ShoppingCart,
  Scale,
  Clock,
  Zap
} from "lucide-react";
import bannerImage from "@/assets/banners/ai-prompts-banner.png";

type Audience = "all" | "everyday" | "families" | "seniors" | "students" | "business";
type Category = "all" | "productivity" | "communication" | "safety" | "health" | "finance" | "learning" | "work" | "tech";

interface Prompt {
  id: string;
  title: string;
  prompt: string;
  audience: Audience[];
  category: Category;
  tags: string[];
  useCase: string;
  safetyNote?: string;
  icon: typeof Search;
}

const audiences: { id: Audience; label: string; icon: typeof Search; description: string }[] = [
  { id: "all", label: "All Prompts", icon: Sparkles, description: "Browse the full collection" },
  { id: "everyday", label: "Everyday", icon: Home, description: "Daily life and productivity" },
  { id: "families", label: "Families", icon: Users, description: "Parents and family safety" },
  { id: "seniors", label: "Seniors", icon: Heart, description: "Health, safety, and daily tasks" },
  { id: "students", label: "Students", icon: GraduationCap, description: "Learning and school work" },
  { id: "business", label: "Small Business", icon: Briefcase, description: "Operations and growth" },
];

const categories: { id: Category; label: string; icon: typeof Search }[] = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "productivity", label: "Productivity", icon: Target },
  { id: "communication", label: "Communication", icon: Mail },
  { id: "safety", label: "Safety & Privacy", icon: Shield },
  { id: "health", label: "Health & Wellness", icon: Stethoscope },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "learning", label: "Learning", icon: BookOpen },
  { id: "work", label: "Work & Career", icon: Briefcase },
  { id: "tech", label: "Tech Help", icon: Wrench },
];

const prompts: Prompt[] = [
  // === EVERYDAY PRODUCTIVITY ===
  {
    id: "daily-schedule",
    title: "Plan My Day",
    prompt: "Help me create a realistic daily schedule. I wake up at [TIME] and go to bed at [TIME]. I need to fit in: [LIST YOUR TASKS]. Prioritize the most important things first and include breaks. Keep it simple and practical.",
    audience: ["everyday", "seniors"],
    category: "productivity",
    tags: ["planning", "time management", "daily routine"],
    useCase: "When you have a busy day ahead and need help organizing your time",
    icon: Clock,
  },
  {
    id: "summarize-article",
    title: "Summarize a Long Article",
    prompt: "Summarize this article in 3-5 bullet points that capture the key takeaways. Use simple language that anyone can understand. Here's the article: [PASTE ARTICLE TEXT]",
    audience: ["everyday", "seniors", "students"],
    category: "productivity",
    tags: ["summarize", "reading", "news"],
    useCase: "When you don't have time to read a long article but need the key points",
    icon: FileText,
  },
  {
    id: "simplify-document",
    title: "Simplify a Confusing Document",
    prompt: "Explain this document in plain, everyday language. Break down any technical terms or legal jargon. Tell me what it actually means for me and if there's anything I should be concerned about. Here's the text: [PASTE DOCUMENT]",
    audience: ["everyday", "seniors"],
    category: "productivity",
    tags: ["simplify", "legal", "contracts", "documents"],
    useCase: "When you receive a contract, policy update, or official letter you don't fully understand",
    icon: FileText,
  },
  {
    id: "weekly-meals",
    title: "Plan Weekly Meals on a Budget",
    prompt: "Create a simple weekly meal plan for [NUMBER] people with a grocery budget of around $[AMOUNT]. Include breakfast, lunch, and dinner. Keep the recipes easy with common ingredients. I [HAVE/DON'T HAVE] dietary restrictions: [LIST ANY]. Include a grocery list organized by store section.",
    audience: ["everyday", "families", "seniors"],
    category: "productivity",
    tags: ["meal planning", "cooking", "budget", "grocery"],
    useCase: "When you need to plan meals for the week without spending hours on it",
    icon: ShoppingCart,
  },
  {
    id: "declutter-home",
    title: "Organize and Declutter",
    prompt: "Help me create a realistic decluttering plan for my [ROOM/SPACE]. I can spend about [TIME] per day on this. Break it into small, manageable daily tasks over [NUMBER] days. Include tips for deciding what to keep, donate, or throw away.",
    audience: ["everyday", "seniors"],
    category: "productivity",
    tags: ["organizing", "home", "cleaning"],
    useCase: "When your space feels overwhelming and you need a step-by-step plan",
    icon: Home,
  },
  {
    id: "compare-products",
    title: "Compare Products Before Buying",
    prompt: "I'm trying to decide between these options: [LIST 2-3 PRODUCTS/SERVICES]. Compare them based on: price, quality, ease of use, and value for money. What are the pros and cons of each? Which would you recommend for someone who [DESCRIBE YOUR SITUATION]?",
    audience: ["everyday", "seniors"],
    category: "finance",
    tags: ["shopping", "comparison", "decision making"],
    useCase: "Before making a purchase, especially for electronics, appliances, or services",
    icon: Scale,
  },

  // === COMMUNICATION ===
  {
    id: "professional-email",
    title: "Write a Professional Email",
    prompt: "Help me write a professional email to [WHO - e.g., my landlord, a company, my child's school]. The purpose is to [DESCRIBE WHAT YOU NEED]. Keep it polite but clear. I want to [STATE YOUR DESIRED OUTCOME]. Here are the key details: [ADD RELEVANT FACTS].",
    audience: ["everyday", "seniors", "business"],
    category: "communication",
    tags: ["email", "writing", "professional"],
    useCase: "When you need to write an important email and want to get the tone right",
    icon: Mail,
  },
  {
    id: "complaint-letter",
    title: "Write a Polite Complaint",
    prompt: "Help me write a firm but polite complaint to [COMPANY/ORGANIZATION] about [ISSUE]. Include these facts: [WHAT HAPPENED, WHEN, ANY REFERENCE NUMBERS]. I want them to [DESIRED RESOLUTION]. Keep it professional — no aggressive language, but make it clear I expect action.",
    audience: ["everyday", "seniors"],
    category: "communication",
    tags: ["complaint", "customer service", "writing"],
    useCase: "When you've received bad service or a defective product and need to escalate",
    icon: MessageSquare,
  },
  {
    id: "difficult-conversation",
    title: "Prepare for a Difficult Conversation",
    prompt: "I need to have a difficult conversation with [WHO] about [TOPIC]. Help me plan what to say. I want to be respectful but honest. My main points are: [LIST YOUR KEY POINTS]. What are some good ways to open the conversation, and how should I respond if they get defensive?",
    audience: ["everyday", "families"],
    category: "communication",
    tags: ["conversation", "conflict resolution", "relationships"],
    useCase: "Before a tough talk with a family member, neighbor, coworker, or friend",
    icon: MessageSquare,
  },
  {
    id: "thank-you-note",
    title: "Write a Thoughtful Thank-You Note",
    prompt: "Help me write a sincere thank-you message to [WHO] for [WHAT THEY DID]. I want it to feel personal, not generic. A few details about our relationship: [BRIEF CONTEXT]. Keep it [SHORT/MEDIUM LENGTH] and [CASUAL/FORMAL].",
    audience: ["everyday", "seniors"],
    category: "communication",
    tags: ["thank you", "gratitude", "writing"],
    useCase: "After receiving a gift, help, or kindness that you want to acknowledge properly",
    icon: Heart,
  },
  {
    id: "explain-to-child",
    title: "Explain Something to My Child",
    prompt: "Help me explain [TOPIC] to my [AGE]-year-old child. Use simple words and a relatable example they'd understand. Avoid anything scary or overly complex. I want them to understand [KEY TAKEAWAY] without feeling anxious about it.",
    audience: ["families"],
    category: "communication",
    tags: ["parenting", "kids", "education", "explaining"],
    useCase: "When your child asks a tough question or you need to teach them something important",
    icon: Users,
  },

  // === SAFETY & PRIVACY ===
  {
    id: "check-scam-email",
    title: "Is This Email a Scam?",
    prompt: "I received this email and I'm not sure if it's legitimate. Can you analyze it for common scam indicators? Look for: urgency tactics, suspicious sender addresses, grammar issues, requests for personal information, and anything that seems off. Here's the email: [PASTE EMAIL TEXT]. Do NOT click any links — just help me evaluate the text.",
    audience: ["everyday", "seniors", "families"],
    category: "safety",
    tags: ["scam", "phishing", "email security"],
    useCase: "When you receive a suspicious email and want to check before responding or clicking anything",
    safetyNote: "Never paste passwords, credit card numbers, or Social Security numbers into AI tools. Only paste the email text itself.",
    icon: AlertTriangle,
  },
  {
    id: "check-text-message",
    title: "Is This Text Message Legit?",
    prompt: "I received this text message and I'm unsure if it's real or a scam. Analyze it for red flags like: fake urgency, suspicious links, requests for personal info, impersonation of a known company, or too-good-to-be-true offers. Here's the message: [PASTE MESSAGE TEXT]",
    audience: ["everyday", "seniors"],
    category: "safety",
    tags: ["scam", "smishing", "text message", "phone safety"],
    useCase: "When you get a text from an unknown number or a message that seems suspicious",
    safetyNote: "Do not click any links in suspicious texts. Only paste the text content here for analysis.",
    icon: Shield,
  },
  {
    id: "privacy-settings",
    title: "Review My Privacy Settings",
    prompt: "Walk me through the most important privacy settings I should check on [PLATFORM — e.g., Facebook, Instagram, Google, iPhone, Android]. Tell me step by step what to change and why. Focus on the settings that actually matter for my safety, not every single option.",
    audience: ["everyday", "seniors", "families"],
    category: "safety",
    tags: ["privacy", "social media", "settings", "account security"],
    useCase: "When you want to tighten your privacy on social media or your phone but don't know where to start",
    icon: Lock,
  },
  {
    id: "strong-password",
    title: "Create Strong Passwords I Can Remember",
    prompt: "Help me create 5 strong, unique passwords that I can actually remember. Use the passphrase method — combine random words with numbers and symbols. Each password should be at least 16 characters. Also explain why I shouldn't reuse passwords across different sites.",
    audience: ["everyday", "seniors"],
    category: "safety",
    tags: ["passwords", "security", "account protection"],
    useCase: "When you need new passwords for important accounts and want them to be both strong and memorable",
    safetyNote: "Never share your actual passwords with AI tools. Use these as templates and modify them.",
    icon: Lock,
  },
  {
    id: "online-safety-kids",
    title: "Set Up Safe Internet for My Kids",
    prompt: "My child is [AGE] years old and uses [DEVICES]. Help me create an age-appropriate internet safety plan. Include: recommended parental controls, screen time guidelines, apps to watch out for, conversation starters about online safety, and what warning signs to look for that my child might be in trouble online.",
    audience: ["families"],
    category: "safety",
    tags: ["kids", "parental controls", "online safety", "screen time"],
    useCase: "When setting up devices for your child or updating your family's online safety rules",
    icon: Shield,
  },
  {
    id: "ai-privacy-check",
    title: "What Should I Never Tell AI?",
    prompt: "Give me a clear, practical list of what I should never share when using AI tools like ChatGPT, Gemini, or Copilot. Explain WHY for each item. Also tell me how to turn off data training in the most popular AI tools so my conversations stay more private.",
    audience: ["everyday", "seniors", "students", "business"],
    category: "safety",
    tags: ["AI privacy", "data protection", "ChatGPT safety"],
    useCase: "Before you start using AI tools regularly — know the ground rules for protecting your information",
    safetyNote: "This prompt itself is safe to use. It teaches you what to avoid sharing in future conversations.",
    icon: Brain,
  },
  {
    id: "spot-deepfake",
    title: "How to Spot a Deepfake",
    prompt: "Explain how to spot AI-generated fake images, videos, and audio in simple terms. Give me specific things to look for in each type. Include real examples of how deepfakes have been used in scams. What free tools can I use to verify if something is AI-generated?",
    audience: ["everyday", "seniors", "families", "students"],
    category: "safety",
    tags: ["deepfakes", "AI detection", "misinformation", "verification"],
    useCase: "When you see a suspicious video, image, or receive an unusual call and want to know if it's real",
    icon: AlertTriangle,
  },
  {
    id: "data-breach-response",
    title: "What to Do After a Data Breach",
    prompt: "I just found out my information may have been exposed in a data breach at [COMPANY/SERVICE]. Walk me through exactly what to do right now, step by step. Include: what passwords to change first, how to check if my info is being misused, whether I need a credit freeze, and who to contact.",
    audience: ["everyday", "seniors", "business"],
    category: "safety",
    tags: ["data breach", "identity theft", "credit freeze", "incident response"],
    useCase: "When you receive a breach notification or hear that a service you use has been compromised",
    icon: AlertTriangle,
  },

  // === HEALTH & WELLNESS ===
  {
    id: "medical-bill",
    title: "Understand My Medical Bill",
    prompt: "Help me understand this medical bill. Break down what each line item means in plain language. Are there any charges that look unusual or that I should question? What should I ask my insurance company about? Here's what the bill says: [PASTE BILL DETAILS — remove your name, account numbers, and personal info first]",
    audience: ["everyday", "seniors"],
    category: "health",
    tags: ["medical", "billing", "healthcare", "insurance"],
    useCase: "When you receive a confusing medical bill and want to understand what you're being charged for",
    safetyNote: "Remove your name, patient ID, account numbers, and any personal details before pasting bill information.",
    icon: Stethoscope,
  },
  {
    id: "doctor-questions",
    title: "Prepare Questions for My Doctor",
    prompt: "I have an appointment with my doctor about [HEALTH CONCERN]. Help me prepare a list of important questions to ask. I want to understand: what tests might be needed, what my treatment options are, potential side effects of any medications, and what lifestyle changes could help. I'm [AGE] years old and my general health is [BRIEF DESCRIPTION].",
    audience: ["everyday", "seniors"],
    category: "health",
    tags: ["doctor", "health", "medical appointment", "preparation"],
    useCase: "Before a doctor's appointment, especially for a new health concern",
    safetyNote: "AI is not a substitute for medical advice. Use these questions as a starting point for your conversation with your doctor.",
    icon: Stethoscope,
  },
  {
    id: "exercise-plan",
    title: "Simple Exercise Routine",
    prompt: "Create a simple, safe exercise routine I can do at home with no equipment. I'm [AGE] years old, my fitness level is [BEGINNER/MODERATE], and I have [ANY LIMITATIONS — e.g., bad knees, back problems]. I can exercise for about [MINUTES] per day, [DAYS] per week. Focus on exercises that improve [STRENGTH/FLEXIBILITY/BALANCE/GENERAL FITNESS].",
    audience: ["everyday", "seniors"],
    category: "health",
    tags: ["exercise", "fitness", "wellness", "home workout"],
    useCase: "When you want to start exercising but don't know where to begin or have physical limitations",
    safetyNote: "Always consult your doctor before starting a new exercise program, especially if you have health conditions.",
    icon: Stethoscope,
  },
  {
    id: "medication-organizer",
    title: "Organize My Medications",
    prompt: "Help me create a simple daily medication schedule. I take these medications: [LIST MEDICATIONS AND DOSAGES]. Organize them into a clear morning/afternoon/evening schedule. Include reminders about which ones should be taken with food, which on an empty stomach, and any common interactions I should watch for.",
    audience: ["seniors"],
    category: "health",
    tags: ["medication", "health management", "schedule", "reminders"],
    useCase: "When you take multiple medications and need a clear, organized schedule",
    safetyNote: "Always verify medication information with your pharmacist or doctor. AI should supplement, not replace, professional medical guidance.",
    icon: Clock,
  },

  // === FINANCE ===
  {
    id: "monthly-budget",
    title: "Create a Monthly Budget",
    prompt: "Help me create a simple monthly budget. My take-home income is approximately $[AMOUNT] per month. My fixed expenses include: [LIST RENT, UTILITIES, INSURANCE, etc.]. Help me figure out how much I can realistically spend on groceries, transportation, entertainment, and savings. Use the 50/30/20 rule as a starting point.",
    audience: ["everyday", "seniors", "students"],
    category: "finance",
    tags: ["budget", "money management", "savings", "expenses"],
    useCase: "When you want to take control of your spending and start saving money",
    safetyNote: "Don't share exact bank account balances, account numbers, or Social Security numbers. Round your income to the nearest hundred.",
    icon: DollarSign,
  },
  {
    id: "insurance-compare",
    title: "Compare Insurance Plans",
    prompt: "Help me compare these insurance options: [DESCRIBE 2-3 PLANS — premiums, deductibles, coverage]. I'm [AGE], [HEALTH STATUS], and my main concerns are [LIST PRIORITIES — e.g., prescription coverage, low deductible, specialist access]. Which plan makes the most sense for my situation?",
    audience: ["everyday", "seniors"],
    category: "finance",
    tags: ["insurance", "healthcare", "comparison", "decision making"],
    useCase: "During open enrollment or when choosing between insurance plans",
    icon: DollarSign,
  },
  {
    id: "negotiate-bill",
    title: "Help Me Negotiate a Bill",
    prompt: "I want to negotiate my [TYPE OF BILL — cable, internet, phone, medical] bill with [COMPANY]. My current plan costs $[AMOUNT]/month. Help me prepare a script for calling them. Include: what to say when I first call, how to ask for a better rate, what competitor prices I should mention, and what to say if they initially refuse.",
    audience: ["everyday", "seniors"],
    category: "finance",
    tags: ["negotiation", "bills", "saving money", "customer service"],
    useCase: "When you feel like you're paying too much for a service and want to try negotiating",
    icon: DollarSign,
  },

  // === FAMILIES & PARENTING ===
  {
    id: "screen-time-rules",
    title: "Create Family Screen Time Rules",
    prompt: "Help me create fair and age-appropriate screen time rules for my family. My kids are ages [LIST AGES]. I want rules that are realistic, not too strict, and that the whole family can follow. Include guidelines for: school nights vs. weekends, types of content allowed, device-free zones/times, and consequences for breaking the rules.",
    audience: ["families"],
    category: "productivity",
    tags: ["screen time", "parenting", "family rules", "digital wellness"],
    useCase: "When screen time is becoming a source of conflict and you need a clear, fair system",
    icon: Users,
  },
  {
    id: "talk-about-cyberbullying",
    title: "Talk to My Kid About Cyberbullying",
    prompt: "Help me start a conversation with my [AGE]-year-old about cyberbullying. I want to: explain what cyberbullying looks like (not just mean texts, but exclusion, rumor-spreading, fake accounts), teach them what to do if it happens to them or they witness it, and make sure they know they can come to me without getting in trouble. Keep the tone supportive, not scary.",
    audience: ["families"],
    category: "safety",
    tags: ["cyberbullying", "kids", "online safety", "parenting"],
    useCase: "When you want to proactively discuss cyberbullying or your child has experienced it",
    icon: Shield,
  },
  {
    id: "family-emergency-plan",
    title: "Create a Family Safety Plan",
    prompt: "Help me create a family digital safety plan. We have [NUMBER] family members aged [AGES]. Include: a family code word for verifying emergency calls, rules for what to do if someone calls claiming to be a family member in trouble, steps for what to do if a device is lost or stolen, and a list of emergency contacts to keep printed (not just on phones).",
    audience: ["families"],
    category: "safety",
    tags: ["family safety", "emergency plan", "code word", "verification"],
    useCase: "To protect your family from AI voice cloning scams and other emergencies",
    icon: Shield,
  },
  {
    id: "homework-help",
    title: "Help My Child Study (Without Doing It for Them)",
    prompt: "My child (age [AGE]) is struggling with [SUBJECT/TOPIC]. Help me create study aids and practice questions that will help them understand the material — without just giving them the answers. I want: a simple explanation of the concept, 5 practice questions at their level, and tips for how I can help them even if I don't know the subject well.",
    audience: ["families"],
    category: "learning",
    tags: ["homework", "study", "parenting", "education"],
    useCase: "When your child needs help with schoolwork and you want to support without doing the work for them",
    icon: BookOpen,
  },

  // === SENIORS ===
  {
    id: "tech-help-phone",
    title: "Fix Something on My Phone",
    prompt: "I need help with my [iPhone/Android] phone. The problem is: [DESCRIBE ISSUE — e.g., can't connect to Wi-Fi, text is too small, getting too many notifications]. Walk me through the fix step by step, using simple language. Tell me exactly what to tap and where to find it. Include what the screen should look like at each step.",
    audience: ["seniors"],
    category: "tech",
    tags: ["phone", "troubleshooting", "technology help", "step-by-step"],
    useCase: "When something isn't working on your phone and you need clear, patient instructions",
    icon: Wrench,
  },
  {
    id: "social-security-explain",
    title: "Explain Benefits in Plain Language",
    prompt: "Explain [Social Security benefits / Medicare / VA benefits / pension options] in plain, simple language. I'm [AGE] years old and my situation is [BRIEF DESCRIPTION]. What am I eligible for? What deadlines should I know about? Are there common mistakes people make that cost them money?",
    audience: ["seniors"],
    category: "finance",
    tags: ["benefits", "Social Security", "Medicare", "retirement"],
    useCase: "When you're approaching retirement or trying to understand your benefits options",
    safetyNote: "Never share your Social Security number, Medicare ID, or banking details with AI tools.",
    icon: DollarSign,
  },
  {
    id: "letter-writing",
    title: "Write a Personal Letter",
    prompt: "Help me write a [TYPE — birthday, sympathy, congratulations, thinking-of-you] letter to [WHO — e.g., my grandchild, an old friend, a neighbor]. I want it to feel personal and warm, not generic. A few details: [SHARE A MEMORY OR DETAIL ABOUT YOUR RELATIONSHIP]. Keep it [SHORT/MEDIUM/LONG] and [HANDWRITTEN STYLE/TYPED STYLE].",
    audience: ["seniors"],
    category: "communication",
    tags: ["letter writing", "personal", "relationships"],
    useCase: "When you want to write something meaningful but are struggling to find the right words",
    icon: Mail,
  },
  {
    id: "scam-call-verify",
    title: "Verify a Suspicious Phone Call",
    prompt: "I received a phone call from someone claiming to be from [ORGANIZATION — e.g., my bank, the IRS, Medicare, a grandchild]. They said [DESCRIBE WHAT THEY TOLD YOU]. They asked me to [WHAT THEY WANTED YOU TO DO]. Is this likely a scam? What should I do next? How can I verify if the call was real?",
    audience: ["seniors", "everyday"],
    category: "safety",
    tags: ["phone scam", "verification", "fraud", "caller ID"],
    useCase: "After receiving a call that felt suspicious or pressured you to act quickly",
    safetyNote: "If you've already given out personal information, contact your bank and local authorities immediately.",
    icon: AlertTriangle,
  },
  {
    id: "travel-planning-senior",
    title: "Plan an Accessible Trip",
    prompt: "Help me plan a [LENGTH]-day trip to [DESTINATION]. I need: accessible accommodation options, transportation that works for [MOBILITY NEEDS], a realistic daily itinerary that isn't too physically demanding, tips for traveling with medications, and emergency medical facilities nearby. My budget is approximately $[AMOUNT].",
    audience: ["seniors"],
    category: "productivity",
    tags: ["travel", "accessibility", "planning", "vacation"],
    useCase: "When planning a trip and need to account for mobility, health, or accessibility needs",
    icon: Target,
  },

  // === STUDENTS ===
  {
    id: "essay-outline",
    title: "Outline an Essay (Don't Write It for Me)",
    prompt: "Help me create a detailed outline for a [LENGTH]-word essay on [TOPIC]. Include: a strong thesis statement suggestion, 3-4 main arguments with supporting evidence I should research, a logical structure for my paragraphs, and tips for writing a compelling introduction and conclusion. Do NOT write the essay — just give me the roadmap.",
    audience: ["students"],
    category: "learning",
    tags: ["essay", "writing", "school", "outline"],
    useCase: "When you have an essay assignment and need help organizing your thoughts",
    safetyNote: "Using AI to outline is a study aid. Submitting AI-written text as your own work is academic dishonesty. Always check your school's AI policy.",
    icon: FileText,
  },
  {
    id: "study-quiz",
    title: "Quiz Me on What I Studied",
    prompt: "I just studied [TOPIC/CHAPTER] for my [CLASS] class. Create 10 quiz questions to test my understanding — mix of multiple choice, true/false, and short answer. Start with easier questions and build to harder ones. After I answer, tell me which ones I got wrong and explain why.",
    audience: ["students"],
    category: "learning",
    tags: ["quiz", "study", "test prep", "review"],
    useCase: "After studying, to test yourself before an exam",
    icon: GraduationCap,
  },
  {
    id: "explain-concept",
    title: "Explain This Like I'm a Beginner",
    prompt: "Explain [CONCEPT/TOPIC] like I'm a complete beginner. Use a real-world analogy that makes it click. Then give me a slightly more technical explanation. Finally, suggest one practical exercise I can do to really understand it. I'm studying this for [CLASS/PURPOSE].",
    audience: ["students", "everyday"],
    category: "learning",
    tags: ["explanation", "learning", "understanding", "analogies"],
    useCase: "When a textbook explanation isn't making sense and you need it broken down differently",
    icon: Lightbulb,
  },
  {
    id: "proofread-paper",
    title: "Proofread and Explain Corrections",
    prompt: "Proofread the following text for grammar, spelling, punctuation, and clarity. Don't just fix the errors — explain each correction so I can learn from my mistakes. Point out any sentences that could be clearer or more concise. Here's my text: [PASTE YOUR WRITING]",
    audience: ["students"],
    category: "communication",
    tags: ["proofreading", "grammar", "writing improvement"],
    useCase: "Before submitting an assignment, to catch errors and improve your writing skills",
    safetyNote: "Check your school's AI policy before using AI for proofreading assignments.",
    icon: FileText,
  },
  {
    id: "study-schedule",
    title: "Create a Study Schedule",
    prompt: "Help me create a study schedule for the next [NUMBER] weeks. I have exams in: [LIST SUBJECTS AND DATES]. I can study about [HOURS] per day, and I work/have activities on [LIST BUSY DAYS]. I struggle most with [SUBJECTS]. Build in breaks and review sessions. Use spaced repetition for the hardest subjects.",
    audience: ["students"],
    category: "productivity",
    tags: ["study plan", "exam prep", "time management", "scheduling"],
    useCase: "When finals or midterms are approaching and you need a structured study plan",
    icon: Clock,
  },
  {
    id: "research-sources",
    title: "Find Research Directions",
    prompt: "I'm researching [TOPIC] for a [TYPE OF PAPER — research paper, presentation, report]. Suggest 5-7 specific subtopics or angles I should explore. For each one, tell me what type of source would be best (academic journal, government data, expert interview, etc.) and give me search terms to find them. Do NOT generate fake citations.",
    audience: ["students"],
    category: "learning",
    tags: ["research", "sources", "academic", "paper"],
    useCase: "At the start of a research project when you need direction on where to look",
    safetyNote: "AI can suggest research directions but may invent fake sources. Always verify citations through your library database.",
    icon: Search,
  },

  // === SMALL BUSINESS ===
  {
    id: "respond-negative-review",
    title: "Respond to a Negative Review",
    prompt: "Help me write a professional, empathetic response to this negative review of my [TYPE OF BUSINESS]: [PASTE REVIEW]. I want to acknowledge their concern, apologize where appropriate without admitting fault unnecessarily, offer a resolution, and show other potential customers that I take feedback seriously. Keep it under 150 words.",
    audience: ["business"],
    category: "communication",
    tags: ["reviews", "customer service", "reputation management"],
    useCase: "When you receive a negative review on Google, Yelp, or social media and need to respond professionally",
    icon: MessageSquare,
  },
  {
    id: "job-posting",
    title: "Write a Job Posting",
    prompt: "Write a clear, compelling job posting for a [JOB TITLE] at my [TYPE OF BUSINESS]. The role involves: [KEY RESPONSIBILITIES]. Required experience: [LIST]. The pay range is [RANGE]. Include what makes our company a good place to work: [CULTURE/BENEFITS]. Keep it conversational, not corporate. Make it inclusive and welcoming to diverse candidates.",
    audience: ["business"],
    category: "work",
    tags: ["hiring", "job posting", "recruitment", "HR"],
    useCase: "When you need to hire and want a job posting that attracts good candidates",
    icon: Briefcase,
  },
  {
    id: "social-media-plan",
    title: "Create a Social Media Content Plan",
    prompt: "Create a 2-week social media content plan for my [TYPE OF BUSINESS]. I'm active on [PLATFORMS]. My target audience is [DESCRIBE]. Include: specific post ideas with captions, best times to post, relevant hashtags, and a mix of content types (educational, promotional, behind-the-scenes, engagement). I post [NUMBER] times per week.",
    audience: ["business"],
    category: "work",
    tags: ["social media", "marketing", "content planning", "small business"],
    useCase: "When you know you should be posting on social media but never know what to say",
    icon: Target,
  },
  {
    id: "contract-review",
    title: "Review This Contract Before I Sign",
    prompt: "Review this contract/agreement and explain it in plain language. Highlight: any unusual or potentially unfavorable terms, auto-renewal clauses, hidden fees, liability issues, and anything I should negotiate before signing. Here's the contract text: [PASTE CONTRACT — remove sensitive details first]",
    audience: ["business", "everyday"],
    category: "finance",
    tags: ["contract", "legal", "business", "review"],
    useCase: "Before signing a vendor contract, lease, or business agreement",
    safetyNote: "AI analysis is not legal advice. For significant contracts, consult a lawyer. Remove sensitive business details before pasting.",
    icon: FileText,
  },
  {
    id: "customer-email-templates",
    title: "Create Customer Email Templates",
    prompt: "Create 5 professional email templates for my [TYPE OF BUSINESS]: 1) Welcome email for new customers, 2) Follow-up after a purchase/service, 3) Requesting a review or testimonial, 4) Responding to a common inquiry about [TOPIC], 5) Re-engaging a customer who hasn't returned in a while. Keep each under 150 words and include subject line suggestions.",
    audience: ["business"],
    category: "communication",
    tags: ["email templates", "customer communication", "automation"],
    useCase: "When you want consistent, professional communication without writing every email from scratch",
    icon: Mail,
  },
  {
    id: "competitor-analysis",
    title: "Analyze My Competition",
    prompt: "Help me analyze my competition. I run a [TYPE OF BUSINESS] in [LOCATION/MARKET]. My main competitors are: [LIST 2-3 COMPETITORS]. Compare us on: pricing, online presence, customer reviews, unique selling points, and weaknesses. What opportunities do I have that they're missing? What should I do differently?",
    audience: ["business"],
    category: "work",
    tags: ["competition", "strategy", "market analysis", "business planning"],
    useCase: "When you want to understand your market position and find opportunities to stand out",
    icon: Target,
  },
  {
    id: "business-security-audit",
    title: "Basic Cybersecurity Checklist for My Business",
    prompt: "Create a practical cybersecurity checklist for my small business. We have [NUMBER] employees, use [LIST TOOLS/SOFTWARE], and handle [TYPE OF DATA — customer info, payment data, etc.]. Focus on the most impactful, low-cost steps we can take immediately. Include: password policies, backup procedures, employee training basics, and what to do if we suspect a breach.",
    audience: ["business"],
    category: "safety",
    tags: ["cybersecurity", "business security", "compliance", "data protection"],
    useCase: "When you know your business should be more secure but don't know where to start",
    icon: Shield,
  },

  // === ADVANCED / CROSS-AUDIENCE ===
  {
    id: "ai-tool-comparison",
    title: "Which AI Tool Should I Use?",
    prompt: "I want to use AI for [DESCRIBE TASK — e.g., writing emails, summarizing documents, creating images, analyzing data]. Compare the main options (ChatGPT, Google Gemini, Claude, Copilot) for this specific use case. Which one is best for what I need? Are there free versions available? What are the privacy tradeoffs of each?",
    audience: ["everyday", "business", "students"],
    category: "tech",
    tags: ["AI tools", "comparison", "ChatGPT", "Gemini", "technology"],
    useCase: "When you're ready to start using AI but don't know which tool to choose",
    icon: Brain,
  },
  {
    id: "verify-ai-output",
    title: "How to Verify What AI Tells Me",
    prompt: "I asked an AI tool this question: [YOUR QUESTION]. It gave me this answer: [PASTE AI RESPONSE]. How can I verify if this information is accurate? Give me specific steps to fact-check this, including what sources to check and what red flags to look for. What parts of AI responses are most likely to be wrong?",
    audience: ["everyday", "seniors", "students"],
    category: "safety",
    tags: ["fact-checking", "verification", "AI accuracy", "misinformation"],
    useCase: "When an AI gives you information that you want to verify before acting on it",
    icon: Search,
  },
  {
    id: "resume-improvement",
    title: "Improve My Resume",
    prompt: "Review my resume and suggest improvements. I'm applying for [JOB TITLE/INDUSTRY] roles. Focus on: making my experience sound more impactful using action verbs, identifying gaps or weaknesses, suggesting a better format or structure, and tailoring it for [SPECIFIC INDUSTRY]. Here's my current resume text: [PASTE RESUME — remove personal contact info first]",
    audience: ["everyday", "students"],
    category: "work",
    tags: ["resume", "job search", "career", "writing"],
    useCase: "When updating your resume for a job search",
    safetyNote: "Remove your home address, phone number, and email before pasting your resume into AI tools.",
    icon: FileText,
  },
  {
    id: "learn-new-skill",
    title: "Learn Something New in 30 Days",
    prompt: "Create a 30-day learning plan for [SKILL/TOPIC]. I'm a complete beginner and can spend about [MINUTES/HOURS] per day. Break it into weekly milestones with specific daily tasks. Include: free resources (YouTube channels, websites, apps), practical exercises, and a way to track my progress. By day 30, I should be able to [SPECIFIC GOAL].",
    audience: ["everyday", "students", "seniors"],
    category: "learning",
    tags: ["learning plan", "self-improvement", "skills", "goals"],
    useCase: "When you want to pick up a new hobby or skill but need a structured approach",
    icon: BookOpen,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleCopy}
      data-testid="button-copy-prompt"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 mr-1.5" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 mr-1.5" />
          Copy Prompt
        </>
      )}
    </Button>
  );
}

function PromptCard({ prompt: p }: { prompt: Prompt }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover-elevate" data-testid={`card-prompt-${p.id}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <p.icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm leading-tight">{p.title}</h3>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.find(c => c.id === p.category) && (
                <Badge variant="secondary" className="text-xs">
                  {categories.find(c => c.id === p.category)?.label}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-3">{p.useCase}</p>

          <div
            className={`relative bg-muted/50 rounded-md p-3.5 mb-3 text-sm text-foreground leading-relaxed ${
              !expanded && p.prompt.length > 200 ? "max-h-28 overflow-hidden" : ""
            }`}
            data-testid={`text-prompt-${p.id}`}
          >
            <code className="text-sm whitespace-pre-wrap break-words font-mono">{p.prompt}</code>
            {!expanded && p.prompt.length > 200 && (
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-muted/80 to-transparent" />
            )}
          </div>

          {p.prompt.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary mb-3 cursor-pointer"
              data-testid={`button-expand-${p.id}`}
            >
              {expanded ? "Show less" : "Show full prompt"}
            </button>
          )}

          {p.safetyNote && (
            <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 rounded-md p-2.5 mb-3 text-xs">
              <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span className="text-amber-700 dark:text-amber-300">{p.safetyNote}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 flex-wrap">
              {p.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <CopyButton text={p.prompt} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AIPrompts() {
  const [selectedAudience, setSelectedAudience] = useState<Audience>("all");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      const matchesAudience = selectedAudience === "all" || p.audience.includes(selectedAudience);
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchesSearch = searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.useCase.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAudience && matchesCategory && matchesSearch;
    });
  }, [selectedAudience, selectedCategory, searchQuery]);

  const audienceCounts = useMemo(() => {
    const counts: Record<string, number> = { all: prompts.length };
    audiences.forEach(a => {
      if (a.id !== "all") {
        counts[a.id] = prompts.filter(p => p.audience.includes(a.id as Audience)).length;
      }
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.tools} title="AI Prompt Library — Ready-to-Use Templates for Everyday Life | GetCyberRight" description="A free, comprehensive collection of AI prompts for families, seniors, students, and small businesses. Copy, paste, and use — no AI experience required." />
      <Navigation />

      <PageBanner
        title="AI Prompt Library"
        subtitle="Ready-to-use AI templates for everyday life. Copy, paste, and get things done — no experience needed."
        imageSrc={bannerImage}
        imageAlt="AI Prompt Library banner with neural network patterns"
        colorVariant="teal"
      />

      <main id="main-content" className="py-12">
        <div className="container mx-auto px-4">
          {/* Intro Section */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-prompt-count">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {prompts.length} Prompts
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4" data-testid="heading-prompt-library">
              AI Made Simple
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You don't need to be a tech expert to use AI well. These templates are written for real people with real tasks — from planning meals to spotting scams. Just copy a prompt, paste it into any AI tool (ChatGPT, Google Gemini, Claude, Copilot), fill in the brackets, and go.
            </p>
          </div>

          {/* Safety Banner */}
          <Card className="mb-10 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20" data-testid="card-safety-reminder">
            <CardContent className="py-5 px-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">Before You Start</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Never share passwords, Social Security numbers, credit card details, or medical IDs with AI tools.
                    AI responses can be wrong — always verify important information.
                    These prompts work with any major AI tool.{" "}
                    <Link href="/ai-safety" className="text-primary underline" data-testid="link-ai-safety-tips">
                      Learn more about AI safety
                    </Link>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audience Tabs */}
          <Tabs value={selectedAudience} onValueChange={(v) => { setSelectedAudience(v as Audience); setSelectedCategory("all"); }} className="mb-8">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0" data-testid="tabs-audience">
              {audiences.map(a => (
                <TabsTrigger
                  key={a.id}
                  value={a.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-2 text-sm"
                  data-testid={`tab-audience-${a.id}`}
                >
                  <a.icon className="w-4 h-4 mr-1.5" />
                  {a.label}
                  <span className="ml-1.5 text-xs opacity-70">({audienceCounts[a.id] || 0})</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Search + Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-prompts"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map(c => (
                <Button
                  key={c.id}
                  size="sm"
                  variant={selectedCategory === c.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(c.id)}
                  data-testid={`button-category-${c.id}`}
                >
                  {c.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6" data-testid="text-results-count">
            Showing {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""}
            {selectedAudience !== "all" && ` for ${audiences.find(a => a.id === selectedAudience)?.label}`}
            {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.label}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>

          {/* Prompt Grid */}
          {filteredPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="grid-prompts">
              {filteredPrompts.map(p => (
                <PromptCard key={p.id} prompt={p} />
              ))}
            </div>
          ) : (
            <Card className="py-16 text-center">
              <CardContent>
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No prompts found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <Button
                  variant="outline"
                  onClick={() => { setSearchQuery(""); setSelectedAudience("all"); setSelectedCategory("all"); }}
                  data-testid="button-clear-filters"
                >
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* How to Use Section */}
          <section className="mt-16 mb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground text-center mb-8" data-testid="heading-how-to-use">
                How to Use These Prompts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  {
                    step: "1",
                    title: "Copy",
                    description: "Find a prompt that fits your situation and click \"Copy Prompt\" to copy it to your clipboard.",
                    icon: Copy,
                  },
                  {
                    step: "2",
                    title: "Customize",
                    description: "Paste it into any AI tool and replace the [BRACKETS] with your specific details. The more detail you add, the better the result.",
                    icon: Zap,
                  },
                  {
                    step: "3",
                    title: "Verify",
                    description: "Always double-check important information the AI gives you. AI can be wrong, especially about facts, numbers, and medical or legal advice.",
                    icon: Shield,
                  },
                ].map(item => (
                  <Card key={item.step} data-testid={`card-step-${item.step}`}>
                    <CardContent className="p-5 text-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-xs font-medium text-primary mb-1">Step {item.step}</div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0" data-testid="card-cta">
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Want to Learn How to Stay Safe with AI?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                AI is powerful — but it also creates new risks. Learn how to spot deepfakes, detect AI-generated scams, and protect your privacy when using AI tools.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button size="lg" asChild data-testid="button-ai-safety">
                  <Link href="/ai-safety">
                    AI Safety Guide
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="button-training">
                  <Link href="/training">
                    Training Academy
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}