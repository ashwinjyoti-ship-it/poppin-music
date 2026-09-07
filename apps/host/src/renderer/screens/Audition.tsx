import { Header } from "../components/Header";
import {
  generateSession,
  keepSession,
  sendToReaper,
  type ReaperStatus,
  type SessionRecord,
} from "../lib/api";

type Props = {
  session: SessionRecord;
  reaper: ReaperStatus | null;
  busy: boolean;
  error: string | null;
  onChange: (session: SessionRecord) => void;
  onBusy: (busy: boolean) => void;
  onError: (error: string | null) => void;
  onNewSession: () => void;
};

function MiniPreview({ session }: { session: SessionRecord }) {
  const sketch = session.sketch;
  if (!sketch) {
    return <div className="mini-roll h-48 border-b border-[#D8D4CE]" />;
  }
  return (
    <div className="mini-roll h-48 relative border-b border-[#D8D4CE] overflow-hidden">
      {sketch.harmony.slice(0, 8).map((row, i) => (
        <span
          key={`h-${row.bar}`}
          className="note-harmony absolute h-3"
          style={{ left: 16 + i * 48, top: 24 + (i % 3) * 10, width: 40 }}
        />
      ))}
      {sketch.bass.slice(0, 8).map((row, i) => (
        <span
          key={`b-${row.bar}`}
          className="note-bass absolute h-3"
          style={{ left: 28 + i * 44, top: 88 + (i % 2) * 12, width: 36 }}
        />
      ))}
      {sketch.drums.slice(0, 8).map((row, i) => (
        <span
          key={`d-${row.bar}`}
          className="note-drums absolute h-3 w-3"
          style={{ left: 20 + i * 36, top: 148 }}
        />
      ))}
    </div>
  );
}

export function Audition({
  session,
  reaper,
  busy,
  error,
  onChange,
  onBusy,
  onError,
  onNewSession,
}: Props) {
  const sketch = session.sketch;
  const bassPath = sketch?.bass
    .flatMap((bar) => bar.events.map((event) => event.pitch))
    .slice(0, 8)
    .join(" — ");

  async function run(label: string, fn: () => Promise<SessionRecord>) {
    onBusy(true);
    onError(null);
    try {
      const next = await fn();
      onChange(next);
    } catch (err) {
      onError(err instanceof Error ? err.message : label);
    } finally {
      onBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Header
        variant="audition"
        songTitle="Half-lit Room"
        meta={`${session.tempo} BPM · ${session.key.toUpperCase()} · ${session.meter}`}
        reaper={session.reaper ?? reaper}
        onNewSession={onNewSession}
      />
      <main className="min-h-[calc(100vh-48px)] px-14 py-10">
        <section className="flex items-end justify-between border-b border-[#BEBBB5] pb-7">
          <div>
            <div className="mono text-[9px] tracking-[.16em] text-[#8D908F] mb-4">
              SESSION SKETCH / PHASE 1
            </div>
            <h1 className="text-[38px] leading-none font-light tracking-[-.025em]">Hear it.</h1>
            <p className="mt-4 text-[14px] text-[#747A7D] max-w-[720px]">{session.intention}</p>
          </div>
          <div className="flex items-center gap-6">
            <span className="mono text-[9px] text-[#8D908F]">
              {session.tempo} BPM · {session.key.toUpperCase()} · {session.meter}
            </span>
            <span className="mono px-3 h-7 border border-[#D8D4CE] flex items-center text-[9px]">
              {session.generateSource === "gateway" ? "GATEWAY" : session.generateSource === "fallback" ? "FALLBACK" : "READY"}
            </span>
          </div>
        </section>

        <section className="grid grid-cols-[1fr_320px] gap-5 mt-8">
          <article className="panel-surface bg-[#FBFAF7] border border-[#273038] min-h-[514px] flex flex-col relative">
            {busy ? (
              <div className="absolute -top-px right-5 h-5 px-2 bg-[#273038] text-[#FBFAF7] mono text-[8px] flex items-center">
                WORKING
              </div>
            ) : null}
            <div className="h-20 px-5 flex items-center justify-between border-b border-[#D8D4CE]">
              <span className="mono text-[36px] font-medium">01</span>
              <div className="text-right">
                <div className="mono text-[9px] text-[#8D908F]">HARMONY / BASS / DRUMS</div>
                <div className="mt-2 flex gap-1 justify-end">
                  <b className="w-2 h-2 bg-[#B8C8D4]" />
                  <b className="w-2 h-2 bg-[#D4C8B8]" />
                  <b className="w-2 h-2 bg-[#D4B8C3]" />
                </div>
              </div>
            </div>
            <MiniPreview session={session} />
            <div className="p-5 flex-1">
              <span className="mono text-[9px] text-[#8D908F]">WHY IT MOVES</span>
              <p className="mt-3 text-[14px] leading-6">
                {session.explanation ??
                  "Generate a sketch to hear harmony, bass and drums as one room."}
              </p>
              <div className="mt-5 mono text-[9px] text-[#777B7C]">
                {sketch ? sketch.harmony.map((row) => row.chord).join(" · ") : "—"}
              </div>
              {bassPath ? <div className="mt-2 mono text-[9px] text-[#777B7C]">{bassPath}</div> : null}
            </div>
            <div className="p-4 border-t border-[#D8D4CE] grid grid-cols-2 gap-2">
              <button
                type="button"
                className="btn h-10 border border-[#BEBBB5] text-[10px] tracking-[.12em] uppercase"
                disabled={busy || !sketch}
                onClick={() => run("Send to Reaper failed", async () => (await sendToReaper(session.id)).session)}
              >
                <i className="fa-solid fa-play mr-2 text-[8px]" />
                Send to Reaper
              </button>
              <button
                type="button"
                className="btn btn-keep h-10 text-[10px] tracking-[.12em] uppercase font-medium"
                disabled={busy || !sketch}
                onClick={() => run("Keep failed", async () => (await keepSession(session.id)).session)}
              >
                {session.committed ? "Kept" : "Keep this"}
              </button>
              <button
                type="button"
                className="btn btn-primary col-span-2 h-10 text-[10px] tracking-[.12em] uppercase"
                disabled={busy}
                onClick={() =>
                  run("Generate failed", async () => (await generateSession(session.id)).session)
                }
              >
                {busy ? (
                  <span className="generating-dots inline-flex gap-[3px] mr-3 align-middle">
                    <b className="w-1 h-1 bg-[#FBFAF7] block" />
                    <b className="w-1 h-1 bg-[#9A9B96] block" />
                    <b className="w-1 h-1 bg-[#CDCCC7] block" />
                  </span>
                ) : (
                  <i className="fa-solid fa-rotate mr-2 text-[8px]" />
                )}
                {sketch ? "Regenerate" : "Generate"}
              </button>
            </div>
          </article>

          <aside className="flex flex-col gap-5">
            <div className="panel-surface bg-[#FBFAF7] border border-[#D8D4CE] p-5">
              <div className="mono text-[9px] text-[#8D908F] mb-3">REAPER</div>
              <p className="text-[13px] leading-6 text-[#646A6B]">
                {session.reaper?.midiFiles.harmony
                  ? "Notes are already on Harmony, Bass and Drums. If an empty project is still open, switch to Poppin_Sketch and press play."
                  : "Generate, then send. Reaper opens with the MIDI on the tracks."}
              </p>
              {session.reaper?.projectPath ? (
                <p className="mono text-[9px] text-[#777B7C] mt-4 break-all">
                  {session.reaper.projectPath}
                </p>
              ) : null}
            </div>
            <div className="panel-surface bg-[#FBFAF7] border border-[#D8D4CE] p-5 flex-1">
              <div className="mono text-[9px] text-[#8D908F] mb-3">LOG</div>
              <pre className="mono text-[9px] leading-5 text-[#777B7C] whitespace-pre-wrap">
                {session.logs.slice(-12).join("\n") || "Waiting to generate."}
              </pre>
            </div>
          </aside>
        </section>

        {error ? <p className="mt-6 text-[13px] text-[#8A4A4A]">{error}</p> : null}

        <section className="mt-7 flex items-center justify-between border-t border-[#D8D4CE] pt-5">
          <div className="mono text-[9px] text-[#858885]">
            {session.committed
              ? "COMMITTED · HUMAN GATE PASSED"
              : "PRODUCED BY PHASE 1 ORCHESTRATOR · NOTHING CANONICAL UNTIL YOU KEEP IT"}
          </div>
        </section>
      </main>
    </div>
  );
}
