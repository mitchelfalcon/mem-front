import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SparklineProps {
  data: number[];
  color: string;
  gradId: string;
}

function Sparkline({ data, color, gradId }: SparklineProps) {
  const W = 200;
  const H = 56;
  const pad = 3;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - pad - ((v - min) / range) * (H - pad * 2),
  }));

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.42} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const cards = [
  {
    title: "Total Balance",
    value: "$125,500.00",
    change: "+8.4%",
    trend: "up" as const,
    color: "#009970",
    gradId: "balGrad1",
    progress: 78,
    sparkData: [80, 95, 72, 110, 88, 120, 105, 130],
  },
  {
    title: "Savings",
    value: "$28,340.00",
    change: "+12.1%",
    trend: "up" as const,
    color: "#00c4a0",
    gradId: "balGrad2",
    progress: 55,
    sparkData: [20, 35, 28, 45, 38, 50, 42, 55],
  },
  {
    title: "Debts",
    value: "$14,200.00",
    change: "-3.2%",
    trend: "down" as const,
    color: "#ef4444",
    gradId: "balGrad3",
    progress: 35,
    sparkData: [62, 56, 51, 48, 44, 41, 37, 35],
  },
];

export function BalanceOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          className="p-6 bg-[#e2ede9] rounded-3xl cursor-pointer
            shadow-[12px_12px_24px_#bdc9c4,-12px_-12px_24px_#ffffff]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.1 }}
          whileHover={{ scale: 1.02, boxShadow: "16px 16px 32px #bdc9c4, -16px -16px 32px #ffffff" }}
          whileTap={{ scale: 0.98, boxShadow: "inset 6px 6px 12px #bdc9c4, inset -6px -6px 12px #ffffff" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[#7a9a8d] text-xs font-medium uppercase tracking-wider mb-1">
                {card.title}
              </p>
              <h3 className="text-[#1d3a2f] text-2xl font-bold leading-none">{card.value}</h3>
            </div>
            <motion.span
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold
                bg-[#e2ede9] shadow-[inset_2px_2px_5px_#bdc9c4,inset_-2px_-2px_5px_#ffffff]
                ${card.trend === "up" ? "text-[#009970]" : "text-[#ef4444]"}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {card.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {card.change}
            </motion.span>
          </div>

          {/* Pure SVG sparkline — no recharts */}
          <div className="h-[64px] mb-4 rounded-2xl overflow-hidden
            shadow-[inset_4px_4px_8px_#bdc9c4,inset_-4px_-4px_8px_#ffffff]">
            <Sparkline data={card.sparkData} color={card.color} gradId={card.gradId} />
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-[#e2ede9] rounded-full mb-2
            shadow-[inset_2px_2px_4px_#bdc9c4,inset_-2px_-2px_4px_#ffffff]">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: card.color }}
              initial={{ width: 0 }}
              animate={{ width: `${card.progress}%` }}
              transition={{ duration: 1.3, delay: 0.6 + index * 0.1, ease: "easeOut" }}
            />
          </div>
          <p className="text-[#7a9a8d] text-xs">{card.progress}% of annual target</p>
        </motion.div>
      ))}
    </div>
  );
}
