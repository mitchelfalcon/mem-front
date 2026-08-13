import { useRef, useState } from "react";
import Player from "@vimeo/player";
import { Volume2, VolumeX } from "lucide-react";
import { VideoStage } from "../components/mem/VideoStage";

const IFRAME_ID = "presentation-vimeo";

export function Presentation() {
  const playerRef = useRef<Player | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [busy, setBusy] = useState(false);

  const getPlayer = () => {
    if (playerRef.current) return playerRef.current;
    const iframe = document.getElementById(IFRAME_ID);
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
    <div className="relative h-full w-full">
      <VideoStage
        videoId="1217024164"
        title="Firefly genera una portada interactiva render 8k"
        immersive
        interactive
        iframeId={IFRAME_ID}
      />
      <button
        type="button"
        onClick={toggleSound}
        disabled={busy}
        aria-pressed={soundOn}
        aria-label={soundOn ? "Silenciar audio" : "Activar audio"}
        className="absolute bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-4 py-2.5 text-sm font-semibold text-mem-navy shadow-lg backdrop-blur-md transition hover:bg-white disabled:opacity-70"
      >
        {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        {soundOn ? "Silenciar" : "Activar audio"}
      </button>
    </div>
  );
}
