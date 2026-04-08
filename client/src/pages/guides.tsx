import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GuidesContent, type Guide } from "@/components/guides-content";
import { BookOpen } from "lucide-react";

export default function GuidesListing({ initialGuides }: { initialGuides?: Guide[] }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="bg-[#0A2A3C] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />
        <div className="absolute pointer-events-none hidden md:block" aria-hidden="true" style={{ top: 0, right: 0, width: "55%", height: "100%", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40%", right: "2%", width: "50px", height: "220%", background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-40%", right: "10%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.4) 50%, transparent 90%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-35%", right: "18%", width: "35px", height: "220%", background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.55 }} />
          <div style={{ position: "absolute", top: "-35%", right: "26%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 15%, hsla(16, 95%, 58%, 0.35) 50%, transparent 85%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-30%", right: "32%", width: "50px", height: "220%", background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.5 }} />
        </div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-[1.75rem] sm:text-3xl md:text-4xl font-extrabold tracking-[-0.025em]" data-testid="heading-guides">Cyber Safety Guides</h1>
              <p className="text-white/60 mt-2">Expert advice on staying safe online, written for real people</p>
            </div>
          </div>
        </div>
      </div>

      <GuidesContent initialGuides={initialGuides} />

      <Footer />
    </div>
  );
}
