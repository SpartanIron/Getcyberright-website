import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { Suspense } from "react";
import App from "./App";

export function render(url: string): string {
  try {
    const html = renderToString(
      <Suspense fallback={<></>}>
        <Router ssrPath={url}>
          <App />
        </Router>
      </Suspense>
    );
    return html;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Suspense") || msg.includes("lazy") || msg.includes("suspended")) {
      return "";
    }
    console.error("[SSR] Render error for", url, ":", msg);
    return "";
  }
}
