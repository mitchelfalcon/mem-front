import { motion } from "motion/react";
import { useState } from "react";

const DATA = [
  { name: "Mon", sales: 4000, target: 3500 },
  { name: "Tue", sales: 3000, target: 3500 },
  { name: "Wed", sales: 5000, target: 3500 },
  { name: "Thu", sales: 4500, target: 3500 },
  { name: "Fri", sales: 6000, target: 3500 },
  { name: "Sat", sales: 5500, target: 3500 },
  { name: "Sun", sales: 7000, target: 3500 },
];

const COLORS = ["#009970", "#00c4a0", "#007a5e", "#00b88a", "#00d4ab", "#006b52", "#00e0b8"];
const W = 280, H = 160, PL = 30, PR = 8, PT = 10, PB = 24;
const CW = W - PL - PR, CH = H - PT - PB;
const MAX_V = 8000;
const GW = CW / DATA.length;
const BW = 11, GAP = 2;
const GP = (GW - 2 * BW - GAP) / 2;

function bY(v: number) { return PT + CH - (v / MAX_V) * CH; }
function bH(v: number) { return (v / MAX_V) * CH; }

export function BarChartCard() {
  const [hi, setHi] = useState<number | null>(null);

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
        <h2 className="text-[#1d3a2f] mb-1">Weekly Sales</h2>
        <p className="text-[#7a9a8d] text-sm">Sales vs Target</p>
      </motion.div>

      <div className="h-[350px] p-4 bg-[#e2ede9] rounded-2xl shadow-[inset_6px_6px_12px_#bdc9c4,inset_-6px_-6px_12px_#ffffff]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
          {[0, 2000, 4000, 6000, 8000].map((v) => (
            <g key={`g${v}`}>
              <line x1={PL} y1={bY(v)} x2={W - PR} y2={bY(v)} stroke="#bdc9c4" strokeWidth={0.5} opacity={0.5} />
              <text x={PL - 4} y={bY(v) + 4} textAnchor="end" fontSize={8} fill="#7a9a8d">
                {v === 0 ? "0" : `${v / 1000}k`}
              </text>
            </g>
          ))}
          {DATA.map((d, i) => {
            const gx = PL + i * GW;
            const sx = gx + GP;
            const tx = sx + BW + GAP;
            const active = hi === i;
            return (
              <g key={`b${i}`} onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)}>
                <rect x={sx} y={bY(d.sales)} width={BW} height={bH(d.sales)} rx={3} fill={COLORS[i]} opacity={active ? 1 : 0.85} style={{ cursor: "pointer" }} />
                <rect x={tx} y={bY(d.target)} width={BW} height={bH(d.target)} rx={3} fill="#bdc9c4" opacity={0.3} />
                <text x={gx + GW / 2} y={H - 4} textAnchor="middle" fontSize={8} fill="#7a9a8d">{d.name}</text>
                {active && (
                  <>
                    <rect x={sx - 2} y={bY(d.sales) - 22} width={48} height={16} rx={4} fill="#1d3a2f" />
                    <text x={sx + 22} y={bY(d.sales) - 10} textAnchor="middle" fontSize={9} fill="#fff" fontWeight={600}>
                      ${(d.sales / 1000).toFixed(1)}k
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6">
        <motion.div
          className="flex items-center gap-2 p-3 bg-[#e2ede9] rounded-xl shadow-[4px_4px_8px_#bdc9c4,-4px_-4px_8px_#ffffff]"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-4 h-4 rounded bg-[#009970]" />
          <span className="text-[#1d3a2f] text-sm">Actual Sales</span>
        </motion.div>
        <motion.div
          className="flex items-center gap-2 p-3 bg-[#e2ede9] rounded-xl shadow-[4px_4px_8px_#bdc9c4,-4px_-4px_8px_#ffffff]"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-4 h-4 rounded bg-[#bdc9c4] opacity-60" />
          <span className="text-[#1d3a2f] text-sm">Target</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
