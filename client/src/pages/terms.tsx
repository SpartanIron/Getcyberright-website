import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import bannerImage from "@/assets/images/banner-terms.png";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <PageBanner
          title="Terms of Service"
          subtitle="Last updated: January 2026. Please read these terms carefully before using our services."
          imageSrc={bannerImage}
          imageAlt="Legal document representing terms of service"
          imagePosition="right"
        />

        <section className="py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg max-w-none"
            >
              <div className="space-y-8 text-muted-foreground">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Agreement to Terms</h2>
                  <p>
                    By accessing or using GetCyberRight's website and services, you agree to 
                    be bound by these Terms of Service. If you do not agree to these terms, 
                    please do not use our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Services</h2>
                  <p>
                    GetCyberRight provides free cybersecurity education resources, including 
                    but not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Educational articles and guides</li>
                    <li>Safety checklists and assessments</li>
                    <li>Downloadable resources and tools</li>
                    <li>Newsletter and email communications</li>
                  </ul>
                  <p className="mt-4">
                    All resources are provided for educational purposes only and should not 
                    be considered professional cybersecurity advice.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">User Responsibilities</h2>
                  <p>When using our services, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate information when contacting us</li>
                    <li>Use our resources for lawful purposes only</li>
                    <li>Not attempt to access unauthorized areas of our systems</li>
                    <li>Not redistribute our content without permission</li>
                    <li>Report any security vulnerabilities you discover</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Intellectual Property</h2>
                  <p>
                    All content on GetCyberRight, including text, graphics, logos, and 
                    educational materials, is the property of GetCyberRight and is protected 
                    by copyright laws.
                  </p>
                  <p>
                    You may download and print our resources for personal, non-commercial 
                    use. For educational institutions and community organizations, please 
                    contact us for permission to use materials in group settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Disclaimer</h2>
                  <p>
                    GetCyberRight's resources are provided "as is" without warranty of any 
                    kind. While we strive to provide accurate and up-to-date information, 
                    cybersecurity threats evolve rapidly.
                  </p>
                  <p>
                    We are not responsible for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Any losses resulting from following our general guidance</li>
                    <li>Third-party websites or services we may reference</li>
                    <li>Decisions made based on our educational content</li>
                  </ul>
                  <p className="mt-4">
                    For specific security concerns, we recommend consulting with a 
                    qualified cybersecurity professional.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
                  <p>
                    To the maximum extent permitted by law, GetCyberRight shall not be 
                    liable for any indirect, incidental, special, or consequential damages 
                    arising from your use of our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Newsletter and Communications</h2>
                  <p>
                    By subscribing to our newsletter, you consent to receive periodic 
                    emails from us containing cybersecurity tips, scam alerts, and updates 
                    about our resources.
                  </p>
                  <p>
                    You can unsubscribe at any time by clicking the unsubscribe link in 
                    any email or by contacting us directly.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these Terms of Service at any time. 
                    Changes will be effective immediately upon posting to our website. 
                    Your continued use of our services after changes constitutes acceptance 
                    of the new terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Governing Law</h2>
                  <p>
                    These Terms of Service shall be governed by and construed in accordance 
                    with the laws of the United States, without regard to conflict of law 
                    principles.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Contact</h2>
                  <p>
                    If you have questions about these Terms of Service, please contact us at:
                  </p>
                  <p className="text-foreground font-medium">
                    support@getcyberright.com
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
