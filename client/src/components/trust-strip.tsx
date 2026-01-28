const trustIndicators = [
  { label: "100% Free", sublabel: "No hidden costs" },
  { label: "No Sign-up", sublabel: "Start instantly" },
  { label: "Expert Sources", sublabel: "FBI, CISA, FTC" },
  { label: "Privacy First", sublabel: "We never sell data" },
];

export function TrustStrip() {
  return (
    <section className="bg-muted/50 border-y" data-testid="section-trust-strip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {trustIndicators.map((item) => (
            <div key={item.label} className="text-center" data-testid={`trust-${item.label.toLowerCase().replace(/\s/g, "-")}`}>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
