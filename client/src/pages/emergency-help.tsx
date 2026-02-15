import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { RegionSelector } from "@/components/region-selector";
import { 
  Phone, 
  Globe, 
  ExternalLink, 
  AlertTriangle,
  Shield,
  Search,
  Clock,
  CreditCard,
  Lock,
  FileText,
  CheckCircle2
} from "lucide-react";
import bannerImage from "@/assets/banners/emergency-banner.png";

interface EmergencyContact {
  name: string;
  description: string;
  phone?: string;
  website?: string;
}

interface Country {
  name: string;
  flag: string;
  contacts: EmergencyContact[];
}

interface Region {
  name: string;
  countries: Country[];
}

const emergencyData: Region[] = [
  {
    name: "North America",
    countries: [
      {
        name: "United States",
        flag: "US",
        contacts: [
          {
            name: "Federal Trade Commission (FTC)",
            description: "Report fraud, scams, and identity theft",
            phone: "1-877-382-4357",
            website: "https://reportfraud.ftc.gov"
          },
          {
            name: "FBI Internet Crime Complaint Center (IC3)",
            description: "Report internet-related crime and fraud",
            website: "https://www.ic3.gov"
          },
          {
            name: "IdentityTheft.gov",
            description: "Report and recover from identity theft",
            website: "https://www.identitytheft.gov"
          },
          {
            name: "Social Security Administration",
            description: "Report Social Security fraud",
            phone: "1-800-269-0271",
            website: "https://oig.ssa.gov/report"
          }
        ]
      },
      {
        name: "Canada",
        flag: "CA",
        contacts: [
          {
            name: "Canadian Anti-Fraud Centre",
            description: "Report fraud and identity theft",
            phone: "1-888-495-8501",
            website: "https://www.antifraudcentre-centreantifraude.ca"
          },
          {
            name: "Cybertip.ca",
            description: "Report online child exploitation",
            website: "https://www.cybertip.ca"
          },
          {
            name: "Competition Bureau",
            description: "Report deceptive marketing and scams",
            website: "https://www.competitionbureau.gc.ca"
          }
        ]
      },
      {
        name: "Mexico",
        flag: "MX",
        contacts: [
          {
            name: "Policía Cibernética",
            description: "Report cybercrime to federal police",
            phone: "088",
            website: "https://www.gob.mx/policiafederal"
          },
          {
            name: "PROFECO",
            description: "Consumer protection and fraud reporting",
            phone: "800-468-8722",
            website: "https://www.profeco.gob.mx"
          }
        ]
      }
    ]
  },
  {
    name: "Europe",
    countries: [
      {
        name: "United Kingdom",
        flag: "GB",
        contacts: [
          {
            name: "Action Fraud",
            description: "UK's national fraud and cybercrime reporting centre",
            phone: "0300 123 2040",
            website: "https://www.actionfraud.police.uk"
          },
          {
            name: "National Cyber Security Centre",
            description: "Report suspicious emails and websites",
            website: "https://www.ncsc.gov.uk/collection/phishing-scams"
          },
          {
            name: "Citizens Advice",
            description: "Consumer advice and scam guidance",
            website: "https://www.citizensadvice.org.uk"
          }
        ]
      },
      {
        name: "Germany",
        flag: "DE",
        contacts: [
          {
            name: "Bundeskriminalamt (BKA)",
            description: "Federal Criminal Police Office",
            website: "https://www.bka.de"
          },
          {
            name: "Verbraucherzentrale",
            description: "Consumer protection centres",
            website: "https://www.verbraucherzentrale.de"
          },
          {
            name: "BSI (Federal Office for Information Security)",
            description: "Cybersecurity guidance and reporting",
            website: "https://www.bsi.bund.de"
          }
        ]
      },
      {
        name: "France",
        flag: "FR",
        contacts: [
          {
            name: "Cybermalveillance.gouv.fr",
            description: "National platform for cyber threats",
            website: "https://www.cybermalveillance.gouv.fr"
          },
          {
            name: "PHAROS",
            description: "Report illegal internet content",
            website: "https://www.internet-signalement.gouv.fr"
          },
          {
            name: "DGCCRF",
            description: "Consumer protection and fraud",
            website: "https://www.economie.gouv.fr/dgccrf"
          }
        ]
      },
      {
        name: "Netherlands",
        flag: "NL",
        contacts: [
          {
            name: "Fraudehelpdesk",
            description: "Report fraud and scams",
            phone: "088-786 73 72",
            website: "https://www.fraudehelpdesk.nl"
          },
          {
            name: "Politie Cybercrime",
            description: "Police cybercrime reporting",
            website: "https://www.politie.nl/aangifte-of-melding-doen"
          }
        ]
      },
      {
        name: "Ireland",
        flag: "IE",
        contacts: [
          {
            name: "An Garda Síochána",
            description: "Irish police fraud reporting",
            website: "https://www.garda.ie/en/crime/fraud"
          },
          {
            name: "FraudSMART",
            description: "Banking and financial fraud awareness",
            website: "https://www.fraudsmart.ie"
          }
        ]
      },
      {
        name: "Spain",
        flag: "ES",
        contacts: [
          {
            name: "Policía Nacional - Ciberdelincuencia",
            description: "Report cybercrime to national police",
            phone: "091",
            website: "https://www.policia.es"
          },
          {
            name: "INCIBE",
            description: "National Cybersecurity Institute",
            phone: "017",
            website: "https://www.incibe.es"
          }
        ]
      },
      {
        name: "Italy",
        flag: "IT",
        contacts: [
          {
            name: "Polizia Postale",
            description: "Postal and communications police",
            website: "https://www.commissariatodips.it"
          },
          {
            name: "AGCM",
            description: "Consumer protection authority",
            website: "https://www.agcm.it"
          }
        ]
      }
    ]
  },
  {
    name: "Asia-Pacific",
    countries: [
      {
        name: "Australia",
        flag: "AU",
        contacts: [
          {
            name: "Scamwatch (ACCC)",
            description: "Report scams to the consumer watchdog",
            website: "https://www.scamwatch.gov.au"
          },
          {
            name: "ReportCyber",
            description: "Report cybercrime to Australian authorities",
            website: "https://www.cyber.gov.au/report"
          },
          {
            name: "IDCARE",
            description: "Identity and cyber support service",
            phone: "1800 595 160",
            website: "https://www.idcare.org"
          }
        ]
      },
      {
        name: "New Zealand",
        flag: "NZ",
        contacts: [
          {
            name: "CERT NZ",
            description: "Report cyber security issues",
            website: "https://www.cert.govt.nz"
          },
          {
            name: "Netsafe",
            description: "Online safety advice and reporting",
            phone: "0508 638 723",
            website: "https://www.netsafe.org.nz"
          }
        ]
      },
      {
        name: "Singapore",
        flag: "SG",
        contacts: [
          {
            name: "Singapore Police Force",
            description: "Report scams and cybercrime",
            phone: "1800-255-0000",
            website: "https://www.police.gov.sg/iwitness"
          },
          {
            name: "ScamShield",
            description: "Block scam calls and messages",
            website: "https://www.scamshield.org.sg"
          },
          {
            name: "Anti-Scam Helpline",
            description: "Immediate scam assistance",
            phone: "1800-722-6688"
          }
        ]
      },
      {
        name: "Japan",
        flag: "JP",
        contacts: [
          {
            name: "National Police Agency Cybercrime",
            description: "Report internet crime",
            website: "https://www.npa.go.jp/cyber"
          },
          {
            name: "Consumer Affairs Agency",
            description: "Consumer hotline for fraud",
            phone: "188",
            website: "https://www.caa.go.jp"
          }
        ]
      },
      {
        name: "South Korea",
        flag: "KR",
        contacts: [
          {
            name: "Korean National Police Agency",
            description: "Cybercrime reporting",
            phone: "182",
            website: "https://ecrm.police.go.kr"
          },
          {
            name: "Korea Internet & Security Agency",
            description: "Internet security incidents",
            website: "https://www.kisa.or.kr"
          }
        ]
      },
      {
        name: "India",
        flag: "IN",
        contacts: [
          {
            name: "National Cyber Crime Reporting Portal",
            description: "Report cybercrime online",
            website: "https://cybercrime.gov.in"
          },
          {
            name: "Cyber Crime Helpline",
            description: "National helpline for cyber fraud",
            phone: "1930"
          },
          {
            name: "RBI Sachet",
            description: "Report financial fraud",
            website: "https://sachet.rbi.org.in"
          }
        ]
      },
      {
        name: "Philippines",
        flag: "PH",
        contacts: [
          {
            name: "PNP Anti-Cybercrime Group",
            description: "Report cybercrime to police",
            phone: "(02) 723-0401",
            website: "https://acg.pnp.gov.ph"
          },
          {
            name: "NBI Cybercrime Division",
            description: "National Bureau of Investigation",
            website: "https://www.nbi.gov.ph"
          }
        ]
      },
      {
        name: "Malaysia",
        flag: "MY",
        contacts: [
          {
            name: "Royal Malaysia Police (PDRM)",
            description: "Report cybercrime",
            phone: "999",
            website: "https://www.rmp.gov.my"
          },
          {
            name: "CyberSecurity Malaysia",
            description: "Cyber security incidents",
            website: "https://www.cybersecurity.my"
          }
        ]
      },
      {
        name: "Thailand",
        flag: "TH",
        contacts: [
          {
            name: "Technology Crime Suppression Division",
            description: "Report technology crimes",
            phone: "1599",
            website: "https://www.tcsd.go.th"
          }
        ]
      },
      {
        name: "Indonesia",
        flag: "ID",
        contacts: [
          {
            name: "Patrolisiber",
            description: "Report cybercrime to police",
            website: "https://patrolisiber.id"
          },
          {
            name: "Kominfo",
            description: "Ministry of Communication and IT",
            website: "https://www.kominfo.go.id"
          }
        ]
      }
    ]
  },
  {
    name: "Africa",
    countries: [
      {
        name: "South Africa",
        flag: "ZA",
        contacts: [
          {
            name: "South African Banking Risk Centre (SABRIC)",
            description: "Report banking fraud",
            phone: "011-847-3000",
            website: "https://www.sabric.co.za"
          },
          {
            name: "SAPS Cybercrime",
            description: "South African Police Service",
            website: "https://www.saps.gov.za"
          }
        ]
      },
      {
        name: "Nigeria",
        flag: "NG",
        contacts: [
          {
            name: "Economic and Financial Crimes Commission (EFCC)",
            description: "Report financial crimes",
            website: "https://www.efcc.gov.ng"
          },
          {
            name: "Nigeria Police Cybercrime Unit",
            description: "Report internet fraud",
            phone: "0803-315-5599"
          }
        ]
      },
      {
        name: "Kenya",
        flag: "KE",
        contacts: [
          {
            name: "Directorate of Criminal Investigations",
            description: "Report cybercrime",
            phone: "0800-723-253",
            website: "https://www.dci.go.ke"
          },
          {
            name: "Communications Authority of Kenya",
            description: "Report online fraud",
            website: "https://www.ca.go.ke"
          }
        ]
      },
      {
        name: "Ghana",
        flag: "GH",
        contacts: [
          {
            name: "Ghana Police Cybercrime Unit",
            description: "Report cybercrime",
            phone: "18555",
            website: "https://police.gov.gh"
          },
          {
            name: "Economic and Organised Crime Office (EOCO)",
            description: "Report financial fraud",
            website: "https://www.eoco.org.gh"
          }
        ]
      },
      {
        name: "Egypt",
        flag: "EG",
        contacts: [
          {
            name: "Ministry of Interior Cybercrime Unit",
            description: "Report cybercrime",
            phone: "108",
            website: "https://www.moi.gov.eg"
          }
        ]
      }
    ]
  },
  {
    name: "Latin America",
    countries: [
      {
        name: "Brazil",
        flag: "BR",
        contacts: [
          {
            name: "SaferNet Brasil",
            description: "Report cybercrime and online abuse",
            website: "https://new.safernet.org.br"
          },
          {
            name: "Procon",
            description: "Consumer protection",
            website: "https://www.procon.sp.gov.br"
          }
        ]
      },
      {
        name: "Argentina",
        flag: "AR",
        contacts: [
          {
            name: "Unidad Fiscal Especializada en Ciberdelincuencia",
            description: "Cybercrime prosecution unit",
            website: "https://www.mpf.gob.ar/ufeci"
          },
          {
            name: "Defensa del Consumidor",
            description: "Consumer protection",
            phone: "0800-666-1518"
          }
        ]
      },
      {
        name: "Colombia",
        flag: "CO",
        contacts: [
          {
            name: "CAI Virtual",
            description: "Police cybercrime unit",
            website: "https://caivirtual.policia.gov.co"
          },
          {
            name: "Superintendencia de Industria y Comercio",
            description: "Consumer protection",
            website: "https://www.sic.gov.co"
          }
        ]
      },
      {
        name: "Chile",
        flag: "CL",
        contacts: [
          {
            name: "PDI Cibercrimen",
            description: "Investigative police cybercrime unit",
            phone: "134",
            website: "https://www.pdichile.cl"
          },
          {
            name: "SERNAC",
            description: "Consumer protection service",
            website: "https://www.sernac.cl"
          }
        ]
      },
      {
        name: "Peru",
        flag: "PE",
        contacts: [
          {
            name: "División de Investigación de Delitos de Alta Tecnología",
            description: "High-tech crime investigation",
            phone: "(01) 431-8898",
            website: "https://www.pnp.gob.pe"
          }
        ]
      }
    ]
  },
  {
    name: "Middle East",
    countries: [
      {
        name: "United Arab Emirates",
        flag: "AE",
        contacts: [
          {
            name: "Dubai Police eCrime",
            description: "Report cybercrime",
            phone: "901",
            website: "https://www.dubaipolice.gov.ae"
          },
          {
            name: "Abu Dhabi Police",
            description: "Report fraud and scams",
            phone: "800-2626",
            website: "https://www.adpolice.gov.ae"
          }
        ]
      },
      {
        name: "Saudi Arabia",
        flag: "SA",
        contacts: [
          {
            name: "Saudi Anti-Fraud Committee",
            description: "Report financial fraud",
            phone: "330-330"
          },
          {
            name: "Communications and IT Commission",
            description: "Report cybercrime",
            website: "https://www.citc.gov.sa"
          }
        ]
      },
      {
        name: "Israel",
        flag: "IL",
        contacts: [
          {
            name: "Israel Police Cyber Unit",
            description: "Report cybercrime",
            phone: "100",
            website: "https://www.police.gov.il"
          },
          {
            name: "Israel National Cyber Directorate",
            description: "National cyber security",
            website: "https://www.gov.il/en/departments/israel_national_cyber_directorate"
          }
        ]
      },
      {
        name: "Qatar",
        flag: "QA",
        contacts: [
          {
            name: "Ministry of Interior Cybercrime",
            description: "Report cybercrime",
            phone: "2347444",
            website: "https://portal.moi.gov.qa"
          }
        ]
      }
    ]
  }
];

const immediateSteps = [
  {
    title: "Stay Calm and Act Quickly",
    description: "The first few hours are critical. Stay calm and work through these steps methodically.",
    icon: Clock,
  },
  {
    title: "Stop All Communication",
    description: "Immediately stop responding to the scammer. Do not click any more links or provide additional information.",
    icon: AlertTriangle,
  },
  {
    title: "Secure Your Accounts",
    description: "Change passwords for any accounts that may be compromised. Start with your email and banking.",
    icon: Lock,
  },
  {
    title: "Contact Your Bank",
    description: "If you shared financial information or sent money, call your bank immediately to report fraud.",
    icon: CreditCard,
  },
];

const scamSpecificActions = [
  {
    type: "Gave Out Personal Information",
    actions: [
      "Place a fraud alert on your credit reports",
      "Consider freezing your credit to prevent new accounts being opened",
      "Monitor your credit reports for unauthorized accounts",
      "Watch for unexpected bills or collection notices"
    ]
  },
  {
    type: "Sent Money via Wire, Gift Cards, or Crypto",
    actions: [
      "Contact your bank or the wire transfer service immediately",
      "Report gift card fraud to the retailer as they may be able to recover funds",
      "For crypto, report to the exchange used for the transaction",
      "Unfortunately, these payments are often unrecoverable so focus on preventing further loss"
    ]
  },
  {
    type: "Clicked a Suspicious Link",
    actions: [
      "Run antivirus software immediately and do a full system scan",
      "Change passwords for important accounts from a different device",
      "Watch for unusual activity on your accounts",
      "If you entered credentials, assume that account is compromised"
    ]
  },
  {
    type: "Downloaded Suspicious Software",
    actions: [
      "Disconnect from the internet immediately",
      "Run antivirus software in safe mode",
      "Consider professional help to clean your device",
      "Change all passwords from a clean device after cleanup"
    ]
  },
];

const allCountries = emergencyData.flatMap(region =>
  region.countries.map(country => ({
    ...country,
    region: region.name
  }))
).sort((a, b) => a.name.localeCompare(b.name));

export default function EmergencyHelp() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = allCountries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCountryData = allCountries.find(c => c.name === selectedCountry);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.emergencyHelp} />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Emergency Help"
          subtitle="Find the right authorities to contact when you or someone you know has been targeted by a scam. Select your region and country below."
          imageSrc={bannerImage}
          imageAlt="Emergency help and support resources"
          imagePosition="left"
        />

        <section className="py-8 bg-primary/5 border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <RegionSelector showThreats={false} />
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-red-50 dark:bg-red-950/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-600" />
              If You've Been Scammed, Act Fast
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {immediateSteps.map((step, index) => (
                <Card key={index} data-testid={`card-immediate-step-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Report to Authorities in Your Country
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-2">
                Select your country to see official fraud reporting agencies and emergency contacts.
              </p>
              <p className="text-xs text-muted-foreground/70 max-w-2xl mx-auto">
                Contact details sourced from official government websites. We recommend verifying phone numbers on the agency's official website before calling, as numbers may change.
              </p>
            </motion.div>

            <div className="relative max-w-lg mx-auto mb-8" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-testid="input-country-search"
                  placeholder="Search for your country..."
                  value={isDropdownOpen ? searchQuery : (selectedCountry || searchQuery)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                    if (!e.target.value) {
                      setSelectedCountry("");
                    }
                  }}
                  onFocus={() => {
                    setIsDropdownOpen(true);
                    if (selectedCountry) {
                      setSearchQuery("");
                    }
                  }}
                  className="pl-9"
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-72 overflow-y-auto">
                  {filteredCountries.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No countries found
                    </div>
                  ) : (
                    filteredCountries.map((country) => (
                      <button
                        key={country.name}
                        data-testid={`country-option-${country.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="w-full px-4 py-3 flex items-center gap-3 text-left hover-elevate cursor-pointer"
                        onClick={() => {
                          setSelectedCountry(country.name);
                          setSearchQuery("");
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className="w-8 h-6 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{country.flag}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-foreground text-sm">{country.name}</span>
                          <span className="text-xs text-muted-foreground">{country.region}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {selectedCountryData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card data-testid="card-selected-country-contacts">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 flex-wrap">
                      <span className="w-10 h-7 rounded bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{selectedCountryData.flag}</span>
                      <span>{selectedCountryData.name}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {selectedCountryData.region}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedCountryData.contacts.map((contact, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-muted/30 rounded-lg border"
                        data-testid={`contact-${selectedCountryData.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`}
                      >
                        <h4 className="font-medium text-foreground mb-1">
                          {contact.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {contact.description}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {contact.phone && (
                            <a
                              href={`tel:${contact.phone.replace(/\s/g, '')}`}
                              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              {contact.phone}
                            </a>
                          )}
                          {contact.website && (
                            <a
                              href={contact.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              Website
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              What Happened? Find Your Situation
            </h2>
            
            <div className="space-y-4">
              {scamSpecificActions.map((scenario, index) => (
                <Card key={index} data-testid={`card-scenario-${index}`}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-foreground mb-4">{scenario.type}</h3>
                    <ul className="space-y-3">
                      {scenario.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
              <CardContent className="p-8">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">You're Not Alone</h3>
                <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
                  Scams happen to millions of smart, careful people every year. 
                  Taking action now is the best thing you can do.
                </p>
                <p className="text-sm text-muted-foreground">
                  Don't see your country listed? Search for your country's name along with 
                  "report fraud" or "cybercrime reporting" to find official resources.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
