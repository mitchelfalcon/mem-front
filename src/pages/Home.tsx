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
      {/* Full-width two-area layout: fixed LEFT column + RIGHT video area */}
      <div className="flex h-full w-full flex-col gap-6 overflow-y-auto lg:flex-row lg:items-stretch lg:overflow-visible">
        {/* ── LEFT column (left-aligned, stacked) ── */}
        <div className="flex w-full flex-col items-start gap-6 lg:w-[480px] lg:shrink-0">
          {/* Doctor profile card */}
          <motion.div {...enter(0)} className="w-full max-w-[460px]">
            <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_16px_40px_rgba(0,122,222,0.18)] backdrop-blur-xl">
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
                      <div key={s.label} className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                        <span className="text-sm text-mem-gray">{s.label}</span>
                        <span className={`text-xl font-extrabold ${s.tone}`}>{s.value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* DOCTORES EN TURNO pill (2x bigger) */}
          <motion.div {...enter(0.1)}>
            <button className="inline-flex items-center gap-3 rounded-full bg-mem-lime px-8 py-3 text-base font-extrabold uppercase tracking-wide text-mem-ink shadow-md transition-transform hover:scale-105">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mem-ink/80 text-xs text-mem-lime">✦</span>
              Doctores en turno
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>

          {/* Doctor avatars (2x bigger) */}
          <motion.div {...enter(0.2)} className="w-full">
            <img
              src={doctoresTurno}
              alt="Doctores en turno"
              className="w-full max-w-none select-none object-contain"
              loading="lazy"
            />
          </motion.div>
        </div>

        {/* ── RIGHT video area (right-aligned) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative flex min-h-0 flex-1 items-start justify-end"
        >
          {/* z-index: background image (0) -> video (10) inside VideoStage */}
          <VideoStage
            videoId="1217019780"
            title="MEM Healthcare — animación de inicio"
            className="w-full border border-white/70 shadow-[0_20px_50px_rgba(0,122,222,0.18)]"
          />

          {/* Reset & Relax — top-right corner, 50% bigger, overlapping the video (z-index 30) */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="absolute right-4 top-4 z-30 w-[min(92%,480px)] overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a1f4d]/95 via-[#123a7a]/95 to-[#0a1f4d]/95 p-8 shadow-2xl backdrop-blur-md"
          >
            <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-mem-blue/30 blur-2xl" />
            <div className="relative">
              <h3 className="flex items-center gap-3 text-3xl font-extrabold text-white">
                <Wind className="h-8 w-8 text-sky-300" /> Reset &amp; Relax
              </h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-slate-200/85">
                Take a moment to unwind and recharge with guided meditation, breathing exercises, and mindfulness tips.
              </p>
              <button
                type="button"
                onClick={() => setMood((m) => (m === null ? 0 : (m + 1) % MOODS.length))}
                className="mt-5 rounded-xl bg-white/90 px-6 py-3 text-base font-bold text-mem-ink shadow-sm transition-transform hover:scale-105 active:scale-95"
              >
                {mood === null ? "Track my mood" : MOODS[mood]}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </ConsoleLayout>
  );
}
