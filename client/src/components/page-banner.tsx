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

function DecorativeCircles({ position }: { position: "left" | "right" }) {
  const isRight = position === "right";
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Deep red circle - largest, furthest back */}
      <div 
        className="absolute rounded-full"
        style={{
          width: "clamp(280px, 40vw, 500px)",
          height: "clamp(280px, 40vw, 500px)",
          bottom: "-30%",
          ...(isRight ? { right: "-10%" } : { left: "-10%" }),
          backgroundColor: "rgba(185, 28, 28, 0.55)",
        }}
      />
      
      {/* Muted orange circle - medium, middle layer */}
      <div 
        className="absolute rounded-full"
        style={{
          width: "clamp(220px, 32vw, 400px)",
          height: "clamp(220px, 32vw, 400px)",
          bottom: "-15%",
          ...(isRight ? { right: "-5%" } : { left: "-5%" }),
          backgroundColor: "rgba(234, 88, 12, 0.45)",
        }}
      />
      
      {/* Soft blue circle - smallest, front layer */}
      <div 
        className="absolute rounded-full"
        style={{
          width: "clamp(160px, 24vw, 300px)",
          height: "clamp(160px, 24vw, 300px)",
          bottom: "0%",
          ...(isRight ? { right: "-8%" } : { left: "-8%" }),
          backgroundColor: "rgba(59, 130, 246, 0.4)",
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
  const circlePosition = imagePosition === "left" ? "right" : "left";
  
  return (
    <section 
      className={`${colorClasses[colorVariant]} relative overflow-hidden`}
      data-testid="section-page-banner"
    >
      {/* Decorative circles at the outer edge of the section */}
      <DecorativeCircles position={circlePosition} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`flex flex-col ${imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"} min-h-[320px] md:min-h-[400px] lg:min-h-[450px]`}>
          {/* Text content section */}
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
          
          {/* Image section */}
          <div className="flex-1 relative overflow-hidden order-first md:order-none">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-56 md:h-full object-cover"
              loading="eager"
              decoding="async"
              data-testid="img-banner"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
