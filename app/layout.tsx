import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "../client/src/index.css";
import Providers from "./providers";
import AppShell from "./app-shell";
import GoogleAnalytics from "../client/src/components/google-analytics";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
  description:
    "Free cybersecurity education for families. AI-powered scam detection, data broker removal, and safety training. No account or expertise needed.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords:
    "cybersecurity, online safety, scam detection, identity theft protection, data broker removal, family security, senior safety, phishing protection",
  openGraph: {
    siteName: "GetCyberRight",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/trust-metrics.png`,
        width: 1080,
        height: 1080,
        alt: "GetCyberRight - Cybersecurity Education for Families",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GetCyberRight",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") || undefined;
  const globalJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "GetCyberRight",
      url: BASE_URL,
      logo: `${BASE_URL}/og/trust-metrics.png`,
      description:
        "GetCyberRight is a mission-driven platform dedicated to making cybersecurity education accessible to every family. Free tools, training, and resources to protect families online.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: `${BASE_URL}/contact`,
      },
      sameAs: [
        "https://x.com/getcyberright",
        "https://www.facebook.com/getcyberright",
        "https://www.linkedin.com/company/getcyberright",
        "https://www.youtube.com/@getcyberright",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "GetCyberRight",
      url: BASE_URL,
      description:
        "Free cybersecurity education, AI-powered scam detection tools, data broker removal, and safety training for families.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(){var MAX=2,DELAY=1500;function retry(el){try{var src=el.getAttribute&&el.getAttribute('src');if(!src||src.indexOf('/_next/')===-1)return;var att=parseInt(el.getAttribute('data-retry')||'0',10);if(att>=MAX)return;att++;setTimeout(function(){var s=document.createElement('script');s.src=src+(src.indexOf('?')===-1?'?':'&')+'_r='+att;s.setAttribute('data-retry',String(att));s.async=el.async;s.defer=el.defer;if(el.type)s.type=el.type;if(el.crossOrigin)s.crossOrigin=el.crossOrigin;el.parentNode&&el.parentNode.insertBefore(s,el.nextSibling)},DELAY*att)}catch(e){}}document.addEventListener('error',function(e){var el=e.target;if(el&&el.tagName==='SCRIPT')retry(el)},true)})()`,
          }}
        />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        <div id="root">
          <Providers><AppShell>{children}</AppShell></Providers>
        </div>
      </body>
    </html>
  );
}
