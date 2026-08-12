import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, HeartPulse, Wind, ChevronRight } from "lucide-react";
import { ConsoleLayout } from "../components/mem/ConsoleLayout";
import { VideoStage } from "../components/mem/VideoStage";
import drArmando from "../assets/dr-armando.png";
import doctoresTurno from "../assets/doctores-turno.png";

const SUMMARY = [
  { label: "Pacientes en turno", value: "24", tone: "text-mem-blue" },
  { label: "Alertas críticas", value: "3", tone: "text-rose-600" },
  { label: "Camas disponibles", value: "12", tone: "text-emerald-600" },
];

const MOODS = ["😌 Tranquilo", "🙂 Estable", "😐 Neutral", "😓 Cansado"];

export function Home() {
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [mood, setMood] = useState<number | null>(null);

  return (
    <ConsoleLayout defaultSidebar="apps">
      <VideoStage
        videoId="1217019780"
        title="MEM Healthcare — animación de inicio"
        className="h-full min-h-[560px] border border-white/70 shadow-[0_20px_50px_rgba(0,122,222,0.15)]"
        contentClassName="h-full"
      >
        {/* Legibility scrim over the video */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/72 via-white/60 to-blue-50/55" />

        <div className="relative flex h-full flex-col gap-4 overflow-y-auto p-4 sm:p-6">
          {/* Doctor card */}
          <div className="w-full max-w-[280px]">
            <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-4 shadow-[0_12px_30px_rgba(0,122,222,0.16)] backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={drArmando}
                  alt="Dr. Armando Cárdenas"
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow"
                />
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/30">
                  <HeartPulse className="h-6 w-6 text-white" />
                </span>
              </div>
              <p className="text-sm font-extrabold tracking-wide text-mem-ink">DR ARMANDO CÁRDENAS</p>
              <p className="mb-4 text-xs font-medium text-mem-gray">Médico en Turno</p>
              <button type="button" onClick={() => setSummaryOpen((v) => !v)} className="btn-mem w-full justify-center" aria-expanded={summaryOpen}>
                <Sparkles className="h-4 w-4" />
                Quick Summary
              </button>

              <AnimatePresence initial={false}>
                {summaryOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-2 overflow-hidden"
                  >
                    {SUMMARY.map((s) => (
                      <div key={s.label} className="flex items-center justify-between border-t border-slate-100 pt-2">
                        <span className="text-xs text-mem-gray">{s.label}</span>
                        <span className={`text-base font-extrabold ${s.tone}`}>{s.value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Reset & Relax banner */}
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a1f4d] via-[#123a7a] to-[#0a1f4d] p-5 shadow-xl">
            <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-mem-blue/30 blur-2xl" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="flex items-center gap-2 text-xl font-extrabold text-white">
                  <Wind className="h-5 w-5 text-sky-300" /> Reset &amp; Relax
                </h3>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-200/80">
                  Take a moment to unwind and recharge with guided meditation, breathing exercises, and mindfulness tips.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMood((m) => (m === null ? 0 : (m + 1) % MOODS.length))}
                className="shrink-0 whitespace-nowrap rounded-lg bg-white/90 px-4 py-2 text-xs font-bold text-mem-ink shadow-sm transition-transform hover:scale-105 active:scale-95"
              >
                {mood === null ? "Track my mood" : MOODS[mood]}
              </button>
            </div>
          </div>

          {/* Doctores en turno */}
          <div className="mt-auto">
            <button className="mb-2 inline-flex items-center gap-2 rounded-full bg-mem-lime px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-mem-ink shadow-sm transition-transform hover:scale-105">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-mem-ink/80 text-[9px] text-mem-lime">✦</span>
              Doctores en turno
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <img
              src={doctoresTurno}
              alt="Doctores en turno"
              className="w-full max-w-3xl select-none object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </VideoStage>
    </ConsoleLayout>
  );
}
