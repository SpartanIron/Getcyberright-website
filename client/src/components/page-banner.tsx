interface PageBannerProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
  colorVariant?: "slate" | "teal" | "indigo" | "red" | "blue";
}

const colorClasses = {
  slate: "bg-slate-900",
  teal: "bg-teal-900",
  indigo: "bg-indigo-900",
  red: "bg-red-950",
  blue: "bg-blue-900",
};

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
      className={colorClasses[colorVariant]}
      data-testid="section-page-banner"
    >
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col ${imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"} min-h-[280px] md:min-h-[320px]`}>
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-10 md:py-16">
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
              data-testid="text-banner-title"
            >
              {title}
            </h1>
            {subtitle && (
              <p 
                className="mt-4 text-lg text-white/80 max-w-xl leading-relaxed"
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
              className="w-full h-48 md:h-full object-cover"
              loading="eager"
              data-testid="img-banner"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
