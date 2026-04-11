import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const cspHeader = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://js.stripe.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src 'self' data: blob: https://images.unsplash.com https://source.unsplash.com https://images.pexels.com https://www.getcyberright.com https://*.googleusercontent.com https://www.google-analytics.com https://www.googletagmanager.com https://lh3.googleusercontent.com https://picsum.photos https://fastly.picsum.photos https://*.stripe.com`,
    `font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com`,
    `connect-src 'self' https://ip-api.com https://checkurl.phishtank.com https://urlhaus-api.abuse.ch https://haveibeenpwned.com https://www.google-analytics.com https://analytics.google.com https://www.google.com https://www.recaptcha.net https://api.stripe.com https://api.openai.com https://api.anthropic.com https://api.unsplash.com https://api.pexels.com wss://*.replit.dev wss://*.replit.app wss://*.repl.co wss://www.getcyberright.com`,
    `media-src 'self'`,
    `frame-src https://js.stripe.com https://www.google.com https://recaptcha.google.com https://www.recaptcha.net`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'self'`,
  ].join("; ");

  const response = NextResponse.next();

  response.headers.set("Content-Security-Policy", cspHeader);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon\\.png|logo\\.webp|manifest\\.json|robots\\.txt|sitemap\\.xml|og/).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
