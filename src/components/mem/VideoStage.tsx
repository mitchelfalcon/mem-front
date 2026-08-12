import type { CSSProperties, ReactNode } from "react";
import { VimeoEmbed } from "./VimeoEmbed";
import consoleBg from "../../assets/mem-console-bg.png";

// Provided by the product owner — do not change the video playback config.
const VideoContainerWrapperStyles: CSSProperties = {
  position: "relative",
  width: "100%",
  paddingTop: "56.25%", // 16:9 aspect ratio
  borderRadius: "15px",
  overflow: "hidden",
  backgroundColor: "#111111",
};

interface VideoStageProps {
  videoId: string;
  title: string;
  /** Background image rendered BEHIND the video (z-index 0). */
  backgroundSrc?: string;
  /** Overlay widgets rendered ON TOP of the video (z-index 20). */
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * Layered video stage. Paint order (bottom -> top):
 *   1. background image   (z-index: 0)
 *   2. background video   (z-index: 10)
 *   3. overlay components (z-index: 20)
 *
 * The video keeps its original playback configuration (see VimeoEmbed); this
 * component only arranges the stacking context around it.
 */
export function VideoStage({
  videoId,
  title,
  backgroundSrc = consoleBg,
  children,
  className = "",
  contentClassName = "",
}: VideoStageProps) {
  return (
    <div className={className} style={VideoContainerWrapperStyles}>
      {/* Layer 1 — background image */}
      <img
        src={backgroundSrc}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "15px",
          zIndex: 0,
        }}
      />

      {/* Layer 2 — background video */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
        <VimeoEmbed videoId={videoId} title={title} fill />
      </div>

      {/* Layer 3 — overlay components */}
      {children != null && (
        <div
          className={contentClassName}
          style={{ position: "absolute", inset: 0, zIndex: 20 }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
