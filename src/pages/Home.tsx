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

// Shared entrance animation ("when they're in")
const enter = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Home() {
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [mood, setMood] = useState<number | null>(null);

  return (
    <ConsoleLayout defaultSidebar="apps">
      {/* Big video as the background layer (3x), cards overlaid on the left.
          Strict z-index: background image (0) -> video (10) -> cards (20). */}
      <VideoStage
        videoId="1217019780"
        title="MEM Healthcare — animación de inicio"
        className="h-full min-h-[600px] w-full border border-white/70 shadow-[0_20px_50px_rgba(0,122,222,0.18)]"
        contentClassName="h-full"
      >
        {/* Left legibility scrim so cards stay readable, video stays visible on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/25 to-transparent" />

        {/* Cards overlaid on the LEFT (z-index 20 layer) */}
        <div className="relative flex h-full max-w-[500px] flex-col justify-between gap-6 overflow-y-auto p-5 sm:p-6">
          {/* Doctor card (bigger + translucent) */}
          <motion.div {...enter(0)} className="w-full max-w-[460px]">
            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_16px_40px_rgba(0,122,222,0.18)] backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-4">
                <img
                  src={drArmando}
                  alt="Dr. Armando Cárdenas"
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md"
                />
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/30">
                  <HeartPulse className="h-8 w-8 text-white" />
                </span>
              </div>
              <p className="text-lg font-extrabold tracking-wide text-mem-ink">DR ARMANDO CÁRDENAS</p>
              <p className="mb-5 text-sm font-medium text-mem-gray">Médico en Turno</p>
              <button
                type="button"
                onClick={() => setSummaryOpen((v) => !v)}
                className="btn-mem w-full justify-center py-3 text-base"
                aria-expanded={summaryOpen}
              >
                <Sparkles className="h-5 w-5" />
                Quick Summary
              </button>

              <AnimatePresence initial={false}>
                {summaryOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-2.5 overflow-hidden"
                  >
                    {SUMMARY.map((s) => (
                      <div key={s.label} className="flex items-center justify-between border-t border-white/50 pt-2.5">
                        <span className="text-sm text-mem-gray">{s.label}</span>
                        <span className={`text-xl font-extrabold ${s.tone}`}>{s.value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Reset & Relax banner (bigger + translucent) */}
          <motion.div
            {...enter(0.12)}
            className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a1f4d]/90 via-[#123a7a]/90 to-[#0a1f4d]/90 p-7 shadow-xl backdrop-blur-md"
          >
            <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-mem-blue/30 blur-2xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="flex items-center gap-2 text-2xl font-extrabold text-white">
                  <Wind className="h-6 w-6 text-sky-300" /> Reset &amp; Relax
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-200/85">
                  Take a moment to unwind and recharge with guided meditation, breathing exercises, and mindfulness tips.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMood((m) => (m === null ? 0 : (m + 1) % MOODS.length))}
                className="shrink-0 whitespace-nowrap rounded-xl bg-white/90 px-5 py-2.5 text-sm font-bold text-mem-ink shadow-sm transition-transform hover:scale-105 active:scale-95"
              >
                {mood === null ? "Track my mood" : MOODS[mood]}
              </button>
            </div>
          </motion.div>

          {/* Doctores en turno */}
          <motion.div {...enter(0.24)}>
            <button className="mb-3 inline-flex items-center gap-2 rounded-full bg-mem-lime px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-mem-ink shadow-sm transition-transform hover:scale-105">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-mem-ink/80 text-[9px] text-mem-lime">✦</span>
              Doctores en turno
              <ChevronRight className="h-4 w-4" />
            </button>
            <img src={doctoresTurno} alt="Doctores en turno" className="w-full max-w-md select-none object-contain" loading="lazy" />
          </motion.div>
        </div>
      </VideoStage>
    </ConsoleLayout>
  );
}
