import type { PMRSketch } from "./schema.js";
import { pmrSketchSchema } from "./schema.js";

const DAW_LEAK = /reaper|rpp|reascript|\.lua\b|trackid|mediaitem/i;

function walkForDawLeak(value: unknown, path: string, leaks: string[]): void {
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkForDawLeak(item, `${path}[${i}]`, leaks));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (DAW_LEAK.test(key)) {
        leaks.push(`${path}.${key}`);
      }
      walkForDawLeak(child, `${path}.${key}`, leaks);
    }
    return;
  }
  if (typeof value === "string" && DAW_LEAK.test(value) && path.endsWith("command")) {
    leaks.push(path);
  }
}

export type ValidationIssue = { path: string; message: string };

export function validatePMRSketch(input: unknown): {
  ok: boolean;
  sketch?: PMRSketch;
  issues: ValidationIssue[];
} {
  const issues: ValidationIssue[] = [];
  const leaks: string[] = [];
  walkForDawLeak(input, "pmr", leaks);
  for (const leak of leaks) {
    issues.push({
      path: leak,
      message: "Session Agent output must not contain Reaper-specific objects",
    });
  }

  const parsed = pmrSketchSchema.safeParse(input);

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      issues.push({
        path: issue.path.join(".") || "(root)",
        message: issue.message,
      });
    }
    return { ok: false, issues };
  }

  const sketch = parsed.data;
  const bars = sketch.meta.bars;

  for (const section of sketch.sections) {
    if (section.endBar < section.startBar) {
      issues.push({
        path: `sections.${section.id}`,
        message: "endBar must be >= startBar",
      });
    }
  }

  const harmonyBars = new Set(sketch.harmony.map((h) => h.bar));
  const bassBars = new Set(sketch.bass.map((b) => b.bar));
  const drumBars = new Set(sketch.drums.map((d) => d.bar));

  for (let bar = 1; bar <= bars; bar += 1) {
    if (!harmonyBars.has(bar)) {
      issues.push({ path: "harmony", message: `Missing harmony for bar ${bar}` });
    }
    if (!bassBars.has(bar)) {
      issues.push({ path: "bass", message: `Missing bass for bar ${bar}` });
    }
    if (!drumBars.has(bar)) {
      issues.push({ path: "drums", message: `Missing drums for bar ${bar}` });
    }
  }

  const leaksAlreadyReported = issues.some((issue) =>
    issue.message.includes("Reaper-specific"),
  );
  if (!leaksAlreadyReported) {
    const nestedLeaks: string[] = [];
    walkForDawLeak(sketch, "pmr", nestedLeaks);
    for (const leak of nestedLeaks) {
      issues.push({
        path: leak,
        message: "Session Agent output must not contain Reaper-specific objects",
      });
    }
  }

  return issues.length === 0
    ? { ok: true, sketch, issues }
    : { ok: false, sketch, issues };
}
