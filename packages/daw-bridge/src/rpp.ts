import { randomUUID } from "node:crypto";
import type { PMRSketch } from "@poppin/pmr";
import {
  beatsPerBar,
  parseMeter,
  TICKS_PER_QUARTER,
  type MidiNote,
} from "@poppin/musical-engine";

const TRACKS = [
  { key: "harmony" as const, name: "Harmony", color: 13948116 },
  { key: "bass" as const, name: "Bass", color: 12105912 },
  { key: "drums" as const, name: "Drums", color: 12825043 },
];

function guid(): string {
  return `{${randomUUID().toUpperCase()}}`;
}

function hexByte(value: number): string {
  return (value & 0xff).toString(16).padStart(2, "0");
}

export function sketchLengthSeconds(sketch: PMRSketch): number {
  const beats = sketch.meta.bars * beatsPerBar(sketch.meta.meter);
  return (beats * 60) / sketch.meta.tempo;
}

function midiEventLines(notes: MidiNote[]): string[] {
  type Ev = { tick: number; status: number; d1: number; d2: number };
  const events: Ev[] = [];
  for (const note of notes) {
    const ch = note.channel & 0x0f;
    const n = Math.max(0, Math.min(127, note.note));
    const vel = Math.max(1, Math.min(127, note.velocity));
    events.push({ tick: note.tick, status: 0x90 | ch, d1: n, d2: vel });
    events.push({
      tick: note.tick + Math.max(1, note.duration),
      status: 0x80 | ch,
      d1: n,
      d2: 0,
    });
  }
  events.sort((a, b) => a.tick - b.tick || a.status - b.status);

  const channel = notes[0]?.channel ?? 0;
  const lastTick = events.reduce((max, event) => Math.max(max, event.tick), 0);
  events.push({
    tick: lastTick + 1,
    status: 0xb0 | (channel & 0x0f),
    d1: 123,
    d2: 0,
  });

  const lines: string[] = [];
  let prev = 0;
  for (const event of events) {
    const delta = Math.max(0, event.tick - prev);
    lines.push(
      `        E ${delta} ${hexByte(event.status)} ${hexByte(event.d1)} ${hexByte(event.d2)}`,
    );
    prev = event.tick;
  }
  return lines;
}

function midiItem(opts: {
  name: string;
  notes: MidiNote[];
  lengthSeconds: number;
  tempo: number;
  numerator: number;
  denominator: number;
  iid: number;
}): string {
  const itemGuid = guid();
  const takeGuid = guid();
  const midiGuid = guid();
  const events =
    opts.notes.length > 0
      ? midiEventLines(opts.notes).join("\n")
      : `        E 0 ${hexByte(0xb0)} 7b 00`;

  return `    <ITEM
      POSITION 0
      SNAPOFFS 0
      LENGTH ${opts.lengthSeconds}
      LOOP 0
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0
      FADEOUT 1 0 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID ${itemGuid}
      IID ${opts.iid}
      NAME ${opts.name}
      VOLPAN 1 0 1 -1
      SOFFS 0
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID ${takeGuid}
      <SOURCE MIDI
        HASDATA 1 ${TICKS_PER_QUARTER} QN
${events}
        GUID ${midiGuid}
        IGNTEMPO 0 ${opts.tempo} ${opts.numerator} ${opts.denominator}
      >
    >`;
}

function trackBlock(opts: {
  name: string;
  color: number;
  notes: MidiNote[];
  lengthSeconds: number;
  tempo: number;
  numerator: number;
  denominator: number;
  iid: number;
}): string {
  const id = guid();
  const item = midiItem({
    name: opts.name,
    notes: opts.notes,
    lengthSeconds: opts.lengthSeconds,
    tempo: opts.tempo,
    numerator: opts.numerator,
    denominator: opts.denominator,
    iid: opts.iid,
  });

  return `  <TRACK ${id}
    NAME ${opts.name}
    PEAKCOL ${opts.color}
    AUTOMODE 0
    VOLPAN 1 0 -1 -1 1
    MUTESOLO 0 0 0
    IPHASE 0
    ISBUS 0 0
    BUSCOMP 0 0
    SHOWINMIX 1 0.6667 0.5 1 0.5 0 0 0
    SEL 0
    REC 0 0 1 0 0 0 0
    TRACKHEIGHT 0 0
    INQ 0 0 0 0.5 100 0 0 100
    NCHAN 2
    FX 1
    TRACKID ${id}
    PERF 0
    MIDIOUT -1
    MAINSEND 1 0
${item}
  >`;
}

export function buildPoppinProjectRpp(
  sketch: PMRSketch,
  events: { harmony: MidiNote[]; bass: MidiNote[]; drums: MidiNote[] },
): string {
  const { numerator, denominator } = parseMeter(sketch.meta.meter);
  const lengthSeconds = sketchLengthSeconds(sketch);
  const stamp = Math.floor(Date.now() / 1000);
  const tracks = TRACKS.map((track, index) =>
    trackBlock({
      name: track.name,
      color: track.color,
      notes: events[track.key],
      lengthSeconds,
      tempo: sketch.meta.tempo,
      numerator,
      denominator,
      iid: index + 1,
    }),
  ).join("\n");

  return `<REAPER_PROJECT 0.1 "6.0/OSX64" ${stamp}
  RIPPLE 0
  GROUPOVERRIDE 0 0 0
  AUTOXFADE 1
  ENVATTACH 1
  MIXERUIFLAGS 0 0
  PEAKGAIN 1
  FEEDBACK 0
  PANLAW 1
  PROJOFFS 0 0 0
  MAXPROJLEN 0 600
  GRID 1 8 1 8 1 0 0
  TIMEMODE 1 5 -1 30 0
  PANMODE 3
  CURSOR 0
  ZOOM 80 0 0
  VZOOMEX 6 0
  USE_REC_CFG 0
  RECMODE 1
  LOOP 1
  LOOPGRAN 0 4
  RECORD_PATH "midi" ""
  TIMELOCKMODE 1
  TEMPOENVLOCKMODE 1
  ITEMMIX 0
  TAKELANE 1
  SAMPLERATE 48000 0 0
  LOCK 1
  <METRONOME 6 2
    VOL 0.25 0.125
    FREQ 800 1600 1
    BEATLEN 4
    SAMPLES "" ""
  >
  GLOBAL_AUTO -1
  TEMPO ${sketch.meta.tempo} ${numerator} ${denominator}
  PLAYRATE 1 0 0.25 4
  SELECTION 0 ${lengthSeconds}
  SELECTION2 0 ${lengthSeconds}
  MASTERAUTOMODE 0
  MASTERTRACKHEIGHT 0 0
  MASTERPEAKCOL 16576
  MASTERMUTESOLO 0
  MASTERTRACKVIEW 0 0.6667 0.5 0.5 0.5 0 0 0
  MASTERHWOUT 0 0 1 0 0 0 0 -1
  MASTER_NCH 2 2
  MASTER_VOLUME 1 0 -1 -1 1
  MASTER_FX 1
  MASTER_SEL 0
${tracks}
>
`;
}
