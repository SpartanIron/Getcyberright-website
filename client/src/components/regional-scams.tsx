import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Shield, ChevronDown, ChevronUp, Lightbulb, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getScamProfileByRegion, ALL_REGIONS, type RegionalScamProfile } from "@shared/regions";

import scamGovernment from "@/assets/images/scam-government.png";
import scamHealthcare from "@/assets/images/scam-healthcare.png";
import scamFinancial from "@/assets/images/scam-financial.png";
import scamRomance from "@/assets/images/scam-romance.png";
import scamPhone from "@/assets/images/scam-phone.png";
import scamAiDeepfake from "@/assets/images/scam-ai-deepfake.png";
import scamTechSupport from "@/assets/images/scam-tech-support.png";
import scamPhishing from "@/assets/images/scam-phishing.png";
import scamIdentity from "@/assets/images/scam-identity.png";
import scamDelivery from "@/assets/images/scam-delivery.png";
import scamBusiness from "@/assets/images/scam-business.png";
import scamInvestment from "@/assets/images/scam-investment.png";
import scamImpersonation from "@/assets/images/scam-impersonation.png";
import scamMalware from "@/assets/images/scam-malware.png";
import scamGeneral from "@/assets/images/scam-general.png";

const TIMEZONE_REGION_MAP: Record<string, string> = {
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Phoenix": "US",
  "America/Anchorage": "US",
  "Pacific/Honolulu": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/Edmonton": "CA",
  "America/Winnipeg": "CA",
  "America/Halifax": "CA",
  "Europe/London": "UK",
  "Europe/Paris": "EU",
  "Europe/Berlin": "EU",
  "Europe/Madrid": "EU",
  "Europe/Rome": "EU",
  "Europe/Amsterdam": "EU",
  "Europe/Brussels": "EU",
  "Europe/Vienna": "EU",
  "Europe/Stockholm": "EU",
  "Europe/Warsaw": "EU",
  "Europe/Lisbon": "EU",
  "Europe/Dublin": "UK",
  "Europe/Athens": "EU",
  "Europe/Helsinki": "EU",
  "Europe/Bucharest": "EU",
  "Europe/Prague": "EU",
  "Europe/Budapest": "EU",
  "Europe/Copenhagen": "EU",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Australia/Brisbane": "AU",
  "Australia/Perth": "AU",
  "Pacific/Auckland": "NZ",
  "Africa/Lagos": "AF",
  "Africa/Accra": "AF",
  "Africa/Dakar": "AF",
  "Africa/Abidjan": "AF",
  "Africa/Nairobi": "AF",
  "Africa/Dar_es_Salaam": "AF",
  "Africa/Kampala": "AF",
  "Africa/Addis_Ababa": "AF",
  "Africa/Johannesburg": "AF",
  "Africa/Harare": "AF",
  "Africa/Maputo": "AF",
  "Africa/Cairo": "AF",
  "Africa/Casablanca": "AF",
  "America/Sao_Paulo": "SA",
  "America/Buenos_Aires": "SA",
  "America/Bogota": "SA",
  "America/Lima": "SA",
  "America/Santiago": "SA",
  "America/Mexico_City": "SA",
  "Asia/Kolkata": "AS_SOUTH",
  "Asia/Karachi": "AS_SOUTH",
  "Asia/Dhaka": "AS_SOUTH",
  "Asia/Colombo": "AS_SOUTH",
  "Asia/Manila": "AS_SOUTHEAST",
  "Asia/Jakarta": "AS_SOUTHEAST",
  "Asia/Singapore": "AS_SOUTHEAST",
  "Asia/Kuala_Lumpur": "AS_SOUTHEAST",
  "Asia/Bangkok": "AS_SOUTHEAST",
  "Asia/Ho_Chi_Minh": "AS_SOUTHEAST",
};

function detectRegion(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONE_REGION_MAP[tz] || "GLOBAL";
  } catch {
    return "GLOBAL";
  }
}

const categoryImageMap: Record<string, string> = {
  "Government": scamGovernment,
  "Healthcare": scamHealthcare,
  "Financial": scamFinancial,
  "Romance": scamRomance,
  "Phone": scamPhone,
  "AI/Deepfake": scamAiDeepfake,
  "Tech Support": scamTechSupport,
  "Phishing": scamPhishing,
  "Identity": scamIdentity,
  "Delivery": scamDelivery,
  "Business": scamBusiness,
  "Investment": scamInvestment,
  "Impersonation": scamImpersonation,
  "Malware": scamMalware,
  "Fraud": scamFinancial,
  "Employment": scamBusiness,
  "Utility": scamGovernment,
};

function getCategoryImage(category?: string): string {
  if (!category) return scamGeneral;
  return categoryImageMap[category] || scamGeneral;
}

const severityConfig: Record<string, { border: string; bg: string; text: string; label: string; dot: string }> = {
  critical: {
    border: "border-red-400/60 dark:border-red-500/40",
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-300",
    label: "Critical",
    dot: "bg-red-500",
  },
  high: {
    border: "border-orange-400/60 dark:border-orange-500/40",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-700 dark:text-orange-300",
    label: "High Risk",
    dot: "bg-orange-500",
  },
  medium: {
    border: "border-amber-400/60 dark:border-amber-500/40",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-300",
    label: "Moderate",
    dot: "bg-amber-500",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function RegionalScams() {
  const detectedRegion = useMemo(() => detectRegion(), []);
  const [selectedRegion, setSelectedRegion] = useState(detectedRegion);
  const [showAll, setShowAll] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);

  const profile: RegionalScamProfile = useMemo(
    () => getScamProfileByRegion(selectedRegion),
    [selectedRegion]
  );

  const displayedScams = showAll ? profile.scams : profile.scams.slice(0, 6);

  const regionOptions = [
    ...ALL_REGIONS.filter(r => r.code !== "GLOBAL"),
    { code: "AS_SOUTH", name: "South Asia", country: "South Asia" },
    { code: "AS_SOUTHEAST", name: "Southeast Asia", country: "Southeast Asia" },
    { code: "SA", name: "Latin America", country: "Latin America" },
    { code: "NZ", name: "New Zealand", country: "New Zealand" },
    { code: "GLOBAL", name: "Global / Other", country: "International" },
  ].filter((v, i, a) => a.findIndex(t => t.code === v.code) === i);

  return (
    <section
      className="py-12 sm:py-16 bg-background"
      aria-labelledby="regional-scams-heading"
      data-testid="section-regional-scams"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeUp}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-medium mb-4">
            <Globe className="w-3.5 h-3.5" />
            Region-Aware Protection
          </div>
          <h2
            id="regional-scams-heading"
            className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
            data-testid="text-regional-scams-heading"
          >
            Common Scams in Your Area
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Scams vary by region. Here are the most common threats reported where you are, with practical tips to stay safe.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          variants={fadeUp}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Showing scams for</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowRegionPicker(!showRegionPicker)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowRegionPicker(false);
              }}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors text-sm"
              aria-expanded={showRegionPicker}
              aria-haspopup="listbox"
              aria-controls="region-listbox"
              data-testid="button-change-region"
            >
              {profile.regionName}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showRegionPicker ? "rotate-180" : ""}`} />
            </button>
            {showRegionPicker && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowRegionPicker(false)}
                  aria-hidden="true"
                />
                <ul
                  id="region-listbox"
                  role="listbox"
                  aria-label="Select your region"
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-card border border-border rounded-lg shadow-lg py-1 z-50 min-w-[180px] max-h-64 overflow-y-auto"
                >
                  {regionOptions.map((r) => (
                    <li
                      key={r.code}
                      role="option"
                      aria-selected={selectedRegion === r.code}
                      tabIndex={0}
                      onClick={() => {
                        setSelectedRegion(r.code);
                        setShowRegionPicker(false);
                        setShowAll(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedRegion(r.code);
                          setShowRegionPicker(false);
                          setShowAll(false);
                        }
                        if (e.key === "Escape") setShowRegionPicker(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors cursor-pointer ${
                        selectedRegion === r.code ? "text-primary font-medium" : "text-foreground"
                      }`}
                      data-testid={`button-region-${r.code}`}
                    >
                      {r.name}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {displayedScams.map((scam, index) => {
            const sev = severityConfig[scam.severity];
            const categoryImg = getCategoryImage(scam.category);
            return (
              <motion.div
                key={`${profile.region}-${scam.name}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                variants={fadeUp}
                className={`group relative rounded-xl border ${sev.border} bg-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
                data-testid={`card-scam-${index}`}
              >
                <div className="relative h-36 sm:h-40 overflow-hidden">
                  <img
                    src={categoryImg}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={`text-[10px] px-2 py-0.5 font-semibold border-0 shadow-sm ${sev.bg} ${sev.text}`}
                      variant="secondary"
                    >
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${sev.dot} mr-1.5`} />
                      {sev.label}
                    </Badge>
                  </div>
                  {scam.category && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-medium text-white/80 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-0.5">
                        {scam.category}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-bold text-sm sm:text-base text-white leading-snug drop-shadow-md">
                      {scam.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                    {scam.description}
                  </p>
                  <div className="flex items-start gap-2 bg-primary/5 dark:bg-primary/10 rounded-lg px-3 py-2.5">
                    <Lightbulb className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-xs text-primary font-medium leading-relaxed line-clamp-2">
                      {scam.tip}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {profile.scams.length > 6 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            variants={fadeUp}
            className="text-center mt-8"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="gap-1.5"
              data-testid="button-show-more-scams"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show {profile.scams.length - 6} More Scams <ChevronDown className="w-4 h-4" />
                </>
              )}
            </Button>
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          variants={fadeUp}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <Shield className="w-3.5 h-3.5" />
            <span>Based on reported incidents from government fraud agencies and cybersecurity organizations</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
