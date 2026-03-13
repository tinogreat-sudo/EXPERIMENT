# Personal Operating System

A personal life-management web app that acts as a command center for daily execution, self-accountability, and long-term growth. Built with Next.js, TypeScript, Tailwind CSS, and Dexie.js (offline-first).

## Quick Start

```bash
cd personal-os
pnpm install
cp .env.example .env.local   # then add your API keys
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY_1` | For AI features | Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey)) |
| `DATABASE_URL` | For cloud sync (Phase 4) | PostgreSQL connection string (e.g., Supabase) |

> **Note:** The app works fully offline without API keys — only the AI Coach, AI scoring, and AI summaries require a Gemini API key.

## Project Status

See **[PROJECT-STATUS.md](./PROJECT-STATUS.md)** for a comprehensive analysis of what's built, what's missing, and the full roadmap phase status.

## Documentation

| Document | Description |
|----------|-------------|
| [MVP.md](./MVP.md) | Full product spec — features, workflows, scoring rules, AI behavior |
| [TECH-STACK.md](./TECH-STACK.md) | Technology choices, data architecture, schemas, sync strategy |
| [UI-DESIGN.md](./UI-DESIGN.md) | Design system — colors, typography, component specs, layout grid |
| [PROJECT-STATUS.md](./PROJECT-STATUS.md) | Current build status, feature audit, known issues, next steps |

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Local Storage:** Dexie.js (IndexedDB, offline-first)
- **Charts:** Recharts
- **Animations:** Framer Motion
- **AI:** Google Gemini API
- **Cloud DB (planned):** PostgreSQL via Supabase + Prisma