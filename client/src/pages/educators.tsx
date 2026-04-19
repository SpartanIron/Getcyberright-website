"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StructuredData } from "@/components/structured-data";
import type { FAQData, BreadcrumbData } from "@/components/structured-data";
import {
  Shield, BookOpen, Users, Presentation, FileText,
  CheckCircle, Star, AlertTriangle, MessageCircle,
  ArrowRight, Lightbulb, GraduationCap, School,
  ClipboardList, Download, CalendarDays
} from "lucide-react";
import bannerImage from "@/assets/banners/educators-banner.webp";
import digitalCitizenshipImg from "@/assets/images/card-digital-citizenship.webp";
import cyberbullyingImg from "@/assets/images/card-cyberbullying.webp";
import privacyEducationImg from "@/assets/images/card-privacy-education.webp";
import socialMediaLiteracyImg from "@/assets/images/card-social-media-literacy.webp";
import onlineResearchImg from "@/assets/images/card-online-research.webp";
import passwordEducationImg from "@/assets/images/card-password-education.webp";
import {
  LessonPlanGenerator,
  ClassroomActivitySimulator,
  AssessmentQuizBuilder,
  CurriculumAlignmentGuide,
  ClassroomMaterialsGallery
} from "@/components/educators-hub/interactive-tools";
import {
  lessonPlanTemplates,
  classroomActivities,
  assessmentQuestions,
  curriculumStandards,
  classroomMaterials
} from "@/components/educators-hub/activity-data";
import { imgSrc } from "@/lib/img-src";
import { SchoolPresentationForm } from "@/components/school-presentation-form";

interface EducatorResource {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
  color: string;
  gradeLevel: string;
  image: string;
  content: {
    overview: string;
    learningObjectives: string[];
    classroomActivities: string[];
    discussionQuestions: string[];
    additionalResources: string;
  };
}

const educatorResources: EducatorResource[] = [
  {
    id: "digital-citizenship",
    title: "Digital Citizenship Fundamentals",
    description: "Teach students to be responsible, respectful, and safe online.",
    icon: Users,
    color: "bg-blue-500",
    gradeLevel: "All Grades",
    image: imgSrc(digitalCitizenshipImg),
    content: {
      overview: "Digital citizenship encompasses the norms of appropriate and responsible technology use. Students need to understand that online actions have real consequences, and that being a good digital citizen means treating others with respect, protecting privacy, and contributing positively to online communities.",
      learningObjectives: [
        "Define digital citizenship and explain why it matters.",
        "Identify the rights and responsibilities of being online.",
        "Demonstrate respectful online communication.",
        "Recognize the permanence of digital actions.",
        "Apply ethical thinking to online situations."
      ],
      classroomActivities: [
        "Digital Citizenship Pledge: Have students create and sign a class pledge for responsible online behavior.",
        "Scenario Cards: Present various online situations and have students discuss appropriate responses.",
        "Online vs. Offline: Compare how we treat people in person versus online and discuss differences.",
        "Digital Footprint Timeline: Create a visual showing how online actions accumulate over time.",
        "Role Reversal: Have students consider how they would feel receiving different types of online messages."
      ],
      discussionQuestions: [
        "What makes someone a good digital citizen?",
        "How is communicating online different from talking in person?",
        "What would you do if you saw someone being treated badly online?",
        "Why do you think some people act differently online than they do in person?"
      ],
      additionalResources: "Common Sense Media offers free K-12 digital citizenship curriculum aligned with educational standards."
    }
  },
  {
    id: "cyberbullying-prevention",
    title: "Cyberbullying Prevention",
    description: "Recognize, prevent, and respond to online harassment.",
    icon: AlertTriangle,
    color: "bg-red-500",
    gradeLevel: "Grades 3-12",
    image: imgSrc(cyberbullyingImg),
    content: {
      overview: "Cyberbullying can happen 24 hours a day, follows students home, and can spread quickly to large audiences. Unlike traditional bullying, digital content can be preserved and shared repeatedly. Teaching students to recognize cyberbullying and empowering bystanders to act are key prevention strategies.",
      learningObjectives: [
        "Define cyberbullying and distinguish it from other online conflicts.",
        "Identify the different roles in cyberbullying situations.",
        "Develop strategies for responding to cyberbullying.",
        "Understand the emotional impact of cyberbullying on victims.",
        "Learn how to be an upstander rather than a bystander."
      ],
      classroomActivities: [
        "Anonymous Story Sharing: Let students submit experiences with online conflict (anonymously) for class discussion.",
        "Upstander Strategies: Brainstorm and role-play ways to support someone being cyberbullied.",
        "Screenshot Analysis: Review example screenshots (created for training) and discuss what makes content harmful.",
        "Support Network Mapping: Have students identify trusted adults they could turn to for help.",
        "Empathy Exercise: Write letters from the perspective of different people involved in a cyberbullying situation."
      ],
      discussionQuestions: [
        "Why might someone who is kind in person behave differently online?",
        "What can make it hard to stand up for someone being bullied online?",
        "How can you tell the difference between joking around and cyberbullying?",
        "What should you do if a friend shows you mean messages someone sent them?"
      ],
      additionalResources: "StopBullying.gov provides research-based resources for educators on preventing and responding to cyberbullying."
    }
  },
  {
    id: "privacy-security",
    title: "Privacy and Security Basics",
    description: "Help students protect their personal information online.",
    icon: Shield,
    color: "bg-green-500",
    gradeLevel: "Grades 4-12",
    image: imgSrc(privacyEducationImg),
    content: {
      overview: "Students often share personal information online without considering the consequences. Teaching privacy and security helps students understand what information is sensitive, how it can be misused, and practical steps to protect themselves. Strong passwords and privacy settings are foundational skills.",
      learningObjectives: [
        "Identify what constitutes personal and sensitive information.",
        "Explain why privacy matters and how information can be misused.",
        "Create strong, memorable passwords.",
        "Configure basic privacy settings on common platforms.",
        "Recognize phishing attempts and suspicious requests."
      ],
      classroomActivities: [
        "Personal Info Sorting: Sort examples of information into 'safe to share' and 'keep private' categories.",
        "Password Challenge: Create the strongest password that is still memorable using creative techniques.",
        "Privacy Audit: Walk through privacy settings on a sample account (teacher-controlled demo).",
        "Phishing Detective: Analyze example emails and identify red flags that indicate phishing.",
        "Data Trail Mapping: Trace how much data is collected during a typical day of device use."
      ],
      discussionQuestions: [
        "What might happen if someone got access to your accounts?",
        "Why do apps and websites want to collect information about us?",
        "How do you decide whether to share personal information online?",
        "What would you do if you accidentally shared something private?"
      ],
      additionalResources: "The National Cyber Security Alliance provides educational materials at StaySafeOnline.org for teaching security fundamentals."
    }
  },
  {
    id: "media-literacy",
    title: "Media Literacy and Misinformation",
    description: "Develop critical thinking skills for evaluating online content.",
    icon: BookOpen,
    color: "bg-purple-500",
    gradeLevel: "Grades 5-12",
    image: imgSrc(socialMediaLiteracyImg),
    content: {
      overview: "Students encounter a constant stream of information online, but not all of it is accurate or trustworthy. Media literacy teaches students to think critically about the content they consume, verify information before sharing, and understand how algorithms and bias shape what they see.",
      learningObjectives: [
        "Distinguish between facts, opinions, and misinformation.",
        "Apply lateral reading techniques to verify information.",
        "Identify bias in media sources.",
        "Understand how algorithms personalize content.",
        "Evaluate the credibility of online sources."
      ],
      classroomActivities: [
        "Source Comparison: Analyze how different sources report on the same event.",
        "Fact-Checking Practice: Use fact-checking websites to verify viral claims.",
        "Bias Detective: Identify loaded language and perspective in sample articles.",
        "Algorithm Experiment: Compare search results and social feeds across different accounts.",
        "Create Misinformation: Have students create (harmless) fake news to understand how it spreads."
      ],
      discussionQuestions: [
        "How do you decide if something you see online is true?",
        "Why might someone create or share false information?",
        "How does the content you see online differ from what your friends see?",
        "What responsibility do we have before sharing information?"
      ],
      additionalResources: "NewsLit.org and the Stanford History Education Group offer free media literacy curriculum and lesson plans."
    }
  },
  {
    id: "responsible-gaming",
    title: "Responsible Gaming and Screen Time",
    description: "Address gaming safety, balance, and healthy digital habits.",
    icon: Presentation,
    color: "bg-orange-500",
    gradeLevel: "Grades 3-10",
    image: imgSrc(onlineResearchImg),
    content: {
      overview: "Gaming is a significant part of many students' lives. While games can be educational and social, they also present risks including exposure to inappropriate content, in-game purchases, and excessive screen time. Teaching balanced digital habits helps students develop healthy relationships with technology.",
      learningObjectives: [
        "Recognize the benefits and risks of online gaming.",
        "Identify strategies for maintaining gaming balance.",
        "Understand how game design can encourage overuse.",
        "Practice safe communication in gaming environments.",
        "Develop personal screen time management skills."
      ],
      classroomActivities: [
        "Game Rating Research: Investigate what different game ratings mean and why they matter.",
        "Time Tracking Challenge: Have students track their screen time for a week and reflect on patterns.",
        "Design a Balanced Day: Create sample daily schedules that include gaming alongside other activities.",
        "Gaming Safety Rules: Collaboratively create classroom guidelines for safe online gaming.",
        "Reflection Journals: Weekly entries about how technology use affected their week."
      ],
      discussionQuestions: [
        "What makes it hard to stop playing a game?",
        "How do you feel after spending a long time on screens?",
        "What are some positive things you have learned or experienced through gaming?",
        "How could you help a friend who seems to be gaming too much?"
      ],
      additionalResources: "The Entertainment Software Rating Board (ESRB) provides family gaming guides and rating information at ESRB.org."
    }
  },
  {
    id: "institutional-security",
    title: "School Technology Policies",
    description: "Best practices for protecting school networks and data.",
    icon: School,
    color: "bg-teal-500",
    gradeLevel: "Educators",
    image: imgSrc(passwordEducationImg),
    content: {
      overview: "Schools are increasingly targets for cyberattacks, and educators play an important role in maintaining security. Understanding basic security practices, recognizing threats, and knowing how to respond to incidents helps protect student data and school operations.",
      learningObjectives: [
        "Understand common threats facing educational institutions.",
        "Follow best practices for protecting student data.",
        "Recognize and report suspicious activities or communications.",
        "Maintain security while using technology in instruction.",
        "Model good security behaviors for students."
      ],
      classroomActivities: [
        "Policy Review: Examine your school's acceptable use policy and discuss with students.",
        "Incident Response Planning: Know who to contact and what steps to take if you suspect a breach.",
        "Password Hygiene: Ensure all your accounts use strong, unique passwords.",
        "Phishing Awareness: Learn to recognize targeted attacks that may use school information.",
        "Data Minimization: Only collect and retain student data that is necessary."
      ],
      discussionQuestions: [
        "What student information are we responsible for protecting?",
        "How would you handle a student who violated acceptable use policies?",
        "What should you do if you receive a suspicious email that appears to be from administration?",
        "How can we balance educational technology use with security?"
      ],
      additionalResources: "The Consortium for School Networking (CoSN) provides cybersecurity resources specifically designed for K-12 education at CoSN.org."
    }
  }
];

type TabKey = "guides" | "lessons" | "activities" | "assessments" | "curriculum" | "materials";

const tabs: { key: TabKey; label: string; icon: typeof Shield }[] = [
  { key: "guides", label: "Topic Guides", icon: BookOpen },
  { key: "lessons", label: "Lesson Plans", icon: ClipboardList },
  { key: "activities", label: "Activities", icon: Users },
  { key: "assessments", label: "Assessments", icon: GraduationCap },
  { key: "curriculum", label: "Curriculum", icon: FileText },
  { key: "materials", label: "Materials", icon: Download }
];

function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-indigo-300/15 dark:bg-indigo-500/10" />
      <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-purple-300/15 dark:bg-purple-500/10" />
      <div className="absolute bottom-32 left-1/4 w-12 h-12 rounded-full bg-blue-300/15 dark:bg-blue-500/10" />
      <div className="absolute bottom-20 right-1/3 w-20 h-20 rounded-full bg-teal-300/15 dark:bg-teal-500/10" />
    </div>
  );
}

function TopicGuidesSection({ onSelectResource }: { onSelectResource: (id: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6">
        {educatorResources.map((resource) => (
          <Card
            key={resource.id}
            className="cursor-pointer transition-shadow hover:shadow-xl border-2 border-white/50 dark:border-white/10 bg-white/80 dark:bg-card/80 backdrop-blur-sm overflow-hidden"
            onClick={() => onSelectResource(resource.id)}
            onKeyDown={(e) => e.key === 'Enter' && onSelectResource(resource.id)}
            tabIndex={0}
            role="button"
            aria-label={`View ${resource.title} resource`}
            data-testid={`card-resource-${resource.id}`}
          >
            <div className="relative h-48 sm:h-56 w-full">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-full object-cover"
                loading="lazy"
                data-testid={`img-resource-${resource.id}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Badge variant="secondary" className="absolute top-3 right-3 text-xs">{resource.gradeLevel}</Badge>
            </div>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-2">
                <div className={`w-10 h-10 rounded-md ${resource.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                  <resource.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">{resource.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{resource.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-2 border-teal-200 dark:border-teal-800">
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
                Interactive lessons designed for students ages 8 to 16. Use these self-guided modules as supplementary learning materials.
              </p>
            </div>
            <Button variant="outline" className="border-teal-300 dark:border-teal-700" onClick={() => {
              window.location.href = '/kids';
            }} data-testid="button-kids-hub">
              View Student Resources
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResourceContent({
  resource,
  onBack
}: {
  resource: EducatorResource;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-2"
        data-testid="button-back-to-resources"
      >
        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
        Back to All Resources
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl ${resource.color} flex items-center justify-center shadow-lg`}>
                <resource.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">{resource.title}</CardTitle>
                <CardDescription className="text-base">{resource.description}</CardDescription>
              </div>
            </div>
            <Badge>{resource.gradeLevel}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h4 className="font-semibold text-lg text-foreground mb-3">Overview</h4>
            <p className="text-muted-foreground leading-relaxed">{resource.content.overview}</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-lg text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Learning Objectives
            </h4>
            <ul className="space-y-3">
              {resource.content.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-700 dark:text-blue-300">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-lg text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Classroom Activities
            </h4>
            <ul className="space-y-4">
              {resource.content.classroomActivities.map((activity, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm flex-shrink-0">{index + 1}</span>
                  <span className="text-green-700 dark:text-green-300">{activity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-lg text-purple-800 dark:text-purple-200 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Discussion Questions
            </h4>
            <ul className="space-y-3">
              {resource.content.discussionQuestions.map((question, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-purple-500 font-bold text-lg">?</span>
                  <span className="text-purple-700 dark:text-purple-300">{question}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-lg text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Additional Resources
            </h4>
            <p className="text-amber-700 dark:text-amber-300">{resource.content.additionalResources}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onBack} variant="outline" data-testid="button-explore-more">
          Explore More Resources
        </Button>
      </div>
    </div>
  );
}

export default function Educators() {
  const [activeTab, setActiveTab] = useState<TabKey>("guides");
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  const currentResource = selectedResource
    ? educatorResources.find(r => r.id === selectedResource)
    : null;

  const educatorsFaqSchema: FAQData = {
    type: "FAQPage",
    items: educatorResources.map(resource => ({
      question: `How do I teach ${resource.title.toLowerCase()} in the classroom?`,
      answer: resource.content.overview,
    })),
  };

  const educatorsBreadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Educators", url: "https://www.getcyberright.com/educators" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[educatorsFaqSchema, educatorsBreadcrumbs]} />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        {currentResource ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-blue-950/30" />
            <div className="relative py-8">
              <div className="max-w-4xl mx-auto px-4">
                <ResourceContent
                  resource={currentResource}
                  onBack={() => setSelectedResource(null)}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <PageBanner
              title="Teach Digital Safety"
              subtitle="Classroom resources, lesson plans, and activities to help students become responsible digital citizens and stay safe online."
              imageSrc={imgSrc(bannerImage)}
              imageAlt="Classroom teaching cybersecurity education"
              colorVariant="indigo"
            />

            <div className="relative py-8">
              <FloatingShapes />

              <div className="max-w-5xl mx-auto px-4 relative z-10">
                <div className="flex flex-wrap gap-2 mb-8 bg-muted/50 p-2 rounded-xl border" data-testid="educator-tabs">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          activeTab === tab.key
                            ? "bg-background text-foreground shadow-sm border"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        }`}
                        data-testid={`tab-${tab.key}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {activeTab === "guides" && (
                  <TopicGuidesSection onSelectResource={setSelectedResource} />
                )}

                {activeTab === "lessons" && (
                  <LessonPlanGenerator lessons={lessonPlanTemplates} />
                )}

                {activeTab === "activities" && (
                  <ClassroomActivitySimulator activities={classroomActivities} />
                )}

                {activeTab === "assessments" && (
                  <AssessmentQuizBuilder questions={assessmentQuestions} />
                )}

                {activeTab === "curriculum" && (
                  <CurriculumAlignmentGuide standards={curriculumStandards} />
                )}

                {activeTab === "materials" && (
                  <ClassroomMaterialsGallery materials={classroomMaterials} />
                )}

                <div className="mt-12 space-y-12">
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <ClipboardList className="w-6 h-6 text-indigo-600" />
                      <h2 className="text-2xl font-bold text-foreground">Featured Lesson Plans</h2>
                    </div>
                    <p className="text-muted-foreground mb-6">Three classroom-ready lessons aligned to ISTE Standards for Students 2 (Digital Citizen). Each includes objectives, materials, a 45-minute flow, and an assessment idea.</p>
                    <div className="grid md:grid-cols-3 gap-5">
                      {[
                        {
                          id: "digital-citizenship-3-5",
                          title: "Digital Citizenship Fundamentals",
                          grade: "Grades 3 to 5",
                          duration: "45 minutes",
                          color: "bg-blue-500",
                          icon: Users,
                          objective: "Students will define digital citizenship and identify three responsible online behaviors.",
                          materials: "Chart paper, markers, printed scenario cards (provided), one device per pair (optional).",
                          flow: [
                            "Hook (5 min): Share a short story of a kind comment versus an unkind one online and ask which made the day better.",
                            "Direct teach (10 min): Define digital citizenship with three pillars: respect, responsibility, safety.",
                            "Practice (20 min): In pairs, students sort 12 scenario cards into the three pillars and pick one card to act out.",
                            "Reflect (10 min): Each student writes one promise they'll keep online this week and posts it on a class chart."
                          ],
                          assessment: "Exit ticket: 'Name one thing a good digital citizen does and one thing they avoid'.",
                          discussion: [
                            "What does it feel like to read an unkind comment online? How is that different from hearing it in person?",
                            "If a friend posts something embarrassing about another student, what is a kind way to respond?",
                            "Why is it important to ask permission before sharing a photo or video of someone else?"
                          ],
                          standard: "ISTE Standards for Students 2: Digital Citizen"
                        },
                        {
                          id: "password-security-6-8",
                          title: "Password Security and Account Safety",
                          grade: "Grades 6 to 8",
                          duration: "45 minutes",
                          color: "bg-emerald-500",
                          icon: Shield,
                          objective: "Students will create a 14-character passphrase, explain why reusing passwords is risky, and turn on multi-factor authentication on a sample account.",
                          materials: "Projector, sample 'data breach' headlines, paper, optional sandbox account for MFA demo.",
                          flow: [
                            "Hook (5 min): Show a real news headline about a major breach. Ask: 'If this site was breached and you used the same password elsewhere, what could happen?'",
                            "Direct teach (10 min): Demonstrate the four-random-words passphrase technique and the math of long versus complex passwords.",
                            "Practice (20 min): Each student drafts their own passphrase (not a real one they'll use) and tests it on a public strength meter. Then walks through enabling MFA on a teacher-provided demo account.",
                            "Reflect (10 min): Class discussion: which of your real accounts most need MFA tonight, and why?"
                          ],
                          assessment: "Short response: 'Explain why a 14-character passphrase made of common words is stronger than P@ssw0rd!'",
                          discussion: [
                            "If a website you use is breached, what is the first account you would change a password on, and why?",
                            "Why might someone reuse passwords even though they know it's risky? What would make MFA easier to adopt?",
                            "Which is more important to protect: your email account or your social media account? Defend your choice."
                          ],
                          standard: "ISTE Standards for Students 2: Digital Citizen"
                        },
                        {
                          id: "phishing-9-12",
                          title: "Phishing and Misinformation",
                          grade: "Grades 9 to 12",
                          duration: "45 minutes",
                          color: "bg-rose-500",
                          icon: AlertTriangle,
                          objective: "Students will identify five phishing red flags, explain how AI-generated content makes detection harder, and apply a verification checklist to three real-world examples.",
                          materials: "Projector, printed handouts of five phishing emails (sanitized), the SIFT method one-pager.",
                          flow: [
                            "Hook (5 min): Show two emails side by side, one real and one phishing. Vote anonymously which is which, then reveal.",
                            "Direct teach (10 min): The five red flags (urgency, mismatched sender, unusual link, request for credentials or money, generic greeting) plus the SIFT method (Stop, Investigate the source, Find better coverage, Trace claims).",
                            "Practice (20 min): In small groups, students apply the checklist to three live examples and rate confidence.",
                            "Reflect (10 min): Each student writes the rule they'll teach a family member tonight."
                          ],
                          assessment: "Performance task: students score a fourth example on the checklist and justify their rating in 3 sentences.",
                          discussion: [
                            "How does AI-generated text and imagery change the way you evaluate whether a message or article is real?",
                            "Have you ever almost fallen for a phishing message? What red flag did you eventually notice?",
                            "Whose responsibility is it to slow the spread of misinformation: platforms, governments, or individuals? Defend your view."
                          ],
                          standard: "ISTE Standards for Students 2: Digital Citizen"
                        }
                      ].map((l) => (
                        <Card key={l.id} className="border-2 hover:shadow-lg transition-shadow flex flex-col" data-testid={`lesson-card-${l.id}`}>
                          <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-10 h-10 rounded-lg ${l.color} flex items-center justify-center flex-shrink-0`}>
                                <l.icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-base leading-tight">{l.title}</CardTitle>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">{l.grade}</Badge>
                                  <Badge variant="outline" className="text-xs"><CalendarDays className="w-3 h-3 mr-1" />{l.duration}</Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm flex-1">
                            <div>
                              <p className="font-semibold text-foreground mb-1">Objective</p>
                              <p className="text-muted-foreground">{l.objective}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground mb-1">Materials</p>
                              <p className="text-muted-foreground">{l.materials}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground mb-1">Lesson Flow</p>
                              <ul className="space-y-1 text-muted-foreground list-disc list-inside marker:text-primary">
                                {l.flow.map((step, i) => <li key={i}>{step}</li>)}
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground mb-1">Assessment</p>
                              <p className="text-muted-foreground">{l.assessment}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground mb-1">Discussion Questions</p>
                              <ul className="space-y-1 text-muted-foreground list-disc list-inside marker:text-primary" data-testid={`list-discussion-${l.id}`}>
                                {l.discussion.map((q, i) => <li key={i}>{q}</li>)}
                              </ul>
                            </div>
                            <div className="pt-2 border-t border-border">
                              <p className="text-xs text-primary font-medium">Aligned to: {l.standard}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>

                  <section>
                    <Card className="border-2 border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg">
                            <Presentation className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl">Request a Free School Presentation</CardTitle>
                            <CardDescription className="text-base">
                              We offer free virtual and in-person sessions for K to 12 schools and public libraries. Pick a grade range and a format and we'll follow up.
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <SchoolPresentationForm />
                      </CardContent>
                    </Card>
                  </section>

                  <section>
                    <Card className="border-2">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg">
                            <School className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl">For School Administrators</CardTitle>
                            <CardDescription className="text-base">
                              How GetCyberRight handles student data, COPPA, and FERPA when our materials are used in your classrooms.
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-5 text-sm leading-relaxed">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Our materials are designed to be used without student accounts</h4>
                          <p className="text-muted-foreground">
                            All lesson plans, activities, and printable handouts on this site can be downloaded and used offline. No login is required for any student-facing content. Students do not need to create accounts on getcyberright.com to participate in any of our lessons.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">COPPA (Children's Online Privacy Protection Act)</h4>
                          <p className="text-muted-foreground">
                            Because we do not collect personal information from children under 13 through our website, COPPA verifiable parental consent is not triggered by classroom use of our printable resources. If you embed any third-party tool referenced in our lessons, follow that vendor's COPPA process separately.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">FERPA (Family Educational Rights and Privacy Act)</h4>
                          <p className="text-muted-foreground">
                            We are not a school official under FERPA and we do not receive student education records. Teachers retain full control of any student work generated during our lessons. Do not submit student names, IDs, or work samples through our contact forms.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">What we collect from educators</h4>
                          <p className="text-muted-foreground">
                            When an educator submits a presentation request or contact form, we store the educator's name, email, and message so we can respond. We do not sell or share that information. Adult contact data is retained for 24 months and then deleted.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Questions or formal review</h4>
                          <p className="text-muted-foreground">
                            District administrators reviewing our resources for board approval can email <span className="text-foreground font-medium">privacy@getcyberright.com</span>. We are happy to provide a one-page privacy summary on letterhead.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </section>
                </div>

                <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Integrate Into Your Curriculum</p>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400">
                        These resources are designed to be flexible. Adapt activities to fit your classroom needs and students' developmental levels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
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
