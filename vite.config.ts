import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Static SPA export config: produces a fully static site with index.html at
// root and bundled assets under /assets, using relative URLs so the build
// can be dropped onto any static host (GitHub Pages, FTP, etc.).
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    server: { entry: "server" },
    spa: { enabled: true },
    prerender: { enabled: true, crawlLinks: true },
  },
  vite: {
    base: "./",
    build: {
      assetsDir: "assets",
    },
  },
});
