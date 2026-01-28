import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { LogoCarousel } from "@/components/logo-carousel";
import { TrustStrip } from "@/components/trust-strip";
import { Capabilities } from "@/components/capabilities";
import { AudienceShowcase } from "@/components/audience-showcase";
import { SocialProof } from "@/components/social-proof";
import { CTAFooter } from "@/components/cta-footer";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <LogoCarousel />
        <TrustStrip />
        <Capabilities />
        <AudienceShowcase />
        <SocialProof />
        <CTAFooter />
      </main>
      <Footer />
    </div>
  );
}
