import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { spawn } from "node:child_process";
import type { PMRSketch } from "@poppin/pmr";
import { renderSketchToMidi } from "@poppin/musical-engine";
import { logLine } from "@poppin/shared";

export type GarageBandStatus = {
  appFound: boolean;
  appPath: string | null;
  midiPath: string | null;
  lastWrite: string | null;
  lastError: string | null;
  opened: boolean;
  label: "OPENED" | "FILES READY" | "IDLE" | "ERROR";
};

export type GarageBandWriteResult = {
  status: GarageBandStatus;
  logs: string[];
  sessionDir: string;
  midiFiles: {
    combined: string;
    harmony: string;
    bass: string;
    drums: string;
  };
};

const MAC_CANDIDATES = [
  "/Applications/GarageBand.app",
  join(homedir(), "Applications/GarageBand.app"),
];

export function findGarageBandApp(): string | null {
  for (const candidate of MAC_CANDIDATES) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function garageBandLabel(
  status: Omit<GarageBandStatus, "label">,
): GarageBandStatus["label"] {
  if (status.lastError) return "ERROR";
  if (status.opened) return "OPENED";
  if (status.midiPath) return "FILES READY";
  return "IDLE";
}

async function openInGarageBand(appPath: string, midiPath: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn("open", ["-a", appPath, midiPath], { stdio: "ignore" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`open GarageBand exited ${code}`));
    });
  });
}

/** Write multi-track MIDI and optionally open it in GarageBand (macOS). */
export async function writeSketchForGarageBand(opts: {
  sketch: PMRSketch;
  sessionDir: string;
  openApp?: boolean;
}): Promise<GarageBandWriteResult> {
  const logs: string[] = [];
  const midiDir = join(opts.sessionDir, "midi");
  await mkdir(midiDir, { recursive: true });

  const rendered = renderSketchToMidi(opts.sketch);
  const midiFiles = {
    harmony: join(midiDir, "harmony.mid"),
    bass: join(midiDir, "bass.mid"),
    drums: join(midiDir, "drums.mid"),
    combined: join(midiDir, "sketch.mid"),
  };

  await writeFile(midiFiles.harmony, rendered.tracks.harmony);
  await writeFile(midiFiles.bass, rendered.tracks.bass);
  await writeFile(midiFiles.drums, rendered.tracks.drums);
  await writeFile(midiFiles.combined, rendered.combined);

  logs.push(
    logLine("garageband", "wrote multi-track MIDI for GarageBand", {
      midiPath: midiFiles.combined,
    }),
  );

  const appPath = findGarageBandApp();
  let lastError: string | null = null;
  let opened = false;

  if (opts.openApp !== false && appPath && existsSync(midiFiles.combined)) {
    try {
      await openInGarageBand(appPath, midiFiles.combined);
      opened = true;
      logs.push(logLine("garageband", "opened sketch.mid in GarageBand"));
    } catch (error) {
      lastError = error instanceof Error ? error.message : "failed to open GarageBand";
      logs.push(logLine("garageband", lastError));
    }
  } else if (!appPath) {
    logs.push(
      logLine(
        "garageband",
        "GarageBand not found; MIDI is ready — download sketch.mid or open it manually",
      ),
    );
  }

  const statusBase = {
    appFound: Boolean(appPath),
    appPath,
    midiPath: midiFiles.combined,
    lastWrite: new Date().toISOString(),
    lastError,
    opened,
  };

  return {
    sessionDir: opts.sessionDir,
    logs,
    midiFiles,
    status: { ...statusBase, label: garageBandLabel(statusBase) },
  };
}

export function currentGarageBandStatus(
  partial?: Partial<GarageBandStatus>,
): GarageBandStatus {
  const appPath = findGarageBandApp();
  const base = {
    appFound: Boolean(appPath),
    appPath,
    midiPath: partial?.midiPath ?? null,
    lastWrite: partial?.lastWrite ?? null,
    lastError: partial?.lastError ?? null,
    opened: partial?.opened ?? false,
  };
  return { ...base, label: garageBandLabel(base) };
}
