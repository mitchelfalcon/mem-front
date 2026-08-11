import { useRef, useEffect } from "react";

const LOG_ENTRIES = [
  { time: "14:23:07", level: "INFO", msg: "AWU_Ledger sync complete — 342 invoices reconciled" },
  { time: "14:23:05", level: "WARN", msg: "NLP confidence 91.2% — threshold approaching veto floor" },
  { time: "14:22:58", level: "INFO", msg: "Facturación: ROI computed at 34.2% margin Q4" },
  { time: "14:22:51", level: "INFO", msg: "Casos: 3 high-priority tickets escalated to Tier 2" },
  { time: "14:22:44", level: "OK",   msg: "Voice intent matched: 'mostrar ledger Q4' — 96.8% conf" },
  { time: "14:22:38", level: "INFO", msg: "Actividades: sprint velocity 34sp — on target" },
  { time: "14:22:31", level: "WARN", msg: "Ledger AR Days drift detected: 18 → 21 trending up" },
  { time: "14:22:24", level: "INFO", msg: "Network topology stable — 10 connections active" },
  { time: "14:22:17", level: "OK",   msg: "Q4 revenue target 86% — tracking above goal" },
  { time: "14:22:10", level: "INFO", msg: "Voz channel ready — awaiting input on port 8443" },
];

const LEVEL_COLOR: Record<string, string> = {
  INFO: "#38bdf8", // Blue/Info
  WARN: "#f59e0b", // Yellow/Orange
  OK:   "#10b981", // Green
  ERR:  "#ef4444", // Red
  ERROR: "#ef4444"
};

export function HudLedger() {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    let x = 0;
    let raf: number;
    const tick = () => {
      x -= 0.55;
      if (-x >= el.scrollWidth / 2) x = 0;
      el.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const doubled = [...LOG_ENTRIES, ...LOG_ENTRIES];

  return (
    <div
      className="w-full overflow-hidden flex items-center transition-all duration-300"
      style={{
        height: 34,
        background: "#000000", // Solid black background
        borderBottom: "1px solid rgba(37, 99, 235, 0.4)",
        fontFamily: "'Segoe UI', -apple-system, sans-serif",
      }}
    >
      {/* Fixed label */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-4 h-full"
        style={{ background: "#000000", borderRight: "1px solid rgba(37, 99, 235, 0.5)" }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#2563eb", boxShadow: "0 0 8px #2563eb", animation: "pulse 2s ease-in-out infinite" }}
        />
        <span className="text-[10px] font-black tracking-[0.18em]" style={{ color: "#2563eb", textShadow: "0 0 4px rgba(37, 99, 235, 0.3)" }}>
          AWU_LEDGER
        </span>
      </div>

      {/* Ticker */}
      <div className="flex-1 overflow-hidden relative" style={{ height: "100%" }}>
        <div
          ref={innerRef}
          className="flex items-center gap-0 whitespace-nowrap absolute inset-y-0 left-0"
          style={{ willChange: "transform" }}
        >
          {doubled.map((entry, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-4 text-[11px]">
              <span style={{ color: "#64748b" }}>{entry.time}</span>
              <span style={{ color: LEVEL_COLOR[entry.level] || "#ffffff", fontWeight: "bold" }}>[{entry.level}]</span>
              <span style={{ color: "#ffffff" }}>{entry.msg}</span>
              <span style={{ color: "rgba(255, 255, 255, 0.15)", margin: "0 8px" }}>┃</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
