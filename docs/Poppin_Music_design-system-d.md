# Poppin Music — Design System
## Variation D: Pure Engineering + Soft Skeuomorphism
**Version 0 · September 2026**

---

## 0. Philosophy

Variation D is Variation A (Pure Engineering) with a 40% skeuomorphic layer applied. The interface behaves like precision hardware — every surface has a physical orientation relative to an implied light source sitting above and slightly left. Depth cues are deliberate and minimal: a card feels like a piece of card stock on a warm cream desk, a button feels like a physical key, an input field feels pressed into the surface. Nothing is theatrical. A user might not consciously notice the depth; they will feel the difference.

---

## 1. Logo

### Mark
A 2×2 pixel grid. Four equal squares arranged in a 2×2 layout with a 2px gap between them.

| Position | Treatment |
|---|---|
| Top-left | Filled solid — `#273038` |
| Top-right | Filled solid — `#273038` |
| Bottom-left | Filled solid — `#273038` |
| Bottom-right | Outline only — `1px border #273038`, transparent interior |

### Sizes
- App header mark: `12×12px` (each square ~5px, gap 2px)
- Favicon: `16×16px`
- Standalone asset: `128×128px`

### Logo Philosophy

The mark is a 2×2 bit cell — the most fundamental unit of digital data. Three squares are filled; one is not.

**The three filled squares are the Session Agents** — Harmony, Bass, Drums. They are complete, defined, filled with technique and craft. The system provides.

**The outlined square is the human.** It has a boundary — intention, taste, the ear that decides — but its interior is always open. It is never filled in advance because the human is the creative authority, the one who listens and commits. The system cannot fill that square for you.

Together the four squares form a complete 2×2 byte — the irreducible unit of the product. The music is only whole when all four positions are occupied: three agents and one listener.

The gap between the squares (2px) is the silence between musicians. Space that is felt, not heard.

### Usage Rules
- Always render on a transparent or single-colour background. No drop shadows on the mark itself.
- Minimum size: 12×12px (3-pixel squares with 1px gap) — do not render smaller or the outline square loses legibility.
- Colour: always `#273038` on light backgrounds. On dark backgrounds invert to `#E8E4DC`.
- Never use the mark in a colour other than the primary text colour of its context.

---

## 2. Colour System

### Backgrounds

| Token | Hex | Usage |
|---|---|---|
| `bg-page` | `#F5F2ED` + radial gradient | Page/body background. Apply `radial-gradient(ellipse at 50% 0%, #F8F5F0 0%, #F0EDE6 100%)` — imperceptibly lighter at top-centre, implies an overhead light source. |
| `bg-panel` | `#FBFAF7` + linear gradient | All cards, panels, forms, rails. Apply `linear-gradient(160deg, #FFFFFF 0%, #F7F5F0 100%)`. |
| `bg-input` | `#EDEAE4` | Text inputs, textareas. Recessed into the surface. |
| `bg-header` | `#F5F2ED` | Top navigation bar. Same as page. |

### Text

| Token | Hex | Usage |
|---|---|---|
| `text-primary` | `#273038` | Headings, active labels, all primary copy |
| `text-secondary` | `#646A6B` | Supporting body copy, descriptions |
| `text-tertiary` | `#747A7D` | Metadata, timestamps, contextual notes |
| `text-muted` | `#8D908F` | Inactive labels, placeholder-level text |
| `text-faint` | `#999A96` | Captions, version tags, idle states |
| `text-inverse` | `#FBFAF7` | Text on dark (`#273038`) button backgrounds |

### Borders & Dividers

| Token | Hex | Usage |
|---|---|---|
| `border-default` | `#D8D4CE` | Standard panel borders, separators, rail dividers |
| `border-strong` | `#BEBBB5` | Slightly stronger — input borders, candidate card borders, bottom command-bar border |
| `border-active` | `#273038` | Active/selected state (active section pill, currently-playing candidate card, focused input) |

### Semantic Agent Colours

Each Session Agent has one colour. The colour appears as: small square status icons (7px), left-edge agent card accent (3px border-left), MIDI note block fill, and tag backgrounds.

| Agent | Base Fill | Gradient (MIDI blocks) | Usage |
|---|---|---|---|
| Harmony | `#B8C8D4` | `linear-gradient(180deg, #BFCEDA 0%, #AEBECB 100%)` | Dusty blue |
| Bass | `#D4C8B8` | `linear-gradient(180deg, #DACFC0 0%, #C9BCAA 100%)` | Warm sand |
| Drums | `#D4B8C3` | `linear-gradient(180deg, #DABFCA 0%, #C9AAB6 100%)` | Dusty rose |
| Committed / Keep | `#B8D4C3` | `linear-gradient(180deg, #C3DDCD 0%, #ACCAB7 100%)` | Sage green — used on "Keep this" button |
| Reaper Bridge | `#C3B8D4` | `linear-gradient(180deg, #CABFDA 0%, #B5AAC9 100%)` | Muted lavender — used on bridge status indicator |

All agent colours at base fill also receive: `border-top: 1px solid rgba(255,255,255, 0.5)` and `box-shadow: 0 1px 2px rgba(0,0,0, 0.08)` to lift them slightly off the surface.

### State Colours

| State | Treatment |
|---|---|
| Active/selected section pill | `border: 1px solid #273038`, no fill change |
| Currently playing candidate card | Full `border: 1px solid #273038`, `PLAYING` badge in `#273038` fill / `#FBFAF7` text |
| Generating progress dots | Three 4×4px squares: filled `#273038` → `#9A9B96` → `#CDCCC7` (left to right) |
| Locked item icon | `fa-lock` at 9px, `#273038` |
| Connected status dot | `7px square`, colour = agent's semantic pastel (Reaper = `#C3B8D4`) |

---

## 3. Typography

### Typefaces

| Role | Family | Source |
|---|---|---|
| Body / UI | DM Sans | Google Fonts — weights 300, 400, 500 |
| Monospace / Data | IBM Plex Mono | Google Fonts — weights 400, 500 |

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type Scale

| Token | Size | Weight | Tracking | Usage |
|---|---|---|---|---|
| `type-hero` | 52px | 300 (light) | `-0.035em` | New Session headline |
| `type-h1` | 38px | 300 (light) | `-0.025em` | Page-level headings (Audition) |
| `type-h2` | 20px | 400 (normal) | default | Panel headings |
| `type-body-lg` | 17px | 300 | default | Intention text, form inputs |
| `type-body` | 14–15px | 300–400 | default | Body copy, card descriptions |
| `type-body-sm` | 13px | 300–400 | default | Rail labels, secondary copy |
| `type-ui` | 11px | 500 | `0.14–0.18em` | Navigation links, button labels (uppercase) |
| `type-label` | 10px | 500 | `0.12–0.16em` | Section labels (uppercase small caps style) |
| `type-mono-lg` | 36px | 500 | default | A/B/C candidate label |
| `type-mono-data` | 10px | 400 | `0.16–0.18em` | MIDI values, BPM, bar numbers, agent status |
| `type-mono-xs` | 9px | 400 | `0.10–0.12em` | Grid annotations, timestamps, captions |

### Rules
- **DM Sans** carries all prose, navigation, UI labels, headings, and button text.
- **IBM Plex Mono** carries all MIDI data (note names, chord symbols, BPM, bar counts), technical status strings (VERSE · 5–8, COMMITTED, GENERATING), and all uppercase annotation tags.
- Uppercase labels use `letter-spacing: 0.12–0.18em`. Never use `font-variant: small-caps` — track manually.
- Font weight 300 (light) is the default body weight. Weight 400 for card headings, navigation, active states. Weight 500 sparingly for UI labels and data emphasis.

---

## 4. Spacing & Grid

### Base Unit
`8px` — all spacing, sizing, and layout measurements are multiples of 8.

### Layout Grid (Desktop 1440px)
```
┌─────────────────────────────────────────────────┐
│  HEADER  48px                                   │
├──────────┬───────────────────────┬──────────────┤
│  LEFT    │  CANVAS CENTER        │  RIGHT RAIL  │
│  RAIL    │  (flex: 1)            │  240px       │
│  220px   │                       │              │
├──────────┴───────────────────────┴──────────────┤
│  COMMAND BAR  64px (col-span-3)                 │
└─────────────────────────────────────────────────┘
```

| Zone | Width | Notes |
|---|---|---|
| Page | 1440px fixed | Desktop-first, no responsive breakpoints in V0 |
| Header | full-width × 48px | Fixed top, contains logo, song meta, nav, bridge status |
| Left Rail | 220px | Session Agents, Locks |
| Right Rail | 240px | Context, Selection, Intention, Lock state, Last Decision |
| Center Canvas | remaining (~980px) | MIDI piano-roll grid, section strip, playhead |
| Command Bar | full-width × 64px | Transport controls, natural-language input, Generate button |

### Common Spacing Values
| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Micro gaps (dot spacing, inline gaps) |
| `space-2` | 8px | Base unit — tight internal padding |
| `space-3` | 12px | Card internal padding, icon-to-text gap |
| `space-4` | 16px | Standard component padding |
| `space-5` | 20px | Panel padding |
| `space-6` | 24px | Section gap |
| `space-8` | 32px | MIDI bar width on piano-roll |
| `space-10` | 40px | Large panel padding |
| `space-16` | 64px | Page section gap |
| `space-24` | 96px | Page layout horizontal padding |

---

## 5. Skeuomorphic Layer (The Core of Variation D)

This is a 40% skeuomorphic layer. All depth cues simulate a warm overhead light source at the top-left. No element exceeds 12px blur or 10% opacity on drop shadows (except the dark primary button).

### Panel / Card Surfaces
Applied to all `bg-panel` (`#FBFAF7`) containers:

```css
background: linear-gradient(160deg, #FFFFFF 0%, #F7F5F0 100%);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.6),   /* top inner highlight */
  inset 1px 0 0 rgba(255, 255, 255, 0.3),   /* left inner highlight */
  inset 0 -1px 0 rgba(0, 0, 0, 0.06),       /* bottom inner shadow */
  inset -1px 0 0 rgba(0, 0, 0, 0.04),       /* right inner shadow */
  0 1px 3px rgba(0, 0, 0, 0.06),            /* near drop shadow */
  0 4px 12px rgba(0, 0, 0, 0.04);           /* ambient lift */
```

### Header Bar
```css
box-shadow:
  0 1px 0 rgba(255, 255, 255, 0.85),  /* bottom edge highlight */
  0 2px 6px rgba(0, 0, 0, 0.04);     /* soft separation from content */
```

### Dividers / Separators
Two-line engraved groove technique — do not use a single 1px flat line:
```css
border-top: 1px solid rgba(0, 0, 0, 0.08);
box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.85);
```
This reads as a groove pressed into the surface.

### Default Button (Secondary)
```css
background: linear-gradient(180deg, #F0EDE8 0%, #E0DDD8 100%);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.8),  /* top highlight — lit face */
  0 2px 6px rgba(0, 0, 0, 0.10);           /* drop shadow — lifted off surface */
transition: box-shadow 0.15s, background 0.15s;
```
**Hover:**
```css
background: linear-gradient(180deg, #EDEAE4 0%, #E3E0DA 100%);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.6),
  0 3px 9px rgba(0, 0, 0, 0.10);
```

### Primary / Commit Button (Dark)
The one high-contrast element. One per page.
```css
background: linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%);
color: #FBFAF7;
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.08),  /* subtle top glint */
  0 2px 8px rgba(0, 0, 0, 0.25);
```
**Hover:**
```css
background: linear-gradient(180deg, #242424 0%, #111111 100%);
```

### "Keep This" / Committed Button (Sage)
```css
background: linear-gradient(180deg, #C3DDCD 0%, #ACCAB7 100%);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.55),
  0 2px 6px rgba(0, 0, 0, 0.10);
```

### Input Fields & Textareas
Recessed / pressed-into-surface:
```css
background: #EDEAE4;
box-shadow:
  inset 0 1px 3px rgba(0, 0, 0, 0.10),
  inset 0 1px 1px rgba(0, 0, 0, 0.06);
border: 1px solid #BEBBB5;
```
**Focus:**
```css
box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.14);
border-color: #273038;
```

### MIDI Note Blocks
Each note block on the piano-roll (and candidate MIDI preview) uses the agent's semantic colour with micro-depth:
```css
/* Example for Harmony note block */
background: linear-gradient(180deg, #BFCEDA 0%, #AEBECB 100%);
border-top: 1px solid rgba(255, 255, 255, 0.5);  /* top highlight */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);       /* lifts block off grid */
```
Apply same pattern to Bass (`#DACFC0 → #C9BCAA`), Drums (`#DABFCA → #C9AAB6`).

### Agent Cards (Left Rail)
Each agent card receives a `3px` left border in its semantic agent colour — acts as a physical card-slot tab:
```css
/* Harmony */
border-left: 3px solid #B8C8D4;

/* Bass */
border-left: 3px solid #D4C8B8;

/* Drums */
border-left: 3px solid #D4B8C3;
```
Combined with the panel surface treatment, these read as tabbed card slots.

### Section Blocks (Song Structure)
```css
background: linear-gradient(180deg, [pastel-top] 0%, [pastel-bottom] 100%);
border: 1px solid rgba(39, 48, 56, 0.12);
box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);  /* slightly raised tiles */
```

### Page Background
```css
background: radial-gradient(ellipse at 50% 0%, #F8F5F0 0%, #F0EDE6 100%);
```
Imperceptibly lighter at the top centre — implies overhead illumination across the whole canvas.

---

## 6. Component Library

### Header Bar
- Height: `48px`
- Background: `#F5F2ED` + header shadow treatment
- Left zone: 220px — logo mark (12×12px) + `POPPIN` wordmark in `11px / 500 / tracking-[0.16em]`
- Center: song title (`13px / 400`) + monospace meta (BPM, KEY, METER at `10px`)
- Right: navigation links (`11px / uppercase / tracking-[0.12em]`) + Reaper status dot + label
- Border-bottom: `1px solid #D8D4CE`

### Session Agent Card
```
┌─[3px left accent border]──────────────────┐
│  Agent name (13px/400)         ■ [dot]    │
│  STATUS (mono 9px)             8 BARS     │
└────────────────────────────────────────────┘
```
- Background: panel surface treatment (`#FBFAF7` + gradient + inset shadows)
- Border: `1px solid #D8D4CE`
- Left accent: `3px solid [agent-colour]`
- Status values: `COMMITTED`, `GENERATING`, `IDLE`
- Generating animation: 3× 4px squares in progression (`#273038` → `#9A9B96` → `#CDCCC7`)

### MIDI Piano-Roll Canvas
- Grid background:
  ```css
  background-image:
    linear-gradient(to right, rgba(39,48,56,0.055) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(39,48,56,0.05) 1px, transparent 1px);
  background-size: 32px 100%, 100% 16px;
  ```
- Bar lines: `1px solid rgba(39,48,56,0.18)` at every 32px horizontal interval
- Bar number labels: `mono 9px / #9A9B97` flush left above track row
- Track label column: `88px` wide, `border-right: 1px solid #D8D4CE`, labels in `mono 9px`
- Note blocks: height `12px`, variable width by duration, agent colour with micro-gradient and top-highlight
- Playhead: `1px solid #273038`, `7×7px` filled square at top

### Command Bar
- Height: `64px`, spans full width in 3-column grid
- Border-top: engraved divider treatment
- Left cell (220px): transport controls — Play / Loop / Stop as `32×32px` bordered square buttons
- Center cell: monospace arrow `→` + text input (full-width, flat, `14px`) + keyboard shortcut hint `⌘↵` + **Generate** button
- Right cell (240px): active agent status + generating dots
- Generate button: primary dark treatment (`#273038` with dark gradient)

### A/B/C Candidate Cards
- Layout: 3-column equal grid
- Each card: `min-height ~514px`, flexbox column
- Header zone: `80px` — candidate letter (`mono 36px / 500`) + archetype name + density dots
- MIDI preview zone: `192px` — mini piano-roll with agent-colour note blocks
- Description zone: flex-1 — `WHY IT MOVES` label (mono 9px) + explanation (14px) + note path (mono 9px)
- Action zone: `border-top` + 2-column button grid (Play/Loop + Keep This) + full-width Splice row
- **Playing state**: full `border: 1px solid #273038` + `PLAYING` badge (`#273038` fill, `#FBFAF7` text, positioned `-top-px right-5`)
- **Inactive state**: `border: 1px solid #BEBBB5`

### Density Dots
Three 8×8px squares indicating musical density (sparse → full):
```
● ○ ○   sparse
● ● ○   medium
● ● ●   full
```
Filled: `bg-[agent-colour]`. Outlined: `border: 1px solid [agent-colour]`.

### Commit History Row
```
[timestamp mono 9px]  [AGENT badge]  [section · bars]  [description 13px]  [↩ undo]
```
- Engraved `border-top` divider between rows
- Agent badge: `6px` square in agent colour + agent name mono 9px
- Undo: `10px / tracking-[0.12em] uppercase / text-[#747A7D]`
- Row hover: very subtle background shift to `#F5F2ED`

### Section Strip (Composition Canvas top bar)
- Height: `56px`, `border-bottom: 1px solid #D8D4CE`
- Section pills: `height 28px`, `border: 1px solid #D8D4CE`, `mono 9px uppercase`
- Active section: `border: 1px solid #273038`
- Format: `SECTION-NAME · BAR-COUNT` (e.g. `VERSE · 8`)

### Reaper Status Indicator
- `7×7px` square, colour = `#C3B8D4` (lavender) when connected
- `mono 10px uppercase` label: `REAPER / CONNECTED` or `REAPER / AUDITION READY`
- Position: right zone of header

---

## 7. Motion & Transitions

Variation D uses restrained motion. Nothing animates without purpose.

| Interaction | Duration | Easing | Property |
|---|---|---|---|
| Button hover | 150ms | ease | `background`, `box-shadow` |
| Input focus | 100ms | ease | `box-shadow`, `border-color` |
| Candidate card selection | 150ms | ease | `border-color`, `box-shadow` |
| Agent status change | 200ms | ease | opacity on status text |
| Generating dots | 600ms loop | ease-in-out | opacity stagger (dot 1 → 2 → 3) |
| Playhead advance | real-time | linear | `left` position |

No page transitions in V0. No entrance animations. No skeleton loaders.

---

## 8. Iconography

All icons: **Font Awesome 6.5.1 Solid** (`fa-solid`).

| Icon | Usage | Size |
|---|---|---|
| `fa-play` | Transport play, candidate Play button | 9px |
| `fa-pause` | Active candidate "Playing" state | 8px |
| `fa-stop` | Transport stop | 9px |
| `fa-repeat` | Transport loop | 9px |
| `fa-rotate` | Regenerate all | 8px |
| `fa-arrow-right` | Form submit, CTA | 9px |
| `fa-arrow-left` | Back navigation | 9px |
| `fa-chevron-down` | Dropdown indicator, Splice expander | 8–9px |
| `fa-lock` | Locked material indicator | 9px |
| `fa-square` | Agent status dot, density fill dot | 7px |

**Agent status squares**: `fa-solid fa-square` at `7px` in the agent's semantic colour. Idle states use `text-[#A3A29E]`.

**Logo mark**: not an icon — rendered as four `<span>` elements in a 2×2 CSS grid (see §1).

---

## 9. Page Inventory

| Page | File | Primary Purpose |
|---|---|---|
| New Session | `d-new-session.html` | Start a session: BPM, key, meter, intention, reference |
| Composition Canvas | `d-composition-canvas.html` | MIDI piano-roll workspace — the central screen |
| A/B/C Candidate Audition | `d-candidate-audition.html` | Hear and choose between 3 generated takes |
| Song Structure | `d-song-structure.html` | Arrangement overview — all sections as a musical map |
| Commit History | `d-commit-history.html` | Chronological log of all decisions + undo |
| Reaper Bridge & Settings | `d-reaper-settings.html` | DAW connection status, sync, adapter config |

### Page Anatomy (All Pages)
```
Header (48px)
└── Logo mark + wordmark | Song meta + nav | Reaper status

Content Area
├── Left Rail (220px) — agents / locks / version tag
├── Center Canvas (flex) — primary workspace
└── Right Rail (240px) — context / selection / intention

Command Bar (64px, Composition Canvas only)
└── Transport | Natural-language input + Generate | Agent status
```

---

## 10. Implementation Notes

### Font Loading
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### CSS Custom Properties (Recommended)
```css
:root {
  /* Backgrounds */
  --bg-page: #F5F2ED;
  --bg-panel: #FBFAF7;
  --bg-input: #EDEAE4;

  /* Text */
  --text-primary: #273038;
  --text-secondary: #646A6B;
  --text-tertiary: #747A7D;
  --text-muted: #8D908F;
  --text-faint: #999A96;
  --text-inverse: #FBFAF7;

  /* Borders */
  --border-default: #D8D4CE;
  --border-strong: #BEBBB5;
  --border-active: #273038;

  /* Agents */
  --colour-harmony: #B8C8D4;
  --colour-bass: #D4C8B8;
  --colour-drums: #D4B8C3;
  --colour-committed: #B8D4C3;
  --colour-reaper: #C3B8D4;

  /* Spacing */
  --space-base: 8px;

  /* Type */
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
}
```

### Skeuomorphic Layer Application Priority
1. Apply `body` radial gradient first (page background)
2. Apply panel gradient + inset + drop shadow to all `bg-panel` surfaces
3. Apply button gradient + shadow to all `<button>` elements; override with dark gradient for primary/commit buttons
4. Apply inset shadow + `bg-input` to all `<input>` and `<textarea>` elements
5. Apply engraved divider shadow to all `border-top` / `border-bottom` separator elements
6. Apply agent micro-gradient + top-highlight to all MIDI note blocks and agent-coloured surfaces
7. Apply agent left-accent border to all agent cards

### Absolute Non-Negotiables
- No border-radius beyond what a specific component already uses (0px by default throughout).
- No drop shadow `blur` above `12px`. No drop shadow `opacity` above 25% (except dark primary button at 25%).
- No new decorative elements. No illustrations. No stock photos.
- The primary commit action (Create Session, Generate, Keep This, Resync) is always the only high-contrast element on a given page.
- Monospace type is reserved exclusively for MIDI data, technical status strings, bar numbers, and timestamps. Never use it for prose.
- The outlined logo square is always transparent/open. Never fill it.

---

*Poppin Music — You provide taste. The system provides technique.*
