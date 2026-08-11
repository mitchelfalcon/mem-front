import { motion } from "motion/react";

const DATA = [
  { subject: "Sales", A: 120, B: 110 },
  { subject: "Marketing", A: 98, B: 130 },
  { subject: "Development", A: 86, B: 130 },
  { subject: "Support", A: 99, B: 100 },
  { subject: "Design", A: 85, B: 90 },
  { subject: "HR", A: 65, B: 85 },
];

const FULL = 150, N = DATA.length;
const CX = 140, CY = 115, MAX_R = 88;
const ANGLES = DATA.map((_, i) => (i / N) * 2 * Math.PI - Math.PI / 2);

function pt(r: number, i: number): [number, number] {
  return [CX + r * Math.cos(ANGLES[i]), CY + r * Math.sin(ANGLES[i])];
}

function polygon(values: number[]): string {
  return (
    values
      .map((v, i) => {
        const r = (v / FULL) * MAX_R;
        const [x, y] = pt(r, i);
        return `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ") + " Z"
  );
}

function labelAnchor(i: number): string {
  const [x] = pt(1, i);
  if (Math.abs(x - CX) < 4) return "middle";
  return x > CX ? "start" : "end";
}

export function RadarChartCard() {
  const polyA = polygon(DATA.map((d) => d.A));
  const polyB = polygon(DATA.map((d) => d.B));

  return (
    <motion.div
      className="p-6 bg-[#e2ede9] rounded-3xl shadow-[12px_12px_24px_#bdc9c4,-12px_-12px_24px_#ffffff]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: "16px 16px 32px #bdc9c4, -16px -16px 32px #ffffff" }}
    >
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-[#1d3a2f] mb-1">Department Performance</h2>
        <p className="text-[#7a9a8d] text-sm">Q4 2024 vs Q3 2024</p>
      </motion.div>

      <div className="h-[400px] p-4 bg-[#e2ede9] rounded-2xl shadow-[inset_6px_6px_12px_#bdc9c4,inset_-6px_-6px_12px_#ffffff]">
        <svg viewBox="0 0 280 230" width="100%" height="100%" style={{ overflow: "visible" }}>
          {[0.25, 0.5, 0.75, 1].map((t) => {
            const r = t * MAX_R;
            const d =
              ANGLES.map((_, i) => {
                const [x, y] = pt(r, i);
                return `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
              }).join(" ") + " Z";
            return <path key={`ring${t}`} d={d} fill="none" stroke="#bdc9c4" strokeWidth={0.5} opacity={0.6} />;
          })}
          {ANGLES.map((_, i) => {
            const [x, y] = pt(MAX_R, i);
            return (
              <line key={`ax${i}`} x1={CX} y1={CY} x2={x.toFixed(2)} y2={y.toFixed(2)} stroke="#bdc9c4" strokeWidth={0.5} opacity={0.5} />
            );
          })}
          <path d={polyB} fill="#00c4a0" fillOpacity={0.22} stroke="#00c4a0" strokeWidth={2} strokeLinejoin="round" />
          <path d={polyA} fill="#009970" fillOpacity={0.32} stroke="#009970" strokeWidth={2} strokeLinejoin="round" />
          {DATA.map((d, i) => {
            const [x, y] = pt(MAX_R + 14, i);
            const anchor = labelAnchor(i);
            return (
              <text key={`lbl${i}`} x={x.toFixed(2)} y={(y + 4).toFixed(2)} textAnchor={anchor} fontSize={10} fill="#7a9a8d">
                {d.subject}
              </text>
            );
          })}
          <g>
            <circle cx={14} cy={210} r={5} fill="#009970" />
            <text x={24} y={214} fontSize={11} fill="#1d3a2f">Q4 2024</text>
            <circle cx={100} cy={210} r={5} fill="#00c4a0" />
            <text x={110} y={214} fontSize={11} fill="#1d3a2f">Q3 2024</text>
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { label: "Average", value: "92.5", color: "#009970" },
          { label: "Best", value: "120", color: "#007a5e" },
          { label: "Growth", value: "+8.2%", color: "#00c4a0" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-3 bg-[#e2ede9] rounded-xl text-center shadow-[4px_4px_8px_#bdc9c4,-4px_-4px_8px_#ffffff]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: "6px 6px 12px #bdc9c4, -6px -6px 12px #ffffff" }}
          >
            <p className="text-[#7a9a8d] text-sm mb-1">{stat.label}</p>
            <p className="font-semibold" style={{ color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
