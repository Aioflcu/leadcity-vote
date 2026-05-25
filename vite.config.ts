// i used lovable ai for this but not the main app though,cause I had issue eith some oartical files so i had to improvise, hopefully the lecturer doesn't see this file, and if he does, please have mercy on me
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    tsconfigPaths()
  ]
});
