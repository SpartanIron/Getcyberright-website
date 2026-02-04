import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { LogoCarousel } from "@/components/logo-carousel";
import { TestimonialsSection } from "@/components/testimonials-section";
import { AudienceCards } from "@/components/audience-cards";
import { FreeResourceSection } from "@/components/free-resource-section";
import { TrustStrip } from "@/components/trust-strip";
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
        <LogoCarousel />
        <TrustStrip />
        <AudienceCards />
        <TestimonialsSection />
        <FreeResourceSection />
        <CTAFooter />
      </main>
      <Footer />
    </div>
  );
}
