import {
  buildPreviewSchedule,
  midiToHz,
  type PreviewNote,
  type PreviewSchedule,
} from "@poppin/musical-engine";
import type { PMRSketch } from "@poppin/pmr";

type Listener = (state: PreviewPlayerState) => void;

export type PreviewPlayerState = {
  playing: boolean;
  currentSec: number;
  durationSec: number;
};

/** Lightweight Web Audio audition for a PMRSketch. No DAW required. */
export class SketchPreviewPlayer {
  private ctx: AudioContext | null = null;
  private schedule: PreviewSchedule | null = null;
  private startAtCtx = 0;
  private offsetSec = 0;
  private playing = false;
  private stoppers: Array<() => void> = [];
  private raf = 0;
  private listeners = new Set<Listener>();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  getState(): PreviewPlayerState {
    return {
      playing: this.playing,
      currentSec: this.getCurrentSec(),
      durationSec: this.schedule?.durationSec ?? 0,
    };
  }

  load(sketch: PMRSketch): void {
    this.stop();
    this.schedule = buildPreviewSchedule(sketch);
    this.offsetSec = 0;
    this.emit();
  }

  async play(): Promise<void> {
    if (!this.schedule || this.schedule.notes.length === 0) return;
    const ctx = await this.ensureContext();
    if (this.playing) this.clearVoices();

    if (this.offsetSec >= this.schedule.durationSec - 0.05) {
      this.offsetSec = 0;
    }

    this.playing = true;
    this.startAtCtx = ctx.currentTime - this.offsetSec;
    this.scheduleFrom(this.offsetSec);
    this.tick();
    this.emit();
  }

  stop(): void {
    this.clearVoices();
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.playing = false;
    this.offsetSec = 0;
    this.emit();
  }

  pause(): void {
    if (!this.playing) return;
    this.offsetSec = this.getCurrentSec();
    this.clearVoices();
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.playing = false;
    this.emit();
  }

  seek(sec: number): void {
    const duration = this.schedule?.durationSec ?? 0;
    this.offsetSec = Math.max(0, Math.min(sec, duration));
    if (this.playing) {
      void this.play();
    } else {
      this.emit();
    }
  }

  dispose(): void {
    this.stop();
    void this.ctx?.close();
    this.ctx = null;
    this.listeners.clear();
  }

  private getCurrentSec(): number {
    if (!this.playing || !this.ctx) return this.offsetSec;
    return Math.min(
      this.ctx.currentTime - this.startAtCtx,
      this.schedule?.durationSec ?? 0,
    );
  }

  private async ensureContext(): Promise<AudioContext> {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
    return this.ctx;
  }

  private scheduleFrom(fromSec: number): void {
    if (!this.ctx || !this.schedule) return;
    const master = this.ctx.createGain();
    master.gain.value = 0.22;
    master.connect(this.ctx.destination);
    this.stoppers.push(() => master.disconnect());

    for (const note of this.schedule.notes) {
      if (note.startSec + note.durationSec < fromSec) continue;
      this.voiceNote(note, fromSec, master);
    }
  }

  private voiceNote(note: PreviewNote, fromSec: number, dest: AudioNode): void {
    if (!this.ctx) return;
    const when = this.startAtCtx + note.startSec;
    const now = this.ctx.currentTime;
    const start = Math.max(when, now);
    const remain = note.durationSec - Math.max(0, fromSec - note.startSec);
    if (remain <= 0.01) return;

    const vel = Math.max(0.05, Math.min(1, note.velocity / 127));

    if (note.voice === "drums") {
      this.drumHit(note, start, remain, vel, dest);
      return;
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = note.voice === "bass" ? "sine" : "triangle";
    osc.frequency.value = midiToHz(note.midi);
    const peak = note.voice === "bass" ? 0.55 * vel : 0.28 * vel;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + remain);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(start);
    osc.stop(start + remain + 0.02);
    this.stoppers.push(() => {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
      osc.disconnect();
      gain.disconnect();
    });
  }

  private drumHit(
    note: PreviewNote,
    start: number,
    remain: number,
    vel: number,
    dest: AudioNode,
  ): void {
    if (!this.ctx) return;
    const dur = Math.min(remain, note.midi === 36 ? 0.18 : note.midi === 38 ? 0.12 : 0.06);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const isKick = note.midi <= 36;
    const isSnare = note.midi === 38;
    osc.type = isKick ? "sine" : "square";
    osc.frequency.value = isKick ? 55 : isSnare ? 180 : 6000;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.5 * vel, start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(start);
    osc.stop(start + dur + 0.02);
    this.stoppers.push(() => {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
      osc.disconnect();
      gain.disconnect();
    });
  }

  private clearVoices(): void {
    for (const stop of this.stoppers) stop();
    this.stoppers = [];
  }

  private tick = (): void => {
    if (!this.playing || !this.schedule) return;
    const current = this.getCurrentSec();
    if (current >= this.schedule.durationSec - 0.02) {
      this.stop();
      return;
    }
    this.emit();
    this.raf = requestAnimationFrame(this.tick);
  };

  private emit(): void {
    const state = this.getState();
    for (const listener of this.listeners) listener(state);
  }
}
