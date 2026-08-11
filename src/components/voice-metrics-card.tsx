import React from "react";
import { motion } from "motion/react";
import { MoreHorizontal } from "lucide-react";

export function VoiceMetricsCard() {
  // Height values matching the photo
  const metrics = [
    { day: "Wed", value: 85, height: "76%" },
    { day: "Thu", value: 45, height: "42%" },
    { day: "Fri", value: 72, height: "68%" },
    { day: "Sat", value: 15, height: "15%" },
    { day: "Sun", value: 10, height: "10%" },
  ];

  return (
    <div
      className="p-5 rounded-3xl"
      style={{
        background: "rgba(240, 246, 255, 0.48)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.7)",
        boxShadow: "14px 14px 32px rgba(150, 175, 205, 0.32), -14px -14px 32px rgba(255, 255, 255, 0.95), inset 3px 3px 6px rgba(255, 255, 255, 0.8), inset -3px -3px 6px rgba(150, 175, 205, 0.15)",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] font-display">
          Voice Interaction Metrics
        </h3>
        <button className="p-1.5 rounded-full hover:bg-white/40 transition-colors text-slate-400 hover:text-slate-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* 5 Glassy 3D Cylinders */}
      <div className="flex justify-between items-end h-40 px-2 relative mb-2">
        {/* Background Grid Lines for Glass feel */}
        <div className="absolute inset-x-0 bottom-0 top-2 flex flex-col justify-between pointer-events-none opacity-[0.06]">
          <div className="border-b border-[#1e3a8a] w-full" />
          <div className="border-b border-[#1e3a8a] w-full" />
          <div className="border-b border-[#1e3a8a] w-full" />
          <div className="border-b border-[#1e3a8a] w-full" />
        </div>

        {metrics.map((m, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 h-full group">
            <div className="relative w-7 h-full flex items-end justify-center">
              {/* The 3D Glass Cylinder Tube */}
              <div className="absolute inset-x-0 bottom-0 top-0 rounded-full bg-slate-950/[0.03] border border-white/40" />

              {/* Active filled cylinder */}
              <motion.div
                className="absolute inset-x-0 bottom-0 rounded-full cursor-pointer overflow-hidden origin-bottom"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.2, delay: idx * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  height: m.height,
                  background: "linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)",
                  boxShadow: "inset -2px 0 6px rgba(0,0,0,0.2), inset 2px 0 6px rgba(255,255,255,0.4), 0 4px 12px rgba(37,99,235,0.2)",
                }}
              >
                {/* 3D Cylinder gloss highlight layer */}
                <div className="absolute inset-y-0 left-[2px] w-[3px] bg-white/40 rounded-full blur-[0.5px]" />
                <div className="absolute inset-y-0 right-[2px] w-[2px] bg-black/10 rounded-full" />

                {/* Shimmer light effect running up */}
                <motion.div
                  className="absolute inset-x-0 h-8 bg-gradient-to-b from-white/20 to-transparent"
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: idx * 0.4 }}
                />
              </motion.div>

              {/* 3D Glass top ellipse cap for full 3D effect */}
              <motion.div
                className="absolute w-7 h-[7px] rounded-full z-10 border border-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                style={{
                  bottom: `calc(${m.height} - 3px)`,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(59,130,246,0.8) 100%)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              />
            </div>
            <span className="text-[10px] font-extrabold mt-2.5 text-black group-hover:text-[#2563eb] transition-colors">
              {m.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
