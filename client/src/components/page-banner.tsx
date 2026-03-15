interface PageBannerProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
  colorVariant?: "slate" | "teal" | "indigo" | "red" | "blue";
}

export function PageBanner({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  imagePosition = "right",
  colorVariant = "slate",
}: PageBannerProps) {
  const accentColor = {
    slate: "rgba(148,163,184,0.06)",
    teal: "rgba(45,212,191,0.06)",
    indigo: "rgba(129,140,248,0.06)",
    red: "rgba(248,113,113,0.06)",
    blue: "rgba(96,165,250,0.06)",
  }[colorVariant];

  const stripeColor = {
    slate: "rgba(148,163,184,0.12)",
    teal: "rgba(45,212,191,0.15)",
    indigo: "rgba(129,140,248,0.12)",
    red: "rgba(248,113,113,0.12)",
    blue: "rgba(96,165,250,0.12)",
  }[colorVariant];

  return (
    <section
      className="bg-[#0A2A3C] relative overflow-hidden"
      data-testid="section-page-banner"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />

      <div
        className="absolute pointer-events-none hidden md:block"
        aria-hidden="true"
        style={{
          top: 0,
          right: imagePosition === "left" ? "auto" : 0,
          left: imagePosition === "left" ? 0 : "auto",
          width: "55%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40%",
            right: imagePosition === "left" ? "auto" : "15%",
            left: imagePosition === "left" ? "15%" : "auto",
            width: "2px",
            height: "220%",
            background: `linear-gradient(180deg, transparent 10%, ${stripeColor} 50%, transparent 90%)`,
            transform: "rotate(20deg)",
            transformOrigin: "top center",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-35%",
            right: imagePosition === "left" ? "auto" : "22%",
            left: imagePosition === "left" ? "22%" : "auto",
            width: "40px",
            height: "220%",
            background: `linear-gradient(180deg, transparent 5%, ${stripeColor} 50%, transparent 95%)`,
            transform: "rotate(20deg)",
            transformOrigin: "top center",
            opacity: 0.5,
          }}
        />
      </div>

      <div
        className="absolute -bottom-24 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          background: accentColor,
          left: imagePosition === "left" ? "auto" : "-10%",
          right: imagePosition === "left" ? "-10%" : "auto",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`flex flex-col ${imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"} min-h-[280px] md:min-h-[360px] lg:min-h-[420px]`}>
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-10 md:py-16">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.08] tracking-tight"
              data-testid="text-banner-title"
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="mt-5 text-lg text-white/75 max-w-xl leading-relaxed"
                data-testid="text-banner-subtitle"
              >
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex-1 relative overflow-hidden order-first md:order-none">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-56 md:h-full object-cover"
              loading="eager"
              decoding="async"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-testid="img-banner"
            />
            <div
              className="absolute inset-0"
              style={{
                background: imagePosition === "left"
                  ? "linear-gradient(to left, rgba(10,42,60,0.55) 0%, transparent 60%)"
                  : "linear-gradient(to right, rgba(10,42,60,0.55) 0%, transparent 60%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A2A3C]/50 to-transparent md:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
