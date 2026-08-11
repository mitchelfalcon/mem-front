import { motion } from "motion/react";
import { useState } from "react";

const DATA = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
  { name: "Jul", value: 7000 },
];

const W = 280, H = 140, PL = 34, PR = 6, PT = 10, PB = 20;
const CW = W - PL - PR, CH = H - PT - PB;
const VMIN = 2500, VMAX = 7500;

const GPTS = DATA.map((d, i) => ({
  ...d,
  x: PL + (i / (DATA.length - 1)) * CW,
  y: PT + CH * (1 - (d.value - VMIN) / (VMAX - VMIN)),
}));
const LINE = GPTS.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
const AREA = `${LINE} L${GPTS[GPTS.length - 1].x.toFixed(1)},${PT + CH} L${GPTS[0].x.toFixed(1)},${PT + CH} Z`;

export function ChartCard() {
  const [hi, setHi] = useState<number | null>(null);
  return (
    <motion.div
      className="p-6 bg-[#e2ede9] rounded-3xl shadow-[12px_12px_24px_#bdc9c4,-12px_-12px_24px_#ffffff] border-shimmer"
      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(37, 99, 235, 0.2)" }}
    >
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-[#1e3a8a] font-bold text-lg mb-1">Revenue Overview</h2>
        <p className="text-[#7a9a8d] text-sm">Monthly performance</p>
      </motion.div>
      <div className="h-[300px] p-4 bg-[#e2ede9] rounded-2xl shadow-[inset_6px_6px_12px_#bdc9c4,inset_-6px_-6px_12px_#ffffff]">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="cc-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <g key={`g${t}`}>
              <line x1={PL} y1={PT + t * CH} x2={W - PR} y2={PT + t * CH} stroke="#bdc9c4" strokeWidth={0.5} opacity={0.5} />
              <text x={PL - 4} y={PT + t * CH + 4} textAnchor="end" fontSize={8} fill="#7a9a8d">
                ${((VMAX - t * (VMAX - VMIN)) / 1000).toFixed(0)}k
              </text>
            </g>
          ))}
          {GPTS.map((p, i) => (
            <text key={`xl${i}`} x={p.x} y={H - 2} textAnchor="middle" fontSize={8} fill="#7a9a8d">
              {p.name}
            </text>
          ))}
          <path d={AREA} fill="url(#cc-g)" />
          <path d={LINE} fill="none" stroke="#2563eb" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          {GPTS.map((p, i) => (
            <g key={`d${i}`} onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)}>
              <circle cx={p.x} cy={p.y} r={10} fill="transparent" />
              <circle
                cx={p.x} cy={p.y}
                r={hi === i ? 6 : 3.5}
                fill={hi === i ? "#1e3a8a" : "#2563eb"}
                stroke="#e2ede9"
                strokeWidth={2}
                style={{ cursor: "pointer" }}
              />
              {hi === i && (
                <>
                  <rect x={p.x - 24} y={p.y - 28} width={48} height={18} rx={5} fill="#1e3a8a" />
                  <text x={p.x} y={p.y - 15} textAnchor="middle" fontSize={10} fill="#fff" fontWeight={600}>
                    ${(p.value / 1000).toFixed(1)}k
                  </text>
                </>
              )}
            </g>
          ))}
        </svg>
      </div>
    </motion.div>
  );
}
