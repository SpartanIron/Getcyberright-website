import { db } from "./db";
import { learningPaths, trainingModules, trainingLessons, trainingQuizzes, quizQuestions } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedCurriculum(): Promise<void> {
  console.log("[curriculum] Checking for existing curriculum...");
  
  const existingPaths = await db.select().from(learningPaths);
  if (existingPaths.length > 0) {
    console.log("[curriculum] Curriculum already exists, skipping seed");
    return;
  }

  console.log("[curriculum] Seeding initial curriculum...");

  // Create Foundation learning paths for each audience
  const audiences = [
    {
      audience: "kids",
      title: "Digital Safety Basics for Kids",
      description: "Fun, interactive lessons teaching essential online safety skills for young digital citizens ages 8-16.",
      color: "#9333EA",
      iconName: "sparkles",
      learningOutcomes: [
        "Recognize and avoid online strangers who may be dangerous",
        "Create strong passwords and keep them secret",
        "Know when to tell a trusted adult about something online",
        "Understand what personal information should stay private",
        "Identify fake websites and suspicious messages"
      ]
    },
    {
      audience: "parents",
      title: "Family Digital Safety Fundamentals",
      description: "Essential cybersecurity knowledge to protect your family and guide your children through the digital world safely.",
      color: "#3B82F6",
      iconName: "users",
      learningOutcomes: [
        "Set up parental controls and monitoring on family devices",
        "Have effective conversations about online safety with your kids",
        "Recognize signs that your child may be at risk online",
        "Create a family technology agreement",
        "Respond appropriately to cyberbullying and online threats"
      ]
    },
    {
      audience: "seniors",
      title: "Scam Prevention Essentials",
      description: "Practical protection against phone scams, phishing emails, and online fraud designed specifically for seniors.",
      color: "#F43F5E",
      iconName: "heart",
      learningOutcomes: [
        "Identify common phone and email scams targeting seniors",
        "Verify the legitimacy of callers and emails before responding",
        "Protect your financial information from fraudsters",
        "Use strong passwords and avoid common security mistakes",
        "Know who to contact if you suspect you have been scammed"
      ]
    },
    {
      audience: "educators",
      title: "Cybersecurity Curriculum for Educators",
      description: "Classroom-ready resources and lesson plans to teach digital citizenship and online safety to students.",
      color: "#10B981",
      iconName: "graduationcap",
      learningOutcomes: [
        "Deliver engaging cybersecurity lessons to students of all ages",
        "Create a safe digital learning environment in your classroom",
        "Address cyberbullying and online harassment effectively",
        "Teach students to evaluate online information critically",
        "Integrate digital citizenship into existing curriculum"
      ]
    },
    {
      audience: "small-business",
      title: "Small Business Security Fundamentals",
      description: "Essential cybersecurity training for small business owners and employees to protect company data and customer information.",
      color: "#F59E0B",
      iconName: "briefcase",
      learningOutcomes: [
        "Implement basic security measures to protect business data",
        "Train employees to recognize and report security threats",
        "Create and enforce password and access policies",
        "Respond appropriately to security incidents",
        "Understand compliance requirements for your industry"
      ]
    }
  ];

  for (const audienceData of audiences) {
    const [path] = await db.insert(learningPaths).values({
      audience: audienceData.audience,
      title: audienceData.title,
      description: audienceData.description,
      level: "foundation",
      estimatedHours: 3,
      learningOutcomes: audienceData.learningOutcomes,
      certificateName: "Digital Safety Aware",
      iconName: audienceData.iconName,
      color: audienceData.color,
      sortOrder: 0,
      isPublished: true
    }).returning();

    // Create modules for this path
    const modules = [
      {
        domain: "threat-recognition",
        title: "Recognizing Online Threats",
        description: "Learn to identify phishing emails, suspicious links, and common scam tactics.",
        learningObjectives: [
          "Identify the warning signs of phishing emails",
          "Recognize suspicious links before clicking",
          "Understand common social engineering tactics"
        ],
        estimatedMinutes: 30,
        sortOrder: 0
      },
      {
        domain: "password-security",
        title: "Password and Account Security",
        description: "Create strong passwords and protect your online accounts from unauthorized access.",
        learningObjectives: [
          "Create strong, unique passwords for each account",
          "Understand how to use a password manager",
          "Enable and use two-factor authentication"
        ],
        estimatedMinutes: 25,
        sortOrder: 1
      },
      {
        domain: "privacy-protection",
        title: "Protecting Your Privacy Online",
        description: "Control your personal information and understand how your data is collected and used.",
        learningObjectives: [
          "Identify what personal information should be kept private",
          "Adjust privacy settings on social media and devices",
          "Recognize data collection practices"
        ],
        estimatedMinutes: 25,
        sortOrder: 2
      },
      {
        domain: "incident-response",
        title: "What to Do If Something Goes Wrong",
        description: "Know the right steps to take if you encounter a security incident or believe you have been scammed.",
        learningObjectives: [
          "Know who to contact if you suspect a security incident",
          "Take immediate steps to limit damage from a breach",
          "Report scams and fraud to the appropriate authorities"
        ],
        estimatedMinutes: 20,
        sortOrder: 3
      }
    ];

    for (const moduleData of modules) {
      const [module] = await db.insert(trainingModules).values({
        pathId: path.id,
        domain: moduleData.domain,
        title: moduleData.title,
        description: moduleData.description,
        learningObjectives: moduleData.learningObjectives,
        estimatedMinutes: moduleData.estimatedMinutes,
        sortOrder: moduleData.sortOrder,
        isPublished: true
      }).returning();

      // Create lessons for this module
      const lessons = getLessonsForModule(moduleData.domain, audienceData.audience);
      
      for (let i = 0; i < lessons.length; i++) {
        await db.insert(trainingLessons).values({
          moduleId: module.id,
          title: lessons[i].title,
          description: lessons[i].description,
          contentType: "text",
          contentHtml: lessons[i].content,
          keyTakeaways: lessons[i].takeaways,
          estimatedMinutes: 8,
          sortOrder: i,
          isPublished: true
        });
      }

      // Create quiz for this module
      const [quiz] = await db.insert(trainingQuizzes).values({
        moduleId: module.id,
        title: `${moduleData.title} Assessment`,
        description: "Test your knowledge from this module",
        passingScore: 70,
        maxAttempts: 3,
        shuffleQuestions: true,
        showCorrectAnswers: true,
        isPublished: true
      }).returning();

      // Create quiz questions
      const questions = getQuestionsForModule(moduleData.domain);
      for (let i = 0; i < questions.length; i++) {
        await db.insert(quizQuestions).values({
          quizId: quiz.id,
          questionType: questions[i].type,
          questionText: questions[i].question,
          options: questions[i].options,
          correctAnswer: questions[i].answer,
          explanation: questions[i].explanation,
          difficulty: questions[i].difficulty || "medium",
          points: 10,
          sortOrder: i
        });
      }
    }
  }

  console.log("[curriculum] Initial curriculum seeded successfully");
}

function getLessonsForModule(domain: string, audience: string): Array<{ title: string; description: string; content: string; takeaways: string[] }> {
  const lessonTemplates: Record<string, Array<{ title: string; description: string; content: string; takeaways: string[] }>> = {
    "threat-recognition": [
      {
        title: "What is Phishing?",
        description: "Understanding the most common online threat and how to spot it.",
        content: `<h2>Understanding Phishing</h2>
<p>Phishing is when criminals pretend to be someone you trust, like a bank, a company, or even a friend, to trick you into giving them your personal information.</p>
<h3>How Phishing Works</h3>
<p>Attackers send emails, text messages, or create fake websites that look real. Their goal is to get you to click a link, download a file, or enter your login information.</p>
<h3>Common Signs of Phishing</h3>
<ul>
<li><strong>Urgency:</strong> Messages that say you must act NOW or something bad will happen</li>
<li><strong>Spelling errors:</strong> Legitimate companies proofread their messages</li>
<li><strong>Strange sender addresses:</strong> Check if the email address matches the company</li>
<li><strong>Requests for sensitive information:</strong> Banks never ask for passwords via email</li>
</ul>`,
        takeaways: [
          "Phishing uses trust and urgency to trick you",
          "Always verify the sender before clicking links",
          "Legitimate companies never ask for passwords via email"
        ]
      },
      {
        title: "Spotting Suspicious Links",
        description: "Learn how to examine links before clicking them.",
        content: `<h2>Before You Click</h2>
<p>Hovering over a link shows you where it actually goes. This simple step can protect you from most phishing attacks.</p>
<h3>What to Look For</h3>
<ul>
<li><strong>Misspelled domains:</strong> "amaz0n.com" instead of "amazon.com"</li>
<li><strong>Extra words:</strong> "amazon-secure-login.com" is not Amazon</li>
<li><strong>Secure vs insecure connections:</strong> Look for HTTPS in the address bar, but this alone does not guarantee safety</li>
</ul>
<h3>When in Doubt</h3>
<p>If you receive a message asking you to log in, go directly to the website by typing the address yourself instead of clicking the link.</p>`,
        takeaways: [
          "Hover over links to see the real destination",
          "Watch for misspelled or modified domain names",
          "When uncertain, navigate directly to the website"
        ]
      }
    ],
    "password-security": [
      {
        title: "Creating Strong Passwords",
        description: "Learn the principles of password strength and how to create memorable, secure passwords.",
        content: `<h2>What Makes a Password Strong?</h2>
<p>A strong password is your first defense against hackers. The best passwords are long, unique, and unpredictable.</p>
<h3>Password Strength Factors</h3>
<ul>
<li><strong>Length:</strong> Aim for at least 12 characters. Longer is stronger.</li>
<li><strong>Complexity:</strong> Mix uppercase, lowercase, numbers, and symbols</li>
<li><strong>Uniqueness:</strong> Never reuse passwords across accounts</li>
<li><strong>Unpredictability:</strong> Avoid personal information or common words</li>
</ul>
<h3>Creating Memorable Passwords</h3>
<p>Use a passphrase: combine random words into a sentence. For example: "PurpleElephantDances42!" is both strong and memorable.</p>`,
        takeaways: [
          "Longer passwords are generally stronger",
          "Never reuse passwords across different accounts",
          "Passphrases are easier to remember than random characters"
        ]
      },
      {
        title: "Using Password Managers",
        description: "Discover how password managers can make your life easier and more secure.",
        content: `<h2>Why Use a Password Manager?</h2>
<p>Password managers store all your passwords securely so you only need to remember one master password.</p>
<h3>Benefits of Password Managers</h3>
<ul>
<li><strong>Strong passwords:</strong> Generate random, unique passwords for every account</li>
<li><strong>Convenience:</strong> Auto-fill passwords so you never have to type them</li>
<li><strong>Security:</strong> Encrypted storage protects your passwords</li>
<li><strong>Alerts:</strong> Many warn you about breached or weak passwords</li>
</ul>`,
        takeaways: [
          "Password managers generate and store strong passwords",
          "You only need to remember one master password",
          "Most password managers work across all your devices"
        ]
      }
    ],
    "privacy-protection": [
      {
        title: "Understanding Personal Information",
        description: "Learn what counts as personal information and why it matters.",
        content: `<h2>What is Personal Information?</h2>
<p>Personal information is any data that can identify you or be used against you. Protecting it prevents identity theft and fraud.</p>
<h3>Types of Personal Information</h3>
<ul>
<li><strong>Obvious:</strong> Full name, address, phone number, email</li>
<li><strong>Financial:</strong> Bank accounts, credit card numbers, income</li>
<li><strong>Sensitive:</strong> Social Security number, driver's license, passport</li>
<li><strong>Digital:</strong> Passwords, security questions, browsing history</li>
</ul>
<h3>Less Obvious Information</h3>
<p>Your location, daily routine, vacation plans, and even your pet's name (often used in security questions) can be valuable to criminals.</p>`,
        takeaways: [
          "Personal information includes more than just your name",
          "Even seemingly innocent details can be used against you",
          "Think before sharing information online"
        ]
      },
      {
        title: "Privacy Settings on Social Media",
        description: "Take control of what you share and who can see it.",
        content: `<h2>Managing Your Digital Footprint</h2>
<p>Social media platforms collect vast amounts of data. Understanding and adjusting your privacy settings puts you in control.</p>
<h3>Key Settings to Review</h3>
<ul>
<li><strong>Profile visibility:</strong> Who can see your posts and profile?</li>
<li><strong>Location sharing:</strong> Disable automatic location tagging</li>
<li><strong>Third-party access:</strong> Review which apps have access to your account</li>
<li><strong>Ad preferences:</strong> Limit how your data is used for advertising</li>
</ul>`,
        takeaways: [
          "Regularly review your privacy settings on all platforms",
          "Disable location sharing when not needed",
          "Remove access for apps you no longer use"
        ]
      }
    ],
    "incident-response": [
      {
        title: "Recognizing a Security Incident",
        description: "Know the signs that something may have gone wrong.",
        content: `<h2>Signs You May Have Been Compromised</h2>
<p>Early detection of a security incident can limit the damage. Know what warning signs to look for.</p>
<h3>Warning Signs</h3>
<ul>
<li><strong>Unexpected password resets:</strong> Emails about changes you did not make</li>
<li><strong>Strange account activity:</strong> Logins from unknown locations</li>
<li><strong>Missing money:</strong> Unauthorized transactions on your accounts</li>
<li><strong>Locked out:</strong> Unable to access accounts with correct passwords</li>
<li><strong>Friends report strange messages:</strong> Someone may be impersonating you</li>
</ul>`,
        takeaways: [
          "Monitor your accounts for unexpected changes",
          "Trust your instincts if something seems wrong",
          "Early detection limits potential damage"
        ]
      },
      {
        title: "What to Do If You Are Scammed",
        description: "Immediate steps to take if you believe you have been a victim.",
        content: `<h2>Immediate Response Steps</h2>
<p>If you believe you have been scammed, act quickly. Speed is critical to limiting damage.</p>
<h3>Step 1: Stop Further Damage</h3>
<ul>
<li>Change passwords for affected and related accounts immediately</li>
<li>Contact your bank if financial information was shared</li>
<li>Enable two-factor authentication on all accounts</li>
</ul>
<h3>Step 2: Document Everything</h3>
<ul>
<li>Save emails, messages, and transaction records</li>
<li>Note dates, times, and what information was shared</li>
</ul>
<h3>Step 3: Report the Incident</h3>
<ul>
<li>Report to the FTC at reportfraud.ftc.gov</li>
<li>File a report with local police for identity theft</li>
<li>Contact the platform where the scam occurred</li>
</ul>`,
        takeaways: [
          "Act immediately to limit damage",
          "Document everything for reporting",
          "Report to appropriate authorities"
        ]
      }
    ]
  };

  return lessonTemplates[domain] || [];
}

function getQuestionsForModule(domain: string): Array<{ type: string; question: string; options?: string[]; answer: string; explanation?: string; difficulty?: string }> {
  const questionTemplates: Record<string, Array<{ type: string; question: string; options?: string[]; answer: string; explanation?: string; difficulty?: string }>> = {
    "threat-recognition": [
      {
        type: "multiple-choice",
        question: "Which of the following is a common sign of a phishing email?",
        options: ["Professional formatting and correct spelling", "A sense of urgency demanding immediate action", "Coming from a known contact", "Links that match the displayed text"],
        answer: "A sense of urgency demanding immediate action",
        explanation: "Phishing emails often create a false sense of urgency to pressure you into acting without thinking.",
        difficulty: "easy"
      },
      {
        type: "true-false",
        question: "If an email comes from someone you know, it is always safe to click the links inside.",
        answer: "False",
        explanation: "Email addresses can be spoofed, and accounts can be compromised. Always verify unexpected requests, even from known contacts.",
        difficulty: "easy"
      },
      {
        type: "multiple-choice",
        question: "What should you do if you receive an email from your bank asking you to verify your password?",
        options: ["Click the link and enter your password", "Reply to the email with your password", "Call your bank using the number on your card or statement", "Forward the email to friends"],
        answer: "Call your bank using the number on your card or statement",
        explanation: "Never click links or provide passwords via email. Contact your bank directly using a known, trusted number.",
        difficulty: "medium"
      }
    ],
    "password-security": [
      {
        type: "multiple-choice",
        question: "Which of these passwords is the strongest?",
        options: ["password123", "MyDog'sName", "Tr0ub4dor&3", "correct-horse-battery-staple-42!"],
        answer: "correct-horse-battery-staple-42!",
        explanation: "Longer passphrases with multiple words and some special characters are typically stronger than shorter, complex passwords.",
        difficulty: "medium"
      },
      {
        type: "true-false",
        question: "It is safe to use the same strong password for all your accounts.",
        answer: "False",
        explanation: "If one account is breached, all accounts with the same password become vulnerable. Always use unique passwords.",
        difficulty: "easy"
      },
      {
        type: "multiple-choice",
        question: "What is the primary benefit of using a password manager?",
        options: ["It makes all websites faster", "You can use strong, unique passwords without remembering them all", "It protects against all viruses", "It speeds up your computer"],
        answer: "You can use strong, unique passwords without remembering them all",
        explanation: "Password managers securely store your passwords so you only need to remember one master password.",
        difficulty: "easy"
      }
    ],
    "privacy-protection": [
      {
        type: "multiple-choice",
        question: "Which of the following should you avoid sharing publicly on social media?",
        options: ["Your favorite movie", "Your home address", "A photo of your lunch", "Your opinion on a news story"],
        answer: "Your home address",
        explanation: "Personal details like your home address can be used by criminals for identity theft, burglary, or stalking.",
        difficulty: "easy"
      },
      {
        type: "true-false",
        question: "Once you post something online, it can be permanently deleted by you at any time.",
        answer: "False",
        explanation: "Once content is online, it may be copied, screenshotted, or archived by others. Assume anything you post could be permanent.",
        difficulty: "medium"
      },
      {
        type: "multiple-choice",
        question: "What should you do before using a new app or service?",
        options: ["Share it with all your friends first", "Review its privacy policy and permissions", "Connect it to all your other accounts", "Give it access to all your contacts"],
        answer: "Review its privacy policy and permissions",
        explanation: "Understanding what data an app collects and how it uses it helps you make informed decisions about your privacy.",
        difficulty: "medium"
      }
    ],
    "incident-response": [
      {
        type: "multiple-choice",
        question: "What is the FIRST thing you should do if you think your email account has been hacked?",
        options: ["Delete all your emails", "Create a new email account", "Change your password immediately", "Wait to see if it happens again"],
        answer: "Change your password immediately",
        explanation: "Changing your password quickly can lock out the attacker and prevent further damage.",
        difficulty: "easy"
      },
      {
        type: "true-false",
        question: "You should wait a few days before reporting a suspected scam to see if it was real.",
        answer: "False",
        explanation: "Report scams immediately. Quick action can help authorities track criminals and may help recover lost funds.",
        difficulty: "easy"
      },
      {
        type: "multiple-choice",
        question: "If you accidentally gave your credit card number to a scammer, what should you do first?",
        options: ["Wait to see if charges appear", "Post about it on social media", "Contact your bank or credit card company immediately", "Try to contact the scammer"],
        answer: "Contact your bank or credit card company immediately",
        explanation: "Your bank can freeze your card, prevent further charges, and guide you through the dispute process.",
        difficulty: "easy"
      }
    ]
  };

  return questionTemplates[domain] || [];
}
