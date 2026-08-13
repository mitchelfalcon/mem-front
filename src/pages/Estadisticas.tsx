import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Activity, BedDouble, Timer, ShieldCheck } from "lucide-react";
import { ConsoleLayout } from "../components/mem/ConsoleLayout";
import { VideoStage } from "../components/mem/VideoStage";
import {
  KPIS,
  ENDEMIC_CHANNEL,
  TRENDS,
  ZONE_SHARE,
  PATIENT_VISITS,
  type KpiEntry,
  type PatientVisit,
} from "../data/estadisticas";

const STATUS_STYLE: Record<PatientVisit["status"], string> = {
  Estable: "bg-emerald-50 text-emerald-700",
  "En revisión": "bg-amber-50 text-amber-700",
  Crítico: "bg-rose-50 text-rose-700",
};

const TONE: Record<KpiEntry["tone"], { text: string; bg: string; icon: typeof Activity }> = {
  blue: { text: "text-mem-blue", bg: "bg-blue-50", icon: Activity },
  amber: { text: "text-amber-600", bg: "bg-amber-50", icon: BedDouble },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50", icon: Timer },
  indigo: { text: "text-indigo-600", bg: "bg-indigo-50", icon: ShieldCheck },
  rose: { text: "text-rose-600", bg: "bg-rose-50", icon: Activity },
};

/** Defer chart mounting so the background video iframe starts loading first. */
function useDeferredMount(delay = 140) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);
  return ready;
}

function ChartSkeleton() {
  return <div className="h-full min-h-[160px] w-full animate-pulse rounded-xl bg-slate-200/40" />;
}

function Panel({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border border-white/60 bg-indigo-200/40 p-4 shadow-lg backdrop-blur-md ${className}`}>
      <div className="mb-2">
        <p className="text-sm font-bold text-mem-navy">{title}</p>
        {subtitle && <p className="text-[11px] font-medium text-slate-500">{subtitle}</p>}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

export function Estadisticas() {
  const chartsReady = useDeferredMount();

  return (
    <ConsoleLayout defaultSidebar="analytics" bleed>
      <VideoStage
        videoId="1217019861"
        title="MEM Healthcare — video de fondo (estadísticas)"
        immersive
        contentClassName="h-full"
      >
        {/* Light legibility scrim — keeps the video visible behind the frosted cards */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/45 via-white/15 to-transparent" />

        <div className="relative h-full overflow-y-auto overflow-x-hidden pt-3 pr-3 pb-3 pl-sidebar sm:pt-6 sm:pr-6 sm:pb-6">
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-mem-navy sm:text-2xl">Estadísticas</h2>
              <p className="text-xs font-medium text-slate-600">
                Vigilancia epidemiológica · Equipo 20 · mitigación de retrasos en reportes
              </p>
            </div>
            <span className="zone-pill">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Temporada 2026 · en vivo
            </span>
          </div>

          {/* KPIs */}
          <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {KPIS.map((kpi, i) => {
              const tone = TONE[kpi.tone];
              const Icon = tone.icon;
              const Trend = kpi.trend === "up" ? TrendingUp : TrendingDown;
              return (
                <motion.div
                  key={kpi.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="rounded-2xl border border-white/60 bg-indigo-200/40 p-3 shadow-lg backdrop-blur-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone.bg} ${tone.text}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
                        kpi.trend === "up" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      <Trend className="h-3 w-3" />
                      {kpi.delta}
                    </span>
                  </div>
                  <p className={`text-xl font-extrabold leading-tight sm:text-2xl ${tone.text}`}>{kpi.value}</p>
                  <p className="text-[10px] font-medium leading-tight text-slate-500 sm:text-[11px]">{kpi.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Charts bento */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <Panel
              title="Canal endémico"
              subtitle="Casos observados vs. zonas de éxito / seguridad / alerta"
              className="lg:col-span-2 lg:row-span-2 min-h-[220px] sm:min-h-[280px]"
            >
              {chartsReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={ENDEMIC_CHANNEL} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,30,69,0.08)" />
                    <XAxis dataKey="semana" tick={{ fontSize: 11, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#475569" }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid rgba(37,99,235,0.2)",
                        fontSize: 12,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="exito" name="Éxito" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                    <Area type="monotone" dataKey="seguridad" name="Seguridad" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.22} />
                    <Area type="monotone" dataKey="alerta" name="Alerta" stackId="1" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
                    <Line type="monotone" dataKey="casos" name="Casos" stroke="#007ade" strokeWidth={3} dot={{ r: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <ChartSkeleton />
              )}
            </Panel>

            <Panel title="Tendencias" subtitle="Ingresos vs. resueltos" className="min-h-[180px] sm:min-h-[150px]">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TRENDS} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gIng" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#007ade" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#007ade" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6d3bf5" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="#6d3bf5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,30,69,0.08)" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#475569" }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(37,99,235,0.2)", fontSize: 12 }} />
                    <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#007ade" strokeWidth={2} fill="url(#gIng)" />
                    <Area type="monotone" dataKey="resueltos" name="Resueltos" stroke="#6d3bf5" strokeWidth={2} fill="url(#gRes)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ChartSkeleton />
              )}
            </Panel>

            <Panel title="Distribución por zona" subtitle="Participación de casos" className="min-h-[180px] sm:min-h-[150px]">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ZONE_SHARE}
                      dataKey="valor"
                      nameKey="zona"
                      innerRadius="55%"
                      outerRadius="80%"
                      paddingAngle={2}
                    >
                      {ZONE_SHARE.map((z) => (
                        <Cell key={z.zona} fill={z.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(37,99,235,0.2)", fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ChartSkeleton />
              )}
            </Panel>
          </div>

          {/* Patient visits table */}
          <div className="mt-3">
            <Panel title="Visitas de pacientes" subtitle="Turno actual · en vivo">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wide text-mem-gray-2">
                      <th className="px-2 py-2 font-semibold">Paciente</th>
                      <th className="px-2 py-2 font-semibold">Motivo</th>
                      <th className="px-2 py-2 font-semibold">Estado</th>
                      <th className="px-2 py-2 text-right font-semibold">Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PATIENT_VISITS.map((p) => (
                      <tr key={p.id} className="border-t border-white/40">
                        <td className="px-2 py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-mem-blue to-mem-purple text-[11px] font-bold text-white">
                              {p.initials}
                            </span>
                            <div className="leading-tight">
                              <p className="text-xs font-semibold text-mem-ink">{p.name}</p>
                              <p className="font-mono text-[10px] text-mem-gray-2">{p.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2.5 text-xs text-mem-gray">{p.reason}</td>
                        <td className="px-2 py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_STYLE[p.status]}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-right font-mono text-xs text-mem-gray">{p.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        </div>
      </VideoStage>
    </ConsoleLayout>
  );
}
