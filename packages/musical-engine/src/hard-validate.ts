import type { PMRSketch } from "@poppin/pmr";
import { pitchToMidi } from "./pitch.js";
import { sketchToMidiEvents } from "./render.js";

export type HardValidation = {
  ok: boolean;
  issues: string[];
};

export function hardValidateSketch(sketch: PMRSketch): HardValidation {
  const issues: string[] = [];
  const events = sketchToMidiEvents(sketch);

  if (events.harmony.length === 0) issues.push("Harmony rendered zero notes");
  if (events.bass.length === 0) issues.push("Bass rendered zero notes");
  if (events.drums.length === 0) issues.push("Drums rendered zero notes");

  for (const note of events.harmony) {
    if (note.note < 36 || note.note > 84) {
      issues.push(`Harmony note ${note.note} outside playable range`);
    }
  }
  for (const note of events.bass) {
    if (note.note < 28 || note.note > 64) {
      issues.push(`Bass note ${note.note} outside playable range`);
    }
  }
  for (const bar of sketch.bass) {
    for (const event of bar.events) {
      pitchToMidi(event.pitch);
      if (event.startBeat < 0) issues.push(`Bass startBeat negative in bar ${bar.bar}`);
    }
  }

  const lastHarmony = Math.max(...events.harmony.map((n) => n.tick), 0);
  const lastBass = Math.max(...events.bass.map((n) => n.tick), 0);
  const lastDrums = Math.max(...events.drums.map((n) => n.tick), 0);
  if (lastHarmony === 0 && sketch.meta.bars > 1) {
    issues.push("Harmony timing looks empty after bar 1");
  }
  if (lastBass === 0 && sketch.meta.bars > 1) {
    issues.push("Bass timing looks empty after bar 1");
  }
  if (lastDrums === 0 && sketch.meta.bars > 1) {
    issues.push("Drum timing looks empty after bar 1");
  }

  return { ok: issues.length === 0, issues };
}
