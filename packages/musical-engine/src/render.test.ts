import { describe, expect, it } from "vitest";
import { quietReflectiveSketch } from "../../../tests/fixtures/quiet-reflective.js";
import { hardValidateSketch } from "./hard-validate.js";
import { renderSketchToMidi } from "./render.js";

describe("MIDI renderer", () => {
  it("writes a valid Type-1 SMF with three part streams", () => {
    const rendered = renderSketchToMidi(quietReflectiveSketch);
    const header = String.fromCharCode(...rendered.combined.slice(0, 4));
    expect(header).toBe("MThd");
    expect(rendered.combined[9]).toBe(1);
    expect(rendered.tracks.harmony[0]).toBe(0x4d);
    expect(rendered.events.harmony.length).toBeGreaterThan(8);
    expect(rendered.events.bass.length).toBeGreaterThan(8);
    expect(rendered.events.drums.length).toBeGreaterThan(8);
    expect(hardValidateSketch(quietReflectiveSketch).ok).toBe(true);
  });
});
