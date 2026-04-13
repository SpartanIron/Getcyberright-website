import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const cspHeader = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-eval' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://js.stripe.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src 'self' data: blob: https://images.unsplash.com https://source.unsplash.com https://images.pexels.com https://www.getcyberright.com https://*.googleusercontent.com https://www.google-analytics.com https://www.googletagmanager.com https://lh3.googleusercontent.com https://picsum.photos https://fastly.picsum.photos https://*.stripe.com https://unpkg.com`,
    `font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com`,
    `connect-src 'self' https://ipapi.co https://checkurl.phishtank.com https://urlhaus-api.abuse.ch https://haveibeenpwned.com https://www.google-analytics.com https://analytics.google.com https://www.google.com https://www.recaptcha.net https://api.stripe.com https://api.openai.com https://api.anthropic.com https://api.unsplash.com https://api.pexels.com https://unpkg.com wss://*.replit.dev wss://*.replit.app wss://*.repl.co wss://www.getcyberright.com`,
    `media-src 'self'`,
    `frame-src https://js.stripe.com https://www.google.com https://recaptcha.google.com https://www.recaptcha.net`,
    `worker-src 'self' blob:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'self'`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);

  const pathname = request.nextUrl.pathname;
  const isStaticAsset = pathname.startsWith("/_next/static/");
  if (!isStaticAsset) {
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

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
