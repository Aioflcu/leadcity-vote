// i used lovable ai for this but not the main app though,cause I had issue eith some oartical files so i had to improvise, hopefully the lecturer doesn't see this file, and if he does, please have mercy on me
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});
