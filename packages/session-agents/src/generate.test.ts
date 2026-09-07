import { describe, expect, it } from "vitest";
import { validatePMRSketch } from "@poppin/pmr";
import { hardValidateSketch } from "@poppin/musical-engine";
import { generateSketch } from "./generate.js";

describe("generateSketch", () => {
  it("returns a valid fallback sketch without a gateway key", async () => {
    delete process.env.AI_GATEWAY_API_KEY;
    const result = await generateSketch({
      intention:
        "8 bars, quiet and reflective, slightly unresolved, simple enough for a melody.",
      tempo: 74,
      key: "D major",
      meter: "4/4",
      bars: 8,
      editableScope: "all",
      locked: [],
      takes: 1,
    });
    expect(result.source).toBe("fallback");
    const valid = validatePMRSketch(result.output.candidate);
    expect(valid.ok).toBe(true);
    expect(hardValidateSketch(result.output.candidate).ok).toBe(true);
  });
});
