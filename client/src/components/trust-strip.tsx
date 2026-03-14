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
    <section className="py-6 sm:py-8 bg-muted/50 border-y border-border" data-testid="section-trust-strip">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
              Intelligence from
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 sm:gap-x-8 gap-y-2">
            {sources.map((source) => (
              <span
                key={source}
                className="text-[15px] font-semibold text-muted-foreground/60"
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
