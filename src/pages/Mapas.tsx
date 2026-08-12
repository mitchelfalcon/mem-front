import { motion } from "motion/react";
import { Menu, ChevronDown, ShieldAlert, Download, Boxes, Thermometer, MapPin } from "lucide-react";
import { ConsoleLayout } from "../components/mem/ConsoleLayout";
import { VideoStage } from "../components/mem/VideoStage";

function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-2.5 shadow-sm backdrop-blur-xl">
      <span className="font-mono text-xs font-semibold text-slate-500">06.08.2026</span>

      <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700">
        <ShieldAlert className="h-3.5 w-3.5" />
        <span className="leading-none">
          BREAKDOWN
          <span className="ml-1 font-medium opacity-80">Service Zone</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
        <Menu className="h-4 w-4" />
      </button>

      <span className="zone-pill">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
          2
        </span>
        ZONA SUR · VIGILANCIA
        <span className="font-medium text-slate-500">21 Pacientes</span>
      </span>

      <span className="zone-pill ml-auto opacity-60">
        <MapPin className="h-3.5 w-3.5 text-blue-600" />
        ZONA NORTE · 900 CAMAS
      </span>
    </div>
  );
}

export function Mapas() {
  return (
    <ConsoleLayout defaultSidebar="analytics" toolbar={<Toolbar />}>
      <VideoStage
        videoId="1217019899"
        title="MEM Mapas — estados y logística médica"
        className="border border-white/70 shadow-[0_20px_50px_rgba(37,99,235,0.18)]"
      >
        {/* Layered: background image -> video -> overlays positioned on top */}

        {/* PROTOCOLOS ACTIVADOS card */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="absolute left-6 top-1/3 z-10 w-56 rounded-2xl border border-white/60 bg-blue-500/25 p-4 backdrop-blur-md"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <p className="text-xs font-extrabold uppercase tracking-wider text-mem-navy">
              Protocolos Activados
            </p>
          </div>
          <p className="text-[11px] leading-relaxed text-mem-navy/70">
            Vigilancia epidemiológica en 4 estados. Respuesta coordinada en tiempo real.
          </p>
        </motion.div>

        {/* COAHUILA DEFICIT pill */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="absolute right-8 top-1/4 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-mem-navy shadow-md"
        >
          <Thermometer className="h-3.5 w-3.5 text-rose-500" />
          COAHUILA DEFICIT · 36°C
        </motion.span>

        {/* ZONA NORTE checkbox */}
        <motion.label
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute right-10 top-1/2 z-10 inline-flex items-center gap-2 rounded-md bg-white/70 px-2 py-1 text-[11px] font-semibold text-mem-navy shadow-sm"
        >
          <input type="checkbox" defaultChecked className="accent-blue-600" />
          ZONA NORTE
        </motion.label>

        {/* LOGISTICA MEDICA panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="absolute bottom-6 left-6 z-10 w-72 rounded-2xl border border-white/60 bg-blue-500/20 p-3 backdrop-blur-md"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-mem-navy" />
              <span className="text-xs font-extrabold uppercase tracking-wide text-mem-navy">
                Logística Médica
              </span>
            </div>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              2
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
              2
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-mem-navy">ALBUFIN 20 MG PPX</p>
              <p className="text-[10px] text-slate-500">3.6 Mb</p>
            </div>
            <button className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white transition-transform hover:scale-110">
              <Download className="h-3 w-3" />
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-mem-navy transition-transform hover:scale-110">
              <ChevronDown className="h-3 w-3 -rotate-90" />
            </button>
          </div>
        </motion.div>
      </VideoStage>
    </ConsoleLayout>
  );
}
