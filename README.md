# BallotBox — Voting Application

A modern, production-ready voting platform built with **React 19**, **TanStack Router**, **Tailwind CSS v4**, and **Recharts**. State is persisted in `localStorage` so the app runs entirely on the client — no backend required.

## Features

- User registration & login (client-side auth)
- Browse candidates with manifestos
- Secure single-vote ballot with confirmation
- User dashboard tracking voting history
- Admin dashboard with real-time charts, candidate CRUD, and election controls
- Dark mode, responsive design, accessible UI
- Hidden admin entry (footer button **"2000"**, password **`2000`**)

## Tech Stack

- React 19 + TypeScript
- TanStack Router (file-based routing)
- Tailwind CSS v4
- Radix UI primitives + shadcn/ui
- Recharts for analytics
- Zod for validation
- React Hook Form

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```bash
npm run build
```

## Deployment to Vercel

This repo ships with a `vercel.json` ready for one-click deploy.

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects the framework. Just click **Deploy**.

No environment variables are required — the app is fully client-side.

### Project Structure

```
src/
├── components/       # Reusable UI + Navbar/Footer
├── context/          # AppContext (global state)
├── hooks/            # Custom hooks
├── lib/              # voting-store (localStorage) + utils
├── routes/           # File-based routes (pages)
└── styles.css        # Tailwind + design tokens
```

## License

MIT
