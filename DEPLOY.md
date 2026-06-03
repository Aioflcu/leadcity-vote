# Deploy to Vercel (and strip preview-only tooling)

This project was developed in a sandboxed preview that uses a custom Vite
config. Before pushing to GitHub for grading / Vercel deployment, run the
**cleanup steps** below to remove the preview tooling so the repo is
self-contained and deploys cleanly on Vercel.

## 1. Clone the repo locally

```bash
git clone <your-github-url>
cd <repo>
```

## 2. Cleanup script (one shot)

Run this from the project root:

```bash
# Remove preview-only files
rm -rf .lovable
rm -f wrangler.jsonc
rm -f bunfig.toml
rm -f src/server.ts
rm -f src/start.ts
rm -f src/lib/error-capture.ts
rm -f src/lib/error-page.ts

# Swap in the Vercel-ready Vite config
mv vite.config.vercel.ts vite.config.ts
```

Then open `package.json` and **delete these two lines** from
`devDependencies` / `dependencies`:

```jsonc
"@lovable.dev/vite-tanstack-config": "...",
"@cloudflare/vite-plugin": "...",
```

Also remove these scripts referencing the old config if present, and
make sure `scripts` looks like:

```json
"scripts": {
  "dev": "vite dev",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

In `src/routes/__root.tsx`, the SSR error wrappers are no longer needed but
won't break anything if left in place.

## 3. Reinstall and test locally

```bash
rm -rf node_modules package-lock.json bun.lock
npm install
npm run build
npm run preview
```

If `npm run build` succeeds, you're ready to deploy.

## 4. Push and deploy

```bash
git add -A
git commit -m "Prepare for Vercel deployment"
git push
```

Then on [vercel.com/new](https://vercel.com/new):

1. Import the GitHub repo
2. Framework preset: **Vite** (auto-detected from `vercel.json`)
3. Click **Deploy**

Done — your voting app is live.
