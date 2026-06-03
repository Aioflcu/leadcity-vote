// Standalone Vite config for deploying to Vercel as a static SPA.
// Usage (after cloning the repo locally, before pushing to GitHub):
//   1. Delete: vite.config.ts, wrangler.jsonc, src/server.ts, bunfig.toml, .lovable/
//   2. Rename this file to vite.config.ts
//   3. Remove "@lovable.dev/vite-tanstack-config" and "@cloudflare/vite-plugin"
//      from package.json devDependencies/dependencies
//   4. In src/routes/__root.tsx, ensure SSR-specific imports are fine (they are).
//   5. Run: npm install && npm run build
//
// The voting app is client-only (localStorage based) so static SPA hosting works.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      target: "vercel",
      customViteReactPlugin: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
