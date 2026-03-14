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
  return (
    <section
      className="bg-[#0A2A3C] relative overflow-hidden"
      data-testid="section-page-banner"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/[0.03] to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`flex flex-col ${imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"} min-h-[320px] md:min-h-[400px] lg:min-h-[450px]`}>
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-10 md:py-16">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
              data-testid="text-banner-title"
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="mt-4 text-lg text-white/60 max-w-xl leading-relaxed"
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A2A3C]/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
