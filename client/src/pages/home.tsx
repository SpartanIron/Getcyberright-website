import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { HeroTools } from "@/components/hero-tools";
import { LogoCarousel } from "@/components/logo-carousel";
import { PromoVideoSection } from "@/components/promo-video-section";
import { ValueProposition } from "@/components/value-proposition";
import { FeaturesGrid } from "@/components/features-grid";
import { MissionBanner } from "@/components/mission-banner";
import { AudienceShowcase } from "@/components/audience-showcase";
import { CTAFooter } from "@/components/cta-footer";
import { Footer } from "@/components/footer";
import { SEOHead, pageSEO } from "@/components/seo-head";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.home} />
      <Navigation />
      <main id="main-content" role="main" aria-label="Main content" tabIndex={-1}>
        <HeroSection />
        <HeroTools />
        <LogoCarousel />
        <PromoVideoSection />
        <ValueProposition />
        <FeaturesGrid />
        <AudienceShowcase />
        <MissionBanner />
        <CTAFooter />
      </main>
      <Footer />
    </div>
  );
}
