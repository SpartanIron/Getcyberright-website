import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ChevronDown,
  ChevronUp,
  MapPin,
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
        flag: "🇺🇸",
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
        flag: "🇨🇦",
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
        flag: "🇲🇽",
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
        flag: "🇬🇧",
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
        flag: "🇩🇪",
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
        flag: "🇫🇷",
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
        flag: "🇳🇱",
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
        flag: "🇮🇪",
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
        flag: "🇪🇸",
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
        flag: "🇮🇹",
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
        flag: "🇦🇺",
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
        flag: "🇳🇿",
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
        flag: "🇸🇬",
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
        flag: "🇯🇵",
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
        flag: "🇰🇷",
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
        flag: "🇮🇳",
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
        flag: "🇵🇭",
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
        flag: "🇲🇾",
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
        flag: "🇹🇭",
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
        flag: "🇮🇩",
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
        flag: "🇿🇦",
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
        flag: "🇳🇬",
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
        flag: "🇰🇪",
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
        flag: "🇬🇭",
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
        flag: "🇪🇬",
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
        flag: "🇧🇷",
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
        flag: "🇦🇷",
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
        flag: "🇨🇴",
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
        flag: "🇨🇱",
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
        flag: "🇵🇪",
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
        flag: "🇦🇪",
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
        flag: "🇸🇦",
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
        flag: "🇮🇱",
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
        flag: "🇶🇦",
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

export default function EmergencyHelp() {
  const [expandedRegions, setExpandedRegions] = useState<string[]>(["North America"]);
  const [expandedCountries, setExpandedCountries] = useState<string[]>(["United States"]);

  const toggleRegion = (regionName: string) => {
    setExpandedRegions(prev => 
      prev.includes(regionName) 
        ? prev.filter(r => r !== regionName)
        : [...prev, regionName]
    );
  };

  const toggleCountry = (countryName: string) => {
    setExpandedCountries(prev => 
      prev.includes(countryName) 
        ? prev.filter(c => c !== countryName)
        : [...prev, countryName]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.emergencyHelp} />
      <Navigation />
      
      <main tabIndex={-1}>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Click on your region, then select your country to see official fraud reporting 
                agencies and emergency contacts.
              </p>
            </motion.div>

            <div className="space-y-4">
              {emergencyData.map((region) => (
                <motion.div
                  key={region.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden">
                    <button
                      onClick={() => toggleRegion(region.name)}
                      className="w-full"
                      data-testid={`region-${region.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <CardHeader className="flex flex-row items-center justify-between gap-4 hover-elevate cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <CardTitle className="text-xl">{region.name}</CardTitle>
                          <span className="text-sm text-muted-foreground">
                            ({region.countries.length} {region.countries.length === 1 ? 'country' : 'countries'})
                          </span>
                        </div>
                        {expandedRegions.includes(region.name) ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardHeader>
                    </button>

                    {expandedRegions.includes(region.name) && (
                      <CardContent className="pt-0 pb-6">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {region.countries.map((country) => (
                            <div key={country.name} className="border rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleCountry(country.name)}
                                className="w-full p-4 flex items-center justify-between hover-elevate cursor-pointer bg-card"
                                data-testid={`country-${country.name.toLowerCase().replace(/\s+/g, '-')}`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{country.flag}</span>
                                  <span className="font-medium text-foreground">{country.name}</span>
                                </div>
                                {expandedCountries.includes(country.name) ? (
                                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                              </button>

                              {expandedCountries.includes(country.name) && (
                                <div className="p-4 pt-0 space-y-3 bg-muted/30">
                                  {country.contacts.map((contact, idx) => (
                                    <div 
                                      key={idx} 
                                      className="p-3 bg-background rounded-lg border"
                                      data-testid={`contact-${country.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`}
                                    >
                                      <h4 className="font-medium text-foreground text-sm mb-1">
                                        {contact.name}
                                      </h4>
                                      <p className="text-xs text-muted-foreground mb-2">
                                        {contact.description}
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        {contact.phone && (
                                          <a 
                                            href={`tel:${contact.phone.replace(/\s/g, '')}`}
                                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                          >
                                            <Phone className="w-3 h-3" />
                                            {contact.phone}
                                          </a>
                                        )}
                                        {contact.website && (
                                          <a 
                                            href={contact.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                          >
                                            <Globe className="w-3 h-3" />
                                            Website
                                            <ExternalLink className="w-2.5 h-2.5" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
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
