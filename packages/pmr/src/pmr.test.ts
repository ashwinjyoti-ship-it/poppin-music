import { describe, expect, it } from "vitest";
import { validatePMRSketch } from "./validate.js";
import { quietReflectiveSketch } from "../../../tests/fixtures/quiet-reflective.js";

describe("validatePMRSketch", () => {
  it("accepts a complete Phase 1 sketch", () => {
    const result = validatePMRSketch(quietReflectiveSketch);
    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("rejects missing bars and Reaper leaks", () => {
    const leaky = {
      ...quietReflectiveSketch,
      harmony: quietReflectiveSketch.harmony.slice(0, 2),
      reaperTrack: "Harmony",
    };
    const result = validatePMRSketch(leaky);
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.message.includes("Missing harmony"))).toBe(
      true,
    );
    expect(result.issues.some((i) => i.message.includes("Reaper"))).toBe(true);
  });
});
