import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-12 bg-gradient-to-br from-background to-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
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
                <CardTitle>1. Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  This Privacy Policy explains how ColorCodeSolutions LLC, operating the GetCyberRight platform, 
                  collects, uses, stores, and protects your personal information.
                </p>
                <p className="text-muted-foreground">
                  We are committed to protecting your privacy. We do not sell your personal information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Personal Information</h4>
                  <p className="text-muted-foreground">
                    We collect information you provide directly to us, such as when you subscribe to our newsletter, 
                    participate in assessments, use our scam checker, or contact us for support. This may include 
                    your name, email address, and preferences for content topics.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage Information</h4>
                  <p className="text-muted-foreground">
                    We automatically collect information about your use of our services, including pages visited, 
                    assessment results, time spent on the platform, and interaction patterns. This helps us improve 
                    our educational content and user experience.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Technical Information</h4>
                  <p className="text-muted-foreground">
                    We collect technical data such as IP address, browser type, device information, and operating 
                    system to ensure platform security and optimize performance across different devices and browsers.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Information is used to:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Provide and maintain our cyber safety platform and services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Personalize your experience and deliver relevant safety content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Send you educational content, safety tips, and platform updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Improve our services through analytics and user feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Monitor security, performance, and compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Respond to your inquiries and provide customer support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We do not sell, trade, or rent your personal information to third parties. We may share your 
                  information only in the following circumstances:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Service Providers:</strong> With trusted third-party vendors who assist us in operating our platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Business Transfer:</strong> In connection with a merger, acquisition, or sale of assets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Consent:</strong> When you explicitly consent to sharing your information</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We use third-party services to operate and improve the Platform. These include:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Analytics:</strong> Google Analytics to understand how visitors use our site</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Security:</strong> Google reCAPTCHA to protect against spam and abuse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Email:</strong> Email service providers to deliver newsletters and tips</span>
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  These services may collect information as described in their own privacy policies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  ColorCodeSolutions LLC implements reasonable administrative, technical, and physical safeguards 
                  to protect your personal information, including:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>SSL/TLS encryption for data transmission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Secure data storage with encryption at rest</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Access controls and authentication measures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Regular security monitoring and updates</span>
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  No system is completely secure, and absolute security cannot be guaranteed.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Depending on applicable law, you may have the following rights regarding your personal information:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Access:</strong> Request access to your personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Correction:</strong> Request correction of inaccurate information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Deletion:</strong> Request deletion of your personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</span>
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  To exercise these rights, contact us using the information below.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                  and provide personalized content. You can control cookie preferences through your browser 
                  settings, though some features may not function properly if cookies are disabled.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The Platform is intended for users aged 13 and older. Users between 13 and 18 should use the 
                  Platform with parental or guardian consent.
                </p>
                <p className="text-muted-foreground">
                  We do not knowingly collect personal information from children under the age of 13. If we 
                  become aware that we have collected such information, we will take steps to delete it promptly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We may update this Privacy Policy periodically. We will notify you of any material changes by 
                  posting the new policy on this page and updating the "Effective Date." Continued use of the 
                  Platform constitutes acceptance of any changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p><strong>ColorCodeSolutions LLC</strong></p>
                  <p><strong>Email:</strong> hello@getcyberright.com</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    We will respond to your inquiry within 30 days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
