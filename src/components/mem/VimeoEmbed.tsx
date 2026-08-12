interface VimeoEmbedProps {
  videoId: string;
  title: string;
  className?: string;
  autoplay?: boolean;
}

/**
 * Responsive 16:9 Vimeo player using the exact embed params provided by the
 * product owner (autoplay + muted + loop, background-style playback).
 */
export function VimeoEmbed({ videoId, title, className = "", autoplay = true }: VimeoEmbedProps) {
  const src =
    `https://player.vimeo.com/video/${videoId}` +
    `?badge=0&autopause=0&player_id=0&app_id=58479` +
    `&autoplay=${autoplay ? 1 : 0}&muted=1&loop=1`;

  return (
    <div className={className} style={{ padding: "56.25% 0 0 0", position: "relative" }}>
      <iframe
        src={src}
        title={title}
        frameBorder={0}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
