import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";

export function render(url: string): string {
  try {
    const html = renderToString(
      <Router ssrPath={url}>
        <App />
      </Router>
    );
    return html;
  } catch (e) {
    console.error("[SSR] Render error for", url, ":", e instanceof Error ? e.message : e);
    return "";
  }
}
