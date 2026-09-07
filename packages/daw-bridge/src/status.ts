import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export type ReaperStatus = {
  appFound: boolean;
  appPath: string | null;
  projectPath: string | null;
  lastWrite: string | null;
  lastError: string | null;
  midiFiles: {
    harmony: string | null;
    bass: string | null;
    drums: string | null;
  };
  label: "CONNECTED" | "FILES READY" | "IDLE" | "ERROR";
};

const MAC_CANDIDATES = [
  "/Applications/REAPER.app",
  "/Applications/REAPER64.app",
  join(homedir(), "Applications/REAPER.app"),
];

export function findReaperApp(): string | null {
  for (const candidate of MAC_CANDIDATES) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

export function statusLabel(status: Omit<ReaperStatus, "label">): ReaperStatus["label"] {
  if (status.lastError) return "ERROR";
  if (status.appFound && status.midiFiles.harmony) return "CONNECTED";
  if (status.midiFiles.harmony) return "FILES READY";
  return "IDLE";
}
