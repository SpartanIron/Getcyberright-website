import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  Shield, 
  Network, 
  Search, 
  Users, 
  Building, 
  Gavel, 
  Cloud, 
  Code, 
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  BookOpen,
  Award,
  Target,
  Globe,
  Lock,
  Eye,
  Zap
} from "lucide-react";

// Define cybersecurity domains and career paths
const cyberSecurityDomains = [
  {
    id: "security-analyst",
    title: "Security Analyst",
    icon: Shield,
    description: "Monitor and analyze security threats, investigate incidents",
    entryLevel: "SOC Analyst I",
    midLevel: "Senior Security Analyst",
    seniorLevel: "Security Manager",
    avgSalary: "$75,000 - $120,000",
    jobGrowth: "32%",
    skills: ["SIEM Tools", "Incident Response", "Threat Analysis", "Log Analysis"],
    certifications: ["Security+", "CySA+", "GCIH", "GSEC"],
    timeToEntry: "6-12 months"
  },
  {
    id: "penetration-tester",
    title: "Penetration Tester",
    icon: Search,
    description: "Ethical hacking to identify vulnerabilities in systems",
    entryLevel: "Junior Penetration Tester",
    midLevel: "Senior Penetration Tester",
    seniorLevel: "Lead Security Consultant",
    avgSalary: "$85,000 - $150,000",
    jobGrowth: "28%",
    skills: ["Ethical Hacking", "Vulnerability Assessment", "Network Security", "Web Application Security"],
    certifications: ["CEH", "OSCP", "GPEN", "CISSP"],
    timeToEntry: "12-18 months"
  },
  {
    id: "incident-response",
    title: "Incident Response Specialist",
    icon: Zap,
    description: "Respond to and investigate cybersecurity incidents",
    entryLevel: "Incident Response Analyst",
    midLevel: "Senior IR Specialist",
    seniorLevel: "IR Manager",
    avgSalary: "$80,000 - $130,000",
    jobGrowth: "35%",
    skills: ["Digital Forensics", "Malware Analysis", "Incident Handling", "Crisis Management"],
    certifications: ["GCIH", "GCFA", "GNFA", "CISSP"],
    timeToEntry: "9-15 months"
  },
  {
    id: "cloud-security",
    title: "Cloud Security Engineer",
    icon: Cloud,
    description: "Secure cloud infrastructure and services",
    entryLevel: "Cloud Security Analyst",
    midLevel: "Cloud Security Engineer",
    seniorLevel: "Cloud Security Architect",
    avgSalary: "$90,000 - $160,000",
    jobGrowth: "40%",
    skills: ["AWS/Azure/GCP Security", "Container Security", "DevSecOps", "IAM"],
    certifications: ["AWS Security", "Azure Security", "CCSP", "CISSP"],
    timeToEntry: "12-24 months"
  },
  {
    id: "governance-risk",
    title: "Governance, Risk & Compliance",
    icon: Gavel,
    description: "Manage security policies, risk assessment, and compliance",
    entryLevel: "GRC Analyst",
    midLevel: "Risk Manager",
    seniorLevel: "Chief Risk Officer",
    avgSalary: "$70,000 - $140,000",
    jobGrowth: "25%",
    skills: ["Risk Assessment", "Policy Development", "Compliance Management", "Audit"],
    certifications: ["CISSP", "CISA", "CRISC", "ISO 27001"],
    timeToEntry: "6-12 months"
  },
  {
    id: "security-architecture",
    title: "Security Architect",
    icon: Building,
    description: "Design and implement security architecture and solutions",
    entryLevel: "Security Engineer",
    midLevel: "Senior Security Engineer",
    seniorLevel: "Chief Security Architect",
    avgSalary: "$110,000 - $180,000",
    jobGrowth: "30%",
    skills: ["Security Design", "Enterprise Architecture", "Security Frameworks", "Technology Strategy"],
    certifications: ["CISSP", "SABSA", "TOGAF", "CISSP"],
    timeToEntry: "18-36 months"
  }
];

const learningPaths = {
  beginner: {
    title: "Foundation Level (0-6 months)",
    description: "Build fundamental cybersecurity knowledge",
    modules: [
      {
        title: "Cybersecurity Fundamentals",
        duration: "4-6 weeks",
        topics: ["CIA Triad", "Security Principles", "Common Threats", "Basic Networking"],
        resources: ["CompTIA Security+ Course", "SANS Cyber Aces", "Cybrary Free Courses"]
      },
      {
        title: "Network Security Basics",
        duration: "3-4 weeks",
        topics: ["OSI Model", "TCP/IP", "Firewalls", "VPNs", "Network Protocols"],
        resources: ["Network+ Training", "Wireshark Tutorials", "Packet Analysis"]
      },
      {
        title: "Operating Systems Security",
        duration: "4-5 weeks",
        topics: ["Windows Security", "Linux Security", "Access Controls", "User Management"],
        resources: ["Linux Essentials", "Windows Server Security", "PowerShell Security"]
      },
      {
        title: "Risk Management Basics",
        duration: "2-3 weeks",
        topics: ["Risk Assessment", "Threat Modeling", "Vulnerability Management"],
        resources: ["NIST Framework", "ISO 27001 Basics", "Risk Assessment Tools"]
      }
    ]
  },
  intermediate: {
    title: "Practitioner Level (6-18 months)",
    description: "Develop hands-on security skills and specialization",
    modules: [
      {
        title: "Security Tools & Technologies",
        duration: "6-8 weeks",
        topics: ["SIEM Platforms", "Vulnerability Scanners", "IDS/IPS", "Security Automation"],
        resources: ["Splunk Fundamentals", "Nessus Training", "Snort Configuration"]
      },
      {
        title: "Incident Response & Forensics",
        duration: "8-10 weeks",
        topics: ["IR Procedures", "Digital Forensics", "Malware Analysis", "Evidence Handling"],
        resources: ["SANS FOR508", "Volatility Training", "Autopsy Forensics"]
      },
      {
        title: "Penetration Testing",
        duration: "10-12 weeks",
        topics: ["Ethical Hacking", "Web App Testing", "Network Penetration", "Reporting"],
        resources: ["Kali Linux", "Metasploit", "OWASP Testing Guide", "HackTheBox"]
      },
      {
        title: "Cloud Security",
        duration: "6-8 weeks",
        topics: ["AWS Security", "Azure Security", "Container Security", "DevSecOps"],
        resources: ["AWS Security Specialty", "Azure Security Center", "Docker Security"]
      }
    ]
  },
  advanced: {
    title: "Expert Level (18+ months)",
    description: "Master advanced concepts and leadership skills",
    modules: [
      {
        title: "Advanced Threat Hunting",
        duration: "8-10 weeks",
        topics: ["Threat Intelligence", "Advanced Persistent Threats", "Behavioral Analysis"],
        resources: ["SANS FOR572", "MITRE ATT&CK", "Threat Hunting Platforms"]
      },
      {
        title: "Security Architecture & Design",
        duration: "10-12 weeks",
        topics: ["Zero Trust", "Security Frameworks", "Enterprise Architecture"],
        resources: ["SABSA", "TOGAF Security", "Zero Trust Architecture"]
      },
      {
        title: "Leadership & Management",
        duration: "6-8 weeks",
        topics: ["Security Program Management", "Team Leadership", "Business Alignment"],
        resources: ["CISSP Management", "Security Leadership", "Business Continuity"]
      },
      {
        title: "Emerging Technologies",
        duration: "8-10 weeks",
        topics: ["AI/ML Security", "IoT Security", "Quantum Cryptography", "Blockchain Security"],
        resources: ["AI Security Research", "IoT Security Framework", "Quantum Computing"]
      }
    ]
  }
};

const certificationRoadmap = [
  {
    level: "Entry Level",
    certs: [
      { name: "CompTIA Security+", cost: "$370", difficulty: "Beginner", time: "2-3 months" },
      { name: "CompTIA Network+", cost: "$358", difficulty: "Beginner", time: "2-3 months" },
      { name: "(ISC)² Systems Security Certified Practitioner (SSCP)", cost: "$249", difficulty: "Beginner-Intermediate", time: "3-4 months" }
    ]
  },
  {
    level: "Intermediate",
    certs: [
      { name: "CompTIA CySA+", cost: "$392", difficulty: "Intermediate", time: "3-4 months" },
      { name: "Certified Ethical Hacker (CEH)", cost: "$1,199", difficulty: "Intermediate", time: "4-6 months" },
      { name: "GIAC Security Essentials (GSEC)", cost: "$7,000", difficulty: "Intermediate", time: "4-6 months" }
    ]
  },
  {
    level: "Advanced",
    certs: [
      { name: "Certified Information Systems Security Professional (CISSP)", cost: "$749", difficulty: "Advanced", time: "6-12 months" },
      { name: "Certified Information Security Manager (CISM)", cost: "$760", difficulty: "Advanced", time: "6-8 months" },
      { name: "Certified Information Systems Auditor (CISA)", cost: "$760", difficulty: "Advanced", time: "6-8 months" }
    ]
  }
];

export default function CybersecurityRoadmap() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState("beginner");

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Complete Cybersecurity Career Roadmap
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Navigate your journey from beginner to cybersecurity expert with our comprehensive, industry-validated career roadmap
        </p>
        <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            3.5M Job Openings Globally
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-500" />
            $103K Average Salary
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500" />
            6-18 Months to Entry Level
          </div>
        </div>
      </div>

      {/* Career Domains Overview */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Cybersecurity Domain</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cyberSecurityDomains.map((domain) => {
            const IconComponent = domain.icon;
            return (
              <Card 
                key={domain.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedDomain === domain.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedDomain(selectedDomain === domain.id ? null : domain.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">{domain.title}</CardTitle>
                  </div>
                  <CardDescription>{domain.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Avg. Salary:</span>
                      <span className="text-sm text-green-600 font-semibold">{domain.avgSalary}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Job Growth:</span>
                      <span className="text-sm text-blue-600 font-semibold">{domain.jobGrowth}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Time to Entry:</span>
                      <span className="text-sm text-purple-600 font-semibold">{domain.timeToEntry}</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-2">Key Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {domain.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Selected Domain Details */}
      {selectedDomain && (
        <section className="mb-16">
          {(() => {
            const domain = cyberSecurityDomains.find(d => d.id === selectedDomain);
            if (!domain) return null;
            
            return (
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <domain.icon className="h-8 w-8 text-blue-600" />
                    {domain.title} Career Path
                  </CardTitle>
                  <CardDescription className="text-lg">{domain.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Entry Level</h4>
                      <p className="text-sm">{domain.entryLevel}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Mid Level</h4>
                      <p className="text-sm">{domain.midLevel}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Senior Level</h4>
                      <p className="text-sm">{domain.seniorLevel}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {domain.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Recommended Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {domain.certifications.map((cert) => (
                          <Badge key={cert} variant="secondary">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </section>
      )}

      {/* Learning Path Tabs */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Structured Learning Path</h2>
        <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="beginner">Foundation</TabsTrigger>
            <TabsTrigger value="intermediate">Practitioner</TabsTrigger>
            <TabsTrigger value="advanced">Expert</TabsTrigger>
          </TabsList>
          
          {Object.entries(learningPaths).map(([level, path]) => (
            <TabsContent key={level} value={level} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{path.title}</CardTitle>
                  <CardDescription className="text-lg">{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {path.modules.map((module, index) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{module.title}</CardTitle>
                            <Badge variant="outline">{module.duration}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-semibold mb-2">Topics Covered:</h5>
                              <ul className="text-sm space-y-1">
                                {module.topics.map((topic, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold mb-2">Learning Resources:</h5>
                              <ul className="text-sm space-y-1">
                                {module.resources.map((resource, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <BookOpen className="h-3 w-3 text-blue-500" />
                                    {resource}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Certification Roadmap */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Certification Roadmap</h2>
        <div className="space-y-8">
          {certificationRoadmap.map((level, levelIndex) => (
            <Card key={levelIndex}>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-500" />
                  {level.level} Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {level.certs.map((cert, certIndex) => (
                    <Card key={certIndex} className="border border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{cert.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Cost:</span>
                            <span className="font-medium text-green-600">{cert.cost}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Difficulty:</span>
                            <Badge variant="secondary" className="text-xs">{cert.difficulty}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Study Time:</span>
                            <span className="font-medium">{cert.time}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Cybersecurity Journey?</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Begin with our comprehensive training courses and join thousands of successful cybersecurity professionals
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/resources">
              <BookOpen className="mr-2 h-5 w-5" />
              Start Free Training
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/resources">
              <Target className="mr-2 h-5 w-5" />
              Take Skills Assessment
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/about">
              <TrendingUp className="mr-2 h-5 w-5" />
              About Us
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}