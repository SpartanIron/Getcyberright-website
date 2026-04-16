import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const cspHeader = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-eval' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://recaptcha.google.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src 'self' data: blob: https://source.unsplash.com https://images.unsplash.com https://images.pexels.com https://www.getcyberright.com https://www.google-analytics.com`,
    `font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com`,
    `connect-src 'self' https://ipapi.co https://checkurl.phishtank.com https://urlhaus-api.abuse.ch https://haveibeenpwned.com https://www.google-analytics.com https://region1.google-analytics.com`,
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

  // SEO-friendly caching: allow Google to cache public pages
  // Only apply no-cache to authenticated/dynamic routes
  const privatePaths = ["/account", "/admin", "/dashboard", "/login", "/register", "/checkout-success", "/preferences", "/extension-auth"];
  const isPrivatePath = privatePaths.some(p => pathname.startsWith(p));

  if (!isStaticAsset) {
    if (isPrivatePath) {
      // Private pages: prevent caching
      response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
    } else {
      // Public pages: allow search engines and CDN to cache
      response.headers.set("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
    }
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
