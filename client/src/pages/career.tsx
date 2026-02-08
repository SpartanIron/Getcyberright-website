import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, TrendingUp, DollarSign, Search, 
  Shield, Code, Brain, Users, Eye, Wrench, BookOpen, Target,
  Award, ChevronRight, Building, Zap, Lock, AlertTriangle
} from "lucide-react";

interface CyberRole {
  id: string;
  title: string;
  category: "technical" | "management" | "governance" | "specialized";
  level: "entry" | "mid" | "senior" | "executive";
  salary: string;
  growth: "High" | "Very High" | "Excellent";
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  certifications: string[];
  learningPath: string;
  workEnvironment: string[];
  careerProgression: string[];
}

export default function Career() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const cyberRoles: CyberRole[] = [
    {
      id: "security-analyst",
      title: "Security Analyst",
      category: "technical",
      level: "entry",
      salary: "$50,000 - $80,000",
      growth: "Very High",
      description: "Monitor security systems, analyze threats, and respond to security incidents in real-time.",
      responsibilities: [
        "Monitor security information and event management (SIEM) systems",
        "Investigate security alerts and potential threats",
        "Perform initial incident response and escalation",
        "Maintain security documentation and reports",
        "Assist with vulnerability assessments"
      ],
      requirements: ["Bachelor's degree in IT or related field", "Security+ certification", "0-2 years experience"],
      skills: ["SIEM tools", "Network security", "Incident response", "Log analysis", "Security awareness"],
      certifications: ["CompTIA Security+", "CompTIA Network+", "(ISC)² SSCP"],
      learningPath: "Security Fundamentals",
      workEnvironment: ["SOC", "Corporate IT", "MSP", "Government"],
      careerProgression: ["Senior Security Analyst", "Incident Response Specialist", "Security Engineer"]
    },
    {
      id: "penetration-tester",
      title: "Penetration Tester",
      category: "technical",
      level: "mid",
      salary: "$75,000 - $120,000",
      growth: "Excellent",
      description: "Simulate cyber attacks to identify vulnerabilities and security weaknesses in systems and applications.",
      responsibilities: [
        "Conduct penetration testing on networks, applications, and systems",
        "Develop and execute testing methodologies",
        "Document findings and provide remediation recommendations",
        "Stay current with attack techniques and tools",
        "Present findings to technical and business stakeholders"
      ],
      requirements: ["Bachelor's degree preferred", "CEH or OSCP certification", "3-5 years security experience"],
      skills: ["Penetration testing", "Vulnerability assessment", "Scripting", "Network protocols", "Web application security"],
      certifications: ["CEH", "OSCP", "GPEN", "CISSP"],
      learningPath: "Advanced Techniques",
      workEnvironment: ["Consulting", "Red Team", "Financial Services", "Healthcare"],
      careerProgression: ["Senior Penetration Tester", "Security Consultant", "Red Team Lead"]
    },
    {
      id: "incident-responder",
      title: "Incident Response Specialist",
      category: "technical",
      level: "mid",
      salary: "$70,000 - $110,000",
      growth: "Very High",
      description: "Lead response efforts during security incidents, coordinate containment, and oversee recovery operations.",
      responsibilities: [
        "Lead incident response activities during security breaches",
        "Coordinate cross-functional response teams",
        "Perform digital forensics and malware analysis",
        "Develop incident response procedures and playbooks",
        "Conduct post-incident reviews and lessons learned"
      ],
      requirements: ["Bachelor's degree", "GCIH or similar certification", "3-5 years security experience"],
      skills: ["Digital forensics", "Malware analysis", "Incident coordination", "Crisis management", "Communication"],
      certifications: ["GCIH", "GCFA", "GNFA", "CISSP"],
      learningPath: "Advanced Techniques",
      workEnvironment: ["Enterprise SOC", "CSIRT", "Government", "Consulting"],
      careerProgression: ["Senior IR Specialist", "IR Manager", "CISO"]
    },
    {
      id: "security-engineer",
      title: "Security Engineer",
      category: "technical",
      level: "mid",
      salary: "$80,000 - $130,000",
      growth: "Very High",
      description: "Design, implement, and maintain security technologies and infrastructure to protect organizational assets.",
      responsibilities: [
        "Design and implement security architectures",
        "Configure and maintain security tools and technologies",
        "Automate security processes and workflows",
        "Integrate security into development and operations",
        "Conduct security assessments and reviews"
      ],
      requirements: ["Bachelor's degree in Engineering or IT", "3-5 years experience", "Programming skills"],
      skills: ["Security architecture", "Programming", "Cloud security", "DevSecOps", "Automation"],
      certifications: ["CISSP", "CCSP", "AWS Security", "SABSA"],
      learningPath: "Practical Implementation",
      workEnvironment: ["Technology companies", "Cloud providers", "Financial services", "DevOps teams"],
      careerProgression: ["Senior Security Engineer", "Security Architect", "Principal Engineer"]
    },
    {
      id: "security-architect",
      title: "Security Architect",
      category: "technical",
      level: "senior",
      salary: "$120,000 - $180,000",
      growth: "High",
      description: "Design enterprise security architectures and provide strategic guidance on security technologies.",
      responsibilities: [
        "Develop enterprise security architecture strategies",
        "Review and approve security designs for projects",
        "Define security standards and guidelines",
        "Evaluate and select security technologies",
        "Mentor junior security professionals"
      ],
      requirements: ["Bachelor's/Master's degree", "CISSP or SABSA", "7+ years experience"],
      skills: ["Enterprise architecture", "Security frameworks", "Risk assessment", "Technology evaluation", "Leadership"],
      certifications: ["CISSP", "SABSA", "TOGAF", "Cloud certifications"],
      learningPath: "Advanced Techniques",
      workEnvironment: ["Large enterprises", "Consulting", "Government", "Technology vendors"],
      careerProgression: ["Principal Architect", "Chief Architect", "CISO"]
    },
    {
      id: "threat-hunter",
      title: "Threat Hunter",
      category: "specialized",
      level: "mid",
      salary: "$85,000 - $140,000",
      growth: "Excellent",
      description: "Proactively search for advanced threats and sophisticated attacks that evade traditional security controls.",
      responsibilities: [
        "Develop and execute threat hunting strategies",
        "Analyze network traffic and system logs for anomalies",
        "Create custom detection rules and signatures",
        "Research emerging threats and attack techniques",
        "Collaborate with intelligence and response teams"
      ],
      requirements: ["Bachelor's degree", "Advanced security certifications", "5+ years experience"],
      skills: ["Threat hunting", "Data analysis", "MITRE ATT&CK", "Python/scripting", "Threat intelligence"],
      certifications: ["GCTI", "GCFA", "GNFA", "CISSP"],
      learningPath: "Advanced Techniques",
      workEnvironment: ["Advanced SOC", "Government", "Critical infrastructure", "Research"],
      careerProgression: ["Senior Threat Hunter", "Threat Intelligence Lead", "Security Research"]
    },
    {
      id: "compliance-analyst",
      title: "Compliance Analyst",
      category: "governance",
      level: "entry",
      salary: "$55,000 - $85,000",
      growth: "High",
      description: "Ensure organizational compliance with regulatory requirements and security frameworks.",
      responsibilities: [
        "Monitor compliance with regulatory requirements",
        "Conduct compliance assessments and audits",
        "Develop policies and procedures",
        "Coordinate with auditors and regulators",
        "Track compliance metrics and reporting"
      ],
      requirements: ["Bachelor's degree", "Understanding of regulations", "1-3 years experience"],
      skills: ["Regulatory frameworks", "Policy development", "Risk assessment", "Documentation", "Communication"],
      certifications: ["CISA", "CIA", "CRISC", "CISSP"],
      learningPath: "Security Fundamentals",
      workEnvironment: ["Financial services", "Healthcare", "Government", "Consulting"],
      careerProgression: ["Senior Compliance Analyst", "Compliance Manager", "Chief Compliance Officer"]
    },
    {
      id: "risk-analyst",
      title: "Risk Analyst",
      category: "governance",
      level: "mid",
      salary: "$70,000 - $110,000",
      growth: "High",
      description: "Assess and quantify cybersecurity risks to support business decision-making and risk management.",
      responsibilities: [
        "Conduct cybersecurity risk assessments",
        "Quantify and prioritize security risks",
        "Develop risk mitigation strategies",
        "Monitor risk metrics and KPIs",
        "Report risk status to leadership"
      ],
      requirements: ["Bachelor's degree", "Risk management experience", "3-5 years experience"],
      skills: ["Risk assessment", "Quantitative analysis", "Business acumen", "Communication", "Frameworks"],
      certifications: ["CRISC", "CISA", "CISSP", "FRM"],
      learningPath: "Practical Implementation",
      workEnvironment: ["Financial services", "Insurance", "Consulting", "Large enterprises"],
      careerProgression: ["Senior Risk Analyst", "Risk Manager", "Chief Risk Officer"]
    },
    {
      id: "security-consultant",
      title: "Security Consultant",
      category: "specialized",
      level: "senior",
      salary: "$90,000 - $150,000",
      growth: "High",
      description: "Provide expert cybersecurity advice and solutions to organizations across various industries.",
      responsibilities: [
        "Assess client security postures and needs",
        "Design and recommend security solutions",
        "Lead security implementation projects",
        "Provide thought leadership and expertise",
        "Build long-term client relationships"
      ],
      requirements: ["Bachelor's degree", "Multiple certifications", "7+ years experience"],
      skills: ["Consulting", "Project management", "Technical expertise", "Business development", "Communication"],
      certifications: ["CISSP", "CISM", "Multiple vendor certifications"],
      learningPath: "Advanced Techniques",
      workEnvironment: ["Consulting firms", "Independent", "System integrators", "Vendor partners"],
      careerProgression: ["Principal Consultant", "Practice Lead", "Partner"]
    },
    {
      id: "ciso",
      title: "Chief Information Security Officer (CISO)",
      category: "management",
      level: "executive",
      salary: "$180,000 - $350,000",
      growth: "High",
      description: "Lead organizational cybersecurity strategy, manage security programs, and represent security to executive leadership.",
      responsibilities: [
        "Develop and execute cybersecurity strategy",
        "Manage security budgets and resources",
        "Report to board and executive leadership",
        "Build and lead security teams",
        "Oversee incident response and crisis management"
      ],
      requirements: ["Bachelor's/Master's degree", "CISSP or CISM", "10+ years experience"],
      skills: ["Executive leadership", "Strategic planning", "Risk management", "Budget management", "Communication"],
      certifications: ["CISSP", "CISM", "MBA preferred"],
      learningPath: "Advanced Techniques",
      workEnvironment: ["Large enterprises", "Government", "Financial services", "Healthcare"],
      careerProgression: ["CTO", "CEO", "Board positions"]
    }
  ];

  const filteredRoles = cyberRoles.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || role.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || role.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categories = [
    { id: "all", label: "All Roles", icon: <Briefcase className="h-4 w-4" /> },
    { id: "technical", label: "Technical", icon: <Code className="h-4 w-4" /> },
    { id: "management", label: "Management", icon: <Users className="h-4 w-4" /> },
    { id: "governance", label: "Governance", icon: <Shield className="h-4 w-4" /> },
    { id: "specialized", label: "Specialized", icon: <Target className="h-4 w-4" /> }
  ];

  const levels = [
    { id: "all", label: "All Levels" },
    { id: "entry", label: "Entry Level" },
    { id: "mid", label: "Mid Level" },
    { id: "senior", label: "Senior Level" },
    { id: "executive", label: "Executive" }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "management":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "governance":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "specialized":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "entry":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "mid":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "senior":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "executive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Cybersecurity Career Framework</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Explore the complete cybersecurity workforce landscape with detailed role descriptions, 
            career progression paths, and direct connections to our learning hub for targeted skill development.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Input
              type="text"
              placeholder="Search roles by title, skills, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium">Category:</span>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-1"
                >
                  {category.icon}
                  <span>{category.label}</span>
                </Button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium">Level:</span>
              {levels.map((level) => (
                <Button
                  key={level.id}
                  variant={selectedLevel === level.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level.id)}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {filteredRoles.map((role) => (
            <Card key={role.id} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{role.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={getCategoryColor(role.category)} variant="secondary">
                        {role.category.charAt(0).toUpperCase() + role.category.slice(1)}
                      </Badge>
                      <Badge className={getLevelColor(role.level)} variant="secondary">
                        {role.level.charAt(0).toUpperCase() + role.level.slice(1)} Level
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">{role.salary}</div>
                    <div className="text-sm text-muted-foreground">Growth: {role.growth}</div>
                  </div>
                </div>
                <p className="text-muted-foreground">{role.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Key Responsibilities */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Key Responsibilities
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {role.responsibilities.slice(0, 3).map((resp, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {resp}
                      </li>
                    ))}
                    {role.responsibilities.length > 3 && (
                      <li className="text-xs text-muted-foreground ml-4">
                        +{role.responsibilities.length - 3} more responsibilities
                      </li>
                    )}
                  </ul>
                </div>

                {/* Skills & Certifications */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      Core Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {role.skills.slice(0, 4).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {role.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Certifications
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {role.certifications.slice(0, 3).map((cert, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                      {role.certifications.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.certifications.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Learning Path Connection */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Recommended Learning Path
                  </h4>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-[var(--cyber-blue)] text-white">
                      {role.learningPath}
                    </Badge>
                    <Button size="sm" variant="ghost" className="text-[var(--cyber-blue)]">
                      View Training
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Career Progression */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Career Progression
                  </h4>
                  <div className="flex items-center space-x-2 text-sm">
                    {role.careerProgression.slice(0, 2).map((next, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="text-muted-foreground">{next}</span>
                        {idx < Math.min(role.careerProgression.length - 1, 1) && (
                          <ChevronRight className="h-3 w-3 mx-1 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry Statistics */}
        <Card className="cyber-gradient text-white mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Cybersecurity Workforce Insights</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">3.5M</div>
                <div className="text-blue-100">Global Job Gap</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">0.9%</div>
                <div className="text-blue-100">Unemployment Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">$103K</div>
                <div className="text-blue-100">Average Salary</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">22%</div>
                <div className="text-blue-100">Annual Growth Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Hub Integration */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Connect Your Career Goals with Learning</CardTitle>
            <p className="text-muted-foreground text-center">
              Every role has a clear path through our structured learning hub
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold mb-2">Security Fundamentals</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Entry-level roles like Security Analyst and Compliance Analyst
                </p>
                <Button variant="outline" size="sm">View Path</Button>
              </Card>
              
              <Card className="text-center p-6">
                <Code className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold mb-2">Practical Implementation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Mid-level roles like Security Engineer and Risk Analyst
                </p>
                <Button variant="outline" size="sm">View Path</Button>
              </Card>
              
              <Card className="text-center p-6">
                <Brain className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold mb-2">Advanced Techniques</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Senior roles like CISO, Threat Hunter, and Security Architect
                </p>
                <Button variant="outline" size="sm">View Path</Button>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Launch Your Cybersecurity Career?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Choose your target role and follow our proven learning paths to build the skills and certifications needed for success.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-[var(--cyber-blue)] hover:bg-[var(--cyber-blue-dark)]">
              Explore Learning Hub
            </Button>
            <Button size="lg" variant="outline">
              Download Career Guide
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}