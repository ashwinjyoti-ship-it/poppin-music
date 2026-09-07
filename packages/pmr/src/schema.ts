import { z } from "zod";

export const noteEventSchema = z.object({
  pitch: z.string().regex(/^[A-G][#b]?\d$/, "Pitch must look like D2 or F#3"),
  startBeat: z.number().min(0).max(16),
  durationBeats: z.number().gt(0).max(16),
  velocity: z.number().int().min(1).max(127).optional(),
});

export const drumVoiceSchema = z.enum([
  "kick",
  "snare",
  "hatClosed",
  "hatOpen",
  "tomLow",
  "tomMid",
  "tomHigh",
  "ride",
  "crash",
]);

export const drumEventSchema = z.object({
  voice: drumVoiceSchema,
  startBeat: z.number().min(0).max(16),
  durationBeats: z.number().gt(0).max(8).optional(),
  velocity: z.number().int().min(1).max(127).optional(),
});

export const decisionRecordSchema = z.object({
  at: z.string(),
  summary: z.string(),
  agent: z.string().optional(),
});

export const pmrSketchSchema = z.object({
  meta: z.object({
    title: z.string().optional(),
    tempo: z.number().min(20).max(300),
    meter: z.string().min(3),
    key: z.string().optional(),
    bars: z.number().int().min(1).max(32),
  }),
  intention: z.string().min(1),
  sections: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        startBar: z.number().int().min(1),
        endBar: z.number().int().min(1),
      }),
    )
    .min(1),
  harmony: z
    .array(
      z.object({
        bar: z.number().int().min(1),
        chord: z.string().min(1),
        role: z.string().optional(),
        tension: z.string().optional(),
        notes: z.array(z.string()).optional(),
      }),
    )
    .min(1),
  bass: z
    .array(
      z.object({
        bar: z.number().int().min(1),
        events: z.array(noteEventSchema),
        role: z.string().optional(),
      }),
    )
    .min(1),
  drums: z
    .array(
      z.object({
        bar: z.number().int().min(1),
        events: z.array(drumEventSchema),
        role: z.string().optional(),
      }),
    )
    .min(1),
  explanation: z.string().optional(),
  decisions: z.array(decisionRecordSchema).optional(),
});

export type NoteEvent = z.infer<typeof noteEventSchema>;
export type DrumEvent = z.infer<typeof drumEventSchema>;
export type DrumVoice = z.infer<typeof drumVoiceSchema>;
export type DecisionRecord = z.infer<typeof decisionRecordSchema>;
export type PMRSketch = z.infer<typeof pmrSketchSchema>;
