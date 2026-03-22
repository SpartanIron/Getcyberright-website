export interface LessonPlanTemplate {
  id: string;
  topic: string;
  gradeBand: "K-2" | "3-5" | "6-8" | "9-12";
  duration: "15-min" | "30-min" | "45-min" | "full-period";
  title: string;
  objectives: string[];
  materials: string[];
  procedure: string[];
  assessment: string;
  extensions: string;
}

export interface ClassroomActivity {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  gradeBand: string;
  timeNeeded: string;
  steps: { stepNumber: number; instruction: string; teacherNote: string }[];
  debrief: string[];
}

export interface AssessmentQuestion {
  id: string;
  topic: string;
  question: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
}

export interface CurriculumStandard {
  framework: "Common Core" | "ISTE" | "CSTA";
  standardId: string;
  description: string;
  topics: string[];
}

export interface ClassroomMaterial {
  id: string;
  title: string;
  type: "handout" | "poster" | "activity-sheet" | "discussion-cards" | "checklist";
  icon: string;
  color: string;
  description: string;
  gradeLevel: string;
  sections: { heading: string; content: string }[];
}

export const topicsList = [
  "Digital Citizenship",
  "Cyberbullying Prevention",
  "Privacy & Security",
  "Media Literacy",
  "Responsible Gaming",
  "School Technology Safety"
] as const;

export type TopicName = typeof topicsList[number];

export const gradeBands = ["K-2", "3-5", "6-8", "9-12"] as const;
export const durations = ["15-min", "30-min", "45-min", "full-period"] as const;

export const lessonPlanTemplates: LessonPlanTemplate[] = [
  {
    id: "dc-k2-15",
    topic: "Digital Citizenship",
    gradeBand: "K-2",
    duration: "15-min",
    title: "My Online Manners",
    objectives: ["Define what it means to be kind online", "Identify one rule for safe internet use"],
    materials: ["Whiteboard or chart paper", "Markers", "Smiley-face stickers"],
    procedure: [
      "Ask: 'What does it mean to be kind when we talk to someone face to face?'",
      "Explain that the internet is like a playground — the same rules about kindness apply",
      "Show two example sentences: one kind, one unkind. Have students give thumbs-up or thumbs-down",
      "Class creates one 'Online Kindness Rule' together and each student gets a sticker for participating"
    ],
    assessment: "Students can state at least one rule for being kind online.",
    extensions: "Students draw a picture of themselves being a good digital citizen."
  },
  {
    id: "dc-k2-30",
    topic: "Digital Citizenship",
    gradeBand: "K-2",
    duration: "30-min",
    title: "Safe vs. Unsafe Online Choices",
    objectives: ["Distinguish between safe and unsafe actions online", "Recognize when to ask a grown-up for help"],
    materials: ["Printed scenario cards (prepared by teacher)", "Two bins labeled 'Safe' and 'Unsafe'", "Drawing supplies"],
    procedure: [
      "Introduce the concept: 'Not everything online is safe, just like not everything outside is safe'",
      "Read each scenario card aloud (e.g., 'A pop-up asks for your name' vs 'You play an approved learning game')",
      "Students sort cards into 'Safe' or 'Unsafe' bins with teacher guidance",
      "Discuss each card: why is it safe or unsafe?",
      "Teach the rule: 'When in doubt, ask a grown-up!'",
      "Students draw one safe thing and one thing where they should ask for help"
    ],
    assessment: "Students correctly sort at least 4 out of 6 scenario cards.",
    extensions: "Create a classroom poster of 'Ask a Grown-Up' situations."
  },
  {
    id: "dc-k2-45",
    topic: "Digital Citizenship",
    gradeBand: "K-2",
    duration: "45-min",
    title: "Our Digital Citizenship Pledge",
    objectives: ["List three rules for being a good digital citizen", "Create and sign a classroom pledge"],
    materials: ["Large poster paper", "Markers and crayons", "Stickers", "Individual pledge cards"],
    procedure: [
      "Circle time: discuss what a citizen is and what makes a good one",
      "Brainstorm: 'What rules should we follow when using computers and tablets?'",
      "Write the top 5 rules on poster paper in student-friendly language",
      "Each student decorates and signs their own pledge card",
      "Students practice the rules in a guided computer activity",
      "Post the large poster near the classroom computers",
      "Review: each student shares their favorite rule and why"
    ],
    assessment: "Students can recite at least 3 digital citizenship rules.",
    extensions: "Share the pledge with families; students teach one rule to a sibling."
  },
  {
    id: "dc-k2-full",
    topic: "Digital Citizenship",
    gradeBand: "K-2",
    duration: "full-period",
    title: "A Day as a Digital Citizen",
    objectives: ["Demonstrate kind and safe behavior online", "Practice asking for help when unsure", "Role-play real-world online scenarios"],
    materials: ["Computer or tablet stations", "Scenario role-play cards", "Digital Citizen cape/badge cutouts", "Chart paper"],
    procedure: [
      "Warm-up (5 min): Review digital citizenship rules from previous lessons",
      "Story time (10 min): Read a short story about a character making online choices",
      "Station rotation (25 min): Students rotate through 3 stations: (1) Computer practice with safe browsing, (2) Role-play scenarios with partner, (3) Create a 'My Safe Online Rules' mini-book",
      "Debrief (10 min): Each station group shares one thing they learned",
      "Award: Students receive a 'Digital Citizen' badge/certificate"
    ],
    assessment: "Students demonstrate safe behavior at each station and can explain their reasoning.",
    extensions: "Students become 'Digital Citizen Helpers' for the next week."
  },
  {
    id: "dc-35-15",
    topic: "Digital Citizenship",
    gradeBand: "3-5",
    duration: "15-min",
    title: "Think Before You Post",
    objectives: ["Explain why we should think before posting online", "Apply the THINK acronym"],
    materials: ["THINK poster (True, Helpful, Inspiring, Necessary, Kind)", "Whiteboard"],
    procedure: [
      "Introduce the THINK acronym: Is it True? Is it Helpful? Is it Inspiring? Is it Necessary? Is it Kind?",
      "Show 3 sample social media posts; students evaluate each using THINK",
      "Quick turn-and-talk: share a time you posted or said something you wished you could take back",
      "Class creates a THINK reminder card to keep at their desk"
    ],
    assessment: "Students can apply at least 3 of the 5 THINK criteria to a sample post.",
    extensions: "Students create their own THINK poster for the hallway."
  },
  {
    id: "dc-35-30",
    topic: "Digital Citizenship",
    gradeBand: "3-5",
    duration: "30-min",
    title: "Digital Footprint Detective",
    objectives: ["Define digital footprint", "Identify examples of information that creates a digital trail"],
    materials: ["Paper footprint cutouts", "Markers", "Example profile screenshots (teacher-created)"],
    procedure: [
      "Ask: 'What footprints do you leave when you walk in the sand?' Connect to the idea of digital footprints",
      "Explain: every click, post, and search creates a trail that can last forever",
      "Activity: students write different online actions on paper footprints and lay them in a trail across the room",
      "Discuss: which footprints would be okay for a future teacher or employer to see?",
      "Sorting: students categorize their footprints into 'positive' and 'potentially risky'",
      "Takeaway: 'Your digital footprint follows you. Make it a good one.'"
    ],
    assessment: "Students can explain what a digital footprint is and give 3 examples.",
    extensions: "Create a 'Positive Digital Footprint' action plan."
  },
  {
    id: "dc-35-45",
    topic: "Digital Citizenship",
    gradeBand: "3-5",
    duration: "45-min",
    title: "Online Scenario Challenge",
    objectives: ["Evaluate online situations and choose responsible responses", "Explain consequences of irresponsible digital behavior"],
    materials: ["Scenario challenge cards (10 scenarios)", "Response worksheets", "Score tracking sheet"],
    procedure: [
      "Review digital citizenship principles (5 min)",
      "Divide students into teams of 3-4",
      "Present each scenario card to teams simultaneously. Teams discuss and write their best response (2 min per scenario)",
      "After each round, discuss the best response and award points for thoughtful answers",
      "Final reflection: what surprised you? What scenario was hardest to answer?",
      "Winning team gets 'Digital Citizenship Champions' recognition"
    ],
    assessment: "Teams demonstrate thoughtful reasoning for at least 7 of 10 scenarios.",
    extensions: "Students write their own scenario cards for future classes."
  },
  {
    id: "dc-35-full",
    topic: "Digital Citizenship",
    gradeBand: "3-5",
    duration: "full-period",
    title: "Create a Digital Citizenship PSA",
    objectives: ["Research a digital citizenship topic", "Create a persuasive message for peers", "Present findings to the class"],
    materials: ["Computers or tablets for research", "Poster paper or presentation software", "Rubric handout"],
    procedure: [
      "Introduction (5 min): Explain PSA (Public Service Announcement) and show an example",
      "Topic selection (5 min): Students choose from digital citizenship subtopics",
      "Research (15 min): Students find 3-5 key facts about their topic using approved sources",
      "Create (20 min): Design a poster, slide, or short script for their PSA",
      "Present (10 min): Quick 1-minute presentations to the class",
      "Vote (5 min): Class votes on most impactful PSA"
    ],
    assessment: "PSA includes at least 3 accurate facts and a clear call to action. Assessed via rubric.",
    extensions: "Record PSAs as short videos to share with other classes."
  },
  {
    id: "dc-68-15",
    topic: "Digital Citizenship",
    gradeBand: "6-8",
    duration: "15-min",
    title: "Your Online Reputation Check",
    objectives: ["Understand how online actions affect reputation", "Identify what potential audiences can see"],
    materials: ["Whiteboard", "Student journals"],
    procedure: [
      "Prompt: 'Imagine a college admissions officer or future employer searched your name. What would they find?'",
      "Students write a quick self-audit: list 3 things they have posted/shared online",
      "Discuss: how might different audiences interpret the same post differently?",
      "Takeaway: everything online is public, permanent, and searchable"
    ],
    assessment: "Students can articulate why online reputation matters.",
    extensions: "Google yourself (with parent permission) and reflect on what you find."
  },
  {
    id: "dc-68-30",
    topic: "Digital Citizenship",
    gradeBand: "6-8",
    duration: "30-min",
    title: "Bystander to Upstander Online",
    objectives: ["Distinguish between a bystander and an upstander", "Develop strategies for positive intervention online"],
    materials: ["Scenario handouts", "Role-play cards", "Upstander strategy list"],
    procedure: [
      "Define bystander vs. upstander with real-world and online examples",
      "Present 4 online scenarios: cyberbullying comment, exclusionary group chat, embarrassing photo shared, rumor spreading",
      "In pairs, students identify the bystander response and create an upstander alternative",
      "Pairs share strategies with the class",
      "Build a class 'Upstander Toolkit' with agreed-upon strategies",
      "Reflection: write one pledge for how you will be an upstander this week"
    ],
    assessment: "Students can describe at least 2 upstander strategies.",
    extensions: "Track upstander moments for a week and share anonymously."
  },
  {
    id: "dc-68-45",
    topic: "Digital Citizenship",
    gradeBand: "6-8",
    duration: "45-min",
    title: "Social Media Ethics Debate",
    objectives: ["Analyze ethical dilemmas in social media use", "Form and defend an evidence-based opinion"],
    materials: ["Debate topic cards", "Research devices", "Argument planning sheets"],
    procedure: [
      "Introduce the debate topic: 'Should social media platforms be responsible for stopping cyberbullying?'",
      "Students research for 10 minutes, finding evidence for both sides",
      "Divide into pro/con groups for structured debate (5 min per side, 3 min rebuttals)",
      "Neutral judges (teacher + 2 students) evaluate arguments",
      "Debrief: what did you learn from the opposing side?",
      "Individual reflection: write your personal position with evidence"
    ],
    assessment: "Students present at least 2 evidence-based arguments for their position.",
    extensions: "Write an op-ed for the school newspaper on the topic."
  },
  {
    id: "dc-68-full",
    topic: "Digital Citizenship",
    gradeBand: "6-8",
    duration: "full-period",
    title: "Digital Citizenship Workshop",
    objectives: ["Lead younger students in digital citizenship learning", "Demonstrate mastery of online safety concepts"],
    materials: ["Teaching materials (student-created)", "Activity stations", "Assessment checklists"],
    procedure: [
      "Preparation (15 min): Students prepare mini-lessons on assigned digital citizenship topics",
      "Peer teaching (25 min): Students rotate teaching each other in small groups",
      "Cross-age component (15 min): If possible, partner with a younger class for students to teach",
      "Reflection (5 min): What was the most effective teaching strategy you used or saw?"
    ],
    assessment: "Students demonstrate mastery by effectively teaching a concept to peers.",
    extensions: "Create an ongoing 'Digital Citizenship Mentors' program."
  },
  {
    id: "dc-912-15",
    topic: "Digital Citizenship",
    gradeBand: "9-12",
    duration: "15-min",
    title: "Terms of Service Reality Check",
    objectives: ["Recognize what rights users give up in Terms of Service agreements", "Question common assumptions about online privacy"],
    materials: ["Excerpts from real ToS agreements (simplified)", "Discussion prompts"],
    procedure: [
      "Ask: 'Who reads the Terms of Service before clicking Accept?' (expect few hands)",
      "Show 3 surprising ToS excerpts (e.g., data ownership, content licensing, tracking policies)",
      "Quick-fire discussion: 'Would you still agree if you knew this?'",
      "Key insight: you are trading privacy for free services — is the trade worth it?"
    ],
    assessment: "Students can identify at least 2 concerning aspects of common ToS agreements.",
    extensions: "Read and annotate the ToS of one app you use daily."
  },
  {
    id: "dc-912-30",
    topic: "Digital Citizenship",
    gradeBand: "9-12",
    duration: "30-min",
    title: "Data Privacy Audit Workshop",
    objectives: ["Audit personal digital privacy settings", "Implement privacy improvements on one platform"],
    materials: ["Privacy audit checklist", "Devices with student accounts", "Before/after tracking sheet"],
    procedure: [
      "Distribute privacy audit checklist covering: location sharing, ad tracking, connected apps, data download requests",
      "Students pick one platform they use daily and work through the checklist",
      "Document current settings (before) and changes made (after)",
      "Pair-share: what surprised you about your privacy settings?",
      "Class discussion: what is the relationship between convenience and privacy?",
      "Action item: schedule a monthly privacy check on your calendar"
    ],
    assessment: "Students complete the audit and identify at least 3 privacy improvements.",
    extensions: "Research GDPR and CCPA and how they protect consumer data."
  },
  {
    id: "dc-912-45",
    topic: "Digital Citizenship",
    gradeBand: "9-12",
    duration: "45-min",
    title: "AI Ethics and Digital Responsibility",
    objectives: ["Evaluate ethical implications of AI in everyday life", "Discuss responsible AI use in academic settings"],
    materials: ["AI case study handouts", "Ethics framework reference", "Discussion rubric"],
    procedure: [
      "Introduction (5 min): What AI tools do you use? (ChatGPT, image generators, etc.)",
      "Case studies (15 min): Groups analyze AI ethics scenarios — deepfakes, AI-generated homework, biased algorithms, surveillance",
      "Ethics framework (10 min): Apply an ethical framework (consequentialism, deontology, virtue ethics) to one case",
      "Fishbowl discussion (10 min): Inner circle debates while outer circle takes notes",
      "Policy draft (5 min): Each group proposes one school AI-use guideline"
    ],
    assessment: "Students articulate at least 2 ethical considerations for AI use and propose a responsible guideline.",
    extensions: "Draft a class AI Acceptable Use Policy for submission to school administration."
  },
  {
    id: "dc-912-full",
    topic: "Digital Citizenship",
    gradeBand: "9-12",
    duration: "full-period",
    title: "Digital Legacy Project",
    objectives: ["Reflect on long-term impact of digital presence", "Create a positive digital portfolio", "Develop a personal digital citizenship philosophy"],
    materials: ["Computers", "Portfolio template", "Reflection journal", "Peer review rubric"],
    procedure: [
      "Self-assessment (10 min): Audit your current digital presence across all platforms",
      "Research (10 min): Examine how digital presence affects college admissions and job prospects",
      "Create (20 min): Build a positive digital portfolio — curate content you would want future employers to see",
      "Peer review (10 min): Exchange portfolios with a partner for constructive feedback",
      "Manifesto (10 min): Write a personal 'Digital Citizenship Manifesto' — your principles for online life"
    ],
    assessment: "Portfolio demonstrates intentional, positive digital presence. Manifesto articulates clear personal values.",
    extensions: "Present manifesto to underclassmen as part of a digital citizenship awareness campaign."
  },
  {
    id: "cb-35-15",
    topic: "Cyberbullying Prevention",
    gradeBand: "3-5",
    duration: "15-min",
    title: "Words Can Hurt Online Too",
    objectives: ["Recognize that online words can cause real harm", "Identify examples of cyberbullying"],
    materials: ["Heart cutout (paper)", "Tape"],
    procedure: [
      "Hold up a paper heart. For each mean online comment read aloud, fold/crumple the heart",
      "Try to unfold it — 'Even when you apologize, the wrinkles remain'",
      "Define cyberbullying: repeated harmful behavior using technology",
      "Students share one way they can be kind online today"
    ],
    assessment: "Students can define cyberbullying and give one example.",
    extensions: "Create an 'Anti-Cyberbullying' poster for the classroom."
  },
  {
    id: "cb-35-30",
    topic: "Cyberbullying Prevention",
    gradeBand: "3-5",
    duration: "30-min",
    title: "Upstander Role-Play",
    objectives: ["Distinguish bystander from upstander", "Practice upstander responses in cyberbullying scenarios"],
    materials: ["Role-play scenario cards", "Response choice sheets"],
    procedure: [
      "Define bystander (watches and does nothing) vs. upstander (takes positive action)",
      "Present 4 cyberbullying scenarios on cards",
      "In pairs, students act out both the bystander and upstander response",
      "Class discusses: which response was harder? Why?",
      "Create a class 'Upstander Pledge' signed by everyone",
      "Review: 3 safe ways to be an upstander (report, support the target, don't share)"
    ],
    assessment: "Students demonstrate at least 2 upstander strategies through role-play.",
    extensions: "Students teach the upstander pledge to another class."
  },
  {
    id: "cb-68-30",
    topic: "Cyberbullying Prevention",
    gradeBand: "6-8",
    duration: "30-min",
    title: "The Screenshot Test",
    objectives: ["Evaluate potential consequences before posting", "Apply the 'screenshot test' to online communication"],
    materials: ["Sample message screenshots (teacher-created)", "Decision worksheets"],
    procedure: [
      "Introduce the 'Screenshot Test': before you post, imagine it being screenshotted and shown to your parent, teacher, or the whole school",
      "Show 6 sample messages/posts. Students evaluate each: would it pass the screenshot test?",
      "Discuss gray areas: jokes between friends that could be misinterpreted",
      "Students rewrite 3 problematic messages to make them pass the test",
      "Create personal 'Before I Post' checklist"
    ],
    assessment: "Students can identify problematic messages and rewrite them appropriately.",
    extensions: "Analyze real news stories about posts that had serious consequences."
  },
  {
    id: "cb-912-45",
    topic: "Cyberbullying Prevention",
    gradeBand: "9-12",
    duration: "45-min",
    title: "Legal Consequences of Cyberbullying",
    objectives: ["Research cyberbullying laws in your state/country", "Analyze real legal cases involving online harassment"],
    materials: ["Case study handouts", "Legal research resources", "Analysis framework"],
    procedure: [
      "Overview: cyberbullying is not just a school issue — it can be a legal issue (10 min)",
      "Case study analysis: groups examine 2 real cases with different outcomes (15 min)",
      "Legal research: find your state or country's cyberbullying laws (10 min)",
      "Group presentations: key findings and takeaways (10 min)"
    ],
    assessment: "Students can identify at least one relevant law and explain potential legal consequences.",
    extensions: "Draft a school anti-cyberbullying policy proposal."
  },
  {
    id: "ps-35-30",
    topic: "Privacy & Security",
    gradeBand: "3-5",
    duration: "30-min",
    title: "Private vs. Shareable Info Sorting",
    objectives: ["Categorize information as private or shareable", "Explain why some information must stay private"],
    materials: ["Information cards (name, address, phone, favorite color, birthday, etc.)", "Two containers: 'Private' and 'OK to Share'"],
    procedure: [
      "Brainstorm: what information do websites and apps ask for?",
      "Sort cards: students decide if each piece of info is private or shareable",
      "Discuss surprising items (e.g., birthday seems harmless but can be used for identity theft)",
      "Role-play: a 'website' asks for your information — practice saying no",
      "Create a 'My Private Info' shield drawing"
    ],
    assessment: "Students correctly categorize at least 8 out of 10 information types.",
    extensions: "Audit one app or game to see what info it asks for."
  },
  {
    id: "ps-68-30",
    topic: "Privacy & Security",
    gradeBand: "6-8",
    duration: "30-min",
    title: "Password Strength Lab",
    objectives: ["Create strong, memorable passwords", "Understand how passwords are cracked"],
    materials: ["Password strength checker (projected)", "Password creation worksheet", "Timer"],
    procedure: [
      "Demonstrate how quickly weak passwords can be cracked (use projected statistics, not actual cracking)",
      "Teach password strength principles: length beats complexity, passphrases, no personal info",
      "Students create 3 strong passwords using the passphrase method",
      "Test passwords against strength criteria (not online — use the rubric)",
      "Discuss password managers and why they help",
      "Challenge: create a password that is both strong AND memorable in 2 minutes"
    ],
    assessment: "Students can create a password that meets all strength criteria.",
    extensions: "Research and present on one password manager option."
  },
  {
    id: "ps-912-45",
    topic: "Privacy & Security",
    gradeBand: "9-12",
    duration: "45-min",
    title: "Phishing Email Analysis Lab",
    objectives: ["Identify phishing techniques in emails", "Analyze email headers and URLs for legitimacy"],
    materials: ["Sample phishing emails (teacher-created, no real links)", "Analysis checklist", "Report template"],
    procedure: [
      "Introduction to phishing: statistics and impact (5 min)",
      "Teach analysis techniques: check sender domain, hover over links (show on projector), urgency language, generic greetings, misspellings (10 min)",
      "Lab: students analyze 8 emails and classify each as phishing or legitimate using the checklist (20 min)",
      "Review answers as a class — discuss the trickiest ones (10 min)"
    ],
    assessment: "Students correctly identify at least 6 of 8 emails.",
    extensions: "Create a phishing awareness poster for the school."
  },
  {
    id: "ml-35-30",
    topic: "Media Literacy",
    gradeBand: "3-5",
    duration: "30-min",
    title: "Real or Fake Photo Challenge",
    objectives: ["Distinguish between real and manipulated images", "Develop healthy skepticism about online images"],
    materials: ["Projected images (mix of real and edited/AI-generated)", "Voting cards (Real/Fake)"],
    procedure: [
      "Show 10 images one at a time — students vote: real or fake?",
      "After each vote, reveal the answer and discuss clues",
      "Teach 3 signs of manipulated images: weird shadows, blurry edges, impossible scenarios",
      "Key lesson: not everything you see online is real",
      "Practice: students find one image online and explain why they think it is real or edited"
    ],
    assessment: "Students can identify at least 3 signs of a manipulated image.",
    extensions: "Create a class 'Fake Image Detector' guide."
  },
  {
    id: "ml-68-45",
    topic: "Media Literacy",
    gradeBand: "6-8",
    duration: "45-min",
    title: "Lateral Reading Workshop",
    objectives: ["Apply lateral reading to verify online claims", "Use fact-checking websites effectively"],
    materials: ["Claim cards with URLs", "Fact-checking site list", "Verification worksheet"],
    procedure: [
      "Introduce lateral reading: instead of reading deeper into a suspicious site, open new tabs and check other sources (10 min)",
      "Demonstrate with a live example on the projector (5 min)",
      "Students receive 5 claims with source URLs and use lateral reading to verify each (20 min)",
      "Share findings and discuss which claims were true, false, or misleading (10 min)"
    ],
    assessment: "Students correctly verify at least 4 of 5 claims using lateral reading.",
    extensions: "Become a class 'Fact Checker' — verify one viral claim per week."
  },
  {
    id: "ml-912-30",
    topic: "Media Literacy",
    gradeBand: "9-12",
    duration: "30-min",
    title: "Algorithm Awareness",
    objectives: ["Explain how social media algorithms work", "Recognize filter bubbles and echo chambers"],
    materials: ["Algorithm simulation activity cards", "Reflection worksheets"],
    procedure: [
      "Ask: 'Why does everyone's social media feed look different?' (5 min)",
      "Explain algorithmic curation: engagement-based ranking, personalization, filter bubbles (10 min)",
      "Simulation: give students different 'user profiles' and show how the algorithm would curate different feeds for each (10 min)",
      "Reflection: how might filter bubbles affect your understanding of the world? (5 min)"
    ],
    assessment: "Students can explain how algorithms create filter bubbles.",
    extensions: "Compare search results across different browsers and accounts."
  },
  {
    id: "rg-35-30",
    topic: "Responsible Gaming",
    gradeBand: "3-5",
    duration: "30-min",
    title: "Gaming Safety Rules",
    objectives: ["Identify safe gaming practices", "Recognize when gaming interactions become unsafe"],
    materials: ["Game scenario cards", "Safety rules chart paper", "Red/Green flags cards"],
    procedure: [
      "Discuss: what games do you play? Do you play with strangers? (5 min)",
      "Present 8 gaming scenarios — students hold up green flag (safe) or red flag (unsafe) (10 min)",
      "Discuss each scenario and why it is safe or unsafe (10 min)",
      "Create class gaming safety rules together (5 min)"
    ],
    assessment: "Students can identify at least 3 gaming safety rules.",
    extensions: "Share gaming safety rules with parents or guardians."
  },
  {
    id: "rg-68-45",
    topic: "Responsible Gaming",
    gradeBand: "6-8",
    duration: "45-min",
    title: "The Hidden Cost of Free-to-Play",
    objectives: ["Analyze monetization strategies in free-to-play games", "Calculate the real cost of in-game purchases"],
    materials: ["Game monetization case studies", "Calculator", "Budget worksheet"],
    procedure: [
      "Discussion: what makes free-to-play games actually free? (5 min)",
      "Introduce monetization: loot boxes, battle passes, cosmetic items, pay-to-win mechanics (10 min)",
      "Case study: track the spending in a popular free-to-play game over 6 months (10 min)",
      "Math activity: calculate how much small purchases ($1-5) add up over a year (10 min)",
      "Discussion: are these practices fair? Should there be regulations? (10 min)"
    ],
    assessment: "Students can identify 3 monetization strategies and calculate yearly spending from micro-transactions.",
    extensions: "Research loot box regulations in different countries."
  },
  {
    id: "st-68-30",
    topic: "School Technology Safety",
    gradeBand: "6-8",
    duration: "30-min",
    title: "Phishing Drill: Can You Spot It?",
    objectives: ["Identify phishing emails targeting students", "Practice safe responses to suspicious messages"],
    materials: ["Sample phishing emails (school-themed)", "Response decision tree", "Report form template"],
    procedure: [
      "Explain: students and schools are targets for phishing too (5 min)",
      "Show 6 sample emails: some legitimate school communications, some phishing attempts (10 min)",
      "Students work in pairs to classify each email and explain their reasoning (10 min)",
      "Review as a class — introduce the reporting process for suspicious emails at school (5 min)"
    ],
    assessment: "Students correctly identify at least 4 of 6 emails.",
    extensions: "Create a 'Phishing Red Flags' quick reference card."
  },
  {
    id: "st-912-45",
    topic: "School Technology Safety",
    gradeBand: "9-12",
    duration: "45-min",
    title: "Social Engineering Awareness",
    objectives: ["Recognize social engineering tactics", "Practice defensive responses to manipulation attempts"],
    materials: ["Social engineering scenario cards", "Defense strategy handbook", "Role-play scripts"],
    procedure: [
      "Define social engineering: manipulating people rather than hacking systems (5 min)",
      "Present 5 common tactics: pretexting, baiting, tailgating, phishing, quid pro quo (10 min)",
      "Role-play: students practice recognizing and responding to each tactic (15 min)",
      "Case studies: real-world social engineering attacks and their impact (10 min)",
      "Create personal defense plan (5 min)"
    ],
    assessment: "Students can identify and describe defenses for at least 3 social engineering tactics.",
    extensions: "Research the role of social engineering in major data breaches."
  }
];

export const classroomActivities: ClassroomActivity[] = [
  {
    id: "phishing-detective",
    title: "Phishing Email Detective",
    icon: "mail",
    color: "bg-red-500",
    description: "Students analyze sample emails to identify phishing red flags and protect themselves from online scams.",
    gradeBand: "Grades 4-12",
    timeNeeded: "20-30 minutes",
    steps: [
      {
        stepNumber: 1,
        instruction: "Display or distribute 8 sample emails on the projector or as handouts. Mix includes phishing attempts and legitimate emails.",
        teacherNote: "Use teacher-created examples only — never show students real phishing emails with active links. Include a mix of obvious and subtle examples."
      },
      {
        stepNumber: 2,
        instruction: "Introduce the 5 red flags: suspicious sender address, urgency language, generic greetings, spelling/grammar errors, and suspicious links.",
        teacherNote: "Create a poster or slide with the 5 red flags that stays visible during the activity."
      },
      {
        stepNumber: 3,
        instruction: "Students work in pairs to analyze each email. For each one, they mark it as 'Phishing' or 'Legitimate' and list the red flags they found.",
        teacherNote: "Circulate and ask probing questions: 'What about the sender address?' 'Would a real bank email look like this?'"
      },
      {
        stepNumber: 4,
        instruction: "Review each email as a class. Reveal answers and discuss the red flags in detail.",
        teacherNote: "Celebrate students who caught subtle clues. Normalize the ones that fooled people — 'Even adults get tricked by these.'"
      },
      {
        stepNumber: 5,
        instruction: "Students write their own 'phishing email' (harmless) for a partner to analyze.",
        teacherNote: "This helps students understand the techniques from the attacker's perspective, making them better at spotting threats."
      }
    ],
    debrief: [
      "What was the trickiest email to identify?",
      "What one red flag will you always check for now?",
      "How would you explain phishing to a family member?"
    ]
  },
  {
    id: "password-tournament",
    title: "Password Strength Tournament",
    icon: "key",
    color: "bg-purple-500",
    description: "A competitive classroom activity where students create the strongest passwords using creative techniques.",
    gradeBand: "Grades 3-10",
    timeNeeded: "20-25 minutes",
    steps: [
      {
        stepNumber: 1,
        instruction: "Teach password strength basics: length is more important than complexity. A 4-word passphrase beats a short complex password.",
        teacherNote: "Use analogies: 'A short password is like a tiny lock — easy to break. A passphrase is like a long chain — much harder.'"
      },
      {
        stepNumber: 2,
        instruction: "Show examples of weak vs. strong passwords. Demonstrate the passphrase method: pick 4 random unrelated words and connect them.",
        teacherNote: "Never ask students to share actual passwords they use. All passwords created in this activity are practice passwords only."
      },
      {
        stepNumber: 3,
        instruction: "Round 1: Students have 2 minutes to create the strongest password they can. Write it on paper (face down).",
        teacherNote: "Remind students: no real personal information in practice passwords."
      },
      {
        stepNumber: 4,
        instruction: "Scoring: Award points for length (1 point per character), mixed case (2 points), numbers (2 points), special characters (2 points), and memorability (3 points if they can recite it).",
        teacherNote: "Have students score their own passwords using the rubric on the board. The memorability bonus encourages practical passwords."
      },
      {
        stepNumber: 5,
        instruction: "Round 2: Using what they learned, students create an improved password. Compare scores to Round 1.",
        teacherNote: "Most students significantly improve. Use this as evidence that learning works."
      },
      {
        stepNumber: 6,
        instruction: "Final challenge: create a passphrase that tells a silly story (easier to remember). 'PurpleCowsDanceOnSaturn' scores high AND is memorable.",
        teacherNote: "The sillier the passphrase, the more memorable it becomes. Encourage creativity."
      }
    ],
    debrief: [
      "Why is length more important than complexity?",
      "What makes a password easy to guess?",
      "How many passwords should you reuse across different accounts? (Answer: zero)"
    ]
  },
  {
    id: "digital-footprint-mapper",
    title: "Digital Footprint Mapper",
    icon: "footprints",
    color: "bg-blue-500",
    description: "Students create a visual timeline of their digital footprint to understand the permanence and reach of online activity.",
    gradeBand: "Grades 5-12",
    timeNeeded: "30-40 minutes",
    steps: [
      {
        stepNumber: 1,
        instruction: "Give each student a long strip of paper (or tape several sheets together). This is their 'digital timeline' starting from their first online activity.",
        teacherNote: "For younger students, start from 'when I first used a tablet.' For older students, go back to their first social media account."
      },
      {
        stepNumber: 2,
        instruction: "Students list every platform, app, and website they have ever used or created an account on. Write each on a sticky note and place on the timeline.",
        teacherNote: "Most students are surprised by how many accounts they have. This realization is the key learning moment."
      },
      {
        stepNumber: 3,
        instruction: "For each account, students note: Is it still active? Did I ever delete it? What information did I share? Who can see it?",
        teacherNote: "Inactive accounts are still a risk — data remains on servers even when we stop using a platform."
      },
      {
        stepNumber: 4,
        instruction: "Color-code the timeline: green for accounts they actively manage, yellow for forgotten accounts, red for accounts they cannot access anymore.",
        teacherNote: "Red accounts are the highest risk — students cannot control what happens to that data."
      },
      {
        stepNumber: 5,
        instruction: "Create an action plan: identify 3 accounts to review privacy settings on this week and 2 inactive accounts to deactivate or delete.",
        teacherNote: "Make this a homework assignment — students should actually follow through on their action plan."
      }
    ],
    debrief: [
      "How many accounts did you discover you had forgotten about?",
      "What is the oldest online account you still have?",
      "If someone found all of this information about you, what would they know?"
    ]
  },
  {
    id: "cyberbullying-roleplay",
    title: "Cyberbullying Scenario Role-Play",
    icon: "users",
    color: "bg-amber-500",
    description: "Students role-play different perspectives in cyberbullying situations to build empathy and practice intervention strategies.",
    gradeBand: "Grades 4-10",
    timeNeeded: "25-35 minutes",
    steps: [
      {
        stepNumber: 1,
        instruction: "Establish ground rules: this is a safe space, no real names or real situations, anyone can step out if uncomfortable.",
        teacherNote: "Be attentive to students who may have personal experience with cyberbullying. Have a counselor referral ready."
      },
      {
        stepNumber: 2,
        instruction: "Present 4 scenario cards, each with a different cyberbullying situation: mean comments on a post, exclusion from a group chat, sharing an embarrassing photo, starting a rumor.",
        teacherNote: "Use age-appropriate scenarios. For younger students, keep scenarios mild. For older students, scenarios can address more complex social dynamics."
      },
      {
        stepNumber: 3,
        instruction: "Assign roles: the target, the person doing the bullying, two bystanders, and one upstander. Rotate roles between scenarios.",
        teacherNote: "Everyone should experience the target role at least once to build empathy."
      },
      {
        stepNumber: 4,
        instruction: "After each scenario, freeze the action and ask: 'Bystanders — what could you do RIGHT NOW to help?' Brainstorm at least 3 options.",
        teacherNote: "Options include: report to an adult, send a supportive private message, speak up publicly, document the bullying, invite the target to a different activity."
      },
      {
        stepNumber: 5,
        instruction: "Replay each scenario with the upstander interventions. Compare how the situation changes.",
        teacherNote: "Highlight that one upstander can change the entire dynamic. Small actions matter."
      }
    ],
    debrief: [
      "How did it feel to be in the target role?",
      "What made it hard to be an upstander? What made it easier?",
      "What is one thing you will do differently the next time you see cyberbullying?"
    ]
  },
  {
    id: "privacy-audit",
    title: "Social Media Privacy Audit",
    icon: "shield",
    color: "bg-green-500",
    description: "Students conduct a guided audit of privacy settings on social media platforms to understand and control their data.",
    gradeBand: "Grades 6-12",
    timeNeeded: "30-40 minutes",
    steps: [
      {
        stepNumber: 1,
        instruction: "Distribute the Privacy Audit Checklist. Students choose one platform they actively use (Instagram, TikTok, Snapchat, YouTube, etc.).",
        teacherNote: "If students do not have social media accounts, they can use a teacher-created demo account displayed on the projector."
      },
      {
        stepNumber: 2,
        instruction: "Walk through key privacy settings together using the projector: account visibility (public vs private), who can message you, who can see your location, who can tag you.",
        teacherNote: "Navigate the settings on a demo account so students can follow along. Note that settings change frequently — teach the principle, not just the current menu location."
      },
      {
        stepNumber: 3,
        instruction: "Students independently audit their chosen platform using the checklist: check each setting, note the current value, and decide whether to change it.",
        teacherNote: "Circulate and help students find settings. Many are buried in submenus. This is deliberate by the platforms — discuss why."
      },
      {
        stepNumber: 4,
        instruction: "Data download: show students how to request a download of their data from platforms (most have this under Privacy or Account settings). Discuss what they might find.",
        teacherNote: "Students do not need to actually download their data in class — just show them where the option is and explain why it matters."
      },
      {
        stepNumber: 5,
        instruction: "Create a 'Privacy Health Report Card': students grade their platform on 5 criteria (default settings, ease of finding privacy options, data transparency, control over data, deletion options).",
        teacherNote: "This critical analysis skill helps students become more discerning users of technology."
      }
    ],
    debrief: [
      "Were your privacy settings what you expected?",
      "What was the hardest setting to find? Why do you think it was hidden?",
      "What will you change about how you manage privacy going forward?"
    ]
  }
];

export const assessmentQuestions: AssessmentQuestion[] = [
  { id: "dc-q1", topic: "Digital Citizenship", question: "What is a 'digital footprint'?", options: [
    { text: "A tracking device placed on your computer", isCorrect: false, explanation: "A digital footprint is not a physical device. It refers to the trail of data you leave behind through your online activity." },
    { text: "The trail of data you leave behind through your online activity", isCorrect: true, explanation: "Correct! Every post, search, click, and account creation adds to your digital footprint, which can be permanent and searchable." },
    { text: "A type of computer virus", isCorrect: false, explanation: "A digital footprint is not a virus. It is the collection of data traces from your online activity — posts, searches, accounts, and more." },
    { text: "Your computer's physical location", isCorrect: false, explanation: "Your physical location is separate from your digital footprint. A digital footprint is the data trail from everything you do online." }
  ]},
  { id: "dc-q2", topic: "Digital Citizenship", question: "What does the 'T' in the THINK acronym stand for when deciding whether to post something online?", options: [
    { text: "Timely", isCorrect: false, explanation: "The T stands for 'True.' Before posting, ask yourself: Is what I am about to share actually true and factual?" },
    { text: "True", isCorrect: true, explanation: "Correct! THINK stands for True, Helpful, Inspiring, Necessary, and Kind. If a post does not meet these criteria, reconsider sharing it." },
    { text: "Thoughtful", isCorrect: false, explanation: "While being thoughtful is important, the T in THINK stands for 'True' — verifying the accuracy of what you share." },
    { text: "Transparent", isCorrect: false, explanation: "Transparency matters, but the T in THINK specifically stands for 'True' — making sure what you post is factually accurate." }
  ]},
  { id: "dc-q3", topic: "Digital Citizenship", question: "Which of the following is an example of being a good digital citizen?", options: [
    { text: "Sharing a classmate's embarrassing photo because it is funny", isCorrect: false, explanation: "Sharing embarrassing photos without consent is a form of cyberbullying, not good digital citizenship." },
    { text: "Using someone else's password to check their messages", isCorrect: false, explanation: "Accessing someone's account without permission is a violation of their privacy and potentially illegal." },
    { text: "Reporting a social media post that contains bullying", isCorrect: true, explanation: "Correct! Reporting harmful content helps keep online spaces safe and shows responsibility as a digital citizen." },
    { text: "Creating a fake profile to spy on someone", isCorrect: false, explanation: "Creating fake profiles to spy on others is deceptive and potentially harassing — the opposite of good digital citizenship." }
  ]},
  { id: "dc-q4", topic: "Digital Citizenship", question: "Why should you be careful about what you share on social media even with privacy settings on?", options: [
    { text: "Privacy settings make everything completely private forever", isCorrect: false, explanation: "Privacy settings are not foolproof. Platforms change policies, friends can screenshot, and data breaches can expose content." },
    { text: "Nothing you post online is truly private — screenshots, data breaches, and policy changes can expose your content", isCorrect: true, explanation: "Correct! Even with the strongest privacy settings, content can be screenshotted, hacked, or exposed through policy changes." },
    { text: "Social media companies never look at your private posts", isCorrect: false, explanation: "Social media companies may access and analyze your content, even private posts, as outlined in their Terms of Service." },
    { text: "Only your friends can ever see your private content", isCorrect: false, explanation: "Friends can screenshot and share your content, platform employees may access it, and data breaches can expose it." }
  ]},
  { id: "dc-q5", topic: "Digital Citizenship", question: "What is the best response if you receive a message from a stranger asking for personal information?", options: [
    { text: "Reply politely and answer their questions", isCorrect: false, explanation: "Never share personal information with strangers online, regardless of how polite they seem." },
    { text: "Ignore it — they will go away eventually", isCorrect: false, explanation: "While ignoring is better than engaging, the best response includes reporting and telling a trusted adult." },
    { text: "Do not respond, block the person, and tell a trusted adult", isCorrect: true, explanation: "Correct! Do not engage with strangers asking for personal info. Block them, report the message, and inform a trusted adult." },
    { text: "Ask them why they need the information first", isCorrect: false, explanation: "Engaging with the stranger at all opens the door to manipulation. The safest response is to not respond, block, and report." }
  ]},
  { id: "dc-q6", topic: "Digital Citizenship", question: "What does it mean when someone says 'the internet is forever'?", options: [
    { text: "The internet will never be shut down", isCorrect: false, explanation: "This phrase refers to the permanence of content, not the infrastructure. What you post can be copied, cached, and preserved indefinitely." },
    { text: "Content posted online can be copied, saved, and may never truly be deleted", isCorrect: true, explanation: "Correct! Even deleted content may exist in screenshots, cached versions, archived pages, or other people's downloads." },
    { text: "You must keep your accounts active forever", isCorrect: false, explanation: "You can deactivate accounts, but the phrase means the content you created may persist beyond your control." },
    { text: "Websites never change or update their content", isCorrect: false, explanation: "Websites change constantly. The phrase means your contributions — posts, comments, photos — can persist permanently." }
  ]},
  { id: "dc-q7", topic: "Digital Citizenship", question: "A friend asks you to share your login password 'just in case.' What should you do?", options: [
    { text: "Share it because they are your friend and you trust them", isCorrect: false, explanation: "Even trusted friends should not have your passwords. Friendships change, and shared passwords create security risks." },
    { text: "Politely decline — passwords should never be shared with anyone except a parent or guardian", isCorrect: true, explanation: "Correct! Your password is like a key to your house. Only a parent or guardian should know it for safety purposes." },
    { text: "Give them an old password instead", isCorrect: false, explanation: "Sharing any password, even an old one, is a bad habit. If you reused that password, they could access your accounts." },
    { text: "Share it but change it after a few days", isCorrect: false, explanation: "Even temporary sharing is risky. The friend could access your account, change settings, or post on your behalf." }
  ]},
  { id: "dc-q8", topic: "Digital Citizenship", question: "What is an 'echo chamber' on social media?", options: [
    { text: "A sound effect used in video editing", isCorrect: false, explanation: "An echo chamber in the context of social media refers to information bubbles, not audio effects." },
    { text: "A situation where you only see content that agrees with your existing beliefs, reinforced by algorithms", isCorrect: true, explanation: "Correct! Social media algorithms show you content similar to what you already engage with, which can limit your exposure to diverse viewpoints." },
    { text: "A chatroom with too many people talking at once", isCorrect: false, explanation: "An echo chamber is about limited viewpoint diversity, not about the number of participants in a conversation." },
    { text: "A private group chat", isCorrect: false, explanation: "While private groups can become echo chambers, the term specifically refers to algorithmic reinforcement of existing beliefs." }
  ]},

  { id: "cb-q1", topic: "Cyberbullying Prevention", question: "What is the difference between cyberbullying and a one-time mean comment?", options: [
    { text: "There is no difference — all mean comments are cyberbullying", isCorrect: false, explanation: "While all mean comments are harmful, cyberbullying specifically involves a pattern of repeated harmful behavior." },
    { text: "Cyberbullying involves repeated, intentional harmful behavior using technology", isCorrect: true, explanation: "Correct! Cyberbullying is defined by its repetition and intentional nature. A single comment may be mean but is not necessarily cyberbullying." },
    { text: "Cyberbullying only happens on social media", isCorrect: false, explanation: "Cyberbullying can happen through any digital channel: text messages, gaming platforms, email, social media, and more." },
    { text: "Cyberbullying is less serious than in-person bullying", isCorrect: false, explanation: "Cyberbullying can be equally or more damaging because it can happen 24/7, reach large audiences, and content can be permanent." }
  ]},
  { id: "cb-q2", topic: "Cyberbullying Prevention", question: "What should you do first if you are being cyberbullied?", options: [
    { text: "Respond with an equally mean message", isCorrect: false, explanation: "Responding escalates the situation and could make you appear to be a participant in mutual conflict rather than a victim." },
    { text: "Delete all your social media accounts immediately", isCorrect: false, explanation: "You should not have to give up your online presence. Instead, focus on blocking, reporting, and telling a trusted adult." },
    { text: "Save evidence (screenshots), do not respond, and tell a trusted adult", isCorrect: true, explanation: "Correct! Saving evidence is crucial for reporting. Not responding denies the bully the reaction they want. Adults can help intervene." },
    { text: "Figure out who is doing it and confront them in person", isCorrect: false, explanation: "Confrontation can escalate the situation. Save evidence, report it, and let adults help resolve the situation safely." }
  ]},
  { id: "cb-q3", topic: "Cyberbullying Prevention", question: "Which of these is an example of cyberbullying?", options: [
    { text: "Disagreeing with someone's opinion in a respectful comment", isCorrect: false, explanation: "Respectful disagreement is normal and healthy online discourse — it is not cyberbullying." },
    { text: "Repeatedly sending threatening messages to someone after they ask you to stop", isCorrect: true, explanation: "Correct! Continued threatening messages after being asked to stop is a clear example of cyberbullying." },
    { text: "Not accepting a friend request from someone you do not know", isCorrect: false, explanation: "Being selective about who you connect with online is smart digital citizenship, not bullying." },
    { text: "Unfollowing someone whose content you no longer enjoy", isCorrect: false, explanation: "Unfollowing is a normal part of managing your social media experience and is not cyberbullying." }
  ]},
  { id: "cb-q4", topic: "Cyberbullying Prevention", question: "What is an 'upstander'?", options: [
    { text: "Someone who stands up physically to confront a bully", isCorrect: false, explanation: "An upstander takes positive action but does not need to physically confront anyone — there are many safe ways to intervene." },
    { text: "Someone who witnesses bullying and takes positive action to support the target", isCorrect: true, explanation: "Correct! Upstanders help by reporting, supporting the target privately, refusing to share harmful content, or speaking up safely." },
    { text: "Someone who watches bullying but does not get involved", isCorrect: false, explanation: "That describes a bystander. An upstander actively takes steps to help the person being bullied." },
    { text: "Someone who tells the bully's secrets to get revenge", isCorrect: false, explanation: "Revenge is not being an upstander — it is escalating the conflict. Upstanders support the target through positive, constructive actions." }
  ]},
  { id: "cb-q5", topic: "Cyberbullying Prevention", question: "Why is cyberbullying sometimes harder to escape than traditional bullying?", options: [
    { text: "Because cyberbullies are always adults", isCorrect: false, explanation: "Cyberbullies can be any age. The difficulty of escaping comes from the 24/7, persistent nature of digital communication." },
    { text: "Because it can happen 24/7, reach large audiences, and content can be shared or saved permanently", isCorrect: true, explanation: "Correct! Unlike face-to-face bullying, cyberbullying follows you home, can involve many people, and content can persist indefinitely." },
    { text: "Because teachers cannot do anything about cyberbullying", isCorrect: false, explanation: "Teachers and schools can and do intervene in cyberbullying. Many schools have policies specifically addressing digital harassment." },
    { text: "Because cyberbullying only happens to teenagers", isCorrect: false, explanation: "Cyberbullying affects people of all ages. The challenge is its persistence and reach, not who it targets." }
  ]},
  { id: "cb-q6", topic: "Cyberbullying Prevention", question: "You see a mean comment about a classmate in a group chat. What is the best upstander response?", options: [
    { text: "Like the comment so you do not seem like an outsider", isCorrect: false, explanation: "Liking the comment makes you a participant in the bullying, not a bystander or upstander." },
    { text: "Send a private supportive message to the classmate being targeted", isCorrect: true, explanation: "Correct! Privately supporting the target is one of the most effective upstander strategies. It shows them they are not alone." },
    { text: "Screenshot it and share it with other friends", isCorrect: false, explanation: "Sharing the content spreads the harmful message further. Instead, support the target and report the comment." },
    { text: "Leave the group chat without saying anything", isCorrect: false, explanation: "While leaving is better than participating, actively supporting the target is a more impactful upstander action." }
  ]},
  { id: "cb-q7", topic: "Cyberbullying Prevention", question: "What is 'doxxing'?", options: [
    { text: "Sending someone too many friend requests", isCorrect: false, explanation: "Doxxing is specifically about publishing someone's private information, not about friend requests." },
    { text: "Publishing someone's private personal information (address, phone number, etc.) online without their consent", isCorrect: true, explanation: "Correct! Doxxing is a serious form of online harassment that can endanger someone's safety. It may also be illegal in many jurisdictions." },
    { text: "Blocking someone on social media", isCorrect: false, explanation: "Blocking someone is a self-protective measure. Doxxing is the malicious publication of someone's private information." },
    { text: "Creating a fan page about someone", isCorrect: false, explanation: "Doxxing specifically means revealing private information to cause harm, not creating fan content." }
  ]},
  { id: "cb-q8", topic: "Cyberbullying Prevention", question: "A friend tells you they are being cyberbullied but asks you not to tell anyone. What should you do?", options: [
    { text: "Keep it a secret because they asked you to", isCorrect: false, explanation: "While respecting your friend's feelings is important, their safety comes first. Cyberbullying can escalate to dangerous levels." },
    { text: "Post about it on social media to raise awareness", isCorrect: false, explanation: "Posting publicly could embarrass your friend and make the situation worse. Seek adult help privately." },
    { text: "Listen, support them, and explain that a trusted adult needs to know to keep them safe", isCorrect: true, explanation: "Correct! Be a supportive friend while explaining that adults have resources and authority to help. Safety is more important than secrecy." },
    { text: "Tell them to just ignore it and it will stop", isCorrect: false, explanation: "Cyberbullying often escalates when ignored. Your friend needs support and adult intervention, not dismissal." }
  ]},

  { id: "ps-q1", topic: "Privacy & Security", question: "Which of the following is the STRONGEST password?", options: [
    { text: "P@ssw0rd123", isCorrect: false, explanation: "This is a commonly used password with predictable substitutions (a→@, o→0). Attackers check these patterns first." },
    { text: "PurpleCowsDanceOnSaturn", isCorrect: true, explanation: "Correct! This passphrase is long (22 characters), easy to remember, and does not contain common words together. Length beats complexity." },
    { text: "qwerty", isCorrect: false, explanation: "This is one of the most commonly used (and cracked) passwords in the world. It follows the keyboard layout and is easily guessed." },
    { text: "MyBirthday2010!", isCorrect: false, explanation: "Passwords containing personal information (birthdays, names) are vulnerable because that information is often publicly available." }
  ]},
  { id: "ps-q2", topic: "Privacy & Security", question: "What is 'phishing'?", options: [
    { text: "A type of computer virus that destroys files", isCorrect: false, explanation: "Phishing is a social engineering attack, not a virus. It tricks you into providing information, rather than infecting your computer directly." },
    { text: "A fraudulent attempt to steal personal information by posing as a trustworthy source", isCorrect: true, explanation: "Correct! Phishing uses deceptive emails, texts, or websites that impersonate trusted organizations to steal credentials and personal data." },
    { text: "A method of speeding up your internet connection", isCorrect: false, explanation: "Phishing has nothing to do with internet speed. It is a type of social engineering attack designed to steal your information." },
    { text: "A way to recover a forgotten password", isCorrect: false, explanation: "Phishing is an attack, not a recovery method. Ironically, phishing often tricks people into 'resetting' passwords on fake sites." }
  ]},
  { id: "ps-q3", topic: "Privacy & Security", question: "Why should you avoid using the same password for multiple accounts?", options: [
    { text: "It makes your passwords harder to remember", isCorrect: false, explanation: "While this is true, the main reason is security, not convenience." },
    { text: "If one account is breached, all accounts using that password are compromised", isCorrect: true, explanation: "Correct! This is called 'credential stuffing' — attackers try leaked passwords on other services, and reused passwords give them access to everything." },
    { text: "Websites do not allow duplicate passwords", isCorrect: false, explanation: "Websites cannot tell if you use the same password elsewhere. The risk is entirely about security, not platform rules." },
    { text: "It is against the law to reuse passwords", isCorrect: false, explanation: "Password reuse is not illegal, but it is a serious security risk that can lead to multiple account compromises from a single breach." }
  ]},
  { id: "ps-q4", topic: "Privacy & Security", question: "What is two-factor authentication (2FA)?", options: [
    { text: "Using two different passwords for the same account", isCorrect: false, explanation: "2FA is not about two passwords. It combines something you know (password) with something you have (phone) or are (fingerprint)." },
    { text: "A security method that requires two forms of verification to access an account", isCorrect: true, explanation: "Correct! 2FA adds a second layer of security beyond your password — usually a code sent to your phone, an authenticator app, or biometrics." },
    { text: "Having two people share the same account", isCorrect: false, explanation: "Sharing accounts is a security risk, not a security feature. 2FA is about verifying identity through two different methods." },
    { text: "Logging in from two different devices", isCorrect: false, explanation: "2FA is about verification methods, not device count. It requires two different types of proof that you are who you claim to be." }
  ]},
  { id: "ps-q5", topic: "Privacy & Security", question: "You receive a text from your 'bank' asking you to verify your account by clicking a link. What should you do?", options: [
    { text: "Click the link immediately to protect your account", isCorrect: false, explanation: "Never click links in unsolicited texts claiming to be from your bank. This is a common smishing (SMS phishing) technique." },
    { text: "Reply to the text asking if it is real", isCorrect: false, explanation: "Replying confirms your phone number is active and may lead to more scam attempts. Never engage with suspicious texts." },
    { text: "Do not click the link — instead, call your bank directly using the number on your card or their official website", isCorrect: true, explanation: "Correct! Always verify directly with the institution using contact information you know is legitimate, not from the suspicious message." },
    { text: "Forward it to all your contacts to warn them", isCorrect: false, explanation: "Forwarding could accidentally spread the phishing link. Instead, report it to your bank and your carrier (forward to 7726/SPAM)." }
  ]},
  { id: "ps-q6", topic: "Privacy & Security", question: "Which piece of information is MOST dangerous to share publicly online?", options: [
    { text: "Your favorite movie", isCorrect: false, explanation: "Entertainment preferences are low-risk personal information that generally cannot be used for identity theft." },
    { text: "Your school or workplace name", isCorrect: false, explanation: "While sharing your location has some risk, your home address combined with other data is far more dangerous." },
    { text: "Your home address", isCorrect: true, explanation: "Correct! Your home address can be used for stalking, identity theft, social engineering, and physical security threats." },
    { text: "Your opinion on a current event", isCorrect: false, explanation: "Sharing opinions has some social risk but is not a direct security threat like sharing your physical address." }
  ]},
  { id: "ps-q7", topic: "Privacy & Security", question: "What is a 'data breach'?", options: [
    { text: "When you accidentally delete your own files", isCorrect: false, explanation: "Deleting your own files is data loss, not a data breach. A breach involves unauthorized access by others." },
    { text: "When a hacker or unauthorized person gains access to confidential data stored by an organization", isCorrect: true, explanation: "Correct! Data breaches expose personal information like emails, passwords, and financial data that was supposed to be protected." },
    { text: "When your internet connection drops", isCorrect: false, explanation: "A dropped connection is a network issue. A data breach is a security incident where protected data is accessed without authorization." },
    { text: "When you share your own information voluntarily", isCorrect: false, explanation: "Voluntarily sharing information is not a breach. A breach is when data is accessed without the owner's or organization's consent." }
  ]},
  { id: "ps-q8", topic: "Privacy & Security", question: "What does a VPN (Virtual Private Network) do?", options: [
    { text: "Makes your internet connection faster", isCorrect: false, explanation: "VPNs actually may slow your connection slightly because they encrypt and route your traffic through a secure server." },
    { text: "Encrypts your internet connection and hides your IP address for increased privacy", isCorrect: true, explanation: "Correct! A VPN creates a secure, encrypted tunnel for your internet traffic, making it harder for others to monitor your online activity." },
    { text: "Blocks all viruses and malware", isCorrect: false, explanation: "A VPN is not antivirus software. It protects your privacy and encrypts your connection, but does not scan for malware." },
    { text: "Gives you free access to paid websites", isCorrect: false, explanation: "While VPNs can bypass some geographic restrictions, they do not grant free access to paid services." }
  ]},

  { id: "ml-q1", topic: "Media Literacy", question: "What is 'lateral reading'?", options: [
    { text: "Reading articles from left to right", isCorrect: false, explanation: "Lateral reading is a research technique, not a reading direction." },
    { text: "Opening new tabs to check what other sources say about a claim instead of just reading deeper into the original source", isCorrect: true, explanation: "Correct! Lateral reading means verifying information by checking other sources rather than relying on the original site, which may be biased or false." },
    { text: "Reading only the headlines of articles", isCorrect: false, explanation: "Reading only headlines is a poor information practice. Lateral reading involves actively cross-referencing information across multiple sources." },
    { text: "Reading two articles at the same time", isCorrect: false, explanation: "Lateral reading is about verification strategy — checking claims against independent sources rather than trusting a single source." }
  ]},
  { id: "ml-q2", topic: "Media Literacy", question: "What is a 'filter bubble'?", options: [
    { text: "A tool that blocks spam emails", isCorrect: false, explanation: "A filter bubble is not a spam filter. It describes the information isolation created by algorithmic personalization." },
    { text: "An algorithm-created environment where you only see content that matches your existing beliefs and interests", isCorrect: true, explanation: "Correct! Filter bubbles limit your exposure to diverse viewpoints, potentially reinforcing biases and creating a distorted view of reality." },
    { text: "A water filtration system", isCorrect: false, explanation: "In media literacy, a filter bubble refers to the personalized information ecosystem created by algorithms." },
    { text: "A privacy setting on social media", isCorrect: false, explanation: "Filter bubbles are not settings you choose — they are created automatically by algorithms that personalize your content feed." }
  ]},
  { id: "ml-q3", topic: "Media Literacy", question: "Which of the following is the BEST way to check if a news story is true?", options: [
    { text: "Check if it has a lot of likes and shares", isCorrect: false, explanation: "Viral content is not necessarily accurate. Misinformation often spreads faster than accurate reporting." },
    { text: "Look at whether the website looks professional", isCorrect: false, explanation: "Fake news sites can look very professional. Design quality does not indicate factual accuracy." },
    { text: "Check if multiple reputable, independent sources report the same facts", isCorrect: true, explanation: "Correct! Cross-referencing with established, independent news organizations is the most reliable verification method." },
    { text: "See if your friends believe it", isCorrect: false, explanation: "Friends can be misled by the same misinformation. Always verify independently rather than relying on social consensus." }
  ]},
  { id: "ml-q4", topic: "Media Literacy", question: "What is a 'deepfake'?", options: [
    { text: "A very old photograph", isCorrect: false, explanation: "Deepfakes are AI-generated synthetic media, not old photographs." },
    { text: "AI-generated or manipulated video or audio that makes it appear someone said or did something they never actually did", isCorrect: true, explanation: "Correct! Deepfakes use artificial intelligence to create convincing fake videos or audio, posing serious risks to truth and trust." },
    { text: "A hidden message in a photograph", isCorrect: false, explanation: "Hidden messages in images are called steganography. Deepfakes are AI-manipulated video or audio." },
    { text: "A type of social media filter", isCorrect: false, explanation: "While social media filters alter appearance, deepfakes are more sophisticated AI-generated content designed to deceive." }
  ]},
  { id: "ml-q5", topic: "Media Literacy", question: "Why is it important to check the date of an article before sharing it?", options: [
    { text: "Older articles are always wrong", isCorrect: false, explanation: "Old articles are not necessarily wrong, but sharing outdated information can be misleading if the situation has changed." },
    { text: "Because outdated information shared as current can be misleading and cause confusion", isCorrect: true, explanation: "Correct! Old articles about resolved crises, changed laws, or outdated statistics can spread misinformation if shared as if they are current." },
    { text: "Because websites delete old articles", isCorrect: false, explanation: "Most websites keep old articles available. The issue is not access but context — old information shared without date context is misleading." },
    { text: "Because search engines penalize old content", isCorrect: false, explanation: "Search engine ranking is not the concern. The risk is that outdated information can mislead people who assume it is current." }
  ]},
  { id: "ml-q6", topic: "Media Literacy", question: "What is 'confirmation bias'?", options: [
    { text: "When a website confirms your email address", isCorrect: false, explanation: "Confirmation bias is a psychological tendency, not a technical process." },
    { text: "The tendency to search for, favor, and remember information that confirms your existing beliefs", isCorrect: true, explanation: "Correct! Confirmation bias makes us more likely to accept information that agrees with us and dismiss information that challenges us." },
    { text: "When two sources agree on the same fact", isCorrect: false, explanation: "Multiple sources agreeing is corroboration, which is positive. Confirmation bias is a cognitive bias that limits critical thinking." },
    { text: "A type of computer error", isCorrect: false, explanation: "Confirmation bias is a human cognitive bias, not a computer error." }
  ]},
  { id: "ml-q7", topic: "Media Literacy", question: "An article claims '90% of teenagers are addicted to social media.' How should you evaluate this claim?", options: [
    { text: "Accept it because it sounds believable", isCorrect: false, explanation: "Sounding believable is not enough. Critical evaluation requires checking the source, methodology, and definition of 'addicted.'" },
    { text: "Check who conducted the study, their methodology, how they defined 'addicted,' and whether other research supports this number", isCorrect: true, explanation: "Correct! Evaluating the source, methods, definitions, and corroborating evidence is essential for assessing any statistical claim." },
    { text: "Reject it because the number seems too high", isCorrect: false, explanation: "Rejecting based on gut feeling is as unreliable as accepting without evidence. Proper evaluation requires checking sources and methods." },
    { text: "Share it immediately because it is important information", isCorrect: false, explanation: "Sharing unverified statistics contributes to misinformation. Always verify before sharing, especially dramatic claims." }
  ]},
  { id: "ml-q8", topic: "Media Literacy", question: "What role do algorithms play in the spread of misinformation?", options: [
    { text: "Algorithms always remove false information", isCorrect: false, explanation: "Algorithms are not designed primarily to filter truth. They prioritize engagement, which can actually amplify sensational misinformation." },
    { text: "Algorithms have no effect on what information spreads", isCorrect: false, explanation: "Algorithms have enormous influence on information distribution. They determine what appears in your feed based on engagement patterns." },
    { text: "Algorithms can amplify misinformation by prioritizing engaging content, regardless of accuracy", isCorrect: true, explanation: "Correct! Engagement-driven algorithms often promote sensational, emotional, or controversial content — which misinformation tends to be." },
    { text: "Algorithms only show you content from verified sources", isCorrect: false, explanation: "Most social media algorithms prioritize engagement metrics, not source verification. This means unverified content can be widely promoted." }
  ]},

  { id: "rg-q1", topic: "Responsible Gaming", question: "What is a 'loot box' in gaming?", options: [
    { text: "A treasure chest found during gameplay that contains in-game rewards earned through playing", isCorrect: false, explanation: "Loot boxes specifically involve real-money purchases with randomized rewards, not earned in-game rewards." },
    { text: "A randomized virtual item purchased with real money where you do not know what you will get", isCorrect: true, explanation: "Correct! Loot boxes are controversial because they use randomization mechanics similar to gambling, encouraging repeated purchases." },
    { text: "A storage system for saving game progress", isCorrect: false, explanation: "Loot boxes are monetization mechanics, not storage systems. They involve real-money purchases for random virtual items." },
    { text: "A bonus level in a game", isCorrect: false, explanation: "Loot boxes are paid randomized reward systems, not bonus levels. They are a monetization strategy used by game publishers." }
  ]},
  { id: "rg-q2", topic: "Responsible Gaming", question: "How much can small in-game purchases ($1-5) add up to over a year if you buy one per week?", options: [
    { text: "$12-20", isCorrect: false, explanation: "$1-5 per week times 52 weeks equals $52-260 per year, not $12-20." },
    { text: "$52-260", isCorrect: true, explanation: "Correct! Even small purchases add up significantly. At just $3 per week, you would spend $156 per year on virtual items." },
    { text: "$500-1000", isCorrect: false, explanation: "At $1-5 per week, the yearly total would be $52-260. $500+ would require spending $10+ per week." },
    { text: "It depends on the game so you cannot estimate", isCorrect: false, explanation: "Basic math applies regardless of the game: $1-5/week x 52 weeks = $52-260/year." }
  ]},
  { id: "rg-q3", topic: "Responsible Gaming", question: "What is a healthy approach to managing screen time?", options: [
    { text: "No screens at all — technology is always harmful", isCorrect: false, explanation: "Technology can be educational and social. The key is balance, not complete avoidance." },
    { text: "Set intentional time limits, take regular breaks, and balance screen time with physical activity and face-to-face interaction", isCorrect: true, explanation: "Correct! Healthy screen time is about intentional, balanced use — not complete avoidance or unlimited access." },
    { text: "Use screens as much as you want as long as you are doing something educational", isCorrect: false, explanation: "Even educational screen time should be balanced. Prolonged use can affect sleep, physical health, and social development." },
    { text: "Only use screens on weekends", isCorrect: false, explanation: "Rigid rules are less effective than developing self-regulation skills. The goal is balanced, intentional use throughout the week." }
  ]},
  { id: "rg-q4", topic: "Responsible Gaming", question: "Why do some games use 'daily login rewards'?", options: [
    { text: "To thank players for their loyalty", isCorrect: false, explanation: "While framed as rewards, daily login mechanics are designed to create habit-forming behavior and increase player engagement metrics." },
    { text: "To create a habit that keeps players coming back every day, increasing engagement and potential spending", isCorrect: true, explanation: "Correct! Daily login rewards exploit habit formation. Missing a day creates FOMO (Fear of Missing Out) which drives compulsive engagement." },
    { text: "Because the game developers are generous", isCorrect: false, explanation: "Daily rewards are a deliberate design strategy to increase player retention and monetization, not an act of generosity." },
    { text: "To help players improve their skills", isCorrect: false, explanation: "Daily login rewards are about engagement and retention, not skill development. They are a business strategy, not a learning tool." }
  ]},
  { id: "rg-q5", topic: "Responsible Gaming", question: "What should you do if a stranger in an online game asks to be friends and chat privately?", options: [
    { text: "Accept because they seem friendly in the game", isCorrect: false, explanation: "In-game friendliness does not verify someone's identity or intentions. Predators often use gaming to build trust before exploitation." },
    { text: "Give them your social media handle so you can connect there", isCorrect: false, explanation: "Moving to social media gives strangers access to more personal information and photos. Never share social media with unknown gamers." },
    { text: "Keep interactions in the public game chat, do not share personal info, and tell a parent or guardian about the request", isCorrect: true, explanation: "Correct! Public game chat is safer. Never move to private messaging with strangers, and always inform a trusted adult." },
    { text: "It is fine as long as they are around your age", isCorrect: false, explanation: "You cannot verify anyone's age online. People frequently misrepresent themselves in gaming environments." }
  ]},
  { id: "rg-q6", topic: "Responsible Gaming", question: "What are game ratings (like ESRB or PEGI) used for?", options: [
    { text: "To rate how fun a game is", isCorrect: false, explanation: "Game ratings indicate content suitability by age, not entertainment quality. They help parents and players make informed choices." },
    { text: "To indicate the age-appropriateness of content including violence, language, and sexual themes", isCorrect: true, explanation: "Correct! Ratings like ESRB (US) and PEGI (Europe) classify games by content type and suggest appropriate age ranges." },
    { text: "To show how difficult a game is", isCorrect: false, explanation: "Ratings are about content appropriateness, not difficulty level. An E-rated game can be very challenging." },
    { text: "To determine the price of the game", isCorrect: false, explanation: "Game pricing is independent of content ratings. Ratings exist to inform consumers about content, not pricing." }
  ]},
  { id: "rg-q7", topic: "Responsible Gaming", question: "What is 'FOMO' in the context of gaming?", options: [
    { text: "A game genre", isCorrect: false, explanation: "FOMO (Fear of Missing Out) is a psychological phenomenon exploited by game design, not a game genre." },
    { text: "Fear of Missing Out — anxiety created by limited-time events and exclusive items that pressure players to play more or spend money", isCorrect: true, explanation: "Correct! Games use limited-time events, exclusive items, and countdown timers to create urgency and drive engagement and spending." },
    { text: "A cheat code used in gaming", isCorrect: false, explanation: "FOMO is a psychological concept about the anxiety of missing out on experiences, not a game mechanic or code." },
    { text: "A type of in-game currency", isCorrect: false, explanation: "FOMO stands for Fear of Missing Out — a feeling that game designers deliberately create to increase player engagement." }
  ]},
  { id: "rg-q8", topic: "Responsible Gaming", question: "How can excessive gaming affect your health?", options: [
    { text: "Gaming has no effect on health", isCorrect: false, explanation: "Excessive gaming can affect sleep, physical health, mental health, and social development." },
    { text: "It can only cause eye strain", isCorrect: false, explanation: "While eye strain is a concern, excessive gaming can also impact sleep, physical fitness, mental health, and social relationships." },
    { text: "It can disrupt sleep, cause physical strain (eyes, wrists, back), reduce physical activity, and impact mental health and social connections", isCorrect: true, explanation: "Correct! Excessive gaming affects multiple aspects of health. Balanced gaming with breaks, exercise, and social interaction is key." },
    { text: "It only affects people who play violent games", isCorrect: false, explanation: "Health impacts from excessive gaming are related to prolonged sedentary behavior and screen time, not game content." }
  ]},

  { id: "st-q1", topic: "School Technology Safety", question: "What should you do if you receive a suspicious email that appears to come from your school administration?", options: [
    { text: "Click the link to see if it is real", isCorrect: false, explanation: "Never click links in suspicious emails. This is how phishing attacks compromise accounts and systems." },
    { text: "Reply to ask if it is legitimate", isCorrect: false, explanation: "Replying engages with the potential attacker. Instead, verify through a separate, trusted communication channel." },
    { text: "Report it to your IT department or teacher and verify by contacting administration directly through a known channel", isCorrect: true, explanation: "Correct! Report suspicious emails and verify through official channels — call the office, ask in person, or use a known email address." },
    { text: "Delete it and forget about it", isCorrect: false, explanation: "While deleting is better than clicking, reporting helps the school protect other potential targets from the same attack." }
  ]},
  { id: "st-q2", topic: "School Technology Safety", question: "Why is it important to lock your school computer or account when stepping away?", options: [
    { text: "So others cannot use your internet time", isCorrect: false, explanation: "While fair use matters, the primary reason is preventing unauthorized access to your account and the school's systems." },
    { text: "To prevent unauthorized access to your account, personal files, and the school network", isCorrect: true, explanation: "Correct! An unlocked account can be used to access personal data, send messages as you, or compromise the school network." },
    { text: "It does not matter because school computers have no personal data", isCorrect: false, explanation: "School accounts contain personal information, grades, and may provide access to the broader school network." },
    { text: "Only teachers need to lock their computers", isCorrect: false, explanation: "Everyone should lock their accounts. Student accounts can be misused for cyberbullying, cheating, or network attacks." }
  ]},
  { id: "st-q3", topic: "School Technology Safety", question: "What is 'social engineering' in cybersecurity?", options: [
    { text: "Building social media platforms", isCorrect: false, explanation: "Social engineering is a manipulation technique, not platform development." },
    { text: "Manipulating people into revealing confidential information or performing actions that compromise security", isCorrect: true, explanation: "Correct! Social engineering exploits human psychology rather than technical vulnerabilities. It includes phishing, pretexting, and baiting." },
    { text: "Engineering solutions for social problems", isCorrect: false, explanation: "In cybersecurity, social engineering specifically means manipulating people to bypass security measures." },
    { text: "A type of computer programming", isCorrect: false, explanation: "Social engineering targets people, not code. It uses psychological manipulation to trick people into security mistakes." }
  ]},
  { id: "st-q4", topic: "School Technology Safety", question: "Why should students avoid using public Wi-Fi for accessing school accounts?", options: [
    { text: "Public Wi-Fi is always slow", isCorrect: false, explanation: "Speed is not the primary concern. Public Wi-Fi networks can be monitored by attackers to intercept sensitive data." },
    { text: "Because attackers can intercept data on unsecured public networks, potentially capturing login credentials", isCorrect: true, explanation: "Correct! Public Wi-Fi can be monitored through 'man-in-the-middle' attacks. Use a VPN or your mobile data for sensitive access." },
    { text: "Schools block public Wi-Fi", isCorrect: false, explanation: "Schools cannot block external Wi-Fi networks. The risk is that public networks are unsecured and vulnerable to interception." },
    { text: "It uses too much data", isCorrect: false, explanation: "Data usage is not the concern. The security risk of unsecured networks intercepting your credentials is the primary issue." }
  ]},
  { id: "st-q5", topic: "School Technology Safety", question: "What is the purpose of a school's Acceptable Use Policy (AUP)?", options: [
    { text: "To prevent students from using any technology", isCorrect: false, explanation: "AUPs are not designed to prevent technology use but to establish guidelines for safe and responsible use." },
    { text: "To establish guidelines for responsible and safe technology use, protecting both students and the school", isCorrect: true, explanation: "Correct! AUPs outline what is acceptable, what is prohibited, and the consequences of misuse — protecting everyone in the school community." },
    { text: "To monitor everything students do online", isCorrect: false, explanation: "While monitoring may be part of school policy, the primary purpose of an AUP is to set clear expectations for responsible use." },
    { text: "To restrict social media access only", isCorrect: false, explanation: "AUPs cover all technology use, not just social media. They address email, internet browsing, device use, and more." }
  ]},
  { id: "st-q6", topic: "School Technology Safety", question: "A classmate asks to borrow your school login to finish their homework because they forgot theirs. What should you do?", options: [
    { text: "Share your password since it is an emergency", isCorrect: false, explanation: "Even in emergencies, sharing passwords violates security policies and puts your account at risk." },
    { text: "Let them use your computer while you watch", isCorrect: false, explanation: "Your account should only be used by you. Any actions taken under your login are attributed to you." },
    { text: "Decline and suggest they contact their teacher or the IT help desk to reset their password", isCorrect: true, explanation: "Correct! There are proper channels for password resets. Sharing your credentials makes you responsible for any actions taken on your account." },
    { text: "Create a temporary password for them", isCorrect: false, explanation: "You cannot create temporary passwords for others, and any password sharing violates security policies." }
  ]},
  { id: "st-q7", topic: "School Technology Safety", question: "What should you do if you accidentally access something inappropriate on a school computer?", options: [
    { text: "Quickly close it and hope nobody noticed", isCorrect: false, explanation: "Hiding accidental access can look suspicious later. Transparency is always the best policy with accidental exposure." },
    { text: "Tell a friend so they can verify what happened", isCorrect: false, explanation: "Involving peers is unnecessary. Report directly to your teacher or IT staff who can properly document the incident." },
    { text: "Immediately close the content and tell your teacher what happened", isCorrect: true, explanation: "Correct! Being honest about accidental access protects you. Schools can see browsing history, so transparency prevents misunderstandings." },
    { text: "Clear the browser history to remove all evidence", isCorrect: false, explanation: "Deleting history can appear as a cover-up. Network logs may still show the access. Honesty is always the best approach." }
  ]},
  { id: "st-q8", topic: "School Technology Safety", question: "Why is it important to keep school software and apps updated?", options: [
    { text: "Updates make apps look better", isCorrect: false, explanation: "While updates may include design changes, the primary security reason is patching vulnerabilities." },
    { text: "Updates are not important and can be skipped", isCorrect: false, explanation: "Skipping updates leaves known security vulnerabilities unpatched, making systems easy targets for attackers." },
    { text: "Updates often include security patches that fix vulnerabilities that attackers could exploit", isCorrect: true, explanation: "Correct! Security patches close known vulnerabilities. Unpatched systems are among the most common entry points for cyberattacks." },
    { text: "Schools require updates for compliance reports only", isCorrect: false, explanation: "While compliance matters, the practical reason for updates is protecting against known security vulnerabilities." }
  ]}
];

export const curriculumStandards: CurriculumStandard[] = [
  { framework: "ISTE", standardId: "ISTE 2a", description: "Students cultivate and manage their digital identity and reputation and are aware of the permanence of their actions in the digital world.", topics: ["Digital Citizenship", "Privacy & Security"] },
  { framework: "ISTE", standardId: "ISTE 2b", description: "Students engage in positive, safe, legal and ethical behavior when using technology.", topics: ["Digital Citizenship", "Cyberbullying Prevention", "School Technology Safety"] },
  { framework: "ISTE", standardId: "ISTE 2c", description: "Students demonstrate an understanding of and respect for the rights and obligations of using and sharing intellectual property.", topics: ["Digital Citizenship", "Media Literacy"] },
  { framework: "ISTE", standardId: "ISTE 2d", description: "Students manage their personal data to maintain digital privacy and security.", topics: ["Privacy & Security"] },
  { framework: "ISTE", standardId: "ISTE 3a", description: "Students plan and employ effective research strategies to locate information and other resources for their intellectual or creative pursuits.", topics: ["Media Literacy"] },
  { framework: "ISTE", standardId: "ISTE 3b", description: "Students evaluate the accuracy, perspective, credibility and relevance of information, media, data or other resources.", topics: ["Media Literacy"] },
  { framework: "ISTE", standardId: "ISTE 3d", description: "Students build knowledge by actively exploring real-world issues and problems, developing ideas and theories and pursuing answers.", topics: ["Digital Citizenship", "Media Literacy", "School Technology Safety"] },
  { framework: "ISTE", standardId: "ISTE 7a", description: "Students use digital tools to connect with learners from a variety of backgrounds and cultures.", topics: ["Digital Citizenship", "Responsible Gaming"] },

  { framework: "CSTA", standardId: "CSTA 3A-NI-05", description: "Give examples of network security concerns and appropriate mitigation strategies.", topics: ["Privacy & Security", "School Technology Safety"] },
  { framework: "CSTA", standardId: "CSTA 3A-NI-06", description: "Recommend security measures to address various scenarios based on factors such as efficiency, feasibility, and ethical impacts.", topics: ["Privacy & Security", "School Technology Safety"] },
  { framework: "CSTA", standardId: "CSTA 2-IC-20", description: "Compare tradeoffs associated with computing technologies that affect everyday activities and career options.", topics: ["Digital Citizenship", "Responsible Gaming", "Media Literacy"] },
  { framework: "CSTA", standardId: "CSTA 2-IC-21", description: "Discuss issues of bias and accessibility in the design of existing technologies.", topics: ["Media Literacy", "Digital Citizenship"] },
  { framework: "CSTA", standardId: "CSTA 3A-IC-24", description: "Evaluate the ways computing impacts personal, ethical, social, economic, and cultural practices.", topics: ["Digital Citizenship", "Cyberbullying Prevention", "Responsible Gaming"] },
  { framework: "CSTA", standardId: "CSTA 3A-IC-29", description: "Explain the privacy concerns related to the collection and generation of data through automated processes.", topics: ["Privacy & Security", "Media Literacy"] },
  { framework: "CSTA", standardId: "CSTA 3A-IC-30", description: "Evaluate the social and economic implications of privacy in the context of safety, law, or ethics.", topics: ["Privacy & Security", "Digital Citizenship"] },

  { framework: "Common Core", standardId: "CCSS.ELA-LITERACY.RI.5.8", description: "Explain how an author uses reasons and evidence to support particular points in a text.", topics: ["Media Literacy"] },
  { framework: "Common Core", standardId: "CCSS.ELA-LITERACY.W.6.1", description: "Write arguments to support claims with clear reasons and relevant evidence.", topics: ["Media Literacy", "Digital Citizenship"] },
  { framework: "Common Core", standardId: "CCSS.ELA-LITERACY.SL.8.1", description: "Engage effectively in collaborative discussions with diverse partners on grade-level topics.", topics: ["Digital Citizenship", "Cyberbullying Prevention"] },
  { framework: "Common Core", standardId: "CCSS.ELA-LITERACY.RH.9-10.1", description: "Cite specific textual evidence to support analysis of primary and secondary sources.", topics: ["Media Literacy"] },
  { framework: "Common Core", standardId: "CCSS.MATH.CONTENT.5.NBT.B.7", description: "Add, subtract, multiply, and divide decimals to hundredths, using concrete models.", topics: ["Responsible Gaming"] },
  { framework: "Common Core", standardId: "CCSS.ELA-LITERACY.W.4.2", description: "Write informative/explanatory texts to examine a topic and convey ideas clearly.", topics: ["Digital Citizenship", "School Technology Safety"] },
  { framework: "Common Core", standardId: "CCSS.ELA-LITERACY.SL.5.1", description: "Engage effectively in collaborative discussions, building on others' ideas and expressing own clearly.", topics: ["Cyberbullying Prevention", "Digital Citizenship"] }
];

export const classroomMaterials: ClassroomMaterial[] = [
  {
    id: "safety-rules-poster",
    title: "Internet Safety Rules Poster",
    type: "poster",
    icon: "shield",
    color: "bg-blue-500",
    description: "A colorful poster with 8 essential internet safety rules for classroom display.",
    gradeLevel: "K-5",
    sections: [
      { heading: "Rule 1: Ask First", content: "Always ask a parent or teacher before going online or downloading anything." },
      { heading: "Rule 2: Keep Secrets", content: "Never share your password, address, phone number, or school name with strangers online." },
      { heading: "Rule 3: Be Kind", content: "Treat everyone online the way you want to be treated." },
      { heading: "Rule 4: Tell a Grown-Up", content: "If something online makes you uncomfortable, tell a trusted adult right away." },
      { heading: "Rule 5: Think Before You Click", content: "Do not click on links or pop-ups from people you do not know." },
      { heading: "Rule 6: Protect Your Identity", content: "Use a screen name that does not reveal your real name or age." },
      { heading: "Rule 7: Not Everything Is Real", content: "People online may not be who they say they are." },
      { heading: "Rule 8: Balance Your Time", content: "Take breaks from screens and spend time doing other activities too." }
    ]
  },
  {
    id: "phishing-red-flags",
    title: "Phishing Red Flags Quick Reference",
    type: "handout",
    icon: "mail",
    color: "bg-red-500",
    description: "A one-page reference card students can keep to identify phishing attempts.",
    gradeLevel: "Grades 4-12",
    sections: [
      { heading: "Suspicious Sender", content: "Check the email address carefully. Look for misspellings like 'amaz0n' or unusual domains." },
      { heading: "Urgency Language", content: "Watch for phrases like 'Act NOW,' 'Your account will be closed,' or 'Only 24 hours left.'" },
      { heading: "Generic Greeting", content: "Real companies use your name. Be cautious of 'Dear Customer' or 'Dear User.'" },
      { heading: "Suspicious Links", content: "Hover over links (do not click!) to see the real URL. Check if it matches the claimed sender." },
      { heading: "Spelling and Grammar", content: "Professional organizations proofread. Multiple errors suggest a scam." },
      { heading: "Request for Info", content: "Legitimate companies never ask for passwords, SSNs, or PINs via email." },
      { heading: "What to Do", content: "Do not click, do not reply, report to IT or a teacher, and delete the message." }
    ]
  },
  {
    id: "password-strength-guide",
    title: "Password Strength Builder Guide",
    type: "activity-sheet",
    icon: "key",
    color: "bg-purple-500",
    description: "An interactive worksheet for creating strong, memorable passwords using the passphrase method.",
    gradeLevel: "Grades 3-10",
    sections: [
      { heading: "The Problem with Weak Passwords", content: "'password123' can be cracked in less than 1 second. '!xK9#mP2' is strong but impossible to remember." },
      { heading: "The Passphrase Method", content: "Pick 4 random, unrelated words and combine them: 'PurpleCowsDanceOnSaturn' = 22 characters and easy to remember!" },
      { heading: "Step 1: Pick 4 Random Words", content: "Open a book to random pages and pick one word from each page. The sillier the combination, the more memorable." },
      { heading: "Step 2: Make It Unique", content: "Add a number or special character between words: 'Purple7CowsDance!OnSaturn'" },
      { heading: "Step 3: Test Your Password", content: "Score it: 1 point per character, 2 bonus for mixed case, 2 for numbers, 2 for special characters, 3 if you can memorize it in 30 seconds." },
      { heading: "Golden Rules", content: "Never reuse passwords. Never share them. Use a password manager to store them safely." }
    ]
  },
  {
    id: "cyberbullying-response",
    title: "Cyberbullying Response Cards",
    type: "discussion-cards",
    icon: "users",
    color: "bg-amber-500",
    description: "Scenario cards for classroom discussion about cyberbullying situations and appropriate responses.",
    gradeLevel: "Grades 3-12",
    sections: [
      { heading: "Scenario: Mean Group Chat", content: "Your friend shows you a group chat where other kids are saying mean things about a classmate. What do you do?" },
      { heading: "Scenario: Embarrassing Photo", content: "Someone shares a photo of you that you find embarrassing. It is getting likes and comments. What do you do?" },
      { heading: "Scenario: Online Impersonation", content: "Someone created a fake account using your name and is posting things pretending to be you. What do you do?" },
      { heading: "Scenario: Exclusion", content: "A group of friends created a new chat and deliberately did not include one classmate. Is this cyberbullying?" },
      { heading: "Scenario: 'Just Joking'", content: "A friend posts something hurtful about you and says 'It is just a joke, relax.' How do you respond?" },
      { heading: "Remember", content: "Save evidence (screenshots). Do not respond to the bully. Tell a trusted adult. Block the person. You are not alone." }
    ]
  },
  {
    id: "digital-footprint-worksheet",
    title: "My Digital Footprint Worksheet",
    type: "activity-sheet",
    icon: "footprints",
    color: "bg-green-500",
    description: "A self-assessment worksheet for students to map and evaluate their digital presence.",
    gradeLevel: "Grades 5-12",
    sections: [
      { heading: "My Online Accounts", content: "List every app, game, and website where you have an account. Include ones you no longer use." },
      { heading: "What I Share", content: "For each account, note: What info did you provide? (Name, email, birthday, photos?) Who can see your profile?" },
      { heading: "Privacy Check", content: "For your 3 most-used accounts: Is your profile public or private? Can strangers message you? Is location sharing on?" },
      { heading: "The Google Test", content: "If someone searched your name, what would they find? Would you be comfortable with a teacher or future employer seeing it?" },
      { heading: "Action Plan", content: "List 3 things you will do this week: (1) A privacy setting to change, (2) An old account to delete, (3) Content to remove." },
      { heading: "Reflection", content: "Describe the digital footprint you WANT to have. What positive things do you want associated with your name?" }
    ]
  },
  {
    id: "media-literacy-checklist",
    title: "Source Verification Checklist",
    type: "checklist",
    icon: "search",
    color: "bg-indigo-500",
    description: "A step-by-step checklist for evaluating online sources and claims before believing or sharing them.",
    gradeLevel: "Grades 5-12",
    sections: [
      { heading: "Step 1: Check the Source", content: "Who published this? Is it a known, reputable organization? Search for the source name + 'bias' or 'reliability.'" },
      { heading: "Step 2: Check the Author", content: "Is the author a real person with relevant expertise? Do they have other credible published work?" },
      { heading: "Step 3: Check the Date", content: "When was this published? Is the information still current and relevant? Has the situation changed since then?" },
      { heading: "Step 4: Check the Evidence", content: "Does the article cite sources? Can you verify the claims through other independent reporting?" },
      { heading: "Step 5: Check Your Bias", content: "Does this article confirm what you already believe? Are you evaluating it more favorably because you agree with it?" },
      { heading: "Step 6: Check Other Sources", content: "Do at least 2 other reputable, independent sources report the same facts? This is the strongest verification step." },
      { heading: "Final Decision", content: "If it passes all checks: share thoughtfully. If it fails any check: do more research before sharing." }
    ]
  }
];
