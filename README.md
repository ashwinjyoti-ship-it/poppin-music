# Poppin Music

Local-first musical intelligence. You provide taste and intention. Session Agents provide craft. PMR holds musical meaning. Hear sketches in Poppin, then open them in GarageBand when you want to keep working.

Phase 1: **New Session → Generate → Audition (Play) → Send to GarageBand**. The composition canvas is not built yet.

## Run

```bash
pnpm install
cp .env.example .env   # optional AI Gateway key
pnpm test
pnpm dev               # UI at http://localhost:5173
```

`pnpm dev:desktop` opens the same UI in an Electron window (optional — browser is enough).

Without `AI_GATEWAY_API_KEY`, generation uses a deterministic quiet/reflective sketch so you can still hear and export.

## Manual test

1. Start Poppin (`pnpm dev`).
2. New Session: 74 BPM, D major, 4/4. Intention: *8 bars, quiet and reflective, slightly unresolved, simple enough for a melody.*
3. Create session → Generate.
4. Press **Play** on Audition — hear harmony / bass / drums in the browser.
5. **Send to GarageBand**:
   - **Mac with GarageBand installed:** writes `sketch.mid` and opens it in GarageBand.
   - **Otherwise:** writes the same multi-track MIDI and downloads `Poppin_Sketch.mid` so you can open it yourself.
6. Regenerate if weak. Keep if good.

Pass condition: not valid JSON. Pass condition: “Oof. Keep that.”

## Layout

```
apps/host            Vite React UI + local API (+ optional Electron)
packages/pmr         PMRSketch schema and validation
packages/musical-engine   MIDI render, hard validation, audition schedule
packages/session-agents   generate contract (one orchestrator in V0)
packages/daw-bridge  GarageBand MIDI write (other DAW bridges kept for later)
docs/                specs and Variation D design system
```
