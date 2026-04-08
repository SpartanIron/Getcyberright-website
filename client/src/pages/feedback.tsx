"use client";

import { useEffect } from "react";
import { useLocation } from "@/lib/navigation";

export default function Feedback() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation("/contact?topic=feedback");
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting to contact form...</p>
    </div>
  );
}
