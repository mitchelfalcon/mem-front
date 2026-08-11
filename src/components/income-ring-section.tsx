import { motion } from "motion/react";

const waveData = [28, 45, 22, 58, 36, 68, 48, 80, 62, 88, 70, 95];

function WaveChart({ data, color }: { data: number[]; color: string }) {
  const W = 400;
  const H = 80;
  const pad = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - pad - ((v - min) / range) * (H - pad * 2),
  }));

  // Smooth bezier curve using catmull-rom style control points
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = (pts[i].x + pts[i + 1].x) / 2;
    d += ` C${cp1x.toFixed(1)},${pts[i].y.toFixed(1)} ${cp1x.toFixed(1)},${pts[i + 1].y.toFixed(1)} ${pts[i + 1].x.toFixed(1)},${pts[i + 1].y.toFixed(1)}`;
  }
  const area = `${d} L${W},${H} L0,${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id="incomeWaveSvgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.38} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#incomeWaveSvgGrad)" />
      <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface RingProps {
  value: number;
  size?: number;
  label: string;
  sublabel: string;
  color?: string;
  delay?: number;
}

function RingProgress({ value, size = 130, label, sublabel, color = "#009970", delay = 0.5 }: RingProps) {
  const r = size / 2 - 14;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 140 }}
      whileHover={{ scale: 1.05 }}
    >
      <div
        className="rounded-full bg-[#e2ede9] relative flex items-center justify-center"
        style={{
          width: size,
          height: size,
          boxShadow: "6px 6px 14px #bdc9c4, -6px -6px 14px #ffffff",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#bdc9c4"
            strokeWidth={9}
            opacity={0.35}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.6, ease: "easeOut", delay }}
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        </svg>
        <span
          className="font-bold text-[#1d3a2f] relative z-10"
          style={{ fontSize: size * 0.18 }}
        >
          {value}%
        </span>
      </div>
      <div className="text-center">
        <p className="text-[#1d3a2f] text-sm font-semibold leading-tight">{label}</p>
        <p className="text-[#7a9a8d] text-xs">{sublabel}</p>
      </div>
    </motion.div>
  );
}

export function IncomeRingSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

      {/* Monthly Income + wave */}
      <motion.div
        className="p-6 bg-[#e2ede9] rounded-3xl
          shadow-[12px_12px_24px_#bdc9c4,-12px_-12px_24px_#ffffff]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        whileHover={{ boxShadow: "16px 16px 32px #bdc9c4, -16px -16px 32px #ffffff" }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[#7a9a8d] text-xs font-medium uppercase tracking-wider mb-1">
              Monthly Income
            </p>
            <h3 className="text-[#1d3a2f] text-3xl font-bold">$54,239.00</h3>
            <p className="text-[#009970] text-xs font-semibold mt-1">+12.5% vs last month</p>
          </div>
          <RingProgress value={25} size={110} label="Budget Used" sublabel="75% remaining" color="#009970" delay={0.6} />
        </div>

        {/* Pure SVG wave — no recharts */}
        <div className="h-[100px] rounded-2xl overflow-hidden
          shadow-[inset_5px_5px_10px_#bdc9c4,inset_-5px_-5px_10px_#ffffff]">
          <WaveChart data={waveData} color="#009970" />
        </div>
      </motion.div>

      {/* Q4 Target Rings */}
      <motion.div
        className="p-6 bg-[#e2ede9] rounded-3xl
          shadow-[12px_12px_24px_#bdc9c4,-12px_-12px_24px_#ffffff]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        whileHover={{ boxShadow: "16px 16px 32px #bdc9c4, -16px -16px 32px #ffffff" }}
      >
        <div className="mb-6">
          <p className="text-[#7a9a8d] text-xs font-medium uppercase tracking-wider mb-1">Performance</p>
          <h3 className="text-[#1d3a2f] text-xl font-bold">Q4 Target Achievement</h3>
        </div>
        <div className="flex items-center justify-around">
          <RingProgress value={86} size={120} label="Revenue" sublabel="Goal met" color="#009970" delay={0.7} />
          <RingProgress value={62} size={120} label="Orders" sublabel="In progress" color="#00c4a0" delay={0.85} />
          <RingProgress value={23} size={120} label="Growth" sublabel="Q4 target" color="#007a5e" delay={1.0} />
        </div>
      </motion.div>

    </div>
  );
}
