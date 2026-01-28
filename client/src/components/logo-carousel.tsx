const logos = [
  { name: "SafeGuard", text: "SAFEGUARD" },
  { name: "DataTrust", text: "DataTrust" },
  { name: "CyberShield", text: "CYBERSHIELD" },
  { name: "NetSecure", text: "NetSecure" },
  { name: "TechCorp", text: "TECHCORP" },
  { name: "SecureBank", text: "SecureBank" },
];

export function LogoCarousel() {
  return (
    <section className="py-12 bg-background border-y border-border/50" data-testid="section-logo-carousel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">
          Trusted by organizations worldwide
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center"
              data-testid={`logo-${logo.name.toLowerCase()}`}
            >
              <span className="text-lg font-semibold text-muted-foreground/50 whitespace-nowrap tracking-wide">
                {logo.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
