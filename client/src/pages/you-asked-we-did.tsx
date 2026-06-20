import { YouAskedWeDid } from "@/components/you-asked-we-did";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";

export default function YouAskedWeDidPage() {
    return (
          <>
                <Navigation />
                <PageBanner
                          title="You Asked. We Did."
                          subtitle="Every change on this page came directly from user feedback. See what we built because of you."
                        />
                <YouAskedWeDid />
                <Footer />
          </>>
        );
}</>
