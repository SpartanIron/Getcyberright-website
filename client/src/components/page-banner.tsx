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
}: PageBannerProps) {
  const imgLeft = imagePosition === "left";

  return (
    <section
      className="bg-hero relative overflow-hidden h-[260px] sm:h-[300px] md:h-[360px] lg:h-[400px]"
      data-testid="section-page-banner"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-hero via-hero to-hero dark:from-[#0A2A3C] dark:via-[#0A2A3C] dark:to-[#00293C]" />

      <div
        className="absolute pointer-events-none hidden md:block"
        aria-hidden="true"
        style={{
          top: 0,
          right: imgLeft ? 0 : "auto",
          left: imgLeft ? "auto" : 0,
          width: "55%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40%",
            right: imgLeft ? "2%" : "auto",
            left: imgLeft ? "auto" : "2%",
            width: "50px",
            height: "220%",
            background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)",
            transform: "rotate(20deg)",
            transformOrigin: "top center",
            filter: "drop-shadow(0 0 18px rgba(13, 148, 136, 0.15))",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-40%",
            right: imgLeft ? "10%" : "auto",
            left: imgLeft ? "auto" : "10%",
            width: "2px",
            height: "220%",
            background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.4) 50%, transparent 90%)",
            transform: "rotate(20deg)",
            transformOrigin: "top center",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-35%",
            right: imgLeft ? "18%" : "auto",
            left: imgLeft ? "auto" : "18%",
            width: "35px",
            height: "220%",
            background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)",
            transform: "rotate(20deg)",
            transformOrigin: "top center",
            opacity: 0.55,
            filter: "drop-shadow(0 0 24px rgba(45, 212, 191, 0.3))",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-35%",
            right: imgLeft ? "26%" : "auto",
            left: imgLeft ? "auto" : "26%",
            width: "2px",
            height: "220%",
            background: "linear-gradient(180deg, transparent 15%, hsla(16, 95%, 58%, 0.35) 50%, transparent 85%)",
            transform: "rotate(20deg)",
            transformOrigin: "top center",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-30%",
            right: imgLeft ? "32%" : "auto",
            left: imgLeft ? "auto" : "32%",
            width: "50px",
            height: "220%",
            background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)",
            transform: "rotate(20deg)",
            transformOrigin: "top center",
            opacity: 0.5,
            filter: "drop-shadow(0 0 22px hsla(16, 95%, 55%, 0.25))",
          }}
        />
      </div>

      <div
        className="absolute -bottom-24 w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[100px]"
        style={{
          left: imgLeft ? "-8%" : "auto",
          right: imgLeft ? "auto" : "-8%",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 h-full">
        <div className={`flex h-full ${imgLeft ? "flex-col md:flex-row" : "flex-col md:flex-row-reverse"}`}>
          <div className="md:w-[45%] lg:w-[42%] relative overflow-hidden order-first flex-shrink-0 h-[130px] sm:h-[150px] md:h-full">
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
              className="absolute inset-0 hidden md:block"
              style={{
                background: imgLeft
                  ? "linear-gradient(to right, transparent 50%, rgba(10,42,60,0.7) 100%)"
                  : "linear-gradient(to left, transparent 50%, rgba(10,42,60,0.7) 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-hero to-transparent dark:from-[#0A2A3C] md:hidden" />
          </div>

          <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-14 py-5 md:py-0">
            <h1
              className="text-[1.75rem] sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-[1.08] tracking-[-0.025em]"
              data-testid="text-banner-title"
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="mt-3 sm:mt-4 text-[0.95rem] sm:text-lg text-white/70 max-w-lg leading-relaxed"
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
