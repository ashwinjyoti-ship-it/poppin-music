import { FormEvent, ReactNode, useState } from "react";
import { Header } from "../components/Header";
import { createSession, type ReaperStatus, type SessionRecord } from "../lib/api";

type Props = {
  reaper: ReaperStatus | null;
  onCreated: (session: SessionRecord) => void;
};

const KEYS = ["C", "C#", "Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab", "A", "Bb", "B"];
const CENTRES = ["major", "minor"];
const METERS = ["4/4", "3/4", "6/8", "5/4", "7/8"];

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 flex h-4 items-center justify-between gap-2">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] whitespace-nowrap">
          {label}
        </span>
        {hint ? (
          <span className="mono text-[9px] text-[#A3A29E] whitespace-nowrap">{hint}</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

export function NewSession({ reaper, onCreated }: Props) {
  const [tempo, setTempo] = useState("74");
  const [key, setKey] = useState("D");
  const [centre, setCentre] = useState("major");
  const [meter, setMeter] = useState("4/4");
  const [intention, setIntention] = useState(
    "8 bars. Quiet and reflective. Slightly unresolved. Simple enough to leave room for a melody.",
  );
  const [artistReference, setArtistReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { session } = await createSession({
        tempo: Number.parseFloat(tempo) || 74,
        key: `${key} ${centre}`,
        meter,
        intention,
        artistReference: artistReference || undefined,
      });
      onCreated(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create session");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Header variant="lab" reaper={reaper} />
      <main className="relative min-h-[calc(100vh-48px)] px-10 xl:px-24 pt-16 pb-20">
        <div className="absolute top-8 right-10 mono text-[10px] tracking-[0.18em] text-[#A3A29E]">
          PHASE 1 / NEW SESSION
        </div>
        <section className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[360px_1fr] gap-12 xl:gap-24">
          <div className="pt-4">
            <div className="mono text-[10px] tracking-[0.16em] text-[#8D908F] mb-8">NEW / 001</div>
            <h1 className="text-[52px] leading-[1.02] font-light tracking-[-0.035em]">
              Start with what
              <br />
              you hear.
            </h1>
            <p className="mt-8 max-w-[310px] text-[16px] leading-7 text-[#646A6B]">
              No theory required. Set the room, describe the feeling, then let the session musicians
              make it audible.
            </p>
            <div className="mt-16 border-t border-[#D8D4CE] pt-4 flex items-start gap-4">
              <span className="w-2 h-2 bg-[#B8D4C3] mt-1.5" />
              <p className="mono text-[10px] leading-5 text-[#747A7D] uppercase">
                Human contract
                <br />
                <span className="text-[#273038] normal-case">
                  You provide taste. The system provides technique.
                </span>
              </p>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="panel-surface bg-[#FBFAF7] border border-[#D8D4CE] p-10"
          >
            <div className="flex justify-between items-start border-b border-[#D8D4CE] pb-5 mb-8">
              <div>
                <h2 className="text-[20px] font-normal">Blank session</h2>
                <p className="text-[13px] text-[#858885] mt-1">A quiet place to begin.</p>
              </div>
              <span className="mono text-[10px] text-[#A3A29E]">UNSAVED</span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <Field label="Tempo">
                <div className="relative">
                  <input
                    className="field has-suffix"
                    inputMode="numeric"
                    value={tempo}
                    onChange={(e) => setTempo(e.target.value)}
                    aria-label="Tempo"
                  />
                  <span className="mono pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] leading-none text-[#8D908F]">
                    BPM
                  </span>
                </div>
              </Field>
              <Field label="Key">
                <div className="relative">
                  <select
                    className="field"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    aria-label="Key"
                  >
                    {KEYS.map((note) => (
                      <option key={note} value={note}>
                        {note}
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#8D908F]" />
                </div>
              </Field>
              <Field label="Centre">
                <div className="relative">
                  <select
                    className="field"
                    value={centre}
                    onChange={(e) => setCentre(e.target.value)}
                    aria-label="Centre"
                  >
                    {CENTRES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#8D908F]" />
                </div>
              </Field>
              <Field label="Meter">
                <div className="relative">
                  <select
                    className="field"
                    value={meter}
                    onChange={(e) => setMeter(e.target.value)}
                    aria-label="Meter"
                  >
                    {METERS.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#8D908F]" />
                </div>
              </Field>
            </div>

            <div className="mt-10">
              <Field label="Intention / feeling" hint="plain language">
                <textarea
                  className="field"
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                />
              </Field>
            </div>

            <div className="mt-8">
              <Field label="Artist reference" hint="optional / stored only">
                <input
                  className="field field-prose"
                  placeholder="e.g. spacious early-70s folk, without imitation"
                  value={artistReference}
                  onChange={(e) => setArtistReference(e.target.value)}
                />
              </Field>
            </div>

            {error ? <p className="mt-6 text-[13px] text-[#8A4A4A]">{error}</p> : null}

            <div className="mt-10 border-t border-[#D8D4CE] pt-7">
              <div className="flex items-center gap-6 mono text-[10px] tracking-[0.12em] text-[#747A7D]">
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-square text-[7px] text-[#B8C8D4]" /> HARMONY
                </span>
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-square text-[7px] text-[#D4C8B8]" /> BASS
                </span>
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-square text-[7px] text-[#D4B8C3]" /> DRUMS
                </span>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="btn btn-primary mt-10 h-12 w-full text-[11px] tracking-[0.14em] uppercase"
              >
                {busy ? "Creating…" : "Create session"}{" "}
                <i className="fa-solid fa-arrow-right ml-3 text-[9px]" />
              </button>
            </div>
          </form>
        </section>

        <section className="max-w-[1120px] mx-auto mt-14 flex justify-end">
          <div className="w-[664px] grid grid-cols-[120px_1fr] border-t border-[#D8D4CE] pt-4 text-[12px] leading-5">
            <span className="mono text-[9px] tracking-[0.12em] text-[#8D908F]">FIRST MOVE</span>
            <p className="text-[#646A6B]">
              Generate a sketch, press Play to hear it in Poppin, then send to GarageBand (or keep /
              regenerate). Reaper is optional. The canvas waits until this loop feels alive.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
