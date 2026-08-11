import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Shield, RefreshCw, X, Radio, Activity } from "lucide-react";

interface Worker {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  status: "active" | "idle" | "error";
  activeTask: string;
  progress: number;
  syncObject: string;
  voiceLevel: number[];
}

export function WorkerSessionsCard() {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: "sofia",
      name: "Sofía Martínez",
      role: "API Integration Lead",
      avatar: "SM",
      color: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      status: "active",
      activeTask: "Syncing Salesforce Accounts with Voice DB",
      progress: 68,
      syncObject: "Account",
      voiceLevel: [2, 5, 8, 3, 2],
    },
    {
      id: "carlos",
      name: "Carlos Ortega",
      role: "Salesforce UX Designer",
      avatar: "CO",
      color: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      status: "active",
      activeTask: "Reviewing layout constraints and fonts",
      progress: 42,
      syncObject: "Opportunity",
      voiceLevel: [4, 2, 6, 7, 3],
    },
    {
      id: "ana",
      name: "Ana Beltrán",
      role: "Data Cloud Architect",
      avatar: "AB",
      color: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
      status: "active",
      activeTask: "Deploying GDS Movement algorithms",
      progress: 89,
      syncObject: "Lead",
      voiceLevel: [1, 3, 2, 4, 1],
    },
    {
      id: "luis",
      name: "Luis Medina",
      role: "Security Compliance",
      avatar: "LM",
      color: "linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)",
      status: "active",
      activeTask: "Auditing Voice Safety Veto limits",
      progress: 95,
      syncObject: "Contact",
      voiceLevel: [3, 4, 3, 5, 4],
    },
  ]);

  // Live state modification simulation (updating tasks and progress in real-time!)
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkers((prev) =>
        prev.map((w) => {
          // Increment progress
          let nextProgress = w.progress + Math.floor(Math.random() * 5) + 1;
          if (nextProgress > 100) nextProgress = 10;

          // Randomly change or rotate active tasks
          let nextTask = w.activeTask;
          const tasksForWorker: Record<string, string[]> = {
            sofia: [
              "Mapping voice transcript to Lead record",
              "Synchronizing Salesforce Accounts with Voice DB",
              "Verifying REST API status thresholds",
            ],
            carlos: [
              "Optimizing dashboard viewport grids",
              "Reviewing typography and layout constraints",
              "Fine-tuning neomorphic double shadows",
            ],
            ana: [
              "Testing Colab neural weights integration",
              "Deploying GDS Movement algorithms",
              "Compiling high-fidelity SVG paths",
            ],
            luis: [
              "Auditing Voice Safety Veto limits",
              "Inspecting Salesforce class authorization",
              "Enforcing token security guidelines",
            ],
          };

          if (Math.random() > 0.7) {
            const list = tasksForWorker[w.id];
            nextTask = list[Math.floor(Math.random() * list.length)];
          }

          // Randomize voice bars
          const nextVoice = w.voiceLevel.map(() => Math.floor(Math.random() * 8) + 1);

          return {
            ...w,
            progress: nextProgress,
            activeTask: nextTask,
            voiceLevel: nextVoice,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="p-3.5 rounded-2xl h-full flex flex-col"
      style={{
        background: "rgba(240, 246, 255, 0.48)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.7)",
        boxShadow: "14px 14px 32px rgba(150, 175, 205, 0.32), -14px -14px 32px rgba(255, 255, 255, 0.95), inset 3px 3px 6px rgba(255, 255, 255, 0.8), inset -3px -3px 6px rgba(150, 175, 205, 0.15)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] font-display flex items-center gap-2">
          <Users className="w-4 h-4 text-[#2563eb]" /> Voice CRM Sync Sessions
        </h3>
        <span className="text-[9px] font-mono font-bold bg-[#2563eb]/10 text-[#2563eb] px-2 py-0.5 rounded-full">
          4 LIVE WORKERS
        </span>
      </div>

      <p className="text-[10px] text-black mb-2.5 leading-relaxed font-semibold">
        Active Salesforce operators executing voice commands. Click on any avatar for deep telemetry.
      </p>

      {/* Workers List */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="flex items-center justify-between p-1.5 rounded-xl hover:bg-white/40 transition-all cursor-pointer border border-transparent hover:border-white/60 hover:shadow-[4px_4px_12px_rgba(165,185,210,0.12)]"
            onClick={() => setSelectedWorker(worker)}
          >
            <div className="flex items-center gap-3">
              {/* Interactive Avatar Container */}
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs relative overflow-hidden shadow-sm"
                  style={{ background: worker.color }}
                >
                  {worker.avatar}
                  {/* Subtle glossy glass highlight on avatar */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                </div>
                {/* Real-time status pulse indicator */}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#2563eb] border-2 border-white animate-pulse" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black text-[#1e3a8a]">{worker.name}</span>
                  <span className="text-[8px] uppercase font-bold text-black bg-slate-100 px-1 py-0.2 rounded-md">
                    {worker.role.split(" ")[0]}
                  </span>
                </div>
                {/* Real-time updating task description */}
                <p className="text-[9.5px] text-black font-medium truncate w-36 sm:w-48 lg:w-36 mt-0.5">
                  {worker.activeTask}
                </p>
              </div>
            </div>

            {/* Small active voice visualizer bars next to avatar */}
            <div className="flex gap-[2px] items-end h-3 px-1">
              {worker.voiceLevel.map((level, i) => (
                <motion.div
                  key={i}
                  className="w-[2.5px] rounded-sm bg-[#2563eb]"
                  style={{ height: `${level * 1.5}px` }}
                  animate={{ height: [`${level * 1.5}px`, `${Math.max(2, level * 1.5 - 2)}px`, `${level * 1.5}px`] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Telemetry Overlay Modal */}
      <AnimatePresence>
        {selectedWorker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-sm rounded-3xl p-6 relative overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 20px 50px rgba(15, 23, 42, 0.15)",
              }}
            >
              <button
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                onClick={() => setSelectedWorker(null)}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-black relative overflow-hidden shadow-md"
                  style={{ background: selectedWorker.color }}
                >
                  {selectedWorker.avatar}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#1e3a8a]">{selectedWorker.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{selectedWorker.role}</p>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-200/50 pt-3 text-xs">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Active voice task</span>
                  <p className="font-bold text-[#1e3a8a] text-[11px] leading-tight bg-blue-50/50 p-2 rounded-xl border border-blue-100/40">
                    {selectedWorker.activeTask}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">CRM Object</span>
                    <span className="font-bold text-[#1e3a8a] block mt-0.5">{selectedWorker.syncObject}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Token ID</span>
                    <span className="font-mono font-bold text-slate-600 block mt-0.5 text-[9.5px]">
                      xSF_98{selectedWorker.id.toUpperCase()}22
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Task completion progress</span>
                    <span className="font-mono text-[10px] font-black text-[#1e3a8a]">{selectedWorker.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedWorker.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-[#1e3a8a] text-white text-[11px] font-bold uppercase shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  onClick={() => alert(`Sincronización manual forzada para ${selectedWorker.name}`)}
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "5s" }} /> Sync Session
                </button>
                <button
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold uppercase active:scale-95 transition-all"
                  onClick={() => setSelectedWorker(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
