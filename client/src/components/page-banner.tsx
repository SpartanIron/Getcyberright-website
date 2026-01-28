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

function DecorativeCircles() {
  return (
    <div 
      className="absolute bottom-0 right-0 pointer-events-none overflow-hidden w-full h-full"
      aria-hidden="true"
    >
      {/* Deep red circle - largest, furthest back */}
      <div 
        className="absolute rounded-full"
        style={{
          width: "clamp(200px, 30vw, 380px)",
          height: "clamp(200px, 30vw, 380px)",
          bottom: "-20%",
          right: "-10%",
          backgroundColor: "rgba(185, 28, 28, 0.35)",
        }}
      />
      
      {/* Muted orange circle - medium, middle layer */}
      <div 
        className="absolute rounded-full"
        style={{
          width: "clamp(160px, 24vw, 300px)",
          height: "clamp(160px, 24vw, 300px)",
          bottom: "-8%",
          right: "5%",
          backgroundColor: "rgba(234, 88, 12, 0.28)",
        }}
      />
      
      {/* Soft blue circle - smallest, front layer */}
      <div 
        className="absolute rounded-full"
        style={{
          width: "clamp(120px, 18vw, 220px)",
          height: "clamp(120px, 18vw, 220px)",
          bottom: "8%",
          right: "-5%",
          backgroundColor: "rgba(59, 130, 246, 0.25)",
        }}
      />
    </div>
  );
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
      className={colorClasses[colorVariant]}
      data-testid="section-page-banner"
    >
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col ${imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"} min-h-[280px] md:min-h-[320px]`}>
          {/* Text content section with decorative circles */}
          <div className="flex-1 relative overflow-hidden">
            {/* Decorative circles positioned in corner of solid-color section */}
            <DecorativeCircles />
            
            {/* Text content */}
            <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-8 lg:px-12 py-10 md:py-16">
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
          </div>
          
          {/* Image section */}
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
