# poppin-music 🎵

A real-time collaborative music leaderboard. Add tracks, upvote the ones you
love, and watch the board re-rank live — the crowd decides what's poppin'.

Built with **[Convex](https://convex.dev)** (real-time backend) + **React** +
**Vite** + **TypeScript**.

## Stack

| Layer    | Tech                                             |
| -------- | ------------------------------------------------ |
| Backend  | Convex (queries/mutations, reactive `tracks` DB) |
| Frontend | React 18 + Vite 6 + TypeScript                   |
| Tooling  | ESLint (flat config), `tsc` project references   |

## Project layout

```
convex/
  schema.ts      # tracks table + by_votes index
  tracks.ts      # list / add / upvote / remove functions
  seed.ts        # optional demo data
src/
  App.tsx        # leaderboard UI
  main.tsx       # ConvexProvider bootstrap
scripts/
  setup.sh       # idempotent install + Convex provisioning
```

## Getting started

Prerequisites: Node 22+.

```bash
# Install deps and provision a local Convex backend (writes .env.local).
./scripts/setup.sh

# Terminal 1 — Convex backend (keeps types + functions in sync)
CONVEX_AGENT_MODE=anonymous npx convex dev

# Terminal 2 — frontend
npm run dev            # http://localhost:5173
```

> `CONVEX_AGENT_MODE=anonymous` runs a **local** Convex backend with no login —
> ideal for cloud agents and CI. See
> [Convex agent mode](https://docs.convex.dev/cli/agent-mode).

### Optional: seed demo tracks

```bash
CONVEX_AGENT_MODE=anonymous npx convex run seed:run
```

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the Vite dev server            |
| `npm run dev:backend` | Start the Convex dev backend       |
| `npm run build`     | Type-check and build for production  |
| `npm run typecheck` | Type-check only                      |
| `npm run lint`      | Lint with ESLint                     |

## Cloud Agent environment

`.cursor/environment.json` configures Cursor Cloud Agents: `scripts/setup.sh`
installs dependencies and provisions the local Convex deployment, and the
`convex` and `vite` terminals bring the app up on boot.
