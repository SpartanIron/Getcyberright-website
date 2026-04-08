import { useEffect } from "react";
import { useLocation } from "@/lib/navigation";
import { useSEO } from "@/hooks/use-seo";

export default function Feedback() {
  const [, setLocation] = useLocation();
  
  useSEO({
    title: "Feedback - Help Us Improve | GetCyberRight",
    description: "Share your feedback to help us improve GetCyberRight. Your voice matters in building a safer digital world for everyone.",
    keywords: "getcyberright feedback, cybersecurity suggestions, improve online safety"
  });

  useEffect(() => {
    setLocation("/contact?topic=feedback");
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting to contact form...</p>
    </div>
  );
}
