import type { DrumVoice, PMRSketch } from "@poppin/pmr";
import { chordToMidiNotes } from "./chords.js";
import { writeMidiFile, writeSingleTrackMidi, type MidiNote } from "./midi.js";
import { beatsPerBar, parseMeter, pitchToMidi } from "./pitch.js";

export const TICKS_PER_QUARTER = 480;

const DRUM_GM: Record<DrumVoice, number> = {
  kick: 36,
  snare: 38,
  hatClosed: 42,
  hatOpen: 46,
  tomLow: 45,
  tomMid: 47,
  tomHigh: 50,
  ride: 51,
  crash: 49,
};

export type RenderedMidi = {
  combined: Uint8Array;
  tracks: {
    harmony: Uint8Array;
    bass: Uint8Array;
    drums: Uint8Array;
  };
  events: {
    harmony: MidiNote[];
    bass: MidiNote[];
    drums: MidiNote[];
  };
};

function barTick(bar: number, startBeat: number, meter: string): number {
  const bpBar = beatsPerBar(meter);
  return Math.round(((bar - 1) * bpBar + startBeat) * TICKS_PER_QUARTER);
}

function durationTicks(durationBeats: number): number {
  return Math.max(1, Math.round(durationBeats * TICKS_PER_QUARTER));
}

export function sketchToMidiEvents(sketch: PMRSketch): RenderedMidi["events"] {
  const meter = sketch.meta.meter;
  const bpBar = beatsPerBar(meter);

  const harmony: MidiNote[] = [];
  for (const event of sketch.harmony) {
    const notes = chordToMidiNotes(event.chord, event.notes);
    const tick = barTick(event.bar, 0, meter);
    const duration = durationTicks(bpBar * 0.95);
    for (const note of notes) {
      harmony.push({
        tick,
        duration,
        note,
        velocity: 68,
        channel: 0,
      });
    }
  }

  const bass: MidiNote[] = [];
  for (const bar of sketch.bass) {
    for (const note of bar.events) {
      bass.push({
        tick: barTick(bar.bar, note.startBeat, meter),
        duration: durationTicks(note.durationBeats),
        note: pitchToMidi(note.pitch),
        velocity: note.velocity ?? 72,
        channel: 1,
      });
    }
  }

  const drums: MidiNote[] = [];
  for (const bar of sketch.drums) {
    for (const event of bar.events) {
      drums.push({
        tick: barTick(bar.bar, event.startBeat, meter),
        duration: durationTicks(event.durationBeats ?? 0.25),
        note: DRUM_GM[event.voice],
        velocity: event.velocity ?? 60,
        channel: 9,
      });
    }
  }

  return { harmony, bass, drums };
}

export function renderSketchToMidi(sketch: PMRSketch): RenderedMidi {
  const events = sketchToMidiEvents(sketch);
  const { numerator, denominator } = parseMeter(sketch.meta.meter);
  const shared = {
    ticksPerQuarter: TICKS_PER_QUARTER,
    tempo: sketch.meta.tempo,
    numerator,
    denominator,
  };

  return {
    combined: writeMidiFile({
      ...shared,
      tracks: [
        { name: "Harmony", notes: events.harmony },
        { name: "Bass", notes: events.bass },
        { name: "Drums", notes: events.drums },
      ],
    }),
    tracks: {
      harmony: writeSingleTrackMidi({ ...shared, name: "Harmony", notes: events.harmony }),
      bass: writeSingleTrackMidi({ ...shared, name: "Bass", notes: events.bass }),
      drums: writeSingleTrackMidi({ ...shared, name: "Drums", notes: events.drums }),
    },
    events,
  };
}
