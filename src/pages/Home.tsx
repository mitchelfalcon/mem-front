import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, HeartPulse, ChevronRight } from "lucide-react";
import { ConsoleLayout } from "../components/mem/ConsoleLayout";
import { VideoStage } from "../components/mem/VideoStage";
import { CalendarCard } from "../components/mem/CalendarCard";
import drArmando from "../assets/dr-armando.png";
import doctoresTurno from "../assets/doctores-turno.png";
import resetRelax from "../assets/reset-relax.png";

// Doctor-card background gradient (matches the Figma card fill).
const CARD_GRADIENT = "radial-gradient(120% 120% at 50% 42%, #9fb0ec 0%, #bcc7f2 46%, #dee5fb 100%)";

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
  const [summaryOpen, setSummaryOpen] = useState(false);
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

        {/* Symmetric 50/50 split — no absolute positioning, so no overlaps */}
        <div className="grid h-full w-full grid-cols-1 gap-6 overflow-y-auto p-6 pl-[128px] lg:grid-cols-2">
          {/* ── LEFT column: doctor card -> calendar -> pill -> doctor avatars (stacked) ── */}
          <div className="flex min-w-0 flex-col items-start gap-4">
              {/* Doctor card */}
              <motion.div {...enter(0)} className="w-[min(90%,340px)]">
                <div
                  className="relative h-full overflow-hidden rounded-3xl border border-white/70 p-4 shadow-[0_16px_40px_rgba(0,122,222,0.22)]"
                  style={{ background: CARD_GRADIENT }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <img
                      src={drArmando}
                      alt="Dr. Armando Cárdenas"
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/30">
                      <HeartPulse className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <p className="text-sm font-extrabold tracking-wide text-mem-ink">DR ARMANDO CÁRDENAS</p>
                  <p className="mb-3 text-xs font-medium text-mem-gray">Médico en Turno</p>
                  <button
                    type="button"
                    onClick={() => setSummaryOpen((v) => !v)}
                    className="btn-mem w-full justify-center py-2 text-sm"
                    aria-expanded={summaryOpen}
                  >
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
                          <div key={s.label} className="flex items-center justify-between border-t border-white/40 pt-2">
                            <span className="text-xs font-medium text-mem-navy/80">{s.label}</span>
                            <span className={`text-lg font-extrabold ${s.tone}`}>{s.value}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

            {/* Calendar — below the doctor card (same size) */}
            <motion.div {...enter(0.1)} className="w-[min(90%,340px)]">
              <CalendarCard />
            </motion.div>

            {/* DOCTORES EN TURNO pill — below the cards */}
            <motion.div {...enter(0.15)}>
              <button className="inline-flex items-center gap-3 rounded-full bg-mem-lime px-6 py-2.5 text-sm font-extrabold uppercase tracking-wide text-mem-ink shadow-md transition-transform hover:scale-105">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mem-ink/80 text-[10px] text-mem-lime">✦</span>
                Doctores en turno
                <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>

            {/* Doctor avatars — directly below the pill, within the left column */}
            <motion.div {...enter(0.2)} className="w-full">
              <img src={doctoresTurno} alt="Doctores en turno" className="w-full select-none object-contain" loading="lazy" />
            </motion.div>
          </div>

          {/* ── RIGHT column: Reset & Relax (smaller) pinned bottom-right ── */}
          <div className="flex min-w-0 flex-col items-end justify-end">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="relative w-[min(100%,880px)]"
            >
              <img
                src={resetRelax}
                alt="Reset & Relax — take a moment to unwind and recharge"
                className="w-full select-none rounded-2xl shadow-2xl"
              />
              {/* Transparent hit-area over the baked "Track my mood" button */}
              <button
                type="button"
                aria-label="Track my mood"
                onClick={() => setMood((m) => (m === null ? 0 : (m + 1) % MOODS.length))}
                className="absolute left-[68%] top-[29%] h-[42%] w-[26%]"
              >
                {mood !== null && (
                  <span className="flex h-full w-full items-center justify-center rounded-lg bg-white text-[12px] font-bold text-mem-ink shadow">
                    {MOODS[mood]}
                  </span>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </VideoStage>
    </ConsoleLayout>
  );
}
