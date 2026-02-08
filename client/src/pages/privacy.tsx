import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SEOHead } from "@/components/seo-head";
import { Link } from "wouter";
import bannerImage from "@/assets/banners/privacy-banner.png";

export default function Privacy() {
  const effectiveDate = "January 31, 2026";
  const lastUpdated = "January 31, 2026";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Privacy Policy" 
        description="GetCyberRight's privacy policy explains how we collect, use, and protect your personal information. We are committed to transparency and data protection." 
      />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Privacy Policy"
          subtitle="Your privacy matters. This policy explains how we handle your information with transparency and care."
          imageSrc={bannerImage}
          imageAlt="Secure document environment with padlock symbolism representing data protection and privacy policy"
          imagePosition="left"
        />

        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg max-w-none"
            >
              <div className="space-y-10 text-muted-foreground">
                <div className="bg-muted/30 rounded-lg p-6 border">
                  <p className="text-sm mb-2"><strong className="text-foreground">Effective Date:</strong> {effectiveDate}</p>
                  <p className="text-sm mb-0"><strong className="text-foreground">Last Updated:</strong> {lastUpdated}</p>
                </div>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                  <p>
                    GetCyberRight is a service operated by ColorCode Solutions LLC, a North Carolina limited 
                    liability company ("ColorCode Solutions," "we," "us," or "our"). We operate the website 
                    getcyberright.com (the "Service"). This Privacy Policy informs you of our policies regarding 
                    the collection, use, and disclosure of personal data when you use our Service and the choices 
                    you have associated with that data.
                  </p>
                  <p>
                    As a cybersecurity education organization, we understand the importance of protecting your 
                    personal information. We are committed to maintaining the trust and confidence of our visitors 
                    and subscribers.
                  </p>
                  <p>
                    By using the Service, you agree to the collection and use of information in accordance with 
                    this policy. Unless otherwise defined in this Privacy Policy, terms used have the same meanings 
                    as in our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Information You Provide Directly</h3>
                  <p>We collect information you voluntarily provide when you:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Create an account:</strong> Name, email address, password (encrypted), and optional profile information</li>
                    <li><strong className="text-foreground">Subscribe to our newsletter:</strong> Email address and communication preferences</li>
                    <li><strong className="text-foreground">Contact us:</strong> Name, email address, and message content</li>
                    <li><strong className="text-foreground">Purchase a subscription:</strong> Billing information processed securely through Stripe (we do not store full payment card details)</li>
                    <li><strong className="text-foreground">Use our tools:</strong> URLs, email headers, or other content you submit for analysis (processed but not permanently stored unless you create an account)</li>
                    <li><strong className="text-foreground">Report a scam:</strong> Details about suspected scams to help protect our community</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2.2 Information Collected Automatically</h3>
                  <p>When you access our Service, we automatically collect certain information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Device Information:</strong> Device type, operating system, browser type and version, screen resolution, and device identifiers</li>
                    <li><strong className="text-foreground">Usage Data:</strong> Pages visited, time spent on pages, click patterns, and navigation paths</li>
                    <li><strong className="text-foreground">Location Data:</strong> General geographic location derived from IP address (country, region, city)</li>
                    <li><strong className="text-foreground">Referral Data:</strong> How you arrived at our website (search engine, referral link, direct access)</li>
                    <li><strong className="text-foreground">Session Information:</strong> Session duration, return visits, and engagement metrics</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Analytics and Tracking Technologies</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">3.1 Google Analytics</h3>
                  <p>
                    We use Google Analytics 4 ("GA4"), a web analytics service provided by Google LLC, to help us 
                    understand how visitors use our Service. Google Analytics uses cookies and similar technologies 
                    to collect and analyze information about use of the Service.
                  </p>
                  
                  <p className="font-medium text-foreground mt-4">Google Analytics collects:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Page views and user interactions</li>
                    <li>Device and browser characteristics</li>
                    <li>Geographic location (country, region, city level based on IP address)</li>
                    <li>Session and engagement metrics</li>
                    <li>Traffic sources and referral information</li>
                  </ul>

                  <p className="font-medium text-foreground mt-4">User Identification:</p>
                  <p>
                    For registered users, we may use Google Analytics' User-ID feature to associate your activity 
                    across different sessions and devices with your account. This helps us understand how you 
                    interact with our Service over time and improve your experience. This data is associated with 
                    a unique identifier, not your personal details, within Google Analytics.
                  </p>

                  <p className="font-medium text-foreground mt-4">Data Processing:</p>
                  <p>
                    Google may use the data collected to contextualize and personalize the ads of its own advertising 
                    network. Google's ability to use and share information collected by Google Analytics is governed 
                    by the <a href="https://marketingplatform.google.com/about/analytics/terms/us/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Terms of Service</a> and 
                    the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a>.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">3.2 Opting Out of Analytics</h3>
                  <p>You can opt out of Google Analytics by:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
                    <li>Adjusting your browser settings to reject cookies</li>
                    <li>Using browser privacy features or extensions that block tracking</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">3.3 Essential Cookies</h3>
                  <p>
                    We use essential cookies that are strictly necessary for the operation of our Service. These 
                    include session cookies to maintain your login state and preference cookies to remember your 
                    settings. These cookies cannot be disabled as they are required for the Service to function.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. How We Use Your Information</h2>
                  <p>We use the information we collect for the following purposes:</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">4.1 Service Delivery</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide, maintain, and improve our educational resources and tools</li>
                    <li>Process your account registration and manage your subscription</li>
                    <li>Respond to your inquiries and provide customer support</li>
                    <li>Send transactional emails (account confirmations, password resets, subscription updates)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">4.2 Communication</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Send our newsletter with cybersecurity tips and scam alerts (with your consent)</li>
                    <li>Notify you about important security threats relevant to your region</li>
                    <li>Inform you of changes to our Service or policies</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">4.3 Improvement and Analytics</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Analyze usage patterns to improve our content and user experience</li>
                    <li>Develop new features and educational resources</li>
                    <li>Monitor and analyze trends, usage, and activities</li>
                    <li>Detect, investigate, and prevent fraudulent or unauthorized access</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">4.4 Legal and Safety</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Comply with legal obligations and respond to lawful requests</li>
                    <li>Protect the rights, property, and safety of GetCyberRight and our users</li>
                    <li>Enforce our Terms of Service and other policies</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Information Sharing and Disclosure</h2>
                  <p className="font-semibold text-foreground">We do not sell your personal information.</p>
                  <p>We may share your information in the following circumstances:</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">5.1 Service Providers</h3>
                  <p>We work with trusted third-party service providers who assist us in operating our Service:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Stripe:</strong> Payment processing (PCI-DSS compliant)</li>
                    <li><strong className="text-foreground">Google Analytics:</strong> Website analytics and performance measurement</li>
                    <li><strong className="text-foreground">OpenAI:</strong> Powering our Dezi AI assistant (content is processed but not used to train AI models)</li>
                    <li><strong className="text-foreground">Email service providers:</strong> Newsletter and transactional email delivery</li>
                    <li><strong className="text-foreground">Cloud hosting:</strong> Secure data storage and application hosting</li>
                  </ul>
                  <p className="mt-4">
                    These providers are contractually obligated to protect your information and may only use it 
                    to perform services on our behalf.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">5.2 Legal Requirements</h3>
                  <p>We may disclose your information if required to do so by law or in response to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Valid legal process (subpoena, court order, government request)</li>
                    <li>Protect our legal rights or defend against legal claims</li>
                    <li>Prevent fraud, security threats, or illegal activity</li>
                    <li>Protect the safety of any person</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">5.3 Business Transfers</h3>
                  <p>
                    If GetCyberRight is involved in a merger, acquisition, or sale of assets, your personal 
                    information may be transferred. We will provide notice before your information becomes 
                    subject to a different privacy policy.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">5.4 Aggregated Data</h3>
                  <p>
                    We may share aggregated, anonymized data that cannot reasonably be used to identify you 
                    for research, analysis, or improving cybersecurity awareness in the broader community.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Data Security</h2>
                  <p>
                    We implement robust security measures to protect your personal information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Encryption:</strong> All data transmitted to and from our Service uses TLS/SSL encryption</li>
                    <li><strong className="text-foreground">Password Security:</strong> Passwords are hashed using bcrypt with industry-standard salt rounds</li>
                    <li><strong className="text-foreground">Access Controls:</strong> Strict internal access controls limit who can access personal data</li>
                    <li><strong className="text-foreground">Multi-Factor Authentication:</strong> Available for user accounts to provide additional security</li>
                    <li><strong className="text-foreground">Regular Audits:</strong> We regularly review and update our security practices</li>
                    <li><strong className="text-foreground">Secure Infrastructure:</strong> Our Service is hosted on enterprise-grade infrastructure with security certifications</li>
                  </ul>
                  <p className="mt-4">
                    While we strive to use commercially acceptable means to protect your personal information, 
                    no method of transmission over the Internet or electronic storage is 100% secure. We cannot 
                    guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. Data Retention</h2>
                  <p>We retain your personal information for as long as necessary to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide you with the Service and fulfill the purposes described in this policy</li>
                    <li>Comply with legal obligations (such as tax and accounting requirements)</li>
                    <li>Resolve disputes and enforce our agreements</li>
                  </ul>
                  <p className="mt-4">
                    When you delete your account, we will delete or anonymize your personal information within 
                    30 days, except where we are required to retain it for legal purposes.
                  </p>
                  <p>
                    Analytics data is retained according to Google Analytics' data retention settings (currently 
                    set to 14 months for user-level data).
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. Your Privacy Rights</h2>
                  <p>Depending on your location, you may have the following rights:</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">8.1 General Rights (All Users)</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong className="text-foreground">Portability:</strong> Receive your data in a structured, machine-readable format</li>
                    <li><strong className="text-foreground">Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                    <li><strong className="text-foreground">Withdraw Consent:</strong> Where processing is based on consent, withdraw it at any time</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">8.2 California Residents (CCPA/CPRA)</h3>
                  <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Right to know what personal information is collected, used, shared, or sold</li>
                    <li>Right to delete personal information held by businesses</li>
                    <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
                    <li>Right to non-discrimination for exercising your privacy rights</li>
                    <li>Right to correct inaccurate personal information</li>
                    <li>Right to limit use of sensitive personal information</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">8.3 European Economic Area Residents (GDPR)</h3>
                  <p>If you are in the EEA, you have rights under the General Data Protection Regulation:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Right of access to your personal data</li>
                    <li>Right to rectification of inaccurate data</li>
                    <li>Right to erasure ("right to be forgotten")</li>
                    <li>Right to restriction of processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                    <li>Right to lodge a complaint with a supervisory authority</li>
                  </ul>
                  <p className="mt-4">
                    Our legal basis for processing your data includes: consent, contract performance, 
                    legitimate interests, and legal obligations.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">8.4 Exercising Your Rights</h3>
                  <p>
                    To exercise any of these rights, please contact us at{" "}
                    <a href="mailto:privacy@getcyberright.com" className="text-primary hover:underline">privacy@getcyberright.com</a>.
                    We will respond to your request within 30 days (or sooner as required by applicable law).
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. Children's Privacy</h2>
                  <p>
                    Our Service provides educational content designed for various age groups, including children. 
                    However, account registration and data collection features are intended for users 13 years 
                    of age or older.
                  </p>
                  <p>
                    We do not knowingly collect personal information from children under 13 without parental 
                    consent. If you are a parent or guardian and believe your child has provided us with 
                    personal information, please contact us immediately. If we discover that a child under 13 
                    has provided personal information without parental consent, we will promptly delete it.
                  </p>
                  <p>
                    For our Kids Digital Safety Hub content, no account or personal information is required 
                    to access the educational materials.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">10. International Data Transfers</h2>
                  <p>
                    Your information may be transferred to and processed in countries other than your country 
                    of residence. These countries may have data protection laws that are different from the 
                    laws of your country.
                  </p>
                  <p>
                    We take appropriate safeguards to ensure that your personal information remains protected 
                    in accordance with this Privacy Policy, including using Standard Contractual Clauses 
                    approved by the European Commission where required.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">11. Third-Party Links</h2>
                  <p>
                    Our Service may contain links to third-party websites and services that are not operated 
                    by us. We have no control over and assume no responsibility for the content, privacy 
                    policies, or practices of any third-party sites or services.
                  </p>
                  <p>
                    We encourage you to review the privacy policy of every site you visit. When we link to 
                    government resources (FTC, FBI, CISA), those sites are governed by their own privacy policies.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">12. Changes to This Privacy Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any material 
                    changes by:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Posting the new Privacy Policy on this page with a new "Last Updated" date</li>
                    <li>Sending an email to registered users (for significant changes)</li>
                    <li>Displaying a prominent notice on our Service</li>
                  </ul>
                  <p className="mt-4">
                    We encourage you to review this Privacy Policy periodically for any changes. Changes are 
                    effective when they are posted on this page.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">13. Contact Us</h2>
                  <p>
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our 
                    data practices, please contact us:
                  </p>
                  <div className="bg-muted/30 rounded-lg p-6 mt-4 border">
                    <p className="font-semibold text-foreground mb-2">ColorCode Solutions LLC</p>
                    <p className="text-sm text-muted-foreground mb-2">Operating as GetCyberRight</p>
                    <p className="mb-1">301 S McDowell Street, Suite 125</p>
                    <p className="mb-1">Charlotte, NC 28204</p>
                    <p className="mb-1">United States</p>
                    <p className="mt-4">
                      <strong className="text-foreground">Privacy Inquiries:</strong>{" "}
                      <a href="mailto:privacy@getcyberright.com" className="text-primary hover:underline">privacy@getcyberright.com</a>
                    </p>
                    <p>
                      <strong className="text-foreground">General Support:</strong>{" "}
                      <a href="mailto:support@getcyberright.com" className="text-primary hover:underline">support@getcyberright.com</a>
                    </p>
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
