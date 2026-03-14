import { Shield } from "lucide-react";

const sources = [
  "FBI IC3",
  "CISA",
  "INTERPOL",
  "Europol",
  "FTC",
  "NIST",
  "PhishTank",
  "VirusTotal",
];

export function TrustStrip() {
  return (
    <section className="py-8 sm:py-10 bg-slate-50 dark:bg-slate-800/50 border-y border-border" data-testid="section-trust-strip">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
              Data from
            </span>
          </div>
          <div className="w-px h-6 bg-border hidden sm:block" />
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 sm:gap-x-8 gap-y-2">
            {sources.map((source) => (
              <span
                key={source}
                className="text-[15px] font-semibold text-foreground/70 hover:text-foreground transition-colors"
                data-testid={`text-trust-source-${source.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
