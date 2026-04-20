import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { RealityDoors } from "@/components/reality-doors";
import { LiveActivityBar } from "@/components/live-activity-bar";
import { ThreatAwareness } from "@/components/threat-awareness";
import { PillarTiles } from "@/components/pillar-tiles";
import { AudiencePaths } from "@/components/audience-paths";
import { ContentPreview } from "@/components/content-preview";
import { NewsletterCTA } from "@/components/newsletter-cta";
import { Footer } from "@/components/footer";
import { ScamGlobeTeaser } from "@/components/scam-globe-teaser";

export default function Home() {
    return (
          <div className="min-h-screen bg-background">
                <Navigation />
                <main id="main-content" role="main" aria-label="Main content" tabIndex={-1}>
                        <HeroSection />
                        <RealityDoors />
                        <LiveActivityBar />
                        <ThreatAwareness />
                        <ScamGlobeTeaser />
                        <PillarTiles />
                        <AudiencePaths />
                        <ContentPreview />
                        <NewsletterCTA />
                </main>
                <Footer />
          </div>
        );
}
