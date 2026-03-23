import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SEOHead } from "@/components/seo-head";
import { Link } from "wouter";
import bannerImage from "@/assets/banners/privacy-banner.png";

export default function Privacy() {
  const effectiveDate = "January 31, 2026";
  const lastUpdated = "March 23, 2026";

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
                    <li><strong className="text-foreground">Purchase a subscription:</strong> Billing information processed securely through our payment provider (we do not store full payment card details on our servers)</li>
                    <li><strong className="text-foreground">Use our security tools:</strong> URLs, email headers, or other content you submit for analysis (processed in real time and not permanently stored unless you create an account)</li>
                    <li><strong className="text-foreground">Use the GCR Guard browser extension:</strong> URLs of pages you visit (when Auto-Protect is enabled) or manually scan, page content analyzed for scam indicators, and your extension authentication token. See Section 3.3 for full details on extension data practices.</li>
                    <li><strong className="text-foreground">Use our breach monitoring service:</strong> Email addresses you submit to check against known data breaches (used solely for monitoring and alert purposes)</li>
                    <li><strong className="text-foreground">Use our data broker removal service:</strong> Personal information you provide to identify and request removal of your data from data broker databases (used solely for removal requests on your behalf)</li>
                    <li><strong className="text-foreground">Report a scam:</strong> Details about suspected scams to help protect our community</li>
                    <li><strong className="text-foreground">Interact with our AI assistant (Dezi):</strong> Questions and messages you send during conversations (used to generate responses and improve service quality)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2.2 Information Collected Automatically</h3>
                  <p>When you access our Service, we automatically collect certain information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Device Information:</strong> Device type, operating system, browser type and version, screen resolution, and device identifiers</li>
                    <li><strong className="text-foreground">Usage Data:</strong> Pages visited, time spent on pages, click patterns, and navigation paths</li>
                    <li><strong className="text-foreground">Location Data:</strong> General geographic location derived from IP address (country, region, city). We do not collect precise geolocation.</li>
                    <li><strong className="text-foreground">Referral Data:</strong> How you arrived at our website (search engine, referral link, direct access)</li>
                    <li><strong className="text-foreground">Session Information:</strong> Session duration, return visits, and engagement metrics</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2.3 Information We Do Not Collect</h3>
                  <p>We want to be clear about the types of information we do not collect:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Biometric data (fingerprints, facial recognition, voiceprints)</li>
                    <li>Precise geolocation data (GPS coordinates)</li>
                    <li>Financial account numbers (credit card details are processed by our payment provider and never stored on our systems)</li>
                    <li>Social Security numbers or government-issued identification numbers</li>
                    <li>Health or medical information</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Artificial Intelligence and Automated Processing</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">3.1 AI-Powered Features</h3>
                  <p>Our Service uses artificial intelligence to provide certain features. We believe in transparency about how AI is used:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Dezi AI Assistant:</strong> Our conversational assistant uses Anthropic's Claude language model to answer your cybersecurity questions. Your messages are sent to Anthropic for processing and are subject to <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Anthropic's Privacy Policy</a>. Anthropic does not use your conversations to train its models under our commercial agreement.</li>
                    <li><strong className="text-foreground">Scam Detection Tools:</strong> AI analyzes URLs, email content, and text you submit to identify potential threats. This analysis happens in real time, and submitted content is not stored after analysis unless you have an account and choose to save results.</li>
                    <li><strong className="text-foreground">Content Generation:</strong> AI assists in creating educational articles, guides, and social media content about cybersecurity topics. This does not involve your personal data.</li>
                    <li><strong className="text-foreground">Threat Intelligence:</strong> AI processes publicly available cybersecurity news feeds to identify and simplify trending threats for our users. No personal data is involved in this process.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">3.3 GCR Guard Browser Extension</h3>
                  <p>Our GCR Guard browser extension provides real-time scam protection while you browse. Here is exactly what data it collects and how it is used:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">URLs of pages you visit:</strong> When Auto-Protect is enabled, page URLs are sent to our servers for real-time threat analysis. URLs are analyzed and discarded immediately for free-tier users. Paid subscribers may have scan history retained for up to 90 days if they opt in.</li>
                    <li><strong className="text-foreground">Page content:</strong> The extension collects page metadata (title, headings, form indicators, external links) and an excerpt of the page text. This data is sent to our servers for AI-powered threat analysis. The extension does not capture passwords, form inputs you type, or full page content.</li>
                    <li><strong className="text-foreground">Authentication token:</strong> A 90-day token is stored locally in your browser to link the extension to your GetCyberRight account. This token can be revoked at any time from your account settings.</li>
                    <li><strong className="text-foreground">Subscription status:</strong> The extension periodically checks your subscription tier (Free, Essential, or Professional) to determine which features are available. This status is cached locally for up to 10 minutes.</li>
                    <li><strong className="text-foreground">Extension settings:</strong> Your preferences (Auto-Protect on/off, notification settings) are stored locally in your browser using Chrome's storage API and are never sent to our servers.</li>
                  </ul>
                  <p className="mt-4">
                    The extension does not collect browsing history, passwords, form inputs, or any data from pages you do not scan. It does not track your browsing activity for advertising or analytics purposes. All data sent to our servers is transmitted over encrypted HTTPS connections.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">3.4 Automated Decision-Making</h3>
                  <p>
                    Our Service does not make automated decisions that produce legal effects or similarly significant 
                    effects on you. AI-powered features such as scam detection provide recommendations and assessments 
                    for your information only. You are always free to make your own decisions based on the information 
                    we provide.
                  </p>
                  <p>
                    If you are located in the European Economic Area, you have the right not to be subject to a 
                    decision based solely on automated processing, including profiling, which produces legal effects 
                    concerning you or similarly significantly affects you, as provided under Article 22 of the GDPR.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Analytics and Tracking Technologies</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">4.1 Google Analytics</h3>
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

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">4.2 Opting Out of Analytics</h3>
                  <p>You can opt out of Google Analytics by:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
                    <li>Adjusting your browser settings to reject cookies</li>
                    <li>Using browser privacy features or extensions that block tracking</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">4.3 Essential Cookies</h3>
                  <p>
                    We use essential cookies that are strictly necessary for the operation of our Service. These 
                    include session cookies to maintain your login state and preference cookies to remember your 
                    settings. These cookies cannot be disabled as they are required for the Service to function.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">4.4 Do Not Track Signals</h3>
                  <p>
                    Some browsers offer a "Do Not Track" (DNT) setting that sends a signal to websites you visit 
                    indicating that you do not want to be tracked. There is currently no universally accepted 
                    standard for how companies should respond to DNT signals. At this time, our Service does not 
                    respond to DNT signals. However, you can use the opt-out methods described in Section 4.2 to 
                    limit tracking on our Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. How We Use Your Information</h2>
                  <p>We use the information we collect for the following purposes:</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">5.1 Service Delivery</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide, maintain, and improve our educational resources and tools</li>
                    <li>Process your account registration and manage your subscription</li>
                    <li>Respond to your inquiries and provide customer support</li>
                    <li>Send transactional emails (account confirmations, password resets, subscription updates)</li>
                    <li>Process data broker removal requests on your behalf</li>
                    <li>Monitor data breaches and alert you if your information is found in a known breach</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">5.2 Communication</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Send our newsletter with cybersecurity tips and scam alerts (with your consent)</li>
                    <li>Notify you about important security threats relevant to your region</li>
                    <li>Send breach monitoring alerts when your email is found in a data breach</li>
                    <li>Inform you of changes to our Service or policies</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">5.3 Improvement and Analytics</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Analyze usage patterns to improve our content and user experience</li>
                    <li>Develop new features and educational resources</li>
                    <li>Monitor and analyze trends, usage, and activities</li>
                    <li>Detect, investigate, and prevent fraudulent or unauthorized access</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">5.4 Legal and Safety</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Comply with legal obligations and respond to lawful requests</li>
                    <li>Protect the rights, property, and safety of GetCyberRight and our users</li>
                    <li>Enforce our Terms of Service and other policies</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Information Sharing and Disclosure</h2>
                  <p className="font-semibold text-foreground">We do not sell, rent, or trade your personal information to third parties.</p>
                  <p>We may share your information in the following limited circumstances:</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">6.1 Service Providers</h3>
                  <p>We work with trusted third-party service providers who assist us in operating our Service:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Payment Processors:</strong> Payment processing is handled by PCI-DSS compliant third-party providers. We do not store your full payment card details on our servers.</li>
                    <li><strong className="text-foreground">Google Analytics:</strong> Website analytics and performance measurement</li>
                    <li><strong className="text-foreground">Anthropic:</strong> Powering our Dezi AI assistant. Conversations are processed under our commercial agreement. Anthropic does not use your data to train its models.</li>
                    <li><strong className="text-foreground">Replit:</strong> Application hosting and infrastructure</li>
                    <li><strong className="text-foreground">Email service providers:</strong> Newsletter and transactional email delivery</li>
                  </ul>
                  <p className="mt-4">
                    These providers are contractually obligated to protect your information and may only use it 
                    to perform services on our behalf. We do not share more information with service providers 
                    than is necessary for them to perform their specific function.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">6.2 Data Broker Removal Services</h3>
                  <p>
                    When you use our data broker removal service, we submit opt-out and removal requests to data 
                    brokers on your behalf. This requires sharing certain personal information (such as your name 
                    and email address) with those data brokers solely for the purpose of identifying and removing 
                    your records from their databases. We only share the minimum information necessary to complete 
                    the removal request.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">6.3 Legal Requirements</h3>
                  <p>We may disclose your information if required to do so by law or in response to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Valid legal process (subpoena, court order, government request)</li>
                    <li>Protect our legal rights or defend against legal claims</li>
                    <li>Prevent fraud, security threats, or illegal activity</li>
                    <li>Protect the safety of any person</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">6.4 Business Transfers</h3>
                  <p>
                    If GetCyberRight is involved in a merger, acquisition, or sale of assets, your personal 
                    information may be transferred. We will provide notice before your information becomes 
                    subject to a different privacy policy.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">6.5 Aggregated Data</h3>
                  <p>
                    We may share aggregated, anonymized data that cannot reasonably be used to identify you 
                    for research, analysis, or improving cybersecurity awareness in the broader community.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. Data Security</h2>
                  <p>
                    We implement robust security measures to protect your personal information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Encryption in Transit:</strong> All data transmitted to and from our Service uses TLS/SSL encryption (HTTPS)</li>
                    <li><strong className="text-foreground">Encryption at Rest:</strong> Sensitive data stored in our databases is encrypted</li>
                    <li><strong className="text-foreground">Password Security:</strong> Passwords are hashed using bcrypt with industry-standard salt rounds and are never stored in plain text</li>
                    <li><strong className="text-foreground">Access Controls:</strong> Strict internal access controls limit who can access personal data, following the principle of least privilege</li>
                    <li><strong className="text-foreground">Regular Audits:</strong> We regularly review and update our security practices and conduct vulnerability assessments</li>
                    <li><strong className="text-foreground">Secure Infrastructure:</strong> Our Service is hosted on enterprise-grade infrastructure with security certifications</li>
                    <li><strong className="text-foreground">Input Validation:</strong> All user inputs are validated and sanitized to prevent injection attacks and other security vulnerabilities</li>
                  </ul>
                  <p className="mt-4">
                    While we strive to use commercially acceptable means to protect your personal information, 
                    no method of transmission over the Internet or electronic storage is 100% secure. We cannot 
                    guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. Data Breach Notification</h2>
                  <p>
                    In the event of a data breach that affects your personal information, we are committed to 
                    notifying you promptly. Our breach notification procedures include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Investigating the breach to determine the scope and nature of the compromised data</li>
                    <li>Notifying affected users by email within 72 hours of confirming the breach, as required by applicable law</li>
                    <li>Providing details about the nature of the breach, the types of information involved, and the steps we are taking to address it</li>
                    <li>Offering guidance on steps you can take to protect yourself</li>
                    <li>Reporting the breach to relevant regulatory authorities as required by applicable law, including state attorneys general and data protection authorities</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. Data Retention</h2>
                  <p>We retain your personal information for as long as necessary to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide you with the Service and fulfill the purposes described in this policy</li>
                    <li>Comply with legal obligations (such as tax and accounting requirements)</li>
                    <li>Resolve disputes and enforce our agreements</li>
                  </ul>
                  <p className="mt-4">Specific retention periods:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Account data:</strong> Retained while your account is active. When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal purposes.</li>
                    <li><strong className="text-foreground">Analytics data:</strong> Retained according to Google Analytics' data retention settings (currently set to 14 months for user-level data).</li>
                    <li><strong className="text-foreground">Breach monitoring data:</strong> Email addresses submitted for breach monitoring are retained as long as you maintain an active monitoring subscription. You can request removal at any time.</li>
                    <li><strong className="text-foreground">AI assistant conversations:</strong> Conversations with Dezi are retained for up to 30 days to improve service quality and then automatically deleted.</li>
                    <li><strong className="text-foreground">Security scan results (server):</strong> Results from scam detection and URL scanning tools are not retained on our servers for free-tier users. Professional subscribers may have server-side scan history retained for up to 90 days.</li>
                    <li><strong className="text-foreground">Security scan results (extension):</strong> The GCR Guard browser extension stores a local history of recent scans on your device using your browser's storage. This data remains on your device and is never sent to our servers. You can clear it at any time through your browser settings.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">10. Your Privacy Rights</h2>
                  <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">10.1 General Rights (All Users)</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong className="text-foreground">Portability:</strong> Receive your data in a structured, commonly used, machine-readable format</li>
                    <li><strong className="text-foreground">Opt-out:</strong> Unsubscribe from marketing communications at any time using the unsubscribe link in any email</li>
                    <li><strong className="text-foreground">Withdraw Consent:</strong> Where processing is based on consent, withdraw it at any time without affecting the lawfulness of processing before withdrawal</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">10.2 California Residents (CCPA/CPRA)</h3>
                  <p>If you are a California resident, you have the following rights under the California Consumer Privacy Act and the California Privacy Rights Act:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Right to know what personal information is collected, used, shared, or sold</li>
                    <li>Right to delete personal information held by businesses</li>
                    <li>Right to opt-out of the sale or sharing of personal information (we do not sell or share your data for cross-context behavioral advertising)</li>
                    <li>Right to non-discrimination for exercising your privacy rights</li>
                    <li>Right to correct inaccurate personal information</li>
                    <li>Right to limit the use and disclosure of sensitive personal information</li>
                  </ul>
                  <p className="mt-4">
                    We do not sell personal information as defined under the CCPA/CPRA. We do not use or disclose 
                    sensitive personal information for purposes other than those permitted by the CPRA.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">10.3 Virginia Residents (VCDPA)</h3>
                  <p>If you are a Virginia resident, you have the following rights under the Virginia Consumer Data Protection Act:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Right to confirm whether we are processing your personal data and to access that data</li>
                    <li>Right to correct inaccuracies in your personal data</li>
                    <li>Right to delete your personal data</li>
                    <li>Right to obtain a portable copy of your personal data</li>
                    <li>Right to opt out of the processing of your personal data for targeted advertising, sale, or profiling</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">10.4 Colorado Residents (CPA)</h3>
                  <p>If you are a Colorado resident, you have similar rights under the Colorado Privacy Act, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Right to opt out of the processing of personal data for targeted advertising or the sale of personal data</li>
                    <li>Right to access, correct, and delete your personal data</li>
                    <li>Right to data portability</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">10.5 Connecticut, Utah, and Other State Residents</h3>
                  <p>
                    Residents of Connecticut (CTDPA), Utah (UCPA), Montana (MCDPA), Texas (TDPSA), Oregon (OCPA), 
                    and other states with comprehensive privacy laws have similar rights regarding access, correction, 
                    deletion, portability, and opt-out of targeted advertising or sale of personal data. We honor 
                    these rights for all users regardless of location.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">10.6 European Economic Area Residents (GDPR)</h3>
                  <p>If you are in the EEA, you have rights under the General Data Protection Regulation:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Right of access to your personal data</li>
                    <li>Right to rectification of inaccurate data</li>
                    <li>Right to erasure ("right to be forgotten")</li>
                    <li>Right to restriction of processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                    <li>Right not to be subject to automated decision-making, including profiling</li>
                    <li>Right to lodge a complaint with your local data protection supervisory authority</li>
                  </ul>
                  <p className="mt-4">
                    Our legal bases for processing your data include: consent (where you have given it), contract 
                    performance (where processing is necessary to fulfill our agreement with you), legitimate 
                    interests (such as improving our Service and ensuring security), and compliance with legal obligations.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">10.7 United Kingdom Residents (UK GDPR)</h3>
                  <p>
                    If you are located in the United Kingdom, you have equivalent rights under the UK General Data 
                    Protection Regulation and the Data Protection Act 2018. You may contact the Information 
                    Commissioner's Office (ICO) if you have concerns about how your data is being processed.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">10.8 Exercising Your Rights</h3>
                  <p>
                    To exercise any of these rights, please contact us at{" "}
                    <a href="mailto:privacy@getcyberright.com" className="text-primary hover:underline">privacy@getcyberright.com</a>.
                    We will respond to your request within 30 days (or sooner as required by applicable law). 
                    We will not charge a fee to process your request unless it is clearly unfounded or excessive. 
                    We may request specific information from you to verify your identity before processing your request.
                  </p>
                  <p>
                    If we decline your request, we will inform you of the reasons and your right to appeal. 
                    You may also contact your local data protection authority to file a complaint.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">11. Children's Privacy</h2>
                  <p>
                    Our Service provides educational content designed for various age groups, including children. 
                    However, account registration and data collection features are intended for users 13 years 
                    of age or older.
                  </p>
                  <p>
                    We comply with the Children's Online Privacy Protection Act (COPPA). We do not knowingly 
                    collect personal information from children under 13 without verifiable parental consent. If 
                    you are a parent or guardian and believe your child has provided us with personal information, 
                    please contact us immediately at{" "}
                    <a href="mailto:privacy@getcyberright.com" className="text-primary hover:underline">privacy@getcyberright.com</a>. 
                    If we discover that a child under 13 has provided personal information without parental 
                    consent, we will promptly delete it.
                  </p>
                  <p>
                    For our Kids Digital Safety Hub content, no account or personal information is required 
                    to access the educational materials. These resources are designed to be used with parental 
                    supervision.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">12. International Data Transfers</h2>
                  <p>
                    Your information may be transferred to and processed in the United States and other countries 
                    where our service providers operate. These countries may have data protection laws that are 
                    different from the laws of your country of residence.
                  </p>
                  <p>
                    We take appropriate safeguards to ensure that your personal information remains protected 
                    in accordance with this Privacy Policy, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Using Standard Contractual Clauses approved by the European Commission where required for transfers from the EEA</li>
                    <li>Ensuring service providers maintain appropriate security measures and data protection agreements</li>
                    <li>Implementing supplementary technical and organizational measures where necessary</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">13. Third-Party Links and Integrations</h2>
                  <p>
                    Our Service may contain links to third-party websites and services that are not operated 
                    by us. We have no control over and assume no responsibility for the content, privacy 
                    policies, or practices of any third-party sites or services.
                  </p>
                  <p>
                    We encourage you to review the privacy policy of every site you visit. When we link to 
                    government resources (FTC, FBI, CISA), those sites are governed by their own privacy policies.
                  </p>
                  <p>
                    Our social media presence (LinkedIn, Facebook, Instagram) is subject to the privacy policies 
                    of those respective platforms. Any interactions you have with our content on those platforms 
                    are governed by the platform's privacy policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">14. Changes to This Privacy Policy</h2>
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
                    effective when they are posted on this page. Your continued use of the Service after any 
                    changes constitutes your acceptance of the updated Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">15. Contact Us</h2>
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
                    <p className="mt-4 text-sm text-muted-foreground">
                      For data protection inquiries from the European Economic Area or United Kingdom, you may 
                      also contact your local data protection authority.
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
