import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

// Wider canvas — nodes spread across a bigger field
const SVG_W = 900, SVG_H = 480;

// Center: 450, 235
// KPI ring radius: 130  DEPT ring radius: 210
const ALL_NODES = [
  { id: "core",        label: "ARLO",        cx: 450, cy: 235, r: 27, color: "#2563eb", type: "core" },
  // KPI pentagon (r=130)
  { id: "facturacion", label: "Facturación", cx: 450, cy: 105, r: 22, color: "#1e3a8a", type: "kpi"  },
  { id: "casos",       label: "Casos",       cx: 574, cy: 195, r: 22, color: "#3b82f6", type: "kpi"  },
  { id: "actividades", label: "Actividades", cx: 526, cy: 340, r: 22, color: "#8b5cf6", type: "kpi"  },
  { id: "ledger",      label: "Ledger",      cx: 374, cy: 340, r: 22, color: "#f59e0b", type: "kpi"  },
  { id: "voz",         label: "Voz",         cx: 326, cy: 195, r: 22, color: "#06b6d4", type: "kpi"  },
  // DEPT hexagon (r=210)
  { id: "finanzas",    label: "Finanzas",    cx: 450, cy:  25, r: 17, color: "#fbbf24", type: "dept" },
  { id: "operaciones", label: "Operaciones", cx: 632, cy: 130, r: 17, color: "#f87171", type: "dept" },
  { id: "analytics",   label: "Analytics",   cx: 632, cy: 340, r: 17, color: "#a78bfa", type: "dept" },
  { id: "tecnologia",  label: "Tecnología",  cx: 450, cy: 445, r: 17, color: "#38bdf8", type: "dept" },
  { id: "legal",       label: "Legal",       cx: 268, cy: 340, r: 17, color: "#fb923c", type: "dept" },
  { id: "ventas",      label: "Ventas",      cx: 268, cy: 130, r: 17, color: "#f472b6", type: "dept" },
];

const KPI_IDS  = ["facturacion","casos","actividades","ledger","voz"];
const DEPT_IDS = ["finanzas","operaciones","analytics","tecnologia","legal","ventas"];

const CONNECTIONS = [
  ...KPI_IDS.map(id => ({ from: "core", to: id, kind: "core" as const })),
  { from: "facturacion", to: "casos",       kind: "ring" as const },
  { from: "casos",       to: "actividades", kind: "ring" as const },
  { from: "actividades", to: "ledger",      kind: "ring" as const },
  { from: "ledger",      to: "voz",         kind: "ring" as const },
  { from: "voz",         to: "facturacion", kind: "ring" as const },
  ...KPI_IDS.flatMap(k => DEPT_IDS.map(d => ({ from: k, to: d, kind: "dept" as const }))),
];

// Normalized Betweenness Centrality (0–1) — drives halo radius
const BETWEENNESS: Record<string, number> = {
  core:        1.00,
  facturacion: 0.72,
  casos:       0.68,
  actividades: 0.65,
  ledger:      0.70,
  voz:         0.66,
  finanzas:    0.18,
  operaciones: 0.15,
  analytics:   0.17,
  tecnologia:  0.14,
  legal:       0.16,
  ventas:      0.19,
};

// NLP confidence per KPI node
const CONFIDENCE: Record<string, number> = {
  core: 99, facturacion: 96, casos: 91, actividades: 98, ledger: 89, voz: 94,
};

// Hover formula per node
const NODE_FORMULAS: Record<string, string> = {
  core:        "BC(v) = ∑ s≠v≠t σst(v) / σst",
  facturacion: "ROI = (Revenue − Cost) / Cost × 100",
  casos:       "Res_Rate = Closed / Total_Open × 100",
  actividades: "Velocity = StoryPoints / SprintDays",
  ledger:      "CashFlow = Inflows − Outflows",
  voz:         "Acc = Correct_Intent / Total × 100",
};

const NODE_INFO: Record<string, {
  title: string; subtitle: string; color: string;
  stats: { label: string; value: string }[];
}> = {
  core: {
    title: "ARLO — Núcleo Central", subtitle: "Sistema de inteligencia empresarial",
    color: "#2563eb",
    stats: [
      { label: "Módulos Activos", value: "5"      },
      { label: "Departamentos",        value: "6"      },
      { label: "Uptime",               value: "99.9%"  },
      { label: "Queries/día",     value: "12,400" },
    ],
  },
  facturacion: {
    title: "Facturación", subtitle: "Módulo KPI — Revenue & Billing",
    color: "#1e3a8a",
    stats: [
      { label: "Revenue Total", value: "$54,239" },
      { label: "ROI Margin",    value: "34.2%"   },
      { label: "Q4 Target",     value: "86%"     },
      { label: "AR Days",       value: "21 días" },
    ],
  },
  casos: {
    title: "Casos", subtitle: "Módulo KPI — Support Tickets",
    color: "#3b82f6",
    stats: [
      { label: "Casos Abiertos",   value: "213"  },
      { label: "Escalados T2",     value: "3"    },
      { label: "Tasa Resolución", value: "87%" },
      { label: "SLA Breach",       value: "2%"   },
    ],
  },
  actividades: {
    title: "Actividades", subtitle: "Módulo KPI — Sprint Velocity",
    color: "#8b5cf6",
    stats: [
      { label: "Velocidad Sprint", value: "34 SP"    },
      { label: "Tareas Done",      value: "127"      },
      { label: "Backlog",          value: "48 items" },
      { label: "Bloqueadas",       value: "5"        },
    ],
  },
  ledger: {
    title: "Ledger", subtitle: "Módulo KPI — Financial Balance",
    color: "#f59e0b",
    stats: [
      { label: "Saldo Neto",   value: "$125.5K"  },
      { label: "AP Pendiente", value: "$18.2K"   },
      { label: "Cash Flow",    value: "+$6.4K"   },
      { label: "Burn Rate",    value: "$22K/mo"  },
    ],
  },
  voz: {
    title: "Voz", subtitle: "Módulo KPI — NLP Engine",
    color: "#06b6d4",
    stats: [
      { label: "Precisión",   value: "94%"   },
      { label: "Comandos/hr",      value: "142"   },
      { label: "Latencia",         value: "180ms" },
      { label: "Eventos Veto",     value: "0"     },
    ],
  },
  finanzas: {
    title: "Finanzas", subtitle: "Departamento — Finance",
    color: "#fbbf24",
    stats: [
      { label: "Presupuesto", value: "$2.4M"    },
      { label: "Equipo",      value: "18 pers." },
      { label: "ROI",         value: "28.4%"    },
      { label: "Gasto YTD",   value: "$1.1M"    },
    ],
  },
  operaciones: {
    title: "Operaciones", subtitle: "Departamento — Operations",
    color: "#f87171",
    stats: [
      { label: "Eficiencia", value: "94%"        },
      { label: "Equipo",     value: "34 pers."   },
      { label: "Proyectos",  value: "12 activos" },
      { label: "On-time",    value: "88%"        },
    ],
  },
  analytics: {
    title: "Analytics", subtitle: "Departamento — Data & Insights",
    color: "#a78bfa",
    stats: [
      { label: "Insights/mes",  value: "142"      },
      { label: "Equipo",        value: "12 pers." },
      { label: "Dashboards",    value: "38"       },
      { label: "Data Accuracy", value: "99.2%"    },
    ],
  },
  tecnologia: {
    title: "Tecnología", subtitle: "Departamento — Engineering",
    color: "#38bdf8",
    stats: [
      { label: "Uptime",       value: "99.8%"    },
      { label: "Equipo",       value: "28 pers." },
      { label: "Incidentes",   value: "2 activos" },
      { label: "Deploys/sem",  value: "14"       },
    ],
  },
  legal: {
    title: "Legal", subtitle: "Departamento — Legal & Compliance",
    color: "#fb923c",
    stats: [
      { label: "Compliance",  value: "100%"       },
      { label: "Equipo",      value: "8 pers."    },
      { label: "Contratos",   value: "47 activos" },
      { label: "Auditorías", value: "3 pend." },
    ],
  },
  ventas: {
    title: "Ventas", subtitle: "Departamento — Sales",
    color: "#f472b6",
    stats: [
      { label: "Pipeline",    value: "$890K"    },
      { label: "Equipo",      value: "45 pers." },
      { label: "Conv. Rate",  value: "23.5%"    },
      { label: "Deals/mes",   value: "34"       },
    ],
  },
};

const NODE_ABBR: Record<string, string> = {
  core: "ARLO", facturacion: "FACT", casos: "CASO", actividades: "ACTI",
  ledger: "LEDG", voz: "VOZ", finanzas: "FINA", operaciones: "OPER",
  analytics: "ANAL", tecnologia: "TECH", legal: "LEGA", ventas: "VENT",
};

interface Props {
  activeNode: string | null;
  onNodeClick: (id: string) => void;
  isListening?: boolean;
  onExpandNode?: (nodeId: string) => void;
  lightMode?: boolean;
}

export function NodeMapInteractive({
  activeNode, onNodeClick, isListening = false, onExpandNode, lightMode = false,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId,  setHoveredId]  = useState<string | null>(null);

  const getNode = (id: string) => ALL_NODES.find(n => n.id === id)!;

  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(prev => prev === id ? null : id);
    onNodeClick(id);
  };

  const isHighlighted = (conn: typeof CONNECTIONS[0]) =>
    selectedId !== null && (conn.from === selectedId || conn.to === selectedId);

  const isConnectedTo = (nodeId: string) =>
    selectedId !== null &&
    CONNECTIONS.some(c =>
      (c.from === selectedId && c.to === nodeId) ||
      (c.to === selectedId && c.from === nodeId)
    );

  const selectedInfo = selectedId ? NODE_INFO[selectedId] : null;
  const selectedNode = selectedId ? getNode(selectedId) : null;

  const gridColor = lightMode ? "rgba(37, 99, 235, 0.035)" : "rgba(37, 99, 235, 0.025)";

  // Hover tooltip geometry — keep inside SVG bounds
  const renderHoverTooltip = () => {
    if (!hoveredId) return null;
    const node = getNode(hoveredId);
    const formula = NODE_FORMULAS[hoveredId];
    if (!formula) return null;

    const conf  = CONFIDENCE[hoveredId];
    const bc    = BETWEENNESS[hoveredId] ?? 0;
    const TW = 210, TH = conf !== undefined ? 66 : 50;
    const rawTx = node.cx - TW / 2;
    const rawTy = node.cy - node.r - TH - 16;
    const tx = Math.min(Math.max(rawTx, 2), SVG_W - TW - 2);
    const ty = rawTy < 2 ? node.cy + node.r + 10 : rawTy;
    const confColor = conf !== undefined ? (conf >= 94 ? "#2563eb" : "#ef4444") : "#7a9a8d";

    return (
      <g style={{ pointerEvents: "none" }}>
        {/* Shadow */}
        <rect x={tx+2} y={ty+3} width={TW} height={TH} rx={8}
          fill="rgba(0,0,0,0.08)" />
        {/* Panel */}
        <rect x={tx} y={ty} width={TW} height={TH} rx={8}
          fill={lightMode ? "rgba(244, 248, 253, 0.95)" : "rgba(5,22,17,0.96)"}
          stroke={node.color} strokeWidth={1} />
        {/* Left accent */}
        <rect x={tx} y={ty} width={3} height={TH} rx={2}
          fill={node.color} />
        {/* Node name + BC */}
        <text x={tx+10} y={ty+15} fontSize={7.5} fontWeight="700"
          fill={node.color}
          style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
          {node.label}
        </text>
        <text x={tx+TW-10} y={ty+15} fontSize={7} fontWeight="700"
          textAnchor="end"
          fill={lightMode ? "#475569" : "#7a9a8d"}
          style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
          BC {(bc * 100).toFixed(0)}%
        </text>
        {/* Formula */}
        <text x={tx+10} y={ty+29} fontSize={6.4}
          fill={lightMode ? "#64748b" : "#a0c4b8"}
          style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
          {formula}
        </text>
        {/* Confidence */}
        {conf !== undefined && (
          <>
            <text x={tx+10} y={ty+44} fontSize={6} fontWeight="600"
              fill={confColor}
              style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
              Conf: {conf}%{conf < 94 ? "  ⚠ VETO" : "  ✓ OK"}
            </text>
            {/* mini confidence bar */}
            <rect x={tx+10} y={ty+48} width={TW-20} height={3} rx={1.5}
              fill="rgba(37, 99, 235, 0.12)" />
            <rect x={tx+10} y={ty+48} width={(TW-20) * conf / 100} height={3} rx={1.5}
              fill={confColor} />
          </>
        )}
      </g>
    );
  };

  return (
    <div
      className="relative w-full h-full select-none"
      onClick={() => { setSelectedId(null); setHoveredId(null); }}
    >
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%" height="100%"
        style={{ overflow: "visible", display: "block" }}
      >
        <defs>
          {ALL_NODES.map(n => (
            <radialGradient key={n.id} id={`ng-${n.id}`} cx="38%" cy="32%" r="68%">
              <stop offset="0%"   stopColor={n.color} stopOpacity={0.92} />
              <stop offset="100%" stopColor={n.color} stopOpacity={0.62} />
            </radialGradient>
          ))}
          {/* BC halo gradients */}
          {ALL_NODES.map(n => (
            <radialGradient key={`hg-${n.id}`} id={`hg-${n.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={n.color} stopOpacity={0.22} />
              <stop offset="55%"  stopColor={n.color} stopOpacity={0.08} />
              <stop offset="100%" stopColor={n.color} stopOpacity={0}    />
            </radialGradient>
          ))}
          <filter id="nmi-glow">
            <feGaussianBlur stdDeviation="4.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="nmi-sel">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="drop-shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.12)" />
          </filter>
        </defs>

        {/* Grid */}
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`gh${i}`} x1={0} y1={i * 40} x2={SVG_W} y2={i * 40}
            stroke={gridColor} strokeWidth={0.5} />
        ))}
        {Array.from({ length: 24 }, (_, i) => (
          <line key={`gv${i}`} x1={i * 40} y1={0} x2={i * 40} y2={SVG_H}
            stroke={gridColor} strokeWidth={0.5} />
        ))}

        {/* ── Betweenness Centrality halos ─────────────────────────────── */}
        {ALL_NODES.map(node => {
          const bc = BETWEENNESS[node.id] ?? 0.15;
          // halo radius: base 18px + up to 52px extra, scaled by BC
          const haloR = node.r + 18 + bc * 52;
          return (
            <circle key={`halo-${node.id}`}
              cx={node.cx} cy={node.cy} r={haloR}
              fill={`url(#hg-${node.id})`}
              style={{ pointerEvents: "none" }}
            />
          );
        })}

        {/* Connections */}
        {CONNECTIONS.map((c, i) => {
          const f  = getNode(c.from);
          const t  = getNode(c.to);
          const hi = isHighlighted(c);
          const baseOpacity = c.kind === "dept" ? 0.07 : c.kind === "core" ? 0.25 : 0.14;
          const hiOpacity   = c.kind === "dept" ? 0.55 : 0.92;
          const hiColor     = hi ? (c.from === selectedId ? f.color : t.color) : undefined;
          const strokeColor = hi
            ? hiColor!
            : lightMode ? "rgba(37, 99, 235, 0.32)" : "rgba(37, 99, 235, 0.28)";

          return (
            <g key={`c${i}`}>
              <line
                x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy}
                stroke={strokeColor}
                strokeWidth={hi ? (c.kind === "dept" ? 1.1 : 1.8) : 0.65}
                opacity={hi ? hiOpacity : baseOpacity}
                style={{ transition: "all 0.3s ease" }}
              />
              {hi && c.kind !== "dept" && (
                <circle r={2.5} fill={strokeColor} opacity={0.9}>
                  <animateMotion dur={`${1.4 + i * 0.08}s`} repeatCount="indefinite"
                    path={`M${f.cx},${f.cy} L${t.cx},${t.cy}`} />
                </circle>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {ALL_NODES.map(node => {
          const isSel    = selectedId === node.id;
          const isHov    = hoveredId  === node.id;
          const isActive = activeNode === node.id;
          const isConn   = isConnectedTo(node.id);
          const isCore   = node.type === "core";
          const pulseDur = isCore && isListening ? "0.55s" : "2.8s";
          const conf     = CONFIDENCE[node.id];
          const isLowConf = conf !== undefined && conf < 94;

          return (
            <g key={node.id}
              onClick={e => handleNodeClick(node.id, e)}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Pulse ring on selected / active / listening-core */}
              {(isSel || isActive || (isCore && isListening)) && (
                <>
                  <circle cx={node.cx} cy={node.cy} r={node.r + 8}
                    fill="none" stroke={node.color} strokeWidth={1.2} opacity={0}>
                    <animate attributeName="opacity" values="0;0.55;0" dur={pulseDur} repeatCount="indefinite" />
                    <animate attributeName="r"
                      values={`${node.r + 6};${node.r + 22};${node.r + 6}`}
                      dur={pulseDur} repeatCount="indefinite" />
                  </circle>
                  {isCore && (
                    <circle cx={node.cx} cy={node.cy} r={node.r + 20}
                      fill="none" stroke={node.color} strokeWidth={0.7} opacity={0}>
                      <animate attributeName="opacity" values="0;0.22;0" dur={pulseDur} begin="0.4s" repeatCount="indefinite" />
                      <animate attributeName="r"
                        values={`${node.r + 18};${node.r + 36};${node.r + 18}`}
                        dur={pulseDur} begin="0.4s" repeatCount="indefinite" />
                    </circle>
                  )}
                </>
              )}

              {/* Low-confidence warning ring */}
              {isLowConf && (
                <circle cx={node.cx} cy={node.cy} r={node.r + 6}
                  fill="none" stroke="rgba(239,68,68,0.6)" strokeWidth={1.4}
                  strokeDasharray="3.5 2.5">
                  <animateTransform attributeName="transform" type="rotate"
                    from={`0 ${node.cx} ${node.cy}`} to={`360 ${node.cx} ${node.cy}`}
                    dur="5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Connected glow */}
              {isConn && !isSel && (
                <circle cx={node.cx} cy={node.cy} r={node.r + 7}
                  fill={node.color} opacity={0.11}
                  style={{ transition: "opacity 0.3s" }} />
              )}

              {/* Hover ring */}
              {isHov && !isSel && (
                <circle cx={node.cx} cy={node.cy} r={node.r + 11}
                  fill={node.color} opacity={0.07} />
              )}

              {/* Expanded hit area */}
              <circle cx={node.cx} cy={node.cy} r={node.r + 14} fill="transparent" />

              {/* Main circle */}
              <circle
                cx={node.cx} cy={node.cy}
                r={isHov ? node.r + 3 : node.r}
                fill={`url(#ng-${node.id})`}
                stroke={isSel ? "#ffffff" : isLowConf ? "rgba(239,68,68,0.75)" : node.color}
                strokeWidth={isSel ? 2.8 : isLowConf ? 2 : isConn ? 1.8 : 1.3}
                filter={isSel ? "url(#nmi-sel)" : undefined}
                style={{ transition: "r 0.15s, stroke-width 0.2s" }}
              />

              {/* Abbr text inside */}
              <text x={node.cx} y={node.cy + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={isCore ? 9.5 : node.r > 19 ? 8.5 : 7.5}
                fontWeight="800" fill="#ffffff"
                style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif", pointerEvents: "none",
                  userSelect: "none", letterSpacing: "0.06em" }}>
                {NODE_ABBR[node.id] ?? node.label.slice(0, 4).toUpperCase()}
              </text>

              {/* Full name below */}
              <text x={node.cx} y={node.cy + node.r + 12}
                textAnchor="middle" fontSize={7}
                fill={lightMode
                  ? (isSel || isConn ? "#1e3a8a" : "#7a9a8d")
                  : (isSel || isConn ? "rgba(255,255,255,0.92)" : "rgba(56,189,248,0.55)")}
                style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif", pointerEvents: "none",
                  userSelect: "none", fontWeight: isSel ? "700" : "400", transition: "fill 0.25s" }}>
                {node.label}
              </text>

              {/* BC % badge above node on hover */}
              {isHov && (
                <text x={node.cx} y={node.cy - node.r - 5}
                  textAnchor="middle" fontSize={6.5} fontWeight="700"
                  fill={node.color} opacity={0.9}
                  style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif", pointerEvents: "none" }}>
                  BC:{((BETWEENNESS[node.id] ?? 0) * 100).toFixed(0)}%
                </text>
              )}
            </g>
          );
        })}

        {/* Hover tooltip rendered last (on top) */}
        {renderHoverTooltip()}
      </svg>

      {/* Hint when nothing is selected */}
      <AnimatePresence>
        {!selectedId && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-2.5"
            style={{
              background: lightMode ? "rgba(244, 248, 253, 0.92)" : "rgba(12,19,41,0.85)",
              backdropFilter: "blur(6px)",
              borderTop: lightMode ? "1px solid rgba(165, 185, 210, 0.2)" : "1px solid rgba(37,99,235,0.1)",
            }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: lightMode ? "#475569" : "#3b82f6", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
              Hover para fórmula · Clic para explorar · {ALL_NODES.length} nodos · {CONNECTIONS.length} conexiones
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info panel — slides up when a node is selected */}
      <AnimatePresence>
        {selectedId && selectedInfo && selectedNode && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-20"
            style={{
              background: lightMode ? "rgba(244, 248, 253, 0.98)" : "rgba(5,22,17,0.97)",
              backdropFilter: "blur(18px)",
              borderTop: `2px solid ${selectedNode.color}55`,
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center pt-2 pb-0.5">
              <div className="w-7 h-1 rounded-full"
                style={{ background: lightMode ? "rgba(165,185,210,0.5)" : "rgba(0,153,112,0.3)" }} />
            </div>

            <div className="px-5 pb-4 pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(225, 236, 248, 0.45)",
                      border: "1px solid rgba(255, 255, 255, 0.45)",
                      boxShadow: "inset 3px 3px 6px rgba(150, 175, 205, 0.35), inset -3px -3px 6px rgba(255, 255, 255, 0.9)"
                    }}>
                    <div className="w-3 h-3 rounded-full"
                      style={{ background: selectedNode.color, boxShadow: `0 0 7px ${selectedNode.color}` }} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold leading-none mb-0.5"
                      style={{ color: lightMode ? "#0f172a" : "#ffffff" }}>
                      {selectedInfo.title}
                    </p>
                    <p className="text-[10px]"
                      style={{ color: lightMode ? "#475569" : "#4a7268", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
                      {selectedInfo.subtitle}
                      {CONFIDENCE[selectedId] !== undefined && (
                        <span style={{
                          color: CONFIDENCE[selectedId] >= 94 ? "#009970" : "#ef4444",
                          marginLeft: 6, fontWeight: 700,
                        }}>
                          · {CONFIDENCE[selectedId]}% conf.
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* BC badge */}
                  <div className="px-2 py-1 rounded-lg text-[9px] font-bold"
                    style={{
                      background: `${selectedNode.color}18`,
                      color: selectedNode.color,
                      fontFamily: "'Segoe UI', -apple-system, sans-serif",
                      border: `1px solid ${selectedNode.color}30`,
                    }}>
                    BC {((BETWEENNESS[selectedId] ?? 0) * 100).toFixed(0)}%
                  </div>

                  {onExpandNode && selectedNode.type === "kpi" && (
                    <motion.button
                      onClick={() => onExpandNode(selectedId)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
                      style={{
                        background: "rgba(240, 246, 255, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.7)",
                        boxShadow: "3px 3px 8px rgba(150, 175, 205, 0.22), -3px -3px 8px rgba(255, 255, 255, 0.95), inset 1px 1px 2px rgba(255, 255, 255, 0.75)",
                        color: selectedNode.color,
                        fontFamily: "'Segoe UI', -apple-system, sans-serif",
                      }}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                      Expandir
                    </motion.button>
                  )}
                  <motion.button onClick={() => setSelectedId(null)}
                    className="p-1.5 rounded-lg"
                    style={{ color: lightMode ? "#475569" : "#4a7268" }}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {selectedInfo.stats.map((stat, idx) => (
                  <motion.div key={stat.label} className="rounded-xl px-2.5 py-2"
                    style={{
                      background: "rgba(225, 236, 248, 0.45)",
                      border: "1px solid rgba(255, 255, 255, 0.45)",
                      boxShadow: "inset 3px 3px 6px rgba(150, 175, 205, 0.35), inset -3px -3px 6px rgba(255, 255, 255, 0.9)"
                    }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}>
                    <p className="text-[9px] mb-1 leading-none"
                      style={{ color: lightMode ? "#64748b" : "#7a9a8d", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
                      {stat.label}
                    </p>
                    <p className="text-[13px] font-extrabold leading-none"
                      style={{ color: selectedNode.color, fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {NODE_FORMULAS[selectedId] && (
                <div className="mt-3 px-3 py-2 rounded-xl"
                  style={{
                    background: lightMode ? "rgba(37,99,235,0.05)" : `${selectedNode.color}08`,
                    border: lightMode ? "1px solid rgba(37,99,235,0.12)" : `1px solid ${selectedNode.color}20`,
                  }}>
                  <span className="text-[8px] uppercase tracking-widest mr-3"
                    style={{ color: lightMode ? "#64748b" : "#7a9a8d" }}>
                    Fórmula
                  </span>
                  <code className="text-[10px]"
                    style={{ color: selectedNode.color, fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
                    {NODE_FORMULAS[selectedId]}
                  </code>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
