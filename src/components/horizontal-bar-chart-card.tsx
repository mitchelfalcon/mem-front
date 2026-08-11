import { motion } from "motion/react";
import { useState } from "react";

const DATA = [
  { category: "Product A", value: 4890, growth: 12.5 },
  { category: "Product B", value: 3920, growth: 8.3 },
  { category: "Product C", value: 5240, growth: 15.2 },
  { category: "Product D", value: 3450, growth: -2.1 },
  { category: "Product E", value: 4120, growth: 6.7 },
];

const COLORS = ["#009970", "#00c4a0", "#007a5e", "#00b88a", "#00d4ab"];
const W = 280, H = 175, PL = 76, PR = 12, PT = 8, PB = 24;
const CW = W - PL - PR, CH = H - PT - PB;
const MAX_V = 6000;
const N = DATA.length;
const BAR_H = 20;
const GAP = (CH - N * BAR_H) / (N + 1);

function barY(i: number) { return PT + GAP * (i + 1) + i * BAR_H; }
function barW(v: number) { return (v / MAX_V) * CW; }

export function HorizontalBarChartCard() {
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
        <h2 className="text-[#1d3a2f] mb-1">Product Revenue</h2>
        <p className="text-[#7a9a8d] text-sm">Top performing products</p>
      </motion.div>

      <div className="h-[400px] p-4 bg-[#e2ede9] rounded-2xl shadow-[inset_6px_6px_12px_#bdc9c4,inset_-6px_-6px_12px_#ffffff]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const x = PL + t * CW;
            const v = MAX_V * t;
            return (
              <g key={`g${t}`}>
                <line x1={x} y1={PT} x2={x} y2={PT + CH} stroke="#bdc9c4" strokeWidth={0.5} opacity={0.5} />
                <text x={x} y={H - 4} textAnchor="middle" fontSize={8} fill="#7a9a8d">
                  {v === 0 ? "0" : `${(v / 1000).toFixed(0)}k`}
                </text>
              </g>
            );
          })}
          {DATA.map((d, i) => {
            const y = barY(i);
            const w = barW(d.value);
            const active = hi === i;
            const midY = y + BAR_H / 2;
            return (
              <g key={`b${i}`} onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} style={{ cursor: "pointer" }}>
                <text x={PL - 6} y={midY + 4} textAnchor="end" fontSize={9} fill={active ? "#1d3a2f" : "#7a9a8d"}>
                  {d.category.split(" ")[1]}
                </text>
                <rect x={PL} y={y} width={CW} height={BAR_H} rx={4} fill="#bdc9c4" opacity={0.15} />
                <rect x={PL} y={y} width={w} height={BAR_H} rx={4} fill={COLORS[i]} opacity={active ? 1 : 0.82} />
                {active && (
                  <text x={PL + w + 5} y={midY + 4} fontSize={9} fill={COLORS[i]} fontWeight={600}>
                    {d.value.toLocaleString()}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-6">
        {DATA.map((item, index) => (
          <motion.div
            key={item.category}
            className="p-3 bg-[#e2ede9] rounded-xl text-center shadow-[4px_4px_8px_#bdc9c4,-4px_-4px_8px_#ffffff]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.1, boxShadow: "6px 6px 12px #bdc9c4, -6px -6px 12px #ffffff" }}
          >
            <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: COLORS[index] }} />
            <p className="text-[#7a9a8d] text-xs mb-1">{item.category.split(" ")[1]}</p>
            <p className={`text-xs font-semibold ${item.growth > 0 ? "text-[#009970]" : "text-[#ef4444]"}`}>
              {item.growth > 0 ? "+" : ""}{item.growth}%
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
