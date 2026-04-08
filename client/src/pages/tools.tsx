import { StructuredData } from "@/components/structured-data";
import type { WebApplicationData, BreadcrumbData } from "@/components/structured-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SignupEncouragementBanner } from "@/components/signup-encouragement-banner";
import { ToolsInteractive } from "@/components/tools-interactive";
import bannerImage from "@/assets/banners/tools-banner.webp";

const toolsSchemas: WebApplicationData[] = [
  {
    type: "WebApplication",
    name: "GCR Scam Guard",
    description: "AI-powered tool to check if URLs, emails, phone numbers, and QR codes are scams. Analyzes threats using multiple security engines.",
    url: "https://www.getcyberright.com/tools",
    applicationCategory: "SecurityApplication",
    provider: "GetCyberRight",
  },
  {
    type: "WebApplication",
    name: "GCR Data Shield - Personal Data Exposure Scanner",
    description: "Scan for your exposed personal information across data broker sites and breach databases. No account needed to get started.",
    url: "https://www.getcyberright.com/shield",
    applicationCategory: "SecurityApplication",
    provider: "GetCyberRight",
  },
];

const toolsBreadcrumbs: BreadcrumbData = {
  type: "BreadcrumbList",
  items: [
    { name: "Home", url: "https://www.getcyberright.com/" },
    { name: "Protection Hub", url: "https://www.getcyberright.com/tools" },
  ],
};

export default function Tools() {
  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[...toolsSchemas, toolsBreadcrumbs]} />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Protection Hub"
          subtitle="Two products, one mission: keeping your family safe online. All tools and features are completely free with your account."
          imageSrc={bannerImage}
          imageAlt="Modern workspace with laptop displaying security checkmarks and password generator in bright natural light"
          imagePosition="left"
          colorVariant="teal"
        />

        <ToolsInteractive />

        <section className="py-16 sm:py-20 bg-red-50 dark:bg-red-950/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Been Scammed? Get Help Now
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              If you think you've been scammed, don't panic. We have step-by-step guidance
              on what to do next to minimize damage and report the scam.
            </p>
          </div>
        </section>
      </main>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SignupEncouragementBanner toolName="tools" show={true} contextMessage="Create a free account for full access to all tools" />
      </div>

      <Footer />
    </div>
  );
}
