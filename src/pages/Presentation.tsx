import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import { Volume2, VolumeX } from "lucide-react";
import { VideoStage } from "../components/mem/VideoStage";

export const PRESENTATION_VIMEO_ID = "presentation-vimeo";

function race<T>(promise: Promise<T>, ms = 2000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = window.setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        window.clearTimeout(t);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(t);
        reject(error);
      },
    );
  });
}

let cached: { iframe: HTMLIFrameElement; player: Player } | null = null;
const soundListeners = new Set<(on: boolean) => void>();

function getPlayer(): Player | null {
  const iframe = document.getElementById(PRESENTATION_VIMEO_ID);
  if (!(iframe instanceof HTMLIFrameElement)) {
    cached = null;
    return null;
  }
  if (cached?.iframe === iframe) return cached.player;
  cached = { iframe, player: new Player(iframe) };
  return cached.player;
}

async function applyPlaybackSound(soundOn: boolean) {
  const player = getPlayer();
  if (!player) return;
  await race(player.ready());
  if (soundOn) {
    await race(player.setMuted(false));
    try {
      await race(player.setVolume(1), 1000);
    } catch {
      // Mobile browsers ignore programmatic volume.
    }
    void player.play();
    return;
  }
  try {
    await race(player.setVolume(0), 1000);
  } catch {
    // Mobile volume is hardware-controlled; mute still applies.
  }
  await race(player.setMuted(true));
  // setMuted(true) can pause autoplay videos; keep the picture running silently.
  void player.play();
}

export function mutePresentationAudio() {
  soundListeners.forEach((listener) => listener(false));
  void applyPlaybackSound(false);
}

export function PresentationAudioButton() {
  const [soundOn, setSoundOn] = useState(false);
  const soundOnRef = useRef(false);

  useEffect(() => {
    const listener = (on: boolean) => {
      soundOnRef.current = on;
      setSoundOn(on);
    };
    soundListeners.add(listener);
    return () => {
      soundListeners.delete(listener);
    };
  }, []);

  const toggleSound = () => {
    const next = !soundOnRef.current;
    soundOnRef.current = next;
    setSoundOn(next);
    void applyPlaybackSound(next);
  };

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={soundOn}
      aria-label={soundOn ? "Silenciar audio" : "Activar audio"}
      className="inline-flex items-center gap-2 rounded-full border border-mem-blue/30 bg-mem-blue px-3 py-1.5 text-xs font-bold text-white shadow-md transition hover:bg-mem-blue-2 sm:px-4 sm:py-2 sm:text-sm"
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
