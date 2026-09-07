# Poppin Music - Final Build Master Spec

**Purpose:** This is the repo-level instruction document for coding Poppin Music in phases. When the user says "code next phase", the coding agent should read this document, identify the next smallest implementable slice, update the implementation, run tests, and report exactly what changed.

**Core product sentence:** Poppin Music is a local-first musical intelligence layer in front of a DAW. The user provides taste and intention; Session Agents provide musical craft; PMR preserves musical meaning; the Musical Engine renders and analyses; the DAW Bridge makes it audible in Reaper.

## 1. Founding principles

1. The user does not need to know music theory to make strong musical decisions. The interface is taste, intention, listening and selection.
2. The first build is not a market product. It is a proof that the loop feels alive: type an idea, hear harmony/bass/drums in Reaper, keep or regenerate.
3. MIDI is not the canonical source of truth. MIDI is a rendered/playable form.
4. PMR, the Poppin Musical Representation, is the internal language of music in the system.
5. Song State is the current song written in PMR.
6. Session Agents are musicians. They should be independently callable and eventually trained in Session Agent School.
7. Musical Engine is the workshop: deterministic music tools plus music-native models.
8. DAW Bridge is the translator between Poppin and Reaper.
9. Reaper is the V0 DAW and listening bench. Logic and ACE are later adapters.
10. Human audition/commit is the gate. Nothing becomes canonical merely because an agent generated it.
11. Song Memory feeds creativity. Identity Memory is only an observer by default and must not silently steer generation.
12. Build the musicians first. Do not build a gorgeous canvas to hide weak musical decisions.

## 2. Architecture in one view

```text
USER INTENTION
   ↓
HOST APP / ORCHESTRATOR
   ↓
SESSION AGENTS
   Harmony · Bass · Drums · later Guitar/Melody/Producer/DAW
   ⇄
PMR / SONG STATE
   ⇄
MUSICAL ENGINE
   deterministic tools ⇄ music-native models
   ↓
MIDI RENDER
   ↓
DAW BRIDGE
   ⇄
REAPER
   ↓
USER HEARS → KEEP / REGENERATE / COMMIT
```

## 3. Phase plan

### Phase 0 - Repo foundation

Goal: create a clean codebase that can grow without becoming musical spaghetti.

Deliverables:
- Monorepo or simple repo with clear packages.
- Local config example.
- Basic PMRSketch schema.
- Basic MIDI rendering and validation test.
- No GUI required beyond a minimal local page or CLI.

Suggested structure:

```text
poppin-music/
  docs/
    POPPIN_MUSIC_BUILD_MASTER_SPEC.md
    SESSION_AGENT_SCHOOL_PRODUCT_SPEC.md
  apps/
    host/                  # local UI/API/orchestrator
  packages/
    pmr/                   # PMR schemas + validation
    musical-engine/        # deterministic tools + later model adapters
    session-agents/        # Harmony/Bass/Drums contracts and implementations
    reaper-bridge/         # Reaper file/IPC/Lua bridge code
    shared/                # types, logging, utilities
  reaper/
    scripts/               # ReaScript Lua scripts
    templates/             # project templates/tracks
  tests/
```

Acceptance:
- `npm test` or equivalent passes.
- A sample PMRSketch can render to a valid MIDI event list.
- No direct Reaper-specific objects leak into Session Agent outputs.

### Phase 1 - Absolute V0: hear one useful sketch in Reaper

Goal: the first build should answer only this: can the system create a small harmony/bass/drums sketch and make Reaper play it?

Scope:
- Input: user prompt, tempo, key, meter, bar count.
- Intelligence: one frontier model through Vercel AI Gateway can orchestrate the first sketch.
- Output: one complete sketch, not A/B/C yet unless trivial.
- Parts: Harmony, Bass, Drums.
- Representation: PMRSketch, then rendered MIDI.
- Bridge: write MIDI or Reaper-ingestible file and trigger/guide import into fixed Reaper tracks.
- UI: CLI or minimal local browser page with Generate, Send to Reaper, Play instructions/status.

Out of scope:
- Full canvas.
- Identity Memory.
- Session Agent School runtime.
- Logic/ACE.
- Artist research.
- Bidirectional Reaper edits.
- Advanced plugins/instruments.

Acceptance:
- User can type: "8 bars, quiet, reflective, slightly unresolved, simple enough for a melody."
- The system creates a PMRSketch with harmony, bass and drums.
- The MIDI renderer creates three track streams.
- Reaper can play the result on three named tracks.
- Logs show prompt, PMRSketch, MIDI render result and bridge status.

### Phase 1.1 - Session Agent contract split

Goal: stop the first intelligence call from becoming a permanent blob.

Deliverables:
- `SessionAgentManifest` type.
- `SessionAgentInput` and `SessionAgentOutput` schema.
- HarmonySessionAgent, BassSessionAgent, DrumSessionAgent as separately callable modules.
- Shared context object from PMR/Song State.

Each Session Agent must accept:
- musical context from PMR;
- user intention;
- editable scope;
- locked material;
- constraints;
- desired number of takes.

Each Session Agent must return:
- PMR candidate material;
- explanation of musical intent;
- assumptions/warnings;
- render hints, never Reaper-specific commands.

Acceptance:
- The host can call only Bass with existing harmony.
- The host can call only Drums with existing harmony and bass.
- All agent outputs validate against schema.

### Phase 1.2 - A/B/C audition and commit

Goal: every musical proposal can be heard before it becomes the song.

Deliverables:
- Candidate branches in PMR.
- Generate 3 candidates for selected part/scope.
- Audition candidate in Reaper without changing committed Song State.
- Commit selected candidate to Song State.
- Regenerate/reject all.
- Basic undo for last commit.

Acceptance:
- Generate Harmony A/B/C, audition each, commit B.
- Generate Bass A/B/C against committed harmony, audition each, commit C.
- Undo returns PMR and Reaper render to previous committed state.

### Phase 1.3 - Stronger Reaper Bridge

Goal: make Reaper feel like the listening bench, not a manual import chore.

Deliverables:
- Reaper template with named tracks: Harmony, Bass, Drums, plus optional Audition.
- ReaScript Lua for import/replace selected bars.
- Clean logical bridge API:
  - `POST /reaper/render-candidate`
  - `POST /reaper/commit`
  - `POST /reaper/play-range`
  - `GET /reaper/status`
- Bridge can replace only selected bars/part.

Acceptance:
- A candidate can be sent to an audition track.
- Commit writes durable MIDI into correct track/range.
- Reaper playback can be triggered or clearly instructed.

### Phase 2 - PMR becomes real Song State

Goal: PMR stops being a sketch schema and becomes the canonical musical state.

Deliverables:
- Song, Section, Track, Part, HarmonyEvent, DrumEvent, NoteEvent, Performance, Intent, Constraint, Decision, DAWMapping types.
- Versioned commits.
- Locks by scope: note, bar, part, section.
- Provenance: which Session Agent generated what, from which prompt/model.
- Manual annotations.

Acceptance:
- "Keep drums; redo bass bars 5-8" is state-driven, not prompt etiquette.
- Song State can reconstruct full MIDI render.
- A committed edit is versioned and reversible.

### Phase 3 - Reverse sync from Reaper

Goal: the human can edit Reaper freely and Poppin learns the changed musical truth.

Flow:

```text
REAPER manual edit
   ↓
DAW BRIDGE detects/reads raw MIDI change
   ↓
MUSICAL ENGINE analyses/normalises the change
   ↓
PMR updates Song State and DAW mapping
   ↓
Session Agents now see the edited version
```

Deliverables:
- Read selected tracks/items/ranges from Reaper.
- Compare to current PMR render.
- Convert changed MIDI into PMR events where possible.
- Mark uncertain interpretations explicitly.

Acceptance:
- User moves two bass notes in Reaper.
- Bridge reads the change.
- PMR updates bass bars and next Bass Session Agent sees the edited version.

### Phase 4 - Minimal bit-art pastel UI

Goal: a pleasant small working interface, not the final canvas.

Visual direction:
- Washed-out pastel colours.
- Bit-art/pixel motifs because MIDI is discrete event data.
- Teenage Engineering-style clarity: hardware-like blocks, labels, restrained controls.
- Hermes-inspired agent surface: clean agent cards, memory/status panels, clear delegation.

Required UI:
- Prompt bar.
- Song context chips: tempo, key, meter, selected bars.
- Session Agent rail.
- PMR/Song State inspector.
- A/B/C candidate cards.
- Audition, Commit, Regenerate, Undo.
- Reaper connected/synced status.

Acceptance:
- User can complete the Phase 1.2 loop without touching terminal.

### Phase 5 - Session Agent Library integration

Goal: trained Session Agents can be added to Poppin without rewriting the host app.

Deliverables:
- `agents/manifest.json` convention.
- Agent package folder format:

```text
agents/harmony-v1/
  manifest.json
  skills/
  prompts/
  evaluations/
  adapter.ts
  README.md
```

- Host scans available Session Agents.
- Agent can declare capabilities: harmony, bass, drums, melody, producer, daw, sound.
- Agent can declare required PMR context and optional tools.
- Agent can be enabled/disabled per project.

Acceptance:
- A new Session Agent folder can be dropped in and appear in the app.
- Host can call it through the standard contract.
- Invalid agent manifests fail with clear errors.

### Phase 6 - Session Agent School integration point

Goal: Poppin consumes trained agents; School remains separate.

Rules:
- School is not required to run Poppin Music.
- Poppin does not train agents during normal composition.
- Poppin can export evaluation records if the user chooses.
- Poppin can import promoted Session Agent versions from School.

Acceptance:
- Poppin can export: prompt, PMR context, generated A/B/C, audition/commit choice, user reason, final edit distance.
- School can produce an updated agent package.
- Poppin can install or update that package.

### Phase 7 - Producer, DAW awareness, Logic and ACE

Goal: expand after the Reaper loop and Session Agent contract are stable.

Add:
- Producer/Arranger Session Agent.
- DAW Producer/Inspector.
- Plugin/instrument inventory.
- Logic adapter.
- ACE Studio adapter.
- Artist/genre reference packs.
- Sonic/audio analysis.

Keep boundary:
- Identity Memory remains observer by default.
- Reference Memory can influence generation only when explicitly chosen for the current song/project.

## 4. PMR rules

PMR stands for Poppin Musical Representation.

PMR is the language. Song State is the current composition written in that language. MIDI is the playable/rendered form.

Minimum Phase 1 PMRSketch:

```ts
type PMRSketch = {
  meta: { title?: string; tempo: number; meter: '4/4' | string; key?: string; bars: number };
  intention: string;
  sections: Array<{ id: string; name: string; startBar: number; endBar: number }>;
  harmony: Array<{ bar: number; chord: string; role?: string; tension?: string; notes?: string[] }>;
  bass: Array<{ bar: number; events: NoteEvent[]; role?: string }>;
  drums: Array<{ bar: number; events: DrumEvent[]; role?: string }>;
  decisions?: DecisionRecord[];
};
```

Later PMR should store: composition, performance, arrangement, sound and interaction dimensions.

## 5. Musical Engine workflow

Forward:

```text
Session Agent asks PMR what exists
   ↓
Musical Engine analyses / generates / transforms / validates
   ↓
Session Agent judges the possibilities
   ↓
Candidate enters PMR
   ↓
Musical Engine renders candidate to MIDI
   ↓
Bridge sends it to Reaper
```

Reverse:

```text
Reaper edit
   ↓
Bridge reads raw DAW/MIDI change
   ↓
Musical Engine interprets musical consequence
   ↓
PMR updates meaning and Song State
   ↓
Session Agents use new truth
```

## 6. Cursor/Grok coding-agent instructions

When coding from this document:

1. Do not expand scope unless explicitly instructed.
2. Implement the next smallest phase slice.
3. Keep PMR separate from MIDI and Reaper.
4. Keep Session Agents separate from the host app.
5. Keep Reaper commands inside the Bridge only.
6. Add tests for schemas, rendering and bridge file outputs.
7. Prefer boring reliable code over clever architecture theatre.
8. After each phase, update this document if a decision changes.
9. Produce a run command and a manual test recipe.
10. Report what is done, what is mocked, and what is still not implemented.

## 7. Current north-star manual test

1. Open Reaper template.
2. Start Poppin local app.
3. Enter: "8 bars, quiet and reflective, slightly unresolved, simple enough for a melody."
4. Generate harmony, bass and drums.
5. Send to Reaper.
6. Hear it.
7. Regenerate if weak.
8. Commit if good.

The pass condition is not merely valid JSON. The pass condition is: "Oof. Keep that."
