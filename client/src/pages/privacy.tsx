import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import bannerImage from "@/assets/banners/privacy-banner.png";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <PageBanner
          title="How We Protect Your Information"
          subtitle="Plain-language privacy policy. Last updated January 2026. We collect minimal data and never sell your information."
          imageSrc={bannerImage}
          imageAlt="Secure document environment with padlock symbolism representing data protection and privacy policy"
          imagePosition="left"
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
                  <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
                  <p>
                    At GetCyberRight, we take your privacy seriously. This Privacy Policy 
                    explains how we collect, use, and protect your personal information 
                    when you use our website and services.
                  </p>
                  <p>
                    We believe in transparency and want you to understand exactly what 
                    data we collect and why. After all, we are a cybersecurity education 
                    organization and protecting your information is at the core of what we do.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Information You Provide</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Contact information (name, email) when you submit our contact form</li>
                    <li>Email address when you subscribe to our newsletter</li>
                    <li>Any additional information you choose to share in messages</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">Automatically Collected Information</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Basic analytics data (page views, general location)</li>
                    <li>Device type and browser information</li>
                    <li>Referral source (how you found our website)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Respond to your inquiries and provide support</li>
                    <li>Send you our newsletter (if you've subscribed)</li>
                    <li>Improve our website and educational resources</li>
                    <li>Understand how our resources are being used</li>
                  </ul>
                  <p className="mt-4">
                    We <strong className="text-foreground">never</strong> sell your personal information 
                    to third parties. We <strong className="text-foreground">never</strong> share your 
                    email address with marketers.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
                  <p>
                    We implement appropriate technical and organizational measures to protect 
                    your personal information against unauthorized access, alteration, disclosure, 
                    or destruction.
                  </p>
                  <p>
                    All data transmitted to our servers is encrypted using industry-standard 
                    SSL/TLS encryption.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access the personal information we hold about you</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Unsubscribe from our newsletter at any time</li>
                    <li>Opt out of analytics tracking</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Cookies</h2>
                  <p>
                    We use minimal, essential cookies to ensure our website functions properly. 
                    We do not use cookies for advertising or tracking across other websites.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy or how we handle 
                    your data, please contact us at:
                  </p>
                  <p className="text-foreground font-medium">
                    support@getcyberright.com
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you 
                    of any significant changes by posting a notice on our website.
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
