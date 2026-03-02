import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BookOpen, Search, Filter, Hash } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { SEOHead } from "@/components/seo-head";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  acronym?: string;
  relatedTerms: string[];
  examples?: string[];
  difficulty: "basic" | "intermediate" | "advanced";
}

const glossaryTerms: GlossaryTerm[] = [
  {
    id: "aes",
    term: "Advanced Encryption Standard",
    definition: "A symmetric encryption algorithm established by NIST as a U.S. Federal Information Processing Standard. AES is widely used to encrypt sensitive data and is considered secure for most applications.",
    category: "Cryptography",
    acronym: "AES",
    relatedTerms: ["Encryption", "Symmetric Cryptography", "Block Cipher"],
    examples: ["File encryption", "VPN tunnels", "WiFi WPA2/WPA3"],
    difficulty: "intermediate"
  },
  {
    id: "apt",
    term: "Advanced Persistent Threat",
    definition: "A prolonged and targeted cyber attack where an intruder gains access to a network and remains undetected for an extended period, typically to steal data rather than cause damage.",
    category: "Threats",
    acronym: "APT",
    relatedTerms: ["Threat Actor", "Lateral Movement", "Reconnaissance"],
    examples: ["Nation-state attacks", "Corporate espionage", "Long-term data exfiltration"],
    difficulty: "advanced"
  },
  {
    id: "api",
    term: "Application Programming Interface",
    definition: "A set of protocols, routines, and tools for building software applications. APIs specify how software components should interact and are often targets for security attacks.",
    category: "Technology",
    acronym: "API",
    relatedTerms: ["REST", "Authentication", "Web Services"],
    examples: ["RESTful services", "OAuth authentication", "GraphQL endpoints"],
    difficulty: "basic"
  },
  {
    id: "ddos",
    term: "Distributed Denial of Service",
    definition: "A cyber attack that attempts to make an online service unavailable by overwhelming it with traffic from multiple sources, typically using a botnet.",
    category: "Attacks",
    acronym: "DDoS",
    relatedTerms: ["DoS", "Botnet", "Traffic Flooding"],
    examples: ["Website takedowns", "Server overload attacks", "Network saturation"],
    difficulty: "intermediate"
  },
  {
    id: "firewall",
    term: "Firewall",
    definition: "A network security device that monitors and filters incoming and outgoing network traffic based on predetermined security rules. It establishes a barrier between trusted and untrusted networks.",
    category: "Network Security",
    relatedTerms: ["Network Security", "Access Control", "Packet Filtering"],
    examples: ["Hardware firewalls", "Software firewalls", "Next-generation firewalls"],
    difficulty: "basic"
  },
  {
    id: "iam",
    term: "Identity and Access Management",
    definition: "A framework of policies and technologies ensuring that the right people have appropriate access to technology resources at the right times for the right reasons.",
    category: "Access Control",
    acronym: "IAM",
    relatedTerms: ["Authentication", "Authorization", "Single Sign-On"],
    examples: ["Active Directory", "OAuth", "Multi-factor authentication"],
    difficulty: "intermediate"
  },
  {
    id: "malware",
    term: "Malicious Software",
    definition: "Software specifically designed to disrupt, damage, or gain unauthorized access to computer systems. Includes viruses, worms, trojans, ransomware, and spyware.",
    category: "Threats",
    relatedTerms: ["Virus", "Trojan", "Ransomware", "Spyware"],
    examples: ["Computer viruses", "Banking trojans", "Cryptocurrency miners"],
    difficulty: "basic"
  },
  {
    id: "penetration-testing",
    term: "Penetration Testing",
    definition: "A simulated cyber attack against a computer system to check for exploitable vulnerabilities. Also known as pen testing or white hat hacking.",
    category: "Testing",
    relatedTerms: ["Vulnerability Assessment", "Ethical Hacking", "Red Team"],
    examples: ["Web application testing", "Network penetration testing", "Social engineering tests"],
    difficulty: "advanced"
  },
  {
    id: "phishing",
    term: "Phishing",
    definition: "A cyber attack that uses fraudulent emails, websites, or messages to trick individuals into revealing sensitive information such as passwords, credit card numbers, or personal data.",
    category: "Social Engineering",
    relatedTerms: ["Social Engineering", "Spear Phishing", "Email Security"],
    examples: ["Fake bank emails", "Malicious links", "Credential harvesting"],
    difficulty: "basic"
  },
  {
    id: "pki",
    term: "Public Key Infrastructure",
    definition: "A framework that manages digital keys and certificates, enabling secure communication and authentication in computer networks through asymmetric cryptography.",
    category: "Cryptography",
    acronym: "PKI",
    relatedTerms: ["Digital Certificates", "Certificate Authority", "Asymmetric Encryption"],
    examples: ["SSL/TLS certificates", "Code signing", "Email encryption"],
    difficulty: "advanced"
  },
  {
    id: "ransomware",
    term: "Ransomware",
    definition: "A type of malicious software designed to block access to a computer system or encrypt files until a sum of money is paid to the attacker.",
    category: "Malware",
    relatedTerms: ["Malware", "Encryption", "Extortion"],
    examples: ["WannaCry", "NotPetya", "Locky"],
    difficulty: "intermediate"
  },
  {
    id: "siem",
    term: "Security Information and Event Management",
    definition: "A security management approach that combines security information management and security event management functions into one security solution.",
    category: "Monitoring",
    acronym: "SIEM",
    relatedTerms: ["Log Management", "Incident Response", "Threat Detection"],
    examples: ["Splunk", "IBM QRadar", "ArcSight"],
    difficulty: "advanced"
  },
  {
    id: "sql-injection",
    term: "SQL Injection",
    definition: "A code injection technique used to attack data-driven applications by inserting malicious SQL statements into entry fields for execution.",
    category: "Web Security",
    relatedTerms: ["Code Injection", "Database Security", "Input Validation"],
    examples: ["Login bypass", "Data extraction", "Database manipulation"],
    difficulty: "intermediate"
  },
  {
    id: "ssl-tls",
    term: "Secure Sockets Layer / Transport Layer Security",
    definition: "Cryptographic protocols designed to provide communications security over a computer network. TLS is the successor to SSL and provides secure communication channels.",
    category: "Cryptography",
    acronym: "SSL/TLS",
    relatedTerms: ["Encryption", "Digital Certificates", "HTTPS"],
    examples: ["HTTPS websites", "Email encryption", "VPN protocols"],
    difficulty: "intermediate"
  },
  {
    id: "vulnerability",
    term: "Vulnerability",
    definition: "A weakness in a system, application, or network that could be exploited by attackers to gain unauthorized access or cause damage to the system.",
    category: "Risk Management",
    relatedTerms: ["Threat", "Risk", "Exploit", "Patch"],
    examples: ["Software bugs", "Misconfigurations", "Weak passwords"],
    difficulty: "basic"
  },
  {
    id: "zero-day",
    term: "Zero-Day",
    definition: "A computer software vulnerability that is unknown to security vendors and for which no patch or fix has been released. Zero-day exploits target these vulnerabilities.",
    category: "Vulnerabilities",
    relatedTerms: ["Vulnerability", "Exploit", "Patch Management"],
    examples: ["Undiscovered software flaws", "Advanced persistent threats", "Targeted attacks"],
    difficulty: "advanced"
  }
];

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [letterFilter, setLetterFilter] = useState("all");

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.relatedTerms.some(related => related.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || term.category === categoryFilter;
    const matchesLetter = letterFilter === "all" || term.term.toLowerCase().startsWith(letterFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLetter;
  });

  const categories = Array.from(new Set(glossaryTerms.map(term => term.category)));
  const letters = Array.from(new Set(glossaryTerms.map(term => term.term.charAt(0).toUpperCase()))).sort();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        page="glossary"
        title="Cybersecurity Glossary - Terms Explained Simply | GetCyberRight"
        description="Plain-language cybersecurity glossary. Learn what phishing, malware, VPN, encryption, and other security terms mean in simple, everyday language."
        keywords="cybersecurity glossary, security terms explained, what is phishing, malware definition, VPN meaning, cybersecurity dictionary"
      />
      <section className="py-12 bg-gradient-to-br from-background to-muted/50">
        <div className="container mx-auto px-4">
          <Link href="/resources" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resources
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex items-start gap-6 mb-6">
              <div className="p-4 bg-primary/10 rounded-lg">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Cybersecurity Glossary</h1>
                <p className="text-xl text-muted-foreground">
                  Comprehensive definitions of cybersecurity terms, acronyms, and concepts for professionals and students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search terms, definitions, or related concepts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={letterFilter} onValueChange={setLetterFilter}>
                  <SelectTrigger className="w-32">
                    <Hash className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Letter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {letters.map(letter => (
                      <SelectItem key={letter} value={letter}>{letter}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredTerms.length} of {glossaryTerms.length} terms
            </div>
          </div>
        </div>
      </section>

      {/* Glossary Terms */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
              {filteredTerms.map((term) => (
                <Card key={term.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">
                          {term.term}
                          {term.acronym && (
                            <span className="ml-2 text-lg font-normal text-muted-foreground">
                              ({term.acronym})
                            </span>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{term.category}</Badge>
                          <Badge variant={term.difficulty === "basic" ? "secondary" : term.difficulty === "intermediate" ? "default" : "destructive"}>
                            {term.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{term.definition}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Related Terms</h4>
                        <div className="flex flex-wrap gap-1">
                          {term.relatedTerms.map((relatedTerm, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {relatedTerm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {term.examples && (
                        <div>
                          <h4 className="font-semibold mb-2">Examples</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {term.examples.map((example, idx) => (
                              <li key={idx}>• {example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Quick Reference</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Browse terms by category for focused learning
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map(category => {
                const termCount = glossaryTerms.filter(term => term.category === category).length;
                return (
                  <Card key={category} className="cursor-pointer hover:shadow-lg transition-shadow" 
                        onClick={() => setCategoryFilter(category)}>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold mb-1">{category}</h3>
                      <p className="text-sm text-muted-foreground">{termCount} terms</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}