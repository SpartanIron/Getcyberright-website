import type { Metadata, Viewport } from "next";
import "../client/src/index.css";
import Providers from "./providers";
import AppShell from "./app-shell";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
  description:
    "Free cybersecurity education for families. AI-powered scam detection, data broker removal, and safety training — no account or expertise needed.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        <div id="root">
          <Providers><AppShell>{children}</AppShell></Providers>
        </div>
      </body>
    </html>
  );
}
