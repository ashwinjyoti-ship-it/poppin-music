import { homedir } from "node:os";
import { join } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createId } from "@poppin/shared";
import type { PMRSketch } from "@poppin/pmr";
import type { GarageBandStatus, ReaperStatus } from "@poppin/daw-bridge";

export type SessionRecord = {
  id: string;
  createdAt: string;
  title?: string;
  tempo: number;
  key: string;
  meter: string;
  bars: number;
  intention: string;
  artistReference?: string;
  committed: boolean;
  sketch: PMRSketch | null;
  explanation: string | null;
  logs: string[];
  reaper: ReaperStatus | null;
  garageBand: GarageBandStatus | null;
  generateSource: "gateway" | "fallback" | null;
};

export function dataRoot(): string {
  return process.env.POPPIN_DATA_DIR ?? join(homedir(), "Documents", "Poppin Music");
}

export function sessionDir(id: string): string {
  return join(dataRoot(), "sessions", id);
}

export async function createSession(input: {
  tempo: number;
  key: string;
  meter: string;
  bars: number;
  intention: string;
  artistReference?: string;
}): Promise<SessionRecord> {
  const id = createId("ses");
  const dir = sessionDir(id);
  await mkdir(dir, { recursive: true });
  const record: SessionRecord = {
    id,
    createdAt: new Date().toISOString(),
    tempo: input.tempo,
    key: input.key,
    meter: input.meter,
    bars: input.bars,
    intention: input.intention,
    artistReference: input.artistReference,
    committed: false,
    sketch: null,
    explanation: null,
    logs: [],
    reaper: null,
    garageBand: null,
    generateSource: null,
  };
  await saveSession(record);
  return record;
}

export async function saveSession(record: SessionRecord): Promise<void> {
  const dir = sessionDir(record.id);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "session.json"), JSON.stringify(record, null, 2), "utf8");
}

export async function loadSession(id: string): Promise<SessionRecord | null> {
  const path = join(sessionDir(id), "session.json");
  if (!existsSync(path)) return null;
  const raw = await readFile(path, "utf8");
  const parsed = JSON.parse(raw) as SessionRecord;
  return {
    ...parsed,
    garageBand: parsed.garageBand ?? null,
  };
}
