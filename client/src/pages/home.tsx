import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { LiveActivityBar } from "@/components/live-activity-bar";
import { TrustStrip } from "@/components/trust-strip";
import { HowItWorks } from "@/components/how-it-works";
import { PillarTiles } from "@/components/pillar-tiles";
import { PromoBanners } from "@/components/promo-banners";
import { ThreatAwareness } from "@/components/threat-awareness";
import { ContentPreview } from "@/components/content-preview";
import { FeaturedGuide } from "@/components/featured-guides";
import { AudiencePaths } from "@/components/audience-paths";
import { AuthoritySection } from "@/components/authority-section";
import { Testimonials } from "@/components/testimonials";
import { NewsletterCTA } from "@/components/newsletter-cta";
import { CTAFooter } from "@/components/cta-footer";
import { Footer } from "@/components/footer";
import { BreachChecker } from "@/components/breach-checker";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" aria-label="Main content" tabIndex={-1}>
        <HeroSection />
        <LiveActivityBar />
        <TrustStrip />
        <HowItWorks />
        <section id="breach-checker" className="py-16 px-4 max-w-3xl mx-auto scroll-mt-24">
          <BreachChecker />
        </section>
        <ThreatAwareness />
        <PillarTiles />
        <PromoBanners />
        <AudiencePaths />
        <AuthoritySection />
        <Testimonials />
        <ContentPreview />
        <FeaturedGuide />
        <NewsletterCTA />
        <CTAFooter />
      </main>
      <Footer />
    </div>
  );
}
