import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { generateSketch } from "@poppin/session-agents";
import { currentStatus, writeSketchToReaper } from "@poppin/daw-bridge";
import { parseBarsFromIntention } from "@poppin/shared";
import { createSession, loadSession, saveSession, sessionDir } from "./session-store";

const repoRoot = fileURLToPath(new URL("../../../..", import.meta.url));
config({ path: resolve(repoRoot, ".env") });

const PORT = Number.parseInt(process.env.POPPIN_API_PORT ?? "47821", 10);

function json(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  res.end(JSON.stringify(body, null, 2));
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function notFound(res: ServerResponse): void {
  json(res, 404, { error: "Not found" });
}

const server = createServer(async (req, res) => {
  try {
    if (!req.url || !req.method) {
      notFound(res);
      return;
    }
    if (req.method === "OPTIONS") {
      json(res, 204, {});
      return;
    }

    const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
    const path = url.pathname;

    if (req.method === "GET" && path === "/api/status") {
      json(res, 200, { reaper: currentStatus(), ok: true });
      return;
    }

    if (req.method === "POST" && path === "/api/sessions") {
      const body = JSON.parse((await readBody(req)) || "{}") as {
        tempo?: number;
        key?: string;
        meter?: string;
        intention?: string;
        artistReference?: string;
        bars?: number;
      };
      const intention = body.intention?.trim() || "";
      if (!intention) {
        json(res, 400, { error: "Intention is required" });
        return;
      }
      const session = await createSession({
        tempo: body.tempo ?? 74,
        key: body.key ?? "D major",
        meter: body.meter ?? "4/4",
        bars: body.bars ?? parseBarsFromIntention(intention, 8),
        intention,
        artistReference: body.artistReference?.trim() || undefined,
      });
      json(res, 200, { session });
      return;
    }

    const sessionMatch = path.match(/^\/api\/sessions\/([^/]+)(?:\/(generate|reaper|keep))?$/);
    if (sessionMatch) {
      const id = decodeURIComponent(sessionMatch[1] ?? "");
      const action = sessionMatch[2];
      const session = await loadSession(id);
      if (!session) {
        json(res, 404, { error: "Session not found" });
        return;
      }

      if (req.method === "GET" && !action) {
        json(res, 200, { session, reaper: currentStatus(session.reaper ?? undefined) });
        return;
      }

      if (req.method === "POST" && action === "generate") {
        const result = await generateSketch({
          intention: session.intention,
          tempo: session.tempo,
          key: session.key,
          meter: session.meter,
          bars: session.bars,
          title: session.title,
          artistReference: session.artistReference,
          editableScope: "all",
          locked: [],
          takes: 1,
        });
        session.sketch = result.output.candidate;
        session.explanation = result.output.explanation;
        session.generateSource = result.source;
        session.logs = [...session.logs, ...result.logs];
        session.committed = false;
        await saveSession(session);
        json(res, 200, { session, output: result.output, source: result.source });
        return;
      }

      if (req.method === "POST" && action === "reaper") {
        if (!session.sketch) {
          json(res, 400, { error: "Generate a sketch before sending to Reaper" });
          return;
        }
        const written = await writeSketchToReaper({
          sketch: session.sketch,
          sessionDir: sessionDir(session.id),
        });
        session.reaper = written.status;
        session.logs = [...session.logs, ...written.logs];
        await saveSession(session);
        json(res, 200, { session, status: written.status });
        return;
      }

      if (req.method === "POST" && action === "keep") {
        if (!session.sketch) {
          json(res, 400, { error: "Nothing to keep yet" });
          return;
        }
        session.committed = true;
        session.logs = [
          ...session.logs,
          `[${new Date().toISOString()}] [session] kept current sketch`,
        ];
        await saveSession(session);
        json(res, 200, { session });
        return;
      }
    }

    notFound(res);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    json(res, 500, { error: message });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  process.stdout.write(`Poppin API http://127.0.0.1:${PORT}\n`);
});
