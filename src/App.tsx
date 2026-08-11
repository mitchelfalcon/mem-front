import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  // Common icons
  Target, Brain, Database, ShieldAlert, Activity, CheckCircle2, ZapOff, BarChart3,
  ChevronRight, ShieldCheck, Zap, Lock, ArrowUpRight, ArrowDownRight, Menu, X,
  Rocket, Clock, CheckCircle, AlertCircle, FileText, Workflow,
  // Operational-specific icons
  Bell, Users, DollarSign, ShoppingCart, ChevronDown, AlertTriangle,
  Maximize2, Share2, Mic, Check, Building2, BarChart2, PieChart,
  LineChart, CreditCard, Award, List, Layers, Radio, Hand,
  MousePointer, Plus, GitBranch, Play, Search, Settings, Cloud, Cpu,
  Eye, Filter, Link2, TrendingUp, Send, MicOff, Sparkles, Calendar, Volume2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart as ReLineChart, Line,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area
} from "recharts";

// Shared data types from original App
import {
  ARCHITECTURE_NODES,
  ArchitectureNode,
  JOURNEY_MAP,
  REQUIREMENTS,
  DEPLOYMENT_STEPS
} from "./types";

// Operational view subcomponents from Alro Main components
import { ChartCard }               from "./components/chart-card";
import { ActivityCard }            from "./components/activity-card";
import { TasksCard }               from "./components/tasks-card";
import { PieChartCard }            from "./components/pie-chart-card";
import { BarChartCard }            from "./components/bar-chart-card";
import { RadarChartCard }          from "./components/radar-chart-card";
import { HorizontalBarChartCard }  from "./components/horizontal-bar-chart-card";
import { BalanceOverview }         from "./components/balance-overview";
import { IncomeRingSection }       from "./components/income-ring-section";
import { SpendingTrendCard }       from "./components/spending-trend-card";
import { TransactionsHistory }     from "./components/transactions-history";
import { HudLedger }               from "./components/hud-ledger";
import { NodeMapInteractive }      from "./components/node-map-interactive";
import { ShareModal }              from "./components/share-modal";
import { GdsMovementConsole }      from "./components/gds-movement-console";
import { SidebarGlass }            from "./components/sidebar-glass";
import { VoiceMetricsCard }        from "./components/voice-metrics-card";
import { SalesforceObjectsCard }   from "./components/salesforce-objects-card";
import { SyncAlertsCard }          from "./components/sync-alerts-card";
import { WorkerSessionsCard }      from "./components/worker-sessions-card";
import { VoiceCommandQueue }       from "./components/voice-command-queue";
import { MilestonesTimeline }      from "./components/milestones-timeline";
import { CustomMicVoiceIcon }       from "./components/custom-voice-icon";
import { RecentActivityLive }      from "./components/recent-activity-live";

// @ts-ignore
import logoSphere from "./imports/Firefly_1.png";
// @ts-ignore
import agentforceIcon from "./imports/67e38f064aab7b939d9e0f35_AD_4nXcjjp2dJwcyJPidQaKJNUDJy8bW3tvmGY7bBPcYz2SpzX05-reAKV5wtFbITFVhFnsR_QSIKyEBItLIugLcwuK28TZheM7DpE3Xr19djh2l2acmXqoYWsQO93onJnUbwWn5HmJr.png";

// ─── Executive Mode Mock Data ─────────────────────────────────────────────
const CALENDAR_EVENTS: Record<number, { title: string; time: string; tag: string }> = {
  5: { title: "Reunión de Estrategia de IA", time: "10:00 AM", tag: "AI Roadmap" },
  12: { title: "Revisión de Arquitectura", time: "02:30 PM", tag: "Architecture" },
  15: { title: "Demo de Agentforce Hub v4", time: "11:00 AM", tag: "Launch Hub" },
  20: { title: "Almuerzo con Ventas", time: "01:00 PM", tag: "Executive" },
  26: { title: "Evaluación de Seguridad de Red", time: "09:00 AM", tag: "Security" },
  29: { title: "Cierre de Roadmap Tecnológico", time: "04:00 PM", tag: "Tech Q3" },
};

const ROI_DATA = [
  { name: 'Finanzas', value: 2.4, color: '#10b981' },
  { name: 'Legal', value: 4.7, color: '#34d399' },
  { name: 'Corporativo', value: 87.0, color: '#059669' },
];

const LATENCY_DATA = [
  { time: '00:00', val: 210 },
  { time: '04:00', val: 245 },
  { time: '08:00', val: 280 },
  { time: '12:00', val: 230 },
  { time: '16:00', val: 310 },
  { time: '20:00', val: 260 },
  { time: '23:59', val: 240 },
];

const WORKSLOP_RADAR = [
  { subject: 'Alucinación', A: 120, fullMark: 150 },
  { subject: 'Vibe Coding', A: 98, fullMark: 150 },
  { subject: 'Auditabilidad', A: 145, fullMark: 150 },
  { subject: 'Consistencia', A: 130, fullMark: 150 },
  { subject: 'Seguridad', A: 150, fullMark: 150 },
];


// ─── Operational Glass style constants ───────────────────────────────────────────────
const GLOBAL_G: Record<string, React.CSSProperties> = {
  card: {
    background: "rgba(240, 246, 255, 0.48)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.7)",
    boxShadow: "10px 10px 24px rgba(150, 175, 205, 0.28), -10px -10px 24px rgba(255, 255, 255, 0.95), inset 2px 2px 5px rgba(255, 255, 255, 0.75), inset -2px -2px 5px rgba(150, 175, 205, 0.12)",
  },
  cardDeep: {
    background: "rgba(238, 245, 255, 0.55)",
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    border: "1px solid rgba(255, 255, 255, 0.75)",
    boxShadow: "14px 14px 32px rgba(150, 175, 205, 0.32), -14px -14px 32px rgba(255, 255, 255, 0.95), inset 3px 3px 6px rgba(255, 255, 255, 0.8), inset -3px -3px 6px rgba(150, 175, 205, 0.15)",
  },
  inset: {
    background: "rgba(225, 236, 248, 0.45)",
    border: "1px solid rgba(255, 255, 255, 0.45)",
    boxShadow: "inset 4px 4px 10px rgba(150, 175, 205, 0.35), inset -4px -4px 10px rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
  },
  nav: {
    background: "rgba(244, 248, 253, 0.65)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.65)",
    boxShadow: "0 6px 24px rgba(150, 175, 205, 0.18)",
  },
  analyticsCard: {
    padding: "1.25rem",
    minHeight: "155px",
  },
  analyticsGrid: {
    gap: "1.25rem",
    marginBottom: "1.25rem",
  },
  gdsConsoleWrapper: {
    marginBottom: "1.5rem",
  },
};

const GD: Record<string, React.CSSProperties> = {
  card: {
    background: "rgba(240, 246, 255, 0.48)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.7)",
    boxShadow: "10px 10px 24px rgba(150, 175, 205, 0.28), -10px -10px 24px rgba(255, 255, 255, 0.95), inset 2px 2px 5px rgba(255, 255, 255, 0.75), inset -2px -2px 5px rgba(150, 175, 205, 0.12)",
  },
  cardDeep: {
    background: "rgba(238, 245, 255, 0.55)",
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    border: "1px solid rgba(255, 255, 255, 0.75)",
    boxShadow: "14px 14px 32px rgba(150, 175, 205, 0.32), -14px -14px 32px rgba(255, 255, 255, 0.95), inset 3px 3px 6px rgba(255, 255, 255, 0.8), inset -3px -3px 6px rgba(150, 175, 205, 0.15)",
  },
  inset: {
    background: "rgba(225, 236, 248, 0.45)",
    border: "1px solid rgba(255, 255, 255, 0.45)",
    boxShadow: "inset 4px 4px 10px rgba(150, 175, 205, 0.35), inset -4px -4px 10px rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
  },
  nav: {
    background: "rgba(244, 248, 253, 0.65)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.65)",
    boxShadow: "0 6px 24px rgba(150, 175, 205, 0.18)",
  },
  analyticsCard: {
    padding: "1.25rem",
    minHeight: "155px",
  },
  analyticsGrid: {
    gap: "1.25rem",
    marginBottom: "1.25rem",
  },
  gdsConsoleWrapper: {
    marginBottom: "1.5rem",
  },
};

// ─── Operational AURA node roster ──────────────────────────────────────────────────────
const AURA_NODES = [
  { id: "facturacion", name: "Facturación", color: "#10b981", value: "$54K",    metric: "Revenue",  confidence: 96 },
  { id: "casos",       name: "Casos",       color: "#3b82f6", value: "213",     metric: "Tickets",  confidence: 91 },
  { id: "actividades", name: "Actividades", color: "#8b5cf6", value: "34sp",    metric: "Velocity", confidence: 98 },
  { id: "ledger",      name: "Ledger",      color: "#f59e0b", value: "$125.5K", metric: "Balance",  confidence: 89 },
  { id: "voz",         name: "Voz",         color: "#06b6d4", value: "94%",     metric: "Accuracy", confidence: 94 },
];

const EXPANDED_KPI: Record<string, { color: string; kpis: { label: string; value: string }[]; formula: string }> = {
  facturacion: { color: "#10b981", formula: "ROI = (Revenue − Cost) / Cost × 100",
    kpis: [{ label: "Revenue Total", value: "$54,239" }, { label: "ROI Margin", value: "34.2%" }, { label: "Q4 Target", value: "86%" }, { label: "AR Days", value: "21 days" }] },
  casos: { color: "#3b82f6", formula: "Res_Rate = Closed / Total_Open × 100",
    kpis: [{ label: "Open Cases", value: "213" }, { label: "Tier-2 Escalated", value: "3" }, { label: "Resolution Rate", value: "87%" }, { label: "SLA Breach", value: "2%" }] },
  actividades: { color: "#8b5cf6", formula: "Velocity = StoryPoints / SprintDays",
    kpis: [{ label: "Sprint Velocity", value: "34 SP" }, { label: "Tasks Done", value: "127" }, { label: "Backlog Items", value: "48" }, { label: "Blocked", value: "5" }] },
  ledger: { color: "#f59e0b", formula: "CashFlow = Inflows − Outflows",
    kpis: [{ label: "Net Balance", value: "$125.5K" }, { label: "AP Outstanding", value: "$18.2K" }, { label: "Cash Flow", value: "+$6.4K" }, { label: "Burn Rate", value: "$22K/mo" }] },
  voz: { color: "#06b6d4", formula: "Acc = Correct_Intent / Total × 100",
    kpis: [{ label: "Accuracy", value: "94%" }, { label: "Commands/hr", value: "142" }, { label: "Avg Latency", value: "180ms" }, { label: "Veto Events", value: "0" }] },
};

type CardId = "revenue" | "spending" | "devices" | "products" | "departments" |
              "orders" | "activity" | "tasks" | "transactions" | "balance" | "income";

const ANALYTICS_CARDS: {
  id: CardId; title: string; subtitle: string;
  metric: string; trend: string; positive: boolean;
  color: string; icon: React.ElementType;
  spark: number[];
  voiceKeys: string[];
}[] = [
  { id: "revenue",      title: "Revenue Overview",    subtitle: "Monthly performance",  metric: "$54.2K",    trend: "+12.5%", positive: true,  color: "#10b981", icon: LineChart,  spark: [40,30,50,45,60,55,70], voiceKeys: ["revenue","ingresos","ventas"] },
  { id: "spending",     title: "Spending Trend",       subtitle: "Annual overview",      metric: "Avg $5.1K", trend: "+28%",   positive: true,  color: "#059669", icon: CreditCard, spark: [25,38,22,46,34,55,42,68,51,85,62,91], voiceKeys: ["gasto","gastos","spending","tendencia"] },
  { id: "orders",       title: "Orders Analysis",      subtitle: "Weekly breakdown",     metric: "1,423",     trend: "-3.1%",  positive: false, color: "#ef4444", icon: BarChart2,  spark: [80,65,90,75,85,70,95], voiceKeys: ["órdenes","ordenes","pedidos","orders"] },
  { id: "devices",      title: "Device Distribution",  subtitle: "Traffic by device",    metric: "11.2K",     trend: "+8.3%",  positive: true,  color: "#3b82f6", icon: PieChart,   spark: [42,31,24,15], voiceKeys: ["dispositivos","devices","distribución"] },
  { id: "products",     title: "Product Revenue",      subtitle: "Top performers",       metric: "$21.6K",    trend: "+15.2%", positive: true,  color: "#8b5cf6", icon: BarChart2,  spark: [49,39,52,35,41], voiceKeys: ["productos","products"] },
  { id: "departments",  title: "Dept Performance",     subtitle: "Q4 vs Q3 2024",        metric: "92.5 avg",  trend: "+8.2%",  positive: true,  color: "#f59e0b", icon: Award,      spark: [85,92,78,88,82,70], voiceKeys: ["departamentos","departamento","departments"] },
  { id: "activity",     title: "Recent Activity",      subtitle: "Latest events",        metric: "24 new",    trend: "today",  positive: true,  color: "#06b6d4", icon: Activity,   spark: [3,5,2,8,6,9,7], voiceKeys: ["actividad","activity","eventos"] },
  { id: "tasks",        title: "Tasks",                subtitle: "Current sprint",       metric: "18 / 24",   trend: "75%",    positive: true,  color: "#f59e0b", icon: List,       spark: [4,6,8,7,9,8,10], voiceKeys: ["tareas","tasks"] },
  { id: "transactions", title: "Transactions",         subtitle: "Recent history",       metric: "47 ops",    trend: "today",  positive: true,  color: "#f59e0b", icon: DollarSign, spark: [5,8,3,9,6,11,7], voiceKeys: ["transacciones","transactions","historial"] },
  { id: "balance",      title: "Balance Overview",     subtitle: "Account summary",      metric: "$125.5K",   trend: "+8.3%",  positive: true,  color: "#10b981", icon: DollarSign, spark: [100,108,95,115,112,120,125], voiceKeys: ["balance","saldo","cuenta"] },
  { id: "income",       title: "Income Overview",      subtitle: "Revenue streams",      metric: "$287K",     trend: "+14%",   positive: true,  color: "#059669", icon: TrendingUp, spark: [200,230,210,250,260,280,287], voiceKeys: ["income","ingreso","anillo"] },
];

const EXPANDED_COMPONENTS: Record<CardId, React.ReactNode> = {
  revenue:      <ChartCard />,
  spending:     <SpendingTrendCard />,
  orders:       <BarChartCard />,
  devices:      <PieChartCard />,
  products:     <HorizontalBarChartCard />,
  departments:  <RadarChartCard />,
  activity:     <ActivityCard />,
  tasks:        <TasksCard />,
  transactions: <TransactionsHistory />,
  balance:      <BalanceOverview />,
  income:       <IncomeRingSection />,
};

const ORG_DEPTS = ["Finanzas", "Operaciones", "Analytics", "Tecnología", "Legal", "Ventas"];

// ─── Live gateway tick helper ─────────────────────────────────────────────────────
function useGatewayPulse() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % 100), 2200);
    return () => clearInterval(id);
  }, []);
  return tick;
}

// ─── Sparkline SVG helper ─────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const w = 72, h = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5}
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * w}
        cy={h - ((data[data.length - 1] - min) / range) * h}
        r={2.5} fill={color} />
    </svg>
  );
}

// ─── Compact analytics card ────────────────────────────────────────────────
function CompactCard({
  card, onExpand, voiceHighlight, darkMode,
}: {
  card: typeof ANALYTICS_CARDS[number];
  onExpand: () => void;
  voiceHighlight: boolean;
  darkMode?: boolean;
}) {
  const Icon = card.icon;
  const G = darkMode ? GD : GLOBAL_G;
  return (
    <motion.button
      onClick={onExpand}
      className="p-3 rounded-2xl text-left w-full animate-fade-in"
      style={{
        ...G.card,
        boxShadow: voiceHighlight
          ? `0 4px 24px rgba(16,185,129,0.18), 0 0 0 2px ${card.color}`
          : G.card.boxShadow,
        outline: "none",
        transition: "box-shadow 0.2s",
      }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(16,185,129,0.12)" }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="h-0.5 rounded-full mb-2.5"
        style={{ background: `linear-gradient(90deg,${card.color},${card.color}33)` }} />
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: card.color }} />
            <span className="text-[10px] font-normal uppercase tracking-wider truncate"
              style={{ color: darkMode ? "#94a3b8" : "#5b7290", fontFamily: "'Segoe UI', -apple-system, sans-serif", fontWeight: 350 }}>
              {card.title}
            </span>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.45, 0.95, 0.65, 1] }}
            transition={{ duration: 0.7, ease: "easeInOut", times: [0, 0.15, 0.3, 0.45, 0.7, 1] }}
            className="text-xl font-bold leading-none mb-1 font-sans" 
            style={{ color: darkMode ? "#ffffff" : "#0f172a", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}
          >
            {card.metric}
          </motion.p>
          <div className="flex items-center gap-1">
            {card.positive
              ? <ArrowUpRight className="w-3 h-3" style={{ color: "#10b981" }} />
              : <ArrowDownRight className="w-3 h-3" style={{ color: "#ef4444" }} />
            }
            <span className="text-[10px] font-bold font-sans"
              style={{ color: card.positive ? "#10b981" : "#ef4444" }}>
              {card.trend}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          <Sparkline data={card.spark} color={card.color} />
          <Maximize2 className="w-3 h-3" style={{ color: "rgba(16,185,129,0.3)" }} />
        </div>
      </div>
    </motion.button>
  );
}

// ─── KPI mini card ─────────────────────────────────────────────────────────
function KpiMiniCard({
  node, onExpand, vetoActive, darkMode,
}: {
  node: typeof AURA_NODES[number];
  onExpand: () => void;
  vetoActive: boolean;
  darkMode?: boolean;
}) {
  const isLow = node.confidence < 94;
  const G = darkMode ? GD : GLOBAL_G;
  return (
    <div className="relative flex-1 min-w-[110px]">
      <motion.button
        onClick={onExpand}
        className="p-3.5 rounded-xl text-left w-full"
        style={{
          ...G.card,
          fontFamily: "'Segoe UI', -apple-system, sans-serif",
          boxShadow: isLow
            ? "0 4px 20px rgba(239,68,68,0.10), 0 0 0 1px rgba(239,68,68,0.16)"
            : G.card.boxShadow,
        }}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(16,185,129,0.14)" }}
        whileTap={{ scale: 0.96 }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <motion.div className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: node.color, boxShadow: `0 0 4px ${node.color}88` }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            <span className="text-[10px] font-normal uppercase tracking-[0.08em] truncate"
              style={{ color: node.color, fontFamily: "'Segoe UI', -apple-system, sans-serif", fontWeight: 350 }}>
              {node.name}
            </span>
          </div>
          <Maximize2 className="w-2.5 h-2.5 flex-shrink-0" style={{ color: "rgba(16,185,129,0.28)" }} />
        </div>
        <p className="text-lg font-bold leading-none mb-0.5" style={{ color: darkMode ? "#ffffff" : "#0f172a", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
          {node.value}
        </p>
        <p className="text-[10px] mb-2 font-light" style={{ color: darkMode ? "#94a3b8" : "#5b7290", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>{node.metric}</p>
        <div className="h-1 rounded-full overflow-hidden"
          style={{ background: "rgba(16,185,129,0.08)" }}>
          <motion.div className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg,${node.color},${node.color}77)` }}
            initial={{ width: 0 }}
            animate={{ width: `${node.confidence}%` }}
            transition={{ duration: 0.8, delay: 0.3 }} />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[8px] font-light" style={{ color: darkMode ? "#64748b" : "#5b7290", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>Confidence</span>
          <span className="text-[9px] font-bold"
            style={{ color: node.confidence >= 94 ? "#10b981" : "#ef4444", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
            {node.confidence}%
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {vetoActive && isLow && (
          <motion.div
            className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-1"
            style={{
              background: darkMode ? "rgba(20, 5, 5, 0.90)" : "rgba(255,245,245,0.90)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: darkMode ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(239,68,68,0.18)",
              zIndex: 10,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AlertTriangle className="w-4 h-4" style={{ color: "#ef4444" }} />
            <span className="text-[8px] font-bold uppercase tracking-widest"
              style={{ color: "#ef4444" }}>Conf. &lt;94%</span>
            <span className="text-[7px] text-center px-2"
              style={{ color: "#b45454" }}>Escalado inmediato</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Voice indicator — 3-state ────────────────────────────────────────────
type VoiceState = "idle" | "listening" | "processing";

function VoiceIndicator({
  state, status, onToggle, darkMode, voiceLang, setVoiceLang,
}: {
  state: VoiceState;
  status: string;
  onToggle: () => void;
  darkMode?: boolean;
  voiceLang: 'es-ES' | 'en-US';
  setVoiceLang: (l: 'es-ES' | 'en-US') => void;
}) {
  const BARS = [0.4, 0.65, 0.9, 1.0, 0.85, 0.7, 0.5, 0.8, 0.95, 0.75, 0.6, 0.45];
  const stateColor: Record<VoiceState, string> = {
    idle: "#38bdf8",
    listening: "#0ea5e9",
    processing: "#0284c7",
  };
  const stateLabel: Record<VoiceState, string> = {
    idle: voiceLang === "es-ES" ? "Control de Voz" : "Voice Control",
    listening: voiceLang === "es-ES" ? "Escuchando" : "Listening",
    processing: voiceLang === "es-ES" ? "Procesando" : "Processing",
  };
  const color = stateColor[state];
  const isActive = state !== "idle";
  const G = darkMode ? GD : GLOBAL_G;

  return (
    <div className="flex items-center gap-2">
      {/* Language Toggle */}
      <div className="flex items-center gap-1 bg-sky-100/60 p-0.5 rounded-xl border border-sky-200/30 text-[9px] font-bold">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setVoiceLang('es-ES'); }}
          className={`px-1.5 py-0.5 rounded-lg transition-all ${
            voiceLang === 'es-ES' ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-600/60 hover:text-sky-600'
          }`}
        >
          ES
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setVoiceLang('en-US'); }}
          className={`px-1.5 py-0.5 rounded-lg transition-all ${
            voiceLang === 'en-US' ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-600/60 hover:text-sky-600'
          }`}
        >
          EN
        </button>
      </div>

      <motion.button
        onClick={onToggle}
        className="flex items-center gap-2.5 px-3 py-2 rounded-2xl animate-fade-in relative overflow-hidden"
        style={{
          ...G.card,
          background: isActive
            ? "rgba(224, 242, 254, 0.85)"
            : G.card.background,
          boxShadow: isActive
            ? `0 0 15px rgba(14, 165, 233, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.9)`
            : G.card.boxShadow,
          outline: "none",
          transition: "box-shadow 0.25s, background 0.25s",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Concentric ripples around the navbar button when active */}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-sky-200/10 pointer-events-none rounded-full"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        )}

        <div className="flex items-center gap-[2px]" style={{ height: 22 }}>
          {BARS.map((h, i) => (
            <motion.div key={i} className="rounded-full"
              style={{ width: 2, background: isActive ? color : "#94a3b8" }}
              animate={state === "listening"
                ? { height: [`${h * 4}px`, `${h * 16}px`, `${h * 4}px`], opacity: [0.6, 1, 0.6] }
                : state === "processing"
                ? { height: [`${h * 10}px`, `${h * 22}px`, `${h * 10}px`], opacity: [0.8, 1, 0.8] }
                : { height: "3px", opacity: 0.25 }
              }
              transition={{
                duration: state === "processing" ? 0.28 + i * 0.015 : 0.48 + i * 0.035,
                delay: i * 0.04,
                repeat: isActive ? Infinity : 0,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="flex flex-col items-start leading-none gap-0.5 z-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: isActive ? color : "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
            {stateLabel[state]}
          </span>
          {isActive && (
            <span className="text-[9px] max-w-[120px] truncate"
              style={{ color: "#0ea5e9", fontFamily: "'JetBrains Mono', monospace" }}>
              {status}
            </span>
          )}
        </div>

        {isActive ? (
          <motion.div className="w-2 h-2 rounded-full flex-shrink-0 z-10"
            style={{ background: color }}
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.6, 1] }}
            transition={{ duration: state === "processing" ? 0.5 : 1.1, repeat: Infinity }}
          />
        ) : (
          <Mic className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
        )}
      </motion.button>
    </div>
  );
}

// ─── Voice orb button with concentric ripples ──────────────────────────────
function VoiceOrbButton({
  isActive,
  onToggle,
  voiceLang,
  setVoiceLang,
}: {
  isActive: boolean;
  onToggle: () => void;
  voiceLang: 'es-ES' | 'en-US';
  setVoiceLang: (l: 'es-ES' | 'en-US') => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative flex items-center justify-center">
        {/* Animated concentric ripple wave 1 */}
        {isActive && (
          <motion.div
            className="absolute rounded-full border border-sky-400/40 pointer-events-none"
            style={{ width: 44, height: 44 }}
            animate={{
              scale: [1, 2.2],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2.0,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}
        
        {/* Animated concentric ripple wave 2 */}
        {isActive && (
          <motion.div
            className="absolute rounded-full border border-sky-300/30 pointer-events-none"
            style={{ width: 44, height: 44 }}
            animate={{
              scale: [1, 1.6],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 2.0,
              delay: 0.6,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}

        {/* Animated concentric ripple wave 3 (high pulse) */}
        {isActive && (
          <motion.div
            className="absolute rounded-full bg-sky-200/10 pointer-events-none"
            style={{ width: 44, height: 44 }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Glass Orb Core button */}
        <motion.button
          onClick={onToggle}
          type="button"
          className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden"
          style={{
            background: isActive 
              ? "radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.95) 0%, rgba(2, 132, 199, 1) 100%)"
              : "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(224, 242, 254, 0.85) 100%)",
            boxShadow: isActive
              ? "0 0 20px rgba(56, 189, 248, 0.75), inset 2px 2px 5px rgba(255,255,255,0.7), inset -2px -2px 5px rgba(0,0,0,0.2)"
              : "4px 4px 10px rgba(165, 185, 210, 0.35), -4px -4px 10px rgba(255, 255, 255, 0.95), inset 2px 2px 4px rgba(255,255,255,0.8)",
            border: "1px solid rgba(255, 255, 255, 0.6)"
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
        >
          {isActive ? (
            <CustomMicVoiceIcon className="w-5.5 h-5.5 text-white animate-pulse" />
          ) : (
            <CustomMicVoiceIcon className="w-5.5 h-5.5 text-sky-500" />
          )}

          {/* Shine effect overlay */}
          <div className="absolute top-0.5 left-1.5 w-4 h-2 bg-white/40 rounded-full blur-[1px] transform -rotate-12" />
        </motion.button>
      </div>

      {/* Language Toggle */}
      <div className="flex items-center gap-1 bg-sky-100/40 rounded-lg p-0.5 border border-sky-200/30 text-[9px] font-bold">
        <button
          type="button"
          onClick={() => setVoiceLang('es-ES')}
          className={`px-1.5 py-0.5 rounded transition-all ${
            voiceLang === 'es-ES' ? 'bg-sky-500 text-white shadow-xs' : 'text-sky-600/60 hover:text-sky-600'
          }`}
        >
          ES
        </button>
        <button
          type="button"
          onClick={() => setVoiceLang('en-US')}
          className={`px-1.5 py-0.5 rounded transition-all ${
            voiceLang === 'en-US' ? 'bg-sky-500 text-white shadow-xs' : 'text-sky-600/60 hover:text-sky-600'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}

// ─── Node context menu (glass float) ──────────────────────────────────────
const NodeContextMenu: React.FC<{
  nodeId: string;
  onClose: () => void;
  onAction: (action: "view" | "filter" | "link") => void;
}> = ({ nodeId, onClose, onAction }) => {
  const node = AURA_NODES.find(n => n.id === nodeId);
  if (!node) return null;

  const options: { id: "view" | "filter" | "link"; icon: React.ElementType; label: string; desc: string }[] = [
    { id: "view",   icon: Eye,     label: "Ver Datos Integrados",          desc: "Expandir datos en tiempo real" },
    { id: "filter", icon: Filter,  label: "Filtrar Departamento",          desc: "Filtrar por unidad organizacional" },
    { id: "link",   icon: Link2,   label: "Enlazar Flujo (Crear Relación)", desc: "Activar línea de conexión directa" },
  ];

  return (
    <motion.div
      className="fixed z-[120] pointer-events-none"
      style={{ inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <motion.div
        className="pointer-events-auto rounded-2xl overflow-hidden min-w-[268px]"
        style={{
          background: "#e2ede9",
          border: `1px solid rgba(0,153,112,0.08)`,
          boxShadow: `10px 10px 20px #bdc9c4, -6px -6px 14px #ffffff`,
        }}
        initial={{ opacity: 0, scale: 0.88, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 10 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <div className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: `1px solid ${node.color}18` }}>
          <div className="flex items-center gap-2">
            <motion.div className="w-2 h-2 rounded-full"
              style={{ background: node.color, boxShadow: `0 0 6px ${node.color}` }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm font-bold" style={{ color: "#0d1f1a" }}>{node.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
              style={{ background: `${node.color}12`, color: node.color }}>
              {node.confidence}%
            </span>
          </div>
          <motion.button onClick={onClose}
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(16,185,129,0.06)" }}
            whileHover={{ scale: 1.12, background: "rgba(239,68,68,0.07)" }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-3 h-3" style={{ color: "#7a9a8d" }} />
          </motion.button>
        </div>

        <div className="p-2">
          {options.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <motion.button
                key={opt.id}
                onClick={() => { onAction(opt.id); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ background: `${node.color}0d`, x: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{ transition: "background 0.12s" }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${node.color}10` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: node.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold" style={{ color: "#0d1f1a" }}>{opt.label}</p>
                  <p className="text-[10px]" style={{ color: "#7a9a8d" }}>{opt.desc}</p>
                </div>
                {opt.id === "link" && (
                  <motion.span
                    className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold"
                    style={{ background: "rgba(6,182,212,0.10)", color: "#06b6d4", display: "inline-block" }}
                    animate={{
                      scale: [1, 1.12, 1, 1.12, 1],
                      opacity: [1, 0.85, 1, 0.85, 1],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.12, 0.24, 0.38, 1]
                    }}
                  >
                    LIVE
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="px-4 py-2" style={{ borderTop: "1px solid rgba(16,185,129,0.07)" }}>
          <span className="text-[9px] uppercase tracking-widest font-mono"
            style={{ color: "rgba(16,185,129,0.4)" }}>
            CTRL+CLICK para selección múltiple
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── API Gateway Ports ─────────────────────────────────────────────────────
function ApiGatewayPorts({ tick, darkMode }: { tick: number; darkMode?: boolean }) {
  const G = darkMode ? GD : GLOBAL_G;
  const sfStatuses = [
    { label: "OAuth Handshake",      status: "OK",                              color: "#10b981" },
    { label: "Data Cloud Ingestion", status: "Live",                            color: "#10b981" },
    { label: "Flow Trigger Status",  status: tick % 7 === 0 ? "Triggered" : "Idle", color: tick % 7 === 0 ? "#f59e0b" : "#10b981" },
  ];
  const httpCodes = [
    { code: "HTTP 200", label: "Success",              count: 1847 + tick,  color: "#10b981", pulse: true },
    { code: "HTTP 406", label: "Veto Estructural",     count: 3,            color: "#f59e0b", pulse: tick % 12 < 3 },
    { code: "HTTP 422", label: "Escalamiento",         count: 1,            color: "#ef4444", pulse: tick % 20 < 2 },
  ];
  const totStages = ["Hypothesis", "Expansion", "Evaluation", "Selection"];
  const activeTot = tick % totStages.length;

  const ports = [
    {
      id: "salesforce", name: "Salesforce API", subtitle: "Persistencia & Trazabilidad",
      Icon: Database, accent: "#009EDB",
      content: (
        <div className="space-y-2.5">
          <div className="px-2 py-1 rounded-lg"
            style={{ background: "rgba(0,158,219,0.07)", border: "1px solid rgba(0,158,219,0.14)" }}>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest" style={{ color: "#009EDB" }}>
              OBJ · AWU_Ledger__c
            </span>
          </div>
          {sfStatuses.map(s => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: "#6b9e8d" }}>{s.label}</span>
              <div className="flex items-center gap-1.5">
                <motion.div className="w-1.5 h-1.5 rounded-full"
                  style={{ background: s.color }}
                  animate={{ opacity: [1, 0.35, 1], scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <span className="text-[10px] font-bold font-mono" style={{ color: s.color }}>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "vercel", name: "Vercel Edge API", subtitle: "Gateway & Middleware",
      Icon: Cloud, accent: "#171717",
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg"
            style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest" style={{ color: "#333" }}>
              IntentVector
            </span>
            <div className="flex gap-0.5 ml-auto items-end" style={{ height: 14 }}>
              {[0.45, 0.7, 1.0, 0.8, 0.55].map((h, i) => (
                <motion.div key={i} className="rounded-sm" style={{ width: 3, background: "#171717" }}
                  animate={{ height: [`${h * 6}px`, `${h * 14}px`, `${h * 6}px`] }}
                  transition={{ duration: 0.55, delay: i * 0.1, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
          {httpCodes.map(h => (
            <div key={h.code} className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold" style={{ color: h.color }}>{h.code}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px]" style={{ color: "#6b9e8d" }}>{h.label}</span>
                <motion.span
                  className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md"
                  style={{ background: `${h.color}10`, color: h.color }}
                  animate={h.pulse ? { opacity: [1, 0.5, 1] } : { opacity: 0.8 }}
                  transition={{ duration: 0.75, repeat: Infinity }}
                >
                  {h.count.toLocaleString()}
                </motion.span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "colab", name: "Google Colab Engine", subtitle: "Algoritmos Avanzados & ToT",
      Icon: Cpu, accent: "#F9AB00",
      content: (
        <div className="space-y-2.5">
          <div>
            <span className="text-[9px] uppercase tracking-widest font-mono mb-1.5 block"
              style={{ color: "#6b9e8d" }}>ToT — Tree of Thoughts</span>
            <div className="flex items-center gap-1">
              {totStages.map((stage, i) => (
                <div key={stage} className="flex-1 text-center">
                  <motion.div className="h-1 rounded-full mb-1"
                    style={{ background: i <= activeTot ? "#F9AB00" : "rgba(249,171,0,0.12)" }}
                    animate={i === activeTot ? { opacity: [1, 0.45, 1] } : {}}
                    transition={{ duration: 0.65, repeat: Infinity }}
                  />
                  <span className="text-[7px] leading-none"
                    style={{ color: i <= activeTot ? "#F9AB00" : "#aac5bc" }}>
                    {stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px]" style={{ color: "#6b9e8d" }}>Incertidumbre Alg.</span>
              <span className="text-[10px] font-bold font-mono" style={{ color: "#F9AB00" }}>
                {(6 + (tick % 4)).toFixed(1)}%
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(249,171,0,0.10)" }}>
              <motion.div className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#F9AB00,#fbbf24)", width: `${6 + (tick % 4)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px]" style={{ color: "#6b9e8d" }}>Matrix Input</span>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: 21 }).map((_, i) => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-sm"
                  style={{ background: "#F9AB00" }}
                  animate={{ opacity: i < ((tick % 20) + 5) ? [0.8, 0.3, 0.8] : 0.12 }}
                  transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.025 }}
                />
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <motion.section className="mb-5"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#7a9a8d" }}>
          Tri-Gateway Hub — API Connections
        </span>
        <div className="h-px flex-1"
          style={{ background: "linear-gradient(to right,rgba(16,185,129,0.2),transparent)" }} />
        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full"
          style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.16)", color: "#10b981" }}>
          3 SLOTS ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ports.map((port, i) => {
          const { Icon } = port;
          return (
            <motion.div key={port.id} className="rounded-2xl p-4"
              style={G.card}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 + i * 0.08 }}
              whileHover={darkMode ? { scale: 1.02 } : { boxShadow: "8px 8px 16px #bdc9c4, -8px -8px 16px #ffffff", scale: 1.02 }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: `${port.accent}0f`, border: `1px solid ${port.accent}22` }}>
                  <Icon className="w-4 h-4" style={{ color: port.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold leading-none mb-0.5" style={{ color: darkMode ? "#ffffff" : "#0d1f1a" }}>{port.name}</p>
                  <p className="text-[9px]" style={{ color: darkMode ? "#94a3b8" : "#7a9a8d" }}>{port.subtitle}</p>
                </div>
                <motion.div className="w-2 h-2 rounded-full"
                  style={{ background: "#10b981" }}
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4 }}
                />
              </div>
              <div className="h-px mb-3"
                style={{ background: `linear-gradient(to right,${port.accent}22,transparent)` }} />
              {port.content}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

// ─── Floating vertical toolbar ─────────────────────────────────────────────
function FloatingToolbar({ activeTool, onToolChange }: {
  activeTool: string;
  onToolChange: (t: string) => void;
}) {
  const tools = [
    { id: "cursor",   icon: MousePointer,  label: "Selección precisa" },
    { id: "add-kpi",  icon: Plus,          label: "+KPI — Nueva Entidad" },
    { id: "link",     icon: GitBranch,     label: "Enlazar Flujo" },
    { id: "play",     icon: Play,          label: "Ejecutar / Recalcular Grafo" },
    { id: "search",   icon: Search,        label: "Buscar KPIs / Incidencias" },
    { id: "settings", icon: Settings,      label: "Umbrales · Confianza 94%" },
  ];

  return (
    <motion.div
      className="fixed z-40 flex flex-col items-center gap-1 p-2 rounded-[28px]"
      style={{
        right: 18,
        top: "50%",
        transform: "translateY(-50%)",
        background: "#eff6ff", // Light navy/blue
        boxShadow: "8px 8px 18px #cbd5e1, -8px -8px 18px #ffffff",
      }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 22 }}
    >
      {tools.map((tool, i) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        return (
          <motion.button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            title={tool.label}
            className="w-9 h-9 rounded-[16px] flex items-center justify-center relative group"
            style={{
              background: "#eff6ff",
              boxShadow: isActive
                ? "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff"
                : "3px 3px 6px #cbd5e1, -3px -3px 6px #ffffff",
              transition: "all 0.14s",
            }}
            whileHover={{ scale: 1.1, boxShadow: "4px 4px 8px #cbd5e1, -4px -4px 8px #ffffff" }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 + i * 0.05 }}
          >
            <Icon className="w-4 h-4" style={{ color: isActive ? "#1e3a8a" : "#475569" }} />
            <div className="absolute right-full mr-2.5 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold
                whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(15,23,42,0.92)", color: "#fff", backdropFilter: "blur(8px)" }}>
              {tool.label}
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent"
                style={{ borderLeftColor: "rgba(15,23,42,0.92)" }} />
            </div>
          </motion.button>
        );
      })}

      <div className="w-5 h-px my-0.5" style={{ background: "rgba(30,58,138,0.14)" }} />

      <motion.div
        className="px-1.5 py-1 rounded-xl text-center cursor-default"
        style={{ background: "rgba(30,58,138,0.05)" }}
        animate={{ opacity: [1, 0.65, 1] }}
        transition={{ duration: 2.6, repeat: Infinity }}
      >
        <span className="text-[8px] font-bold block font-mono" style={{ color: "#1e3a8a" }}>94%</span>
        <span className="text-[7px] block" style={{ color: "#475569" }}>CONF</span>
      </motion.div>
    </motion.div>
  );
}


// --- Framer Motion Staggered Entrance Variants ---
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 18,
    },
  },
};


// ─── MAIN INTEGRATED APPLICATION ──────────────────────────────────────────────────
export default function App() {
  // Mode switcher State
  const [activeAppMode, setActiveAppMode] = useState<'architecture' | 'operational'>('operational');

  // Shadow global style constant G locally based on mode
  const isDark = false; // "No dark mode elements. ALRO Supreme - Arquitectura Page in light mode."
  const G = GLOBAL_G;

  // --- Chat/Voice state & handles
  const [chatInput, setChatInput] = useState("Create Opportunity Chart with Region filter");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "¡Hola! Soy tu copiloto de Agentforce. Escribe un comando o haz clic en el micrófono para hablar conmigo." }
  ]);

  // --- Executive Mode States
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode>(ARCHITECTURE_NODES[0]);
  const [activeDemoTab, setActiveDemoTab] = useState<'journey' | 'requirements' | 'deployment'>('journey');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(15);

  // --- Operational Mode States
  const [expandedCard, setExpandedCard]       = useState<CardId | null>(null);
  const [expandedKpi, setExpandedKpi]         = useState<string | null>(null);
  const [opsActiveNode, setOpsActiveNode]     = useState<string | null>(null);
  const [nodeContextMenu, setNodeContextMenu] = useState<string | null>(null);
  const [shareOpen, setShareOpen]             = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [currentDept, setCurrentDept]         = useState("Finanzas");
  const [voiceActive, setVoiceActive]         = useState(false);
  const [voiceStatus, setVoiceStatus]         = useState("Voz inactiva");
  const [voiceLang, setVoiceLang]             = useState<'es-ES' | 'en-US'>('es-ES');
  const [voiceHighlight, setVoiceHighlight]   = useState<string | null>(null);
  const [vetoActive, setVetoActive]           = useState(false);
  const [activeTool, setActiveTool]           = useState("cursor");
  const [linkingMode, setLinkingMode]         = useState(false);
  const [activeSection, setActiveSection]     = useState("dashboard");
  const [isHubHovered, setIsHubHovered]       = useState(false);
  const [showNetworkCanvas, setShowNetworkCanvas] = useState(false);
  const [kpiSortBy, setKpiSortBy]             = useState<'confidence' | 'revenue' | 'name'>('confidence');
  const [calendarTab, setCalendarTab]         = useState<'Today' | 'Week' | 'Month' | 'Year'>('Week');
  const [isArchOpen, setIsArchOpen]           = useState(false);
  const [isOpsOpen, setIsOpsOpen]             = useState(true);
  const [micFrequencies, setMicFrequencies]   = useState<number[]>(new Array(16).fill(0));

  const getRevenueValue = (node: typeof AURA_NODES[number]) => {
    if (node.id === "facturacion") return 54000;
    if (node.id === "ledger") return 125500;
    return 0;
  };

  const sortedAuraNodes = [...AURA_NODES].sort((a, b) => {
    if (kpiSortBy === 'confidence') {
      return b.confidence - a.confidence;
    }
    if (kpiSortBy === 'revenue') {
      return getRevenueValue(b) - getRevenueValue(a);
    }
    if (kpiSortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // --- Web Audio API real-time microphone stream capture
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let analyserNode: AnalyserNode | null = null;
    let sourceNode: MediaStreamAudioSourceNode | null = null;
    let mediaStream: MediaStream | null = null;
    let rAFId: number;

    if (voiceActive) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaStream = stream;
          const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
          audioCtx = new AudioCtxClass();
          analyserNode = audioCtx.createAnalyser();
          analyserNode.fftSize = 64; // Small fftSize to get 32 bins of frequency data
          sourceNode = audioCtx.createMediaStreamSource(stream);
          sourceNode.connect(analyserNode);

          const bufferLength = analyserNode.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const draw = () => {
            if (!analyserNode) return;
            analyserNode.getByteFrequencyData(dataArray);
            
            // Map the frequencies into our 16 visualizer bands (0 to 1 scale)
            const updatedFreqs = [];
            for (let i = 0; i < 16; i++) {
              // Standardize to a nice fluid amplitude multiplier (0-1.2)
              const val = Math.min(1.2, (dataArray[i] || 0) / 180);
              updatedFreqs.push(val);
            }
            setMicFrequencies(updatedFreqs);
            rAFId = requestAnimationFrame(draw);
          };
          draw();
        })
        .catch(err => {
          console.warn("Real mic capture not granted or unsupported, fallback to simulated beautiful waves:", err);
          let elapsed = 0;
          const simulateWave = () => {
            elapsed += 0.12;
            const simulated = Array.from({ length: 16 }).map((_, i) => {
              //Symmetrical beautiful pulse
              const baseSin = Math.sin(elapsed + i * 0.45);
              return Math.max(0.12, baseSin * 0.5 + 0.5 + Math.random() * 0.15);
            });
            setMicFrequencies(simulated);
            rAFId = requestAnimationFrame(simulateWave);
          };
          simulateWave();
        });
    } else {
      // Smooth reset
      setMicFrequencies(new Array(16).fill(0));
    }

    return () => {
      if (rAFId) cancelAnimationFrame(rAFId);
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, [voiceActive]);

  const hasRedError = chatMessages.some(m => 
    m.text.toLowerCase().includes("error") || 
    m.text.toLowerCase().includes("fail") || 
    m.text.toLowerCase().includes("fallo") || 
    m.text.toLowerCase().includes("veto")
  ) || vetoActive || voiceStatus.toLowerCase().includes("error");

  const gatewayTick = useGatewayPulse();
  const orgDropdownRef   = useRef<HTMLDivElement>(null);
  const recognitionRef   = useRef<any>(null);
  const voiceHighTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const voiceDisplayState: VoiceState = !voiceActive
    ? "idle"
    : voiceStatus.startsWith('"') ? "processing" : "listening";

  // Voice Command processing
  const handleVoiceCommand = useCallback((transcript: string) => {
    const t = transcript.toLowerCase().trim();
    let reply = "";

    if (t.includes("cerrar") || t.includes("close") || t.includes("salir")) {
      setExpandedCard(null); setExpandedKpi(null);
      reply = "He cerrado las ventanas activas.";
    } else if (t.includes("compartir") || t.includes("share")) {
      setShareOpen(true);
      reply = "He abierto el menú de compartir vista.";
    } else if (t.includes("activar veto") || t.includes("veto on") || t.includes("vetar")) {
      setVetoActive(true);
      reply = "Veto de seguridad (Safety Veto) ACTIVADO.";
    } else if (t.includes("desactivar veto") || t.includes("veto off")) {
      setVetoActive(false);
      reply = "Veto de seguridad desactivado.";
    } else {
      let matched = false;
      for (const node of AURA_NODES) {
        if (t.includes(node.id) || t.includes(node.name.toLowerCase())) {
          setExpandedKpi(node.id); setVoiceHighlight(node.id);
          setOpsActiveNode(node.id);
          if (voiceHighTimeout.current) clearTimeout(voiceHighTimeout.current);
          voiceHighTimeout.current = setTimeout(() => setVoiceHighlight(null), 2000);
          reply = `He seleccionado el nodo de ${node.name} y abierto sus detalles por comando de voz.`;
          matched = true;
          break;
        }
      }
      if (!matched) {
        for (const card of ANALYTICS_CARDS) {
          if (card.voiceKeys.some(k => t.includes(k))) {
            setExpandedCard(card.id); setVoiceHighlight(card.id);
            if (voiceHighTimeout.current) clearTimeout(voiceHighTimeout.current);
            voiceHighTimeout.current = setTimeout(() => setVoiceHighlight(null), 2000);
            reply = `Abriendo la tarjeta de análisis para ${card.title} por comando de voz.`;
            matched = true;
            break;
          }
        }
      }
      if (!matched) {
        reply = `Comando de voz recibido: "${transcript}". He enviado la intención agéntica a Salesforce Data Cloud.`;
      }
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: "bot" as const, text: reply }]);
    }, 500);
  }, []);

  // Chat Submission processing
  const handleChatSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg = { sender: "user" as const, text: trimmed };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");

    // Process text command
    const t = trimmed.toLowerCase();
    let reply = "";

    if (t.includes("cerrar") || t.includes("close") || t.includes("salir")) {
      setExpandedCard(null);
      setExpandedKpi(null);
      reply = "He cerrado las ventanas activas.";
    } else if (t.includes("compartir") || t.includes("share")) {
      setShareOpen(true);
      reply = "He abierto la ventana de compartir vista.";
    } else if (t.includes("activar veto") || t.includes("veto on") || t.includes("vetar")) {
      setVetoActive(true);
      reply = "Veto de seguridad (Safety Veto) ACTIVADO.";
    } else if (t.includes("desactivar veto") || t.includes("veto off")) {
      setVetoActive(false);
      reply = "Veto de seguridad desactivado.";
    } else if (t.includes("finanzas")) {
      setCurrentDept("Finanzas");
      reply = "Se ha cambiado el departamento a Finanzas.";
    } else if (t.includes("operaciones")) {
      setCurrentDept("Operaciones");
      reply = "Se ha cambiado el departamento a Operaciones.";
    } else if (t.includes("analyt")) {
      setCurrentDept("Analytics");
      reply = "Se ha cambiado el departamento a Analytics.";
    } else if (t.includes("tecnolo")) {
      setCurrentDept("Tecnología");
      reply = "Se ha cambiado el departamento a Tecnología.";
    } else if (t.includes("legal")) {
      setCurrentDept("Legal");
      reply = "Se ha cambiado el departamento a Legal.";
    } else if (t.includes("venta")) {
      setCurrentDept("Ventas");
      reply = "Se ha cambiado el departamento a Ventas.";
    } else {
      // Check nodes
      let matchedNode = false;
      for (const node of AURA_NODES) {
        if (t.includes(node.id) || t.includes(node.name.toLowerCase())) {
          setExpandedKpi(node.id);
          setOpsActiveNode(node.id);
          setVoiceHighlight(node.id);
          if (voiceHighTimeout.current) clearTimeout(voiceHighTimeout.current);
          voiceHighTimeout.current = setTimeout(() => setVoiceHighlight(null), 2000);
          reply = `¡Entendido! He seleccionado el nodo de ${node.name} y abierto sus detalles (Métrica: ${node.metric}, Valor: ${node.value}).`;
          matchedNode = true;
          break;
        }
      }
      
      // Check cards
      if (!matchedNode) {
        let matchedCard = false;
        for (const card of ANALYTICS_CARDS) {
          if (card.voiceKeys.some(k => t.includes(k))) {
            setExpandedCard(card.id);
            setVoiceHighlight(card.id);
            if (voiceHighTimeout.current) clearTimeout(voiceHighTimeout.current);
            voiceHighTimeout.current = setTimeout(() => setVoiceHighlight(null), 2000);
            reply = `Abriendo la tarjeta de análisis para ${card.title}.`;
            matchedCard = true;
            break;
          }
        }
        
        if (!matchedCard) {
          reply = `Comando recibido: "${trimmed}". He enviado la intención agéntica a Salesforce Data Cloud para su ejecución.`;
        }
      }
    }

    // Add agent reply with small delay
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: "bot" as const, text: reply }]);
    }, 500);
  };

  // Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = true; 
    rec.interimResults = false; 
    rec.lang = voiceLang;
    rec.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setVoiceStatus(`"${transcript}"`);
      
      // Add user speech transcript directly to chat stream
      setChatMessages(prev => [...prev, { sender: "user" as const, text: transcript }]);
      
      handleVoiceCommand(transcript);
      setTimeout(() => {
        setVoiceStatus(voiceLang === "es-ES" ? "Escuchando..." : "Listening...");
      }, 2200);
    };
    rec.onerror = () => { 
      setVoiceActive(false); 
      setVoiceStatus(voiceLang === "es-ES" ? "Error de micrófono" : "Microphone error"); 
    };
    rec.onend = () => { 
      if (recognitionRef.current?._shouldRun) {
        try {
          rec.start();
        } catch (e) {
          console.error(e);
        }
      } 
    };
    
    // If recognition was running, stop the old one and start the new one
    const wasRunning = recognitionRef.current?._shouldRun;
    if (wasRunning) {
      recognitionRef.current._shouldRun = false;
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    recognitionRef.current = rec;
    recognitionRef.current._shouldRun = wasRunning;

    if (wasRunning) {
      setTimeout(() => {
        try {
          rec.start();
        } catch (e) {}
      }, 300);
    }
  }, [handleVoiceCommand, voiceLang]);

  const toggleVoice = () => {
    const rec = recognitionRef.current;
    if (!rec) { 
      setVoiceStatus(voiceLang === "es-ES" ? "No soportado en este browser" : "Not supported in this browser"); 
      return; 
    }
    if (voiceActive) {
      rec._shouldRun = false; 
      try { rec.stop(); } catch (e) {}
      setVoiceActive(false); 
      setVoiceStatus(voiceLang === "es-ES" ? "Voz inactiva" : "Voice inactive");
    } else {
      rec._shouldRun = true; 
      try { rec.start(); } catch (e) {}
      setVoiceActive(true); 
      setVoiceStatus(voiceLang === "es-ES" ? "Escuchando..." : "Listening...");
    }
  };

  // Text-To-Speech (TTS) voice synthesis player to allow users to "listen" (escuchar) to replies
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Su navegador no soporta síntesis de voz.");
      return;
    }
    
    // Stop any current voice output
    window.speechSynthesis.cancel();
    
    // Clean emojis and double line breaks
    const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceLang; // Match active voice locale
    
    // Attempt to pick a premium matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(voiceLang.split('-')[0]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    
    // Activate voice visualizer waveform ripples during assistant speaking
    setVoiceActive(true);
    setVoiceStatus(voiceLang === "es-ES" ? "Asistente hablando..." : "Assistant speaking...");
    
    utterance.onend = () => {
      setVoiceActive(false);
      setVoiceStatus(voiceLang === "es-ES" ? "Voz inactiva" : "Voice inactive");
    };
    
    utterance.onerror = () => {
      setVoiceActive(false);
      setVoiceStatus(voiceLang === "es-ES" ? "Voz inactiva" : "Voice inactive");
    };
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(e.target as Node))
        setOrgDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
    setLinkingMode(tool === "link");
  };

  const handleNodeContextAction = (action: "view" | "filter" | "link") => {
    if (!nodeContextMenu) return;
    if (action === "view") setExpandedKpi(nodeContextMenu);
    else if (action === "filter") {
      const n = AURA_NODES.find(n => n.id === nodeContextMenu);
      if (n) setCurrentDept(n.name);
    } else if (action === "link") {
      setActiveTool("link");
      setLinkingMode(true);
    }
  };

  const getIcon = (name: string, active: boolean = false) => {
    const className = `w-4 h-4 transition-transform duration-300 ${active ? 'scale-110' : ''}`;
    switch (name) {
      case 'Target': return <Target className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Database': return <Database className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'CheckCircle2': return <CheckCircle2 className={className} />;
      case 'ZapOff': return <ZapOff className={className} />;
      case 'BarChart3': return <BarChart3 className={className} />;
      default: return <Target className={className} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      
      {/* STICKY MASTER VIEWPORT CONTROLLER moved to top navigation header */}


      {/* ─── VIEW 1: EXECUTIVE ARCHITECTURE MODE ────────────────────────────── */}
      {false && activeAppMode === 'architecture' && (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-4 relative overflow-hidden selection:bg-emerald-500/30 selection:text-white animate-fade-in">
          {/* Neo-Futuristic Background elements */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-900/5 rounded-full blur-[150px] animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0)_0%,rgba(2,6,23,0.8)_100%)] opacity-50" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>

          {/* Navigation / Header */}
          <nav className="fixed top-0 left-0 w-full z-50 glass-strong border-b border-emerald-500/10 p-4">
            <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-600 px-3 py-1 rounded text-white font-bold tracking-tighter text-sm shadow-[0_0_15px_rgba(16,185,129,0.4)]">ALRO SUPREME v4.0</div>
                <div className="hidden sm:flex flex-col">
                  <h1 className="text-xl font-bold text-white leading-none emerald-glow">Salesforce Agentforce Architecture</h1>
                  <p className="label-xs text-emerald-400 mt-1 uppercase tracking-[0.3em]">Inmunidad al Vibe Coding & Anti-Workslop Protocol</p>
                </div>
              </div>
              
              <div className="hidden md:flex gap-6 items-center text-[11px]">
                <a href="#dimensiones" className="text-slate-400 hover:text-emerald-400 font-bold uppercase transition-colors">Dimensiones</a>
                <a href="#tecnologia" className="text-slate-400 hover:text-emerald-400 font-bold uppercase transition-colors">Tecnología</a>
                <a href="#demo" className="text-emerald-400 hover:text-emerald-300 font-bold uppercase transition-colors flex items-center gap-1">
                  <Rocket size={12} /> Live Demo
                </a>
                <a href="#impacto" className="text-slate-400 hover:text-emerald-400 font-bold uppercase transition-colors">Impacto</a>
                <div className="flex flex-col items-end border-l border-emerald-500/20 pl-4">
                  <span className="text-slate-500 uppercase font-bold tracking-tighter">Environment</span>
                  <span className="text-white font-mono uppercase tracking-widest">PROD_DEMO_01</span>
                </div>
              </div>
              <button className="md:hidden text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>

          {/* Main Content Layout */}
          <div className="mt-20 max-w-screen-2xl mx-auto flex flex-col gap-12 relative z-10 p-6 md:p-12 pb-32">
            
            {/* 8 Nodos Section */}
            <section id="dimensiones" className="space-y-12">
              <div className="max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter emerald-glow leading-tight">
                  Arquitectura Inquebrantable de <span className="text-emerald-500">8 Nodos</span>
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Esta sección desglosa el núcleo tecnológico de <span className="text-white font-bold">ALRO SUPREME v4.0</span>. 
                  A diferencia de los sistemas RAG tradicionales, nuestra arquitectura utiliza un Motor de Razonamiento Agéntico (ToT) 
                  y anclaje epistemológico. Interactúa con los nodos a continuación para entender cómo garantizamos la 
                  equivalencia funcional y mitigamos el <span className="text-emerald-400 italic">"workslop"</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ARCHITECTURE_NODES.map((node, index) => (
                  <motion.button
                    key={node.id}
                    whileHover={{ scale: 1.02, translateY: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedNode(node)}
                    className={`relative group p-6 rounded-2xl border transition-all duration-500 text-left overflow-hidden h-full flex flex-col ${
                      selectedNode.id === node.id 
                      ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] shadow-emerald-500/20' 
                      : 'bg-slate-900/40 border-emerald-500/10 hover:border-emerald-500/30'
                    }`}
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <div className="text-6xl font-bold select-none">
                        {['➤', '⚛', '🔒', '🛡', '⚙', '⚖', '⏱', '🎯'][index]}
                      </div>
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                      <div className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        selectedNode.id === node.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {getIcon(node.icon, selectedNode.id === node.id)}
                      </div>
                      
                      <h3 className={`text-lg font-bold mb-2 leading-tight transition-colors ${selectedNode.id === node.id ? 'text-white' : 'text-slate-200'}`}>
                        {node.title}
                      </h3>
                      
                      <p className="text-xs text-slate-500 leading-relaxed flex-1">
                        {node.shortDescription}
                      </p>

                      <div className="mt-4 pt-4 border-t border-emerald-500/10 flex justify-between items-center">
                        <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase tracking-widest">{node.salesforceMapping.split('/')[0]}</span>
                        <ChevronRight size={14} className={`transition-transform duration-300 ${selectedNode.id === node.id ? 'translate-x-1 text-emerald-400' : 'text-slate-700'}`} />
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </motion.button>
                ))}
              </div>

              {/* Detailed Node View */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedNode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass p-8 md:p-12 rounded-3xl border border-emerald-500/20 relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="text-4xl text-emerald-500 font-bold">
                          {['➤', '⚛', '🔒', '🛡', '⚙', '⚖', '⏱', '🎯'][ARCHITECTURE_NODES.findIndex(n => n.id === selectedNode.id)]}
                        </div>
                        <div>
                          <h4 className="text-3xl font-black text-white emerald-glow">{selectedNode.title}</h4>
                          <p className="label-xs text-emerald-500 mt-1 uppercase tracking-[0.3em]">{selectedNode.salesforceMapping}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <p className="text-xl text-slate-300 leading-relaxed font-light">
                          {selectedNode.fullDescription}
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                            <span className="text-[10px] text-emerald-500 block font-bold uppercase tracking-widest mb-1">Functional Integrity</span>
                            <span className="text-white font-mono font-bold">100% SECURE</span>
                          </div>
                          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                            <span className="text-[10px] text-emerald-500 block font-bold uppercase tracking-widest mb-1">Hallucination Delta</span>
                            <span className="text-white font-mono font-bold">{"< 0.0001%"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 bg-slate-950/80 p-6 rounded-2xl border border-emerald-500/10 font-mono text-[10px] space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-slate-500 uppercase">Live Code Audit</span>
                        <span className="text-emerald-400">ACTIVE</span>
                      </div>
                      <div className="space-y-1 leading-relaxed">
                        <div className="text-emerald-500/60">while(node_executing) {"{"}</div>
                        <div className="pl-4 text-slate-400">verify_context(DataCloud.meta);</div>
                        <div className="pl-4 text-slate-400">apply_tot_branching(prob=0.98);</div>
                        <div className="pl-4 text-emerald-400 font-bold">emit_functional_eq();</div>
                        <div className="pl-4 text-slate-400">// Mitigation check passed</div>
                        <div className="text-emerald-500/60">{"}"}</div>
                      </div>
                      <div className="pt-4 flex justify-between items-center">
                        <div className="text-[9px] text-slate-600">TIMESTAMP: {new Date().toISOString().split('T')[1].split('.')[0]}</div>
                        <div className="px-2 py-0.5 bg-emerald-500/20 rounded text-emerald-400 font-bold">VERIFIED</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </section>

            {/* Task Queue / Operations Section */}
            <section id="tecnologia" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 glass p-6 rounded-2xl border border-emerald-500/10">
                <h3 className="label-xs text-emerald-400 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  Cola de Tareas Agénticas
                </h3>
                <div className="space-y-4">
                  {[
                    { t: 'Inmunidad al Vibe Coding', s: 'COMPLETADO', c: 'text-emerald-400' },
                    { t: 'Mapeo Multidimensional SF', s: 'EJECUTANDO', c: 'text-amber-400' },
                    { t: 'Mitigación Workslop V4', s: 'ESPERA', c: 'text-slate-500' },
                    { t: 'Sincronización Data Cloud', s: 'OK', c: 'text-emerald-400' },
                  ].map((task, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-white/5 hover:border-emerald-500/20 transition-all">
                      <span className="text-[11px] font-bold text-slate-300">{task.t}</span>
                      <span className={`text-[9px] font-mono font-bold ${task.c}`}>{task.s}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 btn-neo text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <Workflow size={12} /> Ejecutar Lote
                </button>
              </div>

              <div className="lg:col-span-8 glass p-8 rounded-2xl border border-emerald-500/10 flex flex-col justify-center items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/[0.02] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,rgba(16,185,129,0)_70%)]" />
                <div className="relative z-10 text-center max-w-lg">
                  <div className="mb-6 mx-auto w-24 h-24 rounded-full border-2 border-emerald-500/20 flex items-center justify-center relative overflow-hidden group-hover:border-emerald-500/50 transition-colors duration-700">
                    <Activity className="text-emerald-500 w-10 h-10 emerald-pulse" />
                    <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3">Motor de Equivalencia Funcional</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Nivel de precisión auditada contra operadores expertos de Salesforce. 
                    ALRO garantiza que el resultado agéntico es idéntico o superior al manual.
                  </p>
                  <div className="mt-8 flex justify-center gap-12">
                    <div>
                      <div className="text-3xl font-mono font-black text-white">0.98</div>
                      <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Consistency EQ</div>
                    </div>
                    <div>
                      <div className="text-3xl font-mono font-black text-white">99.9%</div>
                      <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Uptime SLA</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Live Demo Section */}
            <section id="demo" className="glass p-8 border border-emerald-500/10 rounded-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 emerald-glow">
                    <Rocket className="inline-block mr-2 mb-1 w-6 h-6" /> Live Demo Dashboard
                  </h2>
                  <p className="label-xs text-slate-500">Manual de despliegue y viaje para la presentación ante jueces</p>
                </div>
                
                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <button 
                    onClick={() => setActiveDemoTab('journey')}
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase transition-all rounded ${activeDemoTab === 'journey' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Journey Map
                  </button>
                  <button 
                    onClick={() => setActiveDemoTab('requirements')}
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase transition-all rounded ${activeDemoTab === 'requirements' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Requirements
                  </button>
                  <button 
                    onClick={() => setActiveDemoTab('deployment')}
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase transition-all rounded ${activeDemoTab === 'deployment' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Deployment
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-9">
                  <AnimatePresence mode="wait">
                    {activeDemoTab === 'journey' && (
                      <motion.div 
                        key="journey"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {JOURNEY_MAP.map((step, idx) => (
                            <div key={idx} className="bg-slate-950/50 p-5 rounded-xl border border-emerald-500/5 hover:border-emerald-500/20 transition-all">
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-widest">{step.phase}</span>
                                <span className="flex items-center gap-1 text-slate-500 font-mono text-[10px] font-bold"><Clock size={10} /> {step.duration}</span>
                              </div>
                              <div className="space-y-3">
                                {step.items.map((item, i) => (
                                  <div key={i} className="border-l border-slate-800 pl-3 py-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-white text-xs font-bold">{item.title}</span>
                                      {item.critical && <span className="text-[8px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Crítico</span>}
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{item.description}</p>
                                    <div className="text-[9px] text-emerald-600/50 font-mono mt-1 italic">{item.techDetails}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeDemoTab === 'requirements' && (
                      <motion.div 
                        key="requirements"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {REQUIREMENTS.map((req, idx) => (
                          <div key={idx} className="bg-slate-950/50 p-6 rounded-xl border border-emerald-500/5">
                            <h4 className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">{req.category}</h4>
                            <div className="space-y-4">
                              {req.items.map((item, i) => (
                                <div key={i} className="flex gap-3">
                                  {item.status === 'required' ? <CheckCircle size={14} className="text-emerald-500 mt-1 shrink-0" /> : <AlertCircle size={14} className="text-blue-500 mt-1 shrink-0" />}
                                  <div>
                                    <div className="text-white text-xs font-bold">{item.label}</div>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{item.description}</p>
                                    <span className={`text-[8px] uppercase font-bold mt-1 inline-block ${item.status === 'required' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                      {item.status.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {activeDemoTab === 'deployment' && (
                      <motion.div 
                        key="deployment"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        {DEPLOYMENT_STEPS.map((phase, idx) => (
                          <div key={idx} className="flex gap-6 items-start group">
                            <div className="w-24 shrink-0 text-[10px] font-bold text-slate-600 font-mono uppercase pt-1 tracking-tighter transition-colors group-hover:text-emerald-500">
                              {phase.phase}
                            </div>
                            <div className="flex-1 space-y-2 border-l border-emerald-500/10 pl-6 pb-6">
                              {phase.steps.map((step, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs text-slate-300">
                                  <span className="text-emerald-500/40 text-[10px] font-mono">0{i+1}</span>
                                  {step}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                          <h4 className="text-white text-xs font-bold mb-3 flex items-center gap-2">
                            <FileText size={14} className="text-emerald-400" /> Tips para el Éxito
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {['Mantener la calma', 'Hablar con confianza', 'Foco en el valor', 'Ser honesto', 'Timing perfecto', 'Energía y pasión'].map((tip, i) => (
                              <div key={i} className="text-[10px] text-slate-400 flex items-center gap-2">
                                <div className="w-1 h-1 bg-emerald-500 rounded-full" /> {tip}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick Stats Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="glass p-5 rounded-xl border border-emerald-500/10">
                    <h4 className="label-xs text-slate-500 mb-4">Quick Stats</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400">Duración</span>
                        <span className="text-xs font-mono font-bold text-white">25 MIN</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400">Casos en Vivo</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">03</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400">Éxito Avg</span>
                        <span className="text-xs font-mono font-bold text-white">94.2%</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-5 rounded-xl border border-emerald-500/10">
                    <h4 className="label-xs text-slate-500 mb-4">Demo Status</h4>
                    <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                        <div className="status-dot bg-emerald-500" /> SALESFORCE_OK
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                        <div className="status-dot bg-emerald-500" /> DATA_CLOUD_SYNC
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                        <div className="status-dot bg-emerald-500" /> ENGINE_READY
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/10 flex items-center justify-center gap-2">
                    <Workflow size={14} /> Iniciar Demo Run
                  </button>
                </div>
              </div>
            </section>

            {/* ROI & Performance Impact Section */}
            <section id="impacto" className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-bold text-white mb-2 emerald-glow underline decoration-emerald-500/20 decoration-4 underline-offset-8 uppercase tracking-tighter">Impacto & Performance Analytics</h2>
                  <p className="label-xs text-slate-500 mt-4">Visualización en tiempo real de la eficiencia agéntica y robustez del sistema</p>
                </div>
                <div className="bg-slate-950/80 px-6 py-3 border border-emerald-500/20 rounded-xl backdrop-blur-md shadow-xl flex gap-8 items-center">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest block mb-1">AGGREGATE_ROI</span>
                    <span className="text-3xl font-display font-bold text-emerald-400 tracking-tighter">$94.1M</span>
                  </div>
                  <div className="border-l border-white/5 pl-8">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest block mb-1">CATCH_RATE</span>
                    <span className="text-3xl font-display font-bold text-white tracking-tighter">100%</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ROI Bar Chart */}
                <div className="lg:col-span-1 glass p-6 rounded-2xl border border-emerald-500/10">
                  <h4 className="label-xs text-emerald-500/60 mb-6">ROI por Vertical ($M)</h4>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ROI_DATA}>
                        <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}M`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', fontSize: '11px' }}
                          cursor={{ fill: 'rgba(16, 185, 129, 0.02)' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                          {ROI_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Latency Area Chart */}
                <div className="lg:col-span-1 glass p-6 rounded-2xl border border-emerald-500/10">
                  <h4 className="label-xs text-emerald-500/60 mb-6">Latencia del Motor (p95 ms)</h4>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={LATENCY_DATA}>
                        <defs>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', fontSize: '11px' }}
                        />
                        <Area type="monotone" dataKey="val" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Radar Chart: Security/Robustness */}
                <div className="lg:col-span-1 glass p-6 rounded-2xl border border-emerald-500/10">
                  <h4 className="label-xs text-emerald-500/60 mb-6">Inmunidad al Workslop</h4>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={WORKSLOP_RADAR}>
                        <PolarGrid stroke="#1e293b" />
                        <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                        <Radar
                          name="ALRO Supreme"
                          dataKey="A"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.4}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer info */}
            <footer className="mt-8 pt-4 border-t border-emerald-500/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 font-mono font-bold tracking-tighter uppercase">
              <div className="flex gap-8">
                <span className="flex items-center gap-2 group cursor-help"><span className="status-dot bg-emerald-500 emerald-pulse"></span> <span className="group-hover:text-emerald-400 transition-colors">Trust Layer: Active</span></span>
                <span className="flex items-center gap-2 group cursor-help"><span className="status-dot bg-emerald-500 emerald-pulse"></span> <span className="group-hover:text-emerald-400 transition-colors">Data Cloud: Connected</span></span>
                <span className="flex items-center gap-2 group cursor-help"><span className="status-dot bg-emerald-500 emerald-pulse"></span> <span className="group-hover:text-emerald-400 transition-colors">Apex Engine: Ready</span></span>
              </div>
              <div className="flex gap-6 items-center">
                <span className="text-slate-700">TIMESTAMP: 2026-05-14T21:30:24Z</span>
                <span className="text-emerald-900 font-black tracking-[0.2em]">ALRO_SUPREME_BOOT_V4.0.2</span>
              </div>
            </footer>
          </div>
        </div>
      )}


      {/* ─── VIEW 2: OPERATIONAL WORKBENCH MODE ────────────────────────────── */}
      {(activeAppMode === 'operational' || activeAppMode === 'architecture') && (
        <motion.div
          layout="position"
          className="min-h-screen select-none relative"
          style={{
            color: isDark ? "#2c3e50" : "#0d2b22",
            fontFamily: "'Exo 2', 'Inter', sans-serif",
          }}
        >
          {/* Animated Background Overlays */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <motion.div
              initial={false}
              animate={{ opacity: isDark ? 1 : 0 }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, #f4f8fc 0%, #eef3f8 100%)" }}
            />
            <motion.div
              initial={false}
              animate={{ opacity: !isDark ? 1 : 0 }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, #f3f7fc 0%, #eef3f8 100%)" }}
            />
          </div>

          {/* Animated Ambient Glowing Highlights */}
          <AnimatePresence>
            {isDark ? (
              <motion.div
                key="dark-bg-highlights"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
                className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
              >
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-200/35 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/45 rounded-full blur-[150px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,rgba(238,243,248,0.9)_100%)] opacity-70" />
                <div className="absolute inset-0 bg-[radial-gradient(#abc6df_1.5px,transparent_1.5px)] bg-[size:32px_32px] opacity-[0.22]" />
              </motion.div>
            ) : (
              <motion.div
                key="light-bg-highlights"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
                className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
              >
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-200/25 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/35 rounded-full blur-[150px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3)_0%,rgba(238,243,248,0.95)_100%)] opacity-70" />
                <div className="absolute inset-0 bg-[radial-gradient(#abc6df_1.5px,transparent_1.5px)] bg-[size:32px_32px] opacity-[0.18]" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10">
            {/* Sticky header */}
          <div className="sticky top-0 z-30">
            <HudLedger />
            <nav className="px-5 py-3" style={G.nav}>
              <div className="flex items-center justify-between gap-3">
                {/* LEFT: User / Org & Mode Selectors */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* ADMIN recuadro */}
                  <div ref={orgDropdownRef} className="relative">
                    <motion.button
                      onClick={() => setOrgDropdownOpen(p => !p)}
                      className="flex items-center gap-2.5 p-2 pr-3 rounded-2xl"
                      style={G.card}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669]
                        flex items-center justify-center text-white text-sm font-bold flex-shrink-0">A</div>
                      <div className="flex flex-col items-start leading-none gap-0.5">
                        <span className="text-sm font-semibold" style={{ color: "#0d1f1a" }}>Admin</span>
                        <span className="text-[9px] flex items-center gap-1" style={{ color: "#7a9a8d" }}>
                          <Building2 style={{ width: 9, height: 9 }} />
                          <span>Organización de mi departamento</span>
                          <span style={{ color: "#10b981", fontWeight: 700 }}>· {currentDept}</span>
                        </span>
                      </div>
                      <motion.div animate={{ rotate: orgDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-3.5 h-3.5" style={{ color: "#1e3a8a" }} />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {orgDropdownOpen && (
                        <motion.div
                          className="absolute left-0 top-full mt-2 w-56 rounded-2xl z-50 overflow-hidden"
                          style={G.cardDeep}
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.18 }}
                        >
                          <div className="px-4 py-3"
                            style={{ borderBottom: "1px solid rgba(16,185,129,0.08)" }}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669]
                                flex items-center justify-center text-white text-sm font-bold flex-shrink-0">A</div>
                              <div>
                                <p className="text-sm font-semibold" style={{ color: "#0d1f1a" }}>Admin User</p>
                                <p className="text-xs" style={{ color: "#7a9a8d" }}>admin@arlo.io</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            <p className="text-[9px] uppercase tracking-widest px-2 py-1"
                              style={{ color: "#7a9a8d" }}>
                              Organización / Departamento
                            </p>
                            {ORG_DEPTS.map(dept => (
                              <button key={dept}
                                onClick={() => { setCurrentDept(dept); setOrgDropdownOpen(false); }}
                                className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-sm"
                                style={{
                                  color: currentDept === dept ? "#1e3a8a" : "#4a7268",
                                  fontWeight: currentDept === dept ? 600 : 400,
                                  transition: "background 0.1s",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = "rgba(16,185,129,0.06)")}
                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                              >
                                {dept}
                                {currentDept === dept && <Check className="w-3 h-3" style={{ color: "#1e3a8a" }} />}
                              </button>
                            ))}
                          </div>
                          <div className="p-2 pt-0">
                            <motion.button
                              onClick={() => { setShareOpen(true); setOrgDropdownOpen(false); }}
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                              style={{ background: "linear-gradient(135deg,#1e3a8a,#3b82f6)" }}
                              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            >
                              <Share2 className="w-3.5 h-3.5" /> Compartir Vista
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Icon 3: Operaciones (Expandable) */}
                  <div className="relative">
                    <motion.button
                      onClick={() => {
                        setActiveAppMode('operational');
                        setIsOpsOpen(prev => !prev);
                        setIsArchOpen(false);
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-full relative overflow-hidden h-[48px]"
                      style={{
                        ...G.card,
                        background: activeAppMode === 'operational' ? "rgba(6, 182, 212, 0.12)" : G.card.background,
                        border: activeAppMode === 'operational' ? "1.5px solid #22d3ee" : "1px solid rgba(6, 182, 212, 0.15)",
                        boxShadow: activeAppMode === 'operational' ? "3px 3px 8px rgba(34, 211, 238, 0.3), -2px -2px 6px rgba(255,255,255,0.9)" : "3px 3px 6px rgba(165, 185, 210, 0.2), -2px -2px 6px rgba(255,255,255,0.9)",
                      }}
                      animate={{ width: isOpsOpen ? "auto" : "48px" }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Operaciones (Light)"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white flex-shrink-0 shadow-[0_2px_8px_rgba(6,182,212,0.3)]">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <AnimatePresence initial={false}>
                        {isOpsOpen && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex items-center gap-2 whitespace-nowrap overflow-hidden pr-2"
                          >
                            <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                              OPERACIONES
                            </span>
                            <span className="text-[7.5px] font-black uppercase tracking-widest text-cyan-500 bg-cyan-100/60 dark:bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/10">
                              LIGHT
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>

              </div>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex w-full min-h-screen relative">
            
            {/* LEFT SIDEBAR: Sticky and glassy */}
            <SidebarGlass
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              activeAppMode={activeAppMode}
              setActiveAppMode={setActiveAppMode}
              voiceActive={voiceActive}
              setVoiceActive={setVoiceActive}
              vetoActive={vetoActive}
              setVetoActive={setVetoActive}
              hasRedError={hasRedError}
              currentDept={currentDept}
              setCurrentDept={setCurrentDept}
              orgDepts={ORG_DEPTS}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />

            {activeAppMode === 'architecture' ? (
              /* DEDICATED NEUMORPHIC & GLASSMORPHISM ARCHITECTURE VIEW (100% Segoe UI, Light Mode) */
              <div className="flex flex-1 min-h-screen relative font-sans">
                {/* Main panel - Structured as Top Header -> Calendar Widget -> Structured KPI Metric Cards Grid */}
                <div className="flex-1 p-8 space-y-6 overflow-y-auto h-[calc(100vh-72px)] pb-32">
                  
                  {/* Top Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-blue-100/60 text-left">
                    <div>
                      <h1 className="text-2xl font-black text-blue-950 tracking-tight" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                        ALRO Supreme - Arquitectura Page
                      </h1>
                      <p className="text-xs text-[#5b7290] mt-1 font-medium" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                        Salesforce Agentforce Architecture & Trust Layer Overview in Light Mode
                      </p>
                    </div>

                    {/* Minimal status bar next to title */}
                    <div className="flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-emerald-800 text-[10px] font-bold" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Trust Layer Security Enabled</span>
                    </div>
                  </div>

                  {/* Clean Minimalist Calendar Widget */}
                  <div 
                    className="p-5 rounded-3xl space-y-3"
                    style={{
                      background: "rgba(240, 246, 255, 0.48)",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      border: "1px solid rgba(255, 255, 255, 0.7)",
                      boxShadow: "10px 10px 24px rgba(150, 175, 205, 0.22), -10px -10px 24px rgba(255, 255, 255, 0.95), inset 2px 2px 5px rgba(255, 255, 255, 0.75)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <h4 className="text-xs font-bold text-blue-950 uppercase tracking-widest" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                          Cronograma de Ejecución Sinc
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 font-mono">Julio 2026</span>
                    </div>

                    {/* Horizontal Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {[
                        { day: "Lun", date: 12 },
                        { day: "Mar", date: 13 },
                        { day: "Mié", date: 14 },
                        { day: "Jue", date: 15 },
                        { day: "Vie", date: 16 },
                        { day: "Sáb", date: 17 },
                        { day: "Dom", date: 18 },
                      ].map((d) => {
                        const isDaySelected = selectedDay === d.date;
                        const hasEvent = CALENDAR_EVENTS[d.date] !== undefined;
                        return (
                          <button
                            key={d.date}
                            onClick={() => setSelectedDay(d.date)}
                            className="p-2.5 rounded-2xl transition-all border flex flex-col items-center justify-center gap-1"
                            style={{
                              background: isDaySelected 
                                ? "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)" 
                                : "rgba(255, 255, 255, 0.45)",
                              borderColor: isDaySelected ? "rgba(14, 165, 233, 0.25)" : "rgba(255, 255, 255, 0.6)",
                              boxShadow: isDaySelected
                                ? "inset 1px 1px 3px rgba(255,255,255,0.8), 2px 2px 6px rgba(14, 165, 233, 0.1)"
                                : "3px 3px 8px rgba(165, 185, 210, 0.1), -2px -2px 6px rgba(255,255,255,0.9)",
                            }}
                          >
                            <span className="text-[9px] font-semibold text-slate-400" style={{ fontFamily: "'Segoe UI', sans-serif" }}>{d.day}</span>
                            <span className="text-sm font-bold text-blue-950" style={{ fontFamily: "'Segoe UI', sans-serif" }}>{d.date}</span>
                            {hasEvent && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Calendar Event Description */}
                    <AnimatePresence mode="wait">
                      {selectedDay && CALENDAR_EVENTS[selectedDay] && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="p-3 rounded-2xl bg-white/50 border border-white/80 flex items-center justify-between text-left"
                          style={{ boxShadow: "inset 1px 1px 3px rgba(165,185,210,0.05)" }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                            <div>
                              <p className="text-xs font-bold text-blue-950" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                                {CALENDAR_EVENTS[selectedDay].title}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                                Hora: {CALENDAR_EVENTS[selectedDay].time}
                              </p>
                            </div>
                          </div>
                          <span className="text-[8px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-500/10">
                            {CALENDAR_EVENTS[selectedDay].tag}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Premium KPI Metric Cards Structured Grid (Real-time Salesforce Data Visualization) */}
                  <div className="space-y-3.5 text-left">
                    <p className="text-[11px] font-bold uppercase tracking-widest pl-1 text-[#5b7290]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                      Visualizaciones de Salesforce Data Cloud & Trust Layer
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          id: "intent",
                          title: "Intent Vector",
                          subtitle: "Intención de Inicialización",
                          metric: "94.2%",
                          trend: "+3.2%",
                          positive: true,
                          color: "#0284c7",
                        },
                        {
                          id: "workslop",
                          title: "Hallucination Delta",
                          subtitle: "Mitigación de Workslop",
                          metric: "< 0.001%",
                          trend: "SECURE",
                          positive: true,
                          color: "#10b981",
                        },
                        {
                          id: "latency",
                          title: "Sync Latency",
                          subtitle: "Velocidad de Sincronización",
                          metric: "12ms",
                          trend: "-2.5%",
                          positive: true,
                          color: "#3b82f6",
                        },
                        {
                          id: "awu",
                          title: "Agentic Work Units",
                          subtitle: "Unidades de Trabajo AWU",
                          metric: "127 Done",
                          trend: "+8.2%",
                          positive: true,
                          color: "#8b5cf6",
                        },
                        {
                          id: "equivalence",
                          title: "Functional Equivalence",
                          subtitle: "SLA de Equivalencia",
                          metric: "99.99%",
                          trend: "VERIFIED",
                          positive: true,
                          color: "#f59e0b",
                        },
                        {
                          id: "unlearning",
                          title: "GDPR Obliteration",
                          subtitle: "Machine Unlearning SLA",
                          metric: "< 100ms",
                          trend: "PASS",
                          positive: true,
                          color: "#ef4444",
                        },
                        {
                          id: "consistency",
                          title: "Consistency Index",
                          subtitle: "Calibración HTC/AUQ",
                          metric: "0.98",
                          trend: "EXCELLENT",
                          positive: true,
                          color: "#06b6d4",
                        },
                        {
                          id: "objects",
                          title: "Salesforce Metadata",
                          subtitle: "Objetos de Salesforce",
                          metric: "14 Active",
                          trend: "+1 New",
                          positive: true,
                          color: "#6366f1",
                        },
                      ].map((kpi) => {
                        const isNodeHighlighted = selectedNode?.salesforceMapping?.toLowerCase().includes(kpi.title.toLowerCase()) || selectedNode?.title?.toLowerCase().includes(kpi.title.toLowerCase());
                        return (
                          <motion.div
                            key={kpi.id}
                            className="p-4 rounded-3xl flex flex-col justify-between border transition-all h-[150px]"
                            style={{
                              background: isNodeHighlighted ? "rgba(224, 242, 254, 0.65)" : "rgba(255, 255, 255, 0.48)",
                              borderColor: isNodeHighlighted ? "rgba(14, 165, 233, 0.4)" : "rgba(255, 255, 255, 0.75)",
                              boxShadow: isNodeHighlighted
                                ? "inset 1px 1px 3px rgba(255,255,255,0.9), 0 8px 24px rgba(14, 165, 233, 0.12)"
                                : "10px 10px 24px rgba(150, 175, 205, 0.15), -10px -10px 24px rgba(255, 255, 255, 0.95), inset 2px 2px 5px rgba(255, 255, 255, 0.75)",
                            }}
                            whileHover={{ scale: 1.02, boxShadow: "12px 12px 28px rgba(150, 175, 205, 0.22), -12px -12px 28px rgba(255, 255, 255, 0.95)" }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="min-w-0">
                                <p className="text-[10px] font-semibold text-[#5b7290] truncate" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                                  {kpi.subtitle}
                                </p>
                                <h3 className="text-sm font-bold text-blue-950 mt-0.5 truncate" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                                  {kpi.title}
                                </h3>
                              </div>
                              <span 
                                className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md"
                                style={{
                                  background: `${kpi.color}15`,
                                  color: kpi.color,
                                  border: `1px solid ${kpi.color}30`,
                                  fontFamily: "'Segoe UI', sans-serif",
                                }}
                              >
                                {kpi.trend}
                              </span>
                            </div>

                            <div className="mt-4">
                              <p className="text-2xl font-black text-blue-950 tracking-tight leading-none" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                                {kpi.metric}
                              </p>
                              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-2.5">
                                <motion.div 
                                  className="h-full rounded-full" 
                                  style={{ background: kpi.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: "70%" }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Selected Node Highlight Details Card */}
                  {selectedNode && (
                    <motion.div 
                      className="p-5 rounded-3xl border relative overflow-hidden text-left"
                      style={{
                        background: "rgba(255, 255, 255, 0.55)",
                        borderColor: "rgba(255, 255, 255, 0.8)",
                        boxShadow: "10px 10px 24px rgba(150, 175, 205, 0.15), -10px -10px 24px rgba(255, 255, 255, 0.95), inset 2px 2px 5px rgba(255, 255, 255, 0.75)",
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-3.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                          ★
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-blue-950" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                            Detalle Técnico: {selectedNode.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Salesforce Mapping: {selectedNode.salesforceMapping}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                        {selectedNode.fullDescription}
                      </p>
                    </motion.div>
                  )}

                </div>
              </div>
            ) : (
              /* MAIN DASHBOARD CONTENT AREA */
              <div className="flex-1 p-6 pb-36 pr-10 overflow-x-hidden relative">
              
              {/* Welcome strip */}
              <motion.div className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-[#1e3a8a]">{currentDept} System Status</h2>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl" style={G.inset}>
                  {AURA_NODES.map(node => (
                    <motion.button key={node.id}
                      title={`${node.name} · ${node.confidence}%`}
                      onClick={() => setExpandedKpi(node.id)}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: node.color, boxShadow: `0 0 ${node.confidence >= 94 ? "5px" : "2px"} ${node.color}` }}
                      whileHover={{ scale: 1.5 }} />
                  ))}
                  <motion.span
                    className="text-[9px] font-bold ml-1 uppercase tracking-[0.2em]"
                    style={{ color: "#2563eb", display: "inline-block" }}
                    animate={{
                      scale: [1, 1.15, 1, 1.15, 1],
                      opacity: [1, 0.7, 1, 0.7, 1],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.12, 0.24, 0.38, 1]
                    }}
                  >
                    LIVE
                  </motion.span>
                </div>
              </motion.div>

              {/* CORE DASHBOARD GRID: Left Main Columns + Right Metrics Column */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start"
              >
                
                {/* Left Columns (3/4 of screen width) */}
                <div className="lg:col-span-3 space-y-6">
                  
                  {/* Top 4 Modular Cards Row (Grouped Voice & Sync Suite) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    
                    {/* Card 1: Voice Session (Interactive Glassmorphic 3D Voice Portal) */}
                    <motion.div
                      variants={itemVariants}
                      className="p-5 rounded-3xl flex flex-col justify-between min-h-[260px] relative overflow-hidden"
                      style={{
                        background: "rgba(255, 255, 255, 0.55)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                        border: "1px solid rgba(255, 255, 255, 0.9)",
                        boxShadow: "14px 14px 30px rgba(165, 185, 210, 0.4), -14px -14px 30px rgba(255, 255, 255, 0.95), inset 1px 1px 3px rgba(255, 255, 255, 0.95)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Voice Session</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] font-bold uppercase text-[#2563eb] tracking-wide">{voiceActive ? "LISTENING" : "STANDBY"}</span>
                          <span className={`w-2 h-2 rounded-full ${voiceActive ? "bg-cyan-500 animate-ping" : "bg-slate-300"}`} />
                        </div>
                      </div>
                      
                      {/* Beautiful Symmetrical Glass Portal Center-stage with Dynamic Audio Waves */}
                      <div className="flex items-center justify-center py-2 relative h-32 w-full select-none">
                        
                        {/* Waveform Bars - Left Side (8 bars) */}
                        <div className="flex items-center gap-1 absolute left-1.5 justify-end w-[calc(50%-50px)]">
                          {Array.from({ length: 8 }).map((_, i) => {
                            const bandIndex = 7 - i;
                            const heightFactor = micFrequencies[bandIndex] || 0.08;
                            const baseWeight = (i + 1) / 8; // increases towards center
                            const finalHeight = Math.max(4, heightFactor * 36 * baseWeight);
                            return (
                              <motion.div
                                key={`wave-l-${i}`}
                                className="w-1 rounded-full"
                                style={{
                                  background: voiceActive 
                                    ? "linear-gradient(180deg, #22d3ee 0%, #0284c7 100%)" 
                                    : "rgba(148, 163, 184, 0.25)",
                                  boxShadow: voiceActive 
                                    ? "0 0 6px rgba(34, 211, 238, 0.4)" 
                                    : "none",
                                  height: `${finalHeight}px`,
                                }}
                                animate={voiceActive ? {} : { height: "4px" }}
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                              />
                            );
                          })}
                        </div>

                        {/* Centered Glass Concentric Portal Plate (2x Larger and Interactive!) */}
                        <motion.button
                          onClick={toggleVoice}
                          type="button"
                          className="relative w-24 h-24 rounded-full flex items-center justify-center z-10 cursor-pointer outline-none border-none select-none overflow-hidden transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Shimmery concentric lines mimicking Fresnel lens/vinyl disk grooves */}
                          <div 
                            className="absolute inset-0 rounded-full pointer-events-none transition-all duration-500"
                            style={{
                              background: voiceActive 
                                ? "radial-gradient(circle, #e0f2fe 0%, #38bdf8 35%, #0284c7 70%, #1d4ed8 100%)"
                                : "radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(224,242,254,0.3) 45%, rgba(186,230,253,0.15) 70%, rgba(255,255,255,0.9) 100%)",
                              border: voiceActive
                                ? "2.5px solid rgba(14, 165, 233, 0.85)"
                                : "1px solid rgba(255,255,255,0.95)",
                              boxShadow: voiceActive
                                ? "0 0 25px rgba(14, 165, 233, 0.7), inset 2px 2px 6px rgba(255,255,255,0.7), inset -2px -2px 6px rgba(0,0,0,0.25)"
                                : "inset 2px 2px 5px rgba(255,255,255,0.9), inset -2px -2px 5px rgba(0,0,0,0.06), 4px 4px 10px rgba(165,185,210,0.25), -4px -4px 10px rgba(255,255,255,0.9)",
                            }}
                          />
                          {/* Ring layers of grooves */}
                          {Array.from({ length: 5 }).map((_, rIdx) => (
                            <div 
                              key={rIdx}
                              className="absolute rounded-full pointer-events-none"
                              style={{
                                width: `${20 + rIdx * 15}px`,
                                height: `${20 + rIdx * 15}px`,
                                border: voiceActive 
                                  ? "1px solid rgba(255, 255, 255, 0.15)"
                                  : "1px solid rgba(148, 163, 184, 0.1)",
                              }}
                            />
                          ))}

                          {/* Central Rotating Shine Accent */}
                          <motion.div 
                            className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                          />

                          {/* Micro-shimmer Dot inside */}
                          <div className="absolute top-2.5 left-6 w-3 h-1 bg-white/45 rounded-full blur-[1px] transform -rotate-12 pointer-events-none" />

                          {/* Custom Mic Icon 2x Larger! */}
                          <div className="relative z-20 pointer-events-none">
                            <CustomMicVoiceIcon 
                              className={`w-11 h-11 drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)] transition-all duration-300 ${
                                voiceActive ? "text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.95)]" : "text-slate-400"
                              }`} 
                            />
                          </div>
                        </motion.button>

                        {/* Waveform Bars - Right Side (8 bars) */}
                        <div className="flex items-center gap-1 absolute right-1.5 justify-start w-[calc(50%-50px)]">
                          {Array.from({ length: 8 }).map((_, i) => {
                            const bandIndex = i;
                            const heightFactor = micFrequencies[bandIndex] || 0.08;
                            const baseWeight = (8 - i) / 8; // increases towards center
                            const finalHeight = Math.max(4, heightFactor * 36 * baseWeight);
                            return (
                              <motion.div
                                key={`wave-r-${i}`}
                                className="w-1 rounded-full"
                                style={{
                                  background: voiceActive 
                                    ? "linear-gradient(180deg, #22d3ee 0%, #0284c7 100%)" 
                                    : "rgba(148, 163, 184, 0.25)",
                                  boxShadow: voiceActive 
                                    ? "0 0 6px rgba(34, 211, 238, 0.4)" 
                                    : "none",
                                  height: `${finalHeight}px`,
                                }}
                                animate={voiceActive ? {} : { height: "4px" }}
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                              />
                            );
                          })}
                        </div>

                      </div>

                      {/* Action buttons side-by-side (Mic Toggle & Lock Safety Switch) matching the uploaded design */}
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        
                        {/* 1. Mic Trigger Button */}
                        <motion.button
                          onClick={toggleVoice}
                          className="py-2.5 px-3 rounded-full flex items-center justify-center gap-2 border font-bold text-xs select-none outline-none transition-all"
                          style={{
                            background: voiceActive 
                              ? "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)" 
                              : "rgba(241, 245, 249, 0.85)",
                            borderColor: voiceActive 
                              ? "rgba(14, 165, 233, 0.25)" 
                              : "rgba(203, 213, 225, 0.5)",
                            color: voiceActive ? "#0369a1" : "#475569",
                            boxShadow: voiceActive
                              ? "inset 1.5px 1.5px 3px rgba(255,255,255,0.8), 2px 2px 6px rgba(14, 165, 233, 0.12)"
                              : "3px 3px 6px rgba(165, 185, 210, 0.25), -2px -2px 6px rgba(255,255,255,0.9)",
                          }}
                          whileHover={{ scale: 1.04, boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.8), 2px 2px 4px rgba(165, 185, 210, 0.1)" }}
                          whileTap={{ scale: 0.96, boxShadow: "inset 2px 2px 5px rgba(165, 185, 210, 0.2), inset -2px -2px 5px rgba(255,255,255,0.9)" }}
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span>{voiceActive ? "ON" : "MIC"}</span>
                        </motion.button>

                        {/* 2. Lock Safety Button */}
                        <motion.button
                          onClick={() => setVetoActive(prev => !prev)}
                          className="py-2.5 px-3 rounded-full flex items-center justify-center gap-2 border font-bold text-xs select-none outline-none transition-all"
                          style={{
                            background: vetoActive 
                              ? "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)" 
                              : "rgba(241, 245, 249, 0.85)",
                            borderColor: vetoActive 
                              ? "rgba(239, 68, 68, 0.25)" 
                              : "rgba(203, 213, 225, 0.5)",
                            color: vetoActive ? "#b91c1c" : "#475569",
                            boxShadow: vetoActive
                              ? "inset 1.5px 1.5px 3px rgba(255,255,255,0.8), 2px 2px 6px rgba(239, 68, 68, 0.12)"
                              : "3px 3px 6px rgba(165, 185, 210, 0.25), -2px -2px 6px rgba(255,255,255,0.9)",
                          }}
                          whileHover={{ scale: 1.04, boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.8), 2px 2px 4px rgba(165, 185, 210, 0.1)" }}
                          whileTap={{ scale: 0.96, boxShadow: "inset 2px 2px 5px rgba(165, 185, 210, 0.2), inset -2px -2px 5px rgba(255,255,255,0.9)" }}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{vetoActive ? "VETO" : "LOCK"}</span>
                        </motion.button>

                      </div>

                      {/* Info limit stats */}
                      <div className="flex items-center justify-between text-[8px] font-mono font-bold text-slate-400 mt-2.5 px-1">
                        <span>{voiceActive ? "AUDIO STREAM CAPTURE ACTIVE" : "MICROPHONE STANDBY"}</span>
                        <span>02:00:00 max</span>
                      </div>
                    </motion.div>

                    {/* Card 2: Voice Interaction Metrics (Distinct Glassmorphic Card!) */}
                    <motion.div variants={itemVariants}>
                      <VoiceMetricsCard />
                    </motion.div>

                    {/* Card 3: Voice Command Queue (Distinct, uncluttered card!) */}
                    <motion.div variants={itemVariants}>
                      <VoiceCommandQueue />
                    </motion.div>

                    {/* Card 4: Worker Sessions Card (Interactive company workers sessions) */}
                    <motion.div variants={itemVariants}>
                      <WorkerSessionsCard />
                    </motion.div>

                  </div>

                  {/* Weekly Timeline & Floating Transparent Pill */}
                  <motion.div variants={itemVariants} className="w-full">
                    <MilestonesTimeline />
                  </motion.div>

                </div>

                {/* Right Column (1/4 of screen width) */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Top Round Glass Buttons Bar */}
                  <motion.div variants={itemVariants} className="flex justify-end gap-2.5">
                    {["Search", "Settings", "Profile", "Notifications"].map((btnLabel, i) => (
                      <button
                        key={i}
                        title={btnLabel}
                        className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center hover:bg-white/80 transition-all border border-white/80 relative"
                        style={{
                          boxShadow: "3px 3px 8px rgba(165, 185, 210, 0.2), -3px -3px 8px rgba(255,255,255,0.9)",
                        }}
                      >
                        {i === 0 && <Search className="w-4 h-4 text-[#1e3a8a]" />}
                        {i === 1 && <Settings className="w-4 h-4 text-[#1e3a8a]" />}
                        {i === 2 && <Users className="w-4 h-4 text-[#1e3a8a]" />}
                        {i === 3 && (
                          <>
                            <Bell className="w-4 h-4 text-[#1e3a8a]" />
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                              3
                            </span>
                          </>
                        )}
                      </button>
                    ))}
                  </motion.div>

                  {/* Live Recent Activity */}
                  <motion.div variants={itemVariants}>
                    <RecentActivityLive />
                  </motion.div>

                  {/* Salesforce Objects Used */}
                  <motion.div variants={itemVariants}>
                    <SalesforceObjectsCard />
                  </motion.div>

                  {/* Data Sync Alerts */}
                  <motion.div variants={itemVariants}>
                    <SyncAlertsCard />
                  </motion.div>

                </div>

              </motion.div>

              {/* HIDDEN PREVIOUS OPERATIONAL VIEWS CONTAINER */}
              <div className="hidden">
                <motion.div>
                  <motion.div 
                    className="col-span-2 p-5 rounded-3xl relative overflow-hidden"
                style={{
                  ...G.card,
                  border: "none", // Override default border to let shimmer edge stand out as the border
                }}
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(14, 165, 233, 0.16)" }}
                onMouseEnter={() => setIsHubHovered(true)}
                onMouseLeave={() => setIsHubHovered(false)}
              >
                {/* Continuous border light shimmer effect */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden z-0">
                  {/* Moving shimmer light */}
                  <motion.div
                    className="absolute -inset-[150%]"
                    style={{
                      background: "conic-gradient(from 0deg, transparent 35%, #0ea5e9 47%, #38bdf8 50%, #0ea5e9 53%, transparent 65%)",
                    }}
                    animate={{ 
                      rotate: [0, 360],
                      opacity: isHubHovered ? 1.0 : 0.85
                    }}
                    transition={{
                      rotate: {
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      opacity: {
                        duration: 0.25,
                        ease: "easeInOut"
                      }
                    }}
                  />
                  {/* Inner background mask to create the 1.5px border outline */}
                  <div 
                    className="absolute inset-[1.5px] rounded-[22px]" 
                    style={{
                      background: isDark ? "rgba(244, 248, 253, 0.96)" : "rgba(226, 237, 233, 0.96)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full relative z-10">
                  {/* Left Column: Mascot, Info & Input */}
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div>
                      {/* Mascot Icon + Title Section */}
                      <div className="flex items-center gap-3.5 mb-2">
                        <div className="relative flex-shrink-0">
                          {/* Aura glow around mascot */}
                          <motion.div 
                            className="absolute inset-0 rounded-2xl bg-sky-400/20 blur-md"
                            animate={voiceActive ? { scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] } : { scale: 1, opacity: 0.3 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <img 
                            src={agentforceIcon} 
                            alt="Agentforce Mascot" 
                            className="w-14 h-14 object-contain rounded-2xl relative z-10 border border-sky-400/20 bg-sky-50/50 p-1 shadow-sm"
                          />
                          {/* Live pulse dot */}
                          <span className="absolute -bottom-1 -right-1 flex h-3 w-3 z-20">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                          </span>
                        </div>
                        
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold font-mono uppercase tracking-widest text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-500/10">
                              Agentforce Hub
                            </span>
                            {voiceActive && (
                              <motion.span 
                                className="text-[9px] font-extrabold text-emerald-500 font-mono tracking-wider animate-pulse flex items-center gap-0.5"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              >
                                <Radio className="w-2.5 h-2.5" /> NLP ON
                              </motion.span>
                            )}
                          </div>
                          <h3 className="text-base font-black tracking-tight text-[#1e3a8a] mt-0.5">
                            Agentforce Copilot
                          </h3>
                        </div>
                      </div>
                      <div className="mt-2.5 p-3 rounded-2xl bg-[#0ea5e9]/5 border border-[#0ea5e9]/10 animate-fade-in">
                        <p className="text-sm font-extrabold tracking-tight text-[#1e3a8a] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Welcome back, Admin
                        </p>
                        <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                          {"Here's your live operations overview"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Chat Feed, Audio Waveform & Voice Control Orb */}
                  <div className="flex flex-col justify-between h-full bg-slate-950/[0.02] border border-slate-300/10 p-3 rounded-2xl">
                    {/* Chat feed showing last 2 messages */}
                    <div className="flex-1 overflow-y-auto max-h-[76px] space-y-1.5 pr-1 mb-2.5 scrollbar-none">
                      {chatMessages.slice(-2).map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                          <span className="text-[8px] font-extrabold uppercase tracking-widest text-sky-600/70">
                            {msg.sender === "user" ? "User" : "Agentforce"}
                          </span>
                          <div className="flex items-center gap-1.5 max-w-full">
                            <div 
                              className="px-2 py-1 rounded-xl text-[10px] leading-tight"
                              style={{
                                background: msg.sender === "user" ? "linear-gradient(135deg, #0ea5e9, #0284c7)" : "rgba(255,255,255,0.9)",
                                color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                                border: msg.sender === "user" ? "none" : "1px solid rgba(14, 165, 233, 0.1)"
                              }}
                            >
                              {msg.text}
                            </div>
                            {msg.sender === "bot" && (
                              <button
                                type="button"
                                onClick={() => speakText(msg.text)}
                                className="p-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-600 transition-colors flex-shrink-0 cursor-pointer"
                                title="Escuchar respuesta"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input command box moved from Timeline */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleChatSubmit();
                      }}
                      className="mb-2.5 p-1 rounded-xl flex items-center gap-2"
                      style={{
                        background: "rgba(255, 255, 255, 0.75)",
                        border: "1px solid rgba(14, 165, 233, 0.15)",
                        boxShadow: "inset 1px 1px 3px rgba(165, 185, 210, 0.1)",
                      }}
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Escribe un comando..."
                        className="flex-1 bg-transparent border-none outline-none font-sans font-bold text-[10px] text-[#1e3a8a] placeholder-slate-400 pl-2 cursor-text"
                      />
                      <button 
                        type="submit"
                        className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#2563eb] to-[#0ea5e9] text-white flex items-center justify-center shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </form>

                    {/* Integrated dynamic Waveform & Voice Controls */}
                    <div className="pt-2.5 border-t border-sky-100/40 flex items-center justify-between gap-2.5">
                      <div className="flex-1 min-w-0">
                        {/* Status Label */}
                        <p className="text-[9px] font-extrabold text-sky-600 uppercase tracking-widest font-mono">
                          {voiceActive 
                            ? (voiceLang === 'es-ES' ? "Voz Activa" : "Voice Stream") 
                            : (voiceLang === 'es-ES' ? "Standby" : "Standby")}
                        </p>
                        
                        {/* Real-time Waveform Bars */}
                        <div className="flex items-center gap-[1.5px] mt-1 h-4">
                          {[0.4, 0.7, 0.9, 1.0, 0.8, 0.6, 0.5, 0.8, 0.95, 0.7, 0.5, 0.4].map((h, i) => (
                            <motion.div key={i} className="rounded-full flex-shrink-0"
                              style={{ 
                                width: 1.5, 
                                background: voiceActive 
                                  ? (voiceDisplayState === "processing" ? "#0284c7" : "#0ea5e9") 
                                  : "#94a3b8" 
                              }}
                              animate={voiceActive
                                ? (voiceDisplayState === "processing"
                                  ? { height: [`${h * 4}px`, `${h * 14}px`, `${h * 4}px`], opacity: [0.8, 1, 0.8] }
                                  : { height: [`${h * 10}px`, `${h * 16}px`, `${h * 10}px`], opacity: [0.6, 1, 0.6] })
                                : { height: "3px", opacity: 0.25 }
                              }
                              transition={{
                                duration: voiceDisplayState === "processing" ? 0.3 + i * 0.015 : 0.5 + i * 0.03,
                                delay: i * 0.03,
                                repeat: voiceActive ? Infinity : 0,
                                ease: "easeInOut",
                              }}
                            />
                          ))}
                        </div>

                        {/* Status text */}
                        <p className="text-[9px] font-bold text-slate-500 mt-1 truncate max-w-[130px] font-mono leading-none">
                          {voiceActive ? voiceStatus : (voiceLang === 'es-ES' ? "Pulsa para hablar" : "Click to speak")}
                        </p>
                      </div>

                      <VoiceOrbButton 
                        isActive={voiceActive} 
                        onToggle={toggleVoice} 
                        voiceLang={voiceLang} 
                        setVoiceLang={setVoiceLang} 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Live Network (As requested, solely for live network) */}
              <motion.div className="p-4 rounded-3xl relative overflow-hidden cursor-pointer animate-fade-in"
                style={G.card}
                onClick={() => setShowNetworkCanvas(p => !p)}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(14, 165, 233, 0.16)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl" style={G.inset}>
                    <div className="text-[#2563eb]"><Radio className="w-5 h-5" /></div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-600 uppercase font-mono tracking-wider">ONLINE</span>
                  </div>
                </div>
                <div className="mt-1">
                  <p className="text-xl font-black tracking-tight" style={{ color: "#1e3a8a" }}>99.9% Up</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: isDark ? "#475569" : "#7a9a8d" }}>Live Network</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] border-t border-slate-100/80 pt-2 font-mono" style={{ color: isDark ? "#64748b" : "#475569" }}>
                  <span>Latency: <strong className="text-[#1e3a8a]">12ms</strong></span>
                  <span className="text-[#2563eb] font-extrabold flex items-center gap-1 hover:underline">
                    {showNetworkCanvas ? "▲ ESCONDER RED" : "▼ LLAMAR RED"}
                  </span>
                </div>
              </motion.div>

              {/* Card 4: Voice Command Queue (Now beautifully placed here to maintain layout symmetry) */}
              <motion.div className="p-4 rounded-3xl relative overflow-hidden flex flex-col justify-between"
                style={G.card}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.39 }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(14, 165, 233, 0.16)" }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-2 rounded-xl" style={G.inset}>
                    <div className="text-[#1e3a8a]"><List className="w-5 h-5" /></div>
                  </div>
                  <span className="text-[8px] font-extrabold uppercase font-mono tracking-widest text-[#1e3a8a]">
                    VOICE COMMAND QUEUE
                  </span>
                </div>

                <div className="space-y-2 flex-1 my-1.5 overflow-y-auto max-h-[110px]">
                  {[
                    "Create Revenue Widget",
                    "Map Lead Field",
                    "Region Date Filter",
                  ].map((qText, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 rounded-xl text-[10px] font-black text-[#1e3a8a] flex items-center justify-between"
                      style={{
                        background: "rgba(243, 247, 252, 0.85)",
                        border: "1px solid rgba(255, 255, 255, 0.9)",
                        boxShadow: "2px 2px 5px rgba(165, 185, 210, 0.15), -1px -1px 3px rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      <span className="truncate pr-2">{qText}</span>
                      <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-[#2563eb] bg-[#2563eb]/10 px-1 py-0.2 rounded flex-shrink-0">
                        Active
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-[8px] font-mono font-bold text-slate-400 mt-1 uppercase text-center">
                  Sync status: 100% integrated
                </div>
              </motion.div>

            </motion.div>
            </div>

            {/* Secondary row for the requested original cards info shifted below */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              style={G.analyticsGrid}
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.22 }}
            >
              
              {/* Secondary Info: Total Revenue */}
              <motion.div 
                className="rounded-2xl flex flex-col justify-between border-shimmer p-5"
                style={{ ...G.card, ...G.analyticsCard }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(37, 99, 235, 0.2)" }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl" style={G.inset}>
                      <DollarSign className="w-4.5 h-4.5 text-[#2563eb]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-normal uppercase tracking-wider font-light" style={{ color: isDark ? "#5b7290" : "#5b7290", fontFamily: "'Segoe UI', -apple-system, sans-serif", fontWeight: 300 }}>Total Revenue</p>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.45, 0.95, 0.65, 1] }}
                        transition={{ duration: 0.7, ease: "easeInOut", times: [0, 0.15, 0.3, 0.45, 0.7, 1] }}
                        className="text-2xl font-bold tracking-tight" 
                        style={{ color: isDark ? "#0f172a" : "#0f172a", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}
                      >
                        $54,239
                      </motion.p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold flex items-center gap-0.5 text-[#2563eb] bg-[#2563eb]/10 px-1.5 py-0.5 rounded-lg border border-[#2563eb]/20 font-sans">
                    <ArrowUpRight className="w-3 h-3" />
                    +12.5%
                  </span>
                </div>
              </motion.div>

              {/* Secondary Info: Total Users (Salesforce Metrics: Objects & Classes) */}
              <motion.div 
                className="rounded-2xl flex flex-col justify-between border-shimmer p-5"
                style={{ ...G.card, ...G.analyticsCard }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(37, 99, 235, 0.2)" }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl" style={G.inset}>
                      <Users className="w-4.5 h-4.5 text-[#2563eb]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-normal uppercase tracking-wider font-light" style={{ color: isDark ? "#5b7290" : "#5b7290", fontFamily: "'Segoe UI', -apple-system, sans-serif", fontWeight: 300 }}>Total Users</p>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.45, 0.95, 0.65, 1] }}
                        transition={{ duration: 0.7, ease: "easeInOut", times: [0, 0.15, 0.3, 0.45, 0.7, 1] }}
                        className="text-2xl font-bold tracking-tight" 
                        style={{ color: isDark ? "#0f172a" : "#0f172a", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}
                      >
                        8,235
                      </motion.p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold flex items-center gap-0.5 text-[#2563eb] bg-[#2563eb]/10 px-1.5 py-0.5 rounded-lg border border-[#2563eb]/20 font-sans">
                    <ArrowUpRight className="w-3 h-3" />
                    +8.2%
                  </span>
                </div>
              </motion.div>

              {/* Secondary Info: Total Orders */}
              <motion.div 
                className="rounded-2xl flex flex-col justify-between border-shimmer p-5"
                style={{ ...G.card, ...G.analyticsCard }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(37, 99, 235, 0.2)" }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl" style={G.inset}>
                      <ShoppingCart className="w-4.5 h-4.5 text-[#2563eb]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-normal uppercase tracking-wider font-light" style={{ color: isDark ? "#5b7290" : "#5b7290", fontFamily: "'Segoe UI', -apple-system, sans-serif", fontWeight: 300 }}>Total Orders</p>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.45, 0.95, 0.65, 1] }}
                        transition={{ duration: 0.7, ease: "easeInOut", times: [0, 0.15, 0.3, 0.45, 0.7, 1] }}
                        className="text-2xl font-bold tracking-tight" 
                        style={{ color: isDark ? "#0f172a" : "#0f172a", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}
                      >
                        1,423
                      </motion.p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold flex items-center gap-0.5 text-rose-500 bg-rose-50/60 px-1.5 py-0.5 rounded-lg border border-rose-500/10 font-sans">
                    <ArrowDownRight className="w-3 h-3" />
                    -3.1%
                  </span>
                </div>
              </motion.div>

              {/* Secondary Info: Growth Velocity */}
              <motion.div 
                className="rounded-2xl flex flex-col justify-between border-shimmer p-5"
                style={{ ...G.card, ...G.analyticsCard }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(37, 99, 235, 0.2)" }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl" style={G.inset}>
                      <TrendingUp className="w-4.5 h-4.5 text-[#2563eb]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-normal uppercase tracking-wider font-light" style={{ color: isDark ? "#5b7290" : "#5b7290", fontFamily: "'Segoe UI', -apple-system, sans-serif", fontWeight: 300 }}>Growth Velocity</p>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.45, 0.95, 0.65, 1] }}
                        transition={{ duration: 0.7, ease: "easeInOut", times: [0, 0.15, 0.3, 0.45, 0.7, 1] }}
                        className="text-2xl font-bold tracking-tight" 
                        style={{ color: isDark ? "#0f172a" : "#0f172a", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}
                      >
                        23.5%
                      </motion.p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold flex items-center gap-0.5 text-[#2563eb] bg-[#2563eb]/10 px-1.5 py-0.5 rounded-lg border border-[#2563eb]/20 font-sans">
                    <ArrowUpRight className="w-3 h-3" />
                    +4.3%
                  </span>
                </div>
              </motion.div>

            </motion.div>

            {/* GDS & Movement Console with clean spacing wrapper */}
            <div style={G.gdsConsoleWrapper}>
              <GdsMovementConsole activeNode={opsActiveNode} darkMode={isDark} />
            </div>

            {/* Neo Aura 4j Network */}
            <AnimatePresence>
              {showNetworkCanvas && (
                <motion.section className="mb-5 overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#10b981" }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }} />
                    <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#7a9a8d" }}>
                      Neo Aura 4j — Live Network · Betweenness Centrality
                    </span>
                    <div className="h-px flex-1"
                      style={{ background: "linear-gradient(to right,rgba(16,185,129,0.2),transparent)" }} />
                    <motion.span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{ 
                        background: "rgba(16,185,129,0.07)", 
                        border: "1px solid rgba(16,185,129,0.17)", 
                        color: "#10b981",
                        display: "inline-block"
                      }}
                      animate={{
                        scale: [1, 1.10, 1, 1.10, 1],
                        boxShadow: [
                          "0 0 0px rgba(16,185,129,0)",
                          "0 0 6px rgba(16,185,129,0.35)",
                          "0 0 0px rgba(16,185,129,0)",
                          "0 0 6px rgba(16,185,129,0.35)",
                          "0 0 0px rgba(16,185,129,0)"
                        ]
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.12, 0.24, 0.38, 1]
                      }}
                    >
                      LIVE
                    </motion.span>
                    <AnimatePresence>
                      {linkingMode && (
                        <motion.span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(6,182,212,0.09)", border: "1px solid rgba(6,182,212,0.24)", color: "#06b6d4" }}
                          animate={{ opacity: [1, 0.55, 1] }}
                          transition={{ duration: 0.7, repeat: Infinity }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          ENLACE ACTIVO
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

              {/* Network Canvas */}
              <div className="relative rounded-3xl overflow-hidden"
                style={{
                  height: 560,
                  ...G.card,
                  boxShadow: "inset 6px 6px 14px #bdc9c4, inset -6px -6px 14px #ffffff",
                }}>
                <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{
                  backgroundImage: [
                    "linear-gradient(rgba(16,185,129,0.028) 1px, transparent 1px)",
                    "linear-gradient(90deg, rgba(16,185,129,0.028) 1px, transparent 1px)",
                  ].join(","),
                  backgroundSize: "40px 40px",
                }} />

                <AnimatePresence>
                  {linkingMode && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none rounded-3xl"
                      style={{ zIndex: 5 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <svg className="w-full h-full">
                        <defs>
                          <filter id="linkGlow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <motion.line x1="18%" y1="50%" x2="82%" y2="50%"
                          stroke="#06b6d4" strokeWidth="2" strokeDasharray="8 5"
                          filter="url(#linkGlow)"
                          animate={{ strokeDashoffset: [0, -26] }}
                          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                        />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute inset-0">
                  <NodeMapInteractive
                    activeNode={opsActiveNode}
                    onNodeClick={id => {
                      setOpsActiveNode(p => p === id ? null : id);
                      setNodeContextMenu(id || null);
                    }}
                    isListening={voiceActive}
                    onExpandNode={id => setExpandedKpi(id)}
                    lightMode={!isDark}
                  />
                </div>
              </div>

              {/* KPI Mini-cards Row */}
              <div className="mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#7a9a8d" }}>
                      KPI — Neo Aura Nodes
                    </span>
                    <div className="hidden sm:block h-px w-24"
                      style={{ background: "linear-gradient(to right,rgba(16,185,129,0.14),transparent)" }} />
                  </div>
                  
                  <div className="flex items-center gap-3 ml-auto sm:ml-0">
                    {/* Sorting Dropdown */}
                    <div className="flex items-center gap-1.5 bg-white/40 px-2.5 py-1 rounded-xl border border-slate-200/50 shadow-xs">
                      <span className="text-[8.5px] font-extrabold text-[#7a9a8d] uppercase tracking-wider font-mono">Ordenar por:</span>
                      <select
                        id="kpi-sort-dropdown"
                        value={kpiSortBy}
                        onChange={(e) => setKpiSortBy(e.target.value as any)}
                        className="bg-transparent border-none outline-none font-bold text-[10px] text-[#1e3a8a] cursor-pointer"
                        style={{ fontFamily: "'Segoe UI', sans-serif" }}
                      >
                        <option value="confidence" className="bg-white text-slate-800">Confidence</option>
                        <option value="revenue" className="bg-white text-slate-800">Revenue Value</option>
                        <option value="name" className="bg-white text-slate-800">Name</option>
                      </select>
                    </div>

                    <motion.button
                      onClick={() => setVetoActive(p => !p)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-semibold"
                      style={{
                        ...G.card,
                        color: vetoActive ? "#ef4444" : "#7a9a8d",
                        border: vetoActive ? "1px solid rgba(239,68,68,0.20)" : G.card.border,
                      }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <AlertTriangle style={{ width: 12, height: 12 }} />
                      Safety Veto: {vetoActive ? "ON" : "OFF"}
                    </motion.button>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {sortedAuraNodes.map((node, i) => (
                    <motion.div key={node.id} style={{ flex: "1 1 110px" }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}>
                      <KpiMiniCard
                        node={node}
                        onExpand={() => setExpandedKpi(node.id)}
                        vetoActive={vetoActive}
                        darkMode={isDark}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Tri-Gateway Hub */}
            <ApiGatewayPorts tick={gatewayTick} darkMode={isDark} />

            {/* Analytics Grid */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <Layers className="w-3.5 h-3.5" style={{ color: "#7a9a8d" }} />
                <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#7a9a8d" }}>
                  Analytics — click any card para expandir · di el nombre por voz
                </span>
                <div className="h-px flex-1"
                  style={{ background: "linear-gradient(to right,rgba(16,185,129,0.14),transparent)" }} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ANALYTICS_CARDS.map((card, i) => (
                  <motion.div key={card.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                  >
                    <CompactCard
                      card={card}
                      onExpand={() => setExpandedCard(card.id)}
                      voiceHighlight={voiceHighlight === card.id}
                      darkMode={isDark}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            </div>

            )}

          </div>

          {/* Floating vertical toolbar */}
          <FloatingToolbar activeTool={activeTool} onToolChange={handleToolChange} />

          {/* Node context menu */}
          <AnimatePresence>
            {nodeContextMenu && (
              <NodeContextMenu
                key="node-ctx"
                nodeId={nodeContextMenu}
                onClose={() => setNodeContextMenu(null)}
                onAction={handleNodeContextAction}
              />
            )}
          </AnimatePresence>

          {/* Expanded Analytics Modal */}
          <AnimatePresence>
            {expandedCard && (() => {
              const card = ANALYTICS_CARDS.find(c => c.id === expandedCard);
              if (!card) return null;
              return (
                <motion.div key="card-modal"
                  className="fixed inset-0 z-[150] flex items-center justify-center p-4"
                  style={{ backdropFilter: "blur(16px)", background: "rgba(178,196,189,0.55)" }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setExpandedCard(null)}
                >
                  <motion.div
                    className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
                    style={G.cardDeep}
                    initial={{ scale: 0.88, y: 32 }} animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.88, y: 32 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-6 pt-5 pb-3"
                      style={{ borderBottom: "1px solid rgba(16,185,129,0.08)" }}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-4 rounded-full" style={{ background: card.color }} />
                          <h3 className="text-lg font-bold" style={{ color: "#0d1f1a" }}>{card.title}</h3>
                        </div>
                        <p className="text-sm" style={{ color: "#7a9a8d" }}>{card.subtitle}</p>
                      </div>
                      <motion.button onClick={() => setExpandedCard(null)}
                        className="p-2 rounded-xl" style={G.card}
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <X className="w-4 h-4" style={{ color: "#4a7268" }} />
                      </motion.button>
                    </div>
                    <div className="p-6">{EXPANDED_COMPONENTS[expandedCard]}</div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Expanded KPI Modal */}
          <AnimatePresence>
            {expandedKpi && (() => {
              const node = AURA_NODES.find(n => n.id === expandedKpi);
              const data = EXPANDED_KPI[expandedKpi];
              if (!node || !data) return null;
              return (
                <motion.div key="kpi-modal"
                  className="fixed inset-0 z-[160] flex items-center justify-center p-4"
                  style={{ backdropFilter: "blur(18px)", background: "rgba(178,196,189,0.55)" }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setExpandedKpi(null)}
                >
                  <motion.div className="w-full max-w-sm rounded-3xl p-6"
                    style={G.cardDeep}
                    initial={{ scale: 0.86, y: 36 }} animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.86, y: 36 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={G.inset}>
                          <div className="w-3.5 h-3.5 rounded-full"
                            style={{ background: node.color, boxShadow: `0 0 8px ${node.color}` }} />
                        </div>
                        <div>
                          <p className="text-lg font-extrabold" style={{ color: "#0d1f1a" }}>{node.name}</p>
                          <p className="text-[11px]" style={{ color: "#7a9a8d" }}>
                            {node.metric} · {node.confidence}% conf.
                          </p>
                        </div>
                      </div>
                      <motion.button onClick={() => setExpandedKpi(null)}
                        className="p-2 rounded-xl" style={G.card}
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <X className="w-4 h-4" style={{ color: "#4a7268" }} />
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {data.kpis.map((kpi, i) => (
                        <motion.div key={kpi.label} className="p-3 rounded-xl" style={G.inset}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}>
                          <p className="text-[10px] mb-1 font-mono" style={{ color: "#7a9a8d" }}>{kpi.label}</p>
                          <p className="text-xl font-extrabold font-mono" style={{ color: node.color }}>{kpi.value}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[10px]" style={{ color: "#7a9a8d" }}>Confidence</span>
                        <span className="text-[10px] font-bold" style={{ color: node.color }}>{node.confidence}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(16,185,129,0.08)" }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg,${node.color},${node.color}77)` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${node.confidence}%` }}
                          transition={{ duration: 0.9, delay: 0.2 }} />
                      </div>
                    </div>
                    <div className="p-3 rounded-xl" style={G.inset}>
                      <p className="text-[9px] uppercase tracking-widest mb-1.5 font-mono"
                        style={{ color: "#7a9a8d" }}>Fórmula</p>
                      <code className="text-xs font-mono" style={{ color: "#059669" }}>{data.formula}</code>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Safety Veto Warning Overlay */}
          <AnimatePresence>
            {vetoActive && (
              <motion.div
                className="fixed inset-0 z-[200] flex items-center justify-center"
                style={{ backdropFilter: "blur(18px)", background: "rgba(178,196,189,0.70)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <motion.div className="p-8 rounded-3xl text-center max-w-sm mx-6"
                  style={{
                    ...G.cardDeep,
                    border: "1px solid rgba(239,68,68,0.18)",
                    boxShadow: "0 20px 60px rgba(239,68,68,0.10), 0 4px 16px rgba(0,0,0,0.06)",
                  }}
                  initial={{ scale: 0.85, y: 24 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.14)" }}>
                    <AlertTriangle className="w-7 h-7 text-[#ef4444]" />
                  </div>
                  <h2 className="text-lg font-extrabold mb-2" style={{ color: "#0d1f1a" }}>Safety Veto Active</h2>
                  <p className="text-sm mb-4" style={{ color: "#7a9a8d" }}>NLP confidence below threshold.</p>
                  <button
                    onClick={() => setVetoActive(false)}
                    className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white"
                    style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
                    Override &amp; Continue
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Share Modal popup */}
          <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
          </div>
        </motion.div>
      )}

    </div>
  );
}
