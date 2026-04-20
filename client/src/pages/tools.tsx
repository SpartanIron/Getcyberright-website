import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SignupEncouragementBanner } from "@/components/signup-encouragement-banner";
import { ToolsInteractive } from "@/components/tools-interactive";
import { Link } from "@/lib/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <Link
            href="/parents"
            className="flex items-start gap-3 p-4 rounded-lg border border-teal-500/30 bg-teal-500/5 hover-elevate"
            data-testid="link-proactive-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground">Want to set things up before something goes wrong?</p>
              <p className="text-sm text-muted-foreground">Start with the Proactive Protection guides for parents, kids, and seniors. Most problems can be prevented in a single weekend.</p>
            </div>
            <ArrowRight className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
          </Link>
        </div>

        <ToolsInteractive tab={tab} />
      </main>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SignupEncouragementBanner toolName="tools" show={true} contextMessage="Create a free account for full access to all tools" />
      </div>

      <Footer />
    </div>
  );
}
