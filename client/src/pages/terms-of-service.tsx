import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-12 bg-gradient-to-br from-background to-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">
              Effective Date: January 14, 2026
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  GetCyberRight ("GetCyberRight," "Platform," or "Services") is a digital service platform 
                  powered and operated by ColorCodeSolutions LLC ("Company," "we," "us," or "our").
                </p>
                <p className="text-muted-foreground">
                  These Terms of Service ("Terms") govern your access to and use of the GetCyberRight website, 
                  applications, content, tools, and related services. By accessing or using the Platform, you 
                  agree to be bound by these Terms. If you do not agree, you may not access or use the Services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Platform Purpose</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  GetCyberRight is a for-profit digital safety and awareness platform designed to help individuals 
                  and families better understand online risks, digital behavior, and responsible technology use.
                </p>
                <p className="text-muted-foreground">The Platform provides:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Cybersecurity news, articles, and threat analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Educational content for families, youth, and seniors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Interactive safety assessments and learning tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Real-time threat intelligence and scam detection resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Printable guides and family safety resources</span>
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  GetCyberRight is not a government entity, nonprofit organization, law enforcement agency, 
                  or legal advisory service. The Platform provides educational content, tools, and services only.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Eligibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You must be at least 13 years of age to use the Services. If you are between 13 and 18 years 
                  of age, you may use the Services only with the consent of a parent or legal guardian who agrees 
                  to be bound by these Terms.
                </p>
                <p className="text-muted-foreground">
                  By using the Platform, you represent and warrant that you meet these eligibility requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Account Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">You are responsible for:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Maintaining the confidentiality of your account credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>All activity that occurs under your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Providing accurate, current, and complete information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Immediately notifying us of any unauthorized use of your account</span>
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  We reserve the right to suspend or terminate accounts that violate these Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  All content, software, designs, trademarks, service marks, logos, and proprietary materials 
                  associated with GetCyberRight are owned by or licensed to ColorCodeSolutions LLC and are 
                  protected by applicable intellectual property laws.
                </p>
                <p className="text-muted-foreground">
                  You may not copy, reproduce, distribute, modify, reverse-engineer, or create derivative works 
                  without prior written consent.
                </p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">User Content</h4>
                  <p className="text-muted-foreground">
                    By submitting content to the Platform, you grant us a non-exclusive, worldwide, royalty-free 
                    license to use, reproduce, modify, and distribute such content for the purpose of operating 
                    and improving our services.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Acceptable Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">You agree not to use the Platform to:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Violate any applicable laws, regulations, or third-party rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Upload, transmit, or distribute malicious software or harmful content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Attempt to gain unauthorized access to our systems or other users' accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Harass, abuse, or harm other users or third parties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Spam, phish, or engage in other deceptive practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Misrepresent your identity or affiliation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Interfere with the security or operation of the Platform</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Automated Access and Content Protection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You may not use any automated means, including but not limited to bots, crawlers, scrapers, 
                  spiders, data mining tools, or any other automated technology to access, scrape, harvest, copy, 
                  monitor, or collect content, data, or information from the Platform without our prior written consent.
                </p>
                <p className="text-muted-foreground">Specifically prohibited activities include:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Scraping, copying, or systematically downloading content from the Platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Creating derivative works, mirror sites, or clones of the Platform or its content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Using the Platform's content to train machine learning or artificial intelligence models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Circumventing any technical measures designed to prevent unauthorized access or scraping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Republishing, redistributing, or reselling Platform content without explicit authorization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Using automated tools to submit forms, create accounts, or interact with Platform features</span>
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Violations of this section may result in immediate termination of access, IP blocking, 
                  and pursuit of legal remedies including injunctive relief and damages under applicable laws 
                  including the Computer Fraud and Abuse Act (CFAA), the Digital Millennium Copyright Act (DMCA), 
                  and equivalent international legislation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Educational Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Our educational content and assessments are designed for learning purposes and should not be 
                  considered as professional certification, legal advice, or accreditation unless explicitly stated.
                </p>
                <p className="text-muted-foreground">
                  Assessment results and achievements are for educational tracking and personal awareness. They 
                  do not constitute professional qualifications or official endorsements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Disclaimers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  GetCyberRight provides educational and informational content only. The Platform does not 
                  guarantee prevention of cyber incidents, online harm, or security breaches.
                </p>
                <p className="text-muted-foreground">
                  THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE DISCLAIM ALL WARRANTIES, 
                  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
                  PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p className="text-muted-foreground">
                  Use of the Platform is at your own risk.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, COLORCODESOLUTIONS LLC SHALL NOT BE LIABLE FOR ANY 
                  INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED 
                  TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE PLATFORM.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We may suspend or terminate access to the Platform at our discretion, without notice, for 
                  violations of these Terms or applicable law. Upon termination, your right to use the Platform 
                  will cease immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  These Terms are governed by the laws of the United States, without regard to conflict-of-law 
                  principles. Any disputes arising out of or relating to these Terms shall be resolved through 
                  binding arbitration or in the courts of competent jurisdiction.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>13. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We reserve the right to modify these Terms at any time. We will notify users of material changes 
                  by posting the updated Terms on the Platform and updating the "Effective Date." Your continued 
                  use of the Platform after such changes constitutes acceptance of the new Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>14. Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Questions regarding these Terms may be directed to:
                </p>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p><strong>ColorCodeSolutions LLC</strong></p>
                  <p><strong>Email:</strong> hello@getcyberright.com</p>
                  <p><strong>Website:</strong> getcyberright.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
