import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
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
