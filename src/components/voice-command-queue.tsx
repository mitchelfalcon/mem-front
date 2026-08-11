import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { List, CheckCircle2, Play, Trash2, RefreshCw } from "lucide-react";

interface CommandItem {
  id: string;
  command: string;
  status: "active" | "completed" | "pending";
  timestamp: string;
}

export function VoiceCommandQueue() {
  const [commands, setCommands] = useState<CommandItem[]>([
    { id: "1", command: "Create Opportunity Chart", status: "completed", timestamp: "12:35" },
    { id: "2", command: "Map Lead Status Field", status: "active", timestamp: "12:38" },
    { id: "3", command: "Filter Region by Finanzas", status: "active", timestamp: "12:40" },
    { id: "4", command: "Lock Safety Veto System", status: "pending", timestamp: "12:42" },
  ]);

  const toggleCommandStatus = (id: string) => {
    setCommands((prev) =>
      prev.map((cmd) => {
        if (cmd.id === id) {
          const nextStatus =
            cmd.status === "active"
              ? "completed"
              : cmd.status === "completed"
              ? "pending"
              : "active";
          return { ...cmd, status: nextStatus };
        }
        return cmd;
      })
    );
  };

  const clearCompleted = () => {
    setCommands((prev) => prev.filter((cmd) => cmd.status !== "completed"));
  };

  return (
    <div
      className="p-3.5 rounded-2xl h-full flex flex-col justify-between"
      style={{
        background: "rgba(240, 246, 255, 0.48)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.7)",
        boxShadow: "14px 14px 32px rgba(150, 175, 205, 0.32), -14px -14px 32px rgba(255, 255, 255, 0.95), inset 3px 3px 6px rgba(255, 255, 255, 0.8), inset -3px -3px 6px rgba(150, 175, 205, 0.15)",
      }}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] font-display flex items-center gap-1.5">
            <List className="w-4 h-4 text-[#2563eb]" /> Voice Command Queue
          </h3>
          <span className="text-[9px] font-mono font-bold bg-[#2563eb]/10 text-[#2563eb] px-2 py-0.5 rounded-full">
            {commands.length} EN COLA
          </span>
        </div>

        <p className="text-[10px] text-black/60 mb-2.5 font-semibold">
          Incoming agent commands. Click on any command to cycle through its status.
        </p>

        {/* Command list */}
        <div className="space-y-2 max-h-[145px] overflow-y-auto pr-0.5 scrollbar-thin">
          <AnimatePresence initial={false}>
            {commands.map((cmd) => {
              const isActive = cmd.status === "active";
              const isCompleted = cmd.status === "completed";

              return (
                <motion.div
                  key={cmd.id}
                  layout
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center justify-between p-2 rounded-xl border border-transparent transition-all cursor-pointer hover:bg-white/40 hover:border-white/60 hover:shadow-[2px_2px_8px_rgba(165,185,210,0.08)]"
                  onClick={() => toggleCommandStatus(cmd.id)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    ) : isActive ? (
                      <div className="relative flex h-2 w-2 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
                    )}

                    <div className="min-w-0">
                      <p
                        className={`text-[10.5px] font-bold leading-tight truncate ${
                          isCompleted ? "text-slate-400 line-through" : "text-[#1e3a8a]"
                        }`}
                      >
                        {cmd.command}
                      </p>
                      <span className="text-[8px] font-mono text-slate-400">{cmd.timestamp}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-600"
                        : isActive
                        ? "bg-blue-500/10 text-blue-600"
                        : "bg-slate-300/20 text-slate-500"
                    }`}
                  >
                    {cmd.status}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Pill-shaped soft neumorphic buttons */}
      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-300/10">
        <motion.button
          onClick={clearCompleted}
          className="flex-1 py-1.5 px-2.5 rounded-full flex items-center justify-center gap-1.5 border font-extrabold text-[9px] uppercase tracking-wider select-none outline-none transition-all"
          style={{
            background: "rgba(241, 245, 249, 0.8)",
            borderColor: "rgba(203, 213, 225, 0.5)",
            color: "#475569",
            boxShadow: "3px 3px 6px rgba(165, 185, 210, 0.25), -2px -2px 6px rgba(255,255,255,0.9)",
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.8), 2px 2px 4px rgba(165, 185, 210, 0.1)",
          }}
          whileTap={{
            scale: 0.97,
            boxShadow: "inset 2px 2px 5px rgba(165, 185, 210, 0.2), inset -2px -2px 5px rgba(255,255,255,0.9)",
          }}
        >
          <Trash2 className="w-3 h-3 text-[#b91c1c]" />
          <span>Clear Done</span>
        </motion.button>

        <motion.button
          onClick={() => {
            // Simulate adding a new voice command
            const newCmd: CommandItem = {
              id: Date.now().toString(),
              command: `Voice Command #${Math.floor(Math.random() * 900) + 100}`,
              status: "active",
              timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            };
            setCommands((prev) => [...prev, newCmd]);
          }}
          className="flex-1 py-1.5 px-2.5 rounded-full flex items-center justify-center gap-1.5 border font-extrabold text-[9px] uppercase tracking-wider select-none outline-none transition-all text-white"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            borderColor: "rgba(37, 99, 235, 0.25)",
            boxShadow: "3px 3px 6px rgba(37, 99, 235, 0.25), -2px -2px 6px rgba(255,255,255,0.9)",
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.4), 2px 2px 4px rgba(37, 99, 235, 0.15)",
          }}
          whileTap={{
            scale: 0.97,
            boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          <RefreshCw className="w-3 h-3 text-white" />
          <span>Add Cmd</span>
        </motion.button>
      </div>
    </div>
  );
}
