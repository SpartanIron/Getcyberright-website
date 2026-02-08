import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, ArrowRight, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function HeroTools() {
  return (
    <section className="py-16 sm:py-20 bg-muted/30" data-testid="section-hero-tools">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Try Our Tools</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Take Action Right Now
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start protecting yourself in seconds. No account needed for our free tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/data-removal">
              <Card className="h-full hover-elevate cursor-pointer group" data-testid="card-hero-data-scan">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <Trash2 className="w-7 h-7 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-semibold text-foreground">Scan for Your Exposed Data</h3>
                        <Badge variant="secondary" className="text-[10px]">Free Scan</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Discover which of 500+ data brokers are selling your personal information. See exactly what's exposed and take action to remove it.
                      </p>
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        Start Free Scan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link href="/tools">
              <Card className="h-full hover-elevate cursor-pointer group" data-testid="card-hero-security-scanner">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Search className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-semibold text-foreground">Check Something Suspicious</h3>
                        <Badge variant="secondary" className="text-[10px]">Free</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Got a sketchy link, email, or phone call? Paste it in and get an instant risk assessment with detailed analysis.
                      </p>
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        Open Security Scanner <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
