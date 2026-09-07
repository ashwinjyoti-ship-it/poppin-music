import type { PMRSketch } from "@poppin/pmr";
import type { SessionAgentInput, SessionAgentOutput } from "./contract.js";
import { quietReflectiveSketch } from "../../../tests/fixtures/quiet-reflective.js";

function cloneSketch(base: PMRSketch, input: SessionAgentInput): PMRSketch {
  return {
    ...base,
    meta: {
      ...base.meta,
      title: input.title ?? base.meta.title,
      tempo: input.tempo,
      meter: input.meter,
      key: input.key,
      bars: input.bars,
    },
    intention: input.intention,
    sections: [
      {
        id: "verse",
        name: "Verse",
        startBar: 1,
        endBar: input.bars,
      },
    ],
  };
}

function trimToBars(sketch: PMRSketch, bars: number): PMRSketch {
  if (sketch.meta.bars === bars) return sketch;
  const slice = <T extends { bar: number }>(rows: T[]): T[] => {
    const kept = rows.filter((row) => row.bar <= bars);
    if (kept.length >= bars) return kept.slice(0, bars).map((row, i) => ({ ...row, bar: i + 1 }));
    const out: T[] = [];
    for (let bar = 1; bar <= bars; bar += 1) {
      const src = rows[(bar - 1) % rows.length];
      if (!src) continue;
      out.push({ ...src, bar });
    }
    return out;
  };
  return {
    ...sketch,
    meta: { ...sketch.meta, bars },
    harmony: slice(sketch.harmony),
    bass: slice(sketch.bass),
    drums: slice(sketch.drums),
    sections: [{ id: "verse", name: "Verse", startBar: 1, endBar: bars }],
  };
}

export function fallbackSketch(input: SessionAgentInput): SessionAgentOutput {
  const sketch = trimToBars(cloneSketch(quietReflectiveSketch, input), input.bars);
  return {
    candidate: sketch,
    explanation:
      sketch.explanation ??
      "A quiet, slightly unresolved sketch so there is room for a melody.",
    assumptions: [
      "No AI Gateway key was used, or the model call failed validation.",
      "Fallback is a D-major-leaning 8-bar room, stretched or trimmed to the requested bar count.",
    ],
    warnings: input.artistReference
      ? ["Artist reference is stored only and did not steer this fallback."]
      : [],
    renderHints: [
      "Harmony as held voicings",
      "Bass sparse, often late to beat one",
      "Drums as quiet GM kit, channel 10",
    ],
  };
}
