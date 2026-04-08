import type { Metadata, Viewport } from "next";
import "../client/src/index.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
  description:
    "Protect your family online with free cybersecurity education, AI-powered scam detection tools, data broker removal, and safety training. Trusted by thousands of families worldwide.",
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
        url: "https://www.getcyberright.com/og/trust-metrics.png",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      </head>
      <body>
        <div id="root">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
