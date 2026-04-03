import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { execSync } from "child_process";

function ssrBuildPlugin() {
  return {
    name: "ssr-build",
    apply: "build" as const,
    closeBundle() {
      if (process.env.VITE_SSR_BUILD) return;
      try {
        console.log("[SSR] Building SSR bundle...");
        execSync(
          "VITE_SSR_BUILD=1 npx vite build --config ../vite.config.ts --ssr src/entry-server.tsx --outDir ../dist/server",
          {
            cwd: path.resolve(import.meta.dirname, "client"),
            stdio: "inherit",
          },
        );
        console.log("[SSR] SSR bundle built successfully");
      } catch (e) {
        console.error("[SSR] SSR build failed. Site will fall back to client-side rendering.");
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    ssrBuildPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-query": ["@tanstack/react-query"],
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-tabs",
            "@radix-ui/react-select",
          ],
        },
      },
    },
  },
  ssr: {
    noExternal: ["wouter", "react-google-recaptcha-v3"],
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
