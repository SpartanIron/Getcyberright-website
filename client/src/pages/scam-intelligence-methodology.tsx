"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Link } from "@/lib/navigation";
import { ArrowLeft, FileText, BookOpen, AlertTriangle, RefreshCw, Calculator, Database } from "lucide-react";

const PRIMARY_SOURCES: { region: string; entries: { publisher: string; report: string; url: string; updated: string; tier: "A" | "B" | "C" }[] }[] = [
  {
    region: "North America",
    entries: [
      { tier: "A", publisher: "FBI Internet Crime Complaint Center (IC3)", report: "2024 Internet Crime Report", url: "https://www.ic3.gov/AnnualReport/Reports/2024_IC3Report.pdf", updated: "2025-04-23" },
      { tier: "A", publisher: "Federal Trade Commission", report: "Consumer Sentinel Network Data Book 2024", url: "https://www.ftc.gov/reports/consumer-sentinel-network-data-book-2024", updated: "2025-03-10" },
      { tier: "A", publisher: "Canadian Anti-Fraud Centre (RCMP)", report: "CAFC 2024 Annual Statistical Report", url: "https://antifraudcentre-centreantifraude.ca/annual-reports-2024-rapports-annuels-eng.htm", updated: "2025-10-24" },
    ],
  },
  {
    region: "Europe",
    entries: [
      { tier: "A", publisher: "UK Finance", report: "Annual Fraud Report 2025", url: "https://www.ukfinance.org.uk/policy-and-guidance/reports-and-publications/annual-fraud-report-2025", updated: "2025-05-27" },
      { tier: "B", publisher: "City of London Police", report: "Report Fraud (replaces Action Fraud Dec 2025)", url: "https://www.cityoflondon.police.uk/news/city-of-london/news/2025/april/city-of-london-police-over-649m-lost-to-investment-fraud-in-2024-with-cryptocurrency-fraud-on-the-rise/", updated: "2025-04-15" },
      { tier: "A", publisher: "BSI Germany", report: "Die Lage der IT-Sicherheit in Deutschland 2025", url: "https://medien.bsi.bund.de/lagebericht/en/", updated: "2025-11-11" },
      { tier: "A", publisher: "Bundeskriminalamt (BKA)", report: "Bundeslagebild Cybercrime 2024", url: "https://www.bka.de/DE/AktuelleInformationen/StatistikenLagebilder/Lagebilder/Cybercrime/2024/CC_2024.html", updated: "2025-06-02" },
      { tier: "A", publisher: "ANSSI / CERT-FR", report: "Panorama de la cybermenace 2024", url: "https://cyber.gouv.fr/publications/panorama-de-la-cybermenace-2024", updated: "2025-03-01" },
      { tier: "A", publisher: "Cybermalveillance.gouv.fr", report: "Rapport d'activite 2024", url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/rapport-activite-2024", updated: "2025-03-27" },
    ],
  },
  {
    region: "Asia-Pacific",
    entries: [
      { tier: "A", publisher: "ACCC Scamwatch", report: "Targeting Scams Report 2024", url: "https://www.scamwatch.gov.au/research-and-resources/targeting-scams-report", updated: "2025-04-28" },
      { tier: "A", publisher: "Australian Signals Directorate / ACSC", report: "Annual Cyber Threat Report 2024-2025", url: "https://www.cyber.gov.au/about-us/view-all-content/reports-and-statistics/annual-cyber-threat-report-2024-2025", updated: "2025-10-14" },
      { tier: "A", publisher: "Cyber Security Agency of Singapore (CSA)", report: "Singapore Cyber Landscape 2024/2025", url: "https://www.csa.gov.sg/resources/publications/singapore-cyber-landscape-2024-2025/", updated: "2025-09-03" },
      { tier: "B", publisher: "Ministry of Home Affairs (I4C)", report: "Indian Cybercrime Coordination Centre", url: "https://i4c.mha.gov.in/", updated: "2024-07-01" },
      { tier: "B", publisher: "National Police Agency Japan", report: "NPA cybercrime publications", url: "https://www.npa.go.jp/", updated: "Continuous" },
      { tier: "B", publisher: "KISA / KrCERT/CC", report: "KrCERT/CC publications", url: "https://www.krcert.or.kr/", updated: "Continuous" },
    ],
  },
  {
    region: "Africa, LatAm and global",
    entries: [
      { tier: "A", publisher: "INTERPOL", report: "Africa Cyberthreat Assessment Report 2025 (4th Edition)", url: "https://www.interpol.int/content/download/23094/file/INTERPOL_Africa_Cyberthreat_Assessment_Report_2025.pdf", updated: "2025-05-01" },
      { tier: "A", publisher: "South African Banking Risk Information Centre (SABRIC)", report: "SABRIC Annual Crime Statistics 2024", url: "https://www.sabric.co.za/media-statement-sabric-annual-crime-statistics-2024/", updated: "2025-08-28" },
      { tier: "B", publisher: "CERT.br / NIC.br", report: "CERT.br Incident Statistics (live portal)", url: "https://stats.cert.br/incidentes/", updated: "Continuous" },
    ],
  },
  {
    region: "Real-time feeds",
    entries: [
      { tier: "B", publisher: "CISA", report: "Cybersecurity Advisories", url: "https://www.cisa.gov/news-events/cybersecurity-advisories", updated: "Continuous" },
      { tier: "B", publisher: "NIST", report: "National Vulnerability Database", url: "https://nvd.nist.gov/vuln", updated: "Continuous" },
      { tier: "B", publisher: "abuse.ch", report: "URLhaus", url: "https://urlhaus.abuse.ch", updated: "Continuous" },
      { tier: "B", publisher: "PhishTank", report: "Verified phishing URLs", url: "https://www.phishtank.com", updated: "Continuous" },
      { tier: "B", publisher: "Have I Been Pwned", report: "Breach corpus", url: "https://haveibeenpwned.com/PwnedWebsites", updated: "Continuous" },
    ],
  },
];

const TIER_BADGE: Record<"A" | "B" | "C", string> = {
  A: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  B: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  C: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

const RISK_THRESHOLDS = [
  { level: "Critical", color: "bg-red-500", range: "Risk score >= 80" },
  { level: "High", color: "bg-orange-500", range: "Risk score 65 to 79" },
  { level: "Medium", color: "bg-yellow-500", range: "Risk score 50 to 64" },
  { level: "Low", color: "bg-green-500", range: "Risk score below 50" },
];

const CHANGELOG = [
  { version: "v1.0", date: "April 2026", notes: "Initial public methodology. Per-figure citations, raw data export (CSV/JSON), as-of timestamps, forecast disclaimer." },
];

export default function ScamIntelligenceMethodology() {
  return (
    <div className="dark">
    <div className="min-h-screen bg-[#060d1a]">
      <Navigation />
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="mb-6">
          <Link href="/scam-intelligence" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-dashboard">
            <ArrowLeft className="w-3 h-3" />
            Back to Scam Intelligence Dashboard
          </Link>
        </div>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-medium">Methodology v1.0</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" data-testid="page-title">
            Scam Intelligence Dashboard Methodology
          </h1>
          <p className="text-base text-muted-foreground">
            How we gather, score, and refresh the data shown on the global scam intelligence dashboard. Every figure on the dashboard links back to a primary source listed below.
          </p>
        </header>

        <section className="mb-10" aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Primary data sources
          </h2>
          <div className="space-y-6">
            {PRIMARY_SOURCES.map((group) => (
              <div key={group.region} className="bg-card border border-border rounded-xl p-5" data-testid={`sources-group-${group.region.toLowerCase().replace(/\s+/g, '-')}`}>
                <h3 className="text-sm font-semibold text-foreground mb-3">{group.region}</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-muted-foreground border-b border-border/50">
                      <th className="text-left font-medium py-1.5 pr-3">Publisher</th>
                      <th className="text-left font-medium py-1.5 pr-3">Report</th>
                      <th className="text-left font-medium py-1.5">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.entries.map((e) => (
                      <tr key={e.url} className="border-b border-border/20 last:border-0">
                        <td className="py-1.5 pr-3 text-foreground align-top">
                          <span className={`inline-block mr-1.5 px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-wider rounded border ${TIER_BADGE[e.tier]}`}>Tier {e.tier}</span>
                          {e.publisher}
                        </td>
                        <td className="py-1.5 pr-3 align-top">
                          <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                            {e.report}
                          </a>
                        </td>
                        <td className="py-1.5 text-muted-foreground align-top whitespace-nowrap">{e.updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-labelledby="coverage-heading">
          <h2 id="coverage-heading" className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Source coverage and freshness
          </h2>
          <div className="bg-card border border-border rounded-xl p-5 mb-4">
            <p className="text-xs text-muted-foreground mb-3">
              Every publisher URL we cite is hashed daily by an automated freshness monitor. If a publisher's page content changes since the last verification, the citation is flagged stale and re-verified by an editor before any number on the dashboard is updated.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-md p-3">
                <div className="font-semibold text-emerald-400 mb-1">Tier A</div>
                <div className="text-muted-foreground">Official annual fraud or cybercrime report from a national authority (FBI IC3, FTC, UK Finance, BSI, BKA, ANSSI, ACCC, ACSC, CSA Singapore, SABRIC, INTERPOL).</div>
              </div>
              <div className="border border-amber-500/30 bg-amber-500/5 rounded-md p-3">
                <div className="font-semibold text-amber-400 mb-1">Tier B</div>
                <div className="text-muted-foreground">National CERT, police bulletin, central bank or live statistics portal where no single annual PDF is published (CERT.br stats, KISA/KrCERT, NPA Japan, I4C India, Report Fraud UK).</div>
              </div>
              <div className="border border-slate-500/30 bg-slate-500/5 rounded-md p-3">
                <div className="font-semibold text-slate-300 mb-1">Tier C</div>
                <div className="text-muted-foreground">Regional aggregate or supplementary reference. Used only as a placeholder while a verified primary national source is being sought; numbers from Tier C sources are not surfaced on country cards.</div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 mb-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">Verification rules</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-5">
              <li>No citation ships with a fabricated title, date, or URL. Each entry is verified against a live publisher page before merge.</li>
              <li>Each citation carries a verifiedAt date and a tier label, both visible in the country source drawer on the dashboard.</li>
              <li>The freshness monitor performs a daily fetch of every publisher URL, computes a SHA-256 hash, and compares it to the previous baseline. Any change moves the citation to "stale" until re-verified.</li>
              <li>Live snapshot of the freshness state is exposed at <code className="text-foreground bg-secondary/40 px-1 py-0.5 rounded">/api/scam-intelligence/source-freshness</code>.</li>
              <li>If a publisher restructures or replaces their reporting (for example, UK Action Fraud was replaced by Report Fraud in December 2025), we update the citation and note the transition rather than silently keeping the old URL.</li>
            </ul>
          </div>
        </section>

        <section className="mb-10" aria-labelledby="formulas-heading">
          <h2 id="formulas-heading" className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Scoring and trend calculations
          </h2>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">Country risk score</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Each tracked country is assigned a 0 to 100 risk score derived from the most recent annual report or quarterly update from its national fraud / cybercrime authority. Inputs include: reported incident volume normalized for population, year-over-year change, and weighted severity of the dominant scam categories.
              </p>
              <pre className="bg-secondary/40 border border-border rounded-md p-3 text-[11px] text-foreground overflow-x-auto"><code>risk_score = clamp(0..100,
  0.5 * normalized_incident_rate
+ 0.3 * yoy_growth_factor
+ 0.2 * category_severity_weight)</code></pre>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">Risk-level thresholds</h3>
              <ul className="space-y-1.5">
                {RISK_THRESHOLDS.map((r) => (
                  <li key={r.level} className="flex items-center gap-2 text-xs text-foreground">
                    <span className={`w-2 h-2 rounded-full ${r.color}`} />
                    <span className="font-semibold w-16">{r.level}</span>
                    <span className="text-muted-foreground">{r.range}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">Trend percentage</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Trend percent reflects the year-over-year change in reported incidents from the country's most recent published statistics. Direction is "up" if change exceeds +1%, "down" if below -1%, otherwise "stable".
              </p>
              <pre className="bg-secondary/40 border border-border rounded-md p-3 text-[11px] text-foreground overflow-x-auto"><code>trend_percent = round((current_year - prior_year) / prior_year * 100, 1)</code></pre>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">7-day forecast (sparkline)</h3>
              <p className="text-xs text-muted-foreground">
                The forecast line on country cards is a linear regression projection over the rolling 48-snapshot history buffer maintained on the server. The shaded band is +/- 1 standard error. Forecasts are <em>indicative projections, not predictions</em>, and should not be cited as expected outcomes.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10" aria-labelledby="cadence-heading">
          <h2 id="cadence-heading" className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            Refresh cadence
          </h2>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li><span className="text-foreground font-medium">Aggregated dashboard:</span> rebuilt every 30 minutes from cached source data and live feeds.</li>
            <li><span className="text-foreground font-medium">Live feed (CISA, NVD, URLhaus, PhishTank, HIBP):</span> ingested continuously; surfaced within 5 minutes of publication.</li>
            <li><span className="text-foreground font-medium">Country profiles:</span> updated within 30 days of a new annual or quarterly report from the source authority.</li>
            <li><span className="text-foreground font-medium">As-of timestamp:</span> shown beneath the time-range selector on the dashboard reflects when the current cached snapshot was built.</li>
          </ul>
        </section>

        <section className="mb-10" aria-labelledby="limitations-heading">
          <h2 id="limitations-heading" className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Limitations
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
            <li>Reported incident volumes are <em>reported</em> incidents, not <em>actual</em> incidents. Underreporting varies by country and by scam type.</li>
            <li>Reporting authorities use different definitions of fraud, scam, and cybercrime. We have normalized to the closest equivalent of "consumer-facing scam"; figures are not strictly comparable across jurisdictions.</li>
            <li>Cross-border arc volumes shown on the globe are best-effort estimates derived from public threat intelligence and are illustrative of detected flows, not exhaustive.</li>
            <li>Forecast lines are linear projections from a short history buffer and do not account for seasonality, policy interventions, or law-enforcement actions.</li>
            <li>Live feed entries are filtered for relevance to consumer scam intelligence; not every advisory from the upstream feed appears on the dashboard.</li>
          </ul>
        </section>

        <section aria-labelledby="changelog-heading">
          <h2 id="changelog-heading" className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Changelog
          </h2>
          <ul className="space-y-3">
            {CHANGELOG.map((c) => (
              <li key={c.version} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">{c.version}</span>
                  <span className="text-xs text-muted-foreground">{c.date}</span>
                </div>
                <p className="text-xs text-muted-foreground">{c.notes}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
    </div>
  );
}
