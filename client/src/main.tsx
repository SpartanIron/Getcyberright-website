import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

const rootEl = document.getElementById("root")!;
const hasSSRContent = rootEl.innerHTML.trim().length > 0;

if (hasSSRContent) {
  hydrateRoot(rootEl, <App />);
} else {
  createRoot(rootEl).render(<App />);
}
