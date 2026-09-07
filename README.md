# Poppin Music

Local-first musical intelligence in front of Reaper. You provide taste and intention. Session Agents provide craft. PMR holds musical meaning. Reaper is the listening bench.

Phase 1: **New Session → Generate → Audition → Send to Reaper**. The composition canvas is not built yet.

## Run

```bash
pnpm install
cp .env.example .env   # optional AI Gateway key
pnpm test
pnpm dev               # UI at http://localhost:5173
```

`pnpm dev:desktop` opens the same UI in an Electron window.

Without `AI_GATEWAY_API_KEY`, generation uses a deterministic quiet/reflective sketch so the Reaper loop still works.

## Manual test

1. Start Poppin (`pnpm dev`).
2. New Session: 74 BPM, D major, 4/4. Intention: *8 bars, quiet and reflective, slightly unresolved, simple enough for a melody.*
3. Create session → Generate.
4. Send to Reaper. Harmony / Bass / Drums open with MIDI already on the tracks.
5. Regenerate if weak. Keep if good.

Pass condition: not valid JSON. Pass condition: “Oof. Keep that.”

## Layout

```
apps/host            Electron + Vite React UI + local API
packages/pmr         PMRSketch schema and validation
packages/musical-engine   MIDI render + hard validation
packages/session-agents   generate contract (one orchestrator in V0)
packages/daw-bridge  Reaper file write / status
reaper/              template + Lua import script
docs/                specs and Variation D design system
```
