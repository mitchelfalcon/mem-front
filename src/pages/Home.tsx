import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, UserPlus, Activity, BellRing, FileText, HeartPulse } from "lucide-react";
import { ConsoleLayout } from "../components/mem/ConsoleLayout";
import { VimeoEmbed } from "../components/mem/VimeoEmbed";

const QUICK_ACTIONS = [
  { id: "patient", label: "Nuevo Paciente", icon: UserPlus, hint: "Registro clínico creado" },
  { id: "telemetry", label: "Telemetría", icon: Activity, hint: "Stream de signos vitales activo" },
  { id: "alerts", label: "Alertas", icon: BellRing, hint: "3 alertas priorizadas" },
  { id: "record", label: "Expediente", icon: FileText, hint: "Expediente electrónico abierto" },
];

const SUMMARY = [
  { label: "Pacientes en turno", value: "24", tone: "text-blue-600" },
  { label: "Alertas críticas", value: "3", tone: "text-rose-600" },
  { label: "Camas disponibles", value: "12", tone: "text-emerald-600" },
];

export function Home() {
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const activeHint = QUICK_ACTIONS.find((a) => a.id === activeAction)?.hint;

  return (
    <ConsoleLayout defaultSidebar="apps">
      <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Left column: workable controls */}
        <div className="flex flex-col gap-4">
          {/* Doctor profile card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#dfe7ff] via-[#e7e0ff] to-[#f2ecff] p-4 shadow-[0_12px_30px_rgba(79,70,229,0.18)]">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-400/30 blur-2xl" />
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 shadow">
                <HeartPulse className="h-6 w-6 text-[#4f46e5]" />
              </div>
            </div>
            <p className="text-sm font-extrabold tracking-wide text-mem-navy">DR ARMANDO CARDENAS</p>
            <p className="mb-4 text-xs font-medium text-slate-500">Médico en Turno</p>
            <button
              type="button"
              onClick={() => setSummaryOpen((v) => !v)}
              className="btn-mem"
              aria-expanded={summaryOpen}
            >
              <Sparkles className="h-4 w-4" />
              Quick Summary
            </button>
          </div>

          {/* Quick Summary panel (toggled by the button above) */}
          <AnimatePresence initial={false}>
            {summaryOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="card-glass overflow-hidden p-4"
              >
                <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Resumen del turno
                </p>
                <div className="space-y-2">
                  {SUMMARY.map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{s.label}</span>
                      <span className={`text-lg font-extrabold ${s.tone}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Workable quick-action buttons */}
          <div className="card-glass p-3">
            <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Acciones rápidas
            </p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveAction(id)}
                  aria-pressed={activeAction === id}
                  className={`flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all active:scale-95 ${
                    activeAction === id
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-slate-200 bg-white/60 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-semibold leading-tight">{label}</span>
                </button>
              ))}
            </div>
            <AnimatePresence>
              {activeHint && (
                <motion.p
                  key={activeHint}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 rounded-lg bg-mem-navy/5 px-3 py-2 text-xs font-medium text-mem-navy"
                >
                  {activeHint}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main video card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/40 shadow-[0_20px_50px_rgba(37,99,235,0.15)]">
          <VimeoEmbed videoId="1217019780" title="MEM Healthcare — animación de inicio" />

          {/* MEM Healthcare logo overlay */}
          <div className="pointer-events-none absolute bottom-4 left-5 z-10 flex items-center gap-2">
            <span className="mem-brand text-2xl drop-shadow">MEM</span>
            <span className="text-lg font-semibold text-mem-navy/80 drop-shadow">Healthcare</span>
          </div>

          {/* Animated EKG sine wave overlay */}
          <svg
            className="pointer-events-none absolute bottom-0 left-0 z-10 h-16 w-full"
            viewBox="0 0 1000 80"
            preserveAspectRatio="none"
          >
            <path
              className="ekg-path"
              d="M0,60 Q40,60 60,40 T120,60 T180,20 T240,60 T300,40 T360,60 T420,20 T480,60 T540,40 T600,60 T660,20 T720,60 T780,40 T840,60 T900,20 T960,60 T1020,40"
              fill="none"
              stroke="#2563eb"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </ConsoleLayout>
  );
}
