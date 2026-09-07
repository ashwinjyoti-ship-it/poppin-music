function variableLength(value: number): number[] {
  if (value < 0) value = 0;
  const bytes: number[] = [value & 0x7f];
  let remaining = value >> 7;
  while (remaining > 0) {
    bytes.unshift((remaining & 0x7f) | 0x80);
    remaining >>= 7;
  }
  return bytes;
}

export type MidiNote = {
  tick: number;
  duration: number;
  note: number;
  velocity: number;
  channel: number;
};

type TimedEvent = { tick: number; bytes: number[] };

function collectEvents(notes: MidiNote[]): TimedEvent[] {
  const events: TimedEvent[] = [];
  for (const note of notes) {
    const vel = Math.max(1, Math.min(127, note.velocity));
    const n = Math.max(0, Math.min(127, note.note));
    const ch = note.channel & 0x0f;
    events.push({
      tick: note.tick,
      bytes: [0x90 | ch, n, vel],
    });
    events.push({
      tick: note.tick + Math.max(1, note.duration),
      bytes: [0x80 | ch, n, 0],
    });
  }
  events.sort((a, b) => a.tick - b.tick);
  return events;
}

function encodeTrack(events: TimedEvent[], extraStart: TimedEvent[] = []): Uint8Array {
  const all = [...extraStart, ...events].sort((a, b) => a.tick - b.tick);
  const body: number[] = [];
  let lastTick = 0;
  for (const event of all) {
    const delta = Math.max(0, event.tick - lastTick);
    body.push(...variableLength(delta), ...event.bytes);
    lastTick = event.tick;
  }
  body.push(...variableLength(0), 0xff, 0x2f, 0x00);

  const length = body.length;
  const header = [
    0x4d, 0x54, 0x72, 0x6b,
    (length >> 24) & 0xff,
    (length >> 16) & 0xff,
    (length >> 8) & 0xff,
    length & 0xff,
  ];
  return Uint8Array.from([...header, ...body]);
}

export function writeMidiFile(opts: {
  ticksPerQuarter: number;
  tempo: number;
  numerator: number;
  denominator: number;
  tracks: Array<{ name: string; notes: MidiNote[] }>;
}): Uint8Array {
  const ntrks = opts.tracks.length + 1;
  const header = Uint8Array.from([
    0x4d, 0x54, 0x68, 0x64,
    0x00, 0x00, 0x00, 0x06,
    0x00, 0x01,
    (ntrks >> 8) & 0xff,
    ntrks & 0xff,
    (opts.ticksPerQuarter >> 8) & 0xff,
    opts.ticksPerQuarter & 0xff,
  ]);

  const micros = Math.round(60_000_000 / opts.tempo);
  const denomLog = Math.round(Math.log2(opts.denominator));
  const conductor: TimedEvent[] = [
    {
      tick: 0,
      bytes: [0xff, 0x51, 0x03, (micros >> 16) & 0xff, (micros >> 8) & 0xff, micros & 0xff],
    },
    {
      tick: 0,
      bytes: [0xff, 0x58, 0x04, opts.numerator, denomLog, 24, 8],
    },
  ];
  const conductorTrack = encodeTrack([], conductor);

  const namedTracks = opts.tracks.map((track) => {
    const nameBytes = Array.from(new TextEncoder().encode(track.name));
    const nameEvent: TimedEvent = {
      tick: 0,
      bytes: [0xff, 0x03, nameBytes.length, ...nameBytes],
    };
    return encodeTrack(collectEvents(track.notes), [nameEvent]);
  });

  const parts = [header, conductorTrack, ...namedTracks];
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

export function writeSingleTrackMidi(opts: {
  ticksPerQuarter: number;
  tempo: number;
  numerator: number;
  denominator: number;
  name: string;
  notes: MidiNote[];
}): Uint8Array {
  return writeMidiFile({
    ...opts,
    tracks: [{ name: opts.name, notes: opts.notes }],
  });
}
