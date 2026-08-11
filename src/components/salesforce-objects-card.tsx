import React from "react";
import { motion } from "motion/react";

export function SalesforceObjectsCard() {
  const items = [
    { label: "Opportunities", value: 44, color: "#2563eb" },
    { label: "Leads", value: 24, color: "#3b82f6" },
    { label: "Accounts", value: 18, color: "#60a5fa" },
    { label: "Contacts", value: 14, color: "#93c5fd" },
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
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] mb-4 font-display">
        Salesforce Objects Used
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Glowing 3D Glass Ring */}
        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          {/* Glass Base Ring */}
          <div className="absolute w-24 h-24 rounded-full border-[10px] border-slate-950/[0.04]" />
          
          <svg className="w-24 h-24 transform -rotate-90">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              <filter id="glassGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Opportunities (44%) */}
            <motion.circle
              cx="48"
              cy="48"
              r="38"
              stroke="url(#ringGrad)"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray="238.76"
              strokeDashoffset={238.76 - (238.76 * 44) / 100}
              strokeLinecap="round"
              filter="url(#glassGlow)"
              initial={{ strokeDashoffset: 238.76 }}
              animate={{ strokeDashoffset: 238.76 - (238.76 * 44) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>

          {/* Inner glass plate with active label */}
          <div className="absolute w-16 h-16 rounded-full bg-white/60 backdrop-blur-md flex flex-col items-center justify-center shadow-sm border border-white/80">
            <span className="text-base font-black text-black tracking-tight">44%</span>
            <span className="text-[7.5px] uppercase font-bold text-black/80 tracking-wider">Opps</span>
          </div>

          {/* Glowing cursor flare on circle */}
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]"
            animate={{
              rotate: 360,
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{
              width: "8px",
              height: "8px",
              transformOrigin: "center center",
              margin: "auto",
              left: 0, right: 0, top: 0, bottom: 0,
              transform: "translateY(-38px)",
            }}
          />
        </div>

        {/* Legend Key */}
        <div className="flex-1 w-full space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-black">{item.label}</span>
              </div>
              <span className="font-mono text-black">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
