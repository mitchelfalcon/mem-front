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
    <ConsoleLayout defaultSidebar="apps" bleed>
      {/* Immersive full-bleed video (100% width + full height).
          z-index: background image (0) -> video (10) -> cards (20+). */}
      <VideoStage
        videoId="1217019780"
        title="MEM Healthcare — animación de inicio"
        immersive
        contentClassName="h-full"
      >
        {/* Left legibility scrim (keeps overlays readable, video stays immersive) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/45 via-white/10 to-transparent" />

        {/* Scrollable overlay layer */}
        <div className="relative h-full w-full overflow-y-auto">
          {/* Top-left: doctor card (2x) + DOCTORES EN TURNO pill (offset to clear the floating sidebar) */}
          <div className="absolute left-[152px] top-6 flex max-w-[calc(100vw-176px)] flex-col items-start gap-6">
            <motion.div {...enter(0)} className="w-[min(90vw,520px)]">
              <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-8 shadow-[0_20px_50px_rgba(0,122,222,0.22)] backdrop-blur-xl">
                <div className="mb-6 flex items-center gap-5">
                  <img
                    src={drArmando}
                    alt="Dr. Armando Cárdenas"
                    className="h-28 w-28 rounded-full object-cover ring-4 ring-white shadow-md"
                  />
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/30">
                    <HeartPulse className="h-10 w-10 text-white" />
                  </span>
                </div>
                <p className="text-2xl font-extrabold tracking-wide text-mem-ink">DR ARMANDO CÁRDENAS</p>
                <p className="mb-6 text-base font-medium text-mem-gray">Médico en Turno</p>
                <button
                  type="button"
                  onClick={() => setSummaryOpen((v) => !v)}
                  className="btn-mem w-full justify-center py-4 text-lg"
                  aria-expanded={summaryOpen}
                >
                  <Sparkles className="h-6 w-6" />
                  Quick Summary
                </button>

                <AnimatePresence initial={false}>
                  {summaryOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-5 space-y-3 overflow-hidden"
                    >
                      {SUMMARY.map((s) => (
                        <div key={s.label} className="flex items-center justify-between border-t border-slate-100 pt-3">
                          <span className="text-base text-mem-gray">{s.label}</span>
                          <span className={`text-3xl font-extrabold ${s.tone}`}>{s.value}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div {...enter(0.1)}>
              <button className="inline-flex items-center gap-3 rounded-full bg-mem-lime px-8 py-3 text-base font-extrabold uppercase tracking-wide text-mem-ink shadow-md transition-transform hover:scale-105">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mem-ink/80 text-xs text-mem-lime">✦</span>
                Doctores en turno
                <ChevronRight className="h-6 w-6" />
              </button>
            </motion.div>
          </div>

          {/* Bottom-left: doctor avatars (3x bigger, offset to clear the floating sidebar) */}
          <motion.div
            {...enter(0.2)}
            className="absolute bottom-6 left-[152px] w-[min(56vw,900px)]"
          >
            <img src={doctoresTurno} alt="Doctores en turno" className="w-full select-none object-contain" loading="lazy" />
          </motion.div>

          {/* Bottom-right: Reset & Relax */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="absolute bottom-6 right-6 z-30 w-[min(38vw,440px)] overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a1f4d]/95 via-[#123a7a]/95 to-[#0a1f4d]/95 p-8 shadow-2xl backdrop-blur-md"
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
        </div>
      </VideoStage>
    </ConsoleLayout>
  );
}
