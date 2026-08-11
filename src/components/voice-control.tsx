import { motion } from "motion/react";
import { MicOff } from "lucide-react";
import { CustomMicVoiceIcon } from "./custom-voice-icon";

export type VoiceState = "idle" | "listening" | "processing" | "responding";

interface VoiceControlProps {
  state: VoiceState;
  onToggle: () => void;
  confidence: number;
}

const BAR_COUNT = 22;

function getBarHeight(index: number, state: VoiceState): string {
  if (state === "idle") return "3px";
  const phase = (index / BAR_COUNT) * Math.PI * 2;
  if (state === "listening") {
    return `${5 + Math.abs(Math.sin(phase)) * 26}px`;
  }
  if (state === "processing") {
    return `${8 + Math.abs(Math.sin(phase + Math.PI / 4)) * 22}px`;
  }
  // responding
  return `${6 + Math.abs(Math.sin(phase * 0.7)) * 20}px`;
}

function getBarAlt(index: number, state: VoiceState): string {
  if (state === "idle") return "3px";
  const phase = (index / BAR_COUNT) * Math.PI * 2;
  if (state === "listening") {
    return `${5 + Math.abs(Math.sin(phase + Math.PI)) * 26}px`;
  }
  if (state === "processing") {
    return `${8 + Math.abs(Math.sin(phase + Math.PI * 1.25)) * 22}px`;
  }
  return `${6 + Math.abs(Math.sin(phase * 0.7 + Math.PI)) * 20}px`;
}

const STATE_LABELS: Record<VoiceState, string> = {
  idle: "STANDBY",
  listening: "LISTENING",
  processing: "PROCESSING",
  responding: "RESPONDING",
};

const STATE_COLORS: Record<VoiceState, string> = {
  idle: "#4a7268",
  listening: "#00ffa3",
  processing: "#f59e0b",
  responding: "#06b6d4",
};

export function VoiceControl({ state, onToggle, confidence }: VoiceControlProps) {
  const isActive = state !== "idle";
  const stateColor = STATE_COLORS[state];

  return (
    <div
      className="p-4 rounded-2xl space-y-3"
      style={{
        background: "rgba(4,20,15,0.82)",
        border: "1px solid rgba(0,255,163,0.12)",
        fontFamily: "'Segoe UI', -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.16em]" style={{ color: "#4a7268" }}>
          Voice Control
        </span>
        <span className="text-[10px] font-bold" style={{ color: stateColor, letterSpacing: "0.12em" }}>
          {STATE_LABELS[state]}
        </span>
      </div>

      {/* Waveform */}
      <div className="flex items-center justify-center gap-[2px]" style={{ height: 36 }}>
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{ width: 2.5, background: stateColor }}
            animate={{
              height: [getBarHeight(i, state), getBarAlt(i, state), getBarHeight(i, state)],
              opacity: isActive ? [0.7, 1, 0.7] : [0.3],
            }}
            transition={{
              duration: state === "processing" ? 0.7 : state === "listening" ? 0.9 : 1.2,
              delay: (i / BAR_COUNT) * (state === "processing" ? 0.3 : 0.5),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Mic + confidence */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={onToggle}
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full transition-all"
          style={
            isActive
              ? { background: stateColor, color: "#0d2b22", boxShadow: `0 0 18px ${stateColor}60` }
              : { background: "rgba(0,255,163,0.08)", color: "#4a7268", border: "1px solid rgba(0,255,163,0.18)" }
          }
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          {isActive ? <CustomMicVoiceIcon className="w-4.5 h-4.5" /> : <MicOff className="w-4 h-4" />}
        </motion.button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between mb-1">
            <span className="text-[10px]" style={{ color: "#4a7268" }}>NLP Confidence</span>
            <span
              className="text-[10px] font-bold"
              style={{
                color: confidence >= 94 ? "#00ffa3" : "#f59e0b",
                fontFamily: "'Segoe UI', -apple-system, sans-serif",
              }}
            >
              {confidence}%
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(0,255,163,0.08)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: confidence >= 94 ? "#00ffa3" : "#f59e0b" }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
