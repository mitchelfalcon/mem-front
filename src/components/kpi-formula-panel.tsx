import { motion } from "motion/react";
import { X, BookOpen, Activity } from "lucide-react";

interface NodeKpiData {
  id: string;
  name: string;
  color: string;
  centrality: number;
  confidence: number;
  formulaLhs: string;
  formulaRhs: string;
  kpis: { label: string; value: string }[];
  article: string;
}

const NODE_KPI: Record<string, NodeKpiData> = {
  facturacion: {
    id: "facturacion",
    name: "Facturación",
    color: "#10b981",
    centrality: 0.87,
    confidence: 96,
    formulaLhs: "ROI",
    formulaRhs: "(Revenue − Cost) / Cost × 100",
    kpis: [
      { label: "Revenue",  value: "$54,000" },
      { label: "Invoices", value: "342" },
      { label: "Margin",   value: "34.2%" },
      { label: "AR Days",  value: "18" },
    ],
    article: "FA-2024-0831",
  },
  casos: {
    id: "casos",
    name: "Casos",
    color: "#3b82f6",
    centrality: 0.72,
    confidence: 91,
    formulaLhs: "Rate",
    formulaRhs: "Resolved / Total × 100",
    kpis: [
      { label: "Open",    value: "28" },
      { label: "Resolved", value: "185" },
      { label: "CSAT",    value: "4.7 / 5" },
      { label: "Avg Time", value: "2.3h" },
    ],
    article: "CS-2024-0419",
  },
  actividades: {
    id: "actividades",
    name: "Actividades",
    color: "#8b5cf6",
    centrality: 0.65,
    confidence: 98,
    formulaLhs: "Velocity",
    formulaRhs: "Story Points / Sprint",
    kpis: [
      { label: "Done",        value: "47" },
      { label: "In Progress", value: "12" },
      { label: "Blocked",     value: "3" },
      { label: "Velocity",    value: "34sp" },
    ],
    article: "AC-2024-1102",
  },
  ledger: {
    id: "ledger",
    name: "Ledger",
    color: "#f59e0b",
    centrality: 0.58,
    confidence: 89,
    formulaLhs: "Net Cash",
    formulaRhs: "Inflows − Outflows",
    kpis: [
      { label: "Balance", value: "$125.5K" },
      { label: "Inflow",  value: "$78.2K" },
      { label: "Outflow", value: "$23.7K" },
      { label: "Ratio",   value: "3.3×" },
    ],
    article: "LD-2024-0607",
  },
  voz: {
    id: "voz",
    name: "Voz",
    color: "#06b6d4",
    centrality: 0.71,
    confidence: 94,
    formulaLhs: "NLP Score",
    formulaRhs: "Confidence × Intent Match",
    kpis: [
      { label: "Intents",  value: "1,203" },
      { label: "Accuracy", value: "94%" },
      { label: "Latency",  value: "120ms" },
      { label: "Sessions", value: "89" },
    ],
    article: "VZ-2024-0215",
  },
};

interface KpiFormulaPanelProps {
  nodeId: string | null;
  onClose: () => void;
}

export function KpiFormulaPanel({ nodeId, onClose }: KpiFormulaPanelProps) {
  const node = nodeId ? NODE_KPI[nodeId] : null;

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.25 }}
    >
      {!node ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,255,163,0.05)", border: "1px solid rgba(0,255,163,0.14)" }}
          >
            <Activity className="w-7 h-7" style={{ color: "#2d4a40" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "#4a7268" }}>Select a node</p>
            <p className="text-xs mt-1" style={{ color: "#2d4a40" }}>to view KPI formula breakdown</p>
          </div>
        </div>
      ) : (
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: node.color, boxShadow: `0 0 8px ${node.color}` }}
              />
              <span className="text-base font-bold truncate" style={{ color: "#e2ede9" }}>
                {node.name}
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: "#4a7268" }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Centrality row */}
          <div
            className="flex-1 items-center justify-between text-[11px] px-3 py-2 rounded-lg flex"
            style={{
              background: "rgba(0,255,163,0.04)",
              border: "1px solid rgba(0,255,163,0.08)",
              fontFamily: "'Segoe UI', -apple-system, sans-serif",
            }}
          >
            <span style={{ color: "#4a7268" }}>BTC_SCORE</span>
            <span style={{ color: "#00ffa3" }}>{node.centrality.toFixed(2)}</span>
          </div>

          {/* Formula */}
          <div
            className="p-3 rounded-xl space-y-1.5"
            style={{
              background: "rgba(0,15,10,0.55)",
              border: "1px solid rgba(0,255,163,0.12)",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.14em] mb-2"
              style={{ color: "#4a7268" }}
            >
              KPI Formula
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif", color: "#b0cfc4" }}
            >
              <span style={{ color: node.color, fontWeight: 600 }}>{node.formulaLhs}</span>
              <span style={{ color: "#4a7268" }}> = </span>
              <span style={{ color: "#d4ede6" }}>{node.formulaRhs}</span>
            </p>
          </div>

          {/* Confidence bar */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-[0.12em]" style={{ color: "#4a7268" }}>
                NLP Confidence
              </span>
              <span
                className="text-[11px] font-bold"
                style={{
                  color: node.confidence >= 94 ? "#00ffa3" : "#f59e0b",
                  fontFamily: "'Segoe UI', -apple-system, sans-serif",
                }}
              >
                {node.confidence}%
              </span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "rgba(0,255,163,0.08)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: node.confidence >= 94 ? "#00ffa3" : "#f59e0b" }}
                initial={{ width: 0 }}
                animate={{ width: `${node.confidence}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </div>
            {node.confidence < 94 && (
              <p className="text-[10px] mt-1" style={{ color: "#f59e0b" }}>
                ⚠ Below veto threshold (94%)
              </p>
            )}
          </div>

          {/* KPI grid */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] mb-2" style={{ color: "#4a7268" }}>
              Metrics
            </p>
            <div className="grid grid-cols-2 gap-2">
              {node.kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="p-2.5 rounded-xl"
                  style={{
                    background: "rgba(0,15,10,0.45)",
                    border: "1px solid rgba(0,255,163,0.07)",
                  }}
                >
                  <p className="text-[10px] mb-0.5" style={{ color: "#4a7268" }}>{kpi.label}</p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: node.color, fontFamily: "'Segoe UI', -apple-system, sans-serif" }}
                  >
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Article */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              background: "rgba(0,255,163,0.04)",
              border: "1px solid rgba(0,255,163,0.10)",
            }}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color: "#00ffa3" }} />
            <div>
              <p className="text-[10px]" style={{ color: "#4a7268" }}>Knowledge Article</p>
              <p
                className="text-xs font-medium mt-0.5"
                style={{ color: "#00ffa3", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}
              >
                {node.article}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
