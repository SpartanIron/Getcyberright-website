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
    prompt: "You are a personal productivity coach. Create a realistic daily schedule for me based on the following details.\n\nWake-up time: [TIME]\nBedtime: [TIME]\nTasks I need to complete today: [LIST YOUR TASKS]\n\nInstructions:\n1. Rank tasks by urgency and importance.\n2. Schedule the most demanding tasks during my peak energy hours (typically mid-morning).\n3. Insert a 10-minute break after every 90 minutes of focused work.\n4. Block 30 minutes for meals.\n5. Leave one 30-minute buffer for unexpected tasks.\n6. Present the schedule as a simple time-blocked table.",
    audience: ["everyday", "seniors"],
    category: "productivity",
    tags: ["planning", "time management", "daily routine"],
    useCase: "When you have a busy day ahead and need help organizing your time effectively.",
    icon: Clock,
  },
  {
    id: "summarize-article",
    title: "Summarize a Long Article",
    prompt: "Summarize the following article in exactly 5 bullet points. Each bullet should be one clear sentence that captures a key takeaway. Use plain language that a non-expert would understand. After the bullets, add one sentence explaining why this article matters.\n\nArticle text:\n[PASTE ARTICLE TEXT]",
    audience: ["everyday", "seniors", "students"],
    category: "productivity",
    tags: ["summarize", "reading", "news"],
    useCase: "When you need the key points from a long article without reading the whole thing.",
    icon: FileText,
  },
  {
    id: "simplify-document",
    title: "Simplify a Confusing Document",
    prompt: "You are a plain-language translator. Read the following document and rewrite it so a high school student could understand it.\n\nFor each section:\n1. Replace jargon and legal terms with everyday words.\n2. Explain what it actually means for me as the reader.\n3. Flag anything that could be a concern or that I should ask questions about.\n4. Highlight any deadlines, fees, or commitments I should be aware of.\n\nDocument text:\n[PASTE DOCUMENT]",
    audience: ["everyday", "seniors"],
    category: "productivity",
    tags: ["simplify", "legal", "contracts", "documents"],
    useCase: "When you receive a contract, policy update, or official letter you do not fully understand.",
    icon: FileText,
  },
  {
    id: "weekly-meals",
    title: "Plan Weekly Meals on a Budget",
    prompt: "Create a practical 7-day meal plan for [NUMBER] people with a weekly grocery budget of approximately $[AMOUNT].\n\nRequirements:\n- Include breakfast, lunch, and dinner for each day.\n- Use simple recipes with 6 or fewer common ingredients.\n- Reuse ingredients across multiple meals to reduce waste.\n- Dietary needs: [LIST ANY RESTRICTIONS, OR TYPE \"NONE\"].\n\nFormat the output as:\n1. A day-by-day meal plan.\n2. A grocery list organized by store section (produce, dairy, pantry, protein, frozen).\n3. Two meal-prep tips to save time during the week.",
    audience: ["everyday", "families", "seniors"],
    category: "productivity",
    tags: ["meal planning", "cooking", "budget", "grocery"],
    useCase: "When you need to plan affordable meals for the week without spending hours on it.",
    icon: ShoppingCart,
  },
  {
    id: "declutter-home",
    title: "Organize and Declutter",
    prompt: "Create a step-by-step decluttering plan for my [ROOM/SPACE].\n\nConstraints:\n- I can spend about [TIME] per day on this project.\n- Spread the plan across [NUMBER] days.\n\nFor each day, give me:\n1. One specific area or category to focus on.\n2. A clear \"keep, donate, discard\" decision rule for that category.\n3. A small reward or milestone to celebrate when that day is done.\n\nEnd with three tips for staying organized once the space is clean.",
    audience: ["everyday", "seniors"],
    category: "productivity",
    tags: ["organizing", "home", "cleaning"],
    useCase: "When your space feels overwhelming and you need a manageable, step-by-step plan.",
    icon: Home,
  },
  {
    id: "compare-products",
    title: "Compare Products Before Buying",
    prompt: "I am deciding between these options: [LIST 2-3 PRODUCTS OR SERVICES WITH PRICES IF KNOWN].\n\nCompare them in a table with the following columns: Feature, Option A, Option B, Option C.\n\nEvaluate each on:\n- Price and long-term value.\n- Quality and durability.\n- Ease of use.\n- Customer reviews summary.\n\nThen recommend the best choice for someone who [DESCRIBE YOUR SITUATION AND PRIORITIES]. Explain your reasoning in 2-3 sentences.",
    audience: ["everyday", "seniors"],
    category: "finance",
    tags: ["shopping", "comparison", "decision making"],
    useCase: "Before making a purchase, especially for electronics, appliances, or services.",
    icon: Scale,
  },

  // === COMMUNICATION ===
  {
    id: "professional-email",
    title: "Write a Professional Email",
    prompt: "Write a professional email on my behalf using the details below.\n\nRecipient: [WHO (e.g., landlord, company, school administrator)]\nPurpose: [WHAT YOU NEED]\nDesired outcome: [WHAT YOU WANT TO HAPPEN]\nKey facts to include: [RELEVANT DETAILS]\n\nTone: Polite, confident, and direct. Keep the email under 200 words. Include a clear subject line, a brief opening, the main request with supporting facts, and a professional closing.",
    audience: ["everyday", "seniors", "business"],
    category: "communication",
    tags: ["email", "writing", "professional"],
    useCase: "When you need to write an important email and want to get the tone right.",
    icon: Mail,
  },
  {
    id: "complaint-letter",
    title: "Write a Polite Complaint",
    prompt: "Write a professional complaint letter on my behalf.\n\nCompany or organization: [NAME]\nIssue: [DESCRIBE THE PROBLEM]\nTimeline: [WHEN IT HAPPENED AND KEY DATES]\nReference numbers: [ORDER NUMBER, CASE ID, OR ACCOUNT NUMBER]\nDesired resolution: [WHAT YOU WANT THEM TO DO]\n\nThe letter should be firm but respectful, under 250 words, and structured as follows:\n1. State the issue clearly in the opening sentence.\n2. Present the facts in chronological order.\n3. Reference any relevant policies or guarantees.\n4. State exactly what resolution I expect and by when.\n5. Close professionally with contact information.",
    audience: ["everyday", "seniors"],
    category: "communication",
    tags: ["complaint", "customer service", "writing"],
    useCase: "When you have received bad service or a defective product and need to escalate.",
    icon: MessageSquare,
  },
  {
    id: "difficult-conversation",
    title: "Prepare for a Difficult Conversation",
    prompt: "Help me prepare for a difficult conversation.\n\nWho I am speaking with: [RELATIONSHIP]\nTopic: [WHAT THE CONVERSATION IS ABOUT]\nMy main points: [LIST 2-4 THINGS YOU WANT TO SAY]\nMy goal: [WHAT OUTCOME YOU HOPE FOR]\n\nProvide:\n1. A calm, non-confrontational opening sentence.\n2. A way to frame each point using \"I\" statements instead of accusations.\n3. Two responses I can use if the other person gets defensive.\n4. A way to end the conversation on a constructive note, even if we disagree.",
    audience: ["everyday", "families"],
    category: "communication",
    tags: ["conversation", "conflict resolution", "relationships"],
    useCase: "Before a tough talk with a family member, neighbor, coworker, or friend.",
    icon: MessageSquare,
  },
  {
    id: "thank-you-note",
    title: "Write a Thoughtful Thank-You Note",
    prompt: "Write a heartfelt thank-you message using these details.\n\nRecipient: [WHO]\nWhat they did: [THE KINDNESS OR GIFT]\nOur relationship: [BRIEF CONTEXT]\nTone: [CASUAL/FORMAL]\nLength: [SHORT (3-4 SENTENCES) / MEDIUM (1 PARAGRAPH) / LONG (2-3 PARAGRAPHS)]\n\nMake it feel genuine and personal, not like a template. Reference something specific about our relationship or what their gesture meant to me.",
    audience: ["everyday", "seniors"],
    category: "communication",
    tags: ["thank you", "gratitude", "writing"],
    useCase: "After receiving a gift, help, or kindness that you want to acknowledge properly.",
    icon: Heart,
  },
  {
    id: "explain-to-child",
    title: "Explain Something to My Child",
    prompt: "Help me explain [TOPIC] to my [AGE]-year-old child.\n\nRules:\n1. Use simple words and short sentences.\n2. Include one relatable analogy from their everyday life.\n3. Avoid anything frightening or overly complex.\n4. End with the key takeaway I want them to remember: [KEY TAKEAWAY].\n5. Suggest one follow-up activity or question to check if they understood.",
    audience: ["families"],
    category: "communication",
    tags: ["parenting", "kids", "education", "explaining"],
    useCase: "When your child asks a tough question or you need to teach them something important.",
    icon: Users,
  },

  // === SAFETY & PRIVACY ===
  {
    id: "check-scam-email",
    title: "Is This Email a Scam?",
    prompt: "Analyze the following email for scam indicators. Evaluate each of these red flags and explain whether it is present:\n\n1. Urgency or pressure tactics.\n2. Suspicious or spoofed sender address.\n3. Grammar and spelling errors.\n4. Requests for personal, financial, or login information.\n5. Suspicious links or attachments.\n6. Impersonation of a known brand or authority.\n7. Offers that seem too good to be true.\n\nGive me a risk rating (Low, Medium, or High) with a one-sentence explanation. Then tell me what I should do next.\n\nEmail text:\n[PASTE EMAIL TEXT HERE]",
    audience: ["everyday", "seniors", "families"],
    category: "safety",
    tags: ["scam", "phishing", "email security"],
    useCase: "When you receive a suspicious email and want to check before responding or clicking anything.",
    safetyNote: "Never paste passwords, credit card numbers, or Social Security numbers into AI tools. Only paste the email text itself.",
    icon: AlertTriangle,
  },
  {
    id: "check-text-message",
    title: "Is This Text Message Legit?",
    prompt: "I received the following text message and need help determining if it is legitimate or a scam.\n\nAnalyze it for these red flags:\n1. Fake urgency (e.g., \"act now\" or \"your account will be closed\").\n2. Suspicious or shortened links.\n3. Requests for personal information, passwords, or payment.\n4. Impersonation of a known company or government agency.\n5. Too-good-to-be-true offers.\n\nGive me a verdict (Likely Legitimate, Suspicious, or Almost Certainly a Scam) with a brief explanation. Then tell me exactly what to do next.\n\nMessage text:\n[PASTE MESSAGE TEXT]",
    audience: ["everyday", "seniors"],
    category: "safety",
    tags: ["scam", "smishing", "text message", "phone safety"],
    useCase: "When you get a text from an unknown number or a message that seems suspicious.",
    safetyNote: "Do not click any links in suspicious texts. Only paste the text content here for analysis.",
    icon: Shield,
  },
  {
    id: "privacy-settings",
    title: "Review My Privacy Settings",
    prompt: "Give me a step-by-step guide to securing my privacy settings on [PLATFORM (e.g., Facebook, Instagram, Google, iPhone, or Android)].\n\nFor each setting:\n1. Tell me exactly where to find it (menu path).\n2. Explain what it controls in one sentence.\n3. Tell me the recommended setting and why.\n\nFocus only on the settings that have the biggest impact on my safety and data exposure. Skip anything cosmetic or low-priority. Organize the steps from most important to least important.",
    audience: ["everyday", "seniors", "families"],
    category: "safety",
    tags: ["privacy", "social media", "settings", "account security"],
    useCase: "When you want to tighten your privacy on social media or your phone but do not know where to start.",
    icon: Lock,
  },
  {
    id: "strong-password",
    title: "Create Strong Passwords I Can Remember",
    prompt: "Generate 5 strong, unique passwords using the passphrase method.\n\nRequirements for each password:\n- At least 16 characters long.\n- Combine 3-4 random, unrelated words.\n- Include at least one number and one special character.\n- Easy to visualize or remember.\n\nFor each password:\n1. Show the password.\n2. Provide a memory trick to remember it.\n3. Rate its strength (Strong or Very Strong).\n\nThen explain in 2-3 sentences why reusing passwords across sites is dangerous and what happens when one site gets breached.",
    audience: ["everyday", "seniors"],
    category: "safety",
    tags: ["passwords", "security", "account protection"],
    useCase: "When you need new passwords for important accounts and want them to be both strong and memorable.",
    safetyNote: "Never share your actual passwords with AI tools. Use these as templates and modify them before use.",
    icon: Lock,
  },
  {
    id: "online-safety-kids",
    title: "Set Up Safe Internet for My Kids",
    prompt: "Create an age-appropriate internet safety plan for my child.\n\nChild's age: [AGE]\nDevices they use: [LIST DEVICES]\n\nInclude the following sections:\n1. Recommended parental controls for their specific devices and age.\n2. Screen time guidelines (weekdays vs. weekends).\n3. A list of 5 apps or platforms to monitor closely at their age, with reasons why.\n4. Three conversation starters I can use to talk about online safety without lecturing.\n5. Warning signs that my child may be encountering something harmful online.\n6. A simple family agreement we can both sign.",
    audience: ["families"],
    category: "safety",
    tags: ["kids", "parental controls", "online safety", "screen time"],
    useCase: "When setting up devices for your child or updating your family's online safety rules.",
    icon: Shield,
  },
  {
    id: "ai-privacy-check",
    title: "What Should I Never Tell AI?",
    prompt: "Create a clear, categorized list of information I should never share with AI tools like ChatGPT, Gemini, Claude, or Copilot.\n\nOrganize it into these categories:\n1. Financial information.\n2. Personal identity details.\n3. Medical information.\n4. Work and business data.\n5. Passwords and security credentials.\n\nFor each item, explain in one sentence why sharing it is risky. Then provide step-by-step instructions for turning off chat history and data training in ChatGPT, Google Gemini, and Microsoft Copilot.",
    audience: ["everyday", "seniors", "students", "business"],
    category: "safety",
    tags: ["AI privacy", "data protection", "ChatGPT safety"],
    useCase: "Before you start using AI tools regularly, so you know the ground rules for protecting your information.",
    safetyNote: "This prompt itself is safe to use. It teaches you what to avoid sharing in future conversations.",
    icon: Brain,
  },
  {
    id: "spot-deepfake",
    title: "How to Spot a Deepfake",
    prompt: "Teach me how to identify AI-generated fake content in simple, practical terms.\n\nCover these three types:\n1. Deepfake videos: What visual clues to look for (face, lighting, blinking, lip sync).\n2. Fake images: How to check for AI artifacts, distorted text, and unnatural backgrounds.\n3. Cloned audio: What makes an AI-generated voice sound different from a real one.\n\nFor each type, give me one real-world example of how it has been used in a scam. Then list 2-3 free tools or websites I can use to verify whether content is AI-generated.",
    audience: ["everyday", "seniors", "families", "students"],
    category: "safety",
    tags: ["deepfakes", "AI detection", "misinformation", "verification"],
    useCase: "When you see a suspicious video or image, or receive an unusual call and want to know if it is real.",
    icon: AlertTriangle,
  },
  {
    id: "data-breach-response",
    title: "What to Do After a Data Breach",
    prompt: "I just learned that my information may have been exposed in a data breach at [COMPANY/SERVICE].\n\nGive me an immediate action plan in priority order:\n1. Which passwords to change first and how to choose secure replacements.\n2. How to check if my email or personal data is being sold or misused.\n3. Whether I should place a credit freeze or fraud alert, and how to do it with each bureau.\n4. Who to contact (the breached company, my bank, the FTC).\n5. What ongoing monitoring I should set up.\n\nKeep each step actionable with specific instructions, not general advice.",
    audience: ["everyday", "seniors", "business"],
    category: "safety",
    tags: ["data breach", "identity theft", "credit freeze", "incident response"],
    useCase: "When you receive a breach notification or hear that a service you use has been compromised.",
    icon: AlertTriangle,
  },

  // === HEALTH & WELLNESS ===
  {
    id: "medical-bill",
    title: "Understand My Medical Bill",
    prompt: "Help me understand the following medical bill by explaining each charge in plain language.\n\nFor each line item:\n1. Explain what the charge is for in simple terms.\n2. Flag anything that looks unusual, duplicated, or higher than typical.\n3. Suggest questions I should ask my insurance company or billing department.\n\nEnd with a checklist of steps I can take if I believe any charges are incorrect.\n\nBill details:\n[PASTE BILL DETAILS HERE (remove your name, account numbers, and personal information first)]",
    audience: ["everyday", "seniors"],
    category: "health",
    tags: ["medical", "billing", "healthcare", "insurance"],
    useCase: "When you receive a confusing medical bill and want to understand what you are being charged for.",
    safetyNote: "Remove your name, patient ID, account numbers, and any personal details before pasting bill information.",
    icon: Stethoscope,
  },
  {
    id: "doctor-questions",
    title: "Prepare Questions for My Doctor",
    prompt: "Help me prepare for a doctor's appointment about [HEALTH CONCERN].\n\nMy details: I am [AGE] years old and my general health is [BRIEF DESCRIPTION].\n\nCreate a prioritized list of questions organized by category:\n1. Diagnosis: What tests might I need? What conditions should be ruled out?\n2. Treatment: What are my options? What are the benefits and risks of each?\n3. Medications: What side effects should I watch for? How long will I need them?\n4. Lifestyle: What changes to diet, exercise, or habits could help?\n5. Follow-up: When should I come back? What symptoms should prompt an urgent visit?\n\nKeep questions clear and specific so I can take this list to my appointment.",
    audience: ["everyday", "seniors"],
    category: "health",
    tags: ["doctor", "health", "medical appointment", "preparation"],
    useCase: "Before a doctor's appointment, especially for a new health concern.",
    safetyNote: "AI is not a substitute for medical advice. Use these questions as a starting point for your conversation with your doctor.",
    icon: Stethoscope,
  },
  {
    id: "exercise-plan",
    title: "Simple Exercise Routine",
    prompt: "Design a safe, beginner-friendly exercise routine I can do at home with no equipment.\n\nMy details:\n- Age: [AGE]\n- Fitness level: [BEGINNER/MODERATE]\n- Physical limitations: [DESCRIBE ANY, OR TYPE \"NONE\"]\n- Available time: [MINUTES] per day, [DAYS] per week\n- Goal: Improve [STRENGTH/FLEXIBILITY/BALANCE/GENERAL FITNESS]\n\nProvide:\n1. A warm-up (3-5 minutes).\n2. The main routine with exercise name, reps or duration, and a brief description of proper form.\n3. A cool-down and stretching sequence (3-5 minutes).\n4. A weekly progression plan so I gradually build up over 4 weeks.",
    audience: ["everyday", "seniors"],
    category: "health",
    tags: ["exercise", "fitness", "wellness", "home workout"],
    useCase: "When you want to start exercising but do not know where to begin or have physical limitations.",
    safetyNote: "Always consult your doctor before starting a new exercise program, especially if you have health conditions.",
    icon: Stethoscope,
  },
  {
    id: "medication-organizer",
    title: "Organize My Medications",
    prompt: "Create a clear daily medication schedule based on the following list.\n\nMy medications and dosages:\n[LIST EACH MEDICATION AND DOSAGE]\n\nOrganize them into a table with columns for: Time of Day (Morning, Afternoon, Evening, Bedtime), Medication Name, Dosage, and Special Instructions.\n\nFor each medication, note:\n- Whether it should be taken with food or on an empty stomach.\n- Common interactions with other medications on the list.\n- What to do if I miss a dose.\n\nEnd with a reminder to verify this schedule with my pharmacist.",
    audience: ["seniors"],
    category: "health",
    tags: ["medication", "health management", "schedule", "reminders"],
    useCase: "When you take multiple medications and need a clear, organized schedule.",
    safetyNote: "Always verify medication information with your pharmacist or doctor. AI should supplement, not replace, professional medical guidance.",
    icon: Clock,
  },

  // === FINANCE ===
  {
    id: "monthly-budget",
    title: "Create a Monthly Budget",
    prompt: "Help me build a monthly budget using the 50/30/20 method.\n\nMy details:\n- Monthly take-home pay: approximately $[AMOUNT]\n- Fixed expenses: [LIST RENT, UTILITIES, INSURANCE, LOAN PAYMENTS, ETC.]\n- Financial goals: [SAVING FOR SOMETHING SPECIFIC, PAYING OFF DEBT, ETC.]\n\nCreate a budget breakdown with:\n1. Needs (50%): List my fixed expenses and how much is left for essentials like groceries and transportation.\n2. Wants (30%): Suggest a realistic allocation for dining out, entertainment, and personal spending.\n3. Savings (20%): Recommend how to split this between emergency fund and other goals.\n\nEnd with 3 specific tips for reducing my expenses based on what I listed.",
    audience: ["everyday", "seniors", "students"],
    category: "finance",
    tags: ["budget", "money management", "savings", "expenses"],
    useCase: "When you want to take control of your spending and start saving money.",
    safetyNote: "Do not share exact bank account balances, account numbers, or Social Security numbers. Round your income to the nearest hundred.",
    icon: DollarSign,
  },
  {
    id: "insurance-compare",
    title: "Compare Insurance Plans",
    prompt: "Help me compare these insurance options side by side.\n\nPlan details:\n[DESCRIBE 2-3 PLANS WITH PREMIUMS, DEDUCTIBLES, AND COVERAGE DETAILS]\n\nMy situation:\n- Age: [AGE]\n- Health status: [GENERAL DESCRIPTION]\n- Priorities: [LIST WHAT MATTERS MOST (e.g., prescription coverage, low deductible, specialist access)]\n\nCreate a comparison table with columns for each plan and rows for: Monthly Premium, Annual Deductible, Out-of-Pocket Maximum, Prescription Coverage, Specialist Access, and Network Size.\n\nThen recommend the best plan for my situation and explain your reasoning in 3-4 sentences.",
    audience: ["everyday", "seniors"],
    category: "finance",
    tags: ["insurance", "healthcare", "comparison", "decision making"],
    useCase: "During open enrollment or when choosing between insurance plans.",
    icon: DollarSign,
  },
  {
    id: "negotiate-bill",
    title: "Help Me Negotiate a Bill",
    prompt: "Write a phone script I can use to negotiate a lower rate on my [TYPE OF BILL (cable, internet, phone, or medical)] bill.\n\nCurrent provider: [COMPANY]\nCurrent monthly cost: $[AMOUNT]\nHow long I have been a customer: [DURATION]\n\nThe script should include:\n1. An opening that establishes me as a loyal customer.\n2. A specific request for a better rate.\n3. Competitor prices I can reference (suggest realistic examples).\n4. A response if they say no or offer something too small.\n5. An escalation line asking to speak with the retention department.\n6. A polite closing whether I accept or need to think about it.\n\nKeep the tone friendly but firm.",
    audience: ["everyday", "seniors"],
    category: "finance",
    tags: ["negotiation", "bills", "saving money", "customer service"],
    useCase: "When you feel like you are paying too much for a service and want to try negotiating.",
    icon: DollarSign,
  },

  // === FAMILIES & PARENTING ===
  {
    id: "screen-time-rules",
    title: "Create Family Screen Time Rules",
    prompt: "Help me create a family screen time agreement.\n\nChildren's ages: [LIST AGES]\n\nThe agreement should include:\n1. Daily screen time limits for school nights and weekends, adjusted by age.\n2. Approved content categories and specific apps or sites for each child.\n3. Device-free times (meals, bedtime, homework) and device-free zones.\n4. Consequences for breaking the rules, phrased as \"if/then\" statements.\n5. A section where the whole family agrees to the same core rules (including parents).\n\nKeep the tone positive. Frame rules as boundaries that protect fun, not punishments.",
    audience: ["families"],
    category: "productivity",
    tags: ["screen time", "parenting", "family rules", "digital wellness"],
    useCase: "When screen time is becoming a source of conflict and you need a clear, fair system.",
    icon: Users,
  },
  {
    id: "talk-about-cyberbullying",
    title: "Talk to My Kid About Cyberbullying",
    prompt: "Help me prepare a conversation with my [AGE]-year-old about cyberbullying.\n\nCreate a conversation guide that includes:\n1. A natural opening question to start the discussion without making it feel like a lecture.\n2. Age-appropriate examples of what cyberbullying looks like (not just mean messages, but also exclusion, rumor-spreading, fake accounts, and screenshot-sharing).\n3. Three things they should do if it happens to them.\n4. Two things they should do if they see it happening to someone else.\n5. A reassurance that they can always come to me without getting in trouble.\n6. A closing question that invites them to share anything on their mind.\n\nKeep the tone warm, supportive, and age-appropriate.",
    audience: ["families"],
    category: "safety",
    tags: ["cyberbullying", "kids", "online safety", "parenting"],
    useCase: "When you want to proactively discuss cyberbullying or your child has experienced it.",
    icon: Shield,
  },
  {
    id: "family-emergency-plan",
    title: "Create a Family Safety Plan",
    prompt: "Create a family digital safety plan for a household of [NUMBER] people aged [AGES].\n\nThe plan should include:\n1. A family code word system for verifying emergency calls (with instructions on how to use it).\n2. Rules for handling calls from someone claiming a family member is in danger.\n3. Step-by-step instructions for what to do if a phone or laptop is lost or stolen.\n4. A printable emergency contact list (not just stored on phones).\n5. A quarterly review checklist to keep the plan current.\n\nFormat it as a simple document the family can print and post at home.",
    audience: ["families"],
    category: "safety",
    tags: ["family safety", "emergency plan", "code word", "verification"],
    useCase: "To protect your family from AI voice cloning scams and other emergencies.",
    icon: Shield,
  },
  {
    id: "homework-help",
    title: "Help My Child Study (Without Doing It for Them)",
    prompt: "My child (age [AGE]) is struggling with [SUBJECT/TOPIC].\n\nHelp me support their learning without doing the work for them. Provide:\n1. A simple, age-appropriate explanation of the concept using a real-world example.\n2. Five practice questions at their level, starting easy and getting harder.\n3. The answer key for those questions (so I can check their work).\n4. Three tips for how I can help them study, even if I do not know the subject well.\n5. One encouraging thing I can say when they get frustrated.",
    audience: ["families"],
    category: "learning",
    tags: ["homework", "study", "parenting", "education"],
    useCase: "When your child needs help with schoolwork and you want to support without doing it for them.",
    icon: BookOpen,
  },

  // === SENIORS ===
  {
    id: "tech-help-phone",
    title: "Fix Something on My Phone",
    prompt: "I need help fixing a problem on my [iPhone/Android] phone.\n\nThe problem: [DESCRIBE WHAT IS HAPPENING (e.g., cannot connect to Wi-Fi, text is too small, getting too many notifications, camera is not working)]\n\nPlease walk me through the fix with these rules:\n1. Use simple, non-technical language.\n2. Number each step clearly.\n3. Tell me exactly what to tap and where to find it on screen.\n4. Describe what the screen should look like after each step so I know I did it right.\n5. If there are multiple possible solutions, start with the simplest one.\n6. Let me know if I might need someone else to help at any point.",
    audience: ["seniors"],
    category: "tech",
    tags: ["phone", "troubleshooting", "technology help", "step-by-step"],
    useCase: "When something is not working on your phone and you need clear, patient instructions.",
    icon: Wrench,
  },
  {
    id: "social-security-explain",
    title: "Explain Benefits in Plain Language",
    prompt: "Explain [Social Security benefits / Medicare / VA benefits / pension options] in plain language for someone who is not familiar with the system.\n\nMy situation: I am [AGE] years old and [BRIEF DESCRIPTION OF YOUR SITUATION].\n\nPlease cover:\n1. What I am likely eligible for based on my age and situation.\n2. Important deadlines I should be aware of, and what happens if I miss them.\n3. Common mistakes people make that cost them money or benefits.\n4. Steps I should take right now, in order of priority.\n5. Where to go for official, free help (not scam websites).\n\nKeep the language simple and avoid government jargon.",
    audience: ["seniors"],
    category: "finance",
    tags: ["benefits", "Social Security", "Medicare", "retirement"],
    useCase: "When you are approaching retirement or trying to understand your benefits options.",
    safetyNote: "Never share your Social Security number, Medicare ID, or banking details with AI tools.",
    icon: DollarSign,
  },
  {
    id: "letter-writing",
    title: "Write a Personal Letter",
    prompt: "Help me write a personal letter with the following details.\n\nType: [BIRTHDAY / SYMPATHY / CONGRATULATIONS / THINKING OF YOU / HOLIDAY]\nRecipient: [WHO (e.g., grandchild, old friend, neighbor)]\nA detail about our relationship: [SHARE A MEMORY OR SOMETHING SPECIAL ABOUT THEM]\nLength: [SHORT / MEDIUM / LONG]\nStyle: [WARM AND CASUAL / POLISHED AND FORMAL]\n\nMake it feel genuine and personal. Reference the specific detail I shared. Avoid cliches and generic phrases. End with something that invites a response or expresses looking forward to seeing them.",
    audience: ["seniors"],
    category: "communication",
    tags: ["letter writing", "personal", "relationships"],
    useCase: "When you want to write something meaningful but are struggling to find the right words.",
    icon: Mail,
  },
  {
    id: "scam-call-verify",
    title: "Verify a Suspicious Phone Call",
    prompt: "I received a phone call I am not sure about. Help me figure out if it was legitimate.\n\nCaller claimed to be from: [ORGANIZATION (e.g., bank, IRS, Medicare, or a family member)]\nWhat they said: [DESCRIBE WHAT THEY TOLD YOU]\nWhat they asked me to do: [WHAT THEY WANTED (e.g., provide account info, buy gift cards, send money)]\n\nAnalyze this call by:\n1. Identifying which scam pattern this matches (if any).\n2. Listing the specific red flags in what they said.\n3. Telling me whether the real organization would ever contact me this way.\n4. Giving me the official phone number I can call to verify independently.\n5. Telling me what to do right now, step by step.\n\nBe direct about the risk level: Low, Medium, or High.",
    audience: ["seniors", "everyday"],
    category: "safety",
    tags: ["phone scam", "verification", "fraud", "caller ID"],
    useCase: "After receiving a call that felt suspicious or pressured you to act quickly.",
    safetyNote: "If you have already given out personal information, contact your bank and local authorities immediately.",
    icon: AlertTriangle,
  },
  {
    id: "travel-planning-senior",
    title: "Plan an Accessible Trip",
    prompt: "Help me plan a [LENGTH]-day trip to [DESTINATION].\n\nMy needs:\n- Mobility considerations: [DESCRIBE ANY]\n- Budget: approximately $[AMOUNT]\n- Travel companions: [SOLO / WITH PARTNER / WITH FAMILY]\n\nProvide:\n1. Accessible accommodation recommendations with key accessibility features.\n2. Transportation options that accommodate my needs.\n3. A daily itinerary that is enjoyable without being physically exhausting.\n4. Tips for traveling with medications (TSA rules, time zone adjustments).\n5. Nearby emergency medical facilities and pharmacies.\n6. Packing essentials I might forget.",
    audience: ["seniors"],
    category: "productivity",
    tags: ["travel", "accessibility", "planning", "vacation"],
    useCase: "When planning a trip and need to account for mobility, health, or accessibility needs.",
    icon: Target,
  },

  // === STUDENTS ===
  {
    id: "essay-outline",
    title: "Outline an Essay (Do Not Write It for Me)",
    prompt: "Create a detailed outline for a [LENGTH]-word essay on [TOPIC]. Do NOT write the essay itself.\n\nProvide:\n1. A strong, arguable thesis statement.\n2. Three to four main arguments, each with:\n   - A topic sentence.\n   - Two supporting points or evidence types I should research.\n   - A suggested source type (academic journal, government report, news article).\n3. A logical paragraph structure showing how the arguments build on each other.\n4. An introduction strategy (hook, context, thesis).\n5. A conclusion strategy that goes beyond just repeating the thesis.\n6. Three transitional phrases I can use between sections.",
    audience: ["students"],
    category: "learning",
    tags: ["essay", "writing", "school", "outline"],
    useCase: "When you have an essay assignment and need help organizing your thoughts before writing.",
    safetyNote: "Using AI to outline is a study aid. Submitting AI-written text as your own work is academic dishonesty. Always check your school's AI policy.",
    icon: FileText,
  },
  {
    id: "study-quiz",
    title: "Quiz Me on What I Studied",
    prompt: "I just studied [TOPIC/CHAPTER] for my [CLASS] class. Test my understanding.\n\nCreate 10 quiz questions:\n- Questions 1-3: Multiple choice (4 options each).\n- Questions 4-6: True or false with a brief explanation.\n- Questions 7-9: Short answer requiring 1-2 sentences.\n- Question 10: One application question that requires me to use the concept in a new scenario.\n\nPresent all questions first without answers. Then provide a separate answer key with explanations for each correct answer, including why wrong answers are wrong.",
    audience: ["students"],
    category: "learning",
    tags: ["quiz", "study", "test prep", "review"],
    useCase: "After studying, to test yourself before an exam and find gaps in your knowledge.",
    icon: GraduationCap,
  },
  {
    id: "explain-concept",
    title: "Explain This Like I Am a Beginner",
    prompt: "Explain [CONCEPT/TOPIC] at three levels of complexity.\n\nLevel 1 (Everyday language): Use a real-world analogy that makes the concept immediately intuitive. No technical terms.\n\nLevel 2 (Intermediate): Introduce the proper terminology and explain how the parts connect.\n\nLevel 3 (Applied): Give me one specific exercise or problem I can work through to prove I understand it.\n\nContext: I am studying this for [CLASS/PURPOSE].\n\nEnd with one common misconception about this topic and why it is wrong.",
    audience: ["students", "everyday"],
    category: "learning",
    tags: ["explanation", "learning", "understanding", "analogies"],
    useCase: "When a textbook explanation is not making sense and you need it broken down differently.",
    icon: Lightbulb,
  },
  {
    id: "proofread-paper",
    title: "Proofread and Explain Corrections",
    prompt: "Proofread the following text for grammar, spelling, punctuation, and clarity.\n\nRules:\n1. Do not rewrite the text. Only suggest specific corrections.\n2. For each error, show the original text, the correction, and a one-sentence explanation of the rule.\n3. Identify sentences that are grammatically correct but could be clearer or more concise.\n4. At the end, list my three most frequent error types so I know what to watch for next time.\n\nText to proofread:\n[PASTE YOUR WRITING]",
    audience: ["students"],
    category: "communication",
    tags: ["proofreading", "grammar", "writing improvement"],
    useCase: "Before submitting an assignment, to catch errors and improve your writing skills.",
    safetyNote: "Check your school's AI policy before using AI for proofreading assignments.",
    icon: FileText,
  },
  {
    id: "study-schedule",
    title: "Create a Study Schedule",
    prompt: "Create a study schedule for the next [NUMBER] weeks.\n\nMy exams:\n[LIST EACH SUBJECT AND EXAM DATE]\n\nMy availability:\n- Hours I can study per day: [HOURS]\n- Days I am busy with work or activities: [LIST DAYS]\n- Subjects I struggle with most: [LIST]\n\nRequirements:\n1. Prioritize weaker subjects but do not neglect others.\n2. Use spaced repetition: revisit each subject at increasing intervals.\n3. Include 10-minute breaks every 50 minutes.\n4. Schedule review sessions 2 days before each exam.\n5. Leave one day per week completely free for rest.\n6. Present the schedule as a weekly calendar.",
    audience: ["students"],
    category: "productivity",
    tags: ["study plan", "exam prep", "time management", "scheduling"],
    useCase: "When finals or midterms are approaching and you need a structured study plan.",
    icon: Clock,
  },
  {
    id: "research-sources",
    title: "Find Research Directions",
    prompt: "I am researching [TOPIC] for a [TYPE OF PAPER (research paper, presentation, or report)].\n\nSuggest 5-7 specific subtopics or angles worth exploring. For each one, provide:\n1. The subtopic or research question.\n2. Why it is relevant and interesting.\n3. The best type of source to use (peer-reviewed journal, government data, industry report, expert interview).\n4. Two specific search terms I can use in a library database or Google Scholar.\n\nImportant: Do NOT generate citations, references, or source names. I will find real sources myself using your search terms.",
    audience: ["students"],
    category: "learning",
    tags: ["research", "sources", "academic", "paper"],
    useCase: "At the start of a research project when you need direction on where to look.",
    safetyNote: "AI can suggest research directions but may invent fake sources. Always verify citations through your library database.",
    icon: Search,
  },

  // === SMALL BUSINESS ===
  {
    id: "respond-negative-review",
    title: "Respond to a Negative Review",
    prompt: "Write a professional response to the following negative review of my business.\n\nBusiness type: [DESCRIBE YOUR BUSINESS]\nReview:\n[PASTE THE REVIEW]\n\nThe response should:\n1. Thank the reviewer by name (if visible) for their feedback.\n2. Acknowledge their specific concern without being defensive.\n3. Apologize for the experience without admitting liability.\n4. Offer a concrete resolution or next step.\n5. Invite them to contact you directly to resolve the issue.\n6. Stay under 120 words.\n\nThe tone should be empathetic and professional, since other potential customers will read this response too.",
    audience: ["business"],
    category: "communication",
    tags: ["reviews", "customer service", "reputation management"],
    useCase: "When you receive a negative review on Google, Yelp, or social media and need to respond professionally.",
    icon: MessageSquare,
  },
  {
    id: "job-posting",
    title: "Write a Job Posting",
    prompt: "Write a compelling job posting using these details.\n\nJob title: [TITLE]\nBusiness type: [TYPE OF BUSINESS]\nKey responsibilities: [LIST 3-5 MAIN DUTIES]\nRequired experience: [LIST REQUIREMENTS]\nPay range: [RANGE]\nWhat makes this a great place to work: [CULTURE, BENEFITS, PERKS]\n\nStructure the posting as:\n1. A hook (1-2 sentences about why someone would want this job).\n2. About the role (responsibilities).\n3. What you bring (requirements).\n4. What we offer (compensation and culture).\n5. How to apply.\n\nKeep the tone conversational and welcoming. Use inclusive language throughout.",
    audience: ["business"],
    category: "work",
    tags: ["hiring", "job posting", "recruitment", "HR"],
    useCase: "When you need to hire and want a job posting that attracts the right candidates.",
    icon: Briefcase,
  },
  {
    id: "social-media-plan",
    title: "Create a Social Media Content Plan",
    prompt: "Create a 2-week social media content plan for my business.\n\nBusiness type: [DESCRIBE YOUR BUSINESS]\nActive platforms: [LIST PLATFORMS]\nTarget audience: [DESCRIBE YOUR IDEAL CUSTOMER]\nPosting frequency: [NUMBER] times per week\n\nFor each post, provide:\n1. The platform it is for.\n2. Content type (educational, promotional, behind-the-scenes, or engagement).\n3. A draft caption under 100 words.\n4. Suggested hashtags (5-8 per post).\n5. Best day and time to post.\n\nInclude a mix: 40% educational or valuable content, 30% engagement and conversation starters, 20% promotional, and 10% behind-the-scenes.",
    audience: ["business"],
    category: "work",
    tags: ["social media", "marketing", "content planning", "small business"],
    useCase: "When you know you should be posting on social media but never know what to say.",
    icon: Target,
  },
  {
    id: "contract-review",
    title: "Review This Contract Before I Sign",
    prompt: "Review the following contract and explain it in plain language.\n\nFor each section, identify:\n1. What it means in simple terms.\n2. Whether it is standard or unusual.\n3. Any terms that could be unfavorable to me.\n4. Auto-renewal clauses and how to cancel.\n5. Hidden fees, penalties, or escalation clauses.\n6. Liability or indemnification issues.\n\nEnd with a summary: \"Sign as-is,\" \"Negotiate these points first,\" or \"Consult a lawyer before signing.\"\n\nContract text:\n[PASTE CONTRACT TEXT (remove sensitive details first)]",
    audience: ["business", "everyday"],
    category: "finance",
    tags: ["contract", "legal", "business", "review"],
    useCase: "Before signing a vendor contract, lease, or business agreement.",
    safetyNote: "AI analysis is not legal advice. For significant contracts, consult a lawyer. Remove sensitive business details before pasting.",
    icon: FileText,
  },
  {
    id: "customer-email-templates",
    title: "Create Customer Email Templates",
    prompt: "Create 5 professional email templates for my [TYPE OF BUSINESS].\n\nI need:\n1. Welcome email for new customers.\n2. Follow-up after a purchase or service.\n3. Request for a review or testimonial.\n4. Response to a common inquiry about [TOPIC].\n5. Re-engagement email for customers who have not returned in a while.\n\nFor each template:\n- Include a compelling subject line.\n- Keep the body under 120 words.\n- Include a clear call-to-action.\n- Use a warm but professional tone.\n- Add a placeholder for personalization (e.g., customer name, purchase details).",
    audience: ["business"],
    category: "communication",
    tags: ["email templates", "customer communication", "automation"],
    useCase: "When you want consistent, professional communication without writing every email from scratch.",
    icon: Mail,
  },
  {
    id: "competitor-analysis",
    title: "Analyze My Competition",
    prompt: "Help me analyze my competitive landscape.\n\nMy business: [TYPE OF BUSINESS] in [LOCATION/MARKET]\nMain competitors: [LIST 2-3 COMPETITORS]\n\nCompare us across these dimensions:\n1. Pricing and value proposition.\n2. Online presence and website quality.\n3. Customer review themes (strengths and complaints).\n4. Unique selling points.\n5. Weaknesses or gaps in their offering.\n\nThen answer:\n- What are 3 opportunities they are missing that I could capitalize on?\n- What is one thing they do better than me that I should learn from?\n- What is my strongest competitive advantage right now?",
    audience: ["business"],
    category: "work",
    tags: ["competition", "strategy", "market analysis", "business planning"],
    useCase: "When you want to understand your market position and find opportunities to stand out.",
    icon: Target,
  },
  {
    id: "business-security-audit",
    title: "Cybersecurity Checklist for My Business",
    prompt: "Create a practical cybersecurity checklist for my small business.\n\nBusiness details:\n- Number of employees: [NUMBER]\n- Tools and software we use: [LIST]\n- Types of data we handle: [CUSTOMER INFO / PAYMENT DATA / HEALTH RECORDS / ETC.]\n\nOrganize the checklist by priority:\n\nImmediate (do this week):\n- Password policies and multi-factor authentication.\n- Critical software updates.\n\nShort-term (this month):\n- Backup procedures and testing.\n- Employee security awareness basics.\n\nOngoing:\n- Monitoring and incident response plan.\n- Vendor security review.\n\nFor each item, give a one-line action step, not just a recommendation. End with a simple incident response checklist: what to do in the first 60 minutes if we suspect a breach.",
    audience: ["business"],
    category: "safety",
    tags: ["cybersecurity", "business security", "compliance", "data protection"],
    useCase: "When you know your business should be more secure but do not know where to start.",
    icon: Shield,
  },

  // === ADVANCED / CROSS-AUDIENCE ===
  {
    id: "ai-tool-comparison",
    title: "Which AI Tool Should I Use?",
    prompt: "I want to use AI for: [DESCRIBE YOUR TASK (e.g., writing emails, summarizing documents, creating images, or analyzing data)].\n\nCompare the following tools for my specific use case:\n- ChatGPT (OpenAI)\n- Google Gemini\n- Claude (Anthropic)\n- Microsoft Copilot\n\nFor each tool, tell me:\n1. How well it handles my specific task (rated Good, Very Good, or Excellent).\n2. Whether a free version is available and what its limitations are.\n3. The privacy tradeoff: what data the company keeps and how to minimize exposure.\n4. One standout feature for my use case.\n\nEnd with a clear recommendation: which tool I should start with and why.",
    audience: ["everyday", "business", "students"],
    category: "tech",
    tags: ["AI tools", "comparison", "ChatGPT", "Gemini", "technology"],
    useCase: "When you are ready to start using AI but do not know which tool to choose.",
    icon: Brain,
  },
  {
    id: "verify-ai-output",
    title: "How to Verify What AI Tells Me",
    prompt: "I asked an AI tool a question and want to verify the response.\n\nMy question was: [YOUR QUESTION]\nThe AI's answer was: [PASTE THE AI RESPONSE]\n\nHelp me fact-check this by:\n1. Identifying which claims in the response are verifiable facts vs. opinions.\n2. Listing specific sources I should check (official websites, databases, or organizations).\n3. Flagging any parts that sound plausible but are commonly hallucinated by AI.\n4. Highlighting anything that is outdated (AI training data has a cutoff date).\n5. Giving me a confidence rating: Likely Accurate, Verify Before Using, or Treat With Caution.\n\nTell me the single most important claim to verify first and exactly where to check it.",
    audience: ["everyday", "seniors", "students"],
    category: "safety",
    tags: ["fact-checking", "verification", "AI accuracy", "misinformation"],
    useCase: "When an AI gives you information that you want to verify before acting on it.",
    icon: Search,
  },
  {
    id: "resume-improvement",
    title: "Improve My Resume",
    prompt: "Review my resume and provide specific, actionable improvements.\n\nTarget role: [JOB TITLE / INDUSTRY]\n\nAnalyze and improve:\n1. Impact statements: Rewrite weak bullet points using strong action verbs and quantifiable results.\n2. Structure: Suggest a better format or section order for my target industry.\n3. Gaps: Identify anything missing that hiring managers in [INDUSTRY] expect to see.\n4. Keywords: Suggest industry-specific terms that will help pass applicant tracking systems.\n5. Overall impression: In 2 sentences, what does this resume communicate about me, and how can I strengthen that message?\n\nMy current resume:\n[PASTE RESUME TEXT (remove your home address, phone number, and email first)]",
    audience: ["everyday", "students"],
    category: "work",
    tags: ["resume", "job search", "career", "writing"],
    useCase: "When updating your resume for a job search and want it to stand out.",
    safetyNote: "Remove your home address, phone number, and email before pasting your resume into AI tools.",
    icon: FileText,
  },
  {
    id: "learn-new-skill",
    title: "Learn Something New in 30 Days",
    prompt: "Design a 30-day learning plan for [SKILL/TOPIC].\n\nMy starting level: Complete beginner.\nTime I can commit: [MINUTES/HOURS] per day.\nGoal by day 30: [SPECIFIC, MEASURABLE OUTCOME]\n\nStructure the plan as:\n\nWeek 1 (Foundation): Core concepts and vocabulary.\nWeek 2 (Practice): Hands-on exercises and drills.\nWeek 3 (Application): Real-world projects or scenarios.\nWeek 4 (Mastery): Review, fill gaps, and demonstrate competence.\n\nFor each day, provide:\n1. The specific topic or skill to focus on.\n2. One free resource (YouTube channel, website, or app) with the search term to find it.\n3. One 15-minute practice exercise.\n\nInclude a simple progress tracker I can check off each day.",
    audience: ["everyday", "students", "seniors"],
    category: "learning",
    tags: ["learning plan", "self-improvement", "skills", "goals"],
    useCase: "When you want to pick up a new hobby or skill but need a structured approach.",
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
      <SEOHead {...pageSEO.tools} title="AI Prompt Library: Ready-to-Use Templates for Everyday Life | GetCyberRight" description="A free, comprehensive collection of AI prompts for families, seniors, students, and small businesses. Copy, paste, and use with no AI experience required." />
      <Navigation />

      <PageBanner
        title="AI Prompt Library"
        subtitle="Ready-to-use AI templates for everyday life. Copy, paste, and get things done. No experience needed."
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
              You don't need to be a tech expert to use AI well. These templates are written for real people with real tasks, from planning meals to spotting scams. Just copy a prompt, paste it into any AI tool (ChatGPT, Google Gemini, Claude, Copilot), fill in the brackets, and go.
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
                    AI responses can be wrong, so always verify important information.
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
                AI is powerful, but it also creates new risks. Learn how to spot deepfakes, detect AI-generated scams, and protect your privacy when using AI tools.
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