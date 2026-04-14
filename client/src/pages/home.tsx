import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { LiveActivityBar } from "@/components/live-activity-bar";
import { HowItWorks } from "@/components/how-it-works";
import { ThreatAwareness } from "@/components/threat-awareness";
import { PillarTiles } from "@/components/pillar-tiles";
import { AudiencePaths } from "@/components/audience-paths";
import { ContentPreview } from "@/components/content-preview";
import { NewsletterCTA } from "@/components/newsletter-cta";
import { Footer } from "@/components/footer";
import { ScamGlobeTeaser } from "@/components/scam-globe-teaser";
import { StructuredData } from "@/components/structured-data";

export default function Home() {
    return (
          <div className="min-h-screen bg-background">
                <StructuredData data={[
            {
                        type: "Organization",
                        name: "GetCyberRight",
                        url: "https://www.getcyberright.com",
                        logo: "https://www.getcyberright.com/logo.png",
                        description: "Free cybersecurity education and scam-checking tools for families, parents, seniors, and kids.",
                        sameAs: [
                                      "https://www.facebook.com/getcyberright",
                                      "https://twitter.com/getcyberright",
                                      "https://www.linkedin.com/company/getcyberright"
                                    ]
            },
            {
                        type: "WebSite",
                        name: "GetCyberRight",
                        url: "https://www.getcyberright.com",
                        description: "Free cybersecurity education and tools to help families stay safe online.",
                        potentialAction: {
                                      queryInput: "required name=search_term_string",
                                      target: "https://www.getcyberright.com/search?q={search_term_string}"
                        }
            }
                  ]} />
                <Navigation />
                <main id="main-content" role="main" aria-label="Main content" tabIndex={-1}>
                        <HeroSection />
                        <LiveActivityBar />
                        <HowItWorks />
                        <ThreatAwareness />
                        <ScamGlobeTeaser />
                        <PillarTiles />
                        <AudiencePaths />
                        <ContentPreview />
                        <NewsletterCTA />
                </main>main>
                <Footer />
          </div>div>
        );
}</div>
