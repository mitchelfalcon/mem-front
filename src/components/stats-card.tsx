import React, { useState } from "react";
import { motion } from "motion/react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}

export function StatsCard({ title, value, change, icon, trend }: StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="p-6 bg-[#e2ede9] rounded-3xl cursor-pointer
        shadow-[12px_12px_24px_#bdc9c4,-12px_-12px_24px_#ffffff]
        transition-shadow"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: 1.02,
        boxShadow: "16px 16px 32px #bdc9c4, -16px -16px 32px #ffffff"
      }}
      whileTap={{
        scale: 0.98,
        boxShadow: "inset 8px 8px 16px #bdc9c4, inset -8px -8px 16px #ffffff"
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          className="p-4 bg-[#e2ede9] rounded-2xl
            shadow-[inset_6px_6px_12px_#bdc9c4,inset_-6px_-6px_12px_#ffffff]"
          animate={{
            rotate: isHovered ? [0, -10, 10, -10, 0] : 0
          }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-[#4a7268]"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
        </motion.div>
        <motion.span
          className={`px-3 py-1 rounded-full text-sm ${
            trend === "up"
              ? "text-[#009970] bg-[#e2ede9] shadow-[inset_2px_2px_4px_#bdc9c4,inset_-2px_-2px_4px_#ffffff]"
              : "text-[#ef4444] bg-[#e2ede9] shadow-[inset_2px_2px_4px_#bdc9c4,inset_-2px_-2px_4px_#ffffff]"
          }`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {change}
        </motion.span>
      </div>
      <motion.p
        className="text-[#7a9a8d] mb-1 text-sm"
        animate={{ opacity: isHovered ? 0.7 : 1 }}
      >
        {title}
      </motion.p>
      <motion.p
        className="text-[#1d3a2f] text-2xl font-bold"
        animate={{
          scale: isHovered ? 1.05 : 1,
          color: isHovered ? "#009970" : "#1d3a2f"
        }}
        transition={{ duration: 0.3 }}
      >
        {value}
      </motion.p>
    </motion.div>
  );
}
