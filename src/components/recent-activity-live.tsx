import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ArrowDownRight, X, Sparkles } from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: "success" | "warning" | "info";
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: "1", title: "New user registered", time: "2 min ago", type: "success" },
  { id: "2", title: "Order #1234 completed", time: "15 min ago", type: "success" },
  { id: "3", title: "Server response time increased", time: "1 hour ago", type: "warning" },
  { id: "4", title: "Payment processed", time: "2 hours ago", type: "success" },
];

const NEW_LIVE_EVENTS: Omit<ActivityItem, "id">[] = [
  { title: "Lead converted in Salesforce", time: "Just now", type: "success" },
  { title: "AWU_Ledger sync complete", time: "Just now", type: "success" },
  { title: "Safety Veto limits audit: OK", time: "Just now", type: "info" },
  { title: "Voice intent matched (98.2% conf)", time: "Just now", type: "success" },
  { title: "API latency anomaly detected", time: "Just now", type: "warning" },
  { title: "Salesforce schema mapping updated", time: "Just now", type: "success" },
  { title: "Data Cloud ingestion batch #839 completed", time: "Just now", type: "success" },
  { title: "New operator logged in: Sarah M.", time: "Just now", type: "info" },
];

export function RecentActivityLive() {
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);

  useEffect(() => {
    // Periodically insert a new live event to make it feel like real-time updates
    const interval = setInterval(() => {
      // Choose a random event
      const randomEvent = NEW_LIVE_EVENTS[Math.floor(Math.random() * NEW_LIVE_EVENTS.length)];
      
      // Generate a unique ID
      const newId = Date.now().toString();
      
      setActivities((prev) => {
        // Build new list, shifting times of previous items
        const updatedPrev = prev.map((item, idx) => {
          // Progressively make times older
          if (idx === 0) return { ...item, time: "4 min ago" };
          if (idx === 1) return { ...item, time: "18 min ago" };
          if (idx === 2) return { ...item, time: "1 hour ago" };
          return { ...item, time: `${idx + 1} hours ago` };
        });
        
        // Add new item at the top and keep at most 4 items for perfect spacing without overflow
        return [{ id: newId, ...randomEvent }, ...updatedPrev].slice(0, 4);
      });
    }, 4500); // update every 4.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="p-3.5 rounded-2xl flex flex-col justify-between min-h-[210px] h-full relative overflow-hidden"
      style={{
        background: "rgba(240, 246, 255, 0.48)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.7)",
        boxShadow: "14px 14px 32px rgba(150, 175, 205, 0.32), -14px -14px 32px rgba(255, 255, 255, 0.95), inset 3px 3px 6px rgba(255, 255, 255, 0.8), inset -3px -3px 6px rgba(150, 175, 205, 0.15)",
      }}
    >
      {/* Header section with Recent Activity title */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-3 bg-[#0ea5e9] rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-display">
            Recent Activity
          </span>
        </div>
        <span className="text-[8px] font-black uppercase font-mono tracking-widest text-[#2563eb] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 shadow-sm flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-[#2563eb] animate-pulse" />
          LIVE UPDATING
        </span>
      </div>

      {/* Inner card representing the visual frame from the screenshot */}
      <div 
        className="flex-1 p-2 rounded-xl flex flex-col justify-between"
        style={{
          background: "rgba(240, 245, 242, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
        }}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h4 className="text-[11px] font-bold text-[#1e3a8a] leading-none">Recent Activity</h4>
            <span className="text-[8px] text-slate-400 font-bold mt-0.5 block">Latest updates</span>
          </div>
          <X className="w-3 h-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" />
        </div>

        {/* List of activity cards with dynamic Framer Motion layout */}
        <div className="relative flex-1 flex flex-col gap-2 pr-2.5">
          {/* Vertical line timeline asset on the right */}
          <div className="absolute right-0 top-1 bottom-1 w-[2px] bg-slate-850/80 rounded" />

          <AnimatePresence mode="popLayout">
            {activities.map((act) => (
              <motion.div
                key={act.id}
                layout
                initial={{ opacity: 0, x: -15, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 15, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30
                }}
                className="flex items-center gap-3 p-2 rounded-2xl bg-white/70 shadow-[2px_2px_6px_rgba(165,185,210,0.15)] border border-white/90"
              >
                {/* Extruded Glass Icon Wrapper */}
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-white border border-white"
                  style={{
                    boxShadow: "3px 3px 6px rgba(165, 185, 210, 0.2), -3px -3px 6px rgba(255, 255, 255, 0.9)",
                  }}
                >
                  {act.type === "warning" ? (
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                  ) : (
                    <ArrowUpRight className={`w-3.5 h-3.5 ${act.type === "info" ? "text-sky-500" : "text-emerald-500"}`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-700 block truncate leading-tight">
                    {act.title}
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold block mt-0.5 leading-none">
                    {act.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
