import { Shield, Lock, Server, Eye, FileCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function SecurityPage() {
  const securityMeasures = [
    {
      icon: Shield,
      title: "Security Headers",
      description: "Enterprise-grade HTTP security headers protect against common web vulnerabilities.",
      details: [
        "Content Security Policy (CSP) restricts script and resource loading",
        "HTTP Strict Transport Security (HSTS) enforces HTTPS connections",
        "X-Frame-Options prevents clickjacking attacks",
        "X-Content-Type-Options prevents MIME type sniffing",
      ],
      compliance: ["OWASP ASVS 14.4", "CIS Control 16"],
    },
    {
      icon: Lock,
      title: "CSRF Protection",
      description: "Cross-Site Request Forgery protection validates all form submissions.",
      details: [
        "Origin and Referer header validation on all POST requests",
        "Automatic logging of violation attempts",
        "Protection for contact forms and newsletter signup",
      ],
      compliance: ["OWASP Top 10 A5", "CIS Control 16"],
    },
    {
      icon: Server,
      title: "Rate Limiting",
      description: "Multi-tier rate limiting prevents abuse and denial-of-service attacks.",
      details: [
        "Strict limits on form submissions (10 requests per minute)",
        "Standard limits on API endpoints (30 requests per minute)",
        "Automatic IP blocking after repeated violations",
        "5-minute cooldown period for blocked IPs",
      ],
      compliance: ["CIS Control 9", "NIST 800-53 SC-5"],
    },
    {
      icon: Eye,
      title: "Security Monitoring",
      description: "Real-time logging and pattern detection for security events.",
      details: [
        "Suspicious pattern detection (XSS, SQL injection, path traversal)",
        "All security events logged with timestamps and IP addresses",
        "Automatic alerting for high-risk activity",
      ],
      compliance: ["ISO 27001 A.12.4", "CIS Control 8"],
    },
    {
      icon: FileCheck,
      title: "Input Validation",
      description: "Strict validation and sanitization of all user inputs.",
      details: [
        "Schema-based validation using Zod",
        "DOMPurify sanitization for displayed content",
        "Parameterized database queries prevent SQL injection",
        "Request size limits (100KB JSON, 50KB forms)",
      ],
      compliance: ["OWASP ASVS 5.1", "CIS Control 16"],
    },
    {
      icon: AlertTriangle,
      title: "Privacy Protection",
      description: "Your data is handled with care and transparency.",
      details: [
        "No tracking cookies or third-party analytics",
        "Form submissions stored securely",
        "No personal data shared with third parties",
        "Security tools run entirely in your browser",
      ],
      compliance: ["GDPR", "Privacy by Design"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="container mx-auto max-w-4xl text-center">
            <Shield className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl font-bold text-white mb-4">
              Security and Privacy
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              As a cybersecurity education platform, we practice what we teach. 
              Here is how we protect you and your data.
            </p>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {securityMeasures.map((measure, index) => (
                <Card key={index} className="h-full" data-testid={`security-card-${index}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <measure.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{measure.title}</CardTitle>
                    </div>
                    <CardDescription>{measure.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {measure.details.map((detail, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {measure.compliance.map((standard, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-8 text-center">Compliance Standards</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>OWASP ASVS</CardTitle>
                  <CardDescription>Application Security Verification Standard</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Our security controls align with OWASP ASVS Level 1 requirements for 
                  input validation, output encoding, authentication, and session management.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CIS Controls</CardTitle>
                  <CardDescription>Center for Internet Security</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  We implement relevant CIS Critical Security Controls including secure 
                  configuration, data protection, and network monitoring.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ISO 27001</CardTitle>
                  <CardDescription>Information Security Management</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Our logging and monitoring practices align with ISO 27001 Annex A 
                  requirements for security event logging and incident management.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>NIST Cybersecurity Framework</CardTitle>
                  <CardDescription>National Institute of Standards and Technology</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Our security architecture follows NIST CSF core functions: Identify, 
                  Protect, Detect, Respond, and Recover.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold mb-4">Report a Security Issue</h2>
            <p className="text-muted-foreground mb-6">
              If you discover a security vulnerability, please report it responsibly. 
              We appreciate your help in keeping our platform and users safe.
            </p>
            <p className="text-sm text-muted-foreground">
              Contact us through our contact form with the subject line "Security Report" 
              and we will respond within 48 hours.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
