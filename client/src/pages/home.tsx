import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { TrustSignals } from "@/components/trust-signals";
import { ToolsCarousel } from "@/components/tools-carousel";
import { AudienceShowcase } from "@/components/audience-showcase";
import { ExpertBanner } from "@/components/expert-banner";
import { Testimonials } from "@/components/testimonials";
import { TrustedBy } from "@/components/trusted-by";
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
        <ToolsCarousel />
        <AudienceShowcase />
        <ExpertBanner />
        <Testimonials />
        <TrustedBy />
        <Newsletter />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
