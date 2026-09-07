import { describe, expect, it } from "vitest";
import { quietReflectiveSketch } from "../../../tests/fixtures/quiet-reflective.js";
import { buildPreviewSchedule, midiToHz } from "./preview-schedule.js";

describe("preview schedule", () => {
  it("builds timed notes covering harmony, bass and drums", () => {
    const schedule = buildPreviewSchedule(quietReflectiveSketch);
    expect(schedule.tempo).toBe(quietReflectiveSketch.meta.tempo);
    expect(schedule.notes.length).toBeGreaterThan(20);
    expect(schedule.durationSec).toBeGreaterThan(4);

    const voices = new Set(schedule.notes.map((n) => n.voice));
    expect(voices.has("harmony")).toBe(true);
    expect(voices.has("bass")).toBe(true);
    expect(voices.has("drums")).toBe(true);

    for (const note of schedule.notes) {
      expect(note.startSec).toBeGreaterThanOrEqual(0);
      expect(note.durationSec).toBeGreaterThan(0);
      expect(note.midi).toBeGreaterThanOrEqual(0);
      expect(note.midi).toBeLessThanOrEqual(127);
    }

    const ordered = schedule.notes.every(
      (note, i, arr) => i === 0 || note.startSec >= (arr[i - 1]?.startSec ?? 0),
    );
    expect(ordered).toBe(true);
  });

  it("converts MIDI note numbers to frequency", () => {
    expect(midiToHz(69)).toBeCloseTo(440, 5);
    expect(midiToHz(57)).toBeCloseTo(220, 5);
  });
});
