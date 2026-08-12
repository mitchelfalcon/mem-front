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

/** Small download + arrow action buttons (blue circle + yellow circle). */
function Actions() {
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mem-blue text-white">
        <Download className="h-2.5 w-2.5" />
      </span>
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mem-lime text-mem-ink">
        <ChevronRight className="h-3 w-3" />
      </span>
    </span>
  );
}

function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/70 bg-white/85 px-3 py-2 text-mem-navy shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-1 pr-1">
        <div className="leading-tight">
          <p className="text-[9px] font-semibold uppercase text-slate-400">Interval</p>
          <p className="text-[10px] font-bold">Last Min</p>
        </div>
        <span className="font-mono text-xs font-extrabold">06.08.2026</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

      <button className="inline-flex items-center gap-2 rounded-lg bg-mem-blue px-3 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-mem-blue-2">
        <ShieldAlert className="h-3.5 w-3.5" />
        <span className="leading-none text-left">
          BREAKDOWN
          <span className="ml-1 font-medium opacity-80">Service Zone</span>
        </span>
      </button>

      <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
        <Menu className="h-4 w-4" />
      </button>

      <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold">
        <Filter className="h-3 w-3 text-mem-blue" />
        <span className="leading-tight text-left">
          FILTER STATE 1
          <span className="block font-medium text-slate-400">State 1 Region 2</span>
        </span>
      </span>

      <span className="zone-pill">
        <BedDouble className="h-3.5 w-3.5 text-mem-blue" />
        CAMAS DISPONIBLES MÉXICO
      </span>

      <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold shadow-sm">
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
        {/* DNA helix (decorative, right) — behind the cards */}
        <img
          src={dnaHelix}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-24 z-10 w-[min(26vw,340px)] select-none opacity-90"
        />

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute left-[128px] right-4 top-3 z-20"
        >
          <Toolbar />
        </motion.div>

        {/* MEDICACION TOP pill */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="absolute left-[144px] top-[74px] z-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold text-mem-navy shadow-sm backdrop-blur">
            <span className="text-slate-400">1.</span> MEDICACION TOP
            <span className="font-medium text-slate-400">3.6 Mb</span>
          </span>
        </motion.div>

        {/* Medication list card */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="absolute left-[144px] top-[104px] z-20 flex w-64 items-center gap-2 rounded-2xl border border-white/60 bg-white/85 p-3 shadow-md backdrop-blur"
        >
          <div className="flex-1 space-y-1.5">
            {MEDS.map((m) => (
              <div key={m.name} style={{ marginLeft: m.indent * 12 }}>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-mem-navy px-2 py-1 text-[10px] font-bold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-mem-lime" />
                  {m.name}
                  <span className="font-medium text-slate-300">{m.dose}</span>
                  <span className="flex h-4 items-center rounded-full bg-white/20 px-1 text-[8px]">
                    <Sun className="h-2.5 w-2.5" />
                  </span>
                </span>
              </div>
            ))}
          </div>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mem-lime text-mem-ink">
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </motion.div>

        {/* Clinic Visit Appointment card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="absolute left-[144px] top-[290px] z-20 w-52 rounded-2xl bg-gradient-to-br from-[#0a1f4d] to-[#123a7a] p-4 shadow-xl"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mem-lime">
              <FileText className="h-3.5 w-3.5 text-mem-ink" />
            </span>
            <span className="text-[11px] font-medium text-slate-300">31 May '26</span>
          </div>
          <p className="text-sm font-extrabold leading-tight text-white">Clinic Visit Appointment</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-mem-blue to-mem-purple text-[10px] font-bold text-white">
              SR
            </span>
            <span className="text-xs font-medium text-slate-200">Dr. Shilpa Rao</span>
          </div>
        </motion.div>

        {/* COAHUILA DEFICIT pill (center) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="absolute left-1/2 top-[150px] z-20 -translate-x-1/2"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-mem-navy shadow-md">
            <span className="text-slate-400">1.</span>
            <Thermometer className="h-3.5 w-3.5 text-rose-500" />
            COAHUILA DEFICIT · 36°C
            <Actions />
          </span>
        </motion.div>

        {/* Latest Diagnose (yellow card, top-right) */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="absolute right-4 top-[84px] z-20 w-72 rounded-2xl bg-mem-lime p-4 shadow-xl"
        >
          <p className="text-sm font-extrabold text-mem-ink">Latest Diagnose : Arrhythmias</p>
          <p className="mt-2 text-2xl font-extrabold text-mem-ink">8</p>
          <p className="text-[11px] font-bold uppercase text-mem-ink/70">Visits</p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-[10px] leading-tight text-mem-ink/70">
              You can see the last report <span className="font-bold underline">here</span>
            </p>
            <button className="whitespace-nowrap rounded-lg bg-mem-navy px-3 py-1.5 text-[11px] font-bold text-white transition-transform hover:scale-105">
              Patient's Detail
            </button>
          </div>
        </motion.div>

        {/* ZONA NORTE panel (right) */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="absolute right-[200px] top-[220px] z-20 w-52 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lg backdrop-blur"
        >
          <div className="mb-2 flex items-center gap-2">
            <p className="text-sm font-extrabold text-mem-blue">ZONA NORTE</p>
            <span className="h-2 w-2 rounded-full bg-mem-blue" />
            <span className="h-2 w-2 rounded-full bg-rose-400" />
          </div>
          <ul className="space-y-1 text-[11px] font-semibold text-mem-blue">
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
          className="absolute bottom-4 left-[128px] z-20 w-[380px] rounded-2xl border border-white/60 bg-indigo-200/40 p-3 shadow-lg backdrop-blur-md"
        >
          <div className="mb-2 flex items-center gap-2">
            <Boxes className="h-4 w-4 text-mem-navy" />
            <span className="text-xs font-extrabold uppercase tracking-wide text-mem-navy">Logística Medicación</span>
            <span className="flex h-5 items-center gap-1 rounded-full bg-white/70 px-1.5 text-[10px] font-bold text-mem-navy">
              <Sun className="h-3 w-3" /> 2
            </span>
          </div>
          <div className="space-y-1.5">
            {LOGISTICA.map((l) => (
              <div key={l.name} className="flex items-center gap-2 rounded-xl bg-white/80 px-2.5 py-1.5 shadow-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">{l.n}</span>
                <p className="flex-1 truncate text-[11px] font-semibold text-mem-navy">{l.name}</p>
                <span className="text-[10px] text-slate-500">{l.size}</span>
                <Actions />
              </div>
            ))}
          </div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold text-mem-navy">
            ZONA SUR · VIGILANCIA <span className="font-medium text-slate-500">21 Pacientes</span>
          </div>
        </motion.div>

        {/* Ultimos Diagnosticos Epidemiologicos (bottom-right) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="absolute bottom-4 right-4 z-20 w-[min(46vw,520px)] rounded-2xl border border-white/60 bg-indigo-200/40 p-4 shadow-lg backdrop-blur-md"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-extrabold uppercase tracking-wide text-mem-navy">
              Últimos Diagnósticos Epidemiológicos
            </p>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-mem-navy">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-mem-blue to-mem-purple text-[9px] text-white">KM</span>
              Karen McBeth <span className="font-medium text-slate-500">3.6 Mb</span>
              <Actions />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[10px] text-mem-navy/80">
            <div>
              <p className="text-sm font-extrabold text-mem-navy">28 Pacientes Activos</p>
              <p className="mt-1 leading-relaxed">
                Predominancia enfermedades respiratorias causadas por entrada de extranjeros en la zona norte.
              </p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/70 px-2 py-1 font-bold">
                Coahuila <span className="text-rose-600">RIESGO</span>
                <span className="text-slate-500">5. Pocas Camas</span>
                <Actions />
              </div>
            </div>
            <div>
              <p className="font-extrabold uppercase text-mem-navy">Otros Vectores de Riesgo</p>
              <p className="mt-1">Enfermedades de transmisión sexual</p>
              <p className="mt-2 font-bold">JALISCO <span className="text-amber-600">RIESGO</span></p>
              <p className="mt-1 font-bold">BAJA CALIFORNIA <span className="text-rose-600">NORTE RIESGO</span></p>
              <div className="mt-1 flex justify-end"><Actions /></div>
            </div>
          </div>
        </motion.div>
      </VideoStage>
    </ConsoleLayout>
  );
}
