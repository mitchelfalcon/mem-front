import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GitBranch, Activity, Users, Link2, Cpu,
  ChevronDown, ChevronRight, X, Navigation, Waypoints, Workflow,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
interface AlgoDef {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  formula: string[];
  formulaNote: string;
  complexity: string;
  tags: string[];
}

interface GdsSectionDef {
  id: string;
  label: string;
  short: string;
  Icon: React.ElementType;
  color: string;
  algos: AlgoDef[];
}

// ─── Node example data ─────────────────────────────────────────────────────
const NODE_DATA: Record<string, { id: number; label: string; props: Record<string, string | number> }> = {
  facturacion: { id: 1201, label: "Invoice",    props: { Name: "Q4-2024-FAC-001", Status: "Active",  Risk_Score: 0.12, Confidence: "96%" } },
  casos:       { id: 1202, label: "Case",       props: { Name: "CASE-2024-213",   Status: "Open",    Risk_Score: 0.43, Confidence: "91%" } },
  actividades: { id: 1203, label: "Activity",   props: { Name: "Sprint-Q4-001",   Status: "Running", Risk_Score: 0.08, Confidence: "98%" } },
  ledger:      { id: 1204, label: "Ledger",     props: { Name: "AWU_Q4_2024",     Status: "Synced",  Risk_Score: 0.34, Confidence: "89%" } },
  voz:         { id: 1205, label: "VoiceNode",  props: { Name: "NLP-Engine-v2",   Status: "Active",  Risk_Score: 0.06, Confidence: "94%" } },
};

// ─── Algorithm definitions ──────────────────────────────────────────────────
const GDS_SECTIONS: GdsSectionDef[] = [
  {
    id: "pathfinding", label: "Pathfinding & Search", short: "Paths",
    Icon: Navigation, color: "#1e3a8a",
    algos: [
      {
        id: "dijkstra", label: "Dijkstra Shortest Path", emoji: "→",
        desc: "Cálculo de la ruta con menor peso/costo entre dos puntos de la red.",
        formula: ["d(v) = min   [ d(u) + w(u,v) ]", "       u∈adj(v)"],
        formulaNote: "d(v) = distancia mínima acumulada al nodo v. w(u,v) = peso del arco u→v.",
        complexity: "O((V+E) log V)", tags: ["weighted", "directed", "optimal"],
      },
      {
        id: "astar", label: "A* (A-Star) Algorithm", emoji: "★",
        desc: "Búsqueda heurística optimizada para grafos con coordenadas espaciales.",
        formula: ["f(n) = g(n) + h(n)", "", "g(n) = costo exacto desde origen", "h(n) = heurística admisible estimada"],
        formulaNote: "Garantiza optimalidad si h(n) es admisible (nunca sobreestima).",
        complexity: "O(E log V) best-case", tags: ["heuristic", "spatial", "optimal"],
      },
      {
        id: "yens", label: "Yen's K-Shortest Paths", emoji: "⑂",
        desc: "Cálculo de K rutas alternativas y secundarias de contingencia.",
        formula: ["K", "∪  P_k  donde P_k = k-ésima ruta más corta", "k=1"],
        formulaNote: "Utiliza eliminación iterativa de nodos sobre Dijkstra base.",
        complexity: "O(K · V · (E + V log V))", tags: ["k-paths", "redundancy"],
      },
      {
        id: "bfsdfs", label: "BFS & DFS", emoji: "⊞",
        desc: "Exploración de red por niveles (BFS) y por profundidad (DFS).",
        formula: ["BFS: FIFO queue  — O(V+E)", "DFS: LIFO stack  — O(V+E)", "", "visited[v] ← true on first touch"],
        formulaNote: "BFS garantiza distancia mínima en grafos no ponderados.",
        complexity: "O(V+E)", tags: ["unweighted", "traversal"],
      },
      {
        id: "sssp", label: "Single Source Shortest Path", emoji: "⊙",
        desc: "Evaluación de distancia desde un nodo raíz hacia toda la red.",
        formula: ["δ(s, v) = min { w(p) : s ↝ v }", "         p∈Paths(s,v)"],
        formulaNote: "δ(s,v) = peso mínimo de todos los caminos simples s→v.",
        complexity: "O(V·E) con Bellman-Ford", tags: ["single-source", "negative-weights"],
      },
    ],
  },
  {
    id: "centrality", label: "Centrality & Importance", short: "Central",
    Icon: Activity, color: "#2563eb",
    algos: [
      {
        id: "betweenness", label: "Betweenness Centrality", emoji: "⬡",
        desc: "Control y detección de cuellos de botella críticos en la red.",
        formula: [
          "         σ_st(v)",
          "C_B(v) = Σ ───────",
          "       s≠v≠t   σ_st",
        ],
        formulaNote: "σ_st = total de rutas más cortas entre s y t. σ_st(v) = las que pasan por v.",
        complexity: "O(V·E)", tags: ["bottleneck", "bridge-detection"],
      },
      {
        id: "pagerank", label: "PageRank & ArticleRank", emoji: "◈",
        desc: "Relevancia estructural basada en calidad y cantidad de enlaces entrantes.",
        formula: [
          "         (1−d)          PR(u)",
          "PR(v) = ─────── + d · Σ ─────",
          "           N         u∈in(v) L(u)",
        ],
        formulaNote: "d = factor de amortiguación (≈0.85). L(u) = número de enlaces salientes de u.",
        complexity: "O(V+E) por iteración", tags: ["authority", "hub", "convergence"],
      },
      {
        id: "degree", label: "Degree Centrality", emoji: "◉",
        desc: "Conteo de conexiones directas — subdividido en In-degree / Out-degree.",
        formula: [
          "k_i = Σ A_ij         (total)",
          "       j",
          "",
          "k_i^in  = Σ A_ji    (entrante)",
          "k_i^out = Σ A_ij    (saliente)",
        ],
        formulaNote: "A = matriz de adyacencia. k_i normalizado: C_D = k_i / (n−1).",
        complexity: "O(V+E)", tags: ["in-degree", "out-degree"],
      },
      {
        id: "closeness", label: "Closeness Centrality", emoji: "⊛",
        desc: "Velocidad de propagación de la información desde un nodo al resto.",
        formula: [
          "           n − 1",
          "C_C(v) = ──────────────",
          "          Σ d(v, u)",
          "         u≠v",
        ],
        formulaNote: "d(v,u) = distancia del camino más corto. Mayor C_C = propagación más rápida.",
        complexity: "O(V·(V+E))", tags: ["propagation", "efficiency"],
      },
    ],
  },
  {
    id: "community", label: "Community Detection", short: "Clusters",
    Icon: Users, color: "#8b5cf6",
    algos: [
      {
        id: "lpa", label: "Label Propagation Algorithm", emoji: "⬤",
        desc: "Difusión convergente de etiquetas para descubrir clústeres naturales.",
        formula: [
          "label(v) ← argmax  | { u∈N(v) : label(u)=c } |",
          "              c∈L",
          "",
          "Converge cuando ∀v: label(v) = mayoría vecinos",
        ],
        formulaNote: "Iteración sincrónica o asincrónica. Sin parámetros de entrada.",
        complexity: "O(V+E) por iteración", tags: ["semi-supervised", "scalable"],
      },
      {
        id: "louvain", label: "Louvain Modularity", emoji: "⬡",
        desc: "Detección de comunidades de alta densidad y fuerza relacional.",
        formula: [
          "     1          k_i · k_j",
          "Q = ─── Σ  [ A_ij − ─────── ] δ(c_i, c_j)",
          "    2m  ij              2m",
        ],
        formulaNote: "m = arcos totales. k_i = grado del nodo i. δ = 1 si misma comunidad.",
        complexity: "O(V log V)", tags: ["hierarchical", "modularity"],
      },
      {
        id: "wcc", label: "Weakly Connected Components", emoji: "∿",
        desc: "Aislamiento y detección de subgrafos desconectados del ecosistema.",
        formula: [
          "WCC(G) = { C ⊆ V : ∀u,v∈C ∃ path u↔v }",
          "",
          "Implementado via Union-Find (DSU):",
          "find(x) → raíz canónica de x",
          "union(x,y) → fusionar componentes",
        ],
        formulaNote: "Ignora dirección de arcos. Útil para detectar islas aisladas.",
        complexity: "O((V+E)·α(V))", tags: ["components", "isolation"],
      },
    ],
  },
  {
    id: "similarity", label: "Similarity & Link Prediction", short: "Similar",
    Icon: Link2, color: "#f59e0b",
    algos: [
      {
        id: "nodesim", label: "Node Similarity", emoji: "≈",
        desc: "Algoritmos de Jaccard y Similitud de Coseno para encontrar perfiles gemelos.",
        formula: [
          "         |N(u) ∩ N(v)|",
          "J(u,v) = ───────────────   (Jaccard)",
          "         |N(u) ∪ N(v)|",
          "",
          "         N(u) · N(v)",
          "cos(u,v) = ───────────────  (Coseno)",
          "          ‖N(u)‖ · ‖N(v)‖",
        ],
        formulaNote: "N(v) = conjunto de vecinos de v. Rango: [0,1]. 1 = idénticos.",
        complexity: "O(V²·k) donde k = grado promedio", tags: ["jaccard", "cosine", "twins"],
      },
      {
        id: "linkpred", label: "Link Prediction", emoji: "⇝",
        desc: "Proyección de nuevas relaciones por Preferential Attachment y Vecinos Comunes.",
        formula: [
          "PA(x,y) = |Γ(x)| · |Γ(y)|   (Pref. Attach.)",
          "",
          "CN(x,y) = |Γ(x) ∩ Γ(y)|    (Common Neigh.)",
          "",
          "AA(x,y) = Σ     1/log|Γ(z)| (Adamic-Adar)",
          "        z∈Γ(x)∩Γ(y)",
        ],
        formulaNote: "Γ(x) = vecinos de x. Mayor score = mayor probabilidad de enlace futuro.",
        complexity: "O(V·k²)", tags: ["prediction", "attachment", "inference"],
      },
    ],
  },
  {
    id: "ml", label: "Graph Machine Learning", short: "GML",
    Icon: Cpu, color: "#3b82f6",
    algos: [
      {
        id: "embedding", label: "Node Embedding (GraphSAGE / Node2Vec)", emoji: "⬛",
        desc: "Vectorización de nodos para aprendizaje profundo y transferencia de representación.",
        formula: [
          "GraphSAGE:",
          "h_v^k = σ( W^k · CONCAT( h_v^{k-1}, AGG({h_u^{k-1}: u∈N(v)}) ) )",
          "",
          "Node2Vec (random walk):",
          "P(c_i | f(v)) maximized via skip-gram",
        ],
        formulaNote: "AGG = función de agregación (mean/max/LSTM). k = profundidad de capas.",
        complexity: "O(V·d·k) por época", tags: ["GraphSAGE", "Node2Vec", "embeddings"],
      },
      {
        id: "gnn", label: "Graph Neural Networks (GNN) Controller", emoji: "⬡",
        desc: "Panel de control maestro para redes neuronales de grafos con mensaje passing.",
        formula: [
          "Message Passing:",
          "m_v^{t+1} = Σ   M_t( h_v^t, h_u^t, e_vu )",
          "           u∈N(v)",
          "",
          "h_v^{t+1} = U_t( h_v^t, m_v^{t+1} )",
        ],
        formulaNote: "M_t = función de mensajes. U_t = función de actualización. T pasos de difusión.",
        complexity: "O(T·E·d²)", tags: ["GCN", "GAT", "message-passing"],
      },
    ],
  },
];

// ─── Dynamic style function helper ───────────────────────────────────────────
const getGStyles = (darkMode?: boolean) => {
  return {
    card: {
      background: "rgba(240, 246, 255, 0.48)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      border: "1px solid rgba(255, 255, 255, 0.7)",
      boxShadow: "10px 10px 24px rgba(150, 175, 205, 0.28), -10px -10px 24px rgba(255, 255, 255, 0.95), inset 2px 2px 5px rgba(255, 255, 255, 0.75), inset -2px -2px 5px rgba(150, 175, 205, 0.12)",
    } as React.CSSProperties,
    cardDeep: {
      background: "rgba(238, 245, 255, 0.55)",
      backdropFilter: "blur(28px)",
      WebkitBackdropFilter: "blur(28px)",
      border: "1px solid rgba(255, 255, 255, 0.75)",
      boxShadow: "14px 14px 32px rgba(150, 175, 205, 0.32), -14px -14px 32px rgba(255, 255, 255, 0.95), inset 3px 3px 6px rgba(255, 255, 255, 0.8), inset -3px -3px 6px rgba(150, 175, 205, 0.15)",
    } as React.CSSProperties,
    inset: {
      background: "rgba(225, 236, 248, 0.45)",
      border: "1px solid rgba(255, 255, 255, 0.45)",
      boxShadow: "inset 4px 4px 10px rgba(150, 175, 205, 0.35), inset -4px -4px 10px rgba(255, 255, 255, 0.9)",
      borderRadius: 10,
    } as React.CSSProperties,
  };
};

// ─── Formula overlay (neumorphic) ───────────────────────────────────────────
const FormulaOverlay: React.FC<{
  algo: AlgoDef;
  activeNode: string | null;
  onClose: () => void;
  darkMode?: boolean;
}> = ({ algo, activeNode, onClose, darkMode }) => {
  const nodeData = activeNode ? NODE_DATA[activeNode] : null;
  const section = GDS_SECTIONS.find(s => s.algos.some(a => a.id === algo.id));
  const accent = section?.color ?? (darkMode ? "#2563eb" : "#1e3a8a");
  const G = getGStyles(darkMode);

  const textPrimary = darkMode ? "#0f172a" : "#0d1f1a";
  const textMuted = darkMode ? "#5b7290" : "#7a9a8d";
  const textMutedDark = darkMode ? "#334155" : "#4a7268";

  return (
    <motion.div
      className="fixed inset-0 z-[130] flex items-center justify-center p-6"
      style={{ backdropFilter: "blur(16px)", background: darkMode ? "rgba(165, 185, 210, 0.45)" : "rgba(178,196,189,0.55)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="flex gap-4 w-full max-w-4xl"
        initial={{ scale: 0.90, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.90, y: 24 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Panel A: Formula Visualizer */}
        <motion.div
          className="flex-1 rounded-3xl p-6"
          style={G.cardDeep}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{algo.emoji}</span>
                <h3 className="text-base font-bold" style={{ color: textPrimary, fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
                  {algo.label}
                </h3>
              </div>
              <p className="text-[11px]" style={{ color: textMuted }}>{algo.desc}</p>
            </div>
            <motion.button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ml-3"
              style={G.card}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-3.5 h-3.5" style={{ color: textMuted }} />
            </motion.button>
          </div>

          {/* Separator */}
          <div className="h-px mb-4"
            style={{ background: `linear-gradient(to right, ${accent}33, transparent)` }} />

          {/* Formula block */}
          <div className="mb-4">
            <span className="text-[9px] uppercase tracking-widest font-mono mb-2 block"
              style={{ color: textMuted }}>
              Graph Math · Formula Técnica
            </span>
            <div className="p-4 rounded-2xl" style={G.inset}>
              <pre
                className="text-sm leading-relaxed whitespace-pre"
                style={{ color: accent, fontFamily: "'Segoe UI', -apple-system, sans-serif", letterSpacing: "0.02em" }}
              >
                {algo.formula.join("\n")}
              </pre>
            </div>
          </div>

          {/* Formula note */}
          <div className="p-3 rounded-2xl mb-4" style={G.inset}>
            <span className="text-[9px] uppercase tracking-widest font-mono block mb-1"
              style={{ color: textMuted }}>Descripción Analítica</span>
            <p className="text-[11px] leading-relaxed"
              style={{ color: textMutedDark, fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
              {algo.formulaNote}
            </p>
          </div>

          {/* Tags + complexity */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {algo.tags.map(tag => (
                <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wide"
                  style={{ background: `${accent}10`, color: accent, border: `1px solid ${accent}22` }}>
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-[10px] font-mono font-bold"
              style={{ color: accent }}>{algo.complexity}</span>
          </div>
        </motion.div>

        {/* Panel B: Property Inspector */}
        <motion.div
          className="rounded-3xl p-5"
          style={{ ...G.cardDeep, width: 260, flexShrink: 0 }}
        >
          <span className="text-[9px] uppercase tracking-widest font-mono mb-3 block"
            style={{ color: textMuted }}>
            Inspector de Grafo · Property Sidebar
          </span>

          {nodeData ? (
            <>
              {/* ID */}
              <div className="mb-3 p-2.5 rounded-xl" style={G.inset}>
                <span className="text-[9px] uppercase tracking-widest" style={{ color: textMuted }}>Identity</span>
                <p className="text-base font-bold font-mono mt-0.5" style={{ color: darkMode ? "#2563eb" : "#10b981" }}>
                  &lt;id&gt;: {nodeData.id}
                </p>
              </div>

              {/* Label */}
              <div className="mb-3">
                <span className="text-[9px] uppercase tracking-widest" style={{ color: textMuted }}>Label</span>
                <div className="mt-1">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full font-mono"
                    style={{
                      background: darkMode ? "rgba(37,99,235,0.08)" : "rgba(37,99,235,0.08)",
                      color: darkMode ? "#2563eb" : "#1e3a8a",
                      border: darkMode ? "1px solid rgba(37,99,235,0.16)" : "1px solid rgba(37,99,235,0.16)"
                    }}>
                    {nodeData.label}
                  </span>
                </div>
              </div>

              {/* Properties */}
              <div>
                <span className="text-[9px] uppercase tracking-widest mb-2 block" style={{ color: textMuted }}>
                  Properties
                </span>
                <div className="space-y-2">
                  {Object.entries(nodeData.props).map(([k, v]) => {
                    const isRisk = k === "Risk_Score";
                    const riskVal = isRisk ? Number(v) : 0;
                    return (
                      <div key={k} className="p-2 rounded-xl" style={G.inset}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-bold" style={{ color: textMutedDark }}>{k}</span>
                          <span className="text-[10px] font-mono"
                            style={{ color: isRisk ? (riskVal > 0.5 ? "#ef4444" : (darkMode ? "#2563eb" : "#1e3a8a")) : textMuted }}>
                            {String(v)}
                          </span>
                        </div>
                        {isRisk && (
                          <div className="h-1 rounded-full overflow-hidden"
                            style={{ background: darkMode ? "rgba(37,99,235,0.08)" : "rgba(37,99,235,0.08)" }}>
                            <motion.div className="h-full rounded-full"
                              style={{ background: riskVal > 0.5 ? "#ef4444" : (darkMode ? "#2563eb" : "#1e3a8a") }}
                              initial={{ width: 0 }}
                              animate={{ width: `${riskVal * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={G.inset}>
                <span className="text-lg">⬡</span>
              </div>
              <p className="text-[10px] text-center font-mono" style={{ color: textMuted }}>
                Selecciona un nodo<br />para inspeccionar
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main GDS Movement Console ─────────────────────────────────────────────
export function GdsMovementConsole({ 
  activeNode, 
  darkMode,
  openSection: externalOpenSection,
  setOpenSection: externalSetOpenSection,
}: { 
  activeNode: string | null; 
  darkMode?: boolean;
  openSection?: string | null;
  setOpenSection?: (s: string | null) => void;
}) {
  const G = getGStyles(darkMode);
  const [localOpenSection, setLocalOpenSection] = useState<string | null>(null);
  const openSection = externalOpenSection !== undefined ? externalOpenSection : localOpenSection;
  const setOpenSection = externalSetOpenSection !== undefined ? externalSetOpenSection : setLocalOpenSection;

  const [activeAlgo, setActiveAlgo]   = useState<AlgoDef | null>(null);
  const [showFormula, setShowFormula] = useState(false);

  const textPrimary = darkMode ? "#0f172a" : "#0d1f1a";
  const textMuted = darkMode ? "#5b7290" : "#7a9a8d";
  const iconColor = darkMode ? "#2563eb" : "#10b981";
  
  const shadowActive = darkMode 
    ? "inset 3px 3px 6px rgba(165,185,210,0.35), inset -3px -3px 6px rgba(255,255,255,0.9)" 
    : "inset 3px 3px 6px #bdc9c4, inset -3px -3px 6px #ffffff";

  const shadowCardHover = darkMode 
    ? "8px 8px 16px rgba(165, 185, 210, 0.35), -8px -8px 16px rgba(255, 255, 255, 0.95)"
    : "8px 8px 16px #bdc9c4, -8px -8px 16px #ffffff";

  const LEDS = [
    { id: "flux",    label: "FLUX",    sub: "AWU_Ledger__c",  color: darkMode ? "#2563eb" : "#1e3a8a" },
    { id: "intent",  label: "INTENT",  sub: "IntentVector",   color: "#3b82f6" },
    { id: "formula", label: "FORMULA", sub: "Colab Engine",   color: "#8b5cf6" },
  ];

  const handleAlgoClick = (algo: AlgoDef) => {
    setActiveAlgo(algo);
    setShowFormula(true);
    setOpenSection(null);
  };

  const handleSectionToggle = (id: string) => {
    setOpenSection(p => p === id ? null : id);
  };

  if (externalOpenSection !== undefined) {
    return (
      <>
        {/* ── Dropdown panel for Integrated GDS Top Control ────────────────────────────────────────── */}
        <AnimatePresence>
          {openSection && (() => {
            const section = GDS_SECTIONS.find(s => s.id === openSection);
            if (!section) return null;
            return (
              <motion.div
                key={openSection}
                className="mb-5 rounded-3xl overflow-hidden"
                style={G.card}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2.5">
                    <section.Icon className="w-3.5 h-3.5" style={{ color: section.color }} />
                    <span className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: section.color }}>{section.label}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {section.algos.map((algo, i) => (
                      <motion.button
                        key={algo.id}
                        onClick={() => handleAlgoClick(algo)}
                        className="text-left p-3 rounded-2xl group cursor-pointer"
                        style={G.card}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                        whileHover={{
                          scale: 1.03,
                          boxShadow: `${shadowCardHover}, 0 0 0 1.5px ${section.color}22`,
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-sm">{algo.emoji}</span>
                          <ChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: section.color }} />
                        </div>
                        <p className="text-[10px] font-semibold leading-tight mb-1"
                          style={{ color: textPrimary }}>
                          {algo.label}
                        </p>
                        <p className="text-[9px] leading-snug"
                          style={{ color: textMuted }}>
                          {algo.desc.length > 60 ? algo.desc.slice(0, 60) + "…" : algo.desc}
                        </p>
                        <span className="text-[8px] font-mono mt-1.5 block"
                          style={{ color: section.color }}>
                          {algo.complexity}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* ── Formula overlay ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {showFormula && activeAlgo && (
            <FormulaOverlay
              key="formula-overlay"
              algo={activeAlgo}
              activeNode={activeNode}
              onClose={() => setShowFormula(false)}
              darkMode={darkMode}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, type: "spring", stiffness: 240, damping: 24 }}
      >
        <div className="rounded-2xl overflow-hidden" style={G.card}>
          {/* ── Main bar ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 px-4 py-3">

            {/* Title */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={G.inset}>
                <Workflow className="w-3.5 h-3.5" style={{ color: iconColor }} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"
                style={{ color: textPrimary, fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
                GDS &amp; Algorithm Console
              </span>
            </div>

            {/* Separator */}
            <div className="w-px h-5 flex-shrink-0"
              style={{ background: `linear-gradient(to bottom, ${darkMode ? "rgba(37,99,235,0.2)" : "rgba(16,185,129,0.2)"}, transparent)` }} />

            {/* Algorithm section tabs */}
            <div className="flex items-center gap-1.5 flex-1 overflow-x-auto">
              {GDS_SECTIONS.map(section => {
                const { Icon } = section;
                const isOpen = openSection === section.id;
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => handleSectionToggle(section.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl flex-shrink-0"
                    style={{
                      ...G.card,
                      boxShadow: isOpen
                        ? `${shadowActive}, 0 0 0 1.5px ${section.color}33`
                        : G.card.boxShadow,
                      transition: "all 0.18s",
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <Icon className="w-3 h-3 flex-shrink-0"
                      style={{ color: isOpen ? section.color : textMuted }} />
                    <span className="text-[10px] font-semibold whitespace-nowrap"
                      style={{ color: isOpen ? section.color : textMuted }}>
                      {section.short}
                    </span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
                      <ChevronDown className="w-2.5 h-2.5"
                        style={{ color: isOpen ? section.color : (darkMode ? "rgba(165,185,210,0.5)" : "#bdc9c4") }} />
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>

          </div>

          {/* ── Dropdown panel ────────────────────────────────────────── */}
          <AnimatePresence>
            {openSection && (() => {
              const section = GDS_SECTIONS.find(s => s.id === openSection);
              if (!section) return null;
              return (
                <motion.div
                  key={openSection}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  {/* Separator */}
                  <div className="mx-4"
                    style={{ height: "1px", background: `linear-gradient(to right, ${section.color}22, ${darkMode ? "rgba(37,99,235,0.08)" : "rgba(16,185,129,0.08)"}, transparent)` }} />

                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-2.5">
                      <section.Icon className="w-3 h-3" style={{ color: section.color }} />
                      <span className="text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: section.color }}>{section.label}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {section.algos.map((algo, i) => (
                        <motion.button
                          key={algo.id}
                          onClick={() => handleAlgoClick(algo)}
                          className="text-left p-3 rounded-2xl group"
                          style={G.card}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                          whileHover={{
                            scale: 1.03,
                            boxShadow: `${shadowCardHover}, 0 0 0 1.5px ${section.color}22`,
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-sm">{algo.emoji}</span>
                            <ChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ color: section.color }} />
                          </div>
                          <p className="text-[10px] font-semibold leading-tight mb-1"
                            style={{ color: textPrimary }}>
                            {algo.label}
                          </p>
                          <p className="text-[9px] leading-snug"
                            style={{ color: textMuted }}>
                            {algo.desc.length > 60 ? algo.desc.slice(0, 60) + "…" : algo.desc}
                          </p>
                          <span className="text-[8px] font-mono mt-1.5 block"
                            style={{ color: section.color }}>
                            {algo.complexity}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

        </div>
      </motion.div>

      {/* ── Formula overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFormula && activeAlgo && (
          <FormulaOverlay
            key="formula-overlay"
            algo={activeAlgo}
            activeNode={activeNode}
            onClose={() => setShowFormula(false)}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </>
  );
}
