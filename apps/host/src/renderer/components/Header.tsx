import { LogoMark } from "./LogoMark";
import type { GarageBandStatus } from "../lib/api";

type Props = {
  variant: "lab" | "audition";
  songTitle?: string;
  meta?: string;
  garageBand?: GarageBandStatus | null;
  previewPlaying?: boolean;
  onNewSession?: () => void;
};

export function Header({
  variant,
  songTitle,
  meta,
  garageBand,
  previewPlaying,
  onNewSession,
}: Props) {
  const bridgeLabel = (): string => {
    if (previewPlaying) return "PREVIEW / PLAYING";
    if (garageBand?.label === "OPENED") return "GARAGEBAND / OPENED";
    if (garageBand?.label === "FILES READY") return "GARAGEBAND / MIDI READY";
    if (garageBand?.label === "ERROR") return "GARAGEBAND / ERROR";
    return "READY TO HEAR";
  };

  if (variant === "lab") {
    return (
      <header className="app-header h-12 border-b border-[#D8D4CE] flex items-center justify-between px-8 bg-[#F5F2ED]">
        <div className="flex items-center gap-4">
          <LogoMark />
          <span className="text-[13px] font-medium tracking-[0.18em] uppercase">Poppin Music</span>
          <span className="mono text-[10px] text-[#8D908F]">/ SESSION LAB</span>
        </div>
        <nav className="flex h-full items-center gap-8 text-[11px] tracking-[0.12em] uppercase">
          <span className="h-full flex items-center border-b border-[#273038]">New session</span>
          <span className="text-[#8D908F]">Open</span>
        </nav>
        <div className="mono flex items-center gap-3 text-[10px] text-[#747A7D]">
          <span className="w-2 h-2 bg-[#C3B8D4]" />
          {bridgeLabel()}
        </div>
      </header>
    );
  }

  return (
    <header className="app-header h-12 border-b border-[#D8D4CE] flex items-center">
      <div className="w-[220px] h-full border-r border-[#D8D4CE] flex items-center px-5 gap-3">
        <LogoMark />
        <span className="text-[11px] font-medium tracking-[.16em]">POPPIN</span>
      </div>
      <nav className="flex-1 h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <button type="button" className="text-[11px]" onClick={onNewSession}>
            <i className="fa-solid fa-arrow-left mr-3 text-[9px]" />
            New session
          </button>
          <span className="text-[13px] font-normal">{songTitle ?? "Untitled"}</span>
          {meta ? <span className="mono text-[10px] text-[#858885]">{meta}</span> : null}
        </div>
        <div className="mono flex items-center gap-2 text-[10px]">
          <i className="fa-solid fa-square text-[7px] text-[#C3B8D4]" />
          {bridgeLabel()}
        </div>
      </nav>
    </header>
  );
}
