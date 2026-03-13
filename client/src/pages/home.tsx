import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { TrustStats } from "@/components/trust-stats";
import { TrendingThreats } from "@/components/trending-threats";
import { PillarTiles } from "@/components/pillar-tiles";
import { HeroTools } from "@/components/hero-tools";
import { ContentPreview } from "@/components/content-preview";
import { FeaturesGrid } from "@/components/features-grid";
import { RegionalScams } from "@/components/regional-scams";
import { AudienceShowcase } from "@/components/audience-showcase";
import { AuthoritySection } from "@/components/authority-section";
import { NewsletterCTA } from "@/components/newsletter-cta";
import { CTAFooter } from "@/components/cta-footer";
import { Footer } from "@/components/footer";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import type { WebSiteData, OrganizationData } from "@/components/structured-data";

const websiteSchema: WebSiteData = {
  type: "WebSite",
  name: "GetCyberRight",
  url: "https://getcyberright.com",
  description: "Free cybersecurity education platform for families, parents, kids, and seniors. Tools and training to protect against scams, data brokers, and online threats.",
  potentialAction: {
    target: "https://getcyberright.com/search?q={search_term_string}",
    queryInput: "required name=search_term_string",
  },
};

const organizationSchema: OrganizationData = {
  type: "Organization",
  name: "GetCyberRight",
  url: "https://getcyberright.com",
  logo: "https://getcyberright.com/og-image.png",
  description: "A free, family-focused cybersecurity education platform providing practical safety tools and training to protect families, parents, kids, seniors, and small businesses from online threats.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.home} />
      <StructuredData data={[websiteSchema, organizationSchema]} />
      <Navigation />
      <main id="main-content" role="main" aria-label="Main content" tabIndex={-1}>
        <HeroSection />
        <TrustStats />
        <TrendingThreats />
        <PillarTiles />
        <HeroTools />
        <ContentPreview />
        <FeaturesGrid />
        <RegionalScams />
        <AudienceShowcase />
        <AuthoritySection />
        <NewsletterCTA />
        <CTAFooter />
      </main>
      <Footer />
    </div>
  );
}
