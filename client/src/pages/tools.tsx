import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SignupEncouragementBanner } from "@/components/signup-encouragement-banner";
import { ToolsInteractive } from "@/components/tools-interactive";
import bannerImage from "@/assets/banners/tools-banner.webp";
import { imgSrc } from "@/lib/img-src";

export default function Tools({ tab }: { tab?: string }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Tools for the moments that actually matter"
          subtitle="Pick the situation you are in right now. Each tool tells you what it is for, when to use it, and what it cannot do. All free with your account."
          imageSrc={imgSrc(bannerImage)}
          imageAlt="Modern workspace with laptop displaying security checkmarks and password generator in bright natural light"
          imagePosition="left"
          colorVariant="teal"
        />

        <ToolsInteractive tab={tab} />
      </main>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SignupEncouragementBanner toolName="tools" show={true} contextMessage="Create a free account for full access to all tools" />
      </div>

      <Footer />
    </div>
  );
}
