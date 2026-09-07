import { z } from "zod";
import { pmrSketchSchema, type PMRSketch } from "@poppin/pmr";

export const sessionAgentInputSchema = z.object({
  intention: z.string(),
  tempo: z.number(),
  key: z.string(),
  meter: z.string(),
  bars: z.number().int().min(1).max(32),
  title: z.string().optional(),
  artistReference: z.string().optional(),
  editableScope: z.enum(["all", "harmony", "bass", "drums"]).default("all"),
  locked: z.array(z.string()).default([]),
  takes: z.number().int().min(1).max(3).default(1),
});

export type SessionAgentInput = z.infer<typeof sessionAgentInputSchema>;

export const sessionAgentOutputSchema = z.object({
  candidate: pmrSketchSchema,
  explanation: z.string(),
  assumptions: z.array(z.string()),
  warnings: z.array(z.string()),
  renderHints: z.array(z.string()),
});

export type SessionAgentOutput = z.infer<typeof sessionAgentOutputSchema>;

export type SessionAgentManifest = {
  id: string;
  name: string;
  version: string;
  capabilities: string[];
};

export const v0OrchestratorManifest: SessionAgentManifest = {
  id: "poppin.orchestrator",
  name: "Phase 1 Sketch Orchestrator",
  version: "0.1.0",
  capabilities: ["harmony.generate", "bass.generate", "drums.generate"],
};

export type { PMRSketch };
