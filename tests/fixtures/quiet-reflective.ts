import type { PMRSketch } from "@poppin/pmr";

export const quietReflectiveSketch: PMRSketch = {
  meta: {
    title: "Quiet room",
    tempo: 74,
    meter: "4/4",
    key: "D major",
    bars: 8,
  },
  intention:
    "8 bars, quiet and reflective, slightly unresolved, simple enough for a melody.",
  explanation:
    "A patient D-major room that leans toward Bm and G, then hangs on Asus so a melody still has somewhere to go.",
  sections: [{ id: "verse", name: "Verse", startBar: 1, endBar: 8 }],
  harmony: [
    { bar: 1, chord: "Dmaj7", role: "home", tension: "open", notes: ["D3", "A3", "C#4", "F#4"] },
    { bar: 2, chord: "Bm7", role: "shade", tension: "soft", notes: ["B2", "F#3", "A3", "D4"] },
    { bar: 3, chord: "Gmaj7", role: "lift", tension: "warm", notes: ["G2", "D3", "B3", "F#4"] },
    { bar: 4, chord: "Asus", role: "question", tension: "unresolved", notes: ["A2", "E3", "A3", "D4"] },
    { bar: 5, chord: "Dmaj7", role: "home", tension: "open", notes: ["D3", "F#3", "A3", "C#4"] },
    { bar: 6, chord: "Bm7", role: "shade", tension: "soft", notes: ["B2", "D3", "F#3", "A3"] },
    { bar: 7, chord: "Gmaj7", role: "lift", tension: "warm", notes: ["G2", "B2", "D3", "F#3"] },
    { bar: 8, chord: "A7sus4", role: "hang", tension: "unresolved", notes: ["A2", "E3", "G3", "D4"] },
  ],
  bass: [
    {
      bar: 1,
      role: "anchor",
      events: [
        { pitch: "D2", startBeat: 0, durationBeats: 3, velocity: 72 },
        { pitch: "A1", startBeat: 3, durationBeats: 1, velocity: 60 },
      ],
    },
    {
      bar: 2,
      role: "listen",
      events: [
        { pitch: "B1", startBeat: 0.5, durationBeats: 2.5, velocity: 68 },
        { pitch: "F#2", startBeat: 3, durationBeats: 1, velocity: 58 },
      ],
    },
    {
      bar: 3,
      role: "lift",
      events: [{ pitch: "G2", startBeat: 0, durationBeats: 4, velocity: 70 }],
    },
    {
      bar: 4,
      role: "question",
      events: [
        { pitch: "A1", startBeat: 0, durationBeats: 2, velocity: 66 },
        { pitch: "E2", startBeat: 2.5, durationBeats: 1.5, velocity: 62 },
      ],
    },
    {
      bar: 5,
      role: "anchor",
      events: [{ pitch: "D2", startBeat: 0, durationBeats: 4, velocity: 70 }],
    },
    {
      bar: 6,
      role: "space",
      events: [
        { pitch: "B1", startBeat: 1, durationBeats: 2, velocity: 64 },
        { pitch: "D2", startBeat: 3, durationBeats: 1, velocity: 58 },
      ],
    },
    {
      bar: 7,
      role: "lift",
      events: [
        { pitch: "G1", startBeat: 0, durationBeats: 2, velocity: 68 },
        { pitch: "B1", startBeat: 2.5, durationBeats: 1.5, velocity: 60 },
      ],
    },
    {
      bar: 8,
      role: "hang",
      events: [{ pitch: "A1", startBeat: 0, durationBeats: 4, velocity: 62 }],
    },
  ],
  drums: [
    {
      bar: 1,
      role: "breath",
      events: [
        { voice: "kick", startBeat: 0, durationBeats: 0.5, velocity: 62 },
        { voice: "hatClosed", startBeat: 1, durationBeats: 0.25, velocity: 44 },
        { voice: "hatClosed", startBeat: 3, durationBeats: 0.25, velocity: 40 },
      ],
    },
    {
      bar: 2,
      role: "breath",
      events: [
        { voice: "kick", startBeat: 0, durationBeats: 0.5, velocity: 58 },
        { voice: "hatClosed", startBeat: 2, durationBeats: 0.25, velocity: 42 },
      ],
    },
    {
      bar: 3,
      role: "breath",
      events: [
        { voice: "kick", startBeat: 0, durationBeats: 0.5, velocity: 60 },
        { voice: "snare", startBeat: 2, durationBeats: 0.25, velocity: 38 },
        { voice: "hatClosed", startBeat: 3, durationBeats: 0.25, velocity: 40 },
      ],
    },
    {
      bar: 4,
      role: "space",
      events: [
        { voice: "kick", startBeat: 0, durationBeats: 0.5, velocity: 55 },
        { voice: "hatClosed", startBeat: 2.5, durationBeats: 0.25, velocity: 36 },
      ],
    },
    {
      bar: 5,
      role: "breath",
      events: [
        { voice: "kick", startBeat: 0, durationBeats: 0.5, velocity: 62 },
        { voice: "hatClosed", startBeat: 1, durationBeats: 0.25, velocity: 44 },
        { voice: "hatClosed", startBeat: 3, durationBeats: 0.25, velocity: 40 },
      ],
    },
    {
      bar: 6,
      role: "space",
      events: [
        { voice: "kick", startBeat: 0.5, durationBeats: 0.5, velocity: 52 },
        { voice: "hatClosed", startBeat: 2, durationBeats: 0.25, velocity: 38 },
      ],
    },
    {
      bar: 7,
      role: "lift",
      events: [
        { voice: "kick", startBeat: 0, durationBeats: 0.5, velocity: 64 },
        { voice: "snare", startBeat: 2, durationBeats: 0.25, velocity: 42 },
        { voice: "hatClosed", startBeat: 1, durationBeats: 0.25, velocity: 40 },
        { voice: "hatClosed", startBeat: 3, durationBeats: 0.25, velocity: 44 },
      ],
    },
    {
      bar: 8,
      role: "hang",
      events: [
        { voice: "kick", startBeat: 0, durationBeats: 0.5, velocity: 50 },
        { voice: "ride", startBeat: 2, durationBeats: 1, velocity: 36 },
      ],
    },
  ],
};
