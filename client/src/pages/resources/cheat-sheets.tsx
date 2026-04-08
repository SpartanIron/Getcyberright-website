"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, Search, Filter, Download, ExternalLink, Eye, Copy, Star } from "lucide-react";
import { Link } from "@/lib/navigation";
import { useState } from "react";
import { SEOHead } from "@/components/seo-head";

interface CheatSheet {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  format: "PDF" | "HTML" | "Interactive";
  pages: number;
  downloadCount: number;
  rating: number;
  lastUpdated: string;
  topics: string[];
  downloadUrl: string;
  previewUrl?: string;
  author: string;
}

const cheatSheets: CheatSheet[] = [
  {
    id: "nmap-commands",
    title: "Nmap Commands Reference",
    description: "Complete reference guide for Nmap network scanning commands, options, and techniques.",
    category: "Network Security",
    difficulty: "intermediate",
    format: "PDF",
    pages: 4,
    downloadCount: 45000,
    rating: 4.8,
    lastUpdated: "2024-01-15",
    topics: ["Port Scanning", "Service Detection", "OS Fingerprinting", "Script Scanning"],
    downloadUrl: "https://nmap.org/docs/nmap-cheatsheet.pdf",
    previewUrl: "https://nmap.org/docs/nmap-cheatsheet-preview.html",
    author: "Nmap Team"
  },
  {
    id: "linux-commands",
    title: "Linux Security Commands",
    description: "Essential Linux commands for system administration, log analysis, and security operations.",
    category: "System Administration",
    difficulty: "beginner",
    format: "HTML",
    pages: 6,
    downloadCount: 38000,
    rating: 4.7,
    lastUpdated: "2024-01-10",
    topics: ["File Permissions", "Process Management", "Network Tools", "Log Analysis"],
    downloadUrl: "https://linux-security-commands.com/cheatsheet",
    previewUrl: "https://linux-security-commands.com/preview",
    author: "Linux Security Community"
  },
  {
    id: "wireshark-filters",
    title: "Wireshark Display Filters",
    description: "Comprehensive guide to Wireshark display filters for network traffic analysis and forensics.",
    category: "Network Analysis",
    difficulty: "intermediate",
    format: "PDF",
    pages: 8,
    downloadCount: 52000,
    rating: 4.9,
    lastUpdated: "2024-01-20",
    topics: ["Protocol Filters", "Traffic Analysis", "Security Investigation", "Performance Troubleshooting"],
    downloadUrl: "https://wireshark.org/docs/filters-cheatsheet.pdf",
    previewUrl: "https://wireshark.org/docs/filters-preview.html",
    author: "Wireshark Foundation"
  },
  {
    id: "sql-injection",
    title: "SQL Injection Testing Guide",
    description: "Payloads, techniques, and prevention methods for SQL injection testing and remediation.",
    category: "Web Security",
    difficulty: "advanced",
    format: "Interactive",
    pages: 12,
    downloadCount: 29000,
    rating: 4.6,
    lastUpdated: "2024-01-18",
    topics: ["Union-based SQLi", "Blind SQLi", "Time-based SQLi", "Prevention Techniques"],
    downloadUrl: "https://owasp.org/sql-injection-cheatsheet",
    previewUrl: "https://owasp.org/sql-injection-preview",
    author: "OWASP"
  },
  {
    id: "incident-response",
    title: "Incident Response Playbook",
    description: "Step-by-step incident response procedures, checklists, and communication templates.",
    category: "Incident Response",
    difficulty: "intermediate",
    format: "PDF",
    pages: 16,
    downloadCount: 34000,
    rating: 4.8,
    lastUpdated: "2024-01-12",
    topics: ["Detection", "Containment", "Eradication", "Recovery", "Lessons Learned"],
    downloadUrl: "https://nist.gov/incident-response-playbook.pdf",
    previewUrl: "https://nist.gov/incident-response-preview.html",
    author: "NIST"
  },
  {
    id: "powershell-security",
    title: "PowerShell Security Commands",
    description: "PowerShell commands for Windows security administration, forensics, and threat hunting.",
    category: "Windows Security",
    difficulty: "intermediate",
    format: "HTML",
    pages: 10,
    downloadCount: 27000,
    rating: 4.5,
    lastUpdated: "2024-01-08",
    topics: ["Event Log Analysis", "Registry Investigation", "Process Monitoring", "Network Analysis"],
    downloadUrl: "https://powershell-security.com/cheatsheet",
    previewUrl: "https://powershell-security.com/preview",
    author: "PowerShell Security Team"
  },
  {
    id: "burp-suite",
    title: "Burp Suite Web Testing",
    description: "Complete guide to Burp Suite features, shortcuts, and web application testing techniques.",
    category: "Web Security",
    difficulty: "advanced",
    format: "PDF",
    pages: 14,
    downloadCount: 41000,
    rating: 4.7,
    lastUpdated: "2024-01-25",
    topics: ["Proxy Configuration", "Scanner Usage", "Intruder Attacks", "Extensions"],
    downloadUrl: "https://portswigger.net/burp-cheatsheet.pdf",
    previewUrl: "https://portswigger.net/burp-preview.html",
    author: "PortSwigger"
  },
  {
    id: "regex-security",
    title: "Security Regular Expressions",
    description: "Regular expressions for log analysis, threat detection, and security pattern matching.",
    category: "Log Analysis",
    difficulty: "intermediate",
    format: "Interactive",
    pages: 5,
    downloadCount: 22000,
    rating: 4.4,
    lastUpdated: "2024-01-14",
    topics: ["Log Parsing", "Threat Detection", "Data Extraction", "Pattern Matching"],
    downloadUrl: "https://regex-security.com/cheatsheet",
    previewUrl: "https://regex-security.com/preview",
    author: "Security RegEx Community"
  }
];

export default function CheatSheets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const filteredSheets = cheatSheets.filter(sheet => {
    const matchesSearch = sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sheet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sheet.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || sheet.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "all" || sheet.difficulty === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = Array.from(new Set(cheatSheets.map(sheet => sheet.category)));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        page="cheatSheets"
        title="Cybersecurity Cheat Sheets | GetCyberRight"
        description="Download free cybersecurity cheat sheets covering password security, phishing prevention, safe browsing, and more. Quick-reference guides for everyday digital safety."
        keywords="cybersecurity cheat sheets, security quick reference, phishing cheat sheet, password guide, online safety tips"
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
                <FileText className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Cybersecurity Cheat Sheets</h1>
                <p className="text-xl text-muted-foreground">
                  Quick reference guides, command lists, and practical cheat sheets for cybersecurity professionals.
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
                  placeholder="Search cheat sheets, topics, or commands..."
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
                
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredSheets.length} of {cheatSheets.length} cheat sheets
            </div>
          </div>
        </div>
      </section>

      {/* Cheat Sheets Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSheets.map((sheet) => (
                <Card key={sheet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight">{sheet.title}</CardTitle>
                      <Badge variant={sheet.difficulty === "beginner" ? "secondary" : sheet.difficulty === "intermediate" ? "default" : "destructive"}>
                        {sheet.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{sheet.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{sheet.downloadCount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span>{sheet.pages} pages</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4 text-sm">{sheet.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Category & Format</p>
                        <div className="flex gap-2">
                          <Badge variant="outline">{sheet.category}</Badge>
                          <Badge variant="secondary">{sheet.format}</Badge>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Topics Covered</p>
                        <div className="flex flex-wrap gap-1">
                          {sheet.topics.slice(0, 3).map((topic, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {sheet.topics.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{sheet.topics.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <p><strong>Author:</strong> {sheet.author}</p>
                        <p><strong>Updated:</strong> {new Date(sheet.lastUpdated).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t space-y-2">
                      <Button className="w-full" asChild>
                        <a href={sheet.downloadUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Download {sheet.format}
                        </a>
                      </Button>
                      {sheet.previewUrl && (
                        <Button variant="outline" className="w-full" asChild>
                          <a href={sheet.previewUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Featured Collections</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Curated collections of cheat sheets for specific cybersecurity domains
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Penetration Testing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Essential references for ethical hacking and security testing
                  </p>
                  <div className="text-left space-y-2 text-sm">
                    <div>• Nmap Commands</div>
                    <div>• Burp Suite Guide</div>
                    <div>• SQL Injection Payloads</div>
                    <div>• Metasploit Commands</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Incident Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Quick references for security incident handling
                  </p>
                  <div className="text-left space-y-2 text-sm">
                    <div>• Response Playbooks</div>
                    <div>• Forensics Commands</div>
                    <div>• Log Analysis Regex</div>
                    <div>• Communication Templates</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Administration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Security-focused system administration references
                  </p>
                  <div className="text-left space-y-2 text-sm">
                    <div>• Linux Security Commands</div>
                    <div>• PowerShell Security</div>
                    <div>• Network Tools</div>
                    <div>• Configuration Hardening</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}