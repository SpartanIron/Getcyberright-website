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
import { StructuredData } from "@/components/structured-data";
import { BreachChecker } from "@/components/breach-checker";
import type { WebSiteData, OrganizationData } from "@/components/structured-data";

const websiteSchema: WebSiteData = {
  type: "WebSite",
  name: "GetCyberRight",
  url: "https://www.getcyberright.com",
  description: "Free cybersecurity education platform for families, parents, kids, and seniors. Tools and training to protect against scams, data brokers, and online threats.",
  potentialAction: {
    target: "https://www.getcyberright.com/search?q={search_term_string}",
    queryInput: "required name=search_term_string",
  },
};

const organizationSchema: OrganizationData = {
  type: "Organization",
  name: "GetCyberRight",
  url: "https://www.getcyberright.com",
  logo: "https://www.getcyberright.com/og-image.png",
  description: "A free, family-focused cybersecurity education platform providing practical safety tools and training to protect families, parents, kids, seniors, and small businesses from online threats.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[websiteSchema, organizationSchema]} />
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
