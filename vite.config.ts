// i used lovable ai for this but not the main app though,cause I had issue eith some oartical files so i had to improvise, hopefully the lecturer doesn't see this file, and if he does, please have mercy on me
import { defineConfig } from "@tanstack/react-start/config";

export default defineConfig({
  server: {
    preset: "vercel", // 👈 This forces Vinxi/Nitro to build the exact layout Vercel wants automatically
  },
});
