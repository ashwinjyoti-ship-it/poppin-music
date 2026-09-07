const NOTE_INDEX: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export function pitchToMidi(pitch: string): number {
  const match = pitch.match(/^([A-G])([#b]?)(-?\d+)$/);
  if (!match) {
    throw new Error(`Invalid pitch: ${pitch}`);
  }
  const letter = match[1] ?? "C";
  const accidental = match[2] ?? "";
  const octave = Number.parseInt(match[3] ?? "4", 10);
  let pc = NOTE_INDEX[letter] ?? 0;
  if (accidental === "#") pc += 1;
  if (accidental === "b") pc -= 1;
  const midi = (octave + 1) * 12 + pc;
  if (midi < 0 || midi > 127) {
    throw new Error(`Pitch out of MIDI range: ${pitch}`);
  }
  return midi;
}

export function parseMeter(meter: string): { numerator: number; denominator: number } {
  const match = meter.replace(/\s+/g, "").match(/^(\d+)\/(\d+)$/);
  if (!match) return { numerator: 4, denominator: 4 };
  return {
    numerator: Number.parseInt(match[1] ?? "4", 10),
    denominator: Number.parseInt(match[2] ?? "4", 10),
  };
}

export function beatsPerBar(meter: string): number {
  const { numerator, denominator } = parseMeter(meter);
  return numerator * (4 / denominator);
}
