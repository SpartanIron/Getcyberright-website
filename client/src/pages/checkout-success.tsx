import { useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function CheckoutSuccess() {
  useEffect(() => {
    document.title = "Subscription Confirmed - GetCyberRight";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Welcome to GetCyberRight!
                </h1>
                
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Your subscription is now active. You have full access to premium 
                  security tools, training materials, and exclusive content.
                </p>
                
                <div className="space-y-4">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>A confirmation email has been sent to your inbox.</p>
                    <p className="mt-1">
                      Need help?{" "}
                      <a 
                        href="mailto:info@getcyberright.com" 
                        className="text-primary hover:underline"
                      >
                        Contact Support
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
