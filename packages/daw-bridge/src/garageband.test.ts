import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { quietReflectiveSketch } from "../../../tests/fixtures/quiet-reflective.js";
import { writeSketchForGarageBand } from "./garageband.js";

describe("GarageBand bridge", () => {
  it("writes a multi-track sketch.mid ready for GarageBand", async () => {
    const dir = await mkdtemp(join(tmpdir(), "poppin-gb-"));
    try {
      const result = await writeSketchForGarageBand({
        sketch: quietReflectiveSketch,
        sessionDir: dir,
        openApp: false,
      });

      expect(existsSync(result.midiFiles.combined)).toBe(true);
      expect(existsSync(result.midiFiles.harmony)).toBe(true);
      expect(result.status.midiPath).toBe(result.midiFiles.combined);
      expect(result.status.opened).toBe(false);
      expect(result.status.label === "FILES READY" || result.status.label === "OPENED").toBe(
        true,
      );

      const bytes = await readFile(result.midiFiles.combined);
      expect(String.fromCharCode(...bytes.subarray(0, 4))).toBe("MThd");
      // Type-1 SMF (multi-track)
      expect(bytes[9]).toBe(1);
      // Conductor + Harmony + Bass + Drums
      expect(bytes[11]).toBeGreaterThanOrEqual(4);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
