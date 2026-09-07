import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { quietReflectiveSketch } from "../../../tests/fixtures/quiet-reflective.js";
import { renderSketchToMidi } from "@poppin/musical-engine";
import { writeSketchToReaper } from "./reaper.js";
import { buildPoppinProjectRpp } from "./rpp.js";

describe("Reaper bridge", () => {
  it("embeds MIDI items on Harmony, Bass and Drums in the project file", async () => {
    const dir = await mkdtemp(join(tmpdir(), "poppin-bridge-"));
    try {
      const result = await writeSketchToReaper({
        sketch: quietReflectiveSketch,
        sessionDir: dir,
        openProject: false,
      });
      expect(existsSync(result.status.midiFiles.harmony ?? "")).toBe(true);
      expect(existsSync(result.status.midiFiles.bass ?? "")).toBe(true);
      expect(existsSync(result.status.midiFiles.drums ?? "")).toBe(true);
      expect(result.status.projectPath).toBe(join(dir, "Poppin_Sketch.rpp"));
      expect(existsSync(result.status.projectPath ?? "")).toBe(true);

      const rpp = await readFile(result.status.projectPath ?? "", "utf8");
      expect(rpp).toContain("HASDATA 1 480 QN");
      expect(rpp).toContain("NAME Harmony");
      expect(rpp).toContain("NAME Bass");
      expect(rpp).toContain("NAME Drums");
      expect(rpp).toMatch(/\n\s+E \d+ 90 /);
      expect(rpp).toMatch(/\n\s+E \d+ 91 /);
      expect(rpp).toMatch(/\n\s+E \d+ 99 /);
      expect(rpp).not.toContain("MIXERROWHEIGHT");
      expect(rpp).not.toContain("BEATATTACHMODE");
      expect(result.status.label === "FILES READY" || result.status.label === "CONNECTED").toBe(
        true,
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("writes note-on events for every sketch track", () => {
    const events = renderSketchToMidi(quietReflectiveSketch).events;
    const rpp = buildPoppinProjectRpp(quietReflectiveSketch, events);
    expect(events.harmony.length).toBeGreaterThan(0);
    expect(events.bass.length).toBeGreaterThan(0);
    expect(events.drums.length).toBeGreaterThan(0);
    expect(rpp.split("\n").filter((line) => line.includes(" E ")).length).toBeGreaterThan(20);
  });
});
