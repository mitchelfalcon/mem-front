interface AuraCanvasProps {
  activeNode: string | null;
  onNodeClick: (id: string) => void;
}

const NODES = [
  { id: "core",         name: "CORE",        x: 350, y: 252, color: "#00ffa3", centrality: 1.00 },
  { id: "facturacion",  name: "Facturación", x: 350, y:  68, color: "#10b981", centrality: 0.87 },
  { id: "casos",        name: "Casos",       x: 568, y: 192, color: "#3b82f6", centrality: 0.72 },
  { id: "actividades",  name: "Actividades", x: 498, y: 416, color: "#8b5cf6", centrality: 0.65 },
  { id: "ledger",       name: "Ledger",      x: 202, y: 416, color: "#f59e0b", centrality: 0.58 },
  { id: "voz",          name: "Voz",         x: 132, y: 192, color: "#06b6d4", centrality: 0.71 },
];

const CONNECTIONS = [
  { from: "core",        to: "facturacion", id: "cf",  dur: 2.8, begin: 0.0 },
  { from: "core",        to: "casos",       id: "cc",  dur: 3.2, begin: 0.6 },
  { from: "core",        to: "actividades", id: "ca",  dur: 3.6, begin: 1.2 },
  { from: "core",        to: "ledger",      id: "cl",  dur: 3.0, begin: 0.3 },
  { from: "core",        to: "voz",         id: "cv",  dur: 2.6, begin: 0.9 },
  { from: "facturacion", to: "casos",       id: "fc",  dur: 4.2, begin: 0.4 },
  { from: "casos",       to: "actividades", id: "cac", dur: 4.8, begin: 1.0 },
  { from: "actividades", to: "ledger",      id: "al",  dur: 4.4, begin: 0.7 },
  { from: "ledger",      to: "voz",         id: "lv",  dur: 4.0, begin: 1.4 },
  { from: "voz",         to: "facturacion", id: "vf",  dur: 4.6, begin: 0.2 },
];

function getLabelProps(nodeId: string, x: number, y: number, r: number) {
  switch (nodeId) {
    case "casos":
      return { lx: x + r + 10, ly: y + 4, anchor: "start" as const };
    case "voz":
      return { lx: x - r - 10, ly: y + 4, anchor: "end" as const };
    case "facturacion":
      return { lx: x, ly: y - r - 10, anchor: "middle" as const };
    case "actividades":
      return { lx: x, ly: y + r + 16, anchor: "middle" as const };
    case "ledger":
      return { lx: x, ly: y + r + 16, anchor: "middle" as const };
    default:
      return { lx: x, ly: y + r + 16, anchor: "middle" as const };
  }
}

export function AuraCanvas({ activeNode, onNodeClick }: AuraCanvasProps) {
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div className="relative w-full" style={{ aspectRatio: "7 / 5" }}>
      <svg
        viewBox="0 0 700 500"
        className="w-full h-full"
        style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif", overflow: "visible" }}
      >
        <defs>
          {/* Node glow */}
          <filter id="ac-nodeGlow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Line glow */}
          <filter id="ac-lineGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Particle glow */}
          <filter id="ac-particle" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Connections ── */}
        {CONNECTIONS.map((conn) => {
          const from = nodeMap[conn.from];
          const to = nodeMap[conn.to];
          const isCore = conn.from === "core" || conn.to === "core";
          const lineColor = isCore ? `${from.color}55` : `${from.color}28`;
          const lineWidth = isCore ? 1.5 : 1;
          const pRadius = isCore ? 3.5 : 2.5;

          return (
            <g key={conn.id}>
              <line
                x1={from.x} y1={from.y}
                x2={to.x}   y2={to.y}
                stroke={lineColor}
                strokeWidth={lineWidth}
                filter={isCore ? "url(#ac-lineGlow)" : undefined}
              />
              {/* Traveling particle */}
              <circle r={pRadius} fill={from.color} filter="url(#ac-particle)">
                <animateMotion
                  path={`M${from.x},${from.y} L${to.x},${to.y}`}
                  dur={`${conn.dur}s`}
                  begin={`${conn.begin}s`}
                  repeatCount="indefinite"
                />
              </circle>
              {/* Return particle (dimmer) */}
              <circle r={pRadius * 0.7} fill={to.color} filter="url(#ac-particle)" opacity={0.55}>
                <animateMotion
                  path={`M${to.x},${to.y} L${from.x},${from.y}`}
                  dur={`${conn.dur * 1.3}s`}
                  begin={`${conn.begin + conn.dur * 0.5}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}

        {/* ── Nodes ── */}
        {NODES.map((node) => {
          const r = Math.round(26 + node.centrality * 14);
          const isActive = activeNode === node.id;
          const isCore = node.id === "core";
          const { lx, ly, anchor } = getLabelProps(node.id, node.x, node.y, r);
          const haloDur = `${2.8 + node.centrality * 0.8}s`;

          return (
            <g
              key={node.id}
              onClick={() => { if (!isCore) onNodeClick(node.id); }}
              style={{ cursor: isCore ? "default" : "pointer" }}
            >
              {/* Outer breathing halo */}
              <circle cx={node.x} cy={node.y} r={r + 12} fill="none" stroke={node.color} strokeWidth={1} opacity={0.18}>
                <animate attributeName="r"       values={`${r+8};${r+20};${r+8}`}               dur={haloDur} repeatCount="indefinite" />
                <animate attributeName="opacity" values={isActive ? "0.4;0.12;0.4" : "0.18;0.05;0.18"} dur={haloDur} repeatCount="indefinite" />
              </circle>

              {/* Main filled circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={r}
                fill={isActive ? `${node.color}28` : `${node.color}12`}
                stroke={node.color}
                strokeWidth={isActive ? 2.5 : 1.5}
                filter="url(#ac-nodeGlow)"
              />

              {/* Active selection dashed ring */}
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r + 7}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={1.5}
                  strokeDasharray="5 3"
                  opacity={0.65}
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${node.x} ${node.y}`}
                    to={`360 ${node.x} ${node.y}`}
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Glass highlight */}
              <circle
                cx={node.x - r * 0.22}
                cy={node.y - r * 0.22}
                r={r * 0.3}
                fill="rgba(255,255,255,0.12)"
              />

              {/* Core label (inside circle) */}
              {isCore && (
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill="#00ffa3"
                  fontSize={11}
                  fontWeight={700}
                  letterSpacing="3"
                >
                  CORE
                </text>
              )}

              {/* Outer node label */}
              {!isCore && (
                <text
                  x={lx}
                  y={ly}
                  textAnchor={anchor}
                  fill={isActive ? node.color : "#7a9a8d"}
                  fontSize={11}
                  fontWeight={isActive ? 700 : 500}
                >
                  {node.name}
                </text>
              )}

              {/* Centrality score badge (active only) */}
              {isActive && !isCore && (
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill={node.color}
                  fontSize={10}
                  fontWeight={700}
                  style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif" }}
                >
                  {node.centrality.toFixed(2)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
