import { generateObject } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { hardValidateSketch } from "@poppin/musical-engine";
import { pmrSketchSchema, validatePMRSketch } from "@poppin/pmr";
import { logLine } from "@poppin/shared";
import type { SessionAgentInput, SessionAgentOutput } from "./contract.js";
import { sessionAgentInputSchema } from "./contract.js";
import { fallbackSketch } from "./fallback.js";

export async function generateSketch(
  rawInput: SessionAgentInput,
): Promise<{ output: SessionAgentOutput; source: "gateway" | "fallback"; logs: string[] }> {
  const input = sessionAgentInputSchema.parse(rawInput);
  const logs = [
    logLine("generate", "start", {
      tempo: input.tempo,
      key: input.key,
      meter: input.meter,
      bars: input.bars,
    }),
  ];

  if (!process.env.AI_GATEWAY_API_KEY) {
    logs.push(logLine("generate", "no AI_GATEWAY_API_KEY; using fallback sketch"));
    return { output: fallbackSketch(input), source: "fallback", logs };
  }

  try {
    const { object } = await generateObject({
      model: gateway(process.env.AI_GATEWAY_MODEL ?? "anthropic/claude-sonnet-5"),
      schema: pmrSketchSchema,
      prompt: `You are the Poppin Music Phase 1 orchestrator for Harmony, Bass, and Drums.

Write one complete PMRSketch the user can hear in a DAW.
Constraints:
- tempo ${input.tempo}, key ${input.key}, meter ${input.meter}, bars ${input.bars}
- intention: ${input.intention}
- artist reference (do not imitate; ignore unless it clarifies mood): ${input.artistReference || "none"}
- Every bar 1..${input.bars} must have harmony, bass, and drums
- Harmony chords with optional note names like D3
- Bass note events with pitch (e.g. D2), startBeat (0-based in the bar), durationBeats
- Drums: kick, snare, hatClosed, hatOpen, ride, crash, toms
- Keep it simple enough for a melody. Prefer tasteful restraint over cleverness.
- Slightly unresolved if asked. Do not include Reaper or MIDI-file commands.
- Set explanation to a short "why it moves" paragraph.
- sections should cover the full bar range.`,
    });

    const validated = validatePMRSketch({
      ...object,
      intention: input.intention,
      meta: {
        ...object.meta,
        tempo: input.tempo,
        meter: input.meter,
        key: input.key,
        bars: input.bars,
        title: input.title ?? object.meta.title,
      },
    });

    if (!validated.ok || !validated.sketch) {
      logs.push(logLine("generate", "schema failed; fallback", { issues: validated.issues }));
      return { output: fallbackSketch(input), source: "fallback", logs };
    }

    const hard = hardValidateSketch(validated.sketch);
    if (!hard.ok) {
      logs.push(logLine("generate", "hard validation failed; fallback", { issues: hard.issues }));
      return { output: fallbackSketch(input), source: "fallback", logs };
    }

    logs.push(logLine("generate", "gateway sketch accepted"));
    return {
      output: {
        candidate: validated.sketch,
        explanation:
          validated.sketch.explanation ?? "A complete harmony/bass/drums sketch for audition.",
        assumptions: ["Generated as a single orchestrated sketch, not three independent agents."],
        warnings: [],
        renderHints: ["Render three MIDI tracks named Harmony, Bass, Drums."],
      },
      source: "gateway",
      logs,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    logs.push(logLine("generate", "gateway error; fallback", { message }));
    return { output: fallbackSketch(input), source: "fallback", logs };
  }
}
