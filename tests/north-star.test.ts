import { describe, expect, it } from "vitest";
import { validatePMRSketch } from "@poppin/pmr";
import { hardValidateSketch, renderSketchToMidi } from "@poppin/musical-engine";
import { generateSketch } from "@poppin/session-agents";

describe("north-star sketch", () => {
  it("can create harmony/bass/drums MIDI from the quiet reflective prompt", async () => {
    delete process.env.AI_GATEWAY_API_KEY;
    const result = await generateSketch({
      intention:
        "8 bars, quiet, reflective, slightly unresolved, simple enough for a melody.",
      tempo: 74,
      key: "D major",
      meter: "4/4",
      bars: 8,
      editableScope: "all",
      locked: [],
      takes: 1,
    });
    const valid = validatePMRSketch(result.output.candidate);
    expect(valid.ok).toBe(true);
    expect(hardValidateSketch(result.output.candidate).ok).toBe(true);
    const midi = renderSketchToMidi(result.output.candidate);
    expect(String.fromCharCode(...midi.combined.slice(0, 4))).toBe("MThd");
    expect(midi.events.harmony.length).toBeGreaterThan(0);
    expect(midi.events.bass.length).toBeGreaterThan(0);
    expect(midi.events.drums.length).toBeGreaterThan(0);
  });
});
