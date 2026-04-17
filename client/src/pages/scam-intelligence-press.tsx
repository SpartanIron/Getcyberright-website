"use client";

import { useState, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Link } from "@/lib/navigation";
import { ArrowLeft, Download, Mail, Copy, Check, Code2, FileJson, FileSpreadsheet, ImageIcon } from "lucide-react";

const ATTRIBUTION_HTML = `<p>Source: <a href="https://www.getcyberright.com/scam-intelligence">GetCyberRight Scam Intelligence Dashboard</a> (accessed [DATE]).</p>`;
const ATTRIBUTION_PLAIN = `Source: GetCyberRight Scam Intelligence Dashboard, https://www.getcyberright.com/scam-intelligence (accessed [DATE]).`;
const EMBED_SNIPPET = `<iframe src="https://www.getcyberright.com/scam-intelligence/embed" width="480" height="320" frameborder="0" style="border:0;border-radius:12px;" title="GetCyberRight live scam intelligence"></iframe>`;
const PRESS_EMAIL = "press@getcyberright.com";

function CopyButton({ text, label, testid }: { text: string; label: string; testid: string }) {
  const [copied, setCopied] = useState(false);
  const onClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [text]);
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-foreground transition-colors"
      data-testid={testid}
      aria-label={`Copy ${label}`}
    >
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : `Copy ${label}`}
    </button>
  );
}

export default function ScamIntelligencePress() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" data-testid="page-title">
            Press Kit
          </h1>
          <p className="text-base text-muted-foreground">
            Logos, embed snippets, raw data, attribution boilerplate, and a contact for journalists, researchers, and policy teams covering global scam activity.
          </p>
        </header>

        <section className="mb-10" aria-labelledby="logos-heading">
          <h2 id="logos-heading" className="text-xl font-semibold text-foreground mb-4">Logos</h2>
          <div className="bg-card border border-border rounded-xl p-6 flex flex-wrap items-center gap-6">
            <img src="/logo.webp" alt="GetCyberRight logo" className="h-16 w-auto bg-white/5 rounded-lg p-3" data-testid="img-logo-preview" />
            <div className="flex flex-col gap-2">
              <a
                href="/logo.webp"
                download
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/70 text-foreground transition-colors"
                data-testid="link-download-logo"
              >
                <Download className="w-3 h-3" />
                Download logo (WebP)
              </a>
              <p className="text-[11px] text-muted-foreground">For high-resolution variants or alternative formats, contact press.</p>
            </div>
          </div>
        </section>

        <section className="mb-10" aria-labelledby="embed-heading">
          <h2 id="embed-heading" className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            Embed the live dashboard
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Drop the snippet below into any article CMS to embed the live scam intelligence widget. The iframe is responsive within its container and refreshes automatically.
          </p>
          <div className="bg-card border border-border rounded-xl p-4">
            <pre className="bg-secondary/40 border border-border rounded-md p-3 text-[11px] text-foreground overflow-x-auto whitespace-pre-wrap break-all"><code data-testid="embed-snippet">{EMBED_SNIPPET}</code></pre>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton text={EMBED_SNIPPET} label="embed snippet" testid="copy-embed-snippet" />
            </div>
          </div>
        </section>

        <section className="mb-10" aria-labelledby="data-heading">
          <h2 id="data-heading" className="text-xl font-semibold text-foreground mb-4">Raw data downloads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="/api/scam-intelligence/export.csv"
              className="bg-card border border-border rounded-xl p-4 flex flex-col items-start gap-2 hover:bg-secondary/40 transition-colors"
              data-testid="link-press-export-csv"
            >
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-semibold text-foreground">Export CSV</div>
                <div className="text-[11px] text-muted-foreground">Hotspots, arcs, live events with citations.</div>
              </div>
            </a>
            <a
              href="/api/scam-intelligence/export.json"
              className="bg-card border border-border rounded-xl p-4 flex flex-col items-start gap-2 hover:bg-secondary/40 transition-colors"
              data-testid="link-press-export-json"
            >
              <FileJson className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-semibold text-foreground">Export JSON</div>
                <div className="text-[11px] text-muted-foreground">Full structured payload with metadata and citations.</div>
              </div>
            </a>
            <Link
              href="/scam-intelligence"
              className="bg-card border border-border rounded-xl p-4 flex flex-col items-start gap-2 hover:bg-secondary/40 transition-colors"
              data-testid="link-press-dashboard"
            >
              <ImageIcon className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-semibold text-foreground">Dashboard PNG</div>
                <div className="text-[11px] text-muted-foreground">Use the "Export PNG" button on the dashboard for a screenshot at 2x pixel ratio.</div>
              </div>
            </Link>
          </div>
        </section>

        <section className="mb-10" aria-labelledby="attribution-heading">
          <h2 id="attribution-heading" className="text-xl font-semibold text-foreground mb-4">Attribution boilerplate</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Please credit GetCyberRight when you reference figures, screenshots, embedded widgets, or the underlying data export. Replace [DATE] with the date you accessed the data.
          </p>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-1.5">Plain text</div>
              <pre className="bg-secondary/40 border border-border rounded-md p-3 text-[11px] text-foreground overflow-x-auto whitespace-pre-wrap"><code data-testid="attribution-plain">{ATTRIBUTION_PLAIN}</code></pre>
              <div className="mt-2"><CopyButton text={ATTRIBUTION_PLAIN} label="text" testid="copy-attribution-plain" /></div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-1.5">HTML</div>
              <pre className="bg-secondary/40 border border-border rounded-md p-3 text-[11px] text-foreground overflow-x-auto whitespace-pre-wrap break-all"><code data-testid="attribution-html">{ATTRIBUTION_HTML}</code></pre>
              <div className="mt-2"><CopyButton text={ATTRIBUTION_HTML} label="HTML" testid="copy-attribution-html" /></div>
            </div>
          </div>
        </section>

        <section className="mb-10" aria-labelledby="terms-heading">
          <h2 id="terms-heading" className="text-xl font-semibold text-foreground mb-4">Terms of use (summary)</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>The dashboard, embed widget, and raw data exports are made available under <span className="text-foreground">CC BY 4.0</span> with required attribution to GetCyberRight.</li>
            <li>You may reproduce screenshots, charts, and figures in editorial coverage with attribution.</li>
            <li>You may republish data values from the export endpoints in tables, charts, or articles, subject to the limitations described in the <Link href="/scam-intelligence/methodology" className="text-primary hover:underline">methodology</Link>.</li>
            <li>You may not republish or redistribute the underlying primary-source reports themselves; please link to those publishers directly.</li>
            <li>You may not present forecast values as predictions or expected outcomes; they are indicative projections only.</li>
          </ul>
        </section>

        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Press contact
          </h2>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-foreground mb-2">
              For interview requests, custom data cuts, embargoed previews, or fact-checks, contact:
            </p>
            <a
              href={`mailto:${PRESS_EMAIL}?subject=Press%20inquiry%20-%20Scam%20Intelligence%20Dashboard`}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              data-testid="link-press-email"
            >
              <Mail className="w-4 h-4" />
              {PRESS_EMAIL}
            </a>
            <p className="text-[11px] text-muted-foreground mt-2">We aim to respond within one business day.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
    </div>
  );
}
