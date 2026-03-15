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
  imagePosition = "left",
  colorVariant = "teal",
}: PageBannerProps) {
  const stripeColor = {
    slate: "rgba(148,163,184,0.12)",
    teal: "rgba(45,212,191,0.15)",
    indigo: "rgba(129,140,248,0.12)",
    red: "rgba(248,113,113,0.12)",
    blue: "rgba(96,165,250,0.12)",
  }[colorVariant];

  const imgLeft = imagePosition === "left";

  return (
    <section
      className="bg-[#0A2A3C] relative overflow-hidden h-[240px] sm:h-[280px] md:h-[340px] lg:h-[380px]"
      data-testid="section-page-banner"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />

      <div
        className="absolute pointer-events-none hidden md:block"
        aria-hidden="true"
        style={{
          top: 0,
          right: imgLeft ? 0 : "auto",
          left: imgLeft ? "auto" : 0,
          width: "50%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40%",
            left: "50%",
            marginLeft: "-1px",
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
            left: "50%",
            marginLeft: "30px",
            width: "40px",
            height: "220%",
            background: `linear-gradient(180deg, transparent 5%, ${stripeColor} 50%, transparent 95%)`,
            transform: "rotate(20deg)",
            transformOrigin: "top center",
            opacity: 0.5,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 h-full">
        <div className={`flex h-full ${imgLeft ? "flex-col md:flex-row" : "flex-col md:flex-row-reverse"}`}>
          <div className="md:w-[45%] lg:w-[42%] relative overflow-hidden order-first flex-shrink-0 h-[120px] sm:h-[140px] md:h-full">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              sizes="(max-width: 768px) 100vw, 45vw"
              data-testid="img-banner"
            />
            <div
              className="absolute inset-0"
              style={{
                background: imgLeft
                  ? "linear-gradient(to right, transparent 40%, rgba(10,42,60,0.65) 100%)"
                  : "linear-gradient(to left, transparent 40%, rgba(10,42,60,0.65) 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0A2A3C]/60 to-transparent md:hidden" />
          </div>

          <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-6 md:py-0">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-[1.1] tracking-tight"
              data-testid="text-banner-title"
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="mt-3 sm:mt-4 text-base sm:text-lg text-white/75 max-w-xl leading-relaxed"
                data-testid="text-banner-subtitle"
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
