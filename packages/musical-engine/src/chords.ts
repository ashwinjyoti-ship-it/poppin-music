import { pitchToMidi } from "./pitch.js";

type Quality = {
  intervals: number[];
};

const QUALITIES: Array<{ pattern: RegExp; quality: Quality }> = [
  { pattern: /maj7|Δ7|M7/, quality: { intervals: [0, 4, 7, 11] } },
  { pattern: /m7b5|ø/, quality: { intervals: [0, 3, 6, 10] } },
  { pattern: /m7|min7|-7/, quality: { intervals: [0, 3, 7, 10] } },
  { pattern: /7sus4|7sus/, quality: { intervals: [0, 5, 7, 10] } },
  { pattern: /sus2/, quality: { intervals: [0, 2, 7] } },
  { pattern: /sus4|sus/, quality: { intervals: [0, 5, 7] } },
  { pattern: /maj|major/, quality: { intervals: [0, 4, 7] } },
  { pattern: /min|minor|^m(?!aj)/, quality: { intervals: [0, 3, 7] } },
  { pattern: /dim/, quality: { intervals: [0, 3, 6] } },
  { pattern: /aug|\+/, quality: { intervals: [0, 4, 8] } },
  { pattern: /6/, quality: { intervals: [0, 4, 7, 9] } },
  { pattern: /9/, quality: { intervals: [0, 4, 7, 10, 14] } },
  { pattern: /7/, quality: { intervals: [0, 4, 7, 10] } },
];

const ROOTS: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

export function chordToMidiNotes(chord: string, explicit?: string[]): number[] {
  if (explicit && explicit.length > 0) {
    return explicit.map(pitchToMidi);
  }

  const cleaned = chord.trim();
  const rootMatch = cleaned.match(/^([A-G][#b]?)/);
  const rootName = rootMatch?.[1] ?? "C";
  const rest = cleaned.slice(rootName.length);
  const root = ROOTS[rootName] ?? 0;

  let intervals = [0, 4, 7];
  for (const entry of QUALITIES) {
    if (entry.pattern.test(rest)) {
      intervals = entry.quality.intervals;
      break;
    }
  }

  const base = 48 + root; // around C3
  return intervals.map((interval) => {
    let note = base + interval;
    while (note < 48) note += 12;
    while (note > 72) note -= 12;
    return note;
  });
}
