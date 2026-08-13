import { useRef, useState } from "react";
import Player from "@vimeo/player";
import { Volume2, VolumeX } from "lucide-react";
import { VideoStage } from "../components/mem/VideoStage";

export const PRESENTATION_VIMEO_ID = "presentation-vimeo";

export function PresentationAudioButton() {
  const playerRef = useRef<Player | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [busy, setBusy] = useState(false);

  const getPlayer = () => {
    if (playerRef.current) return playerRef.current;
    const iframe = document.getElementById(PRESENTATION_VIMEO_ID);
    if (!(iframe instanceof HTMLIFrameElement)) return null;
    playerRef.current = new Player(iframe);
    return playerRef.current;
  };

  const toggleSound = async () => {
    const player = getPlayer();
    if (!player || busy) return;
    setBusy(true);
    try {
      if (soundOn) {
        await player.setMuted(true);
        setSoundOn(false);
      } else {
        await player.setMuted(false);
        await player.setVolume(1);
        await player.play();
        setSoundOn(true);
      }
    } catch {
      // Browsers can reject unmute without a user gesture; keep the current state.
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleSound}
      disabled={busy}
      aria-pressed={soundOn}
      aria-label={soundOn ? "Silenciar audio" : "Activar audio"}
      className="inline-flex items-center gap-2 rounded-full border border-mem-blue/30 bg-mem-blue px-3 py-1.5 text-xs font-bold text-white shadow-md transition hover:bg-mem-blue-2 disabled:opacity-70 sm:px-4 sm:py-2 sm:text-sm"
    >
      {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      {soundOn ? "Silenciar" : "Activar audio"}
    </button>
  );
}

export function Presentation() {
  return (
    <div className="relative h-full w-full">
      <VideoStage
        videoId="1217024164"
        title="Firefly genera una portada interactiva render 8k"
        immersive
        interactive
        iframeId={PRESENTATION_VIMEO_ID}
      />
    </div>
  );
}
