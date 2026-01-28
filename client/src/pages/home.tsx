import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { TrustSignals } from "@/components/trust-signals";
import { Features } from "@/components/features";
import { AudienceShowcase } from "@/components/audience-showcase";
import { Testimonials } from "@/components/testimonials";
import { ContactForm } from "@/components/contact-form";
import { Newsletter } from "@/components/newsletter";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <TrustSignals />
        <Features />
        <AudienceShowcase />
        <Testimonials />
        <Newsletter />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
