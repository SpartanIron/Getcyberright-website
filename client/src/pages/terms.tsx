import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SEOHead } from "@/components/seo-head";
import { Link } from "wouter";
import bannerImage from "@/assets/banners/terms-banner.png";

export default function Terms() {
  const effectiveDate = "January 31, 2026";
  const lastUpdated = "January 31, 2026";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Terms of Service" 
        description="Terms and conditions governing your use of GetCyberRight's cybersecurity education platform, tools, and services." 
      />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Terms of Service"
          subtitle="Please read these terms carefully before using our services. They govern your relationship with GetCyberRight."
          imageSrc={bannerImage}
          imageAlt="Professional desk with official terms document and elegant pen in a formal signing environment"
          imagePosition="right"
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
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                  <p>
                    Welcome to GetCyberRight. These Terms of Service ("Terms") constitute a legally binding 
                    agreement between you ("you" or "User") and ColorCode Solutions LLC, a North Carolina 
                    limited liability company operating as GetCyberRight ("ColorCode Solutions," "GetCyberRight," 
                    "we," "us," or "our"), governing your access to and use of the getcyberright.com website 
                    and all associated services, features, content, and applications (collectively, the "Service").
                  </p>
                  <p>
                    By accessing or using the Service, you acknowledge that you have read, understood, and 
                    agree to be bound by these Terms and our{" "}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, 
                    which is incorporated herein by reference. If you do not agree to these Terms, you must 
                    not access or use the Service.
                  </p>
                  <p>
                    If you are using the Service on behalf of an organization, you represent and warrant that 
                    you have the authority to bind that organization to these Terms, and "you" will refer to 
                    both you individually and that organization.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
                  <p>
                    GetCyberRight provides a cybersecurity education platform offering resources designed 
                    to help individuals, families, and organizations protect themselves from cyber threats. 
                    Our Service includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Educational content, articles, and guides on cybersecurity best practices</li>
                    <li>Interactive security assessment tools and threat analysis features</li>
                    <li>Dezi AI Assistant for personalized security guidance</li>
                    <li>Family Safety Codeword Generator</li>
                    <li>Scam detection and analysis tools</li>
                    <li>Downloadable checklists and resources</li>
                    <li>Newsletter and security alert communications</li>
                    <li>Premium subscription tiers with enhanced features</li>
                  </ul>
                  <p className="mt-4">
                    The Service is provided for educational and informational purposes. While we strive to 
                    provide accurate and current information, we do not guarantee that following our guidance 
                    will prevent all security incidents.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">3.1 Account Registration</h3>
                  <p>
                    Certain features of the Service require you to create an account. When you register, 
                    you agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Maintain the security and confidentiality of your login credentials</li>
                    <li>Accept responsibility for all activities that occur under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">3.2 Account Security</h3>
                  <p>
                    You are responsible for safeguarding your password and any activities or actions under 
                    your account. We encourage you to use a strong, unique password and enable multi-factor 
                    authentication when available. We will not be liable for any loss or damage arising from 
                    your failure to maintain the security of your account.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">3.3 Account Termination</h3>
                  <p>
                    You may delete your account at any time through your account settings or by contacting us. 
                    We reserve the right to suspend or terminate accounts that violate these Terms or for any 
                    other reason at our sole discretion, with or without notice.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Subscription Services and Payments</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">4.1 Subscription Tiers</h3>
                  <p>We offer the following subscription tiers:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Free Tier:</strong> Basic access to educational content and limited tool usage</li>
                    <li><strong className="text-foreground">Essential ($9/month):</strong> Advanced scanner features and basic AI assistance</li>
                    <li><strong className="text-foreground">Professional ($29/month):</strong> Voice clone detection, unlimited AI access, enhanced analysis</li>
                    <li><strong className="text-foreground">Enterprise ($99/month):</strong> API access, team management, priority support</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">4.2 Payment Terms</h3>
                  <p>
                    All paid subscriptions are billed in advance on a monthly basis. Payment is processed 
                    securely through Stripe. By subscribing, you authorize us to charge your payment method 
                    for the subscription fee plus any applicable taxes.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">4.3 Automatic Renewal</h3>
                  <p>
                    Subscriptions automatically renew at the end of each billing period unless you cancel 
                    before the renewal date. You can cancel your subscription at any time through your 
                    account settings. Cancellation will take effect at the end of the current billing period.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">4.4 Refund Policy</h3>
                  <p>
                    We offer a 14-day money-back guarantee for first-time subscribers. If you are not 
                    satisfied with your subscription, contact us within 14 days of your initial purchase 
                    for a full refund. After this period, subscription fees are non-refundable, and no 
                    refunds or credits will be issued for partial months.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">4.5 Price Changes</h3>
                  <p>
                    We reserve the right to modify subscription prices. We will provide at least 30 days' 
                    notice before any price increase takes effect. Your continued use of the Service after 
                    the price change constitutes acceptance of the new pricing.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Acceptable Use Policy</h2>
                  <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">5.1 Prohibited Activities</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Use the Service for any illegal or unauthorized purpose</li>
                    <li>Attempt to gain unauthorized access to any portion of the Service or any other systems or networks</li>
                    <li>Use automated means (bots, scrapers, crawlers) to access or collect data from the Service without our express written permission</li>
                    <li>Interfere with or disrupt the integrity or performance of the Service</li>
                    <li>Transmit viruses, malware, or any other malicious code</li>
                    <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
                    <li>Use the Service to send spam or unsolicited communications</li>
                    <li>Harvest or collect personal information about other users</li>
                    <li>Use our security tools for malicious purposes (such as testing phishing attacks against others)</li>
                    <li>Reverse engineer, decompile, or disassemble any portion of the Service</li>
                    <li>Remove or alter any proprietary notices or labels on the Service</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">5.2 API and Enterprise Use</h3>
                  <p>
                    Enterprise subscribers with API access must comply with our API Terms of Use, including 
                    rate limits, data handling requirements, and attribution guidelines. API access is for 
                    internal business use only and may not be resold without written permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property Rights</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">6.1 Our Content</h3>
                  <p>
                    The Service and its original content, features, and functionality are owned by 
                    ColorCode Solutions LLC and are protected by international copyright, trademark, patent, trade 
                    secret, and other intellectual property or proprietary rights laws. This includes but 
                    is not limited to: text, graphics, logos, icons, images, audio clips, digital downloads, 
                    data compilations, and software.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">6.2 Limited License</h3>
                  <p>
                    Subject to your compliance with these Terms, we grant you a limited, non-exclusive, 
                    non-transferable, revocable license to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access and use the Service for personal, non-commercial purposes</li>
                    <li>Download and print educational materials for personal use</li>
                    <li>Share our content with family members for educational purposes</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">6.3 Educational and Organizational Use</h3>
                  <p>
                    Educational institutions, non-profit organizations, and community groups may use our 
                    materials in group settings, provided they:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Maintain proper attribution to GetCyberRight</li>
                    <li>Do not modify the content in ways that misrepresent our guidance</li>
                    <li>Do not charge fees specifically for our materials</li>
                    <li>Contact us for permission if distributing to more than 100 individuals</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">6.4 Restrictions</h3>
                  <p>You may NOT:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Reproduce, distribute, or publicly display our content for commercial purposes without permission</li>
                    <li>Create derivative works based on our content for commercial distribution</li>
                    <li>Use our trademarks, logos, or brand elements without written consent</li>
                    <li>Frame or mirror any portion of the Service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. User Content</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">7.1 Your Submissions</h3>
                  <p>
                    You may submit content to the Service, including scam reports, feedback, and 
                    communications. By submitting content, you grant us a non-exclusive, worldwide, 
                    royalty-free license to use, reproduce, modify, and display such content in 
                    connection with operating and improving the Service.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">7.2 Content Standards</h3>
                  <p>You represent and warrant that your content:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Does not infringe any third-party intellectual property rights</li>
                    <li>Does not contain defamatory, obscene, or harmful material</li>
                    <li>Does not violate any applicable laws or regulations</li>
                    <li>Does not contain personal information of third parties without their consent</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">7.3 Scam Reports</h3>
                  <p>
                    When you submit a scam report, you authorize us to use the information to help 
                    protect the community, share anonymized data with security researchers, and 
                    potentially report to law enforcement agencies. Do not include your own 
                    sensitive personal information in scam reports.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. AI Assistant (Dezi) Terms</h2>
                  <p>Our AI assistant, Dezi, is powered by OpenAI technology. By using Dezi, you acknowledge:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>AI responses are generated based on training data and may not always be accurate or complete</li>
                    <li>Dezi provides general guidance and is not a substitute for professional cybersecurity advice</li>
                    <li>Conversations with Dezi may be analyzed to improve the Service (in anonymized form)</li>
                    <li>You should not share highly sensitive personal information (like passwords or financial account numbers) with Dezi</li>
                    <li>AI responses should be verified before taking significant actions based on them</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. Third-Party Services and Links</h2>
                  <p>
                    The Service may contain links to third-party websites or services that are not owned 
                    or controlled by GetCyberRight. We have no control over and assume no responsibility 
                    for the content, privacy policies, or practices of any third-party services.
                  </p>
                  <p>
                    When we reference or link to external resources (such as FTC, FBI IC3, CISA, or other 
                    government agencies), we do so for educational purposes. These organizations do not 
                    endorse GetCyberRight, and their inclusion does not imply any official partnership.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">10. Disclaimers</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">10.1 "As Is" Provision</h3>
                  <p className="uppercase font-semibold text-foreground">
                    THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES 
                    OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED 
                    WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND 
                    NON-INFRINGEMENT.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">10.2 No Guarantee of Security</h3>
                  <p>
                    While we provide cybersecurity education and tools, we do not and cannot guarantee 
                    that following our guidance will prevent security breaches, identity theft, financial 
                    loss, or other harm. Cybersecurity threats evolve constantly, and no educational 
                    resource can provide complete protection.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">10.3 Professional Advice</h3>
                  <p>
                    Our content is for educational and informational purposes only and does not constitute 
                    professional cybersecurity, legal, financial, or other professional advice. For specific 
                    security concerns affecting your organization, we recommend consulting with qualified 
                    cybersecurity professionals.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">10.4 Accuracy of Information</h3>
                  <p>
                    While we strive to provide accurate and up-to-date information, we make no 
                    representations or warranties about the accuracy, reliability, completeness, or 
                    timeliness of any content on the Service. Statistics, threat data, and security 
                    recommendations are based on available information at the time of publication.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">11. Limitation of Liability</h2>
                  <p className="uppercase font-semibold text-foreground">
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL GETCYBERRIGHT, 
                    ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR 
                    ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING 
                    WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, 
                    RESULTING FROM:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Your access to or use of (or inability to access or use) the Service</li>
                    <li>Any conduct or content of any third party on the Service</li>
                    <li>Any content obtained from the Service</li>
                    <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                    <li>Security incidents that occur despite following our guidance</li>
                    <li>Decisions made based on information provided through the Service</li>
                  </ul>
                  <p className="mt-4">
                    In no event shall our total liability to you for all claims arising from or related 
                    to the Service exceed the amount you paid us, if any, in the twelve (12) months 
                    immediately preceding the claim, or one hundred dollars ($100), whichever is greater.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">12. Indemnification</h2>
                  <p>
                    You agree to defend, indemnify, and hold harmless GetCyberRight and its officers, 
                    directors, employees, contractors, agents, licensors, and suppliers from and against 
                    any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees 
                    (including reasonable attorneys' fees) arising out of or relating to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any third-party rights, including intellectual property rights</li>
                    <li>Your use of the Service in an unauthorized manner</li>
                    <li>Any content you submit to the Service</li>
                    <li>Your violation of any applicable laws or regulations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">13. Dispute Resolution</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">13.1 Informal Resolution</h3>
                  <p>
                    Before filing any formal claim, you agree to first contact us at{" "}
                    <a href="mailto:legal@getcyberright.com" className="text-primary hover:underline">legal@getcyberright.com</a>{" "}
                    to attempt to resolve the dispute informally. We will try to resolve the dispute 
                    within 60 days.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">13.2 Arbitration Agreement</h3>
                  <p>
                    If we cannot resolve the dispute informally, you and ColorCode Solutions LLC agree that any 
                    dispute, claim, or controversy arising out of or relating to these Terms or the 
                    Service shall be resolved through binding arbitration administered by the American 
                    Arbitration Association in accordance with its Commercial Arbitration Rules.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">13.3 Class Action Waiver</h3>
                  <p>
                    YOU AND COLORCODE SOLUTIONS LLC AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN 
                    YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY 
                    PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">13.4 Exceptions</h3>
                  <p>
                    Notwithstanding the above, either party may seek injunctive or other equitable relief 
                    in any court of competent jurisdiction to prevent the actual or threatened infringement 
                    of intellectual property rights.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">14. Governing Law</h2>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the 
                    State of North Carolina, United States, without regard to its conflict of law provisions. 
                    Any legal action or proceeding not subject to arbitration shall be brought exclusively 
                    in the state or federal courts located in Mecklenburg County, North Carolina.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">15. General Provisions</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">15.1 Entire Agreement</h3>
                  <p>
                    These Terms, together with our Privacy Policy and any other legal notices published 
                    on the Service, constitute the entire agreement between you and GetCyberRight concerning 
                    your use of the Service.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">15.2 Severability</h3>
                  <p>
                    If any provision of these Terms is held to be invalid or unenforceable, such provision 
                    shall be struck and the remaining provisions shall be enforced to the fullest extent 
                    under law.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">15.3 Waiver</h3>
                  <p>
                    Our failure to enforce any right or provision of these Terms shall not be deemed a 
                    waiver of such right or provision. Any waiver must be in writing and signed by 
                    GetCyberRight.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">15.4 Assignment</h3>
                  <p>
                    You may not assign or transfer these Terms or your rights hereunder without our prior 
                    written consent. We may assign our rights and obligations under these Terms without 
                    restriction.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">15.5 Force Majeure</h3>
                  <p>
                    We shall not be liable for any failure or delay in performing our obligations where 
                    such failure or delay results from circumstances beyond our reasonable control, 
                    including but not limited to natural disasters, war, terrorism, riots, embargoes, 
                    acts of civil or military authorities, fire, floods, accidents, strikes, or 
                    shortages of transportation, facilities, fuel, energy, labor, or materials.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">16. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these Terms at any time. If we make material changes, 
                    we will provide notice by:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Posting a notice on the Service</li>
                    <li>Updating the "Last Updated" date at the top of these Terms</li>
                    <li>Sending an email to registered users (for significant changes)</li>
                  </ul>
                  <p className="mt-4">
                    Your continued use of the Service after any changes constitutes your acceptance of 
                    the new Terms. If you do not agree to the modified Terms, you must stop using the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">17. Contact Information</h2>
                  <p>
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="bg-muted/30 rounded-lg p-6 mt-4 border">
                    <p className="font-semibold text-foreground mb-2">ColorCode Solutions LLC</p>
                    <p className="text-sm text-muted-foreground mb-2">Operating as GetCyberRight</p>
                    <p className="mb-1">301 S McDowell Street, Suite 125</p>
                    <p className="mb-1">Charlotte, NC 28204</p>
                    <p className="mb-1">United States</p>
                    <p className="mt-4">
                      <strong className="text-foreground">Legal Inquiries:</strong>{" "}
                      <a href="mailto:legal@getcyberright.com" className="text-primary hover:underline">legal@getcyberright.com</a>
                    </p>
                    <p>
                      <strong className="text-foreground">General Support:</strong>{" "}
                      <a href="mailto:support@getcyberright.com" className="text-primary hover:underline">support@getcyberright.com</a>
                    </p>
                  </div>
                </section>

                <section className="border-t pt-8">
                  <p className="text-sm text-muted-foreground italic">
                    By using GetCyberRight, you acknowledge that you have read, understood, and agree 
                    to be bound by these Terms of Service and our Privacy Policy.
                  </p>
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
