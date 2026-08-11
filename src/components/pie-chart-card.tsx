import { motion } from "motion/react";
import { useState } from "react";

const DATA = [
  { name: "Desktop", value: 4200, color: "#009970" },
  { name: "Mobile", value: 3100, color: "#00c4a0" },
  { name: "Tablet", value: 2400, color: "#f59e0b" },
  { name: "Others", value: 1500, color: "#007a5e" },
];

const TOTAL = DATA.reduce((s, d) => s + d.value, 0);
const CX = 130, CY = 105, RO = 82, RI = 48;

function polar(r: number, a: number): [number, number] {
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

const SEGS = (() => {
  let a = -Math.PI / 2;
  return DATA.map((d) => {
    const span = (d.value / TOTAL) * 2 * Math.PI;
    const a1 = a, a2 = a + span;
    a = a2;
    return { ...d, a1, a2 };
  });
})();

function segPath(a1: number, a2: number, active: boolean): string {
  const GAP = 0.025;
  const sa1 = a1 + GAP, sa2 = a2 - GAP;
  const midA = (a1 + a2) / 2;
  const expand = active ? 7 : 0;
  const tx = expand * Math.cos(midA), ty = expand * Math.sin(midA);
  const [ox1, oy1] = polar(RO, sa1);
  const [ox2, oy2] = polar(RO, sa2);
  const [ix2, iy2] = polar(RI, sa2);
  const [ix1, iy1] = polar(RI, sa1);
  const lg = (sa2 - sa1) > Math.PI ? 1 : 0;
  const f = (x: number, t: number) => (x + t).toFixed(2);
  return `M${f(ox1, tx)},${f(oy1, ty)} A${RO},${RO} 0 ${lg},1 ${f(ox2, tx)},${f(oy2, ty)} L${f(ix2, tx)},${f(iy2, ty)} A${RI},${RI} 0 ${lg},0 ${f(ix1, tx)},${f(iy1, ty)} Z`;
}

export function PieChartCard() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

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
        <h2 className="text-[#1d3a2f] mb-1">Device Distribution</h2>
        <p className="text-[#7a9a8d] text-sm">Traffic by device type</p>
      </motion.div>

      <div className="h-[350px] p-4 bg-[#e2ede9] rounded-2xl shadow-[inset_6px_6px_12px_#bdc9c4,inset_-6px_-6px_12px_#ffffff]">
        <svg viewBox="0 0 260 200" width="100%" height="100%" style={{ overflow: "visible" }}>
          {SEGS.map((seg, i) => (
            <path
              key={`s${i}`}
              d={segPath(seg.a1, seg.a2, activeIdx === i)}
              fill={seg.color}
              opacity={activeIdx === null ? 0.85 : activeIdx === i ? 1 : 0.5}
              style={{ cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            />
          ))}
          {activeIdx !== null ? (
            <>
              <text x={CX} y={CY - 8} textAnchor="middle" fontSize={22} fontWeight={700} fill={DATA[activeIdx].color}>
                {((DATA[activeIdx].value / TOTAL) * 100).toFixed(0)}%
              </text>
              <text x={CX} y={CY + 12} textAnchor="middle" fontSize={10} fill="#7a9a8d">
                {DATA[activeIdx].name}
              </text>
            </>
          ) : (
            <>
              <text x={CX} y={CY - 6} textAnchor="middle" fontSize={13} fontWeight={600} fill="#4a7268">
                Total
              </text>
              <text x={CX} y={CY + 12} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1d3a2f">
                {(TOTAL / 1000).toFixed(1)}k
              </text>
            </>
          )}
          {/* Legend */}
          {DATA.map((d, i) => (
            <g key={`leg${i}`}>
              <circle cx={14 + (i % 2) * 115} cy={168 + Math.floor(i / 2) * 18} r={5} fill={d.color} />
              <text x={24 + (i % 2) * 115} y={172 + Math.floor(i / 2) * 18} fontSize={11} fill="#1d3a2f">
                {d.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {DATA.map((item, index) => (
          <motion.div
            key={item.name}
            className="p-3 bg-[#e2ede9] rounded-xl shadow-[4px_4px_8px_#bdc9c4,-4px_-4px_8px_#ffffff]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: "6px 6px 12px #bdc9c4, -6px -6px 12px #ffffff" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[#7a9a8d] text-sm">{item.name}</span>
            </div>
            <p className="text-[#1d3a2f] font-semibold">{item.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
