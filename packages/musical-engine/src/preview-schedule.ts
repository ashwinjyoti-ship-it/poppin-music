import type { PMRSketch } from "@poppin/pmr";
import { sketchToMidiEvents, TICKS_PER_QUARTER } from "./render.js";
import type { MidiNote } from "./midi.js";

export type PreviewVoice = "harmony" | "bass" | "drums";

export type PreviewNote = {
  voice: PreviewVoice;
  startSec: number;
  durationSec: number;
  midi: number;
  velocity: number;
};

export type PreviewSchedule = {
  tempo: number;
  durationSec: number;
  notes: PreviewNote[];
};

function ticksToSeconds(tick: number, tempo: number): number {
  return (tick * 60) / (TICKS_PER_QUARTER * tempo);
}

function mapNotes(voice: PreviewVoice, notes: MidiNote[], tempo: number): PreviewNote[] {
  return notes.map((note) => ({
    voice,
    startSec: ticksToSeconds(note.tick, tempo),
    durationSec: Math.max(0.04, ticksToSeconds(note.duration, tempo)),
    midi: note.note,
    velocity: note.velocity,
  }));
}

/** Build a timed note schedule for in-app audition (no Web Audio). */
export function buildPreviewSchedule(sketch: PMRSketch): PreviewSchedule {
  const tempo = sketch.meta.tempo;
  const events = sketchToMidiEvents(sketch);
  const notes = [
    ...mapNotes("harmony", events.harmony, tempo),
    ...mapNotes("bass", events.bass, tempo),
    ...mapNotes("drums", events.drums, tempo),
  ].sort((a, b) => a.startSec - b.startSec);

  const durationSec = notes.reduce(
    (max, note) => Math.max(max, note.startSec + note.durationSec),
    0,
  );

  return {
    tempo,
    durationSec: Math.max(durationSec, 0.25),
    notes,
  };
}

export function midiToHz(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}
