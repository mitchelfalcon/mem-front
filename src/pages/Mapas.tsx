import { motion } from "motion/react";
import {
  ChevronDown,
  Menu,
  Download,
  Filter,
  BedDouble,
  Thermometer,
  ShieldAlert,
  FileText,
  Boxes,
  Sun,
  ChevronRight,
} from "lucide-react";
import { ConsoleLayout } from "../components/mem/ConsoleLayout";
import { VideoStage } from "../components/mem/VideoStage";
import dnaHelix from "../assets/dna-helix.png";

const MEDS = [
  { name: "Albufin", dose: "20mg", indent: 0 },
  { name: "Vitamin D", dose: "100mg", indent: 1 },
  { name: "Omega 3", dose: "500mg", indent: 2 },
  { name: "Ibuprofen", dose: "75mg", indent: 3 },
  { name: "Aspirin", dose: "100mg", indent: 0 },
];

const LOGISTICA = [
  { n: "2", name: "ALBUFIN 20 MG PPX", size: "3.6 Mb" },
  { n: "2", name: "VITAMIN D", size: "3.6 Mb" },
];

/** Download + arrow action buttons (blue circle + yellow circle). */
function Actions() {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mem-blue text-white">
        <Download className="h-3.5 w-3.5" />
      </span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mem-lime text-mem-ink">
        <ChevronRight className="h-4 w-4" />
      </span>
    </span>
  );
}

function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/60 bg-indigo-200/45 px-3 py-2 text-mem-navy shadow-sm backdrop-blur-md sm:gap-3 sm:px-4 sm:py-3">
      <div className="flex items-center gap-2 pr-1">
        <div className="leading-tight">
          <p className="text-[11px] font-semibold uppercase text-slate-400">Interval</p>
          <p className="text-xs font-bold">Last Min</p>
        </div>
        <span className="font-mono text-sm font-extrabold sm:text-base">06.08.2026</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </div>
      <ChevronRight className="hidden h-5 w-5 text-slate-400 sm:block" />

      <button className="inline-flex items-center gap-2 rounded-lg bg-mem-blue px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-mem-blue-2 sm:px-4 sm:text-sm">
        <ShieldAlert className="h-4 w-4" />
        <span className="leading-none text-left">
          BREAKDOWN
          <span className="ml-1 hidden font-medium opacity-80 sm:inline">Service Zone</span>
        </span>
      </button>

      <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
        <Menu className="h-5 w-5" />
      </button>

      <span className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold sm:inline-flex">
        <Filter className="h-4 w-4 text-mem-blue" />
        <span className="leading-tight text-left">
          FILTER STATE 1
          <span className="block font-medium text-slate-400">State 1 Region 2</span>
        </span>
      </span>

      <span className="zone-pill text-xs sm:text-sm">
        <BedDouble className="h-4 w-4 text-mem-blue" />
        <span className="sm:hidden">CAMAS MX</span>
        <span className="hidden sm:inline">CAMAS DISPONIBLES MÉXICO</span>
      </span>

      <span className="inline-flex w-full items-center justify-between gap-3 rounded-full bg-white/90 px-3 py-2 text-xs font-bold shadow-sm sm:ml-auto sm:w-auto sm:px-4 sm:text-sm">
        ZONA NORTE
        <span className="text-slate-400">4.</span> 500 CAMAS
        <Actions />
      </span>
    </div>
  );
}

export function Mapas() {
  return (
    <ConsoleLayout defaultSidebar="map" bleed>
      {/* Immersive full-bleed map video; z-index: bg image (0) -> video (10) -> overlays (20) */}
      <VideoStage
        videoId="1217019899"
        title="MEM Mapas — estados y logística médica"
        immersive
        contentClassName="h-full"
      >
        {/* DNA helix (decorative) — desktop only, over the cards, right side */}
        <img
          src={dnaHelix}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-[130px] z-30 hidden w-[min(30vw,440px)] rotate-90 select-none opacity-90 xl:block"
        />

        <div className="relative z-20 flex h-full flex-col gap-3 overflow-y-auto overflow-x-hidden pt-3 pr-3 pb-4 pl-sidebar sm:gap-4 sm:pt-4 sm:pr-4 xl:block xl:overflow-hidden xl:p-0 xl:pl-0">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="z-20 xl:absolute xl:left-[128px] xl:right-4 xl:top-3"
        >
          <Toolbar />
        </motion.div>

        {/* MEDICACION TOP pill */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="z-20 xl:absolute xl:left-[144px] xl:top-[102px]"
        >
          <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/60 bg-indigo-200/50 px-3 py-1.5 text-xs font-bold text-mem-navy shadow-sm backdrop-blur-md sm:px-4 sm:text-sm">
            <span className="text-slate-500">1.</span> MEDICACION TOP
            <span className="font-medium text-slate-400">3.6 Mb</span>
          </span>
        </motion.div>

        {/* Medication list card */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="z-20 flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/60 bg-indigo-200/40 p-3 shadow-md backdrop-blur-md sm:p-4 xl:absolute xl:left-[144px] xl:top-[146px] xl:w-[400px]"
        >
          <div className="min-w-0 flex-1 space-y-2">
            {MEDS.map((m) => (
              <div key={m.name} style={{ marginLeft: Math.min(m.indent, 2) * 12 }}>
                <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-mem-navy px-3 py-1.5 text-xs font-bold text-white">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-mem-lime" />
                  {m.name}
                  <span className="font-medium text-slate-300">{m.dose}</span>
                  <span className="flex h-5 items-center rounded-full bg-white/20 px-1.5 text-[9px]">
                    <Sun className="h-3 w-3" />
                  </span>
                </span>
              </div>
            ))}
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mem-lime text-mem-ink">
            <ChevronRight className="h-5 w-5" />
          </span>
        </motion.div>

        {/* Clinic Visit Appointment card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="z-20 w-full max-w-sm rounded-2xl border border-white/20 bg-gradient-to-br from-[#0a1f4d]/55 to-[#123a7a]/55 p-4 shadow-xl backdrop-blur-md sm:p-6 xl:absolute xl:left-[144px] xl:top-[420px] xl:w-80"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mem-lime">
              <FileText className="h-5 w-5 text-mem-ink" />
            </span>
            <span className="text-sm font-medium text-slate-300">31 May '26</span>
          </div>
          <p className="text-lg font-extrabold leading-tight text-white sm:text-xl">Clinic Visit Appointment</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-mem-blue to-mem-purple text-xs font-bold text-white">
              SR
            </span>
            <span className="text-sm font-medium text-slate-200">Dr. Shilpa Rao</span>
          </div>
        </motion.div>

        {/* COAHUILA DEFICIT pill (center) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="z-20 xl:absolute xl:left-1/2 xl:top-[150px] xl:-translate-x-1/2"
        >
          <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/60 bg-indigo-200/50 px-3 py-2 text-sm font-bold text-mem-navy shadow-md backdrop-blur-md sm:gap-3 sm:px-4 sm:py-2.5 sm:text-base">
            <span className="text-slate-500">1.</span>
            <Thermometer className="h-4 w-4 text-rose-500" />
            COAHUILA DEFICIT · 36°C
            <Actions />
          </span>
        </motion.div>

        {/* Latest Diagnose (yellow card, top-right) */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="z-20 w-full max-w-lg rounded-2xl border border-white/40 bg-mem-lime/75 p-4 shadow-xl backdrop-blur-md sm:p-6 xl:absolute xl:right-4 xl:top-[104px] xl:w-[420px]"
        >
          <p className="text-lg font-extrabold text-mem-ink sm:text-xl">Latest Diagnose : Arrhythmias</p>
          <p className="mt-3 text-3xl font-extrabold text-mem-ink sm:text-4xl">8</p>
          <p className="text-sm font-bold uppercase text-mem-ink/70">Visits</p>
          <div className="mt-3 flex flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-sm leading-tight text-mem-ink/70">
              You can see the last report <span className="font-bold underline">here</span>
            </p>
            <button className="whitespace-nowrap rounded-lg bg-mem-navy px-4 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105">
              Patient's Detail
            </button>
          </div>
        </motion.div>

        {/* ZONA NORTE panel (right) */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="z-20 w-full max-w-sm rounded-2xl border border-white/60 bg-indigo-200/40 p-4 shadow-lg backdrop-blur-md sm:p-6 xl:absolute xl:right-[220px] xl:top-[300px] xl:w-80"
        >
          <div className="mb-3 flex items-center gap-2">
            <p className="text-xl font-extrabold text-mem-blue">ZONA NORTE</p>
            <span className="h-2.5 w-2.5 rounded-full bg-mem-blue" />
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          </div>
          <ul className="space-y-2 text-sm font-semibold text-mem-blue">
            <li>Coahuila <span className="text-mem-navy">12 Disponibles</span></li>
            <li>Nuevo León <span className="text-mem-navy">58 Disponibles</span></li>
            <li>Chihuahua <span className="text-mem-navy">45 Disponibles</span></li>
          </ul>
        </motion.div>

        {/* LOGISTICA MEDICACION (bottom-left) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="z-20 w-full max-w-lg rounded-2xl border border-white/60 bg-indigo-200/40 p-4 shadow-lg backdrop-blur-md xl:absolute xl:bottom-4 xl:left-[128px] xl:w-[460px]"
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Boxes className="h-5 w-5 text-mem-navy" />
            <span className="text-sm font-extrabold uppercase tracking-wide text-mem-navy">Logística Medicación</span>
            <span className="flex h-6 items-center gap-1 rounded-full bg-white/70 px-2 text-xs font-bold text-mem-navy">
              <Sun className="h-3.5 w-3.5" /> 2
            </span>
          </div>
          <div className="space-y-2">
            {LOGISTICA.map((l) => (
              <div key={l.name} className="flex min-w-0 items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow-sm sm:gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">{l.n}</span>
                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-mem-navy">{l.name}</p>
                <span className="hidden text-xs text-slate-500 sm:inline">{l.size}</span>
                <Actions />
              </div>
            ))}
          </div>
          <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-mem-navy">
            ZONA SUR · VIGILANCIA <span className="font-medium text-slate-500">21 Pacientes</span>
          </div>
        </motion.div>

        {/* Ultimos Diagnosticos Epidemiologicos (bottom-right) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="z-20 w-full rounded-2xl border border-white/60 bg-indigo-200/40 p-4 shadow-lg backdrop-blur-md sm:p-5 xl:absolute xl:bottom-4 xl:right-4 xl:w-[min(48vw,620px)]"
        >
          <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm font-extrabold uppercase tracking-wide text-mem-navy">
              Últimos Diagnósticos Epidemiológicos
            </p>
            <span className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-mem-navy">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-mem-blue to-mem-purple text-[10px] text-white">KM</span>
              Karen McBeth <span className="font-medium text-slate-500">3.6 Mb</span>
              <Actions />
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 text-xs text-mem-navy/80 sm:grid-cols-2">
            <div>
              <p className="text-lg font-extrabold text-mem-navy">28 Pacientes Activos</p>
              <p className="mt-1.5 leading-relaxed">
                Predominancia enfermedades respiratorias causadas por entrada de extranjeros en la zona norte.
              </p>
              <div className="mt-2.5 inline-flex flex-wrap items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 font-bold">
                Coahuila <span className="text-rose-600">RIESGO</span>
                <span className="text-slate-500">5. Pocas Camas</span>
                <Actions />
              </div>
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase text-mem-navy">Otros Vectores de Riesgo</p>
              <p className="mt-1.5">Enfermedades de transmisión sexual</p>
              <p className="mt-2.5 font-bold">JALISCO <span className="text-amber-600">RIESGO</span></p>
              <p className="mt-1.5 font-bold">BAJA CALIFORNIA <span className="text-rose-600">NORTE RIESGO</span></p>
              <div className="mt-2 flex justify-end"><Actions /></div>
            </div>
          </div>
        </motion.div>
        </div>
      </VideoStage>
    </ConsoleLayout>
  );
}
