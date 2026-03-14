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
    <section className="py-5 bg-muted/50 border-y border-border" data-testid="section-trust-strip">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Shield className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
              Intelligence from
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1">
            {sources.map((source) => (
              <span
                key={source}
                className="text-[13px] font-medium text-muted-foreground/70"
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
