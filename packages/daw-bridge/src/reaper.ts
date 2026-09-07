import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import type { PMRSketch } from "@poppin/pmr";
import { renderSketchToMidi } from "@poppin/musical-engine";
import { logLine } from "@poppin/shared";
import { buildPoppinProjectRpp } from "./rpp.js";
import { findReaperApp, statusLabel, type ReaperStatus } from "./status.js";

function repoRootFromHere(): string {
  return fileURLToPath(new URL("../../..", import.meta.url));
}

export function defaultTemplatePath(): string {
  return join(repoRootFromHere(), "reaper/templates/Poppin_V0.rpp");
}

export function defaultLuaPath(): string {
  return join(repoRootFromHere(), "reaper/scripts/import_sketch.lua");
}

export type BridgeWriteResult = {
  status: ReaperStatus;
  logs: string[];
  sessionDir: string;
};

async function openInReaper(appPath: string, projectPath: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn("open", ["-a", appPath, projectPath], { stdio: "ignore" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`open Reaper exited ${code}`));
    });
  });
}

export async function writeSketchToReaper(opts: {
  sketch: PMRSketch;
  sessionDir: string;
  openProject?: boolean;
}): Promise<BridgeWriteResult> {
  const logs: string[] = [];
  const midiDir = join(opts.sessionDir, "midi");
  await mkdir(midiDir, { recursive: true });

  const rendered = renderSketchToMidi(opts.sketch);
  const paths = {
    harmony: join(midiDir, "harmony.mid"),
    bass: join(midiDir, "bass.mid"),
    drums: join(midiDir, "drums.mid"),
    combined: join(midiDir, "sketch.mid"),
  };

  await writeFile(paths.harmony, rendered.tracks.harmony);
  await writeFile(paths.bass, rendered.tracks.bass);
  await writeFile(paths.drums, rendered.tracks.drums);
  await writeFile(paths.combined, rendered.combined);

  const projectPath = join(opts.sessionDir, "Poppin_Sketch.rpp");
  await writeFile(
    projectPath,
    buildPoppinProjectRpp(opts.sketch, rendered.events),
    "utf8",
  );

  const luaSrc = defaultLuaPath();
  const luaDest = join(opts.sessionDir, "import_sketch.lua");
  if (existsSync(luaSrc)) {
    await writeFile(luaDest, await readFile(luaSrc));
  }

  const manifest = {
    tempo: opts.sketch.meta.tempo,
    meter: opts.sketch.meta.meter,
    tracks: {
      Harmony: paths.harmony,
      Bass: paths.bass,
      Drums: paths.drums,
    },
    projectPath,
  };
  await writeFile(join(opts.sessionDir, "pending-import.json"), JSON.stringify(manifest, null, 2));
  logs.push(
    logLine("reaper", "embedded MIDI on Harmony, Bass and Drums tracks", {
      sessionDir: opts.sessionDir,
    }),
  );

  const appPath = findReaperApp();
  let lastError: string | null = null;

  if (opts.openProject !== false && appPath && existsSync(projectPath)) {
    try {
      await openInReaper(appPath, projectPath);
      logs.push(logLine("reaper", "opened project in Reaper with MIDI on tracks"));
    } catch (error) {
      lastError = error instanceof Error ? error.message : "failed to open Reaper";
      logs.push(logLine("reaper", lastError));
    }
  } else if (!appPath) {
    logs.push(logLine("reaper", "Reaper app not found; project file is ready to open"));
  }

  const statusBase = {
    appFound: Boolean(appPath),
    appPath,
    projectPath: existsSync(projectPath) ? projectPath : null,
    lastWrite: new Date().toISOString(),
    lastError,
    midiFiles: {
      harmony: paths.harmony,
      bass: paths.bass,
      drums: paths.drums,
    },
  };

  return {
    sessionDir: opts.sessionDir,
    logs,
    status: { ...statusBase, label: statusLabel(statusBase) },
  };
}

export function currentStatus(partial?: Partial<ReaperStatus>): ReaperStatus {
  const appPath = findReaperApp();
  const base = {
    appFound: Boolean(appPath),
    appPath,
    projectPath: partial?.projectPath ?? null,
    lastWrite: partial?.lastWrite ?? null,
    lastError: partial?.lastError ?? null,
    midiFiles: partial?.midiFiles ?? {
      harmony: null,
      bass: null,
      drums: null,
    },
  };
  return { ...base, label: statusLabel(base) };
}

export function repoRoot(): string {
  return dirname(defaultTemplatePath());
}
