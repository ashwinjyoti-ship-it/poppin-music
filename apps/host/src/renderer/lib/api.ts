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

export type SessionRecord = {
  id: string;
  createdAt: string;
  tempo: number;
  key: string;
  meter: string;
  bars: number;
  intention: string;
  artistReference?: string;
  committed: boolean;
  sketch: {
    meta: { tempo: number; meter: string; key?: string; bars: number; title?: string };
    intention: string;
    explanation?: string;
    harmony: Array<{ bar: number; chord: string; notes?: string[]; role?: string; tension?: string }>;
    bass: Array<{
      bar: number;
      role?: string;
      events: Array<{ pitch: string; startBeat: number; durationBeats: number }>;
    }>;
    drums: Array<{
      bar: number;
      events: Array<{ voice: string; startBeat: number }>;
    }>;
  } | null;
  explanation: string | null;
  logs: string[];
  reaper: ReaperStatus | null;
  generateSource: "gateway" | "fallback" | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? `Request failed (${response.status})`);
  }
  return data;
}

export function getStatus() {
  return request<{ reaper: ReaperStatus; ok: boolean }>("/api/status");
}

export function createSession(body: {
  tempo: number;
  key: string;
  meter: string;
  intention: string;
  artistReference?: string;
}) {
  return request<{ session: SessionRecord }>("/api/sessions", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function generateSession(id: string) {
  return request<{ session: SessionRecord; source: string }>(`/api/sessions/${id}/generate`, {
    method: "POST",
  });
}

export function sendToReaper(id: string) {
  return request<{ session: SessionRecord; status: ReaperStatus }>(`/api/sessions/${id}/reaper`, {
    method: "POST",
  });
}

export function keepSession(id: string) {
  return request<{ session: SessionRecord }>(`/api/sessions/${id}/keep`, {
    method: "POST",
  });
}
