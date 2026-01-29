import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThreatTrends } from "@/components/threat-trends";
import { PageBanner } from "@/components/page-banner";
import bannerImage from "@/assets/banners/tools-banner.png";

export default function ThreatTrendsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <PageBanner
          title="Threat Trends Dashboard"
          subtitle="Stay informed about the latest cybersecurity threats, scam statistics, and emerging attack patterns based on official government data."
          imageSrc={bannerImage}
          imageAlt="Cybersecurity threat monitoring dashboard"
          colorVariant="slate"
        />

        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ThreatTrends />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
