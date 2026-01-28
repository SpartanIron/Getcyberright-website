import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { 
  ArrowRight, 
  Clock, 
  BookOpen, 
  X, 
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Shield
} from "lucide-react";
import logoImage from "@assets/image_(3)_1769558492356.png";

interface Resource {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  featured: boolean;
  content: {
    intro: string;
    sections: { title: string; content: string; tips?: string[] }[];
    conclusion: string;
  };
}

const resources: Resource[] = [
  {
    slug: "how-to-spot-phishing-emails",
    title: "How to Spot Phishing Emails: A Complete Guide",
    excerpt: "Learn the telltale signs that an email might be a phishing attempt. From suspicious sender addresses to urgent language, we cover everything you need to know.",
    category: "Email Safety",
    readTime: "8 min read",
    featured: true,
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
    content: {
      intro: "Phone scams cost older Americans billions of dollars each year. Scammers specifically target seniors because they may be more trusting, have savings, and are less likely to report being scammed.",
      sections: [
        {
          title: "Common Phone Scam Types",
          content: "The most common scams targeting seniors include IRS impersonators claiming you owe taxes, tech support scams claiming your computer has a virus, grandchild scams where someone pretends to be a relative in trouble, and Medicare or health insurance scams.",
          tips: ["The IRS will never call demanding immediate payment", "Legitimate tech companies do not make unsolicited calls", "Always verify a family emergency through other family members"]
        },
        {
          title: "Warning Signs During a Call",
          content: "Scammers use high pressure tactics. They may demand immediate payment, request payment in gift cards or wire transfers, threaten arrest or legal action, or ask you to keep the call secret from family members.",
          tips: ["Legitimate organizations do not demand gift card payments", "It is okay to hang up and call back on an official number", "Never give personal information to unsolicited callers"]
        },
        {
          title: "Having the Conversation with Loved Ones",
          content: "Talk with older family members about phone scams in a supportive, non judgmental way. Focus on how sophisticated these scams are rather than implying they are gullible. Share specific examples and practice responses together.",
          tips: ["Make it a regular conversation, not a one time lecture", "Share news stories about scams to normalize the topic", "Establish a family code word for emergencies"]
        },
        {
          title: "Setting Up Protections",
          content: "Register phone numbers on the National Do Not Call Registry. Consider call blocking apps or services from your phone provider. Set up a system where large financial decisions are discussed with a family member first.",
          tips: ["Many phone carriers offer free scam call blocking", "Consider a phone with large caller ID display", "Set up automatic fraud alerts on financial accounts"]
        }
      ],
      conclusion: "The best protection is awareness. By having open conversations and setting up practical safeguards, you can help protect your loved ones from phone scams while respecting their independence."
    }
  },
  {
    slug: "romance-scam-warning-signs",
    title: "Romance Scam Warning Signs Everyone Should Know",
    excerpt: "Romance scams cost victims billions each year. Learn to recognize the patterns scammers use to build false trust and request money.",
    category: "Scam Awareness",
    readTime: "10 min read",
    featured: false,
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
    title: "Setting Up Two Factor Authentication Without the Confusion",
    excerpt: "Two factor authentication is one of the best ways to protect your accounts. We explain what it is and how to set it up simply.",
    category: "Account Security",
    readTime: "5 min read",
    featured: false,
    content: {
      intro: "Two factor authentication, often called 2FA, adds an extra layer of security to your accounts. Even if someone steals your password, they cannot get into your account without the second factor.",
      sections: [
        {
          title: "What Is Two Factor Authentication",
          content: "Two factor authentication means you need two things to log in: something you know (your password) and something you have (usually your phone). After entering your password, you will receive a code on your phone to complete the login.",
          tips: ["Think of it like a deadbolt in addition to your regular door lock", "The extra step only takes a few seconds", "It stops most hackers even if they have your password"]
        },
        {
          title: "Types of Two Factor Authentication",
          content: "The most common type is text message codes sent to your phone. Authenticator apps like Google Authenticator are more secure. Some services also support physical security keys or email codes.",
          tips: ["Authenticator apps are free and easy to use", "Text message codes are better than no 2FA at all", "Keep backup codes in a safe place in case you lose your phone"]
        },
        {
          title: "Setting It Up Step by Step",
          content: "Go to the security settings of your account. Look for two factor authentication, two step verification, or login verification. Choose your preferred method and follow the prompts to add your phone number or set up an authenticator app.",
          tips: ["Start with your email and banking accounts first", "Take screenshots of backup codes and store them securely", "Most setups take less than five minutes"]
        },
        {
          title: "What If You Lose Your Phone",
          content: "Most services provide backup codes when you set up 2FA. Store these codes in a safe place like a password manager or written down in a secure location. Some services also let you set up a backup phone number.",
          tips: ["Never store backup codes only on your phone", "Update your 2FA settings if you get a new phone", "Contact customer support if you are completely locked out"]
        }
      ],
      conclusion: "Two factor authentication is one of the most effective ways to protect your accounts. Start with your most important accounts and gradually add it to all your online services."
    }
  },
  {
    slug: "social-media-privacy-settings",
    title: "Social Media Privacy Settings: A Platform by Platform Guide",
    excerpt: "Your social media profiles may be sharing more than you realize. Learn how to lock down your privacy on Facebook, Instagram, and more.",
    category: "Privacy",
    readTime: "12 min read",
    featured: false,
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
    content: {
      intro: "We have all done it, clicked a link without thinking and then realized it might have been dangerous. The good news is that clicking a link alone usually will not infect your device. Here is what to do next.",
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
          tips: ["Change compromised passwords from a different device if possible", "Enable two factor authentication on affected accounts", "Check for any unauthorized transactions or activity"]
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
    content: {
      intro: "Teaching children about online safety is essential in today's digital world. The key is having ongoing conversations that evolve as they grow, rather than one big talk.",
      sections: [
        {
          title: "Young Children, Ages 5 to 8",
          content: "Focus on the basics: never share personal information like your real name, address, school, or phone number with anyone online. Teach them to tell a parent if anything online makes them uncomfortable.",
          tips: ["Compare online strangers to real world strangers", "Use parental controls and kid safe browsers", "Keep devices in shared family spaces"]
        },
        {
          title: "Pre Teens, Ages 9 to 12",
          content: "Expand the conversation to cover social media basics, cyberbullying, and critical thinking about what they see online. Help them understand that people online are not always who they claim to be.",
          tips: ["Review privacy settings together on any apps they use", "Talk about what to do if they receive mean messages", "Discuss that photos shared online can spread beyond intended recipients"]
        },
        {
          title: "Teenagers, Ages 13 and Up",
          content: "Address more complex topics like digital reputation, sexting consequences, online predators, and scams targeting young people. Focus on decision making skills rather than strict rules.",
          tips: ["Discuss how colleges and employers check social media", "Talk about healthy online relationships", "Be available without judgment when they have concerns"]
        },
        {
          title: "Creating an Open Environment",
          content: "The most important thing is that your child feels comfortable coming to you with problems. Make it clear they will not get in trouble for reporting something concerning they encountered online.",
          tips: ["Share your own experiences with suspicious emails or scams", "Check in regularly about their online activities", "Know the apps and games your children use"]
        }
      ],
      conclusion: "Online safety is not a one time conversation but an ongoing dialogue. By staying involved and keeping communication open, you can help your children navigate the digital world safely."
    }
  },
  {
    slug: "small-business-security-basics",
    title: "Small Business Security Basics: Where to Start",
    excerpt: "A practical starting point for small business owners who want to protect their business but do not have an IT department.",
    category: "Business",
    readTime: "7 min read",
    featured: false,
    content: {
      intro: "Small businesses are increasingly targeted by cybercriminals because they often lack the security resources of larger companies. The good news is that basic security does not require a large budget or technical expertise.",
      sections: [
        {
          title: "Secure Your Accounts",
          content: "Enable two factor authentication on all business accounts, especially email, banking, and social media. Use strong, unique passwords for each account. Consider a business password manager to help employees manage credentials securely.",
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
          tips: ["Regular training is more effective than one time sessions", "Run practice phishing tests to identify weak spots", "Make it easy for employees to report suspicious activity"]
        },
        {
          title: "Backup and Recovery",
          content: "Regularly backup all critical business data. Store backups in a separate location from your primary systems. Test your backups periodically to ensure you can actually restore from them.",
          tips: ["Use the 3 2 1 rule: 3 copies, 2 different media types, 1 offsite", "Automate backups so they happen consistently", "Cloud backup services can simplify this process"]
        }
      ],
      conclusion: "You do not need to be perfect at security to significantly reduce your risk. Start with these basics and gradually improve your security posture over time. The most important step is to start."
    }
  }
];

const categories = ["All", "Email Safety", "Senior Safety", "Scam Awareness", "Account Security", "Privacy", "Emergency Response", "Family Safety", "Business"];

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedResource, setExpandedResource] = useState<string | null>(null);

  const filteredResources = selectedCategory === "All" 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);
  
  const featuredResources = filteredResources.filter(r => r.featured);
  const allResources = filteredResources;

  const handleResourceClick = (slug: string) => {
    setExpandedResource(expandedResource === slug ? null : slug);
  };

  const getResourceBySlug = (slug: string) => resources.find(r => r.slug === slug);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <img src={logoImage} alt="" className="w-5 h-5 object-contain" />
                <span>Educational Resources</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Learn to Protect Yourself{" "}
                <span className="text-primary">Online</span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Guides, articles, and educational content written in plain language. 
                No tech jargon, just practical knowledge you can use today.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {featuredResources.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-6">Featured Guides</h2>
                
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                  {featuredResources.map((resource, index) => (
                    <motion.div
                      key={resource.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card 
                        className="h-full hover-elevate cursor-pointer" 
                        data-testid={`featured-${resource.slug}`}
                        onClick={() => handleResourceClick(resource.slug)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                              Featured
                            </Badge>
                            <Badge variant="outline">{resource.category}</Badge>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                            {resource.title}
                          </h3>
                          
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {resource.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{resource.readTime}</span>
                            </div>
                            <span className="text-primary text-sm font-medium flex items-center gap-1">
                              {expandedResource === resource.slug ? "Close" : "Read more"} 
                              <ChevronDown className={`w-3 h-3 transition-transform ${expandedResource === resource.slug ? 'rotate-180' : ''}`} />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
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

            <AnimatePresence mode="wait">
              {expandedResource && (
                <motion.div
                  key="expanded-content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  {(() => {
                    const resource = getResourceBySlug(expandedResource);
                    if (!resource) return null;
                    
                    return (
                      <Card className="border-primary/20" data-testid={`article-expanded-${resource.slug}`}>
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{resource.category}</Badge>
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

                            <div className="space-y-8">
                              {resource.content.sections.map((section, idx) => (
                                <div key={idx}>
                                  <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-primary" />
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

                            <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
                              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-primary" />
                                Key Takeaway
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
                </motion.div>
              )}
            </AnimatePresence>

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
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">{resource.category}</Badge>
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
                  No resources match the selected category.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory("All")}
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
