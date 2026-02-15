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
  // Audience-specific content variations
  if (audience === "kids") {
    return getKidsLessons(domain);
  } else if (audience === "seniors") {
    return getSeniorsLessons(domain);
  } else if (audience === "parents") {
    return getParentsLessons(domain);
  } else if (audience === "educators") {
    return getEducatorsLessons(domain);
  } else {
    return getBusinessLessons(domain);
  }
}

function getKidsLessons(domain: string): Array<{ title: string; description: string; content: string; takeaways: string[] }> {
  const lessons: Record<string, Array<{ title: string; description: string; content: string; takeaways: string[] }>> = {
    "threat-recognition": [
      {
        title: "Tricky Messages: How Bad Guys Try to Fool You",
        description: "Learn how to spot fake messages that try to trick you.",
        content: `<h2>What Are Tricky Messages?</h2>
<p>Sometimes bad people send messages pretending to be someone you know or trust. They want to trick you into giving them your information or clicking on something bad.</p>
<h3>How to Spot Tricky Messages</h3>
<p>Here are some warning signs that a message might be fake:</p>
<ul>
<li><strong>It says you have to do something RIGHT NOW</strong> or something scary will happen</li>
<li><strong>There are spelling mistakes</strong> or the message looks weird</li>
<li><strong>It asks for your password</strong> or personal information</li>
<li><strong>It comes from someone you do not know</strong></li>
</ul>
<h3>What Should You Do?</h3>
<p>If you get a strange message, do not click on anything. Show it to a parent or trusted adult right away!</p>`,
        takeaways: [
          "Bad people sometimes send fake messages to trick you",
          "Never share your password with anyone online",
          "When you see something strange, tell a trusted adult"
        ]
      },
      {
        title: "Is This Link Safe? A Simple Way to Check",
        description: "Learn how to check if a link is safe before you click it.",
        content: `<h2>Think Before You Click!</h2>
<p>Not every link you see is safe. Some links can take you to bad websites or download bad things onto your computer.</p>
<h3>The Hover Trick</h3>
<p>Before clicking a link, move your mouse over it (but do not click!). Look at the bottom of your screen to see where the link really goes.</p>
<h3>Warning Signs</h3>
<ul>
<li><strong>The link looks weird</strong> with extra letters or numbers</li>
<li><strong>It does not match</strong> what the message says</li>
<li><strong>It has a strange website name</strong> you do not recognize</li>
</ul>
<h3>Stay Safe</h3>
<p>If you are not sure about a link, ask a parent or teacher before clicking!</p>`,
        takeaways: [
          "Always check where a link goes before clicking",
          "If a link looks weird, do not click it",
          "Ask a trusted adult if you are not sure"
        ]
      }
    ],
    "password-security": [
      {
        title: "Secret Codes: Creating Passwords No One Can Guess",
        description: "Learn how to make super strong passwords that keep bad guys out.",
        content: `<h2>Why Passwords Are Important</h2>
<p>Your password is like a secret key that protects your accounts. If someone guesses your password, they can pretend to be you!</p>
<h3>How to Make a Great Password</h3>
<ul>
<li><strong>Make it long:</strong> Use at least 12 letters, numbers, and symbols</li>
<li><strong>Make it silly:</strong> Use random words that are easy to remember but hard to guess</li>
<li><strong>Keep it secret:</strong> Never tell anyone your password, not even friends</li>
</ul>
<h3>A Fun Trick</h3>
<p>Think of a silly sentence like "MyPurpleDog Eats 7Pizzas!" It is long, has numbers, and is easy to remember!</p>`,
        takeaways: [
          "Good passwords are long and have letters, numbers, and symbols",
          "Never share your password with anyone except parents",
          "Use different passwords for different accounts"
        ]
      },
      {
        title: "Keeping Your Passwords Safe",
        description: "Learn the best ways to protect your secret passwords.",
        content: `<h2>Where to Keep Your Passwords</h2>
<p>You have lots of passwords to remember! Here are safe ways to keep track of them.</p>
<h3>Safe Ways</h3>
<ul>
<li><strong>Ask a parent to help:</strong> They can write them down in a safe place</li>
<li><strong>Use a password app:</strong> Special apps keep your passwords locked up safely</li>
</ul>
<h3>Unsafe Ways</h3>
<ul>
<li><strong>Never write passwords on sticky notes</strong> where others can see</li>
<li><strong>Never share passwords</strong> in messages or emails</li>
</ul>`,
        takeaways: [
          "Ask a parent to help you remember passwords",
          "Never write passwords where others can find them",
          "Password apps can help keep your passwords safe"
        ]
      }
    ],
    "privacy-protection": [
      {
        title: "What Should You Keep Private?",
        description: "Learn what information to never share with strangers online.",
        content: `<h2>Your Private Information</h2>
<p>Some information about you should stay private. Sharing it with the wrong person could be dangerous.</p>
<h3>Never Share These Things Online:</h3>
<ul>
<li><strong>Your full name</strong></li>
<li><strong>Where you live</strong> or go to school</li>
<li><strong>Your phone number</strong></li>
<li><strong>Pictures of your home</strong> or school</li>
<li><strong>When your parents are not home</strong></li>
</ul>
<h3>Why Does It Matter?</h3>
<p>Bad people can use this information to find you or trick your family. Keep it secret!</p>`,
        takeaways: [
          "Keep your name, address, and school private online",
          "Never share where you are or when you are alone",
          "Ask a parent before sharing any information"
        ]
      },
      {
        title: "Being Smart on Social Media",
        description: "Learn how to use apps and games safely.",
        content: `<h2>Staying Safe on Apps and Games</h2>
<p>Apps and games are fun, but you need to be careful about what you share.</p>
<h3>Smart Rules for Social Media</h3>
<ul>
<li><strong>Use a nickname</strong> instead of your real name</li>
<li><strong>Keep your profile private</strong> so only friends can see it</li>
<li><strong>Only add people you know</strong> in real life</li>
<li><strong>Turn off location</strong> so apps do not share where you are</li>
</ul>`,
        takeaways: [
          "Use a nickname and keep your profile private",
          "Only be friends with people you know in real life",
          "Tell a parent if someone online makes you uncomfortable"
        ]
      }
    ],
    "incident-response": [
      {
        title: "When Something Feels Wrong",
        description: "Learn what to do if something online makes you uncomfortable.",
        content: `<h2>Trust Your Feelings</h2>
<p>If something online makes you feel scared, confused, or uncomfortable, that feeling is important!</p>
<h3>Warning Signs</h3>
<ul>
<li><strong>Someone asks for personal information</strong></li>
<li><strong>Someone asks you to keep secrets</strong> from your parents</li>
<li><strong>Someone sends you something that makes you feel bad</strong></li>
<li><strong>Someone wants to meet you</strong> in real life</li>
</ul>
<h3>What To Do</h3>
<p>Do not respond. Close the app or website. Tell a parent, teacher, or trusted adult right away. You will not get in trouble!</p>`,
        takeaways: [
          "If something feels wrong, it probably is",
          "Never keep secrets about online conversations from parents",
          "Always tell a trusted adult when something bothers you"
        ]
      },
      {
        title: "Getting Help When You Need It",
        description: "Learn who to tell if something bad happens online.",
        content: `<h2>Who Can Help You?</h2>
<p>You are never alone when something bad happens online. There are people who can help!</p>
<h3>People Who Can Help</h3>
<ul>
<li><strong>Your parents or guardians</strong></li>
<li><strong>A teacher or school counselor</strong></li>
<li><strong>Another trusted adult</strong> like a coach or relative</li>
</ul>
<h3>Remember</h3>
<p>You will not get in trouble for asking for help. Adults want to keep you safe. It is brave to speak up!</p>`,
        takeaways: [
          "You can always ask a trusted adult for help",
          "You will not get in trouble for reporting something",
          "Speaking up is brave and keeps you safe"
        ]
      }
    ]
  };
  return lessons[domain] || [];
}

function getSeniorsLessons(domain: string): Array<{ title: string; description: string; content: string; takeaways: string[] }> {
  const lessons: Record<string, Array<{ title: string; description: string; content: string; takeaways: string[] }>> = {
    "threat-recognition": [
      {
        title: "How Scammers Try to Trick You",
        description: "Learn to recognize common scam tactics used against seniors.",
        content: `<h2>Common Scams Targeting Seniors</h2>
<p>Scammers often target seniors because they tend to be more trusting. Knowing their tricks helps you stay safe.</p>
<h3>Watch Out For These Scams</h3>
<ul>
<li><strong>Government impersonators:</strong> Someone claiming to be from the IRS, Medicare, or Social Security demanding immediate payment</li>
<li><strong>Grandparent scams:</strong> A caller pretends to be your grandchild in trouble, asking for money</li>
<li><strong>Tech support scams:</strong> A pop-up says your computer has a virus and you must call a number</li>
<li><strong>Prize scams:</strong> You won a prize, but must pay fees or taxes to claim it</li>
</ul>
<h3>The Golden Rule</h3>
<p>If someone is rushing you to act now or asking for unusual payment methods like gift cards, it is almost always a scam.</p>`,
        takeaways: [
          "Government agencies never demand immediate payment by phone",
          "If a call feels rushed or scary, hang up",
          "Legitimate prizes never require you to pay fees upfront"
        ]
      },
      {
        title: "Spotting Fake Emails and Messages",
        description: "Learn how to tell real messages from scam messages.",
        content: `<h2>Is This Email Real?</h2>
<p>Scammers send emails that look like they come from banks, stores, or government agencies. Here is how to spot fakes.</p>
<h3>Warning Signs of Fake Emails</h3>
<ul>
<li><strong>It demands immediate action</strong> or threatens bad consequences</li>
<li><strong>It has spelling mistakes</strong> or looks unprofessional</li>
<li><strong>It asks you to click a link</strong> to verify your account</li>
<li><strong>The sender address looks strange</strong> when you look closely</li>
</ul>
<h3>What To Do</h3>
<p>Do not click any links. If you think it might be real, call the company directly using the phone number on your statement or card, not the number in the email.</p>`,
        takeaways: [
          "Real companies do not demand urgent action by email",
          "Never click links in suspicious emails",
          "Call the company directly if you are unsure"
        ]
      }
    ],
    "password-security": [
      {
        title: "Creating Easy to Remember, Hard to Guess Passwords",
        description: "Simple tips for making strong passwords you can actually remember.",
        content: `<h2>Strong Passwords Made Simple</h2>
<p>A good password keeps your accounts safe from thieves. Here is how to make one you can remember.</p>
<h3>Easy Steps to a Strong Password</h3>
<ul>
<li><strong>Use a sentence you will remember:</strong> Pick a phrase meaningful to you</li>
<li><strong>Make it long:</strong> Aim for at least 12 characters</li>
<li><strong>Add numbers and symbols:</strong> Replace some letters or add to the end</li>
</ul>
<h3>Example</h3>
<p>"I love my garden" becomes "ILoveMyGarden2024!" This is long, personal, and includes numbers and a symbol.</p>
<h3>Important Rules</h3>
<ul>
<li>Use different passwords for different accounts</li>
<li>Never share your passwords with anyone who calls or emails</li>
</ul>`,
        takeaways: [
          "Use a phrase that is meaningful to you",
          "Add numbers and symbols to make it stronger",
          "Never share your password with anyone who asks by phone or email"
        ]
      },
      {
        title: "Keeping Your Passwords Safe",
        description: "Learn safe ways to store and manage your passwords.",
        content: `<h2>Where to Keep Your Passwords</h2>
<p>With so many accounts, it is hard to remember every password. Here are safe ways to keep track.</p>
<h3>Safe Options</h3>
<ul>
<li><strong>Write them in a notebook</strong> kept in a safe place at home</li>
<li><strong>Use a password manager app</strong> that remembers them for you</li>
<li><strong>Ask a trusted family member</strong> to help you set up secure storage</li>
</ul>
<h3>Never Do This</h3>
<ul>
<li>Never give your password to someone who calls unexpectedly</li>
<li>Never write passwords on sticky notes near your computer</li>
<li>Never use the same password for your email and your bank</li>
</ul>`,
        takeaways: [
          "Keep a written list of passwords in a safe, private place",
          "Consider using a password manager with help from family",
          "Never give passwords to unexpected callers"
        ]
      }
    ],
    "privacy-protection": [
      {
        title: "What Information Should Stay Private",
        description: "Learn what personal details you should never share.",
        content: `<h2>Protect Your Personal Information</h2>
<p>Criminals use personal information to steal your identity or your money. Knowing what to protect is the first step.</p>
<h3>Never Share These Things:</h3>
<ul>
<li><strong>Social Security number</strong></li>
<li><strong>Bank account and credit card numbers</strong></li>
<li><strong>Medicare number</strong></li>
<li><strong>Your passwords</strong></li>
<li><strong>Personal details like birthdate and address</strong> to strangers</li>
</ul>
<h3>Remember</h3>
<p>No legitimate company will call and ask for this information. If someone does, hang up and call the company directly.</p>`,
        takeaways: [
          "Never share financial or government ID numbers over the phone",
          "Legitimate companies do not call asking for personal details",
          "When in doubt, hang up and call the company yourself"
        ]
      },
      {
        title: "Staying Safe on Social Media",
        description: "Simple rules for sharing safely on Facebook and other sites.",
        content: `<h2>Smart Social Media Habits</h2>
<p>Social media is a great way to stay connected with family and friends, but be careful what you share.</p>
<h3>Safe Sharing Rules</h3>
<ul>
<li><strong>Keep your profile private</strong> so only friends can see your posts</li>
<li><strong>Do not share vacation plans</strong> publicly, as it tells people when you are away</li>
<li><strong>Be careful with friend requests</strong> from people you do not know</li>
<li><strong>Do not post your full birthday</strong> or address</li>
</ul>`,
        takeaways: [
          "Set your social media accounts to private",
          "Only accept friend requests from people you know",
          "Never post when you will be away from home"
        ]
      }
    ],
    "incident-response": [
      {
        title: "What to Do If You Think You Have Been Scammed",
        description: "Immediate steps to take if you suspect fraud.",
        content: `<h2>Act Quickly If You Have Been Scammed</h2>
<p>If you think you have given money or information to a scammer, do not feel embarrassed. Take action right away.</p>
<h3>Immediate Steps</h3>
<ul>
<li><strong>Stop all contact</strong> with the scammer immediately</li>
<li><strong>Call your bank</strong> if you shared financial information or sent money</li>
<li><strong>Change your passwords</strong> for any accounts that may be affected</li>
<li><strong>Tell a family member</strong> or trusted friend what happened</li>
</ul>
<h3>Report It</h3>
<ul>
<li>Report to the FTC at reportfraud.ftc.gov or call 1-877-382-4357</li>
<li>Report to your local police</li>
</ul>`,
        takeaways: [
          "Act quickly to limit the damage",
          "Contact your bank immediately if money is involved",
          "Report the scam to authorities and tell someone you trust"
        ]
      },
      {
        title: "Who to Call for Help",
        description: "Know who to contact when you need assistance.",
        content: `<h2>Getting Help When You Need It</h2>
<p>You do not have to figure this out alone. There are people and organizations ready to help.</p>
<h3>Who Can Help</h3>
<ul>
<li><strong>Your bank or credit card company:</strong> For financial fraud</li>
<li><strong>FTC (Federal Trade Commission):</strong> reportfraud.ftc.gov or 1-877-382-4357</li>
<li><strong>Local police:</strong> File a report for identity theft or fraud</li>
<li><strong>Family members:</strong> Tell someone you trust what happened</li>
</ul>
<h3>Remember</h3>
<p>Scammers are professionals at tricking people. There is no shame in asking for help.</p>`,
        takeaways: [
          "Contact your bank immediately for financial issues",
          "Report scams to the FTC and local police",
          "There is no shame in being scammed. It can happen to anyone."
        ]
      }
    ]
  };
  return lessons[domain] || [];
}

function getParentsLessons(domain: string): Array<{ title: string; description: string; content: string; takeaways: string[] }> {
  const lessons: Record<string, Array<{ title: string; description: string; content: string; takeaways: string[] }>> = {
    "threat-recognition": [
      {
        title: "Common Online Threats to Your Family",
        description: "Understand the risks your children face online.",
        content: `<h2>What Threats Should You Know About?</h2>
<p>The internet offers amazing opportunities for learning and connection, but it also has risks. Here are the main threats families face.</p>
<h3>Threats to Be Aware Of</h3>
<ul>
<li><strong>Inappropriate content:</strong> Kids can accidentally find harmful material</li>
<li><strong>Online predators:</strong> Adults who try to form relationships with children</li>
<li><strong>Cyberbullying:</strong> Mean or threatening messages from peers</li>
<li><strong>Scams and fraud:</strong> Tricks designed to steal money or information</li>
<li><strong>Privacy violations:</strong> Sharing too much personal information</li>
</ul>
<h3>Your Role</h3>
<p>By understanding these threats, you can have informed conversations with your children and set up appropriate safeguards.</p>`,
        takeaways: [
          "Children face multiple types of online risks",
          "Awareness is the first step to protection",
          "Open communication with your children is essential"
        ]
      },
      {
        title: "Recognizing Warning Signs",
        description: "Learn to spot if your child is encountering problems online.",
        content: `<h2>Signs Your Child May Be in Trouble</h2>
<p>Children often do not tell parents when something bad happens online. Watch for these warning signs.</p>
<h3>Behavioral Changes to Watch For</h3>
<ul>
<li><strong>Hiding their screen</strong> when you walk by</li>
<li><strong>Becoming withdrawn</strong> or upset after using devices</li>
<li><strong>New contacts or gifts</strong> from unknown sources</li>
<li><strong>Spending excessive time online,</strong> especially at night</li>
<li><strong>Reluctance to discuss</strong> online activities</li>
</ul>
<h3>What To Do</h3>
<p>Approach your child calmly and without judgment. Make it clear they can tell you anything without getting in trouble.</p>`,
        takeaways: [
          "Watch for changes in behavior around device use",
          "Keep communication lines open and judgment free",
          "Children need to know they can come to you with problems"
        ]
      }
    ],
    "password-security": [
      {
        title: "Teaching Your Kids About Passwords",
        description: "How to help your children create and manage secure passwords.",
        content: `<h2>Password Basics for Kids</h2>
<p>Teaching good password habits early helps protect your children throughout their lives.</p>
<h3>Key Lessons for Children</h3>
<ul>
<li><strong>Passwords are like house keys:</strong> Never share them with anyone but family</li>
<li><strong>Make them long and silly:</strong> Phrases like "MyDogEats5Tacos!" are strong and memorable</li>
<li><strong>Use different passwords:</strong> Never use the same one for everything</li>
</ul>
<h3>How Parents Can Help</h3>
<ul>
<li>Help younger children create their passwords</li>
<li>Keep a master list in a safe place at home</li>
<li>Review account security settings together</li>
</ul>`,
        takeaways: [
          "Teach children to never share passwords outside the family",
          "Help them create strong, memorable passwords",
          "Keep a family password record in a safe place"
        ]
      },
      {
        title: "Managing Family Passwords",
        description: "Tips for keeping your family's accounts secure.",
        content: `<h2>Family Password Management</h2>
<p>Managing passwords for an entire family can be challenging. Here are practical approaches.</p>
<h3>Options for Families</h3>
<ul>
<li><strong>Family password manager:</strong> Apps like Bitwarden or 1Password have family plans</li>
<li><strong>Written backup:</strong> Keep a secure notebook at home with important passwords</li>
<li><strong>Shared knowledge:</strong> Parents should know all children's passwords</li>
</ul>
<h3>Important Rules</h3>
<ul>
<li>Parents should always have access to children's accounts</li>
<li>Review and update passwords regularly</li>
<li>Turn on two-factor authentication when available</li>
</ul>`,
        takeaways: [
          "Consider a family password manager for convenience",
          "Parents should know all children's passwords",
          "Enable two-factor authentication on important accounts"
        ]
      }
    ],
    "privacy-protection": [
      {
        title: "Setting Up Parental Controls",
        description: "Learn how to use built-in tools to protect your children.",
        content: `<h2>Using Parental Controls</h2>
<p>Most devices and services have parental controls built in. These tools help you manage what your children can access.</p>
<h3>Where to Find Controls</h3>
<ul>
<li><strong>Device settings:</strong> iPhone, Android, Windows, and Mac all have family settings</li>
<li><strong>Router settings:</strong> Control internet access at the network level</li>
<li><strong>App and game settings:</strong> Most apps have their own safety features</li>
<li><strong>Streaming services:</strong> Netflix, YouTube, and others have kid profiles</li>
</ul>
<h3>What Controls Can Do</h3>
<ul>
<li>Filter inappropriate content</li>
<li>Set screen time limits</li>
<li>Block specific apps or websites</li>
<li>Monitor activity and location</li>
</ul>`,
        takeaways: [
          "Every device has built-in parental control options",
          "Set up controls on devices, routers, and apps",
          "Regular review is needed as children grow"
        ]
      },
      {
        title: "Teaching Children About Privacy",
        description: "Help your children understand what to share and what to keep private.",
        content: `<h2>Privacy Conversations With Kids</h2>
<p>Children need to understand why privacy matters before they can protect themselves.</p>
<h3>What Children Should Keep Private</h3>
<ul>
<li><strong>Full name and address</strong></li>
<li><strong>School name and location</strong></li>
<li><strong>Phone numbers</strong></li>
<li><strong>Photos that show location</strong> or personal details</li>
<li><strong>Family schedules</strong> and routines</li>
</ul>
<h3>How to Have the Conversation</h3>
<p>Use age-appropriate examples. For younger children, compare it to not giving your house key to strangers. For teens, discuss real cases of identity theft or online stalking.</p>`,
        takeaways: [
          "Explain privacy in terms children can understand",
          "Create clear rules about what should never be shared",
          "Revisit the conversation as children grow older"
        ]
      }
    ],
    "incident-response": [
      {
        title: "Responding to Online Incidents",
        description: "What to do when something goes wrong.",
        content: `<h2>When Something Bad Happens Online</h2>
<p>Despite our best efforts, children may encounter harmful situations online. Knowing how to respond is crucial.</p>
<h3>Immediate Steps</h3>
<ul>
<li><strong>Stay calm:</strong> Your reaction affects whether children come to you in the future</li>
<li><strong>Listen without judgment:</strong> Let your child explain what happened</li>
<li><strong>Document everything:</strong> Take screenshots before deleting or blocking</li>
<li><strong>Report the issue:</strong> Use platform reporting tools and contact authorities if needed</li>
</ul>
<h3>When to Involve Authorities</h3>
<ul>
<li>Any contact from an adult seeking a relationship with your child</li>
<li>Threats of violence or harm</li>
<li>Sharing of explicit content involving minors</li>
</ul>`,
        takeaways: [
          "Stay calm so your child will trust you with problems",
          "Document everything before taking action",
          "Contact authorities for serious situations"
        ]
      },
      {
        title: "Creating a Family Safety Plan",
        description: "Build a plan for handling online safety as a family.",
        content: `<h2>Your Family Safety Plan</h2>
<p>Having a plan in place before problems occur makes it easier to respond when they do.</p>
<h3>Elements of a Good Plan</h3>
<ul>
<li><strong>Open communication:</strong> Regular family discussions about online experiences</li>
<li><strong>Clear rules:</strong> Written agreements about device use and online behavior</li>
<li><strong>Trusted adults:</strong> Identify people children can talk to besides parents</li>
<li><strong>Emergency contacts:</strong> Know how to reach platforms, schools, and authorities</li>
</ul>
<h3>Review and Update</h3>
<p>Review your plan regularly, especially as children age and their online activities change.</p>`,
        takeaways: [
          "Create clear family rules about internet use",
          "Establish regular check-ins about online experiences",
          "Update your plan as children grow and technology changes"
        ]
      }
    ]
  };
  return lessons[domain] || [];
}

function getEducatorsLessons(domain: string): Array<{ title: string; description: string; content: string; takeaways: string[] }> {
  const lessons: Record<string, Array<{ title: string; description: string; content: string; takeaways: string[] }>> = {
    "threat-recognition": [
      {
        title: "Online Threats Facing Your Students",
        description: "Understanding the digital risks students encounter.",
        content: `<h2>The Digital Landscape for Students</h2>
<p>Students today are more connected than ever, which brings both opportunities and risks. As an educator, understanding these threats helps you protect and guide them.</p>
<h3>Common Threats Students Face</h3>
<ul>
<li><strong>Cyberbullying:</strong> Harassment through social media, gaming, and messaging</li>
<li><strong>Inappropriate contact:</strong> Adults attempting to build relationships with students</li>
<li><strong>Misinformation:</strong> Difficulty distinguishing reliable from false information</li>
<li><strong>Privacy violations:</strong> Oversharing personal information online</li>
<li><strong>Account compromise:</strong> Weak passwords leading to hacked accounts</li>
</ul>`,
        takeaways: [
          "Students face multiple types of online threats",
          "Many threats are social rather than technical",
          "Educators play a vital role in digital citizenship"
        ]
      },
      {
        title: "Teaching Students to Evaluate Online Information",
        description: "Help students identify reliable sources and spot misinformation.",
        content: `<h2>Critical Thinking Online</h2>
<p>One of the most valuable skills you can teach students is how to evaluate the credibility of online information.</p>
<h3>Teaching the SIFT Method</h3>
<ul>
<li><strong>Stop:</strong> Pause before sharing or believing</li>
<li><strong>Investigate the source:</strong> Who published this and why?</li>
<li><strong>Find better coverage:</strong> What do other sources say?</li>
<li><strong>Trace claims:</strong> Find the original source of information</li>
</ul>
<h3>Classroom Activities</h3>
<p>Practice with real examples. Show students articles and have them evaluate credibility using the SIFT method.</p>`,
        takeaways: [
          "Teach students to pause before believing or sharing",
          "The SIFT method provides a simple evaluation framework",
          "Practice with real examples reinforces learning"
        ]
      }
    ],
    "password-security": [
      {
        title: "Teaching Password Security to Students",
        description: "Age-appropriate approaches to password education.",
        content: `<h2>Password Education by Age Group</h2>
<p>Password concepts need to be taught differently depending on student age and development.</p>
<h3>Elementary Students (K-5)</h3>
<ul>
<li>Passwords are like toothbrushes: personal and not shared</li>
<li>Use simple passphrases they can remember</li>
<li>Adults can help manage passwords</li>
</ul>
<h3>Middle School (6-8)</h3>
<ul>
<li>Explain why password strength matters</li>
<li>Introduce the concept of unique passwords for different accounts</li>
<li>Discuss the risks of password sharing with friends</li>
</ul>
<h3>High School (9-12)</h3>
<ul>
<li>Teach password manager usage</li>
<li>Explain two-factor authentication</li>
<li>Discuss real-world consequences of compromised accounts</li>
</ul>`,
        takeaways: [
          "Adapt password education to student age",
          "Use relatable analogies for younger students",
          "Older students can learn more sophisticated practices"
        ]
      },
      {
        title: "Classroom Account Security Practices",
        description: "Best practices for managing student accounts and credentials.",
        content: `<h2>Managing Student Accounts in Your Classroom</h2>
<p>As an educator, you often manage many student accounts and credentials. Here are best practices.</p>
<h3>Account Management Tips</h3>
<ul>
<li><strong>Unique passwords:</strong> Avoid using the same password pattern for all students</li>
<li><strong>Secure storage:</strong> Keep credential lists in secure, encrypted locations</li>
<li><strong>Regular resets:</strong> Reset passwords periodically, especially at year start</li>
<li><strong>Privacy:</strong> Never display student passwords on shared screens</li>
</ul>`,
        takeaways: [
          "Store student credentials securely",
          "Use unique passwords for each student account",
          "Reset passwords at the start of each school year"
        ]
      }
    ],
    "privacy-protection": [
      {
        title: "Student Privacy in the Digital Classroom",
        description: "Protecting student information in educational technology.",
        content: `<h2>Protecting Student Privacy</h2>
<p>Educational technology creates new privacy considerations. Understanding these helps you protect your students.</p>
<h3>Key Privacy Considerations</h3>
<ul>
<li><strong>FERPA compliance:</strong> Understand what student information is protected</li>
<li><strong>App and platform privacy:</strong> Review privacy policies before using new tools</li>
<li><strong>Student data minimization:</strong> Collect only what is necessary</li>
<li><strong>Parental consent:</strong> Know when parent approval is required</li>
</ul>
<h3>Practical Steps</h3>
<ul>
<li>Use school-approved platforms whenever possible</li>
<li>Avoid using student full names in public-facing projects</li>
<li>Be careful with photos and videos of students</li>
</ul>`,
        takeaways: [
          "Understand FERPA and student privacy regulations",
          "Review privacy policies of educational apps",
          "Minimize the student data you collect and share"
        ]
      },
      {
        title: "Teaching Digital Citizenship",
        description: "Incorporating privacy education into your curriculum.",
        content: `<h2>Digital Citizenship in Your Classroom</h2>
<p>Privacy education is part of teaching responsible digital citizenship.</p>
<h3>Key Topics to Cover</h3>
<ul>
<li><strong>Digital footprint:</strong> Everything posted online can be permanent</li>
<li><strong>Personal information:</strong> What should stay private</li>
<li><strong>Consent:</strong> Asking before sharing others' photos or information</li>
<li><strong>Reporting:</strong> How and when to report privacy violations</li>
</ul>
<h3>Integration Strategies</h3>
<p>Integrate digital citizenship into existing subjects rather than treating it as a separate topic.</p>`,
        takeaways: [
          "Make digital citizenship part of your regular curriculum",
          "Teach students about their digital footprint",
          "Model good digital citizenship yourself"
        ]
      }
    ],
    "incident-response": [
      {
        title: "Responding to Cyberbullying",
        description: "How to handle cyberbullying incidents in your school.",
        content: `<h2>When Cyberbullying Happens</h2>
<p>Cyberbullying affects many students. Knowing how to respond makes a difference.</p>
<h3>Immediate Response</h3>
<ul>
<li><strong>Take it seriously:</strong> Never dismiss digital harassment</li>
<li><strong>Document everything:</strong> Screenshots and records before content is deleted</li>
<li><strong>Follow school policy:</strong> Report through proper channels</li>
<li><strong>Support the victim:</strong> Listen without judgment</li>
</ul>
<h3>Working with Families</h3>
<p>Communicate with parents of both the victim and the person doing the bullying. Focus on resolution and education rather than just punishment.</p>`,
        takeaways: [
          "Document incidents immediately",
          "Follow your school's reporting procedures",
          "Support affected students with empathy"
        ]
      },
      {
        title: "Creating a Classroom Incident Response Plan",
        description: "Be prepared to handle digital safety issues.",
        content: `<h2>Your Incident Response Plan</h2>
<p>Having a plan before incidents occur helps you respond effectively.</p>
<h3>Key Elements</h3>
<ul>
<li><strong>Clear procedures:</strong> Know your school's reporting requirements</li>
<li><strong>Contact list:</strong> IT support, administrators, counselors, law enforcement</li>
<li><strong>Documentation tools:</strong> Know how to capture evidence properly</li>
<li><strong>Communication templates:</strong> Prepared messages for parents</li>
</ul>
<h3>Prevention Focus</h3>
<p>The best incident response is prevention. Regular digital citizenship education reduces incidents.</p>`,
        takeaways: [
          "Know your school's incident response procedures",
          "Keep key contact information accessible",
          "Focus on prevention through education"
        ]
      }
    ]
  };
  return lessons[domain] || [];
}

function getBusinessLessons(domain: string): Array<{ title: string; description: string; content: string; takeaways: string[] }> {
  const lessons: Record<string, Array<{ title: string; description: string; content: string; takeaways: string[] }>> = {
    "threat-recognition": [
      {
        title: "Common Threats to Small Businesses",
        description: "Understand the security risks facing your business.",
        content: `<h2>Why Small Businesses Are Targets</h2>
<p>Many criminals target small businesses because they often have weaker security than large companies but still have valuable data and money.</p>
<h3>Top Threats to Watch For</h3>
<ul>
<li><strong>Business email compromise:</strong> Criminals impersonate executives or vendors to trick employees into sending money</li>
<li><strong>Ransomware:</strong> Malware that locks your files until you pay</li>
<li><strong>Phishing:</strong> Fake emails designed to steal credentials</li>
<li><strong>Payment fraud:</strong> Fake invoices or changed payment details</li>
</ul>
<h3>The Cost</h3>
<p>The average cost of a data breach for small businesses is over $100,000. Many small businesses never recover.</p>`,
        takeaways: [
          "Small businesses are often targeted by criminals",
          "Business email compromise is a top threat",
          "Prevention is far cheaper than recovery"
        ]
      },
      {
        title: "Recognizing Business Email Scams",
        description: "Protect your business from costly email fraud.",
        content: `<h2>Business Email Compromise</h2>
<p>Business email compromise (BEC) tricks employees into sending money or sensitive data. It costs businesses billions each year.</p>
<h3>How BEC Works</h3>
<ul>
<li><strong>CEO fraud:</strong> An email appears to come from your boss asking for an urgent wire transfer</li>
<li><strong>Vendor impersonation:</strong> A supplier asks to change their bank account for payments</li>
<li><strong>W2 requests:</strong> A fake HR request for all employee tax information</li>
</ul>
<h3>Prevention</h3>
<ul>
<li>Always verify unusual financial requests by phone</li>
<li>Establish procedures for payment changes that require verbal confirmation</li>
<li>Train all employees to recognize these tactics</li>
</ul>`,
        takeaways: [
          "Never process unusual financial requests without verbal verification",
          "Criminals will impersonate executives and vendors",
          "Written procedures prevent costly mistakes"
        ]
      }
    ],
    "password-security": [
      {
        title: "Business Password Policies",
        description: "Creating and enforcing strong password practices.",
        content: `<h2>Passwords in Your Business</h2>
<p>Weak passwords are one of the easiest ways for criminals to access your business systems.</p>
<h3>Creating a Password Policy</h3>
<ul>
<li><strong>Minimum length:</strong> Require at least 12 characters</li>
<li><strong>Unique passwords:</strong> Different passwords for each system</li>
<li><strong>No sharing:</strong> Employees never share their credentials</li>
<li><strong>Regular updates:</strong> Change passwords when employees leave</li>
</ul>
<h3>Tools to Help</h3>
<ul>
<li>Use a business password manager</li>
<li>Enable two-factor authentication on all critical systems</li>
<li>Consider single sign-on for easier management</li>
</ul>`,
        takeaways: [
          "Create and document a password policy",
          "Use a business password manager",
          "Enable two-factor authentication on critical accounts"
        ]
      },
      {
        title: "Access Control Basics",
        description: "Managing who has access to your business systems.",
        content: `<h2>Who Has Access to What?</h2>
<p>Not every employee needs access to every system. Limiting access reduces risk.</p>
<h3>Access Control Principles</h3>
<ul>
<li><strong>Least privilege:</strong> Give employees only the access they need</li>
<li><strong>Regular review:</strong> Audit who has access quarterly</li>
<li><strong>Prompt removal:</strong> Remove access immediately when employees leave</li>
<li><strong>Shared account elimination:</strong> Each person should have their own login</li>
</ul>
<h3>Critical Systems</h3>
<p>Pay special attention to financial systems, customer data, and email. These are the most valuable targets for criminals.</p>`,
        takeaways: [
          "Limit access to only what each employee needs",
          "Remove access immediately when employees leave",
          "Eliminate shared login accounts"
        ]
      }
    ],
    "privacy-protection": [
      {
        title: "Protecting Customer Data",
        description: "Your responsibility to safeguard customer information.",
        content: `<h2>Customer Data Protection</h2>
<p>Your customers trust you with their information. Protecting it is both an ethical responsibility and often a legal requirement.</p>
<h3>Types of Customer Data to Protect</h3>
<ul>
<li><strong>Payment information:</strong> Credit cards, bank accounts</li>
<li><strong>Personal information:</strong> Names, addresses, phone numbers</li>
<li><strong>Account credentials:</strong> Usernames and passwords</li>
<li><strong>Purchase history:</strong> What they bought and when</li>
</ul>
<h3>Protection Basics</h3>
<ul>
<li>Collect only what you need</li>
<li>Store data securely with encryption</li>
<li>Limit employee access to customer data</li>
<li>Have a plan for data breach notification</li>
</ul>`,
        takeaways: [
          "Only collect customer data you actually need",
          "Encrypt stored customer information",
          "Know your legal obligations for data protection"
        ]
      },
      {
        title: "Employee Privacy Training",
        description: "Training your team on privacy best practices.",
        content: `<h2>Training Your Team</h2>
<p>Your employees handle sensitive information daily. Training them is essential.</p>
<h3>Key Training Topics</h3>
<ul>
<li><strong>Data handling:</strong> How to properly store and transmit sensitive data</li>
<li><strong>Social engineering:</strong> How to recognize attempts to manipulate them</li>
<li><strong>Clean desk policy:</strong> Keeping sensitive documents secure</li>
<li><strong>Reporting:</strong> How and when to report concerns</li>
</ul>
<h3>Making Training Effective</h3>
<ul>
<li>Keep sessions short and focused</li>
<li>Use real examples relevant to your business</li>
<li>Train regularly, not just once a year</li>
</ul>`,
        takeaways: [
          "Regular security training reduces risk",
          "Use real examples from your industry",
          "Short, frequent training is more effective than annual sessions"
        ]
      }
    ],
    "incident-response": [
      {
        title: "Creating Your Incident Response Plan",
        description: "Be prepared when security incidents happen.",
        content: `<h2>Planning for the Worst</h2>
<p>Having a plan before an incident occurs dramatically reduces damage and recovery time.</p>
<h3>Essential Plan Components</h3>
<ul>
<li><strong>Contact list:</strong> Who to call first (IT, legal, insurance, law enforcement)</li>
<li><strong>Communication plan:</strong> How to notify customers and partners</li>
<li><strong>Evidence preservation:</strong> How to document what happened</li>
<li><strong>Recovery procedures:</strong> Steps to restore operations</li>
</ul>
<h3>Testing Your Plan</h3>
<p>An untested plan is no plan at all. Run through scenarios at least annually.</p>`,
        takeaways: [
          "Create a written incident response plan",
          "Include contact information for key responders",
          "Test your plan at least once a year"
        ]
      },
      {
        title: "Responding to a Security Incident",
        description: "What to do when something goes wrong.",
        content: `<h2>When an Incident Happens</h2>
<p>Your response in the first hours can make the difference between a minor issue and a major crisis.</p>
<h3>Immediate Steps</h3>
<ul>
<li><strong>Contain:</strong> Disconnect affected systems from the network</li>
<li><strong>Document:</strong> Record what you know about the incident</li>
<li><strong>Notify:</strong> Contact your IT support and leadership</li>
<li><strong>Preserve:</strong> Do not delete logs or evidence</li>
</ul>
<h3>Communication</h3>
<ul>
<li>Be honest with customers if their data was affected</li>
<li>Follow legal requirements for breach notification</li>
<li>Document all communications</li>
</ul>`,
        takeaways: [
          "Contain the incident before investigating",
          "Document everything from the start",
          "Be transparent with affected customers"
        ]
      }
    ]
  };
  return lessons[domain] || [];
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

export async function seedAISafetyTraining(): Promise<void> {
  const existingPaths = await db.select().from(learningPaths);
  const hasAISafety = existingPaths.some(p => p.title === "AI Safety & Smart Usage");
  if (hasAISafety) {
    console.log("[curriculum] AI Safety training already exists, skipping");
    return;
  }

  console.log("[curriculum] Seeding AI Safety training path...");

  const [path] = await db.insert(learningPaths).values({
    audience: "everyone",
    title: "AI Safety & Smart Usage",
    description: "Learn how to use AI tools safely and effectively. Spot deepfakes, detect AI-generated scams, protect your privacy, and build smart AI habits for everyday life.",
    level: "foundation",
    estimatedHours: 3,
    learningOutcomes: [
      "Identify AI-generated fake images, videos, and audio",
      "Detect AI-powered scam emails, texts, and calls",
      "Protect your personal information when using AI tools",
      "Use AI responsibly for everyday tasks",
      "Understand what AI can and cannot do"
    ],
    certificateName: "AI Safety Aware",
    iconName: "brain",
    color: "#8B5CF6",
    sortOrder: 10,
    isPublished: true
  }).returning();

  const aiModules = [
    {
      domain: "ai-deepfakes",
      title: "Spotting Deepfakes and AI-Generated Media",
      description: "Learn to identify AI-generated fake images, videos, and voice clones that are used in scams and misinformation.",
      learningObjectives: [
        "Recognize visual signs of AI-generated images and videos",
        "Understand how voice cloning works and how to verify callers",
        "Use free tools to check if media is AI-generated",
        "Know why deepfakes are dangerous and who they target"
      ],
      estimatedMinutes: 30,
      sortOrder: 0,
      lessons: [
        {
          title: "What Are Deepfakes and Why Should You Care?",
          description: "Understand what deepfakes are, how they work, and why they matter to you and your family.",
          content: `<h2>AI Can Now Fake Almost Anything</h2>
<p>Deepfakes are AI-generated fake videos, images, and audio that look and sound incredibly real. The technology has advanced so rapidly that even experts sometimes struggle to tell the difference.</p>
<h3>How Deepfakes Are Made</h3>
<p>AI analyzes thousands of photos, videos, or audio recordings of a person. It learns their facial expressions, voice patterns, and mannerisms. Then it creates entirely new content that never actually happened.</p>
<ul>
<li><strong>Face swaps:</strong> Putting one person's face onto another person's body in a video</li>
<li><strong>Voice cloning:</strong> Creating a perfect copy of someone's voice from just a few seconds of audio</li>
<li><strong>Full video generation:</strong> Creating entire videos of events that never occurred</li>
<li><strong>Image generation:</strong> Creating photorealistic images of people who don't exist</li>
</ul>
<h3>Real-World Impact</h3>
<p>In 2024, scammers used a deepfake video call impersonating a company CEO to trick an employee into transferring $25 million. Criminals have cloned teenagers' voices from social media posts to demand ransom from their parents. Deepfake technology has gone from a novelty to a serious security threat.</p>
<h3>Who Is Most at Risk?</h3>
<ul>
<li><strong>Seniors:</strong> Voice cloning scams impersonating grandchildren or officials (the "grandparent scam" is now powered by AI)</li>
<li><strong>Business owners:</strong> CEO fraud using deepfake video calls to authorize wire transfers</li>
<li><strong>Families:</strong> Fake kidnapping calls using cloned voices of children</li>
<li><strong>Everyone:</strong> Misinformation spread through fake videos of public figures</li>
</ul>`,
          takeaways: [
            "Deepfakes are AI-generated fake videos, images, and audio that look real",
            "Only a few seconds of audio is needed to clone someone's voice",
            "Scammers are using deepfakes for financial fraud, extortion, and misinformation",
            "Seniors, families, and businesses are especially targeted"
          ]
        },
        {
          title: "How to Spot Fake Videos and Images",
          description: "Learn specific visual clues that reveal AI-generated content.",
          content: `<h2>Training Your Eye to Spot Fakes</h2>
<p>While AI-generated media is getting better, there are still telltale signs you can look for. The key is knowing where to look.</p>
<h3>Signs of a Fake Video</h3>
<ul>
<li><strong>Unnatural blinking:</strong> AI sometimes gets blinking patterns wrong — too frequent, too slow, or not at all</li>
<li><strong>Facial edges:</strong> Look where the face meets the hair and ears — you may see blurring, warping, or mismatched skin tones</li>
<li><strong>Lip sync issues:</strong> The mouth may not perfectly match the words being spoken</li>
<li><strong>Lighting inconsistencies:</strong> Shadows may fall in different directions on the face versus the background</li>
<li><strong>Skin texture:</strong> AI faces can look too smooth, like they're wearing heavy makeup, or have unusual texture patterns</li>
<li><strong>Background glitches:</strong> Objects behind the person may warp, flicker, or shift unnaturally</li>
</ul>
<h3>Signs of a Fake Image</h3>
<ul>
<li><strong>Hands and fingers:</strong> AI frequently generates extra fingers, merged fingers, or oddly bent joints</li>
<li><strong>Text in images:</strong> Any text in AI images (signs, labels, books) is often garbled or nonsensical</li>
<li><strong>Symmetry issues:</strong> Earrings, glasses, or facial features that don't match side to side</li>
<li><strong>Too perfect:</strong> Skin that looks airbrushed with no pores or imperfections at all</li>
<li><strong>Background details:</strong> Furniture, architecture, or objects that don't make physical sense</li>
</ul>
<h3>The Context Test</h3>
<p>Beyond visual clues, always ask yourself:</p>
<ul>
<li>Does this video show something shocking or too good to be true?</li>
<li>Is it asking me to act urgently or emotionally?</li>
<li>Can I find this same video from a trusted news source?</li>
<li>Was it shared by an account I know and trust?</li>
</ul>`,
          takeaways: [
            "Look for unnatural blinking, facial edge blurring, and lip sync issues in videos",
            "AI often gets hands, fingers, and text wrong in images",
            "Always check the context: source, urgency, and whether trusted outlets report the same thing",
            "Technology improves fast so combine visual checks with context checks"
          ]
        },
        {
          title: "Voice Cloning: Verifying Who You're Really Talking To",
          description: "Understand voice cloning technology and learn verification techniques to protect yourself.",
          content: `<h2>Your Voice Can Be Cloned in Seconds</h2>
<p>Modern AI voice cloning technology can create a convincing copy of anyone's voice from as little as 3 seconds of audio. A voicemail, a social media video, or a phone recording is all it takes.</p>
<h3>How Voice Cloning Scams Work</h3>
<ol>
<li>Scammers find audio of their target's voice (social media, voicemail greetings, phone recordings)</li>
<li>AI creates a voice clone that sounds exactly like the person</li>
<li>The scammer calls a family member or colleague using the cloned voice</li>
<li>They create urgency: "I've been arrested," "I'm in the hospital," "I need money now"</li>
<li>They pressure the victim to send money immediately via wire transfer, gift cards, or cryptocurrency</li>
</ol>
<h3>The Family Code Word System</h3>
<p>The single most effective defense against voice cloning scams is a family code word — a secret word or phrase that only your family knows. Here's how to set it up:</p>
<ul>
<li>Choose a word or phrase that is unusual and not something you'd ever post online</li>
<li>Share it only in person with family members</li>
<li>If anyone calls claiming to be a family member in an emergency, ask for the code word</li>
<li>Change it periodically, especially if you think it may have been compromised</li>
</ul>
<h3>Other Verification Steps</h3>
<ul>
<li><strong>Hang up and call back</strong> using the phone number you have saved, not the number that called you</li>
<li><strong>Ask a specific question</strong> only the real person would know ("What did we have for dinner last night?")</li>
<li><strong>Wait and verify:</strong> Real emergencies can wait 5 minutes for you to verify. Scammers cannot.</li>
<li><strong>Contact another family member</strong> to confirm the story</li>
</ul>`,
          takeaways: [
            "AI can clone anyone's voice from just a few seconds of audio",
            "Set up a family code word that you only share in person",
            "Always hang up and call back on a number you trust",
            "Real emergencies can wait 5 minutes for verification — scams cannot"
          ]
        }
      ],
      questions: [
        {
          type: "multiple-choice",
          question: "How much audio does AI need to clone someone's voice?",
          options: ["At least 30 minutes", "About 10 minutes", "As little as a few seconds", "An entire phone conversation"],
          answer: "As little as a few seconds",
          explanation: "Modern AI voice cloning can create a convincing copy from as little as 3 seconds of audio from sources like social media videos or voicemails.",
          difficulty: "easy"
        },
        {
          type: "multiple-choice",
          question: "What is the BEST defense against a voice cloning scam call?",
          options: ["Block all unknown numbers", "Use a family code word and verify by calling back", "Never answer the phone", "Install an AI detection app"],
          answer: "Use a family code word and verify by calling back",
          explanation: "A family code word provides immediate verification. Always hang up and call back on a number you trust to confirm the person's identity.",
          difficulty: "medium"
        },
        {
          type: "true-false",
          question: "If a video has perfect lip syncing, it is definitely real and not a deepfake.",
          answer: "False",
          explanation: "AI technology is improving rapidly. While lip sync issues are one indicator, advanced deepfakes can achieve convincing lip sync. Always use multiple checks including context verification.",
          difficulty: "medium"
        },
        {
          type: "multiple-choice",
          question: "Which of these is a common sign of an AI-generated image?",
          options: ["High resolution", "Perfect background", "Extra or oddly-shaped fingers", "Professional lighting"],
          answer: "Extra or oddly-shaped fingers",
          explanation: "AI frequently struggles with hands and fingers, often generating extra digits, merged fingers, or oddly bent joints. This is one of the most reliable visual indicators.",
          difficulty: "easy"
        },
        {
          type: "multiple-choice",
          question: "Someone calls you sounding exactly like your grandchild, saying they need bail money immediately. What should you do?",
          options: ["Send the money right away — it sounds just like them", "Ask for the family code word and hang up to call them back", "Give them your credit card number", "Post about it on social media to warn others"],
          answer: "Ask for the family code word and hang up to call them back",
          explanation: "Voice cloning scams create urgency to prevent you from verifying. Always ask for your code word, hang up, and call the person directly on a number you have saved.",
          difficulty: "easy"
        }
      ]
    },
    {
      domain: "ai-scam-detection",
      title: "Detecting AI-Powered Scams",
      description: "Learn how AI has supercharged traditional scams and how to protect yourself from increasingly sophisticated attacks.",
      learningObjectives: [
        "Identify AI-enhanced phishing emails that bypass traditional red flags",
        "Recognize AI-generated scam websites and fake reviews",
        "Understand how scammers use AI to personalize attacks",
        "Know the warning signs that distinguish AI scams from legitimate communications"
      ],
      estimatedMinutes: 30,
      sortOrder: 1,
      lessons: [
        {
          title: "How AI Made Scams Harder to Spot",
          description: "Understand why traditional scam detection advice is no longer enough.",
          content: `<h2>The Old Rules No Longer Apply</h2>
<p>For years, experts told people to watch for bad grammar, spelling mistakes, and suspicious formatting in scam emails. That advice worked when scammers were writing messages themselves. AI changed everything.</p>
<h3>What AI Changed About Scams</h3>
<ul>
<li><strong>Perfect grammar and spelling:</strong> AI writes flawless English (or any language), eliminating the most obvious scam indicator</li>
<li><strong>Personalized content:</strong> AI can scrape your social media and craft messages that reference your real life — your job, your interests, even your recent activities</li>
<li><strong>Professional design:</strong> AI generates pixel-perfect copies of legitimate company emails, websites, and documents</li>
<li><strong>Scale and speed:</strong> One scammer can now generate thousands of unique, personalized scam messages per hour</li>
<li><strong>Multilingual attacks:</strong> AI translates scams perfectly into any language, expanding the victim pool globally</li>
</ul>
<h3>The New Red Flags</h3>
<p>Since grammar and spelling are no longer reliable indicators, focus on these instead:</p>
<ul>
<li><strong>Urgency:</strong> "Your account will be closed in 24 hours" or "Act now or lose access"</li>
<li><strong>Unexpected contact:</strong> Messages from companies you don't have accounts with, or surprising messages from ones you do</li>
<li><strong>Requests for sensitive info:</strong> Legitimate companies never ask for passwords, Social Security numbers, or full credit card details via email</li>
<li><strong>Unusual payment methods:</strong> Gift cards, cryptocurrency, or wire transfers are almost always scams</li>
<li><strong>Too good to be true:</strong> Prizes you didn't enter for, incredible deals, or surprise refunds</li>
</ul>`,
          takeaways: [
            "AI has eliminated spelling and grammar as reliable scam indicators",
            "Modern scams are personalized using data scraped from your online presence",
            "Focus on urgency, unexpected contact, and requests for sensitive information",
            "Legitimate companies never ask for passwords or sensitive data via email"
          ]
        },
        {
          title: "AI-Generated Fake Websites, Reviews, and Listings",
          description: "Learn how to identify AI-created fake websites and fraudulent online content.",
          content: `<h2>Fake Websites That Look Completely Real</h2>
<p>AI can now generate entire fake websites in minutes — complete with professional design, product photos, customer reviews, and even fake security badges. These sites are designed to steal your payment information or deliver nothing after you pay.</p>
<h3>How to Spot Fake Websites</h3>
<ul>
<li><strong>Check the URL carefully:</strong> Look for subtle misspellings (amaz0n.com vs amazon.com) or unusual domain extensions (.shop, .xyz instead of .com)</li>
<li><strong>Look for a physical address and phone number:</strong> Legitimate businesses provide real contact information. Call the number to verify.</li>
<li><strong>Check the domain age:</strong> Scam sites are usually days or weeks old. Search "whois [domain name]" to check when it was registered.</li>
<li><strong>Read the "About" page:</strong> AI-generated about pages often use vague, generic language without specific details about the company's history or team</li>
<li><strong>Check reviews outside the site:</strong> Search for the company name + "reviews" or "scam" on Google. Don't trust reviews only shown on the site itself.</li>
</ul>
<h3>AI-Generated Fake Reviews</h3>
<p>AI creates convincing fake reviews at scale. Warning signs include:</p>
<ul>
<li>Many reviews posted around the same date</li>
<li>Reviews that sound similar in tone and structure</li>
<li>Overly enthusiastic language without specific product details</li>
<li>Reviewer accounts with no history or only reviews for similar products</li>
</ul>
<h3>Safe Shopping Practices</h3>
<ul>
<li>Stick to well-known retailers or verify unknown ones through the Better Business Bureau</li>
<li>Use credit cards (not debit cards) for better fraud protection</li>
<li>Be suspicious of prices that are dramatically lower than everywhere else</li>
</ul>`,
          takeaways: [
            "AI can create entire fake websites with realistic design, products, and reviews",
            "Always verify the URL, domain age, and contact information before buying",
            "Search for independent reviews outside the website itself",
            "Use credit cards for online purchases for better fraud protection"
          ]
        }
      ],
      questions: [
        {
          type: "multiple-choice",
          question: "Why can't you rely on bad grammar and spelling to identify scam emails anymore?",
          options: ["Scammers hire professional writers now", "AI writes perfect grammar in any language", "Email providers fix the grammar automatically", "Scammers only target non-English speakers"],
          answer: "AI writes perfect grammar in any language",
          explanation: "AI tools can generate flawless, natural-sounding text in any language, eliminating what used to be the most obvious sign of a scam email.",
          difficulty: "easy"
        },
        {
          type: "multiple-choice",
          question: "What is the MOST reliable way to verify if a website is legitimate before making a purchase?",
          options: ["It has a padlock icon in the browser", "It has lots of 5-star reviews on the site", "Check the domain age and search for independent reviews", "The website looks professional and well-designed"],
          answer: "Check the domain age and search for independent reviews",
          explanation: "Scam sites can have padlocks (SSL), fake reviews, and professional designs. Domain age and independent reviews provide more reliable verification.",
          difficulty: "medium"
        },
        {
          type: "true-false",
          question: "A website with a padlock (HTTPS) in the browser address bar is always safe and legitimate.",
          answer: "False",
          explanation: "HTTPS only means the connection is encrypted — it doesn't verify the site is legitimate. Scam websites commonly use HTTPS to appear trustworthy.",
          difficulty: "easy"
        },
        {
          type: "multiple-choice",
          question: "Which payment method offers the BEST protection against online shopping fraud?",
          options: ["Wire transfer", "Gift cards", "Credit card", "Cryptocurrency"],
          answer: "Credit card",
          explanation: "Credit cards offer built-in fraud protection and the ability to dispute charges. Wire transfers, gift cards, and cryptocurrency are nearly impossible to recover once sent.",
          difficulty: "easy"
        }
      ]
    },
    {
      domain: "ai-privacy",
      title: "Protecting Your Privacy When Using AI",
      description: "Understand what happens to your data when you use AI tools and how to protect your personal information.",
      learningObjectives: [
        "Know what personal information should never be shared with AI",
        "Understand how AI companies use your conversations",
        "Configure privacy settings in popular AI tools",
        "Develop safe habits for everyday AI use"
      ],
      estimatedMinutes: 25,
      sortOrder: 2,
      lessons: [
        {
          title: "What Happens to Everything You Tell AI",
          description: "Understand how AI companies collect, store, and use your conversations.",
          content: `<h2>Your Conversations Are Not Private</h2>
<p>When you type something into ChatGPT, Google Gemini, or other AI tools, that conversation is stored on the company's servers. Understanding what happens to your data is the first step to protecting yourself.</p>
<h3>How Your Data Is Used</h3>
<ul>
<li><strong>Training data:</strong> By default, most AI companies use your conversations to train and improve their models. This means your words could influence future AI responses.</li>
<li><strong>Storage:</strong> Conversations are stored on servers, sometimes indefinitely. Even deleted chats may persist in backups.</li>
<li><strong>Employee access:</strong> Human reviewers at AI companies can read flagged conversations for quality control and safety.</li>
<li><strong>Inference:</strong> Even casual questions reveal information about you. Asking about low-sugar recipes tells the AI (and the company) about your health concerns.</li>
</ul>
<h3>7 Things You Should NEVER Share with AI</h3>
<ol>
<li><strong>Social Security numbers, driver's license, or passport details</strong></li>
<li><strong>Passwords or security question answers</strong></li>
<li><strong>Bank account or credit card numbers</strong></li>
<li><strong>Medical records or health insurance IDs</strong></li>
<li><strong>Confidential work documents or trade secrets</strong></li>
<li><strong>Private conversations or legal matters</strong></li>
<li><strong>Biometric data (fingerprints, face scans)</strong></li>
</ol>
<h3>Why This Matters</h3>
<p>Data breaches happen. In 2025, a threat actor claimed access to 20 million OpenAI accounts. Information you share with AI tools could be exposed in a breach, used for training without your knowledge, or accessed by company employees reviewing conversations.</p>`,
          takeaways: [
            "AI companies store and often use your conversations to train their models",
            "Never share Social Security numbers, passwords, financial details, or health IDs with AI",
            "Even casual questions reveal personal information about you",
            "Data breaches at AI companies can expose your private conversations"
          ]
        },
        {
          title: "How to Use AI Safely: Privacy Settings and Smart Habits",
          description: "Practical steps to protect your privacy while still getting value from AI tools.",
          content: `<h2>Practical Privacy Protection</h2>
<p>You don't have to avoid AI tools entirely — but you should use them wisely. Here are specific settings to change and habits to build.</p>
<h3>Privacy Settings to Change Right Now</h3>
<ul>
<li><strong>ChatGPT:</strong> Settings > Data Controls > Toggle OFF "Improve the model for everyone" — this stops your chats from being used for training</li>
<li><strong>Google Gemini:</strong> Go to myactivity.google.com and turn off Gemini Apps Activity</li>
<li><strong>Use temporary/incognito chats:</strong> Most AI tools offer a mode where conversations are not saved. Use this for anything sensitive.</li>
<li><strong>Clear your history regularly:</strong> Delete old conversations you no longer need</li>
<li><strong>Disable memory features:</strong> Some AI tools remember past conversations. Turn this off unless you have a specific reason to keep it on.</li>
</ul>
<h3>Smart AI Habits</h3>
<ul>
<li><strong>Treat everything as public:</strong> Before typing anything, ask yourself "Would I be comfortable if this appeared in a newspaper?"</li>
<li><strong>Use generic details:</strong> Instead of "I live at 123 Main Street and make $75,000," say "I live in a suburban area with a middle income"</li>
<li><strong>Never use AI for regulated data:</strong> Medical records (HIPAA), financial documents (PCI), or data covered by privacy laws (GDPR/CCPA) should never go into consumer AI tools</li>
<li><strong>Verify before acting:</strong> AI can be confidently wrong. Never make financial, medical, or legal decisions based solely on AI advice</li>
<li><strong>Use enterprise versions for work:</strong> Business versions of AI tools (ChatGPT Enterprise, etc.) offer better data isolation and don't use your conversations for training</li>
</ul>
<h3>Teaching Your Family</h3>
<p>Make sure everyone in your household knows these basics. Kids especially need to understand that AI is not a trusted friend — it's a tool run by a company that stores what you say.</p>`,
          takeaways: [
            "Turn off model training in ChatGPT settings and Gemini activity",
            "Use temporary chats for anything you wouldn't want stored permanently",
            "Always use generic details instead of specific personal information",
            "Verify AI advice independently before making important decisions"
          ]
        }
      ],
      questions: [
        {
          type: "multiple-choice",
          question: "By default, what do most AI companies do with your conversations?",
          options: ["Delete them immediately", "Use them to train and improve their AI models", "Share them with advertisers", "Encrypt them and never access them"],
          answer: "Use them to train and improve their AI models",
          explanation: "Most AI companies use your conversations to train their models by default. You can opt out in settings, but many users don't know this.",
          difficulty: "easy"
        },
        {
          type: "multiple-choice",
          question: "Which of these is safe to share with an AI tool?",
          options: ["Your Social Security number", "Your credit card number", "A general question about meal planning", "Your medical records"],
          answer: "A general question about meal planning",
          explanation: "General questions about topics like cooking, planning, or learning are safe. Never share identifying information, financial details, or health records.",
          difficulty: "easy"
        },
        {
          type: "true-false",
          question: "If you delete a conversation in ChatGPT, it is permanently removed from all servers.",
          answer: "False",
          explanation: "Deleted conversations may persist in backups and could have already been used for training. Treat every message as potentially permanent.",
          difficulty: "medium"
        },
        {
          type: "multiple-choice",
          question: "What is the BEST practice when you need to ask AI about a personal financial situation?",
          options: ["Share your exact income and bank details for accurate advice", "Use generic terms like 'middle income' instead of exact numbers", "Create a fake identity to protect yourself", "Avoid using AI for any financial questions"],
          answer: "Use generic terms like 'middle income' instead of exact numbers",
          explanation: "You can still get useful financial guidance by using approximate or generic details instead of sharing exact personal financial information.",
          difficulty: "medium"
        }
      ]
    },
    {
      domain: "ai-smart-usage",
      title: "Using AI Effectively and Responsibly",
      description: "Learn how to get the most out of AI tools while understanding their limitations and potential for error.",
      learningObjectives: [
        "Understand what AI can and cannot do reliably",
        "Write better prompts to get more useful responses",
        "Verify AI-generated information before acting on it",
        "Use AI as a tool while thinking critically about its output"
      ],
      estimatedMinutes: 25,
      sortOrder: 3,
      lessons: [
        {
          title: "What AI Actually Is (and What It Is Not)",
          description: "Cut through the hype and understand what AI tools can and cannot do.",
          content: `<h2>AI Is Not What You Think</h2>
<p>AI chatbots like ChatGPT, Gemini, and Claude are powerful — but they are not what most people imagine. Understanding what they really are helps you use them better and avoid costly mistakes.</p>
<h3>What AI Actually Does</h3>
<p>AI language models work by predicting the most likely next word in a sequence. They have been trained on billions of web pages, books, and documents. They are very good at:</p>
<ul>
<li><strong>Summarizing and rewriting text:</strong> Condensing long documents, changing tone, or restructuring content</li>
<li><strong>Brainstorming:</strong> Generating ideas, outlines, and creative suggestions</li>
<li><strong>Explaining concepts:</strong> Breaking down complex topics in simple language</li>
<li><strong>Drafting communications:</strong> Writing emails, letters, and messages</li>
<li><strong>Organizing information:</strong> Creating schedules, checklists, and structured plans</li>
</ul>
<h3>What AI Is NOT Good At</h3>
<ul>
<li><strong>Facts and accuracy:</strong> AI confidently states incorrect information ("hallucinations"). It can invent fake statistics, citations, and historical events.</li>
<li><strong>Math:</strong> AI frequently makes calculation errors, especially with multi-step problems</li>
<li><strong>Current events:</strong> AI's training data has a cutoff date. It may not know about recent events.</li>
<li><strong>Personal advice:</strong> AI doesn't know your actual situation — medical, legal, or financial advice from AI should always be verified with professionals</li>
<li><strong>Judgment:</strong> AI has no real understanding of context, ethics, or consequences the way humans do</li>
</ul>
<h3>The Golden Rule</h3>
<p>Use AI as a starting point, never as the final answer. Think of it as a smart assistant that's very good at drafting but needs a human to check its work.</p>`,
          takeaways: [
            "AI predicts text based on patterns — it doesn't truly 'understand' anything",
            "AI is great for drafting, summarizing, brainstorming, and organizing",
            "AI confidently presents wrong information — always verify facts and numbers",
            "Use AI as a starting point, never as the final answer for important decisions"
          ]
        },
        {
          title: "Getting Better Results: How to Talk to AI",
          description: "Simple techniques for writing prompts that get you more useful, accurate responses.",
          content: `<h2>Better Questions, Better Answers</h2>
<p>The quality of what AI gives you depends almost entirely on how you ask. You don't need to be technical — you just need to be specific.</p>
<h3>5 Simple Prompt Techniques</h3>
<h4>1. Be Specific</h4>
<p>Instead of: "Give me a recipe"<br/>
Try: "Give me a recipe for a healthy chicken dinner for 4 people that takes under 30 minutes with ingredients I can find at any grocery store"</p>
<h4>2. Give Context</h4>
<p>Instead of: "Write an email"<br/>
Try: "Write a polite but firm email to my internet provider asking them to fix a billing error where I was charged twice for last month"</p>
<h4>3. Specify the Format</h4>
<p>Instead of: "Tell me about budgeting"<br/>
Try: "Give me a simple monthly budget template as a table with categories for housing, food, transportation, savings, and entertainment"</p>
<h4>4. Set the Tone</h4>
<p>Instead of: "Explain blockchain"<br/>
Try: "Explain blockchain to my 70-year-old mother who has never used cryptocurrency, using everyday analogies she would understand"</p>
<h4>5. Ask for Alternatives</h4>
<p>Instead of accepting the first answer, say: "Give me 3 different approaches to this" or "What's another way to look at this?"</p>
<h3>Follow-Up Is Key</h3>
<p>AI conversations are back-and-forth. If the first response isn't quite right, say things like:</p>
<ul>
<li>"Make that shorter" or "Make that more detailed"</li>
<li>"Can you simplify the language?"</li>
<li>"That's not quite what I meant — I was asking about..."</li>
<li>"Give me a real-world example of that"</li>
</ul>`,
          takeaways: [
            "Specific prompts get dramatically better results than vague ones",
            "Include context about who you are and what you need",
            "Ask for a specific format (table, list, step-by-step) for clearer responses",
            "Always follow up and refine — AI conversations are back-and-forth"
          ]
        }
      ],
      questions: [
        {
          type: "multiple-choice",
          question: "What is an AI 'hallucination'?",
          options: ["When AI sees images that aren't there", "When AI confidently presents incorrect information as fact", "When AI crashes due to overload", "When AI refuses to answer a question"],
          answer: "When AI confidently presents incorrect information as fact",
          explanation: "AI hallucinations occur when the model generates plausible-sounding but false information, including fake statistics, citations, or events that never happened.",
          difficulty: "easy"
        },
        {
          type: "multiple-choice",
          question: "Which prompt will give you the BEST result?",
          options: ["Write an email", "Write a professional, friendly email to my landlord about a broken heater, requesting repair within the week", "Help me with my landlord", "Email template"],
          answer: "Write a professional, friendly email to my landlord about a broken heater, requesting repair within the week",
          explanation: "Specific prompts with context (who, what, tone, desired outcome) produce dramatically better results than vague requests.",
          difficulty: "easy"
        },
        {
          type: "true-false",
          question: "You should always verify important facts that AI tells you, even if the AI sounds very confident.",
          answer: "True",
          explanation: "AI presents all information with the same level of confidence, whether it's correct or completely fabricated. Always verify important facts independently.",
          difficulty: "easy"
        },
        {
          type: "multiple-choice",
          question: "What is AI BEST suited for?",
          options: ["Making final medical decisions", "Drafting, summarizing, and brainstorming", "Providing accurate legal advice", "Predicting stock market movements"],
          answer: "Drafting, summarizing, and brainstorming",
          explanation: "AI excels at text generation tasks like drafting emails, summarizing documents, and brainstorming ideas. It should not be relied on for professional medical, legal, or financial decisions.",
          difficulty: "easy"
        }
      ]
    }
  ];

  for (const moduleData of aiModules) {
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

    for (let i = 0; i < moduleData.lessons.length; i++) {
      await db.insert(trainingLessons).values({
        moduleId: module.id,
        title: moduleData.lessons[i].title,
        description: moduleData.lessons[i].description,
        contentType: "text",
        contentHtml: moduleData.lessons[i].content,
        keyTakeaways: moduleData.lessons[i].takeaways,
        estimatedMinutes: 10,
        sortOrder: i,
        isPublished: true
      });
    }

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

    for (let i = 0; i < moduleData.questions.length; i++) {
      await db.insert(quizQuestions).values({
        quizId: quiz.id,
        questionType: moduleData.questions[i].type,
        questionText: moduleData.questions[i].question,
        options: moduleData.questions[i].options || null,
        correctAnswer: moduleData.questions[i].answer,
        explanation: moduleData.questions[i].explanation,
        difficulty: moduleData.questions[i].difficulty || "medium",
        points: 10,
        sortOrder: i
      });
    }
  }

  console.log("[curriculum] AI Safety training path seeded successfully");
}
